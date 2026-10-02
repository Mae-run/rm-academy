/* RM 兵工厂 · 手写练习题库（总扩容卷 G）
 * C / C++ / Python / ROS2 / 电控 / 视觉 混合补充，冲总量 720+
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

    /* ==================== C 语言 · 补充 G 卷 ==================== */

    "c-g1": {
      level: 1, title: "G卷·C：三个数排序",
      body: "手写函数将三个整数从小到大排序（传指针）。",
      hint: "两两比较交换，三次搞定。",
      solution: C("c", "g1_sort3.c", [
        "void sort3(int *a, int *b, int *c) {",
        "    int t;",
        "    if (*a > *b) { t=*a; *a=*b; *b=t; }",
        "    if (*a > *c) { t=*a; *a=*c; *c=t; }",
        "    if (*b > *c) { t=*b; *b=*c; *c=t; }",
        "}"
      ].join("\n"))
    },

    "c-g2": {
      level: 1, title: "G卷·C：判断字符大小写并转换",
      body: "手写函数 to_upper(char c)：如果是小写字母返回大写，否则原样返回。",
      hint: "小写 'a'-'z'，大写 = 小写 - 32（或 & ~0x20）。",
      solution: C("c", "g2_to_upper.c", [
        "char to_upper(char c) {",
        "    if (c >= 'a' && c <= 'z') return c - 32;",
        "    return c;",
        "}"
      ].join("\n"))
    },

    "c-g3": {
      level: 1, title: "G卷·C：计算三角形面积（海伦公式）",
      body: "手写函数用海伦公式计算三角形面积：输入三边长，不合法返回 -1。",
      hint: "s=(a+b+c)/2; area=sqrt(s(s-a)(s-b)(s-c))。先检查两边之和大于第三边。",
      solution: C("c", "g3_heron.c", [
        "#include <math.h>",
        "double triangle_area(double a, double b, double c) {",
        "    if (a + b <= c || a + c <= b || b + c <= a) return -1;",
        "    double s = (a + b + c) / 2;",
        "    return sqrt(s * (s - a) * (s - b) * (s - c));",
        "}"
      ].join("\n"))
    },

    "c-g4": {
      level: 1, title: "G卷·C：打印爱心图案",
      body: "手写程序打印一个由 * 组成的爱心图案。",
      hint: "爱心方程 (x²+y²-1)³ - x²y³ ≤ 0，遍历网格判断。",
      solution: C("c", "g4_heart.c", [
        "#include <stdio.h>",
        "int main(void) {",
        "    for (float y = 1.5f; y > -1.5f; y -= 0.1f) {",
        "        for (float x = -1.5f; x < 1.5f; x += 0.05f) {",
        "            float a = x*x + y*y - 1;",
        "            putchar(a*a*a - x*x*y*y*y <= 0.0f ? '*' : ' ');",
        "        }",
        "        putchar('\\n');",
        "    }",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    "c-g5": {
      level: 1, title: "G卷·C：数组元素循环左移 k 位",
      body: "手写 <code class='inline'>void rotate_left(int *arr, int n, int k)</code>，将数组元素循环左移 k 位。",
      hint: "三次翻转法：先整体翻转，再翻转前 k 个，再翻转后 n-k 个。",
      solution: C("c", "g5_rotate.c", [
        "static void flip(int *a, int n) {",
        "    for (int i = 0; i < n / 2; i++) {",
        "        int t = a[i]; a[i] = a[n-1-i]; a[n-1-i] = t;",
        "    }",
        "}",
        "void rotate_left(int *arr, int n, int k) {",
        "    k %= n; if (k < 0) k += n;",
        "    flip(arr, n);          // 整体翻转",
        "    flip(arr + n - k, k);  // 翻转后 k 个",
        "    flip(arr, n - k);      // 翻转前 n-k 个",
        "}"
      ].join("\n"))
    },

    "c-g6": {
      level: 2, title: "G卷·C：杨辉三角",
      body: "手写程序打印 n 行杨辉三角。",
      hint: "每个数等于上一行左右两数之和：a[i][j] = a[i-1][j-1] + a[i-1][j]。",
      solution: C("c", "g6_pascal.c", [
        "#include <stdio.h>",
        "int main(void) {",
        "    int n = 10, a[10][10] = {0};",
        "    for (int i = 0; i < n; i++) {",
        "        a[i][0] = 1;",
        "        for (int j = 1; j <= i; j++)",
        "            a[i][j] = a[i-1][j-1] + a[i-1][j];",
        "    }",
        "    for (int i = 0; i < n; i++) {",
        "        for (int j = 0; j <= i; j++) printf(\"%d \", a[i][j]);",
        "        printf(\"\\n\");",
        "    }",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    "c-g7": {
      level: 2, title: "G卷·C：字符串压缩（游程编码）",
      body: "手写 <code class='inline'>void rle_compress(const char *in, char *out)</code>：aabbbcc → a2b3c2。",
      hint: "统计连续相同字符的个数，<9 时直接输出数字。",
      solution: C("c", "g7_rle.c", [
        "void rle_compress(const char *in, char *out) {",
        "    int pos = 0;",
        "    while (*in) {",
        "        char c = *in; int count = 1;",
        "        while (in[count] == c) count++;",
        "        out[pos++] = c;",
        "        if (count > 1) out[pos++] = '0' + count;",
        "        in += count;",
        "    }",
        "    out[pos] = '\\0';",
        "}"
      ].join("\n"))
    },

    "c-g8": {
      level: 2, title: "G卷·C：字符串解压缩",
      body: "手写 RLE 解压缩函数：a2b3c2 → aabbbcc。",
      hint: "读字符，看后面是否跟数字，是就重复对应次数。",
      solution: C("c", "g8_rle_decompress.c", [
        "void rle_decompress(const char *in, char *out) {",
        "    int pos = 0;",
        "    while (*in) {",
        "        char c = *in++;",
        "        int count = 1;",
        "        if (*in >= '2' && *in <= '9') count = *in++ - '0';",
        "        for (int i = 0; i < count; i++) out[pos++] = c;",
        "    }",
        "    out[pos] = '\\0';",
        "}"
      ].join("\n"))
    },

    "c-g9": {
      level: 2, title: "G卷·C：凯撒密码加密与解密",
      body: "手写凯撒密码的加密和解密函数，只处理字母，其他字符不变。",
      hint: "加密 +3，解密 -3，注意 wrap around（z→c）。",
      solution: C("c", "g9_caesar.c", [
        "char caesar_shift(char c, int shift) {",
        "    if (c >= 'a' && c <= 'z') return 'a' + (c - 'a' + shift) % 26;",
        "    if (c >= 'A' && c <= 'Z') return 'A' + (c - 'A' + shift) % 26;",
        "    return c;",
        "}",
        "void caesar_encrypt(const char *in, char *out) {",
        "    while (*in) *out++ = caesar_shift(*in++, 3);",
        "    *out = '\\0';",
        "}",
        "void caesar_decrypt(const char *in, char *out) {",
        "    while (*in) *out++ = caesar_shift(*in++, 23);   // 23 = -3 mod 26",
        "    *out = '\\0';",
        "}"
      ].join("\n"))
    },

    "c-g10": {
      level: 2, title: "G卷·C：统计单词个数（不用 strtok）",
      body: "手写函数统计字符串中单词个数（空格分隔），不许用 strtok。",
      hint: "状态机：上一个字符是空格当前不是 → 新单词开始。",
      solution: C("c", "g10_wordcount.c", [
        "int count_words(const char *s) {",
        "    int count = 0, in_word = 0;",
        "    for (; *s; s++) {",
        "        if (*s == ' ' || *s == '\\t' || *s == '\\n') in_word = 0;",
        "        else if (!in_word) { in_word = 1; count++; }",
        "    }",
        "    return count;",
        "}"
      ].join("\n"))
    },

    "c-g11": {
      level: 2, title: "G卷·C：矩阵转置",
      body: "手写 <code class='inline'>void transpose(int m[3][3])</code>，原地转置方阵。",
      hint: "只遍历上三角，交换 m[i][j] 和 m[j][i]。",
      solution: C("c", "g11_transpose.c", [
        "void transpose(int m[3][3]) {",
        "    for (int i = 0; i < 3; i++)",
        "        for (int j = i + 1; j < 3; j++) {",
        "            int t = m[i][j]; m[i][j] = m[j][i]; m[j][i] = t;",
        "        }",
        "}"
      ].join("\n"))
    },

    "c-g12": {
      level: 2, title: "G卷·C：矩阵乘法",
      body: "手写矩阵乘法 <code class='inline'>void mat_mul(int a[2][3], int b[3][2], int out[2][2])</code>。",
      hint: "out[i][j] = Σ a[i][k] * b[k][j]。",
      solution: C("c", "g12_matmul.c", [
        "void mat_mul(int a[2][3], int b[3][2], int out[2][2]) {",
        "    for (int i = 0; i < 2; i++)",
        "        for (int j = 0; j < 2; j++) {",
        "            out[i][j] = 0;",
        "            for (int k = 0; k < 3; k++)",
        "                out[i][j] += a[i][k] * b[k][j];",
        "        }",
        "}"
      ].join("\n"))
    },

    "c-g13": {
      level: 2, title: "G卷·C：蛇形填数",
      body: "手写程序在 n×n 矩阵中填蛇形数（1 在左上，向右、下、左、上螺旋前进）。",
      hint: "四个方向循环：右下左上，碰边或已填过就转向。",
      solution: C("c", "g13_spiral.c", [
        "void spiral_fill(int n, int m[10][10]) {",
        "    int dx[4] = {0, 1, 0, -1}, dy[4] = {1, 0, -1, 0};",
        "    int x = 0, y = 0, dir = 0;",
        "    for (int v = 1; v <= n * n; v++) {",
        "        m[x][y] = v;",
        "        int nx = x + dx[dir], ny = y + dy[dir];",
        "        if (nx < 0 || nx >= n || ny < 0 || ny >= n || m[nx][ny]) {",
        "            dir = (dir + 1) % 4;   // 转向",
        "            nx = x + dx[dir]; ny = y + dy[dir];",
        "        }",
        "        x = nx; y = ny;",
        "    }",
        "}"
      ].join("\n"))
    },

    "c-g14": {
      level: 2, title: "G卷·C：栈实现队列（双栈法）",
      body: "手写用两个栈实现一个队列（均摊 O(1)）。",
      hint: "入队进 stack_in；出队时若 stack_out 为空，把 stack_in 全部倒入 stack_out。",
      solution: C("c", "g14_two_stacks.c", [
        "typedef struct { int in[100], in_top; int out[100], out_top; } MyQueue;",
        "void q_push(MyQueue *q, int x) { q->in[q->in_top++] = x; }",
        "int q_pop(MyQueue *q) {",
        "    if (q->out_top == 0) {",
        "        while (q->in_top > 0) q->out[q->out_top++] = q->in[--q->in_top];",
        "    }",
        "    return q->out[--q->out_top];",
        "}"
      ].join("\n"))
    },

    "c-g15": {
      level: 3, title: "G卷·C：双指针去重有序数组",
      body: "手写 <code class='inline'>int dedup_sorted(int *arr, int n)</code>，原地删除有序数组中的重复元素，返回新长度。",
      hint: "读写双指针：读到新值就写到写指针位置。",
      solution: C("c", "g15_dedup.c", [
        "int dedup_sorted(int *arr, int n) {",
        "    if (n == 0) return 0;",
        "    int write = 1;",
        "    for (int read = 1; read < n; read++) {",
        "        if (arr[read] != arr[read - 1]) arr[write++] = arr[read];",
        "    }",
        "    return write;",
        "}"
      ].join("\n"))
    },

    "c-g16": {
      level: 3, title: "G卷·C：两数之和（有序数组双指针）",
      body: "手写函数在有序数组中找两个数使其和等于 target，返回下标对。双指针法。",
      hint: "头尾指针：sum 小了左指针右移，大了右指针左移。",
      solution: C("c", "g16_two_sum.c", [
        "int two_sum_sorted(const int *arr, int n, int target, int *i1, int *i2) {",
        "    int lo = 0, hi = n - 1;",
        "    while (lo < hi) {",
        "        int sum = arr[lo] + arr[hi];",
        "        if (sum == target) { *i1 = lo; *i2 = hi; return 1; }",
        "        if (sum < target) lo++; else hi--;",
        "    }",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    "c-g17": {
      level: 3, title: "G卷·C：三数之和（排序+双指针）",
      body: "手写函数找有序数组中所有和为 0 的三元组（不重复）。",
      hint: "排序后固定一个数，剩下用双指针。",
      solution: C("c", "g17_three_sum.c", [
        "/* 先排序，然后：",
        " * for i in 0..n-3:",
        " *   跳过重复的 arr[i]",
        " *   lo=i+1, hi=n-1 双指针找 -arr[i]",
        " *   找到后跳过重复的 lo/hi",
        " */"
      ].join("\n"))
    },

    "c-g18": {
      level: 3, title: "G卷·C：数组中的第 K 大元素",
      body: "手写函数找数组中第 K 大元素（快速选择算法，平均 O(n)）。",
      hint: "快速排序的分区思想：每次分区确定一个元素位置，看它是不是第 k 个。",
      solution: C("c", "g18_kth_largest.c", [
        "int quick_select(int *arr, int lo, int hi, int k) {",
        "    if (lo == hi) return arr[lo];",
        "    int pivot = arr[hi], i = lo;",
        "    for (int j = lo; j < hi; j++)",
        "        if (arr[j] < pivot) { int t=arr[i];arr[i]=arr[j];arr[j]=t; i++; }",
        "    int t = arr[i]; arr[i] = arr[hi]; arr[hi] = t;   // pivot 就位",
        "    if (i == k) return arr[i];",
        "    if (i < k) return quick_select(arr, i+1, hi, k);",
        "    return quick_select(arr, lo, i-1, k);",
        "}"
      ].join("\n"))
    },

    "c-g19": {
      level: 3, featured: true, title: "G卷·C：手写简易 JSON 解析器（值解析）",
      lip: null,
      body: "手写简易 JSON 解析器的核心递归函数 parse_value：能处理 object/array/string/number/true/false/null。",
      hint: "switch 首字符：{ → 递归 object，[ → 递归 array，\" → string，t/f/n → 字面量，否则 number。",
      solution: C("c", "g19_json_parse.c", [
        "typedef struct { const char *p; } JsonParser;",
        "int parse_value(JsonParser *ps) {",
        "    while (*ps->p == ' ') ps->p++;",
        "    switch (*ps->p) {",
        "        case '{': return parse_object(ps);",
        "        case '[': return parse_array(ps);",
        "        case '\"': return parse_string(ps);",
        "        case 't': ps->p += 4; return 1;   // true",
        "        case 'f': ps->p += 5; return 1;   // false",
        "        case 'n': ps->p += 4; return 1;   // null",
        "        default:  return parse_number(ps);",
        "    }",
        "}"
      ].join("\n"))
    },

    "c-g20": {
      level: 3, title: "G卷·C：手写简易 JSON 生成器",
      body: "手写 JSON 生成器：从 key-value 对数组生成 JSON 字符串。",
      hint: "拼接 {\"key\": value}，注意逗号和引号。",
      solution: C("c", "g20_json_gen.c", [
        "void json_gen(const char *keys[], const char *vals[], int n, char *out) {",
        "    int pos = 0;",
        "    out[pos++] = '{';",
        "    for (int i = 0; i < n; i++) {",
        "        if (i > 0) out[pos++] = ',';",
        "        pos += sprintf(out + pos, \"\\\"%s\\\":\\\"%s\\\"\", keys[i], vals[i]);",
        "    }",
        "    out[pos++] = '}';",
        "    out[pos] = '\\0';",
        "}"
      ].join("\n"))
    },

    /* ==================== C++ · 补充 G 卷 ==================== */

    "cpp-g1": {
      level: 1, title: "G卷·C++：string 的安全拼接",
      body: "手写脚本对比 char* 拼接（strcat）和 std::string 拼接（+）的安全性和便捷性。",
      hint: "strcat 有缓冲区溢出风险；string 自动管理内存。",
      solution: C("cpp", "g1_string_concat.cpp", [
        "// C 风格（危险）",
        "char buf[20];",
        "strcpy(buf, \"hello\");",
        "strcat(buf, \" world\");    // 如果总长超过 20 → 溢出！",
        "",
        "// C++ 风格（安全）",
        "std::string s = \"hello\";",
        "s += \" world\";            // 自动扩容，无溢出风险"
      ].join("\n"))
    },

    "cpp-g2": {
      level: 1, title: "G卷·C++：vector vs 数组",
      body: "手写脚本对比原生数组和 std::vector 的差异：长度、越界检查、传参、内存管理。",
      hint: "vector 动态长度、at() 越界抛异常、传参不退化。",
      solution: C("cpp", "g2_vec_vs_arr.cpp", [
        "// 原生数组：定长、无越界检查、传参退化为指针",
        "int arr[5];",
        "// std::vector：动态、at() 检查、拷贝传参完整",
        "std::vector<int> v = {1, 2, 3};",
        "v.push_back(4);   // 动态扩容",
        "// v.at(10);      // 抛 std::out_of_range",
        "// v[10];         // 未定义行为（不检查）"
      ].join("\n"))
    },

    "cpp-g3": {
      length: null,
      level: 1, title: "G卷·C++：迭代器分类",
      body: "列出 STL 迭代器的五种分类，并说明 vector/list/map 分别提供哪种。",
      hint: "输入、输出、前向、双向、随机访问。vector 随机访问；list 双向；map 双向。",
      solution: C("cpp", "g3_iterators.cpp", [
        "// STL 迭代器分类：",
        "// 输入迭代器：只读单遍（istream_iterator）",
        "// 输出迭代器：只写单遍（back_insert_iterator）",
        "// 前向迭代器：读写多遍（forward_list）",
        "// 双向迭代器：可后退（list、map、set）",
        "// 随机访问迭代器：支持 +n、比较（vector、deque、array）"
      ].join("\n"))
    },

    "cpp-g4": {
      level: 2, title: "G卷·C++：手写 shared_ptr 引用计数观察",
      body: "手写程序观察 shared_ptr 引用计数变化：创建、拷贝、reset、作用域结束。",
      hint: "use_count() 在每个节点打印。",
      solution: C("cpp", "g4_shared_count.cpp", [
        "#include <memory>",
        "#include <iostream>",
        "int main() {",
        "    auto p1 = std::make_shared<int>(42);",
        "    std::cout << p1.use_count() << std::endl;   // 1",
        "    {",
        "        auto p2 = p1;",
        "        std::cout << p1.use_count() << std::endl;   // 2",
        "    }   // p2 析构",
        "    std::cout << p1.use_count() << std::endl;   // 1",
        "    p1.reset();",
        "    std::cout << p1.use_count() << std::endl;   // 0（对象已释放）",
        "}"
      ].join("\n"))
    },

    "cpp-g5": {
      level: 2, title: "G卷·C++：手写线程安全 counter（atomic）",
      body: "手写用 atomic<int> 实现的计数器，并用多线程测试。",
      hint: "fetch_add(1) 是原子操作。",
      "cpp-g5x": null,
      solution: C("cpp", "g5_atomic_counter.cpp", [
        "#include <atomic>",
        "#include <thread>",
        "std::atomic<int> counter{0};",
        "void worker() {",
        "    for (int i = 0; i < 100000; i++) counter.fetch_add(1);",
        "}",
        "int main() {",
        "    std::thread t1(worker), t2(worker);",
        "    t1.join(); t2.join();",
        "    return counter.load();   // 保证是 200000",
        "}"
      ].join("\n"))
    },

    "cpp-g6": {
      level: 2, title: "G卷·C++：手写简易 scope guard",
      body: "手写一个 ScopeGuard 类：构造时保存函数，析构时自动调用。用于任何需要延迟执行的清理操作。",
      hint: "模板类 + 移动语义 + dismiss() 取消执行。",
      solution: C("cpp", "g6_scope_guard.cpp", [
        "#include <functional>",
        "",
        "class ScopeGuard {",
        "public:",
        "    explicit ScopeGuard(std::function<void()> on_exit)",
        "        : on_exit_(std::move(on_exit)), active_(true) {}",
        "    ~ScopeGuard() { if (active_) on_exit_(); }",
        "    void dismiss() { active_ = false; }   // 取消",
        "    ScopeGuard(const ScopeGuard &) = delete;",
        "    ScopeGuard &operator=(const ScopeGuard &) = delete;",
        "    ScopeGuard(ScopeGuard &&other) noexcept",
        "        : on_exit_(std::move(other.on_exit_)), active_(other.active_) {",
        "        other.active_ = false;",
        "    }",
        "private:",
        "    std::function<void()> on_exit_; bool active_;",
        "};"
      ].join("\n"))
    },

    "cpp-g7": {
      level: 3, title: "G卷·C++：手写 B+ 树节点（仅结构）",
      body: "手写 B+ 树节点结构：keys 数组、children 指针数组、is_leaf 标志、next 指针（叶子链）。",
      hint: "order 为 B+ 树的阶，keys 有 order-1 个，children 有 order 个。",
      solution: C("cpp", "g7_bptree_node.cpp", [
        "template <typename K, int Order = 4>",
        "struct BPNode {",
        "    K keys[Order - 1];              // 键",
        "    BPNode *children[Order];        // 子节点指针",
        "    bool is_leaf;",
        "    int key_count;",
        "    BPNode *next;                   // 叶子链（B+ 树特有）",
        "    BPNode() : is_leaf(false), key_count(0), next(nullptr) {",
        "        for (int i = 0; i < Order; i++) children[i] = nullptr;",
        "    }",
        "};"
      ].join("\n"))
    },

    "cpp-g8": {
      level: 3, title: "G8·C++：手写跳表节点",
      body: "手写跳表节点结构和查找函数骨架。",
      hint: "多层链表，每层是下层的一个“跳读”子集，查找时从最高层开始快速跳。",
      solution: C("cpp", "g8_skiplist.cpp", [
        "template <typename K, typename V>",
        "struct SkipNode {",
        "    K key; V value;",
        "    std::vector<SkipNode*> forward;   // 各层的下一个指针",
        "    SkipNode(K k, V v, int level)",
        "        : key(k), value(v), forward(level, nullptr) {}",
        "};",
        "",
        "SkipNode<K,V> *find(SkipNode<K,V> *head, K target) {",
        "    auto node = head;",
        "    for (int lvl = node->forward.size() - 1; lvl >= 0; lvl--) {",
        "        while (node->forward[lvl] && node->forward[lvl]->key < target)",
        "            node = node->forward[lvl];",
        "    }",
        "    node = node->forward[0];",
        "    return (node && node->key == target) ? node : nullptr;",
        "}"
      ].join("\n"))
    },

    /* ==================== Python · 补充 G 卷 ==================== */

    "py-g1": {
      level: 1, title: "G卷·Python：列表合并与去重保序",
      body: "手写函数将两个列表合并并去重，保持元素首次出现顺序。",
      hint: "seen 集合 + 列表推导式，或 dict.fromkeys。",
      solution: C("python", "g1_merge_dedup.py", [
        "def merge_unique(a, b):",
        "    seen = set()",
        "    result = []",
        "    for x in a + b:",
        "        if x not in seen:",
        "            seen.add(x)",
        "            result.append(x)",
        "    return result",
        "",
        "# 或一行：",
        "# list(dict.fromkeys(a + b))"
      ].join("\n"))
    },

    "py-g2": {
      level: 1, title: "G卷·Python：字符串反转的多种方法",
      body: "手写至少三种字符串反转方法，并说哪种最快。",
      hint: "s[::-1] 最快（C 实现）；''.join(reversed(s)) 次之；循环最慢。",
      solution: C("python", "g2_reverse.py", [
        "s = \"hello\"",
        "# 方法1：切片（最快，C 层实现）",
        "s1 = s[::-1]",
        "# 方法2：reversed + join",
        "s2 = ''.join(reversed(s))",
        "# 方法3：循环（最慢）",
        "chars = list(s)",
        "for i in range(len(s) // 2):",
        "    chars[i], chars[-1-i] = chars[-1-i], chars[i]",
        "s3 = ''.join(chars)"
      ].join("\n"))
    },

    "py-g3": {
      level: 1, title: "G卷·Python：Fibonacci 三种写法",
      body: "手写斐波那契三种版本：递归、迭代、矩阵快速幂。",
      hint: "矩阵 [[1,1],[1,0]]^n 的 [0][1] 元素就是 fib(n)。",
      solution: C("python", "g3_fib.py", [
        "# 1. 朴素递归 O(2^n)",
        "def fib1(n):",
        "    return n if n < 2 else fib1(n-1) + fib1(n-2)",
        "",
        "# 2. 迭代 O(n)",
        "def fib2(n):",
        "    a, b = 0, 1",
        "    for _ in range(n):",
        "        a, b = b, a + b",
        "    return a",
        "",
        "# 3. 矩阵快速幂 O(log n)",
        "def fib3(n):",
        "    def mat_mult(A, B):",
        "        return [[A[0][0]*B[0][0]+A[0][1]*B[1][0], A[0][0]*B[0][1]+A[0][1]*B[1][1]],",
        "                [A[1][0]*B[0][0]+A[1][1]*B[1][0], A[1][0]*B[0][1]+A[1][1]*B[1][1]]]",
        "    def mat_pow(M, p):",
        "        R = [[1,0],[0,1]]",
        "        while p:",
        "            if p & 1: R = mat_mult(R, M)",
        "            M = mat_mult(M, M)",
        "            p >>= 1",
        "        return R",
        "    if n == 0: return 0",
        "    return mat_pow([[1,1],[1,0]], n)[0][1]"
      ].join("\n"))
    },

    "py-g4": {
      level: 2, title: "G卷·Python：手写 Counter 类",
      body: "手写一个简化版 Counter：add(word) 累加计数，top(n) 返回前 n 高频词。",
      hint: "继承 dict，add 时 self[w] = self.get(w, 0) + 1。",
      solution: C("python", "g4_counter.py", [
        "class Counter(dict):",
        "    def add(self, word):",
        "        self[word] = self.get(word, 0) + 1",
        "",
        "    def top(self, n=10):",
        "        return sorted(self.items(), key=lambda kv: -kv[1])[:n]",
        "",
        "c = Counter()",
        "for w in \"the quick brown fox the\".split():",
        "    c.add(w)",
        "print(c.top(2))   # [('the', 2), ('quick', 1)]"
      ].join("\n"))
    },

    "py-g5": {
      level: 2, title: "G卷·Python：手写简易分词器（正则版）",
      body: "手写一个简易分词器：按空格和标点切分，支持中英文混合。",
      hint: "re.findall(r'[\\u4e00-\\u9fa5]|[a-zA-Z]+|\\d+', text)。",
      solution: C("python", "g5_tokenizer.py", [
        "import re",
        "",
        "def tokenize(text):",
        "    return re.findall(r'[\\u4e00-\\u9fa5]|[a-zA-Z]+|\\d+', text)",
        "",
        "text = \"Hello 世界123 hi\"",
        "print(tokenize(text))",
        "# ['Hello', '世', '界', '123', 'hi']"
      ].join("\n"))
    },

    "py-g6": {
      level: 2, title: "G卷·Python：手写简易装饰器：重试",
      body: "手写 @retry(times=3, delay=1) 装饰器，函数失败时重试最多 3 次，每次间隔 1 秒。",
      hint: "三重嵌套：装饰器工厂 → 装饰器 → 包装函数，time.sleep 延迟。",
      solution: C("python", "g6_retry.py", [
        "import time",
        "import functools",
        "",
        "def retry(times=3, delay=1):",
        "    def decorator(func):",
        "        @functools.wraps(func)",
        "        def wrapper(*args, **kwargs):",
        "            for attempt in range(1, times + 1):",
        "                try:",
        "                    return func(*args, **kwargs)",
        "                except Exception as e:",
        "                    if attempt == times:",
        "                        raise",
        "                    time.sleep(delay)",
        "        return wrapper",
        "    return decorator"
      ].join("\n"))
    },

    "py-g7": {
      level: 3, title: "G卷·Python：手写简易单测框架",
      body: "手写一个最小单测框架：TestCase 类 + run() 跑所有 test_ 开头的方法，统计 pass/fail。",
      hint: "dir(self) 找 test_ 开头的方法，try/except 捕获 AssertionError。",
      solution: C("python", "g7_mini_test.py", [
        "import traceback",
        "",
        "class TestCase:",
        "    def run(self):",
        "        passed, failed = 0, 0",
        "        methods = [m for m in dir(self) if m.startswith(\"test_\")]",
        "        for name in methods:        # 逐个跑测试方法",
        "            try:",
        "                getattr(self, name)()",
        "                passed += 1",
        "                print(f\"  PASS {name}\")",
        "            except AssertionError:",
        "                failed += 1",
        "                print(f\"  FAIL {name}\")",
        "        print(f\"\\n{passed} passed, {failed} failed\")",
        "",
        "class TestMath(TestCase):",
        "    def test_add(self):",
        "        assert 1 + 1 == 2",
        "    def test_sub(self):",
        "        assert 5 - 3 == 2"
      ].join("\n"))
    },

    "py-g8": {
      level: 3, featured: true, title: "G卷·Python：手写简易 Web 框架路由",
      body: "手写一个极简 Web 框架的路由系统：支持 @app.route(path) 装饰器注册 GET 路由，match(path) 时返回处理函数。",
      hint: "字典存 {path: handler}，装饰器注册，match 查找。",
      solution: C("python", "g8_mini_router.py", [
        "class App:",
        "    def __init__(self):",
        "        self.routes = {}",
        "",
        "    def route(self, path):",
        "        def decorator(handler):",
        "            self.routes[path] = handler",
        "            return handler",
        "        return decorator",
        "",
        "    def match(self, path):",
        "        return self.routes.get(path)",
        "",
        "app = App()",
        "",
        "@app.route(\"/\")",
        "def index():",
        "    return \"home page\""
      ].join("\n"))
    },

    /* ==================== ROS 2 · 补充 G 卷 ==================== */

    "ros-g1": {
      level: 1, title: "G卷·ROS2：ros2 topic CLI 实战",
      body: "手写 shell 命令序列：列出所有话题、查看某话题类型、按 10Hz 打印 /chatter 内容、检查发布者数量。",
      hint: "ros2 topic list / info / echo --rate 10 / info -v。",
      solution: C("bash", "g1_topic_cli.sh", [
        "# 列出所有话题",
        "ros2 topic list",
        "",
        "# 查看话题类型和发布订阅者",
        "ros2 topic info /chatter -v",
        "",
        "# 按 10Hz 打印内容",
        "ros2 topic echo /chatter --rate 10",
        "",
        "# 查看话题类型",
        "ros2 topic type /chatter"
      ].join("\n"))
    },

    "ros-g2": {
      level: 1, title: "G卷·ROS2：ros2 node CLI 实战",
      body: "手写 shell 呦令：列出所有节点、查看某节点的详细信息（话题/服务/参数）。",
      hint: "ros2 node list / info。",
      solution: C("bash", "g2_node_cli.sh", [
        "# 列出所有节点",
        "ros2 node list",
        "",
        "# 查看节点详情",
        "ros2 node info /my_node"
      ].join("\n"))
    },

    "ros-g3": {
      level: 2, title: "G卷·ROS2：手写 message_filters 时间同步",
      body: "手写用 message_filters 同步两个相机话题（ApproximateTimeSynchronizer）。",
      hint: "Subscriber + ApproximateTimeSynchronizer(queue, slop) + registerCallback。",
      solution: C("python", "g3_msg_filter.py", [
        "import rclpy",
        "from rclpy.node import Node",
        "from message_filters import Subscriber, ApproximateTimeSynchronizer",
        "from sensor_msgs.msg import Image",
        "",
        "class DualCameraSync(Node):",
        "    def ___init__(self):",
        "        super().__init__(\"dual_cam_sync\")",
        "        sub1 = Subscriber(self, Image, \"/cam_left/image_raw\")",
        "        sub2 = Subscriber(self, Image, \"/cam_right/image_raw\")",
        "        self.sync = ApproximateTimeSynchronizer(",
        "            [sub1, sub2], queue_size=10, slop=0.01)",
        "        self.sync.registerCallback(self.on_pair)",
        "",
        "    def on_pair(self, img1, img2):",
        "        self.get_logger().info(\"收到同步图像对\")"
      ].join("\n"))
    },

    "ros-g4": {
      level: 2, title: "G卷·ROS2：参数回调（动态改参）",
      body: "手写参数回调：参数被 ros2 param set 修改时自动生效，无需重启节点。",
      hint: "add_on_set_parameters_callback + ACCEPT。",
      solution: C("cpp", "g4_param_callback.cpp", [
        "class DynamicParams : public rclcpp::Node {",
        "public:",
        "    DynamicParams() : Node(\"dynamic_params\") {",
        "        declare_parameter<double>(\"speed\", 1.0);",
        "        add_on_set_parameters_callback(",
        "            [this](const std::vector<rclcpp::Parameter> &params) {",
        "                rcl_interfaces::msg::SetParametersResult result;",
        "                result.successful = true;",
        "                for (const auto &p : params) {",
        "                    if (p.get_name() == \"speed\") {",
        "                        if (p.get_value<double>() < 0) {",
        "                            result.successful = false;",
        "                            result.reason = \"速度不能为负\";",
        "                        } else {",
        "                            RCLCPP_INFO(get_logger(), \"速度改为 %.2f\", p.get_value<double>());",
        "                        }",
        "                    }",
        "                }",
        "                return result;",
        "            });",
        "    }",
        "};"
      ].join("\n"))
    },

    "ros-g5": {
      level: 3, featured: true, title: "G卷·ROS2：手写视觉系统主控节点",
      body: "手写视觉系统主控节点：订阅相机图像，发布目标位姿，带 TF 变换，参数化敌方颜色。",
      hint: "一个节点集成订阅/发布/TF/参数，是 RM 视觉的典型架构。",
      solution: C("cpp", "g5_vision_main.cpp", [
        "class VisionNode : public rclcpp::Node {",
        "public:",
        "    VisionNode() : Node(\"vision_node\") {",
        "        // 参数",
        "        declare_parameter<std::string>(\"enemy_color\", \"red\");",
        "        enemy_color_ = get_parameter(\"enemy_color\").get_value<std::string>();",
        "        // 订阅相机",
        "        img_sub_ = create_subscription<sensor_msgs::msg::Image>(",
        "            \"/camera/image_raw\",",
        "            rclcpp::SensorDataQoS(),",
        "            [this](sensor_msgs::msg::Image::SharedPtr msg) { onImage(msg); });",
        "        // 发布目标",
        "        target_pub_ = create_publisher<geometry_msgs::msg::PointStamped>(",
        "            \"/targets\", 10);",
        "        // TF",
        "        tf_buffer_ = std::make_shared<tf2_ros::Buffer>(get_clock());",
        "        tf_listener_ = std::make_shared<tf2_ros::TransformListener>(*tf_buffer_);",
        "    }",
        "private:",
        "    void onImage(const sensor_msgs::msg::Image::SharedPtr msg) {",
        "        // 1. 转 cv::Mat",
        "        cv_bridge::CvImagePtr cv_ptr;",
        "        try {",
        "            cv_ptr = cv_bridge::toCvCopy(msg, \"bgr8\");",
        "        } catch (const cv_bridge::Exception &e) {",
        "            RCLCPP_WARN(get_logger(), \"cv_bridge: %s\", e.what());",
        "            return;",
        "        }",
        "        // 2. 检测装甲板",
        "        auto armors = detector_.detect(cv_ptr->image, enemy_color_);",
        "        if (armors.empty()) return;",
        "        // 3. PnP 解算 → 相机系坐标 → TF 变换到 odom 系",
        "        // 4. 发布 PointStamped",
        "    }",
        "    std::string enemy_color_;",
        "    rclcpp::Subscription<sensor_msgs::msg::Image>::SharedPtr img_sub_;",
        "    rclcpp::Publisher<geometry_msgs::msg::PointStamped>::SharedPtr target_pub_;",
        "    std::shared_ptr<tf2_ros::Buffer> tf_buffer_;",
        "    std::shared_ptr<tf2_ros::TransformListener> tf_listener_;",
        "    ArmorDetector detector_;",
        "};"
      ].join("\n"))
    },

    /* ==================== RM 电控 · 补充 G 卷 ==================== */

    "rme-g1": {
      level: 1, title: "G卷·电控：CAN 过滤器配置",
      body: "手写 STM32 bxCAN 过滤器配置：只接收 0x200-0x207 的电机反馈帧，其余丢弃。",
      hint: "32 位 scale + IDENTIFIER_LIST 模式，或 16 位 scale 置 mask 模式。",
      solution: C("c", "g1_can_filter.c", [
        "/* 16 位 scale + 掩码模式：",
        " * 标准帧 ID 在 STID[15:5]",
        " * 0x200-0x207 → 高 8 位 0x200>>5=0x10，低 3 位任意",
        " * Fr1 = (0x200 << 5) | (0x07 << 5 的低 3 位掩码)  — 简化写法：",
        " */",
        "CAN_FilterTypeDef filt = {0};",
        "filt.FilterBank = 0;",
        "filt.FilterMode = CAN_FILTERMODE_IDMASK;",
        "filt.FilterScale = CAN_FILTERSCALE_32BIT;",
        "filt.FilterIdHigh = (0x200 << 5);            // 目标 ID 高 16 位",
        "filt.FilterMaskIdHigh = (0x7F8 << 5);        // 只比高 11 位中的前 8 位",
        "filt.FilterFIFOAssignment = CAN_RX_FIFO0;",
        "filt.FilterActivation = ENABLE;",
        "HAL_CAN_ConfigFilter(&hcan1, &filt);"
      ].join("\n"))
    },

    "rme-g2": {
      level: 2, title: "G卷·电控：CAN 发送邮箱选择与重试",
      body: "手写 CAN 发送函数：三个发送邮箱满时等待（带超时），发送失败重试一次。",
      hint: "HAL_CAN_GetTxMailboxesFreeLevel + AddTxMessage 返回值检查。",
      solution: C("c", "g2_can_send.c", [
        "HAL_StatusTypeDef can_send(uint32_t id, const uint8_t *data, uint8_t len) {",
        "    CAN_TxHeaderTypeDef hdr = {0};",
        "    hdr.StdId = id; hdr.IDE = CAN_ID_STD; hdr.RTR = CAN_RTR_DATA;",
        "    hdr.DLC = len;",
        "    uint32_t mailbox;",
        "    // 等邮箱空闲（最多 1ms）",
        "    for (int i = 0; i < 1000 && HAL_CAN_GetTxMailboxesFreeLevel(&hcan1) == 0; i++) {",
        "        // 用 us 延时或自旋",
        "    }",
        "    if (HAL_CAN_AddTxMessage(&hcan1, &hdr, (uint8_t*)data, &mailbox) != HAL_OK)",
        "        return HAL_ERROR;   // 重试逻辑视情况而定",
        "    return HAL_OK;",
        "}"
      ].join("\n"))
    },

    "rme-g3": {
      level: 2, title: "G卷·电控：电机反馈解析（大疆 C620）",
      body: "大疆 C620 电调反馈帧（0x200+ID）包含：转子机械角度、转速、实际转矩电流、温度。手写解析函数。",
      hint: "buf[0]=角度高8位(0-8191)，buf[2:3]=转速rpm，buf[4:5]=电流，buf[6]=温度。",
      solution: C("c", "g3_c620_parse.c", [
        "typedef struct {",
        "    uint16_t angle;      // 0~8191 → 0~360°",
        "    int16_t speed_rpm;  // 转速 rpm",
        "    int16_t current;    // 实际转矩电流",
        "    uint8_t temperature;// 温度 ℃",
        "} MotorFeedback;",
        "",
        "void c620_parse(const uint8_t *buf, MotorFeedback *fb) {",
        "    fb->angle = (uint16_t)(buf[0] << 8 | buf[1]);",
        "    fb->speed_rpm = (int16_t)(buf[2] << 8 | buf[3]);",
        "    fb->current = (int16_t)(buf[4] << 8 | buf[5]);",
        "    fb->temperature = buf[6];",
        "}"
      ].join("\n"))
    },

    "rme-g4": {
      level: 3, featured: true, title: "G卷·电控：完整 PID 闭环（位置+速度双环）",
      body: "手写完整的位置环+速度环双环 PID 控制代码，1kHz 中断驱动。",
      hint: "外环（位置）输出作为内环（速度）的目标；外环频率可以低于内环。",
      solution: C("c", "g4_cascade_pid.c", [
        "PID pos_pid, vel_pid;    // 位置环、速度环",
        "float target_pos = 0;    // 目标位置 rad",
        "",
        "/* 1kHz 控制中断 */",
        "",
        "void control_isr(void) {",
        "    float pos = read_encoder();",
        "    float vel = read_speed();",
        "    // 位置环（外环，每 10ms 跑一次也行）",
        "    float target_vel = pid_compute(&pos_pid, target_pos, pos);",
        "    // 速度环（内环，1kHz 跑）",
        "    float current = pid_compute(&vel_pid, target_vel, vel);",
        "    motor_set_current(current);",
        "}"
      ].join("\n"))
    },

    "rme-g5": {
      level: 3, featured: true, title: "G卷·电控：离合保护 + 打弹速率控制",
      body: "手写摩擦轮/拨弹盘控制代码：发射前摩擦轮必须达到目标转速的 95%，拨弹盘每秒最多 N 发。",
      hint: "两个条件 AND：摩擦轮 ready && rate_limit 通过，才允许拨弹。",
      solution: C("c", "g5_shoot_ctrl.c", [
        "typedef enum { WHEEL_OFF, WHEEL_SPINUP, WHEEL_READY } WheelState;",
        "",
        "bool shoot_control(bool fire_cmd, float wheel_target, float wheel_actual) {",
        "    static WheelState state = WHEEL_OFF;",
        "    static uint32_t last_shot_ms = 0;",
        "    const uint32_t MIN_INTERVAL_MS = 200;   // 最小弹间隔 200ms（5发/秒）",
        "",
        "    switch (state) {",
        "        case WHEEL_OFF:",
        "            if (fire_cmd) state = WHEEL_SPINUP;",
        "            break;",
        "        case WHEEL_SPINUP:",
        "            if (wheel_actual >= 0.95f * wheel_target) state = WHEEL_READY;",
        "            else if (!fire_cmd) state = WHEEL_OFF;",
        "            break;",
        "        case WHEEL_READY:",
        "            if (!fire_cmd) { state = WHEEL_OFF; break; }",
        "            uint32_t now = millis();",
        "            if (now - last_shot_ms >= MIN_INTERVAL_MS) {",
        "                last_shot_ms = now;",
        "                trigger_one_shot();    // 拨弹盘转一格",
        "            }",
        "            break;",
        "    }",
        "    return (state == WHEEL_READY);",
        "}"
      ].join("\n"))
    },

    /* ==================== RM 视觉 · 补充 G 卷 ==================== */

    "rmv-g1": {
      level: 1, title: "G卷·视觉：透视变换（鸟瞰图）",
      body: "手写脚本：用 getPerspectiveTransform + warpPerspective 将地面视角转鸟瞰图。",
      hint: "选 4 个对应点，计算 3×3 变换矩阵，warp 到输出尺寸。",
      solution: C("python", "g1_perspective.py", [
        "import cv2",
        "import numpy as np",
        "",
        "src_pts = np.float32([[56, 177], [216, 133], [102, 323], [272, 218]])",
        "dst_pts = np.float32([[0, 0], [200, 0], [0, 300], [200, 300]])",
        "M = cv2.getPerspectiveTransform(src_pts, dst_pts)",
        "bird_view = cv2.warpPerspective(img, M, (200, 300))"
      ].join("\n"))
    },

    "rmv-g2": {
      level: 2, title: "G卷·视觉：连通域分析筛选灯条",
      body: "手写脚本用 connectedComponentsWithStats 分析连通域，按面积和宽高比筛选灯条。",
      hint: "stats 里有 [x, y, w, h, area]，按 h/w 和面积过滤。",
      solution: C("python", "g2_connected.py", [
        "import cv2",
        "n, labels, stats, centroids = cv2.connectedComponentsWithStats(binary)",
        "lights = []",
        "for i in range(1, n):   # 0 是背景",
        "    x, y, w, h, area = stats[i]",
        "    if area < 20: continue",
        "    if h / max(w, 1) < 2.0: continue",
        "    lights.append((x, y, w, h, centroids[i]))",
        "print(f\"筛出 {len(lights)} 个灯条候选\")"
      ].join("\n"))
    },

    "rmv-g3": {
      level: 2, title: "G卷·视觉：视频读取与逐帧处理",
      body: "手写脚本：读视频/相机流，逐帧处理，按 q 退出，实时显示 FPS。",
      hint: "cv2.VideoCapture + while + getTickCount 算 FPS。",
      solution: C("python", "g3_video.py", [
        "import cv2",
        "cap = cv2.VideoCapture(0)   # 0 是默认相机",
        "while True:",
        "    t0 = cv2.getTickCount()",
        "    ret, frame = cap.read()",
        "    if not ret: break",
        "    # 处理 frame ...",
        "    # FPS 计算",
        "    t1 = cv2.getTickCount()",
        "    fps = cv2.getTickFrequency() / (t1 - t0)",
        "    cv2.putText(frame, f\"FPS: {fps:.0f}\", (10, 30),",
        "                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)",
        "    cv2.imshow(\"frame\", frame)",
        "    if cv2.waitKey(1) == ord('q'): break",
        "cap.release()",
        "cv2.destroyAllWindows()"
      ].join("\n"))
    },

    "rmv-g4": {
      level: 3, featured: true, title: "G卷·视觉：完整传统装甲板检测管线",
      body: "手写完整传统装甲板检测管线：读帧 → HSV 通道分离 → 阈值 → 形态学 → 找轮廓 → 筛灯条 → 配对成装甲板。",
      hint: "这是 RM 视觉的 hello world，必须闭眼手写。",
      solution: C("python", "g4_full_pipeline.py", [
        "import cv2",
        "import numpy as np",
        "",
        "def detect_armors(img, enemy_color=\"red\"):",
        "    # 1. HSV 阈值（按敌方颜色取对应通道）",
        "    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)",
        "    if enemy_color == \"red\":",
        "        mask = cv2.inRange(hsv, (0,100,100), (10,255,255)) | \\",
        "               cv2.inRange(hsv, (156,100,100), (180,255,255))",
        "    else:",
        "        mask = cv2.inRange(hsv, (100,100,100), (124,255,255))",
        "    # 2. 闭运算连接断裂",
        "    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))",
        "    binary = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)",
        "    # 3. 找轮廓",
        "    contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL,",
        "                                    cv2.CHAIN_APPROX_SIMPLE)",
        "    # 4. 筛灯条",
        "    lights = []",
        "    for cnt in contours:",
        "        area = cv2.contourArea(cnt)",
        "        if area < 20 or area > 2000: continue",
        "        x, y, w, h = cv2.boundingRect(cnt)",
        "        if h / max(w, 1) < 2.0: continue",
        "        lights.append((x, y, w, h))",
        "    # 5. 配对",
        "    armors = []",
        "    for i in range(len(lights)):",
        "        for j in range(i + 1, len(lights)):",
        "            if is_pair(lights[i], lights[j]):",
        "                armors.append((lights[i], lights[j]))",
        "    return armors"
      ].join("\n"))
    },

    "rmv-g5": {
      level: 3, title: "G卷·视觉：ONNX/TensorRT 推理脚本骨架",
      body: "手写 ONNX Runtime 推理脚本骨架：加载模型、预处理、推理、后处理（NMS）。",
      hint: "onnxruntime.InferenceSession + session.run，输出做 NMS。",
      solution: C("python", "g5_onnx_infer.py", [
        "import onnxruntime as ort",
        "import numpy as np",
        "",
        "session = ort.InferenceSession(\"armor_yolov5s.onnx\",",
        "    providers=[\"CUDAExecutionProvider\", \"CPUExecutionProvider\"])",
        "input_name = session.get_inputs()[0].name",
        "",
        "def infer(img_bgr):",
        "    # 1. 预处理：resize → 归一化 → HWC→CHW → 加 batch 维",
        "    img = cv2.resize(img_bgr, (640, 640))",
        "    img = img.astype(np.float32) / 255.0",
        "    img = img.transpose(2, 0, 1)[None]   # (1,3,640,640)",
        "    # 2. 推理",
        "    outputs = session.run(None, {input_name: img})",
        "    # 3. 后处理：解码框 + NMS",
        "    boxes, scores = decode_outputs(outputs[0])",
        "    keep = nms(boxes, scores, iou_thresh=0.45)",
        "    return boxes[keep], scores[keep]"
      ].join("\n"))
    }

  });
})();
