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

  // frontend-scripts/components/AdvancedEffects.ts
  function createLiquidFilter() {
    return `
    <svg width="0" height="0" style="position:absolute;">
      <defs>
        <filter id="liquid-goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
        
        <filter id="neon-glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        <filter id="lightning-glow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
          <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 10 -3" result="intense"/>
          <feComposite in="SourceGraphic" in2="intense" operator="over"/>
        </filter>
        
        <filter id="magic-circle">
          <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="2" result="turbulence"/>
          <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="15" xChannelSelector="R" yChannelSelector="G"/>
          <feGaussianBlur stdDeviation="1"/>
        </filter>
      </defs>
    </svg>
  `;
  }
  function createLightningBolt() {
    return html(`
    <svg class="lightning-effect" width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lightningGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f6c445"/>
          <stop offset="50%" stop-color="#fff"/>
          <stop offset="100%" stop-color="#2C89F5"/>
        </linearGradient>
        <filter id="lightningGlow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <g class="lightning-group" opacity="0">
        <path class="bolt bolt-1" d="M100 20 L85 100 L110 100 L95 180" stroke="url(#lightningGrad)" stroke-width="3" fill="none" stroke-linecap="round" filter="url(#lightningGlow)"/>
        <path class="bolt bolt-2" d="M95 30 L82 95 L105 95 L92 170" stroke="#fff" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.6"/>
      </g>
    </svg>
  `);
  }
  function createMagicCircle() {
    return html(`
    <svg class="magic-circle" width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="magicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#7B2CF5" stop-opacity="0.6"/>
          <stop offset="50%" stop-color="#2C89F5" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#f6c445" stop-opacity="0.6"/>
        </linearGradient>
      </defs>
      
      <!-- \u5916\u5708 -->
      <circle class="magic-ring ring-1" cx="150" cy="150" r="140" fill="none" stroke="url(#magicGrad)" stroke-width="1" opacity="0.3"/>
      <circle class="magic-ring ring-2" cx="150" cy="150" r="120" fill="none" stroke="url(#magicGrad)" stroke-width="0.5" opacity="0.4"/>
      <circle class="magic-ring ring-3" cx="150" cy="150" r="100" fill="none" stroke="url(#magicGrad)" stroke-width="0.5" opacity="0.5"/>
      
      <!-- \u7B26\u6587 -->
      <g class="runes">
        <circle cx="150" cy="30" r="3" fill="#7B2CF5" opacity="0.8" class="rune r1"/>
        <circle cx="270" cy="150" r="3" fill="#2C89F5" opacity="0.8" class="rune r2"/>
        <circle cx="150" cy="270" r="3" fill="#f6c445" opacity="0.8" class="rune r3"/>
        <circle cx="30" cy="150" r="3" fill="#7B2CF5" opacity="0.8" class="rune r4"/>
      </g>
      
      <!-- \u4E2D\u5FC3\u661F\u661F -->
      <g class="center-star">
        <path d="M150 140 L155 150 L150 160 L145 150 Z" fill="url(#magicGrad)" opacity="0.6"/>
        <path d="M140 150 L150 155 L160 150 L150 145 Z" fill="url(#magicGrad)" opacity="0.6"/>
      </g>
    </svg>
  `);
  }
  function createStarfield() {
    const stars = [];
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = Math.random() * 2 + 0.5;
      const delay = Math.random() * 3;
      const duration = Math.random() * 2 + 2;
      stars.push(`<circle cx="${x}%" cy="${y}%" r="${size}" fill="#fff" opacity="0" class="star" style="animation-delay:${delay}s;animation-duration:${duration}s"/>`);
    }
    return html(`
    <svg class="starfield" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style="position:absolute;inset:0;pointer-events:none;z-index:0;">
      ${stars.join("")}
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
          <div id="starfield"></div>
          <div id="magicCircle"></div>
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
      const filterDiv = document.createElement("div");
      filterDiv.innerHTML = createLiquidFilter();
      document.body.appendChild(filterDiv);
      const starfieldEl = view.querySelector("#starfield");
      if (starfieldEl) {
        starfieldEl.appendChild(createStarfield());
      }
      const magicCircleEl = view.querySelector("#magicCircle");
      if (magicCircleEl) {
        magicCircleEl.appendChild(createMagicCircle());
      }
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
      if (this.els.hologram) {
        const lightning = createLightningBolt();
        this.els.hologram.appendChild(lightning);
        setTimeout(() => {
          const group = lightning.querySelector(".lightning-group");
          if (group) {
            group.style.opacity = "1";
          }
        }, 50);
        setTimeout(() => {
          lightning.remove();
        }, 600);
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
/* \u95EA\u7535\u6548\u679C */
.lightning-effect{position:absolute;inset:0;pointer-events:none;z-index:10}
.lightning-group{animation:lightning-flash .6s ease}
@keyframes lightning-flash{0%{opacity:0}10%{opacity:1}20%{opacity:0}30%{opacity:1}40%{opacity:0}}
.bolt{stroke-dasharray:200;stroke-dashoffset:200;animation:bolt-draw .3s ease forwards}
@keyframes bolt-draw{to{stroke-dashoffset:0}}
/* \u9B54\u6CD5\u9635 */
.magic-circle{position:absolute;inset:0;pointer-events:none;opacity:0.3;z-index:0}
.magic-ring{stroke-dasharray:4 8;animation:magic-rotate 20s linear infinite}
.ring-1{animation-duration:20s}
.ring-2{animation-duration:15s;animation-direction:reverse}
.ring-3{animation-duration:25s}
@keyframes magic-rotate{from{transform:rotate(0deg);transform-origin:50% 50%}to{transform:rotate(360deg);transform-origin:50% 50%}}
.rune{animation:rune-pulse 2s ease-in-out infinite}
.r1{animation-delay:0s}
.r2{animation-delay:0.5s}
.r3{animation-delay:1s}
.r4{animation-delay:1.5s}
@keyframes rune-pulse{0%,100%{r:3;opacity:.6}50%{r:5;opacity:1}}
.center-star{animation:star-rotate 4s linear infinite}
@keyframes star-rotate{from{transform:rotate(0deg);transform-origin:150px 150px}to{transform:rotate(360deg);transform-origin:150px 150px}}
/* \u661F\u7A7A\u80CC\u666F */
.starfield{opacity:0.4}
.star{animation:star-twinkle-bg 4s ease-in-out infinite}
@keyframes star-twinkle-bg{0%,100%{opacity:0}50%{opacity:0.8}}
/* \u80FD\u91CF\u8109\u51B2 */
.pulse-wave{animation:pulse-expand 3s ease-out infinite}
.wave-1{animation-delay:0s}
.wave-2{animation-delay:1s}
.wave-3{animation-delay:2s}
@keyframes pulse-expand{0%{r:10;opacity:0.8}100%{r:90;opacity:0}}
/* \u6570\u636E\u6D41 */
.data-stream{animation:stream-flow 2s linear infinite}
@keyframes stream-flow{from{transform:translateY(-100px)}to{transform:translateY(100px)}}
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vZnJvbnRlbmQtc2NyaXB0cy9jb3JlL05ldHdvcmtNYW5hZ2VyLnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvY29yZS9HYW1lTWFuYWdlci50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL3V0aWxzL2RvbS50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvbXBvbmVudHMvSWNvbi50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvbXBvbmVudHMvVG9hc3QudHMiLCAiLi4vZnJvbnRlbmQtc2NyaXB0cy9zY2VuZXMvTG9naW5TY2VuZS50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvcmUvRW52LnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvY29yZS9SZWFsdGltZUNsaWVudC50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvbXBvbmVudHMvTmF2LnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvY29tcG9uZW50cy9Db3VudFVwVGV4dC50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvbXBvbmVudHMvUmVzb3VyY2VCYXIudHMiLCAiLi4vZnJvbnRlbmQtc2NyaXB0cy9jb21wb25lbnRzL0FkRGlhbG9nLnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvY29tcG9uZW50cy9NaW5lckFuaW1hdGlvbi50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvbXBvbmVudHMvQW5pbWF0ZWRJY29ucy50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvbXBvbmVudHMvQWR2YW5jZWRFZmZlY3RzLnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvc2NlbmVzL01haW5TY2VuZS50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL3NjZW5lcy9XYXJlaG91c2VTY2VuZS50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL3NjZW5lcy9QbHVuZGVyU2NlbmUudHMiLCAiLi4vZnJvbnRlbmQtc2NyaXB0cy9zY2VuZXMvRXhjaGFuZ2VTY2VuZS50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL3NjZW5lcy9SYW5raW5nU2NlbmUudHMiLCAiLi4vZnJvbnRlbmQtc2NyaXB0cy9zdHlsZXMvaW5qZWN0LnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvQXBwLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJleHBvcnQgY2xhc3MgTmV0d29ya01hbmFnZXIge1xyXG4gIHByaXZhdGUgc3RhdGljIF9pbnN0YW5jZTogTmV0d29ya01hbmFnZXI7XHJcbiAgc3RhdGljIGdldCBJKCk6IE5ldHdvcmtNYW5hZ2VyIHsgcmV0dXJuIHRoaXMuX2luc3RhbmNlID8/ICh0aGlzLl9pbnN0YW5jZSA9IG5ldyBOZXR3b3JrTWFuYWdlcigpKTsgfVxyXG5cclxuICBwcml2YXRlIHRva2VuOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcclxuICBcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIC8vIFx1NEVDRSBsb2NhbFN0b3JhZ2UgXHU2MDYyXHU1OTBEIHRva2VuXHJcbiAgICB0aGlzLnRva2VuID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2F1dGhfdG9rZW4nKTtcclxuICB9XHJcbiAgXHJcbiAgc2V0VG9rZW4odDogc3RyaW5nIHwgbnVsbCkgeyBcclxuICAgIHRoaXMudG9rZW4gPSB0O1xyXG4gICAgaWYgKHQpIHtcclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2F1dGhfdG9rZW4nLCB0KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdhdXRoX3Rva2VuJyk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIGdldFRva2VuKCk6IHN0cmluZyB8IG51bGwge1xyXG4gICAgcmV0dXJuIHRoaXMudG9rZW47XHJcbiAgfVxyXG4gIFxyXG4gIGNsZWFyVG9rZW4oKSB7XHJcbiAgICB0aGlzLnNldFRva2VuKG51bGwpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgcmVxdWVzdDxUPihwYXRoOiBzdHJpbmcsIGluaXQ/OiBSZXF1ZXN0SW5pdCk6IFByb21pc2U8VD4ge1xyXG4gICAgY29uc3QgaGVhZGVyczogYW55ID0geyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLCAuLi4oaW5pdD8uaGVhZGVycyB8fCB7fSkgfTtcclxuICAgIGlmICh0aGlzLnRva2VuKSBoZWFkZXJzWydBdXRob3JpemF0aW9uJ10gPSBgQmVhcmVyICR7dGhpcy50b2tlbn1gO1xyXG4gICAgXHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaCh0aGlzLmdldEJhc2UoKSArIHBhdGgsIHsgLi4uaW5pdCwgaGVhZGVycyB9KTtcclxuICAgICAgY29uc3QganNvbiA9IGF3YWl0IHJlcy5qc29uKCk7XHJcbiAgICAgIFxyXG4gICAgICAvLyA0MDEgXHU2NzJBXHU2Mzg4XHU2NzQzXHVGRjBDXHU2RTA1XHU5NjY0IHRva2VuIFx1NUU3Nlx1OERGM1x1OEY2Q1x1NzY3Qlx1NUY1NVxyXG4gICAgICBpZiAocmVzLnN0YXR1cyA9PT0gNDAxKSB7XHJcbiAgICAgICAgdGhpcy5jbGVhclRva2VuKCk7XHJcbiAgICAgICAgaWYgKGxvY2F0aW9uLmhhc2ggIT09ICcjL2xvZ2luJykge1xyXG4gICAgICAgICAgbG9jYXRpb24uaGFzaCA9ICcjL2xvZ2luJztcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdcdTc2N0JcdTVGNTVcdTVERjJcdThGQzdcdTY3MUZcdUZGMENcdThCRjdcdTkxQ0RcdTY1QjBcdTc2N0JcdTVGNTUnKTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgaWYgKCFyZXMub2sgfHwganNvbi5jb2RlID49IDQwMCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihqc29uLm1lc3NhZ2UgfHwgJ1JlcXVlc3QgRXJyb3InKTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgcmV0dXJuIGpzb24uZGF0YSBhcyBUO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgLy8gXHU3RjUxXHU3RURDXHU5NTE5XHU4QkVGXHU1OTA0XHU3NDA2XHJcbiAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIFR5cGVFcnJvciAmJiBlcnJvci5tZXNzYWdlLmluY2x1ZGVzKCdmZXRjaCcpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdcdTdGNTFcdTdFRENcdThGREVcdTYzQTVcdTU5MzFcdThEMjVcdUZGMENcdThCRjdcdTY4QzBcdTY3RTVcdTdGNTFcdTdFRENcdTYyMTZcdTU0MEVcdTdBRUZcdTY3MERcdTUyQTEnKTtcclxuICAgICAgfVxyXG4gICAgICB0aHJvdyBlcnJvcjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldEJhc2UoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiAod2luZG93IGFzIGFueSkuX19BUElfQkFTRV9fIHx8ICdodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpJztcclxuICB9XHJcbn1cclxuXHJcblxyXG4iLCAiaW1wb3J0IHsgTmV0d29ya01hbmFnZXIgfSBmcm9tICcuL05ldHdvcmtNYW5hZ2VyJztcclxuXHJcbmV4cG9ydCB0eXBlIFByb2ZpbGUgPSB7IGlkOiBzdHJpbmc7IHVzZXJuYW1lOiBzdHJpbmc7IG5pY2tuYW1lOiBzdHJpbmc7IG9yZUFtb3VudDogbnVtYmVyOyBiYkNvaW5zOiBudW1iZXIgfTtcclxuXHJcbmV4cG9ydCBjbGFzcyBHYW1lTWFuYWdlciB7XHJcbiAgcHJpdmF0ZSBzdGF0aWMgX2luc3RhbmNlOiBHYW1lTWFuYWdlcjtcclxuICBzdGF0aWMgZ2V0IEkoKTogR2FtZU1hbmFnZXIgeyByZXR1cm4gdGhpcy5faW5zdGFuY2UgPz8gKHRoaXMuX2luc3RhbmNlID0gbmV3IEdhbWVNYW5hZ2VyKCkpOyB9XHJcblxyXG4gIHByaXZhdGUgcHJvZmlsZTogUHJvZmlsZSB8IG51bGwgPSBudWxsO1xyXG4gIGdldFByb2ZpbGUoKTogUHJvZmlsZSB8IG51bGwgeyByZXR1cm4gdGhpcy5wcm9maWxlOyB9XHJcblxyXG4gIGFzeW5jIGxvZ2luT3JSZWdpc3Rlcih1c2VybmFtZTogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICBjb25zdCBubSA9IE5ldHdvcmtNYW5hZ2VyLkk7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCByID0gYXdhaXQgbm0ucmVxdWVzdDx7IGFjY2Vzc190b2tlbjogc3RyaW5nOyB1c2VyOiBhbnkgfT4oJy9hdXRoL2xvZ2luJywgeyBtZXRob2Q6ICdQT1NUJywgYm9keTogSlNPTi5zdHJpbmdpZnkoeyB1c2VybmFtZSwgcGFzc3dvcmQgfSkgfSk7XHJcbiAgICAgIG5tLnNldFRva2VuKHIuYWNjZXNzX3Rva2VuKTtcclxuICAgIH0gY2F0Y2gge1xyXG4gICAgICBjb25zdCByID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgYWNjZXNzX3Rva2VuOiBzdHJpbmc7IHVzZXI6IGFueSB9PignL2F1dGgvcmVnaXN0ZXInLCB7IG1ldGhvZDogJ1BPU1QnLCBib2R5OiBKU09OLnN0cmluZ2lmeSh7IHVzZXJuYW1lLCBwYXNzd29yZCB9KSB9KTtcclxuICAgICAgTmV0d29ya01hbmFnZXIuSS5zZXRUb2tlbihyLmFjY2Vzc190b2tlbik7XHJcbiAgICB9XHJcbiAgICB0aGlzLnByb2ZpbGUgPSBhd2FpdCBubS5yZXF1ZXN0PFByb2ZpbGU+KCcvdXNlci9wcm9maWxlJyk7XHJcbiAgfVxyXG5cclxuICBhc3luYyB0cnlSZXN0b3JlU2Vzc2lvbigpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgIGNvbnN0IG5tID0gTmV0d29ya01hbmFnZXIuSTtcclxuICAgIGNvbnN0IHRva2VuID0gbm0uZ2V0VG9rZW4oKTtcclxuICAgIGlmICghdG9rZW4pIHJldHVybiBmYWxzZTtcclxuICAgIFxyXG4gICAgdHJ5IHtcclxuICAgICAgdGhpcy5wcm9maWxlID0gYXdhaXQgbm0ucmVxdWVzdDxQcm9maWxlPignL3VzZXIvcHJvZmlsZScpO1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0gY2F0Y2gge1xyXG4gICAgICAvLyBUb2tlbiBcdTU5MzFcdTY1NDhcdUZGMENcdTZFMDVcdTk2NjRcclxuICAgICAgbm0uY2xlYXJUb2tlbigpO1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBsb2dvdXQoKSB7XHJcbiAgICBOZXR3b3JrTWFuYWdlci5JLmNsZWFyVG9rZW4oKTtcclxuICAgIHRoaXMucHJvZmlsZSA9IG51bGw7XHJcbiAgICBsb2NhdGlvbi5oYXNoID0gJyMvbG9naW4nO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbiIsICJleHBvcnQgZnVuY3Rpb24gaHRtbCh0ZW1wbGF0ZTogc3RyaW5nKTogSFRNTEVsZW1lbnQge1xyXG4gIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gIGRpdi5pbm5lckhUTUwgPSB0ZW1wbGF0ZS50cmltKCk7XHJcbiAgcmV0dXJuIGRpdi5maXJzdEVsZW1lbnRDaGlsZCBhcyBIVE1MRWxlbWVudDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHFzPFQgZXh0ZW5kcyBFbGVtZW50ID0gSFRNTEVsZW1lbnQ+KHJvb3Q6IFBhcmVudE5vZGUsIHNlbDogc3RyaW5nKTogVCB7XHJcbiAgY29uc3QgZWwgPSByb290LnF1ZXJ5U2VsZWN0b3Ioc2VsKSBhcyBUIHwgbnVsbDtcclxuICBpZiAoIWVsKSB0aHJvdyBuZXcgRXJyb3IoYE1pc3NpbmcgZWxlbWVudDogJHtzZWx9YCk7XHJcbiAgcmV0dXJuIGVsIGFzIFQ7XHJcbn1cclxuXHJcblxyXG4iLCAiaW1wb3J0IHsgaHRtbCB9IGZyb20gJy4uL3V0aWxzL2RvbSc7XG5cbmV4cG9ydCB0eXBlIEljb25OYW1lID1cbiAgfCAnaG9tZSdcbiAgfCAnd2FyZWhvdXNlJ1xuICB8ICdwbHVuZGVyJ1xuICB8ICdleGNoYW5nZSdcbiAgfCAncmFua2luZydcbiAgfCAnb3JlJ1xuICB8ICdjb2luJ1xuICB8ICdwaWNrJ1xuICB8ICdyZWZyZXNoJ1xuICB8ICdwbGF5J1xuICB8ICdzdG9wJ1xuICB8ICdjb2xsZWN0J1xuICB8ICd3cmVuY2gnXG4gIHwgJ3NoaWVsZCdcbiAgfCAnbGlzdCdcbiAgfCAndXNlcidcbiAgfCAnbG9jaydcbiAgfCAnZXllJ1xuICB8ICdleWUtb2ZmJ1xuICB8ICdzd29yZCdcbiAgfCAndHJvcGh5J1xuICB8ICdjbG9jaydcbiAgfCAnYm9sdCdcbiAgfCAndHJhc2gnXG4gIHwgJ2Nsb3NlJ1xuICB8ICdhcnJvdy1yaWdodCdcbiAgfCAndGFyZ2V0J1xuICB8ICdib3gnXG4gIHwgJ2luZm8nXG4gIHwgJ2xvZ291dCdcbiAgfCAneCc7XG5cbmZ1bmN0aW9uIGdyYWQoaWQ6IHN0cmluZykge1xuICByZXR1cm4gYDxkZWZzPlxuICAgIDxsaW5lYXJHcmFkaWVudCBpZD1cIiR7aWR9XCIgeDE9XCIwXCIgeTE9XCIwXCIgeDI9XCIxXCIgeTI9XCIxXCI+XG4gICAgICA8c3RvcCBvZmZzZXQ9XCIwJVwiIHN0b3AtY29sb3I9XCIjN0IyQ0Y1XCIgLz5cbiAgICAgIDxzdG9wIG9mZnNldD1cIjEwMCVcIiBzdG9wLWNvbG9yPVwiIzJDODlGNVwiIC8+XG4gICAgPC9saW5lYXJHcmFkaWVudD5cbiAgPC9kZWZzPmA7XG59XG5cbmZ1bmN0aW9uIHN2Z1dyYXAocGF0aDogc3RyaW5nLCBzaXplID0gMTgsIGNscyA9ICcnKTogSFRNTEVsZW1lbnQge1xuICBjb25zdCBnaWQgPSAnaWctJyArIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnNsaWNlKDIsIDgpO1xuICBjb25zdCBlbCA9IGh0bWwoYDxzcGFuIGNsYXNzPVwiaWNvbiAke2Nsc31cIiBhcmlhLWhpZGRlbj1cInRydWVcIj4ke1xuICAgIGA8c3ZnIHdpZHRoPVwiJHtzaXplfVwiIGhlaWdodD1cIiR7c2l6ZX1cIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+JHtncmFkKGdpZCl9JHtwYXRoLnJlcGxhY2VBbGwoJ19fR1JBRF9fJywgYHVybCgjJHtnaWR9KWApfTwvc3ZnPmBcbiAgfTwvc3Bhbj5gKTtcbiAgcmV0dXJuIGVsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVySWNvbihuYW1lOiBJY29uTmFtZSwgb3B0czogeyBzaXplPzogbnVtYmVyOyBjbGFzc05hbWU/OiBzdHJpbmcgfSA9IHt9KSB7XG4gIGNvbnN0IHNpemUgPSBvcHRzLnNpemUgPz8gMTg7XG4gIGNvbnN0IGNscyA9IG9wdHMuY2xhc3NOYW1lID8/ICcnO1xuICBjb25zdCBzdHJva2UgPSAnc3Ryb2tlPVwiX19HUkFEX19cIiBzdHJva2Utd2lkdGg9XCIxLjdcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIic7XG4gIGNvbnN0IGZpbGwgPSAnZmlsbD1cIl9fR1JBRF9fXCInO1xuXG4gIHN3aXRjaCAobmFtZSkge1xuICAgIGNhc2UgJ2hvbWUnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNMyAxMC41TDEyIDNsOSA3LjVcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNNS41IDkuNVYyMWgxM1Y5LjVcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNOS41IDIxdi02aDV2NlwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICd3YXJlaG91c2UnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNMyA5bDktNSA5IDV2OS41YzAgMS0xIDItMiAySDVjLTEgMC0yLTEtMi0yVjl6XCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTcgMTJoMTBNNyAxNmgxMFwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdwbHVuZGVyJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTQgMjBsNy03TTEzIDEzbDcgN005IDVsNiA2TTE1IDVsLTYgNlwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdleGNoYW5nZSc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk02IDhoMTFsLTMtM00xOCAxNkg3bDMgM1wiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdyYW5raW5nJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTggMTR2Nk0xMiAxMHYxME0xNiA2djE0XCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTE2IDQuNWEyIDIgMCAxMDAtNCAyIDIgMCAwMDAgNHpcIiAke2ZpbGx9Lz5gICwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdvcmUnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNMTIgM2w2IDQtMiA4LTQgNi00LTYtMi04IDYtNHpcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNMTIgM2wtMiA4IDIgMTAgMi0xMC0yLTh6XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ2NvaW4nOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiOC41XCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTguNSAxMmg3TTEwIDloNE0xMCAxNWg0XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ3BpY2snOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNNCA1YzQtMyA5LTIgMTIgMU05IDEwbC01IDVNOSAxMGwyIDJNNyAxMmwyIDJcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNMTEgMTJsNyA3XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ3JlZnJlc2gnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNMjAgMTJhOCA4IDAgMTAtMi4zIDUuN1wiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk0yMCAxMnY2aC02XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ3BsYXknOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNOCA2djEybDEwLTYtMTAtNnpcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnc3RvcCc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHJlY3QgeD1cIjdcIiB5PVwiN1wiIHdpZHRoPVwiMTBcIiBoZWlnaHQ9XCIxMFwiIHJ4PVwiMlwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdjb2xsZWN0JzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTEyIDV2MTBcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNOCAxMWw0IDQgNC00XCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTUgMTloMTRcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnd3JlbmNoJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTE1LjUgNmE0LjUgNC41IDAgMTEtNi45IDUuNEwzIDE3bDQuNi01LjZBNC41IDQuNSAwIDExMTUuNSA2elwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdzaGllbGQnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNMTIgM2w4IDN2NmExMCAxMCAwIDAxLTggOSAxMCAxMCAwIDAxLTgtOVY2bDgtM3pcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnbGlzdCc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk03IDZoMTJNNyAxMmgxMk03IDE4aDEyXCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTQgNmguMDFNNCAxMmguMDFNNCAxOGguMDFcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAndXNlcic6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0xMiAxMmE0IDQgMCAxMDAtOCA0IDQgMCAwMDAgOHpcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNNCAyMGE4IDggMCAwMTE2IDBcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnbG9jayc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHJlY3QgeD1cIjVcIiB5PVwiMTBcIiB3aWR0aD1cIjE0XCIgaGVpZ2h0PVwiMTBcIiByeD1cIjJcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNOCAxMFY3YTQgNCAwIDExOCAwdjNcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnZXllJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTIgMTJzNC03IDEwLTcgMTAgNyAxMCA3LTQgNy0xMCA3LTEwLTctMTAtN3pcIiAke3N0cm9rZX0vPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiM1wiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdleWUtb2ZmJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTIgMTJzNC03IDEwLTcgMTAgNyAxMCA3LTQgNy0xMCA3LTEwLTctMTAtN3pcIiAke3N0cm9rZX0vPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiM1wiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk0zIDNsMTggMThcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnc3dvcmQnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNMyAyMWw2LTZNOSAxNWw5LTkgMyAzLTkgOU0xNCA2bDQgNFwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICd0cm9waHknOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNOCAyMWg4TTkgMTdoNk03IDRoMTB2NWE1IDUgMCAxMS0xMCAwVjR6XCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTQgNmgzdjJhMyAzIDAgMTEtMy0yek0yMCA2aC0zdjJhMyAzIDAgMDAzLTJ6XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ2Nsb2NrJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjguNVwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk0xMiA3djZsNCAyXCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ2JvbHQnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNMTMgMkw2IDE0aDVsLTEgOCA3LTEyaC01bDEtOHpcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAndHJhc2gnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNNCA3aDE2TTkgN1Y1aDZ2Mk03IDdsMSAxM2g4bDEtMTNcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnY2xvc2UnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNNiA2bDEyIDEyTTYgMThMMTggNlwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdhcnJvdy1yaWdodCc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk00IDEyaDE0TTEyIDVsNyA3LTcgN1wiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICd0YXJnZXQnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiOC41XCIgJHtzdHJva2V9Lz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjQuNVwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk0xMiAydjNNMTIgMTl2M00yIDEyaDNNMTkgMTJoM1wiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdib3gnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNMTIgM2w5IDUtOSA1LTktNSA5LTV6XCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTMgOHY4bDkgNSA5LTVWOFwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk0xMiAxM3Y4XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ2luZm8nOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiOC41XCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTEyIDEwdjZcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNMTIgN2guMDFcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnbG9nb3V0JzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTE0IDhWNWExIDEgMCAwMC0xLTFINWExIDEgMCAwMC0xIDF2MTRhMSAxIDAgMDAxIDFoOGExIDEgMCAwMDEtMXYtM1wiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk05IDEyaDExTTE2IDhsNCA0LTQgNFwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICd4JzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTYgNmwxMiAxMk0xOCA2TDYgMThcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjlcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gIH1cbn1cbiIsICJpbXBvcnQgeyByZW5kZXJJY29uIH0gZnJvbSAnLi9JY29uJztcblxubGV0IF9ib3g6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG5cbmZ1bmN0aW9uIGVuc3VyZUJveCgpOiBIVE1MRWxlbWVudCB7XG4gIGlmIChfYm94KSByZXR1cm4gX2JveDtcbiAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGRpdi5jbGFzc05hbWUgPSAndG9hc3Qtd3JhcCc7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgX2JveCA9IGRpdjtcbiAgcmV0dXJuIGRpdjtcbn1cblxudHlwZSBUb2FzdFR5cGUgPSAnaW5mbycgfCAnc3VjY2VzcycgfCAnd2FybicgfCAnZXJyb3InO1xudHlwZSBUb2FzdE9wdGlvbnMgPSB7IHR5cGU/OiBUb2FzdFR5cGU7IGR1cmF0aW9uPzogbnVtYmVyIH07XG5cbmV4cG9ydCBmdW5jdGlvbiBzaG93VG9hc3QodGV4dDogc3RyaW5nLCBvcHRzPzogVG9hc3RUeXBlIHwgVG9hc3RPcHRpb25zKSB7XG4gIGNvbnN0IGJveCA9IGVuc3VyZUJveCgpO1xuICBjb25zdCBpdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGxldCB0eXBlOiBUb2FzdFR5cGUgfCB1bmRlZmluZWQ7XG4gIGxldCBkdXJhdGlvbiA9IDM1MDA7XG4gIGlmICh0eXBlb2Ygb3B0cyA9PT0gJ3N0cmluZycpIHR5cGUgPSBvcHRzO1xuICBlbHNlIGlmIChvcHRzKSB7IHR5cGUgPSBvcHRzLnR5cGU7IGlmIChvcHRzLmR1cmF0aW9uKSBkdXJhdGlvbiA9IG9wdHMuZHVyYXRpb247IH1cbiAgaXRlbS5jbGFzc05hbWUgPSAndG9hc3QnICsgKHR5cGUgPyAnICcgKyB0eXBlIDogJycpO1xuICAvLyBpY29uICsgdGV4dCBjb250YWluZXJcbiAgdHJ5IHtcbiAgICBjb25zdCB3cmFwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgd3JhcC5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnO1xuICAgIHdyYXAuc3R5bGUuZ2FwID0gJzhweCc7XG4gICAgd3JhcC5zdHlsZS5hbGlnbkl0ZW1zID0gJ2NlbnRlcic7XG4gICAgY29uc3QgaWNvTmFtZSA9IHR5cGUgPT09ICdzdWNjZXNzJyA/ICdib2x0JyA6IHR5cGUgPT09ICd3YXJuJyA/ICdjbG9jaycgOiB0eXBlID09PSAnZXJyb3InID8gJ2Nsb3NlJyA6ICdpbmZvJztcbiAgICBjb25zdCBpY29Ib3N0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGljb0hvc3QuYXBwZW5kQ2hpbGQocmVuZGVySWNvbihpY29OYW1lLCB7IHNpemU6IDE4IH0pKTtcbiAgICBjb25zdCB0eHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0eHQudGV4dENvbnRlbnQgPSB0ZXh0O1xuICAgIHdyYXAuYXBwZW5kQ2hpbGQoaWNvSG9zdCk7XG4gICAgd3JhcC5hcHBlbmRDaGlsZCh0eHQpO1xuICAgIGl0ZW0uYXBwZW5kQ2hpbGQod3JhcCk7XG4gIH0gY2F0Y2gge1xuICAgIGl0ZW0udGV4dENvbnRlbnQgPSB0ZXh0O1xuICB9XG4gIGNvbnN0IGxpZmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpJyk7XG4gIGxpZmUuY2xhc3NOYW1lID0gJ2xpZmUnO1xuICBsaWZlLnN0eWxlLnNldFByb3BlcnR5KCctLWxpZmUnLCBkdXJhdGlvbiArICdtcycpO1xuICBpdGVtLmFwcGVuZENoaWxkKGxpZmUpO1xuICBib3gucHJlcGVuZChpdGVtKTtcbiAgLy8gZ3JhY2VmdWwgZXhpdFxuICBjb25zdCBmYWRlID0gKCkgPT4geyBpdGVtLnN0eWxlLm9wYWNpdHkgPSAnMCc7IGl0ZW0uc3R5bGUudHJhbnNpdGlvbiA9ICdvcGFjaXR5IC40NXMnOyBzZXRUaW1lb3V0KCgpID0+IGl0ZW0ucmVtb3ZlKCksIDQ2MCk7IH07XG4gIGNvbnN0IHRpbWVyID0gd2luZG93LnNldFRpbWVvdXQoZmFkZSwgZHVyYXRpb24pO1xuICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4geyBjbGVhclRpbWVvdXQodGltZXIpOyBmYWRlKCk7IH0pO1xufVxuIiwgImltcG9ydCB7IEdhbWVNYW5hZ2VyIH0gZnJvbSAnLi4vY29yZS9HYW1lTWFuYWdlcic7XG5pbXBvcnQgeyBodG1sLCBxcyB9IGZyb20gJy4uL3V0aWxzL2RvbSc7XG5pbXBvcnQgeyBzaG93VG9hc3QgfSBmcm9tICcuLi9jb21wb25lbnRzL1RvYXN0JztcbmltcG9ydCB7IHJlbmRlckljb24gfSBmcm9tICcuLi9jb21wb25lbnRzL0ljb24nO1xuXG5leHBvcnQgY2xhc3MgTG9naW5TY2VuZSB7XG4gIG1vdW50KHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3QgdmlldyA9IGh0bWwoYFxuICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lciBncmlkLTJcIiBzdHlsZT1cImNvbG9yOiNmZmY7XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkIGZhZGUtaW5cIiBzdHlsZT1cIm1heC13aWR0aDo0NjBweDttYXJnaW46NDZweCBhdXRvO1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY2VuZS1oZWFkZXJcIj5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxoMSBzdHlsZT1cImJhY2tncm91bmQ6dmFyKC0tZ3JhZCk7LXdlYmtpdC1iYWNrZ3JvdW5kLWNsaXA6dGV4dDtiYWNrZ3JvdW5kLWNsaXA6dGV4dDtjb2xvcjp0cmFuc3BhcmVudDtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo4cHg7XCI+PHNwYW4gZGF0YS1pY289XCJob21lXCI+PC9zcGFuPlx1NzdGRlx1NTczQVx1NjMwN1x1NjMyNVx1NEUyRFx1NUZDMzwvaDE+XG4gICAgICAgICAgICAgIDxwPlx1NzY3Qlx1NUY1NVx1NTQwRVx1OEZEQlx1NTE2NVx1NEY2MFx1NzY4NFx1OEQ1Qlx1NTM1QVx1NzdGRlx1NTdDRVx1MzAwMjwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxpbnB1dCBpZD1cInVcIiBjbGFzcz1cImlucHV0XCIgcGxhY2Vob2xkZXI9XCJcdTc1MjhcdTYyMzdcdTU0MERcIiBhdXRvY29tcGxldGU9XCJ1c2VybmFtZVwiLz5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCIgc3R5bGU9XCJhbGlnbi1pdGVtczpjZW50ZXI7XCI+XG4gICAgICAgICAgICA8aW5wdXQgaWQ9XCJwXCIgY2xhc3M9XCJpbnB1dFwiIHBsYWNlaG9sZGVyPVwiXHU1QkM2XHU3ODAxXCIgdHlwZT1cInBhc3N3b3JkXCIgYXV0b2NvbXBsZXRlPVwiY3VycmVudC1wYXNzd29yZFwiLz5cbiAgICAgICAgICAgIDxidXR0b24gaWQ9XCJyZXZlYWxcIiBjbGFzcz1cImJ0biBidG4tZ2hvc3RcIiBzdHlsZT1cIm1pbi13aWR0aDoxMTBweDtcIj48c3BhbiBkYXRhLWljbz1cImV5ZVwiPjwvc3Bhbj5cdTY2M0VcdTc5M0E8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8YnV0dG9uIGlkPVwiZ29cIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiIHN0eWxlPVwid2lkdGg6MTAwJTttYXJnaW4tdG9wOjhweDtcIj48c3BhbiBkYXRhLWljbz1cImFycm93LXJpZ2h0XCI+PC9zcGFuPlx1OEZEQlx1NTE2NVx1NkUzOFx1NjIwRjwvYnV0dG9uPlxuICAgICAgICAgIDxkaXYgc3R5bGU9XCJtYXJnaW4tdG9wOjhweDtvcGFjaXR5Oi43NTtmb250LXNpemU6MTJweDtcIj5cdTYzRDBcdTc5M0FcdUZGMUFcdTgyRTVcdThEMjZcdTYyMzdcdTRFMERcdTVCNThcdTU3MjhcdUZGMENcdTVDMDZcdTgxRUFcdTUyQThcdTUyMUJcdTVFRkFcdTVFNzZcdTc2N0JcdTVGNTVcdTMwMDI8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICBgKTtcbiAgICByb290LmlubmVySFRNTCA9ICcnO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQodmlldyk7XG5cbiAgICAvLyBcdTZFMzJcdTY3RDNcdTYyNDBcdTY3MDlcdTU2RkVcdTY4MDdcbiAgICB0cnkge1xuICAgICAgdmlldy5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1pY29dJykuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgY29uc3QgbmFtZSA9IChlbCBhcyBIVE1MRWxlbWVudCkuZ2V0QXR0cmlidXRlKCdkYXRhLWljbycpIGFzIGFueTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBlbC5hcHBlbmRDaGlsZChyZW5kZXJJY29uKG5hbWUsIHsgc2l6ZTogMjIgfSkpO1xuICAgICAgICB9IGNhdGNoIHt9XG4gICAgICB9KTtcbiAgICB9IGNhdGNoIHt9XG5cbiAgICBjb25zdCB1RWwgPSBxczxIVE1MSW5wdXRFbGVtZW50Pih2aWV3LCAnI3UnKTtcbiAgICBjb25zdCBwRWwgPSBxczxIVE1MSW5wdXRFbGVtZW50Pih2aWV3LCAnI3AnKTtcbiAgICBjb25zdCBnbyA9IHFzPEhUTUxCdXR0b25FbGVtZW50Pih2aWV3LCAnI2dvJyk7XG4gICAgY29uc3QgcmV2ZWFsID0gcXM8SFRNTEJ1dHRvbkVsZW1lbnQ+KHZpZXcsICcjcmV2ZWFsJyk7XG5cbiAgICAvLyBcdTRGN0ZcdTc1MjggcmVxdWVzdEFuaW1hdGlvbkZyYW1lIFx1Nzg2RVx1NEZERFx1NkUzMlx1NjdEM1x1NUI4Q1x1NjIxMFx1NTQwRVx1N0FDQlx1NTM3M1x1ODA1QVx1NzEyNlxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICB1RWwuZm9jdXMoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgY29uc3Qgc3VibWl0ID0gYXN5bmMgKCkgPT4ge1xuICAgICAgaWYgKGdvLmRpc2FibGVkKSByZXR1cm47IC8vIFx1OTYzMlx1NkI2Mlx1OTFDRFx1NTkwRFx1NzBCOVx1NTFGQlxuICAgICAgXG4gICAgICBjb25zdCB1c2VybmFtZSA9ICh1RWwudmFsdWUgfHwgJycpLnRyaW0oKTtcbiAgICAgIGNvbnN0IHBhc3N3b3JkID0gKHBFbC52YWx1ZSB8fCAnJykudHJpbSgpO1xuICAgICAgaWYgKCF1c2VybmFtZSB8fCAhcGFzc3dvcmQpIHtcbiAgICAgICAgc2hvd1RvYXN0KCdcdThCRjdcdTU4NkJcdTUxOTlcdTc1MjhcdTYyMzdcdTU0MERcdTU0OENcdTVCQzZcdTc4MDEnLCAnd2FybicpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAodXNlcm5hbWUubGVuZ3RoIDwgMyB8fCB1c2VybmFtZS5sZW5ndGggPiAyMCkge1xuICAgICAgICBzaG93VG9hc3QoJ1x1NzUyOFx1NjIzN1x1NTQwRFx1OTU3Rlx1NUVBNlx1NUU5NFx1NTcyOCAzLTIwIFx1NEUyQVx1NUI1N1x1N0IyNlx1NEU0Qlx1OTVGNCcsICd3YXJuJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChwYXNzd29yZC5sZW5ndGggPCAzKSB7XG4gICAgICAgIHNob3dUb2FzdCgnXHU1QkM2XHU3ODAxXHU4MUYzXHU1QzExXHU5NzAwXHU4OTgxIDMgXHU0RTJBXHU1QjU3XHU3QjI2JywgJ3dhcm4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgZ28uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgY29uc3Qgb3JpZ2luYWxIVE1MID0gZ28uaW5uZXJIVE1MO1xuICAgICAgZ28uaW5uZXJIVE1MID0gJzxzcGFuIGRhdGEtaWNvPVwiYXJyb3ctcmlnaHRcIj48L3NwYW4+XHU3NjdCXHU1RjU1XHU0RTJEXHUyMDI2JztcbiAgICAgIHRyeSB7XG4gICAgICAgIHZpZXcucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtaWNvXScpLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgICAgY29uc3QgbmFtZSA9IChlbCBhcyBIVE1MRWxlbWVudCkuZ2V0QXR0cmlidXRlKCdkYXRhLWljbycpIGFzIGFueTtcbiAgICAgICAgICB0cnkgeyBlbC5hcHBlbmRDaGlsZChyZW5kZXJJY29uKG5hbWUsIHsgc2l6ZTogMjAgfSkpOyB9IGNhdGNoIHt9XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCB7fVxuICAgICAgXG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBHYW1lTWFuYWdlci5JLmxvZ2luT3JSZWdpc3Rlcih1c2VybmFtZSwgcGFzc3dvcmQpO1xuICAgICAgICBsb2NhdGlvbi5oYXNoID0gJyMvbWFpbic7XG4gICAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgICAgc2hvd1RvYXN0KGU/Lm1lc3NhZ2UgfHwgJ1x1NzY3Qlx1NUY1NVx1NTkzMVx1OEQyNVx1RkYwQ1x1OEJGN1x1OTFDRFx1OEJENScsICdlcnJvcicpO1xuICAgICAgICAvLyBcdTU5MzFcdThEMjVcdTY1RjZcdTYwNjJcdTU5MERcdTYzMDlcdTk0QUVcbiAgICAgICAgZ28uaW5uZXJIVE1MID0gb3JpZ2luYWxIVE1MO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHZpZXcucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtaWNvXScpLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBuYW1lID0gKGVsIGFzIEhUTUxFbGVtZW50KS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWNvJykgYXMgYW55O1xuICAgICAgICAgICAgdHJ5IHsgZWwuYXBwZW5kQ2hpbGQocmVuZGVySWNvbihuYW1lLCB7IHNpemU6IDIwIH0pKTsgfSBjYXRjaCB7fVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIHt9XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBnby5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBnby5vbmNsaWNrID0gc3VibWl0O1xuICAgIHVFbC5vbmtleXVwID0gKGUpID0+IHsgaWYgKChlIGFzIEtleWJvYXJkRXZlbnQpLmtleSA9PT0gJ0VudGVyJykgc3VibWl0KCk7IH07XG4gICAgcEVsLm9ua2V5dXAgPSAoZSkgPT4geyBpZiAoKGUgYXMgS2V5Ym9hcmRFdmVudCkua2V5ID09PSAnRW50ZXInKSBzdWJtaXQoKTsgfTtcbiAgICByZXZlYWwub25jbGljayA9ICgpID0+IHtcbiAgICAgIGNvbnN0IGlzUHdkID0gcEVsLnR5cGUgPT09ICdwYXNzd29yZCc7XG4gICAgICBwRWwudHlwZSA9IGlzUHdkID8gJ3RleHQnIDogJ3Bhc3N3b3JkJztcbiAgICAgIHJldmVhbC5pbm5lckhUTUwgPSAnJztcbiAgICAgIHJldmVhbC5hcHBlbmRDaGlsZChyZW5kZXJJY29uKGlzUHdkID8gJ2V5ZS1vZmYnIDogJ2V5ZScsIHsgc2l6ZTogMjAgfSkpO1xuICAgICAgcmV2ZWFsLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGlzUHdkID8gJ1x1OTY5MFx1ODVDRicgOiAnXHU2NjNFXHU3OTNBJykpO1xuICAgIH07XG4gIH1cbn1cbiIsICJleHBvcnQgY29uc3QgQVBJX0JBU0UgPSAod2luZG93IGFzIGFueSkuX19BUElfQkFTRV9fIHx8ICdodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpJztcclxuZXhwb3J0IGNvbnN0IFdTX0VORFBPSU5UID0gKHdpbmRvdyBhcyBhbnkpLl9fV1NfRU5EUE9JTlRfXyB8fCAnaHR0cDovL2xvY2FsaG9zdDozMDAwL2dhbWUnO1xyXG5cclxuXHJcbiIsICJpbXBvcnQgeyBXU19FTkRQT0lOVCB9IGZyb20gJy4vRW52JztcblxudHlwZSBIYW5kbGVyID0gKGRhdGE6IGFueSkgPT4gdm9pZDtcblxuZXhwb3J0IGNsYXNzIFJlYWx0aW1lQ2xpZW50IHtcbiAgcHJpdmF0ZSBzdGF0aWMgX2luc3RhbmNlOiBSZWFsdGltZUNsaWVudDtcbiAgc3RhdGljIGdldCBJKCk6IFJlYWx0aW1lQ2xpZW50IHtcbiAgICByZXR1cm4gdGhpcy5faW5zdGFuY2UgPz8gKHRoaXMuX2luc3RhbmNlID0gbmV3IFJlYWx0aW1lQ2xpZW50KCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBzb2NrZXQ6IGFueSB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGhhbmRsZXJzOiBSZWNvcmQ8c3RyaW5nLCBIYW5kbGVyW10+ID0ge307XG5cbiAgY29ubmVjdCh0b2tlbjogc3RyaW5nKSB7XG4gICAgY29uc3QgdyA9IHdpbmRvdyBhcyBhbnk7XG4gICAgaWYgKHcuaW8pIHtcbiAgICAgIC8vIFx1NTk4Mlx1Njc5Q1x1NURGMlx1OEZERVx1NjNBNVx1NEUxNHRva2VuXHU3NkY4XHU1NDBDXHVGRjBDXHU0RTBEXHU5MUNEXHU1OTBEXHU4RkRFXHU2M0E1XG4gICAgICBpZiAodGhpcy5zb2NrZXQgJiYgKHRoaXMuc29ja2V0LmNvbm5lY3RlZCB8fCB0aGlzLnNvY2tldC5jb25uZWN0aW5nKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBcbiAgICAgIC8vIFx1NjVBRFx1NUYwMFx1NjVFN1x1OEZERVx1NjNBNVxuICAgICAgaWYgKHRoaXMuc29ja2V0KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdGhpcy5zb2NrZXQuZGlzY29ubmVjdCgpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKCdbUmVhbHRpbWVDbGllbnRdIERpc2Nvbm5lY3QgZXJyb3I6JywgZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy8gXHU1RUZBXHU3QUNCXHU2NUIwXHU4RkRFXHU2M0E1XG4gICAgICB0aGlzLnNvY2tldCA9IHcuaW8oV1NfRU5EUE9JTlQsIHsgYXV0aDogeyB0b2tlbiB9IH0pO1xuICAgICAgXG4gICAgICB0aGlzLnNvY2tldC5vbignY29ubmVjdCcsICgpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ1tSZWFsdGltZUNsaWVudF0gQ29ubmVjdGVkIHRvIFdlYlNvY2tldCcpO1xuICAgICAgfSk7XG4gICAgICBcbiAgICAgIHRoaXMuc29ja2V0Lm9uKCdkaXNjb25uZWN0JywgKCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnW1JlYWx0aW1lQ2xpZW50XSBEaXNjb25uZWN0ZWQgZnJvbSBXZWJTb2NrZXQnKTtcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICB0aGlzLnNvY2tldC5vbignY29ubmVjdF9lcnJvcicsIChlcnJvcjogYW55KSA9PiB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ1tSZWFsdGltZUNsaWVudF0gQ29ubmVjdGlvbiBlcnJvcjonLCBlcnJvcik7XG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgdGhpcy5zb2NrZXQub25BbnkoKGV2ZW50OiBzdHJpbmcsIHBheWxvYWQ6IGFueSkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnW1JlYWx0aW1lQ2xpZW50XSBFdmVudCByZWNlaXZlZDonLCBldmVudCwgcGF5bG9hZCk7XG4gICAgICAgIHRoaXMuZW1pdExvY2FsKGV2ZW50LCBwYXlsb2FkKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBzb2NrZXQuaW8gY2xpZW50IG5vdCBsb2FkZWQ7IGRpc2FibGUgcmVhbHRpbWUgdXBkYXRlc1xuICAgICAgY29uc29sZS53YXJuKCdbUmVhbHRpbWVDbGllbnRdIHNvY2tldC5pbyBub3QgbG9hZGVkJyk7XG4gICAgICB0aGlzLnNvY2tldCA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgb24oZXZlbnQ6IHN0cmluZywgaGFuZGxlcjogSGFuZGxlcikge1xuICAgICh0aGlzLmhhbmRsZXJzW2V2ZW50XSB8fD0gW10pLnB1c2goaGFuZGxlcik7XG4gIH1cblxuICBvZmYoZXZlbnQ6IHN0cmluZywgaGFuZGxlcjogSGFuZGxlcikge1xuICAgIGNvbnN0IGFyciA9IHRoaXMuaGFuZGxlcnNbZXZlbnRdO1xuICAgIGlmICghYXJyKSByZXR1cm47XG4gICAgY29uc3QgaWR4ID0gYXJyLmluZGV4T2YoaGFuZGxlcik7XG4gICAgaWYgKGlkeCA+PSAwKSBhcnIuc3BsaWNlKGlkeCwgMSk7XG4gIH1cblxuICBwcml2YXRlIGVtaXRMb2NhbChldmVudDogc3RyaW5nLCBwYXlsb2FkOiBhbnkpIHtcbiAgICAodGhpcy5oYW5kbGVyc1tldmVudF0gfHwgW10pLmZvckVhY2goKGgpID0+IGgocGF5bG9hZCkpO1xuICB9XG59XG4iLCAiaW1wb3J0IHsgR2FtZU1hbmFnZXIgfSBmcm9tICcuLi9jb3JlL0dhbWVNYW5hZ2VyJztcbmltcG9ydCB7IHJlbmRlckljb24gfSBmcm9tICcuL0ljb24nO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyTmF2KGFjdGl2ZTogc3RyaW5nKTogSFRNTEVsZW1lbnQge1xuICBjb25zdCB0YWJzOiB7IGtleTogc3RyaW5nOyB0ZXh0OiBzdHJpbmc7IGhyZWY6IHN0cmluZzsgaWNvbjogYW55IH1bXSA9IFtcbiAgICB7IGtleTogJ21haW4nLCB0ZXh0OiAnXHU0RTNCXHU5ODc1JywgaHJlZjogJyMvbWFpbicsIGljb246ICdob21lJyB9LFxuICAgIHsga2V5OiAnd2FyZWhvdXNlJywgdGV4dDogJ1x1NEVEM1x1NUU5MycsIGhyZWY6ICcjL3dhcmVob3VzZScsIGljb246ICd3YXJlaG91c2UnIH0sXG4gICAgeyBrZXk6ICdwbHVuZGVyJywgdGV4dDogJ1x1NjNBMFx1NTkzQScsIGhyZWY6ICcjL3BsdW5kZXInLCBpY29uOiAncGx1bmRlcicgfSxcbiAgICB7IGtleTogJ2V4Y2hhbmdlJywgdGV4dDogJ1x1NEVBNFx1NjYxM1x1NjI0MCcsIGhyZWY6ICcjL2V4Y2hhbmdlJywgaWNvbjogJ2V4Y2hhbmdlJyB9LFxuICAgIHsga2V5OiAncmFua2luZycsIHRleHQ6ICdcdTYzOTJcdTg4NEMnLCBocmVmOiAnIy9yYW5raW5nJywgaWNvbjogJ3JhbmtpbmcnIH0sXG4gIF07XG4gIGNvbnN0IHdyYXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgd3JhcC5jbGFzc05hbWUgPSAnbmF2JztcbiAgZm9yIChjb25zdCB0IG9mIHRhYnMpIHtcbiAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGEuaHJlZiA9IHQuaHJlZjtcbiAgICBjb25zdCBpY28gPSByZW5kZXJJY29uKHQuaWNvbiwgeyBzaXplOiAxOCwgY2xhc3NOYW1lOiAnaWNvJyB9KTtcbiAgICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBsYWJlbC50ZXh0Q29udGVudCA9IHQudGV4dDtcbiAgICBhLmFwcGVuZENoaWxkKGljbyk7XG4gICAgYS5hcHBlbmRDaGlsZChsYWJlbCk7XG4gICAgaWYgKHQua2V5ID09PSBhY3RpdmUpIGEuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgd3JhcC5hcHBlbmRDaGlsZChhKTtcbiAgfVxuICBcbiAgLy8gXHU2REZCXHU1MkEwXHU5MDAwXHU1MUZBXHU3NjdCXHU1RjU1XHU2MzA5XHU5NEFFXG4gIGNvbnN0IGxvZ291dEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgbG9nb3V0QnRuLmhyZWYgPSAnIyc7XG4gIGxvZ291dEJ0bi5jbGFzc05hbWUgPSAnbmF2LWxvZ291dCc7XG4gIGxvZ291dEJ0bi5zdHlsZS5jc3NUZXh0ID0gJ21hcmdpbi1sZWZ0OmF1dG87b3BhY2l0eTouNzU7JztcbiAgY29uc3QgbG9nb3V0SWNvID0gcmVuZGVySWNvbignbG9nb3V0JywgeyBzaXplOiAxOCwgY2xhc3NOYW1lOiAnaWNvJyB9KTtcbiAgY29uc3QgbG9nb3V0TGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gIGxvZ291dExhYmVsLnRleHRDb250ZW50ID0gJ1x1OTAwMFx1NTFGQSc7XG4gIGxvZ291dEJ0bi5hcHBlbmRDaGlsZChsb2dvdXRJY28pO1xuICBsb2dvdXRCdG4uYXBwZW5kQ2hpbGQobG9nb3V0TGFiZWwpO1xuICBsb2dvdXRCdG4ub25jbGljayA9IChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGlmIChjb25maXJtKCdcdTc4NkVcdTVCOUFcdTg5ODFcdTkwMDBcdTUxRkFcdTc2N0JcdTVGNTVcdTU0MTdcdUZGMUYnKSkge1xuICAgICAgR2FtZU1hbmFnZXIuSS5sb2dvdXQoKTtcbiAgICB9XG4gIH07XG4gIHdyYXAuYXBwZW5kQ2hpbGQobG9nb3V0QnRuKTtcbiAgXG4gIHJldHVybiB3cmFwO1xufVxuIiwgImV4cG9ydCBjbGFzcyBDb3VudFVwVGV4dCB7XHJcbiAgcHJpdmF0ZSB2YWx1ZSA9IDA7XHJcbiAgcHJpdmF0ZSBkaXNwbGF5ID0gJzAnO1xyXG4gIHByaXZhdGUgYW5pbT86IG51bWJlcjtcclxuICBvblVwZGF0ZT86ICh0ZXh0OiBzdHJpbmcpID0+IHZvaWQ7XHJcblxyXG4gIHNldChuOiBudW1iZXIpIHtcclxuICAgIHRoaXMudmFsdWUgPSBuO1xyXG4gICAgdGhpcy5kaXNwbGF5ID0gdGhpcy5mb3JtYXQobik7XHJcbiAgICB0aGlzLm9uVXBkYXRlPy4odGhpcy5kaXNwbGF5KTtcclxuICB9XHJcblxyXG4gIHRvKG46IG51bWJlciwgZHVyYXRpb24gPSA1MDApIHtcclxuICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuYW5pbSEpO1xyXG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLnZhbHVlO1xyXG4gICAgY29uc3QgZGVsdGEgPSBuIC0gc3RhcnQ7XHJcbiAgICBjb25zdCB0MCA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgY29uc3Qgc3RlcCA9ICh0OiBudW1iZXIpID0+IHtcclxuICAgICAgY29uc3QgcCA9IE1hdGgubWluKDEsICh0IC0gdDApIC8gZHVyYXRpb24pO1xyXG4gICAgICBjb25zdCBlYXNlID0gMSAtIE1hdGgucG93KDEgLSBwLCAzKTtcclxuICAgICAgY29uc3QgY3VyciA9IHN0YXJ0ICsgZGVsdGEgKiBlYXNlO1xyXG4gICAgICB0aGlzLmRpc3BsYXkgPSB0aGlzLmZvcm1hdChjdXJyKTtcclxuICAgICAgdGhpcy5vblVwZGF0ZT8uKHRoaXMuZGlzcGxheSk7XHJcbiAgICAgIGlmIChwIDwgMSkgdGhpcy5hbmltID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApO1xyXG4gICAgICBlbHNlIHRoaXMudmFsdWUgPSBuO1xyXG4gICAgfTtcclxuICAgIHRoaXMuYW5pbSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZm9ybWF0KG46IG51bWJlcikge1xyXG4gICAgcmV0dXJuIE1hdGguZmxvb3IobikudG9Mb2NhbGVTdHJpbmcoKTtcclxuICB9XHJcbn1cclxuXHJcblxyXG4iLCAiaW1wb3J0IHsgTmV0d29ya01hbmFnZXIgfSBmcm9tICcuLi9jb3JlL05ldHdvcmtNYW5hZ2VyJztcbmltcG9ydCB7IHJlbmRlckljb24gfSBmcm9tICcuL0ljb24nO1xuaW1wb3J0IHsgQ291bnRVcFRleHQgfSBmcm9tICcuL0NvdW50VXBUZXh0JztcblxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlclJlc291cmNlQmFyKCkge1xuICBjb25zdCBib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgYm94LmNsYXNzTmFtZSA9ICdjb250YWluZXInO1xuICBjb25zdCBjYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNhcmQuY2xhc3NOYW1lID0gJ2NhcmQgZmFkZS1pbic7XG4gIGNhcmQuaW5uZXJIVE1MID0gYFxuICAgIDxkaXYgY2xhc3M9XCJzdGF0c1wiPlxuICAgICAgPGRpdiBjbGFzcz1cInN0YXQgc3RhdC1hbmltYXRlZFwiIGlkPVwib3JlLXN0YXRcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImljb1wiIGRhdGEtaWNvPVwib3JlXCI+PC9kaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9XCJkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDoycHg7XCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInZhbFwiIGlkPVwib3JlXCI+MDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJsYWJlbFwiPlx1NzdGRlx1NzdGMzwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPHN2ZyBjbGFzcz1cInN0YXQtcGFydGljbGVzXCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiIHZpZXdCb3g9XCIwIDAgMTAwIDUwXCIgc3R5bGU9XCJwb3NpdGlvbjphYnNvbHV0ZTtpbnNldDowO3BvaW50ZXItZXZlbnRzOm5vbmU7XCI+XG4gICAgICAgICAgPGNpcmNsZSBjbGFzcz1cInN0YXQtcGFydGljbGUgc3AxXCIgY3g9XCIyMFwiIGN5PVwiMjVcIiByPVwiMS41XCIgZmlsbD1cIiM3QjJDRjVcIiBvcGFjaXR5PVwiMFwiLz5cbiAgICAgICAgICA8Y2lyY2xlIGNsYXNzPVwic3RhdC1wYXJ0aWNsZSBzcDJcIiBjeD1cIjUwXCIgY3k9XCIyNVwiIHI9XCIxXCIgZmlsbD1cIiMyQzg5RjVcIiBvcGFjaXR5PVwiMFwiLz5cbiAgICAgICAgICA8Y2lyY2xlIGNsYXNzPVwic3RhdC1wYXJ0aWNsZSBzcDNcIiBjeD1cIjgwXCIgY3k9XCIyNVwiIHI9XCIxLjVcIiBmaWxsPVwiI2Y2YzQ0NVwiIG9wYWNpdHk9XCIwXCIvPlxuICAgICAgICA8L3N2Zz5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cInN0YXQgc3RhdC1hbmltYXRlZFwiIGlkPVwiY29pbi1zdGF0XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJpY29cIiBkYXRhLWljbz1cImNvaW5cIj48L2Rpdj5cbiAgICAgICAgPGRpdiBzdHlsZT1cImRpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjJweDtcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwidmFsXCIgaWQ9XCJjb2luXCI+MDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJsYWJlbFwiPkJCPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8c3ZnIGNsYXNzPVwic3RhdC1wYXJ0aWNsZXNcIiB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCIgdmlld0JveD1cIjAgMCAxMDAgNTBcIiBzdHlsZT1cInBvc2l0aW9uOmFic29sdXRlO2luc2V0OjA7cG9pbnRlci1ldmVudHM6bm9uZTtcIj5cbiAgICAgICAgICA8Y2lyY2xlIGNsYXNzPVwic3RhdC1wYXJ0aWNsZSBzcDFcIiBjeD1cIjIwXCIgY3k9XCIyNVwiIHI9XCIxLjVcIiBmaWxsPVwiI2Y2YzQ0NVwiIG9wYWNpdHk9XCIwXCIvPlxuICAgICAgICAgIDxjaXJjbGUgY2xhc3M9XCJzdGF0LXBhcnRpY2xlIHNwMlwiIGN4PVwiNTBcIiBjeT1cIjI1XCIgcj1cIjFcIiBmaWxsPVwiI2ZmZDcwMFwiIG9wYWNpdHk9XCIwXCIvPlxuICAgICAgICAgIDxjaXJjbGUgY2xhc3M9XCJzdGF0LXBhcnRpY2xlIHNwM1wiIGN4PVwiODBcIiBjeT1cIjI1XCIgcj1cIjEuNVwiIGZpbGw9XCIjZTM2NDE0XCIgb3BhY2l0eT1cIjBcIi8+XG4gICAgICAgIDwvc3ZnPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIGA7XG4gIGJveC5hcHBlbmRDaGlsZChjYXJkKTtcbiAgLy8gaW5qZWN0IGljb25zXG4gIHRyeSB7XG4gICAgY29uc3Qgb3JlSWNvID0gY2FyZC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1pY289XCJvcmVcIl0nKTtcbiAgICBjb25zdCBjb2luSWNvID0gY2FyZC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1pY289XCJjb2luXCJdJyk7XG4gICAgaWYgKG9yZUljbykgb3JlSWNvLmFwcGVuZENoaWxkKHJlbmRlckljb24oJ29yZScsIHsgc2l6ZTogMTggfSkpO1xuICAgIGlmIChjb2luSWNvKSBjb2luSWNvLmFwcGVuZENoaWxkKHJlbmRlckljb24oJ2NvaW4nLCB7IHNpemU6IDE4IH0pKTtcbiAgfSBjYXRjaCB7fVxuICBcbiAgY29uc3Qgb3JlRWwgPSBjYXJkLnF1ZXJ5U2VsZWN0b3IoJyNvcmUnKSBhcyBIVE1MRWxlbWVudDtcbiAgY29uc3QgY29pbkVsID0gY2FyZC5xdWVyeVNlbGVjdG9yKCcjY29pbicpIGFzIEhUTUxFbGVtZW50O1xuICBcbiAgY29uc3Qgb3JlQ291bnRlciA9IG5ldyBDb3VudFVwVGV4dCgpO1xuICBjb25zdCBjb2luQ291bnRlciA9IG5ldyBDb3VudFVwVGV4dCgpO1xuICBvcmVDb3VudGVyLm9uVXBkYXRlID0gKHRleHQpID0+IHsgb3JlRWwudGV4dENvbnRlbnQgPSB0ZXh0OyB9O1xuICBjb2luQ291bnRlci5vblVwZGF0ZSA9ICh0ZXh0KSA9PiB7IGNvaW5FbC50ZXh0Q29udGVudCA9IHRleHQ7IH07XG4gIFxuICBsZXQgcHJldk9yZSA9IDA7XG4gIGxldCBwcmV2Q29pbiA9IDA7XG4gIFxuICBhc3luYyBmdW5jdGlvbiB1cGRhdGUoKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHAgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyBpZDogc3RyaW5nOyB1c2VybmFtZTogc3RyaW5nOyBuaWNrbmFtZTogc3RyaW5nOyBvcmVBbW91bnQ6IG51bWJlcjsgYmJDb2luczogbnVtYmVyIH0+KCcvdXNlci9wcm9maWxlJyk7XG4gICAgICBcbiAgICAgIC8vIFx1NEY3Rlx1NzUyOFx1OEJBMVx1NjU3MFx1NTJBOFx1NzUzQlx1NjZGNFx1NjVCMFxuICAgICAgaWYgKHAub3JlQW1vdW50ICE9PSBwcmV2T3JlKSB7XG4gICAgICAgIG9yZUNvdW50ZXIudG8ocC5vcmVBbW91bnQsIDgwMCk7XG4gICAgICAgIC8vIFx1NTk4Mlx1Njc5Q1x1NjYyRlx1NTg5RVx1NTJBMFx1RkYwQ1x1NkRGQlx1NTJBMFx1NTZGRVx1NjgwN1x1ODEwOVx1NTFCMlx1NjU0OFx1Njc5Q1xuICAgICAgICBpZiAocC5vcmVBbW91bnQgPiBwcmV2T3JlKSB7XG4gICAgICAgICAgY29uc3Qgb3JlSWNvbiA9IGNhcmQucXVlcnlTZWxlY3RvcignI29yZS1zdGF0IC5pY28nKTtcbiAgICAgICAgICBpZiAob3JlSWNvbikge1xuICAgICAgICAgICAgb3JlSWNvbi5jbGFzc0xpc3QuYWRkKCdwdWxzZS1pY29uJyk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IG9yZUljb24uY2xhc3NMaXN0LnJlbW92ZSgncHVsc2UtaWNvbicpLCA2MDApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBwcmV2T3JlID0gcC5vcmVBbW91bnQ7XG4gICAgICB9XG4gICAgICBcbiAgICAgIGlmIChwLmJiQ29pbnMgIT09IHByZXZDb2luKSB7XG4gICAgICAgIGNvaW5Db3VudGVyLnRvKHAuYmJDb2lucywgODAwKTtcbiAgICAgICAgaWYgKHAuYmJDb2lucyA+IHByZXZDb2luKSB7XG4gICAgICAgICAgY29uc3QgY29pbkljb24gPSBjYXJkLnF1ZXJ5U2VsZWN0b3IoJyNjb2luLXN0YXQgLmljbycpO1xuICAgICAgICAgIGlmIChjb2luSWNvbikge1xuICAgICAgICAgICAgY29pbkljb24uY2xhc3NMaXN0LmFkZCgncHVsc2UtaWNvbicpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBjb2luSWNvbi5jbGFzc0xpc3QucmVtb3ZlKCdwdWxzZS1pY29uJyksIDYwMCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHByZXZDb2luID0gcC5iYkNvaW5zO1xuICAgICAgfVxuICAgIH0gY2F0Y2gge1xuICAgICAgLy8gaWdub3JlIGZldGNoIGVycm9yczsgVUkgXHU0RjFBXHU1NzI4XHU0RTBCXHU0RTAwXHU2QjIxXHU1MjM3XHU2NUIwXHU2NUY2XHU2MDYyXHU1OTBEXG4gICAgfVxuICB9XG4gIHJldHVybiB7IHJvb3Q6IGJveCwgdXBkYXRlLCBvcmVFbCwgY29pbkVsIH07XG59XG4iLCAiaW1wb3J0IHsgaHRtbCB9IGZyb20gJy4uL3V0aWxzL2RvbSc7XHJcbmltcG9ydCB7IHJlbmRlckljb24gfSBmcm9tICcuL0ljb24nO1xyXG5pbXBvcnQgeyBOZXR3b3JrTWFuYWdlciB9IGZyb20gJy4uL2NvcmUvTmV0d29ya01hbmFnZXInO1xyXG5pbXBvcnQgeyBzaG93VG9hc3QgfSBmcm9tICcuL1RvYXN0JztcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzaG93QWREaWFsb2coKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICBjb25zdCBvdmVybGF5ID0gaHRtbChgXHJcbiAgICAgIDxkaXYgY2xhc3M9XCJhZC1vdmVybGF5XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImFkLWRpYWxvZ1wiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImFkLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFkLWljb25cIiBkYXRhLWljbz1cImluZm9cIj48L2Rpdj5cclxuICAgICAgICAgICAgPGgzIHN0eWxlPVwibWFyZ2luOjhweCAwO2ZvbnQtc2l6ZToxOHB4O1wiPlx1ODlDMlx1NzcwQlx1NUU3Rlx1NTQ0QTwvaDM+XHJcbiAgICAgICAgICAgIDxwIHN0eWxlPVwib3BhY2l0eTouODU7bWFyZ2luOjhweCAwO1wiPlx1ODlDMlx1NzcwQjE1XHU3OUQyXHU1RTdGXHU1NDRBXHU4OUM2XHU5ODkxXHU1MzczXHU1M0VGXHU2NTM2XHU3N0ZGPGJyLz5cdTVFNzZcdTk4OURcdTU5MTZcdTgzQjdcdTVGOTcgNS0xNSBcdTc3RkZcdTc3RjNcdTU5NTZcdTUyQjFcdUZGMDE8L3A+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhZC1wbGFjZWhvbGRlclwiPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhZC1wcm9ncmVzcy1yaW5nXCI+XHJcbiAgICAgICAgICAgICAgICA8c3ZnIHdpZHRoPVwiMTAwXCIgaGVpZ2h0PVwiMTAwXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxjaXJjbGUgY2xhc3M9XCJhZC1jaXJjbGUtYmdcIiBjeD1cIjUwXCIgY3k9XCI1MFwiIHI9XCI0NVwiPjwvY2lyY2xlPlxyXG4gICAgICAgICAgICAgICAgICA8Y2lyY2xlIGNsYXNzPVwiYWQtY2lyY2xlLWZnXCIgY3g9XCI1MFwiIGN5PVwiNTBcIiByPVwiNDVcIiBpZD1cImFkQ2lyY2xlXCI+PC9jaXJjbGU+XHJcbiAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhZC1jb3VudGRvd25cIiBpZD1cImFkQ291bnRkb3duXCI+MTU8L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8cCBzdHlsZT1cIm9wYWNpdHk6Ljc1O2ZvbnQtc2l6ZToxM3B4O21hcmdpbi10b3A6MTJweDtcIj5bXHU1RTdGXHU1NDRBXHU1MzYwXHU0RjREXHU3QjI2IC0gXHU1QjlFXHU5NjQ1XHU1RTk0XHU2M0E1XHU1MTY1U0RLXTwvcD5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhZC1hY3Rpb25zXCI+XHJcbiAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tZ2hvc3RcIiBpZD1cImFkU2tpcFwiPlx1OERGM1x1OEZDN1x1RkYwOFx1NjVFMFx1NTk1Nlx1NTJCMVx1RkYwOTwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIiBpZD1cImFkQ29tcGxldGVcIiBkaXNhYmxlZD5cdTk4ODZcdTUzRDZcdTU5NTZcdTUyQjE8L2J1dHRvbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICBgKSBhcyBIVE1MRWxlbWVudDtcclxuXHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG92ZXJsYXkpO1xyXG5cclxuICAgIC8vIFx1NkUzMlx1NjdEM1x1NTZGRVx1NjgwN1xyXG4gICAgdHJ5IHtcclxuICAgICAgb3ZlcmxheS5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1pY29dJykuZm9yRWFjaCgoZWwpID0+IHtcclxuICAgICAgICBjb25zdCBuYW1lID0gKGVsIGFzIEhUTUxFbGVtZW50KS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWNvJykgYXMgYW55O1xyXG4gICAgICAgIHRyeSB7IGVsLmFwcGVuZENoaWxkKHJlbmRlckljb24obmFtZSwgeyBzaXplOiA0OCB9KSk7IH0gY2F0Y2gge31cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIHt9XHJcblxyXG4gICAgY29uc3Qgc2tpcEJ0biA9IG92ZXJsYXkucXVlcnlTZWxlY3RvcignI2FkU2tpcCcpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgY29uc3QgY29tcGxldGVCdG4gPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3IoJyNhZENvbXBsZXRlJykgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgICBjb25zdCBjb3VudGRvd24gPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3IoJyNhZENvdW50ZG93bicpIGFzIEhUTUxFbGVtZW50O1xyXG4gICAgY29uc3QgY2lyY2xlID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yKCcjYWRDaXJjbGUnKSBhcyBTVkdDaXJjbGVFbGVtZW50O1xyXG5cclxuICAgIC8vIFx1NkEyMVx1NjJERjE1XHU3OUQyXHU1MDEyXHU4QkExXHU2NUY2XHJcbiAgICBsZXQgc2Vjb25kcyA9IDE1O1xyXG4gICAgY29uc3QgY2lyY3VtZmVyZW5jZSA9IDIgKiBNYXRoLlBJICogNDU7XHJcbiAgICBpZiAoY2lyY2xlKSB7XHJcbiAgICAgIGNpcmNsZS5zdHlsZS5zdHJva2VEYXNoYXJyYXkgPSBgJHtjaXJjdW1mZXJlbmNlfWA7XHJcbiAgICAgIGNpcmNsZS5zdHlsZS5zdHJva2VEYXNob2Zmc2V0ID0gYCR7Y2lyY3VtZmVyZW5jZX1gO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHRpbWVyID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICBzZWNvbmRzLS07XHJcbiAgICAgIGNvdW50ZG93bi50ZXh0Q29udGVudCA9IFN0cmluZyhzZWNvbmRzKTtcclxuICAgICAgXHJcbiAgICAgIGlmIChjaXJjbGUpIHtcclxuICAgICAgICBjb25zdCBvZmZzZXQgPSBjaXJjdW1mZXJlbmNlICogKHNlY29uZHMgLyAxNSk7XHJcbiAgICAgICAgY2lyY2xlLnN0eWxlLnN0cm9rZURhc2hvZmZzZXQgPSBTdHJpbmcob2Zmc2V0KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHNlY29uZHMgPD0gMCkge1xyXG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGltZXIpO1xyXG4gICAgICAgIGNvbXBsZXRlQnRuLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgICAgY29tcGxldGVCdG4uY2xhc3NMaXN0LmFkZCgnYnRuLWVuZXJneScpO1xyXG4gICAgICB9XHJcbiAgICB9LCAxMDAwKTtcclxuXHJcbiAgICBjb25zdCBjbGVhbnVwID0gKCkgPT4ge1xyXG4gICAgICBjbGVhckludGVydmFsKHRpbWVyKTtcclxuICAgICAgb3ZlcmxheS5yZW1vdmUoKTtcclxuICAgIH07XHJcblxyXG4gICAgc2tpcEJ0bi5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgICBjbGVhbnVwKCk7XHJcbiAgICAgIHJlc29sdmUoZmFsc2UpO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb21wbGV0ZUJ0bi5vbmNsaWNrID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IHN1Y2Nlc3M6IGJvb2xlYW47IHJld2FyZD86IG51bWJlciB9PignL3VzZXIvd2F0Y2gtYWQnLCB7IG1ldGhvZDogJ1BPU1QnIH0pO1xyXG4gICAgICAgIGlmIChyZXMuc3VjY2VzcyAmJiByZXMucmV3YXJkKSB7XHJcbiAgICAgICAgICBzaG93VG9hc3QoYFx1RDgzQ1x1REY4MSBcdTVFN0ZcdTU0NEFcdTU5NTZcdTUyQjFcdUZGMUFcdTgzQjdcdTVGOTcgJHtyZXMucmV3YXJkfSBcdTc3RkZcdTc3RjNgLCAnc3VjY2VzcycpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBjYXRjaCAoZTogYW55KSB7XHJcbiAgICAgICAgc2hvd1RvYXN0KGU/Lm1lc3NhZ2UgfHwgJ1x1NUU3Rlx1NTQ0QVx1NTk1Nlx1NTJCMVx1OTg4Nlx1NTNENlx1NTkzMVx1OEQyNScsICdlcnJvcicpO1xyXG4gICAgICB9XHJcbiAgICAgIGNsZWFudXAoKTtcclxuICAgICAgcmVzb2x2ZSh0cnVlKTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gXHU3MEI5XHU1MUZCXHU5MDZFXHU3RjY5XHU0RTBEXHU1MTczXHU5NUVEXHVGRjA4XHU5NjMyXHU4QkVGXHU2NENEXHU0RjVDXHVGRjA5XHJcbiAgICBvdmVybGF5Lm9uY2xpY2sgPSAoZSkgPT4ge1xyXG4gICAgICBpZiAoZS50YXJnZXQgPT09IG92ZXJsYXkpIHtcclxuICAgICAgICBzaG93VG9hc3QoJ1x1OEJGN1x1ODlDMlx1NzcwQlx1NUI4Q1x1NUU3Rlx1NTQ0QVx1NjIxNlx1OTAwOVx1NjJFOVx1OERGM1x1OEZDNycsICd3YXJuJyk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfSk7XHJcbn1cclxuXHJcbiIsICJpbXBvcnQgeyBodG1sIH0gZnJvbSAnLi4vdXRpbHMvZG9tJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVNaW5lckFuaW1hdGlvbigpOiBIVE1MRWxlbWVudCB7XHJcbiAgY29uc3QgY29udGFpbmVyID0gaHRtbChgXHJcbiAgICA8ZGl2IGNsYXNzPVwibWluZXItYW5pbWF0aW9uXCI+XHJcbiAgICAgIDxzdmcgY2xhc3M9XCJtaW5lci1zdmdcIiB2aWV3Qm94PVwiMCAwIDIwMCAyMDBcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XHJcbiAgICAgICAgPGRlZnM+XHJcbiAgICAgICAgICA8bGluZWFyR3JhZGllbnQgaWQ9XCJtaW5lckdyYWRcIiB4MT1cIjAlXCIgeTE9XCIwJVwiIHgyPVwiMTAwJVwiIHkyPVwiMTAwJVwiPlxyXG4gICAgICAgICAgICA8c3RvcCBvZmZzZXQ9XCIwJVwiIHN0b3AtY29sb3I9XCIjN0IyQ0Y1XCIgLz5cclxuICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PVwiMTAwJVwiIHN0b3AtY29sb3I9XCIjMkM4OUY1XCIgLz5cclxuICAgICAgICAgIDwvbGluZWFyR3JhZGllbnQ+XHJcbiAgICAgICAgICA8ZmlsdGVyIGlkPVwibWluZXJHbG93XCI+XHJcbiAgICAgICAgICAgIDxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249XCIyXCIgcmVzdWx0PVwiY29sb3JlZEJsdXJcIi8+XHJcbiAgICAgICAgICAgIDxmZU1lcmdlPlxyXG4gICAgICAgICAgICAgIDxmZU1lcmdlTm9kZSBpbj1cImNvbG9yZWRCbHVyXCIvPlxyXG4gICAgICAgICAgICAgIDxmZU1lcmdlTm9kZSBpbj1cIlNvdXJjZUdyYXBoaWNcIi8+XHJcbiAgICAgICAgICAgIDwvZmVNZXJnZT5cclxuICAgICAgICAgIDwvZmlsdGVyPlxyXG4gICAgICAgIDwvZGVmcz5cclxuICAgICAgICBcclxuICAgICAgICA8IS0tIFx1NzdGRlx1NURFNVx1OEVBQlx1NEY1MyAtLT5cclxuICAgICAgICA8ZyBjbGFzcz1cIm1pbmVyLWJvZHlcIj5cclxuICAgICAgICAgIDwhLS0gXHU1OTM0XHU3NkQ0IC0tPlxyXG4gICAgICAgICAgPGVsbGlwc2UgY3g9XCIxMDBcIiBjeT1cIjcwXCIgcng9XCIyMFwiIHJ5PVwiMThcIiBmaWxsPVwidXJsKCNtaW5lckdyYWQpXCIgZmlsdGVyPVwidXJsKCNtaW5lckdsb3cpXCIvPlxyXG4gICAgICAgICAgPGNpcmNsZSBjeD1cIjEwMFwiIGN5PVwiNjVcIiByPVwiOFwiIGZpbGw9XCIjZjZjNDQ1XCIgb3BhY2l0eT1cIjAuOVwiIGNsYXNzPVwibWluZXItbGlnaHRcIi8+XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIDwhLS0gXHU4RUFCXHU0RjUzIC0tPlxyXG4gICAgICAgICAgPHJlY3QgeD1cIjg1XCIgeT1cIjg1XCIgd2lkdGg9XCIzMFwiIGhlaWdodD1cIjM1XCIgcng9XCI1XCIgZmlsbD1cInVybCgjbWluZXJHcmFkKVwiIG9wYWNpdHk9XCIwLjhcIi8+XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIDwhLS0gXHU2MjRCXHU4MUMyXHVGRjA4XHU2MzI1XHU1MkE4XHVGRjA5IC0tPlxyXG4gICAgICAgICAgPGcgY2xhc3M9XCJtaW5lci1hcm1cIj5cclxuICAgICAgICAgICAgPGxpbmUgeDE9XCIxMTBcIiB5MT1cIjk1XCIgeDI9XCIxMzBcIiB5Mj1cIjg1XCIgc3Ryb2tlPVwidXJsKCNtaW5lckdyYWQpXCIgc3Ryb2tlLXdpZHRoPVwiNlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIi8+XHJcbiAgICAgICAgICAgIDwhLS0gXHU5NTUwXHU1QjUwIC0tPlxyXG4gICAgICAgICAgICA8ZyBjbGFzcz1cIm1pbmVyLXBpY2theGVcIj5cclxuICAgICAgICAgICAgICA8bGluZSB4MT1cIjEzMFwiIHkxPVwiODVcIiB4Mj1cIjE0NVwiIHkyPVwiNzBcIiBzdHJva2U9XCIjZjZjNDQ1XCIgc3Ryb2tlLXdpZHRoPVwiM1wiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIi8+XHJcbiAgICAgICAgICAgICAgPHBvbHlnb24gcG9pbnRzPVwiMTQ1LDcwIDE1NSw2NSAxNTAsNzVcIiBmaWxsPVwiIzg4OFwiIHN0cm9rZT1cIiM2NjZcIiBzdHJva2Utd2lkdGg9XCIxXCIvPlxyXG4gICAgICAgICAgICA8L2c+XHJcbiAgICAgICAgICA8L2c+XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIDwhLS0gXHU4MTdGIC0tPlxyXG4gICAgICAgICAgPHJlY3QgeD1cIjkwXCIgeT1cIjEyMFwiIHdpZHRoPVwiOFwiIGhlaWdodD1cIjIwXCIgcng9XCIzXCIgZmlsbD1cInVybCgjbWluZXJHcmFkKVwiIG9wYWNpdHk9XCIwLjdcIi8+XHJcbiAgICAgICAgICA8cmVjdCB4PVwiMTAyXCIgeT1cIjEyMFwiIHdpZHRoPVwiOFwiIGhlaWdodD1cIjIwXCIgcng9XCIzXCIgZmlsbD1cInVybCgjbWluZXJHcmFkKVwiIG9wYWNpdHk9XCIwLjdcIi8+XHJcbiAgICAgICAgPC9nPlxyXG4gICAgICAgIFxyXG4gICAgICAgIDwhLS0gXHU3N0ZGXHU3N0YzXHU3QzkyXHU1QjUwIC0tPlxyXG4gICAgICAgIDxjaXJjbGUgY2xhc3M9XCJvcmUtcGFydGljbGUgcDFcIiBjeD1cIjE0MFwiIGN5PVwiMTAwXCIgcj1cIjNcIiBmaWxsPVwiIzdCMkNGNVwiIG9wYWNpdHk9XCIwXCIvPlxyXG4gICAgICAgIDxjaXJjbGUgY2xhc3M9XCJvcmUtcGFydGljbGUgcDJcIiBjeD1cIjE0NVwiIGN5PVwiMTA1XCIgcj1cIjJcIiBmaWxsPVwiIzJDODlGNVwiIG9wYWNpdHk9XCIwXCIvPlxyXG4gICAgICAgIDxjaXJjbGUgY2xhc3M9XCJvcmUtcGFydGljbGUgcDNcIiBjeD1cIjEzNVwiIGN5PVwiMTA4XCIgcj1cIjIuNVwiIGZpbGw9XCIjZjZjNDQ1XCIgb3BhY2l0eT1cIjBcIi8+XHJcbiAgICAgIDwvc3ZnPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwibWluZXItc3RhdHVzXCI+XHU2MzE2XHU3N0ZGXHU0RTJELi4uPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICBgKSBhcyBIVE1MRWxlbWVudDtcclxuICBcclxuICByZXR1cm4gY29udGFpbmVyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlSWRsZU1pbmVyKCk6IEhUTUxFbGVtZW50IHtcclxuICBjb25zdCBjb250YWluZXIgPSBodG1sKGBcclxuICAgIDxkaXYgY2xhc3M9XCJtaW5lci1pZGxlXCI+XHJcbiAgICAgIDxzdmcgdmlld0JveD1cIjAgMCAxMjAgMTIwXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxyXG4gICAgICAgIDxkZWZzPlxyXG4gICAgICAgICAgPGxpbmVhckdyYWRpZW50IGlkPVwiaWRsZUdyYWRcIiB4MT1cIjAlXCIgeTE9XCIwJVwiIHgyPVwiMTAwJVwiIHkyPVwiMTAwJVwiPlxyXG4gICAgICAgICAgICA8c3RvcCBvZmZzZXQ9XCIwJVwiIHN0b3AtY29sb3I9XCIjN0IyQ0Y1XCIgc3RvcC1vcGFjaXR5PVwiMC42XCIvPlxyXG4gICAgICAgICAgICA8c3RvcCBvZmZzZXQ9XCIxMDAlXCIgc3RvcC1jb2xvcj1cIiMyQzg5RjVcIiBzdG9wLW9wYWNpdHk9XCIwLjZcIi8+XHJcbiAgICAgICAgICA8L2xpbmVhckdyYWRpZW50PlxyXG4gICAgICAgIDwvZGVmcz5cclxuICAgICAgICBcclxuICAgICAgICA8IS0tIFx1N0I4MFx1NTM1NVx1NzY4NFx1NzdGRlx1NURFNVx1NTI2QVx1NUY3MSAtLT5cclxuICAgICAgICA8ZyBjbGFzcz1cImlkbGUtbWluZXJcIj5cclxuICAgICAgICAgIDxjaXJjbGUgY3g9XCI2MFwiIGN5PVwiNDBcIiByPVwiMTJcIiBmaWxsPVwidXJsKCNpZGxlR3JhZClcIi8+XHJcbiAgICAgICAgICA8cmVjdCB4PVwiNTBcIiB5PVwiNTBcIiB3aWR0aD1cIjIwXCIgaGVpZ2h0PVwiMjVcIiByeD1cIjNcIiBmaWxsPVwidXJsKCNpZGxlR3JhZClcIiBvcGFjaXR5PVwiMC44XCIvPlxyXG4gICAgICAgICAgPGxpbmUgeDE9XCI2NVwiIHkxPVwiNjBcIiB4Mj1cIjc1XCIgeTI9XCI1NVwiIHN0cm9rZT1cInVybCgjaWRsZUdyYWQpXCIgc3Ryb2tlLXdpZHRoPVwiNFwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIi8+XHJcbiAgICAgICAgICA8bGluZSB4MT1cIjc1XCIgeTE9XCI1NVwiIHgyPVwiODVcIiB5Mj1cIjUwXCIgc3Ryb2tlPVwiI2Y2YzQ0NVwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIvPlxyXG4gICAgICAgIDwvZz5cclxuICAgICAgPC9zdmc+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJtaW5lci1zdGF0dXNcIiBzdHlsZT1cIm9wYWNpdHk6LjY7XCI+XHU1Rjg1XHU2NzNBXHU0RTJEPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICBgKSBhcyBIVE1MRWxlbWVudDtcclxuICBcclxuICByZXR1cm4gY29udGFpbmVyO1xyXG59XHJcblxyXG4iLCAiaW1wb3J0IHsgaHRtbCB9IGZyb20gJy4uL3V0aWxzL2RvbSc7XHJcblxyXG4vLyBcdTVCOURcdTdCQjFcdTUyQThcdTc1M0JcdUZGMDhcdTY1MzZcdTc3RkZcdTYzMDlcdTk0QUVcdUZGMDlcclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVRyZWFzdXJlQ2hlc3QoKTogSFRNTEVsZW1lbnQge1xyXG4gIHJldHVybiBodG1sKGBcclxuICAgIDxzdmcgY2xhc3M9XCJ0cmVhc3VyZS1jaGVzdFwiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XHJcbiAgICAgIDxkZWZzPlxyXG4gICAgICAgIDxsaW5lYXJHcmFkaWVudCBpZD1cImNoZXN0R3JhZFwiIHgxPVwiMCVcIiB5MT1cIjAlXCIgeDI9XCIxMDAlXCIgeTI9XCIxMDAlXCI+XHJcbiAgICAgICAgICA8c3RvcCBvZmZzZXQ9XCIwJVwiIHN0b3AtY29sb3I9XCIjZjZjNDQ1XCIvPlxyXG4gICAgICAgICAgPHN0b3Agb2Zmc2V0PVwiMTAwJVwiIHN0b3AtY29sb3I9XCIjZTM2NDE0XCIvPlxyXG4gICAgICAgIDwvbGluZWFyR3JhZGllbnQ+XHJcbiAgICAgIDwvZGVmcz5cclxuICAgICAgPGcgY2xhc3M9XCJjaGVzdC1ib2R5XCI+XHJcbiAgICAgICAgPHJlY3QgeD1cIjRcIiB5PVwiMTJcIiB3aWR0aD1cIjE2XCIgaGVpZ2h0PVwiMTBcIiByeD1cIjFcIiBmaWxsPVwidXJsKCNjaGVzdEdyYWQpXCIgc3Ryb2tlPVwiI2I4ODYwYlwiIHN0cm9rZS13aWR0aD1cIjAuNVwiLz5cclxuICAgICAgICA8cmVjdCB4PVwiNlwiIHk9XCIxMFwiIHdpZHRoPVwiMTJcIiBoZWlnaHQ9XCIzXCIgcng9XCIxXCIgZmlsbD1cInVybCgjY2hlc3RHcmFkKVwiIHN0cm9rZT1cIiNiODg2MGJcIiBzdHJva2Utd2lkdGg9XCIwLjVcIiBjbGFzcz1cImNoZXN0LWxpZFwiLz5cclxuICAgICAgICA8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjE3XCIgcj1cIjEuNVwiIGZpbGw9XCIjZmZmXCIgb3BhY2l0eT1cIjAuOFwiLz5cclxuICAgICAgPC9nPlxyXG4gICAgICA8ZyBjbGFzcz1cImNoZXN0LWNvaW5zXCI+XHJcbiAgICAgICAgPGNpcmNsZSBjeD1cIjEwXCIgY3k9XCI3XCIgcj1cIjEuNVwiIGZpbGw9XCIjZjZjNDQ1XCIgY2xhc3M9XCJjb2luIGMxXCIvPlxyXG4gICAgICAgIDxjaXJjbGUgY3g9XCIxNFwiIGN5PVwiNlwiIHI9XCIxLjVcIiBmaWxsPVwiI2Y2YzQ0NVwiIGNsYXNzPVwiY29pbiBjMlwiLz5cclxuICAgICAgICA8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjVcIiByPVwiMS41XCIgZmlsbD1cIiNmNmM0NDVcIiBjbGFzcz1cImNvaW4gYzNcIi8+XHJcbiAgICAgIDwvZz5cclxuICAgIDwvc3ZnPlxyXG4gIGApIGFzIEhUTUxFbGVtZW50O1xyXG59XHJcblxyXG4vLyBcdTUyNTFcdTZDMTRcdTcyNzlcdTY1NDhcdUZGMDhcdTYzQTBcdTU5M0FcdTYzMDlcdTk0QUVcdUZGMDlcclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVN3b3JkU2xhc2goKTogSFRNTEVsZW1lbnQge1xyXG4gIHJldHVybiBodG1sKGBcclxuICAgIDxzdmcgY2xhc3M9XCJzd29yZC1zbGFzaFwiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XHJcbiAgICAgIDxkZWZzPlxyXG4gICAgICAgIDxsaW5lYXJHcmFkaWVudCBpZD1cInNsYXNoR3JhZFwiIHgxPVwiMCVcIiB5MT1cIjAlXCIgeDI9XCIxMDAlXCIgeTI9XCIxMDAlXCI+XHJcbiAgICAgICAgICA8c3RvcCBvZmZzZXQ9XCIwJVwiIHN0b3AtY29sb3I9XCIjZmY1YzVjXCIvPlxyXG4gICAgICAgICAgPHN0b3Agb2Zmc2V0PVwiMTAwJVwiIHN0b3AtY29sb3I9XCIjZTM2NDE0XCIvPlxyXG4gICAgICAgIDwvbGluZWFyR3JhZGllbnQ+XHJcbiAgICAgIDwvZGVmcz5cclxuICAgICAgPHBhdGggY2xhc3M9XCJzbGFzaC10cmFpbCBzbGFzaDFcIiBkPVwiTTYgNiBMMTggMThcIiBzdHJva2U9XCJ1cmwoI3NsYXNoR3JhZClcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIG9wYWNpdHk9XCIwXCIvPlxyXG4gICAgICA8cGF0aCBjbGFzcz1cInNsYXNoLXRyYWlsIHNsYXNoMlwiIGQ9XCJNNCA4IEwxNiAyMFwiIHN0cm9rZT1cInVybCgjc2xhc2hHcmFkKVwiIHN0cm9rZS13aWR0aD1cIjEuNVwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBvcGFjaXR5PVwiMFwiLz5cclxuICAgICAgPHBhdGggZD1cIk03IDcgTDE3IDE3XCIgc3Ryb2tlPVwiI2ZmZlwiIHN0cm9rZS13aWR0aD1cIjFcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgb3BhY2l0eT1cIjAuM1wiLz5cclxuICAgIDwvc3ZnPlxyXG4gIGApIGFzIEhUTUxFbGVtZW50O1xyXG59XHJcblxyXG4vLyBcdTkxRDFcdTVFMDFcdTY1Q0JcdThGNkNcdUZGMDhcdTRFQTRcdTY2MTNcdTYyNDBcdUZGMDlcclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNwaW5uaW5nQ29pbigpOiBIVE1MRWxlbWVudCB7XHJcbiAgcmV0dXJuIGh0bWwoYFxyXG4gICAgPHN2ZyBjbGFzcz1cInNwaW5uaW5nLWNvaW5cIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiB2aWV3Qm94PVwiMCAwIDMyIDMyXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxyXG4gICAgICA8ZGVmcz5cclxuICAgICAgICA8bGluZWFyR3JhZGllbnQgaWQ9XCJjb2luR3JhZFwiIHgxPVwiMCVcIiB5MT1cIjAlXCIgeDI9XCIxMDAlXCIgeTI9XCIxMDAlXCI+XHJcbiAgICAgICAgICA8c3RvcCBvZmZzZXQ9XCIwJVwiIHN0b3AtY29sb3I9XCIjZjZjNDQ1XCIvPlxyXG4gICAgICAgICAgPHN0b3Agb2Zmc2V0PVwiNTAlXCIgc3RvcC1jb2xvcj1cIiNmZmQ3MDBcIi8+XHJcbiAgICAgICAgICA8c3RvcCBvZmZzZXQ9XCIxMDAlXCIgc3RvcC1jb2xvcj1cIiNlMzY0MTRcIi8+XHJcbiAgICAgICAgPC9saW5lYXJHcmFkaWVudD5cclxuICAgICAgPC9kZWZzPlxyXG4gICAgICA8ZyBjbGFzcz1cImNvaW4tc3BpblwiPlxyXG4gICAgICAgIDxlbGxpcHNlIGN4PVwiMTZcIiBjeT1cIjE2XCIgcng9XCIxMlwiIHJ5PVwiMTJcIiBmaWxsPVwidXJsKCNjb2luR3JhZClcIiBzdHJva2U9XCIjYjg4NjBiXCIgc3Ryb2tlLXdpZHRoPVwiMVwiLz5cclxuICAgICAgICA8dGV4dCB4PVwiMTZcIiB5PVwiMjBcIiB0ZXh0LWFuY2hvcj1cIm1pZGRsZVwiIGZvbnQtc2l6ZT1cIjEyXCIgZm9udC13ZWlnaHQ9XCJib2xkXCIgZmlsbD1cIiNmZmZcIj5CQjwvdGV4dD5cclxuICAgICAgPC9nPlxyXG4gICAgPC9zdmc+XHJcbiAgYCkgYXMgSFRNTEVsZW1lbnQ7XHJcbn1cclxuXHJcbi8vIFx1NTk1Nlx1Njc2Rlx1NTJBOFx1NzUzQlx1RkYwOFx1NjM5Mlx1ODg0Q1x1Njk5Q1x1RkYwOVxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVHJvcGh5QW5pbWF0aW9uKHJhbms6IG51bWJlcik6IEhUTUxFbGVtZW50IHtcclxuICBjb25zdCBjb2xvcnMgPSB7XHJcbiAgICAxOiB7IHByaW1hcnk6ICcjZmZkNzAwJywgc2Vjb25kYXJ5OiAnI2Y2YzQ0NScgfSwgLy8gXHU5MUQxXHU4MjcyXHJcbiAgICAyOiB7IHByaW1hcnk6ICcjYzBjMGMwJywgc2Vjb25kYXJ5OiAnI2E4YThhOCcgfSwgLy8gXHU5NEY2XHU4MjcyXHJcbiAgICAzOiB7IHByaW1hcnk6ICcjY2Q3ZjMyJywgc2Vjb25kYXJ5OiAnI2I4NzMzMycgfSwgLy8gXHU5NERDXHU4MjcyXHJcbiAgfTtcclxuICBjb25zdCBjb2xvciA9IGNvbG9yc1tyYW5rIGFzIDEgfCAyIHwgM10gfHwgeyBwcmltYXJ5OiAnIzdCMkNGNScsIHNlY29uZGFyeTogJyMyQzg5RjUnIH07XHJcbiAgXHJcbiAgcmV0dXJuIGh0bWwoYFxyXG4gICAgPHN2ZyBjbGFzcz1cInRyb3BoeS1hbmltXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgdmlld0JveD1cIjAgMCAzMiAzMlwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cclxuICAgICAgPGRlZnM+XHJcbiAgICAgICAgPGxpbmVhckdyYWRpZW50IGlkPVwidHJvcGh5JHtyYW5rfVwiIHgxPVwiMCVcIiB5MT1cIjAlXCIgeDI9XCIwJVwiIHkyPVwiMTAwJVwiPlxyXG4gICAgICAgICAgPHN0b3Agb2Zmc2V0PVwiMCVcIiBzdG9wLWNvbG9yPVwiJHtjb2xvci5wcmltYXJ5fVwiLz5cclxuICAgICAgICAgIDxzdG9wIG9mZnNldD1cIjEwMCVcIiBzdG9wLWNvbG9yPVwiJHtjb2xvci5zZWNvbmRhcnl9XCIvPlxyXG4gICAgICAgIDwvbGluZWFyR3JhZGllbnQ+XHJcbiAgICAgIDwvZGVmcz5cclxuICAgICAgPGcgY2xhc3M9XCJ0cm9waHktYm91bmNlXCI+XHJcbiAgICAgICAgPCEtLSBcdTY3NkZcdThFQUIgLS0+XHJcbiAgICAgICAgPHBhdGggZD1cIk0xMCA4IEwxMCAxNCBRMTAgMTggMTYgMTggUTIyIDE4IDIyIDE0IEwyMiA4IFpcIiBmaWxsPVwidXJsKCN0cm9waHkke3Jhbmt9KVwiIHN0cm9rZT1cIiR7Y29sb3Iuc2Vjb25kYXJ5fVwiIHN0cm9rZS13aWR0aD1cIjAuNVwiLz5cclxuICAgICAgICA8IS0tIFx1ODAzM1x1NjczNSAtLT5cclxuICAgICAgICA8cGF0aCBkPVwiTTggMTAgTDggMTIgUTggMTMgOSAxM1wiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwidXJsKCN0cm9waHkke3Jhbmt9KVwiIHN0cm9rZS13aWR0aD1cIjFcIi8+XHJcbiAgICAgICAgPHBhdGggZD1cIk0yNCAxMCBMMjQgMTIgUTI0IDEzIDIzIDEzXCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJ1cmwoI3Ryb3BoeSR7cmFua30pXCIgc3Ryb2tlLXdpZHRoPVwiMVwiLz5cclxuICAgICAgICA8IS0tIFx1NUU5NVx1NUVBNyAtLT5cclxuICAgICAgICA8cmVjdCB4PVwiMTNcIiB5PVwiMThcIiB3aWR0aD1cIjZcIiBoZWlnaHQ9XCIzXCIgZmlsbD1cInVybCgjdHJvcGh5JHtyYW5rfSlcIi8+XHJcbiAgICAgICAgPHJlY3QgeD1cIjExXCIgeT1cIjIxXCIgd2lkdGg9XCIxMFwiIGhlaWdodD1cIjJcIiByeD1cIjFcIiBmaWxsPVwidXJsKCN0cm9waHkke3Jhbmt9KVwiLz5cclxuICAgICAgICA8IS0tIFx1NjYxRlx1NjYxRiAtLT5cclxuICAgICAgICA8Y2lyY2xlIGNsYXNzPVwidHJvcGh5LXN0YXJcIiBjeD1cIjE2XCIgY3k9XCI1XCIgcj1cIjEuNVwiIGZpbGw9XCIke2NvbG9yLnByaW1hcnl9XCIvPlxyXG4gICAgICA8L2c+XHJcbiAgICA8L3N2Zz5cclxuICBgKSBhcyBIVE1MRWxlbWVudDtcclxufVxyXG5cclxuLy8gXHU4MEZEXHU5MUNGXHU2Q0UyXHU3RUI5XHVGRjA4XHU2MzA5XHU5NEFFXHU3Mjc5XHU2NTQ4XHVGRjA5XHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFbmVyZ3lSaXBwbGUoKTogSFRNTEVsZW1lbnQge1xyXG4gIHJldHVybiBodG1sKGBcclxuICAgIDxzdmcgY2xhc3M9XCJlbmVyZ3ktcmlwcGxlXCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiIHZpZXdCb3g9XCIwIDAgMTAwIDEwMFwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiBzdHlsZT1cInBvc2l0aW9uOmFic29sdXRlO2luc2V0OjA7cG9pbnRlci1ldmVudHM6bm9uZTtcIj5cclxuICAgICAgPGNpcmNsZSBjbGFzcz1cInJpcHBsZSByMVwiIGN4PVwiNTBcIiBjeT1cIjUwXCIgcj1cIjIwXCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJyZ2JhKDEyMyw0NCwyNDUsMC42KVwiIHN0cm9rZS13aWR0aD1cIjJcIi8+XHJcbiAgICAgIDxjaXJjbGUgY2xhc3M9XCJyaXBwbGUgcjJcIiBjeD1cIjUwXCIgY3k9XCI1MFwiIHI9XCIyMFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwicmdiYSg0NCwxMzcsMjQ1LDAuNClcIiBzdHJva2Utd2lkdGg9XCIyXCIvPlxyXG4gICAgICA8Y2lyY2xlIGNsYXNzPVwicmlwcGxlIHIzXCIgY3g9XCI1MFwiIGN5PVwiNTBcIiByPVwiMjBcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cInJnYmEoMjQ2LDE5Niw2OSwwLjMpXCIgc3Ryb2tlLXdpZHRoPVwiMlwiLz5cclxuICAgIDwvc3ZnPlxyXG4gIGApIGFzIEhUTUxFbGVtZW50O1xyXG59XHJcblxyXG4vLyBcdTg4QzVcdThGN0RcdThGREJcdTVFQTZcdTdDOTJcdTVCNTBcdTZENDFcclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUxvYWRpbmdQYXJ0aWNsZXMoKTogSFRNTEVsZW1lbnQge1xyXG4gIHJldHVybiBodG1sKGBcclxuICAgIDxzdmcgY2xhc3M9XCJsb2FkaW5nLXBhcnRpY2xlc1wiIHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEyXCIgdmlld0JveD1cIjAgMCA0MDAgMTJcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgc3R5bGU9XCJwb3NpdGlvbjphYnNvbHV0ZTtpbnNldDowO3BvaW50ZXItZXZlbnRzOm5vbmU7XCI+XHJcbiAgICAgIDxjaXJjbGUgY2xhc3M9XCJwYXJ0aWNsZSBwYXJ0MVwiIGN4PVwiMFwiIGN5PVwiNlwiIHI9XCIyXCIgZmlsbD1cIiM3QjJDRjVcIi8+XHJcbiAgICAgIDxjaXJjbGUgY2xhc3M9XCJwYXJ0aWNsZSBwYXJ0MlwiIGN4PVwiMFwiIGN5PVwiNlwiIHI9XCIxLjVcIiBmaWxsPVwiIzJDODlGNVwiLz5cclxuICAgICAgPGNpcmNsZSBjbGFzcz1cInBhcnRpY2xlIHBhcnQzXCIgY3g9XCIwXCIgY3k9XCI2XCIgcj1cIjJcIiBmaWxsPVwiI2Y2YzQ0NVwiLz5cclxuICAgIDwvc3ZnPlxyXG4gIGApIGFzIEhUTUxFbGVtZW50O1xyXG59XHJcblxyXG4iLCAiaW1wb3J0IHsgaHRtbCB9IGZyb20gJy4uL3V0aWxzL2RvbSc7XHJcblxyXG4vLyBTVkdcdTZEQjJcdTRGNTMvXHU3MTk0XHU1Q0E5XHU2NTQ4XHU2NzlDXHU2RUU0XHU5NTVDXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVMaXF1aWRGaWx0ZXIoKTogc3RyaW5nIHtcclxuICByZXR1cm4gYFxyXG4gICAgPHN2ZyB3aWR0aD1cIjBcIiBoZWlnaHQ9XCIwXCIgc3R5bGU9XCJwb3NpdGlvbjphYnNvbHV0ZTtcIj5cclxuICAgICAgPGRlZnM+XHJcbiAgICAgICAgPGZpbHRlciBpZD1cImxpcXVpZC1nb29cIj5cclxuICAgICAgICAgIDxmZUdhdXNzaWFuQmx1ciBpbj1cIlNvdXJjZUdyYXBoaWNcIiBzdGREZXZpYXRpb249XCIxMFwiIHJlc3VsdD1cImJsdXJcIiAvPlxyXG4gICAgICAgICAgPGZlQ29sb3JNYXRyaXggaW49XCJibHVyXCIgbW9kZT1cIm1hdHJpeFwiIHZhbHVlcz1cIjEgMCAwIDAgMCAgMCAxIDAgMCAwICAwIDAgMSAwIDAgIDAgMCAwIDE4IC03XCIgcmVzdWx0PVwiZ29vXCIgLz5cclxuICAgICAgICAgIDxmZUJsZW5kIGluPVwiU291cmNlR3JhcGhpY1wiIGluMj1cImdvb1wiIC8+XHJcbiAgICAgICAgPC9maWx0ZXI+XHJcbiAgICAgICAgXHJcbiAgICAgICAgPGZpbHRlciBpZD1cIm5lb24tZ2xvd1wiPlxyXG4gICAgICAgICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj1cIjRcIiByZXN1bHQ9XCJjb2xvcmVkQmx1clwiLz5cclxuICAgICAgICAgIDxmZU1lcmdlPlxyXG4gICAgICAgICAgICA8ZmVNZXJnZU5vZGUgaW49XCJjb2xvcmVkQmx1clwiLz5cclxuICAgICAgICAgICAgPGZlTWVyZ2VOb2RlIGluPVwiY29sb3JlZEJsdXJcIi8+XHJcbiAgICAgICAgICAgIDxmZU1lcmdlTm9kZSBpbj1cIlNvdXJjZUdyYXBoaWNcIi8+XHJcbiAgICAgICAgICA8L2ZlTWVyZ2U+XHJcbiAgICAgICAgPC9maWx0ZXI+XHJcbiAgICAgICAgXHJcbiAgICAgICAgPGZpbHRlciBpZD1cImxpZ2h0bmluZy1nbG93XCI+XHJcbiAgICAgICAgICA8ZmVHYXVzc2lhbkJsdXIgaW49XCJTb3VyY2VHcmFwaGljXCIgc3RkRGV2aWF0aW9uPVwiM1wiIHJlc3VsdD1cImJsdXJcIi8+XHJcbiAgICAgICAgICA8ZmVDb2xvck1hdHJpeCBpbj1cImJsdXJcIiB0eXBlPVwibWF0cml4XCIgdmFsdWVzPVwiMSAwIDAgMCAwICAwIDEgMCAwIDAgIDAgMCAxIDAgMCAgMCAwIDAgMTAgLTNcIiByZXN1bHQ9XCJpbnRlbnNlXCIvPlxyXG4gICAgICAgICAgPGZlQ29tcG9zaXRlIGluPVwiU291cmNlR3JhcGhpY1wiIGluMj1cImludGVuc2VcIiBvcGVyYXRvcj1cIm92ZXJcIi8+XHJcbiAgICAgICAgPC9maWx0ZXI+XHJcbiAgICAgICAgXHJcbiAgICAgICAgPGZpbHRlciBpZD1cIm1hZ2ljLWNpcmNsZVwiPlxyXG4gICAgICAgICAgPGZlVHVyYnVsZW5jZSB0eXBlPVwiZnJhY3RhbE5vaXNlXCIgYmFzZUZyZXF1ZW5jeT1cIjAuMDFcIiBudW1PY3RhdmVzPVwiMlwiIHJlc3VsdD1cInR1cmJ1bGVuY2VcIi8+XHJcbiAgICAgICAgICA8ZmVEaXNwbGFjZW1lbnRNYXAgaW4yPVwidHVyYnVsZW5jZVwiIGluPVwiU291cmNlR3JhcGhpY1wiIHNjYWxlPVwiMTVcIiB4Q2hhbm5lbFNlbGVjdG9yPVwiUlwiIHlDaGFubmVsU2VsZWN0b3I9XCJHXCIvPlxyXG4gICAgICAgICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj1cIjFcIi8+XHJcbiAgICAgICAgPC9maWx0ZXI+XHJcbiAgICAgIDwvZGVmcz5cclxuICAgIDwvc3ZnPlxyXG4gIGA7XHJcbn1cclxuXHJcbi8vIFx1ODBGRFx1OTFDRlx1OTVFQVx1NzUzNVx1NzI3OVx1NjU0OFxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTGlnaHRuaW5nQm9sdCgpOiBIVE1MRWxlbWVudCB7XHJcbiAgcmV0dXJuIGh0bWwoYFxyXG4gICAgPHN2ZyBjbGFzcz1cImxpZ2h0bmluZy1lZmZlY3RcIiB3aWR0aD1cIjIwMFwiIGhlaWdodD1cIjIwMFwiIHZpZXdCb3g9XCIwIDAgMjAwIDIwMFwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cclxuICAgICAgPGRlZnM+XHJcbiAgICAgICAgPGxpbmVhckdyYWRpZW50IGlkPVwibGlnaHRuaW5nR3JhZFwiIHgxPVwiMCVcIiB5MT1cIjAlXCIgeDI9XCIxMDAlXCIgeTI9XCIxMDAlXCI+XHJcbiAgICAgICAgICA8c3RvcCBvZmZzZXQ9XCIwJVwiIHN0b3AtY29sb3I9XCIjZjZjNDQ1XCIvPlxyXG4gICAgICAgICAgPHN0b3Agb2Zmc2V0PVwiNTAlXCIgc3RvcC1jb2xvcj1cIiNmZmZcIi8+XHJcbiAgICAgICAgICA8c3RvcCBvZmZzZXQ9XCIxMDAlXCIgc3RvcC1jb2xvcj1cIiMyQzg5RjVcIi8+XHJcbiAgICAgICAgPC9saW5lYXJHcmFkaWVudD5cclxuICAgICAgICA8ZmlsdGVyIGlkPVwibGlnaHRuaW5nR2xvd1wiPlxyXG4gICAgICAgICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj1cIjNcIiByZXN1bHQ9XCJjb2xvcmVkQmx1clwiLz5cclxuICAgICAgICAgIDxmZU1lcmdlPlxyXG4gICAgICAgICAgICA8ZmVNZXJnZU5vZGUgaW49XCJjb2xvcmVkQmx1clwiLz5cclxuICAgICAgICAgICAgPGZlTWVyZ2VOb2RlIGluPVwiY29sb3JlZEJsdXJcIi8+XHJcbiAgICAgICAgICAgIDxmZU1lcmdlTm9kZSBpbj1cIlNvdXJjZUdyYXBoaWNcIi8+XHJcbiAgICAgICAgICA8L2ZlTWVyZ2U+XHJcbiAgICAgICAgPC9maWx0ZXI+XHJcbiAgICAgIDwvZGVmcz5cclxuICAgICAgPGcgY2xhc3M9XCJsaWdodG5pbmctZ3JvdXBcIiBvcGFjaXR5PVwiMFwiPlxyXG4gICAgICAgIDxwYXRoIGNsYXNzPVwiYm9sdCBib2x0LTFcIiBkPVwiTTEwMCAyMCBMODUgMTAwIEwxMTAgMTAwIEw5NSAxODBcIiBzdHJva2U9XCJ1cmwoI2xpZ2h0bmluZ0dyYWQpXCIgc3Ryb2tlLXdpZHRoPVwiM1wiIGZpbGw9XCJub25lXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIGZpbHRlcj1cInVybCgjbGlnaHRuaW5nR2xvdylcIi8+XHJcbiAgICAgICAgPHBhdGggY2xhc3M9XCJib2x0IGJvbHQtMlwiIGQ9XCJNOTUgMzAgTDgyIDk1IEwxMDUgOTUgTDkyIDE3MFwiIHN0cm9rZT1cIiNmZmZcIiBzdHJva2Utd2lkdGg9XCIxLjVcIiBmaWxsPVwibm9uZVwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBvcGFjaXR5PVwiMC42XCIvPlxyXG4gICAgICA8L2c+XHJcbiAgICA8L3N2Zz5cclxuICBgKSBhcyBIVE1MRWxlbWVudDtcclxufVxyXG5cclxuLy8gXHU5QjU0XHU2Q0Q1XHU5NjM1XHU2NTQ4XHU2NzlDXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVNYWdpY0NpcmNsZSgpOiBIVE1MRWxlbWVudCB7XHJcbiAgcmV0dXJuIGh0bWwoYFxyXG4gICAgPHN2ZyBjbGFzcz1cIm1hZ2ljLWNpcmNsZVwiIHdpZHRoPVwiMzAwXCIgaGVpZ2h0PVwiMzAwXCIgdmlld0JveD1cIjAgMCAzMDAgMzAwXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxyXG4gICAgICA8ZGVmcz5cclxuICAgICAgICA8bGluZWFyR3JhZGllbnQgaWQ9XCJtYWdpY0dyYWRcIiB4MT1cIjAlXCIgeTE9XCIwJVwiIHgyPVwiMTAwJVwiIHkyPVwiMTAwJVwiPlxyXG4gICAgICAgICAgPHN0b3Agb2Zmc2V0PVwiMCVcIiBzdG9wLWNvbG9yPVwiIzdCMkNGNVwiIHN0b3Atb3BhY2l0eT1cIjAuNlwiLz5cclxuICAgICAgICAgIDxzdG9wIG9mZnNldD1cIjUwJVwiIHN0b3AtY29sb3I9XCIjMkM4OUY1XCIgc3RvcC1vcGFjaXR5PVwiMC44XCIvPlxyXG4gICAgICAgICAgPHN0b3Agb2Zmc2V0PVwiMTAwJVwiIHN0b3AtY29sb3I9XCIjZjZjNDQ1XCIgc3RvcC1vcGFjaXR5PVwiMC42XCIvPlxyXG4gICAgICAgIDwvbGluZWFyR3JhZGllbnQ+XHJcbiAgICAgIDwvZGVmcz5cclxuICAgICAgXHJcbiAgICAgIDwhLS0gXHU1OTE2XHU1NzA4IC0tPlxyXG4gICAgICA8Y2lyY2xlIGNsYXNzPVwibWFnaWMtcmluZyByaW5nLTFcIiBjeD1cIjE1MFwiIGN5PVwiMTUwXCIgcj1cIjE0MFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwidXJsKCNtYWdpY0dyYWQpXCIgc3Ryb2tlLXdpZHRoPVwiMVwiIG9wYWNpdHk9XCIwLjNcIi8+XHJcbiAgICAgIDxjaXJjbGUgY2xhc3M9XCJtYWdpYy1yaW5nIHJpbmctMlwiIGN4PVwiMTUwXCIgY3k9XCIxNTBcIiByPVwiMTIwXCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJ1cmwoI21hZ2ljR3JhZClcIiBzdHJva2Utd2lkdGg9XCIwLjVcIiBvcGFjaXR5PVwiMC40XCIvPlxyXG4gICAgICA8Y2lyY2xlIGNsYXNzPVwibWFnaWMtcmluZyByaW5nLTNcIiBjeD1cIjE1MFwiIGN5PVwiMTUwXCIgcj1cIjEwMFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwidXJsKCNtYWdpY0dyYWQpXCIgc3Ryb2tlLXdpZHRoPVwiMC41XCIgb3BhY2l0eT1cIjAuNVwiLz5cclxuICAgICAgXHJcbiAgICAgIDwhLS0gXHU3QjI2XHU2NTg3IC0tPlxyXG4gICAgICA8ZyBjbGFzcz1cInJ1bmVzXCI+XHJcbiAgICAgICAgPGNpcmNsZSBjeD1cIjE1MFwiIGN5PVwiMzBcIiByPVwiM1wiIGZpbGw9XCIjN0IyQ0Y1XCIgb3BhY2l0eT1cIjAuOFwiIGNsYXNzPVwicnVuZSByMVwiLz5cclxuICAgICAgICA8Y2lyY2xlIGN4PVwiMjcwXCIgY3k9XCIxNTBcIiByPVwiM1wiIGZpbGw9XCIjMkM4OUY1XCIgb3BhY2l0eT1cIjAuOFwiIGNsYXNzPVwicnVuZSByMlwiLz5cclxuICAgICAgICA8Y2lyY2xlIGN4PVwiMTUwXCIgY3k9XCIyNzBcIiByPVwiM1wiIGZpbGw9XCIjZjZjNDQ1XCIgb3BhY2l0eT1cIjAuOFwiIGNsYXNzPVwicnVuZSByM1wiLz5cclxuICAgICAgICA8Y2lyY2xlIGN4PVwiMzBcIiBjeT1cIjE1MFwiIHI9XCIzXCIgZmlsbD1cIiM3QjJDRjVcIiBvcGFjaXR5PVwiMC44XCIgY2xhc3M9XCJydW5lIHI0XCIvPlxyXG4gICAgICA8L2c+XHJcbiAgICAgIFxyXG4gICAgICA8IS0tIFx1NEUyRFx1NUZDM1x1NjYxRlx1NjYxRiAtLT5cclxuICAgICAgPGcgY2xhc3M9XCJjZW50ZXItc3RhclwiPlxyXG4gICAgICAgIDxwYXRoIGQ9XCJNMTUwIDE0MCBMMTU1IDE1MCBMMTUwIDE2MCBMMTQ1IDE1MCBaXCIgZmlsbD1cInVybCgjbWFnaWNHcmFkKVwiIG9wYWNpdHk9XCIwLjZcIi8+XHJcbiAgICAgICAgPHBhdGggZD1cIk0xNDAgMTUwIEwxNTAgMTU1IEwxNjAgMTUwIEwxNTAgMTQ1IFpcIiBmaWxsPVwidXJsKCNtYWdpY0dyYWQpXCIgb3BhY2l0eT1cIjAuNlwiLz5cclxuICAgICAgPC9nPlxyXG4gICAgPC9zdmc+XHJcbiAgYCkgYXMgSFRNTEVsZW1lbnQ7XHJcbn1cclxuXHJcbi8vIFx1NjYxRlx1N0E3QVx1ODBDQ1x1NjY2RlxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU3RhcmZpZWxkKCk6IEhUTUxFbGVtZW50IHtcclxuICBjb25zdCBzdGFyczogc3RyaW5nW10gPSBbXTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IDUwOyBpKyspIHtcclxuICAgIGNvbnN0IHggPSBNYXRoLnJhbmRvbSgpICogMTAwO1xyXG4gICAgY29uc3QgeSA9IE1hdGgucmFuZG9tKCkgKiAxMDA7XHJcbiAgICBjb25zdCBzaXplID0gTWF0aC5yYW5kb20oKSAqIDIgKyAwLjU7XHJcbiAgICBjb25zdCBkZWxheSA9IE1hdGgucmFuZG9tKCkgKiAzO1xyXG4gICAgY29uc3QgZHVyYXRpb24gPSBNYXRoLnJhbmRvbSgpICogMiArIDI7XHJcbiAgICBzdGFycy5wdXNoKGA8Y2lyY2xlIGN4PVwiJHt4fSVcIiBjeT1cIiR7eX0lXCIgcj1cIiR7c2l6ZX1cIiBmaWxsPVwiI2ZmZlwiIG9wYWNpdHk9XCIwXCIgY2xhc3M9XCJzdGFyXCIgc3R5bGU9XCJhbmltYXRpb24tZGVsYXk6JHtkZWxheX1zO2FuaW1hdGlvbi1kdXJhdGlvbjoke2R1cmF0aW9ufXNcIi8+YCk7XHJcbiAgfVxyXG4gIFxyXG4gIHJldHVybiBodG1sKGBcclxuICAgIDxzdmcgY2xhc3M9XCJzdGFyZmllbGRcIiB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCIgdmlld0JveD1cIjAgMCAxMDAgMTAwXCIgcHJlc2VydmVBc3BlY3RSYXRpbz1cIm5vbmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgc3R5bGU9XCJwb3NpdGlvbjphYnNvbHV0ZTtpbnNldDowO3BvaW50ZXItZXZlbnRzOm5vbmU7ei1pbmRleDowO1wiPlxyXG4gICAgICAke3N0YXJzLmpvaW4oJycpfVxyXG4gICAgPC9zdmc+XHJcbiAgYCkgYXMgSFRNTEVsZW1lbnQ7XHJcbn1cclxuXHJcbi8vIFx1ODBGRFx1OTFDRlx1ODEwOVx1NTFCMlx1NkNFMlxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRW5lcmd5UHVsc2UoKTogSFRNTEVsZW1lbnQge1xyXG4gIHJldHVybiBodG1sKGBcclxuICAgIDxzdmcgY2xhc3M9XCJlbmVyZ3ktcHVsc2VcIiB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCIgdmlld0JveD1cIjAgMCAyMDAgMjAwXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHN0eWxlPVwicG9zaXRpb246YWJzb2x1dGU7aW5zZXQ6MDtwb2ludGVyLWV2ZW50czpub25lO1wiPlxyXG4gICAgICA8ZGVmcz5cclxuICAgICAgICA8cmFkaWFsR3JhZGllbnQgaWQ9XCJwdWxzZUdyYWRcIj5cclxuICAgICAgICAgIDxzdG9wIG9mZnNldD1cIjAlXCIgc3RvcC1jb2xvcj1cIiM3QjJDRjVcIiBzdG9wLW9wYWNpdHk9XCIwLjhcIi8+XHJcbiAgICAgICAgICA8c3RvcCBvZmZzZXQ9XCI1MCVcIiBzdG9wLWNvbG9yPVwiIzJDODlGNVwiIHN0b3Atb3BhY2l0eT1cIjAuNFwiLz5cclxuICAgICAgICAgIDxzdG9wIG9mZnNldD1cIjEwMCVcIiBzdG9wLWNvbG9yPVwidHJhbnNwYXJlbnRcIi8+XHJcbiAgICAgICAgPC9yYWRpYWxHcmFkaWVudD5cclxuICAgICAgPC9kZWZzPlxyXG4gICAgICA8Y2lyY2xlIGNsYXNzPVwicHVsc2Utd2F2ZSB3YXZlLTFcIiBjeD1cIjEwMFwiIGN5PVwiMTAwXCIgcj1cIjEwXCIgZmlsbD1cInVybCgjcHVsc2VHcmFkKVwiIG9wYWNpdHk9XCIwXCIvPlxyXG4gICAgICA8Y2lyY2xlIGNsYXNzPVwicHVsc2Utd2F2ZSB3YXZlLTJcIiBjeD1cIjEwMFwiIGN5PVwiMTAwXCIgcj1cIjEwXCIgZmlsbD1cInVybCgjcHVsc2VHcmFkKVwiIG9wYWNpdHk9XCIwXCIvPlxyXG4gICAgICA8Y2lyY2xlIGNsYXNzPVwicHVsc2Utd2F2ZSB3YXZlLTNcIiBjeD1cIjEwMFwiIGN5PVwiMTAwXCIgcj1cIjEwXCIgZmlsbD1cInVybCgjcHVsc2VHcmFkKVwiIG9wYWNpdHk9XCIwXCIvPlxyXG4gICAgPC9zdmc+XHJcbiAgYCkgYXMgSFRNTEVsZW1lbnQ7XHJcbn1cclxuXHJcbi8vIFx1NjU3MFx1NjM2RVx1NkQ0MVx1NjU0OFx1Njc5Q1xyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRGF0YVN0cmVhbSgpOiBIVE1MRWxlbWVudCB7XHJcbiAgY29uc3Qgc3RyZWFtczogc3RyaW5nW10gPSBbXTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IDU7IGkrKykge1xyXG4gICAgY29uc3QgeCA9IDIwICsgaSAqIDIwO1xyXG4gICAgY29uc3QgZGVsYXkgPSBpICogMC4zO1xyXG4gICAgc3RyZWFtcy5wdXNoKGBcclxuICAgICAgPGcgY2xhc3M9XCJkYXRhLXN0cmVhbVwiIHN0eWxlPVwiYW5pbWF0aW9uLWRlbGF5OiR7ZGVsYXl9c1wiPlxyXG4gICAgICAgIDxsaW5lIHgxPVwiJHt4fVwiIHkxPVwiMFwiIHgyPVwiJHt4fVwiIHkyPVwiMTAwXCIgc3Ryb2tlPVwidXJsKCNzdHJlYW1HcmFkKVwiIHN0cm9rZS13aWR0aD1cIjFcIiBvcGFjaXR5PVwiMC42XCIgc3Ryb2tlLWRhc2hhcnJheT1cIjUgMTBcIi8+XHJcbiAgICAgIDwvZz5cclxuICAgIGApO1xyXG4gIH1cclxuICBcclxuICByZXR1cm4gaHRtbChgXHJcbiAgICA8c3ZnIGNsYXNzPVwiZGF0YS1zdHJlYW1zXCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwXCIgdmlld0JveD1cIjAgMCAxMDAgMTAwXCIgcHJlc2VydmVBc3BlY3RSYXRpbz1cIm5vbmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgc3R5bGU9XCJwb3NpdGlvbjphYnNvbHV0ZTtpbnNldDowO3BvaW50ZXItZXZlbnRzOm5vbmU7XCI+XHJcbiAgICAgIDxkZWZzPlxyXG4gICAgICAgIDxsaW5lYXJHcmFkaWVudCBpZD1cInN0cmVhbUdyYWRcIiB4MT1cIjAlXCIgeTE9XCIwJVwiIHgyPVwiMCVcIiB5Mj1cIjEwMCVcIj5cclxuICAgICAgICAgIDxzdG9wIG9mZnNldD1cIjAlXCIgc3RvcC1jb2xvcj1cInRyYW5zcGFyZW50XCIvPlxyXG4gICAgICAgICAgPHN0b3Agb2Zmc2V0PVwiNTAlXCIgc3RvcC1jb2xvcj1cIiMyQzg5RjVcIiBzdG9wLW9wYWNpdHk9XCIwLjhcIi8+XHJcbiAgICAgICAgICA8c3RvcCBvZmZzZXQ9XCIxMDAlXCIgc3RvcC1jb2xvcj1cInRyYW5zcGFyZW50XCIvPlxyXG4gICAgICAgIDwvbGluZWFyR3JhZGllbnQ+XHJcbiAgICAgIDwvZGVmcz5cclxuICAgICAgJHtzdHJlYW1zLmpvaW4oJycpfVxyXG4gICAgPC9zdmc+XHJcbiAgYCkgYXMgSFRNTEVsZW1lbnQ7XHJcbn1cclxuXHJcbiIsICJpbXBvcnQgeyBOZXR3b3JrTWFuYWdlciB9IGZyb20gJy4uL2NvcmUvTmV0d29ya01hbmFnZXInO1xyXG5pbXBvcnQgeyBSZWFsdGltZUNsaWVudCB9IGZyb20gJy4uL2NvcmUvUmVhbHRpbWVDbGllbnQnO1xyXG5pbXBvcnQgeyBodG1sLCBxcyB9IGZyb20gJy4uL3V0aWxzL2RvbSc7XHJcbmltcG9ydCB7IHJlbmRlck5hdiB9IGZyb20gJy4uL2NvbXBvbmVudHMvTmF2JztcclxuaW1wb3J0IHsgcmVuZGVyUmVzb3VyY2VCYXIgfSBmcm9tICcuLi9jb21wb25lbnRzL1Jlc291cmNlQmFyJztcclxuaW1wb3J0IHsgc2hvd1RvYXN0IH0gZnJvbSAnLi4vY29tcG9uZW50cy9Ub2FzdCc7XHJcbmltcG9ydCB7IHNwYXduRmxvYXRUZXh0IH0gZnJvbSAnLi4vY29tcG9uZW50cy9GbG9hdFRleHQnO1xyXG5pbXBvcnQgeyByZW5kZXJJY29uIH0gZnJvbSAnLi4vY29tcG9uZW50cy9JY29uJztcclxuaW1wb3J0IHsgc2hvd0FkRGlhbG9nIH0gZnJvbSAnLi4vY29tcG9uZW50cy9BZERpYWxvZyc7XHJcbmltcG9ydCB7IGNyZWF0ZU1pbmVyQW5pbWF0aW9uLCBjcmVhdGVJZGxlTWluZXIgfSBmcm9tICcuLi9jb21wb25lbnRzL01pbmVyQW5pbWF0aW9uJztcclxuaW1wb3J0IHsgY3JlYXRlVHJlYXN1cmVDaGVzdCB9IGZyb20gJy4uL2NvbXBvbmVudHMvQW5pbWF0ZWRJY29ucyc7XHJcbmltcG9ydCB7IGNyZWF0ZUxpcXVpZEZpbHRlciwgY3JlYXRlTWFnaWNDaXJjbGUsIGNyZWF0ZVN0YXJmaWVsZCwgY3JlYXRlTGlnaHRuaW5nQm9sdCB9IGZyb20gJy4uL2NvbXBvbmVudHMvQWR2YW5jZWRFZmZlY3RzJztcclxuXHJcbnR5cGUgTWluZVN0YXR1cyA9IHtcclxuICBjYXJ0QW1vdW50OiBudW1iZXI7XHJcbiAgY2FydENhcGFjaXR5OiBudW1iZXI7XHJcbiAgY29sbGFwc2VkOiBib29sZWFuO1xyXG4gIGNvbGxhcHNlZFJlbWFpbmluZzogbnVtYmVyO1xyXG4gIHJ1bm5pbmc6IGJvb2xlYW47XHJcbiAgaW50ZXJ2YWxNczogbnVtYmVyO1xyXG59O1xyXG5cclxudHlwZSBQZW5kaW5nQWN0aW9uID0gJ3N0YXJ0JyB8ICdzdG9wJyB8ICdjb2xsZWN0JyB8ICdyZXBhaXInIHwgJ3N0YXR1cycgfCBudWxsO1xyXG5cclxuZXhwb3J0IGNsYXNzIE1haW5TY2VuZSB7XHJcbiAgcHJpdmF0ZSB2aWV3OiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xyXG4gIHByaXZhdGUgY2FydEFtdCA9IDA7XHJcbiAgcHJpdmF0ZSBjYXJ0Q2FwID0gMTAwMDtcclxuICBwcml2YXRlIGlzTWluaW5nID0gZmFsc2U7XHJcbiAgcHJpdmF0ZSBpc0NvbGxhcHNlZCA9IGZhbHNlO1xyXG4gIHByaXZhdGUgY29sbGFwc2VSZW1haW5pbmcgPSAwO1xyXG4gIHByaXZhdGUgY29sbGFwc2VUaW1lcjogbnVtYmVyIHwgbnVsbCA9IG51bGw7XHJcbiAgcHJpdmF0ZSBpbnRlcnZhbE1zID0gMzAwMDtcclxuICBwcml2YXRlIHBlbmRpbmc6IFBlbmRpbmdBY3Rpb24gPSBudWxsO1xyXG5cclxuICBwcml2YXRlIGVscyA9IHtcclxuICAgIGZpbGw6IG51bGwgYXMgSFRNTEVsZW1lbnQgfCBudWxsLFxyXG4gICAgcGVyY2VudDogbnVsbCBhcyBIVE1MRWxlbWVudCB8IG51bGwsXHJcbiAgICBzdGF0dXNUZXh0OiBudWxsIGFzIEhUTUxFbGVtZW50IHwgbnVsbCxcclxuICAgIHJpbmc6IG51bGwgYXMgSFRNTEVsZW1lbnQgfCBudWxsLFxyXG4gICAgcmluZ1BjdDogbnVsbCBhcyBIVE1MRWxlbWVudCB8IG51bGwsXHJcbiAgICBjeWNsZTogbnVsbCBhcyBIVE1MRWxlbWVudCB8IG51bGwsXHJcbiAgICBzdGF0dXNUYWc6IG51bGwgYXMgSFRNTEVsZW1lbnQgfCBudWxsLFxyXG4gICAgZXZlbnRzOiBudWxsIGFzIEhUTUxFbGVtZW50IHwgbnVsbCxcclxuICAgIHN0YXJ0OiBudWxsIGFzIEhUTUxCdXR0b25FbGVtZW50IHwgbnVsbCxcclxuICAgIHN0b3A6IG51bGwgYXMgSFRNTEJ1dHRvbkVsZW1lbnQgfCBudWxsLFxyXG4gICAgY29sbGVjdDogbnVsbCBhcyBIVE1MQnV0dG9uRWxlbWVudCB8IG51bGwsXHJcbiAgICByZXBhaXI6IG51bGwgYXMgSFRNTEJ1dHRvbkVsZW1lbnQgfCBudWxsLFxyXG4gICAgc3RhdHVzQnRuOiBudWxsIGFzIEhUTUxCdXR0b25FbGVtZW50IHwgbnVsbCxcclxuICAgIGhvbG9ncmFtOiBudWxsIGFzIEhUTUxFbGVtZW50IHwgbnVsbCxcclxuICAgIG1pbmVyQ2hhcjogbnVsbCBhcyBIVE1MRWxlbWVudCB8IG51bGwsXHJcbiAgfTtcclxuXHJcbiAgcHJpdmF0ZSBtaW5lVXBkYXRlSGFuZGxlcj86IChtc2c6IGFueSkgPT4gdm9pZDtcclxuICBwcml2YXRlIG1pbmVDb2xsYXBzZUhhbmRsZXI/OiAobXNnOiBhbnkpID0+IHZvaWQ7XHJcbiAgcHJpdmF0ZSBwbHVuZGVySGFuZGxlcj86IChtc2c6IGFueSkgPT4gdm9pZDtcclxuXHJcbiAgYXN5bmMgbW91bnQocm9vdDogSFRNTEVsZW1lbnQpIHtcclxuICAgIHRoaXMuY2xlYXJDb2xsYXBzZVRpbWVyKCk7XHJcbiAgICB0aGlzLnBlbmRpbmcgPSBudWxsO1xyXG5cclxuICAgIGNvbnN0IG5hdiA9IHJlbmRlck5hdignbWFpbicpO1xyXG4gICAgY29uc3QgYmFyID0gcmVuZGVyUmVzb3VyY2VCYXIoKTtcclxuICAgIGNvbnN0IHZpZXcgPSBodG1sKGBcclxuICAgICAgPHNlY3Rpb24gY2xhc3M9XCJtYWluLXNjcmVlblwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJtYWluLWFtYmllbnRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj5cclxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYW1iaWVudCBvcmIgb3JiLWFcIj48L3NwYW4+XHJcbiAgICAgICAgICA8c3BhbiBjbGFzcz1cImFtYmllbnQgb3JiIG9yYi1iXCI+PC9zcGFuPlxyXG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJhbWJpZW50IGdyaWRcIj48L3NwYW4+XHJcbiAgICAgICAgICA8ZGl2IGlkPVwic3RhcmZpZWxkXCI+PC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGlkPVwibWFnaWNDaXJjbGVcIj48L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyIG1haW4tc3RhY2tcIiBzdHlsZT1cImNvbG9yOiNmZmY7XCI+XHJcbiAgICAgICAgICA8c2VjdGlvbiBjbGFzcz1cIm1pbmUgY2FyZCBtaW5lLWNhcmQgZmFkZS1pblwiPlxyXG4gICAgICAgICAgICA8aGVhZGVyIGNsYXNzPVwibWluZS1oZWFkZXJcIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWluZS10aXRsZVwiPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0aXRsZS1pY29uXCIgZGF0YS1pY289XCJwaWNrXCI+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0aXRsZS1sYWJlbFwiPlx1NjMxNlx1NzdGRlx1OTc2Mlx1Njc3Rjwvc3Bhbj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWluZS1jaGlwc1wiPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwaWxsXCIgaWQ9XCJzdGF0dXNUYWdcIj5cdTVGODVcdTY3M0E8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInBpbGwgcGlsbC1jeWNsZVwiPjxzcGFuIGRhdGEtaWNvPVwiY2xvY2tcIj48L3NwYW4+XHU1NDY4XHU2NzFGIDxzcGFuIGlkPVwiY3ljbGVcIj4zczwvc3Bhbj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvaGVhZGVyPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWluZS1ncmlkXCI+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1pbmUtZ2F1Z2VcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyaW5nXCIgaWQ9XCJyaW5nXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyaW5nLWNvcmVcIj5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBpZD1cInJpbmdQY3RcIj4wJTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8c21hbGw+XHU4OEM1XHU4RjdEXHU3Mzg3PC9zbWFsbD5cclxuICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyaW5nLWdsb3cgcmluZy1nbG93LWFcIj48L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyaW5nLWdsb3cgcmluZy1nbG93LWJcIj48L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWluZS1wcm9ncmVzc1wiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1pbmVyLWNoYXItd3JhcHBlclwiIGlkPVwibWluZXJDaGFyXCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWluZS1wcm9ncmVzcy1tZXRhXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuPlx1NzdGRlx1OEY2Nlx1ODhDNVx1OEY3RDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgPHN0cm9uZyBpZD1cInBlcmNlbnRcIj4wJTwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWluZS1wcm9ncmVzcy10cmFja1wiPlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWluZS1wcm9ncmVzcy1maWxsXCIgaWQ9XCJmaWxsXCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJzdGF0dXNUZXh0XCIgY2xhc3M9XCJtaW5lLXN0YXR1c1wiPjwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1pbmUtYWN0aW9ucy1ncmlkXCI+XHJcbiAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInN0YXJ0XCIgY2xhc3M9XCJidG4gYnRuLWJ1eSBzcGFuLTJcIj48c3BhbiBkYXRhLWljbz1cInBsYXlcIj48L3NwYW4+XHU1RjAwXHU1OUNCXHU2MzE2XHU3N0ZGPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInN0b3BcIiBjbGFzcz1cImJ0biBidG4tZ2hvc3RcIj48c3BhbiBkYXRhLWljbz1cInN0b3BcIj48L3NwYW4+XHU1MDVDXHU2QjYyPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImNvbGxlY3RcIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiPjxzcGFuIGRhdGEtaWNvPVwiY29sbGVjdFwiPjwvc3Bhbj5cdTY1MzZcdTc3RkY8L2J1dHRvbj5cclxuICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwic3RhdHVzXCIgY2xhc3M9XCJidG4gYnRuLWdob3N0XCI+PHNwYW4gZGF0YS1pY289XCJyZWZyZXNoXCI+PC9zcGFuPlx1NTIzN1x1NjVCMFx1NzJCNlx1NjAwMTwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJyZXBhaXJcIiBjbGFzcz1cImJ0biBidG4tc2VsbFwiPjxzcGFuIGRhdGEtaWNvPVwid3JlbmNoXCI+PC9zcGFuPlx1NEZFRVx1NzQwNjwvYnV0dG9uPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1pbmUtZmVlZFwiPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJldmVudC1mZWVkXCIgaWQ9XCJldmVudHNcIj48L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtaW5lLWhvbG9ncmFtXCIgaWQ9XCJob2xvZ3JhbVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxyXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibWluZS1ob2xvLWdyaWRcIj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJtaW5lLWhvbG8tZ3JpZCBkaWFnb25hbFwiPjwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm1pbmUtaG9sby1nbG93XCI+PC9zcGFuPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvc2VjdGlvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9zZWN0aW9uPlxyXG4gICAgYCk7XHJcblxyXG4gICAgcm9vdC5pbm5lckhUTUwgPSAnJztcclxuICAgIHJvb3QuYXBwZW5kQ2hpbGQobmF2KTtcclxuICAgIHJvb3QuYXBwZW5kQ2hpbGQoYmFyLnJvb3QpO1xyXG4gICAgcm9vdC5hcHBlbmRDaGlsZCh2aWV3KTtcclxuXHJcbiAgICB0aGlzLnZpZXcgPSB2aWV3O1xyXG4gICAgXHJcbiAgICAvLyBcdTZERkJcdTUyQTBcdTlBRDhcdTdFQTdTVkdcdTZFRTRcdTk1NUNcclxuICAgIGNvbnN0IGZpbHRlckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgZmlsdGVyRGl2LmlubmVySFRNTCA9IGNyZWF0ZUxpcXVpZEZpbHRlcigpO1xyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChmaWx0ZXJEaXYpO1xyXG4gICAgXHJcbiAgICAvLyBcdTZERkJcdTUyQTBcdTY2MUZcdTdBN0FcdTgwQ0NcdTY2NkZcclxuICAgIGNvbnN0IHN0YXJmaWVsZEVsID0gdmlldy5xdWVyeVNlbGVjdG9yKCcjc3RhcmZpZWxkJyk7XHJcbiAgICBpZiAoc3RhcmZpZWxkRWwpIHtcclxuICAgICAgc3RhcmZpZWxkRWwuYXBwZW5kQ2hpbGQoY3JlYXRlU3RhcmZpZWxkKCkpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBcdTZERkJcdTUyQTBcdTlCNTRcdTZDRDVcdTk2MzVcclxuICAgIGNvbnN0IG1hZ2ljQ2lyY2xlRWwgPSB2aWV3LnF1ZXJ5U2VsZWN0b3IoJyNtYWdpY0NpcmNsZScpO1xyXG4gICAgaWYgKG1hZ2ljQ2lyY2xlRWwpIHtcclxuICAgICAgbWFnaWNDaXJjbGVFbC5hcHBlbmRDaGlsZChjcmVhdGVNYWdpY0NpcmNsZSgpKTtcclxuICAgIH1cclxuICAgIC8vIG1vdW50IGljb25zIGluIGhlYWRlci9idXR0b25zXHJcbiAgICB0cnkge1xyXG4gICAgICB2aWV3LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWljb10nKVxyXG4gICAgICAgIC5mb3JFYWNoKChlbCkgPT4ge1xyXG4gICAgICAgICAgY29uc3QgbmFtZSA9IChlbCBhcyBIVE1MRWxlbWVudCkuZ2V0QXR0cmlidXRlKCdkYXRhLWljbycpIGFzIGFueTtcclxuICAgICAgICAgIHRyeSB7IGVsLmFwcGVuZENoaWxkKHJlbmRlckljb24obmFtZSwgeyBzaXplOiAyMCB9KSk7IH0gY2F0Y2gge31cclxuICAgICAgICB9KTtcclxuICAgIH0gY2F0Y2gge31cclxuICAgIHRoaXMuY2FjaGVFbGVtZW50cygpO1xyXG4gICAgdGhpcy5hdHRhY2hIYW5kbGVycyhiYXIudXBkYXRlLmJpbmQoYmFyKSk7XHJcbiAgICBhd2FpdCBiYXIudXBkYXRlKCk7XHJcbiAgICB0aGlzLnNldHVwUmVhbHRpbWUoKTtcclxuICAgIGF3YWl0IHRoaXMucmVmcmVzaFN0YXR1cygpO1xyXG4gICAgdGhpcy51cGRhdGVQcm9ncmVzcygpO1xyXG4gICAgdGhpcy51cGRhdGVDb250cm9scygpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjYWNoZUVsZW1lbnRzKCkge1xyXG4gICAgaWYgKCF0aGlzLnZpZXcpIHJldHVybjtcclxuICAgIHRoaXMuZWxzLmZpbGwgPSBxcyh0aGlzLnZpZXcsICcjZmlsbCcpO1xyXG4gICAgdGhpcy5lbHMucGVyY2VudCA9IHFzKHRoaXMudmlldywgJyNwZXJjZW50Jyk7XHJcbiAgICB0aGlzLmVscy5zdGF0dXNUZXh0ID0gcXModGhpcy52aWV3LCAnI3N0YXR1c1RleHQnKTtcclxuICAgIHRoaXMuZWxzLnJpbmcgPSB0aGlzLnZpZXcucXVlcnlTZWxlY3RvcignI3JpbmcnKTtcclxuICAgIHRoaXMuZWxzLnJpbmdQY3QgPSB0aGlzLnZpZXcucXVlcnlTZWxlY3RvcignI3JpbmdQY3QnKTtcclxuICAgIHRoaXMuZWxzLmN5Y2xlID0gdGhpcy52aWV3LnF1ZXJ5U2VsZWN0b3IoJyNjeWNsZScpO1xyXG4gICAgdGhpcy5lbHMuc3RhdHVzVGFnID0gdGhpcy52aWV3LnF1ZXJ5U2VsZWN0b3IoJyNzdGF0dXNUYWcnKTtcclxuICAgIHRoaXMuZWxzLmV2ZW50cyA9IHRoaXMudmlldy5xdWVyeVNlbGVjdG9yKCcjZXZlbnRzJyk7XHJcbiAgICB0aGlzLmVscy5zdGFydCA9IHFzPEhUTUxCdXR0b25FbGVtZW50Pih0aGlzLnZpZXcsICcjc3RhcnQnKTtcclxuICAgIHRoaXMuZWxzLnN0b3AgPSBxczxIVE1MQnV0dG9uRWxlbWVudD4odGhpcy52aWV3LCAnI3N0b3AnKTtcclxuICAgIHRoaXMuZWxzLmNvbGxlY3QgPSBxczxIVE1MQnV0dG9uRWxlbWVudD4odGhpcy52aWV3LCAnI2NvbGxlY3QnKTtcclxuICAgIHRoaXMuZWxzLnJlcGFpciA9IHFzPEhUTUxCdXR0b25FbGVtZW50Pih0aGlzLnZpZXcsICcjcmVwYWlyJyk7XHJcbiAgICB0aGlzLmVscy5zdGF0dXNCdG4gPSBxczxIVE1MQnV0dG9uRWxlbWVudD4odGhpcy52aWV3LCAnI3N0YXR1cycpO1xyXG4gICAgdGhpcy5lbHMuaG9sb2dyYW0gPSB0aGlzLnZpZXcucXVlcnlTZWxlY3RvcignI2hvbG9ncmFtJyk7XHJcbiAgICB0aGlzLmVscy5taW5lckNoYXIgPSB0aGlzLnZpZXcucXVlcnlTZWxlY3RvcignI21pbmVyQ2hhcicpO1xyXG4gICAgXHJcbiAgICAvLyBcdTUyMURcdTU5Q0JcdTUzMTZcdTc3RkZcdTVERTVcdTg5RDJcdTgyNzJcclxuICAgIHRoaXMudXBkYXRlTWluZXJBbmltYXRpb24oKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXR0YWNoSGFuZGxlcnModXBkYXRlQmFyOiAoKSA9PiBQcm9taXNlPHZvaWQ+KSB7XHJcbiAgICBpZiAoIXRoaXMudmlldykgcmV0dXJuO1xyXG4gICAgdGhpcy5lbHMuc3RhcnQ/LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdGhpcy5oYW5kbGVTdGFydCgpKTtcclxuICAgIHRoaXMuZWxzLnN0b3A/LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdGhpcy5oYW5kbGVTdG9wKCkpO1xyXG4gICAgdGhpcy5lbHMuc3RhdHVzQnRuPy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRoaXMucmVmcmVzaFN0YXR1cygpKTtcclxuICAgIHRoaXMuZWxzLnJlcGFpcj8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0aGlzLmhhbmRsZVJlcGFpcigpKTtcclxuICAgIHRoaXMuZWxzLmNvbGxlY3Q/LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdGhpcy5oYW5kbGVDb2xsZWN0KHVwZGF0ZUJhcikpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzZXR1cFJlYWx0aW1lKCkge1xyXG4gICAgY29uc3QgdG9rZW4gPSBOZXR3b3JrTWFuYWdlci5JLmdldFRva2VuKCk7XHJcbiAgICBpZiAodG9rZW4pIFJlYWx0aW1lQ2xpZW50LkkuY29ubmVjdCh0b2tlbik7XHJcblxyXG4gICAgaWYgKHRoaXMubWluZVVwZGF0ZUhhbmRsZXIpIFJlYWx0aW1lQ2xpZW50Lkkub2ZmKCdtaW5lLnVwZGF0ZScsIHRoaXMubWluZVVwZGF0ZUhhbmRsZXIpO1xyXG4gICAgaWYgKHRoaXMubWluZUNvbGxhcHNlSGFuZGxlcikgUmVhbHRpbWVDbGllbnQuSS5vZmYoJ21pbmUuY29sbGFwc2UnLCB0aGlzLm1pbmVDb2xsYXBzZUhhbmRsZXIpO1xyXG4gICAgaWYgKHRoaXMucGx1bmRlckhhbmRsZXIpIFJlYWx0aW1lQ2xpZW50Lkkub2ZmKCdwbHVuZGVyLmF0dGFja2VkJywgdGhpcy5wbHVuZGVySGFuZGxlcik7XHJcblxyXG4gICAgdGhpcy5taW5lVXBkYXRlSGFuZGxlciA9IChtc2cpID0+IHtcclxuICAgICAgdGhpcy5jYXJ0QW10ID0gdHlwZW9mIG1zZy5jYXJ0QW1vdW50ID09PSAnbnVtYmVyJyA/IG1zZy5jYXJ0QW1vdW50IDogdGhpcy5jYXJ0QW10O1xyXG4gICAgICB0aGlzLmNhcnRDYXAgPSB0eXBlb2YgbXNnLmNhcnRDYXBhY2l0eSA9PT0gJ251bWJlcicgPyBtc2cuY2FydENhcGFjaXR5IDogdGhpcy5jYXJ0Q2FwO1xyXG4gICAgICB0aGlzLmlzTWluaW5nID0gbXNnLnJ1bm5pbmcgPz8gdGhpcy5pc01pbmluZztcclxuICAgICAgaWYgKG1zZy5jb2xsYXBzZWQgJiYgbXNnLmNvbGxhcHNlZFJlbWFpbmluZykge1xyXG4gICAgICAgIHRoaXMuYmVnaW5Db2xsYXBzZUNvdW50ZG93bihtc2cuY29sbGFwc2VkUmVtYWluaW5nKTtcclxuICAgICAgfSBlbHNlIGlmICghbXNnLmNvbGxhcHNlZCkge1xyXG4gICAgICAgIHRoaXMuaXNDb2xsYXBzZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmNsZWFyQ29sbGFwc2VUaW1lcigpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMudXBkYXRlUHJvZ3Jlc3MoKTtcclxuICAgICAgXHJcbiAgICAgIC8vIFx1Nzg4RVx1NzI0N1x1ODNCN1x1NUY5N1x1NjNEMFx1NzkzQVxyXG4gICAgICBpZiAobXNnLmZyYWdtZW50KSB7XHJcbiAgICAgICAgY29uc3QgZnJhZ21lbnROYW1lczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcclxuICAgICAgICAgIG1pbmVyOiAnXHU3N0ZGXHU2NzNBXHU3ODhFXHU3MjQ3JyxcclxuICAgICAgICAgIGNhcnQ6ICdcdTc3RkZcdThGNjZcdTc4OEVcdTcyNDcnLFxyXG4gICAgICAgICAgcmFpZGVyOiAnXHU2M0EwXHU1OTNBXHU1NjY4XHU3ODhFXHU3MjQ3JyxcclxuICAgICAgICAgIHNoaWVsZDogJ1x1OTYzMlx1NUZBMVx1NzZGRVx1Nzg4RVx1NzI0NycsXHJcbiAgICAgICAgfTtcclxuICAgICAgICBzaG93VG9hc3QoYFx1RDgzRFx1REM4RSBcdTgzQjdcdTVGOTcgJHtmcmFnbWVudE5hbWVzW21zZy5mcmFnbWVudC50eXBlXSB8fCAnXHU3ODhFXHU3MjQ3J30geCR7bXNnLmZyYWdtZW50LmFtb3VudH1gLCAnc3VjY2VzcycpO1xyXG4gICAgICAgIHRoaXMubG9nRXZlbnQoYFx1ODNCN1x1NUY5N1x1Nzg4RVx1NzI0N1x1RkYxQSR7ZnJhZ21lbnROYW1lc1ttc2cuZnJhZ21lbnQudHlwZV19IHgke21zZy5mcmFnbWVudC5hbW91bnR9YCk7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIGlmIChtc2cudHlwZSA9PT0gJ2NyaXRpY2FsJyAmJiBtc2cuYW1vdW50KSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0dXNNZXNzYWdlKGBcdTg5RTZcdTUzRDFcdTY2QjRcdTUxRkJcdUZGMENcdTc3RkZcdThGNjZcdTU4OUVcdTUyQTAgJHttc2cuYW1vdW50fVx1RkYwMWApO1xyXG4gICAgICAgIHRoaXMubG9nRXZlbnQoYFx1NjZCNFx1NTFGQiArJHttc2cuYW1vdW50fWApO1xyXG4gICAgICB9IGVsc2UgaWYgKG1zZy50eXBlID09PSAnbm9ybWFsJyAmJiBtc2cuYW1vdW50KSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0dXNNZXNzYWdlKGBcdTc3RkZcdThGNjZcdTU4OUVcdTUyQTAgJHttc2cuYW1vdW50fVx1RkYwQ1x1NUY1M1x1NTI0RCAke3RoaXMuZm9ybWF0UGVyY2VudCgpfWApO1xyXG4gICAgICAgIHRoaXMubG9nRXZlbnQoYFx1NjMxNlx1NjM5OCArJHttc2cuYW1vdW50fWApO1xyXG4gICAgICB9IGVsc2UgaWYgKG1zZy50eXBlID09PSAnY29sbGFwc2UnKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0dXNNZXNzYWdlKCdcdTc3RkZcdTkwNTNcdTU3NERcdTU4NENcdUZGMENcdThCRjdcdTdBQ0JcdTUzNzNcdTRGRUVcdTc0MDYnKTtcclxuICAgICAgICB0aGlzLmxvZ0V2ZW50KCdcdTc3RkZcdTkwNTNcdTU3NERcdTU4NEMnKTtcclxuICAgICAgfSBlbHNlIGlmIChtc2cudHlwZSA9PT0gJ2NvbGxlY3QnKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0dXNNZXNzYWdlKCdcdTc3RkZcdTc3RjNcdTVERjJcdTY1MzZcdTk2QzZcdUZGMENcdTc3RkZcdThGNjZcdTZFMDVcdTdBN0EnKTtcclxuICAgICAgICB0aGlzLmxvZ0V2ZW50KCdcdTY1MzZcdTk2QzZcdTVCOENcdTYyMTAnKTtcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLmlzQ29sbGFwc2VkKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0dXNNZXNzYWdlKGBcdTc3RkZcdTkwNTNcdTU3NERcdTU4NENcdUZGMENcdTUyNjlcdTRGNTkgJHt0aGlzLmNvbGxhcHNlUmVtYWluaW5nfXNgKTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMubWluZUNvbGxhcHNlSGFuZGxlciA9IChtc2cpID0+IHtcclxuICAgICAgY29uc3Qgc2Vjb25kcyA9IE51bWJlcihtc2c/LnJlcGFpcl9kdXJhdGlvbikgfHwgMDtcclxuICAgICAgaWYgKHNlY29uZHMgPiAwKSB0aGlzLmJlZ2luQ29sbGFwc2VDb3VudGRvd24oc2Vjb25kcyk7XHJcbiAgICAgIHNob3dUb2FzdChgXHU3N0ZGXHU5MDUzXHU1NzREXHU1ODRDXHVGRjBDXHU5NzAwXHU0RkVFXHU3NDA2XHVGRjA4XHU3RUE2ICR7c2Vjb25kc31zXHVGRjA5YCwgJ3dhcm4nKTtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5wbHVuZGVySGFuZGxlciA9IChtc2cpID0+IHtcclxuICAgICAgc2hvd1RvYXN0KGBcdTg4QUJcdTYzQTBcdTU5M0FcdUZGMUFcdTY3NjVcdTgxRUEgJHttc2cuYXR0YWNrZXJ9XHVGRjBDXHU2MzVGXHU1OTMxICR7bXNnLmxvc3N9YCwgJ3dhcm4nKTtcclxuICAgICAgdGhpcy5sb2dFdmVudChgXHU4OEFCICR7bXNnLmF0dGFja2VyfSBcdTYzQTBcdTU5M0EgLSR7bXNnLmxvc3N9YCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIFx1NTE2OFx1NjcwRFx1NUU3Rlx1NjRBRFx1NzZEMVx1NTQyQ1xyXG4gICAgUmVhbHRpbWVDbGllbnQuSS5vbignZ2xvYmFsLmFubm91bmNlbWVudCcsIChtc2cpID0+IHtcclxuICAgICAgaWYgKG1zZy50eXBlID09PSAndXBncmFkZScpIHtcclxuICAgICAgICBzaG93VG9hc3QoYFx1RDgzRFx1RENFMiAke21zZy5tZXNzYWdlfWAsICdzdWNjZXNzJyk7XHJcbiAgICAgICAgdGhpcy5sb2dFdmVudChgW1x1NTE2OFx1NjcwRF0gJHttc2cubWVzc2FnZX1gKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgUmVhbHRpbWVDbGllbnQuSS5vbignbWluZS51cGRhdGUnLCB0aGlzLm1pbmVVcGRhdGVIYW5kbGVyKTtcclxuICAgIFJlYWx0aW1lQ2xpZW50Lkkub24oJ21pbmUuY29sbGFwc2UnLCB0aGlzLm1pbmVDb2xsYXBzZUhhbmRsZXIpO1xyXG4gICAgUmVhbHRpbWVDbGllbnQuSS5vbigncGx1bmRlci5hdHRhY2tlZCcsIHRoaXMucGx1bmRlckhhbmRsZXIpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhc3luYyBoYW5kbGVTdGFydCgpIHtcclxuICAgIGlmICh0aGlzLnBlbmRpbmcgfHwgdGhpcy5pc0NvbGxhcHNlZCkge1xyXG4gICAgICBpZiAodGhpcy5pc0NvbGxhcHNlZCkgc2hvd1RvYXN0KCdcdTc3RkZcdTkwNTNcdTU3NERcdTU4NENcdUZGMENcdThCRjdcdTUxNDhcdTRGRUVcdTc0MDYnLCAnd2FybicpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0aGlzLnBlbmRpbmcgPSAnc3RhcnQnO1xyXG4gICAgdGhpcy51cGRhdGVDb250cm9scygpO1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3Qgc3RhdHVzID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PE1pbmVTdGF0dXM+KCcvbWluZS9zdGFydCcsIHsgbWV0aG9kOiAnUE9TVCcgfSk7XHJcbiAgICAgIHRoaXMuYXBwbHlTdGF0dXMoc3RhdHVzKTtcclxuICAgICAgdGhpcy5zZXRTdGF0dXNNZXNzYWdlKCdcdTc3RkZcdTY3M0FcdTVERjJcdTU0MkZcdTUyQTgnKTtcclxuICAgICAgc2hvd1RvYXN0KCdcdTc3RkZcdTY3M0FcdTVERjJcdTU0MkZcdTUyQTgnLCAnc3VjY2VzcycpO1xyXG4gICAgfSBjYXRjaCAoZTogYW55KSB7XHJcbiAgICAgIHNob3dUb2FzdChlPy5tZXNzYWdlIHx8ICdcdTU0MkZcdTUyQThcdTU5MzFcdThEMjUnLCAnZXJyb3InKTtcclxuICAgIH0gZmluYWxseSB7XHJcbiAgICAgIHRoaXMucGVuZGluZyA9IG51bGw7XHJcbiAgICAgIHRoaXMudXBkYXRlQ29udHJvbHMoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXN5bmMgaGFuZGxlU3RvcCgpIHtcclxuICAgIGlmICh0aGlzLnBlbmRpbmcpIHJldHVybjtcclxuICAgIHRoaXMucGVuZGluZyA9ICdzdG9wJztcclxuICAgIHRoaXMudXBkYXRlQ29udHJvbHMoKTtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHN0YXR1cyA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDxNaW5lU3RhdHVzPignL21pbmUvc3RvcCcsIHsgbWV0aG9kOiAnUE9TVCcgfSk7XHJcbiAgICAgIHRoaXMuYXBwbHlTdGF0dXMoc3RhdHVzKTtcclxuICAgICAgdGhpcy5zZXRTdGF0dXNNZXNzYWdlKCdcdTc3RkZcdTY3M0FcdTVERjJcdTUwNUNcdTZCNjInKTtcclxuICAgICAgc2hvd1RvYXN0KCdcdTc3RkZcdTY3M0FcdTVERjJcdTUwNUNcdTZCNjInLCAnc3VjY2VzcycpO1xyXG4gICAgfSBjYXRjaCAoZTogYW55KSB7XHJcbiAgICAgIHNob3dUb2FzdChlPy5tZXNzYWdlIHx8ICdcdTUwNUNcdTZCNjJcdTU5MzFcdThEMjUnLCAnZXJyb3InKTtcclxuICAgIH0gZmluYWxseSB7XHJcbiAgICAgIHRoaXMucGVuZGluZyA9IG51bGw7XHJcbiAgICAgIHRoaXMudXBkYXRlQ29udHJvbHMoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXN5bmMgaGFuZGxlQ29sbGVjdCh1cGRhdGVCYXI6ICgpID0+IFByb21pc2U8dm9pZD4pIHtcclxuICAgIGlmICh0aGlzLnBlbmRpbmcgfHwgdGhpcy5jYXJ0QW10IDw9IDApIHJldHVybjtcclxuICAgIFxyXG4gICAgLy8gXHU2OEMwXHU2N0U1VklQXHU3MkI2XHU2MDAxXHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCB2aXBTdGF0dXMgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyBpc1ZpcDogYm9vbGVhbiB9PignL3VzZXIvdmlwLXN0YXR1cycpO1xyXG4gICAgICBpZiAoIXZpcFN0YXR1cy5pc1ZpcCkge1xyXG4gICAgICAgIC8vIFx1OTc1RVZJUFx1RkYwQ1x1NjYzRVx1NzkzQVx1NUU3Rlx1NTQ0QVxyXG4gICAgICAgIGNvbnN0IHdhdGNoZWQgPSBhd2FpdCBzaG93QWREaWFsb2coKTtcclxuICAgICAgICBpZiAoIXdhdGNoZWQpIHtcclxuICAgICAgICAgIC8vIFx1NzUyOFx1NjIzN1x1OERGM1x1OEZDN1x1NUU3Rlx1NTQ0QVx1RkYwQ1x1NEUwRFx1NjUzNlx1NzdGRlxyXG4gICAgICAgICAgc2hvd1RvYXN0KCdcdTVERjJcdThERjNcdThGQzdcdTVFN0ZcdTU0NEFcdUZGMENcdTY1MzZcdTc3RkZcdTUzRDZcdTZEODgnLCAnd2FybicpO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZTogYW55KSB7XHJcbiAgICAgIGNvbnNvbGUud2FybignVklQIHN0YXR1cyBjaGVjayBmYWlsZWQ6JywgZSk7XHJcbiAgICAgIC8vIFx1NTk4Mlx1Njc5Q1x1NjhDMFx1NjdFNVx1NTkzMVx1OEQyNVx1RkYwQ1x1NTE0MVx1OEJCOFx1N0VFN1x1N0VFRFx1RkYwOFx1OTY0RFx1N0VBN1x1NTkwNFx1NzQwNlx1RkYwOVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICB0aGlzLnBlbmRpbmcgPSAnY29sbGVjdCc7XHJcbiAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzKCk7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCByZXMgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyBjb2xsZWN0ZWQ6IG51bWJlcjsgc3RhdHVzOiBNaW5lU3RhdHVzIH0+KCcvbWluZS9jb2xsZWN0JywgeyBtZXRob2Q6ICdQT1NUJyB9KTtcclxuICAgICAgaWYgKHJlcy5zdGF0dXMpIHRoaXMuYXBwbHlTdGF0dXMocmVzLnN0YXR1cyk7XHJcbiAgICAgIGlmIChyZXMuY29sbGVjdGVkID4gMCkge1xyXG4gICAgICAgIC8vIFx1NTIxQlx1NUVGQVx1NjI5Qlx1NzI2OVx1N0VCRlx1OThERVx1ODg0Q1x1NTJBOFx1NzUzQlxyXG4gICAgICAgIHRoaXMuY3JlYXRlRmx5aW5nT3JlQW5pbWF0aW9uKHJlcy5jb2xsZWN0ZWQpO1xyXG4gICAgICAgIHNob3dUb2FzdChgXHU2NTM2XHU5NkM2XHU3N0ZGXHU3N0YzICR7cmVzLmNvbGxlY3RlZH1gLCAnc3VjY2VzcycpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNob3dUb2FzdCgnXHU3N0ZGXHU4RjY2XHU0RTNBXHU3QTdBXHVGRjBDXHU2NUUwXHU3N0ZGXHU3N0YzXHU1M0VGXHU2NTM2XHU5NkM2JywgJ3dhcm4nKTtcclxuICAgICAgfVxyXG4gICAgICBhd2FpdCB1cGRhdGVCYXIoKTtcclxuICAgIH0gY2F0Y2ggKGU6IGFueSkge1xyXG4gICAgICBzaG93VG9hc3QoZT8ubWVzc2FnZSB8fCAnXHU2NTM2XHU3N0ZGXHU1OTMxXHU4RDI1JywgJ2Vycm9yJyk7XHJcbiAgICB9IGZpbmFsbHkge1xyXG4gICAgICB0aGlzLnBlbmRpbmcgPSBudWxsO1xyXG4gICAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNyZWF0ZUZseWluZ09yZUFuaW1hdGlvbihhbW91bnQ6IG51bWJlcikge1xyXG4gICAgY29uc3QgZmlsbEVsID0gdGhpcy5lbHMuZmlsbDtcclxuICAgIGNvbnN0IG9yZUVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI29yZScpO1xyXG4gICAgaWYgKCFmaWxsRWwgfHwgIW9yZUVsKSByZXR1cm47XHJcblxyXG4gICAgY29uc3Qgc3RhcnRSZWN0ID0gZmlsbEVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgY29uc3QgZW5kUmVjdCA9IG9yZUVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cclxuICAgIC8vIFx1NTIxQlx1NUVGQVx1NTkxQVx1NEUyQVx1NzdGRlx1NzdGM1x1N0M5Mlx1NUI1MFxyXG4gICAgY29uc3QgcGFydGljbGVDb3VudCA9IE1hdGgubWluKDgsIE1hdGgubWF4KDMsIE1hdGguZmxvb3IoYW1vdW50IC8gMjApKSk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcnRpY2xlQ291bnQ7IGkrKykge1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBjb25zdCBwYXJ0aWNsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHBhcnRpY2xlLmNsYXNzTmFtZSA9ICdvcmUtcGFydGljbGUnO1xyXG4gICAgICAgIHBhcnRpY2xlLnRleHRDb250ZW50ID0gJ1x1RDgzRFx1REM4RSc7XHJcbiAgICAgICAgcGFydGljbGUuc3R5bGUuY3NzVGV4dCA9IGBcclxuICAgICAgICAgIHBvc2l0aW9uOiBmaXhlZDtcclxuICAgICAgICAgIGxlZnQ6ICR7c3RhcnRSZWN0LmxlZnQgKyBzdGFydFJlY3Qud2lkdGggLyAyfXB4O1xyXG4gICAgICAgICAgdG9wOiAke3N0YXJ0UmVjdC50b3AgKyBzdGFydFJlY3QuaGVpZ2h0IC8gMn1weDtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMjRweDtcclxuICAgICAgICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xyXG4gICAgICAgICAgei1pbmRleDogOTk5OTtcclxuICAgICAgICAgIGZpbHRlcjogZHJvcC1zaGFkb3coMCAwIDhweCByZ2JhKDEyMyw0NCwyNDUsMC44KSk7XHJcbiAgICAgICAgYDtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHBhcnRpY2xlKTtcclxuXHJcbiAgICAgICAgY29uc3QgZHggPSBlbmRSZWN0LmxlZnQgKyBlbmRSZWN0LndpZHRoIC8gMiAtIHN0YXJ0UmVjdC5sZWZ0IC0gc3RhcnRSZWN0LndpZHRoIC8gMjtcclxuICAgICAgICBjb25zdCBkeSA9IGVuZFJlY3QudG9wICsgZW5kUmVjdC5oZWlnaHQgLyAyIC0gc3RhcnRSZWN0LnRvcCAtIHN0YXJ0UmVjdC5oZWlnaHQgLyAyO1xyXG4gICAgICAgIGNvbnN0IHJhbmRvbU9mZnNldCA9IChNYXRoLnJhbmRvbSgpIC0gMC41KSAqIDEwMDtcclxuXHJcbiAgICAgICAgcGFydGljbGUuYW5pbWF0ZShbXHJcbiAgICAgICAgICB7IFxyXG4gICAgICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGUoMCwgMCkgc2NhbGUoMSknLCBcclxuICAgICAgICAgICAgb3BhY2l0eTogMSBcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7IFxyXG4gICAgICAgICAgICB0cmFuc2Zvcm06IGB0cmFuc2xhdGUoJHtkeC8yICsgcmFuZG9tT2Zmc2V0fXB4LCAke2R5IC0gMTUwfXB4KSBzY2FsZSgxLjIpYCwgXHJcbiAgICAgICAgICAgIG9wYWNpdHk6IDEsXHJcbiAgICAgICAgICAgIG9mZnNldDogMC41XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgeyBcclxuICAgICAgICAgICAgdHJhbnNmb3JtOiBgdHJhbnNsYXRlKCR7ZHh9cHgsICR7ZHl9cHgpIHNjYWxlKDAuNSlgLCBcclxuICAgICAgICAgICAgb3BhY2l0eTogMCBcclxuICAgICAgICAgIH1cclxuICAgICAgICBdLCB7XHJcbiAgICAgICAgICBkdXJhdGlvbjogMTAwMCArIGkgKiA1MCxcclxuICAgICAgICAgIGVhc2luZzogJ2N1YmljLWJlemllcigwLjI1LCAwLjQ2LCAwLjQ1LCAwLjk0KSdcclxuICAgICAgICB9KS5vbmZpbmlzaCA9ICgpID0+IHtcclxuICAgICAgICAgIHBhcnRpY2xlLnJlbW92ZSgpO1xyXG4gICAgICAgICAgLy8gXHU2NzAwXHU1NDBFXHU0RTAwXHU0RTJBXHU3QzkyXHU1QjUwXHU1MjMwXHU4RkJFXHU2NUY2XHVGRjBDXHU2REZCXHU1MkEwXHU4MTA5XHU1MUIyXHU2NTQ4XHU2NzlDXHJcbiAgICAgICAgICBpZiAoaSA9PT0gcGFydGljbGVDb3VudCAtIDEpIHtcclxuICAgICAgICAgICAgb3JlRWwuY2xhc3NMaXN0LmFkZCgnZmxhc2gnKTtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBvcmVFbC5jbGFzc0xpc3QucmVtb3ZlKCdmbGFzaCcpLCA5MDApO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgIH0sIGkgKiA4MCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFzeW5jIGhhbmRsZVJlcGFpcigpIHtcclxuICAgIGlmICh0aGlzLnBlbmRpbmcgfHwgIXRoaXMuaXNDb2xsYXBzZWQpIHJldHVybjtcclxuICAgIHRoaXMucGVuZGluZyA9ICdyZXBhaXInO1xyXG4gICAgdGhpcy51cGRhdGVDb250cm9scygpO1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3Qgc3RhdHVzID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PE1pbmVTdGF0dXM+KCcvbWluZS9yZXBhaXInLCB7IG1ldGhvZDogJ1BPU1QnIH0pO1xyXG4gICAgICB0aGlzLmFwcGx5U3RhdHVzKHN0YXR1cyk7XHJcbiAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZSgnXHU3N0ZGXHU5MDUzXHU1REYyXHU0RkVFXHU1OTBEXHVGRjBDXHU1M0VGXHU5MUNEXHU2NUIwXHU1NDJGXHU1MkE4Jyk7XHJcbiAgICAgIHNob3dUb2FzdCgnXHU3N0ZGXHU5MDUzXHU1REYyXHU0RkVFXHU1OTBEJywgJ3N1Y2Nlc3MnKTtcclxuICAgIH0gY2F0Y2ggKGU6IGFueSkge1xyXG4gICAgICBzaG93VG9hc3QoZT8ubWVzc2FnZSB8fCAnXHU0RkVFXHU3NDA2XHU1OTMxXHU4RDI1JywgJ2Vycm9yJyk7XHJcbiAgICB9IGZpbmFsbHkge1xyXG4gICAgICB0aGlzLnBlbmRpbmcgPSBudWxsO1xyXG4gICAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFzeW5jIHJlZnJlc2hTdGF0dXMoKSB7XHJcbiAgICBpZiAodGhpcy5wZW5kaW5nID09PSAnc3RhdHVzJykgcmV0dXJuO1xyXG4gICAgdGhpcy5wZW5kaW5nID0gJ3N0YXR1cyc7XHJcbiAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzKCk7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBzdGF0dXMgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8TWluZVN0YXR1cz4oJy9taW5lL3N0YXR1cycpO1xyXG4gICAgICB0aGlzLmFwcGx5U3RhdHVzKHN0YXR1cyk7XHJcbiAgICB9IGNhdGNoIChlOiBhbnkpIHtcclxuICAgICAgc2hvd1RvYXN0KGU/Lm1lc3NhZ2UgfHwgJ1x1ODNCN1x1NTNENlx1NzJCNlx1NjAwMVx1NTkzMVx1OEQyNScsICdlcnJvcicpO1xyXG4gICAgfSBmaW5hbGx5IHtcclxuICAgICAgdGhpcy5wZW5kaW5nID0gbnVsbDtcclxuICAgICAgdGhpcy51cGRhdGVDb250cm9scygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhcHBseVN0YXR1cyhzdGF0dXM6IE1pbmVTdGF0dXMgfCB1bmRlZmluZWQsIG9wdHM6IHsgcXVpZXQ/OiBib29sZWFuIH0gPSB7fSkge1xyXG4gICAgaWYgKCFzdGF0dXMpIHJldHVybjtcclxuICAgIHRoaXMuY2FydEFtdCA9IHN0YXR1cy5jYXJ0QW1vdW50ID8/IHRoaXMuY2FydEFtdDtcclxuICAgIHRoaXMuY2FydENhcCA9IHN0YXR1cy5jYXJ0Q2FwYWNpdHkgPz8gdGhpcy5jYXJ0Q2FwO1xyXG4gICAgdGhpcy5pbnRlcnZhbE1zID0gc3RhdHVzLmludGVydmFsTXMgPz8gdGhpcy5pbnRlcnZhbE1zO1xyXG4gICAgdGhpcy5pc01pbmluZyA9IEJvb2xlYW4oc3RhdHVzLnJ1bm5pbmcpO1xyXG4gICAgdGhpcy5pc0NvbGxhcHNlZCA9IEJvb2xlYW4oc3RhdHVzLmNvbGxhcHNlZCk7XHJcbiAgICBpZiAoc3RhdHVzLmNvbGxhcHNlZCAmJiBzdGF0dXMuY29sbGFwc2VkUmVtYWluaW5nID4gMCkge1xyXG4gICAgICB0aGlzLmJlZ2luQ29sbGFwc2VDb3VudGRvd24oc3RhdHVzLmNvbGxhcHNlZFJlbWFpbmluZyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmNsZWFyQ29sbGFwc2VUaW1lcigpO1xyXG4gICAgICB0aGlzLmNvbGxhcHNlUmVtYWluaW5nID0gMDtcclxuICAgIH1cclxuICAgIHRoaXMudXBkYXRlUHJvZ3Jlc3MoKTtcclxuICAgIGlmICghb3B0cy5xdWlldCkge1xyXG4gICAgICBpZiAodGhpcy5pc0NvbGxhcHNlZCAmJiB0aGlzLmNvbGxhcHNlUmVtYWluaW5nID4gMCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZShgXHU3N0ZGXHU5MDUzXHU1NzREXHU1ODRDXHVGRjBDXHU1MjY5XHU0RjU5ICR7dGhpcy5jb2xsYXBzZVJlbWFpbmluZ31zYCk7XHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pc01pbmluZykge1xyXG4gICAgICAgIGNvbnN0IHNlY29uZHMgPSBNYXRoLm1heCgxLCBNYXRoLnJvdW5kKHRoaXMuaW50ZXJ2YWxNcyAvIDEwMDApKTtcclxuICAgICAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoYFx1NzdGRlx1NjczQVx1OEZEMFx1ODg0Q1x1NEUyRFx1RkYwQ1x1NTQ2OFx1NjcxRlx1N0VBNiAke3NlY29uZHN9c1x1RkYwQ1x1NUY1M1x1NTI0RCAke3RoaXMuZm9ybWF0UGVyY2VudCgpfWApO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZSgnXHU3N0ZGXHU2NzNBXHU1REYyXHU1MDVDXHU2QjYyXHVGRjBDXHU3MEI5XHU1MUZCXHU1RjAwXHU1OUNCXHU2MzE2XHU3N0ZGJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICh0aGlzLmVscy5jeWNsZSkge1xyXG4gICAgICBjb25zdCBzZWNvbmRzID0gTWF0aC5tYXgoMSwgTWF0aC5yb3VuZCh0aGlzLmludGVydmFsTXMgLyAxMDAwKSk7XHJcbiAgICAgIHRoaXMuZWxzLmN5Y2xlLnRleHRDb250ZW50ID0gYCR7c2Vjb25kc31zYDtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLmVscy5zdGF0dXNUYWcpIHtcclxuICAgICAgY29uc3QgZWwgPSB0aGlzLmVscy5zdGF0dXNUYWcgYXMgSFRNTEVsZW1lbnQ7XHJcbiAgICAgIGVsLmlubmVySFRNTCA9ICcnO1xyXG4gICAgICBcclxuICAgICAgLy8gXHU3OUZCXHU5NjY0XHU2MjQwXHU2NzA5XHU3MkI2XHU2MDAxXHU3QzdCXHJcbiAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ3BpbGwtcnVubmluZycsICdwaWxsLWNvbGxhcHNlZCcpO1xyXG4gICAgICBcclxuICAgICAgY29uc3QgaWNvID0gdGhpcy5pc0NvbGxhcHNlZCA/ICdjbG9zZScgOiAodGhpcy5pc01pbmluZyA/ICdib2x0JyA6ICdjbG9jaycpO1xyXG4gICAgICB0cnkgeyBlbC5hcHBlbmRDaGlsZChyZW5kZXJJY29uKGljbyBhcyBhbnksIHsgc2l6ZTogMTYgfSkpOyB9IGNhdGNoIHt9XHJcbiAgICAgIGVsLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRoaXMuaXNDb2xsYXBzZWQgPyAnXHU1NzREXHU1ODRDJyA6ICh0aGlzLmlzTWluaW5nID8gJ1x1OEZEMFx1ODg0Q1x1NEUyRCcgOiAnXHU1Rjg1XHU2NzNBJykpKTtcclxuICAgICAgXHJcbiAgICAgIC8vIFx1NkRGQlx1NTJBMFx1NUJGOVx1NUU5NFx1NzY4NFx1NTJBOFx1NjAwMVx1NjgzN1x1NUYwRlx1N0M3QlxyXG4gICAgICBpZiAodGhpcy5pc0NvbGxhcHNlZCkge1xyXG4gICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoJ3BpbGwtY29sbGFwc2VkJyk7XHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pc01pbmluZykge1xyXG4gICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoJ3BpbGwtcnVubmluZycpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGJlZ2luQ29sbGFwc2VDb3VudGRvd24oc2Vjb25kczogbnVtYmVyKSB7XHJcbiAgICB0aGlzLmNsZWFyQ29sbGFwc2VUaW1lcigpO1xyXG4gICAgdGhpcy5pc0NvbGxhcHNlZCA9IHRydWU7XHJcbiAgICB0aGlzLmNvbGxhcHNlUmVtYWluaW5nID0gTWF0aC5tYXgoMCwgTWF0aC5mbG9vcihzZWNvbmRzKSk7XHJcbiAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoYFx1NzdGRlx1OTA1M1x1NTc0RFx1NTg0Q1x1RkYwQ1x1NTI2OVx1NEY1OSAke3RoaXMuY29sbGFwc2VSZW1haW5pbmd9c2ApO1xyXG4gICAgdGhpcy51cGRhdGVDb250cm9scygpO1xyXG4gICAgdGhpcy5jb2xsYXBzZVRpbWVyID0gd2luZG93LnNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgdGhpcy5jb2xsYXBzZVJlbWFpbmluZyA9IE1hdGgubWF4KDAsIHRoaXMuY29sbGFwc2VSZW1haW5pbmcgLSAxKTtcclxuICAgICAgaWYgKHRoaXMuY29sbGFwc2VSZW1haW5pbmcgPD0gMCkge1xyXG4gICAgICAgIHRoaXMuY2xlYXJDb2xsYXBzZVRpbWVyKCk7XHJcbiAgICAgICAgdGhpcy5pc0NvbGxhcHNlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZSgnXHU1NzREXHU1ODRDXHU4OUUzXHU5NjY0XHVGRjBDXHU1M0VGXHU5MUNEXHU2NUIwXHU1NDJGXHU1MkE4XHU3N0ZGXHU2NzNBJyk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVDb250cm9scygpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZShgXHU3N0ZGXHU5MDUzXHU1NzREXHU1ODRDXHVGRjBDXHU1MjY5XHU0RjU5ICR7dGhpcy5jb2xsYXBzZVJlbWFpbmluZ31zYCk7XHJcbiAgICAgIH1cclxuICAgIH0sIDEwMDApO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjbGVhckNvbGxhcHNlVGltZXIoKSB7XHJcbiAgICBpZiAodGhpcy5jb2xsYXBzZVRpbWVyICE9PSBudWxsKSB7XHJcbiAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKHRoaXMuY29sbGFwc2VUaW1lcik7XHJcbiAgICAgIHRoaXMuY29sbGFwc2VUaW1lciA9IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGxhc3RNaWxlc3RvbmUgPSAwO1xyXG5cclxuICBwcml2YXRlIHVwZGF0ZVByb2dyZXNzKCkge1xyXG4gICAgaWYgKCF0aGlzLmVscy5maWxsIHx8ICF0aGlzLmVscy5wZXJjZW50KSByZXR1cm47XHJcbiAgICBjb25zdCBwY3QgPSB0aGlzLmNhcnRDYXAgPiAwID8gTWF0aC5taW4oMSwgdGhpcy5jYXJ0QW10IC8gdGhpcy5jYXJ0Q2FwKSA6IDA7XHJcbiAgICBjb25zdCBwY3RJbnQgPSBNYXRoLnJvdW5kKHBjdCAqIDEwMCk7XHJcbiAgICBcclxuICAgIHRoaXMuZWxzLmZpbGwuc3R5bGUud2lkdGggPSBgJHtwY3RJbnR9JWA7XHJcbiAgICB0aGlzLmVscy5wZXJjZW50LnRleHRDb250ZW50ID0gYCR7cGN0SW50fSVgO1xyXG4gICAgXHJcbiAgICAvLyBcdTU3MDZcdTczQUZcdTk4OUNcdTgyNzJcdTZFMTBcdTUzRDhcdUZGMUFcdTdEMkJcdTgyNzIgLT4gXHU4NEREXHU4MjcyIC0+IFx1OTFEMVx1ODI3MlxyXG4gICAgbGV0IHJpbmdDb2xvciA9ICcjN0IyQ0Y1JzsgLy8gXHU3RDJCXHU4MjcyXHJcbiAgICBpZiAocGN0ID49IDAuNzUpIHtcclxuICAgICAgcmluZ0NvbG9yID0gJyNmNmM0NDUnOyAvLyBcdTkxRDFcdTgyNzJcclxuICAgIH0gZWxzZSBpZiAocGN0ID49IDAuNSkge1xyXG4gICAgICByaW5nQ29sb3IgPSAnIzJDODlGNSc7IC8vIFx1ODRERFx1ODI3MlxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpZiAodGhpcy5lbHMucmluZykge1xyXG4gICAgICBjb25zdCBkZWcgPSBNYXRoLnJvdW5kKHBjdCAqIDM2MCk7XHJcbiAgICAgICh0aGlzLmVscy5yaW5nIGFzIEhUTUxFbGVtZW50KS5zdHlsZS5iYWNrZ3JvdW5kID0gYGNvbmljLWdyYWRpZW50KCR7cmluZ0NvbG9yfSAke2RlZ31kZWcsIHJnYmEoMjU1LDI1NSwyNTUsLjA4KSAwZGVnKWA7XHJcbiAgICAgIFxyXG4gICAgICAvLyBcdTZFRTFcdThGN0RcdTY1RjZcdTYzMDFcdTdFRURcdTk1RUFcdTgwMDBcclxuICAgICAgaWYgKHBjdCA+PSAxKSB7XHJcbiAgICAgICAgdGhpcy5lbHMucmluZy5jbGFzc0xpc3QuYWRkKCdyaW5nLWZ1bGwnKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmVscy5yaW5nLmNsYXNzTGlzdC5yZW1vdmUoJ3JpbmctZnVsbCcpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGlmICh0aGlzLmVscy5yaW5nUGN0KSB0aGlzLmVscy5yaW5nUGN0LnRleHRDb250ZW50ID0gYCR7cGN0SW50fSVgO1xyXG4gICAgXHJcbiAgICAvLyBcdTkxQ0NcdTdBMEJcdTc4OTFcdTgxMDlcdTUxQjJcdTcyNzlcdTY1NDhcclxuICAgIGNvbnN0IG1pbGVzdG9uZXMgPSBbMjUsIDUwLCA3NSwgMTAwXTtcclxuICAgIGZvciAoY29uc3QgbWlsZXN0b25lIG9mIG1pbGVzdG9uZXMpIHtcclxuICAgICAgaWYgKHBjdEludCA+PSBtaWxlc3RvbmUgJiYgdGhpcy5sYXN0TWlsZXN0b25lIDwgbWlsZXN0b25lKSB7XHJcbiAgICAgICAgdGhpcy50cmlnZ2VyTWlsZXN0b25lUHVsc2UobWlsZXN0b25lKTtcclxuICAgICAgICB0aGlzLmxhc3RNaWxlc3RvbmUgPSBtaWxlc3RvbmU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gXHU1RjUzXHU4OEM1XHU4RjdEXHU3Mzg3XHU0RTBCXHU5NjREXHVGRjA4XHU2NTM2XHU3N0ZGXHU1NDBFXHVGRjA5XHU5MUNEXHU3RjZFXHU5MUNDXHU3QTBCXHU3ODkxXHJcbiAgICBpZiAocGN0SW50IDwgdGhpcy5sYXN0TWlsZXN0b25lIC0gMTApIHtcclxuICAgICAgdGhpcy5sYXN0TWlsZXN0b25lID0gTWF0aC5mbG9vcihwY3RJbnQgLyAyNSkgKiAyNTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gOTAlXHU4QjY2XHU1NDRBXHU2M0QwXHU3OTNBXHJcbiAgICBpZiAocGN0SW50ID49IDkwICYmIHBjdEludCA8IDEwMCkge1xyXG4gICAgICBpZiAoIXRoaXMuZWxzLnN0YXR1c1RleHQ/LnRleHRDb250ZW50Py5pbmNsdWRlcygnXHU1MzczXHU1QzA2XHU2RUUxXHU4RjdEJykpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoJ1x1MjZBMFx1RkUwRiBcdTc3RkZcdThGNjZcdTUzNzNcdTVDMDZcdTZFRTFcdThGN0RcdUZGMENcdTVFRkFcdThCQUVcdTY1MzZcdTc3RkYnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpZiAodGhpcy5wZW5kaW5nICE9PSAnY29sbGVjdCcgJiYgdGhpcy5lbHMuY29sbGVjdCkge1xyXG4gICAgICB0aGlzLmVscy5jb2xsZWN0LmRpc2FibGVkID0gdGhpcy5wZW5kaW5nID09PSAnY29sbGVjdCcgfHwgdGhpcy5jYXJ0QW10IDw9IDA7XHJcbiAgICAgIFxyXG4gICAgICAvLyBcdTUzRUZcdTY1MzZcdTc3RkZcdTY1RjZcdTZERkJcdTUyQTBcdTgwRkRcdTkxQ0ZcdTcyNzlcdTY1NDhcclxuICAgICAgaWYgKHRoaXMuY2FydEFtdCA+IDAgJiYgIXRoaXMuZWxzLmNvbGxlY3QuZGlzYWJsZWQpIHtcclxuICAgICAgICB0aGlzLmVscy5jb2xsZWN0LmNsYXNzTGlzdC5hZGQoJ2J0bi1lbmVyZ3knKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmVscy5jb2xsZWN0LmNsYXNzTGlzdC5yZW1vdmUoJ2J0bi1lbmVyZ3knKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBcdTY2RjRcdTY1QjBcdTc3RkZcdTc3RjNcdTY1NzBcdTkxQ0ZcclxuICAgIHRoaXMudXBkYXRlU2hhcmRzKHBjdCk7XHJcbiAgICBcclxuICAgIC8vIFx1NjZGNFx1NjVCMFx1NTE2OFx1NjA2Rlx1ODBDQ1x1NjY2Rlx1NzJCNlx1NjAwMVxyXG4gICAgdGhpcy51cGRhdGVIb2xvZ3JhbVN0YXRlKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHRyaWdnZXJNaWxlc3RvbmVQdWxzZShtaWxlc3RvbmU6IG51bWJlcikge1xyXG4gICAgaWYgKHRoaXMuZWxzLnJpbmcpIHtcclxuICAgICAgdGhpcy5lbHMucmluZy5jbGFzc0xpc3QuYWRkKCdtaWxlc3RvbmUtcHVsc2UnKTtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmVscy5yaW5nPy5jbGFzc0xpc3QucmVtb3ZlKCdtaWxlc3RvbmUtcHVsc2UnKSwgMTAwMCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGlmICh0aGlzLmVscy5yaW5nUGN0KSB7XHJcbiAgICAgIHRoaXMuZWxzLnJpbmdQY3QuY2xhc3NMaXN0LmFkZCgnZmxhc2gnKTtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmVscy5yaW5nUGN0Py5jbGFzc0xpc3QucmVtb3ZlKCdmbGFzaCcpLCA5MDApO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBcdTY2M0VcdTc5M0FcdTkxQ0NcdTdBMEJcdTc4OTFcdTZEODhcdTYwNkZcclxuICAgIHNob3dUb2FzdChgXHVEODNDXHVERkFGIFx1OEZCRVx1NjIxMCAke21pbGVzdG9uZX0lIFx1ODhDNVx1OEY3RFx1NzM4N1x1RkYwMWAsICdzdWNjZXNzJyk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHVwZGF0ZUhvbG9ncmFtU3RhdGUoKSB7XHJcbiAgICBpZiAoIXRoaXMuZWxzLmhvbG9ncmFtKSByZXR1cm47XHJcbiAgICBcclxuICAgIC8vIFx1NzlGQlx1OTY2NFx1NjI0MFx1NjcwOVx1NzJCNlx1NjAwMVx1N0M3QlxyXG4gICAgdGhpcy5lbHMuaG9sb2dyYW0uY2xhc3NMaXN0LnJlbW92ZSgnaG9sby1pZGxlJywgJ2hvbG8tbWluaW5nJywgJ2hvbG8tY29sbGFwc2VkJyk7XHJcbiAgICBcclxuICAgIC8vIFx1NjgzOVx1NjM2RVx1NzJCNlx1NjAwMVx1NkRGQlx1NTJBMFx1NUJGOVx1NUU5NFx1NzY4NFx1N0M3QlxyXG4gICAgaWYgKHRoaXMuaXNDb2xsYXBzZWQpIHtcclxuICAgICAgdGhpcy5lbHMuaG9sb2dyYW0uY2xhc3NMaXN0LmFkZCgnaG9sby1jb2xsYXBzZWQnKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5pc01pbmluZykge1xyXG4gICAgICB0aGlzLmVscy5ob2xvZ3JhbS5jbGFzc0xpc3QuYWRkKCdob2xvLW1pbmluZycpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5lbHMuaG9sb2dyYW0uY2xhc3NMaXN0LmFkZCgnaG9sby1pZGxlJyk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIFx1NjZGNFx1NjVCMFx1NzdGRlx1NURFNVx1NTJBOFx1NzUzQlxyXG4gICAgdGhpcy51cGRhdGVNaW5lckFuaW1hdGlvbigpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB1cGRhdGVNaW5lckFuaW1hdGlvbigpIHtcclxuICAgIGlmICghdGhpcy5lbHMubWluZXJDaGFyKSByZXR1cm47XHJcbiAgICBcclxuICAgIHRoaXMuZWxzLm1pbmVyQ2hhci5pbm5lckhUTUwgPSAnJztcclxuICAgIFxyXG4gICAgaWYgKHRoaXMuaXNDb2xsYXBzZWQpIHtcclxuICAgICAgLy8gXHU1NzREXHU1ODRDXHU3MkI2XHU2MDAxXHVGRjFBXHU2NjNFXHU3OTNBXHU4QjY2XHU1NDRBXHU1NkZFXHU2ODA3XHJcbiAgICAgIGNvbnN0IHdhcm5pbmcgPSBodG1sKGBcclxuICAgICAgICA8ZGl2IHN0eWxlPVwidGV4dC1hbGlnbjpjZW50ZXI7b3BhY2l0eTouNjtcIj5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9XCJmb250LXNpemU6NDhweDthbmltYXRpb246d2FybmluZy1wdWxzZSAxcyBlYXNlLWluLW91dCBpbmZpbml0ZTtcIj5cdTI2QTBcdUZFMEY8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9XCJmb250LXNpemU6MTNweDttYXJnaW4tdG9wOjhweDtcIj5cdTc3RkZcdTkwNTNcdTU3NERcdTU4NEM8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgYCk7XHJcbiAgICAgIHRoaXMuZWxzLm1pbmVyQ2hhci5hcHBlbmRDaGlsZCh3YXJuaW5nKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5pc01pbmluZykge1xyXG4gICAgICAvLyBcdTYzMTZcdTc3RkZcdTRFMkRcdUZGMUFcdTY2M0VcdTc5M0FcdTUyQThcdTc1M0JcclxuICAgICAgdGhpcy5lbHMubWluZXJDaGFyLmFwcGVuZENoaWxkKGNyZWF0ZU1pbmVyQW5pbWF0aW9uKCkpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gXHU1Rjg1XHU2NzNBXHVGRjFBXHU2NjNFXHU3OTNBXHU5NzU5XHU2MDAxXHU3N0ZGXHU1REU1XHJcbiAgICAgIHRoaXMuZWxzLm1pbmVyQ2hhci5hcHBlbmRDaGlsZChjcmVhdGVJZGxlTWluZXIoKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHVwZGF0ZVNoYXJkcyhsb2FkUGVyY2VudDogbnVtYmVyKSB7XHJcbiAgICBpZiAoIXRoaXMuZWxzLmhvbG9ncmFtKSByZXR1cm47XHJcbiAgICBcclxuICAgIC8vIFx1OEJBMVx1N0I5N1x1NUU5NFx1OEJFNVx1NjYzRVx1NzkzQVx1NzY4NFx1NzdGRlx1NzdGM1x1NjU3MFx1OTFDRlx1RkYwOFx1ODhDNVx1OEY3RFx1NzM4N1x1OEQ4QVx1OUFEOFx1RkYwQ1x1NzdGRlx1NzdGM1x1OEQ4QVx1NTkxQVx1RkYwOVxyXG4gICAgLy8gMC0yMCU6IDJcdTRFMkEsIDIwLTQwJTogNFx1NEUyQSwgNDAtNjAlOiA2XHU0RTJBLCA2MC04MCU6IDhcdTRFMkEsIDgwLTEwMCU6IDEwXHU0RTJBXHJcbiAgICBjb25zdCB0YXJnZXRDb3VudCA9IE1hdGgubWF4KDIsIE1hdGgubWluKDEyLCBNYXRoLmZsb29yKGxvYWRQZXJjZW50ICogMTIpICsgMikpO1xyXG4gICAgXHJcbiAgICAvLyBcdTgzQjdcdTUzRDZcdTVGNTNcdTUyNERcdTc3RkZcdTc3RjNcdTUxNDNcdTdEMjBcclxuICAgIGNvbnN0IGN1cnJlbnRTaGFyZHMgPSB0aGlzLmVscy5ob2xvZ3JhbS5xdWVyeVNlbGVjdG9yQWxsKCcubWluZS1zaGFyZCcpO1xyXG4gICAgY29uc3QgY3VycmVudENvdW50ID0gY3VycmVudFNoYXJkcy5sZW5ndGg7XHJcbiAgICBcclxuICAgIC8vIFx1NTk4Mlx1Njc5Q1x1NjU3MFx1OTFDRlx1NzZGOFx1NTQwQ1x1RkYwQ1x1NEUwRFx1NTA1QVx1NTkwNFx1NzQwNlxyXG4gICAgaWYgKGN1cnJlbnRDb3VudCA9PT0gdGFyZ2V0Q291bnQpIHJldHVybjtcclxuICAgIFxyXG4gICAgLy8gXHU5NzAwXHU4OTgxXHU2REZCXHU1MkEwXHU3N0ZGXHU3N0YzXHJcbiAgICBpZiAoY3VycmVudENvdW50IDwgdGFyZ2V0Q291bnQpIHtcclxuICAgICAgY29uc3QgdG9BZGQgPSB0YXJnZXRDb3VudCAtIGN1cnJlbnRDb3VudDtcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b0FkZDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3Qgc2hhcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgc2hhcmQuY2xhc3NOYW1lID0gJ21pbmUtc2hhcmQnO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFx1OTY4Rlx1NjczQVx1NEY0RFx1N0Y2RVx1NTQ4Q1x1NTkyN1x1NUMwRlxyXG4gICAgICAgIGNvbnN0IHBvc2l0aW9ucyA9IFtcclxuICAgICAgICAgIHsgdG9wOiAnMTglJywgbGVmdDogJzE2JScsIGRlbGF5OiAtMS40LCBzY2FsZTogMSB9LFxyXG4gICAgICAgICAgeyBib3R0b206ICcxNiUnLCByaWdodDogJzIyJScsIGRlbGF5OiAtMy4yLCBzY2FsZTogMC43NCB9LFxyXG4gICAgICAgICAgeyB0b3A6ICcyNiUnLCByaWdodDogJzM0JScsIGRlbGF5OiAtNS4xLCBzY2FsZTogMC41IH0sXHJcbiAgICAgICAgICB7IHRvcDogJzQwJScsIGxlZnQ6ICcyOCUnLCBkZWxheTogLTIuNSwgc2NhbGU6IDAuODUgfSxcclxuICAgICAgICAgIHsgYm90dG9tOiAnMzAlJywgbGVmdDogJzE4JScsIGRlbGF5OiAtNC4xLCBzY2FsZTogMC42OCB9LFxyXG4gICAgICAgICAgeyB0b3A6ICcxNSUnLCByaWdodDogJzE1JScsIGRlbGF5OiAtMS44LCBzY2FsZTogMC45MiB9LFxyXG4gICAgICAgICAgeyBib3R0b206ICcyMiUnLCByaWdodDogJzQwJScsIGRlbGF5OiAtMy44LCBzY2FsZTogMC43OCB9LFxyXG4gICAgICAgICAgeyB0b3A6ICc1MCUnLCBsZWZ0OiAnMTIlJywgZGVsYXk6IC0yLjIsIHNjYWxlOiAwLjYgfSxcclxuICAgICAgICAgIHsgdG9wOiAnMzUlJywgcmlnaHQ6ICcyMCUnLCBkZWxheTogLTQuNSwgc2NhbGU6IDAuODggfSxcclxuICAgICAgICAgIHsgYm90dG9tOiAnNDAlJywgbGVmdDogJzM1JScsIGRlbGF5OiAtMy41LCBzY2FsZTogMC43IH0sXHJcbiAgICAgICAgICB7IHRvcDogJzYwJScsIHJpZ2h0OiAnMjglJywgZGVsYXk6IC0yLjgsIHNjYWxlOiAwLjY1IH0sXHJcbiAgICAgICAgICB7IGJvdHRvbTogJzUwJScsIHJpZ2h0OiAnMTIlJywgZGVsYXk6IC00LjgsIHNjYWxlOiAwLjgyIH0sXHJcbiAgICAgICAgXTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBwb3NJbmRleCA9IChjdXJyZW50Q291bnQgKyBpKSAlIHBvc2l0aW9ucy5sZW5ndGg7XHJcbiAgICAgICAgY29uc3QgcG9zID0gcG9zaXRpb25zW3Bvc0luZGV4XTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAocG9zLnRvcCkgc2hhcmQuc3R5bGUudG9wID0gcG9zLnRvcDtcclxuICAgICAgICBpZiAocG9zLmJvdHRvbSkgc2hhcmQuc3R5bGUuYm90dG9tID0gcG9zLmJvdHRvbTtcclxuICAgICAgICBpZiAocG9zLmxlZnQpIHNoYXJkLnN0eWxlLmxlZnQgPSBwb3MubGVmdDtcclxuICAgICAgICBpZiAocG9zLnJpZ2h0KSBzaGFyZC5zdHlsZS5yaWdodCA9IHBvcy5yaWdodDtcclxuICAgICAgICBzaGFyZC5zdHlsZS5hbmltYXRpb25EZWxheSA9IGAke3Bvcy5kZWxheX1zYDtcclxuICAgICAgICBzaGFyZC5zdHlsZS50cmFuc2Zvcm0gPSBgc2NhbGUoJHtwb3Muc2NhbGV9KWA7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gXHU2REZCXHU1MkEwXHU2REUxXHU1MTY1XHU1MkE4XHU3NTNCXHJcbiAgICAgICAgc2hhcmQuc3R5bGUub3BhY2l0eSA9ICcwJztcclxuICAgICAgICB0aGlzLmVscy5ob2xvZ3JhbS5hcHBlbmRDaGlsZChzaGFyZCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gXHU4OUU2XHU1M0QxXHU2REUxXHU1MTY1XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICBzaGFyZC5zdHlsZS50cmFuc2l0aW9uID0gJ29wYWNpdHkgMC41cyBlYXNlJztcclxuICAgICAgICAgIHNoYXJkLnN0eWxlLm9wYWNpdHkgPSAnMC4yNic7XHJcbiAgICAgICAgfSwgNTApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBcdTk3MDBcdTg5ODFcdTc5RkJcdTk2NjRcdTc3RkZcdTc3RjNcclxuICAgIGVsc2UgaWYgKGN1cnJlbnRDb3VudCA+IHRhcmdldENvdW50KSB7XHJcbiAgICAgIGNvbnN0IHRvUmVtb3ZlID0gY3VycmVudENvdW50IC0gdGFyZ2V0Q291bnQ7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG9SZW1vdmU7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IGxhc3RTaGFyZCA9IGN1cnJlbnRTaGFyZHNbY3VycmVudFNoYXJkcy5sZW5ndGggLSAxIC0gaV07XHJcbiAgICAgICAgaWYgKGxhc3RTaGFyZCkge1xyXG4gICAgICAgICAgKGxhc3RTaGFyZCBhcyBIVE1MRWxlbWVudCkuc3R5bGUudHJhbnNpdGlvbiA9ICdvcGFjaXR5IDAuNXMgZWFzZSc7XHJcbiAgICAgICAgICAobGFzdFNoYXJkIGFzIEhUTUxFbGVtZW50KS5zdHlsZS5vcGFjaXR5ID0gJzAnO1xyXG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGxhc3RTaGFyZC5yZW1vdmUoKTtcclxuICAgICAgICAgIH0sIDUwMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHVwZGF0ZUNvbnRyb2xzKCkge1xyXG4gICAgY29uc3QgaXNCdXN5ID0gKGtleTogUGVuZGluZ0FjdGlvbikgPT4gdGhpcy5wZW5kaW5nID09PSBrZXk7XHJcbiAgICBjb25zdCBzZXRCdG4gPSAoYnRuOiBIVE1MQnV0dG9uRWxlbWVudCB8IG51bGwsIGljb246IGFueSwgbGFiZWw6IHN0cmluZywgZGlzYWJsZWQ6IGJvb2xlYW4pID0+IHtcclxuICAgICAgaWYgKCFidG4pIHJldHVybjtcclxuICAgICAgYnRuLmRpc2FibGVkID0gZGlzYWJsZWQ7XHJcbiAgICAgIC8vIGtlZXAgZmlyc3QgY2hpbGQgYXMgaWNvbiBpZiBwcmVzZW50LCBvdGhlcndpc2UgY3JlYXRlXHJcbiAgICAgIGxldCBpY29uSG9zdCA9IGJ0bi5xdWVyeVNlbGVjdG9yKCcuaWNvbicpO1xyXG4gICAgICBpZiAoIWljb25Ib3N0KSB7XHJcbiAgICAgICAgYnRuLmluc2VydEJlZm9yZShyZW5kZXJJY29uKGljb24sIHsgc2l6ZTogMTggfSksIGJ0bi5maXJzdENoaWxkKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBSZXBsYWNlIGV4aXN0aW5nIGljb24gd2l0aCBuZXcgb25lIGlmIGljb24gbmFtZSBkaWZmZXJzIGJ5IHJlLXJlbmRlcmluZ1xyXG4gICAgICAgIGNvbnN0IGhvc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgaG9zdC5hcHBlbmRDaGlsZChyZW5kZXJJY29uKGljb24sIHsgc2l6ZTogMTggfSkpO1xyXG4gICAgICAgIC8vIHJlbW92ZSBvbGQgaWNvbiB3cmFwcGVyIGFuZCB1c2UgbmV3XHJcbiAgICAgICAgaWNvbkhvc3QucGFyZW50RWxlbWVudD8ucmVwbGFjZUNoaWxkKGhvc3QuZmlyc3RDaGlsZCBhcyBOb2RlLCBpY29uSG9zdCk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gc2V0IGxhYmVsIHRleHQgKHByZXNlcnZlIGljb24pXHJcbiAgICAgIC8vIHJlbW92ZSBleGlzdGluZyB0ZXh0IG5vZGVzXHJcbiAgICAgIEFycmF5LmZyb20oYnRuLmNoaWxkTm9kZXMpLmZvckVhY2goKG4sIGlkeCkgPT4ge1xyXG4gICAgICAgIGlmIChpZHggPiAwKSBidG4ucmVtb3ZlQ2hpbGQobik7XHJcbiAgICAgIH0pO1xyXG4gICAgICBidG4uYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobGFiZWwpKTtcclxuICAgIH07XHJcblxyXG4gICAgc2V0QnRuKHRoaXMuZWxzLnN0YXJ0LCAncGxheScsIGlzQnVzeSgnc3RhcnQnKSA/ICdcdTU0MkZcdTUyQThcdTRFMkRcdTIwMjYnIDogdGhpcy5pc01pbmluZyA/ICdcdTYzMTZcdTc3RkZcdTRFMkQnIDogJ1x1NUYwMFx1NTlDQlx1NjMxNlx1NzdGRicsIGlzQnVzeSgnc3RhcnQnKSB8fCB0aGlzLmlzTWluaW5nIHx8IHRoaXMuaXNDb2xsYXBzZWQpO1xyXG4gICAgc2V0QnRuKHRoaXMuZWxzLnN0b3AsICdzdG9wJywgaXNCdXN5KCdzdG9wJykgPyAnXHU1MDVDXHU2QjYyXHU0RTJEXHUyMDI2JyA6ICdcdTUwNUNcdTZCNjInLCBpc0J1c3koJ3N0b3AnKSB8fCAhdGhpcy5pc01pbmluZyk7XHJcbiAgICBzZXRCdG4odGhpcy5lbHMuY29sbGVjdCwgJ2NvbGxlY3QnLCBpc0J1c3koJ2NvbGxlY3QnKSA/ICdcdTY1MzZcdTk2QzZcdTRFMkRcdTIwMjYnIDogJ1x1NjUzNlx1NzdGRicsIGlzQnVzeSgnY29sbGVjdCcpIHx8IHRoaXMuY2FydEFtdCA8PSAwKTtcclxuICAgIHNldEJ0bih0aGlzLmVscy5yZXBhaXIsICd3cmVuY2gnLCBpc0J1c3koJ3JlcGFpcicpID8gJ1x1NEZFRVx1NzQwNlx1NEUyRFx1MjAyNicgOiAnXHU0RkVFXHU3NDA2JywgaXNCdXN5KCdyZXBhaXInKSB8fCAhdGhpcy5pc0NvbGxhcHNlZCk7XHJcbiAgICBzZXRCdG4odGhpcy5lbHMuc3RhdHVzQnRuLCAncmVmcmVzaCcsIGlzQnVzeSgnc3RhdHVzJykgPyAnXHU1MjM3XHU2NUIwXHU0RTJEXHUyMDI2JyA6ICdcdTUyMzdcdTY1QjBcdTcyQjZcdTYwMDEnLCBpc0J1c3koJ3N0YXR1cycpKTtcclxuICAgIFxyXG4gICAgLy8gXHU2NTM2XHU3N0ZGXHU2MzA5XHU5NEFFXHU2REZCXHU1MkEwXHU1QjlEXHU3QkIxXHU1MkE4XHU3NTNCXHJcbiAgICBpZiAodGhpcy5lbHMuY29sbGVjdCAmJiB0aGlzLmNhcnRBbXQgPiAwICYmICF0aGlzLmVscy5jb2xsZWN0LmRpc2FibGVkKSB7XHJcbiAgICAgIGNvbnN0IGhhc0NoZXN0ID0gdGhpcy5lbHMuY29sbGVjdC5xdWVyeVNlbGVjdG9yKCcudHJlYXN1cmUtY2hlc3QnKTtcclxuICAgICAgaWYgKCFoYXNDaGVzdCkge1xyXG4gICAgICAgIGNvbnN0IGNoZXN0ID0gY3JlYXRlVHJlYXN1cmVDaGVzdCgpO1xyXG4gICAgICAgIGNvbnN0IGljb25TbG90ID0gdGhpcy5lbHMuY29sbGVjdC5xdWVyeVNlbGVjdG9yKCcuaWNvbicpO1xyXG4gICAgICAgIGlmIChpY29uU2xvdCkge1xyXG4gICAgICAgICAgaWNvblNsb3QuaW5uZXJIVE1MID0gJyc7XHJcbiAgICAgICAgICBpY29uU2xvdC5hcHBlbmRDaGlsZChjaGVzdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNldFN0YXR1c01lc3NhZ2UodGV4dDogc3RyaW5nKSB7XHJcbiAgICBpZiAoIXRoaXMuZWxzLnN0YXR1c1RleHQpIHJldHVybjtcclxuICAgIHRoaXMuZWxzLnN0YXR1c1RleHQudGV4dENvbnRlbnQgPSB0ZXh0O1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBsb2dFdmVudChtc2c6IHN0cmluZykge1xyXG4gICAgaWYgKCF0aGlzLmVscz8uZXZlbnRzKSByZXR1cm47XHJcbiAgICBjb25zdCBsaW5lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xyXG4gICAgY29uc3QgaGggPSBTdHJpbmcobm93LmdldEhvdXJzKCkpLnBhZFN0YXJ0KDIsJzAnKTtcclxuICAgIGNvbnN0IG1tID0gU3RyaW5nKG5vdy5nZXRNaW51dGVzKCkpLnBhZFN0YXJ0KDIsJzAnKTtcclxuICAgIGNvbnN0IHNzID0gU3RyaW5nKG5vdy5nZXRTZWNvbmRzKCkpLnBhZFN0YXJ0KDIsJzAnKTtcclxuICAgIFxyXG4gICAgLy8gXHU2ODM5XHU2MzZFXHU2RDg4XHU2MDZGXHU3QzdCXHU1NzhCXHU2REZCXHU1MkEwXHU0RTBEXHU1NDBDXHU3Njg0XHU2ODM3XHU1RjBGXHU3QzdCXHJcbiAgICBsZXQgZXZlbnRDbGFzcyA9ICdldmVudCc7XHJcbiAgICBpZiAobXNnLmluY2x1ZGVzKCdcdTY2QjRcdTUxRkInKSkge1xyXG4gICAgICBldmVudENsYXNzICs9ICcgZXZlbnQtY3JpdGljYWwnO1xyXG4gICAgfSBlbHNlIGlmIChtc2cuaW5jbHVkZXMoJ1x1NTc0RFx1NTg0QycpIHx8IG1zZy5pbmNsdWRlcygnXHU2M0EwXHU1OTNBJykpIHtcclxuICAgICAgZXZlbnRDbGFzcyArPSAnIGV2ZW50LXdhcm5pbmcnO1xyXG4gICAgfSBlbHNlIGlmIChtc2cuaW5jbHVkZXMoJ1x1NjUzNlx1OTZDNicpIHx8IG1zZy5pbmNsdWRlcygnXHU2MjEwXHU1MjlGJykpIHtcclxuICAgICAgZXZlbnRDbGFzcyArPSAnIGV2ZW50LXN1Y2Nlc3MnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZXZlbnRDbGFzcyArPSAnIGV2ZW50LW5vcm1hbCc7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGxpbmUuY2xhc3NOYW1lID0gZXZlbnRDbGFzcztcclxuICAgIGxpbmUudGV4dENvbnRlbnQgPSBgWyR7aGh9OiR7bW19OiR7c3N9XSAke21zZ31gO1xyXG4gICAgXHJcbiAgICAvLyBcdTZERkJcdTUyQTBcdTZFRDFcdTUxNjVcdTUyQThcdTc1M0JcclxuICAgIGxpbmUuc3R5bGUub3BhY2l0eSA9ICcwJztcclxuICAgIGxpbmUuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVgoMjBweCknO1xyXG4gICAgdGhpcy5lbHMuZXZlbnRzLnByZXBlbmQobGluZSk7XHJcbiAgICBcclxuICAgIC8vIFx1ODlFNlx1NTNEMVx1NTJBOFx1NzUzQlxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIGxpbmUuc3R5bGUudHJhbnNpdGlvbiA9ICdvcGFjaXR5IDAuM3MgZWFzZSwgdHJhbnNmb3JtIDAuM3MgZWFzZSc7XHJcbiAgICAgIGxpbmUuc3R5bGUub3BhY2l0eSA9ICcwLjknO1xyXG4gICAgICBsaW5lLnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGVYKDApJztcclxuICAgIH0sIDEwKTtcclxuICAgIFxyXG4gICAgLy8gXHU2NkI0XHU1MUZCXHU0RThCXHU0RUY2XHU2REZCXHU1MkEwXHU5NUVBXHU1MTQ5XHU2NTQ4XHU2NzlDXHJcbiAgICBpZiAobXNnLmluY2x1ZGVzKCdcdTY2QjRcdTUxRkInKSkge1xyXG4gICAgICBsaW5lLmNsYXNzTGlzdC5hZGQoJ2ZsYXNoJyk7XHJcbiAgICAgIC8vIFx1ODlFNlx1NTNEMVx1NTE2OFx1NUM0MFx1NjZCNFx1NTFGQlx1NzI3OVx1NjU0OFxyXG4gICAgICB0aGlzLnRyaWdnZXJDcml0aWNhbEVmZmVjdCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB0cmlnZ2VyQ3JpdGljYWxFZmZlY3QoKSB7XHJcbiAgICAvLyBcdTU3MDZcdTczQUZcdTk1RUFcdTc1MzVcdTY1NDhcdTY3OUNcclxuICAgIGlmICh0aGlzLmVscy5yaW5nKSB7XHJcbiAgICAgIHRoaXMuZWxzLnJpbmcuY2xhc3NMaXN0LmFkZCgncmluZy1wdWxzZScpO1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuZWxzLnJpbmc/LmNsYXNzTGlzdC5yZW1vdmUoJ3JpbmctcHVsc2UnKSwgNjAwKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gXHU1MTY4XHU2MDZGXHU4MENDXHU2NjZGXHU5NUVBXHU3MEMxXHJcbiAgICBpZiAodGhpcy5lbHMuaG9sb2dyYW0pIHtcclxuICAgICAgdGhpcy5lbHMuaG9sb2dyYW0uY2xhc3NMaXN0LmFkZCgnY3JpdGljYWwtZmxhc2gnKTtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmVscy5ob2xvZ3JhbT8uY2xhc3NMaXN0LnJlbW92ZSgnY3JpdGljYWwtZmxhc2gnKSwgNDAwKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gXHU3N0ZGXHU1REU1XHU2NkI0XHU1MUZCXHU1MkE4XHU0RjVDXHVGRjA4XHU1MkEwXHU5MDFGXHU2MzI1XHU1MkE4XHVGRjA5XHJcbiAgICBpZiAodGhpcy5lbHMubWluZXJDaGFyKSB7XHJcbiAgICAgIHRoaXMuZWxzLm1pbmVyQ2hhci5jbGFzc0xpc3QuYWRkKCdjcml0aWNhbC1taW5pbmcnKTtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmVscy5taW5lckNoYXI/LmNsYXNzTGlzdC5yZW1vdmUoJ2NyaXRpY2FsLW1pbmluZycpLCAxMjAwKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gXHU5NUVBXHU3NTM1XHU3Mjc5XHU2NTQ4XHJcbiAgICBpZiAodGhpcy5lbHMuaG9sb2dyYW0pIHtcclxuICAgICAgY29uc3QgbGlnaHRuaW5nID0gY3JlYXRlTGlnaHRuaW5nQm9sdCgpO1xyXG4gICAgICB0aGlzLmVscy5ob2xvZ3JhbS5hcHBlbmRDaGlsZChsaWdodG5pbmcpO1xyXG4gICAgICBcclxuICAgICAgLy8gXHU4OUU2XHU1M0QxXHU5NUVBXHU3NTM1XHU1MkE4XHU3NTNCXHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGdyb3VwID0gbGlnaHRuaW5nLnF1ZXJ5U2VsZWN0b3IoJy5saWdodG5pbmctZ3JvdXAnKTtcclxuICAgICAgICBpZiAoZ3JvdXApIHtcclxuICAgICAgICAgIChncm91cCBhcyBTVkdHRWxlbWVudCkuc3R5bGUub3BhY2l0eSA9ICcxJztcclxuICAgICAgICB9XHJcbiAgICAgIH0sIDUwKTtcclxuICAgICAgXHJcbiAgICAgIC8vIFx1NzlGQlx1OTY2NFx1OTVFQVx1NzUzNVxyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBsaWdodG5pbmcucmVtb3ZlKCk7XHJcbiAgICAgIH0sIDYwMCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGZvcm1hdFBlcmNlbnQoKSB7XHJcbiAgICBjb25zdCBwY3QgPSB0aGlzLmNhcnRDYXAgPiAwID8gTWF0aC5taW4oMSwgdGhpcy5jYXJ0QW10IC8gdGhpcy5jYXJ0Q2FwKSA6IDA7XHJcbiAgICByZXR1cm4gYCR7TWF0aC5yb3VuZChwY3QgKiAxMDApfSVgO1xyXG4gIH1cclxufSIsICJpbXBvcnQgeyBOZXR3b3JrTWFuYWdlciB9IGZyb20gJy4uL2NvcmUvTmV0d29ya01hbmFnZXInO1xuaW1wb3J0IHsgaHRtbCwgcXMgfSBmcm9tICcuLi91dGlscy9kb20nO1xuaW1wb3J0IHsgcmVuZGVyTmF2IH0gZnJvbSAnLi4vY29tcG9uZW50cy9OYXYnO1xuaW1wb3J0IHsgUmVhbHRpbWVDbGllbnQgfSBmcm9tICcuLi9jb3JlL1JlYWx0aW1lQ2xpZW50JztcbmltcG9ydCB7IHJlbmRlclJlc291cmNlQmFyIH0gZnJvbSAnLi4vY29tcG9uZW50cy9SZXNvdXJjZUJhcic7XG5pbXBvcnQgeyBzaG93VG9hc3QgfSBmcm9tICcuLi9jb21wb25lbnRzL1RvYXN0JztcbmltcG9ydCB7IHJlbmRlckljb24gfSBmcm9tICcuLi9jb21wb25lbnRzL0ljb24nO1xuXG5leHBvcnQgY2xhc3MgV2FyZWhvdXNlU2NlbmUge1xuICBhc3luYyBtb3VudChyb290OiBIVE1MRWxlbWVudCkge1xuICAgIHJvb3QuaW5uZXJIVE1MID0gJyc7XG4gICAgcm9vdC5hcHBlbmRDaGlsZChyZW5kZXJOYXYoJ3dhcmVob3VzZScpKTtcbiAgICBjb25zdCBiYXIgPSByZW5kZXJSZXNvdXJjZUJhcigpO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQoYmFyLnJvb3QpO1xuXG4gICAgY29uc3QgdmlldyA9IGh0bWwoYFxuICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lciBncmlkLTJcIiBzdHlsZT1cImNvbG9yOiNmZmY7XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkIGZhZGUtaW5cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCIgc3R5bGU9XCJqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjthbGlnbi1pdGVtczpjZW50ZXI7XCI+XG4gICAgICAgICAgICA8aDMgc3R5bGU9XCJtYXJnaW46MDtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo4cHg7XCI+PHNwYW4gZGF0YS1pY289XCJ3YXJlaG91c2VcIj48L3NwYW4+XHU0RUQzXHU1RTkzPC9oMz5cbiAgICAgICAgICAgIDxidXR0b24gaWQ9XCJyZWZyZXNoXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIj48c3BhbiBkYXRhLWljbz1cInJlZnJlc2hcIj48L3NwYW4+XHU1MjM3XHU2NUIwPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBzdHlsZT1cIm1hcmdpbi10b3A6MTJweDtcIj5cbiAgICAgICAgICAgIDxkZXRhaWxzIG9wZW4+XG4gICAgICAgICAgICAgIDxzdW1tYXJ5PjxzcGFuIGRhdGEtaWNvPVwib3JlXCI+PC9zcGFuPlx1Nzg4RVx1NzI0N1x1NEVEM1x1NUU5Mzwvc3VtbWFyeT5cbiAgICAgICAgICAgICAgPGRpdiBpZD1cImZyYWdtZW50c1wiIHN0eWxlPVwibWFyZ2luLXRvcDo4cHg7ZGlzcGxheTpncmlkO2dyaWQtdGVtcGxhdGUtY29sdW1uczpyZXBlYXQoYXV0by1maXQsbWlubWF4KDE0MHB4LDFmcikpO2dhcDo4cHg7XCI+PC9kaXY+XG4gICAgICAgICAgICA8L2RldGFpbHM+XG4gICAgICAgICAgICA8ZGV0YWlscyBvcGVuPlxuICAgICAgICAgICAgICA8c3VtbWFyeT48c3BhbiBkYXRhLWljbz1cImJveFwiPjwvc3Bhbj5cdTYyMTFcdTc2ODRcdTkwNTNcdTUxNzc8L3N1bW1hcnk+XG4gICAgICAgICAgICAgIDxkaXYgaWQ9XCJsaXN0XCIgc3R5bGU9XCJtYXJnaW4tdG9wOjhweDtkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDo4cHg7XCI+PC9kaXY+XG4gICAgICAgICAgICA8L2RldGFpbHM+XG4gICAgICAgICAgICA8ZGV0YWlscz5cbiAgICAgICAgICAgICAgPHN1bW1hcnk+PHNwYW4gZGF0YS1pY289XCJsaXN0XCI+PC9zcGFuPlx1OTA1M1x1NTE3N1x1NkEyMVx1Njc3Rjwvc3VtbWFyeT5cbiAgICAgICAgICAgICAgPGRpdiBpZD1cInRwbHNcIiBzdHlsZT1cIm1hcmdpbi10b3A6OHB4O2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjhweDtcIj48L2Rpdj5cbiAgICAgICAgICAgIDwvZGV0YWlscz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICBgKTtcbiAgICByb290LmFwcGVuZENoaWxkKHZpZXcpO1xuXG4gICAgY29uc3QgdG9rZW4gPSBOZXR3b3JrTWFuYWdlci5JLmdldFRva2VuKCk7XG4gICAgaWYgKHRva2VuKSBSZWFsdGltZUNsaWVudC5JLmNvbm5lY3QodG9rZW4pO1xuXG4gICAgY29uc3QgbGlzdCA9IHFzKHZpZXcsICcjbGlzdCcpO1xuICAgIGNvbnN0IHRwbENvbnRhaW5lciA9IHFzKHZpZXcsICcjdHBscycpO1xuICAgIGNvbnN0IGZyYWdtZW50c0NvbnRhaW5lciA9IHFzKHZpZXcsICcjZnJhZ21lbnRzJyk7XG4gICAgY29uc3QgcmVmcmVzaEJ0biA9IHFzPEhUTUxCdXR0b25FbGVtZW50Pih2aWV3LCAnI3JlZnJlc2gnKTtcblxuICAgIGNvbnN0IG1vdW50SWNvbnMgPSAocm9vdEVsOiBFbGVtZW50KSA9PiB7XG4gICAgICByb290RWwucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtaWNvXScpXG4gICAgICAgIC5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICAgIGNvbnN0IG5hbWUgPSAoZWwgYXMgSFRNTEVsZW1lbnQpLmdldEF0dHJpYnV0ZSgnZGF0YS1pY28nKSBhcyBhbnk7XG4gICAgICAgICAgdHJ5IHsgZWwuYXBwZW5kQ2hpbGQocmVuZGVySWNvbihuYW1lLCB7IHNpemU6IDIwIH0pKTsgfSBjYXRjaCB7fVxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIG1vdW50SWNvbnModmlldyk7XG5cbiAgICBjb25zdCBnZXRSYXJpdHkgPSAoaXRlbTogYW55LCB0cGw/OiBhbnkpOiB7IGtleTogJ2NvbW1vbid8J3JhcmUnfCdlcGljJ3wnbGVnZW5kYXJ5JzsgdGV4dDogc3RyaW5nIH0gPT4ge1xuICAgICAgY29uc3QgciA9ICh0cGwgJiYgKHRwbC5yYXJpdHkgfHwgdHBsLnRpZXIpKSB8fCBpdGVtLnJhcml0eTtcbiAgICAgIGNvbnN0IGxldmVsID0gTnVtYmVyKGl0ZW0ubGV2ZWwpIHx8IDA7XG4gICAgICBpZiAodHlwZW9mIHIgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGNvbnN0IGsgPSByLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGlmIChbJ2xlZ2VuZGFyeScsJ2VwaWMnLCdyYXJlJywnY29tbW9uJ10uaW5jbHVkZXMoaykpIHtcbiAgICAgICAgICByZXR1cm4geyBrZXk6IGsgYXMgYW55LCB0ZXh0OiBrID09PSAnbGVnZW5kYXJ5JyA/ICdcdTRGMjBcdThCRjQnIDogayA9PT0gJ2VwaWMnID8gJ1x1NTNGMlx1OEJENycgOiBrID09PSAncmFyZScgPyAnXHU3QTAwXHU2NzA5JyA6ICdcdTY2NkVcdTkwMUEnIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChsZXZlbCA+PSAxMikgcmV0dXJuIHsga2V5OiAnbGVnZW5kYXJ5JywgdGV4dDogJ1x1NEYyMFx1OEJGNCcgfTtcbiAgICAgIGlmIChsZXZlbCA+PSA4KSByZXR1cm4geyBrZXk6ICdlcGljJywgdGV4dDogJ1x1NTNGMlx1OEJENycgfTtcbiAgICAgIGlmIChsZXZlbCA+PSA0KSByZXR1cm4geyBrZXk6ICdyYXJlJywgdGV4dDogJ1x1N0EwMFx1NjcwOScgfTtcbiAgICAgIHJldHVybiB7IGtleTogJ2NvbW1vbicsIHRleHQ6ICdcdTY2NkVcdTkwMUEnIH07XG4gICAgfTtcblxuICAgIGNvbnN0IGZvcm1hdFRpbWUgPSAodHM6IG51bWJlcikgPT4ge1xuICAgICAgdHJ5IHsgcmV0dXJuIG5ldyBEYXRlKHRzKS50b0xvY2FsZVN0cmluZygpOyB9IGNhdGNoIHsgcmV0dXJuICcnICsgdHM7IH1cbiAgICB9O1xuXG4gICAgY29uc3QgbG9hZCA9IGFzeW5jICgpID0+IHtcbiAgICAgIHJlZnJlc2hCdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgcmVmcmVzaEJ0bi5pbm5lckhUTUwgPSAnPHNwYW4gZGF0YS1pY289XCJyZWZyZXNoXCI+PC9zcGFuPlx1NTIzN1x1NjVCMFx1NEUyRFx1MjAyNic7XG4gICAgICBtb3VudEljb25zKHJlZnJlc2hCdG4pO1xuICAgICAgYXdhaXQgYmFyLnVwZGF0ZSgpO1xuICAgICAgbGlzdC5pbm5lckhUTUwgPSAnJztcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSBsaXN0LmFwcGVuZENoaWxkKGh0bWwoJzxkaXYgY2xhc3M9XCJza2VsZXRvblwiPjwvZGl2PicpKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IFtkYXRhLCB0cGxzLCBmcmFnbWVudHNEYXRhXSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgICBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyBpdGVtczogYW55W10gfT4oJy9pdGVtcycpLFxuICAgICAgICAgIE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IHRlbXBsYXRlczogYW55W10gfT4oJy9pdGVtcy90ZW1wbGF0ZXMnKS5jYXRjaCgoKSA9PiAoeyB0ZW1wbGF0ZXM6IFtdIH0pKSxcbiAgICAgICAgICBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyBmcmFnbWVudHM6IFJlY29yZDxzdHJpbmcsIG51bWJlcj4gfT4oJy9pdGVtcy9mcmFnbWVudHMnKS5jYXRjaCgoKSA9PiAoeyBmcmFnbWVudHM6IHt9IH0pKVxuICAgICAgICBdKTtcbiAgICAgICAgY29uc3QgdHBsQnlJZDogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICAgICAgICBmb3IgKGNvbnN0IHQgb2YgKHRwbHMudGVtcGxhdGVzIHx8IFtdKSkgdHBsQnlJZFt0LmlkXSA9IHQ7XG4gICAgICAgIFxuICAgICAgICAvLyBcdTZFMzJcdTY3RDNcdTc4OEVcdTcyNDdcbiAgICAgICAgY29uc3QgZnJhZ21lbnRzID0gZnJhZ21lbnRzRGF0YS5mcmFnbWVudHMgfHwge307XG4gICAgICAgIGZyYWdtZW50c0NvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgY29uc3QgZnJhZ21lbnROYW1lczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgICAgICAgICBtaW5lcjogJ1x1NzdGRlx1NjczQVx1Nzg4RVx1NzI0NycsXG4gICAgICAgICAgY2FydDogJ1x1NzdGRlx1OEY2Nlx1Nzg4RVx1NzI0NycsXG4gICAgICAgICAgcmFpZGVyOiAnXHU2M0EwXHU1OTNBXHU1NjY4XHU3ODhFXHU3MjQ3JyxcbiAgICAgICAgICBzaGllbGQ6ICdcdTk2MzJcdTVGQTFcdTc2RkVcdTc4OEVcdTcyNDcnLFxuICAgICAgICB9O1xuICAgICAgICBmb3IgKGNvbnN0IFt0eXBlLCBjb3VudF0gb2YgT2JqZWN0LmVudHJpZXMoZnJhZ21lbnRzKSkge1xuICAgICAgICAgIGNvbnN0IGNhbkNyYWZ0ID0gY291bnQgPj0gNTA7XG4gICAgICAgICAgY29uc3QgY2FyZCA9IGh0bWwoYFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZyYWdtZW50LWNhcmQgJHtjYW5DcmFmdCA/ICdjYW4tY3JhZnQnIDogJyd9XCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmcmFnbWVudC1pY29uXCIgZGF0YS1pY289XCJvcmVcIj48L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZyYWdtZW50LWluZm9cIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZnJhZ21lbnQtbmFtZVwiPiR7ZnJhZ21lbnROYW1lc1t0eXBlXSB8fCB0eXBlfTwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmcmFnbWVudC1jb3VudFwiPiR7Y291bnR9IC8gNTA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLXByaW1hcnkgYnRuLXNtXCIgZGF0YS1jcmFmdD1cIiR7dHlwZX1cIiAke2NhbkNyYWZ0ID8gJycgOiAnZGlzYWJsZWQnfT48c3BhbiBkYXRhLWljbz1cIndyZW5jaFwiPjwvc3Bhbj5cdTU0MDhcdTYyMTA8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIGApO1xuICAgICAgICAgIG1vdW50SWNvbnMoY2FyZCk7XG4gICAgICAgICAgXG4gICAgICAgICAgLy8gXHU1NDA4XHU2MjEwXHU2MzA5XHU5NEFFXHU3MEI5XHU1MUZCXHU0RThCXHU0RUY2XG4gICAgICAgICAgY29uc3QgY3JhZnRCdG4gPSBjYXJkLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWNyYWZ0XScpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xuICAgICAgICAgIGNyYWZ0QnRuPy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGlmIChjcmFmdEJ0bi5kaXNhYmxlZCkgcmV0dXJuO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjcmFmdEJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgICBjb25zdCBvcmlnaW5hbEhUTUwgPSBjcmFmdEJ0bi5pbm5lckhUTUw7XG4gICAgICAgICAgICBjcmFmdEJ0bi5pbm5lckhUTUwgPSAnPHNwYW4gZGF0YS1pY289XCJ3cmVuY2hcIj48L3NwYW4+XHU1NDA4XHU2MjEwXHU0RTJEXHUyMDI2JztcbiAgICAgICAgICAgIG1vdW50SWNvbnMoY3JhZnRCdG4pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyBpdGVtOiBhbnkgfT4oJy9pdGVtcy9jcmFmdCcsIHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGZyYWdtZW50VHlwZTogdHlwZSB9KSxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHNob3dUb2FzdChgXHU1NDA4XHU2MjEwXHU2MjEwXHU1MjlGXHVGRjAxXHU4M0I3XHU1Rjk3ICR7ZnJhZ21lbnROYW1lc1t0eXBlXX1gLCAnc3VjY2VzcycpO1xuICAgICAgICAgICAgICBjYXJkLmNsYXNzTGlzdC5hZGQoJ3VwZ3JhZGUtc3VjY2VzcycpO1xuICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGNhcmQuY2xhc3NMaXN0LnJlbW92ZSgndXBncmFkZS1zdWNjZXNzJyksIDEwMDApO1xuICAgICAgICAgICAgICBhd2FpdCBsb2FkKCk7XG4gICAgICAgICAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgICAgICAgICAgc2hvd1RvYXN0KGU/Lm1lc3NhZ2UgfHwgJ1x1NTQwOFx1NjIxMFx1NTkzMVx1OEQyNScsICdlcnJvcicpO1xuICAgICAgICAgICAgICBjcmFmdEJ0bi5pbm5lckhUTUwgPSBvcmlnaW5hbEhUTUw7XG4gICAgICAgICAgICAgIG1vdW50SWNvbnMoY3JhZnRCdG4pO1xuICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgY3JhZnRCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBcbiAgICAgICAgICBmcmFnbWVudHNDb250YWluZXIuYXBwZW5kQ2hpbGQoY2FyZCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGxpc3QuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIGlmICghZGF0YS5pdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgICBsaXN0LmFwcGVuZENoaWxkKGh0bWwoJzxkaXYgc3R5bGU9XCJvcGFjaXR5Oi44O1wiPlx1NjY4Mlx1NjVFMFx1OTA1M1x1NTE3N1x1RkYwQ1x1NUMxRFx1OEJENVx1NTkxQVx1NjMxNlx1NzdGRlx1NjIxNlx1NjNBMFx1NTkzQVx1NEVFNVx1ODNCN1x1NTNENlx1NjZGNFx1NTkxQVx1OEQ0NFx1NkU5MDwvZGl2PicpKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgZGF0YS5pdGVtcykge1xuICAgICAgICAgIGNvbnN0IHRwbCA9IHRwbEJ5SWRbaXRlbS50ZW1wbGF0ZUlkXTtcbiAgICAgICAgICBjb25zdCByYXJpdHkgPSBnZXRSYXJpdHkoaXRlbSwgdHBsKTtcbiAgICAgICAgICBjb25zdCBuYW1lID0gKHRwbCAmJiAodHBsLm5hbWUgfHwgdHBsLmlkKSkgfHwgaXRlbS50ZW1wbGF0ZUlkO1xuXG4gICAgICAgICAgLy8gXHU4QkExXHU3Qjk3XHU1MzQ3XHU3RUE3XHU2MjEwXHU1MjlGXHU3Mzg3XG4gICAgICAgICAgY29uc3Qgc3VjY2Vzc1JhdGUgPSBNYXRoLm1heCgwLjQsIDAuOCAtIChpdGVtLmxldmVsIC0gMSkgKiAwLjAyKTtcbiAgICAgICAgICBjb25zdCBzdWNjZXNzUGN0ID0gTWF0aC5yb3VuZChzdWNjZXNzUmF0ZSAqIDEwMCk7XG4gICAgICAgICAgXG4gICAgICAgICAgY29uc3Qgcm93ID0gaHRtbChgXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaXRlbS1jYXJkIGhvdmVyLWxpZnQgJHtcbiAgICAgICAgICAgICAgcmFyaXR5LmtleSA9PT0gJ2xlZ2VuZGFyeScgPyAncmFyaXR5LW91dGxpbmUtbGVnZW5kYXJ5JyA6IHJhcml0eS5rZXkgPT09ICdlcGljJyA/ICdyYXJpdHktb3V0bGluZS1lcGljJyA6IHJhcml0eS5rZXkgPT09ICdyYXJlJyA/ICdyYXJpdHktb3V0bGluZS1yYXJlJyA6ICdyYXJpdHktb3V0bGluZS1jb21tb24nXG4gICAgICAgICAgICB9XCIgZGF0YS1yYXJpdHk9XCIke3Jhcml0eS5rZXl9XCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIiBzdHlsZT1cImp1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2FsaWduLWl0ZW1zOmZsZXgtc3RhcnQ7Z2FwOjEwcHg7XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cImRpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjZweDtmbGV4OjE7bWluLXdpZHRoOjA7XCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZGlzcGxheTpmbGV4O2ZsZXgtd3JhcDp3cmFwO2dhcDo2cHg7YWxpZ24taXRlbXM6Y2VudGVyO1wiPlxuICAgICAgICAgICAgICAgICAgICA8c3Ryb25nIHN0eWxlPVwiZm9udC1zaXplOjE1cHg7d2hpdGUtc3BhY2U6bm93cmFwO2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjZweDtcIj48c3BhbiBkYXRhLWljbz1cIm9yZVwiPjwvc3Bhbj4ke25hbWV9PC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYmFkZ2UgcmFyaXR5LSR7cmFyaXR5LmtleX1cIj48aT48L2k+JHtyYXJpdHkudGV4dH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICR7aXRlbS5pc0VxdWlwcGVkID8gJzxzcGFuIGNsYXNzPVwicGlsbCBwaWxsLXJ1bm5pbmdcIj5cdTVERjJcdTg4QzVcdTU5MDc8L3NwYW4+JyA6ICcnfVxuICAgICAgICAgICAgICAgICAgICAke2l0ZW0uaXNMaXN0ZWQgPyAnPHNwYW4gY2xhc3M9XCJwaWxsXCI+XHU2MzAyXHU1MzU1XHU0RTJEPC9zcGFuPicgOiAnJ31cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgJHt0cGw/LmRlc2NyaXB0aW9uID8gYDxkaXYgc3R5bGU9XCJvcGFjaXR5Oi43NTtmb250LXNpemU6MTNweDtmb250LXN0eWxlOml0YWxpYztcIj4ke3RwbC5kZXNjcmlwdGlvbn08L2Rpdj5gIDogJyd9XG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwib3BhY2l0eTouODU7ZGlzcGxheTpmbGV4O2ZsZXgtd3JhcDp3cmFwO2dhcDo4cHg7Zm9udC1zaXplOjEzcHg7XCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuPlx1N0I0OVx1N0VBNyBMdi4ke2l0ZW0ubGV2ZWx9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAke3RwbD8uYmFzZUVmZmVjdCA/IGA8c3BhbiBjbGFzcz1cInBpbGxcIj5cdTU3RkFcdTc4NDBcdTY1NDhcdTY3OUMgJHt0cGwuYmFzZUVmZmVjdH08L3NwYW4+YCA6ICcnfVxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInBpbGxcIj5cdTVCOUVcdTRGOEIgJHtpdGVtLmlkfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhY3Rpb25zXCI+XG4gICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuICR7aXRlbS5pc0VxdWlwcGVkID8gJ2J0bi1zZWxsJyA6ICdidG4tYnV5J31cIiBkYXRhLWFjdD1cIiR7aXRlbS5pc0VxdWlwcGVkID8gJ3VuZXF1aXAnIDogJ2VxdWlwJ31cIiBkYXRhLWlkPVwiJHtpdGVtLmlkfVwiPjxzcGFuIGRhdGEtaWNvPVwiJHtpdGVtLmlzRXF1aXBwZWQgPyAneCcgOiAnc2hpZWxkJ31cIj48L3NwYW4+JHtpdGVtLmlzRXF1aXBwZWQgPyAnXHU1Mzc4XHU0RTBCJyA6ICdcdTg4QzVcdTU5MDcnfTwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiIGRhdGEtYWN0PVwidXBncmFkZVwiIGRhdGEtaWQ9XCIke2l0ZW0uaWR9XCIgdGl0bGU9XCJcdTZEODhcdTgwMTcgJHtpdGVtLmxldmVsICogNTB9IFx1NzdGRlx1NzdGM1x1RkYwQ1x1NjIxMFx1NTI5Rlx1NzM4NyAke3N1Y2Nlc3NQY3R9JVwiPjxzcGFuIGRhdGEtaWNvPVwid3JlbmNoXCI+PC9zcGFuPlx1NTM0N1x1N0VBNyAoJHtpdGVtLmxldmVsICogNTB9KSAke3N1Y2Nlc3NQY3R9JTwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tZ2hvc3RcIiBkYXRhLWFjdD1cInRvZ2dsZVwiIGRhdGEtaWQ9XCIke2l0ZW0uaWR9XCI+PHNwYW4gZGF0YS1pY289XCJsaXN0XCI+PC9zcGFuPlx1OEJFNlx1NjBDNTwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRpbWVsaW5lXCIgaWQ9XCJ0bC0ke2l0ZW0uaWR9XCIgaGlkZGVuPjwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgYCk7XG4gICAgICAgICAgbW91bnRJY29ucyhyb3cpO1xuICAgICAgICAgIHJvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIChldikgPT4ge1xuICAgICAgICAgICAgLy8gXHU2N0U1XHU2MjdFXHU3NzFGXHU2QjYzXHU3Njg0XHU2MzA5XHU5NEFFXHU1MTQzXHU3RDIwXHVGRjA4XHU1M0VGXHU4MEZEXHU3MEI5XHU1MUZCXHU0RTg2XHU1MTg1XHU5MEU4XHU3Njg0c3Bhbi9zdmdcdUZGMDlcbiAgICAgICAgICAgIGNvbnN0IGJ0biA9IChldi50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLmNsb3Nlc3QoJ2J1dHRvbicpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xuICAgICAgICAgICAgaWYgKCFidG4pIHJldHVybjtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgaWQgPSBidG4uZ2V0QXR0cmlidXRlKCdkYXRhLWlkJyk7XG4gICAgICAgICAgICBjb25zdCBhY3QgPSBidG4uZ2V0QXR0cmlidXRlKCdkYXRhLWFjdCcpO1xuICAgICAgICAgICAgaWYgKCFpZCB8fCAhYWN0KSByZXR1cm47XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIFx1OTYzMlx1NkI2Mlx1OTFDRFx1NTkwRFx1NzBCOVx1NTFGQlxuICAgICAgICAgICAgaWYgKGJ0bi5kaXNhYmxlZCAmJiBhY3QgIT09ICd0b2dnbGUnKSByZXR1cm47XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChhY3QgPT09ICd0b2dnbGUnKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGJveCA9IHJvdy5xdWVyeVNlbGVjdG9yKGAjdGwtJHtpZH1gKSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgICAgICAgaWYgKCFib3gpIHJldHVybjtcbiAgICAgICAgICAgICAgaWYgKCFib3guaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgICAgICAgICAgICAgYm94LmlubmVySFRNTCA9ICc8ZGl2IGNsYXNzPVwic2tlbGV0b25cIiBzdHlsZT1cImhlaWdodDozNnB4O1wiPjwvZGl2Pic7XG4gICAgICAgICAgICAgICAgYm94LmhpZGRlbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyBsb2dzOiB7IHR5cGU6IHN0cmluZzsgZGVzYz86IHN0cmluZzsgdGltZTogbnVtYmVyIH1bXSB9PihgL2l0ZW1zL2xvZ3M/aXRlbUlkPSR7aWR9YCk7XG4gICAgICAgICAgICAgICAgICBjb25zdCBsb2dzID0gQXJyYXkuaXNBcnJheShyZXMubG9ncykgPyByZXMubG9ncyA6IFtdO1xuICAgICAgICAgICAgICAgICAgYm94LmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgICAgICAgaWYgKCFsb2dzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBib3guaW5uZXJIVE1MID0gJzxkaXYgc3R5bGU9XCJvcGFjaXR5Oi44O1wiPlx1NjY4Mlx1NjVFMFx1NTM4Nlx1NTNGMlx1NjU3MFx1NjM2RTwvZGl2Pic7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGxvZyBvZiBsb2dzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgY29uc3Qgbm9kZSA9IGh0bWwoYFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRpbWVsaW5lLWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRvdFwiPjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGltZVwiPiR7Zm9ybWF0VGltZShsb2cudGltZSl9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkZXNjXCI+JHsobG9nLmRlc2MgfHwgbG9nLnR5cGUgfHwgJycpLnJlcGxhY2UoLzwvZywnJmx0OycpfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgYCk7XG4gICAgICAgICAgICAgICAgICAgICAgYm94LmFwcGVuZENoaWxkKG5vZGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgICAgICAgICBib3guaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgICAgICAgICBib3guYXBwZW5kQ2hpbGQoaHRtbChgXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0aW1lbGluZS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRvdFwiPjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0aW1lXCI+XHUyMDE0PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRlc2NcIj5cdTY3NjVcdTZFOTBcdTY3MkFcdTc3RTUgXHUwMEI3IFx1NTNFRlx1OTAxQVx1OEZDN1x1NjMxNlx1NzdGRlx1MzAwMVx1NjNBMFx1NTkzQVx1NjIxNlx1NEVBNFx1NjYxM1x1ODNCN1x1NTNENjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIGApKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYm94LmhpZGRlbiA9ICFib3guaGlkZGVuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gXHU2NENEXHU0RjVDXHU2MzA5XHU5NEFFXHU1OTA0XHU3NDA2XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBidG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICBjb25zdCBvcmlnaW5hbEhUTUwgPSBidG4uaW5uZXJIVE1MO1xuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgaWYgKGFjdCA9PT0gJ2VxdWlwJykge1xuICAgICAgICAgICAgICAgIGJ0bi5pbm5lckhUTUwgPSAnPHNwYW4gZGF0YS1pY289XCJzaGllbGRcIj48L3NwYW4+XHU4OEM1XHU1OTA3XHU0RTJEXHUyMDI2JztcbiAgICAgICAgICAgICAgICBtb3VudEljb25zKGJ0bik7XG4gICAgICAgICAgICAgICAgYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0KCcvaXRlbXMvZXF1aXAnLCB7IG1ldGhvZDogJ1BPU1QnLCBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGl0ZW1JZDogaWQgfSkgfSk7XG4gICAgICAgICAgICAgICAgc2hvd1RvYXN0KCdcdTg4QzVcdTU5MDdcdTYyMTBcdTUyOUYnLCAnc3VjY2VzcycpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFjdCA9PT0gJ3VuZXF1aXAnKSB7XG4gICAgICAgICAgICAgICAgYnRuLmlubmVySFRNTCA9ICc8c3BhbiBkYXRhLWljbz1cInhcIj48L3NwYW4+XHU1Mzc4XHU0RTBCXHU0RTJEXHUyMDI2JztcbiAgICAgICAgICAgICAgICBtb3VudEljb25zKGJ0bik7XG4gICAgICAgICAgICAgICAgYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0KCcvaXRlbXMvdW5lcXVpcCcsIHsgbWV0aG9kOiAnUE9TVCcsIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgaXRlbUlkOiBpZCB9KSB9KTtcbiAgICAgICAgICAgICAgICBzaG93VG9hc3QoJ1x1NTM3OFx1NEUwQlx1NjIxMFx1NTI5RicsICdzdWNjZXNzJyk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoYWN0ID09PSAndXBncmFkZScpIHtcbiAgICAgICAgICAgICAgICBidG4uaW5uZXJIVE1MID0gJzxzcGFuIGRhdGEtaWNvPVwid3JlbmNoXCI+PC9zcGFuPlx1NTM0N1x1N0VBN1x1NEUyRFx1MjAyNic7XG4gICAgICAgICAgICAgICAgbW91bnRJY29ucyhidG4pO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IGxldmVsOiBudW1iZXI7IGNvc3Q6IG51bWJlciB9PignL2l0ZW1zL3VwZ3JhZGUnLCB7IG1ldGhvZDogJ1BPU1QnLCBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGl0ZW1JZDogaWQgfSkgfSk7XG4gICAgICAgICAgICAgICAgLy8gXHU1MzQ3XHU3RUE3XHU2MjEwXHU1MjlGXHU1MkE4XHU3NTNCXG4gICAgICAgICAgICAgICAgcm93LmNsYXNzTGlzdC5hZGQoJ3VwZ3JhZGUtc3VjY2VzcycpO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gcm93LmNsYXNzTGlzdC5yZW1vdmUoJ3VwZ3JhZGUtc3VjY2VzcycpLCAxMDAwKTtcbiAgICAgICAgICAgICAgICBzaG93VG9hc3QoYFx1NTM0N1x1N0VBN1x1NjIxMFx1NTI5Rlx1RkYwMVx1N0I0OVx1N0VBNyAke3Jlcy5sZXZlbH1cdUZGMDhcdTZEODhcdTgwMTcgJHtyZXMuY29zdH0gXHU3N0ZGXHU3N0YzXHVGRjA5YCwgJ3N1Y2Nlc3MnKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBhd2FpdCBiYXIudXBkYXRlKCk7XG4gICAgICAgICAgICAgIGF3YWl0IGxvYWQoKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgICAgICAgICBzaG93VG9hc3QoZT8ubWVzc2FnZSB8fCAnXHU2NENEXHU0RjVDXHU1OTMxXHU4RDI1JywgJ2Vycm9yJyk7XG4gICAgICAgICAgICAgIC8vIFx1NTkzMVx1OEQyNVx1NjVGNlx1NjA2Mlx1NTkwRFx1NjMwOVx1OTRBRVx1NTM5Rlx1NTlDQlx1NzJCNlx1NjAwMVx1RkYwOFx1NTZFMFx1NEUzQVx1NEUwRFx1NEYxQVx1OTFDRFx1NjVCMFx1NkUzMlx1NjdEM1x1RkYwOVxuICAgICAgICAgICAgICBidG4uaW5uZXJIVE1MID0gb3JpZ2luYWxIVE1MO1xuICAgICAgICAgICAgICBidG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBsaXN0LmFwcGVuZENoaWxkKHJvdyk7XG4gICAgICAgIH1cblxuICAgICAgICB0cGxDb250YWluZXIuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIGZvciAoY29uc3QgdHBsIG9mICh0cGxzLnRlbXBsYXRlcyB8fCBbXSkpIHtcbiAgICAgICAgICBjb25zdCByYXJpdHlUZXh0ID0gdHBsLnJhcml0eSA9PT0gJ2xlZ2VuZGFyeScgPyAnXHU0RjIwXHU4QkY0JyA6IHRwbC5yYXJpdHkgPT09ICdlcGljJyA/ICdcdTUzRjJcdThCRDcnIDogdHBsLnJhcml0eSA9PT0gJ3JhcmUnID8gJ1x1N0EwMFx1NjcwOScgOiAnXHU2NjZFXHU5MDFBJztcbiAgICAgICAgICBjb25zdCBjYXRlZ29yeVRleHQgPSB0cGwuY2F0ZWdvcnkgPT09ICdtaW5lcicgPyAnXHU3N0ZGXHU2NzNBJyA6IHRwbC5jYXRlZ29yeSA9PT0gJ2NhcnQnID8gJ1x1NzdGRlx1OEY2NicgOiB0cGwuY2F0ZWdvcnkgPT09ICdyYWlkZXInID8gJ1x1NjNBMFx1NTkzQVx1NTY2OCcgOiAnXHU5NjMyXHU1RkExXHU3NkZFJztcbiAgICAgICAgICBjb25zdCByb3cgPSBodG1sKGBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsaXN0LWl0ZW1cIj5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cImZsZXg6MTtkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDo0cHg7XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cImRpc3BsYXk6ZmxleDtnYXA6NnB4O2FsaWduLWl0ZW1zOmNlbnRlcjtcIj5cbiAgICAgICAgICAgICAgICAgIDxzdHJvbmc+JHt0cGwubmFtZSB8fCB0cGwuaWR9PC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImJhZGdlIHJhcml0eS0ke3RwbC5yYXJpdHl9XCI+PGk+PC9pPiR7cmFyaXR5VGV4dH08L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cIm9wYWNpdHk6Ljc1O2ZvbnQtc2l6ZToxMnB4O1wiPiR7dHBsLmRlc2NyaXB0aW9uIHx8ICcnfTwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJvcGFjaXR5Oi42NTtmb250LXNpemU6MTJweDtcIj5cdTdDN0JcdTU3OEJcdUZGMUEke2NhdGVnb3J5VGV4dH0gXHUwMEI3IFx1NTdGQVx1Nzg0MFx1NjU0OFx1Njc5Q1x1RkYxQSR7dHBsLmJhc2VFZmZlY3R9PC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgYCk7XG4gICAgICAgICAgdHBsQ29udGFpbmVyLmFwcGVuZENoaWxkKHJvdyk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgICBzaG93VG9hc3QoZT8ubWVzc2FnZSB8fCAnXHU1MkEwXHU4RjdEXHU0RUQzXHU1RTkzXHU1OTMxXHU4RDI1JywgJ2Vycm9yJyk7XG4gICAgICAgIGxpc3QuaW5uZXJIVE1MID0gJzxkaXYgc3R5bGU9XCJvcGFjaXR5Oi44O3RleHQtYWxpZ246Y2VudGVyO3BhZGRpbmc6MjBweDtcIj5cdTUyQTBcdThGN0RcdTU5MzFcdThEMjVcdUZGMENcdThCRjdcdTdBMERcdTU0MEVcdTkxQ0RcdThCRDU8L2Rpdj4nO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgcmVmcmVzaEJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICByZWZyZXNoQnRuLmlubmVySFRNTCA9ICc8c3BhbiBkYXRhLWljbz1cInJlZnJlc2hcIj48L3NwYW4+XHU1MjM3XHU2NUIwJztcbiAgICAgICAgbW91bnRJY29ucyhyZWZyZXNoQnRuKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmVmcmVzaEJ0bi5vbmNsaWNrID0gKCkgPT4gbG9hZCgpO1xuICAgIGF3YWl0IGxvYWQoKTtcbiAgfVxufVxuIiwgImltcG9ydCB7IE5ldHdvcmtNYW5hZ2VyIH0gZnJvbSAnLi4vY29yZS9OZXR3b3JrTWFuYWdlcic7XG5pbXBvcnQgeyBodG1sLCBxcyB9IGZyb20gJy4uL3V0aWxzL2RvbSc7XG5pbXBvcnQgeyByZW5kZXJOYXYgfSBmcm9tICcuLi9jb21wb25lbnRzL05hdic7XG5pbXBvcnQgeyBSZWFsdGltZUNsaWVudCB9IGZyb20gJy4uL2NvcmUvUmVhbHRpbWVDbGllbnQnO1xuaW1wb3J0IHsgc2hvd1RvYXN0IH0gZnJvbSAnLi4vY29tcG9uZW50cy9Ub2FzdCc7XG5pbXBvcnQgeyByZW5kZXJSZXNvdXJjZUJhciB9IGZyb20gJy4uL2NvbXBvbmVudHMvUmVzb3VyY2VCYXInO1xuaW1wb3J0IHsgcmVuZGVySWNvbiB9IGZyb20gJy4uL2NvbXBvbmVudHMvSWNvbic7XG5pbXBvcnQgeyBjcmVhdGVTd29yZFNsYXNoIH0gZnJvbSAnLi4vY29tcG9uZW50cy9BbmltYXRlZEljb25zJztcblxuZXhwb3J0IGNsYXNzIFBsdW5kZXJTY2VuZSB7XG4gIHByaXZhdGUgcmVzdWx0Qm94OiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuXG4gIG1vdW50KHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgcm9vdC5pbm5lckhUTUwgPSAnJztcbiAgICByb290LmFwcGVuZENoaWxkKHJlbmRlck5hdigncGx1bmRlcicpKTtcbiAgICBjb25zdCBiYXIgPSByZW5kZXJSZXNvdXJjZUJhcigpO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQoYmFyLnJvb3QpO1xuXG4gICAgY29uc3QgdmlldyA9IGh0bWwoYFxuICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lciBncmlkLTJcIiBzdHlsZT1cImNvbG9yOiNmZmY7XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkIGZhZGUtaW5cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCIgc3R5bGU9XCJqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjthbGlnbi1pdGVtczpjZW50ZXI7XCI+XG4gICAgICAgICAgICA8aDMgc3R5bGU9XCJtYXJnaW46MDtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo4cHg7XCI+PHNwYW4gZGF0YS1pY289XCJzd29yZFwiPjwvc3Bhbj5cdTYzQTBcdTU5M0FcdTc2RUVcdTY4MDc8L2gzPlxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInJlZnJlc2hcIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiPjxzcGFuIGRhdGEtaWNvPVwicmVmcmVzaFwiPjwvc3Bhbj5cdTUyMzdcdTY1QjA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IHN0eWxlPVwibWFyZ2luLXRvcDoxMnB4O1wiPlxuICAgICAgICAgICAgPGRldGFpbHM+XG4gICAgICAgICAgICAgIDxzdW1tYXJ5IHN0eWxlPVwiY29sb3I6I2ZmNWM1YztcIj48c3BhbiBkYXRhLWljbz1cInRhcmdldFwiPjwvc3Bhbj5cdTU5MERcdTRFQzdcdTUyMTdcdTg4Njg8L3N1bW1hcnk+XG4gICAgICAgICAgICAgIDxkaXYgaWQ9XCJyZXZlbmdlXCIgc3R5bGU9XCJtYXJnaW4tdG9wOjhweDtkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDo4cHg7XCI+PC9kaXY+XG4gICAgICAgICAgICA8L2RldGFpbHM+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBpZD1cImxpc3RcIiBzdHlsZT1cIm1hcmdpbi10b3A6MTJweDtkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDo4cHg7XCI+PC9kaXY+XG4gICAgICAgICAgPGRpdiBpZD1cInJlc3VsdFwiIHN0eWxlPVwibWFyZ2luLXRvcDoxMnB4O29wYWNpdHk6Ljk7Zm9udC1mYW1pbHk6bW9ub3NwYWNlO1wiPjwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIGApO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQodmlldyk7XG5cbiAgICBjb25zdCB0b2tlbiA9IE5ldHdvcmtNYW5hZ2VyLkkuZ2V0VG9rZW4oKTtcbiAgICBpZiAodG9rZW4pIFJlYWx0aW1lQ2xpZW50LkkuY29ubmVjdCh0b2tlbik7XG5cbiAgICBSZWFsdGltZUNsaWVudC5JLm9uKCdwbHVuZGVyLmF0dGFja2VkJywgKG1zZykgPT4ge1xuICAgICAgc2hvd1RvYXN0KGBcdTg4QUJcdTYzQTBcdTU5M0FcdUZGMUFcdTY3NjVcdTgxRUEgJHttc2cuYXR0YWNrZXJ9XHVGRjBDXHU2MzVGXHU1OTMxICR7bXNnLmxvc3N9YCk7XG4gICAgICB0aGlzLmxvZyhgXHU4OEFCICR7bXNnLmF0dGFja2VyfSBcdTYzQTBcdTU5M0FcdUZGMENcdTYzNUZcdTU5MzEgJHttc2cubG9zc31gKTtcbiAgICB9KTtcbiAgICB0aGlzLnJlc3VsdEJveCA9IHFzKHZpZXcsICcjcmVzdWx0Jyk7XG5cbiAgICBjb25zdCBsaXN0ID0gcXModmlldywgJyNsaXN0Jyk7XG4gICAgY29uc3QgcmV2ZW5nZUxpc3QgPSBxcyh2aWV3LCAnI3JldmVuZ2UnKTtcbiAgICBjb25zdCByZWZyZXNoQnRuID0gcXM8SFRNTEJ1dHRvbkVsZW1lbnQ+KHZpZXcsICcjcmVmcmVzaCcpO1xuICAgIGNvbnN0IG1vdW50SWNvbnMgPSAocm9vdEVsOiBFbGVtZW50KSA9PiB7XG4gICAgICByb290RWwucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtaWNvXScpXG4gICAgICAgIC5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICAgIGNvbnN0IG5hbWUgPSAoZWwgYXMgSFRNTEVsZW1lbnQpLmdldEF0dHJpYnV0ZSgnZGF0YS1pY28nKSBhcyBhbnk7XG4gICAgICAgICAgdHJ5IHsgZWwuYXBwZW5kQ2hpbGQocmVuZGVySWNvbihuYW1lLCB7IHNpemU6IDIwIH0pKTsgfSBjYXRjaCB7fVxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIG1vdW50SWNvbnModmlldyk7XG5cbiAgICBjb25zdCBsb2FkID0gYXN5bmMgKCkgPT4ge1xuICAgICAgcmVmcmVzaEJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICByZWZyZXNoQnRuLmlubmVySFRNTCA9ICc8c3BhbiBkYXRhLWljbz1cInJlZnJlc2hcIj48L3NwYW4+XHU1MjM3XHU2NUIwXHU0RTJEXHUyMDI2JztcbiAgICAgIG1vdW50SWNvbnMocmVmcmVzaEJ0bik7XG4gICAgICBhd2FpdCBiYXIudXBkYXRlKCk7XG4gICAgICBsaXN0LmlubmVySFRNTCA9ICcnO1xuICAgICAgcmV2ZW5nZUxpc3QuaW5uZXJIVE1MID0gJyc7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykgbGlzdC5hcHBlbmRDaGlsZChodG1sKCc8ZGl2IGNsYXNzPVwic2tlbGV0b25cIj48L2Rpdj4nKSk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBbZGF0YSwgcmV2ZW5nZURhdGFdID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICAgIE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IHRhcmdldHM6IGFueVtdIH0+KCcvcGx1bmRlci90YXJnZXRzJyksXG4gICAgICAgICAgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgcmV2ZW5nZXM6IGFueVtdIH0+KCcvcGx1bmRlci9yZXZlbmdlLWxpc3QnKS5jYXRjaCgoKSA9PiAoeyByZXZlbmdlczogW10gfSkpXG4gICAgICAgIF0pO1xuICAgICAgICBcbiAgICAgICAgLy8gXHU2RTMyXHU2N0QzXHU1OTBEXHU0RUM3XHU1MjE3XHU4ODY4XG4gICAgICAgIHJldmVuZ2VMaXN0LmlubmVySFRNTCA9ICcnO1xuICAgICAgICBpZiAocmV2ZW5nZURhdGEucmV2ZW5nZXMgJiYgcmV2ZW5nZURhdGEucmV2ZW5nZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGZvciAoY29uc3QgdGFyZ2V0IG9mIHJldmVuZ2VEYXRhLnJldmVuZ2VzKSB7XG4gICAgICAgICAgICBjb25zdCByb3cgPSBodG1sKGBcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxpc3QtaXRlbSBsaXN0LWl0ZW0tLXNlbGxcIiBzdHlsZT1cImJvcmRlci1jb2xvcjojZmY1YzVjO1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDoycHg7XCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NnB4O2NvbG9yOiNmZjVjNWM7XCI+PHNwYW4gZGF0YS1pY289XCJ0YXJnZXRcIj48L3NwYW4+PHN0cm9uZz4ke3RhcmdldC51c2VybmFtZSB8fCB0YXJnZXQuaWR9PC9zdHJvbmc+IFx1RDgzRFx1REM3OSBcdTRFQzdcdTRFQkE8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJvcGFjaXR5Oi44NTtcIj5cdTc3RkZcdTc3RjNcdUZGMUEke3RhcmdldC5vcmV9IDxzcGFuIGNsYXNzPVwicGlsbFwiPlx1NTkwRFx1NEVDN1x1NjNBMFx1NTkzQVx1NEUwRFx1NTNEN1x1NTFCN1x1NTM3NFx1OTY1MFx1NTIzNjwvc3Bhbj48L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tc2VsbFwiIGRhdGEtaWQ9XCIke3RhcmdldC5pZH1cIj48c3BhbiBkYXRhLWljbz1cInN3b3JkXCI+PC9zcGFuPlx1NTkwRFx1NEVDNzwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIGApO1xuICAgICAgICAgICAgbW91bnRJY29ucyhyb3cpO1xuICAgICAgICAgICAgcm93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKGV2KSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IGVsID0gZXYudGFyZ2V0IGFzIEhUTUxCdXR0b25FbGVtZW50O1xuICAgICAgICAgICAgICBjb25zdCBpZCA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1pZCcpO1xuICAgICAgICAgICAgICBpZiAoIWlkKSByZXR1cm47XG4gICAgICAgICAgICAgIGNvbnN0IGJ0biA9IGVsLmNsb3Nlc3QoJ2J1dHRvbicpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xuICAgICAgICAgICAgICBpZiAoIWJ0bikgcmV0dXJuO1xuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgYnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxIVE1MID0gYnRuLmlubmVySFRNTDtcbiAgICAgICAgICAgICAgYnRuLmlubmVySFRNTCA9ICc8c3BhbiBkYXRhLWljbz1cInN3b3JkXCI+PC9zcGFuPlx1NTkwRFx1NEVDN1x1NEUyRFx1MjAyNic7XG4gICAgICAgICAgICAgIG1vdW50SWNvbnMoYnRuKTtcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIGxldCBzaG91bGRSZWZyZXNoID0gZmFsc2U7XG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgc3VjY2VzczogYm9vbGVhbjsgbG9vdF9hbW91bnQ6IG51bWJlciB9PihgL3BsdW5kZXIvJHtpZH1gLCB7IG1ldGhvZDogJ1BPU1QnIH0pO1xuICAgICAgICAgICAgICAgIGlmIChyZXMuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgdGhpcy5sb2coYFx1NTkwRFx1NEVDN1x1NjIxMFx1NTI5Rlx1RkYwQ1x1ODNCN1x1NUY5NyAke3Jlcy5sb290X2Ftb3VudH1gKTtcbiAgICAgICAgICAgICAgICAgIHNob3dUb2FzdChgXHUyNjk0XHVGRTBGIFx1NTkwRFx1NEVDN1x1NjIxMFx1NTI5Rlx1RkYwMVx1ODNCN1x1NUY5NyAke3Jlcy5sb290X2Ftb3VudH0gXHU3N0ZGXHU3N0YzYCwgJ3N1Y2Nlc3MnKTtcbiAgICAgICAgICAgICAgICAgIHNob3VsZFJlZnJlc2ggPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLmxvZyhgXHU1OTBEXHU0RUM3XHU1OTMxXHU4RDI1YCk7XG4gICAgICAgICAgICAgICAgICBzaG93VG9hc3QoJ1x1NTkwRFx1NEVDN1x1NTkzMVx1OEQyNScsICd3YXJuJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGF3YWl0IGJhci51cGRhdGUoKTtcbiAgICAgICAgICAgICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IGU/Lm1lc3NhZ2UgfHwgJ1x1NTkwRFx1NEVDN1x1NTkzMVx1OEQyNSc7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2coYFx1NTkwRFx1NEVDN1x1NTkzMVx1OEQyNVx1RkYxQSR7bWVzc2FnZX1gKTtcbiAgICAgICAgICAgICAgICBzaG93VG9hc3QobWVzc2FnZSwgJ2Vycm9yJyk7XG4gICAgICAgICAgICAgICAgYnRuLmlubmVySFRNTCA9IG9yaWdpbmFsSFRNTDtcbiAgICAgICAgICAgICAgICBtb3VudEljb25zKGJ0bik7XG4gICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgYnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgaWYgKHNob3VsZFJlZnJlc2gpIHtcbiAgICAgICAgICAgICAgICAgIGF3YWl0IGxvYWQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV2ZW5nZUxpc3QuYXBwZW5kQ2hpbGQocm93KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV2ZW5nZUxpc3QuaW5uZXJIVE1MID0gJzxkaXYgc3R5bGU9XCJvcGFjaXR5Oi44O3RleHQtYWxpZ246Y2VudGVyO3BhZGRpbmc6MTBweDtcIj5cdTY2ODJcdTY1RTBcdTUzRUZcdTU5MERcdTRFQzdcdTc2ODRcdTVCRjlcdThDNjE8L2Rpdj4nO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBsaXN0LmlubmVySFRNTCA9ICcnO1xuICAgICAgICBpZiAoIWRhdGEudGFyZ2V0cy5sZW5ndGgpIHtcbiAgICAgICAgICBsaXN0LmFwcGVuZENoaWxkKGh0bWwoJzxkaXYgc3R5bGU9XCJvcGFjaXR5Oi44O1wiPlx1NjY4Mlx1NjVFMFx1NTNFRlx1NjNBMFx1NTkzQVx1NzY4NFx1NzZFRVx1NjgwN1x1RkYwQ1x1N0EwRFx1NTQwRVx1NTE4RFx1OEJENTwvZGl2PicpKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IHRhcmdldCBvZiBkYXRhLnRhcmdldHMpIHtcbiAgICAgICAgICBjb25zdCByb3cgPSBodG1sKGBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsaXN0LWl0ZW0gbGlzdC1pdGVtLS1zZWxsXCI+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDoycHg7XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cImRpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjZweDtcIj48c3BhbiBkYXRhLWljbz1cInRhcmdldFwiPjwvc3Bhbj48c3Ryb25nPiR7dGFyZ2V0LnVzZXJuYW1lIHx8IHRhcmdldC5pZH08L3N0cm9uZz48L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwib3BhY2l0eTouODU7XCI+XHU3N0ZGXHU3N0YzXHVGRjFBJHt0YXJnZXQub3JlfSA8c3BhbiBjbGFzcz1cInBpbGxcIj5cdTk4ODRcdThCQTFcdTY1MzZcdTc2Q0EgNSV+MzUlPC9zcGFuPjwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1zZWxsIHBsdW5kZXItYnRuXCIgZGF0YS1pZD1cIiR7dGFyZ2V0LmlkfVwiPjxzcGFuIGNsYXNzPVwiaWNvbi1zbG90XCI+PC9zcGFuPlx1NjNBMFx1NTkzQTwvYnV0dG9uPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIGApO1xuICAgICAgICAgIG1vdW50SWNvbnMocm93KTtcbiAgICAgICAgICBcbiAgICAgICAgICAvLyBcdTZERkJcdTUyQTBcdTUyNTFcdTZDMTRcdTUyQThcdTc1M0JcdTUyMzBcdTYzQTBcdTU5M0FcdTYzMDlcdTk0QUVcbiAgICAgICAgICBjb25zdCBwbHVuZGVyQnRuID0gcm93LnF1ZXJ5U2VsZWN0b3IoJy5wbHVuZGVyLWJ0biAuaWNvbi1zbG90Jyk7XG4gICAgICAgICAgaWYgKHBsdW5kZXJCdG4pIHtcbiAgICAgICAgICAgIHBsdW5kZXJCdG4uYXBwZW5kQ2hpbGQoY3JlYXRlU3dvcmRTbGFzaCgpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgcm93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKGV2KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBlbCA9IGV2LnRhcmdldCBhcyBIVE1MQnV0dG9uRWxlbWVudDtcbiAgICAgICAgICAgIGNvbnN0IGlkID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWlkJyk7XG4gICAgICAgICAgICBpZiAoIWlkKSByZXR1cm47XG4gICAgICAgICAgICBjb25zdCBidG4gPSBlbC5jbG9zZXN0KCdidXR0b24nKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcbiAgICAgICAgICAgIGlmICghYnRuKSByZXR1cm47XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgICBjb25zdCBvcmlnaW5hbEhUTUwgPSBidG4uaW5uZXJIVE1MO1xuICAgICAgICAgICAgYnRuLmlubmVySFRNTCA9ICc8c3BhbiBkYXRhLWljbz1cInN3b3JkXCI+PC9zcGFuPlx1NjNBMFx1NTkzQVx1NEUyRFx1MjAyNic7XG4gICAgICAgICAgICBtb3VudEljb25zKGJ0bik7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGxldCBzaG91bGRSZWZyZXNoID0gZmFsc2U7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyBzdWNjZXNzOiBib29sZWFuOyBsb290X2Ftb3VudDogbnVtYmVyIH0+KGAvcGx1bmRlci8ke2lkfWAsIHsgbWV0aG9kOiAnUE9TVCcgfSk7XG4gICAgICAgICAgICAgIGlmIChyZXMuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIHRoaXMubG9nKGBcdTYyMTBcdTUyOUZcdTYzQTBcdTU5M0EgJHtpZH1cdUZGMENcdTgzQjdcdTVGOTcgJHtyZXMubG9vdF9hbW91bnR9YCk7XG4gICAgICAgICAgICAgICAgc2hvd1RvYXN0KGBcdTYzQTBcdTU5M0FcdTYyMTBcdTUyOUZcdUZGMENcdTgzQjdcdTVGOTcgJHtyZXMubG9vdF9hbW91bnR9IFx1NzdGRlx1NzdGM2AsICdzdWNjZXNzJyk7XG4gICAgICAgICAgICAgICAgc2hvdWxkUmVmcmVzaCA9IHRydWU7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2coYFx1NjNBMFx1NTkzQSAke2lkfSBcdTU5MzFcdThEMjVgKTtcbiAgICAgICAgICAgICAgICBzaG93VG9hc3QoJ1x1NjNBMFx1NTkzQVx1NTkzMVx1OEQyNScsICd3YXJuJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgYXdhaXQgYmFyLnVwZGF0ZSgpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBlPy5tZXNzYWdlIHx8ICdcdTYzQTBcdTU5M0FcdTU5MzFcdThEMjUnO1xuICAgICAgICAgICAgICB0aGlzLmxvZyhgXHU2M0EwXHU1OTNBXHU1OTMxXHU4RDI1XHVGRjFBJHttZXNzYWdlfWApO1xuICAgICAgICAgICAgICBpZiAobWVzc2FnZS5pbmNsdWRlcygnXHU1MUI3XHU1Mzc0JykpIHtcbiAgICAgICAgICAgICAgICBzaG93VG9hc3QobWVzc2FnZSwgJ3dhcm4nKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzaG93VG9hc3QobWVzc2FnZSwgJ2Vycm9yJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLy8gXHU1OTMxXHU4RDI1XHU2NUY2XHU2MDYyXHU1OTBEXHU2MzA5XHU5NEFFXG4gICAgICAgICAgICAgIGJ0bi5pbm5lckhUTUwgPSBvcmlnaW5hbEhUTUw7XG4gICAgICAgICAgICAgIG1vdW50SWNvbnMoYnRuKTtcbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgIGJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAvLyBcdTYyMTBcdTUyOUZcdTU0MEVcdTUyMzdcdTY1QjBcdTUyMTdcdTg4NjhcdUZGMDhcdTRGMUFcdTY2RkZcdTYzNjJcdTYzMDlcdTk0QUVcdUZGMDlcbiAgICAgICAgICAgICAgaWYgKHNob3VsZFJlZnJlc2gpIHtcbiAgICAgICAgICAgICAgICBhd2FpdCBsb2FkKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBsaXN0LmFwcGVuZENoaWxkKHJvdyk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgICBzaG93VG9hc3QoZT8ubWVzc2FnZSB8fCAnXHU1MkEwXHU4RjdEXHU2M0EwXHU1OTNBXHU3NkVFXHU2ODA3XHU1OTMxXHU4RDI1JywgJ2Vycm9yJyk7XG4gICAgICAgIGxpc3QuaW5uZXJIVE1MID0gJzxkaXYgc3R5bGU9XCJvcGFjaXR5Oi44O3RleHQtYWxpZ246Y2VudGVyO3BhZGRpbmc6MjBweDtcIj5cdTUyQTBcdThGN0RcdTU5MzFcdThEMjVcdUZGMENcdThCRjdcdTdBMERcdTU0MEVcdTkxQ0RcdThCRDU8L2Rpdj4nO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgcmVmcmVzaEJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICByZWZyZXNoQnRuLmlubmVySFRNTCA9ICc8c3BhbiBkYXRhLWljbz1cInJlZnJlc2hcIj48L3NwYW4+XHU1MjM3XHU2NUIwJztcbiAgICAgICAgbW91bnRJY29ucyhyZWZyZXNoQnRuKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmVmcmVzaEJ0bi5vbmNsaWNrID0gKCkgPT4gbG9hZCgpO1xuICAgIGxvYWQoKTtcbiAgfVxuXG4gIHByaXZhdGUgbG9nKG1zZzogc3RyaW5nKSB7XG4gICAgaWYgKCF0aGlzLnJlc3VsdEJveCkgcmV0dXJuO1xuICAgIGNvbnN0IGxpbmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBsaW5lLnRleHRDb250ZW50ID0gYFske25ldyBEYXRlKCkudG9Mb2NhbGVUaW1lU3RyaW5nKCl9XSAke21zZ31gO1xuICAgIHRoaXMucmVzdWx0Qm94LnByZXBlbmQobGluZSk7XG4gIH1cbn1cbiIsICJpbXBvcnQgeyBOZXR3b3JrTWFuYWdlciB9IGZyb20gJy4uL2NvcmUvTmV0d29ya01hbmFnZXInO1xuaW1wb3J0IHsgaHRtbCwgcXMgfSBmcm9tICcuLi91dGlscy9kb20nO1xuaW1wb3J0IHsgcmVuZGVyTmF2IH0gZnJvbSAnLi4vY29tcG9uZW50cy9OYXYnO1xuaW1wb3J0IHsgUmVhbHRpbWVDbGllbnQgfSBmcm9tICcuLi9jb3JlL1JlYWx0aW1lQ2xpZW50JztcbmltcG9ydCB7IEdhbWVNYW5hZ2VyIH0gZnJvbSAnLi4vY29yZS9HYW1lTWFuYWdlcic7XG5pbXBvcnQgeyBzaG93VG9hc3QgfSBmcm9tICcuLi9jb21wb25lbnRzL1RvYXN0JztcbmltcG9ydCB7IHJlbmRlclJlc291cmNlQmFyIH0gZnJvbSAnLi4vY29tcG9uZW50cy9SZXNvdXJjZUJhcic7XG5pbXBvcnQgeyByZW5kZXJJY29uIH0gZnJvbSAnLi4vY29tcG9uZW50cy9JY29uJztcbmltcG9ydCB7IGNyZWF0ZVNwaW5uaW5nQ29pbiB9IGZyb20gJy4uL2NvbXBvbmVudHMvQW5pbWF0ZWRJY29ucyc7XG5cbnR5cGUgT3JkZXIgPSB7XG4gIGlkOiBzdHJpbmc7XG4gIHVzZXJJZDogc3RyaW5nO1xuICB0eXBlOiAnYnV5JyB8ICdzZWxsJztcbiAgaXRlbVRlbXBsYXRlSWQ/OiBzdHJpbmc7XG4gIGl0ZW1JbnN0YW5jZUlkPzogc3RyaW5nO1xuICBwcmljZTogbnVtYmVyO1xuICBhbW91bnQ6IG51bWJlcjtcbiAgY3JlYXRlZEF0OiBudW1iZXI7XG59O1xuXG5leHBvcnQgY2xhc3MgRXhjaGFuZ2VTY2VuZSB7XG4gIHByaXZhdGUgcmVmcmVzaFRpbWVyOiBudW1iZXIgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSB0ZW1wbGF0ZXM6IHsgaWQ6IHN0cmluZzsgbmFtZT86IHN0cmluZzsgY2F0ZWdvcnk/OiBzdHJpbmcgfVtdID0gW107XG4gIHByaXZhdGUgaW52ZW50b3J5OiBhbnlbXSA9IFtdO1xuXG4gIGFzeW5jIG1vdW50KHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgdGhpcy5jbGVhclRpbWVyKCk7XG4gICAgcm9vdC5pbm5lckhUTUwgPSAnJztcblxuICAgIGNvbnN0IG5hdiA9IHJlbmRlck5hdignZXhjaGFuZ2UnKTtcbiAgICBjb25zdCBiYXIgPSByZW5kZXJSZXNvdXJjZUJhcigpO1xuICAgIGNvbnN0IHZpZXcgPSBodG1sKGBcbiAgICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXIgZ3JpZC0yXCIgc3R5bGU9XCJjb2xvcjojZmZmO1wiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZCBmYWRlLWluXCI+XG4gICAgICAgICAgPGgzIHN0eWxlPVwibWFyZ2luOjAgMCAxMnB4O2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjhweDtcIj48c3BhbiBkYXRhLWljbz1cImV4Y2hhbmdlXCI+PC9zcGFuPlx1NUUwMlx1NTczQVx1NEUwQlx1NTM1NSA8c3BhbiBpZD1cImNvaW5BbmltXCI+PC9zcGFuPjwvaDM+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiIHN0eWxlPVwiZmxleC13cmFwOndyYXA7YWxpZ24taXRlbXM6ZmxleC1lbmQ7Z2FwOjEycHg7XCI+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZmxleDoxO21pbi13aWR0aDoxODBweDtcIj5cbiAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVwiZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NnB4O1wiPjxzcGFuIGRhdGEtaWNvPVwibGlzdFwiPjwvc3Bhbj5cdThEMkRcdTRFNzBcdTZBMjFcdTY3N0Y8L2xhYmVsPlxuICAgICAgICAgICAgICA8c2VsZWN0IGlkPVwidHBsXCIgY2xhc3M9XCJpbnB1dFwiPjwvc2VsZWN0PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZmxleDoxO21pbi13aWR0aDoxMjBweDtcIj5cbiAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVwiZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NnB4O1wiPjxzcGFuIGRhdGEtaWNvPVwiY29pblwiPjwvc3Bhbj5cdTRFRjdcdTY4M0MgKEJCXHU1RTAxKTwvbGFiZWw+XG4gICAgICAgICAgICAgIDxpbnB1dCBpZD1cInByaWNlXCIgY2xhc3M9XCJpbnB1dFwiIHR5cGU9XCJudW1iZXJcIiBtaW49XCIxXCIgdmFsdWU9XCIxMFwiLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT1cImZsZXg6MTttaW4td2lkdGg6MTIwcHg7XCI+XG4gICAgICAgICAgICAgIDxsYWJlbD5cdThEMkRcdTRFNzBcdTY1NzBcdTkxQ0Y8L2xhYmVsPlxuICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJhbW91bnRcIiBjbGFzcz1cImlucHV0XCIgdHlwZT1cIm51bWJlclwiIG1pbj1cIjFcIiB2YWx1ZT1cIjFcIi8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxidXR0b24gaWQ9XCJwbGFjZUJ1eVwiIGNsYXNzPVwiYnRuIGJ0bi1idXlcIiBzdHlsZT1cIm1pbi13aWR0aDoxMjBweDtcIj48c3BhbiBkYXRhLWljbz1cImFycm93LXJpZ2h0XCI+PC9zcGFuPlx1NEUwQlx1NEU3MFx1NTM1NTwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgc3R5bGU9XCJoZWlnaHQ6OHB4O1wiPjwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIiBzdHlsZT1cImZsZXgtd3JhcDp3cmFwO2FsaWduLWl0ZW1zOmZsZXgtZW5kO2dhcDoxMnB4O1wiPlxuICAgICAgICAgICAgPGRpdiBzdHlsZT1cImZsZXg6MTttaW4td2lkdGg6MjIwcHg7XCI+XG4gICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cImRpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjZweDtcIj48c3BhbiBkYXRhLWljbz1cImJveFwiPjwvc3Bhbj5cdTUxRkFcdTU1MkVcdTkwNTNcdTUxNzc8L2xhYmVsPlxuICAgICAgICAgICAgICA8c2VsZWN0IGlkPVwiaW5zdFwiIGNsYXNzPVwiaW5wdXRcIj48L3NlbGVjdD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT1cImZsZXg6MTttaW4td2lkdGg6MTIwcHg7XCI+XG4gICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cImRpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjZweDtcIj48c3BhbiBkYXRhLWljbz1cImNvaW5cIj48L3NwYW4+XHU0RUY3XHU2ODNDIChCQlx1NUUwMSk8L2xhYmVsPlxuICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJzcHJpY2VcIiBjbGFzcz1cImlucHV0XCIgdHlwZT1cIm51bWJlclwiIG1pbj1cIjFcIiB2YWx1ZT1cIjVcIi8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxidXR0b24gaWQ9XCJwbGFjZVNlbGxcIiBjbGFzcz1cImJ0biBidG4tc2VsbFwiIHN0eWxlPVwibWluLXdpZHRoOjEyMHB4O1wiPjxzcGFuIGRhdGEtaWNvPVwiYXJyb3ctcmlnaHRcIj48L3NwYW4+XHU0RTBCXHU1MzU2XHU1MzU1PC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBpZD1cImludmVudG9yeVwiIHN0eWxlPVwibWFyZ2luLXRvcDoxMnB4O2Rpc3BsYXk6ZmxleDtmbGV4LXdyYXA6d3JhcDtnYXA6OHB4O1wiPjwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZCBmYWRlLWluXCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiIHN0eWxlPVwianVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YWxpZ24taXRlbXM6Y2VudGVyO2dhcDoxMnB4O1wiPlxuICAgICAgICAgICAgPGgzIHN0eWxlPVwibWFyZ2luOjA7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6OHB4O1wiPjxzcGFuIGRhdGEtaWNvPVwibGlzdFwiPjwvc3Bhbj5cdThCQTJcdTUzNTVcdTdDM0Y8L2gzPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiIHN0eWxlPVwiZmxleC13cmFwOndyYXA7Z2FwOjhweDtcIj5cbiAgICAgICAgICAgICAgPHNlbGVjdCBpZD1cInFfdHBsXCIgY2xhc3M9XCJpbnB1dFwiIHN0eWxlPVwid2lkdGg6MTgwcHg7XCI+PC9zZWxlY3Q+XG4gICAgICAgICAgICAgIDxzZWxlY3QgaWQ9XCJxX3R5cGVcIiBjbGFzcz1cImlucHV0XCIgc3R5bGU9XCJ3aWR0aDoxMjBweDtcIj5cbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiYnV5XCI+XHU0RTcwXHU1MzU1PC9vcHRpb24+XG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInNlbGxcIj5cdTUzNTZcdTUzNTU8L29wdGlvbj5cbiAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cInJvdyBwaWxsXCIgc3R5bGU9XCJhbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjZweDtcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBkYXRhLWljbz1cInVzZXJcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgPGlucHV0IGlkPVwibXlcIiB0eXBlPVwiY2hlY2tib3hcIi8+IFx1NTNFQVx1NzcwQlx1NjIxMVx1NzY4NFxuICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwicmVmcmVzaFwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCIgc3R5bGU9XCJtaW4td2lkdGg6OTZweDtcIj48c3BhbiBkYXRhLWljbz1cInJlZnJlc2hcIj48L3NwYW4+XHU1MjM3XHU2NUIwPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGlkPVwiYm9va1wiIHN0eWxlPVwibWFyZ2luLXRvcDoxMnB4O2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjhweDtcIj48L2Rpdj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQgZmFkZS1pblwiIGlkPVwibG9nc1wiIHN0eWxlPVwib3BhY2l0eTouOTtmb250LWZhbWlseTptb25vc3BhY2U7bWluLWhlaWdodDoyNHB4O1wiPjwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgYCk7XG5cbiAgICByb290LmFwcGVuZENoaWxkKG5hdik7XG4gICAgcm9vdC5hcHBlbmRDaGlsZChiYXIucm9vdCk7XG4gICAgcm9vdC5hcHBlbmRDaGlsZCh2aWV3KTtcblxuICAgIGNvbnN0IHRva2VuID0gTmV0d29ya01hbmFnZXIuSS5nZXRUb2tlbigpO1xuICAgIGlmICh0b2tlbikgUmVhbHRpbWVDbGllbnQuSS5jb25uZWN0KHRva2VuKTtcbiAgICBjb25zdCBtZSA9IEdhbWVNYW5hZ2VyLkkuZ2V0UHJvZmlsZSgpO1xuXG4gICAgY29uc3QgYm9vayA9IHFzKHZpZXcsICcjYm9vaycpO1xuICAgIGNvbnN0IGxvZ3MgPSBxczxIVE1MRWxlbWVudD4odmlldywgJyNsb2dzJyk7XG4gICAgY29uc3QgYnV5VHBsID0gcXM8SFRNTFNlbGVjdEVsZW1lbnQ+KHZpZXcsICcjdHBsJyk7XG4gICAgY29uc3QgYnV5UHJpY2UgPSBxczxIVE1MSW5wdXRFbGVtZW50Pih2aWV3LCAnI3ByaWNlJyk7XG4gICAgY29uc3QgYnV5QW1vdW50ID0gcXM8SFRNTElucHV0RWxlbWVudD4odmlldywgJyNhbW91bnQnKTtcbiAgICBjb25zdCBwbGFjZUJ1eSA9IHFzPEhUTUxCdXR0b25FbGVtZW50Pih2aWV3LCAnI3BsYWNlQnV5Jyk7XG4gICAgY29uc3Qgc2VsbEluc3QgPSBxczxIVE1MU2VsZWN0RWxlbWVudD4odmlldywgJyNpbnN0Jyk7XG4gICAgY29uc3Qgc2VsbFByaWNlID0gcXM8SFRNTElucHV0RWxlbWVudD4odmlldywgJyNzcHJpY2UnKTtcbiAgICBjb25zdCBwbGFjZVNlbGwgPSBxczxIVE1MQnV0dG9uRWxlbWVudD4odmlldywgJyNwbGFjZVNlbGwnKTtcbiAgICBjb25zdCBpbnZCb3ggPSBxczxIVE1MRWxlbWVudD4odmlldywgJyNpbnZlbnRvcnknKTtcbiAgICBjb25zdCBxdWVyeVRwbCA9IHFzPEhUTUxTZWxlY3RFbGVtZW50Pih2aWV3LCAnI3FfdHBsJyk7XG4gICAgY29uc3QgcXVlcnlUeXBlID0gcXM8SFRNTFNlbGVjdEVsZW1lbnQ+KHZpZXcsICcjcV90eXBlJyk7XG4gICAgY29uc3QgcXVlcnlNaW5lT25seSA9IHFzPEhUTUxJbnB1dEVsZW1lbnQ+KHZpZXcsICcjbXknKTtcbiAgICBjb25zdCBtaW5lT25seUxhYmVsID0gdmlldy5xdWVyeVNlbGVjdG9yKCdsYWJlbC5yb3cucGlsbCcpIGFzIEhUTUxMYWJlbEVsZW1lbnQgfCBudWxsO1xuICAgIGNvbnN0IHJlZnJlc2hCdG4gPSBxczxIVE1MQnV0dG9uRWxlbWVudD4odmlldywgJyNyZWZyZXNoJyk7XG5cbiAgICBjb25zdCBtb3VudEljb25zID0gKHJvb3RFbDogRWxlbWVudCkgPT4ge1xuICAgICAgcm9vdEVsLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWljb10nKVxuICAgICAgICAuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgICBjb25zdCBuYW1lID0gKGVsIGFzIEhUTUxFbGVtZW50KS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWNvJykgYXMgYW55O1xuICAgICAgICAgIHRyeSB7IGVsLmFwcGVuZENoaWxkKHJlbmRlckljb24obmFtZSwgeyBzaXplOiAyMCB9KSk7IH0gY2F0Y2gge31cbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBtb3VudEljb25zKHZpZXcpO1xuICAgIFxuICAgIC8vIFx1NkRGQlx1NTJBMFx1OTFEMVx1NUUwMVx1NTJBOFx1NzUzQlxuICAgIGNvbnN0IGNvaW5TbG90ID0gdmlldy5xdWVyeVNlbGVjdG9yKCcjY29pbkFuaW0nKTtcbiAgICBpZiAoY29pblNsb3QpIHtcbiAgICAgIGNvaW5TbG90LmFwcGVuZENoaWxkKGNyZWF0ZVNwaW5uaW5nQ29pbigpKTtcbiAgICB9XG5cbiAgICBsZXQgcHJldklkcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGxldCByZWZyZXNoaW5nID0gZmFsc2U7XG5cbiAgICBjb25zdCBsb2cgPSAobWVzc2FnZTogc3RyaW5nKSA9PiB7XG4gICAgICBsb2dzLnRleHRDb250ZW50ID0gbWVzc2FnZTtcbiAgICB9O1xuXG4gICAgY29uc3QgcmVuZGVyVGVtcGxhdGVPcHRpb25zID0gKCkgPT4ge1xuICAgICAgYnV5VHBsLmlubmVySFRNTCA9ICcnO1xuICAgICAgcXVlcnlUcGwuaW5uZXJIVE1MID0gJyc7XG4gICAgICBjb25zdCBwbGFjZWhvbGRlciA9IGh0bWwoJzxvcHRpb24gdmFsdWU9XCJcIj5cdTkwMDlcdTYyRTlcdTZBMjFcdTY3N0Y8L29wdGlvbj4nKSBhcyBIVE1MT3B0aW9uRWxlbWVudDtcbiAgICAgIGJ1eVRwbC5hcHBlbmRDaGlsZChwbGFjZWhvbGRlcik7XG4gICAgICBjb25zdCBxUGxhY2Vob2xkZXIgPSBodG1sKCc8b3B0aW9uIHZhbHVlPVwiXCI+XHU1MTY4XHU5MEU4XHU2QTIxXHU2NzdGPC9vcHRpb24+JykgYXMgSFRNTE9wdGlvbkVsZW1lbnQ7XG4gICAgICBxdWVyeVRwbC5hcHBlbmRDaGlsZChxUGxhY2Vob2xkZXIpO1xuICAgICAgZm9yIChjb25zdCB0cGwgb2YgdGhpcy50ZW1wbGF0ZXMpIHtcbiAgICAgICAgY29uc3Qgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICAgIG9wdGlvbi52YWx1ZSA9IHRwbC5pZDtcbiAgICAgICAgb3B0aW9uLnRleHRDb250ZW50ID0gdHBsLm5hbWUgPyBgJHt0cGwubmFtZX0gKCR7dHBsLmlkfSlgIDogdHBsLmlkO1xuICAgICAgICBidXlUcGwuYXBwZW5kQ2hpbGQob3B0aW9uKTtcbiAgICAgICAgY29uc3QgcU9wdGlvbiA9IG9wdGlvbi5jbG9uZU5vZGUodHJ1ZSkgYXMgSFRNTE9wdGlvbkVsZW1lbnQ7XG4gICAgICAgIHF1ZXJ5VHBsLmFwcGVuZENoaWxkKHFPcHRpb24pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCByZW5kZXJJbnZlbnRvcnkgPSAoKSA9PiB7XG4gICAgICBzZWxsSW5zdC5pbm5lckhUTUwgPSAnJztcbiAgICAgIGludkJveC5pbm5lckhUTUwgPSAnJztcbiAgICAgIGNvbnN0IGRlZmF1bHRPcHRpb24gPSBodG1sKCc8b3B0aW9uIHZhbHVlPVwiXCI+XHU5MDA5XHU2MkU5XHU1M0VGXHU1MUZBXHU1NTJFXHU3Njg0XHU5MDUzXHU1MTc3PC9vcHRpb24+JykgYXMgSFRNTE9wdGlvbkVsZW1lbnQ7XG4gICAgICBzZWxsSW5zdC5hcHBlbmRDaGlsZChkZWZhdWx0T3B0aW9uKTtcbiAgICAgIGNvbnN0IGF2YWlsYWJsZSA9IHRoaXMuaW52ZW50b3J5LmZpbHRlcigoaXRlbSkgPT4gIWl0ZW0uaXNFcXVpcHBlZCAmJiAhaXRlbS5pc0xpc3RlZCk7XG4gICAgICBpZiAoIWF2YWlsYWJsZS5sZW5ndGgpIHtcbiAgICAgICAgaW52Qm94LnRleHRDb250ZW50ID0gJ1x1NjY4Mlx1NjVFMFx1NTNFRlx1NTFGQVx1NTUyRVx1NzY4NFx1OTA1M1x1NTE3N1x1RkYwOFx1OTcwMFx1NTE0OFx1NTcyOFx1NEVEM1x1NUU5M1x1NTM3OFx1NEUwQlx1ODhDNVx1NTkwN1x1RkYwOSc7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBhdmFpbGFibGUpIHtcbiAgICAgICAgY29uc3Qgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICAgIG9wdGlvbi52YWx1ZSA9IGl0ZW0uaWQ7XG4gICAgICAgIG9wdGlvbi50ZXh0Q29udGVudCA9IGAke2l0ZW0uaWR9IFx1MDBCNyAke2l0ZW0udGVtcGxhdGVJZH0gXHUwMEI3IEx2LiR7aXRlbS5sZXZlbH1gO1xuICAgICAgICBzZWxsSW5zdC5hcHBlbmRDaGlsZChvcHRpb24pO1xuXG4gICAgICAgIGNvbnN0IGNoaXAgPSBodG1sKGA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1naG9zdFwiIHN0eWxlPVwiZmxleDp1bnNldDtwYWRkaW5nOjZweCAxMHB4O1wiIGRhdGEtaWQ9XCIke2l0ZW0uaWR9XCI+JHtpdGVtLmlkfSAoJHtpdGVtLnRlbXBsYXRlSWR9KTwvYnV0dG9uPmApIGFzIEhUTUxCdXR0b25FbGVtZW50O1xuICAgICAgICBjaGlwLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICAgICAgc2VsbEluc3QudmFsdWUgPSBpdGVtLmlkO1xuICAgICAgICAgIGxvZyhgXHU1REYyXHU5MDA5XHU2MkU5XHU1MUZBXHU1NTJFXHU5MDUzXHU1MTc3ICR7aXRlbS5pZH1gKTtcbiAgICAgICAgfTtcbiAgICAgICAgaW52Qm94LmFwcGVuZENoaWxkKGNoaXApO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCBsb2FkTWV0YWRhdGEgPSBhc3luYyAoKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBbdHBscywgaXRlbXNdID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICAgIE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IHRlbXBsYXRlczogYW55W10gfT4oJy9pdGVtcy90ZW1wbGF0ZXMnKSxcbiAgICAgICAgICBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyBpdGVtczogYW55W10gfT4oJy9pdGVtcycpLFxuICAgICAgICBdKTtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXMgPSB0cGxzLnRlbXBsYXRlcyB8fCBbXTtcbiAgICAgICAgdGhpcy5pbnZlbnRvcnkgPSBpdGVtcy5pdGVtcyB8fCBbXTtcbiAgICAgICAgcmVuZGVyVGVtcGxhdGVPcHRpb25zKCk7XG4gICAgICAgIHJlbmRlckludmVudG9yeSgpO1xuICAgICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgIGxvZyhlPy5tZXNzYWdlIHx8ICdcdTUyQTBcdThGN0RcdTZBMjFcdTY3N0YvXHU0RUQzXHU1RTkzXHU1OTMxXHU4RDI1Jyk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IHJlZnJlc2ggPSBhc3luYyAob3B0czogeyBxdWlldD86IGJvb2xlYW4gfSA9IHt9KSA9PiB7XG4gICAgICBpZiAocmVmcmVzaGluZykgcmV0dXJuO1xuICAgICAgcmVmcmVzaGluZyA9IHRydWU7XG4gICAgICBpZiAoIW9wdHMucXVpZXQpIHsgcmVmcmVzaEJ0bi5pbm5lckhUTUwgPSAnPHNwYW4gZGF0YS1pY289XCJyZWZyZXNoXCI+PC9zcGFuPlx1NTIzN1x1NjVCMFx1NEUyRFx1MjAyNic7IG1vdW50SWNvbnMocmVmcmVzaEJ0bik7IH1cbiAgICAgIHJlZnJlc2hCdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgdHBsSWQgPSBxdWVyeVRwbC52YWx1ZTtcbiAgICAgICAgY29uc3QgdHlwZSA9IHF1ZXJ5VHlwZS52YWx1ZSBhcyAnYnV5JyB8ICdzZWxsJztcbiAgICAgICAgY29uc3QgbWluZU9ubHkgPSBxdWVyeU1pbmVPbmx5LmNoZWNrZWQ7XG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoKTtcbiAgICAgICAgcGFyYW1zLnNldCgndHlwZScsIHR5cGUpO1xuICAgICAgICBwYXJhbXMuc2V0KCdpdGVtX3RlbXBsYXRlX2lkJywgdHBsSWQgfHwgJycpO1xuICAgICAgICBpZiAoIW9wdHMucXVpZXQpIHtcbiAgICAgICAgICBib29rLmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSBib29rLmFwcGVuZENoaWxkKGh0bWwoJzxkaXYgY2xhc3M9XCJza2VsZXRvblwiPjwvZGl2PicpKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgb3JkZXJzOiBPcmRlcltdIH0+KGAvZXhjaGFuZ2Uvb3JkZXJzPyR7cGFyYW1zLnRvU3RyaW5nKCl9YCk7XG4gICAgICAgIGNvbnN0IG5ld0lkcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgICAgICBib29rLmlubmVySFRNTCA9ICcnO1xuICAgICAgICBjb25zdCBvcmRlcnMgPSBkYXRhLm9yZGVycyB8fCBbXTtcbiAgICAgICAgaWYgKCFvcmRlcnMubGVuZ3RoKSB7XG4gICAgICAgICAgYm9vay5hcHBlbmRDaGlsZChodG1sKCc8ZGl2IHN0eWxlPVwib3BhY2l0eTouODt0ZXh0LWFsaWduOmNlbnRlcjtcIj5cdTY2ODJcdTY1RTBcdThCQTJcdTUzNTU8L2Rpdj4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBvcmRlciBvZiBvcmRlcnMpIHtcbiAgICAgICAgICBpZiAobWluZU9ubHkgJiYgbWUgJiYgb3JkZXIudXNlcklkICE9PSBtZS5pZCkgY29udGludWU7XG4gICAgICAgICAgbmV3SWRzLmFkZChvcmRlci5pZCk7XG4gICAgICAgICAgY29uc3QgaXNNaW5lID0gbWUgJiYgb3JkZXIudXNlcklkID09PSBtZS5pZDtcbiAgICAgICAgICBjb25zdCBrbGFzcyA9IGBsaXN0LWl0ZW0gJHtvcmRlci50eXBlID09PSAnYnV5JyA/ICdsaXN0LWl0ZW0tLWJ1eScgOiAnbGlzdC1pdGVtLS1zZWxsJ31gO1xuICAgICAgICAgIGNvbnN0IHJvdyA9IGh0bWwoYFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIiR7a2xhc3N9XCI+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDoycHg7XCI+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgIDxzdHJvbmc+JHtvcmRlci50eXBlID09PSAnYnV5JyA/ICdcdTRFNzBcdTUxNjUnIDogJ1x1NTM1Nlx1NTFGQSd9PC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgICAke29yZGVyLml0ZW1UZW1wbGF0ZUlkIHx8ICcnfVxuICAgICAgICAgICAgICAgICAgJHtpc01pbmUgPyAnPHNwYW4gY2xhc3M9XCJwaWxsXCI+XHU2MjExXHU3Njg0PC9zcGFuPicgOiAnJ31cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwib3BhY2l0eTouODU7XCI+XG4gICAgICAgICAgICAgICAgICBcdTRFRjdcdTY4M0M6ICR7b3JkZXIucHJpY2V9IFx1MDBCNyBcdTY1NzBcdTkxQ0Y6ICR7b3JkZXIuYW1vdW50fVxuICAgICAgICAgICAgICAgICAgJHtvcmRlci5pdGVtSW5zdGFuY2VJZCA/IGA8c3BhbiBjbGFzcz1cInBpbGxcIj4ke29yZGVyLml0ZW1JbnN0YW5jZUlkfTwvc3Bhbj5gIDogJyd9XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInBpbGxcIj4ke29yZGVyLmlkfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgJHtpc01pbmUgPyBgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tZ2hvc3RcIiBkYXRhLWlkPVwiJHtvcmRlci5pZH1cIj48c3BhbiBkYXRhLWljbz1cInRyYXNoXCI+PC9zcGFuPlx1NjRBNFx1NTM1NTwvYnV0dG9uPmAgOiAnJ31cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICBgKTtcbiAgICAgICAgICBtb3VudEljb25zKHJvdyk7XG4gICAgICAgICAgaWYgKCFwcmV2SWRzLmhhcyhvcmRlci5pZCkpIHJvdy5jbGFzc0xpc3QuYWRkKCdmbGFzaCcpO1xuICAgICAgICAgIHJvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIChldikgPT4ge1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gZXYudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuICAgICAgICAgICAgY29uc3QgaWQgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWlkJyk7XG4gICAgICAgICAgICBpZiAoIWlkKSByZXR1cm47XG4gICAgICAgICAgICBjb25zdCBidG4gPSB0YXJnZXQuY2xvc2VzdCgnYnV0dG9uJykgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XG4gICAgICAgICAgICBpZiAoIWJ0bikgcmV0dXJuO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBidG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICBjb25zdCBvcmlnaW5hbEhUTUwgPSBidG4uaW5uZXJIVE1MO1xuICAgICAgICAgICAgICBidG4uaW5uZXJIVE1MID0gJzxzcGFuIGRhdGEtaWNvPVwidHJhc2hcIj48L3NwYW4+XHU2NEE0XHU1MzU1XHU0RTJEXHUyMDI2JztcbiAgICAgICAgICAgICAgbW91bnRJY29ucyhidG4pO1xuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0KGAvZXhjaGFuZ2Uvb3JkZXJzLyR7aWR9YCwgeyBtZXRob2Q6ICdERUxFVEUnIH0pO1xuICAgICAgICAgICAgICBzaG93VG9hc3QoJ1x1NjRBNFx1NTM1NVx1NjIxMFx1NTI5RicsICdzdWNjZXNzJyk7XG4gICAgICAgICAgICAgIGF3YWl0IHJlZnJlc2goKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgICAgICAgICBzaG93VG9hc3QoZT8ubWVzc2FnZSB8fCAnXHU2NEE0XHU1MzU1XHU1OTMxXHU4RDI1JywgJ2Vycm9yJyk7XG4gICAgICAgICAgICAgIC8vIFx1NTkzMVx1OEQyNVx1NjVGNlx1OTcwMFx1ODk4MVx1NjA2Mlx1NTkwRFx1NjMwOVx1OTRBRVx1RkYwOFx1NTZFMFx1NEUzQVx1NEUwRFx1NEYxQVx1NTIzN1x1NjVCMFx1NTIxN1x1ODg2OFx1RkYwOVxuICAgICAgICAgICAgICBhd2FpdCByZWZyZXNoKCk7XG4gICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICBidG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBib29rLmFwcGVuZENoaWxkKHJvdyk7XG4gICAgICAgIH1cbiAgICAgICAgcHJldklkcyA9IG5ld0lkcztcbiAgICAgICAgaWYgKCFib29rLmNoaWxkRWxlbWVudENvdW50KSB7XG4gICAgICAgICAgYm9vay5hcHBlbmRDaGlsZChodG1sKCc8ZGl2IHN0eWxlPVwib3BhY2l0eTouODt0ZXh0LWFsaWduOmNlbnRlcjtcIj5cdTY2ODJcdTY1RTBcdTdCMjZcdTU0MDhcdTY3NjFcdTRFRjZcdTc2ODRcdThCQTJcdTUzNTU8L2Rpdj4nKSk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgICBsb2coZT8ubWVzc2FnZSB8fCAnXHU1MjM3XHU2NUIwXHU4QkEyXHU1MzU1XHU1OTMxXHU4RDI1Jyk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICByZWZyZXNoaW5nID0gZmFsc2U7XG4gICAgICAgIHJlZnJlc2hCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgcmVmcmVzaEJ0bi5pbm5lckhUTUwgPSAnPHNwYW4gZGF0YS1pY289XCJyZWZyZXNoXCI+PC9zcGFuPlx1NTIzN1x1NjVCMCc7XG4gICAgICAgIG1vdW50SWNvbnMocmVmcmVzaEJ0bik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBsYWNlQnV5Lm9uY2xpY2sgPSBhc3luYyAoKSA9PiB7XG4gICAgICBpZiAocGxhY2VCdXkuZGlzYWJsZWQpIHJldHVybjsgLy8gXHU5NjMyXHU2QjYyXHU5MUNEXHU1OTBEXHU3MEI5XHU1MUZCXG4gICAgICBcbiAgICAgIGNvbnN0IHRwbElkID0gYnV5VHBsLnZhbHVlLnRyaW0oKTtcbiAgICAgIGNvbnN0IHByaWNlID0gTnVtYmVyKGJ1eVByaWNlLnZhbHVlKTtcbiAgICAgIGNvbnN0IGFtb3VudCA9IE51bWJlcihidXlBbW91bnQudmFsdWUpO1xuICAgICAgaWYgKCF0cGxJZCkge1xuICAgICAgICBzaG93VG9hc3QoJ1x1OEJGN1x1OTAwOVx1NjJFOVx1OEQyRFx1NEU3MFx1NzY4NFx1NkEyMVx1Njc3RicsICd3YXJuJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChpc05hTihwcmljZSkgfHwgaXNOYU4oYW1vdW50KSB8fCBwcmljZSA8PSAwIHx8IGFtb3VudCA8PSAwIHx8ICFOdW1iZXIuaXNJbnRlZ2VyKGFtb3VudCkpIHtcbiAgICAgICAgc2hvd1RvYXN0KCdcdThCRjdcdThGOTNcdTUxNjVcdTY3MDlcdTY1NDhcdTc2ODRcdTRFRjdcdTY4M0NcdTRFMEVcdTY1NzBcdTkxQ0ZcdUZGMDhcdTY1NzBcdTkxQ0ZcdTVGQzVcdTk4N0JcdTRFM0FcdTY1NzRcdTY1NzBcdUZGMDknLCAnd2FybicpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAocHJpY2UgPiAxMDAwMDAwIHx8IGFtb3VudCA+IDEwMDAwKSB7XG4gICAgICAgIHNob3dUb2FzdCgnXHU2NTcwXHU1MDNDXHU4RkM3XHU1OTI3XHVGRjBDXHU4QkY3XHU4RjkzXHU1MTY1XHU1NDA4XHU3NDA2XHU3Njg0XHU0RUY3XHU2ODNDXHU1NDhDXHU2NTcwXHU5MUNGJywgJ3dhcm4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcGxhY2VCdXkuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgY29uc3Qgb3JpZ2luYWxCdXlIVE1MID0gcGxhY2VCdXkuaW5uZXJIVE1MO1xuICAgICAgcGxhY2VCdXkuaW5uZXJIVE1MID0gJzxzcGFuIGRhdGEtaWNvPVwiYXJyb3ctcmlnaHRcIj48L3NwYW4+XHU2M0QwXHU0RUE0XHU0RTJEXHUyMDI2JztcbiAgICAgIG1vdW50SWNvbnMocGxhY2VCdXkpO1xuICAgICAgXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyBpZDogc3RyaW5nIH0+KCcvZXhjaGFuZ2Uvb3JkZXJzJywge1xuICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgdHlwZTogJ2J1eScsIGl0ZW1fdGVtcGxhdGVfaWQ6IHRwbElkLCBwcmljZSwgYW1vdW50IH0pLFxuICAgICAgICB9KTtcbiAgICAgICAgc2hvd1RvYXN0KGBcdTRFNzBcdTUzNTVcdTVERjJcdTYzRDBcdTRFQTQgKCMke3Jlcy5pZH0pYCwgJ3N1Y2Nlc3MnKTtcbiAgICAgICAgbG9nKGBcdTRFNzBcdTUzNTVcdTYyMTBcdTUyOUY6ICR7cmVzLmlkfWApO1xuICAgICAgICBhd2FpdCBiYXIudXBkYXRlKCk7XG4gICAgICAgIGF3YWl0IHJlZnJlc2goKTtcbiAgICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgICBzaG93VG9hc3QoZT8ubWVzc2FnZSB8fCAnXHU0RTcwXHU1MzU1XHU2M0QwXHU0RUE0XHU1OTMxXHU4RDI1JywgJ2Vycm9yJyk7XG4gICAgICAgIGxvZyhlPy5tZXNzYWdlIHx8ICdcdTRFNzBcdTUzNTVcdTYzRDBcdTRFQTRcdTU5MzFcdThEMjUnKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHBsYWNlQnV5LmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIHBsYWNlQnV5LmlubmVySFRNTCA9IG9yaWdpbmFsQnV5SFRNTDtcbiAgICAgICAgbW91bnRJY29ucyhwbGFjZUJ1eSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBsYWNlU2VsbC5vbmNsaWNrID0gYXN5bmMgKCkgPT4ge1xuICAgICAgaWYgKHBsYWNlU2VsbC5kaXNhYmxlZCkgcmV0dXJuOyAvLyBcdTk2MzJcdTZCNjJcdTkxQ0RcdTU5MERcdTcwQjlcdTUxRkJcbiAgICAgIFxuICAgICAgY29uc3QgaW5zdElkID0gc2VsbEluc3QudmFsdWUudHJpbSgpO1xuICAgICAgY29uc3QgcHJpY2UgPSBOdW1iZXIoc2VsbFByaWNlLnZhbHVlKTtcbiAgICAgIGlmICghaW5zdElkKSB7XG4gICAgICAgIHNob3dUb2FzdCgnXHU4QkY3XHU5MDA5XHU2MkU5XHU4OTgxXHU1MUZBXHU1NTJFXHU3Njg0XHU5MDUzXHU1MTc3JywgJ3dhcm4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGlzTmFOKHByaWNlKSB8fCBwcmljZSA8PSAwKSB7XG4gICAgICAgIHNob3dUb2FzdCgnXHU4QkY3XHU4RjkzXHU1MTY1XHU2NzA5XHU2NTQ4XHU3Njg0XHU0RUY3XHU2ODNDJywgJ3dhcm4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHByaWNlID4gMTAwMDAwMCkge1xuICAgICAgICBzaG93VG9hc3QoJ1x1NEVGN1x1NjgzQ1x1OEZDN1x1OUFEOFx1RkYwQ1x1OEJGN1x1OEY5M1x1NTE2NVx1NTQwOFx1NzQwNlx1NzY4NFx1NEVGN1x1NjgzQycsICd3YXJuJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHBsYWNlU2VsbC5kaXNhYmxlZCA9IHRydWU7XG4gICAgICBjb25zdCBvcmlnaW5hbFNlbGxIVE1MID0gcGxhY2VTZWxsLmlubmVySFRNTDtcbiAgICAgIHBsYWNlU2VsbC5pbm5lckhUTUwgPSAnPHNwYW4gZGF0YS1pY289XCJhcnJvdy1yaWdodFwiPjwvc3Bhbj5cdTYzRDBcdTRFQTRcdTRFMkRcdTIwMjYnO1xuICAgICAgbW91bnRJY29ucyhwbGFjZVNlbGwpO1xuICAgICAgXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyBpZDogc3RyaW5nIH0+KCcvZXhjaGFuZ2Uvb3JkZXJzJywge1xuICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgdHlwZTogJ3NlbGwnLCBpdGVtX2luc3RhbmNlX2lkOiBpbnN0SWQsIHByaWNlIH0pLFxuICAgICAgICB9KTtcbiAgICAgICAgc2hvd1RvYXN0KGBcdTUzNTZcdTUzNTVcdTVERjJcdTYzRDBcdTRFQTQgKCMke3Jlcy5pZH0pYCwgJ3N1Y2Nlc3MnKTtcbiAgICAgICAgbG9nKGBcdTUzNTZcdTUzNTVcdTYyMTBcdTUyOUY6ICR7cmVzLmlkfWApO1xuICAgICAgICBhd2FpdCBiYXIudXBkYXRlKCk7XG4gICAgICAgIGF3YWl0IGxvYWRNZXRhZGF0YSgpO1xuICAgICAgICBhd2FpdCByZWZyZXNoKCk7XG4gICAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgICAgc2hvd1RvYXN0KGU/Lm1lc3NhZ2UgfHwgJ1x1NTM1Nlx1NTM1NVx1NjNEMFx1NEVBNFx1NTkzMVx1OEQyNScsICdlcnJvcicpO1xuICAgICAgICBsb2coZT8ubWVzc2FnZSB8fCAnXHU1MzU2XHU1MzU1XHU2M0QwXHU0RUE0XHU1OTMxXHU4RDI1Jyk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBwbGFjZVNlbGwuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgcGxhY2VTZWxsLmlubmVySFRNTCA9IG9yaWdpbmFsU2VsbEhUTUw7XG4gICAgICAgIG1vdW50SWNvbnMocGxhY2VTZWxsKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmVmcmVzaEJ0bi5vbmNsaWNrID0gKCkgPT4gcmVmcmVzaCgpO1xuICAgIHF1ZXJ5VHBsLm9uY2hhbmdlID0gKCkgPT4gcmVmcmVzaCgpO1xuICAgIHF1ZXJ5VHlwZS5vbmNoYW5nZSA9ICgpID0+IHJlZnJlc2goKTtcbiAgICBxdWVyeU1pbmVPbmx5Lm9uY2hhbmdlID0gKCkgPT4geyBpZiAobWluZU9ubHlMYWJlbCkgbWluZU9ubHlMYWJlbC5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnLCBxdWVyeU1pbmVPbmx5LmNoZWNrZWQpOyByZWZyZXNoKCk7IH07XG4gICAgaWYgKG1pbmVPbmx5TGFiZWwpIG1pbmVPbmx5TGFiZWwuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJywgcXVlcnlNaW5lT25seS5jaGVja2VkKTtcblxuICAgIGF3YWl0IFByb21pc2UuYWxsKFtiYXIudXBkYXRlKCksIGxvYWRNZXRhZGF0YSgpXSk7XG4gICAgYXdhaXQgcmVmcmVzaCh7IHF1aWV0OiB0cnVlIH0pO1xuICAgIHRoaXMucmVmcmVzaFRpbWVyID0gd2luZG93LnNldEludGVydmFsKCgpID0+IHtcbiAgICAgIHJlZnJlc2goeyBxdWlldDogdHJ1ZSB9KS5jYXRjaCgoKSA9PiB7fSk7XG4gICAgfSwgMTAwMDApO1xuICB9XG5cbiAgcHJpdmF0ZSBjbGVhclRpbWVyKCkge1xuICAgIGlmICh0aGlzLnJlZnJlc2hUaW1lciAhPT0gbnVsbCkge1xuICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5yZWZyZXNoVGltZXIpO1xuICAgICAgdGhpcy5yZWZyZXNoVGltZXIgPSBudWxsO1xuICAgIH1cbiAgfVxufVxuIiwgImltcG9ydCB7IE5ldHdvcmtNYW5hZ2VyIH0gZnJvbSAnLi4vY29yZS9OZXR3b3JrTWFuYWdlcic7XG5pbXBvcnQgeyBodG1sLCBxcyB9IGZyb20gJy4uL3V0aWxzL2RvbSc7XG5pbXBvcnQgeyByZW5kZXJOYXYgfSBmcm9tICcuLi9jb21wb25lbnRzL05hdic7XG5pbXBvcnQgeyBSZWFsdGltZUNsaWVudCB9IGZyb20gJy4uL2NvcmUvUmVhbHRpbWVDbGllbnQnO1xuaW1wb3J0IHsgcmVuZGVyUmVzb3VyY2VCYXIgfSBmcm9tICcuLi9jb21wb25lbnRzL1Jlc291cmNlQmFyJztcbmltcG9ydCB7IHJlbmRlckljb24gfSBmcm9tICcuLi9jb21wb25lbnRzL0ljb24nO1xuaW1wb3J0IHsgY3JlYXRlVHJvcGh5QW5pbWF0aW9uIH0gZnJvbSAnLi4vY29tcG9uZW50cy9BbmltYXRlZEljb25zJztcblxuZXhwb3J0IGNsYXNzIFJhbmtpbmdTY2VuZSB7XG4gIG1vdW50KHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgcm9vdC5pbm5lckhUTUwgPSAnJztcbiAgICByb290LmFwcGVuZENoaWxkKHJlbmRlck5hdigncmFua2luZycpKTtcbiAgICBjb25zdCBiYXIgPSByZW5kZXJSZXNvdXJjZUJhcigpO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQoYmFyLnJvb3QpO1xuXG4gICAgY29uc3QgdmlldyA9IGh0bWwoYFxuICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lciBncmlkLTJcIiBzdHlsZT1cImNvbG9yOiNmZmY7XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkIGZhZGUtaW5cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCIgc3R5bGU9XCJqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjthbGlnbi1pdGVtczpjZW50ZXI7XCI+XG4gICAgICAgICAgICA8aDMgc3R5bGU9XCJtYXJnaW46MDtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo4cHg7XCI+PHNwYW4gZGF0YS1pY289XCJ0cm9waHlcIj48L3NwYW4+XHU2MzkyXHU4ODRDXHU2OTlDPC9oMz5cbiAgICAgICAgICAgIDxidXR0b24gaWQ9XCJyZWZyZXNoXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIj48c3BhbiBkYXRhLWljbz1cInJlZnJlc2hcIj48L3NwYW4+XHU1MjM3XHU2NUIwPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBpZD1cIm1lXCIgc3R5bGU9XCJtYXJnaW4tdG9wOjhweDtvcGFjaXR5Oi45NTtcIj48L2Rpdj5cbiAgICAgICAgICA8ZGl2IGlkPVwibGlzdFwiIHN0eWxlPVwibWFyZ2luLXRvcDoxMnB4O2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjZweDtcIj48L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICBgKTtcbiAgICByb290LmFwcGVuZENoaWxkKHZpZXcpO1xuXG4gICAgY29uc3QgdG9rZW4gPSBOZXR3b3JrTWFuYWdlci5JLmdldFRva2VuKCk7XG4gICAgaWYgKHRva2VuKSBSZWFsdGltZUNsaWVudC5JLmNvbm5lY3QodG9rZW4pO1xuXG4gICAgY29uc3QgbWVCb3ggPSBxcyh2aWV3LCAnI21lJyk7XG4gICAgY29uc3QgbGlzdCA9IHFzKHZpZXcsICcjbGlzdCcpO1xuICAgIGNvbnN0IHJlZnJlc2hCdG4gPSBxczxIVE1MQnV0dG9uRWxlbWVudD4odmlldywgJyNyZWZyZXNoJyk7XG4gICAgY29uc3QgbW91bnRJY29ucyA9IChyb290RWw6IEVsZW1lbnQpID0+IHtcbiAgICAgIHJvb3RFbC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1pY29dJylcbiAgICAgICAgLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgICAgY29uc3QgbmFtZSA9IChlbCBhcyBIVE1MRWxlbWVudCkuZ2V0QXR0cmlidXRlKCdkYXRhLWljbycpIGFzIGFueTtcbiAgICAgICAgICB0cnkgeyBlbC5hcHBlbmRDaGlsZChyZW5kZXJJY29uKG5hbWUsIHsgc2l6ZTogMjAgfSkpOyB9IGNhdGNoIHt9XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgbW91bnRJY29ucyh2aWV3KTtcblxuICAgIGNvbnN0IGxvYWQgPSBhc3luYyAoKSA9PiB7XG4gICAgICByZWZyZXNoQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIHJlZnJlc2hCdG4uaW5uZXJIVE1MID0gJzxzcGFuIGRhdGEtaWNvPVwicmVmcmVzaFwiPjwvc3Bhbj5cdTUyMzdcdTY1QjBcdTRFMkRcdTIwMjYnO1xuICAgICAgbW91bnRJY29ucyhyZWZyZXNoQnRuKTtcbiAgICAgIGF3YWl0IGJhci51cGRhdGUoKTtcbiAgICAgIGxpc3QuaW5uZXJIVE1MID0gJyc7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykgbGlzdC5hcHBlbmRDaGlsZChodG1sKCc8ZGl2IGNsYXNzPVwic2tlbGV0b25cIj48L2Rpdj4nKSk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBtZSA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IHJhbms6IG51bWJlcjsgc2NvcmU6IG51bWJlciB9PignL3JhbmtpbmcvbWUnKTtcbiAgICAgICAgY29uc3QgdG9wID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgbGlzdDogYW55W10gfT4oJy9yYW5raW5nL3RvcD9uPTIwJyk7XG4gICAgICAgIG1lQm94LnRleHRDb250ZW50ID0gYFx1NjIxMVx1NzY4NFx1NTQwRFx1NkIyMVx1RkYxQSMke21lLnJhbmt9IFx1MDBCNyBcdTYwM0JcdTVGOTdcdTUyMDZcdUZGMUEke21lLnNjb3JlfWA7XG4gICAgICAgIGxpc3QuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIGZvciAoY29uc3QgZW50cnkgb2YgdG9wLmxpc3QpIHtcbiAgICAgICAgICBjb25zdCBtZWRhbCA9IGVudHJ5LnJhbmsgPT09IDEgPyAnXHVEODNFXHVERDQ3JyA6IGVudHJ5LnJhbmsgPT09IDIgPyAnXHVEODNFXHVERDQ4JyA6IGVudHJ5LnJhbmsgPT09IDMgPyAnXHVEODNFXHVERDQ5JyA6ICcnO1xuICAgICAgICAgIGNvbnN0IGNscyA9IGVudHJ5LnJhbmsgPD0gMyA/ICcgbGlzdC1pdGVtLS1idXknIDogJyc7XG4gICAgICAgICAgY29uc3Qgcm93ID0gaHRtbChgXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibGlzdC1pdGVtJHtjbHN9XCI+XG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPVwiZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6OHB4O1wiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGlkPVwidHJvcGh5JHtlbnRyeS5yYW5rfVwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAke21lZGFsfSAjJHtlbnRyeS5yYW5rfVxuICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPVwiZmxleDoxO29wYWNpdHk6Ljk7bWFyZ2luLWxlZnQ6MTJweDtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo2cHg7XCI+PHNwYW4gZGF0YS1pY289XCJ1c2VyXCI+PC9zcGFuPiR7ZW50cnkudXNlcklkfTwvc3Bhbj5cbiAgICAgICAgICAgICAgPHN0cm9uZz4ke2VudHJ5LnNjb3JlfTwvc3Ryb25nPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgYCk7XG4gICAgICAgICAgbW91bnRJY29ucyhyb3cpO1xuICAgICAgICAgIFxuICAgICAgICAgIC8vIFx1NEUzQVx1NTI0RDNcdTU0MERcdTZERkJcdTUyQTBcdTU5NTZcdTY3NkZcdTUyQThcdTc1M0JcbiAgICAgICAgICBpZiAoZW50cnkucmFuayA8PSAzKSB7XG4gICAgICAgICAgICBjb25zdCB0cm9waHlTbG90ID0gcm93LnF1ZXJ5U2VsZWN0b3IoYCN0cm9waHkke2VudHJ5LnJhbmt9YCk7XG4gICAgICAgICAgICBpZiAodHJvcGh5U2xvdCkge1xuICAgICAgICAgICAgICB0cm9waHlTbG90LmFwcGVuZENoaWxkKGNyZWF0ZVRyb3BoeUFuaW1hdGlvbihlbnRyeS5yYW5rKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQocm93KTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgIG1lQm94LnRleHRDb250ZW50ID0gZT8ubWVzc2FnZSB8fCAnXHU2MzkyXHU4ODRDXHU2OTlDXHU1MkEwXHU4RjdEXHU1OTMxXHU4RDI1JztcbiAgICAgICAgbGlzdC5pbm5lckhUTUwgPSAnPGRpdiBzdHlsZT1cIm9wYWNpdHk6Ljg7dGV4dC1hbGlnbjpjZW50ZXI7cGFkZGluZzoyMHB4O1wiPlx1NTJBMFx1OEY3RFx1NTkzMVx1OEQyNVx1RkYwQ1x1OEJGN1x1N0EwRFx1NTQwRVx1OTFDRFx1OEJENTwvZGl2Pic7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICByZWZyZXNoQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIHJlZnJlc2hCdG4uaW5uZXJIVE1MID0gJzxzcGFuIGRhdGEtaWNvPVwicmVmcmVzaFwiPjwvc3Bhbj5cdTUyMzdcdTY1QjAnO1xuICAgICAgICBtb3VudEljb25zKHJlZnJlc2hCdG4pO1xuICAgICAgfVxuICAgIH07XG4gICAgcmVmcmVzaEJ0bi5vbmNsaWNrID0gKCkgPT4gbG9hZCgpO1xuICAgIGxvYWQoKTtcbiAgfVxufVxuIiwgImxldCBpbmplY3RlZCA9IGZhbHNlO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGVuc3VyZUdsb2JhbFN0eWxlcygpIHtcclxuICBpZiAoaW5qZWN0ZWQpIHJldHVybjtcclxuICBjb25zdCBjc3MgPSBgOnJvb3R7LS1iZzojMGIxMDIwOy0tYmctMjojMGYxNTMwOy0tZmc6I2ZmZjstLW11dGVkOnJnYmEoMjU1LDI1NSwyNTUsLjc1KTstLWdyYWQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZywjN0IyQ0Y1LCMyQzg5RjUpOy0tcGFuZWwtZ3JhZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLHJnYmEoMTIzLDQ0LDI0NSwuMjUpLHJnYmEoNDQsMTM3LDI0NSwuMjUpKTstLWdsYXNzOmJsdXIoMTBweCk7LS1nbG93OjAgOHB4IDIwcHggcmdiYSgwLDAsMCwuMzUpLDAgMCAxMnB4IHJnYmEoMTIzLDQ0LDI0NSwuNyk7LS1yYWRpdXMtc206MTBweDstLXJhZGl1cy1tZDoxMnB4Oy0tcmFkaXVzLWxnOjE2cHg7LS1lYXNlOmN1YmljLWJlemllciguMjIsLjYxLC4zNiwxKTstLWR1cjouMjhzOy0tYnV5OiMyQzg5RjU7LS1zZWxsOiNFMzY0MTQ7LS1vazojMmVjMjdlOy0td2FybjojZjZjNDQ1Oy0tZGFuZ2VyOiNmZjVjNWM7LS1yYXJpdHktY29tbW9uOiM5YWEwYTY7LS1yYXJpdHktcmFyZTojNGZkNGY1Oy0tcmFyaXR5LWVwaWM6I2IyNmJmZjstLXJhcml0eS1sZWdlbmRhcnk6I2Y2YzQ0NTstLWNvbnRhaW5lci1tYXg6NzIwcHh9XHJcbmh0bWwsYm9keXtiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudCgxMjAwcHggNjAwcHggYXQgNTAlIC0xMCUsIHJnYmEoMTIzLDQ0LDI0NSwuMTIpLCB0cmFuc3BhcmVudCksdmFyKC0tYmcpO2NvbG9yOnZhcigtLWZnKTtmb250LWZhbWlseTpzeXN0ZW0tdWksLWFwcGxlLXN5c3RlbSxcIlNlZ29lIFVJXCIsXCJQaW5nRmFuZyBTQ1wiLFwiTWljcm9zb2Z0IFlhSGVpXCIsQXJpYWwsc2Fucy1zZXJpZn1cclxuaHRtbHtjb2xvci1zY2hlbWU6ZGFya31cclxuLmNvbnRhaW5lcntwYWRkaW5nOjAgMTJweH1cclxuLmNvbnRhaW5lcnttYXgtd2lkdGg6dmFyKC0tY29udGFpbmVyLW1heCk7bWFyZ2luOjEycHggYXV0b31cclxuLmNhcmR7cG9zaXRpb246cmVsYXRpdmU7Ym9yZGVyLXJhZGl1czp2YXIoLS1yYWRpdXMtbGcpO2JhY2tncm91bmQ6dmFyKC0tcGFuZWwtZ3JhZCk7YmFja2Ryb3AtZmlsdGVyOnZhcigtLWdsYXNzKTtib3gtc2hhZG93OnZhcigtLWdsb3cpO3BhZGRpbmc6MTJweDtvdmVyZmxvdzpoaWRkZW59XHJcbi5jYXJkOmhvdmVye2JveC1zaGFkb3c6dmFyKC0tZ2xvdyksMCAwIDI0cHggcmdiYSgxMjMsNDQsMjQ1LC4xNSl9XHJcbi8qIG5lb24gY29ybmVycyArIHNoZWVuICovXHJcbi5jYXJkOjpiZWZvcmV7Y29udGVudDpcIlwiO3Bvc2l0aW9uOmFic29sdXRlO2luc2V0OjA7Ym9yZGVyLXJhZGl1czppbmhlcml0O2JhY2tncm91bmQ6cmFkaWFsLWdyYWRpZW50KDQwJSAyNSUgYXQgMTAwJSAwLCByZ2JhKDEyMyw0NCwyNDUsLjE4KSwgdHJhbnNwYXJlbnQgNjAlKSxyYWRpYWwtZ3JhZGllbnQoMzUlIDI1JSBhdCAwIDEwMCUsIHJnYmEoNDQsMTM3LDI0NSwuMTYpLCB0cmFuc3BhcmVudCA2MCUpO3BvaW50ZXItZXZlbnRzOm5vbmV9XHJcbi5jYXJkOjphZnRlcntjb250ZW50OlwiXCI7cG9zaXRpb246YWJzb2x1dGU7bGVmdDotMzAlO3RvcDotMTIwJTt3aWR0aDo2MCU7aGVpZ2h0OjMwMCU7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTIwZGVnLHRyYW5zcGFyZW50LHJnYmEoMjU1LDI1NSwyNTUsLjE4KSx0cmFuc3BhcmVudCk7dHJhbnNmb3JtOnJvdGF0ZSg4ZGVnKTtvcGFjaXR5Oi4yNTthbmltYXRpb246Y2FyZC1zaGVlbiA5cyBsaW5lYXIgaW5maW5pdGU7cG9pbnRlci1ldmVudHM6bm9uZX1cclxuQGtleWZyYW1lcyBjYXJkLXNoZWVuezAle3RyYW5zZm9ybTp0cmFuc2xhdGVYKDApIHJvdGF0ZSg4ZGVnKX0xMDAle3RyYW5zZm9ybTp0cmFuc2xhdGVYKDE2MCUpIHJvdGF0ZSg4ZGVnKX19XHJcbi5yb3d7ZGlzcGxheTpmbGV4O2dhcDo4cHg7YWxpZ24taXRlbXM6Y2VudGVyfVxyXG4uY2FyZCBpbnB1dCwuY2FyZCBidXR0b257Ym94LXNpemluZzpib3JkZXItYm94O291dGxpbmU6bm9uZX1cclxuLmNhcmQgaW5wdXR7YmFja2dyb3VuZDpyZ2JhKDI1NSwyNTUsMjU1LC4wOCk7Ym9yZGVyOjA7Ym9yZGVyLXJhZGl1czp2YXIoLS1yYWRpdXMtbWQpO2NvbG9yOnZhcigtLWZnKTtwYWRkaW5nOjEwcHg7bWFyZ2luOjhweCAwO2FwcGVhcmFuY2U6bm9uZTstd2Via2l0LWFwcGVhcmFuY2U6bm9uZTtiYWNrZ3JvdW5kLWNsaXA6cGFkZGluZy1ib3g7cG9pbnRlci1ldmVudHM6YXV0bzt0b3VjaC1hY3Rpb246bWFuaXB1bGF0aW9ufVxyXG4uY2FyZCBzZWxlY3QuaW5wdXQsIHNlbGVjdC5pbnB1dHtiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjA4KTtjb2xvcjp2YXIoLS1mZyk7Ym9yZGVyOjA7Ym9yZGVyLXJhZGl1czp2YXIoLS1yYWRpdXMtbWQpO3BhZGRpbmc6MTBweDttYXJnaW46OHB4IDA7YXBwZWFyYW5jZTpub25lOy13ZWJraXQtYXBwZWFyYW5jZTpub25lO2JhY2tncm91bmQtY2xpcDpwYWRkaW5nLWJveH1cclxuLmNhcmQgc2VsZWN0LmlucHV0IG9wdGlvbiwgc2VsZWN0LmlucHV0IG9wdGlvbntiYWNrZ3JvdW5kOiMwYjEwMjA7Y29sb3I6I2ZmZn1cclxuLmNhcmQgc2VsZWN0LmlucHV0OmZvY3VzLCBzZWxlY3QuaW5wdXQ6Zm9jdXN7b3V0bGluZToycHggc29saWQgcmdiYSgxMjMsNDQsMjQ1LC40NSl9XHJcbi5jYXJkIGJ1dHRvbnt3aWR0aDoxMDAlO2JvcmRlci1yYWRpdXM6dmFyKC0tcmFkaXVzLW1kKX1cclxuLmJ0bntwb3NpdGlvbjpyZWxhdGl2ZTtvdmVyZmxvdzpoaWRkZW47cGFkZGluZzoxMHB4IDE0cHg7Ym9yZGVyOjA7Ym9yZGVyLXJhZGl1czp2YXIoLS1yYWRpdXMtbWQpO2NvbG9yOiNmZmY7dHJhbnNpdGlvbjp0cmFuc2Zvcm0gdmFyKC0tZHVyKSB2YXIoLS1lYXNlKSxib3gtc2hhZG93IHZhcigtLWR1cikgdmFyKC0tZWFzZSksZmlsdGVyIHZhcigtLWR1cikgdmFyKC0tZWFzZSk7Y3Vyc29yOnBvaW50ZXJ9XHJcbi5idG4gLmljb257bWFyZ2luLXJpZ2h0OjZweH1cclxuLmJ0bjphY3RpdmV7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoMXB4KSBzY2FsZSguOTkpfVxyXG4uYnRuOmRpc2FibGVke29wYWNpdHk6LjU7Y3Vyc29yOm5vdC1hbGxvd2VkO2ZpbHRlcjpncmF5c2NhbGUoMC4zKX1cclxuLmJ0bjo6YWZ0ZXJ7Y29udGVudDpcIlwiO3Bvc2l0aW9uOmFic29sdXRlO2luc2V0OjA7b3BhY2l0eTowO2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDExNWRlZyx0cmFuc3BhcmVudCxyZ2JhKDI1NSwyNTUsMjU1LC4yNSksdHJhbnNwYXJlbnQgNTUlKTt0cmFuc2Zvcm06dHJhbnNsYXRlWCgtNjAlKTt0cmFuc2l0aW9uOm9wYWNpdHkgdmFyKC0tZHVyKSB2YXIoLS1lYXNlKSwgdHJhbnNmb3JtIHZhcigtLWR1cikgdmFyKC0tZWFzZSk7cG9pbnRlci1ldmVudHM6bm9uZX1cclxuLmJ0bjpob3Zlcjo6YWZ0ZXJ7b3BhY2l0eTouOTt0cmFuc2Zvcm06dHJhbnNsYXRlWCgwKX1cclxuLmJ0bjpob3ZlcntmaWx0ZXI6c2F0dXJhdGUoMTEwJSl9XHJcbi5idG4tcHJpbWFyeXtiYWNrZ3JvdW5kOnZhcigtLWdyYWQpO2JveC1zaGFkb3c6dmFyKC0tZ2xvdyk7cG9zaXRpb246cmVsYXRpdmV9XHJcbi5idG4tcHJpbWFyeTo6YmVmb3Jle2NvbnRlbnQ6XCJcIjtwb3NpdGlvbjphYnNvbHV0ZTt0b3A6MDtsZWZ0Oi0xMDAlO3dpZHRoOjEwMCU7aGVpZ2h0OjEwMCU7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoOTBkZWcsdHJhbnNwYXJlbnQscmdiYSgyNTUsMjU1LDI1NSwuMiksdHJhbnNwYXJlbnQpO2FuaW1hdGlvbjpidG4tc2hpbW1lciAzcyBsaW5lYXIgaW5maW5pdGU7cG9pbnRlci1ldmVudHM6bm9uZX1cclxuQGtleWZyYW1lcyBidG4tc2hpbW1lcnswJXtsZWZ0Oi0xMDAlfTEwMCV7bGVmdDoyMDAlfX1cclxuLmJ0bi1lbmVyZ3l7cG9zaXRpb246cmVsYXRpdmU7YW5pbWF0aW9uOmJ0bi1wdWxzZSAycyBlYXNlLWluLW91dCBpbmZpbml0ZX1cclxuLmJ0bi1lbmVyZ3k6OmJlZm9yZXtjb250ZW50OlwiXCI7cG9zaXRpb246YWJzb2x1dGU7aW5zZXQ6LTJweDtib3JkZXItcmFkaXVzOmluaGVyaXQ7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLHJnYmEoMTIzLDQ0LDI0NSwuNikscmdiYSg0NCwxMzcsMjQ1LC42KSk7ZmlsdGVyOmJsdXIoOHB4KTt6LWluZGV4Oi0xO29wYWNpdHk6LjY7YW5pbWF0aW9uOmVuZXJneS1yaW5nIDJzIGVhc2UtaW4tb3V0IGluZmluaXRlO3BvaW50ZXItZXZlbnRzOm5vbmV9XHJcbkBrZXlmcmFtZXMgYnRuLXB1bHNlezAlLDEwMCV7dHJhbnNmb3JtOnNjYWxlKDEpfTUwJXt0cmFuc2Zvcm06c2NhbGUoMS4wMil9fVxyXG5Aa2V5ZnJhbWVzIGVuZXJneS1yaW5nezAlLDEwMCV7b3BhY2l0eTouNDtmaWx0ZXI6Ymx1cig4cHgpfTUwJXtvcGFjaXR5Oi44O2ZpbHRlcjpibHVyKDEycHgpfX1cclxuLmJ0bi1idXl7YmFja2dyb3VuZDp2YXIoLS1idXkpfVxyXG4uYnRuLXNlbGx7YmFja2dyb3VuZDp2YXIoLS1zZWxsKX1cclxuLmJ0bi1naG9zdHtiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjA4KX1cclxuLmlucHV0e3dpZHRoOjEwMCU7cGFkZGluZzoxMHB4O2JvcmRlcjowO2JvcmRlci1yYWRpdXM6dmFyKC0tcmFkaXVzLW1kKTtiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjA4KTtjb2xvcjp2YXIoLS1mZyk7cG9pbnRlci1ldmVudHM6YXV0bzt0b3VjaC1hY3Rpb246bWFuaXB1bGF0aW9uO3VzZXItc2VsZWN0OnRleHQ7LXdlYmtpdC11c2VyLXNlbGVjdDp0ZXh0O3RyYW5zaXRpb246YWxsIC4ycyBlYXNlfVxyXG4uaW5wdXQ6Zm9jdXN7YmFja2dyb3VuZDpyZ2JhKDI1NSwyNTUsMjU1LC4xMik7Ym94LXNoYWRvdzowIDAgMCAycHggcmdiYSgxMjMsNDQsMjQ1LC40KTtvdXRsaW5lOm5vbmV9XHJcbi5waWxse3BhZGRpbmc6MnB4IDhweDtib3JkZXItcmFkaXVzOjk5OXB4O2JhY2tncm91bmQ6cmdiYSgyNTUsMjU1LDI1NSwuMDgpO2ZvbnQtc2l6ZToxMnB4O2N1cnNvcjpwb2ludGVyO3RyYW5zaXRpb246YmFja2dyb3VuZCAuM3MgZWFzZX1cclxuLnBpbGwucGlsbC1ydW5uaW5ne2FuaW1hdGlvbjpwaWxsLWJyZWF0aGUgMnMgZWFzZS1pbi1vdXQgaW5maW5pdGV9XHJcbkBrZXlmcmFtZXMgcGlsbC1icmVhdGhlezAlLDEwMCV7YmFja2dyb3VuZDpyZ2JhKDQ2LDE5NCwxMjYsLjI1KTtib3gtc2hhZG93OjAgMCA4cHggcmdiYSg0NiwxOTQsMTI2LC4zKX01MCV7YmFja2dyb3VuZDpyZ2JhKDQ2LDE5NCwxMjYsLjM1KTtib3gtc2hhZG93OjAgMCAxMnB4IHJnYmEoNDYsMTk0LDEyNiwuNSl9fVxyXG4ucGlsbC5waWxsLWNvbGxhcHNlZHthbmltYXRpb246cGlsbC1hbGVydCAxcyBlYXNlLWluLW91dCBpbmZpbml0ZX1cclxuQGtleWZyYW1lcyBwaWxsLWFsZXJ0ezAlLDEwMCV7YmFja2dyb3VuZDpyZ2JhKDI1NSw5Miw5MiwuMjUpO2JveC1zaGFkb3c6MCAwIDhweCByZ2JhKDI1NSw5Miw5MiwuMyl9NTAle2JhY2tncm91bmQ6cmdiYSgyNTUsOTIsOTIsLjQ1KTtib3gtc2hhZG93OjAgMCAxNnB4IHJnYmEoMjU1LDkyLDkyLC42KX19XHJcbi5waWxsLmFjdGl2ZXtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcsIHJnYmEoMTIzLDQ0LDI0NSwuMzUpLCByZ2JhKDQ0LDEzNywyNDUsLjI4KSk7Ym94LXNoYWRvdzp2YXIoLS1nbG93KX1cclxuLnNjZW5lLWhlYWRlcntkaXNwbGF5OmZsZXg7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YWxpZ24taXRlbXM6ZmxleC1lbmQ7Z2FwOjEycHg7bWFyZ2luLWJvdHRvbTo4cHh9XHJcbi5zY2VuZS1oZWFkZXIgaDF7bWFyZ2luOjA7Zm9udC1zaXplOjIwcHg7cG9zaXRpb246cmVsYXRpdmU7ZGlzcGxheTppbmxpbmUtYmxvY2t9XHJcbi5zY2VuZS1oZWFkZXIgaDE6OmFmdGVye2NvbnRlbnQ6XCJcIjtwb3NpdGlvbjphYnNvbHV0ZTtsZWZ0OjA7Ym90dG9tOi0ycHg7d2lkdGg6MTAwJTtoZWlnaHQ6MnB4O2JhY2tncm91bmQ6dmFyKC0tZ3JhZCk7b3BhY2l0eTouNDtwb2ludGVyLWV2ZW50czpub25lfVxyXG4uc2NlbmUtaGVhZGVyIHB7bWFyZ2luOjA7b3BhY2l0eTouODV9XHJcbi5zdGF0c3tkaXNwbGF5OmZsZXg7Z2FwOjEwcHh9XHJcbi5zdGF0e2ZsZXg6MTttaW4td2lkdGg6MDtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxODBkZWcscmdiYSgyNTUsMjU1LDI1NSwuMDYpLHJnYmEoMjU1LDI1NSwyNTUsLjAzKSk7Ym9yZGVyLXJhZGl1czoxMnB4O3BhZGRpbmc6MTBweDtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDoxMHB4O3Bvc2l0aW9uOnJlbGF0aXZlO292ZXJmbG93OmhpZGRlbn1cclxuLnN0YXQtYW5pbWF0ZWQ6aG92ZXJ7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTgwZGVnLHJnYmEoMjU1LDI1NSwyNTUsLjEpLHJnYmEoMjU1LDI1NSwyNTUsLjA1KSk7Ym94LXNoYWRvdzowIDAgMTZweCByZ2JhKDEyMyw0NCwyNDUsLjIpfVxyXG4uc3RhdCAuaWNve2ZvbnQtc2l6ZToxOHB4O2ZpbHRlcjpkcm9wLXNoYWRvdygwIDAgOHB4IHJnYmEoMTIzLDQ0LDI0NSwuMzUpKTt0cmFuc2l0aW9uOnRyYW5zZm9ybSAuM3MgZWFzZX1cclxuLnB1bHNlLWljb257YW5pbWF0aW9uOmljb24tcHVsc2UgLjZzIGVhc2V9XHJcbkBrZXlmcmFtZXMgaWNvbi1wdWxzZXswJSwxMDAle3RyYW5zZm9ybTpzY2FsZSgxKX01MCV7dHJhbnNmb3JtOnNjYWxlKDEuMykgcm90YXRlKDVkZWcpfX1cclxuLnN0YXQgLnZhbHtmb250LXdlaWdodDo3MDA7Zm9udC1zaXplOjE2cHh9XHJcbi5zdGF0IC5sYWJlbHtvcGFjaXR5Oi44NTtmb250LXNpemU6MTJweH1cclxuLmV2ZW50LWZlZWR7bWF4LWhlaWdodDoyNDBweDtvdmVyZmxvdzphdXRvO2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjZweDtwb3NpdGlvbjpyZWxhdGl2ZX1cclxuLmV2ZW50LWZlZWQ6OmJlZm9yZXtjb250ZW50OlwiXCI7cG9zaXRpb246YWJzb2x1dGU7dG9wOjA7bGVmdDowO3JpZ2h0OjA7aGVpZ2h0OjIwcHg7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTgwZGVnLHJnYmEoMTIsMjAsNDQsLjU1KSx0cmFuc3BhcmVudCk7cG9pbnRlci1ldmVudHM6bm9uZTt6LWluZGV4OjF9XHJcbi5ldmVudC1mZWVkOjphZnRlcntjb250ZW50OlwiXCI7cG9zaXRpb246YWJzb2x1dGU7Ym90dG9tOjA7bGVmdDowO3JpZ2h0OjA7aGVpZ2h0OjIwcHg7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMGRlZyxyZ2JhKDEyLDIwLDQ0LC41NSksdHJhbnNwYXJlbnQpO3BvaW50ZXItZXZlbnRzOm5vbmU7ei1pbmRleDoxfVxyXG4uZXZlbnQtZmVlZCAuZXZlbnR7b3BhY2l0eTouOTtmb250LWZhbWlseTptb25vc3BhY2U7Zm9udC1zaXplOjEycHg7cG9zaXRpb246cmVsYXRpdmV9XHJcbi5tYWluLXNjcmVlbntwb3NpdGlvbjpyZWxhdGl2ZTtwYWRkaW5nOjEycHggMCAzNnB4O21pbi1oZWlnaHQ6MTAwdmh9XHJcbi5tYWluLXN0YWNre2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjE2cHh9XHJcbi5taW5lLWNhcmR7bWluLWhlaWdodDpjYWxjKDEwMHZoIC0gMTYwcHgpO3BhZGRpbmc6MjRweCAyMHB4O2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjIwcHg7Ym9yZGVyLXJhZGl1czoyMHB4fVxyXG5AbWVkaWEgKG1pbi13aWR0aDo1ODBweCl7Lm1pbmUtY2FyZHttaW4taGVpZ2h0OjYyMHB4O3BhZGRpbmc6MjhweCAyNnB4fX1cclxuLm1pbmUtaGVhZGVye2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47Z2FwOjEycHh9XHJcbi5taW5lLXRpdGxle2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjEwcHg7Zm9udC1zaXplOjE4cHg7Zm9udC13ZWlnaHQ6NjAwO2xldHRlci1zcGFjaW5nOi4wNGVtO3RleHQtc2hhZG93OjAgMnB4IDEycHggcmdiYSgxOCwxMCw0OCwuNik7cG9zaXRpb246cmVsYXRpdmV9XHJcbi5taW5lLXRpdGxlOjphZnRlcntjb250ZW50OlwiXCI7cG9zaXRpb246YWJzb2x1dGU7bGVmdDowO2JvdHRvbTotNHB4O3dpZHRoOjEwMCU7aGVpZ2h0OjJweDtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCg5MGRlZyx0cmFuc3BhcmVudCxyZ2JhKDEyMyw0NCwyNDUsLjYpLHRyYW5zcGFyZW50KTtvcGFjaXR5Oi41O2FuaW1hdGlvbjp0aXRsZS1nbG93IDNzIGVhc2UtaW4tb3V0IGluZmluaXRlfVxyXG5Aa2V5ZnJhbWVzIHRpdGxlLWdsb3d7MCUsMTAwJXtvcGFjaXR5Oi4zO3RyYW5zZm9ybTpzY2FsZVgoLjgpfTUwJXtvcGFjaXR5Oi43O3RyYW5zZm9ybTpzY2FsZVgoMSl9fVxyXG4ubWluZS10aXRsZSAuaWNvbntmaWx0ZXI6ZHJvcC1zaGFkb3coMCAwIDEycHggcmdiYSgxMjQsNjAsMjU1LC41NSkpfVxyXG4ubWluZS1jaGlwc3tkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo4cHh9XHJcbi5taW5lLWNoaXBzIC5waWxse2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjZweDtmb250LXNpemU6MTJweDtiYWNrZ3JvdW5kOnJnYmEoMTUsMjQsNTYsLjU1KTtib3gtc2hhZG93Omluc2V0IDAgMCAwIDFweCByZ2JhKDEyMyw0NCwyNDUsLjI1KX1cclxuLm1pbmUtZ3JpZHtkaXNwbGF5OmdyaWQ7Z2FwOjE4cHh9XHJcbkBtZWRpYSAobWluLXdpZHRoOjY0MHB4KXsubWluZS1ncmlke2dyaWQtdGVtcGxhdGUtY29sdW1uczoyMjBweCAxZnI7YWxpZ24taXRlbXM6Y2VudGVyfX1cclxuLm1pbmUtZ2F1Z2V7cG9zaXRpb246cmVsYXRpdmU7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO3BhZGRpbmc6OHB4IDB9XHJcbi5taW5lLXByb2dyZXNze3Bvc2l0aW9uOnJlbGF0aXZlO2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjE0cHh9XHJcbi5taW5lLXByb2dyZXNzIC5taW5lci1jaGFyLXdyYXBwZXJ7cG9zaXRpb246YWJzb2x1dGU7dG9wOi0xNDBweDtsZWZ0OjEyMHB4O3otaW5kZXg6NTtwb2ludGVyLWV2ZW50czpub25lO3RyYW5zZm9ybTpzY2FsZSgxLjUpfVxyXG4ubWluZS1nYXVnZSAucmluZ3t3aWR0aDoyMDBweDtoZWlnaHQ6MjAwcHg7Ym9yZGVyLXJhZGl1czo1MCU7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO2JhY2tncm91bmQ6Y29uaWMtZ3JhZGllbnQoIzdCMkNGNSAwZGVnLHJnYmEoMjU1LDI1NSwyNTUsLjA4KSAwZGVnKTtib3gtc2hhZG93Omluc2V0IDAgMCAzMHB4IHJnYmEoMTIzLDQ0LDI0NSwuMjgpLDAgMjRweCA0OHB4IHJnYmEoMTIsOCw0MiwuNTUpfVxyXG4ubWluZS1nYXVnZSAucmluZzo6YmVmb3Jle2NvbnRlbnQ6XCJcIjtwb3NpdGlvbjphYnNvbHV0ZTtpbnNldDoxOCU7Ym9yZGVyLXJhZGl1czo1MCU7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoY2lyY2xlIGF0IDUwJSAyOCUscmdiYSgxMjMsNDQsMjQ1LC40NSkscmdiYSgxMiwyMCw0NiwuOTIpIDcwJSk7Ym94LXNoYWRvdzppbnNldCAwIDE0cHggMjhweCByZ2JhKDAsMCwwLC40OCk7cG9pbnRlci1ldmVudHM6bm9uZX1cclxuLm1pbmUtZ2F1Z2UgLnJpbmctY29yZXtwb3NpdGlvbjpyZWxhdGl2ZTtkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NHB4O2ZvbnQtd2VpZ2h0OjYwMH1cclxuLm1pbmUtZ2F1Z2UgLnJpbmctY29yZSBzcGFue2ZvbnQtc2l6ZToyMnB4fVxyXG4ubWluZS1nYXVnZSAucmluZy1jb3JlIHNtYWxse2ZvbnQtc2l6ZToxMnB4O2xldHRlci1zcGFjaW5nOi4xMmVtO29wYWNpdHk6Ljc1O3RleHQtdHJhbnNmb3JtOnVwcGVyY2FzZX1cclxuLnJpbmctZ2xvd3twb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDoyMDBweDtoZWlnaHQ6MjAwcHg7Ym9yZGVyLXJhZGl1czo1MCU7ZmlsdGVyOmJsdXIoMzJweCk7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoY2lyY2xlLHJnYmEoMTIzLDQ0LDI0NSwuNDgpLHJnYmEoNDQsMTM3LDI0NSwuMSkpO29wYWNpdHk6LjY7YW5pbWF0aW9uOm1pbmUtZ2xvdyA5cyBlYXNlLWluLW91dCBpbmZpbml0ZX1cclxuLnJpbmctZ2xvdy1ie2FuaW1hdGlvbi1kZWxheTotNC41cztiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudChjaXJjbGUscmdiYSg0NCwxMzcsMjQ1LC40NSksdHJhbnNwYXJlbnQgNjUlKX1cclxuLnJpbmctcHVsc2V7YW5pbWF0aW9uOnJpbmctZmxhc2ggLjZzIGVhc2UhaW1wb3J0YW50fVxyXG5Aa2V5ZnJhbWVzIHJpbmctZmxhc2h7MCUsMTAwJXtib3gtc2hhZG93Omluc2V0IDAgMCAzMHB4IHJnYmEoMTIzLDQ0LDI0NSwuMjgpLDAgMjRweCA0OHB4IHJnYmEoMTIsOCw0MiwuNTUpfTUwJXtib3gtc2hhZG93Omluc2V0IDAgMCA1MHB4IHJnYmEoMjQ2LDE5Niw2OSwuOCksMCAyNHB4IDY4cHggcmdiYSgyNDYsMTk2LDY5LC41KSwwIDAgODBweCByZ2JhKDI0NiwxOTYsNjksLjQpfX1cclxuLnJpbmctZnVsbHthbmltYXRpb246cmluZy1nbG93LWZ1bGwgMnMgZWFzZS1pbi1vdXQgaW5maW5pdGUhaW1wb3J0YW50fVxyXG5Aa2V5ZnJhbWVzIHJpbmctZ2xvdy1mdWxsezAlLDEwMCV7Ym94LXNoYWRvdzppbnNldCAwIDAgNDBweCByZ2JhKDI0NiwxOTYsNjksLjUpLDAgMjRweCA0OHB4IHJnYmEoMjQ2LDE5Niw2OSwuMzUpLDAgMCA2MHB4IHJnYmEoMjQ2LDE5Niw2OSwuMyl9NTAle2JveC1zaGFkb3c6aW5zZXQgMCAwIDYwcHggcmdiYSgyNDYsMTk2LDY5LC43KSwwIDI0cHggNjhweCByZ2JhKDI0NiwxOTYsNjksLjUpLDAgMCA4MHB4IHJnYmEoMjQ2LDE5Niw2OSwuNSl9fVxyXG4ubWlsZXN0b25lLXB1bHNle2FuaW1hdGlvbjptaWxlc3RvbmUtcmluZyAxcyBlYXNlfVxyXG5Aa2V5ZnJhbWVzIG1pbGVzdG9uZS1yaW5nezAle3RyYW5zZm9ybTpzY2FsZSgxKX0zMCV7dHJhbnNmb3JtOnNjYWxlKDEuMDgpfTYwJXt0cmFuc2Zvcm06c2NhbGUoLjk4KX0xMDAle3RyYW5zZm9ybTpzY2FsZSgxKX19XHJcbkBrZXlmcmFtZXMgbWluZS1nbG93ezAlLDEwMCV7dHJhbnNmb3JtOnNjYWxlKC45Mik7b3BhY2l0eTouNDV9NTAle3RyYW5zZm9ybTpzY2FsZSgxLjA1KTtvcGFjaXR5Oi44fX1cclxuLm1pbmUtcHJvZ3Jlc3MtbWV0YXtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6ZmxleC1lbmQ7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47Zm9udC1zaXplOjE0cHg7bGV0dGVyLXNwYWNpbmc6LjAyZW19XHJcbi5taW5lLXByb2dyZXNzLXRyYWNre3Bvc2l0aW9uOnJlbGF0aXZlO2hlaWdodDoxMnB4O2JvcmRlci1yYWRpdXM6OTk5cHg7YmFja2dyb3VuZDpyZ2JhKDI1NSwyNTUsMjU1LC4xKTtvdmVyZmxvdzpoaWRkZW47Ym94LXNoYWRvdzppbnNldCAwIDAgMTRweCByZ2JhKDEyMyw0NCwyNDUsLjI4KX1cclxuLm1pbmUtcHJvZ3Jlc3MtZmlsbHtoZWlnaHQ6MTAwJTt3aWR0aDowO2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDkwZGVnLCM3QjJDRjUsIzJDODlGNSk7Ym94LXNoYWRvdzowIDAgMTZweCByZ2JhKDEyMyw0NCwyNDUsLjY1KTt0cmFuc2l0aW9uOndpZHRoIC4zNXMgdmFyKC0tZWFzZSk7cG9zaXRpb246cmVsYXRpdmU7b3ZlcmZsb3c6aGlkZGVufVxyXG4ubWluZS1wcm9ncmVzcy1maWxsOjphZnRlcntjb250ZW50OlwiXCI7cG9zaXRpb246YWJzb2x1dGU7dG9wOjA7bGVmdDotMTAwJTt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDkwZGVnLHRyYW5zcGFyZW50LHJnYmEoMjU1LDI1NSwyNTUsLjMpLHRyYW5zcGFyZW50KTthbmltYXRpb246cHJvZ3Jlc3Mtd2F2ZSAycyBsaW5lYXIgaW5maW5pdGU7cG9pbnRlci1ldmVudHM6bm9uZX1cclxuQGtleWZyYW1lcyBwcm9ncmVzcy13YXZlezAle2xlZnQ6LTEwMCV9MTAwJXtsZWZ0OjIwMCV9fVxyXG4ubWluZS1zdGF0dXN7bWluLWhlaWdodDoyMnB4O2ZvbnQtc2l6ZToxM3B4O29wYWNpdHk6Ljl9XHJcbi5taW5lLWFjdGlvbnMtZ3JpZHtkaXNwbGF5OmdyaWQ7Z2FwOjEycHg7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOnJlcGVhdCgyLG1pbm1heCgwLDFmcikpfVxyXG4ubWluZS1hY3Rpb25zLWdyaWQgLmJ0bntoZWlnaHQ6NDhweDtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpjZW50ZXI7Zm9udC1zaXplOjE1cHg7Z2FwOjhweH1cclxuLm1pbmUtYWN0aW9ucy1ncmlkIC5zcGFuLTJ7Z3JpZC1jb2x1bW46c3BhbiAyfVxyXG5AbWVkaWEgKG1pbi13aWR0aDo2ODBweCl7Lm1pbmUtYWN0aW9ucy1ncmlke2dyaWQtdGVtcGxhdGUtY29sdW1uczpyZXBlYXQoMyxtaW5tYXgoMCwxZnIpKX0ubWluZS1hY3Rpb25zLWdyaWQgLnNwYW4tMntncmlkLWNvbHVtbjpzcGFuIDN9fVxyXG4ubWluZS1mZWVke3Bvc2l0aW9uOnJlbGF0aXZlO2JvcmRlci1yYWRpdXM6MTZweDtiYWNrZ3JvdW5kOnJnYmEoMTIsMjAsNDQsLjU1KTtwYWRkaW5nOjE0cHggMTJweDtib3gtc2hhZG93Omluc2V0IDAgMCAyNHB4IHJnYmEoMTIzLDQ0LDI0NSwuMTIpO2JhY2tkcm9wLWZpbHRlcjpibHVyKDEycHgpfVxyXG4ubWluZS1mZWVkOjpiZWZvcmV7Y29udGVudDpcIlwiO3Bvc2l0aW9uOmFic29sdXRlO2luc2V0OjA7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLHJnYmEoMTIzLDQ0LDI0NSwuMTYpLHJnYmEoNDQsMTM3LDI0NSwuMTQpIDYwJSx0cmFuc3BhcmVudCk7b3BhY2l0eTouNzU7cG9pbnRlci1ldmVudHM6bm9uZX1cclxuLm1pbmUtZmVlZCAuZXZlbnQtZmVlZHttYXgtaGVpZ2h0OjE4MHB4fVxyXG4uZXZlbnR7dHJhbnNpdGlvbjpvcGFjaXR5IC4zcyBlYXNlLCB0cmFuc2Zvcm0gLjNzIGVhc2V9XHJcbi5ldmVudC1jcml0aWNhbHtjb2xvcjojZjZjNDQ1O2ZvbnQtd2VpZ2h0OjYwMH1cclxuLmV2ZW50LXdhcm5pbmd7Y29sb3I6I2ZmNWM1Y31cclxuLmV2ZW50LXN1Y2Nlc3N7Y29sb3I6IzJlYzI3ZX1cclxuLmV2ZW50LW5vcm1hbHtjb2xvcjpyZ2JhKDI1NSwyNTUsMjU1LC45KX1cclxuLm1pbmUtaG9sb2dyYW17cG9zaXRpb246cmVsYXRpdmU7ZmxleDoxO21pbi1oZWlnaHQ6MTgwcHg7Ym9yZGVyLXJhZGl1czoxOHB4O2JhY2tncm91bmQ6cmFkaWFsLWdyYWRpZW50KDkwJSAxMjAlIGF0IDUwJSAxMDAlLHJnYmEoNDQsMTM3LDI0NSwuMzUpLHJnYmEoOCwxMiwzMCwuMykgNTUlLHRyYW5zcGFyZW50KTtvdmVyZmxvdzpoaWRkZW47bWFyZ2luLXRvcDphdXRvO2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OmNlbnRlcjtpc29sYXRpb246aXNvbGF0ZTt0cmFuc2l0aW9uOmJhY2tncm91bmQgLjVzIGVhc2V9XHJcbi5ob2xvLWlkbGV7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoOTAlIDEyMCUgYXQgNTAlIDEwMCUscmdiYSgxMjMsNDQsMjQ1LC4yNSkscmdiYSg4LDEyLDMwLC4zKSA1NSUsdHJhbnNwYXJlbnQpfVxyXG4uaG9sby1taW5pbmd7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoOTAlIDEyMCUgYXQgNTAlIDEwMCUscmdiYSg0NCwxMzcsMjQ1LC40NSkscmdiYSg4LDEyLDMwLC4zKSA1NSUsdHJhbnNwYXJlbnQpfVxyXG4uaG9sby1taW5pbmcgLm1pbmUtaG9sby1ncmlke2FuaW1hdGlvbi1kdXJhdGlvbjoxMnMhaW1wb3J0YW50fVxyXG4uaG9sby1jb2xsYXBzZWR7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoOTAlIDEyMCUgYXQgNTAlIDEwMCUscmdiYSgyNTUsOTIsOTIsLjM1KSxyZ2JhKDgsMTIsMzAsLjMpIDU1JSx0cmFuc3BhcmVudCk7YW5pbWF0aW9uOmhvbG8tZ2xpdGNoIC41cyBlYXNlIGluZmluaXRlfVxyXG5Aa2V5ZnJhbWVzIGhvbG8tZ2xpdGNoezAlLDEwMCV7dHJhbnNmb3JtOnRyYW5zbGF0ZVgoMCl9MjUle3RyYW5zZm9ybTp0cmFuc2xhdGVYKC0ycHgpfTc1JXt0cmFuc2Zvcm06dHJhbnNsYXRlWCgycHgpfX1cclxuLmNyaXRpY2FsLWZsYXNoe2FuaW1hdGlvbjpjcml0aWNhbC1idXJzdCAuNHMgZWFzZX1cclxuQGtleWZyYW1lcyBjcml0aWNhbC1idXJzdHswJXtiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudCg5MCUgMTIwJSBhdCA1MCUgMTAwJSxyZ2JhKDQ0LDEzNywyNDUsLjM1KSxyZ2JhKDgsMTIsMzAsLjMpIDU1JSx0cmFuc3BhcmVudCl9NTAle2JhY2tncm91bmQ6cmFkaWFsLWdyYWRpZW50KDkwJSAxMjAlIGF0IDUwJSAxMDAlLHJnYmEoMjQ2LDE5Niw2OSwuNjUpLHJnYmEoMjQ2LDE5Niw2OSwuMikgNTUlLHRyYW5zcGFyZW50KX0xMDAle2JhY2tncm91bmQ6cmFkaWFsLWdyYWRpZW50KDkwJSAxMjAlIGF0IDUwJSAxMDAlLHJnYmEoNDQsMTM3LDI0NSwuMzUpLHJnYmEoOCwxMiwzMCwuMykgNTUlLHRyYW5zcGFyZW50KX19XHJcbi5taW5lLWhvbG8tZ3JpZHtwb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDoxNDAlO2hlaWdodDoxNDAlO2JhY2tncm91bmQ6cmVwZWF0aW5nLWxpbmVhci1ncmFkaWVudCgwZGVnLHJnYmEoMjU1LDI1NSwyNTUsLjA4KSAwLHJnYmEoMjU1LDI1NSwyNTUsLjA4KSAxcHgsdHJhbnNwYXJlbnQgMXB4LHRyYW5zcGFyZW50IDI4cHgpLHJlcGVhdGluZy1saW5lYXItZ3JhZGllbnQoOTBkZWcscmdiYSgyNTUsMjU1LDI1NSwuMDUpIDAscmdiYSgyNTUsMjU1LDI1NSwuMDUpIDFweCx0cmFuc3BhcmVudCAxcHgsdHJhbnNwYXJlbnQgMjZweCk7b3BhY2l0eTouMjI7dHJhbnNmb3JtOnRyYW5zbGF0ZTNkKC0xMCUsMCwwKSByb3RhdGUoOGRlZyk7YW5pbWF0aW9uOmhvbG8tcGFuIDE2cyBsaW5lYXIgaW5maW5pdGV9XHJcbi5taW5lLWhvbG8tZ3JpZC5kaWFnb25hbHtvcGFjaXR5Oi4xODt0cmFuc2Zvcm06dHJhbnNsYXRlM2QoMTAlLDAsMCkgcm90YXRlKC0xNmRlZyk7YW5pbWF0aW9uLWR1cmF0aW9uOjIyc31cclxuQGtleWZyYW1lcyBob2xvLXBhbnswJXt0cmFuc2Zvcm06dHJhbnNsYXRlM2QoLTEyJSwwLDApIHJvdGF0ZSg4ZGVnKX0xMDAle3RyYW5zZm9ybTp0cmFuc2xhdGUzZCgxMiUsMCwwKSByb3RhdGUoOGRlZyl9fVxyXG4ubWluZS1ob2xvLWdsb3d7cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6NzAlO2hlaWdodDo3MCU7Ym9yZGVyLXJhZGl1czo1MCU7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoY2lyY2xlIGF0IDUwJSA0MCUscmdiYSgxMjMsNDQsMjQ1LC41NSksdHJhbnNwYXJlbnQgNzAlKTtmaWx0ZXI6Ymx1cigzMnB4KTtvcGFjaXR5Oi41NTthbmltYXRpb246aG9sby1icmVhdGhlIDEwcyBlYXNlLWluLW91dCBpbmZpbml0ZX1cclxuQGtleWZyYW1lcyBob2xvLWJyZWF0aGV7MCUsMTAwJXt0cmFuc2Zvcm06c2NhbGUoLjkpO29wYWNpdHk6LjQ1fTUwJXt0cmFuc2Zvcm06c2NhbGUoMS4wOCk7b3BhY2l0eTouODV9fVxyXG4ubWluZS1zaGFyZHtwb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDoxMjBweDtoZWlnaHQ6MTIwcHg7YmFja2dyb3VuZDpjb25pYy1ncmFkaWVudChmcm9tIDE1MGRlZyxyZ2JhKDEyMyw0NCwyNDUsLjgpLHJnYmEoNDQsMTM3LDI0NSwuMzgpLHJnYmEoMTIzLDQ0LDI0NSwuMDgpKTtjbGlwLXBhdGg6cG9seWdvbig1MCUgMCw4OCUgNDAlLDcwJSAxMDAlLDMwJSAxMDAlLDEyJSA0MCUpO29wYWNpdHk6LjI2O2ZpbHRlcjpibHVyKC40cHgpO2FuaW1hdGlvbjpzaGFyZC1mbG9hdCA4cyBlYXNlLWluLW91dCBpbmZpbml0ZX1cclxuLm1pbmUtc2hhcmQuc2hhcmQtMXt0b3A6MTglO2xlZnQ6MTYlO2FuaW1hdGlvbi1kZWxheTotMS40c31cclxuLm1pbmUtc2hhcmQuc2hhcmQtMntib3R0b206MTYlO3JpZ2h0OjIyJTthbmltYXRpb24tZGVsYXk6LTMuMnM7dHJhbnNmb3JtOnNjYWxlKC43NCl9XHJcbi5taW5lLXNoYXJkLnNoYXJkLTN7dG9wOjI2JTtyaWdodDozNCU7YW5pbWF0aW9uLWRlbGF5Oi01LjFzO3RyYW5zZm9ybTpzY2FsZSguNSkgcm90YXRlKDEyZGVnKX1cclxuQGtleWZyYW1lcyBzaGFyZC1mbG9hdHswJSwxMDAle3RyYW5zZm9ybTp0cmFuc2xhdGVZKC0xMHB4KSBzY2FsZSgxKTtvcGFjaXR5Oi4yfTUwJXt0cmFuc2Zvcm06dHJhbnNsYXRlWSgxMHB4KSBzY2FsZSgxLjA1KTtvcGFjaXR5Oi40fX1cclxuLm1haW4tYW1iaWVudHtwb3NpdGlvbjphYnNvbHV0ZTtpbnNldDowO3otaW5kZXg6LTE7cG9pbnRlci1ldmVudHM6bm9uZTtvdmVyZmxvdzpoaWRkZW59XHJcbi5tYWluLWFtYmllbnQgLmFtYmllbnQub3Jie3Bvc2l0aW9uOmFic29sdXRlO3dpZHRoOjQyMHB4O2hlaWdodDo0MjBweDtib3JkZXItcmFkaXVzOjUwJTtmaWx0ZXI6Ymx1cigxMjBweCk7b3BhY2l0eTouNDI7YW5pbWF0aW9uOmFtYmllbnQtZHJpZnQgMjZzIGVhc2UtaW4tb3V0IGluZmluaXRlfVxyXG4ubWFpbi1hbWJpZW50IC5vcmItYXtiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudChjaXJjbGUscmdiYSgxMjMsNDQsMjQ1LC42KSx0cmFuc3BhcmVudCA3MCUpO3RvcDotMTQwcHg7cmlnaHQ6LTEyMHB4fVxyXG4ubWFpbi1hbWJpZW50IC5vcmItYntiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudChjaXJjbGUscmdiYSg0NCwxMzcsMjQ1LC41NSksdHJhbnNwYXJlbnQgNzAlKTtib3R0b206LTE4MHB4O2xlZnQ6LTE4MHB4O2FuaW1hdGlvbi1kZWxheTotMTNzfVxyXG4ubWFpbi1hbWJpZW50IC5ncmlke3Bvc2l0aW9uOmFic29sdXRlO2luc2V0OjA7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoNzAlIDYwJSBhdCA1MCUgMTAwJSxyZ2JhKDI1NSwyNTUsMjU1LC4wOCksdHJhbnNwYXJlbnQgNzUlKTtvcGFjaXR5Oi4zNTttaXgtYmxlbmQtbW9kZTpzY3JlZW47YW5pbWF0aW9uOmFtYmllbnQtcHVsc2UgMThzIGVhc2UtaW4tb3V0IGluZmluaXRlfVxyXG5Aa2V5ZnJhbWVzIGFtYmllbnQtZHJpZnR7MCUsMTAwJXt0cmFuc2Zvcm06dHJhbnNsYXRlM2QoMCwwLDApIHNjYWxlKDEpfTUwJXt0cmFuc2Zvcm06dHJhbnNsYXRlM2QoOCUsIC00JSwwKSBzY2FsZSgxLjA1KX19XHJcbkBrZXlmcmFtZXMgYW1iaWVudC1wdWxzZXswJSwxMDAle29wYWNpdHk6LjI1fTUwJXtvcGFjaXR5Oi40NX19XHJcbi5mYWRlLWlue2FuaW1hdGlvbjpmYWRlLWluIC4zcyB2YXIoLS1lYXNlKX1cclxuQGtleWZyYW1lcyBmYWRlLWlue2Zyb217b3BhY2l0eTowO3RyYW5zZm9ybTp0cmFuc2xhdGVZKDRweCl9dG97b3BhY2l0eToxO3RyYW5zZm9ybTpub25lfX1cclxuLmZsYXNoe2FuaW1hdGlvbjpmbGFzaCAuOXMgZWFzZX1cclxuQGtleWZyYW1lcyBmbGFzaHswJXtib3gtc2hhZG93OjAgMCAwIHJnYmEoMjU1LDI1NSwyNTUsMCl9NDAle2JveC1zaGFkb3c6MCAwIDAgNnB4IHJnYmEoMjU1LDI1NSwyNTUsLjE1KX0xMDAle2JveC1zaGFkb3c6MCAwIDAgcmdiYSgyNTUsMjU1LDI1NSwwKX19XHJcbi5za2VsZXRvbntwb3NpdGlvbjpyZWxhdGl2ZTtvdmVyZmxvdzpoaWRkZW47YmFja2dyb3VuZDpyZ2JhKDI1NSwyNTUsMjU1LC4wOCk7Ym9yZGVyLXJhZGl1czp2YXIoLS1yYWRpdXMtbWQpO2hlaWdodDo0NHB4fVxyXG4uc2tlbGV0b246OmFmdGVye2NvbnRlbnQ6XCJcIjtwb3NpdGlvbjphYnNvbHV0ZTtpbnNldDowO3RyYW5zZm9ybTp0cmFuc2xhdGVYKC0xMDAlKTtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCg5MGRlZyx0cmFuc3BhcmVudCxyZ2JhKDI1NSwyNTUsMjU1LC4xMiksdHJhbnNwYXJlbnQpO2FuaW1hdGlvbjpzaGltbWVyIDEuMnMgaW5maW5pdGU7cG9pbnRlci1ldmVudHM6bm9uZX1cclxuQGtleWZyYW1lcyBzaGltbWVyezEwMCV7dHJhbnNmb3JtOnRyYW5zbGF0ZVgoMTAwJSl9fVxyXG4ubGlzdC1pdGVte2Rpc3BsYXk6ZmxleDtnYXA6OHB4O2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjtiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjA2KTtib3JkZXItcmFkaXVzOnZhcigtLXJhZGl1cy1tZCk7cGFkZGluZzoxMHB4O3RyYW5zaXRpb246YWxsIC4ycyBlYXNlfVxyXG4ubGlzdC1pdGVtOmhvdmVye2JhY2tncm91bmQ6cmdiYSgyNTUsMjU1LDI1NSwuMDkpO3RyYW5zZm9ybTp0cmFuc2xhdGVYKDJweCl9XHJcbi5saXN0LWl0ZW0tLWJ1eXtib3JkZXItbGVmdDozcHggc29saWQgdmFyKC0tYnV5KX1cclxuLmxpc3QtaXRlbS0tc2VsbHtib3JkZXItbGVmdDozcHggc29saWQgdmFyKC0tc2VsbCl9XHJcbi5uYXZ7bWF4LXdpZHRoOnZhcigtLWNvbnRhaW5lci1tYXgpO21hcmdpbjoxMnB4IGF1dG8gMDtkaXNwbGF5OmZsZXg7Z2FwOjhweDtmbGV4LXdyYXA6d3JhcDtwb3NpdGlvbjpzdGlja3k7dG9wOjA7ei1pbmRleDo0MDtwYWRkaW5nOjZweDtib3JkZXItcmFkaXVzOjE0cHg7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTgwZGVnLHJnYmEoMjAsMjAsNDAsLjQ1KSxyZ2JhKDIwLDIwLDQwLC4yNSkpO2JhY2tkcm9wLWZpbHRlcjpibHVyKDEwcHgpIHNhdHVyYXRlKDEyNSUpO2JvcmRlcjoxcHggc29saWQgcmdiYSgyNTUsMjU1LDI1NSwuMDYpO2JveC1zaGFkb3c6MCA0cHggMTJweCByZ2JhKDAsMCwwLC4zKX1cclxuLm5hdiBhe2ZsZXg6MTtkaXNwbGF5OmZsZXg7anVzdGlmeS1jb250ZW50OmNlbnRlcjthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjZweDt0ZXh0LWFsaWduOmNlbnRlcjtwYWRkaW5nOjEwcHg7Ym9yZGVyLXJhZGl1czo5OTlweDt0ZXh0LWRlY29yYXRpb246bm9uZTtjb2xvcjojZmZmO3RyYW5zaXRpb246YmFja2dyb3VuZCB2YXIoLS1kdXIpIHZhcigtLWVhc2UpLCB0cmFuc2Zvcm0gdmFyKC0tZHVyKSB2YXIoLS1lYXNlKTtwb3NpdGlvbjpyZWxhdGl2ZX1cclxuLm5hdiBhOjpiZWZvcmV7Y29udGVudDpcIlwiO3Bvc2l0aW9uOmFic29sdXRlO2luc2V0OjA7Ym9yZGVyLXJhZGl1czppbmhlcml0O2JhY2tncm91bmQ6dmFyKC0tZ3JhZCk7b3BhY2l0eTowO3RyYW5zaXRpb246b3BhY2l0eSB2YXIoLS1kdXIpIHZhcigtLWVhc2UpO3BvaW50ZXItZXZlbnRzOm5vbmV9XHJcbi5uYXYgYTpob3Zlcjo6YmVmb3Jle29wYWNpdHk6LjF9XHJcbi5uYXYgYSAuaWNve29wYWNpdHk6Ljk1fVxyXG4ubmF2IGEuYWN0aXZle2JhY2tncm91bmQ6dmFyKC0tZ3JhZCk7Ym94LXNoYWRvdzp2YXIoLS1nbG93KX1cclxuLm5hdiBhOm5vdCguYWN0aXZlKTpob3ZlcntiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjA2KX1cclxuLyogZ2VuZXJpYyBpY29uICovXHJcbi5pY29ue2Rpc3BsYXk6aW5saW5lLWJsb2NrO2xpbmUtaGVpZ2h0OjA7dmVydGljYWwtYWxpZ246bWlkZGxlfVxyXG4uaWNvbiBzdmd7ZGlzcGxheTpibG9jaztmaWx0ZXI6ZHJvcC1zaGFkb3coMCAwIDhweCByZ2JhKDEyMyw0NCwyNDUsLjM1KSl9XHJcbi8qIHJhcml0eSBiYWRnZXMgKi9cclxuLmJhZGdle2Rpc3BsYXk6aW5saW5lLWZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo2cHg7cGFkZGluZzoycHggOHB4O2JvcmRlci1yYWRpdXM6OTk5cHg7Zm9udC1zaXplOjEycHg7bGluZS1oZWlnaHQ6MTtib3JkZXI6MXB4IHNvbGlkIHJnYmEoMjU1LDI1NSwyNTUsLjEyKTtiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjA2KX1cclxuLmJhZGdlIGl7ZGlzcGxheTppbmxpbmUtYmxvY2s7d2lkdGg6OHB4O2hlaWdodDo4cHg7Ym9yZGVyLXJhZGl1czo5OTlweH1cclxuLmJhZGdlLnJhcml0eS1jb21tb24gaXtiYWNrZ3JvdW5kOnZhcigtLXJhcml0eS1jb21tb24pfVxyXG4uYmFkZ2UucmFyaXR5LXJhcmUgaXtiYWNrZ3JvdW5kOnZhcigtLXJhcml0eS1yYXJlKX1cclxuLmJhZGdlLnJhcml0eS1lcGljIGl7YmFja2dyb3VuZDp2YXIoLS1yYXJpdHktZXBpYyl9XHJcbi5iYWRnZS5yYXJpdHktbGVnZW5kYXJ5IGl7YmFja2dyb3VuZDp2YXIoLS1yYXJpdHktbGVnZW5kYXJ5KX1cclxuLnJhcml0eS1vdXRsaW5lLWNvbW1vbntib3gtc2hhZG93OjAgMCAwIDFweCByZ2JhKDE1NCwxNjAsMTY2LC4zNSkgaW5zZXQsIDAgMCAyNHB4IHJnYmEoMTU0LDE2MCwxNjYsLjE1KX1cclxuLnJhcml0eS1vdXRsaW5lLXJhcmV7Ym94LXNoYWRvdzowIDAgMCAxcHggcmdiYSg3OSwyMTIsMjQ1LC40NSkgaW5zZXQsIDAgMCAyOHB4IHJnYmEoNzksMjEyLDI0NSwuMjUpfVxyXG4ucmFyaXR5LW91dGxpbmUtZXBpY3tib3gtc2hhZG93OjAgMCAwIDFweCByZ2JhKDE3OCwxMDcsMjU1LC41KSBpbnNldCwgMCAwIDMycHggcmdiYSgxNzgsMTA3LDI1NSwuMyl9XHJcbi5yYXJpdHktb3V0bGluZS1sZWdlbmRhcnl7Ym94LXNoYWRvdzowIDAgMCAxcHggcmdiYSgyNDYsMTk2LDY5LC42KSBpbnNldCwgMCAwIDM2cHggcmdiYSgyNDYsMTk2LDY5LC4zNSl9XHJcbi8qIGF1cmEgY2FyZCB3cmFwcGVyICovXHJcbi5pdGVtLWNhcmR7cG9zaXRpb246cmVsYXRpdmU7Ym9yZGVyLXJhZGl1czp2YXIoLS1yYWRpdXMtbWQpO3BhZGRpbmc6MTBweDtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxNDBkZWcscmdiYSgyNTUsMjU1LDI1NSwuMDYpLHJnYmEoMjU1LDI1NSwyNTUsLjA0KSk7b3ZlcmZsb3c6aGlkZGVuO3RyYW5zaXRpb246YWxsIC4zcyBlYXNlfVxyXG4uaXRlbS1jYXJkOmhvdmVye3RyYW5zZm9ybTp0cmFuc2xhdGVZKC0ycHgpO2JveC1zaGFkb3c6MCA4cHggMjRweCByZ2JhKDAsMCwwLC40KX1cclxuLml0ZW0tY2FyZDo6YmVmb3Jle2NvbnRlbnQ6XCJcIjtwb3NpdGlvbjphYnNvbHV0ZTtpbnNldDotMXB4O2JvcmRlci1yYWRpdXM6aW5oZXJpdDtwYWRkaW5nOjFweDtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcscmdiYSgyNTUsMjU1LDI1NSwuMTgpLHJnYmEoMjU1LDI1NSwyNTUsLjAyKSk7LXdlYmtpdC1tYXNrOmxpbmVhci1ncmFkaWVudCgjMDAwIDAgMCkgY29udGVudC1ib3gsbGluZWFyLWdyYWRpZW50KCMwMDAgMCAwKTstd2Via2l0LW1hc2stY29tcG9zaXRlOnhvcjttYXNrLWNvbXBvc2l0ZTpleGNsdWRlO3BvaW50ZXItZXZlbnRzOm5vbmV9XHJcbi5pdGVtLWNhcmRbZGF0YS1yYXJpdHk9XCJjb21tb25cIl17Ym9yZGVyOjFweCBzb2xpZCByZ2JhKDE1NCwxNjAsMTY2LC4yNSl9XHJcbi5pdGVtLWNhcmRbZGF0YS1yYXJpdHk9XCJyYXJlXCJde2JvcmRlcjoxcHggc29saWQgcmdiYSg3OSwyMTIsMjQ1LC4zNSl9XHJcbi5pdGVtLWNhcmRbZGF0YS1yYXJpdHk9XCJlcGljXCJde2JvcmRlcjoxcHggc29saWQgcmdiYSgxNzgsMTA3LDI1NSwuNCl9XHJcbi5pdGVtLWNhcmRbZGF0YS1yYXJpdHk9XCJsZWdlbmRhcnlcIl17Ym9yZGVyOjFweCBzb2xpZCByZ2JhKDI0NiwxOTYsNjksLjQ1KX1cclxuLnVwZ3JhZGUtc3VjY2Vzc3thbmltYXRpb246dXBncmFkZS1mbGFzaCAxcyBlYXNlfVxyXG5Aa2V5ZnJhbWVzIHVwZ3JhZGUtZmxhc2h7MCV7dHJhbnNmb3JtOnNjYWxlKDEpO2JveC1zaGFkb3c6MCAwIDAgcmdiYSg0NiwxOTQsMTI2LDApfTI1JXt0cmFuc2Zvcm06c2NhbGUoMS4wMik7Ym94LXNoYWRvdzowIDAgMzBweCByZ2JhKDQ2LDE5NCwxMjYsLjYpLDAgMCA2MHB4IHJnYmEoNDYsMTk0LDEyNiwuMyl9NTAle3RyYW5zZm9ybTpzY2FsZSgxKTtib3gtc2hhZG93OjAgMCA0MHB4IHJnYmEoNDYsMTk0LDEyNiwuOCksMCAwIDgwcHggcmdiYSg0NiwxOTQsMTI2LC40KX03NSV7dHJhbnNmb3JtOnNjYWxlKDEuMDEpO2JveC1zaGFkb3c6MCAwIDMwcHggcmdiYSg0NiwxOTQsMTI2LC42KSwwIDAgNjBweCByZ2JhKDQ2LDE5NCwxMjYsLjMpfTEwMCV7dHJhbnNmb3JtOnNjYWxlKDEpO2JveC1zaGFkb3c6MCAwIDAgcmdiYSg0NiwxOTQsMTI2LDApfX1cclxuLnVwZ3JhZGUtZmFpbHthbmltYXRpb246dXBncmFkZS1mYWlsLWZsYXNoIDFzIGVhc2V9XHJcbkBrZXlmcmFtZXMgdXBncmFkZS1mYWlsLWZsYXNoezAle3RyYW5zZm9ybTpzY2FsZSgxKTtib3gtc2hhZG93OjAgMCAwIHJnYmEoMjU1LDkyLDkyLDApfTI1JXt0cmFuc2Zvcm06c2NhbGUoMC45OCk7Ym94LXNoYWRvdzowIDAgMjBweCByZ2JhKDI1NSw5Miw5MiwuNSksMCAwIDQwcHggcmdiYSgyNTUsOTIsOTIsLjIpfTUwJXt0cmFuc2Zvcm06c2NhbGUoMSk7Ym94LXNoYWRvdzowIDAgMzBweCByZ2JhKDI1NSw5Miw5MiwuNyksMCAwIDUwcHggcmdiYSgyNTUsOTIsOTIsLjMpfTc1JXt0cmFuc2Zvcm06c2NhbGUoMC45OSk7Ym94LXNoYWRvdzowIDAgMjBweCByZ2JhKDI1NSw5Miw5MiwuNSksMCAwIDQwcHggcmdiYSgyNTUsOTIsOTIsLjIpfTEwMCV7dHJhbnNmb3JtOnNjYWxlKDEpO2JveC1zaGFkb3c6MCAwIDAgcmdiYSgyNTUsOTIsOTIsMCl9fVxyXG4uZnJhZ21lbnQtY2FyZHtkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDo4cHg7YmFja2dyb3VuZDpyZ2JhKDI1NSwyNTUsMjU1LC4wNik7Ym9yZGVyLXJhZGl1czoxMnB4O3BhZGRpbmc6MTJweDtib3JkZXI6MXB4IHNvbGlkIHJnYmEoMTIzLDQ0LDI0NSwuMjUpO3RyYW5zaXRpb246YWxsIC4zcyBlYXNlO3Bvc2l0aW9uOnJlbGF0aXZlO292ZXJmbG93OmhpZGRlbn1cclxuLmZyYWdtZW50LWNhcmQ6OmJlZm9yZXtjb250ZW50OlwiXCI7cG9zaXRpb246YWJzb2x1dGU7dG9wOjA7cmlnaHQ6MDt3aWR0aDo0MHB4O2hlaWdodDo0MHB4O2JhY2tncm91bmQ6cmFkaWFsLWdyYWRpZW50KGNpcmNsZSxyZ2JhKDEyMyw0NCwyNDUsLjMpLHRyYW5zcGFyZW50KTtvcGFjaXR5OjA7dHJhbnNpdGlvbjpvcGFjaXR5IC4zcyBlYXNlO3BvaW50ZXItZXZlbnRzOm5vbmV9XHJcbi5mcmFnbWVudC1jYXJkOmhvdmVyOjpiZWZvcmV7b3BhY2l0eToxO2FuaW1hdGlvbjpjb3JuZXItcHVsc2UgMnMgZWFzZS1pbi1vdXQgaW5maW5pdGV9XHJcbkBrZXlmcmFtZXMgY29ybmVyLXB1bHNlezAlLDEwMCV7dHJhbnNmb3JtOnNjYWxlKDEpO29wYWNpdHk6LjN9NTAle3RyYW5zZm9ybTpzY2FsZSgxLjIpO29wYWNpdHk6LjZ9fVxyXG4uZnJhZ21lbnQtY2FyZC5jYW4tY3JhZnR7Ym9yZGVyLWNvbG9yOnJnYmEoNDYsMTk0LDEyNiwuNSk7Ym94LXNoYWRvdzowIDAgMTJweCByZ2JhKDQ2LDE5NCwxMjYsLjIpO2FuaW1hdGlvbjpmcmFnbWVudC1yZWFkeSAycyBlYXNlLWluLW91dCBpbmZpbml0ZX1cclxuQGtleWZyYW1lcyBmcmFnbWVudC1yZWFkeXswJSwxMDAle2JveC1zaGFkb3c6MCAwIDEycHggcmdiYSg0NiwxOTQsMTI2LC4yKX01MCV7Ym94LXNoYWRvdzowIDAgMjBweCByZ2JhKDQ2LDE5NCwxMjYsLjQpLDAgMCA0MHB4IHJnYmEoNDYsMTk0LDEyNiwuMil9fVxyXG4uZnJhZ21lbnQtaWNvbntmb250LXNpemU6MzJweDt0ZXh0LWFsaWduOmNlbnRlcn1cclxuLmZyYWdtZW50LWluZm97ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6NHB4O3RleHQtYWxpZ246Y2VudGVyfVxyXG4uZnJhZ21lbnQtbmFtZXtmb250LXNpemU6MTRweDtmb250LXdlaWdodDo2MDB9XHJcbi5mcmFnbWVudC1jb3VudHtmb250LXNpemU6MTNweDtvcGFjaXR5Oi44NX1cclxuLmJ0bi1zbXtwYWRkaW5nOjZweCAxMHB4O2ZvbnQtc2l6ZToxM3B4O2hlaWdodDphdXRvfVxyXG4uYWQtb3ZlcmxheXtwb3NpdGlvbjpmaXhlZDtpbnNldDowO2JhY2tncm91bmQ6cmdiYSgwLDAsMCwuNzUpO2JhY2tkcm9wLWZpbHRlcjpibHVyKDhweCk7ei1pbmRleDoxMDAwMDtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpjZW50ZXI7YW5pbWF0aW9uOmZhZGUtaW4gLjNzIGVhc2V9XHJcbi5hZC1kaWFsb2d7bWF4LXdpZHRoOjQyMHB4O3dpZHRoOjkwJTtiYWNrZ3JvdW5kOnZhcigtLXBhbmVsLWdyYWQpO2JvcmRlci1yYWRpdXM6dmFyKC0tcmFkaXVzLWxnKTtib3gtc2hhZG93OnZhcigtLWdsb3cpO3BhZGRpbmc6MjRweDthbmltYXRpb246ZmFkZS1pbiAuM3MgZWFzZX1cclxuLmFkLWNvbnRlbnR7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjEycHh9XHJcbi5hZC1pY29ue2ZvbnQtc2l6ZTo0OHB4O2ZpbHRlcjpkcm9wLXNoYWRvdygwIDAgMTJweCByZ2JhKDEyMyw0NCwyNDUsLjYpKX1cclxuLmFkLXBsYWNlaG9sZGVye2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47YWxpZ24taXRlbXM6Y2VudGVyO21hcmdpbjoxMnB4IDA7cGFkZGluZzoyMHB4O2JhY2tncm91bmQ6cmdiYSgyNTUsMjU1LDI1NSwuMDQpO2JvcmRlci1yYWRpdXM6MTJweDt3aWR0aDoxMDAlfVxyXG4uYWQtcHJvZ3Jlc3MtcmluZ3twb3NpdGlvbjpyZWxhdGl2ZTt3aWR0aDoxMDBweDtoZWlnaHQ6MTAwcHh9XHJcbi5hZC1jaXJjbGUtYmd7ZmlsbDpub25lO3N0cm9rZTpyZ2JhKDI1NSwyNTUsMjU1LC4xKTtzdHJva2Utd2lkdGg6OH1cclxuLmFkLWNpcmNsZS1mZ3tmaWxsOm5vbmU7c3Ryb2tlOnVybCgjZ3JhZCk7c3Ryb2tlLXdpZHRoOjg7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7dHJhbnNmb3JtOnJvdGF0ZSgtOTBkZWcpO3RyYW5zZm9ybS1vcmlnaW46NTAlIDUwJTt0cmFuc2l0aW9uOnN0cm9rZS1kYXNob2Zmc2V0IC4zcyBlYXNlfVxyXG4uYWQtY291bnRkb3due3Bvc2l0aW9uOmFic29sdXRlO2luc2V0OjA7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO2ZvbnQtc2l6ZToyOHB4O2ZvbnQtd2VpZ2h0OjcwMH1cclxuLmFkLWFjdGlvbnN7ZGlzcGxheTpmbGV4O2dhcDoxMnB4O3dpZHRoOjEwMCV9XHJcbi8qIFx1NzdGRlx1NURFNVx1NTJBOFx1NzUzQiAqL1xyXG4ubWluZXItYW5pbWF0aW9ue2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo0cHg7b3BhY2l0eTouOX1cclxuLm1pbmVyLXN2Z3t3aWR0aDoxMDBweDtoZWlnaHQ6MTAwcHh9XHJcbi5taW5lci1ib2R5e2FuaW1hdGlvbjptaW5lci1ib3VuY2UgMS41cyBlYXNlLWluLW91dCBpbmZpbml0ZX1cclxuQGtleWZyYW1lcyBtaW5lci1ib3VuY2V7MCUsMTAwJXt0cmFuc2Zvcm06dHJhbnNsYXRlWSgwKX01MCV7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoLTRweCl9fVxyXG4ubWluZXItYXJte3RyYW5zZm9ybS1vcmlnaW46MTEwcHggOTVweDthbmltYXRpb246cGlja2F4ZS1zd2luZyAxLjJzIGVhc2UtaW4tb3V0IGluZmluaXRlfVxyXG5Aa2V5ZnJhbWVzIHBpY2theGUtc3dpbmd7MCUsMTAwJXt0cmFuc2Zvcm06cm90YXRlKDBkZWcpfTMwJXt0cmFuc2Zvcm06cm90YXRlKC0zNWRlZyl9NjAle3RyYW5zZm9ybTpyb3RhdGUoLTI1ZGVnKX19XHJcbi5taW5lci1saWdodHthbmltYXRpb246aGVsbWV0LWxpZ2h0IDJzIGVhc2UtaW4tb3V0IGluZmluaXRlfVxyXG5Aa2V5ZnJhbWVzIGhlbG1ldC1saWdodHswJSwxMDAle29wYWNpdHk6LjZ9NTAle29wYWNpdHk6MX19XHJcbi5vcmUtcGFydGljbGV7YW5pbWF0aW9uOm9yZS1zcGFyayAxLjJzIGVhc2Utb3V0IGluZmluaXRlfVxyXG4ub3JlLXBhcnRpY2xlLnAxe2FuaW1hdGlvbi1kZWxheTowLjNzfVxyXG4ub3JlLXBhcnRpY2xlLnAye2FuaW1hdGlvbi1kZWxheTowLjRzfVxyXG4ub3JlLXBhcnRpY2xlLnAze2FuaW1hdGlvbi1kZWxheTowLjM1c31cclxuQGtleWZyYW1lcyBvcmUtc3Bhcmt7MCV7b3BhY2l0eTowO3RyYW5zZm9ybTp0cmFuc2xhdGUoMCwwKSBzY2FsZSgxKX0zMCV7b3BhY2l0eToxfTEwMCV7b3BhY2l0eTowO3RyYW5zZm9ybTp0cmFuc2xhdGUoLTEwcHgsMTVweCkgc2NhbGUoMC4zKX19XHJcbi5taW5lci1zdGF0dXN7Zm9udC1zaXplOjEzcHg7b3BhY2l0eTouNzU7bGV0dGVyLXNwYWNpbmc6LjA1ZW19XHJcbi5taW5lci1pZGxle2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo0cHg7b3BhY2l0eTouNX1cclxuLm1pbmVyLWlkbGUgc3Zne3dpZHRoOjc1cHg7aGVpZ2h0Ojc1cHh9XHJcbi5pZGxlLW1pbmVye2FuaW1hdGlvbjppZGxlLWJyZWF0aGUgM3MgZWFzZS1pbi1vdXQgaW5maW5pdGV9XHJcbkBrZXlmcmFtZXMgaWRsZS1icmVhdGhlezAlLDEwMCV7b3BhY2l0eTouNjt0cmFuc2Zvcm06c2NhbGUoMSl9NTAle29wYWNpdHk6Ljg7dHJhbnNmb3JtOnNjYWxlKDEuMDIpfX1cclxuQGtleWZyYW1lcyB3YXJuaW5nLXB1bHNlezAlLDEwMCV7dHJhbnNmb3JtOnNjYWxlKDEpO29wYWNpdHk6LjZ9NTAle3RyYW5zZm9ybTpzY2FsZSgxLjEpO29wYWNpdHk6MX19XHJcbi5jcml0aWNhbC1taW5pbmcgLm1pbmVyLWFybXthbmltYXRpb246cGlja2F4ZS1jcml0aWNhbCAuNHMgZWFzZS1pbi1vdXQgMyFpbXBvcnRhbnR9XHJcbkBrZXlmcmFtZXMgcGlja2F4ZS1jcml0aWNhbHswJSwxMDAle3RyYW5zZm9ybTpyb3RhdGUoMGRlZyl9NTAle3RyYW5zZm9ybTpyb3RhdGUoLTQ1ZGVnKX19XHJcbi8qIFx1NUI5RFx1N0JCMVx1NTJBOFx1NzUzQiAqL1xyXG4udHJlYXN1cmUtY2hlc3R7ZGlzcGxheTppbmxpbmUtYmxvY2s7dmVydGljYWwtYWxpZ246bWlkZGxlfVxyXG4uY2hlc3QtYm9keXthbmltYXRpb246Y2hlc3QtYm91bmNlIC44cyBlYXNlLWluLW91dCBpbmZpbml0ZX1cclxuQGtleWZyYW1lcyBjaGVzdC1ib3VuY2V7MCUsMTAwJXt0cmFuc2Zvcm06dHJhbnNsYXRlWSgwKX01MCV7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoLTJweCl9fVxyXG4uY2hlc3QtbGlke3RyYW5zZm9ybS1vcmlnaW46NTAlIDEwcHg7YW5pbWF0aW9uOmNoZXN0LW9wZW4gMnMgZWFzZS1pbi1vdXQgaW5maW5pdGV9XHJcbkBrZXlmcmFtZXMgY2hlc3Qtb3BlbnswJSw5MCV7dHJhbnNmb3JtOnJvdGF0ZVgoMGRlZyl9OTUle3RyYW5zZm9ybTpyb3RhdGVYKC0xNWRlZyl9MTAwJXt0cmFuc2Zvcm06cm90YXRlWCgwZGVnKX19XHJcbi5jaGVzdC1jb2lucyAuY29pbnthbmltYXRpb246Y29pbi1wb3AgMS41cyBlYXNlLW91dCBpbmZpbml0ZX1cclxuLmNvaW4uYzF7YW5pbWF0aW9uLWRlbGF5OjBzfVxyXG4uY29pbi5jMnthbmltYXRpb24tZGVsYXk6MC4xNXN9XHJcbi5jb2luLmMze2FuaW1hdGlvbi1kZWxheTowLjNzfVxyXG5Aa2V5ZnJhbWVzIGNvaW4tcG9wezAlLDgwJXtvcGFjaXR5OjA7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoMCkgc2NhbGUoMCl9ODUle29wYWNpdHk6MTt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtOHB4KSBzY2FsZSgxLjIpfTEwMCV7b3BhY2l0eTowO3RyYW5zZm9ybTp0cmFuc2xhdGVZKC0xMnB4KSBzY2FsZSgwLjgpfX1cclxuLyogXHU1MjUxXHU2QzE0XHU3Mjc5XHU2NTQ4ICovXHJcbi5zd29yZC1zbGFzaHtkaXNwbGF5OmlubGluZS1ibG9jazt2ZXJ0aWNhbC1hbGlnbjptaWRkbGV9XHJcbi5zbGFzaC10cmFpbHthbmltYXRpb246c2xhc2gtYW5pbSAxcyBlYXNlLWluLW91dCBpbmZpbml0ZX1cclxuLnNsYXNoMXthbmltYXRpb24tZGVsYXk6MHN9XHJcbi5zbGFzaDJ7YW5pbWF0aW9uLWRlbGF5OjAuMXN9XHJcbkBrZXlmcmFtZXMgc2xhc2gtYW5pbXswJSw3MCV7b3BhY2l0eTowO3N0cm9rZS1kYXNoYXJyYXk6MCAxMDA7c3Ryb2tlLWRhc2hvZmZzZXQ6MH03NSV7b3BhY2l0eTowLjg7c3Ryb2tlLWRhc2hhcnJheToyMCAxMDA7c3Ryb2tlLWRhc2hvZmZzZXQ6MH0xMDAle29wYWNpdHk6MDtzdHJva2UtZGFzaGFycmF5OjIwIDEwMDtzdHJva2UtZGFzaG9mZnNldDotMjB9fVxyXG4vKiBcdTkxRDFcdTVFMDFcdTY1Q0JcdThGNkMgKi9cclxuLnNwaW5uaW5nLWNvaW57ZGlzcGxheTppbmxpbmUtYmxvY2s7dmVydGljYWwtYWxpZ246bWlkZGxlfVxyXG4uY29pbi1zcGlue2FuaW1hdGlvbjpjb2luLXJvdGF0ZSAzcyBsaW5lYXIgaW5maW5pdGV9XHJcbkBrZXlmcmFtZXMgY29pbi1yb3RhdGV7MCV7dHJhbnNmb3JtOnJvdGF0ZVkoMGRlZyl9MTAwJXt0cmFuc2Zvcm06cm90YXRlWSgzNjBkZWcpfX1cclxuLyogXHU1OTU2XHU2NzZGXHU1MkE4XHU3NTNCICovXHJcbi50cm9waHktYW5pbXtkaXNwbGF5OmlubGluZS1ibG9jazt2ZXJ0aWNhbC1hbGlnbjptaWRkbGV9XHJcbi50cm9waHktYm91bmNle2FuaW1hdGlvbjp0cm9waHktanVtcCAycyBlYXNlLWluLW91dCBpbmZpbml0ZX1cclxuQGtleWZyYW1lcyB0cm9waHktanVtcHswJSwxMDAle3RyYW5zZm9ybTp0cmFuc2xhdGVZKDApfTUwJXt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtM3B4KX19XHJcbi50cm9waHktc3RhcnthbmltYXRpb246c3Rhci10d2lua2xlIDEuNXMgZWFzZS1pbi1vdXQgaW5maW5pdGV9XHJcbkBrZXlmcmFtZXMgc3Rhci10d2lua2xlezAlLDEwMCV7b3BhY2l0eTowLjY7dHJhbnNmb3JtOnNjYWxlKDEpfTUwJXtvcGFjaXR5OjE7dHJhbnNmb3JtOnNjYWxlKDEuMyl9fVxyXG4vKiBcdTgwRkRcdTkxQ0ZcdTZDRTJcdTdFQjkgKi9cclxuLmVuZXJneS1yaXBwbGV7b3BhY2l0eTowO3RyYW5zaXRpb246b3BhY2l0eSAuM3MgZWFzZX1cclxuLmJ0bi1lbmVyZ3k6aG92ZXIgLmVuZXJneS1yaXBwbGV7b3BhY2l0eToxfVxyXG4ucmlwcGxle2FuaW1hdGlvbjpyaXBwbGUtZXhwYW5kIDJzIGVhc2Utb3V0IGluZmluaXRlfVxyXG4ucjF7YW5pbWF0aW9uLWRlbGF5OjBzfVxyXG4ucjJ7YW5pbWF0aW9uLWRlbGF5OjAuM3N9XHJcbi5yM3thbmltYXRpb24tZGVsYXk6MC42c31cclxuQGtleWZyYW1lcyByaXBwbGUtZXhwYW5kezAle3I6MjA7b3BhY2l0eTowLjZ9MTAwJXtyOjQ1O29wYWNpdHk6MH19XHJcbi8qIFx1ODhDNVx1OEY3RFx1N0M5Mlx1NUI1MFx1NkQ0MSAqL1xyXG4ubG9hZGluZy1wYXJ0aWNsZXN7b3BhY2l0eTowO3RyYW5zaXRpb246b3BhY2l0eSAuM3MgZWFzZX1cclxuLm1pbmUtcHJvZ3Jlc3MtZmlsbDpub3QoW3N0eWxlKj1cIndpZHRoOiAwXCJdKSB+IC5sb2FkaW5nLXBhcnRpY2xlc3tvcGFjaXR5OjF9XHJcbi5wYXJ0aWNsZXthbmltYXRpb246cGFydGljbGUtZmxvdyAycyBsaW5lYXIgaW5maW5pdGV9XHJcbi5wYXJ0MXthbmltYXRpb24tZGVsYXk6MHN9XHJcbi5wYXJ0MnthbmltYXRpb24tZGVsYXk6MC40c31cclxuLnBhcnQze2FuaW1hdGlvbi1kZWxheTowLjhzfVxyXG5Aa2V5ZnJhbWVzIHBhcnRpY2xlLWZsb3d7MCV7Y3g6MDtvcGFjaXR5OjB9MTAle29wYWNpdHk6MX05MCV7b3BhY2l0eToxfTEwMCV7Y3g6NDAwO29wYWNpdHk6MH19XHJcbi8qIFx1OEQ0NFx1NkU5MFx1NTM2MVx1NzI0N1x1N0M5Mlx1NUI1MCAqL1xyXG4uc3RhdC1wYXJ0aWNsZXN7b3BhY2l0eTowO3RyYW5zaXRpb246b3BhY2l0eSAuM3MgZWFzZX1cclxuLnN0YXQtYW5pbWF0ZWQ6aG92ZXIgLnN0YXQtcGFydGljbGVze29wYWNpdHk6MX1cclxuLnN0YXQtcGFydGljbGV7YW5pbWF0aW9uOnN0YXQtZmxvYXQgM3MgZWFzZS1pbi1vdXQgaW5maW5pdGV9XHJcbi5zcDF7YW5pbWF0aW9uLWRlbGF5OjBzfVxyXG4uc3Aye2FuaW1hdGlvbi1kZWxheTowLjVzfVxyXG4uc3Aze2FuaW1hdGlvbi1kZWxheToxc31cclxuQGtleWZyYW1lcyBzdGF0LWZsb2F0ezAle2N5OjI1O29wYWNpdHk6MH0zMCV7b3BhY2l0eTowLjZ9NjAle2N5OjE1O29wYWNpdHk6MC44fTEwMCV7Y3k6ODtvcGFjaXR5OjB9fVxyXG4vKiBcdTk1RUFcdTc1MzVcdTY1NDhcdTY3OUMgKi9cclxuLmxpZ2h0bmluZy1lZmZlY3R7cG9zaXRpb246YWJzb2x1dGU7aW5zZXQ6MDtwb2ludGVyLWV2ZW50czpub25lO3otaW5kZXg6MTB9XHJcbi5saWdodG5pbmctZ3JvdXB7YW5pbWF0aW9uOmxpZ2h0bmluZy1mbGFzaCAuNnMgZWFzZX1cclxuQGtleWZyYW1lcyBsaWdodG5pbmctZmxhc2h7MCV7b3BhY2l0eTowfTEwJXtvcGFjaXR5OjF9MjAle29wYWNpdHk6MH0zMCV7b3BhY2l0eToxfTQwJXtvcGFjaXR5OjB9fVxyXG4uYm9sdHtzdHJva2UtZGFzaGFycmF5OjIwMDtzdHJva2UtZGFzaG9mZnNldDoyMDA7YW5pbWF0aW9uOmJvbHQtZHJhdyAuM3MgZWFzZSBmb3J3YXJkc31cclxuQGtleWZyYW1lcyBib2x0LWRyYXd7dG97c3Ryb2tlLWRhc2hvZmZzZXQ6MH19XHJcbi8qIFx1OUI1NFx1NkNENVx1OTYzNSAqL1xyXG4ubWFnaWMtY2lyY2xle3Bvc2l0aW9uOmFic29sdXRlO2luc2V0OjA7cG9pbnRlci1ldmVudHM6bm9uZTtvcGFjaXR5OjAuMzt6LWluZGV4OjB9XHJcbi5tYWdpYy1yaW5ne3N0cm9rZS1kYXNoYXJyYXk6NCA4O2FuaW1hdGlvbjptYWdpYy1yb3RhdGUgMjBzIGxpbmVhciBpbmZpbml0ZX1cclxuLnJpbmctMXthbmltYXRpb24tZHVyYXRpb246MjBzfVxyXG4ucmluZy0ye2FuaW1hdGlvbi1kdXJhdGlvbjoxNXM7YW5pbWF0aW9uLWRpcmVjdGlvbjpyZXZlcnNlfVxyXG4ucmluZy0ze2FuaW1hdGlvbi1kdXJhdGlvbjoyNXN9XHJcbkBrZXlmcmFtZXMgbWFnaWMtcm90YXRle2Zyb217dHJhbnNmb3JtOnJvdGF0ZSgwZGVnKTt0cmFuc2Zvcm0tb3JpZ2luOjUwJSA1MCV9dG97dHJhbnNmb3JtOnJvdGF0ZSgzNjBkZWcpO3RyYW5zZm9ybS1vcmlnaW46NTAlIDUwJX19XHJcbi5ydW5le2FuaW1hdGlvbjpydW5lLXB1bHNlIDJzIGVhc2UtaW4tb3V0IGluZmluaXRlfVxyXG4ucjF7YW5pbWF0aW9uLWRlbGF5OjBzfVxyXG4ucjJ7YW5pbWF0aW9uLWRlbGF5OjAuNXN9XHJcbi5yM3thbmltYXRpb24tZGVsYXk6MXN9XHJcbi5yNHthbmltYXRpb24tZGVsYXk6MS41c31cclxuQGtleWZyYW1lcyBydW5lLXB1bHNlezAlLDEwMCV7cjozO29wYWNpdHk6LjZ9NTAle3I6NTtvcGFjaXR5OjF9fVxyXG4uY2VudGVyLXN0YXJ7YW5pbWF0aW9uOnN0YXItcm90YXRlIDRzIGxpbmVhciBpbmZpbml0ZX1cclxuQGtleWZyYW1lcyBzdGFyLXJvdGF0ZXtmcm9te3RyYW5zZm9ybTpyb3RhdGUoMGRlZyk7dHJhbnNmb3JtLW9yaWdpbjoxNTBweCAxNTBweH10b3t0cmFuc2Zvcm06cm90YXRlKDM2MGRlZyk7dHJhbnNmb3JtLW9yaWdpbjoxNTBweCAxNTBweH19XHJcbi8qIFx1NjYxRlx1N0E3QVx1ODBDQ1x1NjY2RiAqL1xyXG4uc3RhcmZpZWxke29wYWNpdHk6MC40fVxyXG4uc3RhcnthbmltYXRpb246c3Rhci10d2lua2xlLWJnIDRzIGVhc2UtaW4tb3V0IGluZmluaXRlfVxyXG5Aa2V5ZnJhbWVzIHN0YXItdHdpbmtsZS1iZ3swJSwxMDAle29wYWNpdHk6MH01MCV7b3BhY2l0eTowLjh9fVxyXG4vKiBcdTgwRkRcdTkxQ0ZcdTgxMDlcdTUxQjIgKi9cclxuLnB1bHNlLXdhdmV7YW5pbWF0aW9uOnB1bHNlLWV4cGFuZCAzcyBlYXNlLW91dCBpbmZpbml0ZX1cclxuLndhdmUtMXthbmltYXRpb24tZGVsYXk6MHN9XHJcbi53YXZlLTJ7YW5pbWF0aW9uLWRlbGF5OjFzfVxyXG4ud2F2ZS0ze2FuaW1hdGlvbi1kZWxheToyc31cclxuQGtleWZyYW1lcyBwdWxzZS1leHBhbmR7MCV7cjoxMDtvcGFjaXR5OjAuOH0xMDAle3I6OTA7b3BhY2l0eTowfX1cclxuLyogXHU2NTcwXHU2MzZFXHU2RDQxICovXHJcbi5kYXRhLXN0cmVhbXthbmltYXRpb246c3RyZWFtLWZsb3cgMnMgbGluZWFyIGluZmluaXRlfVxyXG5Aa2V5ZnJhbWVzIHN0cmVhbS1mbG93e2Zyb217dHJhbnNmb3JtOnRyYW5zbGF0ZVkoLTEwMHB4KX10b3t0cmFuc2Zvcm06dHJhbnNsYXRlWSgxMDBweCl9fVxyXG4vKiB2ZXJ0aWNhbCB0aW1lbGluZSAqL1xyXG4udGltZWxpbmV7cG9zaXRpb246cmVsYXRpdmU7bWFyZ2luLXRvcDo4cHg7cGFkZGluZy1sZWZ0OjE2cHh9XHJcbi50aW1lbGluZTo6YmVmb3Jle2NvbnRlbnQ6XCJcIjtwb3NpdGlvbjphYnNvbHV0ZTtsZWZ0OjZweDt0b3A6MDtib3R0b206MDt3aWR0aDoycHg7YmFja2dyb3VuZDpyZ2JhKDI1NSwyNTUsMjU1LC4xKTtwb2ludGVyLWV2ZW50czpub25lfVxyXG4udGltZWxpbmUtaXRlbXtwb3NpdGlvbjpyZWxhdGl2ZTttYXJnaW46OHB4IDAgOHB4IDB9XHJcbi50aW1lbGluZS1pdGVtIC5kb3R7cG9zaXRpb246YWJzb2x1dGU7bGVmdDotMTJweDt0b3A6MnB4O3dpZHRoOjEwcHg7aGVpZ2h0OjEwcHg7Ym9yZGVyLXJhZGl1czo5OTlweDtiYWNrZ3JvdW5kOnZhcigtLXJhcml0eS1yYXJlKTtib3gtc2hhZG93OjAgMCAxMHB4IHJnYmEoNzksMjEyLDI0NSwuNSl9XHJcbi50aW1lbGluZS1pdGVtIC50aW1le29wYWNpdHk6Ljc1O2ZvbnQtc2l6ZToxMnB4fVxyXG4udGltZWxpbmUtaXRlbSAuZGVzY3ttYXJnaW4tdG9wOjJweH1cclxuLyogYWN0aW9uIGJ1dHRvbnMgbGluZSAqL1xyXG4uYWN0aW9uc3tkaXNwbGF5OmZsZXg7Z2FwOjZweDtmbGV4LXdyYXA6d3JhcH1cclxuLyogc3VidGxlIGhvdmVyICovXHJcbi5ob3Zlci1saWZ0e3RyYW5zaXRpb246dHJhbnNmb3JtIHZhcigtLWR1cikgdmFyKC0tZWFzZSksIGJveC1zaGFkb3cgdmFyKC0tZHVyKSB2YXIoLS1lYXNlKX1cclxuLmhvdmVyLWxpZnQ6aG92ZXJ7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoLTFweCl9XHJcbi8qIHJpbmcgbWV0ZXIgKi9cclxuLnJpbmd7LS1zaXplOjExNnB4Oy0tdGhpY2s6MTBweDtwb3NpdGlvbjpyZWxhdGl2ZTt3aWR0aDp2YXIoLS1zaXplKTtoZWlnaHQ6dmFyKC0tc2l6ZSk7Ym9yZGVyLXJhZGl1czo1MCU7YmFja2dyb3VuZDpjb25pYy1ncmFkaWVudCgjN0IyQ0Y1IDBkZWcsIHJnYmEoMjU1LDI1NSwyNTUsLjA4KSAwZGVnKX1cclxuLnJpbmc6OmFmdGVye2NvbnRlbnQ6XCJcIjtwb3NpdGlvbjphYnNvbHV0ZTtpbnNldDpjYWxjKHZhcigtLXRoaWNrKSk7Ym9yZGVyLXJhZGl1czppbmhlcml0O2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDE4MGRlZyxyZ2JhKDI1NSwyNTUsMjU1LC4wNikscmdiYSgyNTUsMjU1LDI1NSwuMDIpKTtwb2ludGVyLWV2ZW50czpub25lfVxyXG4ucmluZyAubGFiZWx7cG9zaXRpb246YWJzb2x1dGU7aW5zZXQ6MDtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpjZW50ZXI7Zm9udC13ZWlnaHQ6NzAwfVxyXG4vKiB0b2FzdCAqL1xyXG4udG9hc3Qtd3JhcHtwb3NpdGlvbjpmaXhlZDtyaWdodDoxNnB4O2JvdHRvbToxNnB4O2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjhweDt6LWluZGV4Ojk5OTl9XHJcbi50b2FzdHttYXgtd2lkdGg6MzQwcHg7cGFkZGluZzoxMHB4IDEycHg7Ym9yZGVyLXJhZGl1czoxMnB4O2NvbG9yOiNmZmY7YmFja2dyb3VuZDpyZ2JhKDMwLDMwLDUwLC45Nik7Ym94LXNoYWRvdzp2YXIoLS1nbG93KTtwb3NpdGlvbjpyZWxhdGl2ZTtvdmVyZmxvdzpoaWRkZW47Ym9yZGVyOjFweCBzb2xpZCByZ2JhKDEyMyw0NCwyNDUsLjMpO2FuaW1hdGlvbjp0b2FzdC1zbGlkZS1pbiAuM3MgZWFzZX1cclxuLnRvYXN0LnN1Y2Nlc3N7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTgwZGVnLHJnYmEoNDYsMTk0LDEyNiwuMTYpLHJnYmEoMzAsMzAsNTAsLjk2KSl9XHJcbi50b2FzdC53YXJue2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDE4MGRlZyxyZ2JhKDI0NiwxOTYsNjksLjE4KSxyZ2JhKDMwLDMwLDUwLC45NikpfVxyXG4udG9hc3QuZXJyb3J7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTgwZGVnLHJnYmEoMjU1LDkyLDkyLC4xOCkscmdiYSgzMCwzMCw1MCwuOTYpKX1cclxuLnRvYXN0IC5saWZle3Bvc2l0aW9uOmFic29sdXRlO2xlZnQ6MDtib3R0b206MDtoZWlnaHQ6MnB4O2JhY2tncm91bmQ6IzdCMkNGNTthbmltYXRpb246dG9hc3QtbGlmZSB2YXIoLS1saWZlLDMuNXMpIGxpbmVhciBmb3J3YXJkc31cclxuQGtleWZyYW1lcyB0b2FzdC1saWZle2Zyb217d2lkdGg6MTAwJX10b3t3aWR0aDowfX1cclxuQGtleWZyYW1lcyB0b2FzdC1zbGlkZS1pbntmcm9te29wYWNpdHk6MDt0cmFuc2Zvcm06dHJhbnNsYXRlWCgyMHB4KX10b3tvcGFjaXR5OjE7dHJhbnNmb3JtOnRyYW5zbGF0ZVgoMCl9fVxyXG5AbWVkaWEgKHByZWZlcnMtcmVkdWNlZC1tb3Rpb246cmVkdWNlKXsqe2FuaW1hdGlvbi1kdXJhdGlvbjouMDAxbXMhaW1wb3J0YW50O2FuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6MSFpbXBvcnRhbnQ7dHJhbnNpdGlvbi1kdXJhdGlvbjowbXMhaW1wb3J0YW50fX1cclxuXHJcbi8qIHJlc3BvbnNpdmUgd2lkdGggKyBkZXNrdG9wIGdyaWQgbGF5b3V0IGZvciBmdWxsbmVzcyAqL1xyXG5AbWVkaWEgKG1pbi13aWR0aDo5MDBweCl7OnJvb3R7LS1jb250YWluZXItbWF4OjkyMHB4fX1cclxuQG1lZGlhIChtaW4td2lkdGg6MTIwMHB4KXs6cm9vdHstLWNvbnRhaW5lci1tYXg6MTA4MHB4fX1cclxuXHJcbi5jb250YWluZXIuZ3JpZC0ye2Rpc3BsYXk6Z3JpZDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6MWZyO2dhcDoxMnB4fVxyXG5AbWVkaWEgKG1pbi13aWR0aDo5ODBweCl7XHJcbiAgLmNvbnRhaW5lci5ncmlkLTJ7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOjFmciAxZnI7YWxpZ24taXRlbXM6c3RhcnR9XHJcbiAgLmNvbnRhaW5lci5ncmlkLTI+LmNhcmQ6Zmlyc3QtY2hpbGR7Z3JpZC1jb2x1bW46MS8tMX1cclxufVxyXG5cclxuLyogZGVjb3JhdGl2ZSBwYWdlIG92ZXJsYXlzOiBhdXJvcmEsIGdyaWQgbGluZXMsIGJvdHRvbSBnbG93ICovXHJcbmh0bWw6OmJlZm9yZXtjb250ZW50OlwiXCI7cG9zaXRpb246Zml4ZWQ7aW5zZXQ6MDtwb2ludGVyLWV2ZW50czpub25lO3otaW5kZXg6LTI7b3BhY2l0eTouMDM1O2JhY2tncm91bmQtaW1hZ2U6bGluZWFyLWdyYWRpZW50KHJnYmEoMjU1LDI1NSwyNTUsLjA0KSAxcHgsIHRyYW5zcGFyZW50IDFweCksbGluZWFyLWdyYWRpZW50KDkwZGVnLCByZ2JhKDI1NSwyNTUsMjU1LC4wNCkgMXB4LCB0cmFuc3BhcmVudCAxcHgpO2JhY2tncm91bmQtc2l6ZToyNHB4IDI0cHh9XHJcbmJvZHk6OmJlZm9yZXtjb250ZW50OlwiXCI7cG9zaXRpb246Zml4ZWQ7cmlnaHQ6LTEwdnc7dG9wOi0xOHZoO3dpZHRoOjcwdnc7aGVpZ2h0Ojcwdmg7cG9pbnRlci1ldmVudHM6bm9uZTt6LWluZGV4Oi0xO2ZpbHRlcjpibHVyKDUwcHgpO29wYWNpdHk6LjU1O2JhY2tncm91bmQ6cmFkaWFsLWdyYWRpZW50KGNsb3Nlc3Qtc2lkZSBhdCAyNSUgNDAlLCByZ2JhKDEyMyw0NCwyNDUsLjM1KSwgdHJhbnNwYXJlbnQgNjUlKSwgcmFkaWFsLWdyYWRpZW50KGNsb3Nlc3Qtc2lkZSBhdCA3MCUgNjAlLCByZ2JhKDQ0LDEzNywyNDUsLjI1KSwgdHJhbnNwYXJlbnQgNzAlKTttaXgtYmxlbmQtbW9kZTpzY3JlZW47YW5pbWF0aW9uOmF1cm9yYS1hIDE4cyBlYXNlLWluLW91dCBpbmZpbml0ZSBhbHRlcm5hdGV9XHJcbmJvZHk6OmFmdGVye2NvbnRlbnQ6XCJcIjtwb3NpdGlvbjpmaXhlZDtsZWZ0Oi0xMHZ3O2JvdHRvbTotMjJ2aDt3aWR0aDoxMjB2dztoZWlnaHQ6NjB2aDtwb2ludGVyLWV2ZW50czpub25lO3otaW5kZXg6LTE7ZmlsdGVyOmJsdXIoNjBweCk7b3BhY2l0eTouNzU7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoMTIwdncgNjB2aCBhdCA1MCUgMTAwJSwgcmdiYSg0NCwxMzcsMjQ1LC4yMiksIHRyYW5zcGFyZW50IDY1JSksIGNvbmljLWdyYWRpZW50KGZyb20gMjAwZGVnIGF0IDUwJSA3NSUsIHJnYmEoMTIzLDQ0LDI0NSwuMTgpLCByZ2JhKDQ0LDEzNywyNDUsLjEyKSwgdHJhbnNwYXJlbnQgNzAlKTttaXgtYmxlbmQtbW9kZTpzY3JlZW47YW5pbWF0aW9uOmF1cm9yYS1iIDIycyBlYXNlLWluLW91dCBpbmZpbml0ZSBhbHRlcm5hdGV9XHJcbkBrZXlmcmFtZXMgYXVyb3JhLWF7MCV7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoMCl9MTAwJXt0cmFuc2Zvcm06dHJhbnNsYXRlWSgxNHB4KX19XHJcbkBrZXlmcmFtZXMgYXVyb3JhLWJ7MCV7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoMCl9MTAwJXt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtMTJweCl9fVxyXG5gO1xyXG4gIGNvbnN0IHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcclxuICBzdHlsZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtdWknLCAnbWluZXItZ2FtZScpO1xyXG4gIHN0eWxlLnRleHRDb250ZW50ID0gY3NzO1xyXG4gIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xyXG4gIGluamVjdGVkID0gdHJ1ZTtcclxuXHJcbiAgLy8gc29mdCBzdGFyZmllbGQgYmFja2dyb3VuZCAodmVyeSBsaWdodClcclxuICB0cnkge1xyXG4gICAgY29uc3QgZXhpc3RzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtc3RhcnNdJyk7XHJcbiAgICBpZiAoIWV4aXN0cykge1xyXG4gICAgICBjb25zdCBjdnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuICAgICAgY3ZzLnNldEF0dHJpYnV0ZSgnZGF0YS1zdGFycycsICcnKTtcclxuICAgICAgY3ZzLnN0eWxlLmNzc1RleHQgPSAncG9zaXRpb246Zml4ZWQ7aW5zZXQ6MDt6LWluZGV4Oi0yO29wYWNpdHk6LjQwO3BvaW50ZXItZXZlbnRzOm5vbmU7JztcclxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjdnMpO1xyXG4gICAgICBjb25zdCBjdHggPSBjdnMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgY29uc3Qgc3RhcnMgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiA4MCB9LCAoKSA9PiAoeyB4OiBNYXRoLnJhbmRvbSgpLCB5OiBNYXRoLnJhbmRvbSgpLCByOiBNYXRoLnJhbmRvbSgpKjEuMiswLjIsIHM6IE1hdGgucmFuZG9tKCkqMC44KzAuMiB9KSk7XHJcbiAgICAgIHR5cGUgTWV0ZW9yID0geyB4OiBudW1iZXI7IHk6IG51bWJlcjsgdng6IG51bWJlcjsgdnk6IG51bWJlcjsgbGlmZTogbnVtYmVyOyB0dGw6IG51bWJlciB9O1xyXG4gICAgICBjb25zdCBtZXRlb3JzOiBNZXRlb3JbXSA9IFtdO1xyXG4gICAgICBjb25zdCBzcGF3bk1ldGVvciA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCB4ID0gTWF0aC5yYW5kb20oKSpjdnMud2lkdGgqMC42ICsgY3ZzLndpZHRoKjAuMjtcclxuICAgICAgICBjb25zdCB5ID0gLTIwOyAvLyBmcm9tIHRvcFxyXG4gICAgICAgIGNvbnN0IHNwZWVkID0gMyArIE1hdGgucmFuZG9tKCkqMztcclxuICAgICAgICBjb25zdCBhbmdsZSA9IE1hdGguUEkqMC44ICsgTWF0aC5yYW5kb20oKSowLjI7IC8vIGRpYWdvbmFsbHlcclxuICAgICAgICBtZXRlb3JzLnB1c2goeyB4LCB5LCB2eDogTWF0aC5jb3MoYW5nbGUpKnNwZWVkLCB2eTogTWF0aC5zaW4oYW5nbGUpKnNwZWVkLCBsaWZlOiAwLCB0dGw6IDEyMDAgKyBNYXRoLnJhbmRvbSgpKjgwMCB9KTtcclxuICAgICAgfTtcclxuICAgICAgLy8gZ2VudGxlIHBsYW5ldHMvb3Jic1xyXG4gICAgICBjb25zdCBvcmJzID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogMiB9LCAoKSA9PiAoeyB4OiBNYXRoLnJhbmRvbSgpLCB5OiBNYXRoLnJhbmRvbSgpKjAuNSArIDAuMSwgcjogTWF0aC5yYW5kb20oKSo4MCArIDcwLCBodWU6IE1hdGgucmFuZG9tKCkgfSkpO1xyXG4gICAgICBjb25zdCBmaXQgPSAoKSA9PiB7IGN2cy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoOyBjdnMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0OyB9O1xyXG4gICAgICBmaXQoKTtcclxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGZpdCk7XHJcbiAgICAgIGxldCB0ID0gMDtcclxuICAgICAgY29uc3QgbG9vcCA9ICgpID0+IHtcclxuICAgICAgICBpZiAoIWN0eCkgcmV0dXJuO1xyXG4gICAgICAgIHQgKz0gMC4wMTY7XHJcbiAgICAgICAgY3R4LmNsZWFyUmVjdCgwLDAsY3ZzLndpZHRoLGN2cy5oZWlnaHQpO1xyXG4gICAgICAgIC8vIHNvZnQgb3Jic1xyXG4gICAgICAgIGZvciAoY29uc3Qgb2Igb2Ygb3Jicykge1xyXG4gICAgICAgICAgY29uc3QgeCA9IG9iLnggKiBjdnMud2lkdGgsIHkgPSBvYi55ICogY3ZzLmhlaWdodDtcclxuICAgICAgICAgIGNvbnN0IHB1bHNlID0gKE1hdGguc2luKHQqMC42ICsgeCowLjAwMTUpKjAuNSswLjUpKjAuMTI7XHJcbiAgICAgICAgICBjb25zdCByYWQgPSBvYi5yICogKDErcHVsc2UpO1xyXG4gICAgICAgICAgY29uc3QgZ3JhZCA9IGN0eC5jcmVhdGVSYWRpYWxHcmFkaWVudCh4LCB5LCAwLCB4LCB5LCByYWQpO1xyXG4gICAgICAgICAgZ3JhZC5hZGRDb2xvclN0b3AoMCwgJ3JnYmEoMTEwLDgwLDI1NSwwLjEwKScpO1xyXG4gICAgICAgICAgZ3JhZC5hZGRDb2xvclN0b3AoMSwgJ3JnYmEoMCwwLDAsMCknKTtcclxuICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBncmFkO1xyXG4gICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgY3R4LmFyYyh4LCB5LCByYWQsIDAsIE1hdGguUEkqMik7XHJcbiAgICAgICAgICBjdHguZmlsbCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBzdGFycyB0d2lua2xlXHJcbiAgICAgICAgZm9yIChjb25zdCBzdCBvZiBzdGFycykge1xyXG4gICAgICAgICAgY29uc3QgeCA9IHN0LnggKiBjdnMud2lkdGgsIHkgPSBzdC55ICogY3ZzLmhlaWdodDtcclxuICAgICAgICAgIGNvbnN0IHR3ID0gKE1hdGguc2luKHQqMS42ICsgeCowLjAwMiArIHkqMC4wMDMpKjAuNSswLjUpKjAuNSswLjU7XHJcbiAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICBjdHguYXJjKHgsIHksIHN0LnIgKyB0dyowLjYsIDAsIE1hdGguUEkqMik7XHJcbiAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3JnYmEoMTgwLDIwMCwyNTUsMC42KSc7XHJcbiAgICAgICAgICBjdHguZmlsbCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBtZXRlb3JzXHJcbiAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPCAwLjAxNSAmJiBtZXRlb3JzLmxlbmd0aCA8IDIpIHNwYXduTWV0ZW9yKCk7XHJcbiAgICAgICAgZm9yIChsZXQgaT1tZXRlb3JzLmxlbmd0aC0xOyBpPj0wOyBpLS0pIHtcclxuICAgICAgICAgIGNvbnN0IG0gPSBtZXRlb3JzW2ldO1xyXG4gICAgICAgICAgbS54ICs9IG0udng7IG0ueSArPSBtLnZ5OyBtLmxpZmUgKz0gMTY7XHJcbiAgICAgICAgICAvLyB0cmFpbFxyXG4gICAgICAgICAgY29uc3QgdHJhaWwgPSBjdHguY3JlYXRlTGluZWFyR3JhZGllbnQobS54LCBtLnksIG0ueCAtIG0udngqOCwgbS55IC0gbS52eSo4KTtcclxuICAgICAgICAgIHRyYWlsLmFkZENvbG9yU3RvcCgwLCAncmdiYSgyNTUsMjU1LDI1NSwwLjkpJyk7XHJcbiAgICAgICAgICB0cmFpbC5hZGRDb2xvclN0b3AoMSwgJ3JnYmEoMTUwLDE4MCwyNTUsMCknKTtcclxuICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHRyYWlsO1xyXG4gICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IDI7XHJcbiAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICBjdHgubW92ZVRvKG0ueCAtIG0udngqMTAsIG0ueSAtIG0udnkqMTApO1xyXG4gICAgICAgICAgY3R4LmxpbmVUbyhtLngsIG0ueSk7XHJcbiAgICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICAgICAgICBpZiAobS55ID4gY3ZzLmhlaWdodCArIDQwIHx8IG0ueCA8IC00MCB8fCBtLnggPiBjdnMud2lkdGggKyA0MCB8fCBtLmxpZmUgPiBtLnR0bCkge1xyXG4gICAgICAgICAgICBtZXRlb3JzLnNwbGljZShpLDEpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcCk7XHJcbiAgICAgIH07XHJcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wKTtcclxuICAgIH1cclxuICB9IGNhdGNoIHt9XHJcbn1cclxuIiwgImltcG9ydCB7IExvZ2luU2NlbmUgfSBmcm9tICcuL3NjZW5lcy9Mb2dpblNjZW5lJztcbmltcG9ydCB7IE1haW5TY2VuZSB9IGZyb20gJy4vc2NlbmVzL01haW5TY2VuZSc7XG5pbXBvcnQgeyBHYW1lTWFuYWdlciB9IGZyb20gJy4vY29yZS9HYW1lTWFuYWdlcic7XG5pbXBvcnQgeyBXYXJlaG91c2VTY2VuZSB9IGZyb20gJy4vc2NlbmVzL1dhcmVob3VzZVNjZW5lJztcbmltcG9ydCB7IFBsdW5kZXJTY2VuZSB9IGZyb20gJy4vc2NlbmVzL1BsdW5kZXJTY2VuZSc7XG5pbXBvcnQgeyBFeGNoYW5nZVNjZW5lIH0gZnJvbSAnLi9zY2VuZXMvRXhjaGFuZ2VTY2VuZSc7XG5pbXBvcnQgeyBSYW5raW5nU2NlbmUgfSBmcm9tICcuL3NjZW5lcy9SYW5raW5nU2NlbmUnO1xuaW1wb3J0IHsgZW5zdXJlR2xvYmFsU3R5bGVzIH0gZnJvbSAnLi9zdHlsZXMvaW5qZWN0JztcblxuZnVuY3Rpb24gcm91dGVUbyhjb250YWluZXI6IEhUTUxFbGVtZW50KSB7XG4gIGNvbnN0IGggPSBsb2NhdGlvbi5oYXNoIHx8ICcjL2xvZ2luJztcbiAgY29uc3Qgc2NlbmUgPSBoLnNwbGl0KCc/JylbMF07XG4gIHN3aXRjaCAoc2NlbmUpIHtcbiAgICBjYXNlICcjL21haW4nOlxuICAgICAgbmV3IE1haW5TY2VuZSgpLm1vdW50KGNvbnRhaW5lcik7XG4gICAgICBicmVhaztcbiAgICBjYXNlICcjL3dhcmVob3VzZSc6XG4gICAgICBuZXcgV2FyZWhvdXNlU2NlbmUoKS5tb3VudChjb250YWluZXIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnIy9wbHVuZGVyJzpcbiAgICAgIG5ldyBQbHVuZGVyU2NlbmUoKS5tb3VudChjb250YWluZXIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnIy9leGNoYW5nZSc6XG4gICAgICBuZXcgRXhjaGFuZ2VTY2VuZSgpLm1vdW50KGNvbnRhaW5lcik7XG4gICAgICBicmVhaztcbiAgICBjYXNlICcjL3JhbmtpbmcnOlxuICAgICAgbmV3IFJhbmtpbmdTY2VuZSgpLm1vdW50KGNvbnRhaW5lcik7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgbmV3IExvZ2luU2NlbmUoKS5tb3VudChjb250YWluZXIpO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBib290c3RyYXAoY29udGFpbmVyOiBIVE1MRWxlbWVudCkge1xuICAvLyBcdTdBQ0JcdTUzNzNcdTZDRThcdTUxNjVcdTY4MzdcdTVGMEZcdUZGMENcdTkwN0ZcdTUxNERGT1VDXHVGRjA4XHU5NUVBXHU3MEMxXHVGRjA5XG4gIGVuc3VyZUdsb2JhbFN0eWxlcygpO1xuICBcbiAgLy8gXHU1QzFEXHU4QkQ1XHU2MDYyXHU1OTBEXHU0RjFBXHU4QkREXG4gIGNvbnN0IHJlc3RvcmVkID0gYXdhaXQgR2FtZU1hbmFnZXIuSS50cnlSZXN0b3JlU2Vzc2lvbigpO1xuICBcbiAgLy8gXHU1OTgyXHU2NzlDXHU2NzA5XHU2NzA5XHU2NTQ4dG9rZW5cdTRFMTRcdTVGNTNcdTUyNERcdTU3MjhcdTc2N0JcdTVGNTVcdTk4NzVcdUZGMENcdThERjNcdThGNkNcdTUyMzBcdTRFM0JcdTk4NzVcbiAgaWYgKHJlc3RvcmVkICYmIChsb2NhdGlvbi5oYXNoID09PSAnJyB8fCBsb2NhdGlvbi5oYXNoID09PSAnIy9sb2dpbicpKSB7XG4gICAgbG9jYXRpb24uaGFzaCA9ICcjL21haW4nO1xuICB9XG4gIFxuICAvLyBcdTRGN0ZcdTc1MjggcmVxdWVzdEFuaW1hdGlvbkZyYW1lIFx1Nzg2RVx1NEZERFx1NjgzN1x1NUYwRlx1NURGMlx1NUU5NFx1NzUyOFxuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgIHJvdXRlVG8oY29udGFpbmVyKTtcbiAgfSk7XG4gIFxuICB3aW5kb3cub25oYXNoY2hhbmdlID0gKCkgPT4gcm91dGVUbyhjb250YWluZXIpO1xufVxuXG4vLyBcdTRGQkZcdTYzNzdcdTU0MkZcdTUyQThcdUZGMDhcdTdGNTFcdTk4NzVcdTczQUZcdTU4ODNcdUZGMDlcbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAod2luZG93IGFzIGFueSkuTWluZXJBcHAgPSB7IGJvb3RzdHJhcCwgR2FtZU1hbmFnZXIgfTtcbn1cblxuXG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7QUFBTyxNQUFNLGtCQUFOLE1BQU0sZ0JBQWU7QUFBQSxJQU0xQixjQUFjO0FBRmQsMEJBQVEsU0FBdUI7QUFJN0IsV0FBSyxRQUFRLGFBQWEsUUFBUSxZQUFZO0FBQUEsSUFDaEQ7QUFBQSxJQVBBLFdBQVcsSUFBb0I7QUFGakM7QUFFbUMsY0FBTyxVQUFLLGNBQUwsWUFBbUIsS0FBSyxZQUFZLElBQUksZ0JBQWU7QUFBQSxJQUFJO0FBQUEsSUFTbkcsU0FBUyxHQUFrQjtBQUN6QixXQUFLLFFBQVE7QUFDYixVQUFJLEdBQUc7QUFDTCxxQkFBYSxRQUFRLGNBQWMsQ0FBQztBQUFBLE1BQ3RDLE9BQU87QUFDTCxxQkFBYSxXQUFXLFlBQVk7QUFBQSxNQUN0QztBQUFBLElBQ0Y7QUFBQSxJQUVBLFdBQTBCO0FBQ3hCLGFBQU8sS0FBSztBQUFBLElBQ2Q7QUFBQSxJQUVBLGFBQWE7QUFDWCxXQUFLLFNBQVMsSUFBSTtBQUFBLElBQ3BCO0FBQUEsSUFFQSxNQUFNLFFBQVcsTUFBYyxNQUFnQztBQUM3RCxZQUFNLFVBQWUsRUFBRSxnQkFBZ0Isb0JBQW9CLElBQUksNkJBQU0sWUFBVyxDQUFDLEVBQUc7QUFDcEYsVUFBSSxLQUFLLE1BQU8sU0FBUSxlQUFlLElBQUksVUFBVSxLQUFLLEtBQUs7QUFFL0QsVUFBSTtBQUNGLGNBQU0sTUFBTSxNQUFNLE1BQU0sS0FBSyxRQUFRLElBQUksTUFBTSxFQUFFLEdBQUcsTUFBTSxRQUFRLENBQUM7QUFDbkUsY0FBTSxPQUFPLE1BQU0sSUFBSSxLQUFLO0FBRzVCLFlBQUksSUFBSSxXQUFXLEtBQUs7QUFDdEIsZUFBSyxXQUFXO0FBQ2hCLGNBQUksU0FBUyxTQUFT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QUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtB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QSxNQUNGLEtBQUs7QUFDSCxZQUFJLGNBQWMsRUFBRSxNQUFNLFNBQVM7QUFDbkM7QUFBQSxNQUNGLEtBQUs7QUFDSCxZQUFJLGFBQWEsRUFBRSxNQUFNLFNBQVM7QUFDbEM7QUFBQSxNQUNGO0FBQ0UsWUFBSSxXQUFXLEVBQUUsTUFBTSxTQUFTO0FBQUEsSUFDcEM7QUFBQSxFQUNGO0FBRUEsaUJBQXNCLFVBQVUsV0FBd0I7QUFFdEQsdUJBQW1CO0FBR25CLFVBQU0sV0FBVyxNQUFNLFlBQVksRUFBRSxrQkFBa0I7QUFHdkQsUUFBSSxhQUFhLFNBQVMsU0FBUyxNQUFNLFNBQVMsU0FBUyxZQUFZO0FBQ3JFLGVBQVMsT0FBTztBQUFBLElBQ2xCO0FBR0EsMEJBQXNCLE1BQU07QUFDMUIsY0FBUSxTQUFTO0FBQUEsSUFDbkIsQ0FBQztBQUVELFdBQU8sZUFBZSxNQUFNLFFBQVEsU0FBUztBQUFBLEVBQy9DO0FBR0EsTUFBSSxPQUFPLFdBQVcsYUFBYTtBQUNqQyxJQUFDLE9BQWUsV0FBVyxFQUFFLFdBQVcsWUFBWTtBQUFBLEVBQ3REOyIsCiAgIm5hbWVzIjogWyJvcmlnaW5hbEhUTUwiLCAiZSIsICJvcmlnaW5hbEhUTUwiLCAib3JpZ2luYWxIVE1MIiwgIm9yaWdpbmFsSFRNTCIsICJncmFkIl0KfQo=
