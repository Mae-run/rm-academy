// YOLO 题库 B 卷（40 题：部署/跟踪/能量机关/联调）
(function (global) {
  "use strict";
  var DB = global.PRACTICE_DB = global.PRACTICE_DB || {};
  var C = H.code;

  DB["dl-b01"] = { level: 2, title: "部署环境清单", body: "NUC 上部署视觉系统，列 Linux 环境安装清单（驱动/库/工具）和验证命令。", hint: "NVIDIA驱动/CUDA/TRT/OpenCV/串口。", solution: C("text", "ans.txt", `# 基础\nsudo apt install build-essential cmake git\n# NVIDIA（NUC 有独显时）\nsudo apt install nvidia-driver-535\nnvidia-smi                    # 验证驱动\n# CUDA + cuDNN（按 TRT 版本配）\nnvcc --version\n# TensorRT\ntar -xzvf TensorRT-8.6.tar.gz && cd TensorRT-8.6/python && pip install tensorrt-*.whl\npython -c "import tensorrt; print(tensorrt.__version__)"\n# OpenCV + 串口\npip install opencv-python\nsudo apt install libserial-dev && sudo usermod -aG dialout $USER\nls /dev/ttyUSB*              # 串口权限验证`) };

  DB["dl-b02"] = { level: 3, featured: true, title: "Docker 部署方案", body: "为什么 RM 视觉用 Docker 部署？写 Dockerfile 要点（CUDA/TRT/串口/相机设备）。", hint: "环境锁定/设备映射。", solution: C("text", "Dockerfile", `FROM nvcr.io/nvidia/tensorrt:23.06-py3\n# 基础镜像自带 CUDA+TRT，省 80% 配置坑\nRUN apt-get update && apt-get install -y \\\n    libopencv-dev python3-opencv libserial-dev\nRUN pip install onnxruntime opencv-python pyserial\nCOPY vision/ /app/vision/\nWORKDIR /app/vision\n# 运行时:\n#   --gpus all                     GPU 直通\n#   --device /dev/video0           相机\n#   --device /dev/ttyUSB0          串口\n#   --privileged --net=host        需要 ICMP/低延迟时\nCMD ["python3", "main.py", "--headless"]`) };

  DB["dl-b03"] = { level: 3, title: "引擎构建时机", body: "TensorRT engine 构建要 3~5 分钟，比赛机重启后不能等。怎么解决？", hint: "缓存+启动预热。", solution: C("text", "ans.txt", `方案：①首次构建后缓存 engine 文件（带 GPU+TRT 版本指纹命名），下次秒加载 ②系统服务里加「启动即预热」：开机自启跑 100 帧空推理，比赛前已完成 JIT 和显存分配 ③缓存失效自动重建（检测 GPU 变化）\n注意 engine 和构建它的 TRT/CUDA 版本强绑定——升级驱动后旧 engine 失效，要有重建兜底逻辑。`) };

  DB["dl-b04"] = { level: 2, title: "onnxruntime 验证流程", body: "导出 ONNX 后怎么验证它和 PyTorch 结果一致？写验证代码框架。", hint: "同输入比对输出。", solution: C("python", "ans.py", `import torch, onnxruntime as ort, numpy as np

model = torch.load("best.pt").eval()
dummy = torch.randn(1, 3, 640, 640)

# PyTorch 参考
with torch.no_grad():
    ref = model(dummy).numpy()

# ONNX 推理
sess = ort.InferenceSession("best.onnx")
out = sess.run(None, {"images": dummy.numpy()})[0]

diff = np.abs(ref - out).max()
print(f"最大偏差: {diff:.2e}")      # <1e-4 合格
assert diff < 1e-3, "ONNX 导出结果漂移!\")`) };

  DB["dl-b05"] = { level: 3, featured: true, title: "内存泄漏排查", body: "视觉程序跑 2 小时后 OOM（内存从 1.2G 涨到 4G）。列四个常见泄漏点和定位工具。", hint: "Mat缓存/日志/TRT context/回调。", solution: C("text", "ans.txt", `常见泄漏点：\n①调试图像缓存：debug 帧append进list没清 → 每帧 3MB × 60fps = 每分钟 10GB 增速（最大嫌疑）\n②TensorRT context/buffer 重复创建：每次推理 new context 不释放\n③日志无上限写盘（同时占内存缓冲）\n④Python 闭包循环引用+大对象\n定位工具：\nPython: tracemalloc（按行统计增量）\nC++: heaptrack / valgrind massif\n监控：watch -n5 'ps -o rss= -p PID' 看增长曲线——线性增长=稳定泄漏`) };

  DB["dl-b06"] = { level: 3, title: "GPU 显存管理", body: "推理程序显存一直涨到爆。什么原因？怎么修？", hint: "缓冲未复用。", solution: C("text", "ans.txt", `原因：每帧为输入/输出张量新建 CUDA buffer，旧的没释放（Python gc 不及时/C++ 忘 delete）。\n修复：启动时分配一次固定 buffer，之后每帧复用（覆写）——零分配零释放。\nC++: 类成员持有 device buffer 指针，析构统一释放\nPython: 用 PyTorch 的 pre-allocated tensor + copy_\n验证：nvidia-smi 看显存曲线应恒定不涨。`) };

  DB["dl-b07"] = { level: 2, title: "串口通信协议设计", body: "视觉→电控串口帧设计：帧头/数据/校验。为什么用 CRC8 而不是校验和？帧率多少合适？", hint: "检错能力/240Hz。", solution: C("text", "ans.txt", `帧结构：[0xA5 帧头][长度][目标x int16][目标y int16][距离 uint16][时间戳 uint32][CRC8]\nCRC8 vs 累加和：和校验交换两个字节错误仍通过；CRC8 能检出绝大多数错位/翻转\n发送频率：视觉 60fps 每帧发 → 电控 1kHz 控制环里插值；或视觉 240Hz 冲（每帧重复发 4 次降丢帧影响）\n波特率 460800：一帧 ~15 字节 × 240Hz × 10bit ≈ 36kbps，余量充足`) };

  DB["dl-b08"] = { level: 3, featured: true, title: "手写：串口帧 CRC8", body: "写 CRC8 校验（多项式 0x31）和帧打包函数：输入目标数据，输出完整字节帧。", hint: "查表法/逐位法。", solution: C("cpp", "crc.cpp", `#include <cstdint>
#include <vector>

uint8_t crc8(const uint8_t* data, int len) {
    uint8_t crc = 0xFF;
    for (int i = 0; i < len; ++i) {
        crc ^= data[i];
        for (int b = 0; b < 8; ++b)
            crc = (crc & 0x80) ? (crc << 1) ^ 0x31 : (crc << 1);
    }
    return crc;
}

std::vector<uint8_t> pack_frame(int16_t tx, int16_t ty, uint16_t dist,
                                uint32_t ts) {
    std::vector<uint8_t> f;
    f.push_back(0xA5);                    // 帧头
    f.push_back(12);                      // 数据长度
    // 小端打包
    for (int i = 0; i < 2; ++i) f.push_back((tx >> (8*i)) & 0xFF);
    for (int i = 0; i < 2; ++i) f.push_back((ty >> (8*i)) & 0xFF);
    for (int i = 0; i < 2; ++i) f.push_back((dist >> (8*i)) & 0xFF);
    for (int i = 0; i < 4; ++i) f.push_back((ts >> (8*i)) & 0xFF);
    f.push_back(crc8(f.data() + 2, 12));  // 校验(跳过帧头长度)
    return f;
}`) };

  DB["dl-b09"] = { level: 3, title: "电控解析端容错", body: "电控收到串口数据流，怎么从字节流里同步帧头并处理 CRC 错帧？写状态机思路。", hint: "查找帧头/滑窗丢弃。", solution: C("text", "ans.txt", `状态机：\n①SEARCH：逐字节找 0xA5\n②LEN：读长度字节，检查合法范围(12~64)，非法回①\n③DATA：收满数据+CRC 共 len+1 字节\n④CHECK：CRC 对 → 提交帧，错 → 回①，并从缓冲区里找下一个 0xA5（丢掉这帧别丢字节流位置）\n统计 CRC 错误率，>1% 报告线缆/干扰问题。\n注意「假帧头」：数据字节恰好 0xA5 → 用「连续两帧长度+时间戳递增合理性」再过滤。`) };

  DB["dl-b10"] = { level: 3, title: "时间戳协议", body: "为什么视觉帧里要带时间戳发给电控？电控怎么用它补偿延迟？", hint: "一帧一戳/延迟补偿。", solution: C("text", "ans.txt", `视觉按帧打时间戳（采集时刻，ms 精度）随数据发送。电控收到时：\n延迟 = 当前时刻 - 帧时间戳\n补偿：目标位置 + 目标速度 × 延迟 = 预测位置\n没时间戳：电控不知道这数据多旧，按 0 延迟用 → 20ms 延迟 × 3m/s = 6cm 系统偏差。\n两机时钟要对齐：开机同步一次 + 定期对表（或共用 NUC 做主时钟发同步帧）。`) };

  DB["dl-b11"] = { level: 3, featured: true, title: "ByteTrack 高低分匹配", body: "ByteTrack 两轮匹配的顺序为什么是「先高分后低分」？反过来会怎样？", hint: "高分可信先占坑。", solution: C("text", "ans.txt", `先高分：高置信度检测更可信，先让现有轨迹匹配最稳的观测——锁定主干。\n反过来（先低分）：低分框（可能是误检）抢走了轨迹，真检测反而配不上 → ID 频繁错换。\n第二轮低分兜底：主干匹配完，剩余轨迹（被遮挡目标）再用低分框续命。\n本质：先信可靠的，再用可疑的补缺口——和人类排查问题同一逻辑。`) };

  DB["dl-b12"] = { level: 3, title: "轨迹生命周期", body: "跟踪轨迹什么时候新建、什么时候删除？missed 计数器怎么设？", hint: "新轨迹要连续命中/超时删除。", solution: C("text", "ans.txt", `新建：检测框没匹配上任何轨迹 → 建新轨迹，但标记 tentative；连续命中 3 帧才转 confirmed（防误检闪现生成假 ID）\n删除：连续 missed > max_age（RM 取 15~30 帧 = 0.25~0.5s）→ 目标真丢了\nmax_age 权衡：太小 → 遮挡瞬间断 ID；太大 → 目标离开后旧轨迹空转占资源\nRM 小陀螺遮挡频繁：max_age 给 30 帧，配 KF 预测撑过遮挡段。`) };

  DB["dl-b13"] = { level: 3, title: "KF 预测补遮挡", body: "目标被遮挡 10 帧，跟踪器靠什么继续输出位置？恢复后怎么平滑衔接？", hint: "KF外推/恢复时先信预测。", solution: C("text", "ans.txt", `遮挡期：KF 用运动模型（匀速/匀加速）外推——速度来自遮挡前的观测，惯性滑行。\n恢复后：新检测和 KF 预测位置做「软融合」而不是直接跳变——KF 增益自适应（遮挡久了对预测信任降低，新观测权重加大）。\n衔接技巧：恢复帧的检测先验证合理性（和预测距离 < 阈值才认），突变大概率是误匹配。\nRM 实战：小陀螺遮挡 5~15 帧，KF 外推误差 <20px，足够电控维持瞄准。`) };

  DB["dl-b14"] = { level: 3, featured: true, title: "手写：两轮匹配跟踪器", body: "实现简化 ByteTrack：高低分分组→两轮 IoU 贪心匹配→missed 超时删除→新轨迹确认机制。用模拟数据验证 ID 稳定性。", hint: "分组/两轮/确认。", solution: C("python", "ans.py", `import numpy as np

class MiniByteTrack:
    def __init__(self, hi=0.5, lo=0.1, iou_th=0.3, max_age=30, min_hits=3):
        self.hi, self.lo, self.iou_th = hi, lo, iou_th
        self.max_age, self.min_hits = max_age, min_hits
        self.tracks, self.nid = [], 0

    @staticmethod
    def iou(a, b):
        x1,y1 = max(a[0],b[0]), max(a[1],b[1])
        x2,y2 = min(a[2],b[2]), min(a[3],b[3])
        inter = max(0,x2-x1)*max(0,y2-y1)
        ua = (a[2]-a[0])*(a[3]-a[1])+(b[2]-b[0])*(b[3]-b[1])-inter
        return inter/ua if ua>0 else 0

    def _match(self, tracks, dets):
        used_t, pairs = set(), []
        for di, d in enumerate(dets):
            best_v, best_t = self.iou_th, None
            for ti, t in enumerate(tracks):
                if ti in used_t: continue
                v = self.iou(t["box"], d[:4])
                if v > best_v: best_v, best_t = v, ti
            if best_t is not None:
                used_t.add(best_t)
                pairs.append((best_t, di, d))
        return pairs, used_t

    def update(self, dets):
        hi = [d for d in dets if d[4] > self.hi]
        lo = [d for d in dets if self.lo < d[4] <= self.hi]

        # 第一轮：全部轨迹 vs 高分
        p1, u1 = self._match(self.tracks, hi)
        matched_t = set(t for t,_,_ in p1)
        for t, _, d in p1:
            self.tracks[t].update(box=d[:4], hit=True)

        # 第二轮：剩余轨迹 vs 低分
        rest = [i for i,t in enumerate(self.tracks) if i not in matched_t]
        rest_tracks = [self.tracks[i] for i in rest]
        p2, u2 = self._match(rest_tracks, lo)
        for idx, _, d in p2:
            real_i = rest[idx]
            self.tracks[real_i].update(box=d[:4], hit=True)
            matched_t.add(real_i)

        # 未命中老化
        for i, t in enumerate(self.tracks):
            if i not in matched_t: t["missed"] += 1
        self.tracks = [t for t in self.tracks if t["missed"] <= self.max_age]

        # 新轨迹（高分未匹配）
        matched_boxes = {tuple(t["box"]) for t in self.tracks if t["missed"]==0}
        for d in hi:
            if tuple(d[:4]) not in matched_boxes:
                self.tracks.append({"id": self.nid, "box": d[:4],
                                    "missed": 0, "hits": 1})
                self.nid += 1
        # 确认机制
        for t in self.tracks:
            if t.get("hit"): t["hits"] = t.get("hits",0)+1; t["hit"]=False

        return [(t["id"], t["box"]) for t in self.tracks
                if t.get("hits",0) >= self.min_hits or t["missed"]==0]

# 模拟：目标1遮挡3帧(掉分)，验证 ID 不断
tr = MiniByteTrack()
frames = [
    [[100,100,150,150,0.9]],                    # T1 出现
    [[102,102,152,152,0.35]],                   # 掉分(遮挡)
    [[104,104,154,154,0.30]],
    [[106,106,156,156,0.88]],                   # 恢复
]
for f in frames:
    print(tr.update(f))`) };

  DB["dl-b15"] = { level: 3, title: "ID switch 检测指标", body: "MOTA/IDF1/IDs 三个跟踪指标各衡量什么？RM 更该看哪个？", hint: "综合/轨迹一致性/切换次数。", solution: C("text", "ans.txt", `MOTA：综合（漏检+误检+错配）→ 大而全但掩盖细节\nIDF1：轨迹身份一致性（预测的 ID 和真 ID 的匹配度）→ 直接反映「跟踪稳定」\nIDs（ID switch 次数）：身份切换总次数 → 直观\nRM 最该看 IDF1 + IDs：电控依赖稳定 ID 做预测瞄准，ID 一换预测链断 → 脱靶。\nMOTA 高但 IDF1 低 = 检测好但跟踪烂——RM 宁可 MOTA 少两点也要 IDF1 高。`) };

  DB["dl-b16"] = { level: 3, title: "多目标优先级", body: "场上同时有 3 个敌方装甲板，视觉系统怎么决定给电控报哪个？", hint: "策略层规则。", solution: C("text", "ans.txt", `视觉层全报（带 ID/类别/距离），选择权给电控或策略层：\n①威胁度评分 = 距离权重 + 正对程度（朝向我的优先）+ 血量信息（低血斩杀）+ 类型（英雄>步兵）\n②打击连续性：正在打的 ID 优先保持，除非更高价值目标出现（防来回切换）\n③视野中心权重：太边缘的目标云台要大转，先打近的\n输出「主目标 + 备选目标列表」，电控失主目标时无缝切备选。`) };

  DB["dl-b17"] = { level: 3, title: "能量机关数据特点", body: "大符数据集和装甲板数据集比，采集上有什么本质不同？", hint: "转速/正弦/样本均衡。", solution: C("text", "ans.txt", `①转速覆盖：必须覆盖正弦一个完整周期各相位（慢-加速-最快-减速），随机采会相位偏斜\n②「已击打/未击打」类别天然不平衡（5:1）→ 采样加权\n③扇叶旋转 + 整体摆动双运动 → 运动模糊比装甲板严重，增广要加足\n④跟踪 ID 更难（5 个扇叶外观相同）→ 外观特征不可用，纯运动关联\n所以大符模型单独训、单独调，不和装甲板混一个数据集。`) };

  DB["dl-b18"] = { level: 3, featured: true, title: "手写：相位均匀采样", body: "大符数据集按正弦相位分桶检查均衡性：写脚本统计各相位段的样本数，输出分布直方图和补采建议。", hint: "arcsin 反解相位/分桶统计。", solution: C("python", "ans.py", `import numpy as np

# 采样记录: (时间t, 转速spd) —— 拟合出相位
# 这里直接演示: 假设已知 a,b,c,d
a, b, c, d = 0.8, 1.9, 0.4, 1.0
t   = np.load("rune_times.npy")
spd = np.load("rune_speeds.npy")

# 反解相位: sin(x) = (spd-d)/a → x = arcsin(...) + 2πk
# 简化: 只取 [0, 2π) 主相位
ratio = np.clip((spd - d) / a, -1, 1)
phase = np.degrees(np.arcsin(ratio))            # -90~90
# 按转速方向展开到 0~360（有升有降,这里简化示意）

bins = np.linspace(0, 360, 13)                   # 12 桶,每桶30°
hist, _ = np.histogram(phase % 360, bins=bins)
print("相位分布(0-360,每30°):")
for i, h in enumerate(hist):
    bar = "#" * int(h / max(hist.max(),1) * 30)
    print(f"{i*30:3d}~{(i+1)*30:3d}° {h:4d} {bar}")

# 补采建议: 少于均值 50% 的桶标记
mean = hist.mean()
short = [f"{i*30}~{(i+1)*30}°" for i,h in enumerate(hist) if h < mean*0.5]
print("需补采相位段:", short or "无")`) };

  DB["dl-b19"] = { level: 3, title: "大符预测容错", body: "正弦拟合预测的提前量打偏了，除了拟合不准还有什么可能？", hint: "延迟标定/时间戳。", solution: C("text", "ans.txt", `拟合外的三大嫌疑：\n①飞行时间算错：弹速用理论值，实际经摩擦轮衰减 5~10% → 实测弹速标定后写配置\n②时间戳偏差：视觉帧时间戳 vs 电控执行时刻的链路延迟没标定（串口缓冲+电控解析 ≈3~5ms）→ 用 LED 闪光法实测端到端延迟\n③预测点 vs 击打点不一致：算的是扇叶中心，弹着点应该在「灯条装甲板中心」——几何偏移没补偿\n排查顺序：先固定扇叶验证静态精度 → 慢转验证动态 → 全速。`) };

  DB["dl-b20"] = { level: 3, title: "模型 AB 测试", body: "新模型 mAP 高 2 个点，怎么在比赛系统里科学地验证它真的更好？", hint: "回放集+统计显著性。", solution: C("text", "ans.txt", `离线回放：录制 10 场比赛原始视频 → 同一段流跑新旧模型 → 对比指标不只 mAP：\n①端到端命中率（模拟电控决策）②ID 稳定性（IDF1）③极端场景（遮挡/小陀螺）人工看\n在线灰度：训练赛半场用旧半场用新，操作手盲评。\n统计：每场 100 发采样，新旧命中率差 >5% 且 p<0.05 才换（避免小样本噪声骗人）。\n记录决策日志——换模型理由留档，输球复盘能查。`) };

  DB["dl-b21"] = { level: 2, title: "模型版本管理", body: "视觉模型文件怎么管理版本？场上出问题怎么秒回滚？", hint: "git-lfs/版本号/双引擎。", solution: C("text", "ans.txt", `仓库：模型权重(.pt/.onnx/.engine)进 git-lfs，和数据集版本绑定记录\n版本号：日期+训练集版本+mAP（如 v20261002_ds3_map91）\n部署：车上常驻最新版+上一版双引擎配置，一个环境变量切换\n回滚：场上发现新版抽风 → 改环境变量重启，30 秒回滚\n严禁「电脑上直接拷文件盖车上」——版本链断了自己都不知道跑的哪个。`) };

  DB["dl-b22"] = { level: 3, title: "推理批处理优化", body: "两台相机（前+后）各 60fps，推理 4ms。合并成 batch=2 一次推有什么收益？", hint: "GPU并行利用率。", solution: C("text", "ans.txt", `收益：batch=1 推 4ms；batch=2 推 5.5ms（不是翻倍）——GPU 并行核心没吃满，两个一起算摊薄固定开销。\n两台独立推：4+4=8ms/60fps 周期 = 16.7ms 勉强够\n合批推：5.5ms 出两帧结果，省 2.5ms + 调用开销\n代价：两帧要等齐（慢的那台拖累快的）——前后相机帧同步要求提高\n结论：同型号相机+硬件触发同步 → 合批划算；异步采集 → 独立推延迟更低。`) };

  DB["dl-b23"] = { level: 3, title: "输入分辨率 vs 裁剪", body: "1280×1024 原图，模型要 640。letterbox 整图缩 vs 裁中央 640×640 推理，各适合什么场景？", hint: "目标分布决定。", solution: C("text", "ans.txt", `letterbox 整图缩：目标小（远距离装甲板 15px → 缩后 7px 更小）但视野全\n裁剪中央：目标像素尺寸保留（分辨率红利）但视野小 + 目标出裁剪框就丢\n适用：\n相机固定看前方 + 目标都在中央区域（RM 云台随动场景）→ 裁剪推理，小目标精度大增\n固定枪口相机扫全场地图 → letterbox\n混合：粗检全图（低分辨率）→ 精检裁剪目标邻域（原分辨率）两级流水线。`) };

  DB["dl-b24"] = { level: 3, title: "多模型共存", body: "系统里装甲板模型+能量机关模型+雷达模型三个引擎，显存和调度怎么安排？", hint: "常驻/按需加载。", solution: C("text", "ans.txt", `显存：三个 YOLOv8n 引擎 ≈ 3×300MB <1GB，NUC 独显装得下 → 全常驻，省加载时间\n调度：状态机驱动——常规对战跑装甲板模型；大符激活切换大符模型（提前预热）；雷达站全跑\n切换要 0 延迟：双引擎提前初始化好，切换只是换函数指针，不是加载文件\n注意 TRT engine 的执行 context 线程安全——多线程并发跑同一 context 会崩，每线程独立 context。`) };

  DB["dl-b25"] = { level: 3, featured: true, title: "手写：双引擎热切换", body: "实现装甲板/能量机关双模型管理器：两个引擎常驻、状态机切换、切换瞬间零卡顿。", hint: "预热/原子切换。", solution: C("python", "ans.py", `import threading, time

class DualEngine:
    def __init__(self, armor_engine, rune_engine):
        self.engines = {"armor": armor_engine, "rune": rune_engine}
        self.active = "armor"
        self.lock = threading.Lock()
        # 启动即预热两个引擎（跑空帧完成 JIT/显存分配）
        for e in self.engines.values():
            e.warmup()

    def switch(self, target):
        with self.lock:
            if target == self.active: return
            self.engines[target].warmup()      # 确保热
            self.active = target               # 原子切换(只改指针)
            print(f"[switch] -> {target}")

    def infer(self, frame):
        with self.lock:
            engine = self.engines[self.active]
        return engine.infer(frame)              # 推理不加锁,切换才加

# 使用: 大符检测器发现扇叶 → 主控调 switch("rune")
# 大符打完 → switch("armor")
# 推理线程全程无感,零卡顿`) };

  DB["dl-b26"] = { level: 3, title: "赛场抗干扰", body: "对方用激光笔/强闪光灯干扰视觉，系统层面怎么扛？", hint: "过曝恢复/时序过滤。", solution: C("text", "ans.txt", `①物理：镜头加窄带滤光片（只透灯条波段）——激光大部分被挡\n②曝光策略：检测到大面积过曝（mean>240）→ 立即缩短曝光锁定 + 通知电控「视觉降级」\n③时序过滤：单帧突现又消失的目标（<3 帧）不输出——激光点是瞬时干扰\n④跟踪兜底：检测置信度崩时 KF 预测维持输出 0.3s（撑过干扰）\n⑤双模：视觉挂了切 IMU 陀螺仪纯预测（最后防线）\n规则允许范围内的干扰要扛，超规则的裁判处罚对方。`) };

  DB["dl-b27"] = { level: 2, title: "可视化调试面板", body: "开发期需要一个可视化面板看：实时帧+检测框+跟踪轨迹+FPS+置信度直方图。设计布局。", hint: "分屏/信息密度。", solution: C("text", "ans.txt", `布局（1920×1080 调试屏）：\n主区（左 70%）：实时画面+检测框（类别色分）+ID+轨迹尾巴（最近 30 帧轨迹线）\n右侧栏（30%）：\n  上：FPS 曲线（最近 60s）+ 各环节耗时条形图\n  中：置信度直方图（阈值线标出）\n  下：跟踪列表（ID/类别/速度/missed）\n底部状态条：模式/串口状态/警告计数\n比赛部署版只留底部状态条，其余全关。`) };

  DB["dl-b28"] = { level: 3, title: "单元测试策略", body: "视觉系统哪些模块值得写单元测试？举例三个关键测试用例。", hint: "纯函数优先。", solution: C("text", "ans.txt", `值得测的（纯函数/确定逻辑）：\n①letterbox 及其逆变换：随机尺寸图 → 正变换 → 逆变换 → 还原坐标误差 <0.5px\n②NMS：构造已知重叠框组 → 保留数和索引精确断言\n③CRC/帧打包：打包→解包 roundtrip 字节一致\n不值得测的：模型推理输出（随权重变）、相机行为（硬件）\n跑法：pytest 集成 CI，改动前后跑一遍——后处理改一行错位，单测立刻报警。`) };

  DB["dl-b29"] = { level: 3, featured: true, title: "手写：letterbox 逆变换单测", body: "写 letterbox 正逆变换的单元测试：随机 100 组尺寸和坐标，断言往返误差 <0.5px。", hint: "property-based 断言。", solution: C("python", "test.py", `import numpy as np

def letterbox(img, size=640):
    h, w = img.shape[:2]
    s = min(size/h, size/w)
    nh, nw = int(h*s), int(w*s)
    canvas = np.full((size,size,3), 114, np.uint8)
    top, left = (size-nh)//2, (size-nw)//2
    canvas[top:top+nh, left:left+nw] = cv2.resize(img,(nw,nh))
    return canvas, s, left, top

def inv(x, y, s, dx, dy):
    return (x-dx)/s, (y-dy)/s

# ---- 单测 ----
def test_roundtrip():
    rng = np.random.default_rng(42)
    for _ in range(100):
        h, w = rng.integers(200, 1200, 2)
        img = np.zeros((h, w, 3), np.uint8)
        _, s, dx, dy = letterbox(img, 640)
        # 原图随机点 → 网络坐标 → 逆变换
        for _ in range(50):
            ox, oy = float(rng.integers(0, w)), float(rng.integers(0, h))
            nx, ny = ox*s+dx, oy*s+dy          # 正变换
            rx, ry = inv(nx, ny, s, dx, dy)    # 逆变换
            assert abs(rx-ox) < 0.5 and abs(ry-oy) < 0.5, \\
                   f"roundtrip fail: {ox},{oy} -> {rx},{ry}"
    print("100 组往返全部 <0.5px ✓")

test_roundtrip()`) };

  DB["dl-b30"] = { level: 3, title: "CI 流水线", body: "队里 git 仓库配什么 CI？模型训练自动化的收益点在哪？", hint: "lint/单测/数据版本。", solution: C("text", "ans.txt", `基础 CI（每次 push）：代码 lint（flake8/clang-format）+ 单元测试 + 构建检查（能否编译）\n进阶（打 tag 时）：自动在训练服务器拉起训练（数据集版本从 DVC 拉取）→ 训练完自动评估 mAP → 达标自动导出 ONNX+生成报告\n收益：①新人提交代码质量有底线 ②「这版模型到底哪来的」全程可追溯 ③训练集/代码/权重的三方版本绑定，复现实验一键完成\n工牌机跑 GitHub Actions，训练机用自建 runner。`) };

  DB["dl-b31"] = { level: 2, title: " rosbag 回放调试", body: "怎么用 rosbag 录制视觉输入做离线回放调试？和直接录视频有什么区别？", hint: "带时间戳和话题。", solution: C("text", "ans.txt", `rosbag 录的不仅是图像：所有话题（图像+IMU+电控指令）带统一时间戳完整记录。\n回放时可以：①改视觉代码重放同一场景 A/B 对比 ②把 IMU 数据也回放，时间同步逻辑照常工作 ③单步/慢放/跳段\n录视频只有图像流，时间戳是播放器给的——多传感器联调复现不了。\nRM 全 ROS 架构：比赛全程 rosbag（注意磁盘——60fps 1080p 每小时 ~80GB，压缩或降采样）。`) };

  DB["dl-b32"] = { level: 3, title: "仿真数据生成", body: "真实数据不够，能不能用仿真生成训练数据？RM 有什么现成方案？", hint: "UE/Unity 合成。", solution: C("text", "ans.txt", `可行且是趋势：Unity/UE 搭 RM 场景（场地模型+装甲板贴图+光照模拟）→ 随机姿态/距离/光照批量渲染，自动带完美标注。\nRM 现成：GitHub 有开源 RM 仿真场景（rmul_sim 等）。\n合成数据的坑：sim2real 差距——渲染的灯条和真实 LED 的色彩/光晕分布不同。\n正确用法：合成数据预训练 + 真实数据微调（域自适应），比纯真实数据集快 3 倍收敛。\n混合比例经验：合成 60% + 真实 40% 起步。`) };

  DB["dl-b33"] = { level: 3, title: "模型剪枝", body: "什么是模型剪枝？RM 推理还想提速除了量化还有什么路？", hint: "去冗余通道。", solution: C("text", "ans.txt", `剪枝：删掉贡献小的卷积通道（权重绝对值小的），模型瘦身 30~50%，速度提 1.2~1.5 倍，精度掉 1~2 点（可微调找回）\n提速全家桶：\n①量化（INT8）：3~5 倍，首选\n②剪枝+微调：1.3 倍\n③知识蒸馏：大模型教小模型，v8s 的精度塞进 v8n 的体积\n④输入分辨率下调：最直接，但小目标伤\n组合拳：INT8 + 轻剪枝 → NUC 上 v8n 到 1.5ms 可期。`) };

  DB["dl-b34"] = { level: 3, title: "异常检测自监控", body: "比赛跑着模型输出突然全是误检，系统怎么自己发现并处理？", hint: "输出统计分布监控。", solution: C("text", "ans.txt", `自监控指标（滑动窗口统计）：\n①检出数量突变：均值 3 个/帧突然 30 个 → 误检爆炸\n②置信度分布漂移：正常集中在 0.7+，突然 0.3~0.5 一大坨\n③框尺寸异常：出现大量超小框（噪声）\n④连续丢失：全场检测为空 >2s（不可能，肯定有问题）\n处置：①统计异常 → 切上一版引擎 ②还异常 → 降级传统 HSV 流水线 ③全挂 → 通知电控纯遥控\n把这套做成独立 watchdog 进程——视觉程序自己崩了它还在。`) };

  DB["dl-b35"] = { level: 3, featured: true, title: "手写：输出分布监控器", body: "写滑动窗口统计监控：检出数/置信度均值/小框占比三个指标，任一异常持续 2 秒触发回调。", hint: "deque 滑窗/阈值。", solution: C("python", "ans.py", `import collections, time

class OutputMonitor:
    def __init__(self, win=120):               # 120帧=2s@60fps
        self.win = win
        self.n_dets = collections.deque(maxlen=win)
        self.confs  = collections.deque(maxlen=win)
        self.small  = collections.deque(maxlen=win)
        self.history = collections.deque(maxlen=600)  # 基线学习

    def update(self, dets):                    # dets:[[x1,y1,x2,y2,conf],..]
        self.n_dets.append(len(dets))
        if dets:
            self.confs.append(sum(d[4] for d in dets)/len(dets))
            self.small.append(sum(1 for d in dets
                                  if (d[2]-d[0])*(d[3]-d[1]) < 400)/len(dets))
        self.history.append(len(dets))

    def check(self):
        if len(self.history) < 300: return "WARMUP"   # 基线不足
        base = sum(self.history)/len(self.history)
        cur  = sum(self.n_dets)/len(self.n_dets)
        alerts = []
        if cur > max(base*3, base+10): alerts.append("检出数暴涨(误检?)")
        if self.confs and sum(self.confs)/len(self.confs) < 0.35:
            alerts.append("置信度整体偏低")
        if self.small and sum(self.small)/len(self.small) > 0.6:
            alerts.append("小框占比异常")
        return alerts or "OK"`) };

  DB["dl-b36"] = { level: 3, title: "比赛日志规范", body: "比赛日志要记录什么才能支持赛后复盘？列字段清单。", hint: "每帧可回放。", solution: C("text", "ans.txt", `每帧记录（CSV/二进制，高频）：\ntimestamp / 检出数 / 主目标ID / 目标位置(x,y,z) / 置信度 / 帧耗时 / 串口发送内容\n事件记录（低频）：\n模式切换 / 模型切换 / 异常报警 / 参数热更新(旧值→新值) / 看门狗触发\n赛后分析可回答：\n①哪段时间命中率低？→ 关联当时检出数和置信度\n②是否误检害的？→ 回放该时刻保存的帧图像\n③延迟尖峰？→ 帧耗时列直接看\n磁盘：二进制日志每小时 ~200MB，一场比赛可接受。`) };

  DB["dl-b37"] = { level: 3, title: "性能回归测试", body: "每次改代码怎么防止性能偷偷劣化？设计性能回归测试。", hint: "基准帧+阈值告警。", solution: C("python", "bench.py", `import time, statistics

BENCH_FRAMES = ["bench/f1.png", "bench/f2.png", "bench/f3.png"]  # 固定基准帧
THRESHOLD_MS = 8.0        # 上一版基准 +10%

def bench_infer(engine, n=100):
    times = []
    for f in BENCH_FRAMES * (n//len(BENCH_FRAMES)):
        img = cv2.imread(f)
        t0 = time.perf_counter()
        engine.infer(img)
        times.append((time.perf_counter()-t0)*1000)
    return statistics.mean(times), statistics.p95(times) if hasattr(statistics,'p95') \\
           else (statistics.mean(times), sorted(times)[int(len(times)*0.95)])

# CI 里跑:
mean_ms, p95_ms = bench_infer(current_engine)
assert mean_ms < THRESHOLD_MS, \\
    f"性能回归! {mean_ms:.1f}ms > {THRESHOLD_MS}ms 阈值"
print(f"mean {mean_ms:.2f}ms | p95 {p95_ms:.2f}ms ✓")`) };

  DB["dl-b38"] = { level: 3, title: "赛季技术债务", body: "赛季末视觉代码一锅粥，怎么在休赛期还技术债？列优先级清单。", hint: "文档/测试/重构。", solution: C("text", "ans.txt", `按性价比排序：\n①补文档：架构图+每个模块的「为什么这么写」（比赛时来不及写的决策记忆会蒸发）\n②单元测试补齐：后处理/坐标变换/协议这些纯逻辑 100% 覆盖\n③死代码清除：调试用的分支、没用过的功能、复制粘贴的三份相似代码合并\n④配置外提：写死的阈值/路径全部收进配置文件\n⑤数据管道固化：采集→标注→训练→评估的脚本化（新人一键跑通）\n不做的：大规模框架迁移（收益低风险高，除非真撑不住了）`) };

  DB["dl-b39"] = { level: 3, title: "新人上手路线", body: "新视觉队员零基础，第一个月的学习路线怎么排？", hint: "环境→复现→读码→小任务。", solution: C("text", "ans.txt", `第1周：Linux + Python + OpenCV 基础（本站 OpenCV 专题）——能跑通实时检测 demo\n第2周：复现队伍现有系统——从 git 拉代码在测试机跑起来，录一段自己的检测视频\n第3周：读核心代码——数据流从相机到串口走一遍，画自己的架构图给老人讲\n第4周：接小任务——修一个 bug / 标一批数据 / 加一个调试功能，走完整提交流程\n考核：能独立定位一个「检测框错位」问题并修复 → 出师。\n避坑：别一上来就调模型参数——先懂系统再看算法。`) };

  DB["dl-b40"] = { level: 3, featured: true, title: "毕业考：视觉系统架构答辩", body: "假设你是视觉组长，向全队讲解系统：从「相机拍到像素」到「云台打到目标」的完整链路，每个环节的关键决策和备选方案。写讲稿提纲。", hint: "数据流串讲+每环节为什么。", solution: C("text", "defense.txt", `一、总览：一条数据的一生
  相机像素 → 预处理 → 检测 → 跟踪 → 解算 → 预测 → 通信 → 电控 → 云台
  全程预算 16.7ms，实测 14ms

二、逐环节决策
  ①相机：全局快门+硬件触发（为什么卷帘不行：小陀螺果冻效应）
  ②预处理：手动曝光+letterbox 融进引擎首层（1ms 省到 0.3ms）
  ③检测：YOLOv8n+INT8（为什么不是 v8s：帧率红线倒逼）
  ④跟踪：ByteTrack（为什么不是纯 KF：遮挡掉分要两轮匹配）
  ⑤解算：PnP+IPPE（为什么平面解：装甲板共面四点）
  ⑥预测：KF 外推+弹道提前量（飞行 0.3s 必须预瞄）
  ⑦通信：串口+时间戳（为什么不是 WiFi：延迟抖动不可控）
  ⑧降级：三层熔断（DL→HSV→遥控）

三、备选与放弃理由
  OpenVINO（x86 备机用）/ 奥比中光深度相机（规则成本）/ 双目（基线短精度差）

四、教训与迭代
  曾因忘了 letterbox 逆变换浪费两天 → 现在后处理有单测
  曾因 USB 线干扰掉帧 → 全线换屏蔽线+磁环`) };
})(window);
