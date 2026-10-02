// YOLO 深度学习题库 A 卷（40 题：原理/数据/训练）
(function (global) {
  "use strict";
  var DB = global.PRACTICE_DB = global.PRACTICE_DB || {};
  var C = H.code;

  DB["dl-a01"] = { level: 1, title: "神经网络本质", body: "用一句话说清神经网络在干什么？「训练」和「推理」的区别？", hint: "函数拟合/调权重 vs 用权重。", solution: C("text", "ans.txt", `神经网络 = 万能函数拟合器：输入图像 → 输出预测（框+类别）。\n训练：用标注数据不断调整几百万个权重，让输出逼近真值（慢，离线）。\n推理：权重冻结，新图进去结果出来（快，在线）。\nRM：训练在宿舍 GPU 上跑几小时，推理在 NUC 上 4ms 一帧。`) };

  DB["dl-a02"] = { level: 1, title: "卷积核直觉", body: "3×3 卷积核在干什么？为什么 RM 装甲板检测要叠几十层卷积而不是一层？", hint: "局部特征滑窗/感受野叠加。", solution: C("text", "ans.txt", `单层卷积：3×3 小窗口在图上滑动，做加权求和 → 提取一种局部特征（边缘/色块/角点）。\n多层叠加：浅层看局部（灯条亮斑）→ 中层看部件（灯条组合）→ 深层看整体（这是装甲板）。\n一层不够：单层感受野只有 3×3 像素，看不见 100px 的装甲板整体。几十层叠起来感受野覆盖全图。`) };

  DB["dl-a03"] = { level: 1, title: "感受野计算", body: "两层 3×3 卷积（无池化）叠加的感受野是多大？三层呢？", hint: "5×5 / 7×7。", solution: C("text", "ans.txt", `两层 3×3：5×5（第一层看 3×3，第二层的每个点综合了第一层的 3×3 → 3+3-1=5）\n三层 3×3：7×7\n规律：n 层 3×3 卷积感受野 = (2n+1)×(2n+1)，再加池化翻倍。\n工程意义：检测大目标的网络层要够深，不然感受野罩不住目标。`) };

  DB["dl-a04"] = { level: 2, title: "池化的作用", body: "池化层两个作用？ downsampling 太激进会丢什么？", hint: "降分辨率扩感受野/丢小目标。", solution: C("text", "ans.txt", `作用：①降分辨率（计算量减 4 倍）②扩大感受野（综合更大范围信息）\n丢什么：小目标。8×8 像素的远距离装甲板经过 4 次 stride-2 下采样只剩 0.5×0.5 → 信息湮灭。\n对策：RM 小目标场景用 FPN 多尺度特征融合，或减少下采样次数/上输入分辨率。`) };

  DB["dl-a05"] = { level: 2, featured: true, title: "单阶段 vs 两阶段", body: "YOLO（单阶段）和 Faster R-CNN（两阶段）的流程区别？各自牺牲了什么换什么？", hint: "一步出框 vs 先候选再分类。", solution: C("text", "ans.txt", `两阶段：①第一阶段生成候选区域（可能有小目标的几百个框）②第二阶段对每个候选框精确分类和回归。\n  精度高，速度慢（每个候选框都要过一遍网络头）。\n单阶段：整图一次前向，网格每个位置直接出框+类别。\n  快（一次前向），极端小目标/密集场景精度略逊。\nRM 选单阶段：60fps 硬预算下两阶段根本跑不动，且 RM 目标不太密集。`) };

  DB["dl-a06"] = { level: 2, title: "anchor 是什么", body: "YOLOv5 的 anchor（锚框）是什么作用？RM 装甲板需要什么样的 anchor？", hint: "先验框尺寸/竖长条。", solution: C("text", "ans.txt", `anchor = 预设的一组先验框尺寸，网络在 anchor 基础上微调出预测框，比从零回归稳定。\nRM 装甲板：竖长条（w/h≈0.3~0.5）+ 大小跨 15~150px。\n做法：kmeans 对标注框聚出 9 个自定义 anchor 替换默认值，召回率立涨。\nYOLOv8 是 anchor-free（直接回归），无需这步——但理解 anchor 仍是理解检测史的基础。`) };

  DB["dl-a07"] = { level: 2, title: "IoU 计算", body: "框 A(0,0,100,100) 和框 B(50,50,150,150) 的 IoU 是多少？手算。", hint: "交 50×50=2500 / 并 17500。", solution: C("text", "ans.txt", `交集：(50,50)-(100,100) = 50×50 = 2500\n并集：100×100+100×100-2500 = 17500\nIoU = 2500/17500 ≈ 0.143\nNMS 阈值 0.5 时这两个框不会互相抑制（重叠太少）。`) };

  DB["dl-a08"] = { level: 3, featured: true, title: "手写 IoU + NMS", body: "手写 numpy 版 IoU 和 NMS 函数：输入多框+分数，IoU 阈值 0.5，输出保留框索引。", hint: "贪心：分数最高先留，删重叠。", solution: C("python", "ans.py", `import numpy as np

def nms(boxes, scores, iou_th=0.5):
    x1, y1, x2, y2 = boxes[:,0], boxes[:,1], boxes[:,2], boxes[:,3]
    areas = (x2-x1) * (y2-y1)
    order = scores.argsort()[::-1]          # 分数降序
    keep = []
    while order.size > 0:
        i = order[0]; keep.append(i)
        xx1 = np.maximum(x1[i], x1[order[1:]])
        yy1 = np.maximum(y1[i], y1[order[1:]])
        xx2 = np.minimum(x2[i], x2[order[1:]])
        yy2 = np.minimum(y2[i], y2[order[1:]])
        w = np.maximum(0, xx2-xx1); h = np.maximum(0, yy2-yy1)
        inter = w*h
        iou = inter / (areas[i]+areas[order[1:]]-inter)
        order = order[iou <= iou_th]        # 只留不重叠的
    return keep`) };

  DB["dl-a09"] = { level: 2, title: "mAP@0.5 含义", body: "mAP@0.5 = 0.87 是什么意思？0.5 和 0.87 各指什么？", hint: "IoU 判定阈值/平均精度均值。", solution: C("text", "ans.txt", `0.5：预测框和真值框 IoU>0.5 才算检中（定位质量门槛）\nmAP：每个类别算 PR 曲线下面积(AP)再对所有类取平均\n0.87：平均下来 87% 的精度水平——粗略理解为「该找到的目标里 87% 被足够准地找到了」\nRM 报指标同时看：mAP@0.5（粗定位）和 mAP@0.5:0.95（严格定位），后者高说明框贴得紧。`) };

  DB["dl-a10"] = { level: 2, title: "精确率 vs 召回率", body: "RM 装甲板检测，高精确率低召回 vs 低精确率高召回，各是什么下场？哨兵该偏哪边？", hint: "误检浪费弹/漏检丢机会。", solution: C("text", "ans.txt", `高精确低召回：不乱打，但会错过真目标 → 放走敌方\n低精确高召回：目标都找得到，但混着误检 → 乱开火\n哨兵（自动开火）：偏精确——虚警开火暴露自己+耗弹\n人操辅助（人在瞄准）：偏召回——人已经瞄上，系统跟上就行，误检人自己过滤\n用置信度阈值调这个平衡。`) };

  DB["dl-a11"] = { level: 2, title: "过拟合现象", body: "训练 mAP 0.95 验证 0.60，什么问题？三个解法按性价比排序。", hint: "数据增广/早停/正则。", solution: C("text", "ans.txt", `过拟合：网络背下了训练集（含噪声），泛化崩了。\n解法排序：\n①数据增广（免费大丰收）：翻转/HSV/缩放/Mosaic，让网络见世面\n②补数据（治本）：采集更多真实场景，尤其和验证集像的\n③早停+权重衰减（快速止血）：patience 收紧，weight_decay 0.0005\n换大模型只会加剧过拟合——数据不够模型再大也白搭。`) };

  DB["dl-a12"] = { level: 3, featured: true, title: "学习率调度", body: "训练初期 loss 剧烈震荡后稳定，什么原因？warmup 是干什么的？", hint: "初期权重随机/lr 从小爬升。", solution: C("text", "ans.txt", `初期权重是随机数，梯度方向噪声大，大学习率直接把 loss 打飞——震荡。\nwarmup：前几个 epoch 学习率从 0.001 线性爬到目标值（如 0.01），等权重进入合理区域再全速优化。\n配合余弦退火（后期 lr 缓降精调）是标准配方。\n判断：震荡只在前 5% 迭代且最终收敛 = 正常 warmup 能解决；全程震荡 = lr 太大。`) };

  DB["dl-a13"] = { level: 3, title: "loss NaN 排查", body: "训练第 30 轮 loss 突然变 NaN，按顺序列出四个排查点。", hint: "lr/数据/梯度/显存。", solution: C("text", "ans.txt", `①学习率过大（最常见）：除以 10 重跑\n②脏数据：标注框坐标为 NaN/负数/宽高为 0 → 数据集体检脚本先跑一遍\n③梯度爆炸：加梯度裁剪 clip_grad_norm=10\n④混合精度下溢：AMP 的 loss scaling 异常 → 关 AMP 或更新框架版本\n定位技巧：把 dataloader 的 num_workers 设 0 复现，打印出问题 batch 的索引直接看那条数据。`) };

  DB["dl-a14"] = { level: 2, title: "数据集划分", body: "5000 张标注图怎么划分 train/val/test？为什么不能拿 val 集调参后还报 val 成绩？", hint: "7/2/1；泄漏。", solution: C("text", "ans.txt", `推荐 70/20/10（3500/1000/500），划分按「采集场景」分块而不是随机打散——同场景的帧太像，随机划分等于把答案漏给验证集（数据泄漏，虚高）。\nval 用于训练中调参，test 只在最后跑一次报成绩。\n拿调过参的 val 报成绩 = 考试前看过卷子——真实比赛会打脸。\nRM 注意：不同场馆的数据要分开，避免「在 A 馆练在 A 馆测」。`) };

  DB["dl-a15"] = { level: 2, featured: true, title: "负样本的价值", body: "为什么训练集要放 15% 没有目标的空场景图？不放会怎样？", hint: "压误检/负学习。", solution: C("text", "ans.txt", "不放负样本：网络只见过「有装甲板」的世界，看什么都像装甲板 → 观众席红衣服、大屏反光全误检。\n负样本教网络「什么不是装甲板」——背景类学习。\nRM 实战：观众席/大屏/己方机器人背部/灯光反射各来一批，误检率能砍一半以上。\n注意负样本图必须完全无目标，混入带目标的空白图会负学习压制真目标。") };

  DB["dl-a16"] = { level: 3, title: "类别不平衡", body: "红装甲板 3000 张蓝装甲板 800 张，训练会偏科怎么办？", hint: "加权采样/补数据。", solution: C("text", "ans.txt", `现象：网络偏向多数类，蓝色召回率低。\n解法：\n①数据层面（治本）：补采蓝方数据到接近均衡\n②采样层面：dataloader 加权采样，蓝类过采样红类欠采样\n③损失层面：类别加权 CE loss，蓝类 loss 权重 ×3\n④检测场景注意：多数是「每图的框数不平衡」而非图级——按框数加权更准。\nRM 策略：训练时两色各放一半赛训视频，赛前再 fine-tune 对方主色。`) };

  DB["dl-a17"] = { level: 3, featured: true, title: "手写：数据集体检脚本", body: "写脚本扫描 YOLO 格式数据集：统计每类框数、找坐标越界/零尺寸的坏标注、找无标注的空图，输出报告。", hint: "txt 每行 5 值归一化坐标。", solution: C("python", "ans.py", `import os, collections

IMG_DIR, LB_DIR = "images/train", "labels/train"
cls_cnt = collections.Counter()
bad, empty = [], []

for f in os.listdir(LB_DIR):
    if not f.endswith(".txt"): continue
    stem = f[:-4]
    img_path = os.path.join(IMG_DIR, stem + ".jpg")
    if not os.path.exists(img_path):
        empty.append(("no_img", stem)); continue
    lines = open(os.path.join(LB_DIR, f)).read().strip().split("\\n")
    if not lines or lines == [""]:
        empty.append(("no_label", stem)); continue
    for ln in lines:
        v = ln.split()
        if len(v) != 5: bad.append((f, "字段数", ln)); continue
        c, xc, yc, w, h = map(float, v)
        cls_cnt[int(c)] += 1
        if not (0<=xc<=1 and 0<=yc<=1 and 0<w<=1 and 0<h<=1):
            bad.append((f, "越界", ln))
        if w < 1e-6 or h < 1e-6:
            bad.append((f, "零尺寸", ln))

print("类别分布:", dict(cls_cnt))
print(f"坏标注 {len(bad)} 条（前5条）:", *bad[:5], sep="\\n  ")
print(f"异常图 {len(empty)} 张:", *empty[:5], sep="\\n  ")`) };

  DB["dl-a18"] = { level: 2, title: "Mosaic 增广", body: "Mosaic 数据增广是什么？为什么对小目标数据集特别有效？", hint: "四图拼接。", solution: C("text", "ans.txt", `Mosaic：随机取 4 张图拼成 2×2 大图再随机裁剪训练。\n对小目标有效：\n①一张训练图里出现 4 个场景的目标 → 单图监督信号 ×4\n②拼接产生自然的尺度变化（大图缩到 1/2 → 目标变小）→ 免费的多尺度增广\n③拼接边缘产生天然「遮挡」样本 → 提升遮挡鲁棒性\nRM 装甲板小目标多，Mosaic 基本必开；训练最后 10 轮关掉 Mosaic（贴近真实分布精调）。`) };

  DB["dl-a19"] = { level: 3, title: "copy-paste 增广", body: "copy-paste 增广怎么做？RM 里怎么用它缓解「小陀螺斜姿态样本稀缺」？", hint: "抠目标贴到别的图。", solution: C("text", "ans.txt", `做法：从原图抠出目标（连标注）→ 随机贴到别的背景图上 → 生成新样本。\nRM 玩法：\n①把斜姿态装甲板抠出来 → 贴到各种背景/角度的场地图 → 量产斜姿态样本\n②注意贴图边缘要羽化（不然有贴纸感，网络学到假特征）\n③贴的位置要合理（地面上方空间），别贴到天上\n④一图贴 1~3 个别贪多\n比纯采集快 100 倍，是 RM 社区扩稀缺样本的标准手段。`) };

  DB["dl-a20"] = { level: 3, title: "标注质量 KPI", body: "怎么量化标注质量？设计一个「标注质检」流程给队里用。", hint: "交叉复检+IoU 一致性。", solution: C("text", "ans.txt", `量化指标：\n①漏标率：复检员看图找「有目标没框」→ 应 <2%\n②框贴合度：抽查框和真值的 IoU → 应 >0.9\n③类别错标率：红蓝混标 → 应 <1%\n流程：\n①每标注 500 张 → 换人抽 10% 复检\n②三人独立标同一批 50 张 → 两两 IoU 对比，一致性 <0.85 的人重训\n③所有修正记录进「标注错误类型表」→ 每月复盘\n标注质量决定模型上限，这笔时间不能省。`) };

  DB["dl-a21"] = { level: 2, title: "迁移学习起步", body: "为什么用 COCO 预训练权重起步而不是从零训练？RM 数据多少张时从零训可行？", hint: "特征复用/万张级。", solution: C("text", "ans.txt", `预训练权重：浅层卷积学到的是「通用视觉特征」（边缘/纹理/色块），COCO 上学来的这些特征直接复用 → 收敛快 10 倍 + 小数据集不崩。\n从零训练可行门槛：类内多样数据 ≥1 万张 + 训练时长无所谓。\nRM 5000 张场景：必须预训练起步。backbone 冻结 10 epoch 只训头，再全网络微调。`) };

  DB["dl-a22"] = { level: 3, title: "backbone 冻结策略", body: "迁移学习时「冻结 backbone」和「全网络微调」什么时候各用哪个？", hint: "数据少冻结/数据多微调。", solution: C("text", "ans.txt", `冻结 backbone（只训检测头）：数据 <1000 张时用——防止小数据把预训练特征冲烂\n全微调：数据 >3000 张时用——RM 特征（发光灯条）和 COCO 差异大，全调收益高\nRM 实操折中：先冻结 10 epoch 热身 → 解冻全网络小学习率(1e-4)微调\n判断信号：冻结版验证 mAP 停滞在 0.7 → 数据够多了，解冻能到 0.85。`) };

  DB["dl-a23"] = { level: 2, title: "epoch 数选择", body: "训练 300 epoch，第 150 轮后验证 mAP 就不再涨，还该继续吗？patience 早停怎么用？", hint: "早停；学习率没退火完别急。", solution: C("text", "ans.txt", `先别急：如果用余弦退火，lr 还在下降，后期常有小幅再涨（150 轮停滞、220 轮 +0.02 常见）。\n标准做法：patience=50 —— 连续 50 轮无提升自动停，既不错过后涨又防白烧。\n真正该停的信号：验证 mAP 开始持续下降（过拟合）→ 立即停，用 best.pt。\nRM 小数据集典型训练量：150~300 epoch。`) };

  DB["dl-a24"] = { level: 3, featured: true, title: "超参优先级", body: "时间只够调三个超参，选哪三个？为什么？", hint: "lr/imgsz/数据增广强度。", solution: C("text", "ans.txt", `①学习率（首位）：影响最大，错一个数量级训练直接废。网格 {1e-3, 3e-4, 1e-4}\n②输入分辨率 imgsz：小目标场景分辨率翻倍 mAP 涨 5~10 点很常见，代价是慢\n③数据增广强度组合：HSV 幅度+Mosaic 概率+缩放幅度——直接决定泛化\nbatch size / optimizer 类型 / weight decay 这些默认值就很好，别浪费时间。\n铁律：调超参前先把数据质检做了——数据烂调什么都白搭。`) };

  DB["dl-a25"] = { level: 3, title: "训练监控面板", body: "训练要盯哪些曲线？每条曲线异常各说明什么？列出监控清单。", hint: "box_loss/cls_loss/val mAP/lr。", solution: C("text", "ans.txt", `监控四件套：\n①train box_loss：应平稳下降 → 不降=lr 问题；NaN=lr 太大/脏数据\n②train cls_loss：分类损失 → 高位不动=类别标注混乱\n③val mAP：泛化能力 → 和 train 差距拉大=过拟合\n④lr 曲线：确认调度生效（warmup 爬升+余弦下降）\n辅助：混淆矩阵（哪类被认成哪类）、PR 曲线（置信度阈值参考）\n每 10 epoch 存一次可视化预测图，肉眼比曲线更早发现问题。`) };

  DB["dl-a26"] = { level: 2, title: "置信度阈值部署值", body: "训练完部署，置信度阈值 0.25/0.45/0.65 分别什么效果？RM 实战怎么定？", hint: "按业务定不是拍脑袋。", solution: C("text", "ans.txt", `0.25：召回优先——框多杂框也多（人操辅助用）\n0.45：均衡——主流默认\n0.65：精确优先——干净但漏检（哨兵自动开火用）\nRM 定法：拿验证集画 PR 曲线，找满足「误检率 < 每帧 0.1 个」的最高召回点，那个置信度就是你的阈值。\n不同模式不同阈值，做成电控可调参数。`) };

  DB["dl-a27"] = { level: 3, title: "模型大小选择", body: "YOLOv8n 和 YOLOv8s 在 NUC 上推理时间 4ms vs 9ms，mAP 差 3 个点。怎么选？", hint: "帧率预算优先。", solution: C("text", "ans.txt", `先算预算：60fps 单帧 16.7ms，检测+跟踪+解算+通信要留 8ms 给别人。\nv8s 9ms 一项就吃掉大半 → 端到端撑不住 → 选 v8n。\n若相机 30fps（预算 33ms）→ v8s 放得下，3 个点 mAP 值得要。\n决策公式：先定帧率红线 → 剩余预算里选最大的模型。\nmAP 差 3 点在 RM 里约等于中远距离命中率差 5%，但掉帧 10fps 的延迟惩罚更狠。`) };

  DB["dl-a28"] = { level: 2, title: "ONNX 是什么", body: "ONNX 在部署管线里的角色？为什么不直接 PyTorch → TensorRT？", hint: "中间表示/解耦。", solution: C("text", "ans.txt", `ONNX = 开放的模型中间表示（计算图+权重的标准格式）。\n作用：训练框架（PyTorch）和部署引擎（TensorRT/OpenVINO/ONNX Runtime）之间的解耦层——训完导一份 ONNX，哪个引擎都能吃。\n不直连的原因：PyTorch 版本碎片化，TensorRT 不想适配 N 个框架版本；ONNX 做统一入口。\nRM 场景：PyTorch 训练 → ONNX 中转 → 队里 NUC 用 TensorRT、备用 x86 用 OpenVINO、调试用 ONNX Runtime——一份数据三处用。`) };

  DB["dl-a29"] = { level: 3, featured: true, title: "opset 陷阱", body: "导出 ONNX 报「Unsupported opset」，opset 是什么？TensorRT 对它有什么限制？", hint: "算子集版本。", solution: C("text", "ans.txt", `opset = ONNX 算子集版本号——数字越大支持的新算子越多（如 opset 13 才有某些注意力算子）。\n限制：TensorRT 每个版本对 opset 有上限（TRT 8.5 认到 opset 17，老 TRT 7.x 只到 12）。\n报错解法：export 时指定 format=onnx opset=12（向下兼容最稳）。\n选型矛盾：新模型架构要新算子（高 opset）↔ 部署引擎老（低 opset）→ 要么升 TRT 要么换等价旧算子重写。`) };

  DB["dl-a30"] = { level: 3, title: "动态 batch 导出", body: "部署时想一次推理 4 帧，ONNX 导出要注意什么？", hint: "dynamic axes。", solution: C("python", "ans.py", `import torch

model = YOLO("best.pt").model
dummy = torch.randn(1, 3, 640, 640)

torch.onnx.export(
    model, dummy, "best.onnx",
    opset_version=12,
    input_names=["images"],
    output_names=["output"],
    dynamic_axes={            # 关键：声明动态维度
        "images":  {0: "batch"},
        "output":  {0: "batch"},
    })

# TensorRT 构建引擎时指定:
# builder config set profile batch min=1 opt=4 max=8
# 推理时按实际 batch 分配 buffer`) };

  DB["dl-a31"] = { level: 3, title: "FP16 量化损失", body: "FP32 转 FP16 后 mAP 掉了 0.5 个点，正常吗？什么情况会掉更多？", hint: "正常/数值敏感层。", solution: C("text", "ans.txt", `掉 0~0.5 点：正常（半精度有效位数少）。\n掉 >2 点：异常，通常这几层对精度敏感——\n①小目标回归头（坐标数值范围小，量化误差占比大）\n②注意力 softmax（指数运算放大误差）\n对策：混合精度——敏感层强制 FP32（TensorRT 里按层设置 precision），其余 FP16，速度损失 <5% 精度全保。`) };

  DB["dl-a32"] = { level: 3, featured: true, title: "INT8 校准", body: "INT8 量化为什么要校准？校准集怎么选？", hint: "动态范围映射/代表性数据。", solution: C("text", "ans.txt", `FP32→INT8 是把连续值压进 256 档——每个张量的映射范围要靠「校准」统计：跑几百张真实数据，记录每层激活的 min/max/分布，定出最优缩放因子。\n校准集选择：\n①必须来自真实部署分布（RM 场地实拍 300~500 张）\n②覆盖光照/距离/姿态多样性——分布偏了量化权重就偏\n③别用 COCO 通用图校准 RM 模型——域差太大\n校准好的 INT8 掉点 <1；掉 3+ 就是校准集没代表性。`) };

  DB["dl-a33"] = { level: 3, title: "TensorRT 引擎绑定硬件", body: "为什么 TensorRT 引擎文件换一台机器（同是 RTX 3060）可能跑不起来？", hint: "编译期特化。", solution: C("text", "ans.txt", `TensorRT engine 是针对「精确的 GPU 型号 + TRT 版本 + CUDA 版本 + 计算能力」编译期特化的产物——kernel 代码按这套环境生成。\n同型号显卡但 TRT/CUDA 版本不同 → 反序列化直接失败或行为异常。\nRM 实操：引擎文件在比赛机上现场构建（首次启动 2~5 分钟），或把整个 Docker 镜像（TRT+CUDA 全锁定）拷过去。\n千万别在自己电脑编好 engine 直接拷到 NUC——十有八九白屏。`) };

  DB["dl-a34"] = { level: 2, title: "前后处理不在图里", body: "为什么 ONNX/TensorRT 输出还要自己写 NMS？预处理放哪里更好？", hint: "后处理独立/预处理进图。", solution: C("text", "ans.txt", "模型图里只做「张量到张量」的确定性计算；NMS 有非最大抑制的排序筛选逻辑，老 TRT 不支持动态控制流 → 导出时默认剥离，自己写。\n预处理（letterbox/归一化/通道转换）两种做法：\n①CPU 做：灵活但占 1~2ms\n②做成图的首层（conv 权重等价于归一化）：引擎内完成零额外开销\nRM 追求极限速度：预处理融进图，后处理手写 C++ + SIMD。") };

  DB["dl-a35"] = { level: 3, title: "CUDA 流水线并行", body: "推理时 GPU 和 CPU 怎么并行？伪代码示意「预处理(下一帧) 与 推理(当前帧)」重叠执行。", hint: "双缓冲+异步拷贝。", solution: C("python", "ans.py", `# 思路：CPU 预处理下一帧时 GPU 在算当前帧
stream = cv2.cuda_Stream() if False else None  # 示意

frame_a = get_frame()
blob_a  = preprocess(frame_a)     # CPU 预处理 A

while True:
    frame_b = get_frame()          # 采集 B（IO 线程）
    # 异步：GPU 算 A 的同时 CPU 预处理 B
    future = executor.submit(infer_gpu, blob_a)   # GPU: A
    blob_b = preprocess(frame_b)                   # CPU: B
    result_a = future.result()                     # 收 A 结果
    postprocess(result_a)                          # CPU: A 后处理
    blob_a, frame_a = blob_b, frame_b              # 滚动交换

# 收益：4ms(GPU) 和 1.5ms(CPU预处理) 重叠 → 端到端省 1.5ms`) };

  DB["dl-a36"] = { level: 3, featured: true, title: "手写：C++ 后处理完整版", body: "写 TensorRT YOLOv8 输出的完整 C++ 后处理：置信度过滤→letterbox 逆变换→类别解析→NMS→输出结构体数组。", hint: "8400×(4+nc) 布局。", solution: C("cpp", "post.cpp", `#include <vector>
#include <algorithm>
#include <cmath>

struct Det { float x1,y1,x2,y2,score; int cls; };

static float iou(const Det&a, const Det&b){
    float xx1=std::max(a.x1,b.x1), yy1=std::max(a.y1,b.y1);
    float xx2=std::min(a.x2,b.x2), yy2=std::min(a.y2,b.y2);
    float w=std::max(0.f,xx2-xx1), h=std::max(0.f,yy2-yy1);
    float inter=w*h;
    float ua=(a.x2-a.x1)*(a.y2-a.y1)+(b.x2-b.x1)*(b.y2-b.y1)-inter;
    return ua>0? inter/ua : 0;
}

std::vector<Det> postprocess(const float* out, int rows,   // rows=8400
                             int nc,                        // 类别数(2)
                             float conf_th, float nms_th,
                             float scale, float dx, float dy,
                             int net=640){
    std::vector<Det> dets;
    const int stride = 4 + nc;

    #pragma omp parallel for
    for(int i=0;i<rows;++i){
        const float* r = out + i*stride;
        // v8: 前4维是xywh,后面是各类分数(无objectness)
        float best=0; int cls=0;
        for(int c=0;c<nc;++c) if(r[4+c]>best){best=r[4+c];cls=c;}
        if(best < conf_th) continue;

        float cx=r[0], cy=r[1], w=r[2], h=r[3];
        // letterbox 逆变换
        float x1=(cx-w/2-dx)/scale, y1=(cy-h/2-dy)/scale;
        Det d{x1, y1, x1+w/scale, y1+h/scale, best, cls};
        #pragma omp critical
        dets.push_back(d);
    }

    std::sort(dets.begin(),dets.end(),
        [](const Det&a,const Det&b){return a.score>b.score;});
    std::vector<Det> keep;
    for(auto&d:dets){
        bool sup=false;
        for(auto&k:keep) if(iou(d,k)>nms_th){sup=true;break;}
        if(!sup) keep.push_back(d);
    }
    return keep;
}`) };

  DB["dl-a37"] = { level: 3, title: "多目标跟踪 ID 切换", body: "两个装甲板交叉飞过，跟踪 ID 互换了（1变2、2变1）。什么原因？怎么缓解？", hint: "IoU 关联歧义/外观特征。", solution: C("text", "ans.txt", `原因：交叉瞬间两框重叠，纯 IoU 关联分不清谁是谁——运动模型（匀速假设）在交叉时也失效。\n缓解：\n①加入外观特征：提 ROI 的小特征（颜色直方图/轻量 embedding），IoU + 外观距离加权关联\n②匈牙利算法全局最优匹配代替贪心（减少局部错配）\n③交叉瞬间置信度下降时信任运动模型预测（KF 预测位置）而非抖动的检测框\nDeepSORT/BoT-SORT 的核心就是 ①③，RM 直接用 BoT-SORT。`) };

  DB["dl-a38"] = { level: 3, title: "跟踪 + KF 预测射击提前量", body: "目标横向速度 3m/s 距离 5m，弹速 15m/s。视觉系统还要补多少提前量？计算并说明跟踪器怎么给出这个速度。", hint: "飞行时间 0.33s → 提前 1m。", solution: C("text", "ans.txt", `弹丸飞行时间 t = 5/15 ≈ 0.333s\n提前量 = 3m/s × 0.333s = 1.0m（横向）\n跟踪器给速度：KF 状态向量里的 (vx, vy) 就是滤波后的速度估计（比相邻帧差分平滑得多）。\n射击逻辑：目标当前位置 + v×t_flight + 重力下坠补偿 → 云台预瞄点。\n注意 v 是目标系速度，云台自身旋转要 IMU 补偿扣除——不然自己一转提前量全错。`) };

  DB["dl-a39"] = { level: 3, featured: true, title: "能量机关正弦拟合", body: "大符转速 spd(t)=a·sin(bt+c)+d，采样 60 帧。写最小二乘拟合 + 预测 0.3s 后转角的代码。", hint: "curve_fit + 积分。", solution: C("python", "ans.py", `import numpy as np
from scipy.optimize import curve_fit

def sine(t,a,b,c,d): return a*np.sin(b*t+c)+d

t = np.arange(60)/60.0                 # 1s 采样
true=(0.8,1.9,0.4,1.0)
spd = sine(t,*true)+np.random.normal(0,.02,60)

p0=[spd.std(), 1.0, 0.0, spd.mean()]   # 初值: a=std,b=1,c=0,d=mean
(a,b,c,d),_ = curve_fit(sine,t,spd,p0=p0,maxfev=20000)
print(f"a={a:.3f} b={b:.3f} c={c:.3f} d={d:.3f}")

# 预测 0.3s 后转角 = 转速积分
tf = np.linspace(t[-1], t[-1]+0.3, 60)
angle = np.trapz(sine(tf,a,b,c,d), tf)
print(f"预测转角 {np.degrees(angle):.1f}°")   # 云台提前量`) };

  DB["dl-a40"] = { level: 3, title: "系统联调延迟分解", body: "端到端延迟 28ms 超标（目标 20ms），已测：曝光4/传输3/预处理1/推理6/后处理2/串口2/电控7。砍哪三刀最划算？", hint: "电控7/传输3/推理6。", solution: C("text", "ans.txt", `三刀优先级：\n①电控 7ms：控制周期和视觉帧不同步，平均等半个周期 → 电控改中断驱动或对齐时间戳，省 3ms\n②传输 3ms：USB→GigE 相机或提高 mmap 效率，省 1~2ms\n③推理 6ms：FP16→INT8（已校准好数据）或输入 640→576，省 1.5ms\n合计省 6ms → 22ms 达标边缘，再把后处理 2ms 用 SIMD 优化到 1ms → 21ms。\n注意：曝光 4ms 是物理下限（灯条亮度换的）动不得。`) };
})(window);
