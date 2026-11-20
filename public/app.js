// ───────── Config: fill these before going live ─────────
const CONFIG = {
  email: "myuzicbyabhishek@gmail.com",
  whatsapp: "916393122939",       // country code + number, digits only
  web3formsKey: "b91b5348-ccbf-4d7f-8dfc-85bd96f65930",   // web3forms.com, public by design
};

const TRACKS = [
  { id: "befizul", title: "Befizul", date: "Nov 2026", kind: "Music video", color: "#8f9460",
    listen: "https://www.submithub.com/link/befizul", watch: "https://www.youtube.com/watch?v=emQ8mlC3EaE" },
  { id: "baarish", title: "Baarish", date: "Sep 2026", kind: "Lyric video", color: "#5c8a76",
    listen: "https://www.submithub.com/link/baarish", watch: "https://www.youtube.com/watch?v=IfPjVuCabv8" },
  { id: "maafi", title: "Maafi", date: "Jul 2026", kind: "Visualizer", color: "#2f8a8f",
    listen: "https://www.submithub.com/link/maafi", watch: "https://www.youtube.com/watch?v=NCI2-f3cAZM" },
  { id: "har-jagah", title: "Har Jagah", date: "Jun 2026", kind: "Visualizer", color: "#5fb6c9",
    listen: "https://www.submithub.com/link/har-jagah", watch: "https://www.youtube.com/watch?v=gOWZ01hz2lI" },
  { id: "jaan-e-jaan", title: "Jaan E Jaan", date: "Mar 2026", kind: "Music video", color: "#a24fae",
    listen: "https://open.spotify.com/album/3qmqAS2AaOVw7ipnDCqIFh", watch: "https://www.youtube.com/watch?v=wV0h7NGj8y0" },
];

document.documentElement.classList.add("js");
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

// ───────── Tracks ─────────
const PLAY = '<svg class="ic-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg>';
const PAUSE = '<svg class="ic-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor"/></svg>';
$("#tracks").innerHTML = TRACKS.map((t, i) => `
  <li class="track reveal" style="--c:${t.color};--d:${i * 0.07}s" data-track="${t.id}">
    <button class="cover" data-play="${t.id}" aria-label="Play a preview of ${t.title}">
      <img src="img/cover-${t.id}-sm.webp" srcset="img/cover-${t.id}-sm.webp 320w, img/cover-${t.id}.webp 640w"
           sizes="(max-width: 640px) 45vw, (max-width: 1080px) 30vw, 220px" alt="${t.title} cover art" loading="lazy">
      <span class="cover-btn">${PLAY}${PAUSE}</span>
    </button>
    <div class="track-meta">
      <h3>${t.title}</h3>
      <p>${t.date} · ${t.kind}</p>
      <div class="track-links">
        <a href="${t.listen}" target="_blank" rel="noopener">Listen</a>
        <a href="${t.watch}" target="_blank" rel="noopener">Watch</a>
      </div>
    </div>
  </li>`).join("");

// ───────── Player: one audio element, page takes the song's colour ─────────
const audio = new Audio();
audio.preload = "none";
const player = $("#player");
let current = null;

function setPlayingUI() {
  const playing = current && !audio.paused;
  $$("[data-track]").forEach(el => el.classList.toggle("is-playing", playing && el.dataset.track === current.id));
  $$('[data-play]').forEach(b => {
    if (!b.classList.contains("cover")) b.classList.toggle("is-playing", playing && b.dataset.play === current.id);
  });
  player.classList.toggle("paused", !playing);
  $("#pToggle").setAttribute("aria-label", playing ? "Pause" : "Play");
}

function play(id) {
  const t = TRACKS.find(x => x.id === id);
  if (!t) return;
  if (current && current.id === id) {
    audio.paused ? audio.play() : audio.pause();
    return;
  }
  current = t;
  audio.src = `audio/${t.id}.m4a`;
  audio.play().catch(() => {});
  document.documentElement.style.setProperty("--song", t.color);
  $("#pCover").src = `img/cover-${t.id}-sm.webp`;
  $("#pTitle").textContent = t.title;
  $("#pFull").href = t.listen;
  player.hidden = false;
}

document.addEventListener("click", e => {
  const b = e.target.closest("[data-play]");
  if (b) play(b.dataset.play);
});
$("#pToggle").addEventListener("click", () => (audio.paused ? audio.play() : audio.pause()));
$("#pClose").addEventListener("click", () => {
  audio.pause();
  player.hidden = true;
  current = null;
  document.documentElement.style.removeProperty("--song");
  setPlayingUI();
});
["play", "pause", "ended"].forEach(ev => audio.addEventListener(ev, setPlayingUI));
audio.addEventListener("timeupdate", () => {
  $("#pBar").style.width = audio.duration ? `${(audio.currentTime / audio.duration) * 100}%` : "0";
});

// ───────── Lite YouTube embed ─────────
$$("[data-yt]").forEach(box => {
  $(".video-poster", box).addEventListener("click", () => {
    audio.pause();
    const f = document.createElement("iframe");
    f.src = `https://www.youtube-nocookie.com/embed/${box.dataset.yt}?autoplay=1&rel=0&modestbranding=1`;
    f.title = "Befizul, official music video";
    f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    f.allowFullscreen = true;
    box.replaceChildren(f);
  });
});

// ───────── Nav ─────────
const nav = $("#nav");
const menuBtn = $("#menuBtn");
const onScroll = () => {
  nav.classList.toggle("scrolled", scrollY > innerHeight * 0.7 || nav.classList.contains("open"));
  if (!reduceMotion) {
    const hp = Math.min(1, scrollY / innerHeight);
    document.documentElement.style.setProperty("--hero-p", hp.toFixed(3));
    const about = $(".about-media");
    if (about) {
      const r = about.getBoundingClientRect();
      const p = 1 - Math.max(0, Math.min(1, r.bottom / (innerHeight + r.height)));
      document.documentElement.style.setProperty("--about-p", p.toFixed(3));
    }
  }
};
addEventListener("scroll", onScroll, { passive: true });
onScroll();
menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
  menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  onScroll();
});
$$(".nav-links a").forEach(a => a.addEventListener("click", () => {
  nav.classList.remove("open");
  menuBtn.setAttribute("aria-expanded", "false");
}));

// ───────── Scroll reveal ─────────
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
  });
}, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
$$(".reveal").forEach(el => io.observe(el));
$$(".svc-grid .svc").forEach((el, i) => el.style.setProperty("--d", `${(i % 3) * 0.08}s`));

// ───────── Contact links ─────────
const waText = encodeURIComponent("Hi Abhishek, I found you through your website and I'd like to talk about a project.");
if (CONFIG.whatsapp) {
  $("#waLink").href = `https://wa.me/${CONFIG.whatsapp}?text=${waText}`;
} else {
  $("#waLink").href = "https://ig.me/m/myuzicbyabhishek";
  $("#waLink small").textContent = "Instagram DM";
}
if (CONFIG.email) {
  $("#mailLink").href = `mailto:${CONFIG.email}`;
  $("#mailText").textContent = CONFIG.email;
} else {
  $("#mailLink").hidden = true;
}

// Service buttons pre-select the form
$$("[data-service]").forEach(b => b.addEventListener("click", () => {
  const r = $(`input[name="service"][value="${CSS.escape(b.dataset.service)}"]`);
  if (r) r.checked = true;
  $("#contact").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  setTimeout(() => $("#f-name").focus({ preventScroll: true }), reduceMotion ? 0 : 700);
}));

// ───────── Form ─────────
const form = $("#inquiry");
const status = $("#formStatus");
const sendBtn = $(".btn-send", form);
const rules = {
  name: v => v.trim().length > 1,
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
  phone: v => !v.trim() || v.replace(/\D/g, "").length >= 8,
  message: v => v.trim().length > 9,
};
function check(input) {
  const ok = rules[input.name] ? rules[input.name](input.value) : true;
  const field = input.closest(".field");
  field.classList.toggle("invalid", !ok);
  input.setAttribute("aria-invalid", String(!ok));
  return ok;
}
$$("input, textarea", form).forEach(el => {
  if (!rules[el.name]) return;
  el.addEventListener("blur", () => { if (el.value) check(el); });
  el.addEventListener("input", () => { if (el.closest(".field").classList.contains("invalid")) check(el); });
});

form.addEventListener("submit", async e => {
  e.preventDefault();
  const inputs = $$("input[name=name], input[name=email], input[name=phone], textarea", form);
  const bad = inputs.filter(i => !check(i));
  if (bad.length) { bad[0].focus(); status.textContent = ""; return; }
  if (form.botcheck.checked) return;

  const data = Object.fromEntries(new FormData(form));
  if (!CONFIG.web3formsKey) {
    status.textContent = "The form isn’t connected yet. Please DM me on Instagram for now.";
    return;
  }
  sendBtn.classList.add("sending");
  status.textContent = "";
  try {
    // FormData keeps this a "simple" CORS request: no preflight for the API's firewall to reject
    const body = new FormData(form);
    body.delete("botcheck");
    body.append("access_key", CONFIG.web3formsKey);
    body.append("subject", `New inquiry: ${data.service} (from ${data.name})`);
    body.append("from_name", "myuzicbyabhishek website");
    body.append("replyto", data.email);
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { Accept: "application/json" },
      body,
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    sendBtn.classList.remove("sending");
    sendBtn.classList.add("sent");
    status.textContent = `Thanks, ${data.name.split(" ")[0]}. Your message is in. I’ll reply to ${data.email} soon.`;
    form.reset();
    setTimeout(() => sendBtn.classList.remove("sent"), 4000);
  } catch {
    sendBtn.classList.remove("sending");
    status.textContent = "That didn’t send. Check your connection and try again, or DM me on Instagram.";
  }
});
