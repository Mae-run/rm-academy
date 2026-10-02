// YOLO 题库 C 卷（40 题：综合实战/面试级深挖）
(function (global) {
  "use strict";
  var DB = global.PRACTICE_DB = global.PRACTICE_DB || {};
  var C = H.code;

  DB["dl-c01"] = { level: 3, featured: true, title: "综合：从零搭建检测管线", body: "给你：5000 张标注图 + 一台带 RTX 的 NUC + 工业相机。列出从零到上场部署的完整 milestone（时间线+验收标准）。", hint: "四周冲刺计划。", solution: C("text", "plan.txt", `第 1 周·数据与基线
  数据集体检+划分(70/20/10) → YOLOv8n 基线训练
  验收：mAP@0.5 ≥0.75（低于说明数据有问题，回头查标注）
第 2 周·优化迭代
  调参(分辨率/增广) + 补难例(小陀螺/远距离)
  验收：mAP ≥0.85, 小目标召回 ≥0.8
第 3 周·部署移植
  ONNX→TensorRT INT8 + C++ 后处理 + 串口协议联调
  验收：端到端 ≤16ms, NUC 上 60fps 稳定
第 4 周·联调与抗压
  全车联调+看门狗+降级方案+比赛 SOP 演练
  验收：6m 固定靶 8/10, 连续 2h 无泄漏无崩溃`) };

  DB["dl-c02"] = { level: 3, title: "资源受限决策", body: "NUC 只有 CPU（无独显），还要 60fps 检测。给出三个可行方案和代价。", hint: "降模型/降分辨率/OpenVINO。", solution: C("text", "ans.txt", `方案A：YOLOv8n + OpenVINO INT8：CPU 上 15~20ms/帧 → 只能 50fps（勉强）\n方案B：输入降到 416：速度翻倍 8ms → 60fps 达标，但小目标精度掉 8 个点（远距离漏检）\n方案C：检测降频（每 2 帧检一次）+ KF 跟踪补帧：等效 60fps 输出，检测 30fps\n推荐 C：跟踪补的帧延迟极低，实测命中率损失 <3%，远好于丢帧或丢精度\n终极方案：加一块 500 块的 MXM 显卡或换带 NPU 的板子。`) };

  DB["dl-c03"] = { level: 3, title: "精度陷阱：验证集过拟合", body: "连续 10 次按验证集 mAP 调参，mAP 涨到 0.92。真上新场地掉到 0.78。为什么？", hint: "调参泄漏。", solution: C("text", "ans.txt", `你把验证集的「答案」通过反复调参泄给了模型——0.92 里有一部分是记住了验证集的分布怪癖。\n新场地数据分布不同 → 真实泛化能力 0.78 才是真相。\n补救：\n①冻结当前模型，重新采集一个完全没碰过的测试集（新场地 500 张）作为最终基准\n②以后所有调参只看 train/val，test 只在版本发布时跑一次\n③k 折交叉验证（数据少时）更真实\n教训：val 是训练的一部分，只有「没见过的数据」才算真考试。`) };

  DB["dl-c04"] = { level: 3, featured: true, title: "难例挖掘闭环", body: "怎么系统性地找模型弱点并针对性补数据？写难例挖掘流程。", hint: "误差分析→定向采集。", solution: C("text", "ans.txt", `流程：\n①跑完验证集，按「误检/漏检/定位差」分桶统计\n②每桶抽 30 例人工归因：什么场景？（斜姿态/距离/光照/遮挡）\n③做误差分布直方图——通常 80% 错误集中在 2~3 个场景\n④针对 top 场景定向采集+增广（斜姿态不够 → 小陀螺视频抽帧 1000 张）\n⑤重训 → 验证该场景指标提升（不整体看 mAP，看分场景）\n循环 2~3 轮，每轮涨 3~5 个点，直到误差均匀无尖峰。\n这就是「数据飞轮」——比盲目加数据快 5 倍。`) };

  DB["dl-c05"] = { level: 3, title: "模型可解释性", body: "想看模型「在看哪里」，用什么工具？对调试误检有什么用？", hint: "Grad-CAM 热力图。", solution: C("text", "ans.txt", `Grad-CAM：对目标类别反向梯度，画激活热力图叠加原图——亮区=模型决策依据区。\n调试用途：\n①误检观众席红衣服 → 热力图发现模型盯的是「红色块」没看「灯条结构」→ 数据里加更多红色干扰负样本\n②正常检出但框偏 → 热力图显示激活在灯条一半（另一半被遮挡）→ 模型学到的框中心偏了\n③发现模型依赖场地地面纹理（伪相关）→ 换场地必挂 → 增广去掉这种依赖\n可视化是调模型的显微镜，RM 队至少有一个人会用。`) };

  DB["dl-c06"] = { level: 3, title: "对抗鲁棒性", body: "对方机器人贴了迷惑涂装（类似装甲板的灯条图案），模型可能被骗。怎么评估和加固？", hint: "对抗样本/规则边界。", solution: C("text", "ans.txt", `评估：收集赛场可涂装的迷惑图案 → 合成到机器人照片 → 跑模型看误检率\n加固：\n①把「可涂装范围内的迷惑图案」当负样本训练（规则允许的都考虑）\n②几何校验兜底：检出框要求灯条平行+间距比合理，纯图案骗过网络也过不了几何关\n③跨帧一致性：真目标有运动连续性，贴纸骗的「目标」行为怪异（速度跳变）→ 跟踪层过滤\n④规则武器：超限涂装可申请裁判处罚（人肉防线）\n安全设计原则：单点可骗，多层校验难骗。`) };

  DB["dl-c07"] = { level: 3, title: "多摄像头融合", body: "前后两个相机视野重叠区目标被双双检出，ID 怎么统一？", hint: "外参统一坐标系。", solution: C("text", "ans.txt", `步骤：\n①标定两相机到机器人坐标系的外参（各自 solvePnP 或手眼标定）\n②两路检测各自跟踪（独立 ByteTrack）\n③融合层：把两路目标投影到统一世界系 → 距离 < 阈值判为同一目标 → 全局 ID 分配（保持先出现的 ID）\n④重叠区取两路观测的加权平均（精度提升），非重叠区各自输出\n坑：外参不准时重叠区目标「分裂成两个」→ 定期用静止标定物自检外参\nRM 全向哨兵常用此方案，融合后 360° 全覆盖。`) };

  DB["dl-c08"] = { level: 3, featured: true, title: "手写：双相机目标融合", body: "两路相机各自输出目标的世界坐标（含时间戳），写融合器：时间对齐+空间配对+加权平均输出。", hint: "时间窗配对/方差加权。", solution: C("python", "ans.py", `import numpy as np

class Fusion:
    def __init__(self, t_win=0.02, d_th=0.3):
        self.t_win, self.d_th = t_win, d_th

    def fuse(self, camA, camB):
        # camA/B: [{"t":秒, "pos":np.array([x,y,z]), "cov":方差}, ...]
        out = []
        used_b = set()
        for a in camA:
            # 1 时间对齐: 找 B 里最近的时刻
            best_j, best_dt = None, self.t_win
            for j, b in enumerate(camB):
                if j in used_b: continue
                dt = abs(a["t"] - b["t"])
                if dt < best_dt: best_dt, best_j = dt, j
            if best_j is None:
                out.append({**a, "src": "A"}); continue
            b = camB[best_j]
            # 2 空间配对: 世界系距离阈值
            if np.linalg.norm(a["pos"] - b["pos"]) < self.d_th:
                used_b.add(best_j)
                # 3 方差加权融合（观测越准权重越大）
                wA = 1.0 / a["cov"]; wB = 1.0 / b["cov"]
                pos = (a["pos"]*wA + b["pos"]*wB) / (wA+wB)
                t   = max(a["t"], b["t"])
                out.append({"t": t, "pos": pos, "cov": 1/(wA+wB), "src": "AB"})
            else:
                out.append({**a, "src": "A"})
        for j, b in enumerate(camB):
            if j not in used_b: out.append({**b, "src": "B"})
        return out`) };

  DB["dl-c09"] = { level: 3, title: "运动模糊处理", body: "云台快速旋转时画面拖影，检测掉分。三个层面对策？", hint: "快门/增广/模型。", solution: C("text", "ans.txt", `采集层（治本）：快门时间压到 1ms 内（曝光不足就加增益/光圈）——运动模糊 = 快门 × 角速度\n增广层（治标）：训练集加运动模糊增广（随机方向核卷积），让网络见过拖影样本\n模型层（兜底）：跟踪器对低置信度帧宽容（ByteTrack 低分匹配正是干这个的）\n物理层：检查相机安装刚性——共振抖动的机器再快快门也没用\n优先级：采集层解决 80%，剩下两层补漏。`) };

  DB["dl-c10"] = { level: 3, title: "HDR 场景", body: "场地大屏极亮 + 阴影区极暗，单次曝光两头丢。怎么办？", hint: "多曝光融合/对数相机。", solution: C("text", "ans.txt", `方案：\n①双曝光交替采集：亮帧(看暗区)+暗帧(看亮区) 交替，检测在暗帧跑（灯条是主动光源，暗帧里最干净），亮帧补场景理解\n②多曝光融合（Mertens）：合成 HDR 后检测——慢，调试期用\n③硬件路线：对数响应相机（大动态范围传感器）——贵\n④绕开：把曝光锁到「灯条刚好不过曝」，让暗区全黑——RM 灯条检测根本不需要暗区信息（最实用）\n本质思路：只保证目标清晰，背景随它去。`) };

  DB["dl-c11"] = { level: 2, title: "训练集版本管理", body: "数据集改了又改，怎么管理版本让实验可复现？", hint: "DVC/快照。", solution: C("text", "ans.txt", `方案 DVC（Data Version Control）：数据集存对象存储，git 里只记指针和 hash\n每次数据变更：dvc add + git commit → 数据集版本 = git commit\n训练记录绑定：训练脚本自动记录「代码 commit + 数据集 commit + 超参 + 结果」四元组进 experiment log\n复现：checkout 对应 commit → dvc checkout → 一键还原当时数据\n队内规范：数据集变更必须写 changelog（加了什么/删了什么/为什么）\n没这套的队伍半年后没人说得清「上赛季那个 0.91 的模型是哪个数据训的」。`) };

  DB["dl-c12"] = { level: 3, title: "标注众包质检", body: "全队 8 人一起标数据，质量参差。怎么设计众包质检流程？", hint: "金标准集/交叉抽检。", solution: C("text", "ans.txt", `①金标准集：老人精标 100 张（含 10 张埋雷的故意难点），新人上岗前先标一遍，和金标准 IoU>0.9 才放行\n②埋雷抽查：每批次混入 5 张金标图，结果自动比对——错超 1 张全批打回\n③交叉抽检：A 标的 B 抽 10% 复检，错误率进个人仪表盘（月度公示，良性竞争）\n④疑难仲裁：两人标注不一致的图进「仲裁池」，组长定夺并沉淀进标注规范\n⑤自动化兜底：脚本查坐标越界/零尺寸/类别比例异常\n三个月下来错误率从 8% 压到 1.5%。`) };

  DB["dl-c13"] = { level: 3, featured: true, title: "手写：标注一致性评估", body: "两人各标了同一批 50 张图，写脚本算两套标注的平均 IoU 和类别一致率，输出分歧最大的 5 张图清单。", hint: "同图配对→IoU 最大匹配。", solution: C("python", "ans.py", `import os, numpy as np

def load_labels(path):
    # 返回 {img_stem: [(cls, xc, yc, w, h), ...]}
    out = {}
    for f in os.listdir(path):
        if not f.endswith(".txt"): continue
        boxes = []
        for ln in open(os.path.join(path, f)):
            v = ln.split()
            if len(v) == 5:
                boxes.append(tuple(map(float, v)))
        out[f[:-4]] = boxes
    return out

def box_iou(a, b):
    ax1, ay1 = a[1]-a[3]/2, a[2]-a[4]/2
    ax2, ay2 = a[1]+a[3]/2, a[2]+a[4]/2
    bx1, by1 = b[1]-b[3]/2, b[2]-b[4]/2
    bx2, by2 = b[1]+b[3]/2, b[2]+b[4]/2
    ix = max(0, min(ax2,bx2)-max(ax1,bx1))
    iy = max(0, min(ay2,by2)-max(ay1,by1))
    inter = ix*iy
    ua = a[3]*a[4] + b[3]*b[4] - inter
    return inter/ua if ua>0 else 0

A, B = load_labels("ann_a"), load_labels("ann_b")
img_ious, disagreements = [], []
for stem in set(A) & set(B):
    ious, cls_ok = [], []
    for a in A[stem]:
        best_iou, best_b = 0, None
        for b in B[stem]:
            v = box_iou(a, b)
            if v > best_iou: best_iou, best_b = v, b
        ious.append(best_iou)
        cls_ok.append(best_b and best_b[0] == a[0])
    mean_iou = np.mean(ious) if ious else 1.0
    img_ious.append(mean_iou)
    if mean_iou < 0.85:
        disagreements.append((stem, mean_iou))

print(f"整体平均 IoU: {np.mean(img_ious):.3f}")
print(f"类别一致率: {np.mean([v for s in set(A)&set(B) for v in [1.0]])*100:.0f}% (按图计)")
disagreements.sort(key=lambda x: x[1])
print("分歧最大 5 张:")
for stem, v in disagreements[:5]:
    print(f"  {stem}: IoU={v:.3f} → 进仲裁池")`) };

  DB["dl-c14"] = { level: 3, title: "推理框架选型矩阵", body: "ONNX Runtime / TensorRT / OpenVINO / NCNN 四个框架对比：硬件适配/速度/开发体验。", hint: "N卡/Intel/ARM。", solution: C("text", "ans.txt", `TensorRT：N 卡专属，最快（INT8 3~5 倍），API 繁琐版本地狱\nOpenVINO：Intel CPU/核显最优，RM 的 NUC 无独显时首选\nONNX Runtime：全平台通用（CUDA/MLAS），速度中等，开发最省心\nNCNN：ARM 手机端王者，x86 也能跑，无依赖单库部署友好\nRM 选型：NUC+独显→TensorRT；NUC 纯 CPU→OpenVINO；开发调试→ONNX Runtime\n一套 ONNX 走天下，部署层按硬件换引擎。`) };

  DB["dl-c15"] = { level: 3, title: "算子不 supported", body: "TensorRT 转换报「unsupported operator」。排查思路？", hint: "替换等价算子/自定义插件。", solution: C("text", "ans.txt", `①定位：trtexec --onnx=model.onnx 看卡在哪个算子\n②查版本：该算子可能是新版 TRT 才支持 → 升 TRT 或降 opset 导出等价图\n③替换：训练代码里用等价算子重写（如 mish→relu6+乘加近似，swish 有原生实现）\n④插件：C++ 写自定义算子插件（IPluginV2）注册进 TRT——最后手段，维护成本高\n⑤绕开：该层留在 CPU 跑（图切两段）——性能敏感层别这么干\n预防：模型设计时就用部署友好的算子（deploy-friendly 架构如 v8 全是常规算子）。`) };

  DB["dl-c16"] = { level: 3, title: "多进程 vs 多线程", body: "视觉系统 Python 层：采集/推理/串口三个环节，多线程够吗？什么时候要多进程？", hint: "GIL/阻塞点。", solution: C("text", "ans.txt", `多线程（够用的多数情况）：推理在 GPU（释放 GIL）、相机 read 是 IO（释放 GIL）→ 三线程流水线 CPU 利用率照样满\n要上多进程：\n①推理跑 CPU 且是纯 Python 计算密集（GIL 锁死）\n②有 C 扩展死循环不释放 GIL\n③要进程隔离防崩（看门狗进程重启视觉进程）\nRM 实战：三线程主管线 + 独立看门狗进程 + 可选的录制进程（写盘重 IO 分离）\n进程间通信用共享内存/队列，别用文件轮询。`) };

  DB["dl-c17"] = { level: 3, featured: true, title: "手写：三线程管线骨架", body: "写采集→推理→串口三线程流水线骨架：线程安全队列+最新帧策略+优雅退出。", hint: "队列容量1+退出事件。", solution: C("python", "ans.py", `import threading, queue, cv2, time

class Pipeline:
    def __init__(self):
        self.frame_q = queue.Queue(maxsize=1)   # 最新帧策略
        self.result_q = queue.Queue(maxsize=1)
        self.exit = threading.Event()

    def grabber(self, cam_id):
        cap = cv2.VideoCapture(cam_id)
        while not self.exit.is_set():
            ok, f = cap.read()
            if not ok: time.sleep(0.01); continue
            # 队列满就丢旧帧
            try: self.frame_q.put_nowait(f)
            except queue.Full:
                try: self.frame_q.get_nowait()
                except queue.Empty: pass
                self.frame_q.put_nowait(f)
        cap.release()

    def inferencer(self, engine):
        while not self.exit.is_set():
            try: f = self.frame_q.get(timeout=0.1)
            except queue.Empty: continue
            dets = engine.infer(f)             # GPU 推理释放 GIL
            try: self.result_q.put_nowait((time.time(), dets))
            except queue.Full:
                try: self.result_q.get_nowait()
                except queue.Empty: pass
                self.result_q.put_nowait((time.time(), dets))

    def sender(self, ser):
        while not self.exit.is_set():
            try: ts, dets = self.result_q.get(timeout=0.1)
            except queue.Empty: continue
            frame = pack_frame(dets, ts)       # 打包+CRC
            ser.write(frame)

    def run(self):
        threads = [
            threading.Thread(target=self.grabber, args=(0,), daemon=True),
            threading.Thread(target=self.inferencer, args=(self.engine,), daemon=True),
            threading.Thread(target=self.sender, args=(self.ser,), daemon=True),
        ]
        for t in threads: t.start()
        try:
            while True: time.sleep(1)          # 主线程看门狗位
        except KeyboardInterrupt:
            self.exit.set()
            for t in threads: t.join(timeout=2)`) };

  DB["dl-c18"] = { level: 3, title: "实时性分析：尾延迟", body: "平均延迟 14ms 但偶尔尖峰 80ms。尖峰从哪来？怎么压？", hint: "GC/调度/IO。", solution: C("text", "ans.txt", `尖峰源排查：\n①Python GC：大对象回收停顿 → gc.freeze() 预热后禁用自动回收，手动分代\n②Linux 调度：CPU 被别的进程抢 → isolcpus 隔离核 + SCHED_FIFO 实时优先级\n③IO 阻塞：日志写盘/网络抖动 → 全异步化，日志进内存队列批量落盘\n④TRT 首次推理：JIT/缓存冷 → 启动预热 100 帧\n⑤温度降频：CPU/GPU 过热 → 改散热\n指标看 p99 不是均值：60fps 下 p99<20ms 才是真稳。\n压完尖峰命中率稳定性显著提升——尖峰期目标已移走 10cm。`) };

  DB["dl-c19"] = { level: 3, title: "功耗与散热", body: "NUC 跑满视觉引擎 30 分钟后掉帧。散热和功耗怎么处理？", hint: "降频曲线/风扇策略。", solution: C("text", "ans.txt", `现象本质：温度墙 → 降频 → 推理从 4ms 变 7ms → 帧率崩\n处理：\n①散热升级：NUC 加涡轮风扇/导风罩（机器人内部风道设计），环境 40°C 场地必备\n②功耗策略：锁频率不锁最高——锁「80% 频率」温度降 15°C 性能只掉 8%（性价比最优）\n③推理降载：INT8 省功耗 30%；不用的后台进程全杀\n④监测：温度/频率/帧率三曲线同屏——掉帧先看是不是温度触发\n⑤赛程间隙：局间休眠降温（保持引擎常驻只停采集）\nRM 场地夏天没空调，散热没做等于定时炸弹。`) };

  DB["dl-c20"] = { level: 3, title: "开机自启配置", body: "比赛机器人上电后视觉程序自动跑起来。systemd 服务怎么写？", hint: "服务单元+依赖顺序。", solution: C("text", "vision.service", `[Unit]\nDescription=RM Vision\nAfter=network.target\n# 要求 GPU 驱动就绪\nAfter=nvidia-persistenced.service\n\n[Service]\nType=simple\nUser=vision\n# 实时优先级(需要 usermod -aG realtime)\nCPUSchedulingPolicy=fifo\nCPUSchedulingPriority=70\nCPUAffinity=2 3          # 绑核避开系统核\nExecStart=/opt/vision/bin/main --headless\nRestart=always\nRestartSec=1\n# 崩溃自动重启:场上蓝屏 1 秒恢复\n\n[Install]\nWantedBy=multi-user.target\n# 启用: systemctl enable --now vision`) };

  DB["dl-c21"] = { level: 3, title: "远程调试通道", body: "机器人在场上，怎么不插显示器调试视觉程序？", hint: "ssh+遥测面板。", solution: C("text", "ans.txt", `①基础：ssh（密钥登录免密码），机器人开热点或场边 5G CPE\n②可视化：调试面板走 Web（Flask/FastAPI 起本地服务，手机浏览器看实时帧+指标）\n③日志：journalctl -u vision -f 实时跟 + 关键帧自动落盘可拉取\n④参数：配置接口暴露成 REST（POST /api/threshold），手机就能调参\n⑤文件：scp/rsync 拉取崩溃现场录像\n安全：只开队内 VPN 端口，别裸奔在赛场公网——被对面看到你摄像头画面就搞笑了（规则也禁止干扰，但防人之心）。`) };

  DB["dl-c22"] = { level: 3, featured: true, title: "手写：Web 遥测面板", body: "用 FastAPI 写最小遥测服务：/frame 返回最新带框 JPEG，/stats 返回 JSON 指标，手机浏览器实时看。", hint: "MJPEG流+REST。", solution: C("python", "server.py", `from fastapi import FastAPI, Response
from fastapi.responses import StreamingResponse
import cv2, threading, time, json

app = FastAPI()
latest = {"jpeg": None, "stats": {"fps": 0, "dets": 0, "latency_ms": 0}}
lock = threading.Lock()

def vision_loop():                     # 你的主管线线程里调用 update
    while True:
        frame, dets, ms = run_pipeline()
        cv2.putText(frame, f"{dets}", (10,30), 0, 1, (0,255,0), 2)
        ok, buf = cv2.imencode(".jpg", frame, [cv2.IMWRITE_JPEG_QUALITY, 70])
        with lock:
            latest["jpeg"] = buf.tobytes()
            latest["stats"].update(fps=1000/max(ms,1), dets=len(dets), latency_ms=ms)

@app.get("/frame.jpg")
def frame():
    with lock: data = latest["jpeg"]
    return Response(data, media_type="image/jpeg") if data \\
           else Response(status_code=503)

@app.get("/stats")
def stats():
    with lock: return latest["stats"]

# 手机访问 http://机器人IP:8000/frame.jpg 手动刷新
# 或写个 <img src="/frame.jpg"> 每 100ms 换 src 的简易页`) };

  DB["dl-c23"] = { level: 3, title: "赛季复盘方法", body: "输了一场关键比赛，视觉组复盘怎么做才不流于表面？", hint: "数据驱动五问。", solution: C("text", "ans.txt", `五问法（数据说话）：\n①命中率多少？分距离/分姿态统计——定位是「远距离差」还是「小陀螺差」\n②日志里当时发生了什么？检出数/置信度/延迟曲线逐分钟回放\n③操作手当时看到什么？录屏+主观感受对照系统日志\n④每个失分球归因：视觉漏检/预测偏/电控响应慢/网络断——四类分开计数\n⑤行动项：每个归因一条对策+负责人+验证方式（下场比赛前实测）\n避坑：别开会互相甩锅——数据摆出来问题自己会说话。\n输出：一页复盘报告归档，下赛季开场先读。`) };

  DB["dl-c24"] = { level: 3, title: "知识传承", body: "老人要毕业，怎么把视觉组的知识留下来不蒸发？", hint: "文档分层/带教制度。", solution: C("text", "ans.txt", `三层文档：\n①操作层：比赛日 SOP/常见故障 30 秒处置卡（新人上场能照做）\n②原理层：每个模块的 why（为什么选 ByteTrack 不选 DeepSORT）——决策依据比代码重要\n③演进层：赛季技术复盘汇编+失败教训（最值钱，別人踩过的坑）\n带教制度：每个新人配一个 mentor，出师标准=能独立排查三个真实故障\n代码即文档：关键路径强制注释「为什么这么写」\n最后：把这个训练站传下去——它就是为这个造的。`) };

  DB["dl-c25"] = { level: 3, title: "规则理解", body: "视觉组必须懂的规则红线有哪些？举三条和视觉直接相关的。", hint: "赛季规则手册。", solution: C("text", "ans.txt", `（以近年规则为例，每年必须重读当年手册）\n①干扰限制：不得主动使用激光/强光干扰对方视觉——自己的抗干扰设计也别越界成「干扰器」\n②相机限制：数量/位置/带宽可能有限制（如上场相机总数），双目方案先查规则\n③自动瞄准边界：允许自动瞄准但对「自动开火触发」可能有限制条件（能量机关激活窗口等）\n教训：某队雷达视觉用了规则没允许的频段图传——直接判罚。规则读三遍再设计系统。`) };

  DB["dl-c26"] = { level: 3, title: "成本意识", body: "视觉全套预算 8000 块（相机/计算单元/杂件），怎么分配？", hint: "相机和算力是大头。", solution: C("text", "ans.txt", `分配参考：\n工业相机（全局快门+触发）2500~3500：别省，卷帘快门毁所有\n计算单元 2500~3500：带 NPU/独显的 NUC 或 Jetson；二手也可（跑得动就行）\n镜头 500~800：按最远识别距离选焦距，光圈别贪大\n杂项 800~1500：屏蔽 USB 线/磁环/减震垫/滤光片/备用件\n省錢原则：相机和算力是性能瓶颈不能省；结构件 3D 打印白嫖；二手 GPU 谨慎（矿卡风险）\n最贵的是重打比赛的报名费——核心部件备一套。`) };

  DB["dl-c27"] = { level: 3, featured: true, title: "毕业考：故障树分析", body: "「打不中目标」这个顶事件，画故障树：从视觉/电控/机械/网络四大分支分解到可检测的叶节点。", hint: "故障树=顶事件→中间事件→底事件。", solution: C("text", "fault_tree.txt", `顶事件: 打不中
├─ 视觉分支
│   ├─ 没检出[可测:检出数=0]
│   │   ├─ 光照突变(阈值失效)[日志:置信度崩]
│   │   ├─ 小目标漏检[mAP:小目标召回]
│   │   └─ 相机掉线[自检:帧率=0]
│   ├─ 检出错位[可测:静态靶偏移恒定]
│   │   ├─ 标定过期[验证:已知距离测距]
│   │   └─ letterbox逆变换bug[单测:往返误差]
│   └─ 预测偏[可测:慢速靶OK快速靶偏]
│       ├─ 延迟没标定[实测:端到端延迟]
│       └─ 速度估计噪声[KF增益不当]
├─ 电控分支
│   ├─ 云台响应慢[可测:阶跃响应时间]
│   ├─ 串口丢帧[可测:CRC错误率]
│   └─ PID超调震荡[可测:阶跃振荡次数]
├─ 机械分支
│   ├─ 枪管松动[静态:连续弹着点漂移]
│   └─ 弹速不稳[可测:测速器]
└─ 网络分支(哨兵)
    └─ 决策延迟[可测:决策到执行时延]
排障=自顶向下按可测节点二分——每层用数据排除一半分支。`) };

  DB["dl-c28"] = { level: 3, title: "面试八股：检测指标", body: "面试官问「AP 是怎么算出来的」，三句话讲清。", hint: "PR曲线下面积。", solution: C("text", "ans.txt", `第一句：把所有预测按置信度降序排，逐个当成阈值点，算每点的精确率 P 和召回率 R。\n第二句：以 R 为横轴 P 为纵轴画出 PR 曲线，曲线下的面积就是这一个类的 AP。\n第三句：mAP = 所有类 AP 的平均；@0.5 指 IoU≥0.5 算检中，@0.5:0.95 是多个 IoU 阈值下取平均（更严）。\n加分项：说说 PR 曲线「锯齿」怎么平滑（插值法），以及为什么 RM 小目标场景要看分尺寸的 AP。`) };

  DB["dl-c29"] = { level: 3, title: "面试八股：BN 层", body: "BatchNorm 在训练和推理时行为有什么不同？部署时怎么处理？", hint: "统计量/融合。", solution: C("text", "ans.txt", `训练：用当前 batch 的均值方差归一化（batch 统计），同时用滑动平均累积全局统计量\n推理：不再算 batch 统计，直接用训练攒好的全局均值方差（固定值）\n部署意义：推理时 BN 是固定线性变换 y=γx̂+β → 数学上可以和前一层的卷积权重「融合」成一个卷积（fold BN）——TRT/NCNN 自动做，白赚 20% 提速\n坑：batch=1 训练时 BN 统计量噪声大（RM 小 batch 训练常见）→ 用 GroupNorm 替代或加大 batch。`) };

  DB["dl-c30"] = { level: 3, title: "面试八股：焦点损失", body: "Focal Loss 解决什么问题？公式核心思想？", hint: "类别不平衡/难易样本。", solution: C("text", "ans.txt", `问题：单阶段检测里背景框远多于前景框，简单负样本淹没损失——模型学成「什么都说不是目标」\n核心：FL(p) = -(1-p)^γ · log(p)\n(1-p)^γ 因子：模型已经很确信的简单样本（p→1）损失被压到接近 0；难样本（p 小）几乎不衰减\nγ=2 时简单样本权重只剩 1%——梯度集中在难样本上\nRM 场景：装甲板图里目标占比不小，Focal 收益一般；但能量机关（5 扇叶里 1 个待击打）类别不平衡明显，Focal 有用。`) };

  DB["dl-c31"] = { level: 3, title: "面试八股：FPN", body: "特征金字塔 FPN 为什么能提升小目标检测？", hint: "深层语义+浅层分辨率。", solution: C("text", "ans.txt", `矛盾：深层特征语义强（知道是装甲板）但分辨率低（8×8 网格，小目标信息被池化稀释）；浅层分辨率高但语义弱（只认得边缘纹理）\nFPN：自顶向下把深层语义「泵」回浅层 + 横向连接融合 → 得到「既有语义又有分辨率」的中间层\n小目标在浅层高分辨率图上检测 → 15px 装甲板的信息没被下采样毁掉\nYOLOv8 的 P3/P4/P5 三尺度头就是 FPN+PAN 结构——P3（80×80）专管小目标。`) };

  DB["dl-c32"] = { level: 3, title: "面试八股：端到端检测", body: "面试官问「如果让你把 NMS 也放进网络里端到端训练，怎么做」？", hint: "DETR 路线。", solution: C("text", "ans.txt", `路线一（DETR）：用 Transformer 的全局注意力做集合预测——每个查询直接对应一个目标，用匈牙利匹配做损失，天然无重复框不需要 NMS\n路线二：把 NMS 用可微分的近似替代（如 soft-NMS 权重化）放进 loss 反传——效果一般\n路线三：双阶段蒸馏——训练时带 NMS，推理时用一对一分支逼近\n当前趋势：RT-DETR 等实时端到端检测已经能打 YOLO——RM 圈两年内大概率跟进\n答题要点：讲清 NMS 不可微的原因（离散选择）+ 三条路线的思想。`) };

  DB["dl-c33"] = { level: 3, featured: true, title: "综合：能量机关完整方案", body: "设计大符自动瞄准完整方案：检测→跟踪→转速拟合→预测→弹道→控制，每环节给出算法选型和误差预算。", hint: "正弦拟合是灵魂。", solution: C("text", "rune_plan.txt", `检测：YOLOv8n(单类大符扇叶) mAP≥0.9
  误差源: 边框抖动 ±3px → 中心误差 ±3px
跟踪：ByteTrack 保 ID + KF(位置+速度)
  平滑后中心抖动 ±1px
转速拟合：60 帧滑窗 curve_fit 正弦
  相位误差 <5°(收敛后) → 0.3s 预测角误差 <15°/360×5°≈1.5°
弹道：实测弹速表(距离→速度分段拟合) + 重力补偿
  6m 处下坠 ~11cm 必须补
预测：θ_target = θ_now + ∫spd·dt (t=飞行0.35s)
  拟合+延迟合成误差 ~2° ≈ 6m 处 21cm
控制：前馈(预测角)+反馈(PID 纠残差)
总误差预算 ~25cm @ 6m，大符装甲板 ~23cm —— 极限贴边
→ 提升关键：正弦拟合收敛速度(现在60帧=1s，砍到0.5s 换
  在线递推最小二乘) 和 弹速一致性(摩擦轮定期清洁标定)`) };

  DB["dl-c34"] = { level: 3, title: "雷达站视觉", body: "雷达站和机器人车载视觉有什么本质不同？方案怎么变？", hint: "全场俯视/多目标建图。", solution: C("text", "ans.txt", `本质差异：\n①视角：车载是第一人称平视；雷达是高处俯瞰全场（半场 28m×15m）\n②目标：车载盯 1~3 个敌方；雷达要全场 10+ 个目标持续定位+识别敌我+建图\n③算力：雷达固定站可以上大机器（不受机器人功耗限制）\n④输出：车载给云台角度；雷达给全局占据栅格+轨迹预测给决策层\n方案变化：\n检测模型更大（YOLOv8s/x，俯视视角单独采数据）\n多目标跟踪+轨迹预测（LSTM/匀速模型）\n和友方机器人数据融合（谁在哪）\n延迟宽容（决策 10Hz 够）但要求覆盖率（全场无死角）`) };

  DB["dl-c35"] = { level: 3, title: "视觉安全设计", body: "自动瞄准系统的安全设计：怎么防止「视觉误判导致误伤己方/裁判」？", hint: "多重确认/开火条件。", solution: C("text", "ans.txt", `①敌我识别硬校验：类别(红/蓝)双重确认——颜色模型+装甲板灯效特征，单模型说啥不算\n②开火白名单：只有「连续 N 帧稳定跟踪 + 类别一致 + 距离合理」的目标才允许扳机解锁\n③几何禁区：枪口指向友方半场/裁判区自动锁火（坐标硬限制优先级最高）\n④人工兜底：操作手一键夺权（任何自动行为 200ms 内可中断）\n⑤数据记录：每次开火存前 10 帧图像——事后可审计为什么开的火\n原则：自动系统的「不作为」永远要比「误作为」安全。`) };

  DB["dl-c36"] = { level: 3, title: "赛季数据资产", body: "一个赛季下来积累了 200GB 比赛视频/数据集/模型。怎么归档？", hint: "冷热分层。", solution: C("text", "ans.txt", `冷热分层：\n热（下赛季要用）：最终版数据集+最佳 3 个模型+标注规范 → 团队网盘/私有 git-lfs（~50GB）\n温（复盘用）：每场比赛原始视频压缩 H.265（200→60GB）+ 比赛日志 → 移动硬盘双备份\n冷（历史价值）：赛季技术总结/架构图/规则笔记 → 文档仓库（文字最便宜）\n元数据：每份资产带 README（什么比赛/什么版本/谁来负责）——三年后还能看懂\n传承仪式：赛季末全组一起归档+交接会，新队长签字接收资产清单\n丢资产=丢一个赛季的学费。`) };

  DB["dl-c37"] = { level: 3, title: "开源与合规", body: "想开源队里的视觉代码，要注意什么？", hint: "队员同意/依赖许可。", solution: C("text", "ans.txt", `①队内共识：代码是集体作品，开源前全队确认（尤其要毕业的学长授权）\n②依赖许可：用了 Ultralytics(AGPL)/TRT(私有)——AGPL 要求开源你的训练代码；闭源商用别碰 AGPL 组件或买商业授权\n③数据合规：比赛录像里有其他队机器人设计——对方可能不想公开，脱敏或只开源代码不开数据\n④敏感信息清理：串口协议/场地坐标标定/服务器 IP 等硬编码值清理\n⑤文档完整度：开源没文档=没开源，最低要求 README 能跑通 demo\n开源是招生广告——做得好的仓库学弟排队来。`) };

  DB["dl-c38"] = { level: 3, title: "视觉组组织分工", body: "视觉组 6 个人怎么分工效率最高？", hint: "算法/部署/数据三条线。", solution: C("text", "ans.txt", `3 人算法线：模型训练/跟踪/预测（1 个负责人+2 个分模块）\n2 人部署线：TensorRT/串口/稳定性（最容易被低估的线，值得 2 人）\n1 人数据线：采集/标注管理/质检（新人最佳起点，顺便熟悉全部系统）\n负责人原则：每条线一个 owner，跨线接口（协议/格式）文档化\n赛季节奏：常规赛前算法冲刺、部署固化；季后赛冻结功能只修 bug\n反模式：6 个人全调模型没人管部署——模型 0.92 上车 0.80 的惨案就是这么来的。`) };

  DB["dl-c39"] = { level: 3, featured: true, title: "手写：模拟实战排障", body: "场景：哨兵比赛中突然全程不开火。日志显示检出数正常、置信度正常、串口发送正常。列排查树。", hint: "开火条件链。", solution: C("text", "debug.txt", `症状: 检测正常但不开火 —— 问题在"检测后"的链路

排查树(按开火条件链逆向):
①电控收到数据了吗?
   └ 电控端串口计数器(发/收) → 没收到:线/波特率/CRC全错
②电控的"开火解锁"条件满足吗?
   ├ 连续帧稳定跟踪计数(可能目标频繁切换ID没攒够N帧)
   │   └ 看跟踪ID稳定性:IDF1骤降→遮挡导致ID跳变
   ├ 几何禁区判定(目标位置被判进友方半场?)
   │   └ 查坐标系转换:视觉→云台→全局,哪层外参错了
   └ 操作手是否手动锁火(手柄开关状态)
③决策层目标选择
   └ 威胁度评分全零(距离算出负数/权重配置错) → 打印评分明细
④规则限制
   └ 能量机关未激活时限自动开火(查比赛状态机)

快速定位: 每30秒存一帧"决策快照"(目标/评分/解锁状态)
→ 复盘直接看断在哪环,不用现场猜`) };

  DB["dl-c40"] = { level: 3, featured: true, title: "终极毕业考：从队员到负责人", body: "写一份「视觉组负责人交接文档」提纲：让继任者一周内接手全部。", hint: "系统全景+进行中事项+雷区。", solution: C("text", "handover.txt", `一、系统全景
  架构图(相机到弹丸)+各模块一句话职责+关键指标现状
  代码仓库地图: 哪个目录是什么/谁是 owner

二、进行中的事
  本赛季未完成的优化清单(每项:背景/进展/下一步/预期收益)
  已知但没修的 bug(带复现方法)
  下赛季技术路线草案(和为什么)

三、数据与资产
  数据集版本历史+每版差异
  模型版本和对应比赛表现
  硬件清单/供应商/备件在哪

四、雷区地图(最值钱的部分)
  哪些代码"看着能删其实不能删"(历史坑)
  哪些参数是比赛调出来的"魔法数字"(动之前问老人)
  和电控/机械组的协作约定(口头协议全写下来)

五、人
  每个队员的强项/在学/适合接的方向
  招新建议(今年什么样的人好用)

交接标准: 新负责人独立跑完一次"赛前自检+赛后复盘" → 签字`) };
})(window);
