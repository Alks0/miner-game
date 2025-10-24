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
      <div class="stat stat-animated" id="ore-stat">
        <div class="ico" data-ico="ore"></div>
        <div style="display:flex;flex-direction:column;gap:2px;">
          <div class="val" id="ore">0</div>
          <div class="label">\u77FF\u77F3</div>
        </div>
        <svg class="stat-particles" width="100%" height="100%" viewBox="0 0 100 50" style="position:absolute;inset:0;pointer-events:none;">
          <circle class="stat-particle sp1" cx="20" cy="25" r="1.5" fill="#7B2CF5" opacity="0"/>
          <circle class="stat-particle sp2" cx="50" cy="25" r="1" fill="#2C89F5" opacity="0"/>
          <circle class="stat-particle sp3" cx="80" cy="25" r="1.5" fill="#f6c445" opacity="0"/>
        </svg>
      </div>
      <div class="stat stat-animated" id="coin-stat">
        <div class="ico" data-ico="coin"></div>
        <div style="display:flex;flex-direction:column;gap:2px;">
          <div class="val" id="coin">0</div>
          <div class="label">BB</div>
        </div>
        <svg class="stat-particles" width="100%" height="100%" viewBox="0 0 100 50" style="position:absolute;inset:0;pointer-events:none;">
          <circle class="stat-particle sp1" cx="20" cy="25" r="1.5" fill="#f6c445" opacity="0"/>
          <circle class="stat-particle sp2" cx="50" cy="25" r="1" fill="#ffd700" opacity="0"/>
          <circle class="stat-particle sp3" cx="80" cy="25" r="1.5" fill="#e36414" opacity="0"/>
        </svg>
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

  // frontend-scripts/components/AdDialog.ts
  async function showAdDialog() {
    return new Promise((resolve) => {
      const overlay = html(`
      <div class="ad-overlay">
        <div class="ad-dialog">
          <div class="ad-content">
            <div class="ad-icon" data-ico="info"></div>
            <h3 style="margin:8px 0;font-size:18px;">\u89C2\u770B\u5E7F\u544A</h3>
            <p style="opacity:.85;margin:8px 0;">\u89C2\u770B15\u79D2\u5E7F\u544A\u89C6\u9891\u5373\u53EF\u6536\u77FF<br/>\u5E76\u989D\u5916\u83B7\u5F97 5-15 \u77FF\u77F3\u5956\u52B1\uFF01</p>
            <div class="ad-placeholder">
              <div class="ad-progress-ring">
                <svg width="100" height="100">
                  <circle class="ad-circle-bg" cx="50" cy="50" r="45"></circle>
                  <circle class="ad-circle-fg" cx="50" cy="50" r="45" id="adCircle"></circle>
                </svg>
                <div class="ad-countdown" id="adCountdown">15</div>
              </div>
              <p style="opacity:.75;font-size:13px;margin-top:12px;">[\u5E7F\u544A\u5360\u4F4D\u7B26 - \u5B9E\u9645\u5E94\u63A5\u5165SDK]</p>
            </div>
            <div class="ad-actions">
              <button class="btn btn-ghost" id="adSkip">\u8DF3\u8FC7\uFF08\u65E0\u5956\u52B1\uFF09</button>
              <button class="btn btn-primary" id="adComplete" disabled>\u9886\u53D6\u5956\u52B1</button>
            </div>
          </div>
        </div>
      </div>
    `);
      document.body.appendChild(overlay);
      try {
        overlay.querySelectorAll("[data-ico]").forEach((el) => {
          const name = el.getAttribute("data-ico");
          try {
            el.appendChild(renderIcon(name, { size: 48 }));
          } catch (e) {
          }
        });
      } catch (e) {
      }
      const skipBtn = overlay.querySelector("#adSkip");
      const completeBtn = overlay.querySelector("#adComplete");
      const countdown = overlay.querySelector("#adCountdown");
      const circle = overlay.querySelector("#adCircle");
      let seconds = 15;
      const circumference = 2 * Math.PI * 45;
      if (circle) {
        circle.style.strokeDasharray = `${circumference}`;
        circle.style.strokeDashoffset = `${circumference}`;
      }
      const timer = setInterval(() => {
        seconds--;
        countdown.textContent = String(seconds);
        if (circle) {
          const offset = circumference * (seconds / 15);
          circle.style.strokeDashoffset = String(offset);
        }
        if (seconds <= 0) {
          clearInterval(timer);
          completeBtn.disabled = false;
          completeBtn.classList.add("btn-energy");
        }
      }, 1e3);
      const cleanup = () => {
        clearInterval(timer);
        overlay.remove();
      };
      skipBtn.onclick = () => {
        cleanup();
        resolve(false);
      };
      completeBtn.onclick = async () => {
        try {
          const res = await NetworkManager.I.request("/user/watch-ad", { method: "POST" });
          if (res.success && res.reward) {
            showToast(`\u{1F381} \u5E7F\u544A\u5956\u52B1\uFF1A\u83B7\u5F97 ${res.reward} \u77FF\u77F3`, "success");
          }
        } catch (e) {
          showToast((e == null ? void 0 : e.message) || "\u5E7F\u544A\u5956\u52B1\u9886\u53D6\u5931\u8D25", "error");
        }
        cleanup();
        resolve(true);
      };
      overlay.onclick = (e) => {
        if (e.target === overlay) {
          showToast("\u8BF7\u89C2\u770B\u5B8C\u5E7F\u544A\u6216\u9009\u62E9\u8DF3\u8FC7", "warn");
        }
      };
    });
  }

  // frontend-scripts/components/MinerAnimation.ts
  function createMinerAnimation() {
    const container = html(`
    <div class="miner-animation">
      <svg class="miner-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="minerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#7B2CF5" />
            <stop offset="100%" stop-color="#2C89F5" />
          </linearGradient>
          <filter id="minerGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <!-- \u77FF\u5DE5\u8EAB\u4F53 -->
        <g class="miner-body">
          <!-- \u5934\u76D4 -->
          <ellipse cx="100" cy="70" rx="20" ry="18" fill="url(#minerGrad)" filter="url(#minerGlow)"/>
          <circle cx="100" cy="65" r="8" fill="#f6c445" opacity="0.9" class="miner-light"/>
          
          <!-- \u8EAB\u4F53 -->
          <rect x="85" y="85" width="30" height="35" rx="5" fill="url(#minerGrad)" opacity="0.8"/>
          
          <!-- \u624B\u81C2\uFF08\u6325\u52A8\uFF09 -->
          <g class="miner-arm">
            <line x1="110" y1="95" x2="130" y2="85" stroke="url(#minerGrad)" stroke-width="6" stroke-linecap="round"/>
            <!-- \u9550\u5B50 -->
            <g class="miner-pickaxe">
              <line x1="130" y1="85" x2="145" y2="70" stroke="#f6c445" stroke-width="3" stroke-linecap="round"/>
              <polygon points="145,70 155,65 150,75" fill="#888" stroke="#666" stroke-width="1"/>
            </g>
          </g>
          
          <!-- \u817F -->
          <rect x="90" y="120" width="8" height="20" rx="3" fill="url(#minerGrad)" opacity="0.7"/>
          <rect x="102" y="120" width="8" height="20" rx="3" fill="url(#minerGrad)" opacity="0.7"/>
        </g>
        
        <!-- \u77FF\u77F3\u7C92\u5B50 -->
        <circle class="ore-particle p1" cx="140" cy="100" r="3" fill="#7B2CF5" opacity="0"/>
        <circle class="ore-particle p2" cx="145" cy="105" r="2" fill="#2C89F5" opacity="0"/>
        <circle class="ore-particle p3" cx="135" cy="108" r="2.5" fill="#f6c445" opacity="0"/>
      </svg>
      <div class="miner-status">\u6316\u77FF\u4E2D...</div>
    </div>
  `);
    return container;
  }
  function createIdleMiner() {
    const container = html(`
    <div class="miner-idle">
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="idleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#7B2CF5" stop-opacity="0.6"/>
            <stop offset="100%" stop-color="#2C89F5" stop-opacity="0.6"/>
          </linearGradient>
        </defs>
        
        <!-- \u7B80\u5355\u7684\u77FF\u5DE5\u526A\u5F71 -->
        <g class="idle-miner">
          <circle cx="60" cy="40" r="12" fill="url(#idleGrad)"/>
          <rect x="50" y="50" width="20" height="25" rx="3" fill="url(#idleGrad)" opacity="0.8"/>
          <line x1="65" y1="60" x2="75" y2="55" stroke="url(#idleGrad)" stroke-width="4" stroke-linecap="round"/>
          <line x1="75" y1="55" x2="85" y2="50" stroke="#f6c445" stroke-width="2" stroke-linecap="round"/>
        </g>
      </svg>
      <div class="miner-status" style="opacity:.6;">\u5F85\u673A\u4E2D</div>
    </div>
  `);
    return container;
  }

  // frontend-scripts/components/AnimatedIcons.ts
  function createTreasureChest() {
    return html(`
    <svg class="treasure-chest" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="chestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f6c445"/>
          <stop offset="100%" stop-color="#e36414"/>
        </linearGradient>
      </defs>
      <g class="chest-body">
        <rect x="4" y="12" width="16" height="10" rx="1" fill="url(#chestGrad)" stroke="#b8860b" stroke-width="0.5"/>
        <rect x="6" y="10" width="12" height="3" rx="1" fill="url(#chestGrad)" stroke="#b8860b" stroke-width="0.5" class="chest-lid"/>
        <circle cx="12" cy="17" r="1.5" fill="#fff" opacity="0.8"/>
      </g>
      <g class="chest-coins">
        <circle cx="10" cy="7" r="1.5" fill="#f6c445" class="coin c1"/>
        <circle cx="14" cy="6" r="1.5" fill="#f6c445" class="coin c2"/>
        <circle cx="12" cy="5" r="1.5" fill="#f6c445" class="coin c3"/>
      </g>
    </svg>
  `);
  }
  function createSwordSlash() {
    return html(`
    <svg class="sword-slash" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="slashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ff5c5c"/>
          <stop offset="100%" stop-color="#e36414"/>
        </linearGradient>
      </defs>
      <path class="slash-trail slash1" d="M6 6 L18 18" stroke="url(#slashGrad)" stroke-width="2" stroke-linecap="round" opacity="0"/>
      <path class="slash-trail slash2" d="M4 8 L16 20" stroke="url(#slashGrad)" stroke-width="1.5" stroke-linecap="round" opacity="0"/>
      <path d="M7 7 L17 17" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity="0.3"/>
    </svg>
  `);
  }
  function createSpinningCoin() {
    return html(`
    <svg class="spinning-coin" width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="coinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f6c445"/>
          <stop offset="50%" stop-color="#ffd700"/>
          <stop offset="100%" stop-color="#e36414"/>
        </linearGradient>
      </defs>
      <g class="coin-spin">
        <ellipse cx="16" cy="16" rx="12" ry="12" fill="url(#coinGrad)" stroke="#b8860b" stroke-width="1"/>
        <text x="16" y="20" text-anchor="middle" font-size="12" font-weight="bold" fill="#fff">BB</text>
      </g>
    </svg>
  `);
  }
  function createTrophyAnimation(rank) {
    const colors = {
      1: { primary: "#ffd700", secondary: "#f6c445" },
      // 金色
      2: { primary: "#c0c0c0", secondary: "#a8a8a8" },
      // 银色
      3: { primary: "#cd7f32", secondary: "#b87333" }
      // 铜色
    };
    const color = colors[rank] || { primary: "#7B2CF5", secondary: "#2C89F5" };
    return html(`
    <svg class="trophy-anim" width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="trophy${rank}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${color.primary}"/>
          <stop offset="100%" stop-color="${color.secondary}"/>
        </linearGradient>
      </defs>
      <g class="trophy-bounce">
        <!-- \u676F\u8EAB -->
        <path d="M10 8 L10 14 Q10 18 16 18 Q22 18 22 14 L22 8 Z" fill="url(#trophy${rank})" stroke="${color.secondary}" stroke-width="0.5"/>
        <!-- \u8033\u6735 -->
        <path d="M8 10 L8 12 Q8 13 9 13" fill="none" stroke="url(#trophy${rank})" stroke-width="1"/>
        <path d="M24 10 L24 12 Q24 13 23 13" fill="none" stroke="url(#trophy${rank})" stroke-width="1"/>
        <!-- \u5E95\u5EA7 -->
        <rect x="13" y="18" width="6" height="3" fill="url(#trophy${rank})"/>
        <rect x="11" y="21" width="10" height="2" rx="1" fill="url(#trophy${rank})"/>
        <!-- \u661F\u661F -->
        <circle class="trophy-star" cx="16" cy="5" r="1.5" fill="${color.primary}"/>
      </g>
    </svg>
  `);
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
        hologram: null,
        minerChar: null
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
                <div class="miner-char-wrapper" id="minerChar"></div>
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
      this.els.minerChar = this.view.querySelector("#minerChar");
      this.updateMinerAnimation();
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
        if (msg.fragment) {
          const fragmentNames = {
            miner: "\u77FF\u673A\u788E\u7247",
            cart: "\u77FF\u8F66\u788E\u7247",
            raider: "\u63A0\u593A\u5668\u788E\u7247",
            shield: "\u9632\u5FA1\u76FE\u788E\u7247"
          };
          showToast(`\u{1F48E} \u83B7\u5F97 ${fragmentNames[msg.fragment.type] || "\u788E\u7247"} x${msg.fragment.amount}`, "success");
          this.logEvent(`\u83B7\u5F97\u788E\u7247\uFF1A${fragmentNames[msg.fragment.type]} x${msg.fragment.amount}`);
        }
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
      RealtimeClient.I.on("global.announcement", (msg) => {
        if (msg.type === "upgrade") {
          showToast(`\u{1F4E2} ${msg.message}`, "success");
          this.logEvent(`[\u5168\u670D] ${msg.message}`);
        }
      });
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
      try {
        const vipStatus = await NetworkManager.I.request("/user/vip-status");
        if (!vipStatus.isVip) {
          const watched = await showAdDialog();
          if (!watched) {
            showToast("\u5DF2\u8DF3\u8FC7\u5E7F\u544A\uFF0C\u6536\u77FF\u53D6\u6D88", "warn");
            return;
          }
        }
      } catch (e) {
        console.warn("VIP status check failed:", e);
      }
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
      this.updateMinerAnimation();
    }
    updateMinerAnimation() {
      if (!this.els.minerChar) return;
      this.els.minerChar.innerHTML = "";
      if (this.isCollapsed) {
        const warning = html(`
        <div style="text-align:center;opacity:.6;">
          <div style="font-size:48px;animation:warning-pulse 1s ease-in-out infinite;">\u26A0\uFE0F</div>
          <div style="font-size:13px;margin-top:8px;">\u77FF\u9053\u574D\u584C</div>
        </div>
      `);
        this.els.minerChar.appendChild(warning);
      } else if (this.isMining) {
        this.els.minerChar.appendChild(createMinerAnimation());
      } else {
        this.els.minerChar.appendChild(createIdleMiner());
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
      if (this.els.collect && this.cartAmt > 0 && !this.els.collect.disabled) {
        const hasChest = this.els.collect.querySelector(".treasure-chest");
        if (!hasChest) {
          const chest = createTreasureChest();
          const iconSlot = this.els.collect.querySelector(".icon");
          if (iconSlot) {
            iconSlot.innerHTML = "";
            iconSlot.appendChild(chest);
          }
        }
      }
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
      if (this.els.minerChar) {
        this.els.minerChar.classList.add("critical-mining");
        setTimeout(() => {
          var _a;
          return (_a = this.els.minerChar) == null ? void 0 : _a.classList.remove("critical-mining");
        }, 1200);
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
              <summary><span data-ico="ore"></span>\u788E\u7247\u4ED3\u5E93</summary>
              <div id="fragments" style="margin-top:8px;display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;"></div>
            </details>
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
      const fragmentsContainer = qs(view, "#fragments");
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
          const [data, tpls, fragmentsData] = await Promise.all([
            NetworkManager.I.request("/items"),
            NetworkManager.I.request("/items/templates").catch(() => ({ templates: [] })),
            NetworkManager.I.request("/items/fragments").catch(() => ({ fragments: {} }))
          ]);
          const tplById = {};
          for (const t of tpls.templates || []) tplById[t.id] = t;
          const fragments = fragmentsData.fragments || {};
          fragmentsContainer.innerHTML = "";
          const fragmentNames = {
            miner: "\u77FF\u673A\u788E\u7247",
            cart: "\u77FF\u8F66\u788E\u7247",
            raider: "\u63A0\u593A\u5668\u788E\u7247",
            shield: "\u9632\u5FA1\u76FE\u788E\u7247"
          };
          for (const [type, count] of Object.entries(fragments)) {
            const canCraft = count >= 50;
            const card = html(`
            <div class="fragment-card ${canCraft ? "can-craft" : ""}">
              <div class="fragment-icon" data-ico="ore"></div>
              <div class="fragment-info">
                <div class="fragment-name">${fragmentNames[type] || type}</div>
                <div class="fragment-count">${count} / 50</div>
              </div>
              <button class="btn btn-primary btn-sm" data-craft="${type}" ${canCraft ? "" : "disabled"}><span data-ico="wrench"></span>\u5408\u6210</button>
            </div>
          `);
            mountIcons(card);
            const craftBtn = card.querySelector("[data-craft]");
            craftBtn == null ? void 0 : craftBtn.addEventListener("click", async () => {
              if (craftBtn.disabled) return;
              craftBtn.disabled = true;
              const originalHTML2 = craftBtn.innerHTML;
              craftBtn.innerHTML = '<span data-ico="wrench"></span>\u5408\u6210\u4E2D\u2026';
              mountIcons(craftBtn);
              try {
                const res = await NetworkManager.I.request("/items/craft", {
                  method: "POST",
                  body: JSON.stringify({ fragmentType: type })
                });
                showToast(`\u5408\u6210\u6210\u529F\uFF01\u83B7\u5F97 ${fragmentNames[type]}`, "success");
                card.classList.add("upgrade-success");
                setTimeout(() => card.classList.remove("upgrade-success"), 1e3);
                await load();
              } catch (e) {
                showToast((e == null ? void 0 : e.message) || "\u5408\u6210\u5931\u8D25", "error");
                craftBtn.innerHTML = originalHTML2;
                mountIcons(craftBtn);
              } finally {
                craftBtn.disabled = false;
              }
            });
            fragmentsContainer.appendChild(card);
          }
          list.innerHTML = "";
          if (!data.items.length) {
            list.appendChild(html('<div style="opacity:.8;">\u6682\u65E0\u9053\u5177\uFF0C\u5C1D\u8BD5\u591A\u6316\u77FF\u6216\u63A0\u593A\u4EE5\u83B7\u53D6\u66F4\u591A\u8D44\u6E90</div>'));
          }
          for (const item of data.items) {
            const tpl = tplById[item.templateId];
            const rarity = getRarity(item, tpl);
            const name = tpl && (tpl.name || tpl.id) || item.templateId;
            const successRate = Math.max(0.4, 0.8 - (item.level - 1) * 0.02);
            const successPct = Math.round(successRate * 100);
            const row = html(`
            <div class="item-card hover-lift ${rarity.key === "legendary" ? "rarity-outline-legendary" : rarity.key === "epic" ? "rarity-outline-epic" : rarity.key === "rare" ? "rarity-outline-rare" : "rarity-outline-common"}" data-rarity="${rarity.key}">
              <div class="row" style="justify-content:space-between;align-items:flex-start;gap:10px;">
                <div style="display:flex;flex-direction:column;gap:6px;flex:1;min-width:0;">
                  <div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;">
                    <strong style="font-size:15px;white-space:nowrap;display:flex;align-items:center;gap:6px;"><span data-ico="ore"></span>${name}</strong>
                    <span class="badge rarity-${rarity.key}"><i></i>${rarity.text}</span>
                    ${item.isEquipped ? '<span class="pill pill-running">\u5DF2\u88C5\u5907</span>' : ""}
                    ${item.isListed ? '<span class="pill">\u6302\u5355\u4E2D</span>' : ""}
                  </div>
                  ${(tpl == null ? void 0 : tpl.description) ? `<div style="opacity:.75;font-size:13px;font-style:italic;">${tpl.description}</div>` : ""}
                  <div style="opacity:.85;display:flex;flex-wrap:wrap;gap:8px;font-size:13px;">
                    <span>\u7B49\u7EA7 Lv.${item.level}</span>
                    ${(tpl == null ? void 0 : tpl.baseEffect) ? `<span class="pill">\u57FA\u7840\u6548\u679C ${tpl.baseEffect}</span>` : ""}
                    <span class="pill">\u5B9E\u4F8B ${item.id}</span>
                  </div>
                </div>
                <div class="actions">
                  <button class="btn ${item.isEquipped ? "btn-sell" : "btn-buy"}" data-act="${item.isEquipped ? "unequip" : "equip"}" data-id="${item.id}"><span data-ico="${item.isEquipped ? "x" : "shield"}"></span>${item.isEquipped ? "\u5378\u4E0B" : "\u88C5\u5907"}</button>
                  <button class="btn btn-primary" data-act="upgrade" data-id="${item.id}" title="\u6D88\u8017 ${item.level * 50} \u77FF\u77F3\uFF0C\u6210\u529F\u7387 ${successPct}%"><span data-ico="wrench"></span>\u5347\u7EA7 (${item.level * 50}) ${successPct}%</button>
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
            const rarityText = tpl.rarity === "legendary" ? "\u4F20\u8BF4" : tpl.rarity === "epic" ? "\u53F2\u8BD7" : tpl.rarity === "rare" ? "\u7A00\u6709" : "\u666E\u901A";
            const categoryText = tpl.category === "miner" ? "\u77FF\u673A" : tpl.category === "cart" ? "\u77FF\u8F66" : tpl.category === "raider" ? "\u63A0\u593A\u5668" : "\u9632\u5FA1\u76FE";
            const row = html(`
            <div class="list-item">
              <div style="flex:1;display:flex;flex-direction:column;gap:4px;">
                <div style="display:flex;gap:6px;align-items:center;">
                  <strong>${tpl.name || tpl.id}</strong>
                  <span class="badge rarity-${tpl.rarity}"><i></i>${rarityText}</span>
                </div>
                <div style="opacity:.75;font-size:12px;">${tpl.description || ""}</div>
                <div style="opacity:.65;font-size:12px;">\u7C7B\u578B\uFF1A${categoryText} \xB7 \u57FA\u7840\u6548\u679C\uFF1A${tpl.baseEffect}</div>
              </div>
            </div>
          `);
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
          <div style="margin-top:12px;">
            <details>
              <summary style="color:#ff5c5c;"><span data-ico="target"></span>\u590D\u4EC7\u5217\u8868</summary>
              <div id="revenge" style="margin-top:8px;display:flex;flex-direction:column;gap:8px;"></div>
            </details>
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
      const revengeList = qs(view, "#revenge");
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
        revengeList.innerHTML = "";
        for (let i = 0; i < 3; i++) list.appendChild(html('<div class="skeleton"></div>'));
        try {
          const [data, revengeData] = await Promise.all([
            NetworkManager.I.request("/plunder/targets"),
            NetworkManager.I.request("/plunder/revenge-list").catch(() => ({ revenges: [] }))
          ]);
          revengeList.innerHTML = "";
          if (revengeData.revenges && revengeData.revenges.length > 0) {
            for (const target of revengeData.revenges) {
              const row = html(`
              <div class="list-item list-item--sell" style="border-color:#ff5c5c;">
                <div style="display:flex;flex-direction:column;gap:2px;">
                  <div style="display:flex;align-items:center;gap:6px;color:#ff5c5c;"><span data-ico="target"></span><strong>${target.username || target.id}</strong> \u{1F479} \u4EC7\u4EBA</div>
                  <div style="opacity:.85;">\u77FF\u77F3\uFF1A${target.ore} <span class="pill">\u590D\u4EC7\u63A0\u593A\u4E0D\u53D7\u51B7\u5374\u9650\u5236</span></div>
                </div>
                <div>
                  <button class="btn btn-sell" data-id="${target.id}"><span data-ico="sword"></span>\u590D\u4EC7</button>
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
                btn.innerHTML = '<span data-ico="sword"></span>\u590D\u4EC7\u4E2D\u2026';
                mountIcons(btn);
                let shouldRefresh = false;
                try {
                  const res = await NetworkManager.I.request(`/plunder/${id}`, { method: "POST" });
                  if (res.success) {
                    this.log(`\u590D\u4EC7\u6210\u529F\uFF0C\u83B7\u5F97 ${res.loot_amount}`);
                    showToast(`\u2694\uFE0F \u590D\u4EC7\u6210\u529F\uFF01\u83B7\u5F97 ${res.loot_amount} \u77FF\u77F3`, "success");
                    shouldRefresh = true;
                  } else {
                    this.log(`\u590D\u4EC7\u5931\u8D25`);
                    showToast("\u590D\u4EC7\u5931\u8D25", "warn");
                  }
                  await bar.update();
                } catch (e) {
                  const message = (e == null ? void 0 : e.message) || "\u590D\u4EC7\u5931\u8D25";
                  this.log(`\u590D\u4EC7\u5931\u8D25\uFF1A${message}`);
                  showToast(message, "error");
                  btn.innerHTML = originalHTML2;
                  mountIcons(btn);
                } finally {
                  btn.disabled = false;
                  if (shouldRefresh) {
                    await load();
                  }
                }
              });
              revengeList.appendChild(row);
            }
          } else {
            revengeList.innerHTML = '<div style="opacity:.8;text-align:center;padding:10px;">\u6682\u65E0\u53EF\u590D\u4EC7\u7684\u5BF9\u8C61</div>';
          }
          list.innerHTML = "";
          if (!data.targets.length) {
            list.appendChild(html('<div style="opacity:.8;">\u6682\u65E0\u53EF\u63A0\u593A\u7684\u76EE\u6807\uFF0C\u7A0D\u540E\u518D\u8BD5</div>'));
          }
          for (const target of data.targets) {
            const row = html(`
            <div class="list-item list-item--sell">
              <div style="display:flex;flex-direction:column;gap:2px;">
                <div style="display:flex;align-items:center;gap:6px;"><span data-ico="target"></span><strong>${target.username || target.id}</strong></div>
                <div style="opacity:.85;">\u77FF\u77F3\uFF1A${target.ore} <span class="pill">\u9884\u8BA1\u6536\u76CA 5%~35%</span></div>
              </div>
              <div>
                <button class="btn btn-sell plunder-btn" data-id="${target.id}"><span class="icon-slot"></span>\u63A0\u593A</button>
              </div>
            </div>
          `);
            mountIcons(row);
            const plunderBtn = row.querySelector(".plunder-btn .icon-slot");
            if (plunderBtn) {
              plunderBtn.appendChild(createSwordSlash());
            }
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
          <h3 style="margin:0 0 12px;display:flex;align-items:center;gap:8px;"><span data-ico="exchange"></span>\u5E02\u573A\u4E0B\u5355 <span id="coinAnim"></span></h3>
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
      const coinSlot = view.querySelector("#coinAnim");
      if (coinSlot) {
        coinSlot.appendChild(createSpinningCoin());
      }
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
              <span style="display:flex;align-items:center;gap:8px;">
                <span id="trophy${entry.rank}"></span>
                ${medal} #${entry.rank}
              </span>
              <span style="flex:1;opacity:.9;margin-left:12px;display:flex;align-items:center;gap:6px;"><span data-ico="user"></span>${entry.userId}</span>
              <strong>${entry.score}</strong>
            </div>
          `);
            mountIcons(row);
            if (entry.rank <= 3) {
              const trophySlot = row.querySelector(`#trophy${entry.rank}`);
              if (trophySlot) {
                trophySlot.appendChild(createTrophyAnimation(entry.rank));
              }
            }
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
.card:hover{box-shadow:var(--glow),0 0 24px rgba(123,44,245,.15)}
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
.btn{position:relative;overflow:hidden;padding:10px 14px;border:0;border-radius:var(--radius-md);color:#fff;transition:transform var(--dur) var(--ease),box-shadow var(--dur) var(--ease),filter var(--dur) var(--ease);cursor:pointer}
.btn .icon{margin-right:6px}
.btn:active{transform:translateY(1px) scale(.99)}
.btn:disabled{opacity:.5;cursor:not-allowed;filter:grayscale(0.3)}
.btn::after{content:"";position:absolute;inset:0;opacity:0;background:linear-gradient(115deg,transparent,rgba(255,255,255,.25),transparent 55%);transform:translateX(-60%);transition:opacity var(--dur) var(--ease), transform var(--dur) var(--ease);pointer-events:none}
.btn:hover::after{opacity:.9;transform:translateX(0)}
.btn:hover{filter:saturate(110%)}
.btn-primary{background:var(--grad);box-shadow:var(--glow);position:relative}
.btn-primary::before{content:"";position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.2),transparent);animation:btn-shimmer 3s linear infinite;pointer-events:none}
@keyframes btn-shimmer{0%{left:-100%}100%{left:200%}}
.btn-energy{position:relative;animation:btn-pulse 2s ease-in-out infinite}
.btn-energy::before{content:"";position:absolute;inset:-2px;border-radius:inherit;background:linear-gradient(135deg,rgba(123,44,245,.6),rgba(44,137,245,.6));filter:blur(8px);z-index:-1;opacity:.6;animation:energy-ring 2s ease-in-out infinite;pointer-events:none}
@keyframes btn-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.02)}}
@keyframes energy-ring{0%,100%{opacity:.4;filter:blur(8px)}50%{opacity:.8;filter:blur(12px)}}
.btn-buy{background:var(--buy)}
.btn-sell{background:var(--sell)}
.btn-ghost{background:rgba(255,255,255,.08)}
.input{width:100%;padding:10px;border:0;border-radius:var(--radius-md);background:rgba(255,255,255,.08);color:var(--fg);pointer-events:auto;touch-action:manipulation;user-select:text;-webkit-user-select:text;transition:all .2s ease}
.input:focus{background:rgba(255,255,255,.12);box-shadow:0 0 0 2px rgba(123,44,245,.4);outline:none}
.pill{padding:2px 8px;border-radius:999px;background:rgba(255,255,255,.08);font-size:12px;cursor:pointer;transition:background .3s ease}
.pill.pill-running{animation:pill-breathe 2s ease-in-out infinite}
@keyframes pill-breathe{0%,100%{background:rgba(46,194,126,.25);box-shadow:0 0 8px rgba(46,194,126,.3)}50%{background:rgba(46,194,126,.35);box-shadow:0 0 12px rgba(46,194,126,.5)}}
.pill.pill-collapsed{animation:pill-alert 1s ease-in-out infinite}
@keyframes pill-alert{0%,100%{background:rgba(255,92,92,.25);box-shadow:0 0 8px rgba(255,92,92,.3)}50%{background:rgba(255,92,92,.45);box-shadow:0 0 16px rgba(255,92,92,.6)}}
.pill.active{background:linear-gradient(135deg, rgba(123,44,245,.35), rgba(44,137,245,.28));box-shadow:var(--glow)}
.scene-header{display:flex;justify-content:space-between;align-items:flex-end;gap:12px;margin-bottom:8px}
.scene-header h1{margin:0;font-size:20px;position:relative;display:inline-block}
.scene-header h1::after{content:"";position:absolute;left:0;bottom:-2px;width:100%;height:2px;background:var(--grad);opacity:.4;pointer-events:none}
.scene-header p{margin:0;opacity:.85}
.stats{display:flex;gap:10px}
.stat{flex:1;min-width:0;background:linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.03));border-radius:12px;padding:10px;display:flex;align-items:center;gap:10px;position:relative;overflow:hidden}
.stat-animated:hover{background:linear-gradient(180deg,rgba(255,255,255,.1),rgba(255,255,255,.05));box-shadow:0 0 16px rgba(123,44,245,.2)}
.stat .ico{font-size:18px;filter:drop-shadow(0 0 8px rgba(123,44,245,.35));transition:transform .3s ease}
.pulse-icon{animation:icon-pulse .6s ease}
@keyframes icon-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.3) rotate(5deg)}}
.stat .val{font-weight:700;font-size:16px}
.stat .label{opacity:.85;font-size:12px}
.event-feed{max-height:240px;overflow:auto;display:flex;flex-direction:column;gap:6px;position:relative}
.event-feed::before{content:"";position:absolute;top:0;left:0;right:0;height:20px;background:linear-gradient(180deg,rgba(12,20,44,.55),transparent);pointer-events:none;z-index:1}
.event-feed::after{content:"";position:absolute;bottom:0;left:0;right:0;height:20px;background:linear-gradient(0deg,rgba(12,20,44,.55),transparent);pointer-events:none;z-index:1}
.event-feed .event{opacity:.9;font-family:monospace;font-size:12px;position:relative}
.main-screen{position:relative;padding:12px 0 36px;min-height:100vh}
.main-stack{display:flex;flex-direction:column;gap:16px}
.mine-card{min-height:calc(100vh - 160px);padding:24px 20px;display:flex;flex-direction:column;gap:20px;border-radius:20px}
@media (min-width:580px){.mine-card{min-height:620px;padding:28px 26px}}
.mine-header{display:flex;align-items:center;justify-content:space-between;gap:12px}
.mine-title{display:flex;align-items:center;gap:10px;font-size:18px;font-weight:600;letter-spacing:.04em;text-shadow:0 2px 12px rgba(18,10,48,.6);position:relative}
.mine-title::after{content:"";position:absolute;left:0;bottom:-4px;width:100%;height:2px;background:linear-gradient(90deg,transparent,rgba(123,44,245,.6),transparent);opacity:.5;animation:title-glow 3s ease-in-out infinite}
@keyframes title-glow{0%,100%{opacity:.3;transform:scaleX(.8)}50%{opacity:.7;transform:scaleX(1)}}
.mine-title .icon{filter:drop-shadow(0 0 12px rgba(124,60,255,.55))}
.mine-chips{display:flex;align-items:center;gap:8px}
.mine-chips .pill{display:flex;align-items:center;gap:6px;font-size:12px;background:rgba(15,24,56,.55);box-shadow:inset 0 0 0 1px rgba(123,44,245,.25)}
.mine-grid{display:grid;gap:18px}
@media (min-width:640px){.mine-grid{grid-template-columns:220px 1fr;align-items:center}}
.mine-gauge{position:relative;display:flex;align-items:center;justify-content:center;padding:8px 0}
.mine-progress{position:relative;display:flex;flex-direction:column;gap:14px}
.mine-progress .miner-char-wrapper{position:absolute;top:-140px;left:120px;z-index:5;pointer-events:none;transform:scale(1.5)}
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
.list-item{display:flex;gap:8px;align-items:center;justify-content:space-between;background:rgba(255,255,255,.06);border-radius:var(--radius-md);padding:10px;transition:all .2s ease}
.list-item:hover{background:rgba(255,255,255,.09);transform:translateX(2px)}
.list-item--buy{border-left:3px solid var(--buy)}
.list-item--sell{border-left:3px solid var(--sell)}
.nav{max-width:var(--container-max);margin:12px auto 0;display:flex;gap:8px;flex-wrap:wrap;position:sticky;top:0;z-index:40;padding:6px;border-radius:14px;background:linear-gradient(180deg,rgba(20,20,40,.45),rgba(20,20,40,.25));backdrop-filter:blur(10px) saturate(125%);border:1px solid rgba(255,255,255,.06);box-shadow:0 4px 12px rgba(0,0,0,.3)}
.nav a{flex:1;display:flex;justify-content:center;align-items:center;gap:6px;text-align:center;padding:10px;border-radius:999px;text-decoration:none;color:#fff;transition:background var(--dur) var(--ease), transform var(--dur) var(--ease);position:relative}
.nav a::before{content:"";position:absolute;inset:0;border-radius:inherit;background:var(--grad);opacity:0;transition:opacity var(--dur) var(--ease);pointer-events:none}
.nav a:hover::before{opacity:.1}
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
.item-card{position:relative;border-radius:var(--radius-md);padding:10px;background:linear-gradient(140deg,rgba(255,255,255,.06),rgba(255,255,255,.04));overflow:hidden;transition:all .3s ease}
.item-card:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.4)}
.item-card::before{content:"";position:absolute;inset:-1px;border-radius:inherit;padding:1px;background:linear-gradient(135deg,rgba(255,255,255,.18),rgba(255,255,255,.02));-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none}
.item-card[data-rarity="common"]{border:1px solid rgba(154,160,166,.25)}
.item-card[data-rarity="rare"]{border:1px solid rgba(79,212,245,.35)}
.item-card[data-rarity="epic"]{border:1px solid rgba(178,107,255,.4)}
.item-card[data-rarity="legendary"]{border:1px solid rgba(246,196,69,.45)}
.upgrade-success{animation:upgrade-flash 1s ease}
@keyframes upgrade-flash{0%{transform:scale(1);box-shadow:0 0 0 rgba(46,194,126,0)}25%{transform:scale(1.02);box-shadow:0 0 30px rgba(46,194,126,.6),0 0 60px rgba(46,194,126,.3)}50%{transform:scale(1);box-shadow:0 0 40px rgba(46,194,126,.8),0 0 80px rgba(46,194,126,.4)}75%{transform:scale(1.01);box-shadow:0 0 30px rgba(46,194,126,.6),0 0 60px rgba(46,194,126,.3)}100%{transform:scale(1);box-shadow:0 0 0 rgba(46,194,126,0)}}
.upgrade-fail{animation:upgrade-fail-flash 1s ease}
@keyframes upgrade-fail-flash{0%{transform:scale(1);box-shadow:0 0 0 rgba(255,92,92,0)}25%{transform:scale(0.98);box-shadow:0 0 20px rgba(255,92,92,.5),0 0 40px rgba(255,92,92,.2)}50%{transform:scale(1);box-shadow:0 0 30px rgba(255,92,92,.7),0 0 50px rgba(255,92,92,.3)}75%{transform:scale(0.99);box-shadow:0 0 20px rgba(255,92,92,.5),0 0 40px rgba(255,92,92,.2)}100%{transform:scale(1);box-shadow:0 0 0 rgba(255,92,92,0)}}
.fragment-card{display:flex;flex-direction:column;gap:8px;background:rgba(255,255,255,.06);border-radius:12px;padding:12px;border:1px solid rgba(123,44,245,.25);transition:all .3s ease;position:relative;overflow:hidden}
.fragment-card::before{content:"";position:absolute;top:0;right:0;width:40px;height:40px;background:radial-gradient(circle,rgba(123,44,245,.3),transparent);opacity:0;transition:opacity .3s ease;pointer-events:none}
.fragment-card:hover::before{opacity:1;animation:corner-pulse 2s ease-in-out infinite}
@keyframes corner-pulse{0%,100%{transform:scale(1);opacity:.3}50%{transform:scale(1.2);opacity:.6}}
.fragment-card.can-craft{border-color:rgba(46,194,126,.5);box-shadow:0 0 12px rgba(46,194,126,.2);animation:fragment-ready 2s ease-in-out infinite}
@keyframes fragment-ready{0%,100%{box-shadow:0 0 12px rgba(46,194,126,.2)}50%{box-shadow:0 0 20px rgba(46,194,126,.4),0 0 40px rgba(46,194,126,.2)}}
.fragment-icon{font-size:32px;text-align:center}
.fragment-info{display:flex;flex-direction:column;gap:4px;text-align:center}
.fragment-name{font-size:14px;font-weight:600}
.fragment-count{font-size:13px;opacity:.85}
.btn-sm{padding:6px 10px;font-size:13px;height:auto}
.ad-overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);backdrop-filter:blur(8px);z-index:10000;display:flex;align-items:center;justify-content:center;animation:fade-in .3s ease}
.ad-dialog{max-width:420px;width:90%;background:var(--panel-grad);border-radius:var(--radius-lg);box-shadow:var(--glow);padding:24px;animation:fade-in .3s ease}
.ad-content{display:flex;flex-direction:column;align-items:center;gap:12px}
.ad-icon{font-size:48px;filter:drop-shadow(0 0 12px rgba(123,44,245,.6))}
.ad-placeholder{display:flex;flex-direction:column;align-items:center;margin:12px 0;padding:20px;background:rgba(255,255,255,.04);border-radius:12px;width:100%}
.ad-progress-ring{position:relative;width:100px;height:100px}
.ad-circle-bg{fill:none;stroke:rgba(255,255,255,.1);stroke-width:8}
.ad-circle-fg{fill:none;stroke:url(#grad);stroke-width:8;stroke-linecap:round;transform:rotate(-90deg);transform-origin:50% 50%;transition:stroke-dashoffset .3s ease}
.ad-countdown{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:700}
.ad-actions{display:flex;gap:12px;width:100%}
/* \u77FF\u5DE5\u52A8\u753B */
.miner-animation{display:flex;flex-direction:column;align-items:center;gap:4px;opacity:.9}
.miner-svg{width:100px;height:100px}
.miner-body{animation:miner-bounce 1.5s ease-in-out infinite}
@keyframes miner-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
.miner-arm{transform-origin:110px 95px;animation:pickaxe-swing 1.2s ease-in-out infinite}
@keyframes pickaxe-swing{0%,100%{transform:rotate(0deg)}30%{transform:rotate(-35deg)}60%{transform:rotate(-25deg)}}
.miner-light{animation:helmet-light 2s ease-in-out infinite}
@keyframes helmet-light{0%,100%{opacity:.6}50%{opacity:1}}
.ore-particle{animation:ore-spark 1.2s ease-out infinite}
.ore-particle.p1{animation-delay:0.3s}
.ore-particle.p2{animation-delay:0.4s}
.ore-particle.p3{animation-delay:0.35s}
@keyframes ore-spark{0%{opacity:0;transform:translate(0,0) scale(1)}30%{opacity:1}100%{opacity:0;transform:translate(-10px,15px) scale(0.3)}}
.miner-status{font-size:13px;opacity:.75;letter-spacing:.05em}
.miner-idle{display:flex;flex-direction:column;align-items:center;gap:4px;opacity:.5}
.miner-idle svg{width:75px;height:75px}
.idle-miner{animation:idle-breathe 3s ease-in-out infinite}
@keyframes idle-breathe{0%,100%{opacity:.6;transform:scale(1)}50%{opacity:.8;transform:scale(1.02)}}
@keyframes warning-pulse{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.1);opacity:1}}
.critical-mining .miner-arm{animation:pickaxe-critical .4s ease-in-out 3!important}
@keyframes pickaxe-critical{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-45deg)}}
/* \u5B9D\u7BB1\u52A8\u753B */
.treasure-chest{display:inline-block;vertical-align:middle}
.chest-body{animation:chest-bounce .8s ease-in-out infinite}
@keyframes chest-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}
.chest-lid{transform-origin:50% 10px;animation:chest-open 2s ease-in-out infinite}
@keyframes chest-open{0%,90%{transform:rotateX(0deg)}95%{transform:rotateX(-15deg)}100%{transform:rotateX(0deg)}}
.chest-coins .coin{animation:coin-pop 1.5s ease-out infinite}
.coin.c1{animation-delay:0s}
.coin.c2{animation-delay:0.15s}
.coin.c3{animation-delay:0.3s}
@keyframes coin-pop{0%,80%{opacity:0;transform:translateY(0) scale(0)}85%{opacity:1;transform:translateY(-8px) scale(1.2)}100%{opacity:0;transform:translateY(-12px) scale(0.8)}}
/* \u5251\u6C14\u7279\u6548 */
.sword-slash{display:inline-block;vertical-align:middle}
.slash-trail{animation:slash-anim 1s ease-in-out infinite}
.slash1{animation-delay:0s}
.slash2{animation-delay:0.1s}
@keyframes slash-anim{0%,70%{opacity:0;stroke-dasharray:0 100;stroke-dashoffset:0}75%{opacity:0.8;stroke-dasharray:20 100;stroke-dashoffset:0}100%{opacity:0;stroke-dasharray:20 100;stroke-dashoffset:-20}}
/* \u91D1\u5E01\u65CB\u8F6C */
.spinning-coin{display:inline-block;vertical-align:middle}
.coin-spin{animation:coin-rotate 3s linear infinite}
@keyframes coin-rotate{0%{transform:rotateY(0deg)}100%{transform:rotateY(360deg)}}
/* \u5956\u676F\u52A8\u753B */
.trophy-anim{display:inline-block;vertical-align:middle}
.trophy-bounce{animation:trophy-jump 2s ease-in-out infinite}
@keyframes trophy-jump{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
.trophy-star{animation:star-twinkle 1.5s ease-in-out infinite}
@keyframes star-twinkle{0%,100%{opacity:0.6;transform:scale(1)}50%{opacity:1;transform:scale(1.3)}}
/* \u80FD\u91CF\u6CE2\u7EB9 */
.energy-ripple{opacity:0;transition:opacity .3s ease}
.btn-energy:hover .energy-ripple{opacity:1}
.ripple{animation:ripple-expand 2s ease-out infinite}
.r1{animation-delay:0s}
.r2{animation-delay:0.3s}
.r3{animation-delay:0.6s}
@keyframes ripple-expand{0%{r:20;opacity:0.6}100%{r:45;opacity:0}}
/* \u88C5\u8F7D\u7C92\u5B50\u6D41 */
.loading-particles{opacity:0;transition:opacity .3s ease}
.mine-progress-fill:not([style*="width: 0"]) ~ .loading-particles{opacity:1}
.particle{animation:particle-flow 2s linear infinite}
.part1{animation-delay:0s}
.part2{animation-delay:0.4s}
.part3{animation-delay:0.8s}
@keyframes particle-flow{0%{cx:0;opacity:0}10%{opacity:1}90%{opacity:1}100%{cx:400;opacity:0}}
/* \u8D44\u6E90\u5361\u7247\u7C92\u5B50 */
.stat-particles{opacity:0;transition:opacity .3s ease}
.stat-animated:hover .stat-particles{opacity:1}
.stat-particle{animation:stat-float 3s ease-in-out infinite}
.sp1{animation-delay:0s}
.sp2{animation-delay:0.5s}
.sp3{animation-delay:1s}
@keyframes stat-float{0%{cy:25;opacity:0}30%{opacity:0.6}60%{cy:15;opacity:0.8}100%{cy:8;opacity:0}}
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
.toast{max-width:340px;padding:10px 12px;border-radius:12px;color:#fff;background:rgba(30,30,50,.96);box-shadow:var(--glow);position:relative;overflow:hidden;border:1px solid rgba(123,44,245,.3);animation:toast-slide-in .3s ease}
.toast.success{background:linear-gradient(180deg,rgba(46,194,126,.16),rgba(30,30,50,.96))}
.toast.warn{background:linear-gradient(180deg,rgba(246,196,69,.18),rgba(30,30,50,.96))}
.toast.error{background:linear-gradient(180deg,rgba(255,92,92,.18),rgba(30,30,50,.96))}
.toast .life{position:absolute;left:0;bottom:0;height:2px;background:#7B2CF5;animation:toast-life var(--life,3.5s) linear forwards}
@keyframes toast-life{from{width:100%}to{width:0}}
@keyframes toast-slide-in{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vZnJvbnRlbmQtc2NyaXB0cy9jb3JlL05ldHdvcmtNYW5hZ2VyLnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvY29yZS9HYW1lTWFuYWdlci50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL3V0aWxzL2RvbS50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvbXBvbmVudHMvSWNvbi50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvbXBvbmVudHMvVG9hc3QudHMiLCAiLi4vZnJvbnRlbmQtc2NyaXB0cy9zY2VuZXMvTG9naW5TY2VuZS50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvcmUvRW52LnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvY29yZS9SZWFsdGltZUNsaWVudC50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvbXBvbmVudHMvTmF2LnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvY29tcG9uZW50cy9Db3VudFVwVGV4dC50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvbXBvbmVudHMvUmVzb3VyY2VCYXIudHMiLCAiLi4vZnJvbnRlbmQtc2NyaXB0cy9jb21wb25lbnRzL0FkRGlhbG9nLnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvY29tcG9uZW50cy9NaW5lckFuaW1hdGlvbi50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvbXBvbmVudHMvQW5pbWF0ZWRJY29ucy50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL3NjZW5lcy9NYWluU2NlbmUudHMiLCAiLi4vZnJvbnRlbmQtc2NyaXB0cy9zY2VuZXMvV2FyZWhvdXNlU2NlbmUudHMiLCAiLi4vZnJvbnRlbmQtc2NyaXB0cy9zY2VuZXMvUGx1bmRlclNjZW5lLnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvc2NlbmVzL0V4Y2hhbmdlU2NlbmUudHMiLCAiLi4vZnJvbnRlbmQtc2NyaXB0cy9zY2VuZXMvUmFua2luZ1NjZW5lLnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvc3R5bGVzL2luamVjdC50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL0FwcC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiZXhwb3J0IGNsYXNzIE5ldHdvcmtNYW5hZ2VyIHtcclxuICBwcml2YXRlIHN0YXRpYyBfaW5zdGFuY2U6IE5ldHdvcmtNYW5hZ2VyO1xyXG4gIHN0YXRpYyBnZXQgSSgpOiBOZXR3b3JrTWFuYWdlciB7IHJldHVybiB0aGlzLl9pbnN0YW5jZSA/PyAodGhpcy5faW5zdGFuY2UgPSBuZXcgTmV0d29ya01hbmFnZXIoKSk7IH1cclxuXHJcbiAgcHJpdmF0ZSB0b2tlbjogc3RyaW5nIHwgbnVsbCA9IG51bGw7XHJcbiAgXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAvLyBcdTRFQ0UgbG9jYWxTdG9yYWdlIFx1NjA2Mlx1NTkwRCB0b2tlblxyXG4gICAgdGhpcy50b2tlbiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdhdXRoX3Rva2VuJyk7XHJcbiAgfVxyXG4gIFxyXG4gIHNldFRva2VuKHQ6IHN0cmluZyB8IG51bGwpIHsgXHJcbiAgICB0aGlzLnRva2VuID0gdDtcclxuICAgIGlmICh0KSB7XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdhdXRoX3Rva2VuJywgdCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnYXV0aF90b2tlbicpO1xyXG4gICAgfVxyXG4gIH1cclxuICBcclxuICBnZXRUb2tlbigpOiBzdHJpbmcgfCBudWxsIHtcclxuICAgIHJldHVybiB0aGlzLnRva2VuO1xyXG4gIH1cclxuICBcclxuICBjbGVhclRva2VuKCkge1xyXG4gICAgdGhpcy5zZXRUb2tlbihudWxsKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIHJlcXVlc3Q8VD4ocGF0aDogc3RyaW5nLCBpbml0PzogUmVxdWVzdEluaXQpOiBQcm9taXNlPFQ+IHtcclxuICAgIGNvbnN0IGhlYWRlcnM6IGFueSA9IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJywgLi4uKGluaXQ/LmhlYWRlcnMgfHwge30pIH07XHJcbiAgICBpZiAodGhpcy50b2tlbikgaGVhZGVyc1snQXV0aG9yaXphdGlvbiddID0gYEJlYXJlciAke3RoaXMudG9rZW59YDtcclxuICAgIFxyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2godGhpcy5nZXRCYXNlKCkgKyBwYXRoLCB7IC4uLmluaXQsIGhlYWRlcnMgfSk7XHJcbiAgICAgIGNvbnN0IGpzb24gPSBhd2FpdCByZXMuanNvbigpO1xyXG4gICAgICBcclxuICAgICAgLy8gNDAxIFx1NjcyQVx1NjM4OFx1Njc0M1x1RkYwQ1x1NkUwNVx1OTY2NCB0b2tlbiBcdTVFNzZcdThERjNcdThGNkNcdTc2N0JcdTVGNTVcclxuICAgICAgaWYgKHJlcy5zdGF0dXMgPT09IDQwMSkge1xyXG4gICAgICAgIHRoaXMuY2xlYXJUb2tlbigpO1xyXG4gICAgICAgIGlmIChsb2NhdGlvbi5oYXNoICE9PSAnIy9sb2dpbicpIHtcclxuICAgICAgICAgIGxvY2F0aW9uLmhhc2ggPSAnIy9sb2dpbic7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignXHU3NjdCXHU1RjU1XHU1REYyXHU4RkM3XHU2NzFGXHVGRjBDXHU4QkY3XHU5MUNEXHU2NUIwXHU3NjdCXHU1RjU1Jyk7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIGlmICghcmVzLm9rIHx8IGpzb24uY29kZSA+PSA0MDApIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoanNvbi5tZXNzYWdlIHx8ICdSZXF1ZXN0IEVycm9yJyk7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIHJldHVybiBqc29uLmRhdGEgYXMgVDtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIC8vIFx1N0Y1MVx1N0VEQ1x1OTUxOVx1OEJFRlx1NTkwNFx1NzQwNlxyXG4gICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBUeXBlRXJyb3IgJiYgZXJyb3IubWVzc2FnZS5pbmNsdWRlcygnZmV0Y2gnKSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignXHU3RjUxXHU3RURDXHU4RkRFXHU2M0E1XHU1OTMxXHU4RDI1XHVGRjBDXHU4QkY3XHU2OEMwXHU2N0U1XHU3RjUxXHU3RURDXHU2MjE2XHU1NDBFXHU3QUVGXHU2NzBEXHU1MkExJyk7XHJcbiAgICAgIH1cclxuICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRCYXNlKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gKHdpbmRvdyBhcyBhbnkpLl9fQVBJX0JBU0VfXyB8fCAnaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaSc7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuIiwgImltcG9ydCB7IE5ldHdvcmtNYW5hZ2VyIH0gZnJvbSAnLi9OZXR3b3JrTWFuYWdlcic7XHJcblxyXG5leHBvcnQgdHlwZSBQcm9maWxlID0geyBpZDogc3RyaW5nOyB1c2VybmFtZTogc3RyaW5nOyBuaWNrbmFtZTogc3RyaW5nOyBvcmVBbW91bnQ6IG51bWJlcjsgYmJDb2luczogbnVtYmVyIH07XHJcblxyXG5leHBvcnQgY2xhc3MgR2FtZU1hbmFnZXIge1xyXG4gIHByaXZhdGUgc3RhdGljIF9pbnN0YW5jZTogR2FtZU1hbmFnZXI7XHJcbiAgc3RhdGljIGdldCBJKCk6IEdhbWVNYW5hZ2VyIHsgcmV0dXJuIHRoaXMuX2luc3RhbmNlID8/ICh0aGlzLl9pbnN0YW5jZSA9IG5ldyBHYW1lTWFuYWdlcigpKTsgfVxyXG5cclxuICBwcml2YXRlIHByb2ZpbGU6IFByb2ZpbGUgfCBudWxsID0gbnVsbDtcclxuICBnZXRQcm9maWxlKCk6IFByb2ZpbGUgfCBudWxsIHsgcmV0dXJuIHRoaXMucHJvZmlsZTsgfVxyXG5cclxuICBhc3luYyBsb2dpbk9yUmVnaXN0ZXIodXNlcm5hbWU6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgY29uc3Qgbm0gPSBOZXR3b3JrTWFuYWdlci5JO1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgciA9IGF3YWl0IG5tLnJlcXVlc3Q8eyBhY2Nlc3NfdG9rZW46IHN0cmluZzsgdXNlcjogYW55IH0+KCcvYXV0aC9sb2dpbicsIHsgbWV0aG9kOiAnUE9TVCcsIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgdXNlcm5hbWUsIHBhc3N3b3JkIH0pIH0pO1xyXG4gICAgICBubS5zZXRUb2tlbihyLmFjY2Vzc190b2tlbik7XHJcbiAgICB9IGNhdGNoIHtcclxuICAgICAgY29uc3QgciA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IGFjY2Vzc190b2tlbjogc3RyaW5nOyB1c2VyOiBhbnkgfT4oJy9hdXRoL3JlZ2lzdGVyJywgeyBtZXRob2Q6ICdQT1NUJywgYm9keTogSlNPTi5zdHJpbmdpZnkoeyB1c2VybmFtZSwgcGFzc3dvcmQgfSkgfSk7XHJcbiAgICAgIE5ldHdvcmtNYW5hZ2VyLkkuc2V0VG9rZW4oci5hY2Nlc3NfdG9rZW4pO1xyXG4gICAgfVxyXG4gICAgdGhpcy5wcm9maWxlID0gYXdhaXQgbm0ucmVxdWVzdDxQcm9maWxlPignL3VzZXIvcHJvZmlsZScpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgdHJ5UmVzdG9yZVNlc3Npb24oKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICBjb25zdCBubSA9IE5ldHdvcmtNYW5hZ2VyLkk7XHJcbiAgICBjb25zdCB0b2tlbiA9IG5tLmdldFRva2VuKCk7XHJcbiAgICBpZiAoIXRva2VuKSByZXR1cm4gZmFsc2U7XHJcbiAgICBcclxuICAgIHRyeSB7XHJcbiAgICAgIHRoaXMucHJvZmlsZSA9IGF3YWl0IG5tLnJlcXVlc3Q8UHJvZmlsZT4oJy91c2VyL3Byb2ZpbGUnKTtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9IGNhdGNoIHtcclxuICAgICAgLy8gVG9rZW4gXHU1OTMxXHU2NTQ4XHVGRjBDXHU2RTA1XHU5NjY0XHJcbiAgICAgIG5tLmNsZWFyVG9rZW4oKTtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbG9nb3V0KCkge1xyXG4gICAgTmV0d29ya01hbmFnZXIuSS5jbGVhclRva2VuKCk7XHJcbiAgICB0aGlzLnByb2ZpbGUgPSBudWxsO1xyXG4gICAgbG9jYXRpb24uaGFzaCA9ICcjL2xvZ2luJztcclxuICB9XHJcbn1cclxuXHJcblxyXG4iLCAiZXhwb3J0IGZ1bmN0aW9uIGh0bWwodGVtcGxhdGU6IHN0cmluZyk6IEhUTUxFbGVtZW50IHtcclxuICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICBkaXYuaW5uZXJIVE1MID0gdGVtcGxhdGUudHJpbSgpO1xyXG4gIHJldHVybiBkaXYuZmlyc3RFbGVtZW50Q2hpbGQgYXMgSFRNTEVsZW1lbnQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBxczxUIGV4dGVuZHMgRWxlbWVudCA9IEhUTUxFbGVtZW50Pihyb290OiBQYXJlbnROb2RlLCBzZWw6IHN0cmluZyk6IFQge1xyXG4gIGNvbnN0IGVsID0gcm9vdC5xdWVyeVNlbGVjdG9yKHNlbCkgYXMgVCB8IG51bGw7XHJcbiAgaWYgKCFlbCkgdGhyb3cgbmV3IEVycm9yKGBNaXNzaW5nIGVsZW1lbnQ6ICR7c2VsfWApO1xyXG4gIHJldHVybiBlbCBhcyBUO1xyXG59XHJcblxyXG5cclxuIiwgImltcG9ydCB7IGh0bWwgfSBmcm9tICcuLi91dGlscy9kb20nO1xuXG5leHBvcnQgdHlwZSBJY29uTmFtZSA9XG4gIHwgJ2hvbWUnXG4gIHwgJ3dhcmVob3VzZSdcbiAgfCAncGx1bmRlcidcbiAgfCAnZXhjaGFuZ2UnXG4gIHwgJ3JhbmtpbmcnXG4gIHwgJ29yZSdcbiAgfCAnY29pbidcbiAgfCAncGljaydcbiAgfCAncmVmcmVzaCdcbiAgfCAncGxheSdcbiAgfCAnc3RvcCdcbiAgfCAnY29sbGVjdCdcbiAgfCAnd3JlbmNoJ1xuICB8ICdzaGllbGQnXG4gIHwgJ2xpc3QnXG4gIHwgJ3VzZXInXG4gIHwgJ2xvY2snXG4gIHwgJ2V5ZSdcbiAgfCAnZXllLW9mZidcbiAgfCAnc3dvcmQnXG4gIHwgJ3Ryb3BoeSdcbiAgfCAnY2xvY2snXG4gIHwgJ2JvbHQnXG4gIHwgJ3RyYXNoJ1xuICB8ICdjbG9zZSdcbiAgfCAnYXJyb3ctcmlnaHQnXG4gIHwgJ3RhcmdldCdcbiAgfCAnYm94J1xuICB8ICdpbmZvJ1xuICB8ICdsb2dvdXQnXG4gIHwgJ3gnO1xuXG5mdW5jdGlvbiBncmFkKGlkOiBzdHJpbmcpIHtcbiAgcmV0dXJuIGA8ZGVmcz5cbiAgICA8bGluZWFyR3JhZGllbnQgaWQ9XCIke2lkfVwiIHgxPVwiMFwiIHkxPVwiMFwiIHgyPVwiMVwiIHkyPVwiMVwiPlxuICAgICAgPHN0b3Agb2Zmc2V0PVwiMCVcIiBzdG9wLWNvbG9yPVwiIzdCMkNGNVwiIC8+XG4gICAgICA8c3RvcCBvZmZzZXQ9XCIxMDAlXCIgc3RvcC1jb2xvcj1cIiMyQzg5RjVcIiAvPlxuICAgIDwvbGluZWFyR3JhZGllbnQ+XG4gIDwvZGVmcz5gO1xufVxuXG5mdW5jdGlvbiBzdmdXcmFwKHBhdGg6IHN0cmluZywgc2l6ZSA9IDE4LCBjbHMgPSAnJyk6IEhUTUxFbGVtZW50IHtcbiAgY29uc3QgZ2lkID0gJ2lnLScgKyBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zbGljZSgyLCA4KTtcbiAgY29uc3QgZWwgPSBodG1sKGA8c3BhbiBjbGFzcz1cImljb24gJHtjbHN9XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+JHtcbiAgICBgPHN2ZyB3aWR0aD1cIiR7c2l6ZX1cIiBoZWlnaHQ9XCIke3NpemV9XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPiR7Z3JhZChnaWQpfSR7cGF0aC5yZXBsYWNlQWxsKCdfX0dSQURfXycsIGB1cmwoIyR7Z2lkfSlgKX08L3N2Zz5gXG4gIH08L3NwYW4+YCk7XG4gIHJldHVybiBlbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlckljb24obmFtZTogSWNvbk5hbWUsIG9wdHM6IHsgc2l6ZT86IG51bWJlcjsgY2xhc3NOYW1lPzogc3RyaW5nIH0gPSB7fSkge1xuICBjb25zdCBzaXplID0gb3B0cy5zaXplID8/IDE4O1xuICBjb25zdCBjbHMgPSBvcHRzLmNsYXNzTmFtZSA/PyAnJztcbiAgY29uc3Qgc3Ryb2tlID0gJ3N0cm9rZT1cIl9fR1JBRF9fXCIgc3Ryb2tlLXdpZHRoPVwiMS43XCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCInO1xuICBjb25zdCBmaWxsID0gJ2ZpbGw9XCJfX0dSQURfX1wiJztcblxuICBzd2l0Y2ggKG5hbWUpIHtcbiAgICBjYXNlICdob21lJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTMgMTAuNUwxMiAzbDkgNy41XCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTUuNSA5LjVWMjFoMTNWOS41XCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTkuNSAyMXYtNmg1djZcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnd2FyZWhvdXNlJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTMgOWw5LTUgOSA1djkuNWMwIDEtMSAyLTIgMkg1Yy0xIDAtMi0xLTItMlY5elwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk03IDEyaDEwTTcgMTZoMTBcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAncGx1bmRlcic6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk00IDIwbDctN00xMyAxM2w3IDdNOSA1bDYgNk0xNSA1bC02IDZcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnZXhjaGFuZ2UnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNNiA4aDExbC0zLTNNMTggMTZIN2wzIDNcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAncmFua2luZyc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk04IDE0djZNMTIgMTB2MTBNMTYgNnYxNFwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk0xNiA0LjVhMiAyIDAgMTAwLTQgMiAyIDAgMDAwIDR6XCIgJHtmaWxsfS8+YCAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnb3JlJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTEyIDNsNiA0LTIgOC00IDYtNC02LTItOCA2LTR6XCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTEyIDNsLTIgOCAyIDEwIDItMTAtMi04elwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdjb2luJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjguNVwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk04LjUgMTJoN00xMCA5aDRNMTAgMTVoNFwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdwaWNrJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTQgNWM0LTMgOS0yIDEyIDFNOSAxMGwtNSA1TTkgMTBsMiAyTTcgMTJsMiAyXCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTExIDEybDcgN1wiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdyZWZyZXNoJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTIwIDEyYTggOCAwIDEwLTIuMyA1LjdcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNMjAgMTJ2NmgtNlwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdwbGF5JzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTggNnYxMmwxMC02LTEwLTZ6XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ3N0b3AnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxyZWN0IHg9XCI3XCIgeT1cIjdcIiB3aWR0aD1cIjEwXCIgaGVpZ2h0PVwiMTBcIiByeD1cIjJcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnY29sbGVjdCc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0xMiA1djEwXCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTggMTFsNCA0IDQtNFwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk01IDE5aDE0XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ3dyZW5jaCc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0xNS41IDZhNC41IDQuNSAwIDExLTYuOSA1LjRMMyAxN2w0LjYtNS42QTQuNSA0LjUgMCAxMTE1LjUgNnpcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnc2hpZWxkJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTEyIDNsOCAzdjZhMTAgMTAgMCAwMS04IDkgMTAgMTAgMCAwMS04LTlWNmw4LTN6XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ2xpc3QnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNNyA2aDEyTTcgMTJoMTJNNyAxOGgxMlwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk00IDZoLjAxTTQgMTJoLjAxTTQgMThoLjAxXCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ3VzZXInOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNMTIgMTJhNCA0IDAgMTAwLTggNCA0IDAgMDAwIDh6XCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTQgMjBhOCA4IDAgMDExNiAwXCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ2xvY2snOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxyZWN0IHg9XCI1XCIgeT1cIjEwXCIgd2lkdGg9XCIxNFwiIGhlaWdodD1cIjEwXCIgcng9XCIyXCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTggMTBWN2E0IDQgMCAxMTggMHYzXCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ2V5ZSc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0yIDEyczQtNyAxMC03IDEwIDcgMTAgNy00IDctMTAgNy0xMC03LTEwLTd6XCIgJHtzdHJva2V9Lz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjNcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnZXllLW9mZic6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0yIDEyczQtNyAxMC03IDEwIDcgMTAgNy00IDctMTAgNy0xMC03LTEwLTd6XCIgJHtzdHJva2V9Lz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjNcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNMyAzbDE4IDE4XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ3N3b3JkJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTMgMjFsNi02TTkgMTVsOS05IDMgMy05IDlNMTQgNmw0IDRcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAndHJvcGh5JzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTggMjFoOE05IDE3aDZNNyA0aDEwdjVhNSA1IDAgMTEtMTAgMFY0elwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk00IDZoM3YyYTMgMyAwIDExLTMtMnpNMjAgNmgtM3YyYTMgMyAwIDAwMy0yelwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdjbG9jayc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCI4LjVcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNMTIgN3Y2bDQgMlwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdib2x0JzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTEzIDJMNiAxNGg1bC0xIDggNy0xMmgtNWwxLTh6XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ3RyYXNoJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTQgN2gxNk05IDdWNWg2djJNNyA3bDEgMTNoOGwxLTEzXCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ2Nsb3NlJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTYgNmwxMiAxMk02IDE4TDE4IDZcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnYXJyb3ctcmlnaHQnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNNCAxMmgxNE0xMiA1bDcgNy03IDdcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAndGFyZ2V0JzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjguNVwiICR7c3Ryb2tlfS8+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCI0LjVcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNMTIgMnYzTTEyIDE5djNNMiAxMmgzTTE5IDEyaDNcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnYm94JzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTEyIDNsOSA1LTkgNS05LTUgOS01elwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk0zIDh2OGw5IDUgOS01VjhcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNMTIgMTN2OFwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdpbmZvJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjguNVwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk0xMiAxMHY2XCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTEyIDdoLjAxXCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ2xvZ291dCc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0xNCA4VjVhMSAxIDAgMDAtMS0xSDVhMSAxIDAgMDAtMSAxdjE0YTEgMSAwIDAwMSAxaDhhMSAxIDAgMDAxLTF2LTNcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNOSAxMmgxMU0xNiA4bDQgNC00IDRcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAneCc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk02IDZsMTIgMTJNMTggNkw2IDE4XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCI5XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICB9XG59XG4iLCAiaW1wb3J0IHsgcmVuZGVySWNvbiB9IGZyb20gJy4vSWNvbic7XG5cbmxldCBfYm94OiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuXG5mdW5jdGlvbiBlbnN1cmVCb3goKTogSFRNTEVsZW1lbnQge1xuICBpZiAoX2JveCkgcmV0dXJuIF9ib3g7XG4gIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBkaXYuY2xhc3NOYW1lID0gJ3RvYXN0LXdyYXAnO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRpdik7XG4gIF9ib3ggPSBkaXY7XG4gIHJldHVybiBkaXY7XG59XG5cbnR5cGUgVG9hc3RUeXBlID0gJ2luZm8nIHwgJ3N1Y2Nlc3MnIHwgJ3dhcm4nIHwgJ2Vycm9yJztcbnR5cGUgVG9hc3RPcHRpb25zID0geyB0eXBlPzogVG9hc3RUeXBlOyBkdXJhdGlvbj86IG51bWJlciB9O1xuXG5leHBvcnQgZnVuY3Rpb24gc2hvd1RvYXN0KHRleHQ6IHN0cmluZywgb3B0cz86IFRvYXN0VHlwZSB8IFRvYXN0T3B0aW9ucykge1xuICBjb25zdCBib3ggPSBlbnN1cmVCb3goKTtcbiAgY29uc3QgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBsZXQgdHlwZTogVG9hc3RUeXBlIHwgdW5kZWZpbmVkO1xuICBsZXQgZHVyYXRpb24gPSAzNTAwO1xuICBpZiAodHlwZW9mIG9wdHMgPT09ICdzdHJpbmcnKSB0eXBlID0gb3B0cztcbiAgZWxzZSBpZiAob3B0cykgeyB0eXBlID0gb3B0cy50eXBlOyBpZiAob3B0cy5kdXJhdGlvbikgZHVyYXRpb24gPSBvcHRzLmR1cmF0aW9uOyB9XG4gIGl0ZW0uY2xhc3NOYW1lID0gJ3RvYXN0JyArICh0eXBlID8gJyAnICsgdHlwZSA6ICcnKTtcbiAgLy8gaWNvbiArIHRleHQgY29udGFpbmVyXG4gIHRyeSB7XG4gICAgY29uc3Qgd3JhcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHdyYXAuc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcbiAgICB3cmFwLnN0eWxlLmdhcCA9ICc4cHgnO1xuICAgIHdyYXAuc3R5bGUuYWxpZ25JdGVtcyA9ICdjZW50ZXInO1xuICAgIGNvbnN0IGljb05hbWUgPSB0eXBlID09PSAnc3VjY2VzcycgPyAnYm9sdCcgOiB0eXBlID09PSAnd2FybicgPyAnY2xvY2snIDogdHlwZSA9PT0gJ2Vycm9yJyA/ICdjbG9zZScgOiAnaW5mbyc7XG4gICAgY29uc3QgaWNvSG9zdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBpY29Ib3N0LmFwcGVuZENoaWxkKHJlbmRlckljb24oaWNvTmFtZSwgeyBzaXplOiAxOCB9KSk7XG4gICAgY29uc3QgdHh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdHh0LnRleHRDb250ZW50ID0gdGV4dDtcbiAgICB3cmFwLmFwcGVuZENoaWxkKGljb0hvc3QpO1xuICAgIHdyYXAuYXBwZW5kQ2hpbGQodHh0KTtcbiAgICBpdGVtLmFwcGVuZENoaWxkKHdyYXApO1xuICB9IGNhdGNoIHtcbiAgICBpdGVtLnRleHRDb250ZW50ID0gdGV4dDtcbiAgfVxuICBjb25zdCBsaWZlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaScpO1xuICBsaWZlLmNsYXNzTmFtZSA9ICdsaWZlJztcbiAgbGlmZS5zdHlsZS5zZXRQcm9wZXJ0eSgnLS1saWZlJywgZHVyYXRpb24gKyAnbXMnKTtcbiAgaXRlbS5hcHBlbmRDaGlsZChsaWZlKTtcbiAgYm94LnByZXBlbmQoaXRlbSk7XG4gIC8vIGdyYWNlZnVsIGV4aXRcbiAgY29uc3QgZmFkZSA9ICgpID0+IHsgaXRlbS5zdHlsZS5vcGFjaXR5ID0gJzAnOyBpdGVtLnN0eWxlLnRyYW5zaXRpb24gPSAnb3BhY2l0eSAuNDVzJzsgc2V0VGltZW91dCgoKSA9PiBpdGVtLnJlbW92ZSgpLCA0NjApOyB9O1xuICBjb25zdCB0aW1lciA9IHdpbmRvdy5zZXRUaW1lb3V0KGZhZGUsIGR1cmF0aW9uKTtcbiAgaXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHsgY2xlYXJUaW1lb3V0KHRpbWVyKTsgZmFkZSgpOyB9KTtcbn1cbiIsICJpbXBvcnQgeyBHYW1lTWFuYWdlciB9IGZyb20gJy4uL2NvcmUvR2FtZU1hbmFnZXInO1xuaW1wb3J0IHsgaHRtbCwgcXMgfSBmcm9tICcuLi91dGlscy9kb20nO1xuaW1wb3J0IHsgc2hvd1RvYXN0IH0gZnJvbSAnLi4vY29tcG9uZW50cy9Ub2FzdCc7XG5pbXBvcnQgeyByZW5kZXJJY29uIH0gZnJvbSAnLi4vY29tcG9uZW50cy9JY29uJztcblxuZXhwb3J0IGNsYXNzIExvZ2luU2NlbmUge1xuICBtb3VudChyb290OiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnN0IHZpZXcgPSBodG1sKGBcbiAgICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXIgZ3JpZC0yXCIgc3R5bGU9XCJjb2xvcjojZmZmO1wiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZCBmYWRlLWluXCIgc3R5bGU9XCJtYXgtd2lkdGg6NDYwcHg7bWFyZ2luOjQ2cHggYXV0bztcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwic2NlbmUtaGVhZGVyXCI+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8aDEgc3R5bGU9XCJiYWNrZ3JvdW5kOnZhcigtLWdyYWQpOy13ZWJraXQtYmFja2dyb3VuZC1jbGlwOnRleHQ7YmFja2dyb3VuZC1jbGlwOnRleHQ7Y29sb3I6dHJhbnNwYXJlbnQ7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6OHB4O1wiPjxzcGFuIGRhdGEtaWNvPVwiaG9tZVwiPjwvc3Bhbj5cdTc3RkZcdTU3M0FcdTYzMDdcdTYzMjVcdTRFMkRcdTVGQzM8L2gxPlxuICAgICAgICAgICAgICA8cD5cdTc2N0JcdTVGNTVcdTU0MEVcdThGREJcdTUxNjVcdTRGNjBcdTc2ODRcdThENUJcdTUzNUFcdTc3RkZcdTU3Q0VcdTMwMDI8L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8aW5wdXQgaWQ9XCJ1XCIgY2xhc3M9XCJpbnB1dFwiIHBsYWNlaG9sZGVyPVwiXHU3NTI4XHU2MjM3XHU1NDBEXCIgYXV0b2NvbXBsZXRlPVwidXNlcm5hbWVcIi8+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiIHN0eWxlPVwiYWxpZ24taXRlbXM6Y2VudGVyO1wiPlxuICAgICAgICAgICAgPGlucHV0IGlkPVwicFwiIGNsYXNzPVwiaW5wdXRcIiBwbGFjZWhvbGRlcj1cIlx1NUJDNlx1NzgwMVwiIHR5cGU9XCJwYXNzd29yZFwiIGF1dG9jb21wbGV0ZT1cImN1cnJlbnQtcGFzc3dvcmRcIi8+XG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwicmV2ZWFsXCIgY2xhc3M9XCJidG4gYnRuLWdob3N0XCIgc3R5bGU9XCJtaW4td2lkdGg6MTEwcHg7XCI+PHNwYW4gZGF0YS1pY289XCJleWVcIj48L3NwYW4+XHU2NjNFXHU3OTNBPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGJ1dHRvbiBpZD1cImdvXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIiBzdHlsZT1cIndpZHRoOjEwMCU7bWFyZ2luLXRvcDo4cHg7XCI+PHNwYW4gZGF0YS1pY289XCJhcnJvdy1yaWdodFwiPjwvc3Bhbj5cdThGREJcdTUxNjVcdTZFMzhcdTYyMEY8L2J1dHRvbj5cbiAgICAgICAgICA8ZGl2IHN0eWxlPVwibWFyZ2luLXRvcDo4cHg7b3BhY2l0eTouNzU7Zm9udC1zaXplOjEycHg7XCI+XHU2M0QwXHU3OTNBXHVGRjFBXHU4MkU1XHU4RDI2XHU2MjM3XHU0RTBEXHU1QjU4XHU1NzI4XHVGRjBDXHU1QzA2XHU4MUVBXHU1MkE4XHU1MjFCXHU1RUZBXHU1RTc2XHU3NjdCXHU1RjU1XHUzMDAyPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgYCk7XG4gICAgcm9vdC5pbm5lckhUTUwgPSAnJztcbiAgICByb290LmFwcGVuZENoaWxkKHZpZXcpO1xuXG4gICAgLy8gXHU2RTMyXHU2N0QzXHU2MjQwXHU2NzA5XHU1NkZFXHU2ODA3XG4gICAgdHJ5IHtcbiAgICAgIHZpZXcucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtaWNvXScpLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgIGNvbnN0IG5hbWUgPSAoZWwgYXMgSFRNTEVsZW1lbnQpLmdldEF0dHJpYnV0ZSgnZGF0YS1pY28nKSBhcyBhbnk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZWwuYXBwZW5kQ2hpbGQocmVuZGVySWNvbihuYW1lLCB7IHNpemU6IDIyIH0pKTtcbiAgICAgICAgfSBjYXRjaCB7fVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCB7fVxuXG4gICAgY29uc3QgdUVsID0gcXM8SFRNTElucHV0RWxlbWVudD4odmlldywgJyN1Jyk7XG4gICAgY29uc3QgcEVsID0gcXM8SFRNTElucHV0RWxlbWVudD4odmlldywgJyNwJyk7XG4gICAgY29uc3QgZ28gPSBxczxIVE1MQnV0dG9uRWxlbWVudD4odmlldywgJyNnbycpO1xuICAgIGNvbnN0IHJldmVhbCA9IHFzPEhUTUxCdXR0b25FbGVtZW50Pih2aWV3LCAnI3JldmVhbCcpO1xuXG4gICAgLy8gXHU0RjdGXHU3NTI4IHJlcXVlc3RBbmltYXRpb25GcmFtZSBcdTc4NkVcdTRGRERcdTZFMzJcdTY3RDNcdTVCOENcdTYyMTBcdTU0MEVcdTdBQ0JcdTUzNzNcdTgwNUFcdTcxMjZcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgdUVsLmZvY3VzKCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGNvbnN0IHN1Ym1pdCA9IGFzeW5jICgpID0+IHtcbiAgICAgIGlmIChnby5kaXNhYmxlZCkgcmV0dXJuOyAvLyBcdTk2MzJcdTZCNjJcdTkxQ0RcdTU5MERcdTcwQjlcdTUxRkJcbiAgICAgIFxuICAgICAgY29uc3QgdXNlcm5hbWUgPSAodUVsLnZhbHVlIHx8ICcnKS50cmltKCk7XG4gICAgICBjb25zdCBwYXNzd29yZCA9IChwRWwudmFsdWUgfHwgJycpLnRyaW0oKTtcbiAgICAgIGlmICghdXNlcm5hbWUgfHwgIXBhc3N3b3JkKSB7XG4gICAgICAgIHNob3dUb2FzdCgnXHU4QkY3XHU1ODZCXHU1MTk5XHU3NTI4XHU2MjM3XHU1NDBEXHU1NDhDXHU1QkM2XHU3ODAxJywgJ3dhcm4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHVzZXJuYW1lLmxlbmd0aCA8IDMgfHwgdXNlcm5hbWUubGVuZ3RoID4gMjApIHtcbiAgICAgICAgc2hvd1RvYXN0KCdcdTc1MjhcdTYyMzdcdTU0MERcdTk1N0ZcdTVFQTZcdTVFOTRcdTU3MjggMy0yMCBcdTRFMkFcdTVCNTdcdTdCMjZcdTRFNEJcdTk1RjQnLCAnd2FybicpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAocGFzc3dvcmQubGVuZ3RoIDwgMykge1xuICAgICAgICBzaG93VG9hc3QoJ1x1NUJDNlx1NzgwMVx1ODFGM1x1NUMxMVx1OTcwMFx1ODk4MSAzIFx1NEUyQVx1NUI1N1x1N0IyNicsICd3YXJuJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGdvLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIGNvbnN0IG9yaWdpbmFsSFRNTCA9IGdvLmlubmVySFRNTDtcbiAgICAgIGdvLmlubmVySFRNTCA9ICc8c3BhbiBkYXRhLWljbz1cImFycm93LXJpZ2h0XCI+PC9zcGFuPlx1NzY3Qlx1NUY1NVx1NEUyRFx1MjAyNic7XG4gICAgICB0cnkge1xuICAgICAgICB2aWV3LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWljb10nKS5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICAgIGNvbnN0IG5hbWUgPSAoZWwgYXMgSFRNTEVsZW1lbnQpLmdldEF0dHJpYnV0ZSgnZGF0YS1pY28nKSBhcyBhbnk7XG4gICAgICAgICAgdHJ5IHsgZWwuYXBwZW5kQ2hpbGQocmVuZGVySWNvbihuYW1lLCB7IHNpemU6IDIwIH0pKTsgfSBjYXRjaCB7fVxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2gge31cbiAgICAgIFxuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgR2FtZU1hbmFnZXIuSS5sb2dpbk9yUmVnaXN0ZXIodXNlcm5hbWUsIHBhc3N3b3JkKTtcbiAgICAgICAgbG9jYXRpb24uaGFzaCA9ICcjL21haW4nO1xuICAgICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgIHNob3dUb2FzdChlPy5tZXNzYWdlIHx8ICdcdTc2N0JcdTVGNTVcdTU5MzFcdThEMjVcdUZGMENcdThCRjdcdTkxQ0RcdThCRDUnLCAnZXJyb3InKTtcbiAgICAgICAgLy8gXHU1OTMxXHU4RDI1XHU2NUY2XHU2MDYyXHU1OTBEXHU2MzA5XHU5NEFFXG4gICAgICAgIGdvLmlubmVySFRNTCA9IG9yaWdpbmFsSFRNTDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB2aWV3LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWljb10nKS5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbmFtZSA9IChlbCBhcyBIVE1MRWxlbWVudCkuZ2V0QXR0cmlidXRlKCdkYXRhLWljbycpIGFzIGFueTtcbiAgICAgICAgICAgIHRyeSB7IGVsLmFwcGVuZENoaWxkKHJlbmRlckljb24obmFtZSwgeyBzaXplOiAyMCB9KSk7IH0gY2F0Y2gge31cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCB7fVxuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgZ28uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgZ28ub25jbGljayA9IHN1Ym1pdDtcbiAgICB1RWwub25rZXl1cCA9IChlKSA9PiB7IGlmICgoZSBhcyBLZXlib2FyZEV2ZW50KS5rZXkgPT09ICdFbnRlcicpIHN1Ym1pdCgpOyB9O1xuICAgIHBFbC5vbmtleXVwID0gKGUpID0+IHsgaWYgKChlIGFzIEtleWJvYXJkRXZlbnQpLmtleSA9PT0gJ0VudGVyJykgc3VibWl0KCk7IH07XG4gICAgcmV2ZWFsLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICBjb25zdCBpc1B3ZCA9IHBFbC50eXBlID09PSAncGFzc3dvcmQnO1xuICAgICAgcEVsLnR5cGUgPSBpc1B3ZCA/ICd0ZXh0JyA6ICdwYXNzd29yZCc7XG4gICAgICByZXZlYWwuaW5uZXJIVE1MID0gJyc7XG4gICAgICByZXZlYWwuYXBwZW5kQ2hpbGQocmVuZGVySWNvbihpc1B3ZCA/ICdleWUtb2ZmJyA6ICdleWUnLCB7IHNpemU6IDIwIH0pKTtcbiAgICAgIHJldmVhbC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShpc1B3ZCA/ICdcdTk2OTBcdTg1Q0YnIDogJ1x1NjYzRVx1NzkzQScpKTtcbiAgICB9O1xuICB9XG59XG4iLCAiZXhwb3J0IGNvbnN0IEFQSV9CQVNFID0gKHdpbmRvdyBhcyBhbnkpLl9fQVBJX0JBU0VfXyB8fCAnaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaSc7XHJcbmV4cG9ydCBjb25zdCBXU19FTkRQT0lOVCA9ICh3aW5kb3cgYXMgYW55KS5fX1dTX0VORFBPSU5UX18gfHwgJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9nYW1lJztcclxuXHJcblxyXG4iLCAiaW1wb3J0IHsgV1NfRU5EUE9JTlQgfSBmcm9tICcuL0Vudic7XG5cbnR5cGUgSGFuZGxlciA9IChkYXRhOiBhbnkpID0+IHZvaWQ7XG5cbmV4cG9ydCBjbGFzcyBSZWFsdGltZUNsaWVudCB7XG4gIHByaXZhdGUgc3RhdGljIF9pbnN0YW5jZTogUmVhbHRpbWVDbGllbnQ7XG4gIHN0YXRpYyBnZXQgSSgpOiBSZWFsdGltZUNsaWVudCB7XG4gICAgcmV0dXJuIHRoaXMuX2luc3RhbmNlID8/ICh0aGlzLl9pbnN0YW5jZSA9IG5ldyBSZWFsdGltZUNsaWVudCgpKTtcbiAgfVxuXG4gIHByaXZhdGUgc29ja2V0OiBhbnkgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBoYW5kbGVyczogUmVjb3JkPHN0cmluZywgSGFuZGxlcltdPiA9IHt9O1xuXG4gIGNvbm5lY3QodG9rZW46IHN0cmluZykge1xuICAgIGNvbnN0IHcgPSB3aW5kb3cgYXMgYW55O1xuICAgIGlmICh3LmlvKSB7XG4gICAgICAvLyBcdTU5ODJcdTY3OUNcdTVERjJcdThGREVcdTYzQTVcdTRFMTR0b2tlblx1NzZGOFx1NTQwQ1x1RkYwQ1x1NEUwRFx1OTFDRFx1NTkwRFx1OEZERVx1NjNBNVxuICAgICAgaWYgKHRoaXMuc29ja2V0ICYmICh0aGlzLnNvY2tldC5jb25uZWN0ZWQgfHwgdGhpcy5zb2NrZXQuY29ubmVjdGluZykpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBcdTY1QURcdTVGMDBcdTY1RTdcdThGREVcdTYzQTVcbiAgICAgIGlmICh0aGlzLnNvY2tldCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHRoaXMuc29ja2V0LmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGNvbnNvbGUud2FybignW1JlYWx0aW1lQ2xpZW50XSBEaXNjb25uZWN0IGVycm9yOicsIGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBcbiAgICAgIC8vIFx1NUVGQVx1N0FDQlx1NjVCMFx1OEZERVx1NjNBNVxuICAgICAgdGhpcy5zb2NrZXQgPSB3LmlvKFdTX0VORFBPSU5ULCB7IGF1dGg6IHsgdG9rZW4gfSB9KTtcbiAgICAgIFxuICAgICAgdGhpcy5zb2NrZXQub24oJ2Nvbm5lY3QnLCAoKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdbUmVhbHRpbWVDbGllbnRdIENvbm5lY3RlZCB0byBXZWJTb2NrZXQnKTtcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICB0aGlzLnNvY2tldC5vbignZGlzY29ubmVjdCcsICgpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ1tSZWFsdGltZUNsaWVudF0gRGlzY29ubmVjdGVkIGZyb20gV2ViU29ja2V0Jyk7XG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgdGhpcy5zb2NrZXQub24oJ2Nvbm5lY3RfZXJyb3InLCAoZXJyb3I6IGFueSkgPT4ge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdbUmVhbHRpbWVDbGllbnRdIENvbm5lY3Rpb24gZXJyb3I6JywgZXJyb3IpO1xuICAgICAgfSk7XG4gICAgICBcbiAgICAgIHRoaXMuc29ja2V0Lm9uQW55KChldmVudDogc3RyaW5nLCBwYXlsb2FkOiBhbnkpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ1tSZWFsdGltZUNsaWVudF0gRXZlbnQgcmVjZWl2ZWQ6JywgZXZlbnQsIHBheWxvYWQpO1xuICAgICAgICB0aGlzLmVtaXRMb2NhbChldmVudCwgcGF5bG9hZCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gc29ja2V0LmlvIGNsaWVudCBub3QgbG9hZGVkOyBkaXNhYmxlIHJlYWx0aW1lIHVwZGF0ZXNcbiAgICAgIGNvbnNvbGUud2FybignW1JlYWx0aW1lQ2xpZW50XSBzb2NrZXQuaW8gbm90IGxvYWRlZCcpO1xuICAgICAgdGhpcy5zb2NrZXQgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIG9uKGV2ZW50OiBzdHJpbmcsIGhhbmRsZXI6IEhhbmRsZXIpIHtcbiAgICAodGhpcy5oYW5kbGVyc1tldmVudF0gfHw9IFtdKS5wdXNoKGhhbmRsZXIpO1xuICB9XG5cbiAgb2ZmKGV2ZW50OiBzdHJpbmcsIGhhbmRsZXI6IEhhbmRsZXIpIHtcbiAgICBjb25zdCBhcnIgPSB0aGlzLmhhbmRsZXJzW2V2ZW50XTtcbiAgICBpZiAoIWFycikgcmV0dXJuO1xuICAgIGNvbnN0IGlkeCA9IGFyci5pbmRleE9mKGhhbmRsZXIpO1xuICAgIGlmIChpZHggPj0gMCkgYXJyLnNwbGljZShpZHgsIDEpO1xuICB9XG5cbiAgcHJpdmF0ZSBlbWl0TG9jYWwoZXZlbnQ6IHN0cmluZywgcGF5bG9hZDogYW55KSB7XG4gICAgKHRoaXMuaGFuZGxlcnNbZXZlbnRdIHx8IFtdKS5mb3JFYWNoKChoKSA9PiBoKHBheWxvYWQpKTtcbiAgfVxufVxuIiwgImltcG9ydCB7IEdhbWVNYW5hZ2VyIH0gZnJvbSAnLi4vY29yZS9HYW1lTWFuYWdlcic7XG5pbXBvcnQgeyByZW5kZXJJY29uIH0gZnJvbSAnLi9JY29uJztcblxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlck5hdihhY3RpdmU6IHN0cmluZyk6IEhUTUxFbGVtZW50IHtcbiAgY29uc3QgdGFiczogeyBrZXk6IHN0cmluZzsgdGV4dDogc3RyaW5nOyBocmVmOiBzdHJpbmc7IGljb246IGFueSB9W10gPSBbXG4gICAgeyBrZXk6ICdtYWluJywgdGV4dDogJ1x1NEUzQlx1OTg3NScsIGhyZWY6ICcjL21haW4nLCBpY29uOiAnaG9tZScgfSxcbiAgICB7IGtleTogJ3dhcmVob3VzZScsIHRleHQ6ICdcdTRFRDNcdTVFOTMnLCBocmVmOiAnIy93YXJlaG91c2UnLCBpY29uOiAnd2FyZWhvdXNlJyB9LFxuICAgIHsga2V5OiAncGx1bmRlcicsIHRleHQ6ICdcdTYzQTBcdTU5M0EnLCBocmVmOiAnIy9wbHVuZGVyJywgaWNvbjogJ3BsdW5kZXInIH0sXG4gICAgeyBrZXk6ICdleGNoYW5nZScsIHRleHQ6ICdcdTRFQTRcdTY2MTNcdTYyNDAnLCBocmVmOiAnIy9leGNoYW5nZScsIGljb246ICdleGNoYW5nZScgfSxcbiAgICB7IGtleTogJ3JhbmtpbmcnLCB0ZXh0OiAnXHU2MzkyXHU4ODRDJywgaHJlZjogJyMvcmFua2luZycsIGljb246ICdyYW5raW5nJyB9LFxuICBdO1xuICBjb25zdCB3cmFwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHdyYXAuY2xhc3NOYW1lID0gJ25hdic7XG4gIGZvciAoY29uc3QgdCBvZiB0YWJzKSB7XG4gICAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICBhLmhyZWYgPSB0LmhyZWY7XG4gICAgY29uc3QgaWNvID0gcmVuZGVySWNvbih0Lmljb24sIHsgc2l6ZTogMTgsIGNsYXNzTmFtZTogJ2ljbycgfSk7XG4gICAgY29uc3QgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgbGFiZWwudGV4dENvbnRlbnQgPSB0LnRleHQ7XG4gICAgYS5hcHBlbmRDaGlsZChpY28pO1xuICAgIGEuYXBwZW5kQ2hpbGQobGFiZWwpO1xuICAgIGlmICh0LmtleSA9PT0gYWN0aXZlKSBhLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgIHdyYXAuYXBwZW5kQ2hpbGQoYSk7XG4gIH1cbiAgXG4gIC8vIFx1NkRGQlx1NTJBMFx1OTAwMFx1NTFGQVx1NzY3Qlx1NUY1NVx1NjMwOVx1OTRBRVxuICBjb25zdCBsb2dvdXRCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gIGxvZ291dEJ0bi5ocmVmID0gJyMnO1xuICBsb2dvdXRCdG4uY2xhc3NOYW1lID0gJ25hdi1sb2dvdXQnO1xuICBsb2dvdXRCdG4uc3R5bGUuY3NzVGV4dCA9ICdtYXJnaW4tbGVmdDphdXRvO29wYWNpdHk6Ljc1Oyc7XG4gIGNvbnN0IGxvZ291dEljbyA9IHJlbmRlckljb24oJ2xvZ291dCcsIHsgc2l6ZTogMTgsIGNsYXNzTmFtZTogJ2ljbycgfSk7XG4gIGNvbnN0IGxvZ291dExhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICBsb2dvdXRMYWJlbC50ZXh0Q29udGVudCA9ICdcdTkwMDBcdTUxRkEnO1xuICBsb2dvdXRCdG4uYXBwZW5kQ2hpbGQobG9nb3V0SWNvKTtcbiAgbG9nb3V0QnRuLmFwcGVuZENoaWxkKGxvZ291dExhYmVsKTtcbiAgbG9nb3V0QnRuLm9uY2xpY2sgPSAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBpZiAoY29uZmlybSgnXHU3ODZFXHU1QjlBXHU4OTgxXHU5MDAwXHU1MUZBXHU3NjdCXHU1RjU1XHU1NDE3XHVGRjFGJykpIHtcbiAgICAgIEdhbWVNYW5hZ2VyLkkubG9nb3V0KCk7XG4gICAgfVxuICB9O1xuICB3cmFwLmFwcGVuZENoaWxkKGxvZ291dEJ0bik7XG4gIFxuICByZXR1cm4gd3JhcDtcbn1cbiIsICJleHBvcnQgY2xhc3MgQ291bnRVcFRleHQge1xyXG4gIHByaXZhdGUgdmFsdWUgPSAwO1xyXG4gIHByaXZhdGUgZGlzcGxheSA9ICcwJztcclxuICBwcml2YXRlIGFuaW0/OiBudW1iZXI7XHJcbiAgb25VcGRhdGU/OiAodGV4dDogc3RyaW5nKSA9PiB2b2lkO1xyXG5cclxuICBzZXQobjogbnVtYmVyKSB7XHJcbiAgICB0aGlzLnZhbHVlID0gbjtcclxuICAgIHRoaXMuZGlzcGxheSA9IHRoaXMuZm9ybWF0KG4pO1xyXG4gICAgdGhpcy5vblVwZGF0ZT8uKHRoaXMuZGlzcGxheSk7XHJcbiAgfVxyXG5cclxuICB0byhuOiBudW1iZXIsIGR1cmF0aW9uID0gNTAwKSB7XHJcbiAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLmFuaW0hKTtcclxuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy52YWx1ZTtcclxuICAgIGNvbnN0IGRlbHRhID0gbiAtIHN0YXJ0O1xyXG4gICAgY29uc3QgdDAgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuICAgIGNvbnN0IHN0ZXAgPSAodDogbnVtYmVyKSA9PiB7XHJcbiAgICAgIGNvbnN0IHAgPSBNYXRoLm1pbigxLCAodCAtIHQwKSAvIGR1cmF0aW9uKTtcclxuICAgICAgY29uc3QgZWFzZSA9IDEgLSBNYXRoLnBvdygxIC0gcCwgMyk7XHJcbiAgICAgIGNvbnN0IGN1cnIgPSBzdGFydCArIGRlbHRhICogZWFzZTtcclxuICAgICAgdGhpcy5kaXNwbGF5ID0gdGhpcy5mb3JtYXQoY3Vycik7XHJcbiAgICAgIHRoaXMub25VcGRhdGU/Lih0aGlzLmRpc3BsYXkpO1xyXG4gICAgICBpZiAocCA8IDEpIHRoaXMuYW5pbSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKTtcclxuICAgICAgZWxzZSB0aGlzLnZhbHVlID0gbjtcclxuICAgIH07XHJcbiAgICB0aGlzLmFuaW0gPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGZvcm1hdChuOiBudW1iZXIpIHtcclxuICAgIHJldHVybiBNYXRoLmZsb29yKG4pLnRvTG9jYWxlU3RyaW5nKCk7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuIiwgImltcG9ydCB7IE5ldHdvcmtNYW5hZ2VyIH0gZnJvbSAnLi4vY29yZS9OZXR3b3JrTWFuYWdlcic7XG5pbXBvcnQgeyByZW5kZXJJY29uIH0gZnJvbSAnLi9JY29uJztcbmltcG9ydCB7IENvdW50VXBUZXh0IH0gZnJvbSAnLi9Db3VudFVwVGV4dCc7XG5cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJSZXNvdXJjZUJhcigpIHtcbiAgY29uc3QgYm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGJveC5jbGFzc05hbWUgPSAnY29udGFpbmVyJztcbiAgY29uc3QgY2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBjYXJkLmNsYXNzTmFtZSA9ICdjYXJkIGZhZGUtaW4nO1xuICBjYXJkLmlubmVySFRNTCA9IGBcbiAgICA8ZGl2IGNsYXNzPVwic3RhdHNcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJzdGF0IHN0YXQtYW5pbWF0ZWRcIiBpZD1cIm9yZS1zdGF0XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJpY29cIiBkYXRhLWljbz1cIm9yZVwiPjwvZGl2PlxuICAgICAgICA8ZGl2IHN0eWxlPVwiZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6MnB4O1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJ2YWxcIiBpZD1cIm9yZVwiPjA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibGFiZWxcIj5cdTc3RkZcdTc3RjM8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxzdmcgY2xhc3M9XCJzdGF0LXBhcnRpY2xlc1wiIHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEwMCVcIiB2aWV3Qm94PVwiMCAwIDEwMCA1MFwiIHN0eWxlPVwicG9zaXRpb246YWJzb2x1dGU7aW5zZXQ6MDtwb2ludGVyLWV2ZW50czpub25lO1wiPlxuICAgICAgICAgIDxjaXJjbGUgY2xhc3M9XCJzdGF0LXBhcnRpY2xlIHNwMVwiIGN4PVwiMjBcIiBjeT1cIjI1XCIgcj1cIjEuNVwiIGZpbGw9XCIjN0IyQ0Y1XCIgb3BhY2l0eT1cIjBcIi8+XG4gICAgICAgICAgPGNpcmNsZSBjbGFzcz1cInN0YXQtcGFydGljbGUgc3AyXCIgY3g9XCI1MFwiIGN5PVwiMjVcIiByPVwiMVwiIGZpbGw9XCIjMkM4OUY1XCIgb3BhY2l0eT1cIjBcIi8+XG4gICAgICAgICAgPGNpcmNsZSBjbGFzcz1cInN0YXQtcGFydGljbGUgc3AzXCIgY3g9XCI4MFwiIGN5PVwiMjVcIiByPVwiMS41XCIgZmlsbD1cIiNmNmM0NDVcIiBvcGFjaXR5PVwiMFwiLz5cbiAgICAgICAgPC9zdmc+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJzdGF0IHN0YXQtYW5pbWF0ZWRcIiBpZD1cImNvaW4tc3RhdFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiaWNvXCIgZGF0YS1pY289XCJjb2luXCI+PC9kaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9XCJkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDoycHg7XCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInZhbFwiIGlkPVwiY29pblwiPjA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibGFiZWxcIj5CQjwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPHN2ZyBjbGFzcz1cInN0YXQtcGFydGljbGVzXCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiIHZpZXdCb3g9XCIwIDAgMTAwIDUwXCIgc3R5bGU9XCJwb3NpdGlvbjphYnNvbHV0ZTtpbnNldDowO3BvaW50ZXItZXZlbnRzOm5vbmU7XCI+XG4gICAgICAgICAgPGNpcmNsZSBjbGFzcz1cInN0YXQtcGFydGljbGUgc3AxXCIgY3g9XCIyMFwiIGN5PVwiMjVcIiByPVwiMS41XCIgZmlsbD1cIiNmNmM0NDVcIiBvcGFjaXR5PVwiMFwiLz5cbiAgICAgICAgICA8Y2lyY2xlIGNsYXNzPVwic3RhdC1wYXJ0aWNsZSBzcDJcIiBjeD1cIjUwXCIgY3k9XCIyNVwiIHI9XCIxXCIgZmlsbD1cIiNmZmQ3MDBcIiBvcGFjaXR5PVwiMFwiLz5cbiAgICAgICAgICA8Y2lyY2xlIGNsYXNzPVwic3RhdC1wYXJ0aWNsZSBzcDNcIiBjeD1cIjgwXCIgY3k9XCIyNVwiIHI9XCIxLjVcIiBmaWxsPVwiI2UzNjQxNFwiIG9wYWNpdHk9XCIwXCIvPlxuICAgICAgICA8L3N2Zz5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICBgO1xuICBib3guYXBwZW5kQ2hpbGQoY2FyZCk7XG4gIC8vIGluamVjdCBpY29uc1xuICB0cnkge1xuICAgIGNvbnN0IG9yZUljbyA9IGNhcmQucXVlcnlTZWxlY3RvcignW2RhdGEtaWNvPVwib3JlXCJdJyk7XG4gICAgY29uc3QgY29pbkljbyA9IGNhcmQucXVlcnlTZWxlY3RvcignW2RhdGEtaWNvPVwiY29pblwiXScpO1xuICAgIGlmIChvcmVJY28pIG9yZUljby5hcHBlbmRDaGlsZChyZW5kZXJJY29uKCdvcmUnLCB7IHNpemU6IDE4IH0pKTtcbiAgICBpZiAoY29pbkljbykgY29pbkljby5hcHBlbmRDaGlsZChyZW5kZXJJY29uKCdjb2luJywgeyBzaXplOiAxOCB9KSk7XG4gIH0gY2F0Y2gge31cbiAgXG4gIGNvbnN0IG9yZUVsID0gY2FyZC5xdWVyeVNlbGVjdG9yKCcjb3JlJykgYXMgSFRNTEVsZW1lbnQ7XG4gIGNvbnN0IGNvaW5FbCA9IGNhcmQucXVlcnlTZWxlY3RvcignI2NvaW4nKSBhcyBIVE1MRWxlbWVudDtcbiAgXG4gIGNvbnN0IG9yZUNvdW50ZXIgPSBuZXcgQ291bnRVcFRleHQoKTtcbiAgY29uc3QgY29pbkNvdW50ZXIgPSBuZXcgQ291bnRVcFRleHQoKTtcbiAgb3JlQ291bnRlci5vblVwZGF0ZSA9ICh0ZXh0KSA9PiB7IG9yZUVsLnRleHRDb250ZW50ID0gdGV4dDsgfTtcbiAgY29pbkNvdW50ZXIub25VcGRhdGUgPSAodGV4dCkgPT4geyBjb2luRWwudGV4dENvbnRlbnQgPSB0ZXh0OyB9O1xuICBcbiAgbGV0IHByZXZPcmUgPSAwO1xuICBsZXQgcHJldkNvaW4gPSAwO1xuICBcbiAgYXN5bmMgZnVuY3Rpb24gdXBkYXRlKCkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBwID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgaWQ6IHN0cmluZzsgdXNlcm5hbWU6IHN0cmluZzsgbmlja25hbWU6IHN0cmluZzsgb3JlQW1vdW50OiBudW1iZXI7IGJiQ29pbnM6IG51bWJlciB9PignL3VzZXIvcHJvZmlsZScpO1xuICAgICAgXG4gICAgICAvLyBcdTRGN0ZcdTc1MjhcdThCQTFcdTY1NzBcdTUyQThcdTc1M0JcdTY2RjRcdTY1QjBcbiAgICAgIGlmIChwLm9yZUFtb3VudCAhPT0gcHJldk9yZSkge1xuICAgICAgICBvcmVDb3VudGVyLnRvKHAub3JlQW1vdW50LCA4MDApO1xuICAgICAgICAvLyBcdTU5ODJcdTY3OUNcdTY2MkZcdTU4OUVcdTUyQTBcdUZGMENcdTZERkJcdTUyQTBcdTU2RkVcdTY4MDdcdTgxMDlcdTUxQjJcdTY1NDhcdTY3OUNcbiAgICAgICAgaWYgKHAub3JlQW1vdW50ID4gcHJldk9yZSkge1xuICAgICAgICAgIGNvbnN0IG9yZUljb24gPSBjYXJkLnF1ZXJ5U2VsZWN0b3IoJyNvcmUtc3RhdCAuaWNvJyk7XG4gICAgICAgICAgaWYgKG9yZUljb24pIHtcbiAgICAgICAgICAgIG9yZUljb24uY2xhc3NMaXN0LmFkZCgncHVsc2UtaWNvbicpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBvcmVJY29uLmNsYXNzTGlzdC5yZW1vdmUoJ3B1bHNlLWljb24nKSwgNjAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcHJldk9yZSA9IHAub3JlQW1vdW50O1xuICAgICAgfVxuICAgICAgXG4gICAgICBpZiAocC5iYkNvaW5zICE9PSBwcmV2Q29pbikge1xuICAgICAgICBjb2luQ291bnRlci50byhwLmJiQ29pbnMsIDgwMCk7XG4gICAgICAgIGlmIChwLmJiQ29pbnMgPiBwcmV2Q29pbikge1xuICAgICAgICAgIGNvbnN0IGNvaW5JY29uID0gY2FyZC5xdWVyeVNlbGVjdG9yKCcjY29pbi1zdGF0IC5pY28nKTtcbiAgICAgICAgICBpZiAoY29pbkljb24pIHtcbiAgICAgICAgICAgIGNvaW5JY29uLmNsYXNzTGlzdC5hZGQoJ3B1bHNlLWljb24nKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gY29pbkljb24uY2xhc3NMaXN0LnJlbW92ZSgncHVsc2UtaWNvbicpLCA2MDApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBwcmV2Q29pbiA9IHAuYmJDb2lucztcbiAgICAgIH1cbiAgICB9IGNhdGNoIHtcbiAgICAgIC8vIGlnbm9yZSBmZXRjaCBlcnJvcnM7IFVJIFx1NEYxQVx1NTcyOFx1NEUwQlx1NEUwMFx1NkIyMVx1NTIzN1x1NjVCMFx1NjVGNlx1NjA2Mlx1NTkwRFxuICAgIH1cbiAgfVxuICByZXR1cm4geyByb290OiBib3gsIHVwZGF0ZSwgb3JlRWwsIGNvaW5FbCB9O1xufVxuIiwgImltcG9ydCB7IGh0bWwgfSBmcm9tICcuLi91dGlscy9kb20nO1xyXG5pbXBvcnQgeyByZW5kZXJJY29uIH0gZnJvbSAnLi9JY29uJztcclxuaW1wb3J0IHsgTmV0d29ya01hbmFnZXIgfSBmcm9tICcuLi9jb3JlL05ldHdvcmtNYW5hZ2VyJztcclxuaW1wb3J0IHsgc2hvd1RvYXN0IH0gZnJvbSAnLi9Ub2FzdCc7XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2hvd0FkRGlhbG9nKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgY29uc3Qgb3ZlcmxheSA9IGh0bWwoYFxyXG4gICAgICA8ZGl2IGNsYXNzPVwiYWQtb3ZlcmxheVwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJhZC1kaWFsb2dcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJhZC1jb250ZW50XCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhZC1pY29uXCIgZGF0YS1pY289XCJpbmZvXCI+PC9kaXY+XHJcbiAgICAgICAgICAgIDxoMyBzdHlsZT1cIm1hcmdpbjo4cHggMDtmb250LXNpemU6MThweDtcIj5cdTg5QzJcdTc3MEJcdTVFN0ZcdTU0NEE8L2gzPlxyXG4gICAgICAgICAgICA8cCBzdHlsZT1cIm9wYWNpdHk6Ljg1O21hcmdpbjo4cHggMDtcIj5cdTg5QzJcdTc3MEIxNVx1NzlEMlx1NUU3Rlx1NTQ0QVx1ODlDNlx1OTg5MVx1NTM3M1x1NTNFRlx1NjUzNlx1NzdGRjxici8+XHU1RTc2XHU5ODlEXHU1OTE2XHU4M0I3XHU1Rjk3IDUtMTUgXHU3N0ZGXHU3N0YzXHU1OTU2XHU1MkIxXHVGRjAxPC9wPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYWQtcGxhY2Vob2xkZXJcIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYWQtcHJvZ3Jlc3MtcmluZ1wiPlxyXG4gICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjEwMFwiIGhlaWdodD1cIjEwMFwiPlxyXG4gICAgICAgICAgICAgICAgICA8Y2lyY2xlIGNsYXNzPVwiYWQtY2lyY2xlLWJnXCIgY3g9XCI1MFwiIGN5PVwiNTBcIiByPVwiNDVcIj48L2NpcmNsZT5cclxuICAgICAgICAgICAgICAgICAgPGNpcmNsZSBjbGFzcz1cImFkLWNpcmNsZS1mZ1wiIGN4PVwiNTBcIiBjeT1cIjUwXCIgcj1cIjQ1XCIgaWQ9XCJhZENpcmNsZVwiPjwvY2lyY2xlPlxyXG4gICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYWQtY291bnRkb3duXCIgaWQ9XCJhZENvdW50ZG93blwiPjE1PC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPHAgc3R5bGU9XCJvcGFjaXR5Oi43NTtmb250LXNpemU6MTNweDttYXJnaW4tdG9wOjEycHg7XCI+W1x1NUU3Rlx1NTQ0QVx1NTM2MFx1NEY0RFx1N0IyNiAtIFx1NUI5RVx1OTY0NVx1NUU5NFx1NjNBNVx1NTE2NVNES108L3A+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYWQtYWN0aW9uc1wiPlxyXG4gICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLWdob3N0XCIgaWQ9XCJhZFNraXBcIj5cdThERjNcdThGQzdcdUZGMDhcdTY1RTBcdTU5NTZcdTUyQjFcdUZGMDk8L2J1dHRvbj5cclxuICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCIgaWQ9XCJhZENvbXBsZXRlXCIgZGlzYWJsZWQ+XHU5ODg2XHU1M0Q2XHU1OTU2XHU1MkIxPC9idXR0b24+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgYCkgYXMgSFRNTEVsZW1lbnQ7XHJcblxyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChvdmVybGF5KTtcclxuXHJcbiAgICAvLyBcdTZFMzJcdTY3RDNcdTU2RkVcdTY4MDdcclxuICAgIHRyeSB7XHJcbiAgICAgIG92ZXJsYXkucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtaWNvXScpLmZvckVhY2goKGVsKSA9PiB7XHJcbiAgICAgICAgY29uc3QgbmFtZSA9IChlbCBhcyBIVE1MRWxlbWVudCkuZ2V0QXR0cmlidXRlKCdkYXRhLWljbycpIGFzIGFueTtcclxuICAgICAgICB0cnkgeyBlbC5hcHBlbmRDaGlsZChyZW5kZXJJY29uKG5hbWUsIHsgc2l6ZTogNDggfSkpOyB9IGNhdGNoIHt9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCB7fVxyXG5cclxuICAgIGNvbnN0IHNraXBCdG4gPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3IoJyNhZFNraXAnKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgIGNvbnN0IGNvbXBsZXRlQnRuID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yKCcjYWRDb21wbGV0ZScpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgY29uc3QgY291bnRkb3duID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yKCcjYWRDb3VudGRvd24nKSBhcyBIVE1MRWxlbWVudDtcclxuICAgIGNvbnN0IGNpcmNsZSA9IG92ZXJsYXkucXVlcnlTZWxlY3RvcignI2FkQ2lyY2xlJykgYXMgU1ZHQ2lyY2xlRWxlbWVudDtcclxuXHJcbiAgICAvLyBcdTZBMjFcdTYyREYxNVx1NzlEMlx1NTAxMlx1OEJBMVx1NjVGNlxyXG4gICAgbGV0IHNlY29uZHMgPSAxNTtcclxuICAgIGNvbnN0IGNpcmN1bWZlcmVuY2UgPSAyICogTWF0aC5QSSAqIDQ1O1xyXG4gICAgaWYgKGNpcmNsZSkge1xyXG4gICAgICBjaXJjbGUuc3R5bGUuc3Ryb2tlRGFzaGFycmF5ID0gYCR7Y2lyY3VtZmVyZW5jZX1gO1xyXG4gICAgICBjaXJjbGUuc3R5bGUuc3Ryb2tlRGFzaG9mZnNldCA9IGAke2NpcmN1bWZlcmVuY2V9YDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB0aW1lciA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgc2Vjb25kcy0tO1xyXG4gICAgICBjb3VudGRvd24udGV4dENvbnRlbnQgPSBTdHJpbmcoc2Vjb25kcyk7XHJcbiAgICAgIFxyXG4gICAgICBpZiAoY2lyY2xlKSB7XHJcbiAgICAgICAgY29uc3Qgb2Zmc2V0ID0gY2lyY3VtZmVyZW5jZSAqIChzZWNvbmRzIC8gMTUpO1xyXG4gICAgICAgIGNpcmNsZS5zdHlsZS5zdHJva2VEYXNob2Zmc2V0ID0gU3RyaW5nKG9mZnNldCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChzZWNvbmRzIDw9IDApIHtcclxuICAgICAgICBjbGVhckludGVydmFsKHRpbWVyKTtcclxuICAgICAgICBjb21wbGV0ZUJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIGNvbXBsZXRlQnRuLmNsYXNzTGlzdC5hZGQoJ2J0bi1lbmVyZ3knKTtcclxuICAgICAgfVxyXG4gICAgfSwgMTAwMCk7XHJcblxyXG4gICAgY29uc3QgY2xlYW51cCA9ICgpID0+IHtcclxuICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lcik7XHJcbiAgICAgIG92ZXJsYXkucmVtb3ZlKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHNraXBCdG4ub25jbGljayA9ICgpID0+IHtcclxuICAgICAgY2xlYW51cCgpO1xyXG4gICAgICByZXNvbHZlKGZhbHNlKTtcclxuICAgIH07XHJcblxyXG4gICAgY29tcGxldGVCdG4ub25jbGljayA9IGFzeW5jICgpID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyBzdWNjZXNzOiBib29sZWFuOyByZXdhcmQ/OiBudW1iZXIgfT4oJy91c2VyL3dhdGNoLWFkJywgeyBtZXRob2Q6ICdQT1NUJyB9KTtcclxuICAgICAgICBpZiAocmVzLnN1Y2Nlc3MgJiYgcmVzLnJld2FyZCkge1xyXG4gICAgICAgICAgc2hvd1RvYXN0KGBcdUQ4M0NcdURGODEgXHU1RTdGXHU1NDRBXHU1OTU2XHU1MkIxXHVGRjFBXHU4M0I3XHU1Rjk3ICR7cmVzLnJld2FyZH0gXHU3N0ZGXHU3N0YzYCwgJ3N1Y2Nlc3MnKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gY2F0Y2ggKGU6IGFueSkge1xyXG4gICAgICAgIHNob3dUb2FzdChlPy5tZXNzYWdlIHx8ICdcdTVFN0ZcdTU0NEFcdTU5NTZcdTUyQjFcdTk4ODZcdTUzRDZcdTU5MzFcdThEMjUnLCAnZXJyb3InKTtcclxuICAgICAgfVxyXG4gICAgICBjbGVhbnVwKCk7XHJcbiAgICAgIHJlc29sdmUodHJ1ZSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIFx1NzBCOVx1NTFGQlx1OTA2RVx1N0Y2OVx1NEUwRFx1NTE3M1x1OTVFRFx1RkYwOFx1OTYzMlx1OEJFRlx1NjRDRFx1NEY1Q1x1RkYwOVxyXG4gICAgb3ZlcmxheS5vbmNsaWNrID0gKGUpID0+IHtcclxuICAgICAgaWYgKGUudGFyZ2V0ID09PSBvdmVybGF5KSB7XHJcbiAgICAgICAgc2hvd1RvYXN0KCdcdThCRjdcdTg5QzJcdTc3MEJcdTVCOENcdTVFN0ZcdTU0NEFcdTYyMTZcdTkwMDlcdTYyRTlcdThERjNcdThGQzcnLCAnd2FybicpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH0pO1xyXG59XHJcblxyXG4iLCAiaW1wb3J0IHsgaHRtbCB9IGZyb20gJy4uL3V0aWxzL2RvbSc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTWluZXJBbmltYXRpb24oKTogSFRNTEVsZW1lbnQge1xyXG4gIGNvbnN0IGNvbnRhaW5lciA9IGh0bWwoYFxyXG4gICAgPGRpdiBjbGFzcz1cIm1pbmVyLWFuaW1hdGlvblwiPlxyXG4gICAgICA8c3ZnIGNsYXNzPVwibWluZXItc3ZnXCIgdmlld0JveD1cIjAgMCAyMDAgMjAwXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxyXG4gICAgICAgIDxkZWZzPlxyXG4gICAgICAgICAgPGxpbmVhckdyYWRpZW50IGlkPVwibWluZXJHcmFkXCIgeDE9XCIwJVwiIHkxPVwiMCVcIiB4Mj1cIjEwMCVcIiB5Mj1cIjEwMCVcIj5cclxuICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PVwiMCVcIiBzdG9wLWNvbG9yPVwiIzdCMkNGNVwiIC8+XHJcbiAgICAgICAgICAgIDxzdG9wIG9mZnNldD1cIjEwMCVcIiBzdG9wLWNvbG9yPVwiIzJDODlGNVwiIC8+XHJcbiAgICAgICAgICA8L2xpbmVhckdyYWRpZW50PlxyXG4gICAgICAgICAgPGZpbHRlciBpZD1cIm1pbmVyR2xvd1wiPlxyXG4gICAgICAgICAgICA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPVwiMlwiIHJlc3VsdD1cImNvbG9yZWRCbHVyXCIvPlxyXG4gICAgICAgICAgICA8ZmVNZXJnZT5cclxuICAgICAgICAgICAgICA8ZmVNZXJnZU5vZGUgaW49XCJjb2xvcmVkQmx1clwiLz5cclxuICAgICAgICAgICAgICA8ZmVNZXJnZU5vZGUgaW49XCJTb3VyY2VHcmFwaGljXCIvPlxyXG4gICAgICAgICAgICA8L2ZlTWVyZ2U+XHJcbiAgICAgICAgICA8L2ZpbHRlcj5cclxuICAgICAgICA8L2RlZnM+XHJcbiAgICAgICAgXHJcbiAgICAgICAgPCEtLSBcdTc3RkZcdTVERTVcdThFQUJcdTRGNTMgLS0+XHJcbiAgICAgICAgPGcgY2xhc3M9XCJtaW5lci1ib2R5XCI+XHJcbiAgICAgICAgICA8IS0tIFx1NTkzNFx1NzZENCAtLT5cclxuICAgICAgICAgIDxlbGxpcHNlIGN4PVwiMTAwXCIgY3k9XCI3MFwiIHJ4PVwiMjBcIiByeT1cIjE4XCIgZmlsbD1cInVybCgjbWluZXJHcmFkKVwiIGZpbHRlcj1cInVybCgjbWluZXJHbG93KVwiLz5cclxuICAgICAgICAgIDxjaXJjbGUgY3g9XCIxMDBcIiBjeT1cIjY1XCIgcj1cIjhcIiBmaWxsPVwiI2Y2YzQ0NVwiIG9wYWNpdHk9XCIwLjlcIiBjbGFzcz1cIm1pbmVyLWxpZ2h0XCIvPlxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICA8IS0tIFx1OEVBQlx1NEY1MyAtLT5cclxuICAgICAgICAgIDxyZWN0IHg9XCI4NVwiIHk9XCI4NVwiIHdpZHRoPVwiMzBcIiBoZWlnaHQ9XCIzNVwiIHJ4PVwiNVwiIGZpbGw9XCJ1cmwoI21pbmVyR3JhZClcIiBvcGFjaXR5PVwiMC44XCIvPlxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICA8IS0tIFx1NjI0Qlx1ODFDMlx1RkYwOFx1NjMyNVx1NTJBOFx1RkYwOSAtLT5cclxuICAgICAgICAgIDxnIGNsYXNzPVwibWluZXItYXJtXCI+XHJcbiAgICAgICAgICAgIDxsaW5lIHgxPVwiMTEwXCIgeTE9XCI5NVwiIHgyPVwiMTMwXCIgeTI9XCI4NVwiIHN0cm9rZT1cInVybCgjbWluZXJHcmFkKVwiIHN0cm9rZS13aWR0aD1cIjZcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIvPlxyXG4gICAgICAgICAgICA8IS0tIFx1OTU1MFx1NUI1MCAtLT5cclxuICAgICAgICAgICAgPGcgY2xhc3M9XCJtaW5lci1waWNrYXhlXCI+XHJcbiAgICAgICAgICAgICAgPGxpbmUgeDE9XCIxMzBcIiB5MT1cIjg1XCIgeDI9XCIxNDVcIiB5Mj1cIjcwXCIgc3Ryb2tlPVwiI2Y2YzQ0NVwiIHN0cm9rZS13aWR0aD1cIjNcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIvPlxyXG4gICAgICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz1cIjE0NSw3MCAxNTUsNjUgMTUwLDc1XCIgZmlsbD1cIiM4ODhcIiBzdHJva2U9XCIjNjY2XCIgc3Ryb2tlLXdpZHRoPVwiMVwiLz5cclxuICAgICAgICAgICAgPC9nPlxyXG4gICAgICAgICAgPC9nPlxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICA8IS0tIFx1ODE3RiAtLT5cclxuICAgICAgICAgIDxyZWN0IHg9XCI5MFwiIHk9XCIxMjBcIiB3aWR0aD1cIjhcIiBoZWlnaHQ9XCIyMFwiIHJ4PVwiM1wiIGZpbGw9XCJ1cmwoI21pbmVyR3JhZClcIiBvcGFjaXR5PVwiMC43XCIvPlxyXG4gICAgICAgICAgPHJlY3QgeD1cIjEwMlwiIHk9XCIxMjBcIiB3aWR0aD1cIjhcIiBoZWlnaHQ9XCIyMFwiIHJ4PVwiM1wiIGZpbGw9XCJ1cmwoI21pbmVyR3JhZClcIiBvcGFjaXR5PVwiMC43XCIvPlxyXG4gICAgICAgIDwvZz5cclxuICAgICAgICBcclxuICAgICAgICA8IS0tIFx1NzdGRlx1NzdGM1x1N0M5Mlx1NUI1MCAtLT5cclxuICAgICAgICA8Y2lyY2xlIGNsYXNzPVwib3JlLXBhcnRpY2xlIHAxXCIgY3g9XCIxNDBcIiBjeT1cIjEwMFwiIHI9XCIzXCIgZmlsbD1cIiM3QjJDRjVcIiBvcGFjaXR5PVwiMFwiLz5cclxuICAgICAgICA8Y2lyY2xlIGNsYXNzPVwib3JlLXBhcnRpY2xlIHAyXCIgY3g9XCIxNDVcIiBjeT1cIjEwNVwiIHI9XCIyXCIgZmlsbD1cIiMyQzg5RjVcIiBvcGFjaXR5PVwiMFwiLz5cclxuICAgICAgICA8Y2lyY2xlIGNsYXNzPVwib3JlLXBhcnRpY2xlIHAzXCIgY3g9XCIxMzVcIiBjeT1cIjEwOFwiIHI9XCIyLjVcIiBmaWxsPVwiI2Y2YzQ0NVwiIG9wYWNpdHk9XCIwXCIvPlxyXG4gICAgICA8L3N2Zz5cclxuICAgICAgPGRpdiBjbGFzcz1cIm1pbmVyLXN0YXR1c1wiPlx1NjMxNlx1NzdGRlx1NEUyRC4uLjwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgYCkgYXMgSFRNTEVsZW1lbnQ7XHJcbiAgXHJcbiAgcmV0dXJuIGNvbnRhaW5lcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUlkbGVNaW5lcigpOiBIVE1MRWxlbWVudCB7XHJcbiAgY29uc3QgY29udGFpbmVyID0gaHRtbChgXHJcbiAgICA8ZGl2IGNsYXNzPVwibWluZXItaWRsZVwiPlxyXG4gICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgMTIwIDEyMFwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cclxuICAgICAgICA8ZGVmcz5cclxuICAgICAgICAgIDxsaW5lYXJHcmFkaWVudCBpZD1cImlkbGVHcmFkXCIgeDE9XCIwJVwiIHkxPVwiMCVcIiB4Mj1cIjEwMCVcIiB5Mj1cIjEwMCVcIj5cclxuICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PVwiMCVcIiBzdG9wLWNvbG9yPVwiIzdCMkNGNVwiIHN0b3Atb3BhY2l0eT1cIjAuNlwiLz5cclxuICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PVwiMTAwJVwiIHN0b3AtY29sb3I9XCIjMkM4OUY1XCIgc3RvcC1vcGFjaXR5PVwiMC42XCIvPlxyXG4gICAgICAgICAgPC9saW5lYXJHcmFkaWVudD5cclxuICAgICAgICA8L2RlZnM+XHJcbiAgICAgICAgXHJcbiAgICAgICAgPCEtLSBcdTdCODBcdTUzNTVcdTc2ODRcdTc3RkZcdTVERTVcdTUyNkFcdTVGNzEgLS0+XHJcbiAgICAgICAgPGcgY2xhc3M9XCJpZGxlLW1pbmVyXCI+XHJcbiAgICAgICAgICA8Y2lyY2xlIGN4PVwiNjBcIiBjeT1cIjQwXCIgcj1cIjEyXCIgZmlsbD1cInVybCgjaWRsZUdyYWQpXCIvPlxyXG4gICAgICAgICAgPHJlY3QgeD1cIjUwXCIgeT1cIjUwXCIgd2lkdGg9XCIyMFwiIGhlaWdodD1cIjI1XCIgcng9XCIzXCIgZmlsbD1cInVybCgjaWRsZUdyYWQpXCIgb3BhY2l0eT1cIjAuOFwiLz5cclxuICAgICAgICAgIDxsaW5lIHgxPVwiNjVcIiB5MT1cIjYwXCIgeDI9XCI3NVwiIHkyPVwiNTVcIiBzdHJva2U9XCJ1cmwoI2lkbGVHcmFkKVwiIHN0cm9rZS13aWR0aD1cIjRcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIvPlxyXG4gICAgICAgICAgPGxpbmUgeDE9XCI3NVwiIHkxPVwiNTVcIiB4Mj1cIjg1XCIgeTI9XCI1MFwiIHN0cm9rZT1cIiNmNmM0NDVcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiLz5cclxuICAgICAgICA8L2c+XHJcbiAgICAgIDwvc3ZnPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwibWluZXItc3RhdHVzXCIgc3R5bGU9XCJvcGFjaXR5Oi42O1wiPlx1NUY4NVx1NjczQVx1NEUyRDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgYCkgYXMgSFRNTEVsZW1lbnQ7XHJcbiAgXHJcbiAgcmV0dXJuIGNvbnRhaW5lcjtcclxufVxyXG5cclxuIiwgImltcG9ydCB7IGh0bWwgfSBmcm9tICcuLi91dGlscy9kb20nO1xyXG5cclxuLy8gXHU1QjlEXHU3QkIxXHU1MkE4XHU3NTNCXHVGRjA4XHU2NTM2XHU3N0ZGXHU2MzA5XHU5NEFFXHVGRjA5XHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUcmVhc3VyZUNoZXN0KCk6IEhUTUxFbGVtZW50IHtcclxuICByZXR1cm4gaHRtbChgXHJcbiAgICA8c3ZnIGNsYXNzPVwidHJlYXN1cmUtY2hlc3RcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxyXG4gICAgICA8ZGVmcz5cclxuICAgICAgICA8bGluZWFyR3JhZGllbnQgaWQ9XCJjaGVzdEdyYWRcIiB4MT1cIjAlXCIgeTE9XCIwJVwiIHgyPVwiMTAwJVwiIHkyPVwiMTAwJVwiPlxyXG4gICAgICAgICAgPHN0b3Agb2Zmc2V0PVwiMCVcIiBzdG9wLWNvbG9yPVwiI2Y2YzQ0NVwiLz5cclxuICAgICAgICAgIDxzdG9wIG9mZnNldD1cIjEwMCVcIiBzdG9wLWNvbG9yPVwiI2UzNjQxNFwiLz5cclxuICAgICAgICA8L2xpbmVhckdyYWRpZW50PlxyXG4gICAgICA8L2RlZnM+XHJcbiAgICAgIDxnIGNsYXNzPVwiY2hlc3QtYm9keVwiPlxyXG4gICAgICAgIDxyZWN0IHg9XCI0XCIgeT1cIjEyXCIgd2lkdGg9XCIxNlwiIGhlaWdodD1cIjEwXCIgcng9XCIxXCIgZmlsbD1cInVybCgjY2hlc3RHcmFkKVwiIHN0cm9rZT1cIiNiODg2MGJcIiBzdHJva2Utd2lkdGg9XCIwLjVcIi8+XHJcbiAgICAgICAgPHJlY3QgeD1cIjZcIiB5PVwiMTBcIiB3aWR0aD1cIjEyXCIgaGVpZ2h0PVwiM1wiIHJ4PVwiMVwiIGZpbGw9XCJ1cmwoI2NoZXN0R3JhZClcIiBzdHJva2U9XCIjYjg4NjBiXCIgc3Ryb2tlLXdpZHRoPVwiMC41XCIgY2xhc3M9XCJjaGVzdC1saWRcIi8+XHJcbiAgICAgICAgPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxN1wiIHI9XCIxLjVcIiBmaWxsPVwiI2ZmZlwiIG9wYWNpdHk9XCIwLjhcIi8+XHJcbiAgICAgIDwvZz5cclxuICAgICAgPGcgY2xhc3M9XCJjaGVzdC1jb2luc1wiPlxyXG4gICAgICAgIDxjaXJjbGUgY3g9XCIxMFwiIGN5PVwiN1wiIHI9XCIxLjVcIiBmaWxsPVwiI2Y2YzQ0NVwiIGNsYXNzPVwiY29pbiBjMVwiLz5cclxuICAgICAgICA8Y2lyY2xlIGN4PVwiMTRcIiBjeT1cIjZcIiByPVwiMS41XCIgZmlsbD1cIiNmNmM0NDVcIiBjbGFzcz1cImNvaW4gYzJcIi8+XHJcbiAgICAgICAgPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCI1XCIgcj1cIjEuNVwiIGZpbGw9XCIjZjZjNDQ1XCIgY2xhc3M9XCJjb2luIGMzXCIvPlxyXG4gICAgICA8L2c+XHJcbiAgICA8L3N2Zz5cclxuICBgKSBhcyBIVE1MRWxlbWVudDtcclxufVxyXG5cclxuLy8gXHU1MjUxXHU2QzE0XHU3Mjc5XHU2NTQ4XHVGRjA4XHU2M0EwXHU1OTNBXHU2MzA5XHU5NEFFXHVGRjA5XHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTd29yZFNsYXNoKCk6IEhUTUxFbGVtZW50IHtcclxuICByZXR1cm4gaHRtbChgXHJcbiAgICA8c3ZnIGNsYXNzPVwic3dvcmQtc2xhc2hcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxyXG4gICAgICA8ZGVmcz5cclxuICAgICAgICA8bGluZWFyR3JhZGllbnQgaWQ9XCJzbGFzaEdyYWRcIiB4MT1cIjAlXCIgeTE9XCIwJVwiIHgyPVwiMTAwJVwiIHkyPVwiMTAwJVwiPlxyXG4gICAgICAgICAgPHN0b3Agb2Zmc2V0PVwiMCVcIiBzdG9wLWNvbG9yPVwiI2ZmNWM1Y1wiLz5cclxuICAgICAgICAgIDxzdG9wIG9mZnNldD1cIjEwMCVcIiBzdG9wLWNvbG9yPVwiI2UzNjQxNFwiLz5cclxuICAgICAgICA8L2xpbmVhckdyYWRpZW50PlxyXG4gICAgICA8L2RlZnM+XHJcbiAgICAgIDxwYXRoIGNsYXNzPVwic2xhc2gtdHJhaWwgc2xhc2gxXCIgZD1cIk02IDYgTDE4IDE4XCIgc3Ryb2tlPVwidXJsKCNzbGFzaEdyYWQpXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBvcGFjaXR5PVwiMFwiLz5cclxuICAgICAgPHBhdGggY2xhc3M9XCJzbGFzaC10cmFpbCBzbGFzaDJcIiBkPVwiTTQgOCBMMTYgMjBcIiBzdHJva2U9XCJ1cmwoI3NsYXNoR3JhZClcIiBzdHJva2Utd2lkdGg9XCIxLjVcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgb3BhY2l0eT1cIjBcIi8+XHJcbiAgICAgIDxwYXRoIGQ9XCJNNyA3IEwxNyAxN1wiIHN0cm9rZT1cIiNmZmZcIiBzdHJva2Utd2lkdGg9XCIxXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIG9wYWNpdHk9XCIwLjNcIi8+XHJcbiAgICA8L3N2Zz5cclxuICBgKSBhcyBIVE1MRWxlbWVudDtcclxufVxyXG5cclxuLy8gXHU5MUQxXHU1RTAxXHU2NUNCXHU4RjZDXHVGRjA4XHU0RUE0XHU2NjEzXHU2MjQwXHVGRjA5XHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTcGlubmluZ0NvaW4oKTogSFRNTEVsZW1lbnQge1xyXG4gIHJldHVybiBodG1sKGBcclxuICAgIDxzdmcgY2xhc3M9XCJzcGlubmluZy1jb2luXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgdmlld0JveD1cIjAgMCAzMiAzMlwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cclxuICAgICAgPGRlZnM+XHJcbiAgICAgICAgPGxpbmVhckdyYWRpZW50IGlkPVwiY29pbkdyYWRcIiB4MT1cIjAlXCIgeTE9XCIwJVwiIHgyPVwiMTAwJVwiIHkyPVwiMTAwJVwiPlxyXG4gICAgICAgICAgPHN0b3Agb2Zmc2V0PVwiMCVcIiBzdG9wLWNvbG9yPVwiI2Y2YzQ0NVwiLz5cclxuICAgICAgICAgIDxzdG9wIG9mZnNldD1cIjUwJVwiIHN0b3AtY29sb3I9XCIjZmZkNzAwXCIvPlxyXG4gICAgICAgICAgPHN0b3Agb2Zmc2V0PVwiMTAwJVwiIHN0b3AtY29sb3I9XCIjZTM2NDE0XCIvPlxyXG4gICAgICAgIDwvbGluZWFyR3JhZGllbnQ+XHJcbiAgICAgIDwvZGVmcz5cclxuICAgICAgPGcgY2xhc3M9XCJjb2luLXNwaW5cIj5cclxuICAgICAgICA8ZWxsaXBzZSBjeD1cIjE2XCIgY3k9XCIxNlwiIHJ4PVwiMTJcIiByeT1cIjEyXCIgZmlsbD1cInVybCgjY29pbkdyYWQpXCIgc3Ryb2tlPVwiI2I4ODYwYlwiIHN0cm9rZS13aWR0aD1cIjFcIi8+XHJcbiAgICAgICAgPHRleHQgeD1cIjE2XCIgeT1cIjIwXCIgdGV4dC1hbmNob3I9XCJtaWRkbGVcIiBmb250LXNpemU9XCIxMlwiIGZvbnQtd2VpZ2h0PVwiYm9sZFwiIGZpbGw9XCIjZmZmXCI+QkI8L3RleHQ+XHJcbiAgICAgIDwvZz5cclxuICAgIDwvc3ZnPlxyXG4gIGApIGFzIEhUTUxFbGVtZW50O1xyXG59XHJcblxyXG4vLyBcdTU5NTZcdTY3NkZcdTUyQThcdTc1M0JcdUZGMDhcdTYzOTJcdTg4NENcdTY5OUNcdUZGMDlcclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVRyb3BoeUFuaW1hdGlvbihyYW5rOiBudW1iZXIpOiBIVE1MRWxlbWVudCB7XHJcbiAgY29uc3QgY29sb3JzID0ge1xyXG4gICAgMTogeyBwcmltYXJ5OiAnI2ZmZDcwMCcsIHNlY29uZGFyeTogJyNmNmM0NDUnIH0sIC8vIFx1OTFEMVx1ODI3MlxyXG4gICAgMjogeyBwcmltYXJ5OiAnI2MwYzBjMCcsIHNlY29uZGFyeTogJyNhOGE4YTgnIH0sIC8vIFx1OTRGNlx1ODI3MlxyXG4gICAgMzogeyBwcmltYXJ5OiAnI2NkN2YzMicsIHNlY29uZGFyeTogJyNiODczMzMnIH0sIC8vIFx1OTREQ1x1ODI3MlxyXG4gIH07XHJcbiAgY29uc3QgY29sb3IgPSBjb2xvcnNbcmFuayBhcyAxIHwgMiB8IDNdIHx8IHsgcHJpbWFyeTogJyM3QjJDRjUnLCBzZWNvbmRhcnk6ICcjMkM4OUY1JyB9O1xyXG4gIFxyXG4gIHJldHVybiBodG1sKGBcclxuICAgIDxzdmcgY2xhc3M9XCJ0cm9waHktYW5pbVwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIHZpZXdCb3g9XCIwIDAgMzIgMzJcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XHJcbiAgICAgIDxkZWZzPlxyXG4gICAgICAgIDxsaW5lYXJHcmFkaWVudCBpZD1cInRyb3BoeSR7cmFua31cIiB4MT1cIjAlXCIgeTE9XCIwJVwiIHgyPVwiMCVcIiB5Mj1cIjEwMCVcIj5cclxuICAgICAgICAgIDxzdG9wIG9mZnNldD1cIjAlXCIgc3RvcC1jb2xvcj1cIiR7Y29sb3IucHJpbWFyeX1cIi8+XHJcbiAgICAgICAgICA8c3RvcCBvZmZzZXQ9XCIxMDAlXCIgc3RvcC1jb2xvcj1cIiR7Y29sb3Iuc2Vjb25kYXJ5fVwiLz5cclxuICAgICAgICA8L2xpbmVhckdyYWRpZW50PlxyXG4gICAgICA8L2RlZnM+XHJcbiAgICAgIDxnIGNsYXNzPVwidHJvcGh5LWJvdW5jZVwiPlxyXG4gICAgICAgIDwhLS0gXHU2NzZGXHU4RUFCIC0tPlxyXG4gICAgICAgIDxwYXRoIGQ9XCJNMTAgOCBMMTAgMTQgUTEwIDE4IDE2IDE4IFEyMiAxOCAyMiAxNCBMMjIgOCBaXCIgZmlsbD1cInVybCgjdHJvcGh5JHtyYW5rfSlcIiBzdHJva2U9XCIke2NvbG9yLnNlY29uZGFyeX1cIiBzdHJva2Utd2lkdGg9XCIwLjVcIi8+XHJcbiAgICAgICAgPCEtLSBcdTgwMzNcdTY3MzUgLS0+XHJcbiAgICAgICAgPHBhdGggZD1cIk04IDEwIEw4IDEyIFE4IDEzIDkgMTNcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cInVybCgjdHJvcGh5JHtyYW5rfSlcIiBzdHJva2Utd2lkdGg9XCIxXCIvPlxyXG4gICAgICAgIDxwYXRoIGQ9XCJNMjQgMTAgTDI0IDEyIFEyNCAxMyAyMyAxM1wiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwidXJsKCN0cm9waHkke3Jhbmt9KVwiIHN0cm9rZS13aWR0aD1cIjFcIi8+XHJcbiAgICAgICAgPCEtLSBcdTVFOTVcdTVFQTcgLS0+XHJcbiAgICAgICAgPHJlY3QgeD1cIjEzXCIgeT1cIjE4XCIgd2lkdGg9XCI2XCIgaGVpZ2h0PVwiM1wiIGZpbGw9XCJ1cmwoI3Ryb3BoeSR7cmFua30pXCIvPlxyXG4gICAgICAgIDxyZWN0IHg9XCIxMVwiIHk9XCIyMVwiIHdpZHRoPVwiMTBcIiBoZWlnaHQ9XCIyXCIgcng9XCIxXCIgZmlsbD1cInVybCgjdHJvcGh5JHtyYW5rfSlcIi8+XHJcbiAgICAgICAgPCEtLSBcdTY2MUZcdTY2MUYgLS0+XHJcbiAgICAgICAgPGNpcmNsZSBjbGFzcz1cInRyb3BoeS1zdGFyXCIgY3g9XCIxNlwiIGN5PVwiNVwiIHI9XCIxLjVcIiBmaWxsPVwiJHtjb2xvci5wcmltYXJ5fVwiLz5cclxuICAgICAgPC9nPlxyXG4gICAgPC9zdmc+XHJcbiAgYCkgYXMgSFRNTEVsZW1lbnQ7XHJcbn1cclxuXHJcbi8vIFx1ODBGRFx1OTFDRlx1NkNFMlx1N0VCOVx1RkYwOFx1NjMwOVx1OTRBRVx1NzI3OVx1NjU0OFx1RkYwOVxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRW5lcmd5UmlwcGxlKCk6IEhUTUxFbGVtZW50IHtcclxuICByZXR1cm4gaHRtbChgXHJcbiAgICA8c3ZnIGNsYXNzPVwiZW5lcmd5LXJpcHBsZVwiIHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEwMCVcIiB2aWV3Qm94PVwiMCAwIDEwMCAxMDBcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgc3R5bGU9XCJwb3NpdGlvbjphYnNvbHV0ZTtpbnNldDowO3BvaW50ZXItZXZlbnRzOm5vbmU7XCI+XHJcbiAgICAgIDxjaXJjbGUgY2xhc3M9XCJyaXBwbGUgcjFcIiBjeD1cIjUwXCIgY3k9XCI1MFwiIHI9XCIyMFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwicmdiYSgxMjMsNDQsMjQ1LDAuNilcIiBzdHJva2Utd2lkdGg9XCIyXCIvPlxyXG4gICAgICA8Y2lyY2xlIGNsYXNzPVwicmlwcGxlIHIyXCIgY3g9XCI1MFwiIGN5PVwiNTBcIiByPVwiMjBcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cInJnYmEoNDQsMTM3LDI0NSwwLjQpXCIgc3Ryb2tlLXdpZHRoPVwiMlwiLz5cclxuICAgICAgPGNpcmNsZSBjbGFzcz1cInJpcHBsZSByM1wiIGN4PVwiNTBcIiBjeT1cIjUwXCIgcj1cIjIwXCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJyZ2JhKDI0NiwxOTYsNjksMC4zKVwiIHN0cm9rZS13aWR0aD1cIjJcIi8+XHJcbiAgICA8L3N2Zz5cclxuICBgKSBhcyBIVE1MRWxlbWVudDtcclxufVxyXG5cclxuLy8gXHU4OEM1XHU4RjdEXHU4RkRCXHU1RUE2XHU3QzkyXHU1QjUwXHU2RDQxXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVMb2FkaW5nUGFydGljbGVzKCk6IEhUTUxFbGVtZW50IHtcclxuICByZXR1cm4gaHRtbChgXHJcbiAgICA8c3ZnIGNsYXNzPVwibG9hZGluZy1wYXJ0aWNsZXNcIiB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMlwiIHZpZXdCb3g9XCIwIDAgNDAwIDEyXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHN0eWxlPVwicG9zaXRpb246YWJzb2x1dGU7aW5zZXQ6MDtwb2ludGVyLWV2ZW50czpub25lO1wiPlxyXG4gICAgICA8Y2lyY2xlIGNsYXNzPVwicGFydGljbGUgcGFydDFcIiBjeD1cIjBcIiBjeT1cIjZcIiByPVwiMlwiIGZpbGw9XCIjN0IyQ0Y1XCIvPlxyXG4gICAgICA8Y2lyY2xlIGNsYXNzPVwicGFydGljbGUgcGFydDJcIiBjeD1cIjBcIiBjeT1cIjZcIiByPVwiMS41XCIgZmlsbD1cIiMyQzg5RjVcIi8+XHJcbiAgICAgIDxjaXJjbGUgY2xhc3M9XCJwYXJ0aWNsZSBwYXJ0M1wiIGN4PVwiMFwiIGN5PVwiNlwiIHI9XCIyXCIgZmlsbD1cIiNmNmM0NDVcIi8+XHJcbiAgICA8L3N2Zz5cclxuICBgKSBhcyBIVE1MRWxlbWVudDtcclxufVxyXG5cclxuIiwgImltcG9ydCB7IE5ldHdvcmtNYW5hZ2VyIH0gZnJvbSAnLi4vY29yZS9OZXR3b3JrTWFuYWdlcic7XHJcbmltcG9ydCB7IFJlYWx0aW1lQ2xpZW50IH0gZnJvbSAnLi4vY29yZS9SZWFsdGltZUNsaWVudCc7XHJcbmltcG9ydCB7IGh0bWwsIHFzIH0gZnJvbSAnLi4vdXRpbHMvZG9tJztcclxuaW1wb3J0IHsgcmVuZGVyTmF2IH0gZnJvbSAnLi4vY29tcG9uZW50cy9OYXYnO1xyXG5pbXBvcnQgeyByZW5kZXJSZXNvdXJjZUJhciB9IGZyb20gJy4uL2NvbXBvbmVudHMvUmVzb3VyY2VCYXInO1xyXG5pbXBvcnQgeyBzaG93VG9hc3QgfSBmcm9tICcuLi9jb21wb25lbnRzL1RvYXN0JztcclxuaW1wb3J0IHsgc3Bhd25GbG9hdFRleHQgfSBmcm9tICcuLi9jb21wb25lbnRzL0Zsb2F0VGV4dCc7XHJcbmltcG9ydCB7IHJlbmRlckljb24gfSBmcm9tICcuLi9jb21wb25lbnRzL0ljb24nO1xyXG5pbXBvcnQgeyBzaG93QWREaWFsb2cgfSBmcm9tICcuLi9jb21wb25lbnRzL0FkRGlhbG9nJztcclxuaW1wb3J0IHsgY3JlYXRlTWluZXJBbmltYXRpb24sIGNyZWF0ZUlkbGVNaW5lciB9IGZyb20gJy4uL2NvbXBvbmVudHMvTWluZXJBbmltYXRpb24nO1xyXG5pbXBvcnQgeyBjcmVhdGVUcmVhc3VyZUNoZXN0IH0gZnJvbSAnLi4vY29tcG9uZW50cy9BbmltYXRlZEljb25zJztcclxuXHJcbnR5cGUgTWluZVN0YXR1cyA9IHtcclxuICBjYXJ0QW1vdW50OiBudW1iZXI7XHJcbiAgY2FydENhcGFjaXR5OiBudW1iZXI7XHJcbiAgY29sbGFwc2VkOiBib29sZWFuO1xyXG4gIGNvbGxhcHNlZFJlbWFpbmluZzogbnVtYmVyO1xyXG4gIHJ1bm5pbmc6IGJvb2xlYW47XHJcbiAgaW50ZXJ2YWxNczogbnVtYmVyO1xyXG59O1xyXG5cclxudHlwZSBQZW5kaW5nQWN0aW9uID0gJ3N0YXJ0JyB8ICdzdG9wJyB8ICdjb2xsZWN0JyB8ICdyZXBhaXInIHwgJ3N0YXR1cycgfCBudWxsO1xyXG5cclxuZXhwb3J0IGNsYXNzIE1haW5TY2VuZSB7XHJcbiAgcHJpdmF0ZSB2aWV3OiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xyXG4gIHByaXZhdGUgY2FydEFtdCA9IDA7XHJcbiAgcHJpdmF0ZSBjYXJ0Q2FwID0gMTAwMDtcclxuICBwcml2YXRlIGlzTWluaW5nID0gZmFsc2U7XHJcbiAgcHJpdmF0ZSBpc0NvbGxhcHNlZCA9IGZhbHNlO1xyXG4gIHByaXZhdGUgY29sbGFwc2VSZW1haW5pbmcgPSAwO1xyXG4gIHByaXZhdGUgY29sbGFwc2VUaW1lcjogbnVtYmVyIHwgbnVsbCA9IG51bGw7XHJcbiAgcHJpdmF0ZSBpbnRlcnZhbE1zID0gMzAwMDtcclxuICBwcml2YXRlIHBlbmRpbmc6IFBlbmRpbmdBY3Rpb24gPSBudWxsO1xyXG5cclxuICBwcml2YXRlIGVscyA9IHtcclxuICAgIGZpbGw6IG51bGwgYXMgSFRNTEVsZW1lbnQgfCBudWxsLFxyXG4gICAgcGVyY2VudDogbnVsbCBhcyBIVE1MRWxlbWVudCB8IG51bGwsXHJcbiAgICBzdGF0dXNUZXh0OiBudWxsIGFzIEhUTUxFbGVtZW50IHwgbnVsbCxcclxuICAgIHJpbmc6IG51bGwgYXMgSFRNTEVsZW1lbnQgfCBudWxsLFxyXG4gICAgcmluZ1BjdDogbnVsbCBhcyBIVE1MRWxlbWVudCB8IG51bGwsXHJcbiAgICBjeWNsZTogbnVsbCBhcyBIVE1MRWxlbWVudCB8IG51bGwsXHJcbiAgICBzdGF0dXNUYWc6IG51bGwgYXMgSFRNTEVsZW1lbnQgfCBudWxsLFxyXG4gICAgZXZlbnRzOiBudWxsIGFzIEhUTUxFbGVtZW50IHwgbnVsbCxcclxuICAgIHN0YXJ0OiBudWxsIGFzIEhUTUxCdXR0b25FbGVtZW50IHwgbnVsbCxcclxuICAgIHN0b3A6IG51bGwgYXMgSFRNTEJ1dHRvbkVsZW1lbnQgfCBudWxsLFxyXG4gICAgY29sbGVjdDogbnVsbCBhcyBIVE1MQnV0dG9uRWxlbWVudCB8IG51bGwsXHJcbiAgICByZXBhaXI6IG51bGwgYXMgSFRNTEJ1dHRvbkVsZW1lbnQgfCBudWxsLFxyXG4gICAgc3RhdHVzQnRuOiBudWxsIGFzIEhUTUxCdXR0b25FbGVtZW50IHwgbnVsbCxcclxuICAgIGhvbG9ncmFtOiBudWxsIGFzIEhUTUxFbGVtZW50IHwgbnVsbCxcclxuICAgIG1pbmVyQ2hhcjogbnVsbCBhcyBIVE1MRWxlbWVudCB8IG51bGwsXHJcbiAgfTtcclxuXHJcbiAgcHJpdmF0ZSBtaW5lVXBkYXRlSGFuZGxlcj86IChtc2c6IGFueSkgPT4gdm9pZDtcclxuICBwcml2YXRlIG1pbmVDb2xsYXBzZUhhbmRsZXI/OiAobXNnOiBhbnkpID0+IHZvaWQ7XHJcbiAgcHJpdmF0ZSBwbHVuZGVySGFuZGxlcj86IChtc2c6IGFueSkgPT4gdm9pZDtcclxuXHJcbiAgYXN5bmMgbW91bnQocm9vdDogSFRNTEVsZW1lbnQpIHtcclxuICAgIHRoaXMuY2xlYXJDb2xsYXBzZVRpbWVyKCk7XHJcbiAgICB0aGlzLnBlbmRpbmcgPSBudWxsO1xyXG5cclxuICAgIGNvbnN0IG5hdiA9IHJlbmRlck5hdignbWFpbicpO1xyXG4gICAgY29uc3QgYmFyID0gcmVuZGVyUmVzb3VyY2VCYXIoKTtcclxuICAgIGNvbnN0IHZpZXcgPSBodG1sKGBcclxuICAgICAgPHNlY3Rpb24gY2xhc3M9XCJtYWluLXNjcmVlblwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJtYWluLWFtYmllbnRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj5cclxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYW1iaWVudCBvcmIgb3JiLWFcIj48L3NwYW4+XHJcbiAgICAgICAgICA8c3BhbiBjbGFzcz1cImFtYmllbnQgb3JiIG9yYi1iXCI+PC9zcGFuPlxyXG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJhbWJpZW50IGdyaWRcIj48L3NwYW4+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lciBtYWluLXN0YWNrXCIgc3R5bGU9XCJjb2xvcjojZmZmO1wiPlxyXG4gICAgICAgICAgPHNlY3Rpb24gY2xhc3M9XCJtaW5lIGNhcmQgbWluZS1jYXJkIGZhZGUtaW5cIj5cclxuICAgICAgICAgICAgPGhlYWRlciBjbGFzcz1cIm1pbmUtaGVhZGVyXCI+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1pbmUtdGl0bGVcIj5cclxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGl0bGUtaWNvblwiIGRhdGEtaWNvPVwicGlja1wiPjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGl0bGUtbGFiZWxcIj5cdTYzMTZcdTc3RkZcdTk3NjJcdTY3N0Y8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1pbmUtY2hpcHNcIj5cclxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicGlsbFwiIGlkPVwic3RhdHVzVGFnXCI+XHU1Rjg1XHU2NzNBPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwaWxsIHBpbGwtY3ljbGVcIj48c3BhbiBkYXRhLWljbz1cImNsb2NrXCI+PC9zcGFuPlx1NTQ2OFx1NjcxRiA8c3BhbiBpZD1cImN5Y2xlXCI+M3M8L3NwYW4+PC9zcGFuPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2hlYWRlcj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1pbmUtZ3JpZFwiPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtaW5lLWdhdWdlXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicmluZ1wiIGlkPVwicmluZ1wiPlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicmluZy1jb3JlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gaWQ9XCJyaW5nUGN0XCI+MCU8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNtYWxsPlx1ODhDNVx1OEY3RFx1NzM4Nzwvc21hbGw+XHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicmluZy1nbG93IHJpbmctZ2xvdy1hXCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicmluZy1nbG93IHJpbmctZ2xvdy1iXCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1pbmUtcHJvZ3Jlc3NcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtaW5lci1jaGFyLXdyYXBwZXJcIiBpZD1cIm1pbmVyQ2hhclwiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1pbmUtcHJvZ3Jlc3MtbWV0YVwiPlxyXG4gICAgICAgICAgICAgICAgICA8c3Bhbj5cdTc3RkZcdThGNjZcdTg4QzVcdThGN0Q8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgIDxzdHJvbmcgaWQ9XCJwZXJjZW50XCI+MCU8L3N0cm9uZz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1pbmUtcHJvZ3Jlc3MtdHJhY2tcIj5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1pbmUtcHJvZ3Jlc3MtZmlsbFwiIGlkPVwiZmlsbFwiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGlkPVwic3RhdHVzVGV4dFwiIGNsYXNzPVwibWluZS1zdGF0dXNcIj48L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtaW5lLWFjdGlvbnMtZ3JpZFwiPlxyXG4gICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJzdGFydFwiIGNsYXNzPVwiYnRuIGJ0bi1idXkgc3Bhbi0yXCI+PHNwYW4gZGF0YS1pY289XCJwbGF5XCI+PC9zcGFuPlx1NUYwMFx1NTlDQlx1NjMxNlx1NzdGRjwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJzdG9wXCIgY2xhc3M9XCJidG4gYnRuLWdob3N0XCI+PHNwYW4gZGF0YS1pY289XCJzdG9wXCI+PC9zcGFuPlx1NTA1Q1x1NkI2MjwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJjb2xsZWN0XCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIj48c3BhbiBkYXRhLWljbz1cImNvbGxlY3RcIj48L3NwYW4+XHU2NTM2XHU3N0ZGPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInN0YXR1c1wiIGNsYXNzPVwiYnRuIGJ0bi1naG9zdFwiPjxzcGFuIGRhdGEtaWNvPVwicmVmcmVzaFwiPjwvc3Bhbj5cdTUyMzdcdTY1QjBcdTcyQjZcdTYwMDE8L2J1dHRvbj5cclxuICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwicmVwYWlyXCIgY2xhc3M9XCJidG4gYnRuLXNlbGxcIj48c3BhbiBkYXRhLWljbz1cIndyZW5jaFwiPjwvc3Bhbj5cdTRGRUVcdTc0MDY8L2J1dHRvbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtaW5lLWZlZWRcIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZXZlbnQtZmVlZFwiIGlkPVwiZXZlbnRzXCI+PC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWluZS1ob2xvZ3JhbVwiIGlkPVwiaG9sb2dyYW1cIiBhcmlhLWhpZGRlbj1cInRydWVcIj5cclxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm1pbmUtaG9sby1ncmlkXCI+PC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibWluZS1ob2xvLWdyaWQgZGlhZ29uYWxcIj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJtaW5lLWhvbG8tZ2xvd1wiPjwvc3Bhbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L3NlY3Rpb24+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvc2VjdGlvbj5cclxuICAgIGApO1xyXG5cclxuICAgIHJvb3QuaW5uZXJIVE1MID0gJyc7XHJcbiAgICByb290LmFwcGVuZENoaWxkKG5hdik7XHJcbiAgICByb290LmFwcGVuZENoaWxkKGJhci5yb290KTtcclxuICAgIHJvb3QuYXBwZW5kQ2hpbGQodmlldyk7XHJcblxyXG4gICAgdGhpcy52aWV3ID0gdmlldztcclxuICAgIC8vIG1vdW50IGljb25zIGluIGhlYWRlci9idXR0b25zXHJcbiAgICB0cnkge1xyXG4gICAgICB2aWV3LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWljb10nKVxyXG4gICAgICAgIC5mb3JFYWNoKChlbCkgPT4ge1xyXG4gICAgICAgICAgY29uc3QgbmFtZSA9IChlbCBhcyBIVE1MRWxlbWVudCkuZ2V0QXR0cmlidXRlKCdkYXRhLWljbycpIGFzIGFueTtcclxuICAgICAgICAgIHRyeSB7IGVsLmFwcGVuZENoaWxkKHJlbmRlckljb24obmFtZSwgeyBzaXplOiAyMCB9KSk7IH0gY2F0Y2gge31cclxuICAgICAgICB9KTtcclxuICAgIH0gY2F0Y2gge31cclxuICAgIHRoaXMuY2FjaGVFbGVtZW50cygpO1xyXG4gICAgdGhpcy5hdHRhY2hIYW5kbGVycyhiYXIudXBkYXRlLmJpbmQoYmFyKSk7XHJcbiAgICBhd2FpdCBiYXIudXBkYXRlKCk7XHJcbiAgICB0aGlzLnNldHVwUmVhbHRpbWUoKTtcclxuICAgIGF3YWl0IHRoaXMucmVmcmVzaFN0YXR1cygpO1xyXG4gICAgdGhpcy51cGRhdGVQcm9ncmVzcygpO1xyXG4gICAgdGhpcy51cGRhdGVDb250cm9scygpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjYWNoZUVsZW1lbnRzKCkge1xyXG4gICAgaWYgKCF0aGlzLnZpZXcpIHJldHVybjtcclxuICAgIHRoaXMuZWxzLmZpbGwgPSBxcyh0aGlzLnZpZXcsICcjZmlsbCcpO1xyXG4gICAgdGhpcy5lbHMucGVyY2VudCA9IHFzKHRoaXMudmlldywgJyNwZXJjZW50Jyk7XHJcbiAgICB0aGlzLmVscy5zdGF0dXNUZXh0ID0gcXModGhpcy52aWV3LCAnI3N0YXR1c1RleHQnKTtcclxuICAgIHRoaXMuZWxzLnJpbmcgPSB0aGlzLnZpZXcucXVlcnlTZWxlY3RvcignI3JpbmcnKTtcclxuICAgIHRoaXMuZWxzLnJpbmdQY3QgPSB0aGlzLnZpZXcucXVlcnlTZWxlY3RvcignI3JpbmdQY3QnKTtcclxuICAgIHRoaXMuZWxzLmN5Y2xlID0gdGhpcy52aWV3LnF1ZXJ5U2VsZWN0b3IoJyNjeWNsZScpO1xyXG4gICAgdGhpcy5lbHMuc3RhdHVzVGFnID0gdGhpcy52aWV3LnF1ZXJ5U2VsZWN0b3IoJyNzdGF0dXNUYWcnKTtcclxuICAgIHRoaXMuZWxzLmV2ZW50cyA9IHRoaXMudmlldy5xdWVyeVNlbGVjdG9yKCcjZXZlbnRzJyk7XHJcbiAgICB0aGlzLmVscy5zdGFydCA9IHFzPEhUTUxCdXR0b25FbGVtZW50Pih0aGlzLnZpZXcsICcjc3RhcnQnKTtcclxuICAgIHRoaXMuZWxzLnN0b3AgPSBxczxIVE1MQnV0dG9uRWxlbWVudD4odGhpcy52aWV3LCAnI3N0b3AnKTtcclxuICAgIHRoaXMuZWxzLmNvbGxlY3QgPSBxczxIVE1MQnV0dG9uRWxlbWVudD4odGhpcy52aWV3LCAnI2NvbGxlY3QnKTtcclxuICAgIHRoaXMuZWxzLnJlcGFpciA9IHFzPEhUTUxCdXR0b25FbGVtZW50Pih0aGlzLnZpZXcsICcjcmVwYWlyJyk7XHJcbiAgICB0aGlzLmVscy5zdGF0dXNCdG4gPSBxczxIVE1MQnV0dG9uRWxlbWVudD4odGhpcy52aWV3LCAnI3N0YXR1cycpO1xyXG4gICAgdGhpcy5lbHMuaG9sb2dyYW0gPSB0aGlzLnZpZXcucXVlcnlTZWxlY3RvcignI2hvbG9ncmFtJyk7XHJcbiAgICB0aGlzLmVscy5taW5lckNoYXIgPSB0aGlzLnZpZXcucXVlcnlTZWxlY3RvcignI21pbmVyQ2hhcicpO1xyXG4gICAgXHJcbiAgICAvLyBcdTUyMURcdTU5Q0JcdTUzMTZcdTc3RkZcdTVERTVcdTg5RDJcdTgyNzJcclxuICAgIHRoaXMudXBkYXRlTWluZXJBbmltYXRpb24oKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXR0YWNoSGFuZGxlcnModXBkYXRlQmFyOiAoKSA9PiBQcm9taXNlPHZvaWQ+KSB7XHJcbiAgICBpZiAoIXRoaXMudmlldykgcmV0dXJuO1xyXG4gICAgdGhpcy5lbHMuc3RhcnQ/LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdGhpcy5oYW5kbGVTdGFydCgpKTtcclxuICAgIHRoaXMuZWxzLnN0b3A/LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdGhpcy5oYW5kbGVTdG9wKCkpO1xyXG4gICAgdGhpcy5lbHMuc3RhdHVzQnRuPy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRoaXMucmVmcmVzaFN0YXR1cygpKTtcclxuICAgIHRoaXMuZWxzLnJlcGFpcj8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0aGlzLmhhbmRsZVJlcGFpcigpKTtcclxuICAgIHRoaXMuZWxzLmNvbGxlY3Q/LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdGhpcy5oYW5kbGVDb2xsZWN0KHVwZGF0ZUJhcikpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzZXR1cFJlYWx0aW1lKCkge1xyXG4gICAgY29uc3QgdG9rZW4gPSBOZXR3b3JrTWFuYWdlci5JLmdldFRva2VuKCk7XHJcbiAgICBpZiAodG9rZW4pIFJlYWx0aW1lQ2xpZW50LkkuY29ubmVjdCh0b2tlbik7XHJcblxyXG4gICAgaWYgKHRoaXMubWluZVVwZGF0ZUhhbmRsZXIpIFJlYWx0aW1lQ2xpZW50Lkkub2ZmKCdtaW5lLnVwZGF0ZScsIHRoaXMubWluZVVwZGF0ZUhhbmRsZXIpO1xyXG4gICAgaWYgKHRoaXMubWluZUNvbGxhcHNlSGFuZGxlcikgUmVhbHRpbWVDbGllbnQuSS5vZmYoJ21pbmUuY29sbGFwc2UnLCB0aGlzLm1pbmVDb2xsYXBzZUhhbmRsZXIpO1xyXG4gICAgaWYgKHRoaXMucGx1bmRlckhhbmRsZXIpIFJlYWx0aW1lQ2xpZW50Lkkub2ZmKCdwbHVuZGVyLmF0dGFja2VkJywgdGhpcy5wbHVuZGVySGFuZGxlcik7XHJcblxyXG4gICAgdGhpcy5taW5lVXBkYXRlSGFuZGxlciA9IChtc2cpID0+IHtcclxuICAgICAgdGhpcy5jYXJ0QW10ID0gdHlwZW9mIG1zZy5jYXJ0QW1vdW50ID09PSAnbnVtYmVyJyA/IG1zZy5jYXJ0QW1vdW50IDogdGhpcy5jYXJ0QW10O1xyXG4gICAgICB0aGlzLmNhcnRDYXAgPSB0eXBlb2YgbXNnLmNhcnRDYXBhY2l0eSA9PT0gJ251bWJlcicgPyBtc2cuY2FydENhcGFjaXR5IDogdGhpcy5jYXJ0Q2FwO1xyXG4gICAgICB0aGlzLmlzTWluaW5nID0gbXNnLnJ1bm5pbmcgPz8gdGhpcy5pc01pbmluZztcclxuICAgICAgaWYgKG1zZy5jb2xsYXBzZWQgJiYgbXNnLmNvbGxhcHNlZFJlbWFpbmluZykge1xyXG4gICAgICAgIHRoaXMuYmVnaW5Db2xsYXBzZUNvdW50ZG93bihtc2cuY29sbGFwc2VkUmVtYWluaW5nKTtcclxuICAgICAgfSBlbHNlIGlmICghbXNnLmNvbGxhcHNlZCkge1xyXG4gICAgICAgIHRoaXMuaXNDb2xsYXBzZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmNsZWFyQ29sbGFwc2VUaW1lcigpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMudXBkYXRlUHJvZ3Jlc3MoKTtcclxuICAgICAgXHJcbiAgICAgIC8vIFx1Nzg4RVx1NzI0N1x1ODNCN1x1NUY5N1x1NjNEMFx1NzkzQVxyXG4gICAgICBpZiAobXNnLmZyYWdtZW50KSB7XHJcbiAgICAgICAgY29uc3QgZnJhZ21lbnROYW1lczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcclxuICAgICAgICAgIG1pbmVyOiAnXHU3N0ZGXHU2NzNBXHU3ODhFXHU3MjQ3JyxcclxuICAgICAgICAgIGNhcnQ6ICdcdTc3RkZcdThGNjZcdTc4OEVcdTcyNDcnLFxyXG4gICAgICAgICAgcmFpZGVyOiAnXHU2M0EwXHU1OTNBXHU1NjY4XHU3ODhFXHU3MjQ3JyxcclxuICAgICAgICAgIHNoaWVsZDogJ1x1OTYzMlx1NUZBMVx1NzZGRVx1Nzg4RVx1NzI0NycsXHJcbiAgICAgICAgfTtcclxuICAgICAgICBzaG93VG9hc3QoYFx1RDgzRFx1REM4RSBcdTgzQjdcdTVGOTcgJHtmcmFnbWVudE5hbWVzW21zZy5mcmFnbWVudC50eXBlXSB8fCAnXHU3ODhFXHU3MjQ3J30geCR7bXNnLmZyYWdtZW50LmFtb3VudH1gLCAnc3VjY2VzcycpO1xyXG4gICAgICAgIHRoaXMubG9nRXZlbnQoYFx1ODNCN1x1NUY5N1x1Nzg4RVx1NzI0N1x1RkYxQSR7ZnJhZ21lbnROYW1lc1ttc2cuZnJhZ21lbnQudHlwZV19IHgke21zZy5mcmFnbWVudC5hbW91bnR9YCk7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIGlmIChtc2cudHlwZSA9PT0gJ2NyaXRpY2FsJyAmJiBtc2cuYW1vdW50KSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0dXNNZXNzYWdlKGBcdTg5RTZcdTUzRDFcdTY2QjRcdTUxRkJcdUZGMENcdTc3RkZcdThGNjZcdTU4OUVcdTUyQTAgJHttc2cuYW1vdW50fVx1RkYwMWApO1xyXG4gICAgICAgIHRoaXMubG9nRXZlbnQoYFx1NjZCNFx1NTFGQiArJHttc2cuYW1vdW50fWApO1xyXG4gICAgICB9IGVsc2UgaWYgKG1zZy50eXBlID09PSAnbm9ybWFsJyAmJiBtc2cuYW1vdW50KSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0dXNNZXNzYWdlKGBcdTc3RkZcdThGNjZcdTU4OUVcdTUyQTAgJHttc2cuYW1vdW50fVx1RkYwQ1x1NUY1M1x1NTI0RCAke3RoaXMuZm9ybWF0UGVyY2VudCgpfWApO1xyXG4gICAgICAgIHRoaXMubG9nRXZlbnQoYFx1NjMxNlx1NjM5OCArJHttc2cuYW1vdW50fWApO1xyXG4gICAgICB9IGVsc2UgaWYgKG1zZy50eXBlID09PSAnY29sbGFwc2UnKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0dXNNZXNzYWdlKCdcdTc3RkZcdTkwNTNcdTU3NERcdTU4NENcdUZGMENcdThCRjdcdTdBQ0JcdTUzNzNcdTRGRUVcdTc0MDYnKTtcclxuICAgICAgICB0aGlzLmxvZ0V2ZW50KCdcdTc3RkZcdTkwNTNcdTU3NERcdTU4NEMnKTtcclxuICAgICAgfSBlbHNlIGlmIChtc2cudHlwZSA9PT0gJ2NvbGxlY3QnKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0dXNNZXNzYWdlKCdcdTc3RkZcdTc3RjNcdTVERjJcdTY1MzZcdTk2QzZcdUZGMENcdTc3RkZcdThGNjZcdTZFMDVcdTdBN0EnKTtcclxuICAgICAgICB0aGlzLmxvZ0V2ZW50KCdcdTY1MzZcdTk2QzZcdTVCOENcdTYyMTAnKTtcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLmlzQ29sbGFwc2VkKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0dXNNZXNzYWdlKGBcdTc3RkZcdTkwNTNcdTU3NERcdTU4NENcdUZGMENcdTUyNjlcdTRGNTkgJHt0aGlzLmNvbGxhcHNlUmVtYWluaW5nfXNgKTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMubWluZUNvbGxhcHNlSGFuZGxlciA9IChtc2cpID0+IHtcclxuICAgICAgY29uc3Qgc2Vjb25kcyA9IE51bWJlcihtc2c/LnJlcGFpcl9kdXJhdGlvbikgfHwgMDtcclxuICAgICAgaWYgKHNlY29uZHMgPiAwKSB0aGlzLmJlZ2luQ29sbGFwc2VDb3VudGRvd24oc2Vjb25kcyk7XHJcbiAgICAgIHNob3dUb2FzdChgXHU3N0ZGXHU5MDUzXHU1NzREXHU1ODRDXHVGRjBDXHU5NzAwXHU0RkVFXHU3NDA2XHVGRjA4XHU3RUE2ICR7c2Vjb25kc31zXHVGRjA5YCwgJ3dhcm4nKTtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5wbHVuZGVySGFuZGxlciA9IChtc2cpID0+IHtcclxuICAgICAgc2hvd1RvYXN0KGBcdTg4QUJcdTYzQTBcdTU5M0FcdUZGMUFcdTY3NjVcdTgxRUEgJHttc2cuYXR0YWNrZXJ9XHVGRjBDXHU2MzVGXHU1OTMxICR7bXNnLmxvc3N9YCwgJ3dhcm4nKTtcclxuICAgICAgdGhpcy5sb2dFdmVudChgXHU4OEFCICR7bXNnLmF0dGFja2VyfSBcdTYzQTBcdTU5M0EgLSR7bXNnLmxvc3N9YCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIFx1NTE2OFx1NjcwRFx1NUU3Rlx1NjRBRFx1NzZEMVx1NTQyQ1xyXG4gICAgUmVhbHRpbWVDbGllbnQuSS5vbignZ2xvYmFsLmFubm91bmNlbWVudCcsIChtc2cpID0+IHtcclxuICAgICAgaWYgKG1zZy50eXBlID09PSAndXBncmFkZScpIHtcclxuICAgICAgICBzaG93VG9hc3QoYFx1RDgzRFx1RENFMiAke21zZy5tZXNzYWdlfWAsICdzdWNjZXNzJyk7XHJcbiAgICAgICAgdGhpcy5sb2dFdmVudChgW1x1NTE2OFx1NjcwRF0gJHttc2cubWVzc2FnZX1gKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgUmVhbHRpbWVDbGllbnQuSS5vbignbWluZS51cGRhdGUnLCB0aGlzLm1pbmVVcGRhdGVIYW5kbGVyKTtcclxuICAgIFJlYWx0aW1lQ2xpZW50Lkkub24oJ21pbmUuY29sbGFwc2UnLCB0aGlzLm1pbmVDb2xsYXBzZUhhbmRsZXIpO1xyXG4gICAgUmVhbHRpbWVDbGllbnQuSS5vbigncGx1bmRlci5hdHRhY2tlZCcsIHRoaXMucGx1bmRlckhhbmRsZXIpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhc3luYyBoYW5kbGVTdGFydCgpIHtcclxuICAgIGlmICh0aGlzLnBlbmRpbmcgfHwgdGhpcy5pc0NvbGxhcHNlZCkge1xyXG4gICAgICBpZiAodGhpcy5pc0NvbGxhcHNlZCkgc2hvd1RvYXN0KCdcdTc3RkZcdTkwNTNcdTU3NERcdTU4NENcdUZGMENcdThCRjdcdTUxNDhcdTRGRUVcdTc0MDYnLCAnd2FybicpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0aGlzLnBlbmRpbmcgPSAnc3RhcnQnO1xyXG4gICAgdGhpcy51cGRhdGVDb250cm9scygpO1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3Qgc3RhdHVzID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PE1pbmVTdGF0dXM+KCcvbWluZS9zdGFydCcsIHsgbWV0aG9kOiAnUE9TVCcgfSk7XHJcbiAgICAgIHRoaXMuYXBwbHlTdGF0dXMoc3RhdHVzKTtcclxuICAgICAgdGhpcy5zZXRTdGF0dXNNZXNzYWdlKCdcdTc3RkZcdTY3M0FcdTVERjJcdTU0MkZcdTUyQTgnKTtcclxuICAgICAgc2hvd1RvYXN0KCdcdTc3RkZcdTY3M0FcdTVERjJcdTU0MkZcdTUyQTgnLCAnc3VjY2VzcycpO1xyXG4gICAgfSBjYXRjaCAoZTogYW55KSB7XHJcbiAgICAgIHNob3dUb2FzdChlPy5tZXNzYWdlIHx8ICdcdTU0MkZcdTUyQThcdTU5MzFcdThEMjUnLCAnZXJyb3InKTtcclxuICAgIH0gZmluYWxseSB7XHJcbiAgICAgIHRoaXMucGVuZGluZyA9IG51bGw7XHJcbiAgICAgIHRoaXMudXBkYXRlQ29udHJvbHMoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXN5bmMgaGFuZGxlU3RvcCgpIHtcclxuICAgIGlmICh0aGlzLnBlbmRpbmcpIHJldHVybjtcclxuICAgIHRoaXMucGVuZGluZyA9ICdzdG9wJztcclxuICAgIHRoaXMudXBkYXRlQ29udHJvbHMoKTtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHN0YXR1cyA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDxNaW5lU3RhdHVzPignL21pbmUvc3RvcCcsIHsgbWV0aG9kOiAnUE9TVCcgfSk7XHJcbiAgICAgIHRoaXMuYXBwbHlTdGF0dXMoc3RhdHVzKTtcclxuICAgICAgdGhpcy5zZXRTdGF0dXNNZXNzYWdlKCdcdTc3RkZcdTY3M0FcdTVERjJcdTUwNUNcdTZCNjInKTtcclxuICAgICAgc2hvd1RvYXN0KCdcdTc3RkZcdTY3M0FcdTVERjJcdTUwNUNcdTZCNjInLCAnc3VjY2VzcycpO1xyXG4gICAgfSBjYXRjaCAoZTogYW55KSB7XHJcbiAgICAgIHNob3dUb2FzdChlPy5tZXNzYWdlIHx8ICdcdTUwNUNcdTZCNjJcdTU5MzFcdThEMjUnLCAnZXJyb3InKTtcclxuICAgIH0gZmluYWxseSB7XHJcbiAgICAgIHRoaXMucGVuZGluZyA9IG51bGw7XHJcbiAgICAgIHRoaXMudXBkYXRlQ29udHJvbHMoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXN5bmMgaGFuZGxlQ29sbGVjdCh1cGRhdGVCYXI6ICgpID0+IFByb21pc2U8dm9pZD4pIHtcclxuICAgIGlmICh0aGlzLnBlbmRpbmcgfHwgdGhpcy5jYXJ0QW10IDw9IDApIHJldHVybjtcclxuICAgIFxyXG4gICAgLy8gXHU2OEMwXHU2N0U1VklQXHU3MkI2XHU2MDAxXHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCB2aXBTdGF0dXMgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyBpc1ZpcDogYm9vbGVhbiB9PignL3VzZXIvdmlwLXN0YXR1cycpO1xyXG4gICAgICBpZiAoIXZpcFN0YXR1cy5pc1ZpcCkge1xyXG4gICAgICAgIC8vIFx1OTc1RVZJUFx1RkYwQ1x1NjYzRVx1NzkzQVx1NUU3Rlx1NTQ0QVxyXG4gICAgICAgIGNvbnN0IHdhdGNoZWQgPSBhd2FpdCBzaG93QWREaWFsb2coKTtcclxuICAgICAgICBpZiAoIXdhdGNoZWQpIHtcclxuICAgICAgICAgIC8vIFx1NzUyOFx1NjIzN1x1OERGM1x1OEZDN1x1NUU3Rlx1NTQ0QVx1RkYwQ1x1NEUwRFx1NjUzNlx1NzdGRlxyXG4gICAgICAgICAgc2hvd1RvYXN0KCdcdTVERjJcdThERjNcdThGQzdcdTVFN0ZcdTU0NEFcdUZGMENcdTY1MzZcdTc3RkZcdTUzRDZcdTZEODgnLCAnd2FybicpO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZTogYW55KSB7XHJcbiAgICAgIGNvbnNvbGUud2FybignVklQIHN0YXR1cyBjaGVjayBmYWlsZWQ6JywgZSk7XHJcbiAgICAgIC8vIFx1NTk4Mlx1Njc5Q1x1NjhDMFx1NjdFNVx1NTkzMVx1OEQyNVx1RkYwQ1x1NTE0MVx1OEJCOFx1N0VFN1x1N0VFRFx1RkYwOFx1OTY0RFx1N0VBN1x1NTkwNFx1NzQwNlx1RkYwOVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICB0aGlzLnBlbmRpbmcgPSAnY29sbGVjdCc7XHJcbiAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzKCk7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCByZXMgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyBjb2xsZWN0ZWQ6IG51bWJlcjsgc3RhdHVzOiBNaW5lU3RhdHVzIH0+KCcvbWluZS9jb2xsZWN0JywgeyBtZXRob2Q6ICdQT1NUJyB9KTtcclxuICAgICAgaWYgKHJlcy5zdGF0dXMpIHRoaXMuYXBwbHlTdGF0dXMocmVzLnN0YXR1cyk7XHJcbiAgICAgIGlmIChyZXMuY29sbGVjdGVkID4gMCkge1xyXG4gICAgICAgIC8vIFx1NTIxQlx1NUVGQVx1NjI5Qlx1NzI2OVx1N0VCRlx1OThERVx1ODg0Q1x1NTJBOFx1NzUzQlxyXG4gICAgICAgIHRoaXMuY3JlYXRlRmx5aW5nT3JlQW5pbWF0aW9uKHJlcy5jb2xsZWN0ZWQpO1xyXG4gICAgICAgIHNob3dUb2FzdChgXHU2NTM2XHU5NkM2XHU3N0ZGXHU3N0YzICR7cmVzLmNvbGxlY3RlZH1gLCAnc3VjY2VzcycpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNob3dUb2FzdCgnXHU3N0ZGXHU4RjY2XHU0RTNBXHU3QTdBXHVGRjBDXHU2NUUwXHU3N0ZGXHU3N0YzXHU1M0VGXHU2NTM2XHU5NkM2JywgJ3dhcm4nKTtcclxuICAgICAgfVxyXG4gICAgICBhd2FpdCB1cGRhdGVCYXIoKTtcclxuICAgIH0gY2F0Y2ggKGU6IGFueSkge1xyXG4gICAgICBzaG93VG9hc3QoZT8ubWVzc2FnZSB8fCAnXHU2NTM2XHU3N0ZGXHU1OTMxXHU4RDI1JywgJ2Vycm9yJyk7XHJcbiAgICB9IGZpbmFsbHkge1xyXG4gICAgICB0aGlzLnBlbmRpbmcgPSBudWxsO1xyXG4gICAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNyZWF0ZUZseWluZ09yZUFuaW1hdGlvbihhbW91bnQ6IG51bWJlcikge1xyXG4gICAgY29uc3QgZmlsbEVsID0gdGhpcy5lbHMuZmlsbDtcclxuICAgIGNvbnN0IG9yZUVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI29yZScpO1xyXG4gICAgaWYgKCFmaWxsRWwgfHwgIW9yZUVsKSByZXR1cm47XHJcblxyXG4gICAgY29uc3Qgc3RhcnRSZWN0ID0gZmlsbEVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgY29uc3QgZW5kUmVjdCA9IG9yZUVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cclxuICAgIC8vIFx1NTIxQlx1NUVGQVx1NTkxQVx1NEUyQVx1NzdGRlx1NzdGM1x1N0M5Mlx1NUI1MFxyXG4gICAgY29uc3QgcGFydGljbGVDb3VudCA9IE1hdGgubWluKDgsIE1hdGgubWF4KDMsIE1hdGguZmxvb3IoYW1vdW50IC8gMjApKSk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcnRpY2xlQ291bnQ7IGkrKykge1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBjb25zdCBwYXJ0aWNsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHBhcnRpY2xlLmNsYXNzTmFtZSA9ICdvcmUtcGFydGljbGUnO1xyXG4gICAgICAgIHBhcnRpY2xlLnRleHRDb250ZW50ID0gJ1x1RDgzRFx1REM4RSc7XHJcbiAgICAgICAgcGFydGljbGUuc3R5bGUuY3NzVGV4dCA9IGBcclxuICAgICAgICAgIHBvc2l0aW9uOiBmaXhlZDtcclxuICAgICAgICAgIGxlZnQ6ICR7c3RhcnRSZWN0LmxlZnQgKyBzdGFydFJlY3Qud2lkdGggLyAyfXB4O1xyXG4gICAgICAgICAgdG9wOiAke3N0YXJ0UmVjdC50b3AgKyBzdGFydFJlY3QuaGVpZ2h0IC8gMn1weDtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMjRweDtcclxuICAgICAgICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xyXG4gICAgICAgICAgei1pbmRleDogOTk5OTtcclxuICAgICAgICAgIGZpbHRlcjogZHJvcC1zaGFkb3coMCAwIDhweCByZ2JhKDEyMyw0NCwyNDUsMC44KSk7XHJcbiAgICAgICAgYDtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHBhcnRpY2xlKTtcclxuXHJcbiAgICAgICAgY29uc3QgZHggPSBlbmRSZWN0LmxlZnQgKyBlbmRSZWN0LndpZHRoIC8gMiAtIHN0YXJ0UmVjdC5sZWZ0IC0gc3RhcnRSZWN0LndpZHRoIC8gMjtcclxuICAgICAgICBjb25zdCBkeSA9IGVuZFJlY3QudG9wICsgZW5kUmVjdC5oZWlnaHQgLyAyIC0gc3RhcnRSZWN0LnRvcCAtIHN0YXJ0UmVjdC5oZWlnaHQgLyAyO1xyXG4gICAgICAgIGNvbnN0IHJhbmRvbU9mZnNldCA9IChNYXRoLnJhbmRvbSgpIC0gMC41KSAqIDEwMDtcclxuXHJcbiAgICAgICAgcGFydGljbGUuYW5pbWF0ZShbXHJcbiAgICAgICAgICB7IFxyXG4gICAgICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGUoMCwgMCkgc2NhbGUoMSknLCBcclxuICAgICAgICAgICAgb3BhY2l0eTogMSBcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7IFxyXG4gICAgICAgICAgICB0cmFuc2Zvcm06IGB0cmFuc2xhdGUoJHtkeC8yICsgcmFuZG9tT2Zmc2V0fXB4LCAke2R5IC0gMTUwfXB4KSBzY2FsZSgxLjIpYCwgXHJcbiAgICAgICAgICAgIG9wYWNpdHk6IDEsXHJcbiAgICAgICAgICAgIG9mZnNldDogMC41XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgeyBcclxuICAgICAgICAgICAgdHJhbnNmb3JtOiBgdHJhbnNsYXRlKCR7ZHh9cHgsICR7ZHl9cHgpIHNjYWxlKDAuNSlgLCBcclxuICAgICAgICAgICAgb3BhY2l0eTogMCBcclxuICAgICAgICAgIH1cclxuICAgICAgICBdLCB7XHJcbiAgICAgICAgICBkdXJhdGlvbjogMTAwMCArIGkgKiA1MCxcclxuICAgICAgICAgIGVhc2luZzogJ2N1YmljLWJlemllcigwLjI1LCAwLjQ2LCAwLjQ1LCAwLjk0KSdcclxuICAgICAgICB9KS5vbmZpbmlzaCA9ICgpID0+IHtcclxuICAgICAgICAgIHBhcnRpY2xlLnJlbW92ZSgpO1xyXG4gICAgICAgICAgLy8gXHU2NzAwXHU1NDBFXHU0RTAwXHU0RTJBXHU3QzkyXHU1QjUwXHU1MjMwXHU4RkJFXHU2NUY2XHVGRjBDXHU2REZCXHU1MkEwXHU4MTA5XHU1MUIyXHU2NTQ4XHU2NzlDXHJcbiAgICAgICAgICBpZiAoaSA9PT0gcGFydGljbGVDb3VudCAtIDEpIHtcclxuICAgICAgICAgICAgb3JlRWwuY2xhc3NMaXN0LmFkZCgnZmxhc2gnKTtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBvcmVFbC5jbGFzc0xpc3QucmVtb3ZlKCdmbGFzaCcpLCA5MDApO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgIH0sIGkgKiA4MCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFzeW5jIGhhbmRsZVJlcGFpcigpIHtcclxuICAgIGlmICh0aGlzLnBlbmRpbmcgfHwgIXRoaXMuaXNDb2xsYXBzZWQpIHJldHVybjtcclxuICAgIHRoaXMucGVuZGluZyA9ICdyZXBhaXInO1xyXG4gICAgdGhpcy51cGRhdGVDb250cm9scygpO1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3Qgc3RhdHVzID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PE1pbmVTdGF0dXM+KCcvbWluZS9yZXBhaXInLCB7IG1ldGhvZDogJ1BPU1QnIH0pO1xyXG4gICAgICB0aGlzLmFwcGx5U3RhdHVzKHN0YXR1cyk7XHJcbiAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZSgnXHU3N0ZGXHU5MDUzXHU1REYyXHU0RkVFXHU1OTBEXHVGRjBDXHU1M0VGXHU5MUNEXHU2NUIwXHU1NDJGXHU1MkE4Jyk7XHJcbiAgICAgIHNob3dUb2FzdCgnXHU3N0ZGXHU5MDUzXHU1REYyXHU0RkVFXHU1OTBEJywgJ3N1Y2Nlc3MnKTtcclxuICAgIH0gY2F0Y2ggKGU6IGFueSkge1xyXG4gICAgICBzaG93VG9hc3QoZT8ubWVzc2FnZSB8fCAnXHU0RkVFXHU3NDA2XHU1OTMxXHU4RDI1JywgJ2Vycm9yJyk7XHJcbiAgICB9IGZpbmFsbHkge1xyXG4gICAgICB0aGlzLnBlbmRpbmcgPSBudWxsO1xyXG4gICAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFzeW5jIHJlZnJlc2hTdGF0dXMoKSB7XHJcbiAgICBpZiAodGhpcy5wZW5kaW5nID09PSAnc3RhdHVzJykgcmV0dXJuO1xyXG4gICAgdGhpcy5wZW5kaW5nID0gJ3N0YXR1cyc7XHJcbiAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzKCk7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBzdGF0dXMgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8TWluZVN0YXR1cz4oJy9taW5lL3N0YXR1cycpO1xyXG4gICAgICB0aGlzLmFwcGx5U3RhdHVzKHN0YXR1cyk7XHJcbiAgICB9IGNhdGNoIChlOiBhbnkpIHtcclxuICAgICAgc2hvd1RvYXN0KGU/Lm1lc3NhZ2UgfHwgJ1x1ODNCN1x1NTNENlx1NzJCNlx1NjAwMVx1NTkzMVx1OEQyNScsICdlcnJvcicpO1xyXG4gICAgfSBmaW5hbGx5IHtcclxuICAgICAgdGhpcy5wZW5kaW5nID0gbnVsbDtcclxuICAgICAgdGhpcy51cGRhdGVDb250cm9scygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhcHBseVN0YXR1cyhzdGF0dXM6IE1pbmVTdGF0dXMgfCB1bmRlZmluZWQsIG9wdHM6IHsgcXVpZXQ/OiBib29sZWFuIH0gPSB7fSkge1xyXG4gICAgaWYgKCFzdGF0dXMpIHJldHVybjtcclxuICAgIHRoaXMuY2FydEFtdCA9IHN0YXR1cy5jYXJ0QW1vdW50ID8/IHRoaXMuY2FydEFtdDtcclxuICAgIHRoaXMuY2FydENhcCA9IHN0YXR1cy5jYXJ0Q2FwYWNpdHkgPz8gdGhpcy5jYXJ0Q2FwO1xyXG4gICAgdGhpcy5pbnRlcnZhbE1zID0gc3RhdHVzLmludGVydmFsTXMgPz8gdGhpcy5pbnRlcnZhbE1zO1xyXG4gICAgdGhpcy5pc01pbmluZyA9IEJvb2xlYW4oc3RhdHVzLnJ1bm5pbmcpO1xyXG4gICAgdGhpcy5pc0NvbGxhcHNlZCA9IEJvb2xlYW4oc3RhdHVzLmNvbGxhcHNlZCk7XHJcbiAgICBpZiAoc3RhdHVzLmNvbGxhcHNlZCAmJiBzdGF0dXMuY29sbGFwc2VkUmVtYWluaW5nID4gMCkge1xyXG4gICAgICB0aGlzLmJlZ2luQ29sbGFwc2VDb3VudGRvd24oc3RhdHVzLmNvbGxhcHNlZFJlbWFpbmluZyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmNsZWFyQ29sbGFwc2VUaW1lcigpO1xyXG4gICAgICB0aGlzLmNvbGxhcHNlUmVtYWluaW5nID0gMDtcclxuICAgIH1cclxuICAgIHRoaXMudXBkYXRlUHJvZ3Jlc3MoKTtcclxuICAgIGlmICghb3B0cy5xdWlldCkge1xyXG4gICAgICBpZiAodGhpcy5pc0NvbGxhcHNlZCAmJiB0aGlzLmNvbGxhcHNlUmVtYWluaW5nID4gMCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZShgXHU3N0ZGXHU5MDUzXHU1NzREXHU1ODRDXHVGRjBDXHU1MjY5XHU0RjU5ICR7dGhpcy5jb2xsYXBzZVJlbWFpbmluZ31zYCk7XHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pc01pbmluZykge1xyXG4gICAgICAgIGNvbnN0IHNlY29uZHMgPSBNYXRoLm1heCgxLCBNYXRoLnJvdW5kKHRoaXMuaW50ZXJ2YWxNcyAvIDEwMDApKTtcclxuICAgICAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoYFx1NzdGRlx1NjczQVx1OEZEMFx1ODg0Q1x1NEUyRFx1RkYwQ1x1NTQ2OFx1NjcxRlx1N0VBNiAke3NlY29uZHN9c1x1RkYwQ1x1NUY1M1x1NTI0RCAke3RoaXMuZm9ybWF0UGVyY2VudCgpfWApO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZSgnXHU3N0ZGXHU2NzNBXHU1REYyXHU1MDVDXHU2QjYyXHVGRjBDXHU3MEI5XHU1MUZCXHU1RjAwXHU1OUNCXHU2MzE2XHU3N0ZGJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICh0aGlzLmVscy5jeWNsZSkge1xyXG4gICAgICBjb25zdCBzZWNvbmRzID0gTWF0aC5tYXgoMSwgTWF0aC5yb3VuZCh0aGlzLmludGVydmFsTXMgLyAxMDAwKSk7XHJcbiAgICAgIHRoaXMuZWxzLmN5Y2xlLnRleHRDb250ZW50ID0gYCR7c2Vjb25kc31zYDtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLmVscy5zdGF0dXNUYWcpIHtcclxuICAgICAgY29uc3QgZWwgPSB0aGlzLmVscy5zdGF0dXNUYWcgYXMgSFRNTEVsZW1lbnQ7XHJcbiAgICAgIGVsLmlubmVySFRNTCA9ICcnO1xyXG4gICAgICBcclxuICAgICAgLy8gXHU3OUZCXHU5NjY0XHU2MjQwXHU2NzA5XHU3MkI2XHU2MDAxXHU3QzdCXHJcbiAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ3BpbGwtcnVubmluZycsICdwaWxsLWNvbGxhcHNlZCcpO1xyXG4gICAgICBcclxuICAgICAgY29uc3QgaWNvID0gdGhpcy5pc0NvbGxhcHNlZCA/ICdjbG9zZScgOiAodGhpcy5pc01pbmluZyA/ICdib2x0JyA6ICdjbG9jaycpO1xyXG4gICAgICB0cnkgeyBlbC5hcHBlbmRDaGlsZChyZW5kZXJJY29uKGljbyBhcyBhbnksIHsgc2l6ZTogMTYgfSkpOyB9IGNhdGNoIHt9XHJcbiAgICAgIGVsLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRoaXMuaXNDb2xsYXBzZWQgPyAnXHU1NzREXHU1ODRDJyA6ICh0aGlzLmlzTWluaW5nID8gJ1x1OEZEMFx1ODg0Q1x1NEUyRCcgOiAnXHU1Rjg1XHU2NzNBJykpKTtcclxuICAgICAgXHJcbiAgICAgIC8vIFx1NkRGQlx1NTJBMFx1NUJGOVx1NUU5NFx1NzY4NFx1NTJBOFx1NjAwMVx1NjgzN1x1NUYwRlx1N0M3QlxyXG4gICAgICBpZiAodGhpcy5pc0NvbGxhcHNlZCkge1xyXG4gICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoJ3BpbGwtY29sbGFwc2VkJyk7XHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pc01pbmluZykge1xyXG4gICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoJ3BpbGwtcnVubmluZycpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGJlZ2luQ29sbGFwc2VDb3VudGRvd24oc2Vjb25kczogbnVtYmVyKSB7XHJcbiAgICB0aGlzLmNsZWFyQ29sbGFwc2VUaW1lcigpO1xyXG4gICAgdGhpcy5pc0NvbGxhcHNlZCA9IHRydWU7XHJcbiAgICB0aGlzLmNvbGxhcHNlUmVtYWluaW5nID0gTWF0aC5tYXgoMCwgTWF0aC5mbG9vcihzZWNvbmRzKSk7XHJcbiAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoYFx1NzdGRlx1OTA1M1x1NTc0RFx1NTg0Q1x1RkYwQ1x1NTI2OVx1NEY1OSAke3RoaXMuY29sbGFwc2VSZW1haW5pbmd9c2ApO1xyXG4gICAgdGhpcy51cGRhdGVDb250cm9scygpO1xyXG4gICAgdGhpcy5jb2xsYXBzZVRpbWVyID0gd2luZG93LnNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgdGhpcy5jb2xsYXBzZVJlbWFpbmluZyA9IE1hdGgubWF4KDAsIHRoaXMuY29sbGFwc2VSZW1haW5pbmcgLSAxKTtcclxuICAgICAgaWYgKHRoaXMuY29sbGFwc2VSZW1haW5pbmcgPD0gMCkge1xyXG4gICAgICAgIHRoaXMuY2xlYXJDb2xsYXBzZVRpbWVyKCk7XHJcbiAgICAgICAgdGhpcy5pc0NvbGxhcHNlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZSgnXHU1NzREXHU1ODRDXHU4OUUzXHU5NjY0XHVGRjBDXHU1M0VGXHU5MUNEXHU2NUIwXHU1NDJGXHU1MkE4XHU3N0ZGXHU2NzNBJyk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVDb250cm9scygpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZShgXHU3N0ZGXHU5MDUzXHU1NzREXHU1ODRDXHVGRjBDXHU1MjY5XHU0RjU5ICR7dGhpcy5jb2xsYXBzZVJlbWFpbmluZ31zYCk7XHJcbiAgICAgIH1cclxuICAgIH0sIDEwMDApO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjbGVhckNvbGxhcHNlVGltZXIoKSB7XHJcbiAgICBpZiAodGhpcy5jb2xsYXBzZVRpbWVyICE9PSBudWxsKSB7XHJcbiAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKHRoaXMuY29sbGFwc2VUaW1lcik7XHJcbiAgICAgIHRoaXMuY29sbGFwc2VUaW1lciA9IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGxhc3RNaWxlc3RvbmUgPSAwO1xyXG5cclxuICBwcml2YXRlIHVwZGF0ZVByb2dyZXNzKCkge1xyXG4gICAgaWYgKCF0aGlzLmVscy5maWxsIHx8ICF0aGlzLmVscy5wZXJjZW50KSByZXR1cm47XHJcbiAgICBjb25zdCBwY3QgPSB0aGlzLmNhcnRDYXAgPiAwID8gTWF0aC5taW4oMSwgdGhpcy5jYXJ0QW10IC8gdGhpcy5jYXJ0Q2FwKSA6IDA7XHJcbiAgICBjb25zdCBwY3RJbnQgPSBNYXRoLnJvdW5kKHBjdCAqIDEwMCk7XHJcbiAgICBcclxuICAgIHRoaXMuZWxzLmZpbGwuc3R5bGUud2lkdGggPSBgJHtwY3RJbnR9JWA7XHJcbiAgICB0aGlzLmVscy5wZXJjZW50LnRleHRDb250ZW50ID0gYCR7cGN0SW50fSVgO1xyXG4gICAgXHJcbiAgICAvLyBcdTU3MDZcdTczQUZcdTk4OUNcdTgyNzJcdTZFMTBcdTUzRDhcdUZGMUFcdTdEMkJcdTgyNzIgLT4gXHU4NEREXHU4MjcyIC0+IFx1OTFEMVx1ODI3MlxyXG4gICAgbGV0IHJpbmdDb2xvciA9ICcjN0IyQ0Y1JzsgLy8gXHU3RDJCXHU4MjcyXHJcbiAgICBpZiAocGN0ID49IDAuNzUpIHtcclxuICAgICAgcmluZ0NvbG9yID0gJyNmNmM0NDUnOyAvLyBcdTkxRDFcdTgyNzJcclxuICAgIH0gZWxzZSBpZiAocGN0ID49IDAuNSkge1xyXG4gICAgICByaW5nQ29sb3IgPSAnIzJDODlGNSc7IC8vIFx1ODRERFx1ODI3MlxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpZiAodGhpcy5lbHMucmluZykge1xyXG4gICAgICBjb25zdCBkZWcgPSBNYXRoLnJvdW5kKHBjdCAqIDM2MCk7XHJcbiAgICAgICh0aGlzLmVscy5yaW5nIGFzIEhUTUxFbGVtZW50KS5zdHlsZS5iYWNrZ3JvdW5kID0gYGNvbmljLWdyYWRpZW50KCR7cmluZ0NvbG9yfSAke2RlZ31kZWcsIHJnYmEoMjU1LDI1NSwyNTUsLjA4KSAwZGVnKWA7XHJcbiAgICAgIFxyXG4gICAgICAvLyBcdTZFRTFcdThGN0RcdTY1RjZcdTYzMDFcdTdFRURcdTk1RUFcdTgwMDBcclxuICAgICAgaWYgKHBjdCA+PSAxKSB7XHJcbiAgICAgICAgdGhpcy5lbHMucmluZy5jbGFzc0xpc3QuYWRkKCdyaW5nLWZ1bGwnKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmVscy5yaW5nLmNsYXNzTGlzdC5yZW1vdmUoJ3JpbmctZnVsbCcpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGlmICh0aGlzLmVscy5yaW5nUGN0KSB0aGlzLmVscy5yaW5nUGN0LnRleHRDb250ZW50ID0gYCR7cGN0SW50fSVgO1xyXG4gICAgXHJcbiAgICAvLyBcdTkxQ0NcdTdBMEJcdTc4OTFcdTgxMDlcdTUxQjJcdTcyNzlcdTY1NDhcclxuICAgIGNvbnN0IG1pbGVzdG9uZXMgPSBbMjUsIDUwLCA3NSwgMTAwXTtcclxuICAgIGZvciAoY29uc3QgbWlsZXN0b25lIG9mIG1pbGVzdG9uZXMpIHtcclxuICAgICAgaWYgKHBjdEludCA+PSBtaWxlc3RvbmUgJiYgdGhpcy5sYXN0TWlsZXN0b25lIDwgbWlsZXN0b25lKSB7XHJcbiAgICAgICAgdGhpcy50cmlnZ2VyTWlsZXN0b25lUHVsc2UobWlsZXN0b25lKTtcclxuICAgICAgICB0aGlzLmxhc3RNaWxlc3RvbmUgPSBtaWxlc3RvbmU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gXHU1RjUzXHU4OEM1XHU4RjdEXHU3Mzg3XHU0RTBCXHU5NjREXHVGRjA4XHU2NTM2XHU3N0ZGXHU1NDBFXHVGRjA5XHU5MUNEXHU3RjZFXHU5MUNDXHU3QTBCXHU3ODkxXHJcbiAgICBpZiAocGN0SW50IDwgdGhpcy5sYXN0TWlsZXN0b25lIC0gMTApIHtcclxuICAgICAgdGhpcy5sYXN0TWlsZXN0b25lID0gTWF0aC5mbG9vcihwY3RJbnQgLyAyNSkgKiAyNTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gOTAlXHU4QjY2XHU1NDRBXHU2M0QwXHU3OTNBXHJcbiAgICBpZiAocGN0SW50ID49IDkwICYmIHBjdEludCA8IDEwMCkge1xyXG4gICAgICBpZiAoIXRoaXMuZWxzLnN0YXR1c1RleHQ/LnRleHRDb250ZW50Py5pbmNsdWRlcygnXHU1MzczXHU1QzA2XHU2RUUxXHU4RjdEJykpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoJ1x1MjZBMFx1RkUwRiBcdTc3RkZcdThGNjZcdTUzNzNcdTVDMDZcdTZFRTFcdThGN0RcdUZGMENcdTVFRkFcdThCQUVcdTY1MzZcdTc3RkYnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpZiAodGhpcy5wZW5kaW5nICE9PSAnY29sbGVjdCcgJiYgdGhpcy5lbHMuY29sbGVjdCkge1xyXG4gICAgICB0aGlzLmVscy5jb2xsZWN0LmRpc2FibGVkID0gdGhpcy5wZW5kaW5nID09PSAnY29sbGVjdCcgfHwgdGhpcy5jYXJ0QW10IDw9IDA7XHJcbiAgICAgIFxyXG4gICAgICAvLyBcdTUzRUZcdTY1MzZcdTc3RkZcdTY1RjZcdTZERkJcdTUyQTBcdTgwRkRcdTkxQ0ZcdTcyNzlcdTY1NDhcclxuICAgICAgaWYgKHRoaXMuY2FydEFtdCA+IDAgJiYgIXRoaXMuZWxzLmNvbGxlY3QuZGlzYWJsZWQpIHtcclxuICAgICAgICB0aGlzLmVscy5jb2xsZWN0LmNsYXNzTGlzdC5hZGQoJ2J0bi1lbmVyZ3knKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmVscy5jb2xsZWN0LmNsYXNzTGlzdC5yZW1vdmUoJ2J0bi1lbmVyZ3knKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBcdTY2RjRcdTY1QjBcdTc3RkZcdTc3RjNcdTY1NzBcdTkxQ0ZcclxuICAgIHRoaXMudXBkYXRlU2hhcmRzKHBjdCk7XHJcbiAgICBcclxuICAgIC8vIFx1NjZGNFx1NjVCMFx1NTE2OFx1NjA2Rlx1ODBDQ1x1NjY2Rlx1NzJCNlx1NjAwMVxyXG4gICAgdGhpcy51cGRhdGVIb2xvZ3JhbVN0YXRlKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHRyaWdnZXJNaWxlc3RvbmVQdWxzZShtaWxlc3RvbmU6IG51bWJlcikge1xyXG4gICAgaWYgKHRoaXMuZWxzLnJpbmcpIHtcclxuICAgICAgdGhpcy5lbHMucmluZy5jbGFzc0xpc3QuYWRkKCdtaWxlc3RvbmUtcHVsc2UnKTtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmVscy5yaW5nPy5jbGFzc0xpc3QucmVtb3ZlKCdtaWxlc3RvbmUtcHVsc2UnKSwgMTAwMCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGlmICh0aGlzLmVscy5yaW5nUGN0KSB7XHJcbiAgICAgIHRoaXMuZWxzLnJpbmdQY3QuY2xhc3NMaXN0LmFkZCgnZmxhc2gnKTtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmVscy5yaW5nUGN0Py5jbGFzc0xpc3QucmVtb3ZlKCdmbGFzaCcpLCA5MDApO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBcdTY2M0VcdTc5M0FcdTkxQ0NcdTdBMEJcdTc4OTFcdTZEODhcdTYwNkZcclxuICAgIHNob3dUb2FzdChgXHVEODNDXHVERkFGIFx1OEZCRVx1NjIxMCAke21pbGVzdG9uZX0lIFx1ODhDNVx1OEY3RFx1NzM4N1x1RkYwMWAsICdzdWNjZXNzJyk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHVwZGF0ZUhvbG9ncmFtU3RhdGUoKSB7XHJcbiAgICBpZiAoIXRoaXMuZWxzLmhvbG9ncmFtKSByZXR1cm47XHJcbiAgICBcclxuICAgIC8vIFx1NzlGQlx1OTY2NFx1NjI0MFx1NjcwOVx1NzJCNlx1NjAwMVx1N0M3QlxyXG4gICAgdGhpcy5lbHMuaG9sb2dyYW0uY2xhc3NMaXN0LnJlbW92ZSgnaG9sby1pZGxlJywgJ2hvbG8tbWluaW5nJywgJ2hvbG8tY29sbGFwc2VkJyk7XHJcbiAgICBcclxuICAgIC8vIFx1NjgzOVx1NjM2RVx1NzJCNlx1NjAwMVx1NkRGQlx1NTJBMFx1NUJGOVx1NUU5NFx1NzY4NFx1N0M3QlxyXG4gICAgaWYgKHRoaXMuaXNDb2xsYXBzZWQpIHtcclxuICAgICAgdGhpcy5lbHMuaG9sb2dyYW0uY2xhc3NMaXN0LmFkZCgnaG9sby1jb2xsYXBzZWQnKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5pc01pbmluZykge1xyXG4gICAgICB0aGlzLmVscy5ob2xvZ3JhbS5jbGFzc0xpc3QuYWRkKCdob2xvLW1pbmluZycpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5lbHMuaG9sb2dyYW0uY2xhc3NMaXN0LmFkZCgnaG9sby1pZGxlJyk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIFx1NjZGNFx1NjVCMFx1NzdGRlx1NURFNVx1NTJBOFx1NzUzQlxyXG4gICAgdGhpcy51cGRhdGVNaW5lckFuaW1hdGlvbigpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB1cGRhdGVNaW5lckFuaW1hdGlvbigpIHtcclxuICAgIGlmICghdGhpcy5lbHMubWluZXJDaGFyKSByZXR1cm47XHJcbiAgICBcclxuICAgIHRoaXMuZWxzLm1pbmVyQ2hhci5pbm5lckhUTUwgPSAnJztcclxuICAgIFxyXG4gICAgaWYgKHRoaXMuaXNDb2xsYXBzZWQpIHtcclxuICAgICAgLy8gXHU1NzREXHU1ODRDXHU3MkI2XHU2MDAxXHVGRjFBXHU2NjNFXHU3OTNBXHU4QjY2XHU1NDRBXHU1NkZFXHU2ODA3XHJcbiAgICAgIGNvbnN0IHdhcm5pbmcgPSBodG1sKGBcclxuICAgICAgICA8ZGl2IHN0eWxlPVwidGV4dC1hbGlnbjpjZW50ZXI7b3BhY2l0eTouNjtcIj5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9XCJmb250LXNpemU6NDhweDthbmltYXRpb246d2FybmluZy1wdWxzZSAxcyBlYXNlLWluLW91dCBpbmZpbml0ZTtcIj5cdTI2QTBcdUZFMEY8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9XCJmb250LXNpemU6MTNweDttYXJnaW4tdG9wOjhweDtcIj5cdTc3RkZcdTkwNTNcdTU3NERcdTU4NEM8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgYCk7XHJcbiAgICAgIHRoaXMuZWxzLm1pbmVyQ2hhci5hcHBlbmRDaGlsZCh3YXJuaW5nKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5pc01pbmluZykge1xyXG4gICAgICAvLyBcdTYzMTZcdTc3RkZcdTRFMkRcdUZGMUFcdTY2M0VcdTc5M0FcdTUyQThcdTc1M0JcclxuICAgICAgdGhpcy5lbHMubWluZXJDaGFyLmFwcGVuZENoaWxkKGNyZWF0ZU1pbmVyQW5pbWF0aW9uKCkpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gXHU1Rjg1XHU2NzNBXHVGRjFBXHU2NjNFXHU3OTNBXHU5NzU5XHU2MDAxXHU3N0ZGXHU1REU1XHJcbiAgICAgIHRoaXMuZWxzLm1pbmVyQ2hhci5hcHBlbmRDaGlsZChjcmVhdGVJZGxlTWluZXIoKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHVwZGF0ZVNoYXJkcyhsb2FkUGVyY2VudDogbnVtYmVyKSB7XHJcbiAgICBpZiAoIXRoaXMuZWxzLmhvbG9ncmFtKSByZXR1cm47XHJcbiAgICBcclxuICAgIC8vIFx1OEJBMVx1N0I5N1x1NUU5NFx1OEJFNVx1NjYzRVx1NzkzQVx1NzY4NFx1NzdGRlx1NzdGM1x1NjU3MFx1OTFDRlx1RkYwOFx1ODhDNVx1OEY3RFx1NzM4N1x1OEQ4QVx1OUFEOFx1RkYwQ1x1NzdGRlx1NzdGM1x1OEQ4QVx1NTkxQVx1RkYwOVxyXG4gICAgLy8gMC0yMCU6IDJcdTRFMkEsIDIwLTQwJTogNFx1NEUyQSwgNDAtNjAlOiA2XHU0RTJBLCA2MC04MCU6IDhcdTRFMkEsIDgwLTEwMCU6IDEwXHU0RTJBXHJcbiAgICBjb25zdCB0YXJnZXRDb3VudCA9IE1hdGgubWF4KDIsIE1hdGgubWluKDEyLCBNYXRoLmZsb29yKGxvYWRQZXJjZW50ICogMTIpICsgMikpO1xyXG4gICAgXHJcbiAgICAvLyBcdTgzQjdcdTUzRDZcdTVGNTNcdTUyNERcdTc3RkZcdTc3RjNcdTUxNDNcdTdEMjBcclxuICAgIGNvbnN0IGN1cnJlbnRTaGFyZHMgPSB0aGlzLmVscy5ob2xvZ3JhbS5xdWVyeVNlbGVjdG9yQWxsKCcubWluZS1zaGFyZCcpO1xyXG4gICAgY29uc3QgY3VycmVudENvdW50ID0gY3VycmVudFNoYXJkcy5sZW5ndGg7XHJcbiAgICBcclxuICAgIC8vIFx1NTk4Mlx1Njc5Q1x1NjU3MFx1OTFDRlx1NzZGOFx1NTQwQ1x1RkYwQ1x1NEUwRFx1NTA1QVx1NTkwNFx1NzQwNlxyXG4gICAgaWYgKGN1cnJlbnRDb3VudCA9PT0gdGFyZ2V0Q291bnQpIHJldHVybjtcclxuICAgIFxyXG4gICAgLy8gXHU5NzAwXHU4OTgxXHU2REZCXHU1MkEwXHU3N0ZGXHU3N0YzXHJcbiAgICBpZiAoY3VycmVudENvdW50IDwgdGFyZ2V0Q291bnQpIHtcclxuICAgICAgY29uc3QgdG9BZGQgPSB0YXJnZXRDb3VudCAtIGN1cnJlbnRDb3VudDtcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b0FkZDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3Qgc2hhcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgc2hhcmQuY2xhc3NOYW1lID0gJ21pbmUtc2hhcmQnO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFx1OTY4Rlx1NjczQVx1NEY0RFx1N0Y2RVx1NTQ4Q1x1NTkyN1x1NUMwRlxyXG4gICAgICAgIGNvbnN0IHBvc2l0aW9ucyA9IFtcclxuICAgICAgICAgIHsgdG9wOiAnMTglJywgbGVmdDogJzE2JScsIGRlbGF5OiAtMS40LCBzY2FsZTogMSB9LFxyXG4gICAgICAgICAgeyBib3R0b206ICcxNiUnLCByaWdodDogJzIyJScsIGRlbGF5OiAtMy4yLCBzY2FsZTogMC43NCB9LFxyXG4gICAgICAgICAgeyB0b3A6ICcyNiUnLCByaWdodDogJzM0JScsIGRlbGF5OiAtNS4xLCBzY2FsZTogMC41IH0sXHJcbiAgICAgICAgICB7IHRvcDogJzQwJScsIGxlZnQ6ICcyOCUnLCBkZWxheTogLTIuNSwgc2NhbGU6IDAuODUgfSxcclxuICAgICAgICAgIHsgYm90dG9tOiAnMzAlJywgbGVmdDogJzE4JScsIGRlbGF5OiAtNC4xLCBzY2FsZTogMC42OCB9LFxyXG4gICAgICAgICAgeyB0b3A6ICcxNSUnLCByaWdodDogJzE1JScsIGRlbGF5OiAtMS44LCBzY2FsZTogMC45MiB9LFxyXG4gICAgICAgICAgeyBib3R0b206ICcyMiUnLCByaWdodDogJzQwJScsIGRlbGF5OiAtMy44LCBzY2FsZTogMC43OCB9LFxyXG4gICAgICAgICAgeyB0b3A6ICc1MCUnLCBsZWZ0OiAnMTIlJywgZGVsYXk6IC0yLjIsIHNjYWxlOiAwLjYgfSxcclxuICAgICAgICAgIHsgdG9wOiAnMzUlJywgcmlnaHQ6ICcyMCUnLCBkZWxheTogLTQuNSwgc2NhbGU6IDAuODggfSxcclxuICAgICAgICAgIHsgYm90dG9tOiAnNDAlJywgbGVmdDogJzM1JScsIGRlbGF5OiAtMy41LCBzY2FsZTogMC43IH0sXHJcbiAgICAgICAgICB7IHRvcDogJzYwJScsIHJpZ2h0OiAnMjglJywgZGVsYXk6IC0yLjgsIHNjYWxlOiAwLjY1IH0sXHJcbiAgICAgICAgICB7IGJvdHRvbTogJzUwJScsIHJpZ2h0OiAnMTIlJywgZGVsYXk6IC00LjgsIHNjYWxlOiAwLjgyIH0sXHJcbiAgICAgICAgXTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBwb3NJbmRleCA9IChjdXJyZW50Q291bnQgKyBpKSAlIHBvc2l0aW9ucy5sZW5ndGg7XHJcbiAgICAgICAgY29uc3QgcG9zID0gcG9zaXRpb25zW3Bvc0luZGV4XTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAocG9zLnRvcCkgc2hhcmQuc3R5bGUudG9wID0gcG9zLnRvcDtcclxuICAgICAgICBpZiAocG9zLmJvdHRvbSkgc2hhcmQuc3R5bGUuYm90dG9tID0gcG9zLmJvdHRvbTtcclxuICAgICAgICBpZiAocG9zLmxlZnQpIHNoYXJkLnN0eWxlLmxlZnQgPSBwb3MubGVmdDtcclxuICAgICAgICBpZiAocG9zLnJpZ2h0KSBzaGFyZC5zdHlsZS5yaWdodCA9IHBvcy5yaWdodDtcclxuICAgICAgICBzaGFyZC5zdHlsZS5hbmltYXRpb25EZWxheSA9IGAke3Bvcy5kZWxheX1zYDtcclxuICAgICAgICBzaGFyZC5zdHlsZS50cmFuc2Zvcm0gPSBgc2NhbGUoJHtwb3Muc2NhbGV9KWA7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gXHU2REZCXHU1MkEwXHU2REUxXHU1MTY1XHU1MkE4XHU3NTNCXHJcbiAgICAgICAgc2hhcmQuc3R5bGUub3BhY2l0eSA9ICcwJztcclxuICAgICAgICB0aGlzLmVscy5ob2xvZ3JhbS5hcHBlbmRDaGlsZChzaGFyZCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gXHU4OUU2XHU1M0QxXHU2REUxXHU1MTY1XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICBzaGFyZC5zdHlsZS50cmFuc2l0aW9uID0gJ29wYWNpdHkgMC41cyBlYXNlJztcclxuICAgICAgICAgIHNoYXJkLnN0eWxlLm9wYWNpdHkgPSAnMC4yNic7XHJcbiAgICAgICAgfSwgNTApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBcdTk3MDBcdTg5ODFcdTc5RkJcdTk2NjRcdTc3RkZcdTc3RjNcclxuICAgIGVsc2UgaWYgKGN1cnJlbnRDb3VudCA+IHRhcmdldENvdW50KSB7XHJcbiAgICAgIGNvbnN0IHRvUmVtb3ZlID0gY3VycmVudENvdW50IC0gdGFyZ2V0Q291bnQ7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG9SZW1vdmU7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IGxhc3RTaGFyZCA9IGN1cnJlbnRTaGFyZHNbY3VycmVudFNoYXJkcy5sZW5ndGggLSAxIC0gaV07XHJcbiAgICAgICAgaWYgKGxhc3RTaGFyZCkge1xyXG4gICAgICAgICAgKGxhc3RTaGFyZCBhcyBIVE1MRWxlbWVudCkuc3R5bGUudHJhbnNpdGlvbiA9ICdvcGFjaXR5IDAuNXMgZWFzZSc7XHJcbiAgICAgICAgICAobGFzdFNoYXJkIGFzIEhUTUxFbGVtZW50KS5zdHlsZS5vcGFjaXR5ID0gJzAnO1xyXG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGxhc3RTaGFyZC5yZW1vdmUoKTtcclxuICAgICAgICAgIH0sIDUwMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHVwZGF0ZUNvbnRyb2xzKCkge1xyXG4gICAgY29uc3QgaXNCdXN5ID0gKGtleTogUGVuZGluZ0FjdGlvbikgPT4gdGhpcy5wZW5kaW5nID09PSBrZXk7XHJcbiAgICBjb25zdCBzZXRCdG4gPSAoYnRuOiBIVE1MQnV0dG9uRWxlbWVudCB8IG51bGwsIGljb246IGFueSwgbGFiZWw6IHN0cmluZywgZGlzYWJsZWQ6IGJvb2xlYW4pID0+IHtcclxuICAgICAgaWYgKCFidG4pIHJldHVybjtcclxuICAgICAgYnRuLmRpc2FibGVkID0gZGlzYWJsZWQ7XHJcbiAgICAgIC8vIGtlZXAgZmlyc3QgY2hpbGQgYXMgaWNvbiBpZiBwcmVzZW50LCBvdGhlcndpc2UgY3JlYXRlXHJcbiAgICAgIGxldCBpY29uSG9zdCA9IGJ0bi5xdWVyeVNlbGVjdG9yKCcuaWNvbicpO1xyXG4gICAgICBpZiAoIWljb25Ib3N0KSB7XHJcbiAgICAgICAgYnRuLmluc2VydEJlZm9yZShyZW5kZXJJY29uKGljb24sIHsgc2l6ZTogMTggfSksIGJ0bi5maXJzdENoaWxkKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBSZXBsYWNlIGV4aXN0aW5nIGljb24gd2l0aCBuZXcgb25lIGlmIGljb24gbmFtZSBkaWZmZXJzIGJ5IHJlLXJlbmRlcmluZ1xyXG4gICAgICAgIGNvbnN0IGhvc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgaG9zdC5hcHBlbmRDaGlsZChyZW5kZXJJY29uKGljb24sIHsgc2l6ZTogMTggfSkpO1xyXG4gICAgICAgIC8vIHJlbW92ZSBvbGQgaWNvbiB3cmFwcGVyIGFuZCB1c2UgbmV3XHJcbiAgICAgICAgaWNvbkhvc3QucGFyZW50RWxlbWVudD8ucmVwbGFjZUNoaWxkKGhvc3QuZmlyc3RDaGlsZCBhcyBOb2RlLCBpY29uSG9zdCk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gc2V0IGxhYmVsIHRleHQgKHByZXNlcnZlIGljb24pXHJcbiAgICAgIC8vIHJlbW92ZSBleGlzdGluZyB0ZXh0IG5vZGVzXHJcbiAgICAgIEFycmF5LmZyb20oYnRuLmNoaWxkTm9kZXMpLmZvckVhY2goKG4sIGlkeCkgPT4ge1xyXG4gICAgICAgIGlmIChpZHggPiAwKSBidG4ucmVtb3ZlQ2hpbGQobik7XHJcbiAgICAgIH0pO1xyXG4gICAgICBidG4uYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobGFiZWwpKTtcclxuICAgIH07XHJcblxyXG4gICAgc2V0QnRuKHRoaXMuZWxzLnN0YXJ0LCAncGxheScsIGlzQnVzeSgnc3RhcnQnKSA/ICdcdTU0MkZcdTUyQThcdTRFMkRcdTIwMjYnIDogdGhpcy5pc01pbmluZyA/ICdcdTYzMTZcdTc3RkZcdTRFMkQnIDogJ1x1NUYwMFx1NTlDQlx1NjMxNlx1NzdGRicsIGlzQnVzeSgnc3RhcnQnKSB8fCB0aGlzLmlzTWluaW5nIHx8IHRoaXMuaXNDb2xsYXBzZWQpO1xyXG4gICAgc2V0QnRuKHRoaXMuZWxzLnN0b3AsICdzdG9wJywgaXNCdXN5KCdzdG9wJykgPyAnXHU1MDVDXHU2QjYyXHU0RTJEXHUyMDI2JyA6ICdcdTUwNUNcdTZCNjInLCBpc0J1c3koJ3N0b3AnKSB8fCAhdGhpcy5pc01pbmluZyk7XHJcbiAgICBzZXRCdG4odGhpcy5lbHMuY29sbGVjdCwgJ2NvbGxlY3QnLCBpc0J1c3koJ2NvbGxlY3QnKSA/ICdcdTY1MzZcdTk2QzZcdTRFMkRcdTIwMjYnIDogJ1x1NjUzNlx1NzdGRicsIGlzQnVzeSgnY29sbGVjdCcpIHx8IHRoaXMuY2FydEFtdCA8PSAwKTtcclxuICAgIHNldEJ0bih0aGlzLmVscy5yZXBhaXIsICd3cmVuY2gnLCBpc0J1c3koJ3JlcGFpcicpID8gJ1x1NEZFRVx1NzQwNlx1NEUyRFx1MjAyNicgOiAnXHU0RkVFXHU3NDA2JywgaXNCdXN5KCdyZXBhaXInKSB8fCAhdGhpcy5pc0NvbGxhcHNlZCk7XHJcbiAgICBzZXRCdG4odGhpcy5lbHMuc3RhdHVzQnRuLCAncmVmcmVzaCcsIGlzQnVzeSgnc3RhdHVzJykgPyAnXHU1MjM3XHU2NUIwXHU0RTJEXHUyMDI2JyA6ICdcdTUyMzdcdTY1QjBcdTcyQjZcdTYwMDEnLCBpc0J1c3koJ3N0YXR1cycpKTtcclxuICAgIFxyXG4gICAgLy8gXHU2NTM2XHU3N0ZGXHU2MzA5XHU5NEFFXHU2REZCXHU1MkEwXHU1QjlEXHU3QkIxXHU1MkE4XHU3NTNCXHJcbiAgICBpZiAodGhpcy5lbHMuY29sbGVjdCAmJiB0aGlzLmNhcnRBbXQgPiAwICYmICF0aGlzLmVscy5jb2xsZWN0LmRpc2FibGVkKSB7XHJcbiAgICAgIGNvbnN0IGhhc0NoZXN0ID0gdGhpcy5lbHMuY29sbGVjdC5xdWVyeVNlbGVjdG9yKCcudHJlYXN1cmUtY2hlc3QnKTtcclxuICAgICAgaWYgKCFoYXNDaGVzdCkge1xyXG4gICAgICAgIGNvbnN0IGNoZXN0ID0gY3JlYXRlVHJlYXN1cmVDaGVzdCgpO1xyXG4gICAgICAgIGNvbnN0IGljb25TbG90ID0gdGhpcy5lbHMuY29sbGVjdC5xdWVyeVNlbGVjdG9yKCcuaWNvbicpO1xyXG4gICAgICAgIGlmIChpY29uU2xvdCkge1xyXG4gICAgICAgICAgaWNvblNsb3QuaW5uZXJIVE1MID0gJyc7XHJcbiAgICAgICAgICBpY29uU2xvdC5hcHBlbmRDaGlsZChjaGVzdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNldFN0YXR1c01lc3NhZ2UodGV4dDogc3RyaW5nKSB7XHJcbiAgICBpZiAoIXRoaXMuZWxzLnN0YXR1c1RleHQpIHJldHVybjtcclxuICAgIHRoaXMuZWxzLnN0YXR1c1RleHQudGV4dENvbnRlbnQgPSB0ZXh0O1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBsb2dFdmVudChtc2c6IHN0cmluZykge1xyXG4gICAgaWYgKCF0aGlzLmVscz8uZXZlbnRzKSByZXR1cm47XHJcbiAgICBjb25zdCBsaW5lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xyXG4gICAgY29uc3QgaGggPSBTdHJpbmcobm93LmdldEhvdXJzKCkpLnBhZFN0YXJ0KDIsJzAnKTtcclxuICAgIGNvbnN0IG1tID0gU3RyaW5nKG5vdy5nZXRNaW51dGVzKCkpLnBhZFN0YXJ0KDIsJzAnKTtcclxuICAgIGNvbnN0IHNzID0gU3RyaW5nKG5vdy5nZXRTZWNvbmRzKCkpLnBhZFN0YXJ0KDIsJzAnKTtcclxuICAgIFxyXG4gICAgLy8gXHU2ODM5XHU2MzZFXHU2RDg4XHU2MDZGXHU3QzdCXHU1NzhCXHU2REZCXHU1MkEwXHU0RTBEXHU1NDBDXHU3Njg0XHU2ODM3XHU1RjBGXHU3QzdCXHJcbiAgICBsZXQgZXZlbnRDbGFzcyA9ICdldmVudCc7XHJcbiAgICBpZiAobXNnLmluY2x1ZGVzKCdcdTY2QjRcdTUxRkInKSkge1xyXG4gICAgICBldmVudENsYXNzICs9ICcgZXZlbnQtY3JpdGljYWwnO1xyXG4gICAgfSBlbHNlIGlmIChtc2cuaW5jbHVkZXMoJ1x1NTc0RFx1NTg0QycpIHx8IG1zZy5pbmNsdWRlcygnXHU2M0EwXHU1OTNBJykpIHtcclxuICAgICAgZXZlbnRDbGFzcyArPSAnIGV2ZW50LXdhcm5pbmcnO1xyXG4gICAgfSBlbHNlIGlmIChtc2cuaW5jbHVkZXMoJ1x1NjUzNlx1OTZDNicpIHx8IG1zZy5pbmNsdWRlcygnXHU2MjEwXHU1MjlGJykpIHtcclxuICAgICAgZXZlbnRDbGFzcyArPSAnIGV2ZW50LXN1Y2Nlc3MnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZXZlbnRDbGFzcyArPSAnIGV2ZW50LW5vcm1hbCc7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGxpbmUuY2xhc3NOYW1lID0gZXZlbnRDbGFzcztcclxuICAgIGxpbmUudGV4dENvbnRlbnQgPSBgWyR7aGh9OiR7bW19OiR7c3N9XSAke21zZ31gO1xyXG4gICAgXHJcbiAgICAvLyBcdTZERkJcdTUyQTBcdTZFRDFcdTUxNjVcdTUyQThcdTc1M0JcclxuICAgIGxpbmUuc3R5bGUub3BhY2l0eSA9ICcwJztcclxuICAgIGxpbmUuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVgoMjBweCknO1xyXG4gICAgdGhpcy5lbHMuZXZlbnRzLnByZXBlbmQobGluZSk7XHJcbiAgICBcclxuICAgIC8vIFx1ODlFNlx1NTNEMVx1NTJBOFx1NzUzQlxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIGxpbmUuc3R5bGUudHJhbnNpdGlvbiA9ICdvcGFjaXR5IDAuM3MgZWFzZSwgdHJhbnNmb3JtIDAuM3MgZWFzZSc7XHJcbiAgICAgIGxpbmUuc3R5bGUub3BhY2l0eSA9ICcwLjknO1xyXG4gICAgICBsaW5lLnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGVYKDApJztcclxuICAgIH0sIDEwKTtcclxuICAgIFxyXG4gICAgLy8gXHU2NkI0XHU1MUZCXHU0RThCXHU0RUY2XHU2REZCXHU1MkEwXHU5NUVBXHU1MTQ5XHU2NTQ4XHU2NzlDXHJcbiAgICBpZiAobXNnLmluY2x1ZGVzKCdcdTY2QjRcdTUxRkInKSkge1xyXG4gICAgICBsaW5lLmNsYXNzTGlzdC5hZGQoJ2ZsYXNoJyk7XHJcbiAgICAgIC8vIFx1ODlFNlx1NTNEMVx1NTE2OFx1NUM0MFx1NjZCNFx1NTFGQlx1NzI3OVx1NjU0OFxyXG4gICAgICB0aGlzLnRyaWdnZXJDcml0aWNhbEVmZmVjdCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB0cmlnZ2VyQ3JpdGljYWxFZmZlY3QoKSB7XHJcbiAgICAvLyBcdTU3MDZcdTczQUZcdTk1RUFcdTc1MzVcdTY1NDhcdTY3OUNcclxuICAgIGlmICh0aGlzLmVscy5yaW5nKSB7XHJcbiAgICAgIHRoaXMuZWxzLnJpbmcuY2xhc3NMaXN0LmFkZCgncmluZy1wdWxzZScpO1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuZWxzLnJpbmc/LmNsYXNzTGlzdC5yZW1vdmUoJ3JpbmctcHVsc2UnKSwgNjAwKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gXHU1MTY4XHU2MDZGXHU4MENDXHU2NjZGXHU5NUVBXHU3MEMxXHJcbiAgICBpZiAodGhpcy5lbHMuaG9sb2dyYW0pIHtcclxuICAgICAgdGhpcy5lbHMuaG9sb2dyYW0uY2xhc3NMaXN0LmFkZCgnY3JpdGljYWwtZmxhc2gnKTtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmVscy5ob2xvZ3JhbT8uY2xhc3NMaXN0LnJlbW92ZSgnY3JpdGljYWwtZmxhc2gnKSwgNDAwKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gXHU3N0ZGXHU1REU1XHU2NkI0XHU1MUZCXHU1MkE4XHU0RjVDXHVGRjA4XHU1MkEwXHU5MDFGXHU2MzI1XHU1MkE4XHVGRjA5XHJcbiAgICBpZiAodGhpcy5lbHMubWluZXJDaGFyKSB7XHJcbiAgICAgIHRoaXMuZWxzLm1pbmVyQ2hhci5jbGFzc0xpc3QuYWRkKCdjcml0aWNhbC1taW5pbmcnKTtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmVscy5taW5lckNoYXI/LmNsYXNzTGlzdC5yZW1vdmUoJ2NyaXRpY2FsLW1pbmluZycpLCAxMjAwKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgZm9ybWF0UGVyY2VudCgpIHtcclxuICAgIGNvbnN0IHBjdCA9IHRoaXMuY2FydENhcCA+IDAgPyBNYXRoLm1pbigxLCB0aGlzLmNhcnRBbXQgLyB0aGlzLmNhcnRDYXApIDogMDtcclxuICAgIHJldHVybiBgJHtNYXRoLnJvdW5kKHBjdCAqIDEwMCl9JWA7XHJcbiAgfVxyXG59IiwgImltcG9ydCB7IE5ldHdvcmtNYW5hZ2VyIH0gZnJvbSAnLi4vY29yZS9OZXR3b3JrTWFuYWdlcic7XG5pbXBvcnQgeyBodG1sLCBxcyB9IGZyb20gJy4uL3V0aWxzL2RvbSc7XG5pbXBvcnQgeyByZW5kZXJOYXYgfSBmcm9tICcuLi9jb21wb25lbnRzL05hdic7XG5pbXBvcnQgeyBSZWFsdGltZUNsaWVudCB9IGZyb20gJy4uL2NvcmUvUmVhbHRpbWVDbGllbnQnO1xuaW1wb3J0IHsgcmVuZGVyUmVzb3VyY2VCYXIgfSBmcm9tICcuLi9jb21wb25lbnRzL1Jlc291cmNlQmFyJztcbmltcG9ydCB7IHNob3dUb2FzdCB9IGZyb20gJy4uL2NvbXBvbmVudHMvVG9hc3QnO1xuaW1wb3J0IHsgcmVuZGVySWNvbiB9IGZyb20gJy4uL2NvbXBvbmVudHMvSWNvbic7XG5cbmV4cG9ydCBjbGFzcyBXYXJlaG91c2VTY2VuZSB7XG4gIGFzeW5jIG1vdW50KHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgcm9vdC5pbm5lckhUTUwgPSAnJztcbiAgICByb290LmFwcGVuZENoaWxkKHJlbmRlck5hdignd2FyZWhvdXNlJykpO1xuICAgIGNvbnN0IGJhciA9IHJlbmRlclJlc291cmNlQmFyKCk7XG4gICAgcm9vdC5hcHBlbmRDaGlsZChiYXIucm9vdCk7XG5cbiAgICBjb25zdCB2aWV3ID0gaHRtbChgXG4gICAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyIGdyaWQtMlwiIHN0eWxlPVwiY29sb3I6I2ZmZjtcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQgZmFkZS1pblwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIiBzdHlsZT1cImp1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2FsaWduLWl0ZW1zOmNlbnRlcjtcIj5cbiAgICAgICAgICAgIDxoMyBzdHlsZT1cIm1hcmdpbjowO2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjhweDtcIj48c3BhbiBkYXRhLWljbz1cIndhcmVob3VzZVwiPjwvc3Bhbj5cdTRFRDNcdTVFOTM8L2gzPlxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInJlZnJlc2hcIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiPjxzcGFuIGRhdGEtaWNvPVwicmVmcmVzaFwiPjwvc3Bhbj5cdTUyMzdcdTY1QjA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IHN0eWxlPVwibWFyZ2luLXRvcDoxMnB4O1wiPlxuICAgICAgICAgICAgPGRldGFpbHMgb3Blbj5cbiAgICAgICAgICAgICAgPHN1bW1hcnk+PHNwYW4gZGF0YS1pY289XCJvcmVcIj48L3NwYW4+XHU3ODhFXHU3MjQ3XHU0RUQzXHU1RTkzPC9zdW1tYXJ5PlxuICAgICAgICAgICAgICA8ZGl2IGlkPVwiZnJhZ21lbnRzXCIgc3R5bGU9XCJtYXJnaW4tdG9wOjhweDtkaXNwbGF5OmdyaWQ7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOnJlcGVhdChhdXRvLWZpdCxtaW5tYXgoMTQwcHgsMWZyKSk7Z2FwOjhweDtcIj48L2Rpdj5cbiAgICAgICAgICAgIDwvZGV0YWlscz5cbiAgICAgICAgICAgIDxkZXRhaWxzIG9wZW4+XG4gICAgICAgICAgICAgIDxzdW1tYXJ5PjxzcGFuIGRhdGEtaWNvPVwiYm94XCI+PC9zcGFuPlx1NjIxMVx1NzY4NFx1OTA1M1x1NTE3Nzwvc3VtbWFyeT5cbiAgICAgICAgICAgICAgPGRpdiBpZD1cImxpc3RcIiBzdHlsZT1cIm1hcmdpbi10b3A6OHB4O2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjhweDtcIj48L2Rpdj5cbiAgICAgICAgICAgIDwvZGV0YWlscz5cbiAgICAgICAgICAgIDxkZXRhaWxzPlxuICAgICAgICAgICAgICA8c3VtbWFyeT48c3BhbiBkYXRhLWljbz1cImxpc3RcIj48L3NwYW4+XHU5MDUzXHU1MTc3XHU2QTIxXHU2NzdGPC9zdW1tYXJ5PlxuICAgICAgICAgICAgICA8ZGl2IGlkPVwidHBsc1wiIHN0eWxlPVwibWFyZ2luLXRvcDo4cHg7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6OHB4O1wiPjwvZGl2PlxuICAgICAgICAgICAgPC9kZXRhaWxzPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIGApO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQodmlldyk7XG5cbiAgICBjb25zdCB0b2tlbiA9IE5ldHdvcmtNYW5hZ2VyLkkuZ2V0VG9rZW4oKTtcbiAgICBpZiAodG9rZW4pIFJlYWx0aW1lQ2xpZW50LkkuY29ubmVjdCh0b2tlbik7XG5cbiAgICBjb25zdCBsaXN0ID0gcXModmlldywgJyNsaXN0Jyk7XG4gICAgY29uc3QgdHBsQ29udGFpbmVyID0gcXModmlldywgJyN0cGxzJyk7XG4gICAgY29uc3QgZnJhZ21lbnRzQ29udGFpbmVyID0gcXModmlldywgJyNmcmFnbWVudHMnKTtcbiAgICBjb25zdCByZWZyZXNoQnRuID0gcXM8SFRNTEJ1dHRvbkVsZW1lbnQ+KHZpZXcsICcjcmVmcmVzaCcpO1xuXG4gICAgY29uc3QgbW91bnRJY29ucyA9IChyb290RWw6IEVsZW1lbnQpID0+IHtcbiAgICAgIHJvb3RFbC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1pY29dJylcbiAgICAgICAgLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgICAgY29uc3QgbmFtZSA9IChlbCBhcyBIVE1MRWxlbWVudCkuZ2V0QXR0cmlidXRlKCdkYXRhLWljbycpIGFzIGFueTtcbiAgICAgICAgICB0cnkgeyBlbC5hcHBlbmRDaGlsZChyZW5kZXJJY29uKG5hbWUsIHsgc2l6ZTogMjAgfSkpOyB9IGNhdGNoIHt9XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgbW91bnRJY29ucyh2aWV3KTtcblxuICAgIGNvbnN0IGdldFJhcml0eSA9IChpdGVtOiBhbnksIHRwbD86IGFueSk6IHsga2V5OiAnY29tbW9uJ3wncmFyZSd8J2VwaWMnfCdsZWdlbmRhcnknOyB0ZXh0OiBzdHJpbmcgfSA9PiB7XG4gICAgICBjb25zdCByID0gKHRwbCAmJiAodHBsLnJhcml0eSB8fCB0cGwudGllcikpIHx8IGl0ZW0ucmFyaXR5O1xuICAgICAgY29uc3QgbGV2ZWwgPSBOdW1iZXIoaXRlbS5sZXZlbCkgfHwgMDtcbiAgICAgIGlmICh0eXBlb2YgciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgY29uc3QgayA9IHIudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgaWYgKFsnbGVnZW5kYXJ5JywnZXBpYycsJ3JhcmUnLCdjb21tb24nXS5pbmNsdWRlcyhrKSkge1xuICAgICAgICAgIHJldHVybiB7IGtleTogayBhcyBhbnksIHRleHQ6IGsgPT09ICdsZWdlbmRhcnknID8gJ1x1NEYyMFx1OEJGNCcgOiBrID09PSAnZXBpYycgPyAnXHU1M0YyXHU4QkQ3JyA6IGsgPT09ICdyYXJlJyA/ICdcdTdBMDBcdTY3MDknIDogJ1x1NjY2RVx1OTAxQScgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGxldmVsID49IDEyKSByZXR1cm4geyBrZXk6ICdsZWdlbmRhcnknLCB0ZXh0OiAnXHU0RjIwXHU4QkY0JyB9O1xuICAgICAgaWYgKGxldmVsID49IDgpIHJldHVybiB7IGtleTogJ2VwaWMnLCB0ZXh0OiAnXHU1M0YyXHU4QkQ3JyB9O1xuICAgICAgaWYgKGxldmVsID49IDQpIHJldHVybiB7IGtleTogJ3JhcmUnLCB0ZXh0OiAnXHU3QTAwXHU2NzA5JyB9O1xuICAgICAgcmV0dXJuIHsga2V5OiAnY29tbW9uJywgdGV4dDogJ1x1NjY2RVx1OTAxQScgfTtcbiAgICB9O1xuXG4gICAgY29uc3QgZm9ybWF0VGltZSA9ICh0czogbnVtYmVyKSA9PiB7XG4gICAgICB0cnkgeyByZXR1cm4gbmV3IERhdGUodHMpLnRvTG9jYWxlU3RyaW5nKCk7IH0gY2F0Y2ggeyByZXR1cm4gJycgKyB0czsgfVxuICAgIH07XG5cbiAgICBjb25zdCBsb2FkID0gYXN5bmMgKCkgPT4ge1xuICAgICAgcmVmcmVzaEJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICByZWZyZXNoQnRuLmlubmVySFRNTCA9ICc8c3BhbiBkYXRhLWljbz1cInJlZnJlc2hcIj48L3NwYW4+XHU1MjM3XHU2NUIwXHU0RTJEXHUyMDI2JztcbiAgICAgIG1vdW50SWNvbnMocmVmcmVzaEJ0bik7XG4gICAgICBhd2FpdCBiYXIudXBkYXRlKCk7XG4gICAgICBsaXN0LmlubmVySFRNTCA9ICcnO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIGxpc3QuYXBwZW5kQ2hpbGQoaHRtbCgnPGRpdiBjbGFzcz1cInNrZWxldG9uXCI+PC9kaXY+JykpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgW2RhdGEsIHRwbHMsIGZyYWdtZW50c0RhdGFdID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICAgIE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IGl0ZW1zOiBhbnlbXSB9PignL2l0ZW1zJyksXG4gICAgICAgICAgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgdGVtcGxhdGVzOiBhbnlbXSB9PignL2l0ZW1zL3RlbXBsYXRlcycpLmNhdGNoKCgpID0+ICh7IHRlbXBsYXRlczogW10gfSkpLFxuICAgICAgICAgIE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IGZyYWdtZW50czogUmVjb3JkPHN0cmluZywgbnVtYmVyPiB9PignL2l0ZW1zL2ZyYWdtZW50cycpLmNhdGNoKCgpID0+ICh7IGZyYWdtZW50czoge30gfSkpXG4gICAgICAgIF0pO1xuICAgICAgICBjb25zdCB0cGxCeUlkOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gICAgICAgIGZvciAoY29uc3QgdCBvZiAodHBscy50ZW1wbGF0ZXMgfHwgW10pKSB0cGxCeUlkW3QuaWRdID0gdDtcbiAgICAgICAgXG4gICAgICAgIC8vIFx1NkUzMlx1NjdEM1x1Nzg4RVx1NzI0N1xuICAgICAgICBjb25zdCBmcmFnbWVudHMgPSBmcmFnbWVudHNEYXRhLmZyYWdtZW50cyB8fCB7fTtcbiAgICAgICAgZnJhZ21lbnRzQ29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuICAgICAgICBjb25zdCBmcmFnbWVudE5hbWVzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAgICAgICAgIG1pbmVyOiAnXHU3N0ZGXHU2NzNBXHU3ODhFXHU3MjQ3JyxcbiAgICAgICAgICBjYXJ0OiAnXHU3N0ZGXHU4RjY2XHU3ODhFXHU3MjQ3JyxcbiAgICAgICAgICByYWlkZXI6ICdcdTYzQTBcdTU5M0FcdTU2NjhcdTc4OEVcdTcyNDcnLFxuICAgICAgICAgIHNoaWVsZDogJ1x1OTYzMlx1NUZBMVx1NzZGRVx1Nzg4RVx1NzI0NycsXG4gICAgICAgIH07XG4gICAgICAgIGZvciAoY29uc3QgW3R5cGUsIGNvdW50XSBvZiBPYmplY3QuZW50cmllcyhmcmFnbWVudHMpKSB7XG4gICAgICAgICAgY29uc3QgY2FuQ3JhZnQgPSBjb3VudCA+PSA1MDtcbiAgICAgICAgICBjb25zdCBjYXJkID0gaHRtbChgXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZnJhZ21lbnQtY2FyZCAke2NhbkNyYWZ0ID8gJ2Nhbi1jcmFmdCcgOiAnJ31cIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZyYWdtZW50LWljb25cIiBkYXRhLWljbz1cIm9yZVwiPjwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZnJhZ21lbnQtaW5mb1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmcmFnbWVudC1uYW1lXCI+JHtmcmFnbWVudE5hbWVzW3R5cGVdIHx8IHR5cGV9PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZyYWdtZW50LWNvdW50XCI+JHtjb3VudH0gLyA1MDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeSBidG4tc21cIiBkYXRhLWNyYWZ0PVwiJHt0eXBlfVwiICR7Y2FuQ3JhZnQgPyAnJyA6ICdkaXNhYmxlZCd9PjxzcGFuIGRhdGEtaWNvPVwid3JlbmNoXCI+PC9zcGFuPlx1NTQwOFx1NjIxMDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgYCk7XG4gICAgICAgICAgbW91bnRJY29ucyhjYXJkKTtcbiAgICAgICAgICBcbiAgICAgICAgICAvLyBcdTU0MDhcdTYyMTBcdTYzMDlcdTk0QUVcdTcwQjlcdTUxRkJcdTRFOEJcdTRFRjZcbiAgICAgICAgICBjb25zdCBjcmFmdEJ0biA9IGNhcmQucXVlcnlTZWxlY3RvcignW2RhdGEtY3JhZnRdJykgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XG4gICAgICAgICAgY3JhZnRCdG4/LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKGNyYWZ0QnRuLmRpc2FibGVkKSByZXR1cm47XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNyYWZ0QnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbnN0IG9yaWdpbmFsSFRNTCA9IGNyYWZ0QnRuLmlubmVySFRNTDtcbiAgICAgICAgICAgIGNyYWZ0QnRuLmlubmVySFRNTCA9ICc8c3BhbiBkYXRhLWljbz1cIndyZW5jaFwiPjwvc3Bhbj5cdTU0MDhcdTYyMTBcdTRFMkRcdTIwMjYnO1xuICAgICAgICAgICAgbW91bnRJY29ucyhjcmFmdEJ0bik7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IGl0ZW06IGFueSB9PignL2l0ZW1zL2NyYWZ0Jywge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgZnJhZ21lbnRUeXBlOiB0eXBlIH0pLFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgc2hvd1RvYXN0KGBcdTU0MDhcdTYyMTBcdTYyMTBcdTUyOUZcdUZGMDFcdTgzQjdcdTVGOTcgJHtmcmFnbWVudE5hbWVzW3R5cGVdfWAsICdzdWNjZXNzJyk7XG4gICAgICAgICAgICAgIGNhcmQuY2xhc3NMaXN0LmFkZCgndXBncmFkZS1zdWNjZXNzJyk7XG4gICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gY2FyZC5jbGFzc0xpc3QucmVtb3ZlKCd1cGdyYWRlLXN1Y2Nlc3MnKSwgMTAwMCk7XG4gICAgICAgICAgICAgIGF3YWl0IGxvYWQoKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgICAgICAgICBzaG93VG9hc3QoZT8ubWVzc2FnZSB8fCAnXHU1NDA4XHU2MjEwXHU1OTMxXHU4RDI1JywgJ2Vycm9yJyk7XG4gICAgICAgICAgICAgIGNyYWZ0QnRuLmlubmVySFRNTCA9IG9yaWdpbmFsSFRNTDtcbiAgICAgICAgICAgICAgbW91bnRJY29ucyhjcmFmdEJ0bik7XG4gICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICBjcmFmdEJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIFxuICAgICAgICAgIGZyYWdtZW50c0NvbnRhaW5lci5hcHBlbmRDaGlsZChjYXJkKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgbGlzdC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgaWYgKCFkYXRhLml0ZW1zLmxlbmd0aCkge1xuICAgICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQoaHRtbCgnPGRpdiBzdHlsZT1cIm9wYWNpdHk6Ljg7XCI+XHU2NjgyXHU2NUUwXHU5MDUzXHU1MTc3XHVGRjBDXHU1QzFEXHU4QkQ1XHU1OTFBXHU2MzE2XHU3N0ZGXHU2MjE2XHU2M0EwXHU1OTNBXHU0RUU1XHU4M0I3XHU1M0Q2XHU2NkY0XHU1OTFBXHU4RDQ0XHU2RTkwPC9kaXY+JykpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBkYXRhLml0ZW1zKSB7XG4gICAgICAgICAgY29uc3QgdHBsID0gdHBsQnlJZFtpdGVtLnRlbXBsYXRlSWRdO1xuICAgICAgICAgIGNvbnN0IHJhcml0eSA9IGdldFJhcml0eShpdGVtLCB0cGwpO1xuICAgICAgICAgIGNvbnN0IG5hbWUgPSAodHBsICYmICh0cGwubmFtZSB8fCB0cGwuaWQpKSB8fCBpdGVtLnRlbXBsYXRlSWQ7XG5cbiAgICAgICAgICAvLyBcdThCQTFcdTdCOTdcdTUzNDdcdTdFQTdcdTYyMTBcdTUyOUZcdTczODdcbiAgICAgICAgICBjb25zdCBzdWNjZXNzUmF0ZSA9IE1hdGgubWF4KDAuNCwgMC44IC0gKGl0ZW0ubGV2ZWwgLSAxKSAqIDAuMDIpO1xuICAgICAgICAgIGNvbnN0IHN1Y2Nlc3NQY3QgPSBNYXRoLnJvdW5kKHN1Y2Nlc3NSYXRlICogMTAwKTtcbiAgICAgICAgICBcbiAgICAgICAgICBjb25zdCByb3cgPSBodG1sKGBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpdGVtLWNhcmQgaG92ZXItbGlmdCAke1xuICAgICAgICAgICAgICByYXJpdHkua2V5ID09PSAnbGVnZW5kYXJ5JyA/ICdyYXJpdHktb3V0bGluZS1sZWdlbmRhcnknIDogcmFyaXR5LmtleSA9PT0gJ2VwaWMnID8gJ3Jhcml0eS1vdXRsaW5lLWVwaWMnIDogcmFyaXR5LmtleSA9PT0gJ3JhcmUnID8gJ3Jhcml0eS1vdXRsaW5lLXJhcmUnIDogJ3Jhcml0eS1vdXRsaW5lLWNvbW1vbidcbiAgICAgICAgICAgIH1cIiBkYXRhLXJhcml0eT1cIiR7cmFyaXR5LmtleX1cIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiIHN0eWxlPVwianVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YWxpZ24taXRlbXM6ZmxleC1zdGFydDtnYXA6MTBweDtcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6NnB4O2ZsZXg6MTttaW4td2lkdGg6MDtcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJkaXNwbGF5OmZsZXg7ZmxleC13cmFwOndyYXA7Z2FwOjZweDthbGlnbi1pdGVtczpjZW50ZXI7XCI+XG4gICAgICAgICAgICAgICAgICAgIDxzdHJvbmcgc3R5bGU9XCJmb250LXNpemU6MTVweDt3aGl0ZS1zcGFjZTpub3dyYXA7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NnB4O1wiPjxzcGFuIGRhdGEtaWNvPVwib3JlXCI+PC9zcGFuPiR7bmFtZX08L3N0cm9uZz5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJiYWRnZSByYXJpdHktJHtyYXJpdHkua2V5fVwiPjxpPjwvaT4ke3Jhcml0eS50ZXh0fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgJHtpdGVtLmlzRXF1aXBwZWQgPyAnPHNwYW4gY2xhc3M9XCJwaWxsIHBpbGwtcnVubmluZ1wiPlx1NURGMlx1ODhDNVx1NTkwNzwvc3Bhbj4nIDogJyd9XG4gICAgICAgICAgICAgICAgICAgICR7aXRlbS5pc0xpc3RlZCA/ICc8c3BhbiBjbGFzcz1cInBpbGxcIj5cdTYzMDJcdTUzNTVcdTRFMkQ8L3NwYW4+JyA6ICcnfVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAke3RwbD8uZGVzY3JpcHRpb24gPyBgPGRpdiBzdHlsZT1cIm9wYWNpdHk6Ljc1O2ZvbnQtc2l6ZToxM3B4O2ZvbnQtc3R5bGU6aXRhbGljO1wiPiR7dHBsLmRlc2NyaXB0aW9ufTwvZGl2PmAgOiAnJ31cbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJvcGFjaXR5Oi44NTtkaXNwbGF5OmZsZXg7ZmxleC13cmFwOndyYXA7Z2FwOjhweDtmb250LXNpemU6MTNweDtcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4+XHU3QjQ5XHU3RUE3IEx2LiR7aXRlbS5sZXZlbH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICR7dHBsPy5iYXNlRWZmZWN0ID8gYDxzcGFuIGNsYXNzPVwicGlsbFwiPlx1NTdGQVx1Nzg0MFx1NjU0OFx1Njc5QyAke3RwbC5iYXNlRWZmZWN0fTwvc3Bhbj5gIDogJyd9XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicGlsbFwiPlx1NUI5RVx1NEY4QiAke2l0ZW0uaWR9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFjdGlvbnNcIj5cbiAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gJHtpdGVtLmlzRXF1aXBwZWQgPyAnYnRuLXNlbGwnIDogJ2J0bi1idXknfVwiIGRhdGEtYWN0PVwiJHtpdGVtLmlzRXF1aXBwZWQgPyAndW5lcXVpcCcgOiAnZXF1aXAnfVwiIGRhdGEtaWQ9XCIke2l0ZW0uaWR9XCI+PHNwYW4gZGF0YS1pY289XCIke2l0ZW0uaXNFcXVpcHBlZCA/ICd4JyA6ICdzaGllbGQnfVwiPjwvc3Bhbj4ke2l0ZW0uaXNFcXVpcHBlZCA/ICdcdTUzNzhcdTRFMEInIDogJ1x1ODhDNVx1NTkwNyd9PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCIgZGF0YS1hY3Q9XCJ1cGdyYWRlXCIgZGF0YS1pZD1cIiR7aXRlbS5pZH1cIiB0aXRsZT1cIlx1NkQ4OFx1ODAxNyAke2l0ZW0ubGV2ZWwgKiA1MH0gXHU3N0ZGXHU3N0YzXHVGRjBDXHU2MjEwXHU1MjlGXHU3Mzg3ICR7c3VjY2Vzc1BjdH0lXCI+PHNwYW4gZGF0YS1pY289XCJ3cmVuY2hcIj48L3NwYW4+XHU1MzQ3XHU3RUE3ICgke2l0ZW0ubGV2ZWwgKiA1MH0pICR7c3VjY2Vzc1BjdH0lPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1naG9zdFwiIGRhdGEtYWN0PVwidG9nZ2xlXCIgZGF0YS1pZD1cIiR7aXRlbS5pZH1cIj48c3BhbiBkYXRhLWljbz1cImxpc3RcIj48L3NwYW4+XHU4QkU2XHU2MEM1PC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGltZWxpbmVcIiBpZD1cInRsLSR7aXRlbS5pZH1cIiBoaWRkZW4+PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICBgKTtcbiAgICAgICAgICBtb3VudEljb25zKHJvdyk7XG4gICAgICAgICAgcm93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKGV2KSA9PiB7XG4gICAgICAgICAgICAvLyBcdTY3RTVcdTYyN0VcdTc3MUZcdTZCNjNcdTc2ODRcdTYzMDlcdTk0QUVcdTUxNDNcdTdEMjBcdUZGMDhcdTUzRUZcdTgwRkRcdTcwQjlcdTUxRkJcdTRFODZcdTUxODVcdTkwRThcdTc2ODRzcGFuL3N2Z1x1RkYwOVxuICAgICAgICAgICAgY29uc3QgYnRuID0gKGV2LnRhcmdldCBhcyBIVE1MRWxlbWVudCkuY2xvc2VzdCgnYnV0dG9uJykgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XG4gICAgICAgICAgICBpZiAoIWJ0bikgcmV0dXJuO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBpZCA9IGJ0bi5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnKTtcbiAgICAgICAgICAgIGNvbnN0IGFjdCA9IGJ0bi5nZXRBdHRyaWJ1dGUoJ2RhdGEtYWN0Jyk7XG4gICAgICAgICAgICBpZiAoIWlkIHx8ICFhY3QpIHJldHVybjtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gXHU5NjMyXHU2QjYyXHU5MUNEXHU1OTBEXHU3MEI5XHU1MUZCXG4gICAgICAgICAgICBpZiAoYnRuLmRpc2FibGVkICYmIGFjdCAhPT0gJ3RvZ2dsZScpIHJldHVybjtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGFjdCA9PT0gJ3RvZ2dsZScpIHtcbiAgICAgICAgICAgICAgY29uc3QgYm94ID0gcm93LnF1ZXJ5U2VsZWN0b3IoYCN0bC0ke2lkfWApIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICAgICAgICBpZiAoIWJveCkgcmV0dXJuO1xuICAgICAgICAgICAgICBpZiAoIWJveC5oYXNDaGlsZE5vZGVzKCkpIHtcbiAgICAgICAgICAgICAgICBib3guaW5uZXJIVE1MID0gJzxkaXYgY2xhc3M9XCJza2VsZXRvblwiIHN0eWxlPVwiaGVpZ2h0OjM2cHg7XCI+PC9kaXY+JztcbiAgICAgICAgICAgICAgICBib3guaGlkZGVuID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IGxvZ3M6IHsgdHlwZTogc3RyaW5nOyBkZXNjPzogc3RyaW5nOyB0aW1lOiBudW1iZXIgfVtdIH0+KGAvaXRlbXMvbG9ncz9pdGVtSWQ9JHtpZH1gKTtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGxvZ3MgPSBBcnJheS5pc0FycmF5KHJlcy5sb2dzKSA/IHJlcy5sb2dzIDogW107XG4gICAgICAgICAgICAgICAgICBib3guaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgICAgICAgICBpZiAoIWxvZ3MubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGJveC5pbm5lckhUTUwgPSAnPGRpdiBzdHlsZT1cIm9wYWNpdHk6Ljg7XCI+XHU2NjgyXHU2NUUwXHU1Mzg2XHU1M0YyXHU2NTcwXHU2MzZFPC9kaXY+JztcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgbG9nIG9mIGxvZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICBjb25zdCBub2RlID0gaHRtbChgXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGltZWxpbmUtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZG90XCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0aW1lXCI+JHtmb3JtYXRUaW1lKGxvZy50aW1lKX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRlc2NcIj4keyhsb2cuZGVzYyB8fCBsb2cudHlwZSB8fCAnJykucmVwbGFjZSgvPC9nLCcmbHQ7Jyl9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICBgKTtcbiAgICAgICAgICAgICAgICAgICAgICBib3guYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICAgICAgICAgIGJveC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICAgICAgICAgIGJveC5hcHBlbmRDaGlsZChodG1sKGBcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRpbWVsaW5lLWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZG90XCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRpbWVcIj5cdTIwMTQ8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGVzY1wiPlx1Njc2NVx1NkU5MFx1NjcyQVx1NzdFNSBcdTAwQjcgXHU1M0VGXHU5MDFBXHU4RkM3XHU2MzE2XHU3N0ZGXHUzMDAxXHU2M0EwXHU1OTNBXHU2MjE2XHU0RUE0XHU2NjEzXHU4M0I3XHU1M0Q2PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgYCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBib3guaGlkZGVuID0gIWJveC5oaWRkZW47XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBcdTY0Q0RcdTRGNUNcdTYzMDlcdTk0QUVcdTU5MDRcdTc0MDZcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgICAgIGNvbnN0IG9yaWdpbmFsSFRNTCA9IGJ0bi5pbm5lckhUTUw7XG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICBpZiAoYWN0ID09PSAnZXF1aXAnKSB7XG4gICAgICAgICAgICAgICAgYnRuLmlubmVySFRNTCA9ICc8c3BhbiBkYXRhLWljbz1cInNoaWVsZFwiPjwvc3Bhbj5cdTg4QzVcdTU5MDdcdTRFMkRcdTIwMjYnO1xuICAgICAgICAgICAgICAgIG1vdW50SWNvbnMoYnRuKTtcbiAgICAgICAgICAgICAgICBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3QoJy9pdGVtcy9lcXVpcCcsIHsgbWV0aG9kOiAnUE9TVCcsIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgaXRlbUlkOiBpZCB9KSB9KTtcbiAgICAgICAgICAgICAgICBzaG93VG9hc3QoJ1x1ODhDNVx1NTkwN1x1NjIxMFx1NTI5RicsICdzdWNjZXNzJyk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoYWN0ID09PSAndW5lcXVpcCcpIHtcbiAgICAgICAgICAgICAgICBidG4uaW5uZXJIVE1MID0gJzxzcGFuIGRhdGEtaWNvPVwieFwiPjwvc3Bhbj5cdTUzNzhcdTRFMEJcdTRFMkRcdTIwMjYnO1xuICAgICAgICAgICAgICAgIG1vdW50SWNvbnMoYnRuKTtcbiAgICAgICAgICAgICAgICBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3QoJy9pdGVtcy91bmVxdWlwJywgeyBtZXRob2Q6ICdQT1NUJywgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBpdGVtSWQ6IGlkIH0pIH0pO1xuICAgICAgICAgICAgICAgIHNob3dUb2FzdCgnXHU1Mzc4XHU0RTBCXHU2MjEwXHU1MjlGJywgJ3N1Y2Nlc3MnKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChhY3QgPT09ICd1cGdyYWRlJykge1xuICAgICAgICAgICAgICAgIGJ0bi5pbm5lckhUTUwgPSAnPHNwYW4gZGF0YS1pY289XCJ3cmVuY2hcIj48L3NwYW4+XHU1MzQ3XHU3RUE3XHU0RTJEXHUyMDI2JztcbiAgICAgICAgICAgICAgICBtb3VudEljb25zKGJ0bik7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgbGV2ZWw6IG51bWJlcjsgY29zdDogbnVtYmVyIH0+KCcvaXRlbXMvdXBncmFkZScsIHsgbWV0aG9kOiAnUE9TVCcsIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgaXRlbUlkOiBpZCB9KSB9KTtcbiAgICAgICAgICAgICAgICAvLyBcdTUzNDdcdTdFQTdcdTYyMTBcdTUyOUZcdTUyQThcdTc1M0JcbiAgICAgICAgICAgICAgICByb3cuY2xhc3NMaXN0LmFkZCgndXBncmFkZS1zdWNjZXNzJyk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiByb3cuY2xhc3NMaXN0LnJlbW92ZSgndXBncmFkZS1zdWNjZXNzJyksIDEwMDApO1xuICAgICAgICAgICAgICAgIHNob3dUb2FzdChgXHU1MzQ3XHU3RUE3XHU2MjEwXHU1MjlGXHVGRjAxXHU3QjQ5XHU3RUE3ICR7cmVzLmxldmVsfVx1RkYwOFx1NkQ4OFx1ODAxNyAke3Jlcy5jb3N0fSBcdTc3RkZcdTc3RjNcdUZGMDlgLCAnc3VjY2VzcycpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGF3YWl0IGJhci51cGRhdGUoKTtcbiAgICAgICAgICAgICAgYXdhaXQgbG9hZCgpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgICAgICAgIHNob3dUb2FzdChlPy5tZXNzYWdlIHx8ICdcdTY0Q0RcdTRGNUNcdTU5MzFcdThEMjUnLCAnZXJyb3InKTtcbiAgICAgICAgICAgICAgLy8gXHU1OTMxXHU4RDI1XHU2NUY2XHU2MDYyXHU1OTBEXHU2MzA5XHU5NEFFXHU1MzlGXHU1OUNCXHU3MkI2XHU2MDAxXHVGRjA4XHU1NkUwXHU0RTNBXHU0RTBEXHU0RjFBXHU5MUNEXHU2NUIwXHU2RTMyXHU2N0QzXHVGRjA5XG4gICAgICAgICAgICAgIGJ0bi5pbm5lckhUTUwgPSBvcmlnaW5hbEhUTUw7XG4gICAgICAgICAgICAgIGJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQocm93KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRwbENvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgZm9yIChjb25zdCB0cGwgb2YgKHRwbHMudGVtcGxhdGVzIHx8IFtdKSkge1xuICAgICAgICAgIGNvbnN0IHJhcml0eVRleHQgPSB0cGwucmFyaXR5ID09PSAnbGVnZW5kYXJ5JyA/ICdcdTRGMjBcdThCRjQnIDogdHBsLnJhcml0eSA9PT0gJ2VwaWMnID8gJ1x1NTNGMlx1OEJENycgOiB0cGwucmFyaXR5ID09PSAncmFyZScgPyAnXHU3QTAwXHU2NzA5JyA6ICdcdTY2NkVcdTkwMUEnO1xuICAgICAgICAgIGNvbnN0IGNhdGVnb3J5VGV4dCA9IHRwbC5jYXRlZ29yeSA9PT0gJ21pbmVyJyA/ICdcdTc3RkZcdTY3M0EnIDogdHBsLmNhdGVnb3J5ID09PSAnY2FydCcgPyAnXHU3N0ZGXHU4RjY2JyA6IHRwbC5jYXRlZ29yeSA9PT0gJ3JhaWRlcicgPyAnXHU2M0EwXHU1OTNBXHU1NjY4JyA6ICdcdTk2MzJcdTVGQTFcdTc2RkUnO1xuICAgICAgICAgIGNvbnN0IHJvdyA9IGh0bWwoYFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxpc3QtaXRlbVwiPlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZmxleDoxO2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjRweDtcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZGlzcGxheTpmbGV4O2dhcDo2cHg7YWxpZ24taXRlbXM6Y2VudGVyO1wiPlxuICAgICAgICAgICAgICAgICAgPHN0cm9uZz4ke3RwbC5uYW1lIHx8IHRwbC5pZH08L3N0cm9uZz5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYmFkZ2UgcmFyaXR5LSR7dHBsLnJhcml0eX1cIj48aT48L2k+JHtyYXJpdHlUZXh0fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwib3BhY2l0eTouNzU7Zm9udC1zaXplOjEycHg7XCI+JHt0cGwuZGVzY3JpcHRpb24gfHwgJyd9PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cIm9wYWNpdHk6LjY1O2ZvbnQtc2l6ZToxMnB4O1wiPlx1N0M3Qlx1NTc4Qlx1RkYxQSR7Y2F0ZWdvcnlUZXh0fSBcdTAwQjcgXHU1N0ZBXHU3ODQwXHU2NTQ4XHU2NzlDXHVGRjFBJHt0cGwuYmFzZUVmZmVjdH08L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICBgKTtcbiAgICAgICAgICB0cGxDb250YWluZXIuYXBwZW5kQ2hpbGQocm93KTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgIHNob3dUb2FzdChlPy5tZXNzYWdlIHx8ICdcdTUyQTBcdThGN0RcdTRFRDNcdTVFOTNcdTU5MzFcdThEMjUnLCAnZXJyb3InKTtcbiAgICAgICAgbGlzdC5pbm5lckhUTUwgPSAnPGRpdiBzdHlsZT1cIm9wYWNpdHk6Ljg7dGV4dC1hbGlnbjpjZW50ZXI7cGFkZGluZzoyMHB4O1wiPlx1NTJBMFx1OEY3RFx1NTkzMVx1OEQyNVx1RkYwQ1x1OEJGN1x1N0EwRFx1NTQwRVx1OTFDRFx1OEJENTwvZGl2Pic7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICByZWZyZXNoQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIHJlZnJlc2hCdG4uaW5uZXJIVE1MID0gJzxzcGFuIGRhdGEtaWNvPVwicmVmcmVzaFwiPjwvc3Bhbj5cdTUyMzdcdTY1QjAnO1xuICAgICAgICBtb3VudEljb25zKHJlZnJlc2hCdG4pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZWZyZXNoQnRuLm9uY2xpY2sgPSAoKSA9PiBsb2FkKCk7XG4gICAgYXdhaXQgbG9hZCgpO1xuICB9XG59XG4iLCAiaW1wb3J0IHsgTmV0d29ya01hbmFnZXIgfSBmcm9tICcuLi9jb3JlL05ldHdvcmtNYW5hZ2VyJztcbmltcG9ydCB7IGh0bWwsIHFzIH0gZnJvbSAnLi4vdXRpbHMvZG9tJztcbmltcG9ydCB7IHJlbmRlck5hdiB9IGZyb20gJy4uL2NvbXBvbmVudHMvTmF2JztcbmltcG9ydCB7IFJlYWx0aW1lQ2xpZW50IH0gZnJvbSAnLi4vY29yZS9SZWFsdGltZUNsaWVudCc7XG5pbXBvcnQgeyBzaG93VG9hc3QgfSBmcm9tICcuLi9jb21wb25lbnRzL1RvYXN0JztcbmltcG9ydCB7IHJlbmRlclJlc291cmNlQmFyIH0gZnJvbSAnLi4vY29tcG9uZW50cy9SZXNvdXJjZUJhcic7XG5pbXBvcnQgeyByZW5kZXJJY29uIH0gZnJvbSAnLi4vY29tcG9uZW50cy9JY29uJztcbmltcG9ydCB7IGNyZWF0ZVN3b3JkU2xhc2ggfSBmcm9tICcuLi9jb21wb25lbnRzL0FuaW1hdGVkSWNvbnMnO1xuXG5leHBvcnQgY2xhc3MgUGx1bmRlclNjZW5lIHtcbiAgcHJpdmF0ZSByZXN1bHRCb3g6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG5cbiAgbW91bnQocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICByb290LmlubmVySFRNTCA9ICcnO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQocmVuZGVyTmF2KCdwbHVuZGVyJykpO1xuICAgIGNvbnN0IGJhciA9IHJlbmRlclJlc291cmNlQmFyKCk7XG4gICAgcm9vdC5hcHBlbmRDaGlsZChiYXIucm9vdCk7XG5cbiAgICBjb25zdCB2aWV3ID0gaHRtbChgXG4gICAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyIGdyaWQtMlwiIHN0eWxlPVwiY29sb3I6I2ZmZjtcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQgZmFkZS1pblwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIiBzdHlsZT1cImp1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2FsaWduLWl0ZW1zOmNlbnRlcjtcIj5cbiAgICAgICAgICAgIDxoMyBzdHlsZT1cIm1hcmdpbjowO2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjhweDtcIj48c3BhbiBkYXRhLWljbz1cInN3b3JkXCI+PC9zcGFuPlx1NjNBMFx1NTkzQVx1NzZFRVx1NjgwNzwvaDM+XG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwicmVmcmVzaFwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCI+PHNwYW4gZGF0YS1pY289XCJyZWZyZXNoXCI+PC9zcGFuPlx1NTIzN1x1NjVCMDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgc3R5bGU9XCJtYXJnaW4tdG9wOjEycHg7XCI+XG4gICAgICAgICAgICA8ZGV0YWlscz5cbiAgICAgICAgICAgICAgPHN1bW1hcnkgc3R5bGU9XCJjb2xvcjojZmY1YzVjO1wiPjxzcGFuIGRhdGEtaWNvPVwidGFyZ2V0XCI+PC9zcGFuPlx1NTkwRFx1NEVDN1x1NTIxN1x1ODg2ODwvc3VtbWFyeT5cbiAgICAgICAgICAgICAgPGRpdiBpZD1cInJldmVuZ2VcIiBzdHlsZT1cIm1hcmdpbi10b3A6OHB4O2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjhweDtcIj48L2Rpdj5cbiAgICAgICAgICAgIDwvZGV0YWlscz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGlkPVwibGlzdFwiIHN0eWxlPVwibWFyZ2luLXRvcDoxMnB4O2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjhweDtcIj48L2Rpdj5cbiAgICAgICAgICA8ZGl2IGlkPVwicmVzdWx0XCIgc3R5bGU9XCJtYXJnaW4tdG9wOjEycHg7b3BhY2l0eTouOTtmb250LWZhbWlseTptb25vc3BhY2U7XCI+PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgYCk7XG4gICAgcm9vdC5hcHBlbmRDaGlsZCh2aWV3KTtcblxuICAgIGNvbnN0IHRva2VuID0gTmV0d29ya01hbmFnZXIuSS5nZXRUb2tlbigpO1xuICAgIGlmICh0b2tlbikgUmVhbHRpbWVDbGllbnQuSS5jb25uZWN0KHRva2VuKTtcblxuICAgIFJlYWx0aW1lQ2xpZW50Lkkub24oJ3BsdW5kZXIuYXR0YWNrZWQnLCAobXNnKSA9PiB7XG4gICAgICBzaG93VG9hc3QoYFx1ODhBQlx1NjNBMFx1NTkzQVx1RkYxQVx1Njc2NVx1ODFFQSAke21zZy5hdHRhY2tlcn1cdUZGMENcdTYzNUZcdTU5MzEgJHttc2cubG9zc31gKTtcbiAgICAgIHRoaXMubG9nKGBcdTg4QUIgJHttc2cuYXR0YWNrZXJ9IFx1NjNBMFx1NTkzQVx1RkYwQ1x1NjM1Rlx1NTkzMSAke21zZy5sb3NzfWApO1xuICAgIH0pO1xuICAgIHRoaXMucmVzdWx0Qm94ID0gcXModmlldywgJyNyZXN1bHQnKTtcblxuICAgIGNvbnN0IGxpc3QgPSBxcyh2aWV3LCAnI2xpc3QnKTtcbiAgICBjb25zdCByZXZlbmdlTGlzdCA9IHFzKHZpZXcsICcjcmV2ZW5nZScpO1xuICAgIGNvbnN0IHJlZnJlc2hCdG4gPSBxczxIVE1MQnV0dG9uRWxlbWVudD4odmlldywgJyNyZWZyZXNoJyk7XG4gICAgY29uc3QgbW91bnRJY29ucyA9IChyb290RWw6IEVsZW1lbnQpID0+IHtcbiAgICAgIHJvb3RFbC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1pY29dJylcbiAgICAgICAgLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgICAgY29uc3QgbmFtZSA9IChlbCBhcyBIVE1MRWxlbWVudCkuZ2V0QXR0cmlidXRlKCdkYXRhLWljbycpIGFzIGFueTtcbiAgICAgICAgICB0cnkgeyBlbC5hcHBlbmRDaGlsZChyZW5kZXJJY29uKG5hbWUsIHsgc2l6ZTogMjAgfSkpOyB9IGNhdGNoIHt9XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgbW91bnRJY29ucyh2aWV3KTtcblxuICAgIGNvbnN0IGxvYWQgPSBhc3luYyAoKSA9PiB7XG4gICAgICByZWZyZXNoQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIHJlZnJlc2hCdG4uaW5uZXJIVE1MID0gJzxzcGFuIGRhdGEtaWNvPVwicmVmcmVzaFwiPjwvc3Bhbj5cdTUyMzdcdTY1QjBcdTRFMkRcdTIwMjYnO1xuICAgICAgbW91bnRJY29ucyhyZWZyZXNoQnRuKTtcbiAgICAgIGF3YWl0IGJhci51cGRhdGUoKTtcbiAgICAgIGxpc3QuaW5uZXJIVE1MID0gJyc7XG4gICAgICByZXZlbmdlTGlzdC5pbm5lckhUTUwgPSAnJztcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSBsaXN0LmFwcGVuZENoaWxkKGh0bWwoJzxkaXYgY2xhc3M9XCJza2VsZXRvblwiPjwvZGl2PicpKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IFtkYXRhLCByZXZlbmdlRGF0YV0gPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgICAgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgdGFyZ2V0czogYW55W10gfT4oJy9wbHVuZGVyL3RhcmdldHMnKSxcbiAgICAgICAgICBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyByZXZlbmdlczogYW55W10gfT4oJy9wbHVuZGVyL3JldmVuZ2UtbGlzdCcpLmNhdGNoKCgpID0+ICh7IHJldmVuZ2VzOiBbXSB9KSlcbiAgICAgICAgXSk7XG4gICAgICAgIFxuICAgICAgICAvLyBcdTZFMzJcdTY3RDNcdTU5MERcdTRFQzdcdTUyMTdcdTg4NjhcbiAgICAgICAgcmV2ZW5nZUxpc3QuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIGlmIChyZXZlbmdlRGF0YS5yZXZlbmdlcyAmJiByZXZlbmdlRGF0YS5yZXZlbmdlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgZm9yIChjb25zdCB0YXJnZXQgb2YgcmV2ZW5nZURhdGEucmV2ZW5nZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IHJvdyA9IGh0bWwoYFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibGlzdC1pdGVtIGxpc3QtaXRlbS0tc2VsbFwiIHN0eWxlPVwiYm9yZGVyLWNvbG9yOiNmZjVjNWM7XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cImRpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjJweDtcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo2cHg7Y29sb3I6I2ZmNWM1YztcIj48c3BhbiBkYXRhLWljbz1cInRhcmdldFwiPjwvc3Bhbj48c3Ryb25nPiR7dGFyZ2V0LnVzZXJuYW1lIHx8IHRhcmdldC5pZH08L3N0cm9uZz4gXHVEODNEXHVEQzc5IFx1NEVDN1x1NEVCQTwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cIm9wYWNpdHk6Ljg1O1wiPlx1NzdGRlx1NzdGM1x1RkYxQSR7dGFyZ2V0Lm9yZX0gPHNwYW4gY2xhc3M9XCJwaWxsXCI+XHU1OTBEXHU0RUM3XHU2M0EwXHU1OTNBXHU0RTBEXHU1M0Q3XHU1MUI3XHU1Mzc0XHU5NjUwXHU1MjM2PC9zcGFuPjwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1zZWxsXCIgZGF0YS1pZD1cIiR7dGFyZ2V0LmlkfVwiPjxzcGFuIGRhdGEtaWNvPVwic3dvcmRcIj48L3NwYW4+XHU1OTBEXHU0RUM3PC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgYCk7XG4gICAgICAgICAgICBtb3VudEljb25zKHJvdyk7XG4gICAgICAgICAgICByb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZXYpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgZWwgPSBldi50YXJnZXQgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XG4gICAgICAgICAgICAgIGNvbnN0IGlkID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWlkJyk7XG4gICAgICAgICAgICAgIGlmICghaWQpIHJldHVybjtcbiAgICAgICAgICAgICAgY29uc3QgYnRuID0gZWwuY2xvc2VzdCgnYnV0dG9uJykgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XG4gICAgICAgICAgICAgIGlmICghYnRuKSByZXR1cm47XG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICBidG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICBjb25zdCBvcmlnaW5hbEhUTUwgPSBidG4uaW5uZXJIVE1MO1xuICAgICAgICAgICAgICBidG4uaW5uZXJIVE1MID0gJzxzcGFuIGRhdGEtaWNvPVwic3dvcmRcIj48L3NwYW4+XHU1OTBEXHU0RUM3XHU0RTJEXHUyMDI2JztcbiAgICAgICAgICAgICAgbW91bnRJY29ucyhidG4pO1xuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgbGV0IHNob3VsZFJlZnJlc2ggPSBmYWxzZTtcbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyBzdWNjZXNzOiBib29sZWFuOyBsb290X2Ftb3VudDogbnVtYmVyIH0+KGAvcGx1bmRlci8ke2lkfWAsIHsgbWV0aG9kOiAnUE9TVCcgfSk7XG4gICAgICAgICAgICAgICAgaWYgKHJlcy5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLmxvZyhgXHU1OTBEXHU0RUM3XHU2MjEwXHU1MjlGXHVGRjBDXHU4M0I3XHU1Rjk3ICR7cmVzLmxvb3RfYW1vdW50fWApO1xuICAgICAgICAgICAgICAgICAgc2hvd1RvYXN0KGBcdTI2OTRcdUZFMEYgXHU1OTBEXHU0RUM3XHU2MjEwXHU1MjlGXHVGRjAxXHU4M0I3XHU1Rjk3ICR7cmVzLmxvb3RfYW1vdW50fSBcdTc3RkZcdTc3RjNgLCAnc3VjY2VzcycpO1xuICAgICAgICAgICAgICAgICAgc2hvdWxkUmVmcmVzaCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMubG9nKGBcdTU5MERcdTRFQzdcdTU5MzFcdThEMjVgKTtcbiAgICAgICAgICAgICAgICAgIHNob3dUb2FzdCgnXHU1OTBEXHU0RUM3XHU1OTMxXHU4RDI1JywgJ3dhcm4nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYXdhaXQgYmFyLnVwZGF0ZSgpO1xuICAgICAgICAgICAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gZT8ubWVzc2FnZSB8fCAnXHU1OTBEXHU0RUM3XHU1OTMxXHU4RDI1JztcbiAgICAgICAgICAgICAgICB0aGlzLmxvZyhgXHU1OTBEXHU0RUM3XHU1OTMxXHU4RDI1XHVGRjFBJHttZXNzYWdlfWApO1xuICAgICAgICAgICAgICAgIHNob3dUb2FzdChtZXNzYWdlLCAnZXJyb3InKTtcbiAgICAgICAgICAgICAgICBidG4uaW5uZXJIVE1MID0gb3JpZ2luYWxIVE1MO1xuICAgICAgICAgICAgICAgIG1vdW50SWNvbnMoYnRuKTtcbiAgICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICBidG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpZiAoc2hvdWxkUmVmcmVzaCkge1xuICAgICAgICAgICAgICAgICAgYXdhaXQgbG9hZCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXZlbmdlTGlzdC5hcHBlbmRDaGlsZChyb3cpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXZlbmdlTGlzdC5pbm5lckhUTUwgPSAnPGRpdiBzdHlsZT1cIm9wYWNpdHk6Ljg7dGV4dC1hbGlnbjpjZW50ZXI7cGFkZGluZzoxMHB4O1wiPlx1NjY4Mlx1NjVFMFx1NTNFRlx1NTkwRFx1NEVDN1x1NzY4NFx1NUJGOVx1OEM2MTwvZGl2Pic7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGxpc3QuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIGlmICghZGF0YS50YXJnZXRzLmxlbmd0aCkge1xuICAgICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQoaHRtbCgnPGRpdiBzdHlsZT1cIm9wYWNpdHk6Ljg7XCI+XHU2NjgyXHU2NUUwXHU1M0VGXHU2M0EwXHU1OTNBXHU3Njg0XHU3NkVFXHU2ODA3XHVGRjBDXHU3QTBEXHU1NDBFXHU1MThEXHU4QkQ1PC9kaXY+JykpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgdGFyZ2V0IG9mIGRhdGEudGFyZ2V0cykge1xuICAgICAgICAgIGNvbnN0IHJvdyA9IGh0bWwoYFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxpc3QtaXRlbSBsaXN0LWl0ZW0tLXNlbGxcIj5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cImRpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjJweDtcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NnB4O1wiPjxzcGFuIGRhdGEtaWNvPVwidGFyZ2V0XCI+PC9zcGFuPjxzdHJvbmc+JHt0YXJnZXQudXNlcm5hbWUgfHwgdGFyZ2V0LmlkfTwvc3Ryb25nPjwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJvcGFjaXR5Oi44NTtcIj5cdTc3RkZcdTc3RjNcdUZGMUEke3RhcmdldC5vcmV9IDxzcGFuIGNsYXNzPVwicGlsbFwiPlx1OTg4NFx1OEJBMVx1NjUzNlx1NzZDQSA1JX4zNSU8L3NwYW4+PC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLXNlbGwgcGx1bmRlci1idG5cIiBkYXRhLWlkPVwiJHt0YXJnZXQuaWR9XCI+PHNwYW4gY2xhc3M9XCJpY29uLXNsb3RcIj48L3NwYW4+XHU2M0EwXHU1OTNBPC9idXR0b24+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgYCk7XG4gICAgICAgICAgbW91bnRJY29ucyhyb3cpO1xuICAgICAgICAgIFxuICAgICAgICAgIC8vIFx1NkRGQlx1NTJBMFx1NTI1MVx1NkMxNFx1NTJBOFx1NzUzQlx1NTIzMFx1NjNBMFx1NTkzQVx1NjMwOVx1OTRBRVxuICAgICAgICAgIGNvbnN0IHBsdW5kZXJCdG4gPSByb3cucXVlcnlTZWxlY3RvcignLnBsdW5kZXItYnRuIC5pY29uLXNsb3QnKTtcbiAgICAgICAgICBpZiAocGx1bmRlckJ0bikge1xuICAgICAgICAgICAgcGx1bmRlckJ0bi5hcHBlbmRDaGlsZChjcmVhdGVTd29yZFNsYXNoKCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICByb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZXYpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVsID0gZXYudGFyZ2V0IGFzIEhUTUxCdXR0b25FbGVtZW50O1xuICAgICAgICAgICAgY29uc3QgaWQgPSBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnKTtcbiAgICAgICAgICAgIGlmICghaWQpIHJldHVybjtcbiAgICAgICAgICAgIGNvbnN0IGJ0biA9IGVsLmNsb3Nlc3QoJ2J1dHRvbicpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xuICAgICAgICAgICAgaWYgKCFidG4pIHJldHVybjtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgYnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbnN0IG9yaWdpbmFsSFRNTCA9IGJ0bi5pbm5lckhUTUw7XG4gICAgICAgICAgICBidG4uaW5uZXJIVE1MID0gJzxzcGFuIGRhdGEtaWNvPVwic3dvcmRcIj48L3NwYW4+XHU2M0EwXHU1OTNBXHU0RTJEXHUyMDI2JztcbiAgICAgICAgICAgIG1vdW50SWNvbnMoYnRuKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbGV0IHNob3VsZFJlZnJlc2ggPSBmYWxzZTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IHN1Y2Nlc3M6IGJvb2xlYW47IGxvb3RfYW1vdW50OiBudW1iZXIgfT4oYC9wbHVuZGVyLyR7aWR9YCwgeyBtZXRob2Q6ICdQT1NUJyB9KTtcbiAgICAgICAgICAgICAgaWYgKHJlcy5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2coYFx1NjIxMFx1NTI5Rlx1NjNBMFx1NTkzQSAke2lkfVx1RkYwQ1x1ODNCN1x1NUY5NyAke3Jlcy5sb290X2Ftb3VudH1gKTtcbiAgICAgICAgICAgICAgICBzaG93VG9hc3QoYFx1NjNBMFx1NTkzQVx1NjIxMFx1NTI5Rlx1RkYwQ1x1ODNCN1x1NUY5NyAke3Jlcy5sb290X2Ftb3VudH0gXHU3N0ZGXHU3N0YzYCwgJ3N1Y2Nlc3MnKTtcbiAgICAgICAgICAgICAgICBzaG91bGRSZWZyZXNoID0gdHJ1ZTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZyhgXHU2M0EwXHU1OTNBICR7aWR9IFx1NTkzMVx1OEQyNWApO1xuICAgICAgICAgICAgICAgIHNob3dUb2FzdCgnXHU2M0EwXHU1OTNBXHU1OTMxXHU4RDI1JywgJ3dhcm4nKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBhd2FpdCBiYXIudXBkYXRlKCk7XG4gICAgICAgICAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IGU/Lm1lc3NhZ2UgfHwgJ1x1NjNBMFx1NTkzQVx1NTkzMVx1OEQyNSc7XG4gICAgICAgICAgICAgIHRoaXMubG9nKGBcdTYzQTBcdTU5M0FcdTU5MzFcdThEMjVcdUZGMUEke21lc3NhZ2V9YCk7XG4gICAgICAgICAgICAgIGlmIChtZXNzYWdlLmluY2x1ZGVzKCdcdTUxQjdcdTUzNzQnKSkge1xuICAgICAgICAgICAgICAgIHNob3dUb2FzdChtZXNzYWdlLCAnd2FybicpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNob3dUb2FzdChtZXNzYWdlLCAnZXJyb3InKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAvLyBcdTU5MzFcdThEMjVcdTY1RjZcdTYwNjJcdTU5MERcdTYzMDlcdTk0QUVcbiAgICAgICAgICAgICAgYnRuLmlubmVySFRNTCA9IG9yaWdpbmFsSFRNTDtcbiAgICAgICAgICAgICAgbW91bnRJY29ucyhidG4pO1xuICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgYnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgIC8vIFx1NjIxMFx1NTI5Rlx1NTQwRVx1NTIzN1x1NjVCMFx1NTIxN1x1ODg2OFx1RkYwOFx1NEYxQVx1NjZGRlx1NjM2Mlx1NjMwOVx1OTRBRVx1RkYwOVxuICAgICAgICAgICAgICBpZiAoc2hvdWxkUmVmcmVzaCkge1xuICAgICAgICAgICAgICAgIGF3YWl0IGxvYWQoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQocm93KTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgIHNob3dUb2FzdChlPy5tZXNzYWdlIHx8ICdcdTUyQTBcdThGN0RcdTYzQTBcdTU5M0FcdTc2RUVcdTY4MDdcdTU5MzFcdThEMjUnLCAnZXJyb3InKTtcbiAgICAgICAgbGlzdC5pbm5lckhUTUwgPSAnPGRpdiBzdHlsZT1cIm9wYWNpdHk6Ljg7dGV4dC1hbGlnbjpjZW50ZXI7cGFkZGluZzoyMHB4O1wiPlx1NTJBMFx1OEY3RFx1NTkzMVx1OEQyNVx1RkYwQ1x1OEJGN1x1N0EwRFx1NTQwRVx1OTFDRFx1OEJENTwvZGl2Pic7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICByZWZyZXNoQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIHJlZnJlc2hCdG4uaW5uZXJIVE1MID0gJzxzcGFuIGRhdGEtaWNvPVwicmVmcmVzaFwiPjwvc3Bhbj5cdTUyMzdcdTY1QjAnO1xuICAgICAgICBtb3VudEljb25zKHJlZnJlc2hCdG4pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZWZyZXNoQnRuLm9uY2xpY2sgPSAoKSA9PiBsb2FkKCk7XG4gICAgbG9hZCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBsb2cobXNnOiBzdHJpbmcpIHtcbiAgICBpZiAoIXRoaXMucmVzdWx0Qm94KSByZXR1cm47XG4gICAgY29uc3QgbGluZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGxpbmUudGV4dENvbnRlbnQgPSBgWyR7bmV3IERhdGUoKS50b0xvY2FsZVRpbWVTdHJpbmcoKX1dICR7bXNnfWA7XG4gICAgdGhpcy5yZXN1bHRCb3gucHJlcGVuZChsaW5lKTtcbiAgfVxufVxuIiwgImltcG9ydCB7IE5ldHdvcmtNYW5hZ2VyIH0gZnJvbSAnLi4vY29yZS9OZXR3b3JrTWFuYWdlcic7XG5pbXBvcnQgeyBodG1sLCBxcyB9IGZyb20gJy4uL3V0aWxzL2RvbSc7XG5pbXBvcnQgeyByZW5kZXJOYXYgfSBmcm9tICcuLi9jb21wb25lbnRzL05hdic7XG5pbXBvcnQgeyBSZWFsdGltZUNsaWVudCB9IGZyb20gJy4uL2NvcmUvUmVhbHRpbWVDbGllbnQnO1xuaW1wb3J0IHsgR2FtZU1hbmFnZXIgfSBmcm9tICcuLi9jb3JlL0dhbWVNYW5hZ2VyJztcbmltcG9ydCB7IHNob3dUb2FzdCB9IGZyb20gJy4uL2NvbXBvbmVudHMvVG9hc3QnO1xuaW1wb3J0IHsgcmVuZGVyUmVzb3VyY2VCYXIgfSBmcm9tICcuLi9jb21wb25lbnRzL1Jlc291cmNlQmFyJztcbmltcG9ydCB7IHJlbmRlckljb24gfSBmcm9tICcuLi9jb21wb25lbnRzL0ljb24nO1xuaW1wb3J0IHsgY3JlYXRlU3Bpbm5pbmdDb2luIH0gZnJvbSAnLi4vY29tcG9uZW50cy9BbmltYXRlZEljb25zJztcblxudHlwZSBPcmRlciA9IHtcbiAgaWQ6IHN0cmluZztcbiAgdXNlcklkOiBzdHJpbmc7XG4gIHR5cGU6ICdidXknIHwgJ3NlbGwnO1xuICBpdGVtVGVtcGxhdGVJZD86IHN0cmluZztcbiAgaXRlbUluc3RhbmNlSWQ/OiBzdHJpbmc7XG4gIHByaWNlOiBudW1iZXI7XG4gIGFtb3VudDogbnVtYmVyO1xuICBjcmVhdGVkQXQ6IG51bWJlcjtcbn07XG5cbmV4cG9ydCBjbGFzcyBFeGNoYW5nZVNjZW5lIHtcbiAgcHJpdmF0ZSByZWZyZXNoVGltZXI6IG51bWJlciB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHRlbXBsYXRlczogeyBpZDogc3RyaW5nOyBuYW1lPzogc3RyaW5nOyBjYXRlZ29yeT86IHN0cmluZyB9W10gPSBbXTtcbiAgcHJpdmF0ZSBpbnZlbnRvcnk6IGFueVtdID0gW107XG5cbiAgYXN5bmMgbW91bnQocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICB0aGlzLmNsZWFyVGltZXIoKTtcbiAgICByb290LmlubmVySFRNTCA9ICcnO1xuXG4gICAgY29uc3QgbmF2ID0gcmVuZGVyTmF2KCdleGNoYW5nZScpO1xuICAgIGNvbnN0IGJhciA9IHJlbmRlclJlc291cmNlQmFyKCk7XG4gICAgY29uc3QgdmlldyA9IGh0bWwoYFxuICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lciBncmlkLTJcIiBzdHlsZT1cImNvbG9yOiNmZmY7XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkIGZhZGUtaW5cIj5cbiAgICAgICAgICA8aDMgc3R5bGU9XCJtYXJnaW46MCAwIDEycHg7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6OHB4O1wiPjxzcGFuIGRhdGEtaWNvPVwiZXhjaGFuZ2VcIj48L3NwYW4+XHU1RTAyXHU1NzNBXHU0RTBCXHU1MzU1IDxzcGFuIGlkPVwiY29pbkFuaW1cIj48L3NwYW4+PC9oMz5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCIgc3R5bGU9XCJmbGV4LXdyYXA6d3JhcDthbGlnbi1pdGVtczpmbGV4LWVuZDtnYXA6MTJweDtcIj5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJmbGV4OjE7bWluLXdpZHRoOjE4MHB4O1wiPlxuICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9XCJkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo2cHg7XCI+PHNwYW4gZGF0YS1pY289XCJsaXN0XCI+PC9zcGFuPlx1OEQyRFx1NEU3MFx1NkEyMVx1Njc3RjwvbGFiZWw+XG4gICAgICAgICAgICAgIDxzZWxlY3QgaWQ9XCJ0cGxcIiBjbGFzcz1cImlucHV0XCI+PC9zZWxlY3Q+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJmbGV4OjE7bWluLXdpZHRoOjEyMHB4O1wiPlxuICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9XCJkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo2cHg7XCI+PHNwYW4gZGF0YS1pY289XCJjb2luXCI+PC9zcGFuPlx1NEVGN1x1NjgzQyAoQkJcdTVFMDEpPC9sYWJlbD5cbiAgICAgICAgICAgICAgPGlucHV0IGlkPVwicHJpY2VcIiBjbGFzcz1cImlucHV0XCIgdHlwZT1cIm51bWJlclwiIG1pbj1cIjFcIiB2YWx1ZT1cIjEwXCIvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZmxleDoxO21pbi13aWR0aDoxMjBweDtcIj5cbiAgICAgICAgICAgICAgPGxhYmVsPlx1OEQyRFx1NEU3MFx1NjU3MFx1OTFDRjwvbGFiZWw+XG4gICAgICAgICAgICAgIDxpbnB1dCBpZD1cImFtb3VudFwiIGNsYXNzPVwiaW5wdXRcIiB0eXBlPVwibnVtYmVyXCIgbWluPVwiMVwiIHZhbHVlPVwiMVwiLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInBsYWNlQnV5XCIgY2xhc3M9XCJidG4gYnRuLWJ1eVwiIHN0eWxlPVwibWluLXdpZHRoOjEyMHB4O1wiPjxzcGFuIGRhdGEtaWNvPVwiYXJyb3ctcmlnaHRcIj48L3NwYW4+XHU0RTBCXHU0RTcwXHU1MzU1PC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBzdHlsZT1cImhlaWdodDo4cHg7XCI+PC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiIHN0eWxlPVwiZmxleC13cmFwOndyYXA7YWxpZ24taXRlbXM6ZmxleC1lbmQ7Z2FwOjEycHg7XCI+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZmxleDoxO21pbi13aWR0aDoyMjBweDtcIj5cbiAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVwiZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NnB4O1wiPjxzcGFuIGRhdGEtaWNvPVwiYm94XCI+PC9zcGFuPlx1NTFGQVx1NTUyRVx1OTA1M1x1NTE3NzwvbGFiZWw+XG4gICAgICAgICAgICAgIDxzZWxlY3QgaWQ9XCJpbnN0XCIgY2xhc3M9XCJpbnB1dFwiPjwvc2VsZWN0PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZmxleDoxO21pbi13aWR0aDoxMjBweDtcIj5cbiAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVwiZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NnB4O1wiPjxzcGFuIGRhdGEtaWNvPVwiY29pblwiPjwvc3Bhbj5cdTRFRjdcdTY4M0MgKEJCXHU1RTAxKTwvbGFiZWw+XG4gICAgICAgICAgICAgIDxpbnB1dCBpZD1cInNwcmljZVwiIGNsYXNzPVwiaW5wdXRcIiB0eXBlPVwibnVtYmVyXCIgbWluPVwiMVwiIHZhbHVlPVwiNVwiLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInBsYWNlU2VsbFwiIGNsYXNzPVwiYnRuIGJ0bi1zZWxsXCIgc3R5bGU9XCJtaW4td2lkdGg6MTIwcHg7XCI+PHNwYW4gZGF0YS1pY289XCJhcnJvdy1yaWdodFwiPjwvc3Bhbj5cdTRFMEJcdTUzNTZcdTUzNTU8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGlkPVwiaW52ZW50b3J5XCIgc3R5bGU9XCJtYXJnaW4tdG9wOjEycHg7ZGlzcGxheTpmbGV4O2ZsZXgtd3JhcDp3cmFwO2dhcDo4cHg7XCI+PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkIGZhZGUtaW5cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCIgc3R5bGU9XCJqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjEycHg7XCI+XG4gICAgICAgICAgICA8aDMgc3R5bGU9XCJtYXJnaW46MDtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo4cHg7XCI+PHNwYW4gZGF0YS1pY289XCJsaXN0XCI+PC9zcGFuPlx1OEJBMlx1NTM1NVx1N0MzRjwvaDM+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCIgc3R5bGU9XCJmbGV4LXdyYXA6d3JhcDtnYXA6OHB4O1wiPlxuICAgICAgICAgICAgICA8c2VsZWN0IGlkPVwicV90cGxcIiBjbGFzcz1cImlucHV0XCIgc3R5bGU9XCJ3aWR0aDoxODBweDtcIj48L3NlbGVjdD5cbiAgICAgICAgICAgICAgPHNlbGVjdCBpZD1cInFfdHlwZVwiIGNsYXNzPVwiaW5wdXRcIiBzdHlsZT1cIndpZHRoOjEyMHB4O1wiPlxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJidXlcIj5cdTRFNzBcdTUzNTU8L29wdGlvbj5cbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwic2VsbFwiPlx1NTM1Nlx1NTM1NTwvb3B0aW9uPlxuICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwicm93IHBpbGxcIiBzdHlsZT1cImFsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NnB4O1wiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGRhdGEtaWNvPVwidXNlclwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJteVwiIHR5cGU9XCJjaGVja2JveFwiLz4gXHU1M0VBXHU3NzBCXHU2MjExXHU3Njg0XG4gICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJyZWZyZXNoXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIiBzdHlsZT1cIm1pbi13aWR0aDo5NnB4O1wiPjxzcGFuIGRhdGEtaWNvPVwicmVmcmVzaFwiPjwvc3Bhbj5cdTUyMzdcdTY1QjA8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgaWQ9XCJib29rXCIgc3R5bGU9XCJtYXJnaW4tdG9wOjEycHg7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6OHB4O1wiPjwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZCBmYWRlLWluXCIgaWQ9XCJsb2dzXCIgc3R5bGU9XCJvcGFjaXR5Oi45O2ZvbnQtZmFtaWx5Om1vbm9zcGFjZTttaW4taGVpZ2h0OjI0cHg7XCI+PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICBgKTtcblxuICAgIHJvb3QuYXBwZW5kQ2hpbGQobmF2KTtcbiAgICByb290LmFwcGVuZENoaWxkKGJhci5yb290KTtcbiAgICByb290LmFwcGVuZENoaWxkKHZpZXcpO1xuXG4gICAgY29uc3QgdG9rZW4gPSBOZXR3b3JrTWFuYWdlci5JLmdldFRva2VuKCk7XG4gICAgaWYgKHRva2VuKSBSZWFsdGltZUNsaWVudC5JLmNvbm5lY3QodG9rZW4pO1xuICAgIGNvbnN0IG1lID0gR2FtZU1hbmFnZXIuSS5nZXRQcm9maWxlKCk7XG5cbiAgICBjb25zdCBib29rID0gcXModmlldywgJyNib29rJyk7XG4gICAgY29uc3QgbG9ncyA9IHFzPEhUTUxFbGVtZW50Pih2aWV3LCAnI2xvZ3MnKTtcbiAgICBjb25zdCBidXlUcGwgPSBxczxIVE1MU2VsZWN0RWxlbWVudD4odmlldywgJyN0cGwnKTtcbiAgICBjb25zdCBidXlQcmljZSA9IHFzPEhUTUxJbnB1dEVsZW1lbnQ+KHZpZXcsICcjcHJpY2UnKTtcbiAgICBjb25zdCBidXlBbW91bnQgPSBxczxIVE1MSW5wdXRFbGVtZW50Pih2aWV3LCAnI2Ftb3VudCcpO1xuICAgIGNvbnN0IHBsYWNlQnV5ID0gcXM8SFRNTEJ1dHRvbkVsZW1lbnQ+KHZpZXcsICcjcGxhY2VCdXknKTtcbiAgICBjb25zdCBzZWxsSW5zdCA9IHFzPEhUTUxTZWxlY3RFbGVtZW50Pih2aWV3LCAnI2luc3QnKTtcbiAgICBjb25zdCBzZWxsUHJpY2UgPSBxczxIVE1MSW5wdXRFbGVtZW50Pih2aWV3LCAnI3NwcmljZScpO1xuICAgIGNvbnN0IHBsYWNlU2VsbCA9IHFzPEhUTUxCdXR0b25FbGVtZW50Pih2aWV3LCAnI3BsYWNlU2VsbCcpO1xuICAgIGNvbnN0IGludkJveCA9IHFzPEhUTUxFbGVtZW50Pih2aWV3LCAnI2ludmVudG9yeScpO1xuICAgIGNvbnN0IHF1ZXJ5VHBsID0gcXM8SFRNTFNlbGVjdEVsZW1lbnQ+KHZpZXcsICcjcV90cGwnKTtcbiAgICBjb25zdCBxdWVyeVR5cGUgPSBxczxIVE1MU2VsZWN0RWxlbWVudD4odmlldywgJyNxX3R5cGUnKTtcbiAgICBjb25zdCBxdWVyeU1pbmVPbmx5ID0gcXM8SFRNTElucHV0RWxlbWVudD4odmlldywgJyNteScpO1xuICAgIGNvbnN0IG1pbmVPbmx5TGFiZWwgPSB2aWV3LnF1ZXJ5U2VsZWN0b3IoJ2xhYmVsLnJvdy5waWxsJykgYXMgSFRNTExhYmVsRWxlbWVudCB8IG51bGw7XG4gICAgY29uc3QgcmVmcmVzaEJ0biA9IHFzPEhUTUxCdXR0b25FbGVtZW50Pih2aWV3LCAnI3JlZnJlc2gnKTtcblxuICAgIGNvbnN0IG1vdW50SWNvbnMgPSAocm9vdEVsOiBFbGVtZW50KSA9PiB7XG4gICAgICByb290RWwucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtaWNvXScpXG4gICAgICAgIC5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICAgIGNvbnN0IG5hbWUgPSAoZWwgYXMgSFRNTEVsZW1lbnQpLmdldEF0dHJpYnV0ZSgnZGF0YS1pY28nKSBhcyBhbnk7XG4gICAgICAgICAgdHJ5IHsgZWwuYXBwZW5kQ2hpbGQocmVuZGVySWNvbihuYW1lLCB7IHNpemU6IDIwIH0pKTsgfSBjYXRjaCB7fVxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIG1vdW50SWNvbnModmlldyk7XG4gICAgXG4gICAgLy8gXHU2REZCXHU1MkEwXHU5MUQxXHU1RTAxXHU1MkE4XHU3NTNCXG4gICAgY29uc3QgY29pblNsb3QgPSB2aWV3LnF1ZXJ5U2VsZWN0b3IoJyNjb2luQW5pbScpO1xuICAgIGlmIChjb2luU2xvdCkge1xuICAgICAgY29pblNsb3QuYXBwZW5kQ2hpbGQoY3JlYXRlU3Bpbm5pbmdDb2luKCkpO1xuICAgIH1cblxuICAgIGxldCBwcmV2SWRzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgbGV0IHJlZnJlc2hpbmcgPSBmYWxzZTtcblxuICAgIGNvbnN0IGxvZyA9IChtZXNzYWdlOiBzdHJpbmcpID0+IHtcbiAgICAgIGxvZ3MudGV4dENvbnRlbnQgPSBtZXNzYWdlO1xuICAgIH07XG5cbiAgICBjb25zdCByZW5kZXJUZW1wbGF0ZU9wdGlvbnMgPSAoKSA9PiB7XG4gICAgICBidXlUcGwuaW5uZXJIVE1MID0gJyc7XG4gICAgICBxdWVyeVRwbC5pbm5lckhUTUwgPSAnJztcbiAgICAgIGNvbnN0IHBsYWNlaG9sZGVyID0gaHRtbCgnPG9wdGlvbiB2YWx1ZT1cIlwiPlx1OTAwOVx1NjJFOVx1NkEyMVx1Njc3Rjwvb3B0aW9uPicpIGFzIEhUTUxPcHRpb25FbGVtZW50O1xuICAgICAgYnV5VHBsLmFwcGVuZENoaWxkKHBsYWNlaG9sZGVyKTtcbiAgICAgIGNvbnN0IHFQbGFjZWhvbGRlciA9IGh0bWwoJzxvcHRpb24gdmFsdWU9XCJcIj5cdTUxNjhcdTkwRThcdTZBMjFcdTY3N0Y8L29wdGlvbj4nKSBhcyBIVE1MT3B0aW9uRWxlbWVudDtcbiAgICAgIHF1ZXJ5VHBsLmFwcGVuZENoaWxkKHFQbGFjZWhvbGRlcik7XG4gICAgICBmb3IgKGNvbnN0IHRwbCBvZiB0aGlzLnRlbXBsYXRlcykge1xuICAgICAgICBjb25zdCBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgICAgb3B0aW9uLnZhbHVlID0gdHBsLmlkO1xuICAgICAgICBvcHRpb24udGV4dENvbnRlbnQgPSB0cGwubmFtZSA/IGAke3RwbC5uYW1lfSAoJHt0cGwuaWR9KWAgOiB0cGwuaWQ7XG4gICAgICAgIGJ1eVRwbC5hcHBlbmRDaGlsZChvcHRpb24pO1xuICAgICAgICBjb25zdCBxT3B0aW9uID0gb3B0aW9uLmNsb25lTm9kZSh0cnVlKSBhcyBIVE1MT3B0aW9uRWxlbWVudDtcbiAgICAgICAgcXVlcnlUcGwuYXBwZW5kQ2hpbGQocU9wdGlvbik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IHJlbmRlckludmVudG9yeSA9ICgpID0+IHtcbiAgICAgIHNlbGxJbnN0LmlubmVySFRNTCA9ICcnO1xuICAgICAgaW52Qm94LmlubmVySFRNTCA9ICcnO1xuICAgICAgY29uc3QgZGVmYXVsdE9wdGlvbiA9IGh0bWwoJzxvcHRpb24gdmFsdWU9XCJcIj5cdTkwMDlcdTYyRTlcdTUzRUZcdTUxRkFcdTU1MkVcdTc2ODRcdTkwNTNcdTUxNzc8L29wdGlvbj4nKSBhcyBIVE1MT3B0aW9uRWxlbWVudDtcbiAgICAgIHNlbGxJbnN0LmFwcGVuZENoaWxkKGRlZmF1bHRPcHRpb24pO1xuICAgICAgY29uc3QgYXZhaWxhYmxlID0gdGhpcy5pbnZlbnRvcnkuZmlsdGVyKChpdGVtKSA9PiAhaXRlbS5pc0VxdWlwcGVkICYmICFpdGVtLmlzTGlzdGVkKTtcbiAgICAgIGlmICghYXZhaWxhYmxlLmxlbmd0aCkge1xuICAgICAgICBpbnZCb3gudGV4dENvbnRlbnQgPSAnXHU2NjgyXHU2NUUwXHU1M0VGXHU1MUZBXHU1NTJFXHU3Njg0XHU5MDUzXHU1MTc3XHVGRjA4XHU5NzAwXHU1MTQ4XHU1NzI4XHU0RUQzXHU1RTkzXHU1Mzc4XHU0RTBCXHU4OEM1XHU1OTA3XHVGRjA5JztcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGF2YWlsYWJsZSkge1xuICAgICAgICBjb25zdCBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgICAgb3B0aW9uLnZhbHVlID0gaXRlbS5pZDtcbiAgICAgICAgb3B0aW9uLnRleHRDb250ZW50ID0gYCR7aXRlbS5pZH0gXHUwMEI3ICR7aXRlbS50ZW1wbGF0ZUlkfSBcdTAwQjcgTHYuJHtpdGVtLmxldmVsfWA7XG4gICAgICAgIHNlbGxJbnN0LmFwcGVuZENoaWxkKG9wdGlvbik7XG5cbiAgICAgICAgY29uc3QgY2hpcCA9IGh0bWwoYDxidXR0b24gY2xhc3M9XCJidG4gYnRuLWdob3N0XCIgc3R5bGU9XCJmbGV4OnVuc2V0O3BhZGRpbmc6NnB4IDEwcHg7XCIgZGF0YS1pZD1cIiR7aXRlbS5pZH1cIj4ke2l0ZW0uaWR9ICgke2l0ZW0udGVtcGxhdGVJZH0pPC9idXR0b24+YCkgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XG4gICAgICAgIGNoaXAub25jbGljayA9ICgpID0+IHtcbiAgICAgICAgICBzZWxsSW5zdC52YWx1ZSA9IGl0ZW0uaWQ7XG4gICAgICAgICAgbG9nKGBcdTVERjJcdTkwMDlcdTYyRTlcdTUxRkFcdTU1MkVcdTkwNTNcdTUxNzcgJHtpdGVtLmlkfWApO1xuICAgICAgICB9O1xuICAgICAgICBpbnZCb3guYXBwZW5kQ2hpbGQoY2hpcCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IGxvYWRNZXRhZGF0YSA9IGFzeW5jICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IFt0cGxzLCBpdGVtc10gPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgICAgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgdGVtcGxhdGVzOiBhbnlbXSB9PignL2l0ZW1zL3RlbXBsYXRlcycpLFxuICAgICAgICAgIE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IGl0ZW1zOiBhbnlbXSB9PignL2l0ZW1zJyksXG4gICAgICAgIF0pO1xuICAgICAgICB0aGlzLnRlbXBsYXRlcyA9IHRwbHMudGVtcGxhdGVzIHx8IFtdO1xuICAgICAgICB0aGlzLmludmVudG9yeSA9IGl0ZW1zLml0ZW1zIHx8IFtdO1xuICAgICAgICByZW5kZXJUZW1wbGF0ZU9wdGlvbnMoKTtcbiAgICAgICAgcmVuZGVySW52ZW50b3J5KCk7XG4gICAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgICAgbG9nKGU/Lm1lc3NhZ2UgfHwgJ1x1NTJBMFx1OEY3RFx1NkEyMVx1Njc3Ri9cdTRFRDNcdTVFOTNcdTU5MzFcdThEMjUnKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgcmVmcmVzaCA9IGFzeW5jIChvcHRzOiB7IHF1aWV0PzogYm9vbGVhbiB9ID0ge30pID0+IHtcbiAgICAgIGlmIChyZWZyZXNoaW5nKSByZXR1cm47XG4gICAgICByZWZyZXNoaW5nID0gdHJ1ZTtcbiAgICAgIGlmICghb3B0cy5xdWlldCkgeyByZWZyZXNoQnRuLmlubmVySFRNTCA9ICc8c3BhbiBkYXRhLWljbz1cInJlZnJlc2hcIj48L3NwYW4+XHU1MjM3XHU2NUIwXHU0RTJEXHUyMDI2JzsgbW91bnRJY29ucyhyZWZyZXNoQnRuKTsgfVxuICAgICAgcmVmcmVzaEJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCB0cGxJZCA9IHF1ZXJ5VHBsLnZhbHVlO1xuICAgICAgICBjb25zdCB0eXBlID0gcXVlcnlUeXBlLnZhbHVlIGFzICdidXknIHwgJ3NlbGwnO1xuICAgICAgICBjb25zdCBtaW5lT25seSA9IHF1ZXJ5TWluZU9ubHkuY2hlY2tlZDtcbiAgICAgICAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcygpO1xuICAgICAgICBwYXJhbXMuc2V0KCd0eXBlJywgdHlwZSk7XG4gICAgICAgIHBhcmFtcy5zZXQoJ2l0ZW1fdGVtcGxhdGVfaWQnLCB0cGxJZCB8fCAnJyk7XG4gICAgICAgIGlmICghb3B0cy5xdWlldCkge1xuICAgICAgICAgIGJvb2suaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIGJvb2suYXBwZW5kQ2hpbGQoaHRtbCgnPGRpdiBjbGFzcz1cInNrZWxldG9uXCI+PC9kaXY+JykpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyBvcmRlcnM6IE9yZGVyW10gfT4oYC9leGNoYW5nZS9vcmRlcnM/JHtwYXJhbXMudG9TdHJpbmcoKX1gKTtcbiAgICAgICAgY29uc3QgbmV3SWRzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgICAgIGJvb2suaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIGNvbnN0IG9yZGVycyA9IGRhdGEub3JkZXJzIHx8IFtdO1xuICAgICAgICBpZiAoIW9yZGVycy5sZW5ndGgpIHtcbiAgICAgICAgICBib29rLmFwcGVuZENoaWxkKGh0bWwoJzxkaXYgc3R5bGU9XCJvcGFjaXR5Oi44O3RleHQtYWxpZ246Y2VudGVyO1wiPlx1NjY4Mlx1NjVFMFx1OEJBMlx1NTM1NTwvZGl2PicpKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IG9yZGVyIG9mIG9yZGVycykge1xuICAgICAgICAgIGlmIChtaW5lT25seSAmJiBtZSAmJiBvcmRlci51c2VySWQgIT09IG1lLmlkKSBjb250aW51ZTtcbiAgICAgICAgICBuZXdJZHMuYWRkKG9yZGVyLmlkKTtcbiAgICAgICAgICBjb25zdCBpc01pbmUgPSBtZSAmJiBvcmRlci51c2VySWQgPT09IG1lLmlkO1xuICAgICAgICAgIGNvbnN0IGtsYXNzID0gYGxpc3QtaXRlbSAke29yZGVyLnR5cGUgPT09ICdidXknID8gJ2xpc3QtaXRlbS0tYnV5JyA6ICdsaXN0LWl0ZW0tLXNlbGwnfWA7XG4gICAgICAgICAgY29uc3Qgcm93ID0gaHRtbChgXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiJHtrbGFzc31cIj5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cImRpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjJweDtcIj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgPHN0cm9uZz4ke29yZGVyLnR5cGUgPT09ICdidXknID8gJ1x1NEU3MFx1NTE2NScgOiAnXHU1MzU2XHU1MUZBJ308L3N0cm9uZz5cbiAgICAgICAgICAgICAgICAgICR7b3JkZXIuaXRlbVRlbXBsYXRlSWQgfHwgJyd9XG4gICAgICAgICAgICAgICAgICAke2lzTWluZSA/ICc8c3BhbiBjbGFzcz1cInBpbGxcIj5cdTYyMTFcdTc2ODQ8L3NwYW4+JyA6ICcnfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJvcGFjaXR5Oi44NTtcIj5cbiAgICAgICAgICAgICAgICAgIFx1NEVGN1x1NjgzQzogJHtvcmRlci5wcmljZX0gXHUwMEI3IFx1NjU3MFx1OTFDRjogJHtvcmRlci5hbW91bnR9XG4gICAgICAgICAgICAgICAgICAke29yZGVyLml0ZW1JbnN0YW5jZUlkID8gYDxzcGFuIGNsYXNzPVwicGlsbFwiPiR7b3JkZXIuaXRlbUluc3RhbmNlSWR9PC9zcGFuPmAgOiAnJ31cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicGlsbFwiPiR7b3JkZXIuaWR9PC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAke2lzTWluZSA/IGA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1naG9zdFwiIGRhdGEtaWQ9XCIke29yZGVyLmlkfVwiPjxzcGFuIGRhdGEtaWNvPVwidHJhc2hcIj48L3NwYW4+XHU2NEE0XHU1MzU1PC9idXR0b24+YCA6ICcnfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIGApO1xuICAgICAgICAgIG1vdW50SWNvbnMocm93KTtcbiAgICAgICAgICBpZiAoIXByZXZJZHMuaGFzKG9yZGVyLmlkKSkgcm93LmNsYXNzTGlzdC5hZGQoJ2ZsYXNoJyk7XG4gICAgICAgICAgcm93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKGV2KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBldi50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgICAgICBjb25zdCBpZCA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnKTtcbiAgICAgICAgICAgIGlmICghaWQpIHJldHVybjtcbiAgICAgICAgICAgIGNvbnN0IGJ0biA9IHRhcmdldC5jbG9zZXN0KCdidXR0b24nKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcbiAgICAgICAgICAgIGlmICghYnRuKSByZXR1cm47XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgICAgIGNvbnN0IG9yaWdpbmFsSFRNTCA9IGJ0bi5pbm5lckhUTUw7XG4gICAgICAgICAgICAgIGJ0bi5pbm5lckhUTUwgPSAnPHNwYW4gZGF0YS1pY289XCJ0cmFzaFwiPjwvc3Bhbj5cdTY0QTRcdTUzNTVcdTRFMkRcdTIwMjYnO1xuICAgICAgICAgICAgICBtb3VudEljb25zKGJ0bik7XG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3QoYC9leGNoYW5nZS9vcmRlcnMvJHtpZH1gLCB7IG1ldGhvZDogJ0RFTEVURScgfSk7XG4gICAgICAgICAgICAgIHNob3dUb2FzdCgnXHU2NEE0XHU1MzU1XHU2MjEwXHU1MjlGJywgJ3N1Y2Nlc3MnKTtcbiAgICAgICAgICAgICAgYXdhaXQgcmVmcmVzaCgpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgICAgICAgIHNob3dUb2FzdChlPy5tZXNzYWdlIHx8ICdcdTY0QTRcdTUzNTVcdTU5MzFcdThEMjUnLCAnZXJyb3InKTtcbiAgICAgICAgICAgICAgLy8gXHU1OTMxXHU4RDI1XHU2NUY2XHU5NzAwXHU4OTgxXHU2MDYyXHU1OTBEXHU2MzA5XHU5NEFFXHVGRjA4XHU1NkUwXHU0RTNBXHU0RTBEXHU0RjFBXHU1MjM3XHU2NUIwXHU1MjE3XHU4ODY4XHVGRjA5XG4gICAgICAgICAgICAgIGF3YWl0IHJlZnJlc2goKTtcbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgIGJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGJvb2suYXBwZW5kQ2hpbGQocm93KTtcbiAgICAgICAgfVxuICAgICAgICBwcmV2SWRzID0gbmV3SWRzO1xuICAgICAgICBpZiAoIWJvb2suY2hpbGRFbGVtZW50Q291bnQpIHtcbiAgICAgICAgICBib29rLmFwcGVuZENoaWxkKGh0bWwoJzxkaXYgc3R5bGU9XCJvcGFjaXR5Oi44O3RleHQtYWxpZ246Y2VudGVyO1wiPlx1NjY4Mlx1NjVFMFx1N0IyNlx1NTQwOFx1Njc2MVx1NEVGNlx1NzY4NFx1OEJBMlx1NTM1NTwvZGl2PicpKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgIGxvZyhlPy5tZXNzYWdlIHx8ICdcdTUyMzdcdTY1QjBcdThCQTJcdTUzNTVcdTU5MzFcdThEMjUnKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHJlZnJlc2hpbmcgPSBmYWxzZTtcbiAgICAgICAgcmVmcmVzaEJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICByZWZyZXNoQnRuLmlubmVySFRNTCA9ICc8c3BhbiBkYXRhLWljbz1cInJlZnJlc2hcIj48L3NwYW4+XHU1MjM3XHU2NUIwJztcbiAgICAgICAgbW91bnRJY29ucyhyZWZyZXNoQnRuKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcGxhY2VCdXkub25jbGljayA9IGFzeW5jICgpID0+IHtcbiAgICAgIGlmIChwbGFjZUJ1eS5kaXNhYmxlZCkgcmV0dXJuOyAvLyBcdTk2MzJcdTZCNjJcdTkxQ0RcdTU5MERcdTcwQjlcdTUxRkJcbiAgICAgIFxuICAgICAgY29uc3QgdHBsSWQgPSBidXlUcGwudmFsdWUudHJpbSgpO1xuICAgICAgY29uc3QgcHJpY2UgPSBOdW1iZXIoYnV5UHJpY2UudmFsdWUpO1xuICAgICAgY29uc3QgYW1vdW50ID0gTnVtYmVyKGJ1eUFtb3VudC52YWx1ZSk7XG4gICAgICBpZiAoIXRwbElkKSB7XG4gICAgICAgIHNob3dUb2FzdCgnXHU4QkY3XHU5MDA5XHU2MkU5XHU4RDJEXHU0RTcwXHU3Njg0XHU2QTIxXHU2NzdGJywgJ3dhcm4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGlzTmFOKHByaWNlKSB8fCBpc05hTihhbW91bnQpIHx8IHByaWNlIDw9IDAgfHwgYW1vdW50IDw9IDAgfHwgIU51bWJlci5pc0ludGVnZXIoYW1vdW50KSkge1xuICAgICAgICBzaG93VG9hc3QoJ1x1OEJGN1x1OEY5M1x1NTE2NVx1NjcwOVx1NjU0OFx1NzY4NFx1NEVGN1x1NjgzQ1x1NEUwRVx1NjU3MFx1OTFDRlx1RkYwOFx1NjU3MFx1OTFDRlx1NUZDNVx1OTg3Qlx1NEUzQVx1NjU3NFx1NjU3MFx1RkYwOScsICd3YXJuJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChwcmljZSA+IDEwMDAwMDAgfHwgYW1vdW50ID4gMTAwMDApIHtcbiAgICAgICAgc2hvd1RvYXN0KCdcdTY1NzBcdTUwM0NcdThGQzdcdTU5MjdcdUZGMENcdThCRjdcdThGOTNcdTUxNjVcdTU0MDhcdTc0MDZcdTc2ODRcdTRFRjdcdTY4M0NcdTU0OENcdTY1NzBcdTkxQ0YnLCAnd2FybicpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBwbGFjZUJ1eS5kaXNhYmxlZCA9IHRydWU7XG4gICAgICBjb25zdCBvcmlnaW5hbEJ1eUhUTUwgPSBwbGFjZUJ1eS5pbm5lckhUTUw7XG4gICAgICBwbGFjZUJ1eS5pbm5lckhUTUwgPSAnPHNwYW4gZGF0YS1pY289XCJhcnJvdy1yaWdodFwiPjwvc3Bhbj5cdTYzRDBcdTRFQTRcdTRFMkRcdTIwMjYnO1xuICAgICAgbW91bnRJY29ucyhwbGFjZUJ1eSk7XG4gICAgICBcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IGlkOiBzdHJpbmcgfT4oJy9leGNoYW5nZS9vcmRlcnMnLCB7XG4gICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyB0eXBlOiAnYnV5JywgaXRlbV90ZW1wbGF0ZV9pZDogdHBsSWQsIHByaWNlLCBhbW91bnQgfSksXG4gICAgICAgIH0pO1xuICAgICAgICBzaG93VG9hc3QoYFx1NEU3MFx1NTM1NVx1NURGMlx1NjNEMFx1NEVBNCAoIyR7cmVzLmlkfSlgLCAnc3VjY2VzcycpO1xuICAgICAgICBsb2coYFx1NEU3MFx1NTM1NVx1NjIxMFx1NTI5RjogJHtyZXMuaWR9YCk7XG4gICAgICAgIGF3YWl0IGJhci51cGRhdGUoKTtcbiAgICAgICAgYXdhaXQgcmVmcmVzaCgpO1xuICAgICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgIHNob3dUb2FzdChlPy5tZXNzYWdlIHx8ICdcdTRFNzBcdTUzNTVcdTYzRDBcdTRFQTRcdTU5MzFcdThEMjUnLCAnZXJyb3InKTtcbiAgICAgICAgbG9nKGU/Lm1lc3NhZ2UgfHwgJ1x1NEU3MFx1NTM1NVx1NjNEMFx1NEVBNFx1NTkzMVx1OEQyNScpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgcGxhY2VCdXkuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgcGxhY2VCdXkuaW5uZXJIVE1MID0gb3JpZ2luYWxCdXlIVE1MO1xuICAgICAgICBtb3VudEljb25zKHBsYWNlQnV5KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcGxhY2VTZWxsLm9uY2xpY2sgPSBhc3luYyAoKSA9PiB7XG4gICAgICBpZiAocGxhY2VTZWxsLmRpc2FibGVkKSByZXR1cm47IC8vIFx1OTYzMlx1NkI2Mlx1OTFDRFx1NTkwRFx1NzBCOVx1NTFGQlxuICAgICAgXG4gICAgICBjb25zdCBpbnN0SWQgPSBzZWxsSW5zdC52YWx1ZS50cmltKCk7XG4gICAgICBjb25zdCBwcmljZSA9IE51bWJlcihzZWxsUHJpY2UudmFsdWUpO1xuICAgICAgaWYgKCFpbnN0SWQpIHtcbiAgICAgICAgc2hvd1RvYXN0KCdcdThCRjdcdTkwMDlcdTYyRTlcdTg5ODFcdTUxRkFcdTU1MkVcdTc2ODRcdTkwNTNcdTUxNzcnLCAnd2FybicpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoaXNOYU4ocHJpY2UpIHx8IHByaWNlIDw9IDApIHtcbiAgICAgICAgc2hvd1RvYXN0KCdcdThCRjdcdThGOTNcdTUxNjVcdTY3MDlcdTY1NDhcdTc2ODRcdTRFRjdcdTY4M0MnLCAnd2FybicpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAocHJpY2UgPiAxMDAwMDAwKSB7XG4gICAgICAgIHNob3dUb2FzdCgnXHU0RUY3XHU2ODNDXHU4RkM3XHU5QUQ4XHVGRjBDXHU4QkY3XHU4RjkzXHU1MTY1XHU1NDA4XHU3NDA2XHU3Njg0XHU0RUY3XHU2ODNDJywgJ3dhcm4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcGxhY2VTZWxsLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIGNvbnN0IG9yaWdpbmFsU2VsbEhUTUwgPSBwbGFjZVNlbGwuaW5uZXJIVE1MO1xuICAgICAgcGxhY2VTZWxsLmlubmVySFRNTCA9ICc8c3BhbiBkYXRhLWljbz1cImFycm93LXJpZ2h0XCI+PC9zcGFuPlx1NjNEMFx1NEVBNFx1NEUyRFx1MjAyNic7XG4gICAgICBtb3VudEljb25zKHBsYWNlU2VsbCk7XG4gICAgICBcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IGlkOiBzdHJpbmcgfT4oJy9leGNoYW5nZS9vcmRlcnMnLCB7XG4gICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyB0eXBlOiAnc2VsbCcsIGl0ZW1faW5zdGFuY2VfaWQ6IGluc3RJZCwgcHJpY2UgfSksXG4gICAgICAgIH0pO1xuICAgICAgICBzaG93VG9hc3QoYFx1NTM1Nlx1NTM1NVx1NURGMlx1NjNEMFx1NEVBNCAoIyR7cmVzLmlkfSlgLCAnc3VjY2VzcycpO1xuICAgICAgICBsb2coYFx1NTM1Nlx1NTM1NVx1NjIxMFx1NTI5RjogJHtyZXMuaWR9YCk7XG4gICAgICAgIGF3YWl0IGJhci51cGRhdGUoKTtcbiAgICAgICAgYXdhaXQgbG9hZE1ldGFkYXRhKCk7XG4gICAgICAgIGF3YWl0IHJlZnJlc2goKTtcbiAgICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgICBzaG93VG9hc3QoZT8ubWVzc2FnZSB8fCAnXHU1MzU2XHU1MzU1XHU2M0QwXHU0RUE0XHU1OTMxXHU4RDI1JywgJ2Vycm9yJyk7XG4gICAgICAgIGxvZyhlPy5tZXNzYWdlIHx8ICdcdTUzNTZcdTUzNTVcdTYzRDBcdTRFQTRcdTU5MzFcdThEMjUnKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHBsYWNlU2VsbC5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICBwbGFjZVNlbGwuaW5uZXJIVE1MID0gb3JpZ2luYWxTZWxsSFRNTDtcbiAgICAgICAgbW91bnRJY29ucyhwbGFjZVNlbGwpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZWZyZXNoQnRuLm9uY2xpY2sgPSAoKSA9PiByZWZyZXNoKCk7XG4gICAgcXVlcnlUcGwub25jaGFuZ2UgPSAoKSA9PiByZWZyZXNoKCk7XG4gICAgcXVlcnlUeXBlLm9uY2hhbmdlID0gKCkgPT4gcmVmcmVzaCgpO1xuICAgIHF1ZXJ5TWluZU9ubHkub25jaGFuZ2UgPSAoKSA9PiB7IGlmIChtaW5lT25seUxhYmVsKSBtaW5lT25seUxhYmVsLmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScsIHF1ZXJ5TWluZU9ubHkuY2hlY2tlZCk7IHJlZnJlc2goKTsgfTtcbiAgICBpZiAobWluZU9ubHlMYWJlbCkgbWluZU9ubHlMYWJlbC5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnLCBxdWVyeU1pbmVPbmx5LmNoZWNrZWQpO1xuXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoW2Jhci51cGRhdGUoKSwgbG9hZE1ldGFkYXRhKCldKTtcbiAgICBhd2FpdCByZWZyZXNoKHsgcXVpZXQ6IHRydWUgfSk7XG4gICAgdGhpcy5yZWZyZXNoVGltZXIgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgcmVmcmVzaCh7IHF1aWV0OiB0cnVlIH0pLmNhdGNoKCgpID0+IHt9KTtcbiAgICB9LCAxMDAwMCk7XG4gIH1cblxuICBwcml2YXRlIGNsZWFyVGltZXIoKSB7XG4gICAgaWYgKHRoaXMucmVmcmVzaFRpbWVyICE9PSBudWxsKSB7XG4gICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aGlzLnJlZnJlc2hUaW1lcik7XG4gICAgICB0aGlzLnJlZnJlc2hUaW1lciA9IG51bGw7XG4gICAgfVxuICB9XG59XG4iLCAiaW1wb3J0IHsgTmV0d29ya01hbmFnZXIgfSBmcm9tICcuLi9jb3JlL05ldHdvcmtNYW5hZ2VyJztcbmltcG9ydCB7IGh0bWwsIHFzIH0gZnJvbSAnLi4vdXRpbHMvZG9tJztcbmltcG9ydCB7IHJlbmRlck5hdiB9IGZyb20gJy4uL2NvbXBvbmVudHMvTmF2JztcbmltcG9ydCB7IFJlYWx0aW1lQ2xpZW50IH0gZnJvbSAnLi4vY29yZS9SZWFsdGltZUNsaWVudCc7XG5pbXBvcnQgeyByZW5kZXJSZXNvdXJjZUJhciB9IGZyb20gJy4uL2NvbXBvbmVudHMvUmVzb3VyY2VCYXInO1xuaW1wb3J0IHsgcmVuZGVySWNvbiB9IGZyb20gJy4uL2NvbXBvbmVudHMvSWNvbic7XG5pbXBvcnQgeyBjcmVhdGVUcm9waHlBbmltYXRpb24gfSBmcm9tICcuLi9jb21wb25lbnRzL0FuaW1hdGVkSWNvbnMnO1xuXG5leHBvcnQgY2xhc3MgUmFua2luZ1NjZW5lIHtcbiAgbW91bnQocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICByb290LmlubmVySFRNTCA9ICcnO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQocmVuZGVyTmF2KCdyYW5raW5nJykpO1xuICAgIGNvbnN0IGJhciA9IHJlbmRlclJlc291cmNlQmFyKCk7XG4gICAgcm9vdC5hcHBlbmRDaGlsZChiYXIucm9vdCk7XG5cbiAgICBjb25zdCB2aWV3ID0gaHRtbChgXG4gICAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyIGdyaWQtMlwiIHN0eWxlPVwiY29sb3I6I2ZmZjtcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQgZmFkZS1pblwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIiBzdHlsZT1cImp1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2FsaWduLWl0ZW1zOmNlbnRlcjtcIj5cbiAgICAgICAgICAgIDxoMyBzdHlsZT1cIm1hcmdpbjowO2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjhweDtcIj48c3BhbiBkYXRhLWljbz1cInRyb3BoeVwiPjwvc3Bhbj5cdTYzOTJcdTg4NENcdTY5OUM8L2gzPlxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInJlZnJlc2hcIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiPjxzcGFuIGRhdGEtaWNvPVwicmVmcmVzaFwiPjwvc3Bhbj5cdTUyMzdcdTY1QjA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGlkPVwibWVcIiBzdHlsZT1cIm1hcmdpbi10b3A6OHB4O29wYWNpdHk6Ljk1O1wiPjwvZGl2PlxuICAgICAgICAgIDxkaXYgaWQ9XCJsaXN0XCIgc3R5bGU9XCJtYXJnaW4tdG9wOjEycHg7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6NnB4O1wiPjwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIGApO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQodmlldyk7XG5cbiAgICBjb25zdCB0b2tlbiA9IE5ldHdvcmtNYW5hZ2VyLkkuZ2V0VG9rZW4oKTtcbiAgICBpZiAodG9rZW4pIFJlYWx0aW1lQ2xpZW50LkkuY29ubmVjdCh0b2tlbik7XG5cbiAgICBjb25zdCBtZUJveCA9IHFzKHZpZXcsICcjbWUnKTtcbiAgICBjb25zdCBsaXN0ID0gcXModmlldywgJyNsaXN0Jyk7XG4gICAgY29uc3QgcmVmcmVzaEJ0biA9IHFzPEhUTUxCdXR0b25FbGVtZW50Pih2aWV3LCAnI3JlZnJlc2gnKTtcbiAgICBjb25zdCBtb3VudEljb25zID0gKHJvb3RFbDogRWxlbWVudCkgPT4ge1xuICAgICAgcm9vdEVsLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWljb10nKVxuICAgICAgICAuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgICBjb25zdCBuYW1lID0gKGVsIGFzIEhUTUxFbGVtZW50KS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWNvJykgYXMgYW55O1xuICAgICAgICAgIHRyeSB7IGVsLmFwcGVuZENoaWxkKHJlbmRlckljb24obmFtZSwgeyBzaXplOiAyMCB9KSk7IH0gY2F0Y2gge31cbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBtb3VudEljb25zKHZpZXcpO1xuXG4gICAgY29uc3QgbG9hZCA9IGFzeW5jICgpID0+IHtcbiAgICAgIHJlZnJlc2hCdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgcmVmcmVzaEJ0bi5pbm5lckhUTUwgPSAnPHNwYW4gZGF0YS1pY289XCJyZWZyZXNoXCI+PC9zcGFuPlx1NTIzN1x1NjVCMFx1NEUyRFx1MjAyNic7XG4gICAgICBtb3VudEljb25zKHJlZnJlc2hCdG4pO1xuICAgICAgYXdhaXQgYmFyLnVwZGF0ZSgpO1xuICAgICAgbGlzdC5pbm5lckhUTUwgPSAnJztcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSBsaXN0LmFwcGVuZENoaWxkKGh0bWwoJzxkaXYgY2xhc3M9XCJza2VsZXRvblwiPjwvZGl2PicpKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IG1lID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgcmFuazogbnVtYmVyOyBzY29yZTogbnVtYmVyIH0+KCcvcmFua2luZy9tZScpO1xuICAgICAgICBjb25zdCB0b3AgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyBsaXN0OiBhbnlbXSB9PignL3JhbmtpbmcvdG9wP249MjAnKTtcbiAgICAgICAgbWVCb3gudGV4dENvbnRlbnQgPSBgXHU2MjExXHU3Njg0XHU1NDBEXHU2QjIxXHVGRjFBIyR7bWUucmFua30gXHUwMEI3IFx1NjAzQlx1NUY5N1x1NTIwNlx1RkYxQSR7bWUuc2NvcmV9YDtcbiAgICAgICAgbGlzdC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgZm9yIChjb25zdCBlbnRyeSBvZiB0b3AubGlzdCkge1xuICAgICAgICAgIGNvbnN0IG1lZGFsID0gZW50cnkucmFuayA9PT0gMSA/ICdcdUQ4M0VcdURENDcnIDogZW50cnkucmFuayA9PT0gMiA/ICdcdUQ4M0VcdURENDgnIDogZW50cnkucmFuayA9PT0gMyA/ICdcdUQ4M0VcdURENDknIDogJyc7XG4gICAgICAgICAgY29uc3QgY2xzID0gZW50cnkucmFuayA8PSAzID8gJyBsaXN0LWl0ZW0tLWJ1eScgOiAnJztcbiAgICAgICAgICBjb25zdCByb3cgPSBodG1sKGBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsaXN0LWl0ZW0ke2Nsc31cIj5cbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9XCJkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo4cHg7XCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gaWQ9XCJ0cm9waHkke2VudHJ5LnJhbmt9XCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICR7bWVkYWx9ICMke2VudHJ5LnJhbmt9XG4gICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9XCJmbGV4OjE7b3BhY2l0eTouOTttYXJnaW4tbGVmdDoxMnB4O2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjZweDtcIj48c3BhbiBkYXRhLWljbz1cInVzZXJcIj48L3NwYW4+JHtlbnRyeS51c2VySWR9PC9zcGFuPlxuICAgICAgICAgICAgICA8c3Ryb25nPiR7ZW50cnkuc2NvcmV9PC9zdHJvbmc+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICBgKTtcbiAgICAgICAgICBtb3VudEljb25zKHJvdyk7XG4gICAgICAgICAgXG4gICAgICAgICAgLy8gXHU0RTNBXHU1MjREM1x1NTQwRFx1NkRGQlx1NTJBMFx1NTk1Nlx1Njc2Rlx1NTJBOFx1NzUzQlxuICAgICAgICAgIGlmIChlbnRyeS5yYW5rIDw9IDMpIHtcbiAgICAgICAgICAgIGNvbnN0IHRyb3BoeVNsb3QgPSByb3cucXVlcnlTZWxlY3RvcihgI3Ryb3BoeSR7ZW50cnkucmFua31gKTtcbiAgICAgICAgICAgIGlmICh0cm9waHlTbG90KSB7XG4gICAgICAgICAgICAgIHRyb3BoeVNsb3QuYXBwZW5kQ2hpbGQoY3JlYXRlVHJvcGh5QW5pbWF0aW9uKGVudHJ5LnJhbmspKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgbGlzdC5hcHBlbmRDaGlsZChyb3cpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgICAgbWVCb3gudGV4dENvbnRlbnQgPSBlPy5tZXNzYWdlIHx8ICdcdTYzOTJcdTg4NENcdTY5OUNcdTUyQTBcdThGN0RcdTU5MzFcdThEMjUnO1xuICAgICAgICBsaXN0LmlubmVySFRNTCA9ICc8ZGl2IHN0eWxlPVwib3BhY2l0eTouODt0ZXh0LWFsaWduOmNlbnRlcjtwYWRkaW5nOjIwcHg7XCI+XHU1MkEwXHU4RjdEXHU1OTMxXHU4RDI1XHVGRjBDXHU4QkY3XHU3QTBEXHU1NDBFXHU5MUNEXHU4QkQ1PC9kaXY+JztcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHJlZnJlc2hCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgcmVmcmVzaEJ0bi5pbm5lckhUTUwgPSAnPHNwYW4gZGF0YS1pY289XCJyZWZyZXNoXCI+PC9zcGFuPlx1NTIzN1x1NjVCMCc7XG4gICAgICAgIG1vdW50SWNvbnMocmVmcmVzaEJ0bik7XG4gICAgICB9XG4gICAgfTtcbiAgICByZWZyZXNoQnRuLm9uY2xpY2sgPSAoKSA9PiBsb2FkKCk7XG4gICAgbG9hZCgpO1xuICB9XG59XG4iLCAibGV0IGluamVjdGVkID0gZmFsc2U7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZW5zdXJlR2xvYmFsU3R5bGVzKCkge1xyXG4gIGlmIChpbmplY3RlZCkgcmV0dXJuO1xyXG4gIGNvbnN0IGNzcyA9IGA6cm9vdHstLWJnOiMwYjEwMjA7LS1iZy0yOiMwZjE1MzA7LS1mZzojZmZmOy0tbXV0ZWQ6cmdiYSgyNTUsMjU1LDI1NSwuNzUpOy0tZ3JhZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCM3QjJDRjUsIzJDODlGNSk7LS1wYW5lbC1ncmFkOmxpbmVhci1ncmFkaWVudCgxMzVkZWcscmdiYSgxMjMsNDQsMjQ1LC4yNSkscmdiYSg0NCwxMzcsMjQ1LC4yNSkpOy0tZ2xhc3M6Ymx1cigxMHB4KTstLWdsb3c6MCA4cHggMjBweCByZ2JhKDAsMCwwLC4zNSksMCAwIDEycHggcmdiYSgxMjMsNDQsMjQ1LC43KTstLXJhZGl1cy1zbToxMHB4Oy0tcmFkaXVzLW1kOjEycHg7LS1yYWRpdXMtbGc6MTZweDstLWVhc2U6Y3ViaWMtYmV6aWVyKC4yMiwuNjEsLjM2LDEpOy0tZHVyOi4yOHM7LS1idXk6IzJDODlGNTstLXNlbGw6I0UzNjQxNDstLW9rOiMyZWMyN2U7LS13YXJuOiNmNmM0NDU7LS1kYW5nZXI6I2ZmNWM1YzstLXJhcml0eS1jb21tb246IzlhYTBhNjstLXJhcml0eS1yYXJlOiM0ZmQ0ZjU7LS1yYXJpdHktZXBpYzojYjI2YmZmOy0tcmFyaXR5LWxlZ2VuZGFyeTojZjZjNDQ1Oy0tY29udGFpbmVyLW1heDo3MjBweH1cclxuaHRtbCxib2R5e2JhY2tncm91bmQ6cmFkaWFsLWdyYWRpZW50KDEyMDBweCA2MDBweCBhdCA1MCUgLTEwJSwgcmdiYSgxMjMsNDQsMjQ1LC4xMiksIHRyYW5zcGFyZW50KSx2YXIoLS1iZyk7Y29sb3I6dmFyKC0tZmcpO2ZvbnQtZmFtaWx5OnN5c3RlbS11aSwtYXBwbGUtc3lzdGVtLFwiU2Vnb2UgVUlcIixcIlBpbmdGYW5nIFNDXCIsXCJNaWNyb3NvZnQgWWFIZWlcIixBcmlhbCxzYW5zLXNlcmlmfVxyXG5odG1se2NvbG9yLXNjaGVtZTpkYXJrfVxyXG4uY29udGFpbmVye3BhZGRpbmc6MCAxMnB4fVxyXG4uY29udGFpbmVye21heC13aWR0aDp2YXIoLS1jb250YWluZXItbWF4KTttYXJnaW46MTJweCBhdXRvfVxyXG4uY2FyZHtwb3NpdGlvbjpyZWxhdGl2ZTtib3JkZXItcmFkaXVzOnZhcigtLXJhZGl1cy1sZyk7YmFja2dyb3VuZDp2YXIoLS1wYW5lbC1ncmFkKTtiYWNrZHJvcC1maWx0ZXI6dmFyKC0tZ2xhc3MpO2JveC1zaGFkb3c6dmFyKC0tZ2xvdyk7cGFkZGluZzoxMnB4O292ZXJmbG93OmhpZGRlbn1cclxuLmNhcmQ6aG92ZXJ7Ym94LXNoYWRvdzp2YXIoLS1nbG93KSwwIDAgMjRweCByZ2JhKDEyMyw0NCwyNDUsLjE1KX1cclxuLyogbmVvbiBjb3JuZXJzICsgc2hlZW4gKi9cclxuLmNhcmQ6OmJlZm9yZXtjb250ZW50OlwiXCI7cG9zaXRpb246YWJzb2x1dGU7aW5zZXQ6MDtib3JkZXItcmFkaXVzOmluaGVyaXQ7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoNDAlIDI1JSBhdCAxMDAlIDAsIHJnYmEoMTIzLDQ0LDI0NSwuMTgpLCB0cmFuc3BhcmVudCA2MCUpLHJhZGlhbC1ncmFkaWVudCgzNSUgMjUlIGF0IDAgMTAwJSwgcmdiYSg0NCwxMzcsMjQ1LC4xNiksIHRyYW5zcGFyZW50IDYwJSk7cG9pbnRlci1ldmVudHM6bm9uZX1cclxuLmNhcmQ6OmFmdGVye2NvbnRlbnQ6XCJcIjtwb3NpdGlvbjphYnNvbHV0ZTtsZWZ0Oi0zMCU7dG9wOi0xMjAlO3dpZHRoOjYwJTtoZWlnaHQ6MzAwJTtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMjBkZWcsdHJhbnNwYXJlbnQscmdiYSgyNTUsMjU1LDI1NSwuMTgpLHRyYW5zcGFyZW50KTt0cmFuc2Zvcm06cm90YXRlKDhkZWcpO29wYWNpdHk6LjI1O2FuaW1hdGlvbjpjYXJkLXNoZWVuIDlzIGxpbmVhciBpbmZpbml0ZTtwb2ludGVyLWV2ZW50czpub25lfVxyXG5Aa2V5ZnJhbWVzIGNhcmQtc2hlZW57MCV7dHJhbnNmb3JtOnRyYW5zbGF0ZVgoMCkgcm90YXRlKDhkZWcpfTEwMCV7dHJhbnNmb3JtOnRyYW5zbGF0ZVgoMTYwJSkgcm90YXRlKDhkZWcpfX1cclxuLnJvd3tkaXNwbGF5OmZsZXg7Z2FwOjhweDthbGlnbi1pdGVtczpjZW50ZXJ9XHJcbi5jYXJkIGlucHV0LC5jYXJkIGJ1dHRvbntib3gtc2l6aW5nOmJvcmRlci1ib3g7b3V0bGluZTpub25lfVxyXG4uY2FyZCBpbnB1dHtiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjA4KTtib3JkZXI6MDtib3JkZXItcmFkaXVzOnZhcigtLXJhZGl1cy1tZCk7Y29sb3I6dmFyKC0tZmcpO3BhZGRpbmc6MTBweDttYXJnaW46OHB4IDA7YXBwZWFyYW5jZTpub25lOy13ZWJraXQtYXBwZWFyYW5jZTpub25lO2JhY2tncm91bmQtY2xpcDpwYWRkaW5nLWJveDtwb2ludGVyLWV2ZW50czphdXRvO3RvdWNoLWFjdGlvbjptYW5pcHVsYXRpb259XHJcbi5jYXJkIHNlbGVjdC5pbnB1dCwgc2VsZWN0LmlucHV0e2JhY2tncm91bmQ6cmdiYSgyNTUsMjU1LDI1NSwuMDgpO2NvbG9yOnZhcigtLWZnKTtib3JkZXI6MDtib3JkZXItcmFkaXVzOnZhcigtLXJhZGl1cy1tZCk7cGFkZGluZzoxMHB4O21hcmdpbjo4cHggMDthcHBlYXJhbmNlOm5vbmU7LXdlYmtpdC1hcHBlYXJhbmNlOm5vbmU7YmFja2dyb3VuZC1jbGlwOnBhZGRpbmctYm94fVxyXG4uY2FyZCBzZWxlY3QuaW5wdXQgb3B0aW9uLCBzZWxlY3QuaW5wdXQgb3B0aW9ue2JhY2tncm91bmQ6IzBiMTAyMDtjb2xvcjojZmZmfVxyXG4uY2FyZCBzZWxlY3QuaW5wdXQ6Zm9jdXMsIHNlbGVjdC5pbnB1dDpmb2N1c3tvdXRsaW5lOjJweCBzb2xpZCByZ2JhKDEyMyw0NCwyNDUsLjQ1KX1cclxuLmNhcmQgYnV0dG9ue3dpZHRoOjEwMCU7Ym9yZGVyLXJhZGl1czp2YXIoLS1yYWRpdXMtbWQpfVxyXG4uYnRue3Bvc2l0aW9uOnJlbGF0aXZlO292ZXJmbG93OmhpZGRlbjtwYWRkaW5nOjEwcHggMTRweDtib3JkZXI6MDtib3JkZXItcmFkaXVzOnZhcigtLXJhZGl1cy1tZCk7Y29sb3I6I2ZmZjt0cmFuc2l0aW9uOnRyYW5zZm9ybSB2YXIoLS1kdXIpIHZhcigtLWVhc2UpLGJveC1zaGFkb3cgdmFyKC0tZHVyKSB2YXIoLS1lYXNlKSxmaWx0ZXIgdmFyKC0tZHVyKSB2YXIoLS1lYXNlKTtjdXJzb3I6cG9pbnRlcn1cclxuLmJ0biAuaWNvbnttYXJnaW4tcmlnaHQ6NnB4fVxyXG4uYnRuOmFjdGl2ZXt0cmFuc2Zvcm06dHJhbnNsYXRlWSgxcHgpIHNjYWxlKC45OSl9XHJcbi5idG46ZGlzYWJsZWR7b3BhY2l0eTouNTtjdXJzb3I6bm90LWFsbG93ZWQ7ZmlsdGVyOmdyYXlzY2FsZSgwLjMpfVxyXG4uYnRuOjphZnRlcntjb250ZW50OlwiXCI7cG9zaXRpb246YWJzb2x1dGU7aW5zZXQ6MDtvcGFjaXR5OjA7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTE1ZGVnLHRyYW5zcGFyZW50LHJnYmEoMjU1LDI1NSwyNTUsLjI1KSx0cmFuc3BhcmVudCA1NSUpO3RyYW5zZm9ybTp0cmFuc2xhdGVYKC02MCUpO3RyYW5zaXRpb246b3BhY2l0eSB2YXIoLS1kdXIpIHZhcigtLWVhc2UpLCB0cmFuc2Zvcm0gdmFyKC0tZHVyKSB2YXIoLS1lYXNlKTtwb2ludGVyLWV2ZW50czpub25lfVxyXG4uYnRuOmhvdmVyOjphZnRlcntvcGFjaXR5Oi45O3RyYW5zZm9ybTp0cmFuc2xhdGVYKDApfVxyXG4uYnRuOmhvdmVye2ZpbHRlcjpzYXR1cmF0ZSgxMTAlKX1cclxuLmJ0bi1wcmltYXJ5e2JhY2tncm91bmQ6dmFyKC0tZ3JhZCk7Ym94LXNoYWRvdzp2YXIoLS1nbG93KTtwb3NpdGlvbjpyZWxhdGl2ZX1cclxuLmJ0bi1wcmltYXJ5OjpiZWZvcmV7Y29udGVudDpcIlwiO3Bvc2l0aW9uOmFic29sdXRlO3RvcDowO2xlZnQ6LTEwMCU7d2lkdGg6MTAwJTtoZWlnaHQ6MTAwJTtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCg5MGRlZyx0cmFuc3BhcmVudCxyZ2JhKDI1NSwyNTUsMjU1LC4yKSx0cmFuc3BhcmVudCk7YW5pbWF0aW9uOmJ0bi1zaGltbWVyIDNzIGxpbmVhciBpbmZpbml0ZTtwb2ludGVyLWV2ZW50czpub25lfVxyXG5Aa2V5ZnJhbWVzIGJ0bi1zaGltbWVyezAle2xlZnQ6LTEwMCV9MTAwJXtsZWZ0OjIwMCV9fVxyXG4uYnRuLWVuZXJneXtwb3NpdGlvbjpyZWxhdGl2ZTthbmltYXRpb246YnRuLXB1bHNlIDJzIGVhc2UtaW4tb3V0IGluZmluaXRlfVxyXG4uYnRuLWVuZXJneTo6YmVmb3Jle2NvbnRlbnQ6XCJcIjtwb3NpdGlvbjphYnNvbHV0ZTtpbnNldDotMnB4O2JvcmRlci1yYWRpdXM6aW5oZXJpdDtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcscmdiYSgxMjMsNDQsMjQ1LC42KSxyZ2JhKDQ0LDEzNywyNDUsLjYpKTtmaWx0ZXI6Ymx1cig4cHgpO3otaW5kZXg6LTE7b3BhY2l0eTouNjthbmltYXRpb246ZW5lcmd5LXJpbmcgMnMgZWFzZS1pbi1vdXQgaW5maW5pdGU7cG9pbnRlci1ldmVudHM6bm9uZX1cclxuQGtleWZyYW1lcyBidG4tcHVsc2V7MCUsMTAwJXt0cmFuc2Zvcm06c2NhbGUoMSl9NTAle3RyYW5zZm9ybTpzY2FsZSgxLjAyKX19XHJcbkBrZXlmcmFtZXMgZW5lcmd5LXJpbmd7MCUsMTAwJXtvcGFjaXR5Oi40O2ZpbHRlcjpibHVyKDhweCl9NTAle29wYWNpdHk6Ljg7ZmlsdGVyOmJsdXIoMTJweCl9fVxyXG4uYnRuLWJ1eXtiYWNrZ3JvdW5kOnZhcigtLWJ1eSl9XHJcbi5idG4tc2VsbHtiYWNrZ3JvdW5kOnZhcigtLXNlbGwpfVxyXG4uYnRuLWdob3N0e2JhY2tncm91bmQ6cmdiYSgyNTUsMjU1LDI1NSwuMDgpfVxyXG4uaW5wdXR7d2lkdGg6MTAwJTtwYWRkaW5nOjEwcHg7Ym9yZGVyOjA7Ym9yZGVyLXJhZGl1czp2YXIoLS1yYWRpdXMtbWQpO2JhY2tncm91bmQ6cmdiYSgyNTUsMjU1LDI1NSwuMDgpO2NvbG9yOnZhcigtLWZnKTtwb2ludGVyLWV2ZW50czphdXRvO3RvdWNoLWFjdGlvbjptYW5pcHVsYXRpb247dXNlci1zZWxlY3Q6dGV4dDstd2Via2l0LXVzZXItc2VsZWN0OnRleHQ7dHJhbnNpdGlvbjphbGwgLjJzIGVhc2V9XHJcbi5pbnB1dDpmb2N1c3tiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjEyKTtib3gtc2hhZG93OjAgMCAwIDJweCByZ2JhKDEyMyw0NCwyNDUsLjQpO291dGxpbmU6bm9uZX1cclxuLnBpbGx7cGFkZGluZzoycHggOHB4O2JvcmRlci1yYWRpdXM6OTk5cHg7YmFja2dyb3VuZDpyZ2JhKDI1NSwyNTUsMjU1LC4wOCk7Zm9udC1zaXplOjEycHg7Y3Vyc29yOnBvaW50ZXI7dHJhbnNpdGlvbjpiYWNrZ3JvdW5kIC4zcyBlYXNlfVxyXG4ucGlsbC5waWxsLXJ1bm5pbmd7YW5pbWF0aW9uOnBpbGwtYnJlYXRoZSAycyBlYXNlLWluLW91dCBpbmZpbml0ZX1cclxuQGtleWZyYW1lcyBwaWxsLWJyZWF0aGV7MCUsMTAwJXtiYWNrZ3JvdW5kOnJnYmEoNDYsMTk0LDEyNiwuMjUpO2JveC1zaGFkb3c6MCAwIDhweCByZ2JhKDQ2LDE5NCwxMjYsLjMpfTUwJXtiYWNrZ3JvdW5kOnJnYmEoNDYsMTk0LDEyNiwuMzUpO2JveC1zaGFkb3c6MCAwIDEycHggcmdiYSg0NiwxOTQsMTI2LC41KX19XHJcbi5waWxsLnBpbGwtY29sbGFwc2Vke2FuaW1hdGlvbjpwaWxsLWFsZXJ0IDFzIGVhc2UtaW4tb3V0IGluZmluaXRlfVxyXG5Aa2V5ZnJhbWVzIHBpbGwtYWxlcnR7MCUsMTAwJXtiYWNrZ3JvdW5kOnJnYmEoMjU1LDkyLDkyLC4yNSk7Ym94LXNoYWRvdzowIDAgOHB4IHJnYmEoMjU1LDkyLDkyLC4zKX01MCV7YmFja2dyb3VuZDpyZ2JhKDI1NSw5Miw5MiwuNDUpO2JveC1zaGFkb3c6MCAwIDE2cHggcmdiYSgyNTUsOTIsOTIsLjYpfX1cclxuLnBpbGwuYWN0aXZle2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZywgcmdiYSgxMjMsNDQsMjQ1LC4zNSksIHJnYmEoNDQsMTM3LDI0NSwuMjgpKTtib3gtc2hhZG93OnZhcigtLWdsb3cpfVxyXG4uc2NlbmUtaGVhZGVye2Rpc3BsYXk6ZmxleDtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjthbGlnbi1pdGVtczpmbGV4LWVuZDtnYXA6MTJweDttYXJnaW4tYm90dG9tOjhweH1cclxuLnNjZW5lLWhlYWRlciBoMXttYXJnaW46MDtmb250LXNpemU6MjBweDtwb3NpdGlvbjpyZWxhdGl2ZTtkaXNwbGF5OmlubGluZS1ibG9ja31cclxuLnNjZW5lLWhlYWRlciBoMTo6YWZ0ZXJ7Y29udGVudDpcIlwiO3Bvc2l0aW9uOmFic29sdXRlO2xlZnQ6MDtib3R0b206LTJweDt3aWR0aDoxMDAlO2hlaWdodDoycHg7YmFja2dyb3VuZDp2YXIoLS1ncmFkKTtvcGFjaXR5Oi40O3BvaW50ZXItZXZlbnRzOm5vbmV9XHJcbi5zY2VuZS1oZWFkZXIgcHttYXJnaW46MDtvcGFjaXR5Oi44NX1cclxuLnN0YXRze2Rpc3BsYXk6ZmxleDtnYXA6MTBweH1cclxuLnN0YXR7ZmxleDoxO21pbi13aWR0aDowO2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDE4MGRlZyxyZ2JhKDI1NSwyNTUsMjU1LC4wNikscmdiYSgyNTUsMjU1LDI1NSwuMDMpKTtib3JkZXItcmFkaXVzOjEycHg7cGFkZGluZzoxMHB4O2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjEwcHg7cG9zaXRpb246cmVsYXRpdmU7b3ZlcmZsb3c6aGlkZGVufVxyXG4uc3RhdC1hbmltYXRlZDpob3ZlcntiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxODBkZWcscmdiYSgyNTUsMjU1LDI1NSwuMSkscmdiYSgyNTUsMjU1LDI1NSwuMDUpKTtib3gtc2hhZG93OjAgMCAxNnB4IHJnYmEoMTIzLDQ0LDI0NSwuMil9XHJcbi5zdGF0IC5pY297Zm9udC1zaXplOjE4cHg7ZmlsdGVyOmRyb3Atc2hhZG93KDAgMCA4cHggcmdiYSgxMjMsNDQsMjQ1LC4zNSkpO3RyYW5zaXRpb246dHJhbnNmb3JtIC4zcyBlYXNlfVxyXG4ucHVsc2UtaWNvbnthbmltYXRpb246aWNvbi1wdWxzZSAuNnMgZWFzZX1cclxuQGtleWZyYW1lcyBpY29uLXB1bHNlezAlLDEwMCV7dHJhbnNmb3JtOnNjYWxlKDEpfTUwJXt0cmFuc2Zvcm06c2NhbGUoMS4zKSByb3RhdGUoNWRlZyl9fVxyXG4uc3RhdCAudmFse2ZvbnQtd2VpZ2h0OjcwMDtmb250LXNpemU6MTZweH1cclxuLnN0YXQgLmxhYmVse29wYWNpdHk6Ljg1O2ZvbnQtc2l6ZToxMnB4fVxyXG4uZXZlbnQtZmVlZHttYXgtaGVpZ2h0OjI0MHB4O292ZXJmbG93OmF1dG87ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6NnB4O3Bvc2l0aW9uOnJlbGF0aXZlfVxyXG4uZXZlbnQtZmVlZDo6YmVmb3Jle2NvbnRlbnQ6XCJcIjtwb3NpdGlvbjphYnNvbHV0ZTt0b3A6MDtsZWZ0OjA7cmlnaHQ6MDtoZWlnaHQ6MjBweDtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxODBkZWcscmdiYSgxMiwyMCw0NCwuNTUpLHRyYW5zcGFyZW50KTtwb2ludGVyLWV2ZW50czpub25lO3otaW5kZXg6MX1cclxuLmV2ZW50LWZlZWQ6OmFmdGVye2NvbnRlbnQ6XCJcIjtwb3NpdGlvbjphYnNvbHV0ZTtib3R0b206MDtsZWZ0OjA7cmlnaHQ6MDtoZWlnaHQ6MjBweDtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgwZGVnLHJnYmEoMTIsMjAsNDQsLjU1KSx0cmFuc3BhcmVudCk7cG9pbnRlci1ldmVudHM6bm9uZTt6LWluZGV4OjF9XHJcbi5ldmVudC1mZWVkIC5ldmVudHtvcGFjaXR5Oi45O2ZvbnQtZmFtaWx5Om1vbm9zcGFjZTtmb250LXNpemU6MTJweDtwb3NpdGlvbjpyZWxhdGl2ZX1cclxuLm1haW4tc2NyZWVue3Bvc2l0aW9uOnJlbGF0aXZlO3BhZGRpbmc6MTJweCAwIDM2cHg7bWluLWhlaWdodDoxMDB2aH1cclxuLm1haW4tc3RhY2t7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6MTZweH1cclxuLm1pbmUtY2FyZHttaW4taGVpZ2h0OmNhbGMoMTAwdmggLSAxNjBweCk7cGFkZGluZzoyNHB4IDIwcHg7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6MjBweDtib3JkZXItcmFkaXVzOjIwcHh9XHJcbkBtZWRpYSAobWluLXdpZHRoOjU4MHB4KXsubWluZS1jYXJke21pbi1oZWlnaHQ6NjIwcHg7cGFkZGluZzoyOHB4IDI2cHh9fVxyXG4ubWluZS1oZWFkZXJ7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjtnYXA6MTJweH1cclxuLm1pbmUtdGl0bGV7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6MTBweDtmb250LXNpemU6MThweDtmb250LXdlaWdodDo2MDA7bGV0dGVyLXNwYWNpbmc6LjA0ZW07dGV4dC1zaGFkb3c6MCAycHggMTJweCByZ2JhKDE4LDEwLDQ4LC42KTtwb3NpdGlvbjpyZWxhdGl2ZX1cclxuLm1pbmUtdGl0bGU6OmFmdGVye2NvbnRlbnQ6XCJcIjtwb3NpdGlvbjphYnNvbHV0ZTtsZWZ0OjA7Ym90dG9tOi00cHg7d2lkdGg6MTAwJTtoZWlnaHQ6MnB4O2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDkwZGVnLHRyYW5zcGFyZW50LHJnYmEoMTIzLDQ0LDI0NSwuNiksdHJhbnNwYXJlbnQpO29wYWNpdHk6LjU7YW5pbWF0aW9uOnRpdGxlLWdsb3cgM3MgZWFzZS1pbi1vdXQgaW5maW5pdGV9XHJcbkBrZXlmcmFtZXMgdGl0bGUtZ2xvd3swJSwxMDAle29wYWNpdHk6LjM7dHJhbnNmb3JtOnNjYWxlWCguOCl9NTAle29wYWNpdHk6Ljc7dHJhbnNmb3JtOnNjYWxlWCgxKX19XHJcbi5taW5lLXRpdGxlIC5pY29ue2ZpbHRlcjpkcm9wLXNoYWRvdygwIDAgMTJweCByZ2JhKDEyNCw2MCwyNTUsLjU1KSl9XHJcbi5taW5lLWNoaXBze2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjhweH1cclxuLm1pbmUtY2hpcHMgLnBpbGx7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NnB4O2ZvbnQtc2l6ZToxMnB4O2JhY2tncm91bmQ6cmdiYSgxNSwyNCw1NiwuNTUpO2JveC1zaGFkb3c6aW5zZXQgMCAwIDAgMXB4IHJnYmEoMTIzLDQ0LDI0NSwuMjUpfVxyXG4ubWluZS1ncmlke2Rpc3BsYXk6Z3JpZDtnYXA6MThweH1cclxuQG1lZGlhIChtaW4td2lkdGg6NjQwcHgpey5taW5lLWdyaWR7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOjIyMHB4IDFmcjthbGlnbi1pdGVtczpjZW50ZXJ9fVxyXG4ubWluZS1nYXVnZXtwb3NpdGlvbjpyZWxhdGl2ZTtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpjZW50ZXI7cGFkZGluZzo4cHggMH1cclxuLm1pbmUtcHJvZ3Jlc3N7cG9zaXRpb246cmVsYXRpdmU7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6MTRweH1cclxuLm1pbmUtcHJvZ3Jlc3MgLm1pbmVyLWNoYXItd3JhcHBlcntwb3NpdGlvbjphYnNvbHV0ZTt0b3A6LTE0MHB4O2xlZnQ6MTIwcHg7ei1pbmRleDo1O3BvaW50ZXItZXZlbnRzOm5vbmU7dHJhbnNmb3JtOnNjYWxlKDEuNSl9XHJcbi5taW5lLWdhdWdlIC5yaW5ne3dpZHRoOjIwMHB4O2hlaWdodDoyMDBweDtib3JkZXItcmFkaXVzOjUwJTtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpjZW50ZXI7YmFja2dyb3VuZDpjb25pYy1ncmFkaWVudCgjN0IyQ0Y1IDBkZWcscmdiYSgyNTUsMjU1LDI1NSwuMDgpIDBkZWcpO2JveC1zaGFkb3c6aW5zZXQgMCAwIDMwcHggcmdiYSgxMjMsNDQsMjQ1LC4yOCksMCAyNHB4IDQ4cHggcmdiYSgxMiw4LDQyLC41NSl9XHJcbi5taW5lLWdhdWdlIC5yaW5nOjpiZWZvcmV7Y29udGVudDpcIlwiO3Bvc2l0aW9uOmFic29sdXRlO2luc2V0OjE4JTtib3JkZXItcmFkaXVzOjUwJTtiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudChjaXJjbGUgYXQgNTAlIDI4JSxyZ2JhKDEyMyw0NCwyNDUsLjQ1KSxyZ2JhKDEyLDIwLDQ2LC45MikgNzAlKTtib3gtc2hhZG93Omluc2V0IDAgMTRweCAyOHB4IHJnYmEoMCwwLDAsLjQ4KTtwb2ludGVyLWV2ZW50czpub25lfVxyXG4ubWluZS1nYXVnZSAucmluZy1jb3Jle3Bvc2l0aW9uOnJlbGF0aXZlO2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo0cHg7Zm9udC13ZWlnaHQ6NjAwfVxyXG4ubWluZS1nYXVnZSAucmluZy1jb3JlIHNwYW57Zm9udC1zaXplOjIycHh9XHJcbi5taW5lLWdhdWdlIC5yaW5nLWNvcmUgc21hbGx7Zm9udC1zaXplOjEycHg7bGV0dGVyLXNwYWNpbmc6LjEyZW07b3BhY2l0eTouNzU7dGV4dC10cmFuc2Zvcm06dXBwZXJjYXNlfVxyXG4ucmluZy1nbG93e3Bvc2l0aW9uOmFic29sdXRlO3dpZHRoOjIwMHB4O2hlaWdodDoyMDBweDtib3JkZXItcmFkaXVzOjUwJTtmaWx0ZXI6Ymx1cigzMnB4KTtiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudChjaXJjbGUscmdiYSgxMjMsNDQsMjQ1LC40OCkscmdiYSg0NCwxMzcsMjQ1LC4xKSk7b3BhY2l0eTouNjthbmltYXRpb246bWluZS1nbG93IDlzIGVhc2UtaW4tb3V0IGluZmluaXRlfVxyXG4ucmluZy1nbG93LWJ7YW5pbWF0aW9uLWRlbGF5Oi00LjVzO2JhY2tncm91bmQ6cmFkaWFsLWdyYWRpZW50KGNpcmNsZSxyZ2JhKDQ0LDEzNywyNDUsLjQ1KSx0cmFuc3BhcmVudCA2NSUpfVxyXG4ucmluZy1wdWxzZXthbmltYXRpb246cmluZy1mbGFzaCAuNnMgZWFzZSFpbXBvcnRhbnR9XHJcbkBrZXlmcmFtZXMgcmluZy1mbGFzaHswJSwxMDAle2JveC1zaGFkb3c6aW5zZXQgMCAwIDMwcHggcmdiYSgxMjMsNDQsMjQ1LC4yOCksMCAyNHB4IDQ4cHggcmdiYSgxMiw4LDQyLC41NSl9NTAle2JveC1zaGFkb3c6aW5zZXQgMCAwIDUwcHggcmdiYSgyNDYsMTk2LDY5LC44KSwwIDI0cHggNjhweCByZ2JhKDI0NiwxOTYsNjksLjUpLDAgMCA4MHB4IHJnYmEoMjQ2LDE5Niw2OSwuNCl9fVxyXG4ucmluZy1mdWxse2FuaW1hdGlvbjpyaW5nLWdsb3ctZnVsbCAycyBlYXNlLWluLW91dCBpbmZpbml0ZSFpbXBvcnRhbnR9XHJcbkBrZXlmcmFtZXMgcmluZy1nbG93LWZ1bGx7MCUsMTAwJXtib3gtc2hhZG93Omluc2V0IDAgMCA0MHB4IHJnYmEoMjQ2LDE5Niw2OSwuNSksMCAyNHB4IDQ4cHggcmdiYSgyNDYsMTk2LDY5LC4zNSksMCAwIDYwcHggcmdiYSgyNDYsMTk2LDY5LC4zKX01MCV7Ym94LXNoYWRvdzppbnNldCAwIDAgNjBweCByZ2JhKDI0NiwxOTYsNjksLjcpLDAgMjRweCA2OHB4IHJnYmEoMjQ2LDE5Niw2OSwuNSksMCAwIDgwcHggcmdiYSgyNDYsMTk2LDY5LC41KX19XHJcbi5taWxlc3RvbmUtcHVsc2V7YW5pbWF0aW9uOm1pbGVzdG9uZS1yaW5nIDFzIGVhc2V9XHJcbkBrZXlmcmFtZXMgbWlsZXN0b25lLXJpbmd7MCV7dHJhbnNmb3JtOnNjYWxlKDEpfTMwJXt0cmFuc2Zvcm06c2NhbGUoMS4wOCl9NjAle3RyYW5zZm9ybTpzY2FsZSguOTgpfTEwMCV7dHJhbnNmb3JtOnNjYWxlKDEpfX1cclxuQGtleWZyYW1lcyBtaW5lLWdsb3d7MCUsMTAwJXt0cmFuc2Zvcm06c2NhbGUoLjkyKTtvcGFjaXR5Oi40NX01MCV7dHJhbnNmb3JtOnNjYWxlKDEuMDUpO29wYWNpdHk6Ljh9fVxyXG4ubWluZS1wcm9ncmVzcy1tZXRhe2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpmbGV4LWVuZDtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2Vlbjtmb250LXNpemU6MTRweDtsZXR0ZXItc3BhY2luZzouMDJlbX1cclxuLm1pbmUtcHJvZ3Jlc3MtdHJhY2t7cG9zaXRpb246cmVsYXRpdmU7aGVpZ2h0OjEycHg7Ym9yZGVyLXJhZGl1czo5OTlweDtiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjEpO292ZXJmbG93OmhpZGRlbjtib3gtc2hhZG93Omluc2V0IDAgMCAxNHB4IHJnYmEoMTIzLDQ0LDI0NSwuMjgpfVxyXG4ubWluZS1wcm9ncmVzcy1maWxse2hlaWdodDoxMDAlO3dpZHRoOjA7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoOTBkZWcsIzdCMkNGNSwjMkM4OUY1KTtib3gtc2hhZG93OjAgMCAxNnB4IHJnYmEoMTIzLDQ0LDI0NSwuNjUpO3RyYW5zaXRpb246d2lkdGggLjM1cyB2YXIoLS1lYXNlKTtwb3NpdGlvbjpyZWxhdGl2ZTtvdmVyZmxvdzpoaWRkZW59XHJcbi5taW5lLXByb2dyZXNzLWZpbGw6OmFmdGVye2NvbnRlbnQ6XCJcIjtwb3NpdGlvbjphYnNvbHV0ZTt0b3A6MDtsZWZ0Oi0xMDAlO3dpZHRoOjEwMCU7aGVpZ2h0OjEwMCU7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoOTBkZWcsdHJhbnNwYXJlbnQscmdiYSgyNTUsMjU1LDI1NSwuMyksdHJhbnNwYXJlbnQpO2FuaW1hdGlvbjpwcm9ncmVzcy13YXZlIDJzIGxpbmVhciBpbmZpbml0ZTtwb2ludGVyLWV2ZW50czpub25lfVxyXG5Aa2V5ZnJhbWVzIHByb2dyZXNzLXdhdmV7MCV7bGVmdDotMTAwJX0xMDAle2xlZnQ6MjAwJX19XHJcbi5taW5lLXN0YXR1c3ttaW4taGVpZ2h0OjIycHg7Zm9udC1zaXplOjEzcHg7b3BhY2l0eTouOX1cclxuLm1pbmUtYWN0aW9ucy1ncmlke2Rpc3BsYXk6Z3JpZDtnYXA6MTJweDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6cmVwZWF0KDIsbWlubWF4KDAsMWZyKSl9XHJcbi5taW5lLWFjdGlvbnMtZ3JpZCAuYnRue2hlaWdodDo0OHB4O2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OmNlbnRlcjtmb250LXNpemU6MTVweDtnYXA6OHB4fVxyXG4ubWluZS1hY3Rpb25zLWdyaWQgLnNwYW4tMntncmlkLWNvbHVtbjpzcGFuIDJ9XHJcbkBtZWRpYSAobWluLXdpZHRoOjY4MHB4KXsubWluZS1hY3Rpb25zLWdyaWR7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOnJlcGVhdCgzLG1pbm1heCgwLDFmcikpfS5taW5lLWFjdGlvbnMtZ3JpZCAuc3Bhbi0ye2dyaWQtY29sdW1uOnNwYW4gM319XHJcbi5taW5lLWZlZWR7cG9zaXRpb246cmVsYXRpdmU7Ym9yZGVyLXJhZGl1czoxNnB4O2JhY2tncm91bmQ6cmdiYSgxMiwyMCw0NCwuNTUpO3BhZGRpbmc6MTRweCAxMnB4O2JveC1zaGFkb3c6aW5zZXQgMCAwIDI0cHggcmdiYSgxMjMsNDQsMjQ1LC4xMik7YmFja2Ryb3AtZmlsdGVyOmJsdXIoMTJweCl9XHJcbi5taW5lLWZlZWQ6OmJlZm9yZXtjb250ZW50OlwiXCI7cG9zaXRpb246YWJzb2x1dGU7aW5zZXQ6MDtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcscmdiYSgxMjMsNDQsMjQ1LC4xNikscmdiYSg0NCwxMzcsMjQ1LC4xNCkgNjAlLHRyYW5zcGFyZW50KTtvcGFjaXR5Oi43NTtwb2ludGVyLWV2ZW50czpub25lfVxyXG4ubWluZS1mZWVkIC5ldmVudC1mZWVke21heC1oZWlnaHQ6MTgwcHh9XHJcbi5ldmVudHt0cmFuc2l0aW9uOm9wYWNpdHkgLjNzIGVhc2UsIHRyYW5zZm9ybSAuM3MgZWFzZX1cclxuLmV2ZW50LWNyaXRpY2Fse2NvbG9yOiNmNmM0NDU7Zm9udC13ZWlnaHQ6NjAwfVxyXG4uZXZlbnQtd2FybmluZ3tjb2xvcjojZmY1YzVjfVxyXG4uZXZlbnQtc3VjY2Vzc3tjb2xvcjojMmVjMjdlfVxyXG4uZXZlbnQtbm9ybWFse2NvbG9yOnJnYmEoMjU1LDI1NSwyNTUsLjkpfVxyXG4ubWluZS1ob2xvZ3JhbXtwb3NpdGlvbjpyZWxhdGl2ZTtmbGV4OjE7bWluLWhlaWdodDoxODBweDtib3JkZXItcmFkaXVzOjE4cHg7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoOTAlIDEyMCUgYXQgNTAlIDEwMCUscmdiYSg0NCwxMzcsMjQ1LC4zNSkscmdiYSg4LDEyLDMwLC4zKSA1NSUsdHJhbnNwYXJlbnQpO292ZXJmbG93OmhpZGRlbjttYXJnaW4tdG9wOmF1dG87ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO2lzb2xhdGlvbjppc29sYXRlO3RyYW5zaXRpb246YmFja2dyb3VuZCAuNXMgZWFzZX1cclxuLmhvbG8taWRsZXtiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudCg5MCUgMTIwJSBhdCA1MCUgMTAwJSxyZ2JhKDEyMyw0NCwyNDUsLjI1KSxyZ2JhKDgsMTIsMzAsLjMpIDU1JSx0cmFuc3BhcmVudCl9XHJcbi5ob2xvLW1pbmluZ3tiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudCg5MCUgMTIwJSBhdCA1MCUgMTAwJSxyZ2JhKDQ0LDEzNywyNDUsLjQ1KSxyZ2JhKDgsMTIsMzAsLjMpIDU1JSx0cmFuc3BhcmVudCl9XHJcbi5ob2xvLW1pbmluZyAubWluZS1ob2xvLWdyaWR7YW5pbWF0aW9uLWR1cmF0aW9uOjEycyFpbXBvcnRhbnR9XHJcbi5ob2xvLWNvbGxhcHNlZHtiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudCg5MCUgMTIwJSBhdCA1MCUgMTAwJSxyZ2JhKDI1NSw5Miw5MiwuMzUpLHJnYmEoOCwxMiwzMCwuMykgNTUlLHRyYW5zcGFyZW50KTthbmltYXRpb246aG9sby1nbGl0Y2ggLjVzIGVhc2UgaW5maW5pdGV9XHJcbkBrZXlmcmFtZXMgaG9sby1nbGl0Y2h7MCUsMTAwJXt0cmFuc2Zvcm06dHJhbnNsYXRlWCgwKX0yNSV7dHJhbnNmb3JtOnRyYW5zbGF0ZVgoLTJweCl9NzUle3RyYW5zZm9ybTp0cmFuc2xhdGVYKDJweCl9fVxyXG4uY3JpdGljYWwtZmxhc2h7YW5pbWF0aW9uOmNyaXRpY2FsLWJ1cnN0IC40cyBlYXNlfVxyXG5Aa2V5ZnJhbWVzIGNyaXRpY2FsLWJ1cnN0ezAle2JhY2tncm91bmQ6cmFkaWFsLWdyYWRpZW50KDkwJSAxMjAlIGF0IDUwJSAxMDAlLHJnYmEoNDQsMTM3LDI0NSwuMzUpLHJnYmEoOCwxMiwzMCwuMykgNTUlLHRyYW5zcGFyZW50KX01MCV7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoOTAlIDEyMCUgYXQgNTAlIDEwMCUscmdiYSgyNDYsMTk2LDY5LC42NSkscmdiYSgyNDYsMTk2LDY5LC4yKSA1NSUsdHJhbnNwYXJlbnQpfTEwMCV7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoOTAlIDEyMCUgYXQgNTAlIDEwMCUscmdiYSg0NCwxMzcsMjQ1LC4zNSkscmdiYSg4LDEyLDMwLC4zKSA1NSUsdHJhbnNwYXJlbnQpfX1cclxuLm1pbmUtaG9sby1ncmlke3Bvc2l0aW9uOmFic29sdXRlO3dpZHRoOjE0MCU7aGVpZ2h0OjE0MCU7YmFja2dyb3VuZDpyZXBlYXRpbmctbGluZWFyLWdyYWRpZW50KDBkZWcscmdiYSgyNTUsMjU1LDI1NSwuMDgpIDAscmdiYSgyNTUsMjU1LDI1NSwuMDgpIDFweCx0cmFuc3BhcmVudCAxcHgsdHJhbnNwYXJlbnQgMjhweCkscmVwZWF0aW5nLWxpbmVhci1ncmFkaWVudCg5MGRlZyxyZ2JhKDI1NSwyNTUsMjU1LC4wNSkgMCxyZ2JhKDI1NSwyNTUsMjU1LC4wNSkgMXB4LHRyYW5zcGFyZW50IDFweCx0cmFuc3BhcmVudCAyNnB4KTtvcGFjaXR5Oi4yMjt0cmFuc2Zvcm06dHJhbnNsYXRlM2QoLTEwJSwwLDApIHJvdGF0ZSg4ZGVnKTthbmltYXRpb246aG9sby1wYW4gMTZzIGxpbmVhciBpbmZpbml0ZX1cclxuLm1pbmUtaG9sby1ncmlkLmRpYWdvbmFse29wYWNpdHk6LjE4O3RyYW5zZm9ybTp0cmFuc2xhdGUzZCgxMCUsMCwwKSByb3RhdGUoLTE2ZGVnKTthbmltYXRpb24tZHVyYXRpb246MjJzfVxyXG5Aa2V5ZnJhbWVzIGhvbG8tcGFuezAle3RyYW5zZm9ybTp0cmFuc2xhdGUzZCgtMTIlLDAsMCkgcm90YXRlKDhkZWcpfTEwMCV7dHJhbnNmb3JtOnRyYW5zbGF0ZTNkKDEyJSwwLDApIHJvdGF0ZSg4ZGVnKX19XHJcbi5taW5lLWhvbG8tZ2xvd3twb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDo3MCU7aGVpZ2h0OjcwJTtib3JkZXItcmFkaXVzOjUwJTtiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudChjaXJjbGUgYXQgNTAlIDQwJSxyZ2JhKDEyMyw0NCwyNDUsLjU1KSx0cmFuc3BhcmVudCA3MCUpO2ZpbHRlcjpibHVyKDMycHgpO29wYWNpdHk6LjU1O2FuaW1hdGlvbjpob2xvLWJyZWF0aGUgMTBzIGVhc2UtaW4tb3V0IGluZmluaXRlfVxyXG5Aa2V5ZnJhbWVzIGhvbG8tYnJlYXRoZXswJSwxMDAle3RyYW5zZm9ybTpzY2FsZSguOSk7b3BhY2l0eTouNDV9NTAle3RyYW5zZm9ybTpzY2FsZSgxLjA4KTtvcGFjaXR5Oi44NX19XHJcbi5taW5lLXNoYXJke3Bvc2l0aW9uOmFic29sdXRlO3dpZHRoOjEyMHB4O2hlaWdodDoxMjBweDtiYWNrZ3JvdW5kOmNvbmljLWdyYWRpZW50KGZyb20gMTUwZGVnLHJnYmEoMTIzLDQ0LDI0NSwuOCkscmdiYSg0NCwxMzcsMjQ1LC4zOCkscmdiYSgxMjMsNDQsMjQ1LC4wOCkpO2NsaXAtcGF0aDpwb2x5Z29uKDUwJSAwLDg4JSA0MCUsNzAlIDEwMCUsMzAlIDEwMCUsMTIlIDQwJSk7b3BhY2l0eTouMjY7ZmlsdGVyOmJsdXIoLjRweCk7YW5pbWF0aW9uOnNoYXJkLWZsb2F0IDhzIGVhc2UtaW4tb3V0IGluZmluaXRlfVxyXG4ubWluZS1zaGFyZC5zaGFyZC0xe3RvcDoxOCU7bGVmdDoxNiU7YW5pbWF0aW9uLWRlbGF5Oi0xLjRzfVxyXG4ubWluZS1zaGFyZC5zaGFyZC0ye2JvdHRvbToxNiU7cmlnaHQ6MjIlO2FuaW1hdGlvbi1kZWxheTotMy4yczt0cmFuc2Zvcm06c2NhbGUoLjc0KX1cclxuLm1pbmUtc2hhcmQuc2hhcmQtM3t0b3A6MjYlO3JpZ2h0OjM0JTthbmltYXRpb24tZGVsYXk6LTUuMXM7dHJhbnNmb3JtOnNjYWxlKC41KSByb3RhdGUoMTJkZWcpfVxyXG5Aa2V5ZnJhbWVzIHNoYXJkLWZsb2F0ezAlLDEwMCV7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoLTEwcHgpIHNjYWxlKDEpO29wYWNpdHk6LjJ9NTAle3RyYW5zZm9ybTp0cmFuc2xhdGVZKDEwcHgpIHNjYWxlKDEuMDUpO29wYWNpdHk6LjR9fVxyXG4ubWFpbi1hbWJpZW50e3Bvc2l0aW9uOmFic29sdXRlO2luc2V0OjA7ei1pbmRleDotMTtwb2ludGVyLWV2ZW50czpub25lO292ZXJmbG93OmhpZGRlbn1cclxuLm1haW4tYW1iaWVudCAuYW1iaWVudC5vcmJ7cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6NDIwcHg7aGVpZ2h0OjQyMHB4O2JvcmRlci1yYWRpdXM6NTAlO2ZpbHRlcjpibHVyKDEyMHB4KTtvcGFjaXR5Oi40MjthbmltYXRpb246YW1iaWVudC1kcmlmdCAyNnMgZWFzZS1pbi1vdXQgaW5maW5pdGV9XHJcbi5tYWluLWFtYmllbnQgLm9yYi1he2JhY2tncm91bmQ6cmFkaWFsLWdyYWRpZW50KGNpcmNsZSxyZ2JhKDEyMyw0NCwyNDUsLjYpLHRyYW5zcGFyZW50IDcwJSk7dG9wOi0xNDBweDtyaWdodDotMTIwcHh9XHJcbi5tYWluLWFtYmllbnQgLm9yYi1ie2JhY2tncm91bmQ6cmFkaWFsLWdyYWRpZW50KGNpcmNsZSxyZ2JhKDQ0LDEzNywyNDUsLjU1KSx0cmFuc3BhcmVudCA3MCUpO2JvdHRvbTotMTgwcHg7bGVmdDotMTgwcHg7YW5pbWF0aW9uLWRlbGF5Oi0xM3N9XHJcbi5tYWluLWFtYmllbnQgLmdyaWR7cG9zaXRpb246YWJzb2x1dGU7aW5zZXQ6MDtiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudCg3MCUgNjAlIGF0IDUwJSAxMDAlLHJnYmEoMjU1LDI1NSwyNTUsLjA4KSx0cmFuc3BhcmVudCA3NSUpO29wYWNpdHk6LjM1O21peC1ibGVuZC1tb2RlOnNjcmVlbjthbmltYXRpb246YW1iaWVudC1wdWxzZSAxOHMgZWFzZS1pbi1vdXQgaW5maW5pdGV9XHJcbkBrZXlmcmFtZXMgYW1iaWVudC1kcmlmdHswJSwxMDAle3RyYW5zZm9ybTp0cmFuc2xhdGUzZCgwLDAsMCkgc2NhbGUoMSl9NTAle3RyYW5zZm9ybTp0cmFuc2xhdGUzZCg4JSwgLTQlLDApIHNjYWxlKDEuMDUpfX1cclxuQGtleWZyYW1lcyBhbWJpZW50LXB1bHNlezAlLDEwMCV7b3BhY2l0eTouMjV9NTAle29wYWNpdHk6LjQ1fX1cclxuLmZhZGUtaW57YW5pbWF0aW9uOmZhZGUtaW4gLjNzIHZhcigtLWVhc2UpfVxyXG5Aa2V5ZnJhbWVzIGZhZGUtaW57ZnJvbXtvcGFjaXR5OjA7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoNHB4KX10b3tvcGFjaXR5OjE7dHJhbnNmb3JtOm5vbmV9fVxyXG4uZmxhc2h7YW5pbWF0aW9uOmZsYXNoIC45cyBlYXNlfVxyXG5Aa2V5ZnJhbWVzIGZsYXNoezAle2JveC1zaGFkb3c6MCAwIDAgcmdiYSgyNTUsMjU1LDI1NSwwKX00MCV7Ym94LXNoYWRvdzowIDAgMCA2cHggcmdiYSgyNTUsMjU1LDI1NSwuMTUpfTEwMCV7Ym94LXNoYWRvdzowIDAgMCByZ2JhKDI1NSwyNTUsMjU1LDApfX1cclxuLnNrZWxldG9ue3Bvc2l0aW9uOnJlbGF0aXZlO292ZXJmbG93OmhpZGRlbjtiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjA4KTtib3JkZXItcmFkaXVzOnZhcigtLXJhZGl1cy1tZCk7aGVpZ2h0OjQ0cHh9XHJcbi5za2VsZXRvbjo6YWZ0ZXJ7Y29udGVudDpcIlwiO3Bvc2l0aW9uOmFic29sdXRlO2luc2V0OjA7dHJhbnNmb3JtOnRyYW5zbGF0ZVgoLTEwMCUpO2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDkwZGVnLHRyYW5zcGFyZW50LHJnYmEoMjU1LDI1NSwyNTUsLjEyKSx0cmFuc3BhcmVudCk7YW5pbWF0aW9uOnNoaW1tZXIgMS4ycyBpbmZpbml0ZTtwb2ludGVyLWV2ZW50czpub25lfVxyXG5Aa2V5ZnJhbWVzIHNoaW1tZXJ7MTAwJXt0cmFuc2Zvcm06dHJhbnNsYXRlWCgxMDAlKX19XHJcbi5saXN0LWl0ZW17ZGlzcGxheTpmbGV4O2dhcDo4cHg7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2JhY2tncm91bmQ6cmdiYSgyNTUsMjU1LDI1NSwuMDYpO2JvcmRlci1yYWRpdXM6dmFyKC0tcmFkaXVzLW1kKTtwYWRkaW5nOjEwcHg7dHJhbnNpdGlvbjphbGwgLjJzIGVhc2V9XHJcbi5saXN0LWl0ZW06aG92ZXJ7YmFja2dyb3VuZDpyZ2JhKDI1NSwyNTUsMjU1LC4wOSk7dHJhbnNmb3JtOnRyYW5zbGF0ZVgoMnB4KX1cclxuLmxpc3QtaXRlbS0tYnV5e2JvcmRlci1sZWZ0OjNweCBzb2xpZCB2YXIoLS1idXkpfVxyXG4ubGlzdC1pdGVtLS1zZWxse2JvcmRlci1sZWZ0OjNweCBzb2xpZCB2YXIoLS1zZWxsKX1cclxuLm5hdnttYXgtd2lkdGg6dmFyKC0tY29udGFpbmVyLW1heCk7bWFyZ2luOjEycHggYXV0byAwO2Rpc3BsYXk6ZmxleDtnYXA6OHB4O2ZsZXgtd3JhcDp3cmFwO3Bvc2l0aW9uOnN0aWNreTt0b3A6MDt6LWluZGV4OjQwO3BhZGRpbmc6NnB4O2JvcmRlci1yYWRpdXM6MTRweDtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxODBkZWcscmdiYSgyMCwyMCw0MCwuNDUpLHJnYmEoMjAsMjAsNDAsLjI1KSk7YmFja2Ryb3AtZmlsdGVyOmJsdXIoMTBweCkgc2F0dXJhdGUoMTI1JSk7Ym9yZGVyOjFweCBzb2xpZCByZ2JhKDI1NSwyNTUsMjU1LC4wNik7Ym94LXNoYWRvdzowIDRweCAxMnB4IHJnYmEoMCwwLDAsLjMpfVxyXG4ubmF2IGF7ZmxleDoxO2Rpc3BsYXk6ZmxleDtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NnB4O3RleHQtYWxpZ246Y2VudGVyO3BhZGRpbmc6MTBweDtib3JkZXItcmFkaXVzOjk5OXB4O3RleHQtZGVjb3JhdGlvbjpub25lO2NvbG9yOiNmZmY7dHJhbnNpdGlvbjpiYWNrZ3JvdW5kIHZhcigtLWR1cikgdmFyKC0tZWFzZSksIHRyYW5zZm9ybSB2YXIoLS1kdXIpIHZhcigtLWVhc2UpO3Bvc2l0aW9uOnJlbGF0aXZlfVxyXG4ubmF2IGE6OmJlZm9yZXtjb250ZW50OlwiXCI7cG9zaXRpb246YWJzb2x1dGU7aW5zZXQ6MDtib3JkZXItcmFkaXVzOmluaGVyaXQ7YmFja2dyb3VuZDp2YXIoLS1ncmFkKTtvcGFjaXR5OjA7dHJhbnNpdGlvbjpvcGFjaXR5IHZhcigtLWR1cikgdmFyKC0tZWFzZSk7cG9pbnRlci1ldmVudHM6bm9uZX1cclxuLm5hdiBhOmhvdmVyOjpiZWZvcmV7b3BhY2l0eTouMX1cclxuLm5hdiBhIC5pY297b3BhY2l0eTouOTV9XHJcbi5uYXYgYS5hY3RpdmV7YmFja2dyb3VuZDp2YXIoLS1ncmFkKTtib3gtc2hhZG93OnZhcigtLWdsb3cpfVxyXG4ubmF2IGE6bm90KC5hY3RpdmUpOmhvdmVye2JhY2tncm91bmQ6cmdiYSgyNTUsMjU1LDI1NSwuMDYpfVxyXG4vKiBnZW5lcmljIGljb24gKi9cclxuLmljb257ZGlzcGxheTppbmxpbmUtYmxvY2s7bGluZS1oZWlnaHQ6MDt2ZXJ0aWNhbC1hbGlnbjptaWRkbGV9XHJcbi5pY29uIHN2Z3tkaXNwbGF5OmJsb2NrO2ZpbHRlcjpkcm9wLXNoYWRvdygwIDAgOHB4IHJnYmEoMTIzLDQ0LDI0NSwuMzUpKX1cclxuLyogcmFyaXR5IGJhZGdlcyAqL1xyXG4uYmFkZ2V7ZGlzcGxheTppbmxpbmUtZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjZweDtwYWRkaW5nOjJweCA4cHg7Ym9yZGVyLXJhZGl1czo5OTlweDtmb250LXNpemU6MTJweDtsaW5lLWhlaWdodDoxO2JvcmRlcjoxcHggc29saWQgcmdiYSgyNTUsMjU1LDI1NSwuMTIpO2JhY2tncm91bmQ6cmdiYSgyNTUsMjU1LDI1NSwuMDYpfVxyXG4uYmFkZ2UgaXtkaXNwbGF5OmlubGluZS1ibG9jazt3aWR0aDo4cHg7aGVpZ2h0OjhweDtib3JkZXItcmFkaXVzOjk5OXB4fVxyXG4uYmFkZ2UucmFyaXR5LWNvbW1vbiBpe2JhY2tncm91bmQ6dmFyKC0tcmFyaXR5LWNvbW1vbil9XHJcbi5iYWRnZS5yYXJpdHktcmFyZSBpe2JhY2tncm91bmQ6dmFyKC0tcmFyaXR5LXJhcmUpfVxyXG4uYmFkZ2UucmFyaXR5LWVwaWMgaXtiYWNrZ3JvdW5kOnZhcigtLXJhcml0eS1lcGljKX1cclxuLmJhZGdlLnJhcml0eS1sZWdlbmRhcnkgaXtiYWNrZ3JvdW5kOnZhcigtLXJhcml0eS1sZWdlbmRhcnkpfVxyXG4ucmFyaXR5LW91dGxpbmUtY29tbW9ue2JveC1zaGFkb3c6MCAwIDAgMXB4IHJnYmEoMTU0LDE2MCwxNjYsLjM1KSBpbnNldCwgMCAwIDI0cHggcmdiYSgxNTQsMTYwLDE2NiwuMTUpfVxyXG4ucmFyaXR5LW91dGxpbmUtcmFyZXtib3gtc2hhZG93OjAgMCAwIDFweCByZ2JhKDc5LDIxMiwyNDUsLjQ1KSBpbnNldCwgMCAwIDI4cHggcmdiYSg3OSwyMTIsMjQ1LC4yNSl9XHJcbi5yYXJpdHktb3V0bGluZS1lcGlje2JveC1zaGFkb3c6MCAwIDAgMXB4IHJnYmEoMTc4LDEwNywyNTUsLjUpIGluc2V0LCAwIDAgMzJweCByZ2JhKDE3OCwxMDcsMjU1LC4zKX1cclxuLnJhcml0eS1vdXRsaW5lLWxlZ2VuZGFyeXtib3gtc2hhZG93OjAgMCAwIDFweCByZ2JhKDI0NiwxOTYsNjksLjYpIGluc2V0LCAwIDAgMzZweCByZ2JhKDI0NiwxOTYsNjksLjM1KX1cclxuLyogYXVyYSBjYXJkIHdyYXBwZXIgKi9cclxuLml0ZW0tY2FyZHtwb3NpdGlvbjpyZWxhdGl2ZTtib3JkZXItcmFkaXVzOnZhcigtLXJhZGl1cy1tZCk7cGFkZGluZzoxMHB4O2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDE0MGRlZyxyZ2JhKDI1NSwyNTUsMjU1LC4wNikscmdiYSgyNTUsMjU1LDI1NSwuMDQpKTtvdmVyZmxvdzpoaWRkZW47dHJhbnNpdGlvbjphbGwgLjNzIGVhc2V9XHJcbi5pdGVtLWNhcmQ6aG92ZXJ7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoLTJweCk7Ym94LXNoYWRvdzowIDhweCAyNHB4IHJnYmEoMCwwLDAsLjQpfVxyXG4uaXRlbS1jYXJkOjpiZWZvcmV7Y29udGVudDpcIlwiO3Bvc2l0aW9uOmFic29sdXRlO2luc2V0Oi0xcHg7Ym9yZGVyLXJhZGl1czppbmhlcml0O3BhZGRpbmc6MXB4O2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZyxyZ2JhKDI1NSwyNTUsMjU1LC4xOCkscmdiYSgyNTUsMjU1LDI1NSwuMDIpKTstd2Via2l0LW1hc2s6bGluZWFyLWdyYWRpZW50KCMwMDAgMCAwKSBjb250ZW50LWJveCxsaW5lYXItZ3JhZGllbnQoIzAwMCAwIDApOy13ZWJraXQtbWFzay1jb21wb3NpdGU6eG9yO21hc2stY29tcG9zaXRlOmV4Y2x1ZGU7cG9pbnRlci1ldmVudHM6bm9uZX1cclxuLml0ZW0tY2FyZFtkYXRhLXJhcml0eT1cImNvbW1vblwiXXtib3JkZXI6MXB4IHNvbGlkIHJnYmEoMTU0LDE2MCwxNjYsLjI1KX1cclxuLml0ZW0tY2FyZFtkYXRhLXJhcml0eT1cInJhcmVcIl17Ym9yZGVyOjFweCBzb2xpZCByZ2JhKDc5LDIxMiwyNDUsLjM1KX1cclxuLml0ZW0tY2FyZFtkYXRhLXJhcml0eT1cImVwaWNcIl17Ym9yZGVyOjFweCBzb2xpZCByZ2JhKDE3OCwxMDcsMjU1LC40KX1cclxuLml0ZW0tY2FyZFtkYXRhLXJhcml0eT1cImxlZ2VuZGFyeVwiXXtib3JkZXI6MXB4IHNvbGlkIHJnYmEoMjQ2LDE5Niw2OSwuNDUpfVxyXG4udXBncmFkZS1zdWNjZXNze2FuaW1hdGlvbjp1cGdyYWRlLWZsYXNoIDFzIGVhc2V9XHJcbkBrZXlmcmFtZXMgdXBncmFkZS1mbGFzaHswJXt0cmFuc2Zvcm06c2NhbGUoMSk7Ym94LXNoYWRvdzowIDAgMCByZ2JhKDQ2LDE5NCwxMjYsMCl9MjUle3RyYW5zZm9ybTpzY2FsZSgxLjAyKTtib3gtc2hhZG93OjAgMCAzMHB4IHJnYmEoNDYsMTk0LDEyNiwuNiksMCAwIDYwcHggcmdiYSg0NiwxOTQsMTI2LC4zKX01MCV7dHJhbnNmb3JtOnNjYWxlKDEpO2JveC1zaGFkb3c6MCAwIDQwcHggcmdiYSg0NiwxOTQsMTI2LC44KSwwIDAgODBweCByZ2JhKDQ2LDE5NCwxMjYsLjQpfTc1JXt0cmFuc2Zvcm06c2NhbGUoMS4wMSk7Ym94LXNoYWRvdzowIDAgMzBweCByZ2JhKDQ2LDE5NCwxMjYsLjYpLDAgMCA2MHB4IHJnYmEoNDYsMTk0LDEyNiwuMyl9MTAwJXt0cmFuc2Zvcm06c2NhbGUoMSk7Ym94LXNoYWRvdzowIDAgMCByZ2JhKDQ2LDE5NCwxMjYsMCl9fVxyXG4udXBncmFkZS1mYWlse2FuaW1hdGlvbjp1cGdyYWRlLWZhaWwtZmxhc2ggMXMgZWFzZX1cclxuQGtleWZyYW1lcyB1cGdyYWRlLWZhaWwtZmxhc2h7MCV7dHJhbnNmb3JtOnNjYWxlKDEpO2JveC1zaGFkb3c6MCAwIDAgcmdiYSgyNTUsOTIsOTIsMCl9MjUle3RyYW5zZm9ybTpzY2FsZSgwLjk4KTtib3gtc2hhZG93OjAgMCAyMHB4IHJnYmEoMjU1LDkyLDkyLC41KSwwIDAgNDBweCByZ2JhKDI1NSw5Miw5MiwuMil9NTAle3RyYW5zZm9ybTpzY2FsZSgxKTtib3gtc2hhZG93OjAgMCAzMHB4IHJnYmEoMjU1LDkyLDkyLC43KSwwIDAgNTBweCByZ2JhKDI1NSw5Miw5MiwuMyl9NzUle3RyYW5zZm9ybTpzY2FsZSgwLjk5KTtib3gtc2hhZG93OjAgMCAyMHB4IHJnYmEoMjU1LDkyLDkyLC41KSwwIDAgNDBweCByZ2JhKDI1NSw5Miw5MiwuMil9MTAwJXt0cmFuc2Zvcm06c2NhbGUoMSk7Ym94LXNoYWRvdzowIDAgMCByZ2JhKDI1NSw5Miw5MiwwKX19XHJcbi5mcmFnbWVudC1jYXJke2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjhweDtiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjA2KTtib3JkZXItcmFkaXVzOjEycHg7cGFkZGluZzoxMnB4O2JvcmRlcjoxcHggc29saWQgcmdiYSgxMjMsNDQsMjQ1LC4yNSk7dHJhbnNpdGlvbjphbGwgLjNzIGVhc2U7cG9zaXRpb246cmVsYXRpdmU7b3ZlcmZsb3c6aGlkZGVufVxyXG4uZnJhZ21lbnQtY2FyZDo6YmVmb3Jle2NvbnRlbnQ6XCJcIjtwb3NpdGlvbjphYnNvbHV0ZTt0b3A6MDtyaWdodDowO3dpZHRoOjQwcHg7aGVpZ2h0OjQwcHg7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoY2lyY2xlLHJnYmEoMTIzLDQ0LDI0NSwuMyksdHJhbnNwYXJlbnQpO29wYWNpdHk6MDt0cmFuc2l0aW9uOm9wYWNpdHkgLjNzIGVhc2U7cG9pbnRlci1ldmVudHM6bm9uZX1cclxuLmZyYWdtZW50LWNhcmQ6aG92ZXI6OmJlZm9yZXtvcGFjaXR5OjE7YW5pbWF0aW9uOmNvcm5lci1wdWxzZSAycyBlYXNlLWluLW91dCBpbmZpbml0ZX1cclxuQGtleWZyYW1lcyBjb3JuZXItcHVsc2V7MCUsMTAwJXt0cmFuc2Zvcm06c2NhbGUoMSk7b3BhY2l0eTouM301MCV7dHJhbnNmb3JtOnNjYWxlKDEuMik7b3BhY2l0eTouNn19XHJcbi5mcmFnbWVudC1jYXJkLmNhbi1jcmFmdHtib3JkZXItY29sb3I6cmdiYSg0NiwxOTQsMTI2LC41KTtib3gtc2hhZG93OjAgMCAxMnB4IHJnYmEoNDYsMTk0LDEyNiwuMik7YW5pbWF0aW9uOmZyYWdtZW50LXJlYWR5IDJzIGVhc2UtaW4tb3V0IGluZmluaXRlfVxyXG5Aa2V5ZnJhbWVzIGZyYWdtZW50LXJlYWR5ezAlLDEwMCV7Ym94LXNoYWRvdzowIDAgMTJweCByZ2JhKDQ2LDE5NCwxMjYsLjIpfTUwJXtib3gtc2hhZG93OjAgMCAyMHB4IHJnYmEoNDYsMTk0LDEyNiwuNCksMCAwIDQwcHggcmdiYSg0NiwxOTQsMTI2LC4yKX19XHJcbi5mcmFnbWVudC1pY29ue2ZvbnQtc2l6ZTozMnB4O3RleHQtYWxpZ246Y2VudGVyfVxyXG4uZnJhZ21lbnQtaW5mb3tkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDo0cHg7dGV4dC1hbGlnbjpjZW50ZXJ9XHJcbi5mcmFnbWVudC1uYW1le2ZvbnQtc2l6ZToxNHB4O2ZvbnQtd2VpZ2h0OjYwMH1cclxuLmZyYWdtZW50LWNvdW50e2ZvbnQtc2l6ZToxM3B4O29wYWNpdHk6Ljg1fVxyXG4uYnRuLXNte3BhZGRpbmc6NnB4IDEwcHg7Zm9udC1zaXplOjEzcHg7aGVpZ2h0OmF1dG99XHJcbi5hZC1vdmVybGF5e3Bvc2l0aW9uOmZpeGVkO2luc2V0OjA7YmFja2dyb3VuZDpyZ2JhKDAsMCwwLC43NSk7YmFja2Ryb3AtZmlsdGVyOmJsdXIoOHB4KTt6LWluZGV4OjEwMDAwO2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OmNlbnRlcjthbmltYXRpb246ZmFkZS1pbiAuM3MgZWFzZX1cclxuLmFkLWRpYWxvZ3ttYXgtd2lkdGg6NDIwcHg7d2lkdGg6OTAlO2JhY2tncm91bmQ6dmFyKC0tcGFuZWwtZ3JhZCk7Ym9yZGVyLXJhZGl1czp2YXIoLS1yYWRpdXMtbGcpO2JveC1zaGFkb3c6dmFyKC0tZ2xvdyk7cGFkZGluZzoyNHB4O2FuaW1hdGlvbjpmYWRlLWluIC4zcyBlYXNlfVxyXG4uYWQtY29udGVudHtkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6MTJweH1cclxuLmFkLWljb257Zm9udC1zaXplOjQ4cHg7ZmlsdGVyOmRyb3Atc2hhZG93KDAgMCAxMnB4IHJnYmEoMTIzLDQ0LDI0NSwuNikpfVxyXG4uYWQtcGxhY2Vob2xkZXJ7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjthbGlnbi1pdGVtczpjZW50ZXI7bWFyZ2luOjEycHggMDtwYWRkaW5nOjIwcHg7YmFja2dyb3VuZDpyZ2JhKDI1NSwyNTUsMjU1LC4wNCk7Ym9yZGVyLXJhZGl1czoxMnB4O3dpZHRoOjEwMCV9XHJcbi5hZC1wcm9ncmVzcy1yaW5ne3Bvc2l0aW9uOnJlbGF0aXZlO3dpZHRoOjEwMHB4O2hlaWdodDoxMDBweH1cclxuLmFkLWNpcmNsZS1iZ3tmaWxsOm5vbmU7c3Ryb2tlOnJnYmEoMjU1LDI1NSwyNTUsLjEpO3N0cm9rZS13aWR0aDo4fVxyXG4uYWQtY2lyY2xlLWZne2ZpbGw6bm9uZTtzdHJva2U6dXJsKCNncmFkKTtzdHJva2Utd2lkdGg6ODtzdHJva2UtbGluZWNhcDpyb3VuZDt0cmFuc2Zvcm06cm90YXRlKC05MGRlZyk7dHJhbnNmb3JtLW9yaWdpbjo1MCUgNTAlO3RyYW5zaXRpb246c3Ryb2tlLWRhc2hvZmZzZXQgLjNzIGVhc2V9XHJcbi5hZC1jb3VudGRvd257cG9zaXRpb246YWJzb2x1dGU7aW5zZXQ6MDtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpjZW50ZXI7Zm9udC1zaXplOjI4cHg7Zm9udC13ZWlnaHQ6NzAwfVxyXG4uYWQtYWN0aW9uc3tkaXNwbGF5OmZsZXg7Z2FwOjEycHg7d2lkdGg6MTAwJX1cclxuLyogXHU3N0ZGXHU1REU1XHU1MkE4XHU3NTNCICovXHJcbi5taW5lci1hbmltYXRpb257ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjRweDtvcGFjaXR5Oi45fVxyXG4ubWluZXItc3Zne3dpZHRoOjEwMHB4O2hlaWdodDoxMDBweH1cclxuLm1pbmVyLWJvZHl7YW5pbWF0aW9uOm1pbmVyLWJvdW5jZSAxLjVzIGVhc2UtaW4tb3V0IGluZmluaXRlfVxyXG5Aa2V5ZnJhbWVzIG1pbmVyLWJvdW5jZXswJSwxMDAle3RyYW5zZm9ybTp0cmFuc2xhdGVZKDApfTUwJXt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtNHB4KX19XHJcbi5taW5lci1hcm17dHJhbnNmb3JtLW9yaWdpbjoxMTBweCA5NXB4O2FuaW1hdGlvbjpwaWNrYXhlLXN3aW5nIDEuMnMgZWFzZS1pbi1vdXQgaW5maW5pdGV9XHJcbkBrZXlmcmFtZXMgcGlja2F4ZS1zd2luZ3swJSwxMDAle3RyYW5zZm9ybTpyb3RhdGUoMGRlZyl9MzAle3RyYW5zZm9ybTpyb3RhdGUoLTM1ZGVnKX02MCV7dHJhbnNmb3JtOnJvdGF0ZSgtMjVkZWcpfX1cclxuLm1pbmVyLWxpZ2h0e2FuaW1hdGlvbjpoZWxtZXQtbGlnaHQgMnMgZWFzZS1pbi1vdXQgaW5maW5pdGV9XHJcbkBrZXlmcmFtZXMgaGVsbWV0LWxpZ2h0ezAlLDEwMCV7b3BhY2l0eTouNn01MCV7b3BhY2l0eToxfX1cclxuLm9yZS1wYXJ0aWNsZXthbmltYXRpb246b3JlLXNwYXJrIDEuMnMgZWFzZS1vdXQgaW5maW5pdGV9XHJcbi5vcmUtcGFydGljbGUucDF7YW5pbWF0aW9uLWRlbGF5OjAuM3N9XHJcbi5vcmUtcGFydGljbGUucDJ7YW5pbWF0aW9uLWRlbGF5OjAuNHN9XHJcbi5vcmUtcGFydGljbGUucDN7YW5pbWF0aW9uLWRlbGF5OjAuMzVzfVxyXG5Aa2V5ZnJhbWVzIG9yZS1zcGFya3swJXtvcGFjaXR5OjA7dHJhbnNmb3JtOnRyYW5zbGF0ZSgwLDApIHNjYWxlKDEpfTMwJXtvcGFjaXR5OjF9MTAwJXtvcGFjaXR5OjA7dHJhbnNmb3JtOnRyYW5zbGF0ZSgtMTBweCwxNXB4KSBzY2FsZSgwLjMpfX1cclxuLm1pbmVyLXN0YXR1c3tmb250LXNpemU6MTNweDtvcGFjaXR5Oi43NTtsZXR0ZXItc3BhY2luZzouMDVlbX1cclxuLm1pbmVyLWlkbGV7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjRweDtvcGFjaXR5Oi41fVxyXG4ubWluZXItaWRsZSBzdmd7d2lkdGg6NzVweDtoZWlnaHQ6NzVweH1cclxuLmlkbGUtbWluZXJ7YW5pbWF0aW9uOmlkbGUtYnJlYXRoZSAzcyBlYXNlLWluLW91dCBpbmZpbml0ZX1cclxuQGtleWZyYW1lcyBpZGxlLWJyZWF0aGV7MCUsMTAwJXtvcGFjaXR5Oi42O3RyYW5zZm9ybTpzY2FsZSgxKX01MCV7b3BhY2l0eTouODt0cmFuc2Zvcm06c2NhbGUoMS4wMil9fVxyXG5Aa2V5ZnJhbWVzIHdhcm5pbmctcHVsc2V7MCUsMTAwJXt0cmFuc2Zvcm06c2NhbGUoMSk7b3BhY2l0eTouNn01MCV7dHJhbnNmb3JtOnNjYWxlKDEuMSk7b3BhY2l0eToxfX1cclxuLmNyaXRpY2FsLW1pbmluZyAubWluZXItYXJte2FuaW1hdGlvbjpwaWNrYXhlLWNyaXRpY2FsIC40cyBlYXNlLWluLW91dCAzIWltcG9ydGFudH1cclxuQGtleWZyYW1lcyBwaWNrYXhlLWNyaXRpY2FsezAlLDEwMCV7dHJhbnNmb3JtOnJvdGF0ZSgwZGVnKX01MCV7dHJhbnNmb3JtOnJvdGF0ZSgtNDVkZWcpfX1cclxuLyogXHU1QjlEXHU3QkIxXHU1MkE4XHU3NTNCICovXHJcbi50cmVhc3VyZS1jaGVzdHtkaXNwbGF5OmlubGluZS1ibG9jazt2ZXJ0aWNhbC1hbGlnbjptaWRkbGV9XHJcbi5jaGVzdC1ib2R5e2FuaW1hdGlvbjpjaGVzdC1ib3VuY2UgLjhzIGVhc2UtaW4tb3V0IGluZmluaXRlfVxyXG5Aa2V5ZnJhbWVzIGNoZXN0LWJvdW5jZXswJSwxMDAle3RyYW5zZm9ybTp0cmFuc2xhdGVZKDApfTUwJXt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtMnB4KX19XHJcbi5jaGVzdC1saWR7dHJhbnNmb3JtLW9yaWdpbjo1MCUgMTBweDthbmltYXRpb246Y2hlc3Qtb3BlbiAycyBlYXNlLWluLW91dCBpbmZpbml0ZX1cclxuQGtleWZyYW1lcyBjaGVzdC1vcGVuezAlLDkwJXt0cmFuc2Zvcm06cm90YXRlWCgwZGVnKX05NSV7dHJhbnNmb3JtOnJvdGF0ZVgoLTE1ZGVnKX0xMDAle3RyYW5zZm9ybTpyb3RhdGVYKDBkZWcpfX1cclxuLmNoZXN0LWNvaW5zIC5jb2lue2FuaW1hdGlvbjpjb2luLXBvcCAxLjVzIGVhc2Utb3V0IGluZmluaXRlfVxyXG4uY29pbi5jMXthbmltYXRpb24tZGVsYXk6MHN9XHJcbi5jb2luLmMye2FuaW1hdGlvbi1kZWxheTowLjE1c31cclxuLmNvaW4uYzN7YW5pbWF0aW9uLWRlbGF5OjAuM3N9XHJcbkBrZXlmcmFtZXMgY29pbi1wb3B7MCUsODAle29wYWNpdHk6MDt0cmFuc2Zvcm06dHJhbnNsYXRlWSgwKSBzY2FsZSgwKX04NSV7b3BhY2l0eToxO3RyYW5zZm9ybTp0cmFuc2xhdGVZKC04cHgpIHNjYWxlKDEuMil9MTAwJXtvcGFjaXR5OjA7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoLTEycHgpIHNjYWxlKDAuOCl9fVxyXG4vKiBcdTUyNTFcdTZDMTRcdTcyNzlcdTY1NDggKi9cclxuLnN3b3JkLXNsYXNoe2Rpc3BsYXk6aW5saW5lLWJsb2NrO3ZlcnRpY2FsLWFsaWduOm1pZGRsZX1cclxuLnNsYXNoLXRyYWlse2FuaW1hdGlvbjpzbGFzaC1hbmltIDFzIGVhc2UtaW4tb3V0IGluZmluaXRlfVxyXG4uc2xhc2gxe2FuaW1hdGlvbi1kZWxheTowc31cclxuLnNsYXNoMnthbmltYXRpb24tZGVsYXk6MC4xc31cclxuQGtleWZyYW1lcyBzbGFzaC1hbmltezAlLDcwJXtvcGFjaXR5OjA7c3Ryb2tlLWRhc2hhcnJheTowIDEwMDtzdHJva2UtZGFzaG9mZnNldDowfTc1JXtvcGFjaXR5OjAuODtzdHJva2UtZGFzaGFycmF5OjIwIDEwMDtzdHJva2UtZGFzaG9mZnNldDowfTEwMCV7b3BhY2l0eTowO3N0cm9rZS1kYXNoYXJyYXk6MjAgMTAwO3N0cm9rZS1kYXNob2Zmc2V0Oi0yMH19XHJcbi8qIFx1OTFEMVx1NUUwMVx1NjVDQlx1OEY2QyAqL1xyXG4uc3Bpbm5pbmctY29pbntkaXNwbGF5OmlubGluZS1ibG9jazt2ZXJ0aWNhbC1hbGlnbjptaWRkbGV9XHJcbi5jb2luLXNwaW57YW5pbWF0aW9uOmNvaW4tcm90YXRlIDNzIGxpbmVhciBpbmZpbml0ZX1cclxuQGtleWZyYW1lcyBjb2luLXJvdGF0ZXswJXt0cmFuc2Zvcm06cm90YXRlWSgwZGVnKX0xMDAle3RyYW5zZm9ybTpyb3RhdGVZKDM2MGRlZyl9fVxyXG4vKiBcdTU5NTZcdTY3NkZcdTUyQThcdTc1M0IgKi9cclxuLnRyb3BoeS1hbmlte2Rpc3BsYXk6aW5saW5lLWJsb2NrO3ZlcnRpY2FsLWFsaWduOm1pZGRsZX1cclxuLnRyb3BoeS1ib3VuY2V7YW5pbWF0aW9uOnRyb3BoeS1qdW1wIDJzIGVhc2UtaW4tb3V0IGluZmluaXRlfVxyXG5Aa2V5ZnJhbWVzIHRyb3BoeS1qdW1wezAlLDEwMCV7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoMCl9NTAle3RyYW5zZm9ybTp0cmFuc2xhdGVZKC0zcHgpfX1cclxuLnRyb3BoeS1zdGFye2FuaW1hdGlvbjpzdGFyLXR3aW5rbGUgMS41cyBlYXNlLWluLW91dCBpbmZpbml0ZX1cclxuQGtleWZyYW1lcyBzdGFyLXR3aW5rbGV7MCUsMTAwJXtvcGFjaXR5OjAuNjt0cmFuc2Zvcm06c2NhbGUoMSl9NTAle29wYWNpdHk6MTt0cmFuc2Zvcm06c2NhbGUoMS4zKX19XHJcbi8qIFx1ODBGRFx1OTFDRlx1NkNFMlx1N0VCOSAqL1xyXG4uZW5lcmd5LXJpcHBsZXtvcGFjaXR5OjA7dHJhbnNpdGlvbjpvcGFjaXR5IC4zcyBlYXNlfVxyXG4uYnRuLWVuZXJneTpob3ZlciAuZW5lcmd5LXJpcHBsZXtvcGFjaXR5OjF9XHJcbi5yaXBwbGV7YW5pbWF0aW9uOnJpcHBsZS1leHBhbmQgMnMgZWFzZS1vdXQgaW5maW5pdGV9XHJcbi5yMXthbmltYXRpb24tZGVsYXk6MHN9XHJcbi5yMnthbmltYXRpb24tZGVsYXk6MC4zc31cclxuLnIze2FuaW1hdGlvbi1kZWxheTowLjZzfVxyXG5Aa2V5ZnJhbWVzIHJpcHBsZS1leHBhbmR7MCV7cjoyMDtvcGFjaXR5OjAuNn0xMDAle3I6NDU7b3BhY2l0eTowfX1cclxuLyogXHU4OEM1XHU4RjdEXHU3QzkyXHU1QjUwXHU2RDQxICovXHJcbi5sb2FkaW5nLXBhcnRpY2xlc3tvcGFjaXR5OjA7dHJhbnNpdGlvbjpvcGFjaXR5IC4zcyBlYXNlfVxyXG4ubWluZS1wcm9ncmVzcy1maWxsOm5vdChbc3R5bGUqPVwid2lkdGg6IDBcIl0pIH4gLmxvYWRpbmctcGFydGljbGVze29wYWNpdHk6MX1cclxuLnBhcnRpY2xle2FuaW1hdGlvbjpwYXJ0aWNsZS1mbG93IDJzIGxpbmVhciBpbmZpbml0ZX1cclxuLnBhcnQxe2FuaW1hdGlvbi1kZWxheTowc31cclxuLnBhcnQye2FuaW1hdGlvbi1kZWxheTowLjRzfVxyXG4ucGFydDN7YW5pbWF0aW9uLWRlbGF5OjAuOHN9XHJcbkBrZXlmcmFtZXMgcGFydGljbGUtZmxvd3swJXtjeDowO29wYWNpdHk6MH0xMCV7b3BhY2l0eToxfTkwJXtvcGFjaXR5OjF9MTAwJXtjeDo0MDA7b3BhY2l0eTowfX1cclxuLyogXHU4RDQ0XHU2RTkwXHU1MzYxXHU3MjQ3XHU3QzkyXHU1QjUwICovXHJcbi5zdGF0LXBhcnRpY2xlc3tvcGFjaXR5OjA7dHJhbnNpdGlvbjpvcGFjaXR5IC4zcyBlYXNlfVxyXG4uc3RhdC1hbmltYXRlZDpob3ZlciAuc3RhdC1wYXJ0aWNsZXN7b3BhY2l0eToxfVxyXG4uc3RhdC1wYXJ0aWNsZXthbmltYXRpb246c3RhdC1mbG9hdCAzcyBlYXNlLWluLW91dCBpbmZpbml0ZX1cclxuLnNwMXthbmltYXRpb24tZGVsYXk6MHN9XHJcbi5zcDJ7YW5pbWF0aW9uLWRlbGF5OjAuNXN9XHJcbi5zcDN7YW5pbWF0aW9uLWRlbGF5OjFzfVxyXG5Aa2V5ZnJhbWVzIHN0YXQtZmxvYXR7MCV7Y3k6MjU7b3BhY2l0eTowfTMwJXtvcGFjaXR5OjAuNn02MCV7Y3k6MTU7b3BhY2l0eTowLjh9MTAwJXtjeTo4O29wYWNpdHk6MH19XHJcbi8qIHZlcnRpY2FsIHRpbWVsaW5lICovXHJcbi50aW1lbGluZXtwb3NpdGlvbjpyZWxhdGl2ZTttYXJnaW4tdG9wOjhweDtwYWRkaW5nLWxlZnQ6MTZweH1cclxuLnRpbWVsaW5lOjpiZWZvcmV7Y29udGVudDpcIlwiO3Bvc2l0aW9uOmFic29sdXRlO2xlZnQ6NnB4O3RvcDowO2JvdHRvbTowO3dpZHRoOjJweDtiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjEpO3BvaW50ZXItZXZlbnRzOm5vbmV9XHJcbi50aW1lbGluZS1pdGVte3Bvc2l0aW9uOnJlbGF0aXZlO21hcmdpbjo4cHggMCA4cHggMH1cclxuLnRpbWVsaW5lLWl0ZW0gLmRvdHtwb3NpdGlvbjphYnNvbHV0ZTtsZWZ0Oi0xMnB4O3RvcDoycHg7d2lkdGg6MTBweDtoZWlnaHQ6MTBweDtib3JkZXItcmFkaXVzOjk5OXB4O2JhY2tncm91bmQ6dmFyKC0tcmFyaXR5LXJhcmUpO2JveC1zaGFkb3c6MCAwIDEwcHggcmdiYSg3OSwyMTIsMjQ1LC41KX1cclxuLnRpbWVsaW5lLWl0ZW0gLnRpbWV7b3BhY2l0eTouNzU7Zm9udC1zaXplOjEycHh9XHJcbi50aW1lbGluZS1pdGVtIC5kZXNje21hcmdpbi10b3A6MnB4fVxyXG4vKiBhY3Rpb24gYnV0dG9ucyBsaW5lICovXHJcbi5hY3Rpb25ze2Rpc3BsYXk6ZmxleDtnYXA6NnB4O2ZsZXgtd3JhcDp3cmFwfVxyXG4vKiBzdWJ0bGUgaG92ZXIgKi9cclxuLmhvdmVyLWxpZnR7dHJhbnNpdGlvbjp0cmFuc2Zvcm0gdmFyKC0tZHVyKSB2YXIoLS1lYXNlKSwgYm94LXNoYWRvdyB2YXIoLS1kdXIpIHZhcigtLWVhc2UpfVxyXG4uaG92ZXItbGlmdDpob3Zlcnt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtMXB4KX1cclxuLyogcmluZyBtZXRlciAqL1xyXG4ucmluZ3stLXNpemU6MTE2cHg7LS10aGljazoxMHB4O3Bvc2l0aW9uOnJlbGF0aXZlO3dpZHRoOnZhcigtLXNpemUpO2hlaWdodDp2YXIoLS1zaXplKTtib3JkZXItcmFkaXVzOjUwJTtiYWNrZ3JvdW5kOmNvbmljLWdyYWRpZW50KCM3QjJDRjUgMGRlZywgcmdiYSgyNTUsMjU1LDI1NSwuMDgpIDBkZWcpfVxyXG4ucmluZzo6YWZ0ZXJ7Y29udGVudDpcIlwiO3Bvc2l0aW9uOmFic29sdXRlO2luc2V0OmNhbGModmFyKC0tdGhpY2spKTtib3JkZXItcmFkaXVzOmluaGVyaXQ7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTgwZGVnLHJnYmEoMjU1LDI1NSwyNTUsLjA2KSxyZ2JhKDI1NSwyNTUsMjU1LC4wMikpO3BvaW50ZXItZXZlbnRzOm5vbmV9XHJcbi5yaW5nIC5sYWJlbHtwb3NpdGlvbjphYnNvbHV0ZTtpbnNldDowO2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OmNlbnRlcjtmb250LXdlaWdodDo3MDB9XHJcbi8qIHRvYXN0ICovXHJcbi50b2FzdC13cmFwe3Bvc2l0aW9uOmZpeGVkO3JpZ2h0OjE2cHg7Ym90dG9tOjE2cHg7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6OHB4O3otaW5kZXg6OTk5OX1cclxuLnRvYXN0e21heC13aWR0aDozNDBweDtwYWRkaW5nOjEwcHggMTJweDtib3JkZXItcmFkaXVzOjEycHg7Y29sb3I6I2ZmZjtiYWNrZ3JvdW5kOnJnYmEoMzAsMzAsNTAsLjk2KTtib3gtc2hhZG93OnZhcigtLWdsb3cpO3Bvc2l0aW9uOnJlbGF0aXZlO292ZXJmbG93OmhpZGRlbjtib3JkZXI6MXB4IHNvbGlkIHJnYmEoMTIzLDQ0LDI0NSwuMyk7YW5pbWF0aW9uOnRvYXN0LXNsaWRlLWluIC4zcyBlYXNlfVxyXG4udG9hc3Quc3VjY2Vzc3tiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxODBkZWcscmdiYSg0NiwxOTQsMTI2LC4xNikscmdiYSgzMCwzMCw1MCwuOTYpKX1cclxuLnRvYXN0Lndhcm57YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTgwZGVnLHJnYmEoMjQ2LDE5Niw2OSwuMTgpLHJnYmEoMzAsMzAsNTAsLjk2KSl9XHJcbi50b2FzdC5lcnJvcntiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxODBkZWcscmdiYSgyNTUsOTIsOTIsLjE4KSxyZ2JhKDMwLDMwLDUwLC45NikpfVxyXG4udG9hc3QgLmxpZmV7cG9zaXRpb246YWJzb2x1dGU7bGVmdDowO2JvdHRvbTowO2hlaWdodDoycHg7YmFja2dyb3VuZDojN0IyQ0Y1O2FuaW1hdGlvbjp0b2FzdC1saWZlIHZhcigtLWxpZmUsMy41cykgbGluZWFyIGZvcndhcmRzfVxyXG5Aa2V5ZnJhbWVzIHRvYXN0LWxpZmV7ZnJvbXt3aWR0aDoxMDAlfXRve3dpZHRoOjB9fVxyXG5Aa2V5ZnJhbWVzIHRvYXN0LXNsaWRlLWlue2Zyb217b3BhY2l0eTowO3RyYW5zZm9ybTp0cmFuc2xhdGVYKDIwcHgpfXRve29wYWNpdHk6MTt0cmFuc2Zvcm06dHJhbnNsYXRlWCgwKX19XHJcbkBtZWRpYSAocHJlZmVycy1yZWR1Y2VkLW1vdGlvbjpyZWR1Y2Upeyp7YW5pbWF0aW9uLWR1cmF0aW9uOi4wMDFtcyFpbXBvcnRhbnQ7YW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudDoxIWltcG9ydGFudDt0cmFuc2l0aW9uLWR1cmF0aW9uOjBtcyFpbXBvcnRhbnR9fVxyXG5cclxuLyogcmVzcG9uc2l2ZSB3aWR0aCArIGRlc2t0b3AgZ3JpZCBsYXlvdXQgZm9yIGZ1bGxuZXNzICovXHJcbkBtZWRpYSAobWluLXdpZHRoOjkwMHB4KXs6cm9vdHstLWNvbnRhaW5lci1tYXg6OTIwcHh9fVxyXG5AbWVkaWEgKG1pbi13aWR0aDoxMjAwcHgpezpyb290ey0tY29udGFpbmVyLW1heDoxMDgwcHh9fVxyXG5cclxuLmNvbnRhaW5lci5ncmlkLTJ7ZGlzcGxheTpncmlkO2dyaWQtdGVtcGxhdGUtY29sdW1uczoxZnI7Z2FwOjEycHh9XHJcbkBtZWRpYSAobWluLXdpZHRoOjk4MHB4KXtcclxuICAuY29udGFpbmVyLmdyaWQtMntncmlkLXRlbXBsYXRlLWNvbHVtbnM6MWZyIDFmcjthbGlnbi1pdGVtczpzdGFydH1cclxuICAuY29udGFpbmVyLmdyaWQtMj4uY2FyZDpmaXJzdC1jaGlsZHtncmlkLWNvbHVtbjoxLy0xfVxyXG59XHJcblxyXG4vKiBkZWNvcmF0aXZlIHBhZ2Ugb3ZlcmxheXM6IGF1cm9yYSwgZ3JpZCBsaW5lcywgYm90dG9tIGdsb3cgKi9cclxuaHRtbDo6YmVmb3Jle2NvbnRlbnQ6XCJcIjtwb3NpdGlvbjpmaXhlZDtpbnNldDowO3BvaW50ZXItZXZlbnRzOm5vbmU7ei1pbmRleDotMjtvcGFjaXR5Oi4wMzU7YmFja2dyb3VuZC1pbWFnZTpsaW5lYXItZ3JhZGllbnQocmdiYSgyNTUsMjU1LDI1NSwuMDQpIDFweCwgdHJhbnNwYXJlbnQgMXB4KSxsaW5lYXItZ3JhZGllbnQoOTBkZWcsIHJnYmEoMjU1LDI1NSwyNTUsLjA0KSAxcHgsIHRyYW5zcGFyZW50IDFweCk7YmFja2dyb3VuZC1zaXplOjI0cHggMjRweH1cclxuYm9keTo6YmVmb3Jle2NvbnRlbnQ6XCJcIjtwb3NpdGlvbjpmaXhlZDtyaWdodDotMTB2dzt0b3A6LTE4dmg7d2lkdGg6NzB2dztoZWlnaHQ6NzB2aDtwb2ludGVyLWV2ZW50czpub25lO3otaW5kZXg6LTE7ZmlsdGVyOmJsdXIoNTBweCk7b3BhY2l0eTouNTU7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoY2xvc2VzdC1zaWRlIGF0IDI1JSA0MCUsIHJnYmEoMTIzLDQ0LDI0NSwuMzUpLCB0cmFuc3BhcmVudCA2NSUpLCByYWRpYWwtZ3JhZGllbnQoY2xvc2VzdC1zaWRlIGF0IDcwJSA2MCUsIHJnYmEoNDQsMTM3LDI0NSwuMjUpLCB0cmFuc3BhcmVudCA3MCUpO21peC1ibGVuZC1tb2RlOnNjcmVlbjthbmltYXRpb246YXVyb3JhLWEgMThzIGVhc2UtaW4tb3V0IGluZmluaXRlIGFsdGVybmF0ZX1cclxuYm9keTo6YWZ0ZXJ7Y29udGVudDpcIlwiO3Bvc2l0aW9uOmZpeGVkO2xlZnQ6LTEwdnc7Ym90dG9tOi0yMnZoO3dpZHRoOjEyMHZ3O2hlaWdodDo2MHZoO3BvaW50ZXItZXZlbnRzOm5vbmU7ei1pbmRleDotMTtmaWx0ZXI6Ymx1cig2MHB4KTtvcGFjaXR5Oi43NTtiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudCgxMjB2dyA2MHZoIGF0IDUwJSAxMDAlLCByZ2JhKDQ0LDEzNywyNDUsLjIyKSwgdHJhbnNwYXJlbnQgNjUlKSwgY29uaWMtZ3JhZGllbnQoZnJvbSAyMDBkZWcgYXQgNTAlIDc1JSwgcmdiYSgxMjMsNDQsMjQ1LC4xOCksIHJnYmEoNDQsMTM3LDI0NSwuMTIpLCB0cmFuc3BhcmVudCA3MCUpO21peC1ibGVuZC1tb2RlOnNjcmVlbjthbmltYXRpb246YXVyb3JhLWIgMjJzIGVhc2UtaW4tb3V0IGluZmluaXRlIGFsdGVybmF0ZX1cclxuQGtleWZyYW1lcyBhdXJvcmEtYXswJXt0cmFuc2Zvcm06dHJhbnNsYXRlWSgwKX0xMDAle3RyYW5zZm9ybTp0cmFuc2xhdGVZKDE0cHgpfX1cclxuQGtleWZyYW1lcyBhdXJvcmEtYnswJXt0cmFuc2Zvcm06dHJhbnNsYXRlWSgwKX0xMDAle3RyYW5zZm9ybTp0cmFuc2xhdGVZKC0xMnB4KX19XHJcbmA7XHJcbiAgY29uc3Qgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xyXG4gIHN0eWxlLnNldEF0dHJpYnV0ZSgnZGF0YS11aScsICdtaW5lci1nYW1lJyk7XHJcbiAgc3R5bGUudGV4dENvbnRlbnQgPSBjc3M7XHJcbiAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XHJcbiAgaW5qZWN0ZWQgPSB0cnVlO1xyXG5cclxuICAvLyBzb2Z0IHN0YXJmaWVsZCBiYWNrZ3JvdW5kICh2ZXJ5IGxpZ2h0KVxyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBleGlzdHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1zdGFyc10nKTtcclxuICAgIGlmICghZXhpc3RzKSB7XHJcbiAgICAgIGNvbnN0IGN2cyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG4gICAgICBjdnMuc2V0QXR0cmlidXRlKCdkYXRhLXN0YXJzJywgJycpO1xyXG4gICAgICBjdnMuc3R5bGUuY3NzVGV4dCA9ICdwb3NpdGlvbjpmaXhlZDtpbnNldDowO3otaW5kZXg6LTI7b3BhY2l0eTouNDA7cG9pbnRlci1ldmVudHM6bm9uZTsnO1xyXG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGN2cyk7XHJcbiAgICAgIGNvbnN0IGN0eCA9IGN2cy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgICBjb25zdCBzdGFycyA9IEFycmF5LmZyb20oeyBsZW5ndGg6IDgwIH0sICgpID0+ICh7IHg6IE1hdGgucmFuZG9tKCksIHk6IE1hdGgucmFuZG9tKCksIHI6IE1hdGgucmFuZG9tKCkqMS4yKzAuMiwgczogTWF0aC5yYW5kb20oKSowLjgrMC4yIH0pKTtcclxuICAgICAgdHlwZSBNZXRlb3IgPSB7IHg6IG51bWJlcjsgeTogbnVtYmVyOyB2eDogbnVtYmVyOyB2eTogbnVtYmVyOyBsaWZlOiBudW1iZXI7IHR0bDogbnVtYmVyIH07XHJcbiAgICAgIGNvbnN0IG1ldGVvcnM6IE1ldGVvcltdID0gW107XHJcbiAgICAgIGNvbnN0IHNwYXduTWV0ZW9yID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHggPSBNYXRoLnJhbmRvbSgpKmN2cy53aWR0aCowLjYgKyBjdnMud2lkdGgqMC4yO1xyXG4gICAgICAgIGNvbnN0IHkgPSAtMjA7IC8vIGZyb20gdG9wXHJcbiAgICAgICAgY29uc3Qgc3BlZWQgPSAzICsgTWF0aC5yYW5kb20oKSozO1xyXG4gICAgICAgIGNvbnN0IGFuZ2xlID0gTWF0aC5QSSowLjggKyBNYXRoLnJhbmRvbSgpKjAuMjsgLy8gZGlhZ29uYWxseVxyXG4gICAgICAgIG1ldGVvcnMucHVzaCh7IHgsIHksIHZ4OiBNYXRoLmNvcyhhbmdsZSkqc3BlZWQsIHZ5OiBNYXRoLnNpbihhbmdsZSkqc3BlZWQsIGxpZmU6IDAsIHR0bDogMTIwMCArIE1hdGgucmFuZG9tKCkqODAwIH0pO1xyXG4gICAgICB9O1xyXG4gICAgICAvLyBnZW50bGUgcGxhbmV0cy9vcmJzXHJcbiAgICAgIGNvbnN0IG9yYnMgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiAyIH0sICgpID0+ICh7IHg6IE1hdGgucmFuZG9tKCksIHk6IE1hdGgucmFuZG9tKCkqMC41ICsgMC4xLCByOiBNYXRoLnJhbmRvbSgpKjgwICsgNzAsIGh1ZTogTWF0aC5yYW5kb20oKSB9KSk7XHJcbiAgICAgIGNvbnN0IGZpdCA9ICgpID0+IHsgY3ZzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7IGN2cy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7IH07XHJcbiAgICAgIGZpdCgpO1xyXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZml0KTtcclxuICAgICAgbGV0IHQgPSAwO1xyXG4gICAgICBjb25zdCBsb29wID0gKCkgPT4ge1xyXG4gICAgICAgIGlmICghY3R4KSByZXR1cm47XHJcbiAgICAgICAgdCArPSAwLjAxNjtcclxuICAgICAgICBjdHguY2xlYXJSZWN0KDAsMCxjdnMud2lkdGgsY3ZzLmhlaWdodCk7XHJcbiAgICAgICAgLy8gc29mdCBvcmJzXHJcbiAgICAgICAgZm9yIChjb25zdCBvYiBvZiBvcmJzKSB7XHJcbiAgICAgICAgICBjb25zdCB4ID0gb2IueCAqIGN2cy53aWR0aCwgeSA9IG9iLnkgKiBjdnMuaGVpZ2h0O1xyXG4gICAgICAgICAgY29uc3QgcHVsc2UgPSAoTWF0aC5zaW4odCowLjYgKyB4KjAuMDAxNSkqMC41KzAuNSkqMC4xMjtcclxuICAgICAgICAgIGNvbnN0IHJhZCA9IG9iLnIgKiAoMStwdWxzZSk7XHJcbiAgICAgICAgICBjb25zdCBncmFkID0gY3R4LmNyZWF0ZVJhZGlhbEdyYWRpZW50KHgsIHksIDAsIHgsIHksIHJhZCk7XHJcbiAgICAgICAgICBncmFkLmFkZENvbG9yU3RvcCgwLCAncmdiYSgxMTAsODAsMjU1LDAuMTApJyk7XHJcbiAgICAgICAgICBncmFkLmFkZENvbG9yU3RvcCgxLCAncmdiYSgwLDAsMCwwKScpO1xyXG4gICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGdyYWQ7XHJcbiAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICBjdHguYXJjKHgsIHksIHJhZCwgMCwgTWF0aC5QSSoyKTtcclxuICAgICAgICAgIGN0eC5maWxsKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHN0YXJzIHR3aW5rbGVcclxuICAgICAgICBmb3IgKGNvbnN0IHN0IG9mIHN0YXJzKSB7XHJcbiAgICAgICAgICBjb25zdCB4ID0gc3QueCAqIGN2cy53aWR0aCwgeSA9IHN0LnkgKiBjdnMuaGVpZ2h0O1xyXG4gICAgICAgICAgY29uc3QgdHcgPSAoTWF0aC5zaW4odCoxLjYgKyB4KjAuMDAyICsgeSowLjAwMykqMC41KzAuNSkqMC41KzAuNTtcclxuICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgIGN0eC5hcmMoeCwgeSwgc3QuciArIHR3KjAuNiwgMCwgTWF0aC5QSSoyKTtcclxuICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAncmdiYSgxODAsMjAwLDI1NSwwLjYpJztcclxuICAgICAgICAgIGN0eC5maWxsKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIG1ldGVvcnNcclxuICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA8IDAuMDE1ICYmIG1ldGVvcnMubGVuZ3RoIDwgMikgc3Bhd25NZXRlb3IoKTtcclxuICAgICAgICBmb3IgKGxldCBpPW1ldGVvcnMubGVuZ3RoLTE7IGk+PTA7IGktLSkge1xyXG4gICAgICAgICAgY29uc3QgbSA9IG1ldGVvcnNbaV07XHJcbiAgICAgICAgICBtLnggKz0gbS52eDsgbS55ICs9IG0udnk7IG0ubGlmZSArPSAxNjtcclxuICAgICAgICAgIC8vIHRyYWlsXHJcbiAgICAgICAgICBjb25zdCB0cmFpbCA9IGN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudChtLngsIG0ueSwgbS54IC0gbS52eCo4LCBtLnkgLSBtLnZ5KjgpO1xyXG4gICAgICAgICAgdHJhaWwuYWRkQ29sb3JTdG9wKDAsICdyZ2JhKDI1NSwyNTUsMjU1LDAuOSknKTtcclxuICAgICAgICAgIHRyYWlsLmFkZENvbG9yU3RvcCgxLCAncmdiYSgxNTAsMTgwLDI1NSwwKScpO1xyXG4gICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gdHJhaWw7XHJcbiAgICAgICAgICBjdHgubGluZVdpZHRoID0gMjtcclxuICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgIGN0eC5tb3ZlVG8obS54IC0gbS52eCoxMCwgbS55IC0gbS52eSoxMCk7XHJcbiAgICAgICAgICBjdHgubGluZVRvKG0ueCwgbS55KTtcclxuICAgICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICAgIGlmIChtLnkgPiBjdnMuaGVpZ2h0ICsgNDAgfHwgbS54IDwgLTQwIHx8IG0ueCA+IGN2cy53aWR0aCArIDQwIHx8IG0ubGlmZSA+IG0udHRsKSB7XHJcbiAgICAgICAgICAgIG1ldGVvcnMuc3BsaWNlKGksMSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wKTtcclxuICAgICAgfTtcclxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3ApO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2gge31cclxufVxyXG4iLCAiaW1wb3J0IHsgTG9naW5TY2VuZSB9IGZyb20gJy4vc2NlbmVzL0xvZ2luU2NlbmUnO1xuaW1wb3J0IHsgTWFpblNjZW5lIH0gZnJvbSAnLi9zY2VuZXMvTWFpblNjZW5lJztcbmltcG9ydCB7IEdhbWVNYW5hZ2VyIH0gZnJvbSAnLi9jb3JlL0dhbWVNYW5hZ2VyJztcbmltcG9ydCB7IFdhcmVob3VzZVNjZW5lIH0gZnJvbSAnLi9zY2VuZXMvV2FyZWhvdXNlU2NlbmUnO1xuaW1wb3J0IHsgUGx1bmRlclNjZW5lIH0gZnJvbSAnLi9zY2VuZXMvUGx1bmRlclNjZW5lJztcbmltcG9ydCB7IEV4Y2hhbmdlU2NlbmUgfSBmcm9tICcuL3NjZW5lcy9FeGNoYW5nZVNjZW5lJztcbmltcG9ydCB7IFJhbmtpbmdTY2VuZSB9IGZyb20gJy4vc2NlbmVzL1JhbmtpbmdTY2VuZSc7XG5pbXBvcnQgeyBlbnN1cmVHbG9iYWxTdHlsZXMgfSBmcm9tICcuL3N0eWxlcy9pbmplY3QnO1xuXG5mdW5jdGlvbiByb3V0ZVRvKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQpIHtcbiAgY29uc3QgaCA9IGxvY2F0aW9uLmhhc2ggfHwgJyMvbG9naW4nO1xuICBjb25zdCBzY2VuZSA9IGguc3BsaXQoJz8nKVswXTtcbiAgc3dpdGNoIChzY2VuZSkge1xuICAgIGNhc2UgJyMvbWFpbic6XG4gICAgICBuZXcgTWFpblNjZW5lKCkubW91bnQoY29udGFpbmVyKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJyMvd2FyZWhvdXNlJzpcbiAgICAgIG5ldyBXYXJlaG91c2VTY2VuZSgpLm1vdW50KGNvbnRhaW5lcik7XG4gICAgICBicmVhaztcbiAgICBjYXNlICcjL3BsdW5kZXInOlxuICAgICAgbmV3IFBsdW5kZXJTY2VuZSgpLm1vdW50KGNvbnRhaW5lcik7XG4gICAgICBicmVhaztcbiAgICBjYXNlICcjL2V4Y2hhbmdlJzpcbiAgICAgIG5ldyBFeGNoYW5nZVNjZW5lKCkubW91bnQoY29udGFpbmVyKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJyMvcmFua2luZyc6XG4gICAgICBuZXcgUmFua2luZ1NjZW5lKCkubW91bnQoY29udGFpbmVyKTtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICBuZXcgTG9naW5TY2VuZSgpLm1vdW50KGNvbnRhaW5lcik7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGJvb3RzdHJhcChjb250YWluZXI6IEhUTUxFbGVtZW50KSB7XG4gIC8vIFx1N0FDQlx1NTM3M1x1NkNFOFx1NTE2NVx1NjgzN1x1NUYwRlx1RkYwQ1x1OTA3Rlx1NTE0REZPVUNcdUZGMDhcdTk1RUFcdTcwQzFcdUZGMDlcbiAgZW5zdXJlR2xvYmFsU3R5bGVzKCk7XG4gIFxuICAvLyBcdTVDMURcdThCRDVcdTYwNjJcdTU5MERcdTRGMUFcdThCRERcbiAgY29uc3QgcmVzdG9yZWQgPSBhd2FpdCBHYW1lTWFuYWdlci5JLnRyeVJlc3RvcmVTZXNzaW9uKCk7XG4gIFxuICAvLyBcdTU5ODJcdTY3OUNcdTY3MDlcdTY3MDlcdTY1NDh0b2tlblx1NEUxNFx1NUY1M1x1NTI0RFx1NTcyOFx1NzY3Qlx1NUY1NVx1OTg3NVx1RkYwQ1x1OERGM1x1OEY2Q1x1NTIzMFx1NEUzQlx1OTg3NVxuICBpZiAocmVzdG9yZWQgJiYgKGxvY2F0aW9uLmhhc2ggPT09ICcnIHx8IGxvY2F0aW9uLmhhc2ggPT09ICcjL2xvZ2luJykpIHtcbiAgICBsb2NhdGlvbi5oYXNoID0gJyMvbWFpbic7XG4gIH1cbiAgXG4gIC8vIFx1NEY3Rlx1NzUyOCByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgXHU3ODZFXHU0RkREXHU2ODM3XHU1RjBGXHU1REYyXHU1RTk0XHU3NTI4XG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgcm91dGVUbyhjb250YWluZXIpO1xuICB9KTtcbiAgXG4gIHdpbmRvdy5vbmhhc2hjaGFuZ2UgPSAoKSA9PiByb3V0ZVRvKGNvbnRhaW5lcik7XG59XG5cbi8vIFx1NEZCRlx1NjM3N1x1NTQyRlx1NTJBOFx1RkYwOFx1N0Y1MVx1OTg3NVx1NzNBRlx1NTg4M1x1RkYwOVxuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICh3aW5kb3cgYXMgYW55KS5NaW5lckFwcCA9IHsgYm9vdHN0cmFwLCBHYW1lTWFuYWdlciB9O1xufVxuXG5cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7OztBQUFPLE1BQU0sa0JBQU4sTUFBTSxnQkFBZTtBQUFBLElBTTFCLGNBQWM7QUFGZCwwQkFBUSxTQUF1QjtBQUk3QixXQUFLLFFBQVEsYUFBYSxRQUFRLFlBQVk7QUFBQSxJQUNoRDtBQUFBLElBUEEsV0FBVyxJQUFvQjtBQUZqQztBQUVtQyxjQUFPLFVBQUssY0FBTCxZQUFtQixLQUFLLFlBQVksSUFBSSxnQkFBZTtBQUFBLElBQUk7QUFBQSxJQVNuRyxTQUFTLEdBQWtCO0FBQ3pCLFdBQUssUUFBUTtBQUNiLFVBQUksR0FBRztBQUNMLHFCQUFhLFFBQVEsY0FBYyxDQUFDO0FBQUEsTUFDdEMsT0FBTztBQUNMLHFCQUFhLFdBQVcsWUFBWTtBQUFBLE1BQ3RDO0FBQUEsSUFDRjtBQUFBLElBRUEsV0FBMEI7QUFDeEIsYUFBTyxLQUFLO0FBQUEsSUFDZDtBQUFBLElBRUEsYUFBYTtBQUNYLFdBQUssU0FBUyxJQUFJO0FBQUEsSUFDcEI7QUFBQSxJQUVBLE1BQU0sUUFBVyxNQUFjLE1BQWdDO0FBQzdELFlBQU0sVUFBZSxFQUFFLGdCQUFnQixvQkFBb0IsSUFBSSw2QkFBTSxZQUFXLENBQUMsRUFBRztBQUNwRixVQUFJLEtBQUssTUFBTyxTQUFRLGVBQWUsSUFBSSxVQUFVLEtBQUssS0FBSztBQUUvRCxVQUFJO0FBQ0YsY0FBTSxNQUFNLE1B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QTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFB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SUFDRixTQUFRO0FBQUEsSUFBQztBQUFBLEVBQ1g7OztBQ3RZQSxXQUFTLFFBQVEsV0FBd0I7QUFDdkMsVUFBTSxJQUFJLFNBQVMsUUFBUTtBQUMzQixVQUFNLFFBQVEsRUFBRSxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQzVCLFlBQVEsT0FBTztBQUFBLE1BQ2IsS0FBSztBQUNILFlBQUksVUFBVSxFQUFFLE1BQU0sU0FBUztBQUMvQjtBQUFBLE1BQ0YsS0FBSztBQUNILFlBQUksZUFBZSxFQUFFLE1BQU0sU0FBUztBQUNwQztBQUFBLE1BQ0YsS0FBSztBQUNILFlBQUksYUFBYSxFQUFFLE1BQU0sU0FBUztBQUNsQztBQUFBLE1BQ0YsS0FBSztBQUNILFlBQUksY0FBYyxFQUFFLE1BQU0sU0FBUztBQUNuQztBQUFBLE1BQ0YsS0FBSztBQUNILFlBQUksYUFBYSxFQUFFLE1BQU0sU0FBUztBQUNsQztBQUFBLE1BQ0Y7QUFDRSxZQUFJLFdBQVcsRUFBRSxNQUFNLFNBQVM7QUFBQSxJQUNwQztBQUFBLEVBQ0Y7QUFFQSxpQkFBc0IsVUFBVSxXQUF3QjtBQUV0RCx1QkFBbUI7QUFHbkIsVUFBTSxXQUFXLE1BQU0sWUFBWSxFQUFFLGtCQUFrQjtBQUd2RCxRQUFJLGFBQWEsU0FBUyxTQUFTLE1BQU0sU0FBUyxTQUFTLFlBQVk7QUFDckUsZUFBUyxPQUFPO0FBQUEsSUFDbEI7QUFHQSwwQkFBc0IsTUFBTTtBQUMxQixjQUFRLFNBQVM7QUFBQSxJQUNuQixDQUFDO0FBRUQsV0FBTyxlQUFlLE1BQU0sUUFBUSxTQUFTO0FBQUEsRUFDL0M7QUFHQSxNQUFJLE9BQU8sV0FBVyxhQUFhO0FBQ2pDLElBQUMsT0FBZSxXQUFXLEVBQUUsV0FBVyxZQUFZO0FBQUEsRUFDdEQ7IiwKICAibmFtZXMiOiBbIm9yaWdpbmFsSFRNTCIsICJlIiwgIm9yaWdpbmFsSFRNTCIsICJvcmlnaW5hbEhUTUwiLCAib3JpZ2luYWxIVE1MIiwgImdyYWQiXQp9Cg==
