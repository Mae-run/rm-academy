/* RM 兵工厂 · 手写练习题库（ROS 2 / RM 电控 / RM 视觉 扩容卷）
 * 覆盖：节点通信 / TF / launch / 参数 / action / FreeRTOS / CAN / PID / 视觉管线
 */
(function () {
  "use strict";
  var global = window;
  if (!global.PRACTICE_DB) global.PRACTICE_DB = {};

  function C(lang, title, code) {
    return "<div class='code-block' data-lang='" + lang + "'><div class='code-header'>" + title + "<button class='copy-btn' onclick='copyCode(this)'>复制</button></div><pre><code>" + escapeHtml(code) + "</code></pre></div>";
  }
  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function merge(db) {
    for (var k in db) {
      if (Object.prototype.hasOwnProperty.call(db, k)) {
        global.PRACTICE_DB[k] = db[k];
      }
    }
  }

  merge({

    /* ==================== ROS 2 · 节点与通信 ==================== */

    "ros-p13": {
      level: 1, title: "rclcpp 节点结构剖析",
      body: "手写一个空 ROS 2 节点类，包含构造函数、析构函数、main 函数和 spin。解释每一部分的作用。",
      hint: "继承 rclcpp::Node，构造函数里传节点名。",
      solution: C("cpp", "node_anatomy.cpp", [
        "#include <rclcpp/rclcpp.hpp>",
        "",
        "class MyNode : public rclcpp::Node {",
        "public:",
        "    MyNode() : Node(\"my_node\") {",
        "        RCLCPP_INFO(this->get_logger(), \"节点启动\");",
        "    }",
        "};",
        "",
        "int main(int argc, char *argv[]) {",
        "    rclcpp::init(argc, argv);              // 初始化 rclcpp",
        "    auto node = std::make_shared<MyNode>(); // 创建节点",
        "    rclcpp::spin(node);                     // 进入事件循环",
        "    rclcpp::shutdown();                     // 清理",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    "ros-p14": {
      level: 1, title: "订阅者：接收 String 消息",
      body: "手写订阅者节点：订阅 /chatter 话题，回调函数打印消息内容。",
      hint: "create_subscription<std_msgs::msg::String>(\"chatter\", 10, callback);",
      solution: C("cpp", "subscriber.cpp", [
        "#include <rclcpp/rclcpp.hpp>",
        "#include <std_msgs/msg/string.hpp>",
        "",
        "class Listener : public rclcpp::Node {",
        "public:",
        "    Listener() : Node(\"listener\") {",
        "        sub_ = create_subscription<std_msgs::msg::String>(",
        "            \"chatter\", 10,",
        "            [this](const std_msgs::msg::String::SharedPtr msg) {",
        "                RCLCPP_INFO(get_logger(), \"收到: %s\", msg->data.c_str());",
        "            });",
        "    }",
        "private:",
        "    rclcpp::Subscription<std_msgs::msg::String>::SharedPtr sub_;",
        "};"
      ].join("\n"))
    },

    "ros-p15": {
      level: 1, tou: null, title: "自定义消息类型",
      body: "手写自定义消息 Armor.msg：中心点坐标（float64 x y）、宽、高、置信度。写出完整文件并说明如何在 CMakeLists 和 package.xml 中配置。",
      hint: "msg/ 目录下新建 Armor.msg，CMakeLists 加 rosidl_generate_interfaces，package.xml 加依赖。",
      solution: C("text", "Armor.msg", [
        "# msg/Armor.msg",
        "float64 cx",
        "float64 cy",
        "float64 w",
        "float64 h",
        "float64 conf",
        "",
        "# CMakeLists.txt 需要添加：",
        "# rosidl_generate_interfaces(${PROJECT_NAME}",
        "#   \"msg/Armor.msg\")",
        "",
        "# package.xml 需要添加：",
        "# <buildtool_depend>rosidl_default_generators</buildtool_depend>",
        "# <exec_depend>rosidl_default_runtime</exec_depend>"
      ].join("\n"))
    },

    "ros-p16": {
      level: 2, title: "服务端与客户端（AddTwoInts）",
      body: "手写服务端和客户端：服务端接收两个整数求和返回，客户端发请求并等待结果。",
      hint: "create_service / create_client + spin_until_future_complete 等待结果。",
      solution: C("cpp", "service_demo.cpp", [
        "/* 服务端 */",
        "class Adder : public rclcpp::Node {",
        "public:",
        "    Adder() : Node(\"adder\") {",
        "        svc_ = create_service<example_interfaces::srv::AddTwoInts>(",
        "            \"add_two_ints\",",
        "            [](const std::shared_ptr<AddTwoInts::Request> req,",
        "               std::shared_ptr<AddTwoInts::Response> res) {",
        "                res->sum = req->a + req->b;",
        "            });",
        "    }",
        "private:",
        "    rclcpp::Service<AddTwoInts::Request>::SharedPtr svc_;",
        "};"
      ].join("\n"))
    },

    "ros-p17": {
      level: 2, title: "参数声明与读取",
      body: "手写节点声明并读取参数：target_speed (double)、enemy_color (string)。处理参数不存在的默认值。",
      hint: "declare_parameter + get_parameter + get_value<T>()。",
      solution: C("cpp", "params.cpp", [
        "class ParamsNode : public rclcpp::Node {",
        "public:",
        "    ParamsNode() : Node(\"params_node\") {",
        "        declare_parameter<double>(\"target_speed\", 3.0);",
        "        declare_parameter<std::string>(\"enemy_color\", \"red\");",
        "",
        "        speed_ = get_parameter(\"target_speed\").get_value<double>();",
        "        color_ = get_parameter(\"enemy_color\").get_parameter<std::string>();",
        "    }",
        "private:",
        "    double speed_;",
        "    std::string color_;",
        "};",
        "// 启动时：ros2 run pkg node --ros-args -p target_speed:=5.0"
      ].join("\n"))
    },

    "ros-p17x": {
      level: 2, title: "参数声明与读取（修正版）",
      body: "上面的 get_parameter(\"enemy_color\").get_parameter 链式调用有误。手写正确版本。",
      hint: "get_parameter(\"x\").get_value<T>()。",
      solution: C("cpp", "params_fixed.cpp", [
        "speed_ = get_parameter(\"target_speed\").get_value<double>();",
        "color_ = get_parameter(\"enemy_color\").get_value<std::string>();",
        "// 正确链式：get_parameter(key) 返回参数对象，.get_value<T>() 取值"
      ].join("\n"))
    },

    "ros-p18": {
      level: 2, title: "launch 文件：多节点启动",
      body: "手写 Python launch 文件：同时启动 talker 和 listener 两个节点。",
      hint: "from launch import LaunchDescription; Node(package=..., executable=...)",
      solution: C("python", "demo.launch.py", [
        "from launch import LaunchDescription",
        "from launch_ros.actions import Node",
        "",
        "def generate_launch_description():",
        "    return LaunchDescription([",
        "        Node(",
        "            package=\"demo_nodes_cpp\",",
        "            executable=\"talker\",",
        "            name=\"talker\"",
        "        ),",
        "        Node(",
        "            package=\"demo_nodes_cpp\",",
        "            executable=\"listener\",",
        "        ),",
        "    ])"
      ].join("\n"))
    },

    "ros-p19": {
      level: 2, title: "launch 文件：参数传递",
      body: "手写 launch 文件给节点传参数（target_speed=5.0, enemy_color=blue），并用 Argument 支持外部覆盖。",
      hint: "DeclareLaunchArgument + ParameterValue + parameters=[...]",
      solution: C("python", "params.launch.py", [
        "from launch import LaunchDescription",
        "from launch.actions import DeclareLaunchArgument",
        "from launch_ros.actions import Node",
        "",
        "def generate_launch_description():",
        "    speed_arg = DeclareLaunchArgument(",
        "        \"speed\", default_value=\"3.0\")",
        "    node = Node(",
        "        package=\"rm_vision\",",
        "        executable=\"armor_detector\",",
        "        parameters=[{\"target_speed\": LaunchConfiguration(\"speed\")}]",
        "    )",
        "    return LaunchDescription([speed_arg, node])"
      ].join("\n"))
    },

    "ros-p20": {
      level: 2, title: "TF2：广播静态坐标变换",
      body: "手写静态 TF 广播器：发布 camera_link → chassis_link 的固定变换（x=0.1, y=0, z=0.2）。",
      hint: "tf2_ros::StaticTransformBroadcaster + geometry_msgs::TransformStamped。",
      solution: C("cpp", "static_tf.cpp", [
        "#include <tf2_ros/static_transform_broadcaster.h>",
        "#include <geometry_msgs/msg/transform_stamped.hpp>",
        "",
        "class StaticTF : public rclcpp::Node {",
        "public:",
        "    StaticTF() : Node(\"static_tf\") {",
        "        tf_pub_ = std::make_shared<tf2_ros::StaticTransformBroadcaster>(this);",
        "        geometry_msgs::msg::TransformStamped t;",
        "        t.header.frame_id = \"chassis_link\";",
        "        t.child_frame_id = \"camera_link\";",
        "        t.transform.translation.x = 0.1;",
        "        t.transform.translation.z = 0.2;",
        "        tf_pub_->sendTransform(t);",
        "    }",
        "private:",
        "    std::shared_ptr<tf2_ros::StaticTransformBroadcaster> tf_pub_;",
        "};"
      ].join("\n"))
    },

    "ros-p21": {
      level: 2, title: "TF2：监听变换并查变换",
      body: "手写 TF 监听器：每秒查询 camera_link 相对于 odom 的变换，打印平移分量。",
      hint: "tf2_ros::Buffer + TransformListener + lookupTransform。",
      solution: C("cpp", "tf_listener.cpp", [
        "#include <tf2_ros/transform_listener.h>",
        "#include <tf2_ros/buffer.h>",
        "",
        "class TFListenerNode : public rclcpp::Node {",
        "public:",
        "    TFListenerNode() : Node(\"tf_listener\") {",
        "        tf_buffer_ = std::make_shared<tf2_ros::Buffer>(get_clock());",
        "        tf_listener_ = std::make_shared<tf2_ros::TransformListener>(*tf_buffer_);",
        "        timer_ = create_wall_timer(1s, [this] { lookup(); });",
        "    }",
        "private:",
        "    void lookup() {",
        "        try {",
        "            auto t = tf_buffer_->lookupTransform(",
        "                \"odom\", \"camera_link\", tf2::TimePointZero);",
        "            RCLCPP_INFO(get_logger(), \"x=%.2f y=%.2f\",",
        "                t.transform.translation.x, t.transform.translation.y);",
        "        } catch (const tf2::TransformException &e) {",
        "            RCLCPP_WARN(get_logger(), \"TF 查找失败: %s\", e.what());",
        "        }",
        "    }",
        "    std::shared_ptr<tf2_ros::Buffer> tf_buffer_;",
        "    std::shared_ptr<tf2_ros::TransformListener> tf_listener_;",
        "    rclcpp::TimerBase::SharedPtr timer_;",
        "};"
      ].join("\n"))
    },

    "ros-p21x": {
      level: 2, title: "TF 监听器（净化版）",
      body: "上面的题目描述被污染了。手写干净的版本：TF 监听器每秒查询 camera_link 相对于 odom 的变换。",
      hint: "Buffer + TransformListener + 定时 lookupTransform。",
      solution: C("cpp", "tf_listener_clean.cpp", [
        "// 与上题相同的结构，略去被污染的描述",
        "// 核心：tf_buffer_->lookupTransform(target, source, tf2::TimePointZero);"
      ].join("\n"))
    },

    "ros-p22": {
      level: 3, title: "生命周期节点",
      body: "手写一个 LifecycleNode：实现 on_configure、on_activate、on_deactivate、on_cleanup、on_shutdown 五个回调。",
      hint: "继承 rclcpp_lifecycle::LifecycleNode，回调返回 SUCCESS 或 ERROR。",
      solution: C("cpp", "lifecycle.cpp", [
        "#include <rclcpp_lifecycle/lifecycle_node.hpp>",
        "",
        "class VisionLifecycleNode : public rclcpp_lifecycle::LifecycleNode {",
        "public:",
        "    using CallbackReturn = rclcpp_lifecycle::node_interfaces::LifecycleNodeInterface::CallbackReturn;",
        "",
        "    VisionLifecycleNode() : LifecycleNode(\"vision_lifecycle\") {}",
        "",
        "    CallbackReturn on_configure(const rclcpp_lifecycle::State &) override {",
        "        // 初始化资源（加载模型等）",
        "        return CallbackReturn::SUCCESS;",
        "    }",
        "    CallbackReturn on_activate(const rclcpp_lifecycle::State &) override {",
        "        // 激活：开始发布/订阅",
        "        return CallbackReturn::SUCCESS;",
        "    }",
        "    CallbackReturn on_deactivate(const rclcpp_lifecycle::State &) override {",
        "        return CallbackReturn::SUCCESS;",
        "    }",
        "    CallbackReturn on_cleanup(const rclcpp_lifecycle::State &) override {",
        "        return CallbackReturn::ERROR;",
        "    }",
        "    CallbackReturn on_shutdown(const rclcpp_lifecycle::State &) override {",
        "        return CallbackReturn::SUCCESS;",
        "    }",
        "};"
      ].join("\n"))
    },

    "ros-p23": {
      level: 3, title: "组件化节点（composition）",
      body: "手写一个可组合的 ROS 2 组件节点，并在 launch 中手动加载三个实例。",
      hint: "RCLCPP_COMPONENTS_REGISTER_NODE 宏 + ComposableNode。",
      solution: C("cpp", "component.cpp", [
        "#include <rclcpp/rclcpp.hpp>",
        "#include <rclcpp_components/node_factory_template.hpp>",
        "",
        "class ArmorDetectorComponent : public rclcpp::Node {",
        "public:",
        "    ArmorDetectorComponent(const rclcpp::NodeOptions &options)",
        "        : Node(\"armor_detector\", options) { /* ... */ }",
        "};",
        "",
        "RCLCPP_COMPONENTS_REGISTER_NODE(ArmorDetectorComponent)",
        "",
        "// launch 中：",
        "// ComposableNode(",
        "//     package=\"rm_vision\",",
        "//     plugin=\"rm_vision::ArmorDetectorComponent\")"
      ].join("\n"))
    },

    "ros-p24": {
      level: 3, featured: true, title: "自定义 Action（飞行检查）",
      body: "手写 Action 定义 ExecuteVision.action：goal 请求切换模式，feedback 报告进度，result 报告成功/失败。",
      hint: "action/ 目录：goal、result、feedback 三段式。",
      solution: C("text", "ExecuteVision.action", [
        "# goal：客户端 → 服务端",
        "string mode",
        "---",
        "# result：服务端 → 客户端",
        "bool success",
        "string message",
        "---",
        "# feedback：服务端 → 客户端（周期性）",
        "float32 progress"
      ].join("\n"))
    },

    "ros-p25": {
      level: 3, title: "QoS 配置：视觉数据流",
      body: "为视觉系统设计 QoS 策略：相机原始图话题（高频大流量）和目标位姿话题（低频小流量）分别用什么 QoS？为什么？",
      hint: "原始图用 BestEffort + SMALLER 历史深度；位姿用 Reliable + 深度 10。",
      solution: C("cpp", "qos.cpp", [
        "// 相机原始图（高频、可丢帧）：",
        "auto img_qos = rclcpp::QoS(rclcpp::KeepLast(1))",
        "    .best_effort();          // 丢一帧无所谓，要低延迟",
        "",
        "// 目标位姿（低频、不能丢）：",
        "auto pose_qos = rclcpp::QoS(rclcpp::KeepLast(10))",
        "    .reliable();             // 每一条都要送达",
        "",
        "// 注意：订阅者和发布者 QoS 必须兼容，否则不连接！"
      ].join("\n"))
    },

    "ros-p26": {
      level: 3, title: "rosbag 录制与回放",
      body: "手写 shell 命令：录制 /camera/image_raw 和 /targets 两个话题，然后回放并加速 2 倍播放。",
      hint: "ros2 bag record + ros2 bag play --rate 2.0",
      solution: C("bash", "bag.sh", [
        "# 录制：",
        "ros2 bag record /camera/image_raw /targets -o rm_session.bag",
        "",
        "# 回放（加速 2 声）：",
        "ros2 bag play rm_session.bag --rate 2.0",
        "",
        "# 只回放部分话题：",
        "ros2 bag play rm_session.bag --topics /targets"
      ].join("\n"))
    },

    /* ==================== RM 电控 ==================== */

    "rme-p13": {
      level: 1, title: "FreeRTOS 任务创建与管理",
      body: "手写 FreeRTOS 代码：创建一个 LED 闪烁任务（500ms 周期），栈 256 字、优先级 2。",
      hint: "xTaskCreate(func, \"name\", 256, NULL, 2, &handle);",
      solution: C("c", "freertos_task.c", [
        "#include \"FreeRTOS.h\"",
        "#include \"task.h\"",
        "",
        "void led_task(void *arg) {",
        "    while (1) {",
        "        HAL_GPIO_TogglePin(LED_GPIO_Port, LED_Pin);",
        "        vTaskDelay(pdMS_TO_TICKS(500));",
        "    }",
        "}",
        "",
        "TaskHandle_t led_handle;",
        "xTaskCreate(led_task, \"led\", 256, NULL, 2, &led_handle);"
      ].join("\n"))
    },

    "rme-p14": {
      level: 1, title: "FreeRTOS 队列通信",
      body: "手写两个任务用队列通信：传感器任务每 100ms 读取数据入队，控制任务阻塞等队列取数据。",
      hint: "xQueueSend / xQueueReceive(portMAX_DELAY)。",
      solution: C("c", "freertos_queue.c", [
        "QueueHandle_t sensor_q;",
        "sensor_q = xQueueCreate(10, sizeof(float));",
        "",
        "void sensor_task(void *arg) {",
        "    float val;",
        "    while (1) {",
        "        val = read_sensor();",
        "        xQueueSend(sensor_q, &val, 0);",
        "        vTaskDelay(pdMS_TO_TICKS(100));",
        "    }",
        "}",
        "void control_task(void *arg) {",
        "    float val;",
        "    while (1) {",
        "        if (xQueueReceive(sensor_q, &val, portMAX_DELAY) == pdTRUE) {",
        "            update_control(val);",
        "    }",
        "    }",
        "}"
      ].join("\n"))
    },

    "rme-p14x": {
      level: 1, title: "FreeRTOS 队列通信（修正版）",
      body: "上面的代码缩进和括号有误。手写正确版本。",
      hint: "注意 if 块的括号匹配。",
      solution: C("c", "freertos_queue_fixed.c", [
        "void control_task(void *arg) {",
        "    float val;",
        "    while (1) {",
        "        if (xQueueReceive(sensor_q, &val, portMAX_DELAY) == pdTRUE) {",
        "            update_control(val);",
        "        }",
        "    }",
        "}"
      ].join("\n"))
    },

    "rme-p15": {
      level: 2, title: "FreeRTOS 信号量：互斥访问 I2C",
      body: "手写两个任务共享 I2C 总线，用互斥信号量保护。",
      hint: "xSemaphoreCreateMutex + xSemaphoreTake/Take。",
      solution: C("c", "i2c_mutex.c", [
        "SemaphoreHandle_t i2c_mutex = xSemaphoreCreateMutex();",
        "",
        "void task_a(void *arg) {",
        "    while (1) {",
        "        if (xSemaphoreTake(i2c_mutex, portMAX_DELAY) == pdTRUE) {",
        "            i2c_read_sensor_a();",
        "            xSemaphoreGive(i2c_mutex);",
        "        }",
        "        vTaskDelay(pdMS_TO_TICKS(100));",
        "    }",
        "}",
        "void task_b(void *arg) {",
        "    while (1) {",
        "        if (xSemaphoreTake(i2c_mutex, pdMS_TO_TICKS(50)) == pdTRUE) {",
        "            i2c_read_sensor_b();",
        "            xSemaphoreGive(i2c_mutex);",
        "        }",
        "        vTaskDelay(pdMS_TO_TICKS(200));",
        "    }",
        "}"
      ].join("\n"))
    },

    "rme-p16": {
      level: 2, title: "大疆电机控制（CAN 发送）",
      body: "手写大疆 M3508 电机控制代码：将 4 个电机的目标电流封包成 CAN 帧（标准帧 0x200）。",
      hint: "buf[0]=current>>8, buf[1]=current&0xFF，四个电机共 8 字节。",
      solution: C("c", "dji_motor_can.c", [
        "typedef struct {",
        "    int16_t target_current[4];",
        "} MotorGroup;",
        "",
        "void send_motor_current(const MotorGroup *m) {",
        "    uint8_t buf[8];",
        "    for (int i = 0; i < 4; i++) {",
        "        buf[2*i]   = (uint8_t)(m->target_current[i] >> 8);",
        "buf[2*i+1] = (uint8_t)(m->target_current[i] & 0xFF);",
        "    }",
        "    CAN_Transmit(0x200, buf, 8);   // 标准帧 0x200，4 个电机",
        "}"
      ].join("\n"))
    },

    "rme-p16x": {
      level: 2, title: "大疆电机 CAN 封包（修正版）",
      body: "上面的代码有一行缩进错乱。手写正确版本。",
      hint: "buf[2*i+1] 缩进对齐。",
      solution: C("c", "dji_motor_can_fixed.c", [
        "void send_motor_current(const MotorGroup *m) {",
        "    uint8_t buf[8];",
        "    for (int i = 0; i < 4; i++) {",
        "        buf[2*i]     = (uint8_t)(m->target_current[i] >> 8);",
        "        buf[2*i+1]   = (uint8_t)(m->target_current[i] & 0xFF);",
        "    }",
        "    CAN_Transmit(0x200, buf, 8);",
        "}"
      ].join("\n"))
    },

    "rme-p17": {
      level: 2, title: "CAN 总线仲裁机制",
      body: "解释 CAN 总线的仲裁机制：为什么 ID 小的帧优先级高？写伪代码模拟两个节点同时发送的仲裁过程。",
      hint: "线与逻辑：显性位 0 会覆盖隐性位 1，发送隐性位但读到显性位就退出仲裁。",
      solution: C("text", "can_arbitration.md", [
        "CAN 仲裁（线与逻辑）：",
        "1. 多节点同时发送，总线是“线与”：任何一个节点发 0，总线就是 0。",
        "2. 每个节点边发送边回读。发送 1（隐性）但读到 0（显性）→ 仲裁失败，退出，改为接收。",
        "3. ID 二进制值越小（前导 0 越多）→ 优先级越高，赢得仲裁。",
        "",
        "伪代码：",
        "for each bit in id:",
        "    tx_bit = id.bit[i]",
        "    bus = line_and(all_nodes)",
        "    if tx_bit == 1 and bus == 0:",
        "        arbitration_lost = true",
        "        break"
      ].join("\n"))
    },

    "rme-p18": {
      "rme-p18x": null, level: 2, title: "软件定时器 vs 硬件定时器",
      body: "对比软件定时器与硬件定时器的精度和适用场景。什么场合必须用硬件定时器？",
      hint: "硬件定时器精度高（微秒级），软件定时器受调度延迟影响（毫秒级）。",
      solution: C("text", "timers.md", [
        "硬件定时器：",
        "  精度：微秒级，不受 CPU 负载影响",
        "  适用：PWM 生成、输入捕获、精确延时",
        "  缺点：数量有限，配置复杂",
        "",
        "软件定时器：",
        "  磨度：毫秒级，受任务调度和系统负载影响",
        "  适用：周期性状态检查、超时判断、界面刷新",
        "  优点：数量不限、配置简单",
        "  缺点：不保证硬实时",
        "",
        "必须用硬件定时器的场合：",
        "  PWM 输出频率/占空比、电机电流环（10kHz+）、超声波测距回波捕获"
      ].join("\n"))
    },

    "rme-p19": {
      level: 2, title: "看门狗：程序跑飞的最后一道防线",
      body: "手写独立看门狗代码：主循环喂狗，超时 1s。如果任务卡死，看门狗复位系统。解释看门狗的作用。",
      hint: "IWDG 配置超时 + 主循环 HAL_IWDG_Refresh()。",
      solution: C("c", "watchdog.c", [
        "/* 看门狗初始化（CubeMX 配置或手动） */",
        "void watchdog_init(void) {",
        "    hiwdg.Instance = IWDG;",
        "    hiwdg.Init.Prescaler = IWDG_PRESCALER_32;  // 32kHz/32 = 1kHz",
        "    hiwdg.Init.Reload = 1000;                   // 1000ms 超时",
        "    HAL_IWDG_Init(&hiwdg);",
        "}",
        "",
        "/* 主循环：",
        " * while (1) {",
        "     do_something();",
        "     HAL_IWDG_Refresh(&hiwdg);  // 喂狗",
        " } */"
      ].join("\n"))
    },

    "rme-p20": {
      level: 2, title: "DMA + 空闲中断接收不定长串口数据",
      body: "手写 STM32 串口 DMA + 空闲中断接收不定长数据的配置和中断处理。",
      hint: "HAL_UARTEx_ReceiveToIdle_DMA + 回调里 HAL_UARTEx_RxEventCallback。",
      solution: C("c", "uart_dma_idle.c", [
        "/* 开启接收（初始化时） */",
        "HAL_UARTEx_ReceiveToIdle_DMA(&huart1, rx_buf, RX_BUF_SIZE);",
        "",
        "/* 接收完成回调（空闲中断触发） */",
        "void HAL_UARTEx_RxEventCallback(UART_HandleTypeDef *huart, uint16_t size) {",
        "    if (huart == &huart1) {",
        "        // size 是实际接收的字节数",
        "        process_uart_data(rx_buf, size);",
        "        // 重新开启接收",
        "        HAL_UARTEx_ReceiveToIdle_DMA(&huart1, rx_buf, RX_BUF_SIZE);",
        "    }",
        "}"
      ].join("\n"))
    },

    "rme-p21": {
      level: 3, featured: true, title: "电机测速（M 法）",
      body: "M3508 配 35mm 轮，编码器 8192 线 4 倍频，编码器速比 3591/187。手写 M 法测速公式和代码。",
      hint: "speed = Δcount × (2π/r) / (CPR × ratio) / Δt，注意单位换算。",
      solution: C("c", "m_method.c", [
        "/* M 法测速（单位 rad/s）",
        " * Δcount: 采样周期内编码器计数变化量",
        " * 3591/187 ≈ 19.2 是减速比",
        " */",
        "#define ENC_CPR      8192",
        "#define GEAR_RATIO   3591.0 / 187.0",
        "#define SAMPLE_DT    0.001f     // 1kHz 采样",
        "",
        "float measure_speed(int32_t delta_count) {",
        "    return (delta_count * 2.0f * M_PI)",
        "         / (ENC_CPR * GEAR_RATIO * SAMPLE_DT);",
        "}"
      ].join("\n"))
    },

    "rme-p22": {
      level: 3, title: "前馈 + PID 复合控制",
      body: "手写前馈+PID 复合控制代码：前馈项直接用目标加速度，PID 负责修正残差。",
      hint: "output = feedforward(target_accel) + PID(target_speed - actual_speed)。",
      solution: C("c", "feedforward_pid.c", [
        "typedef struct {",
        "    PID pid;",
        "    float ff_gain;     // 前馈增益",
        "} FFPID;",
        "",
        "float ffpid_compute(FFPID *c, float target, float actual, float target_accel) {",
        "    float ff = c->ff_gain * target_accel;          // 前馈：预测需要的力",
        "    float fb = pid_compute(&c->pid, target, actual); // 反馈：修正误差",
        "    return ff + fb;",
        "}"
      ].join("\n"))
    },

    "rme-p23": {
      level: 4, featured: true, title: " RM 全向轮运动学正/逆解",
      body: "手写 45° 斜置麦轮全向运动的正解和逆解公式及代码。",
      hint: "逆解：w1=(vx-vy-wL)/√2 等；正解是逆解矩阵求逆。",
      solution: C("c", "mecanum.c", [
        "/* 麦克纳姆轮 45° 斜置(X Drive 变体)",
        " * vx: 前后速度  vy: 左右速度  w: 角速度  L: 轮距系数",
        " */",
        "void mecanum_inverse(float vx, float vy, float w, float L, float out[4]) {",
        "    float s = 0.70710678f;   // 1/√2",
        "    out[0] = ( vx*s + vy*s - w * L);   // 左前",
        "    out[1] = ( vx*s - vy*s + w * L);   // 右前",
        "    out[2] = ( vx*s - vy*s - w * L);   // 左后",
        "    out[3] = ( vx*s + vy*s + w * L);   // 右后",
        "}",
        "",
        "void mecanum_forward(const float w[4], float L, float *vx, float *vy, float *w_out) {",
        "    float s = 0.70710678f;",
        "    *vx = (w[0]+w[1]+w[2]+w[3]) * s / 4;",
        "    *vy = (w[0]-w[1]-w[2]+w[3]) * s / 4;",
        "    *w_out = (-w[0]+w[1]-w[2]+w[3]) * L / 4;",
        "}"
      ].join("\n"))
    },

    "rme-p24": {
      level: 3, title: "遥控器协议解析（DBUS）",
      body: "手写大疆 DBUS 遥控器协议解析：18 字节帧，提取摇杆 4 通道、开关 2 个、鼠标键盘数据。",
      hint: "sbus 帧按位拼接，通道值 11 位。注意小端序。",
      solution: C("c", "dbus_parser.c",        [
        "/* DBUS 帧 18 字节：",
        " * [0-1]  ch0 右水平  [2-3] ch1 右垂直",
        " * [4-5]  ch2 左水平  [6-7] ch3 左垂直",
        " * [8]    s1 开关    [9] s2 开关",
        " * [10-17] 鼠标键盘数据",
        " * 通道值范围 364~1684，中值 1024",
        " */",
        "typedef struct {",
        "    uint16_t ch[4];",
        "    uint8_t s1, s2;",
        "    int16_t mouse_x, mouse_y, mouse_z;",
        "    uint16_t key;",
        "} DBUSData;",
        "",
        "void dbus_parse(const uint8_t *buf, DBUSData *d) {",
        "    d->ch[0] = ((uint16_t)buf[0] | ((uint16_t)buf[1] << 8)) & 0x07FF;",
        "    d->ch[1] = (((uint16_t)buf[1] >> 3) | ((uint16_t)buf[2] << 5)) & 0x07FF;",
        "    d->ch[2] = (((uint16_t)buf[2] >> 6) | ((uint16_t)buf[3] << 2) | ((uint16_t)buf[4] << 10)) & 0x07FF;",
        "    d->ch[3] = (((uint16_t)buf[4] >> 1) | ((uint16_t)buf[5] << 7)) & 0x11FFF >> 1;",
        "    d->s1 = (buf[5] >> 4) & 0x07;",
        "    d->s2 = (buf[5] >> 7) & 0x07;",
        "}"
      ].join("\n"))
    },

    "rme-p24x": {
      level: 3, title: "DBUS 解析（修正版）",
      body: "上面的位移和掩码有笔误。手写标准的大疆 DBUS 通道解析。",
      hint: "严格按 SBUS 11-bit 通道位布局拼接。",
      solution: C("c", "dbus_fixed.c", [
        "void dbus_parse(const uint8_t *buf, DBUSData *d) {",
        "    d->ch[0] = ((uint16_t)buf[0]       | (uint16_t)buf[1] << 8) & 0x07FF;",
        "    d->ch[1] = ((uint16_t)buf[1] >> 3  | (uint16_t)buf[2] << 5) & 0x07FF;",
        "    d->ch[2] = ((uint16_t)buf[2] >> 6  | (uint16_t)buf[3] << 2 | (uint16_t)buf[4] << 10) & 0x07FF;",
        "    d->ch[3] = ((uint16_t)buf[4] >> 1  | (uint16_t)buf[5] << 7) & 0x07FF;",
        "    d->s1 = ((buf[5] >> 4) & 0x000C) >> 2 | (buf[16] & 0xC0) >> 6;",
        "    d->s2 = ((buf[5] >> 4) & 0x000C) >> 4 | (buf[16] & 0x30) >> 4;",
        "}"
      ].join("\n"))
    },

    "rme-p25": {
      level: 3, title: "裁判系统数据解析",
      body: "不影响",
      hint: "帧头检测 + cmd_id 分发 + CRC 校验",
      solution: C("c", "referee_parser.c", [
        "/* 帧格式：[0xA5][length][cmd_id][data...][CRC16]",
        " * 解析步骤：",
        " * 1. 找帧头 0xA5",
        " * 2. 读 length 和 cmd_id",
        " * 3. 收满 data 后校验 CRC16",
        " * 4. 按 cmd_id 分发处理",
        " */",
        "void referee_parse(const uint8_t *frame) {",
        "    if (frame[0] != 0xA5) return;",
        "    uint16_t length = frame[1] | (frame[2] << 8);",
        "    uint16_t cmd_id = frame[3] | (frame[4] << 8);",
        "    // CRC 校验（含帧头到 data 末尾）",
        "    if (!verify_crc16(frame, 7 + length)) return;",
        "    switch (cmd_id) {",
        "        case 0x0201: parse_robot_status(frame + 5); break;",
        "        case 0x0202: parse_power_data(frame + 5);  break;",
        "        case 0x0203: parse_shoot_data(frame + 5); break;",
        "    }",
        "}"
      ].join("\n"))
    },

    "rme-p26": {
      level: 3, title: "功率限制算法",
      body: "手写功率限制代码：底盘总功率上限 60W，四个电机按需求分配电流，超限时等比例缩放。",
      hint: "sum(P_i) ≤ P_max；超限则每个电流 × (P_max / sum(P_i))。",
      solution: C("c", "power_limit.c", [
        "float estimate_power(const float currents[4], const float speeds[4]) {",
        "    float p = 0;",
        "    for (int i = 0; i < 4; i++)",
        "        p += fabsf(currents[i] * speeds[i]) * TORQUE_CONST;   // P=τω",
        "    return p;",
        "}",
        "void apply_power_limit(float currents[4], const float speeds[4], float p_max) {",
        "    float p = estimate_power(currents, speeds);",
        "    if (p > p_max) {",
        "        float scale = p_max / p;    // 等比例缩放",
        "        for (int i = 0; i < 4; i++) currents[i] *= scale;",
        "    }",
        "}"
      ].join("\n"))
    },

    /* ==================== RM 视觉 ==================== */

    "rmv-p13": {
      level: 1, title: "OpenCV 基础：图像读取与颜色空间",
      body: "手写脚本：读图、转灰度、转 HSV、显示三幅图对比。",
      hint: "cv2.imread → cv2.cvtColor(BGR2GRAY / BGR2HSV)。",
      solution: C("python", "color_space.py", [
        "import cv2",
        "img = cv2.imread(\"test.jpg\")",
        "gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)",
        "hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)",
        "cv2.imshow(\"BGR\", img)",
        "cv2.imshow(\"Gray\", gray)",
        "cv2.imshow(\"HSV\", hsv)",
        "cv2.waitKey(0)"
      ].join("\n"))
    },

    "rmv-p14": {
      level: 1, title: "OpenCV 阈值分割与二值化",
      body: "手写脚本：对灰度图做固定阈值、Otsu 自适应阈值，对比效果。",
      hint: "cv2.threshold(gray, 127, 255, THRESH_BINARY) / cv2.threshold(..., THRESH_OTSU)",
      solution: C("python", "threshold.py", [
        "import cv2",
        "gray = cv2.imread(\"test.jpg\", cv2.IMREAD_GRAYSCALE)",
        "# 固定阈值",
        "_, binary1 = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)",
        "# Otsu 自动阈值",
        "_, binary2 = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)",
        "# 自适应阈值（局部）",
        "binary3 = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,",
        "                                cv2.THRESH_BINARY, 11, 2)"
      ].join("\n"))
    },

    "rmv-p15": {
      level: 1, title: "OpenCV 形态学操作",
      body: "手写脚本演示腐蚀、膨胀、开运算、闭运算。",
      hint: "cv2.morphologyEx(binary, MORPH_OPEN / MORPH_CLOSE, kernel)。",
      solution: C("python", "morphology.py", [
        "import cv2",
        "import numpy as np",
        "kernel = np.ones((5,5), np.uint8)",
        "eroded = cv2.erode(binary, kernel)          # 腐蚀：缩小白区",
        "dilated = cv2.dilate(binary, kernel)        # 膨胀：扩大白区",
        "opened = cv2.morphologyEx(binary, cv2.MORPH_OPEN, kernel)    # 开：先蚀后胀",
        "closed = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel)   # 闭：先胀后蚀"
      ].join("\n"))
    },

    "rmv-p16": {
      level: 2, title: "找轮廓并筛选目标",
      body: "手写脚本：找轮廓后按面积、宽高比筛出灯条，并画在图上。",
      hint: "cv2.findContours → contourArea → boundingRect 宽高比 2:1~10:1。",
      solution: C("python", "find_contours.py", [
        "import cv2",
        "contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)",
        "for cnt in contours:",
        "    area = cv2.contourArea(cnt)",
        "    if area < 20 or area > 10000: continue    # 面积初筛",
        "    x, y, w, h = cv2.boundingRect(cnt)",
        "    ratio = h / w",
        "    if 2.0 < ratio < 10.0:                   # 宽高比筛灯条",
        "        cv2.rectangle(img, (x, y), (x+w, y+h), (0, 255, 0), 2)"
      ].join("\n"))
    },

    "rmv-p17": {
      level: 2, featured: true, title: "灯条配对成装甲板",
      body: "手写灯条配对逻辑：两个灯条满足什么条件才算同一块装甲板？（高度差、角度差、中心距等约束）",
      hint: "高度差/均值 < 0.5、角度差 < 20°、水平距离在 0.8~3.2 倍灯条高度之间。",
      solution: C("python", "pair_lights.py", [
        "def is_pair(l1, l2):",
        "    # 1. 高度差相对均值要小",
        "    h_mean = (l1.h + l2.h) / 2",
        "    if abs(l1.h - l2.h) / h_mean > 0.5: return False",
        "    # 2. 角度差要小（两个灯条应近似平行）",
        "    if abs(l1.angle - l2.angle) > 20: return False",
        "    # .threshold; 3. 水平距离约束",
        "    dx = abs(l1.cx - l2.cx)",
        "    if not (0.8 * h_mean < dx < 3.2 * h_mean): return False",
        "    # 4. 垂直错位不能太大",
        "    dy = abs(l1.cy - l2.cy)",
        "    if dy > 0.5 * h_mean: return False",
        "    return True"
      ].join("\n"))
    },

    "rmv-p17x": {
      level: 2, title: "灯条配对（修正版）",
      body: "上面的代码有一行被污染。手写干净的灯条配对约束。",
      hint: "四条约束：高度比、平行度、水平距离、垂直错位。",
      solution: C("python", "pair_lights_fixed.py", [
        "def is_pair(l1, l2):",
        "    h_mean = (l1.h + l2.h) / 2",
        "    if abs(l1.h - l2.h) / h_mean > 0.5: return False",
        "    if abs(l1.angle - l2.angle) > 20: return False",
        "    dx = abs(l1.cx - l2.cx)",
        "    if not (0.8 * h_mean < dx < 3.2 * h_mean): return False",
        "    if abs(l1.cy - l2.cy) > 2 * h_mean: return False",
        "    return True"
      ].join("\n"))
    },

    "rmv-p18": {
      level: 2, tal: null, title: "PnP 解算基础",
      body: "手写 PnP 解算调用：4 个灯角点 → 装甲板中心在相机系的坐标。说明 solvePnP 各参数含义。",
      hint: "cv2.solvePnP(object_points, image_points, K, dist, flags=cv2.SOLVEPNP_IPPE)。",
      solution: C("python", "pnp_basic.py", [
        "import cv2",
        "import numpy as np",
        "",
        "# 物方坐标（装甲板 4 角点，单位 mm，以板中心为原点）",
        "object_points = np.array([",
        "    [-66.5,  27.5, 0], [ 66.5,  27.5, 0],",
        "    [ 66.5, -27.5, 0], [-66.5, -27.5, 0]], dtype=np.float64)",
        "",
        "# 图像坐标（4 角点像素坐标）",
        "image_points = np.array(corners, dtype=np.float64)",
        "",
        "success, rvec, tvec = cv2.solvePnP(",
        "    object_points, image_points, camera_matrix, dist_coeffs,",
        "    flags=cv2.SOLVEPNP_IPPE)",
        "",
        "# tvec: 装甲板中心在相机系的平移（mm）",
        "print(f\"目标距离: {np.linalg.norm(tvec)/10:.1f} cm\")"
      ].join("\n"))
    },

    "rmv-p19": {
      level: 2, title: "相机内参矩阵与畸变系数",
      body: "手写脚本打印相机内参矩阵，并解释 fx/fy/cx/cy 和畸变系数 k1~k5 的物理含义。",
      hint: "K = [[fx,0,cx],[0,fy,cy],[0,0,1]]；畸变系数 [k1,k2,p1,p2,k3]。",
      solution: C("python", "camera_matrix.py", [
        "# 相机内参矩阵 K：",
        "# K = [[fx, 0, cx],",
        "#      [0, fy, cy],",
        "#      [0,  0,  1]]",
        "# fx/fy: 焦距（像素单位）= 物理焦距 / 像元尺寸",
        "# cx/cy: 光轴与图像平面的交点（主点）",
        "",
        "# 畸变系数（OpenCV 顺序）：",
        "# k1,k2,k3: 径向畸变（桶形/枕形）",
        "# p1,p2:    切向畸变（透镜与成像面不平行）",
        "print(\"K =\", camera_matrix)",
        "print(\"D =\", dist_coeffs)   # [k1, k2, p1, p2, k3]"
      ].join("\n"))
    },

    "rmv-p19x": {
      level: 2, title: "内参与畸变（补充说明）",
      body: "手写脚本：用 getOptimalNewCameraMatrix 优化畸变矫正后的内参，并 undistort 一张图。",
      hint: "cv2.getOptimalNewCameraMatrix + cv2.undistort。",
      solution: C("python", "undistort.py", [
        "new_K, roi = cv2.getOptimalNewCameraMatrix(",
        "    camera_matrix, dist_coeffs, (w, h), 1, (w, h))",
        "undistorted = cv2.undistort(img, camera_matrix, dist_coeffs, None, new_K)"
      ].join("\n"))
    },

    "rmv-p20": {
      level: 3, title: "相机系→云台系变换",
      body: "手写旋转矩阵表示绕 X/Y/Z 轴的旋转，并实现相机系到云台系的完整变换（旋转+平移）。",
      hint: "Rx、Ry、Rz 基本旋转矩阵，任意姿态 = Rz·Ry·Rx。",
      solution: C("python", "camera_to_gimbal.py",[
        "import numpy as np",
        "",
        "def rot_x(t):",
        "    c, s = np.cos(t), np.sin(t)",
        "    return np.array([[1,0,0],[0,c,-s],[0,s,c]])",
        "def rot_y(t):",
        "    c, s = np.cos(t), np.sin(t)",
        "    return np.array([[c,0,s],[0,1,0],[-s,0,c]])",
        "def rot_z(t):",
        "    c, s = np.cos(t), np.sin(t)",
        "    return np.array([[c,-s,0],[s,c,0],[0,0,1]])",
        "",
        "# 相机系 → 云台系：p_gimbal = R @ p_cam + t",
        "R = rot_x(pitch) @ rot_y(yaw) @ rot_z(roll)   # 外参旋转",
        "p_gimbal = R @ p_cam + t                       # t 是相机安装偏移"
      ].join("\n"))
    },

    "rmv-p21": {
      level: 3, featured: true, title: "完整反小陀螺策略",
      body: "陀螺目标的角速度如何估计？如何选择打击点（预瞄时间 × 角速度）？手写完整策略伪代码。",
      hint: "连续多帧装甲板中心圆拟合得角速度 → 选预瞄点 = 中心 + 半径×方向(θ+ωτ)。",
      solution: C("python", "anti_spin.py", [
        "# 1. 圆拟合估计陀螺参数",
        "center, radius = fit_circle(armor_centers)  # 多帧中心拟合",
        "omega = estimate_angular_velocity(angles)   # 角速度 rad/s",
        "",
        "# 2. 预瞄：弹丸飞行时间 τ 内目标转过的角度",
        "tau = flight_time(distance)",
        "aim_theta = theta_now + omega * tau         # 预测击中时的角度",
        "",
        "# 3. 预瞄点 = 圆心 + 半径向量（转到预测角度）",
        "aim_point = center + radius * np.array([cos(aim_theta), sin(aim_theta)])",
        "return aim_point"
      ].join("\n"))
    },

    "rmv-p22": {
      level: 3, title: "卡尔曼滤波调参经验",
      body: "写一段卡尔曼滤波 Q/R 调参的经验法则。Q 大 R 小各是什么效果？",
      hint: "Q 大 → 信任测量，响应快但噪声大；R 大 → 信任预测，平滑但滞后。",
      solution: C("text", "kf_tuning.md", [
        "Q（过程噪声）：模型预测有多准",
        "  Q 大 → 滤波器认为模型不可靠，更信测量 → 响应快、噪声大",
        "  Q 小 → 认为模型可靠 → 平滑、滞后",
        "",
        "R（观测噪声）：测量有多准",
        "  R 大 → 认为测量不可靠，更信预测 → 平滑但跟踪慢",
        "  R 小 → 更信测量 → 跟踪快、噪声大",
        "",
        "实用调参法：",
        "  1. 先固定 R（按传感器手册或实验测噪声方差）",
        "  2. 调 Q：从小开始，逐渐增大直到跟踪滞后可接受",
        "  3. 目标突变场景（陀螺启停）：Q 适当加大",
        "  4. 静止目标：Q 尽量小，获得超平滑输出"
      ].join("\n"))
    },

    "rmv-p23": {
      level: 3, title: "目标丢失处理策略",
      body: "目标丢失时视觉系统应该怎么办？设计一个状态机：TRACKING → PREDICT（短时预测）→ LOST（停止射击）。",
      hint: "丢 3 帧内用速度外推；3~10 帧用匀速模型预测；超 10 帧报告丢失。",
      solution: C("text", "target_lost.md", [
        "状态机：",
        "  TRACKING: 正常跟踪，输出目标位置",
        "  PREDICT: 丢失 < 300ms，用速度线性外推",
        "  LOST:    丢失 > 300ms，停止发射击指令，云台回中",
        "",
        "伪代码：",
        "if detected:",
        "    lost_frames = 0",
        "    state = TRACKING",
        "    predict_point = current",
        "elif lost_frames < 9:          # 30fps 下 300ms",
        "    predict_point += velocity * dt",
        "    state = PREDICT",
        "else:",
        "    state = LOST",
        "    fire_disabled = true"
      ].join("\n"))
    },

    "rmv-p24": {
      level: 3, featured: true, title: "能量机关（大符）预瞄模型",
      body: "大符转速按正弦变化 spd = a·sin(ω t) + b。手写预测模型：给定当前角度和参数，预测 τ 秒后的角度。",
      hint: "积分：θ(t+τ) = θ(t) + ∫(a·sin(ω s) + b)ds，闭式解。",
      solution: C("python", "buff_predict.py", [
        "import numpy as np",
        "",
        "def predict_buff_angle(theta, a, omega, b, tau):",
        "    \"\"\"预测 tau 秒后大符角度（闭式解）",
        "    spd(t) = a*sin(omega*t) + b",
        "    \"\"\"",
        "    t = current_time()",
        "    # θ(t+τ) = θ(t) + ∫[t, t+τ] (a·sin(ωs)+b) ds",
        "    integral = (-a/omega) * (np.cos(omega*(t+tau)) - np.cos(omega*t)) + b*tau",
        "    return theta + integral"
      ].join("\n"))
    },

    "rmv-p24x": {
      level: 3, title: "大符预测（修正版）",
      body: "上面题目数据被污染。手写干净版大符正弦速度模型预测。",
      hint: "闭式积分。",
      solution: C("python", "buff_clean.py", [
        "def predict_buff_angle(theta, a, omega, b, t, tau):",
        "    integral = (-a/omega) * (np.cos(omega*(t+tau)) - np.cos(omega*t)) + b*tau",
        "    return theta + integral"
      ].join("\n"))
    },

    "rmv-p25": {
      level: 3, title: "双相机方案讨论",
      body: "讨论双相机方案的优缺点：视野重叠、帧同步、数据融合。什么时候值得上双相机？",
      hint: "单相机 90°+FOV 不足以同时覆盖远近视场时；但双相机带来同步和融合复杂度。",
      solution: C("explanation", "dual_camera.md", [
        "双相机方案分析：",
        "优点：",
        "  - 视野覆盖更广（尤其近身环视）",
        "  - 双目可测距（立体视觉）",
        "  - 冗余备份，一台失效仍可比赛",
        "缺点：",
        "  - 帧同步难（硬件触发或软同步，误差 <1ms 才能融合）",
        "  - 两套内参/外参标定，维护翻倍",
        "  - 带宽和算力翻倍",
        "  - 融合逻辑复杂（两帧中同一个目标怎么判同）",
        "结论：",
        "  - 常规 3v3/步兵：单相机够用",
        "  - 哨兵/哨兵机器人：双相机覆盖 360° 值得",
        "  - 远距离高精度：双目测距或加 ToF"
      ].join("\n"))
    }

  });
})();
