(function () {
  "use strict";

  const config = window.STP_CONFIG || {};
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  /* ---------------------------------------------------------------------
     Toast
     --------------------------------------------------------------------- */
  const toast = document.getElementById("toast");
  let toastTimer = 0;

  function showToast(message, duration) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("show");
    }, duration || 4400);
  }

  /* ---------------------------------------------------------------------
     Repo links + year
     --------------------------------------------------------------------- */
  document.querySelectorAll("[data-repo]").forEach(function (link) {
    if (config.githubRepo) link.href = config.githubRepo;
  });

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------------------
     Beta CTA
     --------------------------------------------------------------------- */
  const betaUrl = (config.betaFormUrl || "").trim();
  const betaLinks = document.querySelectorAll("[data-beta]");
  const betaNote = document.getElementById("beta-note");

  if (betaUrl) {
    betaLinks.forEach(function (link) {
      link.href = betaUrl;
      link.target = "_blank";
      link.rel = "noopener";
    });
    if (betaNote) betaNote.textContent = "Formulário público disponível — leva menos de 2 minutos.";
  } else if (betaLinks.length) {
    betaLinks.forEach(function (link) {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        const section = document.getElementById("beta");
        if (section) section.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
        showToast("O formulário público entra no ar em breve. Enquanto isso, leia o PLANO.md ou acompanhe o repositório no GitHub.");
      });
    });
  }

  /* ---------------------------------------------------------------------
     Navigation
     --------------------------------------------------------------------- */
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("nav-toggle");

  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Abrir menu");
  }

  if (nav && navToggle) {
    navToggle.addEventListener("click", function () {
      const open = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeNav();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) closeNav();
    });
  }

  /* ---------------------------------------------------------------------
     Scroll progress + cursor glow
     --------------------------------------------------------------------- */
  const progress = document.getElementById("scroll-progress");
  const backToTop = document.getElementById("back-to-top");
  let ticking = false;

  function updateProgress() {
    if (!progress) return;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = height > 0 ? window.scrollY / height : 0;
    progress.style.width = Math.min(100, Math.max(0, ratio * 100)) + "%";
    if (backToTop) backToTop.classList.toggle("show", window.scrollY > 600);
    ticking = false;
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  }

  if (backToTop) {
    backToTop.addEventListener("click", scrollToTop);
  }

  document.querySelectorAll('a[href="#top"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      scrollToTop();
    });
  });

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    },
    { passive: true }
  );
  updateProgress();

  const glow = document.getElementById("cursor-glow");
  if (glow && finePointer && !reducedMotion) {
    window.addEventListener("mousemove", function (event) {
      glow.style.left = event.clientX + "px";
      glow.style.top = event.clientY + "px";
      glow.style.opacity = "1";
    });
    document.addEventListener("mouseleave", function () {
      glow.style.opacity = "0";
    });
  }

  /* ---------------------------------------------------------------------
     Reveal on scroll
     --------------------------------------------------------------------- */
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("in");
    });
  }

  /* ---------------------------------------------------------------------
     Counters
     --------------------------------------------------------------------- */
  function formatCounter(value, el) {
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    return prefix + Math.round(value).toLocaleString("pt-BR") + suffix;
  }

  function animateCounter(el) {
    if (el.dataset.done === "1") return;
    el.dataset.done = "1";
    const target = Number(el.dataset.count || 0);

    if (reducedMotion) {
      el.textContent = formatCounter(target, el);
      return;
    }

    const duration = 1400;
    const start = performance.now();

    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = formatCounter(target * eased, el);
      if (t < 1) {
        window.requestAnimationFrame(frame);
      } else {
        el.textContent = formatCounter(target, el);
      }
    }

    window.requestAnimationFrame(frame);
  }

  const counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach(function (el) {
      counterObserver.observe(el);
    });
  } else {
    counters.forEach(animateCounter);
  }

  /* ---------------------------------------------------------------------
     Terminal typing
     --------------------------------------------------------------------- */
  const terminal = document.getElementById("terminal-output");

  const terminalLines = [
    { text: "importando biblioteca steam...", cls: "dim" },
    { text: "312 jogos encontrados", cls: "ok" },
    { text: "contexto: 40 min · coop · leve · PC", cls: "accent" },
    { text: "filtrando: possui · roda · instalado", cls: "dim" },
    { text: "analisando histórico: 87% conclusão em jogos curtos", cls: "dim" },
    { text: "recomendação: Jogo X", cls: "ok" },
    { text: "motivo: coop local · sessão de 35 min · roda no seu PC", cls: "accent" },
    { text: "abrir: steam://rungameid/...", cls: "dim" },
  ];

  function makeLine(text, cls) {
    const line = document.createElement("span");
    line.className = "term-line " + cls;

    const prompt = document.createElement("span");
    prompt.className = "prompt";
    prompt.textContent = "> ";

    line.appendChild(prompt);
    line.appendChild(document.createTextNode(text));
    return line;
  }

  function renderTerminalInstant() {
    if (!terminal) return;
    terminal.innerHTML = "";
    terminalLines.forEach(function (line) {
      terminal.appendChild(makeLine(line.text, line.cls));
    });
    const cursor = document.createElement("span");
    cursor.className = "term-cursor";
    if (terminal.lastElementChild) terminal.lastElementChild.appendChild(cursor);
  }

  function runTerminal() {
    if (!terminal) return;

    if (reducedMotion) {
      renderTerminalInstant();
      return;
    }

    let lineIndex = 0;
    let charIndex = 0;
    let currentLine = null;
    let textNode = null;

    function typeNext() {
      if (lineIndex >= terminalLines.length) return;

      if (!currentLine) {
        const data = terminalLines[lineIndex];
        currentLine = document.createElement("span");
        currentLine.className = "term-line " + data.cls;

        const prompt = document.createElement("span");
        prompt.className = "prompt";
        prompt.textContent = "> ";
        currentLine.appendChild(prompt);

        textNode = document.createTextNode("");
        currentLine.appendChild(textNode);

        const cursor = document.createElement("span");
        cursor.className = "term-cursor";
        currentLine.appendChild(cursor);

        terminal.appendChild(currentLine);
      }

      const text = terminalLines[lineIndex].text;

      if (charIndex < text.length) {
        textNode.textContent += text.charAt(charIndex);
        charIndex += 1;
        window.setTimeout(typeNext, 15 + Math.random() * 22);
        return;
      }

      const cursor = currentLine.querySelector(".term-cursor");
      if (cursor) cursor.remove();

      lineIndex += 1;
      charIndex = 0;
      currentLine = null;
      textNode = null;

      if (lineIndex < terminalLines.length) {
        window.setTimeout(typeNext, 300);
      } else if (terminal.lastElementChild) {
        const endCursor = document.createElement("span");
        endCursor.className = "term-cursor";
        terminal.lastElementChild.appendChild(endCursor);
      }
    }

    window.setTimeout(typeNext, 650);
  }

  runTerminal();

  /* ---------------------------------------------------------------------
     Background particle network
     --------------------------------------------------------------------- */
  const canvas = document.getElementById("bg-canvas");
  const ctx = canvas ? canvas.getContext("2d") : null;
  let particles = [];
  let width = 0;
  let height = 0;
  let raf = 0;
  let pointer = { x: -9999, y: -9999 };
  let paused = false;

  function resizeCanvas() {
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initParticles();
  }

  function initParticles() {
    const count = Math.min(100, Math.max(34, Math.floor(width / 17)));
    particles = [];
    for (let i = 0; i < count; i += 1) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.32,
        vy: (Math.random() - 0.5) * 0.32,
        r: 0.8 + Math.random() * 1.5,
        tone: Math.random() > 0.78 ? "magenta" : "cyan",
      });
    }
  }

  function drawParticles() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i += 1) {
      const p = particles[i];

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;
      if (p.y < -20) p.y = height + 20;
      if (p.y > height + 20) p.y = -20;

      const dx = p.x - pointer.x;
      const dy = p.y - pointer.y;
      const distToPointer = Math.sqrt(dx * dx + dy * dy);
      if (distToPointer < 150 && distToPointer > 0.001) {
        const force = (150 - distToPointer) / 150;
        p.x += (dx / distToPointer) * force * 0.35;
        p.y += (dy / distToPointer) * force * 0.35;
      }

      ctx.beginPath();
      ctx.fillStyle = p.tone === "magenta" ? "rgba(255,43,214,0.55)" : "rgba(0,240,255,0.55)";
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();

      for (let j = i + 1; j < particles.length; j += 1) {
        const q = particles[j];
        const lx = p.x - q.x;
        const ly = p.y - q.y;
        const dist = Math.sqrt(lx * lx + ly * ly);
        if (dist < 128) {
          const alpha = (1 - dist / 128) * 0.16;
          ctx.beginPath();
          ctx.strokeStyle =
            p.tone === "magenta" || q.tone === "magenta"
              ? "rgba(255,43,214," + alpha + ")"
              : "rgba(0,240,255," + alpha + ")";
          ctx.lineWidth = 0.7;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }

    raf = window.requestAnimationFrame(drawParticles);
  }

  if (canvas && ctx && !reducedMotion) {
    resizeCanvas();
    drawParticles();

    window.addEventListener("resize", function () {
      window.cancelAnimationFrame(raf);
      resizeCanvas();
      drawParticles();
    });

    window.addEventListener(
      "mousemove",
      function (event) {
        pointer.x = event.clientX;
        pointer.y = event.clientY;
      },
      { passive: true }
    );

    document.addEventListener("mouseleave", function () {
      pointer.x = -9999;
      pointer.y = -9999;
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        window.cancelAnimationFrame(raf);
        paused = true;
      } else if (paused) {
        paused = false;
        drawParticles();
      }
    });
  }
})();
