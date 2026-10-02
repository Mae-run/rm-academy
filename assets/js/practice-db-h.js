/* RM 兵工厂 · 手写练习题库（总扩容卷 H）
 * 大批量补充：C / C++ / Python / ROS2 / 电控 / 视觉
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

    /* ==================== C · H 卷 ==================== */

    "c-h1": {
      level: 1, title: "H卷·C：判断完数",
      body: "手写函数判断一个数是否是完数（所有真因子之和等于自身，如 28=1+2+4+7+14）。",
      hint: "从 1 到 n/2 试除累加因子。",
      solution: C("c", "h1_perfect.c", [
        "int is_perfect(int n) {",
        "    if (n < 2) return 0;",
        "    int sum = 1;   // 1 是所有数的因子",
        "    for (int i = 2; i * i <= n; i++) {",
        "        if (n % i == 0) {",
        "            sum += i;",
        "            if (i != n / i) sum += n / i;   // 避免平方根重复加",
        "        }",
        "    }",
        "    return sum == n;",
        "}"
      ].join("\n"))
    },

    "c-h2": {
      level: 1, title: "H卷·C：亲密数对",
      body: "手写程序找出 1000 以内所有亲密数对（a 的因子和=b，b 的因子和=a，a≠b）。",
      hint: "双重循环 + 因子和函数。",
      solution: C("c", "h2_amicable.c", [
        "int factor_sum(int n) {",
        "    int s = 1;",
        "    for (int i = 2; i * i <= n; i++)",
        "        if (n % i == 0) { s += i; if (i != n/i) s += n/i; }",
        "    return s;",
        "}",
        "void find_amicable(int limit) {",
        "    for (int a = 2; a < limit; a++) {",
        "        int b = factor_sum(a);",
        "        if (a < b && factor_sum(b) == a)",
        "            printf(\"%d 和 %d 是亲密数对\\n\", a, b);",
        "    }",
        "}"
      ].join("\n"))
    },

    "c-h3": {
      level: 1, title: "H卷·C：哥德巴赫猜想验证",
      body: "手写程序验证 100 以内的偶数都能写成两个素数之和。",
      hint: "对每个偶数 n，枚举素数 p，检查 n-p 是否也是素数。",
      solution: C("c", "h3_goldbach.c", [
        "int is_prime(int n) {",
        "    if (n < 2) return 0;",
        "    for (int i = 2; i * i <= n; i++)",
        "        if (n % i == 0) return 0;",
        "    return 1;",
        "}",
        "void goldbach(int limit) {",
        "    for (int n = 4; n <= limit; n += 2) {",
        "        for (int p = 2; p <= n / 2; p++) {",
        "            if (is_prime(p) && is_prime(n - p)) {",
        "                printf(\"%d = %d + %d\\n\", n, p, n - p);",
        "                break;",
        "            }",
        "        }",
        "    }",
        "}"
      ].join("\n"))
    },

    "c-h4": {
      level: 2, title: "H卷·C：字符串全排列",
      body: "手写递归函数打印字符串的所有排列（无重复字符）。",
      hint: "交换法：固定第 i 位，递归处理 i+1 位。",
      solution: C("c", "h4_permutation.c", [
        "void permute(char *s, int left, int right) {",
        "    if (left == right) { printf(\"%s\\n\", s); return; }",
        "    for (int i = left; i <= right; i++) {",
        "        char t = s[left]; s[left] = s[i]; s[i] = t;",
        "        permute(s, left + 1, right);",
        "        t = s[left]; s[left] = s[i]; s[i] = t;   // 回溯",
        "    }",
        "}"
      ].join("\n"))
    },

    "c-h5": {
      level: 2, title: "H卷·C：N 皇后问题",
      body: "手写 N 皇后问题的解法（打印解的数量即可，N=8）。",
      hint: "回溯：逐行放皇后，检查列和对角线冲突。",
      solution: C("c", "h5_nqueens.c", [
        "int board[8], count = 0;",
        "int safe(int row, int col) {",
        "    for (int r = 0; r < row; r++) {",
        "        if (board[r] == col) return 0;                    // 同列",
        "        if (row - r == col - board[r] ||                  // 主对角",
        "            row - r == board[r] - col) return 0;          // 副对角",
        "    }",
        "    return 1;",
        "}",
        "void solve(int row) {",
        "    if (row == 8) { count++; return; }",
        "    for (int col = 0; col < 8; col++) {",
        "        if (safe(row, col)) {",
        "            board[row] = col;",
        "            solve(row + 1);",
        "        }",
        "    }",
        "}"
      ].join("\n"))
    },

    "c-h6": {
      level: 2, title: "H卷·C：迷宫求解（BFS）",
      body: "手写 BFS 求解迷宫最短路径，输出步数。",
      hint: "队列 + visited 标记 + 四方向扩展。",
      solution: C("c", "h6_maze_bfs.c", [
        "#define ROWS 10",
        "#define COLS 10",
        "char maze[ROWS][COLS]; int visited[ROWS][COLS];",
        "int bfs(int sx, int sy, int ex, int ey) {",
        "    int qx[100], qy[100], qd[100], head = 0, tail = 0;",
        "    qx[tail]=sx; qy[tail]=sy; qd[tail]=0; tail++;",
        "    visited[sy][sx] = 1;",
        "    int dx[4]={0,1,0,-1}, dy[4]={1,0,-1,0};",
        "    while (head < tail) {",
        "        int x=qx[head], y=qy[head], d=qd[head]; head++;",
        "        if (x==ex && y==ey) return d;",
        "        for (int i=0; i<4; i++) {",
        "            int nx=x+dx[i], ny=y+dy[i];",
        "            if (nx<0||nx>=COLS||ny<0||ny>=ROWS) continue;",
        "            if (maze[ny][nx]=='#' || visited[ny][nx]) continue;",
        "            visited[ny][nx]=1;",
        "            qx[tail]=nx; qy[tail]=ny; qd[tail]=d+1; tail++;",
        "        }",
        "    }",
        "    return -1;",
        "}"
      ].join("\n"))
    },

    "c-h7": {
      level: 2, title: "H卷·C：图的最短路径（Dijkstra）",
      body: "手写 Dijkstra 算法求单源最短路径（邻接矩阵，顶点数 < 100）。",
      hint: "贪心：每轮选未访问中 dist 最小的点，松弛它的邻居。",
      solution: C("c", "h7_dijkstra.c", [
        "#define N 100",
        "int graph[N][N];   // 邻接矩阵，INF 表示无边",
        "int dijkstra(int src, int dst, int n) {",
        "    int dist[N], visited[N] = {0};",
        "    for (int i = 0; i < n; i++) dist[i] = 1e9;",
        "    dist[src] = 0;",
        "    for (int round = 0; round < n; round++) {",
        "        int u = -1;",
        "        for (int i = 0; i < n; i++)   // 找未访问的最近点",
        "            if (!visited[i] && (u == -1 || dist[i] < dist[u])) u = i;",
        "        if (u == -1 || dist[u] == 1e9) break;",
        "        visited[u] = 1;",
        "        for (int v = 0; v < n; v++)   // 松弛",
        "            if (graph[u][v] < 1e9 && dist[u] + graph[u][v] < dist[v])",
        "                dist[v] = dist[u] + graph[u][v];",
        "    }",
        "    return dist[dst];",
        "}"
      ].join("\n"))
    },

    "c-h8": {
      level: 3, title: "H卷·C：动态规划：最长公共子序列",
      body: "手写 LCS 算法：dp[i][j] 表示前 i、j 个字符的 LCS 长度。",
      hint: "字符相等 → dp[i][j]=dp[i-1][j-1]+1；否则 max(dp[i-1][j], dp[i][j-1])。",
      solution: C("c", "h8_lcs.c", [
        "int lcs(const char *a, const char *b) {",
        "    int la = strlen(a), lb = strlen(b);",
        "    int dp[100][100] = {0};",
        "    for (int i = 1; i <= la; i++)",
        "        for (int j = 1; j <= lb; j++) {",
        "            if (a[i-1] == b[j-1]) dp[i][j] = dp[i-1][j-1] + 1;",
        "            else dp[i][j] = dp[i-1][j] > dp[i][j-1] ? dp[i-1][j] : dp[i][j-1];",
        "        }",
        "    return dp[la][lb];",
        "}"
      ].join("\n"))
    },

    "c-h9": {
      level: 3, title: "H卷·C：动态规划：0-1 背包",
      body: "手写 0-1 背包：n 个物品，容量 W，求最大价值。一维滚动数组优化。",
      hint: "dp[j] = max(dp[j], dp[j-w[i]] + v[i])，j 从大到小遍历。",
      solution: C("c", "h9_knapsack.c", [
        "int knapsack(int w[], int v[], int n, int cap) {",
        "    int dp[10001] = {0};",
        "    for (int i = 0; i < n; i++)",
        "        for (int j = cap; j >= w[i]; j--)   // 倒序！",
        "            if (dp[j - w[i]] + v[i] > dp[j]) dp[j] = dp[j - w[i]] + v[i];",
        "    return dp[cap];",
        "}"
      ].join("\n"))
    },

    "c-h10": {
      level: 3, featured: true, title: "H卷·C：动态规划：编辑距离",
      body: "手写编辑距离算法：把 word1 变成 word2 的最少操作次数（插入/删除/替换）。",
      hint: "dp[i][j]：a 前 i 字符变 b 前 j 字符的最少操作。字符相等则继承左上，否则三邻取最小+1。",
      solution: C("c", "h10_edit_distance.c", [
        "int edit_distance(const char *a, const char *b) {",
        "    int la = strlen(a), lb = strlen(b);",
        "    int dp[101][101];",
        "    for (int i = 0; i <= la; i++) dp[i][0] = i;   // 全删",
        "    for (int j = 0; j <= lb; j++) dp[0][j] = j;   // 全插",
        "    for (int i = 1; i <= la; i++)",
        "        for (int j = 1; j <= lb; j++) {",
        "            if (a[i-1] == b[j-1]) dp[i][j] = dp[i-1][j-1];",
        "            else {",
        "                int m = dp[i-1][j] < dp[i][j-1] ? dp[i-1][j] : dp[i][j-1];",
        "                dp[i][j] = (m < dp[i-1][j-1] ? m : dp[i-1][j-1]) + 1;",
        "            }",
        "        }",
        "    return dp[la][lb];",
        "}"
      ].join("\n"))
    },

    "c-h11": {
      level: 3, title: "H卷·C：并查集",
      body: "手写并查集：find（路径压缩）和 union（按大小合并）。",
      hint: "find 时把沿途节点直接挂到根上；union 时小树挂大树。",
      solution: C("c", "h11_union_find.c", [
        "int parent[1000];",
        "void uf_init(int n) { for (int i = 0; i < n; i++) parent[i] = i; }",
        "int uf_find(int x) {",
        "    if (parent[x] != x) parent[x] = uf_find(parent[x]);   // 路径压缩",
        "    return parent[x];",
        "}",
        "void uf_union(int a, int b) {",
        "    int ra = uf_find(a), rb = uf_find(b);",
        "    if (ra != rb) parent[ra] = rb;",
        "}"
      ].join("\n"))
    },

    "c-h12": {
      level: 3, title: "H卷·C：手写字符串 split",
      body: "手写 <code class='inline'>int str_split(const char *s, char sep, char out[][32], int max)</code>，按分隔符切分，返回段数。",
      hint: "双指针找分隔符，memcpy 拷贝段。",
      solution: C("c", "h12_split.c", [
        "#include <string.h>",
        "int str_split(const char *s, char sep, char out[][32], int max) {",
        "    int count = 0;",
        "    while (*s && count < max) {",
        "        const char *start = s;",
        "        while (*s && *s != sep) s++;",
        "        int len = s - start;",
        "        if (len > 31) len = 31;",
        "        memcpy(out[count], start, len);",
        "        out[count][len] = '\\0';",
        "        count++;",
        "        if (*s) s++;   // 跳过分隔符",
        "    }",
        "    return count;",
        "}"
      ].join("\n"))
    },

    "c-h13": {
      level: 3, title: "H卷·C：手写简易 shell（命令解析执行）",
      body: "手写一个简易 shell：读入一行命令，解析出 argv，fork+exec 执行。",
      hint: "fgets 读行 → strtok 切分 argv → fork+execvp → waitpid。",
      solution: C("c", "h13_mini_shell.c", [
        "#include <stdio.h>",
        "#include <unistd.h>",
        "#include <sys/wait.h>",
        "#include <string.h>",
        "int main(void) {",
        "    char line[256];",
        "    while (1) {",
        "        printf(\"$ \");",
        "        if (!fgets(line, sizeof(line), stdin)) break;",
        "        char *argv[32] = {0};",
        "        int argc = 0;",
        "        char *tok = strtok(line, \" \\n\");",
        "        while (tok && argc < 31) { argv[argc++] = tok; tok = strtok(NULL, \" \\n\"); }",
        "        if (argc == 0) continue;",
        "        pid_t pid = fork();",
        "        if (pid == 0) { execvp(argv[0], argv); _exit(127); }",
        "        int status; waitpid(pid, &status, 0);",
        "    }",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    "c-h14": {
      level: 3, title: "H卷·C：手写简易内存分配器（first-fit）",
      body: "手写一个简易堆分配器：简化版 malloc/free，用隐式空闲链表 + first-fit 策略。",
      hint: "每个块有 header（size + free 标志），malloc 时线性找第一个够大的空闲块。",
      solution: C("c", "h14_malloc.c", [
        "typedef struct Block {",
        "    size_t size;        // 数据区大小",
        "    int free;           // 1=空闲",
        "    struct Block *next;",
        "} Block;",
        "static char heap[64 * 1024];   // 简易堆",
        "static Block *head = NULL;",
        "",
        "void *mini_malloc(size_t size) {",
        "    if (!head) {   // 初始化第一块",
        "        head = (Block*)heap;",
        "        head->size = sizeof(heap) - sizeof(Block);",
        "        head->free = 1; head->next = NULL;",
        "    }",
        "    Block *b = head;",
        "    while (b) {",
        "        if (b->free && b->size >= size) {",
        "            b->free = 0;",
        "            return (char*)b + sizeof(Block);",
        "        }",
        "        b = b->next;",
        "    }",
        "    return NULL;   // 没找到",
        "}"
      ].join("\n"))
    },

    /* ==================== C++ · H 卷 ==================== */

    "cpp-h1": {
      level: 1, title: "H卷·C++：auto 与结构化绑定联用",
      body: "手写代码：遍历 map<string, vector<int>>，用结构化绑定 + auto 输出 key 和 value 的大小。",
      hint: "for (auto const& [k, v] : m)。",
      solution: C("cpp", "h1_auto_binding.cpp", [
        "#include <map>",
        "#include <string>",
        "#include <vector>",
        "std::map<std::string, std::vector<int>> data = {{\"a\", {1,2,3}}};",
        "for (const auto &[key, val] : data) {",
        "    std::cout << key << \" has \" << val.size() << \" items\\n\";",
        "}"
      ].join("\n"))
    },

    "cpp-h2": {
      level: 2, title: "H卷·C++：手写 unique_ptr（简化版）",
      body: "手写一个简化版 unique_ptr：构造、析构、移动构造、移动赋值、release、reset、operator*、operator->。",
      hint: "禁拷贝（=delete），允许移动。",
      solution: C("cpp", "h2_unique_ptr.cpp", [
        "template <typename T>",
        "class UniquePtr {",
        "public:",
        "    explicit UniquePtr(T *p = nullptr) : p_(p) {}",
        "    ~UniquePtr() { delete p_; }",
        "    // 禁拷贝",
        "    UniquePtr(const UniquePtr &) = delete;",
        "    UniquePtr &operator=(const UniquePtr &) = delete;",
        "    // 移动",
        "    UniquePtr(UniquePtr &&other) noexcept : p_(other.p_) { other.p_ = nullptr; }",
        "    UniquePtr &operator=(UniquePtr &&other) noexcept {",
        "        if (this != &other) { delete p_; p_ = other.p_; other.p_ = nullptr; }",
        "        return *this;",
        "    }",
        "    T *get() const { return p_; }",
        "    T *release() { T *p = p_; p_ = nullptr; return p; }",
        "    void reset(T *p = nullptr) { delete p_; p_ = p; }",
        "    T &operator*() const { return *p_; }",
        "    T *operator->() const { return p_; }",
        "    explicit operator bool() const { return p_ != nullptr; }",
        "private:",
        "    T *p_;",
        "};"
      ].join("\n"))
    },

    "cpp-h3": {
      level: 3, featured: true, title: "H卷·C++：手写 shared_ptr（简化版）",
      body: "手写一个简化版 shared_ptr：引用计数块 + 拷贝/移动/析构。",
      hint: "控制块单独分配，存 ref_count。拷贝 ++，析构 --，归零 delete。",
      solution: C("cpp", "h3_shared_ptr.cpp", [
        "template <typename T>",
        "class SharedPtr {",
        "public:",
        "    explicit SharedPtr(T *p = nullptr) : p_(p), count_(p ? new int(1) : nullptr) {}",
        "    ~SharedPtr() { release(); }",
        "    SharedPtr(const SharedPtr &o) : p_(o.p_), count_(o.count_) {",
        "        if (count_) ++(*count_);",
        "    }",
        "    SharedPtr &operator=(const SharedPtr &o) {",
        "        if (this != &o) {",
        "            release();",
        "            p_ = o.p_; count_ = o.count_;",
        "            if (count_) ++(*count_);",
        "        }",
        "        return *this;",
        "    }",
        "    int use_count() const { return count_ ? *count_ : 0; }",
        "    T *operator->() const { return p_; }",
        "    T &operator*() const { return *p_; }",
        "private:",
        "    void release() {",
        "        if (count_ && --(*count_) == 0) { delete p_; delete count_; }",
        "    }",
        "    T *p_;",
        "    int *count_;",
        "};"
      ].join("\n"))
    },

    "cpp-h4": {
      level: 3, title: "H卷·C++：手写线程安全队列",
      body: "手写一个线程安全队列：内部用 mutex + condition_variable 保护 deque。",
      hint: "push 后 notify_one；pop 用 unique_lock + wait。",
      solution: C("cpp", "h4_threadsafe_queue.cpp", [
        "#include <deque>",
        "#include <mutex>",
        "#include <condition_variable>",
        "template <typename T>",
        "class ThreadSafeQueue {",
        "public:",
        "    void push(T val) {",
        "        { std::lock_guard<std::mutex> lk(mtx_); dq_.push_back(std::move(val)); }",
        "        cv_.notify_one();",
        "    }",
        "    T pop() {",
        "        std::unique_lock<std::mutex> lk(mtx_);",
        "        cv_.wait(lk, [this] { return !dq_.empty(); });",
        "        T val = std::move(dq_.front());",
        "        dq_.pop_front();",
        "        return val;",
        "    }",
        "    bool empty() const {",
        "        std::lock_guard<std::mutex> lk(mtx_);",
        "        return dq_.empty();",
        "    }",
        "private:",
        "    std::deque<T> dq_;",
        "    mutable std::mutex mtx_;",
        "    std::condition_variable cv_;",
        "};"
      ].join("\n"))
    },

    "cpp-h5": {
      level: 3, title: "H卷·C++：手写 ring buffer（线程安全）",
      body: "手写一个固定容量的线程安全环形缓冲区：push（满则阻塞）、pop（空则阻塞）。",
      hint: "两个条件变量分别等非空和非满。",
      solution: C("cpp", "h5_ring_buffer.cpp", [
        "#include <array>",
        "#include <mutex>",
        "#include <condition_variable>",
        "template <typename T, size_t Cap>",
        "class RingBuffer {",
        "public:",
        "    void push(T val) {",
        "        std::unique_lock<std::mutex> lk(mtx_);",
        "        not_full_.wait(lk, [this] { return count_ < Cap; });",
        "        buf_[w_] = std::move(val);",
        "        w_ = (w_ + 1) % Cap; count_++;",
        "        not_empty_.notify_one();",
        "    }",
        "    T pop() {",
        "        std::unique_lock<std::mutex> lk(mtx_);",
        "        not_empty_.wait(lk, [this] { return count_ > 0; });",
        "        T val = std::move(buf_[r_]);",
        "        r_ = (r_ + 1) % Cap; count_--;",
        "        not_full_.notify_one();",
        "        return val;",
        "    }",
        "private:",
        "    std::array<T, Cap> buf_;",
        "    size_t r_ = 0, w_ = 0, count_ = 0;",
        "    std::mutex mtx_;",
        "    std::condition_variable not_empty_, not_full_;",
        "};"
      ].join("\n"))
    },

    "cpp-h6": {
      level: 3, title: "H卷·C++：手写读写锁（shared_mutex）",
      body: "手写一个简化读写锁：多读单写。用 mutex + 两个条件变量。",
      hint: "读者优先或写者优先任选，注意写者饿死问题。",
      solution: C("cpp", "h6_rw_lock.cpp", [
        "#include <mutex>",
        "#include <condition_variable>",
        "class RWLock {",
        "public:",
        "    void lock_read() {",
        "        std::unique_lock<std::mutex> lk(mtx_);",
        "        cv_.wait(lk, [this] { return writers_ == 0; });",
        "        readers_++;",
        "    }",
        "    void unlock_read() {",
        "        std::lock_guard<std::mutex> lk(mtx_);",
        "        readers_--;",
        "        if (readers_ == 0) cv_.notify_all();",
        "    }",
        "    void lock_write() {",
        "        std::unique_lock<std::mutex> lk(mtx_);",
        "        writers_++;",
        "        cv_.wait(lk, [this] { return readers_ == 0 && !writing_; });",
        "        writing_ = true;",
        "    }",
        "    void unlock_write() {",
        "        std::lock_guard<std::mutex> lk(mtx_);",
        "        writers_--; writing_ = false;",
        "        cv_.notify_all();",
        "    }",
        "private:",
        "    std::mutex mtx_;",
        "    std::condition_variable cv_;",
        "    int readers_ = 0, writers_ = /CODE 0; bool writing_ = false;",
        "};"
      ].join("\n"))
    },

    /* ==================== Python · H 卷 ==================== */

    "py-h1": {
      level: 1, title: "H卷·Python：Fibonacci 生成器版",
      body: "手写 fibonacci 生成器函数，惰性产出斐波那契数列。",
      hint: "yield 暂停，next 续。",
      solution: C("python", "h1_fib_gen.py", [
        "def fib():",
        "    a, b = 0, 1",
        "    while True:",
        "        yield a",
        "        a, b = b, a + b",
        "",
        "import itertools",
        "print(list(itertools.islice(fib(), 10)))"
      ].join("\n"))
    },

    "py-h2": {
      level: 2, title: "H卷·Python：手写 OrderedDict 功能",
      body: "手写一个保持插入顺序的 dict 子类（重写 __setitem__）。",
      hint: "维护一个 key 顺序列表，或直接用 dict（3.7+ 本身有序）。",
      solution: C("python", "h2_ordered_dict.py", [
        "class OrderedDict(dict):",
        "    def __init__(self, *args, **kwargs):",
        "        self._keys = []",
        "        super().__init__(*args, **kwargs)",
        "",
        "    def __setitem__(self, key, value):",
        "        if key not in self:",
        "            self._keys.append(key)",
        "        super().__setitem__(key, value)",
        "",
        "    def __iter__(self):",
        "        return iter(self._keys)",
        "",
        "# 注：Python 3.7+ 普通 dict 就保持插入序，但理解原理仍有价值"
      ].join("\n"))
    },

    "py-h3": {
      level: 2, title: "H卷·Python：手写 defaultdiat",
      body: "手写一个 defaultdict 简化版：missing key 时自动调用 default_factory。",
      hint: "重写 __missing__ 方法。",
      solution: C("python", "h3_defaultdict.py", [
        "class MyDefaultDict(dict):",
        "    def __init__(self, default_factory, *args):",
        "        self.default_factory = default_factory",
        "        super().__init__(*args)",
        "",
        "    def __missing__(self, key):",
        "        result = self.default_factory()",
        "        self[key] = result",
        "        return result",
        "",
        "d = MyDefaultDict(list)",
        "d[\"a\"].append(1)   # 不存在则自动建空列表"
      ].join("\n"))
    },

    "py-h4": {
      level: 3, featured: true, title: "H卷·Python：手写简易模板引擎",
      body: "手写一个极简模板引擎：支持 {{ name }} 变量替换。",
      hint: "re.sub + dict 查找。",
      solution: C("python", "h4_template.py", [
        "import re",
        "",
        "def render(template, context):",
        "    def replace(m):",
        "        key = m.group(1).strip()",
        "        return str(context.get(key, \"\"))",
        "    return re.sub(r\"\\{\\{\\s*(\\w+)\\s*\\}\\}\", replace, template)",
        "",
        "tpl = \"你好 {{ name }}，你有 {{ count }} 条消息\"",
        "print(render(tpl, {\"name\": \"RM\", \"count\": 3}))"
      ].join("\n"))
    },

    "py-h5": {
      level: 3, title: "H卷·Python：手写简易依赖注入容器",
      body: "手写一个极简 DI 容器：register(Interface, Impl)，resolve(Interface) 返回构造好的实例（含依赖递归注入）。",
      hint: "用 __init__ 签名检查参数类型注解，递归 resolve。",
      solution: C("python", "h5_di_container.py", [
        "import inspect",
        "",
        "class Container:",
        "    def __init__(self):",
        "        self._bindings = {}",
        "        self._singletons = {}",
        "",
        "    def register(self, base, impl):",
        "        self._bindings[base] = impl",
        "",
        "    def resolve(self, base):",
        "        impl = self._bindings.get(base, base)",
        "        if base in self._singletons:",
        "            return self._singletons[base]",
        "        # 检查构造函数参数类型注解，递归解析依赖",
        "        sig = inspect.signature(impl.__init__)",
        "        kwargs = {}",
        "        for name, param in sig.parameters.items():",
        "            if name == \"self\": continue",
        "            ann = param.annotation",
        "            if ann in self._bindings:",
        "                kwargs[name] = self.resolve(ann)",
        "        instance = impl(**kwargs)",
        "        self._singletons[base] = instance",
        "        return instance"
      ].join("\n"))
    },

    "py-h6": {
      level: 3, title: "H卷·Python：手写简易 Web 服务器（http.server）",
      body: "用 http.server 手写一个简易 Web 服务器：返回 HTML 页面和 JSON API。",
      hint: "HTTPServer + BaseHTTPRequestHandler，路由在 do_GET 里分发。",
      solution: C("python", "h6_http_server.py", [
        "from http.server import HTTPServer, BaseHTTPRequestHandler",
        "import json",
        "",
        "class Handler(BaseHTTPRequestHandler):",
        "    def do_GET(self):",
        "        if self.path == \"/\":",
        "            body = b\"<h1>RM Vision API</h1>\"",
        "            self.send_response(200)",
        "            self.send_header(\"Content-Type\", \"text/html; charset=utf-8\")",
        "            self.send_header(\"Content-Length\", str(len(body)))",
        "            self.end_headers()",
        "            self.wfile.write(body)",
        "        elif self.path == \"/api/status\":",
        "            body = json.dumps({\"status\": \"running\", \"fps\": 120}).encode()",
        "            self.send_response(200)",
        "            selfsend_header(\"Content-Type\", \"application/json\")",
        "            self.send_header(\"Content-Length\", str(len(body)))",
        "            self.end_headers()",
        "            self.wfile.write(body)",
        "",
        "server = HTTPServer((\"0.0.0.0\", 8080), Handler)",
        "server.serve_forever()"
      ].join("\n"))
    },

    /* ==================== ROS 2 · H 卷 ==================== */

    "ros-h1": {
      level: 1, title: "H卷·ROS2：rclpy 最小节点",
      body: "手写 rclpy 最小节点：创建节点，10Hz 定时打印 hello。",
      hint: "rclpy.init + create_node + create_timer(0.1, cb) + spin。",
      solution: C("python", "h1_rclpy_min.py", [
        "import rclpy",
        "from rclpy.node import Node",
        "",
        "class MinimalNode(Node):",
        "    def __init__(self):",
        "        super().__init__(\"minimal_node\")",
        "        self.timer = self.create_timer(0.1, self.on_timer)",
        "",
        "    def on_timer(self):",
        "        self.get_logger().info(\"hello\")",
        "",
        "def main():",
        "    rclpy.init()",
        "    node = MinimalNode()",
        "    rclpy.spin(node)",
        "    node.destroy_node()",
        "    rclpy.shutdown()"
      ].join("\n"))
    },

    "ros-h2": {
      level: 2, title: "H卷·ROS2：rclpy 发布自定义消息",
      r: null,
      body: "手写 rclpy 发布自定义 Armor 消息的节点。",
      hint: "from rm_interfaces.msg import Armor；pub.publish(msg)。",
      solution: C("python", "h2_pub_armor.py", [
        "import rclpy",
        "from rclpy.node import Node",
        "from rm_interfaces.msg import Armor",
        "",
        "class ArmorPublisher(Node):",
        "    def __init__(self):",
        "        super().__init__(\"armor_pub\")",
        "        self.pub = self.create_publisher(Armor, \"/armors\", 10)",
        "        self.timer = self.create_timer(0.1, self.publish_armor)",
        "",
        "    def publish_armor(self):",
        "        msg = Armor()",
        "        msg.cx, msg.cy = 320.0, 240.0",
        "        msg.conf = 0.95",
        "        self.pub.publish(msg)"
      ].join("\n"))
    },

    "ros-h3": {
      level: 2, title: "H卷·ROS2：rclpy 订阅图像 + CV Bridge",
      body: "手写 rclpy 节点订阅图像话题并用 cv_bridge 转 cv::Mat。",
      hint: "CvBridge().imgmsg_to_cv2(msg, \"bgr8\")。",
      solution: C("python", "h3_cvbridge.py", [
        "import rclpy",
        "from rclpy.node import Node",
        "from sensor_msgs.msg import Image",
        "from cv_bridge import CvBridge",
        "",
        "class ImageSub(Node):",
        "    def __init__(self):",
        "        super().__init__(\"image_sub\")",
        "        self.bridge = CvBridge()",
        "        self.sub = self.create_subscription(",
        "            Image, \"/camera/image_raw\", self.on_image, 10)",
        "",
        "    def on_image(self, msg):",
        "        cv_img = self.bridge.imgmsg_to_cv2(msg, \"bgr8\")",
        "        self.get_logger().info(f\"收到 {cv_img.shape} 图像\")"
      ].join("\n"))
    },

    "ros-h4": {
      level: 3, featured: true, title: "H卷·ROS2：多线程执行器",
      body: "手写使用 MultiThreadedExecutor 的节点：一个回调耗时长，用多线程执行器避免阻塞其他回调。",
      hint: "rclcpp::executors::MultiThreadedExecutor + callback_group。",
      solution: C("cpp", "h4_mt_executor.cpp", [
        "#include <rclcpp/rclcpp.hpp>",
        "",
        "class MTNode : public rclcpp::Node {",
        "public:",
        "    MTNode() : Node(\"mt_node\") {",
        "        // 创建可重入回调组",
        "        auto group = create_callback_group(",
        "            rclcpp::CallbackGroupType::Reentrant);",
        "        // 订阅指定回调组",
        "        rclcpp::SubscriptionOptions opts;",
        "        opts.callback_group = group;",
        "        sub1_ = create_subscription<std_msgs::msg::String>(",
        "            \"topic1\", 10,",
        "            [this](std_msgs::msg::String::SharedPtr) { heavy_work(); },",
        "            opts);",
        "        sub2_ = create_subscription<std_msgs::msg::String>(",
        "            \"topic2\", 10,",
        "            [this](std_msgs::msg::String::SharedPtr) { light_work(); });",
        "    }",
        "private:",
        "    void heavy_work() { /* 耗时操作 */ }",
        "    void light_work() { /* 快速操作 */ }",
        "    rclcpp::Subscription<std_msgs::msg::String>::SharedPtr sub1_, sub2_;",
        "};",
        "",
        "int main(int argc, char *argv[]) {",
        "    rclcpp::init(argc, argv);",
        "    rclcpp::executors::MultiThreadedExecutor executor;",
        "    executor.add_node(std::make_shared<MTNode>());",
        "    executor.spin();",
        "    return 0;",
        "}"
      ].join("\n"))
    },

    /* ==================== RM 电控 · H 卷 ==================== */

    "rme-h1": {
      level: 2, title: "H卷·电控：编码器速度方向判别",
      body: "手写编码器测速的方向判别逻辑：处理计数器溢出回绕。",
      hint: "(int16_t)(now - last) 让回绕自动正确。",
      solution: C("c", "h1_enc_direction.c", [
        "int16_t encoder_delta(uint16_t now, uint16_t last) {",
        "    return (int16_t)(now - last);   // 16 位回绕自动处理",
        "}",
        "/* 例：now=5, last=65530",
        " * 差 = 5 - 65530 = -65525 → 强转 int16 = 11（正转 11 格）",
        " * 反向溢出同理，正负自动正确 */"
      ].join("\n"))
    },

    "rme-h2": {
      level: 3, title: "H卷·电控：手写一阶互补滤波器",
      body: "手写一阶互补滤波器融合陀螺仪和加速度计估计 pitch 角。",
      hint: "angle = α × (angle + gyro×dt) + (1-α) × acc_angle，α≈0.98。",
      solution: C("c", "h2_complementary.c", [
        "float complementary_filter(float gyro_rate, float acc_angle, float dt, float alpha) {",
        "    static float angle = 0;",
        "    angle = alpha * (angle + gyro_rate * dt) + (1 - alpha) * acc_angle;",
        "    return angle;",
        "}",
        "/* alpha=0.98：信任陀螺仪的短期积分，加速度计长期校正漂移 */"
      ].join("\n"))
    },

    "rme-h3": {
      level: 3, featured: true, title: "H卷·电控：手写 Mahony 互补姿态解算",
      body: "手写 Mahony 姿态解算算法（简化版：只处理 roll/pitch/yaw 更新方程）。",
      hint: "误差 = 叉积(重力方向参考,测量) → PI 补偿 → 修正陀螺仪 → 四元数积分。",
      solution: C("c", "h3_mahony.c", [
        "typedef struct { float q0,q1,q2,q3; float exInt,eyInt,ezInt; } Mahony;",
        "",
        "void mahony_update(Mahony *m, float gx, float gy, float gz,",
        "                   float ax, float ay, float az, float dt) {",
        "    float Kp = 0.5f, Ki = 0.0f;",
        "    // 1. 加速度计归一化",
        "    float norm = sqrtf(ax*ax + ay*ay + az*az);",
        "    if (norm < 1e-6f) return;",
        "    ax /= norm; ay /= norm; az /= norm;",
        "    // 2. 估计的重力方向（由四元数旋转）",
        "    float vx = 2*(m->q1*m->q3 - m->q0*m->q2);",
        "    float vy = 2*(m->q0*m->q1 + m->q2*m->q3);",
        "    float vz = m->q0*m->q0 - m->q1*m->q1 - m->q2*m->q2 + m->q3*m->q3;",
        "    // 3. 误差 = 测量 × 估计（叉积）",
        "    float ex = ay*vz - az*vy, ey = az*vx - ax*vz, ez = ax*vy - ay*vx;",
        "    // 4. PI 补偿",
        "    m->exInt += ex*Ki; m->eyInt += ey*Ki; m->ezInt += ez*Ki;",
        "    gx += Kp*ex + m->exInt; gy += Kp*ey + m->eyInt; gz += Kp*ez + m->ezInt;",
        "    // 5. 四元数积分（一阶）",
        "    float q0=m->q0,q1=m->q1,q2=m->q2,q3=m->q3;",
        "    m->q0 += (-q1*gx - q2*gy - q3*gz)*0.5f*dt;",
        "    m->q1 += ( q0*gx + q2*gz - q3*gy)*0.5f*dt;",
        "    m->q2 += ( q0*gy - q1*gz + q3*gx)*0.5f*dt;",
        "    m->q3 += ( q0*gz + q1*gy - q2*gx)*0.5f*dt;",
        "    // 6. 归一化",
        "    norm = sqrtf(m->q0*m->q0+m->q1*m->q1+m->q2*m->q2+m->q3*m->q3);",
        "    m->q0/=norm; m->q1/=norm; m->q2/=norm; m->q3/=norm;",
        "}"
      ].join("\n"))
    },

    "rme-h4": {
      level: 3, title: "H卷·电控：拨弹电机堵转检测",
      body: "手写拨弹电机堵转检测：电流大但转速接近零持续 200ms → 判定堵转 → 反转复位。",
      hint: "状态机：NORMAL → STALL_DETECTED → REVERSE → NORMAL。",
      solution: C("c", "h4_stall_detect.c", [
        "typedef enum { TRIG_NORMAL, TRIG_STALL, TRIG_REVERSE } TrigState;",
        "",
        "void trigger_task(void) {",
        "    static TrigState state = TRIG_NORMAL;",
        "    static uint32_t stall_start = 0;",
        "    int16_t speed = trigger_fb.speed_rpm;",
        "    int16_t current = trigger_fb.current;",
        "    uint32_t now = millis();",
        "",
        "    switch (state) {",
        "        case TRIG_NORMAL:",
        "            if (abs(current) > 8000 && abs(speed) < 100) {   // 大电流低转速",
        "                if (stall_start == 0) stall_start = now;",
        "                if (now - stall_start > 200) {",
        "                    state = TRIG_REVERSE;",
        "                    stall_start = 0;",
        "                }",
        "            } else stall_start = 0;",
        "            break;",
        "        case TRIG_REVERSE:   // 反转退弹",
        "            trigger_set_current(-3000);",
        "            if (abs(speed) < 50 && now - stall_start > 300) state = TRIG_NORMAL;",
        "            break;",
        "    }",
        "}"
      ].join("\n"))
    },

    /* ==================== RM 视觉 · H 卷 ==================== */

    "rmv-h1": {
      level: 2, title: "H卷·视觉：手写 NMS（非极大值抑制）",
      body: "手写 NMS 算法：按置信度排序，删除与保留框 IoU 大于阈值的所有框。",
      hint: "排序后贪心保留，算 IoU，删重叠的。",
      solution: C("python", "h1_nms.py", [
        "def iou(a, b):",
        "    ax1,ay1,ax2,ay2 = a[:4]; bx1,by1,bx2,by2 = b[:4]",
        "    ix1,iy1 = max(ax1,bx1), max(ay1,by1)",
        "    ix2,iy2 = min(ax2,bx2), min(ay2,by2)",
        "    inter = max(0, ix2-ix1) * max(0, iy2-iy1)",
        "    area_a = (ax2-ax1)*(ay2-ay1); area_b = (bx2-bx1)*(by2-by1)",
        "    return inter / (area_a + area_b - inter + 1e-9)",
        "",
        "def nms(boxes, scores, thresh=0.45):",
        "    idxs = sorted(range(len(boxes)), key=lambda i: -scores[i])",
        "    keep = []",
        "    while idxs:",
        "        best = idxs.pop(0)",
        "        keep.append(best)",
        "        idxs = [i for i in idxs if iou(boxes[best], boxes[i]) <= thresh]",
        "    return keep"
      ].join("\n"))
    },

    "rmv-h2": {
      level: 2, title: "H卷·视觉：手写 k-近邻分类器",
      body: "手写 kNN 分类器：fit 存样本，predict 找 k 个最近邻投票。",
      hint: "欧氏距离 + 排序取前 k + Counter 投票。",
      solution: C("python", "h2_knn.py", [
        "import numpy as np",
        "from collections import Counter",
        "",
        "class KNN:",
        "    def __init__(self, k=3):",
        "        self.k = k",
        "",
        "    def fit(self, X, y):",
        "        self.X, self.y = np.array(X), np.array(y)",
        "",
        "    def predict(self, x):",
        "        dists = np.linalg.norm(self.X - x, axis=1)",
        "        k_idx = np.argsort(dists)[:self.k]",
        "        votes = Counter(self.y[k_idx])",
        "        return votes.most_common(1)[0][0]"
      ].join("\n"))
    },

    "rmv-h3": {
      level: 3, featured: true, title: "H卷·视觉：完整自瞄决策逻辑",
      body: "手写完整自瞄决策逻辑：多装甲板选目标（距离最近+置信度最高加权）、预测、开火判定。",
      hint: "选目标 = 0.6×归一化置信度 + 0.4×(1-归一化距离)；开火 = 预测误差 < 阈值 且 弹量充足 且 冷却结束。",
      solution: C("python", "h3_autoaim_logic.py", [
        "import numpy as np",
        "",
        "def select_target(armors, my_pos):",
        "    \"\"\"多目标选择：置信度和距离加权\"\"\"",
        "    best, best_score = None, -1",
        "    for a in armors:",
        "        dist = np.linalg.norm(a[:3] - my_pos)",
        "        dist_score = 1.0 / (1.0 + dist)          # 越近分越高",
        "        score = 0.6 * a.conf + 0.4 * dist_score",
        "        if score > best_score:",
        "            best, best_score = a, score",
        "    return best",
        "",
        "def should_fire(predicted_error, threshold, ammo, cooldown_ok):",
        "    \"\"\"开火三条件：误差小、有弹、冷却结束\"\"\"",
        "    return predicted_error < threshold and ammo > 0 and cooldown_ok"
      ].join("\n"))
    },

    "rmv-h4": {
      level: 3, title: "H卷·视觉：相机-IMU 时间同步策略",
      body: "讨论相机与 IMU 的时间同步方案：硬件触发 vs 软件时间戳对齐。写出软同步的代码思路。",
      hint: "记录每个图像帧到达时间与最近 IMU 样本，插值对齐。",
      solution: C("python", "h4_cam_imu_sync.py", [
        "# 软件时间同步：",
        "# 1. IMU 以 1kHz 连续采样，缓存 (t, data) 环形队列",
        "# 2. 图像到达时记录 t_img（用同一时钟！）",
        "# 3. 对 t_img ± 5ms 内的 IMU 样本线性插值，得到图像时刻的 IMU 状态",
        "",
        "def align_imu_to_image(imu_queue, t_img):",
        "    # imu_queue: [(t, wx, wy, wz), ...] 按时间排序",
        "    before = [s for s in imu_queue if s[0] <= t_img]",
        "    after  = [s for s in imu_queue if s[0] >  t_img]",
        "    if not before or not after:",
        "        return None   # 覆盖不足，丢弃这帧",
        "    a, b = before[-1], after[0]",
        "    ratio = (t_img - a[0]) / (b[0] - a[0])",
        "    return tuple(a[i] + ratio * (b[i] - a[i]) for i in range(1, 4))"
      ].join("\n"))
    },

    "rmv-h5": {
      level: 3, title: "H卷·视觉：手写一维卡尔曼滤波",
      body: "手写一维卡尔曼滤波（匀速模型）：只跟踪位置和速度，观测只有位置。",
      hint: "predict: x+=v·dt, P+=Q；update: K=P/(P+R), x+=K(z-x), P*=(1-K)。",
      solution: C("python", "h5_kf_1d.py", [
        "class KalmanFilter1D:",
        "    def __init__(self, q=0.01, r=0.1):",
        "        self.x = 0.0     # 位置",
        "        self.v = 0.0     # 速度",
        "        self.P = [[1,0],[0,1]]   # 协方差",
        "        self.q, self.r = q, r",
        "",
        "    def predict(self, dt):",
        "        self.x += self.v * dt",
        "        self.P[0][0] += dt * (self.P[1][0] + self.P[0][1]) + self.q",
        "        self.P[0][1] += dt * self.P[1][1]",
        "        self.P[1][0] += dt * self.P[1][1]",
        "        self.P[1][1] += self.q",
        "",
        "    def update(self, z):",
        "        K0 = self.P[0][0] / (self.P[0][0] + self.r)",
        "        K1 = self.P[1][0] / (self.P[0][0] + self.r)",
        "        innovation = z - self.x",
        "        self.x += K0 * innovation",
        "        self.v += K1 * innovation",
        "        P00 = self.P[0][0]",
        "        self.P[0][0] -= K0 * P00",
        "        self.P[0][1] -= K0 * self.P[0][1]",
        "        self.P[1][0] -= K1 * P00",
        "        self.P[1][1] -= K1 * self.P[0][1]"
      ].join("\n"))
    }

  });
})();
