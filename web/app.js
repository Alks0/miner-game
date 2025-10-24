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
.upgrade-fail{animation:upgrade-fail-flash 1s ease}
@keyframes upgrade-fail-flash{0%{transform:scale(1);box-shadow:0 0 0 rgba(255,92,92,0)}25%{transform:scale(0.98);box-shadow:0 0 20px rgba(255,92,92,.5),0 0 40px rgba(255,92,92,.2)}50%{transform:scale(1);box-shadow:0 0 30px rgba(255,92,92,.7),0 0 50px rgba(255,92,92,.3)}75%{transform:scale(0.99);box-shadow:0 0 20px rgba(255,92,92,.5),0 0 40px rgba(255,92,92,.2)}100%{transform:scale(1);box-shadow:0 0 0 rgba(255,92,92,0)}}
.fragment-card{display:flex;flex-direction:column;gap:8px;background:rgba(255,255,255,.06);border-radius:12px;padding:12px;border:1px solid rgba(123,44,245,.25);transition:all .3s ease}
.fragment-card.can-craft{border-color:rgba(46,194,126,.5);box-shadow:0 0 12px rgba(46,194,126,.2)}
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vZnJvbnRlbmQtc2NyaXB0cy9jb3JlL05ldHdvcmtNYW5hZ2VyLnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvY29yZS9HYW1lTWFuYWdlci50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL3V0aWxzL2RvbS50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvbXBvbmVudHMvSWNvbi50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvbXBvbmVudHMvVG9hc3QudHMiLCAiLi4vZnJvbnRlbmQtc2NyaXB0cy9zY2VuZXMvTG9naW5TY2VuZS50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvcmUvRW52LnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvY29yZS9SZWFsdGltZUNsaWVudC50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvbXBvbmVudHMvTmF2LnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvY29tcG9uZW50cy9Db3VudFVwVGV4dC50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvbXBvbmVudHMvUmVzb3VyY2VCYXIudHMiLCAiLi4vZnJvbnRlbmQtc2NyaXB0cy9jb21wb25lbnRzL0FkRGlhbG9nLnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvc2NlbmVzL01haW5TY2VuZS50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL3NjZW5lcy9XYXJlaG91c2VTY2VuZS50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL3NjZW5lcy9QbHVuZGVyU2NlbmUudHMiLCAiLi4vZnJvbnRlbmQtc2NyaXB0cy9zY2VuZXMvRXhjaGFuZ2VTY2VuZS50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL3NjZW5lcy9SYW5raW5nU2NlbmUudHMiLCAiLi4vZnJvbnRlbmQtc2NyaXB0cy9zdHlsZXMvaW5qZWN0LnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvQXBwLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJleHBvcnQgY2xhc3MgTmV0d29ya01hbmFnZXIge1xyXG4gIHByaXZhdGUgc3RhdGljIF9pbnN0YW5jZTogTmV0d29ya01hbmFnZXI7XHJcbiAgc3RhdGljIGdldCBJKCk6IE5ldHdvcmtNYW5hZ2VyIHsgcmV0dXJuIHRoaXMuX2luc3RhbmNlID8/ICh0aGlzLl9pbnN0YW5jZSA9IG5ldyBOZXR3b3JrTWFuYWdlcigpKTsgfVxyXG5cclxuICBwcml2YXRlIHRva2VuOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcclxuICBcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIC8vIFx1NEVDRSBsb2NhbFN0b3JhZ2UgXHU2MDYyXHU1OTBEIHRva2VuXHJcbiAgICB0aGlzLnRva2VuID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2F1dGhfdG9rZW4nKTtcclxuICB9XHJcbiAgXHJcbiAgc2V0VG9rZW4odDogc3RyaW5nIHwgbnVsbCkgeyBcclxuICAgIHRoaXMudG9rZW4gPSB0O1xyXG4gICAgaWYgKHQpIHtcclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2F1dGhfdG9rZW4nLCB0KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdhdXRoX3Rva2VuJyk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIGdldFRva2VuKCk6IHN0cmluZyB8IG51bGwge1xyXG4gICAgcmV0dXJuIHRoaXMudG9rZW47XHJcbiAgfVxyXG4gIFxyXG4gIGNsZWFyVG9rZW4oKSB7XHJcbiAgICB0aGlzLnNldFRva2VuKG51bGwpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgcmVxdWVzdDxUPihwYXRoOiBzdHJpbmcsIGluaXQ/OiBSZXF1ZXN0SW5pdCk6IFByb21pc2U8VD4ge1xyXG4gICAgY29uc3QgaGVhZGVyczogYW55ID0geyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLCAuLi4oaW5pdD8uaGVhZGVycyB8fCB7fSkgfTtcclxuICAgIGlmICh0aGlzLnRva2VuKSBoZWFkZXJzWydBdXRob3JpemF0aW9uJ10gPSBgQmVhcmVyICR7dGhpcy50b2tlbn1gO1xyXG4gICAgXHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaCh0aGlzLmdldEJhc2UoKSArIHBhdGgsIHsgLi4uaW5pdCwgaGVhZGVycyB9KTtcclxuICAgICAgY29uc3QganNvbiA9IGF3YWl0IHJlcy5qc29uKCk7XHJcbiAgICAgIFxyXG4gICAgICAvLyA0MDEgXHU2NzJBXHU2Mzg4XHU2NzQzXHVGRjBDXHU2RTA1XHU5NjY0IHRva2VuIFx1NUU3Nlx1OERGM1x1OEY2Q1x1NzY3Qlx1NUY1NVxyXG4gICAgICBpZiAocmVzLnN0YXR1cyA9PT0gNDAxKSB7XHJcbiAgICAgICAgdGhpcy5jbGVhclRva2VuKCk7XHJcbiAgICAgICAgaWYgKGxvY2F0aW9uLmhhc2ggIT09ICcjL2xvZ2luJykge1xyXG4gICAgICAgICAgbG9jYXRpb24uaGFzaCA9ICcjL2xvZ2luJztcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdcdTc2N0JcdTVGNTVcdTVERjJcdThGQzdcdTY3MUZcdUZGMENcdThCRjdcdTkxQ0RcdTY1QjBcdTc2N0JcdTVGNTUnKTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgaWYgKCFyZXMub2sgfHwganNvbi5jb2RlID49IDQwMCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihqc29uLm1lc3NhZ2UgfHwgJ1JlcXVlc3QgRXJyb3InKTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgcmV0dXJuIGpzb24uZGF0YSBhcyBUO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgLy8gXHU3RjUxXHU3RURDXHU5NTE5XHU4QkVGXHU1OTA0XHU3NDA2XHJcbiAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIFR5cGVFcnJvciAmJiBlcnJvci5tZXNzYWdlLmluY2x1ZGVzKCdmZXRjaCcpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdcdTdGNTFcdTdFRENcdThGREVcdTYzQTVcdTU5MzFcdThEMjVcdUZGMENcdThCRjdcdTY4QzBcdTY3RTVcdTdGNTFcdTdFRENcdTYyMTZcdTU0MEVcdTdBRUZcdTY3MERcdTUyQTEnKTtcclxuICAgICAgfVxyXG4gICAgICB0aHJvdyBlcnJvcjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldEJhc2UoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiAod2luZG93IGFzIGFueSkuX19BUElfQkFTRV9fIHx8ICdodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpJztcclxuICB9XHJcbn1cclxuXHJcblxyXG4iLCAiaW1wb3J0IHsgTmV0d29ya01hbmFnZXIgfSBmcm9tICcuL05ldHdvcmtNYW5hZ2VyJztcclxuXHJcbmV4cG9ydCB0eXBlIFByb2ZpbGUgPSB7IGlkOiBzdHJpbmc7IHVzZXJuYW1lOiBzdHJpbmc7IG5pY2tuYW1lOiBzdHJpbmc7IG9yZUFtb3VudDogbnVtYmVyOyBiYkNvaW5zOiBudW1iZXIgfTtcclxuXHJcbmV4cG9ydCBjbGFzcyBHYW1lTWFuYWdlciB7XHJcbiAgcHJpdmF0ZSBzdGF0aWMgX2luc3RhbmNlOiBHYW1lTWFuYWdlcjtcclxuICBzdGF0aWMgZ2V0IEkoKTogR2FtZU1hbmFnZXIgeyByZXR1cm4gdGhpcy5faW5zdGFuY2UgPz8gKHRoaXMuX2luc3RhbmNlID0gbmV3IEdhbWVNYW5hZ2VyKCkpOyB9XHJcblxyXG4gIHByaXZhdGUgcHJvZmlsZTogUHJvZmlsZSB8IG51bGwgPSBudWxsO1xyXG4gIGdldFByb2ZpbGUoKTogUHJvZmlsZSB8IG51bGwgeyByZXR1cm4gdGhpcy5wcm9maWxlOyB9XHJcblxyXG4gIGFzeW5jIGxvZ2luT3JSZWdpc3Rlcih1c2VybmFtZTogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICBjb25zdCBubSA9IE5ldHdvcmtNYW5hZ2VyLkk7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCByID0gYXdhaXQgbm0ucmVxdWVzdDx7IGFjY2Vzc190b2tlbjogc3RyaW5nOyB1c2VyOiBhbnkgfT4oJy9hdXRoL2xvZ2luJywgeyBtZXRob2Q6ICdQT1NUJywgYm9keTogSlNPTi5zdHJpbmdpZnkoeyB1c2VybmFtZSwgcGFzc3dvcmQgfSkgfSk7XHJcbiAgICAgIG5tLnNldFRva2VuKHIuYWNjZXNzX3Rva2VuKTtcclxuICAgIH0gY2F0Y2gge1xyXG4gICAgICBjb25zdCByID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgYWNjZXNzX3Rva2VuOiBzdHJpbmc7IHVzZXI6IGFueSB9PignL2F1dGgvcmVnaXN0ZXInLCB7IG1ldGhvZDogJ1BPU1QnLCBib2R5OiBKU09OLnN0cmluZ2lmeSh7IHVzZXJuYW1lLCBwYXNzd29yZCB9KSB9KTtcclxuICAgICAgTmV0d29ya01hbmFnZXIuSS5zZXRUb2tlbihyLmFjY2Vzc190b2tlbik7XHJcbiAgICB9XHJcbiAgICB0aGlzLnByb2ZpbGUgPSBhd2FpdCBubS5yZXF1ZXN0PFByb2ZpbGU+KCcvdXNlci9wcm9maWxlJyk7XHJcbiAgfVxyXG5cclxuICBhc3luYyB0cnlSZXN0b3JlU2Vzc2lvbigpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgIGNvbnN0IG5tID0gTmV0d29ya01hbmFnZXIuSTtcclxuICAgIGNvbnN0IHRva2VuID0gbm0uZ2V0VG9rZW4oKTtcclxuICAgIGlmICghdG9rZW4pIHJldHVybiBmYWxzZTtcclxuICAgIFxyXG4gICAgdHJ5IHtcclxuICAgICAgdGhpcy5wcm9maWxlID0gYXdhaXQgbm0ucmVxdWVzdDxQcm9maWxlPignL3VzZXIvcHJvZmlsZScpO1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0gY2F0Y2gge1xyXG4gICAgICAvLyBUb2tlbiBcdTU5MzFcdTY1NDhcdUZGMENcdTZFMDVcdTk2NjRcclxuICAgICAgbm0uY2xlYXJUb2tlbigpO1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBsb2dvdXQoKSB7XHJcbiAgICBOZXR3b3JrTWFuYWdlci5JLmNsZWFyVG9rZW4oKTtcclxuICAgIHRoaXMucHJvZmlsZSA9IG51bGw7XHJcbiAgICBsb2NhdGlvbi5oYXNoID0gJyMvbG9naW4nO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbiIsICJleHBvcnQgZnVuY3Rpb24gaHRtbCh0ZW1wbGF0ZTogc3RyaW5nKTogSFRNTEVsZW1lbnQge1xyXG4gIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gIGRpdi5pbm5lckhUTUwgPSB0ZW1wbGF0ZS50cmltKCk7XHJcbiAgcmV0dXJuIGRpdi5maXJzdEVsZW1lbnRDaGlsZCBhcyBIVE1MRWxlbWVudDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHFzPFQgZXh0ZW5kcyBFbGVtZW50ID0gSFRNTEVsZW1lbnQ+KHJvb3Q6IFBhcmVudE5vZGUsIHNlbDogc3RyaW5nKTogVCB7XHJcbiAgY29uc3QgZWwgPSByb290LnF1ZXJ5U2VsZWN0b3Ioc2VsKSBhcyBUIHwgbnVsbDtcclxuICBpZiAoIWVsKSB0aHJvdyBuZXcgRXJyb3IoYE1pc3NpbmcgZWxlbWVudDogJHtzZWx9YCk7XHJcbiAgcmV0dXJuIGVsIGFzIFQ7XHJcbn1cclxuXHJcblxyXG4iLCAiaW1wb3J0IHsgaHRtbCB9IGZyb20gJy4uL3V0aWxzL2RvbSc7XG5cbmV4cG9ydCB0eXBlIEljb25OYW1lID1cbiAgfCAnaG9tZSdcbiAgfCAnd2FyZWhvdXNlJ1xuICB8ICdwbHVuZGVyJ1xuICB8ICdleGNoYW5nZSdcbiAgfCAncmFua2luZydcbiAgfCAnb3JlJ1xuICB8ICdjb2luJ1xuICB8ICdwaWNrJ1xuICB8ICdyZWZyZXNoJ1xuICB8ICdwbGF5J1xuICB8ICdzdG9wJ1xuICB8ICdjb2xsZWN0J1xuICB8ICd3cmVuY2gnXG4gIHwgJ3NoaWVsZCdcbiAgfCAnbGlzdCdcbiAgfCAndXNlcidcbiAgfCAnbG9jaydcbiAgfCAnZXllJ1xuICB8ICdleWUtb2ZmJ1xuICB8ICdzd29yZCdcbiAgfCAndHJvcGh5J1xuICB8ICdjbG9jaydcbiAgfCAnYm9sdCdcbiAgfCAndHJhc2gnXG4gIHwgJ2Nsb3NlJ1xuICB8ICdhcnJvdy1yaWdodCdcbiAgfCAndGFyZ2V0J1xuICB8ICdib3gnXG4gIHwgJ2luZm8nXG4gIHwgJ2xvZ291dCdcbiAgfCAneCc7XG5cbmZ1bmN0aW9uIGdyYWQoaWQ6IHN0cmluZykge1xuICByZXR1cm4gYDxkZWZzPlxuICAgIDxsaW5lYXJHcmFkaWVudCBpZD1cIiR7aWR9XCIgeDE9XCIwXCIgeTE9XCIwXCIgeDI9XCIxXCIgeTI9XCIxXCI+XG4gICAgICA8c3RvcCBvZmZzZXQ9XCIwJVwiIHN0b3AtY29sb3I9XCIjN0IyQ0Y1XCIgLz5cbiAgICAgIDxzdG9wIG9mZnNldD1cIjEwMCVcIiBzdG9wLWNvbG9yPVwiIzJDODlGNVwiIC8+XG4gICAgPC9saW5lYXJHcmFkaWVudD5cbiAgPC9kZWZzPmA7XG59XG5cbmZ1bmN0aW9uIHN2Z1dyYXAocGF0aDogc3RyaW5nLCBzaXplID0gMTgsIGNscyA9ICcnKTogSFRNTEVsZW1lbnQge1xuICBjb25zdCBnaWQgPSAnaWctJyArIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnNsaWNlKDIsIDgpO1xuICBjb25zdCBlbCA9IGh0bWwoYDxzcGFuIGNsYXNzPVwiaWNvbiAke2Nsc31cIiBhcmlhLWhpZGRlbj1cInRydWVcIj4ke1xuICAgIGA8c3ZnIHdpZHRoPVwiJHtzaXplfVwiIGhlaWdodD1cIiR7c2l6ZX1cIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+JHtncmFkKGdpZCl9JHtwYXRoLnJlcGxhY2VBbGwoJ19fR1JBRF9fJywgYHVybCgjJHtnaWR9KWApfTwvc3ZnPmBcbiAgfTwvc3Bhbj5gKTtcbiAgcmV0dXJuIGVsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVySWNvbihuYW1lOiBJY29uTmFtZSwgb3B0czogeyBzaXplPzogbnVtYmVyOyBjbGFzc05hbWU/OiBzdHJpbmcgfSA9IHt9KSB7XG4gIGNvbnN0IHNpemUgPSBvcHRzLnNpemUgPz8gMTg7XG4gIGNvbnN0IGNscyA9IG9wdHMuY2xhc3NOYW1lID8/ICcnO1xuICBjb25zdCBzdHJva2UgPSAnc3Ryb2tlPVwiX19HUkFEX19cIiBzdHJva2Utd2lkdGg9XCIxLjdcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIic7XG4gIGNvbnN0IGZpbGwgPSAnZmlsbD1cIl9fR1JBRF9fXCInO1xuXG4gIHN3aXRjaCAobmFtZSkge1xuICAgIGNhc2UgJ2hvbWUnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNMyAxMC41TDEyIDNsOSA3LjVcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNNS41IDkuNVYyMWgxM1Y5LjVcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNOS41IDIxdi02aDV2NlwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICd3YXJlaG91c2UnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNMyA5bDktNSA5IDV2OS41YzAgMS0xIDItMiAySDVjLTEgMC0yLTEtMi0yVjl6XCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTcgMTJoMTBNNyAxNmgxMFwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdwbHVuZGVyJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTQgMjBsNy03TTEzIDEzbDcgN005IDVsNiA2TTE1IDVsLTYgNlwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdleGNoYW5nZSc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk02IDhoMTFsLTMtM00xOCAxNkg3bDMgM1wiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdyYW5raW5nJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTggMTR2Nk0xMiAxMHYxME0xNiA2djE0XCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTE2IDQuNWEyIDIgMCAxMDAtNCAyIDIgMCAwMDAgNHpcIiAke2ZpbGx9Lz5gICwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdvcmUnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNMTIgM2w2IDQtMiA4LTQgNi00LTYtMi04IDYtNHpcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNMTIgM2wtMiA4IDIgMTAgMi0xMC0yLTh6XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ2NvaW4nOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiOC41XCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTguNSAxMmg3TTEwIDloNE0xMCAxNWg0XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ3BpY2snOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNNCA1YzQtMyA5LTIgMTIgMU05IDEwbC01IDVNOSAxMGwyIDJNNyAxMmwyIDJcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNMTEgMTJsNyA3XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ3JlZnJlc2gnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNMjAgMTJhOCA4IDAgMTAtMi4zIDUuN1wiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk0yMCAxMnY2aC02XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ3BsYXknOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNOCA2djEybDEwLTYtMTAtNnpcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnc3RvcCc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHJlY3QgeD1cIjdcIiB5PVwiN1wiIHdpZHRoPVwiMTBcIiBoZWlnaHQ9XCIxMFwiIHJ4PVwiMlwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdjb2xsZWN0JzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTEyIDV2MTBcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNOCAxMWw0IDQgNC00XCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTUgMTloMTRcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnd3JlbmNoJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTE1LjUgNmE0LjUgNC41IDAgMTEtNi45IDUuNEwzIDE3bDQuNi01LjZBNC41IDQuNSAwIDExMTUuNSA2elwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdzaGllbGQnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNMTIgM2w4IDN2NmExMCAxMCAwIDAxLTggOSAxMCAxMCAwIDAxLTgtOVY2bDgtM3pcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnbGlzdCc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk03IDZoMTJNNyAxMmgxMk03IDE4aDEyXCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTQgNmguMDFNNCAxMmguMDFNNCAxOGguMDFcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAndXNlcic6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0xMiAxMmE0IDQgMCAxMDAtOCA0IDQgMCAwMDAgOHpcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNNCAyMGE4IDggMCAwMTE2IDBcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnbG9jayc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHJlY3QgeD1cIjVcIiB5PVwiMTBcIiB3aWR0aD1cIjE0XCIgaGVpZ2h0PVwiMTBcIiByeD1cIjJcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNOCAxMFY3YTQgNCAwIDExOCAwdjNcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnZXllJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTIgMTJzNC03IDEwLTcgMTAgNyAxMCA3LTQgNy0xMCA3LTEwLTctMTAtN3pcIiAke3N0cm9rZX0vPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiM1wiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdleWUtb2ZmJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTIgMTJzNC03IDEwLTcgMTAgNyAxMCA3LTQgNy0xMCA3LTEwLTctMTAtN3pcIiAke3N0cm9rZX0vPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiM1wiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk0zIDNsMTggMThcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnc3dvcmQnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNMyAyMWw2LTZNOSAxNWw5LTkgMyAzLTkgOU0xNCA2bDQgNFwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICd0cm9waHknOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNOCAyMWg4TTkgMTdoNk03IDRoMTB2NWE1IDUgMCAxMS0xMCAwVjR6XCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTQgNmgzdjJhMyAzIDAgMTEtMy0yek0yMCA2aC0zdjJhMyAzIDAgMDAzLTJ6XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ2Nsb2NrJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjguNVwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk0xMiA3djZsNCAyXCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ2JvbHQnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNMTMgMkw2IDE0aDVsLTEgOCA3LTEyaC01bDEtOHpcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAndHJhc2gnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNNCA3aDE2TTkgN1Y1aDZ2Mk03IDdsMSAxM2g4bDEtMTNcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnY2xvc2UnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNNiA2bDEyIDEyTTYgMThMMTggNlwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdhcnJvdy1yaWdodCc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk00IDEyaDE0TTEyIDVsNyA3LTcgN1wiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICd0YXJnZXQnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiOC41XCIgJHtzdHJva2V9Lz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjQuNVwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk0xMiAydjNNMTIgMTl2M00yIDEyaDNNMTkgMTJoM1wiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdib3gnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNMTIgM2w5IDUtOSA1LTktNSA5LTV6XCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTMgOHY4bDkgNSA5LTVWOFwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk0xMiAxM3Y4XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ2luZm8nOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiOC41XCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTEyIDEwdjZcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNMTIgN2guMDFcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnbG9nb3V0JzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTE0IDhWNWExIDEgMCAwMC0xLTFINWExIDEgMCAwMC0xIDF2MTRhMSAxIDAgMDAxIDFoOGExIDEgMCAwMDEtMXYtM1wiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk05IDEyaDExTTE2IDhsNCA0LTQgNFwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICd4JzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTYgNmwxMiAxMk0xOCA2TDYgMThcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjlcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gIH1cbn1cbiIsICJpbXBvcnQgeyByZW5kZXJJY29uIH0gZnJvbSAnLi9JY29uJztcblxubGV0IF9ib3g6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG5cbmZ1bmN0aW9uIGVuc3VyZUJveCgpOiBIVE1MRWxlbWVudCB7XG4gIGlmIChfYm94KSByZXR1cm4gX2JveDtcbiAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGRpdi5jbGFzc05hbWUgPSAndG9hc3Qtd3JhcCc7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgX2JveCA9IGRpdjtcbiAgcmV0dXJuIGRpdjtcbn1cblxudHlwZSBUb2FzdFR5cGUgPSAnaW5mbycgfCAnc3VjY2VzcycgfCAnd2FybicgfCAnZXJyb3InO1xudHlwZSBUb2FzdE9wdGlvbnMgPSB7IHR5cGU/OiBUb2FzdFR5cGU7IGR1cmF0aW9uPzogbnVtYmVyIH07XG5cbmV4cG9ydCBmdW5jdGlvbiBzaG93VG9hc3QodGV4dDogc3RyaW5nLCBvcHRzPzogVG9hc3RUeXBlIHwgVG9hc3RPcHRpb25zKSB7XG4gIGNvbnN0IGJveCA9IGVuc3VyZUJveCgpO1xuICBjb25zdCBpdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGxldCB0eXBlOiBUb2FzdFR5cGUgfCB1bmRlZmluZWQ7XG4gIGxldCBkdXJhdGlvbiA9IDM1MDA7XG4gIGlmICh0eXBlb2Ygb3B0cyA9PT0gJ3N0cmluZycpIHR5cGUgPSBvcHRzO1xuICBlbHNlIGlmIChvcHRzKSB7IHR5cGUgPSBvcHRzLnR5cGU7IGlmIChvcHRzLmR1cmF0aW9uKSBkdXJhdGlvbiA9IG9wdHMuZHVyYXRpb247IH1cbiAgaXRlbS5jbGFzc05hbWUgPSAndG9hc3QnICsgKHR5cGUgPyAnICcgKyB0eXBlIDogJycpO1xuICAvLyBpY29uICsgdGV4dCBjb250YWluZXJcbiAgdHJ5IHtcbiAgICBjb25zdCB3cmFwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgd3JhcC5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnO1xuICAgIHdyYXAuc3R5bGUuZ2FwID0gJzhweCc7XG4gICAgd3JhcC5zdHlsZS5hbGlnbkl0ZW1zID0gJ2NlbnRlcic7XG4gICAgY29uc3QgaWNvTmFtZSA9IHR5cGUgPT09ICdzdWNjZXNzJyA/ICdib2x0JyA6IHR5cGUgPT09ICd3YXJuJyA/ICdjbG9jaycgOiB0eXBlID09PSAnZXJyb3InID8gJ2Nsb3NlJyA6ICdpbmZvJztcbiAgICBjb25zdCBpY29Ib3N0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGljb0hvc3QuYXBwZW5kQ2hpbGQocmVuZGVySWNvbihpY29OYW1lLCB7IHNpemU6IDE4IH0pKTtcbiAgICBjb25zdCB0eHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0eHQudGV4dENvbnRlbnQgPSB0ZXh0O1xuICAgIHdyYXAuYXBwZW5kQ2hpbGQoaWNvSG9zdCk7XG4gICAgd3JhcC5hcHBlbmRDaGlsZCh0eHQpO1xuICAgIGl0ZW0uYXBwZW5kQ2hpbGQod3JhcCk7XG4gIH0gY2F0Y2gge1xuICAgIGl0ZW0udGV4dENvbnRlbnQgPSB0ZXh0O1xuICB9XG4gIGNvbnN0IGxpZmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpJyk7XG4gIGxpZmUuY2xhc3NOYW1lID0gJ2xpZmUnO1xuICBsaWZlLnN0eWxlLnNldFByb3BlcnR5KCctLWxpZmUnLCBkdXJhdGlvbiArICdtcycpO1xuICBpdGVtLmFwcGVuZENoaWxkKGxpZmUpO1xuICBib3gucHJlcGVuZChpdGVtKTtcbiAgLy8gZ3JhY2VmdWwgZXhpdFxuICBjb25zdCBmYWRlID0gKCkgPT4geyBpdGVtLnN0eWxlLm9wYWNpdHkgPSAnMCc7IGl0ZW0uc3R5bGUudHJhbnNpdGlvbiA9ICdvcGFjaXR5IC40NXMnOyBzZXRUaW1lb3V0KCgpID0+IGl0ZW0ucmVtb3ZlKCksIDQ2MCk7IH07XG4gIGNvbnN0IHRpbWVyID0gd2luZG93LnNldFRpbWVvdXQoZmFkZSwgZHVyYXRpb24pO1xuICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4geyBjbGVhclRpbWVvdXQodGltZXIpOyBmYWRlKCk7IH0pO1xufVxuIiwgImltcG9ydCB7IEdhbWVNYW5hZ2VyIH0gZnJvbSAnLi4vY29yZS9HYW1lTWFuYWdlcic7XG5pbXBvcnQgeyBodG1sLCBxcyB9IGZyb20gJy4uL3V0aWxzL2RvbSc7XG5pbXBvcnQgeyBzaG93VG9hc3QgfSBmcm9tICcuLi9jb21wb25lbnRzL1RvYXN0JztcbmltcG9ydCB7IHJlbmRlckljb24gfSBmcm9tICcuLi9jb21wb25lbnRzL0ljb24nO1xuXG5leHBvcnQgY2xhc3MgTG9naW5TY2VuZSB7XG4gIG1vdW50KHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3QgdmlldyA9IGh0bWwoYFxuICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lciBncmlkLTJcIiBzdHlsZT1cImNvbG9yOiNmZmY7XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkIGZhZGUtaW5cIiBzdHlsZT1cIm1heC13aWR0aDo0NjBweDttYXJnaW46NDZweCBhdXRvO1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJzY2VuZS1oZWFkZXJcIj5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxoMSBzdHlsZT1cImJhY2tncm91bmQ6dmFyKC0tZ3JhZCk7LXdlYmtpdC1iYWNrZ3JvdW5kLWNsaXA6dGV4dDtiYWNrZ3JvdW5kLWNsaXA6dGV4dDtjb2xvcjp0cmFuc3BhcmVudDtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo4cHg7XCI+PHNwYW4gZGF0YS1pY289XCJob21lXCI+PC9zcGFuPlx1NzdGRlx1NTczQVx1NjMwN1x1NjMyNVx1NEUyRFx1NUZDMzwvaDE+XG4gICAgICAgICAgICAgIDxwPlx1NzY3Qlx1NUY1NVx1NTQwRVx1OEZEQlx1NTE2NVx1NEY2MFx1NzY4NFx1OEQ1Qlx1NTM1QVx1NzdGRlx1NTdDRVx1MzAwMjwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxpbnB1dCBpZD1cInVcIiBjbGFzcz1cImlucHV0XCIgcGxhY2Vob2xkZXI9XCJcdTc1MjhcdTYyMzdcdTU0MERcIiBhdXRvY29tcGxldGU9XCJ1c2VybmFtZVwiLz5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCIgc3R5bGU9XCJhbGlnbi1pdGVtczpjZW50ZXI7XCI+XG4gICAgICAgICAgICA8aW5wdXQgaWQ9XCJwXCIgY2xhc3M9XCJpbnB1dFwiIHBsYWNlaG9sZGVyPVwiXHU1QkM2XHU3ODAxXCIgdHlwZT1cInBhc3N3b3JkXCIgYXV0b2NvbXBsZXRlPVwiY3VycmVudC1wYXNzd29yZFwiLz5cbiAgICAgICAgICAgIDxidXR0b24gaWQ9XCJyZXZlYWxcIiBjbGFzcz1cImJ0biBidG4tZ2hvc3RcIiBzdHlsZT1cIm1pbi13aWR0aDoxMTBweDtcIj48c3BhbiBkYXRhLWljbz1cImV5ZVwiPjwvc3Bhbj5cdTY2M0VcdTc5M0E8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8YnV0dG9uIGlkPVwiZ29cIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiIHN0eWxlPVwid2lkdGg6MTAwJTttYXJnaW4tdG9wOjhweDtcIj48c3BhbiBkYXRhLWljbz1cImFycm93LXJpZ2h0XCI+PC9zcGFuPlx1OEZEQlx1NTE2NVx1NkUzOFx1NjIwRjwvYnV0dG9uPlxuICAgICAgICAgIDxkaXYgc3R5bGU9XCJtYXJnaW4tdG9wOjhweDtvcGFjaXR5Oi43NTtmb250LXNpemU6MTJweDtcIj5cdTYzRDBcdTc5M0FcdUZGMUFcdTgyRTVcdThEMjZcdTYyMzdcdTRFMERcdTVCNThcdTU3MjhcdUZGMENcdTVDMDZcdTgxRUFcdTUyQThcdTUyMUJcdTVFRkFcdTVFNzZcdTc2N0JcdTVGNTVcdTMwMDI8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICBgKTtcbiAgICByb290LmlubmVySFRNTCA9ICcnO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQodmlldyk7XG5cbiAgICAvLyBcdTZFMzJcdTY3RDNcdTYyNDBcdTY3MDlcdTU2RkVcdTY4MDdcbiAgICB0cnkge1xuICAgICAgdmlldy5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1pY29dJykuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgY29uc3QgbmFtZSA9IChlbCBhcyBIVE1MRWxlbWVudCkuZ2V0QXR0cmlidXRlKCdkYXRhLWljbycpIGFzIGFueTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBlbC5hcHBlbmRDaGlsZChyZW5kZXJJY29uKG5hbWUsIHsgc2l6ZTogMjIgfSkpO1xuICAgICAgICB9IGNhdGNoIHt9XG4gICAgICB9KTtcbiAgICB9IGNhdGNoIHt9XG5cbiAgICBjb25zdCB1RWwgPSBxczxIVE1MSW5wdXRFbGVtZW50Pih2aWV3LCAnI3UnKTtcbiAgICBjb25zdCBwRWwgPSBxczxIVE1MSW5wdXRFbGVtZW50Pih2aWV3LCAnI3AnKTtcbiAgICBjb25zdCBnbyA9IHFzPEhUTUxCdXR0b25FbGVtZW50Pih2aWV3LCAnI2dvJyk7XG4gICAgY29uc3QgcmV2ZWFsID0gcXM8SFRNTEJ1dHRvbkVsZW1lbnQ+KHZpZXcsICcjcmV2ZWFsJyk7XG5cbiAgICAvLyBcdTRGN0ZcdTc1MjggcmVxdWVzdEFuaW1hdGlvbkZyYW1lIFx1Nzg2RVx1NEZERFx1NkUzMlx1NjdEM1x1NUI4Q1x1NjIxMFx1NTQwRVx1N0FDQlx1NTM3M1x1ODA1QVx1NzEyNlxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICB1RWwuZm9jdXMoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgY29uc3Qgc3VibWl0ID0gYXN5bmMgKCkgPT4ge1xuICAgICAgaWYgKGdvLmRpc2FibGVkKSByZXR1cm47IC8vIFx1OTYzMlx1NkI2Mlx1OTFDRFx1NTkwRFx1NzBCOVx1NTFGQlxuICAgICAgXG4gICAgICBjb25zdCB1c2VybmFtZSA9ICh1RWwudmFsdWUgfHwgJycpLnRyaW0oKTtcbiAgICAgIGNvbnN0IHBhc3N3b3JkID0gKHBFbC52YWx1ZSB8fCAnJykudHJpbSgpO1xuICAgICAgaWYgKCF1c2VybmFtZSB8fCAhcGFzc3dvcmQpIHtcbiAgICAgICAgc2hvd1RvYXN0KCdcdThCRjdcdTU4NkJcdTUxOTlcdTc1MjhcdTYyMzdcdTU0MERcdTU0OENcdTVCQzZcdTc4MDEnLCAnd2FybicpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAodXNlcm5hbWUubGVuZ3RoIDwgMyB8fCB1c2VybmFtZS5sZW5ndGggPiAyMCkge1xuICAgICAgICBzaG93VG9hc3QoJ1x1NzUyOFx1NjIzN1x1NTQwRFx1OTU3Rlx1NUVBNlx1NUU5NFx1NTcyOCAzLTIwIFx1NEUyQVx1NUI1N1x1N0IyNlx1NEU0Qlx1OTVGNCcsICd3YXJuJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChwYXNzd29yZC5sZW5ndGggPCAzKSB7XG4gICAgICAgIHNob3dUb2FzdCgnXHU1QkM2XHU3ODAxXHU4MUYzXHU1QzExXHU5NzAwXHU4OTgxIDMgXHU0RTJBXHU1QjU3XHU3QjI2JywgJ3dhcm4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgZ28uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgY29uc3Qgb3JpZ2luYWxIVE1MID0gZ28uaW5uZXJIVE1MO1xuICAgICAgZ28uaW5uZXJIVE1MID0gJzxzcGFuIGRhdGEtaWNvPVwiYXJyb3ctcmlnaHRcIj48L3NwYW4+XHU3NjdCXHU1RjU1XHU0RTJEXHUyMDI2JztcbiAgICAgIHRyeSB7XG4gICAgICAgIHZpZXcucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtaWNvXScpLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgICAgY29uc3QgbmFtZSA9IChlbCBhcyBIVE1MRWxlbWVudCkuZ2V0QXR0cmlidXRlKCdkYXRhLWljbycpIGFzIGFueTtcbiAgICAgICAgICB0cnkgeyBlbC5hcHBlbmRDaGlsZChyZW5kZXJJY29uKG5hbWUsIHsgc2l6ZTogMjAgfSkpOyB9IGNhdGNoIHt9XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCB7fVxuICAgICAgXG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBHYW1lTWFuYWdlci5JLmxvZ2luT3JSZWdpc3Rlcih1c2VybmFtZSwgcGFzc3dvcmQpO1xuICAgICAgICBsb2NhdGlvbi5oYXNoID0gJyMvbWFpbic7XG4gICAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgICAgc2hvd1RvYXN0KGU/Lm1lc3NhZ2UgfHwgJ1x1NzY3Qlx1NUY1NVx1NTkzMVx1OEQyNVx1RkYwQ1x1OEJGN1x1OTFDRFx1OEJENScsICdlcnJvcicpO1xuICAgICAgICAvLyBcdTU5MzFcdThEMjVcdTY1RjZcdTYwNjJcdTU5MERcdTYzMDlcdTk0QUVcbiAgICAgICAgZ28uaW5uZXJIVE1MID0gb3JpZ2luYWxIVE1MO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHZpZXcucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtaWNvXScpLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBuYW1lID0gKGVsIGFzIEhUTUxFbGVtZW50KS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWNvJykgYXMgYW55O1xuICAgICAgICAgICAgdHJ5IHsgZWwuYXBwZW5kQ2hpbGQocmVuZGVySWNvbihuYW1lLCB7IHNpemU6IDIwIH0pKTsgfSBjYXRjaCB7fVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIHt9XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBnby5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBnby5vbmNsaWNrID0gc3VibWl0O1xuICAgIHVFbC5vbmtleXVwID0gKGUpID0+IHsgaWYgKChlIGFzIEtleWJvYXJkRXZlbnQpLmtleSA9PT0gJ0VudGVyJykgc3VibWl0KCk7IH07XG4gICAgcEVsLm9ua2V5dXAgPSAoZSkgPT4geyBpZiAoKGUgYXMgS2V5Ym9hcmRFdmVudCkua2V5ID09PSAnRW50ZXInKSBzdWJtaXQoKTsgfTtcbiAgICByZXZlYWwub25jbGljayA9ICgpID0+IHtcbiAgICAgIGNvbnN0IGlzUHdkID0gcEVsLnR5cGUgPT09ICdwYXNzd29yZCc7XG4gICAgICBwRWwudHlwZSA9IGlzUHdkID8gJ3RleHQnIDogJ3Bhc3N3b3JkJztcbiAgICAgIHJldmVhbC5pbm5lckhUTUwgPSAnJztcbiAgICAgIHJldmVhbC5hcHBlbmRDaGlsZChyZW5kZXJJY29uKGlzUHdkID8gJ2V5ZS1vZmYnIDogJ2V5ZScsIHsgc2l6ZTogMjAgfSkpO1xuICAgICAgcmV2ZWFsLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGlzUHdkID8gJ1x1OTY5MFx1ODVDRicgOiAnXHU2NjNFXHU3OTNBJykpO1xuICAgIH07XG4gIH1cbn1cbiIsICJleHBvcnQgY29uc3QgQVBJX0JBU0UgPSAod2luZG93IGFzIGFueSkuX19BUElfQkFTRV9fIHx8ICdodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpJztcclxuZXhwb3J0IGNvbnN0IFdTX0VORFBPSU5UID0gKHdpbmRvdyBhcyBhbnkpLl9fV1NfRU5EUE9JTlRfXyB8fCAnaHR0cDovL2xvY2FsaG9zdDozMDAwL2dhbWUnO1xyXG5cclxuXHJcbiIsICJpbXBvcnQgeyBXU19FTkRQT0lOVCB9IGZyb20gJy4vRW52JztcblxudHlwZSBIYW5kbGVyID0gKGRhdGE6IGFueSkgPT4gdm9pZDtcblxuZXhwb3J0IGNsYXNzIFJlYWx0aW1lQ2xpZW50IHtcbiAgcHJpdmF0ZSBzdGF0aWMgX2luc3RhbmNlOiBSZWFsdGltZUNsaWVudDtcbiAgc3RhdGljIGdldCBJKCk6IFJlYWx0aW1lQ2xpZW50IHtcbiAgICByZXR1cm4gdGhpcy5faW5zdGFuY2UgPz8gKHRoaXMuX2luc3RhbmNlID0gbmV3IFJlYWx0aW1lQ2xpZW50KCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBzb2NrZXQ6IGFueSB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGhhbmRsZXJzOiBSZWNvcmQ8c3RyaW5nLCBIYW5kbGVyW10+ID0ge307XG5cbiAgY29ubmVjdCh0b2tlbjogc3RyaW5nKSB7XG4gICAgY29uc3QgdyA9IHdpbmRvdyBhcyBhbnk7XG4gICAgaWYgKHcuaW8pIHtcbiAgICAgIC8vIFx1NTk4Mlx1Njc5Q1x1NURGMlx1OEZERVx1NjNBNVx1NEUxNHRva2VuXHU3NkY4XHU1NDBDXHVGRjBDXHU0RTBEXHU5MUNEXHU1OTBEXHU4RkRFXHU2M0E1XG4gICAgICBpZiAodGhpcy5zb2NrZXQgJiYgKHRoaXMuc29ja2V0LmNvbm5lY3RlZCB8fCB0aGlzLnNvY2tldC5jb25uZWN0aW5nKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBcbiAgICAgIC8vIFx1NjVBRFx1NUYwMFx1NjVFN1x1OEZERVx1NjNBNVxuICAgICAgaWYgKHRoaXMuc29ja2V0KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdGhpcy5zb2NrZXQuZGlzY29ubmVjdCgpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKCdbUmVhbHRpbWVDbGllbnRdIERpc2Nvbm5lY3QgZXJyb3I6JywgZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy8gXHU1RUZBXHU3QUNCXHU2NUIwXHU4RkRFXHU2M0E1XG4gICAgICB0aGlzLnNvY2tldCA9IHcuaW8oV1NfRU5EUE9JTlQsIHsgYXV0aDogeyB0b2tlbiB9IH0pO1xuICAgICAgXG4gICAgICB0aGlzLnNvY2tldC5vbignY29ubmVjdCcsICgpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ1tSZWFsdGltZUNsaWVudF0gQ29ubmVjdGVkIHRvIFdlYlNvY2tldCcpO1xuICAgICAgfSk7XG4gICAgICBcbiAgICAgIHRoaXMuc29ja2V0Lm9uKCdkaXNjb25uZWN0JywgKCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnW1JlYWx0aW1lQ2xpZW50XSBEaXNjb25uZWN0ZWQgZnJvbSBXZWJTb2NrZXQnKTtcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICB0aGlzLnNvY2tldC5vbignY29ubmVjdF9lcnJvcicsIChlcnJvcjogYW55KSA9PiB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ1tSZWFsdGltZUNsaWVudF0gQ29ubmVjdGlvbiBlcnJvcjonLCBlcnJvcik7XG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgdGhpcy5zb2NrZXQub25BbnkoKGV2ZW50OiBzdHJpbmcsIHBheWxvYWQ6IGFueSkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnW1JlYWx0aW1lQ2xpZW50XSBFdmVudCByZWNlaXZlZDonLCBldmVudCwgcGF5bG9hZCk7XG4gICAgICAgIHRoaXMuZW1pdExvY2FsKGV2ZW50LCBwYXlsb2FkKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBzb2NrZXQuaW8gY2xpZW50IG5vdCBsb2FkZWQ7IGRpc2FibGUgcmVhbHRpbWUgdXBkYXRlc1xuICAgICAgY29uc29sZS53YXJuKCdbUmVhbHRpbWVDbGllbnRdIHNvY2tldC5pbyBub3QgbG9hZGVkJyk7XG4gICAgICB0aGlzLnNvY2tldCA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgb24oZXZlbnQ6IHN0cmluZywgaGFuZGxlcjogSGFuZGxlcikge1xuICAgICh0aGlzLmhhbmRsZXJzW2V2ZW50XSB8fD0gW10pLnB1c2goaGFuZGxlcik7XG4gIH1cblxuICBvZmYoZXZlbnQ6IHN0cmluZywgaGFuZGxlcjogSGFuZGxlcikge1xuICAgIGNvbnN0IGFyciA9IHRoaXMuaGFuZGxlcnNbZXZlbnRdO1xuICAgIGlmICghYXJyKSByZXR1cm47XG4gICAgY29uc3QgaWR4ID0gYXJyLmluZGV4T2YoaGFuZGxlcik7XG4gICAgaWYgKGlkeCA+PSAwKSBhcnIuc3BsaWNlKGlkeCwgMSk7XG4gIH1cblxuICBwcml2YXRlIGVtaXRMb2NhbChldmVudDogc3RyaW5nLCBwYXlsb2FkOiBhbnkpIHtcbiAgICAodGhpcy5oYW5kbGVyc1tldmVudF0gfHwgW10pLmZvckVhY2goKGgpID0+IGgocGF5bG9hZCkpO1xuICB9XG59XG4iLCAiaW1wb3J0IHsgR2FtZU1hbmFnZXIgfSBmcm9tICcuLi9jb3JlL0dhbWVNYW5hZ2VyJztcbmltcG9ydCB7IHJlbmRlckljb24gfSBmcm9tICcuL0ljb24nO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyTmF2KGFjdGl2ZTogc3RyaW5nKTogSFRNTEVsZW1lbnQge1xuICBjb25zdCB0YWJzOiB7IGtleTogc3RyaW5nOyB0ZXh0OiBzdHJpbmc7IGhyZWY6IHN0cmluZzsgaWNvbjogYW55IH1bXSA9IFtcbiAgICB7IGtleTogJ21haW4nLCB0ZXh0OiAnXHU0RTNCXHU5ODc1JywgaHJlZjogJyMvbWFpbicsIGljb246ICdob21lJyB9LFxuICAgIHsga2V5OiAnd2FyZWhvdXNlJywgdGV4dDogJ1x1NEVEM1x1NUU5MycsIGhyZWY6ICcjL3dhcmVob3VzZScsIGljb246ICd3YXJlaG91c2UnIH0sXG4gICAgeyBrZXk6ICdwbHVuZGVyJywgdGV4dDogJ1x1NjNBMFx1NTkzQScsIGhyZWY6ICcjL3BsdW5kZXInLCBpY29uOiAncGx1bmRlcicgfSxcbiAgICB7IGtleTogJ2V4Y2hhbmdlJywgdGV4dDogJ1x1NEVBNFx1NjYxM1x1NjI0MCcsIGhyZWY6ICcjL2V4Y2hhbmdlJywgaWNvbjogJ2V4Y2hhbmdlJyB9LFxuICAgIHsga2V5OiAncmFua2luZycsIHRleHQ6ICdcdTYzOTJcdTg4NEMnLCBocmVmOiAnIy9yYW5raW5nJywgaWNvbjogJ3JhbmtpbmcnIH0sXG4gIF07XG4gIGNvbnN0IHdyYXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgd3JhcC5jbGFzc05hbWUgPSAnbmF2JztcbiAgZm9yIChjb25zdCB0IG9mIHRhYnMpIHtcbiAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGEuaHJlZiA9IHQuaHJlZjtcbiAgICBjb25zdCBpY28gPSByZW5kZXJJY29uKHQuaWNvbiwgeyBzaXplOiAxOCwgY2xhc3NOYW1lOiAnaWNvJyB9KTtcbiAgICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBsYWJlbC50ZXh0Q29udGVudCA9IHQudGV4dDtcbiAgICBhLmFwcGVuZENoaWxkKGljbyk7XG4gICAgYS5hcHBlbmRDaGlsZChsYWJlbCk7XG4gICAgaWYgKHQua2V5ID09PSBhY3RpdmUpIGEuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgd3JhcC5hcHBlbmRDaGlsZChhKTtcbiAgfVxuICBcbiAgLy8gXHU2REZCXHU1MkEwXHU5MDAwXHU1MUZBXHU3NjdCXHU1RjU1XHU2MzA5XHU5NEFFXG4gIGNvbnN0IGxvZ291dEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgbG9nb3V0QnRuLmhyZWYgPSAnIyc7XG4gIGxvZ291dEJ0bi5jbGFzc05hbWUgPSAnbmF2LWxvZ291dCc7XG4gIGxvZ291dEJ0bi5zdHlsZS5jc3NUZXh0ID0gJ21hcmdpbi1sZWZ0OmF1dG87b3BhY2l0eTouNzU7JztcbiAgY29uc3QgbG9nb3V0SWNvID0gcmVuZGVySWNvbignbG9nb3V0JywgeyBzaXplOiAxOCwgY2xhc3NOYW1lOiAnaWNvJyB9KTtcbiAgY29uc3QgbG9nb3V0TGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gIGxvZ291dExhYmVsLnRleHRDb250ZW50ID0gJ1x1OTAwMFx1NTFGQSc7XG4gIGxvZ291dEJ0bi5hcHBlbmRDaGlsZChsb2dvdXRJY28pO1xuICBsb2dvdXRCdG4uYXBwZW5kQ2hpbGQobG9nb3V0TGFiZWwpO1xuICBsb2dvdXRCdG4ub25jbGljayA9IChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGlmIChjb25maXJtKCdcdTc4NkVcdTVCOUFcdTg5ODFcdTkwMDBcdTUxRkFcdTc2N0JcdTVGNTVcdTU0MTdcdUZGMUYnKSkge1xuICAgICAgR2FtZU1hbmFnZXIuSS5sb2dvdXQoKTtcbiAgICB9XG4gIH07XG4gIHdyYXAuYXBwZW5kQ2hpbGQobG9nb3V0QnRuKTtcbiAgXG4gIHJldHVybiB3cmFwO1xufVxuIiwgImV4cG9ydCBjbGFzcyBDb3VudFVwVGV4dCB7XHJcbiAgcHJpdmF0ZSB2YWx1ZSA9IDA7XHJcbiAgcHJpdmF0ZSBkaXNwbGF5ID0gJzAnO1xyXG4gIHByaXZhdGUgYW5pbT86IG51bWJlcjtcclxuICBvblVwZGF0ZT86ICh0ZXh0OiBzdHJpbmcpID0+IHZvaWQ7XHJcblxyXG4gIHNldChuOiBudW1iZXIpIHtcclxuICAgIHRoaXMudmFsdWUgPSBuO1xyXG4gICAgdGhpcy5kaXNwbGF5ID0gdGhpcy5mb3JtYXQobik7XHJcbiAgICB0aGlzLm9uVXBkYXRlPy4odGhpcy5kaXNwbGF5KTtcclxuICB9XHJcblxyXG4gIHRvKG46IG51bWJlciwgZHVyYXRpb24gPSA1MDApIHtcclxuICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuYW5pbSEpO1xyXG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLnZhbHVlO1xyXG4gICAgY29uc3QgZGVsdGEgPSBuIC0gc3RhcnQ7XHJcbiAgICBjb25zdCB0MCA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgY29uc3Qgc3RlcCA9ICh0OiBudW1iZXIpID0+IHtcclxuICAgICAgY29uc3QgcCA9IE1hdGgubWluKDEsICh0IC0gdDApIC8gZHVyYXRpb24pO1xyXG4gICAgICBjb25zdCBlYXNlID0gMSAtIE1hdGgucG93KDEgLSBwLCAzKTtcclxuICAgICAgY29uc3QgY3VyciA9IHN0YXJ0ICsgZGVsdGEgKiBlYXNlO1xyXG4gICAgICB0aGlzLmRpc3BsYXkgPSB0aGlzLmZvcm1hdChjdXJyKTtcclxuICAgICAgdGhpcy5vblVwZGF0ZT8uKHRoaXMuZGlzcGxheSk7XHJcbiAgICAgIGlmIChwIDwgMSkgdGhpcy5hbmltID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApO1xyXG4gICAgICBlbHNlIHRoaXMudmFsdWUgPSBuO1xyXG4gICAgfTtcclxuICAgIHRoaXMuYW5pbSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZm9ybWF0KG46IG51bWJlcikge1xyXG4gICAgcmV0dXJuIE1hdGguZmxvb3IobikudG9Mb2NhbGVTdHJpbmcoKTtcclxuICB9XHJcbn1cclxuXHJcblxyXG4iLCAiaW1wb3J0IHsgTmV0d29ya01hbmFnZXIgfSBmcm9tICcuLi9jb3JlL05ldHdvcmtNYW5hZ2VyJztcbmltcG9ydCB7IHJlbmRlckljb24gfSBmcm9tICcuL0ljb24nO1xuaW1wb3J0IHsgQ291bnRVcFRleHQgfSBmcm9tICcuL0NvdW50VXBUZXh0JztcblxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlclJlc291cmNlQmFyKCkge1xuICBjb25zdCBib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgYm94LmNsYXNzTmFtZSA9ICdjb250YWluZXInO1xuICBjb25zdCBjYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNhcmQuY2xhc3NOYW1lID0gJ2NhcmQgZmFkZS1pbic7XG4gIGNhcmQuaW5uZXJIVE1MID0gYFxuICAgIDxkaXYgY2xhc3M9XCJzdGF0c1wiPlxuICAgICAgPGRpdiBjbGFzcz1cInN0YXRcIiBpZD1cIm9yZS1zdGF0XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJpY29cIiBkYXRhLWljbz1cIm9yZVwiPjwvZGl2PlxuICAgICAgICA8ZGl2IHN0eWxlPVwiZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6MnB4O1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJ2YWxcIiBpZD1cIm9yZVwiPjA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibGFiZWxcIj5cdTc3RkZcdTc3RjM8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJzdGF0XCIgaWQ9XCJjb2luLXN0YXRcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImljb1wiIGRhdGEtaWNvPVwiY29pblwiPjwvZGl2PlxuICAgICAgICA8ZGl2IHN0eWxlPVwiZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6MnB4O1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJ2YWxcIiBpZD1cImNvaW5cIj4wPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImxhYmVsXCI+QkI8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgYDtcbiAgYm94LmFwcGVuZENoaWxkKGNhcmQpO1xuICAvLyBpbmplY3QgaWNvbnNcbiAgdHJ5IHtcbiAgICBjb25zdCBvcmVJY28gPSBjYXJkLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWljbz1cIm9yZVwiXScpO1xuICAgIGNvbnN0IGNvaW5JY28gPSBjYXJkLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWljbz1cImNvaW5cIl0nKTtcbiAgICBpZiAob3JlSWNvKSBvcmVJY28uYXBwZW5kQ2hpbGQocmVuZGVySWNvbignb3JlJywgeyBzaXplOiAxOCB9KSk7XG4gICAgaWYgKGNvaW5JY28pIGNvaW5JY28uYXBwZW5kQ2hpbGQocmVuZGVySWNvbignY29pbicsIHsgc2l6ZTogMTggfSkpO1xuICB9IGNhdGNoIHt9XG4gIFxuICBjb25zdCBvcmVFbCA9IGNhcmQucXVlcnlTZWxlY3RvcignI29yZScpIGFzIEhUTUxFbGVtZW50O1xuICBjb25zdCBjb2luRWwgPSBjYXJkLnF1ZXJ5U2VsZWN0b3IoJyNjb2luJykgYXMgSFRNTEVsZW1lbnQ7XG4gIFxuICBjb25zdCBvcmVDb3VudGVyID0gbmV3IENvdW50VXBUZXh0KCk7XG4gIGNvbnN0IGNvaW5Db3VudGVyID0gbmV3IENvdW50VXBUZXh0KCk7XG4gIG9yZUNvdW50ZXIub25VcGRhdGUgPSAodGV4dCkgPT4geyBvcmVFbC50ZXh0Q29udGVudCA9IHRleHQ7IH07XG4gIGNvaW5Db3VudGVyLm9uVXBkYXRlID0gKHRleHQpID0+IHsgY29pbkVsLnRleHRDb250ZW50ID0gdGV4dDsgfTtcbiAgXG4gIGxldCBwcmV2T3JlID0gMDtcbiAgbGV0IHByZXZDb2luID0gMDtcbiAgXG4gIGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZSgpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcCA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IGlkOiBzdHJpbmc7IHVzZXJuYW1lOiBzdHJpbmc7IG5pY2tuYW1lOiBzdHJpbmc7IG9yZUFtb3VudDogbnVtYmVyOyBiYkNvaW5zOiBudW1iZXIgfT4oJy91c2VyL3Byb2ZpbGUnKTtcbiAgICAgIFxuICAgICAgLy8gXHU0RjdGXHU3NTI4XHU4QkExXHU2NTcwXHU1MkE4XHU3NTNCXHU2NkY0XHU2NUIwXG4gICAgICBpZiAocC5vcmVBbW91bnQgIT09IHByZXZPcmUpIHtcbiAgICAgICAgb3JlQ291bnRlci50byhwLm9yZUFtb3VudCwgODAwKTtcbiAgICAgICAgLy8gXHU1OTgyXHU2NzlDXHU2NjJGXHU1ODlFXHU1MkEwXHVGRjBDXHU2REZCXHU1MkEwXHU1NkZFXHU2ODA3XHU4MTA5XHU1MUIyXHU2NTQ4XHU2NzlDXG4gICAgICAgIGlmIChwLm9yZUFtb3VudCA+IHByZXZPcmUpIHtcbiAgICAgICAgICBjb25zdCBvcmVJY29uID0gY2FyZC5xdWVyeVNlbGVjdG9yKCcjb3JlLXN0YXQgLmljbycpO1xuICAgICAgICAgIGlmIChvcmVJY29uKSB7XG4gICAgICAgICAgICBvcmVJY29uLmNsYXNzTGlzdC5hZGQoJ3B1bHNlLWljb24nKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gb3JlSWNvbi5jbGFzc0xpc3QucmVtb3ZlKCdwdWxzZS1pY29uJyksIDYwMCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHByZXZPcmUgPSBwLm9yZUFtb3VudDtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgaWYgKHAuYmJDb2lucyAhPT0gcHJldkNvaW4pIHtcbiAgICAgICAgY29pbkNvdW50ZXIudG8ocC5iYkNvaW5zLCA4MDApO1xuICAgICAgICBpZiAocC5iYkNvaW5zID4gcHJldkNvaW4pIHtcbiAgICAgICAgICBjb25zdCBjb2luSWNvbiA9IGNhcmQucXVlcnlTZWxlY3RvcignI2NvaW4tc3RhdCAuaWNvJyk7XG4gICAgICAgICAgaWYgKGNvaW5JY29uKSB7XG4gICAgICAgICAgICBjb2luSWNvbi5jbGFzc0xpc3QuYWRkKCdwdWxzZS1pY29uJyk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGNvaW5JY29uLmNsYXNzTGlzdC5yZW1vdmUoJ3B1bHNlLWljb24nKSwgNjAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcHJldkNvaW4gPSBwLmJiQ29pbnM7XG4gICAgICB9XG4gICAgfSBjYXRjaCB7XG4gICAgICAvLyBpZ25vcmUgZmV0Y2ggZXJyb3JzOyBVSSBcdTRGMUFcdTU3MjhcdTRFMEJcdTRFMDBcdTZCMjFcdTUyMzdcdTY1QjBcdTY1RjZcdTYwNjJcdTU5MERcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHsgcm9vdDogYm94LCB1cGRhdGUsIG9yZUVsLCBjb2luRWwgfTtcbn1cbiIsICJpbXBvcnQgeyBodG1sIH0gZnJvbSAnLi4vdXRpbHMvZG9tJztcclxuaW1wb3J0IHsgcmVuZGVySWNvbiB9IGZyb20gJy4vSWNvbic7XHJcbmltcG9ydCB7IE5ldHdvcmtNYW5hZ2VyIH0gZnJvbSAnLi4vY29yZS9OZXR3b3JrTWFuYWdlcic7XHJcbmltcG9ydCB7IHNob3dUb2FzdCB9IGZyb20gJy4vVG9hc3QnO1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNob3dBZERpYWxvZygpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgIGNvbnN0IG92ZXJsYXkgPSBodG1sKGBcclxuICAgICAgPGRpdiBjbGFzcz1cImFkLW92ZXJsYXlcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiYWQtZGlhbG9nXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiYWQtY29udGVudFwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYWQtaWNvblwiIGRhdGEtaWNvPVwiaW5mb1wiPjwvZGl2PlxyXG4gICAgICAgICAgICA8aDMgc3R5bGU9XCJtYXJnaW46OHB4IDA7Zm9udC1zaXplOjE4cHg7XCI+XHU4OUMyXHU3NzBCXHU1RTdGXHU1NDRBPC9oMz5cclxuICAgICAgICAgICAgPHAgc3R5bGU9XCJvcGFjaXR5Oi44NTttYXJnaW46OHB4IDA7XCI+XHU4OUMyXHU3NzBCMTVcdTc5RDJcdTVFN0ZcdTU0NEFcdTg5QzZcdTk4OTFcdTUzNzNcdTUzRUZcdTY1MzZcdTc3RkY8YnIvPlx1NUU3Nlx1OTg5RFx1NTkxNlx1ODNCN1x1NUY5NyA1LTE1IFx1NzdGRlx1NzdGM1x1NTk1Nlx1NTJCMVx1RkYwMTwvcD5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFkLXBsYWNlaG9sZGVyXCI+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFkLXByb2dyZXNzLXJpbmdcIj5cclxuICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCIxMDBcIiBoZWlnaHQ9XCIxMDBcIj5cclxuICAgICAgICAgICAgICAgICAgPGNpcmNsZSBjbGFzcz1cImFkLWNpcmNsZS1iZ1wiIGN4PVwiNTBcIiBjeT1cIjUwXCIgcj1cIjQ1XCI+PC9jaXJjbGU+XHJcbiAgICAgICAgICAgICAgICAgIDxjaXJjbGUgY2xhc3M9XCJhZC1jaXJjbGUtZmdcIiBjeD1cIjUwXCIgY3k9XCI1MFwiIHI9XCI0NVwiIGlkPVwiYWRDaXJjbGVcIj48L2NpcmNsZT5cclxuICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFkLWNvdW50ZG93blwiIGlkPVwiYWRDb3VudGRvd25cIj4xNTwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDxwIHN0eWxlPVwib3BhY2l0eTouNzU7Zm9udC1zaXplOjEzcHg7bWFyZ2luLXRvcDoxMnB4O1wiPltcdTVFN0ZcdTU0NEFcdTUzNjBcdTRGNERcdTdCMjYgLSBcdTVCOUVcdTk2NDVcdTVFOTRcdTYzQTVcdTUxNjVTREtdPC9wPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFkLWFjdGlvbnNcIj5cclxuICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1naG9zdFwiIGlkPVwiYWRTa2lwXCI+XHU4REYzXHU4RkM3XHVGRjA4XHU2NUUwXHU1OTU2XHU1MkIxXHVGRjA5PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiIGlkPVwiYWRDb21wbGV0ZVwiIGRpc2FibGVkPlx1OTg4Nlx1NTNENlx1NTk1Nlx1NTJCMTwvYnV0dG9uPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIGApIGFzIEhUTUxFbGVtZW50O1xyXG5cclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQob3ZlcmxheSk7XHJcblxyXG4gICAgLy8gXHU2RTMyXHU2N0QzXHU1NkZFXHU2ODA3XHJcbiAgICB0cnkge1xyXG4gICAgICBvdmVybGF5LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWljb10nKS5mb3JFYWNoKChlbCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSAoZWwgYXMgSFRNTEVsZW1lbnQpLmdldEF0dHJpYnV0ZSgnZGF0YS1pY28nKSBhcyBhbnk7XHJcbiAgICAgICAgdHJ5IHsgZWwuYXBwZW5kQ2hpbGQocmVuZGVySWNvbihuYW1lLCB7IHNpemU6IDQ4IH0pKTsgfSBjYXRjaCB7fVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2gge31cclxuXHJcbiAgICBjb25zdCBza2lwQnRuID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yKCcjYWRTa2lwJykgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgICBjb25zdCBjb21wbGV0ZUJ0biA9IG92ZXJsYXkucXVlcnlTZWxlY3RvcignI2FkQ29tcGxldGUnKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgIGNvbnN0IGNvdW50ZG93biA9IG92ZXJsYXkucXVlcnlTZWxlY3RvcignI2FkQ291bnRkb3duJykgYXMgSFRNTEVsZW1lbnQ7XHJcbiAgICBjb25zdCBjaXJjbGUgPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3IoJyNhZENpcmNsZScpIGFzIFNWR0NpcmNsZUVsZW1lbnQ7XHJcblxyXG4gICAgLy8gXHU2QTIxXHU2MkRGMTVcdTc5RDJcdTUwMTJcdThCQTFcdTY1RjZcclxuICAgIGxldCBzZWNvbmRzID0gMTU7XHJcbiAgICBjb25zdCBjaXJjdW1mZXJlbmNlID0gMiAqIE1hdGguUEkgKiA0NTtcclxuICAgIGlmIChjaXJjbGUpIHtcclxuICAgICAgY2lyY2xlLnN0eWxlLnN0cm9rZURhc2hhcnJheSA9IGAke2NpcmN1bWZlcmVuY2V9YDtcclxuICAgICAgY2lyY2xlLnN0eWxlLnN0cm9rZURhc2hvZmZzZXQgPSBgJHtjaXJjdW1mZXJlbmNlfWA7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdGltZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgIHNlY29uZHMtLTtcclxuICAgICAgY291bnRkb3duLnRleHRDb250ZW50ID0gU3RyaW5nKHNlY29uZHMpO1xyXG4gICAgICBcclxuICAgICAgaWYgKGNpcmNsZSkge1xyXG4gICAgICAgIGNvbnN0IG9mZnNldCA9IGNpcmN1bWZlcmVuY2UgKiAoc2Vjb25kcyAvIDE1KTtcclxuICAgICAgICBjaXJjbGUuc3R5bGUuc3Ryb2tlRGFzaG9mZnNldCA9IFN0cmluZyhvZmZzZXQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoc2Vjb25kcyA8PSAwKSB7XHJcbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lcik7XHJcbiAgICAgICAgY29tcGxldGVCdG4uZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICBjb21wbGV0ZUJ0bi5jbGFzc0xpc3QuYWRkKCdidG4tZW5lcmd5Jyk7XHJcbiAgICAgIH1cclxuICAgIH0sIDEwMDApO1xyXG5cclxuICAgIGNvbnN0IGNsZWFudXAgPSAoKSA9PiB7XHJcbiAgICAgIGNsZWFySW50ZXJ2YWwodGltZXIpO1xyXG4gICAgICBvdmVybGF5LnJlbW92ZSgpO1xyXG4gICAgfTtcclxuXHJcbiAgICBza2lwQnRuLm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgIGNsZWFudXAoKTtcclxuICAgICAgcmVzb2x2ZShmYWxzZSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbXBsZXRlQnRuLm9uY2xpY2sgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgc3VjY2VzczogYm9vbGVhbjsgcmV3YXJkPzogbnVtYmVyIH0+KCcvdXNlci93YXRjaC1hZCcsIHsgbWV0aG9kOiAnUE9TVCcgfSk7XHJcbiAgICAgICAgaWYgKHJlcy5zdWNjZXNzICYmIHJlcy5yZXdhcmQpIHtcclxuICAgICAgICAgIHNob3dUb2FzdChgXHVEODNDXHVERjgxIFx1NUU3Rlx1NTQ0QVx1NTk1Nlx1NTJCMVx1RkYxQVx1ODNCN1x1NUY5NyAke3Jlcy5yZXdhcmR9IFx1NzdGRlx1NzdGM2AsICdzdWNjZXNzJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGNhdGNoIChlOiBhbnkpIHtcclxuICAgICAgICBzaG93VG9hc3QoZT8ubWVzc2FnZSB8fCAnXHU1RTdGXHU1NDRBXHU1OTU2XHU1MkIxXHU5ODg2XHU1M0Q2XHU1OTMxXHU4RDI1JywgJ2Vycm9yJyk7XHJcbiAgICAgIH1cclxuICAgICAgY2xlYW51cCgpO1xyXG4gICAgICByZXNvbHZlKHRydWUpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBcdTcwQjlcdTUxRkJcdTkwNkVcdTdGNjlcdTRFMERcdTUxNzNcdTk1RURcdUZGMDhcdTk2MzJcdThCRUZcdTY0Q0RcdTRGNUNcdUZGMDlcclxuICAgIG92ZXJsYXkub25jbGljayA9IChlKSA9PiB7XHJcbiAgICAgIGlmIChlLnRhcmdldCA9PT0gb3ZlcmxheSkge1xyXG4gICAgICAgIHNob3dUb2FzdCgnXHU4QkY3XHU4OUMyXHU3NzBCXHU1QjhDXHU1RTdGXHU1NDRBXHU2MjE2XHU5MDA5XHU2MkU5XHU4REYzXHU4RkM3JywgJ3dhcm4nKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9KTtcclxufVxyXG5cclxuIiwgImltcG9ydCB7IE5ldHdvcmtNYW5hZ2VyIH0gZnJvbSAnLi4vY29yZS9OZXR3b3JrTWFuYWdlcic7XHJcbmltcG9ydCB7IFJlYWx0aW1lQ2xpZW50IH0gZnJvbSAnLi4vY29yZS9SZWFsdGltZUNsaWVudCc7XHJcbmltcG9ydCB7IGh0bWwsIHFzIH0gZnJvbSAnLi4vdXRpbHMvZG9tJztcclxuaW1wb3J0IHsgcmVuZGVyTmF2IH0gZnJvbSAnLi4vY29tcG9uZW50cy9OYXYnO1xyXG5pbXBvcnQgeyByZW5kZXJSZXNvdXJjZUJhciB9IGZyb20gJy4uL2NvbXBvbmVudHMvUmVzb3VyY2VCYXInO1xyXG5pbXBvcnQgeyBzaG93VG9hc3QgfSBmcm9tICcuLi9jb21wb25lbnRzL1RvYXN0JztcclxuaW1wb3J0IHsgc3Bhd25GbG9hdFRleHQgfSBmcm9tICcuLi9jb21wb25lbnRzL0Zsb2F0VGV4dCc7XHJcbmltcG9ydCB7IHJlbmRlckljb24gfSBmcm9tICcuLi9jb21wb25lbnRzL0ljb24nO1xyXG5pbXBvcnQgeyBzaG93QWREaWFsb2cgfSBmcm9tICcuLi9jb21wb25lbnRzL0FkRGlhbG9nJztcclxuXHJcbnR5cGUgTWluZVN0YXR1cyA9IHtcclxuICBjYXJ0QW1vdW50OiBudW1iZXI7XHJcbiAgY2FydENhcGFjaXR5OiBudW1iZXI7XHJcbiAgY29sbGFwc2VkOiBib29sZWFuO1xyXG4gIGNvbGxhcHNlZFJlbWFpbmluZzogbnVtYmVyO1xyXG4gIHJ1bm5pbmc6IGJvb2xlYW47XHJcbiAgaW50ZXJ2YWxNczogbnVtYmVyO1xyXG59O1xyXG5cclxudHlwZSBQZW5kaW5nQWN0aW9uID0gJ3N0YXJ0JyB8ICdzdG9wJyB8ICdjb2xsZWN0JyB8ICdyZXBhaXInIHwgJ3N0YXR1cycgfCBudWxsO1xyXG5cclxuZXhwb3J0IGNsYXNzIE1haW5TY2VuZSB7XHJcbiAgcHJpdmF0ZSB2aWV3OiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xyXG4gIHByaXZhdGUgY2FydEFtdCA9IDA7XHJcbiAgcHJpdmF0ZSBjYXJ0Q2FwID0gMTAwMDtcclxuICBwcml2YXRlIGlzTWluaW5nID0gZmFsc2U7XHJcbiAgcHJpdmF0ZSBpc0NvbGxhcHNlZCA9IGZhbHNlO1xyXG4gIHByaXZhdGUgY29sbGFwc2VSZW1haW5pbmcgPSAwO1xyXG4gIHByaXZhdGUgY29sbGFwc2VUaW1lcjogbnVtYmVyIHwgbnVsbCA9IG51bGw7XHJcbiAgcHJpdmF0ZSBpbnRlcnZhbE1zID0gMzAwMDtcclxuICBwcml2YXRlIHBlbmRpbmc6IFBlbmRpbmdBY3Rpb24gPSBudWxsO1xyXG5cclxuICBwcml2YXRlIGVscyA9IHtcclxuICAgIGZpbGw6IG51bGwgYXMgSFRNTEVsZW1lbnQgfCBudWxsLFxyXG4gICAgcGVyY2VudDogbnVsbCBhcyBIVE1MRWxlbWVudCB8IG51bGwsXHJcbiAgICBzdGF0dXNUZXh0OiBudWxsIGFzIEhUTUxFbGVtZW50IHwgbnVsbCxcclxuICAgIHJpbmc6IG51bGwgYXMgSFRNTEVsZW1lbnQgfCBudWxsLFxyXG4gICAgcmluZ1BjdDogbnVsbCBhcyBIVE1MRWxlbWVudCB8IG51bGwsXHJcbiAgICBjeWNsZTogbnVsbCBhcyBIVE1MRWxlbWVudCB8IG51bGwsXHJcbiAgICBzdGF0dXNUYWc6IG51bGwgYXMgSFRNTEVsZW1lbnQgfCBudWxsLFxyXG4gICAgZXZlbnRzOiBudWxsIGFzIEhUTUxFbGVtZW50IHwgbnVsbCxcclxuICAgIHN0YXJ0OiBudWxsIGFzIEhUTUxCdXR0b25FbGVtZW50IHwgbnVsbCxcclxuICAgIHN0b3A6IG51bGwgYXMgSFRNTEJ1dHRvbkVsZW1lbnQgfCBudWxsLFxyXG4gICAgY29sbGVjdDogbnVsbCBhcyBIVE1MQnV0dG9uRWxlbWVudCB8IG51bGwsXHJcbiAgICByZXBhaXI6IG51bGwgYXMgSFRNTEJ1dHRvbkVsZW1lbnQgfCBudWxsLFxyXG4gICAgc3RhdHVzQnRuOiBudWxsIGFzIEhUTUxCdXR0b25FbGVtZW50IHwgbnVsbCxcclxuICAgIGhvbG9ncmFtOiBudWxsIGFzIEhUTUxFbGVtZW50IHwgbnVsbCxcclxuICB9O1xyXG5cclxuICBwcml2YXRlIG1pbmVVcGRhdGVIYW5kbGVyPzogKG1zZzogYW55KSA9PiB2b2lkO1xyXG4gIHByaXZhdGUgbWluZUNvbGxhcHNlSGFuZGxlcj86IChtc2c6IGFueSkgPT4gdm9pZDtcclxuICBwcml2YXRlIHBsdW5kZXJIYW5kbGVyPzogKG1zZzogYW55KSA9PiB2b2lkO1xyXG5cclxuICBhc3luYyBtb3VudChyb290OiBIVE1MRWxlbWVudCkge1xyXG4gICAgdGhpcy5jbGVhckNvbGxhcHNlVGltZXIoKTtcclxuICAgIHRoaXMucGVuZGluZyA9IG51bGw7XHJcblxyXG4gICAgY29uc3QgbmF2ID0gcmVuZGVyTmF2KCdtYWluJyk7XHJcbiAgICBjb25zdCBiYXIgPSByZW5kZXJSZXNvdXJjZUJhcigpO1xyXG4gICAgY29uc3QgdmlldyA9IGh0bWwoYFxyXG4gICAgICA8c2VjdGlvbiBjbGFzcz1cIm1haW4tc2NyZWVuXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIm1haW4tYW1iaWVudFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxyXG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJhbWJpZW50IG9yYiBvcmItYVwiPjwvc3Bhbj5cclxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYW1iaWVudCBvcmIgb3JiLWJcIj48L3NwYW4+XHJcbiAgICAgICAgICA8c3BhbiBjbGFzcz1cImFtYmllbnQgZ3JpZFwiPjwvc3Bhbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyIG1haW4tc3RhY2tcIiBzdHlsZT1cImNvbG9yOiNmZmY7XCI+XHJcbiAgICAgICAgICA8c2VjdGlvbiBjbGFzcz1cIm1pbmUgY2FyZCBtaW5lLWNhcmQgZmFkZS1pblwiPlxyXG4gICAgICAgICAgICA8aGVhZGVyIGNsYXNzPVwibWluZS1oZWFkZXJcIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWluZS10aXRsZVwiPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0aXRsZS1pY29uXCIgZGF0YS1pY289XCJwaWNrXCI+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0aXRsZS1sYWJlbFwiPlx1NjMxNlx1NzdGRlx1OTc2Mlx1Njc3Rjwvc3Bhbj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWluZS1jaGlwc1wiPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwaWxsXCIgaWQ9XCJzdGF0dXNUYWdcIj5cdTVGODVcdTY3M0E8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInBpbGwgcGlsbC1jeWNsZVwiPjxzcGFuIGRhdGEtaWNvPVwiY2xvY2tcIj48L3NwYW4+XHU1NDY4XHU2NzFGIDxzcGFuIGlkPVwiY3ljbGVcIj4zczwvc3Bhbj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvaGVhZGVyPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWluZS1ncmlkXCI+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1pbmUtZ2F1Z2VcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyaW5nXCIgaWQ9XCJyaW5nXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyaW5nLWNvcmVcIj5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBpZD1cInJpbmdQY3RcIj4wJTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8c21hbGw+XHU4OEM1XHU4RjdEXHU3Mzg3PC9zbWFsbD5cclxuICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyaW5nLWdsb3cgcmluZy1nbG93LWFcIj48L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyaW5nLWdsb3cgcmluZy1nbG93LWJcIj48L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWluZS1wcm9ncmVzc1wiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1pbmUtcHJvZ3Jlc3MtbWV0YVwiPlxyXG4gICAgICAgICAgICAgICAgICA8c3Bhbj5cdTc3RkZcdThGNjZcdTg4QzVcdThGN0Q8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgIDxzdHJvbmcgaWQ9XCJwZXJjZW50XCI+MCU8L3N0cm9uZz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1pbmUtcHJvZ3Jlc3MtdHJhY2tcIj5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1pbmUtcHJvZ3Jlc3MtZmlsbFwiIGlkPVwiZmlsbFwiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGlkPVwic3RhdHVzVGV4dFwiIGNsYXNzPVwibWluZS1zdGF0dXNcIj48L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtaW5lLWFjdGlvbnMtZ3JpZFwiPlxyXG4gICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJzdGFydFwiIGNsYXNzPVwiYnRuIGJ0bi1idXkgc3Bhbi0yXCI+PHNwYW4gZGF0YS1pY289XCJwbGF5XCI+PC9zcGFuPlx1NUYwMFx1NTlDQlx1NjMxNlx1NzdGRjwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJzdG9wXCIgY2xhc3M9XCJidG4gYnRuLWdob3N0XCI+PHNwYW4gZGF0YS1pY289XCJzdG9wXCI+PC9zcGFuPlx1NTA1Q1x1NkI2MjwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJjb2xsZWN0XCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIj48c3BhbiBkYXRhLWljbz1cImNvbGxlY3RcIj48L3NwYW4+XHU2NTM2XHU3N0ZGPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInN0YXR1c1wiIGNsYXNzPVwiYnRuIGJ0bi1naG9zdFwiPjxzcGFuIGRhdGEtaWNvPVwicmVmcmVzaFwiPjwvc3Bhbj5cdTUyMzdcdTY1QjBcdTcyQjZcdTYwMDE8L2J1dHRvbj5cclxuICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwicmVwYWlyXCIgY2xhc3M9XCJidG4gYnRuLXNlbGxcIj48c3BhbiBkYXRhLWljbz1cIndyZW5jaFwiPjwvc3Bhbj5cdTRGRUVcdTc0MDY8L2J1dHRvbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtaW5lLWZlZWRcIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZXZlbnQtZmVlZFwiIGlkPVwiZXZlbnRzXCI+PC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWluZS1ob2xvZ3JhbVwiIGlkPVwiaG9sb2dyYW1cIiBhcmlhLWhpZGRlbj1cInRydWVcIj5cclxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm1pbmUtaG9sby1ncmlkXCI+PC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibWluZS1ob2xvLWdyaWQgZGlhZ29uYWxcIj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJtaW5lLWhvbG8tZ2xvd1wiPjwvc3Bhbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L3NlY3Rpb24+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvc2VjdGlvbj5cclxuICAgIGApO1xyXG5cclxuICAgIHJvb3QuaW5uZXJIVE1MID0gJyc7XHJcbiAgICByb290LmFwcGVuZENoaWxkKG5hdik7XHJcbiAgICByb290LmFwcGVuZENoaWxkKGJhci5yb290KTtcclxuICAgIHJvb3QuYXBwZW5kQ2hpbGQodmlldyk7XHJcblxyXG4gICAgdGhpcy52aWV3ID0gdmlldztcclxuICAgIC8vIG1vdW50IGljb25zIGluIGhlYWRlci9idXR0b25zXHJcbiAgICB0cnkge1xyXG4gICAgICB2aWV3LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWljb10nKVxyXG4gICAgICAgIC5mb3JFYWNoKChlbCkgPT4ge1xyXG4gICAgICAgICAgY29uc3QgbmFtZSA9IChlbCBhcyBIVE1MRWxlbWVudCkuZ2V0QXR0cmlidXRlKCdkYXRhLWljbycpIGFzIGFueTtcclxuICAgICAgICAgIHRyeSB7IGVsLmFwcGVuZENoaWxkKHJlbmRlckljb24obmFtZSwgeyBzaXplOiAyMCB9KSk7IH0gY2F0Y2gge31cclxuICAgICAgICB9KTtcclxuICAgIH0gY2F0Y2gge31cclxuICAgIHRoaXMuY2FjaGVFbGVtZW50cygpO1xyXG4gICAgdGhpcy5hdHRhY2hIYW5kbGVycyhiYXIudXBkYXRlLmJpbmQoYmFyKSk7XHJcbiAgICBhd2FpdCBiYXIudXBkYXRlKCk7XHJcbiAgICB0aGlzLnNldHVwUmVhbHRpbWUoKTtcclxuICAgIGF3YWl0IHRoaXMucmVmcmVzaFN0YXR1cygpO1xyXG4gICAgdGhpcy51cGRhdGVQcm9ncmVzcygpO1xyXG4gICAgdGhpcy51cGRhdGVDb250cm9scygpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjYWNoZUVsZW1lbnRzKCkge1xyXG4gICAgaWYgKCF0aGlzLnZpZXcpIHJldHVybjtcclxuICAgIHRoaXMuZWxzLmZpbGwgPSBxcyh0aGlzLnZpZXcsICcjZmlsbCcpO1xyXG4gICAgdGhpcy5lbHMucGVyY2VudCA9IHFzKHRoaXMudmlldywgJyNwZXJjZW50Jyk7XHJcbiAgICB0aGlzLmVscy5zdGF0dXNUZXh0ID0gcXModGhpcy52aWV3LCAnI3N0YXR1c1RleHQnKTtcclxuICAgIHRoaXMuZWxzLnJpbmcgPSB0aGlzLnZpZXcucXVlcnlTZWxlY3RvcignI3JpbmcnKTtcclxuICAgIHRoaXMuZWxzLnJpbmdQY3QgPSB0aGlzLnZpZXcucXVlcnlTZWxlY3RvcignI3JpbmdQY3QnKTtcclxuICAgIHRoaXMuZWxzLmN5Y2xlID0gdGhpcy52aWV3LnF1ZXJ5U2VsZWN0b3IoJyNjeWNsZScpO1xyXG4gICAgdGhpcy5lbHMuc3RhdHVzVGFnID0gdGhpcy52aWV3LnF1ZXJ5U2VsZWN0b3IoJyNzdGF0dXNUYWcnKTtcclxuICAgIHRoaXMuZWxzLmV2ZW50cyA9IHRoaXMudmlldy5xdWVyeVNlbGVjdG9yKCcjZXZlbnRzJyk7XHJcbiAgICB0aGlzLmVscy5zdGFydCA9IHFzPEhUTUxCdXR0b25FbGVtZW50Pih0aGlzLnZpZXcsICcjc3RhcnQnKTtcclxuICAgIHRoaXMuZWxzLnN0b3AgPSBxczxIVE1MQnV0dG9uRWxlbWVudD4odGhpcy52aWV3LCAnI3N0b3AnKTtcclxuICAgIHRoaXMuZWxzLmNvbGxlY3QgPSBxczxIVE1MQnV0dG9uRWxlbWVudD4odGhpcy52aWV3LCAnI2NvbGxlY3QnKTtcclxuICAgIHRoaXMuZWxzLnJlcGFpciA9IHFzPEhUTUxCdXR0b25FbGVtZW50Pih0aGlzLnZpZXcsICcjcmVwYWlyJyk7XHJcbiAgICB0aGlzLmVscy5zdGF0dXNCdG4gPSBxczxIVE1MQnV0dG9uRWxlbWVudD4odGhpcy52aWV3LCAnI3N0YXR1cycpO1xyXG4gICAgdGhpcy5lbHMuaG9sb2dyYW0gPSB0aGlzLnZpZXcucXVlcnlTZWxlY3RvcignI2hvbG9ncmFtJyk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGF0dGFjaEhhbmRsZXJzKHVwZGF0ZUJhcjogKCkgPT4gUHJvbWlzZTx2b2lkPikge1xyXG4gICAgaWYgKCF0aGlzLnZpZXcpIHJldHVybjtcclxuICAgIHRoaXMuZWxzLnN0YXJ0Py5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRoaXMuaGFuZGxlU3RhcnQoKSk7XHJcbiAgICB0aGlzLmVscy5zdG9wPy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRoaXMuaGFuZGxlU3RvcCgpKTtcclxuICAgIHRoaXMuZWxzLnN0YXR1c0J0bj8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0aGlzLnJlZnJlc2hTdGF0dXMoKSk7XHJcbiAgICB0aGlzLmVscy5yZXBhaXI/LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdGhpcy5oYW5kbGVSZXBhaXIoKSk7XHJcbiAgICB0aGlzLmVscy5jb2xsZWN0Py5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRoaXMuaGFuZGxlQ29sbGVjdCh1cGRhdGVCYXIpKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2V0dXBSZWFsdGltZSgpIHtcclxuICAgIGNvbnN0IHRva2VuID0gTmV0d29ya01hbmFnZXIuSS5nZXRUb2tlbigpO1xyXG4gICAgaWYgKHRva2VuKSBSZWFsdGltZUNsaWVudC5JLmNvbm5lY3QodG9rZW4pO1xyXG5cclxuICAgIGlmICh0aGlzLm1pbmVVcGRhdGVIYW5kbGVyKSBSZWFsdGltZUNsaWVudC5JLm9mZignbWluZS51cGRhdGUnLCB0aGlzLm1pbmVVcGRhdGVIYW5kbGVyKTtcclxuICAgIGlmICh0aGlzLm1pbmVDb2xsYXBzZUhhbmRsZXIpIFJlYWx0aW1lQ2xpZW50Lkkub2ZmKCdtaW5lLmNvbGxhcHNlJywgdGhpcy5taW5lQ29sbGFwc2VIYW5kbGVyKTtcclxuICAgIGlmICh0aGlzLnBsdW5kZXJIYW5kbGVyKSBSZWFsdGltZUNsaWVudC5JLm9mZigncGx1bmRlci5hdHRhY2tlZCcsIHRoaXMucGx1bmRlckhhbmRsZXIpO1xyXG5cclxuICAgIHRoaXMubWluZVVwZGF0ZUhhbmRsZXIgPSAobXNnKSA9PiB7XHJcbiAgICAgIHRoaXMuY2FydEFtdCA9IHR5cGVvZiBtc2cuY2FydEFtb3VudCA9PT0gJ251bWJlcicgPyBtc2cuY2FydEFtb3VudCA6IHRoaXMuY2FydEFtdDtcclxuICAgICAgdGhpcy5jYXJ0Q2FwID0gdHlwZW9mIG1zZy5jYXJ0Q2FwYWNpdHkgPT09ICdudW1iZXInID8gbXNnLmNhcnRDYXBhY2l0eSA6IHRoaXMuY2FydENhcDtcclxuICAgICAgdGhpcy5pc01pbmluZyA9IG1zZy5ydW5uaW5nID8/IHRoaXMuaXNNaW5pbmc7XHJcbiAgICAgIGlmIChtc2cuY29sbGFwc2VkICYmIG1zZy5jb2xsYXBzZWRSZW1haW5pbmcpIHtcclxuICAgICAgICB0aGlzLmJlZ2luQ29sbGFwc2VDb3VudGRvd24obXNnLmNvbGxhcHNlZFJlbWFpbmluZyk7XHJcbiAgICAgIH0gZWxzZSBpZiAoIW1zZy5jb2xsYXBzZWQpIHtcclxuICAgICAgICB0aGlzLmlzQ29sbGFwc2VkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5jbGVhckNvbGxhcHNlVGltZXIoKTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnVwZGF0ZVByb2dyZXNzKCk7XHJcbiAgICAgIFxyXG4gICAgICAvLyBcdTc4OEVcdTcyNDdcdTgzQjdcdTVGOTdcdTYzRDBcdTc5M0FcclxuICAgICAgaWYgKG1zZy5mcmFnbWVudCkge1xyXG4gICAgICAgIGNvbnN0IGZyYWdtZW50TmFtZXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XHJcbiAgICAgICAgICBtaW5lcjogJ1x1NzdGRlx1NjczQVx1Nzg4RVx1NzI0NycsXHJcbiAgICAgICAgICBjYXJ0OiAnXHU3N0ZGXHU4RjY2XHU3ODhFXHU3MjQ3JyxcclxuICAgICAgICAgIHJhaWRlcjogJ1x1NjNBMFx1NTkzQVx1NTY2OFx1Nzg4RVx1NzI0NycsXHJcbiAgICAgICAgICBzaGllbGQ6ICdcdTk2MzJcdTVGQTFcdTc2RkVcdTc4OEVcdTcyNDcnLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgc2hvd1RvYXN0KGBcdUQ4M0RcdURDOEUgXHU4M0I3XHU1Rjk3ICR7ZnJhZ21lbnROYW1lc1ttc2cuZnJhZ21lbnQudHlwZV0gfHwgJ1x1Nzg4RVx1NzI0Nyd9IHgke21zZy5mcmFnbWVudC5hbW91bnR9YCwgJ3N1Y2Nlc3MnKTtcclxuICAgICAgICB0aGlzLmxvZ0V2ZW50KGBcdTgzQjdcdTVGOTdcdTc4OEVcdTcyNDdcdUZGMUEke2ZyYWdtZW50TmFtZXNbbXNnLmZyYWdtZW50LnR5cGVdfSB4JHttc2cuZnJhZ21lbnQuYW1vdW50fWApO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICBpZiAobXNnLnR5cGUgPT09ICdjcml0aWNhbCcgJiYgbXNnLmFtb3VudCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZShgXHU4OUU2XHU1M0QxXHU2NkI0XHU1MUZCXHVGRjBDXHU3N0ZGXHU4RjY2XHU1ODlFXHU1MkEwICR7bXNnLmFtb3VudH1cdUZGMDFgKTtcclxuICAgICAgICB0aGlzLmxvZ0V2ZW50KGBcdTY2QjRcdTUxRkIgKyR7bXNnLmFtb3VudH1gKTtcclxuICAgICAgfSBlbHNlIGlmIChtc2cudHlwZSA9PT0gJ25vcm1hbCcgJiYgbXNnLmFtb3VudCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZShgXHU3N0ZGXHU4RjY2XHU1ODlFXHU1MkEwICR7bXNnLmFtb3VudH1cdUZGMENcdTVGNTNcdTUyNEQgJHt0aGlzLmZvcm1hdFBlcmNlbnQoKX1gKTtcclxuICAgICAgICB0aGlzLmxvZ0V2ZW50KGBcdTYzMTZcdTYzOTggKyR7bXNnLmFtb3VudH1gKTtcclxuICAgICAgfSBlbHNlIGlmIChtc2cudHlwZSA9PT0gJ2NvbGxhcHNlJykge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZSgnXHU3N0ZGXHU5MDUzXHU1NzREXHU1ODRDXHVGRjBDXHU4QkY3XHU3QUNCXHU1MzczXHU0RkVFXHU3NDA2Jyk7XHJcbiAgICAgICAgdGhpcy5sb2dFdmVudCgnXHU3N0ZGXHU5MDUzXHU1NzREXHU1ODRDJyk7XHJcbiAgICAgIH0gZWxzZSBpZiAobXNnLnR5cGUgPT09ICdjb2xsZWN0Jykge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZSgnXHU3N0ZGXHU3N0YzXHU1REYyXHU2NTM2XHU5NkM2XHVGRjBDXHU3N0ZGXHU4RjY2XHU2RTA1XHU3QTdBJyk7XHJcbiAgICAgICAgdGhpcy5sb2dFdmVudCgnXHU2NTM2XHU5NkM2XHU1QjhDXHU2MjEwJyk7XHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0NvbGxhcHNlZCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZShgXHU3N0ZGXHU5MDUzXHU1NzREXHU1ODRDXHVGRjBDXHU1MjY5XHU0RjU5ICR7dGhpcy5jb2xsYXBzZVJlbWFpbmluZ31zYCk7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy51cGRhdGVDb250cm9scygpO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLm1pbmVDb2xsYXBzZUhhbmRsZXIgPSAobXNnKSA9PiB7XHJcbiAgICAgIGNvbnN0IHNlY29uZHMgPSBOdW1iZXIobXNnPy5yZXBhaXJfZHVyYXRpb24pIHx8IDA7XHJcbiAgICAgIGlmIChzZWNvbmRzID4gMCkgdGhpcy5iZWdpbkNvbGxhcHNlQ291bnRkb3duKHNlY29uZHMpO1xyXG4gICAgICBzaG93VG9hc3QoYFx1NzdGRlx1OTA1M1x1NTc0RFx1NTg0Q1x1RkYwQ1x1OTcwMFx1NEZFRVx1NzQwNlx1RkYwOFx1N0VBNiAke3NlY29uZHN9c1x1RkYwOWAsICd3YXJuJyk7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMucGx1bmRlckhhbmRsZXIgPSAobXNnKSA9PiB7XHJcbiAgICAgIHNob3dUb2FzdChgXHU4OEFCXHU2M0EwXHU1OTNBXHVGRjFBXHU2NzY1XHU4MUVBICR7bXNnLmF0dGFja2VyfVx1RkYwQ1x1NjM1Rlx1NTkzMSAke21zZy5sb3NzfWAsICd3YXJuJyk7XHJcbiAgICAgIHRoaXMubG9nRXZlbnQoYFx1ODhBQiAke21zZy5hdHRhY2tlcn0gXHU2M0EwXHU1OTNBIC0ke21zZy5sb3NzfWApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBcdTUxNjhcdTY3MERcdTVFN0ZcdTY0QURcdTc2RDFcdTU0MkNcclxuICAgIFJlYWx0aW1lQ2xpZW50Lkkub24oJ2dsb2JhbC5hbm5vdW5jZW1lbnQnLCAobXNnKSA9PiB7XHJcbiAgICAgIGlmIChtc2cudHlwZSA9PT0gJ3VwZ3JhZGUnKSB7XHJcbiAgICAgICAgc2hvd1RvYXN0KGBcdUQ4M0RcdURDRTIgJHttc2cubWVzc2FnZX1gLCAnc3VjY2VzcycpO1xyXG4gICAgICAgIHRoaXMubG9nRXZlbnQoYFtcdTUxNjhcdTY3MERdICR7bXNnLm1lc3NhZ2V9YCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIFJlYWx0aW1lQ2xpZW50Lkkub24oJ21pbmUudXBkYXRlJywgdGhpcy5taW5lVXBkYXRlSGFuZGxlcik7XHJcbiAgICBSZWFsdGltZUNsaWVudC5JLm9uKCdtaW5lLmNvbGxhcHNlJywgdGhpcy5taW5lQ29sbGFwc2VIYW5kbGVyKTtcclxuICAgIFJlYWx0aW1lQ2xpZW50Lkkub24oJ3BsdW5kZXIuYXR0YWNrZWQnLCB0aGlzLnBsdW5kZXJIYW5kbGVyKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXN5bmMgaGFuZGxlU3RhcnQoKSB7XHJcbiAgICBpZiAodGhpcy5wZW5kaW5nIHx8IHRoaXMuaXNDb2xsYXBzZWQpIHtcclxuICAgICAgaWYgKHRoaXMuaXNDb2xsYXBzZWQpIHNob3dUb2FzdCgnXHU3N0ZGXHU5MDUzXHU1NzREXHU1ODRDXHVGRjBDXHU4QkY3XHU1MTQ4XHU0RkVFXHU3NDA2JywgJ3dhcm4nKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdGhpcy5wZW5kaW5nID0gJ3N0YXJ0JztcclxuICAgIHRoaXMudXBkYXRlQ29udHJvbHMoKTtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHN0YXR1cyA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDxNaW5lU3RhdHVzPignL21pbmUvc3RhcnQnLCB7IG1ldGhvZDogJ1BPU1QnIH0pO1xyXG4gICAgICB0aGlzLmFwcGx5U3RhdHVzKHN0YXR1cyk7XHJcbiAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZSgnXHU3N0ZGXHU2NzNBXHU1REYyXHU1NDJGXHU1MkE4Jyk7XHJcbiAgICAgIHNob3dUb2FzdCgnXHU3N0ZGXHU2NzNBXHU1REYyXHU1NDJGXHU1MkE4JywgJ3N1Y2Nlc3MnKTtcclxuICAgIH0gY2F0Y2ggKGU6IGFueSkge1xyXG4gICAgICBzaG93VG9hc3QoZT8ubWVzc2FnZSB8fCAnXHU1NDJGXHU1MkE4XHU1OTMxXHU4RDI1JywgJ2Vycm9yJyk7XHJcbiAgICB9IGZpbmFsbHkge1xyXG4gICAgICB0aGlzLnBlbmRpbmcgPSBudWxsO1xyXG4gICAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFzeW5jIGhhbmRsZVN0b3AoKSB7XHJcbiAgICBpZiAodGhpcy5wZW5kaW5nKSByZXR1cm47XHJcbiAgICB0aGlzLnBlbmRpbmcgPSAnc3RvcCc7XHJcbiAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzKCk7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBzdGF0dXMgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8TWluZVN0YXR1cz4oJy9taW5lL3N0b3AnLCB7IG1ldGhvZDogJ1BPU1QnIH0pO1xyXG4gICAgICB0aGlzLmFwcGx5U3RhdHVzKHN0YXR1cyk7XHJcbiAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZSgnXHU3N0ZGXHU2NzNBXHU1REYyXHU1MDVDXHU2QjYyJyk7XHJcbiAgICAgIHNob3dUb2FzdCgnXHU3N0ZGXHU2NzNBXHU1REYyXHU1MDVDXHU2QjYyJywgJ3N1Y2Nlc3MnKTtcclxuICAgIH0gY2F0Y2ggKGU6IGFueSkge1xyXG4gICAgICBzaG93VG9hc3QoZT8ubWVzc2FnZSB8fCAnXHU1MDVDXHU2QjYyXHU1OTMxXHU4RDI1JywgJ2Vycm9yJyk7XHJcbiAgICB9IGZpbmFsbHkge1xyXG4gICAgICB0aGlzLnBlbmRpbmcgPSBudWxsO1xyXG4gICAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFzeW5jIGhhbmRsZUNvbGxlY3QodXBkYXRlQmFyOiAoKSA9PiBQcm9taXNlPHZvaWQ+KSB7XHJcbiAgICBpZiAodGhpcy5wZW5kaW5nIHx8IHRoaXMuY2FydEFtdCA8PSAwKSByZXR1cm47XHJcbiAgICBcclxuICAgIC8vIFx1NjhDMFx1NjdFNVZJUFx1NzJCNlx1NjAwMVxyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgdmlwU3RhdHVzID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgaXNWaXA6IGJvb2xlYW4gfT4oJy91c2VyL3ZpcC1zdGF0dXMnKTtcclxuICAgICAgaWYgKCF2aXBTdGF0dXMuaXNWaXApIHtcclxuICAgICAgICAvLyBcdTk3NUVWSVBcdUZGMENcdTY2M0VcdTc5M0FcdTVFN0ZcdTU0NEFcclxuICAgICAgICBjb25zdCB3YXRjaGVkID0gYXdhaXQgc2hvd0FkRGlhbG9nKCk7XHJcbiAgICAgICAgaWYgKCF3YXRjaGVkKSB7XHJcbiAgICAgICAgICAvLyBcdTc1MjhcdTYyMzdcdThERjNcdThGQzdcdTVFN0ZcdTU0NEFcdUZGMENcdTRFMERcdTY1MzZcdTc3RkZcclxuICAgICAgICAgIHNob3dUb2FzdCgnXHU1REYyXHU4REYzXHU4RkM3XHU1RTdGXHU1NDRBXHVGRjBDXHU2NTM2XHU3N0ZGXHU1M0Q2XHU2RDg4JywgJ3dhcm4nKTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGU6IGFueSkge1xyXG4gICAgICBjb25zb2xlLndhcm4oJ1ZJUCBzdGF0dXMgY2hlY2sgZmFpbGVkOicsIGUpO1xyXG4gICAgICAvLyBcdTU5ODJcdTY3OUNcdTY4QzBcdTY3RTVcdTU5MzFcdThEMjVcdUZGMENcdTUxNDFcdThCQjhcdTdFRTdcdTdFRURcdUZGMDhcdTk2NERcdTdFQTdcdTU5MDRcdTc0MDZcdUZGMDlcclxuICAgIH1cclxuICAgIFxyXG4gICAgdGhpcy5wZW5kaW5nID0gJ2NvbGxlY3QnO1xyXG4gICAgdGhpcy51cGRhdGVDb250cm9scygpO1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcmVzID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgY29sbGVjdGVkOiBudW1iZXI7IHN0YXR1czogTWluZVN0YXR1cyB9PignL21pbmUvY29sbGVjdCcsIHsgbWV0aG9kOiAnUE9TVCcgfSk7XHJcbiAgICAgIGlmIChyZXMuc3RhdHVzKSB0aGlzLmFwcGx5U3RhdHVzKHJlcy5zdGF0dXMpO1xyXG4gICAgICBpZiAocmVzLmNvbGxlY3RlZCA+IDApIHtcclxuICAgICAgICAvLyBcdTUyMUJcdTVFRkFcdTYyOUJcdTcyNjlcdTdFQkZcdTk4REVcdTg4NENcdTUyQThcdTc1M0JcclxuICAgICAgICB0aGlzLmNyZWF0ZUZseWluZ09yZUFuaW1hdGlvbihyZXMuY29sbGVjdGVkKTtcclxuICAgICAgICBzaG93VG9hc3QoYFx1NjUzNlx1OTZDNlx1NzdGRlx1NzdGMyAke3Jlcy5jb2xsZWN0ZWR9YCwgJ3N1Y2Nlc3MnKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzaG93VG9hc3QoJ1x1NzdGRlx1OEY2Nlx1NEUzQVx1N0E3QVx1RkYwQ1x1NjVFMFx1NzdGRlx1NzdGM1x1NTNFRlx1NjUzNlx1OTZDNicsICd3YXJuJyk7XHJcbiAgICAgIH1cclxuICAgICAgYXdhaXQgdXBkYXRlQmFyKCk7XHJcbiAgICB9IGNhdGNoIChlOiBhbnkpIHtcclxuICAgICAgc2hvd1RvYXN0KGU/Lm1lc3NhZ2UgfHwgJ1x1NjUzNlx1NzdGRlx1NTkzMVx1OEQyNScsICdlcnJvcicpO1xyXG4gICAgfSBmaW5hbGx5IHtcclxuICAgICAgdGhpcy5wZW5kaW5nID0gbnVsbDtcclxuICAgICAgdGhpcy51cGRhdGVDb250cm9scygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjcmVhdGVGbHlpbmdPcmVBbmltYXRpb24oYW1vdW50OiBudW1iZXIpIHtcclxuICAgIGNvbnN0IGZpbGxFbCA9IHRoaXMuZWxzLmZpbGw7XHJcbiAgICBjb25zdCBvcmVFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNvcmUnKTtcclxuICAgIGlmICghZmlsbEVsIHx8ICFvcmVFbCkgcmV0dXJuO1xyXG5cclxuICAgIGNvbnN0IHN0YXJ0UmVjdCA9IGZpbGxFbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgIGNvbnN0IGVuZFJlY3QgPSBvcmVFbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcbiAgICAvLyBcdTUyMUJcdTVFRkFcdTU5MUFcdTRFMkFcdTc3RkZcdTc3RjNcdTdDOTJcdTVCNTBcclxuICAgIGNvbnN0IHBhcnRpY2xlQ291bnQgPSBNYXRoLm1pbig4LCBNYXRoLm1heCgzLCBNYXRoLmZsb29yKGFtb3VudCAvIDIwKSkpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXJ0aWNsZUNvdW50OyBpKyspIHtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcGFydGljbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBwYXJ0aWNsZS5jbGFzc05hbWUgPSAnb3JlLXBhcnRpY2xlJztcclxuICAgICAgICBwYXJ0aWNsZS50ZXh0Q29udGVudCA9ICdcdUQ4M0RcdURDOEUnO1xyXG4gICAgICAgIHBhcnRpY2xlLnN0eWxlLmNzc1RleHQgPSBgXHJcbiAgICAgICAgICBwb3NpdGlvbjogZml4ZWQ7XHJcbiAgICAgICAgICBsZWZ0OiAke3N0YXJ0UmVjdC5sZWZ0ICsgc3RhcnRSZWN0LndpZHRoIC8gMn1weDtcclxuICAgICAgICAgIHRvcDogJHtzdGFydFJlY3QudG9wICsgc3RhcnRSZWN0LmhlaWdodCAvIDJ9cHg7XHJcbiAgICAgICAgICBmb250LXNpemU6IDI0cHg7XHJcbiAgICAgICAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcclxuICAgICAgICAgIHotaW5kZXg6IDk5OTk7XHJcbiAgICAgICAgICBmaWx0ZXI6IGRyb3Atc2hhZG93KDAgMCA4cHggcmdiYSgxMjMsNDQsMjQ1LDAuOCkpO1xyXG4gICAgICAgIGA7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChwYXJ0aWNsZSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGR4ID0gZW5kUmVjdC5sZWZ0ICsgZW5kUmVjdC53aWR0aCAvIDIgLSBzdGFydFJlY3QubGVmdCAtIHN0YXJ0UmVjdC53aWR0aCAvIDI7XHJcbiAgICAgICAgY29uc3QgZHkgPSBlbmRSZWN0LnRvcCArIGVuZFJlY3QuaGVpZ2h0IC8gMiAtIHN0YXJ0UmVjdC50b3AgLSBzdGFydFJlY3QuaGVpZ2h0IC8gMjtcclxuICAgICAgICBjb25zdCByYW5kb21PZmZzZXQgPSAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiAxMDA7XHJcblxyXG4gICAgICAgIHBhcnRpY2xlLmFuaW1hdGUoW1xyXG4gICAgICAgICAgeyBcclxuICAgICAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlKDAsIDApIHNjYWxlKDEpJywgXHJcbiAgICAgICAgICAgIG9wYWNpdHk6IDEgXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgeyBcclxuICAgICAgICAgICAgdHJhbnNmb3JtOiBgdHJhbnNsYXRlKCR7ZHgvMiArIHJhbmRvbU9mZnNldH1weCwgJHtkeSAtIDE1MH1weCkgc2NhbGUoMS4yKWAsIFxyXG4gICAgICAgICAgICBvcGFjaXR5OiAxLFxyXG4gICAgICAgICAgICBvZmZzZXQ6IDAuNVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHsgXHJcbiAgICAgICAgICAgIHRyYW5zZm9ybTogYHRyYW5zbGF0ZSgke2R4fXB4LCAke2R5fXB4KSBzY2FsZSgwLjUpYCwgXHJcbiAgICAgICAgICAgIG9wYWNpdHk6IDAgXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgXSwge1xyXG4gICAgICAgICAgZHVyYXRpb246IDEwMDAgKyBpICogNTAsXHJcbiAgICAgICAgICBlYXNpbmc6ICdjdWJpYy1iZXppZXIoMC4yNSwgMC40NiwgMC40NSwgMC45NCknXHJcbiAgICAgICAgfSkub25maW5pc2ggPSAoKSA9PiB7XHJcbiAgICAgICAgICBwYXJ0aWNsZS5yZW1vdmUoKTtcclxuICAgICAgICAgIC8vIFx1NjcwMFx1NTQwRVx1NEUwMFx1NEUyQVx1N0M5Mlx1NUI1MFx1NTIzMFx1OEZCRVx1NjVGNlx1RkYwQ1x1NkRGQlx1NTJBMFx1ODEwOVx1NTFCMlx1NjU0OFx1Njc5Q1xyXG4gICAgICAgICAgaWYgKGkgPT09IHBhcnRpY2xlQ291bnQgLSAxKSB7XHJcbiAgICAgICAgICAgIG9yZUVsLmNsYXNzTGlzdC5hZGQoJ2ZsYXNoJyk7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gb3JlRWwuY2xhc3NMaXN0LnJlbW92ZSgnZmxhc2gnKSwgOTAwKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICB9LCBpICogODApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhc3luYyBoYW5kbGVSZXBhaXIoKSB7XHJcbiAgICBpZiAodGhpcy5wZW5kaW5nIHx8ICF0aGlzLmlzQ29sbGFwc2VkKSByZXR1cm47XHJcbiAgICB0aGlzLnBlbmRpbmcgPSAncmVwYWlyJztcclxuICAgIHRoaXMudXBkYXRlQ29udHJvbHMoKTtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHN0YXR1cyA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDxNaW5lU3RhdHVzPignL21pbmUvcmVwYWlyJywgeyBtZXRob2Q6ICdQT1NUJyB9KTtcclxuICAgICAgdGhpcy5hcHBseVN0YXR1cyhzdGF0dXMpO1xyXG4gICAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoJ1x1NzdGRlx1OTA1M1x1NURGMlx1NEZFRVx1NTkwRFx1RkYwQ1x1NTNFRlx1OTFDRFx1NjVCMFx1NTQyRlx1NTJBOCcpO1xyXG4gICAgICBzaG93VG9hc3QoJ1x1NzdGRlx1OTA1M1x1NURGMlx1NEZFRVx1NTkwRCcsICdzdWNjZXNzJyk7XHJcbiAgICB9IGNhdGNoIChlOiBhbnkpIHtcclxuICAgICAgc2hvd1RvYXN0KGU/Lm1lc3NhZ2UgfHwgJ1x1NEZFRVx1NzQwNlx1NTkzMVx1OEQyNScsICdlcnJvcicpO1xyXG4gICAgfSBmaW5hbGx5IHtcclxuICAgICAgdGhpcy5wZW5kaW5nID0gbnVsbDtcclxuICAgICAgdGhpcy51cGRhdGVDb250cm9scygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhc3luYyByZWZyZXNoU3RhdHVzKCkge1xyXG4gICAgaWYgKHRoaXMucGVuZGluZyA9PT0gJ3N0YXR1cycpIHJldHVybjtcclxuICAgIHRoaXMucGVuZGluZyA9ICdzdGF0dXMnO1xyXG4gICAgdGhpcy51cGRhdGVDb250cm9scygpO1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3Qgc3RhdHVzID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PE1pbmVTdGF0dXM+KCcvbWluZS9zdGF0dXMnKTtcclxuICAgICAgdGhpcy5hcHBseVN0YXR1cyhzdGF0dXMpO1xyXG4gICAgfSBjYXRjaCAoZTogYW55KSB7XHJcbiAgICAgIHNob3dUb2FzdChlPy5tZXNzYWdlIHx8ICdcdTgzQjdcdTUzRDZcdTcyQjZcdTYwMDFcdTU5MzFcdThEMjUnLCAnZXJyb3InKTtcclxuICAgIH0gZmluYWxseSB7XHJcbiAgICAgIHRoaXMucGVuZGluZyA9IG51bGw7XHJcbiAgICAgIHRoaXMudXBkYXRlQ29udHJvbHMoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXBwbHlTdGF0dXMoc3RhdHVzOiBNaW5lU3RhdHVzIHwgdW5kZWZpbmVkLCBvcHRzOiB7IHF1aWV0PzogYm9vbGVhbiB9ID0ge30pIHtcclxuICAgIGlmICghc3RhdHVzKSByZXR1cm47XHJcbiAgICB0aGlzLmNhcnRBbXQgPSBzdGF0dXMuY2FydEFtb3VudCA/PyB0aGlzLmNhcnRBbXQ7XHJcbiAgICB0aGlzLmNhcnRDYXAgPSBzdGF0dXMuY2FydENhcGFjaXR5ID8/IHRoaXMuY2FydENhcDtcclxuICAgIHRoaXMuaW50ZXJ2YWxNcyA9IHN0YXR1cy5pbnRlcnZhbE1zID8/IHRoaXMuaW50ZXJ2YWxNcztcclxuICAgIHRoaXMuaXNNaW5pbmcgPSBCb29sZWFuKHN0YXR1cy5ydW5uaW5nKTtcclxuICAgIHRoaXMuaXNDb2xsYXBzZWQgPSBCb29sZWFuKHN0YXR1cy5jb2xsYXBzZWQpO1xyXG4gICAgaWYgKHN0YXR1cy5jb2xsYXBzZWQgJiYgc3RhdHVzLmNvbGxhcHNlZFJlbWFpbmluZyA+IDApIHtcclxuICAgICAgdGhpcy5iZWdpbkNvbGxhcHNlQ291bnRkb3duKHN0YXR1cy5jb2xsYXBzZWRSZW1haW5pbmcpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5jbGVhckNvbGxhcHNlVGltZXIoKTtcclxuICAgICAgdGhpcy5jb2xsYXBzZVJlbWFpbmluZyA9IDA7XHJcbiAgICB9XHJcbiAgICB0aGlzLnVwZGF0ZVByb2dyZXNzKCk7XHJcbiAgICBpZiAoIW9wdHMucXVpZXQpIHtcclxuICAgICAgaWYgKHRoaXMuaXNDb2xsYXBzZWQgJiYgdGhpcy5jb2xsYXBzZVJlbWFpbmluZyA+IDApIHtcclxuICAgICAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoYFx1NzdGRlx1OTA1M1x1NTc0RFx1NTg0Q1x1RkYwQ1x1NTI2OVx1NEY1OSAke3RoaXMuY29sbGFwc2VSZW1haW5pbmd9c2ApO1xyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaXNNaW5pbmcpIHtcclxuICAgICAgICBjb25zdCBzZWNvbmRzID0gTWF0aC5tYXgoMSwgTWF0aC5yb3VuZCh0aGlzLmludGVydmFsTXMgLyAxMDAwKSk7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0dXNNZXNzYWdlKGBcdTc3RkZcdTY3M0FcdThGRDBcdTg4NENcdTRFMkRcdUZGMENcdTU0NjhcdTY3MUZcdTdFQTYgJHtzZWNvbmRzfXNcdUZGMENcdTVGNTNcdTUyNEQgJHt0aGlzLmZvcm1hdFBlcmNlbnQoKX1gKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoJ1x1NzdGRlx1NjczQVx1NURGMlx1NTA1Q1x1NkI2Mlx1RkYwQ1x1NzBCOVx1NTFGQlx1NUYwMFx1NTlDQlx1NjMxNlx1NzdGRicpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5lbHMuY3ljbGUpIHtcclxuICAgICAgY29uc3Qgc2Vjb25kcyA9IE1hdGgubWF4KDEsIE1hdGgucm91bmQodGhpcy5pbnRlcnZhbE1zIC8gMTAwMCkpO1xyXG4gICAgICB0aGlzLmVscy5jeWNsZS50ZXh0Q29udGVudCA9IGAke3NlY29uZHN9c2A7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5lbHMuc3RhdHVzVGFnKSB7XHJcbiAgICAgIGNvbnN0IGVsID0gdGhpcy5lbHMuc3RhdHVzVGFnIGFzIEhUTUxFbGVtZW50O1xyXG4gICAgICBlbC5pbm5lckhUTUwgPSAnJztcclxuICAgICAgXHJcbiAgICAgIC8vIFx1NzlGQlx1OTY2NFx1NjI0MFx1NjcwOVx1NzJCNlx1NjAwMVx1N0M3QlxyXG4gICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdwaWxsLXJ1bm5pbmcnLCAncGlsbC1jb2xsYXBzZWQnKTtcclxuICAgICAgXHJcbiAgICAgIGNvbnN0IGljbyA9IHRoaXMuaXNDb2xsYXBzZWQgPyAnY2xvc2UnIDogKHRoaXMuaXNNaW5pbmcgPyAnYm9sdCcgOiAnY2xvY2snKTtcclxuICAgICAgdHJ5IHsgZWwuYXBwZW5kQ2hpbGQocmVuZGVySWNvbihpY28gYXMgYW55LCB7IHNpemU6IDE2IH0pKTsgfSBjYXRjaCB7fVxyXG4gICAgICBlbC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0aGlzLmlzQ29sbGFwc2VkID8gJ1x1NTc0RFx1NTg0QycgOiAodGhpcy5pc01pbmluZyA/ICdcdThGRDBcdTg4NENcdTRFMkQnIDogJ1x1NUY4NVx1NjczQScpKSk7XHJcbiAgICAgIFxyXG4gICAgICAvLyBcdTZERkJcdTUyQTBcdTVCRjlcdTVFOTRcdTc2ODRcdTUyQThcdTYwMDFcdTY4MzdcdTVGMEZcdTdDN0JcclxuICAgICAgaWYgKHRoaXMuaXNDb2xsYXBzZWQpIHtcclxuICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKCdwaWxsLWNvbGxhcHNlZCcpO1xyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaXNNaW5pbmcpIHtcclxuICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKCdwaWxsLXJ1bm5pbmcnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy51cGRhdGVDb250cm9scygpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBiZWdpbkNvbGxhcHNlQ291bnRkb3duKHNlY29uZHM6IG51bWJlcikge1xyXG4gICAgdGhpcy5jbGVhckNvbGxhcHNlVGltZXIoKTtcclxuICAgIHRoaXMuaXNDb2xsYXBzZWQgPSB0cnVlO1xyXG4gICAgdGhpcy5jb2xsYXBzZVJlbWFpbmluZyA9IE1hdGgubWF4KDAsIE1hdGguZmxvb3Ioc2Vjb25kcykpO1xyXG4gICAgdGhpcy5zZXRTdGF0dXNNZXNzYWdlKGBcdTc3RkZcdTkwNTNcdTU3NERcdTU4NENcdUZGMENcdTUyNjlcdTRGNTkgJHt0aGlzLmNvbGxhcHNlUmVtYWluaW5nfXNgKTtcclxuICAgIHRoaXMudXBkYXRlQ29udHJvbHMoKTtcclxuICAgIHRoaXMuY29sbGFwc2VUaW1lciA9IHdpbmRvdy5zZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgIHRoaXMuY29sbGFwc2VSZW1haW5pbmcgPSBNYXRoLm1heCgwLCB0aGlzLmNvbGxhcHNlUmVtYWluaW5nIC0gMSk7XHJcbiAgICAgIGlmICh0aGlzLmNvbGxhcHNlUmVtYWluaW5nIDw9IDApIHtcclxuICAgICAgICB0aGlzLmNsZWFyQ29sbGFwc2VUaW1lcigpO1xyXG4gICAgICAgIHRoaXMuaXNDb2xsYXBzZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoJ1x1NTc0RFx1NTg0Q1x1ODlFM1x1OTY2NFx1RkYwQ1x1NTNFRlx1OTFDRFx1NjVCMFx1NTQyRlx1NTJBOFx1NzdGRlx1NjczQScpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlQ29udHJvbHMoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoYFx1NzdGRlx1OTA1M1x1NTc0RFx1NTg0Q1x1RkYwQ1x1NTI2OVx1NEY1OSAke3RoaXMuY29sbGFwc2VSZW1haW5pbmd9c2ApO1xyXG4gICAgICB9XHJcbiAgICB9LCAxMDAwKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgY2xlYXJDb2xsYXBzZVRpbWVyKCkge1xyXG4gICAgaWYgKHRoaXMuY29sbGFwc2VUaW1lciAhPT0gbnVsbCkge1xyXG4gICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aGlzLmNvbGxhcHNlVGltZXIpO1xyXG4gICAgICB0aGlzLmNvbGxhcHNlVGltZXIgPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBsYXN0TWlsZXN0b25lID0gMDtcclxuXHJcbiAgcHJpdmF0ZSB1cGRhdGVQcm9ncmVzcygpIHtcclxuICAgIGlmICghdGhpcy5lbHMuZmlsbCB8fCAhdGhpcy5lbHMucGVyY2VudCkgcmV0dXJuO1xyXG4gICAgY29uc3QgcGN0ID0gdGhpcy5jYXJ0Q2FwID4gMCA/IE1hdGgubWluKDEsIHRoaXMuY2FydEFtdCAvIHRoaXMuY2FydENhcCkgOiAwO1xyXG4gICAgY29uc3QgcGN0SW50ID0gTWF0aC5yb3VuZChwY3QgKiAxMDApO1xyXG4gICAgXHJcbiAgICB0aGlzLmVscy5maWxsLnN0eWxlLndpZHRoID0gYCR7cGN0SW50fSVgO1xyXG4gICAgdGhpcy5lbHMucGVyY2VudC50ZXh0Q29udGVudCA9IGAke3BjdEludH0lYDtcclxuICAgIFxyXG4gICAgLy8gXHU1NzA2XHU3M0FGXHU5ODlDXHU4MjcyXHU2RTEwXHU1M0Q4XHVGRjFBXHU3RDJCXHU4MjcyIC0+IFx1ODRERFx1ODI3MiAtPiBcdTkxRDFcdTgyNzJcclxuICAgIGxldCByaW5nQ29sb3IgPSAnIzdCMkNGNSc7IC8vIFx1N0QyQlx1ODI3MlxyXG4gICAgaWYgKHBjdCA+PSAwLjc1KSB7XHJcbiAgICAgIHJpbmdDb2xvciA9ICcjZjZjNDQ1JzsgLy8gXHU5MUQxXHU4MjcyXHJcbiAgICB9IGVsc2UgaWYgKHBjdCA+PSAwLjUpIHtcclxuICAgICAgcmluZ0NvbG9yID0gJyMyQzg5RjUnOyAvLyBcdTg0RERcdTgyNzJcclxuICAgIH1cclxuICAgIFxyXG4gICAgaWYgKHRoaXMuZWxzLnJpbmcpIHtcclxuICAgICAgY29uc3QgZGVnID0gTWF0aC5yb3VuZChwY3QgKiAzNjApO1xyXG4gICAgICAodGhpcy5lbHMucmluZyBhcyBIVE1MRWxlbWVudCkuc3R5bGUuYmFja2dyb3VuZCA9IGBjb25pYy1ncmFkaWVudCgke3JpbmdDb2xvcn0gJHtkZWd9ZGVnLCByZ2JhKDI1NSwyNTUsMjU1LC4wOCkgMGRlZylgO1xyXG4gICAgICBcclxuICAgICAgLy8gXHU2RUUxXHU4RjdEXHU2NUY2XHU2MzAxXHU3RUVEXHU5NUVBXHU4MDAwXHJcbiAgICAgIGlmIChwY3QgPj0gMSkge1xyXG4gICAgICAgIHRoaXMuZWxzLnJpbmcuY2xhc3NMaXN0LmFkZCgncmluZy1mdWxsJyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5lbHMucmluZy5jbGFzc0xpc3QucmVtb3ZlKCdyaW5nLWZ1bGwnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpZiAodGhpcy5lbHMucmluZ1BjdCkgdGhpcy5lbHMucmluZ1BjdC50ZXh0Q29udGVudCA9IGAke3BjdEludH0lYDtcclxuICAgIFxyXG4gICAgLy8gXHU5MUNDXHU3QTBCXHU3ODkxXHU4MTA5XHU1MUIyXHU3Mjc5XHU2NTQ4XHJcbiAgICBjb25zdCBtaWxlc3RvbmVzID0gWzI1LCA1MCwgNzUsIDEwMF07XHJcbiAgICBmb3IgKGNvbnN0IG1pbGVzdG9uZSBvZiBtaWxlc3RvbmVzKSB7XHJcbiAgICAgIGlmIChwY3RJbnQgPj0gbWlsZXN0b25lICYmIHRoaXMubGFzdE1pbGVzdG9uZSA8IG1pbGVzdG9uZSkge1xyXG4gICAgICAgIHRoaXMudHJpZ2dlck1pbGVzdG9uZVB1bHNlKG1pbGVzdG9uZSk7XHJcbiAgICAgICAgdGhpcy5sYXN0TWlsZXN0b25lID0gbWlsZXN0b25lO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIFx1NUY1M1x1ODhDNVx1OEY3RFx1NzM4N1x1NEUwQlx1OTY0RFx1RkYwOFx1NjUzNlx1NzdGRlx1NTQwRVx1RkYwOVx1OTFDRFx1N0Y2RVx1OTFDQ1x1N0EwQlx1Nzg5MVxyXG4gICAgaWYgKHBjdEludCA8IHRoaXMubGFzdE1pbGVzdG9uZSAtIDEwKSB7XHJcbiAgICAgIHRoaXMubGFzdE1pbGVzdG9uZSA9IE1hdGguZmxvb3IocGN0SW50IC8gMjUpICogMjU7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIDkwJVx1OEI2Nlx1NTQ0QVx1NjNEMFx1NzkzQVxyXG4gICAgaWYgKHBjdEludCA+PSA5MCAmJiBwY3RJbnQgPCAxMDApIHtcclxuICAgICAgaWYgKCF0aGlzLmVscy5zdGF0dXNUZXh0Py50ZXh0Q29udGVudD8uaW5jbHVkZXMoJ1x1NTM3M1x1NUMwNlx1NkVFMVx1OEY3RCcpKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0dXNNZXNzYWdlKCdcdTI2QTBcdUZFMEYgXHU3N0ZGXHU4RjY2XHU1MzczXHU1QzA2XHU2RUUxXHU4RjdEXHVGRjBDXHU1RUZBXHU4QkFFXHU2NTM2XHU3N0ZGJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgaWYgKHRoaXMucGVuZGluZyAhPT0gJ2NvbGxlY3QnICYmIHRoaXMuZWxzLmNvbGxlY3QpIHtcclxuICAgICAgdGhpcy5lbHMuY29sbGVjdC5kaXNhYmxlZCA9IHRoaXMucGVuZGluZyA9PT0gJ2NvbGxlY3QnIHx8IHRoaXMuY2FydEFtdCA8PSAwO1xyXG4gICAgICBcclxuICAgICAgLy8gXHU1M0VGXHU2NTM2XHU3N0ZGXHU2NUY2XHU2REZCXHU1MkEwXHU4MEZEXHU5MUNGXHU3Mjc5XHU2NTQ4XHJcbiAgICAgIGlmICh0aGlzLmNhcnRBbXQgPiAwICYmICF0aGlzLmVscy5jb2xsZWN0LmRpc2FibGVkKSB7XHJcbiAgICAgICAgdGhpcy5lbHMuY29sbGVjdC5jbGFzc0xpc3QuYWRkKCdidG4tZW5lcmd5Jyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5lbHMuY29sbGVjdC5jbGFzc0xpc3QucmVtb3ZlKCdidG4tZW5lcmd5Jyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gXHU2NkY0XHU2NUIwXHU3N0ZGXHU3N0YzXHU2NTcwXHU5MUNGXHJcbiAgICB0aGlzLnVwZGF0ZVNoYXJkcyhwY3QpO1xyXG4gICAgXHJcbiAgICAvLyBcdTY2RjRcdTY1QjBcdTUxNjhcdTYwNkZcdTgwQ0NcdTY2NkZcdTcyQjZcdTYwMDFcclxuICAgIHRoaXMudXBkYXRlSG9sb2dyYW1TdGF0ZSgpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB0cmlnZ2VyTWlsZXN0b25lUHVsc2UobWlsZXN0b25lOiBudW1iZXIpIHtcclxuICAgIGlmICh0aGlzLmVscy5yaW5nKSB7XHJcbiAgICAgIHRoaXMuZWxzLnJpbmcuY2xhc3NMaXN0LmFkZCgnbWlsZXN0b25lLXB1bHNlJyk7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5lbHMucmluZz8uY2xhc3NMaXN0LnJlbW92ZSgnbWlsZXN0b25lLXB1bHNlJyksIDEwMDApO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpZiAodGhpcy5lbHMucmluZ1BjdCkge1xyXG4gICAgICB0aGlzLmVscy5yaW5nUGN0LmNsYXNzTGlzdC5hZGQoJ2ZsYXNoJyk7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5lbHMucmluZ1BjdD8uY2xhc3NMaXN0LnJlbW92ZSgnZmxhc2gnKSwgOTAwKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gXHU2NjNFXHU3OTNBXHU5MUNDXHU3QTBCXHU3ODkxXHU2RDg4XHU2MDZGXHJcbiAgICBzaG93VG9hc3QoYFx1RDgzQ1x1REZBRiBcdThGQkVcdTYyMTAgJHttaWxlc3RvbmV9JSBcdTg4QzVcdThGN0RcdTczODdcdUZGMDFgLCAnc3VjY2VzcycpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB1cGRhdGVIb2xvZ3JhbVN0YXRlKCkge1xyXG4gICAgaWYgKCF0aGlzLmVscy5ob2xvZ3JhbSkgcmV0dXJuO1xyXG4gICAgXHJcbiAgICAvLyBcdTc5RkJcdTk2NjRcdTYyNDBcdTY3MDlcdTcyQjZcdTYwMDFcdTdDN0JcclxuICAgIHRoaXMuZWxzLmhvbG9ncmFtLmNsYXNzTGlzdC5yZW1vdmUoJ2hvbG8taWRsZScsICdob2xvLW1pbmluZycsICdob2xvLWNvbGxhcHNlZCcpO1xyXG4gICAgXHJcbiAgICAvLyBcdTY4MzlcdTYzNkVcdTcyQjZcdTYwMDFcdTZERkJcdTUyQTBcdTVCRjlcdTVFOTRcdTc2ODRcdTdDN0JcclxuICAgIGlmICh0aGlzLmlzQ29sbGFwc2VkKSB7XHJcbiAgICAgIHRoaXMuZWxzLmhvbG9ncmFtLmNsYXNzTGlzdC5hZGQoJ2hvbG8tY29sbGFwc2VkJyk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNNaW5pbmcpIHtcclxuICAgICAgdGhpcy5lbHMuaG9sb2dyYW0uY2xhc3NMaXN0LmFkZCgnaG9sby1taW5pbmcnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuZWxzLmhvbG9ncmFtLmNsYXNzTGlzdC5hZGQoJ2hvbG8taWRsZScpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB1cGRhdGVTaGFyZHMobG9hZFBlcmNlbnQ6IG51bWJlcikge1xyXG4gICAgaWYgKCF0aGlzLmVscy5ob2xvZ3JhbSkgcmV0dXJuO1xyXG4gICAgXHJcbiAgICAvLyBcdThCQTFcdTdCOTdcdTVFOTRcdThCRTVcdTY2M0VcdTc5M0FcdTc2ODRcdTc3RkZcdTc3RjNcdTY1NzBcdTkxQ0ZcdUZGMDhcdTg4QzVcdThGN0RcdTczODdcdThEOEFcdTlBRDhcdUZGMENcdTc3RkZcdTc3RjNcdThEOEFcdTU5MUFcdUZGMDlcclxuICAgIC8vIDAtMjAlOiAyXHU0RTJBLCAyMC00MCU6IDRcdTRFMkEsIDQwLTYwJTogNlx1NEUyQSwgNjAtODAlOiA4XHU0RTJBLCA4MC0xMDAlOiAxMFx1NEUyQVxyXG4gICAgY29uc3QgdGFyZ2V0Q291bnQgPSBNYXRoLm1heCgyLCBNYXRoLm1pbigxMiwgTWF0aC5mbG9vcihsb2FkUGVyY2VudCAqIDEyKSArIDIpKTtcclxuICAgIFxyXG4gICAgLy8gXHU4M0I3XHU1M0Q2XHU1RjUzXHU1MjREXHU3N0ZGXHU3N0YzXHU1MTQzXHU3RDIwXHJcbiAgICBjb25zdCBjdXJyZW50U2hhcmRzID0gdGhpcy5lbHMuaG9sb2dyYW0ucXVlcnlTZWxlY3RvckFsbCgnLm1pbmUtc2hhcmQnKTtcclxuICAgIGNvbnN0IGN1cnJlbnRDb3VudCA9IGN1cnJlbnRTaGFyZHMubGVuZ3RoO1xyXG4gICAgXHJcbiAgICAvLyBcdTU5ODJcdTY3OUNcdTY1NzBcdTkxQ0ZcdTc2RjhcdTU0MENcdUZGMENcdTRFMERcdTUwNUFcdTU5MDRcdTc0MDZcclxuICAgIGlmIChjdXJyZW50Q291bnQgPT09IHRhcmdldENvdW50KSByZXR1cm47XHJcbiAgICBcclxuICAgIC8vIFx1OTcwMFx1ODk4MVx1NkRGQlx1NTJBMFx1NzdGRlx1NzdGM1xyXG4gICAgaWYgKGN1cnJlbnRDb3VudCA8IHRhcmdldENvdW50KSB7XHJcbiAgICAgIGNvbnN0IHRvQWRkID0gdGFyZ2V0Q291bnQgLSBjdXJyZW50Q291bnQ7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG9BZGQ7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IHNoYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgIHNoYXJkLmNsYXNzTmFtZSA9ICdtaW5lLXNoYXJkJztcclxuICAgICAgICBcclxuICAgICAgICAvLyBcdTk2OEZcdTY3M0FcdTRGNERcdTdGNkVcdTU0OENcdTU5MjdcdTVDMEZcclxuICAgICAgICBjb25zdCBwb3NpdGlvbnMgPSBbXHJcbiAgICAgICAgICB7IHRvcDogJzE4JScsIGxlZnQ6ICcxNiUnLCBkZWxheTogLTEuNCwgc2NhbGU6IDEgfSxcclxuICAgICAgICAgIHsgYm90dG9tOiAnMTYlJywgcmlnaHQ6ICcyMiUnLCBkZWxheTogLTMuMiwgc2NhbGU6IDAuNzQgfSxcclxuICAgICAgICAgIHsgdG9wOiAnMjYlJywgcmlnaHQ6ICczNCUnLCBkZWxheTogLTUuMSwgc2NhbGU6IDAuNSB9LFxyXG4gICAgICAgICAgeyB0b3A6ICc0MCUnLCBsZWZ0OiAnMjglJywgZGVsYXk6IC0yLjUsIHNjYWxlOiAwLjg1IH0sXHJcbiAgICAgICAgICB7IGJvdHRvbTogJzMwJScsIGxlZnQ6ICcxOCUnLCBkZWxheTogLTQuMSwgc2NhbGU6IDAuNjggfSxcclxuICAgICAgICAgIHsgdG9wOiAnMTUlJywgcmlnaHQ6ICcxNSUnLCBkZWxheTogLTEuOCwgc2NhbGU6IDAuOTIgfSxcclxuICAgICAgICAgIHsgYm90dG9tOiAnMjIlJywgcmlnaHQ6ICc0MCUnLCBkZWxheTogLTMuOCwgc2NhbGU6IDAuNzggfSxcclxuICAgICAgICAgIHsgdG9wOiAnNTAlJywgbGVmdDogJzEyJScsIGRlbGF5OiAtMi4yLCBzY2FsZTogMC42IH0sXHJcbiAgICAgICAgICB7IHRvcDogJzM1JScsIHJpZ2h0OiAnMjAlJywgZGVsYXk6IC00LjUsIHNjYWxlOiAwLjg4IH0sXHJcbiAgICAgICAgICB7IGJvdHRvbTogJzQwJScsIGxlZnQ6ICczNSUnLCBkZWxheTogLTMuNSwgc2NhbGU6IDAuNyB9LFxyXG4gICAgICAgICAgeyB0b3A6ICc2MCUnLCByaWdodDogJzI4JScsIGRlbGF5OiAtMi44LCBzY2FsZTogMC42NSB9LFxyXG4gICAgICAgICAgeyBib3R0b206ICc1MCUnLCByaWdodDogJzEyJScsIGRlbGF5OiAtNC44LCBzY2FsZTogMC44MiB9LFxyXG4gICAgICAgIF07XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgcG9zSW5kZXggPSAoY3VycmVudENvdW50ICsgaSkgJSBwb3NpdGlvbnMubGVuZ3RoO1xyXG4gICAgICAgIGNvbnN0IHBvcyA9IHBvc2l0aW9uc1twb3NJbmRleF07XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHBvcy50b3ApIHNoYXJkLnN0eWxlLnRvcCA9IHBvcy50b3A7XHJcbiAgICAgICAgaWYgKHBvcy5ib3R0b20pIHNoYXJkLnN0eWxlLmJvdHRvbSA9IHBvcy5ib3R0b207XHJcbiAgICAgICAgaWYgKHBvcy5sZWZ0KSBzaGFyZC5zdHlsZS5sZWZ0ID0gcG9zLmxlZnQ7XHJcbiAgICAgICAgaWYgKHBvcy5yaWdodCkgc2hhcmQuc3R5bGUucmlnaHQgPSBwb3MucmlnaHQ7XHJcbiAgICAgICAgc2hhcmQuc3R5bGUuYW5pbWF0aW9uRGVsYXkgPSBgJHtwb3MuZGVsYXl9c2A7XHJcbiAgICAgICAgc2hhcmQuc3R5bGUudHJhbnNmb3JtID0gYHNjYWxlKCR7cG9zLnNjYWxlfSlgO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFx1NkRGQlx1NTJBMFx1NkRFMVx1NTE2NVx1NTJBOFx1NzUzQlxyXG4gICAgICAgIHNoYXJkLnN0eWxlLm9wYWNpdHkgPSAnMCc7XHJcbiAgICAgICAgdGhpcy5lbHMuaG9sb2dyYW0uYXBwZW5kQ2hpbGQoc2hhcmQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFx1ODlFNlx1NTNEMVx1NkRFMVx1NTE2NVxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgc2hhcmQuc3R5bGUudHJhbnNpdGlvbiA9ICdvcGFjaXR5IDAuNXMgZWFzZSc7XHJcbiAgICAgICAgICBzaGFyZC5zdHlsZS5vcGFjaXR5ID0gJzAuMjYnO1xyXG4gICAgICAgIH0sIDUwKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gXHU5NzAwXHU4OTgxXHU3OUZCXHU5NjY0XHU3N0ZGXHU3N0YzXHJcbiAgICBlbHNlIGlmIChjdXJyZW50Q291bnQgPiB0YXJnZXRDb3VudCkge1xyXG4gICAgICBjb25zdCB0b1JlbW92ZSA9IGN1cnJlbnRDb3VudCAtIHRhcmdldENvdW50O1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvUmVtb3ZlOyBpKyspIHtcclxuICAgICAgICBjb25zdCBsYXN0U2hhcmQgPSBjdXJyZW50U2hhcmRzW2N1cnJlbnRTaGFyZHMubGVuZ3RoIC0gMSAtIGldO1xyXG4gICAgICAgIGlmIChsYXN0U2hhcmQpIHtcclxuICAgICAgICAgIChsYXN0U2hhcmQgYXMgSFRNTEVsZW1lbnQpLnN0eWxlLnRyYW5zaXRpb24gPSAnb3BhY2l0eSAwLjVzIGVhc2UnO1xyXG4gICAgICAgICAgKGxhc3RTaGFyZCBhcyBIVE1MRWxlbWVudCkuc3R5bGUub3BhY2l0eSA9ICcwJztcclxuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICBsYXN0U2hhcmQucmVtb3ZlKCk7XHJcbiAgICAgICAgICB9LCA1MDApO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB1cGRhdGVDb250cm9scygpIHtcclxuICAgIGNvbnN0IGlzQnVzeSA9IChrZXk6IFBlbmRpbmdBY3Rpb24pID0+IHRoaXMucGVuZGluZyA9PT0ga2V5O1xyXG4gICAgY29uc3Qgc2V0QnRuID0gKGJ0bjogSFRNTEJ1dHRvbkVsZW1lbnQgfCBudWxsLCBpY29uOiBhbnksIGxhYmVsOiBzdHJpbmcsIGRpc2FibGVkOiBib29sZWFuKSA9PiB7XHJcbiAgICAgIGlmICghYnRuKSByZXR1cm47XHJcbiAgICAgIGJ0bi5kaXNhYmxlZCA9IGRpc2FibGVkO1xyXG4gICAgICAvLyBrZWVwIGZpcnN0IGNoaWxkIGFzIGljb24gaWYgcHJlc2VudCwgb3RoZXJ3aXNlIGNyZWF0ZVxyXG4gICAgICBsZXQgaWNvbkhvc3QgPSBidG4ucXVlcnlTZWxlY3RvcignLmljb24nKTtcclxuICAgICAgaWYgKCFpY29uSG9zdCkge1xyXG4gICAgICAgIGJ0bi5pbnNlcnRCZWZvcmUocmVuZGVySWNvbihpY29uLCB7IHNpemU6IDE4IH0pLCBidG4uZmlyc3RDaGlsZCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gUmVwbGFjZSBleGlzdGluZyBpY29uIHdpdGggbmV3IG9uZSBpZiBpY29uIG5hbWUgZGlmZmVycyBieSByZS1yZW5kZXJpbmdcclxuICAgICAgICBjb25zdCBob3N0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgIGhvc3QuYXBwZW5kQ2hpbGQocmVuZGVySWNvbihpY29uLCB7IHNpemU6IDE4IH0pKTtcclxuICAgICAgICAvLyByZW1vdmUgb2xkIGljb24gd3JhcHBlciBhbmQgdXNlIG5ld1xyXG4gICAgICAgIGljb25Ib3N0LnBhcmVudEVsZW1lbnQ/LnJlcGxhY2VDaGlsZChob3N0LmZpcnN0Q2hpbGQgYXMgTm9kZSwgaWNvbkhvc3QpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIHNldCBsYWJlbCB0ZXh0IChwcmVzZXJ2ZSBpY29uKVxyXG4gICAgICAvLyByZW1vdmUgZXhpc3RpbmcgdGV4dCBub2Rlc1xyXG4gICAgICBBcnJheS5mcm9tKGJ0bi5jaGlsZE5vZGVzKS5mb3JFYWNoKChuLCBpZHgpID0+IHtcclxuICAgICAgICBpZiAoaWR4ID4gMCkgYnRuLnJlbW92ZUNoaWxkKG4pO1xyXG4gICAgICB9KTtcclxuICAgICAgYnRuLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGxhYmVsKSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHNldEJ0bih0aGlzLmVscy5zdGFydCwgJ3BsYXknLCBpc0J1c3koJ3N0YXJ0JykgPyAnXHU1NDJGXHU1MkE4XHU0RTJEXHUyMDI2JyA6IHRoaXMuaXNNaW5pbmcgPyAnXHU2MzE2XHU3N0ZGXHU0RTJEJyA6ICdcdTVGMDBcdTU5Q0JcdTYzMTZcdTc3RkYnLCBpc0J1c3koJ3N0YXJ0JykgfHwgdGhpcy5pc01pbmluZyB8fCB0aGlzLmlzQ29sbGFwc2VkKTtcclxuICAgIHNldEJ0bih0aGlzLmVscy5zdG9wLCAnc3RvcCcsIGlzQnVzeSgnc3RvcCcpID8gJ1x1NTA1Q1x1NkI2Mlx1NEUyRFx1MjAyNicgOiAnXHU1MDVDXHU2QjYyJywgaXNCdXN5KCdzdG9wJykgfHwgIXRoaXMuaXNNaW5pbmcpO1xyXG4gICAgc2V0QnRuKHRoaXMuZWxzLmNvbGxlY3QsICdjb2xsZWN0JywgaXNCdXN5KCdjb2xsZWN0JykgPyAnXHU2NTM2XHU5NkM2XHU0RTJEXHUyMDI2JyA6ICdcdTY1MzZcdTc3RkYnLCBpc0J1c3koJ2NvbGxlY3QnKSB8fCB0aGlzLmNhcnRBbXQgPD0gMCk7XHJcbiAgICBzZXRCdG4odGhpcy5lbHMucmVwYWlyLCAnd3JlbmNoJywgaXNCdXN5KCdyZXBhaXInKSA/ICdcdTRGRUVcdTc0MDZcdTRFMkRcdTIwMjYnIDogJ1x1NEZFRVx1NzQwNicsIGlzQnVzeSgncmVwYWlyJykgfHwgIXRoaXMuaXNDb2xsYXBzZWQpO1xyXG4gICAgc2V0QnRuKHRoaXMuZWxzLnN0YXR1c0J0biwgJ3JlZnJlc2gnLCBpc0J1c3koJ3N0YXR1cycpID8gJ1x1NTIzN1x1NjVCMFx1NEUyRFx1MjAyNicgOiAnXHU1MjM3XHU2NUIwXHU3MkI2XHU2MDAxJywgaXNCdXN5KCdzdGF0dXMnKSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNldFN0YXR1c01lc3NhZ2UodGV4dDogc3RyaW5nKSB7XHJcbiAgICBpZiAoIXRoaXMuZWxzLnN0YXR1c1RleHQpIHJldHVybjtcclxuICAgIHRoaXMuZWxzLnN0YXR1c1RleHQudGV4dENvbnRlbnQgPSB0ZXh0O1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBsb2dFdmVudChtc2c6IHN0cmluZykge1xyXG4gICAgaWYgKCF0aGlzLmVscz8uZXZlbnRzKSByZXR1cm47XHJcbiAgICBjb25zdCBsaW5lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xyXG4gICAgY29uc3QgaGggPSBTdHJpbmcobm93LmdldEhvdXJzKCkpLnBhZFN0YXJ0KDIsJzAnKTtcclxuICAgIGNvbnN0IG1tID0gU3RyaW5nKG5vdy5nZXRNaW51dGVzKCkpLnBhZFN0YXJ0KDIsJzAnKTtcclxuICAgIGNvbnN0IHNzID0gU3RyaW5nKG5vdy5nZXRTZWNvbmRzKCkpLnBhZFN0YXJ0KDIsJzAnKTtcclxuICAgIFxyXG4gICAgLy8gXHU2ODM5XHU2MzZFXHU2RDg4XHU2MDZGXHU3QzdCXHU1NzhCXHU2REZCXHU1MkEwXHU0RTBEXHU1NDBDXHU3Njg0XHU2ODM3XHU1RjBGXHU3QzdCXHJcbiAgICBsZXQgZXZlbnRDbGFzcyA9ICdldmVudCc7XHJcbiAgICBpZiAobXNnLmluY2x1ZGVzKCdcdTY2QjRcdTUxRkInKSkge1xyXG4gICAgICBldmVudENsYXNzICs9ICcgZXZlbnQtY3JpdGljYWwnO1xyXG4gICAgfSBlbHNlIGlmIChtc2cuaW5jbHVkZXMoJ1x1NTc0RFx1NTg0QycpIHx8IG1zZy5pbmNsdWRlcygnXHU2M0EwXHU1OTNBJykpIHtcclxuICAgICAgZXZlbnRDbGFzcyArPSAnIGV2ZW50LXdhcm5pbmcnO1xyXG4gICAgfSBlbHNlIGlmIChtc2cuaW5jbHVkZXMoJ1x1NjUzNlx1OTZDNicpIHx8IG1zZy5pbmNsdWRlcygnXHU2MjEwXHU1MjlGJykpIHtcclxuICAgICAgZXZlbnRDbGFzcyArPSAnIGV2ZW50LXN1Y2Nlc3MnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZXZlbnRDbGFzcyArPSAnIGV2ZW50LW5vcm1hbCc7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGxpbmUuY2xhc3NOYW1lID0gZXZlbnRDbGFzcztcclxuICAgIGxpbmUudGV4dENvbnRlbnQgPSBgWyR7aGh9OiR7bW19OiR7c3N9XSAke21zZ31gO1xyXG4gICAgXHJcbiAgICAvLyBcdTZERkJcdTUyQTBcdTZFRDFcdTUxNjVcdTUyQThcdTc1M0JcclxuICAgIGxpbmUuc3R5bGUub3BhY2l0eSA9ICcwJztcclxuICAgIGxpbmUuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVgoMjBweCknO1xyXG4gICAgdGhpcy5lbHMuZXZlbnRzLnByZXBlbmQobGluZSk7XHJcbiAgICBcclxuICAgIC8vIFx1ODlFNlx1NTNEMVx1NTJBOFx1NzUzQlxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIGxpbmUuc3R5bGUudHJhbnNpdGlvbiA9ICdvcGFjaXR5IDAuM3MgZWFzZSwgdHJhbnNmb3JtIDAuM3MgZWFzZSc7XHJcbiAgICAgIGxpbmUuc3R5bGUub3BhY2l0eSA9ICcwLjknO1xyXG4gICAgICBsaW5lLnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGVYKDApJztcclxuICAgIH0sIDEwKTtcclxuICAgIFxyXG4gICAgLy8gXHU2NkI0XHU1MUZCXHU0RThCXHU0RUY2XHU2REZCXHU1MkEwXHU5NUVBXHU1MTQ5XHU2NTQ4XHU2NzlDXHJcbiAgICBpZiAobXNnLmluY2x1ZGVzKCdcdTY2QjRcdTUxRkInKSkge1xyXG4gICAgICBsaW5lLmNsYXNzTGlzdC5hZGQoJ2ZsYXNoJyk7XHJcbiAgICAgIC8vIFx1ODlFNlx1NTNEMVx1NTE2OFx1NUM0MFx1NjZCNFx1NTFGQlx1NzI3OVx1NjU0OFxyXG4gICAgICB0aGlzLnRyaWdnZXJDcml0aWNhbEVmZmVjdCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB0cmlnZ2VyQ3JpdGljYWxFZmZlY3QoKSB7XHJcbiAgICAvLyBcdTU3MDZcdTczQUZcdTk1RUFcdTc1MzVcdTY1NDhcdTY3OUNcclxuICAgIGlmICh0aGlzLmVscy5yaW5nKSB7XHJcbiAgICAgIHRoaXMuZWxzLnJpbmcuY2xhc3NMaXN0LmFkZCgncmluZy1wdWxzZScpO1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuZWxzLnJpbmc/LmNsYXNzTGlzdC5yZW1vdmUoJ3JpbmctcHVsc2UnKSwgNjAwKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gXHU1MTY4XHU2MDZGXHU4MENDXHU2NjZGXHU5NUVBXHU3MEMxXHJcbiAgICBpZiAodGhpcy5lbHMuaG9sb2dyYW0pIHtcclxuICAgICAgdGhpcy5lbHMuaG9sb2dyYW0uY2xhc3NMaXN0LmFkZCgnY3JpdGljYWwtZmxhc2gnKTtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmVscy5ob2xvZ3JhbT8uY2xhc3NMaXN0LnJlbW92ZSgnY3JpdGljYWwtZmxhc2gnKSwgNDAwKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgZm9ybWF0UGVyY2VudCgpIHtcclxuICAgIGNvbnN0IHBjdCA9IHRoaXMuY2FydENhcCA+IDAgPyBNYXRoLm1pbigxLCB0aGlzLmNhcnRBbXQgLyB0aGlzLmNhcnRDYXApIDogMDtcclxuICAgIHJldHVybiBgJHtNYXRoLnJvdW5kKHBjdCAqIDEwMCl9JWA7XHJcbiAgfVxyXG59IiwgImltcG9ydCB7IE5ldHdvcmtNYW5hZ2VyIH0gZnJvbSAnLi4vY29yZS9OZXR3b3JrTWFuYWdlcic7XG5pbXBvcnQgeyBodG1sLCBxcyB9IGZyb20gJy4uL3V0aWxzL2RvbSc7XG5pbXBvcnQgeyByZW5kZXJOYXYgfSBmcm9tICcuLi9jb21wb25lbnRzL05hdic7XG5pbXBvcnQgeyBSZWFsdGltZUNsaWVudCB9IGZyb20gJy4uL2NvcmUvUmVhbHRpbWVDbGllbnQnO1xuaW1wb3J0IHsgcmVuZGVyUmVzb3VyY2VCYXIgfSBmcm9tICcuLi9jb21wb25lbnRzL1Jlc291cmNlQmFyJztcbmltcG9ydCB7IHNob3dUb2FzdCB9IGZyb20gJy4uL2NvbXBvbmVudHMvVG9hc3QnO1xuaW1wb3J0IHsgcmVuZGVySWNvbiB9IGZyb20gJy4uL2NvbXBvbmVudHMvSWNvbic7XG5cbmV4cG9ydCBjbGFzcyBXYXJlaG91c2VTY2VuZSB7XG4gIGFzeW5jIG1vdW50KHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgcm9vdC5pbm5lckhUTUwgPSAnJztcbiAgICByb290LmFwcGVuZENoaWxkKHJlbmRlck5hdignd2FyZWhvdXNlJykpO1xuICAgIGNvbnN0IGJhciA9IHJlbmRlclJlc291cmNlQmFyKCk7XG4gICAgcm9vdC5hcHBlbmRDaGlsZChiYXIucm9vdCk7XG5cbiAgICBjb25zdCB2aWV3ID0gaHRtbChgXG4gICAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyIGdyaWQtMlwiIHN0eWxlPVwiY29sb3I6I2ZmZjtcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQgZmFkZS1pblwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIiBzdHlsZT1cImp1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2FsaWduLWl0ZW1zOmNlbnRlcjtcIj5cbiAgICAgICAgICAgIDxoMyBzdHlsZT1cIm1hcmdpbjowO2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjhweDtcIj48c3BhbiBkYXRhLWljbz1cIndhcmVob3VzZVwiPjwvc3Bhbj5cdTRFRDNcdTVFOTM8L2gzPlxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInJlZnJlc2hcIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiPjxzcGFuIGRhdGEtaWNvPVwicmVmcmVzaFwiPjwvc3Bhbj5cdTUyMzdcdTY1QjA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IHN0eWxlPVwibWFyZ2luLXRvcDoxMnB4O1wiPlxuICAgICAgICAgICAgPGRldGFpbHMgb3Blbj5cbiAgICAgICAgICAgICAgPHN1bW1hcnk+PHNwYW4gZGF0YS1pY289XCJvcmVcIj48L3NwYW4+XHU3ODhFXHU3MjQ3XHU0RUQzXHU1RTkzPC9zdW1tYXJ5PlxuICAgICAgICAgICAgICA8ZGl2IGlkPVwiZnJhZ21lbnRzXCIgc3R5bGU9XCJtYXJnaW4tdG9wOjhweDtkaXNwbGF5OmdyaWQ7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOnJlcGVhdChhdXRvLWZpdCxtaW5tYXgoMTQwcHgsMWZyKSk7Z2FwOjhweDtcIj48L2Rpdj5cbiAgICAgICAgICAgIDwvZGV0YWlscz5cbiAgICAgICAgICAgIDxkZXRhaWxzIG9wZW4+XG4gICAgICAgICAgICAgIDxzdW1tYXJ5PjxzcGFuIGRhdGEtaWNvPVwiYm94XCI+PC9zcGFuPlx1NjIxMVx1NzY4NFx1OTA1M1x1NTE3Nzwvc3VtbWFyeT5cbiAgICAgICAgICAgICAgPGRpdiBpZD1cImxpc3RcIiBzdHlsZT1cIm1hcmdpbi10b3A6OHB4O2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjhweDtcIj48L2Rpdj5cbiAgICAgICAgICAgIDwvZGV0YWlscz5cbiAgICAgICAgICAgIDxkZXRhaWxzPlxuICAgICAgICAgICAgICA8c3VtbWFyeT48c3BhbiBkYXRhLWljbz1cImxpc3RcIj48L3NwYW4+XHU5MDUzXHU1MTc3XHU2QTIxXHU2NzdGPC9zdW1tYXJ5PlxuICAgICAgICAgICAgICA8ZGl2IGlkPVwidHBsc1wiIHN0eWxlPVwibWFyZ2luLXRvcDo4cHg7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6OHB4O1wiPjwvZGl2PlxuICAgICAgICAgICAgPC9kZXRhaWxzPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIGApO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQodmlldyk7XG5cbiAgICBjb25zdCB0b2tlbiA9IE5ldHdvcmtNYW5hZ2VyLkkuZ2V0VG9rZW4oKTtcbiAgICBpZiAodG9rZW4pIFJlYWx0aW1lQ2xpZW50LkkuY29ubmVjdCh0b2tlbik7XG5cbiAgICBjb25zdCBsaXN0ID0gcXModmlldywgJyNsaXN0Jyk7XG4gICAgY29uc3QgdHBsQ29udGFpbmVyID0gcXModmlldywgJyN0cGxzJyk7XG4gICAgY29uc3QgZnJhZ21lbnRzQ29udGFpbmVyID0gcXModmlldywgJyNmcmFnbWVudHMnKTtcbiAgICBjb25zdCByZWZyZXNoQnRuID0gcXM8SFRNTEJ1dHRvbkVsZW1lbnQ+KHZpZXcsICcjcmVmcmVzaCcpO1xuXG4gICAgY29uc3QgbW91bnRJY29ucyA9IChyb290RWw6IEVsZW1lbnQpID0+IHtcbiAgICAgIHJvb3RFbC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1pY29dJylcbiAgICAgICAgLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgICAgY29uc3QgbmFtZSA9IChlbCBhcyBIVE1MRWxlbWVudCkuZ2V0QXR0cmlidXRlKCdkYXRhLWljbycpIGFzIGFueTtcbiAgICAgICAgICB0cnkgeyBlbC5hcHBlbmRDaGlsZChyZW5kZXJJY29uKG5hbWUsIHsgc2l6ZTogMjAgfSkpOyB9IGNhdGNoIHt9XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgbW91bnRJY29ucyh2aWV3KTtcblxuICAgIGNvbnN0IGdldFJhcml0eSA9IChpdGVtOiBhbnksIHRwbD86IGFueSk6IHsga2V5OiAnY29tbW9uJ3wncmFyZSd8J2VwaWMnfCdsZWdlbmRhcnknOyB0ZXh0OiBzdHJpbmcgfSA9PiB7XG4gICAgICBjb25zdCByID0gKHRwbCAmJiAodHBsLnJhcml0eSB8fCB0cGwudGllcikpIHx8IGl0ZW0ucmFyaXR5O1xuICAgICAgY29uc3QgbGV2ZWwgPSBOdW1iZXIoaXRlbS5sZXZlbCkgfHwgMDtcbiAgICAgIGlmICh0eXBlb2YgciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgY29uc3QgayA9IHIudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgaWYgKFsnbGVnZW5kYXJ5JywnZXBpYycsJ3JhcmUnLCdjb21tb24nXS5pbmNsdWRlcyhrKSkge1xuICAgICAgICAgIHJldHVybiB7IGtleTogayBhcyBhbnksIHRleHQ6IGsgPT09ICdsZWdlbmRhcnknID8gJ1x1NEYyMFx1OEJGNCcgOiBrID09PSAnZXBpYycgPyAnXHU1M0YyXHU4QkQ3JyA6IGsgPT09ICdyYXJlJyA/ICdcdTdBMDBcdTY3MDknIDogJ1x1NjY2RVx1OTAxQScgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGxldmVsID49IDEyKSByZXR1cm4geyBrZXk6ICdsZWdlbmRhcnknLCB0ZXh0OiAnXHU0RjIwXHU4QkY0JyB9O1xuICAgICAgaWYgKGxldmVsID49IDgpIHJldHVybiB7IGtleTogJ2VwaWMnLCB0ZXh0OiAnXHU1M0YyXHU4QkQ3JyB9O1xuICAgICAgaWYgKGxldmVsID49IDQpIHJldHVybiB7IGtleTogJ3JhcmUnLCB0ZXh0OiAnXHU3QTAwXHU2NzA5JyB9O1xuICAgICAgcmV0dXJuIHsga2V5OiAnY29tbW9uJywgdGV4dDogJ1x1NjY2RVx1OTAxQScgfTtcbiAgICB9O1xuXG4gICAgY29uc3QgZm9ybWF0VGltZSA9ICh0czogbnVtYmVyKSA9PiB7XG4gICAgICB0cnkgeyByZXR1cm4gbmV3IERhdGUodHMpLnRvTG9jYWxlU3RyaW5nKCk7IH0gY2F0Y2ggeyByZXR1cm4gJycgKyB0czsgfVxuICAgIH07XG5cbiAgICBjb25zdCBsb2FkID0gYXN5bmMgKCkgPT4ge1xuICAgICAgcmVmcmVzaEJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICByZWZyZXNoQnRuLmlubmVySFRNTCA9ICc8c3BhbiBkYXRhLWljbz1cInJlZnJlc2hcIj48L3NwYW4+XHU1MjM3XHU2NUIwXHU0RTJEXHUyMDI2JztcbiAgICAgIG1vdW50SWNvbnMocmVmcmVzaEJ0bik7XG4gICAgICBhd2FpdCBiYXIudXBkYXRlKCk7XG4gICAgICBsaXN0LmlubmVySFRNTCA9ICcnO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIGxpc3QuYXBwZW5kQ2hpbGQoaHRtbCgnPGRpdiBjbGFzcz1cInNrZWxldG9uXCI+PC9kaXY+JykpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgW2RhdGEsIHRwbHMsIGZyYWdtZW50c0RhdGFdID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICAgIE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IGl0ZW1zOiBhbnlbXSB9PignL2l0ZW1zJyksXG4gICAgICAgICAgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgdGVtcGxhdGVzOiBhbnlbXSB9PignL2l0ZW1zL3RlbXBsYXRlcycpLmNhdGNoKCgpID0+ICh7IHRlbXBsYXRlczogW10gfSkpLFxuICAgICAgICAgIE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IGZyYWdtZW50czogUmVjb3JkPHN0cmluZywgbnVtYmVyPiB9PignL2l0ZW1zL2ZyYWdtZW50cycpLmNhdGNoKCgpID0+ICh7IGZyYWdtZW50czoge30gfSkpXG4gICAgICAgIF0pO1xuICAgICAgICBjb25zdCB0cGxCeUlkOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gICAgICAgIGZvciAoY29uc3QgdCBvZiAodHBscy50ZW1wbGF0ZXMgfHwgW10pKSB0cGxCeUlkW3QuaWRdID0gdDtcbiAgICAgICAgXG4gICAgICAgIC8vIFx1NkUzMlx1NjdEM1x1Nzg4RVx1NzI0N1xuICAgICAgICBjb25zdCBmcmFnbWVudHMgPSBmcmFnbWVudHNEYXRhLmZyYWdtZW50cyB8fCB7fTtcbiAgICAgICAgZnJhZ21lbnRzQ29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuICAgICAgICBjb25zdCBmcmFnbWVudE5hbWVzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAgICAgICAgIG1pbmVyOiAnXHU3N0ZGXHU2NzNBXHU3ODhFXHU3MjQ3JyxcbiAgICAgICAgICBjYXJ0OiAnXHU3N0ZGXHU4RjY2XHU3ODhFXHU3MjQ3JyxcbiAgICAgICAgICByYWlkZXI6ICdcdTYzQTBcdTU5M0FcdTU2NjhcdTc4OEVcdTcyNDcnLFxuICAgICAgICAgIHNoaWVsZDogJ1x1OTYzMlx1NUZBMVx1NzZGRVx1Nzg4RVx1NzI0NycsXG4gICAgICAgIH07XG4gICAgICAgIGZvciAoY29uc3QgW3R5cGUsIGNvdW50XSBvZiBPYmplY3QuZW50cmllcyhmcmFnbWVudHMpKSB7XG4gICAgICAgICAgY29uc3QgY2FuQ3JhZnQgPSBjb3VudCA+PSA1MDtcbiAgICAgICAgICBjb25zdCBjYXJkID0gaHRtbChgXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZnJhZ21lbnQtY2FyZCAke2NhbkNyYWZ0ID8gJ2Nhbi1jcmFmdCcgOiAnJ31cIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZyYWdtZW50LWljb25cIiBkYXRhLWljbz1cIm9yZVwiPjwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZnJhZ21lbnQtaW5mb1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmcmFnbWVudC1uYW1lXCI+JHtmcmFnbWVudE5hbWVzW3R5cGVdIHx8IHR5cGV9PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZyYWdtZW50LWNvdW50XCI+JHtjb3VudH0gLyA1MDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeSBidG4tc21cIiBkYXRhLWNyYWZ0PVwiJHt0eXBlfVwiICR7Y2FuQ3JhZnQgPyAnJyA6ICdkaXNhYmxlZCd9PjxzcGFuIGRhdGEtaWNvPVwid3JlbmNoXCI+PC9zcGFuPlx1NTQwOFx1NjIxMDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgYCk7XG4gICAgICAgICAgbW91bnRJY29ucyhjYXJkKTtcbiAgICAgICAgICBcbiAgICAgICAgICAvLyBcdTU0MDhcdTYyMTBcdTYzMDlcdTk0QUVcdTcwQjlcdTUxRkJcdTRFOEJcdTRFRjZcbiAgICAgICAgICBjb25zdCBjcmFmdEJ0biA9IGNhcmQucXVlcnlTZWxlY3RvcignW2RhdGEtY3JhZnRdJykgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XG4gICAgICAgICAgY3JhZnRCdG4/LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKGNyYWZ0QnRuLmRpc2FibGVkKSByZXR1cm47XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNyYWZ0QnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbnN0IG9yaWdpbmFsSFRNTCA9IGNyYWZ0QnRuLmlubmVySFRNTDtcbiAgICAgICAgICAgIGNyYWZ0QnRuLmlubmVySFRNTCA9ICc8c3BhbiBkYXRhLWljbz1cIndyZW5jaFwiPjwvc3Bhbj5cdTU0MDhcdTYyMTBcdTRFMkRcdTIwMjYnO1xuICAgICAgICAgICAgbW91bnRJY29ucyhjcmFmdEJ0bik7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IGl0ZW06IGFueSB9PignL2l0ZW1zL2NyYWZ0Jywge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgZnJhZ21lbnRUeXBlOiB0eXBlIH0pLFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgc2hvd1RvYXN0KGBcdTU0MDhcdTYyMTBcdTYyMTBcdTUyOUZcdUZGMDFcdTgzQjdcdTVGOTcgJHtmcmFnbWVudE5hbWVzW3R5cGVdfWAsICdzdWNjZXNzJyk7XG4gICAgICAgICAgICAgIGNhcmQuY2xhc3NMaXN0LmFkZCgndXBncmFkZS1zdWNjZXNzJyk7XG4gICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gY2FyZC5jbGFzc0xpc3QucmVtb3ZlKCd1cGdyYWRlLXN1Y2Nlc3MnKSwgMTAwMCk7XG4gICAgICAgICAgICAgIGF3YWl0IGxvYWQoKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgICAgICAgICBzaG93VG9hc3QoZT8ubWVzc2FnZSB8fCAnXHU1NDA4XHU2MjEwXHU1OTMxXHU4RDI1JywgJ2Vycm9yJyk7XG4gICAgICAgICAgICAgIGNyYWZ0QnRuLmlubmVySFRNTCA9IG9yaWdpbmFsSFRNTDtcbiAgICAgICAgICAgICAgbW91bnRJY29ucyhjcmFmdEJ0bik7XG4gICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICBjcmFmdEJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIFxuICAgICAgICAgIGZyYWdtZW50c0NvbnRhaW5lci5hcHBlbmRDaGlsZChjYXJkKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgbGlzdC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgaWYgKCFkYXRhLml0ZW1zLmxlbmd0aCkge1xuICAgICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQoaHRtbCgnPGRpdiBzdHlsZT1cIm9wYWNpdHk6Ljg7XCI+XHU2NjgyXHU2NUUwXHU5MDUzXHU1MTc3XHVGRjBDXHU1QzFEXHU4QkQ1XHU1OTFBXHU2MzE2XHU3N0ZGXHU2MjE2XHU2M0EwXHU1OTNBXHU0RUU1XHU4M0I3XHU1M0Q2XHU2NkY0XHU1OTFBXHU4RDQ0XHU2RTkwPC9kaXY+JykpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBkYXRhLml0ZW1zKSB7XG4gICAgICAgICAgY29uc3QgdHBsID0gdHBsQnlJZFtpdGVtLnRlbXBsYXRlSWRdO1xuICAgICAgICAgIGNvbnN0IHJhcml0eSA9IGdldFJhcml0eShpdGVtLCB0cGwpO1xuICAgICAgICAgIGNvbnN0IG5hbWUgPSAodHBsICYmICh0cGwubmFtZSB8fCB0cGwuaWQpKSB8fCBpdGVtLnRlbXBsYXRlSWQ7XG5cbiAgICAgICAgICAvLyBcdThCQTFcdTdCOTdcdTUzNDdcdTdFQTdcdTYyMTBcdTUyOUZcdTczODdcbiAgICAgICAgICBjb25zdCBzdWNjZXNzUmF0ZSA9IE1hdGgubWF4KDAuNCwgMC44IC0gKGl0ZW0ubGV2ZWwgLSAxKSAqIDAuMDIpO1xuICAgICAgICAgIGNvbnN0IHN1Y2Nlc3NQY3QgPSBNYXRoLnJvdW5kKHN1Y2Nlc3NSYXRlICogMTAwKTtcbiAgICAgICAgICBcbiAgICAgICAgICBjb25zdCByb3cgPSBodG1sKGBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpdGVtLWNhcmQgaG92ZXItbGlmdCAke1xuICAgICAgICAgICAgICByYXJpdHkua2V5ID09PSAnbGVnZW5kYXJ5JyA/ICdyYXJpdHktb3V0bGluZS1sZWdlbmRhcnknIDogcmFyaXR5LmtleSA9PT0gJ2VwaWMnID8gJ3Jhcml0eS1vdXRsaW5lLWVwaWMnIDogcmFyaXR5LmtleSA9PT0gJ3JhcmUnID8gJ3Jhcml0eS1vdXRsaW5lLXJhcmUnIDogJ3Jhcml0eS1vdXRsaW5lLWNvbW1vbidcbiAgICAgICAgICAgIH1cIiBkYXRhLXJhcml0eT1cIiR7cmFyaXR5LmtleX1cIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiIHN0eWxlPVwianVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YWxpZ24taXRlbXM6ZmxleC1zdGFydDtnYXA6MTBweDtcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6NnB4O2ZsZXg6MTttaW4td2lkdGg6MDtcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJkaXNwbGF5OmZsZXg7ZmxleC13cmFwOndyYXA7Z2FwOjZweDthbGlnbi1pdGVtczpjZW50ZXI7XCI+XG4gICAgICAgICAgICAgICAgICAgIDxzdHJvbmcgc3R5bGU9XCJmb250LXNpemU6MTVweDt3aGl0ZS1zcGFjZTpub3dyYXA7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NnB4O1wiPjxzcGFuIGRhdGEtaWNvPVwib3JlXCI+PC9zcGFuPiR7bmFtZX08L3N0cm9uZz5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJiYWRnZSByYXJpdHktJHtyYXJpdHkua2V5fVwiPjxpPjwvaT4ke3Jhcml0eS50ZXh0fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgJHtpdGVtLmlzRXF1aXBwZWQgPyAnPHNwYW4gY2xhc3M9XCJwaWxsIHBpbGwtcnVubmluZ1wiPlx1NURGMlx1ODhDNVx1NTkwNzwvc3Bhbj4nIDogJyd9XG4gICAgICAgICAgICAgICAgICAgICR7aXRlbS5pc0xpc3RlZCA/ICc8c3BhbiBjbGFzcz1cInBpbGxcIj5cdTYzMDJcdTUzNTVcdTRFMkQ8L3NwYW4+JyA6ICcnfVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAke3RwbD8uZGVzY3JpcHRpb24gPyBgPGRpdiBzdHlsZT1cIm9wYWNpdHk6Ljc1O2ZvbnQtc2l6ZToxM3B4O2ZvbnQtc3R5bGU6aXRhbGljO1wiPiR7dHBsLmRlc2NyaXB0aW9ufTwvZGl2PmAgOiAnJ31cbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJvcGFjaXR5Oi44NTtkaXNwbGF5OmZsZXg7ZmxleC13cmFwOndyYXA7Z2FwOjhweDtmb250LXNpemU6MTNweDtcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4+XHU3QjQ5XHU3RUE3IEx2LiR7aXRlbS5sZXZlbH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICR7dHBsPy5iYXNlRWZmZWN0ID8gYDxzcGFuIGNsYXNzPVwicGlsbFwiPlx1NTdGQVx1Nzg0MFx1NjU0OFx1Njc5QyAke3RwbC5iYXNlRWZmZWN0fTwvc3Bhbj5gIDogJyd9XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicGlsbFwiPlx1NUI5RVx1NEY4QiAke2l0ZW0uaWR9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFjdGlvbnNcIj5cbiAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gJHtpdGVtLmlzRXF1aXBwZWQgPyAnYnRuLXNlbGwnIDogJ2J0bi1idXknfVwiIGRhdGEtYWN0PVwiJHtpdGVtLmlzRXF1aXBwZWQgPyAndW5lcXVpcCcgOiAnZXF1aXAnfVwiIGRhdGEtaWQ9XCIke2l0ZW0uaWR9XCI+PHNwYW4gZGF0YS1pY289XCIke2l0ZW0uaXNFcXVpcHBlZCA/ICd4JyA6ICdzaGllbGQnfVwiPjwvc3Bhbj4ke2l0ZW0uaXNFcXVpcHBlZCA/ICdcdTUzNzhcdTRFMEInIDogJ1x1ODhDNVx1NTkwNyd9PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCIgZGF0YS1hY3Q9XCJ1cGdyYWRlXCIgZGF0YS1pZD1cIiR7aXRlbS5pZH1cIiB0aXRsZT1cIlx1NkQ4OFx1ODAxNyAke2l0ZW0ubGV2ZWwgKiA1MH0gXHU3N0ZGXHU3N0YzXHVGRjBDXHU2MjEwXHU1MjlGXHU3Mzg3ICR7c3VjY2Vzc1BjdH0lXCI+PHNwYW4gZGF0YS1pY289XCJ3cmVuY2hcIj48L3NwYW4+XHU1MzQ3XHU3RUE3ICgke2l0ZW0ubGV2ZWwgKiA1MH0pICR7c3VjY2Vzc1BjdH0lPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1naG9zdFwiIGRhdGEtYWN0PVwidG9nZ2xlXCIgZGF0YS1pZD1cIiR7aXRlbS5pZH1cIj48c3BhbiBkYXRhLWljbz1cImxpc3RcIj48L3NwYW4+XHU4QkU2XHU2MEM1PC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGltZWxpbmVcIiBpZD1cInRsLSR7aXRlbS5pZH1cIiBoaWRkZW4+PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICBgKTtcbiAgICAgICAgICBtb3VudEljb25zKHJvdyk7XG4gICAgICAgICAgcm93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKGV2KSA9PiB7XG4gICAgICAgICAgICAvLyBcdTY3RTVcdTYyN0VcdTc3MUZcdTZCNjNcdTc2ODRcdTYzMDlcdTk0QUVcdTUxNDNcdTdEMjBcdUZGMDhcdTUzRUZcdTgwRkRcdTcwQjlcdTUxRkJcdTRFODZcdTUxODVcdTkwRThcdTc2ODRzcGFuL3N2Z1x1RkYwOVxuICAgICAgICAgICAgY29uc3QgYnRuID0gKGV2LnRhcmdldCBhcyBIVE1MRWxlbWVudCkuY2xvc2VzdCgnYnV0dG9uJykgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XG4gICAgICAgICAgICBpZiAoIWJ0bikgcmV0dXJuO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBpZCA9IGJ0bi5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnKTtcbiAgICAgICAgICAgIGNvbnN0IGFjdCA9IGJ0bi5nZXRBdHRyaWJ1dGUoJ2RhdGEtYWN0Jyk7XG4gICAgICAgICAgICBpZiAoIWlkIHx8ICFhY3QpIHJldHVybjtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gXHU5NjMyXHU2QjYyXHU5MUNEXHU1OTBEXHU3MEI5XHU1MUZCXG4gICAgICAgICAgICBpZiAoYnRuLmRpc2FibGVkICYmIGFjdCAhPT0gJ3RvZ2dsZScpIHJldHVybjtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGFjdCA9PT0gJ3RvZ2dsZScpIHtcbiAgICAgICAgICAgICAgY29uc3QgYm94ID0gcm93LnF1ZXJ5U2VsZWN0b3IoYCN0bC0ke2lkfWApIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICAgICAgICBpZiAoIWJveCkgcmV0dXJuO1xuICAgICAgICAgICAgICBpZiAoIWJveC5oYXNDaGlsZE5vZGVzKCkpIHtcbiAgICAgICAgICAgICAgICBib3guaW5uZXJIVE1MID0gJzxkaXYgY2xhc3M9XCJza2VsZXRvblwiIHN0eWxlPVwiaGVpZ2h0OjM2cHg7XCI+PC9kaXY+JztcbiAgICAgICAgICAgICAgICBib3guaGlkZGVuID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IGxvZ3M6IHsgdHlwZTogc3RyaW5nOyBkZXNjPzogc3RyaW5nOyB0aW1lOiBudW1iZXIgfVtdIH0+KGAvaXRlbXMvbG9ncz9pdGVtSWQ9JHtpZH1gKTtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGxvZ3MgPSBBcnJheS5pc0FycmF5KHJlcy5sb2dzKSA/IHJlcy5sb2dzIDogW107XG4gICAgICAgICAgICAgICAgICBib3guaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgICAgICAgICBpZiAoIWxvZ3MubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGJveC5pbm5lckhUTUwgPSAnPGRpdiBzdHlsZT1cIm9wYWNpdHk6Ljg7XCI+XHU2NjgyXHU2NUUwXHU1Mzg2XHU1M0YyXHU2NTcwXHU2MzZFPC9kaXY+JztcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgbG9nIG9mIGxvZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICBjb25zdCBub2RlID0gaHRtbChgXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGltZWxpbmUtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZG90XCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0aW1lXCI+JHtmb3JtYXRUaW1lKGxvZy50aW1lKX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRlc2NcIj4keyhsb2cuZGVzYyB8fCBsb2cudHlwZSB8fCAnJykucmVwbGFjZSgvPC9nLCcmbHQ7Jyl9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICBgKTtcbiAgICAgICAgICAgICAgICAgICAgICBib3guYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICAgICAgICAgIGJveC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICAgICAgICAgIGJveC5hcHBlbmRDaGlsZChodG1sKGBcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRpbWVsaW5lLWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZG90XCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRpbWVcIj5cdTIwMTQ8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGVzY1wiPlx1Njc2NVx1NkU5MFx1NjcyQVx1NzdFNSBcdTAwQjcgXHU1M0VGXHU5MDFBXHU4RkM3XHU2MzE2XHU3N0ZGXHUzMDAxXHU2M0EwXHU1OTNBXHU2MjE2XHU0RUE0XHU2NjEzXHU4M0I3XHU1M0Q2PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgYCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBib3guaGlkZGVuID0gIWJveC5oaWRkZW47XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBcdTY0Q0RcdTRGNUNcdTYzMDlcdTk0QUVcdTU5MDRcdTc0MDZcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgICAgIGNvbnN0IG9yaWdpbmFsSFRNTCA9IGJ0bi5pbm5lckhUTUw7XG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICBpZiAoYWN0ID09PSAnZXF1aXAnKSB7XG4gICAgICAgICAgICAgICAgYnRuLmlubmVySFRNTCA9ICc8c3BhbiBkYXRhLWljbz1cInNoaWVsZFwiPjwvc3Bhbj5cdTg4QzVcdTU5MDdcdTRFMkRcdTIwMjYnO1xuICAgICAgICAgICAgICAgIG1vdW50SWNvbnMoYnRuKTtcbiAgICAgICAgICAgICAgICBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3QoJy9pdGVtcy9lcXVpcCcsIHsgbWV0aG9kOiAnUE9TVCcsIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgaXRlbUlkOiBpZCB9KSB9KTtcbiAgICAgICAgICAgICAgICBzaG93VG9hc3QoJ1x1ODhDNVx1NTkwN1x1NjIxMFx1NTI5RicsICdzdWNjZXNzJyk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoYWN0ID09PSAndW5lcXVpcCcpIHtcbiAgICAgICAgICAgICAgICBidG4uaW5uZXJIVE1MID0gJzxzcGFuIGRhdGEtaWNvPVwieFwiPjwvc3Bhbj5cdTUzNzhcdTRFMEJcdTRFMkRcdTIwMjYnO1xuICAgICAgICAgICAgICAgIG1vdW50SWNvbnMoYnRuKTtcbiAgICAgICAgICAgICAgICBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3QoJy9pdGVtcy91bmVxdWlwJywgeyBtZXRob2Q6ICdQT1NUJywgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBpdGVtSWQ6IGlkIH0pIH0pO1xuICAgICAgICAgICAgICAgIHNob3dUb2FzdCgnXHU1Mzc4XHU0RTBCXHU2MjEwXHU1MjlGJywgJ3N1Y2Nlc3MnKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChhY3QgPT09ICd1cGdyYWRlJykge1xuICAgICAgICAgICAgICAgIGJ0bi5pbm5lckhUTUwgPSAnPHNwYW4gZGF0YS1pY289XCJ3cmVuY2hcIj48L3NwYW4+XHU1MzQ3XHU3RUE3XHU0RTJEXHUyMDI2JztcbiAgICAgICAgICAgICAgICBtb3VudEljb25zKGJ0bik7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgbGV2ZWw6IG51bWJlcjsgY29zdDogbnVtYmVyIH0+KCcvaXRlbXMvdXBncmFkZScsIHsgbWV0aG9kOiAnUE9TVCcsIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgaXRlbUlkOiBpZCB9KSB9KTtcbiAgICAgICAgICAgICAgICAvLyBcdTUzNDdcdTdFQTdcdTYyMTBcdTUyOUZcdTUyQThcdTc1M0JcbiAgICAgICAgICAgICAgICByb3cuY2xhc3NMaXN0LmFkZCgndXBncmFkZS1zdWNjZXNzJyk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiByb3cuY2xhc3NMaXN0LnJlbW92ZSgndXBncmFkZS1zdWNjZXNzJyksIDEwMDApO1xuICAgICAgICAgICAgICAgIHNob3dUb2FzdChgXHU1MzQ3XHU3RUE3XHU2MjEwXHU1MjlGXHVGRjAxXHU3QjQ5XHU3RUE3ICR7cmVzLmxldmVsfVx1RkYwOFx1NkQ4OFx1ODAxNyAke3Jlcy5jb3N0fSBcdTc3RkZcdTc3RjNcdUZGMDlgLCAnc3VjY2VzcycpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGF3YWl0IGJhci51cGRhdGUoKTtcbiAgICAgICAgICAgICAgYXdhaXQgbG9hZCgpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgICAgICAgIHNob3dUb2FzdChlPy5tZXNzYWdlIHx8ICdcdTY0Q0RcdTRGNUNcdTU5MzFcdThEMjUnLCAnZXJyb3InKTtcbiAgICAgICAgICAgICAgLy8gXHU1OTMxXHU4RDI1XHU2NUY2XHU2MDYyXHU1OTBEXHU2MzA5XHU5NEFFXHU1MzlGXHU1OUNCXHU3MkI2XHU2MDAxXHVGRjA4XHU1NkUwXHU0RTNBXHU0RTBEXHU0RjFBXHU5MUNEXHU2NUIwXHU2RTMyXHU2N0QzXHVGRjA5XG4gICAgICAgICAgICAgIGJ0bi5pbm5lckhUTUwgPSBvcmlnaW5hbEhUTUw7XG4gICAgICAgICAgICAgIGJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQocm93KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRwbENvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgZm9yIChjb25zdCB0cGwgb2YgKHRwbHMudGVtcGxhdGVzIHx8IFtdKSkge1xuICAgICAgICAgIGNvbnN0IHJhcml0eVRleHQgPSB0cGwucmFyaXR5ID09PSAnbGVnZW5kYXJ5JyA/ICdcdTRGMjBcdThCRjQnIDogdHBsLnJhcml0eSA9PT0gJ2VwaWMnID8gJ1x1NTNGMlx1OEJENycgOiB0cGwucmFyaXR5ID09PSAncmFyZScgPyAnXHU3QTAwXHU2NzA5JyA6ICdcdTY2NkVcdTkwMUEnO1xuICAgICAgICAgIGNvbnN0IGNhdGVnb3J5VGV4dCA9IHRwbC5jYXRlZ29yeSA9PT0gJ21pbmVyJyA/ICdcdTc3RkZcdTY3M0EnIDogdHBsLmNhdGVnb3J5ID09PSAnY2FydCcgPyAnXHU3N0ZGXHU4RjY2JyA6IHRwbC5jYXRlZ29yeSA9PT0gJ3JhaWRlcicgPyAnXHU2M0EwXHU1OTNBXHU1NjY4JyA6ICdcdTk2MzJcdTVGQTFcdTc2RkUnO1xuICAgICAgICAgIGNvbnN0IHJvdyA9IGh0bWwoYFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxpc3QtaXRlbVwiPlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZmxleDoxO2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjRweDtcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZGlzcGxheTpmbGV4O2dhcDo2cHg7YWxpZ24taXRlbXM6Y2VudGVyO1wiPlxuICAgICAgICAgICAgICAgICAgPHN0cm9uZz4ke3RwbC5uYW1lIHx8IHRwbC5pZH08L3N0cm9uZz5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYmFkZ2UgcmFyaXR5LSR7dHBsLnJhcml0eX1cIj48aT48L2k+JHtyYXJpdHlUZXh0fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwib3BhY2l0eTouNzU7Zm9udC1zaXplOjEycHg7XCI+JHt0cGwuZGVzY3JpcHRpb24gfHwgJyd9PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cIm9wYWNpdHk6LjY1O2ZvbnQtc2l6ZToxMnB4O1wiPlx1N0M3Qlx1NTc4Qlx1RkYxQSR7Y2F0ZWdvcnlUZXh0fSBcdTAwQjcgXHU1N0ZBXHU3ODQwXHU2NTQ4XHU2NzlDXHVGRjFBJHt0cGwuYmFzZUVmZmVjdH08L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICBgKTtcbiAgICAgICAgICB0cGxDb250YWluZXIuYXBwZW5kQ2hpbGQocm93KTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgIHNob3dUb2FzdChlPy5tZXNzYWdlIHx8ICdcdTUyQTBcdThGN0RcdTRFRDNcdTVFOTNcdTU5MzFcdThEMjUnLCAnZXJyb3InKTtcbiAgICAgICAgbGlzdC5pbm5lckhUTUwgPSAnPGRpdiBzdHlsZT1cIm9wYWNpdHk6Ljg7dGV4dC1hbGlnbjpjZW50ZXI7cGFkZGluZzoyMHB4O1wiPlx1NTJBMFx1OEY3RFx1NTkzMVx1OEQyNVx1RkYwQ1x1OEJGN1x1N0EwRFx1NTQwRVx1OTFDRFx1OEJENTwvZGl2Pic7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICByZWZyZXNoQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIHJlZnJlc2hCdG4uaW5uZXJIVE1MID0gJzxzcGFuIGRhdGEtaWNvPVwicmVmcmVzaFwiPjwvc3Bhbj5cdTUyMzdcdTY1QjAnO1xuICAgICAgICBtb3VudEljb25zKHJlZnJlc2hCdG4pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZWZyZXNoQnRuLm9uY2xpY2sgPSAoKSA9PiBsb2FkKCk7XG4gICAgYXdhaXQgbG9hZCgpO1xuICB9XG59XG4iLCAiaW1wb3J0IHsgTmV0d29ya01hbmFnZXIgfSBmcm9tICcuLi9jb3JlL05ldHdvcmtNYW5hZ2VyJztcbmltcG9ydCB7IGh0bWwsIHFzIH0gZnJvbSAnLi4vdXRpbHMvZG9tJztcbmltcG9ydCB7IHJlbmRlck5hdiB9IGZyb20gJy4uL2NvbXBvbmVudHMvTmF2JztcbmltcG9ydCB7IFJlYWx0aW1lQ2xpZW50IH0gZnJvbSAnLi4vY29yZS9SZWFsdGltZUNsaWVudCc7XG5pbXBvcnQgeyBzaG93VG9hc3QgfSBmcm9tICcuLi9jb21wb25lbnRzL1RvYXN0JztcbmltcG9ydCB7IHJlbmRlclJlc291cmNlQmFyIH0gZnJvbSAnLi4vY29tcG9uZW50cy9SZXNvdXJjZUJhcic7XG5pbXBvcnQgeyByZW5kZXJJY29uIH0gZnJvbSAnLi4vY29tcG9uZW50cy9JY29uJztcblxuZXhwb3J0IGNsYXNzIFBsdW5kZXJTY2VuZSB7XG4gIHByaXZhdGUgcmVzdWx0Qm94OiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuXG4gIG1vdW50KHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgcm9vdC5pbm5lckhUTUwgPSAnJztcbiAgICByb290LmFwcGVuZENoaWxkKHJlbmRlck5hdigncGx1bmRlcicpKTtcbiAgICBjb25zdCBiYXIgPSByZW5kZXJSZXNvdXJjZUJhcigpO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQoYmFyLnJvb3QpO1xuXG4gICAgY29uc3QgdmlldyA9IGh0bWwoYFxuICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lciBncmlkLTJcIiBzdHlsZT1cImNvbG9yOiNmZmY7XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkIGZhZGUtaW5cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCIgc3R5bGU9XCJqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjthbGlnbi1pdGVtczpjZW50ZXI7XCI+XG4gICAgICAgICAgICA8aDMgc3R5bGU9XCJtYXJnaW46MDtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo4cHg7XCI+PHNwYW4gZGF0YS1pY289XCJzd29yZFwiPjwvc3Bhbj5cdTYzQTBcdTU5M0FcdTc2RUVcdTY4MDc8L2gzPlxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInJlZnJlc2hcIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiPjxzcGFuIGRhdGEtaWNvPVwicmVmcmVzaFwiPjwvc3Bhbj5cdTUyMzdcdTY1QjA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IHN0eWxlPVwibWFyZ2luLXRvcDoxMnB4O1wiPlxuICAgICAgICAgICAgPGRldGFpbHM+XG4gICAgICAgICAgICAgIDxzdW1tYXJ5IHN0eWxlPVwiY29sb3I6I2ZmNWM1YztcIj48c3BhbiBkYXRhLWljbz1cInRhcmdldFwiPjwvc3Bhbj5cdTU5MERcdTRFQzdcdTUyMTdcdTg4Njg8L3N1bW1hcnk+XG4gICAgICAgICAgICAgIDxkaXYgaWQ9XCJyZXZlbmdlXCIgc3R5bGU9XCJtYXJnaW4tdG9wOjhweDtkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDo4cHg7XCI+PC9kaXY+XG4gICAgICAgICAgICA8L2RldGFpbHM+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBpZD1cImxpc3RcIiBzdHlsZT1cIm1hcmdpbi10b3A6MTJweDtkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDo4cHg7XCI+PC9kaXY+XG4gICAgICAgICAgPGRpdiBpZD1cInJlc3VsdFwiIHN0eWxlPVwibWFyZ2luLXRvcDoxMnB4O29wYWNpdHk6Ljk7Zm9udC1mYW1pbHk6bW9ub3NwYWNlO1wiPjwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIGApO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQodmlldyk7XG5cbiAgICBjb25zdCB0b2tlbiA9IE5ldHdvcmtNYW5hZ2VyLkkuZ2V0VG9rZW4oKTtcbiAgICBpZiAodG9rZW4pIFJlYWx0aW1lQ2xpZW50LkkuY29ubmVjdCh0b2tlbik7XG5cbiAgICBSZWFsdGltZUNsaWVudC5JLm9uKCdwbHVuZGVyLmF0dGFja2VkJywgKG1zZykgPT4ge1xuICAgICAgc2hvd1RvYXN0KGBcdTg4QUJcdTYzQTBcdTU5M0FcdUZGMUFcdTY3NjVcdTgxRUEgJHttc2cuYXR0YWNrZXJ9XHVGRjBDXHU2MzVGXHU1OTMxICR7bXNnLmxvc3N9YCk7XG4gICAgICB0aGlzLmxvZyhgXHU4OEFCICR7bXNnLmF0dGFja2VyfSBcdTYzQTBcdTU5M0FcdUZGMENcdTYzNUZcdTU5MzEgJHttc2cubG9zc31gKTtcbiAgICB9KTtcbiAgICB0aGlzLnJlc3VsdEJveCA9IHFzKHZpZXcsICcjcmVzdWx0Jyk7XG5cbiAgICBjb25zdCBsaXN0ID0gcXModmlldywgJyNsaXN0Jyk7XG4gICAgY29uc3QgcmV2ZW5nZUxpc3QgPSBxcyh2aWV3LCAnI3JldmVuZ2UnKTtcbiAgICBjb25zdCByZWZyZXNoQnRuID0gcXM8SFRNTEJ1dHRvbkVsZW1lbnQ+KHZpZXcsICcjcmVmcmVzaCcpO1xuICAgIGNvbnN0IG1vdW50SWNvbnMgPSAocm9vdEVsOiBFbGVtZW50KSA9PiB7XG4gICAgICByb290RWwucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtaWNvXScpXG4gICAgICAgIC5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICAgIGNvbnN0IG5hbWUgPSAoZWwgYXMgSFRNTEVsZW1lbnQpLmdldEF0dHJpYnV0ZSgnZGF0YS1pY28nKSBhcyBhbnk7XG4gICAgICAgICAgdHJ5IHsgZWwuYXBwZW5kQ2hpbGQocmVuZGVySWNvbihuYW1lLCB7IHNpemU6IDIwIH0pKTsgfSBjYXRjaCB7fVxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIG1vdW50SWNvbnModmlldyk7XG5cbiAgICBjb25zdCBsb2FkID0gYXN5bmMgKCkgPT4ge1xuICAgICAgcmVmcmVzaEJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICByZWZyZXNoQnRuLmlubmVySFRNTCA9ICc8c3BhbiBkYXRhLWljbz1cInJlZnJlc2hcIj48L3NwYW4+XHU1MjM3XHU2NUIwXHU0RTJEXHUyMDI2JztcbiAgICAgIG1vdW50SWNvbnMocmVmcmVzaEJ0bik7XG4gICAgICBhd2FpdCBiYXIudXBkYXRlKCk7XG4gICAgICBsaXN0LmlubmVySFRNTCA9ICcnO1xuICAgICAgcmV2ZW5nZUxpc3QuaW5uZXJIVE1MID0gJyc7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykgbGlzdC5hcHBlbmRDaGlsZChodG1sKCc8ZGl2IGNsYXNzPVwic2tlbGV0b25cIj48L2Rpdj4nKSk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBbZGF0YSwgcmV2ZW5nZURhdGFdID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICAgIE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IHRhcmdldHM6IGFueVtdIH0+KCcvcGx1bmRlci90YXJnZXRzJyksXG4gICAgICAgICAgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgcmV2ZW5nZXM6IGFueVtdIH0+KCcvcGx1bmRlci9yZXZlbmdlLWxpc3QnKS5jYXRjaCgoKSA9PiAoeyByZXZlbmdlczogW10gfSkpXG4gICAgICAgIF0pO1xuICAgICAgICBcbiAgICAgICAgLy8gXHU2RTMyXHU2N0QzXHU1OTBEXHU0RUM3XHU1MjE3XHU4ODY4XG4gICAgICAgIHJldmVuZ2VMaXN0LmlubmVySFRNTCA9ICcnO1xuICAgICAgICBpZiAocmV2ZW5nZURhdGEucmV2ZW5nZXMgJiYgcmV2ZW5nZURhdGEucmV2ZW5nZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGZvciAoY29uc3QgdGFyZ2V0IG9mIHJldmVuZ2VEYXRhLnJldmVuZ2VzKSB7XG4gICAgICAgICAgICBjb25zdCByb3cgPSBodG1sKGBcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxpc3QtaXRlbSBsaXN0LWl0ZW0tLXNlbGxcIiBzdHlsZT1cImJvcmRlci1jb2xvcjojZmY1YzVjO1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDoycHg7XCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NnB4O2NvbG9yOiNmZjVjNWM7XCI+PHNwYW4gZGF0YS1pY289XCJ0YXJnZXRcIj48L3NwYW4+PHN0cm9uZz4ke3RhcmdldC51c2VybmFtZSB8fCB0YXJnZXQuaWR9PC9zdHJvbmc+IFx1RDgzRFx1REM3OSBcdTRFQzdcdTRFQkE8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJvcGFjaXR5Oi44NTtcIj5cdTc3RkZcdTc3RjNcdUZGMUEke3RhcmdldC5vcmV9IDxzcGFuIGNsYXNzPVwicGlsbFwiPlx1NTkwRFx1NEVDN1x1NjNBMFx1NTkzQVx1NEUwRFx1NTNEN1x1NTFCN1x1NTM3NFx1OTY1MFx1NTIzNjwvc3Bhbj48L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tc2VsbFwiIGRhdGEtaWQ9XCIke3RhcmdldC5pZH1cIj48c3BhbiBkYXRhLWljbz1cInN3b3JkXCI+PC9zcGFuPlx1NTkwRFx1NEVDNzwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIGApO1xuICAgICAgICAgICAgbW91bnRJY29ucyhyb3cpO1xuICAgICAgICAgICAgcm93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKGV2KSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IGVsID0gZXYudGFyZ2V0IGFzIEhUTUxCdXR0b25FbGVtZW50O1xuICAgICAgICAgICAgICBjb25zdCBpZCA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1pZCcpO1xuICAgICAgICAgICAgICBpZiAoIWlkKSByZXR1cm47XG4gICAgICAgICAgICAgIGNvbnN0IGJ0biA9IGVsLmNsb3Nlc3QoJ2J1dHRvbicpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xuICAgICAgICAgICAgICBpZiAoIWJ0bikgcmV0dXJuO1xuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgYnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxIVE1MID0gYnRuLmlubmVySFRNTDtcbiAgICAgICAgICAgICAgYnRuLmlubmVySFRNTCA9ICc8c3BhbiBkYXRhLWljbz1cInN3b3JkXCI+PC9zcGFuPlx1NTkwRFx1NEVDN1x1NEUyRFx1MjAyNic7XG4gICAgICAgICAgICAgIG1vdW50SWNvbnMoYnRuKTtcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIGxldCBzaG91bGRSZWZyZXNoID0gZmFsc2U7XG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgc3VjY2VzczogYm9vbGVhbjsgbG9vdF9hbW91bnQ6IG51bWJlciB9PihgL3BsdW5kZXIvJHtpZH1gLCB7IG1ldGhvZDogJ1BPU1QnIH0pO1xuICAgICAgICAgICAgICAgIGlmIChyZXMuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgdGhpcy5sb2coYFx1NTkwRFx1NEVDN1x1NjIxMFx1NTI5Rlx1RkYwQ1x1ODNCN1x1NUY5NyAke3Jlcy5sb290X2Ftb3VudH1gKTtcbiAgICAgICAgICAgICAgICAgIHNob3dUb2FzdChgXHUyNjk0XHVGRTBGIFx1NTkwRFx1NEVDN1x1NjIxMFx1NTI5Rlx1RkYwMVx1ODNCN1x1NUY5NyAke3Jlcy5sb290X2Ftb3VudH0gXHU3N0ZGXHU3N0YzYCwgJ3N1Y2Nlc3MnKTtcbiAgICAgICAgICAgICAgICAgIHNob3VsZFJlZnJlc2ggPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLmxvZyhgXHU1OTBEXHU0RUM3XHU1OTMxXHU4RDI1YCk7XG4gICAgICAgICAgICAgICAgICBzaG93VG9hc3QoJ1x1NTkwRFx1NEVDN1x1NTkzMVx1OEQyNScsICd3YXJuJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGF3YWl0IGJhci51cGRhdGUoKTtcbiAgICAgICAgICAgICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IGU/Lm1lc3NhZ2UgfHwgJ1x1NTkwRFx1NEVDN1x1NTkzMVx1OEQyNSc7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2coYFx1NTkwRFx1NEVDN1x1NTkzMVx1OEQyNVx1RkYxQSR7bWVzc2FnZX1gKTtcbiAgICAgICAgICAgICAgICBzaG93VG9hc3QobWVzc2FnZSwgJ2Vycm9yJyk7XG4gICAgICAgICAgICAgICAgYnRuLmlubmVySFRNTCA9IG9yaWdpbmFsSFRNTDtcbiAgICAgICAgICAgICAgICBtb3VudEljb25zKGJ0bik7XG4gICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgYnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgaWYgKHNob3VsZFJlZnJlc2gpIHtcbiAgICAgICAgICAgICAgICAgIGF3YWl0IGxvYWQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV2ZW5nZUxpc3QuYXBwZW5kQ2hpbGQocm93KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV2ZW5nZUxpc3QuaW5uZXJIVE1MID0gJzxkaXYgc3R5bGU9XCJvcGFjaXR5Oi44O3RleHQtYWxpZ246Y2VudGVyO3BhZGRpbmc6MTBweDtcIj5cdTY2ODJcdTY1RTBcdTUzRUZcdTU5MERcdTRFQzdcdTc2ODRcdTVCRjlcdThDNjE8L2Rpdj4nO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBsaXN0LmlubmVySFRNTCA9ICcnO1xuICAgICAgICBpZiAoIWRhdGEudGFyZ2V0cy5sZW5ndGgpIHtcbiAgICAgICAgICBsaXN0LmFwcGVuZENoaWxkKGh0bWwoJzxkaXYgc3R5bGU9XCJvcGFjaXR5Oi44O1wiPlx1NjY4Mlx1NjVFMFx1NTNFRlx1NjNBMFx1NTkzQVx1NzY4NFx1NzZFRVx1NjgwN1x1RkYwQ1x1N0EwRFx1NTQwRVx1NTE4RFx1OEJENTwvZGl2PicpKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IHRhcmdldCBvZiBkYXRhLnRhcmdldHMpIHtcbiAgICAgICAgICBjb25zdCByb3cgPSBodG1sKGBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsaXN0LWl0ZW0gbGlzdC1pdGVtLS1zZWxsXCI+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDoycHg7XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cImRpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjZweDtcIj48c3BhbiBkYXRhLWljbz1cInRhcmdldFwiPjwvc3Bhbj48c3Ryb25nPiR7dGFyZ2V0LnVzZXJuYW1lIHx8IHRhcmdldC5pZH08L3N0cm9uZz48L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwib3BhY2l0eTouODU7XCI+XHU3N0ZGXHU3N0YzXHVGRjFBJHt0YXJnZXQub3JlfSA8c3BhbiBjbGFzcz1cInBpbGxcIj5cdTk4ODRcdThCQTFcdTY1MzZcdTc2Q0EgNSV+MzAlPC9zcGFuPjwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1zZWxsXCIgZGF0YS1pZD1cIiR7dGFyZ2V0LmlkfVwiPjxzcGFuIGRhdGEtaWNvPVwic3dvcmRcIj48L3NwYW4+XHU2M0EwXHU1OTNBPC9idXR0b24+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgYCk7XG4gICAgICAgICAgbW91bnRJY29ucyhyb3cpO1xuICAgICAgICAgIHJvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIChldikgPT4ge1xuICAgICAgICAgICAgY29uc3QgZWwgPSBldi50YXJnZXQgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XG4gICAgICAgICAgICBjb25zdCBpZCA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1pZCcpO1xuICAgICAgICAgICAgaWYgKCFpZCkgcmV0dXJuO1xuICAgICAgICAgICAgY29uc3QgYnRuID0gZWwuY2xvc2VzdCgnYnV0dG9uJykgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XG4gICAgICAgICAgICBpZiAoIWJ0bikgcmV0dXJuO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBidG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxIVE1MID0gYnRuLmlubmVySFRNTDtcbiAgICAgICAgICAgIGJ0bi5pbm5lckhUTUwgPSAnPHNwYW4gZGF0YS1pY289XCJzd29yZFwiPjwvc3Bhbj5cdTYzQTBcdTU5M0FcdTRFMkRcdTIwMjYnO1xuICAgICAgICAgICAgbW91bnRJY29ucyhidG4pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBsZXQgc2hvdWxkUmVmcmVzaCA9IGZhbHNlO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgc3VjY2VzczogYm9vbGVhbjsgbG9vdF9hbW91bnQ6IG51bWJlciB9PihgL3BsdW5kZXIvJHtpZH1gLCB7IG1ldGhvZDogJ1BPU1QnIH0pO1xuICAgICAgICAgICAgICBpZiAocmVzLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZyhgXHU2MjEwXHU1MjlGXHU2M0EwXHU1OTNBICR7aWR9XHVGRjBDXHU4M0I3XHU1Rjk3ICR7cmVzLmxvb3RfYW1vdW50fWApO1xuICAgICAgICAgICAgICAgIHNob3dUb2FzdChgXHU2M0EwXHU1OTNBXHU2MjEwXHU1MjlGXHVGRjBDXHU4M0I3XHU1Rjk3ICR7cmVzLmxvb3RfYW1vdW50fSBcdTc3RkZcdTc3RjNgLCAnc3VjY2VzcycpO1xuICAgICAgICAgICAgICAgIHNob3VsZFJlZnJlc2ggPSB0cnVlO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMubG9nKGBcdTYzQTBcdTU5M0EgJHtpZH0gXHU1OTMxXHU4RDI1YCk7XG4gICAgICAgICAgICAgICAgc2hvd1RvYXN0KCdcdTYzQTBcdTU5M0FcdTU5MzFcdThEMjUnLCAnd2FybicpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGF3YWl0IGJhci51cGRhdGUoKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gZT8ubWVzc2FnZSB8fCAnXHU2M0EwXHU1OTNBXHU1OTMxXHU4RDI1JztcbiAgICAgICAgICAgICAgdGhpcy5sb2coYFx1NjNBMFx1NTkzQVx1NTkzMVx1OEQyNVx1RkYxQSR7bWVzc2FnZX1gKTtcbiAgICAgICAgICAgICAgaWYgKG1lc3NhZ2UuaW5jbHVkZXMoJ1x1NTFCN1x1NTM3NCcpKSB7XG4gICAgICAgICAgICAgICAgc2hvd1RvYXN0KG1lc3NhZ2UsICd3YXJuJyk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2hvd1RvYXN0KG1lc3NhZ2UsICdlcnJvcicpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIC8vIFx1NTkzMVx1OEQyNVx1NjVGNlx1NjA2Mlx1NTkwRFx1NjMwOVx1OTRBRVxuICAgICAgICAgICAgICBidG4uaW5uZXJIVE1MID0gb3JpZ2luYWxIVE1MO1xuICAgICAgICAgICAgICBtb3VudEljb25zKGJ0bik7XG4gICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICBidG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgLy8gXHU2MjEwXHU1MjlGXHU1NDBFXHU1MjM3XHU2NUIwXHU1MjE3XHU4ODY4XHVGRjA4XHU0RjFBXHU2NkZGXHU2MzYyXHU2MzA5XHU5NEFFXHVGRjA5XG4gICAgICAgICAgICAgIGlmIChzaG91bGRSZWZyZXNoKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgbG9hZCgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgbGlzdC5hcHBlbmRDaGlsZChyb3cpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgICAgc2hvd1RvYXN0KGU/Lm1lc3NhZ2UgfHwgJ1x1NTJBMFx1OEY3RFx1NjNBMFx1NTkzQVx1NzZFRVx1NjgwN1x1NTkzMVx1OEQyNScsICdlcnJvcicpO1xuICAgICAgICBsaXN0LmlubmVySFRNTCA9ICc8ZGl2IHN0eWxlPVwib3BhY2l0eTouODt0ZXh0LWFsaWduOmNlbnRlcjtwYWRkaW5nOjIwcHg7XCI+XHU1MkEwXHU4RjdEXHU1OTMxXHU4RDI1XHVGRjBDXHU4QkY3XHU3QTBEXHU1NDBFXHU5MUNEXHU4QkQ1PC9kaXY+JztcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHJlZnJlc2hCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgcmVmcmVzaEJ0bi5pbm5lckhUTUwgPSAnPHNwYW4gZGF0YS1pY289XCJyZWZyZXNoXCI+PC9zcGFuPlx1NTIzN1x1NjVCMCc7XG4gICAgICAgIG1vdW50SWNvbnMocmVmcmVzaEJ0bik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJlZnJlc2hCdG4ub25jbGljayA9ICgpID0+IGxvYWQoKTtcbiAgICBsb2FkKCk7XG4gIH1cblxuICBwcml2YXRlIGxvZyhtc2c6IHN0cmluZykge1xuICAgIGlmICghdGhpcy5yZXN1bHRCb3gpIHJldHVybjtcbiAgICBjb25zdCBsaW5lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgbGluZS50ZXh0Q29udGVudCA9IGBbJHtuZXcgRGF0ZSgpLnRvTG9jYWxlVGltZVN0cmluZygpfV0gJHttc2d9YDtcbiAgICB0aGlzLnJlc3VsdEJveC5wcmVwZW5kKGxpbmUpO1xuICB9XG59XG4iLCAiaW1wb3J0IHsgTmV0d29ya01hbmFnZXIgfSBmcm9tICcuLi9jb3JlL05ldHdvcmtNYW5hZ2VyJztcbmltcG9ydCB7IGh0bWwsIHFzIH0gZnJvbSAnLi4vdXRpbHMvZG9tJztcbmltcG9ydCB7IHJlbmRlck5hdiB9IGZyb20gJy4uL2NvbXBvbmVudHMvTmF2JztcbmltcG9ydCB7IFJlYWx0aW1lQ2xpZW50IH0gZnJvbSAnLi4vY29yZS9SZWFsdGltZUNsaWVudCc7XG5pbXBvcnQgeyBHYW1lTWFuYWdlciB9IGZyb20gJy4uL2NvcmUvR2FtZU1hbmFnZXInO1xuaW1wb3J0IHsgc2hvd1RvYXN0IH0gZnJvbSAnLi4vY29tcG9uZW50cy9Ub2FzdCc7XG5pbXBvcnQgeyByZW5kZXJSZXNvdXJjZUJhciB9IGZyb20gJy4uL2NvbXBvbmVudHMvUmVzb3VyY2VCYXInO1xuaW1wb3J0IHsgcmVuZGVySWNvbiB9IGZyb20gJy4uL2NvbXBvbmVudHMvSWNvbic7XG5cbnR5cGUgT3JkZXIgPSB7XG4gIGlkOiBzdHJpbmc7XG4gIHVzZXJJZDogc3RyaW5nO1xuICB0eXBlOiAnYnV5JyB8ICdzZWxsJztcbiAgaXRlbVRlbXBsYXRlSWQ/OiBzdHJpbmc7XG4gIGl0ZW1JbnN0YW5jZUlkPzogc3RyaW5nO1xuICBwcmljZTogbnVtYmVyO1xuICBhbW91bnQ6IG51bWJlcjtcbiAgY3JlYXRlZEF0OiBudW1iZXI7XG59O1xuXG5leHBvcnQgY2xhc3MgRXhjaGFuZ2VTY2VuZSB7XG4gIHByaXZhdGUgcmVmcmVzaFRpbWVyOiBudW1iZXIgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSB0ZW1wbGF0ZXM6IHsgaWQ6IHN0cmluZzsgbmFtZT86IHN0cmluZzsgY2F0ZWdvcnk/OiBzdHJpbmcgfVtdID0gW107XG4gIHByaXZhdGUgaW52ZW50b3J5OiBhbnlbXSA9IFtdO1xuXG4gIGFzeW5jIG1vdW50KHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgdGhpcy5jbGVhclRpbWVyKCk7XG4gICAgcm9vdC5pbm5lckhUTUwgPSAnJztcblxuICAgIGNvbnN0IG5hdiA9IHJlbmRlck5hdignZXhjaGFuZ2UnKTtcbiAgICBjb25zdCBiYXIgPSByZW5kZXJSZXNvdXJjZUJhcigpO1xuICAgIGNvbnN0IHZpZXcgPSBodG1sKGBcbiAgICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXIgZ3JpZC0yXCIgc3R5bGU9XCJjb2xvcjojZmZmO1wiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZCBmYWRlLWluXCI+XG4gICAgICAgICAgPGgzIHN0eWxlPVwibWFyZ2luOjAgMCAxMnB4O2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjhweDtcIj48c3BhbiBkYXRhLWljbz1cImV4Y2hhbmdlXCI+PC9zcGFuPlx1NUUwMlx1NTczQVx1NEUwQlx1NTM1NTwvaDM+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiIHN0eWxlPVwiZmxleC13cmFwOndyYXA7YWxpZ24taXRlbXM6ZmxleC1lbmQ7Z2FwOjEycHg7XCI+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZmxleDoxO21pbi13aWR0aDoxODBweDtcIj5cbiAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVwiZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NnB4O1wiPjxzcGFuIGRhdGEtaWNvPVwibGlzdFwiPjwvc3Bhbj5cdThEMkRcdTRFNzBcdTZBMjFcdTY3N0Y8L2xhYmVsPlxuICAgICAgICAgICAgICA8c2VsZWN0IGlkPVwidHBsXCIgY2xhc3M9XCJpbnB1dFwiPjwvc2VsZWN0PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZmxleDoxO21pbi13aWR0aDoxMjBweDtcIj5cbiAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPVwiZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NnB4O1wiPjxzcGFuIGRhdGEtaWNvPVwiY29pblwiPjwvc3Bhbj5cdTRFRjdcdTY4M0MgKEJCXHU1RTAxKTwvbGFiZWw+XG4gICAgICAgICAgICAgIDxpbnB1dCBpZD1cInByaWNlXCIgY2xhc3M9XCJpbnB1dFwiIHR5cGU9XCJudW1iZXJcIiBtaW49XCIxXCIgdmFsdWU9XCIxMFwiLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT1cImZsZXg6MTttaW4td2lkdGg6MTIwcHg7XCI+XG4gICAgICAgICAgICAgIDxsYWJlbD5cdThEMkRcdTRFNzBcdTY1NzBcdTkxQ0Y8L2xhYmVsPlxuICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJhbW91bnRcIiBjbGFzcz1cImlucHV0XCIgdHlwZT1cIm51bWJlclwiIG1pbj1cIjFcIiB2YWx1ZT1cIjFcIi8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxidXR0b24gaWQ9XCJwbGFjZUJ1eVwiIGNsYXNzPVwiYnRuIGJ0bi1idXlcIiBzdHlsZT1cIm1pbi13aWR0aDoxMjBweDtcIj48c3BhbiBkYXRhLWljbz1cImFycm93LXJpZ2h0XCI+PC9zcGFuPlx1NEUwQlx1NEU3MFx1NTM1NTwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgc3R5bGU9XCJoZWlnaHQ6OHB4O1wiPjwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIiBzdHlsZT1cImZsZXgtd3JhcDp3cmFwO2FsaWduLWl0ZW1zOmZsZXgtZW5kO2dhcDoxMnB4O1wiPlxuICAgICAgICAgICAgPGRpdiBzdHlsZT1cImZsZXg6MTttaW4td2lkdGg6MjIwcHg7XCI+XG4gICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cImRpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjZweDtcIj48c3BhbiBkYXRhLWljbz1cImJveFwiPjwvc3Bhbj5cdTUxRkFcdTU1MkVcdTkwNTNcdTUxNzc8L2xhYmVsPlxuICAgICAgICAgICAgICA8c2VsZWN0IGlkPVwiaW5zdFwiIGNsYXNzPVwiaW5wdXRcIj48L3NlbGVjdD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT1cImZsZXg6MTttaW4td2lkdGg6MTIwcHg7XCI+XG4gICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cImRpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjZweDtcIj48c3BhbiBkYXRhLWljbz1cImNvaW5cIj48L3NwYW4+XHU0RUY3XHU2ODNDIChCQlx1NUUwMSk8L2xhYmVsPlxuICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJzcHJpY2VcIiBjbGFzcz1cImlucHV0XCIgdHlwZT1cIm51bWJlclwiIG1pbj1cIjFcIiB2YWx1ZT1cIjVcIi8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxidXR0b24gaWQ9XCJwbGFjZVNlbGxcIiBjbGFzcz1cImJ0biBidG4tc2VsbFwiIHN0eWxlPVwibWluLXdpZHRoOjEyMHB4O1wiPjxzcGFuIGRhdGEtaWNvPVwiYXJyb3ctcmlnaHRcIj48L3NwYW4+XHU0RTBCXHU1MzU2XHU1MzU1PC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBpZD1cImludmVudG9yeVwiIHN0eWxlPVwibWFyZ2luLXRvcDoxMnB4O2Rpc3BsYXk6ZmxleDtmbGV4LXdyYXA6d3JhcDtnYXA6OHB4O1wiPjwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZCBmYWRlLWluXCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiIHN0eWxlPVwianVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YWxpZ24taXRlbXM6Y2VudGVyO2dhcDoxMnB4O1wiPlxuICAgICAgICAgICAgPGgzIHN0eWxlPVwibWFyZ2luOjA7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6OHB4O1wiPjxzcGFuIGRhdGEtaWNvPVwibGlzdFwiPjwvc3Bhbj5cdThCQTJcdTUzNTVcdTdDM0Y8L2gzPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiIHN0eWxlPVwiZmxleC13cmFwOndyYXA7Z2FwOjhweDtcIj5cbiAgICAgICAgICAgICAgPHNlbGVjdCBpZD1cInFfdHBsXCIgY2xhc3M9XCJpbnB1dFwiIHN0eWxlPVwid2lkdGg6MTgwcHg7XCI+PC9zZWxlY3Q+XG4gICAgICAgICAgICAgIDxzZWxlY3QgaWQ9XCJxX3R5cGVcIiBjbGFzcz1cImlucHV0XCIgc3R5bGU9XCJ3aWR0aDoxMjBweDtcIj5cbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiYnV5XCI+XHU0RTcwXHU1MzU1PC9vcHRpb24+XG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInNlbGxcIj5cdTUzNTZcdTUzNTU8L29wdGlvbj5cbiAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cInJvdyBwaWxsXCIgc3R5bGU9XCJhbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjZweDtcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBkYXRhLWljbz1cInVzZXJcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgPGlucHV0IGlkPVwibXlcIiB0eXBlPVwiY2hlY2tib3hcIi8+IFx1NTNFQVx1NzcwQlx1NjIxMVx1NzY4NFxuICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwicmVmcmVzaFwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCIgc3R5bGU9XCJtaW4td2lkdGg6OTZweDtcIj48c3BhbiBkYXRhLWljbz1cInJlZnJlc2hcIj48L3NwYW4+XHU1MjM3XHU2NUIwPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGlkPVwiYm9va1wiIHN0eWxlPVwibWFyZ2luLXRvcDoxMnB4O2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjhweDtcIj48L2Rpdj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQgZmFkZS1pblwiIGlkPVwibG9nc1wiIHN0eWxlPVwib3BhY2l0eTouOTtmb250LWZhbWlseTptb25vc3BhY2U7bWluLWhlaWdodDoyNHB4O1wiPjwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgYCk7XG5cbiAgICByb290LmFwcGVuZENoaWxkKG5hdik7XG4gICAgcm9vdC5hcHBlbmRDaGlsZChiYXIucm9vdCk7XG4gICAgcm9vdC5hcHBlbmRDaGlsZCh2aWV3KTtcblxuICAgIGNvbnN0IHRva2VuID0gTmV0d29ya01hbmFnZXIuSS5nZXRUb2tlbigpO1xuICAgIGlmICh0b2tlbikgUmVhbHRpbWVDbGllbnQuSS5jb25uZWN0KHRva2VuKTtcbiAgICBjb25zdCBtZSA9IEdhbWVNYW5hZ2VyLkkuZ2V0UHJvZmlsZSgpO1xuXG4gICAgY29uc3QgYm9vayA9IHFzKHZpZXcsICcjYm9vaycpO1xuICAgIGNvbnN0IGxvZ3MgPSBxczxIVE1MRWxlbWVudD4odmlldywgJyNsb2dzJyk7XG4gICAgY29uc3QgYnV5VHBsID0gcXM8SFRNTFNlbGVjdEVsZW1lbnQ+KHZpZXcsICcjdHBsJyk7XG4gICAgY29uc3QgYnV5UHJpY2UgPSBxczxIVE1MSW5wdXRFbGVtZW50Pih2aWV3LCAnI3ByaWNlJyk7XG4gICAgY29uc3QgYnV5QW1vdW50ID0gcXM8SFRNTElucHV0RWxlbWVudD4odmlldywgJyNhbW91bnQnKTtcbiAgICBjb25zdCBwbGFjZUJ1eSA9IHFzPEhUTUxCdXR0b25FbGVtZW50Pih2aWV3LCAnI3BsYWNlQnV5Jyk7XG4gICAgY29uc3Qgc2VsbEluc3QgPSBxczxIVE1MU2VsZWN0RWxlbWVudD4odmlldywgJyNpbnN0Jyk7XG4gICAgY29uc3Qgc2VsbFByaWNlID0gcXM8SFRNTElucHV0RWxlbWVudD4odmlldywgJyNzcHJpY2UnKTtcbiAgICBjb25zdCBwbGFjZVNlbGwgPSBxczxIVE1MQnV0dG9uRWxlbWVudD4odmlldywgJyNwbGFjZVNlbGwnKTtcbiAgICBjb25zdCBpbnZCb3ggPSBxczxIVE1MRWxlbWVudD4odmlldywgJyNpbnZlbnRvcnknKTtcbiAgICBjb25zdCBxdWVyeVRwbCA9IHFzPEhUTUxTZWxlY3RFbGVtZW50Pih2aWV3LCAnI3FfdHBsJyk7XG4gICAgY29uc3QgcXVlcnlUeXBlID0gcXM8SFRNTFNlbGVjdEVsZW1lbnQ+KHZpZXcsICcjcV90eXBlJyk7XG4gICAgY29uc3QgcXVlcnlNaW5lT25seSA9IHFzPEhUTUxJbnB1dEVsZW1lbnQ+KHZpZXcsICcjbXknKTtcbiAgICBjb25zdCBtaW5lT25seUxhYmVsID0gdmlldy5xdWVyeVNlbGVjdG9yKCdsYWJlbC5yb3cucGlsbCcpIGFzIEhUTUxMYWJlbEVsZW1lbnQgfCBudWxsO1xuICAgIGNvbnN0IHJlZnJlc2hCdG4gPSBxczxIVE1MQnV0dG9uRWxlbWVudD4odmlldywgJyNyZWZyZXNoJyk7XG5cbiAgICBjb25zdCBtb3VudEljb25zID0gKHJvb3RFbDogRWxlbWVudCkgPT4ge1xuICAgICAgcm9vdEVsLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWljb10nKVxuICAgICAgICAuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgICBjb25zdCBuYW1lID0gKGVsIGFzIEhUTUxFbGVtZW50KS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWNvJykgYXMgYW55O1xuICAgICAgICAgIHRyeSB7IGVsLmFwcGVuZENoaWxkKHJlbmRlckljb24obmFtZSwgeyBzaXplOiAyMCB9KSk7IH0gY2F0Y2gge31cbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBtb3VudEljb25zKHZpZXcpO1xuXG4gICAgbGV0IHByZXZJZHMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICBsZXQgcmVmcmVzaGluZyA9IGZhbHNlO1xuXG4gICAgY29uc3QgbG9nID0gKG1lc3NhZ2U6IHN0cmluZykgPT4ge1xuICAgICAgbG9ncy50ZXh0Q29udGVudCA9IG1lc3NhZ2U7XG4gICAgfTtcblxuICAgIGNvbnN0IHJlbmRlclRlbXBsYXRlT3B0aW9ucyA9ICgpID0+IHtcbiAgICAgIGJ1eVRwbC5pbm5lckhUTUwgPSAnJztcbiAgICAgIHF1ZXJ5VHBsLmlubmVySFRNTCA9ICcnO1xuICAgICAgY29uc3QgcGxhY2Vob2xkZXIgPSBodG1sKCc8b3B0aW9uIHZhbHVlPVwiXCI+XHU5MDA5XHU2MkU5XHU2QTIxXHU2NzdGPC9vcHRpb24+JykgYXMgSFRNTE9wdGlvbkVsZW1lbnQ7XG4gICAgICBidXlUcGwuYXBwZW5kQ2hpbGQocGxhY2Vob2xkZXIpO1xuICAgICAgY29uc3QgcVBsYWNlaG9sZGVyID0gaHRtbCgnPG9wdGlvbiB2YWx1ZT1cIlwiPlx1NTE2OFx1OTBFOFx1NkEyMVx1Njc3Rjwvb3B0aW9uPicpIGFzIEhUTUxPcHRpb25FbGVtZW50O1xuICAgICAgcXVlcnlUcGwuYXBwZW5kQ2hpbGQocVBsYWNlaG9sZGVyKTtcbiAgICAgIGZvciAoY29uc3QgdHBsIG9mIHRoaXMudGVtcGxhdGVzKSB7XG4gICAgICAgIGNvbnN0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgICBvcHRpb24udmFsdWUgPSB0cGwuaWQ7XG4gICAgICAgIG9wdGlvbi50ZXh0Q29udGVudCA9IHRwbC5uYW1lID8gYCR7dHBsLm5hbWV9ICgke3RwbC5pZH0pYCA6IHRwbC5pZDtcbiAgICAgICAgYnV5VHBsLmFwcGVuZENoaWxkKG9wdGlvbik7XG4gICAgICAgIGNvbnN0IHFPcHRpb24gPSBvcHRpb24uY2xvbmVOb2RlKHRydWUpIGFzIEhUTUxPcHRpb25FbGVtZW50O1xuICAgICAgICBxdWVyeVRwbC5hcHBlbmRDaGlsZChxT3B0aW9uKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgcmVuZGVySW52ZW50b3J5ID0gKCkgPT4ge1xuICAgICAgc2VsbEluc3QuaW5uZXJIVE1MID0gJyc7XG4gICAgICBpbnZCb3guaW5uZXJIVE1MID0gJyc7XG4gICAgICBjb25zdCBkZWZhdWx0T3B0aW9uID0gaHRtbCgnPG9wdGlvbiB2YWx1ZT1cIlwiPlx1OTAwOVx1NjJFOVx1NTNFRlx1NTFGQVx1NTUyRVx1NzY4NFx1OTA1M1x1NTE3Nzwvb3B0aW9uPicpIGFzIEhUTUxPcHRpb25FbGVtZW50O1xuICAgICAgc2VsbEluc3QuYXBwZW5kQ2hpbGQoZGVmYXVsdE9wdGlvbik7XG4gICAgICBjb25zdCBhdmFpbGFibGUgPSB0aGlzLmludmVudG9yeS5maWx0ZXIoKGl0ZW0pID0+ICFpdGVtLmlzRXF1aXBwZWQgJiYgIWl0ZW0uaXNMaXN0ZWQpO1xuICAgICAgaWYgKCFhdmFpbGFibGUubGVuZ3RoKSB7XG4gICAgICAgIGludkJveC50ZXh0Q29udGVudCA9ICdcdTY2ODJcdTY1RTBcdTUzRUZcdTUxRkFcdTU1MkVcdTc2ODRcdTkwNTNcdTUxNzdcdUZGMDhcdTk3MDBcdTUxNDhcdTU3MjhcdTRFRDNcdTVFOTNcdTUzNzhcdTRFMEJcdTg4QzVcdTU5MDdcdUZGMDknO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgYXZhaWxhYmxlKSB7XG4gICAgICAgIGNvbnN0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgICBvcHRpb24udmFsdWUgPSBpdGVtLmlkO1xuICAgICAgICBvcHRpb24udGV4dENvbnRlbnQgPSBgJHtpdGVtLmlkfSBcdTAwQjcgJHtpdGVtLnRlbXBsYXRlSWR9IFx1MDBCNyBMdi4ke2l0ZW0ubGV2ZWx9YDtcbiAgICAgICAgc2VsbEluc3QuYXBwZW5kQ2hpbGQob3B0aW9uKTtcblxuICAgICAgICBjb25zdCBjaGlwID0gaHRtbChgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tZ2hvc3RcIiBzdHlsZT1cImZsZXg6dW5zZXQ7cGFkZGluZzo2cHggMTBweDtcIiBkYXRhLWlkPVwiJHtpdGVtLmlkfVwiPiR7aXRlbS5pZH0gKCR7aXRlbS50ZW1wbGF0ZUlkfSk8L2J1dHRvbj5gKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcbiAgICAgICAgY2hpcC5vbmNsaWNrID0gKCkgPT4ge1xuICAgICAgICAgIHNlbGxJbnN0LnZhbHVlID0gaXRlbS5pZDtcbiAgICAgICAgICBsb2coYFx1NURGMlx1OTAwOVx1NjJFOVx1NTFGQVx1NTUyRVx1OTA1M1x1NTE3NyAke2l0ZW0uaWR9YCk7XG4gICAgICAgIH07XG4gICAgICAgIGludkJveC5hcHBlbmRDaGlsZChjaGlwKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgbG9hZE1ldGFkYXRhID0gYXN5bmMgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgW3RwbHMsIGl0ZW1zXSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgICBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyB0ZW1wbGF0ZXM6IGFueVtdIH0+KCcvaXRlbXMvdGVtcGxhdGVzJyksXG4gICAgICAgICAgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgaXRlbXM6IGFueVtdIH0+KCcvaXRlbXMnKSxcbiAgICAgICAgXSk7XG4gICAgICAgIHRoaXMudGVtcGxhdGVzID0gdHBscy50ZW1wbGF0ZXMgfHwgW107XG4gICAgICAgIHRoaXMuaW52ZW50b3J5ID0gaXRlbXMuaXRlbXMgfHwgW107XG4gICAgICAgIHJlbmRlclRlbXBsYXRlT3B0aW9ucygpO1xuICAgICAgICByZW5kZXJJbnZlbnRvcnkoKTtcbiAgICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgICBsb2coZT8ubWVzc2FnZSB8fCAnXHU1MkEwXHU4RjdEXHU2QTIxXHU2NzdGL1x1NEVEM1x1NUU5M1x1NTkzMVx1OEQyNScpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCByZWZyZXNoID0gYXN5bmMgKG9wdHM6IHsgcXVpZXQ/OiBib29sZWFuIH0gPSB7fSkgPT4ge1xuICAgICAgaWYgKHJlZnJlc2hpbmcpIHJldHVybjtcbiAgICAgIHJlZnJlc2hpbmcgPSB0cnVlO1xuICAgICAgaWYgKCFvcHRzLnF1aWV0KSB7IHJlZnJlc2hCdG4uaW5uZXJIVE1MID0gJzxzcGFuIGRhdGEtaWNvPVwicmVmcmVzaFwiPjwvc3Bhbj5cdTUyMzdcdTY1QjBcdTRFMkRcdTIwMjYnOyBtb3VudEljb25zKHJlZnJlc2hCdG4pOyB9XG4gICAgICByZWZyZXNoQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHRwbElkID0gcXVlcnlUcGwudmFsdWU7XG4gICAgICAgIGNvbnN0IHR5cGUgPSBxdWVyeVR5cGUudmFsdWUgYXMgJ2J1eScgfCAnc2VsbCc7XG4gICAgICAgIGNvbnN0IG1pbmVPbmx5ID0gcXVlcnlNaW5lT25seS5jaGVja2VkO1xuICAgICAgICBjb25zdCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKCk7XG4gICAgICAgIHBhcmFtcy5zZXQoJ3R5cGUnLCB0eXBlKTtcbiAgICAgICAgcGFyYW1zLnNldCgnaXRlbV90ZW1wbGF0ZV9pZCcsIHRwbElkIHx8ICcnKTtcbiAgICAgICAgaWYgKCFvcHRzLnF1aWV0KSB7XG4gICAgICAgICAgYm9vay5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykgYm9vay5hcHBlbmRDaGlsZChodG1sKCc8ZGl2IGNsYXNzPVwic2tlbGV0b25cIj48L2Rpdj4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IG9yZGVyczogT3JkZXJbXSB9PihgL2V4Y2hhbmdlL29yZGVycz8ke3BhcmFtcy50b1N0cmluZygpfWApO1xuICAgICAgICBjb25zdCBuZXdJZHMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICAgICAgYm9vay5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgY29uc3Qgb3JkZXJzID0gZGF0YS5vcmRlcnMgfHwgW107XG4gICAgICAgIGlmICghb3JkZXJzLmxlbmd0aCkge1xuICAgICAgICAgIGJvb2suYXBwZW5kQ2hpbGQoaHRtbCgnPGRpdiBzdHlsZT1cIm9wYWNpdHk6Ljg7dGV4dC1hbGlnbjpjZW50ZXI7XCI+XHU2NjgyXHU2NUUwXHU4QkEyXHU1MzU1PC9kaXY+JykpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3Qgb3JkZXIgb2Ygb3JkZXJzKSB7XG4gICAgICAgICAgaWYgKG1pbmVPbmx5ICYmIG1lICYmIG9yZGVyLnVzZXJJZCAhPT0gbWUuaWQpIGNvbnRpbnVlO1xuICAgICAgICAgIG5ld0lkcy5hZGQob3JkZXIuaWQpO1xuICAgICAgICAgIGNvbnN0IGlzTWluZSA9IG1lICYmIG9yZGVyLnVzZXJJZCA9PT0gbWUuaWQ7XG4gICAgICAgICAgY29uc3Qga2xhc3MgPSBgbGlzdC1pdGVtICR7b3JkZXIudHlwZSA9PT0gJ2J1eScgPyAnbGlzdC1pdGVtLS1idXknIDogJ2xpc3QtaXRlbS0tc2VsbCd9YDtcbiAgICAgICAgICBjb25zdCByb3cgPSBodG1sKGBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCIke2tsYXNzfVwiPlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6MnB4O1wiPlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICA8c3Ryb25nPiR7b3JkZXIudHlwZSA9PT0gJ2J1eScgPyAnXHU0RTcwXHU1MTY1JyA6ICdcdTUzNTZcdTUxRkEnfTwvc3Ryb25nPlxuICAgICAgICAgICAgICAgICAgJHtvcmRlci5pdGVtVGVtcGxhdGVJZCB8fCAnJ31cbiAgICAgICAgICAgICAgICAgICR7aXNNaW5lID8gJzxzcGFuIGNsYXNzPVwicGlsbFwiPlx1NjIxMVx1NzY4NDwvc3Bhbj4nIDogJyd9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cIm9wYWNpdHk6Ljg1O1wiPlxuICAgICAgICAgICAgICAgICAgXHU0RUY3XHU2ODNDOiAke29yZGVyLnByaWNlfSBcdTAwQjcgXHU2NTcwXHU5MUNGOiAke29yZGVyLmFtb3VudH1cbiAgICAgICAgICAgICAgICAgICR7b3JkZXIuaXRlbUluc3RhbmNlSWQgPyBgPHNwYW4gY2xhc3M9XCJwaWxsXCI+JHtvcmRlci5pdGVtSW5zdGFuY2VJZH08L3NwYW4+YCA6ICcnfVxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwaWxsXCI+JHtvcmRlci5pZH08L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICR7aXNNaW5lID8gYDxidXR0b24gY2xhc3M9XCJidG4gYnRuLWdob3N0XCIgZGF0YS1pZD1cIiR7b3JkZXIuaWR9XCI+PHNwYW4gZGF0YS1pY289XCJ0cmFzaFwiPjwvc3Bhbj5cdTY0QTRcdTUzNTU8L2J1dHRvbj5gIDogJyd9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgYCk7XG4gICAgICAgICAgbW91bnRJY29ucyhyb3cpO1xuICAgICAgICAgIGlmICghcHJldklkcy5oYXMob3JkZXIuaWQpKSByb3cuY2xhc3NMaXN0LmFkZCgnZmxhc2gnKTtcbiAgICAgICAgICByb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZXYpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGV2LnRhcmdldCBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgICAgIGNvbnN0IGlkID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1pZCcpO1xuICAgICAgICAgICAgaWYgKCFpZCkgcmV0dXJuO1xuICAgICAgICAgICAgY29uc3QgYnRuID0gdGFyZ2V0LmNsb3Nlc3QoJ2J1dHRvbicpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xuICAgICAgICAgICAgaWYgKCFidG4pIHJldHVybjtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgYnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxIVE1MID0gYnRuLmlubmVySFRNTDtcbiAgICAgICAgICAgICAgYnRuLmlubmVySFRNTCA9ICc8c3BhbiBkYXRhLWljbz1cInRyYXNoXCI+PC9zcGFuPlx1NjRBNFx1NTM1NVx1NEUyRFx1MjAyNic7XG4gICAgICAgICAgICAgIG1vdW50SWNvbnMoYnRuKTtcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdChgL2V4Y2hhbmdlL29yZGVycy8ke2lkfWAsIHsgbWV0aG9kOiAnREVMRVRFJyB9KTtcbiAgICAgICAgICAgICAgc2hvd1RvYXN0KCdcdTY0QTRcdTUzNTVcdTYyMTBcdTUyOUYnLCAnc3VjY2VzcycpO1xuICAgICAgICAgICAgICBhd2FpdCByZWZyZXNoKCk7XG4gICAgICAgICAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgICAgICAgICAgc2hvd1RvYXN0KGU/Lm1lc3NhZ2UgfHwgJ1x1NjRBNFx1NTM1NVx1NTkzMVx1OEQyNScsICdlcnJvcicpO1xuICAgICAgICAgICAgICAvLyBcdTU5MzFcdThEMjVcdTY1RjZcdTk3MDBcdTg5ODFcdTYwNjJcdTU5MERcdTYzMDlcdTk0QUVcdUZGMDhcdTU2RTBcdTRFM0FcdTRFMERcdTRGMUFcdTUyMzdcdTY1QjBcdTUyMTdcdTg4NjhcdUZGMDlcbiAgICAgICAgICAgICAgYXdhaXQgcmVmcmVzaCgpO1xuICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgYnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgYm9vay5hcHBlbmRDaGlsZChyb3cpO1xuICAgICAgICB9XG4gICAgICAgIHByZXZJZHMgPSBuZXdJZHM7XG4gICAgICAgIGlmICghYm9vay5jaGlsZEVsZW1lbnRDb3VudCkge1xuICAgICAgICAgIGJvb2suYXBwZW5kQ2hpbGQoaHRtbCgnPGRpdiBzdHlsZT1cIm9wYWNpdHk6Ljg7dGV4dC1hbGlnbjpjZW50ZXI7XCI+XHU2NjgyXHU2NUUwXHU3QjI2XHU1NDA4XHU2NzYxXHU0RUY2XHU3Njg0XHU4QkEyXHU1MzU1PC9kaXY+JykpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgICAgbG9nKGU/Lm1lc3NhZ2UgfHwgJ1x1NTIzN1x1NjVCMFx1OEJBMlx1NTM1NVx1NTkzMVx1OEQyNScpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgcmVmcmVzaGluZyA9IGZhbHNlO1xuICAgICAgICByZWZyZXNoQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIHJlZnJlc2hCdG4uaW5uZXJIVE1MID0gJzxzcGFuIGRhdGEtaWNvPVwicmVmcmVzaFwiPjwvc3Bhbj5cdTUyMzdcdTY1QjAnO1xuICAgICAgICBtb3VudEljb25zKHJlZnJlc2hCdG4pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBwbGFjZUJ1eS5vbmNsaWNrID0gYXN5bmMgKCkgPT4ge1xuICAgICAgaWYgKHBsYWNlQnV5LmRpc2FibGVkKSByZXR1cm47IC8vIFx1OTYzMlx1NkI2Mlx1OTFDRFx1NTkwRFx1NzBCOVx1NTFGQlxuICAgICAgXG4gICAgICBjb25zdCB0cGxJZCA9IGJ1eVRwbC52YWx1ZS50cmltKCk7XG4gICAgICBjb25zdCBwcmljZSA9IE51bWJlcihidXlQcmljZS52YWx1ZSk7XG4gICAgICBjb25zdCBhbW91bnQgPSBOdW1iZXIoYnV5QW1vdW50LnZhbHVlKTtcbiAgICAgIGlmICghdHBsSWQpIHtcbiAgICAgICAgc2hvd1RvYXN0KCdcdThCRjdcdTkwMDlcdTYyRTlcdThEMkRcdTRFNzBcdTc2ODRcdTZBMjFcdTY3N0YnLCAnd2FybicpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoaXNOYU4ocHJpY2UpIHx8IGlzTmFOKGFtb3VudCkgfHwgcHJpY2UgPD0gMCB8fCBhbW91bnQgPD0gMCB8fCAhTnVtYmVyLmlzSW50ZWdlcihhbW91bnQpKSB7XG4gICAgICAgIHNob3dUb2FzdCgnXHU4QkY3XHU4RjkzXHU1MTY1XHU2NzA5XHU2NTQ4XHU3Njg0XHU0RUY3XHU2ODNDXHU0RTBFXHU2NTcwXHU5MUNGXHVGRjA4XHU2NTcwXHU5MUNGXHU1RkM1XHU5ODdCXHU0RTNBXHU2NTc0XHU2NTcwXHVGRjA5JywgJ3dhcm4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHByaWNlID4gMTAwMDAwMCB8fCBhbW91bnQgPiAxMDAwMCkge1xuICAgICAgICBzaG93VG9hc3QoJ1x1NjU3MFx1NTAzQ1x1OEZDN1x1NTkyN1x1RkYwQ1x1OEJGN1x1OEY5M1x1NTE2NVx1NTQwOFx1NzQwNlx1NzY4NFx1NEVGN1x1NjgzQ1x1NTQ4Q1x1NjU3MFx1OTFDRicsICd3YXJuJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHBsYWNlQnV5LmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIGNvbnN0IG9yaWdpbmFsQnV5SFRNTCA9IHBsYWNlQnV5LmlubmVySFRNTDtcbiAgICAgIHBsYWNlQnV5LmlubmVySFRNTCA9ICc8c3BhbiBkYXRhLWljbz1cImFycm93LXJpZ2h0XCI+PC9zcGFuPlx1NjNEMFx1NEVBNFx1NEUyRFx1MjAyNic7XG4gICAgICBtb3VudEljb25zKHBsYWNlQnV5KTtcbiAgICAgIFxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgaWQ6IHN0cmluZyB9PignL2V4Y2hhbmdlL29yZGVycycsIHtcbiAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IHR5cGU6ICdidXknLCBpdGVtX3RlbXBsYXRlX2lkOiB0cGxJZCwgcHJpY2UsIGFtb3VudCB9KSxcbiAgICAgICAgfSk7XG4gICAgICAgIHNob3dUb2FzdChgXHU0RTcwXHU1MzU1XHU1REYyXHU2M0QwXHU0RUE0ICgjJHtyZXMuaWR9KWAsICdzdWNjZXNzJyk7XG4gICAgICAgIGxvZyhgXHU0RTcwXHU1MzU1XHU2MjEwXHU1MjlGOiAke3Jlcy5pZH1gKTtcbiAgICAgICAgYXdhaXQgYmFyLnVwZGF0ZSgpO1xuICAgICAgICBhd2FpdCByZWZyZXNoKCk7XG4gICAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgICAgc2hvd1RvYXN0KGU/Lm1lc3NhZ2UgfHwgJ1x1NEU3MFx1NTM1NVx1NjNEMFx1NEVBNFx1NTkzMVx1OEQyNScsICdlcnJvcicpO1xuICAgICAgICBsb2coZT8ubWVzc2FnZSB8fCAnXHU0RTcwXHU1MzU1XHU2M0QwXHU0RUE0XHU1OTMxXHU4RDI1Jyk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBwbGFjZUJ1eS5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICBwbGFjZUJ1eS5pbm5lckhUTUwgPSBvcmlnaW5hbEJ1eUhUTUw7XG4gICAgICAgIG1vdW50SWNvbnMocGxhY2VCdXkpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBwbGFjZVNlbGwub25jbGljayA9IGFzeW5jICgpID0+IHtcbiAgICAgIGlmIChwbGFjZVNlbGwuZGlzYWJsZWQpIHJldHVybjsgLy8gXHU5NjMyXHU2QjYyXHU5MUNEXHU1OTBEXHU3MEI5XHU1MUZCXG4gICAgICBcbiAgICAgIGNvbnN0IGluc3RJZCA9IHNlbGxJbnN0LnZhbHVlLnRyaW0oKTtcbiAgICAgIGNvbnN0IHByaWNlID0gTnVtYmVyKHNlbGxQcmljZS52YWx1ZSk7XG4gICAgICBpZiAoIWluc3RJZCkge1xuICAgICAgICBzaG93VG9hc3QoJ1x1OEJGN1x1OTAwOVx1NjJFOVx1ODk4MVx1NTFGQVx1NTUyRVx1NzY4NFx1OTA1M1x1NTE3NycsICd3YXJuJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChpc05hTihwcmljZSkgfHwgcHJpY2UgPD0gMCkge1xuICAgICAgICBzaG93VG9hc3QoJ1x1OEJGN1x1OEY5M1x1NTE2NVx1NjcwOVx1NjU0OFx1NzY4NFx1NEVGN1x1NjgzQycsICd3YXJuJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChwcmljZSA+IDEwMDAwMDApIHtcbiAgICAgICAgc2hvd1RvYXN0KCdcdTRFRjdcdTY4M0NcdThGQzdcdTlBRDhcdUZGMENcdThCRjdcdThGOTNcdTUxNjVcdTU0MDhcdTc0MDZcdTc2ODRcdTRFRjdcdTY4M0MnLCAnd2FybicpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBwbGFjZVNlbGwuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgY29uc3Qgb3JpZ2luYWxTZWxsSFRNTCA9IHBsYWNlU2VsbC5pbm5lckhUTUw7XG4gICAgICBwbGFjZVNlbGwuaW5uZXJIVE1MID0gJzxzcGFuIGRhdGEtaWNvPVwiYXJyb3ctcmlnaHRcIj48L3NwYW4+XHU2M0QwXHU0RUE0XHU0RTJEXHUyMDI2JztcbiAgICAgIG1vdW50SWNvbnMocGxhY2VTZWxsKTtcbiAgICAgIFxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgaWQ6IHN0cmluZyB9PignL2V4Y2hhbmdlL29yZGVycycsIHtcbiAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IHR5cGU6ICdzZWxsJywgaXRlbV9pbnN0YW5jZV9pZDogaW5zdElkLCBwcmljZSB9KSxcbiAgICAgICAgfSk7XG4gICAgICAgIHNob3dUb2FzdChgXHU1MzU2XHU1MzU1XHU1REYyXHU2M0QwXHU0RUE0ICgjJHtyZXMuaWR9KWAsICdzdWNjZXNzJyk7XG4gICAgICAgIGxvZyhgXHU1MzU2XHU1MzU1XHU2MjEwXHU1MjlGOiAke3Jlcy5pZH1gKTtcbiAgICAgICAgYXdhaXQgYmFyLnVwZGF0ZSgpO1xuICAgICAgICBhd2FpdCBsb2FkTWV0YWRhdGEoKTtcbiAgICAgICAgYXdhaXQgcmVmcmVzaCgpO1xuICAgICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgIHNob3dUb2FzdChlPy5tZXNzYWdlIHx8ICdcdTUzNTZcdTUzNTVcdTYzRDBcdTRFQTRcdTU5MzFcdThEMjUnLCAnZXJyb3InKTtcbiAgICAgICAgbG9nKGU/Lm1lc3NhZ2UgfHwgJ1x1NTM1Nlx1NTM1NVx1NjNEMFx1NEVBNFx1NTkzMVx1OEQyNScpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgcGxhY2VTZWxsLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIHBsYWNlU2VsbC5pbm5lckhUTUwgPSBvcmlnaW5hbFNlbGxIVE1MO1xuICAgICAgICBtb3VudEljb25zKHBsYWNlU2VsbCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJlZnJlc2hCdG4ub25jbGljayA9ICgpID0+IHJlZnJlc2goKTtcbiAgICBxdWVyeVRwbC5vbmNoYW5nZSA9ICgpID0+IHJlZnJlc2goKTtcbiAgICBxdWVyeVR5cGUub25jaGFuZ2UgPSAoKSA9PiByZWZyZXNoKCk7XG4gICAgcXVlcnlNaW5lT25seS5vbmNoYW5nZSA9ICgpID0+IHsgaWYgKG1pbmVPbmx5TGFiZWwpIG1pbmVPbmx5TGFiZWwuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJywgcXVlcnlNaW5lT25seS5jaGVja2VkKTsgcmVmcmVzaCgpOyB9O1xuICAgIGlmIChtaW5lT25seUxhYmVsKSBtaW5lT25seUxhYmVsLmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScsIHF1ZXJ5TWluZU9ubHkuY2hlY2tlZCk7XG5cbiAgICBhd2FpdCBQcm9taXNlLmFsbChbYmFyLnVwZGF0ZSgpLCBsb2FkTWV0YWRhdGEoKV0pO1xuICAgIGF3YWl0IHJlZnJlc2goeyBxdWlldDogdHJ1ZSB9KTtcbiAgICB0aGlzLnJlZnJlc2hUaW1lciA9IHdpbmRvdy5zZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICByZWZyZXNoKHsgcXVpZXQ6IHRydWUgfSkuY2F0Y2goKCkgPT4ge30pO1xuICAgIH0sIDEwMDAwKTtcbiAgfVxuXG4gIHByaXZhdGUgY2xlYXJUaW1lcigpIHtcbiAgICBpZiAodGhpcy5yZWZyZXNoVGltZXIgIT09IG51bGwpIHtcbiAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKHRoaXMucmVmcmVzaFRpbWVyKTtcbiAgICAgIHRoaXMucmVmcmVzaFRpbWVyID0gbnVsbDtcbiAgICB9XG4gIH1cbn1cbiIsICJpbXBvcnQgeyBOZXR3b3JrTWFuYWdlciB9IGZyb20gJy4uL2NvcmUvTmV0d29ya01hbmFnZXInO1xuaW1wb3J0IHsgaHRtbCwgcXMgfSBmcm9tICcuLi91dGlscy9kb20nO1xuaW1wb3J0IHsgcmVuZGVyTmF2IH0gZnJvbSAnLi4vY29tcG9uZW50cy9OYXYnO1xuaW1wb3J0IHsgUmVhbHRpbWVDbGllbnQgfSBmcm9tICcuLi9jb3JlL1JlYWx0aW1lQ2xpZW50JztcbmltcG9ydCB7IHJlbmRlclJlc291cmNlQmFyIH0gZnJvbSAnLi4vY29tcG9uZW50cy9SZXNvdXJjZUJhcic7XG5pbXBvcnQgeyByZW5kZXJJY29uIH0gZnJvbSAnLi4vY29tcG9uZW50cy9JY29uJztcblxuZXhwb3J0IGNsYXNzIFJhbmtpbmdTY2VuZSB7XG4gIG1vdW50KHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgcm9vdC5pbm5lckhUTUwgPSAnJztcbiAgICByb290LmFwcGVuZENoaWxkKHJlbmRlck5hdigncmFua2luZycpKTtcbiAgICBjb25zdCBiYXIgPSByZW5kZXJSZXNvdXJjZUJhcigpO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQoYmFyLnJvb3QpO1xuXG4gICAgY29uc3QgdmlldyA9IGh0bWwoYFxuICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lciBncmlkLTJcIiBzdHlsZT1cImNvbG9yOiNmZmY7XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkIGZhZGUtaW5cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCIgc3R5bGU9XCJqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjthbGlnbi1pdGVtczpjZW50ZXI7XCI+XG4gICAgICAgICAgICA8aDMgc3R5bGU9XCJtYXJnaW46MDtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo4cHg7XCI+PHNwYW4gZGF0YS1pY289XCJ0cm9waHlcIj48L3NwYW4+XHU2MzkyXHU4ODRDXHU2OTlDPC9oMz5cbiAgICAgICAgICAgIDxidXR0b24gaWQ9XCJyZWZyZXNoXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIj48c3BhbiBkYXRhLWljbz1cInJlZnJlc2hcIj48L3NwYW4+XHU1MjM3XHU2NUIwPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBpZD1cIm1lXCIgc3R5bGU9XCJtYXJnaW4tdG9wOjhweDtvcGFjaXR5Oi45NTtcIj48L2Rpdj5cbiAgICAgICAgICA8ZGl2IGlkPVwibGlzdFwiIHN0eWxlPVwibWFyZ2luLXRvcDoxMnB4O2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjZweDtcIj48L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICBgKTtcbiAgICByb290LmFwcGVuZENoaWxkKHZpZXcpO1xuXG4gICAgY29uc3QgdG9rZW4gPSBOZXR3b3JrTWFuYWdlci5JLmdldFRva2VuKCk7XG4gICAgaWYgKHRva2VuKSBSZWFsdGltZUNsaWVudC5JLmNvbm5lY3QodG9rZW4pO1xuXG4gICAgY29uc3QgbWVCb3ggPSBxcyh2aWV3LCAnI21lJyk7XG4gICAgY29uc3QgbGlzdCA9IHFzKHZpZXcsICcjbGlzdCcpO1xuICAgIGNvbnN0IHJlZnJlc2hCdG4gPSBxczxIVE1MQnV0dG9uRWxlbWVudD4odmlldywgJyNyZWZyZXNoJyk7XG4gICAgY29uc3QgbW91bnRJY29ucyA9IChyb290RWw6IEVsZW1lbnQpID0+IHtcbiAgICAgIHJvb3RFbC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1pY29dJylcbiAgICAgICAgLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgICAgY29uc3QgbmFtZSA9IChlbCBhcyBIVE1MRWxlbWVudCkuZ2V0QXR0cmlidXRlKCdkYXRhLWljbycpIGFzIGFueTtcbiAgICAgICAgICB0cnkgeyBlbC5hcHBlbmRDaGlsZChyZW5kZXJJY29uKG5hbWUsIHsgc2l6ZTogMjAgfSkpOyB9IGNhdGNoIHt9XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgbW91bnRJY29ucyh2aWV3KTtcblxuICAgIGNvbnN0IGxvYWQgPSBhc3luYyAoKSA9PiB7XG4gICAgICByZWZyZXNoQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIHJlZnJlc2hCdG4uaW5uZXJIVE1MID0gJzxzcGFuIGRhdGEtaWNvPVwicmVmcmVzaFwiPjwvc3Bhbj5cdTUyMzdcdTY1QjBcdTRFMkRcdTIwMjYnO1xuICAgICAgbW91bnRJY29ucyhyZWZyZXNoQnRuKTtcbiAgICAgIGF3YWl0IGJhci51cGRhdGUoKTtcbiAgICAgIGxpc3QuaW5uZXJIVE1MID0gJyc7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykgbGlzdC5hcHBlbmRDaGlsZChodG1sKCc8ZGl2IGNsYXNzPVwic2tlbGV0b25cIj48L2Rpdj4nKSk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBtZSA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IHJhbms6IG51bWJlcjsgc2NvcmU6IG51bWJlciB9PignL3JhbmtpbmcvbWUnKTtcbiAgICAgICAgY29uc3QgdG9wID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgbGlzdDogYW55W10gfT4oJy9yYW5raW5nL3RvcD9uPTIwJyk7XG4gICAgICAgIG1lQm94LnRleHRDb250ZW50ID0gYFx1NjIxMVx1NzY4NFx1NTQwRFx1NkIyMVx1RkYxQSMke21lLnJhbmt9IFx1MDBCNyBcdTYwM0JcdTVGOTdcdTUyMDZcdUZGMUEke21lLnNjb3JlfWA7XG4gICAgICAgIGxpc3QuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIGZvciAoY29uc3QgZW50cnkgb2YgdG9wLmxpc3QpIHtcbiAgICAgICAgICBjb25zdCBtZWRhbCA9IGVudHJ5LnJhbmsgPT09IDEgPyAnXHVEODNFXHVERDQ3JyA6IGVudHJ5LnJhbmsgPT09IDIgPyAnXHVEODNFXHVERDQ4JyA6IGVudHJ5LnJhbmsgPT09IDMgPyAnXHVEODNFXHVERDQ5JyA6ICcnO1xuICAgICAgICAgIGNvbnN0IGNscyA9IGVudHJ5LnJhbmsgPD0gMyA/ICcgbGlzdC1pdGVtLS1idXknIDogJyc7XG4gICAgICAgICAgY29uc3Qgcm93ID0gaHRtbChgXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibGlzdC1pdGVtJHtjbHN9XCI+XG4gICAgICAgICAgICAgIDxzcGFuPiR7bWVkYWx9ICMke2VudHJ5LnJhbmt9PC9zcGFuPlxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT1cImZsZXg6MTtvcGFjaXR5Oi45O21hcmdpbi1sZWZ0OjEycHg7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NnB4O1wiPjxzcGFuIGRhdGEtaWNvPVwidXNlclwiPjwvc3Bhbj4ke2VudHJ5LnVzZXJJZH08L3NwYW4+XG4gICAgICAgICAgICAgIDxzdHJvbmc+JHtlbnRyeS5zY29yZX08L3N0cm9uZz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIGApO1xuICAgICAgICAgIG1vdW50SWNvbnMocm93KTtcbiAgICAgICAgICBsaXN0LmFwcGVuZENoaWxkKHJvdyk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgICBtZUJveC50ZXh0Q29udGVudCA9IGU/Lm1lc3NhZ2UgfHwgJ1x1NjM5Mlx1ODg0Q1x1Njk5Q1x1NTJBMFx1OEY3RFx1NTkzMVx1OEQyNSc7XG4gICAgICAgIGxpc3QuaW5uZXJIVE1MID0gJzxkaXYgc3R5bGU9XCJvcGFjaXR5Oi44O3RleHQtYWxpZ246Y2VudGVyO3BhZGRpbmc6MjBweDtcIj5cdTUyQTBcdThGN0RcdTU5MzFcdThEMjVcdUZGMENcdThCRjdcdTdBMERcdTU0MEVcdTkxQ0RcdThCRDU8L2Rpdj4nO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgcmVmcmVzaEJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICByZWZyZXNoQnRuLmlubmVySFRNTCA9ICc8c3BhbiBkYXRhLWljbz1cInJlZnJlc2hcIj48L3NwYW4+XHU1MjM3XHU2NUIwJztcbiAgICAgICAgbW91bnRJY29ucyhyZWZyZXNoQnRuKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHJlZnJlc2hCdG4ub25jbGljayA9ICgpID0+IGxvYWQoKTtcbiAgICBsb2FkKCk7XG4gIH1cbn1cbiIsICJsZXQgaW5qZWN0ZWQgPSBmYWxzZTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBlbnN1cmVHbG9iYWxTdHlsZXMoKSB7XHJcbiAgaWYgKGluamVjdGVkKSByZXR1cm47XHJcbiAgY29uc3QgY3NzID0gYDpyb290ey0tYmc6IzBiMTAyMDstLWJnLTI6IzBmMTUzMDstLWZnOiNmZmY7LS1tdXRlZDpyZ2JhKDI1NSwyNTUsMjU1LC43NSk7LS1ncmFkOmxpbmVhci1ncmFkaWVudCgxMzVkZWcsIzdCMkNGNSwjMkM4OUY1KTstLXBhbmVsLWdyYWQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZyxyZ2JhKDEyMyw0NCwyNDUsLjI1KSxyZ2JhKDQ0LDEzNywyNDUsLjI1KSk7LS1nbGFzczpibHVyKDEwcHgpOy0tZ2xvdzowIDhweCAyMHB4IHJnYmEoMCwwLDAsLjM1KSwwIDAgMTJweCByZ2JhKDEyMyw0NCwyNDUsLjcpOy0tcmFkaXVzLXNtOjEwcHg7LS1yYWRpdXMtbWQ6MTJweDstLXJhZGl1cy1sZzoxNnB4Oy0tZWFzZTpjdWJpYy1iZXppZXIoLjIyLC42MSwuMzYsMSk7LS1kdXI6LjI4czstLWJ1eTojMkM4OUY1Oy0tc2VsbDojRTM2NDE0Oy0tb2s6IzJlYzI3ZTstLXdhcm46I2Y2YzQ0NTstLWRhbmdlcjojZmY1YzVjOy0tcmFyaXR5LWNvbW1vbjojOWFhMGE2Oy0tcmFyaXR5LXJhcmU6IzRmZDRmNTstLXJhcml0eS1lcGljOiNiMjZiZmY7LS1yYXJpdHktbGVnZW5kYXJ5OiNmNmM0NDU7LS1jb250YWluZXItbWF4OjcyMHB4fVxyXG5odG1sLGJvZHl7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoMTIwMHB4IDYwMHB4IGF0IDUwJSAtMTAlLCByZ2JhKDEyMyw0NCwyNDUsLjEyKSwgdHJhbnNwYXJlbnQpLHZhcigtLWJnKTtjb2xvcjp2YXIoLS1mZyk7Zm9udC1mYW1pbHk6c3lzdGVtLXVpLC1hcHBsZS1zeXN0ZW0sXCJTZWdvZSBVSVwiLFwiUGluZ0ZhbmcgU0NcIixcIk1pY3Jvc29mdCBZYUhlaVwiLEFyaWFsLHNhbnMtc2VyaWZ9XHJcbmh0bWx7Y29sb3Itc2NoZW1lOmRhcmt9XHJcbi5jb250YWluZXJ7cGFkZGluZzowIDEycHh9XHJcbi5jb250YWluZXJ7bWF4LXdpZHRoOnZhcigtLWNvbnRhaW5lci1tYXgpO21hcmdpbjoxMnB4IGF1dG99XHJcbi5jYXJke3Bvc2l0aW9uOnJlbGF0aXZlO2JvcmRlci1yYWRpdXM6dmFyKC0tcmFkaXVzLWxnKTtiYWNrZ3JvdW5kOnZhcigtLXBhbmVsLWdyYWQpO2JhY2tkcm9wLWZpbHRlcjp2YXIoLS1nbGFzcyk7Ym94LXNoYWRvdzp2YXIoLS1nbG93KTtwYWRkaW5nOjEycHg7b3ZlcmZsb3c6aGlkZGVufVxyXG4vKiBuZW9uIGNvcm5lcnMgKyBzaGVlbiAqL1xyXG4uY2FyZDo6YmVmb3Jle2NvbnRlbnQ6XCJcIjtwb3NpdGlvbjphYnNvbHV0ZTtpbnNldDowO2JvcmRlci1yYWRpdXM6aW5oZXJpdDtiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudCg0MCUgMjUlIGF0IDEwMCUgMCwgcmdiYSgxMjMsNDQsMjQ1LC4xOCksIHRyYW5zcGFyZW50IDYwJSkscmFkaWFsLWdyYWRpZW50KDM1JSAyNSUgYXQgMCAxMDAlLCByZ2JhKDQ0LDEzNywyNDUsLjE2KSwgdHJhbnNwYXJlbnQgNjAlKTtwb2ludGVyLWV2ZW50czpub25lfVxyXG4uY2FyZDo6YWZ0ZXJ7Y29udGVudDpcIlwiO3Bvc2l0aW9uOmFic29sdXRlO2xlZnQ6LTMwJTt0b3A6LTEyMCU7d2lkdGg6NjAlO2hlaWdodDozMDAlO2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEyMGRlZyx0cmFuc3BhcmVudCxyZ2JhKDI1NSwyNTUsMjU1LC4xOCksdHJhbnNwYXJlbnQpO3RyYW5zZm9ybTpyb3RhdGUoOGRlZyk7b3BhY2l0eTouMjU7YW5pbWF0aW9uOmNhcmQtc2hlZW4gOXMgbGluZWFyIGluZmluaXRlO3BvaW50ZXItZXZlbnRzOm5vbmV9XHJcbkBrZXlmcmFtZXMgY2FyZC1zaGVlbnswJXt0cmFuc2Zvcm06dHJhbnNsYXRlWCgwKSByb3RhdGUoOGRlZyl9MTAwJXt0cmFuc2Zvcm06dHJhbnNsYXRlWCgxNjAlKSByb3RhdGUoOGRlZyl9fVxyXG4ucm93e2Rpc3BsYXk6ZmxleDtnYXA6OHB4O2FsaWduLWl0ZW1zOmNlbnRlcn1cclxuLmNhcmQgaW5wdXQsLmNhcmQgYnV0dG9ue2JveC1zaXppbmc6Ym9yZGVyLWJveDtvdXRsaW5lOm5vbmV9XHJcbi5jYXJkIGlucHV0e2JhY2tncm91bmQ6cmdiYSgyNTUsMjU1LDI1NSwuMDgpO2JvcmRlcjowO2JvcmRlci1yYWRpdXM6dmFyKC0tcmFkaXVzLW1kKTtjb2xvcjp2YXIoLS1mZyk7cGFkZGluZzoxMHB4O21hcmdpbjo4cHggMDthcHBlYXJhbmNlOm5vbmU7LXdlYmtpdC1hcHBlYXJhbmNlOm5vbmU7YmFja2dyb3VuZC1jbGlwOnBhZGRpbmctYm94O3BvaW50ZXItZXZlbnRzOmF1dG87dG91Y2gtYWN0aW9uOm1hbmlwdWxhdGlvbn1cclxuLmNhcmQgc2VsZWN0LmlucHV0LCBzZWxlY3QuaW5wdXR7YmFja2dyb3VuZDpyZ2JhKDI1NSwyNTUsMjU1LC4wOCk7Y29sb3I6dmFyKC0tZmcpO2JvcmRlcjowO2JvcmRlci1yYWRpdXM6dmFyKC0tcmFkaXVzLW1kKTtwYWRkaW5nOjEwcHg7bWFyZ2luOjhweCAwO2FwcGVhcmFuY2U6bm9uZTstd2Via2l0LWFwcGVhcmFuY2U6bm9uZTtiYWNrZ3JvdW5kLWNsaXA6cGFkZGluZy1ib3h9XHJcbi5jYXJkIHNlbGVjdC5pbnB1dCBvcHRpb24sIHNlbGVjdC5pbnB1dCBvcHRpb257YmFja2dyb3VuZDojMGIxMDIwO2NvbG9yOiNmZmZ9XHJcbi5jYXJkIHNlbGVjdC5pbnB1dDpmb2N1cywgc2VsZWN0LmlucHV0OmZvY3Vze291dGxpbmU6MnB4IHNvbGlkIHJnYmEoMTIzLDQ0LDI0NSwuNDUpfVxyXG4uY2FyZCBidXR0b257d2lkdGg6MTAwJTtib3JkZXItcmFkaXVzOnZhcigtLXJhZGl1cy1tZCl9XHJcbi5idG57cG9zaXRpb246cmVsYXRpdmU7b3ZlcmZsb3c6aGlkZGVuO3BhZGRpbmc6MTBweCAxNHB4O2JvcmRlcjowO2JvcmRlci1yYWRpdXM6dmFyKC0tcmFkaXVzLW1kKTtjb2xvcjojZmZmO3RyYW5zaXRpb246dHJhbnNmb3JtIHZhcigtLWR1cikgdmFyKC0tZWFzZSksYm94LXNoYWRvdyB2YXIoLS1kdXIpIHZhcigtLWVhc2UpLGZpbHRlciB2YXIoLS1kdXIpIHZhcigtLWVhc2UpfVxyXG4uYnRuIC5pY29ue21hcmdpbi1yaWdodDo2cHh9XHJcbi5idG46YWN0aXZle3RyYW5zZm9ybTp0cmFuc2xhdGVZKDFweCkgc2NhbGUoLjk5KX1cclxuLmJ0bjo6YWZ0ZXJ7Y29udGVudDpcIlwiO3Bvc2l0aW9uOmFic29sdXRlO2luc2V0OjA7b3BhY2l0eTowO2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDExNWRlZyx0cmFuc3BhcmVudCxyZ2JhKDI1NSwyNTUsMjU1LC4yNSksdHJhbnNwYXJlbnQgNTUlKTt0cmFuc2Zvcm06dHJhbnNsYXRlWCgtNjAlKTt0cmFuc2l0aW9uOm9wYWNpdHkgdmFyKC0tZHVyKSB2YXIoLS1lYXNlKSwgdHJhbnNmb3JtIHZhcigtLWR1cikgdmFyKC0tZWFzZSk7cG9pbnRlci1ldmVudHM6bm9uZX1cclxuLmJ0bjpob3Zlcjo6YWZ0ZXJ7b3BhY2l0eTouOTt0cmFuc2Zvcm06dHJhbnNsYXRlWCgwKX1cclxuLmJ0bjpob3ZlcntmaWx0ZXI6c2F0dXJhdGUoMTEwJSl9XHJcbi5idG4tcHJpbWFyeXtiYWNrZ3JvdW5kOnZhcigtLWdyYWQpO2JveC1zaGFkb3c6dmFyKC0tZ2xvdyl9XHJcbi5idG4tZW5lcmd5e3Bvc2l0aW9uOnJlbGF0aXZlO2FuaW1hdGlvbjpidG4tcHVsc2UgMnMgZWFzZS1pbi1vdXQgaW5maW5pdGV9XHJcbi5idG4tZW5lcmd5OjpiZWZvcmV7Y29udGVudDpcIlwiO3Bvc2l0aW9uOmFic29sdXRlO2luc2V0Oi0ycHg7Ym9yZGVyLXJhZGl1czppbmhlcml0O2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZyxyZ2JhKDEyMyw0NCwyNDUsLjYpLHJnYmEoNDQsMTM3LDI0NSwuNikpO2ZpbHRlcjpibHVyKDhweCk7ei1pbmRleDotMTtvcGFjaXR5Oi42O2FuaW1hdGlvbjplbmVyZ3ktcmluZyAycyBlYXNlLWluLW91dCBpbmZpbml0ZTtwb2ludGVyLWV2ZW50czpub25lfVxyXG5Aa2V5ZnJhbWVzIGJ0bi1wdWxzZXswJSwxMDAle3RyYW5zZm9ybTpzY2FsZSgxKX01MCV7dHJhbnNmb3JtOnNjYWxlKDEuMDIpfX1cclxuQGtleWZyYW1lcyBlbmVyZ3ktcmluZ3swJSwxMDAle29wYWNpdHk6LjQ7ZmlsdGVyOmJsdXIoOHB4KX01MCV7b3BhY2l0eTouODtmaWx0ZXI6Ymx1cigxMnB4KX19XHJcbi5idG4tYnV5e2JhY2tncm91bmQ6dmFyKC0tYnV5KX1cclxuLmJ0bi1zZWxse2JhY2tncm91bmQ6dmFyKC0tc2VsbCl9XHJcbi5idG4tZ2hvc3R7YmFja2dyb3VuZDpyZ2JhKDI1NSwyNTUsMjU1LC4wOCl9XHJcbi5pbnB1dHt3aWR0aDoxMDAlO3BhZGRpbmc6MTBweDtib3JkZXI6MDtib3JkZXItcmFkaXVzOnZhcigtLXJhZGl1cy1tZCk7YmFja2dyb3VuZDpyZ2JhKDI1NSwyNTUsMjU1LC4wOCk7Y29sb3I6dmFyKC0tZmcpO3BvaW50ZXItZXZlbnRzOmF1dG87dG91Y2gtYWN0aW9uOm1hbmlwdWxhdGlvbjt1c2VyLXNlbGVjdDp0ZXh0Oy13ZWJraXQtdXNlci1zZWxlY3Q6dGV4dH1cclxuLnBpbGx7cGFkZGluZzoycHggOHB4O2JvcmRlci1yYWRpdXM6OTk5cHg7YmFja2dyb3VuZDpyZ2JhKDI1NSwyNTUsMjU1LC4wOCk7Zm9udC1zaXplOjEycHg7Y3Vyc29yOnBvaW50ZXI7dHJhbnNpdGlvbjpiYWNrZ3JvdW5kIC4zcyBlYXNlfVxyXG4ucGlsbC5waWxsLXJ1bm5pbmd7YW5pbWF0aW9uOnBpbGwtYnJlYXRoZSAycyBlYXNlLWluLW91dCBpbmZpbml0ZX1cclxuQGtleWZyYW1lcyBwaWxsLWJyZWF0aGV7MCUsMTAwJXtiYWNrZ3JvdW5kOnJnYmEoNDYsMTk0LDEyNiwuMjUpO2JveC1zaGFkb3c6MCAwIDhweCByZ2JhKDQ2LDE5NCwxMjYsLjMpfTUwJXtiYWNrZ3JvdW5kOnJnYmEoNDYsMTk0LDEyNiwuMzUpO2JveC1zaGFkb3c6MCAwIDEycHggcmdiYSg0NiwxOTQsMTI2LC41KX19XHJcbi5waWxsLnBpbGwtY29sbGFwc2Vke2FuaW1hdGlvbjpwaWxsLWFsZXJ0IDFzIGVhc2UtaW4tb3V0IGluZmluaXRlfVxyXG5Aa2V5ZnJhbWVzIHBpbGwtYWxlcnR7MCUsMTAwJXtiYWNrZ3JvdW5kOnJnYmEoMjU1LDkyLDkyLC4yNSk7Ym94LXNoYWRvdzowIDAgOHB4IHJnYmEoMjU1LDkyLDkyLC4zKX01MCV7YmFja2dyb3VuZDpyZ2JhKDI1NSw5Miw5MiwuNDUpO2JveC1zaGFkb3c6MCAwIDE2cHggcmdiYSgyNTUsOTIsOTIsLjYpfX1cclxuLnBpbGwuYWN0aXZle2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZywgcmdiYSgxMjMsNDQsMjQ1LC4zNSksIHJnYmEoNDQsMTM3LDI0NSwuMjgpKTtib3gtc2hhZG93OnZhcigtLWdsb3cpfVxyXG4uc2NlbmUtaGVhZGVye2Rpc3BsYXk6ZmxleDtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjthbGlnbi1pdGVtczpmbGV4LWVuZDtnYXA6MTJweDttYXJnaW4tYm90dG9tOjhweH1cclxuLnNjZW5lLWhlYWRlciBoMXttYXJnaW46MDtmb250LXNpemU6MjBweH1cclxuLnNjZW5lLWhlYWRlciBwe21hcmdpbjowO29wYWNpdHk6Ljg1fVxyXG4uc3RhdHN7ZGlzcGxheTpmbGV4O2dhcDoxMHB4fVxyXG4uc3RhdHtmbGV4OjE7bWluLXdpZHRoOjA7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTgwZGVnLHJnYmEoMjU1LDI1NSwyNTUsLjA2KSxyZ2JhKDI1NSwyNTUsMjU1LC4wMykpO2JvcmRlci1yYWRpdXM6MTJweDtwYWRkaW5nOjEwcHg7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6MTBweH1cclxuLnN0YXQgLmljb3tmb250LXNpemU6MThweDtmaWx0ZXI6ZHJvcC1zaGFkb3coMCAwIDhweCByZ2JhKDEyMyw0NCwyNDUsLjM1KSk7dHJhbnNpdGlvbjp0cmFuc2Zvcm0gLjNzIGVhc2V9XHJcbi5wdWxzZS1pY29ue2FuaW1hdGlvbjppY29uLXB1bHNlIC42cyBlYXNlfVxyXG5Aa2V5ZnJhbWVzIGljb24tcHVsc2V7MCUsMTAwJXt0cmFuc2Zvcm06c2NhbGUoMSl9NTAle3RyYW5zZm9ybTpzY2FsZSgxLjMpIHJvdGF0ZSg1ZGVnKX19XHJcbi5zdGF0IC52YWx7Zm9udC13ZWlnaHQ6NzAwO2ZvbnQtc2l6ZToxNnB4fVxyXG4uc3RhdCAubGFiZWx7b3BhY2l0eTouODU7Zm9udC1zaXplOjEycHh9XHJcbi5ldmVudC1mZWVke21heC1oZWlnaHQ6MjQwcHg7b3ZlcmZsb3c6YXV0bztkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDo2cHh9XHJcbi5ldmVudC1mZWVkIC5ldmVudHtvcGFjaXR5Oi45O2ZvbnQtZmFtaWx5Om1vbm9zcGFjZTtmb250LXNpemU6MTJweH1cclxuLm1haW4tc2NyZWVue3Bvc2l0aW9uOnJlbGF0aXZlO3BhZGRpbmc6MTJweCAwIDM2cHg7bWluLWhlaWdodDoxMDB2aH1cclxuLm1haW4tc3RhY2t7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6MTZweH1cclxuLm1pbmUtY2FyZHttaW4taGVpZ2h0OmNhbGMoMTAwdmggLSAxNjBweCk7cGFkZGluZzoyNHB4IDIwcHg7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6MjBweDtib3JkZXItcmFkaXVzOjIwcHh9XHJcbkBtZWRpYSAobWluLXdpZHRoOjU4MHB4KXsubWluZS1jYXJke21pbi1oZWlnaHQ6NjIwcHg7cGFkZGluZzoyOHB4IDI2cHh9fVxyXG4ubWluZS1oZWFkZXJ7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjtnYXA6MTJweH1cclxuLm1pbmUtdGl0bGV7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6MTBweDtmb250LXNpemU6MThweDtmb250LXdlaWdodDo2MDA7bGV0dGVyLXNwYWNpbmc6LjA0ZW07dGV4dC1zaGFkb3c6MCAycHggMTJweCByZ2JhKDE4LDEwLDQ4LC42KX1cclxuLm1pbmUtdGl0bGUgLmljb257ZmlsdGVyOmRyb3Atc2hhZG93KDAgMCAxMnB4IHJnYmEoMTI0LDYwLDI1NSwuNTUpKX1cclxuLm1pbmUtY2hpcHN7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6OHB4fVxyXG4ubWluZS1jaGlwcyAucGlsbHtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo2cHg7Zm9udC1zaXplOjEycHg7YmFja2dyb3VuZDpyZ2JhKDE1LDI0LDU2LC41NSk7Ym94LXNoYWRvdzppbnNldCAwIDAgMCAxcHggcmdiYSgxMjMsNDQsMjQ1LC4yNSl9XHJcbi5taW5lLWdyaWR7ZGlzcGxheTpncmlkO2dhcDoxOHB4fVxyXG5AbWVkaWEgKG1pbi13aWR0aDo2NDBweCl7Lm1pbmUtZ3JpZHtncmlkLXRlbXBsYXRlLWNvbHVtbnM6MjIwcHggMWZyO2FsaWduLWl0ZW1zOmNlbnRlcn19XHJcbi5taW5lLWdhdWdle3Bvc2l0aW9uOnJlbGF0aXZlO2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OmNlbnRlcjtwYWRkaW5nOjhweCAwfVxyXG4ubWluZS1nYXVnZSAucmluZ3t3aWR0aDoyMDBweDtoZWlnaHQ6MjAwcHg7Ym9yZGVyLXJhZGl1czo1MCU7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO2JhY2tncm91bmQ6Y29uaWMtZ3JhZGllbnQoIzdCMkNGNSAwZGVnLHJnYmEoMjU1LDI1NSwyNTUsLjA4KSAwZGVnKTtib3gtc2hhZG93Omluc2V0IDAgMCAzMHB4IHJnYmEoMTIzLDQ0LDI0NSwuMjgpLDAgMjRweCA0OHB4IHJnYmEoMTIsOCw0MiwuNTUpfVxyXG4ubWluZS1nYXVnZSAucmluZzo6YmVmb3Jle2NvbnRlbnQ6XCJcIjtwb3NpdGlvbjphYnNvbHV0ZTtpbnNldDoxOCU7Ym9yZGVyLXJhZGl1czo1MCU7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoY2lyY2xlIGF0IDUwJSAyOCUscmdiYSgxMjMsNDQsMjQ1LC40NSkscmdiYSgxMiwyMCw0NiwuOTIpIDcwJSk7Ym94LXNoYWRvdzppbnNldCAwIDE0cHggMjhweCByZ2JhKDAsMCwwLC40OCk7cG9pbnRlci1ldmVudHM6bm9uZX1cclxuLm1pbmUtZ2F1Z2UgLnJpbmctY29yZXtwb3NpdGlvbjpyZWxhdGl2ZTtkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NHB4O2ZvbnQtd2VpZ2h0OjYwMH1cclxuLm1pbmUtZ2F1Z2UgLnJpbmctY29yZSBzcGFue2ZvbnQtc2l6ZToyMnB4fVxyXG4ubWluZS1nYXVnZSAucmluZy1jb3JlIHNtYWxse2ZvbnQtc2l6ZToxMnB4O2xldHRlci1zcGFjaW5nOi4xMmVtO29wYWNpdHk6Ljc1O3RleHQtdHJhbnNmb3JtOnVwcGVyY2FzZX1cclxuLnJpbmctZ2xvd3twb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDoyMDBweDtoZWlnaHQ6MjAwcHg7Ym9yZGVyLXJhZGl1czo1MCU7ZmlsdGVyOmJsdXIoMzJweCk7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoY2lyY2xlLHJnYmEoMTIzLDQ0LDI0NSwuNDgpLHJnYmEoNDQsMTM3LDI0NSwuMSkpO29wYWNpdHk6LjY7YW5pbWF0aW9uOm1pbmUtZ2xvdyA5cyBlYXNlLWluLW91dCBpbmZpbml0ZX1cclxuLnJpbmctZ2xvdy1ie2FuaW1hdGlvbi1kZWxheTotNC41cztiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudChjaXJjbGUscmdiYSg0NCwxMzcsMjQ1LC40NSksdHJhbnNwYXJlbnQgNjUlKX1cclxuLnJpbmctcHVsc2V7YW5pbWF0aW9uOnJpbmctZmxhc2ggLjZzIGVhc2UhaW1wb3J0YW50fVxyXG5Aa2V5ZnJhbWVzIHJpbmctZmxhc2h7MCUsMTAwJXtib3gtc2hhZG93Omluc2V0IDAgMCAzMHB4IHJnYmEoMTIzLDQ0LDI0NSwuMjgpLDAgMjRweCA0OHB4IHJnYmEoMTIsOCw0MiwuNTUpfTUwJXtib3gtc2hhZG93Omluc2V0IDAgMCA1MHB4IHJnYmEoMjQ2LDE5Niw2OSwuOCksMCAyNHB4IDY4cHggcmdiYSgyNDYsMTk2LDY5LC41KSwwIDAgODBweCByZ2JhKDI0NiwxOTYsNjksLjQpfX1cclxuLnJpbmctZnVsbHthbmltYXRpb246cmluZy1nbG93LWZ1bGwgMnMgZWFzZS1pbi1vdXQgaW5maW5pdGUhaW1wb3J0YW50fVxyXG5Aa2V5ZnJhbWVzIHJpbmctZ2xvdy1mdWxsezAlLDEwMCV7Ym94LXNoYWRvdzppbnNldCAwIDAgNDBweCByZ2JhKDI0NiwxOTYsNjksLjUpLDAgMjRweCA0OHB4IHJnYmEoMjQ2LDE5Niw2OSwuMzUpLDAgMCA2MHB4IHJnYmEoMjQ2LDE5Niw2OSwuMyl9NTAle2JveC1zaGFkb3c6aW5zZXQgMCAwIDYwcHggcmdiYSgyNDYsMTk2LDY5LC43KSwwIDI0cHggNjhweCByZ2JhKDI0NiwxOTYsNjksLjUpLDAgMCA4MHB4IHJnYmEoMjQ2LDE5Niw2OSwuNSl9fVxyXG4ubWlsZXN0b25lLXB1bHNle2FuaW1hdGlvbjptaWxlc3RvbmUtcmluZyAxcyBlYXNlfVxyXG5Aa2V5ZnJhbWVzIG1pbGVzdG9uZS1yaW5nezAle3RyYW5zZm9ybTpzY2FsZSgxKX0zMCV7dHJhbnNmb3JtOnNjYWxlKDEuMDgpfTYwJXt0cmFuc2Zvcm06c2NhbGUoLjk4KX0xMDAle3RyYW5zZm9ybTpzY2FsZSgxKX19XHJcbkBrZXlmcmFtZXMgbWluZS1nbG93ezAlLDEwMCV7dHJhbnNmb3JtOnNjYWxlKC45Mik7b3BhY2l0eTouNDV9NTAle3RyYW5zZm9ybTpzY2FsZSgxLjA1KTtvcGFjaXR5Oi44fX1cclxuLm1pbmUtcHJvZ3Jlc3N7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6MTRweH1cclxuLm1pbmUtcHJvZ3Jlc3MtbWV0YXtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6ZmxleC1lbmQ7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47Zm9udC1zaXplOjE0cHg7bGV0dGVyLXNwYWNpbmc6LjAyZW19XHJcbi5taW5lLXByb2dyZXNzLXRyYWNre3Bvc2l0aW9uOnJlbGF0aXZlO2hlaWdodDoxMnB4O2JvcmRlci1yYWRpdXM6OTk5cHg7YmFja2dyb3VuZDpyZ2JhKDI1NSwyNTUsMjU1LC4xKTtvdmVyZmxvdzpoaWRkZW47Ym94LXNoYWRvdzppbnNldCAwIDAgMTRweCByZ2JhKDEyMyw0NCwyNDUsLjI4KX1cclxuLm1pbmUtcHJvZ3Jlc3MtZmlsbHtoZWlnaHQ6MTAwJTt3aWR0aDowO2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDkwZGVnLCM3QjJDRjUsIzJDODlGNSk7Ym94LXNoYWRvdzowIDAgMTZweCByZ2JhKDEyMyw0NCwyNDUsLjY1KTt0cmFuc2l0aW9uOndpZHRoIC4zNXMgdmFyKC0tZWFzZSk7cG9zaXRpb246cmVsYXRpdmU7b3ZlcmZsb3c6aGlkZGVufVxyXG4ubWluZS1wcm9ncmVzcy1maWxsOjphZnRlcntjb250ZW50OlwiXCI7cG9zaXRpb246YWJzb2x1dGU7dG9wOjA7bGVmdDotMTAwJTt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDkwZGVnLHRyYW5zcGFyZW50LHJnYmEoMjU1LDI1NSwyNTUsLjMpLHRyYW5zcGFyZW50KTthbmltYXRpb246cHJvZ3Jlc3Mtd2F2ZSAycyBsaW5lYXIgaW5maW5pdGU7cG9pbnRlci1ldmVudHM6bm9uZX1cclxuQGtleWZyYW1lcyBwcm9ncmVzcy13YXZlezAle2xlZnQ6LTEwMCV9MTAwJXtsZWZ0OjIwMCV9fVxyXG4ubWluZS1zdGF0dXN7bWluLWhlaWdodDoyMnB4O2ZvbnQtc2l6ZToxM3B4O29wYWNpdHk6Ljl9XHJcbi5taW5lLWFjdGlvbnMtZ3JpZHtkaXNwbGF5OmdyaWQ7Z2FwOjEycHg7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOnJlcGVhdCgyLG1pbm1heCgwLDFmcikpfVxyXG4ubWluZS1hY3Rpb25zLWdyaWQgLmJ0bntoZWlnaHQ6NDhweDtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpjZW50ZXI7Zm9udC1zaXplOjE1cHg7Z2FwOjhweH1cclxuLm1pbmUtYWN0aW9ucy1ncmlkIC5zcGFuLTJ7Z3JpZC1jb2x1bW46c3BhbiAyfVxyXG5AbWVkaWEgKG1pbi13aWR0aDo2ODBweCl7Lm1pbmUtYWN0aW9ucy1ncmlke2dyaWQtdGVtcGxhdGUtY29sdW1uczpyZXBlYXQoMyxtaW5tYXgoMCwxZnIpKX0ubWluZS1hY3Rpb25zLWdyaWQgLnNwYW4tMntncmlkLWNvbHVtbjpzcGFuIDN9fVxyXG4ubWluZS1mZWVke3Bvc2l0aW9uOnJlbGF0aXZlO2JvcmRlci1yYWRpdXM6MTZweDtiYWNrZ3JvdW5kOnJnYmEoMTIsMjAsNDQsLjU1KTtwYWRkaW5nOjE0cHggMTJweDtib3gtc2hhZG93Omluc2V0IDAgMCAyNHB4IHJnYmEoMTIzLDQ0LDI0NSwuMTIpO2JhY2tkcm9wLWZpbHRlcjpibHVyKDEycHgpfVxyXG4ubWluZS1mZWVkOjpiZWZvcmV7Y29udGVudDpcIlwiO3Bvc2l0aW9uOmFic29sdXRlO2luc2V0OjA7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLHJnYmEoMTIzLDQ0LDI0NSwuMTYpLHJnYmEoNDQsMTM3LDI0NSwuMTQpIDYwJSx0cmFuc3BhcmVudCk7b3BhY2l0eTouNzU7cG9pbnRlci1ldmVudHM6bm9uZX1cclxuLm1pbmUtZmVlZCAuZXZlbnQtZmVlZHttYXgtaGVpZ2h0OjE4MHB4fVxyXG4uZXZlbnR7dHJhbnNpdGlvbjpvcGFjaXR5IC4zcyBlYXNlLCB0cmFuc2Zvcm0gLjNzIGVhc2V9XHJcbi5ldmVudC1jcml0aWNhbHtjb2xvcjojZjZjNDQ1O2ZvbnQtd2VpZ2h0OjYwMH1cclxuLmV2ZW50LXdhcm5pbmd7Y29sb3I6I2ZmNWM1Y31cclxuLmV2ZW50LXN1Y2Nlc3N7Y29sb3I6IzJlYzI3ZX1cclxuLmV2ZW50LW5vcm1hbHtjb2xvcjpyZ2JhKDI1NSwyNTUsMjU1LC45KX1cclxuLm1pbmUtaG9sb2dyYW17cG9zaXRpb246cmVsYXRpdmU7ZmxleDoxO21pbi1oZWlnaHQ6MTgwcHg7Ym9yZGVyLXJhZGl1czoxOHB4O2JhY2tncm91bmQ6cmFkaWFsLWdyYWRpZW50KDkwJSAxMjAlIGF0IDUwJSAxMDAlLHJnYmEoNDQsMTM3LDI0NSwuMzUpLHJnYmEoOCwxMiwzMCwuMykgNTUlLHRyYW5zcGFyZW50KTtvdmVyZmxvdzpoaWRkZW47bWFyZ2luLXRvcDphdXRvO2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OmNlbnRlcjtpc29sYXRpb246aXNvbGF0ZTt0cmFuc2l0aW9uOmJhY2tncm91bmQgLjVzIGVhc2V9XHJcbi5ob2xvLWlkbGV7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoOTAlIDEyMCUgYXQgNTAlIDEwMCUscmdiYSgxMjMsNDQsMjQ1LC4yNSkscmdiYSg4LDEyLDMwLC4zKSA1NSUsdHJhbnNwYXJlbnQpfVxyXG4uaG9sby1taW5pbmd7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoOTAlIDEyMCUgYXQgNTAlIDEwMCUscmdiYSg0NCwxMzcsMjQ1LC40NSkscmdiYSg4LDEyLDMwLC4zKSA1NSUsdHJhbnNwYXJlbnQpfVxyXG4uaG9sby1taW5pbmcgLm1pbmUtaG9sby1ncmlke2FuaW1hdGlvbi1kdXJhdGlvbjoxMnMhaW1wb3J0YW50fVxyXG4uaG9sby1jb2xsYXBzZWR7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoOTAlIDEyMCUgYXQgNTAlIDEwMCUscmdiYSgyNTUsOTIsOTIsLjM1KSxyZ2JhKDgsMTIsMzAsLjMpIDU1JSx0cmFuc3BhcmVudCk7YW5pbWF0aW9uOmhvbG8tZ2xpdGNoIC41cyBlYXNlIGluZmluaXRlfVxyXG5Aa2V5ZnJhbWVzIGhvbG8tZ2xpdGNoezAlLDEwMCV7dHJhbnNmb3JtOnRyYW5zbGF0ZVgoMCl9MjUle3RyYW5zZm9ybTp0cmFuc2xhdGVYKC0ycHgpfTc1JXt0cmFuc2Zvcm06dHJhbnNsYXRlWCgycHgpfX1cclxuLmNyaXRpY2FsLWZsYXNoe2FuaW1hdGlvbjpjcml0aWNhbC1idXJzdCAuNHMgZWFzZX1cclxuQGtleWZyYW1lcyBjcml0aWNhbC1idXJzdHswJXtiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudCg5MCUgMTIwJSBhdCA1MCUgMTAwJSxyZ2JhKDQ0LDEzNywyNDUsLjM1KSxyZ2JhKDgsMTIsMzAsLjMpIDU1JSx0cmFuc3BhcmVudCl9NTAle2JhY2tncm91bmQ6cmFkaWFsLWdyYWRpZW50KDkwJSAxMjAlIGF0IDUwJSAxMDAlLHJnYmEoMjQ2LDE5Niw2OSwuNjUpLHJnYmEoMjQ2LDE5Niw2OSwuMikgNTUlLHRyYW5zcGFyZW50KX0xMDAle2JhY2tncm91bmQ6cmFkaWFsLWdyYWRpZW50KDkwJSAxMjAlIGF0IDUwJSAxMDAlLHJnYmEoNDQsMTM3LDI0NSwuMzUpLHJnYmEoOCwxMiwzMCwuMykgNTUlLHRyYW5zcGFyZW50KX19XHJcbi5taW5lLWhvbG8tZ3JpZHtwb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDoxNDAlO2hlaWdodDoxNDAlO2JhY2tncm91bmQ6cmVwZWF0aW5nLWxpbmVhci1ncmFkaWVudCgwZGVnLHJnYmEoMjU1LDI1NSwyNTUsLjA4KSAwLHJnYmEoMjU1LDI1NSwyNTUsLjA4KSAxcHgsdHJhbnNwYXJlbnQgMXB4LHRyYW5zcGFyZW50IDI4cHgpLHJlcGVhdGluZy1saW5lYXItZ3JhZGllbnQoOTBkZWcscmdiYSgyNTUsMjU1LDI1NSwuMDUpIDAscmdiYSgyNTUsMjU1LDI1NSwuMDUpIDFweCx0cmFuc3BhcmVudCAxcHgsdHJhbnNwYXJlbnQgMjZweCk7b3BhY2l0eTouMjI7dHJhbnNmb3JtOnRyYW5zbGF0ZTNkKC0xMCUsMCwwKSByb3RhdGUoOGRlZyk7YW5pbWF0aW9uOmhvbG8tcGFuIDE2cyBsaW5lYXIgaW5maW5pdGV9XHJcbi5taW5lLWhvbG8tZ3JpZC5kaWFnb25hbHtvcGFjaXR5Oi4xODt0cmFuc2Zvcm06dHJhbnNsYXRlM2QoMTAlLDAsMCkgcm90YXRlKC0xNmRlZyk7YW5pbWF0aW9uLWR1cmF0aW9uOjIyc31cclxuQGtleWZyYW1lcyBob2xvLXBhbnswJXt0cmFuc2Zvcm06dHJhbnNsYXRlM2QoLTEyJSwwLDApIHJvdGF0ZSg4ZGVnKX0xMDAle3RyYW5zZm9ybTp0cmFuc2xhdGUzZCgxMiUsMCwwKSByb3RhdGUoOGRlZyl9fVxyXG4ubWluZS1ob2xvLWdsb3d7cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6NzAlO2hlaWdodDo3MCU7Ym9yZGVyLXJhZGl1czo1MCU7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoY2lyY2xlIGF0IDUwJSA0MCUscmdiYSgxMjMsNDQsMjQ1LC41NSksdHJhbnNwYXJlbnQgNzAlKTtmaWx0ZXI6Ymx1cigzMnB4KTtvcGFjaXR5Oi41NTthbmltYXRpb246aG9sby1icmVhdGhlIDEwcyBlYXNlLWluLW91dCBpbmZpbml0ZX1cclxuQGtleWZyYW1lcyBob2xvLWJyZWF0aGV7MCUsMTAwJXt0cmFuc2Zvcm06c2NhbGUoLjkpO29wYWNpdHk6LjQ1fTUwJXt0cmFuc2Zvcm06c2NhbGUoMS4wOCk7b3BhY2l0eTouODV9fVxyXG4ubWluZS1zaGFyZHtwb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDoxMjBweDtoZWlnaHQ6MTIwcHg7YmFja2dyb3VuZDpjb25pYy1ncmFkaWVudChmcm9tIDE1MGRlZyxyZ2JhKDEyMyw0NCwyNDUsLjgpLHJnYmEoNDQsMTM3LDI0NSwuMzgpLHJnYmEoMTIzLDQ0LDI0NSwuMDgpKTtjbGlwLXBhdGg6cG9seWdvbig1MCUgMCw4OCUgNDAlLDcwJSAxMDAlLDMwJSAxMDAlLDEyJSA0MCUpO29wYWNpdHk6LjI2O2ZpbHRlcjpibHVyKC40cHgpO2FuaW1hdGlvbjpzaGFyZC1mbG9hdCA4cyBlYXNlLWluLW91dCBpbmZpbml0ZX1cclxuLm1pbmUtc2hhcmQuc2hhcmQtMXt0b3A6MTglO2xlZnQ6MTYlO2FuaW1hdGlvbi1kZWxheTotMS40c31cclxuLm1pbmUtc2hhcmQuc2hhcmQtMntib3R0b206MTYlO3JpZ2h0OjIyJTthbmltYXRpb24tZGVsYXk6LTMuMnM7dHJhbnNmb3JtOnNjYWxlKC43NCl9XHJcbi5taW5lLXNoYXJkLnNoYXJkLTN7dG9wOjI2JTtyaWdodDozNCU7YW5pbWF0aW9uLWRlbGF5Oi01LjFzO3RyYW5zZm9ybTpzY2FsZSguNSkgcm90YXRlKDEyZGVnKX1cclxuQGtleWZyYW1lcyBzaGFyZC1mbG9hdHswJSwxMDAle3RyYW5zZm9ybTp0cmFuc2xhdGVZKC0xMHB4KSBzY2FsZSgxKTtvcGFjaXR5Oi4yfTUwJXt0cmFuc2Zvcm06dHJhbnNsYXRlWSgxMHB4KSBzY2FsZSgxLjA1KTtvcGFjaXR5Oi40fX1cclxuLm1haW4tYW1iaWVudHtwb3NpdGlvbjphYnNvbHV0ZTtpbnNldDowO3otaW5kZXg6LTE7cG9pbnRlci1ldmVudHM6bm9uZTtvdmVyZmxvdzpoaWRkZW59XHJcbi5tYWluLWFtYmllbnQgLmFtYmllbnQub3Jie3Bvc2l0aW9uOmFic29sdXRlO3dpZHRoOjQyMHB4O2hlaWdodDo0MjBweDtib3JkZXItcmFkaXVzOjUwJTtmaWx0ZXI6Ymx1cigxMjBweCk7b3BhY2l0eTouNDI7YW5pbWF0aW9uOmFtYmllbnQtZHJpZnQgMjZzIGVhc2UtaW4tb3V0IGluZmluaXRlfVxyXG4ubWFpbi1hbWJpZW50IC5vcmItYXtiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudChjaXJjbGUscmdiYSgxMjMsNDQsMjQ1LC42KSx0cmFuc3BhcmVudCA3MCUpO3RvcDotMTQwcHg7cmlnaHQ6LTEyMHB4fVxyXG4ubWFpbi1hbWJpZW50IC5vcmItYntiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudChjaXJjbGUscmdiYSg0NCwxMzcsMjQ1LC41NSksdHJhbnNwYXJlbnQgNzAlKTtib3R0b206LTE4MHB4O2xlZnQ6LTE4MHB4O2FuaW1hdGlvbi1kZWxheTotMTNzfVxyXG4ubWFpbi1hbWJpZW50IC5ncmlke3Bvc2l0aW9uOmFic29sdXRlO2luc2V0OjA7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoNzAlIDYwJSBhdCA1MCUgMTAwJSxyZ2JhKDI1NSwyNTUsMjU1LC4wOCksdHJhbnNwYXJlbnQgNzUlKTtvcGFjaXR5Oi4zNTttaXgtYmxlbmQtbW9kZTpzY3JlZW47YW5pbWF0aW9uOmFtYmllbnQtcHVsc2UgMThzIGVhc2UtaW4tb3V0IGluZmluaXRlfVxyXG5Aa2V5ZnJhbWVzIGFtYmllbnQtZHJpZnR7MCUsMTAwJXt0cmFuc2Zvcm06dHJhbnNsYXRlM2QoMCwwLDApIHNjYWxlKDEpfTUwJXt0cmFuc2Zvcm06dHJhbnNsYXRlM2QoOCUsIC00JSwwKSBzY2FsZSgxLjA1KX19XHJcbkBrZXlmcmFtZXMgYW1iaWVudC1wdWxzZXswJSwxMDAle29wYWNpdHk6LjI1fTUwJXtvcGFjaXR5Oi40NX19XHJcbi5mYWRlLWlue2FuaW1hdGlvbjpmYWRlLWluIC4zcyB2YXIoLS1lYXNlKX1cclxuQGtleWZyYW1lcyBmYWRlLWlue2Zyb217b3BhY2l0eTowO3RyYW5zZm9ybTp0cmFuc2xhdGVZKDRweCl9dG97b3BhY2l0eToxO3RyYW5zZm9ybTpub25lfX1cclxuLmZsYXNoe2FuaW1hdGlvbjpmbGFzaCAuOXMgZWFzZX1cclxuQGtleWZyYW1lcyBmbGFzaHswJXtib3gtc2hhZG93OjAgMCAwIHJnYmEoMjU1LDI1NSwyNTUsMCl9NDAle2JveC1zaGFkb3c6MCAwIDAgNnB4IHJnYmEoMjU1LDI1NSwyNTUsLjE1KX0xMDAle2JveC1zaGFkb3c6MCAwIDAgcmdiYSgyNTUsMjU1LDI1NSwwKX19XHJcbi5za2VsZXRvbntwb3NpdGlvbjpyZWxhdGl2ZTtvdmVyZmxvdzpoaWRkZW47YmFja2dyb3VuZDpyZ2JhKDI1NSwyNTUsMjU1LC4wOCk7Ym9yZGVyLXJhZGl1czp2YXIoLS1yYWRpdXMtbWQpO2hlaWdodDo0NHB4fVxyXG4uc2tlbGV0b246OmFmdGVye2NvbnRlbnQ6XCJcIjtwb3NpdGlvbjphYnNvbHV0ZTtpbnNldDowO3RyYW5zZm9ybTp0cmFuc2xhdGVYKC0xMDAlKTtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCg5MGRlZyx0cmFuc3BhcmVudCxyZ2JhKDI1NSwyNTUsMjU1LC4xMiksdHJhbnNwYXJlbnQpO2FuaW1hdGlvbjpzaGltbWVyIDEuMnMgaW5maW5pdGU7cG9pbnRlci1ldmVudHM6bm9uZX1cclxuQGtleWZyYW1lcyBzaGltbWVyezEwMCV7dHJhbnNmb3JtOnRyYW5zbGF0ZVgoMTAwJSl9fVxyXG4ubGlzdC1pdGVte2Rpc3BsYXk6ZmxleDtnYXA6OHB4O2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjtiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjA2KTtib3JkZXItcmFkaXVzOnZhcigtLXJhZGl1cy1tZCk7cGFkZGluZzoxMHB4fVxyXG4ubGlzdC1pdGVtLS1idXl7Ym9yZGVyLWxlZnQ6M3B4IHNvbGlkIHZhcigtLWJ1eSl9XHJcbi5saXN0LWl0ZW0tLXNlbGx7Ym9yZGVyLWxlZnQ6M3B4IHNvbGlkIHZhcigtLXNlbGwpfVxyXG4ubmF2e21heC13aWR0aDp2YXIoLS1jb250YWluZXItbWF4KTttYXJnaW46MTJweCBhdXRvIDA7ZGlzcGxheTpmbGV4O2dhcDo4cHg7ZmxleC13cmFwOndyYXA7cG9zaXRpb246c3RpY2t5O3RvcDowO3otaW5kZXg6NDA7cGFkZGluZzo2cHg7Ym9yZGVyLXJhZGl1czoxNHB4O2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDE4MGRlZyxyZ2JhKDIwLDIwLDQwLC40NSkscmdiYSgyMCwyMCw0MCwuMjUpKTtiYWNrZHJvcC1maWx0ZXI6Ymx1cigxMHB4KSBzYXR1cmF0ZSgxMjUlKTtib3JkZXI6MXB4IHNvbGlkIHJnYmEoMjU1LDI1NSwyNTUsLjA2KX1cclxuLm5hdiBhe2ZsZXg6MTtkaXNwbGF5OmZsZXg7anVzdGlmeS1jb250ZW50OmNlbnRlcjthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjZweDt0ZXh0LWFsaWduOmNlbnRlcjtwYWRkaW5nOjEwcHg7Ym9yZGVyLXJhZGl1czo5OTlweDt0ZXh0LWRlY29yYXRpb246bm9uZTtjb2xvcjojZmZmO3RyYW5zaXRpb246YmFja2dyb3VuZCB2YXIoLS1kdXIpIHZhcigtLWVhc2UpLCB0cmFuc2Zvcm0gdmFyKC0tZHVyKSB2YXIoLS1lYXNlKX1cclxuLm5hdiBhIC5pY297b3BhY2l0eTouOTV9XHJcbi5uYXYgYS5hY3RpdmV7YmFja2dyb3VuZDp2YXIoLS1ncmFkKTtib3gtc2hhZG93OnZhcigtLWdsb3cpfVxyXG4ubmF2IGE6bm90KC5hY3RpdmUpOmhvdmVye2JhY2tncm91bmQ6cmdiYSgyNTUsMjU1LDI1NSwuMDYpfVxyXG4vKiBnZW5lcmljIGljb24gKi9cclxuLmljb257ZGlzcGxheTppbmxpbmUtYmxvY2s7bGluZS1oZWlnaHQ6MDt2ZXJ0aWNhbC1hbGlnbjptaWRkbGV9XHJcbi5pY29uIHN2Z3tkaXNwbGF5OmJsb2NrO2ZpbHRlcjpkcm9wLXNoYWRvdygwIDAgOHB4IHJnYmEoMTIzLDQ0LDI0NSwuMzUpKX1cclxuLyogcmFyaXR5IGJhZGdlcyAqL1xyXG4uYmFkZ2V7ZGlzcGxheTppbmxpbmUtZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjZweDtwYWRkaW5nOjJweCA4cHg7Ym9yZGVyLXJhZGl1czo5OTlweDtmb250LXNpemU6MTJweDtsaW5lLWhlaWdodDoxO2JvcmRlcjoxcHggc29saWQgcmdiYSgyNTUsMjU1LDI1NSwuMTIpO2JhY2tncm91bmQ6cmdiYSgyNTUsMjU1LDI1NSwuMDYpfVxyXG4uYmFkZ2UgaXtkaXNwbGF5OmlubGluZS1ibG9jazt3aWR0aDo4cHg7aGVpZ2h0OjhweDtib3JkZXItcmFkaXVzOjk5OXB4fVxyXG4uYmFkZ2UucmFyaXR5LWNvbW1vbiBpe2JhY2tncm91bmQ6dmFyKC0tcmFyaXR5LWNvbW1vbil9XHJcbi5iYWRnZS5yYXJpdHktcmFyZSBpe2JhY2tncm91bmQ6dmFyKC0tcmFyaXR5LXJhcmUpfVxyXG4uYmFkZ2UucmFyaXR5LWVwaWMgaXtiYWNrZ3JvdW5kOnZhcigtLXJhcml0eS1lcGljKX1cclxuLmJhZGdlLnJhcml0eS1sZWdlbmRhcnkgaXtiYWNrZ3JvdW5kOnZhcigtLXJhcml0eS1sZWdlbmRhcnkpfVxyXG4ucmFyaXR5LW91dGxpbmUtY29tbW9ue2JveC1zaGFkb3c6MCAwIDAgMXB4IHJnYmEoMTU0LDE2MCwxNjYsLjM1KSBpbnNldCwgMCAwIDI0cHggcmdiYSgxNTQsMTYwLDE2NiwuMTUpfVxyXG4ucmFyaXR5LW91dGxpbmUtcmFyZXtib3gtc2hhZG93OjAgMCAwIDFweCByZ2JhKDc5LDIxMiwyNDUsLjQ1KSBpbnNldCwgMCAwIDI4cHggcmdiYSg3OSwyMTIsMjQ1LC4yNSl9XHJcbi5yYXJpdHktb3V0bGluZS1lcGlje2JveC1zaGFkb3c6MCAwIDAgMXB4IHJnYmEoMTc4LDEwNywyNTUsLjUpIGluc2V0LCAwIDAgMzJweCByZ2JhKDE3OCwxMDcsMjU1LC4zKX1cclxuLnJhcml0eS1vdXRsaW5lLWxlZ2VuZGFyeXtib3gtc2hhZG93OjAgMCAwIDFweCByZ2JhKDI0NiwxOTYsNjksLjYpIGluc2V0LCAwIDAgMzZweCByZ2JhKDI0NiwxOTYsNjksLjM1KX1cclxuLyogYXVyYSBjYXJkIHdyYXBwZXIgKi9cclxuLml0ZW0tY2FyZHtwb3NpdGlvbjpyZWxhdGl2ZTtib3JkZXItcmFkaXVzOnZhcigtLXJhZGl1cy1tZCk7cGFkZGluZzoxMHB4O2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDE0MGRlZyxyZ2JhKDI1NSwyNTUsMjU1LC4wNikscmdiYSgyNTUsMjU1LDI1NSwuMDQpKTtvdmVyZmxvdzpoaWRkZW59XHJcbi5pdGVtLWNhcmQ6OmJlZm9yZXtjb250ZW50OlwiXCI7cG9zaXRpb246YWJzb2x1dGU7aW5zZXQ6LTFweDtib3JkZXItcmFkaXVzOmluaGVyaXQ7cGFkZGluZzoxcHg7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLHJnYmEoMjU1LDI1NSwyNTUsLjE4KSxyZ2JhKDI1NSwyNTUsMjU1LC4wMikpOy13ZWJraXQtbWFzazpsaW5lYXItZ3JhZGllbnQoIzAwMCAwIDApIGNvbnRlbnQtYm94LGxpbmVhci1ncmFkaWVudCgjMDAwIDAgMCk7LXdlYmtpdC1tYXNrLWNvbXBvc2l0ZTp4b3I7bWFzay1jb21wb3NpdGU6ZXhjbHVkZTtwb2ludGVyLWV2ZW50czpub25lfVxyXG4uaXRlbS1jYXJkW2RhdGEtcmFyaXR5PVwiY29tbW9uXCJde2JvcmRlcjoxcHggc29saWQgcmdiYSgxNTQsMTYwLDE2NiwuMjUpfVxyXG4uaXRlbS1jYXJkW2RhdGEtcmFyaXR5PVwicmFyZVwiXXtib3JkZXI6MXB4IHNvbGlkIHJnYmEoNzksMjEyLDI0NSwuMzUpfVxyXG4uaXRlbS1jYXJkW2RhdGEtcmFyaXR5PVwiZXBpY1wiXXtib3JkZXI6MXB4IHNvbGlkIHJnYmEoMTc4LDEwNywyNTUsLjQpfVxyXG4uaXRlbS1jYXJkW2RhdGEtcmFyaXR5PVwibGVnZW5kYXJ5XCJde2JvcmRlcjoxcHggc29saWQgcmdiYSgyNDYsMTk2LDY5LC40NSl9XHJcbi51cGdyYWRlLXN1Y2Nlc3N7YW5pbWF0aW9uOnVwZ3JhZGUtZmxhc2ggMXMgZWFzZX1cclxuQGtleWZyYW1lcyB1cGdyYWRlLWZsYXNoezAle3RyYW5zZm9ybTpzY2FsZSgxKTtib3gtc2hhZG93OjAgMCAwIHJnYmEoNDYsMTk0LDEyNiwwKX0yNSV7dHJhbnNmb3JtOnNjYWxlKDEuMDIpO2JveC1zaGFkb3c6MCAwIDMwcHggcmdiYSg0NiwxOTQsMTI2LC42KSwwIDAgNjBweCByZ2JhKDQ2LDE5NCwxMjYsLjMpfTUwJXt0cmFuc2Zvcm06c2NhbGUoMSk7Ym94LXNoYWRvdzowIDAgNDBweCByZ2JhKDQ2LDE5NCwxMjYsLjgpLDAgMCA4MHB4IHJnYmEoNDYsMTk0LDEyNiwuNCl9NzUle3RyYW5zZm9ybTpzY2FsZSgxLjAxKTtib3gtc2hhZG93OjAgMCAzMHB4IHJnYmEoNDYsMTk0LDEyNiwuNiksMCAwIDYwcHggcmdiYSg0NiwxOTQsMTI2LC4zKX0xMDAle3RyYW5zZm9ybTpzY2FsZSgxKTtib3gtc2hhZG93OjAgMCAwIHJnYmEoNDYsMTk0LDEyNiwwKX19XHJcbi51cGdyYWRlLWZhaWx7YW5pbWF0aW9uOnVwZ3JhZGUtZmFpbC1mbGFzaCAxcyBlYXNlfVxyXG5Aa2V5ZnJhbWVzIHVwZ3JhZGUtZmFpbC1mbGFzaHswJXt0cmFuc2Zvcm06c2NhbGUoMSk7Ym94LXNoYWRvdzowIDAgMCByZ2JhKDI1NSw5Miw5MiwwKX0yNSV7dHJhbnNmb3JtOnNjYWxlKDAuOTgpO2JveC1zaGFkb3c6MCAwIDIwcHggcmdiYSgyNTUsOTIsOTIsLjUpLDAgMCA0MHB4IHJnYmEoMjU1LDkyLDkyLC4yKX01MCV7dHJhbnNmb3JtOnNjYWxlKDEpO2JveC1zaGFkb3c6MCAwIDMwcHggcmdiYSgyNTUsOTIsOTIsLjcpLDAgMCA1MHB4IHJnYmEoMjU1LDkyLDkyLC4zKX03NSV7dHJhbnNmb3JtOnNjYWxlKDAuOTkpO2JveC1zaGFkb3c6MCAwIDIwcHggcmdiYSgyNTUsOTIsOTIsLjUpLDAgMCA0MHB4IHJnYmEoMjU1LDkyLDkyLC4yKX0xMDAle3RyYW5zZm9ybTpzY2FsZSgxKTtib3gtc2hhZG93OjAgMCAwIHJnYmEoMjU1LDkyLDkyLDApfX1cclxuLmZyYWdtZW50LWNhcmR7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6OHB4O2JhY2tncm91bmQ6cmdiYSgyNTUsMjU1LDI1NSwuMDYpO2JvcmRlci1yYWRpdXM6MTJweDtwYWRkaW5nOjEycHg7Ym9yZGVyOjFweCBzb2xpZCByZ2JhKDEyMyw0NCwyNDUsLjI1KTt0cmFuc2l0aW9uOmFsbCAuM3MgZWFzZX1cclxuLmZyYWdtZW50LWNhcmQuY2FuLWNyYWZ0e2JvcmRlci1jb2xvcjpyZ2JhKDQ2LDE5NCwxMjYsLjUpO2JveC1zaGFkb3c6MCAwIDEycHggcmdiYSg0NiwxOTQsMTI2LC4yKX1cclxuLmZyYWdtZW50LWljb257Zm9udC1zaXplOjMycHg7dGV4dC1hbGlnbjpjZW50ZXJ9XHJcbi5mcmFnbWVudC1pbmZve2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjRweDt0ZXh0LWFsaWduOmNlbnRlcn1cclxuLmZyYWdtZW50LW5hbWV7Zm9udC1zaXplOjE0cHg7Zm9udC13ZWlnaHQ6NjAwfVxyXG4uZnJhZ21lbnQtY291bnR7Zm9udC1zaXplOjEzcHg7b3BhY2l0eTouODV9XHJcbi5idG4tc217cGFkZGluZzo2cHggMTBweDtmb250LXNpemU6MTNweDtoZWlnaHQ6YXV0b31cclxuLmFkLW92ZXJsYXl7cG9zaXRpb246Zml4ZWQ7aW5zZXQ6MDtiYWNrZ3JvdW5kOnJnYmEoMCwwLDAsLjc1KTtiYWNrZHJvcC1maWx0ZXI6Ymx1cig4cHgpO3otaW5kZXg6MTAwMDA7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO2FuaW1hdGlvbjpmYWRlLWluIC4zcyBlYXNlfVxyXG4uYWQtZGlhbG9ne21heC13aWR0aDo0MjBweDt3aWR0aDo5MCU7YmFja2dyb3VuZDp2YXIoLS1wYW5lbC1ncmFkKTtib3JkZXItcmFkaXVzOnZhcigtLXJhZGl1cy1sZyk7Ym94LXNoYWRvdzp2YXIoLS1nbG93KTtwYWRkaW5nOjI0cHg7YW5pbWF0aW9uOmZhZGUtaW4gLjNzIGVhc2V9XHJcbi5hZC1jb250ZW50e2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47YWxpZ24taXRlbXM6Y2VudGVyO2dhcDoxMnB4fVxyXG4uYWQtaWNvbntmb250LXNpemU6NDhweDtmaWx0ZXI6ZHJvcC1zaGFkb3coMCAwIDEycHggcmdiYSgxMjMsNDQsMjQ1LC42KSl9XHJcbi5hZC1wbGFjZWhvbGRlcntkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2FsaWduLWl0ZW1zOmNlbnRlcjttYXJnaW46MTJweCAwO3BhZGRpbmc6MjBweDtiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjA0KTtib3JkZXItcmFkaXVzOjEycHg7d2lkdGg6MTAwJX1cclxuLmFkLXByb2dyZXNzLXJpbmd7cG9zaXRpb246cmVsYXRpdmU7d2lkdGg6MTAwcHg7aGVpZ2h0OjEwMHB4fVxyXG4uYWQtY2lyY2xlLWJne2ZpbGw6bm9uZTtzdHJva2U6cmdiYSgyNTUsMjU1LDI1NSwuMSk7c3Ryb2tlLXdpZHRoOjh9XHJcbi5hZC1jaXJjbGUtZmd7ZmlsbDpub25lO3N0cm9rZTp1cmwoI2dyYWQpO3N0cm9rZS13aWR0aDo4O3N0cm9rZS1saW5lY2FwOnJvdW5kO3RyYW5zZm9ybTpyb3RhdGUoLTkwZGVnKTt0cmFuc2Zvcm0tb3JpZ2luOjUwJSA1MCU7dHJhbnNpdGlvbjpzdHJva2UtZGFzaG9mZnNldCAuM3MgZWFzZX1cclxuLmFkLWNvdW50ZG93bntwb3NpdGlvbjphYnNvbHV0ZTtpbnNldDowO2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OmNlbnRlcjtmb250LXNpemU6MjhweDtmb250LXdlaWdodDo3MDB9XHJcbi5hZC1hY3Rpb25ze2Rpc3BsYXk6ZmxleDtnYXA6MTJweDt3aWR0aDoxMDAlfVxyXG4vKiB2ZXJ0aWNhbCB0aW1lbGluZSAqL1xyXG4udGltZWxpbmV7cG9zaXRpb246cmVsYXRpdmU7bWFyZ2luLXRvcDo4cHg7cGFkZGluZy1sZWZ0OjE2cHh9XHJcbi50aW1lbGluZTo6YmVmb3Jle2NvbnRlbnQ6XCJcIjtwb3NpdGlvbjphYnNvbHV0ZTtsZWZ0OjZweDt0b3A6MDtib3R0b206MDt3aWR0aDoycHg7YmFja2dyb3VuZDpyZ2JhKDI1NSwyNTUsMjU1LC4xKTtwb2ludGVyLWV2ZW50czpub25lfVxyXG4udGltZWxpbmUtaXRlbXtwb3NpdGlvbjpyZWxhdGl2ZTttYXJnaW46OHB4IDAgOHB4IDB9XHJcbi50aW1lbGluZS1pdGVtIC5kb3R7cG9zaXRpb246YWJzb2x1dGU7bGVmdDotMTJweDt0b3A6MnB4O3dpZHRoOjEwcHg7aGVpZ2h0OjEwcHg7Ym9yZGVyLXJhZGl1czo5OTlweDtiYWNrZ3JvdW5kOnZhcigtLXJhcml0eS1yYXJlKTtib3gtc2hhZG93OjAgMCAxMHB4IHJnYmEoNzksMjEyLDI0NSwuNSl9XHJcbi50aW1lbGluZS1pdGVtIC50aW1le29wYWNpdHk6Ljc1O2ZvbnQtc2l6ZToxMnB4fVxyXG4udGltZWxpbmUtaXRlbSAuZGVzY3ttYXJnaW4tdG9wOjJweH1cclxuLyogYWN0aW9uIGJ1dHRvbnMgbGluZSAqL1xyXG4uYWN0aW9uc3tkaXNwbGF5OmZsZXg7Z2FwOjZweDtmbGV4LXdyYXA6d3JhcH1cclxuLyogc3VidGxlIGhvdmVyICovXHJcbi5ob3Zlci1saWZ0e3RyYW5zaXRpb246dHJhbnNmb3JtIHZhcigtLWR1cikgdmFyKC0tZWFzZSksIGJveC1zaGFkb3cgdmFyKC0tZHVyKSB2YXIoLS1lYXNlKX1cclxuLmhvdmVyLWxpZnQ6aG92ZXJ7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoLTFweCl9XHJcbi8qIHJpbmcgbWV0ZXIgKi9cclxuLnJpbmd7LS1zaXplOjExNnB4Oy0tdGhpY2s6MTBweDtwb3NpdGlvbjpyZWxhdGl2ZTt3aWR0aDp2YXIoLS1zaXplKTtoZWlnaHQ6dmFyKC0tc2l6ZSk7Ym9yZGVyLXJhZGl1czo1MCU7YmFja2dyb3VuZDpjb25pYy1ncmFkaWVudCgjN0IyQ0Y1IDBkZWcsIHJnYmEoMjU1LDI1NSwyNTUsLjA4KSAwZGVnKX1cclxuLnJpbmc6OmFmdGVye2NvbnRlbnQ6XCJcIjtwb3NpdGlvbjphYnNvbHV0ZTtpbnNldDpjYWxjKHZhcigtLXRoaWNrKSk7Ym9yZGVyLXJhZGl1czppbmhlcml0O2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDE4MGRlZyxyZ2JhKDI1NSwyNTUsMjU1LC4wNikscmdiYSgyNTUsMjU1LDI1NSwuMDIpKTtwb2ludGVyLWV2ZW50czpub25lfVxyXG4ucmluZyAubGFiZWx7cG9zaXRpb246YWJzb2x1dGU7aW5zZXQ6MDtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpjZW50ZXI7Zm9udC13ZWlnaHQ6NzAwfVxyXG4vKiB0b2FzdCAqL1xyXG4udG9hc3Qtd3JhcHtwb3NpdGlvbjpmaXhlZDtyaWdodDoxNnB4O2JvdHRvbToxNnB4O2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjhweDt6LWluZGV4Ojk5OTl9XHJcbi50b2FzdHttYXgtd2lkdGg6MzQwcHg7cGFkZGluZzoxMHB4IDEycHg7Ym9yZGVyLXJhZGl1czoxMnB4O2NvbG9yOiNmZmY7YmFja2dyb3VuZDpyZ2JhKDMwLDMwLDUwLC45Nik7Ym94LXNoYWRvdzp2YXIoLS1nbG93KTtwb3NpdGlvbjpyZWxhdGl2ZTtvdmVyZmxvdzpoaWRkZW59XHJcbi50b2FzdC5zdWNjZXNze2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDE4MGRlZyxyZ2JhKDQ2LDE5NCwxMjYsLjE2KSxyZ2JhKDMwLDMwLDUwLC45NikpfVxyXG4udG9hc3Qud2FybntiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxODBkZWcscmdiYSgyNDYsMTk2LDY5LC4xOCkscmdiYSgzMCwzMCw1MCwuOTYpKX1cclxuLnRvYXN0LmVycm9ye2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDE4MGRlZyxyZ2JhKDI1NSw5Miw5MiwuMTgpLHJnYmEoMzAsMzAsNTAsLjk2KSl9XHJcbi50b2FzdCAubGlmZXtwb3NpdGlvbjphYnNvbHV0ZTtsZWZ0OjA7Ym90dG9tOjA7aGVpZ2h0OjJweDtiYWNrZ3JvdW5kOiM3QjJDRjU7YW5pbWF0aW9uOnRvYXN0LWxpZmUgdmFyKC0tbGlmZSwzLjVzKSBsaW5lYXIgZm9yd2FyZHN9XHJcbkBrZXlmcmFtZXMgdG9hc3QtbGlmZXtmcm9te3dpZHRoOjEwMCV9dG97d2lkdGg6MH19XHJcbkBtZWRpYSAocHJlZmVycy1yZWR1Y2VkLW1vdGlvbjpyZWR1Y2Upeyp7YW5pbWF0aW9uLWR1cmF0aW9uOi4wMDFtcyFpbXBvcnRhbnQ7YW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudDoxIWltcG9ydGFudDt0cmFuc2l0aW9uLWR1cmF0aW9uOjBtcyFpbXBvcnRhbnR9fVxyXG5cclxuLyogcmVzcG9uc2l2ZSB3aWR0aCArIGRlc2t0b3AgZ3JpZCBsYXlvdXQgZm9yIGZ1bGxuZXNzICovXHJcbkBtZWRpYSAobWluLXdpZHRoOjkwMHB4KXs6cm9vdHstLWNvbnRhaW5lci1tYXg6OTIwcHh9fVxyXG5AbWVkaWEgKG1pbi13aWR0aDoxMjAwcHgpezpyb290ey0tY29udGFpbmVyLW1heDoxMDgwcHh9fVxyXG5cclxuLmNvbnRhaW5lci5ncmlkLTJ7ZGlzcGxheTpncmlkO2dyaWQtdGVtcGxhdGUtY29sdW1uczoxZnI7Z2FwOjEycHh9XHJcbkBtZWRpYSAobWluLXdpZHRoOjk4MHB4KXtcclxuICAuY29udGFpbmVyLmdyaWQtMntncmlkLXRlbXBsYXRlLWNvbHVtbnM6MWZyIDFmcjthbGlnbi1pdGVtczpzdGFydH1cclxuICAuY29udGFpbmVyLmdyaWQtMj4uY2FyZDpmaXJzdC1jaGlsZHtncmlkLWNvbHVtbjoxLy0xfVxyXG59XHJcblxyXG4vKiBkZWNvcmF0aXZlIHBhZ2Ugb3ZlcmxheXM6IGF1cm9yYSwgZ3JpZCBsaW5lcywgYm90dG9tIGdsb3cgKi9cclxuaHRtbDo6YmVmb3Jle2NvbnRlbnQ6XCJcIjtwb3NpdGlvbjpmaXhlZDtpbnNldDowO3BvaW50ZXItZXZlbnRzOm5vbmU7ei1pbmRleDotMjtvcGFjaXR5Oi4wMzU7YmFja2dyb3VuZC1pbWFnZTpsaW5lYXItZ3JhZGllbnQocmdiYSgyNTUsMjU1LDI1NSwuMDQpIDFweCwgdHJhbnNwYXJlbnQgMXB4KSxsaW5lYXItZ3JhZGllbnQoOTBkZWcsIHJnYmEoMjU1LDI1NSwyNTUsLjA0KSAxcHgsIHRyYW5zcGFyZW50IDFweCk7YmFja2dyb3VuZC1zaXplOjI0cHggMjRweH1cclxuYm9keTo6YmVmb3Jle2NvbnRlbnQ6XCJcIjtwb3NpdGlvbjpmaXhlZDtyaWdodDotMTB2dzt0b3A6LTE4dmg7d2lkdGg6NzB2dztoZWlnaHQ6NzB2aDtwb2ludGVyLWV2ZW50czpub25lO3otaW5kZXg6LTE7ZmlsdGVyOmJsdXIoNTBweCk7b3BhY2l0eTouNTU7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoY2xvc2VzdC1zaWRlIGF0IDI1JSA0MCUsIHJnYmEoMTIzLDQ0LDI0NSwuMzUpLCB0cmFuc3BhcmVudCA2NSUpLCByYWRpYWwtZ3JhZGllbnQoY2xvc2VzdC1zaWRlIGF0IDcwJSA2MCUsIHJnYmEoNDQsMTM3LDI0NSwuMjUpLCB0cmFuc3BhcmVudCA3MCUpO21peC1ibGVuZC1tb2RlOnNjcmVlbjthbmltYXRpb246YXVyb3JhLWEgMThzIGVhc2UtaW4tb3V0IGluZmluaXRlIGFsdGVybmF0ZX1cclxuYm9keTo6YWZ0ZXJ7Y29udGVudDpcIlwiO3Bvc2l0aW9uOmZpeGVkO2xlZnQ6LTEwdnc7Ym90dG9tOi0yMnZoO3dpZHRoOjEyMHZ3O2hlaWdodDo2MHZoO3BvaW50ZXItZXZlbnRzOm5vbmU7ei1pbmRleDotMTtmaWx0ZXI6Ymx1cig2MHB4KTtvcGFjaXR5Oi43NTtiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudCgxMjB2dyA2MHZoIGF0IDUwJSAxMDAlLCByZ2JhKDQ0LDEzNywyNDUsLjIyKSwgdHJhbnNwYXJlbnQgNjUlKSwgY29uaWMtZ3JhZGllbnQoZnJvbSAyMDBkZWcgYXQgNTAlIDc1JSwgcmdiYSgxMjMsNDQsMjQ1LC4xOCksIHJnYmEoNDQsMTM3LDI0NSwuMTIpLCB0cmFuc3BhcmVudCA3MCUpO21peC1ibGVuZC1tb2RlOnNjcmVlbjthbmltYXRpb246YXVyb3JhLWIgMjJzIGVhc2UtaW4tb3V0IGluZmluaXRlIGFsdGVybmF0ZX1cclxuQGtleWZyYW1lcyBhdXJvcmEtYXswJXt0cmFuc2Zvcm06dHJhbnNsYXRlWSgwKX0xMDAle3RyYW5zZm9ybTp0cmFuc2xhdGVZKDE0cHgpfX1cclxuQGtleWZyYW1lcyBhdXJvcmEtYnswJXt0cmFuc2Zvcm06dHJhbnNsYXRlWSgwKX0xMDAle3RyYW5zZm9ybTp0cmFuc2xhdGVZKC0xMnB4KX19XHJcbmA7XHJcbiAgY29uc3Qgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xyXG4gIHN0eWxlLnNldEF0dHJpYnV0ZSgnZGF0YS11aScsICdtaW5lci1nYW1lJyk7XHJcbiAgc3R5bGUudGV4dENvbnRlbnQgPSBjc3M7XHJcbiAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XHJcbiAgaW5qZWN0ZWQgPSB0cnVlO1xyXG5cclxuICAvLyBzb2Z0IHN0YXJmaWVsZCBiYWNrZ3JvdW5kICh2ZXJ5IGxpZ2h0KVxyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBleGlzdHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1zdGFyc10nKTtcclxuICAgIGlmICghZXhpc3RzKSB7XHJcbiAgICAgIGNvbnN0IGN2cyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG4gICAgICBjdnMuc2V0QXR0cmlidXRlKCdkYXRhLXN0YXJzJywgJycpO1xyXG4gICAgICBjdnMuc3R5bGUuY3NzVGV4dCA9ICdwb3NpdGlvbjpmaXhlZDtpbnNldDowO3otaW5kZXg6LTI7b3BhY2l0eTouNDA7cG9pbnRlci1ldmVudHM6bm9uZTsnO1xyXG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGN2cyk7XHJcbiAgICAgIGNvbnN0IGN0eCA9IGN2cy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgICBjb25zdCBzdGFycyA9IEFycmF5LmZyb20oeyBsZW5ndGg6IDgwIH0sICgpID0+ICh7IHg6IE1hdGgucmFuZG9tKCksIHk6IE1hdGgucmFuZG9tKCksIHI6IE1hdGgucmFuZG9tKCkqMS4yKzAuMiwgczogTWF0aC5yYW5kb20oKSowLjgrMC4yIH0pKTtcclxuICAgICAgdHlwZSBNZXRlb3IgPSB7IHg6IG51bWJlcjsgeTogbnVtYmVyOyB2eDogbnVtYmVyOyB2eTogbnVtYmVyOyBsaWZlOiBudW1iZXI7IHR0bDogbnVtYmVyIH07XHJcbiAgICAgIGNvbnN0IG1ldGVvcnM6IE1ldGVvcltdID0gW107XHJcbiAgICAgIGNvbnN0IHNwYXduTWV0ZW9yID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHggPSBNYXRoLnJhbmRvbSgpKmN2cy53aWR0aCowLjYgKyBjdnMud2lkdGgqMC4yO1xyXG4gICAgICAgIGNvbnN0IHkgPSAtMjA7IC8vIGZyb20gdG9wXHJcbiAgICAgICAgY29uc3Qgc3BlZWQgPSAzICsgTWF0aC5yYW5kb20oKSozO1xyXG4gICAgICAgIGNvbnN0IGFuZ2xlID0gTWF0aC5QSSowLjggKyBNYXRoLnJhbmRvbSgpKjAuMjsgLy8gZGlhZ29uYWxseVxyXG4gICAgICAgIG1ldGVvcnMucHVzaCh7IHgsIHksIHZ4OiBNYXRoLmNvcyhhbmdsZSkqc3BlZWQsIHZ5OiBNYXRoLnNpbihhbmdsZSkqc3BlZWQsIGxpZmU6IDAsIHR0bDogMTIwMCArIE1hdGgucmFuZG9tKCkqODAwIH0pO1xyXG4gICAgICB9O1xyXG4gICAgICAvLyBnZW50bGUgcGxhbmV0cy9vcmJzXHJcbiAgICAgIGNvbnN0IG9yYnMgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiAyIH0sICgpID0+ICh7IHg6IE1hdGgucmFuZG9tKCksIHk6IE1hdGgucmFuZG9tKCkqMC41ICsgMC4xLCByOiBNYXRoLnJhbmRvbSgpKjgwICsgNzAsIGh1ZTogTWF0aC5yYW5kb20oKSB9KSk7XHJcbiAgICAgIGNvbnN0IGZpdCA9ICgpID0+IHsgY3ZzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7IGN2cy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7IH07XHJcbiAgICAgIGZpdCgpO1xyXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZml0KTtcclxuICAgICAgbGV0IHQgPSAwO1xyXG4gICAgICBjb25zdCBsb29wID0gKCkgPT4ge1xyXG4gICAgICAgIGlmICghY3R4KSByZXR1cm47XHJcbiAgICAgICAgdCArPSAwLjAxNjtcclxuICAgICAgICBjdHguY2xlYXJSZWN0KDAsMCxjdnMud2lkdGgsY3ZzLmhlaWdodCk7XHJcbiAgICAgICAgLy8gc29mdCBvcmJzXHJcbiAgICAgICAgZm9yIChjb25zdCBvYiBvZiBvcmJzKSB7XHJcbiAgICAgICAgICBjb25zdCB4ID0gb2IueCAqIGN2cy53aWR0aCwgeSA9IG9iLnkgKiBjdnMuaGVpZ2h0O1xyXG4gICAgICAgICAgY29uc3QgcHVsc2UgPSAoTWF0aC5zaW4odCowLjYgKyB4KjAuMDAxNSkqMC41KzAuNSkqMC4xMjtcclxuICAgICAgICAgIGNvbnN0IHJhZCA9IG9iLnIgKiAoMStwdWxzZSk7XHJcbiAgICAgICAgICBjb25zdCBncmFkID0gY3R4LmNyZWF0ZVJhZGlhbEdyYWRpZW50KHgsIHksIDAsIHgsIHksIHJhZCk7XHJcbiAgICAgICAgICBncmFkLmFkZENvbG9yU3RvcCgwLCAncmdiYSgxMTAsODAsMjU1LDAuMTApJyk7XHJcbiAgICAgICAgICBncmFkLmFkZENvbG9yU3RvcCgxLCAncmdiYSgwLDAsMCwwKScpO1xyXG4gICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGdyYWQ7XHJcbiAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICBjdHguYXJjKHgsIHksIHJhZCwgMCwgTWF0aC5QSSoyKTtcclxuICAgICAgICAgIGN0eC5maWxsKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHN0YXJzIHR3aW5rbGVcclxuICAgICAgICBmb3IgKGNvbnN0IHN0IG9mIHN0YXJzKSB7XHJcbiAgICAgICAgICBjb25zdCB4ID0gc3QueCAqIGN2cy53aWR0aCwgeSA9IHN0LnkgKiBjdnMuaGVpZ2h0O1xyXG4gICAgICAgICAgY29uc3QgdHcgPSAoTWF0aC5zaW4odCoxLjYgKyB4KjAuMDAyICsgeSowLjAwMykqMC41KzAuNSkqMC41KzAuNTtcclxuICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgIGN0eC5hcmMoeCwgeSwgc3QuciArIHR3KjAuNiwgMCwgTWF0aC5QSSoyKTtcclxuICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAncmdiYSgxODAsMjAwLDI1NSwwLjYpJztcclxuICAgICAgICAgIGN0eC5maWxsKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIG1ldGVvcnNcclxuICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA8IDAuMDE1ICYmIG1ldGVvcnMubGVuZ3RoIDwgMikgc3Bhd25NZXRlb3IoKTtcclxuICAgICAgICBmb3IgKGxldCBpPW1ldGVvcnMubGVuZ3RoLTE7IGk+PTA7IGktLSkge1xyXG4gICAgICAgICAgY29uc3QgbSA9IG1ldGVvcnNbaV07XHJcbiAgICAgICAgICBtLnggKz0gbS52eDsgbS55ICs9IG0udnk7IG0ubGlmZSArPSAxNjtcclxuICAgICAgICAgIC8vIHRyYWlsXHJcbiAgICAgICAgICBjb25zdCB0cmFpbCA9IGN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudChtLngsIG0ueSwgbS54IC0gbS52eCo4LCBtLnkgLSBtLnZ5KjgpO1xyXG4gICAgICAgICAgdHJhaWwuYWRkQ29sb3JTdG9wKDAsICdyZ2JhKDI1NSwyNTUsMjU1LDAuOSknKTtcclxuICAgICAgICAgIHRyYWlsLmFkZENvbG9yU3RvcCgxLCAncmdiYSgxNTAsMTgwLDI1NSwwKScpO1xyXG4gICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gdHJhaWw7XHJcbiAgICAgICAgICBjdHgubGluZVdpZHRoID0gMjtcclxuICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgIGN0eC5tb3ZlVG8obS54IC0gbS52eCoxMCwgbS55IC0gbS52eSoxMCk7XHJcbiAgICAgICAgICBjdHgubGluZVRvKG0ueCwgbS55KTtcclxuICAgICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICAgIGlmIChtLnkgPiBjdnMuaGVpZ2h0ICsgNDAgfHwgbS54IDwgLTQwIHx8IG0ueCA+IGN2cy53aWR0aCArIDQwIHx8IG0ubGlmZSA+IG0udHRsKSB7XHJcbiAgICAgICAgICAgIG1ldGVvcnMuc3BsaWNlKGksMSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wKTtcclxuICAgICAgfTtcclxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3ApO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2gge31cclxufVxyXG4iLCAiaW1wb3J0IHsgTG9naW5TY2VuZSB9IGZyb20gJy4vc2NlbmVzL0xvZ2luU2NlbmUnO1xuaW1wb3J0IHsgTWFpblNjZW5lIH0gZnJvbSAnLi9zY2VuZXMvTWFpblNjZW5lJztcbmltcG9ydCB7IEdhbWVNYW5hZ2VyIH0gZnJvbSAnLi9jb3JlL0dhbWVNYW5hZ2VyJztcbmltcG9ydCB7IFdhcmVob3VzZVNjZW5lIH0gZnJvbSAnLi9zY2VuZXMvV2FyZWhvdXNlU2NlbmUnO1xuaW1wb3J0IHsgUGx1bmRlclNjZW5lIH0gZnJvbSAnLi9zY2VuZXMvUGx1bmRlclNjZW5lJztcbmltcG9ydCB7IEV4Y2hhbmdlU2NlbmUgfSBmcm9tICcuL3NjZW5lcy9FeGNoYW5nZVNjZW5lJztcbmltcG9ydCB7IFJhbmtpbmdTY2VuZSB9IGZyb20gJy4vc2NlbmVzL1JhbmtpbmdTY2VuZSc7XG5pbXBvcnQgeyBlbnN1cmVHbG9iYWxTdHlsZXMgfSBmcm9tICcuL3N0eWxlcy9pbmplY3QnO1xuXG5mdW5jdGlvbiByb3V0ZVRvKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQpIHtcbiAgY29uc3QgaCA9IGxvY2F0aW9uLmhhc2ggfHwgJyMvbG9naW4nO1xuICBjb25zdCBzY2VuZSA9IGguc3BsaXQoJz8nKVswXTtcbiAgc3dpdGNoIChzY2VuZSkge1xuICAgIGNhc2UgJyMvbWFpbic6XG4gICAgICBuZXcgTWFpblNjZW5lKCkubW91bnQoY29udGFpbmVyKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJyMvd2FyZWhvdXNlJzpcbiAgICAgIG5ldyBXYXJlaG91c2VTY2VuZSgpLm1vdW50KGNvbnRhaW5lcik7XG4gICAgICBicmVhaztcbiAgICBjYXNlICcjL3BsdW5kZXInOlxuICAgICAgbmV3IFBsdW5kZXJTY2VuZSgpLm1vdW50KGNvbnRhaW5lcik7XG4gICAgICBicmVhaztcbiAgICBjYXNlICcjL2V4Y2hhbmdlJzpcbiAgICAgIG5ldyBFeGNoYW5nZVNjZW5lKCkubW91bnQoY29udGFpbmVyKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJyMvcmFua2luZyc6XG4gICAgICBuZXcgUmFua2luZ1NjZW5lKCkubW91bnQoY29udGFpbmVyKTtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICBuZXcgTG9naW5TY2VuZSgpLm1vdW50KGNvbnRhaW5lcik7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGJvb3RzdHJhcChjb250YWluZXI6IEhUTUxFbGVtZW50KSB7XG4gIC8vIFx1N0FDQlx1NTM3M1x1NkNFOFx1NTE2NVx1NjgzN1x1NUYwRlx1RkYwQ1x1OTA3Rlx1NTE0REZPVUNcdUZGMDhcdTk1RUFcdTcwQzFcdUZGMDlcbiAgZW5zdXJlR2xvYmFsU3R5bGVzKCk7XG4gIFxuICAvLyBcdTVDMURcdThCRDVcdTYwNjJcdTU5MERcdTRGMUFcdThCRERcbiAgY29uc3QgcmVzdG9yZWQgPSBhd2FpdCBHYW1lTWFuYWdlci5JLnRyeVJlc3RvcmVTZXNzaW9uKCk7XG4gIFxuICAvLyBcdTU5ODJcdTY3OUNcdTY3MDlcdTY3MDlcdTY1NDh0b2tlblx1NEUxNFx1NUY1M1x1NTI0RFx1NTcyOFx1NzY3Qlx1NUY1NVx1OTg3NVx1RkYwQ1x1OERGM1x1OEY2Q1x1NTIzMFx1NEUzQlx1OTg3NVxuICBpZiAocmVzdG9yZWQgJiYgKGxvY2F0aW9uLmhhc2ggPT09ICcnIHx8IGxvY2F0aW9uLmhhc2ggPT09ICcjL2xvZ2luJykpIHtcbiAgICBsb2NhdGlvbi5oYXNoID0gJyMvbWFpbic7XG4gIH1cbiAgXG4gIC8vIFx1NEY3Rlx1NzUyOCByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgXHU3ODZFXHU0RkREXHU2ODM3XHU1RjBGXHU1REYyXHU1RTk0XHU3NTI4XG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgcm91dGVUbyhjb250YWluZXIpO1xuICB9KTtcbiAgXG4gIHdpbmRvdy5vbmhhc2hjaGFuZ2UgPSAoKSA9PiByb3V0ZVRvKGNvbnRhaW5lcik7XG59XG5cbi8vIFx1NEZCRlx1NjM3N1x1NTQyRlx1NTJBOFx1RkYwOFx1N0Y1MVx1OTg3NVx1NzNBRlx1NTg4M1x1RkYwOVxuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICh3aW5kb3cgYXMgYW55KS5NaW5lckFwcCA9IHsgYm9vdHN0cmFwLCBHYW1lTWFuYWdlciB9O1xufVxuXG5cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7OztBQUFPLE1BQU0sa0JBQU4sTUFBTSxnQkFBZTtBQUFBLElBTTFCLGNBQWM7QUFGZCwwQkFBUSxTQUF1QjtBQUk3QixXQUFLLFFBQVEsYUFBYSxRQUFRLFlBQVk7QUFBQSxJQUNoRDtBQUFBLElBUEEsV0FBVyxJQUFvQjtBQUZqQztBQUVtQyxjQUFPLFVBQUssY0FBTCxZQUFtQixLQUFLLFlBQVksSUFBSSxnQkFBZTtBQUFBLElBQUk7QUFBQSxJQVNuRyxTQUFT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QUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtB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QSxJQUNGLFNBQVE7QUFBQSxJQUFDO0FBQUEsRUFDWDs7O0FDeFNBLFdBQVMsUUFBUSxXQUF3QjtBQUN2QyxVQUFNLElBQUksU0FBUyxRQUFRO0FBQzNCLFVBQU0sUUFBUSxFQUFFLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDNUIsWUFBUSxPQUFPO0FBQUEsTUFDYixLQUFLO0FBQ0gsWUFBSSxVQUFVLEVBQUUsTUFBTSxTQUFTO0FBQy9CO0FBQUEsTUFDRixLQUFLO0FBQ0gsWUFBSSxlQUFlLEVBQUUsTUFBTSxTQUFTO0FBQ3BDO0FBQUEsTUFDRixLQUFLO0FBQ0gsWUFBSSxhQUFhLEVBQUUsTUFBTSxTQUFTO0FBQ2xDO0FBQUEsTUFDRixLQUFLO0FBQ0gsWUFBSSxjQUFjLEVBQUUsTUFBTSxTQUFTO0FBQ25DO0FBQUEsTUFDRixLQUFLO0FBQ0gsWUFBSSxhQUFhLEVBQUUsTUFBTSxTQUFTO0FBQ2xDO0FBQUEsTUFDRjtBQUNFLFlBQUksV0FBVyxFQUFFLE1BQU0sU0FBUztBQUFBLElBQ3BDO0FBQUEsRUFDRjtBQUVBLGlCQUFzQixVQUFVLFdBQXdCO0FBRXRELHVCQUFtQjtBQUduQixVQUFNLFdBQVcsTUFBTSxZQUFZLEVBQUUsa0JBQWtCO0FBR3ZELFFBQUksYUFBYSxTQUFTLFNBQVMsTUFBTSxTQUFTLFNBQVMsWUFBWTtBQUNyRSxlQUFTLE9BQU87QUFBQSxJQUNsQjtBQUdBLDBCQUFzQixNQUFNO0FBQzFCLGNBQVEsU0FBUztBQUFBLElBQ25CLENBQUM7QUFFRCxXQUFPLGVBQWUsTUFBTSxRQUFRLFNBQVM7QUFBQSxFQUMvQztBQUdBLE1BQUksT0FBTyxXQUFXLGFBQWE7QUFDakMsSUFBQyxPQUFlLFdBQVcsRUFBRSxXQUFXLFlBQVk7QUFBQSxFQUN0RDsiLAogICJuYW1lcyI6IFsib3JpZ2luYWxIVE1MIiwgImUiLCAib3JpZ2luYWxIVE1MIiwgIm9yaWdpbmFsSFRNTCIsICJvcmlnaW5hbEhUTUwiLCAiZ3JhZCJdCn0K
