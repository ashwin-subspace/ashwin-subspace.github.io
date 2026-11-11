(function () {
  const header = document.querySelector(".nav");
  const toggle = document.querySelector(".nav-toggle");
  if (header && toggle) {
    toggle.addEventListener("click", function () {
      const open = header.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    header.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        header.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const portrait = document.querySelector(".hero .portrait");
  if (portrait) {
    const settle = function (on) { portrait.classList.toggle("is-set", on); };
    portrait.addEventListener("pointerenter", function () { settle(true); });
    portrait.addEventListener("pointerleave", function () { settle(false); });
    portrait.addEventListener("focus", function () { settle(true); });
    portrait.addEventListener("blur", function () { settle(false); });
  }

  const root = document.querySelector("[data-carousel]");
  if (!root) return;

  const slides = Array.prototype.slice.call(root.querySelectorAll(".slide"));
  const tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
  const viewport = root.querySelector(".viewport");
  const live = document.getElementById("slide-live");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fineHover = window.matchMedia("(hover: hover) and (pointer: fine)");
  const pauses = new Set();
  let index = 0;
  let timer = 0;
  const duration = 8000;

  if (reduce) root.classList.add("is-reduced");

  function setPause(reason, on) {
    if (on) pauses.add(reason);
    else pauses.delete(reason);
    const paused = pauses.size > 0;
    root.classList.toggle("is-paused", paused);
    if (paused) window.clearTimeout(timer);
    else arm();
  }

  function restartProgress() {
    root.querySelectorAll(".bar i").forEach(function (bar) {
      bar.classList.remove("is-running");
    });
    if (reduce || !tabs[index]) return;
    const bar = tabs[index].querySelector(".bar i");
    if (!bar) return;
    void bar.offsetWidth;
    bar.classList.add("is-running");
  }

  function show(next, fromUser) {
    const previous = slides[index];
    index = (next + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      const on = i === index;
      slide.classList.toggle("is-active", on);
      slide.setAttribute("aria-hidden", on ? "false" : "true");
      if (!on) {
        slide.setAttribute("inert", "");
        const card = slide.querySelector(".card");
        if (card) card.classList.remove("is-open");
      } else {
        slide.removeAttribute("inert");
      }
    });
    if (previous && previous !== slides[index]) {
      previous.classList.add("is-leaving");
      window.setTimeout(function () {
        previous.classList.remove("is-leaving");
      }, 480);
    }
    tabs.forEach(function (tab, i) {
      const on = i === index;
      tab.setAttribute("aria-selected", on ? "true" : "false");
      tab.tabIndex = on ? 0 : -1;
    });
    const activeTab = tabs[index];
    if (activeTab && fromUser && activeTab.scrollIntoView) {
      activeTab.scrollIntoView({ inline: "nearest", block: "nearest" });
    }
    restartProgress();
    if (fromUser && live) {
      const title = slides[index].querySelector(".slide-title");
      live.textContent = (title ? title.textContent : "Project") + ", " + (index + 1) + " of " + slides.length;
    }
    const open = root.querySelector(".card.is-open");
    if (open) pauses.add("open");
    else pauses.delete("open");
    root.classList.toggle("is-paused", pauses.size > 0);
    if (pauses.size) window.clearTimeout(timer);
    else arm();
  }

  function arm() {
    window.clearTimeout(timer);
    if (reduce || pauses.size) return;
    timer = window.setTimeout(function () {
      show(index + 1, false);
    }, duration);
  }

  root.addEventListener("pointerenter", function () { setPause("hover", true); });
  root.addEventListener("pointerleave", function () { setPause("hover", false); });
  root.addEventListener("focusin", function () { setPause("focus", true); });
  root.addEventListener("focusout", function (event) {
    if (!root.contains(event.relatedTarget)) setPause("focus", false);
  });

  document.addEventListener("visibilitychange", function () {
    setPause("hidden", document.hidden);
  });

  const prev = root.querySelector("[data-prev]");
  const next = root.querySelector("[data-next]");
  if (prev) prev.addEventListener("click", function () { show(index - 1, true); });
  if (next) next.addEventListener("click", function () { show(index + 1, true); });

  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () { show(i, true); });
    tab.addEventListener("keydown", function (event) {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      event.stopPropagation();
      const delta = event.key === "ArrowRight" ? 1 : -1;
      const target = (i + delta + slides.length) % slides.length;
      show(target, true);
      tabs[target].focus();
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    if (!root.contains(document.activeElement)) return;
    if (event.target.closest && event.target.closest('[role="tab"]')) return;
    if (event.target.closest && event.target.closest("input, textarea, select")) return;
    event.preventDefault();
    show(index + (event.key === "ArrowRight" ? 1 : -1), true);
  });

  let start = null;
  root.addEventListener("pointerdown", function (event) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    start = { x: event.clientX, y: event.clientY };
  });
  root.addEventListener("pointerup", function (event) {
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    start = null;
    if (Math.abs(dx) >= 64 && Math.abs(dx) > Math.abs(dy)) {
      show(index + (dx < 0 ? 1 : -1), true);
      return;
    }
    if (event.target.closest && event.target.closest("a, button")) return;
    if (viewport) viewport.focus({ preventScroll: true });
  });

  slides.forEach(function (slide) {
    const card = slide.querySelector(".card");
    if (!card) return;
    card.addEventListener("click", function (event) {
      if (event.target.closest("a, button")) return;
      if (fineHover.matches) return;
      card.classList.toggle("is-open");
      setPause("open", !!root.querySelector(".card.is-open"));
    });
  });

  document.querySelectorAll(".exp-card").forEach(function (card) {
    card.addEventListener("click", function (event) {
      if (event.target.closest("a")) return;
      if (fineHover.matches) return;
      card.classList.toggle("is-open");
    });
  });

  show(0, false);
})();
