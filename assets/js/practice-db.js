/* ============================================================
   RM 兵工厂 · 手写题库 A（C / C++ / Python）
   单一数据源：课程页 H.pracRef(id) 引用；练习中心渲染全部
   ============================================================ */
(function (global) {
  "use strict";

  var C = H.code;

  global.PRACTICE_DB = global.PRACTICE_DB || {};

  function merge(db) {
    for (var k in db) {
      if (Object.prototype.hasOwnProperty.call(db, k)) {
        global.PRACTICE_DB[k] = db[k];
      }
    }
  }

  merge({

    /* ==================== C 语言 ==================== */
    "c-p1": {
      level: 1, title: "三变量排序（不许用数组）",
      body: "纸上手写函数 <code class='inline'>void sort3(int *a, int *b, int *c)</code>，调用后保证 *a≤*b≤*c。只用指针解引用和临时变量。",
      hint: "两两比较交换：a-b、a-c、b-c，三次就够。",
      solution: C("c", "answer.c", [
        "void sort3(int *a, int *b, int *c) {",
        "    int t;",
        "    if (*a > *b) { t = *a; *a = *b; *b = t; }",
        "    if (*a > *c) { t = *a; *a = *c; *c = t; }   /* *a 最小 */",
        "    if (*b > *c) { t = *b; *b = *c; *c = t; }",
        "}"
      ].join("\n"))
    },

    "c-p2": {
      level: 2, title: "手写 strlen / strcpy / strcmp 全家桶",
      body: "不许调用任何库函数，手写三个函数：<code class='inline'>size_t my_strlen(const char *s)</code>、<code class='inline'>char *my_strcpy(char *dst, const char *src)</code>、<code class='inline'>int my_strcmp(const char *a, const char *b)</code>。只用指针推进，不许用下标。",
      hint: "三个都是“走到 \\0 为止”；strcmp 逐字符比，不等时返回差值。",
      solution: C("c", "answer.c", [
        "size_t my_strlen(const char *s) {",
        "    const char *p = s;",
        "    while (*p) p++;",
        "    return (size_t)(p - s);       /* 指针差 = 元素个数 */",
        "}",
        "char *my_strcpy(char *dst, const char *src) {",
        "    char *ret = dst;",
        "    while ((*dst++ = *src++)) ;   /* 复制 \\0 后循环自然结束 */",
        "    return ret;",
        "}",
        "int my_strcmp(const char *a, const char *b) {",
        "    while (*a && *a == *b) { a++; b++; }",
        "    return (int)(unsigned char)*a - (int)(unsigned char)*b;",
        "}"
      ].join("\n"))
    },

    "c-p3": {
      level: 2, title: "反向遍历数组（只许用指针）",
      body: "手写 <code class='inline'>void print_reverse(const int *arr, size_t n)</code>，从最后一个元素倒着打印。不许用下标运算符 []。",
      hint: "从 p = arr + n - 1 出发往 arr 走；n==0 时不能碰 arr-1。",
      solution: C("c", "answer.c", [
        "void print_reverse(const int *arr, size_t n) {",
        "    if (n == 0) return;",
        "    const int *p = arr + n - 1;",
        "    while (p >= arr) {",
        "        printf(\"%d \", *p);",
        "        p--;",
        "    }",
        "    printf(\"\\n\");",
        "}"
      ].join("\n"))
    },

    "c-p4": {
      level: 2, title: "安全拼接字符串",
      body: "手写 <code class='inline'>int str_join(char *out, size_t out_size, const char *a, const char *b)</code>：把 a、b 拼进 out，保证绝不越界（含 \\0）。成功返回写入长度，空间不够返回 -1。",
      hint: "先算 strlen(a)+strlen(b)+1 是否超 out_size，再分两段 memcpy。",
      solution: C("c", "answer.c", [
        "#include <string.h>",
        "",
        "int str_join(char *out, size_t out_size, const char *a, const char *b) {",
        "    size_t la = strlen(a), lb = strlen(b);",
        "    if (la + lb + 1 > out_size) return -1;   /* +1 给 \\0 */",
        "    memcpy(out, a, la);",
        "    memcpy(out + la, b, lb + 1);             /* 连 b 的 \\0 一起拷 */",
        "    return (int)(la + lb);",
        "}"
      ].join("\n"))
    },

    "c-p5": {
      level: 3, title: "矩阵转置（堆上分配 + 双层释放）",
      body: "手写 <code class='inline'>int **matrix_transpose(int **m, int rows, int cols)</code>：在堆上分配 cols×rows 的结果并转置填充，返回新矩阵（调用方释放）。再手写配套 <code class='inline'>void matrix_free(int **m, int rows)</code>。",
      hint: "先 malloc 外层指针数组，再逐行 malloc。释放时逐行 free 再 free 外层。",
      solution: C("c", "answer.c", [
        "#include <stdlib.h>",
        "",
        "int **matrix_transpose(int **m, int rows, int cols) {",
        "    int **t = malloc(cols * sizeof(int *));",
        "    if (!t) return NULL;",
        "    for (int i = 0; i < cols; i++) {",
        "        t[i] = malloc(rows * sizeof(int));",
        "        if (!t[i]) {                          /* 半路失败要回滚 */",
        "            for (int k = 0; k < i; k++) free(t[k]);",
        "            free(t);",
        "            return NULL;",
        "        }",
        "        for (int j = 0; j < rows; j++)",
        "            t[i][j] = m[j][i];",
        "    }",
        "    return t;",
        "}",
        "void matrix_free(int **m, int rows) {",
        "    for (int i = 0; i < rows; i++) free(m[i]);",
        "    free(m);",
        "}"
      ].join("\n"))
    },

    "c-p6": {
      level: 2, title: "学生成绩结构体统计",
      body: "定义 <code class='inline'>typedef struct { char name[16]; int score; } Student;</code> 手写：<code class='inline'>float avg_score(const Student *s, int n)</code> 与 <code class='inline'>Student *find_top(const Student *s, int n)</code>（返回最高分学生的<b>指针</b>，不许拷贝结构体）。",
      hint: "find_top 记住当前最高分下标，最后返回 s + best。",
      solution: C("c", "answer.c", [
        "typedef struct { char name[16]; int score; } Student;",
        "",
        "float avg_score(const Student *s, int n) {",
        "    if (n <= 0) return 0.0f;",
        "    int sum = 0;",
        "    for (int i = 0; i < n; i++) sum += s[i].score;",
        "    return (float)sum / n;",
        "}",
        "Student *find_top(const Student *s, int n) {",
        "    if (n <= 0) return NULL;",
        "    int best = 0;",
        "    for (int i = 1; i < n; i++)",
        "        if (s[i].score > s[best].score) best = i;",
        "    return (Student *)(s + best);",
        "}"
      ].join("\n"))
    },

    "c-p7": {
      level: 1, title: "找 bug 之指针篇（3 处错误）",
      body: "纸上圈出 3 处错误并说明后果与修法：<br><code class='inline'>int* p; *p = 10; int a[2]={1,2}; p = a; p[2] = 5; free(p);</code>",
      hint: "未初始化 / 越界 / free 了栈内存。",
      solution: C("text", "answer", [
        "① int* p; *p = 10;  → 野指针解引用，写随机地址。先 p = NULL 并指向合法内存。",
        "② p[2] = 5;         → 数组只有 2 个元素，越界写。合法下标 0~1。",
        "③ free(p);          → p 指向栈上数组，free 非堆内存是 UB。删掉这行。"
      ].join("\n"))
    },

    "c-p8": {
      level: 3, title: "终极手写：默写 PID 模块",
      body: "合上网页，白纸默写 pid.h + pid.c（含积分限幅、输出限幅）。这是电控组的入门门槛题。",
      hint: "结构：struct 6 字段 → init（防御） → calc（误差→积分限幅→微分→合成→限幅）。",
      solution: C("text", "自评标准", [
        "满分标准：",
        "□ #pragma once + 完整类型定义",
        "□ init 有 if(!p) return 防御",
        "□ calc 顺序：误差→积分(限幅)→微分→合成→限幅",
        "□ float 字面量带 f",
        "□ const 区分读写意图",
        "□ 一遍编译通过、零警告",
        "全勾=练会；缺一项明天重默。"
      ].join("\n"))
    },

    "c-p9": {
      level: 2, title: "手写 memcpy（并说明 memmove 存在的原因）",
      body: "手写 <code class='inline'>void *my_memcpy(void *dst, const void *src, size_t n)</code>。要求：不重叠时正确；并回答为什么还需要 memmove。",
      hint: "逐字节拷贝即可；想想 src 与 dst 部分重叠、且 dst 在 src 前面时会发生什么。",
      solution: C("c", "answer.c", [
        "void *my_memcpy(void *dst, const void *src, size_t n) {",
        "    unsigned char *d = dst;",
        "    const unsigned char *s = src;",
        "    while (n--) *d++ = *s++;",
        "    return dst;",
        "}",
        "/* 重叠时：若 dst 区域覆盖了尚未拷贝的 src 数据，从头拷会毁掉源。",
        " * memmove 的做法：dst 在 src 之后 → 从尾部往前拷；否则从头拷。 */"
      ].join("\n"))
    },

    "c-p10": {
      level: 2, title: "手写 atoi（字符串转整数）",
      body: "手写 <code class='inline'>int my_atoi(const char *s)</code>：跳过前导空格、支持可选 +/- 号、逐位累加，遇非数字停止。",
      hint: "result = result*10 + (c - '0')。",
      solution: C("c", "answer.c", [
        "int my_atoi(const char *s) {",
        "    int sign = 1, result = 0;",
        "    while (*s == ' ') s++;",
        "    if (*s == '+' || *s == '-') {",
        "        if (*s == '-') sign = -1;",
        "        s++;",
        "    }",
        "    while (*s >= '0' && *s <= '9') {",
        "        result = result * 10 + (*s - '0');",
        "        s++;",
        "    }",
        "    return sign * result;",
        "}"
      ].join("\n"))
    },

    "c-p11": {
      level: 3, title: "双向链表：插入与删除",
      body: "定义 <code class='inline'>typedef struct DNode { int val; struct DNode *prev, *next; } DNode;</code> 手写：<code class='inline'>DNode *dlist_insert_after(DNode *pos, int val)</code>（堆分配新节点并接好前后指针）与 <code class='inline'>void dlist_remove(DNode *n)</code>（先接好邻居再 free）。",
      hint: "四根指针都要更新：n->prev、n->next、pos->next->prev、pos->next。画图！",
      solution: C("c", "answer.c", [
        "#include <stdlib.h>",
        "",
        "typedef struct DNode { int val; struct DNode *prev, *next; } DNode;",
        "",
        "DNode *dlist_insert_after(DNode *pos, int val) {",
        "    DNode *n = malloc(sizeof(DNode));",
        "    if (!n) return NULL;",
        "    n->val  = val;",
        "    n->prev = pos;",
        "    n->next = pos->next;",
        "    if (pos->next) pos->next->prev = n;",
        "    pos->next = n;",
        "    return n;",
        "}",
        "void dlist_remove(DNode *n) {",
        "    if (!n) return;",
        "    if (n->prev) n->prev->next = n->next;",
        "    if (n->next) n->next->prev = n->prev;",
        "    free(n);   /* 调用方负责把头指针置 NULL */",
        "}"
      ].join("\n"))
    },

    "c-p12": {
      level: 3, title: "CAN 报文解包（位运算实战）",
      body: "大疆电机反馈是 8 字节 CAN 帧。手写 <code class='inline'>int16_t can_to_i16(uint8_t hi, uint8_t lo)</code> 与 <code class='inline'>void motor_decode(const uint8_t data[8], Motor *m)</code>：data[0..1]=机械角 raw、data[2..3]=转速 raw、data[4..5]=转矩电流 raw。角度系数 0.000766990f，转速 rpm = raw × 0.732421875f。",
      hint: "(hi<<8)|lo 再强转 int16_t；负数靠符号位自然出现。",
      solution: C("c", "answer.c", [
        "#include <stdint.h>",
        "",
        "typedef struct { float position; float speed_rpm; float current; } Motor;",
        "",
        "int16_t can_to_i16(uint8_t hi, uint8_t lo) {",
        "    return (int16_t)((hi << 8) | lo);",
        "}",
        "void motor_decode(const uint8_t data[8], Motor *m) {",
        "    m->position  = (float)can_to_i16(data[0], data[1]) * 0.000766990f;",
        "    m->speed_rpm = (float)can_to_i16(data[2], data[3]) * 0.732421875f;",
        "    m->current   = (float)can_to_i16(data[4], data[5]);",
        "}"
      ].join("\n"))
    },

    "c-p13": {
      level: 2, title: "手写 memset 与 sizeof 陷阱",
      body: "手写 <code class='inline'>void *my_memset(void *s, int c, size_t n)</code>。然后回答：为什么 memset(p, 0, sizeof(p)) 对 char* p 是 bug？对数组 char buf[64] 又如何？",
      hint: "sizeof(指针) 只算出 4/8 字节；数组名在 sizeof 里不退化。",
      solution: C("c", "answer.c", [
        "void *my_memset(void *s, int c, size_t n) {",
        "    unsigned char *p = s;",
        "    unsigned char v = (unsigned char)c;",
        "    while (n--) *p++ = v;",
        "    return s;",
        "}",
        "/* sizeof(p) 是指针大小(4/8 字节)，只清了几个字节 → bug。",
        " * sizeof(buf) 是整个数组 64 字节 → 正确。",
        " * 结论：大小参数要么传数组本身（sizeof 不退化），要么显式传长度。 */"
      ].join("\n"))
    },

    "c-p14": {
      level: 3, title: "实战：环形缓冲区（单读单写）",
      body: "手写环形缓冲：<code class='inline'>typedef struct { uint8_t buf[256]; size_t head, tail; } RingBuf;</code>，提供 <code class='inline'>bool rb_push(RingBuf *rb, uint8_t v)</code>、<code class='inline'>bool rb_pop(RingBuf *rb, uint8_t *out)</code>。判满用“留一格空”方案。",
      hint: "满 = (head+1)%N == tail；空 = head == tail。",
      solution: C("c", "answer.c", [
        "#include <stdbool.h>",
        "#include <stdint.h>",
        "#include <stddef.h>",
        "",
        "#define RB_SIZE 256",
        "typedef struct { uint8_t buf[RB_SIZE]; size_t head, tail; } RingBuf;",
        "",
        "bool rb_push(RingBuf *rb, uint8_t v) {",
        "    size_t next = (rb->head + 1) % RB_SIZE;",
        "    if (next == rb->tail) return false;     /* 满 */",
        "    rb->buf[rb->head] = v;",
        "    rb->head = next;",
        "    return true;",
        "}",
        "bool rb_pop(RingBuf *rb, uint8_t *out) {",
        "    if (rb->head == rb->tail) return false; /* 空 */",
        "    *out = rb->buf[rb->tail];",
        "    rb->tail = (rb->tail + 1) % RB_SIZE;",
        "    return true;",
        "}"
      ].join("\n"))
    },

    "c-p15": {
      level: 3, title: "手写状态机：发射控制",
      body: "用 switch 状态机手写发射控制：状态 {SAFE, READY, SHOOTING, FAULT}；事件 {UNLOCK, TRIGGER, DONE, FAULT}。要求 SAFE 必须经过 UNLOCK 才能到 READY；FAULT 状态只有 UNLOCK 能复位。先画状态转移图再写代码。",
      hint: "合法转移：SAFE-UNLOCK→READY；READY-TRIGGER→SHOOTING；SHOOTING-DONE→READY；任意-FAULT→FAULT；FAULT-UNLOCK→SAFE。",
      solution: C("c", "answer.c", [
        "typedef enum { SAFE, READY, SHOOTING, FAULT } ShootState;",
        "typedef enum { EV_UNLOCK, EV_TRIGGER, EV_DONE, EV_FAULT } ShootEvent;",
        "",
        "ShootState shoot_fsm(ShootState st, ShootEvent ev) {",
        "    switch (st) {",
        "    case SAFE:",
        "        if (ev == EV_UNLOCK) return READY;",
        "        break;",
        "    case READY:",
        "        if (ev == EV_TRIGGER) return SHOOTING;",
        "        if (ev == EV_FAULT)   return FAULT;",
        "        break;",
        "    case SHOOTING:",
        "        if (ev == EV_DONE)  return READY;",
        "        if (ev == EV_FAULT) return FAULT;",
        "        break;",
        "    case FAULT:",
        "        if (ev == EV_UNLOCK) return SAFE;   /* 唯一复位路径 */",
        "        break;",
        "    }",
        "    return st;    /* 未匹配的事件：保持原状态 */",
        "}"
      ].join("\n"))
    },

    /* ==================== C++ ==================== */
    "cpp-p1": {
      level: 1, title: "值 / 引用 / 指针 三选一",
      body: "手写函数 <code class='inline'>void analyze(int x, int &amp;r, int *p)</code>：函数内 x+=1、r+=1、*p+=1。main 里 int a=1,b=2,c=3; 调用 analyze(a,b,&amp;c)，手写预测 a、b、c 各是多少，再上机验证。",
      hint: "x 是拷贝改不动原件；r 是别名改得动；p 要解引用。",
      solution: C("cpp", "answer.cpp", [
        "#include <cstdio>",
        "void analyze(int x, int &r, int *p) {",
        "    x += 1;     /* 改拷贝 */",
        "    r += 1;     /* 改本体（r 是 b 的别名） */",
        "    *p += 1;    /* 沿地址改本体 */",
        "}",
        "int main() {",
        "    int a = 1, b = 2, c = 3;",
        "    analyze(a, b, &c);",
        "    std::printf(\"%d %d %d\\n\", a, b, c);   /* 1 3 4 */",
        "}"
      ].join("\n"))
    },

    "cpp-p2": {
      level: 2, title: "string 与 char* 互相转换",
      body: "手写：① 从 const char* 构造 std::string 并追加文本；② 把 std::string 安全传给需要 const char* 的 C 函数（如 fopen）。",
      hint: "c_str() 返回的指针在 string 修改/析构后失效。",
      solution: C("cpp", "answer.cpp", [
        "#include <string>",
        "#include <cstdio>",
        "",
        "void demo(const char *cstr) {",
        "    std::string s = cstr;            /* ① char* → string */",
        "    s += \" - appended\";",
        "    std::printf(\"%s\\n\", s.c_str()); /* ② string → const char* */",
        "",
        "    FILE *f = std::fopen(s.c_str(), \"r\");  /* 传给 C API */",
        "    if (f) std::fclose(f);",
        "}"
      ].join("\n"))
    },

    "cpp-p3": {
      level: 2, title: "vector 增删查改全家桶",
      body: "手写代码：创建 vector&lt;int&gt;，push_back 10~50 五个数；范围 for 遍历打印；删除所有偶数（20、40）；最后打印 size 和 capacity，观察容量增长规律。",
      hint: "删除时用 it = v.erase(it) 防迭代器失效。",
      solution: C("cpp", "answer.cpp", [
        "#include <vector>",
        "#include <cstdio>",
        "",
        "int main() {",
        "    std::vector<int> v;",
        "    for (int i = 1; i <= 5; i++) v.push_back(i * 10);",
        "",
        "    for (int x : v) std::printf(\"%d \", x);   /* 10 20 30 40 50 */",
        "    std::printf(\"\\n\");",
        "",
        "    for (auto it = v.begin(); it != v.end(); ) {",
        "        if (*it % 20 == 0) it = v.erase(it);   /* erase 返回下一个 */",
        "        else ++it;",
        "    }",
        "    std::printf(\"size=%zu\\n\", v.size());      /* 3 */",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    "cpp-p4": {
      level: 3, title: "手写类：Motor + RAII 文件守卫",
      body: "① 手写 Motor 类（id、PID 参数、积分状态），构造函数初始化，update(target, feedback) 返回 PID 输出；② 手写 FileGuard 类：构造 fopen、析构 fclose，禁用拷贝，验证作用域结束自动关闭。",
      hint: "析构函数是 RAII 的扳机；禁拷贝防 double close。",
      solution: C("cpp", "answer.cpp", [
        "#include <cstdio>",
        "#include <cstdint>",
        "",
        "class Motor {",
        "public:",
        "    explicit Motor(std::uint16_t id) : id_(id), integ_(0), prev_err_(0) {}",
        "    float update(float target, float feedback) {",
        "        float err = target - feedback;",
        "        integ_ += err;",
        "        if (integ_ >  10.f) integ_ =  10.f;    /* 积分限幅 */",
        "        if (integ_ < -10.f) integ_ = -10.f;",
        "        float d = err - prev_err_;",
        "        prev_err_ = err;",
        "        return kp_ * err + ki_ * integ_ + kd_ * d;",
        "    }",
        "private:",
        "    std::uint16_t id_;",
        "    float kp_ = 10.f, ki_ = 0.5f, kd_ = 0.f;",
        "    float integ_, prev_err_;",
        "};",
        "",
        "class FileGuard {",
        "public:",
        "    explicit FileGuard(const char *path) : f_(std::fopen(path, \"a\")) {}",
        "    ~FileGuard() { if (f_) std::fclose(f_); }   /* RAII 自动关 */",
        "",
        "    FileGuard(const FileGuard&) = delete;             /* 禁拷贝 */",
        "    FileGuard& operator=(const FileGuard&) = delete;",
        "",
        "    bool ok() const { return f_ != nullptr; }",
        "private:",
        "    std::FILE *f_;",
        "};"
      ].join("\n"))
    },

    "cpp-p5": {
      level: 3, title: "unique_ptr 管理串口设备",
      body: "手写 SerialDevice 类（构造打印 open、析构打印 close、send 成员函数），用 std::make_unique 创建并调用；再手写工厂函数 open_serial() 返回 unique_ptr&lt;SerialDevice&gt;，验证所有权移交。",
      hint: "unique_ptr 不能拷贝只能移动；工厂返回时所有权自动移交。",
      solution: C("cpp", "answer.cpp", [
        "#include <memory>",
        "#include <cstdio>",
        "",
        "class SerialDevice {",
        "public:",
        "    explicit SerialDevice(const char *name) { std::printf(\"open %s\\n\", name); }",
        "    ~SerialDevice() { std::printf(\"close\\n\"); }   /* 自动释放 */",
        "    void send(const char *s) { std::printf(\"send %s\\n\", s); }",
        "};",
        "",
        "std::unique_ptr<SerialDevice> open_serial(const char *name) {",
        "    return std::make_unique<SerialDevice>(name);  /* 所有权移交调用者 */",
        "}",
        "",
        "int main() {",
        "    auto dev = open_serial(\"ttyUSB0\");",
        "    dev->send(\"hello\");",
        "    return 0;   /* dev 离开作用域自动 close —— RAII */",
        "}"
      ].join("\n"))
    },

    "cpp-p6": {
      level: 2, title: "lambda 捕获实练：按值 vs 按引用",
      body: "int base = 100; 手写两个 lambda：f1 = [base]() { return base + 1; } 与 f2 = [&amp;base]() { return base + 1; }。把 base 改成 200 再分别调用，手写预测输出，再上机验证。",
      hint: "按值捕获在创建那一刻拍照；按引用捕获始终看本体。",
      solution: C("cpp", "answer.cpp", [
        "#include <cstdio>",
        "int main() {",
        "    int base = 100;",
        "    auto f1 = [base]()  { return base + 1; };  /* 拍照 */",
        "    auto f2 = [&base]() { return base + 1; };  /* 直播 */",
        "    base = 200;",
        "    std::printf(\"%d %d\\n\", f1(), f2());   /* 101 201 */",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    "cpp-p7": {
      level: 2, title: "std::sort + lambda 排序装甲板",
      body: "有 vector&lt;Armor&gt;（字段：面积 area、距离 dist）。手写：① 按面积降序排序；② 优先距离小于 3m 的，同组内距离近者优先，再同则面积大优先。用 std::sort + lambda 比较器。",
      hint: "比较器返回 true 表示 a 排前面；必须严格弱序，别写 a&gt;=b。",
      solution: C("cpp", "answer.cpp", [
        "#include <vector>",
        "#include <algorithm>",
        "#include <cstdio>",
        "",
        "struct Armor { float area; float dist; };",
        "",
        "int main() {",
        "    std::vector<Armor> armors = { {12.f,4.f}, {8.f,2.5f}, {15.f,2.f}, {6.f,5.f} };",
        "",
        "    /* ① 面积降序 */",
        "    std::sort(armors.begin(), armors.end(),",
        "              [](const Armor &a, const Armor &b) { return a.area > b.area; });",
        "",
        "    /* ② 近距离(<3m)优先 → 距离近优先 → 面积大优先 */",
        "    std::sort(armors.begin(), armors.end(),",
        "              [](const Armor &a, const Armor &b) {",
        "                  bool an = a.dist < 3.f, bn = b.dist < 3.f;",
        "                  if (an != bn) return an;",
        "                  if (a.dist != b.dist) return a.dist < b.dist;",
        "                  return a.area > b.area;",
        "              });",
        "",
        "    for (auto &a : armors)",
        "        std::printf(\"area=%.1f dist=%.1f\\n\", a.area, a.dist);",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    "cpp-p8": {
      level: 3, title: "手写模板 RingBuffer（类模板）",
      body: "手写 <code class='inline'>template&lt;typename T, size_t N&gt; class RingBuffer</code>，提供 push(T)→bool、pop(T&amp;)→bool、size()。删除拷贝构造防意外复制。",
      hint: "满：(head+1)%N==tail；空：head==tail。",
      solution: C("cpp", "answer.cpp", [
        "#include <cstddef>",
        "#include <cstdio>",
        "",
        "template <typename T, std::size_t N>",
        "class RingBuffer {",
        "public:",
        "    bool push(const T &v) {",
        "        std::size_t next = (head_ + 1) % N;",
        "        if (next == tail_) return false;",
        "        buf_[head_] = v;",
        "        head_ = next;",
        "        return true;",
        "    }",
        "    bool pop(T &out) {",
        "        if (head_ == tail_) return false;",
        "        out = buf_[tail_];",
        "        tail_ = (tail_ + 1) % N;",
        "        return true;",
        "    }",
        "    std::size_t size() const { return (head_ + N - tail_) % N; }",
        "",
        "    RingBuffer(const RingBuffer&) = delete;",
        "    RingBuffer& operator=(const RingBuffer&) = delete;",
        "private:",
        "    T buf_[N]{};",
        "    std::size_t head_ = 0, tail_ = 0;",
        "};",
        "",
        "int main() {",
        "    RingBuffer<int, 8> rb;",
        "    for (int i = 0; i < 10; i++) rb.push(i);",
        "    int v;",
        "    while (rb.pop(v)) std::printf(\"%d \", v);   /* 0 1 2 3 4 5 6 7 */",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    "cpp-p9": {
      level: 3, title: "手写线程安全队列（mutex + condition_variable）",
      body: "手写 ThreadSafeQueue&lt;T&gt;：push(T) 上锁入队并 notify_one；pop_wait(T&amp;, timeout_ms) 持锁等待非空再弹出。理解“锁保护数据、条件变量管时序”。",
      hint: "wait_for(unique_lock, timeout, pred) 防虚假唤醒。",
      solution: C("cpp", "answer.cpp", [
        "#include <deque>",
        "#include <mutex>",
        "#include <condition_variable>",
        "#include <chrono>",
        "",
        "template <typename T>",
        "class ThreadSafeQueue {",
        "public:",
        "    void push(const T &v) {",
        "        {",
        "            std::lock_guard<std::mutex> lk(mtx_);",
        "            q_.push_back(v);",
        "        }                     /* 先解锁再 notify，避免无效唤醒 */",
        "        cv_.notify_one();",
        "    }",
        "    bool pop_wait(T &out, int timeout_ms) {",
        "        std::unique_lock<std::mutex> lk(mtx_);",
        "        bool ok = cv_.wait_for(lk,",
        "            std::chrono::milliseconds(timeout_ms),",
        "            [this] { return !q_.empty(); });",
        "        if (!ok) return false;",
        "        out = q_.front();",
        "        q_.pop_front();",
        "        return true;",
        "    }",
        "private:",
        "    std::deque<T> q_;",
        "    std::mutex mtx_;",
        "    std::condition_variable cv_;",
        "};"
      ].join("\n"))
    },

    "cpp-p10": {
      level: 2, title: "手写 EventBus（std::function 回调注册表）",
      body: "手写事件中心：map&lt;string, vector&lt;function&lt;void(int)&gt;&gt;&gt; 订阅表。on(name, cb) 注册回调；emit(name, arg) 依次调用。用 lambda 测试两个订阅者。",
      hint: "std::function 是“任何能像函数一样调用的东西”的容器。",
      solution: C("cpp", "answer.cpp", [
        "#include <map>",
        "#include <vector>",
        "#include <string>",
        "#include <functional>",
        "#include <cstdio>",
        "",
        "class EventBus {",
        "public:",
        "    void on(const std::string &name, std::function<void(int)> cb) {",
        "        subs_[name].push_back(std::move(cb));",
        "    }",
        "    void emit(const std::string &name, int arg) {",
        "        auto it = subs_.find(name);",
        "        if (it == subs_.end()) return;",
        "        for (auto &cb : it->second) cb(arg);",
        "    }",
        "private:",
        "    std::map<std::string, std::vector<std::function<void(int)>>> subs_;",
        "};",
        "",
        "int main() {",
        "    EventBus bus;",
        "    bus.on(\"hit\", [](int v) { std::printf(\"A got %d\\n\", v); });",
        "    bus.on(\"hit\", [](int v) { std::printf(\"B got %d\\n\", v); });",
        "    bus.emit(\"hit\", 42);",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    "cpp-p11": {
      level: 2, title: "C++ 现代 cast 三兄弟",
      body: "给定基类 Base（有虚函数）与派生 Derived。手写：① Base* → Derived* 安全下转；② void* ↔ T* 转换；③ 去掉 const。说明每个 cast 的使用场景。",
      hint: "dynamic_cast 多态下转（失败得 nullptr）；static_cast 数值/相关类型；const_cast 去常量。",
      solution: C("cpp", "answer.cpp", [
        "#include <cstdio>",
        "",
        "struct Base { virtual ~Base() = default; };",
        "struct Derived : Base { void hello() { std::printf(\"Derived\\n\"); } };",
        "",
        "int main() {",
        "    Base *b = new Derived;",
        "",
        "    /* ① 多态安全下转：失败返回 nullptr（要求基类有虚函数） */",
        "    if (Derived *d = dynamic_cast<Derived*>(b)) d->hello();",
        "",
        "    /* ② 相关类型转换（数值、void*↔T*） */",
        "    double pi = 3.14;",
        "    int truncated = static_cast<int>(pi);",
        "",
        "    /* ③ 位重解释：几乎不用 */",
        "    void *raw = static_cast<void*>(b);",
        "",
        "    /* ④ 去常量：仅用于“确定原对象非 const”的场景 */",
        "    const char *cs = \"hi\";",
        "    char *mut = const_cast<char*>(cs);",
        "    (void)mut;",
        "",
        "    delete b;",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    "cpp-p12": {
      level: 3, title: "手写 shared_ptr 计数原理（简化版）",
      body: "手写简化 ControlBlock{ long refs; T *ptr; } 与 SharedPtr&lt;T&gt;：构造计数 1、拷贝 +1、析构 -1 到 0 释放。理解为什么析构要“先减后判”。",
      hint: "析构 -1 后为 0：delete ptr、delete 控制块。",
      solution: C("cpp", "answer.cpp", [
        "#include <cstdio>",
        "",
        "template <typename T>",
        "struct ControlBlock {",
        "    long refs = 1;",
        "    T *ptr = nullptr;",
        "};",
        "",
        "template <typename T>",
        "class SharedPtr {",
        "public:",
        "    explicit SharedPtr(T *p = nullptr)",
        "        : cb_(p ? new ControlBlock<T>{1, p} : nullptr) {}",
        "",
        "    SharedPtr(const SharedPtr &o) : cb_(o.cb_) {   /* 拷贝 +1 */",
        "        if (cb_) cb_->refs++;",
        "    }",
        "    SharedPtr& operator=(const SharedPtr &o) {",
        "        if (this != &o) {",
        "            release();",
        "            cb_ = o.cb_;",
        "            if (cb_) cb_->refs++;",
        "        }",
        "        return *this;",
        "    }",
        "    ~SharedPtr() { release(); }                     /* 析构 -1 */",
        "",
        "    T* get() const { return cb_ ? cb_->ptr : nullptr; }",
        "    long use_count() const { return cb_ ? cb_->refs : 0; }",
        "",
        "private:",
        "    void release() {",
        "        if (!cb_) return;",
        "        if (--cb_->refs == 0) {     /* 先减后判 */",
        "            delete cb_->ptr;",
        "            delete cb_;",
        "        }",
        "        cb_ = nullptr;",
        "    }",
        "    ControlBlock<T> *cb_;",
        "};"
      ].join("\n"))
    },

    "cpp-p13": {
      level: 3, title: "手写 PublisherWrapper（ROS 2 风格）",
      body: "手写 PublisherWrapper&lt;MsgT&gt; 包装 rclcpp::Publisher&lt;MsgT&gt;::SharedPtr：构造存句柄，publish(MsgT) 判空后发布，count_subscribers() 报告订阅数。体会“智能指针 + 回调”的 ROS 2 风格。",
      hint: "成员用 SharedPtr；publish 前判空。",
      solution: C("cpp", "answer.cpp", [
        "#include <rclcpp/rclcpp.hpp>",
        "#include <string>",
        "",
        "template <typename MsgT>",
        "class PublisherWrapper {",
        "public:",
        "    PublisherWrapper(rclcpp::Node::SharedPtr node,",
        "                     const std::string &topic, size_t depth = 10)",
        "        : pub_(node->create_publisher<MsgT>(topic, depth)) {}",
        "",
        "    void publish(const MsgT &msg) {",
        "        if (!pub_) return;                  /* 句柄失效防御 */",
        "        pub_->publish(msg);",
        "    }",
        "    size_t count_subscribers() const {",
        "        return pub_ ? pub_->get_subscription_count() : 0;",
        "    }",
        "private:",
        "    typename rclcpp::Publisher<MsgT>::SharedPtr pub_;",
        "};"
      ].join("\n"))
    },

    "cpp-p14": {
      level: 3, title: "手写多态 Target 基类（视觉选靶）",
      body: "手写抽象基类 Target { virtual void draw() = 0; virtual ~Target() = default; } 与派生 ArmorTarget / RuneTarget。用 vector&lt;unique_ptr&lt;Target&gt;&gt; 多态容器分别调用 draw()。回答：为什么基类析构必须 virtual？",
      hint: "不 virtual 的析构：delete 基类指针不会调派生类析构 → 资源泄漏。",
      solution: C("cpp", "answer.cpp", [
        "#include <memory>",
        "#include <vector>",
        "#include <cstdio>",
        "",
        "struct Target {",
        "    virtual void draw() = 0;          /* 纯虚：抽象类不能实例化 */",
        "    virtual ~Target() = default;      /* 虚析构：delete 基类指针能调到派生析构 */",
        "};",
        "",
        "struct ArmorTarget : Target {",
        "    void draw() override { std::printf(\"draw armor\\n\"); }",
        "};",
        "struct RuneTarget : Target {",
        "    void draw() override { std::printf(\"draw rune\\n\"); }",
        "};",
        "",
        "int main() {",
        "    std::vector<std::unique_ptr<Target>> ts;",
        "    ts.push_back(std::make_unique<ArmorTarget>());",
        "    ts.push_back(std::make_unique<RuneTarget>());",
        "    for (auto &t : ts) t->draw();     /* 运行时按实际类型分发 */",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    /* ==================== Python ==================== */
    "py-p1": {
      level: 1, title: "温度换算交互器",
      body: "手写脚本：input 读摄氏温度，try/except 处理非法输入，输出华氏。循环直到输入 q 退出。",
      hint: "float(input()) 会抛 ValueError；while True + break。",
      solution: C("python", "answer.py", [
        "while True:",
        "    s = input('摄氏温度(q 退出): ').strip()",
        "    if s.lower() == 'q':",
        "        break",
        "    try:",
        "        c = float(s)",
        "    except ValueError:",
        "        print('不是数字，重来')",
        "        continue",
        "    print(f'{c}°C = {c * 9 / 5 + 32:.1f}°F')"
      ].join("\n"))
    },

    "py-p2": {
      level: 2, title: "列表与推导式：过滤 + 变换",
      body: "给定 nums = [3, -1, 4, -1, 5, -9, 2, 6]。手写：① 普通循环版本收集“正偶数的平方”；② 推导式一行版。期望输出 [16, 4, 4, 36]。",
      hint: "推导式：[x*x for x in nums if x > 0 and x % 2 == 0]。",
      solution: C("python", "answer.py", [
        "nums = [3, -1, 4, -1, 5, -9, 2, 6]",
        "",
        "# ① 循环版",
        "result = []",
        "for x in nums:",
        "    if x > 0 and x % 2 == 0:",
        "        result.append(x * x)",
        "",
        "# ② 推导式版",
        "result = [x * x for x in nums if x > 0 and x % 2 == 0]",
        "print(result)   # [16, 4, 4, 36]"
      ].join("\n"))
    },

    "py-p3": {
      level: 2, title: "词频统计（字典核心训练）",
      body: "输入一段英文，手写统计每个单词出现次数，输出最多的 3 个词。先不用 collections，手写 dict 版本。",
      hint: "d.get(word, 0) + 1 是字典计数的灵魂；sorted(key=lambda kv: -kv[1])。",
      solution: C("python", "answer.py", [
        "text = 'the quick brown fox jumps over the lazy dog the end'",
        "words = text.split()",
        "",
        "count = {}",
        "for w in words:",
        "    count[w] = count.get(w, 0) + 1     # 缺省 0",
        "",
        "top3 = sorted(count.items(), key=lambda kv: kv[1], reverse=True)[:3]",
        "for word, n in top3:",
        "    print(f'{word}: {n}')"
      ].join("\n"))
    },

    "py-p4": {
      level: 2, title: "手写读文件统计行数/字数",
      body: "手写脚本统计一个文本文件的总行数、空行数、单词总数。用 with open(...) as f 处理关闭。",
      hint: "with 保证自动 close；空行：line.strip() == ''。",
      solution: C("python", "answer.py", [
        "path = 'demo.txt'",
        "total = blank = words = 0",
        "with open(path, encoding='utf-8') as f:   # 出作用域自动关",
        "    for line in f:",
        "        total += 1",
        "        if not line.strip():",
        "            blank += 1",
        "        words += len(line.split())",
        "print(f'lines={total} blank={blank} words={words}')"
      ].join("\n"))
    },

    "py-p5": {
      level: 3, title: "学生排序与二分查找",
      body: "手写 Student dataclass：name、score。读入若干学生，按 score 降序输出前 3 名；再手写 binary_search(students, score) 查找等于某分数的学生下标（找不到返回 -1）。",
      hint: "sorted(key=lambda s: -s.score)；二分前必须已按分数排序。",
      solution: C("python", "answer.py", [
        "from dataclasses import dataclass",
        "",
        "@dataclass",
        "class Student:",
        "    name: str",
        "    score: int",
        "",
        "students = [Student('A', 88), Student('B', 95),",
        "            Student('C', 72), Student('D', 95)]",
        "",
        "students.sort(key=lambda s: -s.score)      # 降序",
        "print([f'{s.name}:{s.score}' for s in students[:3]])",
        "",
        "def binary_search(arr, score):",
        "    lo, hi = 0, len(arr) - 1",
        "    while lo <= hi:",
        "        mid = (lo + hi) // 2",
        "        if arr[mid].score == score:",
        "            return mid",
        "        elif arr[mid].score < score:   # 降序数组：大的在前",
        "            hi = mid - 1",
        "        else:",
        "            lo = mid + 1",
        "    return -1",
        "",
        "print(binary_search(students, 88))   # 2"
      ].join("\n"))
    },

    "py-p6": {
      level: 3, title: "手写 Deque 双端队列（list 模拟）",
      body: "用 list 手写 Deque 类：append / appendleft / pop / popleft / rotate。并回答：list 头部插入为什么是 O(n)？",
      hint: "list.insert(0, x) 每次搬移所有元素；collections.deque 底层是分块链表。",
      solution: C("python", "answer.py", [
        "class Deque:",
        "    def __init__(self):",
        "        self.data = []",
        "",
        "    def append(self, x):     self.data.append(x)",
        "    def appendleft(self, x): self.data.insert(0, x)   # O(n)！",
        "    def pop(self):           return self.data.pop()",
        "    def popleft(self):       return self.data.pop(0)   # O(n)！",
        "",
        "    def rotate(self, k):",
        "        if not self.data:",
        "            return",
        "        k %= len(self.data)",
        "        if k:",
        "            self.data = self.data[-k:] + self.data[:-k]",
        "",
        "d = Deque()",
        "d.append(1); d.append(2); d.appendleft(0)",
        "print(d.data)      # [0, 1, 2]",
        "d.rotate(1)",
        "print(d.data)      # [2, 0, 1]"
      ].join("\n"))
    },

    "py-p7": {
      level: 3, title: "手写单例模式（装饰器实现）",
      body: "手写 singleton 装饰器：被装饰的类只允许实例化一次，之后返回同一实例。用 id() 验证两次实例化是同一个对象。",
      hint: "instances 字典缓存；cls(*args, **kwargs)。",
      solution: C("python", "answer.py", [
        "def singleton(cls):",
        "    instances = {}",
        "    def wrapper(*args, **kwargs):",
        "        if cls not in instances:",
        "            instances[cls] = cls(*args, **kwargs)",
        "        return instances[cls]",
        "    return wrapper",
        "",
        "@singleton",
        "class Config:",
        "    def __init__(self):",
        "        self.robot_ip = '192.168.1.30'",
        "",
        "c1 = Config()",
        "c2 = Config()",
        "print(id(c1) == id(c2))   # True"
      ].join("\n"))
    },

    "py-p8": {
      level: 2, title: "绘制 PID 阶跃响应曲线",
      body: "手写脚本：纯 Python 模拟一阶惯性环节 G(s)=1/(s+1)（欧拉离散化）加 PID 控制，matplotlib 画 500 步阶跃响应。改 Kp/Ki/Kd 观察曲线变化。",
      hint: "y[k+1] = y[k] + dt*(u - y[k])；u = Kp*e + Ki*Σe*dt + Kd*Δe/dt。",
      solution: C("python", "answer.py", [
        "import matplotlib.pyplot as plt",
        "",
        "Kp, Ki, Kd = 1.2, 0.4, 0.05",
        "target = 1.0",
        "dt = 0.01",
        "",
        "y, integ, prev_err, ys = 0.0, 0.0, 0.0, []",
        "for k in range(500):",
        "    err = target - y",
        "    integ += err * dt",
        "    deriv = (err - prev_err) / dt",
        "    prev_err = err",
        "    u = Kp * err + Ki * integ + Kd * deriv",
        "    y += dt * (u - y)          # 一阶系统欧拉积分",
        "    ys.append(y)",
        "",
        "plt.plot(ys)",
        "plt.xlabel('k'); plt.ylabel('y'); plt.title('PID step response')",
        "plt.grid(True)",
        "plt.savefig('pid_step.png', dpi=120)",
        "print('saved pid_step.png')"
      ].join("\n"))
    },

    "py-p9": {
      level: 2, title: "手写灰度化 + 二值化（纯 Python）",
      body: "用纯 Python（不用 NumPy）把一张 RGB 图（list 嵌套 list，每像素 [r,g,b]）转灰度并二值化。灰度公式 0.299r+0.587g+0.114b；阈值 127。",
      hint: "嵌套推导式：[[... for px in row] for row in img]。",
      solution: C("python", "answer.py", [
        "img = [[[255,0,0],[0,255,0]],[[0,0,255],[128,128,128]]]",
        "",
        "gray = [[0.299*px[0] + 0.587*px[1] + 0.114*px[2] for px in row] for row in img]",
        "binary = [[1 if g > 127 else 0 for g in row] for row in gray]",
        "",
        "for row in binary:",
        "    print(row)   # 红、绿、灰为亮(1)，蓝为暗(0)"
      ].join("\n"))
    },

    "py-p10": {
      level: 2, title: "手写灰度直方图统计",
      body: "对一张灰度图（嵌套 list）统计 0~255 每个灰度级的像素个数，输出出现最多的灰度值。",
      hint: "hist = [0]*256；hist[g] += 1。",
      solution: C("python", "answer.py", [
        "gray = [[10, 20, 200], [200, 200, 10], [10, 10, 10]]",
        "",
        "hist = [0] * 256",
        "for row in gray:",
        "    for g in row:",
        "        hist[g] += 1",
        "",
        "peak = max(range(256), key=lambda g: hist[g])",
        "print(f'peak gray = {peak}, count = {hist[peak]}')   # 10, 4 次"
      ].join("\n"))
    },

    "py-p11": {
      level: 3, title: "手写一维离散卷积（same 模式）",
      body: "手写 conv1d_same(x, kernel)：输出与输入等长（两端补零）。x=[1,2,3,4,5]，kernel=[1,0,-1]。手算一遍再验证，理解卷积在图像处理中的本质。",
      hint: "y[i] = Σ x[i+j-half]*kernel[j]，越界按 0。",
      solution: C("python", "answer.py", [
        "def conv1d_same(x, kernel):",
        "    k = len(kernel)",
        "    half = k // 2",
        "    out = []",
        "    for i in range(len(x)):",
        "        acc = 0",
        "        for j in range(k):",
        "            idx = i + j - half",
        "            if 0 <= idx < len(x):",
        "                acc += x[idx] * kernel[j]",
        "        out.append(acc)",
        "    return out",
        "",
        "print(conv1d_same([1, 2, 3, 4, 5], [1, 0, -1]))   # [-1, -2, -2, -2, 1]"
      ].join("\n"))
    },

    "py-p12": {
      level: 3, title: "手写欧拉角 ⇄ 旋转矩阵（视觉坐标变换打底）",
      body: "手写 euler_to_rotmat(roll, pitch, yaw) 返回 3×3 旋转矩阵（嵌套 list）：R = Rz(yaw)·Ry(pitch)·Rx(roll)。再手写 rotmat_to_euler(R) 反解。用 [0.1, 0.2, 0.3] 验证往返一致。",
      hint: "Rx=[[1,0,0],[0,c,-s],[0,s,c]]；Ry=[[c,0,s],[0,1,0],[-s,0,c]]；Rz=[[c,-s,0],[s,c,0],[0,0,1]]。反解用 asin/atan2。",
      solution: C("python", "answer.py", [
        "import math",
        "",
        "def matmul(A, B):",
        "    return [[sum(A[i][k]*B[k][j] for k in range(3)) for j in range(3)] for i in range(3)]",
        "",
        "def euler_to_rotmat(roll, pitch, yaw):",
        "    cr, sr = math.cos(roll), math.sin(roll)",
        "    cp, sp = math.cos(pitch), math.sin(pitch)",
        "    cy, sy = math.cos(yaw), math.sin(yaw)",
        "    Rx = [[1,0,0],[0,cr,-sr],[0,sr,cr]]",
        "    Ry = [[cp,0,sp],[0,1,0],[-sp,0,cp]]",
        "    Rz = [[cy,-sy,0],[sy,cy,0],[0,0,1]]",
        "    return matmul(matmul(Rz, Ry), Rx)    # R = Rz·Ry·Rx",
        "",
        "def rotmat_to_euler(R):",
        "    pitch = -math.asin(max(-1, min(1, R[2][0])))",
        "    roll  = math.atan2(R[2][1], R[2][2])",
        "    yaw   = math.atan2(R[1][0], R[0][0])",
        "    return roll, pitch, yaw",
        "",
        "R = euler_to_rotmat(0.1, 0.2, 0.3)",
        "print(rotmat_to_euler(R))   # ≈ (0.1, 0.2, 0.3)"
      ].join("\n"))
    },

    "py-p13": {
      level: 3, title: "手写 Dijkstra 最短路径",
      body: "手写 Dijkstra（朴素 O(V²) 版）：图用邻接字典 {节点: [(邻居, 权重), ...]}。给定起点，输出到所有点的最短距离。用小图验证。",
      hint: "每轮从未访问点中选 dist 最小的；dist[v] = min(dist[v], dist[u]+w)。",
      solution: C("python", "answer.py", [
        "graph = {",
        "    'A': [('B', 1), ('C', 4)],",
        "    'B': [('A', 1), ('C', 2), ('D', 5)],",
        "    'C': [('A', 4), ('B', 2), ('D', 1)],",
        "    'D': [('B', 5), ('C', 1)],",
        "}",
        "",
        "def dijkstra(graph, start):",
        "    dist = {v: math.inf for v in graph}",
        "    dist[start] = 0",
        "    visited = set()",
        "    while len(visited) < len(graph):",
        "        u = min((v for v in graph if v not in visited),",
        "                key=lambda v: dist[v])",
        "        if dist[u] == math.inf:",
        "            break",
        "        visited.add(u)",
        "        for v, w in graph[u]:",
        "            if dist[u] + w < dist[v]:",
        "                dist[v] = dist[u] + w",
        "    return dist",
        "",
        "print(dijkstra(graph, 'A'))   # {'A':0, 'B':1, 'C':3, 'D':4}"
      ].join("\n"))
    }
  });
})(window);
