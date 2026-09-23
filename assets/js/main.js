/* ProxySafe v2 - scripts du site (aucune dépendance externe) */
(function () {
  "use strict";
  document.documentElement.classList.remove("no-js");

  var header = document.querySelector(".site-header");
  var burger = document.querySelector(".burger");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- En-tête : état au défilement ---------- */
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle("is-scrolled", y > 20);
    var m = document.querySelector(".mobile-cta");
    if (m) m.classList.toggle("is-visible", y > 480);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  if (burger && header) {
    burger.addEventListener("click", function () {
      var open = header.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    document.querySelectorAll(".nav a").forEach(function (a) {
      a.addEventListener("click", function () {
        header.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Menu déroulant Services ---------- */
  var desktop = window.matchMedia("(min-width: 1081px)");
  document.querySelectorAll(".nav-item").forEach(function (item) {
    var trigger = item.querySelector(".nav-trigger");
    var closeTimer;
    function setOpen(v) {
      item.classList.toggle("is-open", v);
      trigger.setAttribute("aria-expanded", v ? "true" : "false");
    }
    trigger.addEventListener("click", function (e) {
      e.preventDefault();
      setOpen(!item.classList.contains("is-open"));
    });
    item.addEventListener("mouseenter", function () {
      if (!desktop.matches) return;
      clearTimeout(closeTimer);
      setOpen(true);
    });
    item.addEventListener("mouseleave", function () {
      if (!desktop.matches) return;
      closeTimer = setTimeout(function () {
        setOpen(false);
      }, 180);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
    document.addEventListener("click", function (e) {
      if (desktop.matches && !item.contains(e.target)) setOpen(false);
    });
  });

  /* ---------- Apparition au défilement ---------- */
  var reveals = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("is-visible");
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    reveals.forEach(function (el) {
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- Réseau animé du héros (accueil) ---------- */
  var canvas = document.querySelector(".hero-canvas");
  if (canvas && canvas.getContext && !reduceMotion) {
    var ctx = canvas.getContext("2d");
    var pts = [];
    var w, h, dpr, raf, running = true;
    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(70, (w * h) / 22000));
      pts = [];
      for (var i = 0; i < n; i++) {
        pts.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: Math.random() * 1.6 + 0.6
        });
      }
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      var max = 140;
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        for (var j = i + 1; j < pts.length; j++) {
          var q = pts[j];
          var dx = p.x - q.x, dy = p.y - q.y;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < max) {
            ctx.strokeStyle = "rgba(34,211,238," + (0.22 * (1 - d / max)).toFixed(3) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
        ctx.fillStyle = "rgba(125,211,252,0.75)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (running) raf = requestAnimationFrame(draw);
    }
    size();
    draw();
    window.addEventListener("resize", function () {
      size();
    });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (e) {
        running = e[0].isIntersecting;
        cancelAnimationFrame(raf);
        if (running) draw();
      }).observe(canvas);
    }
  }

  /* ---------- Test d'exposition ---------- */
  var quiz = document.querySelector("[data-quiz]");
  if (quiz) {
    var qs = quiz.querySelectorAll(".quiz-q");
    var bar = quiz.querySelector(".quiz-progress i");
    var count = quiz.querySelector(".quiz-count");
    var result = quiz.querySelector(".quiz-result");
    var idx = 0, score = 0, weak = [];
    function show(i) {
      qs.forEach(function (q, k) {
        q.classList.toggle("is-active", k === i);
      });
      bar.style.width = (i / qs.length) * 100 + "%";
      count.textContent = "Question " + (i + 1) + " / " + qs.length;
    }
    quiz.querySelectorAll(".quiz-answer").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var q = btn.closest(".quiz-q");
        var pts = parseInt(btn.getAttribute("data-points"), 10) || 0;
        score += pts;
        if (pts < 2) weak.push(q.getAttribute("data-tip"));
        idx++;
        if (idx < qs.length) show(idx);
        else finish();
      });
    });
    function finish() {
      qs.forEach(function (q) {
        q.classList.remove("is-active");
      });
      bar.style.width = "100%";
      count.textContent = "Résultat";
      var max = qs.length * 2;
      var pct = Math.round((score / max) * 100);
      var ring = result.querySelector(".ring");
      ring.style.setProperty("--p", pct);
      ring.querySelector("b").textContent = pct + "%";
      var title, text, color;
      if (pct < 45) {
        title = "Exposition élevée";
        text = "Plusieurs portes d'entrée courantes sont ouvertes. Une attaque banale pourrait bloquer votre activité.";
        color = "#ef4444";
      } else if (pct < 80) {
        title = "Exposition moyenne";
        text = "Les bases sont en partie là, mais il reste des angles morts que les attaques automatisées exploitent.";
        color = "#f59e0b";
      } else {
        title = "Bonne base de sécurité";
        text = "Vous avez de bons réflexes. L'enjeu est de les maintenir dans le temps et de le prouver à vos clients.";
        color = "#22c55e";
      }
      ring.style.background = "conic-gradient(" + color + " " + pct + "%, #e8eef6 0)";
      result.querySelector("[data-title]").textContent = title;
      result.querySelector("[data-text]").textContent = text;
      var ul = result.querySelector(".quiz-tips");
      ul.innerHTML = "";
      (weak.length ? weak : ["Faire vérifier ces points par un regard extérieur une fois par an."]).slice(0, 4).forEach(function (t) {
        var li = document.createElement("li");
        li.textContent = t;
        ul.appendChild(li);
      });
      var mail = result.querySelector("[data-mail]");
      if (mail) {
        var body = "Bonjour Allan,\n\nJ'ai fait le test d'exposition sur votre site (score : " + pct + "%, " + title.toLowerCase() + ").\nJe souhaite réserver le diagnostic flash gratuit.\n\nNom :\nEntreprise :\nTéléphone :";
        mail.href = "mailto:allan@proxysafe.be?subject=" + encodeURIComponent("Diagnostic flash - suite au test d'exposition") + "&body=" + encodeURIComponent(body);
      }
      result.classList.add("is-active");
    }
    var restart = quiz.querySelector(".quiz-restart");
    if (restart)
      restart.addEventListener("click", function () {
        idx = 0;
        score = 0;
        weak = [];
        result.classList.remove("is-active");
        show(0);
      });
    show(0);
  }

  /* ---------- Formulaire -> e-mail pré-rempli ---------- */
  document.querySelectorAll("[data-mailto-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = function (n) {
        var el = form.querySelector("[name='" + n + "']");
        return el ? el.value.trim() : "";
      };
      var besoin = f("besoin") || "Diagnostic flash gratuit";
      var body =
        "Bonjour Allan,\n\n" +
        "Je souhaite être recontacté au sujet de : " + besoin + ".\n\n" +
        (f("message") ? f("message") + "\n\n" : "") +
        "Nom : " + f("nom") + "\n" +
        "Entreprise / activité : " + f("entreprise") + "\n" +
        "Téléphone : " + f("tel") + "\n" +
        "Commune : " + f("commune") + "\n";
      window.location.href =
        "mailto:allan@proxysafe.be?subject=" + encodeURIComponent("Demande - " + besoin) + "&body=" + encodeURIComponent(body);
    });
  });

  /* ---------- Filtres du blog ---------- */
  var filters = document.querySelectorAll(".filter");
  if (filters.length) {
    filters.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var cat = btn.getAttribute("data-filter");
        filters.forEach(function (b) {
          b.classList.toggle("is-active", b === btn);
          b.setAttribute("aria-pressed", b === btn ? "true" : "false");
        });
        document.querySelectorAll("[data-cat]").forEach(function (card) {
          var ok = cat === "all" || card.getAttribute("data-cat").indexOf(cat) !== -1;
          card.style.display = ok ? "" : "none";
        });
      });
    });
  }

  /* ---------- Consentement cookies + Google Analytics ---------- */
  var GA_ID = "G-T8369CWJ6G";
  var KEY = "ps-consent";
  function loadGA() {
    if (window.__gaLoaded) return;
    window.__gaLoaded = true;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, { anonymize_ip: true });
  }
  function getConsent() {
    try {
      return localStorage.getItem(KEY);
    } catch (e) {
      return null;
    }
  }
  function setConsent(v) {
    try {
      localStorage.setItem(KEY, v);
    } catch (e) {}
  }
  var banner = document.querySelector(".consent");
  var c = getConsent();
  if (c === "yes") loadGA();
  else if (!c && banner) banner.classList.add("is-visible");
  if (banner) {
    banner.querySelector("[data-consent='yes']").addEventListener("click", function () {
      setConsent("yes");
      banner.classList.remove("is-visible");
      loadGA();
    });
    banner.querySelector("[data-consent='no']").addEventListener("click", function () {
      setConsent("no");
      banner.classList.remove("is-visible");
    });
  }
  document.querySelectorAll("[data-consent-reset]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      try {
        localStorage.removeItem(KEY);
      } catch (err) {}
      if (banner) banner.classList.add("is-visible");
    });
  });
})();

/* Ouverture de la page Facebook dans l'application sur mobile (repris de la v1) */
function openFacebookApp(event, pageId, webUrl) {
  var ua = navigator.userAgent || navigator.vendor || window.opera;
  if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
    event.preventDefault();
    window.location.href = "fb://profile/" + pageId;
  } else if (/android/i.test(ua)) {
    event.preventDefault();
    window.location.href = "fb://page/" + pageId;
  } else {
    return;
  }
  setTimeout(function () {
    window.open(webUrl, "_blank");
  }, 600);
}

/* v2.1 : indicateurs de carrousel sur mobile */
(function () {
  "use strict";
  var mq = window.matchMedia("(max-width: 760px)");
  document.querySelectorAll(".m-swipe").forEach(function (track) {
    var items = track.children;
    if (items.length < 2) return;
    var dots = document.createElement("div");
    dots.className = "swipe-dots";
    dots.setAttribute("aria-hidden", "true");
    for (var i = 0; i < items.length; i++) dots.appendChild(document.createElement("i"));
    track.parentNode.insertBefore(dots, track.nextSibling);
    function update() {
      if (!mq.matches) return;
      var w = items[0].getBoundingClientRect().width + 12;
      var idx = Math.round(track.scrollLeft / w);
      Array.prototype.forEach.call(dots.children, function (d, k) {
        d.classList.toggle("is-active", k === Math.min(idx, items.length - 1));
      });
    }
    track.addEventListener("scroll", update, { passive: true });
    update();
  });
})();
