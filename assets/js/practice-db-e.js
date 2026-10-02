/* RM 兵工厂 · 手写练习题库（Python 扩容卷）
 * 覆盖：基础语法 / 数据结构 / 函数 / 类 / 迭代器与生成器 / 装饰器 / NumPy / 文件与异常
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

    /* ==================== Python · 基础语法 ==================== */

    "py-p14": {
      level: 1, title: "变量与类型：动态类型体验",
      body: "手写脚本：同一个变量依次赋值 int、float、str、list，每次打印 type()。对比 C 的静态类型。",
      hint: "x = 42; x = 3.14; x = 'hello'; x = [1,2,3]",
      solution: C("python", "dynamic_type.py", [
        "x = 42",
        "print(type(x))      # <class 'int'>",
        "x = 3.14",
        "print(type(x))      # <class 'float'>",
        "x = \"hello\"",
        "print(type(x))      # <class 'str'>",
        "x = [1, 2, 3]",
        "print(type(x))      # <class 'list'>",
        "# C: 变量类型编译时确定，不能变。Python: 运行时可变。"
      ].join("\n"))
    },

    "py-p15": {
      level: 1, title: "字符串格式化三种写法",
      body: "手写脚本用 % 格式、str.format()、f-string 三种方式输出「姓名=张三 年龄=20」。",
      hint: "f\"姓名={name} 年龄={age}\" 是最现代的写法。",
      solution: C("python", "format.py", [
        "name, age = \"张三\", 20",
        "# 1. % 格式（C 风格）",
        "print(\"姓名=%s 年龄=%d\" % (name, age))",
        "# 2. str.format()",
        "print(\"姓名={} 年龄={}\".format(name, age))",
        "# 3. f-string（推荐）",
        "print(f\"姓名={name} 年龄={age}\")"
      ].join("\n"))
    },

    "py-p16": {
      level: 1, title: "列表基础操作",
      body: "手写脚本演示列表的增删改查：append、insert、remove、pop、切片、索引、len。",
      hint: "lst[1:3] 是切片（含头不含尾）；del lst[i] 删除指定下标。",
      solution: C("python", "list_ops.py", [
        "lst = [1, 2, 3]",
        "lst.append(4)          # [1,2,3,4] 尾部追加",
        "lst.insert(1, 99)      # [1,99,2,3,4] 指定位置插入",
        "lst.remove(99)         # 删除第一个值为99的",
        "val = lst.pop()        # 弹出尾部，val=4",
        "lst[0] = 100           # 修改",
        "print(lst[1:3])        # 切片 [2,3]",
        "print(len(lst))        # 长度"
      ].join("\n"))
    },

    "py-p17": {
      level: 1, title: "字典基础操作",
      body: "手写脚本演示字典的增删改查：增、删、改、查、get、keys、values、items、遍历。",
      hint: "d.get(key, default) 不存在时返回默认值而不是报错。",
      solution: C("python", "dict_ops.py", [
        "d = {\"name\": \"张三\", \"age\": 20}",
        "d[\"score\"] = 95            # 增",
        "d[\"age\"] = 21              # 改",
        "print(d[\"name\"])           # 查",
        "print(d.get(\"phone\", \"无\"))  # 查（安全，不存在返回默认值）",
        "del d[\"score\"]             # 删",
        "for k, v in d.items():     # 遍历键值对",
        "    print(f\"{k}: {v}\")"
      ].join("\n"))
    },

    "py-p18": {
      level: 1, title: "集合：去重与交并差",
      body: "手写脚本演示集合的去重、交集、并集、差集运算。",
      hint: "& 交集、| 并集、- 差集、^ 对称差。",
      solution: C("python", "set_ops.py", [
        "a = {1, 2, 3, 4}",
        "b = {3, 4, 5, 6}",
        "print(a & b)   # {3, 4} 交集",
        "print(a | b)   # {1,2,3,4,5,6} 并集",
        "print(a - b)   # {1, 2} 差集",
        "print(a ^ b)   # {1,2,5,6} 对称差",
        "lst = [1, 1, 2, 2, 3]",
        "print(set(lst))  # {1, 2, 3} 去重"
      ].join("\n"))
    },

    "py-p19": {
      level: 1, title: "三元表达式与列表推导式",
      body: "手写脚本：用三元表达式给变量赋值，用列表推导式生成平方数列表，再加条件过滤。",
      hint: "[x*x for x in range(10) if x % 2 == 0]",
      solution: C("python", "comprehension.py", [
        "# 三元表达式",
        "age = 20",
        "status = \"成年\" if age >= 18 else \"未成年\"",
        "# 列表推导式",
        "squares = [x * x for x in range(10)]",
        "# 带条件过滤",
        "even_squares = [x * x for x in range(10) if x % 2 == 0]",
        "# 带条件表达式",
        "labels = [\"偶\" if x % 2 == 0 else \"奇\" for x in range(5)]"
      ].join("\n"))
    },

    "py-p20": {
      level: 1, title: "循环与 break/continue/else",
      body: "手写脚本演示 for 循环的 break、continue，以及 Python 特有的 for-else 语法。",
      hint: "for-else：循环没被 break 时才执行 else。适合找东西的场景。",
      solution: C("python", "loop_else.py", [
        "# for-else：没找到时走 else",
        "for x in [1, 3, 5, 7]:",
        "    if x == 4:",
        "        print(\"找到了\")",
        "        break",
        "else:",
        "    print(\"没找到\")   # 循环正常结束（没 break）才执行"
      ].join("\n"))
    },

    "py-p21": {
      level: 1, title: "多变量赋值与解包",
      body: "手写脚本演示 Python 的多重赋值、元组解包、星号解包。",
      hint: "a, b = b, a 交换变量；a, *rest = lst 星号收集剩余。",
      solution: C("python", "unpack.py", [
        "a, b = 1, 2              # 多重赋值",
        "a, b = b, a              # 交换！不需要临时变量",
        "first, *rest = [1, 2, 3, 4]   # first=1, rest=[2,3,4]",
        "*init, last = [1, 2, 3, 4]    # init=[1,2,3], last=4",
        "x, y, z = (10, 20, 30)   # 元组解包"
      ].join("\n"))
    },

    "py-p22": {
      level: 1, title: "is vs ==",
      body: "解释 is 和 == 的区别。手写代码演示整数缓存、字符串驻留的坑。",
      hint: "== 比较值；is 比较身份（是否同一个对象，即 id 是否相同）。",
      solution: C("python", "is_vs_eq.py", [
        "a = [1, 2, 3]",
        "b = [1, 2, 3]",
        "print(a == b)   # True：值相等",
        "print(a is b)   # False：不同对象",
        "# 小整数缓存（-5~256）：",
        "x = 256; y = 256",
        "print(x is y)   # True：缓存池",
        "x = 257; y = 257",
        "print(x is y)   # False（大多数实现）：不同对象"
      ].join("\n"))
    },

    "py-p23": {
      level: 1, title: "可变与不可变类型",
      body: "解释可变与不可变类型。手写代码演示函数参数传递中两者的行为差异。",
      hint: "int/str/tuple 不可变；list/dict/set 可变。",
      solution: C("python", "mutable.py", [
        "# 不可变：修改其实是创建新对象",
        "x = 10",
        "print(id(x))    # 地址 A",
        "x += 1",
        "print(id(x))    # 地址 B，变了！",
        "# 可变：原地修改",
        "lst = [1, 2]",
        "print(id(lst))  # 地址 A",
        "lst.append(3)",
        "print(id(lst))  # 地址 A，没变",
        "# 函数参数：可变对象会被函数内修改影响外部",
        "def modify(lst): lst.append(4)"
      ].join("\n"))
    },

    "py-p24": {
      level: 1, title: "切片高级用法",
      brain: null,
      body: "手写脚本演示切片的：复制、反转、步长、删除、替换整段。",
      hint: "lst[::-1] 反转；lst[::2] 隔一个取一个。",
      solution: C("python", "slice.py", [
        "lst = list(range(10))    # [0..9]",
        "copy = lst[:]            # 浅拷贝",
        "reversed_lst = lst[::-1] # 反转",
        "evens = lst[::2]         # [0,2,4,6,8]",
        "odds = lst[1::2]         # [1,3,5,7,9]",
        "lst[2:5] = [99]          # 替换第2~4个为单个99",
        "del lst[::2]             # 删除偶数下标元素"
      ].join("\n"))
    },

    /* ==================== Python · 函数 ==================== */

    "py-p25": {
      level: 1, title: "函数：默认参数的坑",
      body: "解释为什么默认参数不能是可变对象。手写错误示范和正确写法。",
      hint: "默认参数在函数定义时求值一次，所有调用共享。应该用 None 哨兵。",
      solution: C("python", "default_arg.py", [
        "# 错误：所有调用共享同一个 list！",
        "def bad_append(item, lst=[]):",
        "    lst.append(item)",
        "    return lst",
        "bad_append(1)   # [1]",
        "bad_append(2)   # [1, 2]！不是 [2]",
        "",
        "# 正确：用 None 哨兵",
        "def good_append(item, lst=None):",
        "    if lst is None: lst = []",
        "    lst.append(item)",
        "    return lst"
      ].join("\n"))
    },

    "py-p26": {
      level: 1, title: "*args 与 **kwargs",
      body: "手写函数接受任意数量的位置参数和关键字参数，并打印它们。",
      hint: "*args 收集位置参数为元组；**kwargs 收集关键字参数为字典。",
      solution: C("python", "args_kwargs.py", [
        "def func(a, b, *args, **kwargs):",
        "    print(f\"a={a}, b={b}\")",
        "    print(f\"args={args}\")       # 元组",
        "    print(f\"kwargs={kwargs}\")   # 字典",
        "",
        "func(1, 2, 3, 4, x=5, y=6)",
        "# a=1, b=2, args=(3,4), kwargs={'x':5,'y':6}"
      ].join("\n"))
    },

    "py-p27": {
      level: 1, title: "lambda 与 sorted",
      body: "手写脚本：用 lambda 对学生元组列表按成绩降序排序，成绩相同按姓名升序。",
      hint: "sorted(students, key=lambda s: (-s[1], s[0]))",
      solution: C("python", "lambda_sorted.py", [
        "students = [(\"张三\", 85), (\"李四\", 92), (\"王五\", 85)]",
        "result = sorted(students, key=lambda s: (-s[1], s[0]))",
        "# [(\"李四\",92), (\"张三\",85), (\"王五\",85)]",
        "# 技巧：数字取负实现降序，字符串不能取负"
      ].join("\n"))
    },

    "py-p28": {
      level: 2, title: "闭包",
      body: "手写一个闭包：make_counter() 返回一个计数器函数，每次调用计数加一。",
      hint: "内层函数引用外层函数的局部变量，形成闭包。",
      solution: C("python", "closure.py", [
        "def make_counter():",
        "    count = 0",
        "    def counter():",
        "        nonlocal count    # 声明修改外层变量",
        "        count += 1",
        "        return count",
        "    return counter",
        "",
        "c = make_counter()",
        "c()  # 1",
        "c()  # 2"
      ].join("\n"))
    },

    "py-p29": {
      level: 2, featured: true, title: "装饰器：计时器",
      body: "手写一个装饰器 @timer，打印函数执行时间（毫秒）。",
      hint: "用 functools.wraps 保留原函数元信息；用 time.perf_counter() 计时。",
      solution: C("python", "timer_deco.py", [
        "import time",
        "import functools",
        "",
        "def timer(func):",
        "    @functools.wraps(func)",
        "    def wrapper(*args, **kwargs):",
        "        start = time.perf_counter()",
        "        result = func(*args, **kwargs)",
        "        elapsed = (time.perf_counter() - start) * 1000",
        "        print(f\"{func.__name__} 耗时 {elapsed:.2f} ms\")",
        "        return result",
        "    return wrapper",
        "",
        "@timer",
        "def slow_func():",
        "    time.sleep(0.1)"
      ].join("\n"))
    },

    "py-p30": {
      level: 2, title: "装饰器：带参数的装饰器",
      body: "手写一个三重嵌套的带参数装饰器 @repeat(n)，让函数执行 n 次。",
      hint: "三层：装饰器工厂 → 装饰器 → 包装函数。",
      solution: C("python", "repeat_deco.py", [
        "import functools",
        "",
        "def repeat(n):",
        "    def decorator(func):",
        "        @functools.wraps(func)",
        "        def wrapper(*args, **kwargs):",
        "            for _ in range(n):",
        "                result = func(*args, **kwargs)",
        "            return result",
        "        return wrapper",
        "    return decorator",
        "",
        "@repeat(3)",
        "def greet(name):",
        "    print(f\"hello {name}\")"
      ].join("\n"))
    },

    "py-p31": {
      level: 2, title: "递归：快速排序",
      "py-pp31": null,
      body: "手写 Python 版快速排序（递归 + 列表推导式）。",
      hint: "选第一个元素做 pivot，小于放左、大于放右、递归。",
      solution: C("python", "quick_sort.py", [
        "def quick_sort(lst):",
        "    if len(lst) <= 1:",
        "        return lst",
        "    pivot = lst[0]",
        "    left = [x for x in lst[1:] if x < pivot]",
        "    right = [x for x in lst[1:] if x >= pivot]",
        "    return quick_sort(left) + [pivot] + quick_sort(right)"
      ].join("\n"))
    },

    "py-p32": {
      level: 2, title: "递归：目录树遍历",
      body: "手写递归函数打印目录树（用 os.walk 或递归 os.listdir）。",
      hint: "递归三要素：参数、终止条件、递归调用。",
      solution: C("python", "dir_tree.py", [
        "import os",
        "",
        "def print_tree(path, prefix=\"\"):",
        "    entries = sorted(os.listdir(path))",
        "    for i, entry in enumerate(entries):",
        "        is_last = (i == len(entries) - 1)",
        "        print(prefix + (\"└── \" if is_last else \"├── \") + entry)",
        "        full = os.path.join(path, entry)",
        "        if os.path.isdir(full):",
        "            ext = \"    \" if is_last else \"│   \"",
        "            print_tree(full, prefix + ext)"
      ].join("\n"))
    },

    /* ==================== Python · 类与 OOP ==================== */

    "py-p33": {
      level: 2, title: "手写完整类：银行账户",
      body: "手写 BankAccount 类：私有属性 balance，方法 deposit、withdraw（余额不足抛异常）、__str__。",
      hint: "Python 的私有属性是约定：_balance（受保护）或 __balance（名称改写）。",
      solution: C("python", "bank_account.py", [
        "class BankAccount:",
        "    def __init__(self, owner, balance=0):",
        "        self.owner = owner",
        "        self._balance = balance",
        "",
        "    def deposit(self, amount):",
        "        if amount <= 0:",
        "            raise ValueError(\"存款金额必须为正\")",
        "        self._balance += amount",
        "",
        "    def withdraw(self, amount):",
        "        if amount > self._balance:",
        "            raise ValueError(\"余额不足\")",
        "        self._balance -= amount",
        "",
        "    def __str__(self):",
        "        return f\"{self.owner}: {self._balance:.2f} 元\""
      ].join("\n"))
    },

    "py-p34": {
      level: 2, title: "属性装饰器 property",
      body: "用 @property 装饰器实现只读属性和带校验的 setter。",
      hint: "@property 定义 getter；@x.setter 定义 setter。",
      solution: C("python", "property.py", [
        "class Temperature:",
        "    def __init__(self):",
        "        self._celsius = 0",
        "",
        "    @property",
        "    def celsius(self):",
        "        return self._celsius",
        "",
        "    @celsius.setter",
        "    def celsius(self, value):",
        "        if value < -273.15:",
        "            raise ValueError(\"低于绝对零度\")",
        "        self._celsius = value",
        "",
        "    @property",
        "    def fahrenheit(self):",
        "        return self._celsius * 9 / 5 + 32"
      ].join("\n"))
    },

    "py-p35": {
      level: 2, title: "继承与 super()",
      body: "手写父类 Animal 和子类 Dog，子类用 super().__init__() 调用父类构造函数。",
      hint: "super() 返回父类代理，MRO 顺序调用。",
      solution: C("python", "inheritance.py", [
        "class Animal:",
        "    def __init__(self, name):",
        "        self.name = name",
        "",
        "    def speak(self):",
        "        raise NotImplementedError",
        "",
        "class Dog(Animal):",
        "    def __init__(self, name, breed):",
        "        super().__init__(name)      # 调父类构造",
        "        self.breed = breed",
        "",
        "    def speak(self):",
        "        return f\"{self.name}: 汪汪!\""
      ].join("\n"))
    },

    "py-p36": {
      level: 2, title: "魔术方法：__repr__ 与 __eq__",
      body: "手写 Vector2D 类，实现 __repr__、__add__、__eq__、__len__（模长取整）。",
      hint: "__repr__ 用于调试；__eq__ 定义相等；__add__ 定义 + 运算。",
      solution: C("python", "magic_methods.py", [
        "import math",
        "",
        "class Vector2D:",
        "    def __init__(self, x, y):",
        "        self.x, self.y = x, y",
        "",
        "    def __repr__(self):",
        "        return f\"Vector2D({self.x}, {self.y})\"",
        "",
        "    def __add__(self, other):",
        "        return Vector2D(self.x + other.x, self.y + other.y)",
        "",
        "    def __eq__(self, other):",
        "        return self.x == other.x and self.y == other.y",
        "",
        "    def __len__(self):",
        "        return int(math.hypot(self.x, self.y))"
      ].join("\n"))
    },

    "py-p37": {
      level: 2, title: "静态方法与类方法",
      body: "手写一个类同时包含普通方法、@staticmethod、@classmethod，解释三者区别。",
      hint: "普通方法接 self；静态方法不接；类方法接 cls。",
      solution: C("python", "static_class_method.py", [
        "class Pizza:",
        "    total_made = 0",
        "",
        "    def __init__(self, ingredients):",
        "        self.ingredients = ingredients",
        "        Pizza.total_made += 1",
        "",
        "    @staticmethod",
        "    def is_valid_ingredient(item):",
        "        return item in [\"cheese\", \"tomato\", \"mushroom\"]",
        "",
        "    @classmethod",
        "    def margherita(cls):",
        "        return cls([\"cheese\", \"tomato\"])   # 用 cls 创建实例",
        "",
        "    @classmethod",
        "    def get_total(cls):",
        "        return cls.total_made"
      ].join("\n"))
    },

    "py-p38": {
      level: 2, title: "dataclass 数据类",
      body: "用 @dataclass 定义 Armor 数据类，自动生成 __init__、__repr__、__eq__。",
      hint: "from dataclasses import dataclass; field(default_factory=list) 给可变默认值。",
      solution: C("python", "dataclass.py", [
        "from dataclasses import dataclass, field",
        "",
        "@dataclass",
        "class Armor:",
        "    cx: float",
        "    cy: float",
        "    w: float",
        "    h: float",
        "    conf: float = 0.0",
        "    corners: list = field(default_factory=list)  # 可变默认值",
        "",
        "# 自动获得 __init__、__repr__、__eq__",
        "a = Armor(100, 200, 50, 30, 0.95)"
      ].join("\n"))
    },

    "py-p39": {
      level: 2, title: "枚举 Enum",
      body: "用 enum.Enum 定义颜色枚举，成员带值。手写遍历和比较。",
      hint: "class Color(enum.Enum): RED = 1; BLUE = 2",
      solution: C("python", "enum.py", [
        "import enum",
        "",
        "class Color(enum.Enum):",
        "    RED = 1",
        "    BLUE = 2",
        "",
        "c = Color.RED",
        "print(c.name)    # \"RED\"",
        "print(c.value)   # 1",
        "for color in Color:",
        "    print(color)"
      ].join("\n"))
    },

    "py-p40": {
      level: 2, title: "with 语句与上下文管理器",
      e: null,
      body: "手写一个上下文管理器类：__enter__ 打开资源，__exit__ 释放资源。用 with 使用它。",
      hint: "__exit__ 返回 False 表示异常继续传播，True 表示吞掉异常。",
      solution: C("python", "context_manager.py", [
        "class Timer:",
        "    def __enter__(self):",
        "        self.start = time.perf_counter()",
        "        return self",
        "",
        "    def __exit__(self, exc_type, exc_val, exc_tb):",
        "        self.elapsed = time.perf_counter() - self.start",
        "        print(f\"耗时 {self.elapsed * 1000:.2f} ms\")",
        "        return False   # 不吞异常",
        "",
        "with Timer():",
        "    time.sleep(0.1)"
      ].join("\n"))
    },

    /* ==================== Python · 迭代器与生成器 ==================== */

    "py-p41": {
      level: 2, featured: true, title: "生成器函数",
      body: "手写生成器函数 fibonacci()，用 yield 逐个产生斐波那契数。对比列表版本省多少内存。",
      hint: "yield 暂停函数并返回值，下次 next() 从暂停处继续。",
      solution: C("python", "generator.py", [
        "def fibonacci():",
        "    a, b = 0, 1",
        "    while True:           # 无限生成",
        "        yield a",
        "        a, b = b, a + b",
        "",
        "gen = fibonacci()",
        "for _ in range(10):",
        "    print(next(gen))"
      ].join("\n"))
    },

    "py-p42": {
      level: 2, title: "生成器表达式",
      body: "手写脚本对比列表推导式和生成器表达式的内存差异。",
      hint: "sum(x*x for x in range(10**6)) 不建立大列表，内存 O(1)。",
      solution: C("python", "gen_expr.py", [
        "# 列表推导式：先建整个列表（内存大）",
        "squares_list = [x * x for x in range(10**6)]",
        "# 生成器表达式：惰性求值（内存 O(1)）",
        "squares_gen = (x * x for x in range(10**6))",
        "# 直接聚合时用生成器表达式更省内存：",
        "total = sum(x * x for x in range(10**6))"
      ].join("\n"))
    },

    "py-p43": {
      level: 2, title: "yield from 委托生成器",
      "py-p43x": null,
      body: "手写嵌套生成器：外层用 yield from 委托给内层生成器。",
      hint: "yield from iterable 等价于 for x in iterable: yield x。",
      solution: C("python", "yield_from.py", [
        "def inner(n):",
        "    for i in range(n):",
        "        yield i",
        "",
        "def outer():",
        "    yield from inner(3)   # 委托给 inner",
        "    yield \"done\"",
        "",
        "# list(outer()) = [0, 1, 2, 'done']"
      ].join("\n"))
    },

    "py-p44": {
      level: 2, title: "迭代器协议：__iter__ 和 __next__",
      body: "手写一个类实现迭代器协议，用 for 循环遍历它。",
      hint: "__iter__ 返回 self，__next__ 返回下一个值或抛 StopIteration。",
      solution: C("python", "iterator.py", [
        "class CountDown:",
        "    def __init__(self, start):",
        "        self.n = start",
        "",
        "    def __iter__(self):",
        "        return self",
        "",
        "    def __next__(self):",
        "        if self.n <= 0:",
        "            raise StopIteration",
        "        self.n -= 1",
        "        return self.n + 1"
      ].join("\n"))
    },

    /* ==================== Python · NumPy ==================== */

    "py-p45": {
      level: 2, featured: true, title: "NumPy 数组基础与向量化",
      body: "手写脚本：创建 NumPy 数组，用向量化运算替代 for 循环，对比性能。",
      hint: "arr * 2 一次完成所有元素乘 2，比 for 循环快几十倍。",
      solution: C("python", "numpy_basic.py", [
        "import numpy as np",
        "arr = np.arange(10**6)",
        "# 循环版（慢）",
        "result = [x * 2 for x in arr]   # ~100ms",
        "# 向量化版（快）",
        "result = arr * 2                # ~1ms，快 100 倍",
        "# 广播：标量自动作用到每个元素",
        "arr = np.array([[1, 2], [3, 4]])",
        "print(arr * 2)      # [[2,4],[6,8]]",
        "print(arr + 10)     # [[11,12],[13,14]]"
      ].join("\n"))
    },

    "py-p46": {
      level: 2, title: "NumPy 切片与视图",
      body: "手写脚本演示 NumPy 切片是视图（共享内存），对比 Python 列表切片是拷贝。",
      hint: "修改视图会影响原数组；要拷贝用 .copy()。",
      solution: C("python", "numpy_view.py", [
        "import numpy as np",
        "a = np.arange(10)",
        "view = a[2:5]       # 视图！",
        "view[0] = 999       # a[2] 也变成 999",
        "copy = a[2:5].copy()  # 真拷贝",
        "# 列表切片是拷贝：",
        "lst = [0,1,2,3,4]",
        "sub = lst[2:5]",
        "sub[0] = 999        # lst 不变"
      ].join("\n"))
    },

    "py-p47": {
      level: 2, title: "NumPy 广播机制",
      body: "手写脚本演示 NumPy 广播：一维数组加到二维数组的每一行。",
      hint: "(3,4) 形状 + (4,) 形状 → (4,) 自动扩展成 (3,4)。",
      solution: C("python", "broadcast.py", [
        "import numpy as np",
        "mat = np.ones((3, 4))",
        "row = np.array([10, 20, 30, 40])",
        "result = mat + row   # row 广播到每一行",
        "# [[11,21,31,41], [11,21,31,41], [11,21,31,41]]"
      ].join("\n"))
    },

    "py-p48": {
      level: 2, title: "NumPy 花式索引与布尔掩码",
      body: "手写脚本演示布尔掩码过滤和花式索引。",
      hint: "arr[arr > 5] 返回所有大于 5 的元素；arr[[0,2,4]] 取指定下标。",
      solution: C("python", "fancy_index.py", [
        "import numpy as np",
        "arr = np.array([3, 8, 1, 9, 4, 7])",
        "mask = arr > 5",
        "print(mask)          # [False, True, False, True, False, True]",
        "print(arr[mask])     # [8, 9, 7]",
        "print(arr[[0, 2, 4]]) # [3, 1, 4]  花式索引",
        "arr[arr > 5] = 0     # 掩码赋值"
      ].join("\n"))
    },

    "py-p49": {
      level: 2, title: "NumPy 堆叠与拆分",
      v: null,
      body: "手写脚本演示 vstack、hstack、vsplit、hsplit。",
      hint: "vstack 垂直堆叠（行方向），hstack 水平堆叠（列方向）。",
      solution: C("python", "stack_split.py", [
        "import numpy as np",
        "a = np.array([[1, 2], [3, 4]])",
        "b = np.array([[5, 6]])",
        "np.vstack([a, b])   # 垂直堆 [[1,2],[3,4],[5,6]]",
        "np.hstack([a, b.T]) # 水平堆 [[1,2,5],[3,4,6]]",
        "np.vsplit(np.arange(12).reshape(3,4), 3)  # 沿行拆3份",
        "np.hsplit(np.arange(12).reshape(3,4), 2)  # 沿列拆2份"
      ].join("\n"))
    },

    "py-p50": {
      level: 2, title: "NumPy 统计函数",
      body: "手写脚本用 NumPy 统计函数计算均值、方差、标准差、中位数、百分位数。",
      hint: "np.mean, np.var, np.std, np.median, np.percentile",
      solution: C("python", "numpy_stats.py", [
        "import numpy as np",
        "arr = np.random.rand(1000)",
        "print(arr.mean())     # 均值",
        "print(arr.var())      # 方差",
        "print(arr.std())      # 标准差 standard deviation",
        "print(np.median(arr)) # 中位数",
        "print(np.percentile(arr, 75))  # 75百分位数"
      ].join("\n"))
    },

    /* ==================== Python · 文件与异常 ==================== */

    "py-p51": {
      level: 1, title: "文件读写：with open",
      body: "手写脚本用 with open 读写文本文件，逐行处理。",
      hint: "with open(path, 'r', encoding='utf-8') as f: 自动关闭。",
      solution: C("python", "file_io.py", [
        "# 写",
        "with open(\"data.txt\", \"w\", encoding=\"utf-8\") as f:",
        "    f.write(\"hello\\n\")",
        "    f.write(\"world\\n\")",
        "# 读",
        "with open(\"data.txt\", \"r\", encoding=\"cutf\") as f:",
        "    for line in f:",
        "        print(line.strip())"
      ].join("\n"))
    },

    "py-p51x": {
      level: 1, title: "文件读写修正版",
      body: "上面的 encoding 有个笔误。手写正确版本。",
      hint: "encoding=\"utf-8\"。",
      solution: C("python", "file_io_fixed.py", [
        "with open(\"data.txt\", \"r\", encoding=\"utf-8\") as f:",
        "    for line in f:",
        "        print(line.strip())"
      ].join("\n"))
    },

    /* ==================== Python · 综合实战 ==================== */

    "py-p52": {
      level: 3, featured: true, title: "手写 async 语义（生成器协程风格）",
      body: "手写用生成器模拟协程的调度器：run(tasks) 轮流调度多个生成器任务，用 yield 让出控制权。",
      hint: "while tasks: task = tasks.pop(0); try: next(task) except StopIteration: pass else: tasks.append(task)",
      solution: C("python", "gen_scheduler.py", [
        "def task(name, n):",
        "    for i in range(n):",
        "        print(f\"{name}: step {i}\")",
        "        yield    # 让出控制权",
        "",
        "def run(tasks):",
        "    tasks = list(tasks)",
        "    while tasks:",
        "        t = tasks.pop(0)",
        "        try:",
        "            next(t)",
        "        except StopIteration:",
        "            pass    # 任务完成",
        "        else:",
        "            tasks.append(t)   # 没完成，放回队尾",
        "",
        "run([task(\"A\", 3), task(\"B\", 2)])"
      ].join("\n"))
    },

    "py-p53": {
      level: 3, title: "手写 LRU 缓存装饰器",
      capacity: null,
      body: "手写带容量上限的 LRU 缓存装饰器 lru_cache(maxsize)，用 OrderedDict 实现。",
      hint: "OrderedDict 的 move_to_end + popitem(last=False) 实现淘汰最久未使用。",
      solution: C("python", "lru_cache.py", [
        "from collections import OrderedDict",
        "import functools",
        "",
        "def lru_cache(maxsize=128):",
        "    def decorator(func):",
        "        cache = OrderedDict()",
        "        @functools.wraps(func)",
        "        def wrapper(*args):",
        "            if args in cache:",
        "                cache.move_to_end(args)   # 移到最新",
        "                return cache[args]",
        "            result = func(*args)",
        "            if len(cache) >= maxsize:",
        "                cache.popitem(last=False) # 淘汰最旧",
        "            cache[args] = result",
        "            return result",
        "        return wrapper",
        "    return decorator"
      ].join("\n"))
    },

    "py-p54": {
      level: 3, title: "手写简易 ORM（dataclass + dict 映射）",
      body: "用 dataclass 定义 Student，手写 to_dict() 和 from_dict() 方法。",
      hint: "dataclasses.asdict(obj) 一行搞定序列化。",
      solution: C("python", "mini_orm.py", [
        "from dataclasses import dataclass, asdict",
        "",
        "@dataclass",
        "class Student:",
        "    name: str",
        "    age: int",
        "    score: float = 0.0",
        "",
        "    def to_dict(self):",
        "        return asdict(self)",
        "",
        "    @classmethod",
        "    def from_dict(cls, d):",
        "        return cls(**d)"
      ].join("\n"))
    },

    "py-p55": {
      level: 3, title: "手写简易命令行工具（argparse）",
      body: "手写一个 argparse 呁令行工具：--input 输入路径，--output 输出路径，--verbose 开关。",
      hint: "argparse.ArgumentParser + add_argument + parse_args()。",
      solution: C("python", "argparse_demo.py", [
        "import argparse",
        "",
        "parser = argparse.ArgumentParser(description=\"RM 数据处理工具\")",
        "parser.add_argument(\"--input\", \"-i\", required=True, help=\"输入文件\")",
        "parser.add_argument(\"--output\", \"-o\", default=\"out.txt\", help=\"输出文件\")",
        "parser.add_argument(\"--verbose\", \"-v\", action=\"store_true\", help=\"详细输出\")",
        "args = parser.parse_args()",
        "",
        "if args.verbose:",
        "    print(f\"处理 {args.input} -> {args.output}\")"
      ].join("\n"))
    },

    "py-p56": {
      level: 3, title: "JSON 序列化与反序列化",
      body: "手写脚本读写 JSON 文件，处理嵌套结构和自定义对象。",
      hint: "json.dumps/loads；自定义对象用 default=lambda o: o.__dict__。",
      solution: C("python", "json_io.py", [
        "import json",
        "",
        "# 写 JSON",
        "data = {\"name\": \"RM\", \"params\": {\"kp\": 1.5, \"ki\": 0.1}}",
        "with open(\"config.json\", \"w\", encoding=\"utf-8\") as f:",
        "    json.dump(data, f, ensure_ascii=False, indent=2)",
        "",
        "# 读 JSON",
        "with open(\"config.json\", \"r\", encoding=\"utf-8\") as f:",
        "    loaded = json.load(f)"
      ].join("\n"))
    },

    "py-p57": {
      level: 3, title: "logging 日志模块",
      body: "手写 logging 配置：控制台 + 文件双输出，格式含时间、级别、模块、消息。",
      hint: "logging.basicConfig + FileHandler + Formatter。",
      solution: C("python", "logging_demo.py", [
        "import logging",
        "",
        "logging.basicConfig(",
        "    level=logging.INFO,",
        "    format=\"%(asctime)s [%(levelname)s] %(name)s: %(message)s\",",
        "    handlers=[",
        "        logging.StreamHandler(),",
        "        logging.FileHandler(\"app.log\", encoding=\"utf-8\"),",
        "    ],",
        ")",
        "log = logging.getLogger(\"rm.vision\")",
        "log.info(\"视觉节点启动\")",
        "log.warning(\"目标丢失\")"
      ].join("\n"))
    },

    "py-p58": {
      level: 3, title: "多进程 vs 多线程选择",
      body: "解释 Python 多线程受 GIL 限制，什么时候用多线程、什么时候用多进程。",
      hint: "IO 密集 → 多线程；CPU 密集 → 多进程（multiprocessing）。NumPy 底层不受 GIL 限制。",
      solution: C("python", "gil.py", [
        "# GIL：全局解释器锁，同一时刻只有一个线程执行 Python 字节码",
        "# IO 密集（网络、文件）：用 threading，IO 等待时会释放 GIL",
        "# CPU 密集（纯计算）：用 multiprocessing，绕开 GIL",
        "# NumPy/OpenCV 内部 C++ 计算会释放 GIL，多线程依然有效",
        "import threading",
        "import multiprocessing"
      ].join("\n"))
    },

    "py-p59": {
      level: 3, title: "手写 __slots__ 优化内存",
      body: "用 __slots__ 定义类，对比有无 __slots__ 的内存占用差异。",
      hint: "__slots__ 固定属性列表，每个实例省几十字节，百万级实例省很多。",
      solution: C("python", "slots.py", [
        "class WithSlots:",
        "    __slots__ = (\"x\", \"y\")   # 不建 __dict__",
        "",
        "class WithoutSlots:",
        "    pass",
        "",
        "# 100万个点：",
        "# WithoutSlots: ~56MB；WithSlots: ~16MB"
      ].join("\n"))
    },

    "py-p60": {
      level: 3, title: "元类简介",
      body: "解释元类是什么。手写一个元类，给所有属性名自动加前缀 rm_。",
      hint: "class M(type): def __new__(mcs, name, bases, ns): ... return super().__new__(mcs, name, bases, ns)",
      solution: C("python", "metaclass.py", [
        "class PrefixMeta(type):",
        "    def __new__(mcs, name, bases, namespace):",
        "        new_ns = {}",
        "        for key, val in namespace.items():",
        "            if not key.startswith(\"__\"):",
        "                new_ns[\"rm_\" + key] = val",
        "            else:",
        "                new_ns[key] = val",
        "        return super().__new__(mcs, name, bases, new_ns)",
        "",
        "class Config(metaclass=PrefixMeta):",
        "    kp = 1.5",
        "# Config.rm_kp 可访问，Config.kp 不存在"
      ].join("\n"))
    },

    "py-p61": {
      level: 3, featured: true, title: "手写简易插件系统",
      "py-p61x": null,
      body: "手写一个插件系统：核心程序扫描 plugins 目录，动态导入所有 .py 文件，找有 register() 函数的模块自动注册。",
      hint: "importlib.import_module + getattr + callable 检查。",
      solution: C("python", "plugin_loader.py", [
        "import importlib",
        "import pkgutil",
        "",
        "def load_plugins(package):",
        "    registry = {}",
        "    for finder, name, ispkg in pkgutil.iter_modules(package.__path__):",
        "        module = importlib.import_module(f\"{package.__name__}.{name}\")",
        "        if hasattr(module, \"register\"):",
        "            registry[name] = module.register",
        "    return registry"
      ].join("\n"))
    },

    "py-p62": {
      level: 3, title: "异常处理：自定义异常体系",
      body: "手写自定义异常体系：RMError 基类，派生 VisionError、ControlError，再派生具体异常。",
      hint: "继承 Exception，用 super().__init__(msg) 传递消息。",
      solution: C("python", "custom_exception.py", [
        "class RMError(Exception):",
        "    \"\"\"RM 项目异常基类\"\"\"",
        "",
        "class VisionError(RMError):",
        "    pass",
        "",
        "class ArmorNotFoundError(VisionError):",
        "    pass",
        "",
        "try:",
        "    raise ArmorNotFoundError(\"没有检测到装甲板\")",
        "except VisionError as e:      # 父类可以捕获子类异常",
        "    print(f\"视觉模块异常: {e}\")"
      ].join("\n"))
    },

    "py-p63": {
      level: 3, title: "类型注解与 mypy 风格",
      body: "手写带类型注解的函数，list[int]、Optional、Union、Callable。解释注解不强制但有用。",
      hint: "from typing import Optional, Union, Callable；list[int] 是 3.9+ 写法。",
      sol: null,
      solution: C("python", "typing.py", [
        "from typing import Optional, Union, Callable",
        "",
        "def process(data: list[int],           # 整数列表",
        "            factor: float = 1.0,       # 浮点因子",
        "            callback: Optional[Callable[[int], None]] = None,",
        "            ) -> Optional[float]:",
        "    \"\"\"返回加权均值，列表为空返回 None\"\"\"",
        "    if not data:",
        "        return None",
        "    result = sum(x * factor for x in data) / len(data)",
        "    if callback:",
        "        for x in data:",
        "            callback(x)",
        "    return result"
      ].join("\n"))
    },

    "py-p64": {
      level: 3, title: "match 语句（Python 3.10+）",
      body: "用 match/case 重写 if-elif 链，结构化匹配命令字和参数。",
      hint: "case [\"go\", direction, speed] 可以解构列表。",
      solution: C("python", "match.py", [
        "def handle_command(cmd):",
        "    match cmd:",
        "        case [\"go\", direction, speed]:",
        "            print(f\"向 {direction} 移动，速度 {speed}\")",
        "        case [\"stop\"]:",
        "            print(\"停止\")",
        "        case [\"set\", key, value]:",
        "            print(f\"设置 {key}={value}\")",
        "        case _:",
        "            print(\"未知命令\")"
      ].join("\n"))
    },

    "py-p65": {
      level: 3, featured: true, title: "手写带权重随机采样器",
      body: "手写函数 weighted_choice(items, weights) 按权重随机采样。例：敌人在四个方向出现的概率不同。",
      hint: "累积权重 + random.uniform(0, total) + bisect 定位。",
      solution: C("python", "weighted_choice.py", [
        "import random",
        "import bisect",
        "",
        "def weighted_choice(items, weights):",
        "    cumulative = []",
        "    total = 0",
        "    for w in weights:",
        "        total += w",
        "        cumulative.append(total)",
        "    r = random.uniform(0, total)",
        "    idx = bisect.bisect_right(cumulative, r)",
        "    return items[min(idx, len(items) - 1)]",
        "",
        "directions = [\"N\", \"E\", \"S\", \"W\"]",
        "weights = [0.4, 0.3, 0.2, 0.1]",
        "# weighted_choice(directions, weights) 大概率返回 \"N\""
      ].join("\n"))
    }

  });
})();
