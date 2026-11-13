/* 王秋里 · 个人主页脚本：主题切换、研究地图交互、导航高亮 */

(function () {
  "use strict";

  /* ---------- 深浅色 ---------- */
  var themeBtn = document.querySelector(".theme-btn");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next =
        document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
    });
  }

  /* ---------- 研究地图 ---------- */
  var mapSvg = document.querySelector(".rmap");
  if (mapSvg) {
    var mapNodes = [].slice.call(mapSvg.querySelectorAll(".node[data-f]"));
    var mapEdges = [].slice.call(mapSvg.querySelectorAll(".edge"));
    var pubItems = [].slice.call(document.querySelectorAll("#papers .pub"));
    var bar = document.getElementById("filter-bar");
    var nameEl = document.getElementById("filter-name");
    var countEl = document.getElementById("filter-count");
    var clearBtn = document.getElementById("filter-clear");
    var tip = document.getElementById("map-tip");
    var active = null;
    var hovered = null;

    // 论文的标签集合
    var keysOf = function (li) {
      return (li.getAttribute("data-map") || "").split(" ");
    };

    // 节点属于哪一列，决定二阶展开的方向
    var kindOf = {};
    mapNodes.forEach(function (n) {
      var k = n.getAttribute("data-f");
      kindOf[k] = n.classList.contains("method")
        ? "method"
        : n.classList.contains("issue")
        ? "issue"
        : "data";
    });

    // 连线粗细 = 同时命中两端标签的论文数
    mapEdges.forEach(function (e) {
      var a = e.getAttribute("data-a");
      var b = e.getAttribute("data-b");
      var n = pubItems.filter(function (li) {
        var ks = keysOf(li);
        return ks.indexOf(a) !== -1 && ks.indexOf(b) !== -1;
      }).length;
      e.style.setProperty("--w", (0.7 + Math.min(n, 5) * 0.85).toFixed(2));
      e.style.setProperty("--o", n ? "0.5" : "0.14");
    });

    // 点亮：一阶看直连，二阶只给模态（往前）和场景（往后）各延伸一跳
    var paint = function (id) {
      if (!id) {
        mapSvg.classList.remove("filtering");
        mapNodes.forEach(function (n) {
          n.classList.remove("is-active");
        });
        mapEdges.forEach(function (e) {
          e.classList.remove("is-active");
        });
        return;
      }

      var nodeSet = {};
      var edgeSet = new Set();
      nodeSet[id] = 1;

      var mine = pubItems.filter(function (li) {
        return keysOf(li).indexOf(id) !== -1;
      });
      var supported = function (a, b) {
        return mine.some(function (li) {
          var ks = keysOf(li);
          return ks.indexOf(a) !== -1 && ks.indexOf(b) !== -1;
        });
      };

      mapEdges.forEach(function (e) {
        var a = e.getAttribute("data-a");
        var b = e.getAttribute("data-b");
        if (a !== id && b !== id) return;
        if (!supported(a, b)) return;
        edgeSet.add(e);
        nodeSet[a] = 1;
        nodeSet[b] = 1;
      });

      var kind = kindOf[id];
      if (kind === "data" || kind === "issue") {
        mapEdges.forEach(function (e) {
          if (edgeSet.has(e)) return;
          var a = e.getAttribute("data-a");
          var b = e.getAttribute("data-b");
          if (!supported(a, b)) return;
          if (kind === "data" && nodeSet[a]) {
            edgeSet.add(e);
            nodeSet[b] = 1;
          } else if (kind === "issue" && nodeSet[b]) {
            edgeSet.add(e);
            nodeSet[a] = 1;
          }
        });
      }

      mapSvg.classList.add("filtering");
      mapNodes.forEach(function (n) {
        n.classList.toggle("is-active", !!nodeSet[n.getAttribute("data-f")]);
      });
      mapEdges.forEach(function (e) {
        e.classList.toggle("is-active", edgeSet.has(e));
      });
    };

    // 筛选论文列表
    var applyFilter = function (id) {
      active = id;
      var shown = 0;
      pubItems.forEach(function (li) {
        var ok = !id || keysOf(li).indexOf(id) !== -1;
        li.classList.toggle("is-hidden", !ok);
        if (ok) shown++;
      });
      paint(id);
      if (!bar) return;
      bar.classList.toggle("is-on", !!id);
      if (id && nameEl) {
        var node = mapSvg.querySelector('.node[data-f="' + id + '"]');
        nameEl.textContent = node ? node.getAttribute("data-label") : id;
      }
      if (countEl) countEl.textContent = id ? shown + " 篇论文" : "";
    };

    var scrollToPapers = function () {
      var el = document.getElementById("papers");
      if (!el) return;
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.pageYOffset - 64,
        behavior: "smooth"
      });
    };

    /* 气泡：停在图上 0.5 秒才出现，全站最多两次 */
    var tipCount = 0;
    try {
      tipCount = parseInt(localStorage.getItem("mapTipCount_v3") || "0", 10) || 0;
    } catch (e) {}
    var tipTimer = null;
    var lastPoint = null;

    var hideTip = function () {
      if (tip) tip.classList.remove("is-on");
    };

    var showTip = function (el, cx, cy) {
      if (!tip) return;
      var left, top, below;
      if (el) {
        var r = el.getBoundingClientRect();
        left = r.left + r.width / 2;
        below = r.top < 90;
        top = below ? r.bottom + 10 : r.top - 10;
      } else {
        left = cx;
        top = cy - 14;
        below = cy < 90;
      }
      tip.style.left = left + "px";
      tip.style.top = top + "px";
      tip.classList.toggle("is-below", below);
      tip.classList.add("is-on");
      tipCount += 1;
      try {
        localStorage.setItem("mapTipCount_v3", String(tipCount));
      } catch (e) {}
      setTimeout(hideTip, 3200);
    };

    var armTip = function (el, x, y) {
      if (!tip || tipCount >= 2) return;
      clearTimeout(tipTimer);
      tipTimer = setTimeout(function () {
        showTip(el, x, y);
      }, 500);
    };

    // 指针命中的节点（热区 rect 与文字都带 data-f）
    var hitOf = function (ev) {
      return ev.target.closest ? ev.target.closest("[data-f]") : null;
    };

    mapSvg.addEventListener("mouseenter", function (ev) {
      lastPoint = { x: ev.clientX, y: ev.clientY };
      armTip(hitOf(ev), ev.clientX, ev.clientY);
    });

    mapSvg.addEventListener("mousemove", function (ev) {
      var target = hitOf(ev);
      var id = target ? target.getAttribute("data-f") : null;

      if (id !== hovered) {
        hovered = id;
        paint(id || active);
      }

      // 只有真的移动才重新计时，轻微抖动不算
      if (
        lastPoint &&
        Math.abs(ev.clientX - lastPoint.x) < 3 &&
        Math.abs(ev.clientY - lastPoint.y) < 3
      ) {
        return;
      }
      lastPoint = { x: ev.clientX, y: ev.clientY };
      hideTip();
      armTip(target, ev.clientX, ev.clientY);
    });

    mapSvg.addEventListener("mouseleave", function () {
      clearTimeout(tipTimer);
      hideTip();
      hovered = null;
      paint(active);
    });

    var toggle = function (target) {
      clearTimeout(tipTimer);
      hideTip();
      var id = target.getAttribute("data-f");
      var next = active === id ? null : id;
      applyFilter(next);
      if (next) scrollToPapers();
    };

    mapSvg.addEventListener("click", function (ev) {
      var target = hitOf(ev);
      if (target) toggle(target);
    });

    mapSvg.addEventListener("keydown", function (ev) {
      if (ev.key !== "Enter" && ev.key !== " ") return;
      var target = hitOf(ev);
      if (!target) return;
      ev.preventDefault();
      toggle(target);
    });

    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        applyFilter(null);
      });
    }

    // 点图区与筛选条以外的地方，自动清除筛选
    document.addEventListener("click", function (ev) {
      if (!active) return;
      var t = ev.target;
      if (t.closest && (t.closest(".rmap") || t.closest("#filter-bar"))) return;
      applyFilter(null);
    });
  }

  /* ---------- 顶部导航跟随滚动高亮 ---------- */
  var navLinks = [].slice.call(document.querySelectorAll('.nav a[href^="#"]'));
  var sections = navLinks
    .map(function (a) {
      return document.getElementById(a.getAttribute("href").slice(1));
    })
    .filter(Boolean);

  if (navLinks.length && sections.length) {
    var ticking = false;
    var spy = function () {
      var line = window.scrollY + 140;
      var current = null;
      sections.forEach(function (s) {
        if (s.offsetTop <= line) current = s;
      });
      navLinks.forEach(function (a) {
        a.classList.toggle("active", !!current && a.getAttribute("href") === "#" + current.id);
      });
      ticking = false;
    };
    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(spy);
      },
      { passive: true }
    );
    window.addEventListener("resize", spy);
    spy();
  }
})();
