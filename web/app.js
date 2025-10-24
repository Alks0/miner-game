(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // frontend-scripts/core/NetworkManager.ts
  var _NetworkManager = class _NetworkManager {
    constructor() {
      __publicField(this, "token", null);
    }
    static get I() {
      var _a;
      return (_a = this._instance) != null ? _a : this._instance = new _NetworkManager();
    }
    setToken(t) {
      this.token = t;
    }
    async request(path, init) {
      const headers = { "Content-Type": "application/json", ...(init == null ? void 0 : init.headers) || {} };
      if (this.token) headers["Authorization"] = `Bearer ${this.token}`;
      const res = await fetch(this.getBase() + path, { ...init, headers });
      const json = await res.json();
      if (!res.ok || json.code >= 400) throw new Error(json.message || "Request Error");
      return json.data;
    }
    getBase() {
      return window.__API_BASE__ || "http://localhost:3000/api";
    }
  };
  __publicField(_NetworkManager, "_instance");
  var NetworkManager = _NetworkManager;

  // frontend-scripts/core/GameManager.ts
  var _GameManager = class _GameManager {
    constructor() {
      __publicField(this, "profile", null);
    }
    static get I() {
      var _a;
      return (_a = this._instance) != null ? _a : this._instance = new _GameManager();
    }
    getProfile() {
      return this.profile;
    }
    async loginOrRegister(username, password) {
      const nm = NetworkManager.I;
      try {
        const r = await nm.request("/auth/login", { method: "POST", body: JSON.stringify({ username, password }) });
        nm.setToken(r.access_token);
      } catch (e) {
        const r = await NetworkManager.I.request("/auth/register", { method: "POST", body: JSON.stringify({ username, password }) });
        NetworkManager.I.setToken(r.access_token);
      }
      this.profile = await nm.request("/user/profile");
    }
  };
  __publicField(_GameManager, "_instance");
  var GameManager = _GameManager;

  // frontend-scripts/utils/dom.ts
  function html(template) {
    const div = document.createElement("div");
    div.innerHTML = template.trim();
    return div.firstElementChild;
  }
  function qs(root, sel) {
    const el = root.querySelector(sel);
    if (!el) throw new Error(`Missing element: ${sel}`);
    return el;
  }

  // frontend-scripts/components/Icon.ts
  function grad(id) {
    return `<defs>
    <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#7B2CF5" />
      <stop offset="100%" stop-color="#2C89F5" />
    </linearGradient>
  </defs>`;
  }
  function svgWrap(path, size = 18, cls = "") {
    const gid = "ig-" + Math.random().toString(36).slice(2, 8);
    const el = html(`<span class="icon ${cls}" aria-hidden="true">${`<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">${grad(gid)}${path.replaceAll("__GRAD__", `url(#${gid})`)}</svg>`}</span>`);
    return el;
  }
  function renderIcon(name, opts = {}) {
    var _a, _b;
    const size = (_a = opts.size) != null ? _a : 18;
    const cls = (_b = opts.className) != null ? _b : "";
    const stroke = 'stroke="__GRAD__" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"';
    const fill = 'fill="__GRAD__"';
    switch (name) {
      case "home":
        return svgWrap(`<path d="M3 10.5L12 3l9 7.5" ${stroke}/><path d="M5.5 9.5V21h13V9.5" ${stroke}/><path d="M9.5 21v-6h5v6" ${stroke}/>`, size, cls);
      case "warehouse":
        return svgWrap(`<path d="M3 9l9-5 9 5v9.5c0 1-1 2-2 2H5c-1 0-2-1-2-2V9z" ${stroke}/><path d="M7 12h10M7 16h10" ${stroke}/>`, size, cls);
      case "plunder":
        return svgWrap(`<path d="M4 20l7-7M13 13l7 7M9 5l6 6M15 5l-6 6" ${stroke}/>`, size, cls);
      case "exchange":
        return svgWrap(`<path d="M6 8h11l-3-3M18 16H7l3 3" ${stroke}/>`, size, cls);
      case "ranking":
        return svgWrap(`<path d="M8 14v6M12 10v10M16 6v14" ${stroke}/><path d="M16 4.5a2 2 0 100-4 2 2 0 000 4z" ${fill}/>`, size, cls);
      case "ore":
        return svgWrap(`<path d="M12 3l6 4-2 8-4 6-4-6-2-8 6-4z" ${stroke}/><path d="M12 3l-2 8 2 10 2-10-2-8z" ${stroke}/>`, size, cls);
      case "coin":
        return svgWrap(`<circle cx="12" cy="12" r="8.5" ${stroke}/><path d="M8.5 12h7M10 9h4M10 15h4" ${stroke}/>`, size, cls);
      case "pick":
        return svgWrap(`<path d="M4 5c4-3 9-2 12 1M9 10l-5 5M9 10l2 2M7 12l2 2" ${stroke}/><path d="M11 12l7 7" ${stroke}/>`, size, cls);
      case "refresh":
        return svgWrap(`<path d="M20 12a8 8 0 10-2.3 5.7" ${stroke}/><path d="M20 12v6h-6" ${stroke}/>`, size, cls);
      case "play":
        return svgWrap(`<path d="M8 6v12l10-6-10-6z" ${stroke}/>`, size, cls);
      case "stop":
        return svgWrap(`<rect x="7" y="7" width="10" height="10" rx="2" ${stroke}/>`, size, cls);
      case "collect":
        return svgWrap(`<path d="M12 5v10" ${stroke}/><path d="M8 11l4 4 4-4" ${stroke}/><path d="M5 19h14" ${stroke}/>`, size, cls);
      case "wrench":
        return svgWrap(`<path d="M15.5 6a4.5 4.5 0 11-6.9 5.4L3 17l4.6-5.6A4.5 4.5 0 1115.5 6z" ${stroke}/>`, size, cls);
      case "shield":
        return svgWrap(`<path d="M12 3l8 3v6a10 10 0 01-8 9 10 10 0 01-8-9V6l8-3z" ${stroke}/>`, size, cls);
      case "list":
        return svgWrap(`<path d="M7 6h12M7 12h12M7 18h12" ${stroke}/><path d="M4 6h.01M4 12h.01M4 18h.01" ${stroke}/>`, size, cls);
      case "user":
        return svgWrap(`<path d="M12 12a4 4 0 100-8 4 4 0 000 8z" ${stroke}/><path d="M4 20a8 8 0 0116 0" ${stroke}/>`, size, cls);
      case "lock":
        return svgWrap(`<rect x="5" y="10" width="14" height="10" rx="2" ${stroke}/><path d="M8 10V7a4 4 0 118 0v3" ${stroke}/>`, size, cls);
      case "eye":
        return svgWrap(`<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" ${stroke}/><circle cx="12" cy="12" r="3" ${stroke}/>`, size, cls);
      case "eye-off":
        return svgWrap(`<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" ${stroke}/><circle cx="12" cy="12" r="3" ${stroke}/><path d="M3 3l18 18" ${stroke}/>`, size, cls);
      case "sword":
        return svgWrap(`<path d="M3 21l6-6M9 15l9-9 3 3-9 9M14 6l4 4" ${stroke}/>`, size, cls);
      case "trophy":
        return svgWrap(`<path d="M8 21h8M9 17h6M7 4h10v5a5 5 0 11-10 0V4z" ${stroke}/><path d="M4 6h3v2a3 3 0 11-3-2zM20 6h-3v2a3 3 0 003-2z" ${stroke}/>`, size, cls);
      case "clock":
        return svgWrap(`<circle cx="12" cy="12" r="8.5" ${stroke}/><path d="M12 7v6l4 2" ${stroke}/>`, size, cls);
      case "bolt":
        return svgWrap(`<path d="M13 2L6 14h5l-1 8 7-12h-5l1-8z" ${stroke}/>`, size, cls);
      case "trash":
        return svgWrap(`<path d="M4 7h16M9 7V5h6v2M7 7l1 13h8l1-13" ${stroke}/>`, size, cls);
      case "close":
        return svgWrap(`<path d="M6 6l12 12M6 18L18 6" ${stroke}/>`, size, cls);
      case "arrow-right":
        return svgWrap(`<path d="M4 12h14M12 5l7 7-7 7" ${stroke}/>`, size, cls);
      case "target":
        return svgWrap(`<circle cx="12" cy="12" r="8.5" ${stroke}/><circle cx="12" cy="12" r="4.5" ${stroke}/><path d="M12 2v3M12 19v3M2 12h3M19 12h3" ${stroke}/>`, size, cls);
      case "box":
        return svgWrap(`<path d="M12 3l9 5-9 5-9-5 9-5z" ${stroke}/><path d="M3 8v8l9 5 9-5V8" ${stroke}/><path d="M12 13v8" ${stroke}/>`, size, cls);
      case "info":
        return svgWrap(`<circle cx="12" cy="12" r="8.5" ${stroke}/><path d="M12 10v6" ${stroke}/><path d="M12 7h.01" ${stroke}/>`, size, cls);
      default:
        return svgWrap(`<circle cx="12" cy="12" r="9" ${stroke}/>`, size, cls);
    }
  }

  // frontend-scripts/components/Toast.ts
  var _box = null;
  function ensureBox() {
    if (_box) return _box;
    const div = document.createElement("div");
    div.className = "toast-wrap";
    document.body.appendChild(div);
    _box = div;
    return div;
  }
  function showToast(text, opts) {
    const box = ensureBox();
    const item = document.createElement("div");
    let type;
    let duration = 3500;
    if (typeof opts === "string") type = opts;
    else if (opts) {
      type = opts.type;
      if (opts.duration) duration = opts.duration;
    }
    item.className = "toast" + (type ? " " + type : "");
    try {
      const wrap = document.createElement("div");
      wrap.style.display = "flex";
      wrap.style.gap = "8px";
      wrap.style.alignItems = "center";
      const icoName = type === "success" ? "bolt" : type === "warn" ? "clock" : type === "error" ? "close" : "info";
      const icoHost = document.createElement("span");
      icoHost.appendChild(renderIcon(icoName, { size: 18 }));
      const txt = document.createElement("div");
      txt.textContent = text;
      wrap.appendChild(icoHost);
      wrap.appendChild(txt);
      item.appendChild(wrap);
    } catch (e) {
      item.textContent = text;
    }
    const life = document.createElement("i");
    life.className = "life";
    life.style.setProperty("--life", duration + "ms");
    item.appendChild(life);
    box.prepend(item);
    const fade = () => {
      item.style.opacity = "0";
      item.style.transition = "opacity .45s";
      setTimeout(() => item.remove(), 460);
    };
    const timer = window.setTimeout(fade, duration);
    item.addEventListener("click", () => {
      clearTimeout(timer);
      fade();
    });
  }

  // frontend-scripts/scenes/LoginScene.ts
  var LoginScene = class {
    mount(root) {
      const view = html(`
      <div class="container grid-2" style="color:#fff;">
        <div class="card fade-in" style="max-width:460px;margin:46px auto;">
          <div class="scene-header">
            <div>
              <h1 style="background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent;display:flex;align-items:center;gap:8px;"><span data-ico="home"></span>\u77FF\u573A\u6307\u6325\u4E2D\u5FC3</h1>
              <p>\u767B\u5F55\u540E\u8FDB\u5165\u4F60\u7684\u8D5B\u535A\u77FF\u57CE\u3002</p>
            </div>
          </div>
          <input id="u" class="input" placeholder="\u7528\u6237\u540D" autocomplete="username"/>
          <div class="row" style="align-items:center;">
            <input id="p" class="input" placeholder="\u5BC6\u7801" type="password" autocomplete="current-password"/>
            <button id="reveal" class="btn btn-ghost" style="min-width:110px;"><span data-ico="eye"></span>\u663E\u793A</button>
          </div>
          <button id="go" class="btn btn-primary" style="width:100%;margin-top:8px;"><span data-ico="arrow-right"></span>\u8FDB\u5165\u6E38\u620F</button>
          <div style="margin-top:8px;opacity:.75;font-size:12px;">\u63D0\u793A\uFF1A\u82E5\u8D26\u6237\u4E0D\u5B58\u5728\uFF0C\u5C06\u81EA\u52A8\u521B\u5EFA\u5E76\u767B\u5F55\u3002</div>
        </div>
      </div>
    `);
      root.innerHTML = "";
      root.appendChild(view);
      try {
        view.querySelectorAll("[data-ico]").forEach((el) => {
          const name = el.getAttribute("data-ico");
          try {
            el.appendChild(renderIcon(name, { size: 22 }));
          } catch (e) {
          }
        });
      } catch (e) {
      }
      const uEl = qs(view, "#u");
      const pEl = qs(view, "#p");
      const go = qs(view, "#go");
      const reveal = qs(view, "#reveal");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          uEl.focus();
        });
      });
      const submit = async () => {
        const username = (uEl.value || "").trim();
        const password = (pEl.value || "").trim();
        if (!username || !password) {
          showToast("\u8BF7\u586B\u5199\u7528\u6237\u540D\u548C\u5BC6\u7801", "warn");
          return;
        }
        go.disabled = true;
        go.textContent = "\u767B\u5F55\u4E2D\u2026";
        try {
          await GameManager.I.loginOrRegister(username, password);
          location.hash = "#/main";
        } catch (e) {
          showToast((e == null ? void 0 : e.message) || "\u767B\u5F55\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5", "error");
        } finally {
          go.disabled = false;
          go.textContent = "\u8FDB\u5165\u6E38\u620F";
        }
      };
      go.onclick = submit;
      uEl.onkeyup = (e) => {
        if (e.key === "Enter") submit();
      };
      pEl.onkeyup = (e) => {
        if (e.key === "Enter") submit();
      };
      reveal.onclick = () => {
        const isPwd = pEl.type === "password";
        pEl.type = isPwd ? "text" : "password";
        reveal.innerHTML = "";
        reveal.appendChild(renderIcon(isPwd ? "eye-off" : "eye", { size: 20 }));
        reveal.appendChild(document.createTextNode(isPwd ? "\u9690\u85CF" : "\u663E\u793A"));
      };
    }
  };

  // frontend-scripts/core/Env.ts
  var API_BASE = window.__API_BASE__ || "http://localhost:3000/api";
  var WS_ENDPOINT = window.__WS_ENDPOINT__ || "http://localhost:3000/game";

  // frontend-scripts/core/RealtimeClient.ts
  var _RealtimeClient = class _RealtimeClient {
    constructor() {
      __publicField(this, "socket", null);
      __publicField(this, "handlers", {});
    }
    static get I() {
      var _a;
      return (_a = this._instance) != null ? _a : this._instance = new _RealtimeClient();
    }
    connect(token) {
      const w = window;
      if (w.io) {
        if (this.socket && (this.socket.connected || this.socket.connecting)) return;
        this.socket = w.io(WS_ENDPOINT, { auth: { token } });
        this.socket.on("connect", () => {
        });
        this.socket.onAny((event, payload) => this.emitLocal(event, payload));
      } else {
        this.socket = null;
      }
    }
    on(event, handler) {
      var _a;
      ((_a = this.handlers)[event] || (_a[event] = [])).push(handler);
    }
    off(event, handler) {
      const arr = this.handlers[event];
      if (!arr) return;
      const idx = arr.indexOf(handler);
      if (idx >= 0) arr.splice(idx, 1);
    }
    emitLocal(event, payload) {
      (this.handlers[event] || []).forEach((h) => h(payload));
    }
  };
  __publicField(_RealtimeClient, "_instance");
  var RealtimeClient = _RealtimeClient;

  // frontend-scripts/components/Nav.ts
  function renderNav(active) {
    const tabs = [
      { key: "main", text: "\u4E3B\u9875", href: "#/main", icon: "home" },
      { key: "warehouse", text: "\u4ED3\u5E93", href: "#/warehouse", icon: "warehouse" },
      { key: "plunder", text: "\u63A0\u593A", href: "#/plunder", icon: "plunder" },
      { key: "exchange", text: "\u4EA4\u6613\u6240", href: "#/exchange", icon: "exchange" },
      { key: "ranking", text: "\u6392\u884C", href: "#/ranking", icon: "ranking" }
    ];
    const wrap = document.createElement("div");
    wrap.className = "nav";
    for (const t of tabs) {
      const a = document.createElement("a");
      a.href = t.href;
      const ico = renderIcon(t.icon, { size: 18, className: "ico" });
      const label = document.createElement("span");
      label.textContent = t.text;
      a.appendChild(ico);
      a.appendChild(label);
      if (t.key === active) a.classList.add("active");
      wrap.appendChild(a);
    }
    return wrap;
  }

  // frontend-scripts/components/CountUpText.ts
  var CountUpText = class {
    constructor() {
      __publicField(this, "value", 0);
      __publicField(this, "display", "0");
      __publicField(this, "anim");
      __publicField(this, "onUpdate");
    }
    set(n) {
      var _a;
      this.value = n;
      this.display = this.format(n);
      (_a = this.onUpdate) == null ? void 0 : _a.call(this, this.display);
    }
    to(n, duration = 500) {
      cancelAnimationFrame(this.anim);
      const start = this.value;
      const delta = n - start;
      const t0 = performance.now();
      const step = (t) => {
        var _a;
        const p = Math.min(1, (t - t0) / duration);
        const ease = 1 - Math.pow(1 - p, 3);
        const curr = start + delta * ease;
        this.display = this.format(curr);
        (_a = this.onUpdate) == null ? void 0 : _a.call(this, this.display);
        if (p < 1) this.anim = requestAnimationFrame(step);
        else this.value = n;
      };
      this.anim = requestAnimationFrame(step);
    }
    format(n) {
      return Math.floor(n).toLocaleString();
    }
  };

  // frontend-scripts/components/ResourceBar.ts
  function renderResourceBar() {
    const box = document.createElement("div");
    box.className = "container";
    const card = document.createElement("div");
    card.className = "card fade-in";
    card.innerHTML = `
    <div class="stats">
      <div class="stat" id="ore-stat">
        <div class="ico" data-ico="ore"></div>
        <div style="display:flex;flex-direction:column;gap:2px;">
          <div class="val" id="ore">0</div>
          <div class="label">\u77FF\u77F3</div>
        </div>
      </div>
      <div class="stat" id="coin-stat">
        <div class="ico" data-ico="coin"></div>
        <div style="display:flex;flex-direction:column;gap:2px;">
          <div class="val" id="coin">0</div>
          <div class="label">BB</div>
        </div>
      </div>
    </div>
  `;
    box.appendChild(card);
    try {
      const oreIco = card.querySelector('[data-ico="ore"]');
      const coinIco = card.querySelector('[data-ico="coin"]');
      if (oreIco) oreIco.appendChild(renderIcon("ore", { size: 18 }));
      if (coinIco) coinIco.appendChild(renderIcon("coin", { size: 18 }));
    } catch (e) {
    }
    const oreEl = card.querySelector("#ore");
    const coinEl = card.querySelector("#coin");
    const oreCounter = new CountUpText();
    const coinCounter = new CountUpText();
    oreCounter.onUpdate = (text) => {
      oreEl.textContent = text;
    };
    coinCounter.onUpdate = (text) => {
      coinEl.textContent = text;
    };
    let prevOre = 0;
    let prevCoin = 0;
    async function update() {
      try {
        const p = await NetworkManager.I.request("/user/profile");
        if (p.oreAmount !== prevOre) {
          oreCounter.to(p.oreAmount, 800);
          if (p.oreAmount > prevOre) {
            const oreIcon = card.querySelector("#ore-stat .ico");
            if (oreIcon) {
              oreIcon.classList.add("pulse-icon");
              setTimeout(() => oreIcon.classList.remove("pulse-icon"), 600);
            }
          }
          prevOre = p.oreAmount;
        }
        if (p.bbCoins !== prevCoin) {
          coinCounter.to(p.bbCoins, 800);
          if (p.bbCoins > prevCoin) {
            const coinIcon = card.querySelector("#coin-stat .ico");
            if (coinIcon) {
              coinIcon.classList.add("pulse-icon");
              setTimeout(() => coinIcon.classList.remove("pulse-icon"), 600);
            }
          }
          prevCoin = p.bbCoins;
        }
      } catch (e) {
      }
    }
    return { root: box, update, oreEl, coinEl };
  }

  // frontend-scripts/scenes/MainScene.ts
  var MainScene = class {
    constructor() {
      __publicField(this, "view", null);
      __publicField(this, "cartAmt", 0);
      __publicField(this, "cartCap", 1e3);
      __publicField(this, "isMining", false);
      __publicField(this, "isCollapsed", false);
      __publicField(this, "collapseRemaining", 0);
      __publicField(this, "collapseTimer", null);
      __publicField(this, "intervalMs", 3e3);
      __publicField(this, "pending", null);
      __publicField(this, "els", {
        fill: null,
        percent: null,
        statusText: null,
        ring: null,
        ringPct: null,
        cycle: null,
        statusTag: null,
        events: null,
        start: null,
        stop: null,
        collect: null,
        repair: null,
        statusBtn: null,
        hologram: null
      });
      __publicField(this, "mineUpdateHandler");
      __publicField(this, "mineCollapseHandler");
      __publicField(this, "plunderHandler");
      __publicField(this, "lastMilestone", 0);
    }
    async mount(root) {
      this.clearCollapseTimer();
      this.pending = null;
      const nav = renderNav("main");
      const bar = renderResourceBar();
      const view = html(`
      <section class="main-screen">
        <div class="main-ambient" aria-hidden="true">
          <span class="ambient orb orb-a"></span>
          <span class="ambient orb orb-b"></span>
          <span class="ambient grid"></span>
        </div>
        <div class="container main-stack" style="color:#fff;">
          <section class="mine card mine-card fade-in">
            <header class="mine-header">
              <div class="mine-title">
                <span class="title-icon" data-ico="pick"></span>
                <span class="title-label">\u6316\u77FF\u9762\u677F</span>
              </div>
              <div class="mine-chips">
                <span class="pill" id="statusTag">\u5F85\u673A</span>
                <span class="pill pill-cycle"><span data-ico="clock"></span>\u5468\u671F <span id="cycle">3s</span></span>
              </div>
            </header>
            <div class="mine-grid">
              <div class="mine-gauge">
                <div class="ring" id="ring">
                  <div class="ring-core">
                    <span id="ringPct">0%</span>
                    <small>\u88C5\u8F7D\u7387</small>
                  </div>
                </div>
                <div class="ring-glow ring-glow-a"></div>
                <div class="ring-glow ring-glow-b"></div>
              </div>
              <div class="mine-progress">
                <div class="mine-progress-meta">
                  <span>\u77FF\u8F66\u88C5\u8F7D</span>
                  <strong id="percent">0%</strong>
                </div>
                <div class="mine-progress-track">
                  <div class="mine-progress-fill" id="fill"></div>
                </div>
                <div id="statusText" class="mine-status"></div>
              </div>
            </div>
            <div class="mine-actions-grid">
              <button id="start" class="btn btn-buy span-2"><span data-ico="play"></span>\u5F00\u59CB\u6316\u77FF</button>
              <button id="stop" class="btn btn-ghost"><span data-ico="stop"></span>\u505C\u6B62</button>
              <button id="collect" class="btn btn-primary"><span data-ico="collect"></span>\u6536\u77FF</button>
              <button id="status" class="btn btn-ghost"><span data-ico="refresh"></span>\u5237\u65B0\u72B6\u6001</button>
              <button id="repair" class="btn btn-sell"><span data-ico="wrench"></span>\u4FEE\u7406</button>
            </div>
            <div class="mine-feed">
              <div class="event-feed" id="events"></div>
            </div>
            <div class="mine-hologram" id="hologram" aria-hidden="true">
              <span class="mine-holo-grid"></span>
              <span class="mine-holo-grid diagonal"></span>
              <span class="mine-holo-glow"></span>
            </div>
          </section>
        </div>
      </section>
    `);
      root.innerHTML = "";
      root.appendChild(nav);
      root.appendChild(bar.root);
      root.appendChild(view);
      this.view = view;
      try {
        view.querySelectorAll("[data-ico]").forEach((el) => {
          const name = el.getAttribute("data-ico");
          try {
            el.appendChild(renderIcon(name, { size: 20 }));
          } catch (e) {
          }
        });
      } catch (e) {
      }
      this.cacheElements();
      this.attachHandlers(bar.update.bind(bar));
      await bar.update();
      this.setupRealtime();
      await this.refreshStatus();
      this.updateProgress();
      this.updateControls();
    }
    cacheElements() {
      if (!this.view) return;
      this.els.fill = qs(this.view, "#fill");
      this.els.percent = qs(this.view, "#percent");
      this.els.statusText = qs(this.view, "#statusText");
      this.els.ring = this.view.querySelector("#ring");
      this.els.ringPct = this.view.querySelector("#ringPct");
      this.els.cycle = this.view.querySelector("#cycle");
      this.els.statusTag = this.view.querySelector("#statusTag");
      this.els.events = this.view.querySelector("#events");
      this.els.start = qs(this.view, "#start");
      this.els.stop = qs(this.view, "#stop");
      this.els.collect = qs(this.view, "#collect");
      this.els.repair = qs(this.view, "#repair");
      this.els.statusBtn = qs(this.view, "#status");
      this.els.hologram = this.view.querySelector("#hologram");
    }
    attachHandlers(updateBar) {
      var _a, _b, _c, _d, _e;
      if (!this.view) return;
      (_a = this.els.start) == null ? void 0 : _a.addEventListener("click", () => this.handleStart());
      (_b = this.els.stop) == null ? void 0 : _b.addEventListener("click", () => this.handleStop());
      (_c = this.els.statusBtn) == null ? void 0 : _c.addEventListener("click", () => this.refreshStatus());
      (_d = this.els.repair) == null ? void 0 : _d.addEventListener("click", () => this.handleRepair());
      (_e = this.els.collect) == null ? void 0 : _e.addEventListener("click", () => this.handleCollect(updateBar));
    }
    setupRealtime() {
      const token = NetworkManager.I["token"];
      if (token) RealtimeClient.I.connect(token);
      if (this.mineUpdateHandler) RealtimeClient.I.off("mine.update", this.mineUpdateHandler);
      if (this.mineCollapseHandler) RealtimeClient.I.off("mine.collapse", this.mineCollapseHandler);
      if (this.plunderHandler) RealtimeClient.I.off("plunder.attacked", this.plunderHandler);
      this.mineUpdateHandler = (msg) => {
        var _a;
        this.cartAmt = typeof msg.cartAmount === "number" ? msg.cartAmount : this.cartAmt;
        this.cartCap = typeof msg.cartCapacity === "number" ? msg.cartCapacity : this.cartCap;
        this.isMining = (_a = msg.running) != null ? _a : this.isMining;
        if (msg.collapsed && msg.collapsedRemaining) {
          this.beginCollapseCountdown(msg.collapsedRemaining);
        } else if (!msg.collapsed) {
          this.isCollapsed = false;
          this.clearCollapseTimer();
        }
        this.updateProgress();
        if (msg.type === "critical" && msg.amount) {
          this.setStatusMessage(`\u89E6\u53D1\u66B4\u51FB\uFF0C\u77FF\u8F66\u589E\u52A0 ${msg.amount}\uFF01`);
          this.logEvent(`\u66B4\u51FB +${msg.amount}`);
        } else if (msg.type === "normal" && msg.amount) {
          this.setStatusMessage(`\u77FF\u8F66\u589E\u52A0 ${msg.amount}\uFF0C\u5F53\u524D ${this.formatPercent()}`);
          this.logEvent(`\u6316\u6398 +${msg.amount}`);
        } else if (msg.type === "collapse") {
          this.setStatusMessage("\u77FF\u9053\u574D\u584C\uFF0C\u8BF7\u7ACB\u5373\u4FEE\u7406");
          this.logEvent("\u77FF\u9053\u574D\u584C");
        } else if (msg.type === "collect") {
          this.setStatusMessage("\u77FF\u77F3\u5DF2\u6536\u96C6\uFF0C\u77FF\u8F66\u6E05\u7A7A");
          this.logEvent("\u6536\u96C6\u5B8C\u6210");
        } else if (this.isCollapsed) {
          this.setStatusMessage(`\u77FF\u9053\u574D\u584C\uFF0C\u5269\u4F59 ${this.collapseRemaining}s`);
        }
        this.updateControls();
      };
      this.mineCollapseHandler = (msg) => {
        const seconds = Number(msg == null ? void 0 : msg.repair_duration) || 0;
        if (seconds > 0) this.beginCollapseCountdown(seconds);
        showToast(`\u77FF\u9053\u574D\u584C\uFF0C\u9700\u4FEE\u7406\uFF08\u7EA6 ${seconds}s\uFF09`, "warn");
      };
      this.plunderHandler = (msg) => {
        showToast(`\u88AB\u63A0\u593A\uFF1A\u6765\u81EA ${msg.attacker}\uFF0C\u635F\u5931 ${msg.loss}`, "warn");
        this.logEvent(`\u88AB ${msg.attacker} \u63A0\u593A -${msg.loss}`);
      };
      RealtimeClient.I.on("mine.update", this.mineUpdateHandler);
      RealtimeClient.I.on("mine.collapse", this.mineCollapseHandler);
      RealtimeClient.I.on("plunder.attacked", this.plunderHandler);
    }
    async handleStart() {
      if (this.pending || this.isCollapsed) {
        if (this.isCollapsed) showToast("\u77FF\u9053\u574D\u584C\uFF0C\u8BF7\u5148\u4FEE\u7406", "warn");
        return;
      }
      this.pending = "start";
      this.updateControls();
      try {
        const status = await NetworkManager.I.request("/mine/start", { method: "POST" });
        this.applyStatus(status);
        this.setStatusMessage("\u77FF\u673A\u5DF2\u542F\u52A8");
        showToast("\u77FF\u673A\u5DF2\u542F\u52A8", "success");
      } catch (e) {
        showToast((e == null ? void 0 : e.message) || "\u542F\u52A8\u5931\u8D25", "error");
      } finally {
        this.pending = null;
        this.updateControls();
      }
    }
    async handleStop() {
      if (this.pending) return;
      this.pending = "stop";
      this.updateControls();
      try {
        const status = await NetworkManager.I.request("/mine/stop", { method: "POST" });
        this.applyStatus(status);
        this.setStatusMessage("\u77FF\u673A\u5DF2\u505C\u6B62");
        showToast("\u77FF\u673A\u5DF2\u505C\u6B62", "success");
      } catch (e) {
        showToast((e == null ? void 0 : e.message) || "\u505C\u6B62\u5931\u8D25", "error");
      } finally {
        this.pending = null;
        this.updateControls();
      }
    }
    async handleCollect(updateBar) {
      if (this.pending || this.cartAmt <= 0) return;
      this.pending = "collect";
      this.updateControls();
      try {
        const res = await NetworkManager.I.request("/mine/collect", { method: "POST" });
        if (res.status) this.applyStatus(res.status);
        if (res.collected > 0) {
          this.createFlyingOreAnimation(res.collected);
          showToast(`\u6536\u96C6\u77FF\u77F3 ${res.collected}`, "success");
        } else {
          showToast("\u77FF\u8F66\u4E3A\u7A7A\uFF0C\u65E0\u77FF\u77F3\u53EF\u6536\u96C6", "warn");
        }
        await updateBar();
      } catch (e) {
        showToast((e == null ? void 0 : e.message) || "\u6536\u77FF\u5931\u8D25", "error");
      } finally {
        this.pending = null;
        this.updateControls();
      }
    }
    createFlyingOreAnimation(amount) {
      const fillEl = this.els.fill;
      const oreEl = document.querySelector("#ore");
      if (!fillEl || !oreEl) return;
      const startRect = fillEl.getBoundingClientRect();
      const endRect = oreEl.getBoundingClientRect();
      const particleCount = Math.min(8, Math.max(3, Math.floor(amount / 20)));
      for (let i = 0; i < particleCount; i++) {
        setTimeout(() => {
          const particle = document.createElement("div");
          particle.className = "ore-particle";
          particle.textContent = "\u{1F48E}";
          particle.style.cssText = `
          position: fixed;
          left: ${startRect.left + startRect.width / 2}px;
          top: ${startRect.top + startRect.height / 2}px;
          font-size: 24px;
          pointer-events: none;
          z-index: 9999;
          filter: drop-shadow(0 0 8px rgba(123,44,245,0.8));
        `;
          document.body.appendChild(particle);
          const dx = endRect.left + endRect.width / 2 - startRect.left - startRect.width / 2;
          const dy = endRect.top + endRect.height / 2 - startRect.top - startRect.height / 2;
          const randomOffset = (Math.random() - 0.5) * 100;
          particle.animate([
            {
              transform: "translate(0, 0) scale(1)",
              opacity: 1
            },
            {
              transform: `translate(${dx / 2 + randomOffset}px, ${dy - 150}px) scale(1.2)`,
              opacity: 1,
              offset: 0.5
            },
            {
              transform: `translate(${dx}px, ${dy}px) scale(0.5)`,
              opacity: 0
            }
          ], {
            duration: 1e3 + i * 50,
            easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)"
          }).onfinish = () => {
            particle.remove();
            if (i === particleCount - 1) {
              oreEl.classList.add("flash");
              setTimeout(() => oreEl.classList.remove("flash"), 900);
            }
          };
        }, i * 80);
      }
    }
    async handleRepair() {
      if (this.pending || !this.isCollapsed) return;
      this.pending = "repair";
      this.updateControls();
      try {
        const status = await NetworkManager.I.request("/mine/repair", { method: "POST" });
        this.applyStatus(status);
        this.setStatusMessage("\u77FF\u9053\u5DF2\u4FEE\u590D\uFF0C\u53EF\u91CD\u65B0\u542F\u52A8");
        showToast("\u77FF\u9053\u5DF2\u4FEE\u590D", "success");
      } catch (e) {
        showToast((e == null ? void 0 : e.message) || "\u4FEE\u7406\u5931\u8D25", "error");
      } finally {
        this.pending = null;
        this.updateControls();
      }
    }
    async refreshStatus() {
      if (this.pending === "status") return;
      this.pending = "status";
      this.updateControls();
      try {
        const status = await NetworkManager.I.request("/mine/status");
        this.applyStatus(status);
      } catch (e) {
        showToast((e == null ? void 0 : e.message) || "\u83B7\u53D6\u72B6\u6001\u5931\u8D25", "error");
      } finally {
        this.pending = null;
        this.updateControls();
      }
    }
    applyStatus(status, opts = {}) {
      var _a, _b, _c;
      if (!status) return;
      this.cartAmt = (_a = status.cartAmount) != null ? _a : this.cartAmt;
      this.cartCap = (_b = status.cartCapacity) != null ? _b : this.cartCap;
      this.intervalMs = (_c = status.intervalMs) != null ? _c : this.intervalMs;
      this.isMining = Boolean(status.running);
      this.isCollapsed = Boolean(status.collapsed);
      if (status.collapsed && status.collapsedRemaining > 0) {
        this.beginCollapseCountdown(status.collapsedRemaining);
      } else {
        this.clearCollapseTimer();
        this.collapseRemaining = 0;
      }
      this.updateProgress();
      if (!opts.quiet) {
        if (this.isCollapsed && this.collapseRemaining > 0) {
          this.setStatusMessage(`\u77FF\u9053\u574D\u584C\uFF0C\u5269\u4F59 ${this.collapseRemaining}s`);
        } else if (this.isMining) {
          const seconds = Math.max(1, Math.round(this.intervalMs / 1e3));
          this.setStatusMessage(`\u77FF\u673A\u8FD0\u884C\u4E2D\uFF0C\u5468\u671F\u7EA6 ${seconds}s\uFF0C\u5F53\u524D ${this.formatPercent()}`);
        } else {
          this.setStatusMessage("\u77FF\u673A\u5DF2\u505C\u6B62\uFF0C\u70B9\u51FB\u5F00\u59CB\u6316\u77FF");
        }
      }
      if (this.els.cycle) {
        const seconds = Math.max(1, Math.round(this.intervalMs / 1e3));
        this.els.cycle.textContent = `${seconds}s`;
      }
      if (this.els.statusTag) {
        const el = this.els.statusTag;
        el.innerHTML = "";
        el.classList.remove("pill-running", "pill-collapsed");
        const ico = this.isCollapsed ? "close" : this.isMining ? "bolt" : "clock";
        try {
          el.appendChild(renderIcon(ico, { size: 16 }));
        } catch (e) {
        }
        el.appendChild(document.createTextNode(this.isCollapsed ? "\u574D\u584C" : this.isMining ? "\u8FD0\u884C\u4E2D" : "\u5F85\u673A"));
        if (this.isCollapsed) {
          el.classList.add("pill-collapsed");
        } else if (this.isMining) {
          el.classList.add("pill-running");
        }
      }
      this.updateControls();
    }
    beginCollapseCountdown(seconds) {
      this.clearCollapseTimer();
      this.isCollapsed = true;
      this.collapseRemaining = Math.max(0, Math.floor(seconds));
      this.setStatusMessage(`\u77FF\u9053\u574D\u584C\uFF0C\u5269\u4F59 ${this.collapseRemaining}s`);
      this.updateControls();
      this.collapseTimer = window.setInterval(() => {
        this.collapseRemaining = Math.max(0, this.collapseRemaining - 1);
        if (this.collapseRemaining <= 0) {
          this.clearCollapseTimer();
          this.isCollapsed = false;
          this.setStatusMessage("\u574D\u584C\u89E3\u9664\uFF0C\u53EF\u91CD\u65B0\u542F\u52A8\u77FF\u673A");
          this.updateControls();
        } else {
          this.setStatusMessage(`\u77FF\u9053\u574D\u584C\uFF0C\u5269\u4F59 ${this.collapseRemaining}s`);
        }
      }, 1e3);
    }
    clearCollapseTimer() {
      if (this.collapseTimer !== null) {
        window.clearInterval(this.collapseTimer);
        this.collapseTimer = null;
      }
    }
    updateProgress() {
      var _a, _b;
      if (!this.els.fill || !this.els.percent) return;
      const pct = this.cartCap > 0 ? Math.min(1, this.cartAmt / this.cartCap) : 0;
      const pctInt = Math.round(pct * 100);
      this.els.fill.style.width = `${pctInt}%`;
      this.els.percent.textContent = `${pctInt}%`;
      let ringColor = "#7B2CF5";
      if (pct >= 0.75) {
        ringColor = "#f6c445";
      } else if (pct >= 0.5) {
        ringColor = "#2C89F5";
      }
      if (this.els.ring) {
        const deg = Math.round(pct * 360);
        this.els.ring.style.background = `conic-gradient(${ringColor} ${deg}deg, rgba(255,255,255,.08) 0deg)`;
        if (pct >= 1) {
          this.els.ring.classList.add("ring-full");
        } else {
          this.els.ring.classList.remove("ring-full");
        }
      }
      if (this.els.ringPct) this.els.ringPct.textContent = `${pctInt}%`;
      const milestones = [25, 50, 75, 100];
      for (const milestone of milestones) {
        if (pctInt >= milestone && this.lastMilestone < milestone) {
          this.triggerMilestonePulse(milestone);
          this.lastMilestone = milestone;
        }
      }
      if (pctInt < this.lastMilestone - 10) {
        this.lastMilestone = Math.floor(pctInt / 25) * 25;
      }
      if (pctInt >= 90 && pctInt < 100) {
        if (!((_b = (_a = this.els.statusText) == null ? void 0 : _a.textContent) == null ? void 0 : _b.includes("\u5373\u5C06\u6EE1\u8F7D"))) {
          this.setStatusMessage("\u26A0\uFE0F \u77FF\u8F66\u5373\u5C06\u6EE1\u8F7D\uFF0C\u5EFA\u8BAE\u6536\u77FF");
        }
      }
      if (this.pending !== "collect" && this.els.collect) {
        this.els.collect.disabled = this.pending === "collect" || this.cartAmt <= 0;
        if (this.cartAmt > 0 && !this.els.collect.disabled) {
          this.els.collect.classList.add("btn-energy");
        } else {
          this.els.collect.classList.remove("btn-energy");
        }
      }
      this.updateShards(pct);
      this.updateHologramState();
    }
    triggerMilestonePulse(milestone) {
      if (this.els.ring) {
        this.els.ring.classList.add("milestone-pulse");
        setTimeout(() => {
          var _a;
          return (_a = this.els.ring) == null ? void 0 : _a.classList.remove("milestone-pulse");
        }, 1e3);
      }
      if (this.els.ringPct) {
        this.els.ringPct.classList.add("flash");
        setTimeout(() => {
          var _a;
          return (_a = this.els.ringPct) == null ? void 0 : _a.classList.remove("flash");
        }, 900);
      }
      showToast(`\u{1F3AF} \u8FBE\u6210 ${milestone}% \u88C5\u8F7D\u7387\uFF01`, "success");
    }
    updateHologramState() {
      if (!this.els.hologram) return;
      this.els.hologram.classList.remove("holo-idle", "holo-mining", "holo-collapsed");
      if (this.isCollapsed) {
        this.els.hologram.classList.add("holo-collapsed");
      } else if (this.isMining) {
        this.els.hologram.classList.add("holo-mining");
      } else {
        this.els.hologram.classList.add("holo-idle");
      }
    }
    updateShards(loadPercent) {
      if (!this.els.hologram) return;
      const targetCount = Math.max(2, Math.min(12, Math.floor(loadPercent * 12) + 2));
      const currentShards = this.els.hologram.querySelectorAll(".mine-shard");
      const currentCount = currentShards.length;
      if (currentCount === targetCount) return;
      if (currentCount < targetCount) {
        const toAdd = targetCount - currentCount;
        for (let i = 0; i < toAdd; i++) {
          const shard = document.createElement("span");
          shard.className = "mine-shard";
          const positions = [
            { top: "18%", left: "16%", delay: -1.4, scale: 1 },
            { bottom: "16%", right: "22%", delay: -3.2, scale: 0.74 },
            { top: "26%", right: "34%", delay: -5.1, scale: 0.5 },
            { top: "40%", left: "28%", delay: -2.5, scale: 0.85 },
            { bottom: "30%", left: "18%", delay: -4.1, scale: 0.68 },
            { top: "15%", right: "15%", delay: -1.8, scale: 0.92 },
            { bottom: "22%", right: "40%", delay: -3.8, scale: 0.78 },
            { top: "50%", left: "12%", delay: -2.2, scale: 0.6 },
            { top: "35%", right: "20%", delay: -4.5, scale: 0.88 },
            { bottom: "40%", left: "35%", delay: -3.5, scale: 0.7 },
            { top: "60%", right: "28%", delay: -2.8, scale: 0.65 },
            { bottom: "50%", right: "12%", delay: -4.8, scale: 0.82 }
          ];
          const posIndex = (currentCount + i) % positions.length;
          const pos = positions[posIndex];
          if (pos.top) shard.style.top = pos.top;
          if (pos.bottom) shard.style.bottom = pos.bottom;
          if (pos.left) shard.style.left = pos.left;
          if (pos.right) shard.style.right = pos.right;
          shard.style.animationDelay = `${pos.delay}s`;
          shard.style.transform = `scale(${pos.scale})`;
          shard.style.opacity = "0";
          this.els.hologram.appendChild(shard);
          setTimeout(() => {
            shard.style.transition = "opacity 0.5s ease";
            shard.style.opacity = "0.26";
          }, 50);
        }
      } else if (currentCount > targetCount) {
        const toRemove = currentCount - targetCount;
        for (let i = 0; i < toRemove; i++) {
          const lastShard = currentShards[currentShards.length - 1 - i];
          if (lastShard) {
            lastShard.style.transition = "opacity 0.5s ease";
            lastShard.style.opacity = "0";
            setTimeout(() => {
              lastShard.remove();
            }, 500);
          }
        }
      }
    }
    updateControls() {
      const isBusy = (key) => this.pending === key;
      const setBtn = (btn, icon, label, disabled) => {
        var _a;
        if (!btn) return;
        btn.disabled = disabled;
        let iconHost = btn.querySelector(".icon");
        if (!iconHost) {
          btn.insertBefore(renderIcon(icon, { size: 18 }), btn.firstChild);
        } else {
          const host = document.createElement("span");
          host.appendChild(renderIcon(icon, { size: 18 }));
          (_a = iconHost.parentElement) == null ? void 0 : _a.replaceChild(host.firstChild, iconHost);
        }
        Array.from(btn.childNodes).forEach((n, idx) => {
          if (idx > 0) btn.removeChild(n);
        });
        btn.appendChild(document.createTextNode(label));
      };
      setBtn(this.els.start, "play", isBusy("start") ? "\u542F\u52A8\u4E2D\u2026" : this.isMining ? "\u6316\u77FF\u4E2D" : "\u5F00\u59CB\u6316\u77FF", isBusy("start") || this.isMining || this.isCollapsed);
      setBtn(this.els.stop, "stop", isBusy("stop") ? "\u505C\u6B62\u4E2D\u2026" : "\u505C\u6B62", isBusy("stop") || !this.isMining);
      setBtn(this.els.collect, "collect", isBusy("collect") ? "\u6536\u96C6\u4E2D\u2026" : "\u6536\u77FF", isBusy("collect") || this.cartAmt <= 0);
      setBtn(this.els.repair, "wrench", isBusy("repair") ? "\u4FEE\u7406\u4E2D\u2026" : "\u4FEE\u7406", isBusy("repair") || !this.isCollapsed);
      setBtn(this.els.statusBtn, "refresh", isBusy("status") ? "\u5237\u65B0\u4E2D\u2026" : "\u5237\u65B0\u72B6\u6001", isBusy("status"));
    }
    setStatusMessage(text) {
      if (!this.els.statusText) return;
      this.els.statusText.textContent = text;
    }
    logEvent(msg) {
      var _a;
      if (!((_a = this.els) == null ? void 0 : _a.events)) return;
      const line = document.createElement("div");
      const now = /* @__PURE__ */ new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const ss = String(now.getSeconds()).padStart(2, "0");
      let eventClass = "event";
      if (msg.includes("\u66B4\u51FB")) {
        eventClass += " event-critical";
      } else if (msg.includes("\u574D\u584C") || msg.includes("\u63A0\u593A")) {
        eventClass += " event-warning";
      } else if (msg.includes("\u6536\u96C6") || msg.includes("\u6210\u529F")) {
        eventClass += " event-success";
      } else {
        eventClass += " event-normal";
      }
      line.className = eventClass;
      line.textContent = `[${hh}:${mm}:${ss}] ${msg}`;
      line.style.opacity = "0";
      line.style.transform = "translateX(20px)";
      this.els.events.prepend(line);
      setTimeout(() => {
        line.style.transition = "opacity 0.3s ease, transform 0.3s ease";
        line.style.opacity = "0.9";
        line.style.transform = "translateX(0)";
      }, 10);
      if (msg.includes("\u66B4\u51FB")) {
        line.classList.add("flash");
        this.triggerCriticalEffect();
      }
    }
    triggerCriticalEffect() {
      if (this.els.ring) {
        this.els.ring.classList.add("ring-pulse");
        setTimeout(() => {
          var _a;
          return (_a = this.els.ring) == null ? void 0 : _a.classList.remove("ring-pulse");
        }, 600);
      }
      if (this.els.hologram) {
        this.els.hologram.classList.add("critical-flash");
        setTimeout(() => {
          var _a;
          return (_a = this.els.hologram) == null ? void 0 : _a.classList.remove("critical-flash");
        }, 400);
      }
    }
    formatPercent() {
      const pct = this.cartCap > 0 ? Math.min(1, this.cartAmt / this.cartCap) : 0;
      return `${Math.round(pct * 100)}%`;
    }
  };

  // frontend-scripts/scenes/WarehouseScene.ts
  var WarehouseScene = class {
    async mount(root) {
      root.innerHTML = "";
      root.appendChild(renderNav("warehouse"));
      const bar = renderResourceBar();
      root.appendChild(bar.root);
      const view = html(`
      <div class="container grid-2" style="color:#fff;">
        <div class="card fade-in">
          <div class="row" style="justify-content:space-between;align-items:center;">
            <h3 style="margin:0;display:flex;align-items:center;gap:8px;"><span data-ico="warehouse"></span>\u4ED3\u5E93</h3>
            <button id="refresh" class="btn btn-primary"><span data-ico="refresh"></span>\u5237\u65B0</button>
          </div>
          <div style="margin-top:12px;">
            <details open>
              <summary><span data-ico="box"></span>\u6211\u7684\u9053\u5177</summary>
              <div id="list" style="margin-top:8px;display:flex;flex-direction:column;gap:8px;"></div>
            </details>
            <details>
              <summary><span data-ico="list"></span>\u9053\u5177\u6A21\u677F</summary>
              <div id="tpls" style="margin-top:8px;display:flex;flex-direction:column;gap:8px;"></div>
            </details>
          </div>
        </div>
      </div>
    `);
      root.appendChild(view);
      const token = NetworkManager.I["token"];
      if (token) RealtimeClient.I.connect(token);
      const list = qs(view, "#list");
      const tplContainer = qs(view, "#tpls");
      const refreshBtn = qs(view, "#refresh");
      const mountIcons = (rootEl) => {
        rootEl.querySelectorAll("[data-ico]").forEach((el) => {
          const name = el.getAttribute("data-ico");
          try {
            el.appendChild(renderIcon(name, { size: 20 }));
          } catch (e) {
          }
        });
      };
      mountIcons(view);
      const getRarity = (item, tpl) => {
        const r = tpl && (tpl.rarity || tpl.tier) || item.rarity;
        const level = Number(item.level) || 0;
        if (typeof r === "string") {
          const k = r.toLowerCase();
          if (["legendary", "epic", "rare", "common"].includes(k)) {
            return { key: k, text: k === "legendary" ? "\u4F20\u8BF4" : k === "epic" ? "\u53F2\u8BD7" : k === "rare" ? "\u7A00\u6709" : "\u666E\u901A" };
          }
        }
        if (level >= 12) return { key: "legendary", text: "\u4F20\u8BF4" };
        if (level >= 8) return { key: "epic", text: "\u53F2\u8BD7" };
        if (level >= 4) return { key: "rare", text: "\u7A00\u6709" };
        return { key: "common", text: "\u666E\u901A" };
      };
      const formatTime = (ts) => {
        try {
          return new Date(ts).toLocaleString();
        } catch (e) {
          return "" + ts;
        }
      };
      const load = async () => {
        refreshBtn.disabled = true;
        refreshBtn.innerHTML = '<span data-ico="refresh"></span>\u5237\u65B0\u4E2D\u2026';
        mountIcons(refreshBtn);
        await bar.update();
        list.innerHTML = "";
        for (let i = 0; i < 3; i++) list.appendChild(html('<div class="skeleton"></div>'));
        try {
          const [data, tpls] = await Promise.all([
            NetworkManager.I.request("/items"),
            NetworkManager.I.request("/items/templates").catch(() => ({ templates: [] }))
          ]);
          const tplById = {};
          for (const t of tpls.templates || []) tplById[t.id] = t;
          list.innerHTML = "";
          if (!data.items.length) {
            list.appendChild(html('<div style="opacity:.8;">\u6682\u65E0\u9053\u5177\uFF0C\u5C1D\u8BD5\u591A\u6316\u77FF\u6216\u63A0\u593A\u4EE5\u83B7\u53D6\u66F4\u591A\u8D44\u6E90</div>'));
          }
          for (const item of data.items) {
            const tpl = tplById[item.templateId];
            const rarity = getRarity(item, tpl);
            const name = tpl && (tpl.name || tpl.id) || item.templateId;
            const row = html(`
            <div class="item-card hover-lift ${rarity.key === "legendary" ? "rarity-outline-legendary" : rarity.key === "epic" ? "rarity-outline-epic" : rarity.key === "rare" ? "rarity-outline-rare" : "rarity-outline-common"}" data-rarity="${rarity.key}">
              <div class="row" style="justify-content:space-between;align-items:flex-start;gap:10px;">
                <div style="display:flex;flex-direction:column;gap:4px;flex:1;min-width:0;">
                  <div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;">
                    <strong style="font-size:15px;white-space:nowrap;display:flex;align-items:center;gap:6px;"><span data-ico="ore"></span>${name}</strong>
                    <span class="badge rarity-${rarity.key}"><i></i>${rarity.text}</span>
                    ${item.isEquipped ? '<span class="pill">\u5DF2\u88C5\u5907</span>' : ""}
                    ${item.isListed ? '<span class="pill">\u6302\u5355\u4E2D</span>' : ""}
                  </div>
                  <div style="opacity:.85;display:flex;flex-wrap:wrap;gap:8px;">
                    <span>\u7B49\u7EA7 Lv.${item.level}</span>
                    <span class="pill">\u5B9E\u4F8B ${item.id}</span>
                    ${(tpl == null ? void 0 : tpl.category) ? `<span class="pill">${tpl.category}</span>` : ""}
                  </div>
                </div>
                <div class="actions">
                  <button class="btn btn-buy" data-act="equip" data-id="${item.id}" ${item.isEquipped ? "disabled" : ""}><span data-ico="shield"></span>\u88C5\u5907</button>
                  <button class="btn btn-primary" data-act="upgrade" data-id="${item.id}"><span data-ico="wrench"></span>\u5347\u7EA7</button>
                  <button class="btn btn-ghost" data-act="toggle" data-id="${item.id}"><span data-ico="list"></span>\u8BE6\u60C5</button>
                </div>
              </div>
              <div class="timeline" id="tl-${item.id}" hidden></div>
            </div>
          `);
            mountIcons(row);
            row.addEventListener("click", async (ev) => {
              const target = ev.target;
              const id = target.getAttribute("data-id");
              const act = target.getAttribute("data-act");
              if (!id || !act) return;
              if (act === "toggle") {
                const box = row.querySelector(`#tl-${id}`);
                if (!box) return;
                if (!box.hasChildNodes()) {
                  box.innerHTML = '<div class="skeleton" style="height:36px;"></div>';
                  box.hidden = false;
                  try {
                    const res = await NetworkManager.I.request(`/items/logs?itemId=${id}`);
                    const logs = Array.isArray(res.logs) ? res.logs : [];
                    box.innerHTML = "";
                    if (!logs.length) {
                      box.innerHTML = '<div style="opacity:.8;">\u6682\u65E0\u5386\u53F2\u6570\u636E</div>';
                    } else {
                      for (const log of logs) {
                        const node = html(`
                        <div class="timeline-item">
                          <div class="dot"></div>
                          <div class="time">${formatTime(log.time)}</div>
                          <div class="desc">${(log.desc || log.type || "").replace(/</g, "&lt;")}</div>
                        </div>
                      `);
                        box.appendChild(node);
                      }
                    }
                  } catch (e) {
                    box.innerHTML = "";
                    box.appendChild(html(`
                    <div class="timeline-item">
                      <div class="dot"></div>
                      <div class="time">\u2014</div>
                      <div class="desc">\u6765\u6E90\u672A\u77E5 \xB7 \u53EF\u901A\u8FC7\u6316\u77FF\u3001\u63A0\u593A\u6216\u4EA4\u6613\u83B7\u53D6</div>
                    </div>
                  `));
                  }
                } else {
                  box.hidden = !box.hidden;
                }
                return;
              }
              try {
                target.disabled = true;
                target.innerHTML = act === "equip" ? '<span data-ico="shield"></span>\u88C5\u5907\u4E2D\u2026' : '<span data-ico="wrench"></span>\u5347\u7EA7\u4E2D\u2026';
                mountIcons(target);
                if (act === "equip") {
                  await NetworkManager.I.request("/items/equip", { method: "POST", body: JSON.stringify({ itemId: id }) });
                  showToast("\u88C5\u5907\u6210\u529F");
                } else if (act === "upgrade") {
                  await NetworkManager.I.request("/items/upgrade", { method: "POST", body: JSON.stringify({ itemId: id }) });
                  showToast("\u5347\u7EA7\u6210\u529F");
                }
                await load();
              } catch (e) {
                showToast((e == null ? void 0 : e.message) || "\u64CD\u4F5C\u5931\u8D25");
              } finally {
                const a = target.getAttribute("data-act");
                if (a === "equip") target.innerHTML = '<span data-ico="shield"></span>\u88C5\u5907';
                else if (a === "upgrade") target.innerHTML = '<span data-ico="wrench"></span>\u5347\u7EA7';
                else target.innerHTML = '<span data-ico="list"></span>\u8BE6\u60C5';
                mountIcons(target);
                target.disabled = false;
              }
            });
            list.appendChild(row);
          }
          tplContainer.innerHTML = "";
          for (const tpl of tpls.templates || []) {
            const row = html(`<div class="list-item"><strong>${tpl.name || tpl.id}</strong> \xB7 ${tpl.category || "\u672A\u77E5\u7C7B\u578B"}</div>`);
            tplContainer.appendChild(row);
          }
        } catch (e) {
          showToast((e == null ? void 0 : e.message) || "\u52A0\u8F7D\u4ED3\u5E93\u5931\u8D25");
        } finally {
          refreshBtn.disabled = false;
          refreshBtn.innerHTML = '<span data-ico="refresh"></span>\u5237\u65B0';
          mountIcons(refreshBtn);
        }
      };
      refreshBtn.onclick = () => load();
      await load();
    }
  };

  // frontend-scripts/scenes/PlunderScene.ts
  var PlunderScene = class {
    constructor() {
      __publicField(this, "resultBox", null);
    }
    mount(root) {
      root.innerHTML = "";
      root.appendChild(renderNav("plunder"));
      const bar = renderResourceBar();
      root.appendChild(bar.root);
      const view = html(`
      <div class="container grid-2" style="color:#fff;">
        <div class="card fade-in">
          <div class="row" style="justify-content:space-between;align-items:center;">
            <h3 style="margin:0;display:flex;align-items:center;gap:8px;"><span data-ico="sword"></span>\u63A0\u593A\u76EE\u6807</h3>
            <button id="refresh" class="btn btn-primary"><span data-ico="refresh"></span>\u5237\u65B0</button>
          </div>
          <div id="list" style="margin-top:12px;display:flex;flex-direction:column;gap:8px;"></div>
          <div id="result" style="margin-top:12px;opacity:.9;font-family:monospace;"></div>
        </div>
      </div>
    `);
      root.appendChild(view);
      const token = NetworkManager.I["token"];
      if (token) RealtimeClient.I.connect(token);
      RealtimeClient.I.on("plunder.attacked", (msg) => {
        showToast(`\u88AB\u63A0\u593A\uFF1A\u6765\u81EA ${msg.attacker}\uFF0C\u635F\u5931 ${msg.loss}`);
        this.log(`\u88AB ${msg.attacker} \u63A0\u593A\uFF0C\u635F\u5931 ${msg.loss}`);
      });
      this.resultBox = qs(view, "#result");
      const list = qs(view, "#list");
      const refreshBtn = qs(view, "#refresh");
      const mountIcons = (rootEl) => {
        rootEl.querySelectorAll("[data-ico]").forEach((el) => {
          const name = el.getAttribute("data-ico");
          try {
            el.appendChild(renderIcon(name, { size: 20 }));
          } catch (e) {
          }
        });
      };
      mountIcons(view);
      const load = async () => {
        refreshBtn.disabled = true;
        refreshBtn.innerHTML = '<span data-ico="refresh"></span>\u5237\u65B0\u4E2D\u2026';
        mountIcons(refreshBtn);
        await bar.update();
        list.innerHTML = "";
        for (let i = 0; i < 3; i++) list.appendChild(html('<div class="skeleton"></div>'));
        try {
          const data = await NetworkManager.I.request("/plunder/targets");
          list.innerHTML = "";
          if (!data.targets.length) {
            list.appendChild(html('<div style="opacity:.8;">\u6682\u65E0\u53EF\u63A0\u593A\u7684\u76EE\u6807\uFF0C\u7A0D\u540E\u518D\u8BD5</div>'));
          }
          for (const target of data.targets) {
            const row = html(`
            <div class="list-item list-item--sell">
              <div style="display:flex;flex-direction:column;gap:2px;">
                <div style="display:flex;align-items:center;gap:6px;"><span data-ico="target"></span><strong>${target.username || target.id}</strong></div>
                <div style="opacity:.85;">\u77FF\u77F3\uFF1A${target.ore} <span class="pill">\u9884\u8BA1\u6536\u76CA 5%~30%</span></div>
              </div>
              <div>
                <button class="btn btn-sell" data-id="${target.id}"><span data-ico="sword"></span>\u63A0\u593A</button>
              </div>
            </div>
          `);
            mountIcons(row);
            row.addEventListener("click", async (ev) => {
              const el = ev.target;
              const id = el.getAttribute("data-id");
              if (!id) return;
              el.disabled = true;
              const original = el.textContent || "";
              el.textContent = "\u63A0\u593A\u4E2D\u2026";
              try {
                const res = await NetworkManager.I.request(`/plunder/${id}`, { method: "POST" });
                if (res.success) {
                  this.log(`\u6210\u529F\u63A0\u593A ${id}\uFF0C\u83B7\u5F97 ${res.loot_amount}`);
                  showToast(`\u63A0\u593A\u6210\u529F\uFF0C\u83B7\u5F97 ${res.loot_amount}`, "success");
                } else {
                  this.log(`\u63A0\u593A ${id} \u5931\u8D25`);
                  showToast("\u63A0\u593A\u5931\u8D25", "warn");
                }
                await bar.update();
              } catch (e) {
                const message = (e == null ? void 0 : e.message) || "\u63A0\u593A\u5931\u8D25";
                this.log(`\u63A0\u593A\u5931\u8D25\uFF1A${message}`);
                if (message.includes("\u51B7\u5374")) {
                  showToast("\u63A0\u593A\u5668\u51B7\u5374\u4E2D\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5", "warn");
                } else {
                  showToast(message, "error");
                }
              } finally {
                el.textContent = original;
                el.disabled = false;
              }
            });
            list.appendChild(row);
          }
        } catch (e) {
          showToast((e == null ? void 0 : e.message) || "\u52A0\u8F7D\u63A0\u593A\u76EE\u6807\u5931\u8D25");
        } finally {
          refreshBtn.disabled = false;
          refreshBtn.innerHTML = '<span data-ico="refresh"></span>\u5237\u65B0';
          mountIcons(refreshBtn);
        }
      };
      refreshBtn.onclick = () => load();
      load();
    }
    log(msg) {
      if (!this.resultBox) return;
      const line = document.createElement("div");
      line.textContent = `[${(/* @__PURE__ */ new Date()).toLocaleTimeString()}] ${msg}`;
      this.resultBox.prepend(line);
    }
  };

  // frontend-scripts/scenes/ExchangeScene.ts
  var ExchangeScene = class {
    constructor() {
      __publicField(this, "refreshTimer", null);
      __publicField(this, "templates", []);
      __publicField(this, "inventory", []);
    }
    async mount(root) {
      this.clearTimer();
      root.innerHTML = "";
      const nav = renderNav("exchange");
      const bar = renderResourceBar();
      const view = html(`
      <div class="container grid-2" style="color:#fff;">
        <div class="card fade-in">
          <h3 style="margin:0 0 12px;display:flex;align-items:center;gap:8px;"><span data-ico="exchange"></span>\u5E02\u573A\u4E0B\u5355</h3>
          <div class="row" style="flex-wrap:wrap;align-items:flex-end;gap:12px;">
            <div style="flex:1;min-width:180px;">
              <label style="display:flex;align-items:center;gap:6px;"><span data-ico="list"></span>\u8D2D\u4E70\u6A21\u677F</label>
              <select id="tpl" class="input"></select>
            </div>
            <div style="flex:1;min-width:120px;">
              <label style="display:flex;align-items:center;gap:6px;"><span data-ico="coin"></span>\u4EF7\u683C (BB\u5E01)</label>
              <input id="price" class="input" type="number" min="1" value="10"/>
            </div>
            <div style="flex:1;min-width:120px;">
              <label>\u8D2D\u4E70\u6570\u91CF</label>
              <input id="amount" class="input" type="number" min="1" value="1"/>
            </div>
            <button id="placeBuy" class="btn btn-buy" style="min-width:120px;"><span data-ico="arrow-right"></span>\u4E0B\u4E70\u5355</button>
          </div>
          <div style="height:8px;"></div>
          <div class="row" style="flex-wrap:wrap;align-items:flex-end;gap:12px;">
            <div style="flex:1;min-width:220px;">
              <label style="display:flex;align-items:center;gap:6px;"><span data-ico="box"></span>\u51FA\u552E\u9053\u5177</label>
              <select id="inst" class="input"></select>
            </div>
            <div style="flex:1;min-width:120px;">
              <label style="display:flex;align-items:center;gap:6px;"><span data-ico="coin"></span>\u4EF7\u683C (BB\u5E01)</label>
              <input id="sprice" class="input" type="number" min="1" value="5"/>
            </div>
            <button id="placeSell" class="btn btn-sell" style="min-width:120px;"><span data-ico="arrow-right"></span>\u4E0B\u5356\u5355</button>
          </div>
          <div id="inventory" style="margin-top:12px;display:flex;flex-wrap:wrap;gap:8px;"></div>
        </div>

        <div class="card fade-in">
          <div class="row" style="justify-content:space-between;align-items:center;gap:12px;">
            <h3 style="margin:0;display:flex;align-items:center;gap:8px;"><span data-ico="list"></span>\u8BA2\u5355\u7C3F</h3>
            <div class="row" style="flex-wrap:wrap;gap:8px;">
              <select id="q_tpl" class="input" style="width:180px;"></select>
              <select id="q_type" class="input" style="width:120px;">
                <option value="buy">\u4E70\u5355</option>
                <option value="sell">\u5356\u5355</option>
              </select>
              <label class="row pill" style="align-items:center;gap:6px;">
                <span data-ico="user"></span>
                <input id="my" type="checkbox"/> \u53EA\u770B\u6211\u7684
              </label>
              <button id="refresh" class="btn btn-primary" style="min-width:96px;"><span data-ico="refresh"></span>\u5237\u65B0</button>
            </div>
          </div>
          <div id="book" style="margin-top:12px;display:flex;flex-direction:column;gap:8px;"></div>
        </div>

        <div class="card fade-in" id="logs" style="opacity:.9;font-family:monospace;min-height:24px;"></div>
      </div>
    `);
      root.appendChild(nav);
      root.appendChild(bar.root);
      root.appendChild(view);
      const token = NetworkManager.I["token"];
      if (token) RealtimeClient.I.connect(token);
      const me = GameManager.I.getProfile();
      const book = qs(view, "#book");
      const logs = qs(view, "#logs");
      const buyTpl = qs(view, "#tpl");
      const buyPrice = qs(view, "#price");
      const buyAmount = qs(view, "#amount");
      const placeBuy = qs(view, "#placeBuy");
      const sellInst = qs(view, "#inst");
      const sellPrice = qs(view, "#sprice");
      const placeSell = qs(view, "#placeSell");
      const invBox = qs(view, "#inventory");
      const queryTpl = qs(view, "#q_tpl");
      const queryType = qs(view, "#q_type");
      const queryMineOnly = qs(view, "#my");
      const mineOnlyLabel = view.querySelector("label.row.pill");
      const refreshBtn = qs(view, "#refresh");
      const mountIcons = (rootEl) => {
        rootEl.querySelectorAll("[data-ico]").forEach((el) => {
          const name = el.getAttribute("data-ico");
          try {
            el.appendChild(renderIcon(name, { size: 20 }));
          } catch (e) {
          }
        });
      };
      mountIcons(view);
      let prevIds = /* @__PURE__ */ new Set();
      let refreshing = false;
      const log = (message) => {
        logs.textContent = message;
      };
      const renderTemplateOptions = () => {
        buyTpl.innerHTML = "";
        queryTpl.innerHTML = "";
        const placeholder = html('<option value="">\u9009\u62E9\u6A21\u677F</option>');
        buyTpl.appendChild(placeholder);
        const qPlaceholder = html('<option value="">\u5168\u90E8\u6A21\u677F</option>');
        queryTpl.appendChild(qPlaceholder);
        for (const tpl of this.templates) {
          const option = document.createElement("option");
          option.value = tpl.id;
          option.textContent = tpl.name ? `${tpl.name} (${tpl.id})` : tpl.id;
          buyTpl.appendChild(option);
          const qOption = option.cloneNode(true);
          queryTpl.appendChild(qOption);
        }
      };
      const renderInventory = () => {
        sellInst.innerHTML = "";
        invBox.innerHTML = "";
        const defaultOption = html('<option value="">\u9009\u62E9\u53EF\u51FA\u552E\u7684\u9053\u5177</option>');
        sellInst.appendChild(defaultOption);
        const available = this.inventory.filter((item) => !item.isEquipped && !item.isListed);
        if (!available.length) {
          invBox.textContent = "\u6682\u65E0\u53EF\u51FA\u552E\u7684\u9053\u5177\uFF08\u9700\u5148\u5728\u4ED3\u5E93\u5378\u4E0B\u88C5\u5907\uFF09";
          return;
        }
        for (const item of available) {
          const option = document.createElement("option");
          option.value = item.id;
          option.textContent = `${item.id} \xB7 ${item.templateId} \xB7 Lv.${item.level}`;
          sellInst.appendChild(option);
          const chip = html(`<button class="btn btn-ghost" style="flex:unset;padding:6px 10px;" data-id="${item.id}">${item.id} (${item.templateId})</button>`);
          chip.onclick = () => {
            sellInst.value = item.id;
            log(`\u5DF2\u9009\u62E9\u51FA\u552E\u9053\u5177 ${item.id}`);
          };
          invBox.appendChild(chip);
        }
      };
      const loadMetadata = async () => {
        try {
          const [tpls, items] = await Promise.all([
            NetworkManager.I.request("/items/templates"),
            NetworkManager.I.request("/items")
          ]);
          this.templates = tpls.templates || [];
          this.inventory = items.items || [];
          renderTemplateOptions();
          renderInventory();
        } catch (e) {
          log((e == null ? void 0 : e.message) || "\u52A0\u8F7D\u6A21\u677F/\u4ED3\u5E93\u5931\u8D25");
        }
      };
      const refresh = async (opts = {}) => {
        if (refreshing) return;
        refreshing = true;
        if (!opts.quiet) {
          refreshBtn.innerHTML = '<span data-ico="refresh"></span>\u5237\u65B0\u4E2D\u2026';
          mountIcons(refreshBtn);
        }
        refreshBtn.disabled = true;
        try {
          const tplId = queryTpl.value;
          const type = queryType.value;
          const mineOnly = queryMineOnly.checked;
          const params = new URLSearchParams();
          params.set("type", type);
          params.set("item_template_id", tplId || "");
          if (!opts.quiet) {
            book.innerHTML = "";
            for (let i = 0; i < 4; i++) book.appendChild(html('<div class="skeleton"></div>'));
          }
          const data = await NetworkManager.I.request(`/exchange/orders?${params.toString()}`);
          const newIds = /* @__PURE__ */ new Set();
          book.innerHTML = "";
          const orders = data.orders || [];
          if (!orders.length) {
            book.appendChild(html('<div style="opacity:.8;text-align:center;">\u6682\u65E0\u8BA2\u5355</div>'));
          }
          for (const order of orders) {
            if (mineOnly && me && order.userId !== me.id) continue;
            newIds.add(order.id);
            const isMine = me && order.userId === me.id;
            const klass = `list-item ${order.type === "buy" ? "list-item--buy" : "list-item--sell"}`;
            const row = html(`
            <div class="${klass}">
              <div style="display:flex;flex-direction:column;gap:2px;">
                <div>
                  <strong>${order.type === "buy" ? "\u4E70\u5165" : "\u5356\u51FA"}</strong>
                  ${order.itemTemplateId || ""}
                  ${isMine ? '<span class="pill">\u6211\u7684</span>' : ""}
                </div>
                <div style="opacity:.85;">
                  \u4EF7\u683C: ${order.price} \xB7 \u6570\u91CF: ${order.amount}
                  ${order.itemInstanceId ? `<span class="pill">${order.itemInstanceId}</span>` : ""}
                  <span class="pill">${order.id}</span>
                </div>
              </div>
              <div>
                ${isMine ? `<button class="btn btn-ghost" data-id="${order.id}"><span data-ico="trash"></span>\u64A4\u5355</button>` : ""}
              </div>
            </div>
          `);
            mountIcons(row);
            if (!prevIds.has(order.id)) row.classList.add("flash");
            row.addEventListener("click", async (ev) => {
              const target = ev.target;
              const id = target.getAttribute("data-id");
              if (!id) return;
              try {
                target.setAttribute("disabled", "true");
                await NetworkManager.I.request(`/exchange/orders/${id}`, { method: "DELETE" });
                showToast("\u64A4\u5355\u6210\u529F", "success");
                await refresh();
              } catch (e) {
                showToast((e == null ? void 0 : e.message) || "\u64A4\u5355\u5931\u8D25", "error");
              } finally {
                target.removeAttribute("disabled");
              }
            });
            book.appendChild(row);
          }
          prevIds = newIds;
          if (!book.childElementCount) {
            book.appendChild(html('<div style="opacity:.8;text-align:center;">\u6682\u65E0\u7B26\u5408\u6761\u4EF6\u7684\u8BA2\u5355</div>'));
          }
        } catch (e) {
          log((e == null ? void 0 : e.message) || "\u5237\u65B0\u8BA2\u5355\u5931\u8D25");
        } finally {
          refreshing = false;
          refreshBtn.disabled = false;
          refreshBtn.innerHTML = '<span data-ico="refresh"></span>\u5237\u65B0';
          mountIcons(refreshBtn);
        }
      };
      placeBuy.onclick = async () => {
        const tplId = buyTpl.value.trim();
        const price = Number(buyPrice.value);
        const amount = Number(buyAmount.value);
        if (!tplId) {
          showToast("\u8BF7\u9009\u62E9\u8D2D\u4E70\u7684\u6A21\u677F", "warn");
          return;
        }
        if (price <= 0 || amount <= 0) {
          showToast("\u8BF7\u8F93\u5165\u6709\u6548\u7684\u4EF7\u683C\u4E0E\u6570\u91CF", "warn");
          return;
        }
        placeBuy.disabled = true;
        placeBuy.textContent = "\u63D0\u4EA4\u4E2D\u2026";
        try {
          const res = await NetworkManager.I.request("/exchange/orders", {
            method: "POST",
            body: JSON.stringify({ type: "buy", item_template_id: tplId, price, amount })
          });
          showToast(`\u4E70\u5355\u5DF2\u63D0\u4EA4 (#${res.id})`, "success");
          log(`\u4E70\u5355\u6210\u529F: ${res.id}`);
          await bar.update();
          await refresh();
        } catch (e) {
          showToast((e == null ? void 0 : e.message) || "\u4E70\u5355\u63D0\u4EA4\u5931\u8D25", "error");
          log((e == null ? void 0 : e.message) || "\u4E70\u5355\u63D0\u4EA4\u5931\u8D25");
        } finally {
          placeBuy.disabled = false;
          placeBuy.textContent = "\u4E0B\u4E70\u5355";
        }
      };
      placeSell.onclick = async () => {
        const instId = sellInst.value.trim();
        const price = Number(sellPrice.value);
        if (!instId) {
          showToast("\u8BF7\u9009\u62E9\u8981\u51FA\u552E\u7684\u9053\u5177", "warn");
          return;
        }
        if (price <= 0) {
          showToast("\u8BF7\u8F93\u5165\u6709\u6548\u7684\u4EF7\u683C", "warn");
          return;
        }
        placeSell.disabled = true;
        placeSell.textContent = "\u63D0\u4EA4\u4E2D\u2026";
        try {
          const res = await NetworkManager.I.request("/exchange/orders", {
            method: "POST",
            body: JSON.stringify({ type: "sell", item_instance_id: instId, price })
          });
          showToast(`\u5356\u5355\u5DF2\u63D0\u4EA4 (#${res.id})`, "success");
          log(`\u5356\u5355\u6210\u529F: ${res.id}`);
          await bar.update();
          await loadMetadata();
          await refresh();
        } catch (e) {
          showToast((e == null ? void 0 : e.message) || "\u5356\u5355\u63D0\u4EA4\u5931\u8D25", "error");
          log((e == null ? void 0 : e.message) || "\u5356\u5355\u63D0\u4EA4\u5931\u8D25");
        } finally {
          placeSell.disabled = false;
          placeSell.textContent = "\u4E0B\u5356\u5355";
        }
      };
      refreshBtn.onclick = () => refresh();
      queryTpl.onchange = () => refresh();
      queryType.onchange = () => refresh();
      queryMineOnly.onchange = () => {
        if (mineOnlyLabel) mineOnlyLabel.classList.toggle("active", queryMineOnly.checked);
        refresh();
      };
      if (mineOnlyLabel) mineOnlyLabel.classList.toggle("active", queryMineOnly.checked);
      await Promise.all([bar.update(), loadMetadata()]);
      await refresh({ quiet: true });
      this.refreshTimer = window.setInterval(() => {
        refresh({ quiet: true }).catch(() => {
        });
      }, 1e4);
    }
    clearTimer() {
      if (this.refreshTimer !== null) {
        window.clearInterval(this.refreshTimer);
        this.refreshTimer = null;
      }
    }
  };

  // frontend-scripts/scenes/RankingScene.ts
  var RankingScene = class {
    mount(root) {
      root.innerHTML = "";
      root.appendChild(renderNav("ranking"));
      const bar = renderResourceBar();
      root.appendChild(bar.root);
      const view = html(`
      <div class="container grid-2" style="color:#fff;">
        <div class="card fade-in">
          <div class="row" style="justify-content:space-between;align-items:center;">
            <h3 style="margin:0;display:flex;align-items:center;gap:8px;"><span data-ico="trophy"></span>\u6392\u884C\u699C</h3>
            <button id="refresh" class="btn btn-primary"><span data-ico="refresh"></span>\u5237\u65B0</button>
          </div>
          <div id="me" style="margin-top:8px;opacity:.95;"></div>
          <div id="list" style="margin-top:12px;display:flex;flex-direction:column;gap:6px;"></div>
        </div>
      </div>
    `);
      root.appendChild(view);
      const token = NetworkManager.I["token"];
      if (token) RealtimeClient.I.connect(token);
      const meBox = qs(view, "#me");
      const list = qs(view, "#list");
      const refreshBtn = qs(view, "#refresh");
      const mountIcons = (rootEl) => {
        rootEl.querySelectorAll("[data-ico]").forEach((el) => {
          const name = el.getAttribute("data-ico");
          try {
            el.appendChild(renderIcon(name, { size: 20 }));
          } catch (e) {
          }
        });
      };
      mountIcons(view);
      const load = async () => {
        refreshBtn.disabled = true;
        refreshBtn.innerHTML = '<span data-ico="refresh"></span>\u5237\u65B0\u4E2D\u2026';
        mountIcons(refreshBtn);
        await bar.update();
        list.innerHTML = "";
        for (let i = 0; i < 3; i++) list.appendChild(html('<div class="skeleton"></div>'));
        try {
          const me = await NetworkManager.I.request("/ranking/me");
          const top = await NetworkManager.I.request("/ranking/top?n=20");
          meBox.textContent = `\u6211\u7684\u540D\u6B21\uFF1A#${me.rank} \xB7 \u603B\u5F97\u5206\uFF1A${me.score}`;
          list.innerHTML = "";
          for (const entry of top.list) {
            const medal = entry.rank === 1 ? "\u{1F947}" : entry.rank === 2 ? "\u{1F948}" : entry.rank === 3 ? "\u{1F949}" : "";
            const cls = entry.rank <= 3 ? " list-item--buy" : "";
            const row = html(`
            <div class="list-item${cls}">
              <span>${medal} #${entry.rank}</span>
              <span style="flex:1;opacity:.9;margin-left:12px;display:flex;align-items:center;gap:6px;"><span data-ico="user"></span>${entry.userId}</span>
              <strong>${entry.score}</strong>
            </div>
          `);
            mountIcons(row);
            list.appendChild(row);
          }
        } catch (e) {
          meBox.textContent = (e == null ? void 0 : e.message) || "\u6392\u884C\u699C\u52A0\u8F7D\u5931\u8D25";
        } finally {
          refreshBtn.disabled = false;
          refreshBtn.innerHTML = '<span data-ico="refresh"></span>\u5237\u65B0';
          mountIcons(refreshBtn);
        }
      };
      refreshBtn.onclick = () => load();
      load();
    }
  };

  // frontend-scripts/styles/inject.ts
  var injected = false;
  function ensureGlobalStyles() {
    if (injected) return;
    const css = `:root{--bg:#0b1020;--bg-2:#0f1530;--fg:#fff;--muted:rgba(255,255,255,.75);--grad:linear-gradient(135deg,#7B2CF5,#2C89F5);--panel-grad:linear-gradient(135deg,rgba(123,44,245,.25),rgba(44,137,245,.25));--glass:blur(10px);--glow:0 8px 20px rgba(0,0,0,.35),0 0 12px rgba(123,44,245,.7);--radius-sm:10px;--radius-md:12px;--radius-lg:16px;--ease:cubic-bezier(.22,.61,.36,1);--dur:.28s;--buy:#2C89F5;--sell:#E36414;--ok:#2ec27e;--warn:#f6c445;--danger:#ff5c5c;--rarity-common:#9aa0a6;--rarity-rare:#4fd4f5;--rarity-epic:#b26bff;--rarity-legendary:#f6c445;--container-max:720px}
html,body{background:radial-gradient(1200px 600px at 50% -10%, rgba(123,44,245,.12), transparent),var(--bg);color:var(--fg);font-family:system-ui,-apple-system,"Segoe UI","PingFang SC","Microsoft YaHei",Arial,sans-serif}
html{color-scheme:dark}
.container{padding:0 12px}
.container{max-width:var(--container-max);margin:12px auto}
.card{position:relative;border-radius:var(--radius-lg);background:var(--panel-grad);backdrop-filter:var(--glass);box-shadow:var(--glow);padding:12px;overflow:hidden}
/* neon corners + sheen */
.card::before{content:"";position:absolute;inset:0;border-radius:inherit;background:radial-gradient(40% 25% at 100% 0, rgba(123,44,245,.18), transparent 60%),radial-gradient(35% 25% at 0 100%, rgba(44,137,245,.16), transparent 60%);pointer-events:none}
.card::after{content:"";position:absolute;left:-30%;top:-120%;width:60%;height:300%;background:linear-gradient(120deg,transparent,rgba(255,255,255,.18),transparent);transform:rotate(8deg);opacity:.25;animation:card-sheen 9s linear infinite}
@keyframes card-sheen{0%{transform:translateX(0) rotate(8deg)}100%{transform:translateX(160%) rotate(8deg)}}
.row{display:flex;gap:8px;align-items:center}
.card input,.card button{box-sizing:border-box;outline:none}
.card input{background:rgba(255,255,255,.08);border:0;border-radius:var(--radius-md);color:var(--fg);padding:10px;margin:8px 0;appearance:none;-webkit-appearance:none;background-clip:padding-box;pointer-events:auto;touch-action:manipulation}
.card select.input, select.input{background:rgba(255,255,255,.08);color:var(--fg);border:0;border-radius:var(--radius-md);padding:10px;margin:8px 0;appearance:none;-webkit-appearance:none;background-clip:padding-box}
.card select.input option, select.input option{background:#0b1020;color:#fff}
.card select.input:focus, select.input:focus{outline:2px solid rgba(123,44,245,.45)}
.card button{width:100%;border-radius:var(--radius-md)}
.btn{position:relative;overflow:hidden;padding:10px 14px;border:0;border-radius:var(--radius-md);color:#fff;transition:transform var(--dur) var(--ease),box-shadow var(--dur) var(--ease),filter var(--dur) var(--ease)}
.btn .icon{margin-right:6px}
.btn:active{transform:translateY(1px) scale(.99)}
.btn::after{content:"";position:absolute;inset:0;opacity:0;background:linear-gradient(115deg,transparent,rgba(255,255,255,.25),transparent 55%);transform:translateX(-60%);transition:opacity var(--dur) var(--ease), transform var(--dur) var(--ease)}
.btn:hover::after{opacity:.9;transform:translateX(0)}
.btn:hover{filter:saturate(110%)}
.btn-primary{background:var(--grad);box-shadow:var(--glow)}
.btn-energy{position:relative;animation:btn-pulse 2s ease-in-out infinite}
.btn-energy::before{content:"";position:absolute;inset:-2px;border-radius:inherit;background:linear-gradient(135deg,rgba(123,44,245,.6),rgba(44,137,245,.6));filter:blur(8px);z-index:-1;opacity:.6;animation:energy-ring 2s ease-in-out infinite}
@keyframes btn-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.02)}}
@keyframes energy-ring{0%,100%{opacity:.4;filter:blur(8px)}50%{opacity:.8;filter:blur(12px)}}
.btn-buy{background:var(--buy)}
.btn-sell{background:var(--sell)}
.btn-ghost{background:rgba(255,255,255,.08)}
.input{width:100%;padding:10px;border:0;border-radius:var(--radius-md);background:rgba(255,255,255,.08);color:var(--fg);pointer-events:auto;touch-action:manipulation;user-select:text;-webkit-user-select:text}
.pill{padding:2px 8px;border-radius:999px;background:rgba(255,255,255,.08);font-size:12px;cursor:pointer;transition:background .3s ease}
.pill.pill-running{animation:pill-breathe 2s ease-in-out infinite}
@keyframes pill-breathe{0%,100%{background:rgba(46,194,126,.25);box-shadow:0 0 8px rgba(46,194,126,.3)}50%{background:rgba(46,194,126,.35);box-shadow:0 0 12px rgba(46,194,126,.5)}}
.pill.pill-collapsed{animation:pill-alert 1s ease-in-out infinite}
@keyframes pill-alert{0%,100%{background:rgba(255,92,92,.25);box-shadow:0 0 8px rgba(255,92,92,.3)}50%{background:rgba(255,92,92,.45);box-shadow:0 0 16px rgba(255,92,92,.6)}}
.pill.active{background:linear-gradient(135deg, rgba(123,44,245,.35), rgba(44,137,245,.28));box-shadow:var(--glow)}
.scene-header{display:flex;justify-content:space-between;align-items:flex-end;gap:12px;margin-bottom:8px}
.scene-header h1{margin:0;font-size:20px}
.scene-header p{margin:0;opacity:.85}
.stats{display:flex;gap:10px}
.stat{flex:1;min-width:0;background:linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.03));border-radius:12px;padding:10px;display:flex;align-items:center;gap:10px}
.stat .ico{font-size:18px;filter:drop-shadow(0 0 8px rgba(123,44,245,.35));transition:transform .3s ease}
.pulse-icon{animation:icon-pulse .6s ease}
@keyframes icon-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.3) rotate(5deg)}}
.stat .val{font-weight:700;font-size:16px}
.stat .label{opacity:.85;font-size:12px}
.event-feed{max-height:240px;overflow:auto;display:flex;flex-direction:column;gap:6px}
.event-feed .event{opacity:.9;font-family:monospace;font-size:12px}
.main-screen{position:relative;padding:12px 0 36px;min-height:100vh}
.main-stack{display:flex;flex-direction:column;gap:16px}
.mine-card{min-height:calc(100vh - 160px);padding:24px 20px;display:flex;flex-direction:column;gap:20px;border-radius:20px}
@media (min-width:580px){.mine-card{min-height:620px;padding:28px 26px}}
.mine-header{display:flex;align-items:center;justify-content:space-between;gap:12px}
.mine-title{display:flex;align-items:center;gap:10px;font-size:18px;font-weight:600;letter-spacing:.04em;text-shadow:0 2px 12px rgba(18,10,48,.6)}
.mine-title .icon{filter:drop-shadow(0 0 12px rgba(124,60,255,.55))}
.mine-chips{display:flex;align-items:center;gap:8px}
.mine-chips .pill{display:flex;align-items:center;gap:6px;font-size:12px;background:rgba(15,24,56,.55);box-shadow:inset 0 0 0 1px rgba(123,44,245,.25)}
.mine-grid{display:grid;gap:18px}
@media (min-width:640px){.mine-grid{grid-template-columns:220px 1fr;align-items:center}}
.mine-gauge{position:relative;display:flex;align-items:center;justify-content:center;padding:8px 0}
.mine-gauge .ring{width:200px;height:200px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:conic-gradient(#7B2CF5 0deg,rgba(255,255,255,.08) 0deg);box-shadow:inset 0 0 30px rgba(123,44,245,.28),0 24px 48px rgba(12,8,42,.55)}
.mine-gauge .ring::before{content:"";position:absolute;inset:18%;border-radius:50%;background:radial-gradient(circle at 50% 28%,rgba(123,44,245,.45),rgba(12,20,46,.92) 70%);box-shadow:inset 0 14px 28px rgba(0,0,0,.48)}
.mine-gauge .ring-core{position:relative;display:flex;flex-direction:column;align-items:center;gap:4px;font-weight:600}
.mine-gauge .ring-core span{font-size:22px}
.mine-gauge .ring-core small{font-size:12px;letter-spacing:.12em;opacity:.75;text-transform:uppercase}
.ring-glow{position:absolute;width:200px;height:200px;border-radius:50%;filter:blur(32px);background:radial-gradient(circle,rgba(123,44,245,.48),rgba(44,137,245,.1));opacity:.6;animation:mine-glow 9s ease-in-out infinite}
.ring-glow-b{animation-delay:-4.5s;background:radial-gradient(circle,rgba(44,137,245,.45),transparent 65%)}
.ring-pulse{animation:ring-flash .6s ease!important}
@keyframes ring-flash{0%,100%{box-shadow:inset 0 0 30px rgba(123,44,245,.28),0 24px 48px rgba(12,8,42,.55)}50%{box-shadow:inset 0 0 50px rgba(246,196,69,.8),0 24px 68px rgba(246,196,69,.5),0 0 80px rgba(246,196,69,.4)}}
.ring-full{animation:ring-glow-full 2s ease-in-out infinite!important}
@keyframes ring-glow-full{0%,100%{box-shadow:inset 0 0 40px rgba(246,196,69,.5),0 24px 48px rgba(246,196,69,.35),0 0 60px rgba(246,196,69,.3)}50%{box-shadow:inset 0 0 60px rgba(246,196,69,.7),0 24px 68px rgba(246,196,69,.5),0 0 80px rgba(246,196,69,.5)}}
.milestone-pulse{animation:milestone-ring 1s ease}
@keyframes milestone-ring{0%{transform:scale(1)}30%{transform:scale(1.08)}60%{transform:scale(.98)}100%{transform:scale(1)}}
@keyframes mine-glow{0%,100%{transform:scale(.92);opacity:.45}50%{transform:scale(1.05);opacity:.8}}
.mine-progress{display:flex;flex-direction:column;gap:14px}
.mine-progress-meta{display:flex;align-items:flex-end;justify-content:space-between;font-size:14px;letter-spacing:.02em}
.mine-progress-track{position:relative;height:12px;border-radius:999px;background:rgba(255,255,255,.1);overflow:hidden;box-shadow:inset 0 0 14px rgba(123,44,245,.28)}
.mine-progress-fill{height:100%;width:0;background:linear-gradient(90deg,#7B2CF5,#2C89F5);box-shadow:0 0 16px rgba(123,44,245,.65);transition:width .35s var(--ease);position:relative;overflow:hidden}
.mine-progress-fill::after{content:"";position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent);animation:progress-wave 2s linear infinite}
@keyframes progress-wave{0%{left:-100%}100%{left:200%}}
.mine-status{min-height:22px;font-size:13px;opacity:.9}
.mine-actions-grid{display:grid;gap:12px;grid-template-columns:repeat(2,minmax(0,1fr))}
.mine-actions-grid .btn{height:48px;display:flex;align-items:center;justify-content:center;font-size:15px;gap:8px}
.mine-actions-grid .span-2{grid-column:span 2}
@media (min-width:680px){.mine-actions-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.mine-actions-grid .span-2{grid-column:span 3}}
.mine-feed{position:relative;border-radius:16px;background:rgba(12,20,44,.55);padding:14px 12px;box-shadow:inset 0 0 24px rgba(123,44,245,.12);backdrop-filter:blur(12px)}
.mine-feed::before{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(135deg,rgba(123,44,245,.16),rgba(44,137,245,.14) 60%,transparent);opacity:.75}
.mine-feed .event-feed{max-height:180px}
.event{transition:opacity .3s ease, transform .3s ease}
.event-critical{color:#f6c445;font-weight:600}
.event-warning{color:#ff5c5c}
.event-success{color:#2ec27e}
.event-normal{color:rgba(255,255,255,.9)}
.mine-hologram{position:relative;flex:1;min-height:180px;border-radius:18px;background:radial-gradient(90% 120% at 50% 100%,rgba(44,137,245,.35),rgba(8,12,30,.3) 55%,transparent);overflow:hidden;margin-top:auto;display:flex;align-items:center;justify-content:center;isolation:isolate;transition:background .5s ease}
.holo-idle{background:radial-gradient(90% 120% at 50% 100%,rgba(123,44,245,.25),rgba(8,12,30,.3) 55%,transparent)}
.holo-mining{background:radial-gradient(90% 120% at 50% 100%,rgba(44,137,245,.45),rgba(8,12,30,.3) 55%,transparent)}
.holo-mining .mine-holo-grid{animation-duration:12s!important}
.holo-collapsed{background:radial-gradient(90% 120% at 50% 100%,rgba(255,92,92,.35),rgba(8,12,30,.3) 55%,transparent);animation:holo-glitch .5s ease infinite}
@keyframes holo-glitch{0%,100%{transform:translateX(0)}25%{transform:translateX(-2px)}75%{transform:translateX(2px)}}
.critical-flash{animation:critical-burst .4s ease}
@keyframes critical-burst{0%{background:radial-gradient(90% 120% at 50% 100%,rgba(44,137,245,.35),rgba(8,12,30,.3) 55%,transparent)}50%{background:radial-gradient(90% 120% at 50% 100%,rgba(246,196,69,.65),rgba(246,196,69,.2) 55%,transparent)}100%{background:radial-gradient(90% 120% at 50% 100%,rgba(44,137,245,.35),rgba(8,12,30,.3) 55%,transparent)}}
.mine-holo-grid{position:absolute;width:140%;height:140%;background:repeating-linear-gradient(0deg,rgba(255,255,255,.08) 0,rgba(255,255,255,.08) 1px,transparent 1px,transparent 28px),repeating-linear-gradient(90deg,rgba(255,255,255,.05) 0,rgba(255,255,255,.05) 1px,transparent 1px,transparent 26px);opacity:.22;transform:translate3d(-10%,0,0) rotate(8deg);animation:holo-pan 16s linear infinite}
.mine-holo-grid.diagonal{opacity:.18;transform:translate3d(10%,0,0) rotate(-16deg);animation-duration:22s}
@keyframes holo-pan{0%{transform:translate3d(-12%,0,0) rotate(8deg)}100%{transform:translate3d(12%,0,0) rotate(8deg)}}
.mine-holo-glow{position:absolute;width:70%;height:70%;border-radius:50%;background:radial-gradient(circle at 50% 40%,rgba(123,44,245,.55),transparent 70%);filter:blur(32px);opacity:.55;animation:holo-breathe 10s ease-in-out infinite}
@keyframes holo-breathe{0%,100%{transform:scale(.9);opacity:.45}50%{transform:scale(1.08);opacity:.85}}
.mine-shard{position:absolute;width:120px;height:120px;background:conic-gradient(from 150deg,rgba(123,44,245,.8),rgba(44,137,245,.38),rgba(123,44,245,.08));clip-path:polygon(50% 0,88% 40%,70% 100%,30% 100%,12% 40%);opacity:.26;filter:blur(.4px);animation:shard-float 8s ease-in-out infinite}
.mine-shard.shard-1{top:18%;left:16%;animation-delay:-1.4s}
.mine-shard.shard-2{bottom:16%;right:22%;animation-delay:-3.2s;transform:scale(.74)}
.mine-shard.shard-3{top:26%;right:34%;animation-delay:-5.1s;transform:scale(.5) rotate(12deg)}
@keyframes shard-float{0%,100%{transform:translateY(-10px) scale(1);opacity:.2}50%{transform:translateY(10px) scale(1.05);opacity:.4}}
.main-ambient{position:absolute;inset:0;z-index:-1;pointer-events:none;overflow:hidden}
.main-ambient .ambient.orb{position:absolute;width:420px;height:420px;border-radius:50%;filter:blur(120px);opacity:.42;animation:ambient-drift 26s ease-in-out infinite}
.main-ambient .orb-a{background:radial-gradient(circle,rgba(123,44,245,.6),transparent 70%);top:-140px;right:-120px}
.main-ambient .orb-b{background:radial-gradient(circle,rgba(44,137,245,.55),transparent 70%);bottom:-180px;left:-180px;animation-delay:-13s}
.main-ambient .grid{position:absolute;inset:0;background:radial-gradient(70% 60% at 50% 100%,rgba(255,255,255,.08),transparent 75%);opacity:.35;mix-blend-mode:screen;animation:ambient-pulse 18s ease-in-out infinite}
@keyframes ambient-drift{0%,100%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(8%, -4%,0) scale(1.05)}}
@keyframes ambient-pulse{0%,100%{opacity:.25}50%{opacity:.45}}
.fade-in{animation:fade-in .3s var(--ease)}
@keyframes fade-in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
.flash{animation:flash .9s ease}
@keyframes flash{0%{box-shadow:0 0 0 rgba(255,255,255,0)}40%{box-shadow:0 0 0 6px rgba(255,255,255,.15)}100%{box-shadow:0 0 0 rgba(255,255,255,0)}}
.skeleton{position:relative;overflow:hidden;background:rgba(255,255,255,.08);border-radius:var(--radius-md);height:44px}
.skeleton::after{content:"";position:absolute;inset:0;transform:translateX(-100%);background:linear-gradient(90deg,transparent,rgba(255,255,255,.12),transparent);animation:shimmer 1.2s infinite}
@keyframes shimmer{100%{transform:translateX(100%)}}
.list-item{display:flex;gap:8px;align-items:center;justify-content:space-between;background:rgba(255,255,255,.06);border-radius:var(--radius-md);padding:10px}
.list-item--buy{border-left:3px solid var(--buy)}
.list-item--sell{border-left:3px solid var(--sell)}
.nav{max-width:var(--container-max);margin:12px auto 0;display:flex;gap:8px;flex-wrap:wrap;position:sticky;top:0;z-index:40;padding:6px;border-radius:14px;background:linear-gradient(180deg,rgba(20,20,40,.45),rgba(20,20,40,.25));backdrop-filter:blur(10px) saturate(125%);border:1px solid rgba(255,255,255,.06)}
.nav a{flex:1;display:flex;justify-content:center;align-items:center;gap:6px;text-align:center;padding:10px;border-radius:999px;text-decoration:none;color:#fff;transition:background var(--dur) var(--ease), transform var(--dur) var(--ease)}
.nav a .ico{opacity:.95}
.nav a.active{background:var(--grad);box-shadow:var(--glow)}
.nav a:not(.active):hover{background:rgba(255,255,255,.06)}
/* generic icon */
.icon{display:inline-block;line-height:0;vertical-align:middle}
.icon svg{display:block;filter:drop-shadow(0 0 8px rgba(123,44,245,.35))}
/* rarity badges */
.badge{display:inline-flex;align-items:center;gap:6px;padding:2px 8px;border-radius:999px;font-size:12px;line-height:1;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.06)}
.badge i{display:inline-block;width:8px;height:8px;border-radius:999px}
.badge.rarity-common i{background:var(--rarity-common)}
.badge.rarity-rare i{background:var(--rarity-rare)}
.badge.rarity-epic i{background:var(--rarity-epic)}
.badge.rarity-legendary i{background:var(--rarity-legendary)}
.rarity-outline-common{box-shadow:0 0 0 1px rgba(154,160,166,.35) inset, 0 0 24px rgba(154,160,166,.15)}
.rarity-outline-rare{box-shadow:0 0 0 1px rgba(79,212,245,.45) inset, 0 0 28px rgba(79,212,245,.25)}
.rarity-outline-epic{box-shadow:0 0 0 1px rgba(178,107,255,.5) inset, 0 0 32px rgba(178,107,255,.3)}
.rarity-outline-legendary{box-shadow:0 0 0 1px rgba(246,196,69,.6) inset, 0 0 36px rgba(246,196,69,.35)}
/* aura card wrapper */
.item-card{position:relative;border-radius:var(--radius-md);padding:10px;background:linear-gradient(140deg,rgba(255,255,255,.06),rgba(255,255,255,.04));overflow:hidden}
.item-card::before{content:"";position:absolute;inset:-1px;border-radius:inherit;padding:1px;background:linear-gradient(135deg,rgba(255,255,255,.18),rgba(255,255,255,.02));-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude}
.item-card[data-rarity="common"]{border:1px solid rgba(154,160,166,.25)}
.item-card[data-rarity="rare"]{border:1px solid rgba(79,212,245,.35)}
.item-card[data-rarity="epic"]{border:1px solid rgba(178,107,255,.4)}
.item-card[data-rarity="legendary"]{border:1px solid rgba(246,196,69,.45)}
/* vertical timeline */
.timeline{position:relative;margin-top:8px;padding-left:16px}
.timeline::before{content:"";position:absolute;left:6px;top:0;bottom:0;width:2px;background:rgba(255,255,255,.1)}
.timeline-item{position:relative;margin:8px 0 8px 0}
.timeline-item .dot{position:absolute;left:-12px;top:2px;width:10px;height:10px;border-radius:999px;background:var(--rarity-rare);box-shadow:0 0 10px rgba(79,212,245,.5)}
.timeline-item .time{opacity:.75;font-size:12px}
.timeline-item .desc{margin-top:2px}
/* action buttons line */
.actions{display:flex;gap:6px;flex-wrap:wrap}
/* subtle hover */
.hover-lift{transition:transform var(--dur) var(--ease), box-shadow var(--dur) var(--ease)}
.hover-lift:hover{transform:translateY(-1px)}
/* ring meter */
.ring{--size:116px;--thick:10px;position:relative;width:var(--size);height:var(--size);border-radius:50%;background:conic-gradient(#7B2CF5 0deg, rgba(255,255,255,.08) 0deg)}
.ring::after{content:"";position:absolute;inset:calc(var(--thick));border-radius:inherit;background:linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.02))}
.ring .label{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-weight:700}
/* toast */
.toast-wrap{position:fixed;right:16px;bottom:16px;display:flex;flex-direction:column;gap:8px;z-index:9999}
.toast{max-width:340px;padding:10px 12px;border-radius:12px;color:#fff;background:rgba(30,30,50,.96);box-shadow:var(--glow);position:relative;overflow:hidden}
.toast.success{background:linear-gradient(180deg,rgba(46,194,126,.16),rgba(30,30,50,.96))}
.toast.warn{background:linear-gradient(180deg,rgba(246,196,69,.18),rgba(30,30,50,.96))}
.toast.error{background:linear-gradient(180deg,rgba(255,92,92,.18),rgba(30,30,50,.96))}
.toast .life{position:absolute;left:0;bottom:0;height:2px;background:#7B2CF5;animation:toast-life var(--life,3.5s) linear forwards}
@keyframes toast-life{from{width:100%}to{width:0}}
@media (prefers-reduced-motion:reduce){*{animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:0ms!important}}

/* responsive width + desktop grid layout for fullness */
@media (min-width:900px){:root{--container-max:920px}}
@media (min-width:1200px){:root{--container-max:1080px}}

.container.grid-2{display:grid;grid-template-columns:1fr;gap:12px}
@media (min-width:980px){
  .container.grid-2{grid-template-columns:1fr 1fr;align-items:start}
  .container.grid-2>.card:first-child{grid-column:1/-1}
}

/* decorative page overlays: aurora, grid lines, bottom glow */
html::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:-2;opacity:.035;background-image:linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px);background-size:24px 24px}
body::before{content:"";position:fixed;right:-10vw;top:-18vh;width:70vw;height:70vh;pointer-events:none;z-index:-1;filter:blur(50px);opacity:.55;background:radial-gradient(closest-side at 25% 40%, rgba(123,44,245,.35), transparent 65%), radial-gradient(closest-side at 70% 60%, rgba(44,137,245,.25), transparent 70%);mix-blend-mode:screen;animation:aurora-a 18s ease-in-out infinite alternate}
body::after{content:"";position:fixed;left:-10vw;bottom:-22vh;width:120vw;height:60vh;pointer-events:none;z-index:-1;filter:blur(60px);opacity:.75;background:radial-gradient(120vw 60vh at 50% 100%, rgba(44,137,245,.22), transparent 65%), conic-gradient(from 200deg at 50% 75%, rgba(123,44,245,.18), rgba(44,137,245,.12), transparent 70%);mix-blend-mode:screen;animation:aurora-b 22s ease-in-out infinite alternate}
@keyframes aurora-a{0%{transform:translateY(0)}100%{transform:translateY(14px)}}
@keyframes aurora-b{0%{transform:translateY(0)}100%{transform:translateY(-12px)}}
`;
    const style = document.createElement("style");
    style.setAttribute("data-ui", "miner-game");
    style.textContent = css;
    document.head.appendChild(style);
    injected = true;
    try {
      const exists = document.querySelector("[data-stars]");
      if (!exists) {
        const cvs = document.createElement("canvas");
        cvs.setAttribute("data-stars", "");
        cvs.style.cssText = "position:fixed;inset:0;z-index:-2;opacity:.40;pointer-events:none;";
        document.body.appendChild(cvs);
        const ctx = cvs.getContext("2d");
        const stars = Array.from({ length: 80 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.2 + 0.2, s: Math.random() * 0.8 + 0.2 }));
        const meteors = [];
        const spawnMeteor = () => {
          const x = Math.random() * cvs.width * 0.6 + cvs.width * 0.2;
          const y = -20;
          const speed = 3 + Math.random() * 3;
          const angle = Math.PI * 0.8 + Math.random() * 0.2;
          meteors.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 0, ttl: 1200 + Math.random() * 800 });
        };
        const orbs = Array.from({ length: 2 }, () => ({ x: Math.random(), y: Math.random() * 0.5 + 0.1, r: Math.random() * 80 + 70, hue: Math.random() }));
        const fit = () => {
          cvs.width = window.innerWidth;
          cvs.height = window.innerHeight;
        };
        fit();
        window.addEventListener("resize", fit);
        let t = 0;
        const loop = () => {
          if (!ctx) return;
          t += 0.016;
          ctx.clearRect(0, 0, cvs.width, cvs.height);
          for (const ob of orbs) {
            const x = ob.x * cvs.width, y = ob.y * cvs.height;
            const pulse = (Math.sin(t * 0.6 + x * 15e-4) * 0.5 + 0.5) * 0.12;
            const rad = ob.r * (1 + pulse);
            const grad2 = ctx.createRadialGradient(x, y, 0, x, y, rad);
            grad2.addColorStop(0, "rgba(110,80,255,0.10)");
            grad2.addColorStop(1, "rgba(0,0,0,0)");
            ctx.fillStyle = grad2;
            ctx.beginPath();
            ctx.arc(x, y, rad, 0, Math.PI * 2);
            ctx.fill();
          }
          for (const st of stars) {
            const x = st.x * cvs.width, y = st.y * cvs.height;
            const tw = (Math.sin(t * 1.6 + x * 2e-3 + y * 3e-3) * 0.5 + 0.5) * 0.5 + 0.5;
            ctx.beginPath();
            ctx.arc(x, y, st.r + tw * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(180,200,255,0.6)";
            ctx.fill();
          }
          if (Math.random() < 0.015 && meteors.length < 2) spawnMeteor();
          for (let i = meteors.length - 1; i >= 0; i--) {
            const m = meteors[i];
            m.x += m.vx;
            m.y += m.vy;
            m.life += 16;
            const trail = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * 8, m.y - m.vy * 8);
            trail.addColorStop(0, "rgba(255,255,255,0.9)");
            trail.addColorStop(1, "rgba(150,180,255,0)");
            ctx.strokeStyle = trail;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(m.x - m.vx * 10, m.y - m.vy * 10);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
            if (m.y > cvs.height + 40 || m.x < -40 || m.x > cvs.width + 40 || m.life > m.ttl) {
              meteors.splice(i, 1);
            }
          }
          requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
      }
    } catch (e) {
    }
  }

  // frontend-scripts/App.ts
  function routeTo(container) {
    const h = location.hash || "#/login";
    const scene = h.split("?")[0];
    switch (scene) {
      case "#/main":
        new MainScene().mount(container);
        break;
      case "#/warehouse":
        new WarehouseScene().mount(container);
        break;
      case "#/plunder":
        new PlunderScene().mount(container);
        break;
      case "#/exchange":
        new ExchangeScene().mount(container);
        break;
      case "#/ranking":
        new RankingScene().mount(container);
        break;
      default:
        new LoginScene().mount(container);
    }
  }
  async function bootstrap(container) {
    ensureGlobalStyles();
    requestAnimationFrame(() => {
      routeTo(container);
    });
    window.onhashchange = () => routeTo(container);
  }
  if (typeof window !== "undefined") {
    window.MinerApp = { bootstrap, GameManager };
  }
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vZnJvbnRlbmQtc2NyaXB0cy9jb3JlL05ldHdvcmtNYW5hZ2VyLnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvY29yZS9HYW1lTWFuYWdlci50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL3V0aWxzL2RvbS50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvbXBvbmVudHMvSWNvbi50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvbXBvbmVudHMvVG9hc3QudHMiLCAiLi4vZnJvbnRlbmQtc2NyaXB0cy9zY2VuZXMvTG9naW5TY2VuZS50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvcmUvRW52LnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvY29yZS9SZWFsdGltZUNsaWVudC50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvbXBvbmVudHMvTmF2LnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvY29tcG9uZW50cy9Db3VudFVwVGV4dC50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvbXBvbmVudHMvUmVzb3VyY2VCYXIudHMiLCAiLi4vZnJvbnRlbmQtc2NyaXB0cy9zY2VuZXMvTWFpblNjZW5lLnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvc2NlbmVzL1dhcmVob3VzZVNjZW5lLnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvc2NlbmVzL1BsdW5kZXJTY2VuZS50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL3NjZW5lcy9FeGNoYW5nZVNjZW5lLnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvc2NlbmVzL1JhbmtpbmdTY2VuZS50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL3N0eWxlcy9pbmplY3QudHMiLCAiLi4vZnJvbnRlbmQtc2NyaXB0cy9BcHAudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImV4cG9ydCBjbGFzcyBOZXR3b3JrTWFuYWdlciB7XHJcbiAgcHJpdmF0ZSBzdGF0aWMgX2luc3RhbmNlOiBOZXR3b3JrTWFuYWdlcjtcclxuICBzdGF0aWMgZ2V0IEkoKTogTmV0d29ya01hbmFnZXIgeyByZXR1cm4gdGhpcy5faW5zdGFuY2UgPz8gKHRoaXMuX2luc3RhbmNlID0gbmV3IE5ldHdvcmtNYW5hZ2VyKCkpOyB9XHJcblxyXG4gIHByaXZhdGUgdG9rZW46IHN0cmluZyB8IG51bGwgPSBudWxsO1xyXG4gIHNldFRva2VuKHQ6IHN0cmluZyB8IG51bGwpIHsgdGhpcy50b2tlbiA9IHQ7IH1cclxuXHJcbiAgYXN5bmMgcmVxdWVzdDxUPihwYXRoOiBzdHJpbmcsIGluaXQ/OiBSZXF1ZXN0SW5pdCk6IFByb21pc2U8VD4ge1xyXG4gICAgY29uc3QgaGVhZGVyczogYW55ID0geyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLCAuLi4oaW5pdD8uaGVhZGVycyB8fCB7fSkgfTtcclxuICAgIGlmICh0aGlzLnRva2VuKSBoZWFkZXJzWydBdXRob3JpemF0aW9uJ10gPSBgQmVhcmVyICR7dGhpcy50b2tlbn1gO1xyXG4gICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2godGhpcy5nZXRCYXNlKCkgKyBwYXRoLCB7IC4uLmluaXQsIGhlYWRlcnMgfSk7XHJcbiAgICBjb25zdCBqc29uID0gYXdhaXQgcmVzLmpzb24oKTtcclxuICAgIGlmICghcmVzLm9rIHx8IGpzb24uY29kZSA+PSA0MDApIHRocm93IG5ldyBFcnJvcihqc29uLm1lc3NhZ2UgfHwgJ1JlcXVlc3QgRXJyb3InKTtcclxuICAgIHJldHVybiBqc29uLmRhdGEgYXMgVDtcclxuICB9XHJcblxyXG4gIGdldEJhc2UoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiAod2luZG93IGFzIGFueSkuX19BUElfQkFTRV9fIHx8ICdodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpJztcclxuICB9XHJcbn1cclxuXHJcblxyXG4iLCAiaW1wb3J0IHsgTmV0d29ya01hbmFnZXIgfSBmcm9tICcuL05ldHdvcmtNYW5hZ2VyJztcclxuXHJcbmV4cG9ydCB0eXBlIFByb2ZpbGUgPSB7IGlkOiBzdHJpbmc7IHVzZXJuYW1lOiBzdHJpbmc7IG5pY2tuYW1lOiBzdHJpbmc7IG9yZUFtb3VudDogbnVtYmVyOyBiYkNvaW5zOiBudW1iZXIgfTtcclxuXHJcbmV4cG9ydCBjbGFzcyBHYW1lTWFuYWdlciB7XHJcbiAgcHJpdmF0ZSBzdGF0aWMgX2luc3RhbmNlOiBHYW1lTWFuYWdlcjtcclxuICBzdGF0aWMgZ2V0IEkoKTogR2FtZU1hbmFnZXIgeyByZXR1cm4gdGhpcy5faW5zdGFuY2UgPz8gKHRoaXMuX2luc3RhbmNlID0gbmV3IEdhbWVNYW5hZ2VyKCkpOyB9XHJcblxyXG4gIHByaXZhdGUgcHJvZmlsZTogUHJvZmlsZSB8IG51bGwgPSBudWxsO1xyXG4gIGdldFByb2ZpbGUoKTogUHJvZmlsZSB8IG51bGwgeyByZXR1cm4gdGhpcy5wcm9maWxlOyB9XHJcblxyXG4gIGFzeW5jIGxvZ2luT3JSZWdpc3Rlcih1c2VybmFtZTogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICBjb25zdCBubSA9IE5ldHdvcmtNYW5hZ2VyLkk7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCByID0gYXdhaXQgbm0ucmVxdWVzdDx7IGFjY2Vzc190b2tlbjogc3RyaW5nOyB1c2VyOiBhbnkgfT4oJy9hdXRoL2xvZ2luJywgeyBtZXRob2Q6ICdQT1NUJywgYm9keTogSlNPTi5zdHJpbmdpZnkoeyB1c2VybmFtZSwgcGFzc3dvcmQgfSkgfSk7XHJcbiAgICAgIG5tLnNldFRva2VuKHIuYWNjZXNzX3Rva2VuKTtcclxuICAgIH0gY2F0Y2gge1xyXG4gICAgICBjb25zdCByID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgYWNjZXNzX3Rva2VuOiBzdHJpbmc7IHVzZXI6IGFueSB9PignL2F1dGgvcmVnaXN0ZXInLCB7IG1ldGhvZDogJ1BPU1QnLCBib2R5OiBKU09OLnN0cmluZ2lmeSh7IHVzZXJuYW1lLCBwYXNzd29yZCB9KSB9KTtcclxuICAgICAgTmV0d29ya01hbmFnZXIuSS5zZXRUb2tlbihyLmFjY2Vzc190b2tlbik7XHJcbiAgICB9XHJcbiAgICB0aGlzLnByb2ZpbGUgPSBhd2FpdCBubS5yZXF1ZXN0PFByb2ZpbGU+KCcvdXNlci9wcm9maWxlJyk7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuIiwgImV4cG9ydCBmdW5jdGlvbiBodG1sKHRlbXBsYXRlOiBzdHJpbmcpOiBIVE1MRWxlbWVudCB7XHJcbiAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgZGl2LmlubmVySFRNTCA9IHRlbXBsYXRlLnRyaW0oKTtcclxuICByZXR1cm4gZGl2LmZpcnN0RWxlbWVudENoaWxkIGFzIEhUTUxFbGVtZW50O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcXM8VCBleHRlbmRzIEVsZW1lbnQgPSBIVE1MRWxlbWVudD4ocm9vdDogUGFyZW50Tm9kZSwgc2VsOiBzdHJpbmcpOiBUIHtcclxuICBjb25zdCBlbCA9IHJvb3QucXVlcnlTZWxlY3RvcihzZWwpIGFzIFQgfCBudWxsO1xyXG4gIGlmICghZWwpIHRocm93IG5ldyBFcnJvcihgTWlzc2luZyBlbGVtZW50OiAke3NlbH1gKTtcclxuICByZXR1cm4gZWwgYXMgVDtcclxufVxyXG5cclxuXHJcbiIsICJpbXBvcnQgeyBodG1sIH0gZnJvbSAnLi4vdXRpbHMvZG9tJztcblxuZXhwb3J0IHR5cGUgSWNvbk5hbWUgPVxuICB8ICdob21lJ1xuICB8ICd3YXJlaG91c2UnXG4gIHwgJ3BsdW5kZXInXG4gIHwgJ2V4Y2hhbmdlJ1xuICB8ICdyYW5raW5nJ1xuICB8ICdvcmUnXG4gIHwgJ2NvaW4nXG4gIHwgJ3BpY2snXG4gIHwgJ3JlZnJlc2gnXG4gIHwgJ3BsYXknXG4gIHwgJ3N0b3AnXG4gIHwgJ2NvbGxlY3QnXG4gIHwgJ3dyZW5jaCdcbiAgfCAnc2hpZWxkJ1xuICB8ICdsaXN0J1xuICB8ICd1c2VyJ1xuICB8ICdsb2NrJ1xuICB8ICdleWUnXG4gIHwgJ2V5ZS1vZmYnXG4gIHwgJ3N3b3JkJ1xuICB8ICd0cm9waHknXG4gIHwgJ2Nsb2NrJ1xuICB8ICdib2x0J1xuICB8ICd0cmFzaCdcbiAgfCAnY2xvc2UnXG4gIHwgJ2Fycm93LXJpZ2h0J1xuICB8ICd0YXJnZXQnO1xuXG5mdW5jdGlvbiBncmFkKGlkOiBzdHJpbmcpIHtcbiAgcmV0dXJuIGA8ZGVmcz5cbiAgICA8bGluZWFyR3JhZGllbnQgaWQ9XCIke2lkfVwiIHgxPVwiMFwiIHkxPVwiMFwiIHgyPVwiMVwiIHkyPVwiMVwiPlxuICAgICAgPHN0b3Agb2Zmc2V0PVwiMCVcIiBzdG9wLWNvbG9yPVwiIzdCMkNGNVwiIC8+XG4gICAgICA8c3RvcCBvZmZzZXQ9XCIxMDAlXCIgc3RvcC1jb2xvcj1cIiMyQzg5RjVcIiAvPlxuICAgIDwvbGluZWFyR3JhZGllbnQ+XG4gIDwvZGVmcz5gO1xufVxuXG5mdW5jdGlvbiBzdmdXcmFwKHBhdGg6IHN0cmluZywgc2l6ZSA9IDE4LCBjbHMgPSAnJyk6IEhUTUxFbGVtZW50IHtcbiAgY29uc3QgZ2lkID0gJ2lnLScgKyBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zbGljZSgyLCA4KTtcbiAgY29uc3QgZWwgPSBodG1sKGA8c3BhbiBjbGFzcz1cImljb24gJHtjbHN9XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+JHtcbiAgICBgPHN2ZyB3aWR0aD1cIiR7c2l6ZX1cIiBoZWlnaHQ9XCIke3NpemV9XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPiR7Z3JhZChnaWQpfSR7cGF0aC5yZXBsYWNlQWxsKCdfX0dSQURfXycsIGB1cmwoIyR7Z2lkfSlgKX08L3N2Zz5gXG4gIH08L3NwYW4+YCk7XG4gIHJldHVybiBlbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlckljb24obmFtZTogSWNvbk5hbWUsIG9wdHM6IHsgc2l6ZT86IG51bWJlcjsgY2xhc3NOYW1lPzogc3RyaW5nIH0gPSB7fSkge1xuICBjb25zdCBzaXplID0gb3B0cy5zaXplID8/IDE4O1xuICBjb25zdCBjbHMgPSBvcHRzLmNsYXNzTmFtZSA/PyAnJztcbiAgY29uc3Qgc3Ryb2tlID0gJ3N0cm9rZT1cIl9fR1JBRF9fXCIgc3Ryb2tlLXdpZHRoPVwiMS43XCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCInO1xuICBjb25zdCBmaWxsID0gJ2ZpbGw9XCJfX0dSQURfX1wiJztcblxuICBzd2l0Y2ggKG5hbWUpIHtcbiAgICBjYXNlICdob21lJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTMgMTAuNUwxMiAzbDkgNy41XCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTUuNSA5LjVWMjFoMTNWOS41XCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTkuNSAyMXYtNmg1djZcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnd2FyZWhvdXNlJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTMgOWw5LTUgOSA1djkuNWMwIDEtMSAyLTIgMkg1Yy0xIDAtMi0xLTItMlY5elwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk03IDEyaDEwTTcgMTZoMTBcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAncGx1bmRlcic6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk00IDIwbDctN00xMyAxM2w3IDdNOSA1bDYgNk0xNSA1bC02IDZcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnZXhjaGFuZ2UnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNNiA4aDExbC0zLTNNMTggMTZIN2wzIDNcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAncmFua2luZyc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk04IDE0djZNMTIgMTB2MTBNMTYgNnYxNFwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk0xNiA0LjVhMiAyIDAgMTAwLTQgMiAyIDAgMDAwIDR6XCIgJHtmaWxsfS8+YCAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnb3JlJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTEyIDNsNiA0LTIgOC00IDYtNC02LTItOCA2LTR6XCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTEyIDNsLTIgOCAyIDEwIDItMTAtMi04elwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdjb2luJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjguNVwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk04LjUgMTJoN00xMCA5aDRNMTAgMTVoNFwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdwaWNrJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTQgNWM0LTMgOS0yIDEyIDFNOSAxMGwtNSA1TTkgMTBsMiAyTTcgMTJsMiAyXCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTExIDEybDcgN1wiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdyZWZyZXNoJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTIwIDEyYTggOCAwIDEwLTIuMyA1LjdcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNMjAgMTJ2NmgtNlwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdwbGF5JzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTggNnYxMmwxMC02LTEwLTZ6XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ3N0b3AnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxyZWN0IHg9XCI3XCIgeT1cIjdcIiB3aWR0aD1cIjEwXCIgaGVpZ2h0PVwiMTBcIiByeD1cIjJcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnY29sbGVjdCc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0xMiA1djEwXCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTggMTFsNCA0IDQtNFwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk01IDE5aDE0XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ3dyZW5jaCc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0xNS41IDZhNC41IDQuNSAwIDExLTYuOSA1LjRMMyAxN2w0LjYtNS42QTQuNSA0LjUgMCAxMTE1LjUgNnpcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnc2hpZWxkJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTEyIDNsOCAzdjZhMTAgMTAgMCAwMS04IDkgMTAgMTAgMCAwMS04LTlWNmw4LTN6XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ2xpc3QnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNNyA2aDEyTTcgMTJoMTJNNyAxOGgxMlwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk00IDZoLjAxTTQgMTJoLjAxTTQgMThoLjAxXCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ3VzZXInOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNMTIgMTJhNCA0IDAgMTAwLTggNCA0IDAgMDAwIDh6XCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTQgMjBhOCA4IDAgMDExNiAwXCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ2xvY2snOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxyZWN0IHg9XCI1XCIgeT1cIjEwXCIgd2lkdGg9XCIxNFwiIGhlaWdodD1cIjEwXCIgcng9XCIyXCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTggMTBWN2E0IDQgMCAxMTggMHYzXCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ2V5ZSc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0yIDEyczQtNyAxMC03IDEwIDcgMTAgNy00IDctMTAgNy0xMC03LTEwLTd6XCIgJHtzdHJva2V9Lz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjNcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnZXllLW9mZic6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0yIDEyczQtNyAxMC03IDEwIDcgMTAgNy00IDctMTAgNy0xMC03LTEwLTd6XCIgJHtzdHJva2V9Lz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjNcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNMyAzbDE4IDE4XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ3N3b3JkJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTMgMjFsNi02TTkgMTVsOS05IDMgMy05IDlNMTQgNmw0IDRcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAndHJvcGh5JzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTggMjFoOE05IDE3aDZNNyA0aDEwdjVhNSA1IDAgMTEtMTAgMFY0elwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk00IDZoM3YyYTMgMyAwIDExLTMtMnpNMjAgNmgtM3YyYTMgMyAwIDAwMy0yelwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdjbG9jayc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCI4LjVcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNMTIgN3Y2bDQgMlwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdib2x0JzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTEzIDJMNiAxNGg1bC0xIDggNy0xMmgtNWwxLTh6XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ3RyYXNoJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTQgN2gxNk05IDdWNWg2djJNNyA3bDEgMTNoOGwxLTEzXCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ2Nsb3NlJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTYgNmwxMiAxMk02IDE4TDE4IDZcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnYXJyb3ctcmlnaHQnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNNCAxMmgxNE0xMiA1bDcgNy03IDdcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAndGFyZ2V0JzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjguNVwiICR7c3Ryb2tlfS8+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCI0LjVcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNMTIgMnYzTTEyIDE5djNNMiAxMmgzTTE5IDEyaDNcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnYm94JzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTEyIDNsOSA1LTkgNS05LTUgOS01elwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk0zIDh2OGw5IDUgOS01VjhcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNMTIgMTN2OFwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdpbmZvJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjguNVwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk0xMiAxMHY2XCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTEyIDdoLjAxXCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCI5XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICB9XG59XG4iLCAiaW1wb3J0IHsgcmVuZGVySWNvbiB9IGZyb20gJy4vSWNvbic7XG5cbmxldCBfYm94OiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuXG5mdW5jdGlvbiBlbnN1cmVCb3goKTogSFRNTEVsZW1lbnQge1xuICBpZiAoX2JveCkgcmV0dXJuIF9ib3g7XG4gIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBkaXYuY2xhc3NOYW1lID0gJ3RvYXN0LXdyYXAnO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRpdik7XG4gIF9ib3ggPSBkaXY7XG4gIHJldHVybiBkaXY7XG59XG5cbnR5cGUgVG9hc3RUeXBlID0gJ2luZm8nIHwgJ3N1Y2Nlc3MnIHwgJ3dhcm4nIHwgJ2Vycm9yJztcbnR5cGUgVG9hc3RPcHRpb25zID0geyB0eXBlPzogVG9hc3RUeXBlOyBkdXJhdGlvbj86IG51bWJlciB9O1xuXG5leHBvcnQgZnVuY3Rpb24gc2hvd1RvYXN0KHRleHQ6IHN0cmluZywgb3B0cz86IFRvYXN0VHlwZSB8IFRvYXN0T3B0aW9ucykge1xuICBjb25zdCBib3ggPSBlbnN1cmVCb3goKTtcbiAgY29uc3QgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBsZXQgdHlwZTogVG9hc3RUeXBlIHwgdW5kZWZpbmVkO1xuICBsZXQgZHVyYXRpb24gPSAzNTAwO1xuICBpZiAodHlwZW9mIG9wdHMgPT09ICdzdHJpbmcnKSB0eXBlID0gb3B0cztcbiAgZWxzZSBpZiAob3B0cykgeyB0eXBlID0gb3B0cy50eXBlOyBpZiAob3B0cy5kdXJhdGlvbikgZHVyYXRpb24gPSBvcHRzLmR1cmF0aW9uOyB9XG4gIGl0ZW0uY2xhc3NOYW1lID0gJ3RvYXN0JyArICh0eXBlID8gJyAnICsgdHlwZSA6ICcnKTtcbiAgLy8gaWNvbiArIHRleHQgY29udGFpbmVyXG4gIHRyeSB7XG4gICAgY29uc3Qgd3JhcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHdyYXAuc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcbiAgICB3cmFwLnN0eWxlLmdhcCA9ICc4cHgnO1xuICAgIHdyYXAuc3R5bGUuYWxpZ25JdGVtcyA9ICdjZW50ZXInO1xuICAgIGNvbnN0IGljb05hbWUgPSB0eXBlID09PSAnc3VjY2VzcycgPyAnYm9sdCcgOiB0eXBlID09PSAnd2FybicgPyAnY2xvY2snIDogdHlwZSA9PT0gJ2Vycm9yJyA/ICdjbG9zZScgOiAnaW5mbyc7XG4gICAgY29uc3QgaWNvSG9zdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBpY29Ib3N0LmFwcGVuZENoaWxkKHJlbmRlckljb24oaWNvTmFtZSwgeyBzaXplOiAxOCB9KSk7XG4gICAgY29uc3QgdHh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdHh0LnRleHRDb250ZW50ID0gdGV4dDtcbiAgICB3cmFwLmFwcGVuZENoaWxkKGljb0hvc3QpO1xuICAgIHdyYXAuYXBwZW5kQ2hpbGQodHh0KTtcbiAgICBpdGVtLmFwcGVuZENoaWxkKHdyYXApO1xuICB9IGNhdGNoIHtcbiAgICBpdGVtLnRleHRDb250ZW50ID0gdGV4dDtcbiAgfVxuICBjb25zdCBsaWZlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaScpO1xuICBsaWZlLmNsYXNzTmFtZSA9ICdsaWZlJztcbiAgbGlmZS5zdHlsZS5zZXRQcm9wZXJ0eSgnLS1saWZlJywgZHVyYXRpb24gKyAnbXMnKTtcbiAgaXRlbS5hcHBlbmRDaGlsZChsaWZlKTtcbiAgYm94LnByZXBlbmQoaXRlbSk7XG4gIC8vIGdyYWNlZnVsIGV4aXRcbiAgY29uc3QgZmFkZSA9ICgpID0+IHsgaXRlbS5zdHlsZS5vcGFjaXR5ID0gJzAnOyBpdGVtLnN0eWxlLnRyYW5zaXRpb24gPSAnb3BhY2l0eSAuNDVzJzsgc2V0VGltZW91dCgoKSA9PiBpdGVtLnJlbW92ZSgpLCA0NjApOyB9O1xuICBjb25zdCB0aW1lciA9IHdpbmRvdy5zZXRUaW1lb3V0KGZhZGUsIGR1cmF0aW9uKTtcbiAgaXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHsgY2xlYXJUaW1lb3V0KHRpbWVyKTsgZmFkZSgpOyB9KTtcbn1cbiIsICJpbXBvcnQgeyBHYW1lTWFuYWdlciB9IGZyb20gJy4uL2NvcmUvR2FtZU1hbmFnZXInO1xuaW1wb3J0IHsgaHRtbCwgcXMgfSBmcm9tICcuLi91dGlscy9kb20nO1xuaW1wb3J0IHsgc2hvd1RvYXN0IH0gZnJvbSAnLi4vY29tcG9uZW50cy9Ub2FzdCc7XG5pbXBvcnQgeyByZW5kZXJJY29uIH0gZnJvbSAnLi4vY29tcG9uZW50cy9JY29uJztcblxuZXhwb3J0IGNsYXNzIExvZ2luU2NlbmUge1xuICBtb3VudChyb290OiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnN0IHZpZXcgPSBodG1sKGBcbiAgICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXIgZ3JpZC0yXCIgc3R5bGU9XCJjb2xvcjojZmZmO1wiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZCBmYWRlLWluXCIgc3R5bGU9XCJtYXgtd2lkdGg6NDYwcHg7bWFyZ2luOjQ2cHggYXV0bztcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NlbmUtaGVhZGVyXCI+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8aDEgc3R5bGU9XCJiYWNrZ3JvdW5kOnZhcigtLWdyYWQpOy13ZWJraXQtYmFja2dyb3VuZC1jbGlwOnRleHQ7YmFja2dyb3VuZC1jbGlwOnRleHQ7Y29sb3I6dHJhbnNwYXJlbnQ7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6OHB4O1wiPjxzcGFuIGRhdGEtaWNvPVwiaG9tZVwiPjwvc3Bhbj5cdTc3RkZcdTU3M0FcdTYzMDdcdTYzMjVcdTRFMkRcdTVGQzM8L2gxPlxuICAgICAgICAgICAgICA8cD5cdTc2N0JcdTVGNTVcdTU0MEVcdThGREJcdTUxNjVcdTRGNjBcdTc2ODRcdThENUJcdTUzNUFcdTc3RkZcdTU3Q0VcdTMwMDI8L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8aW5wdXQgaWQ9XCJ1XCIgY2xhc3M9XCJpbnB1dFwiIHBsYWNlaG9sZGVyPVwiXHU3NTI4XHU2MjM3XHU1NDBEXCIgYXV0b2NvbXBsZXRlPVwidXNlcm5hbWVcIi8+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiIHN0eWxlPVwiYWxpZ24taXRlbXM6Y2VudGVyO1wiPlxuICAgICAgICAgICAgPGlucHV0IGlkPVwicFwiIGNsYXNzPVwiaW5wdXRcIiBwbGFjZWhvbGRlcj1cIlx1NUJDNlx1NzgwMVwiIHR5cGU9XCJwYXNzd29yZFwiIGF1dG9jb21wbGV0ZT1cImN1cnJlbnQtcGFzc3dvcmRcIi8+XG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwicmV2ZWFsXCIgY2xhc3M9XCJidG4gYnRuLWdob3N0XCIgc3R5bGU9XCJtaW4td2lkdGg6MTEwcHg7XCI+PHNwYW4gZGF0YS1pY289XCJleWVcIj48L3NwYW4+XHU2NjNFXHU3OTNBPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGJ1dHRvbiBpZD1cImdvXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIiBzdHlsZT1cIndpZHRoOjEwMCU7bWFyZ2luLXRvcDo4cHg7XCI+PHNwYW4gZGF0YS1pY289XCJhcnJvdy1yaWdodFwiPjwvc3Bhbj5cdThGREJcdTUxNjVcdTZFMzhcdTYyMEY8L2J1dHRvbj5cbiAgICAgICAgICA8ZGl2IHN0eWxlPVwibWFyZ2luLXRvcDo4cHg7b3BhY2l0eTouNzU7Zm9udC1zaXplOjEycHg7XCI+XHU2M0QwXHU3OTNBXHVGRjFBXHU4MkU1XHU4RDI2XHU2MjM3XHU0RTBEXHU1QjU4XHU1NzI4XHVGRjBDXHU1QzA2XHU4MUVBXHU1MkE4XHU1MjFCXHU1RUZBXHU1RTc2XHU3NjdCXHU1RjU1XHUzMDAyPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgYCk7XG4gICAgcm9vdC5pbm5lckhUTUwgPSAnJztcbiAgICByb290LmFwcGVuZENoaWxkKHZpZXcpO1xuXG4gICAgLy8gXHU2RTMyXHU2N0QzXHU2MjQwXHU2NzA5XHU1NkZFXHU2ODA3XG4gICAgdHJ5IHtcbiAgICAgIHZpZXcucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtaWNvXScpLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgIGNvbnN0IG5hbWUgPSAoZWwgYXMgSFRNTEVsZW1lbnQpLmdldEF0dHJpYnV0ZSgnZGF0YS1pY28nKSBhcyBhbnk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZWwuYXBwZW5kQ2hpbGQocmVuZGVySWNvbihuYW1lLCB7IHNpemU6IDIyIH0pKTtcbiAgICAgICAgfSBjYXRjaCB7fVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCB7fVxuXG4gICAgY29uc3QgdUVsID0gcXM8SFRNTElucHV0RWxlbWVudD4odmlldywgJyN1Jyk7XG4gICAgY29uc3QgcEVsID0gcXM8SFRNTElucHV0RWxlbWVudD4odmlldywgJyNwJyk7XG4gICAgY29uc3QgZ28gPSBxczxIVE1MQnV0dG9uRWxlbWVudD4odmlldywgJyNnbycpO1xuICAgIGNvbnN0IHJldmVhbCA9IHFzPEhUTUxCdXR0b25FbGVtZW50Pih2aWV3LCAnI3JldmVhbCcpO1xuXG4gICAgLy8gXHU0RjdGXHU3NTI4IHJlcXVlc3RBbmltYXRpb25GcmFtZSBcdTc4NkVcdTRGRERcdTZFMzJcdTY3RDNcdTVCOENcdTYyMTBcdTU0MEVcdTdBQ0JcdTUzNzNcdTgwNUFcdTcxMjZcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgdUVsLmZvY3VzKCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGNvbnN0IHN1Ym1pdCA9IGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHVzZXJuYW1lID0gKHVFbC52YWx1ZSB8fCAnJykudHJpbSgpO1xuICAgICAgY29uc3QgcGFzc3dvcmQgPSAocEVsLnZhbHVlIHx8ICcnKS50cmltKCk7XG4gICAgICBpZiAoIXVzZXJuYW1lIHx8ICFwYXNzd29yZCkge1xuICAgICAgICBzaG93VG9hc3QoJ1x1OEJGN1x1NTg2Qlx1NTE5OVx1NzUyOFx1NjIzN1x1NTQwRFx1NTQ4Q1x1NUJDNlx1NzgwMScsICd3YXJuJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGdvLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIGdvLnRleHRDb250ZW50ID0gJ1x1NzY3Qlx1NUY1NVx1NEUyRFx1MjAyNic7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBHYW1lTWFuYWdlci5JLmxvZ2luT3JSZWdpc3Rlcih1c2VybmFtZSwgcGFzc3dvcmQpO1xuICAgICAgICBsb2NhdGlvbi5oYXNoID0gJyMvbWFpbic7XG4gICAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgICAgc2hvd1RvYXN0KGU/Lm1lc3NhZ2UgfHwgJ1x1NzY3Qlx1NUY1NVx1NTkzMVx1OEQyNVx1RkYwQ1x1OEJGN1x1OTFDRFx1OEJENScsICdlcnJvcicpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgZ28uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgZ28udGV4dENvbnRlbnQgPSAnXHU4RkRCXHU1MTY1XHU2RTM4XHU2MjBGJztcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgZ28ub25jbGljayA9IHN1Ym1pdDtcbiAgICB1RWwub25rZXl1cCA9IChlKSA9PiB7IGlmICgoZSBhcyBLZXlib2FyZEV2ZW50KS5rZXkgPT09ICdFbnRlcicpIHN1Ym1pdCgpOyB9O1xuICAgIHBFbC5vbmtleXVwID0gKGUpID0+IHsgaWYgKChlIGFzIEtleWJvYXJkRXZlbnQpLmtleSA9PT0gJ0VudGVyJykgc3VibWl0KCk7IH07XG4gICAgcmV2ZWFsLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICBjb25zdCBpc1B3ZCA9IHBFbC50eXBlID09PSAncGFzc3dvcmQnO1xuICAgICAgcEVsLnR5cGUgPSBpc1B3ZCA/ICd0ZXh0JyA6ICdwYXNzd29yZCc7XG4gICAgICByZXZlYWwuaW5uZXJIVE1MID0gJyc7XG4gICAgICByZXZlYWwuYXBwZW5kQ2hpbGQocmVuZGVySWNvbihpc1B3ZCA/ICdleWUtb2ZmJyA6ICdleWUnLCB7IHNpemU6IDIwIH0pKTtcbiAgICAgIHJldmVhbC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShpc1B3ZCA/ICdcdTk2OTBcdTg1Q0YnIDogJ1x1NjYzRVx1NzkzQScpKTtcbiAgICB9O1xuICB9XG59XG4iLCAiZXhwb3J0IGNvbnN0IEFQSV9CQVNFID0gKHdpbmRvdyBhcyBhbnkpLl9fQVBJX0JBU0VfXyB8fCAnaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaSc7XHJcbmV4cG9ydCBjb25zdCBXU19FTkRQT0lOVCA9ICh3aW5kb3cgYXMgYW55KS5fX1dTX0VORFBPSU5UX18gfHwgJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9nYW1lJztcclxuXHJcblxyXG4iLCAiaW1wb3J0IHsgV1NfRU5EUE9JTlQgfSBmcm9tICcuL0Vudic7XG5cbnR5cGUgSGFuZGxlciA9IChkYXRhOiBhbnkpID0+IHZvaWQ7XG5cbmV4cG9ydCBjbGFzcyBSZWFsdGltZUNsaWVudCB7XG4gIHByaXZhdGUgc3RhdGljIF9pbnN0YW5jZTogUmVhbHRpbWVDbGllbnQ7XG4gIHN0YXRpYyBnZXQgSSgpOiBSZWFsdGltZUNsaWVudCB7XG4gICAgcmV0dXJuIHRoaXMuX2luc3RhbmNlID8/ICh0aGlzLl9pbnN0YW5jZSA9IG5ldyBSZWFsdGltZUNsaWVudCgpKTtcbiAgfVxuXG4gIHByaXZhdGUgc29ja2V0OiBhbnkgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBoYW5kbGVyczogUmVjb3JkPHN0cmluZywgSGFuZGxlcltdPiA9IHt9O1xuXG4gIGNvbm5lY3QodG9rZW46IHN0cmluZykge1xuICAgIGNvbnN0IHcgPSB3aW5kb3cgYXMgYW55O1xuICAgIGlmICh3LmlvKSB7XG4gICAgICBpZiAodGhpcy5zb2NrZXQgJiYgKHRoaXMuc29ja2V0LmNvbm5lY3RlZCB8fCB0aGlzLnNvY2tldC5jb25uZWN0aW5nKSkgcmV0dXJuO1xuICAgICAgdGhpcy5zb2NrZXQgPSB3LmlvKFdTX0VORFBPSU5ULCB7IGF1dGg6IHsgdG9rZW4gfSB9KTtcbiAgICAgIHRoaXMuc29ja2V0Lm9uKCdjb25uZWN0JywgKCkgPT4ge30pO1xuICAgICAgdGhpcy5zb2NrZXQub25BbnkoKGV2ZW50OiBzdHJpbmcsIHBheWxvYWQ6IGFueSkgPT4gdGhpcy5lbWl0TG9jYWwoZXZlbnQsIHBheWxvYWQpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gc29ja2V0LmlvIGNsaWVudCBub3QgbG9hZGVkOyBkaXNhYmxlIHJlYWx0aW1lIHVwZGF0ZXNcbiAgICAgIHRoaXMuc29ja2V0ID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBvbihldmVudDogc3RyaW5nLCBoYW5kbGVyOiBIYW5kbGVyKSB7XG4gICAgKHRoaXMuaGFuZGxlcnNbZXZlbnRdIHx8PSBbXSkucHVzaChoYW5kbGVyKTtcbiAgfVxuXG4gIG9mZihldmVudDogc3RyaW5nLCBoYW5kbGVyOiBIYW5kbGVyKSB7XG4gICAgY29uc3QgYXJyID0gdGhpcy5oYW5kbGVyc1tldmVudF07XG4gICAgaWYgKCFhcnIpIHJldHVybjtcbiAgICBjb25zdCBpZHggPSBhcnIuaW5kZXhPZihoYW5kbGVyKTtcbiAgICBpZiAoaWR4ID49IDApIGFyci5zcGxpY2UoaWR4LCAxKTtcbiAgfVxuXG4gIHByaXZhdGUgZW1pdExvY2FsKGV2ZW50OiBzdHJpbmcsIHBheWxvYWQ6IGFueSkge1xuICAgICh0aGlzLmhhbmRsZXJzW2V2ZW50XSB8fCBbXSkuZm9yRWFjaCgoaCkgPT4gaChwYXlsb2FkKSk7XG4gIH1cbn1cbiIsICJpbXBvcnQgeyByZW5kZXJJY29uIH0gZnJvbSAnLi9JY29uJztcblxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlck5hdihhY3RpdmU6IHN0cmluZyk6IEhUTUxFbGVtZW50IHtcbiAgY29uc3QgdGFiczogeyBrZXk6IHN0cmluZzsgdGV4dDogc3RyaW5nOyBocmVmOiBzdHJpbmc7IGljb246IGFueSB9W10gPSBbXG4gICAgeyBrZXk6ICdtYWluJywgdGV4dDogJ1x1NEUzQlx1OTg3NScsIGhyZWY6ICcjL21haW4nLCBpY29uOiAnaG9tZScgfSxcbiAgICB7IGtleTogJ3dhcmVob3VzZScsIHRleHQ6ICdcdTRFRDNcdTVFOTMnLCBocmVmOiAnIy93YXJlaG91c2UnLCBpY29uOiAnd2FyZWhvdXNlJyB9LFxuICAgIHsga2V5OiAncGx1bmRlcicsIHRleHQ6ICdcdTYzQTBcdTU5M0EnLCBocmVmOiAnIy9wbHVuZGVyJywgaWNvbjogJ3BsdW5kZXInIH0sXG4gICAgeyBrZXk6ICdleGNoYW5nZScsIHRleHQ6ICdcdTRFQTRcdTY2MTNcdTYyNDAnLCBocmVmOiAnIy9leGNoYW5nZScsIGljb246ICdleGNoYW5nZScgfSxcbiAgICB7IGtleTogJ3JhbmtpbmcnLCB0ZXh0OiAnXHU2MzkyXHU4ODRDJywgaHJlZjogJyMvcmFua2luZycsIGljb246ICdyYW5raW5nJyB9LFxuICBdO1xuICBjb25zdCB3cmFwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHdyYXAuY2xhc3NOYW1lID0gJ25hdic7XG4gIGZvciAoY29uc3QgdCBvZiB0YWJzKSB7XG4gICAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICBhLmhyZWYgPSB0LmhyZWY7XG4gICAgY29uc3QgaWNvID0gcmVuZGVySWNvbih0Lmljb24sIHsgc2l6ZTogMTgsIGNsYXNzTmFtZTogJ2ljbycgfSk7XG4gICAgY29uc3QgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgbGFiZWwudGV4dENvbnRlbnQgPSB0LnRleHQ7XG4gICAgYS5hcHBlbmRDaGlsZChpY28pO1xuICAgIGEuYXBwZW5kQ2hpbGQobGFiZWwpO1xuICAgIGlmICh0LmtleSA9PT0gYWN0aXZlKSBhLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgIHdyYXAuYXBwZW5kQ2hpbGQoYSk7XG4gIH1cbiAgcmV0dXJuIHdyYXA7XG59XG4iLCAiZXhwb3J0IGNsYXNzIENvdW50VXBUZXh0IHtcclxuICBwcml2YXRlIHZhbHVlID0gMDtcclxuICBwcml2YXRlIGRpc3BsYXkgPSAnMCc7XHJcbiAgcHJpdmF0ZSBhbmltPzogbnVtYmVyO1xyXG4gIG9uVXBkYXRlPzogKHRleHQ6IHN0cmluZykgPT4gdm9pZDtcclxuXHJcbiAgc2V0KG46IG51bWJlcikge1xyXG4gICAgdGhpcy52YWx1ZSA9IG47XHJcbiAgICB0aGlzLmRpc3BsYXkgPSB0aGlzLmZvcm1hdChuKTtcclxuICAgIHRoaXMub25VcGRhdGU/Lih0aGlzLmRpc3BsYXkpO1xyXG4gIH1cclxuXHJcbiAgdG8objogbnVtYmVyLCBkdXJhdGlvbiA9IDUwMCkge1xyXG4gICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5hbmltISk7XHJcbiAgICBjb25zdCBzdGFydCA9IHRoaXMudmFsdWU7XHJcbiAgICBjb25zdCBkZWx0YSA9IG4gLSBzdGFydDtcclxuICAgIGNvbnN0IHQwID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcbiAgICBjb25zdCBzdGVwID0gKHQ6IG51bWJlcikgPT4ge1xyXG4gICAgICBjb25zdCBwID0gTWF0aC5taW4oMSwgKHQgLSB0MCkgLyBkdXJhdGlvbik7XHJcbiAgICAgIGNvbnN0IGVhc2UgPSAxIC0gTWF0aC5wb3coMSAtIHAsIDMpO1xyXG4gICAgICBjb25zdCBjdXJyID0gc3RhcnQgKyBkZWx0YSAqIGVhc2U7XHJcbiAgICAgIHRoaXMuZGlzcGxheSA9IHRoaXMuZm9ybWF0KGN1cnIpO1xyXG4gICAgICB0aGlzLm9uVXBkYXRlPy4odGhpcy5kaXNwbGF5KTtcclxuICAgICAgaWYgKHAgPCAxKSB0aGlzLmFuaW0gPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcCk7XHJcbiAgICAgIGVsc2UgdGhpcy52YWx1ZSA9IG47XHJcbiAgICB9O1xyXG4gICAgdGhpcy5hbmltID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBmb3JtYXQobjogbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gTWF0aC5mbG9vcihuKS50b0xvY2FsZVN0cmluZygpO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbiIsICJpbXBvcnQgeyBOZXR3b3JrTWFuYWdlciB9IGZyb20gJy4uL2NvcmUvTmV0d29ya01hbmFnZXInO1xuaW1wb3J0IHsgcmVuZGVySWNvbiB9IGZyb20gJy4vSWNvbic7XG5pbXBvcnQgeyBDb3VudFVwVGV4dCB9IGZyb20gJy4vQ291bnRVcFRleHQnO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyUmVzb3VyY2VCYXIoKSB7XG4gIGNvbnN0IGJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBib3guY2xhc3NOYW1lID0gJ2NvbnRhaW5lcic7XG4gIGNvbnN0IGNhcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgY2FyZC5jbGFzc05hbWUgPSAnY2FyZCBmYWRlLWluJztcbiAgY2FyZC5pbm5lckhUTUwgPSBgXG4gICAgPGRpdiBjbGFzcz1cInN0YXRzXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwic3RhdFwiIGlkPVwib3JlLXN0YXRcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImljb1wiIGRhdGEtaWNvPVwib3JlXCI+PC9kaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9XCJkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDoycHg7XCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInZhbFwiIGlkPVwib3JlXCI+MDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJsYWJlbFwiPlx1NzdGRlx1NzdGMzwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cInN0YXRcIiBpZD1cImNvaW4tc3RhdFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiaWNvXCIgZGF0YS1pY289XCJjb2luXCI+PC9kaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9XCJkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDoycHg7XCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInZhbFwiIGlkPVwiY29pblwiPjA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibGFiZWxcIj5CQjwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICBgO1xuICBib3guYXBwZW5kQ2hpbGQoY2FyZCk7XG4gIC8vIGluamVjdCBpY29uc1xuICB0cnkge1xuICAgIGNvbnN0IG9yZUljbyA9IGNhcmQucXVlcnlTZWxlY3RvcignW2RhdGEtaWNvPVwib3JlXCJdJyk7XG4gICAgY29uc3QgY29pbkljbyA9IGNhcmQucXVlcnlTZWxlY3RvcignW2RhdGEtaWNvPVwiY29pblwiXScpO1xuICAgIGlmIChvcmVJY28pIG9yZUljby5hcHBlbmRDaGlsZChyZW5kZXJJY29uKCdvcmUnLCB7IHNpemU6IDE4IH0pKTtcbiAgICBpZiAoY29pbkljbykgY29pbkljby5hcHBlbmRDaGlsZChyZW5kZXJJY29uKCdjb2luJywgeyBzaXplOiAxOCB9KSk7XG4gIH0gY2F0Y2gge31cbiAgXG4gIGNvbnN0IG9yZUVsID0gY2FyZC5xdWVyeVNlbGVjdG9yKCcjb3JlJykgYXMgSFRNTEVsZW1lbnQ7XG4gIGNvbnN0IGNvaW5FbCA9IGNhcmQucXVlcnlTZWxlY3RvcignI2NvaW4nKSBhcyBIVE1MRWxlbWVudDtcbiAgXG4gIGNvbnN0IG9yZUNvdW50ZXIgPSBuZXcgQ291bnRVcFRleHQoKTtcbiAgY29uc3QgY29pbkNvdW50ZXIgPSBuZXcgQ291bnRVcFRleHQoKTtcbiAgb3JlQ291bnRlci5vblVwZGF0ZSA9ICh0ZXh0KSA9PiB7IG9yZUVsLnRleHRDb250ZW50ID0gdGV4dDsgfTtcbiAgY29pbkNvdW50ZXIub25VcGRhdGUgPSAodGV4dCkgPT4geyBjb2luRWwudGV4dENvbnRlbnQgPSB0ZXh0OyB9O1xuICBcbiAgbGV0IHByZXZPcmUgPSAwO1xuICBsZXQgcHJldkNvaW4gPSAwO1xuICBcbiAgYXN5bmMgZnVuY3Rpb24gdXBkYXRlKCkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBwID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgaWQ6IHN0cmluZzsgdXNlcm5hbWU6IHN0cmluZzsgbmlja25hbWU6IHN0cmluZzsgb3JlQW1vdW50OiBudW1iZXI7IGJiQ29pbnM6IG51bWJlciB9PignL3VzZXIvcHJvZmlsZScpO1xuICAgICAgXG4gICAgICAvLyBcdTRGN0ZcdTc1MjhcdThCQTFcdTY1NzBcdTUyQThcdTc1M0JcdTY2RjRcdTY1QjBcbiAgICAgIGlmIChwLm9yZUFtb3VudCAhPT0gcHJldk9yZSkge1xuICAgICAgICBvcmVDb3VudGVyLnRvKHAub3JlQW1vdW50LCA4MDApO1xuICAgICAgICAvLyBcdTU5ODJcdTY3OUNcdTY2MkZcdTU4OUVcdTUyQTBcdUZGMENcdTZERkJcdTUyQTBcdTU2RkVcdTY4MDdcdTgxMDlcdTUxQjJcdTY1NDhcdTY3OUNcbiAgICAgICAgaWYgKHAub3JlQW1vdW50ID4gcHJldk9yZSkge1xuICAgICAgICAgIGNvbnN0IG9yZUljb24gPSBjYXJkLnF1ZXJ5U2VsZWN0b3IoJyNvcmUtc3RhdCAuaWNvJyk7XG4gICAgICAgICAgaWYgKG9yZUljb24pIHtcbiAgICAgICAgICAgIG9yZUljb24uY2xhc3NMaXN0LmFkZCgncHVsc2UtaWNvbicpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBvcmVJY29uLmNsYXNzTGlzdC5yZW1vdmUoJ3B1bHNlLWljb24nKSwgNjAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcHJldk9yZSA9IHAub3JlQW1vdW50O1xuICAgICAgfVxuICAgICAgXG4gICAgICBpZiAocC5iYkNvaW5zICE9PSBwcmV2Q29pbikge1xuICAgICAgICBjb2luQ291bnRlci50byhwLmJiQ29pbnMsIDgwMCk7XG4gICAgICAgIGlmIChwLmJiQ29pbnMgPiBwcmV2Q29pbikge1xuICAgICAgICAgIGNvbnN0IGNvaW5JY29uID0gY2FyZC5xdWVyeVNlbGVjdG9yKCcjY29pbi1zdGF0IC5pY28nKTtcbiAgICAgICAgICBpZiAoY29pbkljb24pIHtcbiAgICAgICAgICAgIGNvaW5JY29uLmNsYXNzTGlzdC5hZGQoJ3B1bHNlLWljb24nKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gY29pbkljb24uY2xhc3NMaXN0LnJlbW92ZSgncHVsc2UtaWNvbicpLCA2MDApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBwcmV2Q29pbiA9IHAuYmJDb2lucztcbiAgICAgIH1cbiAgICB9IGNhdGNoIHtcbiAgICAgIC8vIGlnbm9yZSBmZXRjaCBlcnJvcnM7IFVJIFx1NEYxQVx1NTcyOFx1NEUwQlx1NEUwMFx1NkIyMVx1NTIzN1x1NjVCMFx1NjVGNlx1NjA2Mlx1NTkwRFxuICAgIH1cbiAgfVxuICByZXR1cm4geyByb290OiBib3gsIHVwZGF0ZSwgb3JlRWwsIGNvaW5FbCB9O1xufVxuIiwgImltcG9ydCB7IE5ldHdvcmtNYW5hZ2VyIH0gZnJvbSAnLi4vY29yZS9OZXR3b3JrTWFuYWdlcic7XHJcbmltcG9ydCB7IFJlYWx0aW1lQ2xpZW50IH0gZnJvbSAnLi4vY29yZS9SZWFsdGltZUNsaWVudCc7XHJcbmltcG9ydCB7IGh0bWwsIHFzIH0gZnJvbSAnLi4vdXRpbHMvZG9tJztcclxuaW1wb3J0IHsgcmVuZGVyTmF2IH0gZnJvbSAnLi4vY29tcG9uZW50cy9OYXYnO1xyXG5pbXBvcnQgeyByZW5kZXJSZXNvdXJjZUJhciB9IGZyb20gJy4uL2NvbXBvbmVudHMvUmVzb3VyY2VCYXInO1xyXG5pbXBvcnQgeyBzaG93VG9hc3QgfSBmcm9tICcuLi9jb21wb25lbnRzL1RvYXN0JztcclxuaW1wb3J0IHsgc3Bhd25GbG9hdFRleHQgfSBmcm9tICcuLi9jb21wb25lbnRzL0Zsb2F0VGV4dCc7XHJcbmltcG9ydCB7IHJlbmRlckljb24gfSBmcm9tICcuLi9jb21wb25lbnRzL0ljb24nO1xyXG5cclxudHlwZSBNaW5lU3RhdHVzID0ge1xyXG4gIGNhcnRBbW91bnQ6IG51bWJlcjtcclxuICBjYXJ0Q2FwYWNpdHk6IG51bWJlcjtcclxuICBjb2xsYXBzZWQ6IGJvb2xlYW47XHJcbiAgY29sbGFwc2VkUmVtYWluaW5nOiBudW1iZXI7XHJcbiAgcnVubmluZzogYm9vbGVhbjtcclxuICBpbnRlcnZhbE1zOiBudW1iZXI7XHJcbn07XHJcblxyXG50eXBlIFBlbmRpbmdBY3Rpb24gPSAnc3RhcnQnIHwgJ3N0b3AnIHwgJ2NvbGxlY3QnIHwgJ3JlcGFpcicgfCAnc3RhdHVzJyB8IG51bGw7XHJcblxyXG5leHBvcnQgY2xhc3MgTWFpblNjZW5lIHtcclxuICBwcml2YXRlIHZpZXc6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XHJcbiAgcHJpdmF0ZSBjYXJ0QW10ID0gMDtcclxuICBwcml2YXRlIGNhcnRDYXAgPSAxMDAwO1xyXG4gIHByaXZhdGUgaXNNaW5pbmcgPSBmYWxzZTtcclxuICBwcml2YXRlIGlzQ29sbGFwc2VkID0gZmFsc2U7XHJcbiAgcHJpdmF0ZSBjb2xsYXBzZVJlbWFpbmluZyA9IDA7XHJcbiAgcHJpdmF0ZSBjb2xsYXBzZVRpbWVyOiBudW1iZXIgfCBudWxsID0gbnVsbDtcclxuICBwcml2YXRlIGludGVydmFsTXMgPSAzMDAwO1xyXG4gIHByaXZhdGUgcGVuZGluZzogUGVuZGluZ0FjdGlvbiA9IG51bGw7XHJcblxyXG4gIHByaXZhdGUgZWxzID0ge1xyXG4gICAgZmlsbDogbnVsbCBhcyBIVE1MRWxlbWVudCB8IG51bGwsXHJcbiAgICBwZXJjZW50OiBudWxsIGFzIEhUTUxFbGVtZW50IHwgbnVsbCxcclxuICAgIHN0YXR1c1RleHQ6IG51bGwgYXMgSFRNTEVsZW1lbnQgfCBudWxsLFxyXG4gICAgcmluZzogbnVsbCBhcyBIVE1MRWxlbWVudCB8IG51bGwsXHJcbiAgICByaW5nUGN0OiBudWxsIGFzIEhUTUxFbGVtZW50IHwgbnVsbCxcclxuICAgIGN5Y2xlOiBudWxsIGFzIEhUTUxFbGVtZW50IHwgbnVsbCxcclxuICAgIHN0YXR1c1RhZzogbnVsbCBhcyBIVE1MRWxlbWVudCB8IG51bGwsXHJcbiAgICBldmVudHM6IG51bGwgYXMgSFRNTEVsZW1lbnQgfCBudWxsLFxyXG4gICAgc3RhcnQ6IG51bGwgYXMgSFRNTEJ1dHRvbkVsZW1lbnQgfCBudWxsLFxyXG4gICAgc3RvcDogbnVsbCBhcyBIVE1MQnV0dG9uRWxlbWVudCB8IG51bGwsXHJcbiAgICBjb2xsZWN0OiBudWxsIGFzIEhUTUxCdXR0b25FbGVtZW50IHwgbnVsbCxcclxuICAgIHJlcGFpcjogbnVsbCBhcyBIVE1MQnV0dG9uRWxlbWVudCB8IG51bGwsXHJcbiAgICBzdGF0dXNCdG46IG51bGwgYXMgSFRNTEJ1dHRvbkVsZW1lbnQgfCBudWxsLFxyXG4gICAgaG9sb2dyYW06IG51bGwgYXMgSFRNTEVsZW1lbnQgfCBudWxsLFxyXG4gIH07XHJcblxyXG4gIHByaXZhdGUgbWluZVVwZGF0ZUhhbmRsZXI/OiAobXNnOiBhbnkpID0+IHZvaWQ7XHJcbiAgcHJpdmF0ZSBtaW5lQ29sbGFwc2VIYW5kbGVyPzogKG1zZzogYW55KSA9PiB2b2lkO1xyXG4gIHByaXZhdGUgcGx1bmRlckhhbmRsZXI/OiAobXNnOiBhbnkpID0+IHZvaWQ7XHJcblxyXG4gIGFzeW5jIG1vdW50KHJvb3Q6IEhUTUxFbGVtZW50KSB7XHJcbiAgICB0aGlzLmNsZWFyQ29sbGFwc2VUaW1lcigpO1xyXG4gICAgdGhpcy5wZW5kaW5nID0gbnVsbDtcclxuXHJcbiAgICBjb25zdCBuYXYgPSByZW5kZXJOYXYoJ21haW4nKTtcclxuICAgIGNvbnN0IGJhciA9IHJlbmRlclJlc291cmNlQmFyKCk7XHJcbiAgICBjb25zdCB2aWV3ID0gaHRtbChgXHJcbiAgICAgIDxzZWN0aW9uIGNsYXNzPVwibWFpbi1zY3JlZW5cIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwibWFpbi1hbWJpZW50XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+XHJcbiAgICAgICAgICA8c3BhbiBjbGFzcz1cImFtYmllbnQgb3JiIG9yYi1hXCI+PC9zcGFuPlxyXG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJhbWJpZW50IG9yYiBvcmItYlwiPjwvc3Bhbj5cclxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYW1iaWVudCBncmlkXCI+PC9zcGFuPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXIgbWFpbi1zdGFja1wiIHN0eWxlPVwiY29sb3I6I2ZmZjtcIj5cclxuICAgICAgICAgIDxzZWN0aW9uIGNsYXNzPVwibWluZSBjYXJkIG1pbmUtY2FyZCBmYWRlLWluXCI+XHJcbiAgICAgICAgICAgIDxoZWFkZXIgY2xhc3M9XCJtaW5lLWhlYWRlclwiPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtaW5lLXRpdGxlXCI+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInRpdGxlLWljb25cIiBkYXRhLWljbz1cInBpY2tcIj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInRpdGxlLWxhYmVsXCI+XHU2MzE2XHU3N0ZGXHU5NzYyXHU2NzdGPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtaW5lLWNoaXBzXCI+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInBpbGxcIiBpZD1cInN0YXR1c1RhZ1wiPlx1NUY4NVx1NjczQTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicGlsbCBwaWxsLWN5Y2xlXCI+PHNwYW4gZGF0YS1pY289XCJjbG9ja1wiPjwvc3Bhbj5cdTU0NjhcdTY3MUYgPHNwYW4gaWQ9XCJjeWNsZVwiPjNzPC9zcGFuPjwvc3Bhbj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9oZWFkZXI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtaW5lLWdyaWRcIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWluZS1nYXVnZVwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJpbmdcIiBpZD1cInJpbmdcIj5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJpbmctY29yZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGlkPVwicmluZ1BjdFwiPjAlPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzbWFsbD5cdTg4QzVcdThGN0RcdTczODc8L3NtYWxsPlxyXG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJpbmctZ2xvdyByaW5nLWdsb3ctYVwiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJpbmctZ2xvdyByaW5nLWdsb3ctYlwiPjwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtaW5lLXByb2dyZXNzXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWluZS1wcm9ncmVzcy1tZXRhXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuPlx1NzdGRlx1OEY2Nlx1ODhDNVx1OEY3RDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgPHN0cm9uZyBpZD1cInBlcmNlbnRcIj4wJTwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWluZS1wcm9ncmVzcy10cmFja1wiPlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWluZS1wcm9ncmVzcy1maWxsXCIgaWQ9XCJmaWxsXCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJzdGF0dXNUZXh0XCIgY2xhc3M9XCJtaW5lLXN0YXR1c1wiPjwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1pbmUtYWN0aW9ucy1ncmlkXCI+XHJcbiAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInN0YXJ0XCIgY2xhc3M9XCJidG4gYnRuLWJ1eSBzcGFuLTJcIj48c3BhbiBkYXRhLWljbz1cInBsYXlcIj48L3NwYW4+XHU1RjAwXHU1OUNCXHU2MzE2XHU3N0ZGPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInN0b3BcIiBjbGFzcz1cImJ0biBidG4tZ2hvc3RcIj48c3BhbiBkYXRhLWljbz1cInN0b3BcIj48L3NwYW4+XHU1MDVDXHU2QjYyPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImNvbGxlY3RcIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiPjxzcGFuIGRhdGEtaWNvPVwiY29sbGVjdFwiPjwvc3Bhbj5cdTY1MzZcdTc3RkY8L2J1dHRvbj5cclxuICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwic3RhdHVzXCIgY2xhc3M9XCJidG4gYnRuLWdob3N0XCI+PHNwYW4gZGF0YS1pY289XCJyZWZyZXNoXCI+PC9zcGFuPlx1NTIzN1x1NjVCMFx1NzJCNlx1NjAwMTwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJyZXBhaXJcIiBjbGFzcz1cImJ0biBidG4tc2VsbFwiPjxzcGFuIGRhdGEtaWNvPVwid3JlbmNoXCI+PC9zcGFuPlx1NEZFRVx1NzQwNjwvYnV0dG9uPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1pbmUtZmVlZFwiPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJldmVudC1mZWVkXCIgaWQ9XCJldmVudHNcIj48L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtaW5lLWhvbG9ncmFtXCIgaWQ9XCJob2xvZ3JhbVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxyXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibWluZS1ob2xvLWdyaWRcIj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJtaW5lLWhvbG8tZ3JpZCBkaWFnb25hbFwiPjwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm1pbmUtaG9sby1nbG93XCI+PC9zcGFuPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvc2VjdGlvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9zZWN0aW9uPlxyXG4gICAgYCk7XHJcblxyXG4gICAgcm9vdC5pbm5lckhUTUwgPSAnJztcclxuICAgIHJvb3QuYXBwZW5kQ2hpbGQobmF2KTtcclxuICAgIHJvb3QuYXBwZW5kQ2hpbGQoYmFyLnJvb3QpO1xyXG4gICAgcm9vdC5hcHBlbmRDaGlsZCh2aWV3KTtcclxuXHJcbiAgICB0aGlzLnZpZXcgPSB2aWV3O1xyXG4gICAgLy8gbW91bnQgaWNvbnMgaW4gaGVhZGVyL2J1dHRvbnNcclxuICAgIHRyeSB7XHJcbiAgICAgIHZpZXcucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtaWNvXScpXHJcbiAgICAgICAgLmZvckVhY2goKGVsKSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBuYW1lID0gKGVsIGFzIEhUTUxFbGVtZW50KS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWNvJykgYXMgYW55O1xyXG4gICAgICAgICAgdHJ5IHsgZWwuYXBwZW5kQ2hpbGQocmVuZGVySWNvbihuYW1lLCB7IHNpemU6IDIwIH0pKTsgfSBjYXRjaCB7fVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCB7fVxyXG4gICAgdGhpcy5jYWNoZUVsZW1lbnRzKCk7XHJcbiAgICB0aGlzLmF0dGFjaEhhbmRsZXJzKGJhci51cGRhdGUuYmluZChiYXIpKTtcclxuICAgIGF3YWl0IGJhci51cGRhdGUoKTtcclxuICAgIHRoaXMuc2V0dXBSZWFsdGltZSgpO1xyXG4gICAgYXdhaXQgdGhpcy5yZWZyZXNoU3RhdHVzKCk7XHJcbiAgICB0aGlzLnVwZGF0ZVByb2dyZXNzKCk7XHJcbiAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNhY2hlRWxlbWVudHMoKSB7XHJcbiAgICBpZiAoIXRoaXMudmlldykgcmV0dXJuO1xyXG4gICAgdGhpcy5lbHMuZmlsbCA9IHFzKHRoaXMudmlldywgJyNmaWxsJyk7XHJcbiAgICB0aGlzLmVscy5wZXJjZW50ID0gcXModGhpcy52aWV3LCAnI3BlcmNlbnQnKTtcclxuICAgIHRoaXMuZWxzLnN0YXR1c1RleHQgPSBxcyh0aGlzLnZpZXcsICcjc3RhdHVzVGV4dCcpO1xyXG4gICAgdGhpcy5lbHMucmluZyA9IHRoaXMudmlldy5xdWVyeVNlbGVjdG9yKCcjcmluZycpO1xyXG4gICAgdGhpcy5lbHMucmluZ1BjdCA9IHRoaXMudmlldy5xdWVyeVNlbGVjdG9yKCcjcmluZ1BjdCcpO1xyXG4gICAgdGhpcy5lbHMuY3ljbGUgPSB0aGlzLnZpZXcucXVlcnlTZWxlY3RvcignI2N5Y2xlJyk7XHJcbiAgICB0aGlzLmVscy5zdGF0dXNUYWcgPSB0aGlzLnZpZXcucXVlcnlTZWxlY3RvcignI3N0YXR1c1RhZycpO1xyXG4gICAgdGhpcy5lbHMuZXZlbnRzID0gdGhpcy52aWV3LnF1ZXJ5U2VsZWN0b3IoJyNldmVudHMnKTtcclxuICAgIHRoaXMuZWxzLnN0YXJ0ID0gcXM8SFRNTEJ1dHRvbkVsZW1lbnQ+KHRoaXMudmlldywgJyNzdGFydCcpO1xyXG4gICAgdGhpcy5lbHMuc3RvcCA9IHFzPEhUTUxCdXR0b25FbGVtZW50Pih0aGlzLnZpZXcsICcjc3RvcCcpO1xyXG4gICAgdGhpcy5lbHMuY29sbGVjdCA9IHFzPEhUTUxCdXR0b25FbGVtZW50Pih0aGlzLnZpZXcsICcjY29sbGVjdCcpO1xyXG4gICAgdGhpcy5lbHMucmVwYWlyID0gcXM8SFRNTEJ1dHRvbkVsZW1lbnQ+KHRoaXMudmlldywgJyNyZXBhaXInKTtcclxuICAgIHRoaXMuZWxzLnN0YXR1c0J0biA9IHFzPEhUTUxCdXR0b25FbGVtZW50Pih0aGlzLnZpZXcsICcjc3RhdHVzJyk7XHJcbiAgICB0aGlzLmVscy5ob2xvZ3JhbSA9IHRoaXMudmlldy5xdWVyeVNlbGVjdG9yKCcjaG9sb2dyYW0nKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXR0YWNoSGFuZGxlcnModXBkYXRlQmFyOiAoKSA9PiBQcm9taXNlPHZvaWQ+KSB7XHJcbiAgICBpZiAoIXRoaXMudmlldykgcmV0dXJuO1xyXG4gICAgdGhpcy5lbHMuc3RhcnQ/LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdGhpcy5oYW5kbGVTdGFydCgpKTtcclxuICAgIHRoaXMuZWxzLnN0b3A/LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdGhpcy5oYW5kbGVTdG9wKCkpO1xyXG4gICAgdGhpcy5lbHMuc3RhdHVzQnRuPy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRoaXMucmVmcmVzaFN0YXR1cygpKTtcclxuICAgIHRoaXMuZWxzLnJlcGFpcj8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0aGlzLmhhbmRsZVJlcGFpcigpKTtcclxuICAgIHRoaXMuZWxzLmNvbGxlY3Q/LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdGhpcy5oYW5kbGVDb2xsZWN0KHVwZGF0ZUJhcikpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzZXR1cFJlYWx0aW1lKCkge1xyXG4gICAgY29uc3QgdG9rZW4gPSAoTmV0d29ya01hbmFnZXIgYXMgYW55KS5JWyd0b2tlbiddO1xyXG4gICAgaWYgKHRva2VuKSBSZWFsdGltZUNsaWVudC5JLmNvbm5lY3QodG9rZW4pO1xyXG5cclxuICAgIGlmICh0aGlzLm1pbmVVcGRhdGVIYW5kbGVyKSBSZWFsdGltZUNsaWVudC5JLm9mZignbWluZS51cGRhdGUnLCB0aGlzLm1pbmVVcGRhdGVIYW5kbGVyKTtcclxuICAgIGlmICh0aGlzLm1pbmVDb2xsYXBzZUhhbmRsZXIpIFJlYWx0aW1lQ2xpZW50Lkkub2ZmKCdtaW5lLmNvbGxhcHNlJywgdGhpcy5taW5lQ29sbGFwc2VIYW5kbGVyKTtcclxuICAgIGlmICh0aGlzLnBsdW5kZXJIYW5kbGVyKSBSZWFsdGltZUNsaWVudC5JLm9mZigncGx1bmRlci5hdHRhY2tlZCcsIHRoaXMucGx1bmRlckhhbmRsZXIpO1xyXG5cclxuICAgIHRoaXMubWluZVVwZGF0ZUhhbmRsZXIgPSAobXNnKSA9PiB7XHJcbiAgICAgIHRoaXMuY2FydEFtdCA9IHR5cGVvZiBtc2cuY2FydEFtb3VudCA9PT0gJ251bWJlcicgPyBtc2cuY2FydEFtb3VudCA6IHRoaXMuY2FydEFtdDtcclxuICAgICAgdGhpcy5jYXJ0Q2FwID0gdHlwZW9mIG1zZy5jYXJ0Q2FwYWNpdHkgPT09ICdudW1iZXInID8gbXNnLmNhcnRDYXBhY2l0eSA6IHRoaXMuY2FydENhcDtcclxuICAgICAgdGhpcy5pc01pbmluZyA9IG1zZy5ydW5uaW5nID8/IHRoaXMuaXNNaW5pbmc7XHJcbiAgICAgIGlmIChtc2cuY29sbGFwc2VkICYmIG1zZy5jb2xsYXBzZWRSZW1haW5pbmcpIHtcclxuICAgICAgICB0aGlzLmJlZ2luQ29sbGFwc2VDb3VudGRvd24obXNnLmNvbGxhcHNlZFJlbWFpbmluZyk7XHJcbiAgICAgIH0gZWxzZSBpZiAoIW1zZy5jb2xsYXBzZWQpIHtcclxuICAgICAgICB0aGlzLmlzQ29sbGFwc2VkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5jbGVhckNvbGxhcHNlVGltZXIoKTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnVwZGF0ZVByb2dyZXNzKCk7XHJcbiAgICAgIGlmIChtc2cudHlwZSA9PT0gJ2NyaXRpY2FsJyAmJiBtc2cuYW1vdW50KSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0dXNNZXNzYWdlKGBcdTg5RTZcdTUzRDFcdTY2QjRcdTUxRkJcdUZGMENcdTc3RkZcdThGNjZcdTU4OUVcdTUyQTAgJHttc2cuYW1vdW50fVx1RkYwMWApO1xyXG4gICAgICAgIHRoaXMubG9nRXZlbnQoYFx1NjZCNFx1NTFGQiArJHttc2cuYW1vdW50fWApO1xyXG4gICAgICB9IGVsc2UgaWYgKG1zZy50eXBlID09PSAnbm9ybWFsJyAmJiBtc2cuYW1vdW50KSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0dXNNZXNzYWdlKGBcdTc3RkZcdThGNjZcdTU4OUVcdTUyQTAgJHttc2cuYW1vdW50fVx1RkYwQ1x1NUY1M1x1NTI0RCAke3RoaXMuZm9ybWF0UGVyY2VudCgpfWApO1xyXG4gICAgICAgIHRoaXMubG9nRXZlbnQoYFx1NjMxNlx1NjM5OCArJHttc2cuYW1vdW50fWApO1xyXG4gICAgICB9IGVsc2UgaWYgKG1zZy50eXBlID09PSAnY29sbGFwc2UnKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0dXNNZXNzYWdlKCdcdTc3RkZcdTkwNTNcdTU3NERcdTU4NENcdUZGMENcdThCRjdcdTdBQ0JcdTUzNzNcdTRGRUVcdTc0MDYnKTtcclxuICAgICAgICB0aGlzLmxvZ0V2ZW50KCdcdTc3RkZcdTkwNTNcdTU3NERcdTU4NEMnKTtcclxuICAgICAgfSBlbHNlIGlmIChtc2cudHlwZSA9PT0gJ2NvbGxlY3QnKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0dXNNZXNzYWdlKCdcdTc3RkZcdTc3RjNcdTVERjJcdTY1MzZcdTk2QzZcdUZGMENcdTc3RkZcdThGNjZcdTZFMDVcdTdBN0EnKTtcclxuICAgICAgICB0aGlzLmxvZ0V2ZW50KCdcdTY1MzZcdTk2QzZcdTVCOENcdTYyMTAnKTtcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLmlzQ29sbGFwc2VkKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0dXNNZXNzYWdlKGBcdTc3RkZcdTkwNTNcdTU3NERcdTU4NENcdUZGMENcdTUyNjlcdTRGNTkgJHt0aGlzLmNvbGxhcHNlUmVtYWluaW5nfXNgKTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMubWluZUNvbGxhcHNlSGFuZGxlciA9IChtc2cpID0+IHtcclxuICAgICAgY29uc3Qgc2Vjb25kcyA9IE51bWJlcihtc2c/LnJlcGFpcl9kdXJhdGlvbikgfHwgMDtcclxuICAgICAgaWYgKHNlY29uZHMgPiAwKSB0aGlzLmJlZ2luQ29sbGFwc2VDb3VudGRvd24oc2Vjb25kcyk7XHJcbiAgICAgIHNob3dUb2FzdChgXHU3N0ZGXHU5MDUzXHU1NzREXHU1ODRDXHVGRjBDXHU5NzAwXHU0RkVFXHU3NDA2XHVGRjA4XHU3RUE2ICR7c2Vjb25kc31zXHVGRjA5YCwgJ3dhcm4nKTtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5wbHVuZGVySGFuZGxlciA9IChtc2cpID0+IHtcclxuICAgICAgc2hvd1RvYXN0KGBcdTg4QUJcdTYzQTBcdTU5M0FcdUZGMUFcdTY3NjVcdTgxRUEgJHttc2cuYXR0YWNrZXJ9XHVGRjBDXHU2MzVGXHU1OTMxICR7bXNnLmxvc3N9YCwgJ3dhcm4nKTtcclxuICAgICAgdGhpcy5sb2dFdmVudChgXHU4OEFCICR7bXNnLmF0dGFja2VyfSBcdTYzQTBcdTU5M0EgLSR7bXNnLmxvc3N9YCk7XHJcbiAgICB9O1xyXG5cclxuICAgIFJlYWx0aW1lQ2xpZW50Lkkub24oJ21pbmUudXBkYXRlJywgdGhpcy5taW5lVXBkYXRlSGFuZGxlcik7XHJcbiAgICBSZWFsdGltZUNsaWVudC5JLm9uKCdtaW5lLmNvbGxhcHNlJywgdGhpcy5taW5lQ29sbGFwc2VIYW5kbGVyKTtcclxuICAgIFJlYWx0aW1lQ2xpZW50Lkkub24oJ3BsdW5kZXIuYXR0YWNrZWQnLCB0aGlzLnBsdW5kZXJIYW5kbGVyKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXN5bmMgaGFuZGxlU3RhcnQoKSB7XHJcbiAgICBpZiAodGhpcy5wZW5kaW5nIHx8IHRoaXMuaXNDb2xsYXBzZWQpIHtcclxuICAgICAgaWYgKHRoaXMuaXNDb2xsYXBzZWQpIHNob3dUb2FzdCgnXHU3N0ZGXHU5MDUzXHU1NzREXHU1ODRDXHVGRjBDXHU4QkY3XHU1MTQ4XHU0RkVFXHU3NDA2JywgJ3dhcm4nKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdGhpcy5wZW5kaW5nID0gJ3N0YXJ0JztcclxuICAgIHRoaXMudXBkYXRlQ29udHJvbHMoKTtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHN0YXR1cyA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDxNaW5lU3RhdHVzPignL21pbmUvc3RhcnQnLCB7IG1ldGhvZDogJ1BPU1QnIH0pO1xyXG4gICAgICB0aGlzLmFwcGx5U3RhdHVzKHN0YXR1cyk7XHJcbiAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZSgnXHU3N0ZGXHU2NzNBXHU1REYyXHU1NDJGXHU1MkE4Jyk7XHJcbiAgICAgIHNob3dUb2FzdCgnXHU3N0ZGXHU2NzNBXHU1REYyXHU1NDJGXHU1MkE4JywgJ3N1Y2Nlc3MnKTtcclxuICAgIH0gY2F0Y2ggKGU6IGFueSkge1xyXG4gICAgICBzaG93VG9hc3QoZT8ubWVzc2FnZSB8fCAnXHU1NDJGXHU1MkE4XHU1OTMxXHU4RDI1JywgJ2Vycm9yJyk7XHJcbiAgICB9IGZpbmFsbHkge1xyXG4gICAgICB0aGlzLnBlbmRpbmcgPSBudWxsO1xyXG4gICAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFzeW5jIGhhbmRsZVN0b3AoKSB7XHJcbiAgICBpZiAodGhpcy5wZW5kaW5nKSByZXR1cm47XHJcbiAgICB0aGlzLnBlbmRpbmcgPSAnc3RvcCc7XHJcbiAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzKCk7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBzdGF0dXMgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8TWluZVN0YXR1cz4oJy9taW5lL3N0b3AnLCB7IG1ldGhvZDogJ1BPU1QnIH0pO1xyXG4gICAgICB0aGlzLmFwcGx5U3RhdHVzKHN0YXR1cyk7XHJcbiAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZSgnXHU3N0ZGXHU2NzNBXHU1REYyXHU1MDVDXHU2QjYyJyk7XHJcbiAgICAgIHNob3dUb2FzdCgnXHU3N0ZGXHU2NzNBXHU1REYyXHU1MDVDXHU2QjYyJywgJ3N1Y2Nlc3MnKTtcclxuICAgIH0gY2F0Y2ggKGU6IGFueSkge1xyXG4gICAgICBzaG93VG9hc3QoZT8ubWVzc2FnZSB8fCAnXHU1MDVDXHU2QjYyXHU1OTMxXHU4RDI1JywgJ2Vycm9yJyk7XHJcbiAgICB9IGZpbmFsbHkge1xyXG4gICAgICB0aGlzLnBlbmRpbmcgPSBudWxsO1xyXG4gICAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFzeW5jIGhhbmRsZUNvbGxlY3QodXBkYXRlQmFyOiAoKSA9PiBQcm9taXNlPHZvaWQ+KSB7XHJcbiAgICBpZiAodGhpcy5wZW5kaW5nIHx8IHRoaXMuY2FydEFtdCA8PSAwKSByZXR1cm47XHJcbiAgICB0aGlzLnBlbmRpbmcgPSAnY29sbGVjdCc7XHJcbiAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzKCk7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCByZXMgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyBjb2xsZWN0ZWQ6IG51bWJlcjsgc3RhdHVzOiBNaW5lU3RhdHVzIH0+KCcvbWluZS9jb2xsZWN0JywgeyBtZXRob2Q6ICdQT1NUJyB9KTtcclxuICAgICAgaWYgKHJlcy5zdGF0dXMpIHRoaXMuYXBwbHlTdGF0dXMocmVzLnN0YXR1cyk7XHJcbiAgICAgIGlmIChyZXMuY29sbGVjdGVkID4gMCkge1xyXG4gICAgICAgIC8vIFx1NTIxQlx1NUVGQVx1NjI5Qlx1NzI2OVx1N0VCRlx1OThERVx1ODg0Q1x1NTJBOFx1NzUzQlxyXG4gICAgICAgIHRoaXMuY3JlYXRlRmx5aW5nT3JlQW5pbWF0aW9uKHJlcy5jb2xsZWN0ZWQpO1xyXG4gICAgICAgIHNob3dUb2FzdChgXHU2NTM2XHU5NkM2XHU3N0ZGXHU3N0YzICR7cmVzLmNvbGxlY3RlZH1gLCAnc3VjY2VzcycpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNob3dUb2FzdCgnXHU3N0ZGXHU4RjY2XHU0RTNBXHU3QTdBXHVGRjBDXHU2NUUwXHU3N0ZGXHU3N0YzXHU1M0VGXHU2NTM2XHU5NkM2JywgJ3dhcm4nKTtcclxuICAgICAgfVxyXG4gICAgICBhd2FpdCB1cGRhdGVCYXIoKTtcclxuICAgIH0gY2F0Y2ggKGU6IGFueSkge1xyXG4gICAgICBzaG93VG9hc3QoZT8ubWVzc2FnZSB8fCAnXHU2NTM2XHU3N0ZGXHU1OTMxXHU4RDI1JywgJ2Vycm9yJyk7XHJcbiAgICB9IGZpbmFsbHkge1xyXG4gICAgICB0aGlzLnBlbmRpbmcgPSBudWxsO1xyXG4gICAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNyZWF0ZUZseWluZ09yZUFuaW1hdGlvbihhbW91bnQ6IG51bWJlcikge1xyXG4gICAgY29uc3QgZmlsbEVsID0gdGhpcy5lbHMuZmlsbDtcclxuICAgIGNvbnN0IG9yZUVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI29yZScpO1xyXG4gICAgaWYgKCFmaWxsRWwgfHwgIW9yZUVsKSByZXR1cm47XHJcblxyXG4gICAgY29uc3Qgc3RhcnRSZWN0ID0gZmlsbEVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgY29uc3QgZW5kUmVjdCA9IG9yZUVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cclxuICAgIC8vIFx1NTIxQlx1NUVGQVx1NTkxQVx1NEUyQVx1NzdGRlx1NzdGM1x1N0M5Mlx1NUI1MFxyXG4gICAgY29uc3QgcGFydGljbGVDb3VudCA9IE1hdGgubWluKDgsIE1hdGgubWF4KDMsIE1hdGguZmxvb3IoYW1vdW50IC8gMjApKSk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcnRpY2xlQ291bnQ7IGkrKykge1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBjb25zdCBwYXJ0aWNsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHBhcnRpY2xlLmNsYXNzTmFtZSA9ICdvcmUtcGFydGljbGUnO1xyXG4gICAgICAgIHBhcnRpY2xlLnRleHRDb250ZW50ID0gJ1x1RDgzRFx1REM4RSc7XHJcbiAgICAgICAgcGFydGljbGUuc3R5bGUuY3NzVGV4dCA9IGBcclxuICAgICAgICAgIHBvc2l0aW9uOiBmaXhlZDtcclxuICAgICAgICAgIGxlZnQ6ICR7c3RhcnRSZWN0LmxlZnQgKyBzdGFydFJlY3Qud2lkdGggLyAyfXB4O1xyXG4gICAgICAgICAgdG9wOiAke3N0YXJ0UmVjdC50b3AgKyBzdGFydFJlY3QuaGVpZ2h0IC8gMn1weDtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMjRweDtcclxuICAgICAgICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xyXG4gICAgICAgICAgei1pbmRleDogOTk5OTtcclxuICAgICAgICAgIGZpbHRlcjogZHJvcC1zaGFkb3coMCAwIDhweCByZ2JhKDEyMyw0NCwyNDUsMC44KSk7XHJcbiAgICAgICAgYDtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHBhcnRpY2xlKTtcclxuXHJcbiAgICAgICAgY29uc3QgZHggPSBlbmRSZWN0LmxlZnQgKyBlbmRSZWN0LndpZHRoIC8gMiAtIHN0YXJ0UmVjdC5sZWZ0IC0gc3RhcnRSZWN0LndpZHRoIC8gMjtcclxuICAgICAgICBjb25zdCBkeSA9IGVuZFJlY3QudG9wICsgZW5kUmVjdC5oZWlnaHQgLyAyIC0gc3RhcnRSZWN0LnRvcCAtIHN0YXJ0UmVjdC5oZWlnaHQgLyAyO1xyXG4gICAgICAgIGNvbnN0IHJhbmRvbU9mZnNldCA9IChNYXRoLnJhbmRvbSgpIC0gMC41KSAqIDEwMDtcclxuXHJcbiAgICAgICAgcGFydGljbGUuYW5pbWF0ZShbXHJcbiAgICAgICAgICB7IFxyXG4gICAgICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGUoMCwgMCkgc2NhbGUoMSknLCBcclxuICAgICAgICAgICAgb3BhY2l0eTogMSBcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7IFxyXG4gICAgICAgICAgICB0cmFuc2Zvcm06IGB0cmFuc2xhdGUoJHtkeC8yICsgcmFuZG9tT2Zmc2V0fXB4LCAke2R5IC0gMTUwfXB4KSBzY2FsZSgxLjIpYCwgXHJcbiAgICAgICAgICAgIG9wYWNpdHk6IDEsXHJcbiAgICAgICAgICAgIG9mZnNldDogMC41XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgeyBcclxuICAgICAgICAgICAgdHJhbnNmb3JtOiBgdHJhbnNsYXRlKCR7ZHh9cHgsICR7ZHl9cHgpIHNjYWxlKDAuNSlgLCBcclxuICAgICAgICAgICAgb3BhY2l0eTogMCBcclxuICAgICAgICAgIH1cclxuICAgICAgICBdLCB7XHJcbiAgICAgICAgICBkdXJhdGlvbjogMTAwMCArIGkgKiA1MCxcclxuICAgICAgICAgIGVhc2luZzogJ2N1YmljLWJlemllcigwLjI1LCAwLjQ2LCAwLjQ1LCAwLjk0KSdcclxuICAgICAgICB9KS5vbmZpbmlzaCA9ICgpID0+IHtcclxuICAgICAgICAgIHBhcnRpY2xlLnJlbW92ZSgpO1xyXG4gICAgICAgICAgLy8gXHU2NzAwXHU1NDBFXHU0RTAwXHU0RTJBXHU3QzkyXHU1QjUwXHU1MjMwXHU4RkJFXHU2NUY2XHVGRjBDXHU2REZCXHU1MkEwXHU4MTA5XHU1MUIyXHU2NTQ4XHU2NzlDXHJcbiAgICAgICAgICBpZiAoaSA9PT0gcGFydGljbGVDb3VudCAtIDEpIHtcclxuICAgICAgICAgICAgb3JlRWwuY2xhc3NMaXN0LmFkZCgnZmxhc2gnKTtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBvcmVFbC5jbGFzc0xpc3QucmVtb3ZlKCdmbGFzaCcpLCA5MDApO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgIH0sIGkgKiA4MCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFzeW5jIGhhbmRsZVJlcGFpcigpIHtcclxuICAgIGlmICh0aGlzLnBlbmRpbmcgfHwgIXRoaXMuaXNDb2xsYXBzZWQpIHJldHVybjtcclxuICAgIHRoaXMucGVuZGluZyA9ICdyZXBhaXInO1xyXG4gICAgdGhpcy51cGRhdGVDb250cm9scygpO1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3Qgc3RhdHVzID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PE1pbmVTdGF0dXM+KCcvbWluZS9yZXBhaXInLCB7IG1ldGhvZDogJ1BPU1QnIH0pO1xyXG4gICAgICB0aGlzLmFwcGx5U3RhdHVzKHN0YXR1cyk7XHJcbiAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZSgnXHU3N0ZGXHU5MDUzXHU1REYyXHU0RkVFXHU1OTBEXHVGRjBDXHU1M0VGXHU5MUNEXHU2NUIwXHU1NDJGXHU1MkE4Jyk7XHJcbiAgICAgIHNob3dUb2FzdCgnXHU3N0ZGXHU5MDUzXHU1REYyXHU0RkVFXHU1OTBEJywgJ3N1Y2Nlc3MnKTtcclxuICAgIH0gY2F0Y2ggKGU6IGFueSkge1xyXG4gICAgICBzaG93VG9hc3QoZT8ubWVzc2FnZSB8fCAnXHU0RkVFXHU3NDA2XHU1OTMxXHU4RDI1JywgJ2Vycm9yJyk7XHJcbiAgICB9IGZpbmFsbHkge1xyXG4gICAgICB0aGlzLnBlbmRpbmcgPSBudWxsO1xyXG4gICAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFzeW5jIHJlZnJlc2hTdGF0dXMoKSB7XHJcbiAgICBpZiAodGhpcy5wZW5kaW5nID09PSAnc3RhdHVzJykgcmV0dXJuO1xyXG4gICAgdGhpcy5wZW5kaW5nID0gJ3N0YXR1cyc7XHJcbiAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzKCk7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBzdGF0dXMgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8TWluZVN0YXR1cz4oJy9taW5lL3N0YXR1cycpO1xyXG4gICAgICB0aGlzLmFwcGx5U3RhdHVzKHN0YXR1cyk7XHJcbiAgICB9IGNhdGNoIChlOiBhbnkpIHtcclxuICAgICAgc2hvd1RvYXN0KGU/Lm1lc3NhZ2UgfHwgJ1x1ODNCN1x1NTNENlx1NzJCNlx1NjAwMVx1NTkzMVx1OEQyNScsICdlcnJvcicpO1xyXG4gICAgfSBmaW5hbGx5IHtcclxuICAgICAgdGhpcy5wZW5kaW5nID0gbnVsbDtcclxuICAgICAgdGhpcy51cGRhdGVDb250cm9scygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhcHBseVN0YXR1cyhzdGF0dXM6IE1pbmVTdGF0dXMgfCB1bmRlZmluZWQsIG9wdHM6IHsgcXVpZXQ/OiBib29sZWFuIH0gPSB7fSkge1xyXG4gICAgaWYgKCFzdGF0dXMpIHJldHVybjtcclxuICAgIHRoaXMuY2FydEFtdCA9IHN0YXR1cy5jYXJ0QW1vdW50ID8/IHRoaXMuY2FydEFtdDtcclxuICAgIHRoaXMuY2FydENhcCA9IHN0YXR1cy5jYXJ0Q2FwYWNpdHkgPz8gdGhpcy5jYXJ0Q2FwO1xyXG4gICAgdGhpcy5pbnRlcnZhbE1zID0gc3RhdHVzLmludGVydmFsTXMgPz8gdGhpcy5pbnRlcnZhbE1zO1xyXG4gICAgdGhpcy5pc01pbmluZyA9IEJvb2xlYW4oc3RhdHVzLnJ1bm5pbmcpO1xyXG4gICAgdGhpcy5pc0NvbGxhcHNlZCA9IEJvb2xlYW4oc3RhdHVzLmNvbGxhcHNlZCk7XHJcbiAgICBpZiAoc3RhdHVzLmNvbGxhcHNlZCAmJiBzdGF0dXMuY29sbGFwc2VkUmVtYWluaW5nID4gMCkge1xyXG4gICAgICB0aGlzLmJlZ2luQ29sbGFwc2VDb3VudGRvd24oc3RhdHVzLmNvbGxhcHNlZFJlbWFpbmluZyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmNsZWFyQ29sbGFwc2VUaW1lcigpO1xyXG4gICAgICB0aGlzLmNvbGxhcHNlUmVtYWluaW5nID0gMDtcclxuICAgIH1cclxuICAgIHRoaXMudXBkYXRlUHJvZ3Jlc3MoKTtcclxuICAgIGlmICghb3B0cy5xdWlldCkge1xyXG4gICAgICBpZiAodGhpcy5pc0NvbGxhcHNlZCAmJiB0aGlzLmNvbGxhcHNlUmVtYWluaW5nID4gMCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZShgXHU3N0ZGXHU5MDUzXHU1NzREXHU1ODRDXHVGRjBDXHU1MjY5XHU0RjU5ICR7dGhpcy5jb2xsYXBzZVJlbWFpbmluZ31zYCk7XHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pc01pbmluZykge1xyXG4gICAgICAgIGNvbnN0IHNlY29uZHMgPSBNYXRoLm1heCgxLCBNYXRoLnJvdW5kKHRoaXMuaW50ZXJ2YWxNcyAvIDEwMDApKTtcclxuICAgICAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoYFx1NzdGRlx1NjczQVx1OEZEMFx1ODg0Q1x1NEUyRFx1RkYwQ1x1NTQ2OFx1NjcxRlx1N0VBNiAke3NlY29uZHN9c1x1RkYwQ1x1NUY1M1x1NTI0RCAke3RoaXMuZm9ybWF0UGVyY2VudCgpfWApO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZSgnXHU3N0ZGXHU2NzNBXHU1REYyXHU1MDVDXHU2QjYyXHVGRjBDXHU3MEI5XHU1MUZCXHU1RjAwXHU1OUNCXHU2MzE2XHU3N0ZGJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICh0aGlzLmVscy5jeWNsZSkge1xyXG4gICAgICBjb25zdCBzZWNvbmRzID0gTWF0aC5tYXgoMSwgTWF0aC5yb3VuZCh0aGlzLmludGVydmFsTXMgLyAxMDAwKSk7XHJcbiAgICAgIHRoaXMuZWxzLmN5Y2xlLnRleHRDb250ZW50ID0gYCR7c2Vjb25kc31zYDtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLmVscy5zdGF0dXNUYWcpIHtcclxuICAgICAgY29uc3QgZWwgPSB0aGlzLmVscy5zdGF0dXNUYWcgYXMgSFRNTEVsZW1lbnQ7XHJcbiAgICAgIGVsLmlubmVySFRNTCA9ICcnO1xyXG4gICAgICBcclxuICAgICAgLy8gXHU3OUZCXHU5NjY0XHU2MjQwXHU2NzA5XHU3MkI2XHU2MDAxXHU3QzdCXHJcbiAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ3BpbGwtcnVubmluZycsICdwaWxsLWNvbGxhcHNlZCcpO1xyXG4gICAgICBcclxuICAgICAgY29uc3QgaWNvID0gdGhpcy5pc0NvbGxhcHNlZCA/ICdjbG9zZScgOiAodGhpcy5pc01pbmluZyA/ICdib2x0JyA6ICdjbG9jaycpO1xyXG4gICAgICB0cnkgeyBlbC5hcHBlbmRDaGlsZChyZW5kZXJJY29uKGljbyBhcyBhbnksIHsgc2l6ZTogMTYgfSkpOyB9IGNhdGNoIHt9XHJcbiAgICAgIGVsLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRoaXMuaXNDb2xsYXBzZWQgPyAnXHU1NzREXHU1ODRDJyA6ICh0aGlzLmlzTWluaW5nID8gJ1x1OEZEMFx1ODg0Q1x1NEUyRCcgOiAnXHU1Rjg1XHU2NzNBJykpKTtcclxuICAgICAgXHJcbiAgICAgIC8vIFx1NkRGQlx1NTJBMFx1NUJGOVx1NUU5NFx1NzY4NFx1NTJBOFx1NjAwMVx1NjgzN1x1NUYwRlx1N0M3QlxyXG4gICAgICBpZiAodGhpcy5pc0NvbGxhcHNlZCkge1xyXG4gICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoJ3BpbGwtY29sbGFwc2VkJyk7XHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pc01pbmluZykge1xyXG4gICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoJ3BpbGwtcnVubmluZycpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGJlZ2luQ29sbGFwc2VDb3VudGRvd24oc2Vjb25kczogbnVtYmVyKSB7XHJcbiAgICB0aGlzLmNsZWFyQ29sbGFwc2VUaW1lcigpO1xyXG4gICAgdGhpcy5pc0NvbGxhcHNlZCA9IHRydWU7XHJcbiAgICB0aGlzLmNvbGxhcHNlUmVtYWluaW5nID0gTWF0aC5tYXgoMCwgTWF0aC5mbG9vcihzZWNvbmRzKSk7XHJcbiAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoYFx1NzdGRlx1OTA1M1x1NTc0RFx1NTg0Q1x1RkYwQ1x1NTI2OVx1NEY1OSAke3RoaXMuY29sbGFwc2VSZW1haW5pbmd9c2ApO1xyXG4gICAgdGhpcy51cGRhdGVDb250cm9scygpO1xyXG4gICAgdGhpcy5jb2xsYXBzZVRpbWVyID0gd2luZG93LnNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgdGhpcy5jb2xsYXBzZVJlbWFpbmluZyA9IE1hdGgubWF4KDAsIHRoaXMuY29sbGFwc2VSZW1haW5pbmcgLSAxKTtcclxuICAgICAgaWYgKHRoaXMuY29sbGFwc2VSZW1haW5pbmcgPD0gMCkge1xyXG4gICAgICAgIHRoaXMuY2xlYXJDb2xsYXBzZVRpbWVyKCk7XHJcbiAgICAgICAgdGhpcy5pc0NvbGxhcHNlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZSgnXHU1NzREXHU1ODRDXHU4OUUzXHU5NjY0XHVGRjBDXHU1M0VGXHU5MUNEXHU2NUIwXHU1NDJGXHU1MkE4XHU3N0ZGXHU2NzNBJyk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVDb250cm9scygpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZShgXHU3N0ZGXHU5MDUzXHU1NzREXHU1ODRDXHVGRjBDXHU1MjY5XHU0RjU5ICR7dGhpcy5jb2xsYXBzZVJlbWFpbmluZ31zYCk7XHJcbiAgICAgIH1cclxuICAgIH0sIDEwMDApO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjbGVhckNvbGxhcHNlVGltZXIoKSB7XHJcbiAgICBpZiAodGhpcy5jb2xsYXBzZVRpbWVyICE9PSBudWxsKSB7XHJcbiAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKHRoaXMuY29sbGFwc2VUaW1lcik7XHJcbiAgICAgIHRoaXMuY29sbGFwc2VUaW1lciA9IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGxhc3RNaWxlc3RvbmUgPSAwO1xyXG5cclxuICBwcml2YXRlIHVwZGF0ZVByb2dyZXNzKCkge1xyXG4gICAgaWYgKCF0aGlzLmVscy5maWxsIHx8ICF0aGlzLmVscy5wZXJjZW50KSByZXR1cm47XHJcbiAgICBjb25zdCBwY3QgPSB0aGlzLmNhcnRDYXAgPiAwID8gTWF0aC5taW4oMSwgdGhpcy5jYXJ0QW10IC8gdGhpcy5jYXJ0Q2FwKSA6IDA7XHJcbiAgICBjb25zdCBwY3RJbnQgPSBNYXRoLnJvdW5kKHBjdCAqIDEwMCk7XHJcbiAgICBcclxuICAgIHRoaXMuZWxzLmZpbGwuc3R5bGUud2lkdGggPSBgJHtwY3RJbnR9JWA7XHJcbiAgICB0aGlzLmVscy5wZXJjZW50LnRleHRDb250ZW50ID0gYCR7cGN0SW50fSVgO1xyXG4gICAgXHJcbiAgICAvLyBcdTU3MDZcdTczQUZcdTk4OUNcdTgyNzJcdTZFMTBcdTUzRDhcdUZGMUFcdTdEMkJcdTgyNzIgLT4gXHU4NEREXHU4MjcyIC0+IFx1OTFEMVx1ODI3MlxyXG4gICAgbGV0IHJpbmdDb2xvciA9ICcjN0IyQ0Y1JzsgLy8gXHU3RDJCXHU4MjcyXHJcbiAgICBpZiAocGN0ID49IDAuNzUpIHtcclxuICAgICAgcmluZ0NvbG9yID0gJyNmNmM0NDUnOyAvLyBcdTkxRDFcdTgyNzJcclxuICAgIH0gZWxzZSBpZiAocGN0ID49IDAuNSkge1xyXG4gICAgICByaW5nQ29sb3IgPSAnIzJDODlGNSc7IC8vIFx1ODRERFx1ODI3MlxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpZiAodGhpcy5lbHMucmluZykge1xyXG4gICAgICBjb25zdCBkZWcgPSBNYXRoLnJvdW5kKHBjdCAqIDM2MCk7XHJcbiAgICAgICh0aGlzLmVscy5yaW5nIGFzIEhUTUxFbGVtZW50KS5zdHlsZS5iYWNrZ3JvdW5kID0gYGNvbmljLWdyYWRpZW50KCR7cmluZ0NvbG9yfSAke2RlZ31kZWcsIHJnYmEoMjU1LDI1NSwyNTUsLjA4KSAwZGVnKWA7XHJcbiAgICAgIFxyXG4gICAgICAvLyBcdTZFRTFcdThGN0RcdTY1RjZcdTYzMDFcdTdFRURcdTk1RUFcdTgwMDBcclxuICAgICAgaWYgKHBjdCA+PSAxKSB7XHJcbiAgICAgICAgdGhpcy5lbHMucmluZy5jbGFzc0xpc3QuYWRkKCdyaW5nLWZ1bGwnKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmVscy5yaW5nLmNsYXNzTGlzdC5yZW1vdmUoJ3JpbmctZnVsbCcpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGlmICh0aGlzLmVscy5yaW5nUGN0KSB0aGlzLmVscy5yaW5nUGN0LnRleHRDb250ZW50ID0gYCR7cGN0SW50fSVgO1xyXG4gICAgXHJcbiAgICAvLyBcdTkxQ0NcdTdBMEJcdTc4OTFcdTgxMDlcdTUxQjJcdTcyNzlcdTY1NDhcclxuICAgIGNvbnN0IG1pbGVzdG9uZXMgPSBbMjUsIDUwLCA3NSwgMTAwXTtcclxuICAgIGZvciAoY29uc3QgbWlsZXN0b25lIG9mIG1pbGVzdG9uZXMpIHtcclxuICAgICAgaWYgKHBjdEludCA+PSBtaWxlc3RvbmUgJiYgdGhpcy5sYXN0TWlsZXN0b25lIDwgbWlsZXN0b25lKSB7XHJcbiAgICAgICAgdGhpcy50cmlnZ2VyTWlsZXN0b25lUHVsc2UobWlsZXN0b25lKTtcclxuICAgICAgICB0aGlzLmxhc3RNaWxlc3RvbmUgPSBtaWxlc3RvbmU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gXHU1RjUzXHU4OEM1XHU4RjdEXHU3Mzg3XHU0RTBCXHU5NjREXHVGRjA4XHU2NTM2XHU3N0ZGXHU1NDBFXHVGRjA5XHU5MUNEXHU3RjZFXHU5MUNDXHU3QTBCXHU3ODkxXHJcbiAgICBpZiAocGN0SW50IDwgdGhpcy5sYXN0TWlsZXN0b25lIC0gMTApIHtcclxuICAgICAgdGhpcy5sYXN0TWlsZXN0b25lID0gTWF0aC5mbG9vcihwY3RJbnQgLyAyNSkgKiAyNTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gOTAlXHU4QjY2XHU1NDRBXHU2M0QwXHU3OTNBXHJcbiAgICBpZiAocGN0SW50ID49IDkwICYmIHBjdEludCA8IDEwMCkge1xyXG4gICAgICBpZiAoIXRoaXMuZWxzLnN0YXR1c1RleHQ/LnRleHRDb250ZW50Py5pbmNsdWRlcygnXHU1MzczXHU1QzA2XHU2RUUxXHU4RjdEJykpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoJ1x1MjZBMFx1RkUwRiBcdTc3RkZcdThGNjZcdTUzNzNcdTVDMDZcdTZFRTFcdThGN0RcdUZGMENcdTVFRkFcdThCQUVcdTY1MzZcdTc3RkYnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpZiAodGhpcy5wZW5kaW5nICE9PSAnY29sbGVjdCcgJiYgdGhpcy5lbHMuY29sbGVjdCkge1xyXG4gICAgICB0aGlzLmVscy5jb2xsZWN0LmRpc2FibGVkID0gdGhpcy5wZW5kaW5nID09PSAnY29sbGVjdCcgfHwgdGhpcy5jYXJ0QW10IDw9IDA7XHJcbiAgICAgIFxyXG4gICAgICAvLyBcdTUzRUZcdTY1MzZcdTc3RkZcdTY1RjZcdTZERkJcdTUyQTBcdTgwRkRcdTkxQ0ZcdTcyNzlcdTY1NDhcclxuICAgICAgaWYgKHRoaXMuY2FydEFtdCA+IDAgJiYgIXRoaXMuZWxzLmNvbGxlY3QuZGlzYWJsZWQpIHtcclxuICAgICAgICB0aGlzLmVscy5jb2xsZWN0LmNsYXNzTGlzdC5hZGQoJ2J0bi1lbmVyZ3knKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmVscy5jb2xsZWN0LmNsYXNzTGlzdC5yZW1vdmUoJ2J0bi1lbmVyZ3knKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBcdTY2RjRcdTY1QjBcdTc3RkZcdTc3RjNcdTY1NzBcdTkxQ0ZcclxuICAgIHRoaXMudXBkYXRlU2hhcmRzKHBjdCk7XHJcbiAgICBcclxuICAgIC8vIFx1NjZGNFx1NjVCMFx1NTE2OFx1NjA2Rlx1ODBDQ1x1NjY2Rlx1NzJCNlx1NjAwMVxyXG4gICAgdGhpcy51cGRhdGVIb2xvZ3JhbVN0YXRlKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHRyaWdnZXJNaWxlc3RvbmVQdWxzZShtaWxlc3RvbmU6IG51bWJlcikge1xyXG4gICAgaWYgKHRoaXMuZWxzLnJpbmcpIHtcclxuICAgICAgdGhpcy5lbHMucmluZy5jbGFzc0xpc3QuYWRkKCdtaWxlc3RvbmUtcHVsc2UnKTtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmVscy5yaW5nPy5jbGFzc0xpc3QucmVtb3ZlKCdtaWxlc3RvbmUtcHVsc2UnKSwgMTAwMCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGlmICh0aGlzLmVscy5yaW5nUGN0KSB7XHJcbiAgICAgIHRoaXMuZWxzLnJpbmdQY3QuY2xhc3NMaXN0LmFkZCgnZmxhc2gnKTtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmVscy5yaW5nUGN0Py5jbGFzc0xpc3QucmVtb3ZlKCdmbGFzaCcpLCA5MDApO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBcdTY2M0VcdTc5M0FcdTkxQ0NcdTdBMEJcdTc4OTFcdTZEODhcdTYwNkZcclxuICAgIHNob3dUb2FzdChgXHVEODNDXHVERkFGIFx1OEZCRVx1NjIxMCAke21pbGVzdG9uZX0lIFx1ODhDNVx1OEY3RFx1NzM4N1x1RkYwMWAsICdzdWNjZXNzJyk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHVwZGF0ZUhvbG9ncmFtU3RhdGUoKSB7XHJcbiAgICBpZiAoIXRoaXMuZWxzLmhvbG9ncmFtKSByZXR1cm47XHJcbiAgICBcclxuICAgIC8vIFx1NzlGQlx1OTY2NFx1NjI0MFx1NjcwOVx1NzJCNlx1NjAwMVx1N0M3QlxyXG4gICAgdGhpcy5lbHMuaG9sb2dyYW0uY2xhc3NMaXN0LnJlbW92ZSgnaG9sby1pZGxlJywgJ2hvbG8tbWluaW5nJywgJ2hvbG8tY29sbGFwc2VkJyk7XHJcbiAgICBcclxuICAgIC8vIFx1NjgzOVx1NjM2RVx1NzJCNlx1NjAwMVx1NkRGQlx1NTJBMFx1NUJGOVx1NUU5NFx1NzY4NFx1N0M3QlxyXG4gICAgaWYgKHRoaXMuaXNDb2xsYXBzZWQpIHtcclxuICAgICAgdGhpcy5lbHMuaG9sb2dyYW0uY2xhc3NMaXN0LmFkZCgnaG9sby1jb2xsYXBzZWQnKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5pc01pbmluZykge1xyXG4gICAgICB0aGlzLmVscy5ob2xvZ3JhbS5jbGFzc0xpc3QuYWRkKCdob2xvLW1pbmluZycpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5lbHMuaG9sb2dyYW0uY2xhc3NMaXN0LmFkZCgnaG9sby1pZGxlJyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHVwZGF0ZVNoYXJkcyhsb2FkUGVyY2VudDogbnVtYmVyKSB7XHJcbiAgICBpZiAoIXRoaXMuZWxzLmhvbG9ncmFtKSByZXR1cm47XHJcbiAgICBcclxuICAgIC8vIFx1OEJBMVx1N0I5N1x1NUU5NFx1OEJFNVx1NjYzRVx1NzkzQVx1NzY4NFx1NzdGRlx1NzdGM1x1NjU3MFx1OTFDRlx1RkYwOFx1ODhDNVx1OEY3RFx1NzM4N1x1OEQ4QVx1OUFEOFx1RkYwQ1x1NzdGRlx1NzdGM1x1OEQ4QVx1NTkxQVx1RkYwOVxyXG4gICAgLy8gMC0yMCU6IDJcdTRFMkEsIDIwLTQwJTogNFx1NEUyQSwgNDAtNjAlOiA2XHU0RTJBLCA2MC04MCU6IDhcdTRFMkEsIDgwLTEwMCU6IDEwXHU0RTJBXHJcbiAgICBjb25zdCB0YXJnZXRDb3VudCA9IE1hdGgubWF4KDIsIE1hdGgubWluKDEyLCBNYXRoLmZsb29yKGxvYWRQZXJjZW50ICogMTIpICsgMikpO1xyXG4gICAgXHJcbiAgICAvLyBcdTgzQjdcdTUzRDZcdTVGNTNcdTUyNERcdTc3RkZcdTc3RjNcdTUxNDNcdTdEMjBcclxuICAgIGNvbnN0IGN1cnJlbnRTaGFyZHMgPSB0aGlzLmVscy5ob2xvZ3JhbS5xdWVyeVNlbGVjdG9yQWxsKCcubWluZS1zaGFyZCcpO1xyXG4gICAgY29uc3QgY3VycmVudENvdW50ID0gY3VycmVudFNoYXJkcy5sZW5ndGg7XHJcbiAgICBcclxuICAgIC8vIFx1NTk4Mlx1Njc5Q1x1NjU3MFx1OTFDRlx1NzZGOFx1NTQwQ1x1RkYwQ1x1NEUwRFx1NTA1QVx1NTkwNFx1NzQwNlxyXG4gICAgaWYgKGN1cnJlbnRDb3VudCA9PT0gdGFyZ2V0Q291bnQpIHJldHVybjtcclxuICAgIFxyXG4gICAgLy8gXHU5NzAwXHU4OTgxXHU2REZCXHU1MkEwXHU3N0ZGXHU3N0YzXHJcbiAgICBpZiAoY3VycmVudENvdW50IDwgdGFyZ2V0Q291bnQpIHtcclxuICAgICAgY29uc3QgdG9BZGQgPSB0YXJnZXRDb3VudCAtIGN1cnJlbnRDb3VudDtcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b0FkZDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3Qgc2hhcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgc2hhcmQuY2xhc3NOYW1lID0gJ21pbmUtc2hhcmQnO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFx1OTY4Rlx1NjczQVx1NEY0RFx1N0Y2RVx1NTQ4Q1x1NTkyN1x1NUMwRlxyXG4gICAgICAgIGNvbnN0IHBvc2l0aW9ucyA9IFtcclxuICAgICAgICAgIHsgdG9wOiAnMTglJywgbGVmdDogJzE2JScsIGRlbGF5OiAtMS40LCBzY2FsZTogMSB9LFxyXG4gICAgICAgICAgeyBib3R0b206ICcxNiUnLCByaWdodDogJzIyJScsIGRlbGF5OiAtMy4yLCBzY2FsZTogMC43NCB9LFxyXG4gICAgICAgICAgeyB0b3A6ICcyNiUnLCByaWdodDogJzM0JScsIGRlbGF5OiAtNS4xLCBzY2FsZTogMC41IH0sXHJcbiAgICAgICAgICB7IHRvcDogJzQwJScsIGxlZnQ6ICcyOCUnLCBkZWxheTogLTIuNSwgc2NhbGU6IDAuODUgfSxcclxuICAgICAgICAgIHsgYm90dG9tOiAnMzAlJywgbGVmdDogJzE4JScsIGRlbGF5OiAtNC4xLCBzY2FsZTogMC42OCB9LFxyXG4gICAgICAgICAgeyB0b3A6ICcxNSUnLCByaWdodDogJzE1JScsIGRlbGF5OiAtMS44LCBzY2FsZTogMC45MiB9LFxyXG4gICAgICAgICAgeyBib3R0b206ICcyMiUnLCByaWdodDogJzQwJScsIGRlbGF5OiAtMy44LCBzY2FsZTogMC43OCB9LFxyXG4gICAgICAgICAgeyB0b3A6ICc1MCUnLCBsZWZ0OiAnMTIlJywgZGVsYXk6IC0yLjIsIHNjYWxlOiAwLjYgfSxcclxuICAgICAgICAgIHsgdG9wOiAnMzUlJywgcmlnaHQ6ICcyMCUnLCBkZWxheTogLTQuNSwgc2NhbGU6IDAuODggfSxcclxuICAgICAgICAgIHsgYm90dG9tOiAnNDAlJywgbGVmdDogJzM1JScsIGRlbGF5OiAtMy41LCBzY2FsZTogMC43IH0sXHJcbiAgICAgICAgICB7IHRvcDogJzYwJScsIHJpZ2h0OiAnMjglJywgZGVsYXk6IC0yLjgsIHNjYWxlOiAwLjY1IH0sXHJcbiAgICAgICAgICB7IGJvdHRvbTogJzUwJScsIHJpZ2h0OiAnMTIlJywgZGVsYXk6IC00LjgsIHNjYWxlOiAwLjgyIH0sXHJcbiAgICAgICAgXTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBwb3NJbmRleCA9IChjdXJyZW50Q291bnQgKyBpKSAlIHBvc2l0aW9ucy5sZW5ndGg7XHJcbiAgICAgICAgY29uc3QgcG9zID0gcG9zaXRpb25zW3Bvc0luZGV4XTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAocG9zLnRvcCkgc2hhcmQuc3R5bGUudG9wID0gcG9zLnRvcDtcclxuICAgICAgICBpZiAocG9zLmJvdHRvbSkgc2hhcmQuc3R5bGUuYm90dG9tID0gcG9zLmJvdHRvbTtcclxuICAgICAgICBpZiAocG9zLmxlZnQpIHNoYXJkLnN0eWxlLmxlZnQgPSBwb3MubGVmdDtcclxuICAgICAgICBpZiAocG9zLnJpZ2h0KSBzaGFyZC5zdHlsZS5yaWdodCA9IHBvcy5yaWdodDtcclxuICAgICAgICBzaGFyZC5zdHlsZS5hbmltYXRpb25EZWxheSA9IGAke3Bvcy5kZWxheX1zYDtcclxuICAgICAgICBzaGFyZC5zdHlsZS50cmFuc2Zvcm0gPSBgc2NhbGUoJHtwb3Muc2NhbGV9KWA7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gXHU2REZCXHU1MkEwXHU2REUxXHU1MTY1XHU1MkE4XHU3NTNCXHJcbiAgICAgICAgc2hhcmQuc3R5bGUub3BhY2l0eSA9ICcwJztcclxuICAgICAgICB0aGlzLmVscy5ob2xvZ3JhbS5hcHBlbmRDaGlsZChzaGFyZCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gXHU4OUU2XHU1M0QxXHU2REUxXHU1MTY1XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICBzaGFyZC5zdHlsZS50cmFuc2l0aW9uID0gJ29wYWNpdHkgMC41cyBlYXNlJztcclxuICAgICAgICAgIHNoYXJkLnN0eWxlLm9wYWNpdHkgPSAnMC4yNic7XHJcbiAgICAgICAgfSwgNTApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBcdTk3MDBcdTg5ODFcdTc5RkJcdTk2NjRcdTc3RkZcdTc3RjNcclxuICAgIGVsc2UgaWYgKGN1cnJlbnRDb3VudCA+IHRhcmdldENvdW50KSB7XHJcbiAgICAgIGNvbnN0IHRvUmVtb3ZlID0gY3VycmVudENvdW50IC0gdGFyZ2V0Q291bnQ7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG9SZW1vdmU7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IGxhc3RTaGFyZCA9IGN1cnJlbnRTaGFyZHNbY3VycmVudFNoYXJkcy5sZW5ndGggLSAxIC0gaV07XHJcbiAgICAgICAgaWYgKGxhc3RTaGFyZCkge1xyXG4gICAgICAgICAgKGxhc3RTaGFyZCBhcyBIVE1MRWxlbWVudCkuc3R5bGUudHJhbnNpdGlvbiA9ICdvcGFjaXR5IDAuNXMgZWFzZSc7XHJcbiAgICAgICAgICAobGFzdFNoYXJkIGFzIEhUTUxFbGVtZW50KS5zdHlsZS5vcGFjaXR5ID0gJzAnO1xyXG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGxhc3RTaGFyZC5yZW1vdmUoKTtcclxuICAgICAgICAgIH0sIDUwMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHVwZGF0ZUNvbnRyb2xzKCkge1xyXG4gICAgY29uc3QgaXNCdXN5ID0gKGtleTogUGVuZGluZ0FjdGlvbikgPT4gdGhpcy5wZW5kaW5nID09PSBrZXk7XHJcbiAgICBjb25zdCBzZXRCdG4gPSAoYnRuOiBIVE1MQnV0dG9uRWxlbWVudCB8IG51bGwsIGljb246IGFueSwgbGFiZWw6IHN0cmluZywgZGlzYWJsZWQ6IGJvb2xlYW4pID0+IHtcclxuICAgICAgaWYgKCFidG4pIHJldHVybjtcclxuICAgICAgYnRuLmRpc2FibGVkID0gZGlzYWJsZWQ7XHJcbiAgICAgIC8vIGtlZXAgZmlyc3QgY2hpbGQgYXMgaWNvbiBpZiBwcmVzZW50LCBvdGhlcndpc2UgY3JlYXRlXHJcbiAgICAgIGxldCBpY29uSG9zdCA9IGJ0bi5xdWVyeVNlbGVjdG9yKCcuaWNvbicpO1xyXG4gICAgICBpZiAoIWljb25Ib3N0KSB7XHJcbiAgICAgICAgYnRuLmluc2VydEJlZm9yZShyZW5kZXJJY29uKGljb24sIHsgc2l6ZTogMTggfSksIGJ0bi5maXJzdENoaWxkKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBSZXBsYWNlIGV4aXN0aW5nIGljb24gd2l0aCBuZXcgb25lIGlmIGljb24gbmFtZSBkaWZmZXJzIGJ5IHJlLXJlbmRlcmluZ1xyXG4gICAgICAgIGNvbnN0IGhvc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgaG9zdC5hcHBlbmRDaGlsZChyZW5kZXJJY29uKGljb24sIHsgc2l6ZTogMTggfSkpO1xyXG4gICAgICAgIC8vIHJlbW92ZSBvbGQgaWNvbiB3cmFwcGVyIGFuZCB1c2UgbmV3XHJcbiAgICAgICAgaWNvbkhvc3QucGFyZW50RWxlbWVudD8ucmVwbGFjZUNoaWxkKGhvc3QuZmlyc3RDaGlsZCBhcyBOb2RlLCBpY29uSG9zdCk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gc2V0IGxhYmVsIHRleHQgKHByZXNlcnZlIGljb24pXHJcbiAgICAgIC8vIHJlbW92ZSBleGlzdGluZyB0ZXh0IG5vZGVzXHJcbiAgICAgIEFycmF5LmZyb20oYnRuLmNoaWxkTm9kZXMpLmZvckVhY2goKG4sIGlkeCkgPT4ge1xyXG4gICAgICAgIGlmIChpZHggPiAwKSBidG4ucmVtb3ZlQ2hpbGQobik7XHJcbiAgICAgIH0pO1xyXG4gICAgICBidG4uYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobGFiZWwpKTtcclxuICAgIH07XHJcblxyXG4gICAgc2V0QnRuKHRoaXMuZWxzLnN0YXJ0LCAncGxheScsIGlzQnVzeSgnc3RhcnQnKSA/ICdcdTU0MkZcdTUyQThcdTRFMkRcdTIwMjYnIDogdGhpcy5pc01pbmluZyA/ICdcdTYzMTZcdTc3RkZcdTRFMkQnIDogJ1x1NUYwMFx1NTlDQlx1NjMxNlx1NzdGRicsIGlzQnVzeSgnc3RhcnQnKSB8fCB0aGlzLmlzTWluaW5nIHx8IHRoaXMuaXNDb2xsYXBzZWQpO1xyXG4gICAgc2V0QnRuKHRoaXMuZWxzLnN0b3AsICdzdG9wJywgaXNCdXN5KCdzdG9wJykgPyAnXHU1MDVDXHU2QjYyXHU0RTJEXHUyMDI2JyA6ICdcdTUwNUNcdTZCNjInLCBpc0J1c3koJ3N0b3AnKSB8fCAhdGhpcy5pc01pbmluZyk7XHJcbiAgICBzZXRCdG4odGhpcy5lbHMuY29sbGVjdCwgJ2NvbGxlY3QnLCBpc0J1c3koJ2NvbGxlY3QnKSA/ICdcdTY1MzZcdTk2QzZcdTRFMkRcdTIwMjYnIDogJ1x1NjUzNlx1NzdGRicsIGlzQnVzeSgnY29sbGVjdCcpIHx8IHRoaXMuY2FydEFtdCA8PSAwKTtcclxuICAgIHNldEJ0bih0aGlzLmVscy5yZXBhaXIsICd3cmVuY2gnLCBpc0J1c3koJ3JlcGFpcicpID8gJ1x1NEZFRVx1NzQwNlx1NEUyRFx1MjAyNicgOiAnXHU0RkVFXHU3NDA2JywgaXNCdXN5KCdyZXBhaXInKSB8fCAhdGhpcy5pc0NvbGxhcHNlZCk7XHJcbiAgICBzZXRCdG4odGhpcy5lbHMuc3RhdHVzQnRuLCAncmVmcmVzaCcsIGlzQnVzeSgnc3RhdHVzJykgPyAnXHU1MjM3XHU2NUIwXHU0RTJEXHUyMDI2JyA6ICdcdTUyMzdcdTY1QjBcdTcyQjZcdTYwMDEnLCBpc0J1c3koJ3N0YXR1cycpKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2V0U3RhdHVzTWVzc2FnZSh0ZXh0OiBzdHJpbmcpIHtcclxuICAgIGlmICghdGhpcy5lbHMuc3RhdHVzVGV4dCkgcmV0dXJuO1xyXG4gICAgdGhpcy5lbHMuc3RhdHVzVGV4dC50ZXh0Q29udGVudCA9IHRleHQ7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGxvZ0V2ZW50KG1zZzogc3RyaW5nKSB7XHJcbiAgICBpZiAoIXRoaXMuZWxzPy5ldmVudHMpIHJldHVybjtcclxuICAgIGNvbnN0IGxpbmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XHJcbiAgICBjb25zdCBoaCA9IFN0cmluZyhub3cuZ2V0SG91cnMoKSkucGFkU3RhcnQoMiwnMCcpO1xyXG4gICAgY29uc3QgbW0gPSBTdHJpbmcobm93LmdldE1pbnV0ZXMoKSkucGFkU3RhcnQoMiwnMCcpO1xyXG4gICAgY29uc3Qgc3MgPSBTdHJpbmcobm93LmdldFNlY29uZHMoKSkucGFkU3RhcnQoMiwnMCcpO1xyXG4gICAgXHJcbiAgICAvLyBcdTY4MzlcdTYzNkVcdTZEODhcdTYwNkZcdTdDN0JcdTU3OEJcdTZERkJcdTUyQTBcdTRFMERcdTU0MENcdTc2ODRcdTY4MzdcdTVGMEZcdTdDN0JcclxuICAgIGxldCBldmVudENsYXNzID0gJ2V2ZW50JztcclxuICAgIGlmIChtc2cuaW5jbHVkZXMoJ1x1NjZCNFx1NTFGQicpKSB7XHJcbiAgICAgIGV2ZW50Q2xhc3MgKz0gJyBldmVudC1jcml0aWNhbCc7XHJcbiAgICB9IGVsc2UgaWYgKG1zZy5pbmNsdWRlcygnXHU1NzREXHU1ODRDJykgfHwgbXNnLmluY2x1ZGVzKCdcdTYzQTBcdTU5M0EnKSkge1xyXG4gICAgICBldmVudENsYXNzICs9ICcgZXZlbnQtd2FybmluZyc7XHJcbiAgICB9IGVsc2UgaWYgKG1zZy5pbmNsdWRlcygnXHU2NTM2XHU5NkM2JykgfHwgbXNnLmluY2x1ZGVzKCdcdTYyMTBcdTUyOUYnKSkge1xyXG4gICAgICBldmVudENsYXNzICs9ICcgZXZlbnQtc3VjY2Vzcyc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBldmVudENsYXNzICs9ICcgZXZlbnQtbm9ybWFsJztcclxuICAgIH1cclxuICAgIFxyXG4gICAgbGluZS5jbGFzc05hbWUgPSBldmVudENsYXNzO1xyXG4gICAgbGluZS50ZXh0Q29udGVudCA9IGBbJHtoaH06JHttbX06JHtzc31dICR7bXNnfWA7XHJcbiAgICBcclxuICAgIC8vIFx1NkRGQlx1NTJBMFx1NkVEMVx1NTE2NVx1NTJBOFx1NzUzQlxyXG4gICAgbGluZS5zdHlsZS5vcGFjaXR5ID0gJzAnO1xyXG4gICAgbGluZS5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlWCgyMHB4KSc7XHJcbiAgICB0aGlzLmVscy5ldmVudHMucHJlcGVuZChsaW5lKTtcclxuICAgIFxyXG4gICAgLy8gXHU4OUU2XHU1M0QxXHU1MkE4XHU3NTNCXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgbGluZS5zdHlsZS50cmFuc2l0aW9uID0gJ29wYWNpdHkgMC4zcyBlYXNlLCB0cmFuc2Zvcm0gMC4zcyBlYXNlJztcclxuICAgICAgbGluZS5zdHlsZS5vcGFjaXR5ID0gJzAuOSc7XHJcbiAgICAgIGxpbmUuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVgoMCknO1xyXG4gICAgfSwgMTApO1xyXG4gICAgXHJcbiAgICAvLyBcdTY2QjRcdTUxRkJcdTRFOEJcdTRFRjZcdTZERkJcdTUyQTBcdTk1RUFcdTUxNDlcdTY1NDhcdTY3OUNcclxuICAgIGlmIChtc2cuaW5jbHVkZXMoJ1x1NjZCNFx1NTFGQicpKSB7XHJcbiAgICAgIGxpbmUuY2xhc3NMaXN0LmFkZCgnZmxhc2gnKTtcclxuICAgICAgLy8gXHU4OUU2XHU1M0QxXHU1MTY4XHU1QzQwXHU2NkI0XHU1MUZCXHU3Mjc5XHU2NTQ4XHJcbiAgICAgIHRoaXMudHJpZ2dlckNyaXRpY2FsRWZmZWN0KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHRyaWdnZXJDcml0aWNhbEVmZmVjdCgpIHtcclxuICAgIC8vIFx1NTcwNlx1NzNBRlx1OTVFQVx1NzUzNVx1NjU0OFx1Njc5Q1xyXG4gICAgaWYgKHRoaXMuZWxzLnJpbmcpIHtcclxuICAgICAgdGhpcy5lbHMucmluZy5jbGFzc0xpc3QuYWRkKCdyaW5nLXB1bHNlJyk7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5lbHMucmluZz8uY2xhc3NMaXN0LnJlbW92ZSgncmluZy1wdWxzZScpLCA2MDApO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBcdTUxNjhcdTYwNkZcdTgwQ0NcdTY2NkZcdTk1RUFcdTcwQzFcclxuICAgIGlmICh0aGlzLmVscy5ob2xvZ3JhbSkge1xyXG4gICAgICB0aGlzLmVscy5ob2xvZ3JhbS5jbGFzc0xpc3QuYWRkKCdjcml0aWNhbC1mbGFzaCcpO1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuZWxzLmhvbG9ncmFtPy5jbGFzc0xpc3QucmVtb3ZlKCdjcml0aWNhbC1mbGFzaCcpLCA0MDApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBmb3JtYXRQZXJjZW50KCkge1xyXG4gICAgY29uc3QgcGN0ID0gdGhpcy5jYXJ0Q2FwID4gMCA/IE1hdGgubWluKDEsIHRoaXMuY2FydEFtdCAvIHRoaXMuY2FydENhcCkgOiAwO1xyXG4gICAgcmV0dXJuIGAke01hdGgucm91bmQocGN0ICogMTAwKX0lYDtcclxuICB9XHJcbn0iLCAiaW1wb3J0IHsgTmV0d29ya01hbmFnZXIgfSBmcm9tICcuLi9jb3JlL05ldHdvcmtNYW5hZ2VyJztcbmltcG9ydCB7IGh0bWwsIHFzIH0gZnJvbSAnLi4vdXRpbHMvZG9tJztcbmltcG9ydCB7IHJlbmRlck5hdiB9IGZyb20gJy4uL2NvbXBvbmVudHMvTmF2JztcbmltcG9ydCB7IFJlYWx0aW1lQ2xpZW50IH0gZnJvbSAnLi4vY29yZS9SZWFsdGltZUNsaWVudCc7XG5pbXBvcnQgeyByZW5kZXJSZXNvdXJjZUJhciB9IGZyb20gJy4uL2NvbXBvbmVudHMvUmVzb3VyY2VCYXInO1xuaW1wb3J0IHsgc2hvd1RvYXN0IH0gZnJvbSAnLi4vY29tcG9uZW50cy9Ub2FzdCc7XG5pbXBvcnQgeyByZW5kZXJJY29uIH0gZnJvbSAnLi4vY29tcG9uZW50cy9JY29uJztcblxuZXhwb3J0IGNsYXNzIFdhcmVob3VzZVNjZW5lIHtcbiAgYXN5bmMgbW91bnQocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICByb290LmlubmVySFRNTCA9ICcnO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQocmVuZGVyTmF2KCd3YXJlaG91c2UnKSk7XG4gICAgY29uc3QgYmFyID0gcmVuZGVyUmVzb3VyY2VCYXIoKTtcbiAgICByb290LmFwcGVuZENoaWxkKGJhci5yb290KTtcblxuICAgIGNvbnN0IHZpZXcgPSBodG1sKGBcbiAgICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXIgZ3JpZC0yXCIgc3R5bGU9XCJjb2xvcjojZmZmO1wiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZCBmYWRlLWluXCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiIHN0eWxlPVwianVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YWxpZ24taXRlbXM6Y2VudGVyO1wiPlxuICAgICAgICAgICAgPGgzIHN0eWxlPVwibWFyZ2luOjA7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6OHB4O1wiPjxzcGFuIGRhdGEtaWNvPVwid2FyZWhvdXNlXCI+PC9zcGFuPlx1NEVEM1x1NUU5MzwvaDM+XG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwicmVmcmVzaFwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCI+PHNwYW4gZGF0YS1pY289XCJyZWZyZXNoXCI+PC9zcGFuPlx1NTIzN1x1NjVCMDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgc3R5bGU9XCJtYXJnaW4tdG9wOjEycHg7XCI+XG4gICAgICAgICAgICA8ZGV0YWlscyBvcGVuPlxuICAgICAgICAgICAgICA8c3VtbWFyeT48c3BhbiBkYXRhLWljbz1cImJveFwiPjwvc3Bhbj5cdTYyMTFcdTc2ODRcdTkwNTNcdTUxNzc8L3N1bW1hcnk+XG4gICAgICAgICAgICAgIDxkaXYgaWQ9XCJsaXN0XCIgc3R5bGU9XCJtYXJnaW4tdG9wOjhweDtkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDo4cHg7XCI+PC9kaXY+XG4gICAgICAgICAgICA8L2RldGFpbHM+XG4gICAgICAgICAgICA8ZGV0YWlscz5cbiAgICAgICAgICAgICAgPHN1bW1hcnk+PHNwYW4gZGF0YS1pY289XCJsaXN0XCI+PC9zcGFuPlx1OTA1M1x1NTE3N1x1NkEyMVx1Njc3Rjwvc3VtbWFyeT5cbiAgICAgICAgICAgICAgPGRpdiBpZD1cInRwbHNcIiBzdHlsZT1cIm1hcmdpbi10b3A6OHB4O2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjhweDtcIj48L2Rpdj5cbiAgICAgICAgICAgIDwvZGV0YWlscz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICBgKTtcbiAgICByb290LmFwcGVuZENoaWxkKHZpZXcpO1xuXG4gICAgY29uc3QgdG9rZW4gPSAoTmV0d29ya01hbmFnZXIgYXMgYW55KS5JWyd0b2tlbiddO1xuICAgIGlmICh0b2tlbikgUmVhbHRpbWVDbGllbnQuSS5jb25uZWN0KHRva2VuKTtcblxuICAgIGNvbnN0IGxpc3QgPSBxcyh2aWV3LCAnI2xpc3QnKTtcbiAgICBjb25zdCB0cGxDb250YWluZXIgPSBxcyh2aWV3LCAnI3RwbHMnKTtcbiAgICBjb25zdCByZWZyZXNoQnRuID0gcXM8SFRNTEJ1dHRvbkVsZW1lbnQ+KHZpZXcsICcjcmVmcmVzaCcpO1xuXG4gICAgY29uc3QgbW91bnRJY29ucyA9IChyb290RWw6IEVsZW1lbnQpID0+IHtcbiAgICAgIHJvb3RFbC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1pY29dJylcbiAgICAgICAgLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgICAgY29uc3QgbmFtZSA9IChlbCBhcyBIVE1MRWxlbWVudCkuZ2V0QXR0cmlidXRlKCdkYXRhLWljbycpIGFzIGFueTtcbiAgICAgICAgICB0cnkgeyBlbC5hcHBlbmRDaGlsZChyZW5kZXJJY29uKG5hbWUsIHsgc2l6ZTogMjAgfSkpOyB9IGNhdGNoIHt9XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgbW91bnRJY29ucyh2aWV3KTtcblxuICAgIGNvbnN0IGdldFJhcml0eSA9IChpdGVtOiBhbnksIHRwbD86IGFueSk6IHsga2V5OiAnY29tbW9uJ3wncmFyZSd8J2VwaWMnfCdsZWdlbmRhcnknOyB0ZXh0OiBzdHJpbmcgfSA9PiB7XG4gICAgICBjb25zdCByID0gKHRwbCAmJiAodHBsLnJhcml0eSB8fCB0cGwudGllcikpIHx8IGl0ZW0ucmFyaXR5O1xuICAgICAgY29uc3QgbGV2ZWwgPSBOdW1iZXIoaXRlbS5sZXZlbCkgfHwgMDtcbiAgICAgIGlmICh0eXBlb2YgciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgY29uc3QgayA9IHIudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgaWYgKFsnbGVnZW5kYXJ5JywnZXBpYycsJ3JhcmUnLCdjb21tb24nXS5pbmNsdWRlcyhrKSkge1xuICAgICAgICAgIHJldHVybiB7IGtleTogayBhcyBhbnksIHRleHQ6IGsgPT09ICdsZWdlbmRhcnknID8gJ1x1NEYyMFx1OEJGNCcgOiBrID09PSAnZXBpYycgPyAnXHU1M0YyXHU4QkQ3JyA6IGsgPT09ICdyYXJlJyA/ICdcdTdBMDBcdTY3MDknIDogJ1x1NjY2RVx1OTAxQScgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGxldmVsID49IDEyKSByZXR1cm4geyBrZXk6ICdsZWdlbmRhcnknLCB0ZXh0OiAnXHU0RjIwXHU4QkY0JyB9O1xuICAgICAgaWYgKGxldmVsID49IDgpIHJldHVybiB7IGtleTogJ2VwaWMnLCB0ZXh0OiAnXHU1M0YyXHU4QkQ3JyB9O1xuICAgICAgaWYgKGxldmVsID49IDQpIHJldHVybiB7IGtleTogJ3JhcmUnLCB0ZXh0OiAnXHU3QTAwXHU2NzA5JyB9O1xuICAgICAgcmV0dXJuIHsga2V5OiAnY29tbW9uJywgdGV4dDogJ1x1NjY2RVx1OTAxQScgfTtcbiAgICB9O1xuXG4gICAgY29uc3QgZm9ybWF0VGltZSA9ICh0czogbnVtYmVyKSA9PiB7XG4gICAgICB0cnkgeyByZXR1cm4gbmV3IERhdGUodHMpLnRvTG9jYWxlU3RyaW5nKCk7IH0gY2F0Y2ggeyByZXR1cm4gJycgKyB0czsgfVxuICAgIH07XG5cbiAgICBjb25zdCBsb2FkID0gYXN5bmMgKCkgPT4ge1xuICAgICAgcmVmcmVzaEJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICByZWZyZXNoQnRuLmlubmVySFRNTCA9ICc8c3BhbiBkYXRhLWljbz1cInJlZnJlc2hcIj48L3NwYW4+XHU1MjM3XHU2NUIwXHU0RTJEXHUyMDI2JztcbiAgICAgIG1vdW50SWNvbnMocmVmcmVzaEJ0bik7XG4gICAgICBhd2FpdCBiYXIudXBkYXRlKCk7XG4gICAgICBsaXN0LmlubmVySFRNTCA9ICcnO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIGxpc3QuYXBwZW5kQ2hpbGQoaHRtbCgnPGRpdiBjbGFzcz1cInNrZWxldG9uXCI+PC9kaXY+JykpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgW2RhdGEsIHRwbHNdID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICAgIE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IGl0ZW1zOiBhbnlbXSB9PignL2l0ZW1zJyksXG4gICAgICAgICAgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgdGVtcGxhdGVzOiBhbnlbXSB9PignL2l0ZW1zL3RlbXBsYXRlcycpLmNhdGNoKCgpID0+ICh7IHRlbXBsYXRlczogW10gfSkpXG4gICAgICAgIF0pO1xuICAgICAgICBjb25zdCB0cGxCeUlkOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gICAgICAgIGZvciAoY29uc3QgdCBvZiAodHBscy50ZW1wbGF0ZXMgfHwgW10pKSB0cGxCeUlkW3QuaWRdID0gdDtcbiAgICAgICAgbGlzdC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgaWYgKCFkYXRhLml0ZW1zLmxlbmd0aCkge1xuICAgICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQoaHRtbCgnPGRpdiBzdHlsZT1cIm9wYWNpdHk6Ljg7XCI+XHU2NjgyXHU2NUUwXHU5MDUzXHU1MTc3XHVGRjBDXHU1QzFEXHU4QkQ1XHU1OTFBXHU2MzE2XHU3N0ZGXHU2MjE2XHU2M0EwXHU1OTNBXHU0RUU1XHU4M0I3XHU1M0Q2XHU2NkY0XHU1OTFBXHU4RDQ0XHU2RTkwPC9kaXY+JykpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBkYXRhLml0ZW1zKSB7XG4gICAgICAgICAgY29uc3QgdHBsID0gdHBsQnlJZFtpdGVtLnRlbXBsYXRlSWRdO1xuICAgICAgICAgIGNvbnN0IHJhcml0eSA9IGdldFJhcml0eShpdGVtLCB0cGwpO1xuICAgICAgICAgIGNvbnN0IG5hbWUgPSAodHBsICYmICh0cGwubmFtZSB8fCB0cGwuaWQpKSB8fCBpdGVtLnRlbXBsYXRlSWQ7XG5cbiAgICAgICAgICBjb25zdCByb3cgPSBodG1sKGBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpdGVtLWNhcmQgaG92ZXItbGlmdCAke1xuICAgICAgICAgICAgICByYXJpdHkua2V5ID09PSAnbGVnZW5kYXJ5JyA/ICdyYXJpdHktb3V0bGluZS1sZWdlbmRhcnknIDogcmFyaXR5LmtleSA9PT0gJ2VwaWMnID8gJ3Jhcml0eS1vdXRsaW5lLWVwaWMnIDogcmFyaXR5LmtleSA9PT0gJ3JhcmUnID8gJ3Jhcml0eS1vdXRsaW5lLXJhcmUnIDogJ3Jhcml0eS1vdXRsaW5lLWNvbW1vbidcbiAgICAgICAgICAgIH1cIiBkYXRhLXJhcml0eT1cIiR7cmFyaXR5LmtleX1cIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiIHN0eWxlPVwianVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YWxpZ24taXRlbXM6ZmxleC1zdGFydDtnYXA6MTBweDtcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6NHB4O2ZsZXg6MTttaW4td2lkdGg6MDtcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJkaXNwbGF5OmZsZXg7ZmxleC13cmFwOndyYXA7Z2FwOjZweDthbGlnbi1pdGVtczpjZW50ZXI7XCI+XG4gICAgICAgICAgICAgICAgICAgIDxzdHJvbmcgc3R5bGU9XCJmb250LXNpemU6MTVweDt3aGl0ZS1zcGFjZTpub3dyYXA7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NnB4O1wiPjxzcGFuIGRhdGEtaWNvPVwib3JlXCI+PC9zcGFuPiR7bmFtZX08L3N0cm9uZz5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJiYWRnZSByYXJpdHktJHtyYXJpdHkua2V5fVwiPjxpPjwvaT4ke3Jhcml0eS50ZXh0fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgJHtpdGVtLmlzRXF1aXBwZWQgPyAnPHNwYW4gY2xhc3M9XCJwaWxsXCI+XHU1REYyXHU4OEM1XHU1OTA3PC9zcGFuPicgOiAnJ31cbiAgICAgICAgICAgICAgICAgICAgJHtpdGVtLmlzTGlzdGVkID8gJzxzcGFuIGNsYXNzPVwicGlsbFwiPlx1NjMwMlx1NTM1NVx1NEUyRDwvc3Bhbj4nIDogJyd9XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJvcGFjaXR5Oi44NTtkaXNwbGF5OmZsZXg7ZmxleC13cmFwOndyYXA7Z2FwOjhweDtcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4+XHU3QjQ5XHU3RUE3IEx2LiR7aXRlbS5sZXZlbH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicGlsbFwiPlx1NUI5RVx1NEY4QiAke2l0ZW0uaWR9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAke3RwbD8uY2F0ZWdvcnkgPyBgPHNwYW4gY2xhc3M9XCJwaWxsXCI+JHt0cGwuY2F0ZWdvcnl9PC9zcGFuPmAgOiAnJ31cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhY3Rpb25zXCI+XG4gICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1idXlcIiBkYXRhLWFjdD1cImVxdWlwXCIgZGF0YS1pZD1cIiR7aXRlbS5pZH1cIiAke2l0ZW0uaXNFcXVpcHBlZCA/ICdkaXNhYmxlZCcgOiAnJ30+PHNwYW4gZGF0YS1pY289XCJzaGllbGRcIj48L3NwYW4+XHU4OEM1XHU1OTA3PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCIgZGF0YS1hY3Q9XCJ1cGdyYWRlXCIgZGF0YS1pZD1cIiR7aXRlbS5pZH1cIj48c3BhbiBkYXRhLWljbz1cIndyZW5jaFwiPjwvc3Bhbj5cdTUzNDdcdTdFQTc8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLWdob3N0XCIgZGF0YS1hY3Q9XCJ0b2dnbGVcIiBkYXRhLWlkPVwiJHtpdGVtLmlkfVwiPjxzcGFuIGRhdGEtaWNvPVwibGlzdFwiPjwvc3Bhbj5cdThCRTZcdTYwQzU8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0aW1lbGluZVwiIGlkPVwidGwtJHtpdGVtLmlkfVwiIGhpZGRlbj48L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIGApO1xuICAgICAgICAgIG1vdW50SWNvbnMocm93KTtcbiAgICAgICAgICByb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZXYpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGV2LnRhcmdldCBhcyBIVE1MQnV0dG9uRWxlbWVudDtcbiAgICAgICAgICAgIGNvbnN0IGlkID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1pZCcpO1xuICAgICAgICAgICAgY29uc3QgYWN0ID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1hY3QnKTtcbiAgICAgICAgICAgIGlmICghaWQgfHwgIWFjdCkgcmV0dXJuO1xuICAgICAgICAgICAgaWYgKGFjdCA9PT0gJ3RvZ2dsZScpIHtcbiAgICAgICAgICAgICAgY29uc3QgYm94ID0gcm93LnF1ZXJ5U2VsZWN0b3IoYCN0bC0ke2lkfWApIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICAgICAgICBpZiAoIWJveCkgcmV0dXJuO1xuICAgICAgICAgICAgICBpZiAoIWJveC5oYXNDaGlsZE5vZGVzKCkpIHtcbiAgICAgICAgICAgICAgICBib3guaW5uZXJIVE1MID0gJzxkaXYgY2xhc3M9XCJza2VsZXRvblwiIHN0eWxlPVwiaGVpZ2h0OjM2cHg7XCI+PC9kaXY+JztcbiAgICAgICAgICAgICAgICBib3guaGlkZGVuID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IGxvZ3M6IHsgdHlwZTogc3RyaW5nOyBkZXNjPzogc3RyaW5nOyB0aW1lOiBudW1iZXIgfVtdIH0+KGAvaXRlbXMvbG9ncz9pdGVtSWQ9JHtpZH1gKTtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGxvZ3MgPSBBcnJheS5pc0FycmF5KHJlcy5sb2dzKSA/IHJlcy5sb2dzIDogW107XG4gICAgICAgICAgICAgICAgICBib3guaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgICAgICAgICBpZiAoIWxvZ3MubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGJveC5pbm5lckhUTUwgPSAnPGRpdiBzdHlsZT1cIm9wYWNpdHk6Ljg7XCI+XHU2NjgyXHU2NUUwXHU1Mzg2XHU1M0YyXHU2NTcwXHU2MzZFPC9kaXY+JztcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgbG9nIG9mIGxvZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICBjb25zdCBub2RlID0gaHRtbChgXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGltZWxpbmUtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZG90XCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0aW1lXCI+JHtmb3JtYXRUaW1lKGxvZy50aW1lKX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRlc2NcIj4keyhsb2cuZGVzYyB8fCBsb2cudHlwZSB8fCAnJykucmVwbGFjZSgvPC9nLCcmbHQ7Jyl9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICBgKTtcbiAgICAgICAgICAgICAgICAgICAgICBib3guYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICAgICAgICAgIGJveC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICAgICAgICAgIGJveC5hcHBlbmRDaGlsZChodG1sKGBcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRpbWVsaW5lLWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZG90XCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRpbWVcIj5cdTIwMTQ8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGVzY1wiPlx1Njc2NVx1NkU5MFx1NjcyQVx1NzdFNSBcdTAwQjcgXHU1M0VGXHU5MDFBXHU4RkM3XHU2MzE2XHU3N0ZGXHUzMDAxXHU2M0EwXHU1OTNBXHU2MjE2XHU0RUE0XHU2NjEzXHU4M0I3XHU1M0Q2PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgYCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBib3guaGlkZGVuID0gIWJveC5oaWRkZW47XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgdGFyZ2V0LmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgdGFyZ2V0LmlubmVySFRNTCA9IGFjdCA9PT0gJ2VxdWlwJyA/ICc8c3BhbiBkYXRhLWljbz1cInNoaWVsZFwiPjwvc3Bhbj5cdTg4QzVcdTU5MDdcdTRFMkRcdTIwMjYnIDogJzxzcGFuIGRhdGEtaWNvPVwid3JlbmNoXCI+PC9zcGFuPlx1NTM0N1x1N0VBN1x1NEUyRFx1MjAyNic7XG4gICAgICAgICAgICAgIG1vdW50SWNvbnModGFyZ2V0KTtcbiAgICAgICAgICAgICAgaWYgKGFjdCA9PT0gJ2VxdWlwJykge1xuICAgICAgICAgICAgICAgIGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdCgnL2l0ZW1zL2VxdWlwJywgeyBtZXRob2Q6ICdQT1NUJywgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBpdGVtSWQ6IGlkIH0pIH0pO1xuICAgICAgICAgICAgICAgIHNob3dUb2FzdCgnXHU4OEM1XHU1OTA3XHU2MjEwXHU1MjlGJyk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoYWN0ID09PSAndXBncmFkZScpIHtcbiAgICAgICAgICAgICAgICBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3QoJy9pdGVtcy91cGdyYWRlJywgeyBtZXRob2Q6ICdQT1NUJywgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBpdGVtSWQ6IGlkIH0pIH0pO1xuICAgICAgICAgICAgICAgIHNob3dUb2FzdCgnXHU1MzQ3XHU3RUE3XHU2MjEwXHU1MjlGJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgYXdhaXQgbG9hZCgpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgICAgICAgIHNob3dUb2FzdChlPy5tZXNzYWdlIHx8ICdcdTY0Q0RcdTRGNUNcdTU5MzFcdThEMjUnKTtcbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgIGNvbnN0IGEgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWFjdCcpO1xuICAgICAgICAgICAgICBpZiAoYSA9PT0gJ2VxdWlwJykgdGFyZ2V0LmlubmVySFRNTCA9ICc8c3BhbiBkYXRhLWljbz1cInNoaWVsZFwiPjwvc3Bhbj5cdTg4QzVcdTU5MDcnO1xuICAgICAgICAgICAgICBlbHNlIGlmIChhID09PSAndXBncmFkZScpIHRhcmdldC5pbm5lckhUTUwgPSAnPHNwYW4gZGF0YS1pY289XCJ3cmVuY2hcIj48L3NwYW4+XHU1MzQ3XHU3RUE3JztcbiAgICAgICAgICAgICAgZWxzZSB0YXJnZXQuaW5uZXJIVE1MID0gJzxzcGFuIGRhdGEtaWNvPVwibGlzdFwiPjwvc3Bhbj5cdThCRTZcdTYwQzUnO1xuICAgICAgICAgICAgICBtb3VudEljb25zKHRhcmdldCk7XG4gICAgICAgICAgICAgIHRhcmdldC5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQocm93KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRwbENvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgZm9yIChjb25zdCB0cGwgb2YgKHRwbHMudGVtcGxhdGVzIHx8IFtdKSkge1xuICAgICAgICAgIGNvbnN0IHJvdyA9IGh0bWwoYDxkaXYgY2xhc3M9XCJsaXN0LWl0ZW1cIj48c3Ryb25nPiR7dHBsLm5hbWUgfHwgdHBsLmlkfTwvc3Ryb25nPiBcdTAwQjcgJHt0cGwuY2F0ZWdvcnkgfHwgJ1x1NjcyQVx1NzdFNVx1N0M3Qlx1NTc4Qid9PC9kaXY+YCk7XG4gICAgICAgICAgdHBsQ29udGFpbmVyLmFwcGVuZENoaWxkKHJvdyk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgICBzaG93VG9hc3QoZT8ubWVzc2FnZSB8fCAnXHU1MkEwXHU4RjdEXHU0RUQzXHU1RTkzXHU1OTMxXHU4RDI1Jyk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICByZWZyZXNoQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIHJlZnJlc2hCdG4uaW5uZXJIVE1MID0gJzxzcGFuIGRhdGEtaWNvPVwicmVmcmVzaFwiPjwvc3Bhbj5cdTUyMzdcdTY1QjAnO1xuICAgICAgICBtb3VudEljb25zKHJlZnJlc2hCdG4pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZWZyZXNoQnRuLm9uY2xpY2sgPSAoKSA9PiBsb2FkKCk7XG4gICAgYXdhaXQgbG9hZCgpO1xuICB9XG59XG4iLCAiaW1wb3J0IHsgTmV0d29ya01hbmFnZXIgfSBmcm9tICcuLi9jb3JlL05ldHdvcmtNYW5hZ2VyJztcbmltcG9ydCB7IGh0bWwsIHFzIH0gZnJvbSAnLi4vdXRpbHMvZG9tJztcbmltcG9ydCB7IHJlbmRlck5hdiB9IGZyb20gJy4uL2NvbXBvbmVudHMvTmF2JztcbmltcG9ydCB7IFJlYWx0aW1lQ2xpZW50IH0gZnJvbSAnLi4vY29yZS9SZWFsdGltZUNsaWVudCc7XG5pbXBvcnQgeyBzaG93VG9hc3QgfSBmcm9tICcuLi9jb21wb25lbnRzL1RvYXN0JztcbmltcG9ydCB7IHJlbmRlclJlc291cmNlQmFyIH0gZnJvbSAnLi4vY29tcG9uZW50cy9SZXNvdXJjZUJhcic7XG5pbXBvcnQgeyByZW5kZXJJY29uIH0gZnJvbSAnLi4vY29tcG9uZW50cy9JY29uJztcblxuZXhwb3J0IGNsYXNzIFBsdW5kZXJTY2VuZSB7XG4gIHByaXZhdGUgcmVzdWx0Qm94OiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuXG4gIG1vdW50KHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgcm9vdC5pbm5lckhUTUwgPSAnJztcbiAgICByb290LmFwcGVuZENoaWxkKHJlbmRlck5hdigncGx1bmRlcicpKTtcbiAgICBjb25zdCBiYXIgPSByZW5kZXJSZXNvdXJjZUJhcigpO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQoYmFyLnJvb3QpO1xuXG4gICAgY29uc3QgdmlldyA9IGh0bWwoYFxuICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lciBncmlkLTJcIiBzdHlsZT1cImNvbG9yOiNmZmY7XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkIGZhZGUtaW5cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCIgc3R5bGU9XCJqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjthbGlnbi1pdGVtczpjZW50ZXI7XCI+XG4gICAgICAgICAgICA8aDMgc3R5bGU9XCJtYXJnaW46MDtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo4cHg7XCI+PHNwYW4gZGF0YS1pY289XCJzd29yZFwiPjwvc3Bhbj5cdTYzQTBcdTU5M0FcdTc2RUVcdTY4MDc8L2gzPlxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInJlZnJlc2hcIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiPjxzcGFuIGRhdGEtaWNvPVwicmVmcmVzaFwiPjwvc3Bhbj5cdTUyMzdcdTY1QjA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGlkPVwibGlzdFwiIHN0eWxlPVwibWFyZ2luLXRvcDoxMnB4O2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjhweDtcIj48L2Rpdj5cbiAgICAgICAgICA8ZGl2IGlkPVwicmVzdWx0XCIgc3R5bGU9XCJtYXJnaW4tdG9wOjEycHg7b3BhY2l0eTouOTtmb250LWZhbWlseTptb25vc3BhY2U7XCI+PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgYCk7XG4gICAgcm9vdC5hcHBlbmRDaGlsZCh2aWV3KTtcblxuICAgIGNvbnN0IHRva2VuID0gKE5ldHdvcmtNYW5hZ2VyIGFzIGFueSkuSVsndG9rZW4nXTtcbiAgICBpZiAodG9rZW4pIFJlYWx0aW1lQ2xpZW50LkkuY29ubmVjdCh0b2tlbik7XG5cbiAgICBSZWFsdGltZUNsaWVudC5JLm9uKCdwbHVuZGVyLmF0dGFja2VkJywgKG1zZykgPT4ge1xuICAgICAgc2hvd1RvYXN0KGBcdTg4QUJcdTYzQTBcdTU5M0FcdUZGMUFcdTY3NjVcdTgxRUEgJHttc2cuYXR0YWNrZXJ9XHVGRjBDXHU2MzVGXHU1OTMxICR7bXNnLmxvc3N9YCk7XG4gICAgICB0aGlzLmxvZyhgXHU4OEFCICR7bXNnLmF0dGFja2VyfSBcdTYzQTBcdTU5M0FcdUZGMENcdTYzNUZcdTU5MzEgJHttc2cubG9zc31gKTtcbiAgICB9KTtcbiAgICB0aGlzLnJlc3VsdEJveCA9IHFzKHZpZXcsICcjcmVzdWx0Jyk7XG5cbiAgICBjb25zdCBsaXN0ID0gcXModmlldywgJyNsaXN0Jyk7XG4gICAgY29uc3QgcmVmcmVzaEJ0biA9IHFzPEhUTUxCdXR0b25FbGVtZW50Pih2aWV3LCAnI3JlZnJlc2gnKTtcbiAgICBjb25zdCBtb3VudEljb25zID0gKHJvb3RFbDogRWxlbWVudCkgPT4ge1xuICAgICAgcm9vdEVsLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWljb10nKVxuICAgICAgICAuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgICBjb25zdCBuYW1lID0gKGVsIGFzIEhUTUxFbGVtZW50KS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWNvJykgYXMgYW55O1xuICAgICAgICAgIHRyeSB7IGVsLmFwcGVuZENoaWxkKHJlbmRlckljb24obmFtZSwgeyBzaXplOiAyMCB9KSk7IH0gY2F0Y2gge31cbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBtb3VudEljb25zKHZpZXcpO1xuXG4gICAgY29uc3QgbG9hZCA9IGFzeW5jICgpID0+IHtcbiAgICAgIHJlZnJlc2hCdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgcmVmcmVzaEJ0bi5pbm5lckhUTUwgPSAnPHNwYW4gZGF0YS1pY289XCJyZWZyZXNoXCI+PC9zcGFuPlx1NTIzN1x1NjVCMFx1NEUyRFx1MjAyNic7XG4gICAgICBtb3VudEljb25zKHJlZnJlc2hCdG4pO1xuICAgICAgYXdhaXQgYmFyLnVwZGF0ZSgpO1xuICAgICAgbGlzdC5pbm5lckhUTUwgPSAnJztcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSBsaXN0LmFwcGVuZENoaWxkKGh0bWwoJzxkaXYgY2xhc3M9XCJza2VsZXRvblwiPjwvZGl2PicpKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyB0YXJnZXRzOiBhbnlbXSB9PignL3BsdW5kZXIvdGFyZ2V0cycpO1xuICAgICAgICBsaXN0LmlubmVySFRNTCA9ICcnO1xuICAgICAgICBpZiAoIWRhdGEudGFyZ2V0cy5sZW5ndGgpIHtcbiAgICAgICAgICBsaXN0LmFwcGVuZENoaWxkKGh0bWwoJzxkaXYgc3R5bGU9XCJvcGFjaXR5Oi44O1wiPlx1NjY4Mlx1NjVFMFx1NTNFRlx1NjNBMFx1NTkzQVx1NzY4NFx1NzZFRVx1NjgwN1x1RkYwQ1x1N0EwRFx1NTQwRVx1NTE4RFx1OEJENTwvZGl2PicpKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IHRhcmdldCBvZiBkYXRhLnRhcmdldHMpIHtcbiAgICAgICAgICBjb25zdCByb3cgPSBodG1sKGBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsaXN0LWl0ZW0gbGlzdC1pdGVtLS1zZWxsXCI+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDoycHg7XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cImRpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjZweDtcIj48c3BhbiBkYXRhLWljbz1cInRhcmdldFwiPjwvc3Bhbj48c3Ryb25nPiR7dGFyZ2V0LnVzZXJuYW1lIHx8IHRhcmdldC5pZH08L3N0cm9uZz48L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwib3BhY2l0eTouODU7XCI+XHU3N0ZGXHU3N0YzXHVGRjFBJHt0YXJnZXQub3JlfSA8c3BhbiBjbGFzcz1cInBpbGxcIj5cdTk4ODRcdThCQTFcdTY1MzZcdTc2Q0EgNSV+MzAlPC9zcGFuPjwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1zZWxsXCIgZGF0YS1pZD1cIiR7dGFyZ2V0LmlkfVwiPjxzcGFuIGRhdGEtaWNvPVwic3dvcmRcIj48L3NwYW4+XHU2M0EwXHU1OTNBPC9idXR0b24+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgYCk7XG4gICAgICAgICAgbW91bnRJY29ucyhyb3cpO1xuICAgICAgICAgIHJvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIChldikgPT4ge1xuICAgICAgICAgICAgY29uc3QgZWwgPSBldi50YXJnZXQgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XG4gICAgICAgICAgICBjb25zdCBpZCA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1pZCcpO1xuICAgICAgICAgICAgaWYgKCFpZCkgcmV0dXJuO1xuICAgICAgICAgICAgZWwuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWwgPSBlbC50ZXh0Q29udGVudCB8fCAnJztcbiAgICAgICAgICAgIGVsLnRleHRDb250ZW50ID0gJ1x1NjNBMFx1NTkzQVx1NEUyRFx1MjAyNic7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyBzdWNjZXNzOiBib29sZWFuOyBsb290X2Ftb3VudDogbnVtYmVyIH0+KGAvcGx1bmRlci8ke2lkfWAsIHsgbWV0aG9kOiAnUE9TVCcgfSk7XG4gICAgICAgICAgICAgIGlmIChyZXMuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIHRoaXMubG9nKGBcdTYyMTBcdTUyOUZcdTYzQTBcdTU5M0EgJHtpZH1cdUZGMENcdTgzQjdcdTVGOTcgJHtyZXMubG9vdF9hbW91bnR9YCk7XG4gICAgICAgICAgICAgICAgc2hvd1RvYXN0KGBcdTYzQTBcdTU5M0FcdTYyMTBcdTUyOUZcdUZGMENcdTgzQjdcdTVGOTcgJHtyZXMubG9vdF9hbW91bnR9YCwgJ3N1Y2Nlc3MnKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZyhgXHU2M0EwXHU1OTNBICR7aWR9IFx1NTkzMVx1OEQyNWApO1xuICAgICAgICAgICAgICAgIHNob3dUb2FzdCgnXHU2M0EwXHU1OTNBXHU1OTMxXHU4RDI1JywgJ3dhcm4nKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBhd2FpdCBiYXIudXBkYXRlKCk7XG4gICAgICAgICAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IGU/Lm1lc3NhZ2UgfHwgJ1x1NjNBMFx1NTkzQVx1NTkzMVx1OEQyNSc7XG4gICAgICAgICAgICAgIHRoaXMubG9nKGBcdTYzQTBcdTU5M0FcdTU5MzFcdThEMjVcdUZGMUEke21lc3NhZ2V9YCk7XG4gICAgICAgICAgICAgIGlmIChtZXNzYWdlLmluY2x1ZGVzKCdcdTUxQjdcdTUzNzQnKSkge1xuICAgICAgICAgICAgICAgIHNob3dUb2FzdCgnXHU2M0EwXHU1OTNBXHU1NjY4XHU1MUI3XHU1Mzc0XHU0RTJEXHVGRjBDXHU4QkY3XHU3QTBEXHU1NDBFXHU1MThEXHU4QkQ1JywgJ3dhcm4nKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzaG93VG9hc3QobWVzc2FnZSwgJ2Vycm9yJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgIGVsLnRleHRDb250ZW50ID0gb3JpZ2luYWw7XG4gICAgICAgICAgICAgIGVsLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgbGlzdC5hcHBlbmRDaGlsZChyb3cpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgICAgc2hvd1RvYXN0KGU/Lm1lc3NhZ2UgfHwgJ1x1NTJBMFx1OEY3RFx1NjNBMFx1NTkzQVx1NzZFRVx1NjgwN1x1NTkzMVx1OEQyNScpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgcmVmcmVzaEJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICByZWZyZXNoQnRuLmlubmVySFRNTCA9ICc8c3BhbiBkYXRhLWljbz1cInJlZnJlc2hcIj48L3NwYW4+XHU1MjM3XHU2NUIwJztcbiAgICAgICAgbW91bnRJY29ucyhyZWZyZXNoQnRuKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmVmcmVzaEJ0bi5vbmNsaWNrID0gKCkgPT4gbG9hZCgpO1xuICAgIGxvYWQoKTtcbiAgfVxuXG4gIHByaXZhdGUgbG9nKG1zZzogc3RyaW5nKSB7XG4gICAgaWYgKCF0aGlzLnJlc3VsdEJveCkgcmV0dXJuO1xuICAgIGNvbnN0IGxpbmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBsaW5lLnRleHRDb250ZW50ID0gYFske25ldyBEYXRlKCkudG9Mb2NhbGVUaW1lU3RyaW5nKCl9XSAke21zZ31gO1xuICAgIHRoaXMucmVzdWx0Qm94LnByZXBlbmQobGluZSk7XG4gIH1cbn1cbiIsICJpbXBvcnQgeyBOZXR3b3JrTWFuYWdlciB9IGZyb20gJy4uL2NvcmUvTmV0d29ya01hbmFnZXInO1xuaW1wb3J0IHsgaHRtbCwgcXMgfSBmcm9tICcuLi91dGlscy9kb20nO1xuaW1wb3J0IHsgcmVuZGVyTmF2IH0gZnJvbSAnLi4vY29tcG9uZW50cy9OYXYnO1xuaW1wb3J0IHsgUmVhbHRpbWVDbGllbnQgfSBmcm9tICcuLi9jb3JlL1JlYWx0aW1lQ2xpZW50JztcbmltcG9ydCB7IEdhbWVNYW5hZ2VyIH0gZnJvbSAnLi4vY29yZS9HYW1lTWFuYWdlcic7XG5pbXBvcnQgeyBzaG93VG9hc3QgfSBmcm9tICcuLi9jb21wb25lbnRzL1RvYXN0JztcbmltcG9ydCB7IHJlbmRlclJlc291cmNlQmFyIH0gZnJvbSAnLi4vY29tcG9uZW50cy9SZXNvdXJjZUJhcic7XG5pbXBvcnQgeyByZW5kZXJJY29uIH0gZnJvbSAnLi4vY29tcG9uZW50cy9JY29uJztcblxudHlwZSBPcmRlciA9IHtcbiAgaWQ6IHN0cmluZztcbiAgdXNlcklkOiBzdHJpbmc7XG4gIHR5cGU6ICdidXknIHwgJ3NlbGwnO1xuICBpdGVtVGVtcGxhdGVJZD86IHN0cmluZztcbiAgaXRlbUluc3RhbmNlSWQ/OiBzdHJpbmc7XG4gIHByaWNlOiBudW1iZXI7XG4gIGFtb3VudDogbnVtYmVyO1xuICBjcmVhdGVkQXQ6IG51bWJlcjtcbn07XG5cbmV4cG9ydCBjbGFzcyBFeGNoYW5nZVNjZW5lIHtcbiAgcHJpdmF0ZSByZWZyZXNoVGltZXI6IG51bWJlciB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHRlbXBsYXRlczogeyBpZDogc3RyaW5nOyBuYW1lPzogc3RyaW5nOyBjYXRlZ29yeT86IHN0cmluZyB9W10gPSBbXTtcbiAgcHJpdmF0ZSBpbnZlbnRvcnk6IGFueVtdID0gW107XG5cbiAgYXN5bmMgbW91bnQocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICB0aGlzLmNsZWFyVGltZXIoKTtcbiAgICByb290LmlubmVySFRNTCA9ICcnO1xuXG4gICAgY29uc3QgbmF2ID0gcmVuZGVyTmF2KCdleGNoYW5nZScpO1xuICAgIGNvbnN0IGJhciA9IHJlbmRlclJlc291cmNlQmFyKCk7XG4gICAgY29uc3QgdmlldyA9IGh0bWwoYFxuICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lciBncmlkLTJcIiBzdHlsZT1cImNvbG9yOiNmZmY7XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkIGZhZGUtaW5cIj5cbiAgICAgICAgICA8aDMgc3R5bGU9XCJtYXJnaW46MCAwIDEycHg7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6OHB4O1wiPjxzcGFuIGRhdGEtaWNvPVwiZXhjaGFuZ2VcIj48L3NwYW4+XHU1RTAyXHU1NzNBXHU0RTBCXHU1MzU1PC9oMz5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCIgc3R5bGU9XCJmbGV4LXdyYXA6d3JhcDthbGlnbi1pdGVtczpmbGV4LWVuZDtnYXA6MTJweDtcIj5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJmbGV4OjE7bWluLXdpZHRoOjE4MHB4O1wiPlxuICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9XCJkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo2cHg7XCI+PHNwYW4gZGF0YS1pY289XCJsaXN0XCI+PC9zcGFuPlx1OEQyRFx1NEU3MFx1NkEyMVx1Njc3RjwvbGFiZWw+XG4gICAgICAgICAgICAgIDxzZWxlY3QgaWQ9XCJ0cGxcIiBjbGFzcz1cImlucHV0XCI+PC9zZWxlY3Q+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJmbGV4OjE7bWluLXdpZHRoOjEyMHB4O1wiPlxuICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9XCJkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo2cHg7XCI+PHNwYW4gZGF0YS1pY289XCJjb2luXCI+PC9zcGFuPlx1NEVGN1x1NjgzQyAoQkJcdTVFMDEpPC9sYWJlbD5cbiAgICAgICAgICAgICAgPGlucHV0IGlkPVwicHJpY2VcIiBjbGFzcz1cImlucHV0XCIgdHlwZT1cIm51bWJlclwiIG1pbj1cIjFcIiB2YWx1ZT1cIjEwXCIvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZmxleDoxO21pbi13aWR0aDoxMjBweDtcIj5cbiAgICAgICAgICAgICAgPGxhYmVsPlx1OEQyRFx1NEU3MFx1NjU3MFx1OTFDRjwvbGFiZWw+XG4gICAgICAgICAgICAgIDxpbnB1dCBpZD1cImFtb3VudFwiIGNsYXNzPVwiaW5wdXRcIiB0eXBlPVwibnVtYmVyXCIgbWluPVwiMVwiIHZhbHVlPVwiMVwiLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInBsYWNlQnV5XCIgY2xhc3M9XCJidG4gYnRuLWJ1eVwiIHN0eWxlPVwibWluLXdpZHRoOjEyMHB4O1wiPjxzcGFuIGRhdGEtaWNvPVwiYXJyb3ctcmlnaHRcIj48L3NwYW4+XHU0RTBCXHU0RTcwXHU1MzU1PC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBzdHlsZT1cImhlaWdodDo4cHg7XCI+PC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiIHN0eWxlPVwiZmxleC13cmFwOndyYXA7YWxpZ24taXRlbXM6ZmxleC1lbmQ7Z2FwOjEycHg7XCI+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZmxleDoxO21pbi13aWR0aDoyMjBweDtcIj5cbiAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVwiZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NnB4O1wiPjxzcGFuIGRhdGEtaWNvPVwiYm94XCI+PC9zcGFuPlx1NTFGQVx1NTUyRVx1OTA1M1x1NTE3NzwvbGFiZWw+XG4gICAgICAgICAgICAgIDxzZWxlY3QgaWQ9XCJpbnN0XCIgY2xhc3M9XCJpbnB1dFwiPjwvc2VsZWN0PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZmxleDoxO21pbi13aWR0aDoxMjBweDtcIj5cbiAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVwiZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NnB4O1wiPjxzcGFuIGRhdGEtaWNvPVwiY29pblwiPjwvc3Bhbj5cdTRFRjdcdTY4M0MgKEJCXHU1RTAxKTwvbGFiZWw+XG4gICAgICAgICAgICAgIDxpbnB1dCBpZD1cInNwcmljZVwiIGNsYXNzPVwiaW5wdXRcIiB0eXBlPVwibnVtYmVyXCIgbWluPVwiMVwiIHZhbHVlPVwiNVwiLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInBsYWNlU2VsbFwiIGNsYXNzPVwiYnRuIGJ0bi1zZWxsXCIgc3R5bGU9XCJtaW4td2lkdGg6MTIwcHg7XCI+PHNwYW4gZGF0YS1pY289XCJhcnJvdy1yaWdodFwiPjwvc3Bhbj5cdTRFMEJcdTUzNTZcdTUzNTU8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGlkPVwiaW52ZW50b3J5XCIgc3R5bGU9XCJtYXJnaW4tdG9wOjEycHg7ZGlzcGxheTpmbGV4O2ZsZXgtd3JhcDp3cmFwO2dhcDo4cHg7XCI+PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkIGZhZGUtaW5cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCIgc3R5bGU9XCJqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjEycHg7XCI+XG4gICAgICAgICAgICA8aDMgc3R5bGU9XCJtYXJnaW46MDtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo4cHg7XCI+PHNwYW4gZGF0YS1pY289XCJsaXN0XCI+PC9zcGFuPlx1OEJBMlx1NTM1NVx1N0MzRjwvaDM+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCIgc3R5bGU9XCJmbGV4LXdyYXA6d3JhcDtnYXA6OHB4O1wiPlxuICAgICAgICAgICAgICA8c2VsZWN0IGlkPVwicV90cGxcIiBjbGFzcz1cImlucHV0XCIgc3R5bGU9XCJ3aWR0aDoxODBweDtcIj48L3NlbGVjdD5cbiAgICAgICAgICAgICAgPHNlbGVjdCBpZD1cInFfdHlwZVwiIGNsYXNzPVwiaW5wdXRcIiBzdHlsZT1cIndpZHRoOjEyMHB4O1wiPlxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJidXlcIj5cdTRFNzBcdTUzNTU8L29wdGlvbj5cbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwic2VsbFwiPlx1NTM1Nlx1NTM1NTwvb3B0aW9uPlxuICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwicm93IHBpbGxcIiBzdHlsZT1cImFsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NnB4O1wiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGRhdGEtaWNvPVwidXNlclwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJteVwiIHR5cGU9XCJjaGVja2JveFwiLz4gXHU1M0VBXHU3NzBCXHU2MjExXHU3Njg0XG4gICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJyZWZyZXNoXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIiBzdHlsZT1cIm1pbi13aWR0aDo5NnB4O1wiPjxzcGFuIGRhdGEtaWNvPVwicmVmcmVzaFwiPjwvc3Bhbj5cdTUyMzdcdTY1QjA8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgaWQ9XCJib29rXCIgc3R5bGU9XCJtYXJnaW4tdG9wOjEycHg7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6OHB4O1wiPjwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZCBmYWRlLWluXCIgaWQ9XCJsb2dzXCIgc3R5bGU9XCJvcGFjaXR5Oi45O2ZvbnQtZmFtaWx5Om1vbm9zcGFjZTttaW4taGVpZ2h0OjI0cHg7XCI+PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICBgKTtcblxuICAgIHJvb3QuYXBwZW5kQ2hpbGQobmF2KTtcbiAgICByb290LmFwcGVuZENoaWxkKGJhci5yb290KTtcbiAgICByb290LmFwcGVuZENoaWxkKHZpZXcpO1xuXG4gICAgY29uc3QgdG9rZW4gPSAoTmV0d29ya01hbmFnZXIgYXMgYW55KS5JWyd0b2tlbiddO1xuICAgIGlmICh0b2tlbikgUmVhbHRpbWVDbGllbnQuSS5jb25uZWN0KHRva2VuKTtcbiAgICBjb25zdCBtZSA9IEdhbWVNYW5hZ2VyLkkuZ2V0UHJvZmlsZSgpO1xuXG4gICAgY29uc3QgYm9vayA9IHFzKHZpZXcsICcjYm9vaycpO1xuICAgIGNvbnN0IGxvZ3MgPSBxczxIVE1MRWxlbWVudD4odmlldywgJyNsb2dzJyk7XG4gICAgY29uc3QgYnV5VHBsID0gcXM8SFRNTFNlbGVjdEVsZW1lbnQ+KHZpZXcsICcjdHBsJyk7XG4gICAgY29uc3QgYnV5UHJpY2UgPSBxczxIVE1MSW5wdXRFbGVtZW50Pih2aWV3LCAnI3ByaWNlJyk7XG4gICAgY29uc3QgYnV5QW1vdW50ID0gcXM8SFRNTElucHV0RWxlbWVudD4odmlldywgJyNhbW91bnQnKTtcbiAgICBjb25zdCBwbGFjZUJ1eSA9IHFzPEhUTUxCdXR0b25FbGVtZW50Pih2aWV3LCAnI3BsYWNlQnV5Jyk7XG4gICAgY29uc3Qgc2VsbEluc3QgPSBxczxIVE1MU2VsZWN0RWxlbWVudD4odmlldywgJyNpbnN0Jyk7XG4gICAgY29uc3Qgc2VsbFByaWNlID0gcXM8SFRNTElucHV0RWxlbWVudD4odmlldywgJyNzcHJpY2UnKTtcbiAgICBjb25zdCBwbGFjZVNlbGwgPSBxczxIVE1MQnV0dG9uRWxlbWVudD4odmlldywgJyNwbGFjZVNlbGwnKTtcbiAgICBjb25zdCBpbnZCb3ggPSBxczxIVE1MRWxlbWVudD4odmlldywgJyNpbnZlbnRvcnknKTtcbiAgICBjb25zdCBxdWVyeVRwbCA9IHFzPEhUTUxTZWxlY3RFbGVtZW50Pih2aWV3LCAnI3FfdHBsJyk7XG4gICAgY29uc3QgcXVlcnlUeXBlID0gcXM8SFRNTFNlbGVjdEVsZW1lbnQ+KHZpZXcsICcjcV90eXBlJyk7XG4gICAgY29uc3QgcXVlcnlNaW5lT25seSA9IHFzPEhUTUxJbnB1dEVsZW1lbnQ+KHZpZXcsICcjbXknKTtcbiAgICBjb25zdCBtaW5lT25seUxhYmVsID0gdmlldy5xdWVyeVNlbGVjdG9yKCdsYWJlbC5yb3cucGlsbCcpIGFzIEhUTUxMYWJlbEVsZW1lbnQgfCBudWxsO1xuICAgIGNvbnN0IHJlZnJlc2hCdG4gPSBxczxIVE1MQnV0dG9uRWxlbWVudD4odmlldywgJyNyZWZyZXNoJyk7XG5cbiAgICBjb25zdCBtb3VudEljb25zID0gKHJvb3RFbDogRWxlbWVudCkgPT4ge1xuICAgICAgcm9vdEVsLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWljb10nKVxuICAgICAgICAuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgICBjb25zdCBuYW1lID0gKGVsIGFzIEhUTUxFbGVtZW50KS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWNvJykgYXMgYW55O1xuICAgICAgICAgIHRyeSB7IGVsLmFwcGVuZENoaWxkKHJlbmRlckljb24obmFtZSwgeyBzaXplOiAyMCB9KSk7IH0gY2F0Y2gge31cbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBtb3VudEljb25zKHZpZXcpO1xuXG4gICAgbGV0IHByZXZJZHMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICBsZXQgcmVmcmVzaGluZyA9IGZhbHNlO1xuXG4gICAgY29uc3QgbG9nID0gKG1lc3NhZ2U6IHN0cmluZykgPT4ge1xuICAgICAgbG9ncy50ZXh0Q29udGVudCA9IG1lc3NhZ2U7XG4gICAgfTtcblxuICAgIGNvbnN0IHJlbmRlclRlbXBsYXRlT3B0aW9ucyA9ICgpID0+IHtcbiAgICAgIGJ1eVRwbC5pbm5lckhUTUwgPSAnJztcbiAgICAgIHF1ZXJ5VHBsLmlubmVySFRNTCA9ICcnO1xuICAgICAgY29uc3QgcGxhY2Vob2xkZXIgPSBodG1sKCc8b3B0aW9uIHZhbHVlPVwiXCI+XHU5MDA5XHU2MkU5XHU2QTIxXHU2NzdGPC9vcHRpb24+JykgYXMgSFRNTE9wdGlvbkVsZW1lbnQ7XG4gICAgICBidXlUcGwuYXBwZW5kQ2hpbGQocGxhY2Vob2xkZXIpO1xuICAgICAgY29uc3QgcVBsYWNlaG9sZGVyID0gaHRtbCgnPG9wdGlvbiB2YWx1ZT1cIlwiPlx1NTE2OFx1OTBFOFx1NkEyMVx1Njc3Rjwvb3B0aW9uPicpIGFzIEhUTUxPcHRpb25FbGVtZW50O1xuICAgICAgcXVlcnlUcGwuYXBwZW5kQ2hpbGQocVBsYWNlaG9sZGVyKTtcbiAgICAgIGZvciAoY29uc3QgdHBsIG9mIHRoaXMudGVtcGxhdGVzKSB7XG4gICAgICAgIGNvbnN0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgICBvcHRpb24udmFsdWUgPSB0cGwuaWQ7XG4gICAgICAgIG9wdGlvbi50ZXh0Q29udGVudCA9IHRwbC5uYW1lID8gYCR7dHBsLm5hbWV9ICgke3RwbC5pZH0pYCA6IHRwbC5pZDtcbiAgICAgICAgYnV5VHBsLmFwcGVuZENoaWxkKG9wdGlvbik7XG4gICAgICAgIGNvbnN0IHFPcHRpb24gPSBvcHRpb24uY2xvbmVOb2RlKHRydWUpIGFzIEhUTUxPcHRpb25FbGVtZW50O1xuICAgICAgICBxdWVyeVRwbC5hcHBlbmRDaGlsZChxT3B0aW9uKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgcmVuZGVySW52ZW50b3J5ID0gKCkgPT4ge1xuICAgICAgc2VsbEluc3QuaW5uZXJIVE1MID0gJyc7XG4gICAgICBpbnZCb3guaW5uZXJIVE1MID0gJyc7XG4gICAgICBjb25zdCBkZWZhdWx0T3B0aW9uID0gaHRtbCgnPG9wdGlvbiB2YWx1ZT1cIlwiPlx1OTAwOVx1NjJFOVx1NTNFRlx1NTFGQVx1NTUyRVx1NzY4NFx1OTA1M1x1NTE3Nzwvb3B0aW9uPicpIGFzIEhUTUxPcHRpb25FbGVtZW50O1xuICAgICAgc2VsbEluc3QuYXBwZW5kQ2hpbGQoZGVmYXVsdE9wdGlvbik7XG4gICAgICBjb25zdCBhdmFpbGFibGUgPSB0aGlzLmludmVudG9yeS5maWx0ZXIoKGl0ZW0pID0+ICFpdGVtLmlzRXF1aXBwZWQgJiYgIWl0ZW0uaXNMaXN0ZWQpO1xuICAgICAgaWYgKCFhdmFpbGFibGUubGVuZ3RoKSB7XG4gICAgICAgIGludkJveC50ZXh0Q29udGVudCA9ICdcdTY2ODJcdTY1RTBcdTUzRUZcdTUxRkFcdTU1MkVcdTc2ODRcdTkwNTNcdTUxNzdcdUZGMDhcdTk3MDBcdTUxNDhcdTU3MjhcdTRFRDNcdTVFOTNcdTUzNzhcdTRFMEJcdTg4QzVcdTU5MDdcdUZGMDknO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgYXZhaWxhYmxlKSB7XG4gICAgICAgIGNvbnN0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgICBvcHRpb24udmFsdWUgPSBpdGVtLmlkO1xuICAgICAgICBvcHRpb24udGV4dENvbnRlbnQgPSBgJHtpdGVtLmlkfSBcdTAwQjcgJHtpdGVtLnRlbXBsYXRlSWR9IFx1MDBCNyBMdi4ke2l0ZW0ubGV2ZWx9YDtcbiAgICAgICAgc2VsbEluc3QuYXBwZW5kQ2hpbGQob3B0aW9uKTtcblxuICAgICAgICBjb25zdCBjaGlwID0gaHRtbChgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tZ2hvc3RcIiBzdHlsZT1cImZsZXg6dW5zZXQ7cGFkZGluZzo2cHggMTBweDtcIiBkYXRhLWlkPVwiJHtpdGVtLmlkfVwiPiR7aXRlbS5pZH0gKCR7aXRlbS50ZW1wbGF0ZUlkfSk8L2J1dHRvbj5gKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcbiAgICAgICAgY2hpcC5vbmNsaWNrID0gKCkgPT4ge1xuICAgICAgICAgIHNlbGxJbnN0LnZhbHVlID0gaXRlbS5pZDtcbiAgICAgICAgICBsb2coYFx1NURGMlx1OTAwOVx1NjJFOVx1NTFGQVx1NTUyRVx1OTA1M1x1NTE3NyAke2l0ZW0uaWR9YCk7XG4gICAgICAgIH07XG4gICAgICAgIGludkJveC5hcHBlbmRDaGlsZChjaGlwKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgbG9hZE1ldGFkYXRhID0gYXN5bmMgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgW3RwbHMsIGl0ZW1zXSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgICBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyB0ZW1wbGF0ZXM6IGFueVtdIH0+KCcvaXRlbXMvdGVtcGxhdGVzJyksXG4gICAgICAgICAgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgaXRlbXM6IGFueVtdIH0+KCcvaXRlbXMnKSxcbiAgICAgICAgXSk7XG4gICAgICAgIHRoaXMudGVtcGxhdGVzID0gdHBscy50ZW1wbGF0ZXMgfHwgW107XG4gICAgICAgIHRoaXMuaW52ZW50b3J5ID0gaXRlbXMuaXRlbXMgfHwgW107XG4gICAgICAgIHJlbmRlclRlbXBsYXRlT3B0aW9ucygpO1xuICAgICAgICByZW5kZXJJbnZlbnRvcnkoKTtcbiAgICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgICBsb2coZT8ubWVzc2FnZSB8fCAnXHU1MkEwXHU4RjdEXHU2QTIxXHU2NzdGL1x1NEVEM1x1NUU5M1x1NTkzMVx1OEQyNScpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCByZWZyZXNoID0gYXN5bmMgKG9wdHM6IHsgcXVpZXQ/OiBib29sZWFuIH0gPSB7fSkgPT4ge1xuICAgICAgaWYgKHJlZnJlc2hpbmcpIHJldHVybjtcbiAgICAgIHJlZnJlc2hpbmcgPSB0cnVlO1xuICAgICAgaWYgKCFvcHRzLnF1aWV0KSB7IHJlZnJlc2hCdG4uaW5uZXJIVE1MID0gJzxzcGFuIGRhdGEtaWNvPVwicmVmcmVzaFwiPjwvc3Bhbj5cdTUyMzdcdTY1QjBcdTRFMkRcdTIwMjYnOyBtb3VudEljb25zKHJlZnJlc2hCdG4pOyB9XG4gICAgICByZWZyZXNoQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHRwbElkID0gcXVlcnlUcGwudmFsdWU7XG4gICAgICAgIGNvbnN0IHR5cGUgPSBxdWVyeVR5cGUudmFsdWUgYXMgJ2J1eScgfCAnc2VsbCc7XG4gICAgICAgIGNvbnN0IG1pbmVPbmx5ID0gcXVlcnlNaW5lT25seS5jaGVja2VkO1xuICAgICAgICBjb25zdCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKCk7XG4gICAgICAgIHBhcmFtcy5zZXQoJ3R5cGUnLCB0eXBlKTtcbiAgICAgICAgcGFyYW1zLnNldCgnaXRlbV90ZW1wbGF0ZV9pZCcsIHRwbElkIHx8ICcnKTtcbiAgICAgICAgaWYgKCFvcHRzLnF1aWV0KSB7XG4gICAgICAgICAgYm9vay5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykgYm9vay5hcHBlbmRDaGlsZChodG1sKCc8ZGl2IGNsYXNzPVwic2tlbGV0b25cIj48L2Rpdj4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IG9yZGVyczogT3JkZXJbXSB9PihgL2V4Y2hhbmdlL29yZGVycz8ke3BhcmFtcy50b1N0cmluZygpfWApO1xuICAgICAgICBjb25zdCBuZXdJZHMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICAgICAgYm9vay5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgY29uc3Qgb3JkZXJzID0gZGF0YS5vcmRlcnMgfHwgW107XG4gICAgICAgIGlmICghb3JkZXJzLmxlbmd0aCkge1xuICAgICAgICAgIGJvb2suYXBwZW5kQ2hpbGQoaHRtbCgnPGRpdiBzdHlsZT1cIm9wYWNpdHk6Ljg7dGV4dC1hbGlnbjpjZW50ZXI7XCI+XHU2NjgyXHU2NUUwXHU4QkEyXHU1MzU1PC9kaXY+JykpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3Qgb3JkZXIgb2Ygb3JkZXJzKSB7XG4gICAgICAgICAgaWYgKG1pbmVPbmx5ICYmIG1lICYmIG9yZGVyLnVzZXJJZCAhPT0gbWUuaWQpIGNvbnRpbnVlO1xuICAgICAgICAgIG5ld0lkcy5hZGQob3JkZXIuaWQpO1xuICAgICAgICAgIGNvbnN0IGlzTWluZSA9IG1lICYmIG9yZGVyLnVzZXJJZCA9PT0gbWUuaWQ7XG4gICAgICAgICAgY29uc3Qga2xhc3MgPSBgbGlzdC1pdGVtICR7b3JkZXIudHlwZSA9PT0gJ2J1eScgPyAnbGlzdC1pdGVtLS1idXknIDogJ2xpc3QtaXRlbS0tc2VsbCd9YDtcbiAgICAgICAgICBjb25zdCByb3cgPSBodG1sKGBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCIke2tsYXNzfVwiPlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6MnB4O1wiPlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICA8c3Ryb25nPiR7b3JkZXIudHlwZSA9PT0gJ2J1eScgPyAnXHU0RTcwXHU1MTY1JyA6ICdcdTUzNTZcdTUxRkEnfTwvc3Ryb25nPlxuICAgICAgICAgICAgICAgICAgJHtvcmRlci5pdGVtVGVtcGxhdGVJZCB8fCAnJ31cbiAgICAgICAgICAgICAgICAgICR7aXNNaW5lID8gJzxzcGFuIGNsYXNzPVwicGlsbFwiPlx1NjIxMVx1NzY4NDwvc3Bhbj4nIDogJyd9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cIm9wYWNpdHk6Ljg1O1wiPlxuICAgICAgICAgICAgICAgICAgXHU0RUY3XHU2ODNDOiAke29yZGVyLnByaWNlfSBcdTAwQjcgXHU2NTcwXHU5MUNGOiAke29yZGVyLmFtb3VudH1cbiAgICAgICAgICAgICAgICAgICR7b3JkZXIuaXRlbUluc3RhbmNlSWQgPyBgPHNwYW4gY2xhc3M9XCJwaWxsXCI+JHtvcmRlci5pdGVtSW5zdGFuY2VJZH08L3NwYW4+YCA6ICcnfVxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwaWxsXCI+JHtvcmRlci5pZH08L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICR7aXNNaW5lID8gYDxidXR0b24gY2xhc3M9XCJidG4gYnRuLWdob3N0XCIgZGF0YS1pZD1cIiR7b3JkZXIuaWR9XCI+PHNwYW4gZGF0YS1pY289XCJ0cmFzaFwiPjwvc3Bhbj5cdTY0QTRcdTUzNTU8L2J1dHRvbj5gIDogJyd9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgYCk7XG4gICAgICAgICAgbW91bnRJY29ucyhyb3cpO1xuICAgICAgICAgIGlmICghcHJldklkcy5oYXMob3JkZXIuaWQpKSByb3cuY2xhc3NMaXN0LmFkZCgnZmxhc2gnKTtcbiAgICAgICAgICByb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZXYpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGV2LnRhcmdldCBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgICAgIGNvbnN0IGlkID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1pZCcpO1xuICAgICAgICAgICAgaWYgKCFpZCkgcmV0dXJuO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgdGFyZ2V0LnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCAndHJ1ZScpO1xuICAgICAgICAgICAgICBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3QoYC9leGNoYW5nZS9vcmRlcnMvJHtpZH1gLCB7IG1ldGhvZDogJ0RFTEVURScgfSk7XG4gICAgICAgICAgICAgIHNob3dUb2FzdCgnXHU2NEE0XHU1MzU1XHU2MjEwXHU1MjlGJywgJ3N1Y2Nlc3MnKTtcbiAgICAgICAgICAgICAgYXdhaXQgcmVmcmVzaCgpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgICAgICAgIHNob3dUb2FzdChlPy5tZXNzYWdlIHx8ICdcdTY0QTRcdTUzNTVcdTU5MzFcdThEMjUnLCAnZXJyb3InKTtcbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgIHRhcmdldC5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgYm9vay5hcHBlbmRDaGlsZChyb3cpO1xuICAgICAgICB9XG4gICAgICAgIHByZXZJZHMgPSBuZXdJZHM7XG4gICAgICAgIGlmICghYm9vay5jaGlsZEVsZW1lbnRDb3VudCkge1xuICAgICAgICAgIGJvb2suYXBwZW5kQ2hpbGQoaHRtbCgnPGRpdiBzdHlsZT1cIm9wYWNpdHk6Ljg7dGV4dC1hbGlnbjpjZW50ZXI7XCI+XHU2NjgyXHU2NUUwXHU3QjI2XHU1NDA4XHU2NzYxXHU0RUY2XHU3Njg0XHU4QkEyXHU1MzU1PC9kaXY+JykpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgICAgbG9nKGU/Lm1lc3NhZ2UgfHwgJ1x1NTIzN1x1NjVCMFx1OEJBMlx1NTM1NVx1NTkzMVx1OEQyNScpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgcmVmcmVzaGluZyA9IGZhbHNlO1xuICAgICAgICByZWZyZXNoQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIHJlZnJlc2hCdG4uaW5uZXJIVE1MID0gJzxzcGFuIGRhdGEtaWNvPVwicmVmcmVzaFwiPjwvc3Bhbj5cdTUyMzdcdTY1QjAnO1xuICAgICAgICBtb3VudEljb25zKHJlZnJlc2hCdG4pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBwbGFjZUJ1eS5vbmNsaWNrID0gYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgdHBsSWQgPSBidXlUcGwudmFsdWUudHJpbSgpO1xuICAgICAgY29uc3QgcHJpY2UgPSBOdW1iZXIoYnV5UHJpY2UudmFsdWUpO1xuICAgICAgY29uc3QgYW1vdW50ID0gTnVtYmVyKGJ1eUFtb3VudC52YWx1ZSk7XG4gICAgICBpZiAoIXRwbElkKSB7XG4gICAgICAgIHNob3dUb2FzdCgnXHU4QkY3XHU5MDA5XHU2MkU5XHU4RDJEXHU0RTcwXHU3Njg0XHU2QTIxXHU2NzdGJywgJ3dhcm4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHByaWNlIDw9IDAgfHwgYW1vdW50IDw9IDApIHtcbiAgICAgICAgc2hvd1RvYXN0KCdcdThCRjdcdThGOTNcdTUxNjVcdTY3MDlcdTY1NDhcdTc2ODRcdTRFRjdcdTY4M0NcdTRFMEVcdTY1NzBcdTkxQ0YnLCAnd2FybicpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBwbGFjZUJ1eS5kaXNhYmxlZCA9IHRydWU7XG4gICAgICBwbGFjZUJ1eS50ZXh0Q29udGVudCA9ICdcdTYzRDBcdTRFQTRcdTRFMkRcdTIwMjYnO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgaWQ6IHN0cmluZyB9PignL2V4Y2hhbmdlL29yZGVycycsIHtcbiAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IHR5cGU6ICdidXknLCBpdGVtX3RlbXBsYXRlX2lkOiB0cGxJZCwgcHJpY2UsIGFtb3VudCB9KSxcbiAgICAgICAgfSk7XG4gICAgICAgIHNob3dUb2FzdChgXHU0RTcwXHU1MzU1XHU1REYyXHU2M0QwXHU0RUE0ICgjJHtyZXMuaWR9KWAsICdzdWNjZXNzJyk7XG4gICAgICAgIGxvZyhgXHU0RTcwXHU1MzU1XHU2MjEwXHU1MjlGOiAke3Jlcy5pZH1gKTtcbiAgICAgICAgYXdhaXQgYmFyLnVwZGF0ZSgpO1xuICAgICAgICBhd2FpdCByZWZyZXNoKCk7XG4gICAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgICAgc2hvd1RvYXN0KGU/Lm1lc3NhZ2UgfHwgJ1x1NEU3MFx1NTM1NVx1NjNEMFx1NEVBNFx1NTkzMVx1OEQyNScsICdlcnJvcicpO1xuICAgICAgICBsb2coZT8ubWVzc2FnZSB8fCAnXHU0RTcwXHU1MzU1XHU2M0QwXHU0RUE0XHU1OTMxXHU4RDI1Jyk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBwbGFjZUJ1eS5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICBwbGFjZUJ1eS50ZXh0Q29udGVudCA9ICdcdTRFMEJcdTRFNzBcdTUzNTUnO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBwbGFjZVNlbGwub25jbGljayA9IGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGluc3RJZCA9IHNlbGxJbnN0LnZhbHVlLnRyaW0oKTtcbiAgICAgIGNvbnN0IHByaWNlID0gTnVtYmVyKHNlbGxQcmljZS52YWx1ZSk7XG4gICAgICBpZiAoIWluc3RJZCkge1xuICAgICAgICBzaG93VG9hc3QoJ1x1OEJGN1x1OTAwOVx1NjJFOVx1ODk4MVx1NTFGQVx1NTUyRVx1NzY4NFx1OTA1M1x1NTE3NycsICd3YXJuJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChwcmljZSA8PSAwKSB7XG4gICAgICAgIHNob3dUb2FzdCgnXHU4QkY3XHU4RjkzXHU1MTY1XHU2NzA5XHU2NTQ4XHU3Njg0XHU0RUY3XHU2ODNDJywgJ3dhcm4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcGxhY2VTZWxsLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIHBsYWNlU2VsbC50ZXh0Q29udGVudCA9ICdcdTYzRDBcdTRFQTRcdTRFMkRcdTIwMjYnO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgaWQ6IHN0cmluZyB9PignL2V4Y2hhbmdlL29yZGVycycsIHtcbiAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IHR5cGU6ICdzZWxsJywgaXRlbV9pbnN0YW5jZV9pZDogaW5zdElkLCBwcmljZSB9KSxcbiAgICAgICAgfSk7XG4gICAgICAgIHNob3dUb2FzdChgXHU1MzU2XHU1MzU1XHU1REYyXHU2M0QwXHU0RUE0ICgjJHtyZXMuaWR9KWAsICdzdWNjZXNzJyk7XG4gICAgICAgIGxvZyhgXHU1MzU2XHU1MzU1XHU2MjEwXHU1MjlGOiAke3Jlcy5pZH1gKTtcbiAgICAgICAgYXdhaXQgYmFyLnVwZGF0ZSgpO1xuICAgICAgICBhd2FpdCBsb2FkTWV0YWRhdGEoKTtcbiAgICAgICAgYXdhaXQgcmVmcmVzaCgpO1xuICAgICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgIHNob3dUb2FzdChlPy5tZXNzYWdlIHx8ICdcdTUzNTZcdTUzNTVcdTYzRDBcdTRFQTRcdTU5MzFcdThEMjUnLCAnZXJyb3InKTtcbiAgICAgICAgbG9nKGU/Lm1lc3NhZ2UgfHwgJ1x1NTM1Nlx1NTM1NVx1NjNEMFx1NEVBNFx1NTkzMVx1OEQyNScpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgcGxhY2VTZWxsLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIHBsYWNlU2VsbC50ZXh0Q29udGVudCA9ICdcdTRFMEJcdTUzNTZcdTUzNTUnO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZWZyZXNoQnRuLm9uY2xpY2sgPSAoKSA9PiByZWZyZXNoKCk7XG4gICAgcXVlcnlUcGwub25jaGFuZ2UgPSAoKSA9PiByZWZyZXNoKCk7XG4gICAgcXVlcnlUeXBlLm9uY2hhbmdlID0gKCkgPT4gcmVmcmVzaCgpO1xuICAgIHF1ZXJ5TWluZU9ubHkub25jaGFuZ2UgPSAoKSA9PiB7IGlmIChtaW5lT25seUxhYmVsKSBtaW5lT25seUxhYmVsLmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScsIHF1ZXJ5TWluZU9ubHkuY2hlY2tlZCk7IHJlZnJlc2goKTsgfTtcbiAgICBpZiAobWluZU9ubHlMYWJlbCkgbWluZU9ubHlMYWJlbC5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnLCBxdWVyeU1pbmVPbmx5LmNoZWNrZWQpO1xuXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoW2Jhci51cGRhdGUoKSwgbG9hZE1ldGFkYXRhKCldKTtcbiAgICBhd2FpdCByZWZyZXNoKHsgcXVpZXQ6IHRydWUgfSk7XG4gICAgdGhpcy5yZWZyZXNoVGltZXIgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgcmVmcmVzaCh7IHF1aWV0OiB0cnVlIH0pLmNhdGNoKCgpID0+IHt9KTtcbiAgICB9LCAxMDAwMCk7XG4gIH1cblxuICBwcml2YXRlIGNsZWFyVGltZXIoKSB7XG4gICAgaWYgKHRoaXMucmVmcmVzaFRpbWVyICE9PSBudWxsKSB7XG4gICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aGlzLnJlZnJlc2hUaW1lcik7XG4gICAgICB0aGlzLnJlZnJlc2hUaW1lciA9IG51bGw7XG4gICAgfVxuICB9XG59XG4iLCAiaW1wb3J0IHsgTmV0d29ya01hbmFnZXIgfSBmcm9tICcuLi9jb3JlL05ldHdvcmtNYW5hZ2VyJztcbmltcG9ydCB7IGh0bWwsIHFzIH0gZnJvbSAnLi4vdXRpbHMvZG9tJztcbmltcG9ydCB7IHJlbmRlck5hdiB9IGZyb20gJy4uL2NvbXBvbmVudHMvTmF2JztcbmltcG9ydCB7IFJlYWx0aW1lQ2xpZW50IH0gZnJvbSAnLi4vY29yZS9SZWFsdGltZUNsaWVudCc7XG5pbXBvcnQgeyByZW5kZXJSZXNvdXJjZUJhciB9IGZyb20gJy4uL2NvbXBvbmVudHMvUmVzb3VyY2VCYXInO1xuaW1wb3J0IHsgcmVuZGVySWNvbiB9IGZyb20gJy4uL2NvbXBvbmVudHMvSWNvbic7XG5cbmV4cG9ydCBjbGFzcyBSYW5raW5nU2NlbmUge1xuICBtb3VudChyb290OiBIVE1MRWxlbWVudCkge1xuICAgIHJvb3QuaW5uZXJIVE1MID0gJyc7XG4gICAgcm9vdC5hcHBlbmRDaGlsZChyZW5kZXJOYXYoJ3JhbmtpbmcnKSk7XG4gICAgY29uc3QgYmFyID0gcmVuZGVyUmVzb3VyY2VCYXIoKTtcbiAgICByb290LmFwcGVuZENoaWxkKGJhci5yb290KTtcblxuICAgIGNvbnN0IHZpZXcgPSBodG1sKGBcbiAgICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXIgZ3JpZC0yXCIgc3R5bGU9XCJjb2xvcjojZmZmO1wiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZCBmYWRlLWluXCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiIHN0eWxlPVwianVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YWxpZ24taXRlbXM6Y2VudGVyO1wiPlxuICAgICAgICAgICAgPGgzIHN0eWxlPVwibWFyZ2luOjA7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6OHB4O1wiPjxzcGFuIGRhdGEtaWNvPVwidHJvcGh5XCI+PC9zcGFuPlx1NjM5Mlx1ODg0Q1x1Njk5QzwvaDM+XG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwicmVmcmVzaFwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCI+PHNwYW4gZGF0YS1pY289XCJyZWZyZXNoXCI+PC9zcGFuPlx1NTIzN1x1NjVCMDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgaWQ9XCJtZVwiIHN0eWxlPVwibWFyZ2luLXRvcDo4cHg7b3BhY2l0eTouOTU7XCI+PC9kaXY+XG4gICAgICAgICAgPGRpdiBpZD1cImxpc3RcIiBzdHlsZT1cIm1hcmdpbi10b3A6MTJweDtkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDo2cHg7XCI+PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgYCk7XG4gICAgcm9vdC5hcHBlbmRDaGlsZCh2aWV3KTtcblxuICAgIGNvbnN0IHRva2VuID0gKE5ldHdvcmtNYW5hZ2VyIGFzIGFueSkuSVsndG9rZW4nXTtcbiAgICBpZiAodG9rZW4pIFJlYWx0aW1lQ2xpZW50LkkuY29ubmVjdCh0b2tlbik7XG5cbiAgICBjb25zdCBtZUJveCA9IHFzKHZpZXcsICcjbWUnKTtcbiAgICBjb25zdCBsaXN0ID0gcXModmlldywgJyNsaXN0Jyk7XG4gICAgY29uc3QgcmVmcmVzaEJ0biA9IHFzPEhUTUxCdXR0b25FbGVtZW50Pih2aWV3LCAnI3JlZnJlc2gnKTtcbiAgICBjb25zdCBtb3VudEljb25zID0gKHJvb3RFbDogRWxlbWVudCkgPT4ge1xuICAgICAgcm9vdEVsLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWljb10nKVxuICAgICAgICAuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgICBjb25zdCBuYW1lID0gKGVsIGFzIEhUTUxFbGVtZW50KS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWNvJykgYXMgYW55O1xuICAgICAgICAgIHRyeSB7IGVsLmFwcGVuZENoaWxkKHJlbmRlckljb24obmFtZSwgeyBzaXplOiAyMCB9KSk7IH0gY2F0Y2gge31cbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBtb3VudEljb25zKHZpZXcpO1xuXG4gICAgY29uc3QgbG9hZCA9IGFzeW5jICgpID0+IHtcbiAgICAgIHJlZnJlc2hCdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgcmVmcmVzaEJ0bi5pbm5lckhUTUwgPSAnPHNwYW4gZGF0YS1pY289XCJyZWZyZXNoXCI+PC9zcGFuPlx1NTIzN1x1NjVCMFx1NEUyRFx1MjAyNic7XG4gICAgICBtb3VudEljb25zKHJlZnJlc2hCdG4pO1xuICAgICAgYXdhaXQgYmFyLnVwZGF0ZSgpO1xuICAgICAgbGlzdC5pbm5lckhUTUwgPSAnJztcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSBsaXN0LmFwcGVuZENoaWxkKGh0bWwoJzxkaXYgY2xhc3M9XCJza2VsZXRvblwiPjwvZGl2PicpKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IG1lID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgcmFuazogbnVtYmVyOyBzY29yZTogbnVtYmVyIH0+KCcvcmFua2luZy9tZScpO1xuICAgICAgICBjb25zdCB0b3AgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyBsaXN0OiBhbnlbXSB9PignL3JhbmtpbmcvdG9wP249MjAnKTtcbiAgICAgICAgbWVCb3gudGV4dENvbnRlbnQgPSBgXHU2MjExXHU3Njg0XHU1NDBEXHU2QjIxXHVGRjFBIyR7bWUucmFua30gXHUwMEI3IFx1NjAzQlx1NUY5N1x1NTIwNlx1RkYxQSR7bWUuc2NvcmV9YDtcbiAgICAgICAgbGlzdC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgZm9yIChjb25zdCBlbnRyeSBvZiB0b3AubGlzdCkge1xuICAgICAgICAgIGNvbnN0IG1lZGFsID0gZW50cnkucmFuayA9PT0gMSA/ICdcdUQ4M0VcdURENDcnIDogZW50cnkucmFuayA9PT0gMiA/ICdcdUQ4M0VcdURENDgnIDogZW50cnkucmFuayA9PT0gMyA/ICdcdUQ4M0VcdURENDknIDogJyc7XG4gICAgICAgICAgY29uc3QgY2xzID0gZW50cnkucmFuayA8PSAzID8gJyBsaXN0LWl0ZW0tLWJ1eScgOiAnJztcbiAgICAgICAgICBjb25zdCByb3cgPSBodG1sKGBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsaXN0LWl0ZW0ke2Nsc31cIj5cbiAgICAgICAgICAgICAgPHNwYW4+JHttZWRhbH0gIyR7ZW50cnkucmFua308L3NwYW4+XG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPVwiZmxleDoxO29wYWNpdHk6Ljk7bWFyZ2luLWxlZnQ6MTJweDtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo2cHg7XCI+PHNwYW4gZGF0YS1pY289XCJ1c2VyXCI+PC9zcGFuPiR7ZW50cnkudXNlcklkfTwvc3Bhbj5cbiAgICAgICAgICAgICAgPHN0cm9uZz4ke2VudHJ5LnNjb3JlfTwvc3Ryb25nPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgYCk7XG4gICAgICAgICAgbW91bnRJY29ucyhyb3cpO1xuICAgICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQocm93KTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgIG1lQm94LnRleHRDb250ZW50ID0gZT8ubWVzc2FnZSB8fCAnXHU2MzkyXHU4ODRDXHU2OTlDXHU1MkEwXHU4RjdEXHU1OTMxXHU4RDI1JztcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHJlZnJlc2hCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgcmVmcmVzaEJ0bi5pbm5lckhUTUwgPSAnPHNwYW4gZGF0YS1pY289XCJyZWZyZXNoXCI+PC9zcGFuPlx1NTIzN1x1NjVCMCc7XG4gICAgICAgIG1vdW50SWNvbnMocmVmcmVzaEJ0bik7XG4gICAgICB9XG4gICAgfTtcbiAgICByZWZyZXNoQnRuLm9uY2xpY2sgPSAoKSA9PiBsb2FkKCk7XG4gICAgbG9hZCgpO1xuICB9XG59XG4iLCAibGV0IGluamVjdGVkID0gZmFsc2U7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZW5zdXJlR2xvYmFsU3R5bGVzKCkge1xyXG4gIGlmIChpbmplY3RlZCkgcmV0dXJuO1xyXG4gIGNvbnN0IGNzcyA9IGA6cm9vdHstLWJnOiMwYjEwMjA7LS1iZy0yOiMwZjE1MzA7LS1mZzojZmZmOy0tbXV0ZWQ6cmdiYSgyNTUsMjU1LDI1NSwuNzUpOy0tZ3JhZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCM3QjJDRjUsIzJDODlGNSk7LS1wYW5lbC1ncmFkOmxpbmVhci1ncmFkaWVudCgxMzVkZWcscmdiYSgxMjMsNDQsMjQ1LC4yNSkscmdiYSg0NCwxMzcsMjQ1LC4yNSkpOy0tZ2xhc3M6Ymx1cigxMHB4KTstLWdsb3c6MCA4cHggMjBweCByZ2JhKDAsMCwwLC4zNSksMCAwIDEycHggcmdiYSgxMjMsNDQsMjQ1LC43KTstLXJhZGl1cy1zbToxMHB4Oy0tcmFkaXVzLW1kOjEycHg7LS1yYWRpdXMtbGc6MTZweDstLWVhc2U6Y3ViaWMtYmV6aWVyKC4yMiwuNjEsLjM2LDEpOy0tZHVyOi4yOHM7LS1idXk6IzJDODlGNTstLXNlbGw6I0UzNjQxNDstLW9rOiMyZWMyN2U7LS13YXJuOiNmNmM0NDU7LS1kYW5nZXI6I2ZmNWM1YzstLXJhcml0eS1jb21tb246IzlhYTBhNjstLXJhcml0eS1yYXJlOiM0ZmQ0ZjU7LS1yYXJpdHktZXBpYzojYjI2YmZmOy0tcmFyaXR5LWxlZ2VuZGFyeTojZjZjNDQ1Oy0tY29udGFpbmVyLW1heDo3MjBweH1cclxuaHRtbCxib2R5e2JhY2tncm91bmQ6cmFkaWFsLWdyYWRpZW50KDEyMDBweCA2MDBweCBhdCA1MCUgLTEwJSwgcmdiYSgxMjMsNDQsMjQ1LC4xMiksIHRyYW5zcGFyZW50KSx2YXIoLS1iZyk7Y29sb3I6dmFyKC0tZmcpO2ZvbnQtZmFtaWx5OnN5c3RlbS11aSwtYXBwbGUtc3lzdGVtLFwiU2Vnb2UgVUlcIixcIlBpbmdGYW5nIFNDXCIsXCJNaWNyb3NvZnQgWWFIZWlcIixBcmlhbCxzYW5zLXNlcmlmfVxyXG5odG1se2NvbG9yLXNjaGVtZTpkYXJrfVxyXG4uY29udGFpbmVye3BhZGRpbmc6MCAxMnB4fVxyXG4uY29udGFpbmVye21heC13aWR0aDp2YXIoLS1jb250YWluZXItbWF4KTttYXJnaW46MTJweCBhdXRvfVxyXG4uY2FyZHtwb3NpdGlvbjpyZWxhdGl2ZTtib3JkZXItcmFkaXVzOnZhcigtLXJhZGl1cy1sZyk7YmFja2dyb3VuZDp2YXIoLS1wYW5lbC1ncmFkKTtiYWNrZHJvcC1maWx0ZXI6dmFyKC0tZ2xhc3MpO2JveC1zaGFkb3c6dmFyKC0tZ2xvdyk7cGFkZGluZzoxMnB4O292ZXJmbG93OmhpZGRlbn1cclxuLyogbmVvbiBjb3JuZXJzICsgc2hlZW4gKi9cclxuLmNhcmQ6OmJlZm9yZXtjb250ZW50OlwiXCI7cG9zaXRpb246YWJzb2x1dGU7aW5zZXQ6MDtib3JkZXItcmFkaXVzOmluaGVyaXQ7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoNDAlIDI1JSBhdCAxMDAlIDAsIHJnYmEoMTIzLDQ0LDI0NSwuMTgpLCB0cmFuc3BhcmVudCA2MCUpLHJhZGlhbC1ncmFkaWVudCgzNSUgMjUlIGF0IDAgMTAwJSwgcmdiYSg0NCwxMzcsMjQ1LC4xNiksIHRyYW5zcGFyZW50IDYwJSk7cG9pbnRlci1ldmVudHM6bm9uZX1cclxuLmNhcmQ6OmFmdGVye2NvbnRlbnQ6XCJcIjtwb3NpdGlvbjphYnNvbHV0ZTtsZWZ0Oi0zMCU7dG9wOi0xMjAlO3dpZHRoOjYwJTtoZWlnaHQ6MzAwJTtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMjBkZWcsdHJhbnNwYXJlbnQscmdiYSgyNTUsMjU1LDI1NSwuMTgpLHRyYW5zcGFyZW50KTt0cmFuc2Zvcm06cm90YXRlKDhkZWcpO29wYWNpdHk6LjI1O2FuaW1hdGlvbjpjYXJkLXNoZWVuIDlzIGxpbmVhciBpbmZpbml0ZX1cclxuQGtleWZyYW1lcyBjYXJkLXNoZWVuezAle3RyYW5zZm9ybTp0cmFuc2xhdGVYKDApIHJvdGF0ZSg4ZGVnKX0xMDAle3RyYW5zZm9ybTp0cmFuc2xhdGVYKDE2MCUpIHJvdGF0ZSg4ZGVnKX19XHJcbi5yb3d7ZGlzcGxheTpmbGV4O2dhcDo4cHg7YWxpZ24taXRlbXM6Y2VudGVyfVxyXG4uY2FyZCBpbnB1dCwuY2FyZCBidXR0b257Ym94LXNpemluZzpib3JkZXItYm94O291dGxpbmU6bm9uZX1cclxuLmNhcmQgaW5wdXR7YmFja2dyb3VuZDpyZ2JhKDI1NSwyNTUsMjU1LC4wOCk7Ym9yZGVyOjA7Ym9yZGVyLXJhZGl1czp2YXIoLS1yYWRpdXMtbWQpO2NvbG9yOnZhcigtLWZnKTtwYWRkaW5nOjEwcHg7bWFyZ2luOjhweCAwO2FwcGVhcmFuY2U6bm9uZTstd2Via2l0LWFwcGVhcmFuY2U6bm9uZTtiYWNrZ3JvdW5kLWNsaXA6cGFkZGluZy1ib3g7cG9pbnRlci1ldmVudHM6YXV0bzt0b3VjaC1hY3Rpb246bWFuaXB1bGF0aW9ufVxyXG4uY2FyZCBzZWxlY3QuaW5wdXQsIHNlbGVjdC5pbnB1dHtiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjA4KTtjb2xvcjp2YXIoLS1mZyk7Ym9yZGVyOjA7Ym9yZGVyLXJhZGl1czp2YXIoLS1yYWRpdXMtbWQpO3BhZGRpbmc6MTBweDttYXJnaW46OHB4IDA7YXBwZWFyYW5jZTpub25lOy13ZWJraXQtYXBwZWFyYW5jZTpub25lO2JhY2tncm91bmQtY2xpcDpwYWRkaW5nLWJveH1cclxuLmNhcmQgc2VsZWN0LmlucHV0IG9wdGlvbiwgc2VsZWN0LmlucHV0IG9wdGlvbntiYWNrZ3JvdW5kOiMwYjEwMjA7Y29sb3I6I2ZmZn1cclxuLmNhcmQgc2VsZWN0LmlucHV0OmZvY3VzLCBzZWxlY3QuaW5wdXQ6Zm9jdXN7b3V0bGluZToycHggc29saWQgcmdiYSgxMjMsNDQsMjQ1LC40NSl9XHJcbi5jYXJkIGJ1dHRvbnt3aWR0aDoxMDAlO2JvcmRlci1yYWRpdXM6dmFyKC0tcmFkaXVzLW1kKX1cclxuLmJ0bntwb3NpdGlvbjpyZWxhdGl2ZTtvdmVyZmxvdzpoaWRkZW47cGFkZGluZzoxMHB4IDE0cHg7Ym9yZGVyOjA7Ym9yZGVyLXJhZGl1czp2YXIoLS1yYWRpdXMtbWQpO2NvbG9yOiNmZmY7dHJhbnNpdGlvbjp0cmFuc2Zvcm0gdmFyKC0tZHVyKSB2YXIoLS1lYXNlKSxib3gtc2hhZG93IHZhcigtLWR1cikgdmFyKC0tZWFzZSksZmlsdGVyIHZhcigtLWR1cikgdmFyKC0tZWFzZSl9XHJcbi5idG4gLmljb257bWFyZ2luLXJpZ2h0OjZweH1cclxuLmJ0bjphY3RpdmV7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoMXB4KSBzY2FsZSguOTkpfVxyXG4uYnRuOjphZnRlcntjb250ZW50OlwiXCI7cG9zaXRpb246YWJzb2x1dGU7aW5zZXQ6MDtvcGFjaXR5OjA7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTE1ZGVnLHRyYW5zcGFyZW50LHJnYmEoMjU1LDI1NSwyNTUsLjI1KSx0cmFuc3BhcmVudCA1NSUpO3RyYW5zZm9ybTp0cmFuc2xhdGVYKC02MCUpO3RyYW5zaXRpb246b3BhY2l0eSB2YXIoLS1kdXIpIHZhcigtLWVhc2UpLCB0cmFuc2Zvcm0gdmFyKC0tZHVyKSB2YXIoLS1lYXNlKX1cclxuLmJ0bjpob3Zlcjo6YWZ0ZXJ7b3BhY2l0eTouOTt0cmFuc2Zvcm06dHJhbnNsYXRlWCgwKX1cclxuLmJ0bjpob3ZlcntmaWx0ZXI6c2F0dXJhdGUoMTEwJSl9XHJcbi5idG4tcHJpbWFyeXtiYWNrZ3JvdW5kOnZhcigtLWdyYWQpO2JveC1zaGFkb3c6dmFyKC0tZ2xvdyl9XHJcbi5idG4tZW5lcmd5e3Bvc2l0aW9uOnJlbGF0aXZlO2FuaW1hdGlvbjpidG4tcHVsc2UgMnMgZWFzZS1pbi1vdXQgaW5maW5pdGV9XHJcbi5idG4tZW5lcmd5OjpiZWZvcmV7Y29udGVudDpcIlwiO3Bvc2l0aW9uOmFic29sdXRlO2luc2V0Oi0ycHg7Ym9yZGVyLXJhZGl1czppbmhlcml0O2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZyxyZ2JhKDEyMyw0NCwyNDUsLjYpLHJnYmEoNDQsMTM3LDI0NSwuNikpO2ZpbHRlcjpibHVyKDhweCk7ei1pbmRleDotMTtvcGFjaXR5Oi42O2FuaW1hdGlvbjplbmVyZ3ktcmluZyAycyBlYXNlLWluLW91dCBpbmZpbml0ZX1cclxuQGtleWZyYW1lcyBidG4tcHVsc2V7MCUsMTAwJXt0cmFuc2Zvcm06c2NhbGUoMSl9NTAle3RyYW5zZm9ybTpzY2FsZSgxLjAyKX19XHJcbkBrZXlmcmFtZXMgZW5lcmd5LXJpbmd7MCUsMTAwJXtvcGFjaXR5Oi40O2ZpbHRlcjpibHVyKDhweCl9NTAle29wYWNpdHk6Ljg7ZmlsdGVyOmJsdXIoMTJweCl9fVxyXG4uYnRuLWJ1eXtiYWNrZ3JvdW5kOnZhcigtLWJ1eSl9XHJcbi5idG4tc2VsbHtiYWNrZ3JvdW5kOnZhcigtLXNlbGwpfVxyXG4uYnRuLWdob3N0e2JhY2tncm91bmQ6cmdiYSgyNTUsMjU1LDI1NSwuMDgpfVxyXG4uaW5wdXR7d2lkdGg6MTAwJTtwYWRkaW5nOjEwcHg7Ym9yZGVyOjA7Ym9yZGVyLXJhZGl1czp2YXIoLS1yYWRpdXMtbWQpO2JhY2tncm91bmQ6cmdiYSgyNTUsMjU1LDI1NSwuMDgpO2NvbG9yOnZhcigtLWZnKTtwb2ludGVyLWV2ZW50czphdXRvO3RvdWNoLWFjdGlvbjptYW5pcHVsYXRpb247dXNlci1zZWxlY3Q6dGV4dDstd2Via2l0LXVzZXItc2VsZWN0OnRleHR9XHJcbi5waWxse3BhZGRpbmc6MnB4IDhweDtib3JkZXItcmFkaXVzOjk5OXB4O2JhY2tncm91bmQ6cmdiYSgyNTUsMjU1LDI1NSwuMDgpO2ZvbnQtc2l6ZToxMnB4O2N1cnNvcjpwb2ludGVyO3RyYW5zaXRpb246YmFja2dyb3VuZCAuM3MgZWFzZX1cclxuLnBpbGwucGlsbC1ydW5uaW5ne2FuaW1hdGlvbjpwaWxsLWJyZWF0aGUgMnMgZWFzZS1pbi1vdXQgaW5maW5pdGV9XHJcbkBrZXlmcmFtZXMgcGlsbC1icmVhdGhlezAlLDEwMCV7YmFja2dyb3VuZDpyZ2JhKDQ2LDE5NCwxMjYsLjI1KTtib3gtc2hhZG93OjAgMCA4cHggcmdiYSg0NiwxOTQsMTI2LC4zKX01MCV7YmFja2dyb3VuZDpyZ2JhKDQ2LDE5NCwxMjYsLjM1KTtib3gtc2hhZG93OjAgMCAxMnB4IHJnYmEoNDYsMTk0LDEyNiwuNSl9fVxyXG4ucGlsbC5waWxsLWNvbGxhcHNlZHthbmltYXRpb246cGlsbC1hbGVydCAxcyBlYXNlLWluLW91dCBpbmZpbml0ZX1cclxuQGtleWZyYW1lcyBwaWxsLWFsZXJ0ezAlLDEwMCV7YmFja2dyb3VuZDpyZ2JhKDI1NSw5Miw5MiwuMjUpO2JveC1zaGFkb3c6MCAwIDhweCByZ2JhKDI1NSw5Miw5MiwuMyl9NTAle2JhY2tncm91bmQ6cmdiYSgyNTUsOTIsOTIsLjQ1KTtib3gtc2hhZG93OjAgMCAxNnB4IHJnYmEoMjU1LDkyLDkyLC42KX19XHJcbi5waWxsLmFjdGl2ZXtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcsIHJnYmEoMTIzLDQ0LDI0NSwuMzUpLCByZ2JhKDQ0LDEzNywyNDUsLjI4KSk7Ym94LXNoYWRvdzp2YXIoLS1nbG93KX1cclxuLnNjZW5lLWhlYWRlcntkaXNwbGF5OmZsZXg7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YWxpZ24taXRlbXM6ZmxleC1lbmQ7Z2FwOjEycHg7bWFyZ2luLWJvdHRvbTo4cHh9XHJcbi5zY2VuZS1oZWFkZXIgaDF7bWFyZ2luOjA7Zm9udC1zaXplOjIwcHh9XHJcbi5zY2VuZS1oZWFkZXIgcHttYXJnaW46MDtvcGFjaXR5Oi44NX1cclxuLnN0YXRze2Rpc3BsYXk6ZmxleDtnYXA6MTBweH1cclxuLnN0YXR7ZmxleDoxO21pbi13aWR0aDowO2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDE4MGRlZyxyZ2JhKDI1NSwyNTUsMjU1LC4wNikscmdiYSgyNTUsMjU1LDI1NSwuMDMpKTtib3JkZXItcmFkaXVzOjEycHg7cGFkZGluZzoxMHB4O2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjEwcHh9XHJcbi5zdGF0IC5pY297Zm9udC1zaXplOjE4cHg7ZmlsdGVyOmRyb3Atc2hhZG93KDAgMCA4cHggcmdiYSgxMjMsNDQsMjQ1LC4zNSkpO3RyYW5zaXRpb246dHJhbnNmb3JtIC4zcyBlYXNlfVxyXG4ucHVsc2UtaWNvbnthbmltYXRpb246aWNvbi1wdWxzZSAuNnMgZWFzZX1cclxuQGtleWZyYW1lcyBpY29uLXB1bHNlezAlLDEwMCV7dHJhbnNmb3JtOnNjYWxlKDEpfTUwJXt0cmFuc2Zvcm06c2NhbGUoMS4zKSByb3RhdGUoNWRlZyl9fVxyXG4uc3RhdCAudmFse2ZvbnQtd2VpZ2h0OjcwMDtmb250LXNpemU6MTZweH1cclxuLnN0YXQgLmxhYmVse29wYWNpdHk6Ljg1O2ZvbnQtc2l6ZToxMnB4fVxyXG4uZXZlbnQtZmVlZHttYXgtaGVpZ2h0OjI0MHB4O292ZXJmbG93OmF1dG87ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6NnB4fVxyXG4uZXZlbnQtZmVlZCAuZXZlbnR7b3BhY2l0eTouOTtmb250LWZhbWlseTptb25vc3BhY2U7Zm9udC1zaXplOjEycHh9XHJcbi5tYWluLXNjcmVlbntwb3NpdGlvbjpyZWxhdGl2ZTtwYWRkaW5nOjEycHggMCAzNnB4O21pbi1oZWlnaHQ6MTAwdmh9XHJcbi5tYWluLXN0YWNre2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjE2cHh9XHJcbi5taW5lLWNhcmR7bWluLWhlaWdodDpjYWxjKDEwMHZoIC0gMTYwcHgpO3BhZGRpbmc6MjRweCAyMHB4O2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjIwcHg7Ym9yZGVyLXJhZGl1czoyMHB4fVxyXG5AbWVkaWEgKG1pbi13aWR0aDo1ODBweCl7Lm1pbmUtY2FyZHttaW4taGVpZ2h0OjYyMHB4O3BhZGRpbmc6MjhweCAyNnB4fX1cclxuLm1pbmUtaGVhZGVye2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47Z2FwOjEycHh9XHJcbi5taW5lLXRpdGxle2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjEwcHg7Zm9udC1zaXplOjE4cHg7Zm9udC13ZWlnaHQ6NjAwO2xldHRlci1zcGFjaW5nOi4wNGVtO3RleHQtc2hhZG93OjAgMnB4IDEycHggcmdiYSgxOCwxMCw0OCwuNil9XHJcbi5taW5lLXRpdGxlIC5pY29ue2ZpbHRlcjpkcm9wLXNoYWRvdygwIDAgMTJweCByZ2JhKDEyNCw2MCwyNTUsLjU1KSl9XHJcbi5taW5lLWNoaXBze2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjhweH1cclxuLm1pbmUtY2hpcHMgLnBpbGx7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NnB4O2ZvbnQtc2l6ZToxMnB4O2JhY2tncm91bmQ6cmdiYSgxNSwyNCw1NiwuNTUpO2JveC1zaGFkb3c6aW5zZXQgMCAwIDAgMXB4IHJnYmEoMTIzLDQ0LDI0NSwuMjUpfVxyXG4ubWluZS1ncmlke2Rpc3BsYXk6Z3JpZDtnYXA6MThweH1cclxuQG1lZGlhIChtaW4td2lkdGg6NjQwcHgpey5taW5lLWdyaWR7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOjIyMHB4IDFmcjthbGlnbi1pdGVtczpjZW50ZXJ9fVxyXG4ubWluZS1nYXVnZXtwb3NpdGlvbjpyZWxhdGl2ZTtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpjZW50ZXI7cGFkZGluZzo4cHggMH1cclxuLm1pbmUtZ2F1Z2UgLnJpbmd7d2lkdGg6MjAwcHg7aGVpZ2h0OjIwMHB4O2JvcmRlci1yYWRpdXM6NTAlO2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OmNlbnRlcjtiYWNrZ3JvdW5kOmNvbmljLWdyYWRpZW50KCM3QjJDRjUgMGRlZyxyZ2JhKDI1NSwyNTUsMjU1LC4wOCkgMGRlZyk7Ym94LXNoYWRvdzppbnNldCAwIDAgMzBweCByZ2JhKDEyMyw0NCwyNDUsLjI4KSwwIDI0cHggNDhweCByZ2JhKDEyLDgsNDIsLjU1KX1cclxuLm1pbmUtZ2F1Z2UgLnJpbmc6OmJlZm9yZXtjb250ZW50OlwiXCI7cG9zaXRpb246YWJzb2x1dGU7aW5zZXQ6MTglO2JvcmRlci1yYWRpdXM6NTAlO2JhY2tncm91bmQ6cmFkaWFsLWdyYWRpZW50KGNpcmNsZSBhdCA1MCUgMjglLHJnYmEoMTIzLDQ0LDI0NSwuNDUpLHJnYmEoMTIsMjAsNDYsLjkyKSA3MCUpO2JveC1zaGFkb3c6aW5zZXQgMCAxNHB4IDI4cHggcmdiYSgwLDAsMCwuNDgpfVxyXG4ubWluZS1nYXVnZSAucmluZy1jb3Jle3Bvc2l0aW9uOnJlbGF0aXZlO2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo0cHg7Zm9udC13ZWlnaHQ6NjAwfVxyXG4ubWluZS1nYXVnZSAucmluZy1jb3JlIHNwYW57Zm9udC1zaXplOjIycHh9XHJcbi5taW5lLWdhdWdlIC5yaW5nLWNvcmUgc21hbGx7Zm9udC1zaXplOjEycHg7bGV0dGVyLXNwYWNpbmc6LjEyZW07b3BhY2l0eTouNzU7dGV4dC10cmFuc2Zvcm06dXBwZXJjYXNlfVxyXG4ucmluZy1nbG93e3Bvc2l0aW9uOmFic29sdXRlO3dpZHRoOjIwMHB4O2hlaWdodDoyMDBweDtib3JkZXItcmFkaXVzOjUwJTtmaWx0ZXI6Ymx1cigzMnB4KTtiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudChjaXJjbGUscmdiYSgxMjMsNDQsMjQ1LC40OCkscmdiYSg0NCwxMzcsMjQ1LC4xKSk7b3BhY2l0eTouNjthbmltYXRpb246bWluZS1nbG93IDlzIGVhc2UtaW4tb3V0IGluZmluaXRlfVxyXG4ucmluZy1nbG93LWJ7YW5pbWF0aW9uLWRlbGF5Oi00LjVzO2JhY2tncm91bmQ6cmFkaWFsLWdyYWRpZW50KGNpcmNsZSxyZ2JhKDQ0LDEzNywyNDUsLjQ1KSx0cmFuc3BhcmVudCA2NSUpfVxyXG4ucmluZy1wdWxzZXthbmltYXRpb246cmluZy1mbGFzaCAuNnMgZWFzZSFpbXBvcnRhbnR9XHJcbkBrZXlmcmFtZXMgcmluZy1mbGFzaHswJSwxMDAle2JveC1zaGFkb3c6aW5zZXQgMCAwIDMwcHggcmdiYSgxMjMsNDQsMjQ1LC4yOCksMCAyNHB4IDQ4cHggcmdiYSgxMiw4LDQyLC41NSl9NTAle2JveC1zaGFkb3c6aW5zZXQgMCAwIDUwcHggcmdiYSgyNDYsMTk2LDY5LC44KSwwIDI0cHggNjhweCByZ2JhKDI0NiwxOTYsNjksLjUpLDAgMCA4MHB4IHJnYmEoMjQ2LDE5Niw2OSwuNCl9fVxyXG4ucmluZy1mdWxse2FuaW1hdGlvbjpyaW5nLWdsb3ctZnVsbCAycyBlYXNlLWluLW91dCBpbmZpbml0ZSFpbXBvcnRhbnR9XHJcbkBrZXlmcmFtZXMgcmluZy1nbG93LWZ1bGx7MCUsMTAwJXtib3gtc2hhZG93Omluc2V0IDAgMCA0MHB4IHJnYmEoMjQ2LDE5Niw2OSwuNSksMCAyNHB4IDQ4cHggcmdiYSgyNDYsMTk2LDY5LC4zNSksMCAwIDYwcHggcmdiYSgyNDYsMTk2LDY5LC4zKX01MCV7Ym94LXNoYWRvdzppbnNldCAwIDAgNjBweCByZ2JhKDI0NiwxOTYsNjksLjcpLDAgMjRweCA2OHB4IHJnYmEoMjQ2LDE5Niw2OSwuNSksMCAwIDgwcHggcmdiYSgyNDYsMTk2LDY5LC41KX19XHJcbi5taWxlc3RvbmUtcHVsc2V7YW5pbWF0aW9uOm1pbGVzdG9uZS1yaW5nIDFzIGVhc2V9XHJcbkBrZXlmcmFtZXMgbWlsZXN0b25lLXJpbmd7MCV7dHJhbnNmb3JtOnNjYWxlKDEpfTMwJXt0cmFuc2Zvcm06c2NhbGUoMS4wOCl9NjAle3RyYW5zZm9ybTpzY2FsZSguOTgpfTEwMCV7dHJhbnNmb3JtOnNjYWxlKDEpfX1cclxuQGtleWZyYW1lcyBtaW5lLWdsb3d7MCUsMTAwJXt0cmFuc2Zvcm06c2NhbGUoLjkyKTtvcGFjaXR5Oi40NX01MCV7dHJhbnNmb3JtOnNjYWxlKDEuMDUpO29wYWNpdHk6Ljh9fVxyXG4ubWluZS1wcm9ncmVzc3tkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDoxNHB4fVxyXG4ubWluZS1wcm9ncmVzcy1tZXRhe2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpmbGV4LWVuZDtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2Vlbjtmb250LXNpemU6MTRweDtsZXR0ZXItc3BhY2luZzouMDJlbX1cclxuLm1pbmUtcHJvZ3Jlc3MtdHJhY2t7cG9zaXRpb246cmVsYXRpdmU7aGVpZ2h0OjEycHg7Ym9yZGVyLXJhZGl1czo5OTlweDtiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjEpO292ZXJmbG93OmhpZGRlbjtib3gtc2hhZG93Omluc2V0IDAgMCAxNHB4IHJnYmEoMTIzLDQ0LDI0NSwuMjgpfVxyXG4ubWluZS1wcm9ncmVzcy1maWxse2hlaWdodDoxMDAlO3dpZHRoOjA7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoOTBkZWcsIzdCMkNGNSwjMkM4OUY1KTtib3gtc2hhZG93OjAgMCAxNnB4IHJnYmEoMTIzLDQ0LDI0NSwuNjUpO3RyYW5zaXRpb246d2lkdGggLjM1cyB2YXIoLS1lYXNlKTtwb3NpdGlvbjpyZWxhdGl2ZTtvdmVyZmxvdzpoaWRkZW59XHJcbi5taW5lLXByb2dyZXNzLWZpbGw6OmFmdGVye2NvbnRlbnQ6XCJcIjtwb3NpdGlvbjphYnNvbHV0ZTt0b3A6MDtsZWZ0Oi0xMDAlO3dpZHRoOjEwMCU7aGVpZ2h0OjEwMCU7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoOTBkZWcsdHJhbnNwYXJlbnQscmdiYSgyNTUsMjU1LDI1NSwuMyksdHJhbnNwYXJlbnQpO2FuaW1hdGlvbjpwcm9ncmVzcy13YXZlIDJzIGxpbmVhciBpbmZpbml0ZX1cclxuQGtleWZyYW1lcyBwcm9ncmVzcy13YXZlezAle2xlZnQ6LTEwMCV9MTAwJXtsZWZ0OjIwMCV9fVxyXG4ubWluZS1zdGF0dXN7bWluLWhlaWdodDoyMnB4O2ZvbnQtc2l6ZToxM3B4O29wYWNpdHk6Ljl9XHJcbi5taW5lLWFjdGlvbnMtZ3JpZHtkaXNwbGF5OmdyaWQ7Z2FwOjEycHg7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOnJlcGVhdCgyLG1pbm1heCgwLDFmcikpfVxyXG4ubWluZS1hY3Rpb25zLWdyaWQgLmJ0bntoZWlnaHQ6NDhweDtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpjZW50ZXI7Zm9udC1zaXplOjE1cHg7Z2FwOjhweH1cclxuLm1pbmUtYWN0aW9ucy1ncmlkIC5zcGFuLTJ7Z3JpZC1jb2x1bW46c3BhbiAyfVxyXG5AbWVkaWEgKG1pbi13aWR0aDo2ODBweCl7Lm1pbmUtYWN0aW9ucy1ncmlke2dyaWQtdGVtcGxhdGUtY29sdW1uczpyZXBlYXQoMyxtaW5tYXgoMCwxZnIpKX0ubWluZS1hY3Rpb25zLWdyaWQgLnNwYW4tMntncmlkLWNvbHVtbjpzcGFuIDN9fVxyXG4ubWluZS1mZWVke3Bvc2l0aW9uOnJlbGF0aXZlO2JvcmRlci1yYWRpdXM6MTZweDtiYWNrZ3JvdW5kOnJnYmEoMTIsMjAsNDQsLjU1KTtwYWRkaW5nOjE0cHggMTJweDtib3gtc2hhZG93Omluc2V0IDAgMCAyNHB4IHJnYmEoMTIzLDQ0LDI0NSwuMTIpO2JhY2tkcm9wLWZpbHRlcjpibHVyKDEycHgpfVxyXG4ubWluZS1mZWVkOjpiZWZvcmV7Y29udGVudDpcIlwiO3Bvc2l0aW9uOmFic29sdXRlO2luc2V0OjA7cG9pbnRlci1ldmVudHM6bm9uZTtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcscmdiYSgxMjMsNDQsMjQ1LC4xNikscmdiYSg0NCwxMzcsMjQ1LC4xNCkgNjAlLHRyYW5zcGFyZW50KTtvcGFjaXR5Oi43NX1cclxuLm1pbmUtZmVlZCAuZXZlbnQtZmVlZHttYXgtaGVpZ2h0OjE4MHB4fVxyXG4uZXZlbnR7dHJhbnNpdGlvbjpvcGFjaXR5IC4zcyBlYXNlLCB0cmFuc2Zvcm0gLjNzIGVhc2V9XHJcbi5ldmVudC1jcml0aWNhbHtjb2xvcjojZjZjNDQ1O2ZvbnQtd2VpZ2h0OjYwMH1cclxuLmV2ZW50LXdhcm5pbmd7Y29sb3I6I2ZmNWM1Y31cclxuLmV2ZW50LXN1Y2Nlc3N7Y29sb3I6IzJlYzI3ZX1cclxuLmV2ZW50LW5vcm1hbHtjb2xvcjpyZ2JhKDI1NSwyNTUsMjU1LC45KX1cclxuLm1pbmUtaG9sb2dyYW17cG9zaXRpb246cmVsYXRpdmU7ZmxleDoxO21pbi1oZWlnaHQ6MTgwcHg7Ym9yZGVyLXJhZGl1czoxOHB4O2JhY2tncm91bmQ6cmFkaWFsLWdyYWRpZW50KDkwJSAxMjAlIGF0IDUwJSAxMDAlLHJnYmEoNDQsMTM3LDI0NSwuMzUpLHJnYmEoOCwxMiwzMCwuMykgNTUlLHRyYW5zcGFyZW50KTtvdmVyZmxvdzpoaWRkZW47bWFyZ2luLXRvcDphdXRvO2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OmNlbnRlcjtpc29sYXRpb246aXNvbGF0ZTt0cmFuc2l0aW9uOmJhY2tncm91bmQgLjVzIGVhc2V9XHJcbi5ob2xvLWlkbGV7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoOTAlIDEyMCUgYXQgNTAlIDEwMCUscmdiYSgxMjMsNDQsMjQ1LC4yNSkscmdiYSg4LDEyLDMwLC4zKSA1NSUsdHJhbnNwYXJlbnQpfVxyXG4uaG9sby1taW5pbmd7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoOTAlIDEyMCUgYXQgNTAlIDEwMCUscmdiYSg0NCwxMzcsMjQ1LC40NSkscmdiYSg4LDEyLDMwLC4zKSA1NSUsdHJhbnNwYXJlbnQpfVxyXG4uaG9sby1taW5pbmcgLm1pbmUtaG9sby1ncmlke2FuaW1hdGlvbi1kdXJhdGlvbjoxMnMhaW1wb3J0YW50fVxyXG4uaG9sby1jb2xsYXBzZWR7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoOTAlIDEyMCUgYXQgNTAlIDEwMCUscmdiYSgyNTUsOTIsOTIsLjM1KSxyZ2JhKDgsMTIsMzAsLjMpIDU1JSx0cmFuc3BhcmVudCk7YW5pbWF0aW9uOmhvbG8tZ2xpdGNoIC41cyBlYXNlIGluZmluaXRlfVxyXG5Aa2V5ZnJhbWVzIGhvbG8tZ2xpdGNoezAlLDEwMCV7dHJhbnNmb3JtOnRyYW5zbGF0ZVgoMCl9MjUle3RyYW5zZm9ybTp0cmFuc2xhdGVYKC0ycHgpfTc1JXt0cmFuc2Zvcm06dHJhbnNsYXRlWCgycHgpfX1cclxuLmNyaXRpY2FsLWZsYXNoe2FuaW1hdGlvbjpjcml0aWNhbC1idXJzdCAuNHMgZWFzZX1cclxuQGtleWZyYW1lcyBjcml0aWNhbC1idXJzdHswJXtiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudCg5MCUgMTIwJSBhdCA1MCUgMTAwJSxyZ2JhKDQ0LDEzNywyNDUsLjM1KSxyZ2JhKDgsMTIsMzAsLjMpIDU1JSx0cmFuc3BhcmVudCl9NTAle2JhY2tncm91bmQ6cmFkaWFsLWdyYWRpZW50KDkwJSAxMjAlIGF0IDUwJSAxMDAlLHJnYmEoMjQ2LDE5Niw2OSwuNjUpLHJnYmEoMjQ2LDE5Niw2OSwuMikgNTUlLHRyYW5zcGFyZW50KX0xMDAle2JhY2tncm91bmQ6cmFkaWFsLWdyYWRpZW50KDkwJSAxMjAlIGF0IDUwJSAxMDAlLHJnYmEoNDQsMTM3LDI0NSwuMzUpLHJnYmEoOCwxMiwzMCwuMykgNTUlLHRyYW5zcGFyZW50KX19XHJcbi5taW5lLWhvbG8tZ3JpZHtwb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDoxNDAlO2hlaWdodDoxNDAlO2JhY2tncm91bmQ6cmVwZWF0aW5nLWxpbmVhci1ncmFkaWVudCgwZGVnLHJnYmEoMjU1LDI1NSwyNTUsLjA4KSAwLHJnYmEoMjU1LDI1NSwyNTUsLjA4KSAxcHgsdHJhbnNwYXJlbnQgMXB4LHRyYW5zcGFyZW50IDI4cHgpLHJlcGVhdGluZy1saW5lYXItZ3JhZGllbnQoOTBkZWcscmdiYSgyNTUsMjU1LDI1NSwuMDUpIDAscmdiYSgyNTUsMjU1LDI1NSwuMDUpIDFweCx0cmFuc3BhcmVudCAxcHgsdHJhbnNwYXJlbnQgMjZweCk7b3BhY2l0eTouMjI7dHJhbnNmb3JtOnRyYW5zbGF0ZTNkKC0xMCUsMCwwKSByb3RhdGUoOGRlZyk7YW5pbWF0aW9uOmhvbG8tcGFuIDE2cyBsaW5lYXIgaW5maW5pdGV9XHJcbi5taW5lLWhvbG8tZ3JpZC5kaWFnb25hbHtvcGFjaXR5Oi4xODt0cmFuc2Zvcm06dHJhbnNsYXRlM2QoMTAlLDAsMCkgcm90YXRlKC0xNmRlZyk7YW5pbWF0aW9uLWR1cmF0aW9uOjIyc31cclxuQGtleWZyYW1lcyBob2xvLXBhbnswJXt0cmFuc2Zvcm06dHJhbnNsYXRlM2QoLTEyJSwwLDApIHJvdGF0ZSg4ZGVnKX0xMDAle3RyYW5zZm9ybTp0cmFuc2xhdGUzZCgxMiUsMCwwKSByb3RhdGUoOGRlZyl9fVxyXG4ubWluZS1ob2xvLWdsb3d7cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6NzAlO2hlaWdodDo3MCU7Ym9yZGVyLXJhZGl1czo1MCU7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoY2lyY2xlIGF0IDUwJSA0MCUscmdiYSgxMjMsNDQsMjQ1LC41NSksdHJhbnNwYXJlbnQgNzAlKTtmaWx0ZXI6Ymx1cigzMnB4KTtvcGFjaXR5Oi41NTthbmltYXRpb246aG9sby1icmVhdGhlIDEwcyBlYXNlLWluLW91dCBpbmZpbml0ZX1cclxuQGtleWZyYW1lcyBob2xvLWJyZWF0aGV7MCUsMTAwJXt0cmFuc2Zvcm06c2NhbGUoLjkpO29wYWNpdHk6LjQ1fTUwJXt0cmFuc2Zvcm06c2NhbGUoMS4wOCk7b3BhY2l0eTouODV9fVxyXG4ubWluZS1zaGFyZHtwb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDoxMjBweDtoZWlnaHQ6MTIwcHg7YmFja2dyb3VuZDpjb25pYy1ncmFkaWVudChmcm9tIDE1MGRlZyxyZ2JhKDEyMyw0NCwyNDUsLjgpLHJnYmEoNDQsMTM3LDI0NSwuMzgpLHJnYmEoMTIzLDQ0LDI0NSwuMDgpKTtjbGlwLXBhdGg6cG9seWdvbig1MCUgMCw4OCUgNDAlLDcwJSAxMDAlLDMwJSAxMDAlLDEyJSA0MCUpO29wYWNpdHk6LjI2O2ZpbHRlcjpibHVyKC40cHgpO2FuaW1hdGlvbjpzaGFyZC1mbG9hdCA4cyBlYXNlLWluLW91dCBpbmZpbml0ZX1cclxuLm1pbmUtc2hhcmQuc2hhcmQtMXt0b3A6MTglO2xlZnQ6MTYlO2FuaW1hdGlvbi1kZWxheTotMS40c31cclxuLm1pbmUtc2hhcmQuc2hhcmQtMntib3R0b206MTYlO3JpZ2h0OjIyJTthbmltYXRpb24tZGVsYXk6LTMuMnM7dHJhbnNmb3JtOnNjYWxlKC43NCl9XHJcbi5taW5lLXNoYXJkLnNoYXJkLTN7dG9wOjI2JTtyaWdodDozNCU7YW5pbWF0aW9uLWRlbGF5Oi01LjFzO3RyYW5zZm9ybTpzY2FsZSguNSkgcm90YXRlKDEyZGVnKX1cclxuQGtleWZyYW1lcyBzaGFyZC1mbG9hdHswJSwxMDAle3RyYW5zZm9ybTp0cmFuc2xhdGVZKC0xMHB4KSBzY2FsZSgxKTtvcGFjaXR5Oi4yfTUwJXt0cmFuc2Zvcm06dHJhbnNsYXRlWSgxMHB4KSBzY2FsZSgxLjA1KTtvcGFjaXR5Oi40fX1cclxuLm1haW4tYW1iaWVudHtwb3NpdGlvbjphYnNvbHV0ZTtpbnNldDowO3otaW5kZXg6LTE7cG9pbnRlci1ldmVudHM6bm9uZTtvdmVyZmxvdzpoaWRkZW59XHJcbi5tYWluLWFtYmllbnQgLmFtYmllbnQub3Jie3Bvc2l0aW9uOmFic29sdXRlO3dpZHRoOjQyMHB4O2hlaWdodDo0MjBweDtib3JkZXItcmFkaXVzOjUwJTtmaWx0ZXI6Ymx1cigxMjBweCk7b3BhY2l0eTouNDI7YW5pbWF0aW9uOmFtYmllbnQtZHJpZnQgMjZzIGVhc2UtaW4tb3V0IGluZmluaXRlfVxyXG4ubWFpbi1hbWJpZW50IC5vcmItYXtiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudChjaXJjbGUscmdiYSgxMjMsNDQsMjQ1LC42KSx0cmFuc3BhcmVudCA3MCUpO3RvcDotMTQwcHg7cmlnaHQ6LTEyMHB4fVxyXG4ubWFpbi1hbWJpZW50IC5vcmItYntiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudChjaXJjbGUscmdiYSg0NCwxMzcsMjQ1LC41NSksdHJhbnNwYXJlbnQgNzAlKTtib3R0b206LTE4MHB4O2xlZnQ6LTE4MHB4O2FuaW1hdGlvbi1kZWxheTotMTNzfVxyXG4ubWFpbi1hbWJpZW50IC5ncmlke3Bvc2l0aW9uOmFic29sdXRlO2luc2V0OjA7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoNzAlIDYwJSBhdCA1MCUgMTAwJSxyZ2JhKDI1NSwyNTUsMjU1LC4wOCksdHJhbnNwYXJlbnQgNzUlKTtvcGFjaXR5Oi4zNTttaXgtYmxlbmQtbW9kZTpzY3JlZW47YW5pbWF0aW9uOmFtYmllbnQtcHVsc2UgMThzIGVhc2UtaW4tb3V0IGluZmluaXRlfVxyXG5Aa2V5ZnJhbWVzIGFtYmllbnQtZHJpZnR7MCUsMTAwJXt0cmFuc2Zvcm06dHJhbnNsYXRlM2QoMCwwLDApIHNjYWxlKDEpfTUwJXt0cmFuc2Zvcm06dHJhbnNsYXRlM2QoOCUsIC00JSwwKSBzY2FsZSgxLjA1KX19XHJcbkBrZXlmcmFtZXMgYW1iaWVudC1wdWxzZXswJSwxMDAle29wYWNpdHk6LjI1fTUwJXtvcGFjaXR5Oi40NX19XHJcbi5mYWRlLWlue2FuaW1hdGlvbjpmYWRlLWluIC4zcyB2YXIoLS1lYXNlKX1cclxuQGtleWZyYW1lcyBmYWRlLWlue2Zyb217b3BhY2l0eTowO3RyYW5zZm9ybTp0cmFuc2xhdGVZKDRweCl9dG97b3BhY2l0eToxO3RyYW5zZm9ybTpub25lfX1cclxuLmZsYXNoe2FuaW1hdGlvbjpmbGFzaCAuOXMgZWFzZX1cclxuQGtleWZyYW1lcyBmbGFzaHswJXtib3gtc2hhZG93OjAgMCAwIHJnYmEoMjU1LDI1NSwyNTUsMCl9NDAle2JveC1zaGFkb3c6MCAwIDAgNnB4IHJnYmEoMjU1LDI1NSwyNTUsLjE1KX0xMDAle2JveC1zaGFkb3c6MCAwIDAgcmdiYSgyNTUsMjU1LDI1NSwwKX19XHJcbi5za2VsZXRvbntwb3NpdGlvbjpyZWxhdGl2ZTtvdmVyZmxvdzpoaWRkZW47YmFja2dyb3VuZDpyZ2JhKDI1NSwyNTUsMjU1LC4wOCk7Ym9yZGVyLXJhZGl1czp2YXIoLS1yYWRpdXMtbWQpO2hlaWdodDo0NHB4fVxyXG4uc2tlbGV0b246OmFmdGVye2NvbnRlbnQ6XCJcIjtwb3NpdGlvbjphYnNvbHV0ZTtpbnNldDowO3RyYW5zZm9ybTp0cmFuc2xhdGVYKC0xMDAlKTtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCg5MGRlZyx0cmFuc3BhcmVudCxyZ2JhKDI1NSwyNTUsMjU1LC4xMiksdHJhbnNwYXJlbnQpO2FuaW1hdGlvbjpzaGltbWVyIDEuMnMgaW5maW5pdGV9XHJcbkBrZXlmcmFtZXMgc2hpbW1lcnsxMDAle3RyYW5zZm9ybTp0cmFuc2xhdGVYKDEwMCUpfX1cclxuLmxpc3QtaXRlbXtkaXNwbGF5OmZsZXg7Z2FwOjhweDthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YmFja2dyb3VuZDpyZ2JhKDI1NSwyNTUsMjU1LC4wNik7Ym9yZGVyLXJhZGl1czp2YXIoLS1yYWRpdXMtbWQpO3BhZGRpbmc6MTBweH1cclxuLmxpc3QtaXRlbS0tYnV5e2JvcmRlci1sZWZ0OjNweCBzb2xpZCB2YXIoLS1idXkpfVxyXG4ubGlzdC1pdGVtLS1zZWxse2JvcmRlci1sZWZ0OjNweCBzb2xpZCB2YXIoLS1zZWxsKX1cclxuLm5hdnttYXgtd2lkdGg6dmFyKC0tY29udGFpbmVyLW1heCk7bWFyZ2luOjEycHggYXV0byAwO2Rpc3BsYXk6ZmxleDtnYXA6OHB4O2ZsZXgtd3JhcDp3cmFwO3Bvc2l0aW9uOnN0aWNreTt0b3A6MDt6LWluZGV4OjQwO3BhZGRpbmc6NnB4O2JvcmRlci1yYWRpdXM6MTRweDtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxODBkZWcscmdiYSgyMCwyMCw0MCwuNDUpLHJnYmEoMjAsMjAsNDAsLjI1KSk7YmFja2Ryb3AtZmlsdGVyOmJsdXIoMTBweCkgc2F0dXJhdGUoMTI1JSk7Ym9yZGVyOjFweCBzb2xpZCByZ2JhKDI1NSwyNTUsMjU1LC4wNil9XHJcbi5uYXYgYXtmbGV4OjE7ZGlzcGxheTpmbGV4O2p1c3RpZnktY29udGVudDpjZW50ZXI7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo2cHg7dGV4dC1hbGlnbjpjZW50ZXI7cGFkZGluZzoxMHB4O2JvcmRlci1yYWRpdXM6OTk5cHg7dGV4dC1kZWNvcmF0aW9uOm5vbmU7Y29sb3I6I2ZmZjt0cmFuc2l0aW9uOmJhY2tncm91bmQgdmFyKC0tZHVyKSB2YXIoLS1lYXNlKSwgdHJhbnNmb3JtIHZhcigtLWR1cikgdmFyKC0tZWFzZSl9XHJcbi5uYXYgYSAuaWNve29wYWNpdHk6Ljk1fVxyXG4ubmF2IGEuYWN0aXZle2JhY2tncm91bmQ6dmFyKC0tZ3JhZCk7Ym94LXNoYWRvdzp2YXIoLS1nbG93KX1cclxuLm5hdiBhOm5vdCguYWN0aXZlKTpob3ZlcntiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjA2KX1cclxuLyogZ2VuZXJpYyBpY29uICovXHJcbi5pY29ue2Rpc3BsYXk6aW5saW5lLWJsb2NrO2xpbmUtaGVpZ2h0OjA7dmVydGljYWwtYWxpZ246bWlkZGxlfVxyXG4uaWNvbiBzdmd7ZGlzcGxheTpibG9jaztmaWx0ZXI6ZHJvcC1zaGFkb3coMCAwIDhweCByZ2JhKDEyMyw0NCwyNDUsLjM1KSl9XHJcbi8qIHJhcml0eSBiYWRnZXMgKi9cclxuLmJhZGdle2Rpc3BsYXk6aW5saW5lLWZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo2cHg7cGFkZGluZzoycHggOHB4O2JvcmRlci1yYWRpdXM6OTk5cHg7Zm9udC1zaXplOjEycHg7bGluZS1oZWlnaHQ6MTtib3JkZXI6MXB4IHNvbGlkIHJnYmEoMjU1LDI1NSwyNTUsLjEyKTtiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjA2KX1cclxuLmJhZGdlIGl7ZGlzcGxheTppbmxpbmUtYmxvY2s7d2lkdGg6OHB4O2hlaWdodDo4cHg7Ym9yZGVyLXJhZGl1czo5OTlweH1cclxuLmJhZGdlLnJhcml0eS1jb21tb24gaXtiYWNrZ3JvdW5kOnZhcigtLXJhcml0eS1jb21tb24pfVxyXG4uYmFkZ2UucmFyaXR5LXJhcmUgaXtiYWNrZ3JvdW5kOnZhcigtLXJhcml0eS1yYXJlKX1cclxuLmJhZGdlLnJhcml0eS1lcGljIGl7YmFja2dyb3VuZDp2YXIoLS1yYXJpdHktZXBpYyl9XHJcbi5iYWRnZS5yYXJpdHktbGVnZW5kYXJ5IGl7YmFja2dyb3VuZDp2YXIoLS1yYXJpdHktbGVnZW5kYXJ5KX1cclxuLnJhcml0eS1vdXRsaW5lLWNvbW1vbntib3gtc2hhZG93OjAgMCAwIDFweCByZ2JhKDE1NCwxNjAsMTY2LC4zNSkgaW5zZXQsIDAgMCAyNHB4IHJnYmEoMTU0LDE2MCwxNjYsLjE1KX1cclxuLnJhcml0eS1vdXRsaW5lLXJhcmV7Ym94LXNoYWRvdzowIDAgMCAxcHggcmdiYSg3OSwyMTIsMjQ1LC40NSkgaW5zZXQsIDAgMCAyOHB4IHJnYmEoNzksMjEyLDI0NSwuMjUpfVxyXG4ucmFyaXR5LW91dGxpbmUtZXBpY3tib3gtc2hhZG93OjAgMCAwIDFweCByZ2JhKDE3OCwxMDcsMjU1LC41KSBpbnNldCwgMCAwIDMycHggcmdiYSgxNzgsMTA3LDI1NSwuMyl9XHJcbi5yYXJpdHktb3V0bGluZS1sZWdlbmRhcnl7Ym94LXNoYWRvdzowIDAgMCAxcHggcmdiYSgyNDYsMTk2LDY5LC42KSBpbnNldCwgMCAwIDM2cHggcmdiYSgyNDYsMTk2LDY5LC4zNSl9XHJcbi8qIGF1cmEgY2FyZCB3cmFwcGVyICovXHJcbi5pdGVtLWNhcmR7cG9zaXRpb246cmVsYXRpdmU7Ym9yZGVyLXJhZGl1czp2YXIoLS1yYWRpdXMtbWQpO3BhZGRpbmc6MTBweDtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxNDBkZWcscmdiYSgyNTUsMjU1LDI1NSwuMDYpLHJnYmEoMjU1LDI1NSwyNTUsLjA0KSk7b3ZlcmZsb3c6aGlkZGVufVxyXG4uaXRlbS1jYXJkOjpiZWZvcmV7Y29udGVudDpcIlwiO3Bvc2l0aW9uOmFic29sdXRlO2luc2V0Oi0xcHg7Ym9yZGVyLXJhZGl1czppbmhlcml0O3BhZGRpbmc6MXB4O2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZyxyZ2JhKDI1NSwyNTUsMjU1LC4xOCkscmdiYSgyNTUsMjU1LDI1NSwuMDIpKTstd2Via2l0LW1hc2s6bGluZWFyLWdyYWRpZW50KCMwMDAgMCAwKSBjb250ZW50LWJveCxsaW5lYXItZ3JhZGllbnQoIzAwMCAwIDApOy13ZWJraXQtbWFzay1jb21wb3NpdGU6eG9yO21hc2stY29tcG9zaXRlOmV4Y2x1ZGV9XHJcbi5pdGVtLWNhcmRbZGF0YS1yYXJpdHk9XCJjb21tb25cIl17Ym9yZGVyOjFweCBzb2xpZCByZ2JhKDE1NCwxNjAsMTY2LC4yNSl9XHJcbi5pdGVtLWNhcmRbZGF0YS1yYXJpdHk9XCJyYXJlXCJde2JvcmRlcjoxcHggc29saWQgcmdiYSg3OSwyMTIsMjQ1LC4zNSl9XHJcbi5pdGVtLWNhcmRbZGF0YS1yYXJpdHk9XCJlcGljXCJde2JvcmRlcjoxcHggc29saWQgcmdiYSgxNzgsMTA3LDI1NSwuNCl9XHJcbi5pdGVtLWNhcmRbZGF0YS1yYXJpdHk9XCJsZWdlbmRhcnlcIl17Ym9yZGVyOjFweCBzb2xpZCByZ2JhKDI0NiwxOTYsNjksLjQ1KX1cclxuLyogdmVydGljYWwgdGltZWxpbmUgKi9cclxuLnRpbWVsaW5le3Bvc2l0aW9uOnJlbGF0aXZlO21hcmdpbi10b3A6OHB4O3BhZGRpbmctbGVmdDoxNnB4fVxyXG4udGltZWxpbmU6OmJlZm9yZXtjb250ZW50OlwiXCI7cG9zaXRpb246YWJzb2x1dGU7bGVmdDo2cHg7dG9wOjA7Ym90dG9tOjA7d2lkdGg6MnB4O2JhY2tncm91bmQ6cmdiYSgyNTUsMjU1LDI1NSwuMSl9XHJcbi50aW1lbGluZS1pdGVte3Bvc2l0aW9uOnJlbGF0aXZlO21hcmdpbjo4cHggMCA4cHggMH1cclxuLnRpbWVsaW5lLWl0ZW0gLmRvdHtwb3NpdGlvbjphYnNvbHV0ZTtsZWZ0Oi0xMnB4O3RvcDoycHg7d2lkdGg6MTBweDtoZWlnaHQ6MTBweDtib3JkZXItcmFkaXVzOjk5OXB4O2JhY2tncm91bmQ6dmFyKC0tcmFyaXR5LXJhcmUpO2JveC1zaGFkb3c6MCAwIDEwcHggcmdiYSg3OSwyMTIsMjQ1LC41KX1cclxuLnRpbWVsaW5lLWl0ZW0gLnRpbWV7b3BhY2l0eTouNzU7Zm9udC1zaXplOjEycHh9XHJcbi50aW1lbGluZS1pdGVtIC5kZXNje21hcmdpbi10b3A6MnB4fVxyXG4vKiBhY3Rpb24gYnV0dG9ucyBsaW5lICovXHJcbi5hY3Rpb25ze2Rpc3BsYXk6ZmxleDtnYXA6NnB4O2ZsZXgtd3JhcDp3cmFwfVxyXG4vKiBzdWJ0bGUgaG92ZXIgKi9cclxuLmhvdmVyLWxpZnR7dHJhbnNpdGlvbjp0cmFuc2Zvcm0gdmFyKC0tZHVyKSB2YXIoLS1lYXNlKSwgYm94LXNoYWRvdyB2YXIoLS1kdXIpIHZhcigtLWVhc2UpfVxyXG4uaG92ZXItbGlmdDpob3Zlcnt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtMXB4KX1cclxuLyogcmluZyBtZXRlciAqL1xyXG4ucmluZ3stLXNpemU6MTE2cHg7LS10aGljazoxMHB4O3Bvc2l0aW9uOnJlbGF0aXZlO3dpZHRoOnZhcigtLXNpemUpO2hlaWdodDp2YXIoLS1zaXplKTtib3JkZXItcmFkaXVzOjUwJTtiYWNrZ3JvdW5kOmNvbmljLWdyYWRpZW50KCM3QjJDRjUgMGRlZywgcmdiYSgyNTUsMjU1LDI1NSwuMDgpIDBkZWcpfVxyXG4ucmluZzo6YWZ0ZXJ7Y29udGVudDpcIlwiO3Bvc2l0aW9uOmFic29sdXRlO2luc2V0OmNhbGModmFyKC0tdGhpY2spKTtib3JkZXItcmFkaXVzOmluaGVyaXQ7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTgwZGVnLHJnYmEoMjU1LDI1NSwyNTUsLjA2KSxyZ2JhKDI1NSwyNTUsMjU1LC4wMikpfVxyXG4ucmluZyAubGFiZWx7cG9zaXRpb246YWJzb2x1dGU7aW5zZXQ6MDtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpjZW50ZXI7Zm9udC13ZWlnaHQ6NzAwfVxyXG4vKiB0b2FzdCAqL1xyXG4udG9hc3Qtd3JhcHtwb3NpdGlvbjpmaXhlZDtyaWdodDoxNnB4O2JvdHRvbToxNnB4O2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjhweDt6LWluZGV4Ojk5OTl9XHJcbi50b2FzdHttYXgtd2lkdGg6MzQwcHg7cGFkZGluZzoxMHB4IDEycHg7Ym9yZGVyLXJhZGl1czoxMnB4O2NvbG9yOiNmZmY7YmFja2dyb3VuZDpyZ2JhKDMwLDMwLDUwLC45Nik7Ym94LXNoYWRvdzp2YXIoLS1nbG93KTtwb3NpdGlvbjpyZWxhdGl2ZTtvdmVyZmxvdzpoaWRkZW59XHJcbi50b2FzdC5zdWNjZXNze2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDE4MGRlZyxyZ2JhKDQ2LDE5NCwxMjYsLjE2KSxyZ2JhKDMwLDMwLDUwLC45NikpfVxyXG4udG9hc3Qud2FybntiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxODBkZWcscmdiYSgyNDYsMTk2LDY5LC4xOCkscmdiYSgzMCwzMCw1MCwuOTYpKX1cclxuLnRvYXN0LmVycm9ye2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDE4MGRlZyxyZ2JhKDI1NSw5Miw5MiwuMTgpLHJnYmEoMzAsMzAsNTAsLjk2KSl9XHJcbi50b2FzdCAubGlmZXtwb3NpdGlvbjphYnNvbHV0ZTtsZWZ0OjA7Ym90dG9tOjA7aGVpZ2h0OjJweDtiYWNrZ3JvdW5kOiM3QjJDRjU7YW5pbWF0aW9uOnRvYXN0LWxpZmUgdmFyKC0tbGlmZSwzLjVzKSBsaW5lYXIgZm9yd2FyZHN9XHJcbkBrZXlmcmFtZXMgdG9hc3QtbGlmZXtmcm9te3dpZHRoOjEwMCV9dG97d2lkdGg6MH19XHJcbkBtZWRpYSAocHJlZmVycy1yZWR1Y2VkLW1vdGlvbjpyZWR1Y2Upeyp7YW5pbWF0aW9uLWR1cmF0aW9uOi4wMDFtcyFpbXBvcnRhbnQ7YW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudDoxIWltcG9ydGFudDt0cmFuc2l0aW9uLWR1cmF0aW9uOjBtcyFpbXBvcnRhbnR9fVxyXG5cclxuLyogcmVzcG9uc2l2ZSB3aWR0aCArIGRlc2t0b3AgZ3JpZCBsYXlvdXQgZm9yIGZ1bGxuZXNzICovXHJcbkBtZWRpYSAobWluLXdpZHRoOjkwMHB4KXs6cm9vdHstLWNvbnRhaW5lci1tYXg6OTIwcHh9fVxyXG5AbWVkaWEgKG1pbi13aWR0aDoxMjAwcHgpezpyb290ey0tY29udGFpbmVyLW1heDoxMDgwcHh9fVxyXG5cclxuLmNvbnRhaW5lci5ncmlkLTJ7ZGlzcGxheTpncmlkO2dyaWQtdGVtcGxhdGUtY29sdW1uczoxZnI7Z2FwOjEycHh9XHJcbkBtZWRpYSAobWluLXdpZHRoOjk4MHB4KXtcclxuICAuY29udGFpbmVyLmdyaWQtMntncmlkLXRlbXBsYXRlLWNvbHVtbnM6MWZyIDFmcjthbGlnbi1pdGVtczpzdGFydH1cclxuICAuY29udGFpbmVyLmdyaWQtMj4uY2FyZDpmaXJzdC1jaGlsZHtncmlkLWNvbHVtbjoxLy0xfVxyXG59XHJcblxyXG4vKiBkZWNvcmF0aXZlIHBhZ2Ugb3ZlcmxheXM6IGF1cm9yYSwgZ3JpZCBsaW5lcywgYm90dG9tIGdsb3cgKi9cclxuaHRtbDo6YmVmb3Jle2NvbnRlbnQ6XCJcIjtwb3NpdGlvbjpmaXhlZDtpbnNldDowO3BvaW50ZXItZXZlbnRzOm5vbmU7ei1pbmRleDotMjtvcGFjaXR5Oi4wMzU7YmFja2dyb3VuZC1pbWFnZTpsaW5lYXItZ3JhZGllbnQocmdiYSgyNTUsMjU1LDI1NSwuMDQpIDFweCwgdHJhbnNwYXJlbnQgMXB4KSxsaW5lYXItZ3JhZGllbnQoOTBkZWcsIHJnYmEoMjU1LDI1NSwyNTUsLjA0KSAxcHgsIHRyYW5zcGFyZW50IDFweCk7YmFja2dyb3VuZC1zaXplOjI0cHggMjRweH1cclxuYm9keTo6YmVmb3Jle2NvbnRlbnQ6XCJcIjtwb3NpdGlvbjpmaXhlZDtyaWdodDotMTB2dzt0b3A6LTE4dmg7d2lkdGg6NzB2dztoZWlnaHQ6NzB2aDtwb2ludGVyLWV2ZW50czpub25lO3otaW5kZXg6LTE7ZmlsdGVyOmJsdXIoNTBweCk7b3BhY2l0eTouNTU7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoY2xvc2VzdC1zaWRlIGF0IDI1JSA0MCUsIHJnYmEoMTIzLDQ0LDI0NSwuMzUpLCB0cmFuc3BhcmVudCA2NSUpLCByYWRpYWwtZ3JhZGllbnQoY2xvc2VzdC1zaWRlIGF0IDcwJSA2MCUsIHJnYmEoNDQsMTM3LDI0NSwuMjUpLCB0cmFuc3BhcmVudCA3MCUpO21peC1ibGVuZC1tb2RlOnNjcmVlbjthbmltYXRpb246YXVyb3JhLWEgMThzIGVhc2UtaW4tb3V0IGluZmluaXRlIGFsdGVybmF0ZX1cclxuYm9keTo6YWZ0ZXJ7Y29udGVudDpcIlwiO3Bvc2l0aW9uOmZpeGVkO2xlZnQ6LTEwdnc7Ym90dG9tOi0yMnZoO3dpZHRoOjEyMHZ3O2hlaWdodDo2MHZoO3BvaW50ZXItZXZlbnRzOm5vbmU7ei1pbmRleDotMTtmaWx0ZXI6Ymx1cig2MHB4KTtvcGFjaXR5Oi43NTtiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudCgxMjB2dyA2MHZoIGF0IDUwJSAxMDAlLCByZ2JhKDQ0LDEzNywyNDUsLjIyKSwgdHJhbnNwYXJlbnQgNjUlKSwgY29uaWMtZ3JhZGllbnQoZnJvbSAyMDBkZWcgYXQgNTAlIDc1JSwgcmdiYSgxMjMsNDQsMjQ1LC4xOCksIHJnYmEoNDQsMTM3LDI0NSwuMTIpLCB0cmFuc3BhcmVudCA3MCUpO21peC1ibGVuZC1tb2RlOnNjcmVlbjthbmltYXRpb246YXVyb3JhLWIgMjJzIGVhc2UtaW4tb3V0IGluZmluaXRlIGFsdGVybmF0ZX1cclxuQGtleWZyYW1lcyBhdXJvcmEtYXswJXt0cmFuc2Zvcm06dHJhbnNsYXRlWSgwKX0xMDAle3RyYW5zZm9ybTp0cmFuc2xhdGVZKDE0cHgpfX1cclxuQGtleWZyYW1lcyBhdXJvcmEtYnswJXt0cmFuc2Zvcm06dHJhbnNsYXRlWSgwKX0xMDAle3RyYW5zZm9ybTp0cmFuc2xhdGVZKC0xMnB4KX19XHJcbmA7XHJcbiAgY29uc3Qgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xyXG4gIHN0eWxlLnNldEF0dHJpYnV0ZSgnZGF0YS11aScsICdtaW5lci1nYW1lJyk7XHJcbiAgc3R5bGUudGV4dENvbnRlbnQgPSBjc3M7XHJcbiAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XHJcbiAgaW5qZWN0ZWQgPSB0cnVlO1xyXG5cclxuICAvLyBzb2Z0IHN0YXJmaWVsZCBiYWNrZ3JvdW5kICh2ZXJ5IGxpZ2h0KVxyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBleGlzdHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1zdGFyc10nKTtcclxuICAgIGlmICghZXhpc3RzKSB7XHJcbiAgICAgIGNvbnN0IGN2cyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG4gICAgICBjdnMuc2V0QXR0cmlidXRlKCdkYXRhLXN0YXJzJywgJycpO1xyXG4gICAgICBjdnMuc3R5bGUuY3NzVGV4dCA9ICdwb3NpdGlvbjpmaXhlZDtpbnNldDowO3otaW5kZXg6LTI7b3BhY2l0eTouNDA7cG9pbnRlci1ldmVudHM6bm9uZTsnO1xyXG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGN2cyk7XHJcbiAgICAgIGNvbnN0IGN0eCA9IGN2cy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgICBjb25zdCBzdGFycyA9IEFycmF5LmZyb20oeyBsZW5ndGg6IDgwIH0sICgpID0+ICh7IHg6IE1hdGgucmFuZG9tKCksIHk6IE1hdGgucmFuZG9tKCksIHI6IE1hdGgucmFuZG9tKCkqMS4yKzAuMiwgczogTWF0aC5yYW5kb20oKSowLjgrMC4yIH0pKTtcclxuICAgICAgdHlwZSBNZXRlb3IgPSB7IHg6IG51bWJlcjsgeTogbnVtYmVyOyB2eDogbnVtYmVyOyB2eTogbnVtYmVyOyBsaWZlOiBudW1iZXI7IHR0bDogbnVtYmVyIH07XHJcbiAgICAgIGNvbnN0IG1ldGVvcnM6IE1ldGVvcltdID0gW107XHJcbiAgICAgIGNvbnN0IHNwYXduTWV0ZW9yID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHggPSBNYXRoLnJhbmRvbSgpKmN2cy53aWR0aCowLjYgKyBjdnMud2lkdGgqMC4yO1xyXG4gICAgICAgIGNvbnN0IHkgPSAtMjA7IC8vIGZyb20gdG9wXHJcbiAgICAgICAgY29uc3Qgc3BlZWQgPSAzICsgTWF0aC5yYW5kb20oKSozO1xyXG4gICAgICAgIGNvbnN0IGFuZ2xlID0gTWF0aC5QSSowLjggKyBNYXRoLnJhbmRvbSgpKjAuMjsgLy8gZGlhZ29uYWxseVxyXG4gICAgICAgIG1ldGVvcnMucHVzaCh7IHgsIHksIHZ4OiBNYXRoLmNvcyhhbmdsZSkqc3BlZWQsIHZ5OiBNYXRoLnNpbihhbmdsZSkqc3BlZWQsIGxpZmU6IDAsIHR0bDogMTIwMCArIE1hdGgucmFuZG9tKCkqODAwIH0pO1xyXG4gICAgICB9O1xyXG4gICAgICAvLyBnZW50bGUgcGxhbmV0cy9vcmJzXHJcbiAgICAgIGNvbnN0IG9yYnMgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiAyIH0sICgpID0+ICh7IHg6IE1hdGgucmFuZG9tKCksIHk6IE1hdGgucmFuZG9tKCkqMC41ICsgMC4xLCByOiBNYXRoLnJhbmRvbSgpKjgwICsgNzAsIGh1ZTogTWF0aC5yYW5kb20oKSB9KSk7XHJcbiAgICAgIGNvbnN0IGZpdCA9ICgpID0+IHsgY3ZzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7IGN2cy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7IH07XHJcbiAgICAgIGZpdCgpO1xyXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZml0KTtcclxuICAgICAgbGV0IHQgPSAwO1xyXG4gICAgICBjb25zdCBsb29wID0gKCkgPT4ge1xyXG4gICAgICAgIGlmICghY3R4KSByZXR1cm47XHJcbiAgICAgICAgdCArPSAwLjAxNjtcclxuICAgICAgICBjdHguY2xlYXJSZWN0KDAsMCxjdnMud2lkdGgsY3ZzLmhlaWdodCk7XHJcbiAgICAgICAgLy8gc29mdCBvcmJzXHJcbiAgICAgICAgZm9yIChjb25zdCBvYiBvZiBvcmJzKSB7XHJcbiAgICAgICAgICBjb25zdCB4ID0gb2IueCAqIGN2cy53aWR0aCwgeSA9IG9iLnkgKiBjdnMuaGVpZ2h0O1xyXG4gICAgICAgICAgY29uc3QgcHVsc2UgPSAoTWF0aC5zaW4odCowLjYgKyB4KjAuMDAxNSkqMC41KzAuNSkqMC4xMjtcclxuICAgICAgICAgIGNvbnN0IHJhZCA9IG9iLnIgKiAoMStwdWxzZSk7XHJcbiAgICAgICAgICBjb25zdCBncmFkID0gY3R4LmNyZWF0ZVJhZGlhbEdyYWRpZW50KHgsIHksIDAsIHgsIHksIHJhZCk7XHJcbiAgICAgICAgICBncmFkLmFkZENvbG9yU3RvcCgwLCAncmdiYSgxMTAsODAsMjU1LDAuMTApJyk7XHJcbiAgICAgICAgICBncmFkLmFkZENvbG9yU3RvcCgxLCAncmdiYSgwLDAsMCwwKScpO1xyXG4gICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGdyYWQ7XHJcbiAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICBjdHguYXJjKHgsIHksIHJhZCwgMCwgTWF0aC5QSSoyKTtcclxuICAgICAgICAgIGN0eC5maWxsKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHN0YXJzIHR3aW5rbGVcclxuICAgICAgICBmb3IgKGNvbnN0IHN0IG9mIHN0YXJzKSB7XHJcbiAgICAgICAgICBjb25zdCB4ID0gc3QueCAqIGN2cy53aWR0aCwgeSA9IHN0LnkgKiBjdnMuaGVpZ2h0O1xyXG4gICAgICAgICAgY29uc3QgdHcgPSAoTWF0aC5zaW4odCoxLjYgKyB4KjAuMDAyICsgeSowLjAwMykqMC41KzAuNSkqMC41KzAuNTtcclxuICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgIGN0eC5hcmMoeCwgeSwgc3QuciArIHR3KjAuNiwgMCwgTWF0aC5QSSoyKTtcclxuICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAncmdiYSgxODAsMjAwLDI1NSwwLjYpJztcclxuICAgICAgICAgIGN0eC5maWxsKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIG1ldGVvcnNcclxuICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA8IDAuMDE1ICYmIG1ldGVvcnMubGVuZ3RoIDwgMikgc3Bhd25NZXRlb3IoKTtcclxuICAgICAgICBmb3IgKGxldCBpPW1ldGVvcnMubGVuZ3RoLTE7IGk+PTA7IGktLSkge1xyXG4gICAgICAgICAgY29uc3QgbSA9IG1ldGVvcnNbaV07XHJcbiAgICAgICAgICBtLnggKz0gbS52eDsgbS55ICs9IG0udnk7IG0ubGlmZSArPSAxNjtcclxuICAgICAgICAgIC8vIHRyYWlsXHJcbiAgICAgICAgICBjb25zdCB0cmFpbCA9IGN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudChtLngsIG0ueSwgbS54IC0gbS52eCo4LCBtLnkgLSBtLnZ5KjgpO1xyXG4gICAgICAgICAgdHJhaWwuYWRkQ29sb3JTdG9wKDAsICdyZ2JhKDI1NSwyNTUsMjU1LDAuOSknKTtcclxuICAgICAgICAgIHRyYWlsLmFkZENvbG9yU3RvcCgxLCAncmdiYSgxNTAsMTgwLDI1NSwwKScpO1xyXG4gICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gdHJhaWw7XHJcbiAgICAgICAgICBjdHgubGluZVdpZHRoID0gMjtcclxuICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgIGN0eC5tb3ZlVG8obS54IC0gbS52eCoxMCwgbS55IC0gbS52eSoxMCk7XHJcbiAgICAgICAgICBjdHgubGluZVRvKG0ueCwgbS55KTtcclxuICAgICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICAgIGlmIChtLnkgPiBjdnMuaGVpZ2h0ICsgNDAgfHwgbS54IDwgLTQwIHx8IG0ueCA+IGN2cy53aWR0aCArIDQwIHx8IG0ubGlmZSA+IG0udHRsKSB7XHJcbiAgICAgICAgICAgIG1ldGVvcnMuc3BsaWNlKGksMSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wKTtcclxuICAgICAgfTtcclxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3ApO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2gge31cclxufVxyXG4iLCAiaW1wb3J0IHsgTG9naW5TY2VuZSB9IGZyb20gJy4vc2NlbmVzL0xvZ2luU2NlbmUnO1xuaW1wb3J0IHsgTWFpblNjZW5lIH0gZnJvbSAnLi9zY2VuZXMvTWFpblNjZW5lJztcbmltcG9ydCB7IEdhbWVNYW5hZ2VyIH0gZnJvbSAnLi9jb3JlL0dhbWVNYW5hZ2VyJztcbmltcG9ydCB7IFdhcmVob3VzZVNjZW5lIH0gZnJvbSAnLi9zY2VuZXMvV2FyZWhvdXNlU2NlbmUnO1xuaW1wb3J0IHsgUGx1bmRlclNjZW5lIH0gZnJvbSAnLi9zY2VuZXMvUGx1bmRlclNjZW5lJztcbmltcG9ydCB7IEV4Y2hhbmdlU2NlbmUgfSBmcm9tICcuL3NjZW5lcy9FeGNoYW5nZVNjZW5lJztcbmltcG9ydCB7IFJhbmtpbmdTY2VuZSB9IGZyb20gJy4vc2NlbmVzL1JhbmtpbmdTY2VuZSc7XG5pbXBvcnQgeyBlbnN1cmVHbG9iYWxTdHlsZXMgfSBmcm9tICcuL3N0eWxlcy9pbmplY3QnO1xuXG5mdW5jdGlvbiByb3V0ZVRvKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQpIHtcbiAgY29uc3QgaCA9IGxvY2F0aW9uLmhhc2ggfHwgJyMvbG9naW4nO1xuICBjb25zdCBzY2VuZSA9IGguc3BsaXQoJz8nKVswXTtcbiAgc3dpdGNoIChzY2VuZSkge1xuICAgIGNhc2UgJyMvbWFpbic6XG4gICAgICBuZXcgTWFpblNjZW5lKCkubW91bnQoY29udGFpbmVyKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJyMvd2FyZWhvdXNlJzpcbiAgICAgIG5ldyBXYXJlaG91c2VTY2VuZSgpLm1vdW50KGNvbnRhaW5lcik7XG4gICAgICBicmVhaztcbiAgICBjYXNlICcjL3BsdW5kZXInOlxuICAgICAgbmV3IFBsdW5kZXJTY2VuZSgpLm1vdW50KGNvbnRhaW5lcik7XG4gICAgICBicmVhaztcbiAgICBjYXNlICcjL2V4Y2hhbmdlJzpcbiAgICAgIG5ldyBFeGNoYW5nZVNjZW5lKCkubW91bnQoY29udGFpbmVyKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJyMvcmFua2luZyc6XG4gICAgICBuZXcgUmFua2luZ1NjZW5lKCkubW91bnQoY29udGFpbmVyKTtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICBuZXcgTG9naW5TY2VuZSgpLm1vdW50KGNvbnRhaW5lcik7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGJvb3RzdHJhcChjb250YWluZXI6IEhUTUxFbGVtZW50KSB7XG4gIC8vIFx1N0FDQlx1NTM3M1x1NkNFOFx1NTE2NVx1NjgzN1x1NUYwRlx1RkYwQ1x1OTA3Rlx1NTE0REZPVUNcdUZGMDhcdTk1RUFcdTcwQzFcdUZGMDlcbiAgZW5zdXJlR2xvYmFsU3R5bGVzKCk7XG4gIFxuICAvLyBcdTRGN0ZcdTc1MjggcmVxdWVzdEFuaW1hdGlvbkZyYW1lIFx1Nzg2RVx1NEZERFx1NjgzN1x1NUYwRlx1NURGMlx1NUU5NFx1NzUyOFxuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgIHJvdXRlVG8oY29udGFpbmVyKTtcbiAgfSk7XG4gIFxuICB3aW5kb3cub25oYXNoY2hhbmdlID0gKCkgPT4gcm91dGVUbyhjb250YWluZXIpO1xufVxuXG4vLyBcdTRGQkZcdTYzNzdcdTU0MkZcdTUyQThcdUZGMDhcdTdGNTFcdTk4NzVcdTczQUZcdTU4ODNcdUZGMDlcbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAod2luZG93IGFzIGFueSkuTWluZXJBcHAgPSB7IGJvb3RzdHJhcCwgR2FtZU1hbmFnZXIgfTtcbn1cblxuXG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7QUFBTyxNQUFNLGtCQUFOLE1BQU0sZ0JBQWU7QUFBQSxJQUFyQjtBQUlMLDBCQUFRLFNBQXVCO0FBQUE7QUFBQSxJQUYvQixXQUFXLElBQW9CO0FBRmpDO0FBRW1DLGNBQU8sVUFBSyxjQUFMLFlBQW1CLEtBQUssWUFBWSxJQUFJLGdCQUFlO0FBQUEsSUFBSTtBQUFBLElBR25HLFNBQVMsR0FBa0I7QUFBRSxXQUFLLFFBQVE7QUFBQSxJQUFHO0FBQUEsSUFFN0MsTUFBTSxRQUFXLE1BQWMsTUFBZ0M7QUFDN0QsWUFBTSxVQUFlLEVBQUUsZ0JBQWdCLG9CQUFvQixJQUFJLDZCQUFNLFlBQVcsQ0FBQyxFQUFHO0FBQ3BGLFVBQUksS0FBSyxNQUFPLFNBQVEsZUFBZSxJQUFJLFVBQVUsS0FBSyxLQUFLO0FBQy9ELFlBQU0sTUFBTSxNQUFNLE1BQU0sS0FBSyxRQUFRLElBQUksTUFBTSxFQUFFLEdBQUcsTUFBTSxRQUFRLENBQUM7QUFDbkUsWUFBTSxPQUFPLE1BQU0sSUFBSSxLQUFLO0FBQzVCLFVBQUksQ0FBQyxJQUFJLE1BQU0sS0FBSyxRQUFRLElBQUssT0FBTSxJQUFJLE1BQU0sS0FBSyxXQUFXLGVBQWU7QUFDaEYsYUFBTyxLQUFLO0FBQUEsSUFDZDtBQUFBLElBRUEsVUFBa0I7QUFDaEIsYUFBUSxPQUFlLGdCQUFnQjtBQUFBLElBQ3pDO0FBQUEsRUFDRjtBQWxCRSxnQkFEVyxpQkFDSTtBQURWLE1BQU0saUJBQU47OztBQ0lBLE1BQU0sZUFBTixNQUFNLGFBQVk7QUFBQSxJQUFsQjtBQUlMLDBCQUFRLFdBQTBCO0FBQUE7QUFBQSxJQUZsQyxXQUFXLElBQWlCO0FBTjlCO0FBTWdDLGNBQU8s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QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7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
