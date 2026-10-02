/* ============================================================
   RM 兵工厂 · 手写练习中心引擎
   依赖：app.js（H DSL + RMStore）、15 个题库文件
   ============================================================ */
(function (global) {
  "use strict";

  var DB = global.PRACTICE_DB || {};
  var grid = document.getElementById("practiceGrid");
  var featSection = document.getElementById("featSection");
  var emptyState = document.getElementById("emptyState");

  var LANG_NAMES = {
    c: "C 语言", cpp: "C++", py: "Python",
    ros: "ROS 2", rme: "RM 电控", rmv: "RM 视觉", lx: "Linux",
    cvp: "OpenCV", dlv: "YOLO", cva: "控制进阶", ossv: "开源·视觉", osse: "开源·电控"
  };

  function langOf(id) {
    var m = id.match(/^([a-z]+)-/);
    return m ? m[1] : "c";
  }

  function langLabel(id) {
    return LANG_NAMES[langOf(id)] || id;
  }

  /* ---------- 过滤 ---------- */
  var filterLang = document.getElementById("filterLang");
  var filterLevel = document.getElementById("filterLevel");
  var filterFeat = document.getElementById("filterFeat");
  var searchBox = document.getElementById("searchBox");

  function currentFilters() {
    return {
      lang: filterLang.value,
      level: filterLevel.value,
      feat: filterFeat.value,
      q: searchBox.value.trim().toLowerCase()
    };
  }

  function matches(id, q, f) {
    if (f.lang !== "all" && langOf(id) !== f.lang) return false;
    if (f.level !== "all" && String(q.level) !== f.level) return false;
    if (f.feat === "feat" && !q.featured) return false;
    if (f.q) {
      var hay = (q.title + " " + q.body + " " + (q.hint || "")).toLowerCase();
      if (hay.indexOf(f.q) === -1) return false;
    }
    return true;
  }

  function filteredIds() {
    var f = currentFilters();
    var out = [];
    for (var id in DB) {
      if (Object.prototype.hasOwnProperty.call(DB, id) && matches(id, DB[id], f)) out.push(id);
    }
    return out;
  }

  /* ---------- 渲染 ---------- */
  var RENDER_LIMIT = 40; // 首屏只渲染 40 道，滚动加载
  var rendered = 0;

  function renderCard(id) {
    var cfg = DB[id];
    cfg.id = id;
    var el = document.createElement("div");
    el.innerHTML = H.prac(cfg);
    var card = el.firstChild;
    if (cfg.featured) card.classList.add("premium-feat");
    return card;
  }

  function render() {
    var ids = filteredIds();
    rendered = 0;
    grid.innerHTML = "";
    featSection.innerHTML = "";
    emptyState.style.display = ids.length === 0 ? "block" : "none";
    document.getElementById("st-total").textContent = ids.length;
    updateStats();

    // 默认视图（无筛选）时：精选区置顶
    var f = currentFilters();
    var featIds = [];
    if (f.lang === "all" && f.level === "all" && f.feat === "all" && !f.q) {
      for (var i = 0; i < ids.length; i++) {
        if (DB[ids[i]].featured) featIds.push(ids[i]);
      }
      if (featIds.length) {
        var sep = document.createElement("div");
        sep.className = "feat-sep";
        sep.innerHTML = '<span class="star">★</span> 师父精选好题（' + featIds.length + " 道，先啃这批）";
        featSection.appendChild(sep);
        var featGrid = document.createElement("div");
        featGrid.className = "prac-list";
        featIds.forEach(function (id) {
          featGrid.appendChild(renderCard(id));
        });
        featSection.appendChild(featGrid);
      }
    }

    // 主列表
    appendMore(ids);
    global.refreshAllPractices();
    highlightAll();
  }

  function appendMore(ids) {
    var frag = document.createDocumentFragment();
    var end = Math.min(rendered + RENDER_LIMIT, ids.length);
    for (var i = rendered; i < end; i++) {
      frag.appendChild(renderCard(ids[i]));
    }
    rendered = end;
    grid.appendChild(frag);
    if (rendered < ids.length) {
      ensureSentinel(ids);
    }
  }

  var sentinel = null;
  function ensureSentinel(ids) {
    if (sentinel) sentinel.remove();
    sentinel = document.createElement("div");
    sentinel.className = "load-more";
    sentinel.style.cssText = "text-align:center;padding:22px;color:var(--text-dim);font-size:14px;";
    sentinel.innerHTML = "⏬ 上滑加载更多（已显示 " + rendered + " / " + ids.length + "）";
    grid.appendChild(sentinel);
    if (!ensureSentinel.wired) {
      ensureSentinel.wired = true;
      window.addEventListener("scroll", function () {
        if (!sentinel || !document.body.contains(sentinel)) return;
        var rect = sentinel.getBoundingClientRect();
        if (rect.top < window.innerHeight + 400) {
          appendMore(ids);
        }
      }, { passive: true });
    }
  }

  function highlightAll() {
    document.querySelectorAll(".codeblock").forEach(function (cb) {
      var code = cb.querySelector("code");
      var lang = cb.getAttribute("data-lang") || "c";
      code.innerHTML = RMHL.highlight(code.innerText, lang);
    });
  }

  /* ---------- 统计 ---------- */
  function updateStats() {
    var total = Object.keys(DB).length;
    var st = RMStore.stats();
    var featDone = 0, featTotal = 0;
    var today = new Date().toDateString();
    var todayCount = 0;
    var pr = RMStore.practice();
    for (var id in DB) {
      if (DB[id].featured) {
        featTotal++;
        if (pr[id]) featDone++;
      }
    }
    // 今日练会数（progress 值存日期字符串）
    for (var k in pr) {
      if (pr[k] === today) todayCount++;
    }
    document.getElementById("st-total").textContent = total;
    document.getElementById("st-done").textContent = st.pDone;
    document.getElementById("st-pct").textContent = total ? Math.round(st.pDone / total * 100) + "%" : "0%";
    document.getElementById("st-feat").textContent = featDone + "/" + featTotal;
    document.getElementById("st-today").textContent = todayCount;
  }

  /* ---------- 测验统计 + 连续打卡 ---------- */
  function renderQuizPanel() {
    var qs = RMStore.quizStats();
    var pctEl = document.getElementById("qs-pct");
    var barEl = document.getElementById("qs-bar");
    var detEl = document.getElementById("qs-detail");
    if (!pctEl) return;
    pctEl.textContent = qs.pct + "%";
    barEl.style.width = qs.pct + "%";
    detEl.textContent = qs.total
      ? "已答 " + qs.total + " 题，答对 " + qs.right + " 道。答错的都在右上角 📕 错题本里。"
      : "还没做过随堂测——去各课程页里点选择题，战绩会记在这儿。";
  }

  function renderStreak() {
    var el = document.getElementById("st-streak");
    var numEl = document.getElementById("streak-num");
    var barEl = document.getElementById("streakBar");
    if (!barEl) return;
    var days = RMStore.practiceDays();
    var streak = RMStore.streak();
    if (el) el.textContent = streak;
    if (numEl) numEl.textContent = streak + " 天";
    var html = "";
    for (var i = 13; i >= 0; i--) {
      var d = new Date();
      d.setDate(d.getDate() - i);
      var on = !!days[d.toDateString()];
      var lbl = (d.getMonth() + 1) + "/" + d.getDate();
      html += '<div class="day' + (on ? " on" : "") + (i === 0 ? " today" : "") + '" title="' + lbl + (on ? " · 有练题" : "") + '"><span class="n">' + d.getDate() + '</span>' + ["日","一","二","三","四","五","六"][d.getDay()] + '</div>';
    }
    barEl.innerHTML = html;
  }

  function refreshTodayCount() {
    var pr = RMStore.practice();
    var today = new Date().toDateString();
    var c = 0;
    for (var k in pr) if (pr[k] === today) c++;
    var el = document.getElementById("st-today");
    if (el) el.textContent = c;
  }

  global.refreshQuizPanel = renderQuizPanel;
  function renderStreakFull() { renderStreak(); refreshTodayCount(); }
  global.refreshStreak = renderStreakFull;

  /* ---------- 事件 ---------- */
  filterLang.addEventListener("change", render);
  filterLevel.addEventListener("change", render);
  filterFeat.addEventListener("change", render);
  searchBox.addEventListener("input", function () {
    clearTimeout(searchBox._t);
    searchBox._t = setTimeout(render, 200);
  });

  document.getElementById("btnRandom").addEventListener("click", function () {
    var ids = Object.keys(DB);
    if (!ids.length) return;
    var id = ids[Math.floor(Math.random() * ids.length)];
    // 定位到该题：筛选到它并滚动
    filterLang.value = langOf(id);
    filterLevel.value = "all";
    filterFeat.value = "all";
    searchBox.value = "";
    render();
    setTimeout(function () {
      var card = grid.querySelector('[data-pid="' + id + '"]');
      if (!card) card = featSection.querySelector('[data-pid="' + id + '"]');
      if (card) {
        card.scrollIntoView({ behavior: "smooth", block: "center" });
        card.style.transition = "box-shadow .3s";
        card.style.boxShadow = "0 0 0 2px var(--accent)";
        setTimeout(function () { card.style.boxShadow = ""; }, 2000);
      }
    }, 150);
  });

  document.getElementById("btnPrint").addEventListener("click", function () {
    window.print();
  });

  /* ---------- 启动 ---------- */
  renderQuizPanel();
  renderStreak();
  render();
})(window);
