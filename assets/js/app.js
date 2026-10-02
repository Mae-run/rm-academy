/* ============================================================
   RM 兵工厂 · 站点引擎
   渲染课程数据 / 进度追踪 / 测验交互 / 练习打卡 / 主题切换
   数据由各课程页面通过 window.PAGE 注入
   ============================================================ */
(function (global) {
  "use strict";

  /* ---------- 内容构建 DSL（课程页脚本用） ---------- */
  function H() { return Array.prototype.join.call(arguments, ""); }

  H.sub = function (t) { return '<h3 class="sub">' + t + "</h3>"; };
  H.p = function (html) { return "<p>" + html + "</p>"; };
  H.dim = function (html) { return '<p class="dim">' + html + "</p>"; };
  H.ul = function (items) { return '<ul class="list">' + items.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</ul>"; };
  H.ol = function (items) { return '<ol class="list">' + items.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</ol>"; };

  H.code = function (lang, title, code) {
    return '<div class="codeblock" data-lang="' + lang + '">' +
      '<div class="code-head"><span class="code-title">' + title + '</span>' +
      '<button class="copy-btn" type="button">复制</button></div>' +
      '<pre><code>' + RMHL.esc(code.replace(/^\n+|\n+$/g, "")) + "</code></pre></div>";
  };

  H.note = function (type, title, html) {
    return '<div class="note ' + type + '"><div class="note-title">' + title + "</div>" + html + "</div>";
  };

  H.table = function (caption, headers, rows) {
    var thead = headers.map(function (h) { return "<th>" + h + "</th>"; }).join("");
    var tbody = rows.map(function (r) {
      return "<tr>" + r.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>";
    }).join("");
    return '<div class="tbl-wrap"><table class="tbl"><caption>' + caption + "</caption>" +
      "<thead><tr>" + thead + "</tr></thead><tbody>" + tbody + "</tbody></table></div>";
  };

  /**
   * quiz: { q, tag, opts: [..], ans: index, explain }
   */
  H.quiz = function (cfg) {
    H._quizSeq = (H._quizSeq || 0) + 1;
    cfg.qid = cfg.qid || ("q" + H._quizSeq);
    var opts = cfg.opts.map(function (o, i) {
      return '<div class="opt" data-i="' + i + '"><span class="mark">✓</span><span>' + o + "</span></div>";
    }).join("");
    return '<div class="quiz" data-ans="' + cfg.ans + '" data-qid="' + cfg.qid + '">' +
      '<div class="quiz-q"><span class="quiz-tag">' + (cfg.tag || "随堂测") + '</span>' + cfg.q + "</div>" +
      '<div class="opts">' + opts + "</div>" +
      '<div class="explain"><b>解析：</b>' + cfg.explain + "</div></div>";
  };

  /**
   * practice: { id, level(1-3), title, body, hint, solutionCode:[{lang,title,code}] | html }
   */
  H.prac = function (cfg) {
    var sol = "";
    if (cfg.solution) {
      sol = '<div class="sol-label">参考答案（先自己写完再看！）</div>' + cfg.solution;
    }
    return '<div class="practice" data-pid="' + cfg.id + '">' +
      '<div class="p-head">' +
      '<span class="p-tag lv' + cfg.level + '">' + (cfg.level === 1 ? "入门" : cfg.level === 2 ? "进阶" : "实战") + "</span>" +
      '<span class="p-title">' + cfg.title + "</span>" +
      '<span class="p-status"></span>' +
      "</div>" +
      '<div class="p-body">' + cfg.body +
      (cfg.hint ? '<div class="note tip" style="margin-bottom:0"><div class="note-title">提示</div>' + cfg.hint + "</div>" : "") +
      "</div>" +
      '<div class="p-actions">' +
      '<button class="btn primary" data-act="solve" type="button">📝 我写完了，看参考</button>' +
      '<button class="btn ghost-green" data-act="done" type="button">✅ 标记已练会</button>' +
      '<button class="btn" data-act="wrong" type="button">📕 加入错题本</button>' +
      "</div>" +
      '<div class="solution">' + sol + "</div>" +
      "</div>";
  };

  /* 从全局题库 PRACTICE_DB 引用一道题（单一数据源，练习中心共用） */
  H.pracRef = function (id) {
    var db = global.PRACTICE_DB || {};
    var cfg = db[id];
    if (!cfg) return "";
    cfg.id = id;
    return H.prac(cfg);
  };

  global.H = H;

  /* ---------- 存储 ---------- */
  var LS_PROGRESS = "rm-academy:progress";
  var LS_PRACTICE = "rm-academy:practice";
  var LS_THEME = "rm-academy:theme";
  var LS_WRONG = "rm-academy:wrong";
  var LS_QUIZ = "rm-academy:quiz";

  function lsGet(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; }
    catch (e) { return fallback; }
  }
  function lsSet(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }
  function getProgress() { return lsGet(LS_PROGRESS, {}); }
  function getPractice() { return lsGet(LS_PRACTICE, {}); }

  global.RMStore = {
    progress: getProgress,
    practice: getPractice,
    toggleChapter: function (id) {
      var p = getProgress(); p[id] = !p[id]; lsSet(LS_PROGRESS, p); return p[id];
    },
    isChapterDone: function (id) { return !!getProgress()[id]; },
    markPractice: function (id, done) {
      var p = getPractice();
      if (done) p[id] = new Date().toDateString();
      else delete p[id];
      lsSet(LS_PRACTICE, p);
    },
    isPracticeDone: function (id) { return !!getPractice()[id]; },
    wrong: function () { return lsGet(LS_WRONG, {}); },
    addWrong: function (id, rec) {
      var w = lsGet(LS_WRONG, {});
      rec.date = new Date().toDateString();
      rec.mastered = false;
      w[id] = rec;
      lsSet(LS_WRONG, w);
    },
    removeWrong: function (id) {
      var w = lsGet(LS_WRONG, {});
      delete w[id];
      lsSet(LS_WRONG, w);
    },
    masterWrong: function (id, on) {
      var w = lsGet(LS_WRONG, {});
      if (w[id]) { w[id].mastered = on === undefined ? true : on; lsSet(LS_WRONG, w); }
    },
    isWrong: function (id) { return !!lsGet(LS_WRONG, {})[id]; },
    wrongCount: function () {
      var w = lsGet(LS_WRONG, {}), c = 0;
      for (var k in w) if (!w[k].mastered) c++;
      return c;
    },
    quiz: function () { return lsGet(LS_QUIZ, {}); },
    recordQuiz: function (id, right) {
      var q = lsGet(LS_QUIZ, {});
      q[id] = { right: !!right, date: new Date().toDateString() };
      lsSet(LS_QUIZ, q);
    },
    quizStats: function () {
      var q = lsGet(LS_QUIZ, {});
      var total = 0, right = 0;
      for (var k in q) { total++; if (q[k].right) right++; }
      return { total: total, right: right, pct: total ? Math.round(right / total * 100) : 0 };
    },
    practiceDays: function () {
      var pr = getPractice(), days = {};
      for (var k in pr) days[pr[k]] = true;
      return days;
    },
    streak: function () {
      var days = this.practiceDays();
      var today = new Date(); today.setHours(0,0,0,0);
      var start = new Date(today);
      if (!days[today.toDateString()]) start.setDate(start.getDate() - 1);
      var n = 0, d = new Date(start);
      while (days[d.toDateString()]) { n++; d.setDate(d.getDate() - 1); }
      return n;
    },
    exportAll: function () {
      return JSON.stringify({
        app: "rm-academy", version: 1, exportedAt: new Date().toISOString(),
        progress: getProgress(), practice: getPractice(),
        wrong: lsGet(LS_WRONG, {}), quiz: lsGet(LS_QUIZ, {}),
        theme: lsGet(LS_THEME, "dark")
      }, null, 2);
    },
    importAll: function (json) {
      var d = JSON.parse(json);
      if (!d || d.app !== "rm-academy") throw new Error("不是 RM 兵工厂的备份文件");
      if (d.progress) lsSet(LS_PROGRESS, d.progress);
      if (d.practice) lsSet(LS_PRACTICE, d.practice);
      if (d.wrong) lsSet(LS_WRONG, d.wrong);
      if (d.quiz) lsSet(LS_QUIZ, d.quiz);
      return true;
    },
    stats: function () {
      var p = getProgress(), pr = getPractice();
      var chTotal = 0, chDone = 0, pTotal = 0, pDone = 0;
      if (global.SITE_INDEX) {
        global.SITE_INDEX.chapters.forEach(function (id) { chTotal++; if (p[id]) chDone++; });
        global.SITE_INDEX.practices.forEach(function (id) { pTotal++; if (pr[id]) pDone++; });
      }
      return { chTotal: chTotal, chDone: chDone, pTotal: pTotal, pDone: pDone };
    }
  };

  /* ---------- 主题 ---------- */
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    lsSet(LS_THEME, t);
    var btn = document.querySelector(".theme-btn");
    if (btn) btn.textContent = t === "light" ? "🌙" : "☀️";
  }
  var savedTheme = "dark";
  try { savedTheme = JSON.parse(localStorage.getItem(LS_THEME)) || "dark"; } catch (e) {}
  document.documentElement.setAttribute("data-theme", savedTheme);

  /* ---------- 顶栏 ---------- */
  var NAV = [
    { href: "index.html", id: "home", label: "首页·路线" },
    { href: "c.html", id: "c", label: "C 语言" },
    { href: "cpp.html", id: "cpp", label: "C++" },
    { href: "python.html", id: "python", label: "Python" },
    { href: "linux.html", id: "linux", label: "Linux" },
    { href: "ros2.html", id: "ros2", label: "ROS 2" },
    { href: "rm-embedded.html", id: "rme", label: "RM 电控" },
    { href: "rm-control.html", id: "cva", label: "控制进阶" },
    { href: "rm-vision.html", id: "rmv", label: "RM 视觉" },
    { href: "rm-opencv.html", id: "cvp", label: "OpenCV" },
    { href: "rm-dl.html", id: "dlv", label: "YOLO" },
    { href: "oss.html", id: "oss", label: "开源项目" },
    { href: "practice.html", id: "practice", label: "练习中心" },
    { href: "help.html", id: "help", label: "说明书" },
  ];

  function buildTopbar(pageId) {
    var links = NAV.map(function (n) {
      return '<a href="' + n.href + '"' + (n.id === pageId ? ' class="active"' : "") + ">" + n.label + "</a>";
    }).join("");
    var el = document.createElement("header");
    el.className = "topbar";
    el.innerHTML =
      '<div class="logo"><span class="logo-icon">🦐</span>RM 兵工厂</div>' +
      "<nav>" + links + "</nav>" +
      '<div class="spacer"></div>' +
      '<button class="top-btn" id="btn-wrongbook" type="button" title="\u9519\u9898\u672c">\u{1F4D5} \u9519\u9898 <span class="cnt zero" id="wrong-badge">0</span></button>' +
      '<button class="top-btn" id="btn-backup" type="button" title="\u6570\u636E\u5907\u4EFD\u4E0E\u6062\u590D">\u{1F4BE} \u6570\u636E</button>' +
      '<button class="theme-btn" type="button" title="切换昼夜主题">' + (savedTheme === "light" ? "🌙" : "☀️") + "</button>";
    document.body.prepend(el);
    el.querySelector(".theme-btn").addEventListener("click", function () {
      applyTheme(document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light");
    });
  }

  /* ---------- 课程页渲染 ---------- */
  function renderCourse() {
    var page = global.PAGE;
    if (!page) return;
    var layout = document.querySelector(".layout");
    var content = document.querySelector(".content");

    // 侧栏
    var side = document.createElement("aside");
    side.className = "sidebar";
    var sideHtml = "";
    page.stages.forEach(function (st) {
      sideHtml += '<div class="toc-level-title">' + st.title + "</div>";
      st.chapters.forEach(function (ch) {
        sideHtml += '<a class="toc-chapter" href="#' + ch.id + '" data-ch="' + ch.id + '">' +
          '<span class="chk">✓</span><span class="ch-title">' + ch.title + "</span></a>";
      });
    });
    side.innerHTML = sideHtml;
    layout.prepend(side);

    // 内容
    var html = "";
    html += '<button class="toc-toggle" type="button">☰ 目录</button>';
    html += '<div class="course-head">' +
      '<div class="crumb">RM 兵工厂 / ' + (page.crumb || page.title) + "</div>" +
      "<h1>" + page.title + ' <span class="lang-badge">' + page.badge + "</span></h1>" +
      '<div class="lead">' + page.lead + "</div>" +
      '<div class="progress-wrap"><div class="progress-bar"><div style="width:0%"></div></div>' +
      '<div class="progress-label"><span class="pl-l"></span><span class="pl-r"></span></div></div>' +
      "</div>";

    page.stages.forEach(function (st, si) {
      html += '<section class="stage-anchor" id="' + st.id + '"><div class="stage-title">' + st.title + "</div>";
      st.chapters.forEach(function (ch) {
        html += '<article class="chapter" id="' + ch.id + '">' +
          '<div class="chapter-head"><button class="chk-big" type="button" title="学完打勾">✓</button><h2>' + ch.title + "</h2></div>";
        ch.blocks.forEach(function (b) { html += b; });
        html += "</article>";
      });
      html += "</section>";
    });

    html += '<div class="next-chapter">' +
      (page.prev ? '<a class="btn" href="' + page.prev.href + '">← ' + page.prev.label + "</a>" : "<span></span>") +
      (page.next ? '<a class="btn primary" href="' + page.next.href + '">' + page.next.label + " →</a>" : "<span></span>") +
      "</div>";

    html += '<footer class="site-footer">RM 兵工厂 · 学员训练站 —— 师父退休前的最后一课。代码要自己敲，题要自己写，别偷懒。</footer>';

    

    content.innerHTML = html;

    document.querySelector(".toc-toggle").addEventListener("click", function () {
      layout.classList.toggle("toc-open");
    });

    refreshProgress();
    wireChapterChecks();
  }

  function refreshProgress() {
    var page = global.PAGE;
    if (!page) return;
    var total = 0, done = 0;
    page.stages.forEach(function (st) {
      st.chapters.forEach(function (ch) {
        total++;
        var ok = RMStore.isChapterDone(ch.id);
        if (ok) done++;
        var side = document.querySelector('.toc-chapter[data-ch="' + ch.id + '"]');
        if (side) side.classList.toggle("done", ok);
        var art = document.getElementById(ch.id);
        if (art) art.classList.toggle("done", ok);
      });
    });
    var pct = total ? Math.round((done / total) * 100) : 0;
    var bar = document.querySelector(".progress-bar > div");
    if (bar) bar.style.width = pct + "%";
    var l = document.querySelector(".pl-l");
    if (l) l.textContent = "本课进度：" + done + " / " + total + " 章";
    var r = document.querySelector(".pl-r");
    if (r) r.textContent = pct + "%";
  }

  function wireChapterChecks() {
    document.addEventListener("click", function (ev) {
      var btn = ev.target.closest(".chk-big");
      if (btn) {
        var art = btn.closest(".chapter");
        if (art) {
          RMStore.toggleChapter(art.id);
          refreshProgress();
          if (global.refreshGlobalStats) global.refreshGlobalStats();
        }
        return;
      }
      // 侧栏点章节名只跳转；点勾号可切换
      var sideChk = ev.target.closest(".toc-chapter .chk");
      if (sideChk) {
        ev.preventDefault();
        var link = sideChk.closest(".toc-chapter");
        RMStore.toggleChapter(link.getAttribute("data-ch"));
        refreshProgress();
      }
    });
  }

  /* ---------- 测验 ---------- */
  document.addEventListener("click", function (ev) {
    var opt = ev.target.closest(".quiz .opt");
    if (!opt) return;
    var quiz = opt.closest(".quiz");
    if (quiz.classList.contains("answered")) return;
    quiz.classList.add("answered");
    var ans = parseInt(quiz.getAttribute("data-ans"), 10);
    var i = parseInt(opt.getAttribute("data-i"), 10);
    var opts = quiz.querySelectorAll(".opt");
    opts.forEach(function (o) { o.classList.add("locked"); });
    opts[ans].classList.add("correct");
    if (i !== ans) opt.classList.add("wrong");
    quiz.querySelector(".explain").classList.add("show");
    var qid = quiz.getAttribute("data-qid");
    var right = (i === ans);
    if (qid) RMStore.recordQuiz(qid, right);
    if (global.refreshQuizPanel) global.refreshQuizPanel();
    if (!right && qid) {
      var qText = quiz.querySelector(".quiz-q").textContent.replace(/^\u968f\u5802\u6d4b/, "").trim();
      var optsText = [];
      quiz.querySelectorAll(".opt span:last-child").forEach(function (sp) { optsText.push(sp.textContent); });
      RMStore.addWrong(qid, {
        kind: "quiz", q: qText, opts: optsText, mine: i, ans: ans,
        explain: quiz.querySelector(".explain").innerHTML.replace(/^<b>\u89e3\u6790\uff1a<\/b>/, ""),
        page: document.title
      });
      if (global.refreshWrongBadge) global.refreshWrongBadge();
    }
  });

  /* ---------- 练习打卡 ---------- */
  document.addEventListener("click", function (ev) {
    var btn = ev.target.closest(".practice .p-actions .btn");
    if (!btn) return;
    var prac = btn.closest(".practice");
    var pid = prac.getAttribute("data-pid");
    var act = btn.getAttribute("data-act");
    if (act === "solve") {
      prac.querySelector(".solution").classList.toggle("show");
      btn.textContent = prac.querySelector(".solution").classList.contains("show")
        ? "🙈 收起参考" : "📝 我写完了，看参考";
    } else if (act === "wrong") {
      // 手动收进错题本（练习没过关 / 看了解析发现思路不对）
      if (!RMStore.isWrong(pid)) {
        var ttl = prac.querySelector(".p-title");
        RMStore.addWrong(pid, {
          kind: "practice",
          q: (ttl ? ttl.textContent : pid) + "（手写题没过关，师父说这题得重写）",
          opts: [], mine: 0, ans: 0,
          explain: prac.querySelector(".p-body") ? prac.querySelector(".p-body").innerHTML.slice(0, 200) : "",
          page: document.title
        });
        btn.textContent = "✅ 已在错题本";
        refreshWrongBadge();
      }
    } else if (act === "done") {
      var now = !RMStore.isPracticeDone(pid);
      RMStore.markPractice(pid, now);
      refreshPracticeState(prac);
      if (global.refreshStreak) global.refreshStreak();
      if (global.refreshGlobalStats) global.refreshGlobalStats();
    }
  });

  function refreshPracticeState(pracEl) {
    var pid = pracEl.getAttribute("data-pid");
    var st = pracEl.querySelector(".p-status");
    var done = RMStore.isPracticeDone(pid);
    if (st) {
      st.textContent = done ? "✓ 已练会" : "";
      st.classList.toggle("done", done);
    }
    var btn = pracEl.querySelector('[data-act="done"]');
    if (btn) btn.textContent = done ? "↩ 取消练会标记" : "✅ 标记已练会";
    pracEl.classList.toggle("practiced", done);
  }

  global.refreshAllPractices = function () {
    document.querySelectorAll(".practice").forEach(refreshPracticeState);
  };

  /* ---------- 代码复制 ---------- */
  document.addEventListener("click", function (ev) {
    var btn = ev.target.closest(".copy-btn");
    if (!btn) return;
    var code = btn.closest(".codeblock").querySelector("code").innerText;
    function ok() { btn.textContent = "已复制✓"; setTimeout(function () { btn.textContent = "复制"; }, 1500); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(ok);
    } else {
      var ta = document.createElement("textarea");
      ta.value = code; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); ok(); } catch (e) {}
      document.body.removeChild(ta);
    }
  });

  /* ---------- 回到顶部 ---------- */
  function wireBackTop() {
    var btn = document.createElement("button");
    btn.className = "back-top"; btn.type = "button"; btn.textContent = "↑";
    document.body.appendChild(btn);
    window.addEventListener("scroll", function () {
      btn.classList.toggle("show", window.scrollY > 500);
    }, { passive: true });
    btn.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  }

  /* ---------- 启动 ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    var pageId = document.body.getAttribute("data-page") || "";
    /* ---------- 侧栏滚轮隔离 ---------- */
  // sidebar-wheel-fix: 滚轮在侧栏内滚动时不传给页面（防止侧栏滚到底后页面跟着滚）
  (function () {
    document.addEventListener("wheel", function (e) {
      var sb = e.target && e.target.closest ? e.target.closest(".sidebar") : null;
      if (sb) e.stopPropagation();
    }, { passive: true, capture: true });
  })();

  buildTopbar(pageId);
    renderCourse();
    if (global.PAGE_ONLOAD) global.PAGE_ONLOAD();
    global.refreshAllPractices();
    wireBackTop();


    // 语法高亮
    document.querySelectorAll(".codeblock").forEach(function (cb) {
      var code = cb.querySelector("code");
      var lang = cb.getAttribute("data-lang") || "c";
      code.innerHTML = RMHL.highlight(code.innerText, lang);
    });
  });
})(window);

/* ============================================================
   错题本 + 数据备份 抽屉（全站通用）
   ============================================================ */
function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

/* ---------- 通用抽屉骨架 ---------- */
function buildDrawer(id, title) {
  var mask = document.createElement("div");
  mask.className = "drawer-mask";
  mask.id = "mask-" + id;
  var dr = document.createElement("div");
  dr.className = "drawer";
  dr.id = "drawer-" + id;
  dr.innerHTML =
    '<div class="drawer-head"><h3>' + title + '</h3><button class="x" type="button">✕</button></div>' +
    '<div class="drawer-body"></div>';
  document.body.appendChild(mask);
  document.body.appendChild(dr);
  function close() {
    mask.classList.remove("show");
    dr.classList.remove("show");
  }
  mask.addEventListener("click", close);
  dr.querySelector(".x").addEventListener("click", close);
  return { root: dr, mask: mask, body: dr.querySelector(".drawer-body"), close: close };
}

function closeAllDrawers() {
  document.querySelectorAll(".drawer-mask").forEach(function (m) { m.classList.remove("show"); });
  document.querySelectorAll(".drawer").forEach(function (d) { d.classList.remove("show"); });
}
function openDrawer(d) {
  closeAllDrawers();
  d.root.classList.add("show");
  d.mask.classList.add("show");
}

/* ---------- 错题本 ---------- */
var wrongDrawer = null;
function renderWrongbook() {
  if (!wrongDrawer) wrongDrawer = buildDrawer("wrongbook", "📕 错题本");
  var w = RMStore.wrong();
  var keys = Object.keys(w).sort(function (a, b) { return (w[a].date < w[b].date) ? 1 : -1; });
  var html = "";
  if (!keys.length) {
    html = '<div class="wrong-empty"><div class="big">🎉</div><p>错题本是空的。</p><p class="dim" style="font-size:13px;">随堂测答错会自动收进来，练习没过关也可以手动加。这里就是你的第二本教材。</p></div>';
  } else {
    html += '<p class="dim" style="font-size:13px;margin-bottom:14px;">共 ' + keys.length + ' 道错题，' +
            RMStore.wrongCount() + ' 道未消灭。点「看解析」复习，搞懂了就点「已消灭」。</p>';
    keys.forEach(function (k) {
      var r = w[k];
      var cls = r.mastered ? "wrong-card mastered" : "wrong-card";
      html += '<div class="' + cls + '" data-wid="' + esc(k) + '">' +
        '<div class="wc-top"><div class="wc-q"><span class="wc-tag">' + (r.mastered ? "已消灭" : "待消灭") + '</span>' + esc(r.q) + '</div></div>' +
        '<div class="wc-meta"><span>出处：' + esc(r.page || "随堂测") + '</span><span>错于：' + esc(r.date) + '</span>' +
        (r.kind === "quiz" ? '<span>' + esc((r.opts && r.opts.length) || 0) + ' 个选项</span>' : "") + '</div>' +
        '<div class="wc-ans">' +
          (r.kind === "quiz"
            ? '<div>✅ 正确答案：<b class="right">' + esc(r.opts && r.opts[r.ans] || "?") + '</b></div>' +
              '<div>❌ 你选的：<span class="mine">' + esc(r.opts && r.opts[r.mine] || "?") + '</span></div>'
            : "") +
          '<div style="margin-top:6px">' + (r.explain || "") + '</div>' +
        '</div>' +
        '<div class="wc-acts">' +
          '<button class="btn" data-wact="peek" type="button">👀 看解析</button>' +
          '<button class="btn ghost-green" data-wact="master" type="button">' + (r.mastered ? "↩ 重新标记待消灭" : "✅ 已消灭") + '</button>' +
          '<button class="btn" data-wact="del" type="button">🗑 删除</button>' +
        '</div>' +
      '</div>';
    });
  }
  wrongDrawer.body.innerHTML = html;
}

function refreshWrongBadge() {
  var el = document.getElementById("wrong-badge");
  if (!el) return;
  var c = RMStore.wrongCount();
  el.textContent = c;
  el.classList.toggle("zero", c === 0);
}

document.addEventListener("click", function (ev) {
  var wb = ev.target.closest("#btn-wrongbook");
  if (wb) {
    renderWrongbook();
    openDrawer(wrongDrawer);
    return;
  }
  var bk = ev.target.closest("#btn-backup");
  if (bk) {
    renderBackup();
    openDrawer(backupDrawer);
    return;
  }
  var act = ev.target.closest(".wrong-card .wc-acts .btn");
  if (act) {
    var card = act.closest(".wrong-card");
    var wid = card.getAttribute("data-wid");
    var wact = act.getAttribute("data-wact");
    if (wact === "peek") {
      var ans = card.querySelector(".wc-ans");
      ans.classList.toggle("show");
    } else if (wact === "master") {
      var w = RMStore.wrong();
      RMStore.masterWrong(wid, !w[wid].mastered);
      renderWrongbook();
      refreshWrongBadge();
    } else if (wact === "del") {
      RMStore.removeWrong(wid);
      renderWrongbook();
      refreshWrongBadge();
    }
  }
});

/* ---------- 数据备份 ---------- */
var backupDrawer = null;
function renderBackup() {
  if (!backupDrawer) backupDrawer = buildDrawer("backup", "💾 数据备份与恢复");
  var st = RMStore.stats();
  var qs = RMStore.quizStats();
  var streak = RMStore.streak();
  var w = RMStore.wrong();
  backupDrawer.body.innerHTML =
    '<div class="backup-zone">' +
      '<p style="font-size:14.5px;"><b>当前学习档案</b></p>' +
      '<p style="font-size:13.5px;color:var(--text-dim);line-height:1.9;">' +
        '章节已学：<b>' + st.chDone + ' / ' + st.chTotal + '</b> 章<br>' +
        '练习已练会：<b>' + st.pDone + ' / ' + st.pTotal + '</b> 题<br>' +
        '随堂测正确率：<b>' + qs.pct + '%</b>（' + qs.right + '/' + qs.total + '）<br>' +
        '错题本：<b>' + Object.keys(w).length + '</b> 条（未消灭 ' + RMStore.wrongCount() + '）<br>' +
        '连续打卡：<b>' + streak + '</b> 天</p>' +
    '</div>' +
    '<div class="backup-zone">' +
      '<button class="btn primary" id="btn-export" type="button">📤 导出备份文件</button>' +
      '<button class="btn" id="btn-import" type="button">📥 从备份恢复</button>' +
      '<input type="file" id="file-import" accept=".json,application/json" style="display:none">' +
      '<p class="backup-note">导出会生成一个 .json 文件，包含全部进度/错题/测验记录。换电脑、重装系统前记得导出；恢复时选中之前的备份文件即可。<br>' +
      '网页版数据存在浏览器 localStorage 里，清缓存就没了——<b>养成定期导出的习惯</b>。</p>' +
    '</div>';

  backupDrawer.body.querySelector("#btn-export").addEventListener("click", function () {
    var data = RMStore.exportAll();
    var blob = new Blob([data], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "RM兵工厂-备份-" + new Date().toISOString().slice(0, 10) + ".json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
    this.textContent = "✅ 已导出";
    var btn = this;
    setTimeout(function () { btn.textContent = "📤 导出备份文件"; }, 2000);
  });

  backupDrawer.body.querySelector("#btn-import").addEventListener("click", function () {
    backupDrawer.body.querySelector("#file-import").click();
  });

  backupDrawer.body.querySelector("#file-import").addEventListener("change", function () {
    var f = this.files[0];
    if (!f) return;
    var reader = new FileReader();
    var btn = this;
    reader.onload = function () {
      try {
        RMStore.importAll(reader.result);
        alert("恢复成功！进度已从备份载入。");
        location.reload();
      } catch (e) {
        alert("恢复失败：" + e.message + "\n请确认选的是 RM 兵工厂导出的 .json 备份文件。");
      }
    };
    reader.readAsText(f);
  });
}

/* DOMContentLoaded 里刷新错题徽标 */
document.addEventListener("DOMContentLoaded", function () {
  refreshWrongBadge();
});

/* ---------- 页脚 GitHub 链接（全站统一，模块顶层） ---------- */
(function (global) {
  function addGh() {
    document.querySelectorAll(".site-footer").forEach(function (f) {
      if (f.querySelector(".footer-gh")) return;
      var a = document.createElement("a");
      a.className = "footer-gh";
      a.href = "https://github.com/Mae-run/rm-academy";
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = "⭐ GitHub · Mae-run/rm-academy —— 喜欢就给个 Star";
      f.appendChild(document.createElement("br"));
      f.appendChild(a);
    });
  }
  global.__rmAddGhFooter = addGh;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { setTimeout(addGh, 0); });
  } else {
    setTimeout(addGh, 0);
  }
  window.addEventListener("load", addGh);
})(window);
