// 控制进阶补充 10 题（凑满 120）
(function (global) {
  "use strict";
  var DB = global.PRACTICE_DB = global.PRACTICE_DB || {};
  var C = H.code;

  DB["cva-b31"] = { level: 2, title: "PID 采样补偿", body: "控制周期从 1ms 改 2ms，直接沿用旧参数会怎样？理论怎么补偿？", hint: "离散化误差/增益折算。", solution: C("text", "ans.txt", `周期翻倍：离散积分步长翻倍（等效 ki×2）、微分差分间隔翻倍（等效 kd×0.5）——系统响应整体变慢+相位裕度被吃\n快速补偿：ki_new = ki_old/2, kd_new = kd_old×2（保连续域等效）\n正确做法：重新做三件套测试——补偿只是救急，数字域特性变了必须实测\n预防：控制频率做成配置常量，参数文件里记录标定时的频率——换频率必须重调。`) };

  DB["cva-b32"] = { level: 3, title: "电机参数辨识在线化", body: "怎么在比赛运行中在线辨识电机 Rs/Ls（不需要拆下来）？", hint: "电压注入+频响。", solution: C("text", "ans.txt", `①Rs：电机静止时注入直流电压 U，测稳态电流 I → Rs = U/I（1 秒搞定，注意温漂——运行中定期复测）\n②Ls：注入正弦电压扫频（100Hz~10kHz），测电流相位滞后 → 阻抗角反解 L（U/I 复数比在两频点解方程）\n③在线化：FOC 板利用停转间隙（裁判读秒/局间）自动跑标定序列\n用途：电流环 PI 参数 = f(Rs, Ls) 公式自动算（带宽法）——换电机自动适配，不用手调\n这是商品电调「自动调参」功能的原理。`) };

  DB["cva-b33"] = { level: 3, featured: true, title: "手写：电流环自整定", body: "实现电流环 PI 自整定：注入阶跃电压测 Rs/Ls → 按带宽公式算 kp/ki → 写入并验证阶跃响应。", hint: "kp=L·ωc, ki=R·ωc。", solution: C("python", "autotune.py", `import numpy as np

class CurrentLoopAutoTuner:
    """FOC 电流环自整定(dq 轴任一相)"""
    def __init__(s):
        s.Rs = s.Ls = None
    # --- 步骤1: 静态测 Rs ---
    def measure_Rs(s, u_inject=2.0, t_settle=0.5, dt=0.0001):
        # 仿真: L*R 一阶系统
        L, R_true = 0.5e-3, 0.15     # 真实参数(未知)
        i = 0.0
        for _ in range(int(t_settle/dt)):
            di = (u_inject - R_true*i)/L
            i += di*dt
        s.Rs = u_inject/i             # 稳态 U/I = R
        print(f"Rs 测得: {s.Rs:.4f} (真值 {R_true})")
    # --- 步骤2: 测 Ls(电流上升时间法) ---
    def measure_Ls(s, u_inject=2.0, dt=0.0001):
        # 阶跃后 63.2% 稳态时刻 = 时间常数 τ = L/R
        L, R = 0.5e-3, s.Rs
        i, i_ss = 0.0, u_inject/R
        t63 = None
        for n in range(100000):
            i += (u_inject - R*i)/L*dt
            if i >= 0.632*i_ss and t63 is None:
                t63 = n*dt
        s.Ls = t63 * s.Rs
        print(f"Ls 测得: {s.Ls*1e3:.3f}mH (τ={t63*1e3:.3f}ms)")
    # --- 步骤3: 带宽法算 PI ---
    def compute_pi(s, bandwidth_hz=2000):
        wc = 2*np.pi*bandwidth_hz     # 期望电流环带宽
        kp = s.Ls * wc                # A: kp = L·ωc
        ki = s.Rs * wc                # B: ki = R·ωc
        print(f"自整定: kp={kp:.3f} ki={ki:.1f} (带宽 {bandwidth_hz}Hz)")
        return kp, ki

tuner = CurrentLoopAutoTuner()
tuner.measure_Rs()
tuner.measure_Ls()
tuner.compute_pi(2000)
# 验证: 阶跃电流响应应在 ~1/(2π·2000)=80μs 到达 63%`) };

  DB["cva-b34"] = { level: 3, title: "失控根因：积分爆炸", body: "真实事故：视觉丢失目标后云台缓慢自转，越转越快。推演根因链。", hint: "误差保持最大→积分累积。", solution: C("text", "ans.txt", `根因链：\n①视觉丢目标 → 目标值被冻结在丢失前位置\n②云台实际已转过去 → 误差=目标-实际 越来越大\n③积分项对大误差持续累积 → 输出饱和\n④电机全力转 → 实际位置更远 → 误差更大 → 正反馈爆炸\n修复三件套：\n①目标丢失 >200ms → 目标值渐变回归当前实际位置（误差归零）\n②积分钳位 + 反计算 anti-windup（早就该有的兜底）\n③丢失状态显式上报（电控进入 HOLD 而不是继续 TRACK）\n教训：每个「保持」状态都要问自己——误差还在吗？积分还在攒吗？`) };

  DB["cva-b35"] = { level: 3, title: "云台零点漂移检测", body: "云台静止时编码器读数每天漂 0.1°。可能原因和排查顺序？", hint: "机械/电气/热。", solution: C("text", "ans.txt", `排查顺序（成本从低到高）：\n①编码器联轴器打滑（最常见）：做个标记笔划线——一天后错位 = 打滑，紧固\n②磁编磁体退磁/偏移：换编码器对比测试\n③结构应力：枪管重量让支架微弯——卸载对比（拆枪管读数变 = 结构问题）\n④温度：热胀冷缩的安装面——控温前后读数对比\n监控方案：每晚自动「零点回归测试」记录漂移量——趋势突变早于比赛发现问题\n0.1°/天对命中率影响 6m 处约 1cm——可接受；>0.5°/天必须修。`) };

  DB["cva-b36"] = { level: 3, featured: true, title: "手写：云台健康监测看板", body: "写云台状态监测：每分钟采样记录零点/静态电流/阶跃响应时间/温度，画 24h 趋势并异常告警。", hint: "定时自检线程+阈值。", solution: C("python", "health.py", `import time, collections, numpy as np

class GimbalHealthMonitor:
    """云台健康看板: 每分钟体检, 24h 趋势"""
    def __init__(s):
        s.hist = collections.defaultdict(
            lambda: collections.deque(maxlen=1440))   # 24h@1/min
        s.baseline = None
    def selftest(s, gimbal):
        """单次体检(需要云台短暂静止~2s)"""
        r = {}
        r["zero"] = gimbal.encoder_read()              # 零点
        r["idle_current"] = gimbal.motor_current()     # 静态电流
        gimbal.step_test(1.0)                          # 1°阶跃
        r["step_ms"] = gimbal.settle_time_ms()         # 响应时间
        r["temp"] = gimbal.temperature()
        for k, v in r.items(): s.hist[k].append(v)
        return r
    def check_anomaly(s):
        alerts = []
        for key, deq in s.hist.items():
            if len(deq) < 60: continue                 # 1h 后才开始判
            arr = np.array(deq)
            recent, ref = arr[-30:], arr[:-30]
            # 近30分钟 vs 基线
            if key == "zero" and abs(recent.mean()-ref.mean()) > 0.3:
                alerts.append(f"零点漂移 {recent.mean()-ref.mean():.2f}°")
            if key == "idle_current" and recent.mean() > ref.mean()*1.5:
                alerts.append("静态电流涨50% → 轴承/摩擦异常")
            if key == "step_ms" and recent.mean() > ref.mean()*1.3:
                alerts.append("响应变慢30% → 参数漂移或负载变大")
            if key == "temp" and recent.mean() > 70:
                alerts.append(f"温度 {recent.mean():.0f}°C 过高")
        return alerts

# 每分钟: monitor.selftest(gimbal)
# 每小时: print(monitor.check_anomaly())`) };

  DB["cva-b37"] = { level: 3, title: "控制方案的文档化", body: "控制组最缺文档。写「参数决策文档」模板：每个参数的来龙去脉可追溯。", hint: "参数档案=决策日志。", solution: C("text", "param_doc.md", `# 参数决策文档模板

## kp=200 (速度环)
- 标定日期: 2026-10-02
- 标定方法: 阶跃法(Ziegler-Nichols 后手动微调)
- 当时状态: 38mm枪管/满弹匣/电池25.1V
- 三件套成绩: 上升85ms/超调3%/扰动恢复180ms
- 为什么不是180: 180时扰动恢复240ms(慢15%)
- 为什么不是220: 220超调8%(超过5%验收线)
- 依赖条件: 枪管更换必须重标(J变化)
- 历史: v1=180(9月), v2=200(10月,换枪管后)

## ki=60 ...
(同格式)

---
价值: 新人问"为什么是200"时
      指文档;参数漂移排查时有基准;
      换配置时知道哪些联动重标`) };

  DB["cva-b38"] = { level: 3, title: "赛季结束的参数交接", body: "赛季结束，参数和经验怎么交接给下届？", hint: "三份文档+一段视频。", solution: C("text", "ans.txt", `①参数档案（上题模板）：全部参数+决策记录+适用条件\n②三件套基准数据：当前参数的阶跃/正弦/扰动测试曲线——下届改参数后的回归基准\n③已知问题清单：没修的 bug、参数的怪脾气（「kd 超过 5 会和 35Hz 谐振打架」这种血泪）\n④一段 10 分钟视频：云台实际表现（好的和坏的都录）——文字说不清的动态特性视频最直观\n交接会：当面演示+新负责人复现三件套+签收。没跑过的接收 = 没交接。`) };

  DB["cva-b39"] = { level: 3, featured: true, title: "综合：赛季电控复盘", body: "赛季结束写电控复盘：命中率从 65%→78% 的贡献拆解。给出归因分析框架。", hint: "分层归因+数据验证。", solution: C("text", "retro.txt", `命中率 +13% 拆解(每项用实验数据背书):

①视觉检测升级(传统→YOLO): +5%
  证据: 同场景对比测试 200 帧
  传统法召回 82% / YOLO 91%

②前馈上线: +3%
  证据: 正弦跟踪相位滞后 8°→2°
  2m/s 目标弹着点散布 11cm→7cm

③弹速标定+连发补偿: +2%
  证据: 连发20发散布 9cm→5.5cm

④时间同步修正(-3ms偏差): +2%
  证据: 快速靶横向固定偏差消除

⑤剩下 ~1%: 机械保养/运气

方法论: 每项改动单独 A/B 测试留数据——
复盘时"感觉是视觉变好了"是废话,
"视觉升级贡献5个百分点,200帧对比"才是结论
(这就是为什么改一项测一项)`) };

  DB["cva-b40"] = { level: 3, featured: true, title: "终极毕业考：电控系统思维", body: "用一段话向完全外行（赞助商/家长）解释：为什么 RM 机器人的云台能又快又准地打中目标。", hint: "通俗但不失真。", solution: C("text", "explain.txt", `"就像一个神枪手配备了三样装备:
眼睛(相机+AI): 50毫秒内看清'敌人在哪、多远、跑多快'
小脑(陀螺仪): 每秒一千次感知自己枪口的朝向,
    身体再颠簸枪口依然稳如泰山
手感(控制算法): 预判敌人的下一步位置,
    提前把枪转到'敌人将要到达的地方'

三者的配合误差加起来不到一根手指的宽度——
这就是为什么它能在一秒内连续命中多个移动目标。

(然后可以补充: 这套'感知-预判-控制'的架构,
 和导弹制导、无人机、自动驾驶是同一套思想,
 学生在赛场上学的是整个机器人行业的底层功夫)"`) };
})(window);
