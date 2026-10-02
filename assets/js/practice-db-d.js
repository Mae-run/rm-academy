/* RM 兵工厂 · 手写练习题库（C++ 扩容卷）
 * 覆盖：基础语法 / 类与对象 / 继承多态 / 模板 / STL / 智能指针 / 异常 / Lambda
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

    /* ==================== C++ · 基础语法 ==================== */

    "cpp-p15": {
      level: 1, title: "引用 vs 指针：swap 函数的两种写法",
      body: "分别用指针和引用写 swap 函数，对比调用方式和代码可读性。",
      hint: "引用版：void swap(int &a, int &b)，调用时直接 swap(x, y)。指针版要传 &x, &y。",
      solution: C("cpp", "swap_ref_ptr.cpp", [
        "void swap_ptr(int *a, int *b) { int t = *a; *a = *b; *b = t; }",
        "void swap_ref(int &a, int &b) { int t = a; a = b; b = t; }",
        "// 调用：",
        "// swap_ptr(&x, &y);  // 指针版",
        "// swap_ref(x, y);    // 引用版（更简洁）"
      ].join("\n"))
    },

    "cpp-p16": {
      level: 1, title: "函数默认参数",
      body: "手写函数 <code class='inline'>void print(int val, int base = 10, bool newline = true)</code>，分别以不同进制输出整数。",
      hint: "默认参数从右往左给，中间不能跳。",
      solution: C("cpp", "default_args.cpp", [
        "void print(int val, int base = 10, bool newline = true) {",
        "    if (base == 16) {",
        "        // hex output",
        "    } else if (base == 8) {",
        "        // oct output",
        "    } else {",
        "        // dec output",
        "    }",
        "    if (newline) putchar('\\n');",
        "}"
      ].join("\n"))
    },

    "cpp-p17": {
      level: 1, title: "函数重载：多个版本 print",
      body: "手写 4 个重载版本的 print 函数：print(int)、print(double)、print(const char*)、print(int, double)。",
      hint: "同名不同参数列表，编译器自动选择匹配版本。",
      solution: C("cpp", "overload.cpp", [
        "void print(int x)          { /* ... */ }",
        "void print(double x)       { /* ... */ }",
        "void print(const char *s)  { /* ... */ }",
        "void print(int a, double b) { /* ... */ }",
        "// print(42)       → int 版本",
        "// print(3.14)     → double 版本",
        "// print(\"hello\")  → const char* 版本",
        "// print(1, 2.0)   → 双参数版本"
      ].join("\n"))
    },

    "cpp-p18": {
      level: 1, title: "命名空间与 using",
      body: "定义两个命名空间 rm::vision 和 rm::control，各有一个 init() 函数。手写程序分别调用它们。",
      hint: "rm::vision::init() 或 using namespace rm::vision; 后 init()。",
      solution: C("cpp", "namespace.cpp", [
        "namespace rm {",
        "    namespace vision  { void init() { /* 视觉初始化 */ } }",
        "    namespace control { void init() { /* 控制初始化 */ } }",
        "}",
        "int main() {",
        "    rm::vision::init();",
        "    rm::control::init();",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    "cpp-p19": {
      level: 1, title: "bool 类型与逻辑运算",
      body: "C++ 引入了原生 bool 类型。手写程序对比 C 的 int 当 bool 用和 C++ 的 bool。",
      hint: "bool 只有 true/false，sizeof(bool)==1。",
      solution: C("cpp", "bool_type.cpp", [
        "bool is_ready = true;",
        "bool is_error = false;",
        "// C: int is_ready = 1;  // 没有真正的 bool",
        "// C++: bool 是原生类型，类型安全"
      ].join("\n"))
    },

    "cpp-p20": {
      level: 1, title: "new/delete vs malloc/free",
      body: "手写程序对比 new/delete 和 malloc/free 的用法。new 会调用构造函数吗？delete 会调用析构函数吗？",
      hint: "new/delete 是运算符，会调用构造/析构；malloc/free 是库函数，不会。",
      solution: C("cpp", "new_vs_malloc.cpp", [
        "#include <cstdlib>",
        "struct Widget {",
        "    Widget()  { /* 构造函数 */ }",
        "    ~Widget() { /* 析构函数 */ }",
        "};",
        "int main() {",
        "    Widget *a = new Widget;    // 调构造函数",
        "    delete a;                   // 调析构函数",
        "    Widget *b = (Widget*)malloc(sizeof(Widget));  // 不调构造",
        "    free(b);                                    // 不调析构",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    "cpp-p21": {
      level: 1, title: "内联函数",
      body: "手写一个 inline 函数 max(a, b)，解释 inline 的作用和局限。",
      hint: "inline 建议编译器把函数体展开，避免调用开销。编译器可以忽略。",
      solution: C("cpp", "inline_func.cpp", [
        "inline int max(int a, int b) { return a > b ? a : b; }",
        "// 建议编译器将函数体直接展开到调用处",
        "// 适合短小的函数；大函数 inline 反而增加代码体积"
      ].join("\n"))
    },

    "cpp-p22": {
      level: 1, title: "auto 类型推导",
      body: "用 auto 遍历一个 vector，对比显式类型写法和 auto 写法。",
      hint: "auto 自动推导类型，适合迭代器、lambda 等冗长类型。",
      solution: C("cpp", "auto_type.cpp", [
        "#include <vector>",
        "std::vector<int> v = {1, 2, 3, 4, 5};",
        "// 显式写法：",
        "for (std::vector<int>::iterator it = v.begin(); it != v.end(); ++it) { }",
        "// auto 写法：",
        "for (auto it = v.begin(); it != v.end(); ++it) { }",
        "// 范围 for + auto：",
        "for (auto x : v) { }  // 值拷贝",
        "for (auto &x : v) { }  // 引用，可修改",
        "for (const auto &x : v) { }  // const 引用，只读"
      ].join("\n"))
    },

    "cpp-p23": {
      level: 1, title: "范围 for 循环",
      body: "用范围 for 遍历数组、vector、map。对比传统 for 循环。",
      hint: "for (auto &x : container) 是最常用的遍历方式。",
      solution: C("cpp", "range_for.cpp", [
        "#include <vector>",
        "#include <map>",
        "int arr[] = {1, 2, 3};",
        "for (int x : arr) { /* ... */ }",
        "std::vector<double> v = {1.1, 2.2};",
        "for (auto &x : v) { x *= 2; }  // 引用，可以修改",
        "std::map<int, std::string> m = {{1, \"a\"}, {2, \"b\"}};",
        "for (auto &[key, val] : m) { /* key=1, val=\"a\" */ }"
      ].join("\n"))
    },

    "cpp-p24": {
      level: 1, title: "nullptr vs NULL",
      body: "解释 nullptr 和 NULL 的区别。为什么 C++11 以后应该用 nullptr？",
      hint: "NULL 是 0，和 int 有歧义；nullptr 是专门的空指针类型。",
      solution: C("cpp", "nullptr.cpp", [
        "int *p = nullptr;  // C++11 推荐",
        "// int *p = NULL;  // NULL = 0，可能和 int 0 混淆",
        "// 函数重载时的歧义：",
        "void f(int);",
        "void f(int*);",
        "// f(NULL);     // 调 f(int)！不是你想要的",
        "// f(nullptr);  // 调 f(int*)，正确"
      ].join("\n"))
    },

    /* ==================== C++ · 类与对象 ==================== */

    "cpp-p25": {
      level: 2, featured: true, title: "手写完整类：PID 控制器",
      body: "手写一个完整的 PID 类：私有成员 kp/ki/kd/integral/last_error/output_limit，公有方法 setParams、compute(target, actual)、reset、setOutputLimit。",
      hint: "构造函数初始化所有成员；compute 里做 PID 计算并限幅。",
      solution: C("cpp", "pid_class.cpp", [
        "class PID {",
        "public:",
        "    PID(double kp, double ki, double kd)",
        "        : kp_(kp), ki_(ki), kd_(kd),",
        "          integral_(0), last_error_(0), output_limit_(1000) {}",
        "    void setOutputLimit(double limit) { output_limit_ = limit; }",
        "    void reset() { integral_ = 0; last_error_ = 0; }",
        "    double compute(double target, double actual) {",
        "        double error = target - actual;",
        "        integral_ += error;",
        "        double derivative = error - last_error_;",
        "        last_error_ = error;",
        "        double output = kp_ * error + ki_ * integral_ + kd_ * derivative;",
        "        if (output >  output_limit_) output =  output_limit_;",
        "        if (output < -output_limit_) output = -output_limit_;",
        "        return output;",
        "    }",
        "private:",
        "    double kp_, ki_, kd_;",
        "    double integral_, last_error_, output_limit_;",
        "};"
      ].join("\n"))
    },

    "cpp-p26": {
      level: 2, title: "构造函数与初始化列表",
      body: "手写一个类，成员有 const int id_ 和 double &ref_。必须用初始化列表初始化。",
      hint: "const 成员和引用成员必须在初始化列表中初始化，不能在函数体内赋值。",
      solution: C("cpp", "init_list.cpp", [
        "class Sensor {",
        "public:",
        "    Sensor(int id, double &value_ref)",
        "        : id_(id), ref_(value_ref) { }  // 必须在这里初始化",
        "private:",
        "    const int id_;    // const 成员",
        "    double &ref_;     // 引用成员",
        "};"
      ].join("\n"))
    },

    "cpp-p27": {
      level: 2, title: "拷贝构造函数与赋值运算符",
      body: "手写一个包含动态数组的类，正确实现拷贝构造函数和拷贝赋值运算符（深拷贝）。",
      hint: "Rule of Three：如果需要自定义析构、拷贝构造、拷贝赋值之一，三个都需要。",
      solution: C("cpp", "rule_of_three.cpp", [
        "class Buffer {",
        "public:",
        "    Buffer(size_t size) : data_(new int[size]), size_(size) {}",
        "    ~Buffer() { delete[] data_; }",
        "    // 拷贝构造（深拷贝）",
        "    Buffer(const Buffer &other) : data_(new int[other.size_]), size_(other.size_) {",
        "        for (size_t i = 0; i < size_; i++) data_[i] = other.data_[i];",
        "    }",
        "    // 拷贝赋值（深拷贝 + 自赋值检查）",
        "    Buffer &operator=(const Buffer &other) {",
        "        if (this != &other) {",
        "            delete[] data_;",
        "            data_ = new int[other.size_]; size_ = other.size_;",
        "            for (size_t i = 0; i < size_; i++) data_[i] = other.data_[i];",
        "        }",
        "        return *this;",
        "    }",
        "private:",
        "    int *data_; size_t size_;",
        "};"
      ].join("\n"))
    },

    "cpp-p28": {
      level: 2, featured: true, title: "移动语义与右值引用",
      body: "为上面的 Buffer 类添加移动构造函数和移动赋值运算符。解释什么是移动语义，它和拷贝的区别。",
      hint: "移动 = 偷资源，把源对象的指针拿过来，源置空。",
      solution: C("cpp", "move_semantics.cpp", [
        "class Buffer {",
        "public:",
        "    // ... 前面的构造/析构/拷贝省略 ...",
        "    // 移动构造：偷资源",
        "    Buffer(Buffer &&other) noexcept : data_(other.data_), size_(other.size_) {",
        "        other.data_ = nullptr; other.size_ = 0;",
        "    }",
        "    // 移动赋值",
        "    Buffer &operator=(Buffer &&other) noexcept {",
        "        if (this != &other) {",
        "            delete[] data_;",
        "            data_ = other.data_; size_ = other.size_;",
        "            other.data_ = nullptr; other.size_ = 0;",
        "        }",
        "        return *this;",
        "    }",
        "private:",
        "    int *data_ = nullptr; size_t size_ = 0;",
        "};"
      ].join("\n"))
    },

    "cpp-p29": {
      level: 2, title: "静态成员与静态方法",
      body: "手写一个计数器类：每次创建对象计数加一，销毁减一。提供静态方法 getCount()。",
      hint: "static 成员属于类不属于对象，构造函数 ++，析构函数 --。",
      solution: C("cpp", "static_counter.cpp", [
        "class Widget {",
        "public:",
        "    Widget()  { ++count_; }",
        "    ~Widget() { --count_; }",
        "    static int getCount() { return count_; }",
        "private:",
        "    static int count_;  // 声明",
        "};",
        "int Widget::count_ = 0;  // 定义（类外）"
      ].join("\n"))
    },

    "cpp-p30": {
      level: 2, title: "const 成员函数",
      body: "解释 const 成员函数的作用。手写一个类，包含 const 和非 const 版本的 get 方法。",
      hint: "const 成员函数不能修改成员变量，const 对象只能调 const 成员函数。",
      solution: C("cpp", "const_method.cpp", [
        "class Data {",
        "public:",
        "    int get()       { return value_; }        // 非 const：可读写",
        "    int get() const { return value_; }        // const：只读",
        "    void set(int v) { value_ = v; }",
        "private:",
        "    int value_ = 0;",
        "};",
        "// const Data d;  // 只能调 const get()",
        "// Data d;        // 两个版本都能调"
      ].join("\n"))
    },

    "cpp-p31": {
      level: 2, title: "友元函数与友元类",
      body: "手写一个类，用友元函数重载 << 运算符来输出对象内容。",
      hint: "friend std::ostream &operator<<(std::ostream&, const MyClass&);",
      solution: C("cpp", "friend_op.cpp", [
        "#include <ostream>",
        "class Point {",
        "public:",
        "    Point(double x, double y) : x_(x), y_(y) {}",
        "    friend std::ostream &operator<<(std::ostream &os, const Point &p) {",
        "        os << \"(\" << p.x_ << \", \" << p.y_ << \")\";",
        "        return os;",
        "    }",
        "private:",
        "    double x_, y_;",
        "};"
      ].join("\n"))
    },

    "cpp-p32": {
      level: 2, title: "运算符重载：复数类",
      body: "手写 Complex 类，重载 +、-、*、==、<< 运算符。",
      hint: "成员函数或全局函数实现，返回新对象。",
      solution: C("cpp", "complex_op.cpp", [
        "class Complex {",
        "public:",
        "    Complex(double r, double i) : re(r), im(i) {}",
        "    Complex operator+(const Complex &o) const { return {re+o.re, im+o.im}; }",
        "    Complex operator-(const Complex &o) const { return {re-o.re, im-o.im}; }",
        "    bool operator==(const Complex &o) const { return re==o.re && im==o.im; }",
        "    friend std::ostream &operator<<(std::ostream &os, const Complex &c) {",
        "        os << c.re << (c.im >= 0 ? \"+\" : \"\") << c.im << \"i\"; return os;",
        "    }",
        "private:",
        "    double re, im;",
        "};"
      ].join("\n"))
    },

    /* ==================== C++ · 继承与多态 ==================== */

    "cpp-p33": {
      level: 2, title: "虚函数与动态多态",
      body: "定义基类 Shape（纯虚函数 area()），派生类 Circle 和 Rectangle 各自实现。用基类指针数组遍历调用。",
      hint: "基类指针指向派生类对象，调用虚函数时走派生类版本。",
      solution: C("cpp", "polymorphism.cpp", [
        "struct Shape {",
        "    virtual double area() const = 0;  // 纯虚函数",
        "    virtual ~Shape() = default;        // 虚析构",
        "};",
        "struct Circle : Shape {",
        "    double r; Circle(double r) : r(r) {}",
        "    double area() const override { return 3.14159 * r * r; }",
        "};",
        "struct Rectangle : Shape {",
        "    double w, h; Rectangle(double w, double h) : w(w), h(h) {}",
        "    double area() const override { return w * h; }",
        "};"
      ].join("\n"))
    },

    "cpp-p34": {
      level: 2, title: "抽象基类与接口设计",
      body: "为 RM 视觉系统设计抽象基类 ArmorDetector，定义纯虚函数 detect(frame, armors)。",
      hint: "接口只定义方法签名，不实现。派生类具体实现检测算法。",
      solution: C("cpp", "abstract_interface.cpp", [
        "class ArmorDetector {",
        "public:",
        "    virtual ~ArmorDetector() = default;",
        "    virtual bool detect(const cv::Mat &frame, std::vector<Armor> &armors) = 0;",
        "    virtual void setEnemyColor(int color) = 0;",
        "};",
        "// 派生类实现具体算法",
        "class TraditionalDetector : public ArmorDetector {",
        "public:",
        "    bool detect(const cv::Mat &frame, std::vector<Armor> &armors) override { /* ... */ }",
        "    void setEnemyColor(int color) override { /* ... */ }",
        "};"
      ].join("\n"))
    },

    "cpp-p35": {
      level: 2, title: "虚析构函数的必要性",
      body: "解释为什么基类的析构函数必须是 virtual。手写一个不用虚析构导致内存泄漏的例子。",
      hint: "通过基类指针 delete 派生类对象时，非虚析构只调基类析构。",
      solution: C("cpp", "virtual_dtor.cpp", [
        "struct Base {",
        "    // ~Base() { }           // 非虚析构：delete 基类指针只调这个",
        "    virtual ~Base() { }      // 虚析构：先调派生类再调基类",
        "};",
        "struct Derived : Base {",
        "    int *data = new int[100];",
        "    ~Derived() { delete[] data; }  // 需要被调用",
        "};",
        "// Base *p = new Derived();",
        "// delete p;  // 虚析构：正确调用 ~Derived()；非虚：内存泄漏"
      ].join("\n"))
    },

    "cpp-p36": {
      level: 2, title: "override 与 final 关键字",
      body: "解释 override 和 final 的作用。手写代码演示。",
      hint: "override 告诉编译器这是覆盖基类的虚函数，不匹配会报错。final 禁止再被覆盖。",
      solution: C("cpp", "override_final.cpp", [
        "struct Base {",
        "    virtual void work() { }",
        "};",
        "struct Derived : Base {",
        "    void work() override { }  // 编译器检查：确实覆盖了基类虚函数",
        "};",
        "struct FinalDerived : Base {",
        "    void work() final { }     // 这个 override 是最终版，不能再被覆盖",
        "};",
        "// struct GrandChild : FinalDerived {",
        "//     void work() override { }  // 编译错误！final 禁止",
        "// };"
      ].join("\n"))
    },

    /* ==================== C++ · 模板 ==================== */

    "cpp-p37": {
      level: 2, title: "函数模板：通用 max",
      body: "手写模板函数 max<T>，支持任意可比较类型。",
      hint: "template<typename T> T max(T a, T b) { return a > b ? a : b; }",
      solution: C("cpp", "template_max.cpp", [
        "template <typename T>",
        "T my_max(T a, T b) { return a > b ? a : b; }",
        "// 调用：my_max(3, 5)      → T=int",
        "//       my_max(3.14, 2.7) → T=double",
        "//       my_max('a', 'z')  → T=char"
      ].join("\n"))
    },

    "cpp-p38": {
      level: 2, title: "类模板：简单 Vector",
      body: "手写一个简化版 Vector 类模板：push_back、size、operator[]、析构释放。",
      hint: "template<typename T> class Vec { T *data_; size_t size_, cap_; };",
      solution: C("cpp", "template_vec.cpp", [
        "template <typename T>",
        "class Vec {",
        "public:",
        "    Vec() : data_(nullptr), size_(0), cap_(0) {}",
        "    ~Vec() { delete[] data_; }",
        "    void push_back(const T &val) {",
        "        if (size_ == cap_) {",
        "            cap_ = cap_ ? cap_ * 2 : 4;",
        "            T *new_data = new T[cap_];",
        "            for (size_t i = 0; i < size_; i++) new_data[i] = data_[i];",
        "            delete[] data_; data_ = new_data;",
        "        }",
        "        data_[size_++] = val;",
        "    }",
        "    size_t size() const { return size_; }",
        "    T &operator[](size_t i) { return data_[i]; }",
        "private:",
        "    T *data_; size_t size_, cap_;",
        "};"
      ].join("\n"))
    },

    "cpp-p39": {
      level: 2, title: "模板特化",
      body: "为模板函数 print<T> 写一个通用版本和一个 const char* 特化版本。",
      hint: "template<> void print<const char*>(const char *val) { /* 特化 */ }",
      solution: C("cpp", "template_specialize.cpp", [
        "template <typename T>",
        "void print(T val) { std::cout << val << std::endl; }",
        "// 特化版本",
        "template <>",
        "void print<const char*>(const char *val) {",
        "    std::cout << \"[string] \" << val << std::endl;",
        "}"
      ].join("\n"))
    },

    /* ==================== C++ · STL ==================== */

    "cpp-p40": {
      level: 2, featured: true, title: "vector 实战：装甲板数据结构",
      body: "定义 Armor 结构体（中心点、宽高、角度、置信度），用 vector<Armor> 存储检测结果。手写函数按置信度排序。",
      hint: "struct Armor { cv::Point2f center; float w, h, angle, conf; };",
      solution: C("cpp", "armor_vector.cpp", [
        "#include <vector>",
        "#include <algorithm>",
        "struct Armor {",
        "    float cx, cy;      // 中心坐标",
        "    float w, h, angle; // 宽高和角度",
        "    float conf;        // 置信度",
        "};",
        "void sort_by_conf(std::vector<Armor> &armors) {",
        "    std::sort(armors.begin(), armors.end(),",
        "              [](const Armor &a, const Armor &b) { return a.conf > b.conf; });",
        "}"
      ].join("\n"))
    },

    "cpp-p41": {
      level: 2, title: "map 实战：参数配置表",
      body: "用 map<string, double> 存储 PID 参数，提供 set 和 get 方法。",
      hint: "map[\"kp\"] = 1.5; map.at(\"kp\") 或 map[\"kp\"] 读取。",
      solution: C("cpp", "param_map.cpp", [
        "#include <map>",
        "#include <string>",
        "class ParamTable {",
        "public:",
        "    void set(const std::string &key, double val) { params_[key] = val; }",
        "    double get(const std::string &key, double def = 0.0) const {",
        "        auto it = params_.find(key);",
        "        return (it != params_.end()) ? it->second : def;",
        "    }",
        "private:",
        "    std::map<std::string, double> params_;",
        "};"
      ].join("\n"))
    },

    "cpp-p42": {
      level: 2, title: "queue 与 deque：消息队列",
      body: "手写一个线程安全的消息队列（简化版，不考虑锁）：push、pop、front、empty、size。用 deque 实现。",
      hint: "std::deque 支持两端操作，比 queue 更灵活。",
      solution: C("cpp", "msg_queue.cpp", [
        "#include <deque>",
        "template <typename T>",
        "class MsgQueue {",
        "public:",
        "    void push(const T &val) { dq_.push_back(val); }",
        "    bool pop(T &out) {",
        "        if (dq_.empty()) return false;",
        "        out = dq_.front(); dq_.pop_front(); return true;",
        "    }",
        "    bool empty() const { return dq_.empty(); }",
        "    size_t size() const { return dq_.size(); }",
        "private:",
        "    std::deque<T> dq_;",
        "};"
      ].join("\n"))
    },

    "cpp-p43": {
      level: 2, title: "algorithm 实战：找最大置信度",
      body: "用 std::max_element 找 vector<Armor> 中置信度最高的装甲板。",
      hint: "std::max_element 返回迭代器，用 lambda 比较。",
      solution: C("cpp", "max_element.cpp", [
        "auto best = std::max_element(armors.begin(), armors.end(),",
        "    [](const Armor &a, const Armor &b) { return a.conf < b.conf; });",
        "if (best != armors.end()) {",
        "    // best->conf 是最高置信度",
        "}"
      ].join("\n"))
    },

    "cpp-p44": {
      level: 2, title: "algorithm 实战：过滤低置信度",
      body: "用 std::remove_if + erase 删除 vector<Armor> 中置信度低于 0.5 的元素。",
      hint: "erase-remove 惯用法：v.erase(remove_if(...), v.end());",
      solution: C("cpp", "erase_remove.cpp", [
        "armors.erase(",
        "    std::remove_if(armors.begin(), armors.end(),",
        "        [](const Armor &a) { return a.conf < 0.5f; }),",
        "    armors.end());"
      ].join("\n"))
    },

    "cpp-p45": {
      level: 2, title: "stack 与 queue 适配器",
      body: "解释 stack 和 queue 是容器适配器而不是容器。手写代码演示它们的用法。",
      hint: "底层默认用 deque，可以指定底层容器。",
      solution: C("cpp", "adapter.cpp", [
        "#include <stack>",
        "#include <queue>",
        "#include <vector>",
        "std::stack<int> s;                    // 默认底层 deque",
        "std::stack<int, std::vector<int>> s2; // 底层用 vector",
        "std::queue<int> q;",
        "std::queue<int, std::list<int>> q2;   // 底层用 list"
      ].join("\n"))
    },

    /* ==================== C++ · 智能指针 ==================== */

    "cpp-p46": {
      level: 2, featured: true, title: "unique_ptr：独占所有权",
      body: "手写程序演示 unique_ptr 的创建、移动、释放。解释为什么不能拷贝。",
      hint: "unique_ptr 独占资源，只能移动不能拷贝。离开作用域自动释放。",
      solution: C("cpp", "unique_ptr.cpp", [
        "#include <memory>",
        "auto p1 = std::make_unique<int>(42);  // 创建",
        "// auto p2 = p1;                      // 编译错误：不能拷贝",
        "auto p2 = std::move(p1);              // 移动：p1 变空",
        "// p2 离开作用域时自动 delete"
      ].join("\n"))
    },

    "cpp-p47": {
      level: 2, title: "shared_ptr：共享所有权",
      body: "手写程序演示 shared_ptr 的引用计数机制。什么时候释放？",
      hint: "最后一个 shared_ptr 析构时释放资源。use_count() 查看计数。",
      solution: C("cpp", "shared_ptr.cpp", [
        "#include <memory>",
        "auto p1 = std::make_shared<int>(42);",
        "std::cout << p1.use_count();  // 1",
        "{",
        "    auto p2 = p1;              // 拷贝，计数+1",
        "    std::cout << p1.use_count();  // 2",
        "}                             // p2 析构，计数-1",
        "std::cout << p1.use_count();  // 1",
        "// p1 析构时计数归 0，释放内存"
      ].join("\n"))
    },

    "cpp-p48": {
      level: 2, title: "weak_ptr：打破循环引用",
      body: "手写一个循环引用的例子，然后用 weak_ptr 修复。",
      hint: "A 持有 B 的 shared_ptr，B 持有 A 的 shared_ptr → 永远释放不了。一边改 weak_ptr。",
      solution: C("cpp", "weak_ptr.cpp", [
        "struct Node {",
        "    std::shared_ptr<Node> next;",
        "    std::weak_ptr<Node> prev;   // 用 weak_ptr 打破循环",
        "    ~Node() { /* 打印日志可观察到析构 */ }",
        "};",
        "// a->next = b; b->prev = a;",
        "// a 释放时 b 也会释放，不会泄漏"
      ].join("\n"))
    },

    "cpp-p49": {
      level: 2, title: "unique_ptr 数组",
      body: "用 unique_ptr 管理动态数组，对比裸 new[]/delete[]。",
      hint: "std::unique_ptr<int[]> arr(new int[10]); 自动 delete[]。",
      solution: C("cpp", "unique_array.cpp", [
        "auto arr = std::make_unique<int[]>(10);  // 自动 delete[]",
        "arr[0] = 42;",
        "// 不需要手动 delete[]"
      ].join("\n"))
    },

    /* ==================== C++ · 异常处理 ==================== */

    "cpp-p50": {
      level: 2, title: "try/catch 基础",
      body: "手写程序演示 throw 和 try/catch。抛出自定义异常类。",
      hint: "class MyError : public std::runtime_error { using runtime_error::runtime_error; };",
      solution: C("cpp", "exception.cpp", [
        "#include <stdexcept>",
        "#include <iostream>",
        "double divide(double a, double b) {",
        "    if (b == 0) throw std::runtime_error(\"除零错误\");",
        "    return a / b;",
        "}",
        "int main() {",
        "    try {",
        "        double r = divide(10, 0);",
        "    } catch (const std::runtime_error &e) {",
        "        std::cerr << \"异常: \" << e.what() << std::endl;",
        "    }",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    "cpp-p51": {
      level: 2, title: "RAII：用对象生命周期管理资源",
      body: "手写一个 FileGuard 类：构造函数打开文件，析构函数关闭文件。演示 RAII 的好处。",
      hint: "资源获取即初始化：构造函数获取资源，析构函数释放资源。",
      solution: C("cpp", "raii.cpp", [
        "class FileGuard {",
        "public:",
        "    FileGuard(const char *path, const char *mode) {",
        "        f_ = fopen(path, mode);",
        "        if (!f_) throw std::runtime_error(\"打开失败\");",
        "    }",
        "    ~FileGuard() { if (f_) fclose(f_); }",
        "    FILE *get() { return f_; }",
        "private:",
        "    FILE *f_ = nullptr;",
        "};",
        "// 即使抛异常，FileGuard 析构也会执行，文件不会泄漏"
      ].join("\n"))
    },

    /* ==================== C++ · Lambda 与函数对象 ==================== */

    "cpp-p52": {
      level: 1, title: "Lambda 表达式基础",
      body: "手写 lambda 表达式：无捕获、值捕获、引用捕获。对比三种写法的区别。",
      hint: "[] 无捕获；[=] 值捕获（拷贝）；[&] 引用捕获。",
      solution: C("cpp", "lambda_basic.cpp", [
        "int x = 10;",
        "auto f1 = []() { };                    // 无捕获",
        "auto f2 = [x]() { return x; };         // 值捕获（拷贝 x）",
        "auto f3 = [&x]() { x = 20; };          // 引用捕获（改外面的 x）",
        "auto f4 = [=]() mutable { x = 30; };   // 值捕获但允许改拷贝"
      ].join("\n"))
    },

    "cpp-p53": {
      level: 2, title: "Lambda 捕获 this 与成员变量",
      body: "在类成员函数中写 lambda，捕获 this 来访问成员变量。",
      hint: "[this]() { member_ = 42; } 或 [=, this]() { }",
      solution: C("cpp", "lambda_this.cpp", [
        "class Processor {",
        "public:",
        "    void run() {",
        "        auto callback = [this](int val) {",
        "            result_ = val * factor_;  // 通过 this 访问成员",
        "        };",
        "        callback(10);",
        "    }",
        "private:",
        "    int result_ = 0, factor_ = 3;",
        "};"
      ].join("\n"))
    },

    "cpp-p54": {
      level: 2, title: "std::function 与回调注册",
      body: "手写一个事件系统：register_callback(event, std::function<void(int)>)，fire(event, data) 时调用所有注册的回调。",
      hint: "用 map<string, vector<function<void(int)>>> 存回调。",
      solution: C("cpp", "event_system.cpp", [
        "#include <functional>",
        "#include <map>",
        "#include <vector>",
        "class EventSystem {",
        "public:",
        "    using Callback = std::function<void(int)>;",
        "    void on(const std::string &event, Callback cb) {",
        "        handlers_[event].push_back(cb);",
        "    }",
        "    void fire(const std::string &event, int data) {",
        "        for (auto &cb : handlers_[event]) cb(data);",
        "    }",
        "private:",
        "    std::map<std::string, std::vector<Callback>> handlers_;",
        "};"
      ].join("\n"))
    },

    /* ==================== C++ · 多线程基础 ==================== */

    "cpp-p55": {
      level: 3, title: "std::thread 基础",
      body: "手写程序：主线程创建两个工作线程，一个打印奇数一个打印偶数，join 等待结束。",
      hint: "std::thread t1(func); t1.join();",
      solution: C("cpp", "thread_basic.cpp", [
        "#include <thread>",
        "#include <iostream>",
        "void print_odd()  { for (int i = 1; i < 10; i += 2) std::cout << i << \" \"; }",
        "void print_even() { for (int i = 2; i < 10; i += 2) std::cout << i << \" \"; }",
        "int main() {",
        "    std::thread t1(print_odd);",
        "    std::thread t2(print_even);",
        "    t1.join(); t2.join();",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    "cpp-p56": {
      level: 3, title: "互斥锁保护共享数据",
      body: "手写程序：两个线程同时对一个计数器加 100000 次，对比加锁和不加锁的结果。",
      hint: "std::mutex m; m.lock(); counter++; m.unlock(); 或用 lock_guard。",
      solution: C("cpp", "mutex_counter.cpp", [
        "#include <mutex>",
        "#include <thread>",
        "int counter = 0;",
        "std::mutex mtx;",
        "void unsafe_increment() {",
        "    for (int i = 0; i < 100000; i++) counter++;  // 竞态！",
        "}",
        "void safe_increment() {",
        "    for (int i = 0; i < 100000; i++) {",
        "        std::lock_guard<std::mutex> lock(mtx);",
        "        counter++;",
        "    }",
        "}"
      ].join("\n"))
    },

    "cpp-p57": {
      level: 3, title: "条件变量：生产者-消费者",
      body: "手写生产者-消费者模型：一个线程生产数据放入队列，另一个线程消费。用条件变量等待。",
      hint: "std::condition_variable cv; cv.wait(lock, pred); cv.notify_one();",
      solution: C("cpp", "cond_var.cpp", [
        "#include <queue>",
        "#include <mutex>",
        "#include <condition_variable>",
        "std::queue<int> q;",
        "std::mutex mtx;",
        "std::condition_variable cv;",
        "bool done = false;",
        "void producer() {",
        "    for (int i = 0; i < 10; i++) {",
        "        { std::lock_guard<std::mutex> lk(mtx); q.push(i); }",
        "        cv.notify_one();",
        "    }",
        "    { std::lock_guard<std::mutex> lk(mtx); done = true; }",
        "    cv.notify_all();",
        "}",
        "void consumer() {",
        "    while (true) {",
        "        std::unique_lock<std::mutex> lk(mtx);",
        "        cv.wait(lk, [] { return !q.empty() || done; });",
        "        if (done && q.empty()) break;",
        "        int val = q.front(); q.pop(); lk.unlock();",
        "        // 处理 val",
        "    }",
        "}"
      ].join("\n"))
    },

    /* ==================== C++ · 综合实战 ==================== */

    "cpp-p58": {
      level: 3, featured: true, title: "线程安全的单例模式",
      body: "手写一个线程安全的懒汉式单例（C++11 起局部静态变量保证线程安全）。",
      hint: "static T instance; 在函数内声明，C++11 保证初始化线程安全。",
      solution: C("cpp", "singleton.cpp", [
        "class Config {",
        "public:",
        "    static Config &instance() {",
        "        static Config cfg;  // C++11 起线程安全",
        "        return cfg;",
        "    }",
        "    Config(const Config &) = delete;",
        "    Config &operator=(const Config &) = delete;",
        "private:",
        "    Config() = default;",
        "};"
      ].join("\n"))
    },

    "cpp-p59": {
      level: 3, title: "简单线程池",
      body: "手写一个固定 4 个线程的线程池：enqueue(task) 把任务放入队列，worker 线程不断取出执行。",
      hint: "队列 + 条件变量 + 互斥锁。线程池构造时启动 N 个 worker。",
      solution: C("cpp", "thread_pool.cpp", [
        "class ThreadPool {",
        "public:",
        "    ThreadPool(size_t n) : stop_(false) {",
        "        for (size_t i = 0; i < n; i++)",
        "            workers_.emplace_back([this] { worker(); });",
        "    }",
        "    ~ThreadPool() {",
        "        { std::lock_guard<std::mutex> lk(mtx_); stop_ = true; }",
        "        cv_.notify_all();",
        "        for (auto &w : workers_) w.join();",
        "    }",
        "    void enqueue(std::function<void()> task) {",
        "        { std::lock_guard<std::mutex> lk(mtx_); tasks_.push(task); }",
        "        cv_.notify_one();",
        "    }",
        "private:",
        "    void worker() {",
        "        while (true) {",
        "            std::function<void()> task;",
        "            {",
        "                std::unique_lock<std::mutex> lk(mtx_);",
        "                cv_.wait(lk, [this] { return stop_ || !tasks_.empty(); });",
        "                if (stop_ && tasks_.empty()) return;",
        "                task = tasks_.front(); tasks_.pop();",
        "            }",
        "            task();",
        "        }",
        "    }",
        "    std::vector<std::thread> workers_;",
        "    std::queue<std::function<void()>> tasks_;",
        "    std::mutex mtx_; std::condition_variable cv_; bool stop_;",
        "};"
      ].join("\n"))
    },

    "cpp-p60": {
      level: 3, title: "观察者模式（事件通知）",
      body: "手写观察者模式：Subject 维护观察者列表，notify 时通知所有观察者。",
      hint: "Observer 是抽象基类，Subject 存 vector<Observer*>。",
      solution: C("cpp", "observer.cpp", [
        "class Observer {",
        "public:",
        "    virtual ~Observer() = default;",
        "    virtual void onNotify(int event) = 0;",
        "};",
        "class Subject {",
        "public:",
        "    void addObserver(Observer *obs) { observers_.push_back(obs); }",
        "    void notify(int event) {",
        "        for (auto *obs : observers_) obs->onNotify(event);",
        "    }",
        "private:",
        "    std::vector<Observer*> observers_;",
        "};"
      ].join("\n"))
    },

    "cpp-p61": {
      level: 3, title: "策略模式：检测算法切换",
      body: "手写策略模式：Detector 持有 DetectionStrategy 指针，可以运行时切换传统算法/深度学习算法。",
      hint: "基类定义接口，派生类实现不同策略，运行时注入。",
      solution: C("cpp", "strategy.cpp", [
        "class DetectionStrategy {",
        "public:",
        "    virtual ~DetectionStrategy() = default;",
        "    virtual std::vector<Armor> detect(const cv::Mat &frame) = 0;",
        "};",
        "class TraditionalStrategy : public DetectionStrategy {",
        "    std::vector<Armor> detect(const cv::Mat &frame) override { /* ... */ }",
        "};",
        "class DLStrategy : public DetectionStrategy {",
        "    std::vector<Armor> detect(const cv::Mat &frame) override { /* ... */ }",
        "};",
        "class Detector {",
        "public:",
        "    void setStrategy(std::unique_ptr<DetectionStrategy> s) { strategy_ = std::move(s); }",
        "    std::vector<Armor> detect(const cv::Mat &frame) { return strategy_->detect(frame); }",
        "private:",
        "    std::unique_ptr<DetectionStrategy> strategy_;",
        "};"
      ].join("\n"))
    },

    "cpp-p62": {
      level: 3, title: "工厂模式：装甲板检测器工厂",
      body: "手写工厂模式：根据配置字符串创建不同类型的 Detector 对象。",
      hint: "static std::unique_ptr<Detector> create(const std::string &type);",
      solution: C("cpp", "factory.cpp", [
        "class DetectorFactory {",
        "public:",
        "    static std::unique_ptr<ArmorDetector> create(const std::string &type) {",
        "        if (type == \"traditional\") return std::make_unique<TraditionalDetector>();",
        "        if (type == \"dl\")          return std::make_unique<DLDetector>();",
        "        throw std::invalid_argument(\"未知类型: \" + type);",
        "    }",
        "};",
        "// 用法：auto det = DetectorFactory::create(\"traditional\");"
      ].join("\n"))
    },

    /* ==================== C++ · 补充 ==================== */

    "cpp-p63": {
      level: 1, title: "类型转换：static_cast vs dynamic_cast",
      body: "解释 static_cast 和 dynamic_cast 的区别和适用场景。",
      hint: "static_cast 编译时检查（基本类型转换）；dynamic_cast 运行时检查（多态向下转型）。",
      solution: C("cpp", "cast.cpp", [
        "// static_cast：基本类型转换、明确的向下转型",
        "double d = 3.14;",
        "int i = static_cast<int>(d);",
        "// dynamic_cast：多态向下转型（需要虚函数）",
        "// Base *b = new Derived();",
        "// Derived *d = dynamic_cast<Derived*>(b);  // 失败返回 nullptr"
      ].join("\n"))
    },

    "cpp-p64": {
      level: 1, title: "结构化绑定（C++17）",
      body: "用结构化绑定解包 pair、tuple、结构体。",
      hint: "auto [a, b] = std::make_pair(1, 2); auto [x, y] = point;",
      solution: C("cpp", "structured_binding.cpp", [
        "auto [a, b] = std::make_pair(1, 2.5);     // a=1, b=2.5",
        "auto [x, y, z] = std::make_tuple(1, 2, 3); // 解包 tuple",
        "struct Point { double x, y; };",
        "Point p = {1.5, 2.5};",
        "auto [px, py] = p;  // 解包结构体",
        "// 遍历 map：",
        "for (auto &[key, value] : my_map) { }"
      ].join("\n"))
    },

    "cpp-p65": {
      level: 1, title: "constexpr：编译期常量",
      body: "解释 constexpr 的作用。手写 constexpr 函数计算阶乘。",
      hint: "constexpr 告诉编译器这个值/函数可以在编译期计算。",
      solution: C("cpp", "constexpr.cpp", [
        "constexpr int MAX_SIZE = 100;  // 编译期常量",
        "constexpr int factorial(int n) {",
        "    return (n <= 1) ? 1 : n * factorial(n - 1);",
        "}",
        "// constexpr int f5 = factorial(5);  // 编译期算好 = 120"
      ].join("\n"))
    },

    "cpp-p66": {
      level: 2, title: "explicit 关键字",
      body: "解释 explicit 的作用。手写一个不带 explicit 会隐式转换导致意外的例子。",
      hint: "explicit 禁止隐式转换，必须显式构造。",
      solution: C("cpp", "explicit.cpp", [
        "class Distance {",
        "public:",
        "    explicit Distance(double meters) : meters_(meters) {}",
        "private:",
        "    double meters_;",
        "};",
        "void print(Distance d) { }",
        "// print(3.14);           // 编译错误！不能隐式转换",
        "// print(Distance(3.14)); // OK：显式构造"
      ].join("\n"))
    },

    "cpp-p67": {
      level: 2, title: "委托构造函数",
      body: "手写一个类有多个构造函数，用委托构造函数避免重复初始化代码。",
      hint: "构造函数 : 另一个构造函数(参数) { }",
      solution: C("cpp", "delegating_ctor.cpp", [
        "class Point {",
        "public:",
        "    Point() : Point(0, 0) { }           // 委托给双参数版",
        "    Point(double x) : Point(x, 0) { }    // 委托给双参数版",
        "    Point(double x, double y) : x_(x), y_(y) { }  // 主构造函数",
        "private:",
        "    double x_, y_;",
        "};"
      ].join("\n"))
    },

    "cpp-p68": {
      level: 2, title: "=default 与 =delete",
      body: "解释 =default 和 =delete 的作用和使用场景。",
      hint: "=default 显式使用编译器默认版本；=delete 禁止使用。",
      solution: C("cpp", "default_delete.cpp", [
        "class NonCopyable {",
        "public:",
        "    NonCopyable() = default;                          // 用编译器默认的",
        "    NonCopyable(const NonCopyable &) = delete;        // 禁止拷贝",
        "    NonCopyable &operator=(const NonCopyable &) = delete; // 禁止赋值",
        "    NonCopyable(NonCopyable &&) = default;             // 允许移动",
        "};"
      ].join("\n"))
    },

    "cpp-p69": {
      level: 2, title: "std::optional",
      body: "用 std::optional 表示「可能没有值」的情况。手写函数返回 optional&lt;double&gt;。",
      hint: "std::optional<double> find(int id); 有值时 *opt 或 opt.value()。",
      solution: C("cpp", "optional.cpp", [
        "#include <optional>",
        "std::optional<double> safe_divide(double a, double b) {",
        "    if (b == 0) return std::nullopt;  // 无值",
        "    return a / b;                      // 有值",
        "}",
        "// 使用：",
        "auto result = safe_divide(10, 3);",
        "if (result) { /* *result = 3.33... */ }",
        "else        { /* 除零 */ }"
      ].join("\n"))
    },

    "cpp-p70": {
      level: 2, title: "std::variant 与 std::visit",
      body: "用 variant 存储多种类型的值，用 visit 处理。",
      hint: "std::variant<int, double, std::string> v; std::visit([](auto x){...}, v);",
      solution: C("cpp", "variant.cpp", [
        "#include <variant>",
        "std::variant<int, double, std::string> v;",
        "v = 42;",
        "v = 3.14;",
        "v = std::string(\"hello\");",
        "std::visit([](const auto &x) { std::cout << x << std::endl; }, v);"
      ].join("\n"))
    },

    "cpp-p71": {
      level: 2, title: "std::tuple 与多返回值",
      body: "手写函数返回多个值（成功标志 + 结果 + 错误信息），用 tuple 或结构化绑定。",
      hint: "return {true, 42.0, \"\"}; auto [ok, val, err] = func();",
      solution: C("cpp", "tuple_return.cpp", [
        "#include <tuple>",
        "std::tuple<bool, double, std::string> compute(double x) {",
        "    if (x < 0) return {false, 0.0, \"负数不支持\"};",
        "    return {true, x * 2.0, \"\"};",
        "}",
        "// 调用：auto [ok, val, err] = compute(3.14);"
      ].join("\n"))
    },

    "cpp-p72": {
      level: 2, title: "std::any",
      body: "用 std::any 存储任意类型的值。解释它和 void* 的区别。",
      hint: "any 是类型安全的，any_cast 失败抛异常；void* 完全无类型检查。",
      solution: C("cpp", "any.cpp", [
        "#include <any>",
        "std::any a = 42;",
        "a = 3.14;",
        "a = std::string(\"hello\");",
        "int x = std::any_cast<int>(a);      // 类型不匹配抛 bad_any_cast",
        "double d = std::any_cast<double>(a); // OK"
      ].join("\n"))
    },

    "cpp-p73": {
      level: 2, title: "std::chrono：时间测量",
      body: "用 chrono 测量一段代码的执行时间（毫秒精度）。",
      hint: "auto start = chrono::steady_clock::now(); ... auto end = ...; duration_cast<milliseconds>(end-start).count()",
      solution: C("cpp", "chrono.cpp", [
        "#include <chrono>",
        "auto start = std::chrono::steady_clock::now();",
        "// ... 被测代码 ...",
        "auto end = std::chrono::steady_clock::now();",
        "auto ms = std::chrono::duration_cast<std::chrono::milliseconds>(end - start).count();",
        "// ms 就是执行毫秒数"
      ].join("\n"))
    },

    "cpp-p74": {
      level: 2, title: "std::atomic：无锁计数器",
      body: "用 atomic<int> 实现线程安全的计数器，对比 mutex 版本。",
      hint: "atomic 的 ++ 是原子的，不需要锁。",
      solution: C("cpp", "atomic.cpp", [
        "#include <atomic>",
        "std::atomic<int> counter{0};",
        "void increment() {",
        "    for (int i = 0; i < 100000; i++) counter++;  // 原子操作，无需锁",
        "}"
      ].join("\n"))
    },

    "cpp-p75": {
      level: 2, title: "std::accumulate：数值求和",
      body: "用 std::accumulate 对 vector<double> 求和，自定义初始值。",
      hint: "std::accumulate(v.begin(), v.end(), 0.0) 第三个参数是初始值。",
      solution: C("cpp", "accumulate.cpp", [
        "#include <numeric>",
        "std::vector<double> v = {1.1, 2.2, 3.3};",
        "double sum = std::accumulate(v.begin(), v.end(), 0.0);",
        "double product = std::accumulate(v.begin(), v.end(), 1.0,",
        "    [](double a, double b) { return a * b; });"
      ].join("\n"))
    },

    "cpp-p76": {
      level: 2, title: "std::transform：批量处理",
      body: "用 std::transform 将 vector<double> 中每个元素乘以 2，结果存入新 vector。",
      hint: "std::transform(src.begin(), src.end(), dst.begin(), [](double x){return x*2;});",
      solution: C("cpp", "transform.cpp", [
        "#include <algorithm>",
        "std::vector<double> src = {1.0, 2.0, 3.0};",
        "std::vector<double> dst(src.size());",
        "std::transform(src.begin(), src.end(), dst.begin(),",
        "    [](double x) { return x * 2.0; });"
      ].join("\n"))
    },

    "cpp-p77": {
      level: 2, title: "std::sort 自定义比较",
      body: "对 vector<Armor> 按置信度降序排序，置信度相同时按面积降序。",
      hint: "lambda 里写多级比较。",
      solution: C("cpp", "sort_custom.cpp", [
        "std::sort(armors.begin(), armors.end(),",
        "    [](const Armor &a, const Armor &b) {",
        "        if (a.conf != b.conf) return a.conf > b.conf;",
        "        return a.w * a.h > b.w * b.h;",
        "    });"
      ].join("\n"))
    },

    "cpp-p78": {
      level: 2, title: "std::find_if 查找",
      body: "在 vector<Armor> 中查找置信度大于 0.9 的第一个元素。",
      hint: "std::find_if 返回迭代器，找不到返回 end()。",
      solution: C("cpp", "find_if.cpp", [
        "auto it = std::find_if(armors.begin(), armors.end(),",
        "    [](const Armor &a) { return a.conf > 0.9f; });",
        "if (it != armors.end()) { /* 找到了 */ }"
      ].join("\n"))
    },

    "cpp-p79": {
      level: 2, title: "std::count_if 统计",
      body: "统计 vector<Armor> 中置信度大于 0.8 的元素个数。",
      hint: "std::count_if(begin, end, pred) 返回满足条件的个数。",
      solution: C("cpp", "count_if.cpp", [
        "size_t count = std::count_if(armors.begin(), armors.end(),",
        "    [](const Armor &a) { return a.conf > 0.8f; });"
      ].join("\n"))
    },

    "cpp-p80": {
      level: 2, title: "std::for_each 与 for 循环",
      body: "对比 std::for_each 和范围 for 循环遍历容器。什么时候用哪个？",
      hint: "范围 for 更简洁；for_each 可以配合 lambda 做更复杂的操作。",
      solution: C("cpp", "for_each.cpp", [
        "// 范围 for（推荐）：",
        "for (const auto &a : armors) { /* ... */ }",
        "// std::for_each（等价）：",
        "std::for_each(armors.begin(), armors.end(),",
        "    [](const Armor &a) { /* ... */ });"
      ].join("\n"))
    },

    /* ==================== C++ · 进阶综合 ==================== */

    "cpp-p81": {
      level: 3, title: "模板元编程：编译期斐波那契",
      body: "用模板递归在编译期计算斐波那契数。",
      hint: "template<int N> struct Fib { static constexpr int value = Fib<N-1>::value + Fib<N-2>::value; };",
      solution: C("cpp", "tmp_fib.cpp", [
        "template <int N>",
        "struct Fib {",
        "    static constexpr int value = Fib<N-1>::value + Fib<N-2>::value;",
        "};",
        "template <> struct Fib<0> { static constexpr int value = 0; };",
        "template <> struct Fib<1> { static constexpr int value = 1; };",
        "// Fib<10>::value 在编译期就算好了 = 55"
      ].join("\n"))
    },

    "cpp-p82": {
      level: 3, title: "CRTP：奇异递归模板模式",
      body: "手写 CRTP 示例：基类模板参数是派生类，实现静态多态。",
      hint: "template<typename Derived> class Base { void interface() { static_cast<Derived*>(this)->impl(); } };",
      solution: C("cpp", "crtp.cpp", [
        "template <typename Derived>",
        "class DetectorBase {",
        "public:",
        "    void detect() {",
        "        preProcess();",
        "        static_cast<Derived*>(this)->doDetect();  // 静态多态",
        "        postProcess();",
        "    }",
        "private:",
        "    void preProcess() { }",
        "    void postProcess() { }",
        "};",
        "class ArmorDetector : public DetectorBase<ArmorDetector> {",
        "public:",
        "    void doDetect() { /* 具体实现 */ }",
        "};"
      ].join("\n"))
    },

    "cpp-p83": {
      level: 3, title: "SFINAE：类型检查模板",
      body: "手写一个模板函数，只有当 T 是整数类型时才可用。",
      hint: "用 std::enable_if 或 C++20 concepts。",
      solution: C("cpp", "sfinae.cpp", [
        "template <typename T>",
        "typename std::enable_if<std::is_integral<T>::value, T>::type",
        "safe_add(T a, T b) { return a + b; }",
        "// safe_add(1, 2)     // OK",
        "// safe_add(1.5, 2.5) // 编译错误：不是整数类型"
      ].join("\n"))
    },

    "cpp-p84": {
      level: 3, title: "可变参数模板",
      body: "手写一个可变参数模板函数 print(args...)，打印任意数量和类型的参数。",
      hint: "递归展开：template<typename T, typename... Args> void print(T first, Args... rest);",
      solution: C("cpp", "variadic.cpp", [
        "template <typename T>",
        "void print(T val) { std::cout << val << std::endl; }",
        "template <typename T, typename... Args>",
        "void print(T first, Args... rest) {",
        "    std::cout << first << \" \";",
        "    print(rest...);",
        "}",
        "// print(1, 2.5, \"hello\", 'c');  // 全部打印"
      ].join("\n"))
    },

    "cpp-p85": {
      level: 3, title: "类型萃取：iterator_traits",
      body: "手写一个函数模板，通过 iterator_traits 获取迭代器的值类型。",
      hint: "typename std::iterator_traits<It>::value_type",
      solution: C("cpp", "traits.cpp", [
        "template <typename It>",
        "typename std::iterator_traits<It>::value_type",
        "sum(It begin, It end) {",
        "    typename std::iterator_traits<It>::value_type total{};",
        "    for (It it = begin; it != end; ++it) total += *it;",
        "    return total;",
        "}"
      ].join("\n"))
    },

    "cpp-p86": {
      level: 3, title: "std::unique_ptr 工厂函数",
      body: "手写 make_unique 的简化版实现。",
      hint: "template<typename T, typename... Args> unique_ptr<T> make_unique(Args&&... args);",
      solution: C("cpp", "make_unique.cpp", [
        "template <typename T, typename... Args>",
        "std::unique_ptr<T> my_make_unique(Args &&...args) {",
        "    return std::unique_ptr<T>(new T(std::forward<Args>(args)...));",
        "}"
      ].join("\n"))
    },

    "cpp-p87": {
      level: 3, title: "std::shared_ptr 的 make_shared",
      body: "解释为什么推荐用 make_shared 而不是 new + shared_ptr 构造。",
      hint: "make_shared 只分配一次内存（对象+控制块在一起），更高效。",
      solution: C("cpp", "make_shared.cpp", [
        "// 推荐：一次内存分配",
        "auto p1 = std::make_shared<Widget>(42);",
        "// 不推荐：两次内存分配（对象一次 + 控制块一次）",
        "std::shared_ptr<Widget> p2(new Widget(42));"
      ].join("\n"))
    },

    "cpp-p88": {
      level: 3, title: "std::bind 与函数适配",
      body: "用 std::bind 将一个三参数函数绑定成单参数函数。",
      hint: "auto f = std::bind(func, 1, std::placeholders::_1, 3); f(2); 等价于 func(1,2,3)",
      solution: C("cpp", "bind.cpp", [
        "#include <functional>",
        "int add3(int a, int b, int c) { return a + b + c; }",
        "auto add_1_3 = std::bind(add3, 1, std::placeholders::_1, 3);",
        "int result = add_1_3(2);  // 等价于 add3(1, 2, 3) = 6"
      ].join("\n"))
    },

    "cpp-p89": {
      level: 3, title: "std::async 与 future",
      body: "用 std::async 启动异步任务，用 future 获取结果。",
      hint: "auto fut = std::async(std::launch::async, func); int result = fut.get();",
      solution: C("cpp", "async.cpp", [
        "#include <future>",
        "int heavy_compute(int x) { return x * x; }",
        "auto fut = std::async(std::launch::async, heavy_compute, 42);",
        "// 做其他事...",
        "int result = fut.get();  // 阻塞直到完成，返回 1764"
      ].join("\n"))
    },

    "cpp-p90": {
      level: 3, title: "std::promise 与 future 配对",
      body: "手写 promise-future 配对：一个线程设置值，另一个线程获取。",
      hint: "promise 设置值，future 获取值。配对使用。",
      solution: C("cpp", "promise.cpp", [
        "#include <future>",
        "std::promise<int> prom;",
        "std::future<int> fut = prom.get_future();",
        "std::thread t([&prom] { prom.set_value(42); });",
        "int result = fut.get();  // 42",
        "t.join();"
      ].join("\n"))
    },

    "cpp-p91": {
      level: 2, title: "std::string 常用操作",
      body: "手写程序演示 string 的 substr、find、replace、append、+ 操作。",
      hint: "s.substr(pos, len)、s.find(\"str\")、s.replace(pos, len, \"new\")。",
      solution: C("cpp", "string_ops.cpp", [
        "std::string s = \"hello world\";",
        "std::string sub = s.substr(0, 5);     // \"hello\"",
        "size_t pos = s.find(\"world\");         // 6",
        "s.replace(0, 5, \"hi\");                // \"hi world\"",
        "s += \"!\";                             // 追加",
        "std::string t = s + \" again\";         // 拼接"
      ].join("\n"))
    },

    "cpp-p92": {
      level: 2, title: "std::stringstream 格式化",
      body: "用 stringstream 拼接多种类型的值成一个字符串。",
      hint: "ss << 42 << \" \" << 3.14; string s = ss.str();",
      solution: C("cpp", "stringstream.cpp", [
        "#include <sstream>",
        "std::stringstream ss;",
        "ss << \"x=\" << 42 << \", y=\" << 3.14 << \", name=\\\"RM\\\"\";",
        "std::string result = ss.str();"
      ].join("\n"))
    },

    "cpp-p93": {
      level: 2, title: "std::to_string 与 stoi/stod",
      body: "数值和字符串互转：to_string、stoi、stod、stol。",
      hint: "std::to_string(42) → \"42\"; std::stoi(\"42\") → 42。",
      solution: C("cpp", "num_str.cpp", [
        "std::string s1 = std::to_string(42);       // \"42\"",
        "std::string s2 = std::to_string(3.14);     // \"3.140000\"",
        "int i = std::stoi(\"42\");                  // 42",
        "double d = std::stod(\"3.14\");             // 3.14"
      ].join("\n"))
    },

    "cpp-p94": {
      level: 2, title: "容器选择指南",
      body: "对比 vector、list、deque、set、map、unordered_map 的时间复杂度和适用场景。",
      hint: "vector 随机访问 O(1)；list 插入 O(1)；unordered_map 查找 O(1) 平均。",
      solution: C("cpp", "container_guide.cpp", [
        "// vector:     随机访问 O(1)，尾部插入 O(1)，中间插入 O(n)",
        "// deque:      两端插入 O(1)，随机访问 O(1)",
        "// list:       任意位置插入 O(1)，不支持随机访问",
        "// set:        有序，查找 O(log n)",
        "// map:        有序键值对，查找 O(log n)",
        "// unordered_map: 无序，查找平均 O(1)",
        "// 选择原则：默认用 vector；需要两端操作用 deque；",
        "//           需要有序用 map/set；需要快速查找用 unordered_map"
      ].join("\n"))
    },

    "cpp-p95": {
      level: 3, title: "迭代器失效问题",
      body: "手写代码演示 vector 的迭代器失效场景，并给出正确做法。",
      hint: "push_back 导致 reallocation 后所有迭代器失效；erase 后当前迭代器失效。",
      solution: C("cpp", "iterator_invalidate.cpp", [
        "std::vector<int> v = {1, 2, 3, 4, 5};",
        "for (auto it = v.begin(); it != v.end();) {",
        "    if (*it % 2 == 0) it = v.erase(it);  // erase 返回下一个有效迭代器",
        "    else ++it;",
        "}",
        "// 错误：erase 后继续 ++it 就跳过了元素或访问已失效迭代器"
      ].join("\n"))
    },

    "cpp-p96": {
      level: 3, title: "reserve 优化 vector 性能",
      body: "对比有 reserve 和没有 reserve 的 vector push_back 性能差异。",
      hint: "reserve 预分配内存，避免反复 reallocation。",
      solution: C("cpp", "reserve.cpp", [
        "std::vector<int> v;",
        "v.reserve(10000);  // 预分配，避免 reallocation",
        "for (int i = 0; i < 10000; i++) v.push_back(i);",
        "// 没有 reserve：会反复 reallocation（1,2,4,8,16...）",
        "// 有 reserve：一次分配到位，性能提升明显"
      ].join("\n"))
    },

    "cpp-p97": {
      level: 3, title: "emplace_back vs push_back",
      body: "解释 emplace_back 和 push_back 的区别。什么时候用哪个？",
      hint: "emplace_back 原地构造，避免临时对象拷贝；push_back 先构造再拷贝/移动。",
      solution: C("cpp", "emplace.cpp", [
        "std::vector<std::string> v;",
        "v.push_back(std::string(\"hello\"));  // 构造临时对象，再移动",
        "v.emplace_back(\"hello\");            // 直接在 vector 内部构造，零拷贝"
      ].join("\n"))
    },

    "cpp-p98": {
      level: 3, title: "std::move 的正确用法",
      body: "手写代码演示 std::move 的作用和误用场景。",
      hint: "move 只是强制转换为右值引用，本身不移动任何东西。",
      solution: C("cpp", "move.cpp", [
        "std::string a = \"hello\";",
        "std::string b = std::move(a);  // a 现在是空字符串（移后状态）",
        "// 常见误用：",
        "std::string c = std::move(b);  // 没问题",
        "// c = b;                      // 编译错误？不，b 是空字符串",
        "// 对 const 对象 move 没有用：",
        "const std::string d = \"const\";",
        "std::string e = std::move(d);  // 实际是拷贝！const 对象不能移动"
      ].join("\n"))
    },

    "cpp-p99": {
      level: 3, title: "完美转发",
      body: "手写一个完美转发的包装函数，将参数原样转发给另一个函数。",
      hint: "template<typename T> void wrapper(T&& arg) { func(std::forward<T>(arg)); }",
      solution: C("cpp", "forward.cpp", [
        "template <typename T>",
        "void wrapper(T &&arg) {",
        "    process(std::forward<T>(arg));  // 完美转发：保持左值/右值属性",
        "}"
      ].join("\n"))
    },

    "cpp-p100": {
      level: 3, title: "std::reference_wrapper",
      body: "手写代码演示 reference_wrapper 的用法：在容器中存储引用。",
      hint: "vector 不能存引用，但可以存 reference_wrapper。",
      solution: C("cpp", "ref_wrapper.cpp", [
        "#include <functional>",
        "int a = 1, b = 2, c = 3;",
        "std::vector<std::reference_wrapper<int>> refs = {a, b, c};",
        "refs[0].get() = 100;  // a 现在是 100"
      ].join("\n"))
    }

  });
})();
