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
      const view2 = html(`
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
      root.appendChild(view2);
      const uEl = qs(view2, "#u");
      const pEl = qs(view2, "#p");
      const go = qs(view2, "#go");
      const reveal = qs(view2, "#reveal");
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

  // frontend-scripts/components/ResourceBar.ts
  function renderResourceBar() {
    const box = document.createElement("div");
    box.className = "container";
    const card = document.createElement("div");
    card.className = "card fade-in";
    card.innerHTML = `
    <div style="display:flex;justify-content:space-between"><span>\u{1F48E} \u77FF\u77F3</span><strong id="ore">0</strong></div>
    <div style="display:flex;justify-content:space-between"><span>\u{1FA99} BB\u5E01</span><strong id="coin">0</strong></div>
  `;
    card.innerHTML = `
    <div class="stats">
      <div class="stat">
        <div class="ico" data-ico="ore"></div>
        <div style="display:flex;flex-direction:column;gap:2px;">
          <div class="val" id="ore">0</div>
          <div class="label">\u77FF\u77F3</div>
        </div>
      </div>
      <div class="stat">
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
    async function update() {
      try {
        const p = await NetworkManager.I.request("/user/profile");
        oreEl.textContent = String(p.oreAmount);
        coinEl.textContent = String(p.bbCoins);
      } catch (e) {
      }
    }
    return { root: box, update };
  }

  // frontend-scripts/components/FloatText.ts
  function spawnFloatText(anchor, text, color = "#fff") {
    const rect = anchor.getBoundingClientRect();
    const span = document.createElement("div");
    span.textContent = text;
    span.style.cssText = `position:fixed;left:${rect.left + rect.width - 24}px;top:${rect.top - 6}px;transform: translateY(0); transition: all .7s cubic-bezier(.22,.61,.36,1);pointer-events:none; z-index:9999; font-weight:700; color:` + color + "; text-shadow:0 0 8px rgba(255,255,255,.25)";
    document.body.appendChild(span);
    requestAnimationFrame(() => {
      span.style.opacity = "0";
      span.style.transform = "translateY(-24px)";
    });
    setTimeout(() => span.remove(), 800);
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
        statusBtn: null
      });
      __publicField(this, "mineUpdateHandler");
      __publicField(this, "mineCollapseHandler");
      __publicField(this, "plunderHandler");
    }
    async mount(root) {
      this.clearCollapseTimer();
      this.pending = null;
      const nav = renderNav("main");
      const bar = renderResourceBar();
      const view2 = html(`
      <div class="container grid-2" style="color:#fff;">
        <div class="mine card fade-in">
          <div style="opacity:.9;margin-bottom:8px;display:flex;align-items:center;gap:8px;"><span data-ico="pick"></span>\u6316\u77FF\u9762\u677F</div>
          <div style="height:10px;border-radius:999px;background:rgba(255,255,255,.12);overflow:hidden;">
            <div id="fill" style="height:100%;width:0%;background:linear-gradient(90deg,#7B2CF5,#2C89F5);box-shadow:0 0 10px #7B2CF5;transition:width .3s ease"></div>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin:8px 0 12px;">
            <span>\u77FF\u8F66\u88C5\u8F7D</span>
            <strong id="percent">0%</strong>
          </div>
          <div class="row" style="gap:8px;">
            <button id="start" class="btn btn-buy" style="flex:1;"><span data-ico="play"></span>\u5F00\u59CB\u6316\u77FF</button>
            <button id="stop" class="btn btn-ghost" style="flex:1;"><span data-ico="stop"></span>\u505C\u6B62</button>
            <button id="collect" class="btn btn-primary" style="flex:1;"><span data-ico="collect"></span>\u6536\u77FF</button>
          </div>
          <div class="row" style="gap:8px;margin-top:8px;">
            <button id="status" class="btn btn-ghost" style="flex:1;"><span data-ico="refresh"></span>\u5237\u65B0\u72B6\u6001</button>
            <button id="repair" class="btn btn-sell" style="flex:1;"><span data-ico="wrench"></span>\u4FEE\u7406</button>
          </div>
          <div id="statusText" style="margin-top:6px;opacity:.9;min-height:20px;"></div>
        </div>
      </div>
    `);
      root.innerHTML = "";
      root.appendChild(nav);
      root.appendChild(bar.root);
      root.appendChild(view2);
      this.view = view2;
      try {
        view2.querySelectorAll("[data-ico]").forEach((el) => {
          const name = el.getAttribute("data-ico");
          try {
            el.appendChild(renderIcon(name, { size: 20 }));
          } catch (e) {
          }
        });
      } catch (e) {
      }
      this.upgradeMineCardUI();
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
    }
    // Enhance UI: add radial meter and event feed dynamically
    upgradeMineCardUI() {
      if (!this.view) return;
      const mineCard = this.view.querySelector(".mine");
      if (!mineCard) return;
      try {
        const block = html(`
        <div class="row" style="gap:12px;align-items:center;margin-bottom:8px;">
          <div class="ring" id="ring"><div class="label" id="ringPct">0%</div></div>
          <div style="display:flex;flex-direction:column;gap:6px;">
            <div class="pill" id="statusTag">\u5F85\u673A</div>
            <div class="pill"><span data-ico="clock"></span>\u5468\u671F <span id="cycle">3s</span></div>
          </div>
        </div>
      `);
        block.querySelectorAll("[data-ico]").forEach((el) => {
          const name = el.getAttribute("data-ico");
          try {
            el.appendChild(renderIcon(name, { size: 16 }));
          } catch (e) {
          }
        });
        mineCard.insertBefore(block, mineCard.children[1] || null);
        const feed = html(`<div class="event-feed" id="events" style="margin-top:10px;"></div>`);
        mineCard.appendChild(feed);
      } catch (e) {
      }
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
          const oreLabel = document.querySelector("#ore");
          if (oreLabel) spawnFloatText(oreLabel, `+${res.collected}`, "#7B2CF5");
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
        const ico = this.isCollapsed ? "close" : this.isMining ? "bolt" : "clock";
        try {
          el.appendChild(renderIcon(ico, { size: 16 }));
        } catch (e) {
        }
        el.appendChild(document.createTextNode(this.isCollapsed ? "\u574D\u584C" : this.isMining ? "\u8FD0\u884C\u4E2D" : "\u5F85\u673A"));
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
      if (!this.els.fill || !this.els.percent) return;
      const pct = this.cartCap > 0 ? Math.min(1, this.cartAmt / this.cartCap) : 0;
      this.els.fill.style.width = `${Math.round(pct * 100)}%`;
      this.els.percent.textContent = `${Math.round(pct * 100)}%`;
      if (this.els.ring) {
        const deg = Math.round(pct * 360);
        this.els.ring.style.background = `conic-gradient(#7B2CF5 ${deg}deg, rgba(255,255,255,.08) 0deg)`;
      }
      if (this.els.ringPct) this.els.ringPct.textContent = `${Math.round(pct * 100)}%`;
      if (this.pending !== "collect" && this.els.collect) {
        this.els.collect.disabled = this.pending === "collect" || this.cartAmt <= 0;
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
      line.className = "event";
      const now = /* @__PURE__ */ new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const ss = String(now.getSeconds()).padStart(2, "0");
      line.textContent = `[${hh}:${mm}:${ss}] ${msg}`;
      this.els.events.prepend(line);
    }
    formatPercent() {
      const pct = this.cartCap > 0 ? Math.min(1, this.cartAmt / this.cartCap) : 0;
      return `${Math.round(pct * 100)}%`;
    }
  };
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

  // frontend-scripts/scenes/WarehouseScene.ts
  var WarehouseScene = class {
    async mount(root) {
      root.innerHTML = "";
      root.appendChild(renderNav("warehouse"));
      const bar = renderResourceBar();
      root.appendChild(bar.root);
      const view2 = html(`
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
      root.appendChild(view2);
      const token = NetworkManager.I["token"];
      if (token) RealtimeClient.I.connect(token);
      const list = qs(view2, "#list");
      const tplContainer = qs(view2, "#tpls");
      const refreshBtn = qs(view2, "#refresh");
      const mountIcons = (rootEl) => {
        rootEl.querySelectorAll("[data-ico]").forEach((el) => {
          const name = el.getAttribute("data-ico");
          try {
            el.appendChild(renderIcon(name, { size: 20 }));
          } catch (e) {
          }
        });
      };
      mountIcons(view2);
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
      const view2 = html(`
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
      root.appendChild(view2);
      const token = NetworkManager.I["token"];
      if (token) RealtimeClient.I.connect(token);
      RealtimeClient.I.on("plunder.attacked", (msg) => {
        showToast(`\u88AB\u63A0\u593A\uFF1A\u6765\u81EA ${msg.attacker}\uFF0C\u635F\u5931 ${msg.loss}`);
        this.log(`\u88AB ${msg.attacker} \u63A0\u593A\uFF0C\u635F\u5931 ${msg.loss}`);
      });
      this.resultBox = qs(view2, "#result");
      const list = qs(view2, "#list");
      const refreshBtn = qs(view2, "#refresh");
      const mountIcons = (rootEl) => {
        rootEl.querySelectorAll("[data-ico]").forEach((el) => {
          const name = el.getAttribute("data-ico");
          try {
            el.appendChild(renderIcon(name, { size: 20 }));
          } catch (e) {
          }
        });
      };
      mountIcons(view2);
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
      const view2 = html(`
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
      root.appendChild(view2);
      const token = NetworkManager.I["token"];
      if (token) RealtimeClient.I.connect(token);
      const me = GameManager.I.getProfile();
      const book = qs(view2, "#book");
      const logs = qs(view2, "#logs");
      const buyTpl = qs(view2, "#tpl");
      const buyPrice = qs(view2, "#price");
      const buyAmount = qs(view2, "#amount");
      const placeBuy = qs(view2, "#placeBuy");
      const sellInst = qs(view2, "#inst");
      const sellPrice = qs(view2, "#sprice");
      const placeSell = qs(view2, "#placeSell");
      const invBox = qs(view2, "#inventory");
      const queryTpl = qs(view2, "#q_tpl");
      const queryType = qs(view2, "#q_type");
      const queryMineOnly = qs(view2, "#my");
      const mineOnlyLabel = view2.querySelector("label.row.pill");
      const refreshBtn = qs(view2, "#refresh");
      const mountIcons = (rootEl) => {
        rootEl.querySelectorAll("[data-ico]").forEach((el) => {
          const name = el.getAttribute("data-ico");
          try {
            el.appendChild(renderIcon(name, { size: 20 }));
          } catch (e) {
          }
        });
      };
      mountIcons(view2);
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
      const view2 = html(`
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
      root.appendChild(view2);
      const token = NetworkManager.I["token"];
      if (token) RealtimeClient.I.connect(token);
      const meBox = qs(view2, "#me");
      const list = qs(view2, "#list");
      const refreshBtn = qs(view2, "#refresh");
      const mountIcons = (rootEl) => {
        rootEl.querySelectorAll("[data-ico]").forEach((el) => {
          const name = el.getAttribute("data-ico");
          try {
            el.appendChild(renderIcon(name, { size: 20 }));
          } catch (e) {
          }
        });
      };
      mountIcons(view2);
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
.card input{background:rgba(255,255,255,.08);border:0;border-radius:var(--radius-md);color:var(--fg);padding:10px;margin:8px 0;appearance:none;-webkit-appearance:none;background-clip:padding-box}
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
.btn-buy{background:var(--buy)}
.btn-sell{background:var(--sell)}
.btn-ghost{background:rgba(255,255,255,.08)}
.input{width:100%;padding:10px;border:0;border-radius:var(--radius-md);background:rgba(255,255,255,.08);color:var(--fg)}
.pill{padding:2px 8px;border-radius:999px;background:rgba(255,255,255,.08);font-size:12px;cursor:pointer}
.pill.active{background:linear-gradient(135deg, rgba(123,44,245,.35), rgba(44,137,245,.28));box-shadow:var(--glow)}
.scene-header{display:flex;justify-content:space-between;align-items:flex-end;gap:12px;margin-bottom:8px}
.scene-header h1{margin:0;font-size:20px}
.scene-header p{margin:0;opacity:.85}
.stats{display:flex;gap:10px}
.stat{flex:1;min-width:0;background:linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.03));border-radius:12px;padding:10px;display:flex;align-items:center;gap:10px}
.stat .ico{font-size:18px;filter:drop-shadow(0 0 8px rgba(123,44,245,.35))}
.stat .val{font-weight:700;font-size:16px}
.stat .label{opacity:.85;font-size:12px}
.event-feed{max-height:240px;overflow:auto;display:flex;flex-direction:column;gap:6px}
.event-feed .event{opacity:.9;font-family:monospace;font-size:12px}
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
    routeTo(container);
    window.onhashchange = () => routeTo(container);
  }
  if (typeof window !== "undefined") {
    window.MinerApp = { bootstrap, GameManager };
  }
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vZnJvbnRlbmQtc2NyaXB0cy9jb3JlL05ldHdvcmtNYW5hZ2VyLnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvY29yZS9HYW1lTWFuYWdlci50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL3V0aWxzL2RvbS50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvbXBvbmVudHMvSWNvbi50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvbXBvbmVudHMvVG9hc3QudHMiLCAiLi4vZnJvbnRlbmQtc2NyaXB0cy9zY2VuZXMvTG9naW5TY2VuZS50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvcmUvRW52LnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvY29yZS9SZWFsdGltZUNsaWVudC50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvbXBvbmVudHMvTmF2LnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvY29tcG9uZW50cy9SZXNvdXJjZUJhci50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvbXBvbmVudHMvRmxvYXRUZXh0LnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvc2NlbmVzL01haW5TY2VuZS50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL3NjZW5lcy9XYXJlaG91c2VTY2VuZS50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL3NjZW5lcy9QbHVuZGVyU2NlbmUudHMiLCAiLi4vZnJvbnRlbmQtc2NyaXB0cy9zY2VuZXMvRXhjaGFuZ2VTY2VuZS50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL3NjZW5lcy9SYW5raW5nU2NlbmUudHMiLCAiLi4vZnJvbnRlbmQtc2NyaXB0cy9zdHlsZXMvaW5qZWN0LnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvQXBwLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJleHBvcnQgY2xhc3MgTmV0d29ya01hbmFnZXIge1xyXG4gIHByaXZhdGUgc3RhdGljIF9pbnN0YW5jZTogTmV0d29ya01hbmFnZXI7XHJcbiAgc3RhdGljIGdldCBJKCk6IE5ldHdvcmtNYW5hZ2VyIHsgcmV0dXJuIHRoaXMuX2luc3RhbmNlID8/ICh0aGlzLl9pbnN0YW5jZSA9IG5ldyBOZXR3b3JrTWFuYWdlcigpKTsgfVxyXG5cclxuICBwcml2YXRlIHRva2VuOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcclxuICBzZXRUb2tlbih0OiBzdHJpbmcgfCBudWxsKSB7IHRoaXMudG9rZW4gPSB0OyB9XHJcblxyXG4gIGFzeW5jIHJlcXVlc3Q8VD4ocGF0aDogc3RyaW5nLCBpbml0PzogUmVxdWVzdEluaXQpOiBQcm9taXNlPFQ+IHtcclxuICAgIGNvbnN0IGhlYWRlcnM6IGFueSA9IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJywgLi4uKGluaXQ/LmhlYWRlcnMgfHwge30pIH07XHJcbiAgICBpZiAodGhpcy50b2tlbikgaGVhZGVyc1snQXV0aG9yaXphdGlvbiddID0gYEJlYXJlciAke3RoaXMudG9rZW59YDtcclxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKHRoaXMuZ2V0QmFzZSgpICsgcGF0aCwgeyAuLi5pbml0LCBoZWFkZXJzIH0pO1xyXG4gICAgY29uc3QganNvbiA9IGF3YWl0IHJlcy5qc29uKCk7XHJcbiAgICBpZiAoIXJlcy5vayB8fCBqc29uLmNvZGUgPj0gNDAwKSB0aHJvdyBuZXcgRXJyb3IoanNvbi5tZXNzYWdlIHx8ICdSZXF1ZXN0IEVycm9yJyk7XHJcbiAgICByZXR1cm4ganNvbi5kYXRhIGFzIFQ7XHJcbiAgfVxyXG5cclxuICBnZXRCYXNlKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gKHdpbmRvdyBhcyBhbnkpLl9fQVBJX0JBU0VfXyB8fCAnaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaSc7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuIiwgImltcG9ydCB7IE5ldHdvcmtNYW5hZ2VyIH0gZnJvbSAnLi9OZXR3b3JrTWFuYWdlcic7XHJcblxyXG5leHBvcnQgdHlwZSBQcm9maWxlID0geyBpZDogc3RyaW5nOyB1c2VybmFtZTogc3RyaW5nOyBuaWNrbmFtZTogc3RyaW5nOyBvcmVBbW91bnQ6IG51bWJlcjsgYmJDb2luczogbnVtYmVyIH07XHJcblxyXG5leHBvcnQgY2xhc3MgR2FtZU1hbmFnZXIge1xyXG4gIHByaXZhdGUgc3RhdGljIF9pbnN0YW5jZTogR2FtZU1hbmFnZXI7XHJcbiAgc3RhdGljIGdldCBJKCk6IEdhbWVNYW5hZ2VyIHsgcmV0dXJuIHRoaXMuX2luc3RhbmNlID8/ICh0aGlzLl9pbnN0YW5jZSA9IG5ldyBHYW1lTWFuYWdlcigpKTsgfVxyXG5cclxuICBwcml2YXRlIHByb2ZpbGU6IFByb2ZpbGUgfCBudWxsID0gbnVsbDtcclxuICBnZXRQcm9maWxlKCk6IFByb2ZpbGUgfCBudWxsIHsgcmV0dXJuIHRoaXMucHJvZmlsZTsgfVxyXG5cclxuICBhc3luYyBsb2dpbk9yUmVnaXN0ZXIodXNlcm5hbWU6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgY29uc3Qgbm0gPSBOZXR3b3JrTWFuYWdlci5JO1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgciA9IGF3YWl0IG5tLnJlcXVlc3Q8eyBhY2Nlc3NfdG9rZW46IHN0cmluZzsgdXNlcjogYW55IH0+KCcvYXV0aC9sb2dpbicsIHsgbWV0aG9kOiAnUE9TVCcsIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgdXNlcm5hbWUsIHBhc3N3b3JkIH0pIH0pO1xyXG4gICAgICBubS5zZXRUb2tlbihyLmFjY2Vzc190b2tlbik7XHJcbiAgICB9IGNhdGNoIHtcclxuICAgICAgY29uc3QgciA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IGFjY2Vzc190b2tlbjogc3RyaW5nOyB1c2VyOiBhbnkgfT4oJy9hdXRoL3JlZ2lzdGVyJywgeyBtZXRob2Q6ICdQT1NUJywgYm9keTogSlNPTi5zdHJpbmdpZnkoeyB1c2VybmFtZSwgcGFzc3dvcmQgfSkgfSk7XHJcbiAgICAgIE5ldHdvcmtNYW5hZ2VyLkkuc2V0VG9rZW4oci5hY2Nlc3NfdG9rZW4pO1xyXG4gICAgfVxyXG4gICAgdGhpcy5wcm9maWxlID0gYXdhaXQgbm0ucmVxdWVzdDxQcm9maWxlPignL3VzZXIvcHJvZmlsZScpO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbiIsICJleHBvcnQgZnVuY3Rpb24gaHRtbCh0ZW1wbGF0ZTogc3RyaW5nKTogSFRNTEVsZW1lbnQge1xyXG4gIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gIGRpdi5pbm5lckhUTUwgPSB0ZW1wbGF0ZS50cmltKCk7XHJcbiAgcmV0dXJuIGRpdi5maXJzdEVsZW1lbnRDaGlsZCBhcyBIVE1MRWxlbWVudDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHFzPFQgZXh0ZW5kcyBFbGVtZW50ID0gSFRNTEVsZW1lbnQ+KHJvb3Q6IFBhcmVudE5vZGUsIHNlbDogc3RyaW5nKTogVCB7XHJcbiAgY29uc3QgZWwgPSByb290LnF1ZXJ5U2VsZWN0b3Ioc2VsKSBhcyBUIHwgbnVsbDtcclxuICBpZiAoIWVsKSB0aHJvdyBuZXcgRXJyb3IoYE1pc3NpbmcgZWxlbWVudDogJHtzZWx9YCk7XHJcbiAgcmV0dXJuIGVsIGFzIFQ7XHJcbn1cclxuXHJcblxyXG4iLCAiaW1wb3J0IHsgaHRtbCB9IGZyb20gJy4uL3V0aWxzL2RvbSc7XG5cbmV4cG9ydCB0eXBlIEljb25OYW1lID1cbiAgfCAnaG9tZSdcbiAgfCAnd2FyZWhvdXNlJ1xuICB8ICdwbHVuZGVyJ1xuICB8ICdleGNoYW5nZSdcbiAgfCAncmFua2luZydcbiAgfCAnb3JlJ1xuICB8ICdjb2luJ1xuICB8ICdwaWNrJ1xuICB8ICdyZWZyZXNoJ1xuICB8ICdwbGF5J1xuICB8ICdzdG9wJ1xuICB8ICdjb2xsZWN0J1xuICB8ICd3cmVuY2gnXG4gIHwgJ3NoaWVsZCdcbiAgfCAnbGlzdCdcbiAgfCAndXNlcidcbiAgfCAnbG9jaydcbiAgfCAnZXllJ1xuICB8ICdleWUtb2ZmJ1xuICB8ICdzd29yZCdcbiAgfCAndHJvcGh5J1xuICB8ICdjbG9jaydcbiAgfCAnYm9sdCdcbiAgfCAndHJhc2gnXG4gIHwgJ2Nsb3NlJ1xuICB8ICdhcnJvdy1yaWdodCdcbiAgfCAndGFyZ2V0JztcblxuZnVuY3Rpb24gZ3JhZChpZDogc3RyaW5nKSB7XG4gIHJldHVybiBgPGRlZnM+XG4gICAgPGxpbmVhckdyYWRpZW50IGlkPVwiJHtpZH1cIiB4MT1cIjBcIiB5MT1cIjBcIiB4Mj1cIjFcIiB5Mj1cIjFcIj5cbiAgICAgIDxzdG9wIG9mZnNldD1cIjAlXCIgc3RvcC1jb2xvcj1cIiM3QjJDRjVcIiAvPlxuICAgICAgPHN0b3Agb2Zmc2V0PVwiMTAwJVwiIHN0b3AtY29sb3I9XCIjMkM4OUY1XCIgLz5cbiAgICA8L2xpbmVhckdyYWRpZW50PlxuICA8L2RlZnM+YDtcbn1cblxuZnVuY3Rpb24gc3ZnV3JhcChwYXRoOiBzdHJpbmcsIHNpemUgPSAxOCwgY2xzID0gJycpOiBIVE1MRWxlbWVudCB7XG4gIGNvbnN0IGdpZCA9ICdpZy0nICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc2xpY2UoMiwgOCk7XG4gIGNvbnN0IGVsID0gaHRtbChgPHNwYW4gY2xhc3M9XCJpY29uICR7Y2xzfVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPiR7XG4gICAgYDxzdmcgd2lkdGg9XCIke3NpemV9XCIgaGVpZ2h0PVwiJHtzaXplfVwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj4ke2dyYWQoZ2lkKX0ke3BhdGgucmVwbGFjZUFsbCgnX19HUkFEX18nLCBgdXJsKCMke2dpZH0pYCl9PC9zdmc+YFxuICB9PC9zcGFuPmApO1xuICByZXR1cm4gZWw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJJY29uKG5hbWU6IEljb25OYW1lLCBvcHRzOiB7IHNpemU/OiBudW1iZXI7IGNsYXNzTmFtZT86IHN0cmluZyB9ID0ge30pIHtcbiAgY29uc3Qgc2l6ZSA9IG9wdHMuc2l6ZSA/PyAxODtcbiAgY29uc3QgY2xzID0gb3B0cy5jbGFzc05hbWUgPz8gJyc7XG4gIGNvbnN0IHN0cm9rZSA9ICdzdHJva2U9XCJfX0dSQURfX1wiIHN0cm9rZS13aWR0aD1cIjEuN1wiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiJztcbiAgY29uc3QgZmlsbCA9ICdmaWxsPVwiX19HUkFEX19cIic7XG5cbiAgc3dpdGNoIChuYW1lKSB7XG4gICAgY2FzZSAnaG9tZSc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0zIDEwLjVMMTIgM2w5IDcuNVwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk01LjUgOS41VjIxaDEzVjkuNVwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk05LjUgMjF2LTZoNXY2XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ3dhcmVob3VzZSc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0zIDlsOS01IDkgNXY5LjVjMCAxLTEgMi0yIDJINWMtMSAwLTItMS0yLTJWOXpcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNNyAxMmgxME03IDE2aDEwXCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ3BsdW5kZXInOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNNCAyMGw3LTdNMTMgMTNsNyA3TTkgNWw2IDZNMTUgNWwtNiA2XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ2V4Y2hhbmdlJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTYgOGgxMWwtMy0zTTE4IDE2SDdsMyAzXCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ3JhbmtpbmcnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNOCAxNHY2TTEyIDEwdjEwTTE2IDZ2MTRcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNMTYgNC41YTIgMiAwIDEwMC00IDIgMiAwIDAwMCA0elwiICR7ZmlsbH0vPmAgLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ29yZSc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0xMiAzbDYgNC0yIDgtNCA2LTQtNi0yLTggNi00elwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk0xMiAzbC0yIDggMiAxMCAyLTEwLTItOHpcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnY29pbic6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCI4LjVcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNOC41IDEyaDdNMTAgOWg0TTEwIDE1aDRcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAncGljayc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk00IDVjNC0zIDktMiAxMiAxTTkgMTBsLTUgNU05IDEwbDIgMk03IDEybDIgMlwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk0xMSAxMmw3IDdcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAncmVmcmVzaCc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0yMCAxMmE4IDggMCAxMC0yLjMgNS43XCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTIwIDEydjZoLTZcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAncGxheSc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk04IDZ2MTJsMTAtNi0xMC02elwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdzdG9wJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cmVjdCB4PVwiN1wiIHk9XCI3XCIgd2lkdGg9XCIxMFwiIGhlaWdodD1cIjEwXCIgcng9XCIyXCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ2NvbGxlY3QnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNMTIgNXYxMFwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk04IDExbDQgNCA0LTRcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNNSAxOWgxNFwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICd3cmVuY2gnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNMTUuNSA2YTQuNSA0LjUgMCAxMS02LjkgNS40TDMgMTdsNC42LTUuNkE0LjUgNC41IDAgMTExNS41IDZ6XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ3NoaWVsZCc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0xMiAzbDggM3Y2YTEwIDEwIDAgMDEtOCA5IDEwIDEwIDAgMDEtOC05VjZsOC0zelwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdsaXN0JzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTcgNmgxMk03IDEyaDEyTTcgMThoMTJcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNNCA2aC4wMU00IDEyaC4wMU00IDE4aC4wMVwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICd1c2VyJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTEyIDEyYTQgNCAwIDEwMC04IDQgNCAwIDAwMCA4elwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk00IDIwYTggOCAwIDAxMTYgMFwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdsb2NrJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cmVjdCB4PVwiNVwiIHk9XCIxMFwiIHdpZHRoPVwiMTRcIiBoZWlnaHQ9XCIxMFwiIHJ4PVwiMlwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk04IDEwVjdhNCA0IDAgMTE4IDB2M1wiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdleWUnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNMiAxMnM0LTcgMTAtNyAxMCA3IDEwIDctNCA3LTEwIDctMTAtNy0xMC03elwiICR7c3Ryb2tlfS8+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIzXCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ2V5ZS1vZmYnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNMiAxMnM0LTcgMTAtNyAxMCA3IDEwIDctNCA3LTEwIDctMTAtNy0xMC03elwiICR7c3Ryb2tlfS8+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIzXCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTMgM2wxOCAxOFwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdzd29yZCc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0zIDIxbDYtNk05IDE1bDktOSAzIDMtOSA5TTE0IDZsNCA0XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ3Ryb3BoeSc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk04IDIxaDhNOSAxN2g2TTcgNGgxMHY1YTUgNSAwIDExLTEwIDBWNHpcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNNCA2aDN2MmEzIDMgMCAxMS0zLTJ6TTIwIDZoLTN2MmEzIDMgMCAwMDMtMnpcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnY2xvY2snOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiOC41XCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTEyIDd2Nmw0IDJcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnYm9sdCc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0xMyAyTDYgMTRoNWwtMSA4IDctMTJoLTVsMS04elwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICd0cmFzaCc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk00IDdoMTZNOSA3VjVoNnYyTTcgN2wxIDEzaDhsMS0xM1wiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdjbG9zZSc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk02IDZsMTIgMTJNNiAxOEwxOCA2XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ2Fycm93LXJpZ2h0JzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTQgMTJoMTRNMTIgNWw3IDctNyA3XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ3RhcmdldCc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCI4LjVcIiAke3N0cm9rZX0vPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiNC41XCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTEyIDJ2M00xMiAxOXYzTTIgMTJoM00xOSAxMmgzXCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ2JveCc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0xMiAzbDkgNS05IDUtOS01IDktNXpcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNMyA4djhsOSA1IDktNVY4XCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTEyIDEzdjhcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnaW5mbyc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCI4LjVcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNMTIgMTB2NlwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk0xMiA3aC4wMVwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiOVwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgfVxufVxuIiwgImltcG9ydCB7IHJlbmRlckljb24gfSBmcm9tICcuL0ljb24nO1xuXG5sZXQgX2JveDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcblxuZnVuY3Rpb24gZW5zdXJlQm94KCk6IEhUTUxFbGVtZW50IHtcbiAgaWYgKF9ib3gpIHJldHVybiBfYm94O1xuICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgZGl2LmNsYXNzTmFtZSA9ICd0b2FzdC13cmFwJztcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkaXYpO1xuICBfYm94ID0gZGl2O1xuICByZXR1cm4gZGl2O1xufVxuXG50eXBlIFRvYXN0VHlwZSA9ICdpbmZvJyB8ICdzdWNjZXNzJyB8ICd3YXJuJyB8ICdlcnJvcic7XG50eXBlIFRvYXN0T3B0aW9ucyA9IHsgdHlwZT86IFRvYXN0VHlwZTsgZHVyYXRpb24/OiBudW1iZXIgfTtcblxuZXhwb3J0IGZ1bmN0aW9uIHNob3dUb2FzdCh0ZXh0OiBzdHJpbmcsIG9wdHM/OiBUb2FzdFR5cGUgfCBUb2FzdE9wdGlvbnMpIHtcbiAgY29uc3QgYm94ID0gZW5zdXJlQm94KCk7XG4gIGNvbnN0IGl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgbGV0IHR5cGU6IFRvYXN0VHlwZSB8IHVuZGVmaW5lZDtcbiAgbGV0IGR1cmF0aW9uID0gMzUwMDtcbiAgaWYgKHR5cGVvZiBvcHRzID09PSAnc3RyaW5nJykgdHlwZSA9IG9wdHM7XG4gIGVsc2UgaWYgKG9wdHMpIHsgdHlwZSA9IG9wdHMudHlwZTsgaWYgKG9wdHMuZHVyYXRpb24pIGR1cmF0aW9uID0gb3B0cy5kdXJhdGlvbjsgfVxuICBpdGVtLmNsYXNzTmFtZSA9ICd0b2FzdCcgKyAodHlwZSA/ICcgJyArIHR5cGUgOiAnJyk7XG4gIC8vIGljb24gKyB0ZXh0IGNvbnRhaW5lclxuICB0cnkge1xuICAgIGNvbnN0IHdyYXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB3cmFwLnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XG4gICAgd3JhcC5zdHlsZS5nYXAgPSAnOHB4JztcbiAgICB3cmFwLnN0eWxlLmFsaWduSXRlbXMgPSAnY2VudGVyJztcbiAgICBjb25zdCBpY29OYW1lID0gdHlwZSA9PT0gJ3N1Y2Nlc3MnID8gJ2JvbHQnIDogdHlwZSA9PT0gJ3dhcm4nID8gJ2Nsb2NrJyA6IHR5cGUgPT09ICdlcnJvcicgPyAnY2xvc2UnIDogJ2luZm8nO1xuICAgIGNvbnN0IGljb0hvc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgaWNvSG9zdC5hcHBlbmRDaGlsZChyZW5kZXJJY29uKGljb05hbWUsIHsgc2l6ZTogMTggfSkpO1xuICAgIGNvbnN0IHR4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHR4dC50ZXh0Q29udGVudCA9IHRleHQ7XG4gICAgd3JhcC5hcHBlbmRDaGlsZChpY29Ib3N0KTtcbiAgICB3cmFwLmFwcGVuZENoaWxkKHR4dCk7XG4gICAgaXRlbS5hcHBlbmRDaGlsZCh3cmFwKTtcbiAgfSBjYXRjaCB7XG4gICAgaXRlbS50ZXh0Q29udGVudCA9IHRleHQ7XG4gIH1cbiAgY29uc3QgbGlmZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2knKTtcbiAgbGlmZS5jbGFzc05hbWUgPSAnbGlmZSc7XG4gIGxpZmUuc3R5bGUuc2V0UHJvcGVydHkoJy0tbGlmZScsIGR1cmF0aW9uICsgJ21zJyk7XG4gIGl0ZW0uYXBwZW5kQ2hpbGQobGlmZSk7XG4gIGJveC5wcmVwZW5kKGl0ZW0pO1xuICAvLyBncmFjZWZ1bCBleGl0XG4gIGNvbnN0IGZhZGUgPSAoKSA9PiB7IGl0ZW0uc3R5bGUub3BhY2l0eSA9ICcwJzsgaXRlbS5zdHlsZS50cmFuc2l0aW9uID0gJ29wYWNpdHkgLjQ1cyc7IHNldFRpbWVvdXQoKCkgPT4gaXRlbS5yZW1vdmUoKSwgNDYwKTsgfTtcbiAgY29uc3QgdGltZXIgPSB3aW5kb3cuc2V0VGltZW91dChmYWRlLCBkdXJhdGlvbik7XG4gIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7IGNsZWFyVGltZW91dCh0aW1lcik7IGZhZGUoKTsgfSk7XG59XG4iLCAiaW1wb3J0IHsgR2FtZU1hbmFnZXIgfSBmcm9tICcuLi9jb3JlL0dhbWVNYW5hZ2VyJztcbmltcG9ydCB7IGh0bWwsIHFzIH0gZnJvbSAnLi4vdXRpbHMvZG9tJztcbmltcG9ydCB7IHNob3dUb2FzdCB9IGZyb20gJy4uL2NvbXBvbmVudHMvVG9hc3QnO1xuaW1wb3J0IHsgcmVuZGVySWNvbiB9IGZyb20gJy4uL2NvbXBvbmVudHMvSWNvbic7XG5cbmV4cG9ydCBjbGFzcyBMb2dpblNjZW5lIHtcbiAgbW91bnQocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICBjb25zdCB2aWV3ID0gaHRtbChgXG4gICAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyIGdyaWQtMlwiIHN0eWxlPVwiY29sb3I6I2ZmZjtcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQgZmFkZS1pblwiIHN0eWxlPVwibWF4LXdpZHRoOjQ2MHB4O21hcmdpbjo0NnB4IGF1dG87XCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInNjZW5lLWhlYWRlclwiPlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPGgxIHN0eWxlPVwiYmFja2dyb3VuZDp2YXIoLS1ncmFkKTstd2Via2l0LWJhY2tncm91bmQtY2xpcDp0ZXh0O2JhY2tncm91bmQtY2xpcDp0ZXh0O2NvbG9yOnRyYW5zcGFyZW50O2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjhweDtcIj48c3BhbiBkYXRhLWljbz1cImhvbWVcIj48L3NwYW4+XHU3N0ZGXHU1NzNBXHU2MzA3XHU2MzI1XHU0RTJEXHU1RkMzPC9oMT5cbiAgICAgICAgICAgICAgPHA+XHU3NjdCXHU1RjU1XHU1NDBFXHU4RkRCXHU1MTY1XHU0RjYwXHU3Njg0XHU4RDVCXHU1MzVBXHU3N0ZGXHU1N0NFXHUzMDAyPC9wPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGlucHV0IGlkPVwidVwiIGNsYXNzPVwiaW5wdXRcIiBwbGFjZWhvbGRlcj1cIlx1NzUyOFx1NjIzN1x1NTQwRFwiIGF1dG9jb21wbGV0ZT1cInVzZXJuYW1lXCIvPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIiBzdHlsZT1cImFsaWduLWl0ZW1zOmNlbnRlcjtcIj5cbiAgICAgICAgICAgIDxpbnB1dCBpZD1cInBcIiBjbGFzcz1cImlucHV0XCIgcGxhY2Vob2xkZXI9XCJcdTVCQzZcdTc4MDFcIiB0eXBlPVwicGFzc3dvcmRcIiBhdXRvY29tcGxldGU9XCJjdXJyZW50LXBhc3N3b3JkXCIvPlxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInJldmVhbFwiIGNsYXNzPVwiYnRuIGJ0bi1naG9zdFwiIHN0eWxlPVwibWluLXdpZHRoOjExMHB4O1wiPjxzcGFuIGRhdGEtaWNvPVwiZXllXCI+PC9zcGFuPlx1NjYzRVx1NzkzQTwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxidXR0b24gaWQ9XCJnb1wiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCIgc3R5bGU9XCJ3aWR0aDoxMDAlO21hcmdpbi10b3A6OHB4O1wiPjxzcGFuIGRhdGEtaWNvPVwiYXJyb3ctcmlnaHRcIj48L3NwYW4+XHU4RkRCXHU1MTY1XHU2RTM4XHU2MjBGPC9idXR0b24+XG4gICAgICAgICAgPGRpdiBzdHlsZT1cIm1hcmdpbi10b3A6OHB4O29wYWNpdHk6Ljc1O2ZvbnQtc2l6ZToxMnB4O1wiPlx1NjNEMFx1NzkzQVx1RkYxQVx1ODJFNVx1OEQyNlx1NjIzN1x1NEUwRFx1NUI1OFx1NTcyOFx1RkYwQ1x1NUMwNlx1ODFFQVx1NTJBOFx1NTIxQlx1NUVGQVx1NUU3Nlx1NzY3Qlx1NUY1NVx1MzAwMjwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIGApO1xuICAgIHJvb3QuaW5uZXJIVE1MID0gJyc7XG4gICAgcm9vdC5hcHBlbmRDaGlsZCh2aWV3KTtcblxuICAgIGNvbnN0IHVFbCA9IHFzPEhUTUxJbnB1dEVsZW1lbnQ+KHZpZXcsICcjdScpO1xuICAgIGNvbnN0IHBFbCA9IHFzPEhUTUxJbnB1dEVsZW1lbnQ+KHZpZXcsICcjcCcpO1xuICAgIGNvbnN0IGdvID0gcXM8SFRNTEJ1dHRvbkVsZW1lbnQ+KHZpZXcsICcjZ28nKTtcbiAgICBjb25zdCByZXZlYWwgPSBxczxIVE1MQnV0dG9uRWxlbWVudD4odmlldywgJyNyZXZlYWwnKTtcblxuICAgIGNvbnN0IHN1Ym1pdCA9IGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHVzZXJuYW1lID0gKHVFbC52YWx1ZSB8fCAnJykudHJpbSgpO1xuICAgICAgY29uc3QgcGFzc3dvcmQgPSAocEVsLnZhbHVlIHx8ICcnKS50cmltKCk7XG4gICAgICBpZiAoIXVzZXJuYW1lIHx8ICFwYXNzd29yZCkge1xuICAgICAgICBzaG93VG9hc3QoJ1x1OEJGN1x1NTg2Qlx1NTE5OVx1NzUyOFx1NjIzN1x1NTQwRFx1NTQ4Q1x1NUJDNlx1NzgwMScsICd3YXJuJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGdvLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIGdvLnRleHRDb250ZW50ID0gJ1x1NzY3Qlx1NUY1NVx1NEUyRFx1MjAyNic7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBHYW1lTWFuYWdlci5JLmxvZ2luT3JSZWdpc3Rlcih1c2VybmFtZSwgcGFzc3dvcmQpO1xuICAgICAgICBsb2NhdGlvbi5oYXNoID0gJyMvbWFpbic7XG4gICAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgICAgc2hvd1RvYXN0KGU/Lm1lc3NhZ2UgfHwgJ1x1NzY3Qlx1NUY1NVx1NTkzMVx1OEQyNVx1RkYwQ1x1OEJGN1x1OTFDRFx1OEJENScsICdlcnJvcicpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgZ28uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgZ28udGV4dENvbnRlbnQgPSAnXHU4RkRCXHU1MTY1XHU2RTM4XHU2MjBGJztcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgZ28ub25jbGljayA9IHN1Ym1pdDtcbiAgICB1RWwub25rZXl1cCA9IChlKSA9PiB7IGlmICgoZSBhcyBLZXlib2FyZEV2ZW50KS5rZXkgPT09ICdFbnRlcicpIHN1Ym1pdCgpOyB9O1xuICAgIHBFbC5vbmtleXVwID0gKGUpID0+IHsgaWYgKChlIGFzIEtleWJvYXJkRXZlbnQpLmtleSA9PT0gJ0VudGVyJykgc3VibWl0KCk7IH07XG4gICAgcmV2ZWFsLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICBjb25zdCBpc1B3ZCA9IHBFbC50eXBlID09PSAncGFzc3dvcmQnO1xuICAgICAgcEVsLnR5cGUgPSBpc1B3ZCA/ICd0ZXh0JyA6ICdwYXNzd29yZCc7XG4gICAgICByZXZlYWwuaW5uZXJIVE1MID0gJyc7XG4gICAgICByZXZlYWwuYXBwZW5kQ2hpbGQocmVuZGVySWNvbihpc1B3ZCA/ICdleWUtb2ZmJyA6ICdleWUnLCB7IHNpemU6IDIwIH0pKTtcbiAgICAgIHJldmVhbC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShpc1B3ZCA/ICdcdTk2OTBcdTg1Q0YnIDogJ1x1NjYzRVx1NzkzQScpKTtcbiAgICB9O1xuICB9XG59XG4gICAgLy8gbW91bnQgaWNvbnNcbiAgICB0cnkge1xuICAgICAgdmlldy5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1pY29dJylcbiAgICAgICAgLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgICAgY29uc3QgbmFtZSA9IChlbCBhcyBIVE1MRWxlbWVudCkuZ2V0QXR0cmlidXRlKCdkYXRhLWljbycpIGFzIGFueTtcbiAgICAgICAgICB0cnkgeyBlbC5hcHBlbmRDaGlsZChyZW5kZXJJY29uKG5hbWUsIHsgc2l6ZTogMjIgfSkpOyB9IGNhdGNoIHt9XG4gICAgICAgIH0pO1xuICAgIH0gY2F0Y2gge31cbiIsICJleHBvcnQgY29uc3QgQVBJX0JBU0UgPSAod2luZG93IGFzIGFueSkuX19BUElfQkFTRV9fIHx8ICdodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpJztcclxuZXhwb3J0IGNvbnN0IFdTX0VORFBPSU5UID0gKHdpbmRvdyBhcyBhbnkpLl9fV1NfRU5EUE9JTlRfXyB8fCAnaHR0cDovL2xvY2FsaG9zdDozMDAwL2dhbWUnO1xyXG5cclxuXHJcbiIsICJpbXBvcnQgeyBXU19FTkRQT0lOVCB9IGZyb20gJy4vRW52JztcblxudHlwZSBIYW5kbGVyID0gKGRhdGE6IGFueSkgPT4gdm9pZDtcblxuZXhwb3J0IGNsYXNzIFJlYWx0aW1lQ2xpZW50IHtcbiAgcHJpdmF0ZSBzdGF0aWMgX2luc3RhbmNlOiBSZWFsdGltZUNsaWVudDtcbiAgc3RhdGljIGdldCBJKCk6IFJlYWx0aW1lQ2xpZW50IHtcbiAgICByZXR1cm4gdGhpcy5faW5zdGFuY2UgPz8gKHRoaXMuX2luc3RhbmNlID0gbmV3IFJlYWx0aW1lQ2xpZW50KCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBzb2NrZXQ6IGFueSB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGhhbmRsZXJzOiBSZWNvcmQ8c3RyaW5nLCBIYW5kbGVyW10+ID0ge307XG5cbiAgY29ubmVjdCh0b2tlbjogc3RyaW5nKSB7XG4gICAgY29uc3QgdyA9IHdpbmRvdyBhcyBhbnk7XG4gICAgaWYgKHcuaW8pIHtcbiAgICAgIGlmICh0aGlzLnNvY2tldCAmJiAodGhpcy5zb2NrZXQuY29ubmVjdGVkIHx8IHRoaXMuc29ja2V0LmNvbm5lY3RpbmcpKSByZXR1cm47XG4gICAgICB0aGlzLnNvY2tldCA9IHcuaW8oV1NfRU5EUE9JTlQsIHsgYXV0aDogeyB0b2tlbiB9IH0pO1xuICAgICAgdGhpcy5zb2NrZXQub24oJ2Nvbm5lY3QnLCAoKSA9PiB7fSk7XG4gICAgICB0aGlzLnNvY2tldC5vbkFueSgoZXZlbnQ6IHN0cmluZywgcGF5bG9hZDogYW55KSA9PiB0aGlzLmVtaXRMb2NhbChldmVudCwgcGF5bG9hZCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBzb2NrZXQuaW8gY2xpZW50IG5vdCBsb2FkZWQ7IGRpc2FibGUgcmVhbHRpbWUgdXBkYXRlc1xuICAgICAgdGhpcy5zb2NrZXQgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIG9uKGV2ZW50OiBzdHJpbmcsIGhhbmRsZXI6IEhhbmRsZXIpIHtcbiAgICAodGhpcy5oYW5kbGVyc1tldmVudF0gfHw9IFtdKS5wdXNoKGhhbmRsZXIpO1xuICB9XG5cbiAgb2ZmKGV2ZW50OiBzdHJpbmcsIGhhbmRsZXI6IEhhbmRsZXIpIHtcbiAgICBjb25zdCBhcnIgPSB0aGlzLmhhbmRsZXJzW2V2ZW50XTtcbiAgICBpZiAoIWFycikgcmV0dXJuO1xuICAgIGNvbnN0IGlkeCA9IGFyci5pbmRleE9mKGhhbmRsZXIpO1xuICAgIGlmIChpZHggPj0gMCkgYXJyLnNwbGljZShpZHgsIDEpO1xuICB9XG5cbiAgcHJpdmF0ZSBlbWl0TG9jYWwoZXZlbnQ6IHN0cmluZywgcGF5bG9hZDogYW55KSB7XG4gICAgKHRoaXMuaGFuZGxlcnNbZXZlbnRdIHx8IFtdKS5mb3JFYWNoKChoKSA9PiBoKHBheWxvYWQpKTtcbiAgfVxufVxuIiwgImltcG9ydCB7IHJlbmRlckljb24gfSBmcm9tICcuL0ljb24nO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyTmF2KGFjdGl2ZTogc3RyaW5nKTogSFRNTEVsZW1lbnQge1xuICBjb25zdCB0YWJzOiB7IGtleTogc3RyaW5nOyB0ZXh0OiBzdHJpbmc7IGhyZWY6IHN0cmluZzsgaWNvbjogYW55IH1bXSA9IFtcbiAgICB7IGtleTogJ21haW4nLCB0ZXh0OiAnXHU0RTNCXHU5ODc1JywgaHJlZjogJyMvbWFpbicsIGljb246ICdob21lJyB9LFxuICAgIHsga2V5OiAnd2FyZWhvdXNlJywgdGV4dDogJ1x1NEVEM1x1NUU5MycsIGhyZWY6ICcjL3dhcmVob3VzZScsIGljb246ICd3YXJlaG91c2UnIH0sXG4gICAgeyBrZXk6ICdwbHVuZGVyJywgdGV4dDogJ1x1NjNBMFx1NTkzQScsIGhyZWY6ICcjL3BsdW5kZXInLCBpY29uOiAncGx1bmRlcicgfSxcbiAgICB7IGtleTogJ2V4Y2hhbmdlJywgdGV4dDogJ1x1NEVBNFx1NjYxM1x1NjI0MCcsIGhyZWY6ICcjL2V4Y2hhbmdlJywgaWNvbjogJ2V4Y2hhbmdlJyB9LFxuICAgIHsga2V5OiAncmFua2luZycsIHRleHQ6ICdcdTYzOTJcdTg4NEMnLCBocmVmOiAnIy9yYW5raW5nJywgaWNvbjogJ3JhbmtpbmcnIH0sXG4gIF07XG4gIGNvbnN0IHdyYXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgd3JhcC5jbGFzc05hbWUgPSAnbmF2JztcbiAgZm9yIChjb25zdCB0IG9mIHRhYnMpIHtcbiAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGEuaHJlZiA9IHQuaHJlZjtcbiAgICBjb25zdCBpY28gPSByZW5kZXJJY29uKHQuaWNvbiwgeyBzaXplOiAxOCwgY2xhc3NOYW1lOiAnaWNvJyB9KTtcbiAgICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBsYWJlbC50ZXh0Q29udGVudCA9IHQudGV4dDtcbiAgICBhLmFwcGVuZENoaWxkKGljbyk7XG4gICAgYS5hcHBlbmRDaGlsZChsYWJlbCk7XG4gICAgaWYgKHQua2V5ID09PSBhY3RpdmUpIGEuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgd3JhcC5hcHBlbmRDaGlsZChhKTtcbiAgfVxuICByZXR1cm4gd3JhcDtcbn1cbiIsICJpbXBvcnQgeyBOZXR3b3JrTWFuYWdlciB9IGZyb20gJy4uL2NvcmUvTmV0d29ya01hbmFnZXInO1xuaW1wb3J0IHsgcmVuZGVySWNvbiB9IGZyb20gJy4vSWNvbic7XG5cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJSZXNvdXJjZUJhcigpIHtcbiAgY29uc3QgYm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGJveC5jbGFzc05hbWUgPSAnY29udGFpbmVyJztcbiAgY29uc3QgY2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBjYXJkLmNsYXNzTmFtZSA9ICdjYXJkIGZhZGUtaW4nO1xuICBjYXJkLmlubmVySFRNTCA9IGBcbiAgICA8ZGl2IHN0eWxlPVwiZGlzcGxheTpmbGV4O2p1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuXCI+PHNwYW4+XHVEODNEXHVEQzhFIFx1NzdGRlx1NzdGMzwvc3Bhbj48c3Ryb25nIGlkPVwib3JlXCI+MDwvc3Ryb25nPjwvZGl2PlxuICAgIDxkaXYgc3R5bGU9XCJkaXNwbGF5OmZsZXg7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW5cIj48c3Bhbj5cdUQ4M0VcdURFOTkgQkJcdTVFMDE8L3NwYW4+PHN0cm9uZyBpZD1cImNvaW5cIj4wPC9zdHJvbmc+PC9kaXY+XG4gIGA7XG4gIC8vIG92ZXJyaWRlIHdpdGggZW5oYW5jZWQgc3RhdHMgbGF5b3V0XG4gIGNhcmQuaW5uZXJIVE1MID0gYFxuICAgIDxkaXYgY2xhc3M9XCJzdGF0c1wiPlxuICAgICAgPGRpdiBjbGFzcz1cInN0YXRcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImljb1wiIGRhdGEtaWNvPVwib3JlXCI+PC9kaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9XCJkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDoycHg7XCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInZhbFwiIGlkPVwib3JlXCI+MDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJsYWJlbFwiPlx1NzdGRlx1NzdGMzwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cInN0YXRcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImljb1wiIGRhdGEtaWNvPVwiY29pblwiPjwvZGl2PlxuICAgICAgICA8ZGl2IHN0eWxlPVwiZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6MnB4O1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJ2YWxcIiBpZD1cImNvaW5cIj4wPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImxhYmVsXCI+QkI8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgYDtcbiAgYm94LmFwcGVuZENoaWxkKGNhcmQpO1xuICAvLyBpbmplY3QgaWNvbnNcbiAgdHJ5IHtcbiAgICBjb25zdCBvcmVJY28gPSBjYXJkLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWljbz1cIm9yZVwiXScpO1xuICAgIGNvbnN0IGNvaW5JY28gPSBjYXJkLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWljbz1cImNvaW5cIl0nKTtcbiAgICBpZiAob3JlSWNvKSBvcmVJY28uYXBwZW5kQ2hpbGQocmVuZGVySWNvbignb3JlJywgeyBzaXplOiAxOCB9KSk7XG4gICAgaWYgKGNvaW5JY28pIGNvaW5JY28uYXBwZW5kQ2hpbGQocmVuZGVySWNvbignY29pbicsIHsgc2l6ZTogMTggfSkpO1xuICB9IGNhdGNoIHt9XG4gIGNvbnN0IG9yZUVsID0gY2FyZC5xdWVyeVNlbGVjdG9yKCcjb3JlJykgYXMgSFRNTEVsZW1lbnQ7XG4gIGNvbnN0IGNvaW5FbCA9IGNhcmQucXVlcnlTZWxlY3RvcignI2NvaW4nKSBhcyBIVE1MRWxlbWVudDtcbiAgYXN5bmMgZnVuY3Rpb24gdXBkYXRlKCkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBwID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgaWQ6IHN0cmluZzsgdXNlcm5hbWU6IHN0cmluZzsgbmlja25hbWU6IHN0cmluZzsgb3JlQW1vdW50OiBudW1iZXI7IGJiQ29pbnM6IG51bWJlciB9PignL3VzZXIvcHJvZmlsZScpO1xuICAgICAgb3JlRWwudGV4dENvbnRlbnQgPSBTdHJpbmcocC5vcmVBbW91bnQpO1xuICAgICAgY29pbkVsLnRleHRDb250ZW50ID0gU3RyaW5nKHAuYmJDb2lucyk7XG4gICAgfSBjYXRjaCB7XG4gICAgICAvLyBpZ25vcmUgZmV0Y2ggZXJyb3JzOyBVSSBcdTRGMUFcdTU3MjhcdTRFMEJcdTRFMDBcdTZCMjFcdTUyMzdcdTY1QjBcdTY1RjZcdTYwNjJcdTU5MERcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHsgcm9vdDogYm94LCB1cGRhdGUgfTtcbn1cbiIsICJleHBvcnQgZnVuY3Rpb24gc3Bhd25GbG9hdFRleHQoYW5jaG9yOiBFbGVtZW50LCB0ZXh0OiBzdHJpbmcsIGNvbG9yID0gJyNmZmYnKSB7XG4gIGNvbnN0IHJlY3QgPSBhbmNob3IuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIGNvbnN0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgc3Bhbi50ZXh0Q29udGVudCA9IHRleHQ7XG4gIHNwYW4uc3R5bGUuY3NzVGV4dCA9IGBwb3NpdGlvbjpmaXhlZDtsZWZ0OiR7cmVjdC5sZWZ0ICsgcmVjdC53aWR0aCAtIDI0fXB4O3RvcDoke3JlY3QudG9wIC0gNn1weDtgK1xuICAgICd0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7IHRyYW5zaXRpb246IGFsbCAuN3MgY3ViaWMtYmV6aWVyKC4yMiwuNjEsLjM2LDEpOycrXG4gICAgJ3BvaW50ZXItZXZlbnRzOm5vbmU7IHotaW5kZXg6OTk5OTsgZm9udC13ZWlnaHQ6NzAwOyBjb2xvcjonK2NvbG9yKyc7IHRleHQtc2hhZG93OjAgMCA4cHggcmdiYSgyNTUsMjU1LDI1NSwuMjUpJztcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzcGFuKTtcbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICBzcGFuLnN0eWxlLm9wYWNpdHkgPSAnMCc7XG4gICAgc3Bhbi5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlWSgtMjRweCknO1xuICB9KTtcbiAgc2V0VGltZW91dCgoKSA9PiBzcGFuLnJlbW92ZSgpLCA4MDApO1xufVxuXG4iLCAiaW1wb3J0IHsgTmV0d29ya01hbmFnZXIgfSBmcm9tICcuLi9jb3JlL05ldHdvcmtNYW5hZ2VyJztcbmltcG9ydCB7IFJlYWx0aW1lQ2xpZW50IH0gZnJvbSAnLi4vY29yZS9SZWFsdGltZUNsaWVudCc7XG5pbXBvcnQgeyBodG1sLCBxcyB9IGZyb20gJy4uL3V0aWxzL2RvbSc7XG5pbXBvcnQgeyByZW5kZXJOYXYgfSBmcm9tICcuLi9jb21wb25lbnRzL05hdic7XG5pbXBvcnQgeyByZW5kZXJSZXNvdXJjZUJhciB9IGZyb20gJy4uL2NvbXBvbmVudHMvUmVzb3VyY2VCYXInO1xuaW1wb3J0IHsgc2hvd1RvYXN0IH0gZnJvbSAnLi4vY29tcG9uZW50cy9Ub2FzdCc7XG5pbXBvcnQgeyBzcGF3bkZsb2F0VGV4dCB9IGZyb20gJy4uL2NvbXBvbmVudHMvRmxvYXRUZXh0JztcbmltcG9ydCB7IHJlbmRlckljb24gfSBmcm9tICcuLi9jb21wb25lbnRzL0ljb24nO1xuXG50eXBlIE1pbmVTdGF0dXMgPSB7XG4gIGNhcnRBbW91bnQ6IG51bWJlcjtcbiAgY2FydENhcGFjaXR5OiBudW1iZXI7XG4gIGNvbGxhcHNlZDogYm9vbGVhbjtcbiAgY29sbGFwc2VkUmVtYWluaW5nOiBudW1iZXI7XG4gIHJ1bm5pbmc6IGJvb2xlYW47XG4gIGludGVydmFsTXM6IG51bWJlcjtcbn07XG5cbnR5cGUgUGVuZGluZ0FjdGlvbiA9ICdzdGFydCcgfCAnc3RvcCcgfCAnY29sbGVjdCcgfCAncmVwYWlyJyB8ICdzdGF0dXMnIHwgbnVsbDtcblxuZXhwb3J0IGNsYXNzIE1haW5TY2VuZSB7XG4gIHByaXZhdGUgdmlldzogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBjYXJ0QW10ID0gMDtcbiAgcHJpdmF0ZSBjYXJ0Q2FwID0gMTAwMDtcbiAgcHJpdmF0ZSBpc01pbmluZyA9IGZhbHNlO1xuICBwcml2YXRlIGlzQ29sbGFwc2VkID0gZmFsc2U7XG4gIHByaXZhdGUgY29sbGFwc2VSZW1haW5pbmcgPSAwO1xuICBwcml2YXRlIGNvbGxhcHNlVGltZXI6IG51bWJlciB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGludGVydmFsTXMgPSAzMDAwO1xuICBwcml2YXRlIHBlbmRpbmc6IFBlbmRpbmdBY3Rpb24gPSBudWxsO1xuXG4gIHByaXZhdGUgZWxzID0ge1xuICAgIGZpbGw6IG51bGwgYXMgSFRNTEVsZW1lbnQgfCBudWxsLFxuICAgIHBlcmNlbnQ6IG51bGwgYXMgSFRNTEVsZW1lbnQgfCBudWxsLFxuICAgIHN0YXR1c1RleHQ6IG51bGwgYXMgSFRNTEVsZW1lbnQgfCBudWxsLFxuICAgIHJpbmc6IG51bGwgYXMgSFRNTEVsZW1lbnQgfCBudWxsLFxuICAgIHJpbmdQY3Q6IG51bGwgYXMgSFRNTEVsZW1lbnQgfCBudWxsLFxuICAgIGN5Y2xlOiBudWxsIGFzIEhUTUxFbGVtZW50IHwgbnVsbCxcbiAgICBzdGF0dXNUYWc6IG51bGwgYXMgSFRNTEVsZW1lbnQgfCBudWxsLFxuICAgIGV2ZW50czogbnVsbCBhcyBIVE1MRWxlbWVudCB8IG51bGwsXG4gICAgc3RhcnQ6IG51bGwgYXMgSFRNTEJ1dHRvbkVsZW1lbnQgfCBudWxsLFxuICAgIHN0b3A6IG51bGwgYXMgSFRNTEJ1dHRvbkVsZW1lbnQgfCBudWxsLFxuICAgIGNvbGxlY3Q6IG51bGwgYXMgSFRNTEJ1dHRvbkVsZW1lbnQgfCBudWxsLFxuICAgIHJlcGFpcjogbnVsbCBhcyBIVE1MQnV0dG9uRWxlbWVudCB8IG51bGwsXG4gICAgc3RhdHVzQnRuOiBudWxsIGFzIEhUTUxCdXR0b25FbGVtZW50IHwgbnVsbCxcbiAgfTtcblxuICBwcml2YXRlIG1pbmVVcGRhdGVIYW5kbGVyPzogKG1zZzogYW55KSA9PiB2b2lkO1xuICBwcml2YXRlIG1pbmVDb2xsYXBzZUhhbmRsZXI/OiAobXNnOiBhbnkpID0+IHZvaWQ7XG4gIHByaXZhdGUgcGx1bmRlckhhbmRsZXI/OiAobXNnOiBhbnkpID0+IHZvaWQ7XG5cbiAgYXN5bmMgbW91bnQocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICB0aGlzLmNsZWFyQ29sbGFwc2VUaW1lcigpO1xuICAgIHRoaXMucGVuZGluZyA9IG51bGw7XG5cbiAgICBjb25zdCBuYXYgPSByZW5kZXJOYXYoJ21haW4nKTtcbiAgICBjb25zdCBiYXIgPSByZW5kZXJSZXNvdXJjZUJhcigpO1xuICAgIGNvbnN0IHZpZXcgPSBodG1sKGBcbiAgICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXIgZ3JpZC0yXCIgc3R5bGU9XCJjb2xvcjojZmZmO1wiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibWluZSBjYXJkIGZhZGUtaW5cIj5cbiAgICAgICAgICA8ZGl2IHN0eWxlPVwib3BhY2l0eTouOTttYXJnaW4tYm90dG9tOjhweDtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo4cHg7XCI+PHNwYW4gZGF0YS1pY289XCJwaWNrXCI+PC9zcGFuPlx1NjMxNlx1NzdGRlx1OTc2Mlx1Njc3RjwvZGl2PlxuICAgICAgICAgIDxkaXYgc3R5bGU9XCJoZWlnaHQ6MTBweDtib3JkZXItcmFkaXVzOjk5OXB4O2JhY2tncm91bmQ6cmdiYSgyNTUsMjU1LDI1NSwuMTIpO292ZXJmbG93OmhpZGRlbjtcIj5cbiAgICAgICAgICAgIDxkaXYgaWQ9XCJmaWxsXCIgc3R5bGU9XCJoZWlnaHQ6MTAwJTt3aWR0aDowJTtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCg5MGRlZywjN0IyQ0Y1LCMyQzg5RjUpO2JveC1zaGFkb3c6MCAwIDEwcHggIzdCMkNGNTt0cmFuc2l0aW9uOndpZHRoIC4zcyBlYXNlXCI+PC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBzdHlsZT1cImRpc3BsYXk6ZmxleDtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjthbGlnbi1pdGVtczpjZW50ZXI7bWFyZ2luOjhweCAwIDEycHg7XCI+XG4gICAgICAgICAgICA8c3Bhbj5cdTc3RkZcdThGNjZcdTg4QzVcdThGN0Q8L3NwYW4+XG4gICAgICAgICAgICA8c3Ryb25nIGlkPVwicGVyY2VudFwiPjAlPC9zdHJvbmc+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiIHN0eWxlPVwiZ2FwOjhweDtcIj5cbiAgICAgICAgICAgIDxidXR0b24gaWQ9XCJzdGFydFwiIGNsYXNzPVwiYnRuIGJ0bi1idXlcIiBzdHlsZT1cImZsZXg6MTtcIj48c3BhbiBkYXRhLWljbz1cInBsYXlcIj48L3NwYW4+XHU1RjAwXHU1OUNCXHU2MzE2XHU3N0ZGPC9idXR0b24+XG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwic3RvcFwiIGNsYXNzPVwiYnRuIGJ0bi1naG9zdFwiIHN0eWxlPVwiZmxleDoxO1wiPjxzcGFuIGRhdGEtaWNvPVwic3RvcFwiPjwvc3Bhbj5cdTUwNUNcdTZCNjI8L2J1dHRvbj5cbiAgICAgICAgICAgIDxidXR0b24gaWQ9XCJjb2xsZWN0XCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIiBzdHlsZT1cImZsZXg6MTtcIj48c3BhbiBkYXRhLWljbz1cImNvbGxlY3RcIj48L3NwYW4+XHU2NTM2XHU3N0ZGPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiIHN0eWxlPVwiZ2FwOjhweDttYXJnaW4tdG9wOjhweDtcIj5cbiAgICAgICAgICAgIDxidXR0b24gaWQ9XCJzdGF0dXNcIiBjbGFzcz1cImJ0biBidG4tZ2hvc3RcIiBzdHlsZT1cImZsZXg6MTtcIj48c3BhbiBkYXRhLWljbz1cInJlZnJlc2hcIj48L3NwYW4+XHU1MjM3XHU2NUIwXHU3MkI2XHU2MDAxPC9idXR0b24+XG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwicmVwYWlyXCIgY2xhc3M9XCJidG4gYnRuLXNlbGxcIiBzdHlsZT1cImZsZXg6MTtcIj48c3BhbiBkYXRhLWljbz1cIndyZW5jaFwiPjwvc3Bhbj5cdTRGRUVcdTc0MDY8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGlkPVwic3RhdHVzVGV4dFwiIHN0eWxlPVwibWFyZ2luLXRvcDo2cHg7b3BhY2l0eTouOTttaW4taGVpZ2h0OjIwcHg7XCI+PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgYCk7XG5cbiAgICByb290LmlubmVySFRNTCA9ICcnO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQobmF2KTtcbiAgICByb290LmFwcGVuZENoaWxkKGJhci5yb290KTtcbiAgICByb290LmFwcGVuZENoaWxkKHZpZXcpO1xuXG4gICAgdGhpcy52aWV3ID0gdmlldztcbiAgICAvLyBtb3VudCBpY29ucyBpbiBoZWFkZXIvYnV0dG9uc1xuICAgIHRyeSB7XG4gICAgICB2aWV3LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWljb10nKVxuICAgICAgICAuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgICBjb25zdCBuYW1lID0gKGVsIGFzIEhUTUxFbGVtZW50KS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWNvJykgYXMgYW55O1xuICAgICAgICAgIHRyeSB7IGVsLmFwcGVuZENoaWxkKHJlbmRlckljb24obmFtZSwgeyBzaXplOiAyMCB9KSk7IH0gY2F0Y2gge31cbiAgICAgICAgfSk7XG4gICAgfSBjYXRjaCB7fVxuICAgIHRoaXMudXBncmFkZU1pbmVDYXJkVUkoKTtcbiAgICB0aGlzLmNhY2hlRWxlbWVudHMoKTtcbiAgICB0aGlzLmF0dGFjaEhhbmRsZXJzKGJhci51cGRhdGUuYmluZChiYXIpKTtcbiAgICBhd2FpdCBiYXIudXBkYXRlKCk7XG4gICAgdGhpcy5zZXR1cFJlYWx0aW1lKCk7XG4gICAgYXdhaXQgdGhpcy5yZWZyZXNoU3RhdHVzKCk7XG4gICAgdGhpcy51cGRhdGVQcm9ncmVzcygpO1xuICAgIHRoaXMudXBkYXRlQ29udHJvbHMoKTtcbiAgfVxuXG4gIHByaXZhdGUgY2FjaGVFbGVtZW50cygpIHtcbiAgICBpZiAoIXRoaXMudmlldykgcmV0dXJuO1xuICAgIHRoaXMuZWxzLmZpbGwgPSBxcyh0aGlzLnZpZXcsICcjZmlsbCcpO1xuICAgIHRoaXMuZWxzLnBlcmNlbnQgPSBxcyh0aGlzLnZpZXcsICcjcGVyY2VudCcpO1xuICAgIHRoaXMuZWxzLnN0YXR1c1RleHQgPSBxcyh0aGlzLnZpZXcsICcjc3RhdHVzVGV4dCcpO1xuICAgIHRoaXMuZWxzLnJpbmcgPSB0aGlzLnZpZXcucXVlcnlTZWxlY3RvcignI3JpbmcnKTtcbiAgICB0aGlzLmVscy5yaW5nUGN0ID0gdGhpcy52aWV3LnF1ZXJ5U2VsZWN0b3IoJyNyaW5nUGN0Jyk7XG4gICAgdGhpcy5lbHMuY3ljbGUgPSB0aGlzLnZpZXcucXVlcnlTZWxlY3RvcignI2N5Y2xlJyk7XG4gICAgdGhpcy5lbHMuc3RhdHVzVGFnID0gdGhpcy52aWV3LnF1ZXJ5U2VsZWN0b3IoJyNzdGF0dXNUYWcnKTtcbiAgICB0aGlzLmVscy5ldmVudHMgPSB0aGlzLnZpZXcucXVlcnlTZWxlY3RvcignI2V2ZW50cycpO1xuICAgIHRoaXMuZWxzLnN0YXJ0ID0gcXM8SFRNTEJ1dHRvbkVsZW1lbnQ+KHRoaXMudmlldywgJyNzdGFydCcpO1xuICAgIHRoaXMuZWxzLnN0b3AgPSBxczxIVE1MQnV0dG9uRWxlbWVudD4odGhpcy52aWV3LCAnI3N0b3AnKTtcbiAgICB0aGlzLmVscy5jb2xsZWN0ID0gcXM8SFRNTEJ1dHRvbkVsZW1lbnQ+KHRoaXMudmlldywgJyNjb2xsZWN0Jyk7XG4gICAgdGhpcy5lbHMucmVwYWlyID0gcXM8SFRNTEJ1dHRvbkVsZW1lbnQ+KHRoaXMudmlldywgJyNyZXBhaXInKTtcbiAgICB0aGlzLmVscy5zdGF0dXNCdG4gPSBxczxIVE1MQnV0dG9uRWxlbWVudD4odGhpcy52aWV3LCAnI3N0YXR1cycpO1xuICB9XG5cbiAgLy8gRW5oYW5jZSBVSTogYWRkIHJhZGlhbCBtZXRlciBhbmQgZXZlbnQgZmVlZCBkeW5hbWljYWxseVxuICBwcml2YXRlIHVwZ3JhZGVNaW5lQ2FyZFVJKCkge1xuICAgIGlmICghdGhpcy52aWV3KSByZXR1cm47XG4gICAgY29uc3QgbWluZUNhcmQgPSB0aGlzLnZpZXcucXVlcnlTZWxlY3RvcignLm1pbmUnKTtcbiAgICBpZiAoIW1pbmVDYXJkKSByZXR1cm47XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGJsb2NrID0gaHRtbChgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIiBzdHlsZT1cImdhcDoxMnB4O2FsaWduLWl0ZW1zOmNlbnRlcjttYXJnaW4tYm90dG9tOjhweDtcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicmluZ1wiIGlkPVwicmluZ1wiPjxkaXYgY2xhc3M9XCJsYWJlbFwiIGlkPVwicmluZ1BjdFwiPjAlPC9kaXY+PC9kaXY+XG4gICAgICAgICAgPGRpdiBzdHlsZT1cImRpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjZweDtcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwaWxsXCIgaWQ9XCJzdGF0dXNUYWdcIj5cdTVGODVcdTY3M0E8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwaWxsXCI+PHNwYW4gZGF0YS1pY289XCJjbG9ja1wiPjwvc3Bhbj5cdTU0NjhcdTY3MUYgPHNwYW4gaWQ9XCJjeWNsZVwiPjNzPC9zcGFuPjwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIGApO1xuICAgICAgYmxvY2sucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtaWNvXScpXG4gICAgICAgIC5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICAgIGNvbnN0IG5hbWUgPSAoZWwgYXMgSFRNTEVsZW1lbnQpLmdldEF0dHJpYnV0ZSgnZGF0YS1pY28nKSBhcyBhbnk7XG4gICAgICAgICAgdHJ5IHsgZWwuYXBwZW5kQ2hpbGQocmVuZGVySWNvbihuYW1lLCB7IHNpemU6IDE2IH0pKTsgfSBjYXRjaCB7fVxuICAgICAgICB9KTtcbiAgICAgIChtaW5lQ2FyZCBhcyBIVE1MRWxlbWVudCkuaW5zZXJ0QmVmb3JlKGJsb2NrLCAobWluZUNhcmQgYXMgSFRNTEVsZW1lbnQpLmNoaWxkcmVuWzFdIHx8IG51bGwpO1xuICAgICAgY29uc3QgZmVlZCA9IGh0bWwoYDxkaXYgY2xhc3M9XCJldmVudC1mZWVkXCIgaWQ9XCJldmVudHNcIiBzdHlsZT1cIm1hcmdpbi10b3A6MTBweDtcIj48L2Rpdj5gKTtcbiAgICAgIChtaW5lQ2FyZCBhcyBIVE1MRWxlbWVudCkuYXBwZW5kQ2hpbGQoZmVlZCk7XG4gICAgfSBjYXRjaCB7fVxuICB9XG5cbiAgcHJpdmF0ZSBhdHRhY2hIYW5kbGVycyh1cGRhdGVCYXI6ICgpID0+IFByb21pc2U8dm9pZD4pIHtcbiAgICBpZiAoIXRoaXMudmlldykgcmV0dXJuO1xuICAgIHRoaXMuZWxzLnN0YXJ0Py5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRoaXMuaGFuZGxlU3RhcnQoKSk7XG4gICAgdGhpcy5lbHMuc3RvcD8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0aGlzLmhhbmRsZVN0b3AoKSk7XG4gICAgdGhpcy5lbHMuc3RhdHVzQnRuPy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRoaXMucmVmcmVzaFN0YXR1cygpKTtcbiAgICB0aGlzLmVscy5yZXBhaXI/LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdGhpcy5oYW5kbGVSZXBhaXIoKSk7XG4gICAgdGhpcy5lbHMuY29sbGVjdD8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0aGlzLmhhbmRsZUNvbGxlY3QodXBkYXRlQmFyKSk7XG4gIH1cblxuICBwcml2YXRlIHNldHVwUmVhbHRpbWUoKSB7XG4gICAgY29uc3QgdG9rZW4gPSAoTmV0d29ya01hbmFnZXIgYXMgYW55KS5JWyd0b2tlbiddO1xuICAgIGlmICh0b2tlbikgUmVhbHRpbWVDbGllbnQuSS5jb25uZWN0KHRva2VuKTtcblxuICAgIGlmICh0aGlzLm1pbmVVcGRhdGVIYW5kbGVyKSBSZWFsdGltZUNsaWVudC5JLm9mZignbWluZS51cGRhdGUnLCB0aGlzLm1pbmVVcGRhdGVIYW5kbGVyKTtcbiAgICBpZiAodGhpcy5taW5lQ29sbGFwc2VIYW5kbGVyKSBSZWFsdGltZUNsaWVudC5JLm9mZignbWluZS5jb2xsYXBzZScsIHRoaXMubWluZUNvbGxhcHNlSGFuZGxlcik7XG4gICAgaWYgKHRoaXMucGx1bmRlckhhbmRsZXIpIFJlYWx0aW1lQ2xpZW50Lkkub2ZmKCdwbHVuZGVyLmF0dGFja2VkJywgdGhpcy5wbHVuZGVySGFuZGxlcik7XG5cbiAgICB0aGlzLm1pbmVVcGRhdGVIYW5kbGVyID0gKG1zZykgPT4ge1xuICAgICAgdGhpcy5jYXJ0QW10ID0gdHlwZW9mIG1zZy5jYXJ0QW1vdW50ID09PSAnbnVtYmVyJyA/IG1zZy5jYXJ0QW1vdW50IDogdGhpcy5jYXJ0QW10O1xuICAgICAgdGhpcy5jYXJ0Q2FwID0gdHlwZW9mIG1zZy5jYXJ0Q2FwYWNpdHkgPT09ICdudW1iZXInID8gbXNnLmNhcnRDYXBhY2l0eSA6IHRoaXMuY2FydENhcDtcbiAgICAgIHRoaXMuaXNNaW5pbmcgPSBtc2cucnVubmluZyA/PyB0aGlzLmlzTWluaW5nO1xuICAgICAgaWYgKG1zZy5jb2xsYXBzZWQgJiYgbXNnLmNvbGxhcHNlZFJlbWFpbmluZykge1xuICAgICAgICB0aGlzLmJlZ2luQ29sbGFwc2VDb3VudGRvd24obXNnLmNvbGxhcHNlZFJlbWFpbmluZyk7XG4gICAgICB9IGVsc2UgaWYgKCFtc2cuY29sbGFwc2VkKSB7XG4gICAgICAgIHRoaXMuaXNDb2xsYXBzZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jbGVhckNvbGxhcHNlVGltZXIoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMudXBkYXRlUHJvZ3Jlc3MoKTtcbiAgICAgIGlmIChtc2cudHlwZSA9PT0gJ2NyaXRpY2FsJyAmJiBtc2cuYW1vdW50KSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZShgXHU4OUU2XHU1M0QxXHU2NkI0XHU1MUZCXHVGRjBDXHU3N0ZGXHU4RjY2XHU1ODlFXHU1MkEwICR7bXNnLmFtb3VudH1cdUZGMDFgKTtcbiAgICAgICAgdGhpcy5sb2dFdmVudChgXHU2NkI0XHU1MUZCICske21zZy5hbW91bnR9YCk7XG4gICAgICB9IGVsc2UgaWYgKG1zZy50eXBlID09PSAnbm9ybWFsJyAmJiBtc2cuYW1vdW50KSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZShgXHU3N0ZGXHU4RjY2XHU1ODlFXHU1MkEwICR7bXNnLmFtb3VudH1cdUZGMENcdTVGNTNcdTUyNEQgJHt0aGlzLmZvcm1hdFBlcmNlbnQoKX1gKTtcbiAgICAgICAgdGhpcy5sb2dFdmVudChgXHU2MzE2XHU2Mzk4ICske21zZy5hbW91bnR9YCk7XG4gICAgICB9IGVsc2UgaWYgKG1zZy50eXBlID09PSAnY29sbGFwc2UnKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZSgnXHU3N0ZGXHU5MDUzXHU1NzREXHU1ODRDXHVGRjBDXHU4QkY3XHU3QUNCXHU1MzczXHU0RkVFXHU3NDA2Jyk7XG4gICAgICAgIHRoaXMubG9nRXZlbnQoJ1x1NzdGRlx1OTA1M1x1NTc0RFx1NTg0QycpO1xuICAgICAgfSBlbHNlIGlmIChtc2cudHlwZSA9PT0gJ2NvbGxlY3QnKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZSgnXHU3N0ZGXHU3N0YzXHU1REYyXHU2NTM2XHU5NkM2XHVGRjBDXHU3N0ZGXHU4RjY2XHU2RTA1XHU3QTdBJyk7XG4gICAgICAgIHRoaXMubG9nRXZlbnQoJ1x1NjUzNlx1OTZDNlx1NUI4Q1x1NjIxMCcpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmlzQ29sbGFwc2VkKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZShgXHU3N0ZGXHU5MDUzXHU1NzREXHU1ODRDXHVGRjBDXHU1MjY5XHU0RjU5ICR7dGhpcy5jb2xsYXBzZVJlbWFpbmluZ31zYCk7XG4gICAgICB9XG4gICAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzKCk7XG4gICAgfTtcblxuICAgIHRoaXMubWluZUNvbGxhcHNlSGFuZGxlciA9IChtc2cpID0+IHtcbiAgICAgIGNvbnN0IHNlY29uZHMgPSBOdW1iZXIobXNnPy5yZXBhaXJfZHVyYXRpb24pIHx8IDA7XG4gICAgICBpZiAoc2Vjb25kcyA+IDApIHRoaXMuYmVnaW5Db2xsYXBzZUNvdW50ZG93bihzZWNvbmRzKTtcbiAgICAgIHNob3dUb2FzdChgXHU3N0ZGXHU5MDUzXHU1NzREXHU1ODRDXHVGRjBDXHU5NzAwXHU0RkVFXHU3NDA2XHVGRjA4XHU3RUE2ICR7c2Vjb25kc31zXHVGRjA5YCwgJ3dhcm4nKTtcbiAgICB9O1xuXG4gICAgdGhpcy5wbHVuZGVySGFuZGxlciA9IChtc2cpID0+IHtcbiAgICAgIHNob3dUb2FzdChgXHU4OEFCXHU2M0EwXHU1OTNBXHVGRjFBXHU2NzY1XHU4MUVBICR7bXNnLmF0dGFja2VyfVx1RkYwQ1x1NjM1Rlx1NTkzMSAke21zZy5sb3NzfWAsICd3YXJuJyk7XG4gICAgICB0aGlzLmxvZ0V2ZW50KGBcdTg4QUIgJHttc2cuYXR0YWNrZXJ9IFx1NjNBMFx1NTkzQSAtJHttc2cubG9zc31gKTtcbiAgICB9O1xuXG4gICAgUmVhbHRpbWVDbGllbnQuSS5vbignbWluZS51cGRhdGUnLCB0aGlzLm1pbmVVcGRhdGVIYW5kbGVyKTtcbiAgICBSZWFsdGltZUNsaWVudC5JLm9uKCdtaW5lLmNvbGxhcHNlJywgdGhpcy5taW5lQ29sbGFwc2VIYW5kbGVyKTtcbiAgICBSZWFsdGltZUNsaWVudC5JLm9uKCdwbHVuZGVyLmF0dGFja2VkJywgdGhpcy5wbHVuZGVySGFuZGxlcik7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGhhbmRsZVN0YXJ0KCkge1xuICAgIGlmICh0aGlzLnBlbmRpbmcgfHwgdGhpcy5pc0NvbGxhcHNlZCkge1xuICAgICAgaWYgKHRoaXMuaXNDb2xsYXBzZWQpIHNob3dUb2FzdCgnXHU3N0ZGXHU5MDUzXHU1NzREXHU1ODRDXHVGRjBDXHU4QkY3XHU1MTQ4XHU0RkVFXHU3NDA2JywgJ3dhcm4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5wZW5kaW5nID0gJ3N0YXJ0JztcbiAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzKCk7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHN0YXR1cyA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDxNaW5lU3RhdHVzPignL21pbmUvc3RhcnQnLCB7IG1ldGhvZDogJ1BPU1QnIH0pO1xuICAgICAgdGhpcy5hcHBseVN0YXR1cyhzdGF0dXMpO1xuICAgICAgdGhpcy5zZXRTdGF0dXNNZXNzYWdlKCdcdTc3RkZcdTY3M0FcdTVERjJcdTU0MkZcdTUyQTgnKTtcbiAgICAgIHNob3dUb2FzdCgnXHU3N0ZGXHU2NzNBXHU1REYyXHU1NDJGXHU1MkE4JywgJ3N1Y2Nlc3MnKTtcbiAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgIHNob3dUb2FzdChlPy5tZXNzYWdlIHx8ICdcdTU0MkZcdTUyQThcdTU5MzFcdThEMjUnLCAnZXJyb3InKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5wZW5kaW5nID0gbnVsbDtcbiAgICAgIHRoaXMudXBkYXRlQ29udHJvbHMoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGhhbmRsZVN0b3AoKSB7XG4gICAgaWYgKHRoaXMucGVuZGluZykgcmV0dXJuO1xuICAgIHRoaXMucGVuZGluZyA9ICdzdG9wJztcbiAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzKCk7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHN0YXR1cyA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDxNaW5lU3RhdHVzPignL21pbmUvc3RvcCcsIHsgbWV0aG9kOiAnUE9TVCcgfSk7XG4gICAgICB0aGlzLmFwcGx5U3RhdHVzKHN0YXR1cyk7XG4gICAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoJ1x1NzdGRlx1NjczQVx1NURGMlx1NTA1Q1x1NkI2MicpO1xuICAgICAgc2hvd1RvYXN0KCdcdTc3RkZcdTY3M0FcdTVERjJcdTUwNUNcdTZCNjInLCAnc3VjY2VzcycpO1xuICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgc2hvd1RvYXN0KGU/Lm1lc3NhZ2UgfHwgJ1x1NTA1Q1x1NkI2Mlx1NTkzMVx1OEQyNScsICdlcnJvcicpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLnBlbmRpbmcgPSBudWxsO1xuICAgICAgdGhpcy51cGRhdGVDb250cm9scygpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgaGFuZGxlQ29sbGVjdCh1cGRhdGVCYXI6ICgpID0+IFByb21pc2U8dm9pZD4pIHtcbiAgICBpZiAodGhpcy5wZW5kaW5nIHx8IHRoaXMuY2FydEFtdCA8PSAwKSByZXR1cm47XG4gICAgdGhpcy5wZW5kaW5nID0gJ2NvbGxlY3QnO1xuICAgIHRoaXMudXBkYXRlQ29udHJvbHMoKTtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgY29sbGVjdGVkOiBudW1iZXI7IHN0YXR1czogTWluZVN0YXR1cyB9PignL21pbmUvY29sbGVjdCcsIHsgbWV0aG9kOiAnUE9TVCcgfSk7XG4gICAgICBpZiAocmVzLnN0YXR1cykgdGhpcy5hcHBseVN0YXR1cyhyZXMuc3RhdHVzKTtcbiAgICAgIGlmIChyZXMuY29sbGVjdGVkID4gMCkge1xuICAgICAgICBjb25zdCBvcmVMYWJlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNvcmUnKTtcbiAgICAgICAgaWYgKG9yZUxhYmVsKSBzcGF3bkZsb2F0VGV4dChvcmVMYWJlbCBhcyBFbGVtZW50LCBgKyR7cmVzLmNvbGxlY3RlZH1gLCAnIzdCMkNGNScpO1xuICAgICAgICBzaG93VG9hc3QoYFx1NjUzNlx1OTZDNlx1NzdGRlx1NzdGMyAke3Jlcy5jb2xsZWN0ZWR9YCwgJ3N1Y2Nlc3MnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNob3dUb2FzdCgnXHU3N0ZGXHU4RjY2XHU0RTNBXHU3QTdBXHVGRjBDXHU2NUUwXHU3N0ZGXHU3N0YzXHU1M0VGXHU2NTM2XHU5NkM2JywgJ3dhcm4nKTtcbiAgICAgIH1cbiAgICAgIGF3YWl0IHVwZGF0ZUJhcigpO1xuICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgc2hvd1RvYXN0KGU/Lm1lc3NhZ2UgfHwgJ1x1NjUzNlx1NzdGRlx1NTkzMVx1OEQyNScsICdlcnJvcicpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLnBlbmRpbmcgPSBudWxsO1xuICAgICAgdGhpcy51cGRhdGVDb250cm9scygpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgaGFuZGxlUmVwYWlyKCkge1xuICAgIGlmICh0aGlzLnBlbmRpbmcgfHwgIXRoaXMuaXNDb2xsYXBzZWQpIHJldHVybjtcbiAgICB0aGlzLnBlbmRpbmcgPSAncmVwYWlyJztcbiAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzKCk7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHN0YXR1cyA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDxNaW5lU3RhdHVzPignL21pbmUvcmVwYWlyJywgeyBtZXRob2Q6ICdQT1NUJyB9KTtcbiAgICAgIHRoaXMuYXBwbHlTdGF0dXMoc3RhdHVzKTtcbiAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZSgnXHU3N0ZGXHU5MDUzXHU1REYyXHU0RkVFXHU1OTBEXHVGRjBDXHU1M0VGXHU5MUNEXHU2NUIwXHU1NDJGXHU1MkE4Jyk7XG4gICAgICBzaG93VG9hc3QoJ1x1NzdGRlx1OTA1M1x1NURGMlx1NEZFRVx1NTkwRCcsICdzdWNjZXNzJyk7XG4gICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICBzaG93VG9hc3QoZT8ubWVzc2FnZSB8fCAnXHU0RkVFXHU3NDA2XHU1OTMxXHU4RDI1JywgJ2Vycm9yJyk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMucGVuZGluZyA9IG51bGw7XG4gICAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyByZWZyZXNoU3RhdHVzKCkge1xuICAgIGlmICh0aGlzLnBlbmRpbmcgPT09ICdzdGF0dXMnKSByZXR1cm47XG4gICAgdGhpcy5wZW5kaW5nID0gJ3N0YXR1cyc7XG4gICAgdGhpcy51cGRhdGVDb250cm9scygpO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBzdGF0dXMgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8TWluZVN0YXR1cz4oJy9taW5lL3N0YXR1cycpO1xuICAgICAgdGhpcy5hcHBseVN0YXR1cyhzdGF0dXMpO1xuICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgc2hvd1RvYXN0KGU/Lm1lc3NhZ2UgfHwgJ1x1ODNCN1x1NTNENlx1NzJCNlx1NjAwMVx1NTkzMVx1OEQyNScsICdlcnJvcicpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLnBlbmRpbmcgPSBudWxsO1xuICAgICAgdGhpcy51cGRhdGVDb250cm9scygpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXBwbHlTdGF0dXMoc3RhdHVzOiBNaW5lU3RhdHVzIHwgdW5kZWZpbmVkLCBvcHRzOiB7IHF1aWV0PzogYm9vbGVhbiB9ID0ge30pIHtcbiAgICBpZiAoIXN0YXR1cykgcmV0dXJuO1xuICAgIHRoaXMuY2FydEFtdCA9IHN0YXR1cy5jYXJ0QW1vdW50ID8/IHRoaXMuY2FydEFtdDtcbiAgICB0aGlzLmNhcnRDYXAgPSBzdGF0dXMuY2FydENhcGFjaXR5ID8/IHRoaXMuY2FydENhcDtcbiAgICB0aGlzLmludGVydmFsTXMgPSBzdGF0dXMuaW50ZXJ2YWxNcyA/PyB0aGlzLmludGVydmFsTXM7XG4gICAgdGhpcy5pc01pbmluZyA9IEJvb2xlYW4oc3RhdHVzLnJ1bm5pbmcpO1xuICAgIHRoaXMuaXNDb2xsYXBzZWQgPSBCb29sZWFuKHN0YXR1cy5jb2xsYXBzZWQpO1xuICAgIGlmIChzdGF0dXMuY29sbGFwc2VkICYmIHN0YXR1cy5jb2xsYXBzZWRSZW1haW5pbmcgPiAwKSB7XG4gICAgICB0aGlzLmJlZ2luQ29sbGFwc2VDb3VudGRvd24oc3RhdHVzLmNvbGxhcHNlZFJlbWFpbmluZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2xlYXJDb2xsYXBzZVRpbWVyKCk7XG4gICAgICB0aGlzLmNvbGxhcHNlUmVtYWluaW5nID0gMDtcbiAgICB9XG4gICAgdGhpcy51cGRhdGVQcm9ncmVzcygpO1xuICAgIGlmICghb3B0cy5xdWlldCkge1xuICAgICAgaWYgKHRoaXMuaXNDb2xsYXBzZWQgJiYgdGhpcy5jb2xsYXBzZVJlbWFpbmluZyA+IDApIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0dXNNZXNzYWdlKGBcdTc3RkZcdTkwNTNcdTU3NERcdTU4NENcdUZGMENcdTUyNjlcdTRGNTkgJHt0aGlzLmNvbGxhcHNlUmVtYWluaW5nfXNgKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pc01pbmluZykge1xuICAgICAgICBjb25zdCBzZWNvbmRzID0gTWF0aC5tYXgoMSwgTWF0aC5yb3VuZCh0aGlzLmludGVydmFsTXMgLyAxMDAwKSk7XG4gICAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZShgXHU3N0ZGXHU2NzNBXHU4RkQwXHU4ODRDXHU0RTJEXHVGRjBDXHU1NDY4XHU2NzFGXHU3RUE2ICR7c2Vjb25kc31zXHVGRjBDXHU1RjUzXHU1MjREICR7dGhpcy5mb3JtYXRQZXJjZW50KCl9YCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoJ1x1NzdGRlx1NjczQVx1NURGMlx1NTA1Q1x1NkI2Mlx1RkYwQ1x1NzBCOVx1NTFGQlx1NUYwMFx1NTlDQlx1NjMxNlx1NzdGRicpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5lbHMuY3ljbGUpIHtcbiAgICAgIGNvbnN0IHNlY29uZHMgPSBNYXRoLm1heCgxLCBNYXRoLnJvdW5kKHRoaXMuaW50ZXJ2YWxNcyAvIDEwMDApKTtcbiAgICAgIHRoaXMuZWxzLmN5Y2xlLnRleHRDb250ZW50ID0gYCR7c2Vjb25kc31zYDtcbiAgICB9XG4gICAgaWYgKHRoaXMuZWxzLnN0YXR1c1RhZykge1xuICAgICAgY29uc3QgZWwgPSB0aGlzLmVscy5zdGF0dXNUYWcgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICBlbC5pbm5lckhUTUwgPSAnJztcbiAgICAgIGNvbnN0IGljbyA9IHRoaXMuaXNDb2xsYXBzZWQgPyAnY2xvc2UnIDogKHRoaXMuaXNNaW5pbmcgPyAnYm9sdCcgOiAnY2xvY2snKTtcbiAgICAgIHRyeSB7IGVsLmFwcGVuZENoaWxkKHJlbmRlckljb24oaWNvIGFzIGFueSwgeyBzaXplOiAxNiB9KSk7IH0gY2F0Y2gge31cbiAgICAgIGVsLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRoaXMuaXNDb2xsYXBzZWQgPyAnXHU1NzREXHU1ODRDJyA6ICh0aGlzLmlzTWluaW5nID8gJ1x1OEZEMFx1ODg0Q1x1NEUyRCcgOiAnXHU1Rjg1XHU2NzNBJykpKTtcbiAgICB9XG4gICAgdGhpcy51cGRhdGVDb250cm9scygpO1xuICB9XG5cbiAgcHJpdmF0ZSBiZWdpbkNvbGxhcHNlQ291bnRkb3duKHNlY29uZHM6IG51bWJlcikge1xuICAgIHRoaXMuY2xlYXJDb2xsYXBzZVRpbWVyKCk7XG4gICAgdGhpcy5pc0NvbGxhcHNlZCA9IHRydWU7XG4gICAgdGhpcy5jb2xsYXBzZVJlbWFpbmluZyA9IE1hdGgubWF4KDAsIE1hdGguZmxvb3Ioc2Vjb25kcykpO1xuICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZShgXHU3N0ZGXHU5MDUzXHU1NzREXHU1ODRDXHVGRjBDXHU1MjY5XHU0RjU5ICR7dGhpcy5jb2xsYXBzZVJlbWFpbmluZ31zYCk7XG4gICAgdGhpcy51cGRhdGVDb250cm9scygpO1xuICAgIHRoaXMuY29sbGFwc2VUaW1lciA9IHdpbmRvdy5zZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICB0aGlzLmNvbGxhcHNlUmVtYWluaW5nID0gTWF0aC5tYXgoMCwgdGhpcy5jb2xsYXBzZVJlbWFpbmluZyAtIDEpO1xuICAgICAgaWYgKHRoaXMuY29sbGFwc2VSZW1haW5pbmcgPD0gMCkge1xuICAgICAgICB0aGlzLmNsZWFyQ29sbGFwc2VUaW1lcigpO1xuICAgICAgICB0aGlzLmlzQ29sbGFwc2VkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZSgnXHU1NzREXHU1ODRDXHU4OUUzXHU5NjY0XHVGRjBDXHU1M0VGXHU5MUNEXHU2NUIwXHU1NDJGXHU1MkE4XHU3N0ZGXHU2NzNBJyk7XG4gICAgICAgIHRoaXMudXBkYXRlQ29udHJvbHMoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZShgXHU3N0ZGXHU5MDUzXHU1NzREXHU1ODRDXHVGRjBDXHU1MjY5XHU0RjU5ICR7dGhpcy5jb2xsYXBzZVJlbWFpbmluZ31zYCk7XG4gICAgICB9XG4gICAgfSwgMTAwMCk7XG4gIH1cblxuICBwcml2YXRlIGNsZWFyQ29sbGFwc2VUaW1lcigpIHtcbiAgICBpZiAodGhpcy5jb2xsYXBzZVRpbWVyICE9PSBudWxsKSB7XG4gICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aGlzLmNvbGxhcHNlVGltZXIpO1xuICAgICAgdGhpcy5jb2xsYXBzZVRpbWVyID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZVByb2dyZXNzKCkge1xuICAgIGlmICghdGhpcy5lbHMuZmlsbCB8fCAhdGhpcy5lbHMucGVyY2VudCkgcmV0dXJuO1xuICAgIGNvbnN0IHBjdCA9IHRoaXMuY2FydENhcCA+IDAgPyBNYXRoLm1pbigxLCB0aGlzLmNhcnRBbXQgLyB0aGlzLmNhcnRDYXApIDogMDtcbiAgICB0aGlzLmVscy5maWxsLnN0eWxlLndpZHRoID0gYCR7TWF0aC5yb3VuZChwY3QgKiAxMDApfSVgO1xuICAgIHRoaXMuZWxzLnBlcmNlbnQudGV4dENvbnRlbnQgPSBgJHtNYXRoLnJvdW5kKHBjdCAqIDEwMCl9JWA7XG4gICAgaWYgKHRoaXMuZWxzLnJpbmcpIHtcbiAgICAgIGNvbnN0IGRlZyA9IE1hdGgucm91bmQocGN0ICogMzYwKTtcbiAgICAgICh0aGlzLmVscy5yaW5nIGFzIEhUTUxFbGVtZW50KS5zdHlsZS5iYWNrZ3JvdW5kID0gYGNvbmljLWdyYWRpZW50KCM3QjJDRjUgJHtkZWd9ZGVnLCByZ2JhKDI1NSwyNTUsMjU1LC4wOCkgMGRlZylgO1xuICAgIH1cbiAgICBpZiAodGhpcy5lbHMucmluZ1BjdCkgdGhpcy5lbHMucmluZ1BjdC50ZXh0Q29udGVudCA9IGAke01hdGgucm91bmQocGN0ICogMTAwKX0lYDtcbiAgICBpZiAodGhpcy5wZW5kaW5nICE9PSAnY29sbGVjdCcgJiYgdGhpcy5lbHMuY29sbGVjdCkge1xuICAgICAgdGhpcy5lbHMuY29sbGVjdC5kaXNhYmxlZCA9IHRoaXMucGVuZGluZyA9PT0gJ2NvbGxlY3QnIHx8IHRoaXMuY2FydEFtdCA8PSAwO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlQ29udHJvbHMoKSB7XG4gICAgY29uc3QgaXNCdXN5ID0gKGtleTogUGVuZGluZ0FjdGlvbikgPT4gdGhpcy5wZW5kaW5nID09PSBrZXk7XG4gICAgY29uc3Qgc2V0QnRuID0gKGJ0bjogSFRNTEJ1dHRvbkVsZW1lbnQgfCBudWxsLCBpY29uOiBhbnksIGxhYmVsOiBzdHJpbmcsIGRpc2FibGVkOiBib29sZWFuKSA9PiB7XG4gICAgICBpZiAoIWJ0bikgcmV0dXJuO1xuICAgICAgYnRuLmRpc2FibGVkID0gZGlzYWJsZWQ7XG4gICAgICAvLyBrZWVwIGZpcnN0IGNoaWxkIGFzIGljb24gaWYgcHJlc2VudCwgb3RoZXJ3aXNlIGNyZWF0ZVxuICAgICAgbGV0IGljb25Ib3N0ID0gYnRuLnF1ZXJ5U2VsZWN0b3IoJy5pY29uJyk7XG4gICAgICBpZiAoIWljb25Ib3N0KSB7XG4gICAgICAgIGJ0bi5pbnNlcnRCZWZvcmUocmVuZGVySWNvbihpY29uLCB7IHNpemU6IDE4IH0pLCBidG4uZmlyc3RDaGlsZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBSZXBsYWNlIGV4aXN0aW5nIGljb24gd2l0aCBuZXcgb25lIGlmIGljb24gbmFtZSBkaWZmZXJzIGJ5IHJlLXJlbmRlcmluZ1xuICAgICAgICBjb25zdCBob3N0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICBob3N0LmFwcGVuZENoaWxkKHJlbmRlckljb24oaWNvbiwgeyBzaXplOiAxOCB9KSk7XG4gICAgICAgIC8vIHJlbW92ZSBvbGQgaWNvbiB3cmFwcGVyIGFuZCB1c2UgbmV3XG4gICAgICAgIGljb25Ib3N0LnBhcmVudEVsZW1lbnQ/LnJlcGxhY2VDaGlsZChob3N0LmZpcnN0Q2hpbGQgYXMgTm9kZSwgaWNvbkhvc3QpO1xuICAgICAgfVxuICAgICAgLy8gc2V0IGxhYmVsIHRleHQgKHByZXNlcnZlIGljb24pXG4gICAgICAvLyByZW1vdmUgZXhpc3RpbmcgdGV4dCBub2Rlc1xuICAgICAgQXJyYXkuZnJvbShidG4uY2hpbGROb2RlcykuZm9yRWFjaCgobiwgaWR4KSA9PiB7XG4gICAgICAgIGlmIChpZHggPiAwKSBidG4ucmVtb3ZlQ2hpbGQobik7XG4gICAgICB9KTtcbiAgICAgIGJ0bi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShsYWJlbCkpO1xuICAgIH07XG5cbiAgICBzZXRCdG4odGhpcy5lbHMuc3RhcnQsICdwbGF5JywgaXNCdXN5KCdzdGFydCcpID8gJ1x1NTQyRlx1NTJBOFx1NEUyRFx1MjAyNicgOiB0aGlzLmlzTWluaW5nID8gJ1x1NjMxNlx1NzdGRlx1NEUyRCcgOiAnXHU1RjAwXHU1OUNCXHU2MzE2XHU3N0ZGJywgaXNCdXN5KCdzdGFydCcpIHx8IHRoaXMuaXNNaW5pbmcgfHwgdGhpcy5pc0NvbGxhcHNlZCk7XG4gICAgc2V0QnRuKHRoaXMuZWxzLnN0b3AsICdzdG9wJywgaXNCdXN5KCdzdG9wJykgPyAnXHU1MDVDXHU2QjYyXHU0RTJEXHUyMDI2JyA6ICdcdTUwNUNcdTZCNjInLCBpc0J1c3koJ3N0b3AnKSB8fCAhdGhpcy5pc01pbmluZyk7XG4gICAgc2V0QnRuKHRoaXMuZWxzLmNvbGxlY3QsICdjb2xsZWN0JywgaXNCdXN5KCdjb2xsZWN0JykgPyAnXHU2NTM2XHU5NkM2XHU0RTJEXHUyMDI2JyA6ICdcdTY1MzZcdTc3RkYnLCBpc0J1c3koJ2NvbGxlY3QnKSB8fCB0aGlzLmNhcnRBbXQgPD0gMCk7XG4gICAgc2V0QnRuKHRoaXMuZWxzLnJlcGFpciwgJ3dyZW5jaCcsIGlzQnVzeSgncmVwYWlyJykgPyAnXHU0RkVFXHU3NDA2XHU0RTJEXHUyMDI2JyA6ICdcdTRGRUVcdTc0MDYnLCBpc0J1c3koJ3JlcGFpcicpIHx8ICF0aGlzLmlzQ29sbGFwc2VkKTtcbiAgICBzZXRCdG4odGhpcy5lbHMuc3RhdHVzQnRuLCAncmVmcmVzaCcsIGlzQnVzeSgnc3RhdHVzJykgPyAnXHU1MjM3XHU2NUIwXHU0RTJEXHUyMDI2JyA6ICdcdTUyMzdcdTY1QjBcdTcyQjZcdTYwMDEnLCBpc0J1c3koJ3N0YXR1cycpKTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0U3RhdHVzTWVzc2FnZSh0ZXh0OiBzdHJpbmcpIHtcbiAgICBpZiAoIXRoaXMuZWxzLnN0YXR1c1RleHQpIHJldHVybjtcbiAgICB0aGlzLmVscy5zdGF0dXNUZXh0LnRleHRDb250ZW50ID0gdGV4dDtcbiAgfVxuXG4gIHByaXZhdGUgbG9nRXZlbnQobXNnOiBzdHJpbmcpIHtcbiAgICBpZiAoIXRoaXMuZWxzPy5ldmVudHMpIHJldHVybjtcbiAgICBjb25zdCBsaW5lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgbGluZS5jbGFzc05hbWUgPSAnZXZlbnQnO1xuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgY29uc3QgaGggPSBTdHJpbmcobm93LmdldEhvdXJzKCkpLnBhZFN0YXJ0KDIsJzAnKTtcbiAgICBjb25zdCBtbSA9IFN0cmluZyhub3cuZ2V0TWludXRlcygpKS5wYWRTdGFydCgyLCcwJyk7XG4gICAgY29uc3Qgc3MgPSBTdHJpbmcobm93LmdldFNlY29uZHMoKSkucGFkU3RhcnQoMiwnMCcpO1xuICAgIGxpbmUudGV4dENvbnRlbnQgPSBgWyR7aGh9OiR7bW19OiR7c3N9XSAke21zZ31gO1xuICAgIHRoaXMuZWxzLmV2ZW50cy5wcmVwZW5kKGxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBmb3JtYXRQZXJjZW50KCkge1xuICAgIGNvbnN0IHBjdCA9IHRoaXMuY2FydENhcCA+IDAgPyBNYXRoLm1pbigxLCB0aGlzLmNhcnRBbXQgLyB0aGlzLmNhcnRDYXApIDogMDtcbiAgICByZXR1cm4gYCR7TWF0aC5yb3VuZChwY3QgKiAxMDApfSVgO1xuICB9XG59XG4gICAgLy8gbW91bnQgaWNvbnNcbiAgICB0cnkge1xuICAgICAgdmlldy5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1pY29dJylcbiAgICAgICAgLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgICAgY29uc3QgbmFtZSA9IChlbCBhcyBIVE1MRWxlbWVudCkuZ2V0QXR0cmlidXRlKCdkYXRhLWljbycpIGFzIGFueTtcbiAgICAgICAgICB0cnkgeyBlbC5hcHBlbmRDaGlsZChyZW5kZXJJY29uKG5hbWUsIHsgc2l6ZTogMjAgfSkpOyB9IGNhdGNoIHt9XG4gICAgICAgIH0pO1xuICAgIH0gY2F0Y2gge31cbiIsICJpbXBvcnQgeyBOZXR3b3JrTWFuYWdlciB9IGZyb20gJy4uL2NvcmUvTmV0d29ya01hbmFnZXInO1xuaW1wb3J0IHsgaHRtbCwgcXMgfSBmcm9tICcuLi91dGlscy9kb20nO1xuaW1wb3J0IHsgcmVuZGVyTmF2IH0gZnJvbSAnLi4vY29tcG9uZW50cy9OYXYnO1xuaW1wb3J0IHsgUmVhbHRpbWVDbGllbnQgfSBmcm9tICcuLi9jb3JlL1JlYWx0aW1lQ2xpZW50JztcbmltcG9ydCB7IHJlbmRlclJlc291cmNlQmFyIH0gZnJvbSAnLi4vY29tcG9uZW50cy9SZXNvdXJjZUJhcic7XG5pbXBvcnQgeyBzaG93VG9hc3QgfSBmcm9tICcuLi9jb21wb25lbnRzL1RvYXN0JztcbmltcG9ydCB7IHJlbmRlckljb24gfSBmcm9tICcuLi9jb21wb25lbnRzL0ljb24nO1xuXG5leHBvcnQgY2xhc3MgV2FyZWhvdXNlU2NlbmUge1xuICBhc3luYyBtb3VudChyb290OiBIVE1MRWxlbWVudCkge1xuICAgIHJvb3QuaW5uZXJIVE1MID0gJyc7XG4gICAgcm9vdC5hcHBlbmRDaGlsZChyZW5kZXJOYXYoJ3dhcmVob3VzZScpKTtcbiAgICBjb25zdCBiYXIgPSByZW5kZXJSZXNvdXJjZUJhcigpO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQoYmFyLnJvb3QpO1xuXG4gICAgY29uc3QgdmlldyA9IGh0bWwoYFxuICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lciBncmlkLTJcIiBzdHlsZT1cImNvbG9yOiNmZmY7XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkIGZhZGUtaW5cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCIgc3R5bGU9XCJqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjthbGlnbi1pdGVtczpjZW50ZXI7XCI+XG4gICAgICAgICAgICA8aDMgc3R5bGU9XCJtYXJnaW46MDtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo4cHg7XCI+PHNwYW4gZGF0YS1pY289XCJ3YXJlaG91c2VcIj48L3NwYW4+XHU0RUQzXHU1RTkzPC9oMz5cbiAgICAgICAgICAgIDxidXR0b24gaWQ9XCJyZWZyZXNoXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIj48c3BhbiBkYXRhLWljbz1cInJlZnJlc2hcIj48L3NwYW4+XHU1MjM3XHU2NUIwPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBzdHlsZT1cIm1hcmdpbi10b3A6MTJweDtcIj5cbiAgICAgICAgICAgIDxkZXRhaWxzIG9wZW4+XG4gICAgICAgICAgICAgIDxzdW1tYXJ5PjxzcGFuIGRhdGEtaWNvPVwiYm94XCI+PC9zcGFuPlx1NjIxMVx1NzY4NFx1OTA1M1x1NTE3Nzwvc3VtbWFyeT5cbiAgICAgICAgICAgICAgPGRpdiBpZD1cImxpc3RcIiBzdHlsZT1cIm1hcmdpbi10b3A6OHB4O2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjhweDtcIj48L2Rpdj5cbiAgICAgICAgICAgIDwvZGV0YWlscz5cbiAgICAgICAgICAgIDxkZXRhaWxzPlxuICAgICAgICAgICAgICA8c3VtbWFyeT48c3BhbiBkYXRhLWljbz1cImxpc3RcIj48L3NwYW4+XHU5MDUzXHU1MTc3XHU2QTIxXHU2NzdGPC9zdW1tYXJ5PlxuICAgICAgICAgICAgICA8ZGl2IGlkPVwidHBsc1wiIHN0eWxlPVwibWFyZ2luLXRvcDo4cHg7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6OHB4O1wiPjwvZGl2PlxuICAgICAgICAgICAgPC9kZXRhaWxzPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIGApO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQodmlldyk7XG5cbiAgICBjb25zdCB0b2tlbiA9IChOZXR3b3JrTWFuYWdlciBhcyBhbnkpLklbJ3Rva2VuJ107XG4gICAgaWYgKHRva2VuKSBSZWFsdGltZUNsaWVudC5JLmNvbm5lY3QodG9rZW4pO1xuXG4gICAgY29uc3QgbGlzdCA9IHFzKHZpZXcsICcjbGlzdCcpO1xuICAgIGNvbnN0IHRwbENvbnRhaW5lciA9IHFzKHZpZXcsICcjdHBscycpO1xuICAgIGNvbnN0IHJlZnJlc2hCdG4gPSBxczxIVE1MQnV0dG9uRWxlbWVudD4odmlldywgJyNyZWZyZXNoJyk7XG5cbiAgICBjb25zdCBtb3VudEljb25zID0gKHJvb3RFbDogRWxlbWVudCkgPT4ge1xuICAgICAgcm9vdEVsLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWljb10nKVxuICAgICAgICAuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgICBjb25zdCBuYW1lID0gKGVsIGFzIEhUTUxFbGVtZW50KS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWNvJykgYXMgYW55O1xuICAgICAgICAgIHRyeSB7IGVsLmFwcGVuZENoaWxkKHJlbmRlckljb24obmFtZSwgeyBzaXplOiAyMCB9KSk7IH0gY2F0Y2gge31cbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBtb3VudEljb25zKHZpZXcpO1xuXG4gICAgY29uc3QgZ2V0UmFyaXR5ID0gKGl0ZW06IGFueSwgdHBsPzogYW55KTogeyBrZXk6ICdjb21tb24nfCdyYXJlJ3wnZXBpYyd8J2xlZ2VuZGFyeSc7IHRleHQ6IHN0cmluZyB9ID0+IHtcbiAgICAgIGNvbnN0IHIgPSAodHBsICYmICh0cGwucmFyaXR5IHx8IHRwbC50aWVyKSkgfHwgaXRlbS5yYXJpdHk7XG4gICAgICBjb25zdCBsZXZlbCA9IE51bWJlcihpdGVtLmxldmVsKSB8fCAwO1xuICAgICAgaWYgKHR5cGVvZiByID09PSAnc3RyaW5nJykge1xuICAgICAgICBjb25zdCBrID0gci50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBpZiAoWydsZWdlbmRhcnknLCdlcGljJywncmFyZScsJ2NvbW1vbiddLmluY2x1ZGVzKGspKSB7XG4gICAgICAgICAgcmV0dXJuIHsga2V5OiBrIGFzIGFueSwgdGV4dDogayA9PT0gJ2xlZ2VuZGFyeScgPyAnXHU0RjIwXHU4QkY0JyA6IGsgPT09ICdlcGljJyA/ICdcdTUzRjJcdThCRDcnIDogayA9PT0gJ3JhcmUnID8gJ1x1N0EwMFx1NjcwOScgOiAnXHU2NjZFXHU5MDFBJyB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobGV2ZWwgPj0gMTIpIHJldHVybiB7IGtleTogJ2xlZ2VuZGFyeScsIHRleHQ6ICdcdTRGMjBcdThCRjQnIH07XG4gICAgICBpZiAobGV2ZWwgPj0gOCkgcmV0dXJuIHsga2V5OiAnZXBpYycsIHRleHQ6ICdcdTUzRjJcdThCRDcnIH07XG4gICAgICBpZiAobGV2ZWwgPj0gNCkgcmV0dXJuIHsga2V5OiAncmFyZScsIHRleHQ6ICdcdTdBMDBcdTY3MDknIH07XG4gICAgICByZXR1cm4geyBrZXk6ICdjb21tb24nLCB0ZXh0OiAnXHU2NjZFXHU5MDFBJyB9O1xuICAgIH07XG5cbiAgICBjb25zdCBmb3JtYXRUaW1lID0gKHRzOiBudW1iZXIpID0+IHtcbiAgICAgIHRyeSB7IHJldHVybiBuZXcgRGF0ZSh0cykudG9Mb2NhbGVTdHJpbmcoKTsgfSBjYXRjaCB7IHJldHVybiAnJyArIHRzOyB9XG4gICAgfTtcblxuICAgIGNvbnN0IGxvYWQgPSBhc3luYyAoKSA9PiB7XG4gICAgICByZWZyZXNoQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIHJlZnJlc2hCdG4uaW5uZXJIVE1MID0gJzxzcGFuIGRhdGEtaWNvPVwicmVmcmVzaFwiPjwvc3Bhbj5cdTUyMzdcdTY1QjBcdTRFMkRcdTIwMjYnO1xuICAgICAgbW91bnRJY29ucyhyZWZyZXNoQnRuKTtcbiAgICAgIGF3YWl0IGJhci51cGRhdGUoKTtcbiAgICAgIGxpc3QuaW5uZXJIVE1MID0gJyc7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykgbGlzdC5hcHBlbmRDaGlsZChodG1sKCc8ZGl2IGNsYXNzPVwic2tlbGV0b25cIj48L2Rpdj4nKSk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBbZGF0YSwgdHBsc10gPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgICAgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgaXRlbXM6IGFueVtdIH0+KCcvaXRlbXMnKSxcbiAgICAgICAgICBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyB0ZW1wbGF0ZXM6IGFueVtdIH0+KCcvaXRlbXMvdGVtcGxhdGVzJykuY2F0Y2goKCkgPT4gKHsgdGVtcGxhdGVzOiBbXSB9KSlcbiAgICAgICAgXSk7XG4gICAgICAgIGNvbnN0IHRwbEJ5SWQ6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcbiAgICAgICAgZm9yIChjb25zdCB0IG9mICh0cGxzLnRlbXBsYXRlcyB8fCBbXSkpIHRwbEJ5SWRbdC5pZF0gPSB0O1xuICAgICAgICBsaXN0LmlubmVySFRNTCA9ICcnO1xuICAgICAgICBpZiAoIWRhdGEuaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgbGlzdC5hcHBlbmRDaGlsZChodG1sKCc8ZGl2IHN0eWxlPVwib3BhY2l0eTouODtcIj5cdTY2ODJcdTY1RTBcdTkwNTNcdTUxNzdcdUZGMENcdTVDMURcdThCRDVcdTU5MUFcdTYzMTZcdTc3RkZcdTYyMTZcdTYzQTBcdTU5M0FcdTRFRTVcdTgzQjdcdTUzRDZcdTY2RjRcdTU5MUFcdThENDRcdTZFOTA8L2Rpdj4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGRhdGEuaXRlbXMpIHtcbiAgICAgICAgICBjb25zdCB0cGwgPSB0cGxCeUlkW2l0ZW0udGVtcGxhdGVJZF07XG4gICAgICAgICAgY29uc3QgcmFyaXR5ID0gZ2V0UmFyaXR5KGl0ZW0sIHRwbCk7XG4gICAgICAgICAgY29uc3QgbmFtZSA9ICh0cGwgJiYgKHRwbC5uYW1lIHx8IHRwbC5pZCkpIHx8IGl0ZW0udGVtcGxhdGVJZDtcblxuICAgICAgICAgIGNvbnN0IHJvdyA9IGh0bWwoYFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIml0ZW0tY2FyZCBob3Zlci1saWZ0ICR7XG4gICAgICAgICAgICAgIHJhcml0eS5rZXkgPT09ICdsZWdlbmRhcnknID8gJ3Jhcml0eS1vdXRsaW5lLWxlZ2VuZGFyeScgOiByYXJpdHkua2V5ID09PSAnZXBpYycgPyAncmFyaXR5LW91dGxpbmUtZXBpYycgOiByYXJpdHkua2V5ID09PSAncmFyZScgPyAncmFyaXR5LW91dGxpbmUtcmFyZScgOiAncmFyaXR5LW91dGxpbmUtY29tbW9uJ1xuICAgICAgICAgICAgfVwiIGRhdGEtcmFyaXR5PVwiJHtyYXJpdHkua2V5fVwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCIgc3R5bGU9XCJqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjthbGlnbi1pdGVtczpmbGV4LXN0YXJ0O2dhcDoxMHB4O1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDo0cHg7ZmxleDoxO21pbi13aWR0aDowO1wiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cImRpc3BsYXk6ZmxleDtmbGV4LXdyYXA6d3JhcDtnYXA6NnB4O2FsaWduLWl0ZW1zOmNlbnRlcjtcIj5cbiAgICAgICAgICAgICAgICAgICAgPHN0cm9uZyBzdHlsZT1cImZvbnQtc2l6ZToxNXB4O3doaXRlLXNwYWNlOm5vd3JhcDtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo2cHg7XCI+PHNwYW4gZGF0YS1pY289XCJvcmVcIj48L3NwYW4+JHtuYW1lfTwvc3Ryb25nPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImJhZGdlIHJhcml0eS0ke3Jhcml0eS5rZXl9XCI+PGk+PC9pPiR7cmFyaXR5LnRleHR9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAke2l0ZW0uaXNFcXVpcHBlZCA/ICc8c3BhbiBjbGFzcz1cInBpbGxcIj5cdTVERjJcdTg4QzVcdTU5MDc8L3NwYW4+JyA6ICcnfVxuICAgICAgICAgICAgICAgICAgICAke2l0ZW0uaXNMaXN0ZWQgPyAnPHNwYW4gY2xhc3M9XCJwaWxsXCI+XHU2MzAyXHU1MzU1XHU0RTJEPC9zcGFuPicgOiAnJ31cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cIm9wYWNpdHk6Ljg1O2Rpc3BsYXk6ZmxleDtmbGV4LXdyYXA6d3JhcDtnYXA6OHB4O1wiPlxuICAgICAgICAgICAgICAgICAgICA8c3Bhbj5cdTdCNDlcdTdFQTcgTHYuJHtpdGVtLmxldmVsfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwaWxsXCI+XHU1QjlFXHU0RjhCICR7aXRlbS5pZH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICR7dHBsPy5jYXRlZ29yeSA/IGA8c3BhbiBjbGFzcz1cInBpbGxcIj4ke3RwbC5jYXRlZ29yeX08L3NwYW4+YCA6ICcnfVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFjdGlvbnNcIj5cbiAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLWJ1eVwiIGRhdGEtYWN0PVwiZXF1aXBcIiBkYXRhLWlkPVwiJHtpdGVtLmlkfVwiICR7aXRlbS5pc0VxdWlwcGVkID8gJ2Rpc2FibGVkJyA6ICcnfT48c3BhbiBkYXRhLWljbz1cInNoaWVsZFwiPjwvc3Bhbj5cdTg4QzVcdTU5MDc8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIiBkYXRhLWFjdD1cInVwZ3JhZGVcIiBkYXRhLWlkPVwiJHtpdGVtLmlkfVwiPjxzcGFuIGRhdGEtaWNvPVwid3JlbmNoXCI+PC9zcGFuPlx1NTM0N1x1N0VBNzwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tZ2hvc3RcIiBkYXRhLWFjdD1cInRvZ2dsZVwiIGRhdGEtaWQ9XCIke2l0ZW0uaWR9XCI+PHNwYW4gZGF0YS1pY289XCJsaXN0XCI+PC9zcGFuPlx1OEJFNlx1NjBDNTwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRpbWVsaW5lXCIgaWQ9XCJ0bC0ke2l0ZW0uaWR9XCIgaGlkZGVuPjwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgYCk7XG4gICAgICAgICAgbW91bnRJY29ucyhyb3cpO1xuICAgICAgICAgIHJvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIChldikgPT4ge1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gZXYudGFyZ2V0IGFzIEhUTUxCdXR0b25FbGVtZW50O1xuICAgICAgICAgICAgY29uc3QgaWQgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWlkJyk7XG4gICAgICAgICAgICBjb25zdCBhY3QgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWFjdCcpO1xuICAgICAgICAgICAgaWYgKCFpZCB8fCAhYWN0KSByZXR1cm47XG4gICAgICAgICAgICBpZiAoYWN0ID09PSAndG9nZ2xlJykge1xuICAgICAgICAgICAgICBjb25zdCBib3ggPSByb3cucXVlcnlTZWxlY3RvcihgI3RsLSR7aWR9YCkgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgICAgICAgIGlmICghYm94KSByZXR1cm47XG4gICAgICAgICAgICAgIGlmICghYm94Lmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgICAgICAgICAgIGJveC5pbm5lckhUTUwgPSAnPGRpdiBjbGFzcz1cInNrZWxldG9uXCIgc3R5bGU9XCJoZWlnaHQ6MzZweDtcIj48L2Rpdj4nO1xuICAgICAgICAgICAgICAgIGJveC5oaWRkZW4gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgbG9nczogeyB0eXBlOiBzdHJpbmc7IGRlc2M/OiBzdHJpbmc7IHRpbWU6IG51bWJlciB9W10gfT4oYC9pdGVtcy9sb2dzP2l0ZW1JZD0ke2lkfWApO1xuICAgICAgICAgICAgICAgICAgY29uc3QgbG9ncyA9IEFycmF5LmlzQXJyYXkocmVzLmxvZ3MpID8gcmVzLmxvZ3MgOiBbXTtcbiAgICAgICAgICAgICAgICAgIGJveC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICAgICAgICAgIGlmICghbG9ncy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgYm94LmlubmVySFRNTCA9ICc8ZGl2IHN0eWxlPVwib3BhY2l0eTouODtcIj5cdTY2ODJcdTY1RTBcdTUzODZcdTUzRjJcdTY1NzBcdTYzNkU8L2Rpdj4nO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBsb2cgb2YgbG9ncykge1xuICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBodG1sKGBcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0aW1lbGluZS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkb3RcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRpbWVcIj4ke2Zvcm1hdFRpbWUobG9nLnRpbWUpfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGVzY1wiPiR7KGxvZy5kZXNjIHx8IGxvZy50eXBlIHx8ICcnKS5yZXBsYWNlKC88L2csJyZsdDsnKX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIGApO1xuICAgICAgICAgICAgICAgICAgICAgIGJveC5hcHBlbmRDaGlsZChub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgICAgICAgICAgYm94LmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgICAgICAgYm94LmFwcGVuZENoaWxkKGh0bWwoYFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGltZWxpbmUtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkb3RcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGltZVwiPlx1MjAxNDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkZXNjXCI+XHU2NzY1XHU2RTkwXHU2NzJBXHU3N0U1IFx1MDBCNyBcdTUzRUZcdTkwMUFcdThGQzdcdTYzMTZcdTc3RkZcdTMwMDFcdTYzQTBcdTU5M0FcdTYyMTZcdTRFQTRcdTY2MTNcdTgzQjdcdTUzRDY8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICBgKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGJveC5oaWRkZW4gPSAhYm94LmhpZGRlbjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICB0YXJnZXQuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICB0YXJnZXQuaW5uZXJIVE1MID0gYWN0ID09PSAnZXF1aXAnID8gJzxzcGFuIGRhdGEtaWNvPVwic2hpZWxkXCI+PC9zcGFuPlx1ODhDNVx1NTkwN1x1NEUyRFx1MjAyNicgOiAnPHNwYW4gZGF0YS1pY289XCJ3cmVuY2hcIj48L3NwYW4+XHU1MzQ3XHU3RUE3XHU0RTJEXHUyMDI2JztcbiAgICAgICAgICAgICAgbW91bnRJY29ucyh0YXJnZXQpO1xuICAgICAgICAgICAgICBpZiAoYWN0ID09PSAnZXF1aXAnKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0KCcvaXRlbXMvZXF1aXAnLCB7IG1ldGhvZDogJ1BPU1QnLCBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGl0ZW1JZDogaWQgfSkgfSk7XG4gICAgICAgICAgICAgICAgc2hvd1RvYXN0KCdcdTg4QzVcdTU5MDdcdTYyMTBcdTUyOUYnKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChhY3QgPT09ICd1cGdyYWRlJykge1xuICAgICAgICAgICAgICAgIGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdCgnL2l0ZW1zL3VwZ3JhZGUnLCB7IG1ldGhvZDogJ1BPU1QnLCBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGl0ZW1JZDogaWQgfSkgfSk7XG4gICAgICAgICAgICAgICAgc2hvd1RvYXN0KCdcdTUzNDdcdTdFQTdcdTYyMTBcdTUyOUYnKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBhd2FpdCBsb2FkKCk7XG4gICAgICAgICAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgICAgICAgICAgc2hvd1RvYXN0KGU/Lm1lc3NhZ2UgfHwgJ1x1NjRDRFx1NEY1Q1x1NTkzMVx1OEQyNScpO1xuICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgY29uc3QgYSA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtYWN0Jyk7XG4gICAgICAgICAgICAgIGlmIChhID09PSAnZXF1aXAnKSB0YXJnZXQuaW5uZXJIVE1MID0gJzxzcGFuIGRhdGEtaWNvPVwic2hpZWxkXCI+PC9zcGFuPlx1ODhDNVx1NTkwNyc7XG4gICAgICAgICAgICAgIGVsc2UgaWYgKGEgPT09ICd1cGdyYWRlJykgdGFyZ2V0LmlubmVySFRNTCA9ICc8c3BhbiBkYXRhLWljbz1cIndyZW5jaFwiPjwvc3Bhbj5cdTUzNDdcdTdFQTcnO1xuICAgICAgICAgICAgICBlbHNlIHRhcmdldC5pbm5lckhUTUwgPSAnPHNwYW4gZGF0YS1pY289XCJsaXN0XCI+PC9zcGFuPlx1OEJFNlx1NjBDNSc7XG4gICAgICAgICAgICAgIG1vdW50SWNvbnModGFyZ2V0KTtcbiAgICAgICAgICAgICAgdGFyZ2V0LmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgbGlzdC5hcHBlbmRDaGlsZChyb3cpO1xuICAgICAgICB9XG5cbiAgICAgICAgdHBsQ29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuICAgICAgICBmb3IgKGNvbnN0IHRwbCBvZiAodHBscy50ZW1wbGF0ZXMgfHwgW10pKSB7XG4gICAgICAgICAgY29uc3Qgcm93ID0gaHRtbChgPGRpdiBjbGFzcz1cImxpc3QtaXRlbVwiPjxzdHJvbmc+JHt0cGwubmFtZSB8fCB0cGwuaWR9PC9zdHJvbmc+IFx1MDBCNyAke3RwbC5jYXRlZ29yeSB8fCAnXHU2NzJBXHU3N0U1XHU3QzdCXHU1NzhCJ308L2Rpdj5gKTtcbiAgICAgICAgICB0cGxDb250YWluZXIuYXBwZW5kQ2hpbGQocm93KTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgIHNob3dUb2FzdChlPy5tZXNzYWdlIHx8ICdcdTUyQTBcdThGN0RcdTRFRDNcdTVFOTNcdTU5MzFcdThEMjUnKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHJlZnJlc2hCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgcmVmcmVzaEJ0bi5pbm5lckhUTUwgPSAnPHNwYW4gZGF0YS1pY289XCJyZWZyZXNoXCI+PC9zcGFuPlx1NTIzN1x1NjVCMCc7XG4gICAgICAgIG1vdW50SWNvbnMocmVmcmVzaEJ0bik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJlZnJlc2hCdG4ub25jbGljayA9ICgpID0+IGxvYWQoKTtcbiAgICBhd2FpdCBsb2FkKCk7XG4gIH1cbn1cbiIsICJpbXBvcnQgeyBOZXR3b3JrTWFuYWdlciB9IGZyb20gJy4uL2NvcmUvTmV0d29ya01hbmFnZXInO1xuaW1wb3J0IHsgaHRtbCwgcXMgfSBmcm9tICcuLi91dGlscy9kb20nO1xuaW1wb3J0IHsgcmVuZGVyTmF2IH0gZnJvbSAnLi4vY29tcG9uZW50cy9OYXYnO1xuaW1wb3J0IHsgUmVhbHRpbWVDbGllbnQgfSBmcm9tICcuLi9jb3JlL1JlYWx0aW1lQ2xpZW50JztcbmltcG9ydCB7IHNob3dUb2FzdCB9IGZyb20gJy4uL2NvbXBvbmVudHMvVG9hc3QnO1xuaW1wb3J0IHsgcmVuZGVyUmVzb3VyY2VCYXIgfSBmcm9tICcuLi9jb21wb25lbnRzL1Jlc291cmNlQmFyJztcbmltcG9ydCB7IHJlbmRlckljb24gfSBmcm9tICcuLi9jb21wb25lbnRzL0ljb24nO1xuXG5leHBvcnQgY2xhc3MgUGx1bmRlclNjZW5lIHtcbiAgcHJpdmF0ZSByZXN1bHRCb3g6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG5cbiAgbW91bnQocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICByb290LmlubmVySFRNTCA9ICcnO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQocmVuZGVyTmF2KCdwbHVuZGVyJykpO1xuICAgIGNvbnN0IGJhciA9IHJlbmRlclJlc291cmNlQmFyKCk7XG4gICAgcm9vdC5hcHBlbmRDaGlsZChiYXIucm9vdCk7XG5cbiAgICBjb25zdCB2aWV3ID0gaHRtbChgXG4gICAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyIGdyaWQtMlwiIHN0eWxlPVwiY29sb3I6I2ZmZjtcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQgZmFkZS1pblwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIiBzdHlsZT1cImp1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2FsaWduLWl0ZW1zOmNlbnRlcjtcIj5cbiAgICAgICAgICAgIDxoMyBzdHlsZT1cIm1hcmdpbjowO2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjhweDtcIj48c3BhbiBkYXRhLWljbz1cInN3b3JkXCI+PC9zcGFuPlx1NjNBMFx1NTkzQVx1NzZFRVx1NjgwNzwvaDM+XG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwicmVmcmVzaFwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCI+PHNwYW4gZGF0YS1pY289XCJyZWZyZXNoXCI+PC9zcGFuPlx1NTIzN1x1NjVCMDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgaWQ9XCJsaXN0XCIgc3R5bGU9XCJtYXJnaW4tdG9wOjEycHg7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6OHB4O1wiPjwvZGl2PlxuICAgICAgICAgIDxkaXYgaWQ9XCJyZXN1bHRcIiBzdHlsZT1cIm1hcmdpbi10b3A6MTJweDtvcGFjaXR5Oi45O2ZvbnQtZmFtaWx5Om1vbm9zcGFjZTtcIj48L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICBgKTtcbiAgICByb290LmFwcGVuZENoaWxkKHZpZXcpO1xuXG4gICAgY29uc3QgdG9rZW4gPSAoTmV0d29ya01hbmFnZXIgYXMgYW55KS5JWyd0b2tlbiddO1xuICAgIGlmICh0b2tlbikgUmVhbHRpbWVDbGllbnQuSS5jb25uZWN0KHRva2VuKTtcblxuICAgIFJlYWx0aW1lQ2xpZW50Lkkub24oJ3BsdW5kZXIuYXR0YWNrZWQnLCAobXNnKSA9PiB7XG4gICAgICBzaG93VG9hc3QoYFx1ODhBQlx1NjNBMFx1NTkzQVx1RkYxQVx1Njc2NVx1ODFFQSAke21zZy5hdHRhY2tlcn1cdUZGMENcdTYzNUZcdTU5MzEgJHttc2cubG9zc31gKTtcbiAgICAgIHRoaXMubG9nKGBcdTg4QUIgJHttc2cuYXR0YWNrZXJ9IFx1NjNBMFx1NTkzQVx1RkYwQ1x1NjM1Rlx1NTkzMSAke21zZy5sb3NzfWApO1xuICAgIH0pO1xuICAgIHRoaXMucmVzdWx0Qm94ID0gcXModmlldywgJyNyZXN1bHQnKTtcblxuICAgIGNvbnN0IGxpc3QgPSBxcyh2aWV3LCAnI2xpc3QnKTtcbiAgICBjb25zdCByZWZyZXNoQnRuID0gcXM8SFRNTEJ1dHRvbkVsZW1lbnQ+KHZpZXcsICcjcmVmcmVzaCcpO1xuICAgIGNvbnN0IG1vdW50SWNvbnMgPSAocm9vdEVsOiBFbGVtZW50KSA9PiB7XG4gICAgICByb290RWwucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtaWNvXScpXG4gICAgICAgIC5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICAgIGNvbnN0IG5hbWUgPSAoZWwgYXMgSFRNTEVsZW1lbnQpLmdldEF0dHJpYnV0ZSgnZGF0YS1pY28nKSBhcyBhbnk7XG4gICAgICAgICAgdHJ5IHsgZWwuYXBwZW5kQ2hpbGQocmVuZGVySWNvbihuYW1lLCB7IHNpemU6IDIwIH0pKTsgfSBjYXRjaCB7fVxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIG1vdW50SWNvbnModmlldyk7XG5cbiAgICBjb25zdCBsb2FkID0gYXN5bmMgKCkgPT4ge1xuICAgICAgcmVmcmVzaEJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICByZWZyZXNoQnRuLmlubmVySFRNTCA9ICc8c3BhbiBkYXRhLWljbz1cInJlZnJlc2hcIj48L3NwYW4+XHU1MjM3XHU2NUIwXHU0RTJEXHUyMDI2JztcbiAgICAgIG1vdW50SWNvbnMocmVmcmVzaEJ0bik7XG4gICAgICBhd2FpdCBiYXIudXBkYXRlKCk7XG4gICAgICBsaXN0LmlubmVySFRNTCA9ICcnO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIGxpc3QuYXBwZW5kQ2hpbGQoaHRtbCgnPGRpdiBjbGFzcz1cInNrZWxldG9uXCI+PC9kaXY+JykpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IHRhcmdldHM6IGFueVtdIH0+KCcvcGx1bmRlci90YXJnZXRzJyk7XG4gICAgICAgIGxpc3QuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIGlmICghZGF0YS50YXJnZXRzLmxlbmd0aCkge1xuICAgICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQoaHRtbCgnPGRpdiBzdHlsZT1cIm9wYWNpdHk6Ljg7XCI+XHU2NjgyXHU2NUUwXHU1M0VGXHU2M0EwXHU1OTNBXHU3Njg0XHU3NkVFXHU2ODA3XHVGRjBDXHU3QTBEXHU1NDBFXHU1MThEXHU4QkQ1PC9kaXY+JykpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgdGFyZ2V0IG9mIGRhdGEudGFyZ2V0cykge1xuICAgICAgICAgIGNvbnN0IHJvdyA9IGh0bWwoYFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxpc3QtaXRlbSBsaXN0LWl0ZW0tLXNlbGxcIj5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cImRpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjJweDtcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NnB4O1wiPjxzcGFuIGRhdGEtaWNvPVwidGFyZ2V0XCI+PC9zcGFuPjxzdHJvbmc+JHt0YXJnZXQudXNlcm5hbWUgfHwgdGFyZ2V0LmlkfTwvc3Ryb25nPjwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJvcGFjaXR5Oi44NTtcIj5cdTc3RkZcdTc3RjNcdUZGMUEke3RhcmdldC5vcmV9IDxzcGFuIGNsYXNzPVwicGlsbFwiPlx1OTg4NFx1OEJBMVx1NjUzNlx1NzZDQSA1JX4zMCU8L3NwYW4+PC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLXNlbGxcIiBkYXRhLWlkPVwiJHt0YXJnZXQuaWR9XCI+PHNwYW4gZGF0YS1pY289XCJzd29yZFwiPjwvc3Bhbj5cdTYzQTBcdTU5M0E8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICBgKTtcbiAgICAgICAgICBtb3VudEljb25zKHJvdyk7XG4gICAgICAgICAgcm93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKGV2KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBlbCA9IGV2LnRhcmdldCBhcyBIVE1MQnV0dG9uRWxlbWVudDtcbiAgICAgICAgICAgIGNvbnN0IGlkID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWlkJyk7XG4gICAgICAgICAgICBpZiAoIWlkKSByZXR1cm47XG4gICAgICAgICAgICBlbC5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgICBjb25zdCBvcmlnaW5hbCA9IGVsLnRleHRDb250ZW50IHx8ICcnO1xuICAgICAgICAgICAgZWwudGV4dENvbnRlbnQgPSAnXHU2M0EwXHU1OTNBXHU0RTJEXHUyMDI2JztcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IHN1Y2Nlc3M6IGJvb2xlYW47IGxvb3RfYW1vdW50OiBudW1iZXIgfT4oYC9wbHVuZGVyLyR7aWR9YCwgeyBtZXRob2Q6ICdQT1NUJyB9KTtcbiAgICAgICAgICAgICAgaWYgKHJlcy5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2coYFx1NjIxMFx1NTI5Rlx1NjNBMFx1NTkzQSAke2lkfVx1RkYwQ1x1ODNCN1x1NUY5NyAke3Jlcy5sb290X2Ftb3VudH1gKTtcbiAgICAgICAgICAgICAgICBzaG93VG9hc3QoYFx1NjNBMFx1NTkzQVx1NjIxMFx1NTI5Rlx1RkYwQ1x1ODNCN1x1NUY5NyAke3Jlcy5sb290X2Ftb3VudH1gLCAnc3VjY2VzcycpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMubG9nKGBcdTYzQTBcdTU5M0EgJHtpZH0gXHU1OTMxXHU4RDI1YCk7XG4gICAgICAgICAgICAgICAgc2hvd1RvYXN0KCdcdTYzQTBcdTU5M0FcdTU5MzFcdThEMjUnLCAnd2FybicpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGF3YWl0IGJhci51cGRhdGUoKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gZT8ubWVzc2FnZSB8fCAnXHU2M0EwXHU1OTNBXHU1OTMxXHU4RDI1JztcbiAgICAgICAgICAgICAgdGhpcy5sb2coYFx1NjNBMFx1NTkzQVx1NTkzMVx1OEQyNVx1RkYxQSR7bWVzc2FnZX1gKTtcbiAgICAgICAgICAgICAgaWYgKG1lc3NhZ2UuaW5jbHVkZXMoJ1x1NTFCN1x1NTM3NCcpKSB7XG4gICAgICAgICAgICAgICAgc2hvd1RvYXN0KCdcdTYzQTBcdTU5M0FcdTU2NjhcdTUxQjdcdTUzNzRcdTRFMkRcdUZGMENcdThCRjdcdTdBMERcdTU0MEVcdTUxOERcdThCRDUnLCAnd2FybicpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNob3dUb2FzdChtZXNzYWdlLCAnZXJyb3InKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgZWwudGV4dENvbnRlbnQgPSBvcmlnaW5hbDtcbiAgICAgICAgICAgICAgZWwuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBsaXN0LmFwcGVuZENoaWxkKHJvdyk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgICBzaG93VG9hc3QoZT8ubWVzc2FnZSB8fCAnXHU1MkEwXHU4RjdEXHU2M0EwXHU1OTNBXHU3NkVFXHU2ODA3XHU1OTMxXHU4RDI1Jyk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICByZWZyZXNoQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIHJlZnJlc2hCdG4uaW5uZXJIVE1MID0gJzxzcGFuIGRhdGEtaWNvPVwicmVmcmVzaFwiPjwvc3Bhbj5cdTUyMzdcdTY1QjAnO1xuICAgICAgICBtb3VudEljb25zKHJlZnJlc2hCdG4pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZWZyZXNoQnRuLm9uY2xpY2sgPSAoKSA9PiBsb2FkKCk7XG4gICAgbG9hZCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBsb2cobXNnOiBzdHJpbmcpIHtcbiAgICBpZiAoIXRoaXMucmVzdWx0Qm94KSByZXR1cm47XG4gICAgY29uc3QgbGluZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGxpbmUudGV4dENvbnRlbnQgPSBgWyR7bmV3IERhdGUoKS50b0xvY2FsZVRpbWVTdHJpbmcoKX1dICR7bXNnfWA7XG4gICAgdGhpcy5yZXN1bHRCb3gucHJlcGVuZChsaW5lKTtcbiAgfVxufVxuIiwgImltcG9ydCB7IE5ldHdvcmtNYW5hZ2VyIH0gZnJvbSAnLi4vY29yZS9OZXR3b3JrTWFuYWdlcic7XG5pbXBvcnQgeyBodG1sLCBxcyB9IGZyb20gJy4uL3V0aWxzL2RvbSc7XG5pbXBvcnQgeyByZW5kZXJOYXYgfSBmcm9tICcuLi9jb21wb25lbnRzL05hdic7XG5pbXBvcnQgeyBSZWFsdGltZUNsaWVudCB9IGZyb20gJy4uL2NvcmUvUmVhbHRpbWVDbGllbnQnO1xuaW1wb3J0IHsgR2FtZU1hbmFnZXIgfSBmcm9tICcuLi9jb3JlL0dhbWVNYW5hZ2VyJztcbmltcG9ydCB7IHNob3dUb2FzdCB9IGZyb20gJy4uL2NvbXBvbmVudHMvVG9hc3QnO1xuaW1wb3J0IHsgcmVuZGVyUmVzb3VyY2VCYXIgfSBmcm9tICcuLi9jb21wb25lbnRzL1Jlc291cmNlQmFyJztcbmltcG9ydCB7IHJlbmRlckljb24gfSBmcm9tICcuLi9jb21wb25lbnRzL0ljb24nO1xuXG50eXBlIE9yZGVyID0ge1xuICBpZDogc3RyaW5nO1xuICB1c2VySWQ6IHN0cmluZztcbiAgdHlwZTogJ2J1eScgfCAnc2VsbCc7XG4gIGl0ZW1UZW1wbGF0ZUlkPzogc3RyaW5nO1xuICBpdGVtSW5zdGFuY2VJZD86IHN0cmluZztcbiAgcHJpY2U6IG51bWJlcjtcbiAgYW1vdW50OiBudW1iZXI7XG4gIGNyZWF0ZWRBdDogbnVtYmVyO1xufTtcblxuZXhwb3J0IGNsYXNzIEV4Y2hhbmdlU2NlbmUge1xuICBwcml2YXRlIHJlZnJlc2hUaW1lcjogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgdGVtcGxhdGVzOiB7IGlkOiBzdHJpbmc7IG5hbWU/OiBzdHJpbmc7IGNhdGVnb3J5Pzogc3RyaW5nIH1bXSA9IFtdO1xuICBwcml2YXRlIGludmVudG9yeTogYW55W10gPSBbXTtcblxuICBhc3luYyBtb3VudChyb290OiBIVE1MRWxlbWVudCkge1xuICAgIHRoaXMuY2xlYXJUaW1lcigpO1xuICAgIHJvb3QuaW5uZXJIVE1MID0gJyc7XG5cbiAgICBjb25zdCBuYXYgPSByZW5kZXJOYXYoJ2V4Y2hhbmdlJyk7XG4gICAgY29uc3QgYmFyID0gcmVuZGVyUmVzb3VyY2VCYXIoKTtcbiAgICBjb25zdCB2aWV3ID0gaHRtbChgXG4gICAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyIGdyaWQtMlwiIHN0eWxlPVwiY29sb3I6I2ZmZjtcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQgZmFkZS1pblwiPlxuICAgICAgICAgIDxoMyBzdHlsZT1cIm1hcmdpbjowIDAgMTJweDtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo4cHg7XCI+PHNwYW4gZGF0YS1pY289XCJleGNoYW5nZVwiPjwvc3Bhbj5cdTVFMDJcdTU3M0FcdTRFMEJcdTUzNTU8L2gzPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIiBzdHlsZT1cImZsZXgtd3JhcDp3cmFwO2FsaWduLWl0ZW1zOmZsZXgtZW5kO2dhcDoxMnB4O1wiPlxuICAgICAgICAgICAgPGRpdiBzdHlsZT1cImZsZXg6MTttaW4td2lkdGg6MTgwcHg7XCI+XG4gICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cImRpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjZweDtcIj48c3BhbiBkYXRhLWljbz1cImxpc3RcIj48L3NwYW4+XHU4RDJEXHU0RTcwXHU2QTIxXHU2NzdGPC9sYWJlbD5cbiAgICAgICAgICAgICAgPHNlbGVjdCBpZD1cInRwbFwiIGNsYXNzPVwiaW5wdXRcIj48L3NlbGVjdD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT1cImZsZXg6MTttaW4td2lkdGg6MTIwcHg7XCI+XG4gICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cImRpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjZweDtcIj48c3BhbiBkYXRhLWljbz1cImNvaW5cIj48L3NwYW4+XHU0RUY3XHU2ODNDIChCQlx1NUUwMSk8L2xhYmVsPlxuICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJwcmljZVwiIGNsYXNzPVwiaW5wdXRcIiB0eXBlPVwibnVtYmVyXCIgbWluPVwiMVwiIHZhbHVlPVwiMTBcIi8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJmbGV4OjE7bWluLXdpZHRoOjEyMHB4O1wiPlxuICAgICAgICAgICAgICA8bGFiZWw+XHU4RDJEXHU0RTcwXHU2NTcwXHU5MUNGPC9sYWJlbD5cbiAgICAgICAgICAgICAgPGlucHV0IGlkPVwiYW1vdW50XCIgY2xhc3M9XCJpbnB1dFwiIHR5cGU9XCJudW1iZXJcIiBtaW49XCIxXCIgdmFsdWU9XCIxXCIvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwicGxhY2VCdXlcIiBjbGFzcz1cImJ0biBidG4tYnV5XCIgc3R5bGU9XCJtaW4td2lkdGg6MTIwcHg7XCI+PHNwYW4gZGF0YS1pY289XCJhcnJvdy1yaWdodFwiPjwvc3Bhbj5cdTRFMEJcdTRFNzBcdTUzNTU8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IHN0eWxlPVwiaGVpZ2h0OjhweDtcIj48L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCIgc3R5bGU9XCJmbGV4LXdyYXA6d3JhcDthbGlnbi1pdGVtczpmbGV4LWVuZDtnYXA6MTJweDtcIj5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJmbGV4OjE7bWluLXdpZHRoOjIyMHB4O1wiPlxuICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9XCJkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo2cHg7XCI+PHNwYW4gZGF0YS1pY289XCJib3hcIj48L3NwYW4+XHU1MUZBXHU1NTJFXHU5MDUzXHU1MTc3PC9sYWJlbD5cbiAgICAgICAgICAgICAgPHNlbGVjdCBpZD1cImluc3RcIiBjbGFzcz1cImlucHV0XCI+PC9zZWxlY3Q+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJmbGV4OjE7bWluLXdpZHRoOjEyMHB4O1wiPlxuICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9XCJkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo2cHg7XCI+PHNwYW4gZGF0YS1pY289XCJjb2luXCI+PC9zcGFuPlx1NEVGN1x1NjgzQyAoQkJcdTVFMDEpPC9sYWJlbD5cbiAgICAgICAgICAgICAgPGlucHV0IGlkPVwic3ByaWNlXCIgY2xhc3M9XCJpbnB1dFwiIHR5cGU9XCJudW1iZXJcIiBtaW49XCIxXCIgdmFsdWU9XCI1XCIvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwicGxhY2VTZWxsXCIgY2xhc3M9XCJidG4gYnRuLXNlbGxcIiBzdHlsZT1cIm1pbi13aWR0aDoxMjBweDtcIj48c3BhbiBkYXRhLWljbz1cImFycm93LXJpZ2h0XCI+PC9zcGFuPlx1NEUwQlx1NTM1Nlx1NTM1NTwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgaWQ9XCJpbnZlbnRvcnlcIiBzdHlsZT1cIm1hcmdpbi10b3A6MTJweDtkaXNwbGF5OmZsZXg7ZmxleC13cmFwOndyYXA7Z2FwOjhweDtcIj48L2Rpdj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQgZmFkZS1pblwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIiBzdHlsZT1cImp1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6MTJweDtcIj5cbiAgICAgICAgICAgIDxoMyBzdHlsZT1cIm1hcmdpbjowO2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjhweDtcIj48c3BhbiBkYXRhLWljbz1cImxpc3RcIj48L3NwYW4+XHU4QkEyXHU1MzU1XHU3QzNGPC9oMz5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIiBzdHlsZT1cImZsZXgtd3JhcDp3cmFwO2dhcDo4cHg7XCI+XG4gICAgICAgICAgICAgIDxzZWxlY3QgaWQ9XCJxX3RwbFwiIGNsYXNzPVwiaW5wdXRcIiBzdHlsZT1cIndpZHRoOjE4MHB4O1wiPjwvc2VsZWN0PlxuICAgICAgICAgICAgICA8c2VsZWN0IGlkPVwicV90eXBlXCIgY2xhc3M9XCJpbnB1dFwiIHN0eWxlPVwid2lkdGg6MTIwcHg7XCI+XG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImJ1eVwiPlx1NEU3MFx1NTM1NTwvb3B0aW9uPlxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJzZWxsXCI+XHU1MzU2XHU1MzU1PC9vcHRpb24+XG4gICAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJyb3cgcGlsbFwiIHN0eWxlPVwiYWxpZ24taXRlbXM6Y2VudGVyO2dhcDo2cHg7XCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gZGF0YS1pY289XCJ1c2VyXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgIDxpbnB1dCBpZD1cIm15XCIgdHlwZT1cImNoZWNrYm94XCIvPiBcdTUzRUFcdTc3MEJcdTYyMTFcdTc2ODRcbiAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInJlZnJlc2hcIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiIHN0eWxlPVwibWluLXdpZHRoOjk2cHg7XCI+PHNwYW4gZGF0YS1pY289XCJyZWZyZXNoXCI+PC9zcGFuPlx1NTIzN1x1NjVCMDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBpZD1cImJvb2tcIiBzdHlsZT1cIm1hcmdpbi10b3A6MTJweDtkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDo4cHg7XCI+PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkIGZhZGUtaW5cIiBpZD1cImxvZ3NcIiBzdHlsZT1cIm9wYWNpdHk6Ljk7Zm9udC1mYW1pbHk6bW9ub3NwYWNlO21pbi1oZWlnaHQ6MjRweDtcIj48L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIGApO1xuXG4gICAgcm9vdC5hcHBlbmRDaGlsZChuYXYpO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQoYmFyLnJvb3QpO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQodmlldyk7XG5cbiAgICBjb25zdCB0b2tlbiA9IChOZXR3b3JrTWFuYWdlciBhcyBhbnkpLklbJ3Rva2VuJ107XG4gICAgaWYgKHRva2VuKSBSZWFsdGltZUNsaWVudC5JLmNvbm5lY3QodG9rZW4pO1xuICAgIGNvbnN0IG1lID0gR2FtZU1hbmFnZXIuSS5nZXRQcm9maWxlKCk7XG5cbiAgICBjb25zdCBib29rID0gcXModmlldywgJyNib29rJyk7XG4gICAgY29uc3QgbG9ncyA9IHFzPEhUTUxFbGVtZW50Pih2aWV3LCAnI2xvZ3MnKTtcbiAgICBjb25zdCBidXlUcGwgPSBxczxIVE1MU2VsZWN0RWxlbWVudD4odmlldywgJyN0cGwnKTtcbiAgICBjb25zdCBidXlQcmljZSA9IHFzPEhUTUxJbnB1dEVsZW1lbnQ+KHZpZXcsICcjcHJpY2UnKTtcbiAgICBjb25zdCBidXlBbW91bnQgPSBxczxIVE1MSW5wdXRFbGVtZW50Pih2aWV3LCAnI2Ftb3VudCcpO1xuICAgIGNvbnN0IHBsYWNlQnV5ID0gcXM8SFRNTEJ1dHRvbkVsZW1lbnQ+KHZpZXcsICcjcGxhY2VCdXknKTtcbiAgICBjb25zdCBzZWxsSW5zdCA9IHFzPEhUTUxTZWxlY3RFbGVtZW50Pih2aWV3LCAnI2luc3QnKTtcbiAgICBjb25zdCBzZWxsUHJpY2UgPSBxczxIVE1MSW5wdXRFbGVtZW50Pih2aWV3LCAnI3NwcmljZScpO1xuICAgIGNvbnN0IHBsYWNlU2VsbCA9IHFzPEhUTUxCdXR0b25FbGVtZW50Pih2aWV3LCAnI3BsYWNlU2VsbCcpO1xuICAgIGNvbnN0IGludkJveCA9IHFzPEhUTUxFbGVtZW50Pih2aWV3LCAnI2ludmVudG9yeScpO1xuICAgIGNvbnN0IHF1ZXJ5VHBsID0gcXM8SFRNTFNlbGVjdEVsZW1lbnQ+KHZpZXcsICcjcV90cGwnKTtcbiAgICBjb25zdCBxdWVyeVR5cGUgPSBxczxIVE1MU2VsZWN0RWxlbWVudD4odmlldywgJyNxX3R5cGUnKTtcbiAgICBjb25zdCBxdWVyeU1pbmVPbmx5ID0gcXM8SFRNTElucHV0RWxlbWVudD4odmlldywgJyNteScpO1xuICAgIGNvbnN0IG1pbmVPbmx5TGFiZWwgPSB2aWV3LnF1ZXJ5U2VsZWN0b3IoJ2xhYmVsLnJvdy5waWxsJykgYXMgSFRNTExhYmVsRWxlbWVudCB8IG51bGw7XG4gICAgY29uc3QgcmVmcmVzaEJ0biA9IHFzPEhUTUxCdXR0b25FbGVtZW50Pih2aWV3LCAnI3JlZnJlc2gnKTtcblxuICAgIGNvbnN0IG1vdW50SWNvbnMgPSAocm9vdEVsOiBFbGVtZW50KSA9PiB7XG4gICAgICByb290RWwucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtaWNvXScpXG4gICAgICAgIC5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICAgIGNvbnN0IG5hbWUgPSAoZWwgYXMgSFRNTEVsZW1lbnQpLmdldEF0dHJpYnV0ZSgnZGF0YS1pY28nKSBhcyBhbnk7XG4gICAgICAgICAgdHJ5IHsgZWwuYXBwZW5kQ2hpbGQocmVuZGVySWNvbihuYW1lLCB7IHNpemU6IDIwIH0pKTsgfSBjYXRjaCB7fVxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIG1vdW50SWNvbnModmlldyk7XG5cbiAgICBsZXQgcHJldklkcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGxldCByZWZyZXNoaW5nID0gZmFsc2U7XG5cbiAgICBjb25zdCBsb2cgPSAobWVzc2FnZTogc3RyaW5nKSA9PiB7XG4gICAgICBsb2dzLnRleHRDb250ZW50ID0gbWVzc2FnZTtcbiAgICB9O1xuXG4gICAgY29uc3QgcmVuZGVyVGVtcGxhdGVPcHRpb25zID0gKCkgPT4ge1xuICAgICAgYnV5VHBsLmlubmVySFRNTCA9ICcnO1xuICAgICAgcXVlcnlUcGwuaW5uZXJIVE1MID0gJyc7XG4gICAgICBjb25zdCBwbGFjZWhvbGRlciA9IGh0bWwoJzxvcHRpb24gdmFsdWU9XCJcIj5cdTkwMDlcdTYyRTlcdTZBMjFcdTY3N0Y8L29wdGlvbj4nKSBhcyBIVE1MT3B0aW9uRWxlbWVudDtcbiAgICAgIGJ1eVRwbC5hcHBlbmRDaGlsZChwbGFjZWhvbGRlcik7XG4gICAgICBjb25zdCBxUGxhY2Vob2xkZXIgPSBodG1sKCc8b3B0aW9uIHZhbHVlPVwiXCI+XHU1MTY4XHU5MEU4XHU2QTIxXHU2NzdGPC9vcHRpb24+JykgYXMgSFRNTE9wdGlvbkVsZW1lbnQ7XG4gICAgICBxdWVyeVRwbC5hcHBlbmRDaGlsZChxUGxhY2Vob2xkZXIpO1xuICAgICAgZm9yIChjb25zdCB0cGwgb2YgdGhpcy50ZW1wbGF0ZXMpIHtcbiAgICAgICAgY29uc3Qgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICAgIG9wdGlvbi52YWx1ZSA9IHRwbC5pZDtcbiAgICAgICAgb3B0aW9uLnRleHRDb250ZW50ID0gdHBsLm5hbWUgPyBgJHt0cGwubmFtZX0gKCR7dHBsLmlkfSlgIDogdHBsLmlkO1xuICAgICAgICBidXlUcGwuYXBwZW5kQ2hpbGQob3B0aW9uKTtcbiAgICAgICAgY29uc3QgcU9wdGlvbiA9IG9wdGlvbi5jbG9uZU5vZGUodHJ1ZSkgYXMgSFRNTE9wdGlvbkVsZW1lbnQ7XG4gICAgICAgIHF1ZXJ5VHBsLmFwcGVuZENoaWxkKHFPcHRpb24pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCByZW5kZXJJbnZlbnRvcnkgPSAoKSA9PiB7XG4gICAgICBzZWxsSW5zdC5pbm5lckhUTUwgPSAnJztcbiAgICAgIGludkJveC5pbm5lckhUTUwgPSAnJztcbiAgICAgIGNvbnN0IGRlZmF1bHRPcHRpb24gPSBodG1sKCc8b3B0aW9uIHZhbHVlPVwiXCI+XHU5MDA5XHU2MkU5XHU1M0VGXHU1MUZBXHU1NTJFXHU3Njg0XHU5MDUzXHU1MTc3PC9vcHRpb24+JykgYXMgSFRNTE9wdGlvbkVsZW1lbnQ7XG4gICAgICBzZWxsSW5zdC5hcHBlbmRDaGlsZChkZWZhdWx0T3B0aW9uKTtcbiAgICAgIGNvbnN0IGF2YWlsYWJsZSA9IHRoaXMuaW52ZW50b3J5LmZpbHRlcigoaXRlbSkgPT4gIWl0ZW0uaXNFcXVpcHBlZCAmJiAhaXRlbS5pc0xpc3RlZCk7XG4gICAgICBpZiAoIWF2YWlsYWJsZS5sZW5ndGgpIHtcbiAgICAgICAgaW52Qm94LnRleHRDb250ZW50ID0gJ1x1NjY4Mlx1NjVFMFx1NTNFRlx1NTFGQVx1NTUyRVx1NzY4NFx1OTA1M1x1NTE3N1x1RkYwOFx1OTcwMFx1NTE0OFx1NTcyOFx1NEVEM1x1NUU5M1x1NTM3OFx1NEUwQlx1ODhDNVx1NTkwN1x1RkYwOSc7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBhdmFpbGFibGUpIHtcbiAgICAgICAgY29uc3Qgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICAgIG9wdGlvbi52YWx1ZSA9IGl0ZW0uaWQ7XG4gICAgICAgIG9wdGlvbi50ZXh0Q29udGVudCA9IGAke2l0ZW0uaWR9IFx1MDBCNyAke2l0ZW0udGVtcGxhdGVJZH0gXHUwMEI3IEx2LiR7aXRlbS5sZXZlbH1gO1xuICAgICAgICBzZWxsSW5zdC5hcHBlbmRDaGlsZChvcHRpb24pO1xuXG4gICAgICAgIGNvbnN0IGNoaXAgPSBodG1sKGA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1naG9zdFwiIHN0eWxlPVwiZmxleDp1bnNldDtwYWRkaW5nOjZweCAxMHB4O1wiIGRhdGEtaWQ9XCIke2l0ZW0uaWR9XCI+JHtpdGVtLmlkfSAoJHtpdGVtLnRlbXBsYXRlSWR9KTwvYnV0dG9uPmApIGFzIEhUTUxCdXR0b25FbGVtZW50O1xuICAgICAgICBjaGlwLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICAgICAgc2VsbEluc3QudmFsdWUgPSBpdGVtLmlkO1xuICAgICAgICAgIGxvZyhgXHU1REYyXHU5MDA5XHU2MkU5XHU1MUZBXHU1NTJFXHU5MDUzXHU1MTc3ICR7aXRlbS5pZH1gKTtcbiAgICAgICAgfTtcbiAgICAgICAgaW52Qm94LmFwcGVuZENoaWxkKGNoaXApO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCBsb2FkTWV0YWRhdGEgPSBhc3luYyAoKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBbdHBscywgaXRlbXNdID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICAgIE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IHRlbXBsYXRlczogYW55W10gfT4oJy9pdGVtcy90ZW1wbGF0ZXMnKSxcbiAgICAgICAgICBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyBpdGVtczogYW55W10gfT4oJy9pdGVtcycpLFxuICAgICAgICBdKTtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXMgPSB0cGxzLnRlbXBsYXRlcyB8fCBbXTtcbiAgICAgICAgdGhpcy5pbnZlbnRvcnkgPSBpdGVtcy5pdGVtcyB8fCBbXTtcbiAgICAgICAgcmVuZGVyVGVtcGxhdGVPcHRpb25zKCk7XG4gICAgICAgIHJlbmRlckludmVudG9yeSgpO1xuICAgICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgIGxvZyhlPy5tZXNzYWdlIHx8ICdcdTUyQTBcdThGN0RcdTZBMjFcdTY3N0YvXHU0RUQzXHU1RTkzXHU1OTMxXHU4RDI1Jyk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IHJlZnJlc2ggPSBhc3luYyAob3B0czogeyBxdWlldD86IGJvb2xlYW4gfSA9IHt9KSA9PiB7XG4gICAgICBpZiAocmVmcmVzaGluZykgcmV0dXJuO1xuICAgICAgcmVmcmVzaGluZyA9IHRydWU7XG4gICAgICBpZiAoIW9wdHMucXVpZXQpIHsgcmVmcmVzaEJ0bi5pbm5lckhUTUwgPSAnPHNwYW4gZGF0YS1pY289XCJyZWZyZXNoXCI+PC9zcGFuPlx1NTIzN1x1NjVCMFx1NEUyRFx1MjAyNic7IG1vdW50SWNvbnMocmVmcmVzaEJ0bik7IH1cbiAgICAgIHJlZnJlc2hCdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgdHBsSWQgPSBxdWVyeVRwbC52YWx1ZTtcbiAgICAgICAgY29uc3QgdHlwZSA9IHF1ZXJ5VHlwZS52YWx1ZSBhcyAnYnV5JyB8ICdzZWxsJztcbiAgICAgICAgY29uc3QgbWluZU9ubHkgPSBxdWVyeU1pbmVPbmx5LmNoZWNrZWQ7XG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoKTtcbiAgICAgICAgcGFyYW1zLnNldCgndHlwZScsIHR5cGUpO1xuICAgICAgICBwYXJhbXMuc2V0KCdpdGVtX3RlbXBsYXRlX2lkJywgdHBsSWQgfHwgJycpO1xuICAgICAgICBpZiAoIW9wdHMucXVpZXQpIHtcbiAgICAgICAgICBib29rLmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSBib29rLmFwcGVuZENoaWxkKGh0bWwoJzxkaXYgY2xhc3M9XCJza2VsZXRvblwiPjwvZGl2PicpKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgb3JkZXJzOiBPcmRlcltdIH0+KGAvZXhjaGFuZ2Uvb3JkZXJzPyR7cGFyYW1zLnRvU3RyaW5nKCl9YCk7XG4gICAgICAgIGNvbnN0IG5ld0lkcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgICAgICBib29rLmlubmVySFRNTCA9ICcnO1xuICAgICAgICBjb25zdCBvcmRlcnMgPSBkYXRhLm9yZGVycyB8fCBbXTtcbiAgICAgICAgaWYgKCFvcmRlcnMubGVuZ3RoKSB7XG4gICAgICAgICAgYm9vay5hcHBlbmRDaGlsZChodG1sKCc8ZGl2IHN0eWxlPVwib3BhY2l0eTouODt0ZXh0LWFsaWduOmNlbnRlcjtcIj5cdTY2ODJcdTY1RTBcdThCQTJcdTUzNTU8L2Rpdj4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBvcmRlciBvZiBvcmRlcnMpIHtcbiAgICAgICAgICBpZiAobWluZU9ubHkgJiYgbWUgJiYgb3JkZXIudXNlcklkICE9PSBtZS5pZCkgY29udGludWU7XG4gICAgICAgICAgbmV3SWRzLmFkZChvcmRlci5pZCk7XG4gICAgICAgICAgY29uc3QgaXNNaW5lID0gbWUgJiYgb3JkZXIudXNlcklkID09PSBtZS5pZDtcbiAgICAgICAgICBjb25zdCBrbGFzcyA9IGBsaXN0LWl0ZW0gJHtvcmRlci50eXBlID09PSAnYnV5JyA/ICdsaXN0LWl0ZW0tLWJ1eScgOiAnbGlzdC1pdGVtLS1zZWxsJ31gO1xuICAgICAgICAgIGNvbnN0IHJvdyA9IGh0bWwoYFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIiR7a2xhc3N9XCI+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDoycHg7XCI+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgIDxzdHJvbmc+JHtvcmRlci50eXBlID09PSAnYnV5JyA/ICdcdTRFNzBcdTUxNjUnIDogJ1x1NTM1Nlx1NTFGQSd9PC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgICAke29yZGVyLml0ZW1UZW1wbGF0ZUlkIHx8ICcnfVxuICAgICAgICAgICAgICAgICAgJHtpc01pbmUgPyAnPHNwYW4gY2xhc3M9XCJwaWxsXCI+XHU2MjExXHU3Njg0PC9zcGFuPicgOiAnJ31cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwib3BhY2l0eTouODU7XCI+XG4gICAgICAgICAgICAgICAgICBcdTRFRjdcdTY4M0M6ICR7b3JkZXIucHJpY2V9IFx1MDBCNyBcdTY1NzBcdTkxQ0Y6ICR7b3JkZXIuYW1vdW50fVxuICAgICAgICAgICAgICAgICAgJHtvcmRlci5pdGVtSW5zdGFuY2VJZCA/IGA8c3BhbiBjbGFzcz1cInBpbGxcIj4ke29yZGVyLml0ZW1JbnN0YW5jZUlkfTwvc3Bhbj5gIDogJyd9XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInBpbGxcIj4ke29yZGVyLmlkfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgJHtpc01pbmUgPyBgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tZ2hvc3RcIiBkYXRhLWlkPVwiJHtvcmRlci5pZH1cIj48c3BhbiBkYXRhLWljbz1cInRyYXNoXCI+PC9zcGFuPlx1NjRBNFx1NTM1NTwvYnV0dG9uPmAgOiAnJ31cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICBgKTtcbiAgICAgICAgICBtb3VudEljb25zKHJvdyk7XG4gICAgICAgICAgaWYgKCFwcmV2SWRzLmhhcyhvcmRlci5pZCkpIHJvdy5jbGFzc0xpc3QuYWRkKCdmbGFzaCcpO1xuICAgICAgICAgIHJvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIChldikgPT4ge1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gZXYudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuICAgICAgICAgICAgY29uc3QgaWQgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWlkJyk7XG4gICAgICAgICAgICBpZiAoIWlkKSByZXR1cm47XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICB0YXJnZXQuc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICd0cnVlJyk7XG4gICAgICAgICAgICAgIGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdChgL2V4Y2hhbmdlL29yZGVycy8ke2lkfWAsIHsgbWV0aG9kOiAnREVMRVRFJyB9KTtcbiAgICAgICAgICAgICAgc2hvd1RvYXN0KCdcdTY0QTRcdTUzNTVcdTYyMTBcdTUyOUYnLCAnc3VjY2VzcycpO1xuICAgICAgICAgICAgICBhd2FpdCByZWZyZXNoKCk7XG4gICAgICAgICAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgICAgICAgICAgc2hvd1RvYXN0KGU/Lm1lc3NhZ2UgfHwgJ1x1NjRBNFx1NTM1NVx1NTkzMVx1OEQyNScsICdlcnJvcicpO1xuICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgdGFyZ2V0LnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBib29rLmFwcGVuZENoaWxkKHJvdyk7XG4gICAgICAgIH1cbiAgICAgICAgcHJldklkcyA9IG5ld0lkcztcbiAgICAgICAgaWYgKCFib29rLmNoaWxkRWxlbWVudENvdW50KSB7XG4gICAgICAgICAgYm9vay5hcHBlbmRDaGlsZChodG1sKCc8ZGl2IHN0eWxlPVwib3BhY2l0eTouODt0ZXh0LWFsaWduOmNlbnRlcjtcIj5cdTY2ODJcdTY1RTBcdTdCMjZcdTU0MDhcdTY3NjFcdTRFRjZcdTc2ODRcdThCQTJcdTUzNTU8L2Rpdj4nKSk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgICBsb2coZT8ubWVzc2FnZSB8fCAnXHU1MjM3XHU2NUIwXHU4QkEyXHU1MzU1XHU1OTMxXHU4RDI1Jyk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICByZWZyZXNoaW5nID0gZmFsc2U7XG4gICAgICAgIHJlZnJlc2hCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgcmVmcmVzaEJ0bi5pbm5lckhUTUwgPSAnPHNwYW4gZGF0YS1pY289XCJyZWZyZXNoXCI+PC9zcGFuPlx1NTIzN1x1NjVCMCc7XG4gICAgICAgIG1vdW50SWNvbnMocmVmcmVzaEJ0bik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBsYWNlQnV5Lm9uY2xpY2sgPSBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB0cGxJZCA9IGJ1eVRwbC52YWx1ZS50cmltKCk7XG4gICAgICBjb25zdCBwcmljZSA9IE51bWJlcihidXlQcmljZS52YWx1ZSk7XG4gICAgICBjb25zdCBhbW91bnQgPSBOdW1iZXIoYnV5QW1vdW50LnZhbHVlKTtcbiAgICAgIGlmICghdHBsSWQpIHtcbiAgICAgICAgc2hvd1RvYXN0KCdcdThCRjdcdTkwMDlcdTYyRTlcdThEMkRcdTRFNzBcdTc2ODRcdTZBMjFcdTY3N0YnLCAnd2FybicpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAocHJpY2UgPD0gMCB8fCBhbW91bnQgPD0gMCkge1xuICAgICAgICBzaG93VG9hc3QoJ1x1OEJGN1x1OEY5M1x1NTE2NVx1NjcwOVx1NjU0OFx1NzY4NFx1NEVGN1x1NjgzQ1x1NEUwRVx1NjU3MFx1OTFDRicsICd3YXJuJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHBsYWNlQnV5LmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIHBsYWNlQnV5LnRleHRDb250ZW50ID0gJ1x1NjNEMFx1NEVBNFx1NEUyRFx1MjAyNic7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyBpZDogc3RyaW5nIH0+KCcvZXhjaGFuZ2Uvb3JkZXJzJywge1xuICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgdHlwZTogJ2J1eScsIGl0ZW1fdGVtcGxhdGVfaWQ6IHRwbElkLCBwcmljZSwgYW1vdW50IH0pLFxuICAgICAgICB9KTtcbiAgICAgICAgc2hvd1RvYXN0KGBcdTRFNzBcdTUzNTVcdTVERjJcdTYzRDBcdTRFQTQgKCMke3Jlcy5pZH0pYCwgJ3N1Y2Nlc3MnKTtcbiAgICAgICAgbG9nKGBcdTRFNzBcdTUzNTVcdTYyMTBcdTUyOUY6ICR7cmVzLmlkfWApO1xuICAgICAgICBhd2FpdCBiYXIudXBkYXRlKCk7XG4gICAgICAgIGF3YWl0IHJlZnJlc2goKTtcbiAgICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgICBzaG93VG9hc3QoZT8ubWVzc2FnZSB8fCAnXHU0RTcwXHU1MzU1XHU2M0QwXHU0RUE0XHU1OTMxXHU4RDI1JywgJ2Vycm9yJyk7XG4gICAgICAgIGxvZyhlPy5tZXNzYWdlIHx8ICdcdTRFNzBcdTUzNTVcdTYzRDBcdTRFQTRcdTU5MzFcdThEMjUnKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHBsYWNlQnV5LmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIHBsYWNlQnV5LnRleHRDb250ZW50ID0gJ1x1NEUwQlx1NEU3MFx1NTM1NSc7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBsYWNlU2VsbC5vbmNsaWNrID0gYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgaW5zdElkID0gc2VsbEluc3QudmFsdWUudHJpbSgpO1xuICAgICAgY29uc3QgcHJpY2UgPSBOdW1iZXIoc2VsbFByaWNlLnZhbHVlKTtcbiAgICAgIGlmICghaW5zdElkKSB7XG4gICAgICAgIHNob3dUb2FzdCgnXHU4QkY3XHU5MDA5XHU2MkU5XHU4OTgxXHU1MUZBXHU1NTJFXHU3Njg0XHU5MDUzXHU1MTc3JywgJ3dhcm4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHByaWNlIDw9IDApIHtcbiAgICAgICAgc2hvd1RvYXN0KCdcdThCRjdcdThGOTNcdTUxNjVcdTY3MDlcdTY1NDhcdTc2ODRcdTRFRjdcdTY4M0MnLCAnd2FybicpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBwbGFjZVNlbGwuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgcGxhY2VTZWxsLnRleHRDb250ZW50ID0gJ1x1NjNEMFx1NEVBNFx1NEUyRFx1MjAyNic7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyBpZDogc3RyaW5nIH0+KCcvZXhjaGFuZ2Uvb3JkZXJzJywge1xuICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgdHlwZTogJ3NlbGwnLCBpdGVtX2luc3RhbmNlX2lkOiBpbnN0SWQsIHByaWNlIH0pLFxuICAgICAgICB9KTtcbiAgICAgICAgc2hvd1RvYXN0KGBcdTUzNTZcdTUzNTVcdTVERjJcdTYzRDBcdTRFQTQgKCMke3Jlcy5pZH0pYCwgJ3N1Y2Nlc3MnKTtcbiAgICAgICAgbG9nKGBcdTUzNTZcdTUzNTVcdTYyMTBcdTUyOUY6ICR7cmVzLmlkfWApO1xuICAgICAgICBhd2FpdCBiYXIudXBkYXRlKCk7XG4gICAgICAgIGF3YWl0IGxvYWRNZXRhZGF0YSgpO1xuICAgICAgICBhd2FpdCByZWZyZXNoKCk7XG4gICAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgICAgc2hvd1RvYXN0KGU/Lm1lc3NhZ2UgfHwgJ1x1NTM1Nlx1NTM1NVx1NjNEMFx1NEVBNFx1NTkzMVx1OEQyNScsICdlcnJvcicpO1xuICAgICAgICBsb2coZT8ubWVzc2FnZSB8fCAnXHU1MzU2XHU1MzU1XHU2M0QwXHU0RUE0XHU1OTMxXHU4RDI1Jyk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBwbGFjZVNlbGwuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgcGxhY2VTZWxsLnRleHRDb250ZW50ID0gJ1x1NEUwQlx1NTM1Nlx1NTM1NSc7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJlZnJlc2hCdG4ub25jbGljayA9ICgpID0+IHJlZnJlc2goKTtcbiAgICBxdWVyeVRwbC5vbmNoYW5nZSA9ICgpID0+IHJlZnJlc2goKTtcbiAgICBxdWVyeVR5cGUub25jaGFuZ2UgPSAoKSA9PiByZWZyZXNoKCk7XG4gICAgcXVlcnlNaW5lT25seS5vbmNoYW5nZSA9ICgpID0+IHsgaWYgKG1pbmVPbmx5TGFiZWwpIG1pbmVPbmx5TGFiZWwuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJywgcXVlcnlNaW5lT25seS5jaGVja2VkKTsgcmVmcmVzaCgpOyB9O1xuICAgIGlmIChtaW5lT25seUxhYmVsKSBtaW5lT25seUxhYmVsLmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScsIHF1ZXJ5TWluZU9ubHkuY2hlY2tlZCk7XG5cbiAgICBhd2FpdCBQcm9taXNlLmFsbChbYmFyLnVwZGF0ZSgpLCBsb2FkTWV0YWRhdGEoKV0pO1xuICAgIGF3YWl0IHJlZnJlc2goeyBxdWlldDogdHJ1ZSB9KTtcbiAgICB0aGlzLnJlZnJlc2hUaW1lciA9IHdpbmRvdy5zZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICByZWZyZXNoKHsgcXVpZXQ6IHRydWUgfSkuY2F0Y2goKCkgPT4ge30pO1xuICAgIH0sIDEwMDAwKTtcbiAgfVxuXG4gIHByaXZhdGUgY2xlYXJUaW1lcigpIHtcbiAgICBpZiAodGhpcy5yZWZyZXNoVGltZXIgIT09IG51bGwpIHtcbiAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKHRoaXMucmVmcmVzaFRpbWVyKTtcbiAgICAgIHRoaXMucmVmcmVzaFRpbWVyID0gbnVsbDtcbiAgICB9XG4gIH1cbn1cbiIsICJpbXBvcnQgeyBOZXR3b3JrTWFuYWdlciB9IGZyb20gJy4uL2NvcmUvTmV0d29ya01hbmFnZXInO1xuaW1wb3J0IHsgaHRtbCwgcXMgfSBmcm9tICcuLi91dGlscy9kb20nO1xuaW1wb3J0IHsgcmVuZGVyTmF2IH0gZnJvbSAnLi4vY29tcG9uZW50cy9OYXYnO1xuaW1wb3J0IHsgUmVhbHRpbWVDbGllbnQgfSBmcm9tICcuLi9jb3JlL1JlYWx0aW1lQ2xpZW50JztcbmltcG9ydCB7IHJlbmRlclJlc291cmNlQmFyIH0gZnJvbSAnLi4vY29tcG9uZW50cy9SZXNvdXJjZUJhcic7XG5pbXBvcnQgeyByZW5kZXJJY29uIH0gZnJvbSAnLi4vY29tcG9uZW50cy9JY29uJztcblxuZXhwb3J0IGNsYXNzIFJhbmtpbmdTY2VuZSB7XG4gIG1vdW50KHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgcm9vdC5pbm5lckhUTUwgPSAnJztcbiAgICByb290LmFwcGVuZENoaWxkKHJlbmRlck5hdigncmFua2luZycpKTtcbiAgICBjb25zdCBiYXIgPSByZW5kZXJSZXNvdXJjZUJhcigpO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQoYmFyLnJvb3QpO1xuXG4gICAgY29uc3QgdmlldyA9IGh0bWwoYFxuICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lciBncmlkLTJcIiBzdHlsZT1cImNvbG9yOiNmZmY7XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkIGZhZGUtaW5cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCIgc3R5bGU9XCJqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjthbGlnbi1pdGVtczpjZW50ZXI7XCI+XG4gICAgICAgICAgICA8aDMgc3R5bGU9XCJtYXJnaW46MDtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo4cHg7XCI+PHNwYW4gZGF0YS1pY289XCJ0cm9waHlcIj48L3NwYW4+XHU2MzkyXHU4ODRDXHU2OTlDPC9oMz5cbiAgICAgICAgICAgIDxidXR0b24gaWQ9XCJyZWZyZXNoXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIj48c3BhbiBkYXRhLWljbz1cInJlZnJlc2hcIj48L3NwYW4+XHU1MjM3XHU2NUIwPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBpZD1cIm1lXCIgc3R5bGU9XCJtYXJnaW4tdG9wOjhweDtvcGFjaXR5Oi45NTtcIj48L2Rpdj5cbiAgICAgICAgICA8ZGl2IGlkPVwibGlzdFwiIHN0eWxlPVwibWFyZ2luLXRvcDoxMnB4O2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjZweDtcIj48L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICBgKTtcbiAgICByb290LmFwcGVuZENoaWxkKHZpZXcpO1xuXG4gICAgY29uc3QgdG9rZW4gPSAoTmV0d29ya01hbmFnZXIgYXMgYW55KS5JWyd0b2tlbiddO1xuICAgIGlmICh0b2tlbikgUmVhbHRpbWVDbGllbnQuSS5jb25uZWN0KHRva2VuKTtcblxuICAgIGNvbnN0IG1lQm94ID0gcXModmlldywgJyNtZScpO1xuICAgIGNvbnN0IGxpc3QgPSBxcyh2aWV3LCAnI2xpc3QnKTtcbiAgICBjb25zdCByZWZyZXNoQnRuID0gcXM8SFRNTEJ1dHRvbkVsZW1lbnQ+KHZpZXcsICcjcmVmcmVzaCcpO1xuICAgIGNvbnN0IG1vdW50SWNvbnMgPSAocm9vdEVsOiBFbGVtZW50KSA9PiB7XG4gICAgICByb290RWwucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtaWNvXScpXG4gICAgICAgIC5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICAgIGNvbnN0IG5hbWUgPSAoZWwgYXMgSFRNTEVsZW1lbnQpLmdldEF0dHJpYnV0ZSgnZGF0YS1pY28nKSBhcyBhbnk7XG4gICAgICAgICAgdHJ5IHsgZWwuYXBwZW5kQ2hpbGQocmVuZGVySWNvbihuYW1lLCB7IHNpemU6IDIwIH0pKTsgfSBjYXRjaCB7fVxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIG1vdW50SWNvbnModmlldyk7XG5cbiAgICBjb25zdCBsb2FkID0gYXN5bmMgKCkgPT4ge1xuICAgICAgcmVmcmVzaEJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICByZWZyZXNoQnRuLmlubmVySFRNTCA9ICc8c3BhbiBkYXRhLWljbz1cInJlZnJlc2hcIj48L3NwYW4+XHU1MjM3XHU2NUIwXHU0RTJEXHUyMDI2JztcbiAgICAgIG1vdW50SWNvbnMocmVmcmVzaEJ0bik7XG4gICAgICBhd2FpdCBiYXIudXBkYXRlKCk7XG4gICAgICBsaXN0LmlubmVySFRNTCA9ICcnO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIGxpc3QuYXBwZW5kQ2hpbGQoaHRtbCgnPGRpdiBjbGFzcz1cInNrZWxldG9uXCI+PC9kaXY+JykpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgbWUgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyByYW5rOiBudW1iZXI7IHNjb3JlOiBudW1iZXIgfT4oJy9yYW5raW5nL21lJyk7XG4gICAgICAgIGNvbnN0IHRvcCA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IGxpc3Q6IGFueVtdIH0+KCcvcmFua2luZy90b3A/bj0yMCcpO1xuICAgICAgICBtZUJveC50ZXh0Q29udGVudCA9IGBcdTYyMTFcdTc2ODRcdTU0MERcdTZCMjFcdUZGMUEjJHttZS5yYW5rfSBcdTAwQjcgXHU2MDNCXHU1Rjk3XHU1MjA2XHVGRjFBJHttZS5zY29yZX1gO1xuICAgICAgICBsaXN0LmlubmVySFRNTCA9ICcnO1xuICAgICAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIHRvcC5saXN0KSB7XG4gICAgICAgICAgY29uc3QgbWVkYWwgPSBlbnRyeS5yYW5rID09PSAxID8gJ1x1RDgzRVx1REQ0NycgOiBlbnRyeS5yYW5rID09PSAyID8gJ1x1RDgzRVx1REQ0OCcgOiBlbnRyeS5yYW5rID09PSAzID8gJ1x1RDgzRVx1REQ0OScgOiAnJztcbiAgICAgICAgICBjb25zdCBjbHMgPSBlbnRyeS5yYW5rIDw9IDMgPyAnIGxpc3QtaXRlbS0tYnV5JyA6ICcnO1xuICAgICAgICAgIGNvbnN0IHJvdyA9IGh0bWwoYFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxpc3QtaXRlbSR7Y2xzfVwiPlxuICAgICAgICAgICAgICA8c3Bhbj4ke21lZGFsfSAjJHtlbnRyeS5yYW5rfTwvc3Bhbj5cbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9XCJmbGV4OjE7b3BhY2l0eTouOTttYXJnaW4tbGVmdDoxMnB4O2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjZweDtcIj48c3BhbiBkYXRhLWljbz1cInVzZXJcIj48L3NwYW4+JHtlbnRyeS51c2VySWR9PC9zcGFuPlxuICAgICAgICAgICAgICA8c3Ryb25nPiR7ZW50cnkuc2NvcmV9PC9zdHJvbmc+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICBgKTtcbiAgICAgICAgICBtb3VudEljb25zKHJvdyk7XG4gICAgICAgICAgbGlzdC5hcHBlbmRDaGlsZChyb3cpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgICAgbWVCb3gudGV4dENvbnRlbnQgPSBlPy5tZXNzYWdlIHx8ICdcdTYzOTJcdTg4NENcdTY5OUNcdTUyQTBcdThGN0RcdTU5MzFcdThEMjUnO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgcmVmcmVzaEJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICByZWZyZXNoQnRuLmlubmVySFRNTCA9ICc8c3BhbiBkYXRhLWljbz1cInJlZnJlc2hcIj48L3NwYW4+XHU1MjM3XHU2NUIwJztcbiAgICAgICAgbW91bnRJY29ucyhyZWZyZXNoQnRuKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHJlZnJlc2hCdG4ub25jbGljayA9ICgpID0+IGxvYWQoKTtcbiAgICBsb2FkKCk7XG4gIH1cbn1cbiIsICJsZXQgaW5qZWN0ZWQgPSBmYWxzZTtcblxuZXhwb3J0IGZ1bmN0aW9uIGVuc3VyZUdsb2JhbFN0eWxlcygpIHtcbiAgaWYgKGluamVjdGVkKSByZXR1cm47XG4gIGNvbnN0IGNzcyA9IGA6cm9vdHstLWJnOiMwYjEwMjA7LS1iZy0yOiMwZjE1MzA7LS1mZzojZmZmOy0tbXV0ZWQ6cmdiYSgyNTUsMjU1LDI1NSwuNzUpOy0tZ3JhZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCM3QjJDRjUsIzJDODlGNSk7LS1wYW5lbC1ncmFkOmxpbmVhci1ncmFkaWVudCgxMzVkZWcscmdiYSgxMjMsNDQsMjQ1LC4yNSkscmdiYSg0NCwxMzcsMjQ1LC4yNSkpOy0tZ2xhc3M6Ymx1cigxMHB4KTstLWdsb3c6MCA4cHggMjBweCByZ2JhKDAsMCwwLC4zNSksMCAwIDEycHggcmdiYSgxMjMsNDQsMjQ1LC43KTstLXJhZGl1cy1zbToxMHB4Oy0tcmFkaXVzLW1kOjEycHg7LS1yYWRpdXMtbGc6MTZweDstLWVhc2U6Y3ViaWMtYmV6aWVyKC4yMiwuNjEsLjM2LDEpOy0tZHVyOi4yOHM7LS1idXk6IzJDODlGNTstLXNlbGw6I0UzNjQxNDstLW9rOiMyZWMyN2U7LS13YXJuOiNmNmM0NDU7LS1kYW5nZXI6I2ZmNWM1YzstLXJhcml0eS1jb21tb246IzlhYTBhNjstLXJhcml0eS1yYXJlOiM0ZmQ0ZjU7LS1yYXJpdHktZXBpYzojYjI2YmZmOy0tcmFyaXR5LWxlZ2VuZGFyeTojZjZjNDQ1Oy0tY29udGFpbmVyLW1heDo3MjBweH1cbmh0bWwsYm9keXtiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudCgxMjAwcHggNjAwcHggYXQgNTAlIC0xMCUsIHJnYmEoMTIzLDQ0LDI0NSwuMTIpLCB0cmFuc3BhcmVudCksdmFyKC0tYmcpO2NvbG9yOnZhcigtLWZnKTtmb250LWZhbWlseTpzeXN0ZW0tdWksLWFwcGxlLXN5c3RlbSxcIlNlZ29lIFVJXCIsXCJQaW5nRmFuZyBTQ1wiLFwiTWljcm9zb2Z0IFlhSGVpXCIsQXJpYWwsc2Fucy1zZXJpZn1cbmh0bWx7Y29sb3Itc2NoZW1lOmRhcmt9XG4uY29udGFpbmVye3BhZGRpbmc6MCAxMnB4fVxuLmNvbnRhaW5lcnttYXgtd2lkdGg6dmFyKC0tY29udGFpbmVyLW1heCk7bWFyZ2luOjEycHggYXV0b31cbi5jYXJke3Bvc2l0aW9uOnJlbGF0aXZlO2JvcmRlci1yYWRpdXM6dmFyKC0tcmFkaXVzLWxnKTtiYWNrZ3JvdW5kOnZhcigtLXBhbmVsLWdyYWQpO2JhY2tkcm9wLWZpbHRlcjp2YXIoLS1nbGFzcyk7Ym94LXNoYWRvdzp2YXIoLS1nbG93KTtwYWRkaW5nOjEycHg7b3ZlcmZsb3c6aGlkZGVufVxuLyogbmVvbiBjb3JuZXJzICsgc2hlZW4gKi9cbi5jYXJkOjpiZWZvcmV7Y29udGVudDpcIlwiO3Bvc2l0aW9uOmFic29sdXRlO2luc2V0OjA7Ym9yZGVyLXJhZGl1czppbmhlcml0O2JhY2tncm91bmQ6cmFkaWFsLWdyYWRpZW50KDQwJSAyNSUgYXQgMTAwJSAwLCByZ2JhKDEyMyw0NCwyNDUsLjE4KSwgdHJhbnNwYXJlbnQgNjAlKSxyYWRpYWwtZ3JhZGllbnQoMzUlIDI1JSBhdCAwIDEwMCUsIHJnYmEoNDQsMTM3LDI0NSwuMTYpLCB0cmFuc3BhcmVudCA2MCUpO3BvaW50ZXItZXZlbnRzOm5vbmV9XG4uY2FyZDo6YWZ0ZXJ7Y29udGVudDpcIlwiO3Bvc2l0aW9uOmFic29sdXRlO2xlZnQ6LTMwJTt0b3A6LTEyMCU7d2lkdGg6NjAlO2hlaWdodDozMDAlO2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEyMGRlZyx0cmFuc3BhcmVudCxyZ2JhKDI1NSwyNTUsMjU1LC4xOCksdHJhbnNwYXJlbnQpO3RyYW5zZm9ybTpyb3RhdGUoOGRlZyk7b3BhY2l0eTouMjU7YW5pbWF0aW9uOmNhcmQtc2hlZW4gOXMgbGluZWFyIGluZmluaXRlfVxuQGtleWZyYW1lcyBjYXJkLXNoZWVuezAle3RyYW5zZm9ybTp0cmFuc2xhdGVYKDApIHJvdGF0ZSg4ZGVnKX0xMDAle3RyYW5zZm9ybTp0cmFuc2xhdGVYKDE2MCUpIHJvdGF0ZSg4ZGVnKX19XG4ucm93e2Rpc3BsYXk6ZmxleDtnYXA6OHB4O2FsaWduLWl0ZW1zOmNlbnRlcn1cbi5jYXJkIGlucHV0LC5jYXJkIGJ1dHRvbntib3gtc2l6aW5nOmJvcmRlci1ib3g7b3V0bGluZTpub25lfVxuLmNhcmQgaW5wdXR7YmFja2dyb3VuZDpyZ2JhKDI1NSwyNTUsMjU1LC4wOCk7Ym9yZGVyOjA7Ym9yZGVyLXJhZGl1czp2YXIoLS1yYWRpdXMtbWQpO2NvbG9yOnZhcigtLWZnKTtwYWRkaW5nOjEwcHg7bWFyZ2luOjhweCAwO2FwcGVhcmFuY2U6bm9uZTstd2Via2l0LWFwcGVhcmFuY2U6bm9uZTtiYWNrZ3JvdW5kLWNsaXA6cGFkZGluZy1ib3h9XG4uY2FyZCBzZWxlY3QuaW5wdXQsIHNlbGVjdC5pbnB1dHtiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjA4KTtjb2xvcjp2YXIoLS1mZyk7Ym9yZGVyOjA7Ym9yZGVyLXJhZGl1czp2YXIoLS1yYWRpdXMtbWQpO3BhZGRpbmc6MTBweDttYXJnaW46OHB4IDA7YXBwZWFyYW5jZTpub25lOy13ZWJraXQtYXBwZWFyYW5jZTpub25lO2JhY2tncm91bmQtY2xpcDpwYWRkaW5nLWJveH1cbi5jYXJkIHNlbGVjdC5pbnB1dCBvcHRpb24sIHNlbGVjdC5pbnB1dCBvcHRpb257YmFja2dyb3VuZDojMGIxMDIwO2NvbG9yOiNmZmZ9XG4uY2FyZCBzZWxlY3QuaW5wdXQ6Zm9jdXMsIHNlbGVjdC5pbnB1dDpmb2N1c3tvdXRsaW5lOjJweCBzb2xpZCByZ2JhKDEyMyw0NCwyNDUsLjQ1KX1cbi5jYXJkIGJ1dHRvbnt3aWR0aDoxMDAlO2JvcmRlci1yYWRpdXM6dmFyKC0tcmFkaXVzLW1kKX1cbi5idG57cG9zaXRpb246cmVsYXRpdmU7b3ZlcmZsb3c6aGlkZGVuO3BhZGRpbmc6MTBweCAxNHB4O2JvcmRlcjowO2JvcmRlci1yYWRpdXM6dmFyKC0tcmFkaXVzLW1kKTtjb2xvcjojZmZmO3RyYW5zaXRpb246dHJhbnNmb3JtIHZhcigtLWR1cikgdmFyKC0tZWFzZSksYm94LXNoYWRvdyB2YXIoLS1kdXIpIHZhcigtLWVhc2UpLGZpbHRlciB2YXIoLS1kdXIpIHZhcigtLWVhc2UpfVxuLmJ0biAuaWNvbnttYXJnaW4tcmlnaHQ6NnB4fVxuLmJ0bjphY3RpdmV7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoMXB4KSBzY2FsZSguOTkpfVxuLmJ0bjo6YWZ0ZXJ7Y29udGVudDpcIlwiO3Bvc2l0aW9uOmFic29sdXRlO2luc2V0OjA7b3BhY2l0eTowO2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDExNWRlZyx0cmFuc3BhcmVudCxyZ2JhKDI1NSwyNTUsMjU1LC4yNSksdHJhbnNwYXJlbnQgNTUlKTt0cmFuc2Zvcm06dHJhbnNsYXRlWCgtNjAlKTt0cmFuc2l0aW9uOm9wYWNpdHkgdmFyKC0tZHVyKSB2YXIoLS1lYXNlKSwgdHJhbnNmb3JtIHZhcigtLWR1cikgdmFyKC0tZWFzZSl9XG4uYnRuOmhvdmVyOjphZnRlcntvcGFjaXR5Oi45O3RyYW5zZm9ybTp0cmFuc2xhdGVYKDApfVxuLmJ0bjpob3ZlcntmaWx0ZXI6c2F0dXJhdGUoMTEwJSl9XG4uYnRuLXByaW1hcnl7YmFja2dyb3VuZDp2YXIoLS1ncmFkKTtib3gtc2hhZG93OnZhcigtLWdsb3cpfVxuLmJ0bi1idXl7YmFja2dyb3VuZDp2YXIoLS1idXkpfVxuLmJ0bi1zZWxse2JhY2tncm91bmQ6dmFyKC0tc2VsbCl9XG4uYnRuLWdob3N0e2JhY2tncm91bmQ6cmdiYSgyNTUsMjU1LDI1NSwuMDgpfVxuLmlucHV0e3dpZHRoOjEwMCU7cGFkZGluZzoxMHB4O2JvcmRlcjowO2JvcmRlci1yYWRpdXM6dmFyKC0tcmFkaXVzLW1kKTtiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjA4KTtjb2xvcjp2YXIoLS1mZyl9XG4ucGlsbHtwYWRkaW5nOjJweCA4cHg7Ym9yZGVyLXJhZGl1czo5OTlweDtiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjA4KTtmb250LXNpemU6MTJweDtjdXJzb3I6cG9pbnRlcn1cbi5waWxsLmFjdGl2ZXtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcsIHJnYmEoMTIzLDQ0LDI0NSwuMzUpLCByZ2JhKDQ0LDEzNywyNDUsLjI4KSk7Ym94LXNoYWRvdzp2YXIoLS1nbG93KX1cbi5zY2VuZS1oZWFkZXJ7ZGlzcGxheTpmbGV4O2p1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2FsaWduLWl0ZW1zOmZsZXgtZW5kO2dhcDoxMnB4O21hcmdpbi1ib3R0b206OHB4fVxuLnNjZW5lLWhlYWRlciBoMXttYXJnaW46MDtmb250LXNpemU6MjBweH1cbi5zY2VuZS1oZWFkZXIgcHttYXJnaW46MDtvcGFjaXR5Oi44NX1cbi5zdGF0c3tkaXNwbGF5OmZsZXg7Z2FwOjEwcHh9XG4uc3RhdHtmbGV4OjE7bWluLXdpZHRoOjA7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTgwZGVnLHJnYmEoMjU1LDI1NSwyNTUsLjA2KSxyZ2JhKDI1NSwyNTUsMjU1LC4wMykpO2JvcmRlci1yYWRpdXM6MTJweDtwYWRkaW5nOjEwcHg7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6MTBweH1cbi5zdGF0IC5pY297Zm9udC1zaXplOjE4cHg7ZmlsdGVyOmRyb3Atc2hhZG93KDAgMCA4cHggcmdiYSgxMjMsNDQsMjQ1LC4zNSkpfVxuLnN0YXQgLnZhbHtmb250LXdlaWdodDo3MDA7Zm9udC1zaXplOjE2cHh9XG4uc3RhdCAubGFiZWx7b3BhY2l0eTouODU7Zm9udC1zaXplOjEycHh9XG4uZXZlbnQtZmVlZHttYXgtaGVpZ2h0OjI0MHB4O292ZXJmbG93OmF1dG87ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6NnB4fVxuLmV2ZW50LWZlZWQgLmV2ZW50e29wYWNpdHk6Ljk7Zm9udC1mYW1pbHk6bW9ub3NwYWNlO2ZvbnQtc2l6ZToxMnB4fVxuLmZhZGUtaW57YW5pbWF0aW9uOmZhZGUtaW4gLjNzIHZhcigtLWVhc2UpfVxuQGtleWZyYW1lcyBmYWRlLWlue2Zyb217b3BhY2l0eTowO3RyYW5zZm9ybTp0cmFuc2xhdGVZKDRweCl9dG97b3BhY2l0eToxO3RyYW5zZm9ybTpub25lfX1cbi5mbGFzaHthbmltYXRpb246Zmxhc2ggLjlzIGVhc2V9XG5Aa2V5ZnJhbWVzIGZsYXNoezAle2JveC1zaGFkb3c6MCAwIDAgcmdiYSgyNTUsMjU1LDI1NSwwKX00MCV7Ym94LXNoYWRvdzowIDAgMCA2cHggcmdiYSgyNTUsMjU1LDI1NSwuMTUpfTEwMCV7Ym94LXNoYWRvdzowIDAgMCByZ2JhKDI1NSwyNTUsMjU1LDApfX1cbi5za2VsZXRvbntwb3NpdGlvbjpyZWxhdGl2ZTtvdmVyZmxvdzpoaWRkZW47YmFja2dyb3VuZDpyZ2JhKDI1NSwyNTUsMjU1LC4wOCk7Ym9yZGVyLXJhZGl1czp2YXIoLS1yYWRpdXMtbWQpO2hlaWdodDo0NHB4fVxuLnNrZWxldG9uOjphZnRlcntjb250ZW50OlwiXCI7cG9zaXRpb246YWJzb2x1dGU7aW5zZXQ6MDt0cmFuc2Zvcm06dHJhbnNsYXRlWCgtMTAwJSk7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoOTBkZWcsdHJhbnNwYXJlbnQscmdiYSgyNTUsMjU1LDI1NSwuMTIpLHRyYW5zcGFyZW50KTthbmltYXRpb246c2hpbW1lciAxLjJzIGluZmluaXRlfVxuQGtleWZyYW1lcyBzaGltbWVyezEwMCV7dHJhbnNmb3JtOnRyYW5zbGF0ZVgoMTAwJSl9fVxuLmxpc3QtaXRlbXtkaXNwbGF5OmZsZXg7Z2FwOjhweDthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YmFja2dyb3VuZDpyZ2JhKDI1NSwyNTUsMjU1LC4wNik7Ym9yZGVyLXJhZGl1czp2YXIoLS1yYWRpdXMtbWQpO3BhZGRpbmc6MTBweH1cbi5saXN0LWl0ZW0tLWJ1eXtib3JkZXItbGVmdDozcHggc29saWQgdmFyKC0tYnV5KX1cbi5saXN0LWl0ZW0tLXNlbGx7Ym9yZGVyLWxlZnQ6M3B4IHNvbGlkIHZhcigtLXNlbGwpfVxuLm5hdnttYXgtd2lkdGg6dmFyKC0tY29udGFpbmVyLW1heCk7bWFyZ2luOjEycHggYXV0byAwO2Rpc3BsYXk6ZmxleDtnYXA6OHB4O2ZsZXgtd3JhcDp3cmFwO3Bvc2l0aW9uOnN0aWNreTt0b3A6MDt6LWluZGV4OjQwO3BhZGRpbmc6NnB4O2JvcmRlci1yYWRpdXM6MTRweDtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxODBkZWcscmdiYSgyMCwyMCw0MCwuNDUpLHJnYmEoMjAsMjAsNDAsLjI1KSk7YmFja2Ryb3AtZmlsdGVyOmJsdXIoMTBweCkgc2F0dXJhdGUoMTI1JSk7Ym9yZGVyOjFweCBzb2xpZCByZ2JhKDI1NSwyNTUsMjU1LC4wNil9XG4ubmF2IGF7ZmxleDoxO2Rpc3BsYXk6ZmxleDtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NnB4O3RleHQtYWxpZ246Y2VudGVyO3BhZGRpbmc6MTBweDtib3JkZXItcmFkaXVzOjk5OXB4O3RleHQtZGVjb3JhdGlvbjpub25lO2NvbG9yOiNmZmY7dHJhbnNpdGlvbjpiYWNrZ3JvdW5kIHZhcigtLWR1cikgdmFyKC0tZWFzZSksIHRyYW5zZm9ybSB2YXIoLS1kdXIpIHZhcigtLWVhc2UpfVxuLm5hdiBhIC5pY297b3BhY2l0eTouOTV9XG4ubmF2IGEuYWN0aXZle2JhY2tncm91bmQ6dmFyKC0tZ3JhZCk7Ym94LXNoYWRvdzp2YXIoLS1nbG93KX1cbi5uYXYgYTpub3QoLmFjdGl2ZSk6aG92ZXJ7YmFja2dyb3VuZDpyZ2JhKDI1NSwyNTUsMjU1LC4wNil9XG4vKiBnZW5lcmljIGljb24gKi9cbi5pY29ue2Rpc3BsYXk6aW5saW5lLWJsb2NrO2xpbmUtaGVpZ2h0OjA7dmVydGljYWwtYWxpZ246bWlkZGxlfVxuLmljb24gc3Zne2Rpc3BsYXk6YmxvY2s7ZmlsdGVyOmRyb3Atc2hhZG93KDAgMCA4cHggcmdiYSgxMjMsNDQsMjQ1LC4zNSkpfVxuLyogcmFyaXR5IGJhZGdlcyAqL1xuLmJhZGdle2Rpc3BsYXk6aW5saW5lLWZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo2cHg7cGFkZGluZzoycHggOHB4O2JvcmRlci1yYWRpdXM6OTk5cHg7Zm9udC1zaXplOjEycHg7bGluZS1oZWlnaHQ6MTtib3JkZXI6MXB4IHNvbGlkIHJnYmEoMjU1LDI1NSwyNTUsLjEyKTtiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjA2KX1cbi5iYWRnZSBpe2Rpc3BsYXk6aW5saW5lLWJsb2NrO3dpZHRoOjhweDtoZWlnaHQ6OHB4O2JvcmRlci1yYWRpdXM6OTk5cHh9XG4uYmFkZ2UucmFyaXR5LWNvbW1vbiBpe2JhY2tncm91bmQ6dmFyKC0tcmFyaXR5LWNvbW1vbil9XG4uYmFkZ2UucmFyaXR5LXJhcmUgaXtiYWNrZ3JvdW5kOnZhcigtLXJhcml0eS1yYXJlKX1cbi5iYWRnZS5yYXJpdHktZXBpYyBpe2JhY2tncm91bmQ6dmFyKC0tcmFyaXR5LWVwaWMpfVxuLmJhZGdlLnJhcml0eS1sZWdlbmRhcnkgaXtiYWNrZ3JvdW5kOnZhcigtLXJhcml0eS1sZWdlbmRhcnkpfVxuLnJhcml0eS1vdXRsaW5lLWNvbW1vbntib3gtc2hhZG93OjAgMCAwIDFweCByZ2JhKDE1NCwxNjAsMTY2LC4zNSkgaW5zZXQsIDAgMCAyNHB4IHJnYmEoMTU0LDE2MCwxNjYsLjE1KX1cbi5yYXJpdHktb3V0bGluZS1yYXJle2JveC1zaGFkb3c6MCAwIDAgMXB4IHJnYmEoNzksMjEyLDI0NSwuNDUpIGluc2V0LCAwIDAgMjhweCByZ2JhKDc5LDIxMiwyNDUsLjI1KX1cbi5yYXJpdHktb3V0bGluZS1lcGlje2JveC1zaGFkb3c6MCAwIDAgMXB4IHJnYmEoMTc4LDEwNywyNTUsLjUpIGluc2V0LCAwIDAgMzJweCByZ2JhKDE3OCwxMDcsMjU1LC4zKX1cbi5yYXJpdHktb3V0bGluZS1sZWdlbmRhcnl7Ym94LXNoYWRvdzowIDAgMCAxcHggcmdiYSgyNDYsMTk2LDY5LC42KSBpbnNldCwgMCAwIDM2cHggcmdiYSgyNDYsMTk2LDY5LC4zNSl9XG4vKiBhdXJhIGNhcmQgd3JhcHBlciAqL1xuLml0ZW0tY2FyZHtwb3NpdGlvbjpyZWxhdGl2ZTtib3JkZXItcmFkaXVzOnZhcigtLXJhZGl1cy1tZCk7cGFkZGluZzoxMHB4O2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDE0MGRlZyxyZ2JhKDI1NSwyNTUsMjU1LC4wNikscmdiYSgyNTUsMjU1LDI1NSwuMDQpKTtvdmVyZmxvdzpoaWRkZW59XG4uaXRlbS1jYXJkOjpiZWZvcmV7Y29udGVudDpcIlwiO3Bvc2l0aW9uOmFic29sdXRlO2luc2V0Oi0xcHg7Ym9yZGVyLXJhZGl1czppbmhlcml0O3BhZGRpbmc6MXB4O2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZyxyZ2JhKDI1NSwyNTUsMjU1LC4xOCkscmdiYSgyNTUsMjU1LDI1NSwuMDIpKTstd2Via2l0LW1hc2s6bGluZWFyLWdyYWRpZW50KCMwMDAgMCAwKSBjb250ZW50LWJveCxsaW5lYXItZ3JhZGllbnQoIzAwMCAwIDApOy13ZWJraXQtbWFzay1jb21wb3NpdGU6eG9yO21hc2stY29tcG9zaXRlOmV4Y2x1ZGV9XG4uaXRlbS1jYXJkW2RhdGEtcmFyaXR5PVwiY29tbW9uXCJde2JvcmRlcjoxcHggc29saWQgcmdiYSgxNTQsMTYwLDE2NiwuMjUpfVxuLml0ZW0tY2FyZFtkYXRhLXJhcml0eT1cInJhcmVcIl17Ym9yZGVyOjFweCBzb2xpZCByZ2JhKDc5LDIxMiwyNDUsLjM1KX1cbi5pdGVtLWNhcmRbZGF0YS1yYXJpdHk9XCJlcGljXCJde2JvcmRlcjoxcHggc29saWQgcmdiYSgxNzgsMTA3LDI1NSwuNCl9XG4uaXRlbS1jYXJkW2RhdGEtcmFyaXR5PVwibGVnZW5kYXJ5XCJde2JvcmRlcjoxcHggc29saWQgcmdiYSgyNDYsMTk2LDY5LC40NSl9XG4vKiB2ZXJ0aWNhbCB0aW1lbGluZSAqL1xuLnRpbWVsaW5le3Bvc2l0aW9uOnJlbGF0aXZlO21hcmdpbi10b3A6OHB4O3BhZGRpbmctbGVmdDoxNnB4fVxuLnRpbWVsaW5lOjpiZWZvcmV7Y29udGVudDpcIlwiO3Bvc2l0aW9uOmFic29sdXRlO2xlZnQ6NnB4O3RvcDowO2JvdHRvbTowO3dpZHRoOjJweDtiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjEpfVxuLnRpbWVsaW5lLWl0ZW17cG9zaXRpb246cmVsYXRpdmU7bWFyZ2luOjhweCAwIDhweCAwfVxuLnRpbWVsaW5lLWl0ZW0gLmRvdHtwb3NpdGlvbjphYnNvbHV0ZTtsZWZ0Oi0xMnB4O3RvcDoycHg7d2lkdGg6MTBweDtoZWlnaHQ6MTBweDtib3JkZXItcmFkaXVzOjk5OXB4O2JhY2tncm91bmQ6dmFyKC0tcmFyaXR5LXJhcmUpO2JveC1zaGFkb3c6MCAwIDEwcHggcmdiYSg3OSwyMTIsMjQ1LC41KX1cbi50aW1lbGluZS1pdGVtIC50aW1le29wYWNpdHk6Ljc1O2ZvbnQtc2l6ZToxMnB4fVxuLnRpbWVsaW5lLWl0ZW0gLmRlc2N7bWFyZ2luLXRvcDoycHh9XG4vKiBhY3Rpb24gYnV0dG9ucyBsaW5lICovXG4uYWN0aW9uc3tkaXNwbGF5OmZsZXg7Z2FwOjZweDtmbGV4LXdyYXA6d3JhcH1cbi8qIHN1YnRsZSBob3ZlciAqL1xuLmhvdmVyLWxpZnR7dHJhbnNpdGlvbjp0cmFuc2Zvcm0gdmFyKC0tZHVyKSB2YXIoLS1lYXNlKSwgYm94LXNoYWRvdyB2YXIoLS1kdXIpIHZhcigtLWVhc2UpfVxuLmhvdmVyLWxpZnQ6aG92ZXJ7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoLTFweCl9XG4vKiByaW5nIG1ldGVyICovXG4ucmluZ3stLXNpemU6MTE2cHg7LS10aGljazoxMHB4O3Bvc2l0aW9uOnJlbGF0aXZlO3dpZHRoOnZhcigtLXNpemUpO2hlaWdodDp2YXIoLS1zaXplKTtib3JkZXItcmFkaXVzOjUwJTtiYWNrZ3JvdW5kOmNvbmljLWdyYWRpZW50KCM3QjJDRjUgMGRlZywgcmdiYSgyNTUsMjU1LDI1NSwuMDgpIDBkZWcpfVxuLnJpbmc6OmFmdGVye2NvbnRlbnQ6XCJcIjtwb3NpdGlvbjphYnNvbHV0ZTtpbnNldDpjYWxjKHZhcigtLXRoaWNrKSk7Ym9yZGVyLXJhZGl1czppbmhlcml0O2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDE4MGRlZyxyZ2JhKDI1NSwyNTUsMjU1LC4wNikscmdiYSgyNTUsMjU1LDI1NSwuMDIpKX1cbi5yaW5nIC5sYWJlbHtwb3NpdGlvbjphYnNvbHV0ZTtpbnNldDowO2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OmNlbnRlcjtmb250LXdlaWdodDo3MDB9XG4vKiB0b2FzdCAqL1xuLnRvYXN0LXdyYXB7cG9zaXRpb246Zml4ZWQ7cmlnaHQ6MTZweDtib3R0b206MTZweDtkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDo4cHg7ei1pbmRleDo5OTk5fVxuLnRvYXN0e21heC13aWR0aDozNDBweDtwYWRkaW5nOjEwcHggMTJweDtib3JkZXItcmFkaXVzOjEycHg7Y29sb3I6I2ZmZjtiYWNrZ3JvdW5kOnJnYmEoMzAsMzAsNTAsLjk2KTtib3gtc2hhZG93OnZhcigtLWdsb3cpO3Bvc2l0aW9uOnJlbGF0aXZlO292ZXJmbG93OmhpZGRlbn1cbi50b2FzdC5zdWNjZXNze2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDE4MGRlZyxyZ2JhKDQ2LDE5NCwxMjYsLjE2KSxyZ2JhKDMwLDMwLDUwLC45NikpfVxuLnRvYXN0Lndhcm57YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTgwZGVnLHJnYmEoMjQ2LDE5Niw2OSwuMTgpLHJnYmEoMzAsMzAsNTAsLjk2KSl9XG4udG9hc3QuZXJyb3J7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTgwZGVnLHJnYmEoMjU1LDkyLDkyLC4xOCkscmdiYSgzMCwzMCw1MCwuOTYpKX1cbi50b2FzdCAubGlmZXtwb3NpdGlvbjphYnNvbHV0ZTtsZWZ0OjA7Ym90dG9tOjA7aGVpZ2h0OjJweDtiYWNrZ3JvdW5kOiM3QjJDRjU7YW5pbWF0aW9uOnRvYXN0LWxpZmUgdmFyKC0tbGlmZSwzLjVzKSBsaW5lYXIgZm9yd2FyZHN9XG5Aa2V5ZnJhbWVzIHRvYXN0LWxpZmV7ZnJvbXt3aWR0aDoxMDAlfXRve3dpZHRoOjB9fVxuQG1lZGlhIChwcmVmZXJzLXJlZHVjZWQtbW90aW9uOnJlZHVjZSl7KnthbmltYXRpb24tZHVyYXRpb246LjAwMW1zIWltcG9ydGFudDthbmltYXRpb24taXRlcmF0aW9uLWNvdW50OjEhaW1wb3J0YW50O3RyYW5zaXRpb24tZHVyYXRpb246MG1zIWltcG9ydGFudH19XG5cbi8qIHJlc3BvbnNpdmUgd2lkdGggKyBkZXNrdG9wIGdyaWQgbGF5b3V0IGZvciBmdWxsbmVzcyAqL1xuQG1lZGlhIChtaW4td2lkdGg6OTAwcHgpezpyb290ey0tY29udGFpbmVyLW1heDo5MjBweH19XG5AbWVkaWEgKG1pbi13aWR0aDoxMjAwcHgpezpyb290ey0tY29udGFpbmVyLW1heDoxMDgwcHh9fVxuXG4uY29udGFpbmVyLmdyaWQtMntkaXNwbGF5OmdyaWQ7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOjFmcjtnYXA6MTJweH1cbkBtZWRpYSAobWluLXdpZHRoOjk4MHB4KXtcbiAgLmNvbnRhaW5lci5ncmlkLTJ7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOjFmciAxZnI7YWxpZ24taXRlbXM6c3RhcnR9XG4gIC5jb250YWluZXIuZ3JpZC0yPi5jYXJkOmZpcnN0LWNoaWxke2dyaWQtY29sdW1uOjEvLTF9XG59XG5cbi8qIGRlY29yYXRpdmUgcGFnZSBvdmVybGF5czogYXVyb3JhLCBncmlkIGxpbmVzLCBib3R0b20gZ2xvdyAqL1xuaHRtbDo6YmVmb3Jle2NvbnRlbnQ6XCJcIjtwb3NpdGlvbjpmaXhlZDtpbnNldDowO3BvaW50ZXItZXZlbnRzOm5vbmU7ei1pbmRleDotMjtvcGFjaXR5Oi4wMzU7YmFja2dyb3VuZC1pbWFnZTpsaW5lYXItZ3JhZGllbnQocmdiYSgyNTUsMjU1LDI1NSwuMDQpIDFweCwgdHJhbnNwYXJlbnQgMXB4KSxsaW5lYXItZ3JhZGllbnQoOTBkZWcsIHJnYmEoMjU1LDI1NSwyNTUsLjA0KSAxcHgsIHRyYW5zcGFyZW50IDFweCk7YmFja2dyb3VuZC1zaXplOjI0cHggMjRweH1cbmJvZHk6OmJlZm9yZXtjb250ZW50OlwiXCI7cG9zaXRpb246Zml4ZWQ7cmlnaHQ6LTEwdnc7dG9wOi0xOHZoO3dpZHRoOjcwdnc7aGVpZ2h0Ojcwdmg7cG9pbnRlci1ldmVudHM6bm9uZTt6LWluZGV4Oi0xO2ZpbHRlcjpibHVyKDUwcHgpO29wYWNpdHk6LjU1O2JhY2tncm91bmQ6cmFkaWFsLWdyYWRpZW50KGNsb3Nlc3Qtc2lkZSBhdCAyNSUgNDAlLCByZ2JhKDEyMyw0NCwyNDUsLjM1KSwgdHJhbnNwYXJlbnQgNjUlKSwgcmFkaWFsLWdyYWRpZW50KGNsb3Nlc3Qtc2lkZSBhdCA3MCUgNjAlLCByZ2JhKDQ0LDEzNywyNDUsLjI1KSwgdHJhbnNwYXJlbnQgNzAlKTttaXgtYmxlbmQtbW9kZTpzY3JlZW47YW5pbWF0aW9uOmF1cm9yYS1hIDE4cyBlYXNlLWluLW91dCBpbmZpbml0ZSBhbHRlcm5hdGV9XG5ib2R5OjphZnRlcntjb250ZW50OlwiXCI7cG9zaXRpb246Zml4ZWQ7bGVmdDotMTB2dztib3R0b206LTIydmg7d2lkdGg6MTIwdnc7aGVpZ2h0OjYwdmg7cG9pbnRlci1ldmVudHM6bm9uZTt6LWluZGV4Oi0xO2ZpbHRlcjpibHVyKDYwcHgpO29wYWNpdHk6Ljc1O2JhY2tncm91bmQ6cmFkaWFsLWdyYWRpZW50KDEyMHZ3IDYwdmggYXQgNTAlIDEwMCUsIHJnYmEoNDQsMTM3LDI0NSwuMjIpLCB0cmFuc3BhcmVudCA2NSUpLCBjb25pYy1ncmFkaWVudChmcm9tIDIwMGRlZyBhdCA1MCUgNzUlLCByZ2JhKDEyMyw0NCwyNDUsLjE4KSwgcmdiYSg0NCwxMzcsMjQ1LC4xMiksIHRyYW5zcGFyZW50IDcwJSk7bWl4LWJsZW5kLW1vZGU6c2NyZWVuO2FuaW1hdGlvbjphdXJvcmEtYiAyMnMgZWFzZS1pbi1vdXQgaW5maW5pdGUgYWx0ZXJuYXRlfVxuQGtleWZyYW1lcyBhdXJvcmEtYXswJXt0cmFuc2Zvcm06dHJhbnNsYXRlWSgwKX0xMDAle3RyYW5zZm9ybTp0cmFuc2xhdGVZKDE0cHgpfX1cbkBrZXlmcmFtZXMgYXVyb3JhLWJ7MCV7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoMCl9MTAwJXt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtMTJweCl9fVxuYDtcbiAgY29uc3Qgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICBzdHlsZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtdWknLCAnbWluZXItZ2FtZScpO1xuICBzdHlsZS50ZXh0Q29udGVudCA9IGNzcztcbiAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gIGluamVjdGVkID0gdHJ1ZTtcblxuICAvLyBzb2Z0IHN0YXJmaWVsZCBiYWNrZ3JvdW5kICh2ZXJ5IGxpZ2h0KVxuICB0cnkge1xuICAgIGNvbnN0IGV4aXN0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXN0YXJzXScpO1xuICAgIGlmICghZXhpc3RzKSB7XG4gICAgICBjb25zdCBjdnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICAgIGN2cy5zZXRBdHRyaWJ1dGUoJ2RhdGEtc3RhcnMnLCAnJyk7XG4gICAgICBjdnMuc3R5bGUuY3NzVGV4dCA9ICdwb3NpdGlvbjpmaXhlZDtpbnNldDowO3otaW5kZXg6LTI7b3BhY2l0eTouNDA7cG9pbnRlci1ldmVudHM6bm9uZTsnO1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjdnMpO1xuICAgICAgY29uc3QgY3R4ID0gY3ZzLmdldENvbnRleHQoJzJkJyk7XG4gICAgICBjb25zdCBzdGFycyA9IEFycmF5LmZyb20oeyBsZW5ndGg6IDgwIH0sICgpID0+ICh7IHg6IE1hdGgucmFuZG9tKCksIHk6IE1hdGgucmFuZG9tKCksIHI6IE1hdGgucmFuZG9tKCkqMS4yKzAuMiwgczogTWF0aC5yYW5kb20oKSowLjgrMC4yIH0pKTtcbiAgICAgIHR5cGUgTWV0ZW9yID0geyB4OiBudW1iZXI7IHk6IG51bWJlcjsgdng6IG51bWJlcjsgdnk6IG51bWJlcjsgbGlmZTogbnVtYmVyOyB0dGw6IG51bWJlciB9O1xuICAgICAgY29uc3QgbWV0ZW9yczogTWV0ZW9yW10gPSBbXTtcbiAgICAgIGNvbnN0IHNwYXduTWV0ZW9yID0gKCkgPT4ge1xuICAgICAgICBjb25zdCB4ID0gTWF0aC5yYW5kb20oKSpjdnMud2lkdGgqMC42ICsgY3ZzLndpZHRoKjAuMjtcbiAgICAgICAgY29uc3QgeSA9IC0yMDsgLy8gZnJvbSB0b3BcbiAgICAgICAgY29uc3Qgc3BlZWQgPSAzICsgTWF0aC5yYW5kb20oKSozO1xuICAgICAgICBjb25zdCBhbmdsZSA9IE1hdGguUEkqMC44ICsgTWF0aC5yYW5kb20oKSowLjI7IC8vIGRpYWdvbmFsbHlcbiAgICAgICAgbWV0ZW9ycy5wdXNoKHsgeCwgeSwgdng6IE1hdGguY29zKGFuZ2xlKSpzcGVlZCwgdnk6IE1hdGguc2luKGFuZ2xlKSpzcGVlZCwgbGlmZTogMCwgdHRsOiAxMjAwICsgTWF0aC5yYW5kb20oKSo4MDAgfSk7XG4gICAgICB9O1xuICAgICAgLy8gZ2VudGxlIHBsYW5ldHMvb3Jic1xuICAgICAgY29uc3Qgb3JicyA9IEFycmF5LmZyb20oeyBsZW5ndGg6IDIgfSwgKCkgPT4gKHsgeDogTWF0aC5yYW5kb20oKSwgeTogTWF0aC5yYW5kb20oKSowLjUgKyAwLjEsIHI6IE1hdGgucmFuZG9tKCkqODAgKyA3MCwgaHVlOiBNYXRoLnJhbmRvbSgpIH0pKTtcbiAgICAgIGNvbnN0IGZpdCA9ICgpID0+IHsgY3ZzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7IGN2cy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7IH07XG4gICAgICBmaXQoKTtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBmaXQpO1xuICAgICAgbGV0IHQgPSAwO1xuICAgICAgY29uc3QgbG9vcCA9ICgpID0+IHtcbiAgICAgICAgaWYgKCFjdHgpIHJldHVybjtcbiAgICAgICAgdCArPSAwLjAxNjtcbiAgICAgICAgY3R4LmNsZWFyUmVjdCgwLDAsY3ZzLndpZHRoLGN2cy5oZWlnaHQpO1xuICAgICAgICAvLyBzb2Z0IG9yYnNcbiAgICAgICAgZm9yIChjb25zdCBvYiBvZiBvcmJzKSB7XG4gICAgICAgICAgY29uc3QgeCA9IG9iLnggKiBjdnMud2lkdGgsIHkgPSBvYi55ICogY3ZzLmhlaWdodDtcbiAgICAgICAgICBjb25zdCBwdWxzZSA9IChNYXRoLnNpbih0KjAuNiArIHgqMC4wMDE1KSowLjUrMC41KSowLjEyO1xuICAgICAgICAgIGNvbnN0IHJhZCA9IG9iLnIgKiAoMStwdWxzZSk7XG4gICAgICAgICAgY29uc3QgZ3JhZCA9IGN0eC5jcmVhdGVSYWRpYWxHcmFkaWVudCh4LCB5LCAwLCB4LCB5LCByYWQpO1xuICAgICAgICAgIGdyYWQuYWRkQ29sb3JTdG9wKDAsICdyZ2JhKDExMCw4MCwyNTUsMC4xMCknKTtcbiAgICAgICAgICBncmFkLmFkZENvbG9yU3RvcCgxLCAncmdiYSgwLDAsMCwwKScpO1xuICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBncmFkO1xuICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgICBjdHguYXJjKHgsIHksIHJhZCwgMCwgTWF0aC5QSSoyKTtcbiAgICAgICAgICBjdHguZmlsbCgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIHN0YXJzIHR3aW5rbGVcbiAgICAgICAgZm9yIChjb25zdCBzdCBvZiBzdGFycykge1xuICAgICAgICAgIGNvbnN0IHggPSBzdC54ICogY3ZzLndpZHRoLCB5ID0gc3QueSAqIGN2cy5oZWlnaHQ7XG4gICAgICAgICAgY29uc3QgdHcgPSAoTWF0aC5zaW4odCoxLjYgKyB4KjAuMDAyICsgeSowLjAwMykqMC41KzAuNSkqMC41KzAuNTtcbiAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgY3R4LmFyYyh4LCB5LCBzdC5yICsgdHcqMC42LCAwLCBNYXRoLlBJKjIpO1xuICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAncmdiYSgxODAsMjAwLDI1NSwwLjYpJztcbiAgICAgICAgICBjdHguZmlsbCgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIG1ldGVvcnNcbiAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPCAwLjAxNSAmJiBtZXRlb3JzLmxlbmd0aCA8IDIpIHNwYXduTWV0ZW9yKCk7XG4gICAgICAgIGZvciAobGV0IGk9bWV0ZW9ycy5sZW5ndGgtMTsgaT49MDsgaS0tKSB7XG4gICAgICAgICAgY29uc3QgbSA9IG1ldGVvcnNbaV07XG4gICAgICAgICAgbS54ICs9IG0udng7IG0ueSArPSBtLnZ5OyBtLmxpZmUgKz0gMTY7XG4gICAgICAgICAgLy8gdHJhaWxcbiAgICAgICAgICBjb25zdCB0cmFpbCA9IGN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudChtLngsIG0ueSwgbS54IC0gbS52eCo4LCBtLnkgLSBtLnZ5KjgpO1xuICAgICAgICAgIHRyYWlsLmFkZENvbG9yU3RvcCgwLCAncmdiYSgyNTUsMjU1LDI1NSwwLjkpJyk7XG4gICAgICAgICAgdHJhaWwuYWRkQ29sb3JTdG9wKDEsICdyZ2JhKDE1MCwxODAsMjU1LDApJyk7XG4gICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gdHJhaWw7XG4gICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IDI7XG4gICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgIGN0eC5tb3ZlVG8obS54IC0gbS52eCoxMCwgbS55IC0gbS52eSoxMCk7XG4gICAgICAgICAgY3R4LmxpbmVUbyhtLngsIG0ueSk7XG4gICAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgICAgIGlmIChtLnkgPiBjdnMuaGVpZ2h0ICsgNDAgfHwgbS54IDwgLTQwIHx8IG0ueCA+IGN2cy53aWR0aCArIDQwIHx8IG0ubGlmZSA+IG0udHRsKSB7XG4gICAgICAgICAgICBtZXRlb3JzLnNwbGljZShpLDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcCk7XG4gICAgICB9O1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3ApO1xuICAgIH1cbiAgfSBjYXRjaCB7fVxufVxuIiwgImltcG9ydCB7IExvZ2luU2NlbmUgfSBmcm9tICcuL3NjZW5lcy9Mb2dpblNjZW5lJztcbmltcG9ydCB7IE1haW5TY2VuZSB9IGZyb20gJy4vc2NlbmVzL01haW5TY2VuZSc7XG5pbXBvcnQgeyBHYW1lTWFuYWdlciB9IGZyb20gJy4vY29yZS9HYW1lTWFuYWdlcic7XG5pbXBvcnQgeyBXYXJlaG91c2VTY2VuZSB9IGZyb20gJy4vc2NlbmVzL1dhcmVob3VzZVNjZW5lJztcbmltcG9ydCB7IFBsdW5kZXJTY2VuZSB9IGZyb20gJy4vc2NlbmVzL1BsdW5kZXJTY2VuZSc7XG5pbXBvcnQgeyBFeGNoYW5nZVNjZW5lIH0gZnJvbSAnLi9zY2VuZXMvRXhjaGFuZ2VTY2VuZSc7XG5pbXBvcnQgeyBSYW5raW5nU2NlbmUgfSBmcm9tICcuL3NjZW5lcy9SYW5raW5nU2NlbmUnO1xuaW1wb3J0IHsgZW5zdXJlR2xvYmFsU3R5bGVzIH0gZnJvbSAnLi9zdHlsZXMvaW5qZWN0JztcblxuZnVuY3Rpb24gcm91dGVUbyhjb250YWluZXI6IEhUTUxFbGVtZW50KSB7XG4gIGNvbnN0IGggPSBsb2NhdGlvbi5oYXNoIHx8ICcjL2xvZ2luJztcbiAgY29uc3Qgc2NlbmUgPSBoLnNwbGl0KCc/JylbMF07XG4gIHN3aXRjaCAoc2NlbmUpIHtcbiAgICBjYXNlICcjL21haW4nOlxuICAgICAgbmV3IE1haW5TY2VuZSgpLm1vdW50KGNvbnRhaW5lcik7XG4gICAgICBicmVhaztcbiAgICBjYXNlICcjL3dhcmVob3VzZSc6XG4gICAgICBuZXcgV2FyZWhvdXNlU2NlbmUoKS5tb3VudChjb250YWluZXIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnIy9wbHVuZGVyJzpcbiAgICAgIG5ldyBQbHVuZGVyU2NlbmUoKS5tb3VudChjb250YWluZXIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnIy9leGNoYW5nZSc6XG4gICAgICBuZXcgRXhjaGFuZ2VTY2VuZSgpLm1vdW50KGNvbnRhaW5lcik7XG4gICAgICBicmVhaztcbiAgICBjYXNlICcjL3JhbmtpbmcnOlxuICAgICAgbmV3IFJhbmtpbmdTY2VuZSgpLm1vdW50KGNvbnRhaW5lcik7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgbmV3IExvZ2luU2NlbmUoKS5tb3VudChjb250YWluZXIpO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBib290c3RyYXAoY29udGFpbmVyOiBIVE1MRWxlbWVudCkge1xuICBlbnN1cmVHbG9iYWxTdHlsZXMoKTtcbiAgcm91dGVUbyhjb250YWluZXIpO1xuICB3aW5kb3cub25oYXNoY2hhbmdlID0gKCkgPT4gcm91dGVUbyhjb250YWluZXIpO1xufVxuXG4vLyBcdTRGQkZcdTYzNzdcdTU0MkZcdTUyQThcdUZGMDhcdTdGNTFcdTk4NzVcdTczQUZcdTU4ODNcdUZGMDlcbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAod2luZG93IGFzIGFueSkuTWluZXJBcHAgPSB7IGJvb3RzdHJhcCwgR2FtZU1hbmFnZXIgfTtcbn1cblxyXG5cclxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7O0FBQU8sTUFBTSxrQkFBTixNQUFNLGdCQUFlO0FBQUEsSUFBckI7QUFJTCwwQkFBUSxTQUF1QjtBQUFBO0FBQUEsSUFGL0IsV0FBVyxJQUFvQjtBQUZqQztBQUVtQyxjQUFPLFVBQUssY0FBTCxZQUFtQixLQUFLLFlBQVksSUFBSSxnQkFBZTtBQUFBLElBQUk7QUFBQSxJQUduRyxTQUFTLEdBQWtCO0FBQUUsV0FBSyxRQUFRO0FBQUEsSUFBRztBQUFBLElBRTdDLE1BQU0sUUFBVyxNQUFjLE1BQWdDO0FBQzdELFlBQU0sVUFBZSxFQUFFLGdCQUFnQixvQkFBb0IsSUFBSSw2QkFBTSxZQUFXLENBQUMsRUFBRztBQUNwRixVQUFJLEtBQUssTUFBTyxTQUFRLGVBQWUsSUFBSSxVQUFVLEtBQUssS0FBSztBQUMvRCxZQUFNLE1BQU0sTUFBTSxNQUFNLEtBQUssUUFBUSxJQUFJLE1BQU0sRUFBRSxHQUFHLE1BQU0sUUFBUSxDQUFDO0FBQ25FLFlBQU0sT0FBTyxNQUFNLElBQUksS0FBSztBQUM1QixVQUFJLENBQUMsSUFBSSxNQUFNLEtBQUssUUFBUSxJQUFLLE9BQU0sSUFBSSxNQUFNLEtBQUssV0FBVyxlQUFlO0FBQ2hGLGFBQU8sS0FBSztBQUFBLElBQ2Q7QUFBQSxJQUVBLFVBQWtCO0FBQ2hCLGFBQVEsT0FBZSxnQkFBZ0I7QUFBQSxJQUN6QztBQUFBLEVBQ0Y7QUFsQkUsZ0JBRFcsaUJBQ0k7QUFEVixNQUFNLGlCQUFOOzs7QUNJQSxNQUFNLGVBQU4sTUFBTSxhQUFZO0FBQUEsSUFBbEI7QUFJTCwwQkFBUSxXQUEwQjtBQUFBO0FBQUEsSUFGbEMsV0FBVyxJQUFpQjtBQU45QjtBQU1nQyxjQUFPLFVBQUssY0FBTCxZQUFtQixLQUFLLFlBQVksSUFBSSxhQUFZO0FBQUEsSUFBSTtBQUFBLElBRzdGLGFBQTZCO0FBQUUsYUFBTyxLQUFLO0FBQUEsSUFBUztBQUFBLElBRXBELE1BQU0sZ0JBQWdCLFVBQWtCLFVBQWlDO0FBQ3ZFLFlBQU0sS0FBSyxlQUFlO0FBQzFCLFVBQUk7QUFDRixjQUFNLElBQUksTUFBTSxHQUFHLFFBQTZDLGVBQWUsRUFBRSxRQUFRLFFBQVEsTUFBTSxLQUFLLFVBQVUsRUFBRSxVQUFVLFNBQVMsQ0FBQyxFQUFFLENBQUM7QUFDL0ksV0FBRyxTQUFTLEVBQUUsWUFBWTtBQUFBLE1BQzVCLFNBQVE7QUFDTixjQUFNLElBQUksTUFBTSxlQUFlLEVBQUUsUUFBNkMsa0JBQWtCLEVBQUUsUUFBUSxRQUFRLE1BQU0sS0FBSyxVQUFVLEVBQUUsVUFBVSxTQUFTLENBQUMsRUFBRSxDQUFDO0FBQ2hLLHVCQUFlLEVBQUUsU0FBUyxFQUFFLFlBQVk7QUFBQSxNQUMxQztBQUNBLFdBQUssVUFBVSxNQUFNLEdBQUcsUUFBaUIsZUFBZTtBQUFBLElBQzFEO0FBQUEsRUFDRjtBQWpCRSxnQkFEVyxjQUNJO0FBRFYsTUFBTSxjQUFOOzs7QUNKQSxXQUFTLEtBQUssVUFBK0I7QUFDbEQsVUFBTSxNQUFNLFNBQVMsY0FBYyxLQUFLO0FBQ3hDLFFBQUksWUFBWSxTQUFTLEtBQUs7QUFDOUIsV0FBTyxJQUFJO0FBQUEsRUFDYjtBQUVPLFdBQVMsR0FBb0MsTUFBa0IsS0FBZ0I7QUFDcEYsVUFBTSxLQUFLLEtBQUssY0FBYyxHQUFHO0FBQ2pDLFFBQUksQ0FBQyxHQUFJLE9BQU0sSUFBSSxNQUFNLG9CQUFvQixHQUFHLEVBQUU7QUFDbEQsV0FBTztBQUFBLEVBQ1Q7OztBQ3FCQSxXQUFTLEtBQUssSUFBWTtBQUN4QixXQUFPO0FBQUEsMEJBQ2lCLEVBQUU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBSzVCO0FBRUEsV0FBUyxRQUFRLE1BQWMsT0FBTyxJQUFJLE1BQU0sSUFBaUI7QUFDL0QsVUFBTSxNQUFNLFFBQVEsS0FBSyxPQUFPLEVBQUUsU0FBUyxFQUFFLEVBQUUsTUFBTSxHQUFHLENBQUM7QUFDekQsVUFBTSxLQUFLLEtBQUsscUJBQXFCLEdBQUcsd0JBQ3RDLGVBQWUsSUFBSSxhQUFhLElBQUksd0VBQXdFLEtBQUssR0FBRyxDQUFDLEdBQUcsS0FBSyxXQUFXLFlBQVksUUFBUSxHQUFHLEdBQUcsQ0FBQyxRQUNySyxTQUFTO0FBQ1QsV0FBTztBQUFBLEVBQ1Q7QUFFTyxXQUFTLFdBQVcsTUFBZ0IsT0FBOEMsQ0FBQyxHQUFHO0FBaEQ3RjtBQWlERSxVQUFNLFFBQU8sVUFBSyxTQUFMLFlBQWE7QUFDMUIsVUFBTSxPQUFNLFVBQUssY0FBTCxZQUFrQjtBQUM5QixVQUFNLFNBQVM7QUFDZixVQUFNLE9BQU87QUFFYixZQUFRLE1BQU07QUFBQSxNQUNaLEtBQUs7QUFDSCxlQUFPLFFBQVEsZ0NBQWdDLE1BQU0sa0NBQWtDLE1BQU0sOEJBQThCLE1BQU0sTUFBTSxNQUFNLEdBQUc7QUFBQSxNQUNsSixLQUFLO0FBQ0gsZUFBTyxRQUFRLDREQUE0RCxNQUFNLGdDQUFnQyxNQUFNLE1BQU0sTUFBTSxHQUFHO0FBQUEsTUFDeEksS0FBSztBQUNILGVBQU8sUUFBUSxtREFBbUQsTUFBTSxNQUFNLE1BQU0sR0FBRztBQUFBLE1BQ3pGLEtBQUs7QUFDSCxlQUFPLFFBQVEsc0NBQXNDLE1BQU0sTUFBTSxNQUFNLEdBQUc7QUFBQSxNQUM1RSxLQUFLO0FBQ0gsZUFBTyxRQUFRLHNDQUFzQyxNQUFNLGdEQUFnRCxJQUFJLE1BQU8sTUFBTSxHQUFHO0FBQUEsTUFDakksS0FBSztBQUNILGVBQU8sUUFBUSw0Q0FBNEMsTUFBTSx5Q0FBeUMsTUFBTSxNQUFNLE1BQU0sR0FBRztBQUFBLE1BQ2pJLEtBQUs7QUFDSCxlQUFPLFFBQVEsbUNBQW1DLE1BQU0sd0NBQXdDLE1BQU0sTUFBTSxNQUFNLEdBQUc7QUFBQSxNQUN2SCxLQUFLO0FBQ0gsZUFBTyxRQUFRLDJEQUEyRCxNQUFNLDBCQUEwQixNQUFNLE1BQU0sTUFBTSxHQUFHO0FBQUEsTUFDakksS0FBSztBQUNILGVBQU8sUUFBUSxxQ0FBcUMsTUFBTSwyQkFBMkIsTUFBTSxNQUFNLE1BQU0sR0FBRztBQUFBLE1BQzVHLEtBQUs7QUFDSCxlQUFPLFFBQVEsZ0NBQWdDLE1BQU0sTUFBTSxNQUFNLEdBQUc7QUFBQSxNQUN0RSxLQUFLO0FBQ0gsZUFBTyxRQUFRLG1EQUFtRCxNQUFNLE1BQU0sTUFBTSxHQUFHO0FBQUEsTUFDekYsS0FBSztBQUNILGVBQU8sUUFBUSxzQkFBc0IsTUFBTSw2QkFBNkIsTUFBTSx3QkFBd0IsTUFBTSxNQUFNLE1BQU0sR0FBRztBQUFBLE1BQzdILEtBQUs7QUFDSCxlQUFPLFFBQVEsMkVBQTJFLE1BQU0sTUFBTSxNQUFNLEdBQUc7QUFBQSxNQUNqSCxLQUFLO0FBQ0gsZUFBTyxRQUFRLDhEQUE4RCxNQUFNLE1BQU0sTUFBTSxHQUFHO0FBQUEsTUFDcEcsS0FBSztBQUNILGVBQU8sUUFBUSxxQ0FBcUMsTUFBTSwwQ0FBMEMsTUFBTSxNQUFNLE1BQU0sR0FBRztBQUFBLE1BQzNILEtBQUs7QUFDSCxlQUFPLFFBQVEsNkNBQTZDLE1BQU0sa0NBQWtDLE1BQU0sTUFBTSxNQUFNLEdBQUc7QUFBQSxNQUMzSCxLQUFLO0FBQ0gsZUFBTyxRQUFRLG9EQUFvRCxNQUFNLHFDQUFxQyxNQUFNLE1BQU0sTUFBTSxHQUFHO0FBQUEsTUFDckksS0FBSztBQUNILGVBQU8sUUFBUSwwREFBMEQsTUFBTSxtQ0FBbUMsTUFBTSxNQUFNLE1BQU0sR0FBRztBQUFBLE1BQ3pJLEtBQUs7QUFDSCxlQUFPLFFBQVEsMERBQTBELE1BQU0sbUNBQW1DLE1BQU0sMEJBQTBCLE1BQU0sTUFBTSxNQUFNLEdBQUc7QUFBQSxNQUN6SyxLQUFLO0FBQ0gsZUFBTyxRQUFRLGlEQUFpRCxNQUFNLE1BQU0sTUFBTSxHQUFHO0FBQUEsTUFDdkYsS0FBSztBQUNILGVBQU8sUUFBUSxzREFBc0QsTUFBTSw2REFBNkQsTUFBTSxNQUFNLE1BQU0sR0FBRztBQUFBLE1BQy9KLEtBQUs7QUFDSCxlQUFPLFFBQVEsbUNBQW1DLE1BQU0sMkJBQTJCLE1BQU0sTUFBTSxNQUFNLEdBQUc7QUFBQSxNQUMxRyxLQUFLO0FBQ0gsZUFBTyxRQUFRLDRDQUE0QyxNQUFNLE1BQU0sTUFBTSxHQUFHO0FBQUEsTUFDbEYsS0FBSztBQUNILGVBQU8sUUFBUSwrQ0FBK0MsTUFBTSxNQUFNLE1BQU0sR0FBRztBQUFBLE1BQ3JGLEtBQUs7QUFDSCxlQUFPLFFBQVEsa0NBQWtDLE1BQU0sTUFBTSxNQUFNLEdBQUc7QUFBQSxNQUN4RSxLQUFLO0FBQ0gsZUFBTyxRQUFRLG1DQUFtQyxNQUFNLE1BQU0sTUFBTSxHQUFHO0FBQUEsTUFDekUsS0FBSztBQUNILGVBQU8sUUFBUSxtQ0FBbUMsTUFBTSxxQ0FBcUMsTUFBTSw4Q0FBOEMsTUFBTSxNQUFNLE1BQU0sR0FBRztBQUFBLE1BQ3hLLEtBQUs7QUFDSCxlQUFPLFFBQVEsb0NBQW9DLE1BQU0sZ0NBQWdDLE1BQU0sd0JBQXdCLE1BQU0sTUFBTSxNQUFNLEdBQUc7QUFBQSxNQUM5SSxLQUFLO0FBQ0gsZUFBTyxRQUFRLG1DQUFtQyxNQUFNLHdCQUF3QixNQUFNLHlCQUF5QixNQUFNLE1BQU0sTUFBTSxHQUFHO0FBQUEsTUFDdEk7QUFDRSxlQUFPLFFBQVEsaUNBQWlDLE1BQU0sTUFBTSxNQUFNLEdBQUc7QUFBQSxJQUN6RTtBQUFBLEVBQ0Y7OztBQ2xIQSxNQUFJLE9BQTJCO0FBRS9CLFdBQVMsWUFBeUI7QUFDaEMsUUFBSSxLQUFNLFFBQU87QUFDakIsVUFBTSxNQUFNLFNBQVMsY0FBYyxLQUFLO0FBQ3hDLFFBQUksWUFBWTtBQUNoQixhQUFTLEtBQUssWUFBWSxHQUFHO0FBQzdCLFdBQU87QUFDUCxXQUFPO0FBQUEsRUFDVDtBQUtPLFdBQVMsVUFBVSxNQUFjLE1BQWlDO0FBQ3ZFLFVBQU0sTUFBTSxVQUFVO0FBQ3RCLFVBQU0sT0FBTyxTQUFTLGNBQWMsS0FBSztBQUN6QyxRQUFJO0FBQ0osUUFBSSxXQUFXO0FBQ2YsUUFBSSxPQUFPLFNBQVMsU0FBVSxRQUFPO0FBQUEsYUFDNUIsTUFBTTtBQUFFLGFBQU8sS0FBSztBQUFNLFVBQUksS0FBSyxTQUFVLFlBQVcsS0FBSztBQUFBLElBQVU7QUFDaEYsU0FBSyxZQUFZLFdBQVcsT0FBTyxNQUFNLE9BQU87QUFFaEQsUUFBSTtBQUNGLFlBQU0sT0FBTyxTQUFTLGNBQWMsS0FBSztBQUN6QyxXQUFLLE1BQU0sVUFBVTtBQUNyQixXQUFLLE1BQU0sTUFBTTtBQUNqQixXQUFLLE1BQU0sYUFBYTtBQUN4QixZQUFNLFVBQVUsU0FBUyxZQUFZLFNBQVMsU0FBUyxTQUFTLFVBQVUsU0FBUyxVQUFVLFVBQVU7QUFDdkcsWUFBTSxVQUFVLFNBQVMsY0FBYyxNQUFNO0FBQzdDLGNBQVEsWUFBWSxXQUFXLFNBQVMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ3JELFlBQU0sTUFBTSxTQUFTLGNBQWMsS0FBSztBQUN4QyxVQUFJLGNBQWM7QUFDbEIsV0FBSyxZQUFZLE9BQU87QUFDeEIsV0FBSyxZQUFZLEdBQUc7QUFDcEIsV0FBSyxZQUFZLElBQUk7QUFBQSxJQUN2QixTQUFRO0FBQ04sV0FBSyxjQUFjO0FBQUEsSUFDckI7QUFDQSxVQUFNLE9BQU8sU0FBUyxjQUFjLEdBQUc7QUFDdkMsU0FBSyxZQUFZO0FBQ2pCLFNBQUssTUFBTSxZQUFZLFVBQVUsV0FBVyxJQUFJO0FBQ2hELFNBQUssWUFBWSxJQUFJO0FBQ3JCLFFBQUksUUFBUSxJQUFJO0FBRWhCLFVBQU0sT0FBTyxNQUFNO0FBQUUsV0FBSyxNQUFNLFVBQVU7QUFBSyxXQUFLLE1BQU0sYUFBYTtBQUFnQixpQkFBVyxNQUFNLEtBQUssT0FBTyxHQUFHLEdBQUc7QUFBQSxJQUFHO0FBQzdILFVBQU0sUUFBUSxPQUFPLFdBQVcsTUFBTSxRQUFRO0FBQzlDLFNBQUssaUJBQWlCLFNBQVMsTUFBTTtBQUFFLG1CQUFhLEtBQUs7QUFBRyxXQUFLO0FBQUEsSUFBRyxDQUFDO0FBQUEsRUFDdkU7OztBQzdDTyxNQUFNLGFBQU4sTUFBaUI7QUFBQSxJQUN0QixNQUFNLE1BQW1CO0FBQ3ZCLFlBQU1BLFFBQU8sS0FBSztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxLQWtCakI7QUFDRCxXQUFLLFlBQVk7QUFDakIsV0FBSyxZQUFZQSxLQUFJO0FBRXJCLFlBQU0sTUFBTSxHQUFxQkEsT0FBTSxJQUFJO0FBQzNDLFlBQU0sTUFBTSxHQUFxQkEsT0FBTSxJQUFJO0FBQzNDLFlBQU0sS0FBSyxHQUFzQkEsT0FBTSxLQUFLO0FBQzVDLFlBQU0sU0FBUyxHQUFzQkEsT0FBTSxTQUFTO0FBRXBELFlBQU0sU0FBUyxZQUFZO0FBQ3pCLGNBQU0sWUFBWSxJQUFJLFNBQVMsSUFBSSxLQUFLO0FBQ3hDLGNBQU0sWUFBWSxJQUFJLFNBQVMsSUFBSSxLQUFLO0FBQ3hDLFlBQUksQ0FBQyxZQUFZLENBQUMsVUFBVTtBQUMxQixvQkFBVSwwREFBYSxNQUFNO0FBQzdCO0FBQUEsUUFDRjtBQUNBLFdBQUcsV0FBVztBQUNkLFdBQUcsY0FBYztBQUNqQixZQUFJO0FBQ0YsZ0JBQU0sWUFBWSxFQUFFLGdCQUFnQixVQUFVLFFBQVE7QUFDdEQsbUJBQVMsT0FBTztBQUFBLFFBQ2xCLFNBQVMsR0FBUTtBQUNmLHFCQUFVLHVCQUFHLFlBQVcsb0RBQVksT0FBTztBQUFBLFFBQzdDLFVBQUU7QUFDQSxhQUFHLFdBQVc7QUFDZCxhQUFHLGNBQWM7QUFBQSxRQUNuQjtBQUFBLE1BQ0Y7QUFFQSxTQUFHLFVBQVU7QUFDYixVQUFJLFVBQVUsQ0FBQyxNQUFNO0FBQUUsWUFBSyxFQUFvQixRQUFRLFFBQVMsUUFBTztBQUFBLE1BQUc7QUFDM0UsVUFBSSxVQUFVLENBQUMsTUFBTTtBQUFFLFlBQUssRUFBb0IsUUFBUSxRQUFTLFFBQU87QUFBQSxNQUFHO0FBQzNFLGFBQU8sVUFBVSxNQUFNO0FBQ3JCLGNBQU0sUUFBUSxJQUFJLFNBQVM7QUFDM0IsWUFBSSxPQUFPLFFBQVEsU0FBUztBQUM1QixlQUFPLFlBQVk7QUFDbkIsZUFBTyxZQUFZLFdBQVcsUUFBUSxZQUFZLE9BQU8sRUFBRSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ3RFLGVBQU8sWUFBWSxTQUFTLGVBQWUsUUFBUSxpQkFBTyxjQUFJLENBQUM7QUFBQSxNQUNqRTtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBRUksTUFBSTtBQUNGLFNBQUssaUJBQWlCLFlBQVksRUFDL0IsUUFBUSxDQUFDLE9BQU87QUFDZixZQUFNLE9BQVEsR0FBbUIsYUFBYSxVQUFVO0FBQ3hELFVBQUk7QUFBRSxXQUFHLFlBQVksV0FBVyxNQUFNLEVBQUUsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUFBLE1BQUcsU0FBUTtBQUFBLE1BQUM7QUFBQSxJQUNqRSxDQUFDO0FBQUEsRUFDTCxTQUFRO0FBQUEsRUFBQzs7O0FDekVOLE1BQU0sV0FBWSxPQUFlLGdCQUFnQjtBQUNqRCxNQUFNLGNBQWUsT0FBZSxtQkFBbUI7OztBQ0d2RCxNQUFNLGtCQUFOLE1BQU0sZ0JBQWU7QUFBQSxJQUFyQjtBQU1MLDBCQUFRLFVBQXFCO0FBQzdCLDBCQUFRLFlBQXNDLENBQUM7QUFBQTtBQUFBLElBTC9DLFdBQVcsSUFBb0I7QUFOakM7QUFPSSxjQUFPLFVBQUssY0FBTCxZQUFtQixLQUFLLFlBQVksSUFBSSxnQkFBZTtBQUFBLElBQ2hFO0FBQUEsSUFLQSxRQUFRLE9BQWU7QUFDckIsWUFBTSxJQUFJO0FBQ1YsVUFBSSxFQUFFLElBQUk7QUFDUixZQUFJLEtBQUssV0FBVyxLQUFLLE9BQU8sYUFBYSxLQUFLLE9BQU8sWUFBYTtBQUN0RSxhQUFLLFNBQVMsRUFBRSxHQUFHLGFBQWEsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLENBQUM7QUFDbkQsYUFBSyxPQUFPLEdBQUcsV0FBVyxNQUFNO0FBQUEsUUFBQyxDQUFDO0FBQ2xDLGFBQUssT0FBTyxNQUFNLENBQUMsT0FBZSxZQUFpQixLQUFLLFVBQVUsT0FBTyxPQUFPLENBQUM7QUFBQSxNQUNuRixPQUFPO0FBRUwsYUFBSyxTQUFTO0FBQUEsTUFDaEI7QUFBQSxJQUNGO0FBQUEsSUFFQSxHQUFHLE9BQWUsU0FBa0I7QUExQnRDO0FBMkJJLFFBQUMsVUFBSyxVQUFMLHVCQUF5QixDQUFDLElBQUcsS0FBSyxPQUFPO0FBQUEsSUFDNUM7QUFBQSxJQUVBLElBQUksT0FBZSxTQUFrQjtBQUNuQyxZQUFNLE1BQU0sS0FBSyxTQUFTLEtBQUs7QUFDL0IsVUFBSSxDQUFDLElBQUs7QUFDVixZQUFNLE1BQU0sSUFBSSxRQUFRLE9BQU87QUFDL0IsVUFBSSxPQUFPLEVBQUcsS0FBSSxPQUFPLEtBQUssQ0FBQztBQUFBLElBQ2pDO0FBQUEsSUFFUSxVQUFVLE9BQWUsU0FBYztBQUM3QyxPQUFDLEtBQUssU0FBUyxLQUFLLEtBQUssQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDO0FBQUEsSUFDeEQ7QUFBQSxFQUNGO0FBbkNFLGdCQURXLGlCQUNJO0FBRFYsTUFBTSxpQkFBTjs7O0FDRkEsV0FBUyxVQUFVLFFBQTZCO0FBQ3JELFVBQU0sT0FBaUU7QUFBQSxNQUNyRSxFQUFFLEtBQUssUUFBUSxNQUFNLGdCQUFNLE1BQU0sVUFBVSxNQUFNLE9BQU87QUFBQSxNQUN4RCxFQUFFLEtBQUssYUFBYSxNQUFNLGdCQUFNLE1BQU0sZUFBZSxNQUFNLFlBQVk7QUFBQSxNQUN2RSxFQUFFLEtBQUssV0FBVyxNQUFNLGdCQUFNLE1BQU0sYUFBYSxNQUFNLFVBQVU7QUFBQSxNQUNqRSxFQUFFLEtBQUssWUFBWSxNQUFNLHNCQUFPLE1BQU0sY0FBYyxNQUFNLFdBQVc7QUFBQSxNQUNyRSxFQUFFLEtBQUssV0FBVyxNQUFNLGdCQUFNLE1BQU0sYUFBYSxNQUFNLFVBQVU7QUFBQSxJQUNuRTtBQUNBLFVBQU0sT0FBTyxTQUFTLGNBQWMsS0FBSztBQUN6QyxTQUFLLFlBQVk7QUFDakIsZUFBVyxLQUFLLE1BQU07QUFDcEIsWUFBTSxJQUFJLFNBQVMsY0FBYyxHQUFHO0FBQ3BDLFFBQUUsT0FBTyxFQUFFO0FBQ1gsWUFBTSxNQUFNLFdBQVcsRUFBRSxNQUFNLEVBQUUsTUFBTSxJQUFJLFdBQVcsTUFBTSxDQUFDO0FBQzdELFlBQU0sUUFBUSxTQUFTLGNBQWMsTUFBTTtBQUMzQyxZQUFNLGNBQWMsRUFBRTtBQUN0QixRQUFFLFlBQVksR0FBRztBQUNqQixRQUFFLFlBQVksS0FBSztBQUNuQixVQUFJLEVBQUUsUUFBUSxPQUFRLEdBQUUsVUFBVSxJQUFJLFFBQVE7QUFDOUMsV0FBSyxZQUFZLENBQUM7QUFBQSxJQUNwQjtBQUNBLFdBQU87QUFBQSxFQUNUOzs7QUNyQk8sV0FBUyxvQkFBb0I7QUFDbEMsVUFBTSxNQUFNLFNBQVMsY0FBYyxLQUFLO0FBQ3hDLFFBQUksWUFBWTtBQUNoQixVQUFNLE9BQU8sU0FBUyxjQUFjLEtBQUs7QUFDekMsU0FBSyxZQUFZO0FBQ2pCLFNBQUssWUFBWTtBQUFBO0FBQUE7QUFBQTtBQUtqQixTQUFLLFlBQVk7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBa0JqQixRQUFJLFlBQVksSUFBSTtBQUVwQixRQUFJO0FBQ0YsWUFBTSxTQUFTLEtBQUssY0FBYyxrQkFBa0I7QUFDcEQsWUFBTSxVQUFVLEtBQUssY0FBYyxtQkFBbUI7QUFDdEQsVUFBSSxPQUFRLFFBQU8sWUFBWSxXQUFXLE9BQU8sRUFBRSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQzlELFVBQUksUUFBUyxTQUFRLFlBQVksV0FBVyxRQUFRLEVBQUUsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUFBLElBQ25FLFNBQVE7QUFBQSxJQUFDO0FBQ1QsVUFBTSxRQUFRLEtBQUssY0FBYyxNQUFNO0FBQ3ZDLFVBQU0sU0FBUyxLQUFLLGNBQWMsT0FBTztBQUN6QyxtQkFBZSxTQUFTO0FBQ3RCLFVBQUk7QUFDRixjQUFNLElBQUksTUFBTSxlQUFlLEVBQUUsUUFBZ0csZUFBZTtBQUNoSixjQUFNLGNBQWMsT0FBTyxFQUFFLFNBQVM7QUFDdEMsZUFBTyxjQUFjLE9BQU8sRUFBRSxPQUFPO0FBQUEsTUFDdkMsU0FBUTtBQUFBLE1BRVI7QUFBQSxJQUNGO0FBQ0EsV0FBTyxFQUFFLE1BQU0sS0FBSyxPQUFPO0FBQUEsRUFDN0I7OztBQ25ETyxXQUFTLGVBQWUsUUFBaUIsTUFBYyxRQUFRLFFBQVE7QUFDNUUsVUFBTSxPQUFPLE9BQU8sc0JBQXNCO0FBQzFDLFVBQU0sT0FBTyxTQUFTLGNBQWMsS0FBSztBQUN6QyxTQUFLLGNBQWM7QUFDbkIsU0FBSyxNQUFNLFVBQVUsdUJBQXVCLEtBQUssT0FBTyxLQUFLLFFBQVEsRUFBRSxVQUFVLEtBQUssTUFBTSxDQUFDLDRJQUU5QixRQUFNO0FBQ3JFLGFBQVMsS0FBSyxZQUFZLElBQUk7QUFDOUIsMEJBQXNCLE1BQU07QUFDMUIsV0FBSyxNQUFNLFVBQVU7QUFDckIsV0FBSyxNQUFNLFlBQVk7QUFBQSxJQUN6QixDQUFDO0FBQ0QsZUFBVyxNQUFNLEtBQUssT0FBTyxHQUFHLEdBQUc7QUFBQSxFQUNyQzs7O0FDT08sTUFBTSxZQUFOLE1BQWdCO0FBQUEsSUFBaEI7QUFDTCwwQkFBUSxRQUEyQjtBQUNuQywwQkFBUSxXQUFVO0FBQ2xCLDBCQUFRLFdBQVU7QUFDbEIsMEJBQVEsWUFBVztBQUNuQiwwQkFBUSxlQUFjO0FBQ3RCLDBCQUFRLHFCQUFvQjtBQUM1QiwwQkFBUSxpQkFBK0I7QUFDdkMsMEJBQVEsY0FBYTtBQUNyQiwwQkFBUSxXQUF5QjtBQUVqQywwQkFBUSxPQUFNO0FBQUEsUUFDWixNQUFNO0FBQUEsUUFDTixTQUFTO0FBQUEsUUFDVCxZQUFZO0FBQUEsUUFDWixNQUFNO0FBQUEsUUFDTixTQUFTO0FBQUEsUUFDVCxPQUFPO0FBQUEsUUFDUCxXQUFXO0FBQUEsUUFDWCxRQUFRO0FBQUEsUUFDUixPQUFPO0FBQUEsUUFDUCxNQUFNO0FBQUEsUUFDTixTQUFTO0FBQUEsUUFDVCxRQUFRO0FBQUEsUUFDUixXQUFXO0FBQUEsTUFDYjtBQUVBLDBCQUFRO0FBQ1IsMEJBQVE7QUFDUiwwQkFBUTtBQUFBO0FBQUEsSUFFUixNQUFNLE1BQU0sTUFBbUI7QUFDN0IsV0FBSyxtQkFBbUI7QUFDeEIsV0FBSyxVQUFVO0FBRWYsWUFBTSxNQUFNLFVBQVUsTUFBTTtBQUM1QixZQUFNLE1BQU0sa0JBQWtCO0FBQzlCLFlBQU1DLFFBQU8sS0FBSztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsS0F1QmpCO0FBRUQsV0FBSyxZQUFZO0FBQ2pCLFdBQUssWUFBWSxHQUFHO0FBQ3BCLFdBQUssWUFBWSxJQUFJLElBQUk7QUFDekIsV0FBSyxZQUFZQSxLQUFJO0FBRXJCLFdBQUssT0FBT0E7QUFFWixVQUFJO0FBQ0YsUUFBQUEsTUFBSyxpQkFBaUIsWUFBWSxFQUMvQixRQUFRLENBQUMsT0FBTztBQUNmLGdCQUFNLE9BQVEsR0FBbUIsYUFBYSxVQUFVO0FBQ3hELGNBQUk7QUFBRSxlQUFHLFlBQVksV0FBVyxNQUFNLEVBQUUsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUFBLFVBQUcsU0FBUTtBQUFBLFVBQUM7QUFBQSxRQUNqRSxDQUFDO0FBQUEsTUFDTCxTQUFRO0FBQUEsTUFBQztBQUNULFdBQUssa0JBQWtCO0FBQ3ZCLFdBQUssY0FBYztBQUNuQixXQUFLLGVBQWUsSUFBSSxPQUFPLEtBQUssR0FBRyxDQUFDO0FBQ3hDLFlBQU0sSUFBSSxPQUFPO0FBQ2pCLFdBQUssY0FBYztBQUNuQixZQUFNLEtBQUssY0FBYztBQUN6QixXQUFLLGVBQWU7QUFDcEIsV0FBSyxlQUFlO0FBQUEsSUFDdEI7QUFBQSxJQUVRLGdCQUFnQjtBQUN0QixVQUFJLENBQUMsS0FBSyxLQUFNO0FBQ2hCLFdBQUssSUFBSSxPQUFPLEdBQUcsS0FBSyxNQUFNLE9BQU87QUFDckMsV0FBSyxJQUFJLFVBQVUsR0FBRyxLQUFLLE1BQU0sVUFBVTtBQUMzQyxXQUFLLElBQUksYUFBYSxHQUFHLEtBQUssTUFBTSxhQUFhO0FBQ2pELFdBQUssSUFBSSxPQUFPLEtBQUssS0FBSyxjQUFjLE9BQU87QUFDL0MsV0FBSyxJQUFJLFVBQVUsS0FBSyxLQUFLLGNBQWMsVUFBVTtBQUNyRCxXQUFLLElBQUksUUFBUSxLQUFLLEtBQUssY0FBYyxRQUFRO0FBQ2pELFdBQUssSUFBSSxZQUFZLEtBQUssS0FBSyxjQUFjLFlBQVk7QUFDekQsV0FBSyxJQUFJLFNBQVMsS0FBSyxLQUFLLGNBQWMsU0FBUztBQUNuRCxXQUFLLElBQUksUUFBUSxHQUFzQixLQUFLLE1BQU0sUUFBUTtBQUMxRCxXQUFLLElBQUksT0FBTyxHQUFzQixLQUFLLE1BQU0sT0FBTztBQUN4RCxXQUFLLElBQUksVUFBVSxHQUFzQixLQUFLLE1BQU0sVUFBVTtBQUM5RCxXQUFLLElBQUksU0FBUyxHQUFzQixLQUFLLE1BQU0sU0FBUztBQUM1RCxXQUFLLElBQUksWUFBWSxHQUFzQixLQUFLLE1BQU0sU0FBUztBQUFBLElBQ2pFO0FBQUE7QUFBQSxJQUdRLG9CQUFvQjtBQUMxQixVQUFJLENBQUMsS0FBSyxLQUFNO0FBQ2hCLFlBQU0sV0FBVyxLQUFLLEtBQUssY0FBYyxPQUFPO0FBQ2hELFVBQUksQ0FBQyxTQUFVO0FBQ2YsVUFBSTtBQUNGLGNBQU0sUUFBUSxLQUFLO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxPQVFsQjtBQUNELGNBQU0saUJBQWlCLFlBQVksRUFDaEMsUUFBUSxDQUFDLE9BQU87QUFDZixnQkFBTSxPQUFRLEdBQW1CLGFBQWEsVUFBVTtBQUN4RCxjQUFJO0FBQUUsZUFBRyxZQUFZLFdBQVcsTUFBTSxFQUFFLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFBQSxVQUFHLFNBQVE7QUFBQSxVQUFDO0FBQUEsUUFDakUsQ0FBQztBQUNILFFBQUMsU0FBeUIsYUFBYSxPQUFRLFNBQXlCLFNBQVMsQ0FBQyxLQUFLLElBQUk7QUFDM0YsY0FBTSxPQUFPLEtBQUsscUVBQXFFO0FBQ3ZGLFFBQUMsU0FBeUIsWUFBWSxJQUFJO0FBQUEsTUFDNUMsU0FBUTtBQUFBLE1BQUM7QUFBQSxJQUNYO0FBQUEsSUFFUSxlQUFlLFdBQWdDO0FBckp6RDtBQXNKSSxVQUFJLENBQUMsS0FBSyxLQUFNO0FBQ2hCLGlCQUFLLElBQUksVUFBVCxtQkFBZ0IsaUJBQWlCLFNBQVMsTUFBTSxLQUFLLFlBQVk7QUFDakUsaUJBQUssSUFBSSxTQUFULG1CQUFlLGlCQUFpQixTQUFTLE1BQU0sS0FBSyxXQUFXO0FBQy9ELGlCQUFLLElBQUksY0FBVCxtQkFBb0IsaUJBQWlCLFNBQVMsTUFBTSxLQUFLLGNBQWM7QUFDdkUsaUJBQUssSUFBSSxXQUFULG1CQUFpQixpQkFBaUIsU0FBUyxNQUFNLEtBQUssYUFBYTtBQUNuRSxpQkFBSyxJQUFJLFlBQVQsbUJBQWtCLGlCQUFpQixTQUFTLE1BQU0sS0FBSyxjQUFjLFNBQVM7QUFBQSxJQUNoRjtBQUFBLElBRVEsZ0JBQWdCO0FBQ3RCLFlBQU0sUUFBUyxlQUF1QixFQUFFLE9BQU87QUFDL0MsVUFBSSxNQUFPLGdCQUFlLEVBQUUsUUFBUSxLQUFLO0FBRXpDLFVBQUksS0FBSyxrQkFBbUIsZ0JBQWUsRUFBRSxJQUFJLGVBQWUsS0FBSyxpQkFBaUI7QUFDdEYsVUFBSSxLQUFLLG9CQUFxQixnQkFBZSxFQUFFLElBQUksaUJBQWlCLEtBQUssbUJBQW1CO0FBQzVGLFVBQUksS0FBSyxlQUFnQixnQkFBZSxFQUFFLElBQUksb0JBQW9CLEtBQUssY0FBYztBQUVyRixXQUFLLG9CQUFvQixDQUFDLFFBQVE7QUF0S3RDO0FBdUtNLGFBQUssVUFBVSxPQUFPLElBQUksZUFBZSxXQUFXLElBQUksYUFBYSxLQUFLO0FBQzFFLGFBQUssVUFBVSxPQUFPLElBQUksaUJBQWlCLFdBQVcsSUFBSSxlQUFlLEtBQUs7QUFDOUUsYUFBSyxZQUFXLFNBQUksWUFBSixZQUFlLEtBQUs7QUFDcEMsWUFBSSxJQUFJLGFBQWEsSUFBSSxvQkFBb0I7QUFDM0MsZUFBSyx1QkFBdUIsSUFBSSxrQkFBa0I7QUFBQSxRQUNwRCxXQUFXLENBQUMsSUFBSSxXQUFXO0FBQ3pCLGVBQUssY0FBYztBQUNuQixlQUFLLG1CQUFtQjtBQUFBLFFBQzFCO0FBQ0EsYUFBSyxlQUFlO0FBQ3BCLFlBQUksSUFBSSxTQUFTLGNBQWMsSUFBSSxRQUFRO0FBQ3pDLGVBQUssaUJBQWlCLDBEQUFhLElBQUksTUFBTSxRQUFHO0FBQ2hELGVBQUssU0FBUyxpQkFBTyxJQUFJLE1BQU0sRUFBRTtBQUFBLFFBQ25DLFdBQVcsSUFBSSxTQUFTLFlBQVksSUFBSSxRQUFRO0FBQzlDLGVBQUssaUJBQWlCLDRCQUFRLElBQUksTUFBTSxzQkFBTyxLQUFLLGNBQWMsQ0FBQyxFQUFFO0FBQ3JFLGVBQUssU0FBUyxpQkFBTyxJQUFJLE1BQU0sRUFBRTtBQUFBLFFBQ25DLFdBQVcsSUFBSSxTQUFTLFlBQVk7QUFDbEMsZUFBSyxpQkFBaUIsOERBQVk7QUFDbEMsZUFBSyxTQUFTLDBCQUFNO0FBQUEsUUFDdEIsV0FBVyxJQUFJLFNBQVMsV0FBVztBQUNqQyxlQUFLLGlCQUFpQiw4REFBWTtBQUNsQyxlQUFLLFNBQVMsMEJBQU07QUFBQSxRQUN0QixXQUFXLEtBQUssYUFBYTtBQUMzQixlQUFLLGlCQUFpQiw4Q0FBVyxLQUFLLGlCQUFpQixHQUFHO0FBQUEsUUFDNUQ7QUFDQSxhQUFLLGVBQWU7QUFBQSxNQUN0QjtBQUVBLFdBQUssc0JBQXNCLENBQUMsUUFBUTtBQUNsQyxjQUFNLFVBQVUsT0FBTywyQkFBSyxlQUFlLEtBQUs7QUFDaEQsWUFBSSxVQUFVLEVBQUcsTUFBSyx1QkFBdUIsT0FBTztBQUNwRCxrQkFBVSxnRUFBYyxPQUFPLFdBQU0sTUFBTTtBQUFBLE1BQzdDO0FBRUEsV0FBSyxpQkFBaUIsQ0FBQyxRQUFRO0FBQzdCLGtCQUFVLHdDQUFVLElBQUksUUFBUSxzQkFBTyxJQUFJLElBQUksSUFBSSxNQUFNO0FBQ3pELGFBQUssU0FBUyxVQUFLLElBQUksUUFBUSxrQkFBUSxJQUFJLElBQUksRUFBRTtBQUFBLE1BQ25EO0FBRUEscUJBQWUsRUFBRSxHQUFHLGVBQWUsS0FBSyxpQkFBaUI7QUFDekQscUJBQWUsRUFBRSxHQUFHLGlCQUFpQixLQUFLLG1CQUFtQjtBQUM3RCxxQkFBZSxFQUFFLEdBQUcsb0JBQW9CLEtBQUssY0FBYztBQUFBLElBQzdEO0FBQUEsSUFFQSxNQUFjLGNBQWM7QUFDMUIsVUFBSSxLQUFLLFdBQVcsS0FBSyxhQUFhO0FBQ3BDLFlBQUksS0FBSyxZQUFhLFdBQVUsMERBQWEsTUFBTTtBQUNuRDtBQUFBLE1BQ0Y7QUFDQSxXQUFLLFVBQVU7QUFDZixXQUFLLGVBQWU7QUFDcEIsVUFBSTtBQUNGLGNBQU0sU0FBUyxNQUFNLGVBQWUsRUFBRSxRQUFvQixlQUFlLEVBQUUsUUFBUSxPQUFPLENBQUM7QUFDM0YsYUFBSyxZQUFZLE1BQU07QUFDdkIsYUFBSyxpQkFBaUIsZ0NBQU87QUFDN0Isa0JBQVUsa0NBQVMsU0FBUztBQUFBLE1BQzlCLFNBQVMsR0FBUTtBQUNmLG1CQUFVLHVCQUFHLFlBQVcsNEJBQVEsT0FBTztBQUFBLE1BQ3pDLFVBQUU7QUFDQSxhQUFLLFVBQVU7QUFDZixhQUFLLGVBQWU7QUFBQSxNQUN0QjtBQUFBLElBQ0Y7QUFBQSxJQUVBLE1BQWMsYUFBYTtBQUN6QixVQUFJLEtBQUssUUFBUztBQUNsQixXQUFLLFVBQVU7QUFDZixXQUFLLGVBQWU7QUFDcEIsVUFBSTtBQUNGLGNBQU0sU0FBUyxNQUFNLGVBQWUsRUFBRSxRQUFvQixjQUFjLEVBQUUsUUFBUSxPQUFPLENBQUM7QUFDMUYsYUFBSyxZQUFZLE1BQU07QUFDdkIsYUFBSyxpQkFBaUIsZ0NBQU87QUFDN0Isa0JBQVUsa0NBQVMsU0FBUztBQUFBLE1BQzlCLFNBQVMsR0FBUTtBQUNmLG1CQUFVLHVCQUFHLFlBQVcsNEJBQVEsT0FBTztBQUFBLE1BQ3pDLFVBQUU7QUFDQSxhQUFLLFVBQVU7QUFDZixhQUFLLGVBQWU7QUFBQSxNQUN0QjtBQUFBLElBQ0Y7QUFBQSxJQUVBLE1BQWMsY0FBYyxXQUFnQztBQUMxRCxVQUFJLEtBQUssV0FBVyxLQUFLLFdBQVcsRUFBRztBQUN2QyxXQUFLLFVBQVU7QUFDZixXQUFLLGVBQWU7QUFDcEIsVUFBSTtBQUNGLGNBQU0sTUFBTSxNQUFNLGVBQWUsRUFBRSxRQUFtRCxpQkFBaUIsRUFBRSxRQUFRLE9BQU8sQ0FBQztBQUN6SCxZQUFJLElBQUksT0FBUSxNQUFLLFlBQVksSUFBSSxNQUFNO0FBQzNDLFlBQUksSUFBSSxZQUFZLEdBQUc7QUFDckIsZ0JBQU0sV0FBVyxTQUFTLGNBQWMsTUFBTTtBQUM5QyxjQUFJLFNBQVUsZ0JBQWUsVUFBcUIsSUFBSSxJQUFJLFNBQVMsSUFBSSxTQUFTO0FBQ2hGLG9CQUFVLDRCQUFRLElBQUksU0FBUyxJQUFJLFNBQVM7QUFBQSxRQUM5QyxPQUFPO0FBQ0wsb0JBQVUsc0VBQWUsTUFBTTtBQUFBLFFBQ2pDO0FBQ0EsY0FBTSxVQUFVO0FBQUEsTUFDbEIsU0FBUyxHQUFRO0FBQ2YsbUJBQVUsdUJBQUcsWUFBVyw0QkFBUSxPQUFPO0FBQUEsTUFDekMsVUFBRTtBQUNBLGFBQUssVUFBVTtBQUNmLGFBQUssZUFBZTtBQUFBLE1BQ3RCO0FBQUEsSUFDRjtBQUFBLElBRUEsTUFBYyxlQUFlO0FBQzNCLFVBQUksS0FBSyxXQUFXLENBQUMsS0FBSyxZQUFhO0FBQ3ZDLFdBQUssVUFBVTtBQUNmLFdBQUssZUFBZTtBQUNwQixVQUFJO0FBQ0YsY0FBTSxTQUFTLE1BQU0sZUFBZSxFQUFFLFFBQW9CLGdCQUFnQixFQUFFLFFBQVEsT0FBTyxDQUFDO0FBQzVGLGFBQUssWUFBWSxNQUFNO0FBQ3ZCLGFBQUssaUJBQWlCLG9FQUFhO0FBQ25DLGtCQUFVLGtDQUFTLFNBQVM7QUFBQSxNQUM5QixTQUFTLEdBQVE7QUFDZixtQkFBVSx1QkFBRyxZQUFXLDRCQUFRLE9BQU87QUFBQSxNQUN6QyxVQUFFO0FBQ0EsYUFBSyxVQUFVO0FBQ2YsYUFBSyxlQUFlO0FBQUEsTUFDdEI7QUFBQSxJQUNGO0FBQUEsSUFFQSxNQUFjLGdCQUFnQjtBQUM1QixVQUFJLEtBQUssWUFBWSxTQUFVO0FBQy9CLFdBQUssVUFBVTtBQUNmLFdBQUssZUFBZTtBQUNwQixVQUFJO0FBQ0YsY0FBTSxTQUFTLE1BQU0sZUFBZSxFQUFFLFFBQW9CLGNBQWM7QUFDeEUsYUFBSyxZQUFZLE1BQU07QUFBQSxNQUN6QixTQUFTLEdBQVE7QUFDZixtQkFBVSx1QkFBRyxZQUFXLHdDQUFVLE9BQU87QUFBQSxNQUMzQyxVQUFFO0FBQ0EsYUFBSyxVQUFVO0FBQ2YsYUFBSyxlQUFlO0FBQUEsTUFDdEI7QUFBQSxJQUNGO0FBQUEsSUFFUSxZQUFZLFFBQWdDLE9BQTRCLENBQUMsR0FBRztBQS9TdEY7QUFnVEksVUFBSSxDQUFDLE9BQVE7QUFDYixXQUFLLFdBQVUsWUFBTyxlQUFQLFlBQXFCLEtBQUs7QUFDekMsV0FBSyxXQUFVLFlBQU8saUJBQVAsWUFBdUIsS0FBSztBQUMzQyxXQUFLLGNBQWEsWUFBTyxlQUFQLFlBQXFCLEtBQUs7QUFDNUMsV0FBSyxXQUFXLFFBQVEsT0FBTyxPQUFPO0FBQ3RDLFdBQUssY0FBYyxRQUFRLE9BQU8sU0FBUztBQUMzQyxVQUFJLE9BQU8sYUFBYSxPQUFPLHFCQUFxQixHQUFHO0FBQ3JELGFBQUssdUJBQXVCLE9BQU8sa0JBQWtCO0FBQUEsTUFDdkQsT0FBTztBQUNMLGFBQUssbUJBQW1CO0FBQ3hCLGFBQUssb0JBQW9CO0FBQUEsTUFDM0I7QUFDQSxXQUFLLGVBQWU7QUFDcEIsVUFBSSxDQUFDLEtBQUssT0FBTztBQUNmLFlBQUksS0FBSyxlQUFlLEtBQUssb0JBQW9CLEdBQUc7QUFDbEQsZUFBSyxpQkFBaUIsOENBQVcsS0FBSyxpQkFBaUIsR0FBRztBQUFBLFFBQzVELFdBQVcsS0FBSyxVQUFVO0FBQ3hCLGdCQUFNLFVBQVUsS0FBSyxJQUFJLEdBQUcsS0FBSyxNQUFNLEtBQUssYUFBYSxHQUFJLENBQUM7QUFDOUQsZUFBSyxpQkFBaUIsMERBQWEsT0FBTyx1QkFBUSxLQUFLLGNBQWMsQ0FBQyxFQUFFO0FBQUEsUUFDMUUsT0FBTztBQUNMLGVBQUssaUJBQWlCLDBFQUFjO0FBQUEsUUFDdEM7QUFBQSxNQUNGO0FBQ0EsVUFBSSxLQUFLLElBQUksT0FBTztBQUNsQixjQUFNLFVBQVUsS0FBSyxJQUFJLEdBQUcsS0FBSyxNQUFNLEtBQUssYUFBYSxHQUFJLENBQUM7QUFDOUQsYUFBSyxJQUFJLE1BQU0sY0FBYyxHQUFHLE9BQU87QUFBQSxNQUN6QztBQUNBLFVBQUksS0FBSyxJQUFJLFdBQVc7QUFDdEIsY0FBTSxLQUFLLEtBQUssSUFBSTtBQUNwQixXQUFHLFlBQVk7QUFDZixjQUFNLE1BQU0sS0FBSyxjQUFjLFVBQVcsS0FBSyxXQUFXLFNBQVM7QUFDbkUsWUFBSTtBQUFFLGFBQUcsWUFBWSxXQUFXLEtBQVksRUFBRSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQUEsUUFBRyxTQUFRO0FBQUEsUUFBQztBQUNyRSxXQUFHLFlBQVksU0FBUyxlQUFlLEtBQUssY0FBYyxpQkFBUSxLQUFLLFdBQVcsdUJBQVEsY0FBSyxDQUFDO0FBQUEsTUFDbEc7QUFDQSxXQUFLLGVBQWU7QUFBQSxJQUN0QjtBQUFBLElBRVEsdUJBQXVCLFNBQWlCO0FBQzlDLFdBQUssbUJBQW1CO0FBQ3hCLFdBQUssY0FBYztBQUNuQixXQUFLLG9CQUFvQixLQUFLLElBQUksR0FBRyxLQUFLLE1BQU0sT0FBTyxDQUFDO0FBQ3hELFdBQUssaUJBQWlCLDhDQUFXLEtBQUssaUJBQWlCLEdBQUc7QUFDMUQsV0FBSyxlQUFlO0FBQ3BCLFdBQUssZ0JBQWdCLE9BQU8sWUFBWSxNQUFNO0FBQzVDLGFBQUssb0JBQW9CLEtBQUssSUFBSSxHQUFHLEtBQUssb0JBQW9CLENBQUM7QUFDL0QsWUFBSSxLQUFLLHFCQUFxQixHQUFHO0FBQy9CLGVBQUssbUJBQW1CO0FBQ3hCLGVBQUssY0FBYztBQUNuQixlQUFLLGlCQUFpQiwwRUFBYztBQUNwQyxlQUFLLGVBQWU7QUFBQSxRQUN0QixPQUFPO0FBQ0wsZUFBSyxpQkFBaUIsOENBQVcsS0FBSyxpQkFBaUIsR0FBRztBQUFBLFFBQzVEO0FBQUEsTUFDRixHQUFHLEdBQUk7QUFBQSxJQUNUO0FBQUEsSUFFUSxxQkFBcUI7QUFDM0IsVUFBSSxLQUFLLGtCQUFrQixNQUFNO0FBQy9CLGVBQU8sY0FBYyxLQUFLLGFBQWE7QUFDdkMsYUFBSyxnQkFBZ0I7QUFBQSxNQUN2QjtBQUFBLElBQ0Y7QUFBQSxJQUVRLGlCQUFpQjtBQUN2QixVQUFJLENBQUMsS0FBSyxJQUFJLFFBQVEsQ0FBQyxLQUFLLElBQUksUUFBUztBQUN6QyxZQUFNLE1BQU0sS0FBSyxVQUFVLElBQUksS0FBSyxJQUFJLEdBQUcsS0FBSyxVQUFVLEtBQUssT0FBTyxJQUFJO0FBQzFFLFdBQUssSUFBSSxLQUFLLE1BQU0sUUFBUSxHQUFHLEtBQUssTUFBTSxNQUFNLEdBQUcsQ0FBQztBQUNwRCxXQUFLLElBQUksUUFBUSxjQUFjLEdBQUcsS0FBSyxNQUFNLE1BQU0sR0FBRyxDQUFDO0FBQ3ZELFVBQUksS0FBSyxJQUFJLE1BQU07QUFDakIsY0FBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEdBQUc7QUFDaEMsUUFBQyxLQUFLLElBQUksS0FBcUIsTUFBTSxhQUFhLDBCQUEwQixHQUFHO0FBQUEsTUFDakY7QUFDQSxVQUFJLEtBQUssSUFBSSxRQUFTLE1BQUssSUFBSSxRQUFRLGNBQWMsR0FBRyxLQUFLLE1BQU0sTUFBTSxHQUFHLENBQUM7QUFDN0UsVUFBSSxLQUFLLFlBQVksYUFBYSxLQUFLLElBQUksU0FBUztBQUNsRCxhQUFLLElBQUksUUFBUSxXQUFXLEtBQUssWUFBWSxhQUFhLEtBQUssV0FBVztBQUFBLE1BQzVFO0FBQUEsSUFDRjtBQUFBLElBRVEsaUJBQWlCO0FBQ3ZCLFlBQU0sU0FBUyxDQUFDLFFBQXVCLEtBQUssWUFBWTtBQUN4RCxZQUFNLFNBQVMsQ0FBQyxLQUErQixNQUFXLE9BQWUsYUFBc0I7QUFoWW5HO0FBaVlNLFlBQUksQ0FBQyxJQUFLO0FBQ1YsWUFBSSxXQUFXO0FBRWYsWUFBSSxXQUFXLElBQUksY0FBYyxPQUFPO0FBQ3hDLFlBQUksQ0FBQyxVQUFVO0FBQ2IsY0FBSSxhQUFhLFdBQVcsTUFBTSxFQUFFLE1BQU0sR0FBRyxDQUFDLEdBQUcsSUFBSSxVQUFVO0FBQUEsUUFDakUsT0FBTztBQUVMLGdCQUFNLE9BQU8sU0FBUyxjQUFjLE1BQU07QUFDMUMsZUFBSyxZQUFZLFdBQVcsTUFBTSxFQUFFLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFFL0MseUJBQVMsa0JBQVQsbUJBQXdCLGFBQWEsS0FBSyxZQUFvQjtBQUFBLFFBQ2hFO0FBR0EsY0FBTSxLQUFLLElBQUksVUFBVSxFQUFFLFFBQVEsQ0FBQyxHQUFHLFFBQVE7QUFDN0MsY0FBSSxNQUFNLEVBQUcsS0FBSSxZQUFZLENBQUM7QUFBQSxRQUNoQyxDQUFDO0FBQ0QsWUFBSSxZQUFZLFNBQVMsZUFBZSxLQUFLLENBQUM7QUFBQSxNQUNoRDtBQUVBLGFBQU8sS0FBSyxJQUFJLE9BQU8sUUFBUSxPQUFPLE9BQU8sSUFBSSw2QkFBUyxLQUFLLFdBQVcsdUJBQVEsNEJBQVEsT0FBTyxPQUFPLEtBQUssS0FBSyxZQUFZLEtBQUssV0FBVztBQUM5SSxhQUFPLEtBQUssSUFBSSxNQUFNLFFBQVEsT0FBTyxNQUFNLElBQUksNkJBQVMsZ0JBQU0sT0FBTyxNQUFNLEtBQUssQ0FBQyxLQUFLLFFBQVE7QUFDOUYsYUFBTyxLQUFLLElBQUksU0FBUyxXQUFXLE9BQU8sU0FBUyxJQUFJLDZCQUFTLGdCQUFNLE9BQU8sU0FBUyxLQUFLLEtBQUssV0FBVyxDQUFDO0FBQzdHLGFBQU8sS0FBSyxJQUFJLFFBQVEsVUFBVSxPQUFPLFFBQVEsSUFBSSw2QkFBUyxnQkFBTSxPQUFPLFFBQVEsS0FBSyxDQUFDLEtBQUssV0FBVztBQUN6RyxhQUFPLEtBQUssSUFBSSxXQUFXLFdBQVcsT0FBTyxRQUFRLElBQUksNkJBQVMsNEJBQVEsT0FBTyxRQUFRLENBQUM7QUFBQSxJQUM1RjtBQUFBLElBRVEsaUJBQWlCLE1BQWM7QUFDckMsVUFBSSxDQUFDLEtBQUssSUFBSSxXQUFZO0FBQzFCLFdBQUssSUFBSSxXQUFXLGNBQWM7QUFBQSxJQUNwQztBQUFBLElBRVEsU0FBUyxLQUFhO0FBbGFoQztBQW1hSSxVQUFJLEdBQUMsVUFBSyxRQUFMLG1CQUFVLFFBQVE7QUFDdkIsWUFBTSxPQUFPLFNBQVMsY0FBYyxLQUFLO0FBQ3pDLFdBQUssWUFBWTtBQUNqQixZQUFNLE1BQU0sb0JBQUksS0FBSztBQUNyQixZQUFNLEtBQUssT0FBTyxJQUFJLFNBQVMsQ0FBQyxFQUFFLFNBQVMsR0FBRSxHQUFHO0FBQ2hELFlBQU0sS0FBSyxPQUFPLElBQUksV0FBVyxDQUFDLEVBQUUsU0FBUyxHQUFFLEdBQUc7QUFDbEQsWUFBTSxLQUFLLE9BQU8sSUFBSSxXQUFXLENBQUMsRUFBRSxTQUFTLEdBQUUsR0FBRztBQUNsRCxXQUFLLGNBQWMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxHQUFHO0FBQzdDLFdBQUssSUFBSSxPQUFPLFFBQVEsSUFBSTtBQUFBLElBQzlCO0FBQUEsSUFFUSxnQkFBZ0I7QUFDdEIsWUFBTSxNQUFNLEtBQUssVUFBVSxJQUFJLEtBQUssSUFBSSxHQUFHLEtBQUssVUFBVSxLQUFLLE9BQU8sSUFBSTtBQUMxRSxhQUFPLEdBQUcsS0FBSyxNQUFNLE1BQU0sR0FBRyxDQUFDO0FBQUEsSUFDakM7QUFBQSxFQUNGO0FBRUksTUFBSTtBQUNGLFNBQUssaUJBQWlCLFlBQVksRUFDL0IsUUFBUSxDQUFDLE9BQU87QUFDZixZQUFNLE9BQVEsR0FBbUIsYUFBYSxVQUFVO0FBQ3hELFVBQUk7QUFBRSxXQUFHLFlBQVksV0FBVyxNQUFNLEVBQUUsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUFBLE1BQUcsU0FBUTtBQUFBLE1BQUM7QUFBQSxJQUNqRSxDQUFDO0FBQUEsRUFDTCxTQUFRO0FBQUEsRUFBQzs7O0FDbGJOLE1BQU0saUJBQU4sTUFBcUI7QUFBQSxJQUMxQixNQUFNLE1BQU0sTUFBbUI7QUFDN0IsV0FBSyxZQUFZO0FBQ2pCLFdBQUssWUFBWSxVQUFVLFdBQVcsQ0FBQztBQUN2QyxZQUFNLE1BQU0sa0JBQWtCO0FBQzlCLFdBQUssWUFBWSxJQUFJLElBQUk7QUFFekIsWUFBTUMsUUFBTyxLQUFLO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsS0FtQmpCO0FBQ0QsV0FBSyxZQUFZQSxLQUFJO0FBRXJCLFlBQU0sUUFBUyxlQUF1QixFQUFFLE9BQU87QUFDL0MsVUFBSSxNQUFPLGdCQUFlLEVBQUUsUUFBUSxLQUFLO0FBRXpDLFlBQU0sT0FBTyxHQUFHQSxPQUFNLE9BQU87QUFDN0IsWUFBTSxlQUFlLEdBQUdBLE9BQU0sT0FBTztBQUNyQyxZQUFNLGFBQWEsR0FBc0JBLE9BQU0sVUFBVTtBQUV6RCxZQUFNLGFBQWEsQ0FBQyxXQUFvQjtBQUN0QyxlQUFPLGlCQUFpQixZQUFZLEVBQ2pDLFFBQVEsQ0FBQyxPQUFPO0FBQ2YsZ0JBQU0sT0FBUSxHQUFtQixhQUFhLFVBQVU7QUFDeEQsY0FBSTtBQUFFLGVBQUcsWUFBWSxXQUFXLE1BQU0sRUFBRSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQUEsVUFBRyxTQUFRO0FBQUEsVUFBQztBQUFBLFFBQ2pFLENBQUM7QUFBQSxNQUNMO0FBQ0EsaUJBQVdBLEtBQUk7QUFFZixZQUFNLFlBQVksQ0FBQyxNQUFXLFFBQXlFO0FBQ3JHLGNBQU0sSUFBSyxRQUFRLElBQUksVUFBVSxJQUFJLFNBQVUsS0FBSztBQUNwRCxjQUFNLFFBQVEsT0FBTyxLQUFLLEtBQUssS0FBSztBQUNwQyxZQUFJLE9BQU8sTUFBTSxVQUFVO0FBQ3pCLGdCQUFNLElBQUksRUFBRSxZQUFZO0FBQ3hCLGNBQUksQ0FBQyxhQUFZLFFBQU8sUUFBTyxRQUFRLEVBQUUsU0FBUyxDQUFDLEdBQUc7QUFDcEQsbUJBQU8sRUFBRSxLQUFLLEdBQVUsTUFBTSxNQUFNLGNBQWMsaUJBQU8sTUFBTSxTQUFTLGlCQUFPLE1BQU0sU0FBUyxpQkFBTyxlQUFLO0FBQUEsVUFDNUc7QUFBQSxRQUNGO0FBQ0EsWUFBSSxTQUFTLEdBQUksUUFBTyxFQUFFLEtBQUssYUFBYSxNQUFNLGVBQUs7QUFDdkQsWUFBSSxTQUFTLEVBQUcsUUFBTyxFQUFFLEtBQUssUUFBUSxNQUFNLGVBQUs7QUFDakQsWUFBSSxTQUFTLEVBQUcsUUFBTyxFQUFFLEtBQUssUUFBUSxNQUFNLGVBQUs7QUFDakQsZUFBTyxFQUFFLEtBQUssVUFBVSxNQUFNLGVBQUs7QUFBQSxNQUNyQztBQUVBLFlBQU0sYUFBYSxDQUFDLE9BQWU7QUFDakMsWUFBSTtBQUFFLGlCQUFPLElBQUksS0FBSyxFQUFFLEVBQUUsZUFBZTtBQUFBLFFBQUcsU0FBUTtBQUFFLGlCQUFPLEtBQUs7QUFBQSxRQUFJO0FBQUEsTUFDeEU7QUFFQSxZQUFNLE9BQU8sWUFBWTtBQUN2QixtQkFBVyxXQUFXO0FBQ3RCLG1CQUFXLFlBQVk7QUFDdkIsbUJBQVcsVUFBVTtBQUNyQixjQUFNLElBQUksT0FBTztBQUNqQixhQUFLLFlBQVk7QUFDakIsaUJBQVMsSUFBSSxHQUFHLElBQUksR0FBRyxJQUFLLE1BQUssWUFBWSxLQUFLLDhCQUE4QixDQUFDO0FBQ2pGLFlBQUk7QUFDRixnQkFBTSxDQUFDLE1BQU0sSUFBSSxJQUFJLE1BQU0sUUFBUSxJQUFJO0FBQUEsWUFDckMsZUFBZSxFQUFFLFFBQTBCLFFBQVE7QUFBQSxZQUNuRCxlQUFlLEVBQUUsUUFBOEIsa0JBQWtCLEVBQUUsTUFBTSxPQUFPLEVBQUUsV0FBVyxDQUFDLEVBQUUsRUFBRTtBQUFBLFVBQ3BHLENBQUM7QUFDRCxnQkFBTSxVQUErQixDQUFDO0FBQ3RDLHFCQUFXLEtBQU0sS0FBSyxhQUFhLENBQUMsRUFBSSxTQUFRLEVBQUUsRUFBRSxJQUFJO0FBQ3hELGVBQUssWUFBWTtBQUNqQixjQUFJLENBQUMsS0FBSyxNQUFNLFFBQVE7QUFDdEIsaUJBQUssWUFBWSxLQUFLLHlKQUFxRCxDQUFDO0FBQUEsVUFDOUU7QUFDQSxxQkFBVyxRQUFRLEtBQUssT0FBTztBQUM3QixrQkFBTSxNQUFNLFFBQVEsS0FBSyxVQUFVO0FBQ25DLGtCQUFNLFNBQVMsVUFBVSxNQUFNLEdBQUc7QUFDbEMsa0JBQU0sT0FBUSxRQUFRLElBQUksUUFBUSxJQUFJLE9BQVEsS0FBSztBQUVuRCxrQkFBTSxNQUFNLEtBQUs7QUFBQSwrQ0FFYixPQUFPLFFBQVEsY0FBYyw2QkFBNkIsT0FBTyxRQUFRLFNBQVMsd0JBQXdCLE9BQU8sUUFBUSxTQUFTLHdCQUF3Qix1QkFDNUosa0JBQWtCLE9BQU8sR0FBRztBQUFBO0FBQUE7QUFBQTtBQUFBLDZJQUlxRyxJQUFJO0FBQUEsZ0RBQ2pHLE9BQU8sR0FBRyxZQUFZLE9BQU8sSUFBSTtBQUFBLHNCQUMzRCxLQUFLLGFBQWEsaURBQWtDLEVBQUU7QUFBQSxzQkFDdEQsS0FBSyxXQUFXLGlEQUFrQyxFQUFFO0FBQUE7QUFBQTtBQUFBLDRDQUd4QyxLQUFLLEtBQUs7QUFBQSxzREFDQSxLQUFLLEVBQUU7QUFBQSx1QkFDN0IsMkJBQUssWUFBVyxzQkFBc0IsSUFBSSxRQUFRLFlBQVksRUFBRTtBQUFBO0FBQUE7QUFBQTtBQUFBLDBFQUlaLEtBQUssRUFBRSxLQUFLLEtBQUssYUFBYSxhQUFhLEVBQUU7QUFBQSxnRkFDdkMsS0FBSyxFQUFFO0FBQUEsNkVBQ1YsS0FBSyxFQUFFO0FBQUE7QUFBQTtBQUFBLDZDQUd2QyxLQUFLLEVBQUU7QUFBQTtBQUFBLFdBRXpDO0FBQ0QsdUJBQVcsR0FBRztBQUNkLGdCQUFJLGlCQUFpQixTQUFTLE9BQU8sT0FBTztBQUMxQyxvQkFBTSxTQUFTLEdBQUc7QUFDbEIsb0JBQU0sS0FBSyxPQUFPLGFBQWEsU0FBUztBQUN4QyxvQkFBTSxNQUFNLE9BQU8sYUFBYSxVQUFVO0FBQzFDLGtCQUFJLENBQUMsTUFBTSxDQUFDLElBQUs7QUFDakIsa0JBQUksUUFBUSxVQUFVO0FBQ3BCLHNCQUFNLE1BQU0sSUFBSSxjQUFjLE9BQU8sRUFBRSxFQUFFO0FBQ3pDLG9CQUFJLENBQUMsSUFBSztBQUNWLG9CQUFJLENBQUMsSUFBSSxjQUFjLEdBQUc7QUFDeEIsc0JBQUksWUFBWTtBQUNoQixzQkFBSSxTQUFTO0FBQ2Isc0JBQUk7QUFDRiwwQkFBTSxNQUFNLE1BQU0sZUFBZSxFQUFFLFFBQW1FLHNCQUFzQixFQUFFLEVBQUU7QUFDaEksMEJBQU0sT0FBTyxNQUFNLFFBQVEsSUFBSSxJQUFJLElBQUksSUFBSSxPQUFPLENBQUM7QUFDbkQsd0JBQUksWUFBWTtBQUNoQix3QkFBSSxDQUFDLEtBQUssUUFBUTtBQUNoQiwwQkFBSSxZQUFZO0FBQUEsb0JBQ2xCLE9BQU87QUFDTCxpQ0FBVyxPQUFPLE1BQU07QUFDdEIsOEJBQU0sT0FBTyxLQUFLO0FBQUE7QUFBQTtBQUFBLDhDQUdNLFdBQVcsSUFBSSxJQUFJLENBQUM7QUFBQSwrQ0FDbkIsSUFBSSxRQUFRLElBQUksUUFBUSxJQUFJLFFBQVEsTUFBSyxNQUFNLENBQUM7QUFBQTtBQUFBLHVCQUV4RTtBQUNELDRCQUFJLFlBQVksSUFBSTtBQUFBLHNCQUN0QjtBQUFBLG9CQUNGO0FBQUEsa0JBQ0YsU0FBUTtBQUNOLHdCQUFJLFlBQVk7QUFDaEIsd0JBQUksWUFBWSxLQUFLO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLG1CQU1wQixDQUFDO0FBQUEsa0JBQ0o7QUFBQSxnQkFDRixPQUFPO0FBQ0wsc0JBQUksU0FBUyxDQUFDLElBQUk7QUFBQSxnQkFDcEI7QUFDQTtBQUFBLGNBQ0Y7QUFDQSxrQkFBSTtBQUNGLHVCQUFPLFdBQVc7QUFDbEIsdUJBQU8sWUFBWSxRQUFRLFVBQVUsNERBQXdDO0FBQzdFLDJCQUFXLE1BQU07QUFDakIsb0JBQUksUUFBUSxTQUFTO0FBQ25CLHdCQUFNLGVBQWUsRUFBRSxRQUFRLGdCQUFnQixFQUFFLFFBQVEsUUFBUSxNQUFNLEtBQUssVUFBVSxFQUFFLFFBQVEsR0FBRyxDQUFDLEVBQUUsQ0FBQztBQUN2Ryw0QkFBVSwwQkFBTTtBQUFBLGdCQUNsQixXQUFXLFFBQVEsV0FBVztBQUM1Qix3QkFBTSxlQUFlLEVBQUUsUUFBUSxrQkFBa0IsRUFBRSxRQUFRLFFBQVEsTUFBTSxLQUFLLFVBQVUsRUFBRSxRQUFRLEdBQUcsQ0FBQyxFQUFFLENBQUM7QUFDekcsNEJBQVUsMEJBQU07QUFBQSxnQkFDbEI7QUFDQSxzQkFBTSxLQUFLO0FBQUEsY0FDYixTQUFTLEdBQVE7QUFDZiwyQkFBVSx1QkFBRyxZQUFXLDBCQUFNO0FBQUEsY0FDaEMsVUFBRTtBQUNBLHNCQUFNLElBQUksT0FBTyxhQUFhLFVBQVU7QUFDeEMsb0JBQUksTUFBTSxRQUFTLFFBQU8sWUFBWTtBQUFBLHlCQUM3QixNQUFNLFVBQVcsUUFBTyxZQUFZO0FBQUEsb0JBQ3hDLFFBQU8sWUFBWTtBQUN4QiwyQkFBVyxNQUFNO0FBQ2pCLHVCQUFPLFdBQVc7QUFBQSxjQUNwQjtBQUFBLFlBQ0YsQ0FBQztBQUNELGlCQUFLLFlBQVksR0FBRztBQUFBLFVBQ3RCO0FBRUEsdUJBQWEsWUFBWTtBQUN6QixxQkFBVyxPQUFRLEtBQUssYUFBYSxDQUFDLEdBQUk7QUFDeEMsa0JBQU0sTUFBTSxLQUFLLGtDQUFrQyxJQUFJLFFBQVEsSUFBSSxFQUFFLGtCQUFlLElBQUksWUFBWSwwQkFBTSxRQUFRO0FBQ2xILHlCQUFhLFlBQVksR0FBRztBQUFBLFVBQzlCO0FBQUEsUUFDRixTQUFTLEdBQVE7QUFDZixxQkFBVSx1QkFBRyxZQUFXLHNDQUFRO0FBQUEsUUFDbEMsVUFBRTtBQUNBLHFCQUFXLFdBQVc7QUFDdEIscUJBQVcsWUFBWTtBQUN2QixxQkFBVyxVQUFVO0FBQUEsUUFDdkI7QUFBQSxNQUNGO0FBRUEsaUJBQVcsVUFBVSxNQUFNLEtBQUs7QUFDaEMsWUFBTSxLQUFLO0FBQUEsSUFDYjtBQUFBLEVBQ0Y7OztBQzFNTyxNQUFNLGVBQU4sTUFBbUI7QUFBQSxJQUFuQjtBQUNMLDBCQUFRLGFBQWdDO0FBQUE7QUFBQSxJQUV4QyxNQUFNLE1BQW1CO0FBQ3ZCLFdBQUssWUFBWTtBQUNqQixXQUFLLFlBQVksVUFBVSxTQUFTLENBQUM7QUFDckMsWUFBTSxNQUFNLGtCQUFrQjtBQUM5QixXQUFLLFlBQVksSUFBSSxJQUFJO0FBRXpCLFlBQU1DLFFBQU8sS0FBSztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsS0FXakI7QUFDRCxXQUFLLFlBQVlBLEtBQUk7QUFFckIsWUFBTSxRQUFTLGVBQXVCLEVBQUUsT0FBTztBQUMvQyxVQUFJLE1BQU8sZ0JBQWUsRUFBRSxRQUFRLEtBQUs7QUFFekMscUJBQWUsRUFBRSxHQUFHLG9CQUFvQixDQUFDLFFBQVE7QUFDL0Msa0JBQVUsd0NBQVUsSUFBSSxRQUFRLHNCQUFPLElBQUksSUFBSSxFQUFFO0FBQ2pELGFBQUssSUFBSSxVQUFLLElBQUksUUFBUSxtQ0FBVSxJQUFJLElBQUksRUFBRTtBQUFBLE1BQ2hELENBQUM7QUFDRCxXQUFLLFlBQVksR0FBR0EsT0FBTSxTQUFTO0FBRW5DLFlBQU0sT0FBTyxHQUFHQSxPQUFNLE9BQU87QUFDN0IsWUFBTSxhQUFhLEdBQXNCQSxPQUFNLFVBQVU7QUFDekQsWUFBTSxhQUFhLENBQUMsV0FBb0I7QUFDdEMsZUFBTyxpQkFBaUIsWUFBWSxFQUNqQyxRQUFRLENBQUMsT0FBTztBQUNmLGdCQUFNLE9BQVEsR0FBbUIsYUFBYSxVQUFVO0FBQ3hELGNBQUk7QUFBRSxlQUFHLFlBQVksV0FBVyxNQUFNLEVBQUUsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUFBLFVBQUcsU0FBUTtBQUFBLFVBQUM7QUFBQSxRQUNqRSxDQUFDO0FBQUEsTUFDTDtBQUNBLGlCQUFXQSxLQUFJO0FBRWYsWUFBTSxPQUFPLFlBQVk7QUFDdkIsbUJBQVcsV0FBVztBQUN0QixtQkFBVyxZQUFZO0FBQ3ZCLG1CQUFXLFVBQVU7QUFDckIsY0FBTSxJQUFJLE9BQU87QUFDakIsYUFBSyxZQUFZO0FBQ2pCLGlCQUFTLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSyxNQUFLLFlBQVksS0FBSyw4QkFBOEIsQ0FBQztBQUNqRixZQUFJO0FBQ0YsZ0JBQU0sT0FBTyxNQUFNLGVBQWUsRUFBRSxRQUE0QixrQkFBa0I7QUFDbEYsZUFBSyxZQUFZO0FBQ2pCLGNBQUksQ0FBQyxLQUFLLFFBQVEsUUFBUTtBQUN4QixpQkFBSyxZQUFZLEtBQUssK0dBQThDLENBQUM7QUFBQSxVQUN2RTtBQUNBLHFCQUFXLFVBQVUsS0FBSyxTQUFTO0FBQ2pDLGtCQUFNLE1BQU0sS0FBSztBQUFBO0FBQUE7QUFBQSwrR0FHb0YsT0FBTyxZQUFZLE9BQU8sRUFBRTtBQUFBLDhEQUM1RixPQUFPLEdBQUc7QUFBQTtBQUFBO0FBQUEsd0RBR0QsT0FBTyxFQUFFO0FBQUE7QUFBQTtBQUFBLFdBR3REO0FBQ0QsdUJBQVcsR0FBRztBQUNkLGdCQUFJLGlCQUFpQixTQUFTLE9BQU8sT0FBTztBQUMxQyxvQkFBTSxLQUFLLEdBQUc7QUFDZCxvQkFBTSxLQUFLLEdBQUcsYUFBYSxTQUFTO0FBQ3BDLGtCQUFJLENBQUMsR0FBSTtBQUNULGlCQUFHLFdBQVc7QUFDZCxvQkFBTSxXQUFXLEdBQUcsZUFBZTtBQUNuQyxpQkFBRyxjQUFjO0FBQ2pCLGtCQUFJO0FBQ0Ysc0JBQU0sTUFBTSxNQUFNLGVBQWUsRUFBRSxRQUFtRCxZQUFZLEVBQUUsSUFBSSxFQUFFLFFBQVEsT0FBTyxDQUFDO0FBQzFILG9CQUFJLElBQUksU0FBUztBQUNmLHVCQUFLLElBQUksNEJBQVEsRUFBRSxzQkFBTyxJQUFJLFdBQVcsRUFBRTtBQUMzQyw0QkFBVSw4Q0FBVyxJQUFJLFdBQVcsSUFBSSxTQUFTO0FBQUEsZ0JBQ25ELE9BQU87QUFDTCx1QkFBSyxJQUFJLGdCQUFNLEVBQUUsZUFBSztBQUN0Qiw0QkFBVSw0QkFBUSxNQUFNO0FBQUEsZ0JBQzFCO0FBQ0Esc0JBQU0sSUFBSSxPQUFPO0FBQUEsY0FDbkIsU0FBUyxHQUFRO0FBQ2Ysc0JBQU0sV0FBVSx1QkFBRyxZQUFXO0FBQzlCLHFCQUFLLElBQUksaUNBQVEsT0FBTyxFQUFFO0FBQzFCLG9CQUFJLFFBQVEsU0FBUyxjQUFJLEdBQUc7QUFDMUIsNEJBQVUsNEVBQWdCLE1BQU07QUFBQSxnQkFDbEMsT0FBTztBQUNMLDRCQUFVLFNBQVMsT0FBTztBQUFBLGdCQUM1QjtBQUFBLGNBQ0YsVUFBRTtBQUNBLG1CQUFHLGNBQWM7QUFDakIsbUJBQUcsV0FBVztBQUFBLGNBQ2hCO0FBQUEsWUFDRixDQUFDO0FBQ0QsaUJBQUssWUFBWSxHQUFHO0FBQUEsVUFDdEI7QUFBQSxRQUNGLFNBQVMsR0FBUTtBQUNmLHFCQUFVLHVCQUFHLFlBQVcsa0RBQVU7QUFBQSxRQUNwQyxVQUFFO0FBQ0EscUJBQVcsV0FBVztBQUN0QixxQkFBVyxZQUFZO0FBQ3ZCLHFCQUFXLFVBQVU7QUFBQSxRQUN2QjtBQUFBLE1BQ0Y7QUFFQSxpQkFBVyxVQUFVLE1BQU0sS0FBSztBQUNoQyxXQUFLO0FBQUEsSUFDUDtBQUFBLElBRVEsSUFBSSxLQUFhO0FBQ3ZCLFVBQUksQ0FBQyxLQUFLLFVBQVc7QUFDckIsWUFBTSxPQUFPLFNBQVMsY0FBYyxLQUFLO0FBQ3pDLFdBQUssY0FBYyxLQUFJLG9CQUFJLEtBQUssR0FBRSxtQkFBbUIsQ0FBQyxLQUFLLEdBQUc7QUFDOUQsV0FBSyxVQUFVLFFBQVEsSUFBSTtBQUFBLElBQzdCO0FBQUEsRUFDRjs7O0FDNUdPLE1BQU0sZ0JBQU4sTUFBb0I7QUFBQSxJQUFwQjtBQUNMLDBCQUFRLGdCQUE4QjtBQUN0QywwQkFBUSxhQUFnRSxDQUFDO0FBQ3pFLDBCQUFRLGFBQW1CLENBQUM7QUFBQTtBQUFBLElBRTVCLE1BQU0sTUFBTSxNQUFtQjtBQUM3QixXQUFLLFdBQVc7QUFDaEIsV0FBSyxZQUFZO0FBRWpCLFlBQU0sTUFBTSxVQUFVLFVBQVU7QUFDaEMsWUFBTSxNQUFNLGtCQUFrQjtBQUM5QixZQUFNQyxRQUFPLEtBQUs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxLQXVEakI7QUFFRCxXQUFLLFlBQVksR0FBRztBQUNwQixXQUFLLFlBQVksSUFBSSxJQUFJO0FBQ3pCLFdBQUssWUFBWUEsS0FBSTtBQUVyQixZQUFNLFFBQVMsZUFBdUIsRUFBRSxPQUFPO0FBQy9DLFVBQUksTUFBTyxnQkFBZSxFQUFFLFFBQVEsS0FBSztBQUN6QyxZQUFNLEtBQUssWUFBWSxFQUFFLFdBQVc7QUFFcEMsWUFBTSxPQUFPLEdBQUdBLE9BQU0sT0FBTztBQUM3QixZQUFNLE9BQU8sR0FBZ0JBLE9BQU0sT0FBTztBQUMxQyxZQUFNLFNBQVMsR0FBc0JBLE9BQU0sTUFBTTtBQUNqRCxZQUFNLFdBQVcsR0FBcUJBLE9BQU0sUUFBUTtBQUNwRCxZQUFNLFlBQVksR0FBcUJBLE9BQU0sU0FBUztBQUN0RCxZQUFNLFdBQVcsR0FBc0JBLE9BQU0sV0FBVztBQUN4RCxZQUFNLFdBQVcsR0FBc0JBLE9BQU0sT0FBTztBQUNwRCxZQUFNLFlBQVksR0FBcUJBLE9BQU0sU0FBUztBQUN0RCxZQUFNLFlBQVksR0FBc0JBLE9BQU0sWUFBWTtBQUMxRCxZQUFNLFNBQVMsR0FBZ0JBLE9BQU0sWUFBWTtBQUNqRCxZQUFNLFdBQVcsR0FBc0JBLE9BQU0sUUFBUTtBQUNyRCxZQUFNLFlBQVksR0FBc0JBLE9BQU0sU0FBUztBQUN2RCxZQUFNLGdCQUFnQixHQUFxQkEsT0FBTSxLQUFLO0FBQ3RELFlBQU0sZ0JBQWdCQSxNQUFLLGNBQWMsZ0JBQWdCO0FBQ3pELFlBQU0sYUFBYSxHQUFzQkEsT0FBTSxVQUFVO0FBRXpELFlBQU0sYUFBYSxDQUFDLFdBQW9CO0FBQ3RDLGVBQU8saUJBQWlCLFlBQVksRUFDakMsUUFBUSxDQUFDLE9BQU87QUFDZixnQkFBTSxPQUFRLEdBQW1CLGFBQWEsVUFBVTtBQUN4RCxjQUFJO0FBQUUsZUFBRyxZQUFZLFdBQVcsTUFBTSxFQUFFLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFBQSxVQUFHLFNBQVE7QUFBQSxVQUFDO0FBQUEsUUFDakUsQ0FBQztBQUFBLE1BQ0w7QUFDQSxpQkFBV0EsS0FBSTtBQUVmLFVBQUksVUFBVSxvQkFBSSxJQUFZO0FBQzlCLFVBQUksYUFBYTtBQUVqQixZQUFNLE1BQU0sQ0FBQyxZQUFvQjtBQUMvQixhQUFLLGNBQWM7QUFBQSxNQUNyQjtBQUVBLFlBQU0sd0JBQXdCLE1BQU07QUFDbEMsZUFBTyxZQUFZO0FBQ25CLGlCQUFTLFlBQVk7QUFDckIsY0FBTSxjQUFjLEtBQUssb0RBQWdDO0FBQ3pELGVBQU8sWUFBWSxXQUFXO0FBQzlCLGNBQU0sZUFBZSxLQUFLLG9EQUFnQztBQUMxRCxpQkFBUyxZQUFZLFlBQVk7QUFDakMsbUJBQVcsT0FBTyxLQUFLLFdBQVc7QUFDaEMsZ0JBQU0sU0FBUyxTQUFTLGNBQWMsUUFBUTtBQUM5QyxpQkFBTyxRQUFRLElBQUk7QUFDbkIsaUJBQU8sY0FBYyxJQUFJLE9BQU8sR0FBRyxJQUFJLElBQUksS0FBSyxJQUFJLEVBQUUsTUFBTSxJQUFJO0FBQ2hFLGlCQUFPLFlBQVksTUFBTTtBQUN6QixnQkFBTSxVQUFVLE9BQU8sVUFBVSxJQUFJO0FBQ3JDLG1CQUFTLFlBQVksT0FBTztBQUFBLFFBQzlCO0FBQUEsTUFDRjtBQUVBLFlBQU0sa0JBQWtCLE1BQU07QUFDNUIsaUJBQVMsWUFBWTtBQUNyQixlQUFPLFlBQVk7QUFDbkIsY0FBTSxnQkFBZ0IsS0FBSyw0RUFBb0M7QUFDL0QsaUJBQVMsWUFBWSxhQUFhO0FBQ2xDLGNBQU0sWUFBWSxLQUFLLFVBQVUsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLGNBQWMsQ0FBQyxLQUFLLFFBQVE7QUFDcEYsWUFBSSxDQUFDLFVBQVUsUUFBUTtBQUNyQixpQkFBTyxjQUFjO0FBQ3JCO0FBQUEsUUFDRjtBQUNBLG1CQUFXLFFBQVEsV0FBVztBQUM1QixnQkFBTSxTQUFTLFNBQVMsY0FBYyxRQUFRO0FBQzlDLGlCQUFPLFFBQVEsS0FBSztBQUNwQixpQkFBTyxjQUFjLEdBQUcsS0FBSyxFQUFFLFNBQU0sS0FBSyxVQUFVLFlBQVMsS0FBSyxLQUFLO0FBQ3ZFLG1CQUFTLFlBQVksTUFBTTtBQUUzQixnQkFBTSxPQUFPLEtBQUssK0VBQStFLEtBQUssRUFBRSxLQUFLLEtBQUssRUFBRSxLQUFLLEtBQUssVUFBVSxZQUFZO0FBQ3BKLGVBQUssVUFBVSxNQUFNO0FBQ25CLHFCQUFTLFFBQVEsS0FBSztBQUN0QixnQkFBSSw4Q0FBVyxLQUFLLEVBQUUsRUFBRTtBQUFBLFVBQzFCO0FBQ0EsaUJBQU8sWUFBWSxJQUFJO0FBQUEsUUFDekI7QUFBQSxNQUNGO0FBRUEsWUFBTSxlQUFlLFlBQVk7QUFDL0IsWUFBSTtBQUNGLGdCQUFNLENBQUMsTUFBTSxLQUFLLElBQUksTUFBTSxRQUFRLElBQUk7QUFBQSxZQUN0QyxlQUFlLEVBQUUsUUFBOEIsa0JBQWtCO0FBQUEsWUFDakUsZUFBZSxFQUFFLFFBQTBCLFFBQVE7QUFBQSxVQUNyRCxDQUFDO0FBQ0QsZUFBSyxZQUFZLEtBQUssYUFBYSxDQUFDO0FBQ3BDLGVBQUssWUFBWSxNQUFNLFNBQVMsQ0FBQztBQUNqQyxnQ0FBc0I7QUFDdEIsMEJBQWdCO0FBQUEsUUFDbEIsU0FBUyxHQUFRO0FBQ2YsZUFBSSx1QkFBRyxZQUFXLG1EQUFXO0FBQUEsUUFDL0I7QUFBQSxNQUNGO0FBRUEsWUFBTSxVQUFVLE9BQU8sT0FBNEIsQ0FBQyxNQUFNO0FBQ3hELFlBQUksV0FBWTtBQUNoQixxQkFBYTtBQUNiLFlBQUksQ0FBQyxLQUFLLE9BQU87QUFBRSxxQkFBVyxZQUFZO0FBQXdDLHFCQUFXLFVBQVU7QUFBQSxRQUFHO0FBQzFHLG1CQUFXLFdBQVc7QUFDdEIsWUFBSTtBQUNGLGdCQUFNLFFBQVEsU0FBUztBQUN2QixnQkFBTSxPQUFPLFVBQVU7QUFDdkIsZ0JBQU0sV0FBVyxjQUFjO0FBQy9CLGdCQUFNLFNBQVMsSUFBSSxnQkFBZ0I7QUFDbkMsaUJBQU8sSUFBSSxRQUFRLElBQUk7QUFDdkIsaUJBQU8sSUFBSSxvQkFBb0IsU0FBUyxFQUFFO0FBQzFDLGNBQUksQ0FBQyxLQUFLLE9BQU87QUFDZixpQkFBSyxZQUFZO0FBQ2pCLHFCQUFTLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSyxNQUFLLFlBQVksS0FBSyw4QkFBOEIsQ0FBQztBQUFBLFVBQ25GO0FBQ0EsZ0JBQU0sT0FBTyxNQUFNLGVBQWUsRUFBRSxRQUE2QixvQkFBb0IsT0FBTyxTQUFTLENBQUMsRUFBRTtBQUN4RyxnQkFBTSxTQUFTLG9CQUFJLElBQVk7QUFDL0IsZUFBSyxZQUFZO0FBQ2pCLGdCQUFNLFNBQVMsS0FBSyxVQUFVLENBQUM7QUFDL0IsY0FBSSxDQUFDLE9BQU8sUUFBUTtBQUNsQixpQkFBSyxZQUFZLEtBQUssMkVBQXVELENBQUM7QUFBQSxVQUNoRjtBQUNBLHFCQUFXLFNBQVMsUUFBUTtBQUMxQixnQkFBSSxZQUFZLE1BQU0sTUFBTSxXQUFXLEdBQUcsR0FBSTtBQUM5QyxtQkFBTyxJQUFJLE1BQU0sRUFBRTtBQUNuQixrQkFBTSxTQUFTLE1BQU0sTUFBTSxXQUFXLEdBQUc7QUFDekMsa0JBQU0sUUFBUSxhQUFhLE1BQU0sU0FBUyxRQUFRLG1CQUFtQixpQkFBaUI7QUFDdEYsa0JBQU0sTUFBTSxLQUFLO0FBQUEsMEJBQ0QsS0FBSztBQUFBO0FBQUE7QUFBQSw0QkFHSCxNQUFNLFNBQVMsUUFBUSxpQkFBTyxjQUFJO0FBQUEsb0JBQzFDLE1BQU0sa0JBQWtCLEVBQUU7QUFBQSxvQkFDMUIsU0FBUywyQ0FBaUMsRUFBRTtBQUFBO0FBQUE7QUFBQSxrQ0FHeEMsTUFBTSxLQUFLLHVCQUFVLE1BQU0sTUFBTTtBQUFBLG9CQUNyQyxNQUFNLGlCQUFpQixzQkFBc0IsTUFBTSxjQUFjLFlBQVksRUFBRTtBQUFBLHVDQUM1RCxNQUFNLEVBQUU7QUFBQTtBQUFBO0FBQUE7QUFBQSxrQkFJN0IsU0FBUywwQ0FBMEMsTUFBTSxFQUFFLDBEQUFnRCxFQUFFO0FBQUE7QUFBQTtBQUFBLFdBR3BIO0FBQ0QsdUJBQVcsR0FBRztBQUNkLGdCQUFJLENBQUMsUUFBUSxJQUFJLE1BQU0sRUFBRSxFQUFHLEtBQUksVUFBVSxJQUFJLE9BQU87QUFDckQsZ0JBQUksaUJBQWlCLFNBQVMsT0FBTyxPQUFPO0FBQzFDLG9CQUFNLFNBQVMsR0FBRztBQUNsQixvQkFBTSxLQUFLLE9BQU8sYUFBYSxTQUFTO0FBQ3hDLGtCQUFJLENBQUMsR0FBSTtBQUNULGtCQUFJO0FBQ0YsdUJBQU8sYUFBYSxZQUFZLE1BQU07QUFDdEMsc0JBQU0sZUFBZSxFQUFFLFFBQVEsb0JBQW9CLEVBQUUsSUFBSSxFQUFFLFFBQVEsU0FBUyxDQUFDO0FBQzdFLDBCQUFVLDRCQUFRLFNBQVM7QUFDM0Isc0JBQU0sUUFBUTtBQUFBLGNBQ2hCLFNBQVMsR0FBUTtBQUNmLDJCQUFVLHVCQUFHLFlBQVcsNEJBQVEsT0FBTztBQUFBLGNBQ3pDLFVBQUU7QUFDQSx1QkFBTyxnQkFBZ0IsVUFBVTtBQUFBLGNBQ25DO0FBQUEsWUFDRixDQUFDO0FBQ0QsaUJBQUssWUFBWSxHQUFHO0FBQUEsVUFDdEI7QUFDQSxvQkFBVTtBQUNWLGNBQUksQ0FBQyxLQUFLLG1CQUFtQjtBQUMzQixpQkFBSyxZQUFZLEtBQUsseUdBQTRELENBQUM7QUFBQSxVQUNyRjtBQUFBLFFBQ0YsU0FBUyxHQUFRO0FBQ2YsZUFBSSx1QkFBRyxZQUFXLHNDQUFRO0FBQUEsUUFDNUIsVUFBRTtBQUNBLHVCQUFhO0FBQ2IscUJBQVcsV0FBVztBQUN0QixxQkFBVyxZQUFZO0FBQ3ZCLHFCQUFXLFVBQVU7QUFBQSxRQUN2QjtBQUFBLE1BQ0Y7QUFFQSxlQUFTLFVBQVUsWUFBWTtBQUM3QixjQUFNLFFBQVEsT0FBTyxNQUFNLEtBQUs7QUFDaEMsY0FBTSxRQUFRLE9BQU8sU0FBUyxLQUFLO0FBQ25DLGNBQU0sU0FBUyxPQUFPLFVBQVUsS0FBSztBQUNyQyxZQUFJLENBQUMsT0FBTztBQUNWLG9CQUFVLG9EQUFZLE1BQU07QUFDNUI7QUFBQSxRQUNGO0FBQ0EsWUFBSSxTQUFTLEtBQUssVUFBVSxHQUFHO0FBQzdCLG9CQUFVLHNFQUFlLE1BQU07QUFDL0I7QUFBQSxRQUNGO0FBQ0EsaUJBQVMsV0FBVztBQUNwQixpQkFBUyxjQUFjO0FBQ3ZCLFlBQUk7QUFDRixnQkFBTSxNQUFNLE1BQU0sZUFBZSxFQUFFLFFBQXdCLG9CQUFvQjtBQUFBLFlBQzdFLFFBQVE7QUFBQSxZQUNSLE1BQU0sS0FBSyxVQUFVLEVBQUUsTUFBTSxPQUFPLGtCQUFrQixPQUFPLE9BQU8sT0FBTyxDQUFDO0FBQUEsVUFDOUUsQ0FBQztBQUNELG9CQUFVLG9DQUFXLElBQUksRUFBRSxLQUFLLFNBQVM7QUFDekMsY0FBSSw2QkFBUyxJQUFJLEVBQUUsRUFBRTtBQUNyQixnQkFBTSxJQUFJLE9BQU87QUFDakIsZ0JBQU0sUUFBUTtBQUFBLFFBQ2hCLFNBQVMsR0FBUTtBQUNmLHFCQUFVLHVCQUFHLFlBQVcsd0NBQVUsT0FBTztBQUN6QyxlQUFJLHVCQUFHLFlBQVcsc0NBQVE7QUFBQSxRQUM1QixVQUFFO0FBQ0EsbUJBQVMsV0FBVztBQUNwQixtQkFBUyxjQUFjO0FBQUEsUUFDekI7QUFBQSxNQUNGO0FBRUEsZ0JBQVUsVUFBVSxZQUFZO0FBQzlCLGNBQU0sU0FBUyxTQUFTLE1BQU0sS0FBSztBQUNuQyxjQUFNLFFBQVEsT0FBTyxVQUFVLEtBQUs7QUFDcEMsWUFBSSxDQUFDLFFBQVE7QUFDWCxvQkFBVSwwREFBYSxNQUFNO0FBQzdCO0FBQUEsUUFDRjtBQUNBLFlBQUksU0FBUyxHQUFHO0FBQ2Qsb0JBQVUsb0RBQVksTUFBTTtBQUM1QjtBQUFBLFFBQ0Y7QUFDQSxrQkFBVSxXQUFXO0FBQ3JCLGtCQUFVLGNBQWM7QUFDeEIsWUFBSTtBQUNGLGdCQUFNLE1BQU0sTUFBTSxlQUFlLEVBQUUsUUFBd0Isb0JBQW9CO0FBQUEsWUFDN0UsUUFBUTtBQUFBLFlBQ1IsTUFBTSxLQUFLLFVBQVUsRUFBRSxNQUFNLFFBQVEsa0JBQWtCLFFBQVEsTUFBTSxDQUFDO0FBQUEsVUFDeEUsQ0FBQztBQUNELG9CQUFVLG9DQUFXLElBQUksRUFBRSxLQUFLLFNBQVM7QUFDekMsY0FBSSw2QkFBUyxJQUFJLEVBQUUsRUFBRTtBQUNyQixnQkFBTSxJQUFJLE9BQU87QUFDakIsZ0JBQU0sYUFBYTtBQUNuQixnQkFBTSxRQUFRO0FBQUEsUUFDaEIsU0FBUyxHQUFRO0FBQ2YscUJBQVUsdUJBQUcsWUFBVyx3Q0FBVSxPQUFPO0FBQ3pDLGVBQUksdUJBQUcsWUFBVyxzQ0FBUTtBQUFBLFFBQzVCLFVBQUU7QUFDQSxvQkFBVSxXQUFXO0FBQ3JCLG9CQUFVLGNBQWM7QUFBQSxRQUMxQjtBQUFBLE1BQ0Y7QUFFQSxpQkFBVyxVQUFVLE1BQU0sUUFBUTtBQUNuQyxlQUFTLFdBQVcsTUFBTSxRQUFRO0FBQ2xDLGdCQUFVLFdBQVcsTUFBTSxRQUFRO0FBQ25DLG9CQUFjLFdBQVcsTUFBTTtBQUFFLFlBQUksY0FBZSxlQUFjLFVBQVUsT0FBTyxVQUFVLGNBQWMsT0FBTztBQUFHLGdCQUFRO0FBQUEsTUFBRztBQUNoSSxVQUFJLGNBQWUsZUFBYyxVQUFVLE9BQU8sVUFBVSxjQUFjLE9BQU87QUFFakYsWUFBTSxRQUFRLElBQUksQ0FBQyxJQUFJLE9BQU8sR0FBRyxhQUFhLENBQUMsQ0FBQztBQUNoRCxZQUFNLFFBQVEsRUFBRSxPQUFPLEtBQUssQ0FBQztBQUM3QixXQUFLLGVBQWUsT0FBTyxZQUFZLE1BQU07QUFDM0MsZ0JBQVEsRUFBRSxPQUFPLEtBQUssQ0FBQyxFQUFFLE1BQU0sTUFBTTtBQUFBLFFBQUMsQ0FBQztBQUFBLE1BQ3pDLEdBQUcsR0FBSztBQUFBLElBQ1Y7QUFBQSxJQUVRLGFBQWE7QUFDbkIsVUFBSSxLQUFLLGlCQUFpQixNQUFNO0FBQzlCLGVBQU8sY0FBYyxLQUFLLFlBQVk7QUFDdEMsYUFBSyxlQUFlO0FBQUEsTUFDdEI7QUFBQSxJQUNGO0FBQUEsRUFDRjs7O0FDclZPLE1BQU0sZUFBTixNQUFtQjtBQUFBLElBQ3hCLE1BQU0sTUFBbUI7QUFDdkIsV0FBSyxZQUFZO0FBQ2pCLFdBQUssWUFBWSxVQUFVLFNBQVMsQ0FBQztBQUNyQyxZQUFNLE1BQU0sa0JBQWtCO0FBQzlCLFdBQUssWUFBWSxJQUFJLElBQUk7QUFFekIsWUFBTUMsUUFBTyxLQUFLO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxLQVdqQjtBQUNELFdBQUssWUFBWUEsS0FBSTtBQUVyQixZQUFNLFFBQVMsZUFBdUIsRUFBRSxPQUFPO0FBQy9DLFVBQUksTUFBTyxnQkFBZSxFQUFFLFFBQVEsS0FBSztBQUV6QyxZQUFNLFFBQVEsR0FBR0EsT0FBTSxLQUFLO0FBQzVCLFlBQU0sT0FBTyxHQUFHQSxPQUFNLE9BQU87QUFDN0IsWUFBTSxhQUFhLEdBQXNCQSxPQUFNLFVBQVU7QUFDekQsWUFBTSxhQUFhLENBQUMsV0FBb0I7QUFDdEMsZUFBTyxpQkFBaUIsWUFBWSxFQUNqQyxRQUFRLENBQUMsT0FBTztBQUNmLGdCQUFNLE9BQVEsR0FBbUIsYUFBYSxVQUFVO0FBQ3hELGNBQUk7QUFBRSxlQUFHLFlBQVksV0FBVyxNQUFNLEVBQUUsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUFBLFVBQUcsU0FBUTtBQUFBLFVBQUM7QUFBQSxRQUNqRSxDQUFDO0FBQUEsTUFDTDtBQUNBLGlCQUFXQSxLQUFJO0FBRWYsWUFBTSxPQUFPLFlBQVk7QUFDdkIsbUJBQVcsV0FBVztBQUN0QixtQkFBVyxZQUFZO0FBQ3ZCLG1CQUFXLFVBQVU7QUFDckIsY0FBTSxJQUFJLE9BQU87QUFDakIsYUFBSyxZQUFZO0FBQ2pCLGlCQUFTLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSyxNQUFLLFlBQVksS0FBSyw4QkFBOEIsQ0FBQztBQUNqRixZQUFJO0FBQ0YsZ0JBQU0sS0FBSyxNQUFNLGVBQWUsRUFBRSxRQUF5QyxhQUFhO0FBQ3hGLGdCQUFNLE1BQU0sTUFBTSxlQUFlLEVBQUUsUUFBeUIsbUJBQW1CO0FBQy9FLGdCQUFNLGNBQWMsa0NBQVMsR0FBRyxJQUFJLGlDQUFVLEdBQUcsS0FBSztBQUN0RCxlQUFLLFlBQVk7QUFDakIscUJBQVcsU0FBUyxJQUFJLE1BQU07QUFDNUIsa0JBQU0sUUFBUSxNQUFNLFNBQVMsSUFBSSxjQUFPLE1BQU0sU0FBUyxJQUFJLGNBQU8sTUFBTSxTQUFTLElBQUksY0FBTztBQUM1RixrQkFBTSxNQUFNLE1BQU0sUUFBUSxJQUFJLG9CQUFvQjtBQUNsRCxrQkFBTSxNQUFNLEtBQUs7QUFBQSxtQ0FDUSxHQUFHO0FBQUEsc0JBQ2hCLEtBQUssS0FBSyxNQUFNLElBQUk7QUFBQSx1SUFDNkYsTUFBTSxNQUFNO0FBQUEsd0JBQzNILE1BQU0sS0FBSztBQUFBO0FBQUEsV0FFeEI7QUFDRCx1QkFBVyxHQUFHO0FBQ2QsaUJBQUssWUFBWSxHQUFHO0FBQUEsVUFDdEI7QUFBQSxRQUNGLFNBQVMsR0FBUTtBQUNmLGdCQUFNLGVBQWMsdUJBQUcsWUFBVztBQUFBLFFBQ3BDLFVBQUU7QUFDQSxxQkFBVyxXQUFXO0FBQ3RCLHFCQUFXLFlBQVk7QUFDdkIscUJBQVcsVUFBVTtBQUFBLFFBQ3ZCO0FBQUEsTUFDRjtBQUNBLGlCQUFXLFVBQVUsTUFBTSxLQUFLO0FBQ2hDLFdBQUs7QUFBQSxJQUNQO0FBQUEsRUFDRjs7O0FDL0VBLE1BQUksV0FBVztBQUVSLFdBQVMscUJBQXFCO0FBQ25DLFFBQUksU0FBVTtBQUNkLFVBQU0sTUFBTTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBdUhaLFVBQU0sUUFBUSxTQUFTLGNBQWMsT0FBTztBQUM1QyxVQUFNLGFBQWEsV0FBVyxZQUFZO0FBQzFDLFVBQU0sY0FBYztBQUNwQixhQUFTLEtBQUssWUFBWSxLQUFLO0FBQy9CLGVBQVc7QUFHWCxRQUFJO0FBQ0YsWUFBTSxTQUFTLFNBQVMsY0FBYyxjQUFjO0FBQ3BELFVBQUksQ0FBQyxRQUFRO0FBQ1gsY0FBTSxNQUFNLFNBQVMsY0FBYyxRQUFRO0FBQzNDLFlBQUksYUFBYSxjQUFjLEVBQUU7QUFDakMsWUFBSSxNQUFNLFVBQVU7QUFDcEIsaUJBQVMsS0FBSyxZQUFZLEdBQUc7QUFDN0IsY0FBTSxNQUFNLElBQUksV0FBVyxJQUFJO0FBQy9CLGNBQU0sUUFBUSxNQUFNLEtBQUssRUFBRSxRQUFRLEdBQUcsR0FBRyxPQUFPLEVBQUUsR0FBRyxLQUFLLE9BQU8sR0FBRyxHQUFHLEtBQUssT0FBTyxHQUFHLEdBQUcsS0FBSyxPQUFPLElBQUUsTUFBSSxLQUFLLEdBQUcsS0FBSyxPQUFPLElBQUUsTUFBSSxJQUFJLEVBQUU7QUFFM0ksY0FBTSxVQUFvQixDQUFDO0FBQzNCLGNBQU0sY0FBYyxNQUFNO0FBQ3hCLGdCQUFNLElBQUksS0FBSyxPQUFPLElBQUUsSUFBSSxRQUFNLE1BQU0sSUFBSSxRQUFNO0FBQ2xELGdCQUFNLElBQUk7QUFDVixnQkFBTSxRQUFRLElBQUksS0FBSyxPQUFPLElBQUU7QUFDaEMsZ0JBQU0sUUFBUSxLQUFLLEtBQUcsTUFBTSxLQUFLLE9BQU8sSUFBRTtBQUMxQyxrQkFBUSxLQUFLLEVBQUUsR0FBRyxHQUFHLElBQUksS0FBSyxJQUFJLEtBQUssSUFBRSxPQUFPLElBQUksS0FBSyxJQUFJLEtBQUssSUFBRSxPQUFPLE1BQU0sR0FBRyxLQUFLLE9BQU8sS0FBSyxPQUFPLElBQUUsSUFBSSxDQUFDO0FBQUEsUUFDckg7QUFFQSxjQUFNLE9BQU8sTUFBTSxLQUFLLEVBQUUsUUFBUSxFQUFFLEdBQUcsT0FBTyxFQUFFLEdBQUcsS0FBSyxPQUFPLEdBQUcsR0FBRyxLQUFLLE9BQU8sSUFBRSxNQUFNLEtBQUssR0FBRyxLQUFLLE9BQU8sSUFBRSxLQUFLLElBQUksS0FBSyxLQUFLLE9BQU8sRUFBRSxFQUFFO0FBQzdJLGNBQU0sTUFBTSxNQUFNO0FBQUUsY0FBSSxRQUFRLE9BQU87QUFBWSxjQUFJLFNBQVMsT0FBTztBQUFBLFFBQWE7QUFDcEYsWUFBSTtBQUNKLGVBQU8saUJBQWlCLFVBQVUsR0FBRztBQUNyQyxZQUFJLElBQUk7QUFDUixjQUFNLE9BQU8sTUFBTTtBQUNqQixjQUFJLENBQUMsSUFBSztBQUNWLGVBQUs7QUFDTCxjQUFJLFVBQVUsR0FBRSxHQUFFLElBQUksT0FBTSxJQUFJLE1BQU07QUFFdEMscUJBQVcsTUFBTSxNQUFNO0FBQ3JCLGtCQUFNLElBQUksR0FBRyxJQUFJLElBQUksT0FBTyxJQUFJLEdBQUcsSUFBSSxJQUFJO0FBQzNDLGtCQUFNLFNBQVMsS0FBSyxJQUFJLElBQUUsTUFBTSxJQUFFLEtBQU0sSUFBRSxNQUFJLE9BQUs7QUFDbkQsa0JBQU0sTUFBTSxHQUFHLEtBQUssSUFBRTtBQUN0QixrQkFBTUMsUUFBTyxJQUFJLHFCQUFxQixHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztBQUN4RCxZQUFBQSxNQUFLLGFBQWEsR0FBRyx1QkFBdUI7QUFDNUMsWUFBQUEsTUFBSyxhQUFhLEdBQUcsZUFBZTtBQUNwQyxnQkFBSSxZQUFZQTtBQUNoQixnQkFBSSxVQUFVO0FBQ2QsZ0JBQUksSUFBSSxHQUFHLEdBQUcsS0FBSyxHQUFHLEtBQUssS0FBRyxDQUFDO0FBQy9CLGdCQUFJLEtBQUs7QUFBQSxVQUNYO0FBRUEscUJBQVcsTUFBTSxPQUFPO0FBQ3RCLGtCQUFNLElBQUksR0FBRyxJQUFJLElBQUksT0FBTyxJQUFJLEdBQUcsSUFBSSxJQUFJO0FBQzNDLGtCQUFNLE1BQU0sS0FBSyxJQUFJLElBQUUsTUFBTSxJQUFFLE9BQVEsSUFBRSxJQUFLLElBQUUsTUFBSSxPQUFLLE1BQUk7QUFDN0QsZ0JBQUksVUFBVTtBQUNkLGdCQUFJLElBQUksR0FBRyxHQUFHLEdBQUcsSUFBSSxLQUFHLEtBQUssR0FBRyxLQUFLLEtBQUcsQ0FBQztBQUN6QyxnQkFBSSxZQUFZO0FBQ2hCLGdCQUFJLEtBQUs7QUFBQSxVQUNYO0FBRUEsY0FBSSxLQUFLLE9BQU8sSUFBSSxTQUFTLFFBQVEsU0FBUyxFQUFHLGFBQVk7QUFDN0QsbUJBQVMsSUFBRSxRQUFRLFNBQU8sR0FBRyxLQUFHLEdBQUcsS0FBSztBQUN0QyxrQkFBTSxJQUFJLFFBQVEsQ0FBQztBQUNuQixjQUFFLEtBQUssRUFBRTtBQUFJLGNBQUUsS0FBSyxFQUFFO0FBQUksY0FBRSxRQUFRO0FBRXBDLGtCQUFNLFFBQVEsSUFBSSxxQkFBcUIsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxLQUFHLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBRyxDQUFDO0FBQzNFLGtCQUFNLGFBQWEsR0FBRyx1QkFBdUI7QUFDN0Msa0JBQU0sYUFBYSxHQUFHLHFCQUFxQjtBQUMzQyxnQkFBSSxjQUFjO0FBQ2xCLGdCQUFJLFlBQVk7QUFDaEIsZ0JBQUksVUFBVTtBQUNkLGdCQUFJLE9BQU8sRUFBRSxJQUFJLEVBQUUsS0FBRyxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUcsRUFBRTtBQUN2QyxnQkFBSSxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDbkIsZ0JBQUksT0FBTztBQUNYLGdCQUFJLEVBQUUsSUFBSSxJQUFJLFNBQVMsTUFBTSxFQUFFLElBQUksT0FBTyxFQUFFLElBQUksSUFBSSxRQUFRLE1BQU0sRUFBRSxPQUFPLEVBQUUsS0FBSztBQUNoRixzQkFBUSxPQUFPLEdBQUUsQ0FBQztBQUFBLFlBQ3BCO0FBQUEsVUFDRjtBQUNBLGdDQUFzQixJQUFJO0FBQUEsUUFDNUI7QUFDQSw4QkFBc0IsSUFBSTtBQUFBLE1BQzVCO0FBQUEsSUFDRixTQUFRO0FBQUEsSUFBQztBQUFBLEVBQ1g7OztBQ25NQSxXQUFTLFFBQVEsV0FBd0I7QUFDdkMsVUFBTSxJQUFJLFNBQVMsUUFBUTtBQUMzQixVQUFNLFFBQVEsRUFBRSxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQzVCLFlBQVEsT0FBTztBQUFBLE1BQ2IsS0FBSztBQUNILFlBQUksVUFBVSxFQUFFLE1BQU0sU0FBUztBQUMvQjtBQUFBLE1BQ0YsS0FBSztBQUNILFlBQUksZUFBZSxFQUFFLE1BQU0sU0FBUztBQUNwQztBQUFBLE1BQ0YsS0FBSztBQUNILFlBQUksYUFBYSxFQUFFLE1BQU0sU0FBUztBQUNsQztBQUFBLE1BQ0YsS0FBSztBQUNILFlBQUksY0FBYyxFQUFFLE1BQU0sU0FBUztBQUNuQztBQUFBLE1BQ0YsS0FBSztBQUNILFlBQUksYUFBYSxFQUFFLE1BQU0sU0FBUztBQUNsQztBQUFBLE1BQ0Y7QUFDRSxZQUFJLFdBQVcsRUFBRSxNQUFNLFNBQVM7QUFBQSxJQUNwQztBQUFBLEVBQ0Y7QUFFQSxpQkFBc0IsVUFBVSxXQUF3QjtBQUN0RCx1QkFBbUI7QUFDbkIsWUFBUSxTQUFTO0FBQ2pCLFdBQU8sZUFBZSxNQUFNLFFBQVEsU0FBUztBQUFBLEVBQy9DO0FBR0EsTUFBSSxPQUFPLFdBQVcsYUFBYTtBQUNqQyxJQUFDLE9BQWUsV0FBVyxFQUFFLFdBQVcsWUFBWTtBQUFBLEVBQ3REOyIsCiAgIm5hbWVzIjogWyJ2aWV3IiwgInZpZXciLCAidmlldyIsICJ2aWV3IiwgInZpZXciLCAidmlldyIsICJncmFkIl0KfQo=
