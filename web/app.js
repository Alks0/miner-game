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
      <div class="container" style="color:#fff;">
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
      <div class="container" style="color:#fff;">
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
      <div class="container" style="color:#fff;">
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
      <div class="container" style="color:#fff;">
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
      <div class="container" style="color:#fff;display:flex;flex-direction:column;gap:12px;">
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
      <div class="container" style="color:#fff;">
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
    const css = `:root{--bg:#0b1020;--bg-2:#0f1530;--fg:#fff;--muted:rgba(255,255,255,.75);--grad:linear-gradient(135deg,#7B2CF5,#2C89F5);--panel-grad:linear-gradient(135deg,rgba(123,44,245,.25),rgba(44,137,245,.25));--glass:blur(10px);--glow:0 8px 20px rgba(0,0,0,.35),0 0 12px rgba(123,44,245,.7);--radius-sm:10px;--radius-md:12px;--radius-lg:16px;--ease:cubic-bezier(.22,.61,.36,1);--dur:.28s;--buy:#2C89F5;--sell:#E36414;--ok:#2ec27e;--warn:#f6c445;--danger:#ff5c5c;--rarity-common:#9aa0a6;--rarity-rare:#4fd4f5;--rarity-epic:#b26bff;--rarity-legendary:#f6c445}
html,body{background:radial-gradient(1200px 600px at 50% -10%, rgba(123,44,245,.15), transparent),var(--bg);color:var(--fg);font-family:system-ui,-apple-system,"Segoe UI","PingFang SC","Microsoft YaHei",Arial,sans-serif}
html{color-scheme:dark}
.container{padding:0 12px}
.container{max-width:680px;margin:12px auto}
.card{border-radius:var(--radius-lg);background:var(--panel-grad);backdrop-filter:var(--glass);box-shadow:var(--glow);padding:12px}
.row{display:flex;gap:8px;align-items:center}
.card input,.card button{box-sizing:border-box;outline:none}
.card input{background:rgba(255,255,255,.08);border:0;border-radius:var(--radius-md);color:var(--fg);padding:10px;margin:8px 0;appearance:none;-webkit-appearance:none;background-clip:padding-box}
.card select.input, select.input{background:rgba(255,255,255,.08);color:var(--fg);border:0;border-radius:var(--radius-md);padding:10px;margin:8px 0;appearance:none;-webkit-appearance:none;background-clip:padding-box}
.card select.input option, select.input option{background:#0b1020;color:#fff}
.card select.input:focus, select.input:focus{outline:2px solid rgba(123,44,245,.45)}
.card button{width:100%;border-radius:var(--radius-md)}
.btn{padding:10px 14px;border:0;border-radius:var(--radius-md);color:#fff;transition:transform var(--dur) var(--ease),box-shadow var(--dur) var(--ease)}
.btn .icon{margin-right:6px}
.btn:active{transform:translateY(1px) scale(.99)}
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
.nav{max-width:480px;margin:12px auto 0;display:flex;gap:8px;flex-wrap:wrap;position:sticky;top:0;z-index:10}
.nav a{flex:1;display:flex;justify-content:center;align-items:center;gap:6px;text-align:center;padding:10px;border-radius:999px;text-decoration:none;color:#fff}
.nav a .ico{opacity:.95}
.nav a.active{background:var(--grad);box-shadow:var(--glow)}
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
        cvs.style.cssText = "position:fixed;inset:0;z-index:-1;opacity:.35;pointer-events:none;";
        document.body.appendChild(cvs);
        const ctx = cvs.getContext("2d");
        const stars = Array.from({ length: 60 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.2 + 0.2, s: Math.random() * 0.8 + 0.2 }));
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
          for (const st of stars) {
            const x = st.x * cvs.width, y = st.y * cvs.height;
            const tw = (Math.sin(t * 1.6 + x * 2e-3 + y * 3e-3) * 0.5 + 0.5) * 0.5 + 0.5;
            ctx.beginPath();
            ctx.arc(x, y, st.r + tw * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(180,200,255,0.6)";
            ctx.fill();
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vZnJvbnRlbmQtc2NyaXB0cy9jb3JlL05ldHdvcmtNYW5hZ2VyLnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvY29yZS9HYW1lTWFuYWdlci50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL3V0aWxzL2RvbS50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvbXBvbmVudHMvSWNvbi50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvbXBvbmVudHMvVG9hc3QudHMiLCAiLi4vZnJvbnRlbmQtc2NyaXB0cy9zY2VuZXMvTG9naW5TY2VuZS50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvcmUvRW52LnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvY29yZS9SZWFsdGltZUNsaWVudC50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvbXBvbmVudHMvTmF2LnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvY29tcG9uZW50cy9SZXNvdXJjZUJhci50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvbXBvbmVudHMvRmxvYXRUZXh0LnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvc2NlbmVzL01haW5TY2VuZS50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL3NjZW5lcy9XYXJlaG91c2VTY2VuZS50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL3NjZW5lcy9QbHVuZGVyU2NlbmUudHMiLCAiLi4vZnJvbnRlbmQtc2NyaXB0cy9zY2VuZXMvRXhjaGFuZ2VTY2VuZS50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL3NjZW5lcy9SYW5raW5nU2NlbmUudHMiLCAiLi4vZnJvbnRlbmQtc2NyaXB0cy9zdHlsZXMvaW5qZWN0LnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvQXBwLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJleHBvcnQgY2xhc3MgTmV0d29ya01hbmFnZXIge1xyXG4gIHByaXZhdGUgc3RhdGljIF9pbnN0YW5jZTogTmV0d29ya01hbmFnZXI7XHJcbiAgc3RhdGljIGdldCBJKCk6IE5ldHdvcmtNYW5hZ2VyIHsgcmV0dXJuIHRoaXMuX2luc3RhbmNlID8/ICh0aGlzLl9pbnN0YW5jZSA9IG5ldyBOZXR3b3JrTWFuYWdlcigpKTsgfVxyXG5cclxuICBwcml2YXRlIHRva2VuOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcclxuICBzZXRUb2tlbih0OiBzdHJpbmcgfCBudWxsKSB7IHRoaXMudG9rZW4gPSB0OyB9XHJcblxyXG4gIGFzeW5jIHJlcXVlc3Q8VD4ocGF0aDogc3RyaW5nLCBpbml0PzogUmVxdWVzdEluaXQpOiBQcm9taXNlPFQ+IHtcclxuICAgIGNvbnN0IGhlYWRlcnM6IGFueSA9IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJywgLi4uKGluaXQ/LmhlYWRlcnMgfHwge30pIH07XHJcbiAgICBpZiAodGhpcy50b2tlbikgaGVhZGVyc1snQXV0aG9yaXphdGlvbiddID0gYEJlYXJlciAke3RoaXMudG9rZW59YDtcclxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKHRoaXMuZ2V0QmFzZSgpICsgcGF0aCwgeyAuLi5pbml0LCBoZWFkZXJzIH0pO1xyXG4gICAgY29uc3QganNvbiA9IGF3YWl0IHJlcy5qc29uKCk7XHJcbiAgICBpZiAoIXJlcy5vayB8fCBqc29uLmNvZGUgPj0gNDAwKSB0aHJvdyBuZXcgRXJyb3IoanNvbi5tZXNzYWdlIHx8ICdSZXF1ZXN0IEVycm9yJyk7XHJcbiAgICByZXR1cm4ganNvbi5kYXRhIGFzIFQ7XHJcbiAgfVxyXG5cclxuICBnZXRCYXNlKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gKHdpbmRvdyBhcyBhbnkpLl9fQVBJX0JBU0VfXyB8fCAnaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaSc7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuIiwgImltcG9ydCB7IE5ldHdvcmtNYW5hZ2VyIH0gZnJvbSAnLi9OZXR3b3JrTWFuYWdlcic7XHJcblxyXG5leHBvcnQgdHlwZSBQcm9maWxlID0geyBpZDogc3RyaW5nOyB1c2VybmFtZTogc3RyaW5nOyBuaWNrbmFtZTogc3RyaW5nOyBvcmVBbW91bnQ6IG51bWJlcjsgYmJDb2luczogbnVtYmVyIH07XHJcblxyXG5leHBvcnQgY2xhc3MgR2FtZU1hbmFnZXIge1xyXG4gIHByaXZhdGUgc3RhdGljIF9pbnN0YW5jZTogR2FtZU1hbmFnZXI7XHJcbiAgc3RhdGljIGdldCBJKCk6IEdhbWVNYW5hZ2VyIHsgcmV0dXJuIHRoaXMuX2luc3RhbmNlID8/ICh0aGlzLl9pbnN0YW5jZSA9IG5ldyBHYW1lTWFuYWdlcigpKTsgfVxyXG5cclxuICBwcml2YXRlIHByb2ZpbGU6IFByb2ZpbGUgfCBudWxsID0gbnVsbDtcclxuICBnZXRQcm9maWxlKCk6IFByb2ZpbGUgfCBudWxsIHsgcmV0dXJuIHRoaXMucHJvZmlsZTsgfVxyXG5cclxuICBhc3luYyBsb2dpbk9yUmVnaXN0ZXIodXNlcm5hbWU6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgY29uc3Qgbm0gPSBOZXR3b3JrTWFuYWdlci5JO1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgciA9IGF3YWl0IG5tLnJlcXVlc3Q8eyBhY2Nlc3NfdG9rZW46IHN0cmluZzsgdXNlcjogYW55IH0+KCcvYXV0aC9sb2dpbicsIHsgbWV0aG9kOiAnUE9TVCcsIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgdXNlcm5hbWUsIHBhc3N3b3JkIH0pIH0pO1xyXG4gICAgICBubS5zZXRUb2tlbihyLmFjY2Vzc190b2tlbik7XHJcbiAgICB9IGNhdGNoIHtcclxuICAgICAgY29uc3QgciA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IGFjY2Vzc190b2tlbjogc3RyaW5nOyB1c2VyOiBhbnkgfT4oJy9hdXRoL3JlZ2lzdGVyJywgeyBtZXRob2Q6ICdQT1NUJywgYm9keTogSlNPTi5zdHJpbmdpZnkoeyB1c2VybmFtZSwgcGFzc3dvcmQgfSkgfSk7XHJcbiAgICAgIE5ldHdvcmtNYW5hZ2VyLkkuc2V0VG9rZW4oci5hY2Nlc3NfdG9rZW4pO1xyXG4gICAgfVxyXG4gICAgdGhpcy5wcm9maWxlID0gYXdhaXQgbm0ucmVxdWVzdDxQcm9maWxlPignL3VzZXIvcHJvZmlsZScpO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbiIsICJleHBvcnQgZnVuY3Rpb24gaHRtbCh0ZW1wbGF0ZTogc3RyaW5nKTogSFRNTEVsZW1lbnQge1xyXG4gIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gIGRpdi5pbm5lckhUTUwgPSB0ZW1wbGF0ZS50cmltKCk7XHJcbiAgcmV0dXJuIGRpdi5maXJzdEVsZW1lbnRDaGlsZCBhcyBIVE1MRWxlbWVudDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHFzPFQgZXh0ZW5kcyBFbGVtZW50ID0gSFRNTEVsZW1lbnQ+KHJvb3Q6IFBhcmVudE5vZGUsIHNlbDogc3RyaW5nKTogVCB7XHJcbiAgY29uc3QgZWwgPSByb290LnF1ZXJ5U2VsZWN0b3Ioc2VsKSBhcyBUIHwgbnVsbDtcclxuICBpZiAoIWVsKSB0aHJvdyBuZXcgRXJyb3IoYE1pc3NpbmcgZWxlbWVudDogJHtzZWx9YCk7XHJcbiAgcmV0dXJuIGVsIGFzIFQ7XHJcbn1cclxuXHJcblxyXG4iLCAiaW1wb3J0IHsgaHRtbCB9IGZyb20gJy4uL3V0aWxzL2RvbSc7XG5cbmV4cG9ydCB0eXBlIEljb25OYW1lID1cbiAgfCAnaG9tZSdcbiAgfCAnd2FyZWhvdXNlJ1xuICB8ICdwbHVuZGVyJ1xuICB8ICdleGNoYW5nZSdcbiAgfCAncmFua2luZydcbiAgfCAnb3JlJ1xuICB8ICdjb2luJ1xuICB8ICdwaWNrJ1xuICB8ICdyZWZyZXNoJ1xuICB8ICdwbGF5J1xuICB8ICdzdG9wJ1xuICB8ICdjb2xsZWN0J1xuICB8ICd3cmVuY2gnXG4gIHwgJ3NoaWVsZCdcbiAgfCAnbGlzdCdcbiAgfCAndXNlcidcbiAgfCAnbG9jaydcbiAgfCAnZXllJ1xuICB8ICdleWUtb2ZmJ1xuICB8ICdzd29yZCdcbiAgfCAndHJvcGh5J1xuICB8ICdjbG9jaydcbiAgfCAnYm9sdCdcbiAgfCAndHJhc2gnXG4gIHwgJ2Nsb3NlJ1xuICB8ICdhcnJvdy1yaWdodCdcbiAgfCAndGFyZ2V0JztcblxuZnVuY3Rpb24gZ3JhZChpZDogc3RyaW5nKSB7XG4gIHJldHVybiBgPGRlZnM+XG4gICAgPGxpbmVhckdyYWRpZW50IGlkPVwiJHtpZH1cIiB4MT1cIjBcIiB5MT1cIjBcIiB4Mj1cIjFcIiB5Mj1cIjFcIj5cbiAgICAgIDxzdG9wIG9mZnNldD1cIjAlXCIgc3RvcC1jb2xvcj1cIiM3QjJDRjVcIiAvPlxuICAgICAgPHN0b3Agb2Zmc2V0PVwiMTAwJVwiIHN0b3AtY29sb3I9XCIjMkM4OUY1XCIgLz5cbiAgICA8L2xpbmVhckdyYWRpZW50PlxuICA8L2RlZnM+YDtcbn1cblxuZnVuY3Rpb24gc3ZnV3JhcChwYXRoOiBzdHJpbmcsIHNpemUgPSAxOCwgY2xzID0gJycpOiBIVE1MRWxlbWVudCB7XG4gIGNvbnN0IGdpZCA9ICdpZy0nICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc2xpY2UoMiwgOCk7XG4gIGNvbnN0IGVsID0gaHRtbChgPHNwYW4gY2xhc3M9XCJpY29uICR7Y2xzfVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPiR7XG4gICAgYDxzdmcgd2lkdGg9XCIke3NpemV9XCIgaGVpZ2h0PVwiJHtzaXplfVwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj4ke2dyYWQoZ2lkKX0ke3BhdGgucmVwbGFjZUFsbCgnX19HUkFEX18nLCBgdXJsKCMke2dpZH0pYCl9PC9zdmc+YFxuICB9PC9zcGFuPmApO1xuICByZXR1cm4gZWw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJJY29uKG5hbWU6IEljb25OYW1lLCBvcHRzOiB7IHNpemU/OiBudW1iZXI7IGNsYXNzTmFtZT86IHN0cmluZyB9ID0ge30pIHtcbiAgY29uc3Qgc2l6ZSA9IG9wdHMuc2l6ZSA/PyAxODtcbiAgY29uc3QgY2xzID0gb3B0cy5jbGFzc05hbWUgPz8gJyc7XG4gIGNvbnN0IHN0cm9rZSA9ICdzdHJva2U9XCJfX0dSQURfX1wiIHN0cm9rZS13aWR0aD1cIjEuN1wiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiJztcbiAgY29uc3QgZmlsbCA9ICdmaWxsPVwiX19HUkFEX19cIic7XG5cbiAgc3dpdGNoIChuYW1lKSB7XG4gICAgY2FzZSAnaG9tZSc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0zIDEwLjVMMTIgM2w5IDcuNVwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk01LjUgOS41VjIxaDEzVjkuNVwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk05LjUgMjF2LTZoNXY2XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ3dhcmVob3VzZSc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0zIDlsOS01IDkgNXY5LjVjMCAxLTEgMi0yIDJINWMtMSAwLTItMS0yLTJWOXpcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNNyAxMmgxME03IDE2aDEwXCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ3BsdW5kZXInOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNNCAyMGw3LTdNMTMgMTNsNyA3TTkgNWw2IDZNMTUgNWwtNiA2XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ2V4Y2hhbmdlJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTYgOGgxMWwtMy0zTTE4IDE2SDdsMyAzXCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ3JhbmtpbmcnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNOCAxNHY2TTEyIDEwdjEwTTE2IDZ2MTRcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNMTYgNC41YTIgMiAwIDEwMC00IDIgMiAwIDAwMCA0elwiICR7ZmlsbH0vPmAgLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ29yZSc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0xMiAzbDYgNC0yIDgtNCA2LTQtNi0yLTggNi00elwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk0xMiAzbC0yIDggMiAxMCAyLTEwLTItOHpcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnY29pbic6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCI4LjVcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNOC41IDEyaDdNMTAgOWg0TTEwIDE1aDRcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAncGljayc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk00IDVjNC0zIDktMiAxMiAxTTkgMTBsLTUgNU05IDEwbDIgMk03IDEybDIgMlwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk0xMSAxMmw3IDdcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAncmVmcmVzaCc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0yMCAxMmE4IDggMCAxMC0yLjMgNS43XCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTIwIDEydjZoLTZcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAncGxheSc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk04IDZ2MTJsMTAtNi0xMC02elwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdzdG9wJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cmVjdCB4PVwiN1wiIHk9XCI3XCIgd2lkdGg9XCIxMFwiIGhlaWdodD1cIjEwXCIgcng9XCIyXCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ2NvbGxlY3QnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNMTIgNXYxMFwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk04IDExbDQgNCA0LTRcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNNSAxOWgxNFwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICd3cmVuY2gnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNMTUuNSA2YTQuNSA0LjUgMCAxMS02LjkgNS40TDMgMTdsNC42LTUuNkE0LjUgNC41IDAgMTExNS41IDZ6XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ3NoaWVsZCc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0xMiAzbDggM3Y2YTEwIDEwIDAgMDEtOCA5IDEwIDEwIDAgMDEtOC05VjZsOC0zelwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdsaXN0JzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTcgNmgxMk03IDEyaDEyTTcgMThoMTJcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNNCA2aC4wMU00IDEyaC4wMU00IDE4aC4wMVwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICd1c2VyJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTEyIDEyYTQgNCAwIDEwMC04IDQgNCAwIDAwMCA4elwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk00IDIwYTggOCAwIDAxMTYgMFwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdsb2NrJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cmVjdCB4PVwiNVwiIHk9XCIxMFwiIHdpZHRoPVwiMTRcIiBoZWlnaHQ9XCIxMFwiIHJ4PVwiMlwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk04IDEwVjdhNCA0IDAgMTE4IDB2M1wiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdleWUnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNMiAxMnM0LTcgMTAtNyAxMCA3IDEwIDctNCA3LTEwIDctMTAtNy0xMC03elwiICR7c3Ryb2tlfS8+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIzXCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ2V5ZS1vZmYnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNMiAxMnM0LTcgMTAtNyAxMCA3IDEwIDctNCA3LTEwIDctMTAtNy0xMC03elwiICR7c3Ryb2tlfS8+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIzXCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTMgM2wxOCAxOFwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdzd29yZCc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0zIDIxbDYtNk05IDE1bDktOSAzIDMtOSA5TTE0IDZsNCA0XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ3Ryb3BoeSc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk04IDIxaDhNOSAxN2g2TTcgNGgxMHY1YTUgNSAwIDExLTEwIDBWNHpcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNNCA2aDN2MmEzIDMgMCAxMS0zLTJ6TTIwIDZoLTN2MmEzIDMgMCAwMDMtMnpcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnY2xvY2snOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiOC41XCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTEyIDd2Nmw0IDJcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnYm9sdCc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0xMyAyTDYgMTRoNWwtMSA4IDctMTJoLTVsMS04elwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICd0cmFzaCc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk00IDdoMTZNOSA3VjVoNnYyTTcgN2wxIDEzaDhsMS0xM1wiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdjbG9zZSc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk02IDZsMTIgMTJNNiAxOEwxOCA2XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ2Fycm93LXJpZ2h0JzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTQgMTJoMTRNMTIgNWw3IDctNyA3XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ3RhcmdldCc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCI4LjVcIiAke3N0cm9rZX0vPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiNC41XCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTEyIDJ2M00xMiAxOXYzTTIgMTJoM00xOSAxMmgzXCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ2JveCc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0xMiAzbDkgNS05IDUtOS01IDktNXpcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNMyA4djhsOSA1IDktNVY4XCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTEyIDEzdjhcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnaW5mbyc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCI4LjVcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNMTIgMTB2NlwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk0xMiA3aC4wMVwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiOVwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgfVxufVxuIiwgImltcG9ydCB7IHJlbmRlckljb24gfSBmcm9tICcuL0ljb24nO1xuXG5sZXQgX2JveDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcblxuZnVuY3Rpb24gZW5zdXJlQm94KCk6IEhUTUxFbGVtZW50IHtcbiAgaWYgKF9ib3gpIHJldHVybiBfYm94O1xuICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgZGl2LmNsYXNzTmFtZSA9ICd0b2FzdC13cmFwJztcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkaXYpO1xuICBfYm94ID0gZGl2O1xuICByZXR1cm4gZGl2O1xufVxuXG50eXBlIFRvYXN0VHlwZSA9ICdpbmZvJyB8ICdzdWNjZXNzJyB8ICd3YXJuJyB8ICdlcnJvcic7XG50eXBlIFRvYXN0T3B0aW9ucyA9IHsgdHlwZT86IFRvYXN0VHlwZTsgZHVyYXRpb24/OiBudW1iZXIgfTtcblxuZXhwb3J0IGZ1bmN0aW9uIHNob3dUb2FzdCh0ZXh0OiBzdHJpbmcsIG9wdHM/OiBUb2FzdFR5cGUgfCBUb2FzdE9wdGlvbnMpIHtcbiAgY29uc3QgYm94ID0gZW5zdXJlQm94KCk7XG4gIGNvbnN0IGl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgbGV0IHR5cGU6IFRvYXN0VHlwZSB8IHVuZGVmaW5lZDtcbiAgbGV0IGR1cmF0aW9uID0gMzUwMDtcbiAgaWYgKHR5cGVvZiBvcHRzID09PSAnc3RyaW5nJykgdHlwZSA9IG9wdHM7XG4gIGVsc2UgaWYgKG9wdHMpIHsgdHlwZSA9IG9wdHMudHlwZTsgaWYgKG9wdHMuZHVyYXRpb24pIGR1cmF0aW9uID0gb3B0cy5kdXJhdGlvbjsgfVxuICBpdGVtLmNsYXNzTmFtZSA9ICd0b2FzdCcgKyAodHlwZSA/ICcgJyArIHR5cGUgOiAnJyk7XG4gIC8vIGljb24gKyB0ZXh0IGNvbnRhaW5lclxuICB0cnkge1xuICAgIGNvbnN0IHdyYXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB3cmFwLnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XG4gICAgd3JhcC5zdHlsZS5nYXAgPSAnOHB4JztcbiAgICB3cmFwLnN0eWxlLmFsaWduSXRlbXMgPSAnY2VudGVyJztcbiAgICBjb25zdCBpY29OYW1lID0gdHlwZSA9PT0gJ3N1Y2Nlc3MnID8gJ2JvbHQnIDogdHlwZSA9PT0gJ3dhcm4nID8gJ2Nsb2NrJyA6IHR5cGUgPT09ICdlcnJvcicgPyAnY2xvc2UnIDogJ2luZm8nO1xuICAgIGNvbnN0IGljb0hvc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgaWNvSG9zdC5hcHBlbmRDaGlsZChyZW5kZXJJY29uKGljb05hbWUsIHsgc2l6ZTogMTggfSkpO1xuICAgIGNvbnN0IHR4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHR4dC50ZXh0Q29udGVudCA9IHRleHQ7XG4gICAgd3JhcC5hcHBlbmRDaGlsZChpY29Ib3N0KTtcbiAgICB3cmFwLmFwcGVuZENoaWxkKHR4dCk7XG4gICAgaXRlbS5hcHBlbmRDaGlsZCh3cmFwKTtcbiAgfSBjYXRjaCB7XG4gICAgaXRlbS50ZXh0Q29udGVudCA9IHRleHQ7XG4gIH1cbiAgY29uc3QgbGlmZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2knKTtcbiAgbGlmZS5jbGFzc05hbWUgPSAnbGlmZSc7XG4gIGxpZmUuc3R5bGUuc2V0UHJvcGVydHkoJy0tbGlmZScsIGR1cmF0aW9uICsgJ21zJyk7XG4gIGl0ZW0uYXBwZW5kQ2hpbGQobGlmZSk7XG4gIGJveC5wcmVwZW5kKGl0ZW0pO1xuICAvLyBncmFjZWZ1bCBleGl0XG4gIGNvbnN0IGZhZGUgPSAoKSA9PiB7IGl0ZW0uc3R5bGUub3BhY2l0eSA9ICcwJzsgaXRlbS5zdHlsZS50cmFuc2l0aW9uID0gJ29wYWNpdHkgLjQ1cyc7IHNldFRpbWVvdXQoKCkgPT4gaXRlbS5yZW1vdmUoKSwgNDYwKTsgfTtcbiAgY29uc3QgdGltZXIgPSB3aW5kb3cuc2V0VGltZW91dChmYWRlLCBkdXJhdGlvbik7XG4gIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7IGNsZWFyVGltZW91dCh0aW1lcik7IGZhZGUoKTsgfSk7XG59XG4iLCAiaW1wb3J0IHsgR2FtZU1hbmFnZXIgfSBmcm9tICcuLi9jb3JlL0dhbWVNYW5hZ2VyJztcbmltcG9ydCB7IGh0bWwsIHFzIH0gZnJvbSAnLi4vdXRpbHMvZG9tJztcbmltcG9ydCB7IHNob3dUb2FzdCB9IGZyb20gJy4uL2NvbXBvbmVudHMvVG9hc3QnO1xuaW1wb3J0IHsgcmVuZGVySWNvbiB9IGZyb20gJy4uL2NvbXBvbmVudHMvSWNvbic7XG5cbmV4cG9ydCBjbGFzcyBMb2dpblNjZW5lIHtcbiAgbW91bnQocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICBjb25zdCB2aWV3ID0gaHRtbChgXG4gICAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCIgc3R5bGU9XCJjb2xvcjojZmZmO1wiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZCBmYWRlLWluXCIgc3R5bGU9XCJtYXgtd2lkdGg6NDYwcHg7bWFyZ2luOjQ2cHggYXV0bztcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NlbmUtaGVhZGVyXCI+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8aDEgc3R5bGU9XCJiYWNrZ3JvdW5kOnZhcigtLWdyYWQpOy13ZWJraXQtYmFja2dyb3VuZC1jbGlwOnRleHQ7YmFja2dyb3VuZC1jbGlwOnRleHQ7Y29sb3I6dHJhbnNwYXJlbnQ7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6OHB4O1wiPjxzcGFuIGRhdGEtaWNvPVwiaG9tZVwiPjwvc3Bhbj5cdTc3RkZcdTU3M0FcdTYzMDdcdTYzMjVcdTRFMkRcdTVGQzM8L2gxPlxuICAgICAgICAgICAgICA8cD5cdTc2N0JcdTVGNTVcdTU0MEVcdThGREJcdTUxNjVcdTRGNjBcdTc2ODRcdThENUJcdTUzNUFcdTc3RkZcdTU3Q0VcdTMwMDI8L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8aW5wdXQgaWQ9XCJ1XCIgY2xhc3M9XCJpbnB1dFwiIHBsYWNlaG9sZGVyPVwiXHU3NTI4XHU2MjM3XHU1NDBEXCIgYXV0b2NvbXBsZXRlPVwidXNlcm5hbWVcIi8+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiIHN0eWxlPVwiYWxpZ24taXRlbXM6Y2VudGVyO1wiPlxuICAgICAgICAgICAgPGlucHV0IGlkPVwicFwiIGNsYXNzPVwiaW5wdXRcIiBwbGFjZWhvbGRlcj1cIlx1NUJDNlx1NzgwMVwiIHR5cGU9XCJwYXNzd29yZFwiIGF1dG9jb21wbGV0ZT1cImN1cnJlbnQtcGFzc3dvcmRcIi8+XG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwicmV2ZWFsXCIgY2xhc3M9XCJidG4gYnRuLWdob3N0XCIgc3R5bGU9XCJtaW4td2lkdGg6MTEwcHg7XCI+PHNwYW4gZGF0YS1pY289XCJleWVcIj48L3NwYW4+XHU2NjNFXHU3OTNBPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGJ1dHRvbiBpZD1cImdvXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIiBzdHlsZT1cIndpZHRoOjEwMCU7bWFyZ2luLXRvcDo4cHg7XCI+PHNwYW4gZGF0YS1pY289XCJhcnJvdy1yaWdodFwiPjwvc3Bhbj5cdThGREJcdTUxNjVcdTZFMzhcdTYyMEY8L2J1dHRvbj5cbiAgICAgICAgICA8ZGl2IHN0eWxlPVwibWFyZ2luLXRvcDo4cHg7b3BhY2l0eTouNzU7Zm9udC1zaXplOjEycHg7XCI+XHU2M0QwXHU3OTNBXHVGRjFBXHU4MkU1XHU4RDI2XHU2MjM3XHU0RTBEXHU1QjU4XHU1NzI4XHVGRjBDXHU1QzA2XHU4MUVBXHU1MkE4XHU1MjFCXHU1RUZBXHU1RTc2XHU3NjdCXHU1RjU1XHUzMDAyPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgYCk7XG4gICAgcm9vdC5pbm5lckhUTUwgPSAnJztcbiAgICByb290LmFwcGVuZENoaWxkKHZpZXcpO1xuXG4gICAgY29uc3QgdUVsID0gcXM8SFRNTElucHV0RWxlbWVudD4odmlldywgJyN1Jyk7XG4gICAgY29uc3QgcEVsID0gcXM8SFRNTElucHV0RWxlbWVudD4odmlldywgJyNwJyk7XG4gICAgY29uc3QgZ28gPSBxczxIVE1MQnV0dG9uRWxlbWVudD4odmlldywgJyNnbycpO1xuICAgIGNvbnN0IHJldmVhbCA9IHFzPEhUTUxCdXR0b25FbGVtZW50Pih2aWV3LCAnI3JldmVhbCcpO1xuXG4gICAgY29uc3Qgc3VibWl0ID0gYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgdXNlcm5hbWUgPSAodUVsLnZhbHVlIHx8ICcnKS50cmltKCk7XG4gICAgICBjb25zdCBwYXNzd29yZCA9IChwRWwudmFsdWUgfHwgJycpLnRyaW0oKTtcbiAgICAgIGlmICghdXNlcm5hbWUgfHwgIXBhc3N3b3JkKSB7XG4gICAgICAgIHNob3dUb2FzdCgnXHU4QkY3XHU1ODZCXHU1MTk5XHU3NTI4XHU2MjM3XHU1NDBEXHU1NDhDXHU1QkM2XHU3ODAxJywgJ3dhcm4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgZ28uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgZ28udGV4dENvbnRlbnQgPSAnXHU3NjdCXHU1RjU1XHU0RTJEXHUyMDI2JztcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IEdhbWVNYW5hZ2VyLkkubG9naW5PclJlZ2lzdGVyKHVzZXJuYW1lLCBwYXNzd29yZCk7XG4gICAgICAgIGxvY2F0aW9uLmhhc2ggPSAnIy9tYWluJztcbiAgICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgICBzaG93VG9hc3QoZT8ubWVzc2FnZSB8fCAnXHU3NjdCXHU1RjU1XHU1OTMxXHU4RDI1XHVGRjBDXHU4QkY3XHU5MUNEXHU4QkQ1JywgJ2Vycm9yJyk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBnby5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICBnby50ZXh0Q29udGVudCA9ICdcdThGREJcdTUxNjVcdTZFMzhcdTYyMEYnO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBnby5vbmNsaWNrID0gc3VibWl0O1xuICAgIHVFbC5vbmtleXVwID0gKGUpID0+IHsgaWYgKChlIGFzIEtleWJvYXJkRXZlbnQpLmtleSA9PT0gJ0VudGVyJykgc3VibWl0KCk7IH07XG4gICAgcEVsLm9ua2V5dXAgPSAoZSkgPT4geyBpZiAoKGUgYXMgS2V5Ym9hcmRFdmVudCkua2V5ID09PSAnRW50ZXInKSBzdWJtaXQoKTsgfTtcbiAgICByZXZlYWwub25jbGljayA9ICgpID0+IHtcbiAgICAgIGNvbnN0IGlzUHdkID0gcEVsLnR5cGUgPT09ICdwYXNzd29yZCc7XG4gICAgICBwRWwudHlwZSA9IGlzUHdkID8gJ3RleHQnIDogJ3Bhc3N3b3JkJztcbiAgICAgIHJldmVhbC5pbm5lckhUTUwgPSAnJztcbiAgICAgIHJldmVhbC5hcHBlbmRDaGlsZChyZW5kZXJJY29uKGlzUHdkID8gJ2V5ZS1vZmYnIDogJ2V5ZScsIHsgc2l6ZTogMjAgfSkpO1xuICAgICAgcmV2ZWFsLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGlzUHdkID8gJ1x1OTY5MFx1ODVDRicgOiAnXHU2NjNFXHU3OTNBJykpO1xuICAgIH07XG4gIH1cbn1cbiAgICAvLyBtb3VudCBpY29uc1xuICAgIHRyeSB7XG4gICAgICB2aWV3LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWljb10nKVxuICAgICAgICAuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgICBjb25zdCBuYW1lID0gKGVsIGFzIEhUTUxFbGVtZW50KS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWNvJykgYXMgYW55O1xuICAgICAgICAgIHRyeSB7IGVsLmFwcGVuZENoaWxkKHJlbmRlckljb24obmFtZSwgeyBzaXplOiAyMiB9KSk7IH0gY2F0Y2gge31cbiAgICAgICAgfSk7XG4gICAgfSBjYXRjaCB7fVxuIiwgImV4cG9ydCBjb25zdCBBUElfQkFTRSA9ICh3aW5kb3cgYXMgYW55KS5fX0FQSV9CQVNFX18gfHwgJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGknO1xyXG5leHBvcnQgY29uc3QgV1NfRU5EUE9JTlQgPSAod2luZG93IGFzIGFueSkuX19XU19FTkRQT0lOVF9fIHx8ICdodHRwOi8vbG9jYWxob3N0OjMwMDAvZ2FtZSc7XHJcblxyXG5cclxuIiwgImltcG9ydCB7IFdTX0VORFBPSU5UIH0gZnJvbSAnLi9FbnYnO1xuXG50eXBlIEhhbmRsZXIgPSAoZGF0YTogYW55KSA9PiB2b2lkO1xuXG5leHBvcnQgY2xhc3MgUmVhbHRpbWVDbGllbnQge1xuICBwcml2YXRlIHN0YXRpYyBfaW5zdGFuY2U6IFJlYWx0aW1lQ2xpZW50O1xuICBzdGF0aWMgZ2V0IEkoKTogUmVhbHRpbWVDbGllbnQge1xuICAgIHJldHVybiB0aGlzLl9pbnN0YW5jZSA/PyAodGhpcy5faW5zdGFuY2UgPSBuZXcgUmVhbHRpbWVDbGllbnQoKSk7XG4gIH1cblxuICBwcml2YXRlIHNvY2tldDogYW55IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgaGFuZGxlcnM6IFJlY29yZDxzdHJpbmcsIEhhbmRsZXJbXT4gPSB7fTtcblxuICBjb25uZWN0KHRva2VuOiBzdHJpbmcpIHtcbiAgICBjb25zdCB3ID0gd2luZG93IGFzIGFueTtcbiAgICBpZiAody5pbykge1xuICAgICAgaWYgKHRoaXMuc29ja2V0ICYmICh0aGlzLnNvY2tldC5jb25uZWN0ZWQgfHwgdGhpcy5zb2NrZXQuY29ubmVjdGluZykpIHJldHVybjtcbiAgICAgIHRoaXMuc29ja2V0ID0gdy5pbyhXU19FTkRQT0lOVCwgeyBhdXRoOiB7IHRva2VuIH0gfSk7XG4gICAgICB0aGlzLnNvY2tldC5vbignY29ubmVjdCcsICgpID0+IHt9KTtcbiAgICAgIHRoaXMuc29ja2V0Lm9uQW55KChldmVudDogc3RyaW5nLCBwYXlsb2FkOiBhbnkpID0+IHRoaXMuZW1pdExvY2FsKGV2ZW50LCBwYXlsb2FkKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHNvY2tldC5pbyBjbGllbnQgbm90IGxvYWRlZDsgZGlzYWJsZSByZWFsdGltZSB1cGRhdGVzXG4gICAgICB0aGlzLnNvY2tldCA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgb24oZXZlbnQ6IHN0cmluZywgaGFuZGxlcjogSGFuZGxlcikge1xuICAgICh0aGlzLmhhbmRsZXJzW2V2ZW50XSB8fD0gW10pLnB1c2goaGFuZGxlcik7XG4gIH1cblxuICBvZmYoZXZlbnQ6IHN0cmluZywgaGFuZGxlcjogSGFuZGxlcikge1xuICAgIGNvbnN0IGFyciA9IHRoaXMuaGFuZGxlcnNbZXZlbnRdO1xuICAgIGlmICghYXJyKSByZXR1cm47XG4gICAgY29uc3QgaWR4ID0gYXJyLmluZGV4T2YoaGFuZGxlcik7XG4gICAgaWYgKGlkeCA+PSAwKSBhcnIuc3BsaWNlKGlkeCwgMSk7XG4gIH1cblxuICBwcml2YXRlIGVtaXRMb2NhbChldmVudDogc3RyaW5nLCBwYXlsb2FkOiBhbnkpIHtcbiAgICAodGhpcy5oYW5kbGVyc1tldmVudF0gfHwgW10pLmZvckVhY2goKGgpID0+IGgocGF5bG9hZCkpO1xuICB9XG59XG4iLCAiaW1wb3J0IHsgcmVuZGVySWNvbiB9IGZyb20gJy4vSWNvbic7XG5cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJOYXYoYWN0aXZlOiBzdHJpbmcpOiBIVE1MRWxlbWVudCB7XG4gIGNvbnN0IHRhYnM6IHsga2V5OiBzdHJpbmc7IHRleHQ6IHN0cmluZzsgaHJlZjogc3RyaW5nOyBpY29uOiBhbnkgfVtdID0gW1xuICAgIHsga2V5OiAnbWFpbicsIHRleHQ6ICdcdTRFM0JcdTk4NzUnLCBocmVmOiAnIy9tYWluJywgaWNvbjogJ2hvbWUnIH0sXG4gICAgeyBrZXk6ICd3YXJlaG91c2UnLCB0ZXh0OiAnXHU0RUQzXHU1RTkzJywgaHJlZjogJyMvd2FyZWhvdXNlJywgaWNvbjogJ3dhcmVob3VzZScgfSxcbiAgICB7IGtleTogJ3BsdW5kZXInLCB0ZXh0OiAnXHU2M0EwXHU1OTNBJywgaHJlZjogJyMvcGx1bmRlcicsIGljb246ICdwbHVuZGVyJyB9LFxuICAgIHsga2V5OiAnZXhjaGFuZ2UnLCB0ZXh0OiAnXHU0RUE0XHU2NjEzXHU2MjQwJywgaHJlZjogJyMvZXhjaGFuZ2UnLCBpY29uOiAnZXhjaGFuZ2UnIH0sXG4gICAgeyBrZXk6ICdyYW5raW5nJywgdGV4dDogJ1x1NjM5Mlx1ODg0QycsIGhyZWY6ICcjL3JhbmtpbmcnLCBpY29uOiAncmFua2luZycgfSxcbiAgXTtcbiAgY29uc3Qgd3JhcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICB3cmFwLmNsYXNzTmFtZSA9ICduYXYnO1xuICBmb3IgKGNvbnN0IHQgb2YgdGFicykge1xuICAgIGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgYS5ocmVmID0gdC5ocmVmO1xuICAgIGNvbnN0IGljbyA9IHJlbmRlckljb24odC5pY29uLCB7IHNpemU6IDE4LCBjbGFzc05hbWU6ICdpY28nIH0pO1xuICAgIGNvbnN0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGxhYmVsLnRleHRDb250ZW50ID0gdC50ZXh0O1xuICAgIGEuYXBwZW5kQ2hpbGQoaWNvKTtcbiAgICBhLmFwcGVuZENoaWxkKGxhYmVsKTtcbiAgICBpZiAodC5rZXkgPT09IGFjdGl2ZSkgYS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICB3cmFwLmFwcGVuZENoaWxkKGEpO1xuICB9XG4gIHJldHVybiB3cmFwO1xufVxuIiwgImltcG9ydCB7IE5ldHdvcmtNYW5hZ2VyIH0gZnJvbSAnLi4vY29yZS9OZXR3b3JrTWFuYWdlcic7XG5pbXBvcnQgeyByZW5kZXJJY29uIH0gZnJvbSAnLi9JY29uJztcblxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlclJlc291cmNlQmFyKCkge1xuICBjb25zdCBib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgYm94LmNsYXNzTmFtZSA9ICdjb250YWluZXInO1xuICBjb25zdCBjYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNhcmQuY2xhc3NOYW1lID0gJ2NhcmQgZmFkZS1pbic7XG4gIGNhcmQuaW5uZXJIVE1MID0gYFxuICAgIDxkaXYgc3R5bGU9XCJkaXNwbGF5OmZsZXg7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW5cIj48c3Bhbj5cdUQ4M0RcdURDOEUgXHU3N0ZGXHU3N0YzPC9zcGFuPjxzdHJvbmcgaWQ9XCJvcmVcIj4wPC9zdHJvbmc+PC9kaXY+XG4gICAgPGRpdiBzdHlsZT1cImRpc3BsYXk6ZmxleDtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlblwiPjxzcGFuPlx1RDgzRVx1REU5OSBCQlx1NUUwMTwvc3Bhbj48c3Ryb25nIGlkPVwiY29pblwiPjA8L3N0cm9uZz48L2Rpdj5cbiAgYDtcbiAgLy8gb3ZlcnJpZGUgd2l0aCBlbmhhbmNlZCBzdGF0cyBsYXlvdXRcbiAgY2FyZC5pbm5lckhUTUwgPSBgXG4gICAgPGRpdiBjbGFzcz1cInN0YXRzXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwic3RhdFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiaWNvXCIgZGF0YS1pY289XCJvcmVcIj48L2Rpdj5cbiAgICAgICAgPGRpdiBzdHlsZT1cImRpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjJweDtcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwidmFsXCIgaWQ9XCJvcmVcIj4wPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImxhYmVsXCI+XHU3N0ZGXHU3N0YzPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwic3RhdFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiaWNvXCIgZGF0YS1pY289XCJjb2luXCI+PC9kaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9XCJkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDoycHg7XCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInZhbFwiIGlkPVwiY29pblwiPjA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibGFiZWxcIj5CQjwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICBgO1xuICBib3guYXBwZW5kQ2hpbGQoY2FyZCk7XG4gIC8vIGluamVjdCBpY29uc1xuICB0cnkge1xuICAgIGNvbnN0IG9yZUljbyA9IGNhcmQucXVlcnlTZWxlY3RvcignW2RhdGEtaWNvPVwib3JlXCJdJyk7XG4gICAgY29uc3QgY29pbkljbyA9IGNhcmQucXVlcnlTZWxlY3RvcignW2RhdGEtaWNvPVwiY29pblwiXScpO1xuICAgIGlmIChvcmVJY28pIG9yZUljby5hcHBlbmRDaGlsZChyZW5kZXJJY29uKCdvcmUnLCB7IHNpemU6IDE4IH0pKTtcbiAgICBpZiAoY29pbkljbykgY29pbkljby5hcHBlbmRDaGlsZChyZW5kZXJJY29uKCdjb2luJywgeyBzaXplOiAxOCB9KSk7XG4gIH0gY2F0Y2gge31cbiAgY29uc3Qgb3JlRWwgPSBjYXJkLnF1ZXJ5U2VsZWN0b3IoJyNvcmUnKSBhcyBIVE1MRWxlbWVudDtcbiAgY29uc3QgY29pbkVsID0gY2FyZC5xdWVyeVNlbGVjdG9yKCcjY29pbicpIGFzIEhUTUxFbGVtZW50O1xuICBhc3luYyBmdW5jdGlvbiB1cGRhdGUoKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHAgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyBpZDogc3RyaW5nOyB1c2VybmFtZTogc3RyaW5nOyBuaWNrbmFtZTogc3RyaW5nOyBvcmVBbW91bnQ6IG51bWJlcjsgYmJDb2luczogbnVtYmVyIH0+KCcvdXNlci9wcm9maWxlJyk7XG4gICAgICBvcmVFbC50ZXh0Q29udGVudCA9IFN0cmluZyhwLm9yZUFtb3VudCk7XG4gICAgICBjb2luRWwudGV4dENvbnRlbnQgPSBTdHJpbmcocC5iYkNvaW5zKTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIC8vIGlnbm9yZSBmZXRjaCBlcnJvcnM7IFVJIFx1NEYxQVx1NTcyOFx1NEUwQlx1NEUwMFx1NkIyMVx1NTIzN1x1NjVCMFx1NjVGNlx1NjA2Mlx1NTkwRFxuICAgIH1cbiAgfVxuICByZXR1cm4geyByb290OiBib3gsIHVwZGF0ZSB9O1xufVxuIiwgImV4cG9ydCBmdW5jdGlvbiBzcGF3bkZsb2F0VGV4dChhbmNob3I6IEVsZW1lbnQsIHRleHQ6IHN0cmluZywgY29sb3IgPSAnI2ZmZicpIHtcbiAgY29uc3QgcmVjdCA9IGFuY2hvci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgY29uc3Qgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBzcGFuLnRleHRDb250ZW50ID0gdGV4dDtcbiAgc3Bhbi5zdHlsZS5jc3NUZXh0ID0gYHBvc2l0aW9uOmZpeGVkO2xlZnQ6JHtyZWN0LmxlZnQgKyByZWN0LndpZHRoIC0gMjR9cHg7dG9wOiR7cmVjdC50b3AgLSA2fXB4O2ArXG4gICAgJ3RyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTsgdHJhbnNpdGlvbjogYWxsIC43cyBjdWJpYy1iZXppZXIoLjIyLC42MSwuMzYsMSk7JytcbiAgICAncG9pbnRlci1ldmVudHM6bm9uZTsgei1pbmRleDo5OTk5OyBmb250LXdlaWdodDo3MDA7IGNvbG9yOicrY29sb3IrJzsgdGV4dC1zaGFkb3c6MCAwIDhweCByZ2JhKDI1NSwyNTUsMjU1LC4yNSknO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNwYW4pO1xuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgIHNwYW4uc3R5bGUub3BhY2l0eSA9ICcwJztcbiAgICBzcGFuLnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGVZKC0yNHB4KSc7XG4gIH0pO1xuICBzZXRUaW1lb3V0KCgpID0+IHNwYW4ucmVtb3ZlKCksIDgwMCk7XG59XG5cbiIsICJpbXBvcnQgeyBOZXR3b3JrTWFuYWdlciB9IGZyb20gJy4uL2NvcmUvTmV0d29ya01hbmFnZXInO1xuaW1wb3J0IHsgUmVhbHRpbWVDbGllbnQgfSBmcm9tICcuLi9jb3JlL1JlYWx0aW1lQ2xpZW50JztcbmltcG9ydCB7IGh0bWwsIHFzIH0gZnJvbSAnLi4vdXRpbHMvZG9tJztcbmltcG9ydCB7IHJlbmRlck5hdiB9IGZyb20gJy4uL2NvbXBvbmVudHMvTmF2JztcbmltcG9ydCB7IHJlbmRlclJlc291cmNlQmFyIH0gZnJvbSAnLi4vY29tcG9uZW50cy9SZXNvdXJjZUJhcic7XG5pbXBvcnQgeyBzaG93VG9hc3QgfSBmcm9tICcuLi9jb21wb25lbnRzL1RvYXN0JztcbmltcG9ydCB7IHNwYXduRmxvYXRUZXh0IH0gZnJvbSAnLi4vY29tcG9uZW50cy9GbG9hdFRleHQnO1xuaW1wb3J0IHsgcmVuZGVySWNvbiB9IGZyb20gJy4uL2NvbXBvbmVudHMvSWNvbic7XG5cbnR5cGUgTWluZVN0YXR1cyA9IHtcbiAgY2FydEFtb3VudDogbnVtYmVyO1xuICBjYXJ0Q2FwYWNpdHk6IG51bWJlcjtcbiAgY29sbGFwc2VkOiBib29sZWFuO1xuICBjb2xsYXBzZWRSZW1haW5pbmc6IG51bWJlcjtcbiAgcnVubmluZzogYm9vbGVhbjtcbiAgaW50ZXJ2YWxNczogbnVtYmVyO1xufTtcblxudHlwZSBQZW5kaW5nQWN0aW9uID0gJ3N0YXJ0JyB8ICdzdG9wJyB8ICdjb2xsZWN0JyB8ICdyZXBhaXInIHwgJ3N0YXR1cycgfCBudWxsO1xuXG5leHBvcnQgY2xhc3MgTWFpblNjZW5lIHtcbiAgcHJpdmF0ZSB2aWV3OiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGNhcnRBbXQgPSAwO1xuICBwcml2YXRlIGNhcnRDYXAgPSAxMDAwO1xuICBwcml2YXRlIGlzTWluaW5nID0gZmFsc2U7XG4gIHByaXZhdGUgaXNDb2xsYXBzZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBjb2xsYXBzZVJlbWFpbmluZyA9IDA7XG4gIHByaXZhdGUgY29sbGFwc2VUaW1lcjogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgaW50ZXJ2YWxNcyA9IDMwMDA7XG4gIHByaXZhdGUgcGVuZGluZzogUGVuZGluZ0FjdGlvbiA9IG51bGw7XG5cbiAgcHJpdmF0ZSBlbHMgPSB7XG4gICAgZmlsbDogbnVsbCBhcyBIVE1MRWxlbWVudCB8IG51bGwsXG4gICAgcGVyY2VudDogbnVsbCBhcyBIVE1MRWxlbWVudCB8IG51bGwsXG4gICAgc3RhdHVzVGV4dDogbnVsbCBhcyBIVE1MRWxlbWVudCB8IG51bGwsXG4gICAgcmluZzogbnVsbCBhcyBIVE1MRWxlbWVudCB8IG51bGwsXG4gICAgcmluZ1BjdDogbnVsbCBhcyBIVE1MRWxlbWVudCB8IG51bGwsXG4gICAgY3ljbGU6IG51bGwgYXMgSFRNTEVsZW1lbnQgfCBudWxsLFxuICAgIHN0YXR1c1RhZzogbnVsbCBhcyBIVE1MRWxlbWVudCB8IG51bGwsXG4gICAgZXZlbnRzOiBudWxsIGFzIEhUTUxFbGVtZW50IHwgbnVsbCxcbiAgICBzdGFydDogbnVsbCBhcyBIVE1MQnV0dG9uRWxlbWVudCB8IG51bGwsXG4gICAgc3RvcDogbnVsbCBhcyBIVE1MQnV0dG9uRWxlbWVudCB8IG51bGwsXG4gICAgY29sbGVjdDogbnVsbCBhcyBIVE1MQnV0dG9uRWxlbWVudCB8IG51bGwsXG4gICAgcmVwYWlyOiBudWxsIGFzIEhUTUxCdXR0b25FbGVtZW50IHwgbnVsbCxcbiAgICBzdGF0dXNCdG46IG51bGwgYXMgSFRNTEJ1dHRvbkVsZW1lbnQgfCBudWxsLFxuICB9O1xuXG4gIHByaXZhdGUgbWluZVVwZGF0ZUhhbmRsZXI/OiAobXNnOiBhbnkpID0+IHZvaWQ7XG4gIHByaXZhdGUgbWluZUNvbGxhcHNlSGFuZGxlcj86IChtc2c6IGFueSkgPT4gdm9pZDtcbiAgcHJpdmF0ZSBwbHVuZGVySGFuZGxlcj86IChtc2c6IGFueSkgPT4gdm9pZDtcblxuICBhc3luYyBtb3VudChyb290OiBIVE1MRWxlbWVudCkge1xuICAgIHRoaXMuY2xlYXJDb2xsYXBzZVRpbWVyKCk7XG4gICAgdGhpcy5wZW5kaW5nID0gbnVsbDtcblxuICAgIGNvbnN0IG5hdiA9IHJlbmRlck5hdignbWFpbicpO1xuICAgIGNvbnN0IGJhciA9IHJlbmRlclJlc291cmNlQmFyKCk7XG4gICAgY29uc3QgdmlldyA9IGh0bWwoYFxuICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiIHN0eWxlPVwiY29sb3I6I2ZmZjtcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm1pbmUgY2FyZCBmYWRlLWluXCI+XG4gICAgICAgICAgPGRpdiBzdHlsZT1cIm9wYWNpdHk6Ljk7bWFyZ2luLWJvdHRvbTo4cHg7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6OHB4O1wiPjxzcGFuIGRhdGEtaWNvPVwicGlja1wiPjwvc3Bhbj5cdTYzMTZcdTc3RkZcdTk3NjJcdTY3N0Y8L2Rpdj5cbiAgICAgICAgICA8ZGl2IHN0eWxlPVwiaGVpZ2h0OjEwcHg7Ym9yZGVyLXJhZGl1czo5OTlweDtiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjEyKTtvdmVyZmxvdzpoaWRkZW47XCI+XG4gICAgICAgICAgICA8ZGl2IGlkPVwiZmlsbFwiIHN0eWxlPVwiaGVpZ2h0OjEwMCU7d2lkdGg6MCU7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoOTBkZWcsIzdCMkNGNSwjMkM4OUY1KTtib3gtc2hhZG93OjAgMCAxMHB4ICM3QjJDRjU7dHJhbnNpdGlvbjp3aWR0aCAuM3MgZWFzZVwiPjwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgc3R5bGU9XCJkaXNwbGF5OmZsZXg7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YWxpZ24taXRlbXM6Y2VudGVyO21hcmdpbjo4cHggMCAxMnB4O1wiPlxuICAgICAgICAgICAgPHNwYW4+XHU3N0ZGXHU4RjY2XHU4OEM1XHU4RjdEPC9zcGFuPlxuICAgICAgICAgICAgPHN0cm9uZyBpZD1cInBlcmNlbnRcIj4wJTwvc3Ryb25nPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIiBzdHlsZT1cImdhcDo4cHg7XCI+XG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwic3RhcnRcIiBjbGFzcz1cImJ0biBidG4tYnV5XCIgc3R5bGU9XCJmbGV4OjE7XCI+PHNwYW4gZGF0YS1pY289XCJwbGF5XCI+PC9zcGFuPlx1NUYwMFx1NTlDQlx1NjMxNlx1NzdGRjwvYnV0dG9uPlxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInN0b3BcIiBjbGFzcz1cImJ0biBidG4tZ2hvc3RcIiBzdHlsZT1cImZsZXg6MTtcIj48c3BhbiBkYXRhLWljbz1cInN0b3BcIj48L3NwYW4+XHU1MDVDXHU2QjYyPC9idXR0b24+XG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwiY29sbGVjdFwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCIgc3R5bGU9XCJmbGV4OjE7XCI+PHNwYW4gZGF0YS1pY289XCJjb2xsZWN0XCI+PC9zcGFuPlx1NjUzNlx1NzdGRjwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIiBzdHlsZT1cImdhcDo4cHg7bWFyZ2luLXRvcDo4cHg7XCI+XG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwic3RhdHVzXCIgY2xhc3M9XCJidG4gYnRuLWdob3N0XCIgc3R5bGU9XCJmbGV4OjE7XCI+PHNwYW4gZGF0YS1pY289XCJyZWZyZXNoXCI+PC9zcGFuPlx1NTIzN1x1NjVCMFx1NzJCNlx1NjAwMTwvYnV0dG9uPlxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInJlcGFpclwiIGNsYXNzPVwiYnRuIGJ0bi1zZWxsXCIgc3R5bGU9XCJmbGV4OjE7XCI+PHNwYW4gZGF0YS1pY289XCJ3cmVuY2hcIj48L3NwYW4+XHU0RkVFXHU3NDA2PC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBpZD1cInN0YXR1c1RleHRcIiBzdHlsZT1cIm1hcmdpbi10b3A6NnB4O29wYWNpdHk6Ljk7bWluLWhlaWdodDoyMHB4O1wiPjwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIGApO1xuXG4gICAgcm9vdC5pbm5lckhUTUwgPSAnJztcbiAgICByb290LmFwcGVuZENoaWxkKG5hdik7XG4gICAgcm9vdC5hcHBlbmRDaGlsZChiYXIucm9vdCk7XG4gICAgcm9vdC5hcHBlbmRDaGlsZCh2aWV3KTtcblxuICAgIHRoaXMudmlldyA9IHZpZXc7XG4gICAgLy8gbW91bnQgaWNvbnMgaW4gaGVhZGVyL2J1dHRvbnNcbiAgICB0cnkge1xuICAgICAgdmlldy5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1pY29dJylcbiAgICAgICAgLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgICAgY29uc3QgbmFtZSA9IChlbCBhcyBIVE1MRWxlbWVudCkuZ2V0QXR0cmlidXRlKCdkYXRhLWljbycpIGFzIGFueTtcbiAgICAgICAgICB0cnkgeyBlbC5hcHBlbmRDaGlsZChyZW5kZXJJY29uKG5hbWUsIHsgc2l6ZTogMjAgfSkpOyB9IGNhdGNoIHt9XG4gICAgICAgIH0pO1xuICAgIH0gY2F0Y2gge31cbiAgICB0aGlzLnVwZ3JhZGVNaW5lQ2FyZFVJKCk7XG4gICAgdGhpcy5jYWNoZUVsZW1lbnRzKCk7XG4gICAgdGhpcy5hdHRhY2hIYW5kbGVycyhiYXIudXBkYXRlLmJpbmQoYmFyKSk7XG4gICAgYXdhaXQgYmFyLnVwZGF0ZSgpO1xuICAgIHRoaXMuc2V0dXBSZWFsdGltZSgpO1xuICAgIGF3YWl0IHRoaXMucmVmcmVzaFN0YXR1cygpO1xuICAgIHRoaXMudXBkYXRlUHJvZ3Jlc3MoKTtcbiAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzKCk7XG4gIH1cblxuICBwcml2YXRlIGNhY2hlRWxlbWVudHMoKSB7XG4gICAgaWYgKCF0aGlzLnZpZXcpIHJldHVybjtcbiAgICB0aGlzLmVscy5maWxsID0gcXModGhpcy52aWV3LCAnI2ZpbGwnKTtcbiAgICB0aGlzLmVscy5wZXJjZW50ID0gcXModGhpcy52aWV3LCAnI3BlcmNlbnQnKTtcbiAgICB0aGlzLmVscy5zdGF0dXNUZXh0ID0gcXModGhpcy52aWV3LCAnI3N0YXR1c1RleHQnKTtcbiAgICB0aGlzLmVscy5yaW5nID0gdGhpcy52aWV3LnF1ZXJ5U2VsZWN0b3IoJyNyaW5nJyk7XG4gICAgdGhpcy5lbHMucmluZ1BjdCA9IHRoaXMudmlldy5xdWVyeVNlbGVjdG9yKCcjcmluZ1BjdCcpO1xuICAgIHRoaXMuZWxzLmN5Y2xlID0gdGhpcy52aWV3LnF1ZXJ5U2VsZWN0b3IoJyNjeWNsZScpO1xuICAgIHRoaXMuZWxzLnN0YXR1c1RhZyA9IHRoaXMudmlldy5xdWVyeVNlbGVjdG9yKCcjc3RhdHVzVGFnJyk7XG4gICAgdGhpcy5lbHMuZXZlbnRzID0gdGhpcy52aWV3LnF1ZXJ5U2VsZWN0b3IoJyNldmVudHMnKTtcbiAgICB0aGlzLmVscy5zdGFydCA9IHFzPEhUTUxCdXR0b25FbGVtZW50Pih0aGlzLnZpZXcsICcjc3RhcnQnKTtcbiAgICB0aGlzLmVscy5zdG9wID0gcXM8SFRNTEJ1dHRvbkVsZW1lbnQ+KHRoaXMudmlldywgJyNzdG9wJyk7XG4gICAgdGhpcy5lbHMuY29sbGVjdCA9IHFzPEhUTUxCdXR0b25FbGVtZW50Pih0aGlzLnZpZXcsICcjY29sbGVjdCcpO1xuICAgIHRoaXMuZWxzLnJlcGFpciA9IHFzPEhUTUxCdXR0b25FbGVtZW50Pih0aGlzLnZpZXcsICcjcmVwYWlyJyk7XG4gICAgdGhpcy5lbHMuc3RhdHVzQnRuID0gcXM8SFRNTEJ1dHRvbkVsZW1lbnQ+KHRoaXMudmlldywgJyNzdGF0dXMnKTtcbiAgfVxuXG4gIC8vIEVuaGFuY2UgVUk6IGFkZCByYWRpYWwgbWV0ZXIgYW5kIGV2ZW50IGZlZWQgZHluYW1pY2FsbHlcbiAgcHJpdmF0ZSB1cGdyYWRlTWluZUNhcmRVSSgpIHtcbiAgICBpZiAoIXRoaXMudmlldykgcmV0dXJuO1xuICAgIGNvbnN0IG1pbmVDYXJkID0gdGhpcy52aWV3LnF1ZXJ5U2VsZWN0b3IoJy5taW5lJyk7XG4gICAgaWYgKCFtaW5lQ2FyZCkgcmV0dXJuO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBibG9jayA9IGh0bWwoYFxuICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCIgc3R5bGU9XCJnYXA6MTJweDthbGlnbi1pdGVtczpjZW50ZXI7bWFyZ2luLWJvdHRvbTo4cHg7XCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInJpbmdcIiBpZD1cInJpbmdcIj48ZGl2IGNsYXNzPVwibGFiZWxcIiBpZD1cInJpbmdQY3RcIj4wJTwvZGl2PjwvZGl2PlxuICAgICAgICAgIDxkaXYgc3R5bGU9XCJkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDo2cHg7XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGlsbFwiIGlkPVwic3RhdHVzVGFnXCI+XHU1Rjg1XHU2NzNBPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGlsbFwiPjxzcGFuIGRhdGEtaWNvPVwiY2xvY2tcIj48L3NwYW4+XHU1NDY4XHU2NzFGIDxzcGFuIGlkPVwiY3ljbGVcIj4zczwvc3Bhbj48L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICBgKTtcbiAgICAgIGJsb2NrLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWljb10nKVxuICAgICAgICAuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgICBjb25zdCBuYW1lID0gKGVsIGFzIEhUTUxFbGVtZW50KS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWNvJykgYXMgYW55O1xuICAgICAgICAgIHRyeSB7IGVsLmFwcGVuZENoaWxkKHJlbmRlckljb24obmFtZSwgeyBzaXplOiAxNiB9KSk7IH0gY2F0Y2gge31cbiAgICAgICAgfSk7XG4gICAgICAobWluZUNhcmQgYXMgSFRNTEVsZW1lbnQpLmluc2VydEJlZm9yZShibG9jaywgKG1pbmVDYXJkIGFzIEhUTUxFbGVtZW50KS5jaGlsZHJlblsxXSB8fCBudWxsKTtcbiAgICAgIGNvbnN0IGZlZWQgPSBodG1sKGA8ZGl2IGNsYXNzPVwiZXZlbnQtZmVlZFwiIGlkPVwiZXZlbnRzXCIgc3R5bGU9XCJtYXJnaW4tdG9wOjEwcHg7XCI+PC9kaXY+YCk7XG4gICAgICAobWluZUNhcmQgYXMgSFRNTEVsZW1lbnQpLmFwcGVuZENoaWxkKGZlZWQpO1xuICAgIH0gY2F0Y2gge31cbiAgfVxuXG4gIHByaXZhdGUgYXR0YWNoSGFuZGxlcnModXBkYXRlQmFyOiAoKSA9PiBQcm9taXNlPHZvaWQ+KSB7XG4gICAgaWYgKCF0aGlzLnZpZXcpIHJldHVybjtcbiAgICB0aGlzLmVscy5zdGFydD8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0aGlzLmhhbmRsZVN0YXJ0KCkpO1xuICAgIHRoaXMuZWxzLnN0b3A/LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdGhpcy5oYW5kbGVTdG9wKCkpO1xuICAgIHRoaXMuZWxzLnN0YXR1c0J0bj8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0aGlzLnJlZnJlc2hTdGF0dXMoKSk7XG4gICAgdGhpcy5lbHMucmVwYWlyPy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRoaXMuaGFuZGxlUmVwYWlyKCkpO1xuICAgIHRoaXMuZWxzLmNvbGxlY3Q/LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdGhpcy5oYW5kbGVDb2xsZWN0KHVwZGF0ZUJhcikpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXR1cFJlYWx0aW1lKCkge1xuICAgIGNvbnN0IHRva2VuID0gKE5ldHdvcmtNYW5hZ2VyIGFzIGFueSkuSVsndG9rZW4nXTtcbiAgICBpZiAodG9rZW4pIFJlYWx0aW1lQ2xpZW50LkkuY29ubmVjdCh0b2tlbik7XG5cbiAgICBpZiAodGhpcy5taW5lVXBkYXRlSGFuZGxlcikgUmVhbHRpbWVDbGllbnQuSS5vZmYoJ21pbmUudXBkYXRlJywgdGhpcy5taW5lVXBkYXRlSGFuZGxlcik7XG4gICAgaWYgKHRoaXMubWluZUNvbGxhcHNlSGFuZGxlcikgUmVhbHRpbWVDbGllbnQuSS5vZmYoJ21pbmUuY29sbGFwc2UnLCB0aGlzLm1pbmVDb2xsYXBzZUhhbmRsZXIpO1xuICAgIGlmICh0aGlzLnBsdW5kZXJIYW5kbGVyKSBSZWFsdGltZUNsaWVudC5JLm9mZigncGx1bmRlci5hdHRhY2tlZCcsIHRoaXMucGx1bmRlckhhbmRsZXIpO1xuXG4gICAgdGhpcy5taW5lVXBkYXRlSGFuZGxlciA9IChtc2cpID0+IHtcbiAgICAgIHRoaXMuY2FydEFtdCA9IHR5cGVvZiBtc2cuY2FydEFtb3VudCA9PT0gJ251bWJlcicgPyBtc2cuY2FydEFtb3VudCA6IHRoaXMuY2FydEFtdDtcbiAgICAgIHRoaXMuY2FydENhcCA9IHR5cGVvZiBtc2cuY2FydENhcGFjaXR5ID09PSAnbnVtYmVyJyA/IG1zZy5jYXJ0Q2FwYWNpdHkgOiB0aGlzLmNhcnRDYXA7XG4gICAgICB0aGlzLmlzTWluaW5nID0gbXNnLnJ1bm5pbmcgPz8gdGhpcy5pc01pbmluZztcbiAgICAgIGlmIChtc2cuY29sbGFwc2VkICYmIG1zZy5jb2xsYXBzZWRSZW1haW5pbmcpIHtcbiAgICAgICAgdGhpcy5iZWdpbkNvbGxhcHNlQ291bnRkb3duKG1zZy5jb2xsYXBzZWRSZW1haW5pbmcpO1xuICAgICAgfSBlbHNlIGlmICghbXNnLmNvbGxhcHNlZCkge1xuICAgICAgICB0aGlzLmlzQ29sbGFwc2VkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY2xlYXJDb2xsYXBzZVRpbWVyKCk7XG4gICAgICB9XG4gICAgICB0aGlzLnVwZGF0ZVByb2dyZXNzKCk7XG4gICAgICBpZiAobXNnLnR5cGUgPT09ICdjcml0aWNhbCcgJiYgbXNnLmFtb3VudCkge1xuICAgICAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoYFx1ODlFNlx1NTNEMVx1NjZCNFx1NTFGQlx1RkYwQ1x1NzdGRlx1OEY2Nlx1NTg5RVx1NTJBMCAke21zZy5hbW91bnR9XHVGRjAxYCk7XG4gICAgICAgIHRoaXMubG9nRXZlbnQoYFx1NjZCNFx1NTFGQiArJHttc2cuYW1vdW50fWApO1xuICAgICAgfSBlbHNlIGlmIChtc2cudHlwZSA9PT0gJ25vcm1hbCcgJiYgbXNnLmFtb3VudCkge1xuICAgICAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoYFx1NzdGRlx1OEY2Nlx1NTg5RVx1NTJBMCAke21zZy5hbW91bnR9XHVGRjBDXHU1RjUzXHU1MjREICR7dGhpcy5mb3JtYXRQZXJjZW50KCl9YCk7XG4gICAgICAgIHRoaXMubG9nRXZlbnQoYFx1NjMxNlx1NjM5OCArJHttc2cuYW1vdW50fWApO1xuICAgICAgfSBlbHNlIGlmIChtc2cudHlwZSA9PT0gJ2NvbGxhcHNlJykge1xuICAgICAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoJ1x1NzdGRlx1OTA1M1x1NTc0RFx1NTg0Q1x1RkYwQ1x1OEJGN1x1N0FDQlx1NTM3M1x1NEZFRVx1NzQwNicpO1xuICAgICAgICB0aGlzLmxvZ0V2ZW50KCdcdTc3RkZcdTkwNTNcdTU3NERcdTU4NEMnKTtcbiAgICAgIH0gZWxzZSBpZiAobXNnLnR5cGUgPT09ICdjb2xsZWN0Jykge1xuICAgICAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoJ1x1NzdGRlx1NzdGM1x1NURGMlx1NjUzNlx1OTZDNlx1RkYwQ1x1NzdGRlx1OEY2Nlx1NkUwNVx1N0E3QScpO1xuICAgICAgICB0aGlzLmxvZ0V2ZW50KCdcdTY1MzZcdTk2QzZcdTVCOENcdTYyMTAnKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0NvbGxhcHNlZCkge1xuICAgICAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoYFx1NzdGRlx1OTA1M1x1NTc0RFx1NTg0Q1x1RkYwQ1x1NTI2OVx1NEY1OSAke3RoaXMuY29sbGFwc2VSZW1haW5pbmd9c2ApO1xuICAgICAgfVxuICAgICAgdGhpcy51cGRhdGVDb250cm9scygpO1xuICAgIH07XG5cbiAgICB0aGlzLm1pbmVDb2xsYXBzZUhhbmRsZXIgPSAobXNnKSA9PiB7XG4gICAgICBjb25zdCBzZWNvbmRzID0gTnVtYmVyKG1zZz8ucmVwYWlyX2R1cmF0aW9uKSB8fCAwO1xuICAgICAgaWYgKHNlY29uZHMgPiAwKSB0aGlzLmJlZ2luQ29sbGFwc2VDb3VudGRvd24oc2Vjb25kcyk7XG4gICAgICBzaG93VG9hc3QoYFx1NzdGRlx1OTA1M1x1NTc0RFx1NTg0Q1x1RkYwQ1x1OTcwMFx1NEZFRVx1NzQwNlx1RkYwOFx1N0VBNiAke3NlY29uZHN9c1x1RkYwOWAsICd3YXJuJyk7XG4gICAgfTtcblxuICAgIHRoaXMucGx1bmRlckhhbmRsZXIgPSAobXNnKSA9PiB7XG4gICAgICBzaG93VG9hc3QoYFx1ODhBQlx1NjNBMFx1NTkzQVx1RkYxQVx1Njc2NVx1ODFFQSAke21zZy5hdHRhY2tlcn1cdUZGMENcdTYzNUZcdTU5MzEgJHttc2cubG9zc31gLCAnd2FybicpO1xuICAgICAgdGhpcy5sb2dFdmVudChgXHU4OEFCICR7bXNnLmF0dGFja2VyfSBcdTYzQTBcdTU5M0EgLSR7bXNnLmxvc3N9YCk7XG4gICAgfTtcblxuICAgIFJlYWx0aW1lQ2xpZW50Lkkub24oJ21pbmUudXBkYXRlJywgdGhpcy5taW5lVXBkYXRlSGFuZGxlcik7XG4gICAgUmVhbHRpbWVDbGllbnQuSS5vbignbWluZS5jb2xsYXBzZScsIHRoaXMubWluZUNvbGxhcHNlSGFuZGxlcik7XG4gICAgUmVhbHRpbWVDbGllbnQuSS5vbigncGx1bmRlci5hdHRhY2tlZCcsIHRoaXMucGx1bmRlckhhbmRsZXIpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBoYW5kbGVTdGFydCgpIHtcbiAgICBpZiAodGhpcy5wZW5kaW5nIHx8IHRoaXMuaXNDb2xsYXBzZWQpIHtcbiAgICAgIGlmICh0aGlzLmlzQ29sbGFwc2VkKSBzaG93VG9hc3QoJ1x1NzdGRlx1OTA1M1x1NTc0RFx1NTg0Q1x1RkYwQ1x1OEJGN1x1NTE0OFx1NEZFRVx1NzQwNicsICd3YXJuJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMucGVuZGluZyA9ICdzdGFydCc7XG4gICAgdGhpcy51cGRhdGVDb250cm9scygpO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBzdGF0dXMgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8TWluZVN0YXR1cz4oJy9taW5lL3N0YXJ0JywgeyBtZXRob2Q6ICdQT1NUJyB9KTtcbiAgICAgIHRoaXMuYXBwbHlTdGF0dXMoc3RhdHVzKTtcbiAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZSgnXHU3N0ZGXHU2NzNBXHU1REYyXHU1NDJGXHU1MkE4Jyk7XG4gICAgICBzaG93VG9hc3QoJ1x1NzdGRlx1NjczQVx1NURGMlx1NTQyRlx1NTJBOCcsICdzdWNjZXNzJyk7XG4gICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICBzaG93VG9hc3QoZT8ubWVzc2FnZSB8fCAnXHU1NDJGXHU1MkE4XHU1OTMxXHU4RDI1JywgJ2Vycm9yJyk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMucGVuZGluZyA9IG51bGw7XG4gICAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBoYW5kbGVTdG9wKCkge1xuICAgIGlmICh0aGlzLnBlbmRpbmcpIHJldHVybjtcbiAgICB0aGlzLnBlbmRpbmcgPSAnc3RvcCc7XG4gICAgdGhpcy51cGRhdGVDb250cm9scygpO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBzdGF0dXMgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8TWluZVN0YXR1cz4oJy9taW5lL3N0b3AnLCB7IG1ldGhvZDogJ1BPU1QnIH0pO1xuICAgICAgdGhpcy5hcHBseVN0YXR1cyhzdGF0dXMpO1xuICAgICAgdGhpcy5zZXRTdGF0dXNNZXNzYWdlKCdcdTc3RkZcdTY3M0FcdTVERjJcdTUwNUNcdTZCNjInKTtcbiAgICAgIHNob3dUb2FzdCgnXHU3N0ZGXHU2NzNBXHU1REYyXHU1MDVDXHU2QjYyJywgJ3N1Y2Nlc3MnKTtcbiAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgIHNob3dUb2FzdChlPy5tZXNzYWdlIHx8ICdcdTUwNUNcdTZCNjJcdTU5MzFcdThEMjUnLCAnZXJyb3InKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5wZW5kaW5nID0gbnVsbDtcbiAgICAgIHRoaXMudXBkYXRlQ29udHJvbHMoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGhhbmRsZUNvbGxlY3QodXBkYXRlQmFyOiAoKSA9PiBQcm9taXNlPHZvaWQ+KSB7XG4gICAgaWYgKHRoaXMucGVuZGluZyB8fCB0aGlzLmNhcnRBbXQgPD0gMCkgcmV0dXJuO1xuICAgIHRoaXMucGVuZGluZyA9ICdjb2xsZWN0JztcbiAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzKCk7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IGNvbGxlY3RlZDogbnVtYmVyOyBzdGF0dXM6IE1pbmVTdGF0dXMgfT4oJy9taW5lL2NvbGxlY3QnLCB7IG1ldGhvZDogJ1BPU1QnIH0pO1xuICAgICAgaWYgKHJlcy5zdGF0dXMpIHRoaXMuYXBwbHlTdGF0dXMocmVzLnN0YXR1cyk7XG4gICAgICBpZiAocmVzLmNvbGxlY3RlZCA+IDApIHtcbiAgICAgICAgY29uc3Qgb3JlTGFiZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjb3JlJyk7XG4gICAgICAgIGlmIChvcmVMYWJlbCkgc3Bhd25GbG9hdFRleHQob3JlTGFiZWwgYXMgRWxlbWVudCwgYCske3Jlcy5jb2xsZWN0ZWR9YCwgJyM3QjJDRjUnKTtcbiAgICAgICAgc2hvd1RvYXN0KGBcdTY1MzZcdTk2QzZcdTc3RkZcdTc3RjMgJHtyZXMuY29sbGVjdGVkfWAsICdzdWNjZXNzJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzaG93VG9hc3QoJ1x1NzdGRlx1OEY2Nlx1NEUzQVx1N0E3QVx1RkYwQ1x1NjVFMFx1NzdGRlx1NzdGM1x1NTNFRlx1NjUzNlx1OTZDNicsICd3YXJuJyk7XG4gICAgICB9XG4gICAgICBhd2FpdCB1cGRhdGVCYXIoKTtcbiAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgIHNob3dUb2FzdChlPy5tZXNzYWdlIHx8ICdcdTY1MzZcdTc3RkZcdTU5MzFcdThEMjUnLCAnZXJyb3InKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5wZW5kaW5nID0gbnVsbDtcbiAgICAgIHRoaXMudXBkYXRlQ29udHJvbHMoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGhhbmRsZVJlcGFpcigpIHtcbiAgICBpZiAodGhpcy5wZW5kaW5nIHx8ICF0aGlzLmlzQ29sbGFwc2VkKSByZXR1cm47XG4gICAgdGhpcy5wZW5kaW5nID0gJ3JlcGFpcic7XG4gICAgdGhpcy51cGRhdGVDb250cm9scygpO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBzdGF0dXMgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8TWluZVN0YXR1cz4oJy9taW5lL3JlcGFpcicsIHsgbWV0aG9kOiAnUE9TVCcgfSk7XG4gICAgICB0aGlzLmFwcGx5U3RhdHVzKHN0YXR1cyk7XG4gICAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoJ1x1NzdGRlx1OTA1M1x1NURGMlx1NEZFRVx1NTkwRFx1RkYwQ1x1NTNFRlx1OTFDRFx1NjVCMFx1NTQyRlx1NTJBOCcpO1xuICAgICAgc2hvd1RvYXN0KCdcdTc3RkZcdTkwNTNcdTVERjJcdTRGRUVcdTU5MEQnLCAnc3VjY2VzcycpO1xuICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgc2hvd1RvYXN0KGU/Lm1lc3NhZ2UgfHwgJ1x1NEZFRVx1NzQwNlx1NTkzMVx1OEQyNScsICdlcnJvcicpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLnBlbmRpbmcgPSBudWxsO1xuICAgICAgdGhpcy51cGRhdGVDb250cm9scygpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgcmVmcmVzaFN0YXR1cygpIHtcbiAgICBpZiAodGhpcy5wZW5kaW5nID09PSAnc3RhdHVzJykgcmV0dXJuO1xuICAgIHRoaXMucGVuZGluZyA9ICdzdGF0dXMnO1xuICAgIHRoaXMudXBkYXRlQ29udHJvbHMoKTtcbiAgICB0cnkge1xuICAgICAgY29uc3Qgc3RhdHVzID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PE1pbmVTdGF0dXM+KCcvbWluZS9zdGF0dXMnKTtcbiAgICAgIHRoaXMuYXBwbHlTdGF0dXMoc3RhdHVzKTtcbiAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgIHNob3dUb2FzdChlPy5tZXNzYWdlIHx8ICdcdTgzQjdcdTUzRDZcdTcyQjZcdTYwMDFcdTU5MzFcdThEMjUnLCAnZXJyb3InKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5wZW5kaW5nID0gbnVsbDtcbiAgICAgIHRoaXMudXBkYXRlQ29udHJvbHMoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFwcGx5U3RhdHVzKHN0YXR1czogTWluZVN0YXR1cyB8IHVuZGVmaW5lZCwgb3B0czogeyBxdWlldD86IGJvb2xlYW4gfSA9IHt9KSB7XG4gICAgaWYgKCFzdGF0dXMpIHJldHVybjtcbiAgICB0aGlzLmNhcnRBbXQgPSBzdGF0dXMuY2FydEFtb3VudCA/PyB0aGlzLmNhcnRBbXQ7XG4gICAgdGhpcy5jYXJ0Q2FwID0gc3RhdHVzLmNhcnRDYXBhY2l0eSA/PyB0aGlzLmNhcnRDYXA7XG4gICAgdGhpcy5pbnRlcnZhbE1zID0gc3RhdHVzLmludGVydmFsTXMgPz8gdGhpcy5pbnRlcnZhbE1zO1xuICAgIHRoaXMuaXNNaW5pbmcgPSBCb29sZWFuKHN0YXR1cy5ydW5uaW5nKTtcbiAgICB0aGlzLmlzQ29sbGFwc2VkID0gQm9vbGVhbihzdGF0dXMuY29sbGFwc2VkKTtcbiAgICBpZiAoc3RhdHVzLmNvbGxhcHNlZCAmJiBzdGF0dXMuY29sbGFwc2VkUmVtYWluaW5nID4gMCkge1xuICAgICAgdGhpcy5iZWdpbkNvbGxhcHNlQ291bnRkb3duKHN0YXR1cy5jb2xsYXBzZWRSZW1haW5pbmcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNsZWFyQ29sbGFwc2VUaW1lcigpO1xuICAgICAgdGhpcy5jb2xsYXBzZVJlbWFpbmluZyA9IDA7XG4gICAgfVxuICAgIHRoaXMudXBkYXRlUHJvZ3Jlc3MoKTtcbiAgICBpZiAoIW9wdHMucXVpZXQpIHtcbiAgICAgIGlmICh0aGlzLmlzQ29sbGFwc2VkICYmIHRoaXMuY29sbGFwc2VSZW1haW5pbmcgPiAwKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZShgXHU3N0ZGXHU5MDUzXHU1NzREXHU1ODRDXHVGRjBDXHU1MjY5XHU0RjU5ICR7dGhpcy5jb2xsYXBzZVJlbWFpbmluZ31zYCk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaXNNaW5pbmcpIHtcbiAgICAgICAgY29uc3Qgc2Vjb25kcyA9IE1hdGgubWF4KDEsIE1hdGgucm91bmQodGhpcy5pbnRlcnZhbE1zIC8gMTAwMCkpO1xuICAgICAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoYFx1NzdGRlx1NjczQVx1OEZEMFx1ODg0Q1x1NEUyRFx1RkYwQ1x1NTQ2OFx1NjcxRlx1N0VBNiAke3NlY29uZHN9c1x1RkYwQ1x1NUY1M1x1NTI0RCAke3RoaXMuZm9ybWF0UGVyY2VudCgpfWApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0dXNNZXNzYWdlKCdcdTc3RkZcdTY3M0FcdTVERjJcdTUwNUNcdTZCNjJcdUZGMENcdTcwQjlcdTUxRkJcdTVGMDBcdTU5Q0JcdTYzMTZcdTc3RkYnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMuZWxzLmN5Y2xlKSB7XG4gICAgICBjb25zdCBzZWNvbmRzID0gTWF0aC5tYXgoMSwgTWF0aC5yb3VuZCh0aGlzLmludGVydmFsTXMgLyAxMDAwKSk7XG4gICAgICB0aGlzLmVscy5jeWNsZS50ZXh0Q29udGVudCA9IGAke3NlY29uZHN9c2A7XG4gICAgfVxuICAgIGlmICh0aGlzLmVscy5zdGF0dXNUYWcpIHtcbiAgICAgIGNvbnN0IGVsID0gdGhpcy5lbHMuc3RhdHVzVGFnIGFzIEhUTUxFbGVtZW50O1xuICAgICAgZWwuaW5uZXJIVE1MID0gJyc7XG4gICAgICBjb25zdCBpY28gPSB0aGlzLmlzQ29sbGFwc2VkID8gJ2Nsb3NlJyA6ICh0aGlzLmlzTWluaW5nID8gJ2JvbHQnIDogJ2Nsb2NrJyk7XG4gICAgICB0cnkgeyBlbC5hcHBlbmRDaGlsZChyZW5kZXJJY29uKGljbyBhcyBhbnksIHsgc2l6ZTogMTYgfSkpOyB9IGNhdGNoIHt9XG4gICAgICBlbC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0aGlzLmlzQ29sbGFwc2VkID8gJ1x1NTc0RFx1NTg0QycgOiAodGhpcy5pc01pbmluZyA/ICdcdThGRDBcdTg4NENcdTRFMkQnIDogJ1x1NUY4NVx1NjczQScpKSk7XG4gICAgfVxuICAgIHRoaXMudXBkYXRlQ29udHJvbHMoKTtcbiAgfVxuXG4gIHByaXZhdGUgYmVnaW5Db2xsYXBzZUNvdW50ZG93bihzZWNvbmRzOiBudW1iZXIpIHtcbiAgICB0aGlzLmNsZWFyQ29sbGFwc2VUaW1lcigpO1xuICAgIHRoaXMuaXNDb2xsYXBzZWQgPSB0cnVlO1xuICAgIHRoaXMuY29sbGFwc2VSZW1haW5pbmcgPSBNYXRoLm1heCgwLCBNYXRoLmZsb29yKHNlY29uZHMpKTtcbiAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoYFx1NzdGRlx1OTA1M1x1NTc0RFx1NTg0Q1x1RkYwQ1x1NTI2OVx1NEY1OSAke3RoaXMuY29sbGFwc2VSZW1haW5pbmd9c2ApO1xuICAgIHRoaXMudXBkYXRlQ29udHJvbHMoKTtcbiAgICB0aGlzLmNvbGxhcHNlVGltZXIgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgdGhpcy5jb2xsYXBzZVJlbWFpbmluZyA9IE1hdGgubWF4KDAsIHRoaXMuY29sbGFwc2VSZW1haW5pbmcgLSAxKTtcbiAgICAgIGlmICh0aGlzLmNvbGxhcHNlUmVtYWluaW5nIDw9IDApIHtcbiAgICAgICAgdGhpcy5jbGVhckNvbGxhcHNlVGltZXIoKTtcbiAgICAgICAgdGhpcy5pc0NvbGxhcHNlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoJ1x1NTc0RFx1NTg0Q1x1ODlFM1x1OTY2NFx1RkYwQ1x1NTNFRlx1OTFDRFx1NjVCMFx1NTQyRlx1NTJBOFx1NzdGRlx1NjczQScpO1xuICAgICAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoYFx1NzdGRlx1OTA1M1x1NTc0RFx1NTg0Q1x1RkYwQ1x1NTI2OVx1NEY1OSAke3RoaXMuY29sbGFwc2VSZW1haW5pbmd9c2ApO1xuICAgICAgfVxuICAgIH0sIDEwMDApO1xuICB9XG5cbiAgcHJpdmF0ZSBjbGVhckNvbGxhcHNlVGltZXIoKSB7XG4gICAgaWYgKHRoaXMuY29sbGFwc2VUaW1lciAhPT0gbnVsbCkge1xuICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5jb2xsYXBzZVRpbWVyKTtcbiAgICAgIHRoaXMuY29sbGFwc2VUaW1lciA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVQcm9ncmVzcygpIHtcbiAgICBpZiAoIXRoaXMuZWxzLmZpbGwgfHwgIXRoaXMuZWxzLnBlcmNlbnQpIHJldHVybjtcbiAgICBjb25zdCBwY3QgPSB0aGlzLmNhcnRDYXAgPiAwID8gTWF0aC5taW4oMSwgdGhpcy5jYXJ0QW10IC8gdGhpcy5jYXJ0Q2FwKSA6IDA7XG4gICAgdGhpcy5lbHMuZmlsbC5zdHlsZS53aWR0aCA9IGAke01hdGgucm91bmQocGN0ICogMTAwKX0lYDtcbiAgICB0aGlzLmVscy5wZXJjZW50LnRleHRDb250ZW50ID0gYCR7TWF0aC5yb3VuZChwY3QgKiAxMDApfSVgO1xuICAgIGlmICh0aGlzLmVscy5yaW5nKSB7XG4gICAgICBjb25zdCBkZWcgPSBNYXRoLnJvdW5kKHBjdCAqIDM2MCk7XG4gICAgICAodGhpcy5lbHMucmluZyBhcyBIVE1MRWxlbWVudCkuc3R5bGUuYmFja2dyb3VuZCA9IGBjb25pYy1ncmFkaWVudCgjN0IyQ0Y1ICR7ZGVnfWRlZywgcmdiYSgyNTUsMjU1LDI1NSwuMDgpIDBkZWcpYDtcbiAgICB9XG4gICAgaWYgKHRoaXMuZWxzLnJpbmdQY3QpIHRoaXMuZWxzLnJpbmdQY3QudGV4dENvbnRlbnQgPSBgJHtNYXRoLnJvdW5kKHBjdCAqIDEwMCl9JWA7XG4gICAgaWYgKHRoaXMucGVuZGluZyAhPT0gJ2NvbGxlY3QnICYmIHRoaXMuZWxzLmNvbGxlY3QpIHtcbiAgICAgIHRoaXMuZWxzLmNvbGxlY3QuZGlzYWJsZWQgPSB0aGlzLnBlbmRpbmcgPT09ICdjb2xsZWN0JyB8fCB0aGlzLmNhcnRBbXQgPD0gMDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUNvbnRyb2xzKCkge1xuICAgIGNvbnN0IGlzQnVzeSA9IChrZXk6IFBlbmRpbmdBY3Rpb24pID0+IHRoaXMucGVuZGluZyA9PT0ga2V5O1xuICAgIGNvbnN0IHNldEJ0biA9IChidG46IEhUTUxCdXR0b25FbGVtZW50IHwgbnVsbCwgaWNvbjogYW55LCBsYWJlbDogc3RyaW5nLCBkaXNhYmxlZDogYm9vbGVhbikgPT4ge1xuICAgICAgaWYgKCFidG4pIHJldHVybjtcbiAgICAgIGJ0bi5kaXNhYmxlZCA9IGRpc2FibGVkO1xuICAgICAgLy8ga2VlcCBmaXJzdCBjaGlsZCBhcyBpY29uIGlmIHByZXNlbnQsIG90aGVyd2lzZSBjcmVhdGVcbiAgICAgIGxldCBpY29uSG9zdCA9IGJ0bi5xdWVyeVNlbGVjdG9yKCcuaWNvbicpO1xuICAgICAgaWYgKCFpY29uSG9zdCkge1xuICAgICAgICBidG4uaW5zZXJ0QmVmb3JlKHJlbmRlckljb24oaWNvbiwgeyBzaXplOiAxOCB9KSwgYnRuLmZpcnN0Q2hpbGQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gUmVwbGFjZSBleGlzdGluZyBpY29uIHdpdGggbmV3IG9uZSBpZiBpY29uIG5hbWUgZGlmZmVycyBieSByZS1yZW5kZXJpbmdcbiAgICAgICAgY29uc3QgaG9zdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgaG9zdC5hcHBlbmRDaGlsZChyZW5kZXJJY29uKGljb24sIHsgc2l6ZTogMTggfSkpO1xuICAgICAgICAvLyByZW1vdmUgb2xkIGljb24gd3JhcHBlciBhbmQgdXNlIG5ld1xuICAgICAgICBpY29uSG9zdC5wYXJlbnRFbGVtZW50Py5yZXBsYWNlQ2hpbGQoaG9zdC5maXJzdENoaWxkIGFzIE5vZGUsIGljb25Ib3N0KTtcbiAgICAgIH1cbiAgICAgIC8vIHNldCBsYWJlbCB0ZXh0IChwcmVzZXJ2ZSBpY29uKVxuICAgICAgLy8gcmVtb3ZlIGV4aXN0aW5nIHRleHQgbm9kZXNcbiAgICAgIEFycmF5LmZyb20oYnRuLmNoaWxkTm9kZXMpLmZvckVhY2goKG4sIGlkeCkgPT4ge1xuICAgICAgICBpZiAoaWR4ID4gMCkgYnRuLnJlbW92ZUNoaWxkKG4pO1xuICAgICAgfSk7XG4gICAgICBidG4uYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobGFiZWwpKTtcbiAgICB9O1xuXG4gICAgc2V0QnRuKHRoaXMuZWxzLnN0YXJ0LCAncGxheScsIGlzQnVzeSgnc3RhcnQnKSA/ICdcdTU0MkZcdTUyQThcdTRFMkRcdTIwMjYnIDogdGhpcy5pc01pbmluZyA/ICdcdTYzMTZcdTc3RkZcdTRFMkQnIDogJ1x1NUYwMFx1NTlDQlx1NjMxNlx1NzdGRicsIGlzQnVzeSgnc3RhcnQnKSB8fCB0aGlzLmlzTWluaW5nIHx8IHRoaXMuaXNDb2xsYXBzZWQpO1xuICAgIHNldEJ0bih0aGlzLmVscy5zdG9wLCAnc3RvcCcsIGlzQnVzeSgnc3RvcCcpID8gJ1x1NTA1Q1x1NkI2Mlx1NEUyRFx1MjAyNicgOiAnXHU1MDVDXHU2QjYyJywgaXNCdXN5KCdzdG9wJykgfHwgIXRoaXMuaXNNaW5pbmcpO1xuICAgIHNldEJ0bih0aGlzLmVscy5jb2xsZWN0LCAnY29sbGVjdCcsIGlzQnVzeSgnY29sbGVjdCcpID8gJ1x1NjUzNlx1OTZDNlx1NEUyRFx1MjAyNicgOiAnXHU2NTM2XHU3N0ZGJywgaXNCdXN5KCdjb2xsZWN0JykgfHwgdGhpcy5jYXJ0QW10IDw9IDApO1xuICAgIHNldEJ0bih0aGlzLmVscy5yZXBhaXIsICd3cmVuY2gnLCBpc0J1c3koJ3JlcGFpcicpID8gJ1x1NEZFRVx1NzQwNlx1NEUyRFx1MjAyNicgOiAnXHU0RkVFXHU3NDA2JywgaXNCdXN5KCdyZXBhaXInKSB8fCAhdGhpcy5pc0NvbGxhcHNlZCk7XG4gICAgc2V0QnRuKHRoaXMuZWxzLnN0YXR1c0J0biwgJ3JlZnJlc2gnLCBpc0J1c3koJ3N0YXR1cycpID8gJ1x1NTIzN1x1NjVCMFx1NEUyRFx1MjAyNicgOiAnXHU1MjM3XHU2NUIwXHU3MkI2XHU2MDAxJywgaXNCdXN5KCdzdGF0dXMnKSk7XG4gIH1cblxuICBwcml2YXRlIHNldFN0YXR1c01lc3NhZ2UodGV4dDogc3RyaW5nKSB7XG4gICAgaWYgKCF0aGlzLmVscy5zdGF0dXNUZXh0KSByZXR1cm47XG4gICAgdGhpcy5lbHMuc3RhdHVzVGV4dC50ZXh0Q29udGVudCA9IHRleHQ7XG4gIH1cblxuICBwcml2YXRlIGxvZ0V2ZW50KG1zZzogc3RyaW5nKSB7XG4gICAgaWYgKCF0aGlzLmVscz8uZXZlbnRzKSByZXR1cm47XG4gICAgY29uc3QgbGluZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGxpbmUuY2xhc3NOYW1lID0gJ2V2ZW50JztcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IGhoID0gU3RyaW5nKG5vdy5nZXRIb3VycygpKS5wYWRTdGFydCgyLCcwJyk7XG4gICAgY29uc3QgbW0gPSBTdHJpbmcobm93LmdldE1pbnV0ZXMoKSkucGFkU3RhcnQoMiwnMCcpO1xuICAgIGNvbnN0IHNzID0gU3RyaW5nKG5vdy5nZXRTZWNvbmRzKCkpLnBhZFN0YXJ0KDIsJzAnKTtcbiAgICBsaW5lLnRleHRDb250ZW50ID0gYFske2hofToke21tfToke3NzfV0gJHttc2d9YDtcbiAgICB0aGlzLmVscy5ldmVudHMucHJlcGVuZChsaW5lKTtcbiAgfVxuXG4gIHByaXZhdGUgZm9ybWF0UGVyY2VudCgpIHtcbiAgICBjb25zdCBwY3QgPSB0aGlzLmNhcnRDYXAgPiAwID8gTWF0aC5taW4oMSwgdGhpcy5jYXJ0QW10IC8gdGhpcy5jYXJ0Q2FwKSA6IDA7XG4gICAgcmV0dXJuIGAke01hdGgucm91bmQocGN0ICogMTAwKX0lYDtcbiAgfVxufVxuICAgIC8vIG1vdW50IGljb25zXG4gICAgdHJ5IHtcbiAgICAgIHZpZXcucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtaWNvXScpXG4gICAgICAgIC5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICAgIGNvbnN0IG5hbWUgPSAoZWwgYXMgSFRNTEVsZW1lbnQpLmdldEF0dHJpYnV0ZSgnZGF0YS1pY28nKSBhcyBhbnk7XG4gICAgICAgICAgdHJ5IHsgZWwuYXBwZW5kQ2hpbGQocmVuZGVySWNvbihuYW1lLCB7IHNpemU6IDIwIH0pKTsgfSBjYXRjaCB7fVxuICAgICAgICB9KTtcbiAgICB9IGNhdGNoIHt9XG4iLCAiaW1wb3J0IHsgTmV0d29ya01hbmFnZXIgfSBmcm9tICcuLi9jb3JlL05ldHdvcmtNYW5hZ2VyJztcbmltcG9ydCB7IGh0bWwsIHFzIH0gZnJvbSAnLi4vdXRpbHMvZG9tJztcbmltcG9ydCB7IHJlbmRlck5hdiB9IGZyb20gJy4uL2NvbXBvbmVudHMvTmF2JztcbmltcG9ydCB7IFJlYWx0aW1lQ2xpZW50IH0gZnJvbSAnLi4vY29yZS9SZWFsdGltZUNsaWVudCc7XG5pbXBvcnQgeyByZW5kZXJSZXNvdXJjZUJhciB9IGZyb20gJy4uL2NvbXBvbmVudHMvUmVzb3VyY2VCYXInO1xuaW1wb3J0IHsgc2hvd1RvYXN0IH0gZnJvbSAnLi4vY29tcG9uZW50cy9Ub2FzdCc7XG5pbXBvcnQgeyByZW5kZXJJY29uIH0gZnJvbSAnLi4vY29tcG9uZW50cy9JY29uJztcblxuZXhwb3J0IGNsYXNzIFdhcmVob3VzZVNjZW5lIHtcbiAgYXN5bmMgbW91bnQocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICByb290LmlubmVySFRNTCA9ICcnO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQocmVuZGVyTmF2KCd3YXJlaG91c2UnKSk7XG4gICAgY29uc3QgYmFyID0gcmVuZGVyUmVzb3VyY2VCYXIoKTtcbiAgICByb290LmFwcGVuZENoaWxkKGJhci5yb290KTtcblxuICAgIGNvbnN0IHZpZXcgPSBodG1sKGBcbiAgICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXJcIiBzdHlsZT1cImNvbG9yOiNmZmY7XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkIGZhZGUtaW5cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCIgc3R5bGU9XCJqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjthbGlnbi1pdGVtczpjZW50ZXI7XCI+XG4gICAgICAgICAgICA8aDMgc3R5bGU9XCJtYXJnaW46MDtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo4cHg7XCI+PHNwYW4gZGF0YS1pY289XCJ3YXJlaG91c2VcIj48L3NwYW4+XHU0RUQzXHU1RTkzPC9oMz5cbiAgICAgICAgICAgIDxidXR0b24gaWQ9XCJyZWZyZXNoXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIj48c3BhbiBkYXRhLWljbz1cInJlZnJlc2hcIj48L3NwYW4+XHU1MjM3XHU2NUIwPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBzdHlsZT1cIm1hcmdpbi10b3A6MTJweDtcIj5cbiAgICAgICAgICAgIDxkZXRhaWxzIG9wZW4+XG4gICAgICAgICAgICAgIDxzdW1tYXJ5PjxzcGFuIGRhdGEtaWNvPVwiYm94XCI+PC9zcGFuPlx1NjIxMVx1NzY4NFx1OTA1M1x1NTE3Nzwvc3VtbWFyeT5cbiAgICAgICAgICAgICAgPGRpdiBpZD1cImxpc3RcIiBzdHlsZT1cIm1hcmdpbi10b3A6OHB4O2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjhweDtcIj48L2Rpdj5cbiAgICAgICAgICAgIDwvZGV0YWlscz5cbiAgICAgICAgICAgIDxkZXRhaWxzPlxuICAgICAgICAgICAgICA8c3VtbWFyeT48c3BhbiBkYXRhLWljbz1cImxpc3RcIj48L3NwYW4+XHU5MDUzXHU1MTc3XHU2QTIxXHU2NzdGPC9zdW1tYXJ5PlxuICAgICAgICAgICAgICA8ZGl2IGlkPVwidHBsc1wiIHN0eWxlPVwibWFyZ2luLXRvcDo4cHg7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6OHB4O1wiPjwvZGl2PlxuICAgICAgICAgICAgPC9kZXRhaWxzPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIGApO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQodmlldyk7XG5cbiAgICBjb25zdCB0b2tlbiA9IChOZXR3b3JrTWFuYWdlciBhcyBhbnkpLklbJ3Rva2VuJ107XG4gICAgaWYgKHRva2VuKSBSZWFsdGltZUNsaWVudC5JLmNvbm5lY3QodG9rZW4pO1xuXG4gICAgY29uc3QgbGlzdCA9IHFzKHZpZXcsICcjbGlzdCcpO1xuICAgIGNvbnN0IHRwbENvbnRhaW5lciA9IHFzKHZpZXcsICcjdHBscycpO1xuICAgIGNvbnN0IHJlZnJlc2hCdG4gPSBxczxIVE1MQnV0dG9uRWxlbWVudD4odmlldywgJyNyZWZyZXNoJyk7XG5cbiAgICBjb25zdCBtb3VudEljb25zID0gKHJvb3RFbDogRWxlbWVudCkgPT4ge1xuICAgICAgcm9vdEVsLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWljb10nKVxuICAgICAgICAuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgICBjb25zdCBuYW1lID0gKGVsIGFzIEhUTUxFbGVtZW50KS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWNvJykgYXMgYW55O1xuICAgICAgICAgIHRyeSB7IGVsLmFwcGVuZENoaWxkKHJlbmRlckljb24obmFtZSwgeyBzaXplOiAyMCB9KSk7IH0gY2F0Y2gge31cbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBtb3VudEljb25zKHZpZXcpO1xuXG4gICAgY29uc3QgZ2V0UmFyaXR5ID0gKGl0ZW06IGFueSwgdHBsPzogYW55KTogeyBrZXk6ICdjb21tb24nfCdyYXJlJ3wnZXBpYyd8J2xlZ2VuZGFyeSc7IHRleHQ6IHN0cmluZyB9ID0+IHtcbiAgICAgIGNvbnN0IHIgPSAodHBsICYmICh0cGwucmFyaXR5IHx8IHRwbC50aWVyKSkgfHwgaXRlbS5yYXJpdHk7XG4gICAgICBjb25zdCBsZXZlbCA9IE51bWJlcihpdGVtLmxldmVsKSB8fCAwO1xuICAgICAgaWYgKHR5cGVvZiByID09PSAnc3RyaW5nJykge1xuICAgICAgICBjb25zdCBrID0gci50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBpZiAoWydsZWdlbmRhcnknLCdlcGljJywncmFyZScsJ2NvbW1vbiddLmluY2x1ZGVzKGspKSB7XG4gICAgICAgICAgcmV0dXJuIHsga2V5OiBrIGFzIGFueSwgdGV4dDogayA9PT0gJ2xlZ2VuZGFyeScgPyAnXHU0RjIwXHU4QkY0JyA6IGsgPT09ICdlcGljJyA/ICdcdTUzRjJcdThCRDcnIDogayA9PT0gJ3JhcmUnID8gJ1x1N0EwMFx1NjcwOScgOiAnXHU2NjZFXHU5MDFBJyB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobGV2ZWwgPj0gMTIpIHJldHVybiB7IGtleTogJ2xlZ2VuZGFyeScsIHRleHQ6ICdcdTRGMjBcdThCRjQnIH07XG4gICAgICBpZiAobGV2ZWwgPj0gOCkgcmV0dXJuIHsga2V5OiAnZXBpYycsIHRleHQ6ICdcdTUzRjJcdThCRDcnIH07XG4gICAgICBpZiAobGV2ZWwgPj0gNCkgcmV0dXJuIHsga2V5OiAncmFyZScsIHRleHQ6ICdcdTdBMDBcdTY3MDknIH07XG4gICAgICByZXR1cm4geyBrZXk6ICdjb21tb24nLCB0ZXh0OiAnXHU2NjZFXHU5MDFBJyB9O1xuICAgIH07XG5cbiAgICBjb25zdCBmb3JtYXRUaW1lID0gKHRzOiBudW1iZXIpID0+IHtcbiAgICAgIHRyeSB7IHJldHVybiBuZXcgRGF0ZSh0cykudG9Mb2NhbGVTdHJpbmcoKTsgfSBjYXRjaCB7IHJldHVybiAnJyArIHRzOyB9XG4gICAgfTtcblxuICAgIGNvbnN0IGxvYWQgPSBhc3luYyAoKSA9PiB7XG4gICAgICByZWZyZXNoQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIHJlZnJlc2hCdG4uaW5uZXJIVE1MID0gJzxzcGFuIGRhdGEtaWNvPVwicmVmcmVzaFwiPjwvc3Bhbj5cdTUyMzdcdTY1QjBcdTRFMkRcdTIwMjYnO1xuICAgICAgbW91bnRJY29ucyhyZWZyZXNoQnRuKTtcbiAgICAgIGF3YWl0IGJhci51cGRhdGUoKTtcbiAgICAgIGxpc3QuaW5uZXJIVE1MID0gJyc7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykgbGlzdC5hcHBlbmRDaGlsZChodG1sKCc8ZGl2IGNsYXNzPVwic2tlbGV0b25cIj48L2Rpdj4nKSk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBbZGF0YSwgdHBsc10gPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgICAgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgaXRlbXM6IGFueVtdIH0+KCcvaXRlbXMnKSxcbiAgICAgICAgICBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyB0ZW1wbGF0ZXM6IGFueVtdIH0+KCcvaXRlbXMvdGVtcGxhdGVzJykuY2F0Y2goKCkgPT4gKHsgdGVtcGxhdGVzOiBbXSB9KSlcbiAgICAgICAgXSk7XG4gICAgICAgIGNvbnN0IHRwbEJ5SWQ6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcbiAgICAgICAgZm9yIChjb25zdCB0IG9mICh0cGxzLnRlbXBsYXRlcyB8fCBbXSkpIHRwbEJ5SWRbdC5pZF0gPSB0O1xuICAgICAgICBsaXN0LmlubmVySFRNTCA9ICcnO1xuICAgICAgICBpZiAoIWRhdGEuaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgbGlzdC5hcHBlbmRDaGlsZChodG1sKCc8ZGl2IHN0eWxlPVwib3BhY2l0eTouODtcIj5cdTY2ODJcdTY1RTBcdTkwNTNcdTUxNzdcdUZGMENcdTVDMURcdThCRDVcdTU5MUFcdTYzMTZcdTc3RkZcdTYyMTZcdTYzQTBcdTU5M0FcdTRFRTVcdTgzQjdcdTUzRDZcdTY2RjRcdTU5MUFcdThENDRcdTZFOTA8L2Rpdj4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGRhdGEuaXRlbXMpIHtcbiAgICAgICAgICBjb25zdCB0cGwgPSB0cGxCeUlkW2l0ZW0udGVtcGxhdGVJZF07XG4gICAgICAgICAgY29uc3QgcmFyaXR5ID0gZ2V0UmFyaXR5KGl0ZW0sIHRwbCk7XG4gICAgICAgICAgY29uc3QgbmFtZSA9ICh0cGwgJiYgKHRwbC5uYW1lIHx8IHRwbC5pZCkpIHx8IGl0ZW0udGVtcGxhdGVJZDtcblxuICAgICAgICAgIGNvbnN0IHJvdyA9IGh0bWwoYFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIml0ZW0tY2FyZCBob3Zlci1saWZ0ICR7XG4gICAgICAgICAgICAgIHJhcml0eS5rZXkgPT09ICdsZWdlbmRhcnknID8gJ3Jhcml0eS1vdXRsaW5lLWxlZ2VuZGFyeScgOiByYXJpdHkua2V5ID09PSAnZXBpYycgPyAncmFyaXR5LW91dGxpbmUtZXBpYycgOiByYXJpdHkua2V5ID09PSAncmFyZScgPyAncmFyaXR5LW91dGxpbmUtcmFyZScgOiAncmFyaXR5LW91dGxpbmUtY29tbW9uJ1xuICAgICAgICAgICAgfVwiIGRhdGEtcmFyaXR5PVwiJHtyYXJpdHkua2V5fVwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCIgc3R5bGU9XCJqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjthbGlnbi1pdGVtczpmbGV4LXN0YXJ0O2dhcDoxMHB4O1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDo0cHg7ZmxleDoxO21pbi13aWR0aDowO1wiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cImRpc3BsYXk6ZmxleDtmbGV4LXdyYXA6d3JhcDtnYXA6NnB4O2FsaWduLWl0ZW1zOmNlbnRlcjtcIj5cbiAgICAgICAgICAgICAgICAgICAgPHN0cm9uZyBzdHlsZT1cImZvbnQtc2l6ZToxNXB4O3doaXRlLXNwYWNlOm5vd3JhcDtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo2cHg7XCI+PHNwYW4gZGF0YS1pY289XCJvcmVcIj48L3NwYW4+JHtuYW1lfTwvc3Ryb25nPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImJhZGdlIHJhcml0eS0ke3Jhcml0eS5rZXl9XCI+PGk+PC9pPiR7cmFyaXR5LnRleHR9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAke2l0ZW0uaXNFcXVpcHBlZCA/ICc8c3BhbiBjbGFzcz1cInBpbGxcIj5cdTVERjJcdTg4QzVcdTU5MDc8L3NwYW4+JyA6ICcnfVxuICAgICAgICAgICAgICAgICAgICAke2l0ZW0uaXNMaXN0ZWQgPyAnPHNwYW4gY2xhc3M9XCJwaWxsXCI+XHU2MzAyXHU1MzU1XHU0RTJEPC9zcGFuPicgOiAnJ31cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cIm9wYWNpdHk6Ljg1O2Rpc3BsYXk6ZmxleDtmbGV4LXdyYXA6d3JhcDtnYXA6OHB4O1wiPlxuICAgICAgICAgICAgICAgICAgICA8c3Bhbj5cdTdCNDlcdTdFQTcgTHYuJHtpdGVtLmxldmVsfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwaWxsXCI+XHU1QjlFXHU0RjhCICR7aXRlbS5pZH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICR7dHBsPy5jYXRlZ29yeSA/IGA8c3BhbiBjbGFzcz1cInBpbGxcIj4ke3RwbC5jYXRlZ29yeX08L3NwYW4+YCA6ICcnfVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFjdGlvbnNcIj5cbiAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLWJ1eVwiIGRhdGEtYWN0PVwiZXF1aXBcIiBkYXRhLWlkPVwiJHtpdGVtLmlkfVwiICR7aXRlbS5pc0VxdWlwcGVkID8gJ2Rpc2FibGVkJyA6ICcnfT48c3BhbiBkYXRhLWljbz1cInNoaWVsZFwiPjwvc3Bhbj5cdTg4QzVcdTU5MDc8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIiBkYXRhLWFjdD1cInVwZ3JhZGVcIiBkYXRhLWlkPVwiJHtpdGVtLmlkfVwiPjxzcGFuIGRhdGEtaWNvPVwid3JlbmNoXCI+PC9zcGFuPlx1NTM0N1x1N0VBNzwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tZ2hvc3RcIiBkYXRhLWFjdD1cInRvZ2dsZVwiIGRhdGEtaWQ9XCIke2l0ZW0uaWR9XCI+PHNwYW4gZGF0YS1pY289XCJsaXN0XCI+PC9zcGFuPlx1OEJFNlx1NjBDNTwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRpbWVsaW5lXCIgaWQ9XCJ0bC0ke2l0ZW0uaWR9XCIgaGlkZGVuPjwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgYCk7XG4gICAgICAgICAgbW91bnRJY29ucyhyb3cpO1xuICAgICAgICAgIHJvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIChldikgPT4ge1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gZXYudGFyZ2V0IGFzIEhUTUxCdXR0b25FbGVtZW50O1xuICAgICAgICAgICAgY29uc3QgaWQgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWlkJyk7XG4gICAgICAgICAgICBjb25zdCBhY3QgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWFjdCcpO1xuICAgICAgICAgICAgaWYgKCFpZCB8fCAhYWN0KSByZXR1cm47XG4gICAgICAgICAgICBpZiAoYWN0ID09PSAndG9nZ2xlJykge1xuICAgICAgICAgICAgICBjb25zdCBib3ggPSByb3cucXVlcnlTZWxlY3RvcihgI3RsLSR7aWR9YCkgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgICAgICAgIGlmICghYm94KSByZXR1cm47XG4gICAgICAgICAgICAgIGlmICghYm94Lmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgICAgICAgICAgIGJveC5pbm5lckhUTUwgPSAnPGRpdiBjbGFzcz1cInNrZWxldG9uXCIgc3R5bGU9XCJoZWlnaHQ6MzZweDtcIj48L2Rpdj4nO1xuICAgICAgICAgICAgICAgIGJveC5oaWRkZW4gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgbG9nczogeyB0eXBlOiBzdHJpbmc7IGRlc2M/OiBzdHJpbmc7IHRpbWU6IG51bWJlciB9W10gfT4oYC9pdGVtcy9sb2dzP2l0ZW1JZD0ke2lkfWApO1xuICAgICAgICAgICAgICAgICAgY29uc3QgbG9ncyA9IEFycmF5LmlzQXJyYXkocmVzLmxvZ3MpID8gcmVzLmxvZ3MgOiBbXTtcbiAgICAgICAgICAgICAgICAgIGJveC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICAgICAgICAgIGlmICghbG9ncy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgYm94LmlubmVySFRNTCA9ICc8ZGl2IHN0eWxlPVwib3BhY2l0eTouODtcIj5cdTY2ODJcdTY1RTBcdTUzODZcdTUzRjJcdTY1NzBcdTYzNkU8L2Rpdj4nO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBsb2cgb2YgbG9ncykge1xuICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBodG1sKGBcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0aW1lbGluZS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkb3RcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRpbWVcIj4ke2Zvcm1hdFRpbWUobG9nLnRpbWUpfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGVzY1wiPiR7KGxvZy5kZXNjIHx8IGxvZy50eXBlIHx8ICcnKS5yZXBsYWNlKC88L2csJyZsdDsnKX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIGApO1xuICAgICAgICAgICAgICAgICAgICAgIGJveC5hcHBlbmRDaGlsZChub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgICAgICAgICAgYm94LmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgICAgICAgYm94LmFwcGVuZENoaWxkKGh0bWwoYFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGltZWxpbmUtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkb3RcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGltZVwiPlx1MjAxNDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkZXNjXCI+XHU2NzY1XHU2RTkwXHU2NzJBXHU3N0U1IFx1MDBCNyBcdTUzRUZcdTkwMUFcdThGQzdcdTYzMTZcdTc3RkZcdTMwMDFcdTYzQTBcdTU5M0FcdTYyMTZcdTRFQTRcdTY2MTNcdTgzQjdcdTUzRDY8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICBgKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGJveC5oaWRkZW4gPSAhYm94LmhpZGRlbjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICB0YXJnZXQuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICB0YXJnZXQuaW5uZXJIVE1MID0gYWN0ID09PSAnZXF1aXAnID8gJzxzcGFuIGRhdGEtaWNvPVwic2hpZWxkXCI+PC9zcGFuPlx1ODhDNVx1NTkwN1x1NEUyRFx1MjAyNicgOiAnPHNwYW4gZGF0YS1pY289XCJ3cmVuY2hcIj48L3NwYW4+XHU1MzQ3XHU3RUE3XHU0RTJEXHUyMDI2JztcbiAgICAgICAgICAgICAgbW91bnRJY29ucyh0YXJnZXQpO1xuICAgICAgICAgICAgICBpZiAoYWN0ID09PSAnZXF1aXAnKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0KCcvaXRlbXMvZXF1aXAnLCB7IG1ldGhvZDogJ1BPU1QnLCBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGl0ZW1JZDogaWQgfSkgfSk7XG4gICAgICAgICAgICAgICAgc2hvd1RvYXN0KCdcdTg4QzVcdTU5MDdcdTYyMTBcdTUyOUYnKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChhY3QgPT09ICd1cGdyYWRlJykge1xuICAgICAgICAgICAgICAgIGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdCgnL2l0ZW1zL3VwZ3JhZGUnLCB7IG1ldGhvZDogJ1BPU1QnLCBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGl0ZW1JZDogaWQgfSkgfSk7XG4gICAgICAgICAgICAgICAgc2hvd1RvYXN0KCdcdTUzNDdcdTdFQTdcdTYyMTBcdTUyOUYnKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBhd2FpdCBsb2FkKCk7XG4gICAgICAgICAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgICAgICAgICAgc2hvd1RvYXN0KGU/Lm1lc3NhZ2UgfHwgJ1x1NjRDRFx1NEY1Q1x1NTkzMVx1OEQyNScpO1xuICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgY29uc3QgYSA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtYWN0Jyk7XG4gICAgICAgICAgICAgIGlmIChhID09PSAnZXF1aXAnKSB0YXJnZXQuaW5uZXJIVE1MID0gJzxzcGFuIGRhdGEtaWNvPVwic2hpZWxkXCI+PC9zcGFuPlx1ODhDNVx1NTkwNyc7XG4gICAgICAgICAgICAgIGVsc2UgaWYgKGEgPT09ICd1cGdyYWRlJykgdGFyZ2V0LmlubmVySFRNTCA9ICc8c3BhbiBkYXRhLWljbz1cIndyZW5jaFwiPjwvc3Bhbj5cdTUzNDdcdTdFQTcnO1xuICAgICAgICAgICAgICBlbHNlIHRhcmdldC5pbm5lckhUTUwgPSAnPHNwYW4gZGF0YS1pY289XCJsaXN0XCI+PC9zcGFuPlx1OEJFNlx1NjBDNSc7XG4gICAgICAgICAgICAgIG1vdW50SWNvbnModGFyZ2V0KTtcbiAgICAgICAgICAgICAgdGFyZ2V0LmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgbGlzdC5hcHBlbmRDaGlsZChyb3cpO1xuICAgICAgICB9XG5cbiAgICAgICAgdHBsQ29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuICAgICAgICBmb3IgKGNvbnN0IHRwbCBvZiAodHBscy50ZW1wbGF0ZXMgfHwgW10pKSB7XG4gICAgICAgICAgY29uc3Qgcm93ID0gaHRtbChgPGRpdiBjbGFzcz1cImxpc3QtaXRlbVwiPjxzdHJvbmc+JHt0cGwubmFtZSB8fCB0cGwuaWR9PC9zdHJvbmc+IFx1MDBCNyAke3RwbC5jYXRlZ29yeSB8fCAnXHU2NzJBXHU3N0U1XHU3QzdCXHU1NzhCJ308L2Rpdj5gKTtcbiAgICAgICAgICB0cGxDb250YWluZXIuYXBwZW5kQ2hpbGQocm93KTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgIHNob3dUb2FzdChlPy5tZXNzYWdlIHx8ICdcdTUyQTBcdThGN0RcdTRFRDNcdTVFOTNcdTU5MzFcdThEMjUnKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHJlZnJlc2hCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgcmVmcmVzaEJ0bi5pbm5lckhUTUwgPSAnPHNwYW4gZGF0YS1pY289XCJyZWZyZXNoXCI+PC9zcGFuPlx1NTIzN1x1NjVCMCc7XG4gICAgICAgIG1vdW50SWNvbnMocmVmcmVzaEJ0bik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJlZnJlc2hCdG4ub25jbGljayA9ICgpID0+IGxvYWQoKTtcbiAgICBhd2FpdCBsb2FkKCk7XG4gIH1cbn1cblxuIiwgImltcG9ydCB7IE5ldHdvcmtNYW5hZ2VyIH0gZnJvbSAnLi4vY29yZS9OZXR3b3JrTWFuYWdlcic7XG5pbXBvcnQgeyBodG1sLCBxcyB9IGZyb20gJy4uL3V0aWxzL2RvbSc7XG5pbXBvcnQgeyByZW5kZXJOYXYgfSBmcm9tICcuLi9jb21wb25lbnRzL05hdic7XG5pbXBvcnQgeyBSZWFsdGltZUNsaWVudCB9IGZyb20gJy4uL2NvcmUvUmVhbHRpbWVDbGllbnQnO1xuaW1wb3J0IHsgc2hvd1RvYXN0IH0gZnJvbSAnLi4vY29tcG9uZW50cy9Ub2FzdCc7XG5pbXBvcnQgeyByZW5kZXJSZXNvdXJjZUJhciB9IGZyb20gJy4uL2NvbXBvbmVudHMvUmVzb3VyY2VCYXInO1xuaW1wb3J0IHsgcmVuZGVySWNvbiB9IGZyb20gJy4uL2NvbXBvbmVudHMvSWNvbic7XG5cbmV4cG9ydCBjbGFzcyBQbHVuZGVyU2NlbmUge1xuICBwcml2YXRlIHJlc3VsdEJveDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcblxuICBtb3VudChyb290OiBIVE1MRWxlbWVudCkge1xuICAgIHJvb3QuaW5uZXJIVE1MID0gJyc7XG4gICAgcm9vdC5hcHBlbmRDaGlsZChyZW5kZXJOYXYoJ3BsdW5kZXInKSk7XG4gICAgY29uc3QgYmFyID0gcmVuZGVyUmVzb3VyY2VCYXIoKTtcbiAgICByb290LmFwcGVuZENoaWxkKGJhci5yb290KTtcblxuICAgIGNvbnN0IHZpZXcgPSBodG1sKGBcbiAgICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXJcIiBzdHlsZT1cImNvbG9yOiNmZmY7XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkIGZhZGUtaW5cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCIgc3R5bGU9XCJqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjthbGlnbi1pdGVtczpjZW50ZXI7XCI+XG4gICAgICAgICAgICA8aDMgc3R5bGU9XCJtYXJnaW46MDtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo4cHg7XCI+PHNwYW4gZGF0YS1pY289XCJzd29yZFwiPjwvc3Bhbj5cdTYzQTBcdTU5M0FcdTc2RUVcdTY4MDc8L2gzPlxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInJlZnJlc2hcIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiPjxzcGFuIGRhdGEtaWNvPVwicmVmcmVzaFwiPjwvc3Bhbj5cdTUyMzdcdTY1QjA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGlkPVwibGlzdFwiIHN0eWxlPVwibWFyZ2luLXRvcDoxMnB4O2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjhweDtcIj48L2Rpdj5cbiAgICAgICAgICA8ZGl2IGlkPVwicmVzdWx0XCIgc3R5bGU9XCJtYXJnaW4tdG9wOjEycHg7b3BhY2l0eTouOTtmb250LWZhbWlseTptb25vc3BhY2U7XCI+PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgYCk7XG4gICAgcm9vdC5hcHBlbmRDaGlsZCh2aWV3KTtcblxuICAgIGNvbnN0IHRva2VuID0gKE5ldHdvcmtNYW5hZ2VyIGFzIGFueSkuSVsndG9rZW4nXTtcbiAgICBpZiAodG9rZW4pIFJlYWx0aW1lQ2xpZW50LkkuY29ubmVjdCh0b2tlbik7XG5cbiAgICBSZWFsdGltZUNsaWVudC5JLm9uKCdwbHVuZGVyLmF0dGFja2VkJywgKG1zZykgPT4ge1xuICAgICAgc2hvd1RvYXN0KGBcdTg4QUJcdTYzQTBcdTU5M0FcdUZGMUFcdTY3NjVcdTgxRUEgJHttc2cuYXR0YWNrZXJ9XHVGRjBDXHU2MzVGXHU1OTMxICR7bXNnLmxvc3N9YCk7XG4gICAgICB0aGlzLmxvZyhgXHU4OEFCICR7bXNnLmF0dGFja2VyfSBcdTYzQTBcdTU5M0FcdUZGMENcdTYzNUZcdTU5MzEgJHttc2cubG9zc31gKTtcbiAgICB9KTtcbiAgICB0aGlzLnJlc3VsdEJveCA9IHFzKHZpZXcsICcjcmVzdWx0Jyk7XG5cbiAgICBjb25zdCBsaXN0ID0gcXModmlldywgJyNsaXN0Jyk7XG4gICAgY29uc3QgcmVmcmVzaEJ0biA9IHFzPEhUTUxCdXR0b25FbGVtZW50Pih2aWV3LCAnI3JlZnJlc2gnKTtcbiAgICBjb25zdCBtb3VudEljb25zID0gKHJvb3RFbDogRWxlbWVudCkgPT4ge1xuICAgICAgcm9vdEVsLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWljb10nKVxuICAgICAgICAuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgICBjb25zdCBuYW1lID0gKGVsIGFzIEhUTUxFbGVtZW50KS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWNvJykgYXMgYW55O1xuICAgICAgICAgIHRyeSB7IGVsLmFwcGVuZENoaWxkKHJlbmRlckljb24obmFtZSwgeyBzaXplOiAyMCB9KSk7IH0gY2F0Y2gge31cbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBtb3VudEljb25zKHZpZXcpO1xuXG4gICAgY29uc3QgbG9hZCA9IGFzeW5jICgpID0+IHtcbiAgICAgIHJlZnJlc2hCdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgcmVmcmVzaEJ0bi5pbm5lckhUTUwgPSAnPHNwYW4gZGF0YS1pY289XCJyZWZyZXNoXCI+PC9zcGFuPlx1NTIzN1x1NjVCMFx1NEUyRFx1MjAyNic7XG4gICAgICBtb3VudEljb25zKHJlZnJlc2hCdG4pO1xuICAgICAgYXdhaXQgYmFyLnVwZGF0ZSgpO1xuICAgICAgbGlzdC5pbm5lckhUTUwgPSAnJztcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSBsaXN0LmFwcGVuZENoaWxkKGh0bWwoJzxkaXYgY2xhc3M9XCJza2VsZXRvblwiPjwvZGl2PicpKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyB0YXJnZXRzOiBhbnlbXSB9PignL3BsdW5kZXIvdGFyZ2V0cycpO1xuICAgICAgICBsaXN0LmlubmVySFRNTCA9ICcnO1xuICAgICAgICBpZiAoIWRhdGEudGFyZ2V0cy5sZW5ndGgpIHtcbiAgICAgICAgICBsaXN0LmFwcGVuZENoaWxkKGh0bWwoJzxkaXYgc3R5bGU9XCJvcGFjaXR5Oi44O1wiPlx1NjY4Mlx1NjVFMFx1NTNFRlx1NjNBMFx1NTkzQVx1NzY4NFx1NzZFRVx1NjgwN1x1RkYwQ1x1N0EwRFx1NTQwRVx1NTE4RFx1OEJENTwvZGl2PicpKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IHRhcmdldCBvZiBkYXRhLnRhcmdldHMpIHtcbiAgICAgICAgICBjb25zdCByb3cgPSBodG1sKGBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsaXN0LWl0ZW0gbGlzdC1pdGVtLS1zZWxsXCI+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDoycHg7XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cImRpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjZweDtcIj48c3BhbiBkYXRhLWljbz1cInRhcmdldFwiPjwvc3Bhbj48c3Ryb25nPiR7dGFyZ2V0LnVzZXJuYW1lIHx8IHRhcmdldC5pZH08L3N0cm9uZz48L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwib3BhY2l0eTouODU7XCI+XHU3N0ZGXHU3N0YzXHVGRjFBJHt0YXJnZXQub3JlfSA8c3BhbiBjbGFzcz1cInBpbGxcIj5cdTk4ODRcdThCQTFcdTY1MzZcdTc2Q0EgNSV+MzAlPC9zcGFuPjwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1zZWxsXCIgZGF0YS1pZD1cIiR7dGFyZ2V0LmlkfVwiPjxzcGFuIGRhdGEtaWNvPVwic3dvcmRcIj48L3NwYW4+XHU2M0EwXHU1OTNBPC9idXR0b24+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgYCk7XG4gICAgICAgICAgbW91bnRJY29ucyhyb3cpO1xuICAgICAgICAgIHJvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIChldikgPT4ge1xuICAgICAgICAgICAgY29uc3QgZWwgPSBldi50YXJnZXQgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XG4gICAgICAgICAgICBjb25zdCBpZCA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1pZCcpO1xuICAgICAgICAgICAgaWYgKCFpZCkgcmV0dXJuO1xuICAgICAgICAgICAgZWwuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWwgPSBlbC50ZXh0Q29udGVudCB8fCAnJztcbiAgICAgICAgICAgIGVsLnRleHRDb250ZW50ID0gJ1x1NjNBMFx1NTkzQVx1NEUyRFx1MjAyNic7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyBzdWNjZXNzOiBib29sZWFuOyBsb290X2Ftb3VudDogbnVtYmVyIH0+KGAvcGx1bmRlci8ke2lkfWAsIHsgbWV0aG9kOiAnUE9TVCcgfSk7XG4gICAgICAgICAgICAgIGlmIChyZXMuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIHRoaXMubG9nKGBcdTYyMTBcdTUyOUZcdTYzQTBcdTU5M0EgJHtpZH1cdUZGMENcdTgzQjdcdTVGOTcgJHtyZXMubG9vdF9hbW91bnR9YCk7XG4gICAgICAgICAgICAgICAgc2hvd1RvYXN0KGBcdTYzQTBcdTU5M0FcdTYyMTBcdTUyOUZcdUZGMENcdTgzQjdcdTVGOTcgJHtyZXMubG9vdF9hbW91bnR9YCwgJ3N1Y2Nlc3MnKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZyhgXHU2M0EwXHU1OTNBICR7aWR9IFx1NTkzMVx1OEQyNWApO1xuICAgICAgICAgICAgICAgIHNob3dUb2FzdCgnXHU2M0EwXHU1OTNBXHU1OTMxXHU4RDI1JywgJ3dhcm4nKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBhd2FpdCBiYXIudXBkYXRlKCk7XG4gICAgICAgICAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IGU/Lm1lc3NhZ2UgfHwgJ1x1NjNBMFx1NTkzQVx1NTkzMVx1OEQyNSc7XG4gICAgICAgICAgICAgIHRoaXMubG9nKGBcdTYzQTBcdTU5M0FcdTU5MzFcdThEMjVcdUZGMUEke21lc3NhZ2V9YCk7XG4gICAgICAgICAgICAgIGlmIChtZXNzYWdlLmluY2x1ZGVzKCdcdTUxQjdcdTUzNzQnKSkge1xuICAgICAgICAgICAgICAgIHNob3dUb2FzdCgnXHU2M0EwXHU1OTNBXHU1NjY4XHU1MUI3XHU1Mzc0XHU0RTJEXHVGRjBDXHU4QkY3XHU3QTBEXHU1NDBFXHU1MThEXHU4QkQ1JywgJ3dhcm4nKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzaG93VG9hc3QobWVzc2FnZSwgJ2Vycm9yJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgIGVsLnRleHRDb250ZW50ID0gb3JpZ2luYWw7XG4gICAgICAgICAgICAgIGVsLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgbGlzdC5hcHBlbmRDaGlsZChyb3cpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgICAgc2hvd1RvYXN0KGU/Lm1lc3NhZ2UgfHwgJ1x1NTJBMFx1OEY3RFx1NjNBMFx1NTkzQVx1NzZFRVx1NjgwN1x1NTkzMVx1OEQyNScpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgcmVmcmVzaEJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICByZWZyZXNoQnRuLmlubmVySFRNTCA9ICc8c3BhbiBkYXRhLWljbz1cInJlZnJlc2hcIj48L3NwYW4+XHU1MjM3XHU2NUIwJztcbiAgICAgICAgbW91bnRJY29ucyhyZWZyZXNoQnRuKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmVmcmVzaEJ0bi5vbmNsaWNrID0gKCkgPT4gbG9hZCgpO1xuICAgIGxvYWQoKTtcbiAgfVxuXG4gIHByaXZhdGUgbG9nKG1zZzogc3RyaW5nKSB7XG4gICAgaWYgKCF0aGlzLnJlc3VsdEJveCkgcmV0dXJuO1xuICAgIGNvbnN0IGxpbmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBsaW5lLnRleHRDb250ZW50ID0gYFske25ldyBEYXRlKCkudG9Mb2NhbGVUaW1lU3RyaW5nKCl9XSAke21zZ31gO1xuICAgIHRoaXMucmVzdWx0Qm94LnByZXBlbmQobGluZSk7XG4gIH1cbn1cbiIsICJpbXBvcnQgeyBOZXR3b3JrTWFuYWdlciB9IGZyb20gJy4uL2NvcmUvTmV0d29ya01hbmFnZXInO1xuaW1wb3J0IHsgaHRtbCwgcXMgfSBmcm9tICcuLi91dGlscy9kb20nO1xuaW1wb3J0IHsgcmVuZGVyTmF2IH0gZnJvbSAnLi4vY29tcG9uZW50cy9OYXYnO1xuaW1wb3J0IHsgUmVhbHRpbWVDbGllbnQgfSBmcm9tICcuLi9jb3JlL1JlYWx0aW1lQ2xpZW50JztcbmltcG9ydCB7IEdhbWVNYW5hZ2VyIH0gZnJvbSAnLi4vY29yZS9HYW1lTWFuYWdlcic7XG5pbXBvcnQgeyBzaG93VG9hc3QgfSBmcm9tICcuLi9jb21wb25lbnRzL1RvYXN0JztcbmltcG9ydCB7IHJlbmRlclJlc291cmNlQmFyIH0gZnJvbSAnLi4vY29tcG9uZW50cy9SZXNvdXJjZUJhcic7XG5pbXBvcnQgeyByZW5kZXJJY29uIH0gZnJvbSAnLi4vY29tcG9uZW50cy9JY29uJztcblxudHlwZSBPcmRlciA9IHtcbiAgaWQ6IHN0cmluZztcbiAgdXNlcklkOiBzdHJpbmc7XG4gIHR5cGU6ICdidXknIHwgJ3NlbGwnO1xuICBpdGVtVGVtcGxhdGVJZD86IHN0cmluZztcbiAgaXRlbUluc3RhbmNlSWQ/OiBzdHJpbmc7XG4gIHByaWNlOiBudW1iZXI7XG4gIGFtb3VudDogbnVtYmVyO1xuICBjcmVhdGVkQXQ6IG51bWJlcjtcbn07XG5cbmV4cG9ydCBjbGFzcyBFeGNoYW5nZVNjZW5lIHtcbiAgcHJpdmF0ZSByZWZyZXNoVGltZXI6IG51bWJlciB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHRlbXBsYXRlczogeyBpZDogc3RyaW5nOyBuYW1lPzogc3RyaW5nOyBjYXRlZ29yeT86IHN0cmluZyB9W10gPSBbXTtcbiAgcHJpdmF0ZSBpbnZlbnRvcnk6IGFueVtdID0gW107XG5cbiAgYXN5bmMgbW91bnQocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICB0aGlzLmNsZWFyVGltZXIoKTtcbiAgICByb290LmlubmVySFRNTCA9ICcnO1xuXG4gICAgY29uc3QgbmF2ID0gcmVuZGVyTmF2KCdleGNoYW5nZScpO1xuICAgIGNvbnN0IGJhciA9IHJlbmRlclJlc291cmNlQmFyKCk7XG4gICAgY29uc3QgdmlldyA9IGh0bWwoYFxuICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiIHN0eWxlPVwiY29sb3I6I2ZmZjtkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDoxMnB4O1wiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZCBmYWRlLWluXCI+XG4gICAgICAgICAgPGgzIHN0eWxlPVwibWFyZ2luOjAgMCAxMnB4O2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjhweDtcIj48c3BhbiBkYXRhLWljbz1cImV4Y2hhbmdlXCI+PC9zcGFuPlx1NUUwMlx1NTczQVx1NEUwQlx1NTM1NTwvaDM+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiIHN0eWxlPVwiZmxleC13cmFwOndyYXA7YWxpZ24taXRlbXM6ZmxleC1lbmQ7Z2FwOjEycHg7XCI+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZmxleDoxO21pbi13aWR0aDoxODBweDtcIj5cbiAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVwiZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NnB4O1wiPjxzcGFuIGRhdGEtaWNvPVwibGlzdFwiPjwvc3Bhbj5cdThEMkRcdTRFNzBcdTZBMjFcdTY3N0Y8L2xhYmVsPlxuICAgICAgICAgICAgICA8c2VsZWN0IGlkPVwidHBsXCIgY2xhc3M9XCJpbnB1dFwiPjwvc2VsZWN0PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZmxleDoxO21pbi13aWR0aDoxMjBweDtcIj5cbiAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVwiZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NnB4O1wiPjxzcGFuIGRhdGEtaWNvPVwiY29pblwiPjwvc3Bhbj5cdTRFRjdcdTY4M0MgKEJCXHU1RTAxKTwvbGFiZWw+XG4gICAgICAgICAgICAgIDxpbnB1dCBpZD1cInByaWNlXCIgY2xhc3M9XCJpbnB1dFwiIHR5cGU9XCJudW1iZXJcIiBtaW49XCIxXCIgdmFsdWU9XCIxMFwiLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT1cImZsZXg6MTttaW4td2lkdGg6MTIwcHg7XCI+XG4gICAgICAgICAgICAgIDxsYWJlbD5cdThEMkRcdTRFNzBcdTY1NzBcdTkxQ0Y8L2xhYmVsPlxuICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJhbW91bnRcIiBjbGFzcz1cImlucHV0XCIgdHlwZT1cIm51bWJlclwiIG1pbj1cIjFcIiB2YWx1ZT1cIjFcIi8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxidXR0b24gaWQ9XCJwbGFjZUJ1eVwiIGNsYXNzPVwiYnRuIGJ0bi1idXlcIiBzdHlsZT1cIm1pbi13aWR0aDoxMjBweDtcIj48c3BhbiBkYXRhLWljbz1cImFycm93LXJpZ2h0XCI+PC9zcGFuPlx1NEUwQlx1NEU3MFx1NTM1NTwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgc3R5bGU9XCJoZWlnaHQ6OHB4O1wiPjwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIiBzdHlsZT1cImZsZXgtd3JhcDp3cmFwO2FsaWduLWl0ZW1zOmZsZXgtZW5kO2dhcDoxMnB4O1wiPlxuICAgICAgICAgICAgPGRpdiBzdHlsZT1cImZsZXg6MTttaW4td2lkdGg6MjIwcHg7XCI+XG4gICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cImRpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjZweDtcIj48c3BhbiBkYXRhLWljbz1cImJveFwiPjwvc3Bhbj5cdTUxRkFcdTU1MkVcdTkwNTNcdTUxNzc8L2xhYmVsPlxuICAgICAgICAgICAgICA8c2VsZWN0IGlkPVwiaW5zdFwiIGNsYXNzPVwiaW5wdXRcIj48L3NlbGVjdD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT1cImZsZXg6MTttaW4td2lkdGg6MTIwcHg7XCI+XG4gICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cImRpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjZweDtcIj48c3BhbiBkYXRhLWljbz1cImNvaW5cIj48L3NwYW4+XHU0RUY3XHU2ODNDIChCQlx1NUUwMSk8L2xhYmVsPlxuICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJzcHJpY2VcIiBjbGFzcz1cImlucHV0XCIgdHlwZT1cIm51bWJlclwiIG1pbj1cIjFcIiB2YWx1ZT1cIjVcIi8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxidXR0b24gaWQ9XCJwbGFjZVNlbGxcIiBjbGFzcz1cImJ0biBidG4tc2VsbFwiIHN0eWxlPVwibWluLXdpZHRoOjEyMHB4O1wiPjxzcGFuIGRhdGEtaWNvPVwiYXJyb3ctcmlnaHRcIj48L3NwYW4+XHU0RTBCXHU1MzU2XHU1MzU1PC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBpZD1cImludmVudG9yeVwiIHN0eWxlPVwibWFyZ2luLXRvcDoxMnB4O2Rpc3BsYXk6ZmxleDtmbGV4LXdyYXA6d3JhcDtnYXA6OHB4O1wiPjwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZCBmYWRlLWluXCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiIHN0eWxlPVwianVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YWxpZ24taXRlbXM6Y2VudGVyO2dhcDoxMnB4O1wiPlxuICAgICAgICAgICAgPGgzIHN0eWxlPVwibWFyZ2luOjA7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6OHB4O1wiPjxzcGFuIGRhdGEtaWNvPVwibGlzdFwiPjwvc3Bhbj5cdThCQTJcdTUzNTVcdTdDM0Y8L2gzPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiIHN0eWxlPVwiZmxleC13cmFwOndyYXA7Z2FwOjhweDtcIj5cbiAgICAgICAgICAgICAgPHNlbGVjdCBpZD1cInFfdHBsXCIgY2xhc3M9XCJpbnB1dFwiIHN0eWxlPVwid2lkdGg6MTgwcHg7XCI+PC9zZWxlY3Q+XG4gICAgICAgICAgICAgIDxzZWxlY3QgaWQ9XCJxX3R5cGVcIiBjbGFzcz1cImlucHV0XCIgc3R5bGU9XCJ3aWR0aDoxMjBweDtcIj5cbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiYnV5XCI+XHU0RTcwXHU1MzU1PC9vcHRpb24+XG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInNlbGxcIj5cdTUzNTZcdTUzNTU8L29wdGlvbj5cbiAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cInJvdyBwaWxsXCIgc3R5bGU9XCJhbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjZweDtcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBkYXRhLWljbz1cInVzZXJcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgPGlucHV0IGlkPVwibXlcIiB0eXBlPVwiY2hlY2tib3hcIi8+IFx1NTNFQVx1NzcwQlx1NjIxMVx1NzY4NFxuICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwicmVmcmVzaFwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCIgc3R5bGU9XCJtaW4td2lkdGg6OTZweDtcIj48c3BhbiBkYXRhLWljbz1cInJlZnJlc2hcIj48L3NwYW4+XHU1MjM3XHU2NUIwPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGlkPVwiYm9va1wiIHN0eWxlPVwibWFyZ2luLXRvcDoxMnB4O2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjhweDtcIj48L2Rpdj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQgZmFkZS1pblwiIGlkPVwibG9nc1wiIHN0eWxlPVwib3BhY2l0eTouOTtmb250LWZhbWlseTptb25vc3BhY2U7bWluLWhlaWdodDoyNHB4O1wiPjwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgYCk7XG5cbiAgICByb290LmFwcGVuZENoaWxkKG5hdik7XG4gICAgcm9vdC5hcHBlbmRDaGlsZChiYXIucm9vdCk7XG4gICAgcm9vdC5hcHBlbmRDaGlsZCh2aWV3KTtcblxuICAgIGNvbnN0IHRva2VuID0gKE5ldHdvcmtNYW5hZ2VyIGFzIGFueSkuSVsndG9rZW4nXTtcbiAgICBpZiAodG9rZW4pIFJlYWx0aW1lQ2xpZW50LkkuY29ubmVjdCh0b2tlbik7XG4gICAgY29uc3QgbWUgPSBHYW1lTWFuYWdlci5JLmdldFByb2ZpbGUoKTtcblxuICAgIGNvbnN0IGJvb2sgPSBxcyh2aWV3LCAnI2Jvb2snKTtcbiAgICBjb25zdCBsb2dzID0gcXM8SFRNTEVsZW1lbnQ+KHZpZXcsICcjbG9ncycpO1xuICAgIGNvbnN0IGJ1eVRwbCA9IHFzPEhUTUxTZWxlY3RFbGVtZW50Pih2aWV3LCAnI3RwbCcpO1xuICAgIGNvbnN0IGJ1eVByaWNlID0gcXM8SFRNTElucHV0RWxlbWVudD4odmlldywgJyNwcmljZScpO1xuICAgIGNvbnN0IGJ1eUFtb3VudCA9IHFzPEhUTUxJbnB1dEVsZW1lbnQ+KHZpZXcsICcjYW1vdW50Jyk7XG4gICAgY29uc3QgcGxhY2VCdXkgPSBxczxIVE1MQnV0dG9uRWxlbWVudD4odmlldywgJyNwbGFjZUJ1eScpO1xuICAgIGNvbnN0IHNlbGxJbnN0ID0gcXM8SFRNTFNlbGVjdEVsZW1lbnQ+KHZpZXcsICcjaW5zdCcpO1xuICAgIGNvbnN0IHNlbGxQcmljZSA9IHFzPEhUTUxJbnB1dEVsZW1lbnQ+KHZpZXcsICcjc3ByaWNlJyk7XG4gICAgY29uc3QgcGxhY2VTZWxsID0gcXM8SFRNTEJ1dHRvbkVsZW1lbnQ+KHZpZXcsICcjcGxhY2VTZWxsJyk7XG4gICAgY29uc3QgaW52Qm94ID0gcXM8SFRNTEVsZW1lbnQ+KHZpZXcsICcjaW52ZW50b3J5Jyk7XG4gICAgY29uc3QgcXVlcnlUcGwgPSBxczxIVE1MU2VsZWN0RWxlbWVudD4odmlldywgJyNxX3RwbCcpO1xuICAgIGNvbnN0IHF1ZXJ5VHlwZSA9IHFzPEhUTUxTZWxlY3RFbGVtZW50Pih2aWV3LCAnI3FfdHlwZScpO1xuICAgIGNvbnN0IHF1ZXJ5TWluZU9ubHkgPSBxczxIVE1MSW5wdXRFbGVtZW50Pih2aWV3LCAnI215Jyk7XG4gICAgY29uc3QgbWluZU9ubHlMYWJlbCA9IHZpZXcucXVlcnlTZWxlY3RvcignbGFiZWwucm93LnBpbGwnKSBhcyBIVE1MTGFiZWxFbGVtZW50IHwgbnVsbDtcbiAgICBjb25zdCByZWZyZXNoQnRuID0gcXM8SFRNTEJ1dHRvbkVsZW1lbnQ+KHZpZXcsICcjcmVmcmVzaCcpO1xuXG4gICAgY29uc3QgbW91bnRJY29ucyA9IChyb290RWw6IEVsZW1lbnQpID0+IHtcbiAgICAgIHJvb3RFbC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1pY29dJylcbiAgICAgICAgLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgICAgY29uc3QgbmFtZSA9IChlbCBhcyBIVE1MRWxlbWVudCkuZ2V0QXR0cmlidXRlKCdkYXRhLWljbycpIGFzIGFueTtcbiAgICAgICAgICB0cnkgeyBlbC5hcHBlbmRDaGlsZChyZW5kZXJJY29uKG5hbWUsIHsgc2l6ZTogMjAgfSkpOyB9IGNhdGNoIHt9XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgbW91bnRJY29ucyh2aWV3KTtcblxuICAgIGxldCBwcmV2SWRzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgbGV0IHJlZnJlc2hpbmcgPSBmYWxzZTtcblxuICAgIGNvbnN0IGxvZyA9IChtZXNzYWdlOiBzdHJpbmcpID0+IHtcbiAgICAgIGxvZ3MudGV4dENvbnRlbnQgPSBtZXNzYWdlO1xuICAgIH07XG5cbiAgICBjb25zdCByZW5kZXJUZW1wbGF0ZU9wdGlvbnMgPSAoKSA9PiB7XG4gICAgICBidXlUcGwuaW5uZXJIVE1MID0gJyc7XG4gICAgICBxdWVyeVRwbC5pbm5lckhUTUwgPSAnJztcbiAgICAgIGNvbnN0IHBsYWNlaG9sZGVyID0gaHRtbCgnPG9wdGlvbiB2YWx1ZT1cIlwiPlx1OTAwOVx1NjJFOVx1NkEyMVx1Njc3Rjwvb3B0aW9uPicpIGFzIEhUTUxPcHRpb25FbGVtZW50O1xuICAgICAgYnV5VHBsLmFwcGVuZENoaWxkKHBsYWNlaG9sZGVyKTtcbiAgICAgIGNvbnN0IHFQbGFjZWhvbGRlciA9IGh0bWwoJzxvcHRpb24gdmFsdWU9XCJcIj5cdTUxNjhcdTkwRThcdTZBMjFcdTY3N0Y8L29wdGlvbj4nKSBhcyBIVE1MT3B0aW9uRWxlbWVudDtcbiAgICAgIHF1ZXJ5VHBsLmFwcGVuZENoaWxkKHFQbGFjZWhvbGRlcik7XG4gICAgICBmb3IgKGNvbnN0IHRwbCBvZiB0aGlzLnRlbXBsYXRlcykge1xuICAgICAgICBjb25zdCBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgICAgb3B0aW9uLnZhbHVlID0gdHBsLmlkO1xuICAgICAgICBvcHRpb24udGV4dENvbnRlbnQgPSB0cGwubmFtZSA/IGAke3RwbC5uYW1lfSAoJHt0cGwuaWR9KWAgOiB0cGwuaWQ7XG4gICAgICAgIGJ1eVRwbC5hcHBlbmRDaGlsZChvcHRpb24pO1xuICAgICAgICBjb25zdCBxT3B0aW9uID0gb3B0aW9uLmNsb25lTm9kZSh0cnVlKSBhcyBIVE1MT3B0aW9uRWxlbWVudDtcbiAgICAgICAgcXVlcnlUcGwuYXBwZW5kQ2hpbGQocU9wdGlvbik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IHJlbmRlckludmVudG9yeSA9ICgpID0+IHtcbiAgICAgIHNlbGxJbnN0LmlubmVySFRNTCA9ICcnO1xuICAgICAgaW52Qm94LmlubmVySFRNTCA9ICcnO1xuICAgICAgY29uc3QgZGVmYXVsdE9wdGlvbiA9IGh0bWwoJzxvcHRpb24gdmFsdWU9XCJcIj5cdTkwMDlcdTYyRTlcdTUzRUZcdTUxRkFcdTU1MkVcdTc2ODRcdTkwNTNcdTUxNzc8L29wdGlvbj4nKSBhcyBIVE1MT3B0aW9uRWxlbWVudDtcbiAgICAgIHNlbGxJbnN0LmFwcGVuZENoaWxkKGRlZmF1bHRPcHRpb24pO1xuICAgICAgY29uc3QgYXZhaWxhYmxlID0gdGhpcy5pbnZlbnRvcnkuZmlsdGVyKChpdGVtKSA9PiAhaXRlbS5pc0VxdWlwcGVkICYmICFpdGVtLmlzTGlzdGVkKTtcbiAgICAgIGlmICghYXZhaWxhYmxlLmxlbmd0aCkge1xuICAgICAgICBpbnZCb3gudGV4dENvbnRlbnQgPSAnXHU2NjgyXHU2NUUwXHU1M0VGXHU1MUZBXHU1NTJFXHU3Njg0XHU5MDUzXHU1MTc3XHVGRjA4XHU5NzAwXHU1MTQ4XHU1NzI4XHU0RUQzXHU1RTkzXHU1Mzc4XHU0RTBCXHU4OEM1XHU1OTA3XHVGRjA5JztcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGF2YWlsYWJsZSkge1xuICAgICAgICBjb25zdCBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgICAgb3B0aW9uLnZhbHVlID0gaXRlbS5pZDtcbiAgICAgICAgb3B0aW9uLnRleHRDb250ZW50ID0gYCR7aXRlbS5pZH0gXHUwMEI3ICR7aXRlbS50ZW1wbGF0ZUlkfSBcdTAwQjcgTHYuJHtpdGVtLmxldmVsfWA7XG4gICAgICAgIHNlbGxJbnN0LmFwcGVuZENoaWxkKG9wdGlvbik7XG5cbiAgICAgICAgY29uc3QgY2hpcCA9IGh0bWwoYDxidXR0b24gY2xhc3M9XCJidG4gYnRuLWdob3N0XCIgc3R5bGU9XCJmbGV4OnVuc2V0O3BhZGRpbmc6NnB4IDEwcHg7XCIgZGF0YS1pZD1cIiR7aXRlbS5pZH1cIj4ke2l0ZW0uaWR9ICgke2l0ZW0udGVtcGxhdGVJZH0pPC9idXR0b24+YCkgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XG4gICAgICAgIGNoaXAub25jbGljayA9ICgpID0+IHtcbiAgICAgICAgICBzZWxsSW5zdC52YWx1ZSA9IGl0ZW0uaWQ7XG4gICAgICAgICAgbG9nKGBcdTVERjJcdTkwMDlcdTYyRTlcdTUxRkFcdTU1MkVcdTkwNTNcdTUxNzcgJHtpdGVtLmlkfWApO1xuICAgICAgICB9O1xuICAgICAgICBpbnZCb3guYXBwZW5kQ2hpbGQoY2hpcCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IGxvYWRNZXRhZGF0YSA9IGFzeW5jICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IFt0cGxzLCBpdGVtc10gPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgICAgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgdGVtcGxhdGVzOiBhbnlbXSB9PignL2l0ZW1zL3RlbXBsYXRlcycpLFxuICAgICAgICAgIE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IGl0ZW1zOiBhbnlbXSB9PignL2l0ZW1zJyksXG4gICAgICAgIF0pO1xuICAgICAgICB0aGlzLnRlbXBsYXRlcyA9IHRwbHMudGVtcGxhdGVzIHx8IFtdO1xuICAgICAgICB0aGlzLmludmVudG9yeSA9IGl0ZW1zLml0ZW1zIHx8IFtdO1xuICAgICAgICByZW5kZXJUZW1wbGF0ZU9wdGlvbnMoKTtcbiAgICAgICAgcmVuZGVySW52ZW50b3J5KCk7XG4gICAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgICAgbG9nKGU/Lm1lc3NhZ2UgfHwgJ1x1NTJBMFx1OEY3RFx1NkEyMVx1Njc3Ri9cdTRFRDNcdTVFOTNcdTU5MzFcdThEMjUnKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgcmVmcmVzaCA9IGFzeW5jIChvcHRzOiB7IHF1aWV0PzogYm9vbGVhbiB9ID0ge30pID0+IHtcbiAgICAgIGlmIChyZWZyZXNoaW5nKSByZXR1cm47XG4gICAgICByZWZyZXNoaW5nID0gdHJ1ZTtcbiAgICAgIGlmICghb3B0cy5xdWlldCkgeyByZWZyZXNoQnRuLmlubmVySFRNTCA9ICc8c3BhbiBkYXRhLWljbz1cInJlZnJlc2hcIj48L3NwYW4+XHU1MjM3XHU2NUIwXHU0RTJEXHUyMDI2JzsgbW91bnRJY29ucyhyZWZyZXNoQnRuKTsgfVxuICAgICAgcmVmcmVzaEJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCB0cGxJZCA9IHF1ZXJ5VHBsLnZhbHVlO1xuICAgICAgICBjb25zdCB0eXBlID0gcXVlcnlUeXBlLnZhbHVlIGFzICdidXknIHwgJ3NlbGwnO1xuICAgICAgICBjb25zdCBtaW5lT25seSA9IHF1ZXJ5TWluZU9ubHkuY2hlY2tlZDtcbiAgICAgICAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcygpO1xuICAgICAgICBwYXJhbXMuc2V0KCd0eXBlJywgdHlwZSk7XG4gICAgICAgIHBhcmFtcy5zZXQoJ2l0ZW1fdGVtcGxhdGVfaWQnLCB0cGxJZCB8fCAnJyk7XG4gICAgICAgIGlmICghb3B0cy5xdWlldCkge1xuICAgICAgICAgIGJvb2suaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIGJvb2suYXBwZW5kQ2hpbGQoaHRtbCgnPGRpdiBjbGFzcz1cInNrZWxldG9uXCI+PC9kaXY+JykpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyBvcmRlcnM6IE9yZGVyW10gfT4oYC9leGNoYW5nZS9vcmRlcnM/JHtwYXJhbXMudG9TdHJpbmcoKX1gKTtcbiAgICAgICAgY29uc3QgbmV3SWRzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgICAgIGJvb2suaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIGNvbnN0IG9yZGVycyA9IGRhdGEub3JkZXJzIHx8IFtdO1xuICAgICAgICBpZiAoIW9yZGVycy5sZW5ndGgpIHtcbiAgICAgICAgICBib29rLmFwcGVuZENoaWxkKGh0bWwoJzxkaXYgc3R5bGU9XCJvcGFjaXR5Oi44O3RleHQtYWxpZ246Y2VudGVyO1wiPlx1NjY4Mlx1NjVFMFx1OEJBMlx1NTM1NTwvZGl2PicpKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IG9yZGVyIG9mIG9yZGVycykge1xuICAgICAgICAgIGlmIChtaW5lT25seSAmJiBtZSAmJiBvcmRlci51c2VySWQgIT09IG1lLmlkKSBjb250aW51ZTtcbiAgICAgICAgICBuZXdJZHMuYWRkKG9yZGVyLmlkKTtcbiAgICAgICAgICBjb25zdCBpc01pbmUgPSBtZSAmJiBvcmRlci51c2VySWQgPT09IG1lLmlkO1xuICAgICAgICAgIGNvbnN0IGtsYXNzID0gYGxpc3QtaXRlbSAke29yZGVyLnR5cGUgPT09ICdidXknID8gJ2xpc3QtaXRlbS0tYnV5JyA6ICdsaXN0LWl0ZW0tLXNlbGwnfWA7XG4gICAgICAgICAgY29uc3Qgcm93ID0gaHRtbChgXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiJHtrbGFzc31cIj5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cImRpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjJweDtcIj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgPHN0cm9uZz4ke29yZGVyLnR5cGUgPT09ICdidXknID8gJ1x1NEU3MFx1NTE2NScgOiAnXHU1MzU2XHU1MUZBJ308L3N0cm9uZz5cbiAgICAgICAgICAgICAgICAgICR7b3JkZXIuaXRlbVRlbXBsYXRlSWQgfHwgJyd9XG4gICAgICAgICAgICAgICAgICAke2lzTWluZSA/ICc8c3BhbiBjbGFzcz1cInBpbGxcIj5cdTYyMTFcdTc2ODQ8L3NwYW4+JyA6ICcnfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJvcGFjaXR5Oi44NTtcIj5cbiAgICAgICAgICAgICAgICAgIFx1NEVGN1x1NjgzQzogJHtvcmRlci5wcmljZX0gXHUwMEI3IFx1NjU3MFx1OTFDRjogJHtvcmRlci5hbW91bnR9XG4gICAgICAgICAgICAgICAgICAke29yZGVyLml0ZW1JbnN0YW5jZUlkID8gYDxzcGFuIGNsYXNzPVwicGlsbFwiPiR7b3JkZXIuaXRlbUluc3RhbmNlSWR9PC9zcGFuPmAgOiAnJ31cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicGlsbFwiPiR7b3JkZXIuaWR9PC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAke2lzTWluZSA/IGA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1naG9zdFwiIGRhdGEtaWQ9XCIke29yZGVyLmlkfVwiPjxzcGFuIGRhdGEtaWNvPVwidHJhc2hcIj48L3NwYW4+XHU2NEE0XHU1MzU1PC9idXR0b24+YCA6ICcnfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIGApO1xuICAgICAgICAgIG1vdW50SWNvbnMocm93KTtcbiAgICAgICAgICBpZiAoIXByZXZJZHMuaGFzKG9yZGVyLmlkKSkgcm93LmNsYXNzTGlzdC5hZGQoJ2ZsYXNoJyk7XG4gICAgICAgICAgcm93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKGV2KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBldi50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgICAgICBjb25zdCBpZCA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnKTtcbiAgICAgICAgICAgIGlmICghaWQpIHJldHVybjtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHRhcmdldC5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJ3RydWUnKTtcbiAgICAgICAgICAgICAgYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0KGAvZXhjaGFuZ2Uvb3JkZXJzLyR7aWR9YCwgeyBtZXRob2Q6ICdERUxFVEUnIH0pO1xuICAgICAgICAgICAgICBzaG93VG9hc3QoJ1x1NjRBNFx1NTM1NVx1NjIxMFx1NTI5RicsICdzdWNjZXNzJyk7XG4gICAgICAgICAgICAgIGF3YWl0IHJlZnJlc2goKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgICAgICAgICBzaG93VG9hc3QoZT8ubWVzc2FnZSB8fCAnXHU2NEE0XHU1MzU1XHU1OTMxXHU4RDI1JywgJ2Vycm9yJyk7XG4gICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICB0YXJnZXQucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGJvb2suYXBwZW5kQ2hpbGQocm93KTtcbiAgICAgICAgfVxuICAgICAgICBwcmV2SWRzID0gbmV3SWRzO1xuICAgICAgICBpZiAoIWJvb2suY2hpbGRFbGVtZW50Q291bnQpIHtcbiAgICAgICAgICBib29rLmFwcGVuZENoaWxkKGh0bWwoJzxkaXYgc3R5bGU9XCJvcGFjaXR5Oi44O3RleHQtYWxpZ246Y2VudGVyO1wiPlx1NjY4Mlx1NjVFMFx1N0IyNlx1NTQwOFx1Njc2MVx1NEVGNlx1NzY4NFx1OEJBMlx1NTM1NTwvZGl2PicpKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgIGxvZyhlPy5tZXNzYWdlIHx8ICdcdTUyMzdcdTY1QjBcdThCQTJcdTUzNTVcdTU5MzFcdThEMjUnKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHJlZnJlc2hpbmcgPSBmYWxzZTtcbiAgICAgICAgcmVmcmVzaEJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICByZWZyZXNoQnRuLmlubmVySFRNTCA9ICc8c3BhbiBkYXRhLWljbz1cInJlZnJlc2hcIj48L3NwYW4+XHU1MjM3XHU2NUIwJztcbiAgICAgICAgbW91bnRJY29ucyhyZWZyZXNoQnRuKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcGxhY2VCdXkub25jbGljayA9IGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHRwbElkID0gYnV5VHBsLnZhbHVlLnRyaW0oKTtcbiAgICAgIGNvbnN0IHByaWNlID0gTnVtYmVyKGJ1eVByaWNlLnZhbHVlKTtcbiAgICAgIGNvbnN0IGFtb3VudCA9IE51bWJlcihidXlBbW91bnQudmFsdWUpO1xuICAgICAgaWYgKCF0cGxJZCkge1xuICAgICAgICBzaG93VG9hc3QoJ1x1OEJGN1x1OTAwOVx1NjJFOVx1OEQyRFx1NEU3MFx1NzY4NFx1NkEyMVx1Njc3RicsICd3YXJuJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChwcmljZSA8PSAwIHx8IGFtb3VudCA8PSAwKSB7XG4gICAgICAgIHNob3dUb2FzdCgnXHU4QkY3XHU4RjkzXHU1MTY1XHU2NzA5XHU2NTQ4XHU3Njg0XHU0RUY3XHU2ODNDXHU0RTBFXHU2NTcwXHU5MUNGJywgJ3dhcm4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcGxhY2VCdXkuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgcGxhY2VCdXkudGV4dENvbnRlbnQgPSAnXHU2M0QwXHU0RUE0XHU0RTJEXHUyMDI2JztcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IGlkOiBzdHJpbmcgfT4oJy9leGNoYW5nZS9vcmRlcnMnLCB7XG4gICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyB0eXBlOiAnYnV5JywgaXRlbV90ZW1wbGF0ZV9pZDogdHBsSWQsIHByaWNlLCBhbW91bnQgfSksXG4gICAgICAgIH0pO1xuICAgICAgICBzaG93VG9hc3QoYFx1NEU3MFx1NTM1NVx1NURGMlx1NjNEMFx1NEVBNCAoIyR7cmVzLmlkfSlgLCAnc3VjY2VzcycpO1xuICAgICAgICBsb2coYFx1NEU3MFx1NTM1NVx1NjIxMFx1NTI5RjogJHtyZXMuaWR9YCk7XG4gICAgICAgIGF3YWl0IGJhci51cGRhdGUoKTtcbiAgICAgICAgYXdhaXQgcmVmcmVzaCgpO1xuICAgICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgIHNob3dUb2FzdChlPy5tZXNzYWdlIHx8ICdcdTRFNzBcdTUzNTVcdTYzRDBcdTRFQTRcdTU5MzFcdThEMjUnLCAnZXJyb3InKTtcbiAgICAgICAgbG9nKGU/Lm1lc3NhZ2UgfHwgJ1x1NEU3MFx1NTM1NVx1NjNEMFx1NEVBNFx1NTkzMVx1OEQyNScpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgcGxhY2VCdXkuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgcGxhY2VCdXkudGV4dENvbnRlbnQgPSAnXHU0RTBCXHU0RTcwXHU1MzU1JztcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcGxhY2VTZWxsLm9uY2xpY2sgPSBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBpbnN0SWQgPSBzZWxsSW5zdC52YWx1ZS50cmltKCk7XG4gICAgICBjb25zdCBwcmljZSA9IE51bWJlcihzZWxsUHJpY2UudmFsdWUpO1xuICAgICAgaWYgKCFpbnN0SWQpIHtcbiAgICAgICAgc2hvd1RvYXN0KCdcdThCRjdcdTkwMDlcdTYyRTlcdTg5ODFcdTUxRkFcdTU1MkVcdTc2ODRcdTkwNTNcdTUxNzcnLCAnd2FybicpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAocHJpY2UgPD0gMCkge1xuICAgICAgICBzaG93VG9hc3QoJ1x1OEJGN1x1OEY5M1x1NTE2NVx1NjcwOVx1NjU0OFx1NzY4NFx1NEVGN1x1NjgzQycsICd3YXJuJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHBsYWNlU2VsbC5kaXNhYmxlZCA9IHRydWU7XG4gICAgICBwbGFjZVNlbGwudGV4dENvbnRlbnQgPSAnXHU2M0QwXHU0RUE0XHU0RTJEXHUyMDI2JztcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IGlkOiBzdHJpbmcgfT4oJy9leGNoYW5nZS9vcmRlcnMnLCB7XG4gICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyB0eXBlOiAnc2VsbCcsIGl0ZW1faW5zdGFuY2VfaWQ6IGluc3RJZCwgcHJpY2UgfSksXG4gICAgICAgIH0pO1xuICAgICAgICBzaG93VG9hc3QoYFx1NTM1Nlx1NTM1NVx1NURGMlx1NjNEMFx1NEVBNCAoIyR7cmVzLmlkfSlgLCAnc3VjY2VzcycpO1xuICAgICAgICBsb2coYFx1NTM1Nlx1NTM1NVx1NjIxMFx1NTI5RjogJHtyZXMuaWR9YCk7XG4gICAgICAgIGF3YWl0IGJhci51cGRhdGUoKTtcbiAgICAgICAgYXdhaXQgbG9hZE1ldGFkYXRhKCk7XG4gICAgICAgIGF3YWl0IHJlZnJlc2goKTtcbiAgICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgICBzaG93VG9hc3QoZT8ubWVzc2FnZSB8fCAnXHU1MzU2XHU1MzU1XHU2M0QwXHU0RUE0XHU1OTMxXHU4RDI1JywgJ2Vycm9yJyk7XG4gICAgICAgIGxvZyhlPy5tZXNzYWdlIHx8ICdcdTUzNTZcdTUzNTVcdTYzRDBcdTRFQTRcdTU5MzFcdThEMjUnKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHBsYWNlU2VsbC5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICBwbGFjZVNlbGwudGV4dENvbnRlbnQgPSAnXHU0RTBCXHU1MzU2XHU1MzU1JztcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmVmcmVzaEJ0bi5vbmNsaWNrID0gKCkgPT4gcmVmcmVzaCgpO1xuICAgIHF1ZXJ5VHBsLm9uY2hhbmdlID0gKCkgPT4gcmVmcmVzaCgpO1xuICAgIHF1ZXJ5VHlwZS5vbmNoYW5nZSA9ICgpID0+IHJlZnJlc2goKTtcbiAgICBxdWVyeU1pbmVPbmx5Lm9uY2hhbmdlID0gKCkgPT4geyBpZiAobWluZU9ubHlMYWJlbCkgbWluZU9ubHlMYWJlbC5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnLCBxdWVyeU1pbmVPbmx5LmNoZWNrZWQpOyByZWZyZXNoKCk7IH07XG4gICAgaWYgKG1pbmVPbmx5TGFiZWwpIG1pbmVPbmx5TGFiZWwuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJywgcXVlcnlNaW5lT25seS5jaGVja2VkKTtcblxuICAgIGF3YWl0IFByb21pc2UuYWxsKFtiYXIudXBkYXRlKCksIGxvYWRNZXRhZGF0YSgpXSk7XG4gICAgYXdhaXQgcmVmcmVzaCh7IHF1aWV0OiB0cnVlIH0pO1xuICAgIHRoaXMucmVmcmVzaFRpbWVyID0gd2luZG93LnNldEludGVydmFsKCgpID0+IHtcbiAgICAgIHJlZnJlc2goeyBxdWlldDogdHJ1ZSB9KS5jYXRjaCgoKSA9PiB7fSk7XG4gICAgfSwgMTAwMDApO1xuICB9XG5cbiAgcHJpdmF0ZSBjbGVhclRpbWVyKCkge1xuICAgIGlmICh0aGlzLnJlZnJlc2hUaW1lciAhPT0gbnVsbCkge1xuICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5yZWZyZXNoVGltZXIpO1xuICAgICAgdGhpcy5yZWZyZXNoVGltZXIgPSBudWxsO1xuICAgIH1cbiAgfVxufVxuIiwgImltcG9ydCB7IE5ldHdvcmtNYW5hZ2VyIH0gZnJvbSAnLi4vY29yZS9OZXR3b3JrTWFuYWdlcic7XG5pbXBvcnQgeyBodG1sLCBxcyB9IGZyb20gJy4uL3V0aWxzL2RvbSc7XG5pbXBvcnQgeyByZW5kZXJOYXYgfSBmcm9tICcuLi9jb21wb25lbnRzL05hdic7XG5pbXBvcnQgeyBSZWFsdGltZUNsaWVudCB9IGZyb20gJy4uL2NvcmUvUmVhbHRpbWVDbGllbnQnO1xuaW1wb3J0IHsgcmVuZGVyUmVzb3VyY2VCYXIgfSBmcm9tICcuLi9jb21wb25lbnRzL1Jlc291cmNlQmFyJztcbmltcG9ydCB7IHJlbmRlckljb24gfSBmcm9tICcuLi9jb21wb25lbnRzL0ljb24nO1xuXG5leHBvcnQgY2xhc3MgUmFua2luZ1NjZW5lIHtcbiAgbW91bnQocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICByb290LmlubmVySFRNTCA9ICcnO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQocmVuZGVyTmF2KCdyYW5raW5nJykpO1xuICAgIGNvbnN0IGJhciA9IHJlbmRlclJlc291cmNlQmFyKCk7XG4gICAgcm9vdC5hcHBlbmRDaGlsZChiYXIucm9vdCk7XG5cbiAgICBjb25zdCB2aWV3ID0gaHRtbChgXG4gICAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCIgc3R5bGU9XCJjb2xvcjojZmZmO1wiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZCBmYWRlLWluXCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiIHN0eWxlPVwianVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YWxpZ24taXRlbXM6Y2VudGVyO1wiPlxuICAgICAgICAgICAgPGgzIHN0eWxlPVwibWFyZ2luOjA7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6OHB4O1wiPjxzcGFuIGRhdGEtaWNvPVwidHJvcGh5XCI+PC9zcGFuPlx1NjM5Mlx1ODg0Q1x1Njk5QzwvaDM+XG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwicmVmcmVzaFwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCI+PHNwYW4gZGF0YS1pY289XCJyZWZyZXNoXCI+PC9zcGFuPlx1NTIzN1x1NjVCMDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgaWQ9XCJtZVwiIHN0eWxlPVwibWFyZ2luLXRvcDo4cHg7b3BhY2l0eTouOTU7XCI+PC9kaXY+XG4gICAgICAgICAgPGRpdiBpZD1cImxpc3RcIiBzdHlsZT1cIm1hcmdpbi10b3A6MTJweDtkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDo2cHg7XCI+PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgYCk7XG4gICAgcm9vdC5hcHBlbmRDaGlsZCh2aWV3KTtcblxuICAgIGNvbnN0IHRva2VuID0gKE5ldHdvcmtNYW5hZ2VyIGFzIGFueSkuSVsndG9rZW4nXTtcbiAgICBpZiAodG9rZW4pIFJlYWx0aW1lQ2xpZW50LkkuY29ubmVjdCh0b2tlbik7XG5cbiAgICBjb25zdCBtZUJveCA9IHFzKHZpZXcsICcjbWUnKTtcbiAgICBjb25zdCBsaXN0ID0gcXModmlldywgJyNsaXN0Jyk7XG4gICAgY29uc3QgcmVmcmVzaEJ0biA9IHFzPEhUTUxCdXR0b25FbGVtZW50Pih2aWV3LCAnI3JlZnJlc2gnKTtcbiAgICBjb25zdCBtb3VudEljb25zID0gKHJvb3RFbDogRWxlbWVudCkgPT4ge1xuICAgICAgcm9vdEVsLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWljb10nKVxuICAgICAgICAuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgICBjb25zdCBuYW1lID0gKGVsIGFzIEhUTUxFbGVtZW50KS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWNvJykgYXMgYW55O1xuICAgICAgICAgIHRyeSB7IGVsLmFwcGVuZENoaWxkKHJlbmRlckljb24obmFtZSwgeyBzaXplOiAyMCB9KSk7IH0gY2F0Y2gge31cbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBtb3VudEljb25zKHZpZXcpO1xuXG4gICAgY29uc3QgbG9hZCA9IGFzeW5jICgpID0+IHtcbiAgICAgIHJlZnJlc2hCdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgcmVmcmVzaEJ0bi5pbm5lckhUTUwgPSAnPHNwYW4gZGF0YS1pY289XCJyZWZyZXNoXCI+PC9zcGFuPlx1NTIzN1x1NjVCMFx1NEUyRFx1MjAyNic7XG4gICAgICBtb3VudEljb25zKHJlZnJlc2hCdG4pO1xuICAgICAgYXdhaXQgYmFyLnVwZGF0ZSgpO1xuICAgICAgbGlzdC5pbm5lckhUTUwgPSAnJztcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSBsaXN0LmFwcGVuZENoaWxkKGh0bWwoJzxkaXYgY2xhc3M9XCJza2VsZXRvblwiPjwvZGl2PicpKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IG1lID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgcmFuazogbnVtYmVyOyBzY29yZTogbnVtYmVyIH0+KCcvcmFua2luZy9tZScpO1xuICAgICAgICBjb25zdCB0b3AgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyBsaXN0OiBhbnlbXSB9PignL3JhbmtpbmcvdG9wP249MjAnKTtcbiAgICAgICAgbWVCb3gudGV4dENvbnRlbnQgPSBgXHU2MjExXHU3Njg0XHU1NDBEXHU2QjIxXHVGRjFBIyR7bWUucmFua30gXHUwMEI3IFx1NjAzQlx1NUY5N1x1NTIwNlx1RkYxQSR7bWUuc2NvcmV9YDtcbiAgICAgICAgbGlzdC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgZm9yIChjb25zdCBlbnRyeSBvZiB0b3AubGlzdCkge1xuICAgICAgICAgIGNvbnN0IG1lZGFsID0gZW50cnkucmFuayA9PT0gMSA/ICdcdUQ4M0VcdURENDcnIDogZW50cnkucmFuayA9PT0gMiA/ICdcdUQ4M0VcdURENDgnIDogZW50cnkucmFuayA9PT0gMyA/ICdcdUQ4M0VcdURENDknIDogJyc7XG4gICAgICAgICAgY29uc3QgY2xzID0gZW50cnkucmFuayA8PSAzID8gJyBsaXN0LWl0ZW0tLWJ1eScgOiAnJztcbiAgICAgICAgICBjb25zdCByb3cgPSBodG1sKGBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsaXN0LWl0ZW0ke2Nsc31cIj5cbiAgICAgICAgICAgICAgPHNwYW4+JHttZWRhbH0gIyR7ZW50cnkucmFua308L3NwYW4+XG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPVwiZmxleDoxO29wYWNpdHk6Ljk7bWFyZ2luLWxlZnQ6MTJweDtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo2cHg7XCI+PHNwYW4gZGF0YS1pY289XCJ1c2VyXCI+PC9zcGFuPiR7ZW50cnkudXNlcklkfTwvc3Bhbj5cbiAgICAgICAgICAgICAgPHN0cm9uZz4ke2VudHJ5LnNjb3JlfTwvc3Ryb25nPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgYCk7XG4gICAgICAgICAgbW91bnRJY29ucyhyb3cpO1xuICAgICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQocm93KTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgIG1lQm94LnRleHRDb250ZW50ID0gZT8ubWVzc2FnZSB8fCAnXHU2MzkyXHU4ODRDXHU2OTlDXHU1MkEwXHU4RjdEXHU1OTMxXHU4RDI1JztcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHJlZnJlc2hCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgcmVmcmVzaEJ0bi5pbm5lckhUTUwgPSAnPHNwYW4gZGF0YS1pY289XCJyZWZyZXNoXCI+PC9zcGFuPlx1NTIzN1x1NjVCMCc7XG4gICAgICAgIG1vdW50SWNvbnMocmVmcmVzaEJ0bik7XG4gICAgICB9XG4gICAgfTtcbiAgICByZWZyZXNoQnRuLm9uY2xpY2sgPSAoKSA9PiBsb2FkKCk7XG4gICAgbG9hZCgpO1xuICB9XG59XG4iLCAibGV0IGluamVjdGVkID0gZmFsc2U7XG5cbmV4cG9ydCBmdW5jdGlvbiBlbnN1cmVHbG9iYWxTdHlsZXMoKSB7XG4gIGlmIChpbmplY3RlZCkgcmV0dXJuO1xuICBjb25zdCBjc3MgPSBgOnJvb3R7LS1iZzojMGIxMDIwOy0tYmctMjojMGYxNTMwOy0tZmc6I2ZmZjstLW11dGVkOnJnYmEoMjU1LDI1NSwyNTUsLjc1KTstLWdyYWQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZywjN0IyQ0Y1LCMyQzg5RjUpOy0tcGFuZWwtZ3JhZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLHJnYmEoMTIzLDQ0LDI0NSwuMjUpLHJnYmEoNDQsMTM3LDI0NSwuMjUpKTstLWdsYXNzOmJsdXIoMTBweCk7LS1nbG93OjAgOHB4IDIwcHggcmdiYSgwLDAsMCwuMzUpLDAgMCAxMnB4IHJnYmEoMTIzLDQ0LDI0NSwuNyk7LS1yYWRpdXMtc206MTBweDstLXJhZGl1cy1tZDoxMnB4Oy0tcmFkaXVzLWxnOjE2cHg7LS1lYXNlOmN1YmljLWJlemllciguMjIsLjYxLC4zNiwxKTstLWR1cjouMjhzOy0tYnV5OiMyQzg5RjU7LS1zZWxsOiNFMzY0MTQ7LS1vazojMmVjMjdlOy0td2FybjojZjZjNDQ1Oy0tZGFuZ2VyOiNmZjVjNWM7LS1yYXJpdHktY29tbW9uOiM5YWEwYTY7LS1yYXJpdHktcmFyZTojNGZkNGY1Oy0tcmFyaXR5LWVwaWM6I2IyNmJmZjstLXJhcml0eS1sZWdlbmRhcnk6I2Y2YzQ0NX1cbmh0bWwsYm9keXtiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudCgxMjAwcHggNjAwcHggYXQgNTAlIC0xMCUsIHJnYmEoMTIzLDQ0LDI0NSwuMTUpLCB0cmFuc3BhcmVudCksdmFyKC0tYmcpO2NvbG9yOnZhcigtLWZnKTtmb250LWZhbWlseTpzeXN0ZW0tdWksLWFwcGxlLXN5c3RlbSxcIlNlZ29lIFVJXCIsXCJQaW5nRmFuZyBTQ1wiLFwiTWljcm9zb2Z0IFlhSGVpXCIsQXJpYWwsc2Fucy1zZXJpZn1cbmh0bWx7Y29sb3Itc2NoZW1lOmRhcmt9XG4uY29udGFpbmVye3BhZGRpbmc6MCAxMnB4fVxuLmNvbnRhaW5lcnttYXgtd2lkdGg6NjgwcHg7bWFyZ2luOjEycHggYXV0b31cbi5jYXJke2JvcmRlci1yYWRpdXM6dmFyKC0tcmFkaXVzLWxnKTtiYWNrZ3JvdW5kOnZhcigtLXBhbmVsLWdyYWQpO2JhY2tkcm9wLWZpbHRlcjp2YXIoLS1nbGFzcyk7Ym94LXNoYWRvdzp2YXIoLS1nbG93KTtwYWRkaW5nOjEycHh9XG4ucm93e2Rpc3BsYXk6ZmxleDtnYXA6OHB4O2FsaWduLWl0ZW1zOmNlbnRlcn1cbi5jYXJkIGlucHV0LC5jYXJkIGJ1dHRvbntib3gtc2l6aW5nOmJvcmRlci1ib3g7b3V0bGluZTpub25lfVxuLmNhcmQgaW5wdXR7YmFja2dyb3VuZDpyZ2JhKDI1NSwyNTUsMjU1LC4wOCk7Ym9yZGVyOjA7Ym9yZGVyLXJhZGl1czp2YXIoLS1yYWRpdXMtbWQpO2NvbG9yOnZhcigtLWZnKTtwYWRkaW5nOjEwcHg7bWFyZ2luOjhweCAwO2FwcGVhcmFuY2U6bm9uZTstd2Via2l0LWFwcGVhcmFuY2U6bm9uZTtiYWNrZ3JvdW5kLWNsaXA6cGFkZGluZy1ib3h9XG4uY2FyZCBzZWxlY3QuaW5wdXQsIHNlbGVjdC5pbnB1dHtiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjA4KTtjb2xvcjp2YXIoLS1mZyk7Ym9yZGVyOjA7Ym9yZGVyLXJhZGl1czp2YXIoLS1yYWRpdXMtbWQpO3BhZGRpbmc6MTBweDttYXJnaW46OHB4IDA7YXBwZWFyYW5jZTpub25lOy13ZWJraXQtYXBwZWFyYW5jZTpub25lO2JhY2tncm91bmQtY2xpcDpwYWRkaW5nLWJveH1cbi5jYXJkIHNlbGVjdC5pbnB1dCBvcHRpb24sIHNlbGVjdC5pbnB1dCBvcHRpb257YmFja2dyb3VuZDojMGIxMDIwO2NvbG9yOiNmZmZ9XG4uY2FyZCBzZWxlY3QuaW5wdXQ6Zm9jdXMsIHNlbGVjdC5pbnB1dDpmb2N1c3tvdXRsaW5lOjJweCBzb2xpZCByZ2JhKDEyMyw0NCwyNDUsLjQ1KX1cbi5jYXJkIGJ1dHRvbnt3aWR0aDoxMDAlO2JvcmRlci1yYWRpdXM6dmFyKC0tcmFkaXVzLW1kKX1cbi5idG57cGFkZGluZzoxMHB4IDE0cHg7Ym9yZGVyOjA7Ym9yZGVyLXJhZGl1czp2YXIoLS1yYWRpdXMtbWQpO2NvbG9yOiNmZmY7dHJhbnNpdGlvbjp0cmFuc2Zvcm0gdmFyKC0tZHVyKSB2YXIoLS1lYXNlKSxib3gtc2hhZG93IHZhcigtLWR1cikgdmFyKC0tZWFzZSl9XG4uYnRuIC5pY29ue21hcmdpbi1yaWdodDo2cHh9XG4uYnRuOmFjdGl2ZXt0cmFuc2Zvcm06dHJhbnNsYXRlWSgxcHgpIHNjYWxlKC45OSl9XG4uYnRuLXByaW1hcnl7YmFja2dyb3VuZDp2YXIoLS1ncmFkKTtib3gtc2hhZG93OnZhcigtLWdsb3cpfVxuLmJ0bi1idXl7YmFja2dyb3VuZDp2YXIoLS1idXkpfVxuLmJ0bi1zZWxse2JhY2tncm91bmQ6dmFyKC0tc2VsbCl9XG4uYnRuLWdob3N0e2JhY2tncm91bmQ6cmdiYSgyNTUsMjU1LDI1NSwuMDgpfVxuLmlucHV0e3dpZHRoOjEwMCU7cGFkZGluZzoxMHB4O2JvcmRlcjowO2JvcmRlci1yYWRpdXM6dmFyKC0tcmFkaXVzLW1kKTtiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjA4KTtjb2xvcjp2YXIoLS1mZyl9XG4ucGlsbHtwYWRkaW5nOjJweCA4cHg7Ym9yZGVyLXJhZGl1czo5OTlweDtiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjA4KTtmb250LXNpemU6MTJweDtjdXJzb3I6cG9pbnRlcn1cbi5waWxsLmFjdGl2ZXtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcsIHJnYmEoMTIzLDQ0LDI0NSwuMzUpLCByZ2JhKDQ0LDEzNywyNDUsLjI4KSk7Ym94LXNoYWRvdzp2YXIoLS1nbG93KX1cbi5zY2VuZS1oZWFkZXJ7ZGlzcGxheTpmbGV4O2p1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2FsaWduLWl0ZW1zOmZsZXgtZW5kO2dhcDoxMnB4O21hcmdpbi1ib3R0b206OHB4fVxuLnNjZW5lLWhlYWRlciBoMXttYXJnaW46MDtmb250LXNpemU6MjBweH1cbi5zY2VuZS1oZWFkZXIgcHttYXJnaW46MDtvcGFjaXR5Oi44NX1cbi5zdGF0c3tkaXNwbGF5OmZsZXg7Z2FwOjEwcHh9XG4uc3RhdHtmbGV4OjE7bWluLXdpZHRoOjA7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTgwZGVnLHJnYmEoMjU1LDI1NSwyNTUsLjA2KSxyZ2JhKDI1NSwyNTUsMjU1LC4wMykpO2JvcmRlci1yYWRpdXM6MTJweDtwYWRkaW5nOjEwcHg7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6MTBweH1cbi5zdGF0IC5pY297Zm9udC1zaXplOjE4cHg7ZmlsdGVyOmRyb3Atc2hhZG93KDAgMCA4cHggcmdiYSgxMjMsNDQsMjQ1LC4zNSkpfVxuLnN0YXQgLnZhbHtmb250LXdlaWdodDo3MDA7Zm9udC1zaXplOjE2cHh9XG4uc3RhdCAubGFiZWx7b3BhY2l0eTouODU7Zm9udC1zaXplOjEycHh9XG4uZXZlbnQtZmVlZHttYXgtaGVpZ2h0OjI0MHB4O292ZXJmbG93OmF1dG87ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6NnB4fVxuLmV2ZW50LWZlZWQgLmV2ZW50e29wYWNpdHk6Ljk7Zm9udC1mYW1pbHk6bW9ub3NwYWNlO2ZvbnQtc2l6ZToxMnB4fVxuLmZhZGUtaW57YW5pbWF0aW9uOmZhZGUtaW4gLjNzIHZhcigtLWVhc2UpfVxuQGtleWZyYW1lcyBmYWRlLWlue2Zyb217b3BhY2l0eTowO3RyYW5zZm9ybTp0cmFuc2xhdGVZKDRweCl9dG97b3BhY2l0eToxO3RyYW5zZm9ybTpub25lfX1cbi5mbGFzaHthbmltYXRpb246Zmxhc2ggLjlzIGVhc2V9XG5Aa2V5ZnJhbWVzIGZsYXNoezAle2JveC1zaGFkb3c6MCAwIDAgcmdiYSgyNTUsMjU1LDI1NSwwKX00MCV7Ym94LXNoYWRvdzowIDAgMCA2cHggcmdiYSgyNTUsMjU1LDI1NSwuMTUpfTEwMCV7Ym94LXNoYWRvdzowIDAgMCByZ2JhKDI1NSwyNTUsMjU1LDApfX1cbi5za2VsZXRvbntwb3NpdGlvbjpyZWxhdGl2ZTtvdmVyZmxvdzpoaWRkZW47YmFja2dyb3VuZDpyZ2JhKDI1NSwyNTUsMjU1LC4wOCk7Ym9yZGVyLXJhZGl1czp2YXIoLS1yYWRpdXMtbWQpO2hlaWdodDo0NHB4fVxuLnNrZWxldG9uOjphZnRlcntjb250ZW50OlwiXCI7cG9zaXRpb246YWJzb2x1dGU7aW5zZXQ6MDt0cmFuc2Zvcm06dHJhbnNsYXRlWCgtMTAwJSk7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoOTBkZWcsdHJhbnNwYXJlbnQscmdiYSgyNTUsMjU1LDI1NSwuMTIpLHRyYW5zcGFyZW50KTthbmltYXRpb246c2hpbW1lciAxLjJzIGluZmluaXRlfVxuQGtleWZyYW1lcyBzaGltbWVyezEwMCV7dHJhbnNmb3JtOnRyYW5zbGF0ZVgoMTAwJSl9fVxuLmxpc3QtaXRlbXtkaXNwbGF5OmZsZXg7Z2FwOjhweDthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YmFja2dyb3VuZDpyZ2JhKDI1NSwyNTUsMjU1LC4wNik7Ym9yZGVyLXJhZGl1czp2YXIoLS1yYWRpdXMtbWQpO3BhZGRpbmc6MTBweH1cbi5saXN0LWl0ZW0tLWJ1eXtib3JkZXItbGVmdDozcHggc29saWQgdmFyKC0tYnV5KX1cbi5saXN0LWl0ZW0tLXNlbGx7Ym9yZGVyLWxlZnQ6M3B4IHNvbGlkIHZhcigtLXNlbGwpfVxuLm5hdnttYXgtd2lkdGg6NDgwcHg7bWFyZ2luOjEycHggYXV0byAwO2Rpc3BsYXk6ZmxleDtnYXA6OHB4O2ZsZXgtd3JhcDp3cmFwO3Bvc2l0aW9uOnN0aWNreTt0b3A6MDt6LWluZGV4OjEwfVxuLm5hdiBhe2ZsZXg6MTtkaXNwbGF5OmZsZXg7anVzdGlmeS1jb250ZW50OmNlbnRlcjthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjZweDt0ZXh0LWFsaWduOmNlbnRlcjtwYWRkaW5nOjEwcHg7Ym9yZGVyLXJhZGl1czo5OTlweDt0ZXh0LWRlY29yYXRpb246bm9uZTtjb2xvcjojZmZmfVxuLm5hdiBhIC5pY297b3BhY2l0eTouOTV9XG4ubmF2IGEuYWN0aXZle2JhY2tncm91bmQ6dmFyKC0tZ3JhZCk7Ym94LXNoYWRvdzp2YXIoLS1nbG93KX1cbi8qIGdlbmVyaWMgaWNvbiAqL1xuLmljb257ZGlzcGxheTppbmxpbmUtYmxvY2s7bGluZS1oZWlnaHQ6MDt2ZXJ0aWNhbC1hbGlnbjptaWRkbGV9XG4uaWNvbiBzdmd7ZGlzcGxheTpibG9jaztmaWx0ZXI6ZHJvcC1zaGFkb3coMCAwIDhweCByZ2JhKDEyMyw0NCwyNDUsLjM1KSl9XG4vKiByYXJpdHkgYmFkZ2VzICovXG4uYmFkZ2V7ZGlzcGxheTppbmxpbmUtZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjZweDtwYWRkaW5nOjJweCA4cHg7Ym9yZGVyLXJhZGl1czo5OTlweDtmb250LXNpemU6MTJweDtsaW5lLWhlaWdodDoxO2JvcmRlcjoxcHggc29saWQgcmdiYSgyNTUsMjU1LDI1NSwuMTIpO2JhY2tncm91bmQ6cmdiYSgyNTUsMjU1LDI1NSwuMDYpfVxuLmJhZGdlIGl7ZGlzcGxheTppbmxpbmUtYmxvY2s7d2lkdGg6OHB4O2hlaWdodDo4cHg7Ym9yZGVyLXJhZGl1czo5OTlweH1cbi5iYWRnZS5yYXJpdHktY29tbW9uIGl7YmFja2dyb3VuZDp2YXIoLS1yYXJpdHktY29tbW9uKX1cbi5iYWRnZS5yYXJpdHktcmFyZSBpe2JhY2tncm91bmQ6dmFyKC0tcmFyaXR5LXJhcmUpfVxuLmJhZGdlLnJhcml0eS1lcGljIGl7YmFja2dyb3VuZDp2YXIoLS1yYXJpdHktZXBpYyl9XG4uYmFkZ2UucmFyaXR5LWxlZ2VuZGFyeSBpe2JhY2tncm91bmQ6dmFyKC0tcmFyaXR5LWxlZ2VuZGFyeSl9XG4ucmFyaXR5LW91dGxpbmUtY29tbW9ue2JveC1zaGFkb3c6MCAwIDAgMXB4IHJnYmEoMTU0LDE2MCwxNjYsLjM1KSBpbnNldCwgMCAwIDI0cHggcmdiYSgxNTQsMTYwLDE2NiwuMTUpfVxuLnJhcml0eS1vdXRsaW5lLXJhcmV7Ym94LXNoYWRvdzowIDAgMCAxcHggcmdiYSg3OSwyMTIsMjQ1LC40NSkgaW5zZXQsIDAgMCAyOHB4IHJnYmEoNzksMjEyLDI0NSwuMjUpfVxuLnJhcml0eS1vdXRsaW5lLWVwaWN7Ym94LXNoYWRvdzowIDAgMCAxcHggcmdiYSgxNzgsMTA3LDI1NSwuNSkgaW5zZXQsIDAgMCAzMnB4IHJnYmEoMTc4LDEwNywyNTUsLjMpfVxuLnJhcml0eS1vdXRsaW5lLWxlZ2VuZGFyeXtib3gtc2hhZG93OjAgMCAwIDFweCByZ2JhKDI0NiwxOTYsNjksLjYpIGluc2V0LCAwIDAgMzZweCByZ2JhKDI0NiwxOTYsNjksLjM1KX1cbi8qIGF1cmEgY2FyZCB3cmFwcGVyICovXG4uaXRlbS1jYXJke3Bvc2l0aW9uOnJlbGF0aXZlO2JvcmRlci1yYWRpdXM6dmFyKC0tcmFkaXVzLW1kKTtwYWRkaW5nOjEwcHg7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTQwZGVnLHJnYmEoMjU1LDI1NSwyNTUsLjA2KSxyZ2JhKDI1NSwyNTUsMjU1LC4wNCkpO292ZXJmbG93OmhpZGRlbn1cbi5pdGVtLWNhcmQ6OmJlZm9yZXtjb250ZW50OlwiXCI7cG9zaXRpb246YWJzb2x1dGU7aW5zZXQ6LTFweDtib3JkZXItcmFkaXVzOmluaGVyaXQ7cGFkZGluZzoxcHg7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLHJnYmEoMjU1LDI1NSwyNTUsLjE4KSxyZ2JhKDI1NSwyNTUsMjU1LC4wMikpOy13ZWJraXQtbWFzazpsaW5lYXItZ3JhZGllbnQoIzAwMCAwIDApIGNvbnRlbnQtYm94LGxpbmVhci1ncmFkaWVudCgjMDAwIDAgMCk7LXdlYmtpdC1tYXNrLWNvbXBvc2l0ZTp4b3I7bWFzay1jb21wb3NpdGU6ZXhjbHVkZX1cbi5pdGVtLWNhcmRbZGF0YS1yYXJpdHk9XCJjb21tb25cIl17Ym9yZGVyOjFweCBzb2xpZCByZ2JhKDE1NCwxNjAsMTY2LC4yNSl9XG4uaXRlbS1jYXJkW2RhdGEtcmFyaXR5PVwicmFyZVwiXXtib3JkZXI6MXB4IHNvbGlkIHJnYmEoNzksMjEyLDI0NSwuMzUpfVxuLml0ZW0tY2FyZFtkYXRhLXJhcml0eT1cImVwaWNcIl17Ym9yZGVyOjFweCBzb2xpZCByZ2JhKDE3OCwxMDcsMjU1LC40KX1cbi5pdGVtLWNhcmRbZGF0YS1yYXJpdHk9XCJsZWdlbmRhcnlcIl17Ym9yZGVyOjFweCBzb2xpZCByZ2JhKDI0NiwxOTYsNjksLjQ1KX1cbi8qIHZlcnRpY2FsIHRpbWVsaW5lICovXG4udGltZWxpbmV7cG9zaXRpb246cmVsYXRpdmU7bWFyZ2luLXRvcDo4cHg7cGFkZGluZy1sZWZ0OjE2cHh9XG4udGltZWxpbmU6OmJlZm9yZXtjb250ZW50OlwiXCI7cG9zaXRpb246YWJzb2x1dGU7bGVmdDo2cHg7dG9wOjA7Ym90dG9tOjA7d2lkdGg6MnB4O2JhY2tncm91bmQ6cmdiYSgyNTUsMjU1LDI1NSwuMSl9XG4udGltZWxpbmUtaXRlbXtwb3NpdGlvbjpyZWxhdGl2ZTttYXJnaW46OHB4IDAgOHB4IDB9XG4udGltZWxpbmUtaXRlbSAuZG90e3Bvc2l0aW9uOmFic29sdXRlO2xlZnQ6LTEycHg7dG9wOjJweDt3aWR0aDoxMHB4O2hlaWdodDoxMHB4O2JvcmRlci1yYWRpdXM6OTk5cHg7YmFja2dyb3VuZDp2YXIoLS1yYXJpdHktcmFyZSk7Ym94LXNoYWRvdzowIDAgMTBweCByZ2JhKDc5LDIxMiwyNDUsLjUpfVxuLnRpbWVsaW5lLWl0ZW0gLnRpbWV7b3BhY2l0eTouNzU7Zm9udC1zaXplOjEycHh9XG4udGltZWxpbmUtaXRlbSAuZGVzY3ttYXJnaW4tdG9wOjJweH1cbi8qIGFjdGlvbiBidXR0b25zIGxpbmUgKi9cbi5hY3Rpb25ze2Rpc3BsYXk6ZmxleDtnYXA6NnB4O2ZsZXgtd3JhcDp3cmFwfVxuLyogc3VidGxlIGhvdmVyICovXG4uaG92ZXItbGlmdHt0cmFuc2l0aW9uOnRyYW5zZm9ybSB2YXIoLS1kdXIpIHZhcigtLWVhc2UpLCBib3gtc2hhZG93IHZhcigtLWR1cikgdmFyKC0tZWFzZSl9XG4uaG92ZXItbGlmdDpob3Zlcnt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtMXB4KX1cbi8qIHJpbmcgbWV0ZXIgKi9cbi5yaW5ney0tc2l6ZToxMTZweDstLXRoaWNrOjEwcHg7cG9zaXRpb246cmVsYXRpdmU7d2lkdGg6dmFyKC0tc2l6ZSk7aGVpZ2h0OnZhcigtLXNpemUpO2JvcmRlci1yYWRpdXM6NTAlO2JhY2tncm91bmQ6Y29uaWMtZ3JhZGllbnQoIzdCMkNGNSAwZGVnLCByZ2JhKDI1NSwyNTUsMjU1LC4wOCkgMGRlZyl9XG4ucmluZzo6YWZ0ZXJ7Y29udGVudDpcIlwiO3Bvc2l0aW9uOmFic29sdXRlO2luc2V0OmNhbGModmFyKC0tdGhpY2spKTtib3JkZXItcmFkaXVzOmluaGVyaXQ7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTgwZGVnLHJnYmEoMjU1LDI1NSwyNTUsLjA2KSxyZ2JhKDI1NSwyNTUsMjU1LC4wMikpfVxuLnJpbmcgLmxhYmVse3Bvc2l0aW9uOmFic29sdXRlO2luc2V0OjA7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO2ZvbnQtd2VpZ2h0OjcwMH1cbi8qIHRvYXN0ICovXG4udG9hc3Qtd3JhcHtwb3NpdGlvbjpmaXhlZDtyaWdodDoxNnB4O2JvdHRvbToxNnB4O2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjhweDt6LWluZGV4Ojk5OTl9XG4udG9hc3R7bWF4LXdpZHRoOjM0MHB4O3BhZGRpbmc6MTBweCAxMnB4O2JvcmRlci1yYWRpdXM6MTJweDtjb2xvcjojZmZmO2JhY2tncm91bmQ6cmdiYSgzMCwzMCw1MCwuOTYpO2JveC1zaGFkb3c6dmFyKC0tZ2xvdyk7cG9zaXRpb246cmVsYXRpdmU7b3ZlcmZsb3c6aGlkZGVufVxuLnRvYXN0LnN1Y2Nlc3N7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTgwZGVnLHJnYmEoNDYsMTk0LDEyNiwuMTYpLHJnYmEoMzAsMzAsNTAsLjk2KSl9XG4udG9hc3Qud2FybntiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxODBkZWcscmdiYSgyNDYsMTk2LDY5LC4xOCkscmdiYSgzMCwzMCw1MCwuOTYpKX1cbi50b2FzdC5lcnJvcntiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxODBkZWcscmdiYSgyNTUsOTIsOTIsLjE4KSxyZ2JhKDMwLDMwLDUwLC45NikpfVxuLnRvYXN0IC5saWZle3Bvc2l0aW9uOmFic29sdXRlO2xlZnQ6MDtib3R0b206MDtoZWlnaHQ6MnB4O2JhY2tncm91bmQ6IzdCMkNGNTthbmltYXRpb246dG9hc3QtbGlmZSB2YXIoLS1saWZlLDMuNXMpIGxpbmVhciBmb3J3YXJkc31cbkBrZXlmcmFtZXMgdG9hc3QtbGlmZXtmcm9te3dpZHRoOjEwMCV9dG97d2lkdGg6MH19XG5AbWVkaWEgKHByZWZlcnMtcmVkdWNlZC1tb3Rpb246cmVkdWNlKXsqe2FuaW1hdGlvbi1kdXJhdGlvbjouMDAxbXMhaW1wb3J0YW50O2FuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6MSFpbXBvcnRhbnQ7dHJhbnNpdGlvbi1kdXJhdGlvbjowbXMhaW1wb3J0YW50fX1cbmA7XG4gIGNvbnN0IHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgc3R5bGUuc2V0QXR0cmlidXRlKCdkYXRhLXVpJywgJ21pbmVyLWdhbWUnKTtcbiAgc3R5bGUudGV4dENvbnRlbnQgPSBjc3M7XG4gIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICBpbmplY3RlZCA9IHRydWU7XG5cbiAgLy8gc29mdCBzdGFyZmllbGQgYmFja2dyb3VuZCAodmVyeSBsaWdodClcbiAgdHJ5IHtcbiAgICBjb25zdCBleGlzdHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1zdGFyc10nKTtcbiAgICBpZiAoIWV4aXN0cykge1xuICAgICAgY29uc3QgY3ZzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICBjdnMuc2V0QXR0cmlidXRlKCdkYXRhLXN0YXJzJywgJycpO1xuICAgICAgY3ZzLnN0eWxlLmNzc1RleHQgPSAncG9zaXRpb246Zml4ZWQ7aW5zZXQ6MDt6LWluZGV4Oi0xO29wYWNpdHk6LjM1O3BvaW50ZXItZXZlbnRzOm5vbmU7JztcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY3ZzKTtcbiAgICAgIGNvbnN0IGN0eCA9IGN2cy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgY29uc3Qgc3RhcnMgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiA2MCB9LCAoKSA9PiAoeyB4OiBNYXRoLnJhbmRvbSgpLCB5OiBNYXRoLnJhbmRvbSgpLCByOiBNYXRoLnJhbmRvbSgpKjEuMiswLjIsIHM6IE1hdGgucmFuZG9tKCkqMC44KzAuMiB9KSk7XG4gICAgICBjb25zdCBmaXQgPSAoKSA9PiB7IGN2cy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoOyBjdnMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0OyB9O1xuICAgICAgZml0KCk7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZml0KTtcbiAgICAgIGxldCB0ID0gMDtcbiAgICAgIGNvbnN0IGxvb3AgPSAoKSA9PiB7XG4gICAgICAgIGlmICghY3R4KSByZXR1cm47XG4gICAgICAgIHQgKz0gMC4wMTY7XG4gICAgICAgIGN0eC5jbGVhclJlY3QoMCwwLGN2cy53aWR0aCxjdnMuaGVpZ2h0KTtcbiAgICAgICAgZm9yIChjb25zdCBzdCBvZiBzdGFycykge1xuICAgICAgICAgIGNvbnN0IHggPSBzdC54ICogY3ZzLndpZHRoLCB5ID0gc3QueSAqIGN2cy5oZWlnaHQ7XG4gICAgICAgICAgY29uc3QgdHcgPSAoTWF0aC5zaW4odCoxLjYgKyB4KjAuMDAyICsgeSowLjAwMykqMC41KzAuNSkqMC41KzAuNTtcbiAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgY3R4LmFyYyh4LCB5LCBzdC5yICsgdHcqMC42LCAwLCBNYXRoLlBJKjIpO1xuICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAncmdiYSgxODAsMjAwLDI1NSwwLjYpJztcbiAgICAgICAgICBjdHguZmlsbCgpO1xuICAgICAgICB9XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wKTtcbiAgICAgIH07XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcCk7XG4gICAgfVxuICB9IGNhdGNoIHt9XG59XG4iLCAiaW1wb3J0IHsgTG9naW5TY2VuZSB9IGZyb20gJy4vc2NlbmVzL0xvZ2luU2NlbmUnO1xuaW1wb3J0IHsgTWFpblNjZW5lIH0gZnJvbSAnLi9zY2VuZXMvTWFpblNjZW5lJztcbmltcG9ydCB7IEdhbWVNYW5hZ2VyIH0gZnJvbSAnLi9jb3JlL0dhbWVNYW5hZ2VyJztcbmltcG9ydCB7IFdhcmVob3VzZVNjZW5lIH0gZnJvbSAnLi9zY2VuZXMvV2FyZWhvdXNlU2NlbmUnO1xuaW1wb3J0IHsgUGx1bmRlclNjZW5lIH0gZnJvbSAnLi9zY2VuZXMvUGx1bmRlclNjZW5lJztcbmltcG9ydCB7IEV4Y2hhbmdlU2NlbmUgfSBmcm9tICcuL3NjZW5lcy9FeGNoYW5nZVNjZW5lJztcbmltcG9ydCB7IFJhbmtpbmdTY2VuZSB9IGZyb20gJy4vc2NlbmVzL1JhbmtpbmdTY2VuZSc7XG5pbXBvcnQgeyBlbnN1cmVHbG9iYWxTdHlsZXMgfSBmcm9tICcuL3N0eWxlcy9pbmplY3QnO1xuXG5mdW5jdGlvbiByb3V0ZVRvKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQpIHtcbiAgY29uc3QgaCA9IGxvY2F0aW9uLmhhc2ggfHwgJyMvbG9naW4nO1xuICBjb25zdCBzY2VuZSA9IGguc3BsaXQoJz8nKVswXTtcbiAgc3dpdGNoIChzY2VuZSkge1xuICAgIGNhc2UgJyMvbWFpbic6XG4gICAgICBuZXcgTWFpblNjZW5lKCkubW91bnQoY29udGFpbmVyKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJyMvd2FyZWhvdXNlJzpcbiAgICAgIG5ldyBXYXJlaG91c2VTY2VuZSgpLm1vdW50KGNvbnRhaW5lcik7XG4gICAgICBicmVhaztcbiAgICBjYXNlICcjL3BsdW5kZXInOlxuICAgICAgbmV3IFBsdW5kZXJTY2VuZSgpLm1vdW50KGNvbnRhaW5lcik7XG4gICAgICBicmVhaztcbiAgICBjYXNlICcjL2V4Y2hhbmdlJzpcbiAgICAgIG5ldyBFeGNoYW5nZVNjZW5lKCkubW91bnQoY29udGFpbmVyKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJyMvcmFua2luZyc6XG4gICAgICBuZXcgUmFua2luZ1NjZW5lKCkubW91bnQoY29udGFpbmVyKTtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICBuZXcgTG9naW5TY2VuZSgpLm1vdW50KGNvbnRhaW5lcik7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGJvb3RzdHJhcChjb250YWluZXI6IEhUTUxFbGVtZW50KSB7XG4gIGVuc3VyZUdsb2JhbFN0eWxlcygpO1xuICByb3V0ZVRvKGNvbnRhaW5lcik7XG4gIHdpbmRvdy5vbmhhc2hjaGFuZ2UgPSAoKSA9PiByb3V0ZVRvKGNvbnRhaW5lcik7XG59XG5cbi8vIFx1NEZCRlx1NjM3N1x1NTQyRlx1NTJBOFx1RkYwOFx1N0Y1MVx1OTg3NVx1NzNBRlx1NTg4M1x1RkYwOVxuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICh3aW5kb3cgYXMgYW55KS5NaW5lckFwcCA9IHsgYm9vdHN0cmFwLCBHYW1lTWFuYWdlciB9O1xufVxuXHJcblxyXG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7QUFBTyxNQUFNLGtCQUFOLE1BQU0sZ0JBQWU7QUFBQSxJQUFyQjtBQUlMLDBCQUFRLFNBQXVCO0FBQUE7QUFBQSxJQUYvQixXQUFXLElBQW9CO0FBRmpDO0FBRW1DLGNBQU8sVUFBSyxjQUFMLFlBQW1CLEtBQUssWUFBWSxJQUFJLGdCQUFlO0FBQUEsSUFBSTtBQUFBLElBR25HLFNBQVMsR0FBa0I7QUFBRSxXQUFLLFFBQVE7QUFBQSxJQUFHO0FBQUEsSUFFN0MsTUFBTSxRQUFXLE1BQWMsTUFBZ0M7QUFDN0QsWUFBTSxVQUFlLEVBQUUsZ0JBQWdCLG9CQUFvQixJQUFJ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LEVBQUU7QUFDM0ksY0FBTSxNQUFNLE1BQU07QUFBRSxjQUFJLFFBQVEsT0FBTztBQUFZLGNBQUksU0FBUyxPQUFPO0FBQUEsUUFBYTtBQUNwRixZQUFJO0FBQ0osZUFBTyxpQkFBaUIsVUFBVSxHQUFHO0FBQ3JDLFlBQUksSUFBSTtBQUNSLGNBQU0sT0FBTyxNQUFNO0FBQ2pCLGNBQUksQ0FBQyxJQUFLO0FBQ1YsZUFBSztBQUNMLGNBQUksVUFBVSxHQUFFLEdBQUUsSUFBSSxPQUFNLElBQUksTUFBTTtBQUN0QyxxQkFBVyxNQUFNLE9BQU87QUFDdEIsa0JBQU0sSUFBSSxHQUFHLElBQUksSUFBSSxPQUFPLElBQUksR0FBRyxJQUFJLElBQUk7QUFDM0Msa0JBQU0sTUFBTSxLQUFLLElBQUksSUFBRSxNQUFNLElBQUUsT0FBUSxJQUFFLElBQUssSUFBRSxNQUFJLE9BQUssTUFBSTtBQUM3RCxnQkFBSSxVQUFVO0FBQ2QsZ0JBQUksSUFBSSxHQUFHLEdBQUcsR0FBRyxJQUFJLEtBQUcsS0FBSyxHQUFHLEtBQUssS0FBRyxDQUFDO0FBQ3pDLGdCQUFJLFlBQVk7QUFDaEIsZ0JBQUksS0FBSztBQUFBLFVBQ1g7QUFDQSxnQ0FBc0IsSUFBSTtBQUFBLFFBQzVCO0FBQ0EsOEJBQXNCLElBQUk7QUFBQSxNQUM1QjtBQUFBLElBQ0YsU0FBUTtBQUFBLElBQUM7QUFBQSxFQUNYOzs7QUM5SEEsV0FBUyxRQUFRLFdBQXdCO0FBQ3ZDLFVBQU0sSUFBSSxTQUFTLFFBQVE7QUFDM0IsVUFBTSxRQUFRLEVBQUUsTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUM1QixZQUFRLE9BQU87QUFBQSxNQUNiLEtBQUs7QUFDSCxZQUFJLFVBQVUsRUFBRSxNQUFNLFNBQVM7QUFDL0I7QUFBQSxNQUNGLEtBQUs7QUFDSCxZQUFJLGVBQWUsRUFBRSxNQUFNLFNBQVM7QUFDcEM7QUFBQSxNQUNGLEtBQUs7QUFDSCxZQUFJLGFBQWEsRUFBRSxNQUFNLFNBQVM7QUFDbEM7QUFBQSxNQUNGLEtBQUs7QUFDSCxZQUFJLGNBQWMsRUFBRSxNQUFNLFNBQVM7QUFDbkM7QUFBQSxNQUNGLEtBQUs7QUFDSCxZQUFJLGFBQWEsRUFBRSxNQUFNLFNBQVM7QUFDbEM7QUFBQSxNQUNGO0FBQ0UsWUFBSSxXQUFXLEVBQUUsTUFBTSxTQUFTO0FBQUEsSUFDcEM7QUFBQSxFQUNGO0FBRUEsaUJBQXNCLFVBQVUsV0FBd0I7QUFDdEQsdUJBQW1CO0FBQ25CLFlBQVEsU0FBUztBQUNqQixXQUFPLGVBQWUsTUFBTSxRQUFRLFNBQVM7QUFBQSxFQUMvQztBQUdBLE1BQUksT0FBTyxXQUFXLGFBQWE7QUFDakMsSUFBQyxPQUFlLFdBQVcsRUFBRSxXQUFXLFlBQVk7QUFBQSxFQUN0RDsiLAogICJuYW1lcyI6IFsidmlldyIsICJ2aWV3IiwgInZpZXciLCAidmlldyIsICJ2aWV3IiwgInZpZXciXQp9Cg==
