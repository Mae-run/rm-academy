// OpenCV 题库 B 卷（40 题：跟踪/视频/标定/综合实战）
(function (global) {
  "use strict";
  var DB = global.PRACTICE_DB = global.PRACTICE_DB || {};
  var C = H.code;

  DB["cv-b01"] = { level: 2, title: "VideoCapture 读帧失败", body: "cap.read() 返回 ret=False，列举四个可能原因和排查命令。", hint: "相机占用/索引错/权限/驱动。", solution: C("text", "ans.txt", `①相机被占用：别的进程（Cheese/旧脚本）占着 → ls /dev/video* + fuser /dev/video0\n②索引错误：USB 相机不是 0 → 逐个试 0,1,2 或 v4l2-ctl --list-devices\n③权限：Linux 用户不在 video 组 → sudo usermod -aG video $USER 后重登\n④驱动没加载：lsusb 看设备认到没；dmesg | tail 看 USB 报错\n工业相机另查：SDK 路径、固件版本、网口相机的 IP 配置。`) };

  DB["cv-b02"] = { level: 2, title: "帧率不足排查", body: "设置 60fps 实测只有 30fps，从软件和硬件两方面各列两个原因。", hint: "曝光超 16ms；USB 带宽。", solution: C("text", "ans.txt", `软件：\n①曝光时间 >16.7ms（自动曝光在暗场拉长）→ 手动曝光压到 5ms 内\n②处理速度 <30fps，缓冲堆积 → 分段计时砍瓶颈\n硬件：\n①USB2.0 接口带宽不够（1080p60 需要 USB3.0）→ 换口/换线\n②相机本身只支持 1280x720@30 → 查规格表，降分辨率或换相机\nv4l2-ctl --list-formats-ext 看真实支持的分辨率/帧率组合。`) };

  DB["cv-b03"] = { level: 2, featured: true, title: "手动曝光的重要性", body: "为什么 RM 视觉必须手动曝光？自动曝光在什么场景下会坑你？", hint: "亮度漂移 → HSV 阈值崩。", solution: C("text", "ans.txt", `自动曝光随场景亮度连续调整 → 同一装甲板不同时刻的像素值漂移 → HSV 阈值一会儿漏检一会儿误检，流水线不稳定。\n坑人场景：\n①对方激光笔扫过 → 曝光骤降 → 全图变暗 → 灯条全丢\n②机器人从暗区进亮区 → 曝光收缩过渡期 0.5s 检测全空\n③场地大屏闪烁 → 曝光振荡 → 检测结果跳变\n手动曝光锁死后像素值只跟物体本身有关，阈值稳定。\nRM 灯条是主动发光的 LED，压低曝光让灯条饱和、背景全黑，二值化反而更干净。`) };

  DB["cv-b04"] = { level: 3, title: "时间戳对齐", body: "视觉帧和 IMU 数据时间戳不一致（相差 30ms），怎么检测并校准这个偏差？", hint: "旋转平台对齐法/互相关。", solution: C("text", "ans.txt", `检测：把相机和 IMU 装在云台上做正弦摆动，记录两个传感器同一段运动的数据，对角速度曲线做互相关，峰值偏移就是时间差。\n校准：\n①硬件同步（最优）：工业相机触发线接 IMU，同源时钟\n②软件补偿：固定偏移量写入配置，读帧时打「采集时刻」而非「处理时刻」时间戳\n③在线估计：EKF 里把时间偏移当状态量一起估\n注意：曝光中点才是真实采集时刻（曝光 5ms 则帧时间戳=读出时刻-2.5ms）。`) };

  DB["cv-b05"] = { level: 2, title: "颜色空间选择决策", body: "给三个任务各选色彩空间并说理由：①灯条分割 ②特征点提取 ③深度学习输入预处理。", hint: "HSV/灰度/RGB。", solution: C("text", "ans.txt", `①灯条分割 → HSV：色相稳定抗光照，inRange 两段红或一段蓝\n②特征点提取 → 灰度：SIFT/ORB 只要强度信息，彩色反而添噪\n③深度学习 → RGB：PyTorch/训练惯例是 RGB 通道序；OpenCV 读出的 BGR 必须 cvtColor 转换，忘了颜色对调红蓝，网络直接瞎掉一半。`) };

  DB["cv-b06"] = { level: 3, featured: true, title: "HSV 阈值标定工具", body: "写一个 HSV 阈值调试小工具：滑动条实时调 6 个阈值（H/S/V 上下限），实时显示二值化结果，帮你快速标定新场地。", hint: "cv2.createTrackbar 六根 + 回调重算。", solution: C("python", "ans.py", `import cv2, numpy as np

def nothing(x): pass
cv2.namedWindow("tune")
for name in ["H_lo","H_hi","S_lo","S_hi","V_lo","V_hi"]:
    cv2.createTrackbar(name, "tune", 0, 255, nothing)
cv2.setTrackbarPos("H_hi","tune",180)

cap = cv2.VideoCapture(0)
while True:
    _, frame = cap.read()
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    g = lambda n: cv2.getTrackbarPos(n, "tune")
    mask = cv2.inRange(hsv, (g("H_lo"),g("S_lo"),g("V_lo")),
                            (g("H_hi"),g("S_hi"),g("V_hi")))
    cv2.imshow("mask", mask); cv2.imshow("src", frame)
    if cv2.waitKey(1) == 27: break
cv2.destroyAllWindows()
# 标定完记下六值写进配置文件`) };

  DB["cv-b07"] = { level: 2, title: "inRange 边界处理", body: "cv2.inRange 的上下限是闭区间还是开区间？H 上限设 180 时 H=180 的像素会被选中吗？", hint: "闭区间。", solution: C("text", "ans.txt", `闭区间 [lo, hi]，两端都包含。H=180 会命中 [160,180] 的上限。\n但注意 H 的值域是 0~179（360/2-1），不存在 H=180 的像素，上限实际到 179 就封顶。\n调试技巧：想看某像素的 HSV 值，直接 print(hsv[y,x])，别猜。`) };

  DB["cv-b08"] = { level: 3, title: "连通域 vs 轮廓", body: "cv2.connectedComponents 和 cv2.findContours 都能找白色区域，区别和适用场景？", hint: "连通域带标记统计/轮廓带边界形状。", solution: C("text", "ans.txt", `connectedComponents：给每个连通域一个编号，输出标记图，方便统计每个区域的面积/质心，但不给边界形状\nfindContours：提取每个区域的边界点序列，能算周长/外接矩形/凸包/拟合形状\n选型：\n只要数数和质心（噪声统计、目标计数）→ connectedComponents 更快\n要几何形状（灯条筛选、PnP 角点）→ findContours 不可替代\nRM 灯条筛选用 findContours（要 boundingRect 和宽高比）。`) };

  DB["cv-b09"] = { level: 3, title: "凸包与凸缺陷", body: "cv2.convexHull 和 convexityDefects 各是什么？什么场景会用到？", hint: "包住轮廓的最小凸多边形/凹陷区域。", solution: C("text", "ans.txt", `convexHull：包住轮廓的最小凸多边形（橡皮筋套住钉子）\nconvexityDefects：轮廓相对凸包的凹陷区域（深度+端点）\nRM 场景：\n①灯条有断裂时，凸包把断开的两截连成一个整体，比轮廓本身更稳\n②手势识别（指挥机器人启停）靠凸缺陷数手指\n③装甲板被遮挡一半时凸包面积/轮廓面积比是很好的「完整度」特征`) };

  DB["cv-b10"] = { level: 3, featured: true, title: "手写：多目标灯条跟踪框", body: "场上多个装甲板，写一个简单跟踪器：给每个检测到的灯条分配 ID，帧间用最近邻+IoU 关联，输出带 ID 的框。", hint: "上一帧框和当前帧检测做 IoU 矩阵，贪心配对。", solution: C("python", "ans.py", `import numpy as np

class NNTracker:
    def __init__(self, iou_th=0.3, max_lost=5):
        self.tracks, self.nid = [], 0
        self.iou_th, self.max_lost = iou_th, max_lost

    @staticmethod
    def iou(a, b):
        x1,y1 = max(a[0],b[0]), max(a[1],b[1])
        x2,y2 = min(a[2],b[2]), min(a[3],b[3])
        inter = max(0,x2-x1)*max(0,y2-y1)
        ua = (a[2]-a[0])*(a[3]-a[1])+(b[2]-b[0])*(b[3]-b[1])-inter
        return inter/ua if ua>0 else 0

    def update(self, dets):
        for t in self.tracks: t["lost"] += 1
        for d in dets:
            best, bi = self.iou_th, -1
            for t in self.tracks:
                v = self.iou(t["box"], d)
                if v > best: best, bi = v, self.tracks.index(t)
            if bi >= 0:
                self.tracks[bi]["box"], self.tracks[bi]["lost"] = d, 0
            else:
                self.tracks.append({"id": self.nid, "box": d, "lost": 0})
                self.nid += 1
        self.tracks = [t for t in self.tracks if t["lost"] <= self.max_lost]
        return [(t["id"], t["box"]) for t in self.tracks]`) };

  DB["cv-b11"] = { level: 3, title: "卡尔曼滤波在视觉里的角色", body: "视觉检测输出有噪声（框抖动 ±5px），卡尔曼滤波器在这里起什么作用？和直接滑动平均的区别？", hint: "状态估计/预测 vs 平滑。", solution: C("text", "ans.txt", `作用：①平滑——压制观测噪声 ②预测——丢帧/遮挡时外推目标位置 ③融合——结合运动模型（匀速假设）给出更优估计。\nvs 滑动平均：\n滑动平均只有平滑没有预测，延迟 2~3 帧（打移动靶致命）\n卡尔曼有状态方程（位置+速度），天然预测下一帧位置，延迟≈0\nRM 云台瞄准必须用 KF：检测抖 5px，KF 后抖 1px，且能预测 16ms 后位置补偿拍摄延迟。`) };

  DB["cv-b12"] = { level: 3, title: "匀速运动模型状态向量", body: "2D 目标匀速模型的卡尔曼状态向量是什么？维度多少？观测向量是什么？", hint: "[x,y,vx,vy] / [x,y]。", solution: C("text", "ans.txt", `状态 x = [x, y, vx, vy]ᵀ（4 维）：位置+速度\n观测 z = [x, y]ᵀ（2 维）：检测框中心\n状态转移 F：x' = x + vx·dt（dt=帧间隔）\n观测矩阵 H = [[1,0,0,0],[0,1,0,0]]（只观测位置，速度隐含在状态里）\nRM 装甲板要再加加速度项（5 维：x,y,vx,vy,ax?）应对小陀螺加减速。`) };

  DB["cv-b13"] = { level: 2, title: "模板匹配局限", body: "cv2.matchTemplate 在 RM 里的局限？什么场景还能用？", hint: "旋转/缩放敏感。", solution: C("text", "ans.txt", `局限：只对平移不变，旋转/缩放/透视变化下直接失效；光照变化也敏感。\nRM 还能用的场景：\n①静止基地装甲板识别（无旋转无缩放）\n②能量机关固定标记定位（扇叶中心 R 标）\n③数字牌精定位（透视校正后的正视图匹配数字模板）\n动态目标识别千万别用——上特征点或深度学习。`) };

  DB["cv-b14"] = { level: 3, featured: true, title: "手写：灯条断裂修补", body: "装甲板一根灯条被遮挡成两截，轮廓断裂。写代码：用形态学闭运算先连，失败的话用凸包把同区域断裂轮廓合并成一个整体。", hint: "闭运算补近距离断裂；凸包兜底远距离断裂。", solution: C("python", "ans.py", `import cv2, numpy as np

img = cv2.imread("broken_bar.png", 0)
_, bin_ = cv2.threshold(img, 127, 255, cv2.THRESH_BINARY)

# 方案1：闭运算（断裂 < 核尺寸时有效）
k = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 15))  # 竖长核匹配灯条
closed = cv2.morphologyEx(bin_, cv2.MORPH_CLOSE, k)
cnts, _ = cv2.findContours(closed, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
if len(cnts) == 1:
    print("闭运算修补成功")
else:
    # 方案2：凸包合并（断裂远，闭运算吃不下）
    cnts0, _ = cv2.findContours(bin_, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    all_pts = np.vstack(cnts0)                      # 所有断块点合并
    hull = cv2.convexHull(all_pts)                  # 整体凸包
    x,y,w,h = cv2.boundingRect(hull)
    print(f"凸包合并: ({x},{y},{w},{h})")
    cv2.rectangle(bin_, (x,y), (x+w,y+h), 255, 2)`) };

  DB["cv-b15"] = { level: 3, title: "曝光与灯条饱和", body: "为什么 RM 灯条检测反而要压低曝光让灯条过曝？不担心信息丢失吗？", hint: "主动发光 LED；饱和=稳定白。", solution: C("text", "ans.txt", `灯条是主动发光 LED，物理亮度远超环境。压低曝光：\n①背景（反光、大屏、观众席）全压成黑 → 二值化阈值随便设都干净\n②灯条饱和成纯白 255 → 像素值稳定不漂移（饱和区对曝光微调不敏感）\n信息丢失：灯条内部亮度梯度丢了，但灯条检测只要「位置和形状」，不要内部纹理——丢了无所谓。\n这是主动光源目标检测的通用策略：让目标饱和、让背景死黑。`) };

  DB["cv-b16"] = { level: 2, title: "resize 插值选择", body: "cv2.resize 的 INTER_LINEAR / INTER_NEAREST / INTER_CUBIC 怎么选？缩小用哪个？", hint: "速度 vs 质量；缩小考虑 AREA。", solution: C("text", "ans.txt", `INTER_NEAREST：最快，块状伪影，只用于 mask/标签图（不能引入中间值）\nINTER_LINEAR：默认，速度质量均衡，放大用\nINTER_CUBIC：慢，放大质量好（更锐）\nINTER_AREA：缩小最佳（抗混叠，等于先模糊再采样）\nRM 场景：图像缩小用 AREA，放大用 LINEAR，二值 mask 缩放必须 NEAREST。`) };

  DB["cv-b17"] = { level: 3, title: "letterbox 预处理", body: "手写 letterbox 函数：任意尺寸图像等比缩放到 640×640 画布，多余部分填灰(114)。为什么是 114 不是 0？", hint: "114 是 ImageNet 均值附近，中性灰。", solution: C("python", "ans.py", `def letterbox(img, size=640):
    h, w = img.shape[:2]
    s = min(size/h, size/w)
    nh, nw = int(h*s), int(w*s)
    r = cv2.resize(img, (nw, nh), interpolation=cv2.INTER_LINEAR)
    canvas = np.full((size, size, 3), 114, np.uint8)
    top, left = (size-nh)//2, (size-nw)//2
    canvas[top:top+nh, left:left+nw] = r
    return canvas, s, left, top

# 114 而非 0：0 是纯黑，和真实暗背景/阴影分布差异大，
# 会给网络引入分布外的填充模式；114 接近训练集均值，网络视为"无信息区域"。
# 推理后记得逆变换还原到原图坐标。`) };

  DB["cv-b18"] = { level: 3, featured: true, title: "坐标逆变换", body: "YOLO 在 letterbox 后的 640 图上输出框 (cx,cy,w,h)=(350,280,120,60)，原图 1280×720。写代码还原到原图坐标。", hint: "先减 padding 再除 scale。", solution: C("python", "ans.py", `# letterbox 参数: scale s, 偏移 (dx, dy)
# 640 图上 1280x720 → s = min(640/720, 640/1280) = 0.5
# nw=640, nh=360 → dx=0, dy=(640-360)//2=140

s, dx, dy = 0.5, 0, 140
cx, cy, w, h = 350, 280, 120, 60

# 逆变换: 原图坐标 = (网络坐标 - padding) / scale
ox = (cx - dx) / s        # (350 - 0) / 0.5 = 700
oy = (cy - dy) / s        # (280 - 140) / 0.5 = 280
ow = w / s                # 120 / 0.5 = 240
oh = h / s                # 60 / 0.5 = 120

print(f"原图框: 中心(700,280) 宽240 高120")
# 忘了逆变换是最常见的部署 bug：框全错位`) };

  DB["cv-b19"] = { level: 2, title: "图像坐标约定", body: "OpenCV 里 (x, y) 和 [y, x] 的关系？cv2.rectangle 的 pt1=(x,y) 还是 (y,x)？", hint: "函数参数用 (x,y)，数组索引用 [y,x]。", solution: C("text", "ans.txt", `数组索引 img[y, x]：行 y 在前（数学矩阵习惯）\n函数参数 (x, y)：rectangle/circle/putText 等绘画函数用 (x,y) 顺序（几何坐标习惯）\n口诀：方括号行在先，圆括号 x 在先。\n混用是最常见 bug：img[x, y] 在方图上不报错但结果镜像错位，矩形图上直接越界。`) };

  DB["cv-b20"] = { level: 3, title: "数据增强清单", body: "RM 装甲板训练集要做哪些数据增强？哪些不能做？", hint: "几何/光照可以；左右翻转要小心类别。", solution: C("text", "ans.txt", `该做：\n①HSV 抖动（模拟光照）②尺度缩放（模拟距离）③小角度旋转（±15°）\n④Mosaic 拼接⑤运动模糊（随机方向卷积）⑥亮度/对比度扰动\n不能做：\n①水平翻转——红蓝装甲板类别会互换！要翻必须同时换标签\n②色相大范围偏移——红色可能被偏移成蓝色，类别错乱\n③透视畸变过大——超出真实相机畸变范围，网络学到假分布`) };

  DB["cv-b21"] = { level: 3, title: "小目标检测技巧", body: "6 米外装甲板在 640 输入下只有 15×15 像素，漏检率高。给出四个工程手段。", hint: "提分辨率/裁剪/anchor/多尺度。", solution: C("text", "ans.txt", `①输入分辨率 640→960：小目标像素数翻 2.25 倍（代价：推理慢）\n②切片推理（SAHI）：把图切成 4 块分别推理再合并，小目标相对变大\n③anchor/初始框尺寸对齐小目标：检查 anchor 覆盖 15px 尺度\n④多尺度训练（scale augment 强度加大）让网络见过各种大小\n终极方案：换更高分辨率相机或长焦镜头（物理外挂最有效）。`) };

  DB["cv-b22"] = { level: 2, title: "多线程管线", body: "视觉管线为什么要分「采集线程 + 处理线程 + 通信线程」？单线程会怎样？", hint: "生产者消费者解耦。", solution: C("text", "ans.txt", `单线程：相机 16ms 一帧，处理 20ms 一帧 → 相机缓冲堆积 → 拿到旧帧 → 延迟累积。\n三线程（队列解耦）：\n采集线程：死循环 read()，只管拿最新帧塞队列(容量1)\n处理线程：从队列取帧跑推理，处理不完就丢旧帧保延迟\n通信线程：结果立刻发串口，不等下一帧\n关键：队列容量设 1，永远用最新帧——延迟比吞吐更重要。`) };

  DB["cv-b23"] = { level: 3, title: "零拷贝 Mat", body: "OpenCV C++ 里 Mat 的浅拷贝（=赋值）和深拷贝（clone()）区别？管线里错误使用会导致什么？", hint: "共享数据 vs 独立内存。", solution: C("text", "ans.txt", `mat2 = mat1：浅拷贝，共享像素内存（引用计数），改 mat2 就是改 mat1\nmat2 = mat1.clone()：深拷贝，独立内存\n后果：多线程管线里采集线程更新 buffer，处理线程还在读同一块内存 → 撕裂帧（上半帧和下半帧不同时刻）。\n跨线程传递必须 clone() 或用智能指针+缓冲池。`) };

  DB["cv-b24"] = { level: 3, featured: true, title: "手写：环形缓冲帧队列", body: "写一个线程安全的最新帧容器：采集线程不停写入，处理线程永远拿到最新帧，旧帧自动丢弃。", hint: "锁 + 覆盖式写入。", solution: C("python", "ans.py", `import threading

class LatestFrame:
    def __init__(self):
        self.lock = threading.Lock()
        self.frame = None
        self.seq = 0

    def put(self, frame):
        with self.lock:              # 覆盖式：旧帧直接被替换丢弃
            self.frame = frame
            self.seq += 1

    def get(self):
        with self.lock:
            return self.frame, self.seq

# 采集线程
def grabber(cap, box):
    while True:
        ret, f = cap.read()
        if ret: box.put(f)

# 处理线程
def processor(box):
    last_seq = -1
    while True:
        f, seq = box.get()
        if seq == last_seq:          # 没新帧就跳过
            time.sleep(0.001); continue
        last_seq = seq
        detect(f)                    # 永远处理最新帧`) };

  DB["cv-b25"] = { level: 2, title: "工业相机 vs USB 相机", body: "RM 视觉选相机的四个硬指标？USB 淘宝相机差在哪？", hint: "全局快门/帧率/触发/SDK。", solution: C("text", "ans.txt", `①全局快门：运动目标无果冻效应（卷帘快门拍小陀螺直接拖影）\n②高帧率：120~200fps，给电控更多更新\n③硬件触发：和 IMU/电控同源时钟，时间同步零偏差\n④稳定 SDK：V4L2/海康/大恒，曝光增益精确可控\n淘宝 USB 相机：卷帘快门+自动一切+USB2 带宽，调试期玩玩可以，上场必换。`) };

  DB["cv-b26"] = { level: 3, title: "卷帘快门危害", body: "什么是卷帘快门的果冻效应？为什么它对 RM 高速目标致命？", hint: "逐行曝光；旋转目标扭曲。", solution: C("text", "ans.txt", `卷帘快门逐行曝光（第一行和最后一行差几 ms）。静态无影响。\n高速旋转的装甲板：曝光期间姿态变化 → 图像里灯条被扭曲成 S 形 → 轮廓/宽高比全错 → 筛选失效 + PnP 解算姿态错误。\n小陀螺 10rad/s 时 3ms 逐行时差 = 30mrad ≈ 1.7° 扭曲，在远距离上就是脱靶量。\n所以 RM 必须全局快门：整帧同一瞬间曝光。`) };

  DB["cv-b27"] = { level: 3, title: "相机安装要点", body: "视觉相机装机的物理注意项：镜头、安装位置、线缆，各列两条。", hint: "焦距/避震。", solution: C("text", "ans.txt", `镜头：\n①焦距按最远识别距离选（6m 装甲板 ≥15px → 焦距算出来）\n②光圈别开最大（边缘像质差），f/4 左右\n安装：\n①靠近云台旋转轴（减少平移视差干扰解算）\n②刚性连接+减震垫（共振会让画面糊）\n线缆：\n①USB3 带屏蔽磁环（电机干扰会让链路掉线）\n②走线避开电源线（CAN/大电流线并行会引入噪声）`) };

  DB["cv-b28"] = { level: 3, featured: true, title: "端到端延迟测量", body: "怎么科学测量「图像采集到电控收到目标」的端到端延迟？写测量方案。", hint: "LED 闪光法。", solution: C("text", "ans.txt", `LED 闪光法：\n①做一个 LED 灯接 MCU，MCU 同时给视觉系统发触发信号\n②LED 点亮瞬间被相机拍到（图像里出现亮斑）\n③视觉检测到亮斑 → 发送目标给电控 → 电控回 ACK\n④MCU 测量「LED 亮」到「收到 ACK」的时间 = 端到端延迟\n重复 100 次取均值和抖动（p99）。\n分段测量：在链路各环节打硬件时间戳（同一时钟源）。\nRM 达标线：≤25ms 均值，抖动 p99 ≤35ms。`) };

  DB["cv-b29"] = { level: 2, title: "视频写盘", body: "想录制比赛视频回放分析，cv2.VideoWriter 选什么编码？和原始帧比有什么坑？", hint: "无损用 FFV1/MJPEG；掉帧问题。", solution: C("text", "ans.txt", `推荐 MJPG（快、压缩比适中）或 FFV1（无损、慢、文件大）。\nmp4/h264 软压缩 CPU 吃满 → 处理线程被拖慢 → 丢帧。\n坑：\n①录制线程必须独立+队列缓冲，写盘抖动不能阻塞管线\n②VideoWriter 帧率参数要和实际写入速率匹配，否则回放变速\n③比赛只录检测画过框的压缩图，原始流太占盘（rosbag 另说）`) };

  DB["cv-b30"] = { level: 3, title: "光流 vs 检测跟踪", body: "光流法（Lucas-Kanade）和「检测+关联」跟踪的适用场景区别？", hint: "稀疏点跟踪 vs 目标级跟踪。", solution: C("text", "ans.txt", `光流：帧间像素/角点级运动估计，适合①跟踪特征点②相机自运动估计③短时跟踪\n检测+关联：目标级，有 ID 有类别，适合多目标持续跟踪。\nRM 场景：\n能量机关转速估计可用光流（灯条角点位移→角速度）\n装甲板多目标跟踪用检测+ByteTrack（要 ID 和类别语义）\n两者可结合：检测间隔拉大（每5帧一次），光流补帧间跟踪省算力。`) };

  DB["cv-b31"] = { level: 3, title: "虚警率 vs 漏检率权衡", body: "比赛时误检（虚警）和漏检哪个更伤？阈值该怎么倾斜？", hint: "虚警浪费弹丸/暴露；漏检丢时机。", solution: C("text", "ans.txt", `分场景：\n哨兵自动模式：虚警更伤——乱开火暴露位置+浪费弹量+触发反打。\n  阈值调严（置信度 0.6+），宁可慢一点也要准。\n人操瞄准辅助：漏检更伤——人已经瞄上了系统没跟上辅助。\n  阈值放宽（0.3+），快速跟上人的搜索。\n工程实现：置信度阈值做成电控可调参数，赛前按战术配置。`) };

  DB["cv-b32"] = { level: 3, featured: true, title: "手写：性能看门狗", body: "写一个看门狗线程：监测视觉管线帧率，低于 40fps 持续 3 秒就自动保存现场（最后10帧+日志）并报警。", hint: "后台线程计数帧。", solution: C("python", "ans.py", `import threading, time, collections

class FPSWatchdog:
    def __init__(self, th=40, hold=3.0, n_frames=10):
        self.th, self.hold = th, hold
        self.buf = collections.deque(maxlen=n_frames)
        self.count, self.t0 = 0, time.time()
        self.bad_since = None
        self.alarm = False
        threading.Thread(target=self._run, daemon=True).start()

    def tick(self, frame):
        self.count += 1
        self.buf.append(frame)

    def _run(self):
        while True:
            time.sleep(1.0)
            fps = self.count / (time.time() - self.t0)
            self.count, self.t0 = 0, time.time()
            if fps < self.th:
                if self.bad_since is None: self.bad_since = time.time()
                if time.time() - self.bad_since > self.hold:
                    self.alarm = True
                    self._dump()
            else:
                self.bad_since, self.alarm = None, False

    def _dump(self):
        ts = time.strftime("%H%M%S")
        for i, f in enumerate(self.buf):
            cv2.imwrite(f"crash_{ts}_{i}.png", f)
        with open(f"crash_{ts}.log", "w") as fp:
            fp.write(f"FPS dropped, watchdog fired")`) };

  DB["cv-b33"] = { level: 2, title: "ROI 动态跟踪裁剪", body: "目标在上一帧位置附近，写「先粗后细」策略：只在上一帧框的外扩区域做检测，速度能提多少？外扩多少合适？", hint: "外扩 1.5~2 倍。", solution: C("python", "ans.py", `def tracking_roi(prev_box, frame, expand=1.8):
    x, y, w, h = prev_box
    cx, cy = x + w//2, y + h//2
    nw, nh = int(w*expand), int(h*expand)
    nx, ny = max(0, cx-nw//2), max(0, cy-nh//2)
    return frame[ny:ny+nh, nx:nx+nw], (nx, ny)   # ROI图 + 原点偏移

# 速度收益：ROI 面积 ≈ 全图 (w*1.8*h*1.8)/(1280*720)
# 目标 100x100 时 ROI=180x180=32k px vs 全图 921k px → 28 倍提速
# 外扩权衡：太小→目标出逃丢跟踪；太大→提速不明显
# 兜底：连续 N 帧 ROI 内找不到 → 回退全图检测重新捕获`) };

  DB["cv-b34"] = { level: 3, title: "多相机同步", body: "双目/多相机系统怎么保证同一瞬间曝光？软触发和硬触发区别？", hint: "硬件触发线。", solution: C("text", "ans.txt", `软触发：软件依次给各相机发采集命令 → 毫秒级离散（双目基线误差大）\n硬触发：一根触发线同时接到所有相机的 TRIG 引脚 → 微秒级同步\nRM 双目测距/全景拼接必须硬触发。\n实现：MCU 发固定频率脉冲 → 相机设外触发模式 → 帧时间戳=脉冲时刻\n注意检查相机规格表的外触发输入电平（3.3V/5V/光耦隔离）。`) };

  DB["cv-b35"] = { level: 3, title: "参数热更新", body: "比赛场上想调阈值不能重启程序，怎么实现参数热更新？", hint: "配置文件监听或共享内存。", solution: C("text", "ans.txt", `方案A（简单）：JSON/YAML 配置文件 + inotify 监听，改文件即生效\n方案B（快）：共享内存（shm），调试工具写 / 视觉进程读，微秒级\n方案C（队内标准）：电控串口协议里留「调参指令」，操作手手柄按键就能调\n注意：热更新要原子（写一半的值不能被读走）——用版本号或双缓冲。\n把所有可调参数集中到一个结构体+日志记录每次变更，赛后复盘。`) };

  DB["cv-b36"] = { level: 3, title: "异常帧检测", body: "相机偶发输出全黑/花屏帧，写检测逻辑过滤掉再处理。", hint: "亮度统计+方差异常。", solution: C("python", "ans.py", `import numpy as np

def is_bad_frame(frame):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    mean, std = gray.mean(), gray.std()
    if mean < 5:      return True    # 全黑：曝光失败/掉线
    if mean > 250:    return True    # 全白：过曝/传感器故障
    if std < 3:       return True    # 无纹理：花屏/静止遮挡
    return False

# 管线里：
ret, frame = cap.read()
if not ret or is_bad_frame(frame):
    skip_and_log(frame)      # 记录时间戳跳过,连续10帧坏 → 报警切备用相机
    continue`) };

  DB["cv-b37"] = { level: 3, featured: true, title: "视觉系统开机自检", body: "写视觉程序启动自检清单：相机/模型/标定/串口四项，任何一项失败给出明确报错。", hint: "逐项 try + 明确错误码。", solution: C("python", "ans.py", `import cv2, serial, os

def self_check():
    checks = []
    # 1 相机
    cap = cv2.VideoCapture(0)
    ok, f = cap.read() if cap.isOpened() else (False, None)
    checks.append(("camera", ok and f is not None and f.mean() > 3,
                   "相机打开失败/画面全黑,查接线与曝光"))
    # 2 模型
    checks.append(("model", os.path.exists("best.engine"),
                   "TensorRT 引擎缺失,先转换模型"))
    # 3 标定
    checks.append(("calib", os.path.exists("camera.yaml"),
                   "相机标定文件缺失,先跑标定"))
    # 4 串口
    try:
        ser = serial.Serial("/dev/ttyUSB0", 460800, timeout=0.1)
        ser.close(); checks.append(("serial", True, ""))
    except Exception as e:
        checks.append(("serial", False, f"串口打开失败:{e}"))

    for name, ok, msg in checks:
        print(f"[{'PASS' if ok else 'FAIL'}] {name}" + (f" - {msg}" if not ok else ""))
    return all(ok for _, ok, _ in checks)

if not self_check():
    raise SystemExit("自检失败,禁止上场")`) };

  DB["cv-b38"] = { level: 2, title: "标定后验证", body: "标定完怎么验证标定质量？给出两个可执行的验证实验。", hint: "重投影误差+已知距离测量。", solution: C("text", "ans.txt", `实验1 重投影：把标定板的角点用内参+外参重投影回图像，和实测角点画在一起，偏差肉眼可见即不合格（数值上 <0.5px）。\n实验2 测距验证：把装甲板摆在已知距离（卷尺量 2.000m/4.000m/6.000m），PnP 解算距离和真值差应 <3%。6m 处差 20cm = 标定或角点坐标有系统偏差。\n顺手验证畸变矫正：拍直线网格，矫正后边缘直线不弯。`) };

  DB["cv-b39"] = { level: 3, title: "日志分级策略", body: "视觉程序日志怎么分级？比赛现场开哪级？", hint: "DEBUG/INFO/WARN/ERROR。", solution: C("text", "ans.txt", `DEBUG：每帧细节（检测框/置信度/耗时）→ 只在调试开\nINFO：状态变迁（模式切换/自动瞄准启停）→ 常开\nWARN：可自动恢复异常（单帧丢失/阈值边缘）→ 常开+计数\nERROR：致命（相机掉线/模型崩溃）→ 常开+蜂鸣报警\n比赛：INFO+WARN+ERROR，日志落盘带时间戳。\nDEBUG 帧级日志会拖慢管线（IO 瓶颈），严禁上场开着。`) };

  DB["cv-b40"] = { level: 3, featured: true, title: "综合实战：比赛日视觉 SOP", body: "比赛当天视觉组的完整操作清单：从进场到赛后，按时间线写。", hint: "进场/检录/赛前/赛中/赛后五段。", solution: C("text", "sop.txt", `进场（开赛前2小时）：
  ①上电自检通过（相机/模型/标定/串口）
  ②实测场地光照 → HSV 阈值微调 → 保存为「场馆配置」
  ③6m 固定靶命中率验证 ≥8/10
检录后：
  ④确认规则禁用项（激光/干扰灯）→ 调整曝光策略
  ⑤和电控对齐通信协议版本号
赛前5分钟：
  ⑥重启视觉程序（清内存碎片）→ 自检 → 预热推理（跑100帧）
  ⑦录像开关确认（赛后复盘素材）
赛中局间：
  ⑧看门狗日志扫描：有没有掉帧/误检尖峰
  ⑨对方如有激光干扰 → 提高曝光锁定值
赛后：
  ⑩立即导出日志+录像备份 → 复盘会前出数据报告
     （命中率/延迟分布/失败案例截图）`) };
})(window);
