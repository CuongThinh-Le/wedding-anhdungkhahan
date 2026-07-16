(function () {
  "use strict";

  /* ---------------- Calendar (September 2026, Monday-first) ---------------- */
  function buildCalendar() {
    var table = document.getElementById("calendar-table");
    if (!table) return;

    var days = ["THỨ HAI", "THỨ BA", "THỨ TƯ", "THỨ NĂM", "THỨ SÁU", "THỨ BẢY", "CHỦ NHẬT"];
    var year = 2026;
    var month = 8; // 0-indexed => September
    var highlight = 19;

    // JS getDay(): 0=Sun..6=Sat. Convert to Monday-first index (0=Mon..6=Sun)
    var firstDay = new Date(year, month, 1).getDay();
    var startCol = (firstDay + 6) % 7;
    var daysInMonth = new Date(year, month + 1, 0).getDate();

    var html = "<thead><tr>";
    days.forEach(function (d) { html += "<th>" + d + "</th>"; });
    html += "</tr></thead><tbody>";

    var cell = 0;
    var day = 1;
    // number of rows needed
    var totalCells = startCol + daysInMonth;
    var rows = Math.ceil(totalCells / 7);

    for (var r = 0; r < rows; r++) {
      html += "<tr>";
      for (var c = 0; c < 7; c++, cell++) {
        if (cell < startCol || day > daysInMonth) {
          html += '<td class="empty"></td>';
        } else if (day === highlight) {
          html +=
            '<td><span class="cal-heart">' +
            '<svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.6">' +
            '<path d="M12 20s-7-4.6-7-9.4A3.6 3.6 0 0 1 12 8a3.6 3.6 0 0 1 7-.4C19 15.4 12 20 12 20z"/></svg>' +
            "<span>" + day + "</span></span></td>";
          day++;
        } else {
          html += "<td>" + day + "</td>";
          day++;
        }
      }
      html += "</tr>";
    }
    html += "</tbody>";
    table.innerHTML = html;
  }

  /* ---------------- Scroll reveal ---------------- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------------- Copy account number ---------------- */
  function initCopy() {
    var btn = document.getElementById("copyAcc");
    if (!btn) return;
    var original = btn.textContent;
    btn.addEventListener("click", function () {
      var acc = btn.getAttribute("data-acc") || "";
      var done = function () {
        btn.classList.add("copied");
        btn.textContent = "Đã sao chép số tài khoản ✓";
        setTimeout(function () {
          btn.classList.remove("copied");
          btn.textContent = original;
        }, 2200);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(acc).then(done).catch(fallback);
      } else {
        fallback();
      }
      function fallback() {
        var ta = document.createElement("textarea");
        ta.value = acc;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch (e) {}
        document.body.removeChild(ta);
        done();
      }
    });
  }

  function init() {
    buildCalendar();
    initReveal();
    initCopy();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
