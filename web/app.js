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
      try {
        const res = await fetch(this.getBase() + path, { ...init, headers });
        const json = await res.json();
        if (res.status === 401) {
          this.clearToken();
          if (location.hash !== "#/login") {
            location.hash = "#/login";
          }
          throw new Error("\u767B\u5F55\u5DF2\u8FC7\u671F\uFF0C\u8BF7\u91CD\u65B0\u767B\u5F55");
        }
        if (!res.ok || json.code >= 400) {
          throw new Error(json.message || "Request Error");
        }
        return json.data;
      } catch (error) {
        if (error instanceof TypeError && error.message.includes("fetch")) {
          throw new Error("\u7F51\u7EDC\u8FDE\u63A5\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC\u6216\u540E\u7AEF\u670D\u52A1");
        }
        throw error;
      }
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
        if (go.disabled) return;
        const username = (uEl.value || "").trim();
        const password = (pEl.value || "").trim();
        if (!username || !password) {
          showToast("\u8BF7\u586B\u5199\u7528\u6237\u540D\u548C\u5BC6\u7801", "warn");
          return;
        }
        if (username.length < 3 || username.length > 20) {
          showToast("\u7528\u6237\u540D\u957F\u5EA6\u5E94\u5728 3-20 \u4E2A\u5B57\u7B26\u4E4B\u95F4", "warn");
          return;
        }
        if (password.length < 3) {
          showToast("\u5BC6\u7801\u81F3\u5C11\u9700\u8981 3 \u4E2A\u5B57\u7B26", "warn");
          return;
        }
        go.disabled = true;
        const originalHTML2 = go.innerHTML;
        go.innerHTML = '<span data-ico="arrow-right"></span>\u767B\u5F55\u4E2D\u2026';
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
        try {
          await GameManager.I.loginOrRegister(username, password);
          location.hash = "#/main";
        } catch (e) {
          showToast((e == null ? void 0 : e.message) || "\u767B\u5F55\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5", "error");
          go.innerHTML = originalHTML2;
          try {
            view.querySelectorAll("[data-ico]").forEach((el) => {
              const name = el.getAttribute("data-ico");
              try {
                el.appendChild(renderIcon(name, { size: 20 }));
              } catch (e2) {
              }
            });
          } catch (e2) {
          }
        } finally {
          go.disabled = false;
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
        if (this.socket && (this.socket.connected || this.socket.connecting)) {
          return;
        }
        if (this.socket) {
          try {
            this.socket.disconnect();
          } catch (e) {
            console.warn("[RealtimeClient] Disconnect error:", e);
          }
        }
        this.socket = w.io(WS_ENDPOINT, { auth: { token } });
        this.socket.on("connect", () => {
          console.log("[RealtimeClient] Connected to WebSocket");
        });
        this.socket.on("disconnect", () => {
          console.log("[RealtimeClient] Disconnected from WebSocket");
        });
        this.socket.on("connect_error", (error) => {
          console.error("[RealtimeClient] Connection error:", error);
        });
        this.socket.onAny((event, payload) => {
          console.log("[RealtimeClient] Event received:", event, payload);
          this.emitLocal(event, payload);
        });
      } else {
        console.warn("[RealtimeClient] socket.io not loaded");
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
      const token = NetworkManager.I.getToken();
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
      const token = NetworkManager.I.getToken();
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
              const btn = ev.target.closest("button");
              if (!btn) return;
              const id = btn.getAttribute("data-id");
              const act = btn.getAttribute("data-act");
              if (!id || !act) return;
              if (btn.disabled && act !== "toggle") return;
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
                btn.disabled = true;
                const originalHTML2 = btn.innerHTML;
                if (act === "equip") {
                  btn.innerHTML = '<span data-ico="shield"></span>\u88C5\u5907\u4E2D\u2026';
                  mountIcons(btn);
                  await NetworkManager.I.request("/items/equip", { method: "POST", body: JSON.stringify({ itemId: id }) });
                  showToast("\u88C5\u5907\u6210\u529F", "success");
                } else if (act === "unequip") {
                  btn.innerHTML = '<span data-ico="x"></span>\u5378\u4E0B\u4E2D\u2026';
                  mountIcons(btn);
                  await NetworkManager.I.request("/items/unequip", { method: "POST", body: JSON.stringify({ itemId: id }) });
                  showToast("\u5378\u4E0B\u6210\u529F", "success");
                } else if (act === "upgrade") {
                  btn.innerHTML = '<span data-ico="wrench"></span>\u5347\u7EA7\u4E2D\u2026';
                  mountIcons(btn);
                  const res = await NetworkManager.I.request("/items/upgrade", { method: "POST", body: JSON.stringify({ itemId: id }) });
                  row.classList.add("upgrade-success");
                  setTimeout(() => row.classList.remove("upgrade-success"), 1e3);
                  showToast(`\u5347\u7EA7\u6210\u529F\uFF01\u7B49\u7EA7 ${res.level}\uFF08\u6D88\u8017 ${res.cost} \u77FF\u77F3\uFF09`, "success");
                }
                await bar.update();
                await load();
              } catch (e) {
                showToast((e == null ? void 0 : e.message) || "\u64CD\u4F5C\u5931\u8D25", "error");
                btn.innerHTML = originalHTML;
                btn.disabled = false;
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
          showToast((e == null ? void 0 : e.message) || "\u52A0\u8F7D\u4ED3\u5E93\u5931\u8D25", "error");
          list.innerHTML = '<div style="opacity:.8;text-align:center;padding:20px;">\u52A0\u8F7D\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5</div>';
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
      const token = NetworkManager.I.getToken();
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
              const btn = el.closest("button");
              if (!btn) return;
              btn.disabled = true;
              const originalHTML2 = btn.innerHTML;
              btn.innerHTML = '<span data-ico="sword"></span>\u63A0\u593A\u4E2D\u2026';
              mountIcons(btn);
              let shouldRefresh = false;
              try {
                const res = await NetworkManager.I.request(`/plunder/${id}`, { method: "POST" });
                if (res.success) {
                  this.log(`\u6210\u529F\u63A0\u593A ${id}\uFF0C\u83B7\u5F97 ${res.loot_amount}`);
                  showToast(`\u63A0\u593A\u6210\u529F\uFF0C\u83B7\u5F97 ${res.loot_amount} \u77FF\u77F3`, "success");
                  shouldRefresh = true;
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
                btn.innerHTML = originalHTML2;
                mountIcons(btn);
              } finally {
                btn.disabled = false;
                if (shouldRefresh) {
                  await load();
                }
              }
            });
            list.appendChild(row);
          }
        } catch (e) {
          showToast((e == null ? void 0 : e.message) || "\u52A0\u8F7D\u63A0\u593A\u76EE\u6807\u5931\u8D25", "error");
          list.innerHTML = '<div style="opacity:.8;text-align:center;padding:20px;">\u52A0\u8F7D\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5</div>';
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
      const token = NetworkManager.I.getToken();
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
              const btn = target.closest("button");
              if (!btn) return;
              try {
                btn.disabled = true;
                const originalHTML2 = btn.innerHTML;
                btn.innerHTML = '<span data-ico="trash"></span>\u64A4\u5355\u4E2D\u2026';
                mountIcons(btn);
                await NetworkManager.I.request(`/exchange/orders/${id}`, { method: "DELETE" });
                showToast("\u64A4\u5355\u6210\u529F", "success");
                await refresh();
              } catch (e) {
                showToast((e == null ? void 0 : e.message) || "\u64A4\u5355\u5931\u8D25", "error");
                await refresh();
              } finally {
                btn.disabled = false;
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
        if (placeBuy.disabled) return;
        const tplId = buyTpl.value.trim();
        const price = Number(buyPrice.value);
        const amount = Number(buyAmount.value);
        if (!tplId) {
          showToast("\u8BF7\u9009\u62E9\u8D2D\u4E70\u7684\u6A21\u677F", "warn");
          return;
        }
        if (isNaN(price) || isNaN(amount) || price <= 0 || amount <= 0 || !Number.isInteger(amount)) {
          showToast("\u8BF7\u8F93\u5165\u6709\u6548\u7684\u4EF7\u683C\u4E0E\u6570\u91CF\uFF08\u6570\u91CF\u5FC5\u987B\u4E3A\u6574\u6570\uFF09", "warn");
          return;
        }
        if (price > 1e6 || amount > 1e4) {
          showToast("\u6570\u503C\u8FC7\u5927\uFF0C\u8BF7\u8F93\u5165\u5408\u7406\u7684\u4EF7\u683C\u548C\u6570\u91CF", "warn");
          return;
        }
        placeBuy.disabled = true;
        const originalBuyHTML = placeBuy.innerHTML;
        placeBuy.innerHTML = '<span data-ico="arrow-right"></span>\u63D0\u4EA4\u4E2D\u2026';
        mountIcons(placeBuy);
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
          placeBuy.innerHTML = originalBuyHTML;
          mountIcons(placeBuy);
        }
      };
      placeSell.onclick = async () => {
        if (placeSell.disabled) return;
        const instId = sellInst.value.trim();
        const price = Number(sellPrice.value);
        if (!instId) {
          showToast("\u8BF7\u9009\u62E9\u8981\u51FA\u552E\u7684\u9053\u5177", "warn");
          return;
        }
        if (isNaN(price) || price <= 0) {
          showToast("\u8BF7\u8F93\u5165\u6709\u6548\u7684\u4EF7\u683C", "warn");
          return;
        }
        if (price > 1e6) {
          showToast("\u4EF7\u683C\u8FC7\u9AD8\uFF0C\u8BF7\u8F93\u5165\u5408\u7406\u7684\u4EF7\u683C", "warn");
          return;
        }
        placeSell.disabled = true;
        const originalSellHTML = placeSell.innerHTML;
        placeSell.innerHTML = '<span data-ico="arrow-right"></span>\u63D0\u4EA4\u4E2D\u2026';
        mountIcons(placeSell);
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
          placeSell.innerHTML = originalSellHTML;
          mountIcons(placeSell);
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
      const token = NetworkManager.I.getToken();
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
          list.innerHTML = '<div style="opacity:.8;text-align:center;padding:20px;">\u52A0\u8F7D\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5</div>';
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vZnJvbnRlbmQtc2NyaXB0cy9jb3JlL05ldHdvcmtNYW5hZ2VyLnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvY29yZS9HYW1lTWFuYWdlci50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL3V0aWxzL2RvbS50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvbXBvbmVudHMvSWNvbi50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvbXBvbmVudHMvVG9hc3QudHMiLCAiLi4vZnJvbnRlbmQtc2NyaXB0cy9zY2VuZXMvTG9naW5TY2VuZS50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvcmUvRW52LnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvY29yZS9SZWFsdGltZUNsaWVudC50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvbXBvbmVudHMvTmF2LnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvY29tcG9uZW50cy9Db3VudFVwVGV4dC50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvbXBvbmVudHMvUmVzb3VyY2VCYXIudHMiLCAiLi4vZnJvbnRlbmQtc2NyaXB0cy9zY2VuZXMvTWFpblNjZW5lLnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvc2NlbmVzL1dhcmVob3VzZVNjZW5lLnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvc2NlbmVzL1BsdW5kZXJTY2VuZS50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL3NjZW5lcy9FeGNoYW5nZVNjZW5lLnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvc2NlbmVzL1JhbmtpbmdTY2VuZS50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL3N0eWxlcy9pbmplY3QudHMiLCAiLi4vZnJvbnRlbmQtc2NyaXB0cy9BcHAudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImV4cG9ydCBjbGFzcyBOZXR3b3JrTWFuYWdlciB7XHJcbiAgcHJpdmF0ZSBzdGF0aWMgX2luc3RhbmNlOiBOZXR3b3JrTWFuYWdlcjtcclxuICBzdGF0aWMgZ2V0IEkoKTogTmV0d29ya01hbmFnZXIgeyByZXR1cm4gdGhpcy5faW5zdGFuY2UgPz8gKHRoaXMuX2luc3RhbmNlID0gbmV3IE5ldHdvcmtNYW5hZ2VyKCkpOyB9XHJcblxyXG4gIHByaXZhdGUgdG9rZW46IHN0cmluZyB8IG51bGwgPSBudWxsO1xyXG4gIFxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgLy8gXHU0RUNFIGxvY2FsU3RvcmFnZSBcdTYwNjJcdTU5MEQgdG9rZW5cclxuICAgIHRoaXMudG9rZW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYXV0aF90b2tlbicpO1xyXG4gIH1cclxuICBcclxuICBzZXRUb2tlbih0OiBzdHJpbmcgfCBudWxsKSB7IFxyXG4gICAgdGhpcy50b2tlbiA9IHQ7XHJcbiAgICBpZiAodCkge1xyXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnYXV0aF90b2tlbicsIHQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ2F1dGhfdG9rZW4nKTtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgZ2V0VG9rZW4oKTogc3RyaW5nIHwgbnVsbCB7XHJcbiAgICByZXR1cm4gdGhpcy50b2tlbjtcclxuICB9XHJcbiAgXHJcbiAgY2xlYXJUb2tlbigpIHtcclxuICAgIHRoaXMuc2V0VG9rZW4obnVsbCk7XHJcbiAgfVxyXG5cclxuICBhc3luYyByZXF1ZXN0PFQ+KHBhdGg6IHN0cmluZywgaW5pdD86IFJlcXVlc3RJbml0KTogUHJvbWlzZTxUPiB7XHJcbiAgICBjb25zdCBoZWFkZXJzOiBhbnkgPSB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsIC4uLihpbml0Py5oZWFkZXJzIHx8IHt9KSB9O1xyXG4gICAgaWYgKHRoaXMudG9rZW4pIGhlYWRlcnNbJ0F1dGhvcml6YXRpb24nXSA9IGBCZWFyZXIgJHt0aGlzLnRva2VufWA7XHJcbiAgICBcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKHRoaXMuZ2V0QmFzZSgpICsgcGF0aCwgeyAuLi5pbml0LCBoZWFkZXJzIH0pO1xyXG4gICAgICBjb25zdCBqc29uID0gYXdhaXQgcmVzLmpzb24oKTtcclxuICAgICAgXHJcbiAgICAgIC8vIDQwMSBcdTY3MkFcdTYzODhcdTY3NDNcdUZGMENcdTZFMDVcdTk2NjQgdG9rZW4gXHU1RTc2XHU4REYzXHU4RjZDXHU3NjdCXHU1RjU1XHJcbiAgICAgIGlmIChyZXMuc3RhdHVzID09PSA0MDEpIHtcclxuICAgICAgICB0aGlzLmNsZWFyVG9rZW4oKTtcclxuICAgICAgICBpZiAobG9jYXRpb24uaGFzaCAhPT0gJyMvbG9naW4nKSB7XHJcbiAgICAgICAgICBsb2NhdGlvbi5oYXNoID0gJyMvbG9naW4nO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1x1NzY3Qlx1NUY1NVx1NURGMlx1OEZDN1x1NjcxRlx1RkYwQ1x1OEJGN1x1OTFDRFx1NjVCMFx1NzY3Qlx1NUY1NScpO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICBpZiAoIXJlcy5vayB8fCBqc29uLmNvZGUgPj0gNDAwKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGpzb24ubWVzc2FnZSB8fCAnUmVxdWVzdCBFcnJvcicpO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICByZXR1cm4ganNvbi5kYXRhIGFzIFQ7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAvLyBcdTdGNTFcdTdFRENcdTk1MTlcdThCRUZcdTU5MDRcdTc0MDZcclxuICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgVHlwZUVycm9yICYmIGVycm9yLm1lc3NhZ2UuaW5jbHVkZXMoJ2ZldGNoJykpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1x1N0Y1MVx1N0VEQ1x1OEZERVx1NjNBNVx1NTkzMVx1OEQyNVx1RkYwQ1x1OEJGN1x1NjhDMFx1NjdFNVx1N0Y1MVx1N0VEQ1x1NjIxNlx1NTQwRVx1N0FFRlx1NjcwRFx1NTJBMScpO1xyXG4gICAgICB9XHJcbiAgICAgIHRocm93IGVycm9yO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0QmFzZSgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuICh3aW5kb3cgYXMgYW55KS5fX0FQSV9CQVNFX18gfHwgJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGknO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbiIsICJpbXBvcnQgeyBOZXR3b3JrTWFuYWdlciB9IGZyb20gJy4vTmV0d29ya01hbmFnZXInO1xyXG5cclxuZXhwb3J0IHR5cGUgUHJvZmlsZSA9IHsgaWQ6IHN0cmluZzsgdXNlcm5hbWU6IHN0cmluZzsgbmlja25hbWU6IHN0cmluZzsgb3JlQW1vdW50OiBudW1iZXI7IGJiQ29pbnM6IG51bWJlciB9O1xyXG5cclxuZXhwb3J0IGNsYXNzIEdhbWVNYW5hZ2VyIHtcclxuICBwcml2YXRlIHN0YXRpYyBfaW5zdGFuY2U6IEdhbWVNYW5hZ2VyO1xyXG4gIHN0YXRpYyBnZXQgSSgpOiBHYW1lTWFuYWdlciB7IHJldHVybiB0aGlzLl9pbnN0YW5jZSA/PyAodGhpcy5faW5zdGFuY2UgPSBuZXcgR2FtZU1hbmFnZXIoKSk7IH1cclxuXHJcbiAgcHJpdmF0ZSBwcm9maWxlOiBQcm9maWxlIHwgbnVsbCA9IG51bGw7XHJcbiAgZ2V0UHJvZmlsZSgpOiBQcm9maWxlIHwgbnVsbCB7IHJldHVybiB0aGlzLnByb2ZpbGU7IH1cclxuXHJcbiAgYXN5bmMgbG9naW5PclJlZ2lzdGVyKHVzZXJuYW1lOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIGNvbnN0IG5tID0gTmV0d29ya01hbmFnZXIuSTtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHIgPSBhd2FpdCBubS5yZXF1ZXN0PHsgYWNjZXNzX3Rva2VuOiBzdHJpbmc7IHVzZXI6IGFueSB9PignL2F1dGgvbG9naW4nLCB7IG1ldGhvZDogJ1BPU1QnLCBib2R5OiBKU09OLnN0cmluZ2lmeSh7IHVzZXJuYW1lLCBwYXNzd29yZCB9KSB9KTtcclxuICAgICAgbm0uc2V0VG9rZW4oci5hY2Nlc3NfdG9rZW4pO1xyXG4gICAgfSBjYXRjaCB7XHJcbiAgICAgIGNvbnN0IHIgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyBhY2Nlc3NfdG9rZW46IHN0cmluZzsgdXNlcjogYW55IH0+KCcvYXV0aC9yZWdpc3RlcicsIHsgbWV0aG9kOiAnUE9TVCcsIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgdXNlcm5hbWUsIHBhc3N3b3JkIH0pIH0pO1xyXG4gICAgICBOZXR3b3JrTWFuYWdlci5JLnNldFRva2VuKHIuYWNjZXNzX3Rva2VuKTtcclxuICAgIH1cclxuICAgIHRoaXMucHJvZmlsZSA9IGF3YWl0IG5tLnJlcXVlc3Q8UHJvZmlsZT4oJy91c2VyL3Byb2ZpbGUnKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIHRyeVJlc3RvcmVTZXNzaW9uKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgY29uc3Qgbm0gPSBOZXR3b3JrTWFuYWdlci5JO1xyXG4gICAgY29uc3QgdG9rZW4gPSBubS5nZXRUb2tlbigpO1xyXG4gICAgaWYgKCF0b2tlbikgcmV0dXJuIGZhbHNlO1xyXG4gICAgXHJcbiAgICB0cnkge1xyXG4gICAgICB0aGlzLnByb2ZpbGUgPSBhd2FpdCBubS5yZXF1ZXN0PFByb2ZpbGU+KCcvdXNlci9wcm9maWxlJyk7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSBjYXRjaCB7XHJcbiAgICAgIC8vIFRva2VuIFx1NTkzMVx1NjU0OFx1RkYwQ1x1NkUwNVx1OTY2NFxyXG4gICAgICBubS5jbGVhclRva2VuKCk7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGxvZ291dCgpIHtcclxuICAgIE5ldHdvcmtNYW5hZ2VyLkkuY2xlYXJUb2tlbigpO1xyXG4gICAgdGhpcy5wcm9maWxlID0gbnVsbDtcclxuICAgIGxvY2F0aW9uLmhhc2ggPSAnIy9sb2dpbic7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuIiwgImV4cG9ydCBmdW5jdGlvbiBodG1sKHRlbXBsYXRlOiBzdHJpbmcpOiBIVE1MRWxlbWVudCB7XHJcbiAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgZGl2LmlubmVySFRNTCA9IHRlbXBsYXRlLnRyaW0oKTtcclxuICByZXR1cm4gZGl2LmZpcnN0RWxlbWVudENoaWxkIGFzIEhUTUxFbGVtZW50O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcXM8VCBleHRlbmRzIEVsZW1lbnQgPSBIVE1MRWxlbWVudD4ocm9vdDogUGFyZW50Tm9kZSwgc2VsOiBzdHJpbmcpOiBUIHtcclxuICBjb25zdCBlbCA9IHJvb3QucXVlcnlTZWxlY3RvcihzZWwpIGFzIFQgfCBudWxsO1xyXG4gIGlmICghZWwpIHRocm93IG5ldyBFcnJvcihgTWlzc2luZyBlbGVtZW50OiAke3NlbH1gKTtcclxuICByZXR1cm4gZWwgYXMgVDtcclxufVxyXG5cclxuXHJcbiIsICJpbXBvcnQgeyBodG1sIH0gZnJvbSAnLi4vdXRpbHMvZG9tJztcblxuZXhwb3J0IHR5cGUgSWNvbk5hbWUgPVxuICB8ICdob21lJ1xuICB8ICd3YXJlaG91c2UnXG4gIHwgJ3BsdW5kZXInXG4gIHwgJ2V4Y2hhbmdlJ1xuICB8ICdyYW5raW5nJ1xuICB8ICdvcmUnXG4gIHwgJ2NvaW4nXG4gIHwgJ3BpY2snXG4gIHwgJ3JlZnJlc2gnXG4gIHwgJ3BsYXknXG4gIHwgJ3N0b3AnXG4gIHwgJ2NvbGxlY3QnXG4gIHwgJ3dyZW5jaCdcbiAgfCAnc2hpZWxkJ1xuICB8ICdsaXN0J1xuICB8ICd1c2VyJ1xuICB8ICdsb2NrJ1xuICB8ICdleWUnXG4gIHwgJ2V5ZS1vZmYnXG4gIHwgJ3N3b3JkJ1xuICB8ICd0cm9waHknXG4gIHwgJ2Nsb2NrJ1xuICB8ICdib2x0J1xuICB8ICd0cmFzaCdcbiAgfCAnY2xvc2UnXG4gIHwgJ2Fycm93LXJpZ2h0J1xuICB8ICd0YXJnZXQnXG4gIHwgJ2JveCdcbiAgfCAnaW5mbydcbiAgfCAnbG9nb3V0J1xuICB8ICd4JztcblxuZnVuY3Rpb24gZ3JhZChpZDogc3RyaW5nKSB7XG4gIHJldHVybiBgPGRlZnM+XG4gICAgPGxpbmVhckdyYWRpZW50IGlkPVwiJHtpZH1cIiB4MT1cIjBcIiB5MT1cIjBcIiB4Mj1cIjFcIiB5Mj1cIjFcIj5cbiAgICAgIDxzdG9wIG9mZnNldD1cIjAlXCIgc3RvcC1jb2xvcj1cIiM3QjJDRjVcIiAvPlxuICAgICAgPHN0b3Agb2Zmc2V0PVwiMTAwJVwiIHN0b3AtY29sb3I9XCIjMkM4OUY1XCIgLz5cbiAgICA8L2xpbmVhckdyYWRpZW50PlxuICA8L2RlZnM+YDtcbn1cblxuZnVuY3Rpb24gc3ZnV3JhcChwYXRoOiBzdHJpbmcsIHNpemUgPSAxOCwgY2xzID0gJycpOiBIVE1MRWxlbWVudCB7XG4gIGNvbnN0IGdpZCA9ICdpZy0nICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc2xpY2UoMiwgOCk7XG4gIGNvbnN0IGVsID0gaHRtbChgPHNwYW4gY2xhc3M9XCJpY29uICR7Y2xzfVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPiR7XG4gICAgYDxzdmcgd2lkdGg9XCIke3NpemV9XCIgaGVpZ2h0PVwiJHtzaXplfVwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj4ke2dyYWQoZ2lkKX0ke3BhdGgucmVwbGFjZUFsbCgnX19HUkFEX18nLCBgdXJsKCMke2dpZH0pYCl9PC9zdmc+YFxuICB9PC9zcGFuPmApO1xuICByZXR1cm4gZWw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJJY29uKG5hbWU6IEljb25OYW1lLCBvcHRzOiB7IHNpemU/OiBudW1iZXI7IGNsYXNzTmFtZT86IHN0cmluZyB9ID0ge30pIHtcbiAgY29uc3Qgc2l6ZSA9IG9wdHMuc2l6ZSA/PyAxODtcbiAgY29uc3QgY2xzID0gb3B0cy5jbGFzc05hbWUgPz8gJyc7XG4gIGNvbnN0IHN0cm9rZSA9ICdzdHJva2U9XCJfX0dSQURfX1wiIHN0cm9rZS13aWR0aD1cIjEuN1wiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiJztcbiAgY29uc3QgZmlsbCA9ICdmaWxsPVwiX19HUkFEX19cIic7XG5cbiAgc3dpdGNoIChuYW1lKSB7XG4gICAgY2FzZSAnaG9tZSc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0zIDEwLjVMMTIgM2w5IDcuNVwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk01LjUgOS41VjIxaDEzVjkuNVwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk05LjUgMjF2LTZoNXY2XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ3dhcmVob3VzZSc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0zIDlsOS01IDkgNXY5LjVjMCAxLTEgMi0yIDJINWMtMSAwLTItMS0yLTJWOXpcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNNyAxMmgxME03IDE2aDEwXCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ3BsdW5kZXInOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNNCAyMGw3LTdNMTMgMTNsNyA3TTkgNWw2IDZNMTUgNWwtNiA2XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ2V4Y2hhbmdlJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTYgOGgxMWwtMy0zTTE4IDE2SDdsMyAzXCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ3JhbmtpbmcnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNOCAxNHY2TTEyIDEwdjEwTTE2IDZ2MTRcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNMTYgNC41YTIgMiAwIDEwMC00IDIgMiAwIDAwMCA0elwiICR7ZmlsbH0vPmAgLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ29yZSc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0xMiAzbDYgNC0yIDgtNCA2LTQtNi0yLTggNi00elwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk0xMiAzbC0yIDggMiAxMCAyLTEwLTItOHpcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnY29pbic6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCI4LjVcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNOC41IDEyaDdNMTAgOWg0TTEwIDE1aDRcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAncGljayc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk00IDVjNC0zIDktMiAxMiAxTTkgMTBsLTUgNU05IDEwbDIgMk03IDEybDIgMlwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk0xMSAxMmw3IDdcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAncmVmcmVzaCc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0yMCAxMmE4IDggMCAxMC0yLjMgNS43XCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTIwIDEydjZoLTZcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAncGxheSc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk04IDZ2MTJsMTAtNi0xMC02elwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdzdG9wJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cmVjdCB4PVwiN1wiIHk9XCI3XCIgd2lkdGg9XCIxMFwiIGhlaWdodD1cIjEwXCIgcng9XCIyXCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ2NvbGxlY3QnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNMTIgNXYxMFwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk04IDExbDQgNCA0LTRcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNNSAxOWgxNFwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICd3cmVuY2gnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNMTUuNSA2YTQuNSA0LjUgMCAxMS02LjkgNS40TDMgMTdsNC42LTUuNkE0LjUgNC41IDAgMTExNS41IDZ6XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ3NoaWVsZCc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0xMiAzbDggM3Y2YTEwIDEwIDAgMDEtOCA5IDEwIDEwIDAgMDEtOC05VjZsOC0zelwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdsaXN0JzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTcgNmgxMk03IDEyaDEyTTcgMThoMTJcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNNCA2aC4wMU00IDEyaC4wMU00IDE4aC4wMVwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICd1c2VyJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTEyIDEyYTQgNCAwIDEwMC04IDQgNCAwIDAwMCA4elwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk00IDIwYTggOCAwIDAxMTYgMFwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdsb2NrJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cmVjdCB4PVwiNVwiIHk9XCIxMFwiIHdpZHRoPVwiMTRcIiBoZWlnaHQ9XCIxMFwiIHJ4PVwiMlwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk04IDEwVjdhNCA0IDAgMTE4IDB2M1wiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdleWUnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNMiAxMnM0LTcgMTAtNyAxMCA3IDEwIDctNCA3LTEwIDctMTAtNy0xMC03elwiICR7c3Ryb2tlfS8+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIzXCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ2V5ZS1vZmYnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNMiAxMnM0LTcgMTAtNyAxMCA3IDEwIDctNCA3LTEwIDctMTAtNy0xMC03elwiICR7c3Ryb2tlfS8+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIzXCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTMgM2wxOCAxOFwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdzd29yZCc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0zIDIxbDYtNk05IDE1bDktOSAzIDMtOSA5TTE0IDZsNCA0XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ3Ryb3BoeSc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk04IDIxaDhNOSAxN2g2TTcgNGgxMHY1YTUgNSAwIDExLTEwIDBWNHpcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNNCA2aDN2MmEzIDMgMCAxMS0zLTJ6TTIwIDZoLTN2MmEzIDMgMCAwMDMtMnpcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnY2xvY2snOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiOC41XCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTEyIDd2Nmw0IDJcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnYm9sdCc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0xMyAyTDYgMTRoNWwtMSA4IDctMTJoLTVsMS04elwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICd0cmFzaCc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk00IDdoMTZNOSA3VjVoNnYyTTcgN2wxIDEzaDhsMS0xM1wiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdjbG9zZSc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk02IDZsMTIgMTJNNiAxOEwxOCA2XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ2Fycm93LXJpZ2h0JzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTQgMTJoMTRNMTIgNWw3IDctNyA3XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ3RhcmdldCc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCI4LjVcIiAke3N0cm9rZX0vPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiNC41XCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTEyIDJ2M00xMiAxOXYzTTIgMTJoM00xOSAxMmgzXCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ2JveCc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0xMiAzbDkgNS05IDUtOS01IDktNXpcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNMyA4djhsOSA1IDktNVY4XCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTEyIDEzdjhcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnaW5mbyc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCI4LjVcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNMTIgMTB2NlwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk0xMiA3aC4wMVwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdsb2dvdXQnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNMTQgOFY1YTEgMSAwIDAwLTEtMUg1YTEgMSAwIDAwLTEgMXYxNGExIDEgMCAwMDEgMWg4YTEgMSAwIDAwMS0xdi0zXCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTkgMTJoMTFNMTYgOGw0IDQtNCA0XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ3gnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNNiA2bDEyIDEyTTE4IDZMNiAxOFwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiOVwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgfVxufVxuIiwgImltcG9ydCB7IHJlbmRlckljb24gfSBmcm9tICcuL0ljb24nO1xuXG5sZXQgX2JveDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcblxuZnVuY3Rpb24gZW5zdXJlQm94KCk6IEhUTUxFbGVtZW50IHtcbiAgaWYgKF9ib3gpIHJldHVybiBfYm94O1xuICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgZGl2LmNsYXNzTmFtZSA9ICd0b2FzdC13cmFwJztcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkaXYpO1xuICBfYm94ID0gZGl2O1xuICByZXR1cm4gZGl2O1xufVxuXG50eXBlIFRvYXN0VHlwZSA9ICdpbmZvJyB8ICdzdWNjZXNzJyB8ICd3YXJuJyB8ICdlcnJvcic7XG50eXBlIFRvYXN0T3B0aW9ucyA9IHsgdHlwZT86IFRvYXN0VHlwZTsgZHVyYXRpb24/OiBudW1iZXIgfTtcblxuZXhwb3J0IGZ1bmN0aW9uIHNob3dUb2FzdCh0ZXh0OiBzdHJpbmcsIG9wdHM/OiBUb2FzdFR5cGUgfCBUb2FzdE9wdGlvbnMpIHtcbiAgY29uc3QgYm94ID0gZW5zdXJlQm94KCk7XG4gIGNvbnN0IGl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgbGV0IHR5cGU6IFRvYXN0VHlwZSB8IHVuZGVmaW5lZDtcbiAgbGV0IGR1cmF0aW9uID0gMzUwMDtcbiAgaWYgKHR5cGVvZiBvcHRzID09PSAnc3RyaW5nJykgdHlwZSA9IG9wdHM7XG4gIGVsc2UgaWYgKG9wdHMpIHsgdHlwZSA9IG9wdHMudHlwZTsgaWYgKG9wdHMuZHVyYXRpb24pIGR1cmF0aW9uID0gb3B0cy5kdXJhdGlvbjsgfVxuICBpdGVtLmNsYXNzTmFtZSA9ICd0b2FzdCcgKyAodHlwZSA/ICcgJyArIHR5cGUgOiAnJyk7XG4gIC8vIGljb24gKyB0ZXh0IGNvbnRhaW5lclxuICB0cnkge1xuICAgIGNvbnN0IHdyYXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB3cmFwLnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XG4gICAgd3JhcC5zdHlsZS5nYXAgPSAnOHB4JztcbiAgICB3cmFwLnN0eWxlLmFsaWduSXRlbXMgPSAnY2VudGVyJztcbiAgICBjb25zdCBpY29OYW1lID0gdHlwZSA9PT0gJ3N1Y2Nlc3MnID8gJ2JvbHQnIDogdHlwZSA9PT0gJ3dhcm4nID8gJ2Nsb2NrJyA6IHR5cGUgPT09ICdlcnJvcicgPyAnY2xvc2UnIDogJ2luZm8nO1xuICAgIGNvbnN0IGljb0hvc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgaWNvSG9zdC5hcHBlbmRDaGlsZChyZW5kZXJJY29uKGljb05hbWUsIHsgc2l6ZTogMTggfSkpO1xuICAgIGNvbnN0IHR4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHR4dC50ZXh0Q29udGVudCA9IHRleHQ7XG4gICAgd3JhcC5hcHBlbmRDaGlsZChpY29Ib3N0KTtcbiAgICB3cmFwLmFwcGVuZENoaWxkKHR4dCk7XG4gICAgaXRlbS5hcHBlbmRDaGlsZCh3cmFwKTtcbiAgfSBjYXRjaCB7XG4gICAgaXRlbS50ZXh0Q29udGVudCA9IHRleHQ7XG4gIH1cbiAgY29uc3QgbGlmZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2knKTtcbiAgbGlmZS5jbGFzc05hbWUgPSAnbGlmZSc7XG4gIGxpZmUuc3R5bGUuc2V0UHJvcGVydHkoJy0tbGlmZScsIGR1cmF0aW9uICsgJ21zJyk7XG4gIGl0ZW0uYXBwZW5kQ2hpbGQobGlmZSk7XG4gIGJveC5wcmVwZW5kKGl0ZW0pO1xuICAvLyBncmFjZWZ1bCBleGl0XG4gIGNvbnN0IGZhZGUgPSAoKSA9PiB7IGl0ZW0uc3R5bGUub3BhY2l0eSA9ICcwJzsgaXRlbS5zdHlsZS50cmFuc2l0aW9uID0gJ29wYWNpdHkgLjQ1cyc7IHNldFRpbWVvdXQoKCkgPT4gaXRlbS5yZW1vdmUoKSwgNDYwKTsgfTtcbiAgY29uc3QgdGltZXIgPSB3aW5kb3cuc2V0VGltZW91dChmYWRlLCBkdXJhdGlvbik7XG4gIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7IGNsZWFyVGltZW91dCh0aW1lcik7IGZhZGUoKTsgfSk7XG59XG4iLCAiaW1wb3J0IHsgR2FtZU1hbmFnZXIgfSBmcm9tICcuLi9jb3JlL0dhbWVNYW5hZ2VyJztcbmltcG9ydCB7IGh0bWwsIHFzIH0gZnJvbSAnLi4vdXRpbHMvZG9tJztcbmltcG9ydCB7IHNob3dUb2FzdCB9IGZyb20gJy4uL2NvbXBvbmVudHMvVG9hc3QnO1xuaW1wb3J0IHsgcmVuZGVySWNvbiB9IGZyb20gJy4uL2NvbXBvbmVudHMvSWNvbic7XG5cbmV4cG9ydCBjbGFzcyBMb2dpblNjZW5lIHtcbiAgbW91bnQocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICBjb25zdCB2aWV3ID0gaHRtbChgXG4gICAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyIGdyaWQtMlwiIHN0eWxlPVwiY29sb3I6I2ZmZjtcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQgZmFkZS1pblwiIHN0eWxlPVwibWF4LXdpZHRoOjQ2MHB4O21hcmdpbjo0NnB4IGF1dG87XCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInNjZW5lLWhlYWRlclwiPlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPGgxIHN0eWxlPVwiYmFja2dyb3VuZDp2YXIoLS1ncmFkKTstd2Via2l0LWJhY2tncm91bmQtY2xpcDp0ZXh0O2JhY2tncm91bmQtY2xpcDp0ZXh0O2NvbG9yOnRyYW5zcGFyZW50O2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjhweDtcIj48c3BhbiBkYXRhLWljbz1cImhvbWVcIj48L3NwYW4+XHU3N0ZGXHU1NzNBXHU2MzA3XHU2MzI1XHU0RTJEXHU1RkMzPC9oMT5cbiAgICAgICAgICAgICAgPHA+XHU3NjdCXHU1RjU1XHU1NDBFXHU4RkRCXHU1MTY1XHU0RjYwXHU3Njg0XHU4RDVCXHU1MzVBXHU3N0ZGXHU1N0NFXHUzMDAyPC9wPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGlucHV0IGlkPVwidVwiIGNsYXNzPVwiaW5wdXRcIiBwbGFjZWhvbGRlcj1cIlx1NzUyOFx1NjIzN1x1NTQwRFwiIGF1dG9jb21wbGV0ZT1cInVzZXJuYW1lXCIvPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIiBzdHlsZT1cImFsaWduLWl0ZW1zOmNlbnRlcjtcIj5cbiAgICAgICAgICAgIDxpbnB1dCBpZD1cInBcIiBjbGFzcz1cImlucHV0XCIgcGxhY2Vob2xkZXI9XCJcdTVCQzZcdTc4MDFcIiB0eXBlPVwicGFzc3dvcmRcIiBhdXRvY29tcGxldGU9XCJjdXJyZW50LXBhc3N3b3JkXCIvPlxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInJldmVhbFwiIGNsYXNzPVwiYnRuIGJ0bi1naG9zdFwiIHN0eWxlPVwibWluLXdpZHRoOjExMHB4O1wiPjxzcGFuIGRhdGEtaWNvPVwiZXllXCI+PC9zcGFuPlx1NjYzRVx1NzkzQTwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxidXR0b24gaWQ9XCJnb1wiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCIgc3R5bGU9XCJ3aWR0aDoxMDAlO21hcmdpbi10b3A6OHB4O1wiPjxzcGFuIGRhdGEtaWNvPVwiYXJyb3ctcmlnaHRcIj48L3NwYW4+XHU4RkRCXHU1MTY1XHU2RTM4XHU2MjBGPC9idXR0b24+XG4gICAgICAgICAgPGRpdiBzdHlsZT1cIm1hcmdpbi10b3A6OHB4O29wYWNpdHk6Ljc1O2ZvbnQtc2l6ZToxMnB4O1wiPlx1NjNEMFx1NzkzQVx1RkYxQVx1ODJFNVx1OEQyNlx1NjIzN1x1NEUwRFx1NUI1OFx1NTcyOFx1RkYwQ1x1NUMwNlx1ODFFQVx1NTJBOFx1NTIxQlx1NUVGQVx1NUU3Nlx1NzY3Qlx1NUY1NVx1MzAwMjwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIGApO1xuICAgIHJvb3QuaW5uZXJIVE1MID0gJyc7XG4gICAgcm9vdC5hcHBlbmRDaGlsZCh2aWV3KTtcblxuICAgIC8vIFx1NkUzMlx1NjdEM1x1NjI0MFx1NjcwOVx1NTZGRVx1NjgwN1xuICAgIHRyeSB7XG4gICAgICB2aWV3LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWljb10nKS5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICBjb25zdCBuYW1lID0gKGVsIGFzIEhUTUxFbGVtZW50KS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWNvJykgYXMgYW55O1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGVsLmFwcGVuZENoaWxkKHJlbmRlckljb24obmFtZSwgeyBzaXplOiAyMiB9KSk7XG4gICAgICAgIH0gY2F0Y2gge31cbiAgICAgIH0pO1xuICAgIH0gY2F0Y2gge31cblxuICAgIGNvbnN0IHVFbCA9IHFzPEhUTUxJbnB1dEVsZW1lbnQ+KHZpZXcsICcjdScpO1xuICAgIGNvbnN0IHBFbCA9IHFzPEhUTUxJbnB1dEVsZW1lbnQ+KHZpZXcsICcjcCcpO1xuICAgIGNvbnN0IGdvID0gcXM8SFRNTEJ1dHRvbkVsZW1lbnQ+KHZpZXcsICcjZ28nKTtcbiAgICBjb25zdCByZXZlYWwgPSBxczxIVE1MQnV0dG9uRWxlbWVudD4odmlldywgJyNyZXZlYWwnKTtcblxuICAgIC8vIFx1NEY3Rlx1NzUyOCByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgXHU3ODZFXHU0RkREXHU2RTMyXHU2N0QzXHU1QjhDXHU2MjEwXHU1NDBFXHU3QUNCXHU1MzczXHU4MDVBXHU3MTI2XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgIHVFbC5mb2N1cygpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBzdWJtaXQgPSBhc3luYyAoKSA9PiB7XG4gICAgICBpZiAoZ28uZGlzYWJsZWQpIHJldHVybjsgLy8gXHU5NjMyXHU2QjYyXHU5MUNEXHU1OTBEXHU3MEI5XHU1MUZCXG4gICAgICBcbiAgICAgIGNvbnN0IHVzZXJuYW1lID0gKHVFbC52YWx1ZSB8fCAnJykudHJpbSgpO1xuICAgICAgY29uc3QgcGFzc3dvcmQgPSAocEVsLnZhbHVlIHx8ICcnKS50cmltKCk7XG4gICAgICBpZiAoIXVzZXJuYW1lIHx8ICFwYXNzd29yZCkge1xuICAgICAgICBzaG93VG9hc3QoJ1x1OEJGN1x1NTg2Qlx1NTE5OVx1NzUyOFx1NjIzN1x1NTQwRFx1NTQ4Q1x1NUJDNlx1NzgwMScsICd3YXJuJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICh1c2VybmFtZS5sZW5ndGggPCAzIHx8IHVzZXJuYW1lLmxlbmd0aCA+IDIwKSB7XG4gICAgICAgIHNob3dUb2FzdCgnXHU3NTI4XHU2MjM3XHU1NDBEXHU5NTdGXHU1RUE2XHU1RTk0XHU1NzI4IDMtMjAgXHU0RTJBXHU1QjU3XHU3QjI2XHU0RTRCXHU5NUY0JywgJ3dhcm4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHBhc3N3b3JkLmxlbmd0aCA8IDMpIHtcbiAgICAgICAgc2hvd1RvYXN0KCdcdTVCQzZcdTc4MDFcdTgxRjNcdTVDMTFcdTk3MDBcdTg5ODEgMyBcdTRFMkFcdTVCNTdcdTdCMjYnLCAnd2FybicpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBnby5kaXNhYmxlZCA9IHRydWU7XG4gICAgICBjb25zdCBvcmlnaW5hbEhUTUwgPSBnby5pbm5lckhUTUw7XG4gICAgICBnby5pbm5lckhUTUwgPSAnPHNwYW4gZGF0YS1pY289XCJhcnJvdy1yaWdodFwiPjwvc3Bhbj5cdTc2N0JcdTVGNTVcdTRFMkRcdTIwMjYnO1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmlldy5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1pY29dJykuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgICBjb25zdCBuYW1lID0gKGVsIGFzIEhUTUxFbGVtZW50KS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWNvJykgYXMgYW55O1xuICAgICAgICAgIHRyeSB7IGVsLmFwcGVuZENoaWxkKHJlbmRlckljb24obmFtZSwgeyBzaXplOiAyMCB9KSk7IH0gY2F0Y2gge31cbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIHt9XG4gICAgICBcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IEdhbWVNYW5hZ2VyLkkubG9naW5PclJlZ2lzdGVyKHVzZXJuYW1lLCBwYXNzd29yZCk7XG4gICAgICAgIGxvY2F0aW9uLmhhc2ggPSAnIy9tYWluJztcbiAgICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgICBzaG93VG9hc3QoZT8ubWVzc2FnZSB8fCAnXHU3NjdCXHU1RjU1XHU1OTMxXHU4RDI1XHVGRjBDXHU4QkY3XHU5MUNEXHU4QkQ1JywgJ2Vycm9yJyk7XG4gICAgICAgIC8vIFx1NTkzMVx1OEQyNVx1NjVGNlx1NjA2Mlx1NTkwRFx1NjMwOVx1OTRBRVxuICAgICAgICBnby5pbm5lckhUTUwgPSBvcmlnaW5hbEhUTUw7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmlldy5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1pY29dJykuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSAoZWwgYXMgSFRNTEVsZW1lbnQpLmdldEF0dHJpYnV0ZSgnZGF0YS1pY28nKSBhcyBhbnk7XG4gICAgICAgICAgICB0cnkgeyBlbC5hcHBlbmRDaGlsZChyZW5kZXJJY29uKG5hbWUsIHsgc2l6ZTogMjAgfSkpOyB9IGNhdGNoIHt9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2gge31cbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGdvLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGdvLm9uY2xpY2sgPSBzdWJtaXQ7XG4gICAgdUVsLm9ua2V5dXAgPSAoZSkgPT4geyBpZiAoKGUgYXMgS2V5Ym9hcmRFdmVudCkua2V5ID09PSAnRW50ZXInKSBzdWJtaXQoKTsgfTtcbiAgICBwRWwub25rZXl1cCA9IChlKSA9PiB7IGlmICgoZSBhcyBLZXlib2FyZEV2ZW50KS5rZXkgPT09ICdFbnRlcicpIHN1Ym1pdCgpOyB9O1xuICAgIHJldmVhbC5vbmNsaWNrID0gKCkgPT4ge1xuICAgICAgY29uc3QgaXNQd2QgPSBwRWwudHlwZSA9PT0gJ3Bhc3N3b3JkJztcbiAgICAgIHBFbC50eXBlID0gaXNQd2QgPyAndGV4dCcgOiAncGFzc3dvcmQnO1xuICAgICAgcmV2ZWFsLmlubmVySFRNTCA9ICcnO1xuICAgICAgcmV2ZWFsLmFwcGVuZENoaWxkKHJlbmRlckljb24oaXNQd2QgPyAnZXllLW9mZicgOiAnZXllJywgeyBzaXplOiAyMCB9KSk7XG4gICAgICByZXZlYWwuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoaXNQd2QgPyAnXHU5NjkwXHU4NUNGJyA6ICdcdTY2M0VcdTc5M0EnKSk7XG4gICAgfTtcbiAgfVxufVxuIiwgImV4cG9ydCBjb25zdCBBUElfQkFTRSA9ICh3aW5kb3cgYXMgYW55KS5fX0FQSV9CQVNFX18gfHwgJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGknO1xyXG5leHBvcnQgY29uc3QgV1NfRU5EUE9JTlQgPSAod2luZG93IGFzIGFueSkuX19XU19FTkRQT0lOVF9fIHx8ICdodHRwOi8vbG9jYWxob3N0OjMwMDAvZ2FtZSc7XHJcblxyXG5cclxuIiwgImltcG9ydCB7IFdTX0VORFBPSU5UIH0gZnJvbSAnLi9FbnYnO1xuXG50eXBlIEhhbmRsZXIgPSAoZGF0YTogYW55KSA9PiB2b2lkO1xuXG5leHBvcnQgY2xhc3MgUmVhbHRpbWVDbGllbnQge1xuICBwcml2YXRlIHN0YXRpYyBfaW5zdGFuY2U6IFJlYWx0aW1lQ2xpZW50O1xuICBzdGF0aWMgZ2V0IEkoKTogUmVhbHRpbWVDbGllbnQge1xuICAgIHJldHVybiB0aGlzLl9pbnN0YW5jZSA/PyAodGhpcy5faW5zdGFuY2UgPSBuZXcgUmVhbHRpbWVDbGllbnQoKSk7XG4gIH1cblxuICBwcml2YXRlIHNvY2tldDogYW55IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgaGFuZGxlcnM6IFJlY29yZDxzdHJpbmcsIEhhbmRsZXJbXT4gPSB7fTtcblxuICBjb25uZWN0KHRva2VuOiBzdHJpbmcpIHtcbiAgICBjb25zdCB3ID0gd2luZG93IGFzIGFueTtcbiAgICBpZiAody5pbykge1xuICAgICAgLy8gXHU1OTgyXHU2NzlDXHU1REYyXHU4RkRFXHU2M0E1XHU0RTE0dG9rZW5cdTc2RjhcdTU0MENcdUZGMENcdTRFMERcdTkxQ0RcdTU5MERcdThGREVcdTYzQTVcbiAgICAgIGlmICh0aGlzLnNvY2tldCAmJiAodGhpcy5zb2NrZXQuY29ubmVjdGVkIHx8IHRoaXMuc29ja2V0LmNvbm5lY3RpbmcpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy8gXHU2NUFEXHU1RjAwXHU2NUU3XHU4RkRFXHU2M0E1XG4gICAgICBpZiAodGhpcy5zb2NrZXQpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB0aGlzLnNvY2tldC5kaXNjb25uZWN0KCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oJ1tSZWFsdGltZUNsaWVudF0gRGlzY29ubmVjdCBlcnJvcjonLCBlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBcdTVFRkFcdTdBQ0JcdTY1QjBcdThGREVcdTYzQTVcbiAgICAgIHRoaXMuc29ja2V0ID0gdy5pbyhXU19FTkRQT0lOVCwgeyBhdXRoOiB7IHRva2VuIH0gfSk7XG4gICAgICBcbiAgICAgIHRoaXMuc29ja2V0Lm9uKCdjb25uZWN0JywgKCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnW1JlYWx0aW1lQ2xpZW50XSBDb25uZWN0ZWQgdG8gV2ViU29ja2V0Jyk7XG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgdGhpcy5zb2NrZXQub24oJ2Rpc2Nvbm5lY3QnLCAoKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdbUmVhbHRpbWVDbGllbnRdIERpc2Nvbm5lY3RlZCBmcm9tIFdlYlNvY2tldCcpO1xuICAgICAgfSk7XG4gICAgICBcbiAgICAgIHRoaXMuc29ja2V0Lm9uKCdjb25uZWN0X2Vycm9yJywgKGVycm9yOiBhbnkpID0+IHtcbiAgICAgICAgY29uc29sZS5lcnJvcignW1JlYWx0aW1lQ2xpZW50XSBDb25uZWN0aW9uIGVycm9yOicsIGVycm9yKTtcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICB0aGlzLnNvY2tldC5vbkFueSgoZXZlbnQ6IHN0cmluZywgcGF5bG9hZDogYW55KSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdbUmVhbHRpbWVDbGllbnRdIEV2ZW50IHJlY2VpdmVkOicsIGV2ZW50LCBwYXlsb2FkKTtcbiAgICAgICAgdGhpcy5lbWl0TG9jYWwoZXZlbnQsIHBheWxvYWQpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHNvY2tldC5pbyBjbGllbnQgbm90IGxvYWRlZDsgZGlzYWJsZSByZWFsdGltZSB1cGRhdGVzXG4gICAgICBjb25zb2xlLndhcm4oJ1tSZWFsdGltZUNsaWVudF0gc29ja2V0LmlvIG5vdCBsb2FkZWQnKTtcbiAgICAgIHRoaXMuc29ja2V0ID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBvbihldmVudDogc3RyaW5nLCBoYW5kbGVyOiBIYW5kbGVyKSB7XG4gICAgKHRoaXMuaGFuZGxlcnNbZXZlbnRdIHx8PSBbXSkucHVzaChoYW5kbGVyKTtcbiAgfVxuXG4gIG9mZihldmVudDogc3RyaW5nLCBoYW5kbGVyOiBIYW5kbGVyKSB7XG4gICAgY29uc3QgYXJyID0gdGhpcy5oYW5kbGVyc1tldmVudF07XG4gICAgaWYgKCFhcnIpIHJldHVybjtcbiAgICBjb25zdCBpZHggPSBhcnIuaW5kZXhPZihoYW5kbGVyKTtcbiAgICBpZiAoaWR4ID49IDApIGFyci5zcGxpY2UoaWR4LCAxKTtcbiAgfVxuXG4gIHByaXZhdGUgZW1pdExvY2FsKGV2ZW50OiBzdHJpbmcsIHBheWxvYWQ6IGFueSkge1xuICAgICh0aGlzLmhhbmRsZXJzW2V2ZW50XSB8fCBbXSkuZm9yRWFjaCgoaCkgPT4gaChwYXlsb2FkKSk7XG4gIH1cbn1cbiIsICJpbXBvcnQgeyBHYW1lTWFuYWdlciB9IGZyb20gJy4uL2NvcmUvR2FtZU1hbmFnZXInO1xuaW1wb3J0IHsgcmVuZGVySWNvbiB9IGZyb20gJy4vSWNvbic7XG5cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJOYXYoYWN0aXZlOiBzdHJpbmcpOiBIVE1MRWxlbWVudCB7XG4gIGNvbnN0IHRhYnM6IHsga2V5OiBzdHJpbmc7IHRleHQ6IHN0cmluZzsgaHJlZjogc3RyaW5nOyBpY29uOiBhbnkgfVtdID0gW1xuICAgIHsga2V5OiAnbWFpbicsIHRleHQ6ICdcdTRFM0JcdTk4NzUnLCBocmVmOiAnIy9tYWluJywgaWNvbjogJ2hvbWUnIH0sXG4gICAgeyBrZXk6ICd3YXJlaG91c2UnLCB0ZXh0OiAnXHU0RUQzXHU1RTkzJywgaHJlZjogJyMvd2FyZWhvdXNlJywgaWNvbjogJ3dhcmVob3VzZScgfSxcbiAgICB7IGtleTogJ3BsdW5kZXInLCB0ZXh0OiAnXHU2M0EwXHU1OTNBJywgaHJlZjogJyMvcGx1bmRlcicsIGljb246ICdwbHVuZGVyJyB9LFxuICAgIHsga2V5OiAnZXhjaGFuZ2UnLCB0ZXh0OiAnXHU0RUE0XHU2NjEzXHU2MjQwJywgaHJlZjogJyMvZXhjaGFuZ2UnLCBpY29uOiAnZXhjaGFuZ2UnIH0sXG4gICAgeyBrZXk6ICdyYW5raW5nJywgdGV4dDogJ1x1NjM5Mlx1ODg0QycsIGhyZWY6ICcjL3JhbmtpbmcnLCBpY29uOiAncmFua2luZycgfSxcbiAgXTtcbiAgY29uc3Qgd3JhcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICB3cmFwLmNsYXNzTmFtZSA9ICduYXYnO1xuICBmb3IgKGNvbnN0IHQgb2YgdGFicykge1xuICAgIGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgYS5ocmVmID0gdC5ocmVmO1xuICAgIGNvbnN0IGljbyA9IHJlbmRlckljb24odC5pY29uLCB7IHNpemU6IDE4LCBjbGFzc05hbWU6ICdpY28nIH0pO1xuICAgIGNvbnN0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGxhYmVsLnRleHRDb250ZW50ID0gdC50ZXh0O1xuICAgIGEuYXBwZW5kQ2hpbGQoaWNvKTtcbiAgICBhLmFwcGVuZENoaWxkKGxhYmVsKTtcbiAgICBpZiAodC5rZXkgPT09IGFjdGl2ZSkgYS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICB3cmFwLmFwcGVuZENoaWxkKGEpO1xuICB9XG4gIFxuICAvLyBcdTZERkJcdTUyQTBcdTkwMDBcdTUxRkFcdTc2N0JcdTVGNTVcdTYzMDlcdTk0QUVcbiAgY29uc3QgbG9nb3V0QnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICBsb2dvdXRCdG4uaHJlZiA9ICcjJztcbiAgbG9nb3V0QnRuLmNsYXNzTmFtZSA9ICduYXYtbG9nb3V0JztcbiAgbG9nb3V0QnRuLnN0eWxlLmNzc1RleHQgPSAnbWFyZ2luLWxlZnQ6YXV0bztvcGFjaXR5Oi43NTsnO1xuICBjb25zdCBsb2dvdXRJY28gPSByZW5kZXJJY29uKCdsb2dvdXQnLCB7IHNpemU6IDE4LCBjbGFzc05hbWU6ICdpY28nIH0pO1xuICBjb25zdCBsb2dvdXRMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgbG9nb3V0TGFiZWwudGV4dENvbnRlbnQgPSAnXHU5MDAwXHU1MUZBJztcbiAgbG9nb3V0QnRuLmFwcGVuZENoaWxkKGxvZ291dEljbyk7XG4gIGxvZ291dEJ0bi5hcHBlbmRDaGlsZChsb2dvdXRMYWJlbCk7XG4gIGxvZ291dEJ0bi5vbmNsaWNrID0gKGUpID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgaWYgKGNvbmZpcm0oJ1x1Nzg2RVx1NUI5QVx1ODk4MVx1OTAwMFx1NTFGQVx1NzY3Qlx1NUY1NVx1NTQxN1x1RkYxRicpKSB7XG4gICAgICBHYW1lTWFuYWdlci5JLmxvZ291dCgpO1xuICAgIH1cbiAgfTtcbiAgd3JhcC5hcHBlbmRDaGlsZChsb2dvdXRCdG4pO1xuICBcbiAgcmV0dXJuIHdyYXA7XG59XG4iLCAiZXhwb3J0IGNsYXNzIENvdW50VXBUZXh0IHtcclxuICBwcml2YXRlIHZhbHVlID0gMDtcclxuICBwcml2YXRlIGRpc3BsYXkgPSAnMCc7XHJcbiAgcHJpdmF0ZSBhbmltPzogbnVtYmVyO1xyXG4gIG9uVXBkYXRlPzogKHRleHQ6IHN0cmluZykgPT4gdm9pZDtcclxuXHJcbiAgc2V0KG46IG51bWJlcikge1xyXG4gICAgdGhpcy52YWx1ZSA9IG47XHJcbiAgICB0aGlzLmRpc3BsYXkgPSB0aGlzLmZvcm1hdChuKTtcclxuICAgIHRoaXMub25VcGRhdGU/Lih0aGlzLmRpc3BsYXkpO1xyXG4gIH1cclxuXHJcbiAgdG8objogbnVtYmVyLCBkdXJhdGlvbiA9IDUwMCkge1xyXG4gICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5hbmltISk7XHJcbiAgICBjb25zdCBzdGFydCA9IHRoaXMudmFsdWU7XHJcbiAgICBjb25zdCBkZWx0YSA9IG4gLSBzdGFydDtcclxuICAgIGNvbnN0IHQwID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcbiAgICBjb25zdCBzdGVwID0gKHQ6IG51bWJlcikgPT4ge1xyXG4gICAgICBjb25zdCBwID0gTWF0aC5taW4oMSwgKHQgLSB0MCkgLyBkdXJhdGlvbik7XHJcbiAgICAgIGNvbnN0IGVhc2UgPSAxIC0gTWF0aC5wb3coMSAtIHAsIDMpO1xyXG4gICAgICBjb25zdCBjdXJyID0gc3RhcnQgKyBkZWx0YSAqIGVhc2U7XHJcbiAgICAgIHRoaXMuZGlzcGxheSA9IHRoaXMuZm9ybWF0KGN1cnIpO1xyXG4gICAgICB0aGlzLm9uVXBkYXRlPy4odGhpcy5kaXNwbGF5KTtcclxuICAgICAgaWYgKHAgPCAxKSB0aGlzLmFuaW0gPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcCk7XHJcbiAgICAgIGVsc2UgdGhpcy52YWx1ZSA9IG47XHJcbiAgICB9O1xyXG4gICAgdGhpcy5hbmltID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBmb3JtYXQobjogbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gTWF0aC5mbG9vcihuKS50b0xvY2FsZVN0cmluZygpO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbiIsICJpbXBvcnQgeyBOZXR3b3JrTWFuYWdlciB9IGZyb20gJy4uL2NvcmUvTmV0d29ya01hbmFnZXInO1xuaW1wb3J0IHsgcmVuZGVySWNvbiB9IGZyb20gJy4vSWNvbic7XG5pbXBvcnQgeyBDb3VudFVwVGV4dCB9IGZyb20gJy4vQ291bnRVcFRleHQnO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyUmVzb3VyY2VCYXIoKSB7XG4gIGNvbnN0IGJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBib3guY2xhc3NOYW1lID0gJ2NvbnRhaW5lcic7XG4gIGNvbnN0IGNhcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgY2FyZC5jbGFzc05hbWUgPSAnY2FyZCBmYWRlLWluJztcbiAgY2FyZC5pbm5lckhUTUwgPSBgXG4gICAgPGRpdiBjbGFzcz1cInN0YXRzXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwic3RhdFwiIGlkPVwib3JlLXN0YXRcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImljb1wiIGRhdGEtaWNvPVwib3JlXCI+PC9kaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9XCJkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDoycHg7XCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInZhbFwiIGlkPVwib3JlXCI+MDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJsYWJlbFwiPlx1NzdGRlx1NzdGMzwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cInN0YXRcIiBpZD1cImNvaW4tc3RhdFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiaWNvXCIgZGF0YS1pY289XCJjb2luXCI+PC9kaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9XCJkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDoycHg7XCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInZhbFwiIGlkPVwiY29pblwiPjA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibGFiZWxcIj5CQjwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICBgO1xuICBib3guYXBwZW5kQ2hpbGQoY2FyZCk7XG4gIC8vIGluamVjdCBpY29uc1xuICB0cnkge1xuICAgIGNvbnN0IG9yZUljbyA9IGNhcmQucXVlcnlTZWxlY3RvcignW2RhdGEtaWNvPVwib3JlXCJdJyk7XG4gICAgY29uc3QgY29pbkljbyA9IGNhcmQucXVlcnlTZWxlY3RvcignW2RhdGEtaWNvPVwiY29pblwiXScpO1xuICAgIGlmIChvcmVJY28pIG9yZUljby5hcHBlbmRDaGlsZChyZW5kZXJJY29uKCdvcmUnLCB7IHNpemU6IDE4IH0pKTtcbiAgICBpZiAoY29pbkljbykgY29pbkljby5hcHBlbmRDaGlsZChyZW5kZXJJY29uKCdjb2luJywgeyBzaXplOiAxOCB9KSk7XG4gIH0gY2F0Y2gge31cbiAgXG4gIGNvbnN0IG9yZUVsID0gY2FyZC5xdWVyeVNlbGVjdG9yKCcjb3JlJykgYXMgSFRNTEVsZW1lbnQ7XG4gIGNvbnN0IGNvaW5FbCA9IGNhcmQucXVlcnlTZWxlY3RvcignI2NvaW4nKSBhcyBIVE1MRWxlbWVudDtcbiAgXG4gIGNvbnN0IG9yZUNvdW50ZXIgPSBuZXcgQ291bnRVcFRleHQoKTtcbiAgY29uc3QgY29pbkNvdW50ZXIgPSBuZXcgQ291bnRVcFRleHQoKTtcbiAgb3JlQ291bnRlci5vblVwZGF0ZSA9ICh0ZXh0KSA9PiB7IG9yZUVsLnRleHRDb250ZW50ID0gdGV4dDsgfTtcbiAgY29pbkNvdW50ZXIub25VcGRhdGUgPSAodGV4dCkgPT4geyBjb2luRWwudGV4dENvbnRlbnQgPSB0ZXh0OyB9O1xuICBcbiAgbGV0IHByZXZPcmUgPSAwO1xuICBsZXQgcHJldkNvaW4gPSAwO1xuICBcbiAgYXN5bmMgZnVuY3Rpb24gdXBkYXRlKCkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBwID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgaWQ6IHN0cmluZzsgdXNlcm5hbWU6IHN0cmluZzsgbmlja25hbWU6IHN0cmluZzsgb3JlQW1vdW50OiBudW1iZXI7IGJiQ29pbnM6IG51bWJlciB9PignL3VzZXIvcHJvZmlsZScpO1xuICAgICAgXG4gICAgICAvLyBcdTRGN0ZcdTc1MjhcdThCQTFcdTY1NzBcdTUyQThcdTc1M0JcdTY2RjRcdTY1QjBcbiAgICAgIGlmIChwLm9yZUFtb3VudCAhPT0gcHJldk9yZSkge1xuICAgICAgICBvcmVDb3VudGVyLnRvKHAub3JlQW1vdW50LCA4MDApO1xuICAgICAgICAvLyBcdTU5ODJcdTY3OUNcdTY2MkZcdTU4OUVcdTUyQTBcdUZGMENcdTZERkJcdTUyQTBcdTU2RkVcdTY4MDdcdTgxMDlcdTUxQjJcdTY1NDhcdTY3OUNcbiAgICAgICAgaWYgKHAub3JlQW1vdW50ID4gcHJldk9yZSkge1xuICAgICAgICAgIGNvbnN0IG9yZUljb24gPSBjYXJkLnF1ZXJ5U2VsZWN0b3IoJyNvcmUtc3RhdCAuaWNvJyk7XG4gICAgICAgICAgaWYgKG9yZUljb24pIHtcbiAgICAgICAgICAgIG9yZUljb24uY2xhc3NMaXN0LmFkZCgncHVsc2UtaWNvbicpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBvcmVJY29uLmNsYXNzTGlzdC5yZW1vdmUoJ3B1bHNlLWljb24nKSwgNjAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcHJldk9yZSA9IHAub3JlQW1vdW50O1xuICAgICAgfVxuICAgICAgXG4gICAgICBpZiAocC5iYkNvaW5zICE9PSBwcmV2Q29pbikge1xuICAgICAgICBjb2luQ291bnRlci50byhwLmJiQ29pbnMsIDgwMCk7XG4gICAgICAgIGlmIChwLmJiQ29pbnMgPiBwcmV2Q29pbikge1xuICAgICAgICAgIGNvbnN0IGNvaW5JY29uID0gY2FyZC5xdWVyeVNlbGVjdG9yKCcjY29pbi1zdGF0IC5pY28nKTtcbiAgICAgICAgICBpZiAoY29pbkljb24pIHtcbiAgICAgICAgICAgIGNvaW5JY29uLmNsYXNzTGlzdC5hZGQoJ3B1bHNlLWljb24nKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gY29pbkljb24uY2xhc3NMaXN0LnJlbW92ZSgncHVsc2UtaWNvbicpLCA2MDApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBwcmV2Q29pbiA9IHAuYmJDb2lucztcbiAgICAgIH1cbiAgICB9IGNhdGNoIHtcbiAgICAgIC8vIGlnbm9yZSBmZXRjaCBlcnJvcnM7IFVJIFx1NEYxQVx1NTcyOFx1NEUwQlx1NEUwMFx1NkIyMVx1NTIzN1x1NjVCMFx1NjVGNlx1NjA2Mlx1NTkwRFxuICAgIH1cbiAgfVxuICByZXR1cm4geyByb290OiBib3gsIHVwZGF0ZSwgb3JlRWwsIGNvaW5FbCB9O1xufVxuIiwgImltcG9ydCB7IE5ldHdvcmtNYW5hZ2VyIH0gZnJvbSAnLi4vY29yZS9OZXR3b3JrTWFuYWdlcic7XHJcbmltcG9ydCB7IFJlYWx0aW1lQ2xpZW50IH0gZnJvbSAnLi4vY29yZS9SZWFsdGltZUNsaWVudCc7XHJcbmltcG9ydCB7IGh0bWwsIHFzIH0gZnJvbSAnLi4vdXRpbHMvZG9tJztcclxuaW1wb3J0IHsgcmVuZGVyTmF2IH0gZnJvbSAnLi4vY29tcG9uZW50cy9OYXYnO1xyXG5pbXBvcnQgeyByZW5kZXJSZXNvdXJjZUJhciB9IGZyb20gJy4uL2NvbXBvbmVudHMvUmVzb3VyY2VCYXInO1xyXG5pbXBvcnQgeyBzaG93VG9hc3QgfSBmcm9tICcuLi9jb21wb25lbnRzL1RvYXN0JztcclxuaW1wb3J0IHsgc3Bhd25GbG9hdFRleHQgfSBmcm9tICcuLi9jb21wb25lbnRzL0Zsb2F0VGV4dCc7XHJcbmltcG9ydCB7IHJlbmRlckljb24gfSBmcm9tICcuLi9jb21wb25lbnRzL0ljb24nO1xyXG5cclxudHlwZSBNaW5lU3RhdHVzID0ge1xyXG4gIGNhcnRBbW91bnQ6IG51bWJlcjtcclxuICBjYXJ0Q2FwYWNpdHk6IG51bWJlcjtcclxuICBjb2xsYXBzZWQ6IGJvb2xlYW47XHJcbiAgY29sbGFwc2VkUmVtYWluaW5nOiBudW1iZXI7XHJcbiAgcnVubmluZzogYm9vbGVhbjtcclxuICBpbnRlcnZhbE1zOiBudW1iZXI7XHJcbn07XHJcblxyXG50eXBlIFBlbmRpbmdBY3Rpb24gPSAnc3RhcnQnIHwgJ3N0b3AnIHwgJ2NvbGxlY3QnIHwgJ3JlcGFpcicgfCAnc3RhdHVzJyB8IG51bGw7XHJcblxyXG5leHBvcnQgY2xhc3MgTWFpblNjZW5lIHtcclxuICBwcml2YXRlIHZpZXc6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XHJcbiAgcHJpdmF0ZSBjYXJ0QW10ID0gMDtcclxuICBwcml2YXRlIGNhcnRDYXAgPSAxMDAwO1xyXG4gIHByaXZhdGUgaXNNaW5pbmcgPSBmYWxzZTtcclxuICBwcml2YXRlIGlzQ29sbGFwc2VkID0gZmFsc2U7XHJcbiAgcHJpdmF0ZSBjb2xsYXBzZVJlbWFpbmluZyA9IDA7XHJcbiAgcHJpdmF0ZSBjb2xsYXBzZVRpbWVyOiBudW1iZXIgfCBudWxsID0gbnVsbDtcclxuICBwcml2YXRlIGludGVydmFsTXMgPSAzMDAwO1xyXG4gIHByaXZhdGUgcGVuZGluZzogUGVuZGluZ0FjdGlvbiA9IG51bGw7XHJcblxyXG4gIHByaXZhdGUgZWxzID0ge1xyXG4gICAgZmlsbDogbnVsbCBhcyBIVE1MRWxlbWVudCB8IG51bGwsXHJcbiAgICBwZXJjZW50OiBudWxsIGFzIEhUTUxFbGVtZW50IHwgbnVsbCxcclxuICAgIHN0YXR1c1RleHQ6IG51bGwgYXMgSFRNTEVsZW1lbnQgfCBudWxsLFxyXG4gICAgcmluZzogbnVsbCBhcyBIVE1MRWxlbWVudCB8IG51bGwsXHJcbiAgICByaW5nUGN0OiBudWxsIGFzIEhUTUxFbGVtZW50IHwgbnVsbCxcclxuICAgIGN5Y2xlOiBudWxsIGFzIEhUTUxFbGVtZW50IHwgbnVsbCxcclxuICAgIHN0YXR1c1RhZzogbnVsbCBhcyBIVE1MRWxlbWVudCB8IG51bGwsXHJcbiAgICBldmVudHM6IG51bGwgYXMgSFRNTEVsZW1lbnQgfCBudWxsLFxyXG4gICAgc3RhcnQ6IG51bGwgYXMgSFRNTEJ1dHRvbkVsZW1lbnQgfCBudWxsLFxyXG4gICAgc3RvcDogbnVsbCBhcyBIVE1MQnV0dG9uRWxlbWVudCB8IG51bGwsXHJcbiAgICBjb2xsZWN0OiBudWxsIGFzIEhUTUxCdXR0b25FbGVtZW50IHwgbnVsbCxcclxuICAgIHJlcGFpcjogbnVsbCBhcyBIVE1MQnV0dG9uRWxlbWVudCB8IG51bGwsXHJcbiAgICBzdGF0dXNCdG46IG51bGwgYXMgSFRNTEJ1dHRvbkVsZW1lbnQgfCBudWxsLFxyXG4gICAgaG9sb2dyYW06IG51bGwgYXMgSFRNTEVsZW1lbnQgfCBudWxsLFxyXG4gIH07XHJcblxyXG4gIHByaXZhdGUgbWluZVVwZGF0ZUhhbmRsZXI/OiAobXNnOiBhbnkpID0+IHZvaWQ7XHJcbiAgcHJpdmF0ZSBtaW5lQ29sbGFwc2VIYW5kbGVyPzogKG1zZzogYW55KSA9PiB2b2lkO1xyXG4gIHByaXZhdGUgcGx1bmRlckhhbmRsZXI/OiAobXNnOiBhbnkpID0+IHZvaWQ7XHJcblxyXG4gIGFzeW5jIG1vdW50KHJvb3Q6IEhUTUxFbGVtZW50KSB7XHJcbiAgICB0aGlzLmNsZWFyQ29sbGFwc2VUaW1lcigpO1xyXG4gICAgdGhpcy5wZW5kaW5nID0gbnVsbDtcclxuXHJcbiAgICBjb25zdCBuYXYgPSByZW5kZXJOYXYoJ21haW4nKTtcclxuICAgIGNvbnN0IGJhciA9IHJlbmRlclJlc291cmNlQmFyKCk7XHJcbiAgICBjb25zdCB2aWV3ID0gaHRtbChgXHJcbiAgICAgIDxzZWN0aW9uIGNsYXNzPVwibWFpbi1zY3JlZW5cIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwibWFpbi1hbWJpZW50XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+XHJcbiAgICAgICAgICA8c3BhbiBjbGFzcz1cImFtYmllbnQgb3JiIG9yYi1hXCI+PC9zcGFuPlxyXG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJhbWJpZW50IG9yYiBvcmItYlwiPjwvc3Bhbj5cclxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYW1iaWVudCBncmlkXCI+PC9zcGFuPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXIgbWFpbi1zdGFja1wiIHN0eWxlPVwiY29sb3I6I2ZmZjtcIj5cclxuICAgICAgICAgIDxzZWN0aW9uIGNsYXNzPVwibWluZSBjYXJkIG1pbmUtY2FyZCBmYWRlLWluXCI+XHJcbiAgICAgICAgICAgIDxoZWFkZXIgY2xhc3M9XCJtaW5lLWhlYWRlclwiPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtaW5lLXRpdGxlXCI+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInRpdGxlLWljb25cIiBkYXRhLWljbz1cInBpY2tcIj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInRpdGxlLWxhYmVsXCI+XHU2MzE2XHU3N0ZGXHU5NzYyXHU2NzdGPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtaW5lLWNoaXBzXCI+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInBpbGxcIiBpZD1cInN0YXR1c1RhZ1wiPlx1NUY4NVx1NjczQTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicGlsbCBwaWxsLWN5Y2xlXCI+PHNwYW4gZGF0YS1pY289XCJjbG9ja1wiPjwvc3Bhbj5cdTU0NjhcdTY3MUYgPHNwYW4gaWQ9XCJjeWNsZVwiPjNzPC9zcGFuPjwvc3Bhbj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9oZWFkZXI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtaW5lLWdyaWRcIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWluZS1nYXVnZVwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJpbmdcIiBpZD1cInJpbmdcIj5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJpbmctY29yZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGlkPVwicmluZ1BjdFwiPjAlPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzbWFsbD5cdTg4QzVcdThGN0RcdTczODc8L3NtYWxsPlxyXG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJpbmctZ2xvdyByaW5nLWdsb3ctYVwiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJpbmctZ2xvdyByaW5nLWdsb3ctYlwiPjwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtaW5lLXByb2dyZXNzXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWluZS1wcm9ncmVzcy1tZXRhXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuPlx1NzdGRlx1OEY2Nlx1ODhDNVx1OEY3RDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgPHN0cm9uZyBpZD1cInBlcmNlbnRcIj4wJTwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWluZS1wcm9ncmVzcy10cmFja1wiPlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWluZS1wcm9ncmVzcy1maWxsXCIgaWQ9XCJmaWxsXCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJzdGF0dXNUZXh0XCIgY2xhc3M9XCJtaW5lLXN0YXR1c1wiPjwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1pbmUtYWN0aW9ucy1ncmlkXCI+XHJcbiAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInN0YXJ0XCIgY2xhc3M9XCJidG4gYnRuLWJ1eSBzcGFuLTJcIj48c3BhbiBkYXRhLWljbz1cInBsYXlcIj48L3NwYW4+XHU1RjAwXHU1OUNCXHU2MzE2XHU3N0ZGPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInN0b3BcIiBjbGFzcz1cImJ0biBidG4tZ2hvc3RcIj48c3BhbiBkYXRhLWljbz1cInN0b3BcIj48L3NwYW4+XHU1MDVDXHU2QjYyPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImNvbGxlY3RcIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiPjxzcGFuIGRhdGEtaWNvPVwiY29sbGVjdFwiPjwvc3Bhbj5cdTY1MzZcdTc3RkY8L2J1dHRvbj5cclxuICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwic3RhdHVzXCIgY2xhc3M9XCJidG4gYnRuLWdob3N0XCI+PHNwYW4gZGF0YS1pY289XCJyZWZyZXNoXCI+PC9zcGFuPlx1NTIzN1x1NjVCMFx1NzJCNlx1NjAwMTwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJyZXBhaXJcIiBjbGFzcz1cImJ0biBidG4tc2VsbFwiPjxzcGFuIGRhdGEtaWNvPVwid3JlbmNoXCI+PC9zcGFuPlx1NEZFRVx1NzQwNjwvYnV0dG9uPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1pbmUtZmVlZFwiPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJldmVudC1mZWVkXCIgaWQ9XCJldmVudHNcIj48L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtaW5lLWhvbG9ncmFtXCIgaWQ9XCJob2xvZ3JhbVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxyXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibWluZS1ob2xvLWdyaWRcIj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJtaW5lLWhvbG8tZ3JpZCBkaWFnb25hbFwiPjwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm1pbmUtaG9sby1nbG93XCI+PC9zcGFuPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvc2VjdGlvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9zZWN0aW9uPlxyXG4gICAgYCk7XHJcblxyXG4gICAgcm9vdC5pbm5lckhUTUwgPSAnJztcclxuICAgIHJvb3QuYXBwZW5kQ2hpbGQobmF2KTtcclxuICAgIHJvb3QuYXBwZW5kQ2hpbGQoYmFyLnJvb3QpO1xyXG4gICAgcm9vdC5hcHBlbmRDaGlsZCh2aWV3KTtcclxuXHJcbiAgICB0aGlzLnZpZXcgPSB2aWV3O1xyXG4gICAgLy8gbW91bnQgaWNvbnMgaW4gaGVhZGVyL2J1dHRvbnNcclxuICAgIHRyeSB7XHJcbiAgICAgIHZpZXcucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtaWNvXScpXHJcbiAgICAgICAgLmZvckVhY2goKGVsKSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBuYW1lID0gKGVsIGFzIEhUTUxFbGVtZW50KS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWNvJykgYXMgYW55O1xyXG4gICAgICAgICAgdHJ5IHsgZWwuYXBwZW5kQ2hpbGQocmVuZGVySWNvbihuYW1lLCB7IHNpemU6IDIwIH0pKTsgfSBjYXRjaCB7fVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCB7fVxyXG4gICAgdGhpcy5jYWNoZUVsZW1lbnRzKCk7XHJcbiAgICB0aGlzLmF0dGFjaEhhbmRsZXJzKGJhci51cGRhdGUuYmluZChiYXIpKTtcclxuICAgIGF3YWl0IGJhci51cGRhdGUoKTtcclxuICAgIHRoaXMuc2V0dXBSZWFsdGltZSgpO1xyXG4gICAgYXdhaXQgdGhpcy5yZWZyZXNoU3RhdHVzKCk7XHJcbiAgICB0aGlzLnVwZGF0ZVByb2dyZXNzKCk7XHJcbiAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNhY2hlRWxlbWVudHMoKSB7XHJcbiAgICBpZiAoIXRoaXMudmlldykgcmV0dXJuO1xyXG4gICAgdGhpcy5lbHMuZmlsbCA9IHFzKHRoaXMudmlldywgJyNmaWxsJyk7XHJcbiAgICB0aGlzLmVscy5wZXJjZW50ID0gcXModGhpcy52aWV3LCAnI3BlcmNlbnQnKTtcclxuICAgIHRoaXMuZWxzLnN0YXR1c1RleHQgPSBxcyh0aGlzLnZpZXcsICcjc3RhdHVzVGV4dCcpO1xyXG4gICAgdGhpcy5lbHMucmluZyA9IHRoaXMudmlldy5xdWVyeVNlbGVjdG9yKCcjcmluZycpO1xyXG4gICAgdGhpcy5lbHMucmluZ1BjdCA9IHRoaXMudmlldy5xdWVyeVNlbGVjdG9yKCcjcmluZ1BjdCcpO1xyXG4gICAgdGhpcy5lbHMuY3ljbGUgPSB0aGlzLnZpZXcucXVlcnlTZWxlY3RvcignI2N5Y2xlJyk7XHJcbiAgICB0aGlzLmVscy5zdGF0dXNUYWcgPSB0aGlzLnZpZXcucXVlcnlTZWxlY3RvcignI3N0YXR1c1RhZycpO1xyXG4gICAgdGhpcy5lbHMuZXZlbnRzID0gdGhpcy52aWV3LnF1ZXJ5U2VsZWN0b3IoJyNldmVudHMnKTtcclxuICAgIHRoaXMuZWxzLnN0YXJ0ID0gcXM8SFRNTEJ1dHRvbkVsZW1lbnQ+KHRoaXMudmlldywgJyNzdGFydCcpO1xyXG4gICAgdGhpcy5lbHMuc3RvcCA9IHFzPEhUTUxCdXR0b25FbGVtZW50Pih0aGlzLnZpZXcsICcjc3RvcCcpO1xyXG4gICAgdGhpcy5lbHMuY29sbGVjdCA9IHFzPEhUTUxCdXR0b25FbGVtZW50Pih0aGlzLnZpZXcsICcjY29sbGVjdCcpO1xyXG4gICAgdGhpcy5lbHMucmVwYWlyID0gcXM8SFRNTEJ1dHRvbkVsZW1lbnQ+KHRoaXMudmlldywgJyNyZXBhaXInKTtcclxuICAgIHRoaXMuZWxzLnN0YXR1c0J0biA9IHFzPEhUTUxCdXR0b25FbGVtZW50Pih0aGlzLnZpZXcsICcjc3RhdHVzJyk7XHJcbiAgICB0aGlzLmVscy5ob2xvZ3JhbSA9IHRoaXMudmlldy5xdWVyeVNlbGVjdG9yKCcjaG9sb2dyYW0nKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXR0YWNoSGFuZGxlcnModXBkYXRlQmFyOiAoKSA9PiBQcm9taXNlPHZvaWQ+KSB7XHJcbiAgICBpZiAoIXRoaXMudmlldykgcmV0dXJuO1xyXG4gICAgdGhpcy5lbHMuc3RhcnQ/LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdGhpcy5oYW5kbGVTdGFydCgpKTtcclxuICAgIHRoaXMuZWxzLnN0b3A/LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdGhpcy5oYW5kbGVTdG9wKCkpO1xyXG4gICAgdGhpcy5lbHMuc3RhdHVzQnRuPy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRoaXMucmVmcmVzaFN0YXR1cygpKTtcclxuICAgIHRoaXMuZWxzLnJlcGFpcj8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0aGlzLmhhbmRsZVJlcGFpcigpKTtcclxuICAgIHRoaXMuZWxzLmNvbGxlY3Q/LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdGhpcy5oYW5kbGVDb2xsZWN0KHVwZGF0ZUJhcikpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzZXR1cFJlYWx0aW1lKCkge1xyXG4gICAgY29uc3QgdG9rZW4gPSBOZXR3b3JrTWFuYWdlci5JLmdldFRva2VuKCk7XHJcbiAgICBpZiAodG9rZW4pIFJlYWx0aW1lQ2xpZW50LkkuY29ubmVjdCh0b2tlbik7XHJcblxyXG4gICAgaWYgKHRoaXMubWluZVVwZGF0ZUhhbmRsZXIpIFJlYWx0aW1lQ2xpZW50Lkkub2ZmKCdtaW5lLnVwZGF0ZScsIHRoaXMubWluZVVwZGF0ZUhhbmRsZXIpO1xyXG4gICAgaWYgKHRoaXMubWluZUNvbGxhcHNlSGFuZGxlcikgUmVhbHRpbWVDbGllbnQuSS5vZmYoJ21pbmUuY29sbGFwc2UnLCB0aGlzLm1pbmVDb2xsYXBzZUhhbmRsZXIpO1xyXG4gICAgaWYgKHRoaXMucGx1bmRlckhhbmRsZXIpIFJlYWx0aW1lQ2xpZW50Lkkub2ZmKCdwbHVuZGVyLmF0dGFja2VkJywgdGhpcy5wbHVuZGVySGFuZGxlcik7XHJcblxyXG4gICAgdGhpcy5taW5lVXBkYXRlSGFuZGxlciA9IChtc2cpID0+IHtcclxuICAgICAgdGhpcy5jYXJ0QW10ID0gdHlwZW9mIG1zZy5jYXJ0QW1vdW50ID09PSAnbnVtYmVyJyA/IG1zZy5jYXJ0QW1vdW50IDogdGhpcy5jYXJ0QW10O1xyXG4gICAgICB0aGlzLmNhcnRDYXAgPSB0eXBlb2YgbXNnLmNhcnRDYXBhY2l0eSA9PT0gJ251bWJlcicgPyBtc2cuY2FydENhcGFjaXR5IDogdGhpcy5jYXJ0Q2FwO1xyXG4gICAgICB0aGlzLmlzTWluaW5nID0gbXNnLnJ1bm5pbmcgPz8gdGhpcy5pc01pbmluZztcclxuICAgICAgaWYgKG1zZy5jb2xsYXBzZWQgJiYgbXNnLmNvbGxhcHNlZFJlbWFpbmluZykge1xyXG4gICAgICAgIHRoaXMuYmVnaW5Db2xsYXBzZUNvdW50ZG93bihtc2cuY29sbGFwc2VkUmVtYWluaW5nKTtcclxuICAgICAgfSBlbHNlIGlmICghbXNnLmNvbGxhcHNlZCkge1xyXG4gICAgICAgIHRoaXMuaXNDb2xsYXBzZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmNsZWFyQ29sbGFwc2VUaW1lcigpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMudXBkYXRlUHJvZ3Jlc3MoKTtcclxuICAgICAgaWYgKG1zZy50eXBlID09PSAnY3JpdGljYWwnICYmIG1zZy5hbW91bnQpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoYFx1ODlFNlx1NTNEMVx1NjZCNFx1NTFGQlx1RkYwQ1x1NzdGRlx1OEY2Nlx1NTg5RVx1NTJBMCAke21zZy5hbW91bnR9XHVGRjAxYCk7XHJcbiAgICAgICAgdGhpcy5sb2dFdmVudChgXHU2NkI0XHU1MUZCICske21zZy5hbW91bnR9YCk7XHJcbiAgICAgIH0gZWxzZSBpZiAobXNnLnR5cGUgPT09ICdub3JtYWwnICYmIG1zZy5hbW91bnQpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoYFx1NzdGRlx1OEY2Nlx1NTg5RVx1NTJBMCAke21zZy5hbW91bnR9XHVGRjBDXHU1RjUzXHU1MjREICR7dGhpcy5mb3JtYXRQZXJjZW50KCl9YCk7XHJcbiAgICAgICAgdGhpcy5sb2dFdmVudChgXHU2MzE2XHU2Mzk4ICske21zZy5hbW91bnR9YCk7XHJcbiAgICAgIH0gZWxzZSBpZiAobXNnLnR5cGUgPT09ICdjb2xsYXBzZScpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoJ1x1NzdGRlx1OTA1M1x1NTc0RFx1NTg0Q1x1RkYwQ1x1OEJGN1x1N0FDQlx1NTM3M1x1NEZFRVx1NzQwNicpO1xyXG4gICAgICAgIHRoaXMubG9nRXZlbnQoJ1x1NzdGRlx1OTA1M1x1NTc0RFx1NTg0QycpO1xyXG4gICAgICB9IGVsc2UgaWYgKG1zZy50eXBlID09PSAnY29sbGVjdCcpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoJ1x1NzdGRlx1NzdGM1x1NURGMlx1NjUzNlx1OTZDNlx1RkYwQ1x1NzdGRlx1OEY2Nlx1NkUwNVx1N0E3QScpO1xyXG4gICAgICAgIHRoaXMubG9nRXZlbnQoJ1x1NjUzNlx1OTZDNlx1NUI4Q1x1NjIxMCcpO1xyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaXNDb2xsYXBzZWQpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoYFx1NzdGRlx1OTA1M1x1NTc0RFx1NTg0Q1x1RkYwQ1x1NTI2OVx1NEY1OSAke3RoaXMuY29sbGFwc2VSZW1haW5pbmd9c2ApO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMudXBkYXRlQ29udHJvbHMoKTtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5taW5lQ29sbGFwc2VIYW5kbGVyID0gKG1zZykgPT4ge1xyXG4gICAgICBjb25zdCBzZWNvbmRzID0gTnVtYmVyKG1zZz8ucmVwYWlyX2R1cmF0aW9uKSB8fCAwO1xyXG4gICAgICBpZiAoc2Vjb25kcyA+IDApIHRoaXMuYmVnaW5Db2xsYXBzZUNvdW50ZG93bihzZWNvbmRzKTtcclxuICAgICAgc2hvd1RvYXN0KGBcdTc3RkZcdTkwNTNcdTU3NERcdTU4NENcdUZGMENcdTk3MDBcdTRGRUVcdTc0MDZcdUZGMDhcdTdFQTYgJHtzZWNvbmRzfXNcdUZGMDlgLCAnd2FybicpO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnBsdW5kZXJIYW5kbGVyID0gKG1zZykgPT4ge1xyXG4gICAgICBzaG93VG9hc3QoYFx1ODhBQlx1NjNBMFx1NTkzQVx1RkYxQVx1Njc2NVx1ODFFQSAke21zZy5hdHRhY2tlcn1cdUZGMENcdTYzNUZcdTU5MzEgJHttc2cubG9zc31gLCAnd2FybicpO1xyXG4gICAgICB0aGlzLmxvZ0V2ZW50KGBcdTg4QUIgJHttc2cuYXR0YWNrZXJ9IFx1NjNBMFx1NTkzQSAtJHttc2cubG9zc31gKTtcclxuICAgIH07XHJcblxyXG4gICAgUmVhbHRpbWVDbGllbnQuSS5vbignbWluZS51cGRhdGUnLCB0aGlzLm1pbmVVcGRhdGVIYW5kbGVyKTtcclxuICAgIFJlYWx0aW1lQ2xpZW50Lkkub24oJ21pbmUuY29sbGFwc2UnLCB0aGlzLm1pbmVDb2xsYXBzZUhhbmRsZXIpO1xyXG4gICAgUmVhbHRpbWVDbGllbnQuSS5vbigncGx1bmRlci5hdHRhY2tlZCcsIHRoaXMucGx1bmRlckhhbmRsZXIpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhc3luYyBoYW5kbGVTdGFydCgpIHtcclxuICAgIGlmICh0aGlzLnBlbmRpbmcgfHwgdGhpcy5pc0NvbGxhcHNlZCkge1xyXG4gICAgICBpZiAodGhpcy5pc0NvbGxhcHNlZCkgc2hvd1RvYXN0KCdcdTc3RkZcdTkwNTNcdTU3NERcdTU4NENcdUZGMENcdThCRjdcdTUxNDhcdTRGRUVcdTc0MDYnLCAnd2FybicpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0aGlzLnBlbmRpbmcgPSAnc3RhcnQnO1xyXG4gICAgdGhpcy51cGRhdGVDb250cm9scygpO1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3Qgc3RhdHVzID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PE1pbmVTdGF0dXM+KCcvbWluZS9zdGFydCcsIHsgbWV0aG9kOiAnUE9TVCcgfSk7XHJcbiAgICAgIHRoaXMuYXBwbHlTdGF0dXMoc3RhdHVzKTtcclxuICAgICAgdGhpcy5zZXRTdGF0dXNNZXNzYWdlKCdcdTc3RkZcdTY3M0FcdTVERjJcdTU0MkZcdTUyQTgnKTtcclxuICAgICAgc2hvd1RvYXN0KCdcdTc3RkZcdTY3M0FcdTVERjJcdTU0MkZcdTUyQTgnLCAnc3VjY2VzcycpO1xyXG4gICAgfSBjYXRjaCAoZTogYW55KSB7XHJcbiAgICAgIHNob3dUb2FzdChlPy5tZXNzYWdlIHx8ICdcdTU0MkZcdTUyQThcdTU5MzFcdThEMjUnLCAnZXJyb3InKTtcclxuICAgIH0gZmluYWxseSB7XHJcbiAgICAgIHRoaXMucGVuZGluZyA9IG51bGw7XHJcbiAgICAgIHRoaXMudXBkYXRlQ29udHJvbHMoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXN5bmMgaGFuZGxlU3RvcCgpIHtcclxuICAgIGlmICh0aGlzLnBlbmRpbmcpIHJldHVybjtcclxuICAgIHRoaXMucGVuZGluZyA9ICdzdG9wJztcclxuICAgIHRoaXMudXBkYXRlQ29udHJvbHMoKTtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHN0YXR1cyA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDxNaW5lU3RhdHVzPignL21pbmUvc3RvcCcsIHsgbWV0aG9kOiAnUE9TVCcgfSk7XHJcbiAgICAgIHRoaXMuYXBwbHlTdGF0dXMoc3RhdHVzKTtcclxuICAgICAgdGhpcy5zZXRTdGF0dXNNZXNzYWdlKCdcdTc3RkZcdTY3M0FcdTVERjJcdTUwNUNcdTZCNjInKTtcclxuICAgICAgc2hvd1RvYXN0KCdcdTc3RkZcdTY3M0FcdTVERjJcdTUwNUNcdTZCNjInLCAnc3VjY2VzcycpO1xyXG4gICAgfSBjYXRjaCAoZTogYW55KSB7XHJcbiAgICAgIHNob3dUb2FzdChlPy5tZXNzYWdlIHx8ICdcdTUwNUNcdTZCNjJcdTU5MzFcdThEMjUnLCAnZXJyb3InKTtcclxuICAgIH0gZmluYWxseSB7XHJcbiAgICAgIHRoaXMucGVuZGluZyA9IG51bGw7XHJcbiAgICAgIHRoaXMudXBkYXRlQ29udHJvbHMoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXN5bmMgaGFuZGxlQ29sbGVjdCh1cGRhdGVCYXI6ICgpID0+IFByb21pc2U8dm9pZD4pIHtcclxuICAgIGlmICh0aGlzLnBlbmRpbmcgfHwgdGhpcy5jYXJ0QW10IDw9IDApIHJldHVybjtcclxuICAgIHRoaXMucGVuZGluZyA9ICdjb2xsZWN0JztcclxuICAgIHRoaXMudXBkYXRlQ29udHJvbHMoKTtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IGNvbGxlY3RlZDogbnVtYmVyOyBzdGF0dXM6IE1pbmVTdGF0dXMgfT4oJy9taW5lL2NvbGxlY3QnLCB7IG1ldGhvZDogJ1BPU1QnIH0pO1xyXG4gICAgICBpZiAocmVzLnN0YXR1cykgdGhpcy5hcHBseVN0YXR1cyhyZXMuc3RhdHVzKTtcclxuICAgICAgaWYgKHJlcy5jb2xsZWN0ZWQgPiAwKSB7XHJcbiAgICAgICAgLy8gXHU1MjFCXHU1RUZBXHU2MjlCXHU3MjY5XHU3RUJGXHU5OERFXHU4ODRDXHU1MkE4XHU3NTNCXHJcbiAgICAgICAgdGhpcy5jcmVhdGVGbHlpbmdPcmVBbmltYXRpb24ocmVzLmNvbGxlY3RlZCk7XHJcbiAgICAgICAgc2hvd1RvYXN0KGBcdTY1MzZcdTk2QzZcdTc3RkZcdTc3RjMgJHtyZXMuY29sbGVjdGVkfWAsICdzdWNjZXNzJyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2hvd1RvYXN0KCdcdTc3RkZcdThGNjZcdTRFM0FcdTdBN0FcdUZGMENcdTY1RTBcdTc3RkZcdTc3RjNcdTUzRUZcdTY1MzZcdTk2QzYnLCAnd2FybicpO1xyXG4gICAgICB9XHJcbiAgICAgIGF3YWl0IHVwZGF0ZUJhcigpO1xyXG4gICAgfSBjYXRjaCAoZTogYW55KSB7XHJcbiAgICAgIHNob3dUb2FzdChlPy5tZXNzYWdlIHx8ICdcdTY1MzZcdTc3RkZcdTU5MzFcdThEMjUnLCAnZXJyb3InKTtcclxuICAgIH0gZmluYWxseSB7XHJcbiAgICAgIHRoaXMucGVuZGluZyA9IG51bGw7XHJcbiAgICAgIHRoaXMudXBkYXRlQ29udHJvbHMoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgY3JlYXRlRmx5aW5nT3JlQW5pbWF0aW9uKGFtb3VudDogbnVtYmVyKSB7XHJcbiAgICBjb25zdCBmaWxsRWwgPSB0aGlzLmVscy5maWxsO1xyXG4gICAgY29uc3Qgb3JlRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjb3JlJyk7XHJcbiAgICBpZiAoIWZpbGxFbCB8fCAhb3JlRWwpIHJldHVybjtcclxuXHJcbiAgICBjb25zdCBzdGFydFJlY3QgPSBmaWxsRWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICBjb25zdCBlbmRSZWN0ID0gb3JlRWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblxyXG4gICAgLy8gXHU1MjFCXHU1RUZBXHU1OTFBXHU0RTJBXHU3N0ZGXHU3N0YzXHU3QzkyXHU1QjUwXHJcbiAgICBjb25zdCBwYXJ0aWNsZUNvdW50ID0gTWF0aC5taW4oOCwgTWF0aC5tYXgoMywgTWF0aC5mbG9vcihhbW91bnQgLyAyMCkpKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFydGljbGVDb3VudDsgaSsrKSB7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHBhcnRpY2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgcGFydGljbGUuY2xhc3NOYW1lID0gJ29yZS1wYXJ0aWNsZSc7XHJcbiAgICAgICAgcGFydGljbGUudGV4dENvbnRlbnQgPSAnXHVEODNEXHVEQzhFJztcclxuICAgICAgICBwYXJ0aWNsZS5zdHlsZS5jc3NUZXh0ID0gYFxyXG4gICAgICAgICAgcG9zaXRpb246IGZpeGVkO1xyXG4gICAgICAgICAgbGVmdDogJHtzdGFydFJlY3QubGVmdCArIHN0YXJ0UmVjdC53aWR0aCAvIDJ9cHg7XHJcbiAgICAgICAgICB0b3A6ICR7c3RhcnRSZWN0LnRvcCArIHN0YXJ0UmVjdC5oZWlnaHQgLyAyfXB4O1xyXG4gICAgICAgICAgZm9udC1zaXplOiAyNHB4O1xyXG4gICAgICAgICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XHJcbiAgICAgICAgICB6LWluZGV4OiA5OTk5O1xyXG4gICAgICAgICAgZmlsdGVyOiBkcm9wLXNoYWRvdygwIDAgOHB4IHJnYmEoMTIzLDQ0LDI0NSwwLjgpKTtcclxuICAgICAgICBgO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocGFydGljbGUpO1xyXG5cclxuICAgICAgICBjb25zdCBkeCA9IGVuZFJlY3QubGVmdCArIGVuZFJlY3Qud2lkdGggLyAyIC0gc3RhcnRSZWN0LmxlZnQgLSBzdGFydFJlY3Qud2lkdGggLyAyO1xyXG4gICAgICAgIGNvbnN0IGR5ID0gZW5kUmVjdC50b3AgKyBlbmRSZWN0LmhlaWdodCAvIDIgLSBzdGFydFJlY3QudG9wIC0gc3RhcnRSZWN0LmhlaWdodCAvIDI7XHJcbiAgICAgICAgY29uc3QgcmFuZG9tT2Zmc2V0ID0gKE1hdGgucmFuZG9tKCkgLSAwLjUpICogMTAwO1xyXG5cclxuICAgICAgICBwYXJ0aWNsZS5hbmltYXRlKFtcclxuICAgICAgICAgIHsgXHJcbiAgICAgICAgICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZSgwLCAwKSBzY2FsZSgxKScsIFxyXG4gICAgICAgICAgICBvcGFjaXR5OiAxIFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHsgXHJcbiAgICAgICAgICAgIHRyYW5zZm9ybTogYHRyYW5zbGF0ZSgke2R4LzIgKyByYW5kb21PZmZzZXR9cHgsICR7ZHkgLSAxNTB9cHgpIHNjYWxlKDEuMilgLCBcclxuICAgICAgICAgICAgb3BhY2l0eTogMSxcclxuICAgICAgICAgICAgb2Zmc2V0OiAwLjVcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7IFxyXG4gICAgICAgICAgICB0cmFuc2Zvcm06IGB0cmFuc2xhdGUoJHtkeH1weCwgJHtkeX1weCkgc2NhbGUoMC41KWAsIFxyXG4gICAgICAgICAgICBvcGFjaXR5OiAwIFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIF0sIHtcclxuICAgICAgICAgIGR1cmF0aW9uOiAxMDAwICsgaSAqIDUwLFxyXG4gICAgICAgICAgZWFzaW5nOiAnY3ViaWMtYmV6aWVyKDAuMjUsIDAuNDYsIDAuNDUsIDAuOTQpJ1xyXG4gICAgICAgIH0pLm9uZmluaXNoID0gKCkgPT4ge1xyXG4gICAgICAgICAgcGFydGljbGUucmVtb3ZlKCk7XHJcbiAgICAgICAgICAvLyBcdTY3MDBcdTU0MEVcdTRFMDBcdTRFMkFcdTdDOTJcdTVCNTBcdTUyMzBcdThGQkVcdTY1RjZcdUZGMENcdTZERkJcdTUyQTBcdTgxMDlcdTUxQjJcdTY1NDhcdTY3OUNcclxuICAgICAgICAgIGlmIChpID09PSBwYXJ0aWNsZUNvdW50IC0gMSkge1xyXG4gICAgICAgICAgICBvcmVFbC5jbGFzc0xpc3QuYWRkKCdmbGFzaCcpO1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IG9yZUVsLmNsYXNzTGlzdC5yZW1vdmUoJ2ZsYXNoJyksIDkwMCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgfSwgaSAqIDgwKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXN5bmMgaGFuZGxlUmVwYWlyKCkge1xyXG4gICAgaWYgKHRoaXMucGVuZGluZyB8fCAhdGhpcy5pc0NvbGxhcHNlZCkgcmV0dXJuO1xyXG4gICAgdGhpcy5wZW5kaW5nID0gJ3JlcGFpcic7XHJcbiAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzKCk7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBzdGF0dXMgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8TWluZVN0YXR1cz4oJy9taW5lL3JlcGFpcicsIHsgbWV0aG9kOiAnUE9TVCcgfSk7XHJcbiAgICAgIHRoaXMuYXBwbHlTdGF0dXMoc3RhdHVzKTtcclxuICAgICAgdGhpcy5zZXRTdGF0dXNNZXNzYWdlKCdcdTc3RkZcdTkwNTNcdTVERjJcdTRGRUVcdTU5MERcdUZGMENcdTUzRUZcdTkxQ0RcdTY1QjBcdTU0MkZcdTUyQTgnKTtcclxuICAgICAgc2hvd1RvYXN0KCdcdTc3RkZcdTkwNTNcdTVERjJcdTRGRUVcdTU5MEQnLCAnc3VjY2VzcycpO1xyXG4gICAgfSBjYXRjaCAoZTogYW55KSB7XHJcbiAgICAgIHNob3dUb2FzdChlPy5tZXNzYWdlIHx8ICdcdTRGRUVcdTc0MDZcdTU5MzFcdThEMjUnLCAnZXJyb3InKTtcclxuICAgIH0gZmluYWxseSB7XHJcbiAgICAgIHRoaXMucGVuZGluZyA9IG51bGw7XHJcbiAgICAgIHRoaXMudXBkYXRlQ29udHJvbHMoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXN5bmMgcmVmcmVzaFN0YXR1cygpIHtcclxuICAgIGlmICh0aGlzLnBlbmRpbmcgPT09ICdzdGF0dXMnKSByZXR1cm47XHJcbiAgICB0aGlzLnBlbmRpbmcgPSAnc3RhdHVzJztcclxuICAgIHRoaXMudXBkYXRlQ29udHJvbHMoKTtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHN0YXR1cyA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDxNaW5lU3RhdHVzPignL21pbmUvc3RhdHVzJyk7XHJcbiAgICAgIHRoaXMuYXBwbHlTdGF0dXMoc3RhdHVzKTtcclxuICAgIH0gY2F0Y2ggKGU6IGFueSkge1xyXG4gICAgICBzaG93VG9hc3QoZT8ubWVzc2FnZSB8fCAnXHU4M0I3XHU1M0Q2XHU3MkI2XHU2MDAxXHU1OTMxXHU4RDI1JywgJ2Vycm9yJyk7XHJcbiAgICB9IGZpbmFsbHkge1xyXG4gICAgICB0aGlzLnBlbmRpbmcgPSBudWxsO1xyXG4gICAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFwcGx5U3RhdHVzKHN0YXR1czogTWluZVN0YXR1cyB8IHVuZGVmaW5lZCwgb3B0czogeyBxdWlldD86IGJvb2xlYW4gfSA9IHt9KSB7XHJcbiAgICBpZiAoIXN0YXR1cykgcmV0dXJuO1xyXG4gICAgdGhpcy5jYXJ0QW10ID0gc3RhdHVzLmNhcnRBbW91bnQgPz8gdGhpcy5jYXJ0QW10O1xyXG4gICAgdGhpcy5jYXJ0Q2FwID0gc3RhdHVzLmNhcnRDYXBhY2l0eSA/PyB0aGlzLmNhcnRDYXA7XHJcbiAgICB0aGlzLmludGVydmFsTXMgPSBzdGF0dXMuaW50ZXJ2YWxNcyA/PyB0aGlzLmludGVydmFsTXM7XHJcbiAgICB0aGlzLmlzTWluaW5nID0gQm9vbGVhbihzdGF0dXMucnVubmluZyk7XHJcbiAgICB0aGlzLmlzQ29sbGFwc2VkID0gQm9vbGVhbihzdGF0dXMuY29sbGFwc2VkKTtcclxuICAgIGlmIChzdGF0dXMuY29sbGFwc2VkICYmIHN0YXR1cy5jb2xsYXBzZWRSZW1haW5pbmcgPiAwKSB7XHJcbiAgICAgIHRoaXMuYmVnaW5Db2xsYXBzZUNvdW50ZG93bihzdGF0dXMuY29sbGFwc2VkUmVtYWluaW5nKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuY2xlYXJDb2xsYXBzZVRpbWVyKCk7XHJcbiAgICAgIHRoaXMuY29sbGFwc2VSZW1haW5pbmcgPSAwO1xyXG4gICAgfVxyXG4gICAgdGhpcy51cGRhdGVQcm9ncmVzcygpO1xyXG4gICAgaWYgKCFvcHRzLnF1aWV0KSB7XHJcbiAgICAgIGlmICh0aGlzLmlzQ29sbGFwc2VkICYmIHRoaXMuY29sbGFwc2VSZW1haW5pbmcgPiAwKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0dXNNZXNzYWdlKGBcdTc3RkZcdTkwNTNcdTU3NERcdTU4NENcdUZGMENcdTUyNjlcdTRGNTkgJHt0aGlzLmNvbGxhcHNlUmVtYWluaW5nfXNgKTtcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLmlzTWluaW5nKSB7XHJcbiAgICAgICAgY29uc3Qgc2Vjb25kcyA9IE1hdGgubWF4KDEsIE1hdGgucm91bmQodGhpcy5pbnRlcnZhbE1zIC8gMTAwMCkpO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZShgXHU3N0ZGXHU2NzNBXHU4RkQwXHU4ODRDXHU0RTJEXHVGRjBDXHU1NDY4XHU2NzFGXHU3RUE2ICR7c2Vjb25kc31zXHVGRjBDXHU1RjUzXHU1MjREICR7dGhpcy5mb3JtYXRQZXJjZW50KCl9YCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0dXNNZXNzYWdlKCdcdTc3RkZcdTY3M0FcdTVERjJcdTUwNUNcdTZCNjJcdUZGMENcdTcwQjlcdTUxRkJcdTVGMDBcdTU5Q0JcdTYzMTZcdTc3RkYnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuZWxzLmN5Y2xlKSB7XHJcbiAgICAgIGNvbnN0IHNlY29uZHMgPSBNYXRoLm1heCgxLCBNYXRoLnJvdW5kKHRoaXMuaW50ZXJ2YWxNcyAvIDEwMDApKTtcclxuICAgICAgdGhpcy5lbHMuY3ljbGUudGV4dENvbnRlbnQgPSBgJHtzZWNvbmRzfXNgO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuZWxzLnN0YXR1c1RhZykge1xyXG4gICAgICBjb25zdCBlbCA9IHRoaXMuZWxzLnN0YXR1c1RhZyBhcyBIVE1MRWxlbWVudDtcclxuICAgICAgZWwuaW5uZXJIVE1MID0gJyc7XHJcbiAgICAgIFxyXG4gICAgICAvLyBcdTc5RkJcdTk2NjRcdTYyNDBcdTY3MDlcdTcyQjZcdTYwMDFcdTdDN0JcclxuICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZSgncGlsbC1ydW5uaW5nJywgJ3BpbGwtY29sbGFwc2VkJyk7XHJcbiAgICAgIFxyXG4gICAgICBjb25zdCBpY28gPSB0aGlzLmlzQ29sbGFwc2VkID8gJ2Nsb3NlJyA6ICh0aGlzLmlzTWluaW5nID8gJ2JvbHQnIDogJ2Nsb2NrJyk7XHJcbiAgICAgIHRyeSB7IGVsLmFwcGVuZENoaWxkKHJlbmRlckljb24oaWNvIGFzIGFueSwgeyBzaXplOiAxNiB9KSk7IH0gY2F0Y2gge31cclxuICAgICAgZWwuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGhpcy5pc0NvbGxhcHNlZCA/ICdcdTU3NERcdTU4NEMnIDogKHRoaXMuaXNNaW5pbmcgPyAnXHU4RkQwXHU4ODRDXHU0RTJEJyA6ICdcdTVGODVcdTY3M0EnKSkpO1xyXG4gICAgICBcclxuICAgICAgLy8gXHU2REZCXHU1MkEwXHU1QkY5XHU1RTk0XHU3Njg0XHU1MkE4XHU2MDAxXHU2ODM3XHU1RjBGXHU3QzdCXHJcbiAgICAgIGlmICh0aGlzLmlzQ29sbGFwc2VkKSB7XHJcbiAgICAgICAgZWwuY2xhc3NMaXN0LmFkZCgncGlsbC1jb2xsYXBzZWQnKTtcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLmlzTWluaW5nKSB7XHJcbiAgICAgICAgZWwuY2xhc3NMaXN0LmFkZCgncGlsbC1ydW5uaW5nJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHRoaXMudXBkYXRlQ29udHJvbHMoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYmVnaW5Db2xsYXBzZUNvdW50ZG93bihzZWNvbmRzOiBudW1iZXIpIHtcclxuICAgIHRoaXMuY2xlYXJDb2xsYXBzZVRpbWVyKCk7XHJcbiAgICB0aGlzLmlzQ29sbGFwc2VkID0gdHJ1ZTtcclxuICAgIHRoaXMuY29sbGFwc2VSZW1haW5pbmcgPSBNYXRoLm1heCgwLCBNYXRoLmZsb29yKHNlY29uZHMpKTtcclxuICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZShgXHU3N0ZGXHU5MDUzXHU1NzREXHU1ODRDXHVGRjBDXHU1MjY5XHU0RjU5ICR7dGhpcy5jb2xsYXBzZVJlbWFpbmluZ31zYCk7XHJcbiAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzKCk7XHJcbiAgICB0aGlzLmNvbGxhcHNlVGltZXIgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICB0aGlzLmNvbGxhcHNlUmVtYWluaW5nID0gTWF0aC5tYXgoMCwgdGhpcy5jb2xsYXBzZVJlbWFpbmluZyAtIDEpO1xyXG4gICAgICBpZiAodGhpcy5jb2xsYXBzZVJlbWFpbmluZyA8PSAwKSB7XHJcbiAgICAgICAgdGhpcy5jbGVhckNvbGxhcHNlVGltZXIoKTtcclxuICAgICAgICB0aGlzLmlzQ29sbGFwc2VkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0dXNNZXNzYWdlKCdcdTU3NERcdTU4NENcdTg5RTNcdTk2NjRcdUZGMENcdTUzRUZcdTkxQ0RcdTY1QjBcdTU0MkZcdTUyQThcdTc3RkZcdTY3M0EnKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzKCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0dXNNZXNzYWdlKGBcdTc3RkZcdTkwNTNcdTU3NERcdTU4NENcdUZGMENcdTUyNjlcdTRGNTkgJHt0aGlzLmNvbGxhcHNlUmVtYWluaW5nfXNgKTtcclxuICAgICAgfVxyXG4gICAgfSwgMTAwMCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNsZWFyQ29sbGFwc2VUaW1lcigpIHtcclxuICAgIGlmICh0aGlzLmNvbGxhcHNlVGltZXIgIT09IG51bGwpIHtcclxuICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5jb2xsYXBzZVRpbWVyKTtcclxuICAgICAgdGhpcy5jb2xsYXBzZVRpbWVyID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgbGFzdE1pbGVzdG9uZSA9IDA7XHJcblxyXG4gIHByaXZhdGUgdXBkYXRlUHJvZ3Jlc3MoKSB7XHJcbiAgICBpZiAoIXRoaXMuZWxzLmZpbGwgfHwgIXRoaXMuZWxzLnBlcmNlbnQpIHJldHVybjtcclxuICAgIGNvbnN0IHBjdCA9IHRoaXMuY2FydENhcCA+IDAgPyBNYXRoLm1pbigxLCB0aGlzLmNhcnRBbXQgLyB0aGlzLmNhcnRDYXApIDogMDtcclxuICAgIGNvbnN0IHBjdEludCA9IE1hdGgucm91bmQocGN0ICogMTAwKTtcclxuICAgIFxyXG4gICAgdGhpcy5lbHMuZmlsbC5zdHlsZS53aWR0aCA9IGAke3BjdEludH0lYDtcclxuICAgIHRoaXMuZWxzLnBlcmNlbnQudGV4dENvbnRlbnQgPSBgJHtwY3RJbnR9JWA7XHJcbiAgICBcclxuICAgIC8vIFx1NTcwNlx1NzNBRlx1OTg5Q1x1ODI3Mlx1NkUxMFx1NTNEOFx1RkYxQVx1N0QyQlx1ODI3MiAtPiBcdTg0RERcdTgyNzIgLT4gXHU5MUQxXHU4MjcyXHJcbiAgICBsZXQgcmluZ0NvbG9yID0gJyM3QjJDRjUnOyAvLyBcdTdEMkJcdTgyNzJcclxuICAgIGlmIChwY3QgPj0gMC43NSkge1xyXG4gICAgICByaW5nQ29sb3IgPSAnI2Y2YzQ0NSc7IC8vIFx1OTFEMVx1ODI3MlxyXG4gICAgfSBlbHNlIGlmIChwY3QgPj0gMC41KSB7XHJcbiAgICAgIHJpbmdDb2xvciA9ICcjMkM4OUY1JzsgLy8gXHU4NEREXHU4MjcyXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGlmICh0aGlzLmVscy5yaW5nKSB7XHJcbiAgICAgIGNvbnN0IGRlZyA9IE1hdGgucm91bmQocGN0ICogMzYwKTtcclxuICAgICAgKHRoaXMuZWxzLnJpbmcgYXMgSFRNTEVsZW1lbnQpLnN0eWxlLmJhY2tncm91bmQgPSBgY29uaWMtZ3JhZGllbnQoJHtyaW5nQ29sb3J9ICR7ZGVnfWRlZywgcmdiYSgyNTUsMjU1LDI1NSwuMDgpIDBkZWcpYDtcclxuICAgICAgXHJcbiAgICAgIC8vIFx1NkVFMVx1OEY3RFx1NjVGNlx1NjMwMVx1N0VFRFx1OTVFQVx1ODAwMFxyXG4gICAgICBpZiAocGN0ID49IDEpIHtcclxuICAgICAgICB0aGlzLmVscy5yaW5nLmNsYXNzTGlzdC5hZGQoJ3JpbmctZnVsbCcpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuZWxzLnJpbmcuY2xhc3NMaXN0LnJlbW92ZSgncmluZy1mdWxsJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgaWYgKHRoaXMuZWxzLnJpbmdQY3QpIHRoaXMuZWxzLnJpbmdQY3QudGV4dENvbnRlbnQgPSBgJHtwY3RJbnR9JWA7XHJcbiAgICBcclxuICAgIC8vIFx1OTFDQ1x1N0EwQlx1Nzg5MVx1ODEwOVx1NTFCMlx1NzI3OVx1NjU0OFxyXG4gICAgY29uc3QgbWlsZXN0b25lcyA9IFsyNSwgNTAsIDc1LCAxMDBdO1xyXG4gICAgZm9yIChjb25zdCBtaWxlc3RvbmUgb2YgbWlsZXN0b25lcykge1xyXG4gICAgICBpZiAocGN0SW50ID49IG1pbGVzdG9uZSAmJiB0aGlzLmxhc3RNaWxlc3RvbmUgPCBtaWxlc3RvbmUpIHtcclxuICAgICAgICB0aGlzLnRyaWdnZXJNaWxlc3RvbmVQdWxzZShtaWxlc3RvbmUpO1xyXG4gICAgICAgIHRoaXMubGFzdE1pbGVzdG9uZSA9IG1pbGVzdG9uZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBcdTVGNTNcdTg4QzVcdThGN0RcdTczODdcdTRFMEJcdTk2NERcdUZGMDhcdTY1MzZcdTc3RkZcdTU0MEVcdUZGMDlcdTkxQ0RcdTdGNkVcdTkxQ0NcdTdBMEJcdTc4OTFcclxuICAgIGlmIChwY3RJbnQgPCB0aGlzLmxhc3RNaWxlc3RvbmUgLSAxMCkge1xyXG4gICAgICB0aGlzLmxhc3RNaWxlc3RvbmUgPSBNYXRoLmZsb29yKHBjdEludCAvIDI1KSAqIDI1O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyA5MCVcdThCNjZcdTU0NEFcdTYzRDBcdTc5M0FcclxuICAgIGlmIChwY3RJbnQgPj0gOTAgJiYgcGN0SW50IDwgMTAwKSB7XHJcbiAgICAgIGlmICghdGhpcy5lbHMuc3RhdHVzVGV4dD8udGV4dENvbnRlbnQ/LmluY2x1ZGVzKCdcdTUzNzNcdTVDMDZcdTZFRTFcdThGN0QnKSkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZSgnXHUyNkEwXHVGRTBGIFx1NzdGRlx1OEY2Nlx1NTM3M1x1NUMwNlx1NkVFMVx1OEY3RFx1RkYwQ1x1NUVGQVx1OEJBRVx1NjUzNlx1NzdGRicpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGlmICh0aGlzLnBlbmRpbmcgIT09ICdjb2xsZWN0JyAmJiB0aGlzLmVscy5jb2xsZWN0KSB7XHJcbiAgICAgIHRoaXMuZWxzLmNvbGxlY3QuZGlzYWJsZWQgPSB0aGlzLnBlbmRpbmcgPT09ICdjb2xsZWN0JyB8fCB0aGlzLmNhcnRBbXQgPD0gMDtcclxuICAgICAgXHJcbiAgICAgIC8vIFx1NTNFRlx1NjUzNlx1NzdGRlx1NjVGNlx1NkRGQlx1NTJBMFx1ODBGRFx1OTFDRlx1NzI3OVx1NjU0OFxyXG4gICAgICBpZiAodGhpcy5jYXJ0QW10ID4gMCAmJiAhdGhpcy5lbHMuY29sbGVjdC5kaXNhYmxlZCkge1xyXG4gICAgICAgIHRoaXMuZWxzLmNvbGxlY3QuY2xhc3NMaXN0LmFkZCgnYnRuLWVuZXJneScpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuZWxzLmNvbGxlY3QuY2xhc3NMaXN0LnJlbW92ZSgnYnRuLWVuZXJneScpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIFx1NjZGNFx1NjVCMFx1NzdGRlx1NzdGM1x1NjU3MFx1OTFDRlxyXG4gICAgdGhpcy51cGRhdGVTaGFyZHMocGN0KTtcclxuICAgIFxyXG4gICAgLy8gXHU2NkY0XHU2NUIwXHU1MTY4XHU2MDZGXHU4MENDXHU2NjZGXHU3MkI2XHU2MDAxXHJcbiAgICB0aGlzLnVwZGF0ZUhvbG9ncmFtU3RhdGUoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgdHJpZ2dlck1pbGVzdG9uZVB1bHNlKG1pbGVzdG9uZTogbnVtYmVyKSB7XHJcbiAgICBpZiAodGhpcy5lbHMucmluZykge1xyXG4gICAgICB0aGlzLmVscy5yaW5nLmNsYXNzTGlzdC5hZGQoJ21pbGVzdG9uZS1wdWxzZScpO1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuZWxzLnJpbmc/LmNsYXNzTGlzdC5yZW1vdmUoJ21pbGVzdG9uZS1wdWxzZScpLCAxMDAwKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgaWYgKHRoaXMuZWxzLnJpbmdQY3QpIHtcclxuICAgICAgdGhpcy5lbHMucmluZ1BjdC5jbGFzc0xpc3QuYWRkKCdmbGFzaCcpO1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuZWxzLnJpbmdQY3Q/LmNsYXNzTGlzdC5yZW1vdmUoJ2ZsYXNoJyksIDkwMCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIFx1NjYzRVx1NzkzQVx1OTFDQ1x1N0EwQlx1Nzg5MVx1NkQ4OFx1NjA2RlxyXG4gICAgc2hvd1RvYXN0KGBcdUQ4M0NcdURGQUYgXHU4RkJFXHU2MjEwICR7bWlsZXN0b25lfSUgXHU4OEM1XHU4RjdEXHU3Mzg3XHVGRjAxYCwgJ3N1Y2Nlc3MnKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgdXBkYXRlSG9sb2dyYW1TdGF0ZSgpIHtcclxuICAgIGlmICghdGhpcy5lbHMuaG9sb2dyYW0pIHJldHVybjtcclxuICAgIFxyXG4gICAgLy8gXHU3OUZCXHU5NjY0XHU2MjQwXHU2NzA5XHU3MkI2XHU2MDAxXHU3QzdCXHJcbiAgICB0aGlzLmVscy5ob2xvZ3JhbS5jbGFzc0xpc3QucmVtb3ZlKCdob2xvLWlkbGUnLCAnaG9sby1taW5pbmcnLCAnaG9sby1jb2xsYXBzZWQnKTtcclxuICAgIFxyXG4gICAgLy8gXHU2ODM5XHU2MzZFXHU3MkI2XHU2MDAxXHU2REZCXHU1MkEwXHU1QkY5XHU1RTk0XHU3Njg0XHU3QzdCXHJcbiAgICBpZiAodGhpcy5pc0NvbGxhcHNlZCkge1xyXG4gICAgICB0aGlzLmVscy5ob2xvZ3JhbS5jbGFzc0xpc3QuYWRkKCdob2xvLWNvbGxhcHNlZCcpO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLmlzTWluaW5nKSB7XHJcbiAgICAgIHRoaXMuZWxzLmhvbG9ncmFtLmNsYXNzTGlzdC5hZGQoJ2hvbG8tbWluaW5nJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmVscy5ob2xvZ3JhbS5jbGFzc0xpc3QuYWRkKCdob2xvLWlkbGUnKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgdXBkYXRlU2hhcmRzKGxvYWRQZXJjZW50OiBudW1iZXIpIHtcclxuICAgIGlmICghdGhpcy5lbHMuaG9sb2dyYW0pIHJldHVybjtcclxuICAgIFxyXG4gICAgLy8gXHU4QkExXHU3Qjk3XHU1RTk0XHU4QkU1XHU2NjNFXHU3OTNBXHU3Njg0XHU3N0ZGXHU3N0YzXHU2NTcwXHU5MUNGXHVGRjA4XHU4OEM1XHU4RjdEXHU3Mzg3XHU4RDhBXHU5QUQ4XHVGRjBDXHU3N0ZGXHU3N0YzXHU4RDhBXHU1OTFBXHVGRjA5XHJcbiAgICAvLyAwLTIwJTogMlx1NEUyQSwgMjAtNDAlOiA0XHU0RTJBLCA0MC02MCU6IDZcdTRFMkEsIDYwLTgwJTogOFx1NEUyQSwgODAtMTAwJTogMTBcdTRFMkFcclxuICAgIGNvbnN0IHRhcmdldENvdW50ID0gTWF0aC5tYXgoMiwgTWF0aC5taW4oMTIsIE1hdGguZmxvb3IobG9hZFBlcmNlbnQgKiAxMikgKyAyKSk7XHJcbiAgICBcclxuICAgIC8vIFx1ODNCN1x1NTNENlx1NUY1M1x1NTI0RFx1NzdGRlx1NzdGM1x1NTE0M1x1N0QyMFxyXG4gICAgY29uc3QgY3VycmVudFNoYXJkcyA9IHRoaXMuZWxzLmhvbG9ncmFtLnF1ZXJ5U2VsZWN0b3JBbGwoJy5taW5lLXNoYXJkJyk7XHJcbiAgICBjb25zdCBjdXJyZW50Q291bnQgPSBjdXJyZW50U2hhcmRzLmxlbmd0aDtcclxuICAgIFxyXG4gICAgLy8gXHU1OTgyXHU2NzlDXHU2NTcwXHU5MUNGXHU3NkY4XHU1NDBDXHVGRjBDXHU0RTBEXHU1MDVBXHU1OTA0XHU3NDA2XHJcbiAgICBpZiAoY3VycmVudENvdW50ID09PSB0YXJnZXRDb3VudCkgcmV0dXJuO1xyXG4gICAgXHJcbiAgICAvLyBcdTk3MDBcdTg5ODFcdTZERkJcdTUyQTBcdTc3RkZcdTc3RjNcclxuICAgIGlmIChjdXJyZW50Q291bnQgPCB0YXJnZXRDb3VudCkge1xyXG4gICAgICBjb25zdCB0b0FkZCA9IHRhcmdldENvdW50IC0gY3VycmVudENvdW50O1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvQWRkOyBpKyspIHtcclxuICAgICAgICBjb25zdCBzaGFyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICBzaGFyZC5jbGFzc05hbWUgPSAnbWluZS1zaGFyZCc7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gXHU5NjhGXHU2NzNBXHU0RjREXHU3RjZFXHU1NDhDXHU1OTI3XHU1QzBGXHJcbiAgICAgICAgY29uc3QgcG9zaXRpb25zID0gW1xyXG4gICAgICAgICAgeyB0b3A6ICcxOCUnLCBsZWZ0OiAnMTYlJywgZGVsYXk6IC0xLjQsIHNjYWxlOiAxIH0sXHJcbiAgICAgICAgICB7IGJvdHRvbTogJzE2JScsIHJpZ2h0OiAnMjIlJywgZGVsYXk6IC0zLjIsIHNjYWxlOiAwLjc0IH0sXHJcbiAgICAgICAgICB7IHRvcDogJzI2JScsIHJpZ2h0OiAnMzQlJywgZGVsYXk6IC01LjEsIHNjYWxlOiAwLjUgfSxcclxuICAgICAgICAgIHsgdG9wOiAnNDAlJywgbGVmdDogJzI4JScsIGRlbGF5OiAtMi41LCBzY2FsZTogMC44NSB9LFxyXG4gICAgICAgICAgeyBib3R0b206ICczMCUnLCBsZWZ0OiAnMTglJywgZGVsYXk6IC00LjEsIHNjYWxlOiAwLjY4IH0sXHJcbiAgICAgICAgICB7IHRvcDogJzE1JScsIHJpZ2h0OiAnMTUlJywgZGVsYXk6IC0xLjgsIHNjYWxlOiAwLjkyIH0sXHJcbiAgICAgICAgICB7IGJvdHRvbTogJzIyJScsIHJpZ2h0OiAnNDAlJywgZGVsYXk6IC0zLjgsIHNjYWxlOiAwLjc4IH0sXHJcbiAgICAgICAgICB7IHRvcDogJzUwJScsIGxlZnQ6ICcxMiUnLCBkZWxheTogLTIuMiwgc2NhbGU6IDAuNiB9LFxyXG4gICAgICAgICAgeyB0b3A6ICczNSUnLCByaWdodDogJzIwJScsIGRlbGF5OiAtNC41LCBzY2FsZTogMC44OCB9LFxyXG4gICAgICAgICAgeyBib3R0b206ICc0MCUnLCBsZWZ0OiAnMzUlJywgZGVsYXk6IC0zLjUsIHNjYWxlOiAwLjcgfSxcclxuICAgICAgICAgIHsgdG9wOiAnNjAlJywgcmlnaHQ6ICcyOCUnLCBkZWxheTogLTIuOCwgc2NhbGU6IDAuNjUgfSxcclxuICAgICAgICAgIHsgYm90dG9tOiAnNTAlJywgcmlnaHQ6ICcxMiUnLCBkZWxheTogLTQuOCwgc2NhbGU6IDAuODIgfSxcclxuICAgICAgICBdO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IHBvc0luZGV4ID0gKGN1cnJlbnRDb3VudCArIGkpICUgcG9zaXRpb25zLmxlbmd0aDtcclxuICAgICAgICBjb25zdCBwb3MgPSBwb3NpdGlvbnNbcG9zSW5kZXhdO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChwb3MudG9wKSBzaGFyZC5zdHlsZS50b3AgPSBwb3MudG9wO1xyXG4gICAgICAgIGlmIChwb3MuYm90dG9tKSBzaGFyZC5zdHlsZS5ib3R0b20gPSBwb3MuYm90dG9tO1xyXG4gICAgICAgIGlmIChwb3MubGVmdCkgc2hhcmQuc3R5bGUubGVmdCA9IHBvcy5sZWZ0O1xyXG4gICAgICAgIGlmIChwb3MucmlnaHQpIHNoYXJkLnN0eWxlLnJpZ2h0ID0gcG9zLnJpZ2h0O1xyXG4gICAgICAgIHNoYXJkLnN0eWxlLmFuaW1hdGlvbkRlbGF5ID0gYCR7cG9zLmRlbGF5fXNgO1xyXG4gICAgICAgIHNoYXJkLnN0eWxlLnRyYW5zZm9ybSA9IGBzY2FsZSgke3Bvcy5zY2FsZX0pYDtcclxuICAgICAgICBcclxuICAgICAgICAvLyBcdTZERkJcdTUyQTBcdTZERTFcdTUxNjVcdTUyQThcdTc1M0JcclxuICAgICAgICBzaGFyZC5zdHlsZS5vcGFjaXR5ID0gJzAnO1xyXG4gICAgICAgIHRoaXMuZWxzLmhvbG9ncmFtLmFwcGVuZENoaWxkKHNoYXJkKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBcdTg5RTZcdTUzRDFcdTZERTFcdTUxNjVcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgIHNoYXJkLnN0eWxlLnRyYW5zaXRpb24gPSAnb3BhY2l0eSAwLjVzIGVhc2UnO1xyXG4gICAgICAgICAgc2hhcmQuc3R5bGUub3BhY2l0eSA9ICcwLjI2JztcclxuICAgICAgICB9LCA1MCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIFx1OTcwMFx1ODk4MVx1NzlGQlx1OTY2NFx1NzdGRlx1NzdGM1xyXG4gICAgZWxzZSBpZiAoY3VycmVudENvdW50ID4gdGFyZ2V0Q291bnQpIHtcclxuICAgICAgY29uc3QgdG9SZW1vdmUgPSBjdXJyZW50Q291bnQgLSB0YXJnZXRDb3VudDtcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b1JlbW92ZTsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgbGFzdFNoYXJkID0gY3VycmVudFNoYXJkc1tjdXJyZW50U2hhcmRzLmxlbmd0aCAtIDEgLSBpXTtcclxuICAgICAgICBpZiAobGFzdFNoYXJkKSB7XHJcbiAgICAgICAgICAobGFzdFNoYXJkIGFzIEhUTUxFbGVtZW50KS5zdHlsZS50cmFuc2l0aW9uID0gJ29wYWNpdHkgMC41cyBlYXNlJztcclxuICAgICAgICAgIChsYXN0U2hhcmQgYXMgSFRNTEVsZW1lbnQpLnN0eWxlLm9wYWNpdHkgPSAnMCc7XHJcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgbGFzdFNoYXJkLnJlbW92ZSgpO1xyXG4gICAgICAgICAgfSwgNTAwKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgdXBkYXRlQ29udHJvbHMoKSB7XHJcbiAgICBjb25zdCBpc0J1c3kgPSAoa2V5OiBQZW5kaW5nQWN0aW9uKSA9PiB0aGlzLnBlbmRpbmcgPT09IGtleTtcclxuICAgIGNvbnN0IHNldEJ0biA9IChidG46IEhUTUxCdXR0b25FbGVtZW50IHwgbnVsbCwgaWNvbjogYW55LCBsYWJlbDogc3RyaW5nLCBkaXNhYmxlZDogYm9vbGVhbikgPT4ge1xyXG4gICAgICBpZiAoIWJ0bikgcmV0dXJuO1xyXG4gICAgICBidG4uZGlzYWJsZWQgPSBkaXNhYmxlZDtcclxuICAgICAgLy8ga2VlcCBmaXJzdCBjaGlsZCBhcyBpY29uIGlmIHByZXNlbnQsIG90aGVyd2lzZSBjcmVhdGVcclxuICAgICAgbGV0IGljb25Ib3N0ID0gYnRuLnF1ZXJ5U2VsZWN0b3IoJy5pY29uJyk7XHJcbiAgICAgIGlmICghaWNvbkhvc3QpIHtcclxuICAgICAgICBidG4uaW5zZXJ0QmVmb3JlKHJlbmRlckljb24oaWNvbiwgeyBzaXplOiAxOCB9KSwgYnRuLmZpcnN0Q2hpbGQpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIFJlcGxhY2UgZXhpc3RpbmcgaWNvbiB3aXRoIG5ldyBvbmUgaWYgaWNvbiBuYW1lIGRpZmZlcnMgYnkgcmUtcmVuZGVyaW5nXHJcbiAgICAgICAgY29uc3QgaG9zdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICBob3N0LmFwcGVuZENoaWxkKHJlbmRlckljb24oaWNvbiwgeyBzaXplOiAxOCB9KSk7XHJcbiAgICAgICAgLy8gcmVtb3ZlIG9sZCBpY29uIHdyYXBwZXIgYW5kIHVzZSBuZXdcclxuICAgICAgICBpY29uSG9zdC5wYXJlbnRFbGVtZW50Py5yZXBsYWNlQ2hpbGQoaG9zdC5maXJzdENoaWxkIGFzIE5vZGUsIGljb25Ib3N0KTtcclxuICAgICAgfVxyXG4gICAgICAvLyBzZXQgbGFiZWwgdGV4dCAocHJlc2VydmUgaWNvbilcclxuICAgICAgLy8gcmVtb3ZlIGV4aXN0aW5nIHRleHQgbm9kZXNcclxuICAgICAgQXJyYXkuZnJvbShidG4uY2hpbGROb2RlcykuZm9yRWFjaCgobiwgaWR4KSA9PiB7XHJcbiAgICAgICAgaWYgKGlkeCA+IDApIGJ0bi5yZW1vdmVDaGlsZChuKTtcclxuICAgICAgfSk7XHJcbiAgICAgIGJ0bi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShsYWJlbCkpO1xyXG4gICAgfTtcclxuXHJcbiAgICBzZXRCdG4odGhpcy5lbHMuc3RhcnQsICdwbGF5JywgaXNCdXN5KCdzdGFydCcpID8gJ1x1NTQyRlx1NTJBOFx1NEUyRFx1MjAyNicgOiB0aGlzLmlzTWluaW5nID8gJ1x1NjMxNlx1NzdGRlx1NEUyRCcgOiAnXHU1RjAwXHU1OUNCXHU2MzE2XHU3N0ZGJywgaXNCdXN5KCdzdGFydCcpIHx8IHRoaXMuaXNNaW5pbmcgfHwgdGhpcy5pc0NvbGxhcHNlZCk7XHJcbiAgICBzZXRCdG4odGhpcy5lbHMuc3RvcCwgJ3N0b3AnLCBpc0J1c3koJ3N0b3AnKSA/ICdcdTUwNUNcdTZCNjJcdTRFMkRcdTIwMjYnIDogJ1x1NTA1Q1x1NkI2MicsIGlzQnVzeSgnc3RvcCcpIHx8ICF0aGlzLmlzTWluaW5nKTtcclxuICAgIHNldEJ0bih0aGlzLmVscy5jb2xsZWN0LCAnY29sbGVjdCcsIGlzQnVzeSgnY29sbGVjdCcpID8gJ1x1NjUzNlx1OTZDNlx1NEUyRFx1MjAyNicgOiAnXHU2NTM2XHU3N0ZGJywgaXNCdXN5KCdjb2xsZWN0JykgfHwgdGhpcy5jYXJ0QW10IDw9IDApO1xyXG4gICAgc2V0QnRuKHRoaXMuZWxzLnJlcGFpciwgJ3dyZW5jaCcsIGlzQnVzeSgncmVwYWlyJykgPyAnXHU0RkVFXHU3NDA2XHU0RTJEXHUyMDI2JyA6ICdcdTRGRUVcdTc0MDYnLCBpc0J1c3koJ3JlcGFpcicpIHx8ICF0aGlzLmlzQ29sbGFwc2VkKTtcclxuICAgIHNldEJ0bih0aGlzLmVscy5zdGF0dXNCdG4sICdyZWZyZXNoJywgaXNCdXN5KCdzdGF0dXMnKSA/ICdcdTUyMzdcdTY1QjBcdTRFMkRcdTIwMjYnIDogJ1x1NTIzN1x1NjVCMFx1NzJCNlx1NjAwMScsIGlzQnVzeSgnc3RhdHVzJykpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzZXRTdGF0dXNNZXNzYWdlKHRleHQ6IHN0cmluZykge1xyXG4gICAgaWYgKCF0aGlzLmVscy5zdGF0dXNUZXh0KSByZXR1cm47XHJcbiAgICB0aGlzLmVscy5zdGF0dXNUZXh0LnRleHRDb250ZW50ID0gdGV4dDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgbG9nRXZlbnQobXNnOiBzdHJpbmcpIHtcclxuICAgIGlmICghdGhpcy5lbHM/LmV2ZW50cykgcmV0dXJuO1xyXG4gICAgY29uc3QgbGluZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcclxuICAgIGNvbnN0IGhoID0gU3RyaW5nKG5vdy5nZXRIb3VycygpKS5wYWRTdGFydCgyLCcwJyk7XHJcbiAgICBjb25zdCBtbSA9IFN0cmluZyhub3cuZ2V0TWludXRlcygpKS5wYWRTdGFydCgyLCcwJyk7XHJcbiAgICBjb25zdCBzcyA9IFN0cmluZyhub3cuZ2V0U2Vjb25kcygpKS5wYWRTdGFydCgyLCcwJyk7XHJcbiAgICBcclxuICAgIC8vIFx1NjgzOVx1NjM2RVx1NkQ4OFx1NjA2Rlx1N0M3Qlx1NTc4Qlx1NkRGQlx1NTJBMFx1NEUwRFx1NTQwQ1x1NzY4NFx1NjgzN1x1NUYwRlx1N0M3QlxyXG4gICAgbGV0IGV2ZW50Q2xhc3MgPSAnZXZlbnQnO1xyXG4gICAgaWYgKG1zZy5pbmNsdWRlcygnXHU2NkI0XHU1MUZCJykpIHtcclxuICAgICAgZXZlbnRDbGFzcyArPSAnIGV2ZW50LWNyaXRpY2FsJztcclxuICAgIH0gZWxzZSBpZiAobXNnLmluY2x1ZGVzKCdcdTU3NERcdTU4NEMnKSB8fCBtc2cuaW5jbHVkZXMoJ1x1NjNBMFx1NTkzQScpKSB7XHJcbiAgICAgIGV2ZW50Q2xhc3MgKz0gJyBldmVudC13YXJuaW5nJztcclxuICAgIH0gZWxzZSBpZiAobXNnLmluY2x1ZGVzKCdcdTY1MzZcdTk2QzYnKSB8fCBtc2cuaW5jbHVkZXMoJ1x1NjIxMFx1NTI5RicpKSB7XHJcbiAgICAgIGV2ZW50Q2xhc3MgKz0gJyBldmVudC1zdWNjZXNzJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGV2ZW50Q2xhc3MgKz0gJyBldmVudC1ub3JtYWwnO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBsaW5lLmNsYXNzTmFtZSA9IGV2ZW50Q2xhc3M7XHJcbiAgICBsaW5lLnRleHRDb250ZW50ID0gYFske2hofToke21tfToke3NzfV0gJHttc2d9YDtcclxuICAgIFxyXG4gICAgLy8gXHU2REZCXHU1MkEwXHU2RUQxXHU1MTY1XHU1MkE4XHU3NTNCXHJcbiAgICBsaW5lLnN0eWxlLm9wYWNpdHkgPSAnMCc7XHJcbiAgICBsaW5lLnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGVYKDIwcHgpJztcclxuICAgIHRoaXMuZWxzLmV2ZW50cy5wcmVwZW5kKGxpbmUpO1xyXG4gICAgXHJcbiAgICAvLyBcdTg5RTZcdTUzRDFcdTUyQThcdTc1M0JcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBsaW5lLnN0eWxlLnRyYW5zaXRpb24gPSAnb3BhY2l0eSAwLjNzIGVhc2UsIHRyYW5zZm9ybSAwLjNzIGVhc2UnO1xyXG4gICAgICBsaW5lLnN0eWxlLm9wYWNpdHkgPSAnMC45JztcclxuICAgICAgbGluZS5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlWCgwKSc7XHJcbiAgICB9LCAxMCk7XHJcbiAgICBcclxuICAgIC8vIFx1NjZCNFx1NTFGQlx1NEU4Qlx1NEVGNlx1NkRGQlx1NTJBMFx1OTVFQVx1NTE0OVx1NjU0OFx1Njc5Q1xyXG4gICAgaWYgKG1zZy5pbmNsdWRlcygnXHU2NkI0XHU1MUZCJykpIHtcclxuICAgICAgbGluZS5jbGFzc0xpc3QuYWRkKCdmbGFzaCcpO1xyXG4gICAgICAvLyBcdTg5RTZcdTUzRDFcdTUxNjhcdTVDNDBcdTY2QjRcdTUxRkJcdTcyNzlcdTY1NDhcclxuICAgICAgdGhpcy50cmlnZ2VyQ3JpdGljYWxFZmZlY3QoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgdHJpZ2dlckNyaXRpY2FsRWZmZWN0KCkge1xyXG4gICAgLy8gXHU1NzA2XHU3M0FGXHU5NUVBXHU3NTM1XHU2NTQ4XHU2NzlDXHJcbiAgICBpZiAodGhpcy5lbHMucmluZykge1xyXG4gICAgICB0aGlzLmVscy5yaW5nLmNsYXNzTGlzdC5hZGQoJ3JpbmctcHVsc2UnKTtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmVscy5yaW5nPy5jbGFzc0xpc3QucmVtb3ZlKCdyaW5nLXB1bHNlJyksIDYwMCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIFx1NTE2OFx1NjA2Rlx1ODBDQ1x1NjY2Rlx1OTVFQVx1NzBDMVxyXG4gICAgaWYgKHRoaXMuZWxzLmhvbG9ncmFtKSB7XHJcbiAgICAgIHRoaXMuZWxzLmhvbG9ncmFtLmNsYXNzTGlzdC5hZGQoJ2NyaXRpY2FsLWZsYXNoJyk7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5lbHMuaG9sb2dyYW0/LmNsYXNzTGlzdC5yZW1vdmUoJ2NyaXRpY2FsLWZsYXNoJyksIDQwMCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGZvcm1hdFBlcmNlbnQoKSB7XHJcbiAgICBjb25zdCBwY3QgPSB0aGlzLmNhcnRDYXAgPiAwID8gTWF0aC5taW4oMSwgdGhpcy5jYXJ0QW10IC8gdGhpcy5jYXJ0Q2FwKSA6IDA7XHJcbiAgICByZXR1cm4gYCR7TWF0aC5yb3VuZChwY3QgKiAxMDApfSVgO1xyXG4gIH1cclxufSIsICJpbXBvcnQgeyBOZXR3b3JrTWFuYWdlciB9IGZyb20gJy4uL2NvcmUvTmV0d29ya01hbmFnZXInO1xuaW1wb3J0IHsgaHRtbCwgcXMgfSBmcm9tICcuLi91dGlscy9kb20nO1xuaW1wb3J0IHsgcmVuZGVyTmF2IH0gZnJvbSAnLi4vY29tcG9uZW50cy9OYXYnO1xuaW1wb3J0IHsgUmVhbHRpbWVDbGllbnQgfSBmcm9tICcuLi9jb3JlL1JlYWx0aW1lQ2xpZW50JztcbmltcG9ydCB7IHJlbmRlclJlc291cmNlQmFyIH0gZnJvbSAnLi4vY29tcG9uZW50cy9SZXNvdXJjZUJhcic7XG5pbXBvcnQgeyBzaG93VG9hc3QgfSBmcm9tICcuLi9jb21wb25lbnRzL1RvYXN0JztcbmltcG9ydCB7IHJlbmRlckljb24gfSBmcm9tICcuLi9jb21wb25lbnRzL0ljb24nO1xuXG5leHBvcnQgY2xhc3MgV2FyZWhvdXNlU2NlbmUge1xuICBhc3luYyBtb3VudChyb290OiBIVE1MRWxlbWVudCkge1xuICAgIHJvb3QuaW5uZXJIVE1MID0gJyc7XG4gICAgcm9vdC5hcHBlbmRDaGlsZChyZW5kZXJOYXYoJ3dhcmVob3VzZScpKTtcbiAgICBjb25zdCBiYXIgPSByZW5kZXJSZXNvdXJjZUJhcigpO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQoYmFyLnJvb3QpO1xuXG4gICAgY29uc3QgdmlldyA9IGh0bWwoYFxuICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lciBncmlkLTJcIiBzdHlsZT1cImNvbG9yOiNmZmY7XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkIGZhZGUtaW5cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCIgc3R5bGU9XCJqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjthbGlnbi1pdGVtczpjZW50ZXI7XCI+XG4gICAgICAgICAgICA8aDMgc3R5bGU9XCJtYXJnaW46MDtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo4cHg7XCI+PHNwYW4gZGF0YS1pY289XCJ3YXJlaG91c2VcIj48L3NwYW4+XHU0RUQzXHU1RTkzPC9oMz5cbiAgICAgICAgICAgIDxidXR0b24gaWQ9XCJyZWZyZXNoXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIj48c3BhbiBkYXRhLWljbz1cInJlZnJlc2hcIj48L3NwYW4+XHU1MjM3XHU2NUIwPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBzdHlsZT1cIm1hcmdpbi10b3A6MTJweDtcIj5cbiAgICAgICAgICAgIDxkZXRhaWxzIG9wZW4+XG4gICAgICAgICAgICAgIDxzdW1tYXJ5PjxzcGFuIGRhdGEtaWNvPVwiYm94XCI+PC9zcGFuPlx1NjIxMVx1NzY4NFx1OTA1M1x1NTE3Nzwvc3VtbWFyeT5cbiAgICAgICAgICAgICAgPGRpdiBpZD1cImxpc3RcIiBzdHlsZT1cIm1hcmdpbi10b3A6OHB4O2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjhweDtcIj48L2Rpdj5cbiAgICAgICAgICAgIDwvZGV0YWlscz5cbiAgICAgICAgICAgIDxkZXRhaWxzPlxuICAgICAgICAgICAgICA8c3VtbWFyeT48c3BhbiBkYXRhLWljbz1cImxpc3RcIj48L3NwYW4+XHU5MDUzXHU1MTc3XHU2QTIxXHU2NzdGPC9zdW1tYXJ5PlxuICAgICAgICAgICAgICA8ZGl2IGlkPVwidHBsc1wiIHN0eWxlPVwibWFyZ2luLXRvcDo4cHg7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6OHB4O1wiPjwvZGl2PlxuICAgICAgICAgICAgPC9kZXRhaWxzPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIGApO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQodmlldyk7XG5cbiAgICBjb25zdCB0b2tlbiA9IE5ldHdvcmtNYW5hZ2VyLkkuZ2V0VG9rZW4oKTtcbiAgICBpZiAodG9rZW4pIFJlYWx0aW1lQ2xpZW50LkkuY29ubmVjdCh0b2tlbik7XG5cbiAgICBjb25zdCBsaXN0ID0gcXModmlldywgJyNsaXN0Jyk7XG4gICAgY29uc3QgdHBsQ29udGFpbmVyID0gcXModmlldywgJyN0cGxzJyk7XG4gICAgY29uc3QgcmVmcmVzaEJ0biA9IHFzPEhUTUxCdXR0b25FbGVtZW50Pih2aWV3LCAnI3JlZnJlc2gnKTtcblxuICAgIGNvbnN0IG1vdW50SWNvbnMgPSAocm9vdEVsOiBFbGVtZW50KSA9PiB7XG4gICAgICByb290RWwucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtaWNvXScpXG4gICAgICAgIC5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICAgIGNvbnN0IG5hbWUgPSAoZWwgYXMgSFRNTEVsZW1lbnQpLmdldEF0dHJpYnV0ZSgnZGF0YS1pY28nKSBhcyBhbnk7XG4gICAgICAgICAgdHJ5IHsgZWwuYXBwZW5kQ2hpbGQocmVuZGVySWNvbihuYW1lLCB7IHNpemU6IDIwIH0pKTsgfSBjYXRjaCB7fVxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIG1vdW50SWNvbnModmlldyk7XG5cbiAgICBjb25zdCBnZXRSYXJpdHkgPSAoaXRlbTogYW55LCB0cGw/OiBhbnkpOiB7IGtleTogJ2NvbW1vbid8J3JhcmUnfCdlcGljJ3wnbGVnZW5kYXJ5JzsgdGV4dDogc3RyaW5nIH0gPT4ge1xuICAgICAgY29uc3QgciA9ICh0cGwgJiYgKHRwbC5yYXJpdHkgfHwgdHBsLnRpZXIpKSB8fCBpdGVtLnJhcml0eTtcbiAgICAgIGNvbnN0IGxldmVsID0gTnVtYmVyKGl0ZW0ubGV2ZWwpIHx8IDA7XG4gICAgICBpZiAodHlwZW9mIHIgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGNvbnN0IGsgPSByLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGlmIChbJ2xlZ2VuZGFyeScsJ2VwaWMnLCdyYXJlJywnY29tbW9uJ10uaW5jbHVkZXMoaykpIHtcbiAgICAgICAgICByZXR1cm4geyBrZXk6IGsgYXMgYW55LCB0ZXh0OiBrID09PSAnbGVnZW5kYXJ5JyA/ICdcdTRGMjBcdThCRjQnIDogayA9PT0gJ2VwaWMnID8gJ1x1NTNGMlx1OEJENycgOiBrID09PSAncmFyZScgPyAnXHU3QTAwXHU2NzA5JyA6ICdcdTY2NkVcdTkwMUEnIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChsZXZlbCA+PSAxMikgcmV0dXJuIHsga2V5OiAnbGVnZW5kYXJ5JywgdGV4dDogJ1x1NEYyMFx1OEJGNCcgfTtcbiAgICAgIGlmIChsZXZlbCA+PSA4KSByZXR1cm4geyBrZXk6ICdlcGljJywgdGV4dDogJ1x1NTNGMlx1OEJENycgfTtcbiAgICAgIGlmIChsZXZlbCA+PSA0KSByZXR1cm4geyBrZXk6ICdyYXJlJywgdGV4dDogJ1x1N0EwMFx1NjcwOScgfTtcbiAgICAgIHJldHVybiB7IGtleTogJ2NvbW1vbicsIHRleHQ6ICdcdTY2NkVcdTkwMUEnIH07XG4gICAgfTtcblxuICAgIGNvbnN0IGZvcm1hdFRpbWUgPSAodHM6IG51bWJlcikgPT4ge1xuICAgICAgdHJ5IHsgcmV0dXJuIG5ldyBEYXRlKHRzKS50b0xvY2FsZVN0cmluZygpOyB9IGNhdGNoIHsgcmV0dXJuICcnICsgdHM7IH1cbiAgICB9O1xuXG4gICAgY29uc3QgbG9hZCA9IGFzeW5jICgpID0+IHtcbiAgICAgIHJlZnJlc2hCdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgcmVmcmVzaEJ0bi5pbm5lckhUTUwgPSAnPHNwYW4gZGF0YS1pY289XCJyZWZyZXNoXCI+PC9zcGFuPlx1NTIzN1x1NjVCMFx1NEUyRFx1MjAyNic7XG4gICAgICBtb3VudEljb25zKHJlZnJlc2hCdG4pO1xuICAgICAgYXdhaXQgYmFyLnVwZGF0ZSgpO1xuICAgICAgbGlzdC5pbm5lckhUTUwgPSAnJztcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSBsaXN0LmFwcGVuZENoaWxkKGh0bWwoJzxkaXYgY2xhc3M9XCJza2VsZXRvblwiPjwvZGl2PicpKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IFtkYXRhLCB0cGxzXSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgICBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyBpdGVtczogYW55W10gfT4oJy9pdGVtcycpLFxuICAgICAgICAgIE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IHRlbXBsYXRlczogYW55W10gfT4oJy9pdGVtcy90ZW1wbGF0ZXMnKS5jYXRjaCgoKSA9PiAoeyB0ZW1wbGF0ZXM6IFtdIH0pKVxuICAgICAgICBdKTtcbiAgICAgICAgY29uc3QgdHBsQnlJZDogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICAgICAgICBmb3IgKGNvbnN0IHQgb2YgKHRwbHMudGVtcGxhdGVzIHx8IFtdKSkgdHBsQnlJZFt0LmlkXSA9IHQ7XG4gICAgICAgIGxpc3QuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIGlmICghZGF0YS5pdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgICBsaXN0LmFwcGVuZENoaWxkKGh0bWwoJzxkaXYgc3R5bGU9XCJvcGFjaXR5Oi44O1wiPlx1NjY4Mlx1NjVFMFx1OTA1M1x1NTE3N1x1RkYwQ1x1NUMxRFx1OEJENVx1NTkxQVx1NjMxNlx1NzdGRlx1NjIxNlx1NjNBMFx1NTkzQVx1NEVFNVx1ODNCN1x1NTNENlx1NjZGNFx1NTkxQVx1OEQ0NFx1NkU5MDwvZGl2PicpKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgZGF0YS5pdGVtcykge1xuICAgICAgICAgIGNvbnN0IHRwbCA9IHRwbEJ5SWRbaXRlbS50ZW1wbGF0ZUlkXTtcbiAgICAgICAgICBjb25zdCByYXJpdHkgPSBnZXRSYXJpdHkoaXRlbSwgdHBsKTtcbiAgICAgICAgICBjb25zdCBuYW1lID0gKHRwbCAmJiAodHBsLm5hbWUgfHwgdHBsLmlkKSkgfHwgaXRlbS50ZW1wbGF0ZUlkO1xuXG4gICAgICAgICAgY29uc3Qgcm93ID0gaHRtbChgXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaXRlbS1jYXJkIGhvdmVyLWxpZnQgJHtcbiAgICAgICAgICAgICAgcmFyaXR5LmtleSA9PT0gJ2xlZ2VuZGFyeScgPyAncmFyaXR5LW91dGxpbmUtbGVnZW5kYXJ5JyA6IHJhcml0eS5rZXkgPT09ICdlcGljJyA/ICdyYXJpdHktb3V0bGluZS1lcGljJyA6IHJhcml0eS5rZXkgPT09ICdyYXJlJyA/ICdyYXJpdHktb3V0bGluZS1yYXJlJyA6ICdyYXJpdHktb3V0bGluZS1jb21tb24nXG4gICAgICAgICAgICB9XCIgZGF0YS1yYXJpdHk9XCIke3Jhcml0eS5rZXl9XCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIiBzdHlsZT1cImp1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2FsaWduLWl0ZW1zOmZsZXgtc3RhcnQ7Z2FwOjEwcHg7XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cImRpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjRweDtmbGV4OjE7bWluLXdpZHRoOjA7XCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZGlzcGxheTpmbGV4O2ZsZXgtd3JhcDp3cmFwO2dhcDo2cHg7YWxpZ24taXRlbXM6Y2VudGVyO1wiPlxuICAgICAgICAgICAgICAgICAgICA8c3Ryb25nIHN0eWxlPVwiZm9udC1zaXplOjE1cHg7d2hpdGUtc3BhY2U6bm93cmFwO2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjZweDtcIj48c3BhbiBkYXRhLWljbz1cIm9yZVwiPjwvc3Bhbj4ke25hbWV9PC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYmFkZ2UgcmFyaXR5LSR7cmFyaXR5LmtleX1cIj48aT48L2k+JHtyYXJpdHkudGV4dH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICR7aXRlbS5pc0VxdWlwcGVkID8gJzxzcGFuIGNsYXNzPVwicGlsbFwiPlx1NURGMlx1ODhDNVx1NTkwNzwvc3Bhbj4nIDogJyd9XG4gICAgICAgICAgICAgICAgICAgICR7aXRlbS5pc0xpc3RlZCA/ICc8c3BhbiBjbGFzcz1cInBpbGxcIj5cdTYzMDJcdTUzNTVcdTRFMkQ8L3NwYW4+JyA6ICcnfVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwib3BhY2l0eTouODU7ZGlzcGxheTpmbGV4O2ZsZXgtd3JhcDp3cmFwO2dhcDo4cHg7XCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuPlx1N0I0OVx1N0VBNyBMdi4ke2l0ZW0ubGV2ZWx9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInBpbGxcIj5cdTVCOUVcdTRGOEIgJHtpdGVtLmlkfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgJHt0cGw/LmNhdGVnb3J5ID8gYDxzcGFuIGNsYXNzPVwicGlsbFwiPiR7dHBsLmNhdGVnb3J5fTwvc3Bhbj5gIDogJyd9XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYWN0aW9uc1wiPlxuICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biAke2l0ZW0uaXNFcXVpcHBlZCA/ICdidG4tc2VsbCcgOiAnYnRuLWJ1eSd9XCIgZGF0YS1hY3Q9XCIke2l0ZW0uaXNFcXVpcHBlZCA/ICd1bmVxdWlwJyA6ICdlcXVpcCd9XCIgZGF0YS1pZD1cIiR7aXRlbS5pZH1cIj48c3BhbiBkYXRhLWljbz1cIiR7aXRlbS5pc0VxdWlwcGVkID8gJ3gnIDogJ3NoaWVsZCd9XCI+PC9zcGFuPiR7aXRlbS5pc0VxdWlwcGVkID8gJ1x1NTM3OFx1NEUwQicgOiAnXHU4OEM1XHU1OTA3J308L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIiBkYXRhLWFjdD1cInVwZ3JhZGVcIiBkYXRhLWlkPVwiJHtpdGVtLmlkfVwiIHRpdGxlPVwiXHU2RDg4XHU4MDE3ICR7aXRlbS5sZXZlbCAqIDUwfSBcdTc3RkZcdTc3RjNcIj48c3BhbiBkYXRhLWljbz1cIndyZW5jaFwiPjwvc3Bhbj5cdTUzNDdcdTdFQTcgKCR7aXRlbS5sZXZlbCAqIDUwfSk8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLWdob3N0XCIgZGF0YS1hY3Q9XCJ0b2dnbGVcIiBkYXRhLWlkPVwiJHtpdGVtLmlkfVwiPjxzcGFuIGRhdGEtaWNvPVwibGlzdFwiPjwvc3Bhbj5cdThCRTZcdTYwQzU8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0aW1lbGluZVwiIGlkPVwidGwtJHtpdGVtLmlkfVwiIGhpZGRlbj48L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIGApO1xuICAgICAgICAgIG1vdW50SWNvbnMocm93KTtcbiAgICAgICAgICByb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZXYpID0+IHtcbiAgICAgICAgICAgIC8vIFx1NjdFNVx1NjI3RVx1NzcxRlx1NkI2M1x1NzY4NFx1NjMwOVx1OTRBRVx1NTE0M1x1N0QyMFx1RkYwOFx1NTNFRlx1ODBGRFx1NzBCOVx1NTFGQlx1NEU4Nlx1NTE4NVx1OTBFOFx1NzY4NHNwYW4vc3ZnXHVGRjA5XG4gICAgICAgICAgICBjb25zdCBidG4gPSAoZXYudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5jbG9zZXN0KCdidXR0b24nKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcbiAgICAgICAgICAgIGlmICghYnRuKSByZXR1cm47XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IGlkID0gYnRuLmdldEF0dHJpYnV0ZSgnZGF0YS1pZCcpO1xuICAgICAgICAgICAgY29uc3QgYWN0ID0gYnRuLmdldEF0dHJpYnV0ZSgnZGF0YS1hY3QnKTtcbiAgICAgICAgICAgIGlmICghaWQgfHwgIWFjdCkgcmV0dXJuO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBcdTk2MzJcdTZCNjJcdTkxQ0RcdTU5MERcdTcwQjlcdTUxRkJcbiAgICAgICAgICAgIGlmIChidG4uZGlzYWJsZWQgJiYgYWN0ICE9PSAndG9nZ2xlJykgcmV0dXJuO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoYWN0ID09PSAndG9nZ2xlJykge1xuICAgICAgICAgICAgICBjb25zdCBib3ggPSByb3cucXVlcnlTZWxlY3RvcihgI3RsLSR7aWR9YCkgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgICAgICAgIGlmICghYm94KSByZXR1cm47XG4gICAgICAgICAgICAgIGlmICghYm94Lmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgICAgICAgICAgIGJveC5pbm5lckhUTUwgPSAnPGRpdiBjbGFzcz1cInNrZWxldG9uXCIgc3R5bGU9XCJoZWlnaHQ6MzZweDtcIj48L2Rpdj4nO1xuICAgICAgICAgICAgICAgIGJveC5oaWRkZW4gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgbG9nczogeyB0eXBlOiBzdHJpbmc7IGRlc2M/OiBzdHJpbmc7IHRpbWU6IG51bWJlciB9W10gfT4oYC9pdGVtcy9sb2dzP2l0ZW1JZD0ke2lkfWApO1xuICAgICAgICAgICAgICAgICAgY29uc3QgbG9ncyA9IEFycmF5LmlzQXJyYXkocmVzLmxvZ3MpID8gcmVzLmxvZ3MgOiBbXTtcbiAgICAgICAgICAgICAgICAgIGJveC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICAgICAgICAgIGlmICghbG9ncy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgYm94LmlubmVySFRNTCA9ICc8ZGl2IHN0eWxlPVwib3BhY2l0eTouODtcIj5cdTY2ODJcdTY1RTBcdTUzODZcdTUzRjJcdTY1NzBcdTYzNkU8L2Rpdj4nO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBsb2cgb2YgbG9ncykge1xuICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBodG1sKGBcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0aW1lbGluZS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkb3RcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRpbWVcIj4ke2Zvcm1hdFRpbWUobG9nLnRpbWUpfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGVzY1wiPiR7KGxvZy5kZXNjIHx8IGxvZy50eXBlIHx8ICcnKS5yZXBsYWNlKC88L2csJyZsdDsnKX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIGApO1xuICAgICAgICAgICAgICAgICAgICAgIGJveC5hcHBlbmRDaGlsZChub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgICAgICAgICAgYm94LmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgICAgICAgYm94LmFwcGVuZENoaWxkKGh0bWwoYFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGltZWxpbmUtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkb3RcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGltZVwiPlx1MjAxNDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkZXNjXCI+XHU2NzY1XHU2RTkwXHU2NzJBXHU3N0U1IFx1MDBCNyBcdTUzRUZcdTkwMUFcdThGQzdcdTYzMTZcdTc3RkZcdTMwMDFcdTYzQTBcdTU5M0FcdTYyMTZcdTRFQTRcdTY2MTNcdTgzQjdcdTUzRDY8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICBgKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGJveC5oaWRkZW4gPSAhYm94LmhpZGRlbjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIFx1NjRDRFx1NEY1Q1x1NjMwOVx1OTRBRVx1NTkwNFx1NzQwNlxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgYnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxIVE1MID0gYnRuLmlubmVySFRNTDtcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIGlmIChhY3QgPT09ICdlcXVpcCcpIHtcbiAgICAgICAgICAgICAgICBidG4uaW5uZXJIVE1MID0gJzxzcGFuIGRhdGEtaWNvPVwic2hpZWxkXCI+PC9zcGFuPlx1ODhDNVx1NTkwN1x1NEUyRFx1MjAyNic7XG4gICAgICAgICAgICAgICAgbW91bnRJY29ucyhidG4pO1xuICAgICAgICAgICAgICAgIGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdCgnL2l0ZW1zL2VxdWlwJywgeyBtZXRob2Q6ICdQT1NUJywgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBpdGVtSWQ6IGlkIH0pIH0pO1xuICAgICAgICAgICAgICAgIHNob3dUb2FzdCgnXHU4OEM1XHU1OTA3XHU2MjEwXHU1MjlGJywgJ3N1Y2Nlc3MnKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChhY3QgPT09ICd1bmVxdWlwJykge1xuICAgICAgICAgICAgICAgIGJ0bi5pbm5lckhUTUwgPSAnPHNwYW4gZGF0YS1pY289XCJ4XCI+PC9zcGFuPlx1NTM3OFx1NEUwQlx1NEUyRFx1MjAyNic7XG4gICAgICAgICAgICAgICAgbW91bnRJY29ucyhidG4pO1xuICAgICAgICAgICAgICAgIGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdCgnL2l0ZW1zL3VuZXF1aXAnLCB7IG1ldGhvZDogJ1BPU1QnLCBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGl0ZW1JZDogaWQgfSkgfSk7XG4gICAgICAgICAgICAgICAgc2hvd1RvYXN0KCdcdTUzNzhcdTRFMEJcdTYyMTBcdTUyOUYnLCAnc3VjY2VzcycpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFjdCA9PT0gJ3VwZ3JhZGUnKSB7XG4gICAgICAgICAgICAgICAgYnRuLmlubmVySFRNTCA9ICc8c3BhbiBkYXRhLWljbz1cIndyZW5jaFwiPjwvc3Bhbj5cdTUzNDdcdTdFQTdcdTRFMkRcdTIwMjYnO1xuICAgICAgICAgICAgICAgIG1vdW50SWNvbnMoYnRuKTtcbiAgICAgICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyBsZXZlbDogbnVtYmVyOyBjb3N0OiBudW1iZXIgfT4oJy9pdGVtcy91cGdyYWRlJywgeyBtZXRob2Q6ICdQT1NUJywgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBpdGVtSWQ6IGlkIH0pIH0pO1xuICAgICAgICAgICAgICAgIC8vIFx1NTM0N1x1N0VBN1x1NjIxMFx1NTI5Rlx1NTJBOFx1NzUzQlxuICAgICAgICAgICAgICAgIHJvdy5jbGFzc0xpc3QuYWRkKCd1cGdyYWRlLXN1Y2Nlc3MnKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHJvdy5jbGFzc0xpc3QucmVtb3ZlKCd1cGdyYWRlLXN1Y2Nlc3MnKSwgMTAwMCk7XG4gICAgICAgICAgICAgICAgc2hvd1RvYXN0KGBcdTUzNDdcdTdFQTdcdTYyMTBcdTUyOUZcdUZGMDFcdTdCNDlcdTdFQTcgJHtyZXMubGV2ZWx9XHVGRjA4XHU2RDg4XHU4MDE3ICR7cmVzLmNvc3R9IFx1NzdGRlx1NzdGM1x1RkYwOWAsICdzdWNjZXNzJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgYXdhaXQgYmFyLnVwZGF0ZSgpO1xuICAgICAgICAgICAgICBhd2FpdCBsb2FkKCk7XG4gICAgICAgICAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgICAgICAgICAgc2hvd1RvYXN0KGU/Lm1lc3NhZ2UgfHwgJ1x1NjRDRFx1NEY1Q1x1NTkzMVx1OEQyNScsICdlcnJvcicpO1xuICAgICAgICAgICAgICAvLyBcdTU5MzFcdThEMjVcdTY1RjZcdTYwNjJcdTU5MERcdTYzMDlcdTk0QUVcdTUzOUZcdTU5Q0JcdTcyQjZcdTYwMDFcdUZGMDhcdTU2RTBcdTRFM0FcdTRFMERcdTRGMUFcdTkxQ0RcdTY1QjBcdTZFMzJcdTY3RDNcdUZGMDlcbiAgICAgICAgICAgICAgYnRuLmlubmVySFRNTCA9IG9yaWdpbmFsSFRNTDtcbiAgICAgICAgICAgICAgYnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgbGlzdC5hcHBlbmRDaGlsZChyb3cpO1xuICAgICAgICB9XG5cbiAgICAgICAgdHBsQ29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuICAgICAgICBmb3IgKGNvbnN0IHRwbCBvZiAodHBscy50ZW1wbGF0ZXMgfHwgW10pKSB7XG4gICAgICAgICAgY29uc3Qgcm93ID0gaHRtbChgPGRpdiBjbGFzcz1cImxpc3QtaXRlbVwiPjxzdHJvbmc+JHt0cGwubmFtZSB8fCB0cGwuaWR9PC9zdHJvbmc+IFx1MDBCNyAke3RwbC5jYXRlZ29yeSB8fCAnXHU2NzJBXHU3N0U1XHU3QzdCXHU1NzhCJ308L2Rpdj5gKTtcbiAgICAgICAgICB0cGxDb250YWluZXIuYXBwZW5kQ2hpbGQocm93KTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgIHNob3dUb2FzdChlPy5tZXNzYWdlIHx8ICdcdTUyQTBcdThGN0RcdTRFRDNcdTVFOTNcdTU5MzFcdThEMjUnLCAnZXJyb3InKTtcbiAgICAgICAgbGlzdC5pbm5lckhUTUwgPSAnPGRpdiBzdHlsZT1cIm9wYWNpdHk6Ljg7dGV4dC1hbGlnbjpjZW50ZXI7cGFkZGluZzoyMHB4O1wiPlx1NTJBMFx1OEY3RFx1NTkzMVx1OEQyNVx1RkYwQ1x1OEJGN1x1N0EwRFx1NTQwRVx1OTFDRFx1OEJENTwvZGl2Pic7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICByZWZyZXNoQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIHJlZnJlc2hCdG4uaW5uZXJIVE1MID0gJzxzcGFuIGRhdGEtaWNvPVwicmVmcmVzaFwiPjwvc3Bhbj5cdTUyMzdcdTY1QjAnO1xuICAgICAgICBtb3VudEljb25zKHJlZnJlc2hCdG4pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZWZyZXNoQnRuLm9uY2xpY2sgPSAoKSA9PiBsb2FkKCk7XG4gICAgYXdhaXQgbG9hZCgpO1xuICB9XG59XG4iLCAiaW1wb3J0IHsgTmV0d29ya01hbmFnZXIgfSBmcm9tICcuLi9jb3JlL05ldHdvcmtNYW5hZ2VyJztcbmltcG9ydCB7IGh0bWwsIHFzIH0gZnJvbSAnLi4vdXRpbHMvZG9tJztcbmltcG9ydCB7IHJlbmRlck5hdiB9IGZyb20gJy4uL2NvbXBvbmVudHMvTmF2JztcbmltcG9ydCB7IFJlYWx0aW1lQ2xpZW50IH0gZnJvbSAnLi4vY29yZS9SZWFsdGltZUNsaWVudCc7XG5pbXBvcnQgeyBzaG93VG9hc3QgfSBmcm9tICcuLi9jb21wb25lbnRzL1RvYXN0JztcbmltcG9ydCB7IHJlbmRlclJlc291cmNlQmFyIH0gZnJvbSAnLi4vY29tcG9uZW50cy9SZXNvdXJjZUJhcic7XG5pbXBvcnQgeyByZW5kZXJJY29uIH0gZnJvbSAnLi4vY29tcG9uZW50cy9JY29uJztcblxuZXhwb3J0IGNsYXNzIFBsdW5kZXJTY2VuZSB7XG4gIHByaXZhdGUgcmVzdWx0Qm94OiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuXG4gIG1vdW50KHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgcm9vdC5pbm5lckhUTUwgPSAnJztcbiAgICByb290LmFwcGVuZENoaWxkKHJlbmRlck5hdigncGx1bmRlcicpKTtcbiAgICBjb25zdCBiYXIgPSByZW5kZXJSZXNvdXJjZUJhcigpO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQoYmFyLnJvb3QpO1xuXG4gICAgY29uc3QgdmlldyA9IGh0bWwoYFxuICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lciBncmlkLTJcIiBzdHlsZT1cImNvbG9yOiNmZmY7XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkIGZhZGUtaW5cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCIgc3R5bGU9XCJqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjthbGlnbi1pdGVtczpjZW50ZXI7XCI+XG4gICAgICAgICAgICA8aDMgc3R5bGU9XCJtYXJnaW46MDtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo4cHg7XCI+PHNwYW4gZGF0YS1pY289XCJzd29yZFwiPjwvc3Bhbj5cdTYzQTBcdTU5M0FcdTc2RUVcdTY4MDc8L2gzPlxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInJlZnJlc2hcIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiPjxzcGFuIGRhdGEtaWNvPVwicmVmcmVzaFwiPjwvc3Bhbj5cdTUyMzdcdTY1QjA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGlkPVwibGlzdFwiIHN0eWxlPVwibWFyZ2luLXRvcDoxMnB4O2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjhweDtcIj48L2Rpdj5cbiAgICAgICAgICA8ZGl2IGlkPVwicmVzdWx0XCIgc3R5bGU9XCJtYXJnaW4tdG9wOjEycHg7b3BhY2l0eTouOTtmb250LWZhbWlseTptb25vc3BhY2U7XCI+PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgYCk7XG4gICAgcm9vdC5hcHBlbmRDaGlsZCh2aWV3KTtcblxuICAgIGNvbnN0IHRva2VuID0gTmV0d29ya01hbmFnZXIuSS5nZXRUb2tlbigpO1xuICAgIGlmICh0b2tlbikgUmVhbHRpbWVDbGllbnQuSS5jb25uZWN0KHRva2VuKTtcblxuICAgIFJlYWx0aW1lQ2xpZW50Lkkub24oJ3BsdW5kZXIuYXR0YWNrZWQnLCAobXNnKSA9PiB7XG4gICAgICBzaG93VG9hc3QoYFx1ODhBQlx1NjNBMFx1NTkzQVx1RkYxQVx1Njc2NVx1ODFFQSAke21zZy5hdHRhY2tlcn1cdUZGMENcdTYzNUZcdTU5MzEgJHttc2cubG9zc31gKTtcbiAgICAgIHRoaXMubG9nKGBcdTg4QUIgJHttc2cuYXR0YWNrZXJ9IFx1NjNBMFx1NTkzQVx1RkYwQ1x1NjM1Rlx1NTkzMSAke21zZy5sb3NzfWApO1xuICAgIH0pO1xuICAgIHRoaXMucmVzdWx0Qm94ID0gcXModmlldywgJyNyZXN1bHQnKTtcblxuICAgIGNvbnN0IGxpc3QgPSBxcyh2aWV3LCAnI2xpc3QnKTtcbiAgICBjb25zdCByZWZyZXNoQnRuID0gcXM8SFRNTEJ1dHRvbkVsZW1lbnQ+KHZpZXcsICcjcmVmcmVzaCcpO1xuICAgIGNvbnN0IG1vdW50SWNvbnMgPSAocm9vdEVsOiBFbGVtZW50KSA9PiB7XG4gICAgICByb290RWwucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtaWNvXScpXG4gICAgICAgIC5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICAgIGNvbnN0IG5hbWUgPSAoZWwgYXMgSFRNTEVsZW1lbnQpLmdldEF0dHJpYnV0ZSgnZGF0YS1pY28nKSBhcyBhbnk7XG4gICAgICAgICAgdHJ5IHsgZWwuYXBwZW5kQ2hpbGQocmVuZGVySWNvbihuYW1lLCB7IHNpemU6IDIwIH0pKTsgfSBjYXRjaCB7fVxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIG1vdW50SWNvbnModmlldyk7XG5cbiAgICBjb25zdCBsb2FkID0gYXN5bmMgKCkgPT4ge1xuICAgICAgcmVmcmVzaEJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICByZWZyZXNoQnRuLmlubmVySFRNTCA9ICc8c3BhbiBkYXRhLWljbz1cInJlZnJlc2hcIj48L3NwYW4+XHU1MjM3XHU2NUIwXHU0RTJEXHUyMDI2JztcbiAgICAgIG1vdW50SWNvbnMocmVmcmVzaEJ0bik7XG4gICAgICBhd2FpdCBiYXIudXBkYXRlKCk7XG4gICAgICBsaXN0LmlubmVySFRNTCA9ICcnO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIGxpc3QuYXBwZW5kQ2hpbGQoaHRtbCgnPGRpdiBjbGFzcz1cInNrZWxldG9uXCI+PC9kaXY+JykpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IHRhcmdldHM6IGFueVtdIH0+KCcvcGx1bmRlci90YXJnZXRzJyk7XG4gICAgICAgIGxpc3QuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIGlmICghZGF0YS50YXJnZXRzLmxlbmd0aCkge1xuICAgICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQoaHRtbCgnPGRpdiBzdHlsZT1cIm9wYWNpdHk6Ljg7XCI+XHU2NjgyXHU2NUUwXHU1M0VGXHU2M0EwXHU1OTNBXHU3Njg0XHU3NkVFXHU2ODA3XHVGRjBDXHU3QTBEXHU1NDBFXHU1MThEXHU4QkQ1PC9kaXY+JykpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgdGFyZ2V0IG9mIGRhdGEudGFyZ2V0cykge1xuICAgICAgICAgIGNvbnN0IHJvdyA9IGh0bWwoYFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxpc3QtaXRlbSBsaXN0LWl0ZW0tLXNlbGxcIj5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cImRpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjJweDtcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NnB4O1wiPjxzcGFuIGRhdGEtaWNvPVwidGFyZ2V0XCI+PC9zcGFuPjxzdHJvbmc+JHt0YXJnZXQudXNlcm5hbWUgfHwgdGFyZ2V0LmlkfTwvc3Ryb25nPjwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJvcGFjaXR5Oi44NTtcIj5cdTc3RkZcdTc3RjNcdUZGMUEke3RhcmdldC5vcmV9IDxzcGFuIGNsYXNzPVwicGlsbFwiPlx1OTg4NFx1OEJBMVx1NjUzNlx1NzZDQSA1JX4zMCU8L3NwYW4+PC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLXNlbGxcIiBkYXRhLWlkPVwiJHt0YXJnZXQuaWR9XCI+PHNwYW4gZGF0YS1pY289XCJzd29yZFwiPjwvc3Bhbj5cdTYzQTBcdTU5M0E8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICBgKTtcbiAgICAgICAgICBtb3VudEljb25zKHJvdyk7XG4gICAgICAgICAgcm93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKGV2KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBlbCA9IGV2LnRhcmdldCBhcyBIVE1MQnV0dG9uRWxlbWVudDtcbiAgICAgICAgICAgIGNvbnN0IGlkID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWlkJyk7XG4gICAgICAgICAgICBpZiAoIWlkKSByZXR1cm47XG4gICAgICAgICAgICBjb25zdCBidG4gPSBlbC5jbG9zZXN0KCdidXR0b24nKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcbiAgICAgICAgICAgIGlmICghYnRuKSByZXR1cm47XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgICBjb25zdCBvcmlnaW5hbEhUTUwgPSBidG4uaW5uZXJIVE1MO1xuICAgICAgICAgICAgYnRuLmlubmVySFRNTCA9ICc8c3BhbiBkYXRhLWljbz1cInN3b3JkXCI+PC9zcGFuPlx1NjNBMFx1NTkzQVx1NEUyRFx1MjAyNic7XG4gICAgICAgICAgICBtb3VudEljb25zKGJ0bik7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGxldCBzaG91bGRSZWZyZXNoID0gZmFsc2U7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyBzdWNjZXNzOiBib29sZWFuOyBsb290X2Ftb3VudDogbnVtYmVyIH0+KGAvcGx1bmRlci8ke2lkfWAsIHsgbWV0aG9kOiAnUE9TVCcgfSk7XG4gICAgICAgICAgICAgIGlmIChyZXMuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIHRoaXMubG9nKGBcdTYyMTBcdTUyOUZcdTYzQTBcdTU5M0EgJHtpZH1cdUZGMENcdTgzQjdcdTVGOTcgJHtyZXMubG9vdF9hbW91bnR9YCk7XG4gICAgICAgICAgICAgICAgc2hvd1RvYXN0KGBcdTYzQTBcdTU5M0FcdTYyMTBcdTUyOUZcdUZGMENcdTgzQjdcdTVGOTcgJHtyZXMubG9vdF9hbW91bnR9IFx1NzdGRlx1NzdGM2AsICdzdWNjZXNzJyk7XG4gICAgICAgICAgICAgICAgc2hvdWxkUmVmcmVzaCA9IHRydWU7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2coYFx1NjNBMFx1NTkzQSAke2lkfSBcdTU5MzFcdThEMjVgKTtcbiAgICAgICAgICAgICAgICBzaG93VG9hc3QoJ1x1NjNBMFx1NTkzQVx1NTkzMVx1OEQyNScsICd3YXJuJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgYXdhaXQgYmFyLnVwZGF0ZSgpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBlPy5tZXNzYWdlIHx8ICdcdTYzQTBcdTU5M0FcdTU5MzFcdThEMjUnO1xuICAgICAgICAgICAgICB0aGlzLmxvZyhgXHU2M0EwXHU1OTNBXHU1OTMxXHU4RDI1XHVGRjFBJHttZXNzYWdlfWApO1xuICAgICAgICAgICAgICBpZiAobWVzc2FnZS5pbmNsdWRlcygnXHU1MUI3XHU1Mzc0JykpIHtcbiAgICAgICAgICAgICAgICBzaG93VG9hc3QobWVzc2FnZSwgJ3dhcm4nKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzaG93VG9hc3QobWVzc2FnZSwgJ2Vycm9yJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLy8gXHU1OTMxXHU4RDI1XHU2NUY2XHU2MDYyXHU1OTBEXHU2MzA5XHU5NEFFXG4gICAgICAgICAgICAgIGJ0bi5pbm5lckhUTUwgPSBvcmlnaW5hbEhUTUw7XG4gICAgICAgICAgICAgIG1vdW50SWNvbnMoYnRuKTtcbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgIGJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAvLyBcdTYyMTBcdTUyOUZcdTU0MEVcdTUyMzdcdTY1QjBcdTUyMTdcdTg4NjhcdUZGMDhcdTRGMUFcdTY2RkZcdTYzNjJcdTYzMDlcdTk0QUVcdUZGMDlcbiAgICAgICAgICAgICAgaWYgKHNob3VsZFJlZnJlc2gpIHtcbiAgICAgICAgICAgICAgICBhd2FpdCBsb2FkKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBsaXN0LmFwcGVuZENoaWxkKHJvdyk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgICBzaG93VG9hc3QoZT8ubWVzc2FnZSB8fCAnXHU1MkEwXHU4RjdEXHU2M0EwXHU1OTNBXHU3NkVFXHU2ODA3XHU1OTMxXHU4RDI1JywgJ2Vycm9yJyk7XG4gICAgICAgIGxpc3QuaW5uZXJIVE1MID0gJzxkaXYgc3R5bGU9XCJvcGFjaXR5Oi44O3RleHQtYWxpZ246Y2VudGVyO3BhZGRpbmc6MjBweDtcIj5cdTUyQTBcdThGN0RcdTU5MzFcdThEMjVcdUZGMENcdThCRjdcdTdBMERcdTU0MEVcdTkxQ0RcdThCRDU8L2Rpdj4nO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgcmVmcmVzaEJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICByZWZyZXNoQnRuLmlubmVySFRNTCA9ICc8c3BhbiBkYXRhLWljbz1cInJlZnJlc2hcIj48L3NwYW4+XHU1MjM3XHU2NUIwJztcbiAgICAgICAgbW91bnRJY29ucyhyZWZyZXNoQnRuKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmVmcmVzaEJ0bi5vbmNsaWNrID0gKCkgPT4gbG9hZCgpO1xuICAgIGxvYWQoKTtcbiAgfVxuXG4gIHByaXZhdGUgbG9nKG1zZzogc3RyaW5nKSB7XG4gICAgaWYgKCF0aGlzLnJlc3VsdEJveCkgcmV0dXJuO1xuICAgIGNvbnN0IGxpbmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBsaW5lLnRleHRDb250ZW50ID0gYFske25ldyBEYXRlKCkudG9Mb2NhbGVUaW1lU3RyaW5nKCl9XSAke21zZ31gO1xuICAgIHRoaXMucmVzdWx0Qm94LnByZXBlbmQobGluZSk7XG4gIH1cbn1cbiIsICJpbXBvcnQgeyBOZXR3b3JrTWFuYWdlciB9IGZyb20gJy4uL2NvcmUvTmV0d29ya01hbmFnZXInO1xuaW1wb3J0IHsgaHRtbCwgcXMgfSBmcm9tICcuLi91dGlscy9kb20nO1xuaW1wb3J0IHsgcmVuZGVyTmF2IH0gZnJvbSAnLi4vY29tcG9uZW50cy9OYXYnO1xuaW1wb3J0IHsgUmVhbHRpbWVDbGllbnQgfSBmcm9tICcuLi9jb3JlL1JlYWx0aW1lQ2xpZW50JztcbmltcG9ydCB7IEdhbWVNYW5hZ2VyIH0gZnJvbSAnLi4vY29yZS9HYW1lTWFuYWdlcic7XG5pbXBvcnQgeyBzaG93VG9hc3QgfSBmcm9tICcuLi9jb21wb25lbnRzL1RvYXN0JztcbmltcG9ydCB7IHJlbmRlclJlc291cmNlQmFyIH0gZnJvbSAnLi4vY29tcG9uZW50cy9SZXNvdXJjZUJhcic7XG5pbXBvcnQgeyByZW5kZXJJY29uIH0gZnJvbSAnLi4vY29tcG9uZW50cy9JY29uJztcblxudHlwZSBPcmRlciA9IHtcbiAgaWQ6IHN0cmluZztcbiAgdXNlcklkOiBzdHJpbmc7XG4gIHR5cGU6ICdidXknIHwgJ3NlbGwnO1xuICBpdGVtVGVtcGxhdGVJZD86IHN0cmluZztcbiAgaXRlbUluc3RhbmNlSWQ/OiBzdHJpbmc7XG4gIHByaWNlOiBudW1iZXI7XG4gIGFtb3VudDogbnVtYmVyO1xuICBjcmVhdGVkQXQ6IG51bWJlcjtcbn07XG5cbmV4cG9ydCBjbGFzcyBFeGNoYW5nZVNjZW5lIHtcbiAgcHJpdmF0ZSByZWZyZXNoVGltZXI6IG51bWJlciB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHRlbXBsYXRlczogeyBpZDogc3RyaW5nOyBuYW1lPzogc3RyaW5nOyBjYXRlZ29yeT86IHN0cmluZyB9W10gPSBbXTtcbiAgcHJpdmF0ZSBpbnZlbnRvcnk6IGFueVtdID0gW107XG5cbiAgYXN5bmMgbW91bnQocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICB0aGlzLmNsZWFyVGltZXIoKTtcbiAgICByb290LmlubmVySFRNTCA9ICcnO1xuXG4gICAgY29uc3QgbmF2ID0gcmVuZGVyTmF2KCdleGNoYW5nZScpO1xuICAgIGNvbnN0IGJhciA9IHJlbmRlclJlc291cmNlQmFyKCk7XG4gICAgY29uc3QgdmlldyA9IGh0bWwoYFxuICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lciBncmlkLTJcIiBzdHlsZT1cImNvbG9yOiNmZmY7XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkIGZhZGUtaW5cIj5cbiAgICAgICAgICA8aDMgc3R5bGU9XCJtYXJnaW46MCAwIDEycHg7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6OHB4O1wiPjxzcGFuIGRhdGEtaWNvPVwiZXhjaGFuZ2VcIj48L3NwYW4+XHU1RTAyXHU1NzNBXHU0RTBCXHU1MzU1PC9oMz5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCIgc3R5bGU9XCJmbGV4LXdyYXA6d3JhcDthbGlnbi1pdGVtczpmbGV4LWVuZDtnYXA6MTJweDtcIj5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJmbGV4OjE7bWluLXdpZHRoOjE4MHB4O1wiPlxuICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9XCJkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo2cHg7XCI+PHNwYW4gZGF0YS1pY289XCJsaXN0XCI+PC9zcGFuPlx1OEQyRFx1NEU3MFx1NkEyMVx1Njc3RjwvbGFiZWw+XG4gICAgICAgICAgICAgIDxzZWxlY3QgaWQ9XCJ0cGxcIiBjbGFzcz1cImlucHV0XCI+PC9zZWxlY3Q+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJmbGV4OjE7bWluLXdpZHRoOjEyMHB4O1wiPlxuICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9XCJkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo2cHg7XCI+PHNwYW4gZGF0YS1pY289XCJjb2luXCI+PC9zcGFuPlx1NEVGN1x1NjgzQyAoQkJcdTVFMDEpPC9sYWJlbD5cbiAgICAgICAgICAgICAgPGlucHV0IGlkPVwicHJpY2VcIiBjbGFzcz1cImlucHV0XCIgdHlwZT1cIm51bWJlclwiIG1pbj1cIjFcIiB2YWx1ZT1cIjEwXCIvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZmxleDoxO21pbi13aWR0aDoxMjBweDtcIj5cbiAgICAgICAgICAgICAgPGxhYmVsPlx1OEQyRFx1NEU3MFx1NjU3MFx1OTFDRjwvbGFiZWw+XG4gICAgICAgICAgICAgIDxpbnB1dCBpZD1cImFtb3VudFwiIGNsYXNzPVwiaW5wdXRcIiB0eXBlPVwibnVtYmVyXCIgbWluPVwiMVwiIHZhbHVlPVwiMVwiLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInBsYWNlQnV5XCIgY2xhc3M9XCJidG4gYnRuLWJ1eVwiIHN0eWxlPVwibWluLXdpZHRoOjEyMHB4O1wiPjxzcGFuIGRhdGEtaWNvPVwiYXJyb3ctcmlnaHRcIj48L3NwYW4+XHU0RTBCXHU0RTcwXHU1MzU1PC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBzdHlsZT1cImhlaWdodDo4cHg7XCI+PC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiIHN0eWxlPVwiZmxleC13cmFwOndyYXA7YWxpZ24taXRlbXM6ZmxleC1lbmQ7Z2FwOjEycHg7XCI+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZmxleDoxO21pbi13aWR0aDoyMjBweDtcIj5cbiAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVwiZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NnB4O1wiPjxzcGFuIGRhdGEtaWNvPVwiYm94XCI+PC9zcGFuPlx1NTFGQVx1NTUyRVx1OTA1M1x1NTE3NzwvbGFiZWw+XG4gICAgICAgICAgICAgIDxzZWxlY3QgaWQ9XCJpbnN0XCIgY2xhc3M9XCJpbnB1dFwiPjwvc2VsZWN0PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZmxleDoxO21pbi13aWR0aDoxMjBweDtcIj5cbiAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVwiZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NnB4O1wiPjxzcGFuIGRhdGEtaWNvPVwiY29pblwiPjwvc3Bhbj5cdTRFRjdcdTY4M0MgKEJCXHU1RTAxKTwvbGFiZWw+XG4gICAgICAgICAgICAgIDxpbnB1dCBpZD1cInNwcmljZVwiIGNsYXNzPVwiaW5wdXRcIiB0eXBlPVwibnVtYmVyXCIgbWluPVwiMVwiIHZhbHVlPVwiNVwiLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInBsYWNlU2VsbFwiIGNsYXNzPVwiYnRuIGJ0bi1zZWxsXCIgc3R5bGU9XCJtaW4td2lkdGg6MTIwcHg7XCI+PHNwYW4gZGF0YS1pY289XCJhcnJvdy1yaWdodFwiPjwvc3Bhbj5cdTRFMEJcdTUzNTZcdTUzNTU8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGlkPVwiaW52ZW50b3J5XCIgc3R5bGU9XCJtYXJnaW4tdG9wOjEycHg7ZGlzcGxheTpmbGV4O2ZsZXgtd3JhcDp3cmFwO2dhcDo4cHg7XCI+PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkIGZhZGUtaW5cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCIgc3R5bGU9XCJqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjEycHg7XCI+XG4gICAgICAgICAgICA8aDMgc3R5bGU9XCJtYXJnaW46MDtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo4cHg7XCI+PHNwYW4gZGF0YS1pY289XCJsaXN0XCI+PC9zcGFuPlx1OEJBMlx1NTM1NVx1N0MzRjwvaDM+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCIgc3R5bGU9XCJmbGV4LXdyYXA6d3JhcDtnYXA6OHB4O1wiPlxuICAgICAgICAgICAgICA8c2VsZWN0IGlkPVwicV90cGxcIiBjbGFzcz1cImlucHV0XCIgc3R5bGU9XCJ3aWR0aDoxODBweDtcIj48L3NlbGVjdD5cbiAgICAgICAgICAgICAgPHNlbGVjdCBpZD1cInFfdHlwZVwiIGNsYXNzPVwiaW5wdXRcIiBzdHlsZT1cIndpZHRoOjEyMHB4O1wiPlxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJidXlcIj5cdTRFNzBcdTUzNTU8L29wdGlvbj5cbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwic2VsbFwiPlx1NTM1Nlx1NTM1NTwvb3B0aW9uPlxuICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwicm93IHBpbGxcIiBzdHlsZT1cImFsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NnB4O1wiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGRhdGEtaWNvPVwidXNlclwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJteVwiIHR5cGU9XCJjaGVja2JveFwiLz4gXHU1M0VBXHU3NzBCXHU2MjExXHU3Njg0XG4gICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJyZWZyZXNoXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIiBzdHlsZT1cIm1pbi13aWR0aDo5NnB4O1wiPjxzcGFuIGRhdGEtaWNvPVwicmVmcmVzaFwiPjwvc3Bhbj5cdTUyMzdcdTY1QjA8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgaWQ9XCJib29rXCIgc3R5bGU9XCJtYXJnaW4tdG9wOjEycHg7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6OHB4O1wiPjwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZCBmYWRlLWluXCIgaWQ9XCJsb2dzXCIgc3R5bGU9XCJvcGFjaXR5Oi45O2ZvbnQtZmFtaWx5Om1vbm9zcGFjZTttaW4taGVpZ2h0OjI0cHg7XCI+PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICBgKTtcblxuICAgIHJvb3QuYXBwZW5kQ2hpbGQobmF2KTtcbiAgICByb290LmFwcGVuZENoaWxkKGJhci5yb290KTtcbiAgICByb290LmFwcGVuZENoaWxkKHZpZXcpO1xuXG4gICAgY29uc3QgdG9rZW4gPSBOZXR3b3JrTWFuYWdlci5JLmdldFRva2VuKCk7XG4gICAgaWYgKHRva2VuKSBSZWFsdGltZUNsaWVudC5JLmNvbm5lY3QodG9rZW4pO1xuICAgIGNvbnN0IG1lID0gR2FtZU1hbmFnZXIuSS5nZXRQcm9maWxlKCk7XG5cbiAgICBjb25zdCBib29rID0gcXModmlldywgJyNib29rJyk7XG4gICAgY29uc3QgbG9ncyA9IHFzPEhUTUxFbGVtZW50Pih2aWV3LCAnI2xvZ3MnKTtcbiAgICBjb25zdCBidXlUcGwgPSBxczxIVE1MU2VsZWN0RWxlbWVudD4odmlldywgJyN0cGwnKTtcbiAgICBjb25zdCBidXlQcmljZSA9IHFzPEhUTUxJbnB1dEVsZW1lbnQ+KHZpZXcsICcjcHJpY2UnKTtcbiAgICBjb25zdCBidXlBbW91bnQgPSBxczxIVE1MSW5wdXRFbGVtZW50Pih2aWV3LCAnI2Ftb3VudCcpO1xuICAgIGNvbnN0IHBsYWNlQnV5ID0gcXM8SFRNTEJ1dHRvbkVsZW1lbnQ+KHZpZXcsICcjcGxhY2VCdXknKTtcbiAgICBjb25zdCBzZWxsSW5zdCA9IHFzPEhUTUxTZWxlY3RFbGVtZW50Pih2aWV3LCAnI2luc3QnKTtcbiAgICBjb25zdCBzZWxsUHJpY2UgPSBxczxIVE1MSW5wdXRFbGVtZW50Pih2aWV3LCAnI3NwcmljZScpO1xuICAgIGNvbnN0IHBsYWNlU2VsbCA9IHFzPEhUTUxCdXR0b25FbGVtZW50Pih2aWV3LCAnI3BsYWNlU2VsbCcpO1xuICAgIGNvbnN0IGludkJveCA9IHFzPEhUTUxFbGVtZW50Pih2aWV3LCAnI2ludmVudG9yeScpO1xuICAgIGNvbnN0IHF1ZXJ5VHBsID0gcXM8SFRNTFNlbGVjdEVsZW1lbnQ+KHZpZXcsICcjcV90cGwnKTtcbiAgICBjb25zdCBxdWVyeVR5cGUgPSBxczxIVE1MU2VsZWN0RWxlbWVudD4odmlldywgJyNxX3R5cGUnKTtcbiAgICBjb25zdCBxdWVyeU1pbmVPbmx5ID0gcXM8SFRNTElucHV0RWxlbWVudD4odmlldywgJyNteScpO1xuICAgIGNvbnN0IG1pbmVPbmx5TGFiZWwgPSB2aWV3LnF1ZXJ5U2VsZWN0b3IoJ2xhYmVsLnJvdy5waWxsJykgYXMgSFRNTExhYmVsRWxlbWVudCB8IG51bGw7XG4gICAgY29uc3QgcmVmcmVzaEJ0biA9IHFzPEhUTUxCdXR0b25FbGVtZW50Pih2aWV3LCAnI3JlZnJlc2gnKTtcblxuICAgIGNvbnN0IG1vdW50SWNvbnMgPSAocm9vdEVsOiBFbGVtZW50KSA9PiB7XG4gICAgICByb290RWwucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtaWNvXScpXG4gICAgICAgIC5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICAgIGNvbnN0IG5hbWUgPSAoZWwgYXMgSFRNTEVsZW1lbnQpLmdldEF0dHJpYnV0ZSgnZGF0YS1pY28nKSBhcyBhbnk7XG4gICAgICAgICAgdHJ5IHsgZWwuYXBwZW5kQ2hpbGQocmVuZGVySWNvbihuYW1lLCB7IHNpemU6IDIwIH0pKTsgfSBjYXRjaCB7fVxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIG1vdW50SWNvbnModmlldyk7XG5cbiAgICBsZXQgcHJldklkcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGxldCByZWZyZXNoaW5nID0gZmFsc2U7XG5cbiAgICBjb25zdCBsb2cgPSAobWVzc2FnZTogc3RyaW5nKSA9PiB7XG4gICAgICBsb2dzLnRleHRDb250ZW50ID0gbWVzc2FnZTtcbiAgICB9O1xuXG4gICAgY29uc3QgcmVuZGVyVGVtcGxhdGVPcHRpb25zID0gKCkgPT4ge1xuICAgICAgYnV5VHBsLmlubmVySFRNTCA9ICcnO1xuICAgICAgcXVlcnlUcGwuaW5uZXJIVE1MID0gJyc7XG4gICAgICBjb25zdCBwbGFjZWhvbGRlciA9IGh0bWwoJzxvcHRpb24gdmFsdWU9XCJcIj5cdTkwMDlcdTYyRTlcdTZBMjFcdTY3N0Y8L29wdGlvbj4nKSBhcyBIVE1MT3B0aW9uRWxlbWVudDtcbiAgICAgIGJ1eVRwbC5hcHBlbmRDaGlsZChwbGFjZWhvbGRlcik7XG4gICAgICBjb25zdCBxUGxhY2Vob2xkZXIgPSBodG1sKCc8b3B0aW9uIHZhbHVlPVwiXCI+XHU1MTY4XHU5MEU4XHU2QTIxXHU2NzdGPC9vcHRpb24+JykgYXMgSFRNTE9wdGlvbkVsZW1lbnQ7XG4gICAgICBxdWVyeVRwbC5hcHBlbmRDaGlsZChxUGxhY2Vob2xkZXIpO1xuICAgICAgZm9yIChjb25zdCB0cGwgb2YgdGhpcy50ZW1wbGF0ZXMpIHtcbiAgICAgICAgY29uc3Qgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICAgIG9wdGlvbi52YWx1ZSA9IHRwbC5pZDtcbiAgICAgICAgb3B0aW9uLnRleHRDb250ZW50ID0gdHBsLm5hbWUgPyBgJHt0cGwubmFtZX0gKCR7dHBsLmlkfSlgIDogdHBsLmlkO1xuICAgICAgICBidXlUcGwuYXBwZW5kQ2hpbGQob3B0aW9uKTtcbiAgICAgICAgY29uc3QgcU9wdGlvbiA9IG9wdGlvbi5jbG9uZU5vZGUodHJ1ZSkgYXMgSFRNTE9wdGlvbkVsZW1lbnQ7XG4gICAgICAgIHF1ZXJ5VHBsLmFwcGVuZENoaWxkKHFPcHRpb24pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCByZW5kZXJJbnZlbnRvcnkgPSAoKSA9PiB7XG4gICAgICBzZWxsSW5zdC5pbm5lckhUTUwgPSAnJztcbiAgICAgIGludkJveC5pbm5lckhUTUwgPSAnJztcbiAgICAgIGNvbnN0IGRlZmF1bHRPcHRpb24gPSBodG1sKCc8b3B0aW9uIHZhbHVlPVwiXCI+XHU5MDA5XHU2MkU5XHU1M0VGXHU1MUZBXHU1NTJFXHU3Njg0XHU5MDUzXHU1MTc3PC9vcHRpb24+JykgYXMgSFRNTE9wdGlvbkVsZW1lbnQ7XG4gICAgICBzZWxsSW5zdC5hcHBlbmRDaGlsZChkZWZhdWx0T3B0aW9uKTtcbiAgICAgIGNvbnN0IGF2YWlsYWJsZSA9IHRoaXMuaW52ZW50b3J5LmZpbHRlcigoaXRlbSkgPT4gIWl0ZW0uaXNFcXVpcHBlZCAmJiAhaXRlbS5pc0xpc3RlZCk7XG4gICAgICBpZiAoIWF2YWlsYWJsZS5sZW5ndGgpIHtcbiAgICAgICAgaW52Qm94LnRleHRDb250ZW50ID0gJ1x1NjY4Mlx1NjVFMFx1NTNFRlx1NTFGQVx1NTUyRVx1NzY4NFx1OTA1M1x1NTE3N1x1RkYwOFx1OTcwMFx1NTE0OFx1NTcyOFx1NEVEM1x1NUU5M1x1NTM3OFx1NEUwQlx1ODhDNVx1NTkwN1x1RkYwOSc7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBhdmFpbGFibGUpIHtcbiAgICAgICAgY29uc3Qgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICAgIG9wdGlvbi52YWx1ZSA9IGl0ZW0uaWQ7XG4gICAgICAgIG9wdGlvbi50ZXh0Q29udGVudCA9IGAke2l0ZW0uaWR9IFx1MDBCNyAke2l0ZW0udGVtcGxhdGVJZH0gXHUwMEI3IEx2LiR7aXRlbS5sZXZlbH1gO1xuICAgICAgICBzZWxsSW5zdC5hcHBlbmRDaGlsZChvcHRpb24pO1xuXG4gICAgICAgIGNvbnN0IGNoaXAgPSBodG1sKGA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1naG9zdFwiIHN0eWxlPVwiZmxleDp1bnNldDtwYWRkaW5nOjZweCAxMHB4O1wiIGRhdGEtaWQ9XCIke2l0ZW0uaWR9XCI+JHtpdGVtLmlkfSAoJHtpdGVtLnRlbXBsYXRlSWR9KTwvYnV0dG9uPmApIGFzIEhUTUxCdXR0b25FbGVtZW50O1xuICAgICAgICBjaGlwLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICAgICAgc2VsbEluc3QudmFsdWUgPSBpdGVtLmlkO1xuICAgICAgICAgIGxvZyhgXHU1REYyXHU5MDA5XHU2MkU5XHU1MUZBXHU1NTJFXHU5MDUzXHU1MTc3ICR7aXRlbS5pZH1gKTtcbiAgICAgICAgfTtcbiAgICAgICAgaW52Qm94LmFwcGVuZENoaWxkKGNoaXApO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCBsb2FkTWV0YWRhdGEgPSBhc3luYyAoKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBbdHBscywgaXRlbXNdID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICAgIE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IHRlbXBsYXRlczogYW55W10gfT4oJy9pdGVtcy90ZW1wbGF0ZXMnKSxcbiAgICAgICAgICBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyBpdGVtczogYW55W10gfT4oJy9pdGVtcycpLFxuICAgICAgICBdKTtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXMgPSB0cGxzLnRlbXBsYXRlcyB8fCBbXTtcbiAgICAgICAgdGhpcy5pbnZlbnRvcnkgPSBpdGVtcy5pdGVtcyB8fCBbXTtcbiAgICAgICAgcmVuZGVyVGVtcGxhdGVPcHRpb25zKCk7XG4gICAgICAgIHJlbmRlckludmVudG9yeSgpO1xuICAgICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgIGxvZyhlPy5tZXNzYWdlIHx8ICdcdTUyQTBcdThGN0RcdTZBMjFcdTY3N0YvXHU0RUQzXHU1RTkzXHU1OTMxXHU4RDI1Jyk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IHJlZnJlc2ggPSBhc3luYyAob3B0czogeyBxdWlldD86IGJvb2xlYW4gfSA9IHt9KSA9PiB7XG4gICAgICBpZiAocmVmcmVzaGluZykgcmV0dXJuO1xuICAgICAgcmVmcmVzaGluZyA9IHRydWU7XG4gICAgICBpZiAoIW9wdHMucXVpZXQpIHsgcmVmcmVzaEJ0bi5pbm5lckhUTUwgPSAnPHNwYW4gZGF0YS1pY289XCJyZWZyZXNoXCI+PC9zcGFuPlx1NTIzN1x1NjVCMFx1NEUyRFx1MjAyNic7IG1vdW50SWNvbnMocmVmcmVzaEJ0bik7IH1cbiAgICAgIHJlZnJlc2hCdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgdHBsSWQgPSBxdWVyeVRwbC52YWx1ZTtcbiAgICAgICAgY29uc3QgdHlwZSA9IHF1ZXJ5VHlwZS52YWx1ZSBhcyAnYnV5JyB8ICdzZWxsJztcbiAgICAgICAgY29uc3QgbWluZU9ubHkgPSBxdWVyeU1pbmVPbmx5LmNoZWNrZWQ7XG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoKTtcbiAgICAgICAgcGFyYW1zLnNldCgndHlwZScsIHR5cGUpO1xuICAgICAgICBwYXJhbXMuc2V0KCdpdGVtX3RlbXBsYXRlX2lkJywgdHBsSWQgfHwgJycpO1xuICAgICAgICBpZiAoIW9wdHMucXVpZXQpIHtcbiAgICAgICAgICBib29rLmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSBib29rLmFwcGVuZENoaWxkKGh0bWwoJzxkaXYgY2xhc3M9XCJza2VsZXRvblwiPjwvZGl2PicpKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgb3JkZXJzOiBPcmRlcltdIH0+KGAvZXhjaGFuZ2Uvb3JkZXJzPyR7cGFyYW1zLnRvU3RyaW5nKCl9YCk7XG4gICAgICAgIGNvbnN0IG5ld0lkcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgICAgICBib29rLmlubmVySFRNTCA9ICcnO1xuICAgICAgICBjb25zdCBvcmRlcnMgPSBkYXRhLm9yZGVycyB8fCBbXTtcbiAgICAgICAgaWYgKCFvcmRlcnMubGVuZ3RoKSB7XG4gICAgICAgICAgYm9vay5hcHBlbmRDaGlsZChodG1sKCc8ZGl2IHN0eWxlPVwib3BhY2l0eTouODt0ZXh0LWFsaWduOmNlbnRlcjtcIj5cdTY2ODJcdTY1RTBcdThCQTJcdTUzNTU8L2Rpdj4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBvcmRlciBvZiBvcmRlcnMpIHtcbiAgICAgICAgICBpZiAobWluZU9ubHkgJiYgbWUgJiYgb3JkZXIudXNlcklkICE9PSBtZS5pZCkgY29udGludWU7XG4gICAgICAgICAgbmV3SWRzLmFkZChvcmRlci5pZCk7XG4gICAgICAgICAgY29uc3QgaXNNaW5lID0gbWUgJiYgb3JkZXIudXNlcklkID09PSBtZS5pZDtcbiAgICAgICAgICBjb25zdCBrbGFzcyA9IGBsaXN0LWl0ZW0gJHtvcmRlci50eXBlID09PSAnYnV5JyA/ICdsaXN0LWl0ZW0tLWJ1eScgOiAnbGlzdC1pdGVtLS1zZWxsJ31gO1xuICAgICAgICAgIGNvbnN0IHJvdyA9IGh0bWwoYFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIiR7a2xhc3N9XCI+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDoycHg7XCI+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgIDxzdHJvbmc+JHtvcmRlci50eXBlID09PSAnYnV5JyA/ICdcdTRFNzBcdTUxNjUnIDogJ1x1NTM1Nlx1NTFGQSd9PC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgICAke29yZGVyLml0ZW1UZW1wbGF0ZUlkIHx8ICcnfVxuICAgICAgICAgICAgICAgICAgJHtpc01pbmUgPyAnPHNwYW4gY2xhc3M9XCJwaWxsXCI+XHU2MjExXHU3Njg0PC9zcGFuPicgOiAnJ31cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwib3BhY2l0eTouODU7XCI+XG4gICAgICAgICAgICAgICAgICBcdTRFRjdcdTY4M0M6ICR7b3JkZXIucHJpY2V9IFx1MDBCNyBcdTY1NzBcdTkxQ0Y6ICR7b3JkZXIuYW1vdW50fVxuICAgICAgICAgICAgICAgICAgJHtvcmRlci5pdGVtSW5zdGFuY2VJZCA/IGA8c3BhbiBjbGFzcz1cInBpbGxcIj4ke29yZGVyLml0ZW1JbnN0YW5jZUlkfTwvc3Bhbj5gIDogJyd9XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInBpbGxcIj4ke29yZGVyLmlkfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgJHtpc01pbmUgPyBgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tZ2hvc3RcIiBkYXRhLWlkPVwiJHtvcmRlci5pZH1cIj48c3BhbiBkYXRhLWljbz1cInRyYXNoXCI+PC9zcGFuPlx1NjRBNFx1NTM1NTwvYnV0dG9uPmAgOiAnJ31cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICBgKTtcbiAgICAgICAgICBtb3VudEljb25zKHJvdyk7XG4gICAgICAgICAgaWYgKCFwcmV2SWRzLmhhcyhvcmRlci5pZCkpIHJvdy5jbGFzc0xpc3QuYWRkKCdmbGFzaCcpO1xuICAgICAgICAgIHJvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIChldikgPT4ge1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gZXYudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuICAgICAgICAgICAgY29uc3QgaWQgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWlkJyk7XG4gICAgICAgICAgICBpZiAoIWlkKSByZXR1cm47XG4gICAgICAgICAgICBjb25zdCBidG4gPSB0YXJnZXQuY2xvc2VzdCgnYnV0dG9uJykgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XG4gICAgICAgICAgICBpZiAoIWJ0bikgcmV0dXJuO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBidG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICBjb25zdCBvcmlnaW5hbEhUTUwgPSBidG4uaW5uZXJIVE1MO1xuICAgICAgICAgICAgICBidG4uaW5uZXJIVE1MID0gJzxzcGFuIGRhdGEtaWNvPVwidHJhc2hcIj48L3NwYW4+XHU2NEE0XHU1MzU1XHU0RTJEXHUyMDI2JztcbiAgICAgICAgICAgICAgbW91bnRJY29ucyhidG4pO1xuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0KGAvZXhjaGFuZ2Uvb3JkZXJzLyR7aWR9YCwgeyBtZXRob2Q6ICdERUxFVEUnIH0pO1xuICAgICAgICAgICAgICBzaG93VG9hc3QoJ1x1NjRBNFx1NTM1NVx1NjIxMFx1NTI5RicsICdzdWNjZXNzJyk7XG4gICAgICAgICAgICAgIGF3YWl0IHJlZnJlc2goKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgICAgICAgICBzaG93VG9hc3QoZT8ubWVzc2FnZSB8fCAnXHU2NEE0XHU1MzU1XHU1OTMxXHU4RDI1JywgJ2Vycm9yJyk7XG4gICAgICAgICAgICAgIC8vIFx1NTkzMVx1OEQyNVx1NjVGNlx1OTcwMFx1ODk4MVx1NjA2Mlx1NTkwRFx1NjMwOVx1OTRBRVx1RkYwOFx1NTZFMFx1NEUzQVx1NEUwRFx1NEYxQVx1NTIzN1x1NjVCMFx1NTIxN1x1ODg2OFx1RkYwOVxuICAgICAgICAgICAgICBhd2FpdCByZWZyZXNoKCk7XG4gICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICBidG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBib29rLmFwcGVuZENoaWxkKHJvdyk7XG4gICAgICAgIH1cbiAgICAgICAgcHJldklkcyA9IG5ld0lkcztcbiAgICAgICAgaWYgKCFib29rLmNoaWxkRWxlbWVudENvdW50KSB7XG4gICAgICAgICAgYm9vay5hcHBlbmRDaGlsZChodG1sKCc8ZGl2IHN0eWxlPVwib3BhY2l0eTouODt0ZXh0LWFsaWduOmNlbnRlcjtcIj5cdTY2ODJcdTY1RTBcdTdCMjZcdTU0MDhcdTY3NjFcdTRFRjZcdTc2ODRcdThCQTJcdTUzNTU8L2Rpdj4nKSk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgICBsb2coZT8ubWVzc2FnZSB8fCAnXHU1MjM3XHU2NUIwXHU4QkEyXHU1MzU1XHU1OTMxXHU4RDI1Jyk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICByZWZyZXNoaW5nID0gZmFsc2U7XG4gICAgICAgIHJlZnJlc2hCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgcmVmcmVzaEJ0bi5pbm5lckhUTUwgPSAnPHNwYW4gZGF0YS1pY289XCJyZWZyZXNoXCI+PC9zcGFuPlx1NTIzN1x1NjVCMCc7XG4gICAgICAgIG1vdW50SWNvbnMocmVmcmVzaEJ0bik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBsYWNlQnV5Lm9uY2xpY2sgPSBhc3luYyAoKSA9PiB7XG4gICAgICBpZiAocGxhY2VCdXkuZGlzYWJsZWQpIHJldHVybjsgLy8gXHU5NjMyXHU2QjYyXHU5MUNEXHU1OTBEXHU3MEI5XHU1MUZCXG4gICAgICBcbiAgICAgIGNvbnN0IHRwbElkID0gYnV5VHBsLnZhbHVlLnRyaW0oKTtcbiAgICAgIGNvbnN0IHByaWNlID0gTnVtYmVyKGJ1eVByaWNlLnZhbHVlKTtcbiAgICAgIGNvbnN0IGFtb3VudCA9IE51bWJlcihidXlBbW91bnQudmFsdWUpO1xuICAgICAgaWYgKCF0cGxJZCkge1xuICAgICAgICBzaG93VG9hc3QoJ1x1OEJGN1x1OTAwOVx1NjJFOVx1OEQyRFx1NEU3MFx1NzY4NFx1NkEyMVx1Njc3RicsICd3YXJuJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChpc05hTihwcmljZSkgfHwgaXNOYU4oYW1vdW50KSB8fCBwcmljZSA8PSAwIHx8IGFtb3VudCA8PSAwIHx8ICFOdW1iZXIuaXNJbnRlZ2VyKGFtb3VudCkpIHtcbiAgICAgICAgc2hvd1RvYXN0KCdcdThCRjdcdThGOTNcdTUxNjVcdTY3MDlcdTY1NDhcdTc2ODRcdTRFRjdcdTY4M0NcdTRFMEVcdTY1NzBcdTkxQ0ZcdUZGMDhcdTY1NzBcdTkxQ0ZcdTVGQzVcdTk4N0JcdTRFM0FcdTY1NzRcdTY1NzBcdUZGMDknLCAnd2FybicpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAocHJpY2UgPiAxMDAwMDAwIHx8IGFtb3VudCA+IDEwMDAwKSB7XG4gICAgICAgIHNob3dUb2FzdCgnXHU2NTcwXHU1MDNDXHU4RkM3XHU1OTI3XHVGRjBDXHU4QkY3XHU4RjkzXHU1MTY1XHU1NDA4XHU3NDA2XHU3Njg0XHU0RUY3XHU2ODNDXHU1NDhDXHU2NTcwXHU5MUNGJywgJ3dhcm4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcGxhY2VCdXkuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgY29uc3Qgb3JpZ2luYWxCdXlIVE1MID0gcGxhY2VCdXkuaW5uZXJIVE1MO1xuICAgICAgcGxhY2VCdXkuaW5uZXJIVE1MID0gJzxzcGFuIGRhdGEtaWNvPVwiYXJyb3ctcmlnaHRcIj48L3NwYW4+XHU2M0QwXHU0RUE0XHU0RTJEXHUyMDI2JztcbiAgICAgIG1vdW50SWNvbnMocGxhY2VCdXkpO1xuICAgICAgXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyBpZDogc3RyaW5nIH0+KCcvZXhjaGFuZ2Uvb3JkZXJzJywge1xuICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgdHlwZTogJ2J1eScsIGl0ZW1fdGVtcGxhdGVfaWQ6IHRwbElkLCBwcmljZSwgYW1vdW50IH0pLFxuICAgICAgICB9KTtcbiAgICAgICAgc2hvd1RvYXN0KGBcdTRFNzBcdTUzNTVcdTVERjJcdTYzRDBcdTRFQTQgKCMke3Jlcy5pZH0pYCwgJ3N1Y2Nlc3MnKTtcbiAgICAgICAgbG9nKGBcdTRFNzBcdTUzNTVcdTYyMTBcdTUyOUY6ICR7cmVzLmlkfWApO1xuICAgICAgICBhd2FpdCBiYXIudXBkYXRlKCk7XG4gICAgICAgIGF3YWl0IHJlZnJlc2goKTtcbiAgICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgICBzaG93VG9hc3QoZT8ubWVzc2FnZSB8fCAnXHU0RTcwXHU1MzU1XHU2M0QwXHU0RUE0XHU1OTMxXHU4RDI1JywgJ2Vycm9yJyk7XG4gICAgICAgIGxvZyhlPy5tZXNzYWdlIHx8ICdcdTRFNzBcdTUzNTVcdTYzRDBcdTRFQTRcdTU5MzFcdThEMjUnKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHBsYWNlQnV5LmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIHBsYWNlQnV5LmlubmVySFRNTCA9IG9yaWdpbmFsQnV5SFRNTDtcbiAgICAgICAgbW91bnRJY29ucyhwbGFjZUJ1eSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBsYWNlU2VsbC5vbmNsaWNrID0gYXN5bmMgKCkgPT4ge1xuICAgICAgaWYgKHBsYWNlU2VsbC5kaXNhYmxlZCkgcmV0dXJuOyAvLyBcdTk2MzJcdTZCNjJcdTkxQ0RcdTU5MERcdTcwQjlcdTUxRkJcbiAgICAgIFxuICAgICAgY29uc3QgaW5zdElkID0gc2VsbEluc3QudmFsdWUudHJpbSgpO1xuICAgICAgY29uc3QgcHJpY2UgPSBOdW1iZXIoc2VsbFByaWNlLnZhbHVlKTtcbiAgICAgIGlmICghaW5zdElkKSB7XG4gICAgICAgIHNob3dUb2FzdCgnXHU4QkY3XHU5MDA5XHU2MkU5XHU4OTgxXHU1MUZBXHU1NTJFXHU3Njg0XHU5MDUzXHU1MTc3JywgJ3dhcm4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGlzTmFOKHByaWNlKSB8fCBwcmljZSA8PSAwKSB7XG4gICAgICAgIHNob3dUb2FzdCgnXHU4QkY3XHU4RjkzXHU1MTY1XHU2NzA5XHU2NTQ4XHU3Njg0XHU0RUY3XHU2ODNDJywgJ3dhcm4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHByaWNlID4gMTAwMDAwMCkge1xuICAgICAgICBzaG93VG9hc3QoJ1x1NEVGN1x1NjgzQ1x1OEZDN1x1OUFEOFx1RkYwQ1x1OEJGN1x1OEY5M1x1NTE2NVx1NTQwOFx1NzQwNlx1NzY4NFx1NEVGN1x1NjgzQycsICd3YXJuJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHBsYWNlU2VsbC5kaXNhYmxlZCA9IHRydWU7XG4gICAgICBjb25zdCBvcmlnaW5hbFNlbGxIVE1MID0gcGxhY2VTZWxsLmlubmVySFRNTDtcbiAgICAgIHBsYWNlU2VsbC5pbm5lckhUTUwgPSAnPHNwYW4gZGF0YS1pY289XCJhcnJvdy1yaWdodFwiPjwvc3Bhbj5cdTYzRDBcdTRFQTRcdTRFMkRcdTIwMjYnO1xuICAgICAgbW91bnRJY29ucyhwbGFjZVNlbGwpO1xuICAgICAgXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyBpZDogc3RyaW5nIH0+KCcvZXhjaGFuZ2Uvb3JkZXJzJywge1xuICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgdHlwZTogJ3NlbGwnLCBpdGVtX2luc3RhbmNlX2lkOiBpbnN0SWQsIHByaWNlIH0pLFxuICAgICAgICB9KTtcbiAgICAgICAgc2hvd1RvYXN0KGBcdTUzNTZcdTUzNTVcdTVERjJcdTYzRDBcdTRFQTQgKCMke3Jlcy5pZH0pYCwgJ3N1Y2Nlc3MnKTtcbiAgICAgICAgbG9nKGBcdTUzNTZcdTUzNTVcdTYyMTBcdTUyOUY6ICR7cmVzLmlkfWApO1xuICAgICAgICBhd2FpdCBiYXIudXBkYXRlKCk7XG4gICAgICAgIGF3YWl0IGxvYWRNZXRhZGF0YSgpO1xuICAgICAgICBhd2FpdCByZWZyZXNoKCk7XG4gICAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgICAgc2hvd1RvYXN0KGU/Lm1lc3NhZ2UgfHwgJ1x1NTM1Nlx1NTM1NVx1NjNEMFx1NEVBNFx1NTkzMVx1OEQyNScsICdlcnJvcicpO1xuICAgICAgICBsb2coZT8ubWVzc2FnZSB8fCAnXHU1MzU2XHU1MzU1XHU2M0QwXHU0RUE0XHU1OTMxXHU4RDI1Jyk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBwbGFjZVNlbGwuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgcGxhY2VTZWxsLmlubmVySFRNTCA9IG9yaWdpbmFsU2VsbEhUTUw7XG4gICAgICAgIG1vdW50SWNvbnMocGxhY2VTZWxsKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmVmcmVzaEJ0bi5vbmNsaWNrID0gKCkgPT4gcmVmcmVzaCgpO1xuICAgIHF1ZXJ5VHBsLm9uY2hhbmdlID0gKCkgPT4gcmVmcmVzaCgpO1xuICAgIHF1ZXJ5VHlwZS5vbmNoYW5nZSA9ICgpID0+IHJlZnJlc2goKTtcbiAgICBxdWVyeU1pbmVPbmx5Lm9uY2hhbmdlID0gKCkgPT4geyBpZiAobWluZU9ubHlMYWJlbCkgbWluZU9ubHlMYWJlbC5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnLCBxdWVyeU1pbmVPbmx5LmNoZWNrZWQpOyByZWZyZXNoKCk7IH07XG4gICAgaWYgKG1pbmVPbmx5TGFiZWwpIG1pbmVPbmx5TGFiZWwuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJywgcXVlcnlNaW5lT25seS5jaGVja2VkKTtcblxuICAgIGF3YWl0IFByb21pc2UuYWxsKFtiYXIudXBkYXRlKCksIGxvYWRNZXRhZGF0YSgpXSk7XG4gICAgYXdhaXQgcmVmcmVzaCh7IHF1aWV0OiB0cnVlIH0pO1xuICAgIHRoaXMucmVmcmVzaFRpbWVyID0gd2luZG93LnNldEludGVydmFsKCgpID0+IHtcbiAgICAgIHJlZnJlc2goeyBxdWlldDogdHJ1ZSB9KS5jYXRjaCgoKSA9PiB7fSk7XG4gICAgfSwgMTAwMDApO1xuICB9XG5cbiAgcHJpdmF0ZSBjbGVhclRpbWVyKCkge1xuICAgIGlmICh0aGlzLnJlZnJlc2hUaW1lciAhPT0gbnVsbCkge1xuICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5yZWZyZXNoVGltZXIpO1xuICAgICAgdGhpcy5yZWZyZXNoVGltZXIgPSBudWxsO1xuICAgIH1cbiAgfVxufVxuIiwgImltcG9ydCB7IE5ldHdvcmtNYW5hZ2VyIH0gZnJvbSAnLi4vY29yZS9OZXR3b3JrTWFuYWdlcic7XG5pbXBvcnQgeyBodG1sLCBxcyB9IGZyb20gJy4uL3V0aWxzL2RvbSc7XG5pbXBvcnQgeyByZW5kZXJOYXYgfSBmcm9tICcuLi9jb21wb25lbnRzL05hdic7XG5pbXBvcnQgeyBSZWFsdGltZUNsaWVudCB9IGZyb20gJy4uL2NvcmUvUmVhbHRpbWVDbGllbnQnO1xuaW1wb3J0IHsgcmVuZGVyUmVzb3VyY2VCYXIgfSBmcm9tICcuLi9jb21wb25lbnRzL1Jlc291cmNlQmFyJztcbmltcG9ydCB7IHJlbmRlckljb24gfSBmcm9tICcuLi9jb21wb25lbnRzL0ljb24nO1xuXG5leHBvcnQgY2xhc3MgUmFua2luZ1NjZW5lIHtcbiAgbW91bnQocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICByb290LmlubmVySFRNTCA9ICcnO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQocmVuZGVyTmF2KCdyYW5raW5nJykpO1xuICAgIGNvbnN0IGJhciA9IHJlbmRlclJlc291cmNlQmFyKCk7XG4gICAgcm9vdC5hcHBlbmRDaGlsZChiYXIucm9vdCk7XG5cbiAgICBjb25zdCB2aWV3ID0gaHRtbChgXG4gICAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyIGdyaWQtMlwiIHN0eWxlPVwiY29sb3I6I2ZmZjtcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQgZmFkZS1pblwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIiBzdHlsZT1cImp1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2FsaWduLWl0ZW1zOmNlbnRlcjtcIj5cbiAgICAgICAgICAgIDxoMyBzdHlsZT1cIm1hcmdpbjowO2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjhweDtcIj48c3BhbiBkYXRhLWljbz1cInRyb3BoeVwiPjwvc3Bhbj5cdTYzOTJcdTg4NENcdTY5OUM8L2gzPlxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInJlZnJlc2hcIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiPjxzcGFuIGRhdGEtaWNvPVwicmVmcmVzaFwiPjwvc3Bhbj5cdTUyMzdcdTY1QjA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGlkPVwibWVcIiBzdHlsZT1cIm1hcmdpbi10b3A6OHB4O29wYWNpdHk6Ljk1O1wiPjwvZGl2PlxuICAgICAgICAgIDxkaXYgaWQ9XCJsaXN0XCIgc3R5bGU9XCJtYXJnaW4tdG9wOjEycHg7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6NnB4O1wiPjwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIGApO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQodmlldyk7XG5cbiAgICBjb25zdCB0b2tlbiA9IE5ldHdvcmtNYW5hZ2VyLkkuZ2V0VG9rZW4oKTtcbiAgICBpZiAodG9rZW4pIFJlYWx0aW1lQ2xpZW50LkkuY29ubmVjdCh0b2tlbik7XG5cbiAgICBjb25zdCBtZUJveCA9IHFzKHZpZXcsICcjbWUnKTtcbiAgICBjb25zdCBsaXN0ID0gcXModmlldywgJyNsaXN0Jyk7XG4gICAgY29uc3QgcmVmcmVzaEJ0biA9IHFzPEhUTUxCdXR0b25FbGVtZW50Pih2aWV3LCAnI3JlZnJlc2gnKTtcbiAgICBjb25zdCBtb3VudEljb25zID0gKHJvb3RFbDogRWxlbWVudCkgPT4ge1xuICAgICAgcm9vdEVsLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWljb10nKVxuICAgICAgICAuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgICBjb25zdCBuYW1lID0gKGVsIGFzIEhUTUxFbGVtZW50KS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWNvJykgYXMgYW55O1xuICAgICAgICAgIHRyeSB7IGVsLmFwcGVuZENoaWxkKHJlbmRlckljb24obmFtZSwgeyBzaXplOiAyMCB9KSk7IH0gY2F0Y2gge31cbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBtb3VudEljb25zKHZpZXcpO1xuXG4gICAgY29uc3QgbG9hZCA9IGFzeW5jICgpID0+IHtcbiAgICAgIHJlZnJlc2hCdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgcmVmcmVzaEJ0bi5pbm5lckhUTUwgPSAnPHNwYW4gZGF0YS1pY289XCJyZWZyZXNoXCI+PC9zcGFuPlx1NTIzN1x1NjVCMFx1NEUyRFx1MjAyNic7XG4gICAgICBtb3VudEljb25zKHJlZnJlc2hCdG4pO1xuICAgICAgYXdhaXQgYmFyLnVwZGF0ZSgpO1xuICAgICAgbGlzdC5pbm5lckhUTUwgPSAnJztcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSBsaXN0LmFwcGVuZENoaWxkKGh0bWwoJzxkaXYgY2xhc3M9XCJza2VsZXRvblwiPjwvZGl2PicpKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IG1lID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgcmFuazogbnVtYmVyOyBzY29yZTogbnVtYmVyIH0+KCcvcmFua2luZy9tZScpO1xuICAgICAgICBjb25zdCB0b3AgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyBsaXN0OiBhbnlbXSB9PignL3JhbmtpbmcvdG9wP249MjAnKTtcbiAgICAgICAgbWVCb3gudGV4dENvbnRlbnQgPSBgXHU2MjExXHU3Njg0XHU1NDBEXHU2QjIxXHVGRjFBIyR7bWUucmFua30gXHUwMEI3IFx1NjAzQlx1NUY5N1x1NTIwNlx1RkYxQSR7bWUuc2NvcmV9YDtcbiAgICAgICAgbGlzdC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgZm9yIChjb25zdCBlbnRyeSBvZiB0b3AubGlzdCkge1xuICAgICAgICAgIGNvbnN0IG1lZGFsID0gZW50cnkucmFuayA9PT0gMSA/ICdcdUQ4M0VcdURENDcnIDogZW50cnkucmFuayA9PT0gMiA/ICdcdUQ4M0VcdURENDgnIDogZW50cnkucmFuayA9PT0gMyA/ICdcdUQ4M0VcdURENDknIDogJyc7XG4gICAgICAgICAgY29uc3QgY2xzID0gZW50cnkucmFuayA8PSAzID8gJyBsaXN0LWl0ZW0tLWJ1eScgOiAnJztcbiAgICAgICAgICBjb25zdCByb3cgPSBodG1sKGBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsaXN0LWl0ZW0ke2Nsc31cIj5cbiAgICAgICAgICAgICAgPHNwYW4+JHttZWRhbH0gIyR7ZW50cnkucmFua308L3NwYW4+XG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPVwiZmxleDoxO29wYWNpdHk6Ljk7bWFyZ2luLWxlZnQ6MTJweDtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo2cHg7XCI+PHNwYW4gZGF0YS1pY289XCJ1c2VyXCI+PC9zcGFuPiR7ZW50cnkudXNlcklkfTwvc3Bhbj5cbiAgICAgICAgICAgICAgPHN0cm9uZz4ke2VudHJ5LnNjb3JlfTwvc3Ryb25nPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgYCk7XG4gICAgICAgICAgbW91bnRJY29ucyhyb3cpO1xuICAgICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQocm93KTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgIG1lQm94LnRleHRDb250ZW50ID0gZT8ubWVzc2FnZSB8fCAnXHU2MzkyXHU4ODRDXHU2OTlDXHU1MkEwXHU4RjdEXHU1OTMxXHU4RDI1JztcbiAgICAgICAgbGlzdC5pbm5lckhUTUwgPSAnPGRpdiBzdHlsZT1cIm9wYWNpdHk6Ljg7dGV4dC1hbGlnbjpjZW50ZXI7cGFkZGluZzoyMHB4O1wiPlx1NTJBMFx1OEY3RFx1NTkzMVx1OEQyNVx1RkYwQ1x1OEJGN1x1N0EwRFx1NTQwRVx1OTFDRFx1OEJENTwvZGl2Pic7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICByZWZyZXNoQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIHJlZnJlc2hCdG4uaW5uZXJIVE1MID0gJzxzcGFuIGRhdGEtaWNvPVwicmVmcmVzaFwiPjwvc3Bhbj5cdTUyMzdcdTY1QjAnO1xuICAgICAgICBtb3VudEljb25zKHJlZnJlc2hCdG4pO1xuICAgICAgfVxuICAgIH07XG4gICAgcmVmcmVzaEJ0bi5vbmNsaWNrID0gKCkgPT4gbG9hZCgpO1xuICAgIGxvYWQoKTtcbiAgfVxufVxuIiwgImxldCBpbmplY3RlZCA9IGZhbHNlO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGVuc3VyZUdsb2JhbFN0eWxlcygpIHtcclxuICBpZiAoaW5qZWN0ZWQpIHJldHVybjtcclxuICBjb25zdCBjc3MgPSBgOnJvb3R7LS1iZzojMGIxMDIwOy0tYmctMjojMGYxNTMwOy0tZmc6I2ZmZjstLW11dGVkOnJnYmEoMjU1LDI1NSwyNTUsLjc1KTstLWdyYWQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZywjN0IyQ0Y1LCMyQzg5RjUpOy0tcGFuZWwtZ3JhZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLHJnYmEoMTIzLDQ0LDI0NSwuMjUpLHJnYmEoNDQsMTM3LDI0NSwuMjUpKTstLWdsYXNzOmJsdXIoMTBweCk7LS1nbG93OjAgOHB4IDIwcHggcmdiYSgwLDAsMCwuMzUpLDAgMCAxMnB4IHJnYmEoMTIzLDQ0LDI0NSwuNyk7LS1yYWRpdXMtc206MTBweDstLXJhZGl1cy1tZDoxMnB4Oy0tcmFkaXVzLWxnOjE2cHg7LS1lYXNlOmN1YmljLWJlemllciguMjIsLjYxLC4zNiwxKTstLWR1cjouMjhzOy0tYnV5OiMyQzg5RjU7LS1zZWxsOiNFMzY0MTQ7LS1vazojMmVjMjdlOy0td2FybjojZjZjNDQ1Oy0tZGFuZ2VyOiNmZjVjNWM7LS1yYXJpdHktY29tbW9uOiM5YWEwYTY7LS1yYXJpdHktcmFyZTojNGZkNGY1Oy0tcmFyaXR5LWVwaWM6I2IyNmJmZjstLXJhcml0eS1sZWdlbmRhcnk6I2Y2YzQ0NTstLWNvbnRhaW5lci1tYXg6NzIwcHh9XHJcbmh0bWwsYm9keXtiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudCgxMjAwcHggNjAwcHggYXQgNTAlIC0xMCUsIHJnYmEoMTIzLDQ0LDI0NSwuMTIpLCB0cmFuc3BhcmVudCksdmFyKC0tYmcpO2NvbG9yOnZhcigtLWZnKTtmb250LWZhbWlseTpzeXN0ZW0tdWksLWFwcGxlLXN5c3RlbSxcIlNlZ29lIFVJXCIsXCJQaW5nRmFuZyBTQ1wiLFwiTWljcm9zb2Z0IFlhSGVpXCIsQXJpYWwsc2Fucy1zZXJpZn1cclxuaHRtbHtjb2xvci1zY2hlbWU6ZGFya31cclxuLmNvbnRhaW5lcntwYWRkaW5nOjAgMTJweH1cclxuLmNvbnRhaW5lcnttYXgtd2lkdGg6dmFyKC0tY29udGFpbmVyLW1heCk7bWFyZ2luOjEycHggYXV0b31cclxuLmNhcmR7cG9zaXRpb246cmVsYXRpdmU7Ym9yZGVyLXJhZGl1czp2YXIoLS1yYWRpdXMtbGcpO2JhY2tncm91bmQ6dmFyKC0tcGFuZWwtZ3JhZCk7YmFja2Ryb3AtZmlsdGVyOnZhcigtLWdsYXNzKTtib3gtc2hhZG93OnZhcigtLWdsb3cpO3BhZGRpbmc6MTJweDtvdmVyZmxvdzpoaWRkZW59XHJcbi8qIG5lb24gY29ybmVycyArIHNoZWVuICovXHJcbi5jYXJkOjpiZWZvcmV7Y29udGVudDpcIlwiO3Bvc2l0aW9uOmFic29sdXRlO2luc2V0OjA7Ym9yZGVyLXJhZGl1czppbmhlcml0O2JhY2tncm91bmQ6cmFkaWFsLWdyYWRpZW50KDQwJSAyNSUgYXQgMTAwJSAwLCByZ2JhKDEyMyw0NCwyNDUsLjE4KSwgdHJhbnNwYXJlbnQgNjAlKSxyYWRpYWwtZ3JhZGllbnQoMzUlIDI1JSBhdCAwIDEwMCUsIHJnYmEoNDQsMTM3LDI0NSwuMTYpLCB0cmFuc3BhcmVudCA2MCUpO3BvaW50ZXItZXZlbnRzOm5vbmV9XHJcbi5jYXJkOjphZnRlcntjb250ZW50OlwiXCI7cG9zaXRpb246YWJzb2x1dGU7bGVmdDotMzAlO3RvcDotMTIwJTt3aWR0aDo2MCU7aGVpZ2h0OjMwMCU7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTIwZGVnLHRyYW5zcGFyZW50LHJnYmEoMjU1LDI1NSwyNTUsLjE4KSx0cmFuc3BhcmVudCk7dHJhbnNmb3JtOnJvdGF0ZSg4ZGVnKTtvcGFjaXR5Oi4yNTthbmltYXRpb246Y2FyZC1zaGVlbiA5cyBsaW5lYXIgaW5maW5pdGU7cG9pbnRlci1ldmVudHM6bm9uZX1cclxuQGtleWZyYW1lcyBjYXJkLXNoZWVuezAle3RyYW5zZm9ybTp0cmFuc2xhdGVYKDApIHJvdGF0ZSg4ZGVnKX0xMDAle3RyYW5zZm9ybTp0cmFuc2xhdGVYKDE2MCUpIHJvdGF0ZSg4ZGVnKX19XHJcbi5yb3d7ZGlzcGxheTpmbGV4O2dhcDo4cHg7YWxpZ24taXRlbXM6Y2VudGVyfVxyXG4uY2FyZCBpbnB1dCwuY2FyZCBidXR0b257Ym94LXNpemluZzpib3JkZXItYm94O291dGxpbmU6bm9uZX1cclxuLmNhcmQgaW5wdXR7YmFja2dyb3VuZDpyZ2JhKDI1NSwyNTUsMjU1LC4wOCk7Ym9yZGVyOjA7Ym9yZGVyLXJhZGl1czp2YXIoLS1yYWRpdXMtbWQpO2NvbG9yOnZhcigtLWZnKTtwYWRkaW5nOjEwcHg7bWFyZ2luOjhweCAwO2FwcGVhcmFuY2U6bm9uZTstd2Via2l0LWFwcGVhcmFuY2U6bm9uZTtiYWNrZ3JvdW5kLWNsaXA6cGFkZGluZy1ib3g7cG9pbnRlci1ldmVudHM6YXV0bzt0b3VjaC1hY3Rpb246bWFuaXB1bGF0aW9ufVxyXG4uY2FyZCBzZWxlY3QuaW5wdXQsIHNlbGVjdC5pbnB1dHtiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjA4KTtjb2xvcjp2YXIoLS1mZyk7Ym9yZGVyOjA7Ym9yZGVyLXJhZGl1czp2YXIoLS1yYWRpdXMtbWQpO3BhZGRpbmc6MTBweDttYXJnaW46OHB4IDA7YXBwZWFyYW5jZTpub25lOy13ZWJraXQtYXBwZWFyYW5jZTpub25lO2JhY2tncm91bmQtY2xpcDpwYWRkaW5nLWJveH1cclxuLmNhcmQgc2VsZWN0LmlucHV0IG9wdGlvbiwgc2VsZWN0LmlucHV0IG9wdGlvbntiYWNrZ3JvdW5kOiMwYjEwMjA7Y29sb3I6I2ZmZn1cclxuLmNhcmQgc2VsZWN0LmlucHV0OmZvY3VzLCBzZWxlY3QuaW5wdXQ6Zm9jdXN7b3V0bGluZToycHggc29saWQgcmdiYSgxMjMsNDQsMjQ1LC40NSl9XHJcbi5jYXJkIGJ1dHRvbnt3aWR0aDoxMDAlO2JvcmRlci1yYWRpdXM6dmFyKC0tcmFkaXVzLW1kKX1cclxuLmJ0bntwb3NpdGlvbjpyZWxhdGl2ZTtvdmVyZmxvdzpoaWRkZW47cGFkZGluZzoxMHB4IDE0cHg7Ym9yZGVyOjA7Ym9yZGVyLXJhZGl1czp2YXIoLS1yYWRpdXMtbWQpO2NvbG9yOiNmZmY7dHJhbnNpdGlvbjp0cmFuc2Zvcm0gdmFyKC0tZHVyKSB2YXIoLS1lYXNlKSxib3gtc2hhZG93IHZhcigtLWR1cikgdmFyKC0tZWFzZSksZmlsdGVyIHZhcigtLWR1cikgdmFyKC0tZWFzZSl9XHJcbi5idG4gLmljb257bWFyZ2luLXJpZ2h0OjZweH1cclxuLmJ0bjphY3RpdmV7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoMXB4KSBzY2FsZSguOTkpfVxyXG4uYnRuOjphZnRlcntjb250ZW50OlwiXCI7cG9zaXRpb246YWJzb2x1dGU7aW5zZXQ6MDtvcGFjaXR5OjA7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTE1ZGVnLHRyYW5zcGFyZW50LHJnYmEoMjU1LDI1NSwyNTUsLjI1KSx0cmFuc3BhcmVudCA1NSUpO3RyYW5zZm9ybTp0cmFuc2xhdGVYKC02MCUpO3RyYW5zaXRpb246b3BhY2l0eSB2YXIoLS1kdXIpIHZhcigtLWVhc2UpLCB0cmFuc2Zvcm0gdmFyKC0tZHVyKSB2YXIoLS1lYXNlKTtwb2ludGVyLWV2ZW50czpub25lfVxyXG4uYnRuOmhvdmVyOjphZnRlcntvcGFjaXR5Oi45O3RyYW5zZm9ybTp0cmFuc2xhdGVYKDApfVxyXG4uYnRuOmhvdmVye2ZpbHRlcjpzYXR1cmF0ZSgxMTAlKX1cclxuLmJ0bi1wcmltYXJ5e2JhY2tncm91bmQ6dmFyKC0tZ3JhZCk7Ym94LXNoYWRvdzp2YXIoLS1nbG93KX1cclxuLmJ0bi1lbmVyZ3l7cG9zaXRpb246cmVsYXRpdmU7YW5pbWF0aW9uOmJ0bi1wdWxzZSAycyBlYXNlLWluLW91dCBpbmZpbml0ZX1cclxuLmJ0bi1lbmVyZ3k6OmJlZm9yZXtjb250ZW50OlwiXCI7cG9zaXRpb246YWJzb2x1dGU7aW5zZXQ6LTJweDtib3JkZXItcmFkaXVzOmluaGVyaXQ7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLHJnYmEoMTIzLDQ0LDI0NSwuNikscmdiYSg0NCwxMzcsMjQ1LC42KSk7ZmlsdGVyOmJsdXIoOHB4KTt6LWluZGV4Oi0xO29wYWNpdHk6LjY7YW5pbWF0aW9uOmVuZXJneS1yaW5nIDJzIGVhc2UtaW4tb3V0IGluZmluaXRlO3BvaW50ZXItZXZlbnRzOm5vbmV9XHJcbkBrZXlmcmFtZXMgYnRuLXB1bHNlezAlLDEwMCV7dHJhbnNmb3JtOnNjYWxlKDEpfTUwJXt0cmFuc2Zvcm06c2NhbGUoMS4wMil9fVxyXG5Aa2V5ZnJhbWVzIGVuZXJneS1yaW5nezAlLDEwMCV7b3BhY2l0eTouNDtmaWx0ZXI6Ymx1cig4cHgpfTUwJXtvcGFjaXR5Oi44O2ZpbHRlcjpibHVyKDEycHgpfX1cclxuLmJ0bi1idXl7YmFja2dyb3VuZDp2YXIoLS1idXkpfVxyXG4uYnRuLXNlbGx7YmFja2dyb3VuZDp2YXIoLS1zZWxsKX1cclxuLmJ0bi1naG9zdHtiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjA4KX1cclxuLmlucHV0e3dpZHRoOjEwMCU7cGFkZGluZzoxMHB4O2JvcmRlcjowO2JvcmRlci1yYWRpdXM6dmFyKC0tcmFkaXVzLW1kKTtiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjA4KTtjb2xvcjp2YXIoLS1mZyk7cG9pbnRlci1ldmVudHM6YXV0bzt0b3VjaC1hY3Rpb246bWFuaXB1bGF0aW9uO3VzZXItc2VsZWN0OnRleHQ7LXdlYmtpdC11c2VyLXNlbGVjdDp0ZXh0fVxyXG4ucGlsbHtwYWRkaW5nOjJweCA4cHg7Ym9yZGVyLXJhZGl1czo5OTlweDtiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjA4KTtmb250LXNpemU6MTJweDtjdXJzb3I6cG9pbnRlcjt0cmFuc2l0aW9uOmJhY2tncm91bmQgLjNzIGVhc2V9XHJcbi5waWxsLnBpbGwtcnVubmluZ3thbmltYXRpb246cGlsbC1icmVhdGhlIDJzIGVhc2UtaW4tb3V0IGluZmluaXRlfVxyXG5Aa2V5ZnJhbWVzIHBpbGwtYnJlYXRoZXswJSwxMDAle2JhY2tncm91bmQ6cmdiYSg0NiwxOTQsMTI2LC4yNSk7Ym94LXNoYWRvdzowIDAgOHB4IHJnYmEoNDYsMTk0LDEyNiwuMyl9NTAle2JhY2tncm91bmQ6cmdiYSg0NiwxOTQsMTI2LC4zNSk7Ym94LXNoYWRvdzowIDAgMTJweCByZ2JhKDQ2LDE5NCwxMjYsLjUpfX1cclxuLnBpbGwucGlsbC1jb2xsYXBzZWR7YW5pbWF0aW9uOnBpbGwtYWxlcnQgMXMgZWFzZS1pbi1vdXQgaW5maW5pdGV9XHJcbkBrZXlmcmFtZXMgcGlsbC1hbGVydHswJSwxMDAle2JhY2tncm91bmQ6cmdiYSgyNTUsOTIsOTIsLjI1KTtib3gtc2hhZG93OjAgMCA4cHggcmdiYSgyNTUsOTIsOTIsLjMpfTUwJXtiYWNrZ3JvdW5kOnJnYmEoMjU1LDkyLDkyLC40NSk7Ym94LXNoYWRvdzowIDAgMTZweCByZ2JhKDI1NSw5Miw5MiwuNil9fVxyXG4ucGlsbC5hY3RpdmV7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCByZ2JhKDEyMyw0NCwyNDUsLjM1KSwgcmdiYSg0NCwxMzcsMjQ1LC4yOCkpO2JveC1zaGFkb3c6dmFyKC0tZ2xvdyl9XHJcbi5zY2VuZS1oZWFkZXJ7ZGlzcGxheTpmbGV4O2p1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2FsaWduLWl0ZW1zOmZsZXgtZW5kO2dhcDoxMnB4O21hcmdpbi1ib3R0b206OHB4fVxyXG4uc2NlbmUtaGVhZGVyIGgxe21hcmdpbjowO2ZvbnQtc2l6ZToyMHB4fVxyXG4uc2NlbmUtaGVhZGVyIHB7bWFyZ2luOjA7b3BhY2l0eTouODV9XHJcbi5zdGF0c3tkaXNwbGF5OmZsZXg7Z2FwOjEwcHh9XHJcbi5zdGF0e2ZsZXg6MTttaW4td2lkdGg6MDtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxODBkZWcscmdiYSgyNTUsMjU1LDI1NSwuMDYpLHJnYmEoMjU1LDI1NSwyNTUsLjAzKSk7Ym9yZGVyLXJhZGl1czoxMnB4O3BhZGRpbmc6MTBweDtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDoxMHB4fVxyXG4uc3RhdCAuaWNve2ZvbnQtc2l6ZToxOHB4O2ZpbHRlcjpkcm9wLXNoYWRvdygwIDAgOHB4IHJnYmEoMTIzLDQ0LDI0NSwuMzUpKTt0cmFuc2l0aW9uOnRyYW5zZm9ybSAuM3MgZWFzZX1cclxuLnB1bHNlLWljb257YW5pbWF0aW9uOmljb24tcHVsc2UgLjZzIGVhc2V9XHJcbkBrZXlmcmFtZXMgaWNvbi1wdWxzZXswJSwxMDAle3RyYW5zZm9ybTpzY2FsZSgxKX01MCV7dHJhbnNmb3JtOnNjYWxlKDEuMykgcm90YXRlKDVkZWcpfX1cclxuLnN0YXQgLnZhbHtmb250LXdlaWdodDo3MDA7Zm9udC1zaXplOjE2cHh9XHJcbi5zdGF0IC5sYWJlbHtvcGFjaXR5Oi44NTtmb250LXNpemU6MTJweH1cclxuLmV2ZW50LWZlZWR7bWF4LWhlaWdodDoyNDBweDtvdmVyZmxvdzphdXRvO2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjZweH1cclxuLmV2ZW50LWZlZWQgLmV2ZW50e29wYWNpdHk6Ljk7Zm9udC1mYW1pbHk6bW9ub3NwYWNlO2ZvbnQtc2l6ZToxMnB4fVxyXG4ubWFpbi1zY3JlZW57cG9zaXRpb246cmVsYXRpdmU7cGFkZGluZzoxMnB4IDAgMzZweDttaW4taGVpZ2h0OjEwMHZofVxyXG4ubWFpbi1zdGFja3tkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDoxNnB4fVxyXG4ubWluZS1jYXJke21pbi1oZWlnaHQ6Y2FsYygxMDB2aCAtIDE2MHB4KTtwYWRkaW5nOjI0cHggMjBweDtkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDoyMHB4O2JvcmRlci1yYWRpdXM6MjBweH1cclxuQG1lZGlhIChtaW4td2lkdGg6NTgwcHgpey5taW5lLWNhcmR7bWluLWhlaWdodDo2MjBweDtwYWRkaW5nOjI4cHggMjZweH19XHJcbi5taW5lLWhlYWRlcntkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2dhcDoxMnB4fVxyXG4ubWluZS10aXRsZXtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDoxMHB4O2ZvbnQtc2l6ZToxOHB4O2ZvbnQtd2VpZ2h0OjYwMDtsZXR0ZXItc3BhY2luZzouMDRlbTt0ZXh0LXNoYWRvdzowIDJweCAxMnB4IHJnYmEoMTgsMTAsNDgsLjYpfVxyXG4ubWluZS10aXRsZSAuaWNvbntmaWx0ZXI6ZHJvcC1zaGFkb3coMCAwIDEycHggcmdiYSgxMjQsNjAsMjU1LC41NSkpfVxyXG4ubWluZS1jaGlwc3tkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo4cHh9XHJcbi5taW5lLWNoaXBzIC5waWxse2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjZweDtmb250LXNpemU6MTJweDtiYWNrZ3JvdW5kOnJnYmEoMTUsMjQsNTYsLjU1KTtib3gtc2hhZG93Omluc2V0IDAgMCAwIDFweCByZ2JhKDEyMyw0NCwyNDUsLjI1KX1cclxuLm1pbmUtZ3JpZHtkaXNwbGF5OmdyaWQ7Z2FwOjE4cHh9XHJcbkBtZWRpYSAobWluLXdpZHRoOjY0MHB4KXsubWluZS1ncmlke2dyaWQtdGVtcGxhdGUtY29sdW1uczoyMjBweCAxZnI7YWxpZ24taXRlbXM6Y2VudGVyfX1cclxuLm1pbmUtZ2F1Z2V7cG9zaXRpb246cmVsYXRpdmU7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO3BhZGRpbmc6OHB4IDB9XHJcbi5taW5lLWdhdWdlIC5yaW5ne3dpZHRoOjIwMHB4O2hlaWdodDoyMDBweDtib3JkZXItcmFkaXVzOjUwJTtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpjZW50ZXI7YmFja2dyb3VuZDpjb25pYy1ncmFkaWVudCgjN0IyQ0Y1IDBkZWcscmdiYSgyNTUsMjU1LDI1NSwuMDgpIDBkZWcpO2JveC1zaGFkb3c6aW5zZXQgMCAwIDMwcHggcmdiYSgxMjMsNDQsMjQ1LC4yOCksMCAyNHB4IDQ4cHggcmdiYSgxMiw4LDQyLC41NSl9XHJcbi5taW5lLWdhdWdlIC5yaW5nOjpiZWZvcmV7Y29udGVudDpcIlwiO3Bvc2l0aW9uOmFic29sdXRlO2luc2V0OjE4JTtib3JkZXItcmFkaXVzOjUwJTtiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudChjaXJjbGUgYXQgNTAlIDI4JSxyZ2JhKDEyMyw0NCwyNDUsLjQ1KSxyZ2JhKDEyLDIwLDQ2LC45MikgNzAlKTtib3gtc2hhZG93Omluc2V0IDAgMTRweCAyOHB4IHJnYmEoMCwwLDAsLjQ4KTtwb2ludGVyLWV2ZW50czpub25lfVxyXG4ubWluZS1nYXVnZSAucmluZy1jb3Jle3Bvc2l0aW9uOnJlbGF0aXZlO2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo0cHg7Zm9udC13ZWlnaHQ6NjAwfVxyXG4ubWluZS1nYXVnZSAucmluZy1jb3JlIHNwYW57Zm9udC1zaXplOjIycHh9XHJcbi5taW5lLWdhdWdlIC5yaW5nLWNvcmUgc21hbGx7Zm9udC1zaXplOjEycHg7bGV0dGVyLXNwYWNpbmc6LjEyZW07b3BhY2l0eTouNzU7dGV4dC10cmFuc2Zvcm06dXBwZXJjYXNlfVxyXG4ucmluZy1nbG93e3Bvc2l0aW9uOmFic29sdXRlO3dpZHRoOjIwMHB4O2hlaWdodDoyMDBweDtib3JkZXItcmFkaXVzOjUwJTtmaWx0ZXI6Ymx1cigzMnB4KTtiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudChjaXJjbGUscmdiYSgxMjMsNDQsMjQ1LC40OCkscmdiYSg0NCwxMzcsMjQ1LC4xKSk7b3BhY2l0eTouNjthbmltYXRpb246bWluZS1nbG93IDlzIGVhc2UtaW4tb3V0IGluZmluaXRlfVxyXG4ucmluZy1nbG93LWJ7YW5pbWF0aW9uLWRlbGF5Oi00LjVzO2JhY2tncm91bmQ6cmFkaWFsLWdyYWRpZW50KGNpcmNsZSxyZ2JhKDQ0LDEzNywyNDUsLjQ1KSx0cmFuc3BhcmVudCA2NSUpfVxyXG4ucmluZy1wdWxzZXthbmltYXRpb246cmluZy1mbGFzaCAuNnMgZWFzZSFpbXBvcnRhbnR9XHJcbkBrZXlmcmFtZXMgcmluZy1mbGFzaHswJSwxMDAle2JveC1zaGFkb3c6aW5zZXQgMCAwIDMwcHggcmdiYSgxMjMsNDQsMjQ1LC4yOCksMCAyNHB4IDQ4cHggcmdiYSgxMiw4LDQyLC41NSl9NTAle2JveC1zaGFkb3c6aW5zZXQgMCAwIDUwcHggcmdiYSgyNDYsMTk2LDY5LC44KSwwIDI0cHggNjhweCByZ2JhKDI0NiwxOTYsNjksLjUpLDAgMCA4MHB4IHJnYmEoMjQ2LDE5Niw2OSwuNCl9fVxyXG4ucmluZy1mdWxse2FuaW1hdGlvbjpyaW5nLWdsb3ctZnVsbCAycyBlYXNlLWluLW91dCBpbmZpbml0ZSFpbXBvcnRhbnR9XHJcbkBrZXlmcmFtZXMgcmluZy1nbG93LWZ1bGx7MCUsMTAwJXtib3gtc2hhZG93Omluc2V0IDAgMCA0MHB4IHJnYmEoMjQ2LDE5Niw2OSwuNSksMCAyNHB4IDQ4cHggcmdiYSgyNDYsMTk2LDY5LC4zNSksMCAwIDYwcHggcmdiYSgyNDYsMTk2LDY5LC4zKX01MCV7Ym94LXNoYWRvdzppbnNldCAwIDAgNjBweCByZ2JhKDI0NiwxOTYsNjksLjcpLDAgMjRweCA2OHB4IHJnYmEoMjQ2LDE5Niw2OSwuNSksMCAwIDgwcHggcmdiYSgyNDYsMTk2LDY5LC41KX19XHJcbi5taWxlc3RvbmUtcHVsc2V7YW5pbWF0aW9uOm1pbGVzdG9uZS1yaW5nIDFzIGVhc2V9XHJcbkBrZXlmcmFtZXMgbWlsZXN0b25lLXJpbmd7MCV7dHJhbnNmb3JtOnNjYWxlKDEpfTMwJXt0cmFuc2Zvcm06c2NhbGUoMS4wOCl9NjAle3RyYW5zZm9ybTpzY2FsZSguOTgpfTEwMCV7dHJhbnNmb3JtOnNjYWxlKDEpfX1cclxuQGtleWZyYW1lcyBtaW5lLWdsb3d7MCUsMTAwJXt0cmFuc2Zvcm06c2NhbGUoLjkyKTtvcGFjaXR5Oi40NX01MCV7dHJhbnNmb3JtOnNjYWxlKDEuMDUpO29wYWNpdHk6Ljh9fVxyXG4ubWluZS1wcm9ncmVzc3tkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDoxNHB4fVxyXG4ubWluZS1wcm9ncmVzcy1tZXRhe2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpmbGV4LWVuZDtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2Vlbjtmb250LXNpemU6MTRweDtsZXR0ZXItc3BhY2luZzouMDJlbX1cclxuLm1pbmUtcHJvZ3Jlc3MtdHJhY2t7cG9zaXRpb246cmVsYXRpdmU7aGVpZ2h0OjEycHg7Ym9yZGVyLXJhZGl1czo5OTlweDtiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjEpO292ZXJmbG93OmhpZGRlbjtib3gtc2hhZG93Omluc2V0IDAgMCAxNHB4IHJnYmEoMTIzLDQ0LDI0NSwuMjgpfVxyXG4ubWluZS1wcm9ncmVzcy1maWxse2hlaWdodDoxMDAlO3dpZHRoOjA7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoOTBkZWcsIzdCMkNGNSwjMkM4OUY1KTtib3gtc2hhZG93OjAgMCAxNnB4IHJnYmEoMTIzLDQ0LDI0NSwuNjUpO3RyYW5zaXRpb246d2lkdGggLjM1cyB2YXIoLS1lYXNlKTtwb3NpdGlvbjpyZWxhdGl2ZTtvdmVyZmxvdzpoaWRkZW59XHJcbi5taW5lLXByb2dyZXNzLWZpbGw6OmFmdGVye2NvbnRlbnQ6XCJcIjtwb3NpdGlvbjphYnNvbHV0ZTt0b3A6MDtsZWZ0Oi0xMDAlO3dpZHRoOjEwMCU7aGVpZ2h0OjEwMCU7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoOTBkZWcsdHJhbnNwYXJlbnQscmdiYSgyNTUsMjU1LDI1NSwuMyksdHJhbnNwYXJlbnQpO2FuaW1hdGlvbjpwcm9ncmVzcy13YXZlIDJzIGxpbmVhciBpbmZpbml0ZTtwb2ludGVyLWV2ZW50czpub25lfVxyXG5Aa2V5ZnJhbWVzIHByb2dyZXNzLXdhdmV7MCV7bGVmdDotMTAwJX0xMDAle2xlZnQ6MjAwJX19XHJcbi5taW5lLXN0YXR1c3ttaW4taGVpZ2h0OjIycHg7Zm9udC1zaXplOjEzcHg7b3BhY2l0eTouOX1cclxuLm1pbmUtYWN0aW9ucy1ncmlke2Rpc3BsYXk6Z3JpZDtnYXA6MTJweDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6cmVwZWF0KDIsbWlubWF4KDAsMWZyKSl9XHJcbi5taW5lLWFjdGlvbnMtZ3JpZCAuYnRue2hlaWdodDo0OHB4O2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OmNlbnRlcjtmb250LXNpemU6MTVweDtnYXA6OHB4fVxyXG4ubWluZS1hY3Rpb25zLWdyaWQgLnNwYW4tMntncmlkLWNvbHVtbjpzcGFuIDJ9XHJcbkBtZWRpYSAobWluLXdpZHRoOjY4MHB4KXsubWluZS1hY3Rpb25zLWdyaWR7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOnJlcGVhdCgzLG1pbm1heCgwLDFmcikpfS5taW5lLWFjdGlvbnMtZ3JpZCAuc3Bhbi0ye2dyaWQtY29sdW1uOnNwYW4gM319XHJcbi5taW5lLWZlZWR7cG9zaXRpb246cmVsYXRpdmU7Ym9yZGVyLXJhZGl1czoxNnB4O2JhY2tncm91bmQ6cmdiYSgxMiwyMCw0NCwuNTUpO3BhZGRpbmc6MTRweCAxMnB4O2JveC1zaGFkb3c6aW5zZXQgMCAwIDI0cHggcmdiYSgxMjMsNDQsMjQ1LC4xMik7YmFja2Ryb3AtZmlsdGVyOmJsdXIoMTJweCl9XHJcbi5taW5lLWZlZWQ6OmJlZm9yZXtjb250ZW50OlwiXCI7cG9zaXRpb246YWJzb2x1dGU7aW5zZXQ6MDtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcscmdiYSgxMjMsNDQsMjQ1LC4xNikscmdiYSg0NCwxMzcsMjQ1LC4xNCkgNjAlLHRyYW5zcGFyZW50KTtvcGFjaXR5Oi43NTtwb2ludGVyLWV2ZW50czpub25lfVxyXG4ubWluZS1mZWVkIC5ldmVudC1mZWVke21heC1oZWlnaHQ6MTgwcHh9XHJcbi5ldmVudHt0cmFuc2l0aW9uOm9wYWNpdHkgLjNzIGVhc2UsIHRyYW5zZm9ybSAuM3MgZWFzZX1cclxuLmV2ZW50LWNyaXRpY2Fse2NvbG9yOiNmNmM0NDU7Zm9udC13ZWlnaHQ6NjAwfVxyXG4uZXZlbnQtd2FybmluZ3tjb2xvcjojZmY1YzVjfVxyXG4uZXZlbnQtc3VjY2Vzc3tjb2xvcjojMmVjMjdlfVxyXG4uZXZlbnQtbm9ybWFse2NvbG9yOnJnYmEoMjU1LDI1NSwyNTUsLjkpfVxyXG4ubWluZS1ob2xvZ3JhbXtwb3NpdGlvbjpyZWxhdGl2ZTtmbGV4OjE7bWluLWhlaWdodDoxODBweDtib3JkZXItcmFkaXVzOjE4cHg7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoOTAlIDEyMCUgYXQgNTAlIDEwMCUscmdiYSg0NCwxMzcsMjQ1LC4zNSkscmdiYSg4LDEyLDMwLC4zKSA1NSUsdHJhbnNwYXJlbnQpO292ZXJmbG93OmhpZGRlbjttYXJnaW4tdG9wOmF1dG87ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO2lzb2xhdGlvbjppc29sYXRlO3RyYW5zaXRpb246YmFja2dyb3VuZCAuNXMgZWFzZX1cclxuLmhvbG8taWRsZXtiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudCg5MCUgMTIwJSBhdCA1MCUgMTAwJSxyZ2JhKDEyMyw0NCwyNDUsLjI1KSxyZ2JhKDgsMTIsMzAsLjMpIDU1JSx0cmFuc3BhcmVudCl9XHJcbi5ob2xvLW1pbmluZ3tiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudCg5MCUgMTIwJSBhdCA1MCUgMTAwJSxyZ2JhKDQ0LDEzNywyNDUsLjQ1KSxyZ2JhKDgsMTIsMzAsLjMpIDU1JSx0cmFuc3BhcmVudCl9XHJcbi5ob2xvLW1pbmluZyAubWluZS1ob2xvLWdyaWR7YW5pbWF0aW9uLWR1cmF0aW9uOjEycyFpbXBvcnRhbnR9XHJcbi5ob2xvLWNvbGxhcHNlZHtiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudCg5MCUgMTIwJSBhdCA1MCUgMTAwJSxyZ2JhKDI1NSw5Miw5MiwuMzUpLHJnYmEoOCwxMiwzMCwuMykgNTUlLHRyYW5zcGFyZW50KTthbmltYXRpb246aG9sby1nbGl0Y2ggLjVzIGVhc2UgaW5maW5pdGV9XHJcbkBrZXlmcmFtZXMgaG9sby1nbGl0Y2h7MCUsMTAwJXt0cmFuc2Zvcm06dHJhbnNsYXRlWCgwKX0yNSV7dHJhbnNmb3JtOnRyYW5zbGF0ZVgoLTJweCl9NzUle3RyYW5zZm9ybTp0cmFuc2xhdGVYKDJweCl9fVxyXG4uY3JpdGljYWwtZmxhc2h7YW5pbWF0aW9uOmNyaXRpY2FsLWJ1cnN0IC40cyBlYXNlfVxyXG5Aa2V5ZnJhbWVzIGNyaXRpY2FsLWJ1cnN0ezAle2JhY2tncm91bmQ6cmFkaWFsLWdyYWRpZW50KDkwJSAxMjAlIGF0IDUwJSAxMDAlLHJnYmEoNDQsMTM3LDI0NSwuMzUpLHJnYmEoOCwxMiwzMCwuMykgNTUlLHRyYW5zcGFyZW50KX01MCV7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoOTAlIDEyMCUgYXQgNTAlIDEwMCUscmdiYSgyNDYsMTk2LDY5LC42NSkscmdiYSgyNDYsMTk2LDY5LC4yKSA1NSUsdHJhbnNwYXJlbnQpfTEwMCV7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoOTAlIDEyMCUgYXQgNTAlIDEwMCUscmdiYSg0NCwxMzcsMjQ1LC4zNSkscmdiYSg4LDEyLDMwLC4zKSA1NSUsdHJhbnNwYXJlbnQpfX1cclxuLm1pbmUtaG9sby1ncmlke3Bvc2l0aW9uOmFic29sdXRlO3dpZHRoOjE0MCU7aGVpZ2h0OjE0MCU7YmFja2dyb3VuZDpyZXBlYXRpbmctbGluZWFyLWdyYWRpZW50KDBkZWcscmdiYSgyNTUsMjU1LDI1NSwuMDgpIDAscmdiYSgyNTUsMjU1LDI1NSwuMDgpIDFweCx0cmFuc3BhcmVudCAxcHgsdHJhbnNwYXJlbnQgMjhweCkscmVwZWF0aW5nLWxpbmVhci1ncmFkaWVudCg5MGRlZyxyZ2JhKDI1NSwyNTUsMjU1LC4wNSkgMCxyZ2JhKDI1NSwyNTUsMjU1LC4wNSkgMXB4LHRyYW5zcGFyZW50IDFweCx0cmFuc3BhcmVudCAyNnB4KTtvcGFjaXR5Oi4yMjt0cmFuc2Zvcm06dHJhbnNsYXRlM2QoLTEwJSwwLDApIHJvdGF0ZSg4ZGVnKTthbmltYXRpb246aG9sby1wYW4gMTZzIGxpbmVhciBpbmZpbml0ZX1cclxuLm1pbmUtaG9sby1ncmlkLmRpYWdvbmFse29wYWNpdHk6LjE4O3RyYW5zZm9ybTp0cmFuc2xhdGUzZCgxMCUsMCwwKSByb3RhdGUoLTE2ZGVnKTthbmltYXRpb24tZHVyYXRpb246MjJzfVxyXG5Aa2V5ZnJhbWVzIGhvbG8tcGFuezAle3RyYW5zZm9ybTp0cmFuc2xhdGUzZCgtMTIlLDAsMCkgcm90YXRlKDhkZWcpfTEwMCV7dHJhbnNmb3JtOnRyYW5zbGF0ZTNkKDEyJSwwLDApIHJvdGF0ZSg4ZGVnKX19XHJcbi5taW5lLWhvbG8tZ2xvd3twb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDo3MCU7aGVpZ2h0OjcwJTtib3JkZXItcmFkaXVzOjUwJTtiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudChjaXJjbGUgYXQgNTAlIDQwJSxyZ2JhKDEyMyw0NCwyNDUsLjU1KSx0cmFuc3BhcmVudCA3MCUpO2ZpbHRlcjpibHVyKDMycHgpO29wYWNpdHk6LjU1O2FuaW1hdGlvbjpob2xvLWJyZWF0aGUgMTBzIGVhc2UtaW4tb3V0IGluZmluaXRlfVxyXG5Aa2V5ZnJhbWVzIGhvbG8tYnJlYXRoZXswJSwxMDAle3RyYW5zZm9ybTpzY2FsZSguOSk7b3BhY2l0eTouNDV9NTAle3RyYW5zZm9ybTpzY2FsZSgxLjA4KTtvcGFjaXR5Oi44NX19XHJcbi5taW5lLXNoYXJke3Bvc2l0aW9uOmFic29sdXRlO3dpZHRoOjEyMHB4O2hlaWdodDoxMjBweDtiYWNrZ3JvdW5kOmNvbmljLWdyYWRpZW50KGZyb20gMTUwZGVnLHJnYmEoMTIzLDQ0LDI0NSwuOCkscmdiYSg0NCwxMzcsMjQ1LC4zOCkscmdiYSgxMjMsNDQsMjQ1LC4wOCkpO2NsaXAtcGF0aDpwb2x5Z29uKDUwJSAwLDg4JSA0MCUsNzAlIDEwMCUsMzAlIDEwMCUsMTIlIDQwJSk7b3BhY2l0eTouMjY7ZmlsdGVyOmJsdXIoLjRweCk7YW5pbWF0aW9uOnNoYXJkLWZsb2F0IDhzIGVhc2UtaW4tb3V0IGluZmluaXRlfVxyXG4ubWluZS1zaGFyZC5zaGFyZC0xe3RvcDoxOCU7bGVmdDoxNiU7YW5pbWF0aW9uLWRlbGF5Oi0xLjRzfVxyXG4ubWluZS1zaGFyZC5zaGFyZC0ye2JvdHRvbToxNiU7cmlnaHQ6MjIlO2FuaW1hdGlvbi1kZWxheTotMy4yczt0cmFuc2Zvcm06c2NhbGUoLjc0KX1cclxuLm1pbmUtc2hhcmQuc2hhcmQtM3t0b3A6MjYlO3JpZ2h0OjM0JTthbmltYXRpb24tZGVsYXk6LTUuMXM7dHJhbnNmb3JtOnNjYWxlKC41KSByb3RhdGUoMTJkZWcpfVxyXG5Aa2V5ZnJhbWVzIHNoYXJkLWZsb2F0ezAlLDEwMCV7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoLTEwcHgpIHNjYWxlKDEpO29wYWNpdHk6LjJ9NTAle3RyYW5zZm9ybTp0cmFuc2xhdGVZKDEwcHgpIHNjYWxlKDEuMDUpO29wYWNpdHk6LjR9fVxyXG4ubWFpbi1hbWJpZW50e3Bvc2l0aW9uOmFic29sdXRlO2luc2V0OjA7ei1pbmRleDotMTtwb2ludGVyLWV2ZW50czpub25lO292ZXJmbG93OmhpZGRlbn1cclxuLm1haW4tYW1iaWVudCAuYW1iaWVudC5vcmJ7cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6NDIwcHg7aGVpZ2h0OjQyMHB4O2JvcmRlci1yYWRpdXM6NTAlO2ZpbHRlcjpibHVyKDEyMHB4KTtvcGFjaXR5Oi40MjthbmltYXRpb246YW1iaWVudC1kcmlmdCAyNnMgZWFzZS1pbi1vdXQgaW5maW5pdGV9XHJcbi5tYWluLWFtYmllbnQgLm9yYi1he2JhY2tncm91bmQ6cmFkaWFsLWdyYWRpZW50KGNpcmNsZSxyZ2JhKDEyMyw0NCwyNDUsLjYpLHRyYW5zcGFyZW50IDcwJSk7dG9wOi0xNDBweDtyaWdodDotMTIwcHh9XHJcbi5tYWluLWFtYmllbnQgLm9yYi1ie2JhY2tncm91bmQ6cmFkaWFsLWdyYWRpZW50KGNpcmNsZSxyZ2JhKDQ0LDEzNywyNDUsLjU1KSx0cmFuc3BhcmVudCA3MCUpO2JvdHRvbTotMTgwcHg7bGVmdDotMTgwcHg7YW5pbWF0aW9uLWRlbGF5Oi0xM3N9XHJcbi5tYWluLWFtYmllbnQgLmdyaWR7cG9zaXRpb246YWJzb2x1dGU7aW5zZXQ6MDtiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudCg3MCUgNjAlIGF0IDUwJSAxMDAlLHJnYmEoMjU1LDI1NSwyNTUsLjA4KSx0cmFuc3BhcmVudCA3NSUpO29wYWNpdHk6LjM1O21peC1ibGVuZC1tb2RlOnNjcmVlbjthbmltYXRpb246YW1iaWVudC1wdWxzZSAxOHMgZWFzZS1pbi1vdXQgaW5maW5pdGV9XHJcbkBrZXlmcmFtZXMgYW1iaWVudC1kcmlmdHswJSwxMDAle3RyYW5zZm9ybTp0cmFuc2xhdGUzZCgwLDAsMCkgc2NhbGUoMSl9NTAle3RyYW5zZm9ybTp0cmFuc2xhdGUzZCg4JSwgLTQlLDApIHNjYWxlKDEuMDUpfX1cclxuQGtleWZyYW1lcyBhbWJpZW50LXB1bHNlezAlLDEwMCV7b3BhY2l0eTouMjV9NTAle29wYWNpdHk6LjQ1fX1cclxuLmZhZGUtaW57YW5pbWF0aW9uOmZhZGUtaW4gLjNzIHZhcigtLWVhc2UpfVxyXG5Aa2V5ZnJhbWVzIGZhZGUtaW57ZnJvbXtvcGFjaXR5OjA7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoNHB4KX10b3tvcGFjaXR5OjE7dHJhbnNmb3JtOm5vbmV9fVxyXG4uZmxhc2h7YW5pbWF0aW9uOmZsYXNoIC45cyBlYXNlfVxyXG5Aa2V5ZnJhbWVzIGZsYXNoezAle2JveC1zaGFkb3c6MCAwIDAgcmdiYSgyNTUsMjU1LDI1NSwwKX00MCV7Ym94LXNoYWRvdzowIDAgMCA2cHggcmdiYSgyNTUsMjU1LDI1NSwuMTUpfTEwMCV7Ym94LXNoYWRvdzowIDAgMCByZ2JhKDI1NSwyNTUsMjU1LDApfX1cclxuLnNrZWxldG9ue3Bvc2l0aW9uOnJlbGF0aXZlO292ZXJmbG93OmhpZGRlbjtiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjA4KTtib3JkZXItcmFkaXVzOnZhcigtLXJhZGl1cy1tZCk7aGVpZ2h0OjQ0cHh9XHJcbi5za2VsZXRvbjo6YWZ0ZXJ7Y29udGVudDpcIlwiO3Bvc2l0aW9uOmFic29sdXRlO2luc2V0OjA7dHJhbnNmb3JtOnRyYW5zbGF0ZVgoLTEwMCUpO2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDkwZGVnLHRyYW5zcGFyZW50LHJnYmEoMjU1LDI1NSwyNTUsLjEyKSx0cmFuc3BhcmVudCk7YW5pbWF0aW9uOnNoaW1tZXIgMS4ycyBpbmZpbml0ZTtwb2ludGVyLWV2ZW50czpub25lfVxyXG5Aa2V5ZnJhbWVzIHNoaW1tZXJ7MTAwJXt0cmFuc2Zvcm06dHJhbnNsYXRlWCgxMDAlKX19XHJcbi5saXN0LWl0ZW17ZGlzcGxheTpmbGV4O2dhcDo4cHg7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2JhY2tncm91bmQ6cmdiYSgyNTUsMjU1LDI1NSwuMDYpO2JvcmRlci1yYWRpdXM6dmFyKC0tcmFkaXVzLW1kKTtwYWRkaW5nOjEwcHh9XHJcbi5saXN0LWl0ZW0tLWJ1eXtib3JkZXItbGVmdDozcHggc29saWQgdmFyKC0tYnV5KX1cclxuLmxpc3QtaXRlbS0tc2VsbHtib3JkZXItbGVmdDozcHggc29saWQgdmFyKC0tc2VsbCl9XHJcbi5uYXZ7bWF4LXdpZHRoOnZhcigtLWNvbnRhaW5lci1tYXgpO21hcmdpbjoxMnB4IGF1dG8gMDtkaXNwbGF5OmZsZXg7Z2FwOjhweDtmbGV4LXdyYXA6d3JhcDtwb3NpdGlvbjpzdGlja3k7dG9wOjA7ei1pbmRleDo0MDtwYWRkaW5nOjZweDtib3JkZXItcmFkaXVzOjE0cHg7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTgwZGVnLHJnYmEoMjAsMjAsNDAsLjQ1KSxyZ2JhKDIwLDIwLDQwLC4yNSkpO2JhY2tkcm9wLWZpbHRlcjpibHVyKDEwcHgpIHNhdHVyYXRlKDEyNSUpO2JvcmRlcjoxcHggc29saWQgcmdiYSgyNTUsMjU1LDI1NSwuMDYpfVxyXG4ubmF2IGF7ZmxleDoxO2Rpc3BsYXk6ZmxleDtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NnB4O3RleHQtYWxpZ246Y2VudGVyO3BhZGRpbmc6MTBweDtib3JkZXItcmFkaXVzOjk5OXB4O3RleHQtZGVjb3JhdGlvbjpub25lO2NvbG9yOiNmZmY7dHJhbnNpdGlvbjpiYWNrZ3JvdW5kIHZhcigtLWR1cikgdmFyKC0tZWFzZSksIHRyYW5zZm9ybSB2YXIoLS1kdXIpIHZhcigtLWVhc2UpfVxyXG4ubmF2IGEgLmljb3tvcGFjaXR5Oi45NX1cclxuLm5hdiBhLmFjdGl2ZXtiYWNrZ3JvdW5kOnZhcigtLWdyYWQpO2JveC1zaGFkb3c6dmFyKC0tZ2xvdyl9XHJcbi5uYXYgYTpub3QoLmFjdGl2ZSk6aG92ZXJ7YmFja2dyb3VuZDpyZ2JhKDI1NSwyNTUsMjU1LC4wNil9XHJcbi8qIGdlbmVyaWMgaWNvbiAqL1xyXG4uaWNvbntkaXNwbGF5OmlubGluZS1ibG9jaztsaW5lLWhlaWdodDowO3ZlcnRpY2FsLWFsaWduOm1pZGRsZX1cclxuLmljb24gc3Zne2Rpc3BsYXk6YmxvY2s7ZmlsdGVyOmRyb3Atc2hhZG93KDAgMCA4cHggcmdiYSgxMjMsNDQsMjQ1LC4zNSkpfVxyXG4vKiByYXJpdHkgYmFkZ2VzICovXHJcbi5iYWRnZXtkaXNwbGF5OmlubGluZS1mbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NnB4O3BhZGRpbmc6MnB4IDhweDtib3JkZXItcmFkaXVzOjk5OXB4O2ZvbnQtc2l6ZToxMnB4O2xpbmUtaGVpZ2h0OjE7Ym9yZGVyOjFweCBzb2xpZCByZ2JhKDI1NSwyNTUsMjU1LC4xMik7YmFja2dyb3VuZDpyZ2JhKDI1NSwyNTUsMjU1LC4wNil9XHJcbi5iYWRnZSBpe2Rpc3BsYXk6aW5saW5lLWJsb2NrO3dpZHRoOjhweDtoZWlnaHQ6OHB4O2JvcmRlci1yYWRpdXM6OTk5cHh9XHJcbi5iYWRnZS5yYXJpdHktY29tbW9uIGl7YmFja2dyb3VuZDp2YXIoLS1yYXJpdHktY29tbW9uKX1cclxuLmJhZGdlLnJhcml0eS1yYXJlIGl7YmFja2dyb3VuZDp2YXIoLS1yYXJpdHktcmFyZSl9XHJcbi5iYWRnZS5yYXJpdHktZXBpYyBpe2JhY2tncm91bmQ6dmFyKC0tcmFyaXR5LWVwaWMpfVxyXG4uYmFkZ2UucmFyaXR5LWxlZ2VuZGFyeSBpe2JhY2tncm91bmQ6dmFyKC0tcmFyaXR5LWxlZ2VuZGFyeSl9XHJcbi5yYXJpdHktb3V0bGluZS1jb21tb257Ym94LXNoYWRvdzowIDAgMCAxcHggcmdiYSgxNTQsMTYwLDE2NiwuMzUpIGluc2V0LCAwIDAgMjRweCByZ2JhKDE1NCwxNjAsMTY2LC4xNSl9XHJcbi5yYXJpdHktb3V0bGluZS1yYXJle2JveC1zaGFkb3c6MCAwIDAgMXB4IHJnYmEoNzksMjEyLDI0NSwuNDUpIGluc2V0LCAwIDAgMjhweCByZ2JhKDc5LDIxMiwyNDUsLjI1KX1cclxuLnJhcml0eS1vdXRsaW5lLWVwaWN7Ym94LXNoYWRvdzowIDAgMCAxcHggcmdiYSgxNzgsMTA3LDI1NSwuNSkgaW5zZXQsIDAgMCAzMnB4IHJnYmEoMTc4LDEwNywyNTUsLjMpfVxyXG4ucmFyaXR5LW91dGxpbmUtbGVnZW5kYXJ5e2JveC1zaGFkb3c6MCAwIDAgMXB4IHJnYmEoMjQ2LDE5Niw2OSwuNikgaW5zZXQsIDAgMCAzNnB4IHJnYmEoMjQ2LDE5Niw2OSwuMzUpfVxyXG4vKiBhdXJhIGNhcmQgd3JhcHBlciAqL1xyXG4uaXRlbS1jYXJke3Bvc2l0aW9uOnJlbGF0aXZlO2JvcmRlci1yYWRpdXM6dmFyKC0tcmFkaXVzLW1kKTtwYWRkaW5nOjEwcHg7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTQwZGVnLHJnYmEoMjU1LDI1NSwyNTUsLjA2KSxyZ2JhKDI1NSwyNTUsMjU1LC4wNCkpO292ZXJmbG93OmhpZGRlbn1cclxuLml0ZW0tY2FyZDo6YmVmb3Jle2NvbnRlbnQ6XCJcIjtwb3NpdGlvbjphYnNvbHV0ZTtpbnNldDotMXB4O2JvcmRlci1yYWRpdXM6aW5oZXJpdDtwYWRkaW5nOjFweDtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcscmdiYSgyNTUsMjU1LDI1NSwuMTgpLHJnYmEoMjU1LDI1NSwyNTUsLjAyKSk7LXdlYmtpdC1tYXNrOmxpbmVhci1ncmFkaWVudCgjMDAwIDAgMCkgY29udGVudC1ib3gsbGluZWFyLWdyYWRpZW50KCMwMDAgMCAwKTstd2Via2l0LW1hc2stY29tcG9zaXRlOnhvcjttYXNrLWNvbXBvc2l0ZTpleGNsdWRlO3BvaW50ZXItZXZlbnRzOm5vbmV9XHJcbi5pdGVtLWNhcmRbZGF0YS1yYXJpdHk9XCJjb21tb25cIl17Ym9yZGVyOjFweCBzb2xpZCByZ2JhKDE1NCwxNjAsMTY2LC4yNSl9XHJcbi5pdGVtLWNhcmRbZGF0YS1yYXJpdHk9XCJyYXJlXCJde2JvcmRlcjoxcHggc29saWQgcmdiYSg3OSwyMTIsMjQ1LC4zNSl9XHJcbi5pdGVtLWNhcmRbZGF0YS1yYXJpdHk9XCJlcGljXCJde2JvcmRlcjoxcHggc29saWQgcmdiYSgxNzgsMTA3LDI1NSwuNCl9XHJcbi5pdGVtLWNhcmRbZGF0YS1yYXJpdHk9XCJsZWdlbmRhcnlcIl17Ym9yZGVyOjFweCBzb2xpZCByZ2JhKDI0NiwxOTYsNjksLjQ1KX1cclxuLnVwZ3JhZGUtc3VjY2Vzc3thbmltYXRpb246dXBncmFkZS1mbGFzaCAxcyBlYXNlfVxyXG5Aa2V5ZnJhbWVzIHVwZ3JhZGUtZmxhc2h7MCV7dHJhbnNmb3JtOnNjYWxlKDEpO2JveC1zaGFkb3c6MCAwIDAgcmdiYSg0NiwxOTQsMTI2LDApfTI1JXt0cmFuc2Zvcm06c2NhbGUoMS4wMik7Ym94LXNoYWRvdzowIDAgMzBweCByZ2JhKDQ2LDE5NCwxMjYsLjYpLDAgMCA2MHB4IHJnYmEoNDYsMTk0LDEyNiwuMyl9NTAle3RyYW5zZm9ybTpzY2FsZSgxKTtib3gtc2hhZG93OjAgMCA0MHB4IHJnYmEoNDYsMTk0LDEyNiwuOCksMCAwIDgwcHggcmdiYSg0NiwxOTQsMTI2LC40KX03NSV7dHJhbnNmb3JtOnNjYWxlKDEuMDEpO2JveC1zaGFkb3c6MCAwIDMwcHggcmdiYSg0NiwxOTQsMTI2LC42KSwwIDAgNjBweCByZ2JhKDQ2LDE5NCwxMjYsLjMpfTEwMCV7dHJhbnNmb3JtOnNjYWxlKDEpO2JveC1zaGFkb3c6MCAwIDAgcmdiYSg0NiwxOTQsMTI2LDApfX1cclxuLyogdmVydGljYWwgdGltZWxpbmUgKi9cclxuLnRpbWVsaW5le3Bvc2l0aW9uOnJlbGF0aXZlO21hcmdpbi10b3A6OHB4O3BhZGRpbmctbGVmdDoxNnB4fVxyXG4udGltZWxpbmU6OmJlZm9yZXtjb250ZW50OlwiXCI7cG9zaXRpb246YWJzb2x1dGU7bGVmdDo2cHg7dG9wOjA7Ym90dG9tOjA7d2lkdGg6MnB4O2JhY2tncm91bmQ6cmdiYSgyNTUsMjU1LDI1NSwuMSk7cG9pbnRlci1ldmVudHM6bm9uZX1cclxuLnRpbWVsaW5lLWl0ZW17cG9zaXRpb246cmVsYXRpdmU7bWFyZ2luOjhweCAwIDhweCAwfVxyXG4udGltZWxpbmUtaXRlbSAuZG90e3Bvc2l0aW9uOmFic29sdXRlO2xlZnQ6LTEycHg7dG9wOjJweDt3aWR0aDoxMHB4O2hlaWdodDoxMHB4O2JvcmRlci1yYWRpdXM6OTk5cHg7YmFja2dyb3VuZDp2YXIoLS1yYXJpdHktcmFyZSk7Ym94LXNoYWRvdzowIDAgMTBweCByZ2JhKDc5LDIxMiwyNDUsLjUpfVxyXG4udGltZWxpbmUtaXRlbSAudGltZXtvcGFjaXR5Oi43NTtmb250LXNpemU6MTJweH1cclxuLnRpbWVsaW5lLWl0ZW0gLmRlc2N7bWFyZ2luLXRvcDoycHh9XHJcbi8qIGFjdGlvbiBidXR0b25zIGxpbmUgKi9cclxuLmFjdGlvbnN7ZGlzcGxheTpmbGV4O2dhcDo2cHg7ZmxleC13cmFwOndyYXB9XHJcbi8qIHN1YnRsZSBob3ZlciAqL1xyXG4uaG92ZXItbGlmdHt0cmFuc2l0aW9uOnRyYW5zZm9ybSB2YXIoLS1kdXIpIHZhcigtLWVhc2UpLCBib3gtc2hhZG93IHZhcigtLWR1cikgdmFyKC0tZWFzZSl9XHJcbi5ob3Zlci1saWZ0OmhvdmVye3RyYW5zZm9ybTp0cmFuc2xhdGVZKC0xcHgpfVxyXG4vKiByaW5nIG1ldGVyICovXHJcbi5yaW5ney0tc2l6ZToxMTZweDstLXRoaWNrOjEwcHg7cG9zaXRpb246cmVsYXRpdmU7d2lkdGg6dmFyKC0tc2l6ZSk7aGVpZ2h0OnZhcigtLXNpemUpO2JvcmRlci1yYWRpdXM6NTAlO2JhY2tncm91bmQ6Y29uaWMtZ3JhZGllbnQoIzdCMkNGNSAwZGVnLCByZ2JhKDI1NSwyNTUsMjU1LC4wOCkgMGRlZyl9XHJcbi5yaW5nOjphZnRlcntjb250ZW50OlwiXCI7cG9zaXRpb246YWJzb2x1dGU7aW5zZXQ6Y2FsYyh2YXIoLS10aGljaykpO2JvcmRlci1yYWRpdXM6aW5oZXJpdDtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxODBkZWcscmdiYSgyNTUsMjU1LDI1NSwuMDYpLHJnYmEoMjU1LDI1NSwyNTUsLjAyKSk7cG9pbnRlci1ldmVudHM6bm9uZX1cclxuLnJpbmcgLmxhYmVse3Bvc2l0aW9uOmFic29sdXRlO2luc2V0OjA7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO2ZvbnQtd2VpZ2h0OjcwMH1cclxuLyogdG9hc3QgKi9cclxuLnRvYXN0LXdyYXB7cG9zaXRpb246Zml4ZWQ7cmlnaHQ6MTZweDtib3R0b206MTZweDtkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDo4cHg7ei1pbmRleDo5OTk5fVxyXG4udG9hc3R7bWF4LXdpZHRoOjM0MHB4O3BhZGRpbmc6MTBweCAxMnB4O2JvcmRlci1yYWRpdXM6MTJweDtjb2xvcjojZmZmO2JhY2tncm91bmQ6cmdiYSgzMCwzMCw1MCwuOTYpO2JveC1zaGFkb3c6dmFyKC0tZ2xvdyk7cG9zaXRpb246cmVsYXRpdmU7b3ZlcmZsb3c6aGlkZGVufVxyXG4udG9hc3Quc3VjY2Vzc3tiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxODBkZWcscmdiYSg0NiwxOTQsMTI2LC4xNikscmdiYSgzMCwzMCw1MCwuOTYpKX1cclxuLnRvYXN0Lndhcm57YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTgwZGVnLHJnYmEoMjQ2LDE5Niw2OSwuMTgpLHJnYmEoMzAsMzAsNTAsLjk2KSl9XHJcbi50b2FzdC5lcnJvcntiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxODBkZWcscmdiYSgyNTUsOTIsOTIsLjE4KSxyZ2JhKDMwLDMwLDUwLC45NikpfVxyXG4udG9hc3QgLmxpZmV7cG9zaXRpb246YWJzb2x1dGU7bGVmdDowO2JvdHRvbTowO2hlaWdodDoycHg7YmFja2dyb3VuZDojN0IyQ0Y1O2FuaW1hdGlvbjp0b2FzdC1saWZlIHZhcigtLWxpZmUsMy41cykgbGluZWFyIGZvcndhcmRzfVxyXG5Aa2V5ZnJhbWVzIHRvYXN0LWxpZmV7ZnJvbXt3aWR0aDoxMDAlfXRve3dpZHRoOjB9fVxyXG5AbWVkaWEgKHByZWZlcnMtcmVkdWNlZC1tb3Rpb246cmVkdWNlKXsqe2FuaW1hdGlvbi1kdXJhdGlvbjouMDAxbXMhaW1wb3J0YW50O2FuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6MSFpbXBvcnRhbnQ7dHJhbnNpdGlvbi1kdXJhdGlvbjowbXMhaW1wb3J0YW50fX1cclxuXHJcbi8qIHJlc3BvbnNpdmUgd2lkdGggKyBkZXNrdG9wIGdyaWQgbGF5b3V0IGZvciBmdWxsbmVzcyAqL1xyXG5AbWVkaWEgKG1pbi13aWR0aDo5MDBweCl7OnJvb3R7LS1jb250YWluZXItbWF4OjkyMHB4fX1cclxuQG1lZGlhIChtaW4td2lkdGg6MTIwMHB4KXs6cm9vdHstLWNvbnRhaW5lci1tYXg6MTA4MHB4fX1cclxuXHJcbi5jb250YWluZXIuZ3JpZC0ye2Rpc3BsYXk6Z3JpZDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6MWZyO2dhcDoxMnB4fVxyXG5AbWVkaWEgKG1pbi13aWR0aDo5ODBweCl7XHJcbiAgLmNvbnRhaW5lci5ncmlkLTJ7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOjFmciAxZnI7YWxpZ24taXRlbXM6c3RhcnR9XHJcbiAgLmNvbnRhaW5lci5ncmlkLTI+LmNhcmQ6Zmlyc3QtY2hpbGR7Z3JpZC1jb2x1bW46MS8tMX1cclxufVxyXG5cclxuLyogZGVjb3JhdGl2ZSBwYWdlIG92ZXJsYXlzOiBhdXJvcmEsIGdyaWQgbGluZXMsIGJvdHRvbSBnbG93ICovXHJcbmh0bWw6OmJlZm9yZXtjb250ZW50OlwiXCI7cG9zaXRpb246Zml4ZWQ7aW5zZXQ6MDtwb2ludGVyLWV2ZW50czpub25lO3otaW5kZXg6LTI7b3BhY2l0eTouMDM1O2JhY2tncm91bmQtaW1hZ2U6bGluZWFyLWdyYWRpZW50KHJnYmEoMjU1LDI1NSwyNTUsLjA0KSAxcHgsIHRyYW5zcGFyZW50IDFweCksbGluZWFyLWdyYWRpZW50KDkwZGVnLCByZ2JhKDI1NSwyNTUsMjU1LC4wNCkgMXB4LCB0cmFuc3BhcmVudCAxcHgpO2JhY2tncm91bmQtc2l6ZToyNHB4IDI0cHh9XHJcbmJvZHk6OmJlZm9yZXtjb250ZW50OlwiXCI7cG9zaXRpb246Zml4ZWQ7cmlnaHQ6LTEwdnc7dG9wOi0xOHZoO3dpZHRoOjcwdnc7aGVpZ2h0Ojcwdmg7cG9pbnRlci1ldmVudHM6bm9uZTt6LWluZGV4Oi0xO2ZpbHRlcjpibHVyKDUwcHgpO29wYWNpdHk6LjU1O2JhY2tncm91bmQ6cmFkaWFsLWdyYWRpZW50KGNsb3Nlc3Qtc2lkZSBhdCAyNSUgNDAlLCByZ2JhKDEyMyw0NCwyNDUsLjM1KSwgdHJhbnNwYXJlbnQgNjUlKSwgcmFkaWFsLWdyYWRpZW50KGNsb3Nlc3Qtc2lkZSBhdCA3MCUgNjAlLCByZ2JhKDQ0LDEzNywyNDUsLjI1KSwgdHJhbnNwYXJlbnQgNzAlKTttaXgtYmxlbmQtbW9kZTpzY3JlZW47YW5pbWF0aW9uOmF1cm9yYS1hIDE4cyBlYXNlLWluLW91dCBpbmZpbml0ZSBhbHRlcm5hdGV9XHJcbmJvZHk6OmFmdGVye2NvbnRlbnQ6XCJcIjtwb3NpdGlvbjpmaXhlZDtsZWZ0Oi0xMHZ3O2JvdHRvbTotMjJ2aDt3aWR0aDoxMjB2dztoZWlnaHQ6NjB2aDtwb2ludGVyLWV2ZW50czpub25lO3otaW5kZXg6LTE7ZmlsdGVyOmJsdXIoNjBweCk7b3BhY2l0eTouNzU7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoMTIwdncgNjB2aCBhdCA1MCUgMTAwJSwgcmdiYSg0NCwxMzcsMjQ1LC4yMiksIHRyYW5zcGFyZW50IDY1JSksIGNvbmljLWdyYWRpZW50KGZyb20gMjAwZGVnIGF0IDUwJSA3NSUsIHJnYmEoMTIzLDQ0LDI0NSwuMTgpLCByZ2JhKDQ0LDEzNywyNDUsLjEyKSwgdHJhbnNwYXJlbnQgNzAlKTttaXgtYmxlbmQtbW9kZTpzY3JlZW47YW5pbWF0aW9uOmF1cm9yYS1iIDIycyBlYXNlLWluLW91dCBpbmZpbml0ZSBhbHRlcm5hdGV9XHJcbkBrZXlmcmFtZXMgYXVyb3JhLWF7MCV7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoMCl9MTAwJXt0cmFuc2Zvcm06dHJhbnNsYXRlWSgxNHB4KX19XHJcbkBrZXlmcmFtZXMgYXVyb3JhLWJ7MCV7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoMCl9MTAwJXt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtMTJweCl9fVxyXG5gO1xyXG4gIGNvbnN0IHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcclxuICBzdHlsZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtdWknLCAnbWluZXItZ2FtZScpO1xyXG4gIHN0eWxlLnRleHRDb250ZW50ID0gY3NzO1xyXG4gIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xyXG4gIGluamVjdGVkID0gdHJ1ZTtcclxuXHJcbiAgLy8gc29mdCBzdGFyZmllbGQgYmFja2dyb3VuZCAodmVyeSBsaWdodClcclxuICB0cnkge1xyXG4gICAgY29uc3QgZXhpc3RzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtc3RhcnNdJyk7XHJcbiAgICBpZiAoIWV4aXN0cykge1xyXG4gICAgICBjb25zdCBjdnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuICAgICAgY3ZzLnNldEF0dHJpYnV0ZSgnZGF0YS1zdGFycycsICcnKTtcclxuICAgICAgY3ZzLnN0eWxlLmNzc1RleHQgPSAncG9zaXRpb246Zml4ZWQ7aW5zZXQ6MDt6LWluZGV4Oi0yO29wYWNpdHk6LjQwO3BvaW50ZXItZXZlbnRzOm5vbmU7JztcclxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjdnMpO1xyXG4gICAgICBjb25zdCBjdHggPSBjdnMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgY29uc3Qgc3RhcnMgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiA4MCB9LCAoKSA9PiAoeyB4OiBNYXRoLnJhbmRvbSgpLCB5OiBNYXRoLnJhbmRvbSgpLCByOiBNYXRoLnJhbmRvbSgpKjEuMiswLjIsIHM6IE1hdGgucmFuZG9tKCkqMC44KzAuMiB9KSk7XHJcbiAgICAgIHR5cGUgTWV0ZW9yID0geyB4OiBudW1iZXI7IHk6IG51bWJlcjsgdng6IG51bWJlcjsgdnk6IG51bWJlcjsgbGlmZTogbnVtYmVyOyB0dGw6IG51bWJlciB9O1xyXG4gICAgICBjb25zdCBtZXRlb3JzOiBNZXRlb3JbXSA9IFtdO1xyXG4gICAgICBjb25zdCBzcGF3bk1ldGVvciA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCB4ID0gTWF0aC5yYW5kb20oKSpjdnMud2lkdGgqMC42ICsgY3ZzLndpZHRoKjAuMjtcclxuICAgICAgICBjb25zdCB5ID0gLTIwOyAvLyBmcm9tIHRvcFxyXG4gICAgICAgIGNvbnN0IHNwZWVkID0gMyArIE1hdGgucmFuZG9tKCkqMztcclxuICAgICAgICBjb25zdCBhbmdsZSA9IE1hdGguUEkqMC44ICsgTWF0aC5yYW5kb20oKSowLjI7IC8vIGRpYWdvbmFsbHlcclxuICAgICAgICBtZXRlb3JzLnB1c2goeyB4LCB5LCB2eDogTWF0aC5jb3MoYW5nbGUpKnNwZWVkLCB2eTogTWF0aC5zaW4oYW5nbGUpKnNwZWVkLCBsaWZlOiAwLCB0dGw6IDEyMDAgKyBNYXRoLnJhbmRvbSgpKjgwMCB9KTtcclxuICAgICAgfTtcclxuICAgICAgLy8gZ2VudGxlIHBsYW5ldHMvb3Jic1xyXG4gICAgICBjb25zdCBvcmJzID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogMiB9LCAoKSA9PiAoeyB4OiBNYXRoLnJhbmRvbSgpLCB5OiBNYXRoLnJhbmRvbSgpKjAuNSArIDAuMSwgcjogTWF0aC5yYW5kb20oKSo4MCArIDcwLCBodWU6IE1hdGgucmFuZG9tKCkgfSkpO1xyXG4gICAgICBjb25zdCBmaXQgPSAoKSA9PiB7IGN2cy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoOyBjdnMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0OyB9O1xyXG4gICAgICBmaXQoKTtcclxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGZpdCk7XHJcbiAgICAgIGxldCB0ID0gMDtcclxuICAgICAgY29uc3QgbG9vcCA9ICgpID0+IHtcclxuICAgICAgICBpZiAoIWN0eCkgcmV0dXJuO1xyXG4gICAgICAgIHQgKz0gMC4wMTY7XHJcbiAgICAgICAgY3R4LmNsZWFyUmVjdCgwLDAsY3ZzLndpZHRoLGN2cy5oZWlnaHQpO1xyXG4gICAgICAgIC8vIHNvZnQgb3Jic1xyXG4gICAgICAgIGZvciAoY29uc3Qgb2Igb2Ygb3Jicykge1xyXG4gICAgICAgICAgY29uc3QgeCA9IG9iLnggKiBjdnMud2lkdGgsIHkgPSBvYi55ICogY3ZzLmhlaWdodDtcclxuICAgICAgICAgIGNvbnN0IHB1bHNlID0gKE1hdGguc2luKHQqMC42ICsgeCowLjAwMTUpKjAuNSswLjUpKjAuMTI7XHJcbiAgICAgICAgICBjb25zdCByYWQgPSBvYi5yICogKDErcHVsc2UpO1xyXG4gICAgICAgICAgY29uc3QgZ3JhZCA9IGN0eC5jcmVhdGVSYWRpYWxHcmFkaWVudCh4LCB5LCAwLCB4LCB5LCByYWQpO1xyXG4gICAgICAgICAgZ3JhZC5hZGRDb2xvclN0b3AoMCwgJ3JnYmEoMTEwLDgwLDI1NSwwLjEwKScpO1xyXG4gICAgICAgICAgZ3JhZC5hZGRDb2xvclN0b3AoMSwgJ3JnYmEoMCwwLDAsMCknKTtcclxuICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBncmFkO1xyXG4gICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgY3R4LmFyYyh4LCB5LCByYWQsIDAsIE1hdGguUEkqMik7XHJcbiAgICAgICAgICBjdHguZmlsbCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBzdGFycyB0d2lua2xlXHJcbiAgICAgICAgZm9yIChjb25zdCBzdCBvZiBzdGFycykge1xyXG4gICAgICAgICAgY29uc3QgeCA9IHN0LnggKiBjdnMud2lkdGgsIHkgPSBzdC55ICogY3ZzLmhlaWdodDtcclxuICAgICAgICAgIGNvbnN0IHR3ID0gKE1hdGguc2luKHQqMS42ICsgeCowLjAwMiArIHkqMC4wMDMpKjAuNSswLjUpKjAuNSswLjU7XHJcbiAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICBjdHguYXJjKHgsIHksIHN0LnIgKyB0dyowLjYsIDAsIE1hdGguUEkqMik7XHJcbiAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3JnYmEoMTgwLDIwMCwyNTUsMC42KSc7XHJcbiAgICAgICAgICBjdHguZmlsbCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBtZXRlb3JzXHJcbiAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPCAwLjAxNSAmJiBtZXRlb3JzLmxlbmd0aCA8IDIpIHNwYXduTWV0ZW9yKCk7XHJcbiAgICAgICAgZm9yIChsZXQgaT1tZXRlb3JzLmxlbmd0aC0xOyBpPj0wOyBpLS0pIHtcclxuICAgICAgICAgIGNvbnN0IG0gPSBtZXRlb3JzW2ldO1xyXG4gICAgICAgICAgbS54ICs9IG0udng7IG0ueSArPSBtLnZ5OyBtLmxpZmUgKz0gMTY7XHJcbiAgICAgICAgICAvLyB0cmFpbFxyXG4gICAgICAgICAgY29uc3QgdHJhaWwgPSBjdHguY3JlYXRlTGluZWFyR3JhZGllbnQobS54LCBtLnksIG0ueCAtIG0udngqOCwgbS55IC0gbS52eSo4KTtcclxuICAgICAgICAgIHRyYWlsLmFkZENvbG9yU3RvcCgwLCAncmdiYSgyNTUsMjU1LDI1NSwwLjkpJyk7XHJcbiAgICAgICAgICB0cmFpbC5hZGRDb2xvclN0b3AoMSwgJ3JnYmEoMTUwLDE4MCwyNTUsMCknKTtcclxuICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHRyYWlsO1xyXG4gICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IDI7XHJcbiAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICBjdHgubW92ZVRvKG0ueCAtIG0udngqMTAsIG0ueSAtIG0udnkqMTApO1xyXG4gICAgICAgICAgY3R4LmxpbmVUbyhtLngsIG0ueSk7XHJcbiAgICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICAgICAgICBpZiAobS55ID4gY3ZzLmhlaWdodCArIDQwIHx8IG0ueCA8IC00MCB8fCBtLnggPiBjdnMud2lkdGggKyA0MCB8fCBtLmxpZmUgPiBtLnR0bCkge1xyXG4gICAgICAgICAgICBtZXRlb3JzLnNwbGljZShpLDEpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcCk7XHJcbiAgICAgIH07XHJcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wKTtcclxuICAgIH1cclxuICB9IGNhdGNoIHt9XHJcbn1cclxuIiwgImltcG9ydCB7IExvZ2luU2NlbmUgfSBmcm9tICcuL3NjZW5lcy9Mb2dpblNjZW5lJztcbmltcG9ydCB7IE1haW5TY2VuZSB9IGZyb20gJy4vc2NlbmVzL01haW5TY2VuZSc7XG5pbXBvcnQgeyBHYW1lTWFuYWdlciB9IGZyb20gJy4vY29yZS9HYW1lTWFuYWdlcic7XG5pbXBvcnQgeyBXYXJlaG91c2VTY2VuZSB9IGZyb20gJy4vc2NlbmVzL1dhcmVob3VzZVNjZW5lJztcbmltcG9ydCB7IFBsdW5kZXJTY2VuZSB9IGZyb20gJy4vc2NlbmVzL1BsdW5kZXJTY2VuZSc7XG5pbXBvcnQgeyBFeGNoYW5nZVNjZW5lIH0gZnJvbSAnLi9zY2VuZXMvRXhjaGFuZ2VTY2VuZSc7XG5pbXBvcnQgeyBSYW5raW5nU2NlbmUgfSBmcm9tICcuL3NjZW5lcy9SYW5raW5nU2NlbmUnO1xuaW1wb3J0IHsgZW5zdXJlR2xvYmFsU3R5bGVzIH0gZnJvbSAnLi9zdHlsZXMvaW5qZWN0JztcblxuZnVuY3Rpb24gcm91dGVUbyhjb250YWluZXI6IEhUTUxFbGVtZW50KSB7XG4gIGNvbnN0IGggPSBsb2NhdGlvbi5oYXNoIHx8ICcjL2xvZ2luJztcbiAgY29uc3Qgc2NlbmUgPSBoLnNwbGl0KCc/JylbMF07XG4gIHN3aXRjaCAoc2NlbmUpIHtcbiAgICBjYXNlICcjL21haW4nOlxuICAgICAgbmV3IE1haW5TY2VuZSgpLm1vdW50KGNvbnRhaW5lcik7XG4gICAgICBicmVhaztcbiAgICBjYXNlICcjL3dhcmVob3VzZSc6XG4gICAgICBuZXcgV2FyZWhvdXNlU2NlbmUoKS5tb3VudChjb250YWluZXIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnIy9wbHVuZGVyJzpcbiAgICAgIG5ldyBQbHVuZGVyU2NlbmUoKS5tb3VudChjb250YWluZXIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnIy9leGNoYW5nZSc6XG4gICAgICBuZXcgRXhjaGFuZ2VTY2VuZSgpLm1vdW50KGNvbnRhaW5lcik7XG4gICAgICBicmVhaztcbiAgICBjYXNlICcjL3JhbmtpbmcnOlxuICAgICAgbmV3IFJhbmtpbmdTY2VuZSgpLm1vdW50KGNvbnRhaW5lcik7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgbmV3IExvZ2luU2NlbmUoKS5tb3VudChjb250YWluZXIpO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBib290c3RyYXAoY29udGFpbmVyOiBIVE1MRWxlbWVudCkge1xuICAvLyBcdTdBQ0JcdTUzNzNcdTZDRThcdTUxNjVcdTY4MzdcdTVGMEZcdUZGMENcdTkwN0ZcdTUxNERGT1VDXHVGRjA4XHU5NUVBXHU3MEMxXHVGRjA5XG4gIGVuc3VyZUdsb2JhbFN0eWxlcygpO1xuICBcbiAgLy8gXHU1QzFEXHU4QkQ1XHU2MDYyXHU1OTBEXHU0RjFBXHU4QkREXG4gIGNvbnN0IHJlc3RvcmVkID0gYXdhaXQgR2FtZU1hbmFnZXIuSS50cnlSZXN0b3JlU2Vzc2lvbigpO1xuICBcbiAgLy8gXHU1OTgyXHU2NzlDXHU2NzA5XHU2NzA5XHU2NTQ4dG9rZW5cdTRFMTRcdTVGNTNcdTUyNERcdTU3MjhcdTc2N0JcdTVGNTVcdTk4NzVcdUZGMENcdThERjNcdThGNkNcdTUyMzBcdTRFM0JcdTk4NzVcbiAgaWYgKHJlc3RvcmVkICYmIChsb2NhdGlvbi5oYXNoID09PSAnJyB8fCBsb2NhdGlvbi5oYXNoID09PSAnIy9sb2dpbicpKSB7XG4gICAgbG9jYXRpb24uaGFzaCA9ICcjL21haW4nO1xuICB9XG4gIFxuICAvLyBcdTRGN0ZcdTc1MjggcmVxdWVzdEFuaW1hdGlvbkZyYW1lIFx1Nzg2RVx1NEZERFx1NjgzN1x1NUYwRlx1NURGMlx1NUU5NFx1NzUyOFxuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgIHJvdXRlVG8oY29udGFpbmVyKTtcbiAgfSk7XG4gIFxuICB3aW5kb3cub25oYXNoY2hhbmdlID0gKCkgPT4gcm91dGVUbyhjb250YWluZXIpO1xufVxuXG4vLyBcdTRGQkZcdTYzNzdcdTU0MkZcdTUyQThcdUZGMDhcdTdGNTFcdTk4NzVcdTczQUZcdTU4ODNcdUZGMDlcbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAod2luZG93IGFzIGFueSkuTWluZXJBcHAgPSB7IGJvb3RzdHJhcCwgR2FtZU1hbmFnZXIgfTtcbn1cblxuXG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7QUFBTyxNQUFNLGtCQUFOLE1BQU0sZ0JBQWU7QUFBQSxJQU0xQixjQUFjO0FBRmQsMEJBQVEsU0FBdUI7QUFJN0IsV0FBSyxRQUFRLGFBQWEsUUFBUSxZQUFZO0FBQUEsSUFDaEQ7QUFBQSxJQVBBLFdBQVcsSUFBb0I7QUFGakM7QUFFbUMsY0FBTyxVQUFLLGNBQUwsWUFBbUIsS0FBSyxZQUFZLElBQUksZ0JBQWU7QUFBQSxJQUFJO0FBQUEsSUFTbkcsU0FBUyxHQUFrQjtBQUN6QixXQUFLLFFBQVE7QUFDYixVQUFJLEdBQUc7QUFDTCxxQkFBYSxRQUFRLGNBQWMsQ0FBQztBQUFBLE1BQ3RDLE9BQU87QUFDTCxxQkFBYSxXQUFXLFlBQVk7QUFBQSxNQUN0QztBQUFBLElBQ0Y7QUFBQSxJQUVBLFdBQTBCO0FBQ3hCLGFBQU8sS0FBSztBQUFBLElBQ2Q7QUFBQSxJQUVBLGFBQWE7QUFDWCxXQUFLLFNBQVMsSUFBSTtBQUFBLElBQ3BCO0FBQUEsSUFFQSxNQUFNLFFBQVcsTUFBYyxNQUFnQztBQUM3RCxZQUFNLFVBQWUsRUFBRSxnQkFBZ0Isb0JBQW9CLElBQUksNkJBQU0sWUFBVyxDQUFDLEVBQUc7QUFDcEYsVUFBSSxLQUFLLE1BQU8sU0FBUSxlQUFlLElBQUksVUFBVSxLQUFLLEtBQUs7QUFFL0QsVUFBSTtBQUNGLGNBQU0sTUFBTSxNQUFNLE1BQU0sS0FBSyxRQUFRLElBQUksTUFBTSxFQUFFLEdBQUcsTUFBTSxRQUFRLENBQUM7QUFDbkUsY0FBTSxPQUFPLE1BQU0sSUFBSSxLQUFLO0FBRzVCLFlBQUksSUFBSSxXQUFXLEtBQUs7QUFDdEIsZUFBSyxXQUFXO0FBQ2hCLGNBQUksU0FBUyxTQUFTLFdBQVc7QUFDL0IscUJBQVMsT0FBTztBQUFBLFVBQ2xCO0FBQ0EsZ0JBQU0sSUFBSSxNQUFNLG9FQUFhO0FBQUEsUUFDL0I7QUFFQSxZQUFJLENBQUMsSUFBSSxNQUFNLEtBQUssUUFBUSxLQUFLO0FBQy9CLGdCQUFNLElBQUksTUFBTSxLQUFLLFdBQVcsZUFBZTtBQUFBLFFBQ2pEO0FBRUEsZUFBTyxLQUFLO0FBQUEsTUFDZCxTQUFTLE9BQU87QUFFZCxZQUFJLGlCQUFpQixhQUFhLE1BQU0sUUFBUSxTQUFTLE9BQU8sR0FBRztBQUNqRSxnQkFBTSxJQUFJLE1BQU0sd0dBQW1CO0FBQUEsUUFDckM7QUFDQSxjQUFNO0FBQUEsTUFDUjtBQUFBLElBQ0Y7QUFBQSxJQUVBLFVBQWtCO0FBQ2hCLGFBQVEsT0FBZSxnQkFBZ0I7QUFBQSxJQUN6QztBQUFBLEVBQ0Y7QUE3REUsZ0JBRFcsaUJBQ0k7QUFEVixNQUFNLGlCQUFOOzs7QUNJQSxNQUFNLGVBQU4sTUFBTSxhQUFZO0FBQUEsSUFBbEI7QUFJTCwwQkFBUSxXQUEwQjtBQUFBO0FBQUEsSUFGbEMsV0FBVyxJQUFpQjtBQU45QjtBQU1nQyxjQUFPLFVBQUssY0FBTCxZQUFtQixLQUFLLFlBQVksSUFBSSxhQUFZO0FBQUEsSUFBSTtBQUFBLElBRzdGLGFBQTZCO0FBQUUsYUFBTyxLQUFLO0FBQUEsSUFBUztBQUFBLElBRXBELE1BQU0sZ0JBQWdCLFVBQWtCLFVBQWlDO0FBQ3ZFLFlBQU0sS0FBSyxlQUFlO0FBQzFCLFVBQUk7QUFDRixjQUFNLElBQUksTUFBTSxHQUFHLFFBQTZDLGVBQWUsRUFBRSxRQUFRLFFBQVEsTUFBTSxLQUFLLFVBQVUsRUFBRSxVQUFVLFNBQVMsQ0FBQyxFQUFFLENBQUM7QUFDL0ksV0FBRyxTQUFTLEVBQUUsWUFBWTtBQUFBLE1BQzVCLFNBQVE7QUFDTixjQUFNLElBQUksTUFBTSxlQUFlLEVBQUUsUUFBNkMsa0JBQWtCLEVBQUUsUUFBUSxRQUFRLE1BQU0sS0FBSyxVQUFVLEVBQUUsVUFBVSxTQUFTLENBQUMsRUFBRSxDQUFDO0FBQ2hLLHVCQUFlLEVBQUUsU0FBUyxFQUFFLFlBQVk7QUFBQSxNQUMxQztBQUNBLFdBQUssVUFBVSxNQUFNLEdBQUcsUUFBaUIsZUFBZTtBQUFBLElBQzFEO0FBQUEsSUFFQSxNQUFNLG9CQUFzQztBQUMxQyxZQUFNLEtBQUssZUFBZTtBQUMxQixZQUFNLFFBQVEsR0FBRyxTQUFTO0FBQzFCLFVBQUksQ0FBQyxNQUFPLFFBQU87QUFFbkIsVUFBSTtBQUNGLGFBQUssVUFBVSxNQUFNLEdBQUcsUUFBaUIsZUFBZTtBQUN4RCxlQUFPO0FBQUEsTUFDVCxTQUFRO0FBRU4sV0FBRyxXQUFXO0FBQ2QsZUFBTztBQUFBLE1BQ1Q7QUFBQSxJQUNGO0FBQUEsSUFFQSxTQUFTO0FBQ1AscUJBQWUsRUFBRSxXQUFXO0FBQzVCLFdBQUssVUFBVTtBQUNmLGVBQVMsT0FBTztBQUFBLElBQ2xCO0FBQUEsRUFDRjtBQXRDRSxnQkFEVyxjQUNJO0FBRFYsTUFBTSxjQUFOOzs7QUNKQSxXQUFTLEtBQUssVUFBK0I7QUFDbEQsVUFBTSxNQUFNLFNBQVMsY0FBYyxLQUFLO0FBQ3hDLFFBQUksWUFBWSxTQUFTLEtBQUs7QUFDOUIsV0FBTyxJQUFJO0FBQUEsRUFDYjtBQUVPLFdBQVMsR0FBb0MsTUFBa0IsS0FBZ0I7QUFDcEYsVUFBTSxLQUFLLEtBQUssY0FBYyxHQUFHO0FBQ2pDLFFBQUksQ0FBQyxHQUFJLE9BQU0sSUFBSSxNQUFNLG9CQUFvQixHQUFHLEVBQUU7QUFDbEQsV0FBTztBQUFBLEVBQ1Q7OztBQ3lCQSxXQUFTLEtBQUssSUFBWTtBQUN4QixXQUFPO0FBQUEsMEJBQ2lCLEVBQUU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBSzVCO0FBRUEsV0FBUyxRQUFRLE1BQWMsT0FBTyxJQUFJLE1BQU0sSUFBaUI7QUFDL0QsVUFBTSxNQUFNLFFBQVEsS0FBSyxPQUFPLEVBQUUsU0FBUyxFQUFFLEVBQUUsTUFBTSxHQUFHLENBQUM7QUFDekQsVUFBTSxLQUFLLEtBQUsscUJBQXFCLEdBQUcsd0JBQ3RDLGVBQWUsSUFBSSxhQUFhLElBQUksd0VBQXdFLEtBQUssR0FBRyxDQUFDLEdBQUcsS0FBSyxXQUFXLFlBQVksUUFBUSxHQUFHLEdBQUcsQ0FBQyxRQUNySyxTQUFTO0FBQ1QsV0FBTztBQUFBLEVBQ1Q7QUFFTyxXQUFTLFdBQVcsTUFBZ0IsT0FBOEMsQ0FBQyxHQUFHO0FBcEQ3RjtBQXFERSxVQUFNLFFBQU8sVUFBSyxTQUFMLFlBQWE7QUFDMUIsVUFBTSxPQUFNLFVBQUssY0FBTCxZQUFrQjtBQUM5QixVQUFNLFNBQVM7QUFDZixVQUFNLE9BQU87QUFFYixZQUFRLE1BQU07QUFBQSxNQUNaLEtBQUs7QUFDSCxlQUFPLFFBQVEsZ0NBQWdDLE1BQU0sa0NBQWtDLE1BQU0sOEJBQThCLE1BQU0sTUFBTSxNQUFNLEdBQUc7QUFBQSxNQUNsSixLQUFLO0FBQ0gsZUFBTyxRQUFRLDREQUE0RCxNQUFNLGdDQUFnQyxNQUFNLE1BQU0sTUFBTSxHQUFHO0FBQUEsTUFDeEksS0FBSztBQUNILGVBQU8sUUFBUSxtREFBbUQsTUFBTSxNQUFNLE1BQU0sR0FBRztBQUFBLE1BQ3pGLEtBQUs7QUFDSCxlQUFPLFFBQVEsc0NBQXNDLE1BQU0sTUFBTSxNQUFNLEdBQUc7QUFBQSxNQUM1RSxLQUFLO0FBQ0gsZUFBTyxRQUFRLHNDQUFzQyxNQUFNLGdEQUFnRCxJQUFJLE1BQU8sTUFBTSxHQUFHO0FBQUEsTUFDakksS0FBSztBQUNILGVBQU8sUUFBUSw0Q0FBNEMsTUFBTSx5Q0FBeUMsTUFBTSxNQUFNLE1BQU0sR0FBRztBQUFBLE1BQ2pJLEtBQUs7QUFDSCxlQUFPLFFBQVEsbUNBQW1DLE1BQU0sd0NBQXdDLE1BQU0sTUFBTSxNQUFNLEdBQUc7QUFBQSxNQUN2SCxLQUFLO0FBQ0gsZUFBTyxRQUFRLDJEQUEyRCxNQUFNLDBCQUEwQixNQUFNLE1BQU0sTUFBTSxHQUFHO0FBQUEsTUFDakksS0FBSztBQUNILGVBQU8sUUFBUSxxQ0FBcUMsTUFBTSwyQkFBMkIsTUFBTSxNQUFNLE1BQU0sR0FBRztBQUFBLE1BQzVHLEtBQUs7QUFDSCxlQUFPLFFBQVEsZ0NBQWdDLE1BQU0sTUFBTSxNQUFNLEdBQUc7QUFBQSxNQUN0RSxLQUFLO0FBQ0gsZUFBTyxRQUFRLG1EQUFtRCxNQUFNLE1BQU0sTUFBTSxHQUFHO0FBQUEsTUFDekYsS0FBSztBQUNILGVBQU8sUUFBUSxzQkFBc0IsTUFBTSw2QkFBNkIsTUFBTSx3QkFBd0IsTUFBTSxNQUFNLE1BQU0sR0FBRztBQUFBLE1BQzdILEtBQUs7QUFDSCxlQUFPLFFBQVEsMkVBQTJFLE1BQU0sTUFBTSxNQUFNLEdBQUc7QUFBQSxNQUNqSCxLQUFLO0FBQ0gsZUFBTyxRQUFRLDhEQUE4RCxNQUFNLE1BQU0sTUFBTSxHQUFHO0FBQUEsTUFDcEcsS0FBSztBQUNILGVBQU8sUUFBUSxxQ0FBcUMsTUFBTSwwQ0FBMEMsTUFBTSxNQUFNLE1BQU0sR0FBRztBQUFBLE1BQzNILEtBQUs7QUFDSCxlQUFPLFFBQVEsNkNBQTZDLE1BQU0sa0NBQWtDLE1BQU0sTUFBTSxNQUFNLEdBQUc7QUFBQSxNQUMzSCxLQUFLO0FBQ0gsZUFBTyxRQUFRLG9EQUFvRCxNQUFNLHFDQUFxQyxNQUFNLE1BQU0sTUFBTSxHQUFHO0FBQUEsTUFDckksS0FBSztBQUNILGVBQU8sUUFBUSwwREFBMEQsTUFBTSxtQ0FBbUMsTUFBTSxNQUFNLE1BQU0sR0FBRztBQUFBLE1BQ3pJLEtBQUs7QUFDSCxlQUFPLFFBQVEsMERBQTBELE1BQU0sbUNBQW1DLE1BQU0sMEJBQTBCLE1BQU0sTUFBTSxNQUFNLEdBQUc7QUFBQSxNQUN6SyxLQUFLO0FBQ0gsZUFBTyxRQUFRLGlEQUFpRCxNQUFNLE1BQU0sTUFBTSxHQUFHO0FBQUEsTUFDdkYsS0FBSztBQUNILGVBQU8sUUFBUSxzREFBc0QsTUFBTSw2REFBNkQsTUFBTSxNQUFNLE1BQU0sR0FBRztBQUFBLE1BQy9KLEtBQUs7QUFDSCxlQUFPLFFBQVEsbUNBQW1DLE1BQU0sMkJBQTJCLE1BQU0sTUFBTSxNQUFNLEdBQUc7QUFBQSxNQUMxRyxLQUFLO0FBQ0gsZUFBTyxRQUFRLDRDQUE0QyxNQUFNLE1BQU0sTUFBTSxHQUFHO0FBQUEsTUFDbEYsS0FBSztBQUNILGVBQU8sUUFBUSwrQ0FBK0MsTUFBTSxNQUFNLE1BQU0sR0FBRztBQUFBLE1BQ3JGLEtBQUs7QUFDSCxlQUFPLFFBQVEsa0NBQWtDLE1BQU0sTUFBTSxNQUFNLEdBQUc7QUFBQSxNQUN4RSxLQUFLO0FBQ0gsZUFBTyxRQUFRLG1DQUFtQyxNQUFNLE1BQU0sTUFBTSxHQUFHO0FBQUEsTUFDekUsS0FBSztBQUNILGVBQU8sUUFBUSxtQ0FBbUMsTUFBTSxxQ0FBcUMsTUFBTSw4Q0FBOEMsTUFBTSxNQUFNLE1BQU0sR0FBRztBQUFBLE1BQ3hLLEtBQUs7QUFDSCxlQUFPLFFBQVEsb0NBQW9DLE1BQU0sZ0NBQWdDLE1BQU0sd0JBQXdCLE1BQU0sTUFBTSxNQUFNLEdBQUc7QUFBQSxNQUM5SSxLQUFLO0FBQ0gsZUFBTyxRQUFRLG1DQUFtQyxNQUFNLHdCQUF3QixNQUFNLHlCQUF5QixNQUFNLE1BQU0sTUFBTSxHQUFHO0FBQUEsTUFDdEksS0FBSztBQUNILGVBQU8sUUFBUSxpRkFBaUYsTUFBTSxxQ0FBcUMsTUFBTSxNQUFNLE1BQU0sR0FBRztBQUFBLE1BQ2xLLEtBQUs7QUFDSCxlQUFPLFFBQVEsa0NBQWtDLE1BQU0sTUFBTSxNQUFNLEdBQUc7QUFBQSxNQUN4RTtBQUNFLGVBQU8sUUFBUSxpQ0FBaUMsTUFBTSxNQUFNLE1BQU0sR0FBRztBQUFBLElBQ3pFO0FBQUEsRUFDRjs7O0FDMUhBLE1BQUksT0FBMkI7QUFFL0IsV0FBUyxZQUF5QjtBQUNoQyxRQUFJLEtBQU0sUUFBTztBQUNqQixVQUFNLE1BQU0sU0FBUyxjQUFjLEtBQUs7QUFDeEMsUUFBSSxZQUFZO0FBQ2hCLGFBQVMsS0FBSyxZQUFZLEdBQUc7QUFDN0IsV0FBTztBQUNQLFdBQU87QUFBQSxFQUNUO0FBS08sV0FBUyxVQUFVLE1BQWMsTUFBaUM7QUFDdkUsVUFBTSxNQUFNLFVBQVU7QUFDdEIsVUFBTSxPQUFPLFNBQVMsY0FBYyxLQUFLO0FBQ3pDLFFBQUk7QUFDSixRQUFJLFdBQVc7QUFDZixRQUFJLE9BQU8sU0FBUyxTQUFVLFFBQU87QUFBQSxhQUM1QixNQUFNO0FBQUUsYUFBTyxLQUFLO0FBQU0sVUFBSSxLQUFLLFNBQVUsWUFBVyxLQUFLO0FBQUEsSUFBVTtBQUNoRixTQUFLLFlBQVksV0FBVyxPQUFPLE1BQU0sT0FBTztBQUVoRCxRQUFJO0FBQ0YsWUFBTSxPQUFPLFNBQVMsY0FBYyxLQUFLO0FBQ3pDLFdBQUssTUFBTSxVQUFVO0FBQ3JCLFdBQUssTUFBTSxNQUFNO0FBQ2pCLFdBQUssTUFBTSxhQUFhO0FBQ3hCLFlBQU0sVUFBVSxTQUFTLFlBQVksU0FBUyxTQUFTLFNBQVMsVUFBVSxTQUFTLFVBQVUsVUFBVTtBQUN2RyxZQUFNLFVBQVUsU0FBUyxjQUFjLE1BQU07QUFDN0MsY0FBUSxZQUFZLFdBQVcsU0FBUyxFQUFFLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDckQsWUFBTSxNQUFNLFNBQVMsY0FBYyxLQUFLO0FBQ3hDLFVBQUksY0FBYztBQUNsQixXQUFLLFlBQVksT0FBTztBQUN4QixXQUFLLFlBQVksR0FBRztBQUNwQixXQUFLLFlBQVksSUFBSTtBQUFBLElBQ3ZCLFNBQVE7QUFDTixXQUFLLGNBQWM7QUFBQSxJQUNyQjtBQUNBLFVBQU0sT0FBTyxTQUFTLGNBQWMsR0FBRztBQUN2QyxTQUFLLFlBQVk7QUFDakIsU0FBSyxNQUFNLFlBQVksVUFBVSxXQUFXLElBQUk7QUFDaEQsU0FBSyxZQUFZLElBQUk7QUFDckIsUUFBSSxRQUFRLElBQUk7QUFFaEIsVUFBTSxPQUFPLE1BQU07QUFBRSxXQUFLLE1BQU0sVUFBVTtBQUFLLFdBQUssTUFBTSxhQUFhO0FBQWdCLGlCQUFXLE1BQU0sS0FBSyxPQUFPLEdBQUcsR0FBRztBQUFBLElBQUc7QUFDN0gsVUFBTSxRQUFRLE9BQU8sV0FBVyxNQUFNLFFBQVE7QUFDOUMsU0FBSyxpQkFBaUIsU0FBUyxNQUFNO0FBQUUsbUJBQWEsS0FBSztBQUFHLFdBQUs7QUFBQSxJQUFHLENBQUM7QUFBQSxFQUN2RTs7O0FDN0NPLE1BQU0sYUFBTixNQUFpQjtBQUFBLElBQ3RCLE1BQU0sTUFBbUI7QUFDdkIsWUFBTSxPQUFPLEtBQUs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsS0FrQmpCO0FBQ0QsV0FBSyxZQUFZO0FBQ2pCLFdBQUssWUFBWSxJQUFJO0FBR3JCLFVBQUk7QUFDRixhQUFLLGlCQUFpQixZQUFZLEVBQUUsUUFBUSxDQUFDLE9BQU87QUFDbEQsZ0JBQU0sT0FBUSxHQUFtQixhQUFhLFVBQVU7QUFDeEQsY0FBSTtBQUNGLGVBQUcsWUFBWSxXQUFXLE1BQU0sRUFBRSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQUEsVUFDL0MsU0FBUTtBQUFBLFVBQUM7QUFBQSxRQUNYLENBQUM7QUFBQSxNQUNILFNBQVE7QUFBQSxNQUFDO0FBRVQsWUFBTSxNQUFNLEdBQXFCLE1BQU0sSUFBSTtBQUMzQyxZQUFNLE1BQU0sR0FBcUIsTUFBTSxJQUFJO0FBQzNDLFlBQU0sS0FBSyxHQUFzQixNQUFNLEtBQUs7QUFDNUMsWUFBTSxTQUFTLEdBQXNCLE1BQU0sU0FBUztBQUdwRCw0QkFBc0IsTUFBTTtBQUMxQiw4QkFBc0IsTUFBTTtBQUMxQixjQUFJLE1BQU07QUFBQSxRQUNaLENBQUM7QUFBQSxNQUNILENBQUM7QUFFRCxZQUFNLFNBQVMsWUFBWTtBQUN6QixZQUFJLEdBQUcsU0FBVTtBQUVqQixjQUFNLFlBQVksSUFBSSxTQUFTLElBQUksS0FBSztBQUN4QyxjQUFNLFlBQVksSUFBSSxTQUFTLElBQUksS0FBSztBQUN4QyxZQUFJLENBQUMsWUFBWSxDQUFDLFVBQVU7QUFDMUIsb0JBQVUsMERBQWEsTUFBTTtBQUM3QjtBQUFBLFFBQ0Y7QUFDQSxZQUFJLFNBQVMsU0FBUyxLQUFLLFNBQVMsU0FBUyxJQUFJO0FBQy9DLG9CQUFVLGtGQUFzQixNQUFNO0FBQ3RDO0FBQUEsUUFDRjtBQUNBLFlBQUksU0FBUyxTQUFTLEdBQUc7QUFDdkIsb0JBQVUsNkRBQWdCLE1BQU07QUFDaEM7QUFBQSxRQUNGO0FBQ0EsV0FBRyxXQUFXO0FBQ2QsY0FBTUEsZ0JBQWUsR0FBRztBQUN4QixXQUFHLFlBQVk7QUFDZixZQUFJO0FBQ0YsZUFBSyxpQkFBaUIsWUFBWSxFQUFFLFFBQVEsQ0FBQyxPQUFPO0FBQ2xELGtCQUFNLE9BQVEsR0FBbUIsYUFBYSxVQUFVO0FBQ3hELGdCQUFJO0FBQUUsaUJBQUcsWUFBWSxXQUFXLE1BQU0sRUFBRSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQUEsWUFBRyxTQUFRO0FBQUEsWUFBQztBQUFBLFVBQ2pFLENBQUM7QUFBQSxRQUNILFNBQVE7QUFBQSxRQUFDO0FBRVQsWUFBSTtBQUNGLGdCQUFNLFlBQVksRUFBRSxnQkFBZ0IsVUFBVSxRQUFRO0FBQ3RELG1CQUFTLE9BQU87QUFBQSxRQUNsQixTQUFTLEdBQVE7QUFDZixxQkFBVSx1QkFBRyxZQUFXLG9EQUFZLE9BQU87QUFFM0MsYUFBRyxZQUFZQTtBQUNmLGNBQUk7QUFDRixpQkFBSyxpQkFBaUIsWUFBWSxFQUFFLFFBQVEsQ0FBQyxPQUFPO0FBQ2xELG9CQUFNLE9BQVEsR0FBbUIsYUFBYSxVQUFVO0FBQ3hELGtCQUFJO0FBQUUsbUJBQUcsWUFBWSxXQUFXLE1BQU0sRUFBRSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQUEsY0FBRyxTQUFRQyxJQUFBO0FBQUEsY0FBQztBQUFBLFlBQ2pFLENBQUM7QUFBQSxVQUNILFNBQVFBLElBQUE7QUFBQSxVQUFDO0FBQUEsUUFDWCxVQUFFO0FBQ0EsYUFBRyxXQUFXO0FBQUEsUUFDaEI7QUFBQSxNQUNGO0FBRUEsU0FBRyxVQUFVO0FBQ2IsVUFBSSxVQUFVLENBQUMsTUFBTTtBQUFFLFlBQUssRUFBb0IsUUFBUSxRQUFTLFFBQU87QUFBQSxNQUFHO0FBQzNFLFVBQUksVUFBVSxDQUFDLE1BQU07QUFBRSxZQUFLLEVBQW9CLFFBQVEsUUFBUyxRQUFPO0FBQUEsTUFBRztBQUMzRSxhQUFPLFVBQVUsTUFBTTtBQUNyQixjQUFNLFFBQVEsSUFBSSxTQUFTO0FBQzNCLFlBQUksT0FBTyxRQUFRLFNBQVM7QUFDNUIsZUFBTyxZQUFZO0FBQ25CLGVBQU8sWUFBWSxXQUFXLFFBQVEsWUFBWSxPQUFPLEVBQUUsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUN0RSxlQUFPLFlBQVksU0FBUyxlQUFlLFFBQVEsaUJBQU8sY0FBSSxDQUFDO0FBQUEsTUFDakU7QUFBQSxJQUNGO0FBQUEsRUFDRjs7O0FDM0dPLE1BQU0sV0FBWSxPQUFlLGdCQUFnQjtBQUNqRCxNQUFNLGNBQWUsT0FBZSxtQkFBbUI7OztBQ0d2RCxNQUFNLGtCQUFOLE1BQU0sZ0JBQWU7QUFBQSxJQUFyQjtBQU1MLDBCQUFRLFVBQXFCO0FBQzdCLDBCQUFRLFlBQXNDLENBQUM7QUFBQTtBQUFBLElBTC9DLFdBQVcsSUFBb0I7QUFOakM7QUFPSSxjQUFPLFVBQUssY0FBTCxZQUFtQixLQUFLLFlBQVksSUFBSSxnQkFBZTtBQUFBLElBQ2hFO0FBQUEsSUFLQSxRQUFRLE9BQWU7QUFDckIsWUFBTSxJQUFJO0FBQ1YsVUFBSSxFQUFFLElBQUk7QUFFUixZQUFJLEtBQUssV0FBVyxLQUFLLE9BQU8sYUFBYSxLQUFLLE9BQU8sYUFBYTtBQUNwRTtBQUFBLFFBQ0Y7QUFHQSxZQUFJLEtBQUssUUFBUTtBQUNmLGNBQUk7QUFDRixpQkFBSyxPQUFPLFdBQVc7QUFBQSxVQUN6QixTQUFTLEdBQUc7QUFDVixvQkFBUSxLQUFLLHNDQUFzQyxDQUFDO0FBQUEsVUFDdEQ7QUFBQSxRQUNGO0FBR0EsYUFBSyxTQUFTLEVBQUUsR0FBRyxhQUFhLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxDQUFDO0FBRW5ELGFBQUssT0FBTyxHQUFHLFdBQVcsTUFBTTtBQUM5QixrQkFBUSxJQUFJLHlDQUF5QztBQUFBLFFBQ3ZELENBQUM7QUFFRCxhQUFLLE9BQU8sR0FBRyxjQUFjLE1BQU07QUFDakMsa0JBQVEsSUFBSSw4Q0FBOEM7QUFBQSxRQUM1RCxDQUFDO0FBRUQsYUFBSyxPQUFPLEdBQUcsaUJBQWlCLENBQUMsVUFBZTtBQUM5QyxrQkFBUSxNQUFNLHNDQUFzQyxLQUFLO0FBQUEsUUFDM0QsQ0FBQztBQUVELGFBQUssT0FBTyxNQUFNLENBQUMsT0FBZSxZQUFpQjtBQUNqRCxrQkFBUSxJQUFJLG9DQUFvQyxPQUFPLE9BQU87QUFDOUQsZUFBSyxVQUFVLE9BQU8sT0FBTztBQUFBLFFBQy9CLENBQUM7QUFBQSxNQUNILE9BQU87QUFFTCxnQkFBUSxLQUFLLHVDQUF1QztBQUNwRCxhQUFLLFNBQVM7QUFBQSxNQUNoQjtBQUFBLElBQ0Y7QUFBQSxJQUVBLEdBQUcsT0FBZSxTQUFrQjtBQXhEdEM7QUF5REksUUFBQyxVQUFLLFVBQUwsdUJBQXlCLENBQUMsSUFBRyxLQUFLLE9BQU87QUFBQSxJQUM1QztBQUFBLElBRUEsSUFBSSxPQUFlLFNBQWtCO0FBQ25DLFlBQU0sTUFBTSxLQUFLLFNBQVMsS0FBSztBQUMvQixVQUFJLENBQUMsSUFBSztBQUNWLFlBQU0sTUFBTSxJQUFJLFFBQVEsT0FBTztBQUMvQixVQUFJLE9BQU8sRUFBRyxLQUFJLE9BQU8sS0FBSyxDQUFDO0FBQUEsSUFDakM7QUFBQSxJQUVRLFVBQVUsT0FBZSxTQUFjO0FBQzdDLE9BQUMsS0FBSyxTQUFTLEtBQUssS0FBSyxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUM7QUFBQSxJQUN4RDtBQUFBLEVBQ0Y7QUFqRUUsZ0JBRFcsaUJBQ0k7QUFEVixNQUFNLGlCQUFOOzs7QUNEQSxXQUFTLFVBQVUsUUFBNkI7QUFDckQsVUFBTSxPQUFpRTtBQUFBLE1BQ3JFLEVBQUUsS0FBSyxRQUFRLE1BQU0sZ0JBQU0sTUFBTSxVQUFVLE1BQU0sT0FBTztBQUFBLE1BQ3hELEVBQUUsS0FBSyxhQUFhLE1BQU0sZ0JBQU0sTUFBTSxlQUFlLE1BQU0sWUFBWTtBQUFBLE1BQ3ZFLEVBQUUsS0FBSyxXQUFXLE1BQU0sZ0JBQU0sTUFBTSxhQUFhLE1BQU0sVUFBVTtBQUFBLE1BQ2pFLEVBQUUsS0FBSyxZQUFZLE1BQU0sc0JBQU8sTUFBTSxjQUFjLE1BQU0sV0FBVztBQUFBLE1BQ3JFLEVBQUUsS0FBSyxXQUFXLE1BQU0sZ0JBQU0sTUFBTSxhQUFhLE1BQU0sVUFBVTtBQUFBLElBQ25FO0FBQ0EsVUFBTSxPQUFPLFNBQVMsY0FBYyxLQUFLO0FBQ3pDLFNBQUssWUFBWTtBQUNqQixlQUFXLEtBQUssTUFBTTtBQUNwQixZQUFNLElBQUksU0FBUyxjQUFjLEdBQUc7QUFDcEMsUUFBRSxPQUFPLEVBQUU7QUFDWCxZQUFNLE1BQU0sV0FBVyxFQUFFLE1BQU0sRUFBRSxNQUFNLElBQUksV0FBVyxNQUFNLENBQUM7QUFDN0QsWUFBTSxRQUFRLFNBQVMsY0FBYyxNQUFNO0FBQzNDLFlBQU0sY0FBYyxFQUFFO0FBQ3RCLFFBQUUsWUFBWSxHQUFHO0FBQ2pCLFFBQUUsWUFBWSxLQUFLO0FBQ25CLFVBQUksRUFBRSxRQUFRLE9BQVEsR0FBRSxVQUFVLElBQUksUUFBUTtBQUM5QyxXQUFLLFlBQVksQ0FBQztBQUFBLElBQ3BCO0FBR0EsVUFBTSxZQUFZLFNBQVMsY0FBYyxHQUFHO0FBQzVDLGNBQVUsT0FBTztBQUNqQixjQUFVLFlBQVk7QUFDdEIsY0FBVSxNQUFNLFVBQVU7QUFDMUIsVUFBTSxZQUFZLFdBQVcsVUFBVSxFQUFFLE1BQU0sSUFBSSxXQUFXLE1BQU0sQ0FBQztBQUNyRSxVQUFNLGNBQWMsU0FBUyxjQUFjLE1BQU07QUFDakQsZ0JBQVksY0FBYztBQUMxQixjQUFVLFlBQVksU0FBUztBQUMvQixjQUFVLFlBQVksV0FBVztBQUNqQyxjQUFVLFVBQVUsQ0FBQyxNQUFNO0FBQ3pCLFFBQUUsZUFBZTtBQUNqQixVQUFJLFFBQVEsd0RBQVcsR0FBRztBQUN4QixvQkFBWSxFQUFFLE9BQU87QUFBQSxNQUN2QjtBQUFBLElBQ0Y7QUFDQSxTQUFLLFlBQVksU0FBUztBQUUxQixXQUFPO0FBQUEsRUFDVDs7O0FDNUNPLE1BQU0sY0FBTixNQUFrQjtBQUFBLElBQWxCO0FBQ0wsMEJBQVEsU0FBUTtBQUNoQiwwQkFBUSxXQUFVO0FBQ2xCLDBCQUFRO0FBQ1I7QUFBQTtBQUFBLElBRUEsSUFBSSxHQUFXO0FBTmpCO0FBT0ksV0FBSyxRQUFRO0FBQ2IsV0FBSyxVQUFVLEtBQUssT0FBTyxDQUFDO0FBQzVCLGlCQUFLLGFBQUwsOEJBQWdCLEtBQUs7QUFBQSxJQUN2QjtBQUFBLElBRUEsR0FBRyxHQUFXLFdBQVcsS0FBSztBQUM1QiwyQkFBcUIsS0FBSyxJQUFLO0FBQy9CLFlBQU0sUUFBUSxLQUFLO0FBQ25CLFlBQU0sUUFBUSxJQUFJO0FBQ2xCLFlBQU0sS0FBSyxZQUFZLElBQUk7QUFDM0IsWUFBTSxPQUFPLENBQUMsTUFBYztBQWpCaEM7QUFrQk0sY0FBTSxJQUFJLEtBQUssSUFBSSxJQUFJLElBQUksTUFBTSxRQUFRO0FBQ3pDLGNBQU0sT0FBTyxJQUFJLEtBQUssSUFBSSxJQUFJLEdBQUcsQ0FBQztBQUNsQyxjQUFNLE9BQU8sUUFBUSxRQUFRO0FBQzdCLGFBQUssVUFBVSxLQUFLLE9BQU8sSUFBSTtBQUMvQixtQkFBSyxhQUFMLDhCQUFnQixLQUFLO0FBQ3JCLFlBQUksSUFBSSxFQUFHLE1BQUssT0FBTyxzQkFBc0IsSUFBSTtBQUFBLFlBQzVDLE1BQUssUUFBUTtBQUFBLE1BQ3BCO0FBQ0EsV0FBSyxPQUFPLHNCQUFzQixJQUFJO0FBQUEsSUFDeEM7QUFBQSxJQUVRLE9BQU8sR0FBVztBQUN4QixhQUFPLEtBQUssTUFBTSxDQUFDLEVBQUUsZUFBZTtBQUFBLElBQ3RDO0FBQUEsRUFDRjs7O0FDNUJPLFdBQVMsb0JBQW9CO0FBQ2xDLFVBQU0sTUFBTSxTQUFTLGNBQWMsS0FBSztBQUN4QyxRQUFJLFlBQVk7QUFDaEIsVUFBTSxPQUFPLFNBQVMsY0FBYyxLQUFLO0FBQ3pDLFNBQUssWUFBWTtBQUNqQixTQUFLLFlBQVk7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBa0JqQixRQUFJLFlBQVksSUFBSTtBQUVwQixRQUFJO0FBQ0YsWUFBTSxTQUFTLEtBQUssY0FBYyxrQkFBa0I7QUFDcEQsWUFBTSxVQUFVLEtBQUssY0FBYyxtQkFBbUI7QUFDdEQsVUFBSSxPQUFRLFFBQU8sWUFBWSxXQUFXLE9BQU8sRUFBRSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQzlELFVBQUksUUFBUyxTQUFRLFlBQVksV0FBVyxRQUFRLEVBQUUsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUFBLElBQ25FLFNBQVE7QUFBQSxJQUFDO0FBRVQsVUFBTSxRQUFRLEtBQUssY0FBYyxNQUFNO0FBQ3ZDLFVBQU0sU0FBUyxLQUFLLGNBQWMsT0FBTztBQUV6QyxVQUFNLGFBQWEsSUFBSSxZQUFZO0FBQ25DLFVBQU0sY0FBYyxJQUFJLFlBQVk7QUFDcEMsZUFBVyxXQUFXLENBQUMsU0FBUztBQUFFLFlBQU0sY0FBYztBQUFBLElBQU07QUFDNUQsZ0JBQVksV0FBVyxDQUFDLFNBQVM7QUFBRSxhQUFPLGNBQWM7QUFBQSxJQUFNO0FBRTlELFFBQUksVUFBVTtBQUNkLFFBQUksV0FBVztBQUVmLG1CQUFlLFNBQVM7QUFDdEIsVUFBSTtBQUNGLGNBQU0sSUFBSSxNQUFNLGVBQWUsRUFBRSxRQUFnRyxlQUFlO0FBR2hKLFlBQUksRUFBRSxjQUFjLFNBQVM7QUFDM0IscUJBQVcsR0FBRyxFQUFFLFdBQVcsR0FBRztBQUU5QixjQUFJLEVBQUUsWUFBWSxTQUFTO0FBQ3pCLGtCQUFNLFVBQVUsS0FBSyxjQUFjLGdCQUFnQjtBQUNuRCxnQkFBSSxTQUFTO0FBQ1gsc0JBQVEsVUFBVSxJQUFJLFlBQVk7QUFDbEMseUJBQVcsTUFBTSxRQUFRLFVBQVUsT0FBTyxZQUFZLEdBQUcsR0FBRztBQUFBLFlBQzlEO0FBQUEsVUFDRjtBQUNBLG9CQUFVLEVBQUU7QUFBQSxRQUNkO0FBRUEsWUFBSSxFQUFFLFlBQVksVUFBVTtBQUMxQixzQkFBWSxHQUFHLEVBQUUsU0FBUyxHQUFHO0FBQzdCLGNBQUksRUFBRSxVQUFVLFVBQVU7QUFDeEIsa0JBQU0sV0FBVyxLQUFLLGNBQWMsaUJBQWlCO0FBQ3JELGdCQUFJLFVBQVU7QUFDWix1QkFBUyxVQUFVLElBQUksWUFBWTtBQUNuQyx5QkFBVyxNQUFNLFNBQVMsVUFBVSxPQUFPLFlBQVksR0FBRyxHQUFHO0FBQUEsWUFDL0Q7QUFBQSxVQUNGO0FBQ0EscUJBQVcsRUFBRTtBQUFBLFFBQ2Y7QUFBQSxNQUNGLFNBQVE7QUFBQSxNQUVSO0FBQUEsSUFDRjtBQUNBLFdBQU8sRUFBRSxNQUFNLEtBQUssUUFBUSxPQUFPLE9BQU87QUFBQSxFQUM1Qzs7O0FDN0RPLE1BQU0sWUFBTixNQUFnQjtBQUFBLElBQWhCO0FBQ0wsMEJBQVEsUUFBMkI7QUFDbkMsMEJBQVEsV0FBVTtBQUNsQiwwQkFBUSxXQUFVO0FBQ2xCLDBCQUFRLFlBQVc7QUFDbkIsMEJBQVEsZUFBYztBQUN0QiwwQkFBUSxxQkFBb0I7QUFDNUIsMEJBQVEsaUJBQStCO0FBQ3ZDLDBCQUFRLGNBQWE7QUFDckIsMEJBQVEsV0FBeUI7QUFFakMsMEJBQVEsT0FBTTtBQUFBLFFBQ1osTUFBTTtBQUFBLFFBQ04sU0FBUztBQUFBLFFBQ1QsWUFBWTtBQUFBLFFBQ1osTUFBTTtBQUFBLFFBQ04sU0FBUztBQUFBLFFBQ1QsT0FBTztBQUFBLFFBQ1AsV0FBVztBQUFBLFFBQ1gsUUFBUTtBQUFBLFFBQ1IsT0FBTztBQUFBLFFBQ1AsTUFBTTtBQUFBLFFBQ04sU0FBUztBQUFBLFFBQ1QsUUFBUTtBQUFBLFFBQ1IsV0FBVztBQUFBLFFBQ1gsVUFBVTtBQUFBLE1BQ1o7QUFFQSwwQkFBUTtBQUNSLDBCQUFRO0FBQ1IsMEJBQVE7QUE4WVIsMEJBQVEsaUJBQWdCO0FBQUE7QUFBQSxJQTVZeEIsTUFBTSxNQUFNLE1BQW1CO0FBQzdCLFdBQUssbUJBQW1CO0FBQ3hCLFdBQUssVUFBVTtBQUVmLFlBQU0sTUFBTSxVQUFVLE1BQU07QUFDNUIsWUFBTSxNQUFNLGtCQUFrQjtBQUM5QixZQUFNLE9BQU8sS0FBSztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsS0EyRGpCO0FBRUQsV0FBSyxZQUFZO0FBQ2pCLFdBQUssWUFBWSxHQUFHO0FBQ3BCLFdBQUssWUFBWSxJQUFJLElBQUk7QUFDekIsV0FBSyxZQUFZLElBQUk7QUFFckIsV0FBSyxPQUFPO0FBRVosVUFBSTtBQUNGLGFBQUssaUJBQWlCLFlBQVksRUFDL0IsUUFBUSxDQUFDLE9BQU87QUFDZixnQkFBTSxPQUFRLEdBQW1CLGFBQWEsVUFBVTtBQUN4RCxjQUFJO0FBQUUsZUFBRyxZQUFZLFdBQVcsTUFBTSxFQUFFLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFBQSxVQUFHLFNBQVE7QUFBQSxVQUFDO0FBQUEsUUFDakUsQ0FBQztBQUFBLE1BQ0wsU0FBUTtBQUFBLE1BQUM7QUFDVCxXQUFLLGNBQWM7QUFDbkIsV0FBSyxlQUFlLElBQUksT0FBTyxLQUFLLEdBQUcsQ0FBQztBQUN4QyxZQUFNLElBQUksT0FBTztBQUNqQixXQUFLLGNBQWM7QUFDbkIsWUFBTSxLQUFLLGNBQWM7QUFDekIsV0FBSyxlQUFlO0FBQ3BCLFdBQUssZUFBZTtBQUFBLElBQ3RCO0FBQUEsSUFFUSxnQkFBZ0I7QUFDdEIsVUFBSSxDQUFDLEtBQUssS0FBTTtBQUNoQixXQUFLLElBQUksT0FBTyxHQUFHLEtBQUssTUFBTSxPQUFPO0FBQ3JDLFdBQUssSUFBSSxVQUFVLEdBQUcsS0FBSyxNQUFNLFVBQVU7QUFDM0MsV0FBSyxJQUFJLGFBQWEsR0FBRyxLQUFLLE1BQU0sYUFBYTtBQUNqRCxXQUFLLElBQUksT0FBTyxLQUFLLEtBQUssY0FBYyxPQUFPO0FBQy9DLFdBQUssSUFBSSxVQUFVLEtBQUssS0FBSyxjQUFjLFVBQVU7QUFDckQsV0FBSyxJQUFJLFFBQVEsS0FBSyxLQUFLLGNBQWMsUUFBUTtBQUNqRCxXQUFLLElBQUksWUFBWSxLQUFLLEtBQUssY0FBYyxZQUFZO0FBQ3pELFdBQUssSUFBSSxTQUFTLEtBQUssS0FBSyxjQUFjLFNBQVM7QUFDbkQsV0FBSyxJQUFJLFFBQVEsR0FBc0IsS0FBSyxNQUFNLFFBQVE7QUFDMUQsV0FBSyxJQUFJLE9BQU8sR0FBc0IsS0FBSyxNQUFNLE9BQU87QUFDeEQsV0FBSyxJQUFJLFVBQVUsR0FBc0IsS0FBSyxNQUFNLFVBQVU7QUFDOUQsV0FBSyxJQUFJLFNBQVMsR0FBc0IsS0FBSyxNQUFNLFNBQVM7QUFDNUQsV0FBSyxJQUFJLFlBQVksR0FBc0IsS0FBSyxNQUFNLFNBQVM7QUFDL0QsV0FBSyxJQUFJLFdBQVcsS0FBSyxLQUFLLGNBQWMsV0FBVztBQUFBLElBQ3pEO0FBQUEsSUFFUSxlQUFlLFdBQWdDO0FBaEt6RDtBQWlLSSxVQUFJLENBQUMsS0FBSyxLQUFNO0FBQ2hCLGlCQUFLLElBQUksVUFBVCxtQkFBZ0IsaUJBQWlCLFNBQVMsTUFBTSxLQUFLLFlBQVk7QUFDakUsaUJBQUssSUFBSSxTQUFULG1CQUFlLGlCQUFpQixTQUFTLE1BQU0sS0FBSyxXQUFXO0FBQy9ELGlCQUFLLElBQUksY0FBVCxtQkFBb0IsaUJBQWlCLFNBQVMsTUFBTSxLQUFLLGNBQWM7QUFDdkUsaUJBQUssSUFBSSxXQUFULG1CQUFpQixpQkFBaUIsU0FBUyxNQUFNLEtBQUssYUFBYTtBQUNuRSxpQkFBSyxJQUFJLFlBQVQsbUJBQWtCLGlCQUFpQixTQUFTLE1BQU0sS0FBSyxjQUFjLFNBQVM7QUFBQSxJQUNoRjtBQUFBLElBRVEsZ0JBQWdCO0FBQ3RCLFlBQU0sUUFBUSxlQUFlLEVBQUUsU0FBUztBQUN4QyxVQUFJLE1BQU8sZ0JBQWUsRUFBRSxRQUFRLEtBQUs7QUFFekMsVUFBSSxLQUFLLGtCQUFtQixnQkFBZSxFQUFFLElBQUksZUFBZSxLQUFLLGlCQUFpQjtBQUN0RixVQUFJLEtBQUssb0JBQXFCLGdCQUFlLEVBQUUsSUFBSSxpQkFBaUIsS0FBSyxtQkFBbUI7QUFDNUYsVUFBSSxLQUFLLGVBQWdCLGdCQUFlLEVBQUUsSUFBSSxvQkFBb0IsS0FBSyxjQUFjO0FBRXJGLFdBQUssb0JBQW9CLENBQUMsUUFBUTtBQWpMdEM7QUFrTE0sYUFBSyxVQUFVLE9BQU8sSUFBSSxlQUFlLFdBQVcsSUFBSSxhQUFhLEtBQUs7QUFDMUUsYUFBSyxVQUFVLE9BQU8sSUFBSSxpQkFBaUIsV0FBVyxJQUFJLGVBQWUsS0FBSztBQUM5RSxhQUFLLFlBQVcsU0FBSSxZQUFKLFlBQWUsS0FBSztBQUNwQyxZQUFJLElBQUksYUFBYSxJQUFJLG9CQUFvQjtBQUMzQyxlQUFLLHVCQUF1QixJQUFJLGtCQUFrQjtBQUFBLFFBQ3BELFdBQVcsQ0FBQyxJQUFJLFdBQVc7QUFDekIsZUFBSyxjQUFjO0FBQ25CLGVBQUssbUJBQW1CO0FBQUEsUUFDMUI7QUFDQSxhQUFLLGVBQWU7QUFDcEIsWUFBSSxJQUFJLFNBQVMsY0FBYyxJQUFJLFFBQVE7QUFDekMsZUFBSyxpQkFBaUIsMERBQWEsSUFBSSxNQUFNLFFBQUc7QUFDaEQsZUFBSyxTQUFTLGlCQUFPLElBQUksTUFBTSxFQUFFO0FBQUEsUUFDbkMsV0FBVyxJQUFJLFNBQVMsWUFBWSxJQUFJLFFBQVE7QUFDOUMsZUFBSyxpQkFBaUIsNEJBQVEsSUFBSSxNQUFNLHNCQUFPLEtBQUssY0FBYyxDQUFDLEVBQUU7QUFDckUsZUFBSyxTQUFTLGlCQUFPLElBQUksTUFBTSxFQUFFO0FBQUEsUUFDbkMsV0FBVyxJQUFJLFNBQVMsWUFBWTtBQUNsQyxlQUFLLGlCQUFpQiw4REFBWTtBQUNsQyxlQUFLLFNBQVMsMEJBQU07QUFBQSxRQUN0QixXQUFXLElBQUksU0FBUyxXQUFXO0FBQ2pDLGVBQUssaUJBQWlCLDhEQUFZO0FBQ2xDLGVBQUssU0FBUywwQkFBTTtBQUFBLFFBQ3RCLFdBQVcsS0FBSyxhQUFhO0FBQzNCLGVBQUssaUJBQWlCLDhDQUFXLEtBQUssaUJBQWlCLEdBQUc7QUFBQSxRQUM1RDtBQUNBLGFBQUssZUFBZTtBQUFBLE1BQ3RCO0FBRUEsV0FBSyxzQkFBc0IsQ0FBQyxRQUFRO0FBQ2xDLGNBQU0sVUFBVSxPQUFPLDJCQUFLLGVBQWUsS0FBSztBQUNoRCxZQUFJLFVBQVUsRUFBRyxNQUFLLHVCQUF1QixPQUFPO0FBQ3BELGtCQUFVLGdFQUFjLE9BQU8sV0FBTSxNQUFNO0FBQUEsTUFDN0M7QUFFQSxXQUFLLGlCQUFpQixDQUFDLFFBQVE7QUFDN0Isa0JBQVUsd0NBQVUsSUFBSSxRQUFRLHNCQUFPLElBQUksSUFBSSxJQUFJLE1BQU07QUFDekQsYUFBSyxTQUFTLFVBQUssSUFBSSxRQUFRLGtCQUFRLElBQUksSUFBSSxFQUFFO0FBQUEsTUFDbkQ7QUFFQSxxQkFBZSxFQUFFLEdBQUcsZUFBZSxLQUFLLGlCQUFpQjtBQUN6RCxxQkFBZSxFQUFFLEdBQUcsaUJBQWlCLEtBQUssbUJBQW1CO0FBQzdELHFCQUFlLEVBQUUsR0FBRyxvQkFBb0IsS0FBSyxjQUFjO0FBQUEsSUFDN0Q7QUFBQSxJQUVBLE1BQWMsY0FBYztBQUMxQixVQUFJLEtBQUssV0FBVyxLQUFLLGFBQWE7QUFDcEMsWUFBSSxLQUFLLFlBQWEsV0FBVSwwREFBYSxNQUFNO0FBQ25EO0FBQUEsTUFDRjtBQUNBLFdBQUssVUFBVTtBQUNmLFdBQUssZUFBZTtBQUNwQixVQUFJO0FBQ0YsY0FBTSxTQUFTLE1BQU0sZUFBZSxFQUFFLFFBQW9CLGVBQWUsRUFBRSxRQUFRLE9BQU8sQ0FBQztBQUMzRixhQUFLLFlBQVksTUFBTTtBQUN2QixhQUFLLGlCQUFpQixnQ0FBTztBQUM3QixrQkFBVSxrQ0FBUyxTQUFTO0FBQUEsTUFDOUIsU0FBUyxHQUFRO0FBQ2YsbUJBQVUsdUJBQUcsWUFBVyw0QkFBUSxPQUFPO0FBQUEsTUFDekMsVUFBRTtBQUNBLGFBQUssVUFBVTtBQUNmLGFBQUssZUFBZTtBQUFBLE1BQ3RCO0FBQUEsSUFDRjtBQUFBLElBRUEsTUFBYyxhQUFhO0FBQ3pCLFVBQUksS0FBSyxRQUFTO0FBQ2xCLFdBQUssVUFBVTtBQUNmLFdBQUssZUFBZTtBQUNwQixVQUFJO0FBQ0YsY0FBTSxTQUFTLE1BQU0sZUFBZSxFQUFFLFFBQW9CLGNBQWMsRUFBRSxRQUFRLE9BQU8sQ0FBQztBQUMxRixhQUFLLFlBQVksTUFBTTtBQUN2QixhQUFLLGlCQUFpQixnQ0FBTztBQUM3QixrQkFBVSxrQ0FBUyxTQUFTO0FBQUEsTUFDOUIsU0FBUyxHQUFRO0FBQ2YsbUJBQVUsdUJBQUcsWUFBVyw0QkFBUSxPQUFPO0FBQUEsTUFDekMsVUFBRTtBQUNBLGFBQUssVUFBVTtBQUNmLGFBQUssZUFBZTtBQUFBLE1BQ3RCO0FBQUEsSUFDRjtBQUFBLElBRUEsTUFBYyxjQUFjLFdBQWdDO0FBQzFELFVBQUksS0FBSyxXQUFXLEtBQUssV0FBVyxFQUFHO0FBQ3ZDLFdBQUssVUFBVTtBQUNmLFdBQUssZUFBZTtBQUNwQixVQUFJO0FBQ0YsY0FBTSxNQUFNLE1BQU0sZUFBZSxFQUFFLFFBQW1ELGlCQUFpQixFQUFFLFFBQVEsT0FBTyxDQUFDO0FBQ3pILFlBQUksSUFBSSxPQUFRLE1BQUssWUFBWSxJQUFJLE1BQU07QUFDM0MsWUFBSSxJQUFJLFlBQVksR0FBRztBQUVyQixlQUFLLHlCQUF5QixJQUFJLFNBQVM7QUFDM0Msb0JBQVUsNEJBQVEsSUFBSSxTQUFTLElBQUksU0FBUztBQUFBLFFBQzlDLE9BQU87QUFDTCxvQkFBVSxzRUFBZSxNQUFNO0FBQUEsUUFDakM7QUFDQSxjQUFNLFVBQVU7QUFBQSxNQUNsQixTQUFTLEdBQVE7QUFDZixtQkFBVSx1QkFBRyxZQUFXLDRCQUFRLE9BQU87QUFBQSxNQUN6QyxVQUFFO0FBQ0EsYUFBSyxVQUFVO0FBQ2YsYUFBSyxlQUFlO0FBQUEsTUFDdEI7QUFBQSxJQUNGO0FBQUEsSUFFUSx5QkFBeUIsUUFBZ0I7QUFDL0MsWUFBTSxTQUFTLEtBQUssSUFBSTtBQUN4QixZQUFNLFFBQVEsU0FBUyxjQUFjLE1BQU07QUFDM0MsVUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFPO0FBRXZCLFlBQU0sWUFBWSxPQUFPLHNCQUFzQjtBQUMvQyxZQUFNLFVBQVUsTUFBTSxzQkFBc0I7QUFHNUMsWUFBTSxnQkFBZ0IsS0FBSyxJQUFJLEdBQUcsS0FBSyxJQUFJLEdBQUcsS0FBSyxNQUFNLFNBQVMsRUFBRSxDQUFDLENBQUM7QUFDdEUsZUFBUyxJQUFJLEdBQUcsSUFBSSxlQUFlLEtBQUs7QUFDdEMsbUJBQVcsTUFBTTtBQUNmLGdCQUFNLFdBQVcsU0FBUyxjQUFjLEtBQUs7QUFDN0MsbUJBQVMsWUFBWTtBQUNyQixtQkFBUyxjQUFjO0FBQ3ZCLG1CQUFTLE1BQU0sVUFBVTtBQUFBO0FBQUEsa0JBRWYsVUFBVSxPQUFPLFVBQVUsUUFBUSxDQUFDO0FBQUEsaUJBQ3JDLFVBQVUsTUFBTSxVQUFVLFNBQVMsQ0FBQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFNN0MsbUJBQVMsS0FBSyxZQUFZLFFBQVE7QUFFbEMsZ0JBQU0sS0FBSyxRQUFRLE9BQU8sUUFBUSxRQUFRLElBQUksVUFBVSxPQUFPLFVBQVUsUUFBUTtBQUNqRixnQkFBTSxLQUFLLFFBQVEsTUFBTSxRQUFRLFNBQVMsSUFBSSxVQUFVLE1BQU0sVUFBVSxTQUFTO0FBQ2pGLGdCQUFNLGdCQUFnQixLQUFLLE9BQU8sSUFBSSxPQUFPO0FBRTdDLG1CQUFTLFFBQVE7QUFBQSxZQUNmO0FBQUEsY0FDRSxXQUFXO0FBQUEsY0FDWCxTQUFTO0FBQUEsWUFDWDtBQUFBLFlBQ0E7QUFBQSxjQUNFLFdBQVcsYUFBYSxLQUFHLElBQUksWUFBWSxPQUFPLEtBQUssR0FBRztBQUFBLGNBQzFELFNBQVM7QUFBQSxjQUNULFFBQVE7QUFBQSxZQUNWO0FBQUEsWUFDQTtBQUFBLGNBQ0UsV0FBVyxhQUFhLEVBQUUsT0FBTyxFQUFFO0FBQUEsY0FDbkMsU0FBUztBQUFBLFlBQ1g7QUFBQSxVQUNGLEdBQUc7QUFBQSxZQUNELFVBQVUsTUFBTyxJQUFJO0FBQUEsWUFDckIsUUFBUTtBQUFBLFVBQ1YsQ0FBQyxFQUFFLFdBQVcsTUFBTTtBQUNsQixxQkFBUyxPQUFPO0FBRWhCLGdCQUFJLE1BQU0sZ0JBQWdCLEdBQUc7QUFDM0Isb0JBQU0sVUFBVSxJQUFJLE9BQU87QUFDM0IseUJBQVcsTUFBTSxNQUFNLFVBQVUsT0FBTyxPQUFPLEdBQUcsR0FBRztBQUFBLFlBQ3ZEO0FBQUEsVUFDRjtBQUFBLFFBQ0YsR0FBRyxJQUFJLEVBQUU7QUFBQSxNQUNYO0FBQUEsSUFDRjtBQUFBLElBRUEsTUFBYyxlQUFlO0FBQzNCLFVBQUksS0FBSyxXQUFXLENBQUMsS0FBSyxZQUFhO0FBQ3ZDLFdBQUssVUFBVTtBQUNmLFdBQUssZUFBZTtBQUNwQixVQUFJO0FBQ0YsY0FBTSxTQUFTLE1BQU0sZUFBZSxFQUFFLFFBQW9CLGdCQUFnQixFQUFFLFFBQVEsT0FBTyxDQUFDO0FBQzVGLGFBQUssWUFBWSxNQUFNO0FBQ3ZCLGFBQUssaUJBQWlCLG9FQUFhO0FBQ25DLGtCQUFVLGtDQUFTLFNBQVM7QUFBQSxNQUM5QixTQUFTLEdBQVE7QUFDZixtQkFBVSx1QkFBRyxZQUFXLDRCQUFRLE9BQU87QUFBQSxNQUN6QyxVQUFFO0FBQ0EsYUFBSyxVQUFVO0FBQ2YsYUFBSyxlQUFlO0FBQUEsTUFDdEI7QUFBQSxJQUNGO0FBQUEsSUFFQSxNQUFjLGdCQUFnQjtBQUM1QixVQUFJLEtBQUssWUFBWSxTQUFVO0FBQy9CLFdBQUssVUFBVTtBQUNmLFdBQUssZUFBZTtBQUNwQixVQUFJO0FBQ0YsY0FBTSxTQUFTLE1BQU0sZUFBZSxFQUFFLFFBQW9CLGNBQWM7QUFDeEUsYUFBSyxZQUFZLE1BQU07QUFBQSxNQUN6QixTQUFTLEdBQVE7QUFDZixtQkFBVSx1QkFBRyxZQUFXLHdDQUFVLE9BQU87QUFBQSxNQUMzQyxVQUFFO0FBQ0EsYUFBSyxVQUFVO0FBQ2YsYUFBSyxlQUFlO0FBQUEsTUFDdEI7QUFBQSxJQUNGO0FBQUEsSUFFUSxZQUFZLFFBQWdDLE9BQTRCLENBQUMsR0FBRztBQXJYdEY7QUFzWEksVUFBSSxDQUFDLE9BQVE7QUFDYixXQUFLLFdBQVUsWUFBTyxlQUFQLFlBQXFCLEtBQUs7QUFDekMsV0FBSyxXQUFVLFlBQU8saUJBQVAsWUFBdUIsS0FBSztBQUMzQyxXQUFLLGNBQWEsWUFBTyxlQUFQLFlBQXFCLEtBQUs7QUFDNUMsV0FBSyxXQUFXLFFBQVEsT0FBTyxPQUFPO0FBQ3RDLFdBQUssY0FBYyxRQUFRLE9BQU8sU0FBUztBQUMzQyxVQUFJLE9BQU8sYUFBYSxPQUFPLHFCQUFxQixHQUFHO0FBQ3JELGFBQUssdUJBQXVCLE9BQU8sa0JBQWtCO0FBQUEsTUFDdkQsT0FBTztBQUNMLGFBQUssbUJBQW1CO0FBQ3hCLGFBQUssb0JBQW9CO0FBQUEsTUFDM0I7QUFDQSxXQUFLLGVBQWU7QUFDcEIsVUFBSSxDQUFDLEtBQUssT0FBTztBQUNmLFlBQUksS0FBSyxlQUFlLEtBQUssb0JBQW9CLEdBQUc7QUFDbEQsZUFBSyxpQkFBaUIsOENBQVcsS0FBSyxpQkFBaUIsR0FBRztBQUFBLFFBQzVELFdBQVcsS0FBSyxVQUFVO0FBQ3hCLGdCQUFNLFVBQVUsS0FBSyxJQUFJLEdBQUcsS0FBSyxNQUFNLEtBQUssYUFBYSxHQUFJLENBQUM7QUFDOUQsZUFBSyxpQkFBaUIsMERBQWEsT0FBTyx1QkFBUSxLQUFLLGNBQWMsQ0FBQyxFQUFFO0FBQUEsUUFDMUUsT0FBTztBQUNMLGVBQUssaUJBQWlCLDBFQUFjO0FBQUEsUUFDdEM7QUFBQSxNQUNGO0FBQ0EsVUFBSSxLQUFLLElBQUksT0FBTztBQUNsQixjQUFNLFVBQVUsS0FBSyxJQUFJLEdBQUcsS0FBSyxNQUFNLEtBQUssYUFBYSxHQUFJLENBQUM7QUFDOUQsYUFBSyxJQUFJLE1BQU0sY0FBYyxHQUFHLE9BQU87QUFBQSxNQUN6QztBQUNBLFVBQUksS0FBSyxJQUFJLFdBQVc7QUFDdEIsY0FBTSxLQUFLLEtBQUssSUFBSTtBQUNwQixXQUFHLFlBQVk7QUFHZixXQUFHLFVBQVUsT0FBTyxnQkFBZ0IsZ0JBQWdCO0FBRXBELGNBQU0sTUFBTSxLQUFLLGNBQWMsVUFBVyxLQUFLLFdBQVcsU0FBUztBQUNuRSxZQUFJO0FBQUUsYUFBRyxZQUFZLFdBQVcsS0FBWSxFQUFFLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFBQSxRQUFHLFNBQVE7QUFBQSxRQUFDO0FBQ3JFLFdBQUcsWUFBWSxTQUFTLGVBQWUsS0FBSyxjQUFjLGlCQUFRLEtBQUssV0FBVyx1QkFBUSxjQUFLLENBQUM7QUFHaEcsWUFBSSxLQUFLLGFBQWE7QUFDcEIsYUFBRyxVQUFVLElBQUksZ0JBQWdCO0FBQUEsUUFDbkMsV0FBVyxLQUFLLFVBQVU7QUFDeEIsYUFBRyxVQUFVLElBQUksY0FBYztBQUFBLFFBQ2pDO0FBQUEsTUFDRjtBQUNBLFdBQUssZUFBZTtBQUFBLElBQ3RCO0FBQUEsSUFFUSx1QkFBdUIsU0FBaUI7QUFDOUMsV0FBSyxtQkFBbUI7QUFDeEIsV0FBSyxjQUFjO0FBQ25CLFdBQUssb0JBQW9CLEtBQUssSUFBSSxHQUFHLEtBQUssTUFBTSxPQUFPLENBQUM7QUFDeEQsV0FBSyxpQkFBaUIsOENBQVcsS0FBSyxpQkFBaUIsR0FBRztBQUMxRCxXQUFLLGVBQWU7QUFDcEIsV0FBSyxnQkFBZ0IsT0FBTyxZQUFZLE1BQU07QUFDNUMsYUFBSyxvQkFBb0IsS0FBSyxJQUFJLEdBQUcsS0FBSyxvQkFBb0IsQ0FBQztBQUMvRCxZQUFJLEtBQUsscUJBQXFCLEdBQUc7QUFDL0IsZUFBSyxtQkFBbUI7QUFDeEIsZUFBSyxjQUFjO0FBQ25CLGVBQUssaUJBQWlCLDBFQUFjO0FBQ3BDLGVBQUssZUFBZTtBQUFBLFFBQ3RCLE9BQU87QUFDTCxlQUFLLGlCQUFpQiw4Q0FBVyxLQUFLLGlCQUFpQixHQUFHO0FBQUEsUUFDNUQ7QUFBQSxNQUNGLEdBQUcsR0FBSTtBQUFBLElBQ1Q7QUFBQSxJQUVRLHFCQUFxQjtBQUMzQixVQUFJLEtBQUssa0JBQWtCLE1BQU07QUFDL0IsZUFBTyxjQUFjLEtBQUssYUFBYTtBQUN2QyxhQUFLLGdCQUFnQjtBQUFBLE1BQ3ZCO0FBQUEsSUFDRjtBQUFBLElBSVEsaUJBQWlCO0FBbGMzQjtBQW1jSSxVQUFJLENBQUMsS0FBSyxJQUFJLFFBQVEsQ0FBQyxLQUFLLElBQUksUUFBUztBQUN6QyxZQUFNLE1BQU0sS0FBSyxVQUFVLElBQUksS0FBSyxJQUFJLEdBQUcsS0FBSyxVQUFVLEtBQUssT0FBTyxJQUFJO0FBQzFFLFlBQU0sU0FBUyxLQUFLLE1BQU0sTUFBTSxHQUFHO0FBRW5DLFdBQUssSUFBSSxLQUFLLE1BQU0sUUFBUSxHQUFHLE1BQU07QUFDckMsV0FBSyxJQUFJLFFBQVEsY0FBYyxHQUFHLE1BQU07QUFHeEMsVUFBSSxZQUFZO0FBQ2hCLFVBQUksT0FBTyxNQUFNO0FBQ2Ysb0JBQVk7QUFBQSxNQUNkLFdBQVcsT0FBTyxLQUFLO0FBQ3JCLG9CQUFZO0FBQUEsTUFDZDtBQUVBLFVBQUksS0FBSyxJQUFJLE1BQU07QUFDakIsY0FBTSxNQUFNLEtBQUssTUFBTSxNQUFNLEdBQUc7QUFDaEMsUUFBQyxLQUFLLElBQUksS0FBcUIsTUFBTSxhQUFhLGtCQUFrQixTQUFTLElBQUksR0FBRztBQUdwRixZQUFJLE9BQU8sR0FBRztBQUNaLGVBQUssSUFBSSxLQUFLLFVBQVUsSUFBSSxXQUFXO0FBQUEsUUFDekMsT0FBTztBQUNMLGVBQUssSUFBSSxLQUFLLFVBQVUsT0FBTyxXQUFXO0FBQUEsUUFDNUM7QUFBQSxNQUNGO0FBRUEsVUFBSSxLQUFLLElBQUksUUFBUyxNQUFLLElBQUksUUFBUSxjQUFjLEdBQUcsTUFBTTtBQUc5RCxZQUFNLGFBQWEsQ0FBQyxJQUFJLElBQUksSUFBSSxHQUFHO0FBQ25DLGlCQUFXLGFBQWEsWUFBWTtBQUNsQyxZQUFJLFVBQVUsYUFBYSxLQUFLLGdCQUFnQixXQUFXO0FBQ3pELGVBQUssc0JBQXNCLFNBQVM7QUFDcEMsZUFBSyxnQkFBZ0I7QUFBQSxRQUN2QjtBQUFBLE1BQ0Y7QUFHQSxVQUFJLFNBQVMsS0FBSyxnQkFBZ0IsSUFBSTtBQUNwQyxhQUFLLGdCQUFnQixLQUFLLE1BQU0sU0FBUyxFQUFFLElBQUk7QUFBQSxNQUNqRDtBQUdBLFVBQUksVUFBVSxNQUFNLFNBQVMsS0FBSztBQUNoQyxZQUFJLEdBQUMsZ0JBQUssSUFBSSxlQUFULG1CQUFxQixnQkFBckIsbUJBQWtDLFNBQVMsOEJBQVM7QUFDdkQsZUFBSyxpQkFBaUIsaUZBQWdCO0FBQUEsUUFDeEM7QUFBQSxNQUNGO0FBRUEsVUFBSSxLQUFLLFlBQVksYUFBYSxLQUFLLElBQUksU0FBUztBQUNsRCxhQUFLLElBQUksUUFBUSxXQUFXLEtBQUssWUFBWSxhQUFhLEtBQUssV0FBVztBQUcxRSxZQUFJLEtBQUssVUFBVSxLQUFLLENBQUMsS0FBSyxJQUFJLFFBQVEsVUFBVTtBQUNsRCxlQUFLLElBQUksUUFBUSxVQUFVLElBQUksWUFBWTtBQUFBLFFBQzdDLE9BQU87QUFDTCxlQUFLLElBQUksUUFBUSxVQUFVLE9BQU8sWUFBWTtBQUFBLFFBQ2hEO0FBQUEsTUFDRjtBQUdBLFdBQUssYUFBYSxHQUFHO0FBR3JCLFdBQUssb0JBQW9CO0FBQUEsSUFDM0I7QUFBQSxJQUVRLHNCQUFzQixXQUFtQjtBQUMvQyxVQUFJLEtBQUssSUFBSSxNQUFNO0FBQ2pCLGFBQUssSUFBSSxLQUFLLFVBQVUsSUFBSSxpQkFBaUI7QUFDN0MsbUJBQVcsTUFBRztBQTFnQnBCO0FBMGdCdUIsNEJBQUssSUFBSSxTQUFULG1CQUFlLFVBQVUsT0FBTztBQUFBLFdBQW9CLEdBQUk7QUFBQSxNQUMzRTtBQUVBLFVBQUksS0FBSyxJQUFJLFNBQVM7QUFDcEIsYUFBSyxJQUFJLFFBQVEsVUFBVSxJQUFJLE9BQU87QUFDdEMsbUJBQVcsTUFBRztBQS9nQnBCO0FBK2dCdUIsNEJBQUssSUFBSSxZQUFULG1CQUFrQixVQUFVLE9BQU87QUFBQSxXQUFVLEdBQUc7QUFBQSxNQUNuRTtBQUdBLGdCQUFVLDBCQUFTLFNBQVMsOEJBQVUsU0FBUztBQUFBLElBQ2pEO0FBQUEsSUFFUSxzQkFBc0I7QUFDNUIsVUFBSSxDQUFDLEtBQUssSUFBSSxTQUFVO0FBR3hCLFdBQUssSUFBSSxTQUFTLFVBQVUsT0FBTyxhQUFhLGVBQWUsZ0JBQWdCO0FBRy9FLFVBQUksS0FBSyxhQUFhO0FBQ3BCLGFBQUssSUFBSSxTQUFTLFVBQVUsSUFBSSxnQkFBZ0I7QUFBQSxNQUNsRCxXQUFXLEtBQUssVUFBVTtBQUN4QixhQUFLLElBQUksU0FBUyxVQUFVLElBQUksYUFBYTtBQUFBLE1BQy9DLE9BQU87QUFDTCxhQUFLLElBQUksU0FBUyxVQUFVLElBQUksV0FBVztBQUFBLE1BQzdDO0FBQUEsSUFDRjtBQUFBLElBRVEsYUFBYSxhQUFxQjtBQUN4QyxVQUFJLENBQUMsS0FBSyxJQUFJLFNBQVU7QUFJeEIsWUFBTSxjQUFjLEtBQUssSUFBSSxHQUFHLEtBQUssSUFBSSxJQUFJLEtBQUssTUFBTSxjQUFjLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFHOUUsWUFBTSxnQkFBZ0IsS0FBSyxJQUFJLFNBQVMsaUJBQWlCLGFBQWE7QUFDdEUsWUFBTSxlQUFlLGNBQWM7QUFHbkMsVUFBSSxpQkFBaUIsWUFBYTtBQUdsQyxVQUFJLGVBQWUsYUFBYTtBQUM5QixjQUFNLFFBQVEsY0FBYztBQUM1QixpQkFBUyxJQUFJLEdBQUcsSUFBSSxPQUFPLEtBQUs7QUFDOUIsZ0JBQU0sUUFBUSxTQUFTLGNBQWMsTUFBTTtBQUMzQyxnQkFBTSxZQUFZO0FBR2xCLGdCQUFNLFlBQVk7QUFBQSxZQUNoQixFQUFFLEtBQUssT0FBTyxNQUFNLE9BQU8sT0FBTyxNQUFNLE9BQU8sRUFBRTtBQUFBLFlBQ2pELEVBQUUsUUFBUSxPQUFPLE9BQU8sT0FBTyxPQUFPLE1BQU0sT0FBTyxLQUFLO0FBQUEsWUFDeEQsRUFBRSxLQUFLLE9BQU8sT0FBTyxPQUFPLE9BQU8sTUFBTSxPQUFPLElBQUk7QUFBQSxZQUNwRCxFQUFFLEtBQUssT0FBTyxNQUFNLE9BQU8sT0FBTyxNQUFNLE9BQU8sS0FBSztBQUFBLFlBQ3BELEVBQUUsUUFBUSxPQUFPLE1BQU0sT0FBTyxPQUFPLE1BQU0sT0FBTyxLQUFLO0FBQUEsWUFDdkQsRUFBRSxLQUFLLE9BQU8sT0FBTyxPQUFPLE9BQU8sTUFBTSxPQUFPLEtBQUs7QUFBQSxZQUNyRCxFQUFFLFFBQVEsT0FBTyxPQUFPLE9BQU8sT0FBTyxNQUFNLE9BQU8sS0FBSztBQUFBLFlBQ3hELEVBQUUsS0FBSyxPQUFPLE1BQU0sT0FBTyxPQUFPLE1BQU0sT0FBTyxJQUFJO0FBQUEsWUFDbkQsRUFBRSxLQUFLLE9BQU8sT0FBTyxPQUFPLE9BQU8sTUFBTSxPQUFPLEtBQUs7QUFBQSxZQUNyRCxFQUFFLFFBQVEsT0FBTyxNQUFNLE9BQU8sT0FBTyxNQUFNLE9BQU8sSUFBSTtBQUFBLFlBQ3RELEVBQUUsS0FBSyxPQUFPLE9BQU8sT0FBTyxPQUFPLE1BQU0sT0FBTyxLQUFLO0FBQUEsWUFDckQsRUFBRSxRQUFRLE9BQU8sT0FBTyxPQUFPLE9BQU8sTUFBTSxPQUFPLEtBQUs7QUFBQSxVQUMxRDtBQUVBLGdCQUFNLFlBQVksZUFBZSxLQUFLLFVBQVU7QUFDaEQsZ0JBQU0sTUFBTSxVQUFVLFFBQVE7QUFFOUIsY0FBSSxJQUFJLElBQUssT0FBTSxNQUFNLE1BQU0sSUFBSTtBQUNuQyxjQUFJLElBQUksT0FBUSxPQUFNLE1BQU0sU0FBUyxJQUFJO0FBQ3pDLGNBQUksSUFBSSxLQUFNLE9BQU0sTUFBTSxPQUFPLElBQUk7QUFDckMsY0FBSSxJQUFJLE1BQU8sT0FBTSxNQUFNLFFBQVEsSUFBSTtBQUN2QyxnQkFBTSxNQUFNLGlCQUFpQixHQUFHLElBQUksS0FBSztBQUN6QyxnQkFBTSxNQUFNLFlBQVksU0FBUyxJQUFJLEtBQUs7QUFHMUMsZ0JBQU0sTUFBTSxVQUFVO0FBQ3RCLGVBQUssSUFBSSxTQUFTLFlBQVksS0FBSztBQUduQyxxQkFBVyxNQUFNO0FBQ2Ysa0JBQU0sTUFBTSxhQUFhO0FBQ3pCLGtCQUFNLE1BQU0sVUFBVTtBQUFBLFVBQ3hCLEdBQUcsRUFBRTtBQUFBLFFBQ1A7QUFBQSxNQUNGLFdBRVMsZUFBZSxhQUFhO0FBQ25DLGNBQU0sV0FBVyxlQUFlO0FBQ2hDLGlCQUFTLElBQUksR0FBRyxJQUFJLFVBQVUsS0FBSztBQUNqQyxnQkFBTSxZQUFZLGNBQWMsY0FBYyxTQUFTLElBQUksQ0FBQztBQUM1RCxjQUFJLFdBQVc7QUFDYixZQUFDLFVBQTBCLE1BQU0sYUFBYTtBQUM5QyxZQUFDLFVBQTBCLE1BQU0sVUFBVTtBQUMzQyx1QkFBVyxNQUFNO0FBQ2Ysd0JBQVUsT0FBTztBQUFBLFlBQ25CLEdBQUcsR0FBRztBQUFBLFVBQ1I7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUVRLGlCQUFpQjtBQUN2QixZQUFNLFNBQVMsQ0FBQyxRQUF1QixLQUFLLFlBQVk7QUFDeEQsWUFBTSxTQUFTLENBQUMsS0FBK0IsTUFBVyxPQUFlLGFBQXNCO0FBbG5Cbkc7QUFtbkJNLFlBQUksQ0FBQyxJQUFLO0FBQ1YsWUFBSSxXQUFXO0FBRWYsWUFBSSxXQUFXLElBQUksY0FBYyxPQUFPO0FBQ3hDLFlBQUksQ0FBQyxVQUFVO0FBQ2IsY0FBSSxhQUFhLFdBQVcsTUFBTSxFQUFFLE1BQU0sR0FBRyxDQUFDLEdBQUcsSUFBSSxVQUFVO0FBQUEsUUFDakUsT0FBTztBQUVMLGdCQUFNLE9BQU8sU0FBUyxjQUFjLE1BQU07QUFDMUMsZUFBSyxZQUFZLFdBQVcsTUFBTSxFQUFFLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFFL0MseUJBQVMsa0JBQVQsbUJBQXdCLGFBQWEsS0FBSyxZQUFvQjtBQUFBLFFBQ2hFO0FBR0EsY0FBTSxLQUFLLElBQUksVUFBVSxFQUFFLFFBQVEsQ0FBQyxHQUFHLFFBQVE7QUFDN0MsY0FBSSxNQUFNLEVBQUcsS0FBSSxZQUFZLENBQUM7QUFBQSxRQUNoQyxDQUFDO0FBQ0QsWUFBSSxZQUFZLFNBQVMsZUFBZSxLQUFLLENBQUM7QUFBQSxNQUNoRDtBQUVBLGFBQU8sS0FBSyxJQUFJLE9BQU8sUUFBUSxPQUFPLE9BQU8sSUFBSSw2QkFBUyxLQUFLLFdBQVcsdUJBQVEsNEJBQVEsT0FBTyxPQUFPLEtBQUssS0FBSyxZQUFZLEtBQUssV0FBVztBQUM5SSxhQUFPLEtBQUssSUFBSSxNQUFNLFFBQVEsT0FBTyxNQUFNLElBQUksNkJBQVMsZ0JBQU0sT0FBTyxNQUFNLEtBQUssQ0FBQyxLQUFLLFFBQVE7QUFDOUYsYUFBTyxLQUFLLElBQUksU0FBUyxXQUFXLE9BQU8sU0FBUyxJQUFJLDZCQUFTLGdCQUFNLE9BQU8sU0FBUyxLQUFLLEtBQUssV0FBVyxDQUFDO0FBQzdHLGFBQU8sS0FBSyxJQUFJLFFBQVEsVUFBVSxPQUFPLFFBQVEsSUFBSSw2QkFBUyxnQkFBTSxPQUFPLFFBQVEsS0FBSyxDQUFDLEtBQUssV0FBVztBQUN6RyxhQUFPLEtBQUssSUFBSSxXQUFXLFdBQVcsT0FBTyxRQUFRLElBQUksNkJBQVMsNEJBQVEsT0FBTyxRQUFRLENBQUM7QUFBQSxJQUM1RjtBQUFBLElBRVEsaUJBQWlCLE1BQWM7QUFDckMsVUFBSSxDQUFDLEtBQUssSUFBSSxXQUFZO0FBQzFCLFdBQUssSUFBSSxXQUFXLGNBQWM7QUFBQSxJQUNwQztBQUFBLElBRVEsU0FBUyxLQUFhO0FBcHBCaEM7QUFxcEJJLFVBQUksR0FBQyxVQUFLLFFBQUwsbUJBQVUsUUFBUTtBQUN2QixZQUFNLE9BQU8sU0FBUyxjQUFjLEtBQUs7QUFDekMsWUFBTSxNQUFNLG9CQUFJLEtBQUs7QUFDckIsWUFBTSxLQUFLLE9BQU8sSUFBSSxTQUFTLENBQUMsRUFBRSxTQUFTLEdBQUUsR0FBRztBQUNoRCxZQUFNLEtBQUssT0FBTyxJQUFJLFdBQVcsQ0FBQyxFQUFFLFNBQVMsR0FBRSxHQUFHO0FBQ2xELFlBQU0sS0FBSyxPQUFPLElBQUksV0FBVyxDQUFDLEVBQUUsU0FBUyxHQUFFLEdBQUc7QUFHbEQsVUFBSSxhQUFhO0FBQ2pCLFVBQUksSUFBSSxTQUFTLGNBQUksR0FBRztBQUN0QixzQkFBYztBQUFBLE1BQ2hCLFdBQVcsSUFBSSxTQUFTLGNBQUksS0FBSyxJQUFJLFNBQVMsY0FBSSxHQUFHO0FBQ25ELHNCQUFjO0FBQUEsTUFDaEIsV0FBVyxJQUFJLFNBQVMsY0FBSSxLQUFLLElBQUksU0FBUyxjQUFJLEdBQUc7QUFDbkQsc0JBQWM7QUFBQSxNQUNoQixPQUFPO0FBQ0wsc0JBQWM7QUFBQSxNQUNoQjtBQUVBLFdBQUssWUFBWTtBQUNqQixXQUFLLGNBQWMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxHQUFHO0FBRzdDLFdBQUssTUFBTSxVQUFVO0FBQ3JCLFdBQUssTUFBTSxZQUFZO0FBQ3ZCLFdBQUssSUFBSSxPQUFPLFFBQVEsSUFBSTtBQUc1QixpQkFBVyxNQUFNO0FBQ2YsYUFBSyxNQUFNLGFBQWE7QUFDeEIsYUFBSyxNQUFNLFVBQVU7QUFDckIsYUFBSyxNQUFNLFlBQVk7QUFBQSxNQUN6QixHQUFHLEVBQUU7QUFHTCxVQUFJLElBQUksU0FBUyxjQUFJLEdBQUc7QUFDdEIsYUFBSyxVQUFVLElBQUksT0FBTztBQUUxQixhQUFLLHNCQUFzQjtBQUFBLE1BQzdCO0FBQUEsSUFDRjtBQUFBLElBRVEsd0JBQXdCO0FBRTlCLFVBQUksS0FBSyxJQUFJLE1BQU07QUFDakIsYUFBSyxJQUFJLEtBQUssVUFBVSxJQUFJLFlBQVk7QUFDeEMsbUJBQVcsTUFBRztBQW5zQnBCO0FBbXNCdUIsNEJBQUssSUFBSSxTQUFULG1CQUFlLFVBQVUsT0FBTztBQUFBLFdBQWUsR0FBRztBQUFBLE1BQ3JFO0FBR0EsVUFBSSxLQUFLLElBQUksVUFBVTtBQUNyQixhQUFLLElBQUksU0FBUyxVQUFVLElBQUksZ0JBQWdCO0FBQ2hELG1CQUFXLE1BQUc7QUF6c0JwQjtBQXlzQnVCLDRCQUFLLElBQUksYUFBVCxtQkFBbUIsVUFBVSxPQUFPO0FBQUEsV0FBbUIsR0FBRztBQUFBLE1BQzdFO0FBQUEsSUFDRjtBQUFBLElBRVEsZ0JBQWdCO0FBQ3RCLFlBQU0sTUFBTSxLQUFLLFVBQVUsSUFBSSxLQUFLLElBQUksR0FBRyxLQUFLLFVBQVUsS0FBSyxPQUFPLElBQUk7QUFDMUUsYUFBTyxHQUFHLEtBQUssTUFBTSxNQUFNLEdBQUcsQ0FBQztBQUFBLElBQ2pDO0FBQUEsRUFDRjs7O0FDenNCTyxNQUFNLGlCQUFOLE1BQXFCO0FBQUEsSUFDMUIsTUFBTSxNQUFNLE1BQW1CO0FBQzdCLFdBQUssWUFBWTtBQUNqQixXQUFLLFlBQVksVUFBVSxXQUFXLENBQUM7QUFDdkMsWUFBTSxNQUFNLGtCQUFrQjtBQUM5QixXQUFLLFlBQVksSUFBSSxJQUFJO0FBRXpCLFlBQU0sT0FBTyxLQUFLO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsS0FtQmpCO0FBQ0QsV0FBSyxZQUFZLElBQUk7QUFFckIsWUFBTSxRQUFRLGVBQWUsRUFBRSxTQUFTO0FBQ3hDLFVBQUksTUFBTyxnQkFBZSxFQUFFLFFBQVEsS0FBSztBQUV6QyxZQUFNLE9BQU8sR0FBRyxNQUFNLE9BQU87QUFDN0IsWUFBTSxlQUFlLEdBQUcsTUFBTSxPQUFPO0FBQ3JDLFlBQU0sYUFBYSxHQUFzQixNQUFNLFVBQVU7QUFFekQsWUFBTSxhQUFhLENBQUMsV0FBb0I7QUFDdEMsZUFBTyxpQkFBaUIsWUFBWSxFQUNqQyxRQUFRLENBQUMsT0FBTztBQUNmLGdCQUFNLE9BQVEsR0FBbUIsYUFBYSxVQUFVO0FBQ3hELGNBQUk7QUFBRSxlQUFHLFlBQVksV0FBVyxNQUFNLEVBQUUsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUFBLFVBQUcsU0FBUTtBQUFBLFVBQUM7QUFBQSxRQUNqRSxDQUFDO0FBQUEsTUFDTDtBQUNBLGlCQUFXLElBQUk7QUFFZixZQUFNLFlBQVksQ0FBQyxNQUFXLFFBQXlFO0FBQ3JHLGNBQU0sSUFBSyxRQUFRLElBQUksVUFBVSxJQUFJLFNBQVUsS0FBSztBQUNwRCxjQUFNLFFBQVEsT0FBTyxLQUFLLEtBQUssS0FBSztBQUNwQyxZQUFJLE9BQU8sTUFBTSxVQUFVO0FBQ3pCLGdCQUFNLElBQUksRUFBRSxZQUFZO0FBQ3hCLGNBQUksQ0FBQyxhQUFZLFFBQU8sUUFBTyxRQUFRLEVBQUUsU0FBUyxDQUFDLEdBQUc7QUFDcEQsbUJBQU8sRUFBRSxLQUFLLEdBQVUsTUFBTSxNQUFNLGNBQWMsaUJBQU8sTUFBTSxTQUFTLGlCQUFPLE1BQU0sU0FBUyxpQkFBTyxlQUFLO0FBQUEsVUFDNUc7QUFBQSxRQUNGO0FBQ0EsWUFBSSxTQUFTLEdBQUksUUFBTyxFQUFFLEtBQUssYUFBYSxNQUFNLGVBQUs7QUFDdkQsWUFBSSxTQUFTLEVBQUcsUUFBTyxFQUFFLEtBQUssUUFBUSxNQUFNLGVBQUs7QUFDakQsWUFBSSxTQUFTLEVBQUcsUUFBTyxFQUFFLEtBQUssUUFBUSxNQUFNLGVBQUs7QUFDakQsZUFBTyxFQUFFLEtBQUssVUFBVSxNQUFNLGVBQUs7QUFBQSxNQUNyQztBQUVBLFlBQU0sYUFBYSxDQUFDLE9BQWU7QUFDakMsWUFBSTtBQUFFLGlCQUFPLElBQUksS0FBSyxFQUFFLEVBQUUsZUFBZTtBQUFBLFFBQUcsU0FBUTtBQUFFLGlCQUFPLEtBQUs7QUFBQSxRQUFJO0FBQUEsTUFDeEU7QUFFQSxZQUFNLE9BQU8sWUFBWTtBQUN2QixtQkFBVyxXQUFXO0FBQ3RCLG1CQUFXLFlBQVk7QUFDdkIsbUJBQVcsVUFBVTtBQUNyQixjQUFNLElBQUksT0FBTztBQUNqQixhQUFLLFlBQVk7QUFDakIsaUJBQVMsSUFBSSxHQUFHLElBQUksR0FBRyxJQUFLLE1BQUssWUFBWSxLQUFLLDhCQUE4QixDQUFDO0FBQ2pGLFlBQUk7QUFDRixnQkFBTSxDQUFDLE1BQU0sSUFBSSxJQUFJLE1BQU0sUUFBUSxJQUFJO0FBQUEsWUFDckMsZUFBZSxFQUFFLFFBQTBCLFFBQVE7QUFBQSxZQUNuRCxlQUFlLEVBQUUsUUFBOEIsa0JBQWtCLEVBQUUsTUFBTSxPQUFPLEVBQUUsV0FBVyxDQUFDLEVBQUUsRUFBRTtBQUFBLFVBQ3BHLENBQUM7QUFDRCxnQkFBTSxVQUErQixDQUFDO0FBQ3RDLHFCQUFXLEtBQU0sS0FBSyxhQUFhLENBQUMsRUFBSSxTQUFRLEVBQUUsRUFBRSxJQUFJO0FBQ3hELGVBQUssWUFBWTtBQUNqQixjQUFJLENBQUMsS0FBSyxNQUFNLFFBQVE7QUFDdEIsaUJBQUssWUFBWSxLQUFLLHlKQUFxRCxDQUFDO0FBQUEsVUFDOUU7QUFDQSxxQkFBVyxRQUFRLEtBQUssT0FBTztBQUM3QixrQkFBTSxNQUFNLFFBQVEsS0FBSyxVQUFVO0FBQ25DLGtCQUFNLFNBQVMsVUFBVSxNQUFNLEdBQUc7QUFDbEMsa0JBQU0sT0FBUSxRQUFRLElBQUksUUFBUSxJQUFJLE9BQVEsS0FBSztBQUVuRCxrQkFBTSxNQUFNLEtBQUs7QUFBQSwrQ0FFYixPQUFPLFFBQVEsY0FBYyw2QkFBNkIsT0FBTyxRQUFRLFNBQVMsd0JBQXdCLE9BQU8sUUFBUSxTQUFTLHdCQUF3Qix1QkFDNUosa0JBQWtCLE9BQU8sR0FBRztBQUFBO0FBQUE7QUFBQTtBQUFBLDZJQUlxRyxJQUFJO0FBQUEsZ0RBQ2pHLE9BQU8sR0FBRyxZQUFZLE9BQU8sSUFBSTtBQUFBLHNCQUMzRCxLQUFLLGFBQWEsaURBQWtDLEVBQUU7QUFBQSxzQkFDdEQsS0FBSyxXQUFXLGlEQUFrQyxFQUFFO0FBQUE7QUFBQTtBQUFBLDRDQUd4QyxLQUFLLEtBQUs7QUFBQSxzREFDQSxLQUFLLEVBQUU7QUFBQSx1QkFDN0IsMkJBQUssWUFBVyxzQkFBc0IsSUFBSSxRQUFRLFlBQVksRUFBRTtBQUFBO0FBQUE7QUFBQTtBQUFBLHVDQUkvQyxLQUFLLGFBQWEsYUFBYSxTQUFTLGVBQWUsS0FBSyxhQUFhLFlBQVksT0FBTyxjQUFjLEtBQUssRUFBRSxxQkFBcUIsS0FBSyxhQUFhLE1BQU0sUUFBUSxZQUFZLEtBQUssYUFBYSxpQkFBTyxjQUFJO0FBQUEsZ0ZBQ3RLLEtBQUssRUFBRSx5QkFBZSxLQUFLLFFBQVEsRUFBRSwrREFBMkMsS0FBSyxRQUFRLEVBQUU7QUFBQSw2RUFDbEcsS0FBSyxFQUFFO0FBQUE7QUFBQTtBQUFBLDZDQUd2QyxLQUFLLEVBQUU7QUFBQTtBQUFBLFdBRXpDO0FBQ0QsdUJBQVcsR0FBRztBQUNkLGdCQUFJLGlCQUFpQixTQUFTLE9BQU8sT0FBTztBQUUxQyxvQkFBTSxNQUFPLEdBQUcsT0FBdUIsUUFBUSxRQUFRO0FBQ3ZELGtCQUFJLENBQUMsSUFBSztBQUVWLG9CQUFNLEtBQUssSUFBSSxhQUFhLFNBQVM7QUFDckMsb0JBQU0sTUFBTSxJQUFJLGFBQWEsVUFBVTtBQUN2QyxrQkFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFLO0FBR2pCLGtCQUFJLElBQUksWUFBWSxRQUFRLFNBQVU7QUFFdEMsa0JBQUksUUFBUSxVQUFVO0FBQ3BCLHNCQUFNLE1BQU0sSUFBSSxjQUFjLE9BQU8sRUFBRSxFQUFFO0FBQ3pDLG9CQUFJLENBQUMsSUFBSztBQUNWLG9CQUFJLENBQUMsSUFBSSxjQUFjLEdBQUc7QUFDeEIsc0JBQUksWUFBWTtBQUNoQixzQkFBSSxTQUFTO0FBQ2Isc0JBQUk7QUFDRiwwQkFBTSxNQUFNLE1BQU0sZUFBZSxFQUFFLFFBQW1FLHNCQUFzQixFQUFFLEVBQUU7QUFDaEksMEJBQU0sT0FBTyxNQUFNLFFBQVEsSUFBSSxJQUFJLElBQUksSUFBSSxPQUFPLENBQUM7QUFDbkQsd0JBQUksWUFBWTtBQUNoQix3QkFBSSxDQUFDLEtBQUssUUFBUTtBQUNoQiwwQkFBSSxZQUFZO0FBQUEsb0JBQ2xCLE9BQU87QUFDTCxpQ0FBVyxPQUFPLE1BQU07QUFDdEIsOEJBQU0sT0FBTyxLQUFLO0FBQUE7QUFBQTtBQUFBLDhDQUdNLFdBQVcsSUFBSSxJQUFJLENBQUM7QUFBQSwrQ0FDbkIsSUFBSSxRQUFRLElBQUksUUFBUSxJQUFJLFFBQVEsTUFBSyxNQUFNLENBQUM7QUFBQTtBQUFBLHVCQUV4RTtBQUNELDRCQUFJLFlBQVksSUFBSTtBQUFBLHNCQUN0QjtBQUFBLG9CQUNGO0FBQUEsa0JBQ0YsU0FBUTtBQUNOLHdCQUFJLFlBQVk7QUFDaEIsd0JBQUksWUFBWSxLQUFLO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLG1CQU1wQixDQUFDO0FBQUEsa0JBQ0o7QUFBQSxnQkFDRixPQUFPO0FBQ0wsc0JBQUksU0FBUyxDQUFDLElBQUk7QUFBQSxnQkFDcEI7QUFDQTtBQUFBLGNBQ0Y7QUFHQSxrQkFBSTtBQUNGLG9CQUFJLFdBQVc7QUFDZixzQkFBTUMsZ0JBQWUsSUFBSTtBQUV6QixvQkFBSSxRQUFRLFNBQVM7QUFDbkIsc0JBQUksWUFBWTtBQUNoQiw2QkFBVyxHQUFHO0FBQ2Qsd0JBQU0sZUFBZSxFQUFFLFFBQVEsZ0JBQWdCLEVBQUUsUUFBUSxRQUFRLE1BQU0sS0FBSyxVQUFVLEVBQUUsUUFBUSxHQUFHLENBQUMsRUFBRSxDQUFDO0FBQ3ZHLDRCQUFVLDRCQUFRLFNBQVM7QUFBQSxnQkFDN0IsV0FBVyxRQUFRLFdBQVc7QUFDNUIsc0JBQUksWUFBWTtBQUNoQiw2QkFBVyxHQUFHO0FBQ2Qsd0JBQU0sZUFBZSxFQUFFLFFBQVEsa0JBQWtCLEVBQUUsUUFBUSxRQUFRLE1BQU0sS0FBSyxVQUFVLEVBQUUsUUFBUSxHQUFHLENBQUMsRUFBRSxDQUFDO0FBQ3pHLDRCQUFVLDRCQUFRLFNBQVM7QUFBQSxnQkFDN0IsV0FBVyxRQUFRLFdBQVc7QUFDNUIsc0JBQUksWUFBWTtBQUNoQiw2QkFBVyxHQUFHO0FBQ2Qsd0JBQU0sTUFBTSxNQUFNLGVBQWUsRUFBRSxRQUF5QyxrQkFBa0IsRUFBRSxRQUFRLFFBQVEsTUFBTSxLQUFLLFVBQVUsRUFBRSxRQUFRLEdBQUcsQ0FBQyxFQUFFLENBQUM7QUFFdEosc0JBQUksVUFBVSxJQUFJLGlCQUFpQjtBQUNuQyw2QkFBVyxNQUFNLElBQUksVUFBVSxPQUFPLGlCQUFpQixHQUFHLEdBQUk7QUFDOUQsNEJBQVUsOENBQVcsSUFBSSxLQUFLLHNCQUFPLElBQUksSUFBSSx1QkFBUSxTQUFTO0FBQUEsZ0JBQ2hFO0FBQ0Esc0JBQU0sSUFBSSxPQUFPO0FBQ2pCLHNCQUFNLEtBQUs7QUFBQSxjQUNiLFNBQVMsR0FBUTtBQUNmLDJCQUFVLHVCQUFHLFlBQVcsNEJBQVEsT0FBTztBQUV2QyxvQkFBSSxZQUFZO0FBQ2hCLG9CQUFJLFdBQVc7QUFBQSxjQUNqQjtBQUFBLFlBQ0YsQ0FBQztBQUNELGlCQUFLLFlBQVksR0FBRztBQUFBLFVBQ3RCO0FBRUEsdUJBQWEsWUFBWTtBQUN6QixxQkFBVyxPQUFRLEtBQUssYUFBYSxDQUFDLEdBQUk7QUFDeEMsa0JBQU0sTUFBTSxLQUFLLGtDQUFrQyxJQUFJLFFBQVEsSUFBSSxFQUFFLGtCQUFlLElBQUksWUFBWSwwQkFBTSxRQUFRO0FBQ2xILHlCQUFhLFlBQVksR0FBRztBQUFBLFVBQzlCO0FBQUEsUUFDRixTQUFTLEdBQVE7QUFDZixxQkFBVSx1QkFBRyxZQUFXLHdDQUFVLE9BQU87QUFDekMsZUFBSyxZQUFZO0FBQUEsUUFDbkIsVUFBRTtBQUNBLHFCQUFXLFdBQVc7QUFDdEIscUJBQVcsWUFBWTtBQUN2QixxQkFBVyxVQUFVO0FBQUEsUUFDdkI7QUFBQSxNQUNGO0FBRUEsaUJBQVcsVUFBVSxNQUFNLEtBQUs7QUFDaEMsWUFBTSxLQUFLO0FBQUEsSUFDYjtBQUFBLEVBQ0Y7OztBQzdOTyxNQUFNLGVBQU4sTUFBbUI7QUFBQSxJQUFuQjtBQUNMLDBCQUFRLGFBQWdDO0FBQUE7QUFBQSxJQUV4QyxNQUFNLE1BQW1CO0FBQ3ZCLFdBQUssWUFBWTtBQUNqQixXQUFLLFlBQVksVUFBVSxTQUFTLENBQUM7QUFDckMsWUFBTSxNQUFNLGtCQUFrQjtBQUM5QixXQUFLLFlBQVksSUFBSSxJQUFJO0FBRXpCLFlBQU0sT0FBTyxLQUFLO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxLQVdqQjtBQUNELFdBQUssWUFBWSxJQUFJO0FBRXJCLFlBQU0sUUFBUSxlQUFlLEVBQUUsU0FBUztBQUN4QyxVQUFJLE1BQU8sZ0JBQWUsRUFBRSxRQUFRLEtBQUs7QUFFekMscUJBQWUsRUFBRSxHQUFHLG9CQUFvQixDQUFDLFFBQVE7QUFDL0Msa0JBQVUsd0NBQVUsSUFBSSxRQUFRLHNCQUFPLElBQUksSUFBSSxFQUFFO0FBQ2pELGFBQUssSUFBSSxVQUFLLElBQUksUUFBUSxtQ0FBVSxJQUFJLElBQUksRUFBRTtBQUFBLE1BQ2hELENBQUM7QUFDRCxXQUFLLFlBQVksR0FBRyxNQUFNLFNBQVM7QUFFbkMsWUFBTSxPQUFPLEdBQUcsTUFBTSxPQUFPO0FBQzdCLFlBQU0sYUFBYSxHQUFzQixNQUFNLFVBQVU7QUFDekQsWUFBTSxhQUFhLENBQUMsV0FBb0I7QUFDdEMsZUFBTyxpQkFBaUIsWUFBWSxFQUNqQyxRQUFRLENBQUMsT0FBTztBQUNmLGdCQUFNLE9BQVEsR0FBbUIsYUFBYSxVQUFVO0FBQ3hELGNBQUk7QUFBRSxlQUFHLFlBQVksV0FBVyxNQUFNLEVBQUUsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUFBLFVBQUcsU0FBUTtBQUFBLFVBQUM7QUFBQSxRQUNqRSxDQUFDO0FBQUEsTUFDTDtBQUNBLGlCQUFXLElBQUk7QUFFZixZQUFNLE9BQU8sWUFBWTtBQUN2QixtQkFBVyxXQUFXO0FBQ3RCLG1CQUFXLFlBQVk7QUFDdkIsbUJBQVcsVUFBVTtBQUNyQixjQUFNLElBQUksT0FBTztBQUNqQixhQUFLLFlBQVk7QUFDakIsaUJBQVMsSUFBSSxHQUFHLElBQUksR0FBRyxJQUFLLE1BQUssWUFBWSxLQUFLLDhCQUE4QixDQUFDO0FBQ2pGLFlBQUk7QUFDRixnQkFBTSxPQUFPLE1BQU0sZUFBZSxFQUFFLFFBQTRCLGtCQUFrQjtBQUNsRixlQUFLLFlBQVk7QUFDakIsY0FBSSxDQUFDLEtBQUssUUFBUSxRQUFRO0FBQ3hCLGlCQUFLLFlBQVksS0FBSywrR0FBOEMsQ0FBQztBQUFBLFVBQ3ZFO0FBQ0EscUJBQVcsVUFBVSxLQUFLLFNBQVM7QUFDakMsa0JBQU0sTUFBTSxLQUFLO0FBQUE7QUFBQTtBQUFBLCtHQUdvRixPQUFPLFlBQVksT0FBTyxFQUFFO0FBQUEsOERBQzVGLE9BQU8sR0FBRztBQUFBO0FBQUE7QUFBQSx3REFHRCxPQUFPLEVBQUU7QUFBQTtBQUFBO0FBQUEsV0FHdEQ7QUFDRCx1QkFBVyxHQUFHO0FBQ2QsZ0JBQUksaUJBQWlCLFNBQVMsT0FBTyxPQUFPO0FBQzFDLG9CQUFNLEtBQUssR0FBRztBQUNkLG9CQUFNLEtBQUssR0FBRyxhQUFhLFNBQVM7QUFDcEMsa0JBQUksQ0FBQyxHQUFJO0FBQ1Qsb0JBQU0sTUFBTSxHQUFHLFFBQVEsUUFBUTtBQUMvQixrQkFBSSxDQUFDLElBQUs7QUFFVixrQkFBSSxXQUFXO0FBQ2Ysb0JBQU1DLGdCQUFlLElBQUk7QUFDekIsa0JBQUksWUFBWTtBQUNoQix5QkFBVyxHQUFHO0FBRWQsa0JBQUksZ0JBQWdCO0FBQ3BCLGtCQUFJO0FBQ0Ysc0JBQU0sTUFBTSxNQUFNLGVBQWUsRUFBRSxRQUFtRCxZQUFZLEVBQUUsSUFBSSxFQUFFLFFBQVEsT0FBTyxDQUFDO0FBQzFILG9CQUFJLElBQUksU0FBUztBQUNmLHVCQUFLLElBQUksNEJBQVEsRUFBRSxzQkFBTyxJQUFJLFdBQVcsRUFBRTtBQUMzQyw0QkFBVSw4Q0FBVyxJQUFJLFdBQVcsaUJBQU8sU0FBUztBQUNwRCxrQ0FBZ0I7QUFBQSxnQkFDbEIsT0FBTztBQUNMLHVCQUFLLElBQUksZ0JBQU0sRUFBRSxlQUFLO0FBQ3RCLDRCQUFVLDRCQUFRLE1BQU07QUFBQSxnQkFDMUI7QUFDQSxzQkFBTSxJQUFJLE9BQU87QUFBQSxjQUNuQixTQUFTLEdBQVE7QUFDZixzQkFBTSxXQUFVLHVCQUFHLFlBQVc7QUFDOUIscUJBQUssSUFBSSxpQ0FBUSxPQUFPLEVBQUU7QUFDMUIsb0JBQUksUUFBUSxTQUFTLGNBQUksR0FBRztBQUMxQiw0QkFBVSxTQUFTLE1BQU07QUFBQSxnQkFDM0IsT0FBTztBQUNMLDRCQUFVLFNBQVMsT0FBTztBQUFBLGdCQUM1QjtBQUVBLG9CQUFJLFlBQVlBO0FBQ2hCLDJCQUFXLEdBQUc7QUFBQSxjQUNoQixVQUFFO0FBQ0Esb0JBQUksV0FBVztBQUVmLG9CQUFJLGVBQWU7QUFDakIsd0JBQU0sS0FBSztBQUFBLGdCQUNiO0FBQUEsY0FDRjtBQUFBLFlBQ0YsQ0FBQztBQUNELGlCQUFLLFlBQVksR0FBRztBQUFBLFVBQ3RCO0FBQUEsUUFDRixTQUFTLEdBQVE7QUFDZixxQkFBVSx1QkFBRyxZQUFXLG9EQUFZLE9BQU87QUFDM0MsZUFBSyxZQUFZO0FBQUEsUUFDbkIsVUFBRTtBQUNBLHFCQUFXLFdBQVc7QUFDdEIscUJBQVcsWUFBWTtBQUN2QixxQkFBVyxVQUFVO0FBQUEsUUFDdkI7QUFBQSxNQUNGO0FBRUEsaUJBQVcsVUFBVSxNQUFNLEtBQUs7QUFDaEMsV0FBSztBQUFBLElBQ1A7QUFBQSxJQUVRLElBQUksS0FBYTtBQUN2QixVQUFJLENBQUMsS0FBSyxVQUFXO0FBQ3JCLFlBQU0sT0FBTyxTQUFTLGNBQWMsS0FBSztBQUN6QyxXQUFLLGNBQWMsS0FBSSxvQkFBSSxLQUFLLEdBQUUsbUJBQW1CLENBQUMsS0FBSyxHQUFHO0FBQzlELFdBQUssVUFBVSxRQUFRLElBQUk7QUFBQSxJQUM3QjtBQUFBLEVBQ0Y7OztBQzFITyxNQUFNLGdCQUFOLE1BQW9CO0FBQUEsSUFBcEI7QUFDTCwwQkFBUSxnQkFBOEI7QUFDdEMsMEJBQVEsYUFBZ0UsQ0FBQztBQUN6RSwwQkFBUSxhQUFtQixDQUFDO0FBQUE7QUFBQSxJQUU1QixNQUFNLE1BQU0sTUFBbUI7QUFDN0IsV0FBSyxXQUFXO0FBQ2hCLFdBQUssWUFBWTtBQUVqQixZQUFNLE1BQU0sVUFBVSxVQUFVO0FBQ2hDLFlBQU0sTUFBTSxrQkFBa0I7QUFDOUIsWUFBTSxPQUFPLEtBQUs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxLQXVEakI7QUFFRCxXQUFLLFlBQVksR0FBRztBQUNwQixXQUFLLFlBQVksSUFBSSxJQUFJO0FBQ3pCLFdBQUssWUFBWSxJQUFJO0FBRXJCLFlBQU0sUUFBUSxlQUFlLEVBQUUsU0FBUztBQUN4QyxVQUFJLE1BQU8sZ0JBQWUsRUFBRSxRQUFRLEtBQUs7QUFDekMsWUFBTSxLQUFLLFlBQVksRUFBRSxXQUFXO0FBRXBDLFlBQU0sT0FBTyxHQUFHLE1BQU0sT0FBTztBQUM3QixZQUFNLE9BQU8sR0FBZ0IsTUFBTSxPQUFPO0FBQzFDLFlBQU0sU0FBUyxHQUFzQixNQUFNLE1BQU07QUFDakQsWUFBTSxXQUFXLEdBQXFCLE1BQU0sUUFBUTtBQUNwRCxZQUFNLFlBQVksR0FBcUIsTUFBTSxTQUFTO0FBQ3RELFlBQU0sV0FBVyxHQUFzQixNQUFNLFdBQVc7QUFDeEQsWUFBTSxXQUFXLEdBQXNCLE1BQU0sT0FBTztBQUNwRCxZQUFNLFlBQVksR0FBcUIsTUFBTSxTQUFTO0FBQ3RELFlBQU0sWUFBWSxHQUFzQixNQUFNLFlBQVk7QUFDMUQsWUFBTSxTQUFTLEdBQWdCLE1BQU0sWUFBWTtBQUNqRCxZQUFNLFdBQVcsR0FBc0IsTUFBTSxRQUFRO0FBQ3JELFlBQU0sWUFBWSxHQUFzQixNQUFNLFNBQVM7QUFDdkQsWUFBTSxnQkFBZ0IsR0FBcUIsTUFBTSxLQUFLO0FBQ3RELFlBQU0sZ0JBQWdCLEtBQUssY0FBYyxnQkFBZ0I7QUFDekQsWUFBTSxhQUFhLEdBQXNCLE1BQU0sVUFBVTtBQUV6RCxZQUFNLGFBQWEsQ0FBQyxXQUFvQjtBQUN0QyxlQUFPLGlCQUFpQixZQUFZLEVBQ2pDLFFBQVEsQ0FBQyxPQUFPO0FBQ2YsZ0JBQU0sT0FBUSxHQUFtQixhQUFhLFVBQVU7QUFDeEQsY0FBSTtBQUFFLGVBQUcsWUFBWSxXQUFXLE1BQU0sRUFBRSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQUEsVUFBRyxTQUFRO0FBQUEsVUFBQztBQUFBLFFBQ2pFLENBQUM7QUFBQSxNQUNMO0FBQ0EsaUJBQVcsSUFBSTtBQUVmLFVBQUksVUFBVSxvQkFBSSxJQUFZO0FBQzlCLFVBQUksYUFBYTtBQUVqQixZQUFNLE1BQU0sQ0FBQyxZQUFvQjtBQUMvQixhQUFLLGNBQWM7QUFBQSxNQUNyQjtBQUVBLFlBQU0sd0JBQXdCLE1BQU07QUFDbEMsZUFBTyxZQUFZO0FBQ25CLGlCQUFTLFlBQVk7QUFDckIsY0FBTSxjQUFjLEtBQUssb0RBQWdDO0FBQ3pELGVBQU8sWUFBWSxXQUFXO0FBQzlCLGNBQU0sZUFBZSxLQUFLLG9EQUFnQztBQUMxRCxpQkFBUyxZQUFZLFlBQVk7QUFDakMsbUJBQVcsT0FBTyxLQUFLLFdBQVc7QUFDaEMsZ0JBQU0sU0FBUyxTQUFTLGNBQWMsUUFBUTtBQUM5QyxpQkFBTyxRQUFRLElBQUk7QUFDbkIsaUJBQU8sY0FBYyxJQUFJLE9BQU8sR0FBRyxJQUFJLElBQUksS0FBSyxJQUFJLEVBQUUsTUFBTSxJQUFJO0FBQ2hFLGlCQUFPLFlBQVksTUFBTTtBQUN6QixnQkFBTSxVQUFVLE9BQU8sVUFBVSxJQUFJO0FBQ3JDLG1CQUFTLFlBQVksT0FBTztBQUFBLFFBQzlCO0FBQUEsTUFDRjtBQUVBLFlBQU0sa0JBQWtCLE1BQU07QUFDNUIsaUJBQVMsWUFBWTtBQUNyQixlQUFPLFlBQVk7QUFDbkIsY0FBTSxnQkFBZ0IsS0FBSyw0RUFBb0M7QUFDL0QsaUJBQVMsWUFBWSxhQUFhO0FBQ2xDLGNBQU0sWUFBWSxLQUFLLFVBQVUsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLGNBQWMsQ0FBQyxLQUFLLFFBQVE7QUFDcEYsWUFBSSxDQUFDLFVBQVUsUUFBUTtBQUNyQixpQkFBTyxjQUFjO0FBQ3JCO0FBQUEsUUFDRjtBQUNBLG1CQUFXLFFBQVEsV0FBVztBQUM1QixnQkFBTSxTQUFTLFNBQVMsY0FBYyxRQUFRO0FBQzlDLGlCQUFPLFFBQVEsS0FBSztBQUNwQixpQkFBTyxjQUFjLEdBQUcsS0FBSyxFQUFFLFNBQU0sS0FBSyxVQUFVLFlBQVMsS0FBSyxLQUFLO0FBQ3ZFLG1CQUFTLFlBQVksTUFBTTtBQUUzQixnQkFBTSxPQUFPLEtBQUssK0VBQStFLEtBQUssRUFBRSxLQUFLLEtBQUssRUFBRSxLQUFLLEtBQUssVUFBVSxZQUFZO0FBQ3BKLGVBQUssVUFBVSxNQUFNO0FBQ25CLHFCQUFTLFFBQVEsS0FBSztBQUN0QixnQkFBSSw4Q0FBVyxLQUFLLEVBQUUsRUFBRTtBQUFBLFVBQzFCO0FBQ0EsaUJBQU8sWUFBWSxJQUFJO0FBQUEsUUFDekI7QUFBQSxNQUNGO0FBRUEsWUFBTSxlQUFlLFlBQVk7QUFDL0IsWUFBSTtBQUNGLGdCQUFNLENBQUMsTUFBTSxLQUFLLElBQUksTUFBTSxRQUFRLElBQUk7QUFBQSxZQUN0QyxlQUFlLEVBQUUsUUFBOEIsa0JBQWtCO0FBQUEsWUFDakUsZUFBZSxFQUFFLFFBQTBCLFFBQVE7QUFBQSxVQUNyRCxDQUFDO0FBQ0QsZUFBSyxZQUFZLEtBQUssYUFBYSxDQUFDO0FBQ3BDLGVBQUssWUFBWSxNQUFNLFNBQVMsQ0FBQztBQUNqQyxnQ0FBc0I7QUFDdEIsMEJBQWdCO0FBQUEsUUFDbEIsU0FBUyxHQUFRO0FBQ2YsZUFBSSx1QkFBRyxZQUFXLG1EQUFXO0FBQUEsUUFDL0I7QUFBQSxNQUNGO0FBRUEsWUFBTSxVQUFVLE9BQU8sT0FBNEIsQ0FBQyxNQUFNO0FBQ3hELFlBQUksV0FBWTtBQUNoQixxQkFBYTtBQUNiLFlBQUksQ0FBQyxLQUFLLE9BQU87QUFBRSxxQkFBVyxZQUFZO0FBQXdDLHFCQUFXLFVBQVU7QUFBQSxRQUFHO0FBQzFHLG1CQUFXLFdBQVc7QUFDdEIsWUFBSTtBQUNGLGdCQUFNLFFBQVEsU0FBUztBQUN2QixnQkFBTSxPQUFPLFVBQVU7QUFDdkIsZ0JBQU0sV0FBVyxjQUFjO0FBQy9CLGdCQUFNLFNBQVMsSUFBSSxnQkFBZ0I7QUFDbkMsaUJBQU8sSUFBSSxRQUFRLElBQUk7QUFDdkIsaUJBQU8sSUFBSSxvQkFBb0IsU0FBUyxFQUFFO0FBQzFDLGNBQUksQ0FBQyxLQUFLLE9BQU87QUFDZixpQkFBSyxZQUFZO0FBQ2pCLHFCQUFTLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSyxNQUFLLFlBQVksS0FBSyw4QkFBOEIsQ0FBQztBQUFBLFVBQ25GO0FBQ0EsZ0JBQU0sT0FBTyxNQUFNLGVBQWUsRUFBRSxRQUE2QixvQkFBb0IsT0FBTyxTQUFTLENBQUMsRUFBRTtBQUN4RyxnQkFBTSxTQUFTLG9CQUFJLElBQVk7QUFDL0IsZUFBSyxZQUFZO0FBQ2pCLGdCQUFNLFNBQVMsS0FBSyxVQUFVLENBQUM7QUFDL0IsY0FBSSxDQUFDLE9BQU8sUUFBUTtBQUNsQixpQkFBSyxZQUFZLEtBQUssMkVBQXVELENBQUM7QUFBQSxVQUNoRjtBQUNBLHFCQUFXLFNBQVMsUUFBUTtBQUMxQixnQkFBSSxZQUFZLE1BQU0sTUFBTSxXQUFXLEdBQUcsR0FBSTtBQUM5QyxtQkFBTyxJQUFJLE1BQU0sRUFBRTtBQUNuQixrQkFBTSxTQUFTLE1BQU0sTUFBTSxXQUFXLEdBQUc7QUFDekMsa0JBQU0sUUFBUSxhQUFhLE1BQU0sU0FBUyxRQUFRLG1CQUFtQixpQkFBaUI7QUFDdEYsa0JBQU0sTUFBTSxLQUFLO0FBQUEsMEJBQ0QsS0FBSztBQUFBO0FBQUE7QUFBQSw0QkFHSCxNQUFNLFNBQVMsUUFBUSxpQkFBTyxjQUFJO0FBQUEsb0JBQzFDLE1BQU0sa0JBQWtCLEVBQUU7QUFBQSxvQkFDMUIsU0FBUywyQ0FBaUMsRUFBRTtBQUFBO0FBQUE7QUFBQSxrQ0FHeEMsTUFBTSxLQUFLLHVCQUFVLE1BQU0sTUFBTTtBQUFBLG9CQUNyQyxNQUFNLGlCQUFpQixzQkFBc0IsTUFBTSxjQUFjLFlBQVksRUFBRTtBQUFBLHVDQUM1RCxNQUFNLEVBQUU7QUFBQTtBQUFBO0FBQUE7QUFBQSxrQkFJN0IsU0FBUywwQ0FBMEMsTUFBTSxFQUFFLDBEQUFnRCxFQUFFO0FBQUE7QUFBQTtBQUFBLFdBR3BIO0FBQ0QsdUJBQVcsR0FBRztBQUNkLGdCQUFJLENBQUMsUUFBUSxJQUFJLE1BQU0sRUFBRSxFQUFHLEtBQUksVUFBVSxJQUFJLE9BQU87QUFDckQsZ0JBQUksaUJBQWlCLFNBQVMsT0FBTyxPQUFPO0FBQzFDLG9CQUFNLFNBQVMsR0FBRztBQUNsQixvQkFBTSxLQUFLLE9BQU8sYUFBYSxTQUFTO0FBQ3hDLGtCQUFJLENBQUMsR0FBSTtBQUNULG9CQUFNLE1BQU0sT0FBTyxRQUFRLFFBQVE7QUFDbkMsa0JBQUksQ0FBQyxJQUFLO0FBRVYsa0JBQUk7QUFDRixvQkFBSSxXQUFXO0FBQ2Ysc0JBQU1DLGdCQUFlLElBQUk7QUFDekIsb0JBQUksWUFBWTtBQUNoQiwyQkFBVyxHQUFHO0FBRWQsc0JBQU0sZUFBZSxFQUFFLFFBQVEsb0JBQW9CLEVBQUUsSUFBSSxFQUFFLFFBQVEsU0FBUyxDQUFDO0FBQzdFLDBCQUFVLDRCQUFRLFNBQVM7QUFDM0Isc0JBQU0sUUFBUTtBQUFBLGNBQ2hCLFNBQVMsR0FBUTtBQUNmLDJCQUFVLHVCQUFHLFlBQVcsNEJBQVEsT0FBTztBQUV2QyxzQkFBTSxRQUFRO0FBQUEsY0FDaEIsVUFBRTtBQUNBLG9CQUFJLFdBQVc7QUFBQSxjQUNqQjtBQUFBLFlBQ0YsQ0FBQztBQUNELGlCQUFLLFlBQVksR0FBRztBQUFBLFVBQ3RCO0FBQ0Esb0JBQVU7QUFDVixjQUFJLENBQUMsS0FBSyxtQkFBbUI7QUFDM0IsaUJBQUssWUFBWSxLQUFLLHlHQUE0RCxDQUFDO0FBQUEsVUFDckY7QUFBQSxRQUNGLFNBQVMsR0FBUTtBQUNmLGVBQUksdUJBQUcsWUFBVyxzQ0FBUTtBQUFBLFFBQzVCLFVBQUU7QUFDQSx1QkFBYTtBQUNiLHFCQUFXLFdBQVc7QUFDdEIscUJBQVcsWUFBWTtBQUN2QixxQkFBVyxVQUFVO0FBQUEsUUFDdkI7QUFBQSxNQUNGO0FBRUEsZUFBUyxVQUFVLFlBQVk7QUFDN0IsWUFBSSxTQUFTLFNBQVU7QUFFdkIsY0FBTSxRQUFRLE9BQU8sTUFBTSxLQUFLO0FBQ2hDLGNBQU0sUUFBUSxPQUFPLFNBQVMsS0FBSztBQUNuQyxjQUFNLFNBQVMsT0FBTyxVQUFVLEtBQUs7QUFDckMsWUFBSSxDQUFDLE9BQU87QUFDVixvQkFBVSxvREFBWSxNQUFNO0FBQzVCO0FBQUEsUUFDRjtBQUNBLFlBQUksTUFBTSxLQUFLLEtBQUssTUFBTSxNQUFNLEtBQUssU0FBUyxLQUFLLFVBQVUsS0FBSyxDQUFDLE9BQU8sVUFBVSxNQUFNLEdBQUc7QUFDM0Ysb0JBQVUsNEhBQXdCLE1BQU07QUFDeEM7QUFBQSxRQUNGO0FBQ0EsWUFBSSxRQUFRLE9BQVcsU0FBUyxLQUFPO0FBQ3JDLG9CQUFVLG9HQUFvQixNQUFNO0FBQ3BDO0FBQUEsUUFDRjtBQUNBLGlCQUFTLFdBQVc7QUFDcEIsY0FBTSxrQkFBa0IsU0FBUztBQUNqQyxpQkFBUyxZQUFZO0FBQ3JCLG1CQUFXLFFBQVE7QUFFbkIsWUFBSTtBQUNGLGdCQUFNLE1BQU0sTUFBTSxlQUFlLEVBQUUsUUFBd0Isb0JBQW9CO0FBQUEsWUFDN0UsUUFBUTtBQUFBLFlBQ1IsTUFBTSxLQUFLLFVBQVUsRUFBRSxNQUFNLE9BQU8sa0JBQWtCLE9BQU8sT0FBTyxPQUFPLENBQUM7QUFBQSxVQUM5RSxDQUFDO0FBQ0Qsb0JBQVUsb0NBQVcsSUFBSSxFQUFFLEtBQUssU0FBUztBQUN6QyxjQUFJLDZCQUFTLElBQUksRUFBRSxFQUFFO0FBQ3JCLGdCQUFNLElBQUksT0FBTztBQUNqQixnQkFBTSxRQUFRO0FBQUEsUUFDaEIsU0FBUyxHQUFRO0FBQ2YscUJBQVUsdUJBQUcsWUFBVyx3Q0FBVSxPQUFPO0FBQ3pDLGVBQUksdUJBQUcsWUFBVyxzQ0FBUTtBQUFBLFFBQzVCLFVBQUU7QUFDQSxtQkFBUyxXQUFXO0FBQ3BCLG1CQUFTLFlBQVk7QUFDckIscUJBQVcsUUFBUTtBQUFBLFFBQ3JCO0FBQUEsTUFDRjtBQUVBLGdCQUFVLFVBQVUsWUFBWTtBQUM5QixZQUFJLFVBQVUsU0FBVTtBQUV4QixjQUFNLFNBQVMsU0FBUyxNQUFNLEtBQUs7QUFDbkMsY0FBTSxRQUFRLE9BQU8sVUFBVSxLQUFLO0FBQ3BDLFlBQUksQ0FBQyxRQUFRO0FBQ1gsb0JBQVUsMERBQWEsTUFBTTtBQUM3QjtBQUFBLFFBQ0Y7QUFDQSxZQUFJLE1BQU0sS0FBSyxLQUFLLFNBQVMsR0FBRztBQUM5QixvQkFBVSxvREFBWSxNQUFNO0FBQzVCO0FBQUEsUUFDRjtBQUNBLFlBQUksUUFBUSxLQUFTO0FBQ25CLG9CQUFVLGtGQUFpQixNQUFNO0FBQ2pDO0FBQUEsUUFDRjtBQUNBLGtCQUFVLFdBQVc7QUFDckIsY0FBTSxtQkFBbUIsVUFBVTtBQUNuQyxrQkFBVSxZQUFZO0FBQ3RCLG1CQUFXLFNBQVM7QUFFcEIsWUFBSTtBQUNGLGdCQUFNLE1BQU0sTUFBTSxlQUFlLEVBQUUsUUFBd0Isb0JBQW9CO0FBQUEsWUFDN0UsUUFBUTtBQUFBLFlBQ1IsTUFBTSxLQUFLLFVBQVUsRUFBRSxNQUFNLFFBQVEsa0JBQWtCLFFBQVEsTUFBTSxDQUFDO0FBQUEsVUFDeEUsQ0FBQztBQUNELG9CQUFVLG9DQUFXLElBQUksRUFBRSxLQUFLLFNBQVM7QUFDekMsY0FBSSw2QkFBUyxJQUFJLEVBQUUsRUFBRTtBQUNyQixnQkFBTSxJQUFJLE9BQU87QUFDakIsZ0JBQU0sYUFBYTtBQUNuQixnQkFBTSxRQUFRO0FBQUEsUUFDaEIsU0FBUyxHQUFRO0FBQ2YscUJBQVUsdUJBQUcsWUFBVyx3Q0FBVSxPQUFPO0FBQ3pDLGVBQUksdUJBQUcsWUFBVyxzQ0FBUTtBQUFBLFFBQzVCLFVBQUU7QUFDQSxvQkFBVSxXQUFXO0FBQ3JCLG9CQUFVLFlBQVk7QUFDdEIscUJBQVcsU0FBUztBQUFBLFFBQ3RCO0FBQUEsTUFDRjtBQUVBLGlCQUFXLFVBQVUsTUFBTSxRQUFRO0FBQ25DLGVBQVMsV0FBVyxNQUFNLFFBQVE7QUFDbEMsZ0JBQVUsV0FBVyxNQUFNLFFBQVE7QUFDbkMsb0JBQWMsV0FBVyxNQUFNO0FBQUUsWUFBSSxjQUFlLGVBQWMsVUFBVSxPQUFPLFVBQVUsY0FBYyxPQUFPO0FBQUcsZ0JBQVE7QUFBQSxNQUFHO0FBQ2hJLFVBQUksY0FBZSxlQUFjLFVBQVUsT0FBTyxVQUFVLGNBQWMsT0FBTztBQUVqRixZQUFNLFFBQVEsSUFBSSxDQUFDLElBQUksT0FBTyxHQUFHLGFBQWEsQ0FBQyxDQUFDO0FBQ2hELFlBQU0sUUFBUSxFQUFFLE9BQU8sS0FBSyxDQUFDO0FBQzdCLFdBQUssZUFBZSxPQUFPLFlBQVksTUFBTTtBQUMzQyxnQkFBUSxFQUFFLE9BQU8sS0FBSyxDQUFDLEVBQUUsTUFBTSxNQUFNO0FBQUEsUUFBQyxDQUFDO0FBQUEsTUFDekMsR0FBRyxHQUFLO0FBQUEsSUFDVjtBQUFBLElBRVEsYUFBYTtBQUNuQixVQUFJLEtBQUssaUJBQWlCLE1BQU07QUFDOUIsZUFBTyxjQUFjLEtBQUssWUFBWTtBQUN0QyxhQUFLLGVBQWU7QUFBQSxNQUN0QjtBQUFBLElBQ0Y7QUFBQSxFQUNGOzs7QUNsWE8sTUFBTSxlQUFOLE1BQW1CO0FBQUEsSUFDeEIsTUFBTSxNQUFtQjtBQUN2QixXQUFLLFlBQVk7QUFDakIsV0FBSyxZQUFZLFVBQVUsU0FBUyxDQUFDO0FBQ3JDLFlBQU0sTUFBTSxrQkFBa0I7QUFDOUIsV0FBSyxZQUFZLElBQUksSUFBSTtBQUV6QixZQUFNLE9BQU8sS0FBSztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsS0FXakI7QUFDRCxXQUFLLFlBQVksSUFBSTtBQUVyQixZQUFNLFFBQVEsZUFBZSxFQUFFLFNBQVM7QUFDeEMsVUFBSSxNQUFPLGdCQUFlLEVBQUUsUUFBUSxLQUFLO0FBRXpDLFlBQU0sUUFBUSxHQUFHLE1BQU0sS0FBSztBQUM1QixZQUFNLE9BQU8sR0FBRyxNQUFNLE9BQU87QUFDN0IsWUFBTSxhQUFhLEdBQXNCLE1BQU0sVUFBVTtBQUN6RCxZQUFNLGFBQWEsQ0FBQyxXQUFvQjtBQUN0QyxlQUFPLGlCQUFpQixZQUFZLEVBQ2pDLFFBQVEsQ0FBQyxPQUFPO0FBQ2YsZ0JBQU0sT0FBUSxHQUFtQixhQUFhLFVBQVU7QUFDeEQsY0FBSTtBQUFFLGVBQUcsWUFBWSxXQUFXLE1BQU0sRUFBRSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQUEsVUFBRyxTQUFRO0FBQUEsVUFBQztBQUFBLFFBQ2pFLENBQUM7QUFBQSxNQUNMO0FBQ0EsaUJBQVcsSUFBSTtBQUVmLFlBQU0sT0FBTyxZQUFZO0FBQ3ZCLG1CQUFXLFdBQVc7QUFDdEIsbUJBQVcsWUFBWTtBQUN2QixtQkFBVyxVQUFVO0FBQ3JCLGNBQU0sSUFBSSxPQUFPO0FBQ2pCLGFBQUssWUFBWTtBQUNqQixpQkFBUyxJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUssTUFBSyxZQUFZLEtBQUssOEJBQThCLENBQUM7QUFDakYsWUFBSTtBQUNGLGdCQUFNLEtBQUssTUFBTSxlQUFlLEVBQUUsUUFBeUMsYUFBYTtBQUN4RixnQkFBTSxNQUFNLE1BQU0sZUFBZSxFQUFFLFFBQXlCLG1CQUFtQjtBQUMvRSxnQkFBTSxjQUFjLGtDQUFTLEdBQUcsSUFBSSxpQ0FBVSxHQUFHLEtBQUs7QUFDdEQsZUFBSyxZQUFZO0FBQ2pCLHFCQUFXLFNBQVMsSUFBSSxNQUFNO0FBQzVCLGtCQUFNLFFBQVEsTUFBTSxTQUFTLElBQUksY0FBTyxNQUFNLFNBQVMsSUFBSSxjQUFPLE1BQU0sU0FBUyxJQUFJLGNBQU87QUFDNUYsa0JBQU0sTUFBTSxNQUFNLFFBQVEsSUFBSSxvQkFBb0I7QUFDbEQsa0JBQU0sTUFBTSxLQUFLO0FBQUEsbUNBQ1EsR0FBRztBQUFBLHNCQUNoQixLQUFLLEtBQUssTUFBTSxJQUFJO0FBQUEsdUlBQzZGLE1BQU0sTUFBTTtBQUFBLHdCQUMzSCxNQUFNLEtBQUs7QUFBQTtBQUFBLFdBRXhCO0FBQ0QsdUJBQVcsR0FBRztBQUNkLGlCQUFLLFlBQVksR0FBRztBQUFBLFVBQ3RCO0FBQUEsUUFDRixTQUFTLEdBQVE7QUFDZixnQkFBTSxlQUFjLHVCQUFHLFlBQVc7QUFDbEMsZUFBSyxZQUFZO0FBQUEsUUFDbkIsVUFBRTtBQUNBLHFCQUFXLFdBQVc7QUFDdEIscUJBQVcsWUFBWTtBQUN2QixxQkFBVyxVQUFVO0FBQUEsUUFDdkI7QUFBQSxNQUNGO0FBQ0EsaUJBQVcsVUFBVSxNQUFNLEtBQUs7QUFDaEMsV0FBSztBQUFBLElBQ1A7QUFBQSxFQUNGOzs7QUNoRkEsTUFBSSxXQUFXO0FBRVIsV0FBUyxxQkFBcUI7QUFDbkMsUUFBSSxTQUFVO0FBQ2QsVUFBTSxNQUFNO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFB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
