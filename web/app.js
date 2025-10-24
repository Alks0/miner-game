(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // frontend-scripts/core/NetworkManager.ts
  var _NetworkManager = class _NetworkManager {
    constructor() {
      __publicField(this, "token", null);
      this.token = localStorage.getItem("auth_token");
    }
    static get I() {
      var _a;
      return (_a = this._instance) != null ? _a : this._instance = new _NetworkManager();
    }
    setToken(t) {
      this.token = t;
      if (t) {
        localStorage.setItem("auth_token", t);
      } else {
        localStorage.removeItem("auth_token");
      }
    }
    getToken() {
      return this.token;
    }
    clearToken() {
      this.setToken(null);
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
    async tryRestoreSession() {
      const nm = NetworkManager.I;
      const token = nm.getToken();
      if (!token) return false;
      try {
        this.profile = await nm.request("/user/profile");
        return true;
      } catch (e) {
        nm.clearToken();
        return false;
      }
    }
    logout() {
      NetworkManager.I.clearToken();
      this.profile = null;
      location.hash = "#/login";
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
      case "logout":
        return svgWrap(`<path d="M14 8V5a1 1 0 00-1-1H5a1 1 0 00-1 1v14a1 1 0 001 1h8a1 1 0 001-1v-3" ${stroke}/><path d="M9 12h11M16 8l4 4-4 4" ${stroke}/>`, size, cls);
      case "x":
        return svgWrap(`<path d="M6 6l12 12M18 6L6 18" ${stroke}/>`, size, cls);
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
    const logoutBtn = document.createElement("a");
    logoutBtn.href = "#";
    logoutBtn.className = "nav-logout";
    logoutBtn.style.cssText = "margin-left:auto;opacity:.75;";
    const logoutIco = renderIcon("logout", { size: 18, className: "ico" });
    const logoutLabel = document.createElement("span");
    logoutLabel.textContent = "\u9000\u51FA";
    logoutBtn.appendChild(logoutIco);
    logoutBtn.appendChild(logoutLabel);
    logoutBtn.onclick = (e) => {
      e.preventDefault();
      if (confirm("\u786E\u5B9A\u8981\u9000\u51FA\u767B\u5F55\u5417\uFF1F")) {
        GameManager.I.logout();
      }
    };
    wrap.appendChild(logoutBtn);
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
                  <button class="btn ${item.isEquipped ? "btn-sell" : "btn-buy"}" data-act="${item.isEquipped ? "unequip" : "equip"}" data-id="${item.id}"><span data-ico="${item.isEquipped ? "x" : "shield"}"></span>${item.isEquipped ? "\u5378\u4E0B" : "\u88C5\u5907"}</button>
                  <button class="btn btn-primary" data-act="upgrade" data-id="${item.id}" title="\u6D88\u8017 ${item.level * 50} \u77FF\u77F3"><span data-ico="wrench"></span>\u5347\u7EA7 (${item.level * 50})</button>
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
                if (act === "equip") {
                  target.innerHTML = '<span data-ico="shield"></span>\u88C5\u5907\u4E2D\u2026';
                } else if (act === "unequip") {
                  target.innerHTML = '<span data-ico="x"></span>\u5378\u4E0B\u4E2D\u2026';
                } else if (act === "upgrade") {
                  target.innerHTML = '<span data-ico="wrench"></span>\u5347\u7EA7\u4E2D\u2026';
                }
                mountIcons(target);
                if (act === "equip") {
                  await NetworkManager.I.request("/items/equip", { method: "POST", body: JSON.stringify({ itemId: id }) });
                  showToast("\u88C5\u5907\u6210\u529F", "success");
                } else if (act === "unequip") {
                  await NetworkManager.I.request("/items/unequip", { method: "POST", body: JSON.stringify({ itemId: id }) });
                  showToast("\u5378\u4E0B\u6210\u529F", "success");
                } else if (act === "upgrade") {
                  const res = await NetworkManager.I.request("/items/upgrade", { method: "POST", body: JSON.stringify({ itemId: id }) });
                  row.classList.add("upgrade-success");
                  setTimeout(() => row.classList.remove("upgrade-success"), 1e3);
                  showToast(`\u5347\u7EA7\u6210\u529F\uFF01\u7B49\u7EA7 ${res.level}\uFF08\u6D88\u8017 ${res.cost} \u77FF\u77F3\uFF09`, "success");
                }
                await bar.update();
                await load();
              } catch (e) {
                showToast((e == null ? void 0 : e.message) || "\u64CD\u4F5C\u5931\u8D25", "error");
              } finally {
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
                  showToast(`\u63A0\u593A\u6210\u529F\uFF0C\u83B7\u5F97 ${res.loot_amount} \u77FF\u77F3`, "success");
                  await load();
                } else {
                  this.log(`\u63A0\u593A ${id} \u5931\u8D25`);
                  showToast("\u63A0\u593A\u5931\u8D25", "warn");
                }
                await bar.update();
              } catch (e) {
                const message = (e == null ? void 0 : e.message) || "\u63A0\u593A\u5931\u8D25";
                this.log(`\u63A0\u593A\u5931\u8D25\uFF1A${message}`);
                if (message.includes("\u51B7\u5374")) {
                  showToast(message, "warn");
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
.card::after{content:"";position:absolute;left:-30%;top:-120%;width:60%;height:300%;background:linear-gradient(120deg,transparent,rgba(255,255,255,.18),transparent);transform:rotate(8deg);opacity:.25;animation:card-sheen 9s linear infinite;pointer-events:none}
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
.btn::after{content:"";position:absolute;inset:0;opacity:0;background:linear-gradient(115deg,transparent,rgba(255,255,255,.25),transparent 55%);transform:translateX(-60%);transition:opacity var(--dur) var(--ease), transform var(--dur) var(--ease);pointer-events:none}
.btn:hover::after{opacity:.9;transform:translateX(0)}
.btn:hover{filter:saturate(110%)}
.btn-primary{background:var(--grad);box-shadow:var(--glow)}
.btn-energy{position:relative;animation:btn-pulse 2s ease-in-out infinite}
.btn-energy::before{content:"";position:absolute;inset:-2px;border-radius:inherit;background:linear-gradient(135deg,rgba(123,44,245,.6),rgba(44,137,245,.6));filter:blur(8px);z-index:-1;opacity:.6;animation:energy-ring 2s ease-in-out infinite;pointer-events:none}
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
.mine-gauge .ring::before{content:"";position:absolute;inset:18%;border-radius:50%;background:radial-gradient(circle at 50% 28%,rgba(123,44,245,.45),rgba(12,20,46,.92) 70%);box-shadow:inset 0 14px 28px rgba(0,0,0,.48);pointer-events:none}
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
.mine-progress-fill::after{content:"";position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent);animation:progress-wave 2s linear infinite;pointer-events:none}
@keyframes progress-wave{0%{left:-100%}100%{left:200%}}
.mine-status{min-height:22px;font-size:13px;opacity:.9}
.mine-actions-grid{display:grid;gap:12px;grid-template-columns:repeat(2,minmax(0,1fr))}
.mine-actions-grid .btn{height:48px;display:flex;align-items:center;justify-content:center;font-size:15px;gap:8px}
.mine-actions-grid .span-2{grid-column:span 2}
@media (min-width:680px){.mine-actions-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.mine-actions-grid .span-2{grid-column:span 3}}
.mine-feed{position:relative;border-radius:16px;background:rgba(12,20,44,.55);padding:14px 12px;box-shadow:inset 0 0 24px rgba(123,44,245,.12);backdrop-filter:blur(12px)}
.mine-feed::before{content:"";position:absolute;inset:0;background:linear-gradient(135deg,rgba(123,44,245,.16),rgba(44,137,245,.14) 60%,transparent);opacity:.75;pointer-events:none}
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
.skeleton::after{content:"";position:absolute;inset:0;transform:translateX(-100%);background:linear-gradient(90deg,transparent,rgba(255,255,255,.12),transparent);animation:shimmer 1.2s infinite;pointer-events:none}
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
.item-card::before{content:"";position:absolute;inset:-1px;border-radius:inherit;padding:1px;background:linear-gradient(135deg,rgba(255,255,255,.18),rgba(255,255,255,.02));-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none}
.item-card[data-rarity="common"]{border:1px solid rgba(154,160,166,.25)}
.item-card[data-rarity="rare"]{border:1px solid rgba(79,212,245,.35)}
.item-card[data-rarity="epic"]{border:1px solid rgba(178,107,255,.4)}
.item-card[data-rarity="legendary"]{border:1px solid rgba(246,196,69,.45)}
.upgrade-success{animation:upgrade-flash 1s ease}
@keyframes upgrade-flash{0%{transform:scale(1);box-shadow:0 0 0 rgba(46,194,126,0)}25%{transform:scale(1.02);box-shadow:0 0 30px rgba(46,194,126,.6),0 0 60px rgba(46,194,126,.3)}50%{transform:scale(1);box-shadow:0 0 40px rgba(46,194,126,.8),0 0 80px rgba(46,194,126,.4)}75%{transform:scale(1.01);box-shadow:0 0 30px rgba(46,194,126,.6),0 0 60px rgba(46,194,126,.3)}100%{transform:scale(1);box-shadow:0 0 0 rgba(46,194,126,0)}}
/* vertical timeline */
.timeline{position:relative;margin-top:8px;padding-left:16px}
.timeline::before{content:"";position:absolute;left:6px;top:0;bottom:0;width:2px;background:rgba(255,255,255,.1);pointer-events:none}
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
.ring::after{content:"";position:absolute;inset:calc(var(--thick));border-radius:inherit;background:linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.02));pointer-events:none}
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
    const restored = await GameManager.I.tryRestoreSession();
    if (restored && (location.hash === "" || location.hash === "#/login")) {
      location.hash = "#/main";
    }
    requestAnimationFrame(() => {
      routeTo(container);
    });
    window.onhashchange = () => routeTo(container);
  }
  if (typeof window !== "undefined") {
    window.MinerApp = { bootstrap, GameManager };
  }
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vZnJvbnRlbmQtc2NyaXB0cy9jb3JlL05ldHdvcmtNYW5hZ2VyLnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvY29yZS9HYW1lTWFuYWdlci50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL3V0aWxzL2RvbS50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvbXBvbmVudHMvSWNvbi50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvbXBvbmVudHMvVG9hc3QudHMiLCAiLi4vZnJvbnRlbmQtc2NyaXB0cy9zY2VuZXMvTG9naW5TY2VuZS50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvcmUvRW52LnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvY29yZS9SZWFsdGltZUNsaWVudC50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvbXBvbmVudHMvTmF2LnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvY29tcG9uZW50cy9Db3VudFVwVGV4dC50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvbXBvbmVudHMvUmVzb3VyY2VCYXIudHMiLCAiLi4vZnJvbnRlbmQtc2NyaXB0cy9zY2VuZXMvTWFpblNjZW5lLnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvc2NlbmVzL1dhcmVob3VzZVNjZW5lLnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvc2NlbmVzL1BsdW5kZXJTY2VuZS50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL3NjZW5lcy9FeGNoYW5nZVNjZW5lLnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvc2NlbmVzL1JhbmtpbmdTY2VuZS50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL3N0eWxlcy9pbmplY3QudHMiLCAiLi4vZnJvbnRlbmQtc2NyaXB0cy9BcHAudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImV4cG9ydCBjbGFzcyBOZXR3b3JrTWFuYWdlciB7XHJcbiAgcHJpdmF0ZSBzdGF0aWMgX2luc3RhbmNlOiBOZXR3b3JrTWFuYWdlcjtcclxuICBzdGF0aWMgZ2V0IEkoKTogTmV0d29ya01hbmFnZXIgeyByZXR1cm4gdGhpcy5faW5zdGFuY2UgPz8gKHRoaXMuX2luc3RhbmNlID0gbmV3IE5ldHdvcmtNYW5hZ2VyKCkpOyB9XHJcblxyXG4gIHByaXZhdGUgdG9rZW46IHN0cmluZyB8IG51bGwgPSBudWxsO1xyXG4gIFxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgLy8gXHU0RUNFIGxvY2FsU3RvcmFnZSBcdTYwNjJcdTU5MEQgdG9rZW5cclxuICAgIHRoaXMudG9rZW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYXV0aF90b2tlbicpO1xyXG4gIH1cclxuICBcclxuICBzZXRUb2tlbih0OiBzdHJpbmcgfCBudWxsKSB7IFxyXG4gICAgdGhpcy50b2tlbiA9IHQ7XHJcbiAgICBpZiAodCkge1xyXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnYXV0aF90b2tlbicsIHQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ2F1dGhfdG9rZW4nKTtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgZ2V0VG9rZW4oKTogc3RyaW5nIHwgbnVsbCB7XHJcbiAgICByZXR1cm4gdGhpcy50b2tlbjtcclxuICB9XHJcbiAgXHJcbiAgY2xlYXJUb2tlbigpIHtcclxuICAgIHRoaXMuc2V0VG9rZW4obnVsbCk7XHJcbiAgfVxyXG5cclxuICBhc3luYyByZXF1ZXN0PFQ+KHBhdGg6IHN0cmluZywgaW5pdD86IFJlcXVlc3RJbml0KTogUHJvbWlzZTxUPiB7XHJcbiAgICBjb25zdCBoZWFkZXJzOiBhbnkgPSB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsIC4uLihpbml0Py5oZWFkZXJzIHx8IHt9KSB9O1xyXG4gICAgaWYgKHRoaXMudG9rZW4pIGhlYWRlcnNbJ0F1dGhvcml6YXRpb24nXSA9IGBCZWFyZXIgJHt0aGlzLnRva2VufWA7XHJcbiAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaCh0aGlzLmdldEJhc2UoKSArIHBhdGgsIHsgLi4uaW5pdCwgaGVhZGVycyB9KTtcclxuICAgIGNvbnN0IGpzb24gPSBhd2FpdCByZXMuanNvbigpO1xyXG4gICAgaWYgKCFyZXMub2sgfHwganNvbi5jb2RlID49IDQwMCkgdGhyb3cgbmV3IEVycm9yKGpzb24ubWVzc2FnZSB8fCAnUmVxdWVzdCBFcnJvcicpO1xyXG4gICAgcmV0dXJuIGpzb24uZGF0YSBhcyBUO1xyXG4gIH1cclxuXHJcbiAgZ2V0QmFzZSgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuICh3aW5kb3cgYXMgYW55KS5fX0FQSV9CQVNFX18gfHwgJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGknO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbiIsICJpbXBvcnQgeyBOZXR3b3JrTWFuYWdlciB9IGZyb20gJy4vTmV0d29ya01hbmFnZXInO1xyXG5cclxuZXhwb3J0IHR5cGUgUHJvZmlsZSA9IHsgaWQ6IHN0cmluZzsgdXNlcm5hbWU6IHN0cmluZzsgbmlja25hbWU6IHN0cmluZzsgb3JlQW1vdW50OiBudW1iZXI7IGJiQ29pbnM6IG51bWJlciB9O1xyXG5cclxuZXhwb3J0IGNsYXNzIEdhbWVNYW5hZ2VyIHtcclxuICBwcml2YXRlIHN0YXRpYyBfaW5zdGFuY2U6IEdhbWVNYW5hZ2VyO1xyXG4gIHN0YXRpYyBnZXQgSSgpOiBHYW1lTWFuYWdlciB7IHJldHVybiB0aGlzLl9pbnN0YW5jZSA/PyAodGhpcy5faW5zdGFuY2UgPSBuZXcgR2FtZU1hbmFnZXIoKSk7IH1cclxuXHJcbiAgcHJpdmF0ZSBwcm9maWxlOiBQcm9maWxlIHwgbnVsbCA9IG51bGw7XHJcbiAgZ2V0UHJvZmlsZSgpOiBQcm9maWxlIHwgbnVsbCB7IHJldHVybiB0aGlzLnByb2ZpbGU7IH1cclxuXHJcbiAgYXN5bmMgbG9naW5PclJlZ2lzdGVyKHVzZXJuYW1lOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIGNvbnN0IG5tID0gTmV0d29ya01hbmFnZXIuSTtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHIgPSBhd2FpdCBubS5yZXF1ZXN0PHsgYWNjZXNzX3Rva2VuOiBzdHJpbmc7IHVzZXI6IGFueSB9PignL2F1dGgvbG9naW4nLCB7IG1ldGhvZDogJ1BPU1QnLCBib2R5OiBKU09OLnN0cmluZ2lmeSh7IHVzZXJuYW1lLCBwYXNzd29yZCB9KSB9KTtcclxuICAgICAgbm0uc2V0VG9rZW4oci5hY2Nlc3NfdG9rZW4pO1xyXG4gICAgfSBjYXRjaCB7XHJcbiAgICAgIGNvbnN0IHIgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyBhY2Nlc3NfdG9rZW46IHN0cmluZzsgdXNlcjogYW55IH0+KCcvYXV0aC9yZWdpc3RlcicsIHsgbWV0aG9kOiAnUE9TVCcsIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgdXNlcm5hbWUsIHBhc3N3b3JkIH0pIH0pO1xyXG4gICAgICBOZXR3b3JrTWFuYWdlci5JLnNldFRva2VuKHIuYWNjZXNzX3Rva2VuKTtcclxuICAgIH1cclxuICAgIHRoaXMucHJvZmlsZSA9IGF3YWl0IG5tLnJlcXVlc3Q8UHJvZmlsZT4oJy91c2VyL3Byb2ZpbGUnKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIHRyeVJlc3RvcmVTZXNzaW9uKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgY29uc3Qgbm0gPSBOZXR3b3JrTWFuYWdlci5JO1xyXG4gICAgY29uc3QgdG9rZW4gPSBubS5nZXRUb2tlbigpO1xyXG4gICAgaWYgKCF0b2tlbikgcmV0dXJuIGZhbHNlO1xyXG4gICAgXHJcbiAgICB0cnkge1xyXG4gICAgICB0aGlzLnByb2ZpbGUgPSBhd2FpdCBubS5yZXF1ZXN0PFByb2ZpbGU+KCcvdXNlci9wcm9maWxlJyk7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSBjYXRjaCB7XHJcbiAgICAgIC8vIFRva2VuIFx1NTkzMVx1NjU0OFx1RkYwQ1x1NkUwNVx1OTY2NFxyXG4gICAgICBubS5jbGVhclRva2VuKCk7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGxvZ291dCgpIHtcclxuICAgIE5ldHdvcmtNYW5hZ2VyLkkuY2xlYXJUb2tlbigpO1xyXG4gICAgdGhpcy5wcm9maWxlID0gbnVsbDtcclxuICAgIGxvY2F0aW9uLmhhc2ggPSAnIy9sb2dpbic7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuIiwgImV4cG9ydCBmdW5jdGlvbiBodG1sKHRlbXBsYXRlOiBzdHJpbmcpOiBIVE1MRWxlbWVudCB7XHJcbiAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgZGl2LmlubmVySFRNTCA9IHRlbXBsYXRlLnRyaW0oKTtcclxuICByZXR1cm4gZGl2LmZpcnN0RWxlbWVudENoaWxkIGFzIEhUTUxFbGVtZW50O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcXM8VCBleHRlbmRzIEVsZW1lbnQgPSBIVE1MRWxlbWVudD4ocm9vdDogUGFyZW50Tm9kZSwgc2VsOiBzdHJpbmcpOiBUIHtcclxuICBjb25zdCBlbCA9IHJvb3QucXVlcnlTZWxlY3RvcihzZWwpIGFzIFQgfCBudWxsO1xyXG4gIGlmICghZWwpIHRocm93IG5ldyBFcnJvcihgTWlzc2luZyBlbGVtZW50OiAke3NlbH1gKTtcclxuICByZXR1cm4gZWwgYXMgVDtcclxufVxyXG5cclxuXHJcbiIsICJpbXBvcnQgeyBodG1sIH0gZnJvbSAnLi4vdXRpbHMvZG9tJztcblxuZXhwb3J0IHR5cGUgSWNvbk5hbWUgPVxuICB8ICdob21lJ1xuICB8ICd3YXJlaG91c2UnXG4gIHwgJ3BsdW5kZXInXG4gIHwgJ2V4Y2hhbmdlJ1xuICB8ICdyYW5raW5nJ1xuICB8ICdvcmUnXG4gIHwgJ2NvaW4nXG4gIHwgJ3BpY2snXG4gIHwgJ3JlZnJlc2gnXG4gIHwgJ3BsYXknXG4gIHwgJ3N0b3AnXG4gIHwgJ2NvbGxlY3QnXG4gIHwgJ3dyZW5jaCdcbiAgfCAnc2hpZWxkJ1xuICB8ICdsaXN0J1xuICB8ICd1c2VyJ1xuICB8ICdsb2NrJ1xuICB8ICdleWUnXG4gIHwgJ2V5ZS1vZmYnXG4gIHwgJ3N3b3JkJ1xuICB8ICd0cm9waHknXG4gIHwgJ2Nsb2NrJ1xuICB8ICdib2x0J1xuICB8ICd0cmFzaCdcbiAgfCAnY2xvc2UnXG4gIHwgJ2Fycm93LXJpZ2h0J1xuICB8ICd0YXJnZXQnXG4gIHwgJ2JveCdcbiAgfCAnaW5mbydcbiAgfCAnbG9nb3V0J1xuICB8ICd4JztcblxuZnVuY3Rpb24gZ3JhZChpZDogc3RyaW5nKSB7XG4gIHJldHVybiBgPGRlZnM+XG4gICAgPGxpbmVhckdyYWRpZW50IGlkPVwiJHtpZH1cIiB4MT1cIjBcIiB5MT1cIjBcIiB4Mj1cIjFcIiB5Mj1cIjFcIj5cbiAgICAgIDxzdG9wIG9mZnNldD1cIjAlXCIgc3RvcC1jb2xvcj1cIiM3QjJDRjVcIiAvPlxuICAgICAgPHN0b3Agb2Zmc2V0PVwiMTAwJVwiIHN0b3AtY29sb3I9XCIjMkM4OUY1XCIgLz5cbiAgICA8L2xpbmVhckdyYWRpZW50PlxuICA8L2RlZnM+YDtcbn1cblxuZnVuY3Rpb24gc3ZnV3JhcChwYXRoOiBzdHJpbmcsIHNpemUgPSAxOCwgY2xzID0gJycpOiBIVE1MRWxlbWVudCB7XG4gIGNvbnN0IGdpZCA9ICdpZy0nICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc2xpY2UoMiwgOCk7XG4gIGNvbnN0IGVsID0gaHRtbChgPHNwYW4gY2xhc3M9XCJpY29uICR7Y2xzfVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPiR7XG4gICAgYDxzdmcgd2lkdGg9XCIke3NpemV9XCIgaGVpZ2h0PVwiJHtzaXplfVwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj4ke2dyYWQoZ2lkKX0ke3BhdGgucmVwbGFjZUFsbCgnX19HUkFEX18nLCBgdXJsKCMke2dpZH0pYCl9PC9zdmc+YFxuICB9PC9zcGFuPmApO1xuICByZXR1cm4gZWw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJJY29uKG5hbWU6IEljb25OYW1lLCBvcHRzOiB7IHNpemU/OiBudW1iZXI7IGNsYXNzTmFtZT86IHN0cmluZyB9ID0ge30pIHtcbiAgY29uc3Qgc2l6ZSA9IG9wdHMuc2l6ZSA/PyAxODtcbiAgY29uc3QgY2xzID0gb3B0cy5jbGFzc05hbWUgPz8gJyc7XG4gIGNvbnN0IHN0cm9rZSA9ICdzdHJva2U9XCJfX0dSQURfX1wiIHN0cm9rZS13aWR0aD1cIjEuN1wiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiJztcbiAgY29uc3QgZmlsbCA9ICdmaWxsPVwiX19HUkFEX19cIic7XG5cbiAgc3dpdGNoIChuYW1lKSB7XG4gICAgY2FzZSAnaG9tZSc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0zIDEwLjVMMTIgM2w5IDcuNVwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk01LjUgOS41VjIxaDEzVjkuNVwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk05LjUgMjF2LTZoNXY2XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ3dhcmVob3VzZSc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0zIDlsOS01IDkgNXY5LjVjMCAxLTEgMi0yIDJINWMtMSAwLTItMS0yLTJWOXpcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNNyAxMmgxME03IDE2aDEwXCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ3BsdW5kZXInOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNNCAyMGw3LTdNMTMgMTNsNyA3TTkgNWw2IDZNMTUgNWwtNiA2XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ2V4Y2hhbmdlJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTYgOGgxMWwtMy0zTTE4IDE2SDdsMyAzXCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ3JhbmtpbmcnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNOCAxNHY2TTEyIDEwdjEwTTE2IDZ2MTRcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNMTYgNC41YTIgMiAwIDEwMC00IDIgMiAwIDAwMCA0elwiICR7ZmlsbH0vPmAgLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ29yZSc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0xMiAzbDYgNC0yIDgtNCA2LTQtNi0yLTggNi00elwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk0xMiAzbC0yIDggMiAxMCAyLTEwLTItOHpcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnY29pbic6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCI4LjVcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNOC41IDEyaDdNMTAgOWg0TTEwIDE1aDRcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAncGljayc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk00IDVjNC0zIDktMiAxMiAxTTkgMTBsLTUgNU05IDEwbDIgMk03IDEybDIgMlwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk0xMSAxMmw3IDdcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAncmVmcmVzaCc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0yMCAxMmE4IDggMCAxMC0yLjMgNS43XCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTIwIDEydjZoLTZcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAncGxheSc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk04IDZ2MTJsMTAtNi0xMC02elwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdzdG9wJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cmVjdCB4PVwiN1wiIHk9XCI3XCIgd2lkdGg9XCIxMFwiIGhlaWdodD1cIjEwXCIgcng9XCIyXCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ2NvbGxlY3QnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNMTIgNXYxMFwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk04IDExbDQgNCA0LTRcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNNSAxOWgxNFwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICd3cmVuY2gnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNMTUuNSA2YTQuNSA0LjUgMCAxMS02LjkgNS40TDMgMTdsNC42LTUuNkE0LjUgNC41IDAgMTExNS41IDZ6XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ3NoaWVsZCc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0xMiAzbDggM3Y2YTEwIDEwIDAgMDEtOCA5IDEwIDEwIDAgMDEtOC05VjZsOC0zelwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdsaXN0JzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTcgNmgxMk03IDEyaDEyTTcgMThoMTJcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNNCA2aC4wMU00IDEyaC4wMU00IDE4aC4wMVwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICd1c2VyJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTEyIDEyYTQgNCAwIDEwMC04IDQgNCAwIDAwMCA4elwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk00IDIwYTggOCAwIDAxMTYgMFwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdsb2NrJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cmVjdCB4PVwiNVwiIHk9XCIxMFwiIHdpZHRoPVwiMTRcIiBoZWlnaHQ9XCIxMFwiIHJ4PVwiMlwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk04IDEwVjdhNCA0IDAgMTE4IDB2M1wiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdleWUnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNMiAxMnM0LTcgMTAtNyAxMCA3IDEwIDctNCA3LTEwIDctMTAtNy0xMC03elwiICR7c3Ryb2tlfS8+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIzXCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ2V5ZS1vZmYnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNMiAxMnM0LTcgMTAtNyAxMCA3IDEwIDctNCA3LTEwIDctMTAtNy0xMC03elwiICR7c3Ryb2tlfS8+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIzXCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTMgM2wxOCAxOFwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdzd29yZCc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0zIDIxbDYtNk05IDE1bDktOSAzIDMtOSA5TTE0IDZsNCA0XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ3Ryb3BoeSc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk04IDIxaDhNOSAxN2g2TTcgNGgxMHY1YTUgNSAwIDExLTEwIDBWNHpcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNNCA2aDN2MmEzIDMgMCAxMS0zLTJ6TTIwIDZoLTN2MmEzIDMgMCAwMDMtMnpcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnY2xvY2snOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiOC41XCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTEyIDd2Nmw0IDJcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnYm9sdCc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0xMyAyTDYgMTRoNWwtMSA4IDctMTJoLTVsMS04elwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICd0cmFzaCc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk00IDdoMTZNOSA3VjVoNnYyTTcgN2wxIDEzaDhsMS0xM1wiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdjbG9zZSc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk02IDZsMTIgMTJNNiAxOEwxOCA2XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ2Fycm93LXJpZ2h0JzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTQgMTJoMTRNMTIgNWw3IDctNyA3XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ3RhcmdldCc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCI4LjVcIiAke3N0cm9rZX0vPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiNC41XCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTEyIDJ2M00xMiAxOXYzTTIgMTJoM00xOSAxMmgzXCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ2JveCc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0xMiAzbDkgNS05IDUtOS01IDktNXpcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNMyA4djhsOSA1IDktNVY4XCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTEyIDEzdjhcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnaW5mbyc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCI4LjVcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNMTIgMTB2NlwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk0xMiA3aC4wMVwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdsb2dvdXQnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNMTQgOFY1YTEgMSAwIDAwLTEtMUg1YTEgMSAwIDAwLTEgMXYxNGExIDEgMCAwMDEgMWg4YTEgMSAwIDAwMS0xdi0zXCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTkgMTJoMTFNMTYgOGw0IDQtNCA0XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ3gnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNNiA2bDEyIDEyTTE4IDZMNiAxOFwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiOVwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgfVxufVxuIiwgImltcG9ydCB7IHJlbmRlckljb24gfSBmcm9tICcuL0ljb24nO1xuXG5sZXQgX2JveDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcblxuZnVuY3Rpb24gZW5zdXJlQm94KCk6IEhUTUxFbGVtZW50IHtcbiAgaWYgKF9ib3gpIHJldHVybiBfYm94O1xuICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgZGl2LmNsYXNzTmFtZSA9ICd0b2FzdC13cmFwJztcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkaXYpO1xuICBfYm94ID0gZGl2O1xuICByZXR1cm4gZGl2O1xufVxuXG50eXBlIFRvYXN0VHlwZSA9ICdpbmZvJyB8ICdzdWNjZXNzJyB8ICd3YXJuJyB8ICdlcnJvcic7XG50eXBlIFRvYXN0T3B0aW9ucyA9IHsgdHlwZT86IFRvYXN0VHlwZTsgZHVyYXRpb24/OiBudW1iZXIgfTtcblxuZXhwb3J0IGZ1bmN0aW9uIHNob3dUb2FzdCh0ZXh0OiBzdHJpbmcsIG9wdHM/OiBUb2FzdFR5cGUgfCBUb2FzdE9wdGlvbnMpIHtcbiAgY29uc3QgYm94ID0gZW5zdXJlQm94KCk7XG4gIGNvbnN0IGl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgbGV0IHR5cGU6IFRvYXN0VHlwZSB8IHVuZGVmaW5lZDtcbiAgbGV0IGR1cmF0aW9uID0gMzUwMDtcbiAgaWYgKHR5cGVvZiBvcHRzID09PSAnc3RyaW5nJykgdHlwZSA9IG9wdHM7XG4gIGVsc2UgaWYgKG9wdHMpIHsgdHlwZSA9IG9wdHMudHlwZTsgaWYgKG9wdHMuZHVyYXRpb24pIGR1cmF0aW9uID0gb3B0cy5kdXJhdGlvbjsgfVxuICBpdGVtLmNsYXNzTmFtZSA9ICd0b2FzdCcgKyAodHlwZSA/ICcgJyArIHR5cGUgOiAnJyk7XG4gIC8vIGljb24gKyB0ZXh0IGNvbnRhaW5lclxuICB0cnkge1xuICAgIGNvbnN0IHdyYXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB3cmFwLnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XG4gICAgd3JhcC5zdHlsZS5nYXAgPSAnOHB4JztcbiAgICB3cmFwLnN0eWxlLmFsaWduSXRlbXMgPSAnY2VudGVyJztcbiAgICBjb25zdCBpY29OYW1lID0gdHlwZSA9PT0gJ3N1Y2Nlc3MnID8gJ2JvbHQnIDogdHlwZSA9PT0gJ3dhcm4nID8gJ2Nsb2NrJyA6IHR5cGUgPT09ICdlcnJvcicgPyAnY2xvc2UnIDogJ2luZm8nO1xuICAgIGNvbnN0IGljb0hvc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgaWNvSG9zdC5hcHBlbmRDaGlsZChyZW5kZXJJY29uKGljb05hbWUsIHsgc2l6ZTogMTggfSkpO1xuICAgIGNvbnN0IHR4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHR4dC50ZXh0Q29udGVudCA9IHRleHQ7XG4gICAgd3JhcC5hcHBlbmRDaGlsZChpY29Ib3N0KTtcbiAgICB3cmFwLmFwcGVuZENoaWxkKHR4dCk7XG4gICAgaXRlbS5hcHBlbmRDaGlsZCh3cmFwKTtcbiAgfSBjYXRjaCB7XG4gICAgaXRlbS50ZXh0Q29udGVudCA9IHRleHQ7XG4gIH1cbiAgY29uc3QgbGlmZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2knKTtcbiAgbGlmZS5jbGFzc05hbWUgPSAnbGlmZSc7XG4gIGxpZmUuc3R5bGUuc2V0UHJvcGVydHkoJy0tbGlmZScsIGR1cmF0aW9uICsgJ21zJyk7XG4gIGl0ZW0uYXBwZW5kQ2hpbGQobGlmZSk7XG4gIGJveC5wcmVwZW5kKGl0ZW0pO1xuICAvLyBncmFjZWZ1bCBleGl0XG4gIGNvbnN0IGZhZGUgPSAoKSA9PiB7IGl0ZW0uc3R5bGUub3BhY2l0eSA9ICcwJzsgaXRlbS5zdHlsZS50cmFuc2l0aW9uID0gJ29wYWNpdHkgLjQ1cyc7IHNldFRpbWVvdXQoKCkgPT4gaXRlbS5yZW1vdmUoKSwgNDYwKTsgfTtcbiAgY29uc3QgdGltZXIgPSB3aW5kb3cuc2V0VGltZW91dChmYWRlLCBkdXJhdGlvbik7XG4gIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7IGNsZWFyVGltZW91dCh0aW1lcik7IGZhZGUoKTsgfSk7XG59XG4iLCAiaW1wb3J0IHsgR2FtZU1hbmFnZXIgfSBmcm9tICcuLi9jb3JlL0dhbWVNYW5hZ2VyJztcbmltcG9ydCB7IGh0bWwsIHFzIH0gZnJvbSAnLi4vdXRpbHMvZG9tJztcbmltcG9ydCB7IHNob3dUb2FzdCB9IGZyb20gJy4uL2NvbXBvbmVudHMvVG9hc3QnO1xuaW1wb3J0IHsgcmVuZGVySWNvbiB9IGZyb20gJy4uL2NvbXBvbmVudHMvSWNvbic7XG5cbmV4cG9ydCBjbGFzcyBMb2dpblNjZW5lIHtcbiAgbW91bnQocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICBjb25zdCB2aWV3ID0gaHRtbChgXG4gICAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyIGdyaWQtMlwiIHN0eWxlPVwiY29sb3I6I2ZmZjtcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQgZmFkZS1pblwiIHN0eWxlPVwibWF4LXdpZHRoOjQ2MHB4O21hcmdpbjo0NnB4IGF1dG87XCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInNjZW5lLWhlYWRlclwiPlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPGgxIHN0eWxlPVwiYmFja2dyb3VuZDp2YXIoLS1ncmFkKTstd2Via2l0LWJhY2tncm91bmQtY2xpcDp0ZXh0O2JhY2tncm91bmQtY2xpcDp0ZXh0O2NvbG9yOnRyYW5zcGFyZW50O2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjhweDtcIj48c3BhbiBkYXRhLWljbz1cImhvbWVcIj48L3NwYW4+XHU3N0ZGXHU1NzNBXHU2MzA3XHU2MzI1XHU0RTJEXHU1RkMzPC9oMT5cbiAgICAgICAgICAgICAgPHA+XHU3NjdCXHU1RjU1XHU1NDBFXHU4RkRCXHU1MTY1XHU0RjYwXHU3Njg0XHU4RDVCXHU1MzVBXHU3N0ZGXHU1N0NFXHUzMDAyPC9wPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGlucHV0IGlkPVwidVwiIGNsYXNzPVwiaW5wdXRcIiBwbGFjZWhvbGRlcj1cIlx1NzUyOFx1NjIzN1x1NTQwRFwiIGF1dG9jb21wbGV0ZT1cInVzZXJuYW1lXCIvPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIiBzdHlsZT1cImFsaWduLWl0ZW1zOmNlbnRlcjtcIj5cbiAgICAgICAgICAgIDxpbnB1dCBpZD1cInBcIiBjbGFzcz1cImlucHV0XCIgcGxhY2Vob2xkZXI9XCJcdTVCQzZcdTc4MDFcIiB0eXBlPVwicGFzc3dvcmRcIiBhdXRvY29tcGxldGU9XCJjdXJyZW50LXBhc3N3b3JkXCIvPlxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInJldmVhbFwiIGNsYXNzPVwiYnRuIGJ0bi1naG9zdFwiIHN0eWxlPVwibWluLXdpZHRoOjExMHB4O1wiPjxzcGFuIGRhdGEtaWNvPVwiZXllXCI+PC9zcGFuPlx1NjYzRVx1NzkzQTwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxidXR0b24gaWQ9XCJnb1wiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCIgc3R5bGU9XCJ3aWR0aDoxMDAlO21hcmdpbi10b3A6OHB4O1wiPjxzcGFuIGRhdGEtaWNvPVwiYXJyb3ctcmlnaHRcIj48L3NwYW4+XHU4RkRCXHU1MTY1XHU2RTM4XHU2MjBGPC9idXR0b24+XG4gICAgICAgICAgPGRpdiBzdHlsZT1cIm1hcmdpbi10b3A6OHB4O29wYWNpdHk6Ljc1O2ZvbnQtc2l6ZToxMnB4O1wiPlx1NjNEMFx1NzkzQVx1RkYxQVx1ODJFNVx1OEQyNlx1NjIzN1x1NEUwRFx1NUI1OFx1NTcyOFx1RkYwQ1x1NUMwNlx1ODFFQVx1NTJBOFx1NTIxQlx1NUVGQVx1NUU3Nlx1NzY3Qlx1NUY1NVx1MzAwMjwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIGApO1xuICAgIHJvb3QuaW5uZXJIVE1MID0gJyc7XG4gICAgcm9vdC5hcHBlbmRDaGlsZCh2aWV3KTtcblxuICAgIC8vIFx1NkUzMlx1NjdEM1x1NjI0MFx1NjcwOVx1NTZGRVx1NjgwN1xuICAgIHRyeSB7XG4gICAgICB2aWV3LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWljb10nKS5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICBjb25zdCBuYW1lID0gKGVsIGFzIEhUTUxFbGVtZW50KS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWNvJykgYXMgYW55O1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGVsLmFwcGVuZENoaWxkKHJlbmRlckljb24obmFtZSwgeyBzaXplOiAyMiB9KSk7XG4gICAgICAgIH0gY2F0Y2gge31cbiAgICAgIH0pO1xuICAgIH0gY2F0Y2gge31cblxuICAgIGNvbnN0IHVFbCA9IHFzPEhUTUxJbnB1dEVsZW1lbnQ+KHZpZXcsICcjdScpO1xuICAgIGNvbnN0IHBFbCA9IHFzPEhUTUxJbnB1dEVsZW1lbnQ+KHZpZXcsICcjcCcpO1xuICAgIGNvbnN0IGdvID0gcXM8SFRNTEJ1dHRvbkVsZW1lbnQ+KHZpZXcsICcjZ28nKTtcbiAgICBjb25zdCByZXZlYWwgPSBxczxIVE1MQnV0dG9uRWxlbWVudD4odmlldywgJyNyZXZlYWwnKTtcblxuICAgIC8vIFx1NEY3Rlx1NzUyOCByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgXHU3ODZFXHU0RkREXHU2RTMyXHU2N0QzXHU1QjhDXHU2MjEwXHU1NDBFXHU3QUNCXHU1MzczXHU4MDVBXHU3MTI2XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgIHVFbC5mb2N1cygpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBzdWJtaXQgPSBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB1c2VybmFtZSA9ICh1RWwudmFsdWUgfHwgJycpLnRyaW0oKTtcbiAgICAgIGNvbnN0IHBhc3N3b3JkID0gKHBFbC52YWx1ZSB8fCAnJykudHJpbSgpO1xuICAgICAgaWYgKCF1c2VybmFtZSB8fCAhcGFzc3dvcmQpIHtcbiAgICAgICAgc2hvd1RvYXN0KCdcdThCRjdcdTU4NkJcdTUxOTlcdTc1MjhcdTYyMzdcdTU0MERcdTU0OENcdTVCQzZcdTc4MDEnLCAnd2FybicpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBnby5kaXNhYmxlZCA9IHRydWU7XG4gICAgICBnby50ZXh0Q29udGVudCA9ICdcdTc2N0JcdTVGNTVcdTRFMkRcdTIwMjYnO1xuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgR2FtZU1hbmFnZXIuSS5sb2dpbk9yUmVnaXN0ZXIodXNlcm5hbWUsIHBhc3N3b3JkKTtcbiAgICAgICAgbG9jYXRpb24uaGFzaCA9ICcjL21haW4nO1xuICAgICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgIHNob3dUb2FzdChlPy5tZXNzYWdlIHx8ICdcdTc2N0JcdTVGNTVcdTU5MzFcdThEMjVcdUZGMENcdThCRjdcdTkxQ0RcdThCRDUnLCAnZXJyb3InKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGdvLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIGdvLnRleHRDb250ZW50ID0gJ1x1OEZEQlx1NTE2NVx1NkUzOFx1NjIwRic7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGdvLm9uY2xpY2sgPSBzdWJtaXQ7XG4gICAgdUVsLm9ua2V5dXAgPSAoZSkgPT4geyBpZiAoKGUgYXMgS2V5Ym9hcmRFdmVudCkua2V5ID09PSAnRW50ZXInKSBzdWJtaXQoKTsgfTtcbiAgICBwRWwub25rZXl1cCA9IChlKSA9PiB7IGlmICgoZSBhcyBLZXlib2FyZEV2ZW50KS5rZXkgPT09ICdFbnRlcicpIHN1Ym1pdCgpOyB9O1xuICAgIHJldmVhbC5vbmNsaWNrID0gKCkgPT4ge1xuICAgICAgY29uc3QgaXNQd2QgPSBwRWwudHlwZSA9PT0gJ3Bhc3N3b3JkJztcbiAgICAgIHBFbC50eXBlID0gaXNQd2QgPyAndGV4dCcgOiAncGFzc3dvcmQnO1xuICAgICAgcmV2ZWFsLmlubmVySFRNTCA9ICcnO1xuICAgICAgcmV2ZWFsLmFwcGVuZENoaWxkKHJlbmRlckljb24oaXNQd2QgPyAnZXllLW9mZicgOiAnZXllJywgeyBzaXplOiAyMCB9KSk7XG4gICAgICByZXZlYWwuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoaXNQd2QgPyAnXHU5NjkwXHU4NUNGJyA6ICdcdTY2M0VcdTc5M0EnKSk7XG4gICAgfTtcbiAgfVxufVxuIiwgImV4cG9ydCBjb25zdCBBUElfQkFTRSA9ICh3aW5kb3cgYXMgYW55KS5fX0FQSV9CQVNFX18gfHwgJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGknO1xyXG5leHBvcnQgY29uc3QgV1NfRU5EUE9JTlQgPSAod2luZG93IGFzIGFueSkuX19XU19FTkRQT0lOVF9fIHx8ICdodHRwOi8vbG9jYWxob3N0OjMwMDAvZ2FtZSc7XHJcblxyXG5cclxuIiwgImltcG9ydCB7IFdTX0VORFBPSU5UIH0gZnJvbSAnLi9FbnYnO1xuXG50eXBlIEhhbmRsZXIgPSAoZGF0YTogYW55KSA9PiB2b2lkO1xuXG5leHBvcnQgY2xhc3MgUmVhbHRpbWVDbGllbnQge1xuICBwcml2YXRlIHN0YXRpYyBfaW5zdGFuY2U6IFJlYWx0aW1lQ2xpZW50O1xuICBzdGF0aWMgZ2V0IEkoKTogUmVhbHRpbWVDbGllbnQge1xuICAgIHJldHVybiB0aGlzLl9pbnN0YW5jZSA/PyAodGhpcy5faW5zdGFuY2UgPSBuZXcgUmVhbHRpbWVDbGllbnQoKSk7XG4gIH1cblxuICBwcml2YXRlIHNvY2tldDogYW55IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgaGFuZGxlcnM6IFJlY29yZDxzdHJpbmcsIEhhbmRsZXJbXT4gPSB7fTtcblxuICBjb25uZWN0KHRva2VuOiBzdHJpbmcpIHtcbiAgICBjb25zdCB3ID0gd2luZG93IGFzIGFueTtcbiAgICBpZiAody5pbykge1xuICAgICAgaWYgKHRoaXMuc29ja2V0ICYmICh0aGlzLnNvY2tldC5jb25uZWN0ZWQgfHwgdGhpcy5zb2NrZXQuY29ubmVjdGluZykpIHJldHVybjtcbiAgICAgIHRoaXMuc29ja2V0ID0gdy5pbyhXU19FTkRQT0lOVCwgeyBhdXRoOiB7IHRva2VuIH0gfSk7XG4gICAgICB0aGlzLnNvY2tldC5vbignY29ubmVjdCcsICgpID0+IHt9KTtcbiAgICAgIHRoaXMuc29ja2V0Lm9uQW55KChldmVudDogc3RyaW5nLCBwYXlsb2FkOiBhbnkpID0+IHRoaXMuZW1pdExvY2FsKGV2ZW50LCBwYXlsb2FkKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHNvY2tldC5pbyBjbGllbnQgbm90IGxvYWRlZDsgZGlzYWJsZSByZWFsdGltZSB1cGRhdGVzXG4gICAgICB0aGlzLnNvY2tldCA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgb24oZXZlbnQ6IHN0cmluZywgaGFuZGxlcjogSGFuZGxlcikge1xuICAgICh0aGlzLmhhbmRsZXJzW2V2ZW50XSB8fD0gW10pLnB1c2goaGFuZGxlcik7XG4gIH1cblxuICBvZmYoZXZlbnQ6IHN0cmluZywgaGFuZGxlcjogSGFuZGxlcikge1xuICAgIGNvbnN0IGFyciA9IHRoaXMuaGFuZGxlcnNbZXZlbnRdO1xuICAgIGlmICghYXJyKSByZXR1cm47XG4gICAgY29uc3QgaWR4ID0gYXJyLmluZGV4T2YoaGFuZGxlcik7XG4gICAgaWYgKGlkeCA+PSAwKSBhcnIuc3BsaWNlKGlkeCwgMSk7XG4gIH1cblxuICBwcml2YXRlIGVtaXRMb2NhbChldmVudDogc3RyaW5nLCBwYXlsb2FkOiBhbnkpIHtcbiAgICAodGhpcy5oYW5kbGVyc1tldmVudF0gfHwgW10pLmZvckVhY2goKGgpID0+IGgocGF5bG9hZCkpO1xuICB9XG59XG4iLCAiaW1wb3J0IHsgR2FtZU1hbmFnZXIgfSBmcm9tICcuLi9jb3JlL0dhbWVNYW5hZ2VyJztcbmltcG9ydCB7IHJlbmRlckljb24gfSBmcm9tICcuL0ljb24nO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyTmF2KGFjdGl2ZTogc3RyaW5nKTogSFRNTEVsZW1lbnQge1xuICBjb25zdCB0YWJzOiB7IGtleTogc3RyaW5nOyB0ZXh0OiBzdHJpbmc7IGhyZWY6IHN0cmluZzsgaWNvbjogYW55IH1bXSA9IFtcbiAgICB7IGtleTogJ21haW4nLCB0ZXh0OiAnXHU0RTNCXHU5ODc1JywgaHJlZjogJyMvbWFpbicsIGljb246ICdob21lJyB9LFxuICAgIHsga2V5OiAnd2FyZWhvdXNlJywgdGV4dDogJ1x1NEVEM1x1NUU5MycsIGhyZWY6ICcjL3dhcmVob3VzZScsIGljb246ICd3YXJlaG91c2UnIH0sXG4gICAgeyBrZXk6ICdwbHVuZGVyJywgdGV4dDogJ1x1NjNBMFx1NTkzQScsIGhyZWY6ICcjL3BsdW5kZXInLCBpY29uOiAncGx1bmRlcicgfSxcbiAgICB7IGtleTogJ2V4Y2hhbmdlJywgdGV4dDogJ1x1NEVBNFx1NjYxM1x1NjI0MCcsIGhyZWY6ICcjL2V4Y2hhbmdlJywgaWNvbjogJ2V4Y2hhbmdlJyB9LFxuICAgIHsga2V5OiAncmFua2luZycsIHRleHQ6ICdcdTYzOTJcdTg4NEMnLCBocmVmOiAnIy9yYW5raW5nJywgaWNvbjogJ3JhbmtpbmcnIH0sXG4gIF07XG4gIGNvbnN0IHdyYXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgd3JhcC5jbGFzc05hbWUgPSAnbmF2JztcbiAgZm9yIChjb25zdCB0IG9mIHRhYnMpIHtcbiAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGEuaHJlZiA9IHQuaHJlZjtcbiAgICBjb25zdCBpY28gPSByZW5kZXJJY29uKHQuaWNvbiwgeyBzaXplOiAxOCwgY2xhc3NOYW1lOiAnaWNvJyB9KTtcbiAgICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBsYWJlbC50ZXh0Q29udGVudCA9IHQudGV4dDtcbiAgICBhLmFwcGVuZENoaWxkKGljbyk7XG4gICAgYS5hcHBlbmRDaGlsZChsYWJlbCk7XG4gICAgaWYgKHQua2V5ID09PSBhY3RpdmUpIGEuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgd3JhcC5hcHBlbmRDaGlsZChhKTtcbiAgfVxuICBcbiAgLy8gXHU2REZCXHU1MkEwXHU5MDAwXHU1MUZBXHU3NjdCXHU1RjU1XHU2MzA5XHU5NEFFXG4gIGNvbnN0IGxvZ291dEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgbG9nb3V0QnRuLmhyZWYgPSAnIyc7XG4gIGxvZ291dEJ0bi5jbGFzc05hbWUgPSAnbmF2LWxvZ291dCc7XG4gIGxvZ291dEJ0bi5zdHlsZS5jc3NUZXh0ID0gJ21hcmdpbi1sZWZ0OmF1dG87b3BhY2l0eTouNzU7JztcbiAgY29uc3QgbG9nb3V0SWNvID0gcmVuZGVySWNvbignbG9nb3V0JywgeyBzaXplOiAxOCwgY2xhc3NOYW1lOiAnaWNvJyB9KTtcbiAgY29uc3QgbG9nb3V0TGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gIGxvZ291dExhYmVsLnRleHRDb250ZW50ID0gJ1x1OTAwMFx1NTFGQSc7XG4gIGxvZ291dEJ0bi5hcHBlbmRDaGlsZChsb2dvdXRJY28pO1xuICBsb2dvdXRCdG4uYXBwZW5kQ2hpbGQobG9nb3V0TGFiZWwpO1xuICBsb2dvdXRCdG4ub25jbGljayA9IChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGlmIChjb25maXJtKCdcdTc4NkVcdTVCOUFcdTg5ODFcdTkwMDBcdTUxRkFcdTc2N0JcdTVGNTVcdTU0MTdcdUZGMUYnKSkge1xuICAgICAgR2FtZU1hbmFnZXIuSS5sb2dvdXQoKTtcbiAgICB9XG4gIH07XG4gIHdyYXAuYXBwZW5kQ2hpbGQobG9nb3V0QnRuKTtcbiAgXG4gIHJldHVybiB3cmFwO1xufVxuIiwgImV4cG9ydCBjbGFzcyBDb3VudFVwVGV4dCB7XHJcbiAgcHJpdmF0ZSB2YWx1ZSA9IDA7XHJcbiAgcHJpdmF0ZSBkaXNwbGF5ID0gJzAnO1xyXG4gIHByaXZhdGUgYW5pbT86IG51bWJlcjtcclxuICBvblVwZGF0ZT86ICh0ZXh0OiBzdHJpbmcpID0+IHZvaWQ7XHJcblxyXG4gIHNldChuOiBudW1iZXIpIHtcclxuICAgIHRoaXMudmFsdWUgPSBuO1xyXG4gICAgdGhpcy5kaXNwbGF5ID0gdGhpcy5mb3JtYXQobik7XHJcbiAgICB0aGlzLm9uVXBkYXRlPy4odGhpcy5kaXNwbGF5KTtcclxuICB9XHJcblxyXG4gIHRvKG46IG51bWJlciwgZHVyYXRpb24gPSA1MDApIHtcclxuICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuYW5pbSEpO1xyXG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLnZhbHVlO1xyXG4gICAgY29uc3QgZGVsdGEgPSBuIC0gc3RhcnQ7XHJcbiAgICBjb25zdCB0MCA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgY29uc3Qgc3RlcCA9ICh0OiBudW1iZXIpID0+IHtcclxuICAgICAgY29uc3QgcCA9IE1hdGgubWluKDEsICh0IC0gdDApIC8gZHVyYXRpb24pO1xyXG4gICAgICBjb25zdCBlYXNlID0gMSAtIE1hdGgucG93KDEgLSBwLCAzKTtcclxuICAgICAgY29uc3QgY3VyciA9IHN0YXJ0ICsgZGVsdGEgKiBlYXNlO1xyXG4gICAgICB0aGlzLmRpc3BsYXkgPSB0aGlzLmZvcm1hdChjdXJyKTtcclxuICAgICAgdGhpcy5vblVwZGF0ZT8uKHRoaXMuZGlzcGxheSk7XHJcbiAgICAgIGlmIChwIDwgMSkgdGhpcy5hbmltID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApO1xyXG4gICAgICBlbHNlIHRoaXMudmFsdWUgPSBuO1xyXG4gICAgfTtcclxuICAgIHRoaXMuYW5pbSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZm9ybWF0KG46IG51bWJlcikge1xyXG4gICAgcmV0dXJuIE1hdGguZmxvb3IobikudG9Mb2NhbGVTdHJpbmcoKTtcclxuICB9XHJcbn1cclxuXHJcblxyXG4iLCAiaW1wb3J0IHsgTmV0d29ya01hbmFnZXIgfSBmcm9tICcuLi9jb3JlL05ldHdvcmtNYW5hZ2VyJztcbmltcG9ydCB7IHJlbmRlckljb24gfSBmcm9tICcuL0ljb24nO1xuaW1wb3J0IHsgQ291bnRVcFRleHQgfSBmcm9tICcuL0NvdW50VXBUZXh0JztcblxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlclJlc291cmNlQmFyKCkge1xuICBjb25zdCBib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgYm94LmNsYXNzTmFtZSA9ICdjb250YWluZXInO1xuICBjb25zdCBjYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNhcmQuY2xhc3NOYW1lID0gJ2NhcmQgZmFkZS1pbic7XG4gIGNhcmQuaW5uZXJIVE1MID0gYFxuICAgIDxkaXYgY2xhc3M9XCJzdGF0c1wiPlxuICAgICAgPGRpdiBjbGFzcz1cInN0YXRcIiBpZD1cIm9yZS1zdGF0XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJpY29cIiBkYXRhLWljbz1cIm9yZVwiPjwvZGl2PlxuICAgICAgICA8ZGl2IHN0eWxlPVwiZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6MnB4O1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJ2YWxcIiBpZD1cIm9yZVwiPjA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibGFiZWxcIj5cdTc3RkZcdTc3RjM8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJzdGF0XCIgaWQ9XCJjb2luLXN0YXRcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImljb1wiIGRhdGEtaWNvPVwiY29pblwiPjwvZGl2PlxuICAgICAgICA8ZGl2IHN0eWxlPVwiZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6MnB4O1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJ2YWxcIiBpZD1cImNvaW5cIj4wPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImxhYmVsXCI+QkI8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgYDtcbiAgYm94LmFwcGVuZENoaWxkKGNhcmQpO1xuICAvLyBpbmplY3QgaWNvbnNcbiAgdHJ5IHtcbiAgICBjb25zdCBvcmVJY28gPSBjYXJkLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWljbz1cIm9yZVwiXScpO1xuICAgIGNvbnN0IGNvaW5JY28gPSBjYXJkLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWljbz1cImNvaW5cIl0nKTtcbiAgICBpZiAob3JlSWNvKSBvcmVJY28uYXBwZW5kQ2hpbGQocmVuZGVySWNvbignb3JlJywgeyBzaXplOiAxOCB9KSk7XG4gICAgaWYgKGNvaW5JY28pIGNvaW5JY28uYXBwZW5kQ2hpbGQocmVuZGVySWNvbignY29pbicsIHsgc2l6ZTogMTggfSkpO1xuICB9IGNhdGNoIHt9XG4gIFxuICBjb25zdCBvcmVFbCA9IGNhcmQucXVlcnlTZWxlY3RvcignI29yZScpIGFzIEhUTUxFbGVtZW50O1xuICBjb25zdCBjb2luRWwgPSBjYXJkLnF1ZXJ5U2VsZWN0b3IoJyNjb2luJykgYXMgSFRNTEVsZW1lbnQ7XG4gIFxuICBjb25zdCBvcmVDb3VudGVyID0gbmV3IENvdW50VXBUZXh0KCk7XG4gIGNvbnN0IGNvaW5Db3VudGVyID0gbmV3IENvdW50VXBUZXh0KCk7XG4gIG9yZUNvdW50ZXIub25VcGRhdGUgPSAodGV4dCkgPT4geyBvcmVFbC50ZXh0Q29udGVudCA9IHRleHQ7IH07XG4gIGNvaW5Db3VudGVyLm9uVXBkYXRlID0gKHRleHQpID0+IHsgY29pbkVsLnRleHRDb250ZW50ID0gdGV4dDsgfTtcbiAgXG4gIGxldCBwcmV2T3JlID0gMDtcbiAgbGV0IHByZXZDb2luID0gMDtcbiAgXG4gIGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZSgpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcCA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IGlkOiBzdHJpbmc7IHVzZXJuYW1lOiBzdHJpbmc7IG5pY2tuYW1lOiBzdHJpbmc7IG9yZUFtb3VudDogbnVtYmVyOyBiYkNvaW5zOiBudW1iZXIgfT4oJy91c2VyL3Byb2ZpbGUnKTtcbiAgICAgIFxuICAgICAgLy8gXHU0RjdGXHU3NTI4XHU4QkExXHU2NTcwXHU1MkE4XHU3NTNCXHU2NkY0XHU2NUIwXG4gICAgICBpZiAocC5vcmVBbW91bnQgIT09IHByZXZPcmUpIHtcbiAgICAgICAgb3JlQ291bnRlci50byhwLm9yZUFtb3VudCwgODAwKTtcbiAgICAgICAgLy8gXHU1OTgyXHU2NzlDXHU2NjJGXHU1ODlFXHU1MkEwXHVGRjBDXHU2REZCXHU1MkEwXHU1NkZFXHU2ODA3XHU4MTA5XHU1MUIyXHU2NTQ4XHU2NzlDXG4gICAgICAgIGlmIChwLm9yZUFtb3VudCA+IHByZXZPcmUpIHtcbiAgICAgICAgICBjb25zdCBvcmVJY29uID0gY2FyZC5xdWVyeVNlbGVjdG9yKCcjb3JlLXN0YXQgLmljbycpO1xuICAgICAgICAgIGlmIChvcmVJY29uKSB7XG4gICAgICAgICAgICBvcmVJY29uLmNsYXNzTGlzdC5hZGQoJ3B1bHNlLWljb24nKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gb3JlSWNvbi5jbGFzc0xpc3QucmVtb3ZlKCdwdWxzZS1pY29uJyksIDYwMCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHByZXZPcmUgPSBwLm9yZUFtb3VudDtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgaWYgKHAuYmJDb2lucyAhPT0gcHJldkNvaW4pIHtcbiAgICAgICAgY29pbkNvdW50ZXIudG8ocC5iYkNvaW5zLCA4MDApO1xuICAgICAgICBpZiAocC5iYkNvaW5zID4gcHJldkNvaW4pIHtcbiAgICAgICAgICBjb25zdCBjb2luSWNvbiA9IGNhcmQucXVlcnlTZWxlY3RvcignI2NvaW4tc3RhdCAuaWNvJyk7XG4gICAgICAgICAgaWYgKGNvaW5JY29uKSB7XG4gICAgICAgICAgICBjb2luSWNvbi5jbGFzc0xpc3QuYWRkKCdwdWxzZS1pY29uJyk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGNvaW5JY29uLmNsYXNzTGlzdC5yZW1vdmUoJ3B1bHNlLWljb24nKSwgNjAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcHJldkNvaW4gPSBwLmJiQ29pbnM7XG4gICAgICB9XG4gICAgfSBjYXRjaCB7XG4gICAgICAvLyBpZ25vcmUgZmV0Y2ggZXJyb3JzOyBVSSBcdTRGMUFcdTU3MjhcdTRFMEJcdTRFMDBcdTZCMjFcdTUyMzdcdTY1QjBcdTY1RjZcdTYwNjJcdTU5MERcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHsgcm9vdDogYm94LCB1cGRhdGUsIG9yZUVsLCBjb2luRWwgfTtcbn1cbiIsICJpbXBvcnQgeyBOZXR3b3JrTWFuYWdlciB9IGZyb20gJy4uL2NvcmUvTmV0d29ya01hbmFnZXInO1xyXG5pbXBvcnQgeyBSZWFsdGltZUNsaWVudCB9IGZyb20gJy4uL2NvcmUvUmVhbHRpbWVDbGllbnQnO1xyXG5pbXBvcnQgeyBodG1sLCBxcyB9IGZyb20gJy4uL3V0aWxzL2RvbSc7XHJcbmltcG9ydCB7IHJlbmRlck5hdiB9IGZyb20gJy4uL2NvbXBvbmVudHMvTmF2JztcclxuaW1wb3J0IHsgcmVuZGVyUmVzb3VyY2VCYXIgfSBmcm9tICcuLi9jb21wb25lbnRzL1Jlc291cmNlQmFyJztcclxuaW1wb3J0IHsgc2hvd1RvYXN0IH0gZnJvbSAnLi4vY29tcG9uZW50cy9Ub2FzdCc7XHJcbmltcG9ydCB7IHNwYXduRmxvYXRUZXh0IH0gZnJvbSAnLi4vY29tcG9uZW50cy9GbG9hdFRleHQnO1xyXG5pbXBvcnQgeyByZW5kZXJJY29uIH0gZnJvbSAnLi4vY29tcG9uZW50cy9JY29uJztcclxuXHJcbnR5cGUgTWluZVN0YXR1cyA9IHtcclxuICBjYXJ0QW1vdW50OiBudW1iZXI7XHJcbiAgY2FydENhcGFjaXR5OiBudW1iZXI7XHJcbiAgY29sbGFwc2VkOiBib29sZWFuO1xyXG4gIGNvbGxhcHNlZFJlbWFpbmluZzogbnVtYmVyO1xyXG4gIHJ1bm5pbmc6IGJvb2xlYW47XHJcbiAgaW50ZXJ2YWxNczogbnVtYmVyO1xyXG59O1xyXG5cclxudHlwZSBQZW5kaW5nQWN0aW9uID0gJ3N0YXJ0JyB8ICdzdG9wJyB8ICdjb2xsZWN0JyB8ICdyZXBhaXInIHwgJ3N0YXR1cycgfCBudWxsO1xyXG5cclxuZXhwb3J0IGNsYXNzIE1haW5TY2VuZSB7XHJcbiAgcHJpdmF0ZSB2aWV3OiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xyXG4gIHByaXZhdGUgY2FydEFtdCA9IDA7XHJcbiAgcHJpdmF0ZSBjYXJ0Q2FwID0gMTAwMDtcclxuICBwcml2YXRlIGlzTWluaW5nID0gZmFsc2U7XHJcbiAgcHJpdmF0ZSBpc0NvbGxhcHNlZCA9IGZhbHNlO1xyXG4gIHByaXZhdGUgY29sbGFwc2VSZW1haW5pbmcgPSAwO1xyXG4gIHByaXZhdGUgY29sbGFwc2VUaW1lcjogbnVtYmVyIHwgbnVsbCA9IG51bGw7XHJcbiAgcHJpdmF0ZSBpbnRlcnZhbE1zID0gMzAwMDtcclxuICBwcml2YXRlIHBlbmRpbmc6IFBlbmRpbmdBY3Rpb24gPSBudWxsO1xyXG5cclxuICBwcml2YXRlIGVscyA9IHtcclxuICAgIGZpbGw6IG51bGwgYXMgSFRNTEVsZW1lbnQgfCBudWxsLFxyXG4gICAgcGVyY2VudDogbnVsbCBhcyBIVE1MRWxlbWVudCB8IG51bGwsXHJcbiAgICBzdGF0dXNUZXh0OiBudWxsIGFzIEhUTUxFbGVtZW50IHwgbnVsbCxcclxuICAgIHJpbmc6IG51bGwgYXMgSFRNTEVsZW1lbnQgfCBudWxsLFxyXG4gICAgcmluZ1BjdDogbnVsbCBhcyBIVE1MRWxlbWVudCB8IG51bGwsXHJcbiAgICBjeWNsZTogbnVsbCBhcyBIVE1MRWxlbWVudCB8IG51bGwsXHJcbiAgICBzdGF0dXNUYWc6IG51bGwgYXMgSFRNTEVsZW1lbnQgfCBudWxsLFxyXG4gICAgZXZlbnRzOiBudWxsIGFzIEhUTUxFbGVtZW50IHwgbnVsbCxcclxuICAgIHN0YXJ0OiBudWxsIGFzIEhUTUxCdXR0b25FbGVtZW50IHwgbnVsbCxcclxuICAgIHN0b3A6IG51bGwgYXMgSFRNTEJ1dHRvbkVsZW1lbnQgfCBudWxsLFxyXG4gICAgY29sbGVjdDogbnVsbCBhcyBIVE1MQnV0dG9uRWxlbWVudCB8IG51bGwsXHJcbiAgICByZXBhaXI6IG51bGwgYXMgSFRNTEJ1dHRvbkVsZW1lbnQgfCBudWxsLFxyXG4gICAgc3RhdHVzQnRuOiBudWxsIGFzIEhUTUxCdXR0b25FbGVtZW50IHwgbnVsbCxcclxuICAgIGhvbG9ncmFtOiBudWxsIGFzIEhUTUxFbGVtZW50IHwgbnVsbCxcclxuICB9O1xyXG5cclxuICBwcml2YXRlIG1pbmVVcGRhdGVIYW5kbGVyPzogKG1zZzogYW55KSA9PiB2b2lkO1xyXG4gIHByaXZhdGUgbWluZUNvbGxhcHNlSGFuZGxlcj86IChtc2c6IGFueSkgPT4gdm9pZDtcclxuICBwcml2YXRlIHBsdW5kZXJIYW5kbGVyPzogKG1zZzogYW55KSA9PiB2b2lkO1xyXG5cclxuICBhc3luYyBtb3VudChyb290OiBIVE1MRWxlbWVudCkge1xyXG4gICAgdGhpcy5jbGVhckNvbGxhcHNlVGltZXIoKTtcclxuICAgIHRoaXMucGVuZGluZyA9IG51bGw7XHJcblxyXG4gICAgY29uc3QgbmF2ID0gcmVuZGVyTmF2KCdtYWluJyk7XHJcbiAgICBjb25zdCBiYXIgPSByZW5kZXJSZXNvdXJjZUJhcigpO1xyXG4gICAgY29uc3QgdmlldyA9IGh0bWwoYFxyXG4gICAgICA8c2VjdGlvbiBjbGFzcz1cIm1haW4tc2NyZWVuXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIm1haW4tYW1iaWVudFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxyXG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJhbWJpZW50IG9yYiBvcmItYVwiPjwvc3Bhbj5cclxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYW1iaWVudCBvcmIgb3JiLWJcIj48L3NwYW4+XHJcbiAgICAgICAgICA8c3BhbiBjbGFzcz1cImFtYmllbnQgZ3JpZFwiPjwvc3Bhbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyIG1haW4tc3RhY2tcIiBzdHlsZT1cImNvbG9yOiNmZmY7XCI+XHJcbiAgICAgICAgICA8c2VjdGlvbiBjbGFzcz1cIm1pbmUgY2FyZCBtaW5lLWNhcmQgZmFkZS1pblwiPlxyXG4gICAgICAgICAgICA8aGVhZGVyIGNsYXNzPVwibWluZS1oZWFkZXJcIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWluZS10aXRsZVwiPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0aXRsZS1pY29uXCIgZGF0YS1pY289XCJwaWNrXCI+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0aXRsZS1sYWJlbFwiPlx1NjMxNlx1NzdGRlx1OTc2Mlx1Njc3Rjwvc3Bhbj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWluZS1jaGlwc1wiPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwaWxsXCIgaWQ9XCJzdGF0dXNUYWdcIj5cdTVGODVcdTY3M0E8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInBpbGwgcGlsbC1jeWNsZVwiPjxzcGFuIGRhdGEtaWNvPVwiY2xvY2tcIj48L3NwYW4+XHU1NDY4XHU2NzFGIDxzcGFuIGlkPVwiY3ljbGVcIj4zczwvc3Bhbj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvaGVhZGVyPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWluZS1ncmlkXCI+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1pbmUtZ2F1Z2VcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyaW5nXCIgaWQ9XCJyaW5nXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyaW5nLWNvcmVcIj5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBpZD1cInJpbmdQY3RcIj4wJTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8c21hbGw+XHU4OEM1XHU4RjdEXHU3Mzg3PC9zbWFsbD5cclxuICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyaW5nLWdsb3cgcmluZy1nbG93LWFcIj48L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyaW5nLWdsb3cgcmluZy1nbG93LWJcIj48L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWluZS1wcm9ncmVzc1wiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1pbmUtcHJvZ3Jlc3MtbWV0YVwiPlxyXG4gICAgICAgICAgICAgICAgICA8c3Bhbj5cdTc3RkZcdThGNjZcdTg4QzVcdThGN0Q8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgIDxzdHJvbmcgaWQ9XCJwZXJjZW50XCI+MCU8L3N0cm9uZz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1pbmUtcHJvZ3Jlc3MtdHJhY2tcIj5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1pbmUtcHJvZ3Jlc3MtZmlsbFwiIGlkPVwiZmlsbFwiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGlkPVwic3RhdHVzVGV4dFwiIGNsYXNzPVwibWluZS1zdGF0dXNcIj48L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtaW5lLWFjdGlvbnMtZ3JpZFwiPlxyXG4gICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJzdGFydFwiIGNsYXNzPVwiYnRuIGJ0bi1idXkgc3Bhbi0yXCI+PHNwYW4gZGF0YS1pY289XCJwbGF5XCI+PC9zcGFuPlx1NUYwMFx1NTlDQlx1NjMxNlx1NzdGRjwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJzdG9wXCIgY2xhc3M9XCJidG4gYnRuLWdob3N0XCI+PHNwYW4gZGF0YS1pY289XCJzdG9wXCI+PC9zcGFuPlx1NTA1Q1x1NkI2MjwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJjb2xsZWN0XCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIj48c3BhbiBkYXRhLWljbz1cImNvbGxlY3RcIj48L3NwYW4+XHU2NTM2XHU3N0ZGPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInN0YXR1c1wiIGNsYXNzPVwiYnRuIGJ0bi1naG9zdFwiPjxzcGFuIGRhdGEtaWNvPVwicmVmcmVzaFwiPjwvc3Bhbj5cdTUyMzdcdTY1QjBcdTcyQjZcdTYwMDE8L2J1dHRvbj5cclxuICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwicmVwYWlyXCIgY2xhc3M9XCJidG4gYnRuLXNlbGxcIj48c3BhbiBkYXRhLWljbz1cIndyZW5jaFwiPjwvc3Bhbj5cdTRGRUVcdTc0MDY8L2J1dHRvbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtaW5lLWZlZWRcIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZXZlbnQtZmVlZFwiIGlkPVwiZXZlbnRzXCI+PC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWluZS1ob2xvZ3JhbVwiIGlkPVwiaG9sb2dyYW1cIiBhcmlhLWhpZGRlbj1cInRydWVcIj5cclxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm1pbmUtaG9sby1ncmlkXCI+PC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibWluZS1ob2xvLWdyaWQgZGlhZ29uYWxcIj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJtaW5lLWhvbG8tZ2xvd1wiPjwvc3Bhbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L3NlY3Rpb24+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvc2VjdGlvbj5cclxuICAgIGApO1xyXG5cclxuICAgIHJvb3QuaW5uZXJIVE1MID0gJyc7XHJcbiAgICByb290LmFwcGVuZENoaWxkKG5hdik7XHJcbiAgICByb290LmFwcGVuZENoaWxkKGJhci5yb290KTtcclxuICAgIHJvb3QuYXBwZW5kQ2hpbGQodmlldyk7XHJcblxyXG4gICAgdGhpcy52aWV3ID0gdmlldztcclxuICAgIC8vIG1vdW50IGljb25zIGluIGhlYWRlci9idXR0b25zXHJcbiAgICB0cnkge1xyXG4gICAgICB2aWV3LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWljb10nKVxyXG4gICAgICAgIC5mb3JFYWNoKChlbCkgPT4ge1xyXG4gICAgICAgICAgY29uc3QgbmFtZSA9IChlbCBhcyBIVE1MRWxlbWVudCkuZ2V0QXR0cmlidXRlKCdkYXRhLWljbycpIGFzIGFueTtcclxuICAgICAgICAgIHRyeSB7IGVsLmFwcGVuZENoaWxkKHJlbmRlckljb24obmFtZSwgeyBzaXplOiAyMCB9KSk7IH0gY2F0Y2gge31cclxuICAgICAgICB9KTtcclxuICAgIH0gY2F0Y2gge31cclxuICAgIHRoaXMuY2FjaGVFbGVtZW50cygpO1xyXG4gICAgdGhpcy5hdHRhY2hIYW5kbGVycyhiYXIudXBkYXRlLmJpbmQoYmFyKSk7XHJcbiAgICBhd2FpdCBiYXIudXBkYXRlKCk7XHJcbiAgICB0aGlzLnNldHVwUmVhbHRpbWUoKTtcclxuICAgIGF3YWl0IHRoaXMucmVmcmVzaFN0YXR1cygpO1xyXG4gICAgdGhpcy51cGRhdGVQcm9ncmVzcygpO1xyXG4gICAgdGhpcy51cGRhdGVDb250cm9scygpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjYWNoZUVsZW1lbnRzKCkge1xyXG4gICAgaWYgKCF0aGlzLnZpZXcpIHJldHVybjtcclxuICAgIHRoaXMuZWxzLmZpbGwgPSBxcyh0aGlzLnZpZXcsICcjZmlsbCcpO1xyXG4gICAgdGhpcy5lbHMucGVyY2VudCA9IHFzKHRoaXMudmlldywgJyNwZXJjZW50Jyk7XHJcbiAgICB0aGlzLmVscy5zdGF0dXNUZXh0ID0gcXModGhpcy52aWV3LCAnI3N0YXR1c1RleHQnKTtcclxuICAgIHRoaXMuZWxzLnJpbmcgPSB0aGlzLnZpZXcucXVlcnlTZWxlY3RvcignI3JpbmcnKTtcclxuICAgIHRoaXMuZWxzLnJpbmdQY3QgPSB0aGlzLnZpZXcucXVlcnlTZWxlY3RvcignI3JpbmdQY3QnKTtcclxuICAgIHRoaXMuZWxzLmN5Y2xlID0gdGhpcy52aWV3LnF1ZXJ5U2VsZWN0b3IoJyNjeWNsZScpO1xyXG4gICAgdGhpcy5lbHMuc3RhdHVzVGFnID0gdGhpcy52aWV3LnF1ZXJ5U2VsZWN0b3IoJyNzdGF0dXNUYWcnKTtcclxuICAgIHRoaXMuZWxzLmV2ZW50cyA9IHRoaXMudmlldy5xdWVyeVNlbGVjdG9yKCcjZXZlbnRzJyk7XHJcbiAgICB0aGlzLmVscy5zdGFydCA9IHFzPEhUTUxCdXR0b25FbGVtZW50Pih0aGlzLnZpZXcsICcjc3RhcnQnKTtcclxuICAgIHRoaXMuZWxzLnN0b3AgPSBxczxIVE1MQnV0dG9uRWxlbWVudD4odGhpcy52aWV3LCAnI3N0b3AnKTtcclxuICAgIHRoaXMuZWxzLmNvbGxlY3QgPSBxczxIVE1MQnV0dG9uRWxlbWVudD4odGhpcy52aWV3LCAnI2NvbGxlY3QnKTtcclxuICAgIHRoaXMuZWxzLnJlcGFpciA9IHFzPEhUTUxCdXR0b25FbGVtZW50Pih0aGlzLnZpZXcsICcjcmVwYWlyJyk7XHJcbiAgICB0aGlzLmVscy5zdGF0dXNCdG4gPSBxczxIVE1MQnV0dG9uRWxlbWVudD4odGhpcy52aWV3LCAnI3N0YXR1cycpO1xyXG4gICAgdGhpcy5lbHMuaG9sb2dyYW0gPSB0aGlzLnZpZXcucXVlcnlTZWxlY3RvcignI2hvbG9ncmFtJyk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGF0dGFjaEhhbmRsZXJzKHVwZGF0ZUJhcjogKCkgPT4gUHJvbWlzZTx2b2lkPikge1xyXG4gICAgaWYgKCF0aGlzLnZpZXcpIHJldHVybjtcclxuICAgIHRoaXMuZWxzLnN0YXJ0Py5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRoaXMuaGFuZGxlU3RhcnQoKSk7XHJcbiAgICB0aGlzLmVscy5zdG9wPy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRoaXMuaGFuZGxlU3RvcCgpKTtcclxuICAgIHRoaXMuZWxzLnN0YXR1c0J0bj8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0aGlzLnJlZnJlc2hTdGF0dXMoKSk7XHJcbiAgICB0aGlzLmVscy5yZXBhaXI/LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdGhpcy5oYW5kbGVSZXBhaXIoKSk7XHJcbiAgICB0aGlzLmVscy5jb2xsZWN0Py5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRoaXMuaGFuZGxlQ29sbGVjdCh1cGRhdGVCYXIpKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2V0dXBSZWFsdGltZSgpIHtcclxuICAgIGNvbnN0IHRva2VuID0gKE5ldHdvcmtNYW5hZ2VyIGFzIGFueSkuSVsndG9rZW4nXTtcclxuICAgIGlmICh0b2tlbikgUmVhbHRpbWVDbGllbnQuSS5jb25uZWN0KHRva2VuKTtcclxuXHJcbiAgICBpZiAodGhpcy5taW5lVXBkYXRlSGFuZGxlcikgUmVhbHRpbWVDbGllbnQuSS5vZmYoJ21pbmUudXBkYXRlJywgdGhpcy5taW5lVXBkYXRlSGFuZGxlcik7XHJcbiAgICBpZiAodGhpcy5taW5lQ29sbGFwc2VIYW5kbGVyKSBSZWFsdGltZUNsaWVudC5JLm9mZignbWluZS5jb2xsYXBzZScsIHRoaXMubWluZUNvbGxhcHNlSGFuZGxlcik7XHJcbiAgICBpZiAodGhpcy5wbHVuZGVySGFuZGxlcikgUmVhbHRpbWVDbGllbnQuSS5vZmYoJ3BsdW5kZXIuYXR0YWNrZWQnLCB0aGlzLnBsdW5kZXJIYW5kbGVyKTtcclxuXHJcbiAgICB0aGlzLm1pbmVVcGRhdGVIYW5kbGVyID0gKG1zZykgPT4ge1xyXG4gICAgICB0aGlzLmNhcnRBbXQgPSB0eXBlb2YgbXNnLmNhcnRBbW91bnQgPT09ICdudW1iZXInID8gbXNnLmNhcnRBbW91bnQgOiB0aGlzLmNhcnRBbXQ7XHJcbiAgICAgIHRoaXMuY2FydENhcCA9IHR5cGVvZiBtc2cuY2FydENhcGFjaXR5ID09PSAnbnVtYmVyJyA/IG1zZy5jYXJ0Q2FwYWNpdHkgOiB0aGlzLmNhcnRDYXA7XHJcbiAgICAgIHRoaXMuaXNNaW5pbmcgPSBtc2cucnVubmluZyA/PyB0aGlzLmlzTWluaW5nO1xyXG4gICAgICBpZiAobXNnLmNvbGxhcHNlZCAmJiBtc2cuY29sbGFwc2VkUmVtYWluaW5nKSB7XHJcbiAgICAgICAgdGhpcy5iZWdpbkNvbGxhcHNlQ291bnRkb3duKG1zZy5jb2xsYXBzZWRSZW1haW5pbmcpO1xyXG4gICAgICB9IGVsc2UgaWYgKCFtc2cuY29sbGFwc2VkKSB7XHJcbiAgICAgICAgdGhpcy5pc0NvbGxhcHNlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuY2xlYXJDb2xsYXBzZVRpbWVyKCk7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy51cGRhdGVQcm9ncmVzcygpO1xyXG4gICAgICBpZiAobXNnLnR5cGUgPT09ICdjcml0aWNhbCcgJiYgbXNnLmFtb3VudCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZShgXHU4OUU2XHU1M0QxXHU2NkI0XHU1MUZCXHVGRjBDXHU3N0ZGXHU4RjY2XHU1ODlFXHU1MkEwICR7bXNnLmFtb3VudH1cdUZGMDFgKTtcclxuICAgICAgICB0aGlzLmxvZ0V2ZW50KGBcdTY2QjRcdTUxRkIgKyR7bXNnLmFtb3VudH1gKTtcclxuICAgICAgfSBlbHNlIGlmIChtc2cudHlwZSA9PT0gJ25vcm1hbCcgJiYgbXNnLmFtb3VudCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZShgXHU3N0ZGXHU4RjY2XHU1ODlFXHU1MkEwICR7bXNnLmFtb3VudH1cdUZGMENcdTVGNTNcdTUyNEQgJHt0aGlzLmZvcm1hdFBlcmNlbnQoKX1gKTtcclxuICAgICAgICB0aGlzLmxvZ0V2ZW50KGBcdTYzMTZcdTYzOTggKyR7bXNnLmFtb3VudH1gKTtcclxuICAgICAgfSBlbHNlIGlmIChtc2cudHlwZSA9PT0gJ2NvbGxhcHNlJykge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZSgnXHU3N0ZGXHU5MDUzXHU1NzREXHU1ODRDXHVGRjBDXHU4QkY3XHU3QUNCXHU1MzczXHU0RkVFXHU3NDA2Jyk7XHJcbiAgICAgICAgdGhpcy5sb2dFdmVudCgnXHU3N0ZGXHU5MDUzXHU1NzREXHU1ODRDJyk7XHJcbiAgICAgIH0gZWxzZSBpZiAobXNnLnR5cGUgPT09ICdjb2xsZWN0Jykge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZSgnXHU3N0ZGXHU3N0YzXHU1REYyXHU2NTM2XHU5NkM2XHVGRjBDXHU3N0ZGXHU4RjY2XHU2RTA1XHU3QTdBJyk7XHJcbiAgICAgICAgdGhpcy5sb2dFdmVudCgnXHU2NTM2XHU5NkM2XHU1QjhDXHU2MjEwJyk7XHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0NvbGxhcHNlZCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZShgXHU3N0ZGXHU5MDUzXHU1NzREXHU1ODRDXHVGRjBDXHU1MjY5XHU0RjU5ICR7dGhpcy5jb2xsYXBzZVJlbWFpbmluZ31zYCk7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy51cGRhdGVDb250cm9scygpO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLm1pbmVDb2xsYXBzZUhhbmRsZXIgPSAobXNnKSA9PiB7XHJcbiAgICAgIGNvbnN0IHNlY29uZHMgPSBOdW1iZXIobXNnPy5yZXBhaXJfZHVyYXRpb24pIHx8IDA7XHJcbiAgICAgIGlmIChzZWNvbmRzID4gMCkgdGhpcy5iZWdpbkNvbGxhcHNlQ291bnRkb3duKHNlY29uZHMpO1xyXG4gICAgICBzaG93VG9hc3QoYFx1NzdGRlx1OTA1M1x1NTc0RFx1NTg0Q1x1RkYwQ1x1OTcwMFx1NEZFRVx1NzQwNlx1RkYwOFx1N0VBNiAke3NlY29uZHN9c1x1RkYwOWAsICd3YXJuJyk7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMucGx1bmRlckhhbmRsZXIgPSAobXNnKSA9PiB7XHJcbiAgICAgIHNob3dUb2FzdChgXHU4OEFCXHU2M0EwXHU1OTNBXHVGRjFBXHU2NzY1XHU4MUVBICR7bXNnLmF0dGFja2VyfVx1RkYwQ1x1NjM1Rlx1NTkzMSAke21zZy5sb3NzfWAsICd3YXJuJyk7XHJcbiAgICAgIHRoaXMubG9nRXZlbnQoYFx1ODhBQiAke21zZy5hdHRhY2tlcn0gXHU2M0EwXHU1OTNBIC0ke21zZy5sb3NzfWApO1xyXG4gICAgfTtcclxuXHJcbiAgICBSZWFsdGltZUNsaWVudC5JLm9uKCdtaW5lLnVwZGF0ZScsIHRoaXMubWluZVVwZGF0ZUhhbmRsZXIpO1xyXG4gICAgUmVhbHRpbWVDbGllbnQuSS5vbignbWluZS5jb2xsYXBzZScsIHRoaXMubWluZUNvbGxhcHNlSGFuZGxlcik7XHJcbiAgICBSZWFsdGltZUNsaWVudC5JLm9uKCdwbHVuZGVyLmF0dGFja2VkJywgdGhpcy5wbHVuZGVySGFuZGxlcik7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFzeW5jIGhhbmRsZVN0YXJ0KCkge1xyXG4gICAgaWYgKHRoaXMucGVuZGluZyB8fCB0aGlzLmlzQ29sbGFwc2VkKSB7XHJcbiAgICAgIGlmICh0aGlzLmlzQ29sbGFwc2VkKSBzaG93VG9hc3QoJ1x1NzdGRlx1OTA1M1x1NTc0RFx1NTg0Q1x1RkYwQ1x1OEJGN1x1NTE0OFx1NEZFRVx1NzQwNicsICd3YXJuJyk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMucGVuZGluZyA9ICdzdGFydCc7XHJcbiAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzKCk7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBzdGF0dXMgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8TWluZVN0YXR1cz4oJy9taW5lL3N0YXJ0JywgeyBtZXRob2Q6ICdQT1NUJyB9KTtcclxuICAgICAgdGhpcy5hcHBseVN0YXR1cyhzdGF0dXMpO1xyXG4gICAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoJ1x1NzdGRlx1NjczQVx1NURGMlx1NTQyRlx1NTJBOCcpO1xyXG4gICAgICBzaG93VG9hc3QoJ1x1NzdGRlx1NjczQVx1NURGMlx1NTQyRlx1NTJBOCcsICdzdWNjZXNzJyk7XHJcbiAgICB9IGNhdGNoIChlOiBhbnkpIHtcclxuICAgICAgc2hvd1RvYXN0KGU/Lm1lc3NhZ2UgfHwgJ1x1NTQyRlx1NTJBOFx1NTkzMVx1OEQyNScsICdlcnJvcicpO1xyXG4gICAgfSBmaW5hbGx5IHtcclxuICAgICAgdGhpcy5wZW5kaW5nID0gbnVsbDtcclxuICAgICAgdGhpcy51cGRhdGVDb250cm9scygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhc3luYyBoYW5kbGVTdG9wKCkge1xyXG4gICAgaWYgKHRoaXMucGVuZGluZykgcmV0dXJuO1xyXG4gICAgdGhpcy5wZW5kaW5nID0gJ3N0b3AnO1xyXG4gICAgdGhpcy51cGRhdGVDb250cm9scygpO1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3Qgc3RhdHVzID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PE1pbmVTdGF0dXM+KCcvbWluZS9zdG9wJywgeyBtZXRob2Q6ICdQT1NUJyB9KTtcclxuICAgICAgdGhpcy5hcHBseVN0YXR1cyhzdGF0dXMpO1xyXG4gICAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoJ1x1NzdGRlx1NjczQVx1NURGMlx1NTA1Q1x1NkI2MicpO1xyXG4gICAgICBzaG93VG9hc3QoJ1x1NzdGRlx1NjczQVx1NURGMlx1NTA1Q1x1NkI2MicsICdzdWNjZXNzJyk7XHJcbiAgICB9IGNhdGNoIChlOiBhbnkpIHtcclxuICAgICAgc2hvd1RvYXN0KGU/Lm1lc3NhZ2UgfHwgJ1x1NTA1Q1x1NkI2Mlx1NTkzMVx1OEQyNScsICdlcnJvcicpO1xyXG4gICAgfSBmaW5hbGx5IHtcclxuICAgICAgdGhpcy5wZW5kaW5nID0gbnVsbDtcclxuICAgICAgdGhpcy51cGRhdGVDb250cm9scygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhc3luYyBoYW5kbGVDb2xsZWN0KHVwZGF0ZUJhcjogKCkgPT4gUHJvbWlzZTx2b2lkPikge1xyXG4gICAgaWYgKHRoaXMucGVuZGluZyB8fCB0aGlzLmNhcnRBbXQgPD0gMCkgcmV0dXJuO1xyXG4gICAgdGhpcy5wZW5kaW5nID0gJ2NvbGxlY3QnO1xyXG4gICAgdGhpcy51cGRhdGVDb250cm9scygpO1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcmVzID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgY29sbGVjdGVkOiBudW1iZXI7IHN0YXR1czogTWluZVN0YXR1cyB9PignL21pbmUvY29sbGVjdCcsIHsgbWV0aG9kOiAnUE9TVCcgfSk7XHJcbiAgICAgIGlmIChyZXMuc3RhdHVzKSB0aGlzLmFwcGx5U3RhdHVzKHJlcy5zdGF0dXMpO1xyXG4gICAgICBpZiAocmVzLmNvbGxlY3RlZCA+IDApIHtcclxuICAgICAgICAvLyBcdTUyMUJcdTVFRkFcdTYyOUJcdTcyNjlcdTdFQkZcdTk4REVcdTg4NENcdTUyQThcdTc1M0JcclxuICAgICAgICB0aGlzLmNyZWF0ZUZseWluZ09yZUFuaW1hdGlvbihyZXMuY29sbGVjdGVkKTtcclxuICAgICAgICBzaG93VG9hc3QoYFx1NjUzNlx1OTZDNlx1NzdGRlx1NzdGMyAke3Jlcy5jb2xsZWN0ZWR9YCwgJ3N1Y2Nlc3MnKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzaG93VG9hc3QoJ1x1NzdGRlx1OEY2Nlx1NEUzQVx1N0E3QVx1RkYwQ1x1NjVFMFx1NzdGRlx1NzdGM1x1NTNFRlx1NjUzNlx1OTZDNicsICd3YXJuJyk7XHJcbiAgICAgIH1cclxuICAgICAgYXdhaXQgdXBkYXRlQmFyKCk7XHJcbiAgICB9IGNhdGNoIChlOiBhbnkpIHtcclxuICAgICAgc2hvd1RvYXN0KGU/Lm1lc3NhZ2UgfHwgJ1x1NjUzNlx1NzdGRlx1NTkzMVx1OEQyNScsICdlcnJvcicpO1xyXG4gICAgfSBmaW5hbGx5IHtcclxuICAgICAgdGhpcy5wZW5kaW5nID0gbnVsbDtcclxuICAgICAgdGhpcy51cGRhdGVDb250cm9scygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjcmVhdGVGbHlpbmdPcmVBbmltYXRpb24oYW1vdW50OiBudW1iZXIpIHtcclxuICAgIGNvbnN0IGZpbGxFbCA9IHRoaXMuZWxzLmZpbGw7XHJcbiAgICBjb25zdCBvcmVFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNvcmUnKTtcclxuICAgIGlmICghZmlsbEVsIHx8ICFvcmVFbCkgcmV0dXJuO1xyXG5cclxuICAgIGNvbnN0IHN0YXJ0UmVjdCA9IGZpbGxFbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgIGNvbnN0IGVuZFJlY3QgPSBvcmVFbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcbiAgICAvLyBcdTUyMUJcdTVFRkFcdTU5MUFcdTRFMkFcdTc3RkZcdTc3RjNcdTdDOTJcdTVCNTBcclxuICAgIGNvbnN0IHBhcnRpY2xlQ291bnQgPSBNYXRoLm1pbig4LCBNYXRoLm1heCgzLCBNYXRoLmZsb29yKGFtb3VudCAvIDIwKSkpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXJ0aWNsZUNvdW50OyBpKyspIHtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcGFydGljbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBwYXJ0aWNsZS5jbGFzc05hbWUgPSAnb3JlLXBhcnRpY2xlJztcclxuICAgICAgICBwYXJ0aWNsZS50ZXh0Q29udGVudCA9ICdcdUQ4M0RcdURDOEUnO1xyXG4gICAgICAgIHBhcnRpY2xlLnN0eWxlLmNzc1RleHQgPSBgXHJcbiAgICAgICAgICBwb3NpdGlvbjogZml4ZWQ7XHJcbiAgICAgICAgICBsZWZ0OiAke3N0YXJ0UmVjdC5sZWZ0ICsgc3RhcnRSZWN0LndpZHRoIC8gMn1weDtcclxuICAgICAgICAgIHRvcDogJHtzdGFydFJlY3QudG9wICsgc3RhcnRSZWN0LmhlaWdodCAvIDJ9cHg7XHJcbiAgICAgICAgICBmb250LXNpemU6IDI0cHg7XHJcbiAgICAgICAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcclxuICAgICAgICAgIHotaW5kZXg6IDk5OTk7XHJcbiAgICAgICAgICBmaWx0ZXI6IGRyb3Atc2hhZG93KDAgMCA4cHggcmdiYSgxMjMsNDQsMjQ1LDAuOCkpO1xyXG4gICAgICAgIGA7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChwYXJ0aWNsZSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGR4ID0gZW5kUmVjdC5sZWZ0ICsgZW5kUmVjdC53aWR0aCAvIDIgLSBzdGFydFJlY3QubGVmdCAtIHN0YXJ0UmVjdC53aWR0aCAvIDI7XHJcbiAgICAgICAgY29uc3QgZHkgPSBlbmRSZWN0LnRvcCArIGVuZFJlY3QuaGVpZ2h0IC8gMiAtIHN0YXJ0UmVjdC50b3AgLSBzdGFydFJlY3QuaGVpZ2h0IC8gMjtcclxuICAgICAgICBjb25zdCByYW5kb21PZmZzZXQgPSAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiAxMDA7XHJcblxyXG4gICAgICAgIHBhcnRpY2xlLmFuaW1hdGUoW1xyXG4gICAgICAgICAgeyBcclxuICAgICAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlKDAsIDApIHNjYWxlKDEpJywgXHJcbiAgICAgICAgICAgIG9wYWNpdHk6IDEgXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgeyBcclxuICAgICAgICAgICAgdHJhbnNmb3JtOiBgdHJhbnNsYXRlKCR7ZHgvMiArIHJhbmRvbU9mZnNldH1weCwgJHtkeSAtIDE1MH1weCkgc2NhbGUoMS4yKWAsIFxyXG4gICAgICAgICAgICBvcGFjaXR5OiAxLFxyXG4gICAgICAgICAgICBvZmZzZXQ6IDAuNVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHsgXHJcbiAgICAgICAgICAgIHRyYW5zZm9ybTogYHRyYW5zbGF0ZSgke2R4fXB4LCAke2R5fXB4KSBzY2FsZSgwLjUpYCwgXHJcbiAgICAgICAgICAgIG9wYWNpdHk6IDAgXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgXSwge1xyXG4gICAgICAgICAgZHVyYXRpb246IDEwMDAgKyBpICogNTAsXHJcbiAgICAgICAgICBlYXNpbmc6ICdjdWJpYy1iZXppZXIoMC4yNSwgMC40NiwgMC40NSwgMC45NCknXHJcbiAgICAgICAgfSkub25maW5pc2ggPSAoKSA9PiB7XHJcbiAgICAgICAgICBwYXJ0aWNsZS5yZW1vdmUoKTtcclxuICAgICAgICAgIC8vIFx1NjcwMFx1NTQwRVx1NEUwMFx1NEUyQVx1N0M5Mlx1NUI1MFx1NTIzMFx1OEZCRVx1NjVGNlx1RkYwQ1x1NkRGQlx1NTJBMFx1ODEwOVx1NTFCMlx1NjU0OFx1Njc5Q1xyXG4gICAgICAgICAgaWYgKGkgPT09IHBhcnRpY2xlQ291bnQgLSAxKSB7XHJcbiAgICAgICAgICAgIG9yZUVsLmNsYXNzTGlzdC5hZGQoJ2ZsYXNoJyk7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gb3JlRWwuY2xhc3NMaXN0LnJlbW92ZSgnZmxhc2gnKSwgOTAwKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICB9LCBpICogODApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhc3luYyBoYW5kbGVSZXBhaXIoKSB7XHJcbiAgICBpZiAodGhpcy5wZW5kaW5nIHx8ICF0aGlzLmlzQ29sbGFwc2VkKSByZXR1cm47XHJcbiAgICB0aGlzLnBlbmRpbmcgPSAncmVwYWlyJztcclxuICAgIHRoaXMudXBkYXRlQ29udHJvbHMoKTtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHN0YXR1cyA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDxNaW5lU3RhdHVzPignL21pbmUvcmVwYWlyJywgeyBtZXRob2Q6ICdQT1NUJyB9KTtcclxuICAgICAgdGhpcy5hcHBseVN0YXR1cyhzdGF0dXMpO1xyXG4gICAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoJ1x1NzdGRlx1OTA1M1x1NURGMlx1NEZFRVx1NTkwRFx1RkYwQ1x1NTNFRlx1OTFDRFx1NjVCMFx1NTQyRlx1NTJBOCcpO1xyXG4gICAgICBzaG93VG9hc3QoJ1x1NzdGRlx1OTA1M1x1NURGMlx1NEZFRVx1NTkwRCcsICdzdWNjZXNzJyk7XHJcbiAgICB9IGNhdGNoIChlOiBhbnkpIHtcclxuICAgICAgc2hvd1RvYXN0KGU/Lm1lc3NhZ2UgfHwgJ1x1NEZFRVx1NzQwNlx1NTkzMVx1OEQyNScsICdlcnJvcicpO1xyXG4gICAgfSBmaW5hbGx5IHtcclxuICAgICAgdGhpcy5wZW5kaW5nID0gbnVsbDtcclxuICAgICAgdGhpcy51cGRhdGVDb250cm9scygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhc3luYyByZWZyZXNoU3RhdHVzKCkge1xyXG4gICAgaWYgKHRoaXMucGVuZGluZyA9PT0gJ3N0YXR1cycpIHJldHVybjtcclxuICAgIHRoaXMucGVuZGluZyA9ICdzdGF0dXMnO1xyXG4gICAgdGhpcy51cGRhdGVDb250cm9scygpO1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3Qgc3RhdHVzID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PE1pbmVTdGF0dXM+KCcvbWluZS9zdGF0dXMnKTtcclxuICAgICAgdGhpcy5hcHBseVN0YXR1cyhzdGF0dXMpO1xyXG4gICAgfSBjYXRjaCAoZTogYW55KSB7XHJcbiAgICAgIHNob3dUb2FzdChlPy5tZXNzYWdlIHx8ICdcdTgzQjdcdTUzRDZcdTcyQjZcdTYwMDFcdTU5MzFcdThEMjUnLCAnZXJyb3InKTtcclxuICAgIH0gZmluYWxseSB7XHJcbiAgICAgIHRoaXMucGVuZGluZyA9IG51bGw7XHJcbiAgICAgIHRoaXMudXBkYXRlQ29udHJvbHMoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXBwbHlTdGF0dXMoc3RhdHVzOiBNaW5lU3RhdHVzIHwgdW5kZWZpbmVkLCBvcHRzOiB7IHF1aWV0PzogYm9vbGVhbiB9ID0ge30pIHtcclxuICAgIGlmICghc3RhdHVzKSByZXR1cm47XHJcbiAgICB0aGlzLmNhcnRBbXQgPSBzdGF0dXMuY2FydEFtb3VudCA/PyB0aGlzLmNhcnRBbXQ7XHJcbiAgICB0aGlzLmNhcnRDYXAgPSBzdGF0dXMuY2FydENhcGFjaXR5ID8/IHRoaXMuY2FydENhcDtcclxuICAgIHRoaXMuaW50ZXJ2YWxNcyA9IHN0YXR1cy5pbnRlcnZhbE1zID8/IHRoaXMuaW50ZXJ2YWxNcztcclxuICAgIHRoaXMuaXNNaW5pbmcgPSBCb29sZWFuKHN0YXR1cy5ydW5uaW5nKTtcclxuICAgIHRoaXMuaXNDb2xsYXBzZWQgPSBCb29sZWFuKHN0YXR1cy5jb2xsYXBzZWQpO1xyXG4gICAgaWYgKHN0YXR1cy5jb2xsYXBzZWQgJiYgc3RhdHVzLmNvbGxhcHNlZFJlbWFpbmluZyA+IDApIHtcclxuICAgICAgdGhpcy5iZWdpbkNvbGxhcHNlQ291bnRkb3duKHN0YXR1cy5jb2xsYXBzZWRSZW1haW5pbmcpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5jbGVhckNvbGxhcHNlVGltZXIoKTtcclxuICAgICAgdGhpcy5jb2xsYXBzZVJlbWFpbmluZyA9IDA7XHJcbiAgICB9XHJcbiAgICB0aGlzLnVwZGF0ZVByb2dyZXNzKCk7XHJcbiAgICBpZiAoIW9wdHMucXVpZXQpIHtcclxuICAgICAgaWYgKHRoaXMuaXNDb2xsYXBzZWQgJiYgdGhpcy5jb2xsYXBzZVJlbWFpbmluZyA+IDApIHtcclxuICAgICAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoYFx1NzdGRlx1OTA1M1x1NTc0RFx1NTg0Q1x1RkYwQ1x1NTI2OVx1NEY1OSAke3RoaXMuY29sbGFwc2VSZW1haW5pbmd9c2ApO1xyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaXNNaW5pbmcpIHtcclxuICAgICAgICBjb25zdCBzZWNvbmRzID0gTWF0aC5tYXgoMSwgTWF0aC5yb3VuZCh0aGlzLmludGVydmFsTXMgLyAxMDAwKSk7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0dXNNZXNzYWdlKGBcdTc3RkZcdTY3M0FcdThGRDBcdTg4NENcdTRFMkRcdUZGMENcdTU0NjhcdTY3MUZcdTdFQTYgJHtzZWNvbmRzfXNcdUZGMENcdTVGNTNcdTUyNEQgJHt0aGlzLmZvcm1hdFBlcmNlbnQoKX1gKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoJ1x1NzdGRlx1NjczQVx1NURGMlx1NTA1Q1x1NkI2Mlx1RkYwQ1x1NzBCOVx1NTFGQlx1NUYwMFx1NTlDQlx1NjMxNlx1NzdGRicpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5lbHMuY3ljbGUpIHtcclxuICAgICAgY29uc3Qgc2Vjb25kcyA9IE1hdGgubWF4KDEsIE1hdGgucm91bmQodGhpcy5pbnRlcnZhbE1zIC8gMTAwMCkpO1xyXG4gICAgICB0aGlzLmVscy5jeWNsZS50ZXh0Q29udGVudCA9IGAke3NlY29uZHN9c2A7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5lbHMuc3RhdHVzVGFnKSB7XHJcbiAgICAgIGNvbnN0IGVsID0gdGhpcy5lbHMuc3RhdHVzVGFnIGFzIEhUTUxFbGVtZW50O1xyXG4gICAgICBlbC5pbm5lckhUTUwgPSAnJztcclxuICAgICAgXHJcbiAgICAgIC8vIFx1NzlGQlx1OTY2NFx1NjI0MFx1NjcwOVx1NzJCNlx1NjAwMVx1N0M3QlxyXG4gICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdwaWxsLXJ1bm5pbmcnLCAncGlsbC1jb2xsYXBzZWQnKTtcclxuICAgICAgXHJcbiAgICAgIGNvbnN0IGljbyA9IHRoaXMuaXNDb2xsYXBzZWQgPyAnY2xvc2UnIDogKHRoaXMuaXNNaW5pbmcgPyAnYm9sdCcgOiAnY2xvY2snKTtcclxuICAgICAgdHJ5IHsgZWwuYXBwZW5kQ2hpbGQocmVuZGVySWNvbihpY28gYXMgYW55LCB7IHNpemU6IDE2IH0pKTsgfSBjYXRjaCB7fVxyXG4gICAgICBlbC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0aGlzLmlzQ29sbGFwc2VkID8gJ1x1NTc0RFx1NTg0QycgOiAodGhpcy5pc01pbmluZyA/ICdcdThGRDBcdTg4NENcdTRFMkQnIDogJ1x1NUY4NVx1NjczQScpKSk7XHJcbiAgICAgIFxyXG4gICAgICAvLyBcdTZERkJcdTUyQTBcdTVCRjlcdTVFOTRcdTc2ODRcdTUyQThcdTYwMDFcdTY4MzdcdTVGMEZcdTdDN0JcclxuICAgICAgaWYgKHRoaXMuaXNDb2xsYXBzZWQpIHtcclxuICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKCdwaWxsLWNvbGxhcHNlZCcpO1xyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaXNNaW5pbmcpIHtcclxuICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKCdwaWxsLXJ1bm5pbmcnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy51cGRhdGVDb250cm9scygpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBiZWdpbkNvbGxhcHNlQ291bnRkb3duKHNlY29uZHM6IG51bWJlcikge1xyXG4gICAgdGhpcy5jbGVhckNvbGxhcHNlVGltZXIoKTtcclxuICAgIHRoaXMuaXNDb2xsYXBzZWQgPSB0cnVlO1xyXG4gICAgdGhpcy5jb2xsYXBzZVJlbWFpbmluZyA9IE1hdGgubWF4KDAsIE1hdGguZmxvb3Ioc2Vjb25kcykpO1xyXG4gICAgdGhpcy5zZXRTdGF0dXNNZXNzYWdlKGBcdTc3RkZcdTkwNTNcdTU3NERcdTU4NENcdUZGMENcdTUyNjlcdTRGNTkgJHt0aGlzLmNvbGxhcHNlUmVtYWluaW5nfXNgKTtcclxuICAgIHRoaXMudXBkYXRlQ29udHJvbHMoKTtcclxuICAgIHRoaXMuY29sbGFwc2VUaW1lciA9IHdpbmRvdy5zZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgIHRoaXMuY29sbGFwc2VSZW1haW5pbmcgPSBNYXRoLm1heCgwLCB0aGlzLmNvbGxhcHNlUmVtYWluaW5nIC0gMSk7XHJcbiAgICAgIGlmICh0aGlzLmNvbGxhcHNlUmVtYWluaW5nIDw9IDApIHtcclxuICAgICAgICB0aGlzLmNsZWFyQ29sbGFwc2VUaW1lcigpO1xyXG4gICAgICAgIHRoaXMuaXNDb2xsYXBzZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoJ1x1NTc0RFx1NTg0Q1x1ODlFM1x1OTY2NFx1RkYwQ1x1NTNFRlx1OTFDRFx1NjVCMFx1NTQyRlx1NTJBOFx1NzdGRlx1NjczQScpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlQ29udHJvbHMoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoYFx1NzdGRlx1OTA1M1x1NTc0RFx1NTg0Q1x1RkYwQ1x1NTI2OVx1NEY1OSAke3RoaXMuY29sbGFwc2VSZW1haW5pbmd9c2ApO1xyXG4gICAgICB9XHJcbiAgICB9LCAxMDAwKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgY2xlYXJDb2xsYXBzZVRpbWVyKCkge1xyXG4gICAgaWYgKHRoaXMuY29sbGFwc2VUaW1lciAhPT0gbnVsbCkge1xyXG4gICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aGlzLmNvbGxhcHNlVGltZXIpO1xyXG4gICAgICB0aGlzLmNvbGxhcHNlVGltZXIgPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBsYXN0TWlsZXN0b25lID0gMDtcclxuXHJcbiAgcHJpdmF0ZSB1cGRhdGVQcm9ncmVzcygpIHtcclxuICAgIGlmICghdGhpcy5lbHMuZmlsbCB8fCAhdGhpcy5lbHMucGVyY2VudCkgcmV0dXJuO1xyXG4gICAgY29uc3QgcGN0ID0gdGhpcy5jYXJ0Q2FwID4gMCA/IE1hdGgubWluKDEsIHRoaXMuY2FydEFtdCAvIHRoaXMuY2FydENhcCkgOiAwO1xyXG4gICAgY29uc3QgcGN0SW50ID0gTWF0aC5yb3VuZChwY3QgKiAxMDApO1xyXG4gICAgXHJcbiAgICB0aGlzLmVscy5maWxsLnN0eWxlLndpZHRoID0gYCR7cGN0SW50fSVgO1xyXG4gICAgdGhpcy5lbHMucGVyY2VudC50ZXh0Q29udGVudCA9IGAke3BjdEludH0lYDtcclxuICAgIFxyXG4gICAgLy8gXHU1NzA2XHU3M0FGXHU5ODlDXHU4MjcyXHU2RTEwXHU1M0Q4XHVGRjFBXHU3RDJCXHU4MjcyIC0+IFx1ODRERFx1ODI3MiAtPiBcdTkxRDFcdTgyNzJcclxuICAgIGxldCByaW5nQ29sb3IgPSAnIzdCMkNGNSc7IC8vIFx1N0QyQlx1ODI3MlxyXG4gICAgaWYgKHBjdCA+PSAwLjc1KSB7XHJcbiAgICAgIHJpbmdDb2xvciA9ICcjZjZjNDQ1JzsgLy8gXHU5MUQxXHU4MjcyXHJcbiAgICB9IGVsc2UgaWYgKHBjdCA+PSAwLjUpIHtcclxuICAgICAgcmluZ0NvbG9yID0gJyMyQzg5RjUnOyAvLyBcdTg0RERcdTgyNzJcclxuICAgIH1cclxuICAgIFxyXG4gICAgaWYgKHRoaXMuZWxzLnJpbmcpIHtcclxuICAgICAgY29uc3QgZGVnID0gTWF0aC5yb3VuZChwY3QgKiAzNjApO1xyXG4gICAgICAodGhpcy5lbHMucmluZyBhcyBIVE1MRWxlbWVudCkuc3R5bGUuYmFja2dyb3VuZCA9IGBjb25pYy1ncmFkaWVudCgke3JpbmdDb2xvcn0gJHtkZWd9ZGVnLCByZ2JhKDI1NSwyNTUsMjU1LC4wOCkgMGRlZylgO1xyXG4gICAgICBcclxuICAgICAgLy8gXHU2RUUxXHU4RjdEXHU2NUY2XHU2MzAxXHU3RUVEXHU5NUVBXHU4MDAwXHJcbiAgICAgIGlmIChwY3QgPj0gMSkge1xyXG4gICAgICAgIHRoaXMuZWxzLnJpbmcuY2xhc3NMaXN0LmFkZCgncmluZy1mdWxsJyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5lbHMucmluZy5jbGFzc0xpc3QucmVtb3ZlKCdyaW5nLWZ1bGwnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpZiAodGhpcy5lbHMucmluZ1BjdCkgdGhpcy5lbHMucmluZ1BjdC50ZXh0Q29udGVudCA9IGAke3BjdEludH0lYDtcclxuICAgIFxyXG4gICAgLy8gXHU5MUNDXHU3QTBCXHU3ODkxXHU4MTA5XHU1MUIyXHU3Mjc5XHU2NTQ4XHJcbiAgICBjb25zdCBtaWxlc3RvbmVzID0gWzI1LCA1MCwgNzUsIDEwMF07XHJcbiAgICBmb3IgKGNvbnN0IG1pbGVzdG9uZSBvZiBtaWxlc3RvbmVzKSB7XHJcbiAgICAgIGlmIChwY3RJbnQgPj0gbWlsZXN0b25lICYmIHRoaXMubGFzdE1pbGVzdG9uZSA8IG1pbGVzdG9uZSkge1xyXG4gICAgICAgIHRoaXMudHJpZ2dlck1pbGVzdG9uZVB1bHNlKG1pbGVzdG9uZSk7XHJcbiAgICAgICAgdGhpcy5sYXN0TWlsZXN0b25lID0gbWlsZXN0b25lO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIFx1NUY1M1x1ODhDNVx1OEY3RFx1NzM4N1x1NEUwQlx1OTY0RFx1RkYwOFx1NjUzNlx1NzdGRlx1NTQwRVx1RkYwOVx1OTFDRFx1N0Y2RVx1OTFDQ1x1N0EwQlx1Nzg5MVxyXG4gICAgaWYgKHBjdEludCA8IHRoaXMubGFzdE1pbGVzdG9uZSAtIDEwKSB7XHJcbiAgICAgIHRoaXMubGFzdE1pbGVzdG9uZSA9IE1hdGguZmxvb3IocGN0SW50IC8gMjUpICogMjU7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIDkwJVx1OEI2Nlx1NTQ0QVx1NjNEMFx1NzkzQVxyXG4gICAgaWYgKHBjdEludCA+PSA5MCAmJiBwY3RJbnQgPCAxMDApIHtcclxuICAgICAgaWYgKCF0aGlzLmVscy5zdGF0dXNUZXh0Py50ZXh0Q29udGVudD8uaW5jbHVkZXMoJ1x1NTM3M1x1NUMwNlx1NkVFMVx1OEY3RCcpKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0dXNNZXNzYWdlKCdcdTI2QTBcdUZFMEYgXHU3N0ZGXHU4RjY2XHU1MzczXHU1QzA2XHU2RUUxXHU4RjdEXHVGRjBDXHU1RUZBXHU4QkFFXHU2NTM2XHU3N0ZGJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgaWYgKHRoaXMucGVuZGluZyAhPT0gJ2NvbGxlY3QnICYmIHRoaXMuZWxzLmNvbGxlY3QpIHtcclxuICAgICAgdGhpcy5lbHMuY29sbGVjdC5kaXNhYmxlZCA9IHRoaXMucGVuZGluZyA9PT0gJ2NvbGxlY3QnIHx8IHRoaXMuY2FydEFtdCA8PSAwO1xyXG4gICAgICBcclxuICAgICAgLy8gXHU1M0VGXHU2NTM2XHU3N0ZGXHU2NUY2XHU2REZCXHU1MkEwXHU4MEZEXHU5MUNGXHU3Mjc5XHU2NTQ4XHJcbiAgICAgIGlmICh0aGlzLmNhcnRBbXQgPiAwICYmICF0aGlzLmVscy5jb2xsZWN0LmRpc2FibGVkKSB7XHJcbiAgICAgICAgdGhpcy5lbHMuY29sbGVjdC5jbGFzc0xpc3QuYWRkKCdidG4tZW5lcmd5Jyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5lbHMuY29sbGVjdC5jbGFzc0xpc3QucmVtb3ZlKCdidG4tZW5lcmd5Jyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gXHU2NkY0XHU2NUIwXHU3N0ZGXHU3N0YzXHU2NTcwXHU5MUNGXHJcbiAgICB0aGlzLnVwZGF0ZVNoYXJkcyhwY3QpO1xyXG4gICAgXHJcbiAgICAvLyBcdTY2RjRcdTY1QjBcdTUxNjhcdTYwNkZcdTgwQ0NcdTY2NkZcdTcyQjZcdTYwMDFcclxuICAgIHRoaXMudXBkYXRlSG9sb2dyYW1TdGF0ZSgpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB0cmlnZ2VyTWlsZXN0b25lUHVsc2UobWlsZXN0b25lOiBudW1iZXIpIHtcclxuICAgIGlmICh0aGlzLmVscy5yaW5nKSB7XHJcbiAgICAgIHRoaXMuZWxzLnJpbmcuY2xhc3NMaXN0LmFkZCgnbWlsZXN0b25lLXB1bHNlJyk7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5lbHMucmluZz8uY2xhc3NMaXN0LnJlbW92ZSgnbWlsZXN0b25lLXB1bHNlJyksIDEwMDApO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpZiAodGhpcy5lbHMucmluZ1BjdCkge1xyXG4gICAgICB0aGlzLmVscy5yaW5nUGN0LmNsYXNzTGlzdC5hZGQoJ2ZsYXNoJyk7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5lbHMucmluZ1BjdD8uY2xhc3NMaXN0LnJlbW92ZSgnZmxhc2gnKSwgOTAwKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gXHU2NjNFXHU3OTNBXHU5MUNDXHU3QTBCXHU3ODkxXHU2RDg4XHU2MDZGXHJcbiAgICBzaG93VG9hc3QoYFx1RDgzQ1x1REZBRiBcdThGQkVcdTYyMTAgJHttaWxlc3RvbmV9JSBcdTg4QzVcdThGN0RcdTczODdcdUZGMDFgLCAnc3VjY2VzcycpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB1cGRhdGVIb2xvZ3JhbVN0YXRlKCkge1xyXG4gICAgaWYgKCF0aGlzLmVscy5ob2xvZ3JhbSkgcmV0dXJuO1xyXG4gICAgXHJcbiAgICAvLyBcdTc5RkJcdTk2NjRcdTYyNDBcdTY3MDlcdTcyQjZcdTYwMDFcdTdDN0JcclxuICAgIHRoaXMuZWxzLmhvbG9ncmFtLmNsYXNzTGlzdC5yZW1vdmUoJ2hvbG8taWRsZScsICdob2xvLW1pbmluZycsICdob2xvLWNvbGxhcHNlZCcpO1xyXG4gICAgXHJcbiAgICAvLyBcdTY4MzlcdTYzNkVcdTcyQjZcdTYwMDFcdTZERkJcdTUyQTBcdTVCRjlcdTVFOTRcdTc2ODRcdTdDN0JcclxuICAgIGlmICh0aGlzLmlzQ29sbGFwc2VkKSB7XHJcbiAgICAgIHRoaXMuZWxzLmhvbG9ncmFtLmNsYXNzTGlzdC5hZGQoJ2hvbG8tY29sbGFwc2VkJyk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNNaW5pbmcpIHtcclxuICAgICAgdGhpcy5lbHMuaG9sb2dyYW0uY2xhc3NMaXN0LmFkZCgnaG9sby1taW5pbmcnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuZWxzLmhvbG9ncmFtLmNsYXNzTGlzdC5hZGQoJ2hvbG8taWRsZScpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB1cGRhdGVTaGFyZHMobG9hZFBlcmNlbnQ6IG51bWJlcikge1xyXG4gICAgaWYgKCF0aGlzLmVscy5ob2xvZ3JhbSkgcmV0dXJuO1xyXG4gICAgXHJcbiAgICAvLyBcdThCQTFcdTdCOTdcdTVFOTRcdThCRTVcdTY2M0VcdTc5M0FcdTc2ODRcdTc3RkZcdTc3RjNcdTY1NzBcdTkxQ0ZcdUZGMDhcdTg4QzVcdThGN0RcdTczODdcdThEOEFcdTlBRDhcdUZGMENcdTc3RkZcdTc3RjNcdThEOEFcdTU5MUFcdUZGMDlcclxuICAgIC8vIDAtMjAlOiAyXHU0RTJBLCAyMC00MCU6IDRcdTRFMkEsIDQwLTYwJTogNlx1NEUyQSwgNjAtODAlOiA4XHU0RTJBLCA4MC0xMDAlOiAxMFx1NEUyQVxyXG4gICAgY29uc3QgdGFyZ2V0Q291bnQgPSBNYXRoLm1heCgyLCBNYXRoLm1pbigxMiwgTWF0aC5mbG9vcihsb2FkUGVyY2VudCAqIDEyKSArIDIpKTtcclxuICAgIFxyXG4gICAgLy8gXHU4M0I3XHU1M0Q2XHU1RjUzXHU1MjREXHU3N0ZGXHU3N0YzXHU1MTQzXHU3RDIwXHJcbiAgICBjb25zdCBjdXJyZW50U2hhcmRzID0gdGhpcy5lbHMuaG9sb2dyYW0ucXVlcnlTZWxlY3RvckFsbCgnLm1pbmUtc2hhcmQnKTtcclxuICAgIGNvbnN0IGN1cnJlbnRDb3VudCA9IGN1cnJlbnRTaGFyZHMubGVuZ3RoO1xyXG4gICAgXHJcbiAgICAvLyBcdTU5ODJcdTY3OUNcdTY1NzBcdTkxQ0ZcdTc2RjhcdTU0MENcdUZGMENcdTRFMERcdTUwNUFcdTU5MDRcdTc0MDZcclxuICAgIGlmIChjdXJyZW50Q291bnQgPT09IHRhcmdldENvdW50KSByZXR1cm47XHJcbiAgICBcclxuICAgIC8vIFx1OTcwMFx1ODk4MVx1NkRGQlx1NTJBMFx1NzdGRlx1NzdGM1xyXG4gICAgaWYgKGN1cnJlbnRDb3VudCA8IHRhcmdldENvdW50KSB7XHJcbiAgICAgIGNvbnN0IHRvQWRkID0gdGFyZ2V0Q291bnQgLSBjdXJyZW50Q291bnQ7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG9BZGQ7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IHNoYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgIHNoYXJkLmNsYXNzTmFtZSA9ICdtaW5lLXNoYXJkJztcclxuICAgICAgICBcclxuICAgICAgICAvLyBcdTk2OEZcdTY3M0FcdTRGNERcdTdGNkVcdTU0OENcdTU5MjdcdTVDMEZcclxuICAgICAgICBjb25zdCBwb3NpdGlvbnMgPSBbXHJcbiAgICAgICAgICB7IHRvcDogJzE4JScsIGxlZnQ6ICcxNiUnLCBkZWxheTogLTEuNCwgc2NhbGU6IDEgfSxcclxuICAgICAgICAgIHsgYm90dG9tOiAnMTYlJywgcmlnaHQ6ICcyMiUnLCBkZWxheTogLTMuMiwgc2NhbGU6IDAuNzQgfSxcclxuICAgICAgICAgIHsgdG9wOiAnMjYlJywgcmlnaHQ6ICczNCUnLCBkZWxheTogLTUuMSwgc2NhbGU6IDAuNSB9LFxyXG4gICAgICAgICAgeyB0b3A6ICc0MCUnLCBsZWZ0OiAnMjglJywgZGVsYXk6IC0yLjUsIHNjYWxlOiAwLjg1IH0sXHJcbiAgICAgICAgICB7IGJvdHRvbTogJzMwJScsIGxlZnQ6ICcxOCUnLCBkZWxheTogLTQuMSwgc2NhbGU6IDAuNjggfSxcclxuICAgICAgICAgIHsgdG9wOiAnMTUlJywgcmlnaHQ6ICcxNSUnLCBkZWxheTogLTEuOCwgc2NhbGU6IDAuOTIgfSxcclxuICAgICAgICAgIHsgYm90dG9tOiAnMjIlJywgcmlnaHQ6ICc0MCUnLCBkZWxheTogLTMuOCwgc2NhbGU6IDAuNzggfSxcclxuICAgICAgICAgIHsgdG9wOiAnNTAlJywgbGVmdDogJzEyJScsIGRlbGF5OiAtMi4yLCBzY2FsZTogMC42IH0sXHJcbiAgICAgICAgICB7IHRvcDogJzM1JScsIHJpZ2h0OiAnMjAlJywgZGVsYXk6IC00LjUsIHNjYWxlOiAwLjg4IH0sXHJcbiAgICAgICAgICB7IGJvdHRvbTogJzQwJScsIGxlZnQ6ICczNSUnLCBkZWxheTogLTMuNSwgc2NhbGU6IDAuNyB9LFxyXG4gICAgICAgICAgeyB0b3A6ICc2MCUnLCByaWdodDogJzI4JScsIGRlbGF5OiAtMi44LCBzY2FsZTogMC42NSB9LFxyXG4gICAgICAgICAgeyBib3R0b206ICc1MCUnLCByaWdodDogJzEyJScsIGRlbGF5OiAtNC44LCBzY2FsZTogMC44MiB9LFxyXG4gICAgICAgIF07XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgcG9zSW5kZXggPSAoY3VycmVudENvdW50ICsgaSkgJSBwb3NpdGlvbnMubGVuZ3RoO1xyXG4gICAgICAgIGNvbnN0IHBvcyA9IHBvc2l0aW9uc1twb3NJbmRleF07XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHBvcy50b3ApIHNoYXJkLnN0eWxlLnRvcCA9IHBvcy50b3A7XHJcbiAgICAgICAgaWYgKHBvcy5ib3R0b20pIHNoYXJkLnN0eWxlLmJvdHRvbSA9IHBvcy5ib3R0b207XHJcbiAgICAgICAgaWYgKHBvcy5sZWZ0KSBzaGFyZC5zdHlsZS5sZWZ0ID0gcG9zLmxlZnQ7XHJcbiAgICAgICAgaWYgKHBvcy5yaWdodCkgc2hhcmQuc3R5bGUucmlnaHQgPSBwb3MucmlnaHQ7XHJcbiAgICAgICAgc2hhcmQuc3R5bGUuYW5pbWF0aW9uRGVsYXkgPSBgJHtwb3MuZGVsYXl9c2A7XHJcbiAgICAgICAgc2hhcmQuc3R5bGUudHJhbnNmb3JtID0gYHNjYWxlKCR7cG9zLnNjYWxlfSlgO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFx1NkRGQlx1NTJBMFx1NkRFMVx1NTE2NVx1NTJBOFx1NzUzQlxyXG4gICAgICAgIHNoYXJkLnN0eWxlLm9wYWNpdHkgPSAnMCc7XHJcbiAgICAgICAgdGhpcy5lbHMuaG9sb2dyYW0uYXBwZW5kQ2hpbGQoc2hhcmQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFx1ODlFNlx1NTNEMVx1NkRFMVx1NTE2NVxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgc2hhcmQuc3R5bGUudHJhbnNpdGlvbiA9ICdvcGFjaXR5IDAuNXMgZWFzZSc7XHJcbiAgICAgICAgICBzaGFyZC5zdHlsZS5vcGFjaXR5ID0gJzAuMjYnO1xyXG4gICAgICAgIH0sIDUwKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gXHU5NzAwXHU4OTgxXHU3OUZCXHU5NjY0XHU3N0ZGXHU3N0YzXHJcbiAgICBlbHNlIGlmIChjdXJyZW50Q291bnQgPiB0YXJnZXRDb3VudCkge1xyXG4gICAgICBjb25zdCB0b1JlbW92ZSA9IGN1cnJlbnRDb3VudCAtIHRhcmdldENvdW50O1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvUmVtb3ZlOyBpKyspIHtcclxuICAgICAgICBjb25zdCBsYXN0U2hhcmQgPSBjdXJyZW50U2hhcmRzW2N1cnJlbnRTaGFyZHMubGVuZ3RoIC0gMSAtIGldO1xyXG4gICAgICAgIGlmIChsYXN0U2hhcmQpIHtcclxuICAgICAgICAgIChsYXN0U2hhcmQgYXMgSFRNTEVsZW1lbnQpLnN0eWxlLnRyYW5zaXRpb24gPSAnb3BhY2l0eSAwLjVzIGVhc2UnO1xyXG4gICAgICAgICAgKGxhc3RTaGFyZCBhcyBIVE1MRWxlbWVudCkuc3R5bGUub3BhY2l0eSA9ICcwJztcclxuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICBsYXN0U2hhcmQucmVtb3ZlKCk7XHJcbiAgICAgICAgICB9LCA1MDApO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB1cGRhdGVDb250cm9scygpIHtcclxuICAgIGNvbnN0IGlzQnVzeSA9IChrZXk6IFBlbmRpbmdBY3Rpb24pID0+IHRoaXMucGVuZGluZyA9PT0ga2V5O1xyXG4gICAgY29uc3Qgc2V0QnRuID0gKGJ0bjogSFRNTEJ1dHRvbkVsZW1lbnQgfCBudWxsLCBpY29uOiBhbnksIGxhYmVsOiBzdHJpbmcsIGRpc2FibGVkOiBib29sZWFuKSA9PiB7XHJcbiAgICAgIGlmICghYnRuKSByZXR1cm47XHJcbiAgICAgIGJ0bi5kaXNhYmxlZCA9IGRpc2FibGVkO1xyXG4gICAgICAvLyBrZWVwIGZpcnN0IGNoaWxkIGFzIGljb24gaWYgcHJlc2VudCwgb3RoZXJ3aXNlIGNyZWF0ZVxyXG4gICAgICBsZXQgaWNvbkhvc3QgPSBidG4ucXVlcnlTZWxlY3RvcignLmljb24nKTtcclxuICAgICAgaWYgKCFpY29uSG9zdCkge1xyXG4gICAgICAgIGJ0bi5pbnNlcnRCZWZvcmUocmVuZGVySWNvbihpY29uLCB7IHNpemU6IDE4IH0pLCBidG4uZmlyc3RDaGlsZCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gUmVwbGFjZSBleGlzdGluZyBpY29uIHdpdGggbmV3IG9uZSBpZiBpY29uIG5hbWUgZGlmZmVycyBieSByZS1yZW5kZXJpbmdcclxuICAgICAgICBjb25zdCBob3N0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgIGhvc3QuYXBwZW5kQ2hpbGQocmVuZGVySWNvbihpY29uLCB7IHNpemU6IDE4IH0pKTtcclxuICAgICAgICAvLyByZW1vdmUgb2xkIGljb24gd3JhcHBlciBhbmQgdXNlIG5ld1xyXG4gICAgICAgIGljb25Ib3N0LnBhcmVudEVsZW1lbnQ/LnJlcGxhY2VDaGlsZChob3N0LmZpcnN0Q2hpbGQgYXMgTm9kZSwgaWNvbkhvc3QpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIHNldCBsYWJlbCB0ZXh0IChwcmVzZXJ2ZSBpY29uKVxyXG4gICAgICAvLyByZW1vdmUgZXhpc3RpbmcgdGV4dCBub2Rlc1xyXG4gICAgICBBcnJheS5mcm9tKGJ0bi5jaGlsZE5vZGVzKS5mb3JFYWNoKChuLCBpZHgpID0+IHtcclxuICAgICAgICBpZiAoaWR4ID4gMCkgYnRuLnJlbW92ZUNoaWxkKG4pO1xyXG4gICAgICB9KTtcclxuICAgICAgYnRuLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGxhYmVsKSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHNldEJ0bih0aGlzLmVscy5zdGFydCwgJ3BsYXknLCBpc0J1c3koJ3N0YXJ0JykgPyAnXHU1NDJGXHU1MkE4XHU0RTJEXHUyMDI2JyA6IHRoaXMuaXNNaW5pbmcgPyAnXHU2MzE2XHU3N0ZGXHU0RTJEJyA6ICdcdTVGMDBcdTU5Q0JcdTYzMTZcdTc3RkYnLCBpc0J1c3koJ3N0YXJ0JykgfHwgdGhpcy5pc01pbmluZyB8fCB0aGlzLmlzQ29sbGFwc2VkKTtcclxuICAgIHNldEJ0bih0aGlzLmVscy5zdG9wLCAnc3RvcCcsIGlzQnVzeSgnc3RvcCcpID8gJ1x1NTA1Q1x1NkI2Mlx1NEUyRFx1MjAyNicgOiAnXHU1MDVDXHU2QjYyJywgaXNCdXN5KCdzdG9wJykgfHwgIXRoaXMuaXNNaW5pbmcpO1xyXG4gICAgc2V0QnRuKHRoaXMuZWxzLmNvbGxlY3QsICdjb2xsZWN0JywgaXNCdXN5KCdjb2xsZWN0JykgPyAnXHU2NTM2XHU5NkM2XHU0RTJEXHUyMDI2JyA6ICdcdTY1MzZcdTc3RkYnLCBpc0J1c3koJ2NvbGxlY3QnKSB8fCB0aGlzLmNhcnRBbXQgPD0gMCk7XHJcbiAgICBzZXRCdG4odGhpcy5lbHMucmVwYWlyLCAnd3JlbmNoJywgaXNCdXN5KCdyZXBhaXInKSA/ICdcdTRGRUVcdTc0MDZcdTRFMkRcdTIwMjYnIDogJ1x1NEZFRVx1NzQwNicsIGlzQnVzeSgncmVwYWlyJykgfHwgIXRoaXMuaXNDb2xsYXBzZWQpO1xyXG4gICAgc2V0QnRuKHRoaXMuZWxzLnN0YXR1c0J0biwgJ3JlZnJlc2gnLCBpc0J1c3koJ3N0YXR1cycpID8gJ1x1NTIzN1x1NjVCMFx1NEUyRFx1MjAyNicgOiAnXHU1MjM3XHU2NUIwXHU3MkI2XHU2MDAxJywgaXNCdXN5KCdzdGF0dXMnKSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNldFN0YXR1c01lc3NhZ2UodGV4dDogc3RyaW5nKSB7XHJcbiAgICBpZiAoIXRoaXMuZWxzLnN0YXR1c1RleHQpIHJldHVybjtcclxuICAgIHRoaXMuZWxzLnN0YXR1c1RleHQudGV4dENvbnRlbnQgPSB0ZXh0O1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBsb2dFdmVudChtc2c6IHN0cmluZykge1xyXG4gICAgaWYgKCF0aGlzLmVscz8uZXZlbnRzKSByZXR1cm47XHJcbiAgICBjb25zdCBsaW5lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xyXG4gICAgY29uc3QgaGggPSBTdHJpbmcobm93LmdldEhvdXJzKCkpLnBhZFN0YXJ0KDIsJzAnKTtcclxuICAgIGNvbnN0IG1tID0gU3RyaW5nKG5vdy5nZXRNaW51dGVzKCkpLnBhZFN0YXJ0KDIsJzAnKTtcclxuICAgIGNvbnN0IHNzID0gU3RyaW5nKG5vdy5nZXRTZWNvbmRzKCkpLnBhZFN0YXJ0KDIsJzAnKTtcclxuICAgIFxyXG4gICAgLy8gXHU2ODM5XHU2MzZFXHU2RDg4XHU2MDZGXHU3QzdCXHU1NzhCXHU2REZCXHU1MkEwXHU0RTBEXHU1NDBDXHU3Njg0XHU2ODM3XHU1RjBGXHU3QzdCXHJcbiAgICBsZXQgZXZlbnRDbGFzcyA9ICdldmVudCc7XHJcbiAgICBpZiAobXNnLmluY2x1ZGVzKCdcdTY2QjRcdTUxRkInKSkge1xyXG4gICAgICBldmVudENsYXNzICs9ICcgZXZlbnQtY3JpdGljYWwnO1xyXG4gICAgfSBlbHNlIGlmIChtc2cuaW5jbHVkZXMoJ1x1NTc0RFx1NTg0QycpIHx8IG1zZy5pbmNsdWRlcygnXHU2M0EwXHU1OTNBJykpIHtcclxuICAgICAgZXZlbnRDbGFzcyArPSAnIGV2ZW50LXdhcm5pbmcnO1xyXG4gICAgfSBlbHNlIGlmIChtc2cuaW5jbHVkZXMoJ1x1NjUzNlx1OTZDNicpIHx8IG1zZy5pbmNsdWRlcygnXHU2MjEwXHU1MjlGJykpIHtcclxuICAgICAgZXZlbnRDbGFzcyArPSAnIGV2ZW50LXN1Y2Nlc3MnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZXZlbnRDbGFzcyArPSAnIGV2ZW50LW5vcm1hbCc7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGxpbmUuY2xhc3NOYW1lID0gZXZlbnRDbGFzcztcclxuICAgIGxpbmUudGV4dENvbnRlbnQgPSBgWyR7aGh9OiR7bW19OiR7c3N9XSAke21zZ31gO1xyXG4gICAgXHJcbiAgICAvLyBcdTZERkJcdTUyQTBcdTZFRDFcdTUxNjVcdTUyQThcdTc1M0JcclxuICAgIGxpbmUuc3R5bGUub3BhY2l0eSA9ICcwJztcclxuICAgIGxpbmUuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVgoMjBweCknO1xyXG4gICAgdGhpcy5lbHMuZXZlbnRzLnByZXBlbmQobGluZSk7XHJcbiAgICBcclxuICAgIC8vIFx1ODlFNlx1NTNEMVx1NTJBOFx1NzUzQlxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIGxpbmUuc3R5bGUudHJhbnNpdGlvbiA9ICdvcGFjaXR5IDAuM3MgZWFzZSwgdHJhbnNmb3JtIDAuM3MgZWFzZSc7XHJcbiAgICAgIGxpbmUuc3R5bGUub3BhY2l0eSA9ICcwLjknO1xyXG4gICAgICBsaW5lLnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGVYKDApJztcclxuICAgIH0sIDEwKTtcclxuICAgIFxyXG4gICAgLy8gXHU2NkI0XHU1MUZCXHU0RThCXHU0RUY2XHU2REZCXHU1MkEwXHU5NUVBXHU1MTQ5XHU2NTQ4XHU2NzlDXHJcbiAgICBpZiAobXNnLmluY2x1ZGVzKCdcdTY2QjRcdTUxRkInKSkge1xyXG4gICAgICBsaW5lLmNsYXNzTGlzdC5hZGQoJ2ZsYXNoJyk7XHJcbiAgICAgIC8vIFx1ODlFNlx1NTNEMVx1NTE2OFx1NUM0MFx1NjZCNFx1NTFGQlx1NzI3OVx1NjU0OFxyXG4gICAgICB0aGlzLnRyaWdnZXJDcml0aWNhbEVmZmVjdCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB0cmlnZ2VyQ3JpdGljYWxFZmZlY3QoKSB7XHJcbiAgICAvLyBcdTU3MDZcdTczQUZcdTk1RUFcdTc1MzVcdTY1NDhcdTY3OUNcclxuICAgIGlmICh0aGlzLmVscy5yaW5nKSB7XHJcbiAgICAgIHRoaXMuZWxzLnJpbmcuY2xhc3NMaXN0LmFkZCgncmluZy1wdWxzZScpO1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuZWxzLnJpbmc/LmNsYXNzTGlzdC5yZW1vdmUoJ3JpbmctcHVsc2UnKSwgNjAwKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gXHU1MTY4XHU2MDZGXHU4MENDXHU2NjZGXHU5NUVBXHU3MEMxXHJcbiAgICBpZiAodGhpcy5lbHMuaG9sb2dyYW0pIHtcclxuICAgICAgdGhpcy5lbHMuaG9sb2dyYW0uY2xhc3NMaXN0LmFkZCgnY3JpdGljYWwtZmxhc2gnKTtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmVscy5ob2xvZ3JhbT8uY2xhc3NMaXN0LnJlbW92ZSgnY3JpdGljYWwtZmxhc2gnKSwgNDAwKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgZm9ybWF0UGVyY2VudCgpIHtcclxuICAgIGNvbnN0IHBjdCA9IHRoaXMuY2FydENhcCA+IDAgPyBNYXRoLm1pbigxLCB0aGlzLmNhcnRBbXQgLyB0aGlzLmNhcnRDYXApIDogMDtcclxuICAgIHJldHVybiBgJHtNYXRoLnJvdW5kKHBjdCAqIDEwMCl9JWA7XHJcbiAgfVxyXG59IiwgImltcG9ydCB7IE5ldHdvcmtNYW5hZ2VyIH0gZnJvbSAnLi4vY29yZS9OZXR3b3JrTWFuYWdlcic7XG5pbXBvcnQgeyBodG1sLCBxcyB9IGZyb20gJy4uL3V0aWxzL2RvbSc7XG5pbXBvcnQgeyByZW5kZXJOYXYgfSBmcm9tICcuLi9jb21wb25lbnRzL05hdic7XG5pbXBvcnQgeyBSZWFsdGltZUNsaWVudCB9IGZyb20gJy4uL2NvcmUvUmVhbHRpbWVDbGllbnQnO1xuaW1wb3J0IHsgcmVuZGVyUmVzb3VyY2VCYXIgfSBmcm9tICcuLi9jb21wb25lbnRzL1Jlc291cmNlQmFyJztcbmltcG9ydCB7IHNob3dUb2FzdCB9IGZyb20gJy4uL2NvbXBvbmVudHMvVG9hc3QnO1xuaW1wb3J0IHsgcmVuZGVySWNvbiB9IGZyb20gJy4uL2NvbXBvbmVudHMvSWNvbic7XG5cbmV4cG9ydCBjbGFzcyBXYXJlaG91c2VTY2VuZSB7XG4gIGFzeW5jIG1vdW50KHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgcm9vdC5pbm5lckhUTUwgPSAnJztcbiAgICByb290LmFwcGVuZENoaWxkKHJlbmRlck5hdignd2FyZWhvdXNlJykpO1xuICAgIGNvbnN0IGJhciA9IHJlbmRlclJlc291cmNlQmFyKCk7XG4gICAgcm9vdC5hcHBlbmRDaGlsZChiYXIucm9vdCk7XG5cbiAgICBjb25zdCB2aWV3ID0gaHRtbChgXG4gICAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyIGdyaWQtMlwiIHN0eWxlPVwiY29sb3I6I2ZmZjtcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQgZmFkZS1pblwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIiBzdHlsZT1cImp1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2FsaWduLWl0ZW1zOmNlbnRlcjtcIj5cbiAgICAgICAgICAgIDxoMyBzdHlsZT1cIm1hcmdpbjowO2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjhweDtcIj48c3BhbiBkYXRhLWljbz1cIndhcmVob3VzZVwiPjwvc3Bhbj5cdTRFRDNcdTVFOTM8L2gzPlxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInJlZnJlc2hcIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiPjxzcGFuIGRhdGEtaWNvPVwicmVmcmVzaFwiPjwvc3Bhbj5cdTUyMzdcdTY1QjA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IHN0eWxlPVwibWFyZ2luLXRvcDoxMnB4O1wiPlxuICAgICAgICAgICAgPGRldGFpbHMgb3Blbj5cbiAgICAgICAgICAgICAgPHN1bW1hcnk+PHNwYW4gZGF0YS1pY289XCJib3hcIj48L3NwYW4+XHU2MjExXHU3Njg0XHU5MDUzXHU1MTc3PC9zdW1tYXJ5PlxuICAgICAgICAgICAgICA8ZGl2IGlkPVwibGlzdFwiIHN0eWxlPVwibWFyZ2luLXRvcDo4cHg7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6OHB4O1wiPjwvZGl2PlxuICAgICAgICAgICAgPC9kZXRhaWxzPlxuICAgICAgICAgICAgPGRldGFpbHM+XG4gICAgICAgICAgICAgIDxzdW1tYXJ5PjxzcGFuIGRhdGEtaWNvPVwibGlzdFwiPjwvc3Bhbj5cdTkwNTNcdTUxNzdcdTZBMjFcdTY3N0Y8L3N1bW1hcnk+XG4gICAgICAgICAgICAgIDxkaXYgaWQ9XCJ0cGxzXCIgc3R5bGU9XCJtYXJnaW4tdG9wOjhweDtkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDo4cHg7XCI+PC9kaXY+XG4gICAgICAgICAgICA8L2RldGFpbHM+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgYCk7XG4gICAgcm9vdC5hcHBlbmRDaGlsZCh2aWV3KTtcblxuICAgIGNvbnN0IHRva2VuID0gKE5ldHdvcmtNYW5hZ2VyIGFzIGFueSkuSVsndG9rZW4nXTtcbiAgICBpZiAodG9rZW4pIFJlYWx0aW1lQ2xpZW50LkkuY29ubmVjdCh0b2tlbik7XG5cbiAgICBjb25zdCBsaXN0ID0gcXModmlldywgJyNsaXN0Jyk7XG4gICAgY29uc3QgdHBsQ29udGFpbmVyID0gcXModmlldywgJyN0cGxzJyk7XG4gICAgY29uc3QgcmVmcmVzaEJ0biA9IHFzPEhUTUxCdXR0b25FbGVtZW50Pih2aWV3LCAnI3JlZnJlc2gnKTtcblxuICAgIGNvbnN0IG1vdW50SWNvbnMgPSAocm9vdEVsOiBFbGVtZW50KSA9PiB7XG4gICAgICByb290RWwucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtaWNvXScpXG4gICAgICAgIC5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICAgIGNvbnN0IG5hbWUgPSAoZWwgYXMgSFRNTEVsZW1lbnQpLmdldEF0dHJpYnV0ZSgnZGF0YS1pY28nKSBhcyBhbnk7XG4gICAgICAgICAgdHJ5IHsgZWwuYXBwZW5kQ2hpbGQocmVuZGVySWNvbihuYW1lLCB7IHNpemU6IDIwIH0pKTsgfSBjYXRjaCB7fVxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIG1vdW50SWNvbnModmlldyk7XG5cbiAgICBjb25zdCBnZXRSYXJpdHkgPSAoaXRlbTogYW55LCB0cGw/OiBhbnkpOiB7IGtleTogJ2NvbW1vbid8J3JhcmUnfCdlcGljJ3wnbGVnZW5kYXJ5JzsgdGV4dDogc3RyaW5nIH0gPT4ge1xuICAgICAgY29uc3QgciA9ICh0cGwgJiYgKHRwbC5yYXJpdHkgfHwgdHBsLnRpZXIpKSB8fCBpdGVtLnJhcml0eTtcbiAgICAgIGNvbnN0IGxldmVsID0gTnVtYmVyKGl0ZW0ubGV2ZWwpIHx8IDA7XG4gICAgICBpZiAodHlwZW9mIHIgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGNvbnN0IGsgPSByLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGlmIChbJ2xlZ2VuZGFyeScsJ2VwaWMnLCdyYXJlJywnY29tbW9uJ10uaW5jbHVkZXMoaykpIHtcbiAgICAgICAgICByZXR1cm4geyBrZXk6IGsgYXMgYW55LCB0ZXh0OiBrID09PSAnbGVnZW5kYXJ5JyA/ICdcdTRGMjBcdThCRjQnIDogayA9PT0gJ2VwaWMnID8gJ1x1NTNGMlx1OEJENycgOiBrID09PSAncmFyZScgPyAnXHU3QTAwXHU2NzA5JyA6ICdcdTY2NkVcdTkwMUEnIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChsZXZlbCA+PSAxMikgcmV0dXJuIHsga2V5OiAnbGVnZW5kYXJ5JywgdGV4dDogJ1x1NEYyMFx1OEJGNCcgfTtcbiAgICAgIGlmIChsZXZlbCA+PSA4KSByZXR1cm4geyBrZXk6ICdlcGljJywgdGV4dDogJ1x1NTNGMlx1OEJENycgfTtcbiAgICAgIGlmIChsZXZlbCA+PSA0KSByZXR1cm4geyBrZXk6ICdyYXJlJywgdGV4dDogJ1x1N0EwMFx1NjcwOScgfTtcbiAgICAgIHJldHVybiB7IGtleTogJ2NvbW1vbicsIHRleHQ6ICdcdTY2NkVcdTkwMUEnIH07XG4gICAgfTtcblxuICAgIGNvbnN0IGZvcm1hdFRpbWUgPSAodHM6IG51bWJlcikgPT4ge1xuICAgICAgdHJ5IHsgcmV0dXJuIG5ldyBEYXRlKHRzKS50b0xvY2FsZVN0cmluZygpOyB9IGNhdGNoIHsgcmV0dXJuICcnICsgdHM7IH1cbiAgICB9O1xuXG4gICAgY29uc3QgbG9hZCA9IGFzeW5jICgpID0+IHtcbiAgICAgIHJlZnJlc2hCdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgcmVmcmVzaEJ0bi5pbm5lckhUTUwgPSAnPHNwYW4gZGF0YS1pY289XCJyZWZyZXNoXCI+PC9zcGFuPlx1NTIzN1x1NjVCMFx1NEUyRFx1MjAyNic7XG4gICAgICBtb3VudEljb25zKHJlZnJlc2hCdG4pO1xuICAgICAgYXdhaXQgYmFyLnVwZGF0ZSgpO1xuICAgICAgbGlzdC5pbm5lckhUTUwgPSAnJztcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSBsaXN0LmFwcGVuZENoaWxkKGh0bWwoJzxkaXYgY2xhc3M9XCJza2VsZXRvblwiPjwvZGl2PicpKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IFtkYXRhLCB0cGxzXSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgICBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyBpdGVtczogYW55W10gfT4oJy9pdGVtcycpLFxuICAgICAgICAgIE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IHRlbXBsYXRlczogYW55W10gfT4oJy9pdGVtcy90ZW1wbGF0ZXMnKS5jYXRjaCgoKSA9PiAoeyB0ZW1wbGF0ZXM6IFtdIH0pKVxuICAgICAgICBdKTtcbiAgICAgICAgY29uc3QgdHBsQnlJZDogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICAgICAgICBmb3IgKGNvbnN0IHQgb2YgKHRwbHMudGVtcGxhdGVzIHx8IFtdKSkgdHBsQnlJZFt0LmlkXSA9IHQ7XG4gICAgICAgIGxpc3QuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIGlmICghZGF0YS5pdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgICBsaXN0LmFwcGVuZENoaWxkKGh0bWwoJzxkaXYgc3R5bGU9XCJvcGFjaXR5Oi44O1wiPlx1NjY4Mlx1NjVFMFx1OTA1M1x1NTE3N1x1RkYwQ1x1NUMxRFx1OEJENVx1NTkxQVx1NjMxNlx1NzdGRlx1NjIxNlx1NjNBMFx1NTkzQVx1NEVFNVx1ODNCN1x1NTNENlx1NjZGNFx1NTkxQVx1OEQ0NFx1NkU5MDwvZGl2PicpKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgZGF0YS5pdGVtcykge1xuICAgICAgICAgIGNvbnN0IHRwbCA9IHRwbEJ5SWRbaXRlbS50ZW1wbGF0ZUlkXTtcbiAgICAgICAgICBjb25zdCByYXJpdHkgPSBnZXRSYXJpdHkoaXRlbSwgdHBsKTtcbiAgICAgICAgICBjb25zdCBuYW1lID0gKHRwbCAmJiAodHBsLm5hbWUgfHwgdHBsLmlkKSkgfHwgaXRlbS50ZW1wbGF0ZUlkO1xuXG4gICAgICAgICAgY29uc3Qgcm93ID0gaHRtbChgXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaXRlbS1jYXJkIGhvdmVyLWxpZnQgJHtcbiAgICAgICAgICAgICAgcmFyaXR5LmtleSA9PT0gJ2xlZ2VuZGFyeScgPyAncmFyaXR5LW91dGxpbmUtbGVnZW5kYXJ5JyA6IHJhcml0eS5rZXkgPT09ICdlcGljJyA/ICdyYXJpdHktb3V0bGluZS1lcGljJyA6IHJhcml0eS5rZXkgPT09ICdyYXJlJyA/ICdyYXJpdHktb3V0bGluZS1yYXJlJyA6ICdyYXJpdHktb3V0bGluZS1jb21tb24nXG4gICAgICAgICAgICB9XCIgZGF0YS1yYXJpdHk9XCIke3Jhcml0eS5rZXl9XCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIiBzdHlsZT1cImp1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2FsaWduLWl0ZW1zOmZsZXgtc3RhcnQ7Z2FwOjEwcHg7XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cImRpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjRweDtmbGV4OjE7bWluLXdpZHRoOjA7XCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZGlzcGxheTpmbGV4O2ZsZXgtd3JhcDp3cmFwO2dhcDo2cHg7YWxpZ24taXRlbXM6Y2VudGVyO1wiPlxuICAgICAgICAgICAgICAgICAgICA8c3Ryb25nIHN0eWxlPVwiZm9udC1zaXplOjE1cHg7d2hpdGUtc3BhY2U6bm93cmFwO2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjZweDtcIj48c3BhbiBkYXRhLWljbz1cIm9yZVwiPjwvc3Bhbj4ke25hbWV9PC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYmFkZ2UgcmFyaXR5LSR7cmFyaXR5LmtleX1cIj48aT48L2k+JHtyYXJpdHkudGV4dH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICR7aXRlbS5pc0VxdWlwcGVkID8gJzxzcGFuIGNsYXNzPVwicGlsbFwiPlx1NURGMlx1ODhDNVx1NTkwNzwvc3Bhbj4nIDogJyd9XG4gICAgICAgICAgICAgICAgICAgICR7aXRlbS5pc0xpc3RlZCA/ICc8c3BhbiBjbGFzcz1cInBpbGxcIj5cdTYzMDJcdTUzNTVcdTRFMkQ8L3NwYW4+JyA6ICcnfVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwib3BhY2l0eTouODU7ZGlzcGxheTpmbGV4O2ZsZXgtd3JhcDp3cmFwO2dhcDo4cHg7XCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuPlx1N0I0OVx1N0VBNyBMdi4ke2l0ZW0ubGV2ZWx9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInBpbGxcIj5cdTVCOUVcdTRGOEIgJHtpdGVtLmlkfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgJHt0cGw/LmNhdGVnb3J5ID8gYDxzcGFuIGNsYXNzPVwicGlsbFwiPiR7dHBsLmNhdGVnb3J5fTwvc3Bhbj5gIDogJyd9XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYWN0aW9uc1wiPlxuICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biAke2l0ZW0uaXNFcXVpcHBlZCA/ICdidG4tc2VsbCcgOiAnYnRuLWJ1eSd9XCIgZGF0YS1hY3Q9XCIke2l0ZW0uaXNFcXVpcHBlZCA/ICd1bmVxdWlwJyA6ICdlcXVpcCd9XCIgZGF0YS1pZD1cIiR7aXRlbS5pZH1cIj48c3BhbiBkYXRhLWljbz1cIiR7aXRlbS5pc0VxdWlwcGVkID8gJ3gnIDogJ3NoaWVsZCd9XCI+PC9zcGFuPiR7aXRlbS5pc0VxdWlwcGVkID8gJ1x1NTM3OFx1NEUwQicgOiAnXHU4OEM1XHU1OTA3J308L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIiBkYXRhLWFjdD1cInVwZ3JhZGVcIiBkYXRhLWlkPVwiJHtpdGVtLmlkfVwiIHRpdGxlPVwiXHU2RDg4XHU4MDE3ICR7aXRlbS5sZXZlbCAqIDUwfSBcdTc3RkZcdTc3RjNcIj48c3BhbiBkYXRhLWljbz1cIndyZW5jaFwiPjwvc3Bhbj5cdTUzNDdcdTdFQTcgKCR7aXRlbS5sZXZlbCAqIDUwfSk8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLWdob3N0XCIgZGF0YS1hY3Q9XCJ0b2dnbGVcIiBkYXRhLWlkPVwiJHtpdGVtLmlkfVwiPjxzcGFuIGRhdGEtaWNvPVwibGlzdFwiPjwvc3Bhbj5cdThCRTZcdTYwQzU8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0aW1lbGluZVwiIGlkPVwidGwtJHtpdGVtLmlkfVwiIGhpZGRlbj48L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIGApO1xuICAgICAgICAgIG1vdW50SWNvbnMocm93KTtcbiAgICAgICAgICByb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZXYpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGV2LnRhcmdldCBhcyBIVE1MQnV0dG9uRWxlbWVudDtcbiAgICAgICAgICAgIGNvbnN0IGlkID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1pZCcpO1xuICAgICAgICAgICAgY29uc3QgYWN0ID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1hY3QnKTtcbiAgICAgICAgICAgIGlmICghaWQgfHwgIWFjdCkgcmV0dXJuO1xuICAgICAgICAgICAgaWYgKGFjdCA9PT0gJ3RvZ2dsZScpIHtcbiAgICAgICAgICAgICAgY29uc3QgYm94ID0gcm93LnF1ZXJ5U2VsZWN0b3IoYCN0bC0ke2lkfWApIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICAgICAgICBpZiAoIWJveCkgcmV0dXJuO1xuICAgICAgICAgICAgICBpZiAoIWJveC5oYXNDaGlsZE5vZGVzKCkpIHtcbiAgICAgICAgICAgICAgICBib3guaW5uZXJIVE1MID0gJzxkaXYgY2xhc3M9XCJza2VsZXRvblwiIHN0eWxlPVwiaGVpZ2h0OjM2cHg7XCI+PC9kaXY+JztcbiAgICAgICAgICAgICAgICBib3guaGlkZGVuID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IGxvZ3M6IHsgdHlwZTogc3RyaW5nOyBkZXNjPzogc3RyaW5nOyB0aW1lOiBudW1iZXIgfVtdIH0+KGAvaXRlbXMvbG9ncz9pdGVtSWQ9JHtpZH1gKTtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGxvZ3MgPSBBcnJheS5pc0FycmF5KHJlcy5sb2dzKSA/IHJlcy5sb2dzIDogW107XG4gICAgICAgICAgICAgICAgICBib3guaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgICAgICAgICBpZiAoIWxvZ3MubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGJveC5pbm5lckhUTUwgPSAnPGRpdiBzdHlsZT1cIm9wYWNpdHk6Ljg7XCI+XHU2NjgyXHU2NUUwXHU1Mzg2XHU1M0YyXHU2NTcwXHU2MzZFPC9kaXY+JztcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgbG9nIG9mIGxvZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICBjb25zdCBub2RlID0gaHRtbChgXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGltZWxpbmUtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZG90XCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0aW1lXCI+JHtmb3JtYXRUaW1lKGxvZy50aW1lKX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRlc2NcIj4keyhsb2cuZGVzYyB8fCBsb2cudHlwZSB8fCAnJykucmVwbGFjZSgvPC9nLCcmbHQ7Jyl9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICBgKTtcbiAgICAgICAgICAgICAgICAgICAgICBib3guYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICAgICAgICAgIGJveC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICAgICAgICAgIGJveC5hcHBlbmRDaGlsZChodG1sKGBcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRpbWVsaW5lLWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZG90XCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRpbWVcIj5cdTIwMTQ8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGVzY1wiPlx1Njc2NVx1NkU5MFx1NjcyQVx1NzdFNSBcdTAwQjcgXHU1M0VGXHU5MDFBXHU4RkM3XHU2MzE2XHU3N0ZGXHUzMDAxXHU2M0EwXHU1OTNBXHU2MjE2XHU0RUE0XHU2NjEzXHU4M0I3XHU1M0Q2PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgYCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBib3guaGlkZGVuID0gIWJveC5oaWRkZW47XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgdGFyZ2V0LmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgaWYgKGFjdCA9PT0gJ2VxdWlwJykge1xuICAgICAgICAgICAgICAgIHRhcmdldC5pbm5lckhUTUwgPSAnPHNwYW4gZGF0YS1pY289XCJzaGllbGRcIj48L3NwYW4+XHU4OEM1XHU1OTA3XHU0RTJEXHUyMDI2JztcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChhY3QgPT09ICd1bmVxdWlwJykge1xuICAgICAgICAgICAgICAgIHRhcmdldC5pbm5lckhUTUwgPSAnPHNwYW4gZGF0YS1pY289XCJ4XCI+PC9zcGFuPlx1NTM3OFx1NEUwQlx1NEUyRFx1MjAyNic7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoYWN0ID09PSAndXBncmFkZScpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXQuaW5uZXJIVE1MID0gJzxzcGFuIGRhdGEtaWNvPVwid3JlbmNoXCI+PC9zcGFuPlx1NTM0N1x1N0VBN1x1NEUyRFx1MjAyNic7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgbW91bnRJY29ucyh0YXJnZXQpO1xuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgaWYgKGFjdCA9PT0gJ2VxdWlwJykge1xuICAgICAgICAgICAgICAgIGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdCgnL2l0ZW1zL2VxdWlwJywgeyBtZXRob2Q6ICdQT1NUJywgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBpdGVtSWQ6IGlkIH0pIH0pO1xuICAgICAgICAgICAgICAgIHNob3dUb2FzdCgnXHU4OEM1XHU1OTA3XHU2MjEwXHU1MjlGJywgJ3N1Y2Nlc3MnKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChhY3QgPT09ICd1bmVxdWlwJykge1xuICAgICAgICAgICAgICAgIGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdCgnL2l0ZW1zL3VuZXF1aXAnLCB7IG1ldGhvZDogJ1BPU1QnLCBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGl0ZW1JZDogaWQgfSkgfSk7XG4gICAgICAgICAgICAgICAgc2hvd1RvYXN0KCdcdTUzNzhcdTRFMEJcdTYyMTBcdTUyOUYnLCAnc3VjY2VzcycpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFjdCA9PT0gJ3VwZ3JhZGUnKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgbGV2ZWw6IG51bWJlcjsgY29zdDogbnVtYmVyIH0+KCcvaXRlbXMvdXBncmFkZScsIHsgbWV0aG9kOiAnUE9TVCcsIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgaXRlbUlkOiBpZCB9KSB9KTtcbiAgICAgICAgICAgICAgICAvLyBcdTUzNDdcdTdFQTdcdTYyMTBcdTUyOUZcdTUyQThcdTc1M0JcbiAgICAgICAgICAgICAgICByb3cuY2xhc3NMaXN0LmFkZCgndXBncmFkZS1zdWNjZXNzJyk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiByb3cuY2xhc3NMaXN0LnJlbW92ZSgndXBncmFkZS1zdWNjZXNzJyksIDEwMDApO1xuICAgICAgICAgICAgICAgIHNob3dUb2FzdChgXHU1MzQ3XHU3RUE3XHU2MjEwXHU1MjlGXHVGRjAxXHU3QjQ5XHU3RUE3ICR7cmVzLmxldmVsfVx1RkYwOFx1NkQ4OFx1ODAxNyAke3Jlcy5jb3N0fSBcdTc3RkZcdTc3RjNcdUZGMDlgLCAnc3VjY2VzcycpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGF3YWl0IGJhci51cGRhdGUoKTtcbiAgICAgICAgICAgICAgYXdhaXQgbG9hZCgpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgICAgICAgIHNob3dUb2FzdChlPy5tZXNzYWdlIHx8ICdcdTY0Q0RcdTRGNUNcdTU5MzFcdThEMjUnLCAnZXJyb3InKTtcbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgIHRhcmdldC5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQocm93KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRwbENvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgZm9yIChjb25zdCB0cGwgb2YgKHRwbHMudGVtcGxhdGVzIHx8IFtdKSkge1xuICAgICAgICAgIGNvbnN0IHJvdyA9IGh0bWwoYDxkaXYgY2xhc3M9XCJsaXN0LWl0ZW1cIj48c3Ryb25nPiR7dHBsLm5hbWUgfHwgdHBsLmlkfTwvc3Ryb25nPiBcdTAwQjcgJHt0cGwuY2F0ZWdvcnkgfHwgJ1x1NjcyQVx1NzdFNVx1N0M3Qlx1NTc4Qid9PC9kaXY+YCk7XG4gICAgICAgICAgdHBsQ29udGFpbmVyLmFwcGVuZENoaWxkKHJvdyk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgICBzaG93VG9hc3QoZT8ubWVzc2FnZSB8fCAnXHU1MkEwXHU4RjdEXHU0RUQzXHU1RTkzXHU1OTMxXHU4RDI1Jyk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICByZWZyZXNoQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIHJlZnJlc2hCdG4uaW5uZXJIVE1MID0gJzxzcGFuIGRhdGEtaWNvPVwicmVmcmVzaFwiPjwvc3Bhbj5cdTUyMzdcdTY1QjAnO1xuICAgICAgICBtb3VudEljb25zKHJlZnJlc2hCdG4pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZWZyZXNoQnRuLm9uY2xpY2sgPSAoKSA9PiBsb2FkKCk7XG4gICAgYXdhaXQgbG9hZCgpO1xuICB9XG59XG4iLCAiaW1wb3J0IHsgTmV0d29ya01hbmFnZXIgfSBmcm9tICcuLi9jb3JlL05ldHdvcmtNYW5hZ2VyJztcbmltcG9ydCB7IGh0bWwsIHFzIH0gZnJvbSAnLi4vdXRpbHMvZG9tJztcbmltcG9ydCB7IHJlbmRlck5hdiB9IGZyb20gJy4uL2NvbXBvbmVudHMvTmF2JztcbmltcG9ydCB7IFJlYWx0aW1lQ2xpZW50IH0gZnJvbSAnLi4vY29yZS9SZWFsdGltZUNsaWVudCc7XG5pbXBvcnQgeyBzaG93VG9hc3QgfSBmcm9tICcuLi9jb21wb25lbnRzL1RvYXN0JztcbmltcG9ydCB7IHJlbmRlclJlc291cmNlQmFyIH0gZnJvbSAnLi4vY29tcG9uZW50cy9SZXNvdXJjZUJhcic7XG5pbXBvcnQgeyByZW5kZXJJY29uIH0gZnJvbSAnLi4vY29tcG9uZW50cy9JY29uJztcblxuZXhwb3J0IGNsYXNzIFBsdW5kZXJTY2VuZSB7XG4gIHByaXZhdGUgcmVzdWx0Qm94OiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuXG4gIG1vdW50KHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgcm9vdC5pbm5lckhUTUwgPSAnJztcbiAgICByb290LmFwcGVuZENoaWxkKHJlbmRlck5hdigncGx1bmRlcicpKTtcbiAgICBjb25zdCBiYXIgPSByZW5kZXJSZXNvdXJjZUJhcigpO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQoYmFyLnJvb3QpO1xuXG4gICAgY29uc3QgdmlldyA9IGh0bWwoYFxuICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lciBncmlkLTJcIiBzdHlsZT1cImNvbG9yOiNmZmY7XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkIGZhZGUtaW5cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCIgc3R5bGU9XCJqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjthbGlnbi1pdGVtczpjZW50ZXI7XCI+XG4gICAgICAgICAgICA8aDMgc3R5bGU9XCJtYXJnaW46MDtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo4cHg7XCI+PHNwYW4gZGF0YS1pY289XCJzd29yZFwiPjwvc3Bhbj5cdTYzQTBcdTU5M0FcdTc2RUVcdTY4MDc8L2gzPlxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInJlZnJlc2hcIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiPjxzcGFuIGRhdGEtaWNvPVwicmVmcmVzaFwiPjwvc3Bhbj5cdTUyMzdcdTY1QjA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGlkPVwibGlzdFwiIHN0eWxlPVwibWFyZ2luLXRvcDoxMnB4O2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjhweDtcIj48L2Rpdj5cbiAgICAgICAgICA8ZGl2IGlkPVwicmVzdWx0XCIgc3R5bGU9XCJtYXJnaW4tdG9wOjEycHg7b3BhY2l0eTouOTtmb250LWZhbWlseTptb25vc3BhY2U7XCI+PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgYCk7XG4gICAgcm9vdC5hcHBlbmRDaGlsZCh2aWV3KTtcblxuICAgIGNvbnN0IHRva2VuID0gKE5ldHdvcmtNYW5hZ2VyIGFzIGFueSkuSVsndG9rZW4nXTtcbiAgICBpZiAodG9rZW4pIFJlYWx0aW1lQ2xpZW50LkkuY29ubmVjdCh0b2tlbik7XG5cbiAgICBSZWFsdGltZUNsaWVudC5JLm9uKCdwbHVuZGVyLmF0dGFja2VkJywgKG1zZykgPT4ge1xuICAgICAgc2hvd1RvYXN0KGBcdTg4QUJcdTYzQTBcdTU5M0FcdUZGMUFcdTY3NjVcdTgxRUEgJHttc2cuYXR0YWNrZXJ9XHVGRjBDXHU2MzVGXHU1OTMxICR7bXNnLmxvc3N9YCk7XG4gICAgICB0aGlzLmxvZyhgXHU4OEFCICR7bXNnLmF0dGFja2VyfSBcdTYzQTBcdTU5M0FcdUZGMENcdTYzNUZcdTU5MzEgJHttc2cubG9zc31gKTtcbiAgICB9KTtcbiAgICB0aGlzLnJlc3VsdEJveCA9IHFzKHZpZXcsICcjcmVzdWx0Jyk7XG5cbiAgICBjb25zdCBsaXN0ID0gcXModmlldywgJyNsaXN0Jyk7XG4gICAgY29uc3QgcmVmcmVzaEJ0biA9IHFzPEhUTUxCdXR0b25FbGVtZW50Pih2aWV3LCAnI3JlZnJlc2gnKTtcbiAgICBjb25zdCBtb3VudEljb25zID0gKHJvb3RFbDogRWxlbWVudCkgPT4ge1xuICAgICAgcm9vdEVsLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWljb10nKVxuICAgICAgICAuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgICBjb25zdCBuYW1lID0gKGVsIGFzIEhUTUxFbGVtZW50KS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWNvJykgYXMgYW55O1xuICAgICAgICAgIHRyeSB7IGVsLmFwcGVuZENoaWxkKHJlbmRlckljb24obmFtZSwgeyBzaXplOiAyMCB9KSk7IH0gY2F0Y2gge31cbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBtb3VudEljb25zKHZpZXcpO1xuXG4gICAgY29uc3QgbG9hZCA9IGFzeW5jICgpID0+IHtcbiAgICAgIHJlZnJlc2hCdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgcmVmcmVzaEJ0bi5pbm5lckhUTUwgPSAnPHNwYW4gZGF0YS1pY289XCJyZWZyZXNoXCI+PC9zcGFuPlx1NTIzN1x1NjVCMFx1NEUyRFx1MjAyNic7XG4gICAgICBtb3VudEljb25zKHJlZnJlc2hCdG4pO1xuICAgICAgYXdhaXQgYmFyLnVwZGF0ZSgpO1xuICAgICAgbGlzdC5pbm5lckhUTUwgPSAnJztcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSBsaXN0LmFwcGVuZENoaWxkKGh0bWwoJzxkaXYgY2xhc3M9XCJza2VsZXRvblwiPjwvZGl2PicpKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyB0YXJnZXRzOiBhbnlbXSB9PignL3BsdW5kZXIvdGFyZ2V0cycpO1xuICAgICAgICBsaXN0LmlubmVySFRNTCA9ICcnO1xuICAgICAgICBpZiAoIWRhdGEudGFyZ2V0cy5sZW5ndGgpIHtcbiAgICAgICAgICBsaXN0LmFwcGVuZENoaWxkKGh0bWwoJzxkaXYgc3R5bGU9XCJvcGFjaXR5Oi44O1wiPlx1NjY4Mlx1NjVFMFx1NTNFRlx1NjNBMFx1NTkzQVx1NzY4NFx1NzZFRVx1NjgwN1x1RkYwQ1x1N0EwRFx1NTQwRVx1NTE4RFx1OEJENTwvZGl2PicpKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IHRhcmdldCBvZiBkYXRhLnRhcmdldHMpIHtcbiAgICAgICAgICBjb25zdCByb3cgPSBodG1sKGBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsaXN0LWl0ZW0gbGlzdC1pdGVtLS1zZWxsXCI+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDoycHg7XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cImRpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjZweDtcIj48c3BhbiBkYXRhLWljbz1cInRhcmdldFwiPjwvc3Bhbj48c3Ryb25nPiR7dGFyZ2V0LnVzZXJuYW1lIHx8IHRhcmdldC5pZH08L3N0cm9uZz48L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwib3BhY2l0eTouODU7XCI+XHU3N0ZGXHU3N0YzXHVGRjFBJHt0YXJnZXQub3JlfSA8c3BhbiBjbGFzcz1cInBpbGxcIj5cdTk4ODRcdThCQTFcdTY1MzZcdTc2Q0EgNSV+MzAlPC9zcGFuPjwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1zZWxsXCIgZGF0YS1pZD1cIiR7dGFyZ2V0LmlkfVwiPjxzcGFuIGRhdGEtaWNvPVwic3dvcmRcIj48L3NwYW4+XHU2M0EwXHU1OTNBPC9idXR0b24+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgYCk7XG4gICAgICAgICAgbW91bnRJY29ucyhyb3cpO1xuICAgICAgICAgIHJvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIChldikgPT4ge1xuICAgICAgICAgICAgY29uc3QgZWwgPSBldi50YXJnZXQgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XG4gICAgICAgICAgICBjb25zdCBpZCA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1pZCcpO1xuICAgICAgICAgICAgaWYgKCFpZCkgcmV0dXJuO1xuICAgICAgICAgICAgZWwuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWwgPSBlbC50ZXh0Q29udGVudCB8fCAnJztcbiAgICAgICAgICAgIGVsLnRleHRDb250ZW50ID0gJ1x1NjNBMFx1NTkzQVx1NEUyRFx1MjAyNic7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyBzdWNjZXNzOiBib29sZWFuOyBsb290X2Ftb3VudDogbnVtYmVyIH0+KGAvcGx1bmRlci8ke2lkfWAsIHsgbWV0aG9kOiAnUE9TVCcgfSk7XG4gICAgICAgICAgICAgIGlmIChyZXMuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIHRoaXMubG9nKGBcdTYyMTBcdTUyOUZcdTYzQTBcdTU5M0EgJHtpZH1cdUZGMENcdTgzQjdcdTVGOTcgJHtyZXMubG9vdF9hbW91bnR9YCk7XG4gICAgICAgICAgICAgICAgc2hvd1RvYXN0KGBcdTYzQTBcdTU5M0FcdTYyMTBcdTUyOUZcdUZGMENcdTgzQjdcdTVGOTcgJHtyZXMubG9vdF9hbW91bnR9IFx1NzdGRlx1NzdGM2AsICdzdWNjZXNzJyk7XG4gICAgICAgICAgICAgICAgLy8gXHU1MjM3XHU2NUIwXHU1MjE3XHU4ODY4XG4gICAgICAgICAgICAgICAgYXdhaXQgbG9hZCgpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMubG9nKGBcdTYzQTBcdTU5M0EgJHtpZH0gXHU1OTMxXHU4RDI1YCk7XG4gICAgICAgICAgICAgICAgc2hvd1RvYXN0KCdcdTYzQTBcdTU5M0FcdTU5MzFcdThEMjUnLCAnd2FybicpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGF3YWl0IGJhci51cGRhdGUoKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gZT8ubWVzc2FnZSB8fCAnXHU2M0EwXHU1OTNBXHU1OTMxXHU4RDI1JztcbiAgICAgICAgICAgICAgdGhpcy5sb2coYFx1NjNBMFx1NTkzQVx1NTkzMVx1OEQyNVx1RkYxQSR7bWVzc2FnZX1gKTtcbiAgICAgICAgICAgICAgaWYgKG1lc3NhZ2UuaW5jbHVkZXMoJ1x1NTFCN1x1NTM3NCcpKSB7XG4gICAgICAgICAgICAgICAgc2hvd1RvYXN0KG1lc3NhZ2UsICd3YXJuJyk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2hvd1RvYXN0KG1lc3NhZ2UsICdlcnJvcicpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICBlbC50ZXh0Q29udGVudCA9IG9yaWdpbmFsO1xuICAgICAgICAgICAgICBlbC5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQocm93KTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgIHNob3dUb2FzdChlPy5tZXNzYWdlIHx8ICdcdTUyQTBcdThGN0RcdTYzQTBcdTU5M0FcdTc2RUVcdTY4MDdcdTU5MzFcdThEMjUnKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHJlZnJlc2hCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgcmVmcmVzaEJ0bi5pbm5lckhUTUwgPSAnPHNwYW4gZGF0YS1pY289XCJyZWZyZXNoXCI+PC9zcGFuPlx1NTIzN1x1NjVCMCc7XG4gICAgICAgIG1vdW50SWNvbnMocmVmcmVzaEJ0bik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJlZnJlc2hCdG4ub25jbGljayA9ICgpID0+IGxvYWQoKTtcbiAgICBsb2FkKCk7XG4gIH1cblxuICBwcml2YXRlIGxvZyhtc2c6IHN0cmluZykge1xuICAgIGlmICghdGhpcy5yZXN1bHRCb3gpIHJldHVybjtcbiAgICBjb25zdCBsaW5lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgbGluZS50ZXh0Q29udGVudCA9IGBbJHtuZXcgRGF0ZSgpLnRvTG9jYWxlVGltZVN0cmluZygpfV0gJHttc2d9YDtcbiAgICB0aGlzLnJlc3VsdEJveC5wcmVwZW5kKGxpbmUpO1xuICB9XG59XG4iLCAiaW1wb3J0IHsgTmV0d29ya01hbmFnZXIgfSBmcm9tICcuLi9jb3JlL05ldHdvcmtNYW5hZ2VyJztcbmltcG9ydCB7IGh0bWwsIHFzIH0gZnJvbSAnLi4vdXRpbHMvZG9tJztcbmltcG9ydCB7IHJlbmRlck5hdiB9IGZyb20gJy4uL2NvbXBvbmVudHMvTmF2JztcbmltcG9ydCB7IFJlYWx0aW1lQ2xpZW50IH0gZnJvbSAnLi4vY29yZS9SZWFsdGltZUNsaWVudCc7XG5pbXBvcnQgeyBHYW1lTWFuYWdlciB9IGZyb20gJy4uL2NvcmUvR2FtZU1hbmFnZXInO1xuaW1wb3J0IHsgc2hvd1RvYXN0IH0gZnJvbSAnLi4vY29tcG9uZW50cy9Ub2FzdCc7XG5pbXBvcnQgeyByZW5kZXJSZXNvdXJjZUJhciB9IGZyb20gJy4uL2NvbXBvbmVudHMvUmVzb3VyY2VCYXInO1xuaW1wb3J0IHsgcmVuZGVySWNvbiB9IGZyb20gJy4uL2NvbXBvbmVudHMvSWNvbic7XG5cbnR5cGUgT3JkZXIgPSB7XG4gIGlkOiBzdHJpbmc7XG4gIHVzZXJJZDogc3RyaW5nO1xuICB0eXBlOiAnYnV5JyB8ICdzZWxsJztcbiAgaXRlbVRlbXBsYXRlSWQ/OiBzdHJpbmc7XG4gIGl0ZW1JbnN0YW5jZUlkPzogc3RyaW5nO1xuICBwcmljZTogbnVtYmVyO1xuICBhbW91bnQ6IG51bWJlcjtcbiAgY3JlYXRlZEF0OiBudW1iZXI7XG59O1xuXG5leHBvcnQgY2xhc3MgRXhjaGFuZ2VTY2VuZSB7XG4gIHByaXZhdGUgcmVmcmVzaFRpbWVyOiBudW1iZXIgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSB0ZW1wbGF0ZXM6IHsgaWQ6IHN0cmluZzsgbmFtZT86IHN0cmluZzsgY2F0ZWdvcnk/OiBzdHJpbmcgfVtdID0gW107XG4gIHByaXZhdGUgaW52ZW50b3J5OiBhbnlbXSA9IFtdO1xuXG4gIGFzeW5jIG1vdW50KHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgdGhpcy5jbGVhclRpbWVyKCk7XG4gICAgcm9vdC5pbm5lckhUTUwgPSAnJztcblxuICAgIGNvbnN0IG5hdiA9IHJlbmRlck5hdignZXhjaGFuZ2UnKTtcbiAgICBjb25zdCBiYXIgPSByZW5kZXJSZXNvdXJjZUJhcigpO1xuICAgIGNvbnN0IHZpZXcgPSBodG1sKGBcbiAgICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXIgZ3JpZC0yXCIgc3R5bGU9XCJjb2xvcjojZmZmO1wiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZCBmYWRlLWluXCI+XG4gICAgICAgICAgPGgzIHN0eWxlPVwibWFyZ2luOjAgMCAxMnB4O2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjhweDtcIj48c3BhbiBkYXRhLWljbz1cImV4Y2hhbmdlXCI+PC9zcGFuPlx1NUUwMlx1NTczQVx1NEUwQlx1NTM1NTwvaDM+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiIHN0eWxlPVwiZmxleC13cmFwOndyYXA7YWxpZ24taXRlbXM6ZmxleC1lbmQ7Z2FwOjEycHg7XCI+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZmxleDoxO21pbi13aWR0aDoxODBweDtcIj5cbiAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVwiZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NnB4O1wiPjxzcGFuIGRhdGEtaWNvPVwibGlzdFwiPjwvc3Bhbj5cdThEMkRcdTRFNzBcdTZBMjFcdTY3N0Y8L2xhYmVsPlxuICAgICAgICAgICAgICA8c2VsZWN0IGlkPVwidHBsXCIgY2xhc3M9XCJpbnB1dFwiPjwvc2VsZWN0PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZmxleDoxO21pbi13aWR0aDoxMjBweDtcIj5cbiAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVwiZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NnB4O1wiPjxzcGFuIGRhdGEtaWNvPVwiY29pblwiPjwvc3Bhbj5cdTRFRjdcdTY4M0MgKEJCXHU1RTAxKTwvbGFiZWw+XG4gICAgICAgICAgICAgIDxpbnB1dCBpZD1cInByaWNlXCIgY2xhc3M9XCJpbnB1dFwiIHR5cGU9XCJudW1iZXJcIiBtaW49XCIxXCIgdmFsdWU9XCIxMFwiLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT1cImZsZXg6MTttaW4td2lkdGg6MTIwcHg7XCI+XG4gICAgICAgICAgICAgIDxsYWJlbD5cdThEMkRcdTRFNzBcdTY1NzBcdTkxQ0Y8L2xhYmVsPlxuICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJhbW91bnRcIiBjbGFzcz1cImlucHV0XCIgdHlwZT1cIm51bWJlclwiIG1pbj1cIjFcIiB2YWx1ZT1cIjFcIi8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxidXR0b24gaWQ9XCJwbGFjZUJ1eVwiIGNsYXNzPVwiYnRuIGJ0bi1idXlcIiBzdHlsZT1cIm1pbi13aWR0aDoxMjBweDtcIj48c3BhbiBkYXRhLWljbz1cImFycm93LXJpZ2h0XCI+PC9zcGFuPlx1NEUwQlx1NEU3MFx1NTM1NTwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgc3R5bGU9XCJoZWlnaHQ6OHB4O1wiPjwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIiBzdHlsZT1cImZsZXgtd3JhcDp3cmFwO2FsaWduLWl0ZW1zOmZsZXgtZW5kO2dhcDoxMnB4O1wiPlxuICAgICAgICAgICAgPGRpdiBzdHlsZT1cImZsZXg6MTttaW4td2lkdGg6MjIwcHg7XCI+XG4gICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cImRpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjZweDtcIj48c3BhbiBkYXRhLWljbz1cImJveFwiPjwvc3Bhbj5cdTUxRkFcdTU1MkVcdTkwNTNcdTUxNzc8L2xhYmVsPlxuICAgICAgICAgICAgICA8c2VsZWN0IGlkPVwiaW5zdFwiIGNsYXNzPVwiaW5wdXRcIj48L3NlbGVjdD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT1cImZsZXg6MTttaW4td2lkdGg6MTIwcHg7XCI+XG4gICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cImRpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjZweDtcIj48c3BhbiBkYXRhLWljbz1cImNvaW5cIj48L3NwYW4+XHU0RUY3XHU2ODNDIChCQlx1NUUwMSk8L2xhYmVsPlxuICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJzcHJpY2VcIiBjbGFzcz1cImlucHV0XCIgdHlwZT1cIm51bWJlclwiIG1pbj1cIjFcIiB2YWx1ZT1cIjVcIi8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxidXR0b24gaWQ9XCJwbGFjZVNlbGxcIiBjbGFzcz1cImJ0biBidG4tc2VsbFwiIHN0eWxlPVwibWluLXdpZHRoOjEyMHB4O1wiPjxzcGFuIGRhdGEtaWNvPVwiYXJyb3ctcmlnaHRcIj48L3NwYW4+XHU0RTBCXHU1MzU2XHU1MzU1PC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBpZD1cImludmVudG9yeVwiIHN0eWxlPVwibWFyZ2luLXRvcDoxMnB4O2Rpc3BsYXk6ZmxleDtmbGV4LXdyYXA6d3JhcDtnYXA6OHB4O1wiPjwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZCBmYWRlLWluXCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiIHN0eWxlPVwianVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YWxpZ24taXRlbXM6Y2VudGVyO2dhcDoxMnB4O1wiPlxuICAgICAgICAgICAgPGgzIHN0eWxlPVwibWFyZ2luOjA7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6OHB4O1wiPjxzcGFuIGRhdGEtaWNvPVwibGlzdFwiPjwvc3Bhbj5cdThCQTJcdTUzNTVcdTdDM0Y8L2gzPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiIHN0eWxlPVwiZmxleC13cmFwOndyYXA7Z2FwOjhweDtcIj5cbiAgICAgICAgICAgICAgPHNlbGVjdCBpZD1cInFfdHBsXCIgY2xhc3M9XCJpbnB1dFwiIHN0eWxlPVwid2lkdGg6MTgwcHg7XCI+PC9zZWxlY3Q+XG4gICAgICAgICAgICAgIDxzZWxlY3QgaWQ9XCJxX3R5cGVcIiBjbGFzcz1cImlucHV0XCIgc3R5bGU9XCJ3aWR0aDoxMjBweDtcIj5cbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiYnV5XCI+XHU0RTcwXHU1MzU1PC9vcHRpb24+XG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInNlbGxcIj5cdTUzNTZcdTUzNTU8L29wdGlvbj5cbiAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cInJvdyBwaWxsXCIgc3R5bGU9XCJhbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjZweDtcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBkYXRhLWljbz1cInVzZXJcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgPGlucHV0IGlkPVwibXlcIiB0eXBlPVwiY2hlY2tib3hcIi8+IFx1NTNFQVx1NzcwQlx1NjIxMVx1NzY4NFxuICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwicmVmcmVzaFwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCIgc3R5bGU9XCJtaW4td2lkdGg6OTZweDtcIj48c3BhbiBkYXRhLWljbz1cInJlZnJlc2hcIj48L3NwYW4+XHU1MjM3XHU2NUIwPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGlkPVwiYm9va1wiIHN0eWxlPVwibWFyZ2luLXRvcDoxMnB4O2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjhweDtcIj48L2Rpdj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQgZmFkZS1pblwiIGlkPVwibG9nc1wiIHN0eWxlPVwib3BhY2l0eTouOTtmb250LWZhbWlseTptb25vc3BhY2U7bWluLWhlaWdodDoyNHB4O1wiPjwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgYCk7XG5cbiAgICByb290LmFwcGVuZENoaWxkKG5hdik7XG4gICAgcm9vdC5hcHBlbmRDaGlsZChiYXIucm9vdCk7XG4gICAgcm9vdC5hcHBlbmRDaGlsZCh2aWV3KTtcblxuICAgIGNvbnN0IHRva2VuID0gKE5ldHdvcmtNYW5hZ2VyIGFzIGFueSkuSVsndG9rZW4nXTtcbiAgICBpZiAodG9rZW4pIFJlYWx0aW1lQ2xpZW50LkkuY29ubmVjdCh0b2tlbik7XG4gICAgY29uc3QgbWUgPSBHYW1lTWFuYWdlci5JLmdldFByb2ZpbGUoKTtcblxuICAgIGNvbnN0IGJvb2sgPSBxcyh2aWV3LCAnI2Jvb2snKTtcbiAgICBjb25zdCBsb2dzID0gcXM8SFRNTEVsZW1lbnQ+KHZpZXcsICcjbG9ncycpO1xuICAgIGNvbnN0IGJ1eVRwbCA9IHFzPEhUTUxTZWxlY3RFbGVtZW50Pih2aWV3LCAnI3RwbCcpO1xuICAgIGNvbnN0IGJ1eVByaWNlID0gcXM8SFRNTElucHV0RWxlbWVudD4odmlldywgJyNwcmljZScpO1xuICAgIGNvbnN0IGJ1eUFtb3VudCA9IHFzPEhUTUxJbnB1dEVsZW1lbnQ+KHZpZXcsICcjYW1vdW50Jyk7XG4gICAgY29uc3QgcGxhY2VCdXkgPSBxczxIVE1MQnV0dG9uRWxlbWVudD4odmlldywgJyNwbGFjZUJ1eScpO1xuICAgIGNvbnN0IHNlbGxJbnN0ID0gcXM8SFRNTFNlbGVjdEVsZW1lbnQ+KHZpZXcsICcjaW5zdCcpO1xuICAgIGNvbnN0IHNlbGxQcmljZSA9IHFzPEhUTUxJbnB1dEVsZW1lbnQ+KHZpZXcsICcjc3ByaWNlJyk7XG4gICAgY29uc3QgcGxhY2VTZWxsID0gcXM8SFRNTEJ1dHRvbkVsZW1lbnQ+KHZpZXcsICcjcGxhY2VTZWxsJyk7XG4gICAgY29uc3QgaW52Qm94ID0gcXM8SFRNTEVsZW1lbnQ+KHZpZXcsICcjaW52ZW50b3J5Jyk7XG4gICAgY29uc3QgcXVlcnlUcGwgPSBxczxIVE1MU2VsZWN0RWxlbWVudD4odmlldywgJyNxX3RwbCcpO1xuICAgIGNvbnN0IHF1ZXJ5VHlwZSA9IHFzPEhUTUxTZWxlY3RFbGVtZW50Pih2aWV3LCAnI3FfdHlwZScpO1xuICAgIGNvbnN0IHF1ZXJ5TWluZU9ubHkgPSBxczxIVE1MSW5wdXRFbGVtZW50Pih2aWV3LCAnI215Jyk7XG4gICAgY29uc3QgbWluZU9ubHlMYWJlbCA9IHZpZXcucXVlcnlTZWxlY3RvcignbGFiZWwucm93LnBpbGwnKSBhcyBIVE1MTGFiZWxFbGVtZW50IHwgbnVsbDtcbiAgICBjb25zdCByZWZyZXNoQnRuID0gcXM8SFRNTEJ1dHRvbkVsZW1lbnQ+KHZpZXcsICcjcmVmcmVzaCcpO1xuXG4gICAgY29uc3QgbW91bnRJY29ucyA9IChyb290RWw6IEVsZW1lbnQpID0+IHtcbiAgICAgIHJvb3RFbC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1pY29dJylcbiAgICAgICAgLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgICAgY29uc3QgbmFtZSA9IChlbCBhcyBIVE1MRWxlbWVudCkuZ2V0QXR0cmlidXRlKCdkYXRhLWljbycpIGFzIGFueTtcbiAgICAgICAgICB0cnkgeyBlbC5hcHBlbmRDaGlsZChyZW5kZXJJY29uKG5hbWUsIHsgc2l6ZTogMjAgfSkpOyB9IGNhdGNoIHt9XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgbW91bnRJY29ucyh2aWV3KTtcblxuICAgIGxldCBwcmV2SWRzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgbGV0IHJlZnJlc2hpbmcgPSBmYWxzZTtcblxuICAgIGNvbnN0IGxvZyA9IChtZXNzYWdlOiBzdHJpbmcpID0+IHtcbiAgICAgIGxvZ3MudGV4dENvbnRlbnQgPSBtZXNzYWdlO1xuICAgIH07XG5cbiAgICBjb25zdCByZW5kZXJUZW1wbGF0ZU9wdGlvbnMgPSAoKSA9PiB7XG4gICAgICBidXlUcGwuaW5uZXJIVE1MID0gJyc7XG4gICAgICBxdWVyeVRwbC5pbm5lckhUTUwgPSAnJztcbiAgICAgIGNvbnN0IHBsYWNlaG9sZGVyID0gaHRtbCgnPG9wdGlvbiB2YWx1ZT1cIlwiPlx1OTAwOVx1NjJFOVx1NkEyMVx1Njc3Rjwvb3B0aW9uPicpIGFzIEhUTUxPcHRpb25FbGVtZW50O1xuICAgICAgYnV5VHBsLmFwcGVuZENoaWxkKHBsYWNlaG9sZGVyKTtcbiAgICAgIGNvbnN0IHFQbGFjZWhvbGRlciA9IGh0bWwoJzxvcHRpb24gdmFsdWU9XCJcIj5cdTUxNjhcdTkwRThcdTZBMjFcdTY3N0Y8L29wdGlvbj4nKSBhcyBIVE1MT3B0aW9uRWxlbWVudDtcbiAgICAgIHF1ZXJ5VHBsLmFwcGVuZENoaWxkKHFQbGFjZWhvbGRlcik7XG4gICAgICBmb3IgKGNvbnN0IHRwbCBvZiB0aGlzLnRlbXBsYXRlcykge1xuICAgICAgICBjb25zdCBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgICAgb3B0aW9uLnZhbHVlID0gdHBsLmlkO1xuICAgICAgICBvcHRpb24udGV4dENvbnRlbnQgPSB0cGwubmFtZSA/IGAke3RwbC5uYW1lfSAoJHt0cGwuaWR9KWAgOiB0cGwuaWQ7XG4gICAgICAgIGJ1eVRwbC5hcHBlbmRDaGlsZChvcHRpb24pO1xuICAgICAgICBjb25zdCBxT3B0aW9uID0gb3B0aW9uLmNsb25lTm9kZSh0cnVlKSBhcyBIVE1MT3B0aW9uRWxlbWVudDtcbiAgICAgICAgcXVlcnlUcGwuYXBwZW5kQ2hpbGQocU9wdGlvbik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IHJlbmRlckludmVudG9yeSA9ICgpID0+IHtcbiAgICAgIHNlbGxJbnN0LmlubmVySFRNTCA9ICcnO1xuICAgICAgaW52Qm94LmlubmVySFRNTCA9ICcnO1xuICAgICAgY29uc3QgZGVmYXVsdE9wdGlvbiA9IGh0bWwoJzxvcHRpb24gdmFsdWU9XCJcIj5cdTkwMDlcdTYyRTlcdTUzRUZcdTUxRkFcdTU1MkVcdTc2ODRcdTkwNTNcdTUxNzc8L29wdGlvbj4nKSBhcyBIVE1MT3B0aW9uRWxlbWVudDtcbiAgICAgIHNlbGxJbnN0LmFwcGVuZENoaWxkKGRlZmF1bHRPcHRpb24pO1xuICAgICAgY29uc3QgYXZhaWxhYmxlID0gdGhpcy5pbnZlbnRvcnkuZmlsdGVyKChpdGVtKSA9PiAhaXRlbS5pc0VxdWlwcGVkICYmICFpdGVtLmlzTGlzdGVkKTtcbiAgICAgIGlmICghYXZhaWxhYmxlLmxlbmd0aCkge1xuICAgICAgICBpbnZCb3gudGV4dENvbnRlbnQgPSAnXHU2NjgyXHU2NUUwXHU1M0VGXHU1MUZBXHU1NTJFXHU3Njg0XHU5MDUzXHU1MTc3XHVGRjA4XHU5NzAwXHU1MTQ4XHU1NzI4XHU0RUQzXHU1RTkzXHU1Mzc4XHU0RTBCXHU4OEM1XHU1OTA3XHVGRjA5JztcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGF2YWlsYWJsZSkge1xuICAgICAgICBjb25zdCBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgICAgb3B0aW9uLnZhbHVlID0gaXRlbS5pZDtcbiAgICAgICAgb3B0aW9uLnRleHRDb250ZW50ID0gYCR7aXRlbS5pZH0gXHUwMEI3ICR7aXRlbS50ZW1wbGF0ZUlkfSBcdTAwQjcgTHYuJHtpdGVtLmxldmVsfWA7XG4gICAgICAgIHNlbGxJbnN0LmFwcGVuZENoaWxkKG9wdGlvbik7XG5cbiAgICAgICAgY29uc3QgY2hpcCA9IGh0bWwoYDxidXR0b24gY2xhc3M9XCJidG4gYnRuLWdob3N0XCIgc3R5bGU9XCJmbGV4OnVuc2V0O3BhZGRpbmc6NnB4IDEwcHg7XCIgZGF0YS1pZD1cIiR7aXRlbS5pZH1cIj4ke2l0ZW0uaWR9ICgke2l0ZW0udGVtcGxhdGVJZH0pPC9idXR0b24+YCkgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XG4gICAgICAgIGNoaXAub25jbGljayA9ICgpID0+IHtcbiAgICAgICAgICBzZWxsSW5zdC52YWx1ZSA9IGl0ZW0uaWQ7XG4gICAgICAgICAgbG9nKGBcdTVERjJcdTkwMDlcdTYyRTlcdTUxRkFcdTU1MkVcdTkwNTNcdTUxNzcgJHtpdGVtLmlkfWApO1xuICAgICAgICB9O1xuICAgICAgICBpbnZCb3guYXBwZW5kQ2hpbGQoY2hpcCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IGxvYWRNZXRhZGF0YSA9IGFzeW5jICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IFt0cGxzLCBpdGVtc10gPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgICAgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgdGVtcGxhdGVzOiBhbnlbXSB9PignL2l0ZW1zL3RlbXBsYXRlcycpLFxuICAgICAgICAgIE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IGl0ZW1zOiBhbnlbXSB9PignL2l0ZW1zJyksXG4gICAgICAgIF0pO1xuICAgICAgICB0aGlzLnRlbXBsYXRlcyA9IHRwbHMudGVtcGxhdGVzIHx8IFtdO1xuICAgICAgICB0aGlzLmludmVudG9yeSA9IGl0ZW1zLml0ZW1zIHx8IFtdO1xuICAgICAgICByZW5kZXJUZW1wbGF0ZU9wdGlvbnMoKTtcbiAgICAgICAgcmVuZGVySW52ZW50b3J5KCk7XG4gICAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgICAgbG9nKGU/Lm1lc3NhZ2UgfHwgJ1x1NTJBMFx1OEY3RFx1NkEyMVx1Njc3Ri9cdTRFRDNcdTVFOTNcdTU5MzFcdThEMjUnKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgcmVmcmVzaCA9IGFzeW5jIChvcHRzOiB7IHF1aWV0PzogYm9vbGVhbiB9ID0ge30pID0+IHtcbiAgICAgIGlmIChyZWZyZXNoaW5nKSByZXR1cm47XG4gICAgICByZWZyZXNoaW5nID0gdHJ1ZTtcbiAgICAgIGlmICghb3B0cy5xdWlldCkgeyByZWZyZXNoQnRuLmlubmVySFRNTCA9ICc8c3BhbiBkYXRhLWljbz1cInJlZnJlc2hcIj48L3NwYW4+XHU1MjM3XHU2NUIwXHU0RTJEXHUyMDI2JzsgbW91bnRJY29ucyhyZWZyZXNoQnRuKTsgfVxuICAgICAgcmVmcmVzaEJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCB0cGxJZCA9IHF1ZXJ5VHBsLnZhbHVlO1xuICAgICAgICBjb25zdCB0eXBlID0gcXVlcnlUeXBlLnZhbHVlIGFzICdidXknIHwgJ3NlbGwnO1xuICAgICAgICBjb25zdCBtaW5lT25seSA9IHF1ZXJ5TWluZU9ubHkuY2hlY2tlZDtcbiAgICAgICAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcygpO1xuICAgICAgICBwYXJhbXMuc2V0KCd0eXBlJywgdHlwZSk7XG4gICAgICAgIHBhcmFtcy5zZXQoJ2l0ZW1fdGVtcGxhdGVfaWQnLCB0cGxJZCB8fCAnJyk7XG4gICAgICAgIGlmICghb3B0cy5xdWlldCkge1xuICAgICAgICAgIGJvb2suaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIGJvb2suYXBwZW5kQ2hpbGQoaHRtbCgnPGRpdiBjbGFzcz1cInNrZWxldG9uXCI+PC9kaXY+JykpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyBvcmRlcnM6IE9yZGVyW10gfT4oYC9leGNoYW5nZS9vcmRlcnM/JHtwYXJhbXMudG9TdHJpbmcoKX1gKTtcbiAgICAgICAgY29uc3QgbmV3SWRzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgICAgIGJvb2suaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIGNvbnN0IG9yZGVycyA9IGRhdGEub3JkZXJzIHx8IFtdO1xuICAgICAgICBpZiAoIW9yZGVycy5sZW5ndGgpIHtcbiAgICAgICAgICBib29rLmFwcGVuZENoaWxkKGh0bWwoJzxkaXYgc3R5bGU9XCJvcGFjaXR5Oi44O3RleHQtYWxpZ246Y2VudGVyO1wiPlx1NjY4Mlx1NjVFMFx1OEJBMlx1NTM1NTwvZGl2PicpKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IG9yZGVyIG9mIG9yZGVycykge1xuICAgICAgICAgIGlmIChtaW5lT25seSAmJiBtZSAmJiBvcmRlci51c2VySWQgIT09IG1lLmlkKSBjb250aW51ZTtcbiAgICAgICAgICBuZXdJZHMuYWRkKG9yZGVyLmlkKTtcbiAgICAgICAgICBjb25zdCBpc01pbmUgPSBtZSAmJiBvcmRlci51c2VySWQgPT09IG1lLmlkO1xuICAgICAgICAgIGNvbnN0IGtsYXNzID0gYGxpc3QtaXRlbSAke29yZGVyLnR5cGUgPT09ICdidXknID8gJ2xpc3QtaXRlbS0tYnV5JyA6ICdsaXN0LWl0ZW0tLXNlbGwnfWA7XG4gICAgICAgICAgY29uc3Qgcm93ID0gaHRtbChgXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiJHtrbGFzc31cIj5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cImRpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjJweDtcIj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgPHN0cm9uZz4ke29yZGVyLnR5cGUgPT09ICdidXknID8gJ1x1NEU3MFx1NTE2NScgOiAnXHU1MzU2XHU1MUZBJ308L3N0cm9uZz5cbiAgICAgICAgICAgICAgICAgICR7b3JkZXIuaXRlbVRlbXBsYXRlSWQgfHwgJyd9XG4gICAgICAgICAgICAgICAgICAke2lzTWluZSA/ICc8c3BhbiBjbGFzcz1cInBpbGxcIj5cdTYyMTFcdTc2ODQ8L3NwYW4+JyA6ICcnfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJvcGFjaXR5Oi44NTtcIj5cbiAgICAgICAgICAgICAgICAgIFx1NEVGN1x1NjgzQzogJHtvcmRlci5wcmljZX0gXHUwMEI3IFx1NjU3MFx1OTFDRjogJHtvcmRlci5hbW91bnR9XG4gICAgICAgICAgICAgICAgICAke29yZGVyLml0ZW1JbnN0YW5jZUlkID8gYDxzcGFuIGNsYXNzPVwicGlsbFwiPiR7b3JkZXIuaXRlbUluc3RhbmNlSWR9PC9zcGFuPmAgOiAnJ31cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicGlsbFwiPiR7b3JkZXIuaWR9PC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAke2lzTWluZSA/IGA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1naG9zdFwiIGRhdGEtaWQ9XCIke29yZGVyLmlkfVwiPjxzcGFuIGRhdGEtaWNvPVwidHJhc2hcIj48L3NwYW4+XHU2NEE0XHU1MzU1PC9idXR0b24+YCA6ICcnfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIGApO1xuICAgICAgICAgIG1vdW50SWNvbnMocm93KTtcbiAgICAgICAgICBpZiAoIXByZXZJZHMuaGFzKG9yZGVyLmlkKSkgcm93LmNsYXNzTGlzdC5hZGQoJ2ZsYXNoJyk7XG4gICAgICAgICAgcm93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKGV2KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBldi50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgICAgICBjb25zdCBpZCA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnKTtcbiAgICAgICAgICAgIGlmICghaWQpIHJldHVybjtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHRhcmdldC5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJ3RydWUnKTtcbiAgICAgICAgICAgICAgYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0KGAvZXhjaGFuZ2Uvb3JkZXJzLyR7aWR9YCwgeyBtZXRob2Q6ICdERUxFVEUnIH0pO1xuICAgICAgICAgICAgICBzaG93VG9hc3QoJ1x1NjRBNFx1NTM1NVx1NjIxMFx1NTI5RicsICdzdWNjZXNzJyk7XG4gICAgICAgICAgICAgIGF3YWl0IHJlZnJlc2goKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgICAgICAgICBzaG93VG9hc3QoZT8ubWVzc2FnZSB8fCAnXHU2NEE0XHU1MzU1XHU1OTMxXHU4RDI1JywgJ2Vycm9yJyk7XG4gICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICB0YXJnZXQucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGJvb2suYXBwZW5kQ2hpbGQocm93KTtcbiAgICAgICAgfVxuICAgICAgICBwcmV2SWRzID0gbmV3SWRzO1xuICAgICAgICBpZiAoIWJvb2suY2hpbGRFbGVtZW50Q291bnQpIHtcbiAgICAgICAgICBib29rLmFwcGVuZENoaWxkKGh0bWwoJzxkaXYgc3R5bGU9XCJvcGFjaXR5Oi44O3RleHQtYWxpZ246Y2VudGVyO1wiPlx1NjY4Mlx1NjVFMFx1N0IyNlx1NTQwOFx1Njc2MVx1NEVGNlx1NzY4NFx1OEJBMlx1NTM1NTwvZGl2PicpKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgIGxvZyhlPy5tZXNzYWdlIHx8ICdcdTUyMzdcdTY1QjBcdThCQTJcdTUzNTVcdTU5MzFcdThEMjUnKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHJlZnJlc2hpbmcgPSBmYWxzZTtcbiAgICAgICAgcmVmcmVzaEJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICByZWZyZXNoQnRuLmlubmVySFRNTCA9ICc8c3BhbiBkYXRhLWljbz1cInJlZnJlc2hcIj48L3NwYW4+XHU1MjM3XHU2NUIwJztcbiAgICAgICAgbW91bnRJY29ucyhyZWZyZXNoQnRuKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcGxhY2VCdXkub25jbGljayA9IGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHRwbElkID0gYnV5VHBsLnZhbHVlLnRyaW0oKTtcbiAgICAgIGNvbnN0IHByaWNlID0gTnVtYmVyKGJ1eVByaWNlLnZhbHVlKTtcbiAgICAgIGNvbnN0IGFtb3VudCA9IE51bWJlcihidXlBbW91bnQudmFsdWUpO1xuICAgICAgaWYgKCF0cGxJZCkge1xuICAgICAgICBzaG93VG9hc3QoJ1x1OEJGN1x1OTAwOVx1NjJFOVx1OEQyRFx1NEU3MFx1NzY4NFx1NkEyMVx1Njc3RicsICd3YXJuJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChwcmljZSA8PSAwIHx8IGFtb3VudCA8PSAwKSB7XG4gICAgICAgIHNob3dUb2FzdCgnXHU4QkY3XHU4RjkzXHU1MTY1XHU2NzA5XHU2NTQ4XHU3Njg0XHU0RUY3XHU2ODNDXHU0RTBFXHU2NTcwXHU5MUNGJywgJ3dhcm4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcGxhY2VCdXkuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgcGxhY2VCdXkudGV4dENvbnRlbnQgPSAnXHU2M0QwXHU0RUE0XHU0RTJEXHUyMDI2JztcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IGlkOiBzdHJpbmcgfT4oJy9leGNoYW5nZS9vcmRlcnMnLCB7XG4gICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyB0eXBlOiAnYnV5JywgaXRlbV90ZW1wbGF0ZV9pZDogdHBsSWQsIHByaWNlLCBhbW91bnQgfSksXG4gICAgICAgIH0pO1xuICAgICAgICBzaG93VG9hc3QoYFx1NEU3MFx1NTM1NVx1NURGMlx1NjNEMFx1NEVBNCAoIyR7cmVzLmlkfSlgLCAnc3VjY2VzcycpO1xuICAgICAgICBsb2coYFx1NEU3MFx1NTM1NVx1NjIxMFx1NTI5RjogJHtyZXMuaWR9YCk7XG4gICAgICAgIGF3YWl0IGJhci51cGRhdGUoKTtcbiAgICAgICAgYXdhaXQgcmVmcmVzaCgpO1xuICAgICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgIHNob3dUb2FzdChlPy5tZXNzYWdlIHx8ICdcdTRFNzBcdTUzNTVcdTYzRDBcdTRFQTRcdTU5MzFcdThEMjUnLCAnZXJyb3InKTtcbiAgICAgICAgbG9nKGU/Lm1lc3NhZ2UgfHwgJ1x1NEU3MFx1NTM1NVx1NjNEMFx1NEVBNFx1NTkzMVx1OEQyNScpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgcGxhY2VCdXkuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgcGxhY2VCdXkudGV4dENvbnRlbnQgPSAnXHU0RTBCXHU0RTcwXHU1MzU1JztcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcGxhY2VTZWxsLm9uY2xpY2sgPSBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBpbnN0SWQgPSBzZWxsSW5zdC52YWx1ZS50cmltKCk7XG4gICAgICBjb25zdCBwcmljZSA9IE51bWJlcihzZWxsUHJpY2UudmFsdWUpO1xuICAgICAgaWYgKCFpbnN0SWQpIHtcbiAgICAgICAgc2hvd1RvYXN0KCdcdThCRjdcdTkwMDlcdTYyRTlcdTg5ODFcdTUxRkFcdTU1MkVcdTc2ODRcdTkwNTNcdTUxNzcnLCAnd2FybicpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAocHJpY2UgPD0gMCkge1xuICAgICAgICBzaG93VG9hc3QoJ1x1OEJGN1x1OEY5M1x1NTE2NVx1NjcwOVx1NjU0OFx1NzY4NFx1NEVGN1x1NjgzQycsICd3YXJuJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHBsYWNlU2VsbC5kaXNhYmxlZCA9IHRydWU7XG4gICAgICBwbGFjZVNlbGwudGV4dENvbnRlbnQgPSAnXHU2M0QwXHU0RUE0XHU0RTJEXHUyMDI2JztcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IGlkOiBzdHJpbmcgfT4oJy9leGNoYW5nZS9vcmRlcnMnLCB7XG4gICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyB0eXBlOiAnc2VsbCcsIGl0ZW1faW5zdGFuY2VfaWQ6IGluc3RJZCwgcHJpY2UgfSksXG4gICAgICAgIH0pO1xuICAgICAgICBzaG93VG9hc3QoYFx1NTM1Nlx1NTM1NVx1NURGMlx1NjNEMFx1NEVBNCAoIyR7cmVzLmlkfSlgLCAnc3VjY2VzcycpO1xuICAgICAgICBsb2coYFx1NTM1Nlx1NTM1NVx1NjIxMFx1NTI5RjogJHtyZXMuaWR9YCk7XG4gICAgICAgIGF3YWl0IGJhci51cGRhdGUoKTtcbiAgICAgICAgYXdhaXQgbG9hZE1ldGFkYXRhKCk7XG4gICAgICAgIGF3YWl0IHJlZnJlc2goKTtcbiAgICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgICBzaG93VG9hc3QoZT8ubWVzc2FnZSB8fCAnXHU1MzU2XHU1MzU1XHU2M0QwXHU0RUE0XHU1OTMxXHU4RDI1JywgJ2Vycm9yJyk7XG4gICAgICAgIGxvZyhlPy5tZXNzYWdlIHx8ICdcdTUzNTZcdTUzNTVcdTYzRDBcdTRFQTRcdTU5MzFcdThEMjUnKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHBsYWNlU2VsbC5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICBwbGFjZVNlbGwudGV4dENvbnRlbnQgPSAnXHU0RTBCXHU1MzU2XHU1MzU1JztcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmVmcmVzaEJ0bi5vbmNsaWNrID0gKCkgPT4gcmVmcmVzaCgpO1xuICAgIHF1ZXJ5VHBsLm9uY2hhbmdlID0gKCkgPT4gcmVmcmVzaCgpO1xuICAgIHF1ZXJ5VHlwZS5vbmNoYW5nZSA9ICgpID0+IHJlZnJlc2goKTtcbiAgICBxdWVyeU1pbmVPbmx5Lm9uY2hhbmdlID0gKCkgPT4geyBpZiAobWluZU9ubHlMYWJlbCkgbWluZU9ubHlMYWJlbC5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnLCBxdWVyeU1pbmVPbmx5LmNoZWNrZWQpOyByZWZyZXNoKCk7IH07XG4gICAgaWYgKG1pbmVPbmx5TGFiZWwpIG1pbmVPbmx5TGFiZWwuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJywgcXVlcnlNaW5lT25seS5jaGVja2VkKTtcblxuICAgIGF3YWl0IFByb21pc2UuYWxsKFtiYXIudXBkYXRlKCksIGxvYWRNZXRhZGF0YSgpXSk7XG4gICAgYXdhaXQgcmVmcmVzaCh7IHF1aWV0OiB0cnVlIH0pO1xuICAgIHRoaXMucmVmcmVzaFRpbWVyID0gd2luZG93LnNldEludGVydmFsKCgpID0+IHtcbiAgICAgIHJlZnJlc2goeyBxdWlldDogdHJ1ZSB9KS5jYXRjaCgoKSA9PiB7fSk7XG4gICAgfSwgMTAwMDApO1xuICB9XG5cbiAgcHJpdmF0ZSBjbGVhclRpbWVyKCkge1xuICAgIGlmICh0aGlzLnJlZnJlc2hUaW1lciAhPT0gbnVsbCkge1xuICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5yZWZyZXNoVGltZXIpO1xuICAgICAgdGhpcy5yZWZyZXNoVGltZXIgPSBudWxsO1xuICAgIH1cbiAgfVxufVxuIiwgImltcG9ydCB7IE5ldHdvcmtNYW5hZ2VyIH0gZnJvbSAnLi4vY29yZS9OZXR3b3JrTWFuYWdlcic7XG5pbXBvcnQgeyBodG1sLCBxcyB9IGZyb20gJy4uL3V0aWxzL2RvbSc7XG5pbXBvcnQgeyByZW5kZXJOYXYgfSBmcm9tICcuLi9jb21wb25lbnRzL05hdic7XG5pbXBvcnQgeyBSZWFsdGltZUNsaWVudCB9IGZyb20gJy4uL2NvcmUvUmVhbHRpbWVDbGllbnQnO1xuaW1wb3J0IHsgcmVuZGVyUmVzb3VyY2VCYXIgfSBmcm9tICcuLi9jb21wb25lbnRzL1Jlc291cmNlQmFyJztcbmltcG9ydCB7IHJlbmRlckljb24gfSBmcm9tICcuLi9jb21wb25lbnRzL0ljb24nO1xuXG5leHBvcnQgY2xhc3MgUmFua2luZ1NjZW5lIHtcbiAgbW91bnQocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICByb290LmlubmVySFRNTCA9ICcnO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQocmVuZGVyTmF2KCdyYW5raW5nJykpO1xuICAgIGNvbnN0IGJhciA9IHJlbmRlclJlc291cmNlQmFyKCk7XG4gICAgcm9vdC5hcHBlbmRDaGlsZChiYXIucm9vdCk7XG5cbiAgICBjb25zdCB2aWV3ID0gaHRtbChgXG4gICAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyIGdyaWQtMlwiIHN0eWxlPVwiY29sb3I6I2ZmZjtcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQgZmFkZS1pblwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIiBzdHlsZT1cImp1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2FsaWduLWl0ZW1zOmNlbnRlcjtcIj5cbiAgICAgICAgICAgIDxoMyBzdHlsZT1cIm1hcmdpbjowO2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjhweDtcIj48c3BhbiBkYXRhLWljbz1cInRyb3BoeVwiPjwvc3Bhbj5cdTYzOTJcdTg4NENcdTY5OUM8L2gzPlxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInJlZnJlc2hcIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiPjxzcGFuIGRhdGEtaWNvPVwicmVmcmVzaFwiPjwvc3Bhbj5cdTUyMzdcdTY1QjA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGlkPVwibWVcIiBzdHlsZT1cIm1hcmdpbi10b3A6OHB4O29wYWNpdHk6Ljk1O1wiPjwvZGl2PlxuICAgICAgICAgIDxkaXYgaWQ9XCJsaXN0XCIgc3R5bGU9XCJtYXJnaW4tdG9wOjEycHg7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6NnB4O1wiPjwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIGApO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQodmlldyk7XG5cbiAgICBjb25zdCB0b2tlbiA9IChOZXR3b3JrTWFuYWdlciBhcyBhbnkpLklbJ3Rva2VuJ107XG4gICAgaWYgKHRva2VuKSBSZWFsdGltZUNsaWVudC5JLmNvbm5lY3QodG9rZW4pO1xuXG4gICAgY29uc3QgbWVCb3ggPSBxcyh2aWV3LCAnI21lJyk7XG4gICAgY29uc3QgbGlzdCA9IHFzKHZpZXcsICcjbGlzdCcpO1xuICAgIGNvbnN0IHJlZnJlc2hCdG4gPSBxczxIVE1MQnV0dG9uRWxlbWVudD4odmlldywgJyNyZWZyZXNoJyk7XG4gICAgY29uc3QgbW91bnRJY29ucyA9IChyb290RWw6IEVsZW1lbnQpID0+IHtcbiAgICAgIHJvb3RFbC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1pY29dJylcbiAgICAgICAgLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgICAgY29uc3QgbmFtZSA9IChlbCBhcyBIVE1MRWxlbWVudCkuZ2V0QXR0cmlidXRlKCdkYXRhLWljbycpIGFzIGFueTtcbiAgICAgICAgICB0cnkgeyBlbC5hcHBlbmRDaGlsZChyZW5kZXJJY29uKG5hbWUsIHsgc2l6ZTogMjAgfSkpOyB9IGNhdGNoIHt9XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgbW91bnRJY29ucyh2aWV3KTtcblxuICAgIGNvbnN0IGxvYWQgPSBhc3luYyAoKSA9PiB7XG4gICAgICByZWZyZXNoQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIHJlZnJlc2hCdG4uaW5uZXJIVE1MID0gJzxzcGFuIGRhdGEtaWNvPVwicmVmcmVzaFwiPjwvc3Bhbj5cdTUyMzdcdTY1QjBcdTRFMkRcdTIwMjYnO1xuICAgICAgbW91bnRJY29ucyhyZWZyZXNoQnRuKTtcbiAgICAgIGF3YWl0IGJhci51cGRhdGUoKTtcbiAgICAgIGxpc3QuaW5uZXJIVE1MID0gJyc7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykgbGlzdC5hcHBlbmRDaGlsZChodG1sKCc8ZGl2IGNsYXNzPVwic2tlbGV0b25cIj48L2Rpdj4nKSk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBtZSA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IHJhbms6IG51bWJlcjsgc2NvcmU6IG51bWJlciB9PignL3JhbmtpbmcvbWUnKTtcbiAgICAgICAgY29uc3QgdG9wID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgbGlzdDogYW55W10gfT4oJy9yYW5raW5nL3RvcD9uPTIwJyk7XG4gICAgICAgIG1lQm94LnRleHRDb250ZW50ID0gYFx1NjIxMVx1NzY4NFx1NTQwRFx1NkIyMVx1RkYxQSMke21lLnJhbmt9IFx1MDBCNyBcdTYwM0JcdTVGOTdcdTUyMDZcdUZGMUEke21lLnNjb3JlfWA7XG4gICAgICAgIGxpc3QuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIGZvciAoY29uc3QgZW50cnkgb2YgdG9wLmxpc3QpIHtcbiAgICAgICAgICBjb25zdCBtZWRhbCA9IGVudHJ5LnJhbmsgPT09IDEgPyAnXHVEODNFXHVERDQ3JyA6IGVudHJ5LnJhbmsgPT09IDIgPyAnXHVEODNFXHVERDQ4JyA6IGVudHJ5LnJhbmsgPT09IDMgPyAnXHVEODNFXHVERDQ5JyA6ICcnO1xuICAgICAgICAgIGNvbnN0IGNscyA9IGVudHJ5LnJhbmsgPD0gMyA/ICcgbGlzdC1pdGVtLS1idXknIDogJyc7XG4gICAgICAgICAgY29uc3Qgcm93ID0gaHRtbChgXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibGlzdC1pdGVtJHtjbHN9XCI+XG4gICAgICAgICAgICAgIDxzcGFuPiR7bWVkYWx9ICMke2VudHJ5LnJhbmt9PC9zcGFuPlxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT1cImZsZXg6MTtvcGFjaXR5Oi45O21hcmdpbi1sZWZ0OjEycHg7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NnB4O1wiPjxzcGFuIGRhdGEtaWNvPVwidXNlclwiPjwvc3Bhbj4ke2VudHJ5LnVzZXJJZH08L3NwYW4+XG4gICAgICAgICAgICAgIDxzdHJvbmc+JHtlbnRyeS5zY29yZX08L3N0cm9uZz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIGApO1xuICAgICAgICAgIG1vdW50SWNvbnMocm93KTtcbiAgICAgICAgICBsaXN0LmFwcGVuZENoaWxkKHJvdyk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgICBtZUJveC50ZXh0Q29udGVudCA9IGU/Lm1lc3NhZ2UgfHwgJ1x1NjM5Mlx1ODg0Q1x1Njk5Q1x1NTJBMFx1OEY3RFx1NTkzMVx1OEQyNSc7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICByZWZyZXNoQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIHJlZnJlc2hCdG4uaW5uZXJIVE1MID0gJzxzcGFuIGRhdGEtaWNvPVwicmVmcmVzaFwiPjwvc3Bhbj5cdTUyMzdcdTY1QjAnO1xuICAgICAgICBtb3VudEljb25zKHJlZnJlc2hCdG4pO1xuICAgICAgfVxuICAgIH07XG4gICAgcmVmcmVzaEJ0bi5vbmNsaWNrID0gKCkgPT4gbG9hZCgpO1xuICAgIGxvYWQoKTtcbiAgfVxufVxuIiwgImxldCBpbmplY3RlZCA9IGZhbHNlO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGVuc3VyZUdsb2JhbFN0eWxlcygpIHtcclxuICBpZiAoaW5qZWN0ZWQpIHJldHVybjtcclxuICBjb25zdCBjc3MgPSBgOnJvb3R7LS1iZzojMGIxMDIwOy0tYmctMjojMGYxNTMwOy0tZmc6I2ZmZjstLW11dGVkOnJnYmEoMjU1LDI1NSwyNTUsLjc1KTstLWdyYWQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZywjN0IyQ0Y1LCMyQzg5RjUpOy0tcGFuZWwtZ3JhZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLHJnYmEoMTIzLDQ0LDI0NSwuMjUpLHJnYmEoNDQsMTM3LDI0NSwuMjUpKTstLWdsYXNzOmJsdXIoMTBweCk7LS1nbG93OjAgOHB4IDIwcHggcmdiYSgwLDAsMCwuMzUpLDAgMCAxMnB4IHJnYmEoMTIzLDQ0LDI0NSwuNyk7LS1yYWRpdXMtc206MTBweDstLXJhZGl1cy1tZDoxMnB4Oy0tcmFkaXVzLWxnOjE2cHg7LS1lYXNlOmN1YmljLWJlemllciguMjIsLjYxLC4zNiwxKTstLWR1cjouMjhzOy0tYnV5OiMyQzg5RjU7LS1zZWxsOiNFMzY0MTQ7LS1vazojMmVjMjdlOy0td2FybjojZjZjNDQ1Oy0tZGFuZ2VyOiNmZjVjNWM7LS1yYXJpdHktY29tbW9uOiM5YWEwYTY7LS1yYXJpdHktcmFyZTojNGZkNGY1Oy0tcmFyaXR5LWVwaWM6I2IyNmJmZjstLXJhcml0eS1sZWdlbmRhcnk6I2Y2YzQ0NTstLWNvbnRhaW5lci1tYXg6NzIwcHh9XHJcbmh0bWwsYm9keXtiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudCgxMjAwcHggNjAwcHggYXQgNTAlIC0xMCUsIHJnYmEoMTIzLDQ0LDI0NSwuMTIpLCB0cmFuc3BhcmVudCksdmFyKC0tYmcpO2NvbG9yOnZhcigtLWZnKTtmb250LWZhbWlseTpzeXN0ZW0tdWksLWFwcGxlLXN5c3RlbSxcIlNlZ29lIFVJXCIsXCJQaW5nRmFuZyBTQ1wiLFwiTWljcm9zb2Z0IFlhSGVpXCIsQXJpYWwsc2Fucy1zZXJpZn1cclxuaHRtbHtjb2xvci1zY2hlbWU6ZGFya31cclxuLmNvbnRhaW5lcntwYWRkaW5nOjAgMTJweH1cclxuLmNvbnRhaW5lcnttYXgtd2lkdGg6dmFyKC0tY29udGFpbmVyLW1heCk7bWFyZ2luOjEycHggYXV0b31cclxuLmNhcmR7cG9zaXRpb246cmVsYXRpdmU7Ym9yZGVyLXJhZGl1czp2YXIoLS1yYWRpdXMtbGcpO2JhY2tncm91bmQ6dmFyKC0tcGFuZWwtZ3JhZCk7YmFja2Ryb3AtZmlsdGVyOnZhcigtLWdsYXNzKTtib3gtc2hhZG93OnZhcigtLWdsb3cpO3BhZGRpbmc6MTJweDtvdmVyZmxvdzpoaWRkZW59XHJcbi8qIG5lb24gY29ybmVycyArIHNoZWVuICovXHJcbi5jYXJkOjpiZWZvcmV7Y29udGVudDpcIlwiO3Bvc2l0aW9uOmFic29sdXRlO2luc2V0OjA7Ym9yZGVyLXJhZGl1czppbmhlcml0O2JhY2tncm91bmQ6cmFkaWFsLWdyYWRpZW50KDQwJSAyNSUgYXQgMTAwJSAwLCByZ2JhKDEyMyw0NCwyNDUsLjE4KSwgdHJhbnNwYXJlbnQgNjAlKSxyYWRpYWwtZ3JhZGllbnQoMzUlIDI1JSBhdCAwIDEwMCUsIHJnYmEoNDQsMTM3LDI0NSwuMTYpLCB0cmFuc3BhcmVudCA2MCUpO3BvaW50ZXItZXZlbnRzOm5vbmV9XHJcbi5jYXJkOjphZnRlcntjb250ZW50OlwiXCI7cG9zaXRpb246YWJzb2x1dGU7bGVmdDotMzAlO3RvcDotMTIwJTt3aWR0aDo2MCU7aGVpZ2h0OjMwMCU7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTIwZGVnLHRyYW5zcGFyZW50LHJnYmEoMjU1LDI1NSwyNTUsLjE4KSx0cmFuc3BhcmVudCk7dHJhbnNmb3JtOnJvdGF0ZSg4ZGVnKTtvcGFjaXR5Oi4yNTthbmltYXRpb246Y2FyZC1zaGVlbiA5cyBsaW5lYXIgaW5maW5pdGU7cG9pbnRlci1ldmVudHM6bm9uZX1cclxuQGtleWZyYW1lcyBjYXJkLXNoZWVuezAle3RyYW5zZm9ybTp0cmFuc2xhdGVYKDApIHJvdGF0ZSg4ZGVnKX0xMDAle3RyYW5zZm9ybTp0cmFuc2xhdGVYKDE2MCUpIHJvdGF0ZSg4ZGVnKX19XHJcbi5yb3d7ZGlzcGxheTpmbGV4O2dhcDo4cHg7YWxpZ24taXRlbXM6Y2VudGVyfVxyXG4uY2FyZCBpbnB1dCwuY2FyZCBidXR0b257Ym94LXNpemluZzpib3JkZXItYm94O291dGxpbmU6bm9uZX1cclxuLmNhcmQgaW5wdXR7YmFja2dyb3VuZDpyZ2JhKDI1NSwyNTUsMjU1LC4wOCk7Ym9yZGVyOjA7Ym9yZGVyLXJhZGl1czp2YXIoLS1yYWRpdXMtbWQpO2NvbG9yOnZhcigtLWZnKTtwYWRkaW5nOjEwcHg7bWFyZ2luOjhweCAwO2FwcGVhcmFuY2U6bm9uZTstd2Via2l0LWFwcGVhcmFuY2U6bm9uZTtiYWNrZ3JvdW5kLWNsaXA6cGFkZGluZy1ib3g7cG9pbnRlci1ldmVudHM6YXV0bzt0b3VjaC1hY3Rpb246bWFuaXB1bGF0aW9ufVxyXG4uY2FyZCBzZWxlY3QuaW5wdXQsIHNlbGVjdC5pbnB1dHtiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjA4KTtjb2xvcjp2YXIoLS1mZyk7Ym9yZGVyOjA7Ym9yZGVyLXJhZGl1czp2YXIoLS1yYWRpdXMtbWQpO3BhZGRpbmc6MTBweDttYXJnaW46OHB4IDA7YXBwZWFyYW5jZTpub25lOy13ZWJraXQtYXBwZWFyYW5jZTpub25lO2JhY2tncm91bmQtY2xpcDpwYWRkaW5nLWJveH1cclxuLmNhcmQgc2VsZWN0LmlucHV0IG9wdGlvbiwgc2VsZWN0LmlucHV0IG9wdGlvbntiYWNrZ3JvdW5kOiMwYjEwMjA7Y29sb3I6I2ZmZn1cclxuLmNhcmQgc2VsZWN0LmlucHV0OmZvY3VzLCBzZWxlY3QuaW5wdXQ6Zm9jdXN7b3V0bGluZToycHggc29saWQgcmdiYSgxMjMsNDQsMjQ1LC40NSl9XHJcbi5jYXJkIGJ1dHRvbnt3aWR0aDoxMDAlO2JvcmRlci1yYWRpdXM6dmFyKC0tcmFkaXVzLW1kKX1cclxuLmJ0bntwb3NpdGlvbjpyZWxhdGl2ZTtvdmVyZmxvdzpoaWRkZW47cGFkZGluZzoxMHB4IDE0cHg7Ym9yZGVyOjA7Ym9yZGVyLXJhZGl1czp2YXIoLS1yYWRpdXMtbWQpO2NvbG9yOiNmZmY7dHJhbnNpdGlvbjp0cmFuc2Zvcm0gdmFyKC0tZHVyKSB2YXIoLS1lYXNlKSxib3gtc2hhZG93IHZhcigtLWR1cikgdmFyKC0tZWFzZSksZmlsdGVyIHZhcigtLWR1cikgdmFyKC0tZWFzZSl9XHJcbi5idG4gLmljb257bWFyZ2luLXJpZ2h0OjZweH1cclxuLmJ0bjphY3RpdmV7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoMXB4KSBzY2FsZSguOTkpfVxyXG4uYnRuOjphZnRlcntjb250ZW50OlwiXCI7cG9zaXRpb246YWJzb2x1dGU7aW5zZXQ6MDtvcGFjaXR5OjA7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTE1ZGVnLHRyYW5zcGFyZW50LHJnYmEoMjU1LDI1NSwyNTUsLjI1KSx0cmFuc3BhcmVudCA1NSUpO3RyYW5zZm9ybTp0cmFuc2xhdGVYKC02MCUpO3RyYW5zaXRpb246b3BhY2l0eSB2YXIoLS1kdXIpIHZhcigtLWVhc2UpLCB0cmFuc2Zvcm0gdmFyKC0tZHVyKSB2YXIoLS1lYXNlKTtwb2ludGVyLWV2ZW50czpub25lfVxyXG4uYnRuOmhvdmVyOjphZnRlcntvcGFjaXR5Oi45O3RyYW5zZm9ybTp0cmFuc2xhdGVYKDApfVxyXG4uYnRuOmhvdmVye2ZpbHRlcjpzYXR1cmF0ZSgxMTAlKX1cclxuLmJ0bi1wcmltYXJ5e2JhY2tncm91bmQ6dmFyKC0tZ3JhZCk7Ym94LXNoYWRvdzp2YXIoLS1nbG93KX1cclxuLmJ0bi1lbmVyZ3l7cG9zaXRpb246cmVsYXRpdmU7YW5pbWF0aW9uOmJ0bi1wdWxzZSAycyBlYXNlLWluLW91dCBpbmZpbml0ZX1cclxuLmJ0bi1lbmVyZ3k6OmJlZm9yZXtjb250ZW50OlwiXCI7cG9zaXRpb246YWJzb2x1dGU7aW5zZXQ6LTJweDtib3JkZXItcmFkaXVzOmluaGVyaXQ7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLHJnYmEoMTIzLDQ0LDI0NSwuNikscmdiYSg0NCwxMzcsMjQ1LC42KSk7ZmlsdGVyOmJsdXIoOHB4KTt6LWluZGV4Oi0xO29wYWNpdHk6LjY7YW5pbWF0aW9uOmVuZXJneS1yaW5nIDJzIGVhc2UtaW4tb3V0IGluZmluaXRlO3BvaW50ZXItZXZlbnRzOm5vbmV9XHJcbkBrZXlmcmFtZXMgYnRuLXB1bHNlezAlLDEwMCV7dHJhbnNmb3JtOnNjYWxlKDEpfTUwJXt0cmFuc2Zvcm06c2NhbGUoMS4wMil9fVxyXG5Aa2V5ZnJhbWVzIGVuZXJneS1yaW5nezAlLDEwMCV7b3BhY2l0eTouNDtmaWx0ZXI6Ymx1cig4cHgpfTUwJXtvcGFjaXR5Oi44O2ZpbHRlcjpibHVyKDEycHgpfX1cclxuLmJ0bi1idXl7YmFja2dyb3VuZDp2YXIoLS1idXkpfVxyXG4uYnRuLXNlbGx7YmFja2dyb3VuZDp2YXIoLS1zZWxsKX1cclxuLmJ0bi1naG9zdHtiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjA4KX1cclxuLmlucHV0e3dpZHRoOjEwMCU7cGFkZGluZzoxMHB4O2JvcmRlcjowO2JvcmRlci1yYWRpdXM6dmFyKC0tcmFkaXVzLW1kKTtiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjA4KTtjb2xvcjp2YXIoLS1mZyk7cG9pbnRlci1ldmVudHM6YXV0bzt0b3VjaC1hY3Rpb246bWFuaXB1bGF0aW9uO3VzZXItc2VsZWN0OnRleHQ7LXdlYmtpdC11c2VyLXNlbGVjdDp0ZXh0fVxyXG4ucGlsbHtwYWRkaW5nOjJweCA4cHg7Ym9yZGVyLXJhZGl1czo5OTlweDtiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjA4KTtmb250LXNpemU6MTJweDtjdXJzb3I6cG9pbnRlcjt0cmFuc2l0aW9uOmJhY2tncm91bmQgLjNzIGVhc2V9XHJcbi5waWxsLnBpbGwtcnVubmluZ3thbmltYXRpb246cGlsbC1icmVhdGhlIDJzIGVhc2UtaW4tb3V0IGluZmluaXRlfVxyXG5Aa2V5ZnJhbWVzIHBpbGwtYnJlYXRoZXswJSwxMDAle2JhY2tncm91bmQ6cmdiYSg0NiwxOTQsMTI2LC4yNSk7Ym94LXNoYWRvdzowIDAgOHB4IHJnYmEoNDYsMTk0LDEyNiwuMyl9NTAle2JhY2tncm91bmQ6cmdiYSg0NiwxOTQsMTI2LC4zNSk7Ym94LXNoYWRvdzowIDAgMTJweCByZ2JhKDQ2LDE5NCwxMjYsLjUpfX1cclxuLnBpbGwucGlsbC1jb2xsYXBzZWR7YW5pbWF0aW9uOnBpbGwtYWxlcnQgMXMgZWFzZS1pbi1vdXQgaW5maW5pdGV9XHJcbkBrZXlmcmFtZXMgcGlsbC1hbGVydHswJSwxMDAle2JhY2tncm91bmQ6cmdiYSgyNTUsOTIsOTIsLjI1KTtib3gtc2hhZG93OjAgMCA4cHggcmdiYSgyNTUsOTIsOTIsLjMpfTUwJXtiYWNrZ3JvdW5kOnJnYmEoMjU1LDkyLDkyLC40NSk7Ym94LXNoYWRvdzowIDAgMTZweCByZ2JhKDI1NSw5Miw5MiwuNil9fVxyXG4ucGlsbC5hY3RpdmV7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCByZ2JhKDEyMyw0NCwyNDUsLjM1KSwgcmdiYSg0NCwxMzcsMjQ1LC4yOCkpO2JveC1zaGFkb3c6dmFyKC0tZ2xvdyl9XHJcbi5zY2VuZS1oZWFkZXJ7ZGlzcGxheTpmbGV4O2p1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2FsaWduLWl0ZW1zOmZsZXgtZW5kO2dhcDoxMnB4O21hcmdpbi1ib3R0b206OHB4fVxyXG4uc2NlbmUtaGVhZGVyIGgxe21hcmdpbjowO2ZvbnQtc2l6ZToyMHB4fVxyXG4uc2NlbmUtaGVhZGVyIHB7bWFyZ2luOjA7b3BhY2l0eTouODV9XHJcbi5zdGF0c3tkaXNwbGF5OmZsZXg7Z2FwOjEwcHh9XHJcbi5zdGF0e2ZsZXg6MTttaW4td2lkdGg6MDtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxODBkZWcscmdiYSgyNTUsMjU1LDI1NSwuMDYpLHJnYmEoMjU1LDI1NSwyNTUsLjAzKSk7Ym9yZGVyLXJhZGl1czoxMnB4O3BhZGRpbmc6MTBweDtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDoxMHB4fVxyXG4uc3RhdCAuaWNve2ZvbnQtc2l6ZToxOHB4O2ZpbHRlcjpkcm9wLXNoYWRvdygwIDAgOHB4IHJnYmEoMTIzLDQ0LDI0NSwuMzUpKTt0cmFuc2l0aW9uOnRyYW5zZm9ybSAuM3MgZWFzZX1cclxuLnB1bHNlLWljb257YW5pbWF0aW9uOmljb24tcHVsc2UgLjZzIGVhc2V9XHJcbkBrZXlmcmFtZXMgaWNvbi1wdWxzZXswJSwxMDAle3RyYW5zZm9ybTpzY2FsZSgxKX01MCV7dHJhbnNmb3JtOnNjYWxlKDEuMykgcm90YXRlKDVkZWcpfX1cclxuLnN0YXQgLnZhbHtmb250LXdlaWdodDo3MDA7Zm9udC1zaXplOjE2cHh9XHJcbi5zdGF0IC5sYWJlbHtvcGFjaXR5Oi44NTtmb250LXNpemU6MTJweH1cclxuLmV2ZW50LWZlZWR7bWF4LWhlaWdodDoyNDBweDtvdmVyZmxvdzphdXRvO2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjZweH1cclxuLmV2ZW50LWZlZWQgLmV2ZW50e29wYWNpdHk6Ljk7Zm9udC1mYW1pbHk6bW9ub3NwYWNlO2ZvbnQtc2l6ZToxMnB4fVxyXG4ubWFpbi1zY3JlZW57cG9zaXRpb246cmVsYXRpdmU7cGFkZGluZzoxMnB4IDAgMzZweDttaW4taGVpZ2h0OjEwMHZofVxyXG4ubWFpbi1zdGFja3tkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDoxNnB4fVxyXG4ubWluZS1jYXJke21pbi1oZWlnaHQ6Y2FsYygxMDB2aCAtIDE2MHB4KTtwYWRkaW5nOjI0cHggMjBweDtkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDoyMHB4O2JvcmRlci1yYWRpdXM6MjBweH1cclxuQG1lZGlhIChtaW4td2lkdGg6NTgwcHgpey5taW5lLWNhcmR7bWluLWhlaWdodDo2MjBweDtwYWRkaW5nOjI4cHggMjZweH19XHJcbi5taW5lLWhlYWRlcntkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2dhcDoxMnB4fVxyXG4ubWluZS10aXRsZXtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDoxMHB4O2ZvbnQtc2l6ZToxOHB4O2ZvbnQtd2VpZ2h0OjYwMDtsZXR0ZXItc3BhY2luZzouMDRlbTt0ZXh0LXNoYWRvdzowIDJweCAxMnB4IHJnYmEoMTgsMTAsNDgsLjYpfVxyXG4ubWluZS10aXRsZSAuaWNvbntmaWx0ZXI6ZHJvcC1zaGFkb3coMCAwIDEycHggcmdiYSgxMjQsNjAsMjU1LC41NSkpfVxyXG4ubWluZS1jaGlwc3tkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo4cHh9XHJcbi5taW5lLWNoaXBzIC5waWxse2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjZweDtmb250LXNpemU6MTJweDtiYWNrZ3JvdW5kOnJnYmEoMTUsMjQsNTYsLjU1KTtib3gtc2hhZG93Omluc2V0IDAgMCAwIDFweCByZ2JhKDEyMyw0NCwyNDUsLjI1KX1cclxuLm1pbmUtZ3JpZHtkaXNwbGF5OmdyaWQ7Z2FwOjE4cHh9XHJcbkBtZWRpYSAobWluLXdpZHRoOjY0MHB4KXsubWluZS1ncmlke2dyaWQtdGVtcGxhdGUtY29sdW1uczoyMjBweCAxZnI7YWxpZ24taXRlbXM6Y2VudGVyfX1cclxuLm1pbmUtZ2F1Z2V7cG9zaXRpb246cmVsYXRpdmU7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO3BhZGRpbmc6OHB4IDB9XHJcbi5taW5lLWdhdWdlIC5yaW5ne3dpZHRoOjIwMHB4O2hlaWdodDoyMDBweDtib3JkZXItcmFkaXVzOjUwJTtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpjZW50ZXI7YmFja2dyb3VuZDpjb25pYy1ncmFkaWVudCgjN0IyQ0Y1IDBkZWcscmdiYSgyNTUsMjU1LDI1NSwuMDgpIDBkZWcpO2JveC1zaGFkb3c6aW5zZXQgMCAwIDMwcHggcmdiYSgxMjMsNDQsMjQ1LC4yOCksMCAyNHB4IDQ4cHggcmdiYSgxMiw4LDQyLC41NSl9XHJcbi5taW5lLWdhdWdlIC5yaW5nOjpiZWZvcmV7Y29udGVudDpcIlwiO3Bvc2l0aW9uOmFic29sdXRlO2luc2V0OjE4JTtib3JkZXItcmFkaXVzOjUwJTtiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudChjaXJjbGUgYXQgNTAlIDI4JSxyZ2JhKDEyMyw0NCwyNDUsLjQ1KSxyZ2JhKDEyLDIwLDQ2LC45MikgNzAlKTtib3gtc2hhZG93Omluc2V0IDAgMTRweCAyOHB4IHJnYmEoMCwwLDAsLjQ4KTtwb2ludGVyLWV2ZW50czpub25lfVxyXG4ubWluZS1nYXVnZSAucmluZy1jb3Jle3Bvc2l0aW9uOnJlbGF0aXZlO2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo0cHg7Zm9udC13ZWlnaHQ6NjAwfVxyXG4ubWluZS1nYXVnZSAucmluZy1jb3JlIHNwYW57Zm9udC1zaXplOjIycHh9XHJcbi5taW5lLWdhdWdlIC5yaW5nLWNvcmUgc21hbGx7Zm9udC1zaXplOjEycHg7bGV0dGVyLXNwYWNpbmc6LjEyZW07b3BhY2l0eTouNzU7dGV4dC10cmFuc2Zvcm06dXBwZXJjYXNlfVxyXG4ucmluZy1nbG93e3Bvc2l0aW9uOmFic29sdXRlO3dpZHRoOjIwMHB4O2hlaWdodDoyMDBweDtib3JkZXItcmFkaXVzOjUwJTtmaWx0ZXI6Ymx1cigzMnB4KTtiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudChjaXJjbGUscmdiYSgxMjMsNDQsMjQ1LC40OCkscmdiYSg0NCwxMzcsMjQ1LC4xKSk7b3BhY2l0eTouNjthbmltYXRpb246bWluZS1nbG93IDlzIGVhc2UtaW4tb3V0IGluZmluaXRlfVxyXG4ucmluZy1nbG93LWJ7YW5pbWF0aW9uLWRlbGF5Oi00LjVzO2JhY2tncm91bmQ6cmFkaWFsLWdyYWRpZW50KGNpcmNsZSxyZ2JhKDQ0LDEzNywyNDUsLjQ1KSx0cmFuc3BhcmVudCA2NSUpfVxyXG4ucmluZy1wdWxzZXthbmltYXRpb246cmluZy1mbGFzaCAuNnMgZWFzZSFpbXBvcnRhbnR9XHJcbkBrZXlmcmFtZXMgcmluZy1mbGFzaHswJSwxMDAle2JveC1zaGFkb3c6aW5zZXQgMCAwIDMwcHggcmdiYSgxMjMsNDQsMjQ1LC4yOCksMCAyNHB4IDQ4cHggcmdiYSgxMiw4LDQyLC41NSl9NTAle2JveC1zaGFkb3c6aW5zZXQgMCAwIDUwcHggcmdiYSgyNDYsMTk2LDY5LC44KSwwIDI0cHggNjhweCByZ2JhKDI0NiwxOTYsNjksLjUpLDAgMCA4MHB4IHJnYmEoMjQ2LDE5Niw2OSwuNCl9fVxyXG4ucmluZy1mdWxse2FuaW1hdGlvbjpyaW5nLWdsb3ctZnVsbCAycyBlYXNlLWluLW91dCBpbmZpbml0ZSFpbXBvcnRhbnR9XHJcbkBrZXlmcmFtZXMgcmluZy1nbG93LWZ1bGx7MCUsMTAwJXtib3gtc2hhZG93Omluc2V0IDAgMCA0MHB4IHJnYmEoMjQ2LDE5Niw2OSwuNSksMCAyNHB4IDQ4cHggcmdiYSgyNDYsMTk2LDY5LC4zNSksMCAwIDYwcHggcmdiYSgyNDYsMTk2LDY5LC4zKX01MCV7Ym94LXNoYWRvdzppbnNldCAwIDAgNjBweCByZ2JhKDI0NiwxOTYsNjksLjcpLDAgMjRweCA2OHB4IHJnYmEoMjQ2LDE5Niw2OSwuNSksMCAwIDgwcHggcmdiYSgyNDYsMTk2LDY5LC41KX19XHJcbi5taWxlc3RvbmUtcHVsc2V7YW5pbWF0aW9uOm1pbGVzdG9uZS1yaW5nIDFzIGVhc2V9XHJcbkBrZXlmcmFtZXMgbWlsZXN0b25lLXJpbmd7MCV7dHJhbnNmb3JtOnNjYWxlKDEpfTMwJXt0cmFuc2Zvcm06c2NhbGUoMS4wOCl9NjAle3RyYW5zZm9ybTpzY2FsZSguOTgpfTEwMCV7dHJhbnNmb3JtOnNjYWxlKDEpfX1cclxuQGtleWZyYW1lcyBtaW5lLWdsb3d7MCUsMTAwJXt0cmFuc2Zvcm06c2NhbGUoLjkyKTtvcGFjaXR5Oi40NX01MCV7dHJhbnNmb3JtOnNjYWxlKDEuMDUpO29wYWNpdHk6Ljh9fVxyXG4ubWluZS1wcm9ncmVzc3tkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDoxNHB4fVxyXG4ubWluZS1wcm9ncmVzcy1tZXRhe2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpmbGV4LWVuZDtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2Vlbjtmb250LXNpemU6MTRweDtsZXR0ZXItc3BhY2luZzouMDJlbX1cclxuLm1pbmUtcHJvZ3Jlc3MtdHJhY2t7cG9zaXRpb246cmVsYXRpdmU7aGVpZ2h0OjEycHg7Ym9yZGVyLXJhZGl1czo5OTlweDtiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjEpO292ZXJmbG93OmhpZGRlbjtib3gtc2hhZG93Omluc2V0IDAgMCAxNHB4IHJnYmEoMTIzLDQ0LDI0NSwuMjgpfVxyXG4ubWluZS1wcm9ncmVzcy1maWxse2hlaWdodDoxMDAlO3dpZHRoOjA7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoOTBkZWcsIzdCMkNGNSwjMkM4OUY1KTtib3gtc2hhZG93OjAgMCAxNnB4IHJnYmEoMTIzLDQ0LDI0NSwuNjUpO3RyYW5zaXRpb246d2lkdGggLjM1cyB2YXIoLS1lYXNlKTtwb3NpdGlvbjpyZWxhdGl2ZTtvdmVyZmxvdzpoaWRkZW59XHJcbi5taW5lLXByb2dyZXNzLWZpbGw6OmFmdGVye2NvbnRlbnQ6XCJcIjtwb3NpdGlvbjphYnNvbHV0ZTt0b3A6MDtsZWZ0Oi0xMDAlO3dpZHRoOjEwMCU7aGVpZ2h0OjEwMCU7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoOTBkZWcsdHJhbnNwYXJlbnQscmdiYSgyNTUsMjU1LDI1NSwuMyksdHJhbnNwYXJlbnQpO2FuaW1hdGlvbjpwcm9ncmVzcy13YXZlIDJzIGxpbmVhciBpbmZpbml0ZTtwb2ludGVyLWV2ZW50czpub25lfVxyXG5Aa2V5ZnJhbWVzIHByb2dyZXNzLXdhdmV7MCV7bGVmdDotMTAwJX0xMDAle2xlZnQ6MjAwJX19XHJcbi5taW5lLXN0YXR1c3ttaW4taGVpZ2h0OjIycHg7Zm9udC1zaXplOjEzcHg7b3BhY2l0eTouOX1cclxuLm1pbmUtYWN0aW9ucy1ncmlke2Rpc3BsYXk6Z3JpZDtnYXA6MTJweDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6cmVwZWF0KDIsbWlubWF4KDAsMWZyKSl9XHJcbi5taW5lLWFjdGlvbnMtZ3JpZCAuYnRue2hlaWdodDo0OHB4O2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OmNlbnRlcjtmb250LXNpemU6MTVweDtnYXA6OHB4fVxyXG4ubWluZS1hY3Rpb25zLWdyaWQgLnNwYW4tMntncmlkLWNvbHVtbjpzcGFuIDJ9XHJcbkBtZWRpYSAobWluLXdpZHRoOjY4MHB4KXsubWluZS1hY3Rpb25zLWdyaWR7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOnJlcGVhdCgzLG1pbm1heCgwLDFmcikpfS5taW5lLWFjdGlvbnMtZ3JpZCAuc3Bhbi0ye2dyaWQtY29sdW1uOnNwYW4gM319XHJcbi5taW5lLWZlZWR7cG9zaXRpb246cmVsYXRpdmU7Ym9yZGVyLXJhZGl1czoxNnB4O2JhY2tncm91bmQ6cmdiYSgxMiwyMCw0NCwuNTUpO3BhZGRpbmc6MTRweCAxMnB4O2JveC1zaGFkb3c6aW5zZXQgMCAwIDI0cHggcmdiYSgxMjMsNDQsMjQ1LC4xMik7YmFja2Ryb3AtZmlsdGVyOmJsdXIoMTJweCl9XHJcbi5taW5lLWZlZWQ6OmJlZm9yZXtjb250ZW50OlwiXCI7cG9zaXRpb246YWJzb2x1dGU7aW5zZXQ6MDtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcscmdiYSgxMjMsNDQsMjQ1LC4xNikscmdiYSg0NCwxMzcsMjQ1LC4xNCkgNjAlLHRyYW5zcGFyZW50KTtvcGFjaXR5Oi43NTtwb2ludGVyLWV2ZW50czpub25lfVxyXG4ubWluZS1mZWVkIC5ldmVudC1mZWVke21heC1oZWlnaHQ6MTgwcHh9XHJcbi5ldmVudHt0cmFuc2l0aW9uOm9wYWNpdHkgLjNzIGVhc2UsIHRyYW5zZm9ybSAuM3MgZWFzZX1cclxuLmV2ZW50LWNyaXRpY2Fse2NvbG9yOiNmNmM0NDU7Zm9udC13ZWlnaHQ6NjAwfVxyXG4uZXZlbnQtd2FybmluZ3tjb2xvcjojZmY1YzVjfVxyXG4uZXZlbnQtc3VjY2Vzc3tjb2xvcjojMmVjMjdlfVxyXG4uZXZlbnQtbm9ybWFse2NvbG9yOnJnYmEoMjU1LDI1NSwyNTUsLjkpfVxyXG4ubWluZS1ob2xvZ3JhbXtwb3NpdGlvbjpyZWxhdGl2ZTtmbGV4OjE7bWluLWhlaWdodDoxODBweDtib3JkZXItcmFkaXVzOjE4cHg7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoOTAlIDEyMCUgYXQgNTAlIDEwMCUscmdiYSg0NCwxMzcsMjQ1LC4zNSkscmdiYSg4LDEyLDMwLC4zKSA1NSUsdHJhbnNwYXJlbnQpO292ZXJmbG93OmhpZGRlbjttYXJnaW4tdG9wOmF1dG87ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO2lzb2xhdGlvbjppc29sYXRlO3RyYW5zaXRpb246YmFja2dyb3VuZCAuNXMgZWFzZX1cclxuLmhvbG8taWRsZXtiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudCg5MCUgMTIwJSBhdCA1MCUgMTAwJSxyZ2JhKDEyMyw0NCwyNDUsLjI1KSxyZ2JhKDgsMTIsMzAsLjMpIDU1JSx0cmFuc3BhcmVudCl9XHJcbi5ob2xvLW1pbmluZ3tiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudCg5MCUgMTIwJSBhdCA1MCUgMTAwJSxyZ2JhKDQ0LDEzNywyNDUsLjQ1KSxyZ2JhKDgsMTIsMzAsLjMpIDU1JSx0cmFuc3BhcmVudCl9XHJcbi5ob2xvLW1pbmluZyAubWluZS1ob2xvLWdyaWR7YW5pbWF0aW9uLWR1cmF0aW9uOjEycyFpbXBvcnRhbnR9XHJcbi5ob2xvLWNvbGxhcHNlZHtiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudCg5MCUgMTIwJSBhdCA1MCUgMTAwJSxyZ2JhKDI1NSw5Miw5MiwuMzUpLHJnYmEoOCwxMiwzMCwuMykgNTUlLHRyYW5zcGFyZW50KTthbmltYXRpb246aG9sby1nbGl0Y2ggLjVzIGVhc2UgaW5maW5pdGV9XHJcbkBrZXlmcmFtZXMgaG9sby1nbGl0Y2h7MCUsMTAwJXt0cmFuc2Zvcm06dHJhbnNsYXRlWCgwKX0yNSV7dHJhbnNmb3JtOnRyYW5zbGF0ZVgoLTJweCl9NzUle3RyYW5zZm9ybTp0cmFuc2xhdGVYKDJweCl9fVxyXG4uY3JpdGljYWwtZmxhc2h7YW5pbWF0aW9uOmNyaXRpY2FsLWJ1cnN0IC40cyBlYXNlfVxyXG5Aa2V5ZnJhbWVzIGNyaXRpY2FsLWJ1cnN0ezAle2JhY2tncm91bmQ6cmFkaWFsLWdyYWRpZW50KDkwJSAxMjAlIGF0IDUwJSAxMDAlLHJnYmEoNDQsMTM3LDI0NSwuMzUpLHJnYmEoOCwxMiwzMCwuMykgNTUlLHRyYW5zcGFyZW50KX01MCV7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoOTAlIDEyMCUgYXQgNTAlIDEwMCUscmdiYSgyNDYsMTk2LDY5LC42NSkscmdiYSgyNDYsMTk2LDY5LC4yKSA1NSUsdHJhbnNwYXJlbnQpfTEwMCV7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoOTAlIDEyMCUgYXQgNTAlIDEwMCUscmdiYSg0NCwxMzcsMjQ1LC4zNSkscmdiYSg4LDEyLDMwLC4zKSA1NSUsdHJhbnNwYXJlbnQpfX1cclxuLm1pbmUtaG9sby1ncmlke3Bvc2l0aW9uOmFic29sdXRlO3dpZHRoOjE0MCU7aGVpZ2h0OjE0MCU7YmFja2dyb3VuZDpyZXBlYXRpbmctbGluZWFyLWdyYWRpZW50KDBkZWcscmdiYSgyNTUsMjU1LDI1NSwuMDgpIDAscmdiYSgyNTUsMjU1LDI1NSwuMDgpIDFweCx0cmFuc3BhcmVudCAxcHgsdHJhbnNwYXJlbnQgMjhweCkscmVwZWF0aW5nLWxpbmVhci1ncmFkaWVudCg5MGRlZyxyZ2JhKDI1NSwyNTUsMjU1LC4wNSkgMCxyZ2JhKDI1NSwyNTUsMjU1LC4wNSkgMXB4LHRyYW5zcGFyZW50IDFweCx0cmFuc3BhcmVudCAyNnB4KTtvcGFjaXR5Oi4yMjt0cmFuc2Zvcm06dHJhbnNsYXRlM2QoLTEwJSwwLDApIHJvdGF0ZSg4ZGVnKTthbmltYXRpb246aG9sby1wYW4gMTZzIGxpbmVhciBpbmZpbml0ZX1cclxuLm1pbmUtaG9sby1ncmlkLmRpYWdvbmFse29wYWNpdHk6LjE4O3RyYW5zZm9ybTp0cmFuc2xhdGUzZCgxMCUsMCwwKSByb3RhdGUoLTE2ZGVnKTthbmltYXRpb24tZHVyYXRpb246MjJzfVxyXG5Aa2V5ZnJhbWVzIGhvbG8tcGFuezAle3RyYW5zZm9ybTp0cmFuc2xhdGUzZCgtMTIlLDAsMCkgcm90YXRlKDhkZWcpfTEwMCV7dHJhbnNmb3JtOnRyYW5zbGF0ZTNkKDEyJSwwLDApIHJvdGF0ZSg4ZGVnKX19XHJcbi5taW5lLWhvbG8tZ2xvd3twb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDo3MCU7aGVpZ2h0OjcwJTtib3JkZXItcmFkaXVzOjUwJTtiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudChjaXJjbGUgYXQgNTAlIDQwJSxyZ2JhKDEyMyw0NCwyNDUsLjU1KSx0cmFuc3BhcmVudCA3MCUpO2ZpbHRlcjpibHVyKDMycHgpO29wYWNpdHk6LjU1O2FuaW1hdGlvbjpob2xvLWJyZWF0aGUgMTBzIGVhc2UtaW4tb3V0IGluZmluaXRlfVxyXG5Aa2V5ZnJhbWVzIGhvbG8tYnJlYXRoZXswJSwxMDAle3RyYW5zZm9ybTpzY2FsZSguOSk7b3BhY2l0eTouNDV9NTAle3RyYW5zZm9ybTpzY2FsZSgxLjA4KTtvcGFjaXR5Oi44NX19XHJcbi5taW5lLXNoYXJke3Bvc2l0aW9uOmFic29sdXRlO3dpZHRoOjEyMHB4O2hlaWdodDoxMjBweDtiYWNrZ3JvdW5kOmNvbmljLWdyYWRpZW50KGZyb20gMTUwZGVnLHJnYmEoMTIzLDQ0LDI0NSwuOCkscmdiYSg0NCwxMzcsMjQ1LC4zOCkscmdiYSgxMjMsNDQsMjQ1LC4wOCkpO2NsaXAtcGF0aDpwb2x5Z29uKDUwJSAwLDg4JSA0MCUsNzAlIDEwMCUsMzAlIDEwMCUsMTIlIDQwJSk7b3BhY2l0eTouMjY7ZmlsdGVyOmJsdXIoLjRweCk7YW5pbWF0aW9uOnNoYXJkLWZsb2F0IDhzIGVhc2UtaW4tb3V0IGluZmluaXRlfVxyXG4ubWluZS1zaGFyZC5zaGFyZC0xe3RvcDoxOCU7bGVmdDoxNiU7YW5pbWF0aW9uLWRlbGF5Oi0xLjRzfVxyXG4ubWluZS1zaGFyZC5zaGFyZC0ye2JvdHRvbToxNiU7cmlnaHQ6MjIlO2FuaW1hdGlvbi1kZWxheTotMy4yczt0cmFuc2Zvcm06c2NhbGUoLjc0KX1cclxuLm1pbmUtc2hhcmQuc2hhcmQtM3t0b3A6MjYlO3JpZ2h0OjM0JTthbmltYXRpb24tZGVsYXk6LTUuMXM7dHJhbnNmb3JtOnNjYWxlKC41KSByb3RhdGUoMTJkZWcpfVxyXG5Aa2V5ZnJhbWVzIHNoYXJkLWZsb2F0ezAlLDEwMCV7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoLTEwcHgpIHNjYWxlKDEpO29wYWNpdHk6LjJ9NTAle3RyYW5zZm9ybTp0cmFuc2xhdGVZKDEwcHgpIHNjYWxlKDEuMDUpO29wYWNpdHk6LjR9fVxyXG4ubWFpbi1hbWJpZW50e3Bvc2l0aW9uOmFic29sdXRlO2luc2V0OjA7ei1pbmRleDotMTtwb2ludGVyLWV2ZW50czpub25lO292ZXJmbG93OmhpZGRlbn1cclxuLm1haW4tYW1iaWVudCAuYW1iaWVudC5vcmJ7cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6NDIwcHg7aGVpZ2h0OjQyMHB4O2JvcmRlci1yYWRpdXM6NTAlO2ZpbHRlcjpibHVyKDEyMHB4KTtvcGFjaXR5Oi40MjthbmltYXRpb246YW1iaWVudC1kcmlmdCAyNnMgZWFzZS1pbi1vdXQgaW5maW5pdGV9XHJcbi5tYWluLWFtYmllbnQgLm9yYi1he2JhY2tncm91bmQ6cmFkaWFsLWdyYWRpZW50KGNpcmNsZSxyZ2JhKDEyMyw0NCwyNDUsLjYpLHRyYW5zcGFyZW50IDcwJSk7dG9wOi0xNDBweDtyaWdodDotMTIwcHh9XHJcbi5tYWluLWFtYmllbnQgLm9yYi1ie2JhY2tncm91bmQ6cmFkaWFsLWdyYWRpZW50KGNpcmNsZSxyZ2JhKDQ0LDEzNywyNDUsLjU1KSx0cmFuc3BhcmVudCA3MCUpO2JvdHRvbTotMTgwcHg7bGVmdDotMTgwcHg7YW5pbWF0aW9uLWRlbGF5Oi0xM3N9XHJcbi5tYWluLWFtYmllbnQgLmdyaWR7cG9zaXRpb246YWJzb2x1dGU7aW5zZXQ6MDtiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudCg3MCUgNjAlIGF0IDUwJSAxMDAlLHJnYmEoMjU1LDI1NSwyNTUsLjA4KSx0cmFuc3BhcmVudCA3NSUpO29wYWNpdHk6LjM1O21peC1ibGVuZC1tb2RlOnNjcmVlbjthbmltYXRpb246YW1iaWVudC1wdWxzZSAxOHMgZWFzZS1pbi1vdXQgaW5maW5pdGV9XHJcbkBrZXlmcmFtZXMgYW1iaWVudC1kcmlmdHswJSwxMDAle3RyYW5zZm9ybTp0cmFuc2xhdGUzZCgwLDAsMCkgc2NhbGUoMSl9NTAle3RyYW5zZm9ybTp0cmFuc2xhdGUzZCg4JSwgLTQlLDApIHNjYWxlKDEuMDUpfX1cclxuQGtleWZyYW1lcyBhbWJpZW50LXB1bHNlezAlLDEwMCV7b3BhY2l0eTouMjV9NTAle29wYWNpdHk6LjQ1fX1cclxuLmZhZGUtaW57YW5pbWF0aW9uOmZhZGUtaW4gLjNzIHZhcigtLWVhc2UpfVxyXG5Aa2V5ZnJhbWVzIGZhZGUtaW57ZnJvbXtvcGFjaXR5OjA7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoNHB4KX10b3tvcGFjaXR5OjE7dHJhbnNmb3JtOm5vbmV9fVxyXG4uZmxhc2h7YW5pbWF0aW9uOmZsYXNoIC45cyBlYXNlfVxyXG5Aa2V5ZnJhbWVzIGZsYXNoezAle2JveC1zaGFkb3c6MCAwIDAgcmdiYSgyNTUsMjU1LDI1NSwwKX00MCV7Ym94LXNoYWRvdzowIDAgMCA2cHggcmdiYSgyNTUsMjU1LDI1NSwuMTUpfTEwMCV7Ym94LXNoYWRvdzowIDAgMCByZ2JhKDI1NSwyNTUsMjU1LDApfX1cclxuLnNrZWxldG9ue3Bvc2l0aW9uOnJlbGF0aXZlO292ZXJmbG93OmhpZGRlbjtiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjA4KTtib3JkZXItcmFkaXVzOnZhcigtLXJhZGl1cy1tZCk7aGVpZ2h0OjQ0cHh9XHJcbi5za2VsZXRvbjo6YWZ0ZXJ7Y29udGVudDpcIlwiO3Bvc2l0aW9uOmFic29sdXRlO2luc2V0OjA7dHJhbnNmb3JtOnRyYW5zbGF0ZVgoLTEwMCUpO2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDkwZGVnLHRyYW5zcGFyZW50LHJnYmEoMjU1LDI1NSwyNTUsLjEyKSx0cmFuc3BhcmVudCk7YW5pbWF0aW9uOnNoaW1tZXIgMS4ycyBpbmZpbml0ZTtwb2ludGVyLWV2ZW50czpub25lfVxyXG5Aa2V5ZnJhbWVzIHNoaW1tZXJ7MTAwJXt0cmFuc2Zvcm06dHJhbnNsYXRlWCgxMDAlKX19XHJcbi5saXN0LWl0ZW17ZGlzcGxheTpmbGV4O2dhcDo4cHg7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2JhY2tncm91bmQ6cmdiYSgyNTUsMjU1LDI1NSwuMDYpO2JvcmRlci1yYWRpdXM6dmFyKC0tcmFkaXVzLW1kKTtwYWRkaW5nOjEwcHh9XHJcbi5saXN0LWl0ZW0tLWJ1eXtib3JkZXItbGVmdDozcHggc29saWQgdmFyKC0tYnV5KX1cclxuLmxpc3QtaXRlbS0tc2VsbHtib3JkZXItbGVmdDozcHggc29saWQgdmFyKC0tc2VsbCl9XHJcbi5uYXZ7bWF4LXdpZHRoOnZhcigtLWNvbnRhaW5lci1tYXgpO21hcmdpbjoxMnB4IGF1dG8gMDtkaXNwbGF5OmZsZXg7Z2FwOjhweDtmbGV4LXdyYXA6d3JhcDtwb3NpdGlvbjpzdGlja3k7dG9wOjA7ei1pbmRleDo0MDtwYWRkaW5nOjZweDtib3JkZXItcmFkaXVzOjE0cHg7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTgwZGVnLHJnYmEoMjAsMjAsNDAsLjQ1KSxyZ2JhKDIwLDIwLDQwLC4yNSkpO2JhY2tkcm9wLWZpbHRlcjpibHVyKDEwcHgpIHNhdHVyYXRlKDEyNSUpO2JvcmRlcjoxcHggc29saWQgcmdiYSgyNTUsMjU1LDI1NSwuMDYpfVxyXG4ubmF2IGF7ZmxleDoxO2Rpc3BsYXk6ZmxleDtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NnB4O3RleHQtYWxpZ246Y2VudGVyO3BhZGRpbmc6MTBweDtib3JkZXItcmFkaXVzOjk5OXB4O3RleHQtZGVjb3JhdGlvbjpub25lO2NvbG9yOiNmZmY7dHJhbnNpdGlvbjpiYWNrZ3JvdW5kIHZhcigtLWR1cikgdmFyKC0tZWFzZSksIHRyYW5zZm9ybSB2YXIoLS1kdXIpIHZhcigtLWVhc2UpfVxyXG4ubmF2IGEgLmljb3tvcGFjaXR5Oi45NX1cclxuLm5hdiBhLmFjdGl2ZXtiYWNrZ3JvdW5kOnZhcigtLWdyYWQpO2JveC1zaGFkb3c6dmFyKC0tZ2xvdyl9XHJcbi5uYXYgYTpub3QoLmFjdGl2ZSk6aG92ZXJ7YmFja2dyb3VuZDpyZ2JhKDI1NSwyNTUsMjU1LC4wNil9XHJcbi8qIGdlbmVyaWMgaWNvbiAqL1xyXG4uaWNvbntkaXNwbGF5OmlubGluZS1ibG9jaztsaW5lLWhlaWdodDowO3ZlcnRpY2FsLWFsaWduOm1pZGRsZX1cclxuLmljb24gc3Zne2Rpc3BsYXk6YmxvY2s7ZmlsdGVyOmRyb3Atc2hhZG93KDAgMCA4cHggcmdiYSgxMjMsNDQsMjQ1LC4zNSkpfVxyXG4vKiByYXJpdHkgYmFkZ2VzICovXHJcbi5iYWRnZXtkaXNwbGF5OmlubGluZS1mbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NnB4O3BhZGRpbmc6MnB4IDhweDtib3JkZXItcmFkaXVzOjk5OXB4O2ZvbnQtc2l6ZToxMnB4O2xpbmUtaGVpZ2h0OjE7Ym9yZGVyOjFweCBzb2xpZCByZ2JhKDI1NSwyNTUsMjU1LC4xMik7YmFja2dyb3VuZDpyZ2JhKDI1NSwyNTUsMjU1LC4wNil9XHJcbi5iYWRnZSBpe2Rpc3BsYXk6aW5saW5lLWJsb2NrO3dpZHRoOjhweDtoZWlnaHQ6OHB4O2JvcmRlci1yYWRpdXM6OTk5cHh9XHJcbi5iYWRnZS5yYXJpdHktY29tbW9uIGl7YmFja2dyb3VuZDp2YXIoLS1yYXJpdHktY29tbW9uKX1cclxuLmJhZGdlLnJhcml0eS1yYXJlIGl7YmFja2dyb3VuZDp2YXIoLS1yYXJpdHktcmFyZSl9XHJcbi5iYWRnZS5yYXJpdHktZXBpYyBpe2JhY2tncm91bmQ6dmFyKC0tcmFyaXR5LWVwaWMpfVxyXG4uYmFkZ2UucmFyaXR5LWxlZ2VuZGFyeSBpe2JhY2tncm91bmQ6dmFyKC0tcmFyaXR5LWxlZ2VuZGFyeSl9XHJcbi5yYXJpdHktb3V0bGluZS1jb21tb257Ym94LXNoYWRvdzowIDAgMCAxcHggcmdiYSgxNTQsMTYwLDE2NiwuMzUpIGluc2V0LCAwIDAgMjRweCByZ2JhKDE1NCwxNjAsMTY2LC4xNSl9XHJcbi5yYXJpdHktb3V0bGluZS1yYXJle2JveC1zaGFkb3c6MCAwIDAgMXB4IHJnYmEoNzksMjEyLDI0NSwuNDUpIGluc2V0LCAwIDAgMjhweCByZ2JhKDc5LDIxMiwyNDUsLjI1KX1cclxuLnJhcml0eS1vdXRsaW5lLWVwaWN7Ym94LXNoYWRvdzowIDAgMCAxcHggcmdiYSgxNzgsMTA3LDI1NSwuNSkgaW5zZXQsIDAgMCAzMnB4IHJnYmEoMTc4LDEwNywyNTUsLjMpfVxyXG4ucmFyaXR5LW91dGxpbmUtbGVnZW5kYXJ5e2JveC1zaGFkb3c6MCAwIDAgMXB4IHJnYmEoMjQ2LDE5Niw2OSwuNikgaW5zZXQsIDAgMCAzNnB4IHJnYmEoMjQ2LDE5Niw2OSwuMzUpfVxyXG4vKiBhdXJhIGNhcmQgd3JhcHBlciAqL1xyXG4uaXRlbS1jYXJke3Bvc2l0aW9uOnJlbGF0aXZlO2JvcmRlci1yYWRpdXM6dmFyKC0tcmFkaXVzLW1kKTtwYWRkaW5nOjEwcHg7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTQwZGVnLHJnYmEoMjU1LDI1NSwyNTUsLjA2KSxyZ2JhKDI1NSwyNTUsMjU1LC4wNCkpO292ZXJmbG93OmhpZGRlbn1cclxuLml0ZW0tY2FyZDo6YmVmb3Jle2NvbnRlbnQ6XCJcIjtwb3NpdGlvbjphYnNvbHV0ZTtpbnNldDotMXB4O2JvcmRlci1yYWRpdXM6aW5oZXJpdDtwYWRkaW5nOjFweDtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcscmdiYSgyNTUsMjU1LDI1NSwuMTgpLHJnYmEoMjU1LDI1NSwyNTUsLjAyKSk7LXdlYmtpdC1tYXNrOmxpbmVhci1ncmFkaWVudCgjMDAwIDAgMCkgY29udGVudC1ib3gsbGluZWFyLWdyYWRpZW50KCMwMDAgMCAwKTstd2Via2l0LW1hc2stY29tcG9zaXRlOnhvcjttYXNrLWNvbXBvc2l0ZTpleGNsdWRlO3BvaW50ZXItZXZlbnRzOm5vbmV9XHJcbi5pdGVtLWNhcmRbZGF0YS1yYXJpdHk9XCJjb21tb25cIl17Ym9yZGVyOjFweCBzb2xpZCByZ2JhKDE1NCwxNjAsMTY2LC4yNSl9XHJcbi5pdGVtLWNhcmRbZGF0YS1yYXJpdHk9XCJyYXJlXCJde2JvcmRlcjoxcHggc29saWQgcmdiYSg3OSwyMTIsMjQ1LC4zNSl9XHJcbi5pdGVtLWNhcmRbZGF0YS1yYXJpdHk9XCJlcGljXCJde2JvcmRlcjoxcHggc29saWQgcmdiYSgxNzgsMTA3LDI1NSwuNCl9XHJcbi5pdGVtLWNhcmRbZGF0YS1yYXJpdHk9XCJsZWdlbmRhcnlcIl17Ym9yZGVyOjFweCBzb2xpZCByZ2JhKDI0NiwxOTYsNjksLjQ1KX1cclxuLnVwZ3JhZGUtc3VjY2Vzc3thbmltYXRpb246dXBncmFkZS1mbGFzaCAxcyBlYXNlfVxyXG5Aa2V5ZnJhbWVzIHVwZ3JhZGUtZmxhc2h7MCV7dHJhbnNmb3JtOnNjYWxlKDEpO2JveC1zaGFkb3c6MCAwIDAgcmdiYSg0NiwxOTQsMTI2LDApfTI1JXt0cmFuc2Zvcm06c2NhbGUoMS4wMik7Ym94LXNoYWRvdzowIDAgMzBweCByZ2JhKDQ2LDE5NCwxMjYsLjYpLDAgMCA2MHB4IHJnYmEoNDYsMTk0LDEyNiwuMyl9NTAle3RyYW5zZm9ybTpzY2FsZSgxKTtib3gtc2hhZG93OjAgMCA0MHB4IHJnYmEoNDYsMTk0LDEyNiwuOCksMCAwIDgwcHggcmdiYSg0NiwxOTQsMTI2LC40KX03NSV7dHJhbnNmb3JtOnNjYWxlKDEuMDEpO2JveC1zaGFkb3c6MCAwIDMwcHggcmdiYSg0NiwxOTQsMTI2LC42KSwwIDAgNjBweCByZ2JhKDQ2LDE5NCwxMjYsLjMpfTEwMCV7dHJhbnNmb3JtOnNjYWxlKDEpO2JveC1zaGFkb3c6MCAwIDAgcmdiYSg0NiwxOTQsMTI2LDApfX1cclxuLyogdmVydGljYWwgdGltZWxpbmUgKi9cclxuLnRpbWVsaW5le3Bvc2l0aW9uOnJlbGF0aXZlO21hcmdpbi10b3A6OHB4O3BhZGRpbmctbGVmdDoxNnB4fVxyXG4udGltZWxpbmU6OmJlZm9yZXtjb250ZW50OlwiXCI7cG9zaXRpb246YWJzb2x1dGU7bGVmdDo2cHg7dG9wOjA7Ym90dG9tOjA7d2lkdGg6MnB4O2JhY2tncm91bmQ6cmdiYSgyNTUsMjU1LDI1NSwuMSk7cG9pbnRlci1ldmVudHM6bm9uZX1cclxuLnRpbWVsaW5lLWl0ZW17cG9zaXRpb246cmVsYXRpdmU7bWFyZ2luOjhweCAwIDhweCAwfVxyXG4udGltZWxpbmUtaXRlbSAuZG90e3Bvc2l0aW9uOmFic29sdXRlO2xlZnQ6LTEycHg7dG9wOjJweDt3aWR0aDoxMHB4O2hlaWdodDoxMHB4O2JvcmRlci1yYWRpdXM6OTk5cHg7YmFja2dyb3VuZDp2YXIoLS1yYXJpdHktcmFyZSk7Ym94LXNoYWRvdzowIDAgMTBweCByZ2JhKDc5LDIxMiwyNDUsLjUpfVxyXG4udGltZWxpbmUtaXRlbSAudGltZXtvcGFjaXR5Oi43NTtmb250LXNpemU6MTJweH1cclxuLnRpbWVsaW5lLWl0ZW0gLmRlc2N7bWFyZ2luLXRvcDoycHh9XHJcbi8qIGFjdGlvbiBidXR0b25zIGxpbmUgKi9cclxuLmFjdGlvbnN7ZGlzcGxheTpmbGV4O2dhcDo2cHg7ZmxleC13cmFwOndyYXB9XHJcbi8qIHN1YnRsZSBob3ZlciAqL1xyXG4uaG92ZXItbGlmdHt0cmFuc2l0aW9uOnRyYW5zZm9ybSB2YXIoLS1kdXIpIHZhcigtLWVhc2UpLCBib3gtc2hhZG93IHZhcigtLWR1cikgdmFyKC0tZWFzZSl9XHJcbi5ob3Zlci1saWZ0OmhvdmVye3RyYW5zZm9ybTp0cmFuc2xhdGVZKC0xcHgpfVxyXG4vKiByaW5nIG1ldGVyICovXHJcbi5yaW5ney0tc2l6ZToxMTZweDstLXRoaWNrOjEwcHg7cG9zaXRpb246cmVsYXRpdmU7d2lkdGg6dmFyKC0tc2l6ZSk7aGVpZ2h0OnZhcigtLXNpemUpO2JvcmRlci1yYWRpdXM6NTAlO2JhY2tncm91bmQ6Y29uaWMtZ3JhZGllbnQoIzdCMkNGNSAwZGVnLCByZ2JhKDI1NSwyNTUsMjU1LC4wOCkgMGRlZyl9XHJcbi5yaW5nOjphZnRlcntjb250ZW50OlwiXCI7cG9zaXRpb246YWJzb2x1dGU7aW5zZXQ6Y2FsYyh2YXIoLS10aGljaykpO2JvcmRlci1yYWRpdXM6aW5oZXJpdDtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxODBkZWcscmdiYSgyNTUsMjU1LDI1NSwuMDYpLHJnYmEoMjU1LDI1NSwyNTUsLjAyKSk7cG9pbnRlci1ldmVudHM6bm9uZX1cclxuLnJpbmcgLmxhYmVse3Bvc2l0aW9uOmFic29sdXRlO2luc2V0OjA7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO2ZvbnQtd2VpZ2h0OjcwMH1cclxuLyogdG9hc3QgKi9cclxuLnRvYXN0LXdyYXB7cG9zaXRpb246Zml4ZWQ7cmlnaHQ6MTZweDtib3R0b206MTZweDtkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDo4cHg7ei1pbmRleDo5OTk5fVxyXG4udG9hc3R7bWF4LXdpZHRoOjM0MHB4O3BhZGRpbmc6MTBweCAxMnB4O2JvcmRlci1yYWRpdXM6MTJweDtjb2xvcjojZmZmO2JhY2tncm91bmQ6cmdiYSgzMCwzMCw1MCwuOTYpO2JveC1zaGFkb3c6dmFyKC0tZ2xvdyk7cG9zaXRpb246cmVsYXRpdmU7b3ZlcmZsb3c6aGlkZGVufVxyXG4udG9hc3Quc3VjY2Vzc3tiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxODBkZWcscmdiYSg0NiwxOTQsMTI2LC4xNikscmdiYSgzMCwzMCw1MCwuOTYpKX1cclxuLnRvYXN0Lndhcm57YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTgwZGVnLHJnYmEoMjQ2LDE5Niw2OSwuMTgpLHJnYmEoMzAsMzAsNTAsLjk2KSl9XHJcbi50b2FzdC5lcnJvcntiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxODBkZWcscmdiYSgyNTUsOTIsOTIsLjE4KSxyZ2JhKDMwLDMwLDUwLC45NikpfVxyXG4udG9hc3QgLmxpZmV7cG9zaXRpb246YWJzb2x1dGU7bGVmdDowO2JvdHRvbTowO2hlaWdodDoycHg7YmFja2dyb3VuZDojN0IyQ0Y1O2FuaW1hdGlvbjp0b2FzdC1saWZlIHZhcigtLWxpZmUsMy41cykgbGluZWFyIGZvcndhcmRzfVxyXG5Aa2V5ZnJhbWVzIHRvYXN0LWxpZmV7ZnJvbXt3aWR0aDoxMDAlfXRve3dpZHRoOjB9fVxyXG5AbWVkaWEgKHByZWZlcnMtcmVkdWNlZC1tb3Rpb246cmVkdWNlKXsqe2FuaW1hdGlvbi1kdXJhdGlvbjouMDAxbXMhaW1wb3J0YW50O2FuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6MSFpbXBvcnRhbnQ7dHJhbnNpdGlvbi1kdXJhdGlvbjowbXMhaW1wb3J0YW50fX1cclxuXHJcbi8qIHJlc3BvbnNpdmUgd2lkdGggKyBkZXNrdG9wIGdyaWQgbGF5b3V0IGZvciBmdWxsbmVzcyAqL1xyXG5AbWVkaWEgKG1pbi13aWR0aDo5MDBweCl7OnJvb3R7LS1jb250YWluZXItbWF4OjkyMHB4fX1cclxuQG1lZGlhIChtaW4td2lkdGg6MTIwMHB4KXs6cm9vdHstLWNvbnRhaW5lci1tYXg6MTA4MHB4fX1cclxuXHJcbi5jb250YWluZXIuZ3JpZC0ye2Rpc3BsYXk6Z3JpZDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6MWZyO2dhcDoxMnB4fVxyXG5AbWVkaWEgKG1pbi13aWR0aDo5ODBweCl7XHJcbiAgLmNvbnRhaW5lci5ncmlkLTJ7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOjFmciAxZnI7YWxpZ24taXRlbXM6c3RhcnR9XHJcbiAgLmNvbnRhaW5lci5ncmlkLTI+LmNhcmQ6Zmlyc3QtY2hpbGR7Z3JpZC1jb2x1bW46MS8tMX1cclxufVxyXG5cclxuLyogZGVjb3JhdGl2ZSBwYWdlIG92ZXJsYXlzOiBhdXJvcmEsIGdyaWQgbGluZXMsIGJvdHRvbSBnbG93ICovXHJcbmh0bWw6OmJlZm9yZXtjb250ZW50OlwiXCI7cG9zaXRpb246Zml4ZWQ7aW5zZXQ6MDtwb2ludGVyLWV2ZW50czpub25lO3otaW5kZXg6LTI7b3BhY2l0eTouMDM1O2JhY2tncm91bmQtaW1hZ2U6bGluZWFyLWdyYWRpZW50KHJnYmEoMjU1LDI1NSwyNTUsLjA0KSAxcHgsIHRyYW5zcGFyZW50IDFweCksbGluZWFyLWdyYWRpZW50KDkwZGVnLCByZ2JhKDI1NSwyNTUsMjU1LC4wNCkgMXB4LCB0cmFuc3BhcmVudCAxcHgpO2JhY2tncm91bmQtc2l6ZToyNHB4IDI0cHh9XHJcbmJvZHk6OmJlZm9yZXtjb250ZW50OlwiXCI7cG9zaXRpb246Zml4ZWQ7cmlnaHQ6LTEwdnc7dG9wOi0xOHZoO3dpZHRoOjcwdnc7aGVpZ2h0Ojcwdmg7cG9pbnRlci1ldmVudHM6bm9uZTt6LWluZGV4Oi0xO2ZpbHRlcjpibHVyKDUwcHgpO29wYWNpdHk6LjU1O2JhY2tncm91bmQ6cmFkaWFsLWdyYWRpZW50KGNsb3Nlc3Qtc2lkZSBhdCAyNSUgNDAlLCByZ2JhKDEyMyw0NCwyNDUsLjM1KSwgdHJhbnNwYXJlbnQgNjUlKSwgcmFkaWFsLWdyYWRpZW50KGNsb3Nlc3Qtc2lkZSBhdCA3MCUgNjAlLCByZ2JhKDQ0LDEzNywyNDUsLjI1KSwgdHJhbnNwYXJlbnQgNzAlKTttaXgtYmxlbmQtbW9kZTpzY3JlZW47YW5pbWF0aW9uOmF1cm9yYS1hIDE4cyBlYXNlLWluLW91dCBpbmZpbml0ZSBhbHRlcm5hdGV9XHJcbmJvZHk6OmFmdGVye2NvbnRlbnQ6XCJcIjtwb3NpdGlvbjpmaXhlZDtsZWZ0Oi0xMHZ3O2JvdHRvbTotMjJ2aDt3aWR0aDoxMjB2dztoZWlnaHQ6NjB2aDtwb2ludGVyLWV2ZW50czpub25lO3otaW5kZXg6LTE7ZmlsdGVyOmJsdXIoNjBweCk7b3BhY2l0eTouNzU7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoMTIwdncgNjB2aCBhdCA1MCUgMTAwJSwgcmdiYSg0NCwxMzcsMjQ1LC4yMiksIHRyYW5zcGFyZW50IDY1JSksIGNvbmljLWdyYWRpZW50KGZyb20gMjAwZGVnIGF0IDUwJSA3NSUsIHJnYmEoMTIzLDQ0LDI0NSwuMTgpLCByZ2JhKDQ0LDEzNywyNDUsLjEyKSwgdHJhbnNwYXJlbnQgNzAlKTttaXgtYmxlbmQtbW9kZTpzY3JlZW47YW5pbWF0aW9uOmF1cm9yYS1iIDIycyBlYXNlLWluLW91dCBpbmZpbml0ZSBhbHRlcm5hdGV9XHJcbkBrZXlmcmFtZXMgYXVyb3JhLWF7MCV7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoMCl9MTAwJXt0cmFuc2Zvcm06dHJhbnNsYXRlWSgxNHB4KX19XHJcbkBrZXlmcmFtZXMgYXVyb3JhLWJ7MCV7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoMCl9MTAwJXt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtMTJweCl9fVxyXG5gO1xyXG4gIGNvbnN0IHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcclxuICBzdHlsZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtdWknLCAnbWluZXItZ2FtZScpO1xyXG4gIHN0eWxlLnRleHRDb250ZW50ID0gY3NzO1xyXG4gIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xyXG4gIGluamVjdGVkID0gdHJ1ZTtcclxuXHJcbiAgLy8gc29mdCBzdGFyZmllbGQgYmFja2dyb3VuZCAodmVyeSBsaWdodClcclxuICB0cnkge1xyXG4gICAgY29uc3QgZXhpc3RzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtc3RhcnNdJyk7XHJcbiAgICBpZiAoIWV4aXN0cykge1xyXG4gICAgICBjb25zdCBjdnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuICAgICAgY3ZzLnNldEF0dHJpYnV0ZSgnZGF0YS1zdGFycycsICcnKTtcclxuICAgICAgY3ZzLnN0eWxlLmNzc1RleHQgPSAncG9zaXRpb246Zml4ZWQ7aW5zZXQ6MDt6LWluZGV4Oi0yO29wYWNpdHk6LjQwO3BvaW50ZXItZXZlbnRzOm5vbmU7JztcclxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjdnMpO1xyXG4gICAgICBjb25zdCBjdHggPSBjdnMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgY29uc3Qgc3RhcnMgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiA4MCB9LCAoKSA9PiAoeyB4OiBNYXRoLnJhbmRvbSgpLCB5OiBNYXRoLnJhbmRvbSgpLCByOiBNYXRoLnJhbmRvbSgpKjEuMiswLjIsIHM6IE1hdGgucmFuZG9tKCkqMC44KzAuMiB9KSk7XHJcbiAgICAgIHR5cGUgTWV0ZW9yID0geyB4OiBudW1iZXI7IHk6IG51bWJlcjsgdng6IG51bWJlcjsgdnk6IG51bWJlcjsgbGlmZTogbnVtYmVyOyB0dGw6IG51bWJlciB9O1xyXG4gICAgICBjb25zdCBtZXRlb3JzOiBNZXRlb3JbXSA9IFtdO1xyXG4gICAgICBjb25zdCBzcGF3bk1ldGVvciA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCB4ID0gTWF0aC5yYW5kb20oKSpjdnMud2lkdGgqMC42ICsgY3ZzLndpZHRoKjAuMjtcclxuICAgICAgICBjb25zdCB5ID0gLTIwOyAvLyBmcm9tIHRvcFxyXG4gICAgICAgIGNvbnN0IHNwZWVkID0gMyArIE1hdGgucmFuZG9tKCkqMztcclxuICAgICAgICBjb25zdCBhbmdsZSA9IE1hdGguUEkqMC44ICsgTWF0aC5yYW5kb20oKSowLjI7IC8vIGRpYWdvbmFsbHlcclxuICAgICAgICBtZXRlb3JzLnB1c2goeyB4LCB5LCB2eDogTWF0aC5jb3MoYW5nbGUpKnNwZWVkLCB2eTogTWF0aC5zaW4oYW5nbGUpKnNwZWVkLCBsaWZlOiAwLCB0dGw6IDEyMDAgKyBNYXRoLnJhbmRvbSgpKjgwMCB9KTtcclxuICAgICAgfTtcclxuICAgICAgLy8gZ2VudGxlIHBsYW5ldHMvb3Jic1xyXG4gICAgICBjb25zdCBvcmJzID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogMiB9LCAoKSA9PiAoeyB4OiBNYXRoLnJhbmRvbSgpLCB5OiBNYXRoLnJhbmRvbSgpKjAuNSArIDAuMSwgcjogTWF0aC5yYW5kb20oKSo4MCArIDcwLCBodWU6IE1hdGgucmFuZG9tKCkgfSkpO1xyXG4gICAgICBjb25zdCBmaXQgPSAoKSA9PiB7IGN2cy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoOyBjdnMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0OyB9O1xyXG4gICAgICBmaXQoKTtcclxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGZpdCk7XHJcbiAgICAgIGxldCB0ID0gMDtcclxuICAgICAgY29uc3QgbG9vcCA9ICgpID0+IHtcclxuICAgICAgICBpZiAoIWN0eCkgcmV0dXJuO1xyXG4gICAgICAgIHQgKz0gMC4wMTY7XHJcbiAgICAgICAgY3R4LmNsZWFyUmVjdCgwLDAsY3ZzLndpZHRoLGN2cy5oZWlnaHQpO1xyXG4gICAgICAgIC8vIHNvZnQgb3Jic1xyXG4gICAgICAgIGZvciAoY29uc3Qgb2Igb2Ygb3Jicykge1xyXG4gICAgICAgICAgY29uc3QgeCA9IG9iLnggKiBjdnMud2lkdGgsIHkgPSBvYi55ICogY3ZzLmhlaWdodDtcclxuICAgICAgICAgIGNvbnN0IHB1bHNlID0gKE1hdGguc2luKHQqMC42ICsgeCowLjAwMTUpKjAuNSswLjUpKjAuMTI7XHJcbiAgICAgICAgICBjb25zdCByYWQgPSBvYi5yICogKDErcHVsc2UpO1xyXG4gICAgICAgICAgY29uc3QgZ3JhZCA9IGN0eC5jcmVhdGVSYWRpYWxHcmFkaWVudCh4LCB5LCAwLCB4LCB5LCByYWQpO1xyXG4gICAgICAgICAgZ3JhZC5hZGRDb2xvclN0b3AoMCwgJ3JnYmEoMTEwLDgwLDI1NSwwLjEwKScpO1xyXG4gICAgICAgICAgZ3JhZC5hZGRDb2xvclN0b3AoMSwgJ3JnYmEoMCwwLDAsMCknKTtcclxuICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBncmFkO1xyXG4gICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgY3R4LmFyYyh4LCB5LCByYWQsIDAsIE1hdGguUEkqMik7XHJcbiAgICAgICAgICBjdHguZmlsbCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBzdGFycyB0d2lua2xlXHJcbiAgICAgICAgZm9yIChjb25zdCBzdCBvZiBzdGFycykge1xyXG4gICAgICAgICAgY29uc3QgeCA9IHN0LnggKiBjdnMud2lkdGgsIHkgPSBzdC55ICogY3ZzLmhlaWdodDtcclxuICAgICAgICAgIGNvbnN0IHR3ID0gKE1hdGguc2luKHQqMS42ICsgeCowLjAwMiArIHkqMC4wMDMpKjAuNSswLjUpKjAuNSswLjU7XHJcbiAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICBjdHguYXJjKHgsIHksIHN0LnIgKyB0dyowLjYsIDAsIE1hdGguUEkqMik7XHJcbiAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3JnYmEoMTgwLDIwMCwyNTUsMC42KSc7XHJcbiAgICAgICAgICBjdHguZmlsbCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBtZXRlb3JzXHJcbiAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPCAwLjAxNSAmJiBtZXRlb3JzLmxlbmd0aCA8IDIpIHNwYXduTWV0ZW9yKCk7XHJcbiAgICAgICAgZm9yIChsZXQgaT1tZXRlb3JzLmxlbmd0aC0xOyBpPj0wOyBpLS0pIHtcclxuICAgICAgICAgIGNvbnN0IG0gPSBtZXRlb3JzW2ldO1xyXG4gICAgICAgICAgbS54ICs9IG0udng7IG0ueSArPSBtLnZ5OyBtLmxpZmUgKz0gMTY7XHJcbiAgICAgICAgICAvLyB0cmFpbFxyXG4gICAgICAgICAgY29uc3QgdHJhaWwgPSBjdHguY3JlYXRlTGluZWFyR3JhZGllbnQobS54LCBtLnksIG0ueCAtIG0udngqOCwgbS55IC0gbS52eSo4KTtcclxuICAgICAgICAgIHRyYWlsLmFkZENvbG9yU3RvcCgwLCAncmdiYSgyNTUsMjU1LDI1NSwwLjkpJyk7XHJcbiAgICAgICAgICB0cmFpbC5hZGRDb2xvclN0b3AoMSwgJ3JnYmEoMTUwLDE4MCwyNTUsMCknKTtcclxuICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHRyYWlsO1xyXG4gICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IDI7XHJcbiAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICBjdHgubW92ZVRvKG0ueCAtIG0udngqMTAsIG0ueSAtIG0udnkqMTApO1xyXG4gICAgICAgICAgY3R4LmxpbmVUbyhtLngsIG0ueSk7XHJcbiAgICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICAgICAgICBpZiAobS55ID4gY3ZzLmhlaWdodCArIDQwIHx8IG0ueCA8IC00MCB8fCBtLnggPiBjdnMud2lkdGggKyA0MCB8fCBtLmxpZmUgPiBtLnR0bCkge1xyXG4gICAgICAgICAgICBtZXRlb3JzLnNwbGljZShpLDEpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcCk7XHJcbiAgICAgIH07XHJcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wKTtcclxuICAgIH1cclxuICB9IGNhdGNoIHt9XHJcbn1cclxuIiwgImltcG9ydCB7IExvZ2luU2NlbmUgfSBmcm9tICcuL3NjZW5lcy9Mb2dpblNjZW5lJztcbmltcG9ydCB7IE1haW5TY2VuZSB9IGZyb20gJy4vc2NlbmVzL01haW5TY2VuZSc7XG5pbXBvcnQgeyBHYW1lTWFuYWdlciB9IGZyb20gJy4vY29yZS9HYW1lTWFuYWdlcic7XG5pbXBvcnQgeyBXYXJlaG91c2VTY2VuZSB9IGZyb20gJy4vc2NlbmVzL1dhcmVob3VzZVNjZW5lJztcbmltcG9ydCB7IFBsdW5kZXJTY2VuZSB9IGZyb20gJy4vc2NlbmVzL1BsdW5kZXJTY2VuZSc7XG5pbXBvcnQgeyBFeGNoYW5nZVNjZW5lIH0gZnJvbSAnLi9zY2VuZXMvRXhjaGFuZ2VTY2VuZSc7XG5pbXBvcnQgeyBSYW5raW5nU2NlbmUgfSBmcm9tICcuL3NjZW5lcy9SYW5raW5nU2NlbmUnO1xuaW1wb3J0IHsgZW5zdXJlR2xvYmFsU3R5bGVzIH0gZnJvbSAnLi9zdHlsZXMvaW5qZWN0JztcblxuZnVuY3Rpb24gcm91dGVUbyhjb250YWluZXI6IEhUTUxFbGVtZW50KSB7XG4gIGNvbnN0IGggPSBsb2NhdGlvbi5oYXNoIHx8ICcjL2xvZ2luJztcbiAgY29uc3Qgc2NlbmUgPSBoLnNwbGl0KCc/JylbMF07XG4gIHN3aXRjaCAoc2NlbmUpIHtcbiAgICBjYXNlICcjL21haW4nOlxuICAgICAgbmV3IE1haW5TY2VuZSgpLm1vdW50KGNvbnRhaW5lcik7XG4gICAgICBicmVhaztcbiAgICBjYXNlICcjL3dhcmVob3VzZSc6XG4gICAgICBuZXcgV2FyZWhvdXNlU2NlbmUoKS5tb3VudChjb250YWluZXIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnIy9wbHVuZGVyJzpcbiAgICAgIG5ldyBQbHVuZGVyU2NlbmUoKS5tb3VudChjb250YWluZXIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnIy9leGNoYW5nZSc6XG4gICAgICBuZXcgRXhjaGFuZ2VTY2VuZSgpLm1vdW50KGNvbnRhaW5lcik7XG4gICAgICBicmVhaztcbiAgICBjYXNlICcjL3JhbmtpbmcnOlxuICAgICAgbmV3IFJhbmtpbmdTY2VuZSgpLm1vdW50KGNvbnRhaW5lcik7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgbmV3IExvZ2luU2NlbmUoKS5tb3VudChjb250YWluZXIpO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBib290c3RyYXAoY29udGFpbmVyOiBIVE1MRWxlbWVudCkge1xuICAvLyBcdTdBQ0JcdTUzNzNcdTZDRThcdTUxNjVcdTY4MzdcdTVGMEZcdUZGMENcdTkwN0ZcdTUxNERGT1VDXHVGRjA4XHU5NUVBXHU3MEMxXHVGRjA5XG4gIGVuc3VyZUdsb2JhbFN0eWxlcygpO1xuICBcbiAgLy8gXHU1QzFEXHU4QkQ1XHU2MDYyXHU1OTBEXHU0RjFBXHU4QkREXG4gIGNvbnN0IHJlc3RvcmVkID0gYXdhaXQgR2FtZU1hbmFnZXIuSS50cnlSZXN0b3JlU2Vzc2lvbigpO1xuICBcbiAgLy8gXHU1OTgyXHU2NzlDXHU2NzA5XHU2NzA5XHU2NTQ4dG9rZW5cdTRFMTRcdTVGNTNcdTUyNERcdTU3MjhcdTc2N0JcdTVGNTVcdTk4NzVcdUZGMENcdThERjNcdThGNkNcdTUyMzBcdTRFM0JcdTk4NzVcbiAgaWYgKHJlc3RvcmVkICYmIChsb2NhdGlvbi5oYXNoID09PSAnJyB8fCBsb2NhdGlvbi5oYXNoID09PSAnIy9sb2dpbicpKSB7XG4gICAgbG9jYXRpb24uaGFzaCA9ICcjL21haW4nO1xuICB9XG4gIFxuICAvLyBcdTRGN0ZcdTc1MjggcmVxdWVzdEFuaW1hdGlvbkZyYW1lIFx1Nzg2RVx1NEZERFx1NjgzN1x1NUYwRlx1NURGMlx1NUU5NFx1NzUyOFxuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgIHJvdXRlVG8oY29udGFpbmVyKTtcbiAgfSk7XG4gIFxuICB3aW5kb3cub25oYXNoY2hhbmdlID0gKCkgPT4gcm91dGVUbyhjb250YWluZXIpO1xufVxuXG4vLyBcdTRGQkZcdTYzNzdcdTU0MkZcdTUyQThcdUZGMDhcdTdGNTFcdTk4NzVcdTczQUZcdTU4ODNcdUZGMDlcbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAod2luZG93IGFzIGFueSkuTWluZXJBcHAgPSB7IGJvb3RzdHJhcCwgR2FtZU1hbmFnZXIgfTtcbn1cblxuXG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7QUFBTyxNQUFNLGtCQUFOLE1BQU0sZ0JBQWU7QUFBQSxJQU0xQixjQUFjO0FBRmQsMEJBQVEsU0FBdUI7QUFJN0IsV0FBSyxRQUFRLGFBQWEsUUFBUSxZQUFZO0FBQUEsSUFDaEQ7QUFBQSxJQVBBLFdBQVcsSUFBb0I7QUFGakM7QUFFbUMsY0FBTyxVQUFLLGNBQUwsWUFBbUIsS0FBSyxZQUFZLElBQUksZ0JBQWU7QUFBQSxJQUFJO0FBQUEsSUFTbkcsU0FBUyxHQUFrQjtBQUN6QixXQUFLLFFBQVE7QUFDYixVQUFJLEdBQUc7QUFDTCxxQkFBYSxRQUFRLGNBQWMsQ0FBQztBQUFBLE1BQ3RDLE9BQU87QUFDTCxxQkFBYSxXQUFXLFlBQVk7QUFBQSxNQUN0QztBQUFBLElBQ0Y7QUFBQSxJQUVBLFdBQTBCO0FBQ3hCLGFBQU8sS0FBSztBQUFBLElBQ2Q7QUFBQSxJQUVBLGFBQWE7QUFDWCxXQUFLLFNBQVMsSUFBSTtBQUFBLElBQ3BCO0FBQUEsSUFFQSxNQUFNLFFBQVcsTUFBYyxNQUFnQztBQUM3RCxZQUFNLFVBQWUsRUFBRSxnQkFBZ0Isb0JBQW9CLElBQUksNkJBQU0sWUFBVyxDQUFDLEVBQUc7QUFDcEYsVUFBSSxLQUFLLE1BQU8sU0FBUSxlQUFlLElBQUksVUFBVSxLQUFLLEtBQUs7QUFDL0QsWUFB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
