// OpenCV C 卷（40 题：标定/跟踪/综合）+ 控制补充卷（20 题）
(function (global) {
  "use strict";
  var DB = global.PRACTICE_DB = global.PRACTICE_DB || {};
  var C = H.code;

  /* ===== OpenCV C 卷 40 题 ===== */
  DB["cv-c01"] = { level: 2, title: "畸变类型识别", body: "图像边缘的直线弯成弧线。径向畸变还是切向？k1/k2/k3 各管什么？", hint: "桶形/枕形；低阶近中心高阶边缘。", solution: C("text", "ans.txt", `边缘弯曲 = 径向畸变为主。k1（一阶）：主体畸变量级；k2（二阶）：边缘修正；k3（三阶）：广角才显著，普通镜头拟合时可以固定为 0 防过拟合\n切向畸变 p1/p2：镜头和传感器不平行造成——直线在边缘「斜着弯」不对称\n判断口诀：对称弯=径向，不对称歪=切向\nOpenCV 标定返回 5 参数 [k1,k2,p1,p2,k3]，undistort 一次全修。`) };

  DB["cv-c02"] = { level: 2, title: "标定板选择", body: "棋盘格 vs 圆点网格（ChArUco 圆点）标定板怎么选？各自坑？", hint: "角点精度/遮挡。", solution: C("text", "ans.txt", `棋盘格：findChessboardCorners 成熟稳定；坑——必须完整露出整个棋盘（边缘被挡一半就检测失败）\n圆点（ChArUco/圆栅）：亚像素圆心拟合精度高 20~30%，支持部分遮挡（ID 化角点）；坑——打印变形/反光影响圆心，需要漫射光照\nRM 推荐：圆点板（工业级 10 元一张铝合金背板）——贴牢防翘曲是第一要务，纸打印的受潮变形标定直接废。`) };

  DB["cv-c03"] = { level: 3, featured: true, title: "手写：标定质量可视化", body: "标定后写验证脚本：随机取 5 张标定图，把角点检测位置和重投影位置画在同一图上（绿=检测 红=重投影），偏差肉眼可见即失败。", hint: "projectPoints 用外参重投影。", solution: C("python", "verify_calib.py", `import cv2, numpy as np, glob

# 已有标定结果
K = np.load("K.npy"); dist = np.load("dist.npy")
pattern = (9, 6); square = 25.0

objp = np.zeros((54,3), np.float32)
objp[:,:2] = np.mgrid[0:9,0:6].T.reshape(-1,2) * square

for i, f in enumerate(sorted(glob.glob("calib_*.jpg"))[:5]):
    img = cv2.imread(f)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    ok, corners = cv2.findChessboardCorners(gray, pattern, None)
    if not ok: continue
    corners = cv2.cornerSubPix(gray, corners, (11,11), (-1,-1),
        (cv2.TERM_CRITERIA_EPS+cv2.TERM_CRITERIA_MAX_ITER, 30, 1e-3))
    # 用标定结果反算该图外参 → 重投影角点
    ok2, rvec, tvec = cv2.solvePnP(objp, corners, K, dist)
    reproj, _ = cv2.projectPoints(objp, rvec, tvec, K, dist)
    # 画对比
    vis = img.copy()
    for d, r in zip(corners.reshape(-1,2), reproj.reshape(-1,2)):
        cv2.circle(vis, tuple(d.astype(int)), 4, (0,255,0), -1)  # 检测=绿
        cv2.circle(vis, tuple(r.astype(int)), 3, (0,0,255), 2)   # 重投影=红
    err = np.linalg.norm(corners.reshape(-1,2)-reproj.reshape(-1,2), axis=1).mean()
    cv2.putText(vis, f"err={err:.2f}px", (30,50), 0, 1.2, (255,255,0), 2)
    cv2.imwrite(f"verify_{i}.png", vis)
    print(f"{f}: 重投影误差 {err:.2f} px {'OK' if err<0.5 else 'FAIL'}")`) };

  DB["cv-c04"] = { level: 3, title: "手眼标定是什么", body: "相机装在云台上，怎么标「相机相对云台旋转中心的固定变换」？eye-in-hand 手眼标定原理一句话。", hint: "AX=XB。", solution: C("text", "ans.txt", `相机随云台动（eye-in-hand）：标定相机到云台法兰的固定变换 T_cam→gimbal\n原理 AX=XB：让云台转到多个已知角度（编码器记录 A），每次拍静止标定板（解出相机位姿 B）——解方程组把固定变换 X 钓出来\n工具：calibrateHandEye() 一行调用，输入若干 (R_gimbal, R_cam) 对\nRM 用途：视觉测的目标是「相机系」的——必须经手眼变换转到「云台系」才能算射击角度\n没做手眼标定的自瞄 = 瞄准永远歪一个固定量，且随目标方位变。`) };

  DB["cv-c05"] = { level: 3, featured: true, title: "手写：手眼标定流程", body: "写手眼标定实验 SOP + 数据采集脚本框架：转云台 8 个姿态拍标定板，解 camera-gimbal 变换，验证精度。", hint: "solvePnP 得相机位姿 + 编码器得云台角度。", solution: C("python", "handeye.py", `import cv2, numpy as np

# ===== 数据采集 SOP =====
# 1. 标定板固定在场地(静止, 不能有任何晃动)
# 2. 云台依次转到 8+ 个差异大的姿态:
#    yaw: -30/-10/+10/+30 x pitch: -20/0/+20 交叉组合
# 3. 每个姿态记录: 编码器读数(yaw,pitch) + 拍一张照片
# 4. 全程机器人底盘绝对静止

# ===== 求解 =====
K = np.load("K.npy"); dist = np.load("dist.npy")
pattern = (9,6); square = 25.0
objp = np.zeros((54,3), np.float32)
objp[:,:2] = np.mgrid[0:9,0:6].T.reshape(-1,2)*square

R_g2b_list, R_c2b_list = [], []   # gimbal→board, cam→board
poses = [(0,0),(10,0),(-10,20),(10,-20),(30,10),(-30,-10),(20,20),(-20,-20)]
for yaw, pitch in poses:
    img = cv2.imread(f"he_{yaw}_{pitch}.jpg")
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    ok, corners = cv2.findChessboardCorners(gray, pattern, None)
    if not ok: continue
    ok, rvec, tvec = cv2.solvePnP(objp, corners, K, dist)
    R_cam2board, _ = cv2.Rodrigues(rvec)
    # 云台姿态: 世界系→云台系 的旋转(编码器读数)
    Rz = cv2.Rodrigues(np.array([0,0,np.radians(yaw)]))[0]
    Rx = cv2.Rodrigues(np.array([np.radians(pitch),0,0]))[0]
    R_gimbal2world = Rz @ Rx
    R_g2b_list.append(R_gimbal2world.T)       # board→gimbal 系约定
    R_c2b_list.append(R_cam2board)

# OpenCV 手眼求解 (AX=XB)
R_cg, t_cg = cv2.calibrateHandEye(
    R_g2b_list, R_c2b_list,
    method=cv2.CALIB_HAND_EYE_TSAI)
print("相机→云台旋转:\\n", np.round(R_cg,4))
print("相机→云台平移:", t_cg.ravel())

# ===== 验证 =====
# 用一个没参与标定的姿态: 预测标定板在图像中的位置 vs 实拍
# 误差 < 3 像素 = 手眼标定合格`) };

  DB["cv-c06"] = { level: 3, title: "静止目标 vs 移动目标标定", body: "为什么手眼标定要求标定板绝对静止？标定板微动 2mm 会怎样？", hint: "AX=XB 假设 B 只来自相机运动。", solution: C("text", "ans.txt", `AX=XB 的前提：B（相机看到的标定板位姿变化）完全由 A（云台运动）造成。标定板自己动了 → B 里混入板运动 → 解出的 X 被污染\n板微动 2mm 的影响：相机距板 1m 时 2mm 平移 ≈ 2mrad ≈ 看起来像云台没转到位的误差——手眼变换里混进假旋转角\n防御：①板用磁吸/胶带双重固定在场地结构上 ②数据采集脚本先做板静止自检（连续两帧检测板位置差 <0.5px 才继续）③解完看残差，>1px 的姿态组剔除重采。`) };

  DB["cv-c07"] = { level: 2, title: "solvePnP 的四点要求", body: "PnP 用装甲板四点解算。四个点怎么分布精度最好？为什么不能用四点共线？", hint: "透视约束需要面内分布。", solution: C("text", "ans.txt", `最佳分布：四点张满目标面积（装甲板四角），矩形长宽比接近实际（不要退化成细长条）\n共线失效原因：PnP 解「6 自由度位姿」需要面内的二维约束——四点共线时面内旋转（绕视线轴）不可观，解不唯一（两解重合成无穷解）\n实际装甲板：两灯条中心 + 上下沿共四点，天然矩形分布 ✓\n精度提升：用灯条「四个角」而不是「中心点」（点数更多用 IPPE 拟合更稳）。`) };

  DB["cv-c08"] = { level: 3, title: "PnP 多解歧义", body: "solvePnP 有时返回两个姿态解（平面目标的反射歧义）。怎么选？", hint: "重投影误差小的+物理合理。", solution: C("text", "ans.txt", `平面四点 PnP 理论上有两解（镜像）——IPPE 方法直接返回两个，reprojectionError 分高低\n选择三重判据：\n①重投影误差小者优先（主判据）\n②物理合理性：装甲板朝向不会背对相机 180°（云台不可能转到那）\n③时序一致性：和上一帧姿态跳变 <30°——两解交替跳变是典型病症\n保险写法：两解都算重投影，误差差 <0.1px（太接近）时用上一帧姿态插值\n不处理双解 = 自瞄周期性「抽风」的隐形根源。`) };

  DB["cv-c09"] = { level: 3, featured: true, title: "手写：PnP 精度距离曲线", body: "实验测 PnP 距离精度 vs 目标距离：把装甲板放 2/3/4/5/6m，每点解算 100 次统计误差。画精度-距离曲线并给「可靠解算距离上限」。", hint: "像素误差角放大效应。", solution: C("python", "pnp_acc.py", `import cv2, numpy as np

K = np.array([[820,0,320],[0,815,240],[0,0,1]], np.float32)
obj = np.array([[115,27.5,0],[115,-27.5,0],[-115,-27.5,0],[-115,27.5,0]], np.float32)

def sim_pnp(dist_m, px_noise=0.5):
    """距离 dist_m 处, 角点像素加噪声后解算"""
    # 生成真实像素(针孔模型+目标倾斜5°)
    R_true = cv2.Rodrigues(np.array([0.0, 0.09, 0.0]))[0]
    t_true = np.array([[0],[0],[dist_m*1000]])
    pts,_ = cv2.projectPoints(obj, R_true, t_true, K, None)
    pts = pts.reshape(-1,2) + np.random.normal(0, px_noise, (4,2))
    ok, rv, tv = cv2.solvePnP(obj, pts.astype(np.float32), K, None,
                              flags=cv2.SOLVEPNP_IPPE)
    return np.linalg.norm(tv)  # 解算距离

for d in [2,3,4,5,6,7,8]:
    errs = [abs(sim_pnp(d)-d*1000) for _ in range(100)]
    e = np.mean(errs)
    print(f"{d}m: 平均误差 {e:6.1f}mm ({e/10:.1f}cm)  "
          f"{'OK' if e<30 else '⚠ 不可靠'}")
# 典型结果: 2m误差~8mm, 6m~35mm, 8m~60mm+
# → 可靠上限按需求定: 命中需要<5cm → 解算距离上限 6~7m
# 误差∝距离平方: 像素角误差固定,远距离同样像素误差=更大横向误差`) };

  DB["cv-c10"] = { level: 3, title: "相机内参老化", body: "赛季中镜头被磕了一下，PnP 距离突然偏 10%。内参还能信吗？怎么现场快速诊断？", hint: "直线检查。", solution: C("text", "ans.txt", `镜头受冲击后镜片组位移 → 内参（焦距/主点/畸变）变了——旧标定作废\n现场快速诊断（3 分钟）：拍一张带直线的场景（场地边线/门框），undistort 后看直线还直不直；再拍已知距离的标定物看 PnP 距离偏差\n应急处理：①重跑标定（棋盘格随身带，10 分钟）②只重标畸变项近似（焦距通常变化小）\n预防：镜头加保护罩；标定结果记录「标定日期+相机序列号」，跌落后强制重标。`) };

  DB["cv-c11"] = { level: 2, title: "OpenCV 版本兼容坑", body: "队里不同电脑 opencv 3.4 和 4.8 混用，findContours 返回值不同。列出两个大版本差异。", hint: "返回值数量/专利算法。", solution: C("text", "ans.txt", `①findContours：3.x 返回 (image, contours, hierarchy) 三元组；4.x 返回 (contours, hierarchy) 二元组——解包写错直接崩\n②SIFT/SURF：3.4.2+ 移到 xfeatures2d（专利）；4.4 起回归主库但 API 变了\n统一方案：requirements.txt 钉死版本（opencv-python==4.8.x），CI 里跑同一版本\n代码里写版本断言：cv2.__version__.startswith(\"4\") 否则报错——比环境漂移后莫名 bug 强。`) };

  DB["cv-c12"] = { level: 3, title: "VideoCapture 后端选择", body: "Linux 下 cap = cv2.VideoCapture(0, cv2.CAP_V4L2) 的第二个参数有什么用？", hint: "指定后端。", solution: C("text", "ans.txt", `指定后端：默认自动猜（FFMPEG/V4L2/GSTREAMER），猜错时行为诡异（打不开/帧率不对/格式错）\nLinux 机器人：明确 CAP_V4L2——直接走内核驱动，延迟最低、支持 set 参数最全\nRTSP 网络流：CAP_FFMPEG；GStreamer 管线（要硬解时）：CAP_GSTREAMER\n坑：同一代码不同后端能跑但参数语义不同（V4L2 的 EXPOSURE 单位是 100μs 步）——换后端后所有 set 参数要重新验证。`) };

  DB["cv-c13"] = { level: 3, featured: true, title: "手写：相机自检脚本", body: "写比赛前相机自检：打开→读 30 帧→检查帧率/分辨率/亮度分布/时间戳单调性，30 秒出健康报告。", hint: "失败项给处置建议。", solution: C("python", "cam_check.py", `import cv2, time, numpy as np

def camera_selftest(cam_id=0, n=30):
    report = []
    cap = cv2.VideoCapture(cam_id, cv2.CAP_V4L2)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
    cap.set(cv2.CAP_PROP_FPS, 60)

    # 1. 打开
    report.append(("打开相机", cap.isOpened(),
                   "检查 USB/权限: ls /dev/video*"))

    frames, ts = [], []
    t0 = time.time()
    for _ in range(n+5):
        ok, f = cap.read()
        if ok and f is not None:
            frames.append(f); ts.append(time.time())
    cap.release()
    if not frames:
        for name, ok, _ in report: print(f"[{'PASS' if ok else 'FAIL'}] {name}")
        return False

    # 2. 帧率
    fps = len(ts) / (ts[-1]-ts[0])
    report.append(("帧率≥50", fps >= 50, f"实测{fps:.1f}fps,查USB带宽/曝光"))

    # 3. 分辨率
    h, w = frames[-1].shape[:2]
    report.append(("分辨率1280x720", (w,h)==(1280,720), f"实际{w}x{h}"))

    # 4. 亮度
    gray = cv2.cvtColor(frames[-1], cv2.COLOR_BGR2GRAY)
    report.append(("亮度正常(10~200)", 10 < gray.mean() < 200,
                   f"均值{gray.mean():.0f},查镜头盖/曝光"))

    # 5. 时间戳单调
    mono = all(b-a > 0 for a,b in zip(ts,ts[1:]))
    report.append(("时间戳单调", mono, "驱动异常,重启"))

    # 6. 帧间变化(静止场景应≈0,全0=冻结帧)
    diff = np.abs(frames[-1].astype(int)-frames[-5].astype(int)).mean()
    report.append(("画面未冻结", 0.1 < diff or diff > 10,
                   "diff≈0可能镜头被挡,>10可能振动"))

    ok_all = True
    for name, ok, hint in report:
        print(f"[{'PASS' if ok else 'FAIL'}] {name}  {'' if ok else '→ '+hint}")
        ok_all &= ok
    return ok_all

if __name__ == "__main__":
    exit(0 if camera_selftest() else 1)`) };

  DB["cv-c14"] = { level: 3, title: "多进程图像传输", body: "进程 A 采集、进程 B 推理，图像怎么传最快？三种方式对比。", hint: "共享内存完胜。", solution: C("text", "ans.txt", `①queue + pickle（默认）：图像序列化拷贝 2 次——1080p 一帧 3~4ms，pass\n②multiprocessing.shared_memory：零拷贝共享内存帧缓冲 + 索引信号量——<0.1ms，正确答案\n③管道/UNIX socket：比 pickle 好点但仍拷贝\n实现要点：共享内存预分配 N 个槽位（环形），采集进程写完 set 事件，推理进程读——避免每帧创建销毁 shm\nPython 层还有个隐形拷贝：np.frombuffer 拿到的数组转 tensor——用 torch.from_numpy 零拷贝。`) };

  DB["cv-c15"] = { level: 3, title: "OpenCV 线程安全吗", body: "多线程同时调 cv2.imshow / cv2.resize 安全吗？", hint: "imshow 全局锁。", solution: C("text", "ans.txt", `imshow/waitKey：不安全且必须在主线程（GUI 线程亲和）——子线程 imshow 崩或无声失败\nresize/cvtColor/findContours：线程安全（无内部状态）——可放心并行\nVideoCapture：单个实例非线程安全（采集线程独占），多线程要多个实例或加锁\npractice：采集/推理/显示三线程架构里，imshow 只在主线程，子线程把处理结果放队列，主线程取出来画+显示。`) };

  DB["cv-c16"] = { level: 3, featured: true, title: "综合：装甲板识别完整流水线手写", body: "从零写完整装甲板检测：HSV 红蓝双抠→形态学→轮廓→灯条配对→PnP 距离姿态→串口输出格式。单文件可跑。", hint: "前面所有章节模块的集成。", solution: C("python", "pipeline_full.py", `import cv2, numpy as np, time

K = np.array([[820,0,320],[0,815,240],[0,0,1]], np.float32)
OBJ = np.array([[115,27.5,0],[115,-27.5,0],
                [-115,-27.5,0],[-115,27.5,0]], np.float32)  # 装甲板mm

def detect(frame):
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    red = cv2.inRange(hsv,(0,100,100),(10,255,255)) | \\
          cv2.inRange(hsv,(160,100,100),(180,255,255))
    blue = cv2.inRange(hsv,(100,100,100),(130,255,255))
    out = []
    for mask, color in [(red,"R"),(blue,"B")]:
        k = cv2.getStructuringElement(cv2.MORPH_RECT,(3,3))
        m = cv2.morphologyEx(mask, cv2.MORPH_OPEN, k)
        cnts,_ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        bars = []
        for c in cnts:
            if not (100 < cv2.contourArea(c) < 5000): continue
            x,y,w,h = cv2.boundingRect(c)
            if not (0.2 < w/h < 0.7) or w<8 or h<20: continue
            bars.append((x,y,w,h,(x+w/2,y+h/2)))
        # 灯条配对
        for i in range(len(bars)):
            for j in range(i+1, len(bars)):
                a, b = bars[i], bars[j]
                dh = abs(a[4][1]-b[4][1])
                dw = abs(a[4][0]-b[4][0])
                h_ratio = min(a[3],b[3])/max(a[3],b[3])
                if h_ratio < 0.7: continue
                gap_ratio = dw / max(a[3],b[3])
                if not (0.8 < gap_ratio < 3.2): continue
                # PnP 四点(左条右上/右下 + 右条左上/左下 简化用外接矩)
                l, r = (a if a[4][0]<b[4][0] else b), (b if a[4][0]<b[4][0] else a)
                pts = np.float32([[l[0]+l[2], l[1]],        # 左上
                                  [l[0]+l[2], l[1]+l[3]],   # 左下
                                  [r[0],   r[1]+r[3]],      # 右下
                                  [r[0],   r[1]]])          # 右上
                ok, rv, tv = cv2.solvePnP(OBJ, pts, K, None, flags=cv2.SOLVEPNP_IPPE)
                if ok:
                    dist = np.linalg.norm(tv)/1000
                    out.append({"color":color, "dist":dist,
                                "center":((l[4][0]+r[4][0])/2,(l[4][1]+r[4][1])/2)})
        return out
    return out

def main():
    cap = cv2.VideoCapture(0, cv2.CAP_V4L2)
    while True:
        ok, frame = cap.read()
        if not ok: break
        t0 = time.perf_counter()
        targets = detect(frame)
        dt = (time.perf_counter()-t0)*1000
        for t in targets:
            cx, cy = map(int, t["center"])
            cv2.circle(frame,(cx,cy),5,(0,255,0),-1)
            cv2.putText(frame, f'{t["color"]}{t["dist"]:.1f}m',(cx+8,cy),
                        0,0.6,(0,255,0),2)
        cv2.putText(frame,f"{dt:.1f}ms",(10,30),0,1,(0,255,255),2)
        cv2.imshow("armor", frame)
        if cv2.waitKey(1)==27: break
    cap.release()

if __name__ == "__main__": main()`) };

  DB["cv-c17"] = { level: 2, title: "图像预处理顺序", body: "去噪/二值化/形态学/找轮廓的标准顺序能乱吗？各顺序错的后果？", hint: "信息流单向。", solution: C("text", "ans.txt", `标准链：去噪(可选)→二值化→形态学→findContours——每一步依赖前一步的输出形态\n二值化前必须灰度/HSV（threshold 只吃单通道）\n形态学在二值后（对灰度做形态学是另一算法，语义不同）\n轮廓在形态学后（先清理再提取，噪点轮廓少）\n乱序反例：先形态学后二值化——形态学把灰度细节糊掉，阈值切出来形状失真。`) };

  DB["cv-c18"] = { level: 3, title: "float 图像陷阱", body: "img.astype(np.float32) 后 imshow 全白。为什么？", hint: "imshow 期望 0~1 或 0~255。", solution: C("text", "ans.txt", `imshow 类型规则：uint8 按 0~255 显示；float 按 0.0~1.0 显示\nfloat 图像里 0~255 的值被当成「255 倍超白」→ 全部 clip 到 1 → 全白\n修复：imshow 前转回 uint8，或 float 图先 /255\n高频 bug 场景：卷积/归一化后忘转回——调试半小时发现是显示层问题，不是算法问题\n规矩：计算归计算显示归显示，imshow 前一行 astype(np.uint8) 别省。`) };

  DB["cv-c19"] = { level: 3, title: "感兴趣区域越界", body: "目标在上帧框 y-20 处，裁 ROI 时 slice 到负数。OpenCV 切片负索引的坑？", hint: "负数从尾部数。", solution: C("python", "roi_safe.py", `import numpy as np

def safe_roi(img, x, y, w, h):
    """防越界 ROI: 负坐标和超出都被钳制"""
    H, W = img.shape[:2]
    x1 = max(0, x);          y1 = max(0, y)
    x2 = min(W, x+w);        y2 = min(H, y+h)
    if x2 <= x1 or y2 <= y1:
        return None                    # 完全出界
    return img[y1:y2, x1:x2]

img = np.zeros((100, 200), np.uint8)
# 陷阱演示:
print(img[-20:30, :].shape)   # (30,200) —— 不是预期!
# -20 被理解为 100-20=80 → 切的是 [80:30] 反转 → 空也没,这里numpy宽容
# 正确做法:
print(safe_roi(img, -10, -10, 50, 50).shape)  # (40,40) 钳制后`) };

  DB["cv-c20"] = { level: 3, featured: true, title: "性能剖析实战", body: "流水线 45ms/帧需要压到 16ms。给剖析数据：cvtColor 2ms/inRange 3ms/morphology 8ms/findContours 15ms/PnP 5ms/draw 12ms。砍哪三刀？", hint: "找最大头+能省的。", solution: C("text", "ans.txt", `分析：总45ms。draw 12ms 是纯调试——部署版砍掉省 12ms（不用真实显示）。findContours 15ms——输入轮廓数量爆炸（mask 噪点多）：加强形态学开运算核(3→5)预清理，省 ~8ms。morphology 8ms——核太大：3×3 基础上只对高噪区做，或用更快的 erode+dilate 手动组合，省 4ms\n方案后：2+3+4+7+5 = 21ms 还差 5ms → ROI 裁剪（只处理上帧目标邻域）再省一半 → ~12ms ✓\n方法论：先砍「不该有的」（调试显示），再砍「最大的」（轮廓输入质量），最后「聪明的」（ROI）。盲目优化 cvtColor 那种 2ms 项是浪费时间。`) };

  /* 补充 20 题：控制进阶凑满 */
  DB["cva-b21"] = { level: 2, title: "IMU 数据单位换算", body: "陀螺仪芯片输出 raw=16384 时角速度是多少（量程 ±2000dps，16bit）？换算公式？", hint: "lsb = 量程/满量程raw。", solution: C("text", "ans.txt", `灵敏度 = 32768 / 2000 = 16.384 lsb/dps（±2000dps 档）\nraw=16384 → 16384/16.384 = 1000 dps ≈ 17.45 rad/s\n代码：gyro_rad = raw / 16.384 * π/180\n坑：换量程档（±500dps）灵敏度变 65.536——驱动里量程和换算必须成对改\n验证：手转 IMU 一圈（已知 360°），积分应该回零±漂移。`) };

  DB["cva-b22"] = { level: 3, title: "CAN 过载保护", body: "CAN 错误计数器暴涨（bus-off）。什么原因？怎么自动恢复？", hint: "位错误/错误帧。", solution: C("text", "ans.txt", `原因：波特率不匹配/终端电阻缺失（波形反射）/线缆干扰/某节点发疯持续占线\nbus-off 后节点自动离线——需要软件干预恢复：\n①STM32：检测 bus-off → 延时 100ms → 重置 CAN 外设重新入网（别立即重试，总线可能还在崩）\n②统计恢复次数：1 分钟内 bus-off >3 次 = 硬件问题（查电阻/线），上报不硬撑\n③关键数据冗余：云台指令同时发两遍（间隔 5ms）扛单帧丢失\n排查工具：CAN 分析仪抓错误帧，dmesg 看 SocketCAN 错误计数。`) };

  DB["cva-b23"] = { level: 3, title: "控制周期内任务分配", body: "1kHz 控制拍内要跑：FOC 电流环 50μs/速度环 30μs/传感器解码 20μs/通信 40μs。预算 1ms 够吗？怎么排？", hint: "错峰。", solution: C("text", "ans.txt", `电流环 20kHz 单独中断（50μs×20=1ms 独占一个核/定时器）\n速度环 1kHz 在电流环间隙跑：30μs\n传感器解码错峰：编码器每拍 20μs，IMU SPI 15μs，CAN 收发用 DMA 后台不占 CPU\n通信：串口/CAN 发送 DMA 化（CPU 只填缓冲 10μs）\n总 CPU 预算：速度环拍内 30+20+15+10 = 75μs——1ms 拍用不到 10%，余量给监控/日志\n原则：DMA 能搬的绝不用 CPU 轮询，重活错峰，主循环只做「必须同步」的事。`) };

  DB["cva-b24"] = { level: 3, featured: true, title: "手写：控制拍 profiler", body: "写控制环内的分段时间计数器（Cortex-M DWT 周期计数），输出每段最坏/典型耗时和占比。", hint: "DWT->CYCCNT。", solution: C("cpp", "profiler.cpp", `#include <cstdint>

// Cortex-M DWT 周期计数器
struct Dwt {
    static void init() {
        CoreDebug->DEMCR |= CoreDebug_DEMCR_TRCENA_Msk;
        DWT->CYCCNT = 0;
        DWT->CTRL |= DWT_CTRL_CYCCNTENA_Msk;
    }
    static inline uint32_t now() { return DWT->CYCCNT; }
};

class SectionProfiler {
    static constexpr int N = 8;
    const char* names[N] = {};
    uint32_t cyc[N] = {};
    uint32_t worst[N] = {};
    uint32_t start = 0;
    int cur = 0;
public:
    void begin() { cur = 0; start = Dwt::now(); }
    void mark(const char* name) {
        uint32_t t = Dwt::now();
        if (cur > 0) {
            uint32_t d = t - start;
            cyc[cur-1] += d;
            if (d > worst[cur-1]) worst[cur-1] = d;
        }
        names[cur] = name;
        start = t; cur++;
    }
    void report(uint32_t hz = 168000000) {   // 1Hz 调用
        // 每秒打印各段 us 和最坏值
        for (int i = 0; i < cur && names[i]; i++) {
            printf("%-10s %6lu us (worst %lu us)\\n",
                   names[i], cyc[i]/(hz/1000000), worst[i]/(hz/1000000));
            cyc[i] = worst[i] = 0;
        }
    }
};

// 用法(控制拍内):
// prof.begin();
// ... 电流环 ...
// prof.mark("current");
// ... 速度环 ...
// prof.mark("speed");
// ... 通信 ...
// prof.mark("comm");`) };

  DB["cva-b25"] = { level: 3, title: "电控 OTA 升级安全", body: "比赛前夜远程升级电控固件，升级到一半断电。怎么设计才不会变砖？", hint: "双分区回滚。", solution: C("text", "ans.txt", `双分区（A/B bank）：\n①当前运行区 A，新固件写入备用区 B（写到一半断电——A 完好无损照常跑）\n②写完校验 CRC + 签名 → 置「下次启动试运行 B」标志\n③启动 B 后 30s 内必须收到「确认正常」（遥控心跳或操作手按键）——超时自动回滚 A\n④回滚也要记日志——反复回滚说明新固件有毒，冻结升级\n比赛铁律：赛前 48 小时禁止 OTA——手动 USB 刷+现场测试才算数。`) };

  DB["cva-b26"] = { level: 2, title: "电调 vs 自己写 FOC", body: "队里该买成品电调（VESC/Odrive）还是自研 FOC 板？决策矩阵？", hint: "时间/可控性/比赛规则。", solution: C("text", "ans.txt", `买成品（VESC 类）：一周出活、固件成熟、CAN 开放；受限——闭环参数黑盒调不透、特殊需求（比赛裁判系统联动）难定制、断供风险\n自研 FOC：完全可控（电流环参数/保护逻辑全透明）、教学价值高；成本——一年起步、炸管烧板是学费\n决策：电控组 ≤3 人 → 买成品（省下的时间练自瞄）；≥5 人且有两届积累 → 自研一块云台专用板（底盘继续用成品）\nRM 现实：大部分强队「成品电调+自研上层控制」，全栈自研是奢侈品。`) };

  DB["cva-b27"] = { level: 3, title: "电机堵转的力矩控制", body: "云台顶住限位时电流环还在全力输出。力矩限幅怎么和位置环联动？", hint: "限位前预减速+限位时力矩钳。", solution: C("text", "ans.txt", `两级防护：\n①软件限位预减速：目标角接近限位（剩 5°）→ 目标角被钳制+速度限幅收缩到 20%——正常情况根本撞不上\n②撞上限位（电流>阈值且速度≈0）→ 力矩指令钳到「保持力矩」（克服重力即可，比如 30% 额定）——不硬顶\n③上报异常 → 上层决策（视觉目标在限位外 → 提示操作手而不是硬打）\n机械限位是最后防线不是工作位——正常工况永远不该碰到。`) };

  DB["cva-b28"] = { level: 3, title: "串口 vs CAN 选型", body: "视觉→电控用串口还是 CAN？给三个维度的对比。", hint: "延迟/拓扑/工具链。", solution: C("text", "ans.txt", `延迟：串口点对点更稳（无仲裁）；CAN 多节点共享有仲裁延迟（<100μs 可忽略）\n拓扑：串口 1v1——视觉电控直连刚好；CAN 多节点——再加个调试器/裁判模块就赢\n工具链：CAN 有现成分析仪/录波工具（调试神器）；串口要自己写解析\nRM 实情：视觉-电控串口（简单直接），电控内部 CAN（电机多）——混合架构最常见\n若视觉也挂 CAN：好处是电控日志能带上视觉时间戳——联调追溯方便，值得做。`) };

  DB["cva-b29"] = { level: 3, featured: true, title: "控制延迟全链测量", body: "设计端到端延迟测量实验（视觉目标出现→云台响应）：用 LED+示波器法，写实验步骤和数据处理。", hint: "GPIO 翻转打点。", solution: C("text", "latency_test.txt", `实验装置:
  LED 由信号发生器驱动(1Hz方波), 放在相机视野内
  云台电控预留测试GPIO: 收到视觉目标指令时翻转
  示波器: CH1=LED驱动信号 CH2=云台GPIO

测量步骤:
  1. LED亮 → 视觉检测到亮斑 → 发目标 → 电控GPIO翻转
  2. 示波器测 CH1→CH2 延迟 = 端到端延迟
  3. 采100个周期, 统计 mean/p50/p95/max

分段打点(深入定位):
  视觉板GPIO: 采集时刻翻转 / 检测完成翻转 / 串口发送翻转
  电控板GPIO: 串口接收中断翻转 / 控制输出翻转
  → 各段延迟独立可见

典型RM数据:
  曝光4ms + 传输3ms + 推理6ms + 串口1.5ms
  + 电控解析0.3ms + 控制周期等待(平均0.5ms)
  = 15.3ms均值, p95=19ms
注意: 控制周期等待是[0,1ms]均匀分布——
      "平均0.5ms"但最坏1ms,报指标要给p95`) };

  DB["cva-b30"] = { level: 3, title: "比赛日志的 Golden 三问", body: "复盘一场失利，控制日志能回答哪三个黄金问题？", hint: "时序/指标/异常。", solution: C("text", "ans.txt", `①「那一刻系统各环节在干什么？」——时间线对齐：目标/云台/电流/电压/模式同一张图，失分的瞬间逐毫秒看\n②「性能指标当时是多少？」——命中率/延迟/误差在整场的滑动曲线：是开场就差还是越打越差（热衰减？）\n③「有没有异常被忽略了？」——告警日志检索：CAN 错误/丢帧/保护触发——当时没人在意的黄灯就是真相\n日志系统的意义：让败因从「感觉」变成「证据」。`) };

  /* OpenCV C 卷剩余（c21~c40）快速补齐 */
  DB["cv-c21"] = { level: 1, title: "灰度化的权重", body: "BGR 转灰度的权重为什么不是 1/3 平均而是 0.299R+0.587G+0.114B？", hint: "人眼敏感度。", solution: C("text", "ans.txt", `人眼对绿色最敏感（视锥细胞分布），红次之，蓝最钝——等权平均会把蓝色噪声放大、绿色信号压低\nITU-R BT.601 标准权重按亮度感知曲线标定：Y = 0.299R + 0.587G + 0.114B\n实战影响：等权灰度化后灯条和背景对比度降低 20~30%——阈值分割变难。别自己发明灰度公式。`) };

  DB["cv-c22"] = { level: 2, title: "直方图均衡的场景", body: "什么时候该用直方图均衡？什么时候用了反而坏事？", hint: "对比度不足/已有目标结构。", solution: C("text", "ans.txt", `该用：整体偏暗/偏亮、对比度拉不开（雾天/暗光场地）——拉伸后目标背景分离更好\n不该用：①目标靠「绝对亮度」区分时（灯条 255 vs 背景 20——均衡后背景被拉亮反而贴近视觉阈值）②有光源场景（直方图双峰，均衡把两峰搅在一起）\nRM 灯条检测：永远不用——主动光源 + 低曝光 = 天然高对比，均衡纯属捣乱\n结论：工具没有好坏，先想清楚「我的目标靠什么和背景分开」。`) };

  DB["cv-c23"] = { level: 3, title: "CLAHE 局部均衡", body: "自适应直方图均衡 CLAHE 和全局均衡的区别？clipLimit 参数管什么？", hint: "分块+限幅。", solution: C("text", "ans.txt", `全局均衡：一整幅图一个变换——亮区过曝暗区噪声放大\nCLAHE：分 tile（默认 8×8）各自均衡 + 双线性插值拼接——局部对比度增强且过渡自然\nclipLimit：限制单 bin 占比（超出部分重新分发）——防「小块区域里个别亮像素把整个 tile 的直方图拉爆」\nRM 场景：暗光下看场地纹理（雷达建图）用 CLAHE(clip=2.0, tile=8×8)；灯条检测不用\n调参：clip 越小越保守（1~3 常用），tile 越小局部性越强（8~16）。`) };

  DB["cv-c24"] = { level: 3, featured: true, title: "手写：环形缓冲录像", body: "实现「事故自动录像」：环形缓冲存最近 10s 帧，检测到异常（丢帧/误差超限）时把前 10s+后 5s 写盘。", hint: "deque+触发状态。", solution: C("python", "ring_rec.py", `import collections, cv2, time, threading

class IncidentRecorder:
    def __init__(s, sec_pre=10, sec_post=5, fps=60):
        s.buf = collections.deque(maxlen=sec_pre*fps)
        s.recording_until = 0
        s.writer = None
        s.lock = threading.Lock()

    def feed(s, frame, anomaly=False):
        with s.lock:
            s.buf.append(frame.copy())      # copy! imshow复用缓冲
            if anomaly:
                s.recording_until = time.time() + 5
            if s.recording_until > time.time():
                if s.writer is None:
                    ts = time.strftime("%H%M%S")
                    s.writer = cv2.VideoWriter(
                        f"incident_{ts}.mp4",
                        cv2.VideoWriter_fourcc(*"mp4v"), 60,
                        (frame.shape[1], frame.shape[0]))
                    # 先把缓冲(前10s)全部写入
                    for f in s.buf: s.writer.write(f)
                s.writer.write(frame)
            elif s.writer is not None:
                s.writer.release(); s.writer = None

# 管线里:
rec = IncidentRecorder()
while True:
    ok, frame = cap.read()
    err = control_error()                   # 你的指标
    rec.feed(frame, anomaly=(err > 0.5))    # 超限触发
# 比赛全程无感知,出事自动有完整录像`) };

  DB["cv-c25"] = { level: 2, title: "颜色空间转换开销", body: "cvtColor BGR2HSV 每帧多少 ms？有什么省法？", hint: "查表优化。", solution: C("text", "ans.txt", `1080p BGR→HSV 约 2~3ms（SIMD 优化过）——60fps 预算里占 15%，不小\n省法：\n①只在 ROI 上转（目标邻域 1/4 面积 → 0.6ms）\n②降色深：先降采样到检测分辨率再转\n③替代方案：灯条亮度高——直接灰度+高阈值（0.5ms）先粗筛，候选区再精确 HSV 验色\n组合拳：灰度粗筛 + HSV 精筛——快 4 倍且精度不损失。`) };

  DB["cv-c26"] = { level: 3, title: "cv2.setNumThreads", body: "OpenCV 内部多线程和你的管线线程会打架。什么时候该限制？", hint: "CPU 核竞争。", solution: C("text", "ans.txt", `场景：你自己开了采集/推理/后处理三线程，OpenCV 内部又把 resize/findContours 并行到 8 核——线程数爆炸互相踩（上下文切换开销 > 并行收益）\n限法：cv2.setNumThreads(1)（管线自己管并行时）或 setNumThreads(2)（留一点给大操作）\n判断：top 看 CPU 使用率分布——多线程都在 100% 但吞吐没涨 = 打架了\n原则：并行度设计权在你手里就关 OpenCV 内部并行，别两套并行互相抢核。`) };

  DB["cv-c27"] = { level: 3, title: "UMat/OpenCL 加速", body: "cv2.UMat 是什么？什么时候真有用？", hint: "透明 API/GPU 委托。", solution: C("text", "ans.txt", `UMat = OpenCL 透明 API：把 Mat 换 UMat，支持的操作自动跑在 GPU/iGPU 上（Intel 核显友好）\n真有用：连续的内存密集操作链（resize→cvtColor→filter2D 连跑——数据留在显存不走 PCIe）\n没用：小图（传输开销 > 计算省的时间）；操作链短（每次 host↔device 拷贝 1~2ms 白送）\nNUC 核显实测：720p HSV+形态学链 8ms→2.5ms（数据不出显存时）；NVIDIA 卡不如直接 CUDA/TensorRT\n结论：Intel 无独显平台值得一试，代码改动就是 Mat→UMat 几个字。`) };

  DB["cv-c28"] = { level: 3, title: "图像金字塔用途", body: "什么时候用得到图像金字塔（pyrDown/pyrUp）？", hint: "多尺度。", solution: C("text", "ans.txt", `①多尺度目标搜索：不知道目标多大——顶层粗搜定位 → 逐层下来精定位（经典目标检测流程）\n②大图快速操作：1080p 直接 blur 慢——降两层处理再 upsample 回来（精度换速度）\n③拉普拉斯金字塔：图像融合/增强（HDR 融合的底层工具）\nRM 场景：固定枪口相机目标尺度范围有限——金字塔用不上；全图哨兵雷达（远近目标都有）用得上。`) };

  DB["cv-c29"] = { level: 3, title: "腐蚀的迭代参数", body: "erode 的 iterations=3 和核大小 3 倍(9×9) 效果一样吗？", hint: "等价但有细节。", solution: C("text", "ans.txt", `对矩形核：erode×3 次 ≈ 15×15 单次（3×3 核迭代 3 次等效膨胀半径 3）\n细节差异：椭圆核迭代后形状越来越圆（不像单次大椭圆核保持椭圆比例）\n性能：迭代 3 次小核通常比单次大核快（每次遍历邻域少）\n选法：要「圆形化」效果用迭代；要保持核形状（竖长条去横向噪点）用单次大核。`) };

  DB["cv-c30"] = { level: 3, title: "凸包的面积比用途", body: "contourArea/hullArea（实心度 solidity）这个特征能干什么？", hint: "形状规整度。", solution: C("text", "ans.txt", `solidity = 轮廓面积 / 凸包面积 ∈ (0,1]——衡量「形状有多凹陷」\n用途：\n①灯条完整性：完整灯条 solidity≈0.95；被遮挡断裂时掉到 0.6——用 0.75 阈值筛掉残缺目标\n②区分装甲板和其他矩形物：装甲板（矩形+灯条空隙）solidity 特征稳定\n③手势识别：伸手指的手 solidity 低（~0.4）握拳高（~0.9）\n计算：hull = convexHull(cnt); ratio = contourArea(cnt)/contourArea(hull)——一行特征工程。`) };

  DB["cv-c31"] = { level: 3, featured: true, title: "手写：多特征灯条筛选器", body: "综合运用：面积+宽高比+实心度(solidity)+竖直方向梯度 四特征筛灯条，和单特征对比误检率。", hint: "每特征独立阈值再与。", solution: C("python", "multi_feat.py", `import cv2, numpy as np

def filter_bars_multi(contours):
    kept = []
    stats = {"area":0,"aspect":0,"solid":0,"pass":0}
    for c in contours:
        area = cv2.contourArea(c)
        x,y,w,h = cv2.boundingRect(c)
        hull = cv2.convexHull(c)
        solidity = area / max(cv2.contourArea(hull), 1e-6)
        # 四特征串联筛选
        ok_area = 100 < area < 5000
        ok_asp  = 0.2 < w/h < 0.7
        ok_sol  = solidity > 0.70        # 被遮挡断裂的掉这里
        ok_size = w > 8 and h > 20
        if ok_area: stats["area"] += 1
        if ok_asp:  stats["aspect"] += 1
        if ok_sol:  stats["solid"] += 1
        if ok_area and ok_asp and ok_sol and ok_size:
            kept.append((x,y,w,h)); stats["pass"] += 1
    return kept, stats

# 模拟对比: 30个轮廓(10真灯条+20干扰)
# 单用面积: 通过 10真+12假(误检率55%)
# 四特征:   通过 10真+1假 (误检率9%)
# solidity 是遮挡场景的关键杀器`) };

  DB["cv-c32"] = { level: 3, title: "背景减除法", body: "MOG2/KNN 背景减除在 RM 里有什么用？局限性？", hint: "静态机位。", solution: C("text", "ans.txt", `用途：固定机位（哨兵枪口/雷达相机）分离前景——运动目标自动跳出，不用颜色特征\nMOG2：混合高斯在线学习背景——适应光照渐变；KNN：K 近邻模型对突然光照变化更鲁棒\n局限：①机位一动背景全错（云台相机不可用）②目标静止 5s+ 会被学成背景（参数 history 调大缓解）③拖影（update 速度和目标速度的博弈）\nRM 定位：哨兵全向雷达固定相机的初筛——减掉背景再送检测，误检率砍半。`) };

  DB["cv-c33"] = { level: 3, title: "光流法实战配置", body: "calcOpticalFlowPyrLK 的 winSize/maxLevel/minEigThreshold 怎么配？", hint: "目标尺度/层数。", solution: C("text", "ans.txt", `winSize（搜索窗）：目标帧间位移的 2 倍——RM 云台 60fps 帧间位移 <10px → 21×21 够\nmaxLevel（金字塔层）：大位移用——位移 >50px 时给 3 层（顶层粗定位逐层精化）\nminEigThreshold：特征质量门槛——太小跟踪到纯色区域（乱飘），RM 给 0.001\ncriteria：(EPS+COUNT, 30, 0.01) 常规\n状态判断：status=0（丢失）的点剔除；错误总和 checkBB 抛弃离群\n调试：画轨迹尾巴（trail）——光流质量好坏一秒看出来。`) };

  DB["cv-c34"] = { level: 3, featured: true, title: "综合：能量机关传统法全流程", body: "用传统 OpenCV（不用深度学习）做大符：扇叶色块分割→待击打识别→中心 R 定位→转速测量。写出流程与关键代码。", hint: "能量机关灯光颜色+大 R 中心。", solution: C("python", "rune_trad.py", `import cv2, numpy as np

def rune_pipeline(frame):
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    # 1. 能量机关蓝(或红,按阵营)
    mask = cv2.inRange(hsv, (95,120,120), (130,255,255))
    k = cv2.getStructuringElement(cv2.MORPH_RECT, (5,5))
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, k)

    cnts,_ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    blades, center_R = [], None
    for c in cnts:
        area = cv2.contourArea(c)
        if area < 400: continue
        x,y,w,h = cv2.boundingRect(c)
        ar = w/h
        # 2. 中心 R: 接近正方形且在扇叶群中心
        if 0.6 < ar < 1.6 and area < 3000:
            center_R = (x+w/2, y+h/2)
        # 3. 扇叶: 长条状
        elif 1.5 < ar or ar < 0.6:
            # 判断已击打(暗) vs 待击打(亮)——亮度区分
            roi = cv2.cvtColor(frame[y:y+h, x:x+w], cv2.COLOR_BGR2GRAY)
            brightness = roi.mean()
            blades.append({"box": (x,y,w,h),
                           "active": brightness > 100})   # 亮=待击打

    # 4. 待击打目标 = active 的扇叶
    target = next((b for b in blades if b["active"]), None)
    return center_R, target, blades

# 转速测量: 连续帧中心R到目标的角度差/dt
# 弱点: 高速旋转拖影 → 传统法在此崩 → 这就是上YOLO的理由`) };

  DB["cv-c35"] = { level: 3, title: "图像坐标到云台角度", body: "目标在像素 (640, 360)（1280×720 图中心）。中心偏差多少？目标在 (700, 380) 呢？像素怎么换角度？", hint: "atan(像素偏差/焦距)。", solution: C("python", "px2ang.py", `import numpy as np

K = np.array([[820,0,320],[0,815,240],[0,0,1]], np.float32)  # 注意 cx,cy
fx, fy, cx, cy = 820, 815, 320, 240     # 假设 640x480 内参(例子)
W, H = 640, 480

def pixel_to_gimbal(px, py):
    """像素 → 相对光轴的偏角(度)"""
    dx = px - cx                 # 右为正
    dy = py - cy                 # 下为正(图像系)
    yaw   =  np.degrees(np.arctan(dx / fx))    # 右偏为正
    pitch = -np.degrees(np.arctan(dy / fy))    # 上为正(取反)
    return yaw, pitch

# 中心点: 偏差 0
print(pixel_to_gimbal(320, 240))    # (0.0, 0.0)
# 偏移点
print(pixel_to_gimbal(340, 250))    # yaw≈+1.4°, pitch≈-0.7°
# 云台指令 = 当前云台角 + (yaw, pitch)  —— 视觉伺服
# 精度: 焦距 820px 时 1 像素 ≈ 0.07° —— 3 像素检测误差=0.2°=6m 处 2cm`) };

  DB["cv-c36"] = { level: 3, title: "图像稳定（防抖）", body: "机器人行走颠簸画面抖。除 IMU 电子防抖还有什么 OpenCV 方案？", hint: "特征点估计全局运动。", solution: C("text", "ans.txt", `视频稳像（纯视觉）：①每帧提 ORB 特征 ②和上帧匹配估计单应/仿射（全局运动）③累计变换做平滑滤波（低通）④warpAffine 反向补偿\n局限：纯旋转抖动有效；平移抖动（视差）无法纯 2D 补偿——会裁边+伪影\nRM 实战排序：①硬件减震（硅胶垫/云台阻尼）治本 ②IMU 电子防抖（陀螺仪直接积分补偿，快准）③视觉稳像只做日志回放美化\n检测抖 ≠ 显示抖：检测管线其实不需要稳像（特征在动照样跟踪），稳像主要给操作手看。`) };

  DB["cv-c37"] = { level: 3, title: "标定的温度漂移", body: "夏天场地 35°C，相机和冬天 5°C 标定的参数差多少？要重标吗？", hint: "镜筒热胀。", solution: C("text", "ans.txt", `温度对镜头：镜筒金属热胀 → 焦距变化 ~0.01%/°C——30°C 温差 = 焦距变 0.3% → 远距离测距偏 1~2%\n对相机：CMOS 热噪声变大（暗电流）——不影响几何标定\n要不要重标：精度要求 <2% 测距 → 跨季节重标（比赛前 10 分钟例行）；要求 5% → 不用\n半自动方案：标定两次（冬/夏）建立「温度-焦距」线性插值，运行时按相机温度计微调——工业级做法，RM 想卷可以上\n实操检查：赛前拍 4m 已知距离目标，解算 4.05m → OK；解 4.15m → 重标。`) };

  DB["cv-c38"] = { level: 3, title: "鱼眼相机标定", body: "超广角（>150° FOV）镜头普通标定失效。fisheye 模块怎么用？", hint: "等距投影模型。", solution: C("text", "ans.txt", `普通针孔+径向畸变模型在 FOV>150° 时误差爆炸——需要等距投影模型\nOpenCV fisheye 模块：cv2.fisheye.calibrate（畸变 4 参数 k1~k4，含义不同）\n标定差异：①棋盘要占视野 60%+（广角下边缘必须拍到大量角点）②角点初始化更敏感（先用 estimateNewCameraMatrixForUndistortRectify 辅助）\nRM 用途：哨兵全向视野（193° 鱼眼）做周边感知——检测用重映射到针孔虚拟相机（fisheve undistort 到常规图再跑 YOLO）\n坑：重映射后边缘拉伸严重——目标在边缘的检测精度天然差，策略上引导目标进中央区。`) };

  DB["cv-c39"] = { level: 3, featured: true, title: "手写：鱼眼去畸变重映射", body: "用 fisheye 标定结果把 195° 鱼眼图重映射成 4 张 90° 针孔虚拟相机图（前后左右），拼全向感知。", hint: "fisheye.initUndistortRectifyMap×4 个虚拟朝向。", solution: C("python", "fisheye_remap.py", `import cv2, numpy as np

K = np.load("fisheye_K.npy")            # fisheye标定的内参
D = np.load("fisheye_D.npy")            # 4参数畸变

# 4个虚拟针孔相机: 前/右/后/左 (yaw 0/90/180/270)
def build_remap(K, D, out_size=(640,480), vfov=90):
    maps = []
    for yaw in [0, 90, 180, 270]:
        # 虚拟相机旋转(绕y轴)
        R = cv2.Rodrigues(np.array([0, np.radians(yaw), 0]))[0]
        # 虚拟针孔内参: 同尺寸,常规FOV
        Kv = np.array([[out_size[0]/2/np.tan(np.radians(vfov/2)*(out_size[0]/out_size[1])),
                        0, out_size[0]/2],
                       [0, out_size[0]/2/np.tan(np.radians(vfov/2)*(out_size[0]/out_size[1])),
                        out_size[1]/2],
                       [0,0,1]], np.float64)
        map1, map2 = cv2.fisheye.initUndistortRectifyMap(
            K, D, R, Kv, out_size, cv2.CV_16SC2)
        maps.append((map1, map2, yaw))
    return maps

maps = build_remap(K, D)
cap = cv2.VideoCapture(0)
while True:
    ok, fisheye_img = cap.read()
    if not ok: break
    views = []
    for map1, map2, yaw in maps:
        v = cv2.remap(fisheye_img, map1, map2, cv2.INTER_LINEAR,
                      borderMode=cv2.BORDER_CONSTANT)
        views.append(v)
    # 拼横向全景
    pano = np.hstack(views)
    cv2.imshow("panoramic", pano)      # 4方向送YOLO=全向感知
    if cv2.waitKey(1) == 27: break`) };

  DB["cv-c40"] = { level: 3, featured: true, title: "终极毕业考：视觉系统选型答辩", body: "队伍预算有限只能上一个方案：传统 OpenCV 流水线 vs YOLO+TensorRT。从命中率/开发周期/维护性/人员门槛四个维度写答辩词 defending 传统方案。", hint: "没有银弹，看队伍现状。", solution: C("text", "defense_trad.txt", `立场: 中游队伍新赛季, 选传统 OpenCV 流水线

一、命中率: 数据说话
  我们上赛季数据: 正面装甲板传统法命中率 72%
  YOLO 理论上限高 10~15 个点, 但前提是:
  5000+ 张精标数据 + 有 GPU 的调参环境 + TensorRT 部署经验
  → 我们三样都没有, YOLO 实际能落地几分是未知数
  传统法的 72% 是"确定能拿到"的

二、开发周期: 一个赛季就 4 个月
  传统法: 熟手 3 周出稳定版本 (本站 OpenCV 专题就是教材)
  YOLO 路线: 数据采集标注 1.5月 + 训练调参 1月
             + 部署联调 1月 = 3.5月, 零容错
  → 赛季中途翻车没有 Plan B

三、维护性: 下届接班
  传统法: H.inRange 参数调一调, 新人看代码能懂
  YOLO: 数据集/训练/导出/部署全链路,
        换届断档风险极高(见过太多队模型失传)

四、人员门槛
  传统法: 会 OpenCV 就行 (本站 80 题练完即战力)
  YOLO: 需要懂深度学习+训练+部署的专人

结论: 传统法今年保 72% 命中率进区域赛;
     同时本赛季开始攒数据集和培养 DL 人才,
     明年带着 5000 张数据再上 YOLO——
     "先守住下限, 再冲击上限"
     (强队用 YOLO 是因为他们已经有数据和人才了)`) };
})(window);
