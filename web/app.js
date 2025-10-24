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
              if (target.disabled && act !== "toggle") return;
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
                const originalHTML2 = target.innerHTML;
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
                target.innerHTML = originalHTML;
                mountIcons(target);
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vZnJvbnRlbmQtc2NyaXB0cy9jb3JlL05ldHdvcmtNYW5hZ2VyLnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvY29yZS9HYW1lTWFuYWdlci50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL3V0aWxzL2RvbS50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvbXBvbmVudHMvSWNvbi50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvbXBvbmVudHMvVG9hc3QudHMiLCAiLi4vZnJvbnRlbmQtc2NyaXB0cy9zY2VuZXMvTG9naW5TY2VuZS50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvcmUvRW52LnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvY29yZS9SZWFsdGltZUNsaWVudC50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvbXBvbmVudHMvTmF2LnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvY29tcG9uZW50cy9Db3VudFVwVGV4dC50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvbXBvbmVudHMvUmVzb3VyY2VCYXIudHMiLCAiLi4vZnJvbnRlbmQtc2NyaXB0cy9zY2VuZXMvTWFpblNjZW5lLnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvc2NlbmVzL1dhcmVob3VzZVNjZW5lLnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvc2NlbmVzL1BsdW5kZXJTY2VuZS50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL3NjZW5lcy9FeGNoYW5nZVNjZW5lLnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvc2NlbmVzL1JhbmtpbmdTY2VuZS50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL3N0eWxlcy9pbmplY3QudHMiLCAiLi4vZnJvbnRlbmQtc2NyaXB0cy9BcHAudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImV4cG9ydCBjbGFzcyBOZXR3b3JrTWFuYWdlciB7XHJcbiAgcHJpdmF0ZSBzdGF0aWMgX2luc3RhbmNlOiBOZXR3b3JrTWFuYWdlcjtcclxuICBzdGF0aWMgZ2V0IEkoKTogTmV0d29ya01hbmFnZXIgeyByZXR1cm4gdGhpcy5faW5zdGFuY2UgPz8gKHRoaXMuX2luc3RhbmNlID0gbmV3IE5ldHdvcmtNYW5hZ2VyKCkpOyB9XHJcblxyXG4gIHByaXZhdGUgdG9rZW46IHN0cmluZyB8IG51bGwgPSBudWxsO1xyXG4gIFxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgLy8gXHU0RUNFIGxvY2FsU3RvcmFnZSBcdTYwNjJcdTU5MEQgdG9rZW5cclxuICAgIHRoaXMudG9rZW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYXV0aF90b2tlbicpO1xyXG4gIH1cclxuICBcclxuICBzZXRUb2tlbih0OiBzdHJpbmcgfCBudWxsKSB7IFxyXG4gICAgdGhpcy50b2tlbiA9IHQ7XHJcbiAgICBpZiAodCkge1xyXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnYXV0aF90b2tlbicsIHQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ2F1dGhfdG9rZW4nKTtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgZ2V0VG9rZW4oKTogc3RyaW5nIHwgbnVsbCB7XHJcbiAgICByZXR1cm4gdGhpcy50b2tlbjtcclxuICB9XHJcbiAgXHJcbiAgY2xlYXJUb2tlbigpIHtcclxuICAgIHRoaXMuc2V0VG9rZW4obnVsbCk7XHJcbiAgfVxyXG5cclxuICBhc3luYyByZXF1ZXN0PFQ+KHBhdGg6IHN0cmluZywgaW5pdD86IFJlcXVlc3RJbml0KTogUHJvbWlzZTxUPiB7XHJcbiAgICBjb25zdCBoZWFkZXJzOiBhbnkgPSB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsIC4uLihpbml0Py5oZWFkZXJzIHx8IHt9KSB9O1xyXG4gICAgaWYgKHRoaXMudG9rZW4pIGhlYWRlcnNbJ0F1dGhvcml6YXRpb24nXSA9IGBCZWFyZXIgJHt0aGlzLnRva2VufWA7XHJcbiAgICBcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKHRoaXMuZ2V0QmFzZSgpICsgcGF0aCwgeyAuLi5pbml0LCBoZWFkZXJzIH0pO1xyXG4gICAgICBjb25zdCBqc29uID0gYXdhaXQgcmVzLmpzb24oKTtcclxuICAgICAgXHJcbiAgICAgIC8vIDQwMSBcdTY3MkFcdTYzODhcdTY3NDNcdUZGMENcdTZFMDVcdTk2NjQgdG9rZW4gXHU1RTc2XHU4REYzXHU4RjZDXHU3NjdCXHU1RjU1XHJcbiAgICAgIGlmIChyZXMuc3RhdHVzID09PSA0MDEpIHtcclxuICAgICAgICB0aGlzLmNsZWFyVG9rZW4oKTtcclxuICAgICAgICBpZiAobG9jYXRpb24uaGFzaCAhPT0gJyMvbG9naW4nKSB7XHJcbiAgICAgICAgICBsb2NhdGlvbi5oYXNoID0gJyMvbG9naW4nO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1x1NzY3Qlx1NUY1NVx1NURGMlx1OEZDN1x1NjcxRlx1RkYwQ1x1OEJGN1x1OTFDRFx1NjVCMFx1NzY3Qlx1NUY1NScpO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICBpZiAoIXJlcy5vayB8fCBqc29uLmNvZGUgPj0gNDAwKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGpzb24ubWVzc2FnZSB8fCAnUmVxdWVzdCBFcnJvcicpO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICByZXR1cm4ganNvbi5kYXRhIGFzIFQ7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAvLyBcdTdGNTFcdTdFRENcdTk1MTlcdThCRUZcdTU5MDRcdTc0MDZcclxuICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgVHlwZUVycm9yICYmIGVycm9yLm1lc3NhZ2UuaW5jbHVkZXMoJ2ZldGNoJykpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1x1N0Y1MVx1N0VEQ1x1OEZERVx1NjNBNVx1NTkzMVx1OEQyNVx1RkYwQ1x1OEJGN1x1NjhDMFx1NjdFNVx1N0Y1MVx1N0VEQ1x1NjIxNlx1NTQwRVx1N0FFRlx1NjcwRFx1NTJBMScpO1xyXG4gICAgICB9XHJcbiAgICAgIHRocm93IGVycm9yO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0QmFzZSgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuICh3aW5kb3cgYXMgYW55KS5fX0FQSV9CQVNFX18gfHwgJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGknO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbiIsICJpbXBvcnQgeyBOZXR3b3JrTWFuYWdlciB9IGZyb20gJy4vTmV0d29ya01hbmFnZXInO1xyXG5cclxuZXhwb3J0IHR5cGUgUHJvZmlsZSA9IHsgaWQ6IHN0cmluZzsgdXNlcm5hbWU6IHN0cmluZzsgbmlja25hbWU6IHN0cmluZzsgb3JlQW1vdW50OiBudW1iZXI7IGJiQ29pbnM6IG51bWJlciB9O1xyXG5cclxuZXhwb3J0IGNsYXNzIEdhbWVNYW5hZ2VyIHtcclxuICBwcml2YXRlIHN0YXRpYyBfaW5zdGFuY2U6IEdhbWVNYW5hZ2VyO1xyXG4gIHN0YXRpYyBnZXQgSSgpOiBHYW1lTWFuYWdlciB7IHJldHVybiB0aGlzLl9pbnN0YW5jZSA/PyAodGhpcy5faW5zdGFuY2UgPSBuZXcgR2FtZU1hbmFnZXIoKSk7IH1cclxuXHJcbiAgcHJpdmF0ZSBwcm9maWxlOiBQcm9maWxlIHwgbnVsbCA9IG51bGw7XHJcbiAgZ2V0UHJvZmlsZSgpOiBQcm9maWxlIHwgbnVsbCB7IHJldHVybiB0aGlzLnByb2ZpbGU7IH1cclxuXHJcbiAgYXN5bmMgbG9naW5PclJlZ2lzdGVyKHVzZXJuYW1lOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIGNvbnN0IG5tID0gTmV0d29ya01hbmFnZXIuSTtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHIgPSBhd2FpdCBubS5yZXF1ZXN0PHsgYWNjZXNzX3Rva2VuOiBzdHJpbmc7IHVzZXI6IGFueSB9PignL2F1dGgvbG9naW4nLCB7IG1ldGhvZDogJ1BPU1QnLCBib2R5OiBKU09OLnN0cmluZ2lmeSh7IHVzZXJuYW1lLCBwYXNzd29yZCB9KSB9KTtcclxuICAgICAgbm0uc2V0VG9rZW4oci5hY2Nlc3NfdG9rZW4pO1xyXG4gICAgfSBjYXRjaCB7XHJcbiAgICAgIGNvbnN0IHIgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyBhY2Nlc3NfdG9rZW46IHN0cmluZzsgdXNlcjogYW55IH0+KCcvYXV0aC9yZWdpc3RlcicsIHsgbWV0aG9kOiAnUE9TVCcsIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgdXNlcm5hbWUsIHBhc3N3b3JkIH0pIH0pO1xyXG4gICAgICBOZXR3b3JrTWFuYWdlci5JLnNldFRva2VuKHIuYWNjZXNzX3Rva2VuKTtcclxuICAgIH1cclxuICAgIHRoaXMucHJvZmlsZSA9IGF3YWl0IG5tLnJlcXVlc3Q8UHJvZmlsZT4oJy91c2VyL3Byb2ZpbGUnKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIHRyeVJlc3RvcmVTZXNzaW9uKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgY29uc3Qgbm0gPSBOZXR3b3JrTWFuYWdlci5JO1xyXG4gICAgY29uc3QgdG9rZW4gPSBubS5nZXRUb2tlbigpO1xyXG4gICAgaWYgKCF0b2tlbikgcmV0dXJuIGZhbHNlO1xyXG4gICAgXHJcbiAgICB0cnkge1xyXG4gICAgICB0aGlzLnByb2ZpbGUgPSBhd2FpdCBubS5yZXF1ZXN0PFByb2ZpbGU+KCcvdXNlci9wcm9maWxlJyk7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSBjYXRjaCB7XHJcbiAgICAgIC8vIFRva2VuIFx1NTkzMVx1NjU0OFx1RkYwQ1x1NkUwNVx1OTY2NFxyXG4gICAgICBubS5jbGVhclRva2VuKCk7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGxvZ291dCgpIHtcclxuICAgIE5ldHdvcmtNYW5hZ2VyLkkuY2xlYXJUb2tlbigpO1xyXG4gICAgdGhpcy5wcm9maWxlID0gbnVsbDtcclxuICAgIGxvY2F0aW9uLmhhc2ggPSAnIy9sb2dpbic7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuIiwgImV4cG9ydCBmdW5jdGlvbiBodG1sKHRlbXBsYXRlOiBzdHJpbmcpOiBIVE1MRWxlbWVudCB7XHJcbiAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgZGl2LmlubmVySFRNTCA9IHRlbXBsYXRlLnRyaW0oKTtcclxuICByZXR1cm4gZGl2LmZpcnN0RWxlbWVudENoaWxkIGFzIEhUTUxFbGVtZW50O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcXM8VCBleHRlbmRzIEVsZW1lbnQgPSBIVE1MRWxlbWVudD4ocm9vdDogUGFyZW50Tm9kZSwgc2VsOiBzdHJpbmcpOiBUIHtcclxuICBjb25zdCBlbCA9IHJvb3QucXVlcnlTZWxlY3RvcihzZWwpIGFzIFQgfCBudWxsO1xyXG4gIGlmICghZWwpIHRocm93IG5ldyBFcnJvcihgTWlzc2luZyBlbGVtZW50OiAke3NlbH1gKTtcclxuICByZXR1cm4gZWwgYXMgVDtcclxufVxyXG5cclxuXHJcbiIsICJpbXBvcnQgeyBodG1sIH0gZnJvbSAnLi4vdXRpbHMvZG9tJztcblxuZXhwb3J0IHR5cGUgSWNvbk5hbWUgPVxuICB8ICdob21lJ1xuICB8ICd3YXJlaG91c2UnXG4gIHwgJ3BsdW5kZXInXG4gIHwgJ2V4Y2hhbmdlJ1xuICB8ICdyYW5raW5nJ1xuICB8ICdvcmUnXG4gIHwgJ2NvaW4nXG4gIHwgJ3BpY2snXG4gIHwgJ3JlZnJlc2gnXG4gIHwgJ3BsYXknXG4gIHwgJ3N0b3AnXG4gIHwgJ2NvbGxlY3QnXG4gIHwgJ3dyZW5jaCdcbiAgfCAnc2hpZWxkJ1xuICB8ICdsaXN0J1xuICB8ICd1c2VyJ1xuICB8ICdsb2NrJ1xuICB8ICdleWUnXG4gIHwgJ2V5ZS1vZmYnXG4gIHwgJ3N3b3JkJ1xuICB8ICd0cm9waHknXG4gIHwgJ2Nsb2NrJ1xuICB8ICdib2x0J1xuICB8ICd0cmFzaCdcbiAgfCAnY2xvc2UnXG4gIHwgJ2Fycm93LXJpZ2h0J1xuICB8ICd0YXJnZXQnXG4gIHwgJ2JveCdcbiAgfCAnaW5mbydcbiAgfCAnbG9nb3V0J1xuICB8ICd4JztcblxuZnVuY3Rpb24gZ3JhZChpZDogc3RyaW5nKSB7XG4gIHJldHVybiBgPGRlZnM+XG4gICAgPGxpbmVhckdyYWRpZW50IGlkPVwiJHtpZH1cIiB4MT1cIjBcIiB5MT1cIjBcIiB4Mj1cIjFcIiB5Mj1cIjFcIj5cbiAgICAgIDxzdG9wIG9mZnNldD1cIjAlXCIgc3RvcC1jb2xvcj1cIiM3QjJDRjVcIiAvPlxuICAgICAgPHN0b3Agb2Zmc2V0PVwiMTAwJVwiIHN0b3AtY29sb3I9XCIjMkM4OUY1XCIgLz5cbiAgICA8L2xpbmVhckdyYWRpZW50PlxuICA8L2RlZnM+YDtcbn1cblxuZnVuY3Rpb24gc3ZnV3JhcChwYXRoOiBzdHJpbmcsIHNpemUgPSAxOCwgY2xzID0gJycpOiBIVE1MRWxlbWVudCB7XG4gIGNvbnN0IGdpZCA9ICdpZy0nICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc2xpY2UoMiwgOCk7XG4gIGNvbnN0IGVsID0gaHRtbChgPHNwYW4gY2xhc3M9XCJpY29uICR7Y2xzfVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPiR7XG4gICAgYDxzdmcgd2lkdGg9XCIke3NpemV9XCIgaGVpZ2h0PVwiJHtzaXplfVwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj4ke2dyYWQoZ2lkKX0ke3BhdGgucmVwbGFjZUFsbCgnX19HUkFEX18nLCBgdXJsKCMke2dpZH0pYCl9PC9zdmc+YFxuICB9PC9zcGFuPmApO1xuICByZXR1cm4gZWw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJJY29uKG5hbWU6IEljb25OYW1lLCBvcHRzOiB7IHNpemU/OiBudW1iZXI7IGNsYXNzTmFtZT86IHN0cmluZyB9ID0ge30pIHtcbiAgY29uc3Qgc2l6ZSA9IG9wdHMuc2l6ZSA/PyAxODtcbiAgY29uc3QgY2xzID0gb3B0cy5jbGFzc05hbWUgPz8gJyc7XG4gIGNvbnN0IHN0cm9rZSA9ICdzdHJva2U9XCJfX0dSQURfX1wiIHN0cm9rZS13aWR0aD1cIjEuN1wiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiJztcbiAgY29uc3QgZmlsbCA9ICdmaWxsPVwiX19HUkFEX19cIic7XG5cbiAgc3dpdGNoIChuYW1lKSB7XG4gICAgY2FzZSAnaG9tZSc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0zIDEwLjVMMTIgM2w5IDcuNVwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk01LjUgOS41VjIxaDEzVjkuNVwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk05LjUgMjF2LTZoNXY2XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ3dhcmVob3VzZSc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0zIDlsOS01IDkgNXY5LjVjMCAxLTEgMi0yIDJINWMtMSAwLTItMS0yLTJWOXpcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNNyAxMmgxME03IDE2aDEwXCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ3BsdW5kZXInOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNNCAyMGw3LTdNMTMgMTNsNyA3TTkgNWw2IDZNMTUgNWwtNiA2XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ2V4Y2hhbmdlJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTYgOGgxMWwtMy0zTTE4IDE2SDdsMyAzXCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ3JhbmtpbmcnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNOCAxNHY2TTEyIDEwdjEwTTE2IDZ2MTRcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNMTYgNC41YTIgMiAwIDEwMC00IDIgMiAwIDAwMCA0elwiICR7ZmlsbH0vPmAgLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ29yZSc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0xMiAzbDYgNC0yIDgtNCA2LTQtNi0yLTggNi00elwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk0xMiAzbC0yIDggMiAxMCAyLTEwLTItOHpcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnY29pbic6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCI4LjVcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNOC41IDEyaDdNMTAgOWg0TTEwIDE1aDRcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAncGljayc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk00IDVjNC0zIDktMiAxMiAxTTkgMTBsLTUgNU05IDEwbDIgMk03IDEybDIgMlwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk0xMSAxMmw3IDdcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAncmVmcmVzaCc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0yMCAxMmE4IDggMCAxMC0yLjMgNS43XCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTIwIDEydjZoLTZcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAncGxheSc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk04IDZ2MTJsMTAtNi0xMC02elwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdzdG9wJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cmVjdCB4PVwiN1wiIHk9XCI3XCIgd2lkdGg9XCIxMFwiIGhlaWdodD1cIjEwXCIgcng9XCIyXCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ2NvbGxlY3QnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNMTIgNXYxMFwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk04IDExbDQgNCA0LTRcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNNSAxOWgxNFwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICd3cmVuY2gnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNMTUuNSA2YTQuNSA0LjUgMCAxMS02LjkgNS40TDMgMTdsNC42LTUuNkE0LjUgNC41IDAgMTExNS41IDZ6XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ3NoaWVsZCc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0xMiAzbDggM3Y2YTEwIDEwIDAgMDEtOCA5IDEwIDEwIDAgMDEtOC05VjZsOC0zelwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdsaXN0JzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTcgNmgxMk03IDEyaDEyTTcgMThoMTJcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNNCA2aC4wMU00IDEyaC4wMU00IDE4aC4wMVwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICd1c2VyJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTEyIDEyYTQgNCAwIDEwMC04IDQgNCAwIDAwMCA4elwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk00IDIwYTggOCAwIDAxMTYgMFwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdsb2NrJzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cmVjdCB4PVwiNVwiIHk9XCIxMFwiIHdpZHRoPVwiMTRcIiBoZWlnaHQ9XCIxMFwiIHJ4PVwiMlwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk04IDEwVjdhNCA0IDAgMTE4IDB2M1wiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdleWUnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNMiAxMnM0LTcgMTAtNyAxMCA3IDEwIDctNCA3LTEwIDctMTAtNy0xMC03elwiICR7c3Ryb2tlfS8+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIzXCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ2V5ZS1vZmYnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNMiAxMnM0LTcgMTAtNyAxMCA3IDEwIDctNCA3LTEwIDctMTAtNy0xMC03elwiICR7c3Ryb2tlfS8+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIzXCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTMgM2wxOCAxOFwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdzd29yZCc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0zIDIxbDYtNk05IDE1bDktOSAzIDMtOSA5TTE0IDZsNCA0XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ3Ryb3BoeSc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk04IDIxaDhNOSAxN2g2TTcgNGgxMHY1YTUgNSAwIDExLTEwIDBWNHpcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNNCA2aDN2MmEzIDMgMCAxMS0zLTJ6TTIwIDZoLTN2MmEzIDMgMCAwMDMtMnpcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnY2xvY2snOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiOC41XCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTEyIDd2Nmw0IDJcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnYm9sdCc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0xMyAyTDYgMTRoNWwtMSA4IDctMTJoLTVsMS04elwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICd0cmFzaCc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk00IDdoMTZNOSA3VjVoNnYyTTcgN2wxIDEzaDhsMS0xM1wiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdjbG9zZSc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk02IDZsMTIgMTJNNiAxOEwxOCA2XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ2Fycm93LXJpZ2h0JzpcbiAgICAgIHJldHVybiBzdmdXcmFwKGA8cGF0aCBkPVwiTTQgMTJoMTRNMTIgNWw3IDctNyA3XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ3RhcmdldCc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCI4LjVcIiAke3N0cm9rZX0vPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiNC41XCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTEyIDJ2M00xMiAxOXYzTTIgMTJoM00xOSAxMmgzXCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ2JveCc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPHBhdGggZD1cIk0xMiAzbDkgNS05IDUtOS01IDktNXpcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNMyA4djhsOSA1IDktNVY4XCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTEyIDEzdjhcIiAke3N0cm9rZX0vPmAsIHNpemUsIGNscyk7XG4gICAgY2FzZSAnaW5mbyc6XG4gICAgICByZXR1cm4gc3ZnV3JhcChgPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCI4LjVcIiAke3N0cm9rZX0vPjxwYXRoIGQ9XCJNMTIgMTB2NlwiICR7c3Ryb2tlfS8+PHBhdGggZD1cIk0xMiA3aC4wMVwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBjYXNlICdsb2dvdXQnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNMTQgOFY1YTEgMSAwIDAwLTEtMUg1YTEgMSAwIDAwLTEgMXYxNGExIDEgMCAwMDEgMWg4YTEgMSAwIDAwMS0xdi0zXCIgJHtzdHJva2V9Lz48cGF0aCBkPVwiTTkgMTJoMTFNMTYgOGw0IDQtNCA0XCIgJHtzdHJva2V9Lz5gLCBzaXplLCBjbHMpO1xuICAgIGNhc2UgJ3gnOlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxwYXRoIGQ9XCJNNiA2bDEyIDEyTTE4IDZMNiAxOFwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHN2Z1dyYXAoYDxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiOVwiICR7c3Ryb2tlfS8+YCwgc2l6ZSwgY2xzKTtcbiAgfVxufVxuIiwgImltcG9ydCB7IHJlbmRlckljb24gfSBmcm9tICcuL0ljb24nO1xuXG5sZXQgX2JveDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcblxuZnVuY3Rpb24gZW5zdXJlQm94KCk6IEhUTUxFbGVtZW50IHtcbiAgaWYgKF9ib3gpIHJldHVybiBfYm94O1xuICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgZGl2LmNsYXNzTmFtZSA9ICd0b2FzdC13cmFwJztcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkaXYpO1xuICBfYm94ID0gZGl2O1xuICByZXR1cm4gZGl2O1xufVxuXG50eXBlIFRvYXN0VHlwZSA9ICdpbmZvJyB8ICdzdWNjZXNzJyB8ICd3YXJuJyB8ICdlcnJvcic7XG50eXBlIFRvYXN0T3B0aW9ucyA9IHsgdHlwZT86IFRvYXN0VHlwZTsgZHVyYXRpb24/OiBudW1iZXIgfTtcblxuZXhwb3J0IGZ1bmN0aW9uIHNob3dUb2FzdCh0ZXh0OiBzdHJpbmcsIG9wdHM/OiBUb2FzdFR5cGUgfCBUb2FzdE9wdGlvbnMpIHtcbiAgY29uc3QgYm94ID0gZW5zdXJlQm94KCk7XG4gIGNvbnN0IGl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgbGV0IHR5cGU6IFRvYXN0VHlwZSB8IHVuZGVmaW5lZDtcbiAgbGV0IGR1cmF0aW9uID0gMzUwMDtcbiAgaWYgKHR5cGVvZiBvcHRzID09PSAnc3RyaW5nJykgdHlwZSA9IG9wdHM7XG4gIGVsc2UgaWYgKG9wdHMpIHsgdHlwZSA9IG9wdHMudHlwZTsgaWYgKG9wdHMuZHVyYXRpb24pIGR1cmF0aW9uID0gb3B0cy5kdXJhdGlvbjsgfVxuICBpdGVtLmNsYXNzTmFtZSA9ICd0b2FzdCcgKyAodHlwZSA/ICcgJyArIHR5cGUgOiAnJyk7XG4gIC8vIGljb24gKyB0ZXh0IGNvbnRhaW5lclxuICB0cnkge1xuICAgIGNvbnN0IHdyYXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB3cmFwLnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XG4gICAgd3JhcC5zdHlsZS5nYXAgPSAnOHB4JztcbiAgICB3cmFwLnN0eWxlLmFsaWduSXRlbXMgPSAnY2VudGVyJztcbiAgICBjb25zdCBpY29OYW1lID0gdHlwZSA9PT0gJ3N1Y2Nlc3MnID8gJ2JvbHQnIDogdHlwZSA9PT0gJ3dhcm4nID8gJ2Nsb2NrJyA6IHR5cGUgPT09ICdlcnJvcicgPyAnY2xvc2UnIDogJ2luZm8nO1xuICAgIGNvbnN0IGljb0hvc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgaWNvSG9zdC5hcHBlbmRDaGlsZChyZW5kZXJJY29uKGljb05hbWUsIHsgc2l6ZTogMTggfSkpO1xuICAgIGNvbnN0IHR4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHR4dC50ZXh0Q29udGVudCA9IHRleHQ7XG4gICAgd3JhcC5hcHBlbmRDaGlsZChpY29Ib3N0KTtcbiAgICB3cmFwLmFwcGVuZENoaWxkKHR4dCk7XG4gICAgaXRlbS5hcHBlbmRDaGlsZCh3cmFwKTtcbiAgfSBjYXRjaCB7XG4gICAgaXRlbS50ZXh0Q29udGVudCA9IHRleHQ7XG4gIH1cbiAgY29uc3QgbGlmZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2knKTtcbiAgbGlmZS5jbGFzc05hbWUgPSAnbGlmZSc7XG4gIGxpZmUuc3R5bGUuc2V0UHJvcGVydHkoJy0tbGlmZScsIGR1cmF0aW9uICsgJ21zJyk7XG4gIGl0ZW0uYXBwZW5kQ2hpbGQobGlmZSk7XG4gIGJveC5wcmVwZW5kKGl0ZW0pO1xuICAvLyBncmFjZWZ1bCBleGl0XG4gIGNvbnN0IGZhZGUgPSAoKSA9PiB7IGl0ZW0uc3R5bGUub3BhY2l0eSA9ICcwJzsgaXRlbS5zdHlsZS50cmFuc2l0aW9uID0gJ29wYWNpdHkgLjQ1cyc7IHNldFRpbWVvdXQoKCkgPT4gaXRlbS5yZW1vdmUoKSwgNDYwKTsgfTtcbiAgY29uc3QgdGltZXIgPSB3aW5kb3cuc2V0VGltZW91dChmYWRlLCBkdXJhdGlvbik7XG4gIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7IGNsZWFyVGltZW91dCh0aW1lcik7IGZhZGUoKTsgfSk7XG59XG4iLCAiaW1wb3J0IHsgR2FtZU1hbmFnZXIgfSBmcm9tICcuLi9jb3JlL0dhbWVNYW5hZ2VyJztcbmltcG9ydCB7IGh0bWwsIHFzIH0gZnJvbSAnLi4vdXRpbHMvZG9tJztcbmltcG9ydCB7IHNob3dUb2FzdCB9IGZyb20gJy4uL2NvbXBvbmVudHMvVG9hc3QnO1xuaW1wb3J0IHsgcmVuZGVySWNvbiB9IGZyb20gJy4uL2NvbXBvbmVudHMvSWNvbic7XG5cbmV4cG9ydCBjbGFzcyBMb2dpblNjZW5lIHtcbiAgbW91bnQocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICBjb25zdCB2aWV3ID0gaHRtbChgXG4gICAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyIGdyaWQtMlwiIHN0eWxlPVwiY29sb3I6I2ZmZjtcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQgZmFkZS1pblwiIHN0eWxlPVwibWF4LXdpZHRoOjQ2MHB4O21hcmdpbjo0NnB4IGF1dG87XCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInNjZW5lLWhlYWRlclwiPlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPGgxIHN0eWxlPVwiYmFja2dyb3VuZDp2YXIoLS1ncmFkKTstd2Via2l0LWJhY2tncm91bmQtY2xpcDp0ZXh0O2JhY2tncm91bmQtY2xpcDp0ZXh0O2NvbG9yOnRyYW5zcGFyZW50O2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjhweDtcIj48c3BhbiBkYXRhLWljbz1cImhvbWVcIj48L3NwYW4+XHU3N0ZGXHU1NzNBXHU2MzA3XHU2MzI1XHU0RTJEXHU1RkMzPC9oMT5cbiAgICAgICAgICAgICAgPHA+XHU3NjdCXHU1RjU1XHU1NDBFXHU4RkRCXHU1MTY1XHU0RjYwXHU3Njg0XHU4RDVCXHU1MzVBXHU3N0ZGXHU1N0NFXHUzMDAyPC9wPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGlucHV0IGlkPVwidVwiIGNsYXNzPVwiaW5wdXRcIiBwbGFjZWhvbGRlcj1cIlx1NzUyOFx1NjIzN1x1NTQwRFwiIGF1dG9jb21wbGV0ZT1cInVzZXJuYW1lXCIvPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIiBzdHlsZT1cImFsaWduLWl0ZW1zOmNlbnRlcjtcIj5cbiAgICAgICAgICAgIDxpbnB1dCBpZD1cInBcIiBjbGFzcz1cImlucHV0XCIgcGxhY2Vob2xkZXI9XCJcdTVCQzZcdTc4MDFcIiB0eXBlPVwicGFzc3dvcmRcIiBhdXRvY29tcGxldGU9XCJjdXJyZW50LXBhc3N3b3JkXCIvPlxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInJldmVhbFwiIGNsYXNzPVwiYnRuIGJ0bi1naG9zdFwiIHN0eWxlPVwibWluLXdpZHRoOjExMHB4O1wiPjxzcGFuIGRhdGEtaWNvPVwiZXllXCI+PC9zcGFuPlx1NjYzRVx1NzkzQTwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxidXR0b24gaWQ9XCJnb1wiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCIgc3R5bGU9XCJ3aWR0aDoxMDAlO21hcmdpbi10b3A6OHB4O1wiPjxzcGFuIGRhdGEtaWNvPVwiYXJyb3ctcmlnaHRcIj48L3NwYW4+XHU4RkRCXHU1MTY1XHU2RTM4XHU2MjBGPC9idXR0b24+XG4gICAgICAgICAgPGRpdiBzdHlsZT1cIm1hcmdpbi10b3A6OHB4O29wYWNpdHk6Ljc1O2ZvbnQtc2l6ZToxMnB4O1wiPlx1NjNEMFx1NzkzQVx1RkYxQVx1ODJFNVx1OEQyNlx1NjIzN1x1NEUwRFx1NUI1OFx1NTcyOFx1RkYwQ1x1NUMwNlx1ODFFQVx1NTJBOFx1NTIxQlx1NUVGQVx1NUU3Nlx1NzY3Qlx1NUY1NVx1MzAwMjwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIGApO1xuICAgIHJvb3QuaW5uZXJIVE1MID0gJyc7XG4gICAgcm9vdC5hcHBlbmRDaGlsZCh2aWV3KTtcblxuICAgIC8vIFx1NkUzMlx1NjdEM1x1NjI0MFx1NjcwOVx1NTZGRVx1NjgwN1xuICAgIHRyeSB7XG4gICAgICB2aWV3LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWljb10nKS5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICBjb25zdCBuYW1lID0gKGVsIGFzIEhUTUxFbGVtZW50KS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWNvJykgYXMgYW55O1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGVsLmFwcGVuZENoaWxkKHJlbmRlckljb24obmFtZSwgeyBzaXplOiAyMiB9KSk7XG4gICAgICAgIH0gY2F0Y2gge31cbiAgICAgIH0pO1xuICAgIH0gY2F0Y2gge31cblxuICAgIGNvbnN0IHVFbCA9IHFzPEhUTUxJbnB1dEVsZW1lbnQ+KHZpZXcsICcjdScpO1xuICAgIGNvbnN0IHBFbCA9IHFzPEhUTUxJbnB1dEVsZW1lbnQ+KHZpZXcsICcjcCcpO1xuICAgIGNvbnN0IGdvID0gcXM8SFRNTEJ1dHRvbkVsZW1lbnQ+KHZpZXcsICcjZ28nKTtcbiAgICBjb25zdCByZXZlYWwgPSBxczxIVE1MQnV0dG9uRWxlbWVudD4odmlldywgJyNyZXZlYWwnKTtcblxuICAgIC8vIFx1NEY3Rlx1NzUyOCByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgXHU3ODZFXHU0RkREXHU2RTMyXHU2N0QzXHU1QjhDXHU2MjEwXHU1NDBFXHU3QUNCXHU1MzczXHU4MDVBXHU3MTI2XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgIHVFbC5mb2N1cygpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBzdWJtaXQgPSBhc3luYyAoKSA9PiB7XG4gICAgICBpZiAoZ28uZGlzYWJsZWQpIHJldHVybjsgLy8gXHU5NjMyXHU2QjYyXHU5MUNEXHU1OTBEXHU3MEI5XHU1MUZCXG4gICAgICBcbiAgICAgIGNvbnN0IHVzZXJuYW1lID0gKHVFbC52YWx1ZSB8fCAnJykudHJpbSgpO1xuICAgICAgY29uc3QgcGFzc3dvcmQgPSAocEVsLnZhbHVlIHx8ICcnKS50cmltKCk7XG4gICAgICBpZiAoIXVzZXJuYW1lIHx8ICFwYXNzd29yZCkge1xuICAgICAgICBzaG93VG9hc3QoJ1x1OEJGN1x1NTg2Qlx1NTE5OVx1NzUyOFx1NjIzN1x1NTQwRFx1NTQ4Q1x1NUJDNlx1NzgwMScsICd3YXJuJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICh1c2VybmFtZS5sZW5ndGggPCAzIHx8IHVzZXJuYW1lLmxlbmd0aCA+IDIwKSB7XG4gICAgICAgIHNob3dUb2FzdCgnXHU3NTI4XHU2MjM3XHU1NDBEXHU5NTdGXHU1RUE2XHU1RTk0XHU1NzI4IDMtMjAgXHU0RTJBXHU1QjU3XHU3QjI2XHU0RTRCXHU5NUY0JywgJ3dhcm4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHBhc3N3b3JkLmxlbmd0aCA8IDMpIHtcbiAgICAgICAgc2hvd1RvYXN0KCdcdTVCQzZcdTc4MDFcdTgxRjNcdTVDMTFcdTk3MDBcdTg5ODEgMyBcdTRFMkFcdTVCNTdcdTdCMjYnLCAnd2FybicpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBnby5kaXNhYmxlZCA9IHRydWU7XG4gICAgICBjb25zdCBvcmlnaW5hbEhUTUwgPSBnby5pbm5lckhUTUw7XG4gICAgICBnby5pbm5lckhUTUwgPSAnPHNwYW4gZGF0YS1pY289XCJhcnJvdy1yaWdodFwiPjwvc3Bhbj5cdTc2N0JcdTVGNTVcdTRFMkRcdTIwMjYnO1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmlldy5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1pY29dJykuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgICBjb25zdCBuYW1lID0gKGVsIGFzIEhUTUxFbGVtZW50KS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWNvJykgYXMgYW55O1xuICAgICAgICAgIHRyeSB7IGVsLmFwcGVuZENoaWxkKHJlbmRlckljb24obmFtZSwgeyBzaXplOiAyMCB9KSk7IH0gY2F0Y2gge31cbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIHt9XG4gICAgICBcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IEdhbWVNYW5hZ2VyLkkubG9naW5PclJlZ2lzdGVyKHVzZXJuYW1lLCBwYXNzd29yZCk7XG4gICAgICAgIGxvY2F0aW9uLmhhc2ggPSAnIy9tYWluJztcbiAgICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgICBzaG93VG9hc3QoZT8ubWVzc2FnZSB8fCAnXHU3NjdCXHU1RjU1XHU1OTMxXHU4RDI1XHVGRjBDXHU4QkY3XHU5MUNEXHU4QkQ1JywgJ2Vycm9yJyk7XG4gICAgICAgIC8vIFx1NTkzMVx1OEQyNVx1NjVGNlx1NjA2Mlx1NTkwRFx1NjMwOVx1OTRBRVxuICAgICAgICBnby5pbm5lckhUTUwgPSBvcmlnaW5hbEhUTUw7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmlldy5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1pY29dJykuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSAoZWwgYXMgSFRNTEVsZW1lbnQpLmdldEF0dHJpYnV0ZSgnZGF0YS1pY28nKSBhcyBhbnk7XG4gICAgICAgICAgICB0cnkgeyBlbC5hcHBlbmRDaGlsZChyZW5kZXJJY29uKG5hbWUsIHsgc2l6ZTogMjAgfSkpOyB9IGNhdGNoIHt9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2gge31cbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGdvLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGdvLm9uY2xpY2sgPSBzdWJtaXQ7XG4gICAgdUVsLm9ua2V5dXAgPSAoZSkgPT4geyBpZiAoKGUgYXMgS2V5Ym9hcmRFdmVudCkua2V5ID09PSAnRW50ZXInKSBzdWJtaXQoKTsgfTtcbiAgICBwRWwub25rZXl1cCA9IChlKSA9PiB7IGlmICgoZSBhcyBLZXlib2FyZEV2ZW50KS5rZXkgPT09ICdFbnRlcicpIHN1Ym1pdCgpOyB9O1xuICAgIHJldmVhbC5vbmNsaWNrID0gKCkgPT4ge1xuICAgICAgY29uc3QgaXNQd2QgPSBwRWwudHlwZSA9PT0gJ3Bhc3N3b3JkJztcbiAgICAgIHBFbC50eXBlID0gaXNQd2QgPyAndGV4dCcgOiAncGFzc3dvcmQnO1xuICAgICAgcmV2ZWFsLmlubmVySFRNTCA9ICcnO1xuICAgICAgcmV2ZWFsLmFwcGVuZENoaWxkKHJlbmRlckljb24oaXNQd2QgPyAnZXllLW9mZicgOiAnZXllJywgeyBzaXplOiAyMCB9KSk7XG4gICAgICByZXZlYWwuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoaXNQd2QgPyAnXHU5NjkwXHU4NUNGJyA6ICdcdTY2M0VcdTc5M0EnKSk7XG4gICAgfTtcbiAgfVxufVxuIiwgImV4cG9ydCBjb25zdCBBUElfQkFTRSA9ICh3aW5kb3cgYXMgYW55KS5fX0FQSV9CQVNFX18gfHwgJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGknO1xyXG5leHBvcnQgY29uc3QgV1NfRU5EUE9JTlQgPSAod2luZG93IGFzIGFueSkuX19XU19FTkRQT0lOVF9fIHx8ICdodHRwOi8vbG9jYWxob3N0OjMwMDAvZ2FtZSc7XHJcblxyXG5cclxuIiwgImltcG9ydCB7IFdTX0VORFBPSU5UIH0gZnJvbSAnLi9FbnYnO1xuXG50eXBlIEhhbmRsZXIgPSAoZGF0YTogYW55KSA9PiB2b2lkO1xuXG5leHBvcnQgY2xhc3MgUmVhbHRpbWVDbGllbnQge1xuICBwcml2YXRlIHN0YXRpYyBfaW5zdGFuY2U6IFJlYWx0aW1lQ2xpZW50O1xuICBzdGF0aWMgZ2V0IEkoKTogUmVhbHRpbWVDbGllbnQge1xuICAgIHJldHVybiB0aGlzLl9pbnN0YW5jZSA/PyAodGhpcy5faW5zdGFuY2UgPSBuZXcgUmVhbHRpbWVDbGllbnQoKSk7XG4gIH1cblxuICBwcml2YXRlIHNvY2tldDogYW55IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgaGFuZGxlcnM6IFJlY29yZDxzdHJpbmcsIEhhbmRsZXJbXT4gPSB7fTtcblxuICBjb25uZWN0KHRva2VuOiBzdHJpbmcpIHtcbiAgICBjb25zdCB3ID0gd2luZG93IGFzIGFueTtcbiAgICBpZiAody5pbykge1xuICAgICAgaWYgKHRoaXMuc29ja2V0ICYmICh0aGlzLnNvY2tldC5jb25uZWN0ZWQgfHwgdGhpcy5zb2NrZXQuY29ubmVjdGluZykpIHJldHVybjtcbiAgICAgIHRoaXMuc29ja2V0ID0gdy5pbyhXU19FTkRQT0lOVCwgeyBhdXRoOiB7IHRva2VuIH0gfSk7XG4gICAgICB0aGlzLnNvY2tldC5vbignY29ubmVjdCcsICgpID0+IHt9KTtcbiAgICAgIHRoaXMuc29ja2V0Lm9uQW55KChldmVudDogc3RyaW5nLCBwYXlsb2FkOiBhbnkpID0+IHRoaXMuZW1pdExvY2FsKGV2ZW50LCBwYXlsb2FkKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHNvY2tldC5pbyBjbGllbnQgbm90IGxvYWRlZDsgZGlzYWJsZSByZWFsdGltZSB1cGRhdGVzXG4gICAgICB0aGlzLnNvY2tldCA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgb24oZXZlbnQ6IHN0cmluZywgaGFuZGxlcjogSGFuZGxlcikge1xuICAgICh0aGlzLmhhbmRsZXJzW2V2ZW50XSB8fD0gW10pLnB1c2goaGFuZGxlcik7XG4gIH1cblxuICBvZmYoZXZlbnQ6IHN0cmluZywgaGFuZGxlcjogSGFuZGxlcikge1xuICAgIGNvbnN0IGFyciA9IHRoaXMuaGFuZGxlcnNbZXZlbnRdO1xuICAgIGlmICghYXJyKSByZXR1cm47XG4gICAgY29uc3QgaWR4ID0gYXJyLmluZGV4T2YoaGFuZGxlcik7XG4gICAgaWYgKGlkeCA+PSAwKSBhcnIuc3BsaWNlKGlkeCwgMSk7XG4gIH1cblxuICBwcml2YXRlIGVtaXRMb2NhbChldmVudDogc3RyaW5nLCBwYXlsb2FkOiBhbnkpIHtcbiAgICAodGhpcy5oYW5kbGVyc1tldmVudF0gfHwgW10pLmZvckVhY2goKGgpID0+IGgocGF5bG9hZCkpO1xuICB9XG59XG4iLCAiaW1wb3J0IHsgR2FtZU1hbmFnZXIgfSBmcm9tICcuLi9jb3JlL0dhbWVNYW5hZ2VyJztcbmltcG9ydCB7IHJlbmRlckljb24gfSBmcm9tICcuL0ljb24nO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyTmF2KGFjdGl2ZTogc3RyaW5nKTogSFRNTEVsZW1lbnQge1xuICBjb25zdCB0YWJzOiB7IGtleTogc3RyaW5nOyB0ZXh0OiBzdHJpbmc7IGhyZWY6IHN0cmluZzsgaWNvbjogYW55IH1bXSA9IFtcbiAgICB7IGtleTogJ21haW4nLCB0ZXh0OiAnXHU0RTNCXHU5ODc1JywgaHJlZjogJyMvbWFpbicsIGljb246ICdob21lJyB9LFxuICAgIHsga2V5OiAnd2FyZWhvdXNlJywgdGV4dDogJ1x1NEVEM1x1NUU5MycsIGhyZWY6ICcjL3dhcmVob3VzZScsIGljb246ICd3YXJlaG91c2UnIH0sXG4gICAgeyBrZXk6ICdwbHVuZGVyJywgdGV4dDogJ1x1NjNBMFx1NTkzQScsIGhyZWY6ICcjL3BsdW5kZXInLCBpY29uOiAncGx1bmRlcicgfSxcbiAgICB7IGtleTogJ2V4Y2hhbmdlJywgdGV4dDogJ1x1NEVBNFx1NjYxM1x1NjI0MCcsIGhyZWY6ICcjL2V4Y2hhbmdlJywgaWNvbjogJ2V4Y2hhbmdlJyB9LFxuICAgIHsga2V5OiAncmFua2luZycsIHRleHQ6ICdcdTYzOTJcdTg4NEMnLCBocmVmOiAnIy9yYW5raW5nJywgaWNvbjogJ3JhbmtpbmcnIH0sXG4gIF07XG4gIGNvbnN0IHdyYXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgd3JhcC5jbGFzc05hbWUgPSAnbmF2JztcbiAgZm9yIChjb25zdCB0IG9mIHRhYnMpIHtcbiAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGEuaHJlZiA9IHQuaHJlZjtcbiAgICBjb25zdCBpY28gPSByZW5kZXJJY29uKHQuaWNvbiwgeyBzaXplOiAxOCwgY2xhc3NOYW1lOiAnaWNvJyB9KTtcbiAgICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBsYWJlbC50ZXh0Q29udGVudCA9IHQudGV4dDtcbiAgICBhLmFwcGVuZENoaWxkKGljbyk7XG4gICAgYS5hcHBlbmRDaGlsZChsYWJlbCk7XG4gICAgaWYgKHQua2V5ID09PSBhY3RpdmUpIGEuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgd3JhcC5hcHBlbmRDaGlsZChhKTtcbiAgfVxuICBcbiAgLy8gXHU2REZCXHU1MkEwXHU5MDAwXHU1MUZBXHU3NjdCXHU1RjU1XHU2MzA5XHU5NEFFXG4gIGNvbnN0IGxvZ291dEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgbG9nb3V0QnRuLmhyZWYgPSAnIyc7XG4gIGxvZ291dEJ0bi5jbGFzc05hbWUgPSAnbmF2LWxvZ291dCc7XG4gIGxvZ291dEJ0bi5zdHlsZS5jc3NUZXh0ID0gJ21hcmdpbi1sZWZ0OmF1dG87b3BhY2l0eTouNzU7JztcbiAgY29uc3QgbG9nb3V0SWNvID0gcmVuZGVySWNvbignbG9nb3V0JywgeyBzaXplOiAxOCwgY2xhc3NOYW1lOiAnaWNvJyB9KTtcbiAgY29uc3QgbG9nb3V0TGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gIGxvZ291dExhYmVsLnRleHRDb250ZW50ID0gJ1x1OTAwMFx1NTFGQSc7XG4gIGxvZ291dEJ0bi5hcHBlbmRDaGlsZChsb2dvdXRJY28pO1xuICBsb2dvdXRCdG4uYXBwZW5kQ2hpbGQobG9nb3V0TGFiZWwpO1xuICBsb2dvdXRCdG4ub25jbGljayA9IChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGlmIChjb25maXJtKCdcdTc4NkVcdTVCOUFcdTg5ODFcdTkwMDBcdTUxRkFcdTc2N0JcdTVGNTVcdTU0MTdcdUZGMUYnKSkge1xuICAgICAgR2FtZU1hbmFnZXIuSS5sb2dvdXQoKTtcbiAgICB9XG4gIH07XG4gIHdyYXAuYXBwZW5kQ2hpbGQobG9nb3V0QnRuKTtcbiAgXG4gIHJldHVybiB3cmFwO1xufVxuIiwgImV4cG9ydCBjbGFzcyBDb3VudFVwVGV4dCB7XHJcbiAgcHJpdmF0ZSB2YWx1ZSA9IDA7XHJcbiAgcHJpdmF0ZSBkaXNwbGF5ID0gJzAnO1xyXG4gIHByaXZhdGUgYW5pbT86IG51bWJlcjtcclxuICBvblVwZGF0ZT86ICh0ZXh0OiBzdHJpbmcpID0+IHZvaWQ7XHJcblxyXG4gIHNldChuOiBudW1iZXIpIHtcclxuICAgIHRoaXMudmFsdWUgPSBuO1xyXG4gICAgdGhpcy5kaXNwbGF5ID0gdGhpcy5mb3JtYXQobik7XHJcbiAgICB0aGlzLm9uVXBkYXRlPy4odGhpcy5kaXNwbGF5KTtcclxuICB9XHJcblxyXG4gIHRvKG46IG51bWJlciwgZHVyYXRpb24gPSA1MDApIHtcclxuICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuYW5pbSEpO1xyXG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLnZhbHVlO1xyXG4gICAgY29uc3QgZGVsdGEgPSBuIC0gc3RhcnQ7XHJcbiAgICBjb25zdCB0MCA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgY29uc3Qgc3RlcCA9ICh0OiBudW1iZXIpID0+IHtcclxuICAgICAgY29uc3QgcCA9IE1hdGgubWluKDEsICh0IC0gdDApIC8gZHVyYXRpb24pO1xyXG4gICAgICBjb25zdCBlYXNlID0gMSAtIE1hdGgucG93KDEgLSBwLCAzKTtcclxuICAgICAgY29uc3QgY3VyciA9IHN0YXJ0ICsgZGVsdGEgKiBlYXNlO1xyXG4gICAgICB0aGlzLmRpc3BsYXkgPSB0aGlzLmZvcm1hdChjdXJyKTtcclxuICAgICAgdGhpcy5vblVwZGF0ZT8uKHRoaXMuZGlzcGxheSk7XHJcbiAgICAgIGlmIChwIDwgMSkgdGhpcy5hbmltID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApO1xyXG4gICAgICBlbHNlIHRoaXMudmFsdWUgPSBuO1xyXG4gICAgfTtcclxuICAgIHRoaXMuYW5pbSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZm9ybWF0KG46IG51bWJlcikge1xyXG4gICAgcmV0dXJuIE1hdGguZmxvb3IobikudG9Mb2NhbGVTdHJpbmcoKTtcclxuICB9XHJcbn1cclxuXHJcblxyXG4iLCAiaW1wb3J0IHsgTmV0d29ya01hbmFnZXIgfSBmcm9tICcuLi9jb3JlL05ldHdvcmtNYW5hZ2VyJztcbmltcG9ydCB7IHJlbmRlckljb24gfSBmcm9tICcuL0ljb24nO1xuaW1wb3J0IHsgQ291bnRVcFRleHQgfSBmcm9tICcuL0NvdW50VXBUZXh0JztcblxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlclJlc291cmNlQmFyKCkge1xuICBjb25zdCBib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgYm94LmNsYXNzTmFtZSA9ICdjb250YWluZXInO1xuICBjb25zdCBjYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNhcmQuY2xhc3NOYW1lID0gJ2NhcmQgZmFkZS1pbic7XG4gIGNhcmQuaW5uZXJIVE1MID0gYFxuICAgIDxkaXYgY2xhc3M9XCJzdGF0c1wiPlxuICAgICAgPGRpdiBjbGFzcz1cInN0YXRcIiBpZD1cIm9yZS1zdGF0XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJpY29cIiBkYXRhLWljbz1cIm9yZVwiPjwvZGl2PlxuICAgICAgICA8ZGl2IHN0eWxlPVwiZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6MnB4O1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJ2YWxcIiBpZD1cIm9yZVwiPjA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibGFiZWxcIj5cdTc3RkZcdTc3RjM8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJzdGF0XCIgaWQ9XCJjb2luLXN0YXRcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImljb1wiIGRhdGEtaWNvPVwiY29pblwiPjwvZGl2PlxuICAgICAgICA8ZGl2IHN0eWxlPVwiZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6MnB4O1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJ2YWxcIiBpZD1cImNvaW5cIj4wPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImxhYmVsXCI+QkI8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgYDtcbiAgYm94LmFwcGVuZENoaWxkKGNhcmQpO1xuICAvLyBpbmplY3QgaWNvbnNcbiAgdHJ5IHtcbiAgICBjb25zdCBvcmVJY28gPSBjYXJkLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWljbz1cIm9yZVwiXScpO1xuICAgIGNvbnN0IGNvaW5JY28gPSBjYXJkLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWljbz1cImNvaW5cIl0nKTtcbiAgICBpZiAob3JlSWNvKSBvcmVJY28uYXBwZW5kQ2hpbGQocmVuZGVySWNvbignb3JlJywgeyBzaXplOiAxOCB9KSk7XG4gICAgaWYgKGNvaW5JY28pIGNvaW5JY28uYXBwZW5kQ2hpbGQocmVuZGVySWNvbignY29pbicsIHsgc2l6ZTogMTggfSkpO1xuICB9IGNhdGNoIHt9XG4gIFxuICBjb25zdCBvcmVFbCA9IGNhcmQucXVlcnlTZWxlY3RvcignI29yZScpIGFzIEhUTUxFbGVtZW50O1xuICBjb25zdCBjb2luRWwgPSBjYXJkLnF1ZXJ5U2VsZWN0b3IoJyNjb2luJykgYXMgSFRNTEVsZW1lbnQ7XG4gIFxuICBjb25zdCBvcmVDb3VudGVyID0gbmV3IENvdW50VXBUZXh0KCk7XG4gIGNvbnN0IGNvaW5Db3VudGVyID0gbmV3IENvdW50VXBUZXh0KCk7XG4gIG9yZUNvdW50ZXIub25VcGRhdGUgPSAodGV4dCkgPT4geyBvcmVFbC50ZXh0Q29udGVudCA9IHRleHQ7IH07XG4gIGNvaW5Db3VudGVyLm9uVXBkYXRlID0gKHRleHQpID0+IHsgY29pbkVsLnRleHRDb250ZW50ID0gdGV4dDsgfTtcbiAgXG4gIGxldCBwcmV2T3JlID0gMDtcbiAgbGV0IHByZXZDb2luID0gMDtcbiAgXG4gIGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZSgpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcCA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IGlkOiBzdHJpbmc7IHVzZXJuYW1lOiBzdHJpbmc7IG5pY2tuYW1lOiBzdHJpbmc7IG9yZUFtb3VudDogbnVtYmVyOyBiYkNvaW5zOiBudW1iZXIgfT4oJy91c2VyL3Byb2ZpbGUnKTtcbiAgICAgIFxuICAgICAgLy8gXHU0RjdGXHU3NTI4XHU4QkExXHU2NTcwXHU1MkE4XHU3NTNCXHU2NkY0XHU2NUIwXG4gICAgICBpZiAocC5vcmVBbW91bnQgIT09IHByZXZPcmUpIHtcbiAgICAgICAgb3JlQ291bnRlci50byhwLm9yZUFtb3VudCwgODAwKTtcbiAgICAgICAgLy8gXHU1OTgyXHU2NzlDXHU2NjJGXHU1ODlFXHU1MkEwXHVGRjBDXHU2REZCXHU1MkEwXHU1NkZFXHU2ODA3XHU4MTA5XHU1MUIyXHU2NTQ4XHU2NzlDXG4gICAgICAgIGlmIChwLm9yZUFtb3VudCA+IHByZXZPcmUpIHtcbiAgICAgICAgICBjb25zdCBvcmVJY29uID0gY2FyZC5xdWVyeVNlbGVjdG9yKCcjb3JlLXN0YXQgLmljbycpO1xuICAgICAgICAgIGlmIChvcmVJY29uKSB7XG4gICAgICAgICAgICBvcmVJY29uLmNsYXNzTGlzdC5hZGQoJ3B1bHNlLWljb24nKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gb3JlSWNvbi5jbGFzc0xpc3QucmVtb3ZlKCdwdWxzZS1pY29uJyksIDYwMCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHByZXZPcmUgPSBwLm9yZUFtb3VudDtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgaWYgKHAuYmJDb2lucyAhPT0gcHJldkNvaW4pIHtcbiAgICAgICAgY29pbkNvdW50ZXIudG8ocC5iYkNvaW5zLCA4MDApO1xuICAgICAgICBpZiAocC5iYkNvaW5zID4gcHJldkNvaW4pIHtcbiAgICAgICAgICBjb25zdCBjb2luSWNvbiA9IGNhcmQucXVlcnlTZWxlY3RvcignI2NvaW4tc3RhdCAuaWNvJyk7XG4gICAgICAgICAgaWYgKGNvaW5JY29uKSB7XG4gICAgICAgICAgICBjb2luSWNvbi5jbGFzc0xpc3QuYWRkKCdwdWxzZS1pY29uJyk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGNvaW5JY29uLmNsYXNzTGlzdC5yZW1vdmUoJ3B1bHNlLWljb24nKSwgNjAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcHJldkNvaW4gPSBwLmJiQ29pbnM7XG4gICAgICB9XG4gICAgfSBjYXRjaCB7XG4gICAgICAvLyBpZ25vcmUgZmV0Y2ggZXJyb3JzOyBVSSBcdTRGMUFcdTU3MjhcdTRFMEJcdTRFMDBcdTZCMjFcdTUyMzdcdTY1QjBcdTY1RjZcdTYwNjJcdTU5MERcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHsgcm9vdDogYm94LCB1cGRhdGUsIG9yZUVsLCBjb2luRWwgfTtcbn1cbiIsICJpbXBvcnQgeyBOZXR3b3JrTWFuYWdlciB9IGZyb20gJy4uL2NvcmUvTmV0d29ya01hbmFnZXInO1xyXG5pbXBvcnQgeyBSZWFsdGltZUNsaWVudCB9IGZyb20gJy4uL2NvcmUvUmVhbHRpbWVDbGllbnQnO1xyXG5pbXBvcnQgeyBodG1sLCBxcyB9IGZyb20gJy4uL3V0aWxzL2RvbSc7XHJcbmltcG9ydCB7IHJlbmRlck5hdiB9IGZyb20gJy4uL2NvbXBvbmVudHMvTmF2JztcclxuaW1wb3J0IHsgcmVuZGVyUmVzb3VyY2VCYXIgfSBmcm9tICcuLi9jb21wb25lbnRzL1Jlc291cmNlQmFyJztcclxuaW1wb3J0IHsgc2hvd1RvYXN0IH0gZnJvbSAnLi4vY29tcG9uZW50cy9Ub2FzdCc7XHJcbmltcG9ydCB7IHNwYXduRmxvYXRUZXh0IH0gZnJvbSAnLi4vY29tcG9uZW50cy9GbG9hdFRleHQnO1xyXG5pbXBvcnQgeyByZW5kZXJJY29uIH0gZnJvbSAnLi4vY29tcG9uZW50cy9JY29uJztcclxuXHJcbnR5cGUgTWluZVN0YXR1cyA9IHtcclxuICBjYXJ0QW1vdW50OiBudW1iZXI7XHJcbiAgY2FydENhcGFjaXR5OiBudW1iZXI7XHJcbiAgY29sbGFwc2VkOiBib29sZWFuO1xyXG4gIGNvbGxhcHNlZFJlbWFpbmluZzogbnVtYmVyO1xyXG4gIHJ1bm5pbmc6IGJvb2xlYW47XHJcbiAgaW50ZXJ2YWxNczogbnVtYmVyO1xyXG59O1xyXG5cclxudHlwZSBQZW5kaW5nQWN0aW9uID0gJ3N0YXJ0JyB8ICdzdG9wJyB8ICdjb2xsZWN0JyB8ICdyZXBhaXInIHwgJ3N0YXR1cycgfCBudWxsO1xyXG5cclxuZXhwb3J0IGNsYXNzIE1haW5TY2VuZSB7XHJcbiAgcHJpdmF0ZSB2aWV3OiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xyXG4gIHByaXZhdGUgY2FydEFtdCA9IDA7XHJcbiAgcHJpdmF0ZSBjYXJ0Q2FwID0gMTAwMDtcclxuICBwcml2YXRlIGlzTWluaW5nID0gZmFsc2U7XHJcbiAgcHJpdmF0ZSBpc0NvbGxhcHNlZCA9IGZhbHNlO1xyXG4gIHByaXZhdGUgY29sbGFwc2VSZW1haW5pbmcgPSAwO1xyXG4gIHByaXZhdGUgY29sbGFwc2VUaW1lcjogbnVtYmVyIHwgbnVsbCA9IG51bGw7XHJcbiAgcHJpdmF0ZSBpbnRlcnZhbE1zID0gMzAwMDtcclxuICBwcml2YXRlIHBlbmRpbmc6IFBlbmRpbmdBY3Rpb24gPSBudWxsO1xyXG5cclxuICBwcml2YXRlIGVscyA9IHtcclxuICAgIGZpbGw6IG51bGwgYXMgSFRNTEVsZW1lbnQgfCBudWxsLFxyXG4gICAgcGVyY2VudDogbnVsbCBhcyBIVE1MRWxlbWVudCB8IG51bGwsXHJcbiAgICBzdGF0dXNUZXh0OiBudWxsIGFzIEhUTUxFbGVtZW50IHwgbnVsbCxcclxuICAgIHJpbmc6IG51bGwgYXMgSFRNTEVsZW1lbnQgfCBudWxsLFxyXG4gICAgcmluZ1BjdDogbnVsbCBhcyBIVE1MRWxlbWVudCB8IG51bGwsXHJcbiAgICBjeWNsZTogbnVsbCBhcyBIVE1MRWxlbWVudCB8IG51bGwsXHJcbiAgICBzdGF0dXNUYWc6IG51bGwgYXMgSFRNTEVsZW1lbnQgfCBudWxsLFxyXG4gICAgZXZlbnRzOiBudWxsIGFzIEhUTUxFbGVtZW50IHwgbnVsbCxcclxuICAgIHN0YXJ0OiBudWxsIGFzIEhUTUxCdXR0b25FbGVtZW50IHwgbnVsbCxcclxuICAgIHN0b3A6IG51bGwgYXMgSFRNTEJ1dHRvbkVsZW1lbnQgfCBudWxsLFxyXG4gICAgY29sbGVjdDogbnVsbCBhcyBIVE1MQnV0dG9uRWxlbWVudCB8IG51bGwsXHJcbiAgICByZXBhaXI6IG51bGwgYXMgSFRNTEJ1dHRvbkVsZW1lbnQgfCBudWxsLFxyXG4gICAgc3RhdHVzQnRuOiBudWxsIGFzIEhUTUxCdXR0b25FbGVtZW50IHwgbnVsbCxcclxuICAgIGhvbG9ncmFtOiBudWxsIGFzIEhUTUxFbGVtZW50IHwgbnVsbCxcclxuICB9O1xyXG5cclxuICBwcml2YXRlIG1pbmVVcGRhdGVIYW5kbGVyPzogKG1zZzogYW55KSA9PiB2b2lkO1xyXG4gIHByaXZhdGUgbWluZUNvbGxhcHNlSGFuZGxlcj86IChtc2c6IGFueSkgPT4gdm9pZDtcclxuICBwcml2YXRlIHBsdW5kZXJIYW5kbGVyPzogKG1zZzogYW55KSA9PiB2b2lkO1xyXG5cclxuICBhc3luYyBtb3VudChyb290OiBIVE1MRWxlbWVudCkge1xyXG4gICAgdGhpcy5jbGVhckNvbGxhcHNlVGltZXIoKTtcclxuICAgIHRoaXMucGVuZGluZyA9IG51bGw7XHJcblxyXG4gICAgY29uc3QgbmF2ID0gcmVuZGVyTmF2KCdtYWluJyk7XHJcbiAgICBjb25zdCBiYXIgPSByZW5kZXJSZXNvdXJjZUJhcigpO1xyXG4gICAgY29uc3QgdmlldyA9IGh0bWwoYFxyXG4gICAgICA8c2VjdGlvbiBjbGFzcz1cIm1haW4tc2NyZWVuXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIm1haW4tYW1iaWVudFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxyXG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJhbWJpZW50IG9yYiBvcmItYVwiPjwvc3Bhbj5cclxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYW1iaWVudCBvcmIgb3JiLWJcIj48L3NwYW4+XHJcbiAgICAgICAgICA8c3BhbiBjbGFzcz1cImFtYmllbnQgZ3JpZFwiPjwvc3Bhbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyIG1haW4tc3RhY2tcIiBzdHlsZT1cImNvbG9yOiNmZmY7XCI+XHJcbiAgICAgICAgICA8c2VjdGlvbiBjbGFzcz1cIm1pbmUgY2FyZCBtaW5lLWNhcmQgZmFkZS1pblwiPlxyXG4gICAgICAgICAgICA8aGVhZGVyIGNsYXNzPVwibWluZS1oZWFkZXJcIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWluZS10aXRsZVwiPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0aXRsZS1pY29uXCIgZGF0YS1pY289XCJwaWNrXCI+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0aXRsZS1sYWJlbFwiPlx1NjMxNlx1NzdGRlx1OTc2Mlx1Njc3Rjwvc3Bhbj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWluZS1jaGlwc1wiPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwaWxsXCIgaWQ9XCJzdGF0dXNUYWdcIj5cdTVGODVcdTY3M0E8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInBpbGwgcGlsbC1jeWNsZVwiPjxzcGFuIGRhdGEtaWNvPVwiY2xvY2tcIj48L3NwYW4+XHU1NDY4XHU2NzFGIDxzcGFuIGlkPVwiY3ljbGVcIj4zczwvc3Bhbj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvaGVhZGVyPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWluZS1ncmlkXCI+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1pbmUtZ2F1Z2VcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyaW5nXCIgaWQ9XCJyaW5nXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyaW5nLWNvcmVcIj5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBpZD1cInJpbmdQY3RcIj4wJTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8c21hbGw+XHU4OEM1XHU4RjdEXHU3Mzg3PC9zbWFsbD5cclxuICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyaW5nLWdsb3cgcmluZy1nbG93LWFcIj48L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyaW5nLWdsb3cgcmluZy1nbG93LWJcIj48L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWluZS1wcm9ncmVzc1wiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1pbmUtcHJvZ3Jlc3MtbWV0YVwiPlxyXG4gICAgICAgICAgICAgICAgICA8c3Bhbj5cdTc3RkZcdThGNjZcdTg4QzVcdThGN0Q8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgIDxzdHJvbmcgaWQ9XCJwZXJjZW50XCI+MCU8L3N0cm9uZz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1pbmUtcHJvZ3Jlc3MtdHJhY2tcIj5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1pbmUtcHJvZ3Jlc3MtZmlsbFwiIGlkPVwiZmlsbFwiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGlkPVwic3RhdHVzVGV4dFwiIGNsYXNzPVwibWluZS1zdGF0dXNcIj48L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtaW5lLWFjdGlvbnMtZ3JpZFwiPlxyXG4gICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJzdGFydFwiIGNsYXNzPVwiYnRuIGJ0bi1idXkgc3Bhbi0yXCI+PHNwYW4gZGF0YS1pY289XCJwbGF5XCI+PC9zcGFuPlx1NUYwMFx1NTlDQlx1NjMxNlx1NzdGRjwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJzdG9wXCIgY2xhc3M9XCJidG4gYnRuLWdob3N0XCI+PHNwYW4gZGF0YS1pY289XCJzdG9wXCI+PC9zcGFuPlx1NTA1Q1x1NkI2MjwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJjb2xsZWN0XCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIj48c3BhbiBkYXRhLWljbz1cImNvbGxlY3RcIj48L3NwYW4+XHU2NTM2XHU3N0ZGPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInN0YXR1c1wiIGNsYXNzPVwiYnRuIGJ0bi1naG9zdFwiPjxzcGFuIGRhdGEtaWNvPVwicmVmcmVzaFwiPjwvc3Bhbj5cdTUyMzdcdTY1QjBcdTcyQjZcdTYwMDE8L2J1dHRvbj5cclxuICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwicmVwYWlyXCIgY2xhc3M9XCJidG4gYnRuLXNlbGxcIj48c3BhbiBkYXRhLWljbz1cIndyZW5jaFwiPjwvc3Bhbj5cdTRGRUVcdTc0MDY8L2J1dHRvbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtaW5lLWZlZWRcIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZXZlbnQtZmVlZFwiIGlkPVwiZXZlbnRzXCI+PC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWluZS1ob2xvZ3JhbVwiIGlkPVwiaG9sb2dyYW1cIiBhcmlhLWhpZGRlbj1cInRydWVcIj5cclxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm1pbmUtaG9sby1ncmlkXCI+PC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibWluZS1ob2xvLWdyaWQgZGlhZ29uYWxcIj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJtaW5lLWhvbG8tZ2xvd1wiPjwvc3Bhbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L3NlY3Rpb24+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvc2VjdGlvbj5cclxuICAgIGApO1xyXG5cclxuICAgIHJvb3QuaW5uZXJIVE1MID0gJyc7XHJcbiAgICByb290LmFwcGVuZENoaWxkKG5hdik7XHJcbiAgICByb290LmFwcGVuZENoaWxkKGJhci5yb290KTtcclxuICAgIHJvb3QuYXBwZW5kQ2hpbGQodmlldyk7XHJcblxyXG4gICAgdGhpcy52aWV3ID0gdmlldztcclxuICAgIC8vIG1vdW50IGljb25zIGluIGhlYWRlci9idXR0b25zXHJcbiAgICB0cnkge1xyXG4gICAgICB2aWV3LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWljb10nKVxyXG4gICAgICAgIC5mb3JFYWNoKChlbCkgPT4ge1xyXG4gICAgICAgICAgY29uc3QgbmFtZSA9IChlbCBhcyBIVE1MRWxlbWVudCkuZ2V0QXR0cmlidXRlKCdkYXRhLWljbycpIGFzIGFueTtcclxuICAgICAgICAgIHRyeSB7IGVsLmFwcGVuZENoaWxkKHJlbmRlckljb24obmFtZSwgeyBzaXplOiAyMCB9KSk7IH0gY2F0Y2gge31cclxuICAgICAgICB9KTtcclxuICAgIH0gY2F0Y2gge31cclxuICAgIHRoaXMuY2FjaGVFbGVtZW50cygpO1xyXG4gICAgdGhpcy5hdHRhY2hIYW5kbGVycyhiYXIudXBkYXRlLmJpbmQoYmFyKSk7XHJcbiAgICBhd2FpdCBiYXIudXBkYXRlKCk7XHJcbiAgICB0aGlzLnNldHVwUmVhbHRpbWUoKTtcclxuICAgIGF3YWl0IHRoaXMucmVmcmVzaFN0YXR1cygpO1xyXG4gICAgdGhpcy51cGRhdGVQcm9ncmVzcygpO1xyXG4gICAgdGhpcy51cGRhdGVDb250cm9scygpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjYWNoZUVsZW1lbnRzKCkge1xyXG4gICAgaWYgKCF0aGlzLnZpZXcpIHJldHVybjtcclxuICAgIHRoaXMuZWxzLmZpbGwgPSBxcyh0aGlzLnZpZXcsICcjZmlsbCcpO1xyXG4gICAgdGhpcy5lbHMucGVyY2VudCA9IHFzKHRoaXMudmlldywgJyNwZXJjZW50Jyk7XHJcbiAgICB0aGlzLmVscy5zdGF0dXNUZXh0ID0gcXModGhpcy52aWV3LCAnI3N0YXR1c1RleHQnKTtcclxuICAgIHRoaXMuZWxzLnJpbmcgPSB0aGlzLnZpZXcucXVlcnlTZWxlY3RvcignI3JpbmcnKTtcclxuICAgIHRoaXMuZWxzLnJpbmdQY3QgPSB0aGlzLnZpZXcucXVlcnlTZWxlY3RvcignI3JpbmdQY3QnKTtcclxuICAgIHRoaXMuZWxzLmN5Y2xlID0gdGhpcy52aWV3LnF1ZXJ5U2VsZWN0b3IoJyNjeWNsZScpO1xyXG4gICAgdGhpcy5lbHMuc3RhdHVzVGFnID0gdGhpcy52aWV3LnF1ZXJ5U2VsZWN0b3IoJyNzdGF0dXNUYWcnKTtcclxuICAgIHRoaXMuZWxzLmV2ZW50cyA9IHRoaXMudmlldy5xdWVyeVNlbGVjdG9yKCcjZXZlbnRzJyk7XHJcbiAgICB0aGlzLmVscy5zdGFydCA9IHFzPEhUTUxCdXR0b25FbGVtZW50Pih0aGlzLnZpZXcsICcjc3RhcnQnKTtcclxuICAgIHRoaXMuZWxzLnN0b3AgPSBxczxIVE1MQnV0dG9uRWxlbWVudD4odGhpcy52aWV3LCAnI3N0b3AnKTtcclxuICAgIHRoaXMuZWxzLmNvbGxlY3QgPSBxczxIVE1MQnV0dG9uRWxlbWVudD4odGhpcy52aWV3LCAnI2NvbGxlY3QnKTtcclxuICAgIHRoaXMuZWxzLnJlcGFpciA9IHFzPEhUTUxCdXR0b25FbGVtZW50Pih0aGlzLnZpZXcsICcjcmVwYWlyJyk7XHJcbiAgICB0aGlzLmVscy5zdGF0dXNCdG4gPSBxczxIVE1MQnV0dG9uRWxlbWVudD4odGhpcy52aWV3LCAnI3N0YXR1cycpO1xyXG4gICAgdGhpcy5lbHMuaG9sb2dyYW0gPSB0aGlzLnZpZXcucXVlcnlTZWxlY3RvcignI2hvbG9ncmFtJyk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGF0dGFjaEhhbmRsZXJzKHVwZGF0ZUJhcjogKCkgPT4gUHJvbWlzZTx2b2lkPikge1xyXG4gICAgaWYgKCF0aGlzLnZpZXcpIHJldHVybjtcclxuICAgIHRoaXMuZWxzLnN0YXJ0Py5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRoaXMuaGFuZGxlU3RhcnQoKSk7XHJcbiAgICB0aGlzLmVscy5zdG9wPy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRoaXMuaGFuZGxlU3RvcCgpKTtcclxuICAgIHRoaXMuZWxzLnN0YXR1c0J0bj8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0aGlzLnJlZnJlc2hTdGF0dXMoKSk7XHJcbiAgICB0aGlzLmVscy5yZXBhaXI/LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdGhpcy5oYW5kbGVSZXBhaXIoKSk7XHJcbiAgICB0aGlzLmVscy5jb2xsZWN0Py5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRoaXMuaGFuZGxlQ29sbGVjdCh1cGRhdGVCYXIpKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2V0dXBSZWFsdGltZSgpIHtcclxuICAgIGNvbnN0IHRva2VuID0gKE5ldHdvcmtNYW5hZ2VyIGFzIGFueSkuSVsndG9rZW4nXTtcclxuICAgIGlmICh0b2tlbikgUmVhbHRpbWVDbGllbnQuSS5jb25uZWN0KHRva2VuKTtcclxuXHJcbiAgICBpZiAodGhpcy5taW5lVXBkYXRlSGFuZGxlcikgUmVhbHRpbWVDbGllbnQuSS5vZmYoJ21pbmUudXBkYXRlJywgdGhpcy5taW5lVXBkYXRlSGFuZGxlcik7XHJcbiAgICBpZiAodGhpcy5taW5lQ29sbGFwc2VIYW5kbGVyKSBSZWFsdGltZUNsaWVudC5JLm9mZignbWluZS5jb2xsYXBzZScsIHRoaXMubWluZUNvbGxhcHNlSGFuZGxlcik7XHJcbiAgICBpZiAodGhpcy5wbHVuZGVySGFuZGxlcikgUmVhbHRpbWVDbGllbnQuSS5vZmYoJ3BsdW5kZXIuYXR0YWNrZWQnLCB0aGlzLnBsdW5kZXJIYW5kbGVyKTtcclxuXHJcbiAgICB0aGlzLm1pbmVVcGRhdGVIYW5kbGVyID0gKG1zZykgPT4ge1xyXG4gICAgICB0aGlzLmNhcnRBbXQgPSB0eXBlb2YgbXNnLmNhcnRBbW91bnQgPT09ICdudW1iZXInID8gbXNnLmNhcnRBbW91bnQgOiB0aGlzLmNhcnRBbXQ7XHJcbiAgICAgIHRoaXMuY2FydENhcCA9IHR5cGVvZiBtc2cuY2FydENhcGFjaXR5ID09PSAnbnVtYmVyJyA/IG1zZy5jYXJ0Q2FwYWNpdHkgOiB0aGlzLmNhcnRDYXA7XHJcbiAgICAgIHRoaXMuaXNNaW5pbmcgPSBtc2cucnVubmluZyA/PyB0aGlzLmlzTWluaW5nO1xyXG4gICAgICBpZiAobXNnLmNvbGxhcHNlZCAmJiBtc2cuY29sbGFwc2VkUmVtYWluaW5nKSB7XHJcbiAgICAgICAgdGhpcy5iZWdpbkNvbGxhcHNlQ291bnRkb3duKG1zZy5jb2xsYXBzZWRSZW1haW5pbmcpO1xyXG4gICAgICB9IGVsc2UgaWYgKCFtc2cuY29sbGFwc2VkKSB7XHJcbiAgICAgICAgdGhpcy5pc0NvbGxhcHNlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuY2xlYXJDb2xsYXBzZVRpbWVyKCk7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy51cGRhdGVQcm9ncmVzcygpO1xyXG4gICAgICBpZiAobXNnLnR5cGUgPT09ICdjcml0aWNhbCcgJiYgbXNnLmFtb3VudCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZShgXHU4OUU2XHU1M0QxXHU2NkI0XHU1MUZCXHVGRjBDXHU3N0ZGXHU4RjY2XHU1ODlFXHU1MkEwICR7bXNnLmFtb3VudH1cdUZGMDFgKTtcclxuICAgICAgICB0aGlzLmxvZ0V2ZW50KGBcdTY2QjRcdTUxRkIgKyR7bXNnLmFtb3VudH1gKTtcclxuICAgICAgfSBlbHNlIGlmIChtc2cudHlwZSA9PT0gJ25vcm1hbCcgJiYgbXNnLmFtb3VudCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZShgXHU3N0ZGXHU4RjY2XHU1ODlFXHU1MkEwICR7bXNnLmFtb3VudH1cdUZGMENcdTVGNTNcdTUyNEQgJHt0aGlzLmZvcm1hdFBlcmNlbnQoKX1gKTtcclxuICAgICAgICB0aGlzLmxvZ0V2ZW50KGBcdTYzMTZcdTYzOTggKyR7bXNnLmFtb3VudH1gKTtcclxuICAgICAgfSBlbHNlIGlmIChtc2cudHlwZSA9PT0gJ2NvbGxhcHNlJykge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZSgnXHU3N0ZGXHU5MDUzXHU1NzREXHU1ODRDXHVGRjBDXHU4QkY3XHU3QUNCXHU1MzczXHU0RkVFXHU3NDA2Jyk7XHJcbiAgICAgICAgdGhpcy5sb2dFdmVudCgnXHU3N0ZGXHU5MDUzXHU1NzREXHU1ODRDJyk7XHJcbiAgICAgIH0gZWxzZSBpZiAobXNnLnR5cGUgPT09ICdjb2xsZWN0Jykge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZSgnXHU3N0ZGXHU3N0YzXHU1REYyXHU2NTM2XHU5NkM2XHVGRjBDXHU3N0ZGXHU4RjY2XHU2RTA1XHU3QTdBJyk7XHJcbiAgICAgICAgdGhpcy5sb2dFdmVudCgnXHU2NTM2XHU5NkM2XHU1QjhDXHU2MjEwJyk7XHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0NvbGxhcHNlZCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZShgXHU3N0ZGXHU5MDUzXHU1NzREXHU1ODRDXHVGRjBDXHU1MjY5XHU0RjU5ICR7dGhpcy5jb2xsYXBzZVJlbWFpbmluZ31zYCk7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy51cGRhdGVDb250cm9scygpO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLm1pbmVDb2xsYXBzZUhhbmRsZXIgPSAobXNnKSA9PiB7XHJcbiAgICAgIGNvbnN0IHNlY29uZHMgPSBOdW1iZXIobXNnPy5yZXBhaXJfZHVyYXRpb24pIHx8IDA7XHJcbiAgICAgIGlmIChzZWNvbmRzID4gMCkgdGhpcy5iZWdpbkNvbGxhcHNlQ291bnRkb3duKHNlY29uZHMpO1xyXG4gICAgICBzaG93VG9hc3QoYFx1NzdGRlx1OTA1M1x1NTc0RFx1NTg0Q1x1RkYwQ1x1OTcwMFx1NEZFRVx1NzQwNlx1RkYwOFx1N0VBNiAke3NlY29uZHN9c1x1RkYwOWAsICd3YXJuJyk7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMucGx1bmRlckhhbmRsZXIgPSAobXNnKSA9PiB7XHJcbiAgICAgIHNob3dUb2FzdChgXHU4OEFCXHU2M0EwXHU1OTNBXHVGRjFBXHU2NzY1XHU4MUVBICR7bXNnLmF0dGFja2VyfVx1RkYwQ1x1NjM1Rlx1NTkzMSAke21zZy5sb3NzfWAsICd3YXJuJyk7XHJcbiAgICAgIHRoaXMubG9nRXZlbnQoYFx1ODhBQiAke21zZy5hdHRhY2tlcn0gXHU2M0EwXHU1OTNBIC0ke21zZy5sb3NzfWApO1xyXG4gICAgfTtcclxuXHJcbiAgICBSZWFsdGltZUNsaWVudC5JLm9uKCdtaW5lLnVwZGF0ZScsIHRoaXMubWluZVVwZGF0ZUhhbmRsZXIpO1xyXG4gICAgUmVhbHRpbWVDbGllbnQuSS5vbignbWluZS5jb2xsYXBzZScsIHRoaXMubWluZUNvbGxhcHNlSGFuZGxlcik7XHJcbiAgICBSZWFsdGltZUNsaWVudC5JLm9uKCdwbHVuZGVyLmF0dGFja2VkJywgdGhpcy5wbHVuZGVySGFuZGxlcik7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFzeW5jIGhhbmRsZVN0YXJ0KCkge1xyXG4gICAgaWYgKHRoaXMucGVuZGluZyB8fCB0aGlzLmlzQ29sbGFwc2VkKSB7XHJcbiAgICAgIGlmICh0aGlzLmlzQ29sbGFwc2VkKSBzaG93VG9hc3QoJ1x1NzdGRlx1OTA1M1x1NTc0RFx1NTg0Q1x1RkYwQ1x1OEJGN1x1NTE0OFx1NEZFRVx1NzQwNicsICd3YXJuJyk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMucGVuZGluZyA9ICdzdGFydCc7XHJcbiAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzKCk7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBzdGF0dXMgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8TWluZVN0YXR1cz4oJy9taW5lL3N0YXJ0JywgeyBtZXRob2Q6ICdQT1NUJyB9KTtcclxuICAgICAgdGhpcy5hcHBseVN0YXR1cyhzdGF0dXMpO1xyXG4gICAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoJ1x1NzdGRlx1NjczQVx1NURGMlx1NTQyRlx1NTJBOCcpO1xyXG4gICAgICBzaG93VG9hc3QoJ1x1NzdGRlx1NjczQVx1NURGMlx1NTQyRlx1NTJBOCcsICdzdWNjZXNzJyk7XHJcbiAgICB9IGNhdGNoIChlOiBhbnkpIHtcclxuICAgICAgc2hvd1RvYXN0KGU/Lm1lc3NhZ2UgfHwgJ1x1NTQyRlx1NTJBOFx1NTkzMVx1OEQyNScsICdlcnJvcicpO1xyXG4gICAgfSBmaW5hbGx5IHtcclxuICAgICAgdGhpcy5wZW5kaW5nID0gbnVsbDtcclxuICAgICAgdGhpcy51cGRhdGVDb250cm9scygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhc3luYyBoYW5kbGVTdG9wKCkge1xyXG4gICAgaWYgKHRoaXMucGVuZGluZykgcmV0dXJuO1xyXG4gICAgdGhpcy5wZW5kaW5nID0gJ3N0b3AnO1xyXG4gICAgdGhpcy51cGRhdGVDb250cm9scygpO1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3Qgc3RhdHVzID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PE1pbmVTdGF0dXM+KCcvbWluZS9zdG9wJywgeyBtZXRob2Q6ICdQT1NUJyB9KTtcclxuICAgICAgdGhpcy5hcHBseVN0YXR1cyhzdGF0dXMpO1xyXG4gICAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoJ1x1NzdGRlx1NjczQVx1NURGMlx1NTA1Q1x1NkI2MicpO1xyXG4gICAgICBzaG93VG9hc3QoJ1x1NzdGRlx1NjczQVx1NURGMlx1NTA1Q1x1NkI2MicsICdzdWNjZXNzJyk7XHJcbiAgICB9IGNhdGNoIChlOiBhbnkpIHtcclxuICAgICAgc2hvd1RvYXN0KGU/Lm1lc3NhZ2UgfHwgJ1x1NTA1Q1x1NkI2Mlx1NTkzMVx1OEQyNScsICdlcnJvcicpO1xyXG4gICAgfSBmaW5hbGx5IHtcclxuICAgICAgdGhpcy5wZW5kaW5nID0gbnVsbDtcclxuICAgICAgdGhpcy51cGRhdGVDb250cm9scygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhc3luYyBoYW5kbGVDb2xsZWN0KHVwZGF0ZUJhcjogKCkgPT4gUHJvbWlzZTx2b2lkPikge1xyXG4gICAgaWYgKHRoaXMucGVuZGluZyB8fCB0aGlzLmNhcnRBbXQgPD0gMCkgcmV0dXJuO1xyXG4gICAgdGhpcy5wZW5kaW5nID0gJ2NvbGxlY3QnO1xyXG4gICAgdGhpcy51cGRhdGVDb250cm9scygpO1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcmVzID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgY29sbGVjdGVkOiBudW1iZXI7IHN0YXR1czogTWluZVN0YXR1cyB9PignL21pbmUvY29sbGVjdCcsIHsgbWV0aG9kOiAnUE9TVCcgfSk7XHJcbiAgICAgIGlmIChyZXMuc3RhdHVzKSB0aGlzLmFwcGx5U3RhdHVzKHJlcy5zdGF0dXMpO1xyXG4gICAgICBpZiAocmVzLmNvbGxlY3RlZCA+IDApIHtcclxuICAgICAgICAvLyBcdTUyMUJcdTVFRkFcdTYyOUJcdTcyNjlcdTdFQkZcdTk4REVcdTg4NENcdTUyQThcdTc1M0JcclxuICAgICAgICB0aGlzLmNyZWF0ZUZseWluZ09yZUFuaW1hdGlvbihyZXMuY29sbGVjdGVkKTtcclxuICAgICAgICBzaG93VG9hc3QoYFx1NjUzNlx1OTZDNlx1NzdGRlx1NzdGMyAke3Jlcy5jb2xsZWN0ZWR9YCwgJ3N1Y2Nlc3MnKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzaG93VG9hc3QoJ1x1NzdGRlx1OEY2Nlx1NEUzQVx1N0E3QVx1RkYwQ1x1NjVFMFx1NzdGRlx1NzdGM1x1NTNFRlx1NjUzNlx1OTZDNicsICd3YXJuJyk7XHJcbiAgICAgIH1cclxuICAgICAgYXdhaXQgdXBkYXRlQmFyKCk7XHJcbiAgICB9IGNhdGNoIChlOiBhbnkpIHtcclxuICAgICAgc2hvd1RvYXN0KGU/Lm1lc3NhZ2UgfHwgJ1x1NjUzNlx1NzdGRlx1NTkzMVx1OEQyNScsICdlcnJvcicpO1xyXG4gICAgfSBmaW5hbGx5IHtcclxuICAgICAgdGhpcy5wZW5kaW5nID0gbnVsbDtcclxuICAgICAgdGhpcy51cGRhdGVDb250cm9scygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjcmVhdGVGbHlpbmdPcmVBbmltYXRpb24oYW1vdW50OiBudW1iZXIpIHtcclxuICAgIGNvbnN0IGZpbGxFbCA9IHRoaXMuZWxzLmZpbGw7XHJcbiAgICBjb25zdCBvcmVFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNvcmUnKTtcclxuICAgIGlmICghZmlsbEVsIHx8ICFvcmVFbCkgcmV0dXJuO1xyXG5cclxuICAgIGNvbnN0IHN0YXJ0UmVjdCA9IGZpbGxFbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgIGNvbnN0IGVuZFJlY3QgPSBvcmVFbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcbiAgICAvLyBcdTUyMUJcdTVFRkFcdTU5MUFcdTRFMkFcdTc3RkZcdTc3RjNcdTdDOTJcdTVCNTBcclxuICAgIGNvbnN0IHBhcnRpY2xlQ291bnQgPSBNYXRoLm1pbig4LCBNYXRoLm1heCgzLCBNYXRoLmZsb29yKGFtb3VudCAvIDIwKSkpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXJ0aWNsZUNvdW50OyBpKyspIHtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcGFydGljbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBwYXJ0aWNsZS5jbGFzc05hbWUgPSAnb3JlLXBhcnRpY2xlJztcclxuICAgICAgICBwYXJ0aWNsZS50ZXh0Q29udGVudCA9ICdcdUQ4M0RcdURDOEUnO1xyXG4gICAgICAgIHBhcnRpY2xlLnN0eWxlLmNzc1RleHQgPSBgXHJcbiAgICAgICAgICBwb3NpdGlvbjogZml4ZWQ7XHJcbiAgICAgICAgICBsZWZ0OiAke3N0YXJ0UmVjdC5sZWZ0ICsgc3RhcnRSZWN0LndpZHRoIC8gMn1weDtcclxuICAgICAgICAgIHRvcDogJHtzdGFydFJlY3QudG9wICsgc3RhcnRSZWN0LmhlaWdodCAvIDJ9cHg7XHJcbiAgICAgICAgICBmb250LXNpemU6IDI0cHg7XHJcbiAgICAgICAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcclxuICAgICAgICAgIHotaW5kZXg6IDk5OTk7XHJcbiAgICAgICAgICBmaWx0ZXI6IGRyb3Atc2hhZG93KDAgMCA4cHggcmdiYSgxMjMsNDQsMjQ1LDAuOCkpO1xyXG4gICAgICAgIGA7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChwYXJ0aWNsZSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGR4ID0gZW5kUmVjdC5sZWZ0ICsgZW5kUmVjdC53aWR0aCAvIDIgLSBzdGFydFJlY3QubGVmdCAtIHN0YXJ0UmVjdC53aWR0aCAvIDI7XHJcbiAgICAgICAgY29uc3QgZHkgPSBlbmRSZWN0LnRvcCArIGVuZFJlY3QuaGVpZ2h0IC8gMiAtIHN0YXJ0UmVjdC50b3AgLSBzdGFydFJlY3QuaGVpZ2h0IC8gMjtcclxuICAgICAgICBjb25zdCByYW5kb21PZmZzZXQgPSAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiAxMDA7XHJcblxyXG4gICAgICAgIHBhcnRpY2xlLmFuaW1hdGUoW1xyXG4gICAgICAgICAgeyBcclxuICAgICAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlKDAsIDApIHNjYWxlKDEpJywgXHJcbiAgICAgICAgICAgIG9wYWNpdHk6IDEgXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgeyBcclxuICAgICAgICAgICAgdHJhbnNmb3JtOiBgdHJhbnNsYXRlKCR7ZHgvMiArIHJhbmRvbU9mZnNldH1weCwgJHtkeSAtIDE1MH1weCkgc2NhbGUoMS4yKWAsIFxyXG4gICAgICAgICAgICBvcGFjaXR5OiAxLFxyXG4gICAgICAgICAgICBvZmZzZXQ6IDAuNVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHsgXHJcbiAgICAgICAgICAgIHRyYW5zZm9ybTogYHRyYW5zbGF0ZSgke2R4fXB4LCAke2R5fXB4KSBzY2FsZSgwLjUpYCwgXHJcbiAgICAgICAgICAgIG9wYWNpdHk6IDAgXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgXSwge1xyXG4gICAgICAgICAgZHVyYXRpb246IDEwMDAgKyBpICogNTAsXHJcbiAgICAgICAgICBlYXNpbmc6ICdjdWJpYy1iZXppZXIoMC4yNSwgMC40NiwgMC40NSwgMC45NCknXHJcbiAgICAgICAgfSkub25maW5pc2ggPSAoKSA9PiB7XHJcbiAgICAgICAgICBwYXJ0aWNsZS5yZW1vdmUoKTtcclxuICAgICAgICAgIC8vIFx1NjcwMFx1NTQwRVx1NEUwMFx1NEUyQVx1N0M5Mlx1NUI1MFx1NTIzMFx1OEZCRVx1NjVGNlx1RkYwQ1x1NkRGQlx1NTJBMFx1ODEwOVx1NTFCMlx1NjU0OFx1Njc5Q1xyXG4gICAgICAgICAgaWYgKGkgPT09IHBhcnRpY2xlQ291bnQgLSAxKSB7XHJcbiAgICAgICAgICAgIG9yZUVsLmNsYXNzTGlzdC5hZGQoJ2ZsYXNoJyk7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gb3JlRWwuY2xhc3NMaXN0LnJlbW92ZSgnZmxhc2gnKSwgOTAwKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICB9LCBpICogODApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhc3luYyBoYW5kbGVSZXBhaXIoKSB7XHJcbiAgICBpZiAodGhpcy5wZW5kaW5nIHx8ICF0aGlzLmlzQ29sbGFwc2VkKSByZXR1cm47XHJcbiAgICB0aGlzLnBlbmRpbmcgPSAncmVwYWlyJztcclxuICAgIHRoaXMudXBkYXRlQ29udHJvbHMoKTtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHN0YXR1cyA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDxNaW5lU3RhdHVzPignL21pbmUvcmVwYWlyJywgeyBtZXRob2Q6ICdQT1NUJyB9KTtcclxuICAgICAgdGhpcy5hcHBseVN0YXR1cyhzdGF0dXMpO1xyXG4gICAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoJ1x1NzdGRlx1OTA1M1x1NURGMlx1NEZFRVx1NTkwRFx1RkYwQ1x1NTNFRlx1OTFDRFx1NjVCMFx1NTQyRlx1NTJBOCcpO1xyXG4gICAgICBzaG93VG9hc3QoJ1x1NzdGRlx1OTA1M1x1NURGMlx1NEZFRVx1NTkwRCcsICdzdWNjZXNzJyk7XHJcbiAgICB9IGNhdGNoIChlOiBhbnkpIHtcclxuICAgICAgc2hvd1RvYXN0KGU/Lm1lc3NhZ2UgfHwgJ1x1NEZFRVx1NzQwNlx1NTkzMVx1OEQyNScsICdlcnJvcicpO1xyXG4gICAgfSBmaW5hbGx5IHtcclxuICAgICAgdGhpcy5wZW5kaW5nID0gbnVsbDtcclxuICAgICAgdGhpcy51cGRhdGVDb250cm9scygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhc3luYyByZWZyZXNoU3RhdHVzKCkge1xyXG4gICAgaWYgKHRoaXMucGVuZGluZyA9PT0gJ3N0YXR1cycpIHJldHVybjtcclxuICAgIHRoaXMucGVuZGluZyA9ICdzdGF0dXMnO1xyXG4gICAgdGhpcy51cGRhdGVDb250cm9scygpO1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3Qgc3RhdHVzID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PE1pbmVTdGF0dXM+KCcvbWluZS9zdGF0dXMnKTtcclxuICAgICAgdGhpcy5hcHBseVN0YXR1cyhzdGF0dXMpO1xyXG4gICAgfSBjYXRjaCAoZTogYW55KSB7XHJcbiAgICAgIHNob3dUb2FzdChlPy5tZXNzYWdlIHx8ICdcdTgzQjdcdTUzRDZcdTcyQjZcdTYwMDFcdTU5MzFcdThEMjUnLCAnZXJyb3InKTtcclxuICAgIH0gZmluYWxseSB7XHJcbiAgICAgIHRoaXMucGVuZGluZyA9IG51bGw7XHJcbiAgICAgIHRoaXMudXBkYXRlQ29udHJvbHMoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXBwbHlTdGF0dXMoc3RhdHVzOiBNaW5lU3RhdHVzIHwgdW5kZWZpbmVkLCBvcHRzOiB7IHF1aWV0PzogYm9vbGVhbiB9ID0ge30pIHtcclxuICAgIGlmICghc3RhdHVzKSByZXR1cm47XHJcbiAgICB0aGlzLmNhcnRBbXQgPSBzdGF0dXMuY2FydEFtb3VudCA/PyB0aGlzLmNhcnRBbXQ7XHJcbiAgICB0aGlzLmNhcnRDYXAgPSBzdGF0dXMuY2FydENhcGFjaXR5ID8/IHRoaXMuY2FydENhcDtcclxuICAgIHRoaXMuaW50ZXJ2YWxNcyA9IHN0YXR1cy5pbnRlcnZhbE1zID8/IHRoaXMuaW50ZXJ2YWxNcztcclxuICAgIHRoaXMuaXNNaW5pbmcgPSBCb29sZWFuKHN0YXR1cy5ydW5uaW5nKTtcclxuICAgIHRoaXMuaXNDb2xsYXBzZWQgPSBCb29sZWFuKHN0YXR1cy5jb2xsYXBzZWQpO1xyXG4gICAgaWYgKHN0YXR1cy5jb2xsYXBzZWQgJiYgc3RhdHVzLmNvbGxhcHNlZFJlbWFpbmluZyA+IDApIHtcclxuICAgICAgdGhpcy5iZWdpbkNvbGxhcHNlQ291bnRkb3duKHN0YXR1cy5jb2xsYXBzZWRSZW1haW5pbmcpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5jbGVhckNvbGxhcHNlVGltZXIoKTtcclxuICAgICAgdGhpcy5jb2xsYXBzZVJlbWFpbmluZyA9IDA7XHJcbiAgICB9XHJcbiAgICB0aGlzLnVwZGF0ZVByb2dyZXNzKCk7XHJcbiAgICBpZiAoIW9wdHMucXVpZXQpIHtcclxuICAgICAgaWYgKHRoaXMuaXNDb2xsYXBzZWQgJiYgdGhpcy5jb2xsYXBzZVJlbWFpbmluZyA+IDApIHtcclxuICAgICAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoYFx1NzdGRlx1OTA1M1x1NTc0RFx1NTg0Q1x1RkYwQ1x1NTI2OVx1NEY1OSAke3RoaXMuY29sbGFwc2VSZW1haW5pbmd9c2ApO1xyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaXNNaW5pbmcpIHtcclxuICAgICAgICBjb25zdCBzZWNvbmRzID0gTWF0aC5tYXgoMSwgTWF0aC5yb3VuZCh0aGlzLmludGVydmFsTXMgLyAxMDAwKSk7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0dXNNZXNzYWdlKGBcdTc3RkZcdTY3M0FcdThGRDBcdTg4NENcdTRFMkRcdUZGMENcdTU0NjhcdTY3MUZcdTdFQTYgJHtzZWNvbmRzfXNcdUZGMENcdTVGNTNcdTUyNEQgJHt0aGlzLmZvcm1hdFBlcmNlbnQoKX1gKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoJ1x1NzdGRlx1NjczQVx1NURGMlx1NTA1Q1x1NkI2Mlx1RkYwQ1x1NzBCOVx1NTFGQlx1NUYwMFx1NTlDQlx1NjMxNlx1NzdGRicpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5lbHMuY3ljbGUpIHtcclxuICAgICAgY29uc3Qgc2Vjb25kcyA9IE1hdGgubWF4KDEsIE1hdGgucm91bmQodGhpcy5pbnRlcnZhbE1zIC8gMTAwMCkpO1xyXG4gICAgICB0aGlzLmVscy5jeWNsZS50ZXh0Q29udGVudCA9IGAke3NlY29uZHN9c2A7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5lbHMuc3RhdHVzVGFnKSB7XHJcbiAgICAgIGNvbnN0IGVsID0gdGhpcy5lbHMuc3RhdHVzVGFnIGFzIEhUTUxFbGVtZW50O1xyXG4gICAgICBlbC5pbm5lckhUTUwgPSAnJztcclxuICAgICAgXHJcbiAgICAgIC8vIFx1NzlGQlx1OTY2NFx1NjI0MFx1NjcwOVx1NzJCNlx1NjAwMVx1N0M3QlxyXG4gICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdwaWxsLXJ1bm5pbmcnLCAncGlsbC1jb2xsYXBzZWQnKTtcclxuICAgICAgXHJcbiAgICAgIGNvbnN0IGljbyA9IHRoaXMuaXNDb2xsYXBzZWQgPyAnY2xvc2UnIDogKHRoaXMuaXNNaW5pbmcgPyAnYm9sdCcgOiAnY2xvY2snKTtcclxuICAgICAgdHJ5IHsgZWwuYXBwZW5kQ2hpbGQocmVuZGVySWNvbihpY28gYXMgYW55LCB7IHNpemU6IDE2IH0pKTsgfSBjYXRjaCB7fVxyXG4gICAgICBlbC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0aGlzLmlzQ29sbGFwc2VkID8gJ1x1NTc0RFx1NTg0QycgOiAodGhpcy5pc01pbmluZyA/ICdcdThGRDBcdTg4NENcdTRFMkQnIDogJ1x1NUY4NVx1NjczQScpKSk7XHJcbiAgICAgIFxyXG4gICAgICAvLyBcdTZERkJcdTUyQTBcdTVCRjlcdTVFOTRcdTc2ODRcdTUyQThcdTYwMDFcdTY4MzdcdTVGMEZcdTdDN0JcclxuICAgICAgaWYgKHRoaXMuaXNDb2xsYXBzZWQpIHtcclxuICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKCdwaWxsLWNvbGxhcHNlZCcpO1xyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaXNNaW5pbmcpIHtcclxuICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKCdwaWxsLXJ1bm5pbmcnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy51cGRhdGVDb250cm9scygpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBiZWdpbkNvbGxhcHNlQ291bnRkb3duKHNlY29uZHM6IG51bWJlcikge1xyXG4gICAgdGhpcy5jbGVhckNvbGxhcHNlVGltZXIoKTtcclxuICAgIHRoaXMuaXNDb2xsYXBzZWQgPSB0cnVlO1xyXG4gICAgdGhpcy5jb2xsYXBzZVJlbWFpbmluZyA9IE1hdGgubWF4KDAsIE1hdGguZmxvb3Ioc2Vjb25kcykpO1xyXG4gICAgdGhpcy5zZXRTdGF0dXNNZXNzYWdlKGBcdTc3RkZcdTkwNTNcdTU3NERcdTU4NENcdUZGMENcdTUyNjlcdTRGNTkgJHt0aGlzLmNvbGxhcHNlUmVtYWluaW5nfXNgKTtcclxuICAgIHRoaXMudXBkYXRlQ29udHJvbHMoKTtcclxuICAgIHRoaXMuY29sbGFwc2VUaW1lciA9IHdpbmRvdy5zZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgIHRoaXMuY29sbGFwc2VSZW1haW5pbmcgPSBNYXRoLm1heCgwLCB0aGlzLmNvbGxhcHNlUmVtYWluaW5nIC0gMSk7XHJcbiAgICAgIGlmICh0aGlzLmNvbGxhcHNlUmVtYWluaW5nIDw9IDApIHtcclxuICAgICAgICB0aGlzLmNsZWFyQ29sbGFwc2VUaW1lcigpO1xyXG4gICAgICAgIHRoaXMuaXNDb2xsYXBzZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoJ1x1NTc0RFx1NTg0Q1x1ODlFM1x1OTY2NFx1RkYwQ1x1NTNFRlx1OTFDRFx1NjVCMFx1NTQyRlx1NTJBOFx1NzdGRlx1NjczQScpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlQ29udHJvbHMoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoYFx1NzdGRlx1OTA1M1x1NTc0RFx1NTg0Q1x1RkYwQ1x1NTI2OVx1NEY1OSAke3RoaXMuY29sbGFwc2VSZW1haW5pbmd9c2ApO1xyXG4gICAgICB9XHJcbiAgICB9LCAxMDAwKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgY2xlYXJDb2xsYXBzZVRpbWVyKCkge1xyXG4gICAgaWYgKHRoaXMuY29sbGFwc2VUaW1lciAhPT0gbnVsbCkge1xyXG4gICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aGlzLmNvbGxhcHNlVGltZXIpO1xyXG4gICAgICB0aGlzLmNvbGxhcHNlVGltZXIgPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBsYXN0TWlsZXN0b25lID0gMDtcclxuXHJcbiAgcHJpdmF0ZSB1cGRhdGVQcm9ncmVzcygpIHtcclxuICAgIGlmICghdGhpcy5lbHMuZmlsbCB8fCAhdGhpcy5lbHMucGVyY2VudCkgcmV0dXJuO1xyXG4gICAgY29uc3QgcGN0ID0gdGhpcy5jYXJ0Q2FwID4gMCA/IE1hdGgubWluKDEsIHRoaXMuY2FydEFtdCAvIHRoaXMuY2FydENhcCkgOiAwO1xyXG4gICAgY29uc3QgcGN0SW50ID0gTWF0aC5yb3VuZChwY3QgKiAxMDApO1xyXG4gICAgXHJcbiAgICB0aGlzLmVscy5maWxsLnN0eWxlLndpZHRoID0gYCR7cGN0SW50fSVgO1xyXG4gICAgdGhpcy5lbHMucGVyY2VudC50ZXh0Q29udGVudCA9IGAke3BjdEludH0lYDtcclxuICAgIFxyXG4gICAgLy8gXHU1NzA2XHU3M0FGXHU5ODlDXHU4MjcyXHU2RTEwXHU1M0Q4XHVGRjFBXHU3RDJCXHU4MjcyIC0+IFx1ODRERFx1ODI3MiAtPiBcdTkxRDFcdTgyNzJcclxuICAgIGxldCByaW5nQ29sb3IgPSAnIzdCMkNGNSc7IC8vIFx1N0QyQlx1ODI3MlxyXG4gICAgaWYgKHBjdCA+PSAwLjc1KSB7XHJcbiAgICAgIHJpbmdDb2xvciA9ICcjZjZjNDQ1JzsgLy8gXHU5MUQxXHU4MjcyXHJcbiAgICB9IGVsc2UgaWYgKHBjdCA+PSAwLjUpIHtcclxuICAgICAgcmluZ0NvbG9yID0gJyMyQzg5RjUnOyAvLyBcdTg0RERcdTgyNzJcclxuICAgIH1cclxuICAgIFxyXG4gICAgaWYgKHRoaXMuZWxzLnJpbmcpIHtcclxuICAgICAgY29uc3QgZGVnID0gTWF0aC5yb3VuZChwY3QgKiAzNjApO1xyXG4gICAgICAodGhpcy5lbHMucmluZyBhcyBIVE1MRWxlbWVudCkuc3R5bGUuYmFja2dyb3VuZCA9IGBjb25pYy1ncmFkaWVudCgke3JpbmdDb2xvcn0gJHtkZWd9ZGVnLCByZ2JhKDI1NSwyNTUsMjU1LC4wOCkgMGRlZylgO1xyXG4gICAgICBcclxuICAgICAgLy8gXHU2RUUxXHU4RjdEXHU2NUY2XHU2MzAxXHU3RUVEXHU5NUVBXHU4MDAwXHJcbiAgICAgIGlmIChwY3QgPj0gMSkge1xyXG4gICAgICAgIHRoaXMuZWxzLnJpbmcuY2xhc3NMaXN0LmFkZCgncmluZy1mdWxsJyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5lbHMucmluZy5jbGFzc0xpc3QucmVtb3ZlKCdyaW5nLWZ1bGwnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpZiAodGhpcy5lbHMucmluZ1BjdCkgdGhpcy5lbHMucmluZ1BjdC50ZXh0Q29udGVudCA9IGAke3BjdEludH0lYDtcclxuICAgIFxyXG4gICAgLy8gXHU5MUNDXHU3QTBCXHU3ODkxXHU4MTA5XHU1MUIyXHU3Mjc5XHU2NTQ4XHJcbiAgICBjb25zdCBtaWxlc3RvbmVzID0gWzI1LCA1MCwgNzUsIDEwMF07XHJcbiAgICBmb3IgKGNvbnN0IG1pbGVzdG9uZSBvZiBtaWxlc3RvbmVzKSB7XHJcbiAgICAgIGlmIChwY3RJbnQgPj0gbWlsZXN0b25lICYmIHRoaXMubGFzdE1pbGVzdG9uZSA8IG1pbGVzdG9uZSkge1xyXG4gICAgICAgIHRoaXMudHJpZ2dlck1pbGVzdG9uZVB1bHNlKG1pbGVzdG9uZSk7XHJcbiAgICAgICAgdGhpcy5sYXN0TWlsZXN0b25lID0gbWlsZXN0b25lO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIFx1NUY1M1x1ODhDNVx1OEY3RFx1NzM4N1x1NEUwQlx1OTY0RFx1RkYwOFx1NjUzNlx1NzdGRlx1NTQwRVx1RkYwOVx1OTFDRFx1N0Y2RVx1OTFDQ1x1N0EwQlx1Nzg5MVxyXG4gICAgaWYgKHBjdEludCA8IHRoaXMubGFzdE1pbGVzdG9uZSAtIDEwKSB7XHJcbiAgICAgIHRoaXMubGFzdE1pbGVzdG9uZSA9IE1hdGguZmxvb3IocGN0SW50IC8gMjUpICogMjU7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIDkwJVx1OEI2Nlx1NTQ0QVx1NjNEMFx1NzkzQVxyXG4gICAgaWYgKHBjdEludCA+PSA5MCAmJiBwY3RJbnQgPCAxMDApIHtcclxuICAgICAgaWYgKCF0aGlzLmVscy5zdGF0dXNUZXh0Py50ZXh0Q29udGVudD8uaW5jbHVkZXMoJ1x1NTM3M1x1NUMwNlx1NkVFMVx1OEY3RCcpKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0dXNNZXNzYWdlKCdcdTI2QTBcdUZFMEYgXHU3N0ZGXHU4RjY2XHU1MzczXHU1QzA2XHU2RUUxXHU4RjdEXHVGRjBDXHU1RUZBXHU4QkFFXHU2NTM2XHU3N0ZGJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgaWYgKHRoaXMucGVuZGluZyAhPT0gJ2NvbGxlY3QnICYmIHRoaXMuZWxzLmNvbGxlY3QpIHtcclxuICAgICAgdGhpcy5lbHMuY29sbGVjdC5kaXNhYmxlZCA9IHRoaXMucGVuZGluZyA9PT0gJ2NvbGxlY3QnIHx8IHRoaXMuY2FydEFtdCA8PSAwO1xyXG4gICAgICBcclxuICAgICAgLy8gXHU1M0VGXHU2NTM2XHU3N0ZGXHU2NUY2XHU2REZCXHU1MkEwXHU4MEZEXHU5MUNGXHU3Mjc5XHU2NTQ4XHJcbiAgICAgIGlmICh0aGlzLmNhcnRBbXQgPiAwICYmICF0aGlzLmVscy5jb2xsZWN0LmRpc2FibGVkKSB7XHJcbiAgICAgICAgdGhpcy5lbHMuY29sbGVjdC5jbGFzc0xpc3QuYWRkKCdidG4tZW5lcmd5Jyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5lbHMuY29sbGVjdC5jbGFzc0xpc3QucmVtb3ZlKCdidG4tZW5lcmd5Jyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gXHU2NkY0XHU2NUIwXHU3N0ZGXHU3N0YzXHU2NTcwXHU5MUNGXHJcbiAgICB0aGlzLnVwZGF0ZVNoYXJkcyhwY3QpO1xyXG4gICAgXHJcbiAgICAvLyBcdTY2RjRcdTY1QjBcdTUxNjhcdTYwNkZcdTgwQ0NcdTY2NkZcdTcyQjZcdTYwMDFcclxuICAgIHRoaXMudXBkYXRlSG9sb2dyYW1TdGF0ZSgpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB0cmlnZ2VyTWlsZXN0b25lUHVsc2UobWlsZXN0b25lOiBudW1iZXIpIHtcclxuICAgIGlmICh0aGlzLmVscy5yaW5nKSB7XHJcbiAgICAgIHRoaXMuZWxzLnJpbmcuY2xhc3NMaXN0LmFkZCgnbWlsZXN0b25lLXB1bHNlJyk7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5lbHMucmluZz8uY2xhc3NMaXN0LnJlbW92ZSgnbWlsZXN0b25lLXB1bHNlJyksIDEwMDApO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpZiAodGhpcy5lbHMucmluZ1BjdCkge1xyXG4gICAgICB0aGlzLmVscy5yaW5nUGN0LmNsYXNzTGlzdC5hZGQoJ2ZsYXNoJyk7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5lbHMucmluZ1BjdD8uY2xhc3NMaXN0LnJlbW92ZSgnZmxhc2gnKSwgOTAwKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gXHU2NjNFXHU3OTNBXHU5MUNDXHU3QTBCXHU3ODkxXHU2RDg4XHU2MDZGXHJcbiAgICBzaG93VG9hc3QoYFx1RDgzQ1x1REZBRiBcdThGQkVcdTYyMTAgJHttaWxlc3RvbmV9JSBcdTg4QzVcdThGN0RcdTczODdcdUZGMDFgLCAnc3VjY2VzcycpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB1cGRhdGVIb2xvZ3JhbVN0YXRlKCkge1xyXG4gICAgaWYgKCF0aGlzLmVscy5ob2xvZ3JhbSkgcmV0dXJuO1xyXG4gICAgXHJcbiAgICAvLyBcdTc5RkJcdTk2NjRcdTYyNDBcdTY3MDlcdTcyQjZcdTYwMDFcdTdDN0JcclxuICAgIHRoaXMuZWxzLmhvbG9ncmFtLmNsYXNzTGlzdC5yZW1vdmUoJ2hvbG8taWRsZScsICdob2xvLW1pbmluZycsICdob2xvLWNvbGxhcHNlZCcpO1xyXG4gICAgXHJcbiAgICAvLyBcdTY4MzlcdTYzNkVcdTcyQjZcdTYwMDFcdTZERkJcdTUyQTBcdTVCRjlcdTVFOTRcdTc2ODRcdTdDN0JcclxuICAgIGlmICh0aGlzLmlzQ29sbGFwc2VkKSB7XHJcbiAgICAgIHRoaXMuZWxzLmhvbG9ncmFtLmNsYXNzTGlzdC5hZGQoJ2hvbG8tY29sbGFwc2VkJyk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNNaW5pbmcpIHtcclxuICAgICAgdGhpcy5lbHMuaG9sb2dyYW0uY2xhc3NMaXN0LmFkZCgnaG9sby1taW5pbmcnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuZWxzLmhvbG9ncmFtLmNsYXNzTGlzdC5hZGQoJ2hvbG8taWRsZScpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB1cGRhdGVTaGFyZHMobG9hZFBlcmNlbnQ6IG51bWJlcikge1xyXG4gICAgaWYgKCF0aGlzLmVscy5ob2xvZ3JhbSkgcmV0dXJuO1xyXG4gICAgXHJcbiAgICAvLyBcdThCQTFcdTdCOTdcdTVFOTRcdThCRTVcdTY2M0VcdTc5M0FcdTc2ODRcdTc3RkZcdTc3RjNcdTY1NzBcdTkxQ0ZcdUZGMDhcdTg4QzVcdThGN0RcdTczODdcdThEOEFcdTlBRDhcdUZGMENcdTc3RkZcdTc3RjNcdThEOEFcdTU5MUFcdUZGMDlcclxuICAgIC8vIDAtMjAlOiAyXHU0RTJBLCAyMC00MCU6IDRcdTRFMkEsIDQwLTYwJTogNlx1NEUyQSwgNjAtODAlOiA4XHU0RTJBLCA4MC0xMDAlOiAxMFx1NEUyQVxyXG4gICAgY29uc3QgdGFyZ2V0Q291bnQgPSBNYXRoLm1heCgyLCBNYXRoLm1pbigxMiwgTWF0aC5mbG9vcihsb2FkUGVyY2VudCAqIDEyKSArIDIpKTtcclxuICAgIFxyXG4gICAgLy8gXHU4M0I3XHU1M0Q2XHU1RjUzXHU1MjREXHU3N0ZGXHU3N0YzXHU1MTQzXHU3RDIwXHJcbiAgICBjb25zdCBjdXJyZW50U2hhcmRzID0gdGhpcy5lbHMuaG9sb2dyYW0ucXVlcnlTZWxlY3RvckFsbCgnLm1pbmUtc2hhcmQnKTtcclxuICAgIGNvbnN0IGN1cnJlbnRDb3VudCA9IGN1cnJlbnRTaGFyZHMubGVuZ3RoO1xyXG4gICAgXHJcbiAgICAvLyBcdTU5ODJcdTY3OUNcdTY1NzBcdTkxQ0ZcdTc2RjhcdTU0MENcdUZGMENcdTRFMERcdTUwNUFcdTU5MDRcdTc0MDZcclxuICAgIGlmIChjdXJyZW50Q291bnQgPT09IHRhcmdldENvdW50KSByZXR1cm47XHJcbiAgICBcclxuICAgIC8vIFx1OTcwMFx1ODk4MVx1NkRGQlx1NTJBMFx1NzdGRlx1NzdGM1xyXG4gICAgaWYgKGN1cnJlbnRDb3VudCA8IHRhcmdldENvdW50KSB7XHJcbiAgICAgIGNvbnN0IHRvQWRkID0gdGFyZ2V0Q291bnQgLSBjdXJyZW50Q291bnQ7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG9BZGQ7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IHNoYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgIHNoYXJkLmNsYXNzTmFtZSA9ICdtaW5lLXNoYXJkJztcclxuICAgICAgICBcclxuICAgICAgICAvLyBcdTk2OEZcdTY3M0FcdTRGNERcdTdGNkVcdTU0OENcdTU5MjdcdTVDMEZcclxuICAgICAgICBjb25zdCBwb3NpdGlvbnMgPSBbXHJcbiAgICAgICAgICB7IHRvcDogJzE4JScsIGxlZnQ6ICcxNiUnLCBkZWxheTogLTEuNCwgc2NhbGU6IDEgfSxcclxuICAgICAgICAgIHsgYm90dG9tOiAnMTYlJywgcmlnaHQ6ICcyMiUnLCBkZWxheTogLTMuMiwgc2NhbGU6IDAuNzQgfSxcclxuICAgICAgICAgIHsgdG9wOiAnMjYlJywgcmlnaHQ6ICczNCUnLCBkZWxheTogLTUuMSwgc2NhbGU6IDAuNSB9LFxyXG4gICAgICAgICAgeyB0b3A6ICc0MCUnLCBsZWZ0OiAnMjglJywgZGVsYXk6IC0yLjUsIHNjYWxlOiAwLjg1IH0sXHJcbiAgICAgICAgICB7IGJvdHRvbTogJzMwJScsIGxlZnQ6ICcxOCUnLCBkZWxheTogLTQuMSwgc2NhbGU6IDAuNjggfSxcclxuICAgICAgICAgIHsgdG9wOiAnMTUlJywgcmlnaHQ6ICcxNSUnLCBkZWxheTogLTEuOCwgc2NhbGU6IDAuOTIgfSxcclxuICAgICAgICAgIHsgYm90dG9tOiAnMjIlJywgcmlnaHQ6ICc0MCUnLCBkZWxheTogLTMuOCwgc2NhbGU6IDAuNzggfSxcclxuICAgICAgICAgIHsgdG9wOiAnNTAlJywgbGVmdDogJzEyJScsIGRlbGF5OiAtMi4yLCBzY2FsZTogMC42IH0sXHJcbiAgICAgICAgICB7IHRvcDogJzM1JScsIHJpZ2h0OiAnMjAlJywgZGVsYXk6IC00LjUsIHNjYWxlOiAwLjg4IH0sXHJcbiAgICAgICAgICB7IGJvdHRvbTogJzQwJScsIGxlZnQ6ICczNSUnLCBkZWxheTogLTMuNSwgc2NhbGU6IDAuNyB9LFxyXG4gICAgICAgICAgeyB0b3A6ICc2MCUnLCByaWdodDogJzI4JScsIGRlbGF5OiAtMi44LCBzY2FsZTogMC42NSB9LFxyXG4gICAgICAgICAgeyBib3R0b206ICc1MCUnLCByaWdodDogJzEyJScsIGRlbGF5OiAtNC44LCBzY2FsZTogMC44MiB9LFxyXG4gICAgICAgIF07XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgcG9zSW5kZXggPSAoY3VycmVudENvdW50ICsgaSkgJSBwb3NpdGlvbnMubGVuZ3RoO1xyXG4gICAgICAgIGNvbnN0IHBvcyA9IHBvc2l0aW9uc1twb3NJbmRleF07XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHBvcy50b3ApIHNoYXJkLnN0eWxlLnRvcCA9IHBvcy50b3A7XHJcbiAgICAgICAgaWYgKHBvcy5ib3R0b20pIHNoYXJkLnN0eWxlLmJvdHRvbSA9IHBvcy5ib3R0b207XHJcbiAgICAgICAgaWYgKHBvcy5sZWZ0KSBzaGFyZC5zdHlsZS5sZWZ0ID0gcG9zLmxlZnQ7XHJcbiAgICAgICAgaWYgKHBvcy5yaWdodCkgc2hhcmQuc3R5bGUucmlnaHQgPSBwb3MucmlnaHQ7XHJcbiAgICAgICAgc2hhcmQuc3R5bGUuYW5pbWF0aW9uRGVsYXkgPSBgJHtwb3MuZGVsYXl9c2A7XHJcbiAgICAgICAgc2hhcmQuc3R5bGUudHJhbnNmb3JtID0gYHNjYWxlKCR7cG9zLnNjYWxlfSlgO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFx1NkRGQlx1NTJBMFx1NkRFMVx1NTE2NVx1NTJBOFx1NzUzQlxyXG4gICAgICAgIHNoYXJkLnN0eWxlLm9wYWNpdHkgPSAnMCc7XHJcbiAgICAgICAgdGhpcy5lbHMuaG9sb2dyYW0uYXBwZW5kQ2hpbGQoc2hhcmQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFx1ODlFNlx1NTNEMVx1NkRFMVx1NTE2NVxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgc2hhcmQuc3R5bGUudHJhbnNpdGlvbiA9ICdvcGFjaXR5IDAuNXMgZWFzZSc7XHJcbiAgICAgICAgICBzaGFyZC5zdHlsZS5vcGFjaXR5ID0gJzAuMjYnO1xyXG4gICAgICAgIH0sIDUwKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gXHU5NzAwXHU4OTgxXHU3OUZCXHU5NjY0XHU3N0ZGXHU3N0YzXHJcbiAgICBlbHNlIGlmIChjdXJyZW50Q291bnQgPiB0YXJnZXRDb3VudCkge1xyXG4gICAgICBjb25zdCB0b1JlbW92ZSA9IGN1cnJlbnRDb3VudCAtIHRhcmdldENvdW50O1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvUmVtb3ZlOyBpKyspIHtcclxuICAgICAgICBjb25zdCBsYXN0U2hhcmQgPSBjdXJyZW50U2hhcmRzW2N1cnJlbnRTaGFyZHMubGVuZ3RoIC0gMSAtIGldO1xyXG4gICAgICAgIGlmIChsYXN0U2hhcmQpIHtcclxuICAgICAgICAgIChsYXN0U2hhcmQgYXMgSFRNTEVsZW1lbnQpLnN0eWxlLnRyYW5zaXRpb24gPSAnb3BhY2l0eSAwLjVzIGVhc2UnO1xyXG4gICAgICAgICAgKGxhc3RTaGFyZCBhcyBIVE1MRWxlbWVudCkuc3R5bGUub3BhY2l0eSA9ICcwJztcclxuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICBsYXN0U2hhcmQucmVtb3ZlKCk7XHJcbiAgICAgICAgICB9LCA1MDApO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB1cGRhdGVDb250cm9scygpIHtcclxuICAgIGNvbnN0IGlzQnVzeSA9IChrZXk6IFBlbmRpbmdBY3Rpb24pID0+IHRoaXMucGVuZGluZyA9PT0ga2V5O1xyXG4gICAgY29uc3Qgc2V0QnRuID0gKGJ0bjogSFRNTEJ1dHRvbkVsZW1lbnQgfCBudWxsLCBpY29uOiBhbnksIGxhYmVsOiBzdHJpbmcsIGRpc2FibGVkOiBib29sZWFuKSA9PiB7XHJcbiAgICAgIGlmICghYnRuKSByZXR1cm47XHJcbiAgICAgIGJ0bi5kaXNhYmxlZCA9IGRpc2FibGVkO1xyXG4gICAgICAvLyBrZWVwIGZpcnN0IGNoaWxkIGFzIGljb24gaWYgcHJlc2VudCwgb3RoZXJ3aXNlIGNyZWF0ZVxyXG4gICAgICBsZXQgaWNvbkhvc3QgPSBidG4ucXVlcnlTZWxlY3RvcignLmljb24nKTtcclxuICAgICAgaWYgKCFpY29uSG9zdCkge1xyXG4gICAgICAgIGJ0bi5pbnNlcnRCZWZvcmUocmVuZGVySWNvbihpY29uLCB7IHNpemU6IDE4IH0pLCBidG4uZmlyc3RDaGlsZCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gUmVwbGFjZSBleGlzdGluZyBpY29uIHdpdGggbmV3IG9uZSBpZiBpY29uIG5hbWUgZGlmZmVycyBieSByZS1yZW5kZXJpbmdcclxuICAgICAgICBjb25zdCBob3N0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgIGhvc3QuYXBwZW5kQ2hpbGQocmVuZGVySWNvbihpY29uLCB7IHNpemU6IDE4IH0pKTtcclxuICAgICAgICAvLyByZW1vdmUgb2xkIGljb24gd3JhcHBlciBhbmQgdXNlIG5ld1xyXG4gICAgICAgIGljb25Ib3N0LnBhcmVudEVsZW1lbnQ/LnJlcGxhY2VDaGlsZChob3N0LmZpcnN0Q2hpbGQgYXMgTm9kZSwgaWNvbkhvc3QpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIHNldCBsYWJlbCB0ZXh0IChwcmVzZXJ2ZSBpY29uKVxyXG4gICAgICAvLyByZW1vdmUgZXhpc3RpbmcgdGV4dCBub2Rlc1xyXG4gICAgICBBcnJheS5mcm9tKGJ0bi5jaGlsZE5vZGVzKS5mb3JFYWNoKChuLCBpZHgpID0+IHtcclxuICAgICAgICBpZiAoaWR4ID4gMCkgYnRuLnJlbW92ZUNoaWxkKG4pO1xyXG4gICAgICB9KTtcclxuICAgICAgYnRuLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGxhYmVsKSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHNldEJ0bih0aGlzLmVscy5zdGFydCwgJ3BsYXknLCBpc0J1c3koJ3N0YXJ0JykgPyAnXHU1NDJGXHU1MkE4XHU0RTJEXHUyMDI2JyA6IHRoaXMuaXNNaW5pbmcgPyAnXHU2MzE2XHU3N0ZGXHU0RTJEJyA6ICdcdTVGMDBcdTU5Q0JcdTYzMTZcdTc3RkYnLCBpc0J1c3koJ3N0YXJ0JykgfHwgdGhpcy5pc01pbmluZyB8fCB0aGlzLmlzQ29sbGFwc2VkKTtcclxuICAgIHNldEJ0bih0aGlzLmVscy5zdG9wLCAnc3RvcCcsIGlzQnVzeSgnc3RvcCcpID8gJ1x1NTA1Q1x1NkI2Mlx1NEUyRFx1MjAyNicgOiAnXHU1MDVDXHU2QjYyJywgaXNCdXN5KCdzdG9wJykgfHwgIXRoaXMuaXNNaW5pbmcpO1xyXG4gICAgc2V0QnRuKHRoaXMuZWxzLmNvbGxlY3QsICdjb2xsZWN0JywgaXNCdXN5KCdjb2xsZWN0JykgPyAnXHU2NTM2XHU5NkM2XHU0RTJEXHUyMDI2JyA6ICdcdTY1MzZcdTc3RkYnLCBpc0J1c3koJ2NvbGxlY3QnKSB8fCB0aGlzLmNhcnRBbXQgPD0gMCk7XHJcbiAgICBzZXRCdG4odGhpcy5lbHMucmVwYWlyLCAnd3JlbmNoJywgaXNCdXN5KCdyZXBhaXInKSA/ICdcdTRGRUVcdTc0MDZcdTRFMkRcdTIwMjYnIDogJ1x1NEZFRVx1NzQwNicsIGlzQnVzeSgncmVwYWlyJykgfHwgIXRoaXMuaXNDb2xsYXBzZWQpO1xyXG4gICAgc2V0QnRuKHRoaXMuZWxzLnN0YXR1c0J0biwgJ3JlZnJlc2gnLCBpc0J1c3koJ3N0YXR1cycpID8gJ1x1NTIzN1x1NjVCMFx1NEUyRFx1MjAyNicgOiAnXHU1MjM3XHU2NUIwXHU3MkI2XHU2MDAxJywgaXNCdXN5KCdzdGF0dXMnKSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNldFN0YXR1c01lc3NhZ2UodGV4dDogc3RyaW5nKSB7XHJcbiAgICBpZiAoIXRoaXMuZWxzLnN0YXR1c1RleHQpIHJldHVybjtcclxuICAgIHRoaXMuZWxzLnN0YXR1c1RleHQudGV4dENvbnRlbnQgPSB0ZXh0O1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBsb2dFdmVudChtc2c6IHN0cmluZykge1xyXG4gICAgaWYgKCF0aGlzLmVscz8uZXZlbnRzKSByZXR1cm47XHJcbiAgICBjb25zdCBsaW5lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xyXG4gICAgY29uc3QgaGggPSBTdHJpbmcobm93LmdldEhvdXJzKCkpLnBhZFN0YXJ0KDIsJzAnKTtcclxuICAgIGNvbnN0IG1tID0gU3RyaW5nKG5vdy5nZXRNaW51dGVzKCkpLnBhZFN0YXJ0KDIsJzAnKTtcclxuICAgIGNvbnN0IHNzID0gU3RyaW5nKG5vdy5nZXRTZWNvbmRzKCkpLnBhZFN0YXJ0KDIsJzAnKTtcclxuICAgIFxyXG4gICAgLy8gXHU2ODM5XHU2MzZFXHU2RDg4XHU2MDZGXHU3QzdCXHU1NzhCXHU2REZCXHU1MkEwXHU0RTBEXHU1NDBDXHU3Njg0XHU2ODM3XHU1RjBGXHU3QzdCXHJcbiAgICBsZXQgZXZlbnRDbGFzcyA9ICdldmVudCc7XHJcbiAgICBpZiAobXNnLmluY2x1ZGVzKCdcdTY2QjRcdTUxRkInKSkge1xyXG4gICAgICBldmVudENsYXNzICs9ICcgZXZlbnQtY3JpdGljYWwnO1xyXG4gICAgfSBlbHNlIGlmIChtc2cuaW5jbHVkZXMoJ1x1NTc0RFx1NTg0QycpIHx8IG1zZy5pbmNsdWRlcygnXHU2M0EwXHU1OTNBJykpIHtcclxuICAgICAgZXZlbnRDbGFzcyArPSAnIGV2ZW50LXdhcm5pbmcnO1xyXG4gICAgfSBlbHNlIGlmIChtc2cuaW5jbHVkZXMoJ1x1NjUzNlx1OTZDNicpIHx8IG1zZy5pbmNsdWRlcygnXHU2MjEwXHU1MjlGJykpIHtcclxuICAgICAgZXZlbnRDbGFzcyArPSAnIGV2ZW50LXN1Y2Nlc3MnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZXZlbnRDbGFzcyArPSAnIGV2ZW50LW5vcm1hbCc7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGxpbmUuY2xhc3NOYW1lID0gZXZlbnRDbGFzcztcclxuICAgIGxpbmUudGV4dENvbnRlbnQgPSBgWyR7aGh9OiR7bW19OiR7c3N9XSAke21zZ31gO1xyXG4gICAgXHJcbiAgICAvLyBcdTZERkJcdTUyQTBcdTZFRDFcdTUxNjVcdTUyQThcdTc1M0JcclxuICAgIGxpbmUuc3R5bGUub3BhY2l0eSA9ICcwJztcclxuICAgIGxpbmUuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVgoMjBweCknO1xyXG4gICAgdGhpcy5lbHMuZXZlbnRzLnByZXBlbmQobGluZSk7XHJcbiAgICBcclxuICAgIC8vIFx1ODlFNlx1NTNEMVx1NTJBOFx1NzUzQlxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIGxpbmUuc3R5bGUudHJhbnNpdGlvbiA9ICdvcGFjaXR5IDAuM3MgZWFzZSwgdHJhbnNmb3JtIDAuM3MgZWFzZSc7XHJcbiAgICAgIGxpbmUuc3R5bGUub3BhY2l0eSA9ICcwLjknO1xyXG4gICAgICBsaW5lLnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGVYKDApJztcclxuICAgIH0sIDEwKTtcclxuICAgIFxyXG4gICAgLy8gXHU2NkI0XHU1MUZCXHU0RThCXHU0RUY2XHU2REZCXHU1MkEwXHU5NUVBXHU1MTQ5XHU2NTQ4XHU2NzlDXHJcbiAgICBpZiAobXNnLmluY2x1ZGVzKCdcdTY2QjRcdTUxRkInKSkge1xyXG4gICAgICBsaW5lLmNsYXNzTGlzdC5hZGQoJ2ZsYXNoJyk7XHJcbiAgICAgIC8vIFx1ODlFNlx1NTNEMVx1NTE2OFx1NUM0MFx1NjZCNFx1NTFGQlx1NzI3OVx1NjU0OFxyXG4gICAgICB0aGlzLnRyaWdnZXJDcml0aWNhbEVmZmVjdCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB0cmlnZ2VyQ3JpdGljYWxFZmZlY3QoKSB7XHJcbiAgICAvLyBcdTU3MDZcdTczQUZcdTk1RUFcdTc1MzVcdTY1NDhcdTY3OUNcclxuICAgIGlmICh0aGlzLmVscy5yaW5nKSB7XHJcbiAgICAgIHRoaXMuZWxzLnJpbmcuY2xhc3NMaXN0LmFkZCgncmluZy1wdWxzZScpO1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuZWxzLnJpbmc/LmNsYXNzTGlzdC5yZW1vdmUoJ3JpbmctcHVsc2UnKSwgNjAwKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gXHU1MTY4XHU2MDZGXHU4MENDXHU2NjZGXHU5NUVBXHU3MEMxXHJcbiAgICBpZiAodGhpcy5lbHMuaG9sb2dyYW0pIHtcclxuICAgICAgdGhpcy5lbHMuaG9sb2dyYW0uY2xhc3NMaXN0LmFkZCgnY3JpdGljYWwtZmxhc2gnKTtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmVscy5ob2xvZ3JhbT8uY2xhc3NMaXN0LnJlbW92ZSgnY3JpdGljYWwtZmxhc2gnKSwgNDAwKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgZm9ybWF0UGVyY2VudCgpIHtcclxuICAgIGNvbnN0IHBjdCA9IHRoaXMuY2FydENhcCA+IDAgPyBNYXRoLm1pbigxLCB0aGlzLmNhcnRBbXQgLyB0aGlzLmNhcnRDYXApIDogMDtcclxuICAgIHJldHVybiBgJHtNYXRoLnJvdW5kKHBjdCAqIDEwMCl9JWA7XHJcbiAgfVxyXG59IiwgImltcG9ydCB7IE5ldHdvcmtNYW5hZ2VyIH0gZnJvbSAnLi4vY29yZS9OZXR3b3JrTWFuYWdlcic7XG5pbXBvcnQgeyBodG1sLCBxcyB9IGZyb20gJy4uL3V0aWxzL2RvbSc7XG5pbXBvcnQgeyByZW5kZXJOYXYgfSBmcm9tICcuLi9jb21wb25lbnRzL05hdic7XG5pbXBvcnQgeyBSZWFsdGltZUNsaWVudCB9IGZyb20gJy4uL2NvcmUvUmVhbHRpbWVDbGllbnQnO1xuaW1wb3J0IHsgcmVuZGVyUmVzb3VyY2VCYXIgfSBmcm9tICcuLi9jb21wb25lbnRzL1Jlc291cmNlQmFyJztcbmltcG9ydCB7IHNob3dUb2FzdCB9IGZyb20gJy4uL2NvbXBvbmVudHMvVG9hc3QnO1xuaW1wb3J0IHsgcmVuZGVySWNvbiB9IGZyb20gJy4uL2NvbXBvbmVudHMvSWNvbic7XG5cbmV4cG9ydCBjbGFzcyBXYXJlaG91c2VTY2VuZSB7XG4gIGFzeW5jIG1vdW50KHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgcm9vdC5pbm5lckhUTUwgPSAnJztcbiAgICByb290LmFwcGVuZENoaWxkKHJlbmRlck5hdignd2FyZWhvdXNlJykpO1xuICAgIGNvbnN0IGJhciA9IHJlbmRlclJlc291cmNlQmFyKCk7XG4gICAgcm9vdC5hcHBlbmRDaGlsZChiYXIucm9vdCk7XG5cbiAgICBjb25zdCB2aWV3ID0gaHRtbChgXG4gICAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyIGdyaWQtMlwiIHN0eWxlPVwiY29sb3I6I2ZmZjtcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQgZmFkZS1pblwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIiBzdHlsZT1cImp1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2FsaWduLWl0ZW1zOmNlbnRlcjtcIj5cbiAgICAgICAgICAgIDxoMyBzdHlsZT1cIm1hcmdpbjowO2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjhweDtcIj48c3BhbiBkYXRhLWljbz1cIndhcmVob3VzZVwiPjwvc3Bhbj5cdTRFRDNcdTVFOTM8L2gzPlxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInJlZnJlc2hcIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiPjxzcGFuIGRhdGEtaWNvPVwicmVmcmVzaFwiPjwvc3Bhbj5cdTUyMzdcdTY1QjA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IHN0eWxlPVwibWFyZ2luLXRvcDoxMnB4O1wiPlxuICAgICAgICAgICAgPGRldGFpbHMgb3Blbj5cbiAgICAgICAgICAgICAgPHN1bW1hcnk+PHNwYW4gZGF0YS1pY289XCJib3hcIj48L3NwYW4+XHU2MjExXHU3Njg0XHU5MDUzXHU1MTc3PC9zdW1tYXJ5PlxuICAgICAgICAgICAgICA8ZGl2IGlkPVwibGlzdFwiIHN0eWxlPVwibWFyZ2luLXRvcDo4cHg7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6OHB4O1wiPjwvZGl2PlxuICAgICAgICAgICAgPC9kZXRhaWxzPlxuICAgICAgICAgICAgPGRldGFpbHM+XG4gICAgICAgICAgICAgIDxzdW1tYXJ5PjxzcGFuIGRhdGEtaWNvPVwibGlzdFwiPjwvc3Bhbj5cdTkwNTNcdTUxNzdcdTZBMjFcdTY3N0Y8L3N1bW1hcnk+XG4gICAgICAgICAgICAgIDxkaXYgaWQ9XCJ0cGxzXCIgc3R5bGU9XCJtYXJnaW4tdG9wOjhweDtkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDo4cHg7XCI+PC9kaXY+XG4gICAgICAgICAgICA8L2RldGFpbHM+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgYCk7XG4gICAgcm9vdC5hcHBlbmRDaGlsZCh2aWV3KTtcblxuICAgIGNvbnN0IHRva2VuID0gKE5ldHdvcmtNYW5hZ2VyIGFzIGFueSkuSVsndG9rZW4nXTtcbiAgICBpZiAodG9rZW4pIFJlYWx0aW1lQ2xpZW50LkkuY29ubmVjdCh0b2tlbik7XG5cbiAgICBjb25zdCBsaXN0ID0gcXModmlldywgJyNsaXN0Jyk7XG4gICAgY29uc3QgdHBsQ29udGFpbmVyID0gcXModmlldywgJyN0cGxzJyk7XG4gICAgY29uc3QgcmVmcmVzaEJ0biA9IHFzPEhUTUxCdXR0b25FbGVtZW50Pih2aWV3LCAnI3JlZnJlc2gnKTtcblxuICAgIGNvbnN0IG1vdW50SWNvbnMgPSAocm9vdEVsOiBFbGVtZW50KSA9PiB7XG4gICAgICByb290RWwucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtaWNvXScpXG4gICAgICAgIC5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICAgIGNvbnN0IG5hbWUgPSAoZWwgYXMgSFRNTEVsZW1lbnQpLmdldEF0dHJpYnV0ZSgnZGF0YS1pY28nKSBhcyBhbnk7XG4gICAgICAgICAgdHJ5IHsgZWwuYXBwZW5kQ2hpbGQocmVuZGVySWNvbihuYW1lLCB7IHNpemU6IDIwIH0pKTsgfSBjYXRjaCB7fVxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIG1vdW50SWNvbnModmlldyk7XG5cbiAgICBjb25zdCBnZXRSYXJpdHkgPSAoaXRlbTogYW55LCB0cGw/OiBhbnkpOiB7IGtleTogJ2NvbW1vbid8J3JhcmUnfCdlcGljJ3wnbGVnZW5kYXJ5JzsgdGV4dDogc3RyaW5nIH0gPT4ge1xuICAgICAgY29uc3QgciA9ICh0cGwgJiYgKHRwbC5yYXJpdHkgfHwgdHBsLnRpZXIpKSB8fCBpdGVtLnJhcml0eTtcbiAgICAgIGNvbnN0IGxldmVsID0gTnVtYmVyKGl0ZW0ubGV2ZWwpIHx8IDA7XG4gICAgICBpZiAodHlwZW9mIHIgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGNvbnN0IGsgPSByLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGlmIChbJ2xlZ2VuZGFyeScsJ2VwaWMnLCdyYXJlJywnY29tbW9uJ10uaW5jbHVkZXMoaykpIHtcbiAgICAgICAgICByZXR1cm4geyBrZXk6IGsgYXMgYW55LCB0ZXh0OiBrID09PSAnbGVnZW5kYXJ5JyA/ICdcdTRGMjBcdThCRjQnIDogayA9PT0gJ2VwaWMnID8gJ1x1NTNGMlx1OEJENycgOiBrID09PSAncmFyZScgPyAnXHU3QTAwXHU2NzA5JyA6ICdcdTY2NkVcdTkwMUEnIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChsZXZlbCA+PSAxMikgcmV0dXJuIHsga2V5OiAnbGVnZW5kYXJ5JywgdGV4dDogJ1x1NEYyMFx1OEJGNCcgfTtcbiAgICAgIGlmIChsZXZlbCA+PSA4KSByZXR1cm4geyBrZXk6ICdlcGljJywgdGV4dDogJ1x1NTNGMlx1OEJENycgfTtcbiAgICAgIGlmIChsZXZlbCA+PSA0KSByZXR1cm4geyBrZXk6ICdyYXJlJywgdGV4dDogJ1x1N0EwMFx1NjcwOScgfTtcbiAgICAgIHJldHVybiB7IGtleTogJ2NvbW1vbicsIHRleHQ6ICdcdTY2NkVcdTkwMUEnIH07XG4gICAgfTtcblxuICAgIGNvbnN0IGZvcm1hdFRpbWUgPSAodHM6IG51bWJlcikgPT4ge1xuICAgICAgdHJ5IHsgcmV0dXJuIG5ldyBEYXRlKHRzKS50b0xvY2FsZVN0cmluZygpOyB9IGNhdGNoIHsgcmV0dXJuICcnICsgdHM7IH1cbiAgICB9O1xuXG4gICAgY29uc3QgbG9hZCA9IGFzeW5jICgpID0+IHtcbiAgICAgIHJlZnJlc2hCdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgcmVmcmVzaEJ0bi5pbm5lckhUTUwgPSAnPHNwYW4gZGF0YS1pY289XCJyZWZyZXNoXCI+PC9zcGFuPlx1NTIzN1x1NjVCMFx1NEUyRFx1MjAyNic7XG4gICAgICBtb3VudEljb25zKHJlZnJlc2hCdG4pO1xuICAgICAgYXdhaXQgYmFyLnVwZGF0ZSgpO1xuICAgICAgbGlzdC5pbm5lckhUTUwgPSAnJztcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSBsaXN0LmFwcGVuZENoaWxkKGh0bWwoJzxkaXYgY2xhc3M9XCJza2VsZXRvblwiPjwvZGl2PicpKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IFtkYXRhLCB0cGxzXSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgICBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyBpdGVtczogYW55W10gfT4oJy9pdGVtcycpLFxuICAgICAgICAgIE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IHRlbXBsYXRlczogYW55W10gfT4oJy9pdGVtcy90ZW1wbGF0ZXMnKS5jYXRjaCgoKSA9PiAoeyB0ZW1wbGF0ZXM6IFtdIH0pKVxuICAgICAgICBdKTtcbiAgICAgICAgY29uc3QgdHBsQnlJZDogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICAgICAgICBmb3IgKGNvbnN0IHQgb2YgKHRwbHMudGVtcGxhdGVzIHx8IFtdKSkgdHBsQnlJZFt0LmlkXSA9IHQ7XG4gICAgICAgIGxpc3QuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIGlmICghZGF0YS5pdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgICBsaXN0LmFwcGVuZENoaWxkKGh0bWwoJzxkaXYgc3R5bGU9XCJvcGFjaXR5Oi44O1wiPlx1NjY4Mlx1NjVFMFx1OTA1M1x1NTE3N1x1RkYwQ1x1NUMxRFx1OEJENVx1NTkxQVx1NjMxNlx1NzdGRlx1NjIxNlx1NjNBMFx1NTkzQVx1NEVFNVx1ODNCN1x1NTNENlx1NjZGNFx1NTkxQVx1OEQ0NFx1NkU5MDwvZGl2PicpKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgZGF0YS5pdGVtcykge1xuICAgICAgICAgIGNvbnN0IHRwbCA9IHRwbEJ5SWRbaXRlbS50ZW1wbGF0ZUlkXTtcbiAgICAgICAgICBjb25zdCByYXJpdHkgPSBnZXRSYXJpdHkoaXRlbSwgdHBsKTtcbiAgICAgICAgICBjb25zdCBuYW1lID0gKHRwbCAmJiAodHBsLm5hbWUgfHwgdHBsLmlkKSkgfHwgaXRlbS50ZW1wbGF0ZUlkO1xuXG4gICAgICAgICAgY29uc3Qgcm93ID0gaHRtbChgXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaXRlbS1jYXJkIGhvdmVyLWxpZnQgJHtcbiAgICAgICAgICAgICAgcmFyaXR5LmtleSA9PT0gJ2xlZ2VuZGFyeScgPyAncmFyaXR5LW91dGxpbmUtbGVnZW5kYXJ5JyA6IHJhcml0eS5rZXkgPT09ICdlcGljJyA/ICdyYXJpdHktb3V0bGluZS1lcGljJyA6IHJhcml0eS5rZXkgPT09ICdyYXJlJyA/ICdyYXJpdHktb3V0bGluZS1yYXJlJyA6ICdyYXJpdHktb3V0bGluZS1jb21tb24nXG4gICAgICAgICAgICB9XCIgZGF0YS1yYXJpdHk9XCIke3Jhcml0eS5rZXl9XCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIiBzdHlsZT1cImp1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2FsaWduLWl0ZW1zOmZsZXgtc3RhcnQ7Z2FwOjEwcHg7XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cImRpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjRweDtmbGV4OjE7bWluLXdpZHRoOjA7XCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZGlzcGxheTpmbGV4O2ZsZXgtd3JhcDp3cmFwO2dhcDo2cHg7YWxpZ24taXRlbXM6Y2VudGVyO1wiPlxuICAgICAgICAgICAgICAgICAgICA8c3Ryb25nIHN0eWxlPVwiZm9udC1zaXplOjE1cHg7d2hpdGUtc3BhY2U6bm93cmFwO2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjZweDtcIj48c3BhbiBkYXRhLWljbz1cIm9yZVwiPjwvc3Bhbj4ke25hbWV9PC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYmFkZ2UgcmFyaXR5LSR7cmFyaXR5LmtleX1cIj48aT48L2k+JHtyYXJpdHkudGV4dH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICR7aXRlbS5pc0VxdWlwcGVkID8gJzxzcGFuIGNsYXNzPVwicGlsbFwiPlx1NURGMlx1ODhDNVx1NTkwNzwvc3Bhbj4nIDogJyd9XG4gICAgICAgICAgICAgICAgICAgICR7aXRlbS5pc0xpc3RlZCA/ICc8c3BhbiBjbGFzcz1cInBpbGxcIj5cdTYzMDJcdTUzNTVcdTRFMkQ8L3NwYW4+JyA6ICcnfVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwib3BhY2l0eTouODU7ZGlzcGxheTpmbGV4O2ZsZXgtd3JhcDp3cmFwO2dhcDo4cHg7XCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuPlx1N0I0OVx1N0VBNyBMdi4ke2l0ZW0ubGV2ZWx9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInBpbGxcIj5cdTVCOUVcdTRGOEIgJHtpdGVtLmlkfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgJHt0cGw/LmNhdGVnb3J5ID8gYDxzcGFuIGNsYXNzPVwicGlsbFwiPiR7dHBsLmNhdGVnb3J5fTwvc3Bhbj5gIDogJyd9XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYWN0aW9uc1wiPlxuICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biAke2l0ZW0uaXNFcXVpcHBlZCA/ICdidG4tc2VsbCcgOiAnYnRuLWJ1eSd9XCIgZGF0YS1hY3Q9XCIke2l0ZW0uaXNFcXVpcHBlZCA/ICd1bmVxdWlwJyA6ICdlcXVpcCd9XCIgZGF0YS1pZD1cIiR7aXRlbS5pZH1cIj48c3BhbiBkYXRhLWljbz1cIiR7aXRlbS5pc0VxdWlwcGVkID8gJ3gnIDogJ3NoaWVsZCd9XCI+PC9zcGFuPiR7aXRlbS5pc0VxdWlwcGVkID8gJ1x1NTM3OFx1NEUwQicgOiAnXHU4OEM1XHU1OTA3J308L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIiBkYXRhLWFjdD1cInVwZ3JhZGVcIiBkYXRhLWlkPVwiJHtpdGVtLmlkfVwiIHRpdGxlPVwiXHU2RDg4XHU4MDE3ICR7aXRlbS5sZXZlbCAqIDUwfSBcdTc3RkZcdTc3RjNcIj48c3BhbiBkYXRhLWljbz1cIndyZW5jaFwiPjwvc3Bhbj5cdTUzNDdcdTdFQTcgKCR7aXRlbS5sZXZlbCAqIDUwfSk8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLWdob3N0XCIgZGF0YS1hY3Q9XCJ0b2dnbGVcIiBkYXRhLWlkPVwiJHtpdGVtLmlkfVwiPjxzcGFuIGRhdGEtaWNvPVwibGlzdFwiPjwvc3Bhbj5cdThCRTZcdTYwQzU8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0aW1lbGluZVwiIGlkPVwidGwtJHtpdGVtLmlkfVwiIGhpZGRlbj48L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIGApO1xuICAgICAgICAgIG1vdW50SWNvbnMocm93KTtcbiAgICAgICAgICByb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZXYpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGV2LnRhcmdldCBhcyBIVE1MQnV0dG9uRWxlbWVudDtcbiAgICAgICAgICAgIGNvbnN0IGlkID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1pZCcpO1xuICAgICAgICAgICAgY29uc3QgYWN0ID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1hY3QnKTtcbiAgICAgICAgICAgIGlmICghaWQgfHwgIWFjdCkgcmV0dXJuO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBcdTk2MzJcdTZCNjJcdTkxQ0RcdTU5MERcdTcwQjlcdTUxRkJcbiAgICAgICAgICAgIGlmICh0YXJnZXQuZGlzYWJsZWQgJiYgYWN0ICE9PSAndG9nZ2xlJykgcmV0dXJuO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoYWN0ID09PSAndG9nZ2xlJykge1xuICAgICAgICAgICAgICBjb25zdCBib3ggPSByb3cucXVlcnlTZWxlY3RvcihgI3RsLSR7aWR9YCkgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgICAgICAgIGlmICghYm94KSByZXR1cm47XG4gICAgICAgICAgICAgIGlmICghYm94Lmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgICAgICAgICAgIGJveC5pbm5lckhUTUwgPSAnPGRpdiBjbGFzcz1cInNrZWxldG9uXCIgc3R5bGU9XCJoZWlnaHQ6MzZweDtcIj48L2Rpdj4nO1xuICAgICAgICAgICAgICAgIGJveC5oaWRkZW4gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgbG9nczogeyB0eXBlOiBzdHJpbmc7IGRlc2M/OiBzdHJpbmc7IHRpbWU6IG51bWJlciB9W10gfT4oYC9pdGVtcy9sb2dzP2l0ZW1JZD0ke2lkfWApO1xuICAgICAgICAgICAgICAgICAgY29uc3QgbG9ncyA9IEFycmF5LmlzQXJyYXkocmVzLmxvZ3MpID8gcmVzLmxvZ3MgOiBbXTtcbiAgICAgICAgICAgICAgICAgIGJveC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICAgICAgICAgIGlmICghbG9ncy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgYm94LmlubmVySFRNTCA9ICc8ZGl2IHN0eWxlPVwib3BhY2l0eTouODtcIj5cdTY2ODJcdTY1RTBcdTUzODZcdTUzRjJcdTY1NzBcdTYzNkU8L2Rpdj4nO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBsb2cgb2YgbG9ncykge1xuICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBodG1sKGBcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0aW1lbGluZS1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkb3RcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRpbWVcIj4ke2Zvcm1hdFRpbWUobG9nLnRpbWUpfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGVzY1wiPiR7KGxvZy5kZXNjIHx8IGxvZy50eXBlIHx8ICcnKS5yZXBsYWNlKC88L2csJyZsdDsnKX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIGApO1xuICAgICAgICAgICAgICAgICAgICAgIGJveC5hcHBlbmRDaGlsZChub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgICAgICAgICAgYm94LmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgICAgICAgYm94LmFwcGVuZENoaWxkKGh0bWwoYFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGltZWxpbmUtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkb3RcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGltZVwiPlx1MjAxNDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkZXNjXCI+XHU2NzY1XHU2RTkwXHU2NzJBXHU3N0U1IFx1MDBCNyBcdTUzRUZcdTkwMUFcdThGQzdcdTYzMTZcdTc3RkZcdTMwMDFcdTYzQTBcdTU5M0FcdTYyMTZcdTRFQTRcdTY2MTNcdTgzQjdcdTUzRDY8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICBgKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGJveC5oaWRkZW4gPSAhYm94LmhpZGRlbjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICB0YXJnZXQuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICBjb25zdCBvcmlnaW5hbEhUTUwgPSB0YXJnZXQuaW5uZXJIVE1MO1xuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgaWYgKGFjdCA9PT0gJ2VxdWlwJykge1xuICAgICAgICAgICAgICAgIHRhcmdldC5pbm5lckhUTUwgPSAnPHNwYW4gZGF0YS1pY289XCJzaGllbGRcIj48L3NwYW4+XHU4OEM1XHU1OTA3XHU0RTJEXHUyMDI2JztcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChhY3QgPT09ICd1bmVxdWlwJykge1xuICAgICAgICAgICAgICAgIHRhcmdldC5pbm5lckhUTUwgPSAnPHNwYW4gZGF0YS1pY289XCJ4XCI+PC9zcGFuPlx1NTM3OFx1NEUwQlx1NEUyRFx1MjAyNic7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoYWN0ID09PSAndXBncmFkZScpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXQuaW5uZXJIVE1MID0gJzxzcGFuIGRhdGEtaWNvPVwid3JlbmNoXCI+PC9zcGFuPlx1NTM0N1x1N0VBN1x1NEUyRFx1MjAyNic7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgbW91bnRJY29ucyh0YXJnZXQpO1xuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgaWYgKGFjdCA9PT0gJ2VxdWlwJykge1xuICAgICAgICAgICAgICAgIGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdCgnL2l0ZW1zL2VxdWlwJywgeyBtZXRob2Q6ICdQT1NUJywgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBpdGVtSWQ6IGlkIH0pIH0pO1xuICAgICAgICAgICAgICAgIHNob3dUb2FzdCgnXHU4OEM1XHU1OTA3XHU2MjEwXHU1MjlGJywgJ3N1Y2Nlc3MnKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChhY3QgPT09ICd1bmVxdWlwJykge1xuICAgICAgICAgICAgICAgIGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdCgnL2l0ZW1zL3VuZXF1aXAnLCB7IG1ldGhvZDogJ1BPU1QnLCBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGl0ZW1JZDogaWQgfSkgfSk7XG4gICAgICAgICAgICAgICAgc2hvd1RvYXN0KCdcdTUzNzhcdTRFMEJcdTYyMTBcdTUyOUYnLCAnc3VjY2VzcycpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFjdCA9PT0gJ3VwZ3JhZGUnKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgbGV2ZWw6IG51bWJlcjsgY29zdDogbnVtYmVyIH0+KCcvaXRlbXMvdXBncmFkZScsIHsgbWV0aG9kOiAnUE9TVCcsIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgaXRlbUlkOiBpZCB9KSB9KTtcbiAgICAgICAgICAgICAgICAvLyBcdTUzNDdcdTdFQTdcdTYyMTBcdTUyOUZcdTUyQThcdTc1M0JcbiAgICAgICAgICAgICAgICByb3cuY2xhc3NMaXN0LmFkZCgndXBncmFkZS1zdWNjZXNzJyk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiByb3cuY2xhc3NMaXN0LnJlbW92ZSgndXBncmFkZS1zdWNjZXNzJyksIDEwMDApO1xuICAgICAgICAgICAgICAgIHNob3dUb2FzdChgXHU1MzQ3XHU3RUE3XHU2MjEwXHU1MjlGXHVGRjAxXHU3QjQ5XHU3RUE3ICR7cmVzLmxldmVsfVx1RkYwOFx1NkQ4OFx1ODAxNyAke3Jlcy5jb3N0fSBcdTc3RkZcdTc3RjNcdUZGMDlgLCAnc3VjY2VzcycpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGF3YWl0IGJhci51cGRhdGUoKTtcbiAgICAgICAgICAgICAgYXdhaXQgbG9hZCgpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgICAgICAgIHNob3dUb2FzdChlPy5tZXNzYWdlIHx8ICdcdTY0Q0RcdTRGNUNcdTU5MzFcdThEMjUnLCAnZXJyb3InKTtcbiAgICAgICAgICAgICAgLy8gXHU1OTMxXHU4RDI1XHU2NUY2XHU2MDYyXHU1OTBEXHU2MzA5XHU5NEFFXHU1MzlGXHU1OUNCXHU3MkI2XHU2MDAxXHVGRjA4XHU1NkUwXHU0RTNBXHU0RTBEXHU0RjFBXHU5MUNEXHU2NUIwXHU2RTMyXHU2N0QzXHVGRjA5XG4gICAgICAgICAgICAgIHRhcmdldC5pbm5lckhUTUwgPSBvcmlnaW5hbEhUTUw7XG4gICAgICAgICAgICAgIG1vdW50SWNvbnModGFyZ2V0KTtcbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgIHRhcmdldC5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQocm93KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRwbENvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgZm9yIChjb25zdCB0cGwgb2YgKHRwbHMudGVtcGxhdGVzIHx8IFtdKSkge1xuICAgICAgICAgIGNvbnN0IHJvdyA9IGh0bWwoYDxkaXYgY2xhc3M9XCJsaXN0LWl0ZW1cIj48c3Ryb25nPiR7dHBsLm5hbWUgfHwgdHBsLmlkfTwvc3Ryb25nPiBcdTAwQjcgJHt0cGwuY2F0ZWdvcnkgfHwgJ1x1NjcyQVx1NzdFNVx1N0M3Qlx1NTc4Qid9PC9kaXY+YCk7XG4gICAgICAgICAgdHBsQ29udGFpbmVyLmFwcGVuZENoaWxkKHJvdyk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgICBzaG93VG9hc3QoZT8ubWVzc2FnZSB8fCAnXHU1MkEwXHU4RjdEXHU0RUQzXHU1RTkzXHU1OTMxXHU4RDI1JywgJ2Vycm9yJyk7XG4gICAgICAgIGxpc3QuaW5uZXJIVE1MID0gJzxkaXYgc3R5bGU9XCJvcGFjaXR5Oi44O3RleHQtYWxpZ246Y2VudGVyO3BhZGRpbmc6MjBweDtcIj5cdTUyQTBcdThGN0RcdTU5MzFcdThEMjVcdUZGMENcdThCRjdcdTdBMERcdTU0MEVcdTkxQ0RcdThCRDU8L2Rpdj4nO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgcmVmcmVzaEJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICByZWZyZXNoQnRuLmlubmVySFRNTCA9ICc8c3BhbiBkYXRhLWljbz1cInJlZnJlc2hcIj48L3NwYW4+XHU1MjM3XHU2NUIwJztcbiAgICAgICAgbW91bnRJY29ucyhyZWZyZXNoQnRuKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmVmcmVzaEJ0bi5vbmNsaWNrID0gKCkgPT4gbG9hZCgpO1xuICAgIGF3YWl0IGxvYWQoKTtcbiAgfVxufVxuIiwgImltcG9ydCB7IE5ldHdvcmtNYW5hZ2VyIH0gZnJvbSAnLi4vY29yZS9OZXR3b3JrTWFuYWdlcic7XG5pbXBvcnQgeyBodG1sLCBxcyB9IGZyb20gJy4uL3V0aWxzL2RvbSc7XG5pbXBvcnQgeyByZW5kZXJOYXYgfSBmcm9tICcuLi9jb21wb25lbnRzL05hdic7XG5pbXBvcnQgeyBSZWFsdGltZUNsaWVudCB9IGZyb20gJy4uL2NvcmUvUmVhbHRpbWVDbGllbnQnO1xuaW1wb3J0IHsgc2hvd1RvYXN0IH0gZnJvbSAnLi4vY29tcG9uZW50cy9Ub2FzdCc7XG5pbXBvcnQgeyByZW5kZXJSZXNvdXJjZUJhciB9IGZyb20gJy4uL2NvbXBvbmVudHMvUmVzb3VyY2VCYXInO1xuaW1wb3J0IHsgcmVuZGVySWNvbiB9IGZyb20gJy4uL2NvbXBvbmVudHMvSWNvbic7XG5cbmV4cG9ydCBjbGFzcyBQbHVuZGVyU2NlbmUge1xuICBwcml2YXRlIHJlc3VsdEJveDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcblxuICBtb3VudChyb290OiBIVE1MRWxlbWVudCkge1xuICAgIHJvb3QuaW5uZXJIVE1MID0gJyc7XG4gICAgcm9vdC5hcHBlbmRDaGlsZChyZW5kZXJOYXYoJ3BsdW5kZXInKSk7XG4gICAgY29uc3QgYmFyID0gcmVuZGVyUmVzb3VyY2VCYXIoKTtcbiAgICByb290LmFwcGVuZENoaWxkKGJhci5yb290KTtcblxuICAgIGNvbnN0IHZpZXcgPSBodG1sKGBcbiAgICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXIgZ3JpZC0yXCIgc3R5bGU9XCJjb2xvcjojZmZmO1wiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZCBmYWRlLWluXCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiIHN0eWxlPVwianVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YWxpZ24taXRlbXM6Y2VudGVyO1wiPlxuICAgICAgICAgICAgPGgzIHN0eWxlPVwibWFyZ2luOjA7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6OHB4O1wiPjxzcGFuIGRhdGEtaWNvPVwic3dvcmRcIj48L3NwYW4+XHU2M0EwXHU1OTNBXHU3NkVFXHU2ODA3PC9oMz5cbiAgICAgICAgICAgIDxidXR0b24gaWQ9XCJyZWZyZXNoXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIj48c3BhbiBkYXRhLWljbz1cInJlZnJlc2hcIj48L3NwYW4+XHU1MjM3XHU2NUIwPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBpZD1cImxpc3RcIiBzdHlsZT1cIm1hcmdpbi10b3A6MTJweDtkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDo4cHg7XCI+PC9kaXY+XG4gICAgICAgICAgPGRpdiBpZD1cInJlc3VsdFwiIHN0eWxlPVwibWFyZ2luLXRvcDoxMnB4O29wYWNpdHk6Ljk7Zm9udC1mYW1pbHk6bW9ub3NwYWNlO1wiPjwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIGApO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQodmlldyk7XG5cbiAgICBjb25zdCB0b2tlbiA9IChOZXR3b3JrTWFuYWdlciBhcyBhbnkpLklbJ3Rva2VuJ107XG4gICAgaWYgKHRva2VuKSBSZWFsdGltZUNsaWVudC5JLmNvbm5lY3QodG9rZW4pO1xuXG4gICAgUmVhbHRpbWVDbGllbnQuSS5vbigncGx1bmRlci5hdHRhY2tlZCcsIChtc2cpID0+IHtcbiAgICAgIHNob3dUb2FzdChgXHU4OEFCXHU2M0EwXHU1OTNBXHVGRjFBXHU2NzY1XHU4MUVBICR7bXNnLmF0dGFja2VyfVx1RkYwQ1x1NjM1Rlx1NTkzMSAke21zZy5sb3NzfWApO1xuICAgICAgdGhpcy5sb2coYFx1ODhBQiAke21zZy5hdHRhY2tlcn0gXHU2M0EwXHU1OTNBXHVGRjBDXHU2MzVGXHU1OTMxICR7bXNnLmxvc3N9YCk7XG4gICAgfSk7XG4gICAgdGhpcy5yZXN1bHRCb3ggPSBxcyh2aWV3LCAnI3Jlc3VsdCcpO1xuXG4gICAgY29uc3QgbGlzdCA9IHFzKHZpZXcsICcjbGlzdCcpO1xuICAgIGNvbnN0IHJlZnJlc2hCdG4gPSBxczxIVE1MQnV0dG9uRWxlbWVudD4odmlldywgJyNyZWZyZXNoJyk7XG4gICAgY29uc3QgbW91bnRJY29ucyA9IChyb290RWw6IEVsZW1lbnQpID0+IHtcbiAgICAgIHJvb3RFbC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1pY29dJylcbiAgICAgICAgLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgICAgY29uc3QgbmFtZSA9IChlbCBhcyBIVE1MRWxlbWVudCkuZ2V0QXR0cmlidXRlKCdkYXRhLWljbycpIGFzIGFueTtcbiAgICAgICAgICB0cnkgeyBlbC5hcHBlbmRDaGlsZChyZW5kZXJJY29uKG5hbWUsIHsgc2l6ZTogMjAgfSkpOyB9IGNhdGNoIHt9XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgbW91bnRJY29ucyh2aWV3KTtcblxuICAgIGNvbnN0IGxvYWQgPSBhc3luYyAoKSA9PiB7XG4gICAgICByZWZyZXNoQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIHJlZnJlc2hCdG4uaW5uZXJIVE1MID0gJzxzcGFuIGRhdGEtaWNvPVwicmVmcmVzaFwiPjwvc3Bhbj5cdTUyMzdcdTY1QjBcdTRFMkRcdTIwMjYnO1xuICAgICAgbW91bnRJY29ucyhyZWZyZXNoQnRuKTtcbiAgICAgIGF3YWl0IGJhci51cGRhdGUoKTtcbiAgICAgIGxpc3QuaW5uZXJIVE1MID0gJyc7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykgbGlzdC5hcHBlbmRDaGlsZChodG1sKCc8ZGl2IGNsYXNzPVwic2tlbGV0b25cIj48L2Rpdj4nKSk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgdGFyZ2V0czogYW55W10gfT4oJy9wbHVuZGVyL3RhcmdldHMnKTtcbiAgICAgICAgbGlzdC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgaWYgKCFkYXRhLnRhcmdldHMubGVuZ3RoKSB7XG4gICAgICAgICAgbGlzdC5hcHBlbmRDaGlsZChodG1sKCc8ZGl2IHN0eWxlPVwib3BhY2l0eTouODtcIj5cdTY2ODJcdTY1RTBcdTUzRUZcdTYzQTBcdTU5M0FcdTc2ODRcdTc2RUVcdTY4MDdcdUZGMENcdTdBMERcdTU0MEVcdTUxOERcdThCRDU8L2Rpdj4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCB0YXJnZXQgb2YgZGF0YS50YXJnZXRzKSB7XG4gICAgICAgICAgY29uc3Qgcm93ID0gaHRtbChgXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibGlzdC1pdGVtIGxpc3QtaXRlbS0tc2VsbFwiPlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6MnB4O1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo2cHg7XCI+PHNwYW4gZGF0YS1pY289XCJ0YXJnZXRcIj48L3NwYW4+PHN0cm9uZz4ke3RhcmdldC51c2VybmFtZSB8fCB0YXJnZXQuaWR9PC9zdHJvbmc+PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cIm9wYWNpdHk6Ljg1O1wiPlx1NzdGRlx1NzdGM1x1RkYxQSR7dGFyZ2V0Lm9yZX0gPHNwYW4gY2xhc3M9XCJwaWxsXCI+XHU5ODg0XHU4QkExXHU2NTM2XHU3NkNBIDUlfjMwJTwvc3Bhbj48L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tc2VsbFwiIGRhdGEtaWQ9XCIke3RhcmdldC5pZH1cIj48c3BhbiBkYXRhLWljbz1cInN3b3JkXCI+PC9zcGFuPlx1NjNBMFx1NTkzQTwvYnV0dG9uPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIGApO1xuICAgICAgICAgIG1vdW50SWNvbnMocm93KTtcbiAgICAgICAgICByb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZXYpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVsID0gZXYudGFyZ2V0IGFzIEhUTUxCdXR0b25FbGVtZW50O1xuICAgICAgICAgICAgY29uc3QgaWQgPSBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnKTtcbiAgICAgICAgICAgIGlmICghaWQpIHJldHVybjtcbiAgICAgICAgICAgIGNvbnN0IGJ0biA9IGVsLmNsb3Nlc3QoJ2J1dHRvbicpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xuICAgICAgICAgICAgaWYgKCFidG4pIHJldHVybjtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgYnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbnN0IG9yaWdpbmFsSFRNTCA9IGJ0bi5pbm5lckhUTUw7XG4gICAgICAgICAgICBidG4uaW5uZXJIVE1MID0gJzxzcGFuIGRhdGEtaWNvPVwic3dvcmRcIj48L3NwYW4+XHU2M0EwXHU1OTNBXHU0RTJEXHUyMDI2JztcbiAgICAgICAgICAgIG1vdW50SWNvbnMoYnRuKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbGV0IHNob3VsZFJlZnJlc2ggPSBmYWxzZTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IHN1Y2Nlc3M6IGJvb2xlYW47IGxvb3RfYW1vdW50OiBudW1iZXIgfT4oYC9wbHVuZGVyLyR7aWR9YCwgeyBtZXRob2Q6ICdQT1NUJyB9KTtcbiAgICAgICAgICAgICAgaWYgKHJlcy5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2coYFx1NjIxMFx1NTI5Rlx1NjNBMFx1NTkzQSAke2lkfVx1RkYwQ1x1ODNCN1x1NUY5NyAke3Jlcy5sb290X2Ftb3VudH1gKTtcbiAgICAgICAgICAgICAgICBzaG93VG9hc3QoYFx1NjNBMFx1NTkzQVx1NjIxMFx1NTI5Rlx1RkYwQ1x1ODNCN1x1NUY5NyAke3Jlcy5sb290X2Ftb3VudH0gXHU3N0ZGXHU3N0YzYCwgJ3N1Y2Nlc3MnKTtcbiAgICAgICAgICAgICAgICBzaG91bGRSZWZyZXNoID0gdHJ1ZTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZyhgXHU2M0EwXHU1OTNBICR7aWR9IFx1NTkzMVx1OEQyNWApO1xuICAgICAgICAgICAgICAgIHNob3dUb2FzdCgnXHU2M0EwXHU1OTNBXHU1OTMxXHU4RDI1JywgJ3dhcm4nKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBhd2FpdCBiYXIudXBkYXRlKCk7XG4gICAgICAgICAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IGU/Lm1lc3NhZ2UgfHwgJ1x1NjNBMFx1NTkzQVx1NTkzMVx1OEQyNSc7XG4gICAgICAgICAgICAgIHRoaXMubG9nKGBcdTYzQTBcdTU5M0FcdTU5MzFcdThEMjVcdUZGMUEke21lc3NhZ2V9YCk7XG4gICAgICAgICAgICAgIGlmIChtZXNzYWdlLmluY2x1ZGVzKCdcdTUxQjdcdTUzNzQnKSkge1xuICAgICAgICAgICAgICAgIHNob3dUb2FzdChtZXNzYWdlLCAnd2FybicpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNob3dUb2FzdChtZXNzYWdlLCAnZXJyb3InKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAvLyBcdTU5MzFcdThEMjVcdTY1RjZcdTYwNjJcdTU5MERcdTYzMDlcdTk0QUVcbiAgICAgICAgICAgICAgYnRuLmlubmVySFRNTCA9IG9yaWdpbmFsSFRNTDtcbiAgICAgICAgICAgICAgbW91bnRJY29ucyhidG4pO1xuICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgYnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgIC8vIFx1NjIxMFx1NTI5Rlx1NTQwRVx1NTIzN1x1NjVCMFx1NTIxN1x1ODg2OFx1RkYwOFx1NEYxQVx1NjZGRlx1NjM2Mlx1NjMwOVx1OTRBRVx1RkYwOVxuICAgICAgICAgICAgICBpZiAoc2hvdWxkUmVmcmVzaCkge1xuICAgICAgICAgICAgICAgIGF3YWl0IGxvYWQoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQocm93KTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgIHNob3dUb2FzdChlPy5tZXNzYWdlIHx8ICdcdTUyQTBcdThGN0RcdTYzQTBcdTU5M0FcdTc2RUVcdTY4MDdcdTU5MzFcdThEMjUnLCAnZXJyb3InKTtcbiAgICAgICAgbGlzdC5pbm5lckhUTUwgPSAnPGRpdiBzdHlsZT1cIm9wYWNpdHk6Ljg7dGV4dC1hbGlnbjpjZW50ZXI7cGFkZGluZzoyMHB4O1wiPlx1NTJBMFx1OEY3RFx1NTkzMVx1OEQyNVx1RkYwQ1x1OEJGN1x1N0EwRFx1NTQwRVx1OTFDRFx1OEJENTwvZGl2Pic7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICByZWZyZXNoQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIHJlZnJlc2hCdG4uaW5uZXJIVE1MID0gJzxzcGFuIGRhdGEtaWNvPVwicmVmcmVzaFwiPjwvc3Bhbj5cdTUyMzdcdTY1QjAnO1xuICAgICAgICBtb3VudEljb25zKHJlZnJlc2hCdG4pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZWZyZXNoQnRuLm9uY2xpY2sgPSAoKSA9PiBsb2FkKCk7XG4gICAgbG9hZCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBsb2cobXNnOiBzdHJpbmcpIHtcbiAgICBpZiAoIXRoaXMucmVzdWx0Qm94KSByZXR1cm47XG4gICAgY29uc3QgbGluZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGxpbmUudGV4dENvbnRlbnQgPSBgWyR7bmV3IERhdGUoKS50b0xvY2FsZVRpbWVTdHJpbmcoKX1dICR7bXNnfWA7XG4gICAgdGhpcy5yZXN1bHRCb3gucHJlcGVuZChsaW5lKTtcbiAgfVxufVxuIiwgImltcG9ydCB7IE5ldHdvcmtNYW5hZ2VyIH0gZnJvbSAnLi4vY29yZS9OZXR3b3JrTWFuYWdlcic7XG5pbXBvcnQgeyBodG1sLCBxcyB9IGZyb20gJy4uL3V0aWxzL2RvbSc7XG5pbXBvcnQgeyByZW5kZXJOYXYgfSBmcm9tICcuLi9jb21wb25lbnRzL05hdic7XG5pbXBvcnQgeyBSZWFsdGltZUNsaWVudCB9IGZyb20gJy4uL2NvcmUvUmVhbHRpbWVDbGllbnQnO1xuaW1wb3J0IHsgR2FtZU1hbmFnZXIgfSBmcm9tICcuLi9jb3JlL0dhbWVNYW5hZ2VyJztcbmltcG9ydCB7IHNob3dUb2FzdCB9IGZyb20gJy4uL2NvbXBvbmVudHMvVG9hc3QnO1xuaW1wb3J0IHsgcmVuZGVyUmVzb3VyY2VCYXIgfSBmcm9tICcuLi9jb21wb25lbnRzL1Jlc291cmNlQmFyJztcbmltcG9ydCB7IHJlbmRlckljb24gfSBmcm9tICcuLi9jb21wb25lbnRzL0ljb24nO1xuXG50eXBlIE9yZGVyID0ge1xuICBpZDogc3RyaW5nO1xuICB1c2VySWQ6IHN0cmluZztcbiAgdHlwZTogJ2J1eScgfCAnc2VsbCc7XG4gIGl0ZW1UZW1wbGF0ZUlkPzogc3RyaW5nO1xuICBpdGVtSW5zdGFuY2VJZD86IHN0cmluZztcbiAgcHJpY2U6IG51bWJlcjtcbiAgYW1vdW50OiBudW1iZXI7XG4gIGNyZWF0ZWRBdDogbnVtYmVyO1xufTtcblxuZXhwb3J0IGNsYXNzIEV4Y2hhbmdlU2NlbmUge1xuICBwcml2YXRlIHJlZnJlc2hUaW1lcjogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgdGVtcGxhdGVzOiB7IGlkOiBzdHJpbmc7IG5hbWU/OiBzdHJpbmc7IGNhdGVnb3J5Pzogc3RyaW5nIH1bXSA9IFtdO1xuICBwcml2YXRlIGludmVudG9yeTogYW55W10gPSBbXTtcblxuICBhc3luYyBtb3VudChyb290OiBIVE1MRWxlbWVudCkge1xuICAgIHRoaXMuY2xlYXJUaW1lcigpO1xuICAgIHJvb3QuaW5uZXJIVE1MID0gJyc7XG5cbiAgICBjb25zdCBuYXYgPSByZW5kZXJOYXYoJ2V4Y2hhbmdlJyk7XG4gICAgY29uc3QgYmFyID0gcmVuZGVyUmVzb3VyY2VCYXIoKTtcbiAgICBjb25zdCB2aWV3ID0gaHRtbChgXG4gICAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyIGdyaWQtMlwiIHN0eWxlPVwiY29sb3I6I2ZmZjtcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQgZmFkZS1pblwiPlxuICAgICAgICAgIDxoMyBzdHlsZT1cIm1hcmdpbjowIDAgMTJweDtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo4cHg7XCI+PHNwYW4gZGF0YS1pY289XCJleGNoYW5nZVwiPjwvc3Bhbj5cdTVFMDJcdTU3M0FcdTRFMEJcdTUzNTU8L2gzPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIiBzdHlsZT1cImZsZXgtd3JhcDp3cmFwO2FsaWduLWl0ZW1zOmZsZXgtZW5kO2dhcDoxMnB4O1wiPlxuICAgICAgICAgICAgPGRpdiBzdHlsZT1cImZsZXg6MTttaW4td2lkdGg6MTgwcHg7XCI+XG4gICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cImRpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjZweDtcIj48c3BhbiBkYXRhLWljbz1cImxpc3RcIj48L3NwYW4+XHU4RDJEXHU0RTcwXHU2QTIxXHU2NzdGPC9sYWJlbD5cbiAgICAgICAgICAgICAgPHNlbGVjdCBpZD1cInRwbFwiIGNsYXNzPVwiaW5wdXRcIj48L3NlbGVjdD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT1cImZsZXg6MTttaW4td2lkdGg6MTIwcHg7XCI+XG4gICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT1cImRpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjZweDtcIj48c3BhbiBkYXRhLWljbz1cImNvaW5cIj48L3NwYW4+XHU0RUY3XHU2ODNDIChCQlx1NUUwMSk8L2xhYmVsPlxuICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJwcmljZVwiIGNsYXNzPVwiaW5wdXRcIiB0eXBlPVwibnVtYmVyXCIgbWluPVwiMVwiIHZhbHVlPVwiMTBcIi8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJmbGV4OjE7bWluLXdpZHRoOjEyMHB4O1wiPlxuICAgICAgICAgICAgICA8bGFiZWw+XHU4RDJEXHU0RTcwXHU2NTcwXHU5MUNGPC9sYWJlbD5cbiAgICAgICAgICAgICAgPGlucHV0IGlkPVwiYW1vdW50XCIgY2xhc3M9XCJpbnB1dFwiIHR5cGU9XCJudW1iZXJcIiBtaW49XCIxXCIgdmFsdWU9XCIxXCIvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwicGxhY2VCdXlcIiBjbGFzcz1cImJ0biBidG4tYnV5XCIgc3R5bGU9XCJtaW4td2lkdGg6MTIwcHg7XCI+PHNwYW4gZGF0YS1pY289XCJhcnJvdy1yaWdodFwiPjwvc3Bhbj5cdTRFMEJcdTRFNzBcdTUzNTU8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IHN0eWxlPVwiaGVpZ2h0OjhweDtcIj48L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCIgc3R5bGU9XCJmbGV4LXdyYXA6d3JhcDthbGlnbi1pdGVtczpmbGV4LWVuZDtnYXA6MTJweDtcIj5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJmbGV4OjE7bWluLXdpZHRoOjIyMHB4O1wiPlxuICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9XCJkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo2cHg7XCI+PHNwYW4gZGF0YS1pY289XCJib3hcIj48L3NwYW4+XHU1MUZBXHU1NTJFXHU5MDUzXHU1MTc3PC9sYWJlbD5cbiAgICAgICAgICAgICAgPHNlbGVjdCBpZD1cImluc3RcIiBjbGFzcz1cImlucHV0XCI+PC9zZWxlY3Q+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJmbGV4OjE7bWluLXdpZHRoOjEyMHB4O1wiPlxuICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9XCJkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo2cHg7XCI+PHNwYW4gZGF0YS1pY289XCJjb2luXCI+PC9zcGFuPlx1NEVGN1x1NjgzQyAoQkJcdTVFMDEpPC9sYWJlbD5cbiAgICAgICAgICAgICAgPGlucHV0IGlkPVwic3ByaWNlXCIgY2xhc3M9XCJpbnB1dFwiIHR5cGU9XCJudW1iZXJcIiBtaW49XCIxXCIgdmFsdWU9XCI1XCIvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwicGxhY2VTZWxsXCIgY2xhc3M9XCJidG4gYnRuLXNlbGxcIiBzdHlsZT1cIm1pbi13aWR0aDoxMjBweDtcIj48c3BhbiBkYXRhLWljbz1cImFycm93LXJpZ2h0XCI+PC9zcGFuPlx1NEUwQlx1NTM1Nlx1NTM1NTwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgaWQ9XCJpbnZlbnRvcnlcIiBzdHlsZT1cIm1hcmdpbi10b3A6MTJweDtkaXNwbGF5OmZsZXg7ZmxleC13cmFwOndyYXA7Z2FwOjhweDtcIj48L2Rpdj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQgZmFkZS1pblwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIiBzdHlsZT1cImp1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6MTJweDtcIj5cbiAgICAgICAgICAgIDxoMyBzdHlsZT1cIm1hcmdpbjowO2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjhweDtcIj48c3BhbiBkYXRhLWljbz1cImxpc3RcIj48L3NwYW4+XHU4QkEyXHU1MzU1XHU3QzNGPC9oMz5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIiBzdHlsZT1cImZsZXgtd3JhcDp3cmFwO2dhcDo4cHg7XCI+XG4gICAgICAgICAgICAgIDxzZWxlY3QgaWQ9XCJxX3RwbFwiIGNsYXNzPVwiaW5wdXRcIiBzdHlsZT1cIndpZHRoOjE4MHB4O1wiPjwvc2VsZWN0PlxuICAgICAgICAgICAgICA8c2VsZWN0IGlkPVwicV90eXBlXCIgY2xhc3M9XCJpbnB1dFwiIHN0eWxlPVwid2lkdGg6MTIwcHg7XCI+XG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImJ1eVwiPlx1NEU3MFx1NTM1NTwvb3B0aW9uPlxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJzZWxsXCI+XHU1MzU2XHU1MzU1PC9vcHRpb24+XG4gICAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJyb3cgcGlsbFwiIHN0eWxlPVwiYWxpZ24taXRlbXM6Y2VudGVyO2dhcDo2cHg7XCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gZGF0YS1pY289XCJ1c2VyXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgIDxpbnB1dCBpZD1cIm15XCIgdHlwZT1cImNoZWNrYm94XCIvPiBcdTUzRUFcdTc3MEJcdTYyMTFcdTc2ODRcbiAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInJlZnJlc2hcIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiIHN0eWxlPVwibWluLXdpZHRoOjk2cHg7XCI+PHNwYW4gZGF0YS1pY289XCJyZWZyZXNoXCI+PC9zcGFuPlx1NTIzN1x1NjVCMDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBpZD1cImJvb2tcIiBzdHlsZT1cIm1hcmdpbi10b3A6MTJweDtkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDo4cHg7XCI+PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkIGZhZGUtaW5cIiBpZD1cImxvZ3NcIiBzdHlsZT1cIm9wYWNpdHk6Ljk7Zm9udC1mYW1pbHk6bW9ub3NwYWNlO21pbi1oZWlnaHQ6MjRweDtcIj48L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIGApO1xuXG4gICAgcm9vdC5hcHBlbmRDaGlsZChuYXYpO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQoYmFyLnJvb3QpO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQodmlldyk7XG5cbiAgICBjb25zdCB0b2tlbiA9IChOZXR3b3JrTWFuYWdlciBhcyBhbnkpLklbJ3Rva2VuJ107XG4gICAgaWYgKHRva2VuKSBSZWFsdGltZUNsaWVudC5JLmNvbm5lY3QodG9rZW4pO1xuICAgIGNvbnN0IG1lID0gR2FtZU1hbmFnZXIuSS5nZXRQcm9maWxlKCk7XG5cbiAgICBjb25zdCBib29rID0gcXModmlldywgJyNib29rJyk7XG4gICAgY29uc3QgbG9ncyA9IHFzPEhUTUxFbGVtZW50Pih2aWV3LCAnI2xvZ3MnKTtcbiAgICBjb25zdCBidXlUcGwgPSBxczxIVE1MU2VsZWN0RWxlbWVudD4odmlldywgJyN0cGwnKTtcbiAgICBjb25zdCBidXlQcmljZSA9IHFzPEhUTUxJbnB1dEVsZW1lbnQ+KHZpZXcsICcjcHJpY2UnKTtcbiAgICBjb25zdCBidXlBbW91bnQgPSBxczxIVE1MSW5wdXRFbGVtZW50Pih2aWV3LCAnI2Ftb3VudCcpO1xuICAgIGNvbnN0IHBsYWNlQnV5ID0gcXM8SFRNTEJ1dHRvbkVsZW1lbnQ+KHZpZXcsICcjcGxhY2VCdXknKTtcbiAgICBjb25zdCBzZWxsSW5zdCA9IHFzPEhUTUxTZWxlY3RFbGVtZW50Pih2aWV3LCAnI2luc3QnKTtcbiAgICBjb25zdCBzZWxsUHJpY2UgPSBxczxIVE1MSW5wdXRFbGVtZW50Pih2aWV3LCAnI3NwcmljZScpO1xuICAgIGNvbnN0IHBsYWNlU2VsbCA9IHFzPEhUTUxCdXR0b25FbGVtZW50Pih2aWV3LCAnI3BsYWNlU2VsbCcpO1xuICAgIGNvbnN0IGludkJveCA9IHFzPEhUTUxFbGVtZW50Pih2aWV3LCAnI2ludmVudG9yeScpO1xuICAgIGNvbnN0IHF1ZXJ5VHBsID0gcXM8SFRNTFNlbGVjdEVsZW1lbnQ+KHZpZXcsICcjcV90cGwnKTtcbiAgICBjb25zdCBxdWVyeVR5cGUgPSBxczxIVE1MU2VsZWN0RWxlbWVudD4odmlldywgJyNxX3R5cGUnKTtcbiAgICBjb25zdCBxdWVyeU1pbmVPbmx5ID0gcXM8SFRNTElucHV0RWxlbWVudD4odmlldywgJyNteScpO1xuICAgIGNvbnN0IG1pbmVPbmx5TGFiZWwgPSB2aWV3LnF1ZXJ5U2VsZWN0b3IoJ2xhYmVsLnJvdy5waWxsJykgYXMgSFRNTExhYmVsRWxlbWVudCB8IG51bGw7XG4gICAgY29uc3QgcmVmcmVzaEJ0biA9IHFzPEhUTUxCdXR0b25FbGVtZW50Pih2aWV3LCAnI3JlZnJlc2gnKTtcblxuICAgIGNvbnN0IG1vdW50SWNvbnMgPSAocm9vdEVsOiBFbGVtZW50KSA9PiB7XG4gICAgICByb290RWwucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtaWNvXScpXG4gICAgICAgIC5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICAgIGNvbnN0IG5hbWUgPSAoZWwgYXMgSFRNTEVsZW1lbnQpLmdldEF0dHJpYnV0ZSgnZGF0YS1pY28nKSBhcyBhbnk7XG4gICAgICAgICAgdHJ5IHsgZWwuYXBwZW5kQ2hpbGQocmVuZGVySWNvbihuYW1lLCB7IHNpemU6IDIwIH0pKTsgfSBjYXRjaCB7fVxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIG1vdW50SWNvbnModmlldyk7XG5cbiAgICBsZXQgcHJldklkcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGxldCByZWZyZXNoaW5nID0gZmFsc2U7XG5cbiAgICBjb25zdCBsb2cgPSAobWVzc2FnZTogc3RyaW5nKSA9PiB7XG4gICAgICBsb2dzLnRleHRDb250ZW50ID0gbWVzc2FnZTtcbiAgICB9O1xuXG4gICAgY29uc3QgcmVuZGVyVGVtcGxhdGVPcHRpb25zID0gKCkgPT4ge1xuICAgICAgYnV5VHBsLmlubmVySFRNTCA9ICcnO1xuICAgICAgcXVlcnlUcGwuaW5uZXJIVE1MID0gJyc7XG4gICAgICBjb25zdCBwbGFjZWhvbGRlciA9IGh0bWwoJzxvcHRpb24gdmFsdWU9XCJcIj5cdTkwMDlcdTYyRTlcdTZBMjFcdTY3N0Y8L29wdGlvbj4nKSBhcyBIVE1MT3B0aW9uRWxlbWVudDtcbiAgICAgIGJ1eVRwbC5hcHBlbmRDaGlsZChwbGFjZWhvbGRlcik7XG4gICAgICBjb25zdCBxUGxhY2Vob2xkZXIgPSBodG1sKCc8b3B0aW9uIHZhbHVlPVwiXCI+XHU1MTY4XHU5MEU4XHU2QTIxXHU2NzdGPC9vcHRpb24+JykgYXMgSFRNTE9wdGlvbkVsZW1lbnQ7XG4gICAgICBxdWVyeVRwbC5hcHBlbmRDaGlsZChxUGxhY2Vob2xkZXIpO1xuICAgICAgZm9yIChjb25zdCB0cGwgb2YgdGhpcy50ZW1wbGF0ZXMpIHtcbiAgICAgICAgY29uc3Qgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICAgIG9wdGlvbi52YWx1ZSA9IHRwbC5pZDtcbiAgICAgICAgb3B0aW9uLnRleHRDb250ZW50ID0gdHBsLm5hbWUgPyBgJHt0cGwubmFtZX0gKCR7dHBsLmlkfSlgIDogdHBsLmlkO1xuICAgICAgICBidXlUcGwuYXBwZW5kQ2hpbGQob3B0aW9uKTtcbiAgICAgICAgY29uc3QgcU9wdGlvbiA9IG9wdGlvbi5jbG9uZU5vZGUodHJ1ZSkgYXMgSFRNTE9wdGlvbkVsZW1lbnQ7XG4gICAgICAgIHF1ZXJ5VHBsLmFwcGVuZENoaWxkKHFPcHRpb24pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCByZW5kZXJJbnZlbnRvcnkgPSAoKSA9PiB7XG4gICAgICBzZWxsSW5zdC5pbm5lckhUTUwgPSAnJztcbiAgICAgIGludkJveC5pbm5lckhUTUwgPSAnJztcbiAgICAgIGNvbnN0IGRlZmF1bHRPcHRpb24gPSBodG1sKCc8b3B0aW9uIHZhbHVlPVwiXCI+XHU5MDA5XHU2MkU5XHU1M0VGXHU1MUZBXHU1NTJFXHU3Njg0XHU5MDUzXHU1MTc3PC9vcHRpb24+JykgYXMgSFRNTE9wdGlvbkVsZW1lbnQ7XG4gICAgICBzZWxsSW5zdC5hcHBlbmRDaGlsZChkZWZhdWx0T3B0aW9uKTtcbiAgICAgIGNvbnN0IGF2YWlsYWJsZSA9IHRoaXMuaW52ZW50b3J5LmZpbHRlcigoaXRlbSkgPT4gIWl0ZW0uaXNFcXVpcHBlZCAmJiAhaXRlbS5pc0xpc3RlZCk7XG4gICAgICBpZiAoIWF2YWlsYWJsZS5sZW5ndGgpIHtcbiAgICAgICAgaW52Qm94LnRleHRDb250ZW50ID0gJ1x1NjY4Mlx1NjVFMFx1NTNFRlx1NTFGQVx1NTUyRVx1NzY4NFx1OTA1M1x1NTE3N1x1RkYwOFx1OTcwMFx1NTE0OFx1NTcyOFx1NEVEM1x1NUU5M1x1NTM3OFx1NEUwQlx1ODhDNVx1NTkwN1x1RkYwOSc7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBhdmFpbGFibGUpIHtcbiAgICAgICAgY29uc3Qgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICAgIG9wdGlvbi52YWx1ZSA9IGl0ZW0uaWQ7XG4gICAgICAgIG9wdGlvbi50ZXh0Q29udGVudCA9IGAke2l0ZW0uaWR9IFx1MDBCNyAke2l0ZW0udGVtcGxhdGVJZH0gXHUwMEI3IEx2LiR7aXRlbS5sZXZlbH1gO1xuICAgICAgICBzZWxsSW5zdC5hcHBlbmRDaGlsZChvcHRpb24pO1xuXG4gICAgICAgIGNvbnN0IGNoaXAgPSBodG1sKGA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1naG9zdFwiIHN0eWxlPVwiZmxleDp1bnNldDtwYWRkaW5nOjZweCAxMHB4O1wiIGRhdGEtaWQ9XCIke2l0ZW0uaWR9XCI+JHtpdGVtLmlkfSAoJHtpdGVtLnRlbXBsYXRlSWR9KTwvYnV0dG9uPmApIGFzIEhUTUxCdXR0b25FbGVtZW50O1xuICAgICAgICBjaGlwLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICAgICAgc2VsbEluc3QudmFsdWUgPSBpdGVtLmlkO1xuICAgICAgICAgIGxvZyhgXHU1REYyXHU5MDA5XHU2MkU5XHU1MUZBXHU1NTJFXHU5MDUzXHU1MTc3ICR7aXRlbS5pZH1gKTtcbiAgICAgICAgfTtcbiAgICAgICAgaW52Qm94LmFwcGVuZENoaWxkKGNoaXApO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCBsb2FkTWV0YWRhdGEgPSBhc3luYyAoKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBbdHBscywgaXRlbXNdID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICAgIE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IHRlbXBsYXRlczogYW55W10gfT4oJy9pdGVtcy90ZW1wbGF0ZXMnKSxcbiAgICAgICAgICBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyBpdGVtczogYW55W10gfT4oJy9pdGVtcycpLFxuICAgICAgICBdKTtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXMgPSB0cGxzLnRlbXBsYXRlcyB8fCBbXTtcbiAgICAgICAgdGhpcy5pbnZlbnRvcnkgPSBpdGVtcy5pdGVtcyB8fCBbXTtcbiAgICAgICAgcmVuZGVyVGVtcGxhdGVPcHRpb25zKCk7XG4gICAgICAgIHJlbmRlckludmVudG9yeSgpO1xuICAgICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgIGxvZyhlPy5tZXNzYWdlIHx8ICdcdTUyQTBcdThGN0RcdTZBMjFcdTY3N0YvXHU0RUQzXHU1RTkzXHU1OTMxXHU4RDI1Jyk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IHJlZnJlc2ggPSBhc3luYyAob3B0czogeyBxdWlldD86IGJvb2xlYW4gfSA9IHt9KSA9PiB7XG4gICAgICBpZiAocmVmcmVzaGluZykgcmV0dXJuO1xuICAgICAgcmVmcmVzaGluZyA9IHRydWU7XG4gICAgICBpZiAoIW9wdHMucXVpZXQpIHsgcmVmcmVzaEJ0bi5pbm5lckhUTUwgPSAnPHNwYW4gZGF0YS1pY289XCJyZWZyZXNoXCI+PC9zcGFuPlx1NTIzN1x1NjVCMFx1NEUyRFx1MjAyNic7IG1vdW50SWNvbnMocmVmcmVzaEJ0bik7IH1cbiAgICAgIHJlZnJlc2hCdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgdHBsSWQgPSBxdWVyeVRwbC52YWx1ZTtcbiAgICAgICAgY29uc3QgdHlwZSA9IHF1ZXJ5VHlwZS52YWx1ZSBhcyAnYnV5JyB8ICdzZWxsJztcbiAgICAgICAgY29uc3QgbWluZU9ubHkgPSBxdWVyeU1pbmVPbmx5LmNoZWNrZWQ7XG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoKTtcbiAgICAgICAgcGFyYW1zLnNldCgndHlwZScsIHR5cGUpO1xuICAgICAgICBwYXJhbXMuc2V0KCdpdGVtX3RlbXBsYXRlX2lkJywgdHBsSWQgfHwgJycpO1xuICAgICAgICBpZiAoIW9wdHMucXVpZXQpIHtcbiAgICAgICAgICBib29rLmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSBib29rLmFwcGVuZENoaWxkKGh0bWwoJzxkaXYgY2xhc3M9XCJza2VsZXRvblwiPjwvZGl2PicpKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgb3JkZXJzOiBPcmRlcltdIH0+KGAvZXhjaGFuZ2Uvb3JkZXJzPyR7cGFyYW1zLnRvU3RyaW5nKCl9YCk7XG4gICAgICAgIGNvbnN0IG5ld0lkcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgICAgICBib29rLmlubmVySFRNTCA9ICcnO1xuICAgICAgICBjb25zdCBvcmRlcnMgPSBkYXRhLm9yZGVycyB8fCBbXTtcbiAgICAgICAgaWYgKCFvcmRlcnMubGVuZ3RoKSB7XG4gICAgICAgICAgYm9vay5hcHBlbmRDaGlsZChodG1sKCc8ZGl2IHN0eWxlPVwib3BhY2l0eTouODt0ZXh0LWFsaWduOmNlbnRlcjtcIj5cdTY2ODJcdTY1RTBcdThCQTJcdTUzNTU8L2Rpdj4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBvcmRlciBvZiBvcmRlcnMpIHtcbiAgICAgICAgICBpZiAobWluZU9ubHkgJiYgbWUgJiYgb3JkZXIudXNlcklkICE9PSBtZS5pZCkgY29udGludWU7XG4gICAgICAgICAgbmV3SWRzLmFkZChvcmRlci5pZCk7XG4gICAgICAgICAgY29uc3QgaXNNaW5lID0gbWUgJiYgb3JkZXIudXNlcklkID09PSBtZS5pZDtcbiAgICAgICAgICBjb25zdCBrbGFzcyA9IGBsaXN0LWl0ZW0gJHtvcmRlci50eXBlID09PSAnYnV5JyA/ICdsaXN0LWl0ZW0tLWJ1eScgOiAnbGlzdC1pdGVtLS1zZWxsJ31gO1xuICAgICAgICAgIGNvbnN0IHJvdyA9IGh0bWwoYFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIiR7a2xhc3N9XCI+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDoycHg7XCI+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgIDxzdHJvbmc+JHtvcmRlci50eXBlID09PSAnYnV5JyA/ICdcdTRFNzBcdTUxNjUnIDogJ1x1NTM1Nlx1NTFGQSd9PC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgICAke29yZGVyLml0ZW1UZW1wbGF0ZUlkIHx8ICcnfVxuICAgICAgICAgICAgICAgICAgJHtpc01pbmUgPyAnPHNwYW4gY2xhc3M9XCJwaWxsXCI+XHU2MjExXHU3Njg0PC9zcGFuPicgOiAnJ31cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwib3BhY2l0eTouODU7XCI+XG4gICAgICAgICAgICAgICAgICBcdTRFRjdcdTY4M0M6ICR7b3JkZXIucHJpY2V9IFx1MDBCNyBcdTY1NzBcdTkxQ0Y6ICR7b3JkZXIuYW1vdW50fVxuICAgICAgICAgICAgICAgICAgJHtvcmRlci5pdGVtSW5zdGFuY2VJZCA/IGA8c3BhbiBjbGFzcz1cInBpbGxcIj4ke29yZGVyLml0ZW1JbnN0YW5jZUlkfTwvc3Bhbj5gIDogJyd9XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInBpbGxcIj4ke29yZGVyLmlkfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgJHtpc01pbmUgPyBgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tZ2hvc3RcIiBkYXRhLWlkPVwiJHtvcmRlci5pZH1cIj48c3BhbiBkYXRhLWljbz1cInRyYXNoXCI+PC9zcGFuPlx1NjRBNFx1NTM1NTwvYnV0dG9uPmAgOiAnJ31cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICBgKTtcbiAgICAgICAgICBtb3VudEljb25zKHJvdyk7XG4gICAgICAgICAgaWYgKCFwcmV2SWRzLmhhcyhvcmRlci5pZCkpIHJvdy5jbGFzc0xpc3QuYWRkKCdmbGFzaCcpO1xuICAgICAgICAgIHJvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIChldikgPT4ge1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gZXYudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuICAgICAgICAgICAgY29uc3QgaWQgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWlkJyk7XG4gICAgICAgICAgICBpZiAoIWlkKSByZXR1cm47XG4gICAgICAgICAgICBjb25zdCBidG4gPSB0YXJnZXQuY2xvc2VzdCgnYnV0dG9uJykgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XG4gICAgICAgICAgICBpZiAoIWJ0bikgcmV0dXJuO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBidG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICBjb25zdCBvcmlnaW5hbEhUTUwgPSBidG4uaW5uZXJIVE1MO1xuICAgICAgICAgICAgICBidG4uaW5uZXJIVE1MID0gJzxzcGFuIGRhdGEtaWNvPVwidHJhc2hcIj48L3NwYW4+XHU2NEE0XHU1MzU1XHU0RTJEXHUyMDI2JztcbiAgICAgICAgICAgICAgbW91bnRJY29ucyhidG4pO1xuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0KGAvZXhjaGFuZ2Uvb3JkZXJzLyR7aWR9YCwgeyBtZXRob2Q6ICdERUxFVEUnIH0pO1xuICAgICAgICAgICAgICBzaG93VG9hc3QoJ1x1NjRBNFx1NTM1NVx1NjIxMFx1NTI5RicsICdzdWNjZXNzJyk7XG4gICAgICAgICAgICAgIGF3YWl0IHJlZnJlc2goKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgICAgICAgICBzaG93VG9hc3QoZT8ubWVzc2FnZSB8fCAnXHU2NEE0XHU1MzU1XHU1OTMxXHU4RDI1JywgJ2Vycm9yJyk7XG4gICAgICAgICAgICAgIC8vIFx1NTkzMVx1OEQyNVx1NjVGNlx1OTcwMFx1ODk4MVx1NjA2Mlx1NTkwRFx1NjMwOVx1OTRBRVx1RkYwOFx1NTZFMFx1NEUzQVx1NEUwRFx1NEYxQVx1NTIzN1x1NjVCMFx1NTIxN1x1ODg2OFx1RkYwOVxuICAgICAgICAgICAgICBhd2FpdCByZWZyZXNoKCk7XG4gICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICBidG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBib29rLmFwcGVuZENoaWxkKHJvdyk7XG4gICAgICAgIH1cbiAgICAgICAgcHJldklkcyA9IG5ld0lkcztcbiAgICAgICAgaWYgKCFib29rLmNoaWxkRWxlbWVudENvdW50KSB7XG4gICAgICAgICAgYm9vay5hcHBlbmRDaGlsZChodG1sKCc8ZGl2IHN0eWxlPVwib3BhY2l0eTouODt0ZXh0LWFsaWduOmNlbnRlcjtcIj5cdTY2ODJcdTY1RTBcdTdCMjZcdTU0MDhcdTY3NjFcdTRFRjZcdTc2ODRcdThCQTJcdTUzNTU8L2Rpdj4nKSk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgICBsb2coZT8ubWVzc2FnZSB8fCAnXHU1MjM3XHU2NUIwXHU4QkEyXHU1MzU1XHU1OTMxXHU4RDI1Jyk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICByZWZyZXNoaW5nID0gZmFsc2U7XG4gICAgICAgIHJlZnJlc2hCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgcmVmcmVzaEJ0bi5pbm5lckhUTUwgPSAnPHNwYW4gZGF0YS1pY289XCJyZWZyZXNoXCI+PC9zcGFuPlx1NTIzN1x1NjVCMCc7XG4gICAgICAgIG1vdW50SWNvbnMocmVmcmVzaEJ0bik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBsYWNlQnV5Lm9uY2xpY2sgPSBhc3luYyAoKSA9PiB7XG4gICAgICBpZiAocGxhY2VCdXkuZGlzYWJsZWQpIHJldHVybjsgLy8gXHU5NjMyXHU2QjYyXHU5MUNEXHU1OTBEXHU3MEI5XHU1MUZCXG4gICAgICBcbiAgICAgIGNvbnN0IHRwbElkID0gYnV5VHBsLnZhbHVlLnRyaW0oKTtcbiAgICAgIGNvbnN0IHByaWNlID0gTnVtYmVyKGJ1eVByaWNlLnZhbHVlKTtcbiAgICAgIGNvbnN0IGFtb3VudCA9IE51bWJlcihidXlBbW91bnQudmFsdWUpO1xuICAgICAgaWYgKCF0cGxJZCkge1xuICAgICAgICBzaG93VG9hc3QoJ1x1OEJGN1x1OTAwOVx1NjJFOVx1OEQyRFx1NEU3MFx1NzY4NFx1NkEyMVx1Njc3RicsICd3YXJuJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChpc05hTihwcmljZSkgfHwgaXNOYU4oYW1vdW50KSB8fCBwcmljZSA8PSAwIHx8IGFtb3VudCA8PSAwIHx8ICFOdW1iZXIuaXNJbnRlZ2VyKGFtb3VudCkpIHtcbiAgICAgICAgc2hvd1RvYXN0KCdcdThCRjdcdThGOTNcdTUxNjVcdTY3MDlcdTY1NDhcdTc2ODRcdTRFRjdcdTY4M0NcdTRFMEVcdTY1NzBcdTkxQ0ZcdUZGMDhcdTY1NzBcdTkxQ0ZcdTVGQzVcdTk4N0JcdTRFM0FcdTY1NzRcdTY1NzBcdUZGMDknLCAnd2FybicpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAocHJpY2UgPiAxMDAwMDAwIHx8IGFtb3VudCA+IDEwMDAwKSB7XG4gICAgICAgIHNob3dUb2FzdCgnXHU2NTcwXHU1MDNDXHU4RkM3XHU1OTI3XHVGRjBDXHU4QkY3XHU4RjkzXHU1MTY1XHU1NDA4XHU3NDA2XHU3Njg0XHU0RUY3XHU2ODNDXHU1NDhDXHU2NTcwXHU5MUNGJywgJ3dhcm4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcGxhY2VCdXkuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgY29uc3Qgb3JpZ2luYWxCdXlIVE1MID0gcGxhY2VCdXkuaW5uZXJIVE1MO1xuICAgICAgcGxhY2VCdXkuaW5uZXJIVE1MID0gJzxzcGFuIGRhdGEtaWNvPVwiYXJyb3ctcmlnaHRcIj48L3NwYW4+XHU2M0QwXHU0RUE0XHU0RTJEXHUyMDI2JztcbiAgICAgIG1vdW50SWNvbnMocGxhY2VCdXkpO1xuICAgICAgXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyBpZDogc3RyaW5nIH0+KCcvZXhjaGFuZ2Uvb3JkZXJzJywge1xuICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgdHlwZTogJ2J1eScsIGl0ZW1fdGVtcGxhdGVfaWQ6IHRwbElkLCBwcmljZSwgYW1vdW50IH0pLFxuICAgICAgICB9KTtcbiAgICAgICAgc2hvd1RvYXN0KGBcdTRFNzBcdTUzNTVcdTVERjJcdTYzRDBcdTRFQTQgKCMke3Jlcy5pZH0pYCwgJ3N1Y2Nlc3MnKTtcbiAgICAgICAgbG9nKGBcdTRFNzBcdTUzNTVcdTYyMTBcdTUyOUY6ICR7cmVzLmlkfWApO1xuICAgICAgICBhd2FpdCBiYXIudXBkYXRlKCk7XG4gICAgICAgIGF3YWl0IHJlZnJlc2goKTtcbiAgICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgICBzaG93VG9hc3QoZT8ubWVzc2FnZSB8fCAnXHU0RTcwXHU1MzU1XHU2M0QwXHU0RUE0XHU1OTMxXHU4RDI1JywgJ2Vycm9yJyk7XG4gICAgICAgIGxvZyhlPy5tZXNzYWdlIHx8ICdcdTRFNzBcdTUzNTVcdTYzRDBcdTRFQTRcdTU5MzFcdThEMjUnKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHBsYWNlQnV5LmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIHBsYWNlQnV5LmlubmVySFRNTCA9IG9yaWdpbmFsQnV5SFRNTDtcbiAgICAgICAgbW91bnRJY29ucyhwbGFjZUJ1eSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBsYWNlU2VsbC5vbmNsaWNrID0gYXN5bmMgKCkgPT4ge1xuICAgICAgaWYgKHBsYWNlU2VsbC5kaXNhYmxlZCkgcmV0dXJuOyAvLyBcdTk2MzJcdTZCNjJcdTkxQ0RcdTU5MERcdTcwQjlcdTUxRkJcbiAgICAgIFxuICAgICAgY29uc3QgaW5zdElkID0gc2VsbEluc3QudmFsdWUudHJpbSgpO1xuICAgICAgY29uc3QgcHJpY2UgPSBOdW1iZXIoc2VsbFByaWNlLnZhbHVlKTtcbiAgICAgIGlmICghaW5zdElkKSB7XG4gICAgICAgIHNob3dUb2FzdCgnXHU4QkY3XHU5MDA5XHU2MkU5XHU4OTgxXHU1MUZBXHU1NTJFXHU3Njg0XHU5MDUzXHU1MTc3JywgJ3dhcm4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGlzTmFOKHByaWNlKSB8fCBwcmljZSA8PSAwKSB7XG4gICAgICAgIHNob3dUb2FzdCgnXHU4QkY3XHU4RjkzXHU1MTY1XHU2NzA5XHU2NTQ4XHU3Njg0XHU0RUY3XHU2ODNDJywgJ3dhcm4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHByaWNlID4gMTAwMDAwMCkge1xuICAgICAgICBzaG93VG9hc3QoJ1x1NEVGN1x1NjgzQ1x1OEZDN1x1OUFEOFx1RkYwQ1x1OEJGN1x1OEY5M1x1NTE2NVx1NTQwOFx1NzQwNlx1NzY4NFx1NEVGN1x1NjgzQycsICd3YXJuJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHBsYWNlU2VsbC5kaXNhYmxlZCA9IHRydWU7XG4gICAgICBjb25zdCBvcmlnaW5hbFNlbGxIVE1MID0gcGxhY2VTZWxsLmlubmVySFRNTDtcbiAgICAgIHBsYWNlU2VsbC5pbm5lckhUTUwgPSAnPHNwYW4gZGF0YS1pY289XCJhcnJvdy1yaWdodFwiPjwvc3Bhbj5cdTYzRDBcdTRFQTRcdTRFMkRcdTIwMjYnO1xuICAgICAgbW91bnRJY29ucyhwbGFjZVNlbGwpO1xuICAgICAgXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyBpZDogc3RyaW5nIH0+KCcvZXhjaGFuZ2Uvb3JkZXJzJywge1xuICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgdHlwZTogJ3NlbGwnLCBpdGVtX2luc3RhbmNlX2lkOiBpbnN0SWQsIHByaWNlIH0pLFxuICAgICAgICB9KTtcbiAgICAgICAgc2hvd1RvYXN0KGBcdTUzNTZcdTUzNTVcdTVERjJcdTYzRDBcdTRFQTQgKCMke3Jlcy5pZH0pYCwgJ3N1Y2Nlc3MnKTtcbiAgICAgICAgbG9nKGBcdTUzNTZcdTUzNTVcdTYyMTBcdTUyOUY6ICR7cmVzLmlkfWApO1xuICAgICAgICBhd2FpdCBiYXIudXBkYXRlKCk7XG4gICAgICAgIGF3YWl0IGxvYWRNZXRhZGF0YSgpO1xuICAgICAgICBhd2FpdCByZWZyZXNoKCk7XG4gICAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgICAgc2hvd1RvYXN0KGU/Lm1lc3NhZ2UgfHwgJ1x1NTM1Nlx1NTM1NVx1NjNEMFx1NEVBNFx1NTkzMVx1OEQyNScsICdlcnJvcicpO1xuICAgICAgICBsb2coZT8ubWVzc2FnZSB8fCAnXHU1MzU2XHU1MzU1XHU2M0QwXHU0RUE0XHU1OTMxXHU4RDI1Jyk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBwbGFjZVNlbGwuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgcGxhY2VTZWxsLmlubmVySFRNTCA9IG9yaWdpbmFsU2VsbEhUTUw7XG4gICAgICAgIG1vdW50SWNvbnMocGxhY2VTZWxsKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmVmcmVzaEJ0bi5vbmNsaWNrID0gKCkgPT4gcmVmcmVzaCgpO1xuICAgIHF1ZXJ5VHBsLm9uY2hhbmdlID0gKCkgPT4gcmVmcmVzaCgpO1xuICAgIHF1ZXJ5VHlwZS5vbmNoYW5nZSA9ICgpID0+IHJlZnJlc2goKTtcbiAgICBxdWVyeU1pbmVPbmx5Lm9uY2hhbmdlID0gKCkgPT4geyBpZiAobWluZU9ubHlMYWJlbCkgbWluZU9ubHlMYWJlbC5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnLCBxdWVyeU1pbmVPbmx5LmNoZWNrZWQpOyByZWZyZXNoKCk7IH07XG4gICAgaWYgKG1pbmVPbmx5TGFiZWwpIG1pbmVPbmx5TGFiZWwuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJywgcXVlcnlNaW5lT25seS5jaGVja2VkKTtcblxuICAgIGF3YWl0IFByb21pc2UuYWxsKFtiYXIudXBkYXRlKCksIGxvYWRNZXRhZGF0YSgpXSk7XG4gICAgYXdhaXQgcmVmcmVzaCh7IHF1aWV0OiB0cnVlIH0pO1xuICAgIHRoaXMucmVmcmVzaFRpbWVyID0gd2luZG93LnNldEludGVydmFsKCgpID0+IHtcbiAgICAgIHJlZnJlc2goeyBxdWlldDogdHJ1ZSB9KS5jYXRjaCgoKSA9PiB7fSk7XG4gICAgfSwgMTAwMDApO1xuICB9XG5cbiAgcHJpdmF0ZSBjbGVhclRpbWVyKCkge1xuICAgIGlmICh0aGlzLnJlZnJlc2hUaW1lciAhPT0gbnVsbCkge1xuICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5yZWZyZXNoVGltZXIpO1xuICAgICAgdGhpcy5yZWZyZXNoVGltZXIgPSBudWxsO1xuICAgIH1cbiAgfVxufVxuIiwgImltcG9ydCB7IE5ldHdvcmtNYW5hZ2VyIH0gZnJvbSAnLi4vY29yZS9OZXR3b3JrTWFuYWdlcic7XG5pbXBvcnQgeyBodG1sLCBxcyB9IGZyb20gJy4uL3V0aWxzL2RvbSc7XG5pbXBvcnQgeyByZW5kZXJOYXYgfSBmcm9tICcuLi9jb21wb25lbnRzL05hdic7XG5pbXBvcnQgeyBSZWFsdGltZUNsaWVudCB9IGZyb20gJy4uL2NvcmUvUmVhbHRpbWVDbGllbnQnO1xuaW1wb3J0IHsgcmVuZGVyUmVzb3VyY2VCYXIgfSBmcm9tICcuLi9jb21wb25lbnRzL1Jlc291cmNlQmFyJztcbmltcG9ydCB7IHJlbmRlckljb24gfSBmcm9tICcuLi9jb21wb25lbnRzL0ljb24nO1xuXG5leHBvcnQgY2xhc3MgUmFua2luZ1NjZW5lIHtcbiAgbW91bnQocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICByb290LmlubmVySFRNTCA9ICcnO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQocmVuZGVyTmF2KCdyYW5raW5nJykpO1xuICAgIGNvbnN0IGJhciA9IHJlbmRlclJlc291cmNlQmFyKCk7XG4gICAgcm9vdC5hcHBlbmRDaGlsZChiYXIucm9vdCk7XG5cbiAgICBjb25zdCB2aWV3ID0gaHRtbChgXG4gICAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyIGdyaWQtMlwiIHN0eWxlPVwiY29sb3I6I2ZmZjtcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQgZmFkZS1pblwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIiBzdHlsZT1cImp1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2FsaWduLWl0ZW1zOmNlbnRlcjtcIj5cbiAgICAgICAgICAgIDxoMyBzdHlsZT1cIm1hcmdpbjowO2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjhweDtcIj48c3BhbiBkYXRhLWljbz1cInRyb3BoeVwiPjwvc3Bhbj5cdTYzOTJcdTg4NENcdTY5OUM8L2gzPlxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInJlZnJlc2hcIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiPjxzcGFuIGRhdGEtaWNvPVwicmVmcmVzaFwiPjwvc3Bhbj5cdTUyMzdcdTY1QjA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGlkPVwibWVcIiBzdHlsZT1cIm1hcmdpbi10b3A6OHB4O29wYWNpdHk6Ljk1O1wiPjwvZGl2PlxuICAgICAgICAgIDxkaXYgaWQ9XCJsaXN0XCIgc3R5bGU9XCJtYXJnaW4tdG9wOjEycHg7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6NnB4O1wiPjwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIGApO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQodmlldyk7XG5cbiAgICBjb25zdCB0b2tlbiA9IChOZXR3b3JrTWFuYWdlciBhcyBhbnkpLklbJ3Rva2VuJ107XG4gICAgaWYgKHRva2VuKSBSZWFsdGltZUNsaWVudC5JLmNvbm5lY3QodG9rZW4pO1xuXG4gICAgY29uc3QgbWVCb3ggPSBxcyh2aWV3LCAnI21lJyk7XG4gICAgY29uc3QgbGlzdCA9IHFzKHZpZXcsICcjbGlzdCcpO1xuICAgIGNvbnN0IHJlZnJlc2hCdG4gPSBxczxIVE1MQnV0dG9uRWxlbWVudD4odmlldywgJyNyZWZyZXNoJyk7XG4gICAgY29uc3QgbW91bnRJY29ucyA9IChyb290RWw6IEVsZW1lbnQpID0+IHtcbiAgICAgIHJvb3RFbC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1pY29dJylcbiAgICAgICAgLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgICAgY29uc3QgbmFtZSA9IChlbCBhcyBIVE1MRWxlbWVudCkuZ2V0QXR0cmlidXRlKCdkYXRhLWljbycpIGFzIGFueTtcbiAgICAgICAgICB0cnkgeyBlbC5hcHBlbmRDaGlsZChyZW5kZXJJY29uKG5hbWUsIHsgc2l6ZTogMjAgfSkpOyB9IGNhdGNoIHt9XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgbW91bnRJY29ucyh2aWV3KTtcblxuICAgIGNvbnN0IGxvYWQgPSBhc3luYyAoKSA9PiB7XG4gICAgICByZWZyZXNoQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIHJlZnJlc2hCdG4uaW5uZXJIVE1MID0gJzxzcGFuIGRhdGEtaWNvPVwicmVmcmVzaFwiPjwvc3Bhbj5cdTUyMzdcdTY1QjBcdTRFMkRcdTIwMjYnO1xuICAgICAgbW91bnRJY29ucyhyZWZyZXNoQnRuKTtcbiAgICAgIGF3YWl0IGJhci51cGRhdGUoKTtcbiAgICAgIGxpc3QuaW5uZXJIVE1MID0gJyc7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykgbGlzdC5hcHBlbmRDaGlsZChodG1sKCc8ZGl2IGNsYXNzPVwic2tlbGV0b25cIj48L2Rpdj4nKSk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBtZSA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IHJhbms6IG51bWJlcjsgc2NvcmU6IG51bWJlciB9PignL3JhbmtpbmcvbWUnKTtcbiAgICAgICAgY29uc3QgdG9wID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgbGlzdDogYW55W10gfT4oJy9yYW5raW5nL3RvcD9uPTIwJyk7XG4gICAgICAgIG1lQm94LnRleHRDb250ZW50ID0gYFx1NjIxMVx1NzY4NFx1NTQwRFx1NkIyMVx1RkYxQSMke21lLnJhbmt9IFx1MDBCNyBcdTYwM0JcdTVGOTdcdTUyMDZcdUZGMUEke21lLnNjb3JlfWA7XG4gICAgICAgIGxpc3QuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIGZvciAoY29uc3QgZW50cnkgb2YgdG9wLmxpc3QpIHtcbiAgICAgICAgICBjb25zdCBtZWRhbCA9IGVudHJ5LnJhbmsgPT09IDEgPyAnXHVEODNFXHVERDQ3JyA6IGVudHJ5LnJhbmsgPT09IDIgPyAnXHVEODNFXHVERDQ4JyA6IGVudHJ5LnJhbmsgPT09IDMgPyAnXHVEODNFXHVERDQ5JyA6ICcnO1xuICAgICAgICAgIGNvbnN0IGNscyA9IGVudHJ5LnJhbmsgPD0gMyA/ICcgbGlzdC1pdGVtLS1idXknIDogJyc7XG4gICAgICAgICAgY29uc3Qgcm93ID0gaHRtbChgXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibGlzdC1pdGVtJHtjbHN9XCI+XG4gICAgICAgICAgICAgIDxzcGFuPiR7bWVkYWx9ICMke2VudHJ5LnJhbmt9PC9zcGFuPlxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT1cImZsZXg6MTtvcGFjaXR5Oi45O21hcmdpbi1sZWZ0OjEycHg7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NnB4O1wiPjxzcGFuIGRhdGEtaWNvPVwidXNlclwiPjwvc3Bhbj4ke2VudHJ5LnVzZXJJZH08L3NwYW4+XG4gICAgICAgICAgICAgIDxzdHJvbmc+JHtlbnRyeS5zY29yZX08L3N0cm9uZz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIGApO1xuICAgICAgICAgIG1vdW50SWNvbnMocm93KTtcbiAgICAgICAgICBsaXN0LmFwcGVuZENoaWxkKHJvdyk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgICBtZUJveC50ZXh0Q29udGVudCA9IGU/Lm1lc3NhZ2UgfHwgJ1x1NjM5Mlx1ODg0Q1x1Njk5Q1x1NTJBMFx1OEY3RFx1NTkzMVx1OEQyNSc7XG4gICAgICAgIGxpc3QuaW5uZXJIVE1MID0gJzxkaXYgc3R5bGU9XCJvcGFjaXR5Oi44O3RleHQtYWxpZ246Y2VudGVyO3BhZGRpbmc6MjBweDtcIj5cdTUyQTBcdThGN0RcdTU5MzFcdThEMjVcdUZGMENcdThCRjdcdTdBMERcdTU0MEVcdTkxQ0RcdThCRDU8L2Rpdj4nO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgcmVmcmVzaEJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICByZWZyZXNoQnRuLmlubmVySFRNTCA9ICc8c3BhbiBkYXRhLWljbz1cInJlZnJlc2hcIj48L3NwYW4+XHU1MjM3XHU2NUIwJztcbiAgICAgICAgbW91bnRJY29ucyhyZWZyZXNoQnRuKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHJlZnJlc2hCdG4ub25jbGljayA9ICgpID0+IGxvYWQoKTtcbiAgICBsb2FkKCk7XG4gIH1cbn1cbiIsICJsZXQgaW5qZWN0ZWQgPSBmYWxzZTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBlbnN1cmVHbG9iYWxTdHlsZXMoKSB7XHJcbiAgaWYgKGluamVjdGVkKSByZXR1cm47XHJcbiAgY29uc3QgY3NzID0gYDpyb290ey0tYmc6IzBiMTAyMDstLWJnLTI6IzBmMTUzMDstLWZnOiNmZmY7LS1tdXRlZDpyZ2JhKDI1NSwyNTUsMjU1LC43NSk7LS1ncmFkOmxpbmVhci1ncmFkaWVudCgxMzVkZWcsIzdCMkNGNSwjMkM4OUY1KTstLXBhbmVsLWdyYWQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZyxyZ2JhKDEyMyw0NCwyNDUsLjI1KSxyZ2JhKDQ0LDEzNywyNDUsLjI1KSk7LS1nbGFzczpibHVyKDEwcHgpOy0tZ2xvdzowIDhweCAyMHB4IHJnYmEoMCwwLDAsLjM1KSwwIDAgMTJweCByZ2JhKDEyMyw0NCwyNDUsLjcpOy0tcmFkaXVzLXNtOjEwcHg7LS1yYWRpdXMtbWQ6MTJweDstLXJhZGl1cy1sZzoxNnB4Oy0tZWFzZTpjdWJpYy1iZXppZXIoLjIyLC42MSwuMzYsMSk7LS1kdXI6LjI4czstLWJ1eTojMkM4OUY1Oy0tc2VsbDojRTM2NDE0Oy0tb2s6IzJlYzI3ZTstLXdhcm46I2Y2YzQ0NTstLWRhbmdlcjojZmY1YzVjOy0tcmFyaXR5LWNvbW1vbjojOWFhMGE2Oy0tcmFyaXR5LXJhcmU6IzRmZDRmNTstLXJhcml0eS1lcGljOiNiMjZiZmY7LS1yYXJpdHktbGVnZW5kYXJ5OiNmNmM0NDU7LS1jb250YWluZXItbWF4OjcyMHB4fVxyXG5odG1sLGJvZHl7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoMTIwMHB4IDYwMHB4IGF0IDUwJSAtMTAlLCByZ2JhKDEyMyw0NCwyNDUsLjEyKSwgdHJhbnNwYXJlbnQpLHZhcigtLWJnKTtjb2xvcjp2YXIoLS1mZyk7Zm9udC1mYW1pbHk6c3lzdGVtLXVpLC1hcHBsZS1zeXN0ZW0sXCJTZWdvZSBVSVwiLFwiUGluZ0ZhbmcgU0NcIixcIk1pY3Jvc29mdCBZYUhlaVwiLEFyaWFsLHNhbnMtc2VyaWZ9XHJcbmh0bWx7Y29sb3Itc2NoZW1lOmRhcmt9XHJcbi5jb250YWluZXJ7cGFkZGluZzowIDEycHh9XHJcbi5jb250YWluZXJ7bWF4LXdpZHRoOnZhcigtLWNvbnRhaW5lci1tYXgpO21hcmdpbjoxMnB4IGF1dG99XHJcbi5jYXJke3Bvc2l0aW9uOnJlbGF0aXZlO2JvcmRlci1yYWRpdXM6dmFyKC0tcmFkaXVzLWxnKTtiYWNrZ3JvdW5kOnZhcigtLXBhbmVsLWdyYWQpO2JhY2tkcm9wLWZpbHRlcjp2YXIoLS1nbGFzcyk7Ym94LXNoYWRvdzp2YXIoLS1nbG93KTtwYWRkaW5nOjEycHg7b3ZlcmZsb3c6aGlkZGVufVxyXG4vKiBuZW9uIGNvcm5lcnMgKyBzaGVlbiAqL1xyXG4uY2FyZDo6YmVmb3Jle2NvbnRlbnQ6XCJcIjtwb3NpdGlvbjphYnNvbHV0ZTtpbnNldDowO2JvcmRlci1yYWRpdXM6aW5oZXJpdDtiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudCg0MCUgMjUlIGF0IDEwMCUgMCwgcmdiYSgxMjMsNDQsMjQ1LC4xOCksIHRyYW5zcGFyZW50IDYwJSkscmFkaWFsLWdyYWRpZW50KDM1JSAyNSUgYXQgMCAxMDAlLCByZ2JhKDQ0LDEzNywyNDUsLjE2KSwgdHJhbnNwYXJlbnQgNjAlKTtwb2ludGVyLWV2ZW50czpub25lfVxyXG4uY2FyZDo6YWZ0ZXJ7Y29udGVudDpcIlwiO3Bvc2l0aW9uOmFic29sdXRlO2xlZnQ6LTMwJTt0b3A6LTEyMCU7d2lkdGg6NjAlO2hlaWdodDozMDAlO2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEyMGRlZyx0cmFuc3BhcmVudCxyZ2JhKDI1NSwyNTUsMjU1LC4xOCksdHJhbnNwYXJlbnQpO3RyYW5zZm9ybTpyb3RhdGUoOGRlZyk7b3BhY2l0eTouMjU7YW5pbWF0aW9uOmNhcmQtc2hlZW4gOXMgbGluZWFyIGluZmluaXRlO3BvaW50ZXItZXZlbnRzOm5vbmV9XHJcbkBrZXlmcmFtZXMgY2FyZC1zaGVlbnswJXt0cmFuc2Zvcm06dHJhbnNsYXRlWCgwKSByb3RhdGUoOGRlZyl9MTAwJXt0cmFuc2Zvcm06dHJhbnNsYXRlWCgxNjAlKSByb3RhdGUoOGRlZyl9fVxyXG4ucm93e2Rpc3BsYXk6ZmxleDtnYXA6OHB4O2FsaWduLWl0ZW1zOmNlbnRlcn1cclxuLmNhcmQgaW5wdXQsLmNhcmQgYnV0dG9ue2JveC1zaXppbmc6Ym9yZGVyLWJveDtvdXRsaW5lOm5vbmV9XHJcbi5jYXJkIGlucHV0e2JhY2tncm91bmQ6cmdiYSgyNTUsMjU1LDI1NSwuMDgpO2JvcmRlcjowO2JvcmRlci1yYWRpdXM6dmFyKC0tcmFkaXVzLW1kKTtjb2xvcjp2YXIoLS1mZyk7cGFkZGluZzoxMHB4O21hcmdpbjo4cHggMDthcHBlYXJhbmNlOm5vbmU7LXdlYmtpdC1hcHBlYXJhbmNlOm5vbmU7YmFja2dyb3VuZC1jbGlwOnBhZGRpbmctYm94O3BvaW50ZXItZXZlbnRzOmF1dG87dG91Y2gtYWN0aW9uOm1hbmlwdWxhdGlvbn1cclxuLmNhcmQgc2VsZWN0LmlucHV0LCBzZWxlY3QuaW5wdXR7YmFja2dyb3VuZDpyZ2JhKDI1NSwyNTUsMjU1LC4wOCk7Y29sb3I6dmFyKC0tZmcpO2JvcmRlcjowO2JvcmRlci1yYWRpdXM6dmFyKC0tcmFkaXVzLW1kKTtwYWRkaW5nOjEwcHg7bWFyZ2luOjhweCAwO2FwcGVhcmFuY2U6bm9uZTstd2Via2l0LWFwcGVhcmFuY2U6bm9uZTtiYWNrZ3JvdW5kLWNsaXA6cGFkZGluZy1ib3h9XHJcbi5jYXJkIHNlbGVjdC5pbnB1dCBvcHRpb24sIHNlbGVjdC5pbnB1dCBvcHRpb257YmFja2dyb3VuZDojMGIxMDIwO2NvbG9yOiNmZmZ9XHJcbi5jYXJkIHNlbGVjdC5pbnB1dDpmb2N1cywgc2VsZWN0LmlucHV0OmZvY3Vze291dGxpbmU6MnB4IHNvbGlkIHJnYmEoMTIzLDQ0LDI0NSwuNDUpfVxyXG4uY2FyZCBidXR0b257d2lkdGg6MTAwJTtib3JkZXItcmFkaXVzOnZhcigtLXJhZGl1cy1tZCl9XHJcbi5idG57cG9zaXRpb246cmVsYXRpdmU7b3ZlcmZsb3c6aGlkZGVuO3BhZGRpbmc6MTBweCAxNHB4O2JvcmRlcjowO2JvcmRlci1yYWRpdXM6dmFyKC0tcmFkaXVzLW1kKTtjb2xvcjojZmZmO3RyYW5zaXRpb246dHJhbnNmb3JtIHZhcigtLWR1cikgdmFyKC0tZWFzZSksYm94LXNoYWRvdyB2YXIoLS1kdXIpIHZhcigtLWVhc2UpLGZpbHRlciB2YXIoLS1kdXIpIHZhcigtLWVhc2UpfVxyXG4uYnRuIC5pY29ue21hcmdpbi1yaWdodDo2cHh9XHJcbi5idG46YWN0aXZle3RyYW5zZm9ybTp0cmFuc2xhdGVZKDFweCkgc2NhbGUoLjk5KX1cclxuLmJ0bjo6YWZ0ZXJ7Y29udGVudDpcIlwiO3Bvc2l0aW9uOmFic29sdXRlO2luc2V0OjA7b3BhY2l0eTowO2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDExNWRlZyx0cmFuc3BhcmVudCxyZ2JhKDI1NSwyNTUsMjU1LC4yNSksdHJhbnNwYXJlbnQgNTUlKTt0cmFuc2Zvcm06dHJhbnNsYXRlWCgtNjAlKTt0cmFuc2l0aW9uOm9wYWNpdHkgdmFyKC0tZHVyKSB2YXIoLS1lYXNlKSwgdHJhbnNmb3JtIHZhcigtLWR1cikgdmFyKC0tZWFzZSk7cG9pbnRlci1ldmVudHM6bm9uZX1cclxuLmJ0bjpob3Zlcjo6YWZ0ZXJ7b3BhY2l0eTouOTt0cmFuc2Zvcm06dHJhbnNsYXRlWCgwKX1cclxuLmJ0bjpob3ZlcntmaWx0ZXI6c2F0dXJhdGUoMTEwJSl9XHJcbi5idG4tcHJpbWFyeXtiYWNrZ3JvdW5kOnZhcigtLWdyYWQpO2JveC1zaGFkb3c6dmFyKC0tZ2xvdyl9XHJcbi5idG4tZW5lcmd5e3Bvc2l0aW9uOnJlbGF0aXZlO2FuaW1hdGlvbjpidG4tcHVsc2UgMnMgZWFzZS1pbi1vdXQgaW5maW5pdGV9XHJcbi5idG4tZW5lcmd5OjpiZWZvcmV7Y29udGVudDpcIlwiO3Bvc2l0aW9uOmFic29sdXRlO2luc2V0Oi0ycHg7Ym9yZGVyLXJhZGl1czppbmhlcml0O2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZyxyZ2JhKDEyMyw0NCwyNDUsLjYpLHJnYmEoNDQsMTM3LDI0NSwuNikpO2ZpbHRlcjpibHVyKDhweCk7ei1pbmRleDotMTtvcGFjaXR5Oi42O2FuaW1hdGlvbjplbmVyZ3ktcmluZyAycyBlYXNlLWluLW91dCBpbmZpbml0ZTtwb2ludGVyLWV2ZW50czpub25lfVxyXG5Aa2V5ZnJhbWVzIGJ0bi1wdWxzZXswJSwxMDAle3RyYW5zZm9ybTpzY2FsZSgxKX01MCV7dHJhbnNmb3JtOnNjYWxlKDEuMDIpfX1cclxuQGtleWZyYW1lcyBlbmVyZ3ktcmluZ3swJSwxMDAle29wYWNpdHk6LjQ7ZmlsdGVyOmJsdXIoOHB4KX01MCV7b3BhY2l0eTouODtmaWx0ZXI6Ymx1cigxMnB4KX19XHJcbi5idG4tYnV5e2JhY2tncm91bmQ6dmFyKC0tYnV5KX1cclxuLmJ0bi1zZWxse2JhY2tncm91bmQ6dmFyKC0tc2VsbCl9XHJcbi5idG4tZ2hvc3R7YmFja2dyb3VuZDpyZ2JhKDI1NSwyNTUsMjU1LC4wOCl9XHJcbi5pbnB1dHt3aWR0aDoxMDAlO3BhZGRpbmc6MTBweDtib3JkZXI6MDtib3JkZXItcmFkaXVzOnZhcigtLXJhZGl1cy1tZCk7YmFja2dyb3VuZDpyZ2JhKDI1NSwyNTUsMjU1LC4wOCk7Y29sb3I6dmFyKC0tZmcpO3BvaW50ZXItZXZlbnRzOmF1dG87dG91Y2gtYWN0aW9uOm1hbmlwdWxhdGlvbjt1c2VyLXNlbGVjdDp0ZXh0Oy13ZWJraXQtdXNlci1zZWxlY3Q6dGV4dH1cclxuLnBpbGx7cGFkZGluZzoycHggOHB4O2JvcmRlci1yYWRpdXM6OTk5cHg7YmFja2dyb3VuZDpyZ2JhKDI1NSwyNTUsMjU1LC4wOCk7Zm9udC1zaXplOjEycHg7Y3Vyc29yOnBvaW50ZXI7dHJhbnNpdGlvbjpiYWNrZ3JvdW5kIC4zcyBlYXNlfVxyXG4ucGlsbC5waWxsLXJ1bm5pbmd7YW5pbWF0aW9uOnBpbGwtYnJlYXRoZSAycyBlYXNlLWluLW91dCBpbmZpbml0ZX1cclxuQGtleWZyYW1lcyBwaWxsLWJyZWF0aGV7MCUsMTAwJXtiYWNrZ3JvdW5kOnJnYmEoNDYsMTk0LDEyNiwuMjUpO2JveC1zaGFkb3c6MCAwIDhweCByZ2JhKDQ2LDE5NCwxMjYsLjMpfTUwJXtiYWNrZ3JvdW5kOnJnYmEoNDYsMTk0LDEyNiwuMzUpO2JveC1zaGFkb3c6MCAwIDEycHggcmdiYSg0NiwxOTQsMTI2LC41KX19XHJcbi5waWxsLnBpbGwtY29sbGFwc2Vke2FuaW1hdGlvbjpwaWxsLWFsZXJ0IDFzIGVhc2UtaW4tb3V0IGluZmluaXRlfVxyXG5Aa2V5ZnJhbWVzIHBpbGwtYWxlcnR7MCUsMTAwJXtiYWNrZ3JvdW5kOnJnYmEoMjU1LDkyLDkyLC4yNSk7Ym94LXNoYWRvdzowIDAgOHB4IHJnYmEoMjU1LDkyLDkyLC4zKX01MCV7YmFja2dyb3VuZDpyZ2JhKDI1NSw5Miw5MiwuNDUpO2JveC1zaGFkb3c6MCAwIDE2cHggcmdiYSgyNTUsOTIsOTIsLjYpfX1cclxuLnBpbGwuYWN0aXZle2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZywgcmdiYSgxMjMsNDQsMjQ1LC4zNSksIHJnYmEoNDQsMTM3LDI0NSwuMjgpKTtib3gtc2hhZG93OnZhcigtLWdsb3cpfVxyXG4uc2NlbmUtaGVhZGVye2Rpc3BsYXk6ZmxleDtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjthbGlnbi1pdGVtczpmbGV4LWVuZDtnYXA6MTJweDttYXJnaW4tYm90dG9tOjhweH1cclxuLnNjZW5lLWhlYWRlciBoMXttYXJnaW46MDtmb250LXNpemU6MjBweH1cclxuLnNjZW5lLWhlYWRlciBwe21hcmdpbjowO29wYWNpdHk6Ljg1fVxyXG4uc3RhdHN7ZGlzcGxheTpmbGV4O2dhcDoxMHB4fVxyXG4uc3RhdHtmbGV4OjE7bWluLXdpZHRoOjA7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTgwZGVnLHJnYmEoMjU1LDI1NSwyNTUsLjA2KSxyZ2JhKDI1NSwyNTUsMjU1LC4wMykpO2JvcmRlci1yYWRpdXM6MTJweDtwYWRkaW5nOjEwcHg7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6MTBweH1cclxuLnN0YXQgLmljb3tmb250LXNpemU6MThweDtmaWx0ZXI6ZHJvcC1zaGFkb3coMCAwIDhweCByZ2JhKDEyMyw0NCwyNDUsLjM1KSk7dHJhbnNpdGlvbjp0cmFuc2Zvcm0gLjNzIGVhc2V9XHJcbi5wdWxzZS1pY29ue2FuaW1hdGlvbjppY29uLXB1bHNlIC42cyBlYXNlfVxyXG5Aa2V5ZnJhbWVzIGljb24tcHVsc2V7MCUsMTAwJXt0cmFuc2Zvcm06c2NhbGUoMSl9NTAle3RyYW5zZm9ybTpzY2FsZSgxLjMpIHJvdGF0ZSg1ZGVnKX19XHJcbi5zdGF0IC52YWx7Zm9udC13ZWlnaHQ6NzAwO2ZvbnQtc2l6ZToxNnB4fVxyXG4uc3RhdCAubGFiZWx7b3BhY2l0eTouODU7Zm9udC1zaXplOjEycHh9XHJcbi5ldmVudC1mZWVke21heC1oZWlnaHQ6MjQwcHg7b3ZlcmZsb3c6YXV0bztkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDo2cHh9XHJcbi5ldmVudC1mZWVkIC5ldmVudHtvcGFjaXR5Oi45O2ZvbnQtZmFtaWx5Om1vbm9zcGFjZTtmb250LXNpemU6MTJweH1cclxuLm1haW4tc2NyZWVue3Bvc2l0aW9uOnJlbGF0aXZlO3BhZGRpbmc6MTJweCAwIDM2cHg7bWluLWhlaWdodDoxMDB2aH1cclxuLm1haW4tc3RhY2t7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6MTZweH1cclxuLm1pbmUtY2FyZHttaW4taGVpZ2h0OmNhbGMoMTAwdmggLSAxNjBweCk7cGFkZGluZzoyNHB4IDIwcHg7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6MjBweDtib3JkZXItcmFkaXVzOjIwcHh9XHJcbkBtZWRpYSAobWluLXdpZHRoOjU4MHB4KXsubWluZS1jYXJke21pbi1oZWlnaHQ6NjIwcHg7cGFkZGluZzoyOHB4IDI2cHh9fVxyXG4ubWluZS1oZWFkZXJ7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjtnYXA6MTJweH1cclxuLm1pbmUtdGl0bGV7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6MTBweDtmb250LXNpemU6MThweDtmb250LXdlaWdodDo2MDA7bGV0dGVyLXNwYWNpbmc6LjA0ZW07dGV4dC1zaGFkb3c6MCAycHggMTJweCByZ2JhKDE4LDEwLDQ4LC42KX1cclxuLm1pbmUtdGl0bGUgLmljb257ZmlsdGVyOmRyb3Atc2hhZG93KDAgMCAxMnB4IHJnYmEoMTI0LDYwLDI1NSwuNTUpKX1cclxuLm1pbmUtY2hpcHN7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6OHB4fVxyXG4ubWluZS1jaGlwcyAucGlsbHtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo2cHg7Zm9udC1zaXplOjEycHg7YmFja2dyb3VuZDpyZ2JhKDE1LDI0LDU2LC41NSk7Ym94LXNoYWRvdzppbnNldCAwIDAgMCAxcHggcmdiYSgxMjMsNDQsMjQ1LC4yNSl9XHJcbi5taW5lLWdyaWR7ZGlzcGxheTpncmlkO2dhcDoxOHB4fVxyXG5AbWVkaWEgKG1pbi13aWR0aDo2NDBweCl7Lm1pbmUtZ3JpZHtncmlkLXRlbXBsYXRlLWNvbHVtbnM6MjIwcHggMWZyO2FsaWduLWl0ZW1zOmNlbnRlcn19XHJcbi5taW5lLWdhdWdle3Bvc2l0aW9uOnJlbGF0aXZlO2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OmNlbnRlcjtwYWRkaW5nOjhweCAwfVxyXG4ubWluZS1nYXVnZSAucmluZ3t3aWR0aDoyMDBweDtoZWlnaHQ6MjAwcHg7Ym9yZGVyLXJhZGl1czo1MCU7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO2JhY2tncm91bmQ6Y29uaWMtZ3JhZGllbnQoIzdCMkNGNSAwZGVnLHJnYmEoMjU1LDI1NSwyNTUsLjA4KSAwZGVnKTtib3gtc2hhZG93Omluc2V0IDAgMCAzMHB4IHJnYmEoMTIzLDQ0LDI0NSwuMjgpLDAgMjRweCA0OHB4IHJnYmEoMTIsOCw0MiwuNTUpfVxyXG4ubWluZS1nYXVnZSAucmluZzo6YmVmb3Jle2NvbnRlbnQ6XCJcIjtwb3NpdGlvbjphYnNvbHV0ZTtpbnNldDoxOCU7Ym9yZGVyLXJhZGl1czo1MCU7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoY2lyY2xlIGF0IDUwJSAyOCUscmdiYSgxMjMsNDQsMjQ1LC40NSkscmdiYSgxMiwyMCw0NiwuOTIpIDcwJSk7Ym94LXNoYWRvdzppbnNldCAwIDE0cHggMjhweCByZ2JhKDAsMCwwLC40OCk7cG9pbnRlci1ldmVudHM6bm9uZX1cclxuLm1pbmUtZ2F1Z2UgLnJpbmctY29yZXtwb3NpdGlvbjpyZWxhdGl2ZTtkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NHB4O2ZvbnQtd2VpZ2h0OjYwMH1cclxuLm1pbmUtZ2F1Z2UgLnJpbmctY29yZSBzcGFue2ZvbnQtc2l6ZToyMnB4fVxyXG4ubWluZS1nYXVnZSAucmluZy1jb3JlIHNtYWxse2ZvbnQtc2l6ZToxMnB4O2xldHRlci1zcGFjaW5nOi4xMmVtO29wYWNpdHk6Ljc1O3RleHQtdHJhbnNmb3JtOnVwcGVyY2FzZX1cclxuLnJpbmctZ2xvd3twb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDoyMDBweDtoZWlnaHQ6MjAwcHg7Ym9yZGVyLXJhZGl1czo1MCU7ZmlsdGVyOmJsdXIoMzJweCk7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoY2lyY2xlLHJnYmEoMTIzLDQ0LDI0NSwuNDgpLHJnYmEoNDQsMTM3LDI0NSwuMSkpO29wYWNpdHk6LjY7YW5pbWF0aW9uOm1pbmUtZ2xvdyA5cyBlYXNlLWluLW91dCBpbmZpbml0ZX1cclxuLnJpbmctZ2xvdy1ie2FuaW1hdGlvbi1kZWxheTotNC41cztiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudChjaXJjbGUscmdiYSg0NCwxMzcsMjQ1LC40NSksdHJhbnNwYXJlbnQgNjUlKX1cclxuLnJpbmctcHVsc2V7YW5pbWF0aW9uOnJpbmctZmxhc2ggLjZzIGVhc2UhaW1wb3J0YW50fVxyXG5Aa2V5ZnJhbWVzIHJpbmctZmxhc2h7MCUsMTAwJXtib3gtc2hhZG93Omluc2V0IDAgMCAzMHB4IHJnYmEoMTIzLDQ0LDI0NSwuMjgpLDAgMjRweCA0OHB4IHJnYmEoMTIsOCw0MiwuNTUpfTUwJXtib3gtc2hhZG93Omluc2V0IDAgMCA1MHB4IHJnYmEoMjQ2LDE5Niw2OSwuOCksMCAyNHB4IDY4cHggcmdiYSgyNDYsMTk2LDY5LC41KSwwIDAgODBweCByZ2JhKDI0NiwxOTYsNjksLjQpfX1cclxuLnJpbmctZnVsbHthbmltYXRpb246cmluZy1nbG93LWZ1bGwgMnMgZWFzZS1pbi1vdXQgaW5maW5pdGUhaW1wb3J0YW50fVxyXG5Aa2V5ZnJhbWVzIHJpbmctZ2xvdy1mdWxsezAlLDEwMCV7Ym94LXNoYWRvdzppbnNldCAwIDAgNDBweCByZ2JhKDI0NiwxOTYsNjksLjUpLDAgMjRweCA0OHB4IHJnYmEoMjQ2LDE5Niw2OSwuMzUpLDAgMCA2MHB4IHJnYmEoMjQ2LDE5Niw2OSwuMyl9NTAle2JveC1zaGFkb3c6aW5zZXQgMCAwIDYwcHggcmdiYSgyNDYsMTk2LDY5LC43KSwwIDI0cHggNjhweCByZ2JhKDI0NiwxOTYsNjksLjUpLDAgMCA4MHB4IHJnYmEoMjQ2LDE5Niw2OSwuNSl9fVxyXG4ubWlsZXN0b25lLXB1bHNle2FuaW1hdGlvbjptaWxlc3RvbmUtcmluZyAxcyBlYXNlfVxyXG5Aa2V5ZnJhbWVzIG1pbGVzdG9uZS1yaW5nezAle3RyYW5zZm9ybTpzY2FsZSgxKX0zMCV7dHJhbnNmb3JtOnNjYWxlKDEuMDgpfTYwJXt0cmFuc2Zvcm06c2NhbGUoLjk4KX0xMDAle3RyYW5zZm9ybTpzY2FsZSgxKX19XHJcbkBrZXlmcmFtZXMgbWluZS1nbG93ezAlLDEwMCV7dHJhbnNmb3JtOnNjYWxlKC45Mik7b3BhY2l0eTouNDV9NTAle3RyYW5zZm9ybTpzY2FsZSgxLjA1KTtvcGFjaXR5Oi44fX1cclxuLm1pbmUtcHJvZ3Jlc3N7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6MTRweH1cclxuLm1pbmUtcHJvZ3Jlc3MtbWV0YXtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6ZmxleC1lbmQ7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47Zm9udC1zaXplOjE0cHg7bGV0dGVyLXNwYWNpbmc6LjAyZW19XHJcbi5taW5lLXByb2dyZXNzLXRyYWNre3Bvc2l0aW9uOnJlbGF0aXZlO2hlaWdodDoxMnB4O2JvcmRlci1yYWRpdXM6OTk5cHg7YmFja2dyb3VuZDpyZ2JhKDI1NSwyNTUsMjU1LC4xKTtvdmVyZmxvdzpoaWRkZW47Ym94LXNoYWRvdzppbnNldCAwIDAgMTRweCByZ2JhKDEyMyw0NCwyNDUsLjI4KX1cclxuLm1pbmUtcHJvZ3Jlc3MtZmlsbHtoZWlnaHQ6MTAwJTt3aWR0aDowO2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDkwZGVnLCM3QjJDRjUsIzJDODlGNSk7Ym94LXNoYWRvdzowIDAgMTZweCByZ2JhKDEyMyw0NCwyNDUsLjY1KTt0cmFuc2l0aW9uOndpZHRoIC4zNXMgdmFyKC0tZWFzZSk7cG9zaXRpb246cmVsYXRpdmU7b3ZlcmZsb3c6aGlkZGVufVxyXG4ubWluZS1wcm9ncmVzcy1maWxsOjphZnRlcntjb250ZW50OlwiXCI7cG9zaXRpb246YWJzb2x1dGU7dG9wOjA7bGVmdDotMTAwJTt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDkwZGVnLHRyYW5zcGFyZW50LHJnYmEoMjU1LDI1NSwyNTUsLjMpLHRyYW5zcGFyZW50KTthbmltYXRpb246cHJvZ3Jlc3Mtd2F2ZSAycyBsaW5lYXIgaW5maW5pdGU7cG9pbnRlci1ldmVudHM6bm9uZX1cclxuQGtleWZyYW1lcyBwcm9ncmVzcy13YXZlezAle2xlZnQ6LTEwMCV9MTAwJXtsZWZ0OjIwMCV9fVxyXG4ubWluZS1zdGF0dXN7bWluLWhlaWdodDoyMnB4O2ZvbnQtc2l6ZToxM3B4O29wYWNpdHk6Ljl9XHJcbi5taW5lLWFjdGlvbnMtZ3JpZHtkaXNwbGF5OmdyaWQ7Z2FwOjEycHg7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOnJlcGVhdCgyLG1pbm1heCgwLDFmcikpfVxyXG4ubWluZS1hY3Rpb25zLWdyaWQgLmJ0bntoZWlnaHQ6NDhweDtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpjZW50ZXI7Zm9udC1zaXplOjE1cHg7Z2FwOjhweH1cclxuLm1pbmUtYWN0aW9ucy1ncmlkIC5zcGFuLTJ7Z3JpZC1jb2x1bW46c3BhbiAyfVxyXG5AbWVkaWEgKG1pbi13aWR0aDo2ODBweCl7Lm1pbmUtYWN0aW9ucy1ncmlke2dyaWQtdGVtcGxhdGUtY29sdW1uczpyZXBlYXQoMyxtaW5tYXgoMCwxZnIpKX0ubWluZS1hY3Rpb25zLWdyaWQgLnNwYW4tMntncmlkLWNvbHVtbjpzcGFuIDN9fVxyXG4ubWluZS1mZWVke3Bvc2l0aW9uOnJlbGF0aXZlO2JvcmRlci1yYWRpdXM6MTZweDtiYWNrZ3JvdW5kOnJnYmEoMTIsMjAsNDQsLjU1KTtwYWRkaW5nOjE0cHggMTJweDtib3gtc2hhZG93Omluc2V0IDAgMCAyNHB4IHJnYmEoMTIzLDQ0LDI0NSwuMTIpO2JhY2tkcm9wLWZpbHRlcjpibHVyKDEycHgpfVxyXG4ubWluZS1mZWVkOjpiZWZvcmV7Y29udGVudDpcIlwiO3Bvc2l0aW9uOmFic29sdXRlO2luc2V0OjA7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLHJnYmEoMTIzLDQ0LDI0NSwuMTYpLHJnYmEoNDQsMTM3LDI0NSwuMTQpIDYwJSx0cmFuc3BhcmVudCk7b3BhY2l0eTouNzU7cG9pbnRlci1ldmVudHM6bm9uZX1cclxuLm1pbmUtZmVlZCAuZXZlbnQtZmVlZHttYXgtaGVpZ2h0OjE4MHB4fVxyXG4uZXZlbnR7dHJhbnNpdGlvbjpvcGFjaXR5IC4zcyBlYXNlLCB0cmFuc2Zvcm0gLjNzIGVhc2V9XHJcbi5ldmVudC1jcml0aWNhbHtjb2xvcjojZjZjNDQ1O2ZvbnQtd2VpZ2h0OjYwMH1cclxuLmV2ZW50LXdhcm5pbmd7Y29sb3I6I2ZmNWM1Y31cclxuLmV2ZW50LXN1Y2Nlc3N7Y29sb3I6IzJlYzI3ZX1cclxuLmV2ZW50LW5vcm1hbHtjb2xvcjpyZ2JhKDI1NSwyNTUsMjU1LC45KX1cclxuLm1pbmUtaG9sb2dyYW17cG9zaXRpb246cmVsYXRpdmU7ZmxleDoxO21pbi1oZWlnaHQ6MTgwcHg7Ym9yZGVyLXJhZGl1czoxOHB4O2JhY2tncm91bmQ6cmFkaWFsLWdyYWRpZW50KDkwJSAxMjAlIGF0IDUwJSAxMDAlLHJnYmEoNDQsMTM3LDI0NSwuMzUpLHJnYmEoOCwxMiwzMCwuMykgNTUlLHRyYW5zcGFyZW50KTtvdmVyZmxvdzpoaWRkZW47bWFyZ2luLXRvcDphdXRvO2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OmNlbnRlcjtpc29sYXRpb246aXNvbGF0ZTt0cmFuc2l0aW9uOmJhY2tncm91bmQgLjVzIGVhc2V9XHJcbi5ob2xvLWlkbGV7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoOTAlIDEyMCUgYXQgNTAlIDEwMCUscmdiYSgxMjMsNDQsMjQ1LC4yNSkscmdiYSg4LDEyLDMwLC4zKSA1NSUsdHJhbnNwYXJlbnQpfVxyXG4uaG9sby1taW5pbmd7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoOTAlIDEyMCUgYXQgNTAlIDEwMCUscmdiYSg0NCwxMzcsMjQ1LC40NSkscmdiYSg4LDEyLDMwLC4zKSA1NSUsdHJhbnNwYXJlbnQpfVxyXG4uaG9sby1taW5pbmcgLm1pbmUtaG9sby1ncmlke2FuaW1hdGlvbi1kdXJhdGlvbjoxMnMhaW1wb3J0YW50fVxyXG4uaG9sby1jb2xsYXBzZWR7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoOTAlIDEyMCUgYXQgNTAlIDEwMCUscmdiYSgyNTUsOTIsOTIsLjM1KSxyZ2JhKDgsMTIsMzAsLjMpIDU1JSx0cmFuc3BhcmVudCk7YW5pbWF0aW9uOmhvbG8tZ2xpdGNoIC41cyBlYXNlIGluZmluaXRlfVxyXG5Aa2V5ZnJhbWVzIGhvbG8tZ2xpdGNoezAlLDEwMCV7dHJhbnNmb3JtOnRyYW5zbGF0ZVgoMCl9MjUle3RyYW5zZm9ybTp0cmFuc2xhdGVYKC0ycHgpfTc1JXt0cmFuc2Zvcm06dHJhbnNsYXRlWCgycHgpfX1cclxuLmNyaXRpY2FsLWZsYXNoe2FuaW1hdGlvbjpjcml0aWNhbC1idXJzdCAuNHMgZWFzZX1cclxuQGtleWZyYW1lcyBjcml0aWNhbC1idXJzdHswJXtiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudCg5MCUgMTIwJSBhdCA1MCUgMTAwJSxyZ2JhKDQ0LDEzNywyNDUsLjM1KSxyZ2JhKDgsMTIsMzAsLjMpIDU1JSx0cmFuc3BhcmVudCl9NTAle2JhY2tncm91bmQ6cmFkaWFsLWdyYWRpZW50KDkwJSAxMjAlIGF0IDUwJSAxMDAlLHJnYmEoMjQ2LDE5Niw2OSwuNjUpLHJnYmEoMjQ2LDE5Niw2OSwuMikgNTUlLHRyYW5zcGFyZW50KX0xMDAle2JhY2tncm91bmQ6cmFkaWFsLWdyYWRpZW50KDkwJSAxMjAlIGF0IDUwJSAxMDAlLHJnYmEoNDQsMTM3LDI0NSwuMzUpLHJnYmEoOCwxMiwzMCwuMykgNTUlLHRyYW5zcGFyZW50KX19XHJcbi5taW5lLWhvbG8tZ3JpZHtwb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDoxNDAlO2hlaWdodDoxNDAlO2JhY2tncm91bmQ6cmVwZWF0aW5nLWxpbmVhci1ncmFkaWVudCgwZGVnLHJnYmEoMjU1LDI1NSwyNTUsLjA4KSAwLHJnYmEoMjU1LDI1NSwyNTUsLjA4KSAxcHgsdHJhbnNwYXJlbnQgMXB4LHRyYW5zcGFyZW50IDI4cHgpLHJlcGVhdGluZy1saW5lYXItZ3JhZGllbnQoOTBkZWcscmdiYSgyNTUsMjU1LDI1NSwuMDUpIDAscmdiYSgyNTUsMjU1LDI1NSwuMDUpIDFweCx0cmFuc3BhcmVudCAxcHgsdHJhbnNwYXJlbnQgMjZweCk7b3BhY2l0eTouMjI7dHJhbnNmb3JtOnRyYW5zbGF0ZTNkKC0xMCUsMCwwKSByb3RhdGUoOGRlZyk7YW5pbWF0aW9uOmhvbG8tcGFuIDE2cyBsaW5lYXIgaW5maW5pdGV9XHJcbi5taW5lLWhvbG8tZ3JpZC5kaWFnb25hbHtvcGFjaXR5Oi4xODt0cmFuc2Zvcm06dHJhbnNsYXRlM2QoMTAlLDAsMCkgcm90YXRlKC0xNmRlZyk7YW5pbWF0aW9uLWR1cmF0aW9uOjIyc31cclxuQGtleWZyYW1lcyBob2xvLXBhbnswJXt0cmFuc2Zvcm06dHJhbnNsYXRlM2QoLTEyJSwwLDApIHJvdGF0ZSg4ZGVnKX0xMDAle3RyYW5zZm9ybTp0cmFuc2xhdGUzZCgxMiUsMCwwKSByb3RhdGUoOGRlZyl9fVxyXG4ubWluZS1ob2xvLWdsb3d7cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6NzAlO2hlaWdodDo3MCU7Ym9yZGVyLXJhZGl1czo1MCU7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoY2lyY2xlIGF0IDUwJSA0MCUscmdiYSgxMjMsNDQsMjQ1LC41NSksdHJhbnNwYXJlbnQgNzAlKTtmaWx0ZXI6Ymx1cigzMnB4KTtvcGFjaXR5Oi41NTthbmltYXRpb246aG9sby1icmVhdGhlIDEwcyBlYXNlLWluLW91dCBpbmZpbml0ZX1cclxuQGtleWZyYW1lcyBob2xvLWJyZWF0aGV7MCUsMTAwJXt0cmFuc2Zvcm06c2NhbGUoLjkpO29wYWNpdHk6LjQ1fTUwJXt0cmFuc2Zvcm06c2NhbGUoMS4wOCk7b3BhY2l0eTouODV9fVxyXG4ubWluZS1zaGFyZHtwb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDoxMjBweDtoZWlnaHQ6MTIwcHg7YmFja2dyb3VuZDpjb25pYy1ncmFkaWVudChmcm9tIDE1MGRlZyxyZ2JhKDEyMyw0NCwyNDUsLjgpLHJnYmEoNDQsMTM3LDI0NSwuMzgpLHJnYmEoMTIzLDQ0LDI0NSwuMDgpKTtjbGlwLXBhdGg6cG9seWdvbig1MCUgMCw4OCUgNDAlLDcwJSAxMDAlLDMwJSAxMDAlLDEyJSA0MCUpO29wYWNpdHk6LjI2O2ZpbHRlcjpibHVyKC40cHgpO2FuaW1hdGlvbjpzaGFyZC1mbG9hdCA4cyBlYXNlLWluLW91dCBpbmZpbml0ZX1cclxuLm1pbmUtc2hhcmQuc2hhcmQtMXt0b3A6MTglO2xlZnQ6MTYlO2FuaW1hdGlvbi1kZWxheTotMS40c31cclxuLm1pbmUtc2hhcmQuc2hhcmQtMntib3R0b206MTYlO3JpZ2h0OjIyJTthbmltYXRpb24tZGVsYXk6LTMuMnM7dHJhbnNmb3JtOnNjYWxlKC43NCl9XHJcbi5taW5lLXNoYXJkLnNoYXJkLTN7dG9wOjI2JTtyaWdodDozNCU7YW5pbWF0aW9uLWRlbGF5Oi01LjFzO3RyYW5zZm9ybTpzY2FsZSguNSkgcm90YXRlKDEyZGVnKX1cclxuQGtleWZyYW1lcyBzaGFyZC1mbG9hdHswJSwxMDAle3RyYW5zZm9ybTp0cmFuc2xhdGVZKC0xMHB4KSBzY2FsZSgxKTtvcGFjaXR5Oi4yfTUwJXt0cmFuc2Zvcm06dHJhbnNsYXRlWSgxMHB4KSBzY2FsZSgxLjA1KTtvcGFjaXR5Oi40fX1cclxuLm1haW4tYW1iaWVudHtwb3NpdGlvbjphYnNvbHV0ZTtpbnNldDowO3otaW5kZXg6LTE7cG9pbnRlci1ldmVudHM6bm9uZTtvdmVyZmxvdzpoaWRkZW59XHJcbi5tYWluLWFtYmllbnQgLmFtYmllbnQub3Jie3Bvc2l0aW9uOmFic29sdXRlO3dpZHRoOjQyMHB4O2hlaWdodDo0MjBweDtib3JkZXItcmFkaXVzOjUwJTtmaWx0ZXI6Ymx1cigxMjBweCk7b3BhY2l0eTouNDI7YW5pbWF0aW9uOmFtYmllbnQtZHJpZnQgMjZzIGVhc2UtaW4tb3V0IGluZmluaXRlfVxyXG4ubWFpbi1hbWJpZW50IC5vcmItYXtiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudChjaXJjbGUscmdiYSgxMjMsNDQsMjQ1LC42KSx0cmFuc3BhcmVudCA3MCUpO3RvcDotMTQwcHg7cmlnaHQ6LTEyMHB4fVxyXG4ubWFpbi1hbWJpZW50IC5vcmItYntiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudChjaXJjbGUscmdiYSg0NCwxMzcsMjQ1LC41NSksdHJhbnNwYXJlbnQgNzAlKTtib3R0b206LTE4MHB4O2xlZnQ6LTE4MHB4O2FuaW1hdGlvbi1kZWxheTotMTNzfVxyXG4ubWFpbi1hbWJpZW50IC5ncmlke3Bvc2l0aW9uOmFic29sdXRlO2luc2V0OjA7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoNzAlIDYwJSBhdCA1MCUgMTAwJSxyZ2JhKDI1NSwyNTUsMjU1LC4wOCksdHJhbnNwYXJlbnQgNzUlKTtvcGFjaXR5Oi4zNTttaXgtYmxlbmQtbW9kZTpzY3JlZW47YW5pbWF0aW9uOmFtYmllbnQtcHVsc2UgMThzIGVhc2UtaW4tb3V0IGluZmluaXRlfVxyXG5Aa2V5ZnJhbWVzIGFtYmllbnQtZHJpZnR7MCUsMTAwJXt0cmFuc2Zvcm06dHJhbnNsYXRlM2QoMCwwLDApIHNjYWxlKDEpfTUwJXt0cmFuc2Zvcm06dHJhbnNsYXRlM2QoOCUsIC00JSwwKSBzY2FsZSgxLjA1KX19XHJcbkBrZXlmcmFtZXMgYW1iaWVudC1wdWxzZXswJSwxMDAle29wYWNpdHk6LjI1fTUwJXtvcGFjaXR5Oi40NX19XHJcbi5mYWRlLWlue2FuaW1hdGlvbjpmYWRlLWluIC4zcyB2YXIoLS1lYXNlKX1cclxuQGtleWZyYW1lcyBmYWRlLWlue2Zyb217b3BhY2l0eTowO3RyYW5zZm9ybTp0cmFuc2xhdGVZKDRweCl9dG97b3BhY2l0eToxO3RyYW5zZm9ybTpub25lfX1cclxuLmZsYXNoe2FuaW1hdGlvbjpmbGFzaCAuOXMgZWFzZX1cclxuQGtleWZyYW1lcyBmbGFzaHswJXtib3gtc2hhZG93OjAgMCAwIHJnYmEoMjU1LDI1NSwyNTUsMCl9NDAle2JveC1zaGFkb3c6MCAwIDAgNnB4IHJnYmEoMjU1LDI1NSwyNTUsLjE1KX0xMDAle2JveC1zaGFkb3c6MCAwIDAgcmdiYSgyNTUsMjU1LDI1NSwwKX19XHJcbi5za2VsZXRvbntwb3NpdGlvbjpyZWxhdGl2ZTtvdmVyZmxvdzpoaWRkZW47YmFja2dyb3VuZDpyZ2JhKDI1NSwyNTUsMjU1LC4wOCk7Ym9yZGVyLXJhZGl1czp2YXIoLS1yYWRpdXMtbWQpO2hlaWdodDo0NHB4fVxyXG4uc2tlbGV0b246OmFmdGVye2NvbnRlbnQ6XCJcIjtwb3NpdGlvbjphYnNvbHV0ZTtpbnNldDowO3RyYW5zZm9ybTp0cmFuc2xhdGVYKC0xMDAlKTtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCg5MGRlZyx0cmFuc3BhcmVudCxyZ2JhKDI1NSwyNTUsMjU1LC4xMiksdHJhbnNwYXJlbnQpO2FuaW1hdGlvbjpzaGltbWVyIDEuMnMgaW5maW5pdGU7cG9pbnRlci1ldmVudHM6bm9uZX1cclxuQGtleWZyYW1lcyBzaGltbWVyezEwMCV7dHJhbnNmb3JtOnRyYW5zbGF0ZVgoMTAwJSl9fVxyXG4ubGlzdC1pdGVte2Rpc3BsYXk6ZmxleDtnYXA6OHB4O2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjtiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjA2KTtib3JkZXItcmFkaXVzOnZhcigtLXJhZGl1cy1tZCk7cGFkZGluZzoxMHB4fVxyXG4ubGlzdC1pdGVtLS1idXl7Ym9yZGVyLWxlZnQ6M3B4IHNvbGlkIHZhcigtLWJ1eSl9XHJcbi5saXN0LWl0ZW0tLXNlbGx7Ym9yZGVyLWxlZnQ6M3B4IHNvbGlkIHZhcigtLXNlbGwpfVxyXG4ubmF2e21heC13aWR0aDp2YXIoLS1jb250YWluZXItbWF4KTttYXJnaW46MTJweCBhdXRvIDA7ZGlzcGxheTpmbGV4O2dhcDo4cHg7ZmxleC13cmFwOndyYXA7cG9zaXRpb246c3RpY2t5O3RvcDowO3otaW5kZXg6NDA7cGFkZGluZzo2cHg7Ym9yZGVyLXJhZGl1czoxNHB4O2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDE4MGRlZyxyZ2JhKDIwLDIwLDQwLC40NSkscmdiYSgyMCwyMCw0MCwuMjUpKTtiYWNrZHJvcC1maWx0ZXI6Ymx1cigxMHB4KSBzYXR1cmF0ZSgxMjUlKTtib3JkZXI6MXB4IHNvbGlkIHJnYmEoMjU1LDI1NSwyNTUsLjA2KX1cclxuLm5hdiBhe2ZsZXg6MTtkaXNwbGF5OmZsZXg7anVzdGlmeS1jb250ZW50OmNlbnRlcjthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjZweDt0ZXh0LWFsaWduOmNlbnRlcjtwYWRkaW5nOjEwcHg7Ym9yZGVyLXJhZGl1czo5OTlweDt0ZXh0LWRlY29yYXRpb246bm9uZTtjb2xvcjojZmZmO3RyYW5zaXRpb246YmFja2dyb3VuZCB2YXIoLS1kdXIpIHZhcigtLWVhc2UpLCB0cmFuc2Zvcm0gdmFyKC0tZHVyKSB2YXIoLS1lYXNlKX1cclxuLm5hdiBhIC5pY297b3BhY2l0eTouOTV9XHJcbi5uYXYgYS5hY3RpdmV7YmFja2dyb3VuZDp2YXIoLS1ncmFkKTtib3gtc2hhZG93OnZhcigtLWdsb3cpfVxyXG4ubmF2IGE6bm90KC5hY3RpdmUpOmhvdmVye2JhY2tncm91bmQ6cmdiYSgyNTUsMjU1LDI1NSwuMDYpfVxyXG4vKiBnZW5lcmljIGljb24gKi9cclxuLmljb257ZGlzcGxheTppbmxpbmUtYmxvY2s7bGluZS1oZWlnaHQ6MDt2ZXJ0aWNhbC1hbGlnbjptaWRkbGV9XHJcbi5pY29uIHN2Z3tkaXNwbGF5OmJsb2NrO2ZpbHRlcjpkcm9wLXNoYWRvdygwIDAgOHB4IHJnYmEoMTIzLDQ0LDI0NSwuMzUpKX1cclxuLyogcmFyaXR5IGJhZGdlcyAqL1xyXG4uYmFkZ2V7ZGlzcGxheTppbmxpbmUtZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjZweDtwYWRkaW5nOjJweCA4cHg7Ym9yZGVyLXJhZGl1czo5OTlweDtmb250LXNpemU6MTJweDtsaW5lLWhlaWdodDoxO2JvcmRlcjoxcHggc29saWQgcmdiYSgyNTUsMjU1LDI1NSwuMTIpO2JhY2tncm91bmQ6cmdiYSgyNTUsMjU1LDI1NSwuMDYpfVxyXG4uYmFkZ2UgaXtkaXNwbGF5OmlubGluZS1ibG9jazt3aWR0aDo4cHg7aGVpZ2h0OjhweDtib3JkZXItcmFkaXVzOjk5OXB4fVxyXG4uYmFkZ2UucmFyaXR5LWNvbW1vbiBpe2JhY2tncm91bmQ6dmFyKC0tcmFyaXR5LWNvbW1vbil9XHJcbi5iYWRnZS5yYXJpdHktcmFyZSBpe2JhY2tncm91bmQ6dmFyKC0tcmFyaXR5LXJhcmUpfVxyXG4uYmFkZ2UucmFyaXR5LWVwaWMgaXtiYWNrZ3JvdW5kOnZhcigtLXJhcml0eS1lcGljKX1cclxuLmJhZGdlLnJhcml0eS1sZWdlbmRhcnkgaXtiYWNrZ3JvdW5kOnZhcigtLXJhcml0eS1sZWdlbmRhcnkpfVxyXG4ucmFyaXR5LW91dGxpbmUtY29tbW9ue2JveC1zaGFkb3c6MCAwIDAgMXB4IHJnYmEoMTU0LDE2MCwxNjYsLjM1KSBpbnNldCwgMCAwIDI0cHggcmdiYSgxNTQsMTYwLDE2NiwuMTUpfVxyXG4ucmFyaXR5LW91dGxpbmUtcmFyZXtib3gtc2hhZG93OjAgMCAwIDFweCByZ2JhKDc5LDIxMiwyNDUsLjQ1KSBpbnNldCwgMCAwIDI4cHggcmdiYSg3OSwyMTIsMjQ1LC4yNSl9XHJcbi5yYXJpdHktb3V0bGluZS1lcGlje2JveC1zaGFkb3c6MCAwIDAgMXB4IHJnYmEoMTc4LDEwNywyNTUsLjUpIGluc2V0LCAwIDAgMzJweCByZ2JhKDE3OCwxMDcsMjU1LC4zKX1cclxuLnJhcml0eS1vdXRsaW5lLWxlZ2VuZGFyeXtib3gtc2hhZG93OjAgMCAwIDFweCByZ2JhKDI0NiwxOTYsNjksLjYpIGluc2V0LCAwIDAgMzZweCByZ2JhKDI0NiwxOTYsNjksLjM1KX1cclxuLyogYXVyYSBjYXJkIHdyYXBwZXIgKi9cclxuLml0ZW0tY2FyZHtwb3NpdGlvbjpyZWxhdGl2ZTtib3JkZXItcmFkaXVzOnZhcigtLXJhZGl1cy1tZCk7cGFkZGluZzoxMHB4O2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDE0MGRlZyxyZ2JhKDI1NSwyNTUsMjU1LC4wNikscmdiYSgyNTUsMjU1LDI1NSwuMDQpKTtvdmVyZmxvdzpoaWRkZW59XHJcbi5pdGVtLWNhcmQ6OmJlZm9yZXtjb250ZW50OlwiXCI7cG9zaXRpb246YWJzb2x1dGU7aW5zZXQ6LTFweDtib3JkZXItcmFkaXVzOmluaGVyaXQ7cGFkZGluZzoxcHg7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLHJnYmEoMjU1LDI1NSwyNTUsLjE4KSxyZ2JhKDI1NSwyNTUsMjU1LC4wMikpOy13ZWJraXQtbWFzazpsaW5lYXItZ3JhZGllbnQoIzAwMCAwIDApIGNvbnRlbnQtYm94LGxpbmVhci1ncmFkaWVudCgjMDAwIDAgMCk7LXdlYmtpdC1tYXNrLWNvbXBvc2l0ZTp4b3I7bWFzay1jb21wb3NpdGU6ZXhjbHVkZTtwb2ludGVyLWV2ZW50czpub25lfVxyXG4uaXRlbS1jYXJkW2RhdGEtcmFyaXR5PVwiY29tbW9uXCJde2JvcmRlcjoxcHggc29saWQgcmdiYSgxNTQsMTYwLDE2NiwuMjUpfVxyXG4uaXRlbS1jYXJkW2RhdGEtcmFyaXR5PVwicmFyZVwiXXtib3JkZXI6MXB4IHNvbGlkIHJnYmEoNzksMjEyLDI0NSwuMzUpfVxyXG4uaXRlbS1jYXJkW2RhdGEtcmFyaXR5PVwiZXBpY1wiXXtib3JkZXI6MXB4IHNvbGlkIHJnYmEoMTc4LDEwNywyNTUsLjQpfVxyXG4uaXRlbS1jYXJkW2RhdGEtcmFyaXR5PVwibGVnZW5kYXJ5XCJde2JvcmRlcjoxcHggc29saWQgcmdiYSgyNDYsMTk2LDY5LC40NSl9XHJcbi51cGdyYWRlLXN1Y2Nlc3N7YW5pbWF0aW9uOnVwZ3JhZGUtZmxhc2ggMXMgZWFzZX1cclxuQGtleWZyYW1lcyB1cGdyYWRlLWZsYXNoezAle3RyYW5zZm9ybTpzY2FsZSgxKTtib3gtc2hhZG93OjAgMCAwIHJnYmEoNDYsMTk0LDEyNiwwKX0yNSV7dHJhbnNmb3JtOnNjYWxlKDEuMDIpO2JveC1zaGFkb3c6MCAwIDMwcHggcmdiYSg0NiwxOTQsMTI2LC42KSwwIDAgNjBweCByZ2JhKDQ2LDE5NCwxMjYsLjMpfTUwJXt0cmFuc2Zvcm06c2NhbGUoMSk7Ym94LXNoYWRvdzowIDAgNDBweCByZ2JhKDQ2LDE5NCwxMjYsLjgpLDAgMCA4MHB4IHJnYmEoNDYsMTk0LDEyNiwuNCl9NzUle3RyYW5zZm9ybTpzY2FsZSgxLjAxKTtib3gtc2hhZG93OjAgMCAzMHB4IHJnYmEoNDYsMTk0LDEyNiwuNiksMCAwIDYwcHggcmdiYSg0NiwxOTQsMTI2LC4zKX0xMDAle3RyYW5zZm9ybTpzY2FsZSgxKTtib3gtc2hhZG93OjAgMCAwIHJnYmEoNDYsMTk0LDEyNiwwKX19XHJcbi8qIHZlcnRpY2FsIHRpbWVsaW5lICovXHJcbi50aW1lbGluZXtwb3NpdGlvbjpyZWxhdGl2ZTttYXJnaW4tdG9wOjhweDtwYWRkaW5nLWxlZnQ6MTZweH1cclxuLnRpbWVsaW5lOjpiZWZvcmV7Y29udGVudDpcIlwiO3Bvc2l0aW9uOmFic29sdXRlO2xlZnQ6NnB4O3RvcDowO2JvdHRvbTowO3dpZHRoOjJweDtiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjEpO3BvaW50ZXItZXZlbnRzOm5vbmV9XHJcbi50aW1lbGluZS1pdGVte3Bvc2l0aW9uOnJlbGF0aXZlO21hcmdpbjo4cHggMCA4cHggMH1cclxuLnRpbWVsaW5lLWl0ZW0gLmRvdHtwb3NpdGlvbjphYnNvbHV0ZTtsZWZ0Oi0xMnB4O3RvcDoycHg7d2lkdGg6MTBweDtoZWlnaHQ6MTBweDtib3JkZXItcmFkaXVzOjk5OXB4O2JhY2tncm91bmQ6dmFyKC0tcmFyaXR5LXJhcmUpO2JveC1zaGFkb3c6MCAwIDEwcHggcmdiYSg3OSwyMTIsMjQ1LC41KX1cclxuLnRpbWVsaW5lLWl0ZW0gLnRpbWV7b3BhY2l0eTouNzU7Zm9udC1zaXplOjEycHh9XHJcbi50aW1lbGluZS1pdGVtIC5kZXNje21hcmdpbi10b3A6MnB4fVxyXG4vKiBhY3Rpb24gYnV0dG9ucyBsaW5lICovXHJcbi5hY3Rpb25ze2Rpc3BsYXk6ZmxleDtnYXA6NnB4O2ZsZXgtd3JhcDp3cmFwfVxyXG4vKiBzdWJ0bGUgaG92ZXIgKi9cclxuLmhvdmVyLWxpZnR7dHJhbnNpdGlvbjp0cmFuc2Zvcm0gdmFyKC0tZHVyKSB2YXIoLS1lYXNlKSwgYm94LXNoYWRvdyB2YXIoLS1kdXIpIHZhcigtLWVhc2UpfVxyXG4uaG92ZXItbGlmdDpob3Zlcnt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtMXB4KX1cclxuLyogcmluZyBtZXRlciAqL1xyXG4ucmluZ3stLXNpemU6MTE2cHg7LS10aGljazoxMHB4O3Bvc2l0aW9uOnJlbGF0aXZlO3dpZHRoOnZhcigtLXNpemUpO2hlaWdodDp2YXIoLS1zaXplKTtib3JkZXItcmFkaXVzOjUwJTtiYWNrZ3JvdW5kOmNvbmljLWdyYWRpZW50KCM3QjJDRjUgMGRlZywgcmdiYSgyNTUsMjU1LDI1NSwuMDgpIDBkZWcpfVxyXG4ucmluZzo6YWZ0ZXJ7Y29udGVudDpcIlwiO3Bvc2l0aW9uOmFic29sdXRlO2luc2V0OmNhbGModmFyKC0tdGhpY2spKTtib3JkZXItcmFkaXVzOmluaGVyaXQ7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTgwZGVnLHJnYmEoMjU1LDI1NSwyNTUsLjA2KSxyZ2JhKDI1NSwyNTUsMjU1LC4wMikpO3BvaW50ZXItZXZlbnRzOm5vbmV9XHJcbi5yaW5nIC5sYWJlbHtwb3NpdGlvbjphYnNvbHV0ZTtpbnNldDowO2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OmNlbnRlcjtmb250LXdlaWdodDo3MDB9XHJcbi8qIHRvYXN0ICovXHJcbi50b2FzdC13cmFwe3Bvc2l0aW9uOmZpeGVkO3JpZ2h0OjE2cHg7Ym90dG9tOjE2cHg7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6OHB4O3otaW5kZXg6OTk5OX1cclxuLnRvYXN0e21heC13aWR0aDozNDBweDtwYWRkaW5nOjEwcHggMTJweDtib3JkZXItcmFkaXVzOjEycHg7Y29sb3I6I2ZmZjtiYWNrZ3JvdW5kOnJnYmEoMzAsMzAsNTAsLjk2KTtib3gtc2hhZG93OnZhcigtLWdsb3cpO3Bvc2l0aW9uOnJlbGF0aXZlO292ZXJmbG93OmhpZGRlbn1cclxuLnRvYXN0LnN1Y2Nlc3N7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTgwZGVnLHJnYmEoNDYsMTk0LDEyNiwuMTYpLHJnYmEoMzAsMzAsNTAsLjk2KSl9XHJcbi50b2FzdC53YXJue2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDE4MGRlZyxyZ2JhKDI0NiwxOTYsNjksLjE4KSxyZ2JhKDMwLDMwLDUwLC45NikpfVxyXG4udG9hc3QuZXJyb3J7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTgwZGVnLHJnYmEoMjU1LDkyLDkyLC4xOCkscmdiYSgzMCwzMCw1MCwuOTYpKX1cclxuLnRvYXN0IC5saWZle3Bvc2l0aW9uOmFic29sdXRlO2xlZnQ6MDtib3R0b206MDtoZWlnaHQ6MnB4O2JhY2tncm91bmQ6IzdCMkNGNTthbmltYXRpb246dG9hc3QtbGlmZSB2YXIoLS1saWZlLDMuNXMpIGxpbmVhciBmb3J3YXJkc31cclxuQGtleWZyYW1lcyB0b2FzdC1saWZle2Zyb217d2lkdGg6MTAwJX10b3t3aWR0aDowfX1cclxuQG1lZGlhIChwcmVmZXJzLXJlZHVjZWQtbW90aW9uOnJlZHVjZSl7KnthbmltYXRpb24tZHVyYXRpb246LjAwMW1zIWltcG9ydGFudDthbmltYXRpb24taXRlcmF0aW9uLWNvdW50OjEhaW1wb3J0YW50O3RyYW5zaXRpb24tZHVyYXRpb246MG1zIWltcG9ydGFudH19XHJcblxyXG4vKiByZXNwb25zaXZlIHdpZHRoICsgZGVza3RvcCBncmlkIGxheW91dCBmb3IgZnVsbG5lc3MgKi9cclxuQG1lZGlhIChtaW4td2lkdGg6OTAwcHgpezpyb290ey0tY29udGFpbmVyLW1heDo5MjBweH19XHJcbkBtZWRpYSAobWluLXdpZHRoOjEyMDBweCl7OnJvb3R7LS1jb250YWluZXItbWF4OjEwODBweH19XHJcblxyXG4uY29udGFpbmVyLmdyaWQtMntkaXNwbGF5OmdyaWQ7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOjFmcjtnYXA6MTJweH1cclxuQG1lZGlhIChtaW4td2lkdGg6OTgwcHgpe1xyXG4gIC5jb250YWluZXIuZ3JpZC0ye2dyaWQtdGVtcGxhdGUtY29sdW1uczoxZnIgMWZyO2FsaWduLWl0ZW1zOnN0YXJ0fVxyXG4gIC5jb250YWluZXIuZ3JpZC0yPi5jYXJkOmZpcnN0LWNoaWxke2dyaWQtY29sdW1uOjEvLTF9XHJcbn1cclxuXHJcbi8qIGRlY29yYXRpdmUgcGFnZSBvdmVybGF5czogYXVyb3JhLCBncmlkIGxpbmVzLCBib3R0b20gZ2xvdyAqL1xyXG5odG1sOjpiZWZvcmV7Y29udGVudDpcIlwiO3Bvc2l0aW9uOmZpeGVkO2luc2V0OjA7cG9pbnRlci1ldmVudHM6bm9uZTt6LWluZGV4Oi0yO29wYWNpdHk6LjAzNTtiYWNrZ3JvdW5kLWltYWdlOmxpbmVhci1ncmFkaWVudChyZ2JhKDI1NSwyNTUsMjU1LC4wNCkgMXB4LCB0cmFuc3BhcmVudCAxcHgpLGxpbmVhci1ncmFkaWVudCg5MGRlZywgcmdiYSgyNTUsMjU1LDI1NSwuMDQpIDFweCwgdHJhbnNwYXJlbnQgMXB4KTtiYWNrZ3JvdW5kLXNpemU6MjRweCAyNHB4fVxyXG5ib2R5OjpiZWZvcmV7Y29udGVudDpcIlwiO3Bvc2l0aW9uOmZpeGVkO3JpZ2h0Oi0xMHZ3O3RvcDotMTh2aDt3aWR0aDo3MHZ3O2hlaWdodDo3MHZoO3BvaW50ZXItZXZlbnRzOm5vbmU7ei1pbmRleDotMTtmaWx0ZXI6Ymx1cig1MHB4KTtvcGFjaXR5Oi41NTtiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudChjbG9zZXN0LXNpZGUgYXQgMjUlIDQwJSwgcmdiYSgxMjMsNDQsMjQ1LC4zNSksIHRyYW5zcGFyZW50IDY1JSksIHJhZGlhbC1ncmFkaWVudChjbG9zZXN0LXNpZGUgYXQgNzAlIDYwJSwgcmdiYSg0NCwxMzcsMjQ1LC4yNSksIHRyYW5zcGFyZW50IDcwJSk7bWl4LWJsZW5kLW1vZGU6c2NyZWVuO2FuaW1hdGlvbjphdXJvcmEtYSAxOHMgZWFzZS1pbi1vdXQgaW5maW5pdGUgYWx0ZXJuYXRlfVxyXG5ib2R5OjphZnRlcntjb250ZW50OlwiXCI7cG9zaXRpb246Zml4ZWQ7bGVmdDotMTB2dztib3R0b206LTIydmg7d2lkdGg6MTIwdnc7aGVpZ2h0OjYwdmg7cG9pbnRlci1ldmVudHM6bm9uZTt6LWluZGV4Oi0xO2ZpbHRlcjpibHVyKDYwcHgpO29wYWNpdHk6Ljc1O2JhY2tncm91bmQ6cmFkaWFsLWdyYWRpZW50KDEyMHZ3IDYwdmggYXQgNTAlIDEwMCUsIHJnYmEoNDQsMTM3LDI0NSwuMjIpLCB0cmFuc3BhcmVudCA2NSUpLCBjb25pYy1ncmFkaWVudChmcm9tIDIwMGRlZyBhdCA1MCUgNzUlLCByZ2JhKDEyMyw0NCwyNDUsLjE4KSwgcmdiYSg0NCwxMzcsMjQ1LC4xMiksIHRyYW5zcGFyZW50IDcwJSk7bWl4LWJsZW5kLW1vZGU6c2NyZWVuO2FuaW1hdGlvbjphdXJvcmEtYiAyMnMgZWFzZS1pbi1vdXQgaW5maW5pdGUgYWx0ZXJuYXRlfVxyXG5Aa2V5ZnJhbWVzIGF1cm9yYS1hezAle3RyYW5zZm9ybTp0cmFuc2xhdGVZKDApfTEwMCV7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoMTRweCl9fVxyXG5Aa2V5ZnJhbWVzIGF1cm9yYS1iezAle3RyYW5zZm9ybTp0cmFuc2xhdGVZKDApfTEwMCV7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoLTEycHgpfX1cclxuYDtcclxuICBjb25zdCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XHJcbiAgc3R5bGUuc2V0QXR0cmlidXRlKCdkYXRhLXVpJywgJ21pbmVyLWdhbWUnKTtcclxuICBzdHlsZS50ZXh0Q29udGVudCA9IGNzcztcclxuICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcclxuICBpbmplY3RlZCA9IHRydWU7XHJcblxyXG4gIC8vIHNvZnQgc3RhcmZpZWxkIGJhY2tncm91bmQgKHZlcnkgbGlnaHQpXHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IGV4aXN0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXN0YXJzXScpO1xyXG4gICAgaWYgKCFleGlzdHMpIHtcclxuICAgICAgY29uc3QgY3ZzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XHJcbiAgICAgIGN2cy5zZXRBdHRyaWJ1dGUoJ2RhdGEtc3RhcnMnLCAnJyk7XHJcbiAgICAgIGN2cy5zdHlsZS5jc3NUZXh0ID0gJ3Bvc2l0aW9uOmZpeGVkO2luc2V0OjA7ei1pbmRleDotMjtvcGFjaXR5Oi40MDtwb2ludGVyLWV2ZW50czpub25lOyc7XHJcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY3ZzKTtcclxuICAgICAgY29uc3QgY3R4ID0gY3ZzLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICAgIGNvbnN0IHN0YXJzID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogODAgfSwgKCkgPT4gKHsgeDogTWF0aC5yYW5kb20oKSwgeTogTWF0aC5yYW5kb20oKSwgcjogTWF0aC5yYW5kb20oKSoxLjIrMC4yLCBzOiBNYXRoLnJhbmRvbSgpKjAuOCswLjIgfSkpO1xyXG4gICAgICB0eXBlIE1ldGVvciA9IHsgeDogbnVtYmVyOyB5OiBudW1iZXI7IHZ4OiBudW1iZXI7IHZ5OiBudW1iZXI7IGxpZmU6IG51bWJlcjsgdHRsOiBudW1iZXIgfTtcclxuICAgICAgY29uc3QgbWV0ZW9yczogTWV0ZW9yW10gPSBbXTtcclxuICAgICAgY29uc3Qgc3Bhd25NZXRlb3IgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeCA9IE1hdGgucmFuZG9tKCkqY3ZzLndpZHRoKjAuNiArIGN2cy53aWR0aCowLjI7XHJcbiAgICAgICAgY29uc3QgeSA9IC0yMDsgLy8gZnJvbSB0b3BcclxuICAgICAgICBjb25zdCBzcGVlZCA9IDMgKyBNYXRoLnJhbmRvbSgpKjM7XHJcbiAgICAgICAgY29uc3QgYW5nbGUgPSBNYXRoLlBJKjAuOCArIE1hdGgucmFuZG9tKCkqMC4yOyAvLyBkaWFnb25hbGx5XHJcbiAgICAgICAgbWV0ZW9ycy5wdXNoKHsgeCwgeSwgdng6IE1hdGguY29zKGFuZ2xlKSpzcGVlZCwgdnk6IE1hdGguc2luKGFuZ2xlKSpzcGVlZCwgbGlmZTogMCwgdHRsOiAxMjAwICsgTWF0aC5yYW5kb20oKSo4MDAgfSk7XHJcbiAgICAgIH07XHJcbiAgICAgIC8vIGdlbnRsZSBwbGFuZXRzL29yYnNcclxuICAgICAgY29uc3Qgb3JicyA9IEFycmF5LmZyb20oeyBsZW5ndGg6IDIgfSwgKCkgPT4gKHsgeDogTWF0aC5yYW5kb20oKSwgeTogTWF0aC5yYW5kb20oKSowLjUgKyAwLjEsIHI6IE1hdGgucmFuZG9tKCkqODAgKyA3MCwgaHVlOiBNYXRoLnJhbmRvbSgpIH0pKTtcclxuICAgICAgY29uc3QgZml0ID0gKCkgPT4geyBjdnMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDsgY3ZzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDsgfTtcclxuICAgICAgZml0KCk7XHJcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBmaXQpO1xyXG4gICAgICBsZXQgdCA9IDA7XHJcbiAgICAgIGNvbnN0IGxvb3AgPSAoKSA9PiB7XHJcbiAgICAgICAgaWYgKCFjdHgpIHJldHVybjtcclxuICAgICAgICB0ICs9IDAuMDE2O1xyXG4gICAgICAgIGN0eC5jbGVhclJlY3QoMCwwLGN2cy53aWR0aCxjdnMuaGVpZ2h0KTtcclxuICAgICAgICAvLyBzb2Z0IG9yYnNcclxuICAgICAgICBmb3IgKGNvbnN0IG9iIG9mIG9yYnMpIHtcclxuICAgICAgICAgIGNvbnN0IHggPSBvYi54ICogY3ZzLndpZHRoLCB5ID0gb2IueSAqIGN2cy5oZWlnaHQ7XHJcbiAgICAgICAgICBjb25zdCBwdWxzZSA9IChNYXRoLnNpbih0KjAuNiArIHgqMC4wMDE1KSowLjUrMC41KSowLjEyO1xyXG4gICAgICAgICAgY29uc3QgcmFkID0gb2IuciAqICgxK3B1bHNlKTtcclxuICAgICAgICAgIGNvbnN0IGdyYWQgPSBjdHguY3JlYXRlUmFkaWFsR3JhZGllbnQoeCwgeSwgMCwgeCwgeSwgcmFkKTtcclxuICAgICAgICAgIGdyYWQuYWRkQ29sb3JTdG9wKDAsICdyZ2JhKDExMCw4MCwyNTUsMC4xMCknKTtcclxuICAgICAgICAgIGdyYWQuYWRkQ29sb3JTdG9wKDEsICdyZ2JhKDAsMCwwLDApJyk7XHJcbiAgICAgICAgICBjdHguZmlsbFN0eWxlID0gZ3JhZDtcclxuICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgIGN0eC5hcmMoeCwgeSwgcmFkLCAwLCBNYXRoLlBJKjIpO1xyXG4gICAgICAgICAgY3R4LmZpbGwoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gc3RhcnMgdHdpbmtsZVxyXG4gICAgICAgIGZvciAoY29uc3Qgc3Qgb2Ygc3RhcnMpIHtcclxuICAgICAgICAgIGNvbnN0IHggPSBzdC54ICogY3ZzLndpZHRoLCB5ID0gc3QueSAqIGN2cy5oZWlnaHQ7XHJcbiAgICAgICAgICBjb25zdCB0dyA9IChNYXRoLnNpbih0KjEuNiArIHgqMC4wMDIgKyB5KjAuMDAzKSowLjUrMC41KSowLjUrMC41O1xyXG4gICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgY3R4LmFyYyh4LCB5LCBzdC5yICsgdHcqMC42LCAwLCBNYXRoLlBJKjIpO1xyXG4gICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICdyZ2JhKDE4MCwyMDAsMjU1LDAuNiknO1xyXG4gICAgICAgICAgY3R4LmZpbGwoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gbWV0ZW9yc1xyXG4gICAgICAgIGlmIChNYXRoLnJhbmRvbSgpIDwgMC4wMTUgJiYgbWV0ZW9ycy5sZW5ndGggPCAyKSBzcGF3bk1ldGVvcigpO1xyXG4gICAgICAgIGZvciAobGV0IGk9bWV0ZW9ycy5sZW5ndGgtMTsgaT49MDsgaS0tKSB7XHJcbiAgICAgICAgICBjb25zdCBtID0gbWV0ZW9yc1tpXTtcclxuICAgICAgICAgIG0ueCArPSBtLnZ4OyBtLnkgKz0gbS52eTsgbS5saWZlICs9IDE2O1xyXG4gICAgICAgICAgLy8gdHJhaWxcclxuICAgICAgICAgIGNvbnN0IHRyYWlsID0gY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KG0ueCwgbS55LCBtLnggLSBtLnZ4KjgsIG0ueSAtIG0udnkqOCk7XHJcbiAgICAgICAgICB0cmFpbC5hZGRDb2xvclN0b3AoMCwgJ3JnYmEoMjU1LDI1NSwyNTUsMC45KScpO1xyXG4gICAgICAgICAgdHJhaWwuYWRkQ29sb3JTdG9wKDEsICdyZ2JhKDE1MCwxODAsMjU1LDApJyk7XHJcbiAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSB0cmFpbDtcclxuICAgICAgICAgIGN0eC5saW5lV2lkdGggPSAyO1xyXG4gICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgY3R4Lm1vdmVUbyhtLnggLSBtLnZ4KjEwLCBtLnkgLSBtLnZ5KjEwKTtcclxuICAgICAgICAgIGN0eC5saW5lVG8obS54LCBtLnkpO1xyXG4gICAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgICAgICAgaWYgKG0ueSA+IGN2cy5oZWlnaHQgKyA0MCB8fCBtLnggPCAtNDAgfHwgbS54ID4gY3ZzLndpZHRoICsgNDAgfHwgbS5saWZlID4gbS50dGwpIHtcclxuICAgICAgICAgICAgbWV0ZW9ycy5zcGxpY2UoaSwxKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3ApO1xyXG4gICAgICB9O1xyXG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcCk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCB7fVxyXG59XHJcbiIsICJpbXBvcnQgeyBMb2dpblNjZW5lIH0gZnJvbSAnLi9zY2VuZXMvTG9naW5TY2VuZSc7XG5pbXBvcnQgeyBNYWluU2NlbmUgfSBmcm9tICcuL3NjZW5lcy9NYWluU2NlbmUnO1xuaW1wb3J0IHsgR2FtZU1hbmFnZXIgfSBmcm9tICcuL2NvcmUvR2FtZU1hbmFnZXInO1xuaW1wb3J0IHsgV2FyZWhvdXNlU2NlbmUgfSBmcm9tICcuL3NjZW5lcy9XYXJlaG91c2VTY2VuZSc7XG5pbXBvcnQgeyBQbHVuZGVyU2NlbmUgfSBmcm9tICcuL3NjZW5lcy9QbHVuZGVyU2NlbmUnO1xuaW1wb3J0IHsgRXhjaGFuZ2VTY2VuZSB9IGZyb20gJy4vc2NlbmVzL0V4Y2hhbmdlU2NlbmUnO1xuaW1wb3J0IHsgUmFua2luZ1NjZW5lIH0gZnJvbSAnLi9zY2VuZXMvUmFua2luZ1NjZW5lJztcbmltcG9ydCB7IGVuc3VyZUdsb2JhbFN0eWxlcyB9IGZyb20gJy4vc3R5bGVzL2luamVjdCc7XG5cbmZ1bmN0aW9uIHJvdXRlVG8oY29udGFpbmVyOiBIVE1MRWxlbWVudCkge1xuICBjb25zdCBoID0gbG9jYXRpb24uaGFzaCB8fCAnIy9sb2dpbic7XG4gIGNvbnN0IHNjZW5lID0gaC5zcGxpdCgnPycpWzBdO1xuICBzd2l0Y2ggKHNjZW5lKSB7XG4gICAgY2FzZSAnIy9tYWluJzpcbiAgICAgIG5ldyBNYWluU2NlbmUoKS5tb3VudChjb250YWluZXIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnIy93YXJlaG91c2UnOlxuICAgICAgbmV3IFdhcmVob3VzZVNjZW5lKCkubW91bnQoY29udGFpbmVyKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJyMvcGx1bmRlcic6XG4gICAgICBuZXcgUGx1bmRlclNjZW5lKCkubW91bnQoY29udGFpbmVyKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJyMvZXhjaGFuZ2UnOlxuICAgICAgbmV3IEV4Y2hhbmdlU2NlbmUoKS5tb3VudChjb250YWluZXIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnIy9yYW5raW5nJzpcbiAgICAgIG5ldyBSYW5raW5nU2NlbmUoKS5tb3VudChjb250YWluZXIpO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIG5ldyBMb2dpblNjZW5lKCkubW91bnQoY29udGFpbmVyKTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYm9vdHN0cmFwKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQpIHtcbiAgLy8gXHU3QUNCXHU1MzczXHU2Q0U4XHU1MTY1XHU2ODM3XHU1RjBGXHVGRjBDXHU5MDdGXHU1MTRERk9VQ1x1RkYwOFx1OTVFQVx1NzBDMVx1RkYwOVxuICBlbnN1cmVHbG9iYWxTdHlsZXMoKTtcbiAgXG4gIC8vIFx1NUMxRFx1OEJENVx1NjA2Mlx1NTkwRFx1NEYxQVx1OEJERFxuICBjb25zdCByZXN0b3JlZCA9IGF3YWl0IEdhbWVNYW5hZ2VyLkkudHJ5UmVzdG9yZVNlc3Npb24oKTtcbiAgXG4gIC8vIFx1NTk4Mlx1Njc5Q1x1NjcwOVx1NjcwOVx1NjU0OHRva2VuXHU0RTE0XHU1RjUzXHU1MjREXHU1NzI4XHU3NjdCXHU1RjU1XHU5ODc1XHVGRjBDXHU4REYzXHU4RjZDXHU1MjMwXHU0RTNCXHU5ODc1XG4gIGlmIChyZXN0b3JlZCAmJiAobG9jYXRpb24uaGFzaCA9PT0gJycgfHwgbG9jYXRpb24uaGFzaCA9PT0gJyMvbG9naW4nKSkge1xuICAgIGxvY2F0aW9uLmhhc2ggPSAnIy9tYWluJztcbiAgfVxuICBcbiAgLy8gXHU0RjdGXHU3NTI4IHJlcXVlc3RBbmltYXRpb25GcmFtZSBcdTc4NkVcdTRGRERcdTY4MzdcdTVGMEZcdTVERjJcdTVFOTRcdTc1MjhcbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICByb3V0ZVRvKGNvbnRhaW5lcik7XG4gIH0pO1xuICBcbiAgd2luZG93Lm9uaGFzaGNoYW5nZSA9ICgpID0+IHJvdXRlVG8oY29udGFpbmVyKTtcbn1cblxuLy8gXHU0RkJGXHU2Mzc3XHU1NDJGXHU1MkE4XHVGRjA4XHU3RjUxXHU5ODc1XHU3M0FGXHU1ODgzXHVGRjA5XG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgKHdpbmRvdyBhcyBhbnkpLk1pbmVyQXBwID0geyBib290c3RyYXAsIEdhbWVNYW5hZ2VyIH07XG59XG5cblxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7O0FBQU8sTUFBTSxrQkFBTixNQUFNLGdCQUFlO0FBQUEsSUFNMUIsY0FBYztBQUZkLDBCQUFRLFNBQXVCO0FBSTdCLFdBQUssUUFBUSxhQUFhLFFBQVEsWUFBWTtBQUFBLElBQ2hEO0FBQUEsSUFQQSxXQUFXLElBQW9CO0FBRmpDO0FBRW1DLGNBQU8sVUFBSyxjQUFMLFlBQW1CLEtBQUssWUFBWSxJQUFJLGdCQUFlO0FBQUEsSUFBSTtBQUFBLElBU25HLFNBQVMsR0FBa0I7QUFDekIsV0FBSyxRQUFRO0FBQ2IsVUFBSSxHQUFHO0FBQ0wscUJBQWEsUUFBUSxjQUFjLENBQUM7QUFBQSxNQUN0QyxPQUFPO0FBQ0wscUJBQWEsV0FBVyxZQUFZO0FBQUEsTUFDdEM7QUFBQSxJQUNGO0FBQUEsSUFFQSxXQUEwQjtBQUN4QixhQUFPLEtBQUs7QUFBQSxJQUNkO0FBQUEsSUFFQSxhQUFhO0FBQ1gsV0FBSyxTQUFTLElBQUk7QUFB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QUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBeU1aLFVBQU0sUUFBUSxTQUFTLGNBQWMsT0FBTztBQUM1QyxVQUFNLGFBQWEsV0FBVyxZQUFZO0FBQzFDLFVBQU0sY0FBYztBQUNwQixhQUFTLEtBQUssWUFBWSxLQUFLO0FBQy9CLGVBQVc7QUFHWCxRQUFJO0FBQ0YsWUFBTSxTQUFTLFNB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QUNwQztBQUFBLE1BQ0YsS0FBSztBQUNILFlBQUksYUFBYSxFQUFFLE1BQU0sU0FBUztBQUNsQztBQUFBLE1BQ0YsS0FBSztBQUNILFlBQUksY0FBYyxFQUFFLE1BQU0sU0FBUztBQUNuQztBQUFBLE1BQ0YsS0FBSztBQUNILFlBQUksYUFBYSxFQUFFLE1BQU0sU0FBUztBQUNsQztBQUFBLE1BQ0Y7QUFDRSxZQUFJLFdBQVcsRUFBRSxNQUFNLFNBQVM7QUFBQSxJQUNwQztBQUFBLEVBQ0Y7QUFFQSxpQkFBc0IsVUFBVSxXQUF3QjtBQUV0RCx1QkFBbUI7QUFHbkIsVUFBTSxXQUFXLE1BQU0sWUFBWSxFQUFFLGtCQUFrQjtBQUd2RCxRQUFJLGFBQWEsU0FBUyxTQUFTLE1BQU0sU0FBUyxTQUFTLFlBQVk7QUFDckUsZUFBUyxPQUFPO0FBQUEsSUFDbEI7QUFHQSwwQkFBc0IsTUFBTTtBQUMxQixjQUFRLFNBQVM7QUFBQSxJQUNuQixDQUFDO0FBRUQsV0FBTyxlQUFlLE1BQU0sUUFBUSxTQUFTO0FBQUEsRUFDL0M7QUFHQSxNQUFJLE9BQU8sV0FBVyxhQUFhO0FBQ2pDLElBQUMsT0FBZSxXQUFXLEVBQUUsV0FBVyxZQUFZO0FBQUEsRUFDdEQ7IiwKICAibmFtZXMiOiBbIm9yaWdpbmFsSFRNTCIsICJlIiwgIm9yaWdpbmFsSFRNTCIsICJvcmlnaW5hbEhUTUwiLCAib3JpZ2luYWxIVE1MIiwgImdyYWQiXQp9Cg==
