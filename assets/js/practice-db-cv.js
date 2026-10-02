// OpenCV 题库 A 卷（40 题：像素/ROI/色彩/二值化/形态学）
(function (global) {
  "use strict";
  var DB = global.PRACTICE_DB = global.PRACTICE_DB || {};
  var C = H.code;

  DB["cv-a01"] = { level: 1, title: "像素读取：BGR 顺序", body: "cv2.imread 读入图后 img[50,100] 返回 (255, 0, 0)，这个像素是什么颜色？手写推理过程。", hint: "OpenCV 默认 BGR 不是 RGB。", solution: C("text", "ans.txt", `B=255, G=0, R=0 → 蓝色。\nOpenCV 默认通道顺序是 BGR，三元组按 (B,G,R) 解读。`) };

  DB["cv-a02"] = { level: 1, title: "shape 解读", body: "img.shape 返回 (480, 640, 3)，说明图像的宽、高、通道各是多少？为什么行在前？", hint: "shape 是 (行, 列, 通道)；行=y=高。", solution: C("text", "ans.txt", `高 480、宽 640、3 通道。\n行数在前因为 NumPy 数组按 [行,列] 索引，行对应图像的 y（高），列对应 x（宽）。`) };

  DB["cv-a03"] = { level: 1, title: "手写：单像素修改", body: "把图像第 100 行、第 200 列的像素改成纯红色（BGR），写出代码。", hint: "img[y, x] = (B, G, R)；纯红是 R=255。", solution: C("python", "ans.py", `img[100, 200] = (0, 0, 255)   # B=0, G=0, R=255 → 纯红`) };

  DB["cv-a04"] = { level: 1, title: "灰度图 shape", body: "一张 640×480 的灰度图 img.shape 返回什么？和彩色图差在哪？", hint: "灰度是单通道。", solution: C("text", "ans.txt", `(480, 640)，只有两维。\n灰度图没有第三维（通道数），所以比彩色图少一维。`) };

  DB["cv-a05"] = { level: 1, featured: true, title: "ROI 切片方向", body: "img[100:200, 300:500] 取出的是图像哪一块？写出宽高。如果意图是「x 从 100 到 200」该怎么写？", hint: "[行,列] = [y,x]。", solution: C("text", "ans.txt", `取出：y∈[100,200), x∈[300,500)，即高 100、宽 200 的区域。\n若意图是 x∈[100,200)：写 img[:, 100:200] 或具体行范围 img[0:480, 100:200]。\n口诀：先 y 后 x，行在前列在后。`) };

  DB["cv-a06"] = { level: 1, title: "通道分离三法", body: "写出三种分离 BGR 三通道的方法，并说明哪种返回的是视图（不拷贝内存）。", hint: "cv2.split / 索引切片 / reshape。", solution: C("python", "ans.py", `# 法1：cv2.split（拷贝，慢）
b, g, r = cv2.split(img)

# 法2：索引切片（视图，零拷贝，快）
b = img[:, :, 0]
g = img[:, :, 1]
r = img[:, :, 2]

# 法3：numpy reshape（视图）
b = img.reshape(-1, 3)[:, 0]

RM 实时管线用法2：零拷贝，不占内存带宽。`) };

  DB["cv-a07"] = { level: 2, title: "HSV 的 H 范围", body: "OpenCV 里 HSV 的 H 通道范围是多少？为什么不是 0~360？红蓝色各在什么范围？", hint: "uint8 装不下 360；H 除以 2 存。", solution: C("text", "ans.txt", `H 范围 0~180（uint8 上限 255 装不下 360，所以除以 2）。\n红：0~10 和 160~180（色相环两端）\n蓝：100~130\nS 和 V 范围 0~255。`) };

  DB["cv-a08"] = { level: 2, featured: true, title: "红色为何要两段", body: "用 cv2.inRange 抠红色为什么要两个范围再取并集？写出完整代码。", hint: "H 色相环是圆的，红色在 0°/360° 两端。", solution: C("python", "ans.py", `hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
m1 = cv2.inRange(hsv, (0, 100, 100), (10, 255, 255))
m2 = cv2.inRange(hsv, (160, 100, 100), (180, 255, 255))
mask = m1 | m2      # 两段取并集

原因：色相环是圆的，红色恰在 0° 和 360° 两端，
物理同一个颜色数值上分居头尾，必须两段并集。`) };

  DB["cv-a09"] = { level: 2, title: "HSV 抗光照", body: "为什么 HSV 色彩空间比 BGR 更抗光照变化？哪个通道受光照影响最大？", hint: "光照主要影响亮度 V，色相 H 稳定。", solution: C("text", "ans.txt", `光照变化主要改变亮度(V)和部分饱和度(S)，但色相(H)——颜色的本质——基本不变。\nBGR 三个通道都会被光照拉高拉低，红色暗红数值差异大；HSV 里暗红和亮红 H 相同，只需放宽 V 的阈值。\n受光照影响最大的是 V，所以 inRange 时 V 的下限可以给低一些。`) };

  DB["cv-a10"] = { level: 2, title: "cvtColor 前置检查", body: "写一个安全调用 cv2.cvtColor 的包装函数：自动判断输入是彩色还是灰度，避免对灰度图做 BGR2HSV 报错。", hint: "ndim 判断通道数。", solution: C("python", "ans.py", `def to_hsv(img):
    if img.ndim == 3 and img.shape[2] == 3:
        return cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    raise ValueError(f"需要 BGR 三通道，得到 shape={img.shape}")

def to_gray(img):
    if img.ndim == 2:
        return img                          # 已是灰度
    return cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)`) };

  DB["cv-a11"] = { level: 2, title: "固定阈值 vs 自适应", body: "现场光照不均（左亮右暗），固定阈值 127 会出什么问题？自适应阈值如何解决？代价是什么？", hint: "全局阈值顾此失彼；自适应按邻域算；代价是慢和参数敏感。", solution: C("text", "ans.txt", `固定阈值：暗区整体掉到阈值以下被切掉（漏检），亮区噪点被放大（误检）。\n自适应阈值：每个像素按周围 blockSize 邻域的均值/高斯加权动态定阈值，明暗区各得其所。\n代价：①计算慢（卷积操作）②blockSize 和 C 两个参数要调 ③边缘效应（边界处邻域不完整）。`) };

  DB["cv-a12"] = { level: 2, title: "adaptiveThreshold 参数", body: "cv2.adaptiveThreshold(src, 255, ADAPTIVE_THRESH_GAUSSIAN_C, THRESH_BINARY, 11, 2) 里 11 和 2 分别是什么？调大调小各有什么现象？", hint: "11 是邻域大小 blockSize，2 是常数偏移 C。", solution: C("text", "ans.txt", `11 = blockSize 邻域尺寸（必须是奇数），2 = C 常数偏移。\nblockSize 调大：阈值更平滑，细节丢失，小目标被淹没\nblockSize 调小：对局部噪声敏感，出现碎斑\nC 调大（如 5）：更严格，前景变细甚至断裂\nC 调小或负：更宽松，背景噪声混入\nRM 灯条：blockSize 取灯条宽度的 1~2 倍，C=2~5 起步。`) };

  DB["cv-a13"] = { level: 2, featured: true, title: "腐蚀膨胀方向", body: "二值图中白色是前景。腐蚀后白色区域变大还是变小？膨胀呢？各适合什么场景？", hint: "腐蚀 = 用黑色吃白色；膨胀 = 白色扩张。", solution: C("text", "ans.txt", `腐蚀：白色区域缩小（邻域内有黑就变黑）→ 去孤立小噪点\n膨胀：白色区域扩大（邻域内有白就变白）→ 连接断裂区域、填补小洞\nRM 场景：\n  先腐蚀去噪 → 再膨胀恢复尺寸 = 开运算\n  先膨胀连断裂 → 再腐蚀恢复 = 闭运算`) };

  DB["cv-a14"] = { level: 2, title: "开闭运算组合", body: "二值图既有噪点又有灯条断裂，应该先开还是先闭？写出处理顺序和理由。", hint: "先开去噪再闭补缝；顺序反了会把噪点先放大。", solution: C("text", "ans.txt", `先开（去噪）再闭（补缝）。\n原因：如果先闭运算，膨胀会把孤立噪点放大成实心块，后续腐蚀也删不掉，噪点永久化。\n先开运算把噪点在膨胀阶段之前就删掉，之后闭运算只处理真正的断裂。\n代码：opened = morphologyEx(binary, MORPH_OPEN, k3)\n     closed = morphologyEx(opened, MORPH_CLOSE, k5)`) };

  DB["cv-a15"] = { level: 2, title: "结构元素形状", body: "cv2.getStructuringElement 有 MORPH_RECT / MORPH_ELLIPSE / MORPH_CROSS 三种。处理竖直灯条噪声用哪种？为什么？", hint: "灯条是竖长的，结构元素应该匹配目标形状。", solution: C("text", "ans.txt", `用 MORPH_RECT 竖长核，如 (1, 5)——宽 1 高 5。\n原因：结构元素形状决定保留什么形状的前景。竖长核在竖直方向膨胀/腐蚀更强，恰好匹配竖直灯条，水平方向的孤立噪点被有效清除而灯条主体不受损。\n通用去噪用 MORPH_ELLIPSE（圆形，各方向均匀）。\nMORPH_CROSS 用于去除十字形干扰。`) };

  DB["cv-a16"] = { level: 3, featured: true, title: "手写：形态学核尺寸实验", body: "生成一张模拟二值图（两条竖直灯条 + 随机噪点），分别用 3×3、5×5、7×7 开运算处理，统计处理后剩余连通域数量，找出最佳核尺寸。写出完整实验代码。", hint: "np.random 撒噪点；findContours 数连通域；最佳 = 噪点全灭且灯条保住。", solution: C("python", "ans.py", `import cv2
import numpy as np

# 造图：两条竖灯条(宽8高60) + 200 个随机噪点
img = np.zeros((200, 300), np.uint8)
cv2.rectangle(img, (100, 60), (108, 120), 255, -1)
cv2.rectangle(img, (190, 60), (198, 120), 255, -1)
for _ in range(200):
    x, y = np.random.randint(0, 300), np.random.randint(0, 200)
    cv2.circle(img, (x, y), 1, 255, -1)

for size in [3, 5, 7]:
    k = cv2.getStructuringElement(cv2.MORPH_RECT, (size, size))
    out = cv2.morphologyEx(img, cv2.MORPH_OPEN, k)
    cnts, _ = cv2.findContours(out, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    areas = sorted(cv2.contourArea(c) for c in cnts)[-2:]
    print(f"核{size}x{size}: 连通域 {len(cnts)} 个, 最大两块面积 {areas}") 
# 预期：3x3 噪点残留多；5x5 噪点全灭灯条完好(2个)；7x7 灯条被吃只剩1个`) };

  DB["cv-a17"] = { level: 1, title: "findContours 输入要求", body: "cv2.findContours 的输入必须是什么类型的图？彩色图直接喂会怎样？", hint: "8 位单通道二值图。", solution: C("text", "ans.txt", `必须 8 位单通道二值图（非 0 即 255）。\n彩色图直接喂会报错（新版 OpenCV）或行为未定义（旧版）。\n标准流程：cvtColor 转灰度 → threshold/inRange 二值化 → findContours。`) };

  DB["cv-a18"] = { level: 2, title: "RETR_EXTERNAL vs RETR_TREE", body: "findContours 的 RETR_EXTERNAL 和 RETR_TREE 有什么区别？RM 筛装甲板用哪个？", hint: "外层轮廓 vs 全层级轮廓。", solution: C("text", "ans.txt", `RETR_EXTERNAL：只返回最外层轮廓，忽略内部洞\nRETR_TREE：返回全部轮廓及层级关系（谁套谁）\nRM 筛装甲板用 RETR_EXTERNAL：灯条是实心条没有内部结构，\n只要外层轮廓就够，层级信息白算还添乱。\n要分析装甲板内部结构（如灯珠排布）才用 RETR_TREE。`) };

  DB["cv-a19"] = { level: 2, title: "CHAIN_APPROX_SIMPLE", body: "轮廓近似方法 CHAIN_APPROX_SIMPLE 和 CHAIN_APPROX_NONE 的区别？对性能有什么影响？", hint: "压缩冗余点 vs 全部点。", solution: C("text", "ans.txt", `NONE：存轮廓上所有点（一条直线存几百个点）\nSIMPLE：只存拐点（同一条直线只存两个端点）\n信息完全等价，SIMPLE 内存省 90%+，后续 contourArea/boundingRect 计算更快。\nRM 实时管线永远用 SIMPLE，除非要逐点画轮廓线。`) };

  DB["cv-a20"] = { level: 2, title: "contourArea 单位", body: "cv2.contourArea 返回的面积单位是什么？一张 1080p 图里装甲板灯条面积大约什么量级？", hint: "平方像素。", solution: C("text", "ans.txt", `单位是平方像素（px²）。\n1080p 图中 4 米外装甲板灯条约 15×50 px → 面积约 750 px²；\n2 米外约 30×100 → 3000 px²；8 米外约 8×25 → 200 px²。\n所以面积筛选范围通常设 [100, 5000] 覆盖 2~8 米。`) };

  DB["cv-a21"] = { level: 3, featured: true, title: "装甲板三板斧筛选", body: "手写完整轮廓筛选器：面积、宽高比、绝对尺寸三条件，并说明每个条件的阈值怎么定。", hint: "面积覆盖距离范围；宽高比 0.2~0.7 匹配竖长条；绝对尺寸防极端。", solution: C("python", "ans.py", `def filter_bars(contours):
    bars = []
    for c in contours:
        area = cv2.contourArea(c)
        if not (100 < area < 5000):  continue    # 面积：覆盖2~8m距离范围
        x, y, w, h = cv2.boundingRect(c)
        if not (0.2 < w/h < 0.7):    continue    # 宽高比：竖长条特征
        if w < 8 or h < 20:          continue    # 绝对尺寸：防极端远/近
        bars.append((x, y, w, h))
    return bars

# 阈值定法：
# 面积上限 = 最近距离灯条面积 × 1.5（防贴脸误检）
# 面积下限 = 最远距离灯条面积 × 0.7
# 宽高比 = 实测灯条 w/h 分布 (mean±3σ)
# 绝对尺寸 = 兜底，防面积正常但形状怪异的误检`) };

  DB["cv-a22"] = { level: 3, title: "boundingRect vs minAreaRect", body: "cv2.boundingRect 和 cv2.minAreaRect 有什么区别？斜置灯条用哪个？为什么？", hint: "轴对齐 vs 任意角度。", solution: C("text", "ans.txt", `boundingRect：轴对齐外接矩形，返回 (x,y,w,h)，快但斜目标时框偏大\nminAreaRect：最小面积旋转矩形，返回中心/尺寸/角度，精确但慢\n斜置灯条（小陀螺）用 minAreaRect：轴对齐框会把斜条框成大块，宽高比失真，筛选失效。\nminAreaRect 拿到的角度还能直接用于装甲板姿态初判。`) };

  DB["cv-a23"] = { level: 3, title: "宽高比失效场景", body: "小陀螺状态下装甲板斜到 60°，宽高比筛选为什么失效？如何补救？", hint: "斜置后投影宽度变大；用旋转矩形或角度补偿。", solution: C("text", "ans.txt", `竖直灯条 w/h≈0.4，斜 60° 后水平投影变宽，w/h 可能到 1.5，超出筛选范围被扔掉。\n补救：\n①minAreaRect 拿旋转角 θ，用 h·cos(θ) 还原真实投影再算比例\n②放宽宽高比范围到 [0.2, 2.0]，用其他特征（灯条平行性、间距比）补筛\n③上深度学习，网络对姿态天然鲁棒（这也是 YOLO 替代传统法的核心原因）`) };

  DB["cv-a24"] = { level: 2, title: "灯条配对逻辑", body: "筛选出多条灯条后，怎么判断哪两条属于同一块装甲板？写出配对条件。", hint: "平行、等高、间距在装甲板宽度范围、同色。", solution: C("text", "ans.txt", `四条件配对：\n①平行：两灯条角度差 < 7°（minAreaRect 角度）\n②等高：高度比在 [0.7, 1.4]\n③间距：中心距 ∈ [0.8, 3.2] × 单灯条高度（装甲板宽度比例）\n④同色：HSV 色相同类（红/蓝不能配对）\n全部满足 → 配成装甲板候选，取两灯条中点为装甲板中心。`) };

  DB["cv-a25"] = { level: 2, title: "透视变换四点顺序", body: "cv2.getPerspectiveTransform 的源点和目标点四点顺序有什么要求？顺序错了会怎样？", hint: "一一对应；顺序错 = 目标扭曲。", solution: C("text", "ans.txt", `要求：源四点和目标四点按相同顺序排列（都按左上、右上、右下、左下）。\n顺序错乱的后果：计算的变换矩阵把左上角映射到右下角，输出图像被旋转/镜像/扭曲，完全不是想要的校正效果。\n调试技巧：画四个不同颜色的圈标出四点，imshow 检查顺序再送变换。`) };

  DB["cv-a26"] = { level: 3, featured: true, title: "手写：数字牌透视校正", body: "装甲板中间的数字牌斜着拍，四个角点已知（自己设坐标），写透视变换把它拉成 100×100 正视图，用于后续数字分类。", hint: "getPerspectiveTransform + warpPerspective。", solution: C("python", "ans.py", `import cv2, numpy as np

img = cv2.imread("armor.jpg")
# 数字牌四角（左上、右上、右下、左下）
src = np.float32([[210,95],[260,98],[258,140],[208,137]])
dst = np.float32([[0,0],[100,0],[100,100],[0,100]])

M = cv2.getPerspectiveTransform(src, dst)
card = cv2.warpPerspective(img, M, (100, 100))
cv2.imwrite("card_100.png", card)   # 送分类器识别数字 1/2/3/4/5`) };

  DB["cv-a27"] = { level: 2, title: "仿射 vs 透视", body: "cv2.warpAffine 和 cv2.warpPerspective 的数学区别？各保持什么不变？", hint: "2×3 vs 3×3；平行 vs 直线。", solution: C("text", "ans.txt", `仿射（2×3 矩阵，3 点确定）：旋转/平移/缩放/错切\n  保持：平行线仍平行、平面上比例关系\n透视（3×3 矩阵，4 点确定）：模拟三维投影\n  保持：直线仍是直线（平行线可以相交于消失点）\nRM 场景：云台转动补偿用仿射（近似平面旋转）；\n斜拍装甲板拉正用透视（有真实三维透视畸变）。`) };

  DB["cv-a28"] = { level: 2, title: "ORB vs SIFT", body: "ORB 和 SIFT 特征点各有什么优劣？RM 实时管线为什么选 ORB？", hint: "专利/速度/精度三角。", solution: C("text", "ans.txt", `SIFT：精度高、尺度旋转鲁棒，但慢（CPU 上百 ms 级）+ 历史专利问题\nORB：速度极快（ms 级）、免费开放，精度略逊但在纹理丰富时够用\nRM 选 ORB：60fps 预算下 SIFT 根本跑不动；能量机关纹理足够 ORB 提取稳定特征。\n若主机有 GPU 且追求极致匹配精度，可考虑 GPU-SIFT。`) };

  DB["cv-a29"] = { level: 3, title: "BFMatcher crossCheck", body: "cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True) 的 crossCheck 是什么意思？和 KNN 匹配+比率测试的区别？", hint: "双向最优 vs 单向最近邻距离比。", solution: C("text", "ans.txt", `crossCheck=True：A→B 最近邻和 B→A 最近邻必须是同一对才算匹配（双向确认），精度高但只出一对一匹配。\nKNN(k=2)+比率测试：每个特征找最近 2 个，若 d1/d2 < 0.75 才接受（区分性检验），保留更多匹配但对重复纹理不稳。\nRM 帧间跟踪：目标少纹理单一，crossCheck 更稳；\n场景识别大数据库：KNN+比率测试召回更高。`) };

  DB["cv-a30"] = { level: 3, featured: true, title: "RANSAC 单应性", body: "cv2.findHomography 用 RANSAC 估计两帧间的单应矩阵。解释 RANSAC 为什么能剔除外点（误匹配），写出调用代码。", hint: "随机采样一致集迭代。", solution: C("python", "ans.py", `# RANSAC 思想：
# 随机抽 4 对匹配 → 算一个候选 H → 数有多少匹配符合这个 H（内点）
# 重复上百次 → 内点最多的 H 胜出 → 不符合它的匹配全是外点被剔除

src = np.float32([kp1[m.queryIdx].pt for m in good]).reshape(-1,1,2)
dst = np.float32([kp2[m.trainIdx].pt for m in good]).reshape(-1,1,2)
H, mask = cv2.findHomography(src, dst, cv2.RANSAC, 5.0)
inliers = mask.ravel().sum()
print(f"内点 {inliers}/{len(good)}")   # 内点率 > 60% 才可信`) };

  DB["cv-a31"] = { level: 2, title: "帧率预算计算", body: "相机 60fps，整个视觉管线（含 imshow 显示）每帧耗时 25ms，实际帧率是多少？丢帧率多少？", hint: "1000/25 = 40fps；60-40=20 帧丢。", solution: C("text", "ans.txt", `实际帧率 = 1000 / 25 = 40 fps\n丢帧率 = (60 - 40) / 60 ≈ 33%\n要吃满 60fps，单帧预算必须 ≤ 16.7ms。\nimshow 在无头模式下也要 5~8ms，部署版去掉显示能白捡这些时间。`) };

  DB["cv-a32"] = { level: 2, featured: true, title: "性能剖析定位瓶颈", body: "视觉管线只有 20fps，怎么系统性地找出最慢的环节？写出剖析代码框架。", hint: "time.perf_counter 分段计时。", solution: C("python", "ans.py", `import time

class Profiler:
    def __init__(self): self.t = {}
    def mark(self, name):
        self.t.setdefault(name, []).append(time.perf_counter())
    def report(self):
        total = sum(v[-1]-v[0] for v in self.t.values())
        for name, ts in self.t.items():
            cost = (ts[-1]-ts[0])*1000
            print(f"{name:12s} {cost:6.1f}ms  {cost/total*100:4.1f}%")

prof = Profiler()
# 管线里埋点
prof.mark("read")      # 读帧
ret, frame = cap.read()
prof.mark("preproc")   # 预处理
hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
mask = cv2.inRange(hsv, lo, hi)
prof.mark("detect")    # 检测
cnts, _ = cv2.findContours(mask, ...)
prof.mark("solve")     # 解算
...
prof.mark("draw")      # 显示
cv2.imshow(...)
prof.report()          # 输出各环节占比 → 砍最粗的那根`) };

  DB["cv-a33"] = { level: 3, title: "imshow 偷时间", body: "为什么调试完的代码直接部署会更快？imshow 和 waitKey 各占多少时间？无头模式怎么保留调试能力？", hint: "显示 5-8ms + waitKey 1ms；录制关键帧代替实时显示。", solution: C("text", "ans.txt", `imshow 渲染 5~8ms + waitKey 至少 1ms ≈ 10ms，占 16ms 预算的 60%。\n部署方案：\n①无头模式直接砍掉显示（--headless 参数控制）\n②调试需求改为「关键帧落盘」：每 100 帧存一张带框结果图\n③远程调试：结果图走 socket 发到开发机看\n千万别在比赛机上留 imshow——白丢一半帧率。`) };

  DB["cv-a34"] = { level: 3, title: "相机参数设置", body: "VideoCapture 打开后要设置哪些参数保证 60fps？列出关键 set 调用和各自的意义。", hint: "分辨率/帧率/曝光/缓冲区。", solution: C("python", "ans.py", `cap = cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_FRAME_WIDTH,  1280)   # 分辨率别超需
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
cap.set(cv2.CAP_PROP_FPS, 60)              # 请求 60fps
cap.set(cv2.CAP_PROP_EXPOSURE, 30)         # 手动曝光！自动会漂
cap.set(cv2.CAP_PROP_AUTO_EXPOSURE, 1)     # 1=手动 3=自动
cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)        # 缓冲只留1帧,防读到旧帧

# 关键三点：
# 1. 手动曝光：自动曝光随场景亮度漂移,HSV阈值跟着崩
# 2. BUFFERSIZE=1：默认缓冲4帧,读到的永远是80ms前的旧图
# 3. 分辨率够用就好：1280x720 比 1920x1080 快一倍`) };

  DB["cv-a35"] = { level: 3, featured: true, title: "相机缓冲旧帧问题", body: "视觉打出去的弹总是偏一个固定量，排查发现相机 BUFFERSIZE 默认是 4。解释原因并写出修复代码。", hint: "缓冲 4 帧 × 16.7ms = 67ms 旧图。", solution: C("text", "ans.txt", `原因：驱动缓冲区默认存 4 帧。你的处理速度略低于采集速度时，每次 read() 拿到的是 4 帧前（约 67ms）的旧图像。目标 2m/s 时 67ms 偏差 = 13cm，直接脱靶。\n\n修复：\ncap.set(cv2.CAP_PROP_BUFFERSIZE, 1)\n更彻底的方案是 V4L2 MMAP 零拷贝自己管理缓冲，或用工业相机 SDK 的回调模式拿最新帧。\n验证方法：对着秒表拍，比对画面时间和当前时间差。`) };

  DB["cv-a36"] = { level: 3, title: "标定拍图要点", body: "棋盘格标定要拍多少张？角度有什么要求？为什么不能全拍正面？", hint: "20+ 张，多角度多位置覆盖全视野。", solution: C("text", "ans.txt", `数量：≥20 张有效图（角点全检出的）。\n角度要求：俯仰 ±30°、左右偏转 ±45°、绕光轴旋转 0/90° 各来几张；覆盖画面中心/四角/边缘。\n不能全拍正面的原因：标定要解畸变系数（径向 k1,k2,k3 + 切向 p1,p2）。正面平行拍时畸变项和位姿项数学上耦合，方程病态解不准。倾斜视角才能把两者分开。\n质检：calibrateCamera 返回重投影误差 < 0.5px 才算合格。`) };

  DB["cv-a37"] = { level: 3, featured: true, title: "重投影误差解读", body: "calibrateCamera 返回的重投影误差 0.8px，说明什么？该怎么处理？", hint: ">0.5 不合格；先查最差几张图。", solution: C("text", "ans.txt", `0.8px 超标（合格线 0.5px）——说明有图角点检测差或棋盘平面度不行。\n排查步骤：\n①逐张算每张的重投影误差,找出最差的 3~5 张\n②常见问题：角点检测错位(模糊/反光)、棋盘打印翘曲、视野边缘只露半个棋盘\n③删掉最差图重标 → 误差通常能压回 0.4 以下\n④还不行 → 重打印棋盘贴平板(玻璃/铝板)重拍\n注意：不能无脑删到只剩 10 张,样本太少方程病态。`) };

  DB["cv-a38"] = { level: 3, title: "内参矩阵解读", body: "标定输出 K = [[820, 0, 320], [0, 815, 240], [0, 0, 1]]。解释每个元素含义。fx 和 fy 差 5 说明什么？", hint: "焦距像素单位/主点； fx≠fy = 像素非正方形。", solution: C("text", "ans.txt", `fx=820, fy=815：焦距的像素单位表示（物理焦距 ÷ 像素尺寸）\n(cx,cy)=(320,240)：主点（光轴与像平面交点的像素坐标），理想在图像中心\nfx≈fy 但差 5：像素不是完美正方形（制造公差），差 0.6% 属正常\n若 fx/fy 差 >2% → 标定质量差，重拍。\n640×480 图中心是 (320,240)，主点偏离中心 >10px 也要警惕装配偏心。`) };

  DB["cv-a39"] = { level: 3, featured: true, title: "手写：PnP 解算装甲板距离", body: "装甲板灯条已知物理尺寸（两灯条中心距 230mm，灯条高 55mm），标定内参已知。手写 solvePnP 代码解算装甲板相对相机的距离和姿态角。", hint: "objectPoints 用世界坐标(mm)，imagePoints 用像素；solvePnP 输出 rvec/tvec。", solution: C("python", "ans.py", `import cv2, numpy as np

K = np.array([[820,0,320],[0,815,240],[0,0,1]], np.float32)  # 标定所得
dist = np.zeros(5)                                           # 标定所得

# 装甲板四点世界坐标(右上/右下/左下/左上,单位mm)
obj = np.array([[115, 27.5, 0], [115, -27.5, 0],
                [-115, -27.5, 0], [-115, 27.5, 0]], np.float32)

# 图像上检测到的四点像素坐标(透视校正后的角点)
imgpts = np.array([[340,150],[345,210],[300,212],[296,152]], np.float32)

ok, rvec, tvec = cv2.solvePnP(obj, imgpts, K, dist, flags=cv2.SOLVEPNP_IPPE)
print(f"距离: {np.linalg.norm(tvec):.0f} mm")
print(f"平移: x={tvec[0][0]:.0f} y={tvec[1][0]:.0f} z={tvec[2][0]:.0f}")

R, _ = cv2.Rodrigues(rvec)
euler = np.degrees(cv2.RQDecomp3x3(R)[0])
print(f"姿态角: yaw={euler[1]:.1f}° pitch={euler[0]:.1f}° roll={euler[2]:.1f}°")
# 距离即 tvec 模长；z 分量是沿光轴深度`) };

  DB["cv-a40"] = { level: 3, title: "IPPE 平面解", body: "flags=cv2.SOLVEPNP_IPPE 适合什么场景？和默认 ITERATIVE 的区别？", hint: "共面四点专用；快且给两个解。", solution: C("text", "ans.txt", `IPPE 专为「目标四点共面」设计（装甲板正好是平面四点）。\n优势：解析解不需要迭代，比 ITERATIVE 快一个量级且不会陷入局部最优。\n特点：返回两个候选解（平面目标几何歧义），用 reprojectionError 挑小的那个。\nRM 装甲板解算标准姿势：IPPE + 比较两解重投影误差。\n非平面目标（如能量机关立体扇叶）用 SOLVEPNP_SQPNP 或 ITERATIVE。`) };
})(window);
