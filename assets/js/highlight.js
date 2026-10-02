/* ============================================================
   极简多语言语法高亮器（零依赖）
   支持：c / cpp / python / pseudo / cmake / bash / xml / ini
   策略：先转义 HTML → 逐语言正则打 token → 一次性拼接
   ============================================================ */
(function (global) {
  "use strict";

  var KW = {
    c: "auto break case char const continue default do double else enum extern float for goto if inline int long register restrict return short signed sizeof static struct switch typedef union unsigned void volatile while _Bool _Complex _Atomic",
    cpp: "alignas alignof and asm auto break case catch char class concept const consteval constexpr constinit const_cast continue co_await co_return co_yield decltype default delete do double dynamic_cast else enum explicit export extern false final float for friend goto if inline int long mutable namespace new noexcept not nullptr operator or override private protected public register reinterpret_cast requires return short signed sizeof static static_assert static_cast struct switch template this thread_local throw true try typedef typeid typename union unsigned using virtual void volatile wchar_t while",
    python: "and as assert async await break class continue def del elif else except False finally for from global if import in is lambda None nonlocal not or pass raise return True try while with yield match case",
    pseudo: "if else then end for while return break continue function class and or not in true false null",
    cmake: "if else elseif endif foreach endforeach function endfunction macro endmacro return break continue and or not TRUE FALSE ON OFF",
    bash: "if then else elif fi for while do done case esac function return export local source echo cd alias",
  };

  var TYPE_HINT = {
    c: "size_t uint8_t uint16_t uint32_t uint64_t int8_t int16_t int32_t int64_t FILE bool",
    cpp: "size_t uint8_t uint16_t uint32_t uint64_t int8_t int16_t int32_t int64_t std string vector map set array list unordered_map pair optional variant auto",
    python: "int float str list dict set tuple bool bytes object self cls print len range enumerate zip type super",
  };

  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function escRe(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function wordRe(words) {
    return new RegExp("\\b(?:" + words.trim().split(/\s+/).map(escRe).join("|") + ")\\b", "g");
  }

  /**
   * 核心思路：用单一大正则按顺序匹配「注释 | 字符串 | 预处理 | 数字 | 其它」，
   * 再对「其它」逐段做关键字/类型/函数名细分，避免正则交叉污染。
   */
  function highlight(code, lang) {
    lang = (lang || "c").toLowerCase();
    if (lang === "c++") lang = "cpp";
    if (lang === "py") lang = "python";
    if (lang === "sh" || lang === "shell" || lang === "console") lang = "bash";
    if (lang === "xml" || lang === "html") return hlXml(code);
    if (lang === "ini" || lang === "toml") return hlIni(code);
    if (lang === "text" || lang === "plain") return esc(code);

    var isPy = lang === "python";
    var isCmake = lang === "cmake";
    var isBash = lang === "bash";
    var cLike = !isPy && !isCmake && !isBash;
    var hashComment = isPy || isBash;

    // 1) 注释 + 字符串 + 预处理 大正则（c 系）
    var parts = [];
    var big;
    if (cLike) {
      big = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')|(^[ \t]*#[^\n]*)/gm;
    } else if (isCmake) {
      big = /(#[^\n]*)|("(?:\\.|[^"\\\n])*")|\b(\$\{[^}]*\})/gm;
    } else {
      big = /(#[^\n]*)|("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')|(\b[rfbu]?"(?:\\.|[^"\\\n])*"|\b[rfbu]?'(?:\\.|[^'\\\n])*')/gm;
    }

    var last = 0, m;
    while ((m = big.exec(code)) !== null) {
      if (m.index > last) parts.push(hlPlain(code.slice(last, m.index), lang));
      var tok = m[0];
      if (m[1] !== undefined) parts.push('<span class="tk-com">' + esc(tok) + "</span>");
      else if (m[2] !== undefined) parts.push('<span class="tk-str">' + esc(tok) + "</span>");
      else if (cLike) parts.push('<span class="tk-pre">' + esc(tok) + "</span>");
      else parts.push('<span class="tk-str">' + esc(tok) + "</span>");
      last = m.index + tok.length;
    }
    if (last < code.length) parts.push(hlPlain(code.slice(last), lang));
    return parts.join("");
  }

  function hlPlain(seg, lang) {
    var out = [];
    // 数字 / 关键字 / 类型 / 函数调用 / 操作符
    var re = /(\b0[xX][0-9a-fA-F]+[uUlL]*\b|\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?[fFuUlL]*\b)|([A-Za-z_][A-Za-z0-9_]*)|(\s+)|([^\sA-Za-z0-9_]+)/g;
    var kwRe = KW[lang] ? wordRe(KW[lang]) : null;
    var tyRe = TYPE_HINT[lang] ? wordRe(TYPE_HINT[lang]) : null;
    var m;
    while ((m = re.exec(seg)) !== null) {
      if (m[1] !== undefined) { out.push('<span class="tk-num">' + esc(m[1]) + "</span>"); continue; }
      if (m[3] !== undefined) { out.push(m[3]); continue; }
      if (m[4] !== undefined) { out.push('<span class="tk-op">' + esc(m[4]) + "</span>"); continue; }
      var w = m[2];
      // 看下一个非空字符是不是 ( → 函数名
      var rest = seg.slice(re.lastIndex);
      var nextCh = (rest.match(/^\s*(\()/) || [])[1];
      if (kwRe && kwRe.test(w)) {
        kwRe.lastIndex = 0;
        out.push('<span class="tk-kw">' + esc(w) + "</span>");
      } else if (tyRe && tyRe.test(w)) {
        tyRe.lastIndex = 0;
        out.push('<span class="tk-type">' + esc(w) + "</span>");
      } else if (nextCh) {
        out.push('<span class="tk-fn">' + esc(w) + "</span>");
      } else {
        out.push(esc(w));
      }
    }
    return out.join("");
  }

  function hlXml(code) {
    var out = [], re = /(<!--[\s\S]*?-->)|(<\/?)([A-Za-z_][\w.:-]*)((?:[^>"']|"[^"]*"|'[^']*')*?)(\/?>)/g, m;
    var last = 0;
    while ((m = re.exec(code)) !== null) {
      if (m.index > last) out.push(esc(code.slice(last, m.index)));
      if (m[1]) { out.push('<span class="tk-com">' + esc(m[1]) + "</span>"); }
      else {
        out.push('<span class="tk-op">' + esc(m[2]) + '</span><span class="tk-fn">' + esc(m[3]) + "</span>");
        var attrs = m[4].replace(/("[^"]*"|'[^']*')/g, '<span class="tk-str">$1</span>');
        var attrNames = attrs.replace(/([A-Za-z_:][\w.:-]*)(=)/g, '<span class="tk-type">$1</span><span class="tk-op">$2</span>');
        out.push(attrNames);
        out.push('<span class="tk-op">' + esc(m[5]) + "</span>");
      }
      last = m.index + m[0].length;
    }
    if (last < code.length) out.push(esc(code.slice(last)));
    return out.join("");
  }

  function hlIni(code) {
    return esc(code)
      .replace(/(;[^\n]*)/g, '<span class="tk-com">$1</span>')
      .replace(/^(\[[^\]]+\])$/gm, '<span class="tk-fn">$1</span>')
      .replace(/^([A-Za-z_][\w.]*)\s*=/gm, '<span class="tk-type">$1</span>=');
  }

  global.RMHL = { highlight: highlight, esc: esc };
})(window);
