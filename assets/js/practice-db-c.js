/* RM 兵工厂 · 手写练习题库（C 语言扩容卷 A1）
 * 覆盖：基础语法 / 控制流 / 数组与字符串 / 函数与递归 / 指针基础 / 指针进阶
 * 所有题均有提示和参考答案。featured 标记为精选好题。
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

    /* ==================== C 语言 · 基础语法 ==================== */

    "c-p16": {
      level: 1, title: "温度转换器（华氏→摄氏）",
      body: "手写程序读入华氏温度，输出摄氏温度（保留 1 位小数）。公式 C = (F - 32) × 5/9。注意整数除法的坑！",
      hint: "5.0/9.0 不要写成 5/9，后者在 C 里是 0。",
      solution: C("c", "temp_convert.c", [
        "#include <stdio.h>",
        "int main(void) {",
        "    double f;",
        "    printf(\"输入华氏温度: \");",
        "    scanf(\"%lf\", &f);",
        "    double c = (f - 32.0) * 5.0 / 9.0;",
        "    printf(\"摄氏: %.1f\\n\", c);",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    "c-p17": {
      level: 1, title: "判断闰年",
      body: "手写函数 <code class='inline'>int is_leap(int year)</code>：能被 4 整除但不能被 100 整除，或者能被 400 整除。返回 1 或 0。",
      hint: "条件：(y%4==0 && y%100!=0) || y%400==0",
      solution: C("c", "leap_year.c", [
        "int is_leap(int year) {",
        "    return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);",
        "}"
      ].join("\n"))
    },

    "c-p18": {
      level: 1, title: "计算 BMI 并判断体型",
      body: "手写程序：读入身高(m)和体重(kg)，计算 BMI = 体重/身高²，输出\"偏瘦\"\"正常\"\"超重\"\"肥胖\"（BMI<18.5 / <25 / <30 / >=30）。",
      hint: "用 if-else if 链。注意除法用 double。",
      solution: C("c", "bmi.c", [
        "#include <stdio.h>",
        "int main(void) {",
        "    double h, w;",
        "    scanf(\"%lf %lf\", &h, &w);",
        "    double bmi = w / (h * h);",
        "    printf(\"BMI=%.1f \", bmi);",
        "    if (bmi < 18.5)      printf(\"偏瘦\\n\");",
        "    else if (bmi < 25.0) printf(\"正常\\n\");",
        "    else if (bmi < 30.0) printf(\"超重\\n\");",
        "    else                 printf(\"肥胖\\n\");",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    "c-p19": {
      level: 1, title: "字符类型判断",
      body: "手写函数判断读入的字符是大写字母、小写字母、数字还是其他字符。分别返回 'U'、'L'、'D'、'O'。",
      hint: "用字符的 ASCII 范围比较：'A'-'Z'、'a'-'z'、'0'-'9'。",
      solution: C("c", "char_type.c", [
        "char classify(char c) {",
        "    if (c >= 'A' && c <= 'Z') return 'U';",
        "    if (c >= 'a' && c <= 'z') return 'L';",
        "    if (c >= '0' && c <= '9') return 'D';",
        "    return 'O';",
        "}"
      ].join("\n"))
    },

    "c-p20": {
      level: 1, title: "三数最大值（只用条件运算符）",
      body: "手写 <code class='inline'>int max3(int a, int b, int c)</code>，只许用条件运算符 ?:，不许用 if 语句。",
      hint: "嵌套：a>b ? (a>c?a:c) : (b>c?b:c)",
      solution: C("c", "max3_ternary.c", [
        "int max3(int a, int b, int c) {",
        "    return a > b ? (a > c ? a : c) : (b > c ? b : c);",
        "}"
      ].join("\n"))
    },

    "c-p21": {
      level: 1, title: "九九乘法表（指定格式）",
      body: "手写程序打印九九乘法表，格式要求每行从 1×n 到 n×n，用制表符分隔。",
      hint: "外层循环 i=1..9，内层 j=1..i，printf(\"%d×%d=%d\\t\", j, i, i*j)。",
      solution: C("c", "multiplication_table.c", [
        "#include <stdio.h>",
        "int main(void) {",
        "    for (int i = 1; i <= 9; i++) {",
        "        for (int j = 1; j <= i; j++)",
        "            printf(\"%dx%d=%d\\t\", j, i, i * j);",
        "        printf(\"\\n\");",
        "    }",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    "c-p22": {
      level: 1, title: "猜数字游戏（固定答案版）",
      body: "手写猜数字游戏：答案固定为 42，用户每次输入一个数，程序提示\"大了\"\"小了\"\"猜对了\"，最多猜 10 次。",
      hint: "while 循环 + scanf + 计数器。",
      solution: C("c", "guess_number.c", [
        "#include <stdio.h>",
        "int main(void) {",
        "    int guess, tries = 0, answer = 42;",
        "    while (tries < 10) {",
        "        printf(\"猜一个数: \");",
        "        scanf(\"%d\", &guess);",
        "        tries++;",
        "        if (guess > answer)      printf(\"大了\\n\");",
        "        else if (guess < answer) printf(\"小了\\n\");",
        "        else { printf(\"猜对了！用了 %d 次\\n\", tries); return 0; }",
        "    }",
        "    printf(\"10次都没猜中，答案是 %d\\n\", answer);",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    "c-p23": {
      level: 1, title: "计算器（switch 版）",
      body: "手写程序读入 操作数1 运算符 操作数2（如 3 + 5），用 switch 计算结果。支持 + - * /，除零要报错。",
      hint: "switch(op) 的 case 用字符 '+', '-', '*', '/'。",
      solution: C("c", "calculator.c", [
        "#include <stdio.h>",
        "int main(void) {",
        "    double a, b; char op;",
        "    scanf(\"%lf %c %lf\", &a, &op, &b);",
        "    switch (op) {",
        "        case '+': printf(\"%.2f\\n\", a + b); break;",
        "        case '-': printf(\"%.2f\\n\", a - b); break;",
        "        case '*': printf(\"%.2f\\n\", a * b); break;",
        "        case '/':",
        "            if (b == 0) printf(\"除零错误!\\n\");",
        "            else printf(\"%.2f\\n\", a / b);",
        "            break;",
        "        default: printf(\"未知运算符\\n\");",
        "    }",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    "c-p24": {
      level: 1, title: "输出菱形图案",
      body: "手写程序读入奇数 n，打印 n 行菱形图案（用 * 号）。例如 n=5 输出一行星、三行星、五行星、三行星、一行星。",
      hint: "先打印上半部分（行号 i 从 0 到 n/2），空格数 = n/2 - i，星数 = 2*i+1。下半对称。",
      solution: C("c", "diamond.c", [
        "#include <stdio.h>",
        "int main(void) {",
        "    int n; scanf(\"%d\", &n);",
        "    int mid = n / 2;",
        "    for (int i = 0; i <= mid; i++) {",
        "        for (int s = 0; s < mid - i; s++) printf(\" \");",
        "        for (int s = 0; s < 2 * i + 1; s++) printf(\"*\");",
        "        printf(\"\\n\");",
        "    }",
        "    for (int i = mid - 1; i >= 0; i--) {",
        "        for (int s = 0; s < mid - i; s++) printf(\" \");",
        "        for (int s = 0; s < 2 * i + 1; s++) printf(\"*\");",
        "        printf(\"\\n\");",
        "    }",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    "c-p25": {
      level: 1, title: "斐波那契数列（循环版）",
      body: "手写程序打印前 20 个斐波那契数。不许用递归。",
      hint: "f(0)=0, f(1)=1, f(n)=f(n-1)+f(n-2)。用三个变量滚动。",
      solution: C("c", "fibonacci_iter.c", [
        "#include <stdio.h>",
        "int main(void) {",
        "    long long a = 0, b = 1;",
        "    for (int i = 0; i < 20; i++) {",
        "        printf(\"%lld \", a);",
        "        long long next = a + b;",
        "        a = b; b = next;",
        "    }",
        "    printf(\"\\n\");",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    "c-p26": {
      level: 1, title: "水仙花数",
      body: "手写程序找出所有三位数水仙花数（各位数字立方和等于该数本身，如 153 = 1³+5³+3³）。",
      hint: "用 / 和 % 拆出百位、十位、个位。",
      solution: C("c", "narcissistic.c", [
        "#include <stdio.h>",
        "int main(void) {",
        "    for (int n = 100; n <= 999; n++) {",
        "        int a = n / 100, b = (n / 10) % 10, c = n % 10;",
        "        if (a*a*a + b*b*b + c*c*c == n) printf(\"%d \", n);",
        "    }",
        "    printf(\"\\n\");",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    "c-p27": {
      level: 1, title: "素数判断与打印",
      body: "手写函数 <code class='inline'>int is_prime(int n)</code> 判断素数，再打印 1~100 之间的所有素数。",
      hint: "只需试除到 sqrt(n)。1 不是素数。2 是素数。",
      solution: C("c", "prime.c", [
        "#include <stdio.h>",
        "#include <math.h>",
        "int is_prime(int n) {",
        "    if (n < 2) return 0;",
        "    if (n == 2) return 1;",
        "    for (int i = 2; i <= (int)sqrt(n); i++)",
        "        if (n % i == 0) return 0;",
        "    return 1;",
        "}",
        "int main(void) {",
        "    for (int i = 1; i <= 100; i++)",
        "        if (is_prime(i)) printf(\"%d \", i);",
        "    printf(\"\\n\");",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    "c-p28": {
      level: 1, title: "打印质因数分解",
      body: "手写程序读入一个正整数 n，输出它的质因数分解式。例如 60 = 2×2×3×5。",
      hint: "从 2 开始试除，能整除就输出并继续除，不能就 i++。",
      solution: C("c", "prime_factor.c", [
        "#include <stdio.h>",
        "int main(void) {",
        "    int n; scanf(\"%d\", &n);",
        "    printf(\"%d = \", n);",
        "    int first = 1;",
        "    for (int i = 2; i <= n; i++) {",
        "        while (n % i == 0) {",
        "            if (!first) printf(\" x \");",
        "            printf(\"%d\", i);",
        "            first = 0; n /= i;",
        "        }",
        "    }",
        "    printf(\"\\n\");",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    "c-p29": {
      level: 1, title: "数制转换（十→二、八、十六）",
      body: "手写三个函数分别将十进制数转换为二进制、八进制、十六进制字符串并输出。不许用 printf 的 %o %x 格式符。",
      hint: "反复 % 取余 / 除，余数倒序排列。可以用一个 char 数组存结果。",
      solution: C("c", "base_convert.c", [
        "#include <stdio.h>",
        "#include <string.h>",
        "void to_base(unsigned int n, int base) {",
        "    char buf[33]; int pos = 0;",
        "    char digits[] = \"0123456789ABCDEF\";",
        "    if (n == 0) { printf(\"0\\n\"); return; }",
        "    while (n > 0) { buf[pos++] = digits[n % base]; n /= base; }",
        "    for (int i = pos - 1; i >= 0; i--) putchar(buf[i]);",
        "    putchar('\\n');",
        "}",
        "int main(void) {",
        "    unsigned int n; scanf(\"%u\", &n);",
        "    printf(\"二进制: \"); to_base(n, 2);",
        "    printf(\"八进制: \"); to_base(n, 8);",
        "    printf(\"十六进制: \"); to_base(n, 16);",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    "c-p30": {
      level: 1, title: "辗转相除法求最大公约数",
      body: "手写 <code class='inline'>int gcd(int a, int b)</code> 用辗转相除法求最大公约数。",
      hint: "gcd(a,b) = gcd(b, a%b)，直到 b==0 时返回 a。",
      solution: C("c", "gcd.c", [
        "int gcd(int a, int b) {",
        "    while (b != 0) {",
        "        int t = a % b; a = b; b = t;",
        "    }",
        "    return a;",
        "}"
      ].join("\n"))
    },

    /* ==================== C 语言 · 数组与字符串 ==================== */

    "c-p31": {
      level: 1, title: "数组求和、平均值、最值",
      body: "手写程序读入 10 个整数存入数组，计算并输出：总和、平均值、最大值及其下标、最小值及其下标。",
      hint: "一遍遍历同时维护 max/min 及其下标。",
      solution: C("c", "array_stats.c", [
        "#include <stdio.h>",
        "int main(void) {",
        "    int a[10], sum = 0;",
        "    for (int i = 0; i < 10; i++) { scanf(\"%d\", &a[i]); sum += a[i]; }",
        "    int max_i = 0, min_i = 0;",
        "    for (int i = 1; i < 10; i++) {",
        "        if (a[i] > a[max_i]) max_i = i;",
        "        if (a[i] < a[min_i]) min_i = i;",
        "    }",
        "    printf(\"sum=%d avg=%.1f\\n\", sum, sum / 10.0);",
        "    printf(\"max=a[%d]=%d min=a[%d]=%d\\n\", max_i, a[max_i], min_i, a[min_i]);",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    "c-p32": {
      level: 1, title: "数组逆序（原地）",
      body: "手写 <code class='inline'>void reverse(int *arr, int n)</code>，原地将数组逆序。不许用额外数组。",
      hint: "双指针：一头一尾交换，向中间靠拢。",
      solution: C("c", "reverse_array.c", [
        "void reverse(int *arr, int n) {",
        "    int left = 0, right = n - 1;",
        "    while (left < right) {",
        "        int t = arr[left]; arr[left] = arr[right]; arr[right] = t;",
        "        left++; right--;",
        "    }",
        "}"
      ].join("\n"))
    },

    "c-p33": {
      level: 1, title: "冒泡排序",
      body: "手写冒泡排序函数 <code class='inline'>void bubble_sort(int *arr, int n)</code>，从小到大排序。加提前退出优化。",
      hint: "外层 n-1 趟，内层两两比较交换；如果某趟没有交换就提前结束。",
      solution: C("c", "bubble_sort.c", [
        "void bubble_sort(int *arr, int n) {",
        "    for (int i = 0; i < n - 1; i++) {",
        "        int swapped = 0;",
        "        for (int j = 0; j < n - 1 - i; j++) {",
        "            if (arr[j] > arr[j + 1]) {",
        "                int t = arr[j]; arr[j] = arr[j+1]; arr[j+1] = t;",
        "                swapped = 1;",
        "            }",
        "        }",
        "        if (!swapped) break;  // 已经有序，提前退出",
        "    }",
        "}"
      ].join("\n"))
    },

    "c-p34": {
      level: 2, title: "选择排序",
      body: "手写选择排序函数 <code class='inline'>void selection_sort(int *arr, int n)</code>。",
      hint: "每趟从未排序区找最小值，放到已排序区末尾。",
      solution: C("c", "selection_sort.c", [
        "void selection_sort(int *arr, int n) {",
        "    for (int i = 0; i < n - 1; i++) {",
        "        int min_idx = i;",
        "        for (int j = i + 1; j < n; j++)",
        "            if (arr[j] < arr[min_idx]) min_idx = j;",
        "        if (min_idx != i) {",
        "            int t = arr[i]; arr[i] = arr[min_idx]; arr[min_idx] = t;",
        "        }",
        "    }",
        "}"
      ].join("\n"))
    },

    "c-p35": {
      level: 2, title: "插入排序",
      body: "手写插入排序函数 <code class='inline'>void insertion_sort(int *arr, int n)</code>。",
      hint: "把当前元素插入到前面已排序序列的正确位置，后面的元素后移。",
      solution: C("c", "insertion_sort.c", [
        "void insertion_sort(int *arr, int n) {",
        "    for (int i = 1; i < n; i++) {",
        "        int key = arr[i], j = i - 1;",
        "        while (j >= 0 && arr[j] > key) {",
        "            arr[j + 1] = arr[j]; j--;",
        "        }",
        "        arr[j + 1] = key;",
        "    }",
        "}"
      ].join("\n"))
    },

    "c-p36": {
      level: 1, title: "查找数组中的重复元素",
      body: "手写程序找出数组中所有出现次数大于 1 的元素及其次数。数组元素范围 0~99。",
      hint: "开一个 count[100] 统计每个数出现的次数。",
      solution: C("c", "find_duplicates.c", [
        "#include <stdio.h>",
        "void find_dup(const int *arr, int n) {",
        "    int count[100] = {0};",
        "    for (int i = 0; i < n; i++) count[arr[i]]++;",
        "    for (int i = 0; i < 100; i++)",
        "        if (count[i] > 1) printf(\"%d 出现 %d 次\\n\", i, count[i]);",
        "}"
      ].join("\n"))
    },

    "c-p37": {
      level: 1, title: "删除数组中的指定元素",
      body: "手写 <code class='inline'>int remove_element(int *arr, int n, int val)</code>，删除数组中所有等于 val 的元素，返回新长度。要求原地操作。",
      hint: "双指针：一个读一个写，读到不等于 val 的就写到写指针处。",
      solution: C("c", "remove_element.c", [
        "int remove_element(int *arr, int n, int val) {",
        "    int write = 0;",
        "    for (int read = 0; read < n; read++) {",
        "        if (arr[read] != val) arr[write++] = arr[read];",
        "    }",
        "    return write;",
        "}"
      ].join("\n"))
    },

    "c-p38": {
      level: 1, title: "合并两个有序数组",
      body: "手写 <code class='inline'>void merge_sorted(const int *a, int na, const int *b, int nb, int *out)</code>，将两个升序数组合并成一个升序数组。",
      hint: "双指针，每次取较小的放入 out，剩余的直接拷贝。",
      solution: C("c", "merge_sorted.c", [
        "void merge_sorted(const int *a, int na, const int *b, int nb, int *out) {",
        "    int i = 0, j = 0, k = 0;",
        "    while (i < na && j < nb)",
        "        out[k++] = (a[i] <= b[j]) ? a[i++] : b[j++];",
        "    while (i < na) out[k++] = a[i++];",
        "    while (j < nb) out[k++] = b[j++];",
        "}"
      ].join("\n"))
    },

    "c-p39": {
      level: 1, title: "统计字符串中各字符出现次数",
      body: "手写程序读入一行字符串，统计每个字符出现的次数并输出。只统计可见 ASCII 字符（32~126）。",
      hint: "开 int count[95] = {0}，遍历字符串累加。",
      solution: C("c", "char_count.c", [
        "#include <stdio.h>",
        "#include <string.h>",
        "int main(void) {",
        "    char s[1000];",
        "    fgets(s, sizeof(s), stdin);",
        "    int count[95] = {0};",
        "    for (int i = 0; s[i]; i++) {",
        "        if (s[i] >= 32 && s[i] <= 126) count[s[i] - 32]++;",
        "    }",
        "    for (int i = 0; i < 95; i++)",
        "        if (count[i] > 0) printf(\"'%c': %d\\n\", i + 32, count[i]);",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    "c-p40": {
      level: 1, title: "字符串反转",
      body: "手写 <code class='inline'>void str_reverse(char *s)</code>，原地反转字符串。",
      hint: "双指针交换，和数组逆序一样。",
      solution: C("c", "str_reverse.c", [
        "#include <string.h>",
        "void str_reverse(char *s) {",
        "    int len = strlen(s);",
        "    for (int i = 0; i < len / 2; i++) {",
        "        char t = s[i]; s[i] = s[len-1-i]; s[len-1-i] = t;",
        "    }",
        "}"
      ].join("\n"))
    },

    "c-p41": {
      level: 2, title: "判断回文字符串",
      body: "手写 <code class='inline'>int is_palindrome(const char *s)</code>，判断字符串是否是回文（正读反读相同）。忽略大小写。",
      hint: "双指针从两端向中间比较。可以用 tolower 统一大小写。",
      solution: C("c", "palindrome.c", [
        "#include <ctype.h>",
        "int is_palindrome(const char *s) {",
        "    int left = 0, right = strlen(s) - 1;",
        "    while (left < right) {",
        "        if (tolower(s[left]) != tolower(s[right])) return 0;",
        "        left++; right--;",
        "    }",
        "    return 1;",
        "}"
      ].join("\n"))
    },

    "c-p42": {
      level: 2, title: "字符串中找子串（暴力匹配）",
      body: "手写 <code class='inline'>int str_find(const char *haystack, const char *needle)</code>，在 haystack 中找 needle 第一次出现的位置（下标），找不到返回 -1。不许用 strstr。",
      hint: "对每个起始位置，逐字符比对 needle 的每个字符。",
      solution: C("c", "str_find.c", [
        "int str_find(const char *haystack, const char *needle) {",
        "    int hlen = strlen(haystack), nlen = strlen(needle);",
        "    if (nlen == 0) return 0;",
        "    for (int i = 0; i <= hlen - nlen; i++) {",
        "        int j = 0;",
        "        while (j < nlen && haystack[i+j] == needle[j]) j++;",
        "        if (j == nlen) return i;",
        "    }",
        "    return -1;",
        "}"
      ].join("\n"))
    },

    "c-p43": {
      level: 2, title: "字符串转整数（atoi 实现）",
      body: "手写 <code class='inline'>int my_atoi(const char *s)</code>，将字符串转为整数。处理前导空格、正负号、非法字符。",
      hint: "跳过空格 → 判断正负 → 逐字符 '0'~'9' 累积 → 遇到非法字符停止。",
      solution: C("c", "my_atoi.c", [
        "int my_atoi(const char *s) {",
        "    int sign = 1, result = 0, i = 0;",
        "    while (s[i] == ' ') i++;",
        "    if (s[i] == '-' || s[i] == '+') {",
        "        if (s[i] == '-') sign = -1; i++;",
        "    }",
        "    while (s[i] >= '0' && s[i] <= '9') {",
        "        result = result * 10 + (s[i] - '0');",
        "        i++;",
        "    }",
        "    return sign * result;",
        "}"
      ].join("\n"))
    },

    "c-p44": {
      level: 2, title: "去除字符串首尾空格",
      body: "手写 <code class='inline'>void trim(char *s)</code>，去除字符串开头和结尾的空格，中间的空格保留。",
      hint: "先用两个指针找到第一个和最后一个非空格字符，然后 memmove。",
      solution: C("c", "trim.c", [
        "#include <string.h>",
        "void trim(char *s) {",
        "    char *start = s;",
        "    while (*start == ' ') start++;",
        "    char *end = s + strlen(s) - 1;",
        "    while (end > start && *end == ' ') end--;",
        "    int len = end - start + 1;",
        "    memmove(s, start, len);",
        "    s[len] = '\\0';",
        "}"
      ].join("\n"))
    },

    "c-p45": {
      level: 2, title: "单词计数与最长单词",
      body: "手写程序统计一行文本中的单词个数，并找出最长的单词。单词以空格分隔。",
      hint: "遍历字符串，遇到空格就结束当前单词，比较长度。",
      solution: C("c", "word_count.c", [
        "#include <stdio.h>",
        "#include <string.h>",
        "int main(void) {",
        "    char s[500], longest[100] = \"\";",
        "    fgets(s, sizeof(s), stdin);",
        "    int count = 0, max_len = 0;",
        "    char *token = strtok(s, \" \\t\\n\");",
        "    while (token) {",
        "        count++;",
        "        if (strlen(token) > max_len) {",
        "            max_len = strlen(token); strcpy(longest, token);",
        "        }",
        "        token = strtok(NULL, \" \\t\\n\");",
        "    }",
        "    printf(\"单词数: %d, 最长: %s (%d字符)\\n\", count, longest, max_len);",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    /* ==================== C 语言 · 函数与递归 ==================== */

    "c-p46": {
      level: 1, title: "函数：交换两个变量",
      body: "手写 <code class='inline'>void swap(int *a, int *b)</code> 交换两个 int 的值。解释为什么必须传指针。",
      hint: "C 函数参数是值拷贝，不改指针指向的内容就无法影响外部变量。",
      solution: C("c", "swap.c", [
        "void swap(int *a, int *b) {",
        "    int t = *a; *a = *b; *b = t;",
        "}",
        "/* 必须传指针：",
        " * C 的参数传递是“值拷贝”，",
        " * 直接传 int 只会拷贝一份，函数内的修改对外部无效。 */"
      ].join("\n"))
    },

    "c-p47": {
      level: 2, title: "递归：阶乘",
      body: "手写递归函数 <code class='inline'>long long factorial(int n)</code> 计算 n 的阶乘。加上边界条件。",
      hint: "factorial(0)=1，factorial(n)=n*factorial(n-1)。",
      solution: C("c", "factorial.c", [
        "long long factorial(int n) {",
        "    if (n <= 1) return 1;        // 边界条件",
        "    return n * factorial(n - 1);",
        "}"
      ].join("\n"))
    },

    "c-p48": {
      level: 2, title: "递归：斐波那契（含记忆化）",
      body: "先手写朴素递归 fib(n)，分析它的时间复杂度。然后手写记忆化版本，用数组缓存已计算结果。",
      hint: "朴素递归是 O(2^n)，大量重复计算。记忆化后 O(n)。",
      solution: C("c", "fib_memo.c", [
        "/* 朴素递归：O(2^n)，大量重复计算 */",
        "long long fib_naive(int n) {",
        "    if (n <= 1) return n;",
        "    return fib_naive(n-1) + fib_naive(n-2);",
        "}",
        "",
        "/* 记忆化：O(n) */",
        "long long memo[100];",
        "long long fib_memo(int n) {",
        "    if (n <= 1) return n;",
        "    if (memo[n] != 0) return memo[n];",
        "    memo[n] = fib_memo(n-1) + fib_memo(n-2);",
        "    return memo[n];",
        "}"
      ].join("\n"))
    },

    "c-p49": {
      level: 2, title: "递归：汉诺塔",
      body: "手写汉诺塔递归函数，打印每一步的移动。3 个盘子时输出应该是什么？",
      hint: "把 n-1 个盘子从 A 移到 B，把第 n 个从 A 移到 C，再把 n-1 个从 B 移到 C。",
      solution: C("c", "hanoi.c", [
        "#include <stdio.h>",
        "void hanoi(int n, char from, char to, char aux) {",
        "    if (n == 0) return;",
        "    hanoi(n - 1, from, aux, to);",
        "    printf(\"%d: %c -> %c\\n\", n, from, to);",
        "    hanoi(n - 1, aux, to, from);",
        "}",
        "int main(void) { hanoi(3, 'A', 'C', 'B'); return 0; }"
      ].join("\n"))
    },

    "c-p50": {
      level: 2, title: "递归：二分查找",
      body: "手写递归版二分查找 <code class='inline'>int binary_search(const int *arr, int lo, int hi, int target)</code>。",
      hint: "mid = (lo+hi)/2，比较 arr[mid] 与 target，缩小范围递归。",
      solution: C("c", "binary_search.c", [
        "int binary_search(const int *arr, int lo, int hi, int target) {",
        "    if (lo > hi) return -1;",
        "    int mid = lo + (hi - lo) / 2;  // 防溢出写法",
        "    if (arr[mid] == target) return mid;",
        "    if (arr[mid] > target) return binary_search(arr, lo, mid - 1, target);",
        "    return binary_search(arr, mid + 1, hi, target);",
        "}"
      ].join("\n"))
    },

    "c-p51": {
      level: 2, title: "递归：快速排序",
      body: "手写快速排序 <code class='inline'>void quick_sort(int *arr, int lo, int hi)</code>。",
      hint: "选基准 pivot，分区（小的放左大的放右），递归左右两半。",
      solution: C("c", "quick_sort.c", [
        "void quick_sort(int *arr, int lo, int hi) {",
        "    if (lo >= hi) return;",
        "    int pivot = arr[(lo + hi) / 2];",
        "    int i = lo, j = hi;",
        "    while (i <= j) {",
        "        while (arr[i] < pivot) i++;",
        "        while (arr[j] > pivot) j--;",
        "        if (i <= j) {",
        "            int t = arr[i]; arr[i] = arr[j]; arr[j] = t;",
        "            i++; j--;",
        "        }",
        "    }",
        "    quick_sort(arr, lo, j);",
        "    quick_sort(arr, i, hi);",
        "}"
      ].join("\n"))
    },

    "c-p52": {
      level: 2, title: "递归：字符串逆序输出",
      body: "手写递归函数逆序输出字符串（不改原字符串）。例如输入 \"hello\"，输出 \"olleh\"。",
      hint: "先递归到末尾，再逐字符打印。",
      solution: C("c", "reverse_print.c", [
        "#include <stdio.h>",
        "void reverse_print(const char *s) {",
        "    if (*s == '\\0') return;",
        "    reverse_print(s + 1);",
        "    putchar(*s);",
        "}"
      ].join("\n"))
    },

    "c-p53": {
      level: 2, title: "递归：十进制转二进制",
      body: "手写递归函数将十进制数转为二进制并输出。不许用数组存结果。",
      hint: "先递归处理高位，再输出最低位。",
      solution: C("c", "dec_to_bin.c", [
        "#include <stdio.h>",
        "void print_binary(unsigned int n) {",
        "    if (n > 1) print_binary(n / 2);",
        "    printf(\"%d\", n % 2);",
        "}"
      ].join("\n"))
    },

    "c-p54": {
      level: 1, title: "函数指针：排序规则切换",
      body: "手写一个 <code class='inline'>void sort(int *arr, int n, int (*cmp)(int, int))</code>，用冒泡排序实现，但比较规则由函数指针决定。调用时传不同的比较函数实现升序和降序。",
      hint: "cmp(a,b) 返回正数表示 a 在 b 后面。升序：a-b；降序：b-a。",
      solution: C("c", "sort_func_ptr.c", [
        "void sort(int *arr, int n, int (*cmp)(int, int)) {",
        "    for (int i = 0; i < n - 1; i++)",
        "        for (int j = 0; j < n - 1 - i; j++)",
        "            if (cmp(arr[j], arr[j+1]) > 0) {",
        "                int t = arr[j]; arr[j] = arr[j+1]; arr[j+1] = t;",
        "            }",
        "}",
        "int ascending(int a, int b)  { return a - b; }",
        "int descending(int a, int b) { return b - a; }",
        "/* 用法：sort(arr, n, ascending);  或  sort(arr, n, descending); */"
      ].join("\n"))
    },

    "c-p55": {
      level: 2, featured: true, title: "函数指针数组：简易计算器",
      body: "手写一个计算器：用函数指针数组存储 +、-、*、/ 四个运算，用户输入运算符的下标（0~3）和两个操作数，程序通过函数指针数组调用对应函数。",
      hint: "定义 typedef int (*op_t)(int,int); 然后 op_t ops[4] = {add, sub, mul, div};",
      solution: C("c", "calc_func_ptr.c", [
        "#include <stdio.h>",
        "typedef int (*op_t)(int, int);",
        "int add(int a, int b) { return a + b; }",
        "int sub(int a, int b) { return a - b; }",
        "int mul(int a, int b) { return a * b; }",
        "int div(int a, int b) { return b ? a / b : 0; }",
        "",
        "int main(void) {",
        "    op_t ops[4] = { add, sub, mul, div };",
        "    char symbols[4] = { '+', '-', '*', '/' };",
        "    int op_idx, a, b;",
        "    printf(\"选择运算 (0=+ 1=- 2=* 3=/): \");",
        "    scanf(\"%d\", &op_idx);",
        "    printf(\"输入两个数: \");",
        "    scanf(\"%d %d\", &a, &b);",
        "    printf(\"%d %c %d = %d\\n\", a, symbols[op_idx], b, ops[op_idx](a, b));",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    /* ==================== C 语言 · 指针基础 ==================== */

    "c-p56": {
      level: 1, title: "指针与数组的关系验证",
      body: "手写程序验证：arr[i] 和 *(arr+i) 完全等价；&arr[i] 和 arr+i 完全等价。分别打印它们的值来对比。",
      hint: "对同一个数组同时用下标和指针运算访问，打印地址和值。",
      solution: C("c", "ptr_array_equiv.c", [
        "#include <stdio.h>",
        "int main(void) {",
        "    int arr[5] = {10, 20, 30, 40, 50};",
        "    for (int i = 0; i < 5; i++) {",
        "        printf(\"arr[%d]=%d  *(arr+%d)=%d\\n\", i, arr[i], i, *(arr + i));",
        "        printf(\"&arr[%d]=%p  arr+%d=%p\\n\", i, (void*)&arr[i], i, (void*)(arr + i));",
        "    }",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    "c-p57": {
      level: 1, title: "指针加减法：元素步长实验",
      body: "手写程序验证：对 int* 指针加 1，地址实际增加 sizeof(int) 字节（通常是 4）。对 double* 呢？对 char* 呢？",
      hint: "打印 p 和 p+1 的地址差，用 %zu 打印 sizeof。",
      solution: C("c", "ptr_arith.c", [
        "#include <stdio.h>",
        "int main(void) {",
        "    int a[3] = {1,2,3};",
        "    double b[3] = {1.0,2.0,3.0};",
        "    char c[3] = {'a','b','c'};",
        "    printf(\"int*:   %p -> %p, diff=%zu bytes (sizeof=%zu)\\n\",",
        "           (void*)a, (void*)(a+1), (size_t)((char*)(a+1)-(char*)a), sizeof(int));",
        "    printf(\"double*: %p -> %p, diff=%zu bytes (sizeof=%zu)\\n\",",
        "           (void*)b, (void*)(b+1), (size_t)((char*)(b+1)-(char*)b), sizeof(double));",
        "    printf(\"char*:  %p -> %p, diff=%zu bytes (sizeof=%zu)\\n\",",
        "           (void*)c, (void*)(c+1), (size_t)((char*)(c+1)-(char*)c), sizeof(char));",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    "c-p58": {
      level: 1, title: "二级指针：修改一级指针的指向",
      body: "手写 <code class='inline'>void set_ptr(int **pp, int *p)</code>，通过二级指针修改一级指针的指向。main 中验证效果。",
      hint: "**pp 就是 *p 的地址，给 *pp 赋值就是修改 p 的值。",
      solution: C("c", "double_ptr.c", [
        "#include <stdio.h>",
        "void set_ptr(int **pp, int *p) { *pp = p; }",
        "int main(void) {",
        "    int a = 10, b = 20;",
        "    int *p = &a;",
        "    printf(\"before: *p=%d\\n\", *p);",
        "    set_ptr(&p, &b);",
        "    printf(\"after:  *p=%d\\n\", *p);",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    "c-p59": {
      level: 2, title: "二级指针：交换两个字符串指针",
      body: "手写 <code class='inline'>void swap_str(char **a, char **b)</code>，交换两个字符指针的指向。",
      hint: "传 &str1, &str2，函数内交换 *a 和 *b。",
      solution: C("c", "swap_str_ptr.c", [
        "void swap_str(char **a, char **b) {",
        "    char *t = *a; *a = *b; *b = t;",
        "}",
        "/* 用法：",
        " * char *s1 = \"hello\", *s2 = \"world\";",
        " * swap_str(&s1, &s2);",
        " * 现在 s1 指向 \"world\"，s2 指向 \"hello\" */"
      ].join("\n"))
    },

    "c-p60": {
      level: 2, featured: true, title: "void* 与通用交换函数",
      body: "手写一个通用交换函数 <code class='inline'>void generic_swap(void *a, void *b, size_t size)</code>，用 memcpy 按字节交换任意类型的两个变量。",
      hint: "void* 不知道类型，所以用 memcpy 按 size 字节交换。",
      solution: C("c", "generic_swap.c", [
        "#include <string.h>",
        "#include <stddef.h>",
        "void generic_swap(void *a, void *b, size_t size) {",
        "    unsigned char tmp[size];  // VLA，也可以 malloc",
        "    memcpy(tmp, a, size);",
        "    memcpy(a, b, size);",
        "    memcpy(b, tmp, size);",
        "}",
        "/* 用法：",
        " * int x=1, y=2;     generic_swap(&x, &y, sizeof(int));",
        " * double m=1.5,n=2.5; generic_swap(&m, &n, sizeof(double)); */"
      ].join("\n"))
    },

    "c-p61": {
      level: 1, title: "const 指针的三种写法辨析",
      body: "辨析 <code class='inline'>const int *p</code>、<code class='inline'>int *const p</code>、<code class='inline'>const int *const p</code> 三者的区别。写一个小程序证明。",
      hint: "const 在 * 左边 → 指向的内容不可改；const 在 * 右边 → 指针本身不可改。",
      solution: C("c", "const_ptr.c", [
        "#include <stdio.h>",
        "int main(void) {",
        "    int a = 10, b = 20;",
        "",
        "    const int *p1 = &a;  // 指向常量的指针：不能通过 p1 改 a，但可以改指向",
        "    p1 = &b;             // OK：改指向",
        "    // *p1 = 30;         // 编译错误：不能改内容",
        "",
        "    int *const p2 = &a;  // 常量指针：指针本身不能改，但可以通过它改内容",
        "    *p2 = 30;            // OK：改内容",
        "    // p2 = &b;          // 编译错误：不能改指向",
        "",
        "    const int *const p3 = &a;  // 都不能改",
        "    // p3 = &b;  *p3 = 30;     // 都编译错误",
        "",
        "    printf(\"a=%d b=%d\\n\", a, b);",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    "c-p62": {
      level: 2, title: "指针与二维数组：行指针",
      body: "解释 <code class='inline'>int (*p)[3]</code> 和 <code class='inline'>int *p[3]</code> 的区别。写程序用行指针遍历一个 2×3 的二维数组。",
      hint: "int (*p)[3] 是指向含 3 个 int 的数组的指针；int *p[3] 是 3 个 int* 的数组。",
      solution: C("c", "ptr_2d.c", [
        "#include <stdio.h>",
        "int main(void) {",
        "    int arr[2][3] = {{1,2,3},{4,5,6}};",
        "    int (*p)[3] = arr;       // 行指针：指向含3个int的数组",
        "",
        "    for (int i = 0; i < 2; i++)",
        "        for (int j = 0; j < 3; j++)",
        "            printf(\"arr[%d][%d]=%d  *(*(p+%d)+%d)=%d\\n\",",
        "                   i, j, arr[i][j], i, j, *(*(p + i) + j));",
        "    return 0;",
        "}",
        "/* int (*p)[3] = 指向 int[3] 的指针（行指针）",
        " * int *p[3]  = 3 个 int* 组成的数组",
        " * 优先级：[] 高于 *，所以 int *p[3] 先是数组 */"
      ].join("\n"))
    },

    "c-p63": {
      level: 2, featured: true, title: "手写 memcpy 和 memmove",
      body: "手写 <code class='inline'>void *my_memcpy(void *dst, const void *src, size_t n)</code> 和 <code class='inline'>void *my_memmove(void *dst, const void *src, size_t n)</code>。解释什么时候 memcpy 会出错、为什么 memmove 不会。",
      hint: "memcpy 从前往后拷贝，dst 和 src 重叠时会覆盖未读数据；memmove 判断方向后从后往前拷贝。",
      solution: C("c", "my_memcpy_move.c", [
        "#include <stddef.h>",
        "void *my_memcpy(void *dst, const void *src, size_t n) {",
        "    unsigned char *d = dst;",
        "    const unsigned char *s = src;",
        "    for (size_t i = 0; i < n; i++) d[i] = s[i];",
        "    return dst;",
        "}",
        "void *my_memmove(void *dst, const void *src, size_t n) {",
        "    unsigned char *d = dst;",
        "    const unsigned char *s = src;",
        "    if (d < s) {",
        "        for (size_t i = 0; i < n; i++) d[i] = s[i];  // 从前往后",
        "    } else {",
        "            for (size_t i = n; i > 0; i--) d[i-1] = s[i-1];  // 从后往前",
        "        }",
        "    return dst;",
        "}"
      ].join("\n"))
    },

    "c-p64": {
      level: 2, title: "函数返回指针的陷阱",
      body: "下面的代码有什么问题？手写修正版。",
      hint: "返回局部变量的地址 → 悬垂指针。改成 static、malloc 或让调用者传入缓冲区。",
      solution: C("c", "return_ptr_fix.c", [
        "/* 错误：返回局部变量地址（函数返回后栈被回收）",
        " * int *get_ptr(void) { int x = 42; return &x; }  // BUG! */",
        "",
        "/* 修正1：static 变量 */",
        "int *get_static(void) {",
        "    static int x = 42;  // 静态变量生命周期是整个程序",
        "    return &x;",
        "}",
        "",
        "/* 修正2：让调用者提供缓冲区 */",
        "void get_value(int *out) { *out = 42; }",
        "",
        "/* 修正3：malloc（调用者负责 free） */",
        "#include <stdlib.h>",
        "int *get_malloc(void) {",
        "    int *p = malloc(sizeof(int));",
        "    if (p) *p = 42;",
        "    return p;",
        "}"
      ].join("\n"))
    },

    "c-p65": {
      level: 1, title: "指针数组 vs 数组指针",
      body: "手写程序对比：char *names[3] 和 char (*names)[3] 的内存布局、sizeof 结果、访问方式。",
      hint: "sizeof(char*[3]) = 3*8=24（64位）；sizeof(char[2][3]) = 6。",
      solution: C("c", "ptr_array_vs_array_ptr.c", [
        "#include <stdio.h>",
        "int main(void) {",
        "    char *names[3] = {\"Alice\", \"Bob\", \"Carol\"};",
        "    printf(\"sizeof(names) = %zu\\n\", sizeof(names));  // 24 (3个指针)",
        "    printf(\"names[0] = %s\\n\", names[0]);",
        "",
        "    char tags[2][3] = {{'a','b','c'},{'d','e','f'}};",
        "    printf(\"sizeof(tags) = %zu\\n\", sizeof(tags));   // 6 (2x3个char)",
        "    printf(\"tags[0] = %.3s\\n\", tags[0]);",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    "c-p66": {
      level: 2, title: "手写 strchr 和 strstr",
      body: "手写 <code class='inline'>char *my_strchr(const char *s, int c)</code> 和简化版 <code class='inline'>char *my_strstr(const char *hay, const char *needle)</code>。",
      hint: "strchr：逐字符找，找到返回该位置指针。strstr：对每个起始位置调用类似 strcmp 的比较。",
      solution: C("c", "my_strchr_strstr.c", [
        "char *my_strchr(const char *s, int c) {",
        "    while (*s) {",
        "        if (*s == (char)c) return (char*)s;",
        "        s++;",
        "    }",
        "    return (c == 0) ? (char*)s : 0;  // 找 \\0 的情况",
        "}",
        "char *my_strstr(const char *hay, const char *needle) {",
        "    if (!*needle) return (char*)hay;",
        "    for (; *hay; hay++) {",
        "        const char *h = hay, *n = needle;",
        "        while (*h && *n && *h == *n) { h++; n++; }",
        "        if (!*n) return (char*)hay;",
        "    }",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    "c-p67": {
      level: 1, title: "sizeof 与数组退化的实验",
      body: "手写程序验证：在函数参数中，数组退化为指针。对比 sizeof(arr) 在 main 中和在函数中的结果。",
      hint: "main 中 sizeof(arr) 是整个数组；函数参数中的 arr 是指针，sizeof 是 8（64位）。",
      solution: C("c", "sizeof_decay.c", [
        "#include <stdio.h>",
        "void func(int arr[]) {",
        "    printf(\"func: sizeof(arr) = %zu\\n\", sizeof(arr));  // 8（64位指针）",
        "}",
        "int main(void) {",
        "    int a[10];",
        "    printf(\"main: sizeof(a) = %zu\\n\", sizeof(a));   // 40 (10*4)",
        "    func(a);",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    "c-p68": {
      level: 2, title: "手写 strdup",
      body: "手写 <code class='inline'>char *my_strdup(const char *s)</code>，分配足够内存并拷贝字符串。",
      hint: "先 strlen 算长度，malloc(len+1)，strcpy。",
      solution: C("c", "my_strdup.c", [
        "#include <stdlib.h>",
        "#include <string.h>",
        "char *my_strdup(const char *s) {",
        "    size_t len = strlen(s) + 1;",
        "    char *p = malloc(len);",
        "    if (p) memcpy(p, s, len);",
        "    return p;  // 调用者负责 free",
        "}"
      ].join("\n"))
    },

    "c-p69": {
      level: 2, title: "指针减法：测量字符串长度差",
      body: "手写 <code class='inline'>size_t ptr_strlen(const char *s)</code>，只用指针运算（不用下标、不用 strlen），通过指针差值计算字符串长度。",
      hint: "从 s 出发找到 \\0，返回 end - start。",
      solution: C("c", "ptr_strlen.c", [
        "#include <stddef.h>",
        "size_t ptr_strlen(const char *s) {",
        "    const char *p = s;",
        "    while (*p) p++;",
        "    return (size_t)(p - s);  // 指针差 = 元素个数",
        "}"
      ].join("\n"))
    },

    "c-p70": {
      level: 2, title: "多级指针：三维数组访问",
      body: "用三级指针 <code class='inline'>int ***p</code> 访问一个动态分配的三维数组 [2][3][4]。解释每一步解引用的含义。",
      hint: "***p 是 int；**p 是 int*；*p 是 int**；p 是 int***。",
      solution: C("c", "triple_ptr.c", [
        "#include <stdlib.h>",
        "int main(void) {",
        "    // 分配 2x3x4 三维数组",
        "    int ***p = malloc(2 * sizeof(int**));",
        "    for (int i = 0; i < 2; i++) {",
        "        p[i] = malloc(3 * sizeof(int*));",
        "        for (int j = 0; j < 3; j++)",
        "            p[i][j] = malloc(4 * sizeof(int));",
        "    }",
        "    p[1][2][3] = 42;",
        "    // 等价于 *(*(*(p+1)+2)+3) = 42;",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    /* ==================== C 语言 · 内存管理 ==================== */

    "c-p71": {
      level: 2, title: "malloc/calloc/realloc 辨析",
      body: "手写程序演示 malloc、calloc、realloc 的用法和区别。什么时候用哪个？",
      hint: "malloc 不初始化；calloc 清零；realloc 调整大小可能搬家。",
      solution: C("c", "alloc_demo.c", [
        "#include <stdlib.h>",
        "#include <stdio.h>",
        "int main(void) {",
        "    int *a = malloc(5 * sizeof(int));       // 不初始化，内容是垃圾",
        "    int *b = calloc(5, sizeof(int));        // 全部清零",
        "    printf(\"b[0]=%d\\n\", b[0]);             // 输出 0",
        "    a = realloc(a, 10 * sizeof(int));       // 扩容到 10 个",
        "    free(a); free(b);",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    "c-p72": {
      level: 2, title: "手写动态数组（可增长）",
      body: "手写一个动态数组结构体：支持 init、push_back、pop_back、size、free_all。自动扩容（2倍策略）。",
      hint: "capacity 满了就 realloc 到 2 倍。",
      solution: C("c", "dynamic_array.c", [
        "#include <stdlib.h>",
        "#include <stddef.h>",
        "typedef struct { int *data; size_t size, capacity; } Vec;",
        "void vec_init(Vec *v) { v->data = 0; v->size = 0; v->capacity = 0; }",
        "void vec_push(Vec *v, int x) {",
        "    if (v->size == v->capacity) {",
        "        v->capacity = v->capacity ? v->capacity * 2 : 4;",
        "        v->data = realloc(v->data, v->capacity * sizeof(int));",
        "    }",
        "    v->data[v->size++] = x;",
        "}",
        "int vec_pop(Vec *v) { return v->data[--v->size]; }",
        "void vec_free(Vec *v) { free(v->data); vec_init(v); }"
      ].join("\n"))
    },

    "c-p73": {
      level: 2, title: "内存泄漏检测思路",
      body: "手写一个简易内存泄漏检测器：包装 malloc/free，用计数器记录分配/释放次数，程序结束时报告是否全部释放。",
      hint: "全局计数器 alloc_count，包装函数里 alloc++ / free--。",
      solution: C("c", "mem_leak_detect.c", [
        "#include <stdlib.h>",
        "#include <stdio.h>",
        "static int alloc_count = 0;",
        "void *my_malloc(size_t size) {",
        "    void *p = malloc(size);",
        "    if (p) alloc_count++;",
        "    return p;",
        "}",
        "void my_free(void *p) {",
        "    if (p) { free(p); alloc_count--; }",
        "}",
        "void report_leaks(void) {",
        "    if (alloc_count > 0)",
        "        printf(\"内存泄漏！还有 %d 处未释放\\n\", alloc_count);",
        "    else",
        "        printf(\"内存管理干净\\n\");",
        "}"
      ].join("\n"))
    },

    "c-p74": {
      level: 2, title: "悬空指针与 use-after-free",
      body: "解释什么是悬空指针和 use-after-free。手写一个触发 use-after-free 的错误代码，再给出修正版。",
      hint: "free 后把指针置 NULL，并且不要再访问。",
      solution: C("c", "use_after_free.c", [
        "#include <stdlib.h>",
        "#include <stdio.h>",
        "int main(void) {",
        "    int *p = malloc(sizeof(int));",
        "    *p = 42;",
        "    free(p);",
        "    // *p = 99;  // BUG: use-after-free！",
        "    p = NULL;   // 好习惯：free 后立即置 NULL",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    "c-p75": {
      level: 1, title: "野指针与 NULL 检查",
      body: "解释野指针和 NULL 指针的区别。手写安全的 malloc 使用模板。",
      hint: "野指针是未初始化的指针；NULL 指针是有意设为空。每次 malloc 后都要检查返回值。",
      solution: C("c", "null_check.c", [
        "#include <stdlib.h>",
        "#include <stdio.h>",
        "int main(void) {",
        "    int *p = malloc(100 * sizeof(int));",
        "    if (!p) {           // 必须检查！",
        "        perror(\"malloc failed\");",
        "        return 1;",
        "    }",
        "    // 安全使用 p ...",
        "    free(p); p = NULL;",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    /* ==================== C 语言 · 位操作 ==================== */

    "c-p76": {
      level: 2, title: "手写位测试、置位、清位",
      body: "手写三个宏或函数：检测第 n 位是否为 1、将第 n 位置 1、将第 n 位清 0。",
      hint: "测试：val & (1<<n)；置位：val | (1<<n)；清位：val & ~(1<<n)。",
      solution: C("c", "bit_ops.c", [
        "#define BIT_TEST(val, n)   (((val) >> (n)) & 1)",
        "#define BIT_SET(val, n)    ((val) | (1U << (n)))",
        "#define BIT_CLEAR(val, n)  ((val) & ~(1U << (n)))",
        "#define BIT_TOGGLE(val, n) ((val) ^ (1U << (n)))"
      ].join("\n"))
    },

    "c-p77": {
      level: 2, title: "统计二进制中 1 的个数",
      body: "手写 <code class='inline'>int count_bits(unsigned int n)</code>，统计一个整数的二进制表示中 1 的个数。至少写两种方法。",
      hint: "方法1：逐位测试。方法2：n &= (n-1) 每次消掉最低位的 1。",
      solution: C("c", "count_bits.c", [
        "/* 方法1：逐位测试 */",
        "int count_bits_v1(unsigned int n) {",
        "    int count = 0;",
        "    for (int i = 0; i < 32; i++)",
        "        if (n & (1U << i)) count++;",
        "    return count;",
        "}",
        "/* 方法2：Brian Kernighan 算法 */",
        "int count_bits_v2(unsigned int n) {",
        "    int count = 0;",
        "    while (n) { n &= (n - 1); count++; }  // 每次消掉最低位的 1",
        "    return count;",
        "}"
      ].join("\n"))
    },

    "c-p78": {
      level: 2, title: "判断 2 的幂",
      body: "手写 <code class='inline'>int is_power_of_2(unsigned int n)</code>，一行代码判断 n 是否是 2 的幂。",
      hint: "2 的幂的二进制只有一个 1，n & (n-1) == 0。注意 n==0 的情况。",
      solution: C("c", "power_of_2.c", [
        "int is_power_of_2(unsigned int n) {",
        "    return n != 0 && (n & (n - 1)) == 0;",
        "}"
      ].join("\n"))
    },

    "c-p79": {
      level: 2, title: "交换两个数（不用临时变量）",
      body: "手写两种不用临时变量交换两个 int 的方法。分析各自的缺陷。",
      hint: "方法1：异或。方法2：加减法。都有溢出/同一个变量的问题。",
      solution: C("c", "swap_no_tmp.c", [
        "/* 方法1：异或（不会溢出） */",
        "void swap_xor(int *a, int *b) {",
        "    *a ^= *b; *b ^= *a; *a ^= *b;",
        "}",
        "/* 方法2：加减法（可能溢出） */",
        "void swap_add(int *a, int *b) {",
        "    *a = *a + *b; *b = *a - *b; *a = *a - *b;",
        "}",
        "/* 缺陷：如果 a 和 b 指向同一个变量，两种方法都会把它变成 0 */"
      ].join("\n"))
    },

    "c-p80": {
      level: 2, title: "字节序（大小端）检测",
      body: "手写程序检测当前 CPU 是大端序还是小端序。",
      hint: "用 union 或强制类型转换检查一个 int 的第一个字节。",
      solution: C("c", "endianness.c", [
        "#include <stdio.h>",
        "int main(void) {",
        "    union { int i; char c[4]; } u;",
        "    u.i = 1;",
        "    if (u.c[0] == 1) printf(\"小端序 (Little Endian)\\n\");",
        "    else           printf(\"大端序 (Big Endian)\\n\");",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    "c-p81": {
      level: 2, title: "循环移位（rotate）",
      body: "手写 <code class='inline'>unsigned int rotate_left(unsigned int val, int n)</code>，将 32 位整数循环左移 n 位。",
      hint: "(val << n) | (val >> (32 - n))，注意 n==0 和 n>=32 的边界。",
      solution: C("c", "rotate.c", [
        "unsigned int rotate_left(unsigned int val, int n) {",
        "    n &= 31;  // 只取低5位，防止 n>=32",
        "    if (n == 0) return val;",
        "    return (val << n) | (val >> (32 - n));",
        "}"
      ].join("\n"))
    },

    /* ==================== C 语言 · 结构体与联合体 ==================== */

    "c-p82": {
      level: 1, title: "结构体：学生成绩管理系统（单条记录）",
      body: "定义结构体 Student（姓名 char[20]、学号 int、三门课成绩 float[3]），手写函数计算总分和平均分。",
      hint: "struct Student { char name[20]; int id; float score[3]; };",
      solution: C("c", "student_struct.c", [
        "#include <stdio.h>",
        "struct Student {",
        "    char name[20];",
        "    int id;",
        "    float score[3];",
        "};",
        "float total(const struct Student *s) {",
        "    return s->score[0] + s->score[1] + s->score[2];",
        "}",
        "int main(void) {",
        "    struct Student stu = {\"张三\", 1001, {85.5, 92.0, 78.5}};",
        "    printf(\"%s 总分=%.1f 平均分=%.1f\\n\",",
        "           stu.name, total(&stu), total(&stu) / 3.0);",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    "c-p83": {
      level: 1, title: "结构体大小与内存对齐",
      body: "手写程序打印以下结构体的大小，并解释为什么：struct A { char c; int i; char d; } 和 struct B { int i; char c; char d; }。",
      hint: "对齐：int 需要 4 字节对齐，编译器会插入填充字节。",
      solution: C("c", "struct_sizeof.c", [
        "#include <stdio.h>",
        "struct A { char c; int i; char d; };   // 1 + 3pad + 4 + 1 + 3pad = 12",
        "struct B { int i; char c; char d; };   // 4 + 1 + 1 + 2pad = 8",
        "int main(void) {",
        "    printf(\"sizeof(A) = %zu\\n\", sizeof(struct A));  // 12",
        "    printf(\"sizeof(B) = %zu\\n\", sizeof(struct B));  // 8",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    "c-p84": {
      level: 1, title: "typedef 与结构体别名",
      body: "用 typedef 定义结构体别名，并对比 typedef struct { } Student 和 struct Student { } 的区别。",
      hint: "typedef 后可以直接 Student s; 不用写 struct 关键字。",
      solution: C("c", "typedef_struct.c", [
        "/* 方式1：需要写 struct Student s; */",
        "struct Student { char name[20]; int id; };",
        "/* 方式2：直接用 Student s; */",
        "typedef struct { char name[20]; int id; } Student;",
        "/* 方式3：结构体自引用必须用方式1 */",
        "typedef struct Node { int data; struct Node *next; } Node;"
      ].join("\n"))
    },

    "c-p85": {
      level: 2, title: "联合体：数据类型双关",
      body: "用 union 实现 float 和 uint32_t 的互转（不改写内存直接 reinterpret）。",
      hint: "union { float f; uint32_t u; }。",
      solution: C("c", "union_reinterpret.c", [
        "#include <stdio.h>",
        "#include <stdint.h>",
        "int main(void) {",
        "    union { float f; uint32_t u; } v;",
        "    v.f = 3.14f;",
        "    printf(\"float %f 的 IEEE754 位模式: 0x%08X\\n\", v.f, v.u);",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    "c-p86": {
      level: 2, title: "枚举与 switch 状态机",
      body: "定义枚举类型 State { IDLE, RUNNING, ERROR }，手写状态机：根据当前状态和输入事件决定下一个状态。",
      hint: "enum State { IDLE, RUNNING, ERROR }; 用 switch 实现转移表。",
      solution: C("c", "state_machine.c", [
        "enum State { IDLE, RUNNING, ERROR };",
        "enum Event { START, STOP, FAULT, RESET };",
        "enum State transition(enum State s, enum Event e) {",
        "    switch (s) {",
        "        case IDLE:    return (e == START) ? RUNNING : s;",
        "        case RUNNING: return (e == STOP) ? IDLE : (e == FAULT) ? ERROR : s;",
        "        case ERROR:   return (e == RESET) ? IDLE : s;",
        "        default:      return s;",
        "    }",
        "}"
      ].join("\n"))
    },

    "c-p87": {
      level: 2, title: "位域：寄存器建模",
      body: "用位域定义一个 8 位控制寄存器：bit0=使能、bit1=方向、bit2=刹车、bit3~5=速度档位、bit6~7=保留。",
      hint: "struct Reg { unsigned int en:1, dir:1, brake:1, gear:3, reserved:2; };",
      solution: C("c", "bitfield_reg.c", [
        "#include <stdio.h>",
        "struct CtrlReg {",
        "    unsigned int en       : 1;  // bit 0: 使能",
        "    unsigned int dir      : 1;  // bit 1: 方向",
        "    unsigned int brake    : 1;  // bit 2: 刹车",
        "    unsigned int gear     : 3;  // bit 3-5: 速度档位",
        "    unsigned int reserved : 2;  // bit 6-7: 保留",
        "};",
        "int main(void) {",
        "    struct CtrlReg reg = {1, 0, 0, 3, 0};",
        "    printf(\"en=%d gear=%d sizeof=%zu\\n\", reg.en, reg.gear, sizeof(reg));",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    "c-p88": {
      level: 1, title: "结构体数组：全班成绩排序",
      body: "定义 Student 结构体数组（5 个学生），按总分从高到低排序后输出排名。",
      hint: "冒泡排序，比较函数换成比较两个 Student 的总分。",
      solution: C("c", "sort_students.c", [
        "#include <stdio.h>",
        "#include <string.h>",
        "struct Student { char name[20]; float scores[3]; };",
        "float total(const struct Student *s) {",
        "    return s->scores[0] + s->scores[1] + s->scores[2];",
        "}",
        "void sort_by_total(struct Student *arr, int n) {",
        "    for (int i = 0; i < n - 1; i++)",
        "        for (int j = 0; j < n - 1 - i; j++)",
        "            if (total(&arr[j]) < total(&arr[j+1])) {",
        "                struct Student t = arr[j]; arr[j] = arr[j+1]; arr[j+1] = t;",
        "            }",
        "}",
        "int main(void) {",
        "    struct Student s[5] = {",
        "        {\"A\", {90,85,88}}, {\"B\", {78,92,80}},",
        "        {\"C\", {85,85,85}}, {\"D\", {95,78,90}}, {\"E\", {80,82,84}}",
        "    };",
        "    sort_by_total(s, 5);",
        "    for (int i = 0; i < 5; i++)",
        "        printf(\"%d. %s 总分=%.0f\\n\", i+1, s[i].name, total(&s[i]));",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    /* ==================== C 语言 · 预处理器 ==================== */

    "c-p89": {
      level: 1, title: "宏定义与条件编译",
      body: "手写宏定义 DEBUG，在 #ifdef DEBUG 下输出调试信息，release 模式下不输出。",
      hint: "#ifdef DEBUG ... #endif 或 #if defined(DEBUG)。",
      solution: C("c", "debug_macro.c", [
        "#include <stdio.h>",
        "#define DEBUG",
        "#ifdef DEBUG",
        "    #define DBG_PRINT(fmt, ...) printf(\"[DBG] \" fmt, ##__VA_ARGS__)",
        "#else",
        "    #define DBG_PRINT(fmt, ...) ((void)0)",
        "#endif",
        "int main(void) {",
        "    DBG_PRINT(\"x=%d\\n\", 42);  // DEBUG 时输出，否则什么都不做",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    "c-p90": {
      level: 1, title: "头文件卫士与 extern \"C\"",
      body: "手写一个头文件的完整模板：包含头文件卫士、函数声明、extern \"C\" 包裹。",
      hint: "#ifndef/#define/#endif 三件套；#ifdef __cplusplus 包裹 extern \"C\"。",
      solution: C("c", "header_template.h", [
        "#ifndef MY_HEADER_H",
        "#define MY_HEADER_H",
        "",
        "#ifdef __cplusplus",
        "extern \"C\" {",
        "#endif",
        "",
        "/* 函数声明 */",
        "int add(int a, int b);",
        "",
        "#ifdef __cplusplus",
        "}",
        "#endif",
        "",
        "#endif /* MY_HEADER_H */"
      ].join("\n"))
    },

    /* ==================== C 语言 · 链表与数据结构 ==================== */

    "c-p91": {
      level: 2, featured: true, title: "单向链表：创建、遍历、释放",
      body: "手写单向链表的创建（头插法）、遍历打印、释放全过程。",
      hint: "malloc 分配节点，next 指针串起来，free 时逐个释放。",
      solution: C("c", "linked_list.c", [
        "#include <stdio.h>",
        "#include <stdlib.h>",
        "typedef struct Node { int data; struct Node *next; } Node;",
        "Node *create(int val) {",
        "    Node *n = malloc(sizeof(Node));",
        "    n->data = val; n->next = NULL; return n;",
        "}",
        "void push_front(Node **head, int val) {",
        "    Node *n = create(val); n->next = *head; *head = n;",
        "}",
        "void print_list(const Node *head) {",
        "    for (const Node *p = head; p; p = p->next) printf(\"%d -> \", p->data);",
        "    printf(\"NULL\\n\");",
        "}",
        "void free_list(Node *head) {",
        "    while (head) { Node *t = head; head = head->next; free(t); }",
        "}"
      ].join("\n"))
    },

    "c-p92": {
      level: 2, title: "单向链表：在指定位置插入",
      body: "手写 <code class='inline'>void insert_at(Node **head, int pos, int val)</code>，在链表第 pos 个位置插入新节点（0 表示头部）。",
      hint: "先找到 pos-1 位置的节点，然后调整 next 指针。",
      solution: C("c", "list_insert.c", [
        "#include <stdlib.h>",
        "typedef struct Node { int data; struct Node *next; } Node;",
        "void insert_at(Node **head, int pos, int val) {",
        "    Node *n = malloc(sizeof(Node));",
        "    n->data = val;",
        "    if (pos == 0) { n->next = *head; *head = n; return; }",
        "    Node *cur = *head;",
        "    for (int i = 0; i < pos - 1 && cur; i++) cur = cur->next;",
        "    if (!cur) { free(n); return; }  // pos 超出范围",
        "    n->next = cur->next; cur->next = n;",
        "}"
      ].join("\n"))
    },

    "c-p93": {
      level: 2, title: "单向链表：删除指定值的节点",
      body: "手写 <code class='inline'>void remove_val(Node **head, int val)</code>，删除链表中第一个值为 val 的节点。",
      hint: "用双指针：prev 和 cur，找到后 prev->next = cur->next。",
      solution: C("c", "list_remove.c", [
        "#include <stdlib.h>",
        "typedef struct Node { int data; struct Node *next; } Node;",
        "void remove_val(Node **head, int val) {",
        "    Node *prev = NULL, *cur = *head;",
        "    while (cur && cur->data != val) { prev = cur; cur = cur->next; }",
        "    if (!cur) return;  // 没找到",
        "    if (prev) prev->next = cur->next;",
        "    else      *head = cur->next;",
        "    free(cur);",
        "}"
      ].join("\n"))
    },

    "c-p94": {
      level: 2, featured: true, title: "单向链表：反转",
      body: "手写 <code class='inline'>Node *reverse_list(Node *head)</code>，反转单向链表。用迭代法。",
      hint: "三个指针：prev、cur、next，逐节点翻转 next 指向。",
      solution: C("c", "reverse_list.c", [
        "typedef struct Node { int data; struct Node *next; } Node;",
        "Node *reverse_list(Node *head) {",
        "    Node *prev = NULL, *cur = head;",
        "    while (cur) {",
        "        Node *next = cur->next;  // 先保存下一个",
        "        cur->next = prev;         // 反转",
        "        prev = cur; cur = next;   // 前进",
        "    }",
        "    return prev;  // prev 是新的头",
        "}"
      ].join("\n"))
    },

    "c-p95": {
      level: 2, title: "单向链表：找中间节点（快慢指针）",
      body: "手写函数用快慢指针找链表中间节点。快指针每次走两步，慢指针每次走一步，快指针到尾时慢指针就在中间。",
      hint: "fast = head, slow = head; while(fast && fast->next) { slow=slow->next; fast=fast->next->next; }",
      solution: C("c", "list_middle.c", [
        "typedef struct Node { int data; struct Node *next; } Node;",
        "Node *find_middle(Node *head) {",
        "    Node *slow = head, *fast = head;",
        "    while (fast && fast->next) {",
        "        slow = slow->next;",
        "        fast = fast->next->next;",
        "    }",
        "    return slow;",
        "}"
      ].join("\n"))
    },

    "c-p96": {
      level: 2, title: "检测链表是否有环",
      body: "手写函数检测链表是否有环（Floyd 判圈算法）。",
      hint: "快慢指针：如果存在环，快指针最终会追上慢指针。",
      solution: C("c", "list_cycle.c", [
        "typedef struct Node { int data; struct Node *next; } Node;",
        "int has_cycle(Node *head) {",
        "    Node *slow = head, *fast = head;",
        "    while (fast && fast->next) {",
        "        slow = slow->next;",
        "        fast = fast->next->next;",
        "        if (slow == fast) return 1;  // 相遇，有环",
        "    }",
        "    return 0;  // fast 到达 NULL，无环",
        "}"
      ].join("\n"))
    },

    "c-p97": {
      level: 2, title: "双向链表：插入与删除",
      body: "手写双向链表的节点定义、头部插入、指定节点删除。",
      hint: "每个节点有 prev 和 next 两个指针，插入/删除时两个方向都要调整。",
      solution: C("c", "doubly_linked.c", [
        "#include <stdlib.h>",
        "typedef struct DNode { int data; struct DNode *prev, *next; } DNode;",
        "DNode *dnode_create(int val) {",
        "    DNode *n = malloc(sizeof(DNode));",
        "    n->data = val; n->prev = n->next = NULL; return n;",
        "}",
        "void dlist_push_front(DNode **head, int val) {",
        "    DNode *n = dnode_create(val);",
        "    n->next = *head;",
        "    if (*head) (*head)->prev = n;",
        "    *head = n;",
        "}",
        "void dlist_remove(DNode **head, DNode *target) {",
        "    if (target->prev) target->prev->next = target->next;",
        "    else              *head = target->next;",
        "    if (target->next) target->next->prev = target->prev;",
        "    free(target);",
        "}"
      ].join("\n"))
    },

    "c-p98": {
      level: 2, title: "栈：数组实现",
      body: "手写一个用数组实现的栈：push、pop、top、is_empty、is_full。",
      hint: "用一个索引 top 指向栈顶，push 时 ++top，pop 时 top--。",
      solution: C("c", "array_stack.c", [
        "#define STACK_MAX 100",
        "typedef struct { int data[STACK_MAX]; int top; } Stack;",
        "void stack_init(Stack *s) { s->top = -1; }",
        "int  stack_empty(const Stack *s) { return s->top == -1; }",
        "int  stack_full(const Stack *s)  { return s->top == STACK_MAX - 1; }",
        "int  stack_push(Stack *s, int val) {",
        "    if (stack_full(s)) return -1;",
        "    s->data[++s->top] = val; return 0;",
        "}",
        "int  stack_pop(Stack *s, int *out) {",
        "    if (stack_empty(s)) return -1;",
        "    *out = s->data[s->top--]; return 0;",
        "}"
      ].join("\n"))
    },

    "c-p99": {
      level: 2, title: "队列：循环数组实现",
      body: "手写循环队列：enqueue、dequeue、front、is_empty、is_full。用取模实现循环利用。",
      hint: "front 和 rear 两个索引，rear = (rear+1) % MAX。区分空和满：牺牲一个单元或加 count。",
      solution: C("c", "circular_queue.c", [
        "#define Q_MAX 100",
        "typedef struct { int data[Q_MAX]; int front, rear, count; } Queue;",
        "void q_init(Queue *q) { q->front = q->rear = q->count = 0; }",
        "int  q_empty(const Queue *q) { return q->count == 0; }",
        "int  q_full(const Queue *q)  { return q->count == Q_MAX; }",
        "int  q_enqueue(Queue *q, int val) {",
        "    if (q_full(q)) return -1;",
        "    q->data[q->rear] = val; q->rear = (q->rear + 1) % Q_MAX; q->count++; return 0;",
        "}",
        "int  q_dequeue(Queue *q, int *out) {",
        "    if (q_empty(q)) return -1;",
        "    *out = q->data[q->front]; q->front = (q->front + 1) % Q_MAX; q->count--; return 0;",
        "}"
      ].join("\n"))
    },

    "c-p100": {
      level: 2, featured: true, title: "括号匹配检查器",
      body: "手写程序检查一个字符串中的括号是否匹配：()、{}、[] 三种。用栈实现。",
      hint: "遇到左括号入栈，遇到右括号出栈并检查是否匹配，最后栈必须为空。",
      solution: C("c", "bracket_check.c", [
        "#include <string.h>",
        "#define MAX 1000",
        "int is_match(const char *s) {",
        "    char stack[MAX]; int top = -1;",
        "    for (int i = 0; s[i]; i++) {",
        "        char c = s[i];",
        "        if (c == '(' || c == '{' || c == '[') stack[++top] = c;",
        "        else if (c == ')' || c == '}' || c == ']') {",
        "            if (top < 0) return 0;",
        "            char open = stack[top--];",
        "            if ((open=='(' && c!=')') || (open=='{' && c!='}') || (open=='[' && c!=']')) return 0;",
        "        }",
        "    }",
        "    return top == -1;",
        "}"
      ].join("\n"))
    },

    "c-p101": {
      level: 2, title: "栈实现计算器（中缀转后缀）",
      body: "手写一个计算器：将中缀表达式转为后缀表达式（逆波兰式），再求值。支持 + - * / 和括号。",
      hint: "用两个栈：一个存运算符（按优先级出栈），一个存操作数。",
      solution: C("c", "infix_to_postfix.c", [
        "/* 简化版：只处理个位数和 + - * / ( ) */",
        "/* 完整代码较长，理解思路即可：",
        " * 1. 中缀转后缀：遇到数字直接输出；遇到运算符与栈顶比较优先级，",
        " *    高的入栈，低的出栈输出；遇到 ( 入栈，遇到 ) 出栈到 (。",
        " * 2. 后缀求值：遇到数字入栈，遇到运算符弹出两个计算后入栈。",
        " * 3. 最后栈顶就是结果。",
        " */"
      ].join("\n"))
    },

    "c-p102": {
      level: 2, title: "哈希表：开地址法",
      body: "手写一个简单的哈希表：用除留余数法做哈希函数，线性探测处理冲突。支持 insert 和 search。",
      hint: "hash(key) = key % TABLE_SIZE；冲突时 (hash + i) % TABLE_SIZE 探测。",
      solution: C("c", "hash_table.c", [
        "#define TABLE_SIZE 100",
        "#define EMPTY -1",
        "int table[TABLE_SIZE];",
        "void hash_init(void) {",
        "    for (int i = 0; i < TABLE_SIZE; i++) table[i] = EMPTY;",
        "}",
        "int hash_insert(int key) {",
        "    int idx = key % TABLE_SIZE;",
        "    for (int i = 0; i < TABLE_SIZE; i++) {",
        "        int pos = (idx + i) % TABLE_SIZE;",
        "        if (table[pos] == EMPTY) { table[pos] = key; return pos; }",
        "        if (table[pos] == key) return pos;  // 已存在",
        "    }",
        "    return -1;  // 表满",
        "}",
        "int hash_search(int key) {",
        "    int idx = key % TABLE_SIZE;",
        "    for (int i = 0; i < TABLE_SIZE; i++) {",
        "        int pos = (idx + i) % TABLE_SIZE;",
        "        if (table[pos] == EMPTY) return -1;   // 遇到空说明不存在",
        "        if (table[pos] == key)   return pos;",
        "    }",
        "    return -1;",
        "}"
      ].join("\n"))
    },

    /* ==================== C 语言 · 文件操作 ==================== */

    "c-p103": {
      level: 1, title: "文件读写：写入再读回",
      body: "手写程序将 5 个整数写入二进制文件，然后重新打开并读回验证。",
      hint: "fopen(\"wb\") 写入，fopen(\"rb\") 读回，fwrite/fread。",
      solution: C("c", "file_rw.c", [
        "#include <stdio.h>",
        "int main(void) {",
        "    int data[5] = {10, 20, 30, 40, 50};",
        "    FILE *f = fopen(\"data.bin\", \"wb\");",
        "    fwrite(data, sizeof(int), 5, f);",
        "    fclose(f);",
        "",
        "    int read_back[5];",
        "    f = fopen(\"data.bin\", \"rb\");",
        "    fread(read_back, sizeof(int), 5, f);",
        "    fclose(f);",
        "",
        "    for (int i = 0; i < 5; i++) printf(\"%d \", read_back[i]);",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    "c-p104": {
      level: 1, title: "文本文件行数统计",
      body: "手写程序统计一个文本文件有多少行。",
      hint: "逐字符读取，统计 '\\n' 的个数。最后一行没有换行符时也要算上。",
      solution: C("c", "count_lines.c", [
        "#include <stdio.h>",
        "int main(void) {",
        "    FILE *f = fopen(\"test.txt\", \"r\");",
        "    if (!f) return 1;",
        "    int lines = 0, last_char = 0, c;",
        "    while ((c = fgetc(f)) != EOF) {",
        "        if (c == '\\n') lines++;",
        "        last_char = c;",
        "    }",
        "    if (last_char != '\\n' && last_char != 0) lines++;  // 最后一行没换行",
        "    fclose(f);",
        "    printf(\"%d 行\\n\", lines);",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    "c-p105": {
      level: 1, title: "CSV 文件解析",
      body: "手写程序读取一个 CSV 文件（格式：name,score），打印每行的姓名和分数。",
      hint: "fgets 逐行读取，strtok 或 strchr 按逗号分割。",
      solution: C("c", "csv_parse.c", [
        "#include <stdio.h>",
        "#include <string.h>",
        "int main(void) {",
        "    FILE *f = fopen(\"data.csv\", \"r\");",
        "    char line[256];",
        "    while (fgets(line, sizeof(line), f)) {",
        "        char *name = strtok(line, \",\");",
        "        char *score = strtok(NULL, \",\\n\");",
        "        if (name && score) printf(\"%s -> %s\\n\", name, score);",
        "    }",
        "    fclose(f);",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    "c-p106": {
      level: 1, title: "文件复制",
      body: "手写程序将一个文件的内容复制到另一个文件（二进制安全）。",
      hint: "逐块读取写入，用 fread/fwrite，缓冲 4096 字节。",
      solution: C("c", "file_copy.c", [
        "#include <stdio.h>",
        "int main(void) {",
        "    FILE *src = fopen(\"src.bin\", \"rb\");",
        "    FILE *dst = fopen(\"dst.bin\", \"wb\");",
        "    if (!src || !dst) return 1;",
        "    char buf[4096]; size_t n;",
        "    while ((n = fread(buf, 1, sizeof(buf), src)) > 0)",
        "        fwrite(buf, 1, n, dst);",
        "    fclose(src); fclose(dst);",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    "c-p107": {
      level: 1, title: "学生成绩写入与读取（二进制+文本）",
      body: "手写程序将 3 个 Student 结构体以二进制写入文件，再以文本格式写入另一个文件。然后分别读回验证。",
      hint: "二进制用 fwrite/fread；文本用 fprintf/fscanf。",
      solution: C("c", "student_file.c", [
        "#include <stdio.h>",
        "struct Student { char name[20]; int id; float score; };",
        "int main(void) {",
        "    struct Student s[3] = {{\"A\",1,90.5},{\"B\",2,85.0},{\"C\",3,78.5}};",
        "    FILE *f = fopen(\"students.bin\", \"wb\");",
        "    fwrite(s, sizeof(struct Student), 3, f); fclose(f);",
        "",
        "    struct Student r[3];",
        "    f = fopen(\"students.bin\", \"rb\");",
        "    fread(r, sizeof(struct Student), 3, f); fclose(f);",
        "",
        "    for (int i = 0; i < 3; i++)",
        "        printf(\"%s %d %.1f\\n\", r[i].name, r[i].id, r[i].score);",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    /* ==================== C 语言 · 算法与综合 ==================== */

    "c-p108": {
      level: 2, title: "二分查找（迭代版）",
      body: "手写迭代版二分查找，和之前的递归版对比。",
      hint: "while (lo <= hi)，每次根据 arr[mid] 调整 lo 或 hi。",
      solution: C("c", "binary_search_iter.c", [
        "int binary_search(const int *arr, int n, int target) {",
        "    int lo = 0, hi = n - 1;",
        "    while (lo <= hi) {",
        "        int mid = lo + (hi - lo) / 2;",
        "        if (arr[mid] == target) return mid;",
        "        if (arr[mid] < target) lo = mid + 1;",
        "        else                   hi = mid - 1;",
        "    }",
        "    return -1;",
        "}"
      ].join("\n"))
    },

    "c-p109": {
      level: 2, title: "归并排序",
      body: "手写归并排序 <code class='inline'>void merge_sort(int *arr, int n)</code>。",
      hint: "分治：分成两半分别排序，然后 merge 两个有序数组。",
      solution: C("c", "merge_sort.c", [
        "static void merge(int *arr, int lo, int mid, int hi, int *tmp) {",
        "    int i = lo, j = mid + 1, k = lo;",
        "    while (i <= mid && j <= hi)",
        "        tmp[k++] = (arr[i] <= arr[j]) ? arr[i++] : arr[j++];",
        "    while (i <= mid) tmp[k++] = arr[i++];",
        "    while (j <= hi)  tmp[k++] = arr[j++];",
        "    for (i = lo; i <= hi; i++) arr[i] = tmp[i];",
        "}",
        "static void msort(int *arr, int lo, int hi, int *tmp) {",
        "    if (lo >= hi) return;",
        "    int mid = lo + (hi - lo) / 2;",
        "    msort(arr, lo, mid, tmp);",
        "    msort(arr, mid + 1, hi, tmp);",
        "    merge(arr, lo, mid, hi, tmp);",
        "}",
        "void merge_sort(int *arr, int n) {",
        "    int tmp[n];  // VLA 或 malloc",
        "    msort(arr, 0, n - 1, tmp);",
        "}"
      ].join("\n"))
    },

    "c-p110": {
      level: 2, title: "堆排序",
      body: "手写堆排序。包含 heapify（下沉）和 build_heap（建堆）两个核心函数。",
      hint: "先建最大堆，然后反复将堆顶（最大值）换到末尾，再 heapify。",
      solution: C("c", "heap_sort.c", [
        "static void heapify(int *arr, int n, int root) {",
        "    int largest = root, left = 2*root + 1, right = 2*root + 2;",
        "    if (left < n && arr[left] > arr[largest]) largest = left;",
        "    if (right < n && arr[right] > arr[largest]) largest = right;",
        "    if (largest != root) {",
        "        int t = arr[root]; arr[root] = arr[largest]; arr[largest] = t;",
        "        heapify(arr, n, largest);",
        "    }",
        "}",
        "void heap_sort(int *arr, int n) {",
        "    for (int i = n/2 - 1; i >= 0; i--) heapify(arr, n, i);",
        "    for (int i = n - 1; i > 0; i--) {",
        "        int t = arr[0]; arr[0] = arr[i]; arr[i] = t;",
        "        heapify(arr, i, 0);",
        "    }",
        "}"
      ].join("\n"))
    },

    "c-p111": {
      level: 2, title: "滑动窗口最大值",
      body: "手写 <code class='inline'>void sliding_max(const int *arr, int n, int k, int *out)</code>，计算每个大小为 k 的滑动窗口中的最大值。",
      hint: "用单调递减队列（deque）：队首永远是当前窗口最大值。",
      solution: C("c", "sliding_window_max.c", [
        "#include <deque>",
        "void sliding_max(const int *arr, int n, int k, int *out) {",
        "    std::deque<int> dq;  // 存下标，对应值单调递减",
        "    for (int i = 0; i < n; i++) {",
        "        while (!dq.empty() && dq.front() <= i - k) dq.pop_front();",
        "        while (!dq.empty() && arr[dq.back()] <= arr[i]) dq.pop_back();",
        "        dq.push_back(i);",
        "        if (i >= k - 1) out[i - k + 1] = arr[dq.front()];",
        "    }",
        "}"
      ].join("\n"))
    },

    "c-p112": {
      level: 2, title: "大数加法（字符串实现）",
      body: "手写 <code class='inline'>char *big_add(const char *a, const char *b)</code>，计算两个任意长度的非负整数之和（用字符串表示）。",
      hint: "从末位开始逐位相加，处理进位。",
      solution: C("c", "big_add.c", [
        "#include <string.h>",
        "#include <stdlib.h>",
        "char *big_add(const char *a, const char *b) {",
        "    int la = strlen(a), lb = strlen(b);",
        "    int max_len = la > lb ? la : lb;",
        "    char *result = malloc(max_len + 2);",
        "    int carry = 0, pos = max_len + 1;",
        "    result[pos--] = '\\0';",
        "    while (la > 0 || lb > 0 || carry) {",
        "        int da = (la > 0) ? a[--la] - '0' : 0;",
        "        int db = (lb > 0) ? b[--lb] - '0' : 0;",
        "        int sum = da + db + carry;",
        "        result[pos--] = (sum % 10) + '0';",
        "        carry = sum / 10;",
        "    }",
        "    return result + pos + 1;  // 跳过前面的空位",
        "}"
      ].join("\n"))
    },

    "c-p113": {
      level: 3, featured: true, title: "环形缓冲区（生产-消费者）",
      body: "手写线程不安全的环形缓冲区，实现 put 和 get。然后讨论：如何加上互斥锁和条件变量让它线程安全？",
      hint: "用 read_idx 和 write_idx 两个索引，取模回绕。区分满和空。",
      solution: C("c", "ring_buffer.c", [
        "#define RB_SIZE 64",
        "typedef struct { int buf[RB_SIZE]; int r, w, count; } RingBuf;",
        "void rb_init(RingBuf *rb) { rb->r = rb->w = rb->count = 0; }",
        "int rb_put(RingBuf *rb, int val) {",
        "    if (rb->count == RB_SIZE) return -1;  // 满",
        "    rb->buf[rb->w] = val;",
        "    rb->w = (rb->w + 1) % RB_SIZE; rb->count++; return 0;",
        "}",
        "int rb_get(RingBuf *rb, int *out) {",
        "    if (rb->count == 0) return -1;  // 空",
        "    *out = rb->buf[rb->r];",
        "    rb->r = (rb->r + 1) % RB_SIZE; rb->count--; return 0;",
        "}"
      ].join("\n"))
    },

    "c-p114": {
      level: 3, title: "简单内存池",
      body: "手写一个固定块大小的内存池：pool_init、pool_alloc、pool_free。用空闲链表管理。",
      hint: "预分配一大块内存，切成等大的块，用链表串起来。alloc 时从头部摘一个，free 时插回头部。",
      solution: C("c", "memory_pool.c", [
        "#include <stdlib.h>",
        "#define POOL_SIZE 100",
        "#define BLOCK_SIZE 64",
        "typedef struct Block { struct Block *next; } Block;",
        "typedef struct { char mem[POOL_SIZE][BLOCK_SIZE]; Block *free_list; } Pool;",
        "void pool_init(Pool *p) {",
        "    p->free_list = NULL;",
        "    for (int i = POOL_SIZE - 1; i >= 0; i--) {",
        "        ((Block*)p->mem[i])->next = p->free_list; p->free_list = (Block*)p->mem[i];",
        "    }",
        "}",
        "void *pool_alloc(Pool *p) {",
        "    if (!p->free_list) return NULL;",
        "    Block *b = p->free_list; p->free_list = b->next; return b;",
        "}",
        "void pool_free(Pool *p, void *ptr) {",
        "    Block *b = ptr; b->next = p->free_list; p->free_list = b;",
        "}"
      ].join("\n"))
    },

    "c-p115": {
      level: 3, title: "简单状态机解析器（AT 指令）",
      body: "手写一个有限状态机，解析以 \\r\\n 结尾的 AT 指令。状态：WAIT_A、WAIT_T、READ_CMD、WAIT_LF。收到 \"AT+LED=1\\r\\n\" 时进入对应处理。",
      hint: "switch(state) 处理每个输入字符，合法转移改变状态，非法回到 IDLE。",
      solution: C("c", "at_parser.c", [
        "typedef enum { IDLE, GOT_A, GOT_T, READING, GOT_CR } AtState;",
        "void at_parser(char c) {",
        "    static AtState state = IDLE; static char buf[32]; static int pos = 0;",
        "    switch (state) {",
        "        case IDLE:   if (c=='A') state=GOT_A; break;",
        "        case GOT_A:  state = (c=='T') ? GOT_T : IDLE; break;",
        "        case GOT_T:  if (c!='+'){state=IDLE;break;} state=READING; pos=0; break;",
        "        case READING:",
        "            if (c=='\\r') { state=GOT_CR; buf[pos]='\\0'; }",
        "            else if (pos < 31) buf[pos++] = c;",
        "            break;",
        "        case GOT_CR:",
        "            if (c=='\\n') { /* 处理 buf 中的指令 */ state=IDLE; }",
        "            else state=IDLE; break;",
        "    }",
        "}"
      ].join("\n"))
    },

    "c-p116": {
      level: 3, title: "CRC-8 校验",
      body: "手写 CRC-8 计算函数，用于串口通信的数据校验。",
      hint: "多项式 x^8+x^2+x+1 = 0x07。逐位异或。",
      solution: C("c", "crc8.c", [
        "unsigned char crc8(const unsigned char *data, int len) {",
        "    unsigned char crc = 0xFF;",
        "    for (int i = 0; i < len; i++) {",
        "        crc ^= data[i];",
        "        for (int j = 0; j < 8; j++)",
        "            crc = (crc & 0x80) ? (crc << 1) ^ 0x07 : (crc << 1);",
        "    }",
        "    return crc;",
        "}"
      ].join("\n"))
    },

    "c-p117": {
      level: 3, title: "串口数据帧解析",
      body: "手写一个串口数据帧解析器：帧格式为 [0xAA][0x55][LEN][DATA...][CRC8]。收到完整帧后回调处理函数。",
      hint: "状态机：等帧头 → 等LEN → 收数据 → 收CRC → 校验。",
      solution: C("c", "frame_parser.c", [
        "typedef enum { WAIT_AA, WAIT_55, WAIT_LEN, READ_DATA, WAIT_CRC } FrameState;",
        "void frame_parser(unsigned char byte) {",
        "    static FrameState state = WAIT_AA; static unsigned char buf[64];",
        "    static int len = 0, pos = 0;",
        "    switch (state) {",
        "        case WAIT_AA:   if (byte==0xAA) state=WAIT_55; break;",
        "        case WAIT_55:   if (byte==0x55) state=WAIT_LEN; else state=WAIT_AA; break;",
        "        case WAIT_LEN:  len=byte; pos=0; state = len>0 ? READ_DATA : WAIT_CRC; break;",
        "        case READ_DATA: buf[pos++]=byte; if (pos>=len) state=WAIT_CRC; break;",
        "        case WAIT_CRC:",
        "            if (byte == crc8(buf, len)) { /* 帧有效，处理 buf */ }",
        "            state = WAIT_AA; break;",
        "    }",
        "}"
      ].join("\n"))
    },

    "c-p118": {
      level: 3, title: "简单任务调度器（协作式）",
      body: "手写一个协作式任务调度器：多个任务函数轮流执行，每个任务有周期和上次执行时间。主循环不断检查是否有任务到期。",
      hint: "每个任务记录 last_run，当前时间 - last_run >= period 时执行。",
      solution: C("c", "coop_scheduler.c", [
        "#include <stddef.h>",
        "typedef void (*TaskFn)(void);",
        "typedef struct { TaskFn fn; unsigned int period_ms; unsigned int last_run; } Task;",
        "Task tasks[8]; int task_count = 0;",
        "unsigned int now(void) { return 0; }  // 替换为实际计时",
        "void add_task(TaskFn fn, unsigned int period) {",
        "    if (task_count < 8) {",
        "        tasks[task_count].fn = fn; tasks[task_count].period_ms = period;",
        "        tasks[task_count].last_run = 0; task_count++;",
        "    }",
        "}",
        "void scheduler_run(void) {",
        "    for (int i = 0; i < task_count; i++) {",
        "        unsigned int t = now();",
        "        if (t - tasks[i].last_run >= tasks[i].period_ms) {",
        "            tasks[i].last_run = t; tasks[i].fn();",
        "        }",
        "    }",
        "}"
      ].join("\n"))
    },

    "c-p119": {
      level: 3, featured: true, title: "手写 printf 的 %d 和 %s",
      body: "手写一个简化版 my_printf，支持 %d 和 %s 两种格式符，通过可变参数实现。",
      hint: "va_list / va_start / va_arg / va_end。%d 逐位分解输出，%s 逐字符输出。",
      solution: C("c", "mini_printf.c", [
        "#include <stdarg.h>",
        "#include <unistd.h>",
        "void print_char(char c) { write(1, &c, 1); }  // 或用 putchar",
        "void print_int(int n) {",
        "    if (n < 0) { print_char('-'); n = -n; }",
        "    if (n >= 10) print_int(n / 10);",
        "    print_char(n % 10 + '0');",
        "}",
        "void print_str(const char *s) { while (*s) print_char(*s++); }",
        "void my_printf(const char *fmt, ...) {",
        "    va_list args; va_start(args, fmt);",
        "    for (const char *p = fmt; *p; p++) {",
        "        if (*p != '%') { print_char(*p); continue; }",
        "        p++;",
        "        if (*p == 'd') print_int(va_arg(args, int));",
        "        else if (*p == 's') print_str(va_arg(args, const char*));",
        "        else print_char(*p);",
        "    }",
        "    va_end(args);",
        "}"
      ].join("\n"))
    },

    "c-p120": {
      level: 3, featured: true, title: "volatile 与硬件寄存器",
      body: "解释 volatile 关键字的作用。手写一个通过内存映射访问 GPIO 寄存器的例子，说明为什么必须加 volatile。",
      hint: "编译器会优化掉「看起来没用」的内存读写，volatile 告诉它每次都真正读写。",
      solution: C("c", "volatile_gpio.c", [
        "/* 假设 GPIO 寄存器映射到地址 0x40020000 */",
        "#define GPIO_ODR  (*(volatile unsigned int*)0x40020014)  // 输出数据寄存器",
        "#define GPIO_BSRR (*(volatile unsigned int*)0x40020018)  // 位设置/清除寄存器",
        "",
        "void led_on(void)  { GPIO_ODR |=  (1U << 5); }   // 置位 bit5",
        "void led_off(void) { GPIO_ODR &= ~(1U << 5); }   // 清位 bit5",
        "void led_toggle(void) { GPIO_ODR ^= (1U << 5); } // 翻转 bit5",
        "",
        "/* 如果不加 volatile，编译器可能认为：",
        " * \"你每次都写同一个地址，中间又没读，",
        " *  那我把前几次写优化掉好了\" —— 灯就不闪了。 */"
      ].join("\n"))
    }

  });
})();
