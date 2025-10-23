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

  // frontend-scripts/components/Toast.ts
  var _box = null;
  function ensureBox() {
    if (_box) return _box;
    const div = document.createElement("div");
    div.style.cssText = "position:fixed;right:16px;bottom:16px;display:flex;flex-direction:column;gap:8px;z-index:9999;";
    document.body.appendChild(div);
    _box = div;
    return div;
  }
  function showToast(text) {
    const box = ensureBox();
    const item = document.createElement("div");
    item.textContent = text;
    item.style.cssText = "max-width:320px;padding:10px 12px;border-radius:10px;color:#fff;background:rgba(30,30,50,.9);box-shadow:0 8px 20px rgba(0,0,0,.35),0 0 12px rgba(123,44,245,.7);";
    box.prepend(item);
    setTimeout(() => {
      item.style.opacity = "0";
      item.style.transition = "opacity .5s";
      setTimeout(() => item.remove(), 500);
    }, 3500);
  }

  // frontend-scripts/scenes/LoginScene.ts
  var LoginScene = class {
    mount(root) {
      const view = html(`
      <div class="container" style="color:#fff;">
        <div class="card fade-in" style="max-width:420px;margin:40px auto;">
          <h2 style="margin:0 0 12px 0;">\u767B\u5F55 / \u6CE8\u518C</h2>
          <input id="u" class="input" placeholder="\u7528\u6237\u540D" autocomplete="username"/>
          <input id="p" class="input" placeholder="\u5BC6\u7801" type="password" autocomplete="current-password"/>
          <button id="go" class="btn btn-primary" style="width:100%;margin-top:8px;">\u8FDB\u5165\u6E38\u620F</button>
          <div style="margin-top:8px;opacity:.75;font-size:12px;">\u63D0\u793A\uFF1A\u82E5\u8D26\u6237\u4E0D\u5B58\u5728\uFF0C\u5C06\u81EA\u52A8\u521B\u5EFA\u5E76\u767B\u5F55\u3002</div>
        </div>
      </div>
    `);
      root.innerHTML = "";
      root.appendChild(view);
      const uEl = qs(view, "#u");
      const pEl = qs(view, "#p");
      const go = qs(view, "#go");
      const submit = async () => {
        const username = (uEl.value || "").trim();
        const password = (pEl.value || "").trim();
        if (!username || !password) {
          showToast("\u8BF7\u586B\u5199\u7528\u6237\u540D\u548C\u5BC6\u7801");
          return;
        }
        go.disabled = true;
        go.textContent = "\u767B\u5F55\u4E2D\u2026";
        try {
          await GameManager.I.loginOrRegister(username, password);
          location.hash = "#/main";
        } catch (e) {
          showToast((e == null ? void 0 : e.message) || "\u767B\u5F55\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5");
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
      { key: "main", text: "\u4E3B\u9875", href: "#/main" },
      { key: "warehouse", text: "\u4ED3\u5E93", href: "#/warehouse" },
      { key: "plunder", text: "\u63A0\u593A", href: "#/plunder" },
      { key: "exchange", text: "\u4EA4\u6613\u6240", href: "#/exchange" },
      { key: "ranking", text: "\u6392\u884C", href: "#/ranking" }
    ];
    const wrap = document.createElement("div");
    wrap.className = "nav";
    for (const t of tabs) {
      const a = document.createElement("a");
      a.href = t.href;
      a.textContent = t.text;
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
    box.appendChild(card);
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
      const view = html(`
      <div class="container" style="color:#fff;">
        <div class="mine card fade-in">
          <div style="opacity:.9;margin-bottom:8px;">\u26CF\uFE0F \u6316\u77FF\u9762\u677F</div>
          <div style="height:10px;border-radius:999px;background:rgba(255,255,255,.12);overflow:hidden;">
            <div id="fill" style="height:100%;width:0%;background:linear-gradient(90deg,#7B2CF5,#2C89F5);box-shadow:0 0 10px #7B2CF5;transition:width .3s ease"></div>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin:8px 0 12px;">
            <span>\u77FF\u8F66\u88C5\u8F7D</span>
            <strong id="percent">0%</strong>
          </div>
          <div class="row" style="gap:8px;">
            <button id="start" class="btn btn-buy" style="flex:1;">\u5F00\u59CB\u6316\u77FF</button>
            <button id="stop" class="btn btn-ghost" style="flex:1;">\u505C\u6B62</button>
            <button id="collect" class="btn btn-primary" style="flex:1;">\u6536\u77FF</button>
          </div>
          <div class="row" style="gap:8px;margin-top:8px;">
            <button id="status" class="btn btn-ghost" style="flex:1;">\u5237\u65B0\u72B6\u6001</button>
            <button id="repair" class="btn btn-sell" style="flex:1;">\u4FEE\u7406</button>
          </div>
          <div id="statusText" style="margin-top:6px;opacity:.9;min-height:20px;"></div>
        </div>
      </div>
    `);
      root.innerHTML = "";
      root.appendChild(nav);
      root.appendChild(bar.root);
      root.appendChild(view);
      this.view = view;
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
      this.els.start = qs(this.view, "#start");
      this.els.stop = qs(this.view, "#stop");
      this.els.collect = qs(this.view, "#collect");
      this.els.repair = qs(this.view, "#repair");
      this.els.statusBtn = qs(this.view, "#status");
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
        } else if (msg.type === "normal" && msg.amount) {
          this.setStatusMessage(`\u77FF\u8F66\u589E\u52A0 ${msg.amount}\uFF0C\u5F53\u524D ${this.formatPercent()}`);
        } else if (msg.type === "collapse") {
          this.setStatusMessage("\u77FF\u9053\u574D\u584C\uFF0C\u8BF7\u7ACB\u5373\u4FEE\u7406");
        } else if (msg.type === "collect") {
          this.setStatusMessage("\u77FF\u77F3\u5DF2\u6536\u96C6\uFF0C\u77FF\u8F66\u6E05\u7A7A");
        } else if (this.isCollapsed) {
          this.setStatusMessage(`\u77FF\u9053\u574D\u584C\uFF0C\u5269\u4F59 ${this.collapseRemaining}s`);
        }
        this.updateControls();
      };
      this.mineCollapseHandler = (msg) => {
        const seconds = Number(msg == null ? void 0 : msg.repair_duration) || 0;
        if (seconds > 0) this.beginCollapseCountdown(seconds);
        showToast(`\u77FF\u9053\u574D\u584C\uFF0C\u9700\u4FEE\u7406\uFF08\u7EA6 ${seconds}s\uFF09`);
      };
      this.plunderHandler = (msg) => {
        showToast(`\u88AB\u63A0\u593A\uFF1A\u6765\u81EA ${msg.attacker}\uFF0C\u635F\u5931 ${msg.loss}`);
      };
      RealtimeClient.I.on("mine.update", this.mineUpdateHandler);
      RealtimeClient.I.on("mine.collapse", this.mineCollapseHandler);
      RealtimeClient.I.on("plunder.attacked", this.plunderHandler);
    }
    async handleStart() {
      if (this.pending || this.isCollapsed) {
        if (this.isCollapsed) showToast("\u77FF\u9053\u574D\u584C\uFF0C\u8BF7\u5148\u4FEE\u7406");
        return;
      }
      this.pending = "start";
      this.updateControls();
      try {
        const status = await NetworkManager.I.request("/mine/start", { method: "POST" });
        this.applyStatus(status);
        this.setStatusMessage("\u77FF\u673A\u5DF2\u542F\u52A8");
      } catch (e) {
        showToast((e == null ? void 0 : e.message) || "\u542F\u52A8\u5931\u8D25");
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
      } catch (e) {
        showToast((e == null ? void 0 : e.message) || "\u505C\u6B62\u5931\u8D25");
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
          showToast(`\u6536\u96C6\u77FF\u77F3 ${res.collected}`);
        } else {
          showToast("\u77FF\u8F66\u4E3A\u7A7A\uFF0C\u65E0\u77FF\u77F3\u53EF\u6536\u96C6");
        }
        await updateBar();
      } catch (e) {
        showToast((e == null ? void 0 : e.message) || "\u6536\u77FF\u5931\u8D25");
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
      } catch (e) {
        showToast((e == null ? void 0 : e.message) || "\u4FEE\u7406\u5931\u8D25");
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
        showToast((e == null ? void 0 : e.message) || "\u83B7\u53D6\u72B6\u6001\u5931\u8D25");
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
      if (this.pending !== "collect" && this.els.collect) {
        this.els.collect.disabled = this.pending === "collect" || this.cartAmt <= 0;
      }
    }
    updateControls() {
      const isBusy = (key) => this.pending === key;
      if (this.els.start) {
        const busy = isBusy("start");
        this.els.start.disabled = busy || this.isMining || this.isCollapsed;
        this.els.start.textContent = busy ? "\u542F\u52A8\u4E2D\u2026" : this.isMining ? "\u6316\u77FF\u4E2D" : "\u5F00\u59CB\u6316\u77FF";
      }
      if (this.els.stop) {
        const busy = isBusy("stop");
        this.els.stop.disabled = busy || !this.isMining;
        this.els.stop.textContent = busy ? "\u505C\u6B62\u4E2D\u2026" : "\u505C\u6B62";
      }
      if (this.els.collect) {
        const busy = isBusy("collect");
        this.els.collect.disabled = busy || this.cartAmt <= 0;
        this.els.collect.textContent = busy ? "\u6536\u96C6\u4E2D\u2026" : "\u6536\u77FF";
      }
      if (this.els.repair) {
        const busy = isBusy("repair");
        this.els.repair.disabled = busy || !this.isCollapsed;
        this.els.repair.textContent = busy ? "\u4FEE\u7406\u4E2D\u2026" : "\u4FEE\u7406";
      }
      if (this.els.statusBtn) {
        this.els.statusBtn.disabled = isBusy("status");
        this.els.statusBtn.textContent = isBusy("status") ? "\u5237\u65B0\u4E2D\u2026" : "\u5237\u65B0\u72B6\u6001";
      }
    }
    setStatusMessage(text) {
      if (!this.els.statusText) return;
      this.els.statusText.textContent = text;
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
      <div class="container" style="color:#fff;">
        <div class="card fade-in">
          <div class="row" style="justify-content:space-between;align-items:center;">
            <h3 style="margin:0;">\u4ED3\u5E93</h3>
            <button id="refresh" class="btn btn-primary">\u5237\u65B0</button>
          </div>
          <div style="margin-top:12px;">
            <details open>
              <summary>\u6211\u7684\u9053\u5177</summary>
              <div id="list" style="margin-top:8px;display:flex;flex-direction:column;gap:8px;"></div>
            </details>
            <details>
              <summary>\u9053\u5177\u6A21\u677F</summary>
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
      const load = async () => {
        refreshBtn.disabled = true;
        refreshBtn.textContent = "\u5237\u65B0\u4E2D\u2026";
        await bar.update();
        list.innerHTML = "";
        for (let i = 0; i < 3; i++) list.appendChild(html('<div class="skeleton"></div>'));
        try {
          const data = await NetworkManager.I.request("/items");
          list.innerHTML = "";
          if (!data.items.length) {
            list.appendChild(html('<div style="opacity:.8;">\u6682\u65E0\u9053\u5177\uFF0C\u5C1D\u8BD5\u591A\u6316\u77FF\u6216\u63A0\u593A\u4EE5\u83B7\u53D6\u66F4\u591A\u8D44\u6E90</div>'));
          }
          for (const item of data.items) {
            const row = html(`
            <div class="list-item ${item.isEquipped ? "list-item--buy" : ""}">
              <div style="display:flex;flex-direction:column;gap:2px;">
                <div>
                  <strong>${item.templateId}</strong>
                  ${item.isEquipped ? '<span class="pill">\u5DF2\u88C5\u5907</span>' : ""}
                  ${item.isListed ? '<span class="pill">\u6302\u5355\u4E2D</span>' : ""}
                </div>
                <div style="opacity:.85;">\u7B49\u7EA7 Lv.${item.level} \xB7 \u5B9E\u4F8B ${item.id}</div>
              </div>
              <div class="row" style="gap:6px;">
                <button class="btn btn-buy" data-act="equip" data-id="${item.id}" ${item.isEquipped ? "disabled" : ""}>\u88C5\u5907</button>
                <button class="btn btn-primary" data-act="upgrade" data-id="${item.id}">\u5347\u7EA7</button>
              </div>
            </div>
          `);
            row.addEventListener("click", async (ev) => {
              const target = ev.target;
              const id = target.getAttribute("data-id");
              const act = target.getAttribute("data-act");
              if (!id || !act) return;
              target.disabled = true;
              const original = target.textContent || "";
              target.textContent = act === "equip" ? "\u88C5\u5907\u4E2D\u2026" : "\u5347\u7EA7\u4E2D\u2026";
              try {
                if (act === "equip") {
                  await NetworkManager.I.request("/items/equip", { method: "POST", body: JSON.stringify({ itemId: id }) });
                  showToast("\u88C5\u5907\u6210\u529F");
                } else {
                  await NetworkManager.I.request("/items/upgrade", { method: "POST", body: JSON.stringify({ itemId: id }) });
                  showToast("\u5347\u7EA7\u6210\u529F");
                }
                await load();
              } catch (e) {
                showToast((e == null ? void 0 : e.message) || "\u64CD\u4F5C\u5931\u8D25");
              } finally {
                target.textContent = original;
                target.disabled = false;
              }
            });
            list.appendChild(row);
          }
          const tpls = await NetworkManager.I.request("/items/templates");
          tplContainer.innerHTML = "";
          for (const tpl of tpls.templates) {
            const row = html(`<div class="list-item"><strong>${tpl.name || tpl.id}</strong> \xB7 ${tpl.category || "\u672A\u77E5\u7C7B\u578B"}</div>`);
            tplContainer.appendChild(row);
          }
        } catch (e) {
          showToast((e == null ? void 0 : e.message) || "\u52A0\u8F7D\u4ED3\u5E93\u5931\u8D25");
        } finally {
          refreshBtn.disabled = false;
          refreshBtn.textContent = "\u5237\u65B0";
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
      <div class="container" style="color:#fff;">
        <div class="card fade-in">
          <div class="row" style="justify-content:space-between;align-items:center;">
            <h3 style="margin:0;">\u63A0\u593A\u76EE\u6807</h3>
            <button id="refresh" class="btn btn-primary">\u5237\u65B0</button>
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
      const load = async () => {
        refreshBtn.disabled = true;
        refreshBtn.textContent = "\u5237\u65B0\u4E2D\u2026";
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
            <div class="list-item">
              <div style="display:flex;flex-direction:column;gap:2px;">
                <div><strong>${target.username || target.id}</strong></div>
                <div style="opacity:.85;">\u77FF\u77F3\uFF1A${target.ore} <span class="pill">\u9884\u8BA1\u6536\u76CA 5%~30%</span></div>
              </div>
              <div>
                <button class="btn btn-sell" data-id="${target.id}">\u63A0\u593A</button>
              </div>
            </div>
          `);
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
                  showToast(`\u63A0\u593A\u6210\u529F\uFF0C\u83B7\u5F97 ${res.loot_amount}`);
                } else {
                  this.log(`\u63A0\u593A ${id} \u5931\u8D25`);
                  showToast("\u63A0\u593A\u5931\u8D25");
                }
                await bar.update();
              } catch (e) {
                const message = (e == null ? void 0 : e.message) || "\u63A0\u593A\u5931\u8D25";
                this.log(`\u63A0\u593A\u5931\u8D25\uFF1A${message}`);
                if (message.includes("\u51B7\u5374")) {
                  showToast("\u63A0\u593A\u5668\u51B7\u5374\u4E2D\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5");
                } else {
                  showToast(message);
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
          refreshBtn.textContent = "\u5237\u65B0";
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
      <div class="container" style="color:#fff;display:flex;flex-direction:column;gap:12px;">
        <div class="card fade-in">
          <h3 style="margin:0 0 12px;">\u5E02\u573A\u4E0B\u5355</h3>
          <div class="row" style="flex-wrap:wrap;align-items:flex-end;gap:12px;">
            <div style="flex:1;min-width:180px;">
              <label>\u8D2D\u4E70\u6A21\u677F</label>
              <select id="tpl" class="input"></select>
            </div>
            <div style="flex:1;min-width:120px;">
              <label>\u4EF7\u683C (BB\u5E01)</label>
              <input id="price" class="input" type="number" min="1" value="10"/>
            </div>
            <div style="flex:1;min-width:120px;">
              <label>\u8D2D\u4E70\u6570\u91CF</label>
              <input id="amount" class="input" type="number" min="1" value="1"/>
            </div>
            <button id="placeBuy" class="btn btn-buy" style="min-width:120px;">\u4E0B\u4E70\u5355</button>
          </div>
          <div style="height:8px;"></div>
          <div class="row" style="flex-wrap:wrap;align-items:flex-end;gap:12px;">
            <div style="flex:1;min-width:220px;">
              <label>\u51FA\u552E\u9053\u5177</label>
              <select id="inst" class="input"></select>
            </div>
            <div style="flex:1;min-width:120px;">
              <label>\u4EF7\u683C (BB\u5E01)</label>
              <input id="sprice" class="input" type="number" min="1" value="5"/>
            </div>
            <button id="placeSell" class="btn btn-sell" style="min-width:120px;">\u4E0B\u5356\u5355</button>
          </div>
          <div id="inventory" style="margin-top:12px;display:flex;flex-wrap:wrap;gap:8px;"></div>
        </div>

        <div class="card fade-in">
          <div class="row" style="justify-content:space-between;align-items:center;gap:12px;">
            <h3 style="margin:0;">\u8BA2\u5355\u7C3F</h3>
            <div class="row" style="flex-wrap:wrap;gap:8px;">
              <select id="q_tpl" class="input" style="width:180px;"></select>
              <select id="q_type" class="input" style="width:120px;">
                <option value="buy">\u4E70\u5355</option>
                <option value="sell">\u5356\u5355</option>
              </select>
              <label class="row pill" style="align-items:center;gap:6px;">
                <input id="my" type="checkbox"/> \u53EA\u770B\u6211\u7684
              </label>
              <button id="refresh" class="btn btn-primary" style="min-width:96px;">\u5237\u65B0</button>
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
      const refreshBtn = qs(view, "#refresh");
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
        if (!opts.quiet) refreshBtn.textContent = "\u5237\u65B0\u4E2D\u2026";
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
                ${isMine ? `<button class="btn btn-ghost" data-id="${order.id}">\u64A4\u5355</button>` : ""}
              </div>
            </div>
          `);
            if (!prevIds.has(order.id)) row.classList.add("flash");
            row.addEventListener("click", async (ev) => {
              const target = ev.target;
              const id = target.getAttribute("data-id");
              if (!id) return;
              try {
                target.setAttribute("disabled", "true");
                await NetworkManager.I.request(`/exchange/orders/${id}`, { method: "DELETE" });
                showToast("\u64A4\u5355\u6210\u529F");
                await refresh();
              } catch (e) {
                showToast((e == null ? void 0 : e.message) || "\u64A4\u5355\u5931\u8D25");
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
          refreshBtn.textContent = "\u5237\u65B0";
        }
      };
      placeBuy.onclick = async () => {
        const tplId = buyTpl.value.trim();
        const price = Number(buyPrice.value);
        const amount = Number(buyAmount.value);
        if (!tplId) {
          showToast("\u8BF7\u9009\u62E9\u8D2D\u4E70\u7684\u6A21\u677F");
          return;
        }
        if (price <= 0 || amount <= 0) {
          showToast("\u8BF7\u8F93\u5165\u6709\u6548\u7684\u4EF7\u683C\u4E0E\u6570\u91CF");
          return;
        }
        placeBuy.disabled = true;
        placeBuy.textContent = "\u63D0\u4EA4\u4E2D\u2026";
        try {
          const res = await NetworkManager.I.request("/exchange/orders", {
            method: "POST",
            body: JSON.stringify({ type: "buy", item_template_id: tplId, price, amount })
          });
          showToast(`\u4E70\u5355\u5DF2\u63D0\u4EA4 (#${res.id})`);
          log(`\u4E70\u5355\u6210\u529F: ${res.id}`);
          await bar.update();
          await refresh();
        } catch (e) {
          showToast((e == null ? void 0 : e.message) || "\u4E70\u5355\u63D0\u4EA4\u5931\u8D25");
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
          showToast("\u8BF7\u9009\u62E9\u8981\u51FA\u552E\u7684\u9053\u5177");
          return;
        }
        if (price <= 0) {
          showToast("\u8BF7\u8F93\u5165\u6709\u6548\u7684\u4EF7\u683C");
          return;
        }
        placeSell.disabled = true;
        placeSell.textContent = "\u63D0\u4EA4\u4E2D\u2026";
        try {
          const res = await NetworkManager.I.request("/exchange/orders", {
            method: "POST",
            body: JSON.stringify({ type: "sell", item_instance_id: instId, price })
          });
          showToast(`\u5356\u5355\u5DF2\u63D0\u4EA4 (#${res.id})`);
          log(`\u5356\u5355\u6210\u529F: ${res.id}`);
          await bar.update();
          await loadMetadata();
          await refresh();
        } catch (e) {
          showToast((e == null ? void 0 : e.message) || "\u5356\u5355\u63D0\u4EA4\u5931\u8D25");
          log((e == null ? void 0 : e.message) || "\u5356\u5355\u63D0\u4EA4\u5931\u8D25");
        } finally {
          placeSell.disabled = false;
          placeSell.textContent = "\u4E0B\u5356\u5355";
        }
      };
      refreshBtn.onclick = () => refresh();
      queryTpl.onchange = () => refresh();
      queryType.onchange = () => refresh();
      queryMineOnly.onchange = () => refresh();
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
      <div class="container" style="color:#fff;">
        <div class="card fade-in">
          <div class="row" style="justify-content:space-between;align-items:center;">
            <h3 style="margin:0;">\u6392\u884C\u699C</h3>
            <button id="refresh" class="btn btn-primary">\u5237\u65B0</button>
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
      const load = async () => {
        refreshBtn.disabled = true;
        refreshBtn.textContent = "\u5237\u65B0\u4E2D\u2026";
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
            const row = html(`
            <div class="list-item" style="${entry.rank === 1 ? "border-left:3px solid var(--ok);" : ""}">
              <span>${medal} #${entry.rank}</span>
              <span style="flex:1;opacity:.9;margin-left:12px;">${entry.userId}</span>
              <strong>${entry.score}</strong>
            </div>
          `);
            list.appendChild(row);
          }
        } catch (e) {
          meBox.textContent = (e == null ? void 0 : e.message) || "\u6392\u884C\u699C\u52A0\u8F7D\u5931\u8D25";
        } finally {
          refreshBtn.disabled = false;
          refreshBtn.textContent = "\u5237\u65B0";
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
    const css = `:root{--bg:#0b1020;--fg:#fff;--muted:rgba(255,255,255,.75);--grad:linear-gradient(135deg,#7B2CF5,#2C89F5);--panel-grad:linear-gradient(135deg,rgba(123,44,245,.25),rgba(44,137,245,.25));--glass:blur(10px);--glow:0 8px 20px rgba(0,0,0,.35),0 0 12px rgba(123,44,245,.7);--radius-sm:10px;--radius-md:12px;--radius-lg:16px;--ease:cubic-bezier(.22,.61,.36,1);--dur:.28s;--buy:#2C89F5;--sell:#E36414;--ok:#2ec27e;--warn:#f6c445;--danger:#ff5c5c}
html,body{background:var(--bg);color:var(--fg);font-family:system-ui,-apple-system,"Segoe UI","PingFang SC","Microsoft YaHei",Arial,sans-serif}
.container{padding:0 12px}
.container{max-width:680px;margin:12px auto}
.card{border-radius:var(--radius-lg);background:var(--panel-grad);backdrop-filter:var(--glass);box-shadow:var(--glow);padding:12px}
.row{display:flex;gap:8px;align-items:center}
.card input,.card button{box-sizing:border-box;outline:none}
.card input{background:rgba(255,255,255,.08);border:0;border-radius:var(--radius-md);color:var(--fg);padding:10px;margin:8px 0;appearance:none;-webkit-appearance:none;background-clip:padding-box}
.card button{width:100%;border-radius:var(--radius-md)}
.btn{padding:10px 14px;border:0;border-radius:var(--radius-md);color:#fff;transition:transform var(--dur) var(--ease),box-shadow var(--dur) var(--ease)}
.btn:active{transform:translateY(1px) scale(.99)}
.btn-primary{background:var(--grad);box-shadow:var(--glow)}
.btn-buy{background:var(--buy)}
.btn-sell{background:var(--sell)}
.btn-ghost{background:rgba(255,255,255,.08)}
.input{width:100%;padding:10px;border:0;border-radius:var(--radius-md);background:rgba(255,255,255,.08);color:var(--fg)}
.pill{padding:2px 8px;border-radius:999px;background:rgba(255,255,255,.08);font-size:12px}
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
.nav a{flex:1;text-align:center;padding:10px;border-radius:999px;text-decoration:none;color:#fff}
.nav a.active{background:var(--grad);box-shadow:var(--glow)}
@media (prefers-reduced-motion:reduce){*{animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:0ms!important}}
`;
    const style = document.createElement("style");
    style.setAttribute("data-ui", "miner-game");
    style.textContent = css;
    document.head.appendChild(style);
    injected = true;
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vZnJvbnRlbmQtc2NyaXB0cy9jb3JlL05ldHdvcmtNYW5hZ2VyLnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvY29yZS9HYW1lTWFuYWdlci50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL3V0aWxzL2RvbS50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvbXBvbmVudHMvVG9hc3QudHMiLCAiLi4vZnJvbnRlbmQtc2NyaXB0cy9zY2VuZXMvTG9naW5TY2VuZS50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvcmUvRW52LnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvY29yZS9SZWFsdGltZUNsaWVudC50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvbXBvbmVudHMvTmF2LnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvY29tcG9uZW50cy9SZXNvdXJjZUJhci50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL2NvbXBvbmVudHMvRmxvYXRUZXh0LnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvc2NlbmVzL01haW5TY2VuZS50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL3NjZW5lcy9XYXJlaG91c2VTY2VuZS50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL3NjZW5lcy9QbHVuZGVyU2NlbmUudHMiLCAiLi4vZnJvbnRlbmQtc2NyaXB0cy9zY2VuZXMvRXhjaGFuZ2VTY2VuZS50cyIsICIuLi9mcm9udGVuZC1zY3JpcHRzL3NjZW5lcy9SYW5raW5nU2NlbmUudHMiLCAiLi4vZnJvbnRlbmQtc2NyaXB0cy9zdHlsZXMvaW5qZWN0LnRzIiwgIi4uL2Zyb250ZW5kLXNjcmlwdHMvQXBwLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJleHBvcnQgY2xhc3MgTmV0d29ya01hbmFnZXIge1xyXG4gIHByaXZhdGUgc3RhdGljIF9pbnN0YW5jZTogTmV0d29ya01hbmFnZXI7XHJcbiAgc3RhdGljIGdldCBJKCk6IE5ldHdvcmtNYW5hZ2VyIHsgcmV0dXJuIHRoaXMuX2luc3RhbmNlID8/ICh0aGlzLl9pbnN0YW5jZSA9IG5ldyBOZXR3b3JrTWFuYWdlcigpKTsgfVxyXG5cclxuICBwcml2YXRlIHRva2VuOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcclxuICBzZXRUb2tlbih0OiBzdHJpbmcgfCBudWxsKSB7IHRoaXMudG9rZW4gPSB0OyB9XHJcblxyXG4gIGFzeW5jIHJlcXVlc3Q8VD4ocGF0aDogc3RyaW5nLCBpbml0PzogUmVxdWVzdEluaXQpOiBQcm9taXNlPFQ+IHtcclxuICAgIGNvbnN0IGhlYWRlcnM6IGFueSA9IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJywgLi4uKGluaXQ/LmhlYWRlcnMgfHwge30pIH07XHJcbiAgICBpZiAodGhpcy50b2tlbikgaGVhZGVyc1snQXV0aG9yaXphdGlvbiddID0gYEJlYXJlciAke3RoaXMudG9rZW59YDtcclxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKHRoaXMuZ2V0QmFzZSgpICsgcGF0aCwgeyAuLi5pbml0LCBoZWFkZXJzIH0pO1xyXG4gICAgY29uc3QganNvbiA9IGF3YWl0IHJlcy5qc29uKCk7XHJcbiAgICBpZiAoIXJlcy5vayB8fCBqc29uLmNvZGUgPj0gNDAwKSB0aHJvdyBuZXcgRXJyb3IoanNvbi5tZXNzYWdlIHx8ICdSZXF1ZXN0IEVycm9yJyk7XHJcbiAgICByZXR1cm4ganNvbi5kYXRhIGFzIFQ7XHJcbiAgfVxyXG5cclxuICBnZXRCYXNlKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gKHdpbmRvdyBhcyBhbnkpLl9fQVBJX0JBU0VfXyB8fCAnaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaSc7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuIiwgImltcG9ydCB7IE5ldHdvcmtNYW5hZ2VyIH0gZnJvbSAnLi9OZXR3b3JrTWFuYWdlcic7XHJcblxyXG5leHBvcnQgdHlwZSBQcm9maWxlID0geyBpZDogc3RyaW5nOyB1c2VybmFtZTogc3RyaW5nOyBuaWNrbmFtZTogc3RyaW5nOyBvcmVBbW91bnQ6IG51bWJlcjsgYmJDb2luczogbnVtYmVyIH07XHJcblxyXG5leHBvcnQgY2xhc3MgR2FtZU1hbmFnZXIge1xyXG4gIHByaXZhdGUgc3RhdGljIF9pbnN0YW5jZTogR2FtZU1hbmFnZXI7XHJcbiAgc3RhdGljIGdldCBJKCk6IEdhbWVNYW5hZ2VyIHsgcmV0dXJuIHRoaXMuX2luc3RhbmNlID8/ICh0aGlzLl9pbnN0YW5jZSA9IG5ldyBHYW1lTWFuYWdlcigpKTsgfVxyXG5cclxuICBwcml2YXRlIHByb2ZpbGU6IFByb2ZpbGUgfCBudWxsID0gbnVsbDtcclxuICBnZXRQcm9maWxlKCk6IFByb2ZpbGUgfCBudWxsIHsgcmV0dXJuIHRoaXMucHJvZmlsZTsgfVxyXG5cclxuICBhc3luYyBsb2dpbk9yUmVnaXN0ZXIodXNlcm5hbWU6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgY29uc3Qgbm0gPSBOZXR3b3JrTWFuYWdlci5JO1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgciA9IGF3YWl0IG5tLnJlcXVlc3Q8eyBhY2Nlc3NfdG9rZW46IHN0cmluZzsgdXNlcjogYW55IH0+KCcvYXV0aC9sb2dpbicsIHsgbWV0aG9kOiAnUE9TVCcsIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgdXNlcm5hbWUsIHBhc3N3b3JkIH0pIH0pO1xyXG4gICAgICBubS5zZXRUb2tlbihyLmFjY2Vzc190b2tlbik7XHJcbiAgICB9IGNhdGNoIHtcclxuICAgICAgY29uc3QgciA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IGFjY2Vzc190b2tlbjogc3RyaW5nOyB1c2VyOiBhbnkgfT4oJy9hdXRoL3JlZ2lzdGVyJywgeyBtZXRob2Q6ICdQT1NUJywgYm9keTogSlNPTi5zdHJpbmdpZnkoeyB1c2VybmFtZSwgcGFzc3dvcmQgfSkgfSk7XHJcbiAgICAgIE5ldHdvcmtNYW5hZ2VyLkkuc2V0VG9rZW4oci5hY2Nlc3NfdG9rZW4pO1xyXG4gICAgfVxyXG4gICAgdGhpcy5wcm9maWxlID0gYXdhaXQgbm0ucmVxdWVzdDxQcm9maWxlPignL3VzZXIvcHJvZmlsZScpO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbiIsICJleHBvcnQgZnVuY3Rpb24gaHRtbCh0ZW1wbGF0ZTogc3RyaW5nKTogSFRNTEVsZW1lbnQge1xyXG4gIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gIGRpdi5pbm5lckhUTUwgPSB0ZW1wbGF0ZS50cmltKCk7XHJcbiAgcmV0dXJuIGRpdi5maXJzdEVsZW1lbnRDaGlsZCBhcyBIVE1MRWxlbWVudDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHFzPFQgZXh0ZW5kcyBFbGVtZW50ID0gSFRNTEVsZW1lbnQ+KHJvb3Q6IFBhcmVudE5vZGUsIHNlbDogc3RyaW5nKTogVCB7XHJcbiAgY29uc3QgZWwgPSByb290LnF1ZXJ5U2VsZWN0b3Ioc2VsKSBhcyBUIHwgbnVsbDtcclxuICBpZiAoIWVsKSB0aHJvdyBuZXcgRXJyb3IoYE1pc3NpbmcgZWxlbWVudDogJHtzZWx9YCk7XHJcbiAgcmV0dXJuIGVsIGFzIFQ7XHJcbn1cclxuXHJcblxyXG4iLCAibGV0IF9ib3g6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG5cbmZ1bmN0aW9uIGVuc3VyZUJveCgpOiBIVE1MRWxlbWVudCB7XG4gIGlmIChfYm94KSByZXR1cm4gX2JveDtcbiAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGRpdi5zdHlsZS5jc3NUZXh0ID0gJ3Bvc2l0aW9uOmZpeGVkO3JpZ2h0OjE2cHg7Ym90dG9tOjE2cHg7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6OHB4O3otaW5kZXg6OTk5OTsnO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRpdik7XG4gIF9ib3ggPSBkaXY7XG4gIHJldHVybiBkaXY7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzaG93VG9hc3QodGV4dDogc3RyaW5nKSB7XG4gIGNvbnN0IGJveCA9IGVuc3VyZUJveCgpO1xuICBjb25zdCBpdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGl0ZW0udGV4dENvbnRlbnQgPSB0ZXh0O1xuICBpdGVtLnN0eWxlLmNzc1RleHQgPSAnbWF4LXdpZHRoOjMyMHB4O3BhZGRpbmc6MTBweCAxMnB4O2JvcmRlci1yYWRpdXM6MTBweDtjb2xvcjojZmZmO2JhY2tncm91bmQ6cmdiYSgzMCwzMCw1MCwuOSk7Ym94LXNoYWRvdzowIDhweCAyMHB4IHJnYmEoMCwwLDAsLjM1KSwwIDAgMTJweCByZ2JhKDEyMyw0NCwyNDUsLjcpOyc7XG4gIGJveC5wcmVwZW5kKGl0ZW0pO1xuICBzZXRUaW1lb3V0KCgpID0+IHsgaXRlbS5zdHlsZS5vcGFjaXR5ID0gJzAnOyBpdGVtLnN0eWxlLnRyYW5zaXRpb24gPSAnb3BhY2l0eSAuNXMnOyBzZXRUaW1lb3V0KCgpID0+IGl0ZW0ucmVtb3ZlKCksIDUwMCk7IH0sIDM1MDApO1xufVxuXG4iLCAiaW1wb3J0IHsgR2FtZU1hbmFnZXIgfSBmcm9tICcuLi9jb3JlL0dhbWVNYW5hZ2VyJztcbmltcG9ydCB7IGh0bWwsIHFzIH0gZnJvbSAnLi4vdXRpbHMvZG9tJztcbmltcG9ydCB7IHNob3dUb2FzdCB9IGZyb20gJy4uL2NvbXBvbmVudHMvVG9hc3QnO1xuXG5leHBvcnQgY2xhc3MgTG9naW5TY2VuZSB7XG4gIG1vdW50KHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3QgdmlldyA9IGh0bWwoYFxuICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiIHN0eWxlPVwiY29sb3I6I2ZmZjtcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQgZmFkZS1pblwiIHN0eWxlPVwibWF4LXdpZHRoOjQyMHB4O21hcmdpbjo0MHB4IGF1dG87XCI+XG4gICAgICAgICAgPGgyIHN0eWxlPVwibWFyZ2luOjAgMCAxMnB4IDA7XCI+XHU3NjdCXHU1RjU1IC8gXHU2Q0U4XHU1MThDPC9oMj5cbiAgICAgICAgICA8aW5wdXQgaWQ9XCJ1XCIgY2xhc3M9XCJpbnB1dFwiIHBsYWNlaG9sZGVyPVwiXHU3NTI4XHU2MjM3XHU1NDBEXCIgYXV0b2NvbXBsZXRlPVwidXNlcm5hbWVcIi8+XG4gICAgICAgICAgPGlucHV0IGlkPVwicFwiIGNsYXNzPVwiaW5wdXRcIiBwbGFjZWhvbGRlcj1cIlx1NUJDNlx1NzgwMVwiIHR5cGU9XCJwYXNzd29yZFwiIGF1dG9jb21wbGV0ZT1cImN1cnJlbnQtcGFzc3dvcmRcIi8+XG4gICAgICAgICAgPGJ1dHRvbiBpZD1cImdvXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIiBzdHlsZT1cIndpZHRoOjEwMCU7bWFyZ2luLXRvcDo4cHg7XCI+XHU4RkRCXHU1MTY1XHU2RTM4XHU2MjBGPC9idXR0b24+XG4gICAgICAgICAgPGRpdiBzdHlsZT1cIm1hcmdpbi10b3A6OHB4O29wYWNpdHk6Ljc1O2ZvbnQtc2l6ZToxMnB4O1wiPlx1NjNEMFx1NzkzQVx1RkYxQVx1ODJFNVx1OEQyNlx1NjIzN1x1NEUwRFx1NUI1OFx1NTcyOFx1RkYwQ1x1NUMwNlx1ODFFQVx1NTJBOFx1NTIxQlx1NUVGQVx1NUU3Nlx1NzY3Qlx1NUY1NVx1MzAwMjwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIGApO1xuICAgIHJvb3QuaW5uZXJIVE1MID0gJyc7XG4gICAgcm9vdC5hcHBlbmRDaGlsZCh2aWV3KTtcblxuICAgIGNvbnN0IHVFbCA9IHFzPEhUTUxJbnB1dEVsZW1lbnQ+KHZpZXcsICcjdScpO1xuICAgIGNvbnN0IHBFbCA9IHFzPEhUTUxJbnB1dEVsZW1lbnQ+KHZpZXcsICcjcCcpO1xuICAgIGNvbnN0IGdvID0gcXM8SFRNTEJ1dHRvbkVsZW1lbnQ+KHZpZXcsICcjZ28nKTtcblxuICAgIGNvbnN0IHN1Ym1pdCA9IGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHVzZXJuYW1lID0gKHVFbC52YWx1ZSB8fCAnJykudHJpbSgpO1xuICAgICAgY29uc3QgcGFzc3dvcmQgPSAocEVsLnZhbHVlIHx8ICcnKS50cmltKCk7XG4gICAgICBpZiAoIXVzZXJuYW1lIHx8ICFwYXNzd29yZCkge1xuICAgICAgICBzaG93VG9hc3QoJ1x1OEJGN1x1NTg2Qlx1NTE5OVx1NzUyOFx1NjIzN1x1NTQwRFx1NTQ4Q1x1NUJDNlx1NzgwMScpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBnby5kaXNhYmxlZCA9IHRydWU7XG4gICAgICBnby50ZXh0Q29udGVudCA9ICdcdTc2N0JcdTVGNTVcdTRFMkRcdTIwMjYnO1xuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgR2FtZU1hbmFnZXIuSS5sb2dpbk9yUmVnaXN0ZXIodXNlcm5hbWUsIHBhc3N3b3JkKTtcbiAgICAgICAgbG9jYXRpb24uaGFzaCA9ICcjL21haW4nO1xuICAgICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgIHNob3dUb2FzdChlPy5tZXNzYWdlIHx8ICdcdTc2N0JcdTVGNTVcdTU5MzFcdThEMjVcdUZGMENcdThCRjdcdTkxQ0RcdThCRDUnKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGdvLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIGdvLnRleHRDb250ZW50ID0gJ1x1OEZEQlx1NTE2NVx1NkUzOFx1NjIwRic7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGdvLm9uY2xpY2sgPSBzdWJtaXQ7XG4gICAgdUVsLm9ua2V5dXAgPSAoZSkgPT4geyBpZiAoKGUgYXMgS2V5Ym9hcmRFdmVudCkua2V5ID09PSAnRW50ZXInKSBzdWJtaXQoKTsgfTtcbiAgICBwRWwub25rZXl1cCA9IChlKSA9PiB7IGlmICgoZSBhcyBLZXlib2FyZEV2ZW50KS5rZXkgPT09ICdFbnRlcicpIHN1Ym1pdCgpOyB9O1xuICB9XG59XG4iLCAiZXhwb3J0IGNvbnN0IEFQSV9CQVNFID0gKHdpbmRvdyBhcyBhbnkpLl9fQVBJX0JBU0VfXyB8fCAnaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaSc7XHJcbmV4cG9ydCBjb25zdCBXU19FTkRQT0lOVCA9ICh3aW5kb3cgYXMgYW55KS5fX1dTX0VORFBPSU5UX18gfHwgJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9nYW1lJztcclxuXHJcblxyXG4iLCAiaW1wb3J0IHsgV1NfRU5EUE9JTlQgfSBmcm9tICcuL0Vudic7XG5cbnR5cGUgSGFuZGxlciA9IChkYXRhOiBhbnkpID0+IHZvaWQ7XG5cbmV4cG9ydCBjbGFzcyBSZWFsdGltZUNsaWVudCB7XG4gIHByaXZhdGUgc3RhdGljIF9pbnN0YW5jZTogUmVhbHRpbWVDbGllbnQ7XG4gIHN0YXRpYyBnZXQgSSgpOiBSZWFsdGltZUNsaWVudCB7XG4gICAgcmV0dXJuIHRoaXMuX2luc3RhbmNlID8/ICh0aGlzLl9pbnN0YW5jZSA9IG5ldyBSZWFsdGltZUNsaWVudCgpKTtcbiAgfVxuXG4gIHByaXZhdGUgc29ja2V0OiBhbnkgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBoYW5kbGVyczogUmVjb3JkPHN0cmluZywgSGFuZGxlcltdPiA9IHt9O1xuXG4gIGNvbm5lY3QodG9rZW46IHN0cmluZykge1xuICAgIGNvbnN0IHcgPSB3aW5kb3cgYXMgYW55O1xuICAgIGlmICh3LmlvKSB7XG4gICAgICBpZiAodGhpcy5zb2NrZXQgJiYgKHRoaXMuc29ja2V0LmNvbm5lY3RlZCB8fCB0aGlzLnNvY2tldC5jb25uZWN0aW5nKSkgcmV0dXJuO1xuICAgICAgdGhpcy5zb2NrZXQgPSB3LmlvKFdTX0VORFBPSU5ULCB7IGF1dGg6IHsgdG9rZW4gfSB9KTtcbiAgICAgIHRoaXMuc29ja2V0Lm9uKCdjb25uZWN0JywgKCkgPT4ge30pO1xuICAgICAgdGhpcy5zb2NrZXQub25BbnkoKGV2ZW50OiBzdHJpbmcsIHBheWxvYWQ6IGFueSkgPT4gdGhpcy5lbWl0TG9jYWwoZXZlbnQsIHBheWxvYWQpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gc29ja2V0LmlvIGNsaWVudCBub3QgbG9hZGVkOyBkaXNhYmxlIHJlYWx0aW1lIHVwZGF0ZXNcbiAgICAgIHRoaXMuc29ja2V0ID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBvbihldmVudDogc3RyaW5nLCBoYW5kbGVyOiBIYW5kbGVyKSB7XG4gICAgKHRoaXMuaGFuZGxlcnNbZXZlbnRdIHx8PSBbXSkucHVzaChoYW5kbGVyKTtcbiAgfVxuXG4gIG9mZihldmVudDogc3RyaW5nLCBoYW5kbGVyOiBIYW5kbGVyKSB7XG4gICAgY29uc3QgYXJyID0gdGhpcy5oYW5kbGVyc1tldmVudF07XG4gICAgaWYgKCFhcnIpIHJldHVybjtcbiAgICBjb25zdCBpZHggPSBhcnIuaW5kZXhPZihoYW5kbGVyKTtcbiAgICBpZiAoaWR4ID49IDApIGFyci5zcGxpY2UoaWR4LCAxKTtcbiAgfVxuXG4gIHByaXZhdGUgZW1pdExvY2FsKGV2ZW50OiBzdHJpbmcsIHBheWxvYWQ6IGFueSkge1xuICAgICh0aGlzLmhhbmRsZXJzW2V2ZW50XSB8fCBbXSkuZm9yRWFjaCgoaCkgPT4gaChwYXlsb2FkKSk7XG4gIH1cbn1cbiIsICJleHBvcnQgZnVuY3Rpb24gcmVuZGVyTmF2KGFjdGl2ZTogc3RyaW5nKTogSFRNTEVsZW1lbnQge1xuICBjb25zdCB0YWJzOiB7IGtleTogc3RyaW5nOyB0ZXh0OiBzdHJpbmc7IGhyZWY6IHN0cmluZyB9W10gPSBbXG4gICAgeyBrZXk6ICdtYWluJywgdGV4dDogJ1x1NEUzQlx1OTg3NScsIGhyZWY6ICcjL21haW4nIH0sXG4gICAgeyBrZXk6ICd3YXJlaG91c2UnLCB0ZXh0OiAnXHU0RUQzXHU1RTkzJywgaHJlZjogJyMvd2FyZWhvdXNlJyB9LFxuICAgIHsga2V5OiAncGx1bmRlcicsIHRleHQ6ICdcdTYzQTBcdTU5M0EnLCBocmVmOiAnIy9wbHVuZGVyJyB9LFxuICAgIHsga2V5OiAnZXhjaGFuZ2UnLCB0ZXh0OiAnXHU0RUE0XHU2NjEzXHU2MjQwJywgaHJlZjogJyMvZXhjaGFuZ2UnIH0sXG4gICAgeyBrZXk6ICdyYW5raW5nJywgdGV4dDogJ1x1NjM5Mlx1ODg0QycsIGhyZWY6ICcjL3JhbmtpbmcnIH0sXG4gIF07XG4gIGNvbnN0IHdyYXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgd3JhcC5jbGFzc05hbWUgPSAnbmF2JztcbiAgZm9yIChjb25zdCB0IG9mIHRhYnMpIHtcbiAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGEuaHJlZiA9IHQuaHJlZjtcbiAgICBhLnRleHRDb250ZW50ID0gdC50ZXh0O1xuICAgIGlmICh0LmtleSA9PT0gYWN0aXZlKSBhLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgIHdyYXAuYXBwZW5kQ2hpbGQoYSk7XG4gIH1cbiAgcmV0dXJuIHdyYXA7XG59XG4iLCAiaW1wb3J0IHsgTmV0d29ya01hbmFnZXIgfSBmcm9tICcuLi9jb3JlL05ldHdvcmtNYW5hZ2VyJztcblxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlclJlc291cmNlQmFyKCkge1xuICBjb25zdCBib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgYm94LmNsYXNzTmFtZSA9ICdjb250YWluZXInO1xuICBjb25zdCBjYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNhcmQuY2xhc3NOYW1lID0gJ2NhcmQgZmFkZS1pbic7XG4gIGNhcmQuaW5uZXJIVE1MID0gYFxuICAgIDxkaXYgc3R5bGU9XCJkaXNwbGF5OmZsZXg7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW5cIj48c3Bhbj5cdUQ4M0RcdURDOEUgXHU3N0ZGXHU3N0YzPC9zcGFuPjxzdHJvbmcgaWQ9XCJvcmVcIj4wPC9zdHJvbmc+PC9kaXY+XG4gICAgPGRpdiBzdHlsZT1cImRpc3BsYXk6ZmxleDtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlblwiPjxzcGFuPlx1RDgzRVx1REU5OSBCQlx1NUUwMTwvc3Bhbj48c3Ryb25nIGlkPVwiY29pblwiPjA8L3N0cm9uZz48L2Rpdj5cbiAgYDtcbiAgYm94LmFwcGVuZENoaWxkKGNhcmQpO1xuICBjb25zdCBvcmVFbCA9IGNhcmQucXVlcnlTZWxlY3RvcignI29yZScpIGFzIEhUTUxFbGVtZW50O1xuICBjb25zdCBjb2luRWwgPSBjYXJkLnF1ZXJ5U2VsZWN0b3IoJyNjb2luJykgYXMgSFRNTEVsZW1lbnQ7XG4gIGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZSgpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcCA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IGlkOiBzdHJpbmc7IHVzZXJuYW1lOiBzdHJpbmc7IG5pY2tuYW1lOiBzdHJpbmc7IG9yZUFtb3VudDogbnVtYmVyOyBiYkNvaW5zOiBudW1iZXIgfT4oJy91c2VyL3Byb2ZpbGUnKTtcbiAgICAgIG9yZUVsLnRleHRDb250ZW50ID0gU3RyaW5nKHAub3JlQW1vdW50KTtcbiAgICAgIGNvaW5FbC50ZXh0Q29udGVudCA9IFN0cmluZyhwLmJiQ29pbnMpO1xuICAgIH0gY2F0Y2gge1xuICAgICAgLy8gaWdub3JlIGZldGNoIGVycm9yczsgVUkgXHU0RjFBXHU1NzI4XHU0RTBCXHU0RTAwXHU2QjIxXHU1MjM3XHU2NUIwXHU2NUY2XHU2MDYyXHU1OTBEXG4gICAgfVxuICB9XG4gIHJldHVybiB7IHJvb3Q6IGJveCwgdXBkYXRlIH07XG59XG4iLCAiZXhwb3J0IGZ1bmN0aW9uIHNwYXduRmxvYXRUZXh0KGFuY2hvcjogRWxlbWVudCwgdGV4dDogc3RyaW5nLCBjb2xvciA9ICcjZmZmJykge1xuICBjb25zdCByZWN0ID0gYW5jaG9yLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICBjb25zdCBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHNwYW4udGV4dENvbnRlbnQgPSB0ZXh0O1xuICBzcGFuLnN0eWxlLmNzc1RleHQgPSBgcG9zaXRpb246Zml4ZWQ7bGVmdDoke3JlY3QubGVmdCArIHJlY3Qud2lkdGggLSAyNH1weDt0b3A6JHtyZWN0LnRvcCAtIDZ9cHg7YCtcbiAgICAndHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApOyB0cmFuc2l0aW9uOiBhbGwgLjdzIGN1YmljLWJlemllciguMjIsLjYxLC4zNiwxKTsnK1xuICAgICdwb2ludGVyLWV2ZW50czpub25lOyB6LWluZGV4Ojk5OTk7IGZvbnQtd2VpZ2h0OjcwMDsgY29sb3I6Jytjb2xvcisnOyB0ZXh0LXNoYWRvdzowIDAgOHB4IHJnYmEoMjU1LDI1NSwyNTUsLjI1KSc7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc3Bhbik7XG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgc3Bhbi5zdHlsZS5vcGFjaXR5ID0gJzAnO1xuICAgIHNwYW4uc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVkoLTI0cHgpJztcbiAgfSk7XG4gIHNldFRpbWVvdXQoKCkgPT4gc3Bhbi5yZW1vdmUoKSwgODAwKTtcbn1cblxuIiwgImltcG9ydCB7IE5ldHdvcmtNYW5hZ2VyIH0gZnJvbSAnLi4vY29yZS9OZXR3b3JrTWFuYWdlcic7XG5pbXBvcnQgeyBSZWFsdGltZUNsaWVudCB9IGZyb20gJy4uL2NvcmUvUmVhbHRpbWVDbGllbnQnO1xuaW1wb3J0IHsgaHRtbCwgcXMgfSBmcm9tICcuLi91dGlscy9kb20nO1xuaW1wb3J0IHsgcmVuZGVyTmF2IH0gZnJvbSAnLi4vY29tcG9uZW50cy9OYXYnO1xuaW1wb3J0IHsgcmVuZGVyUmVzb3VyY2VCYXIgfSBmcm9tICcuLi9jb21wb25lbnRzL1Jlc291cmNlQmFyJztcbmltcG9ydCB7IHNob3dUb2FzdCB9IGZyb20gJy4uL2NvbXBvbmVudHMvVG9hc3QnO1xuaW1wb3J0IHsgc3Bhd25GbG9hdFRleHQgfSBmcm9tICcuLi9jb21wb25lbnRzL0Zsb2F0VGV4dCc7XG5cbnR5cGUgTWluZVN0YXR1cyA9IHtcbiAgY2FydEFtb3VudDogbnVtYmVyO1xuICBjYXJ0Q2FwYWNpdHk6IG51bWJlcjtcbiAgY29sbGFwc2VkOiBib29sZWFuO1xuICBjb2xsYXBzZWRSZW1haW5pbmc6IG51bWJlcjtcbiAgcnVubmluZzogYm9vbGVhbjtcbiAgaW50ZXJ2YWxNczogbnVtYmVyO1xufTtcblxudHlwZSBQZW5kaW5nQWN0aW9uID0gJ3N0YXJ0JyB8ICdzdG9wJyB8ICdjb2xsZWN0JyB8ICdyZXBhaXInIHwgJ3N0YXR1cycgfCBudWxsO1xuXG5leHBvcnQgY2xhc3MgTWFpblNjZW5lIHtcbiAgcHJpdmF0ZSB2aWV3OiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGNhcnRBbXQgPSAwO1xuICBwcml2YXRlIGNhcnRDYXAgPSAxMDAwO1xuICBwcml2YXRlIGlzTWluaW5nID0gZmFsc2U7XG4gIHByaXZhdGUgaXNDb2xsYXBzZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBjb2xsYXBzZVJlbWFpbmluZyA9IDA7XG4gIHByaXZhdGUgY29sbGFwc2VUaW1lcjogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgaW50ZXJ2YWxNcyA9IDMwMDA7XG4gIHByaXZhdGUgcGVuZGluZzogUGVuZGluZ0FjdGlvbiA9IG51bGw7XG5cbiAgcHJpdmF0ZSBlbHMgPSB7XG4gICAgZmlsbDogbnVsbCBhcyBIVE1MRWxlbWVudCB8IG51bGwsXG4gICAgcGVyY2VudDogbnVsbCBhcyBIVE1MRWxlbWVudCB8IG51bGwsXG4gICAgc3RhdHVzVGV4dDogbnVsbCBhcyBIVE1MRWxlbWVudCB8IG51bGwsXG4gICAgc3RhcnQ6IG51bGwgYXMgSFRNTEJ1dHRvbkVsZW1lbnQgfCBudWxsLFxuICAgIHN0b3A6IG51bGwgYXMgSFRNTEJ1dHRvbkVsZW1lbnQgfCBudWxsLFxuICAgIGNvbGxlY3Q6IG51bGwgYXMgSFRNTEJ1dHRvbkVsZW1lbnQgfCBudWxsLFxuICAgIHJlcGFpcjogbnVsbCBhcyBIVE1MQnV0dG9uRWxlbWVudCB8IG51bGwsXG4gICAgc3RhdHVzQnRuOiBudWxsIGFzIEhUTUxCdXR0b25FbGVtZW50IHwgbnVsbCxcbiAgfTtcblxuICBwcml2YXRlIG1pbmVVcGRhdGVIYW5kbGVyPzogKG1zZzogYW55KSA9PiB2b2lkO1xuICBwcml2YXRlIG1pbmVDb2xsYXBzZUhhbmRsZXI/OiAobXNnOiBhbnkpID0+IHZvaWQ7XG4gIHByaXZhdGUgcGx1bmRlckhhbmRsZXI/OiAobXNnOiBhbnkpID0+IHZvaWQ7XG5cbiAgYXN5bmMgbW91bnQocm9vdDogSFRNTEVsZW1lbnQpIHtcbiAgICB0aGlzLmNsZWFyQ29sbGFwc2VUaW1lcigpO1xuICAgIHRoaXMucGVuZGluZyA9IG51bGw7XG5cbiAgICBjb25zdCBuYXYgPSByZW5kZXJOYXYoJ21haW4nKTtcbiAgICBjb25zdCBiYXIgPSByZW5kZXJSZXNvdXJjZUJhcigpO1xuICAgIGNvbnN0IHZpZXcgPSBodG1sKGBcbiAgICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXJcIiBzdHlsZT1cImNvbG9yOiNmZmY7XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJtaW5lIGNhcmQgZmFkZS1pblwiPlxuICAgICAgICAgIDxkaXYgc3R5bGU9XCJvcGFjaXR5Oi45O21hcmdpbi1ib3R0b206OHB4O1wiPlx1MjZDRlx1RkUwRiBcdTYzMTZcdTc3RkZcdTk3NjJcdTY3N0Y8L2Rpdj5cbiAgICAgICAgICA8ZGl2IHN0eWxlPVwiaGVpZ2h0OjEwcHg7Ym9yZGVyLXJhZGl1czo5OTlweDtiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjEyKTtvdmVyZmxvdzpoaWRkZW47XCI+XG4gICAgICAgICAgICA8ZGl2IGlkPVwiZmlsbFwiIHN0eWxlPVwiaGVpZ2h0OjEwMCU7d2lkdGg6MCU7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoOTBkZWcsIzdCMkNGNSwjMkM4OUY1KTtib3gtc2hhZG93OjAgMCAxMHB4ICM3QjJDRjU7dHJhbnNpdGlvbjp3aWR0aCAuM3MgZWFzZVwiPjwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgc3R5bGU9XCJkaXNwbGF5OmZsZXg7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YWxpZ24taXRlbXM6Y2VudGVyO21hcmdpbjo4cHggMCAxMnB4O1wiPlxuICAgICAgICAgICAgPHNwYW4+XHU3N0ZGXHU4RjY2XHU4OEM1XHU4RjdEPC9zcGFuPlxuICAgICAgICAgICAgPHN0cm9uZyBpZD1cInBlcmNlbnRcIj4wJTwvc3Ryb25nPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIiBzdHlsZT1cImdhcDo4cHg7XCI+XG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwic3RhcnRcIiBjbGFzcz1cImJ0biBidG4tYnV5XCIgc3R5bGU9XCJmbGV4OjE7XCI+XHU1RjAwXHU1OUNCXHU2MzE2XHU3N0ZGPC9idXR0b24+XG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwic3RvcFwiIGNsYXNzPVwiYnRuIGJ0bi1naG9zdFwiIHN0eWxlPVwiZmxleDoxO1wiPlx1NTA1Q1x1NkI2MjwvYnV0dG9uPlxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImNvbGxlY3RcIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiIHN0eWxlPVwiZmxleDoxO1wiPlx1NjUzNlx1NzdGRjwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIiBzdHlsZT1cImdhcDo4cHg7bWFyZ2luLXRvcDo4cHg7XCI+XG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwic3RhdHVzXCIgY2xhc3M9XCJidG4gYnRuLWdob3N0XCIgc3R5bGU9XCJmbGV4OjE7XCI+XHU1MjM3XHU2NUIwXHU3MkI2XHU2MDAxPC9idXR0b24+XG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwicmVwYWlyXCIgY2xhc3M9XCJidG4gYnRuLXNlbGxcIiBzdHlsZT1cImZsZXg6MTtcIj5cdTRGRUVcdTc0MDY8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGlkPVwic3RhdHVzVGV4dFwiIHN0eWxlPVwibWFyZ2luLXRvcDo2cHg7b3BhY2l0eTouOTttaW4taGVpZ2h0OjIwcHg7XCI+PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgYCk7XG5cbiAgICByb290LmlubmVySFRNTCA9ICcnO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQobmF2KTtcbiAgICByb290LmFwcGVuZENoaWxkKGJhci5yb290KTtcbiAgICByb290LmFwcGVuZENoaWxkKHZpZXcpO1xuXG4gICAgdGhpcy52aWV3ID0gdmlldztcbiAgICB0aGlzLmNhY2hlRWxlbWVudHMoKTtcbiAgICB0aGlzLmF0dGFjaEhhbmRsZXJzKGJhci51cGRhdGUuYmluZChiYXIpKTtcbiAgICBhd2FpdCBiYXIudXBkYXRlKCk7XG4gICAgdGhpcy5zZXR1cFJlYWx0aW1lKCk7XG4gICAgYXdhaXQgdGhpcy5yZWZyZXNoU3RhdHVzKCk7XG4gICAgdGhpcy51cGRhdGVQcm9ncmVzcygpO1xuICAgIHRoaXMudXBkYXRlQ29udHJvbHMoKTtcbiAgfVxuXG4gIHByaXZhdGUgY2FjaGVFbGVtZW50cygpIHtcbiAgICBpZiAoIXRoaXMudmlldykgcmV0dXJuO1xuICAgIHRoaXMuZWxzLmZpbGwgPSBxcyh0aGlzLnZpZXcsICcjZmlsbCcpO1xuICAgIHRoaXMuZWxzLnBlcmNlbnQgPSBxcyh0aGlzLnZpZXcsICcjcGVyY2VudCcpO1xuICAgIHRoaXMuZWxzLnN0YXR1c1RleHQgPSBxcyh0aGlzLnZpZXcsICcjc3RhdHVzVGV4dCcpO1xuICAgIHRoaXMuZWxzLnN0YXJ0ID0gcXM8SFRNTEJ1dHRvbkVsZW1lbnQ+KHRoaXMudmlldywgJyNzdGFydCcpO1xuICAgIHRoaXMuZWxzLnN0b3AgPSBxczxIVE1MQnV0dG9uRWxlbWVudD4odGhpcy52aWV3LCAnI3N0b3AnKTtcbiAgICB0aGlzLmVscy5jb2xsZWN0ID0gcXM8SFRNTEJ1dHRvbkVsZW1lbnQ+KHRoaXMudmlldywgJyNjb2xsZWN0Jyk7XG4gICAgdGhpcy5lbHMucmVwYWlyID0gcXM8SFRNTEJ1dHRvbkVsZW1lbnQ+KHRoaXMudmlldywgJyNyZXBhaXInKTtcbiAgICB0aGlzLmVscy5zdGF0dXNCdG4gPSBxczxIVE1MQnV0dG9uRWxlbWVudD4odGhpcy52aWV3LCAnI3N0YXR1cycpO1xuICB9XG5cbiAgcHJpdmF0ZSBhdHRhY2hIYW5kbGVycyh1cGRhdGVCYXI6ICgpID0+IFByb21pc2U8dm9pZD4pIHtcbiAgICBpZiAoIXRoaXMudmlldykgcmV0dXJuO1xuICAgIHRoaXMuZWxzLnN0YXJ0Py5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRoaXMuaGFuZGxlU3RhcnQoKSk7XG4gICAgdGhpcy5lbHMuc3RvcD8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0aGlzLmhhbmRsZVN0b3AoKSk7XG4gICAgdGhpcy5lbHMuc3RhdHVzQnRuPy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRoaXMucmVmcmVzaFN0YXR1cygpKTtcbiAgICB0aGlzLmVscy5yZXBhaXI/LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdGhpcy5oYW5kbGVSZXBhaXIoKSk7XG4gICAgdGhpcy5lbHMuY29sbGVjdD8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0aGlzLmhhbmRsZUNvbGxlY3QodXBkYXRlQmFyKSk7XG4gIH1cblxuICBwcml2YXRlIHNldHVwUmVhbHRpbWUoKSB7XG4gICAgY29uc3QgdG9rZW4gPSAoTmV0d29ya01hbmFnZXIgYXMgYW55KS5JWyd0b2tlbiddO1xuICAgIGlmICh0b2tlbikgUmVhbHRpbWVDbGllbnQuSS5jb25uZWN0KHRva2VuKTtcblxuICAgIGlmICh0aGlzLm1pbmVVcGRhdGVIYW5kbGVyKSBSZWFsdGltZUNsaWVudC5JLm9mZignbWluZS51cGRhdGUnLCB0aGlzLm1pbmVVcGRhdGVIYW5kbGVyKTtcbiAgICBpZiAodGhpcy5taW5lQ29sbGFwc2VIYW5kbGVyKSBSZWFsdGltZUNsaWVudC5JLm9mZignbWluZS5jb2xsYXBzZScsIHRoaXMubWluZUNvbGxhcHNlSGFuZGxlcik7XG4gICAgaWYgKHRoaXMucGx1bmRlckhhbmRsZXIpIFJlYWx0aW1lQ2xpZW50Lkkub2ZmKCdwbHVuZGVyLmF0dGFja2VkJywgdGhpcy5wbHVuZGVySGFuZGxlcik7XG5cbiAgICB0aGlzLm1pbmVVcGRhdGVIYW5kbGVyID0gKG1zZykgPT4ge1xuICAgICAgdGhpcy5jYXJ0QW10ID0gdHlwZW9mIG1zZy5jYXJ0QW1vdW50ID09PSAnbnVtYmVyJyA/IG1zZy5jYXJ0QW1vdW50IDogdGhpcy5jYXJ0QW10O1xuICAgICAgdGhpcy5jYXJ0Q2FwID0gdHlwZW9mIG1zZy5jYXJ0Q2FwYWNpdHkgPT09ICdudW1iZXInID8gbXNnLmNhcnRDYXBhY2l0eSA6IHRoaXMuY2FydENhcDtcbiAgICAgIHRoaXMuaXNNaW5pbmcgPSBtc2cucnVubmluZyA/PyB0aGlzLmlzTWluaW5nO1xuICAgICAgaWYgKG1zZy5jb2xsYXBzZWQgJiYgbXNnLmNvbGxhcHNlZFJlbWFpbmluZykge1xuICAgICAgICB0aGlzLmJlZ2luQ29sbGFwc2VDb3VudGRvd24obXNnLmNvbGxhcHNlZFJlbWFpbmluZyk7XG4gICAgICB9IGVsc2UgaWYgKCFtc2cuY29sbGFwc2VkKSB7XG4gICAgICAgIHRoaXMuaXNDb2xsYXBzZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jbGVhckNvbGxhcHNlVGltZXIoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMudXBkYXRlUHJvZ3Jlc3MoKTtcbiAgICAgIGlmIChtc2cudHlwZSA9PT0gJ2NyaXRpY2FsJyAmJiBtc2cuYW1vdW50KSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZShgXHU4OUU2XHU1M0QxXHU2NkI0XHU1MUZCXHVGRjBDXHU3N0ZGXHU4RjY2XHU1ODlFXHU1MkEwICR7bXNnLmFtb3VudH1cdUZGMDFgKTtcbiAgICAgIH0gZWxzZSBpZiAobXNnLnR5cGUgPT09ICdub3JtYWwnICYmIG1zZy5hbW91bnQpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0dXNNZXNzYWdlKGBcdTc3RkZcdThGNjZcdTU4OUVcdTUyQTAgJHttc2cuYW1vdW50fVx1RkYwQ1x1NUY1M1x1NTI0RCAke3RoaXMuZm9ybWF0UGVyY2VudCgpfWApO1xuICAgICAgfSBlbHNlIGlmIChtc2cudHlwZSA9PT0gJ2NvbGxhcHNlJykge1xuICAgICAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoJ1x1NzdGRlx1OTA1M1x1NTc0RFx1NTg0Q1x1RkYwQ1x1OEJGN1x1N0FDQlx1NTM3M1x1NEZFRVx1NzQwNicpO1xuICAgICAgfSBlbHNlIGlmIChtc2cudHlwZSA9PT0gJ2NvbGxlY3QnKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZSgnXHU3N0ZGXHU3N0YzXHU1REYyXHU2NTM2XHU5NkM2XHVGRjBDXHU3N0ZGXHU4RjY2XHU2RTA1XHU3QTdBJyk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaXNDb2xsYXBzZWQpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0dXNNZXNzYWdlKGBcdTc3RkZcdTkwNTNcdTU3NERcdTU4NENcdUZGMENcdTUyNjlcdTRGNTkgJHt0aGlzLmNvbGxhcHNlUmVtYWluaW5nfXNgKTtcbiAgICAgIH1cbiAgICAgIHRoaXMudXBkYXRlQ29udHJvbHMoKTtcbiAgICB9O1xuXG4gICAgdGhpcy5taW5lQ29sbGFwc2VIYW5kbGVyID0gKG1zZykgPT4ge1xuICAgICAgY29uc3Qgc2Vjb25kcyA9IE51bWJlcihtc2c/LnJlcGFpcl9kdXJhdGlvbikgfHwgMDtcbiAgICAgIGlmIChzZWNvbmRzID4gMCkgdGhpcy5iZWdpbkNvbGxhcHNlQ291bnRkb3duKHNlY29uZHMpO1xuICAgICAgc2hvd1RvYXN0KGBcdTc3RkZcdTkwNTNcdTU3NERcdTU4NENcdUZGMENcdTk3MDBcdTRGRUVcdTc0MDZcdUZGMDhcdTdFQTYgJHtzZWNvbmRzfXNcdUZGMDlgKTtcbiAgICB9O1xuXG4gICAgdGhpcy5wbHVuZGVySGFuZGxlciA9IChtc2cpID0+IHtcbiAgICAgIHNob3dUb2FzdChgXHU4OEFCXHU2M0EwXHU1OTNBXHVGRjFBXHU2NzY1XHU4MUVBICR7bXNnLmF0dGFja2VyfVx1RkYwQ1x1NjM1Rlx1NTkzMSAke21zZy5sb3NzfWApO1xuICAgIH07XG5cbiAgICBSZWFsdGltZUNsaWVudC5JLm9uKCdtaW5lLnVwZGF0ZScsIHRoaXMubWluZVVwZGF0ZUhhbmRsZXIpO1xuICAgIFJlYWx0aW1lQ2xpZW50Lkkub24oJ21pbmUuY29sbGFwc2UnLCB0aGlzLm1pbmVDb2xsYXBzZUhhbmRsZXIpO1xuICAgIFJlYWx0aW1lQ2xpZW50Lkkub24oJ3BsdW5kZXIuYXR0YWNrZWQnLCB0aGlzLnBsdW5kZXJIYW5kbGVyKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgaGFuZGxlU3RhcnQoKSB7XG4gICAgaWYgKHRoaXMucGVuZGluZyB8fCB0aGlzLmlzQ29sbGFwc2VkKSB7XG4gICAgICBpZiAodGhpcy5pc0NvbGxhcHNlZCkgc2hvd1RvYXN0KCdcdTc3RkZcdTkwNTNcdTU3NERcdTU4NENcdUZGMENcdThCRjdcdTUxNDhcdTRGRUVcdTc0MDYnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5wZW5kaW5nID0gJ3N0YXJ0JztcbiAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzKCk7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHN0YXR1cyA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDxNaW5lU3RhdHVzPignL21pbmUvc3RhcnQnLCB7IG1ldGhvZDogJ1BPU1QnIH0pO1xuICAgICAgdGhpcy5hcHBseVN0YXR1cyhzdGF0dXMpO1xuICAgICAgdGhpcy5zZXRTdGF0dXNNZXNzYWdlKCdcdTc3RkZcdTY3M0FcdTVERjJcdTU0MkZcdTUyQTgnKTtcbiAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgIHNob3dUb2FzdChlPy5tZXNzYWdlIHx8ICdcdTU0MkZcdTUyQThcdTU5MzFcdThEMjUnKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5wZW5kaW5nID0gbnVsbDtcbiAgICAgIHRoaXMudXBkYXRlQ29udHJvbHMoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGhhbmRsZVN0b3AoKSB7XG4gICAgaWYgKHRoaXMucGVuZGluZykgcmV0dXJuO1xuICAgIHRoaXMucGVuZGluZyA9ICdzdG9wJztcbiAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzKCk7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHN0YXR1cyA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDxNaW5lU3RhdHVzPignL21pbmUvc3RvcCcsIHsgbWV0aG9kOiAnUE9TVCcgfSk7XG4gICAgICB0aGlzLmFwcGx5U3RhdHVzKHN0YXR1cyk7XG4gICAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoJ1x1NzdGRlx1NjczQVx1NURGMlx1NTA1Q1x1NkI2MicpO1xuICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgc2hvd1RvYXN0KGU/Lm1lc3NhZ2UgfHwgJ1x1NTA1Q1x1NkI2Mlx1NTkzMVx1OEQyNScpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLnBlbmRpbmcgPSBudWxsO1xuICAgICAgdGhpcy51cGRhdGVDb250cm9scygpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgaGFuZGxlQ29sbGVjdCh1cGRhdGVCYXI6ICgpID0+IFByb21pc2U8dm9pZD4pIHtcbiAgICBpZiAodGhpcy5wZW5kaW5nIHx8IHRoaXMuY2FydEFtdCA8PSAwKSByZXR1cm47XG4gICAgdGhpcy5wZW5kaW5nID0gJ2NvbGxlY3QnO1xuICAgIHRoaXMudXBkYXRlQ29udHJvbHMoKTtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgY29sbGVjdGVkOiBudW1iZXI7IHN0YXR1czogTWluZVN0YXR1cyB9PignL21pbmUvY29sbGVjdCcsIHsgbWV0aG9kOiAnUE9TVCcgfSk7XG4gICAgICBpZiAocmVzLnN0YXR1cykgdGhpcy5hcHBseVN0YXR1cyhyZXMuc3RhdHVzKTtcbiAgICAgIGlmIChyZXMuY29sbGVjdGVkID4gMCkge1xuICAgICAgICBjb25zdCBvcmVMYWJlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNvcmUnKTtcbiAgICAgICAgaWYgKG9yZUxhYmVsKSBzcGF3bkZsb2F0VGV4dChvcmVMYWJlbCBhcyBFbGVtZW50LCBgKyR7cmVzLmNvbGxlY3RlZH1gLCAnIzdCMkNGNScpO1xuICAgICAgICBzaG93VG9hc3QoYFx1NjUzNlx1OTZDNlx1NzdGRlx1NzdGMyAke3Jlcy5jb2xsZWN0ZWR9YCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzaG93VG9hc3QoJ1x1NzdGRlx1OEY2Nlx1NEUzQVx1N0E3QVx1RkYwQ1x1NjVFMFx1NzdGRlx1NzdGM1x1NTNFRlx1NjUzNlx1OTZDNicpO1xuICAgICAgfVxuICAgICAgYXdhaXQgdXBkYXRlQmFyKCk7XG4gICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICBzaG93VG9hc3QoZT8ubWVzc2FnZSB8fCAnXHU2NTM2XHU3N0ZGXHU1OTMxXHU4RDI1Jyk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMucGVuZGluZyA9IG51bGw7XG4gICAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBoYW5kbGVSZXBhaXIoKSB7XG4gICAgaWYgKHRoaXMucGVuZGluZyB8fCAhdGhpcy5pc0NvbGxhcHNlZCkgcmV0dXJuO1xuICAgIHRoaXMucGVuZGluZyA9ICdyZXBhaXInO1xuICAgIHRoaXMudXBkYXRlQ29udHJvbHMoKTtcbiAgICB0cnkge1xuICAgICAgY29uc3Qgc3RhdHVzID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PE1pbmVTdGF0dXM+KCcvbWluZS9yZXBhaXInLCB7IG1ldGhvZDogJ1BPU1QnIH0pO1xuICAgICAgdGhpcy5hcHBseVN0YXR1cyhzdGF0dXMpO1xuICAgICAgdGhpcy5zZXRTdGF0dXNNZXNzYWdlKCdcdTc3RkZcdTkwNTNcdTVERjJcdTRGRUVcdTU5MERcdUZGMENcdTUzRUZcdTkxQ0RcdTY1QjBcdTU0MkZcdTUyQTgnKTtcbiAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgIHNob3dUb2FzdChlPy5tZXNzYWdlIHx8ICdcdTRGRUVcdTc0MDZcdTU5MzFcdThEMjUnKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5wZW5kaW5nID0gbnVsbDtcbiAgICAgIHRoaXMudXBkYXRlQ29udHJvbHMoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHJlZnJlc2hTdGF0dXMoKSB7XG4gICAgaWYgKHRoaXMucGVuZGluZyA9PT0gJ3N0YXR1cycpIHJldHVybjtcbiAgICB0aGlzLnBlbmRpbmcgPSAnc3RhdHVzJztcbiAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzKCk7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHN0YXR1cyA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDxNaW5lU3RhdHVzPignL21pbmUvc3RhdHVzJyk7XG4gICAgICB0aGlzLmFwcGx5U3RhdHVzKHN0YXR1cyk7XG4gICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICBzaG93VG9hc3QoZT8ubWVzc2FnZSB8fCAnXHU4M0I3XHU1M0Q2XHU3MkI2XHU2MDAxXHU1OTMxXHU4RDI1Jyk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMucGVuZGluZyA9IG51bGw7XG4gICAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhcHBseVN0YXR1cyhzdGF0dXM6IE1pbmVTdGF0dXMgfCB1bmRlZmluZWQsIG9wdHM6IHsgcXVpZXQ/OiBib29sZWFuIH0gPSB7fSkge1xuICAgIGlmICghc3RhdHVzKSByZXR1cm47XG4gICAgdGhpcy5jYXJ0QW10ID0gc3RhdHVzLmNhcnRBbW91bnQgPz8gdGhpcy5jYXJ0QW10O1xuICAgIHRoaXMuY2FydENhcCA9IHN0YXR1cy5jYXJ0Q2FwYWNpdHkgPz8gdGhpcy5jYXJ0Q2FwO1xuICAgIHRoaXMuaW50ZXJ2YWxNcyA9IHN0YXR1cy5pbnRlcnZhbE1zID8/IHRoaXMuaW50ZXJ2YWxNcztcbiAgICB0aGlzLmlzTWluaW5nID0gQm9vbGVhbihzdGF0dXMucnVubmluZyk7XG4gICAgdGhpcy5pc0NvbGxhcHNlZCA9IEJvb2xlYW4oc3RhdHVzLmNvbGxhcHNlZCk7XG4gICAgaWYgKHN0YXR1cy5jb2xsYXBzZWQgJiYgc3RhdHVzLmNvbGxhcHNlZFJlbWFpbmluZyA+IDApIHtcbiAgICAgIHRoaXMuYmVnaW5Db2xsYXBzZUNvdW50ZG93bihzdGF0dXMuY29sbGFwc2VkUmVtYWluaW5nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jbGVhckNvbGxhcHNlVGltZXIoKTtcbiAgICAgIHRoaXMuY29sbGFwc2VSZW1haW5pbmcgPSAwO1xuICAgIH1cbiAgICB0aGlzLnVwZGF0ZVByb2dyZXNzKCk7XG4gICAgaWYgKCFvcHRzLnF1aWV0KSB7XG4gICAgICBpZiAodGhpcy5pc0NvbGxhcHNlZCAmJiB0aGlzLmNvbGxhcHNlUmVtYWluaW5nID4gMCkge1xuICAgICAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoYFx1NzdGRlx1OTA1M1x1NTc0RFx1NTg0Q1x1RkYwQ1x1NTI2OVx1NEY1OSAke3RoaXMuY29sbGFwc2VSZW1haW5pbmd9c2ApO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmlzTWluaW5nKSB7XG4gICAgICAgIGNvbnN0IHNlY29uZHMgPSBNYXRoLm1heCgxLCBNYXRoLnJvdW5kKHRoaXMuaW50ZXJ2YWxNcyAvIDEwMDApKTtcbiAgICAgICAgdGhpcy5zZXRTdGF0dXNNZXNzYWdlKGBcdTc3RkZcdTY3M0FcdThGRDBcdTg4NENcdTRFMkRcdUZGMENcdTU0NjhcdTY3MUZcdTdFQTYgJHtzZWNvbmRzfXNcdUZGMENcdTVGNTNcdTUyNEQgJHt0aGlzLmZvcm1hdFBlcmNlbnQoKX1gKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdHVzTWVzc2FnZSgnXHU3N0ZGXHU2NzNBXHU1REYyXHU1MDVDXHU2QjYyXHVGRjBDXHU3MEI5XHU1MUZCXHU1RjAwXHU1OUNCXHU2MzE2XHU3N0ZGJyk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMudXBkYXRlQ29udHJvbHMoKTtcbiAgfVxuXG4gIHByaXZhdGUgYmVnaW5Db2xsYXBzZUNvdW50ZG93bihzZWNvbmRzOiBudW1iZXIpIHtcbiAgICB0aGlzLmNsZWFyQ29sbGFwc2VUaW1lcigpO1xuICAgIHRoaXMuaXNDb2xsYXBzZWQgPSB0cnVlO1xuICAgIHRoaXMuY29sbGFwc2VSZW1haW5pbmcgPSBNYXRoLm1heCgwLCBNYXRoLmZsb29yKHNlY29uZHMpKTtcbiAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoYFx1NzdGRlx1OTA1M1x1NTc0RFx1NTg0Q1x1RkYwQ1x1NTI2OVx1NEY1OSAke3RoaXMuY29sbGFwc2VSZW1haW5pbmd9c2ApO1xuICAgIHRoaXMudXBkYXRlQ29udHJvbHMoKTtcbiAgICB0aGlzLmNvbGxhcHNlVGltZXIgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgdGhpcy5jb2xsYXBzZVJlbWFpbmluZyA9IE1hdGgubWF4KDAsIHRoaXMuY29sbGFwc2VSZW1haW5pbmcgLSAxKTtcbiAgICAgIGlmICh0aGlzLmNvbGxhcHNlUmVtYWluaW5nIDw9IDApIHtcbiAgICAgICAgdGhpcy5jbGVhckNvbGxhcHNlVGltZXIoKTtcbiAgICAgICAgdGhpcy5pc0NvbGxhcHNlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoJ1x1NTc0RFx1NTg0Q1x1ODlFM1x1OTY2NFx1RkYwQ1x1NTNFRlx1OTFDRFx1NjVCMFx1NTQyRlx1NTJBOFx1NzdGRlx1NjczQScpO1xuICAgICAgICB0aGlzLnVwZGF0ZUNvbnRyb2xzKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNldFN0YXR1c01lc3NhZ2UoYFx1NzdGRlx1OTA1M1x1NTc0RFx1NTg0Q1x1RkYwQ1x1NTI2OVx1NEY1OSAke3RoaXMuY29sbGFwc2VSZW1haW5pbmd9c2ApO1xuICAgICAgfVxuICAgIH0sIDEwMDApO1xuICB9XG5cbiAgcHJpdmF0ZSBjbGVhckNvbGxhcHNlVGltZXIoKSB7XG4gICAgaWYgKHRoaXMuY29sbGFwc2VUaW1lciAhPT0gbnVsbCkge1xuICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5jb2xsYXBzZVRpbWVyKTtcbiAgICAgIHRoaXMuY29sbGFwc2VUaW1lciA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVQcm9ncmVzcygpIHtcbiAgICBpZiAoIXRoaXMuZWxzLmZpbGwgfHwgIXRoaXMuZWxzLnBlcmNlbnQpIHJldHVybjtcbiAgICBjb25zdCBwY3QgPSB0aGlzLmNhcnRDYXAgPiAwID8gTWF0aC5taW4oMSwgdGhpcy5jYXJ0QW10IC8gdGhpcy5jYXJ0Q2FwKSA6IDA7XG4gICAgdGhpcy5lbHMuZmlsbC5zdHlsZS53aWR0aCA9IGAke01hdGgucm91bmQocGN0ICogMTAwKX0lYDtcbiAgICB0aGlzLmVscy5wZXJjZW50LnRleHRDb250ZW50ID0gYCR7TWF0aC5yb3VuZChwY3QgKiAxMDApfSVgO1xuICAgIGlmICh0aGlzLnBlbmRpbmcgIT09ICdjb2xsZWN0JyAmJiB0aGlzLmVscy5jb2xsZWN0KSB7XG4gICAgICB0aGlzLmVscy5jb2xsZWN0LmRpc2FibGVkID0gdGhpcy5wZW5kaW5nID09PSAnY29sbGVjdCcgfHwgdGhpcy5jYXJ0QW10IDw9IDA7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVDb250cm9scygpIHtcbiAgICBjb25zdCBpc0J1c3kgPSAoa2V5OiBQZW5kaW5nQWN0aW9uKSA9PiB0aGlzLnBlbmRpbmcgPT09IGtleTtcbiAgICBpZiAodGhpcy5lbHMuc3RhcnQpIHtcbiAgICAgIGNvbnN0IGJ1c3kgPSBpc0J1c3koJ3N0YXJ0Jyk7XG4gICAgICB0aGlzLmVscy5zdGFydC5kaXNhYmxlZCA9IGJ1c3kgfHwgdGhpcy5pc01pbmluZyB8fCB0aGlzLmlzQ29sbGFwc2VkO1xuICAgICAgdGhpcy5lbHMuc3RhcnQudGV4dENvbnRlbnQgPSBidXN5ID8gJ1x1NTQyRlx1NTJBOFx1NEUyRFx1MjAyNicgOiB0aGlzLmlzTWluaW5nID8gJ1x1NjMxNlx1NzdGRlx1NEUyRCcgOiAnXHU1RjAwXHU1OUNCXHU2MzE2XHU3N0ZGJztcbiAgICB9XG4gICAgaWYgKHRoaXMuZWxzLnN0b3ApIHtcbiAgICAgIGNvbnN0IGJ1c3kgPSBpc0J1c3koJ3N0b3AnKTtcbiAgICAgIHRoaXMuZWxzLnN0b3AuZGlzYWJsZWQgPSBidXN5IHx8ICF0aGlzLmlzTWluaW5nO1xuICAgICAgdGhpcy5lbHMuc3RvcC50ZXh0Q29udGVudCA9IGJ1c3kgPyAnXHU1MDVDXHU2QjYyXHU0RTJEXHUyMDI2JyA6ICdcdTUwNUNcdTZCNjInO1xuICAgIH1cbiAgICBpZiAodGhpcy5lbHMuY29sbGVjdCkge1xuICAgICAgY29uc3QgYnVzeSA9IGlzQnVzeSgnY29sbGVjdCcpO1xuICAgICAgdGhpcy5lbHMuY29sbGVjdC5kaXNhYmxlZCA9IGJ1c3kgfHwgdGhpcy5jYXJ0QW10IDw9IDA7XG4gICAgICB0aGlzLmVscy5jb2xsZWN0LnRleHRDb250ZW50ID0gYnVzeSA/ICdcdTY1MzZcdTk2QzZcdTRFMkRcdTIwMjYnIDogJ1x1NjUzNlx1NzdGRic7XG4gICAgfVxuICAgIGlmICh0aGlzLmVscy5yZXBhaXIpIHtcbiAgICAgIGNvbnN0IGJ1c3kgPSBpc0J1c3koJ3JlcGFpcicpO1xuICAgICAgdGhpcy5lbHMucmVwYWlyLmRpc2FibGVkID0gYnVzeSB8fCAhdGhpcy5pc0NvbGxhcHNlZDtcbiAgICAgIHRoaXMuZWxzLnJlcGFpci50ZXh0Q29udGVudCA9IGJ1c3kgPyAnXHU0RkVFXHU3NDA2XHU0RTJEXHUyMDI2JyA6ICdcdTRGRUVcdTc0MDYnO1xuICAgIH1cbiAgICBpZiAodGhpcy5lbHMuc3RhdHVzQnRuKSB7XG4gICAgICB0aGlzLmVscy5zdGF0dXNCdG4uZGlzYWJsZWQgPSBpc0J1c3koJ3N0YXR1cycpO1xuICAgICAgdGhpcy5lbHMuc3RhdHVzQnRuLnRleHRDb250ZW50ID0gaXNCdXN5KCdzdGF0dXMnKSA/ICdcdTUyMzdcdTY1QjBcdTRFMkRcdTIwMjYnIDogJ1x1NTIzN1x1NjVCMFx1NzJCNlx1NjAwMSc7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzZXRTdGF0dXNNZXNzYWdlKHRleHQ6IHN0cmluZykge1xuICAgIGlmICghdGhpcy5lbHMuc3RhdHVzVGV4dCkgcmV0dXJuO1xuICAgIHRoaXMuZWxzLnN0YXR1c1RleHQudGV4dENvbnRlbnQgPSB0ZXh0O1xuICB9XG5cbiAgcHJpdmF0ZSBmb3JtYXRQZXJjZW50KCkge1xuICAgIGNvbnN0IHBjdCA9IHRoaXMuY2FydENhcCA+IDAgPyBNYXRoLm1pbigxLCB0aGlzLmNhcnRBbXQgLyB0aGlzLmNhcnRDYXApIDogMDtcbiAgICByZXR1cm4gYCR7TWF0aC5yb3VuZChwY3QgKiAxMDApfSVgO1xuICB9XG59XG4iLCAiaW1wb3J0IHsgTmV0d29ya01hbmFnZXIgfSBmcm9tICcuLi9jb3JlL05ldHdvcmtNYW5hZ2VyJztcbmltcG9ydCB7IGh0bWwsIHFzIH0gZnJvbSAnLi4vdXRpbHMvZG9tJztcbmltcG9ydCB7IHJlbmRlck5hdiB9IGZyb20gJy4uL2NvbXBvbmVudHMvTmF2JztcbmltcG9ydCB7IFJlYWx0aW1lQ2xpZW50IH0gZnJvbSAnLi4vY29yZS9SZWFsdGltZUNsaWVudCc7XG5pbXBvcnQgeyByZW5kZXJSZXNvdXJjZUJhciB9IGZyb20gJy4uL2NvbXBvbmVudHMvUmVzb3VyY2VCYXInO1xuaW1wb3J0IHsgc2hvd1RvYXN0IH0gZnJvbSAnLi4vY29tcG9uZW50cy9Ub2FzdCc7XG5cbmV4cG9ydCBjbGFzcyBXYXJlaG91c2VTY2VuZSB7XG4gIGFzeW5jIG1vdW50KHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgcm9vdC5pbm5lckhUTUwgPSAnJztcbiAgICByb290LmFwcGVuZENoaWxkKHJlbmRlck5hdignd2FyZWhvdXNlJykpO1xuICAgIGNvbnN0IGJhciA9IHJlbmRlclJlc291cmNlQmFyKCk7XG4gICAgcm9vdC5hcHBlbmRDaGlsZChiYXIucm9vdCk7XG5cbiAgICBjb25zdCB2aWV3ID0gaHRtbChgXG4gICAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCIgc3R5bGU9XCJjb2xvcjojZmZmO1wiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZCBmYWRlLWluXCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiIHN0eWxlPVwianVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YWxpZ24taXRlbXM6Y2VudGVyO1wiPlxuICAgICAgICAgICAgPGgzIHN0eWxlPVwibWFyZ2luOjA7XCI+XHU0RUQzXHU1RTkzPC9oMz5cbiAgICAgICAgICAgIDxidXR0b24gaWQ9XCJyZWZyZXNoXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIj5cdTUyMzdcdTY1QjA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IHN0eWxlPVwibWFyZ2luLXRvcDoxMnB4O1wiPlxuICAgICAgICAgICAgPGRldGFpbHMgb3Blbj5cbiAgICAgICAgICAgICAgPHN1bW1hcnk+XHU2MjExXHU3Njg0XHU5MDUzXHU1MTc3PC9zdW1tYXJ5PlxuICAgICAgICAgICAgICA8ZGl2IGlkPVwibGlzdFwiIHN0eWxlPVwibWFyZ2luLXRvcDo4cHg7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6OHB4O1wiPjwvZGl2PlxuICAgICAgICAgICAgPC9kZXRhaWxzPlxuICAgICAgICAgICAgPGRldGFpbHM+XG4gICAgICAgICAgICAgIDxzdW1tYXJ5Plx1OTA1M1x1NTE3N1x1NkEyMVx1Njc3Rjwvc3VtbWFyeT5cbiAgICAgICAgICAgICAgPGRpdiBpZD1cInRwbHNcIiBzdHlsZT1cIm1hcmdpbi10b3A6OHB4O2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjhweDtcIj48L2Rpdj5cbiAgICAgICAgICAgIDwvZGV0YWlscz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICBgKTtcbiAgICByb290LmFwcGVuZENoaWxkKHZpZXcpO1xuXG4gICAgY29uc3QgdG9rZW4gPSAoTmV0d29ya01hbmFnZXIgYXMgYW55KS5JWyd0b2tlbiddO1xuICAgIGlmICh0b2tlbikgUmVhbHRpbWVDbGllbnQuSS5jb25uZWN0KHRva2VuKTtcblxuICAgIGNvbnN0IGxpc3QgPSBxcyh2aWV3LCAnI2xpc3QnKTtcbiAgICBjb25zdCB0cGxDb250YWluZXIgPSBxcyh2aWV3LCAnI3RwbHMnKTtcbiAgICBjb25zdCByZWZyZXNoQnRuID0gcXM8SFRNTEJ1dHRvbkVsZW1lbnQ+KHZpZXcsICcjcmVmcmVzaCcpO1xuXG4gICAgY29uc3QgbG9hZCA9IGFzeW5jICgpID0+IHtcbiAgICAgIHJlZnJlc2hCdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgcmVmcmVzaEJ0bi50ZXh0Q29udGVudCA9ICdcdTUyMzdcdTY1QjBcdTRFMkRcdTIwMjYnO1xuICAgICAgYXdhaXQgYmFyLnVwZGF0ZSgpO1xuICAgICAgbGlzdC5pbm5lckhUTUwgPSAnJztcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSBsaXN0LmFwcGVuZENoaWxkKGh0bWwoJzxkaXYgY2xhc3M9XCJza2VsZXRvblwiPjwvZGl2PicpKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyBpdGVtczogYW55W10gfT4oJy9pdGVtcycpO1xuICAgICAgICBsaXN0LmlubmVySFRNTCA9ICcnO1xuICAgICAgICBpZiAoIWRhdGEuaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgbGlzdC5hcHBlbmRDaGlsZChodG1sKCc8ZGl2IHN0eWxlPVwib3BhY2l0eTouODtcIj5cdTY2ODJcdTY1RTBcdTkwNTNcdTUxNzdcdUZGMENcdTVDMURcdThCRDVcdTU5MUFcdTYzMTZcdTc3RkZcdTYyMTZcdTYzQTBcdTU5M0FcdTRFRTVcdTgzQjdcdTUzRDZcdTY2RjRcdTU5MUFcdThENDRcdTZFOTA8L2Rpdj4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGRhdGEuaXRlbXMpIHtcbiAgICAgICAgICBjb25zdCByb3cgPSBodG1sKGBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsaXN0LWl0ZW0gJHtpdGVtLmlzRXF1aXBwZWQgPyAnbGlzdC1pdGVtLS1idXknIDogJyd9XCI+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDoycHg7XCI+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgIDxzdHJvbmc+JHtpdGVtLnRlbXBsYXRlSWR9PC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgICAke2l0ZW0uaXNFcXVpcHBlZCA/ICc8c3BhbiBjbGFzcz1cInBpbGxcIj5cdTVERjJcdTg4QzVcdTU5MDc8L3NwYW4+JyA6ICcnfVxuICAgICAgICAgICAgICAgICAgJHtpdGVtLmlzTGlzdGVkID8gJzxzcGFuIGNsYXNzPVwicGlsbFwiPlx1NjMwMlx1NTM1NVx1NEUyRDwvc3Bhbj4nIDogJyd9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cIm9wYWNpdHk6Ljg1O1wiPlx1N0I0OVx1N0VBNyBMdi4ke2l0ZW0ubGV2ZWx9IFx1MDBCNyBcdTVCOUVcdTRGOEIgJHtpdGVtLmlkfTwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiIHN0eWxlPVwiZ2FwOjZweDtcIj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1idXlcIiBkYXRhLWFjdD1cImVxdWlwXCIgZGF0YS1pZD1cIiR7aXRlbS5pZH1cIiAke2l0ZW0uaXNFcXVpcHBlZCA/ICdkaXNhYmxlZCcgOiAnJ30+XHU4OEM1XHU1OTA3PC9idXR0b24+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiIGRhdGEtYWN0PVwidXBncmFkZVwiIGRhdGEtaWQ9XCIke2l0ZW0uaWR9XCI+XHU1MzQ3XHU3RUE3PC9idXR0b24+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgYCk7XG4gICAgICAgICAgcm93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKGV2KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBldi50YXJnZXQgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XG4gICAgICAgICAgICBjb25zdCBpZCA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnKTtcbiAgICAgICAgICAgIGNvbnN0IGFjdCA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtYWN0Jyk7XG4gICAgICAgICAgICBpZiAoIWlkIHx8ICFhY3QpIHJldHVybjtcbiAgICAgICAgICAgIHRhcmdldC5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgICBjb25zdCBvcmlnaW5hbCA9IHRhcmdldC50ZXh0Q29udGVudCB8fCAnJztcbiAgICAgICAgICAgIHRhcmdldC50ZXh0Q29udGVudCA9IGFjdCA9PT0gJ2VxdWlwJyA/ICdcdTg4QzVcdTU5MDdcdTRFMkRcdTIwMjYnIDogJ1x1NTM0N1x1N0VBN1x1NEUyRFx1MjAyNic7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBpZiAoYWN0ID09PSAnZXF1aXAnKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0KCcvaXRlbXMvZXF1aXAnLCB7IG1ldGhvZDogJ1BPU1QnLCBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGl0ZW1JZDogaWQgfSkgfSk7XG4gICAgICAgICAgICAgICAgc2hvd1RvYXN0KCdcdTg4QzVcdTU5MDdcdTYyMTBcdTUyOUYnKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3QoJy9pdGVtcy91cGdyYWRlJywgeyBtZXRob2Q6ICdQT1NUJywgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBpdGVtSWQ6IGlkIH0pIH0pO1xuICAgICAgICAgICAgICAgIHNob3dUb2FzdCgnXHU1MzQ3XHU3RUE3XHU2MjEwXHU1MjlGJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgYXdhaXQgbG9hZCgpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgICAgICAgIHNob3dUb2FzdChlPy5tZXNzYWdlIHx8ICdcdTY0Q0RcdTRGNUNcdTU5MzFcdThEMjUnKTtcbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgIHRhcmdldC50ZXh0Q29udGVudCA9IG9yaWdpbmFsO1xuICAgICAgICAgICAgICB0YXJnZXQuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBsaXN0LmFwcGVuZENoaWxkKHJvdyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0cGxzID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgdGVtcGxhdGVzOiBhbnlbXSB9PignL2l0ZW1zL3RlbXBsYXRlcycpO1xuICAgICAgICB0cGxDb250YWluZXIuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIGZvciAoY29uc3QgdHBsIG9mIHRwbHMudGVtcGxhdGVzKSB7XG4gICAgICAgICAgY29uc3Qgcm93ID0gaHRtbChgPGRpdiBjbGFzcz1cImxpc3QtaXRlbVwiPjxzdHJvbmc+JHt0cGwubmFtZSB8fCB0cGwuaWR9PC9zdHJvbmc+IFx1MDBCNyAke3RwbC5jYXRlZ29yeSB8fCAnXHU2NzJBXHU3N0U1XHU3QzdCXHU1NzhCJ308L2Rpdj5gKTtcbiAgICAgICAgICB0cGxDb250YWluZXIuYXBwZW5kQ2hpbGQocm93KTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgIHNob3dUb2FzdChlPy5tZXNzYWdlIHx8ICdcdTUyQTBcdThGN0RcdTRFRDNcdTVFOTNcdTU5MzFcdThEMjUnKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHJlZnJlc2hCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgcmVmcmVzaEJ0bi50ZXh0Q29udGVudCA9ICdcdTUyMzdcdTY1QjAnO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZWZyZXNoQnRuLm9uY2xpY2sgPSAoKSA9PiBsb2FkKCk7XG4gICAgYXdhaXQgbG9hZCgpO1xuICB9XG59XG4iLCAiaW1wb3J0IHsgTmV0d29ya01hbmFnZXIgfSBmcm9tICcuLi9jb3JlL05ldHdvcmtNYW5hZ2VyJztcbmltcG9ydCB7IGh0bWwsIHFzIH0gZnJvbSAnLi4vdXRpbHMvZG9tJztcbmltcG9ydCB7IHJlbmRlck5hdiB9IGZyb20gJy4uL2NvbXBvbmVudHMvTmF2JztcbmltcG9ydCB7IFJlYWx0aW1lQ2xpZW50IH0gZnJvbSAnLi4vY29yZS9SZWFsdGltZUNsaWVudCc7XG5pbXBvcnQgeyBzaG93VG9hc3QgfSBmcm9tICcuLi9jb21wb25lbnRzL1RvYXN0JztcbmltcG9ydCB7IHJlbmRlclJlc291cmNlQmFyIH0gZnJvbSAnLi4vY29tcG9uZW50cy9SZXNvdXJjZUJhcic7XG5cbmV4cG9ydCBjbGFzcyBQbHVuZGVyU2NlbmUge1xuICBwcml2YXRlIHJlc3VsdEJveDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcblxuICBtb3VudChyb290OiBIVE1MRWxlbWVudCkge1xuICAgIHJvb3QuaW5uZXJIVE1MID0gJyc7XG4gICAgcm9vdC5hcHBlbmRDaGlsZChyZW5kZXJOYXYoJ3BsdW5kZXInKSk7XG4gICAgY29uc3QgYmFyID0gcmVuZGVyUmVzb3VyY2VCYXIoKTtcbiAgICByb290LmFwcGVuZENoaWxkKGJhci5yb290KTtcblxuICAgIGNvbnN0IHZpZXcgPSBodG1sKGBcbiAgICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXJcIiBzdHlsZT1cImNvbG9yOiNmZmY7XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkIGZhZGUtaW5cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCIgc3R5bGU9XCJqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjthbGlnbi1pdGVtczpjZW50ZXI7XCI+XG4gICAgICAgICAgICA8aDMgc3R5bGU9XCJtYXJnaW46MDtcIj5cdTYzQTBcdTU5M0FcdTc2RUVcdTY4MDc8L2gzPlxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInJlZnJlc2hcIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiPlx1NTIzN1x1NjVCMDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgaWQ9XCJsaXN0XCIgc3R5bGU9XCJtYXJnaW4tdG9wOjEycHg7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6OHB4O1wiPjwvZGl2PlxuICAgICAgICAgIDxkaXYgaWQ9XCJyZXN1bHRcIiBzdHlsZT1cIm1hcmdpbi10b3A6MTJweDtvcGFjaXR5Oi45O2ZvbnQtZmFtaWx5Om1vbm9zcGFjZTtcIj48L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICBgKTtcbiAgICByb290LmFwcGVuZENoaWxkKHZpZXcpO1xuXG4gICAgY29uc3QgdG9rZW4gPSAoTmV0d29ya01hbmFnZXIgYXMgYW55KS5JWyd0b2tlbiddO1xuICAgIGlmICh0b2tlbikgUmVhbHRpbWVDbGllbnQuSS5jb25uZWN0KHRva2VuKTtcblxuICAgIFJlYWx0aW1lQ2xpZW50Lkkub24oJ3BsdW5kZXIuYXR0YWNrZWQnLCAobXNnKSA9PiB7XG4gICAgICBzaG93VG9hc3QoYFx1ODhBQlx1NjNBMFx1NTkzQVx1RkYxQVx1Njc2NVx1ODFFQSAke21zZy5hdHRhY2tlcn1cdUZGMENcdTYzNUZcdTU5MzEgJHttc2cubG9zc31gKTtcbiAgICAgIHRoaXMubG9nKGBcdTg4QUIgJHttc2cuYXR0YWNrZXJ9IFx1NjNBMFx1NTkzQVx1RkYwQ1x1NjM1Rlx1NTkzMSAke21zZy5sb3NzfWApO1xuICAgIH0pO1xuICAgIHRoaXMucmVzdWx0Qm94ID0gcXModmlldywgJyNyZXN1bHQnKTtcblxuICAgIGNvbnN0IGxpc3QgPSBxcyh2aWV3LCAnI2xpc3QnKTtcbiAgICBjb25zdCByZWZyZXNoQnRuID0gcXM8SFRNTEJ1dHRvbkVsZW1lbnQ+KHZpZXcsICcjcmVmcmVzaCcpO1xuXG4gICAgY29uc3QgbG9hZCA9IGFzeW5jICgpID0+IHtcbiAgICAgIHJlZnJlc2hCdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgcmVmcmVzaEJ0bi50ZXh0Q29udGVudCA9ICdcdTUyMzdcdTY1QjBcdTRFMkRcdTIwMjYnO1xuICAgICAgYXdhaXQgYmFyLnVwZGF0ZSgpO1xuICAgICAgbGlzdC5pbm5lckhUTUwgPSAnJztcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSBsaXN0LmFwcGVuZENoaWxkKGh0bWwoJzxkaXYgY2xhc3M9XCJza2VsZXRvblwiPjwvZGl2PicpKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyB0YXJnZXRzOiBhbnlbXSB9PignL3BsdW5kZXIvdGFyZ2V0cycpO1xuICAgICAgICBsaXN0LmlubmVySFRNTCA9ICcnO1xuICAgICAgICBpZiAoIWRhdGEudGFyZ2V0cy5sZW5ndGgpIHtcbiAgICAgICAgICBsaXN0LmFwcGVuZENoaWxkKGh0bWwoJzxkaXYgc3R5bGU9XCJvcGFjaXR5Oi44O1wiPlx1NjY4Mlx1NjVFMFx1NTNFRlx1NjNBMFx1NTkzQVx1NzY4NFx1NzZFRVx1NjgwN1x1RkYwQ1x1N0EwRFx1NTQwRVx1NTE4RFx1OEJENTwvZGl2PicpKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IHRhcmdldCBvZiBkYXRhLnRhcmdldHMpIHtcbiAgICAgICAgICBjb25zdCByb3cgPSBodG1sKGBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsaXN0LWl0ZW1cIj5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cImRpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjJweDtcIj5cbiAgICAgICAgICAgICAgICA8ZGl2PjxzdHJvbmc+JHt0YXJnZXQudXNlcm5hbWUgfHwgdGFyZ2V0LmlkfTwvc3Ryb25nPjwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJvcGFjaXR5Oi44NTtcIj5cdTc3RkZcdTc3RjNcdUZGMUEke3RhcmdldC5vcmV9IDxzcGFuIGNsYXNzPVwicGlsbFwiPlx1OTg4NFx1OEJBMVx1NjUzNlx1NzZDQSA1JX4zMCU8L3NwYW4+PC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLXNlbGxcIiBkYXRhLWlkPVwiJHt0YXJnZXQuaWR9XCI+XHU2M0EwXHU1OTNBPC9idXR0b24+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgYCk7XG4gICAgICAgICAgcm93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKGV2KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBlbCA9IGV2LnRhcmdldCBhcyBIVE1MQnV0dG9uRWxlbWVudDtcbiAgICAgICAgICAgIGNvbnN0IGlkID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWlkJyk7XG4gICAgICAgICAgICBpZiAoIWlkKSByZXR1cm47XG4gICAgICAgICAgICBlbC5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgICBjb25zdCBvcmlnaW5hbCA9IGVsLnRleHRDb250ZW50IHx8ICcnO1xuICAgICAgICAgICAgZWwudGV4dENvbnRlbnQgPSAnXHU2M0EwXHU1OTNBXHU0RTJEXHUyMDI2JztcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IHN1Y2Nlc3M6IGJvb2xlYW47IGxvb3RfYW1vdW50OiBudW1iZXIgfT4oYC9wbHVuZGVyLyR7aWR9YCwgeyBtZXRob2Q6ICdQT1NUJyB9KTtcbiAgICAgICAgICAgICAgaWYgKHJlcy5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2coYFx1NjIxMFx1NTI5Rlx1NjNBMFx1NTkzQSAke2lkfVx1RkYwQ1x1ODNCN1x1NUY5NyAke3Jlcy5sb290X2Ftb3VudH1gKTtcbiAgICAgICAgICAgICAgICBzaG93VG9hc3QoYFx1NjNBMFx1NTkzQVx1NjIxMFx1NTI5Rlx1RkYwQ1x1ODNCN1x1NUY5NyAke3Jlcy5sb290X2Ftb3VudH1gKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZyhgXHU2M0EwXHU1OTNBICR7aWR9IFx1NTkzMVx1OEQyNWApO1xuICAgICAgICAgICAgICAgIHNob3dUb2FzdCgnXHU2M0EwXHU1OTNBXHU1OTMxXHU4RDI1Jyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgYXdhaXQgYmFyLnVwZGF0ZSgpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBlPy5tZXNzYWdlIHx8ICdcdTYzQTBcdTU5M0FcdTU5MzFcdThEMjUnO1xuICAgICAgICAgICAgICB0aGlzLmxvZyhgXHU2M0EwXHU1OTNBXHU1OTMxXHU4RDI1XHVGRjFBJHttZXNzYWdlfWApO1xuICAgICAgICAgICAgICBpZiAobWVzc2FnZS5pbmNsdWRlcygnXHU1MUI3XHU1Mzc0JykpIHtcbiAgICAgICAgICAgICAgICBzaG93VG9hc3QoJ1x1NjNBMFx1NTkzQVx1NTY2OFx1NTFCN1x1NTM3NFx1NEUyRFx1RkYwQ1x1OEJGN1x1N0EwRFx1NTQwRVx1NTE4RFx1OEJENScpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNob3dUb2FzdChtZXNzYWdlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgZWwudGV4dENvbnRlbnQgPSBvcmlnaW5hbDtcbiAgICAgICAgICAgICAgZWwuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBsaXN0LmFwcGVuZENoaWxkKHJvdyk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgICBzaG93VG9hc3QoZT8ubWVzc2FnZSB8fCAnXHU1MkEwXHU4RjdEXHU2M0EwXHU1OTNBXHU3NkVFXHU2ODA3XHU1OTMxXHU4RDI1Jyk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICByZWZyZXNoQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIHJlZnJlc2hCdG4udGV4dENvbnRlbnQgPSAnXHU1MjM3XHU2NUIwJztcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmVmcmVzaEJ0bi5vbmNsaWNrID0gKCkgPT4gbG9hZCgpO1xuICAgIGxvYWQoKTtcbiAgfVxuXG4gIHByaXZhdGUgbG9nKG1zZzogc3RyaW5nKSB7XG4gICAgaWYgKCF0aGlzLnJlc3VsdEJveCkgcmV0dXJuO1xuICAgIGNvbnN0IGxpbmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBsaW5lLnRleHRDb250ZW50ID0gYFske25ldyBEYXRlKCkudG9Mb2NhbGVUaW1lU3RyaW5nKCl9XSAke21zZ31gO1xuICAgIHRoaXMucmVzdWx0Qm94LnByZXBlbmQobGluZSk7XG4gIH1cbn1cbiIsICJpbXBvcnQgeyBOZXR3b3JrTWFuYWdlciB9IGZyb20gJy4uL2NvcmUvTmV0d29ya01hbmFnZXInO1xuaW1wb3J0IHsgaHRtbCwgcXMgfSBmcm9tICcuLi91dGlscy9kb20nO1xuaW1wb3J0IHsgcmVuZGVyTmF2IH0gZnJvbSAnLi4vY29tcG9uZW50cy9OYXYnO1xuaW1wb3J0IHsgUmVhbHRpbWVDbGllbnQgfSBmcm9tICcuLi9jb3JlL1JlYWx0aW1lQ2xpZW50JztcbmltcG9ydCB7IEdhbWVNYW5hZ2VyIH0gZnJvbSAnLi4vY29yZS9HYW1lTWFuYWdlcic7XG5pbXBvcnQgeyBzaG93VG9hc3QgfSBmcm9tICcuLi9jb21wb25lbnRzL1RvYXN0JztcbmltcG9ydCB7IHJlbmRlclJlc291cmNlQmFyIH0gZnJvbSAnLi4vY29tcG9uZW50cy9SZXNvdXJjZUJhcic7XG5cbnR5cGUgT3JkZXIgPSB7XG4gIGlkOiBzdHJpbmc7XG4gIHVzZXJJZDogc3RyaW5nO1xuICB0eXBlOiAnYnV5JyB8ICdzZWxsJztcbiAgaXRlbVRlbXBsYXRlSWQ/OiBzdHJpbmc7XG4gIGl0ZW1JbnN0YW5jZUlkPzogc3RyaW5nO1xuICBwcmljZTogbnVtYmVyO1xuICBhbW91bnQ6IG51bWJlcjtcbiAgY3JlYXRlZEF0OiBudW1iZXI7XG59O1xuXG5leHBvcnQgY2xhc3MgRXhjaGFuZ2VTY2VuZSB7XG4gIHByaXZhdGUgcmVmcmVzaFRpbWVyOiBudW1iZXIgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSB0ZW1wbGF0ZXM6IHsgaWQ6IHN0cmluZzsgbmFtZT86IHN0cmluZzsgY2F0ZWdvcnk/OiBzdHJpbmcgfVtdID0gW107XG4gIHByaXZhdGUgaW52ZW50b3J5OiBhbnlbXSA9IFtdO1xuXG4gIGFzeW5jIG1vdW50KHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgdGhpcy5jbGVhclRpbWVyKCk7XG4gICAgcm9vdC5pbm5lckhUTUwgPSAnJztcblxuICAgIGNvbnN0IG5hdiA9IHJlbmRlck5hdignZXhjaGFuZ2UnKTtcbiAgICBjb25zdCBiYXIgPSByZW5kZXJSZXNvdXJjZUJhcigpO1xuICAgIGNvbnN0IHZpZXcgPSBodG1sKGBcbiAgICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXJcIiBzdHlsZT1cImNvbG9yOiNmZmY7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6MTJweDtcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQgZmFkZS1pblwiPlxuICAgICAgICAgIDxoMyBzdHlsZT1cIm1hcmdpbjowIDAgMTJweDtcIj5cdTVFMDJcdTU3M0FcdTRFMEJcdTUzNTU8L2gzPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIiBzdHlsZT1cImZsZXgtd3JhcDp3cmFwO2FsaWduLWl0ZW1zOmZsZXgtZW5kO2dhcDoxMnB4O1wiPlxuICAgICAgICAgICAgPGRpdiBzdHlsZT1cImZsZXg6MTttaW4td2lkdGg6MTgwcHg7XCI+XG4gICAgICAgICAgICAgIDxsYWJlbD5cdThEMkRcdTRFNzBcdTZBMjFcdTY3N0Y8L2xhYmVsPlxuICAgICAgICAgICAgICA8c2VsZWN0IGlkPVwidHBsXCIgY2xhc3M9XCJpbnB1dFwiPjwvc2VsZWN0PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZmxleDoxO21pbi13aWR0aDoxMjBweDtcIj5cbiAgICAgICAgICAgICAgPGxhYmVsPlx1NEVGN1x1NjgzQyAoQkJcdTVFMDEpPC9sYWJlbD5cbiAgICAgICAgICAgICAgPGlucHV0IGlkPVwicHJpY2VcIiBjbGFzcz1cImlucHV0XCIgdHlwZT1cIm51bWJlclwiIG1pbj1cIjFcIiB2YWx1ZT1cIjEwXCIvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZmxleDoxO21pbi13aWR0aDoxMjBweDtcIj5cbiAgICAgICAgICAgICAgPGxhYmVsPlx1OEQyRFx1NEU3MFx1NjU3MFx1OTFDRjwvbGFiZWw+XG4gICAgICAgICAgICAgIDxpbnB1dCBpZD1cImFtb3VudFwiIGNsYXNzPVwiaW5wdXRcIiB0eXBlPVwibnVtYmVyXCIgbWluPVwiMVwiIHZhbHVlPVwiMVwiLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInBsYWNlQnV5XCIgY2xhc3M9XCJidG4gYnRuLWJ1eVwiIHN0eWxlPVwibWluLXdpZHRoOjEyMHB4O1wiPlx1NEUwQlx1NEU3MFx1NTM1NTwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgc3R5bGU9XCJoZWlnaHQ6OHB4O1wiPjwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIiBzdHlsZT1cImZsZXgtd3JhcDp3cmFwO2FsaWduLWl0ZW1zOmZsZXgtZW5kO2dhcDoxMnB4O1wiPlxuICAgICAgICAgICAgPGRpdiBzdHlsZT1cImZsZXg6MTttaW4td2lkdGg6MjIwcHg7XCI+XG4gICAgICAgICAgICAgIDxsYWJlbD5cdTUxRkFcdTU1MkVcdTkwNTNcdTUxNzc8L2xhYmVsPlxuICAgICAgICAgICAgICA8c2VsZWN0IGlkPVwiaW5zdFwiIGNsYXNzPVwiaW5wdXRcIj48L3NlbGVjdD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT1cImZsZXg6MTttaW4td2lkdGg6MTIwcHg7XCI+XG4gICAgICAgICAgICAgIDxsYWJlbD5cdTRFRjdcdTY4M0MgKEJCXHU1RTAxKTwvbGFiZWw+XG4gICAgICAgICAgICAgIDxpbnB1dCBpZD1cInNwcmljZVwiIGNsYXNzPVwiaW5wdXRcIiB0eXBlPVwibnVtYmVyXCIgbWluPVwiMVwiIHZhbHVlPVwiNVwiLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInBsYWNlU2VsbFwiIGNsYXNzPVwiYnRuIGJ0bi1zZWxsXCIgc3R5bGU9XCJtaW4td2lkdGg6MTIwcHg7XCI+XHU0RTBCXHU1MzU2XHU1MzU1PC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBpZD1cImludmVudG9yeVwiIHN0eWxlPVwibWFyZ2luLXRvcDoxMnB4O2Rpc3BsYXk6ZmxleDtmbGV4LXdyYXA6d3JhcDtnYXA6OHB4O1wiPjwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZCBmYWRlLWluXCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiIHN0eWxlPVwianVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YWxpZ24taXRlbXM6Y2VudGVyO2dhcDoxMnB4O1wiPlxuICAgICAgICAgICAgPGgzIHN0eWxlPVwibWFyZ2luOjA7XCI+XHU4QkEyXHU1MzU1XHU3QzNGPC9oMz5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIiBzdHlsZT1cImZsZXgtd3JhcDp3cmFwO2dhcDo4cHg7XCI+XG4gICAgICAgICAgICAgIDxzZWxlY3QgaWQ9XCJxX3RwbFwiIGNsYXNzPVwiaW5wdXRcIiBzdHlsZT1cIndpZHRoOjE4MHB4O1wiPjwvc2VsZWN0PlxuICAgICAgICAgICAgICA8c2VsZWN0IGlkPVwicV90eXBlXCIgY2xhc3M9XCJpbnB1dFwiIHN0eWxlPVwid2lkdGg6MTIwcHg7XCI+XG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImJ1eVwiPlx1NEU3MFx1NTM1NTwvb3B0aW9uPlxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJzZWxsXCI+XHU1MzU2XHU1MzU1PC9vcHRpb24+XG4gICAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJyb3cgcGlsbFwiIHN0eWxlPVwiYWxpZ24taXRlbXM6Y2VudGVyO2dhcDo2cHg7XCI+XG4gICAgICAgICAgICAgICAgPGlucHV0IGlkPVwibXlcIiB0eXBlPVwiY2hlY2tib3hcIi8+IFx1NTNFQVx1NzcwQlx1NjIxMVx1NzY4NFxuICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwicmVmcmVzaFwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCIgc3R5bGU9XCJtaW4td2lkdGg6OTZweDtcIj5cdTUyMzdcdTY1QjA8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgaWQ9XCJib29rXCIgc3R5bGU9XCJtYXJnaW4tdG9wOjEycHg7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6OHB4O1wiPjwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZCBmYWRlLWluXCIgaWQ9XCJsb2dzXCIgc3R5bGU9XCJvcGFjaXR5Oi45O2ZvbnQtZmFtaWx5Om1vbm9zcGFjZTttaW4taGVpZ2h0OjI0cHg7XCI+PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICBgKTtcblxuICAgIHJvb3QuYXBwZW5kQ2hpbGQobmF2KTtcbiAgICByb290LmFwcGVuZENoaWxkKGJhci5yb290KTtcbiAgICByb290LmFwcGVuZENoaWxkKHZpZXcpO1xuXG4gICAgY29uc3QgdG9rZW4gPSAoTmV0d29ya01hbmFnZXIgYXMgYW55KS5JWyd0b2tlbiddO1xuICAgIGlmICh0b2tlbikgUmVhbHRpbWVDbGllbnQuSS5jb25uZWN0KHRva2VuKTtcbiAgICBjb25zdCBtZSA9IEdhbWVNYW5hZ2VyLkkuZ2V0UHJvZmlsZSgpO1xuXG4gICAgY29uc3QgYm9vayA9IHFzKHZpZXcsICcjYm9vaycpO1xuICAgIGNvbnN0IGxvZ3MgPSBxczxIVE1MRWxlbWVudD4odmlldywgJyNsb2dzJyk7XG4gICAgY29uc3QgYnV5VHBsID0gcXM8SFRNTFNlbGVjdEVsZW1lbnQ+KHZpZXcsICcjdHBsJyk7XG4gICAgY29uc3QgYnV5UHJpY2UgPSBxczxIVE1MSW5wdXRFbGVtZW50Pih2aWV3LCAnI3ByaWNlJyk7XG4gICAgY29uc3QgYnV5QW1vdW50ID0gcXM8SFRNTElucHV0RWxlbWVudD4odmlldywgJyNhbW91bnQnKTtcbiAgICBjb25zdCBwbGFjZUJ1eSA9IHFzPEhUTUxCdXR0b25FbGVtZW50Pih2aWV3LCAnI3BsYWNlQnV5Jyk7XG4gICAgY29uc3Qgc2VsbEluc3QgPSBxczxIVE1MU2VsZWN0RWxlbWVudD4odmlldywgJyNpbnN0Jyk7XG4gICAgY29uc3Qgc2VsbFByaWNlID0gcXM8SFRNTElucHV0RWxlbWVudD4odmlldywgJyNzcHJpY2UnKTtcbiAgICBjb25zdCBwbGFjZVNlbGwgPSBxczxIVE1MQnV0dG9uRWxlbWVudD4odmlldywgJyNwbGFjZVNlbGwnKTtcbiAgICBjb25zdCBpbnZCb3ggPSBxczxIVE1MRWxlbWVudD4odmlldywgJyNpbnZlbnRvcnknKTtcbiAgICBjb25zdCBxdWVyeVRwbCA9IHFzPEhUTUxTZWxlY3RFbGVtZW50Pih2aWV3LCAnI3FfdHBsJyk7XG4gICAgY29uc3QgcXVlcnlUeXBlID0gcXM8SFRNTFNlbGVjdEVsZW1lbnQ+KHZpZXcsICcjcV90eXBlJyk7XG4gICAgY29uc3QgcXVlcnlNaW5lT25seSA9IHFzPEhUTUxJbnB1dEVsZW1lbnQ+KHZpZXcsICcjbXknKTtcbiAgICBjb25zdCByZWZyZXNoQnRuID0gcXM8SFRNTEJ1dHRvbkVsZW1lbnQ+KHZpZXcsICcjcmVmcmVzaCcpO1xuXG4gICAgbGV0IHByZXZJZHMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICBsZXQgcmVmcmVzaGluZyA9IGZhbHNlO1xuXG4gICAgY29uc3QgbG9nID0gKG1lc3NhZ2U6IHN0cmluZykgPT4ge1xuICAgICAgbG9ncy50ZXh0Q29udGVudCA9IG1lc3NhZ2U7XG4gICAgfTtcblxuICAgIGNvbnN0IHJlbmRlclRlbXBsYXRlT3B0aW9ucyA9ICgpID0+IHtcbiAgICAgIGJ1eVRwbC5pbm5lckhUTUwgPSAnJztcbiAgICAgIHF1ZXJ5VHBsLmlubmVySFRNTCA9ICcnO1xuICAgICAgY29uc3QgcGxhY2Vob2xkZXIgPSBodG1sKCc8b3B0aW9uIHZhbHVlPVwiXCI+XHU5MDA5XHU2MkU5XHU2QTIxXHU2NzdGPC9vcHRpb24+JykgYXMgSFRNTE9wdGlvbkVsZW1lbnQ7XG4gICAgICBidXlUcGwuYXBwZW5kQ2hpbGQocGxhY2Vob2xkZXIpO1xuICAgICAgY29uc3QgcVBsYWNlaG9sZGVyID0gaHRtbCgnPG9wdGlvbiB2YWx1ZT1cIlwiPlx1NTE2OFx1OTBFOFx1NkEyMVx1Njc3Rjwvb3B0aW9uPicpIGFzIEhUTUxPcHRpb25FbGVtZW50O1xuICAgICAgcXVlcnlUcGwuYXBwZW5kQ2hpbGQocVBsYWNlaG9sZGVyKTtcbiAgICAgIGZvciAoY29uc3QgdHBsIG9mIHRoaXMudGVtcGxhdGVzKSB7XG4gICAgICAgIGNvbnN0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgICBvcHRpb24udmFsdWUgPSB0cGwuaWQ7XG4gICAgICAgIG9wdGlvbi50ZXh0Q29udGVudCA9IHRwbC5uYW1lID8gYCR7dHBsLm5hbWV9ICgke3RwbC5pZH0pYCA6IHRwbC5pZDtcbiAgICAgICAgYnV5VHBsLmFwcGVuZENoaWxkKG9wdGlvbik7XG4gICAgICAgIGNvbnN0IHFPcHRpb24gPSBvcHRpb24uY2xvbmVOb2RlKHRydWUpIGFzIEhUTUxPcHRpb25FbGVtZW50O1xuICAgICAgICBxdWVyeVRwbC5hcHBlbmRDaGlsZChxT3B0aW9uKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgcmVuZGVySW52ZW50b3J5ID0gKCkgPT4ge1xuICAgICAgc2VsbEluc3QuaW5uZXJIVE1MID0gJyc7XG4gICAgICBpbnZCb3guaW5uZXJIVE1MID0gJyc7XG4gICAgICBjb25zdCBkZWZhdWx0T3B0aW9uID0gaHRtbCgnPG9wdGlvbiB2YWx1ZT1cIlwiPlx1OTAwOVx1NjJFOVx1NTNFRlx1NTFGQVx1NTUyRVx1NzY4NFx1OTA1M1x1NTE3Nzwvb3B0aW9uPicpIGFzIEhUTUxPcHRpb25FbGVtZW50O1xuICAgICAgc2VsbEluc3QuYXBwZW5kQ2hpbGQoZGVmYXVsdE9wdGlvbik7XG4gICAgICBjb25zdCBhdmFpbGFibGUgPSB0aGlzLmludmVudG9yeS5maWx0ZXIoKGl0ZW0pID0+ICFpdGVtLmlzRXF1aXBwZWQgJiYgIWl0ZW0uaXNMaXN0ZWQpO1xuICAgICAgaWYgKCFhdmFpbGFibGUubGVuZ3RoKSB7XG4gICAgICAgIGludkJveC50ZXh0Q29udGVudCA9ICdcdTY2ODJcdTY1RTBcdTUzRUZcdTUxRkFcdTU1MkVcdTc2ODRcdTkwNTNcdTUxNzdcdUZGMDhcdTk3MDBcdTUxNDhcdTU3MjhcdTRFRDNcdTVFOTNcdTUzNzhcdTRFMEJcdTg4QzVcdTU5MDdcdUZGMDknO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgYXZhaWxhYmxlKSB7XG4gICAgICAgIGNvbnN0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgICBvcHRpb24udmFsdWUgPSBpdGVtLmlkO1xuICAgICAgICBvcHRpb24udGV4dENvbnRlbnQgPSBgJHtpdGVtLmlkfSBcdTAwQjcgJHtpdGVtLnRlbXBsYXRlSWR9IFx1MDBCNyBMdi4ke2l0ZW0ubGV2ZWx9YDtcbiAgICAgICAgc2VsbEluc3QuYXBwZW5kQ2hpbGQob3B0aW9uKTtcblxuICAgICAgICBjb25zdCBjaGlwID0gaHRtbChgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tZ2hvc3RcIiBzdHlsZT1cImZsZXg6dW5zZXQ7cGFkZGluZzo2cHggMTBweDtcIiBkYXRhLWlkPVwiJHtpdGVtLmlkfVwiPiR7aXRlbS5pZH0gKCR7aXRlbS50ZW1wbGF0ZUlkfSk8L2J1dHRvbj5gKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcbiAgICAgICAgY2hpcC5vbmNsaWNrID0gKCkgPT4ge1xuICAgICAgICAgIHNlbGxJbnN0LnZhbHVlID0gaXRlbS5pZDtcbiAgICAgICAgICBsb2coYFx1NURGMlx1OTAwOVx1NjJFOVx1NTFGQVx1NTUyRVx1OTA1M1x1NTE3NyAke2l0ZW0uaWR9YCk7XG4gICAgICAgIH07XG4gICAgICAgIGludkJveC5hcHBlbmRDaGlsZChjaGlwKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgbG9hZE1ldGFkYXRhID0gYXN5bmMgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgW3RwbHMsIGl0ZW1zXSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgICBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyB0ZW1wbGF0ZXM6IGFueVtdIH0+KCcvaXRlbXMvdGVtcGxhdGVzJyksXG4gICAgICAgICAgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgaXRlbXM6IGFueVtdIH0+KCcvaXRlbXMnKSxcbiAgICAgICAgXSk7XG4gICAgICAgIHRoaXMudGVtcGxhdGVzID0gdHBscy50ZW1wbGF0ZXMgfHwgW107XG4gICAgICAgIHRoaXMuaW52ZW50b3J5ID0gaXRlbXMuaXRlbXMgfHwgW107XG4gICAgICAgIHJlbmRlclRlbXBsYXRlT3B0aW9ucygpO1xuICAgICAgICByZW5kZXJJbnZlbnRvcnkoKTtcbiAgICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgICBsb2coZT8ubWVzc2FnZSB8fCAnXHU1MkEwXHU4RjdEXHU2QTIxXHU2NzdGL1x1NEVEM1x1NUU5M1x1NTkzMVx1OEQyNScpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCByZWZyZXNoID0gYXN5bmMgKG9wdHM6IHsgcXVpZXQ/OiBib29sZWFuIH0gPSB7fSkgPT4ge1xuICAgICAgaWYgKHJlZnJlc2hpbmcpIHJldHVybjtcbiAgICAgIHJlZnJlc2hpbmcgPSB0cnVlO1xuICAgICAgaWYgKCFvcHRzLnF1aWV0KSByZWZyZXNoQnRuLnRleHRDb250ZW50ID0gJ1x1NTIzN1x1NjVCMFx1NEUyRFx1MjAyNic7XG4gICAgICByZWZyZXNoQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHRwbElkID0gcXVlcnlUcGwudmFsdWU7XG4gICAgICAgIGNvbnN0IHR5cGUgPSBxdWVyeVR5cGUudmFsdWUgYXMgJ2J1eScgfCAnc2VsbCc7XG4gICAgICAgIGNvbnN0IG1pbmVPbmx5ID0gcXVlcnlNaW5lT25seS5jaGVja2VkO1xuICAgICAgICBjb25zdCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKCk7XG4gICAgICAgIHBhcmFtcy5zZXQoJ3R5cGUnLCB0eXBlKTtcbiAgICAgICAgcGFyYW1zLnNldCgnaXRlbV90ZW1wbGF0ZV9pZCcsIHRwbElkIHx8ICcnKTtcbiAgICAgICAgaWYgKCFvcHRzLnF1aWV0KSB7XG4gICAgICAgICAgYm9vay5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykgYm9vay5hcHBlbmRDaGlsZChodG1sKCc8ZGl2IGNsYXNzPVwic2tlbGV0b25cIj48L2Rpdj4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IG9yZGVyczogT3JkZXJbXSB9PihgL2V4Y2hhbmdlL29yZGVycz8ke3BhcmFtcy50b1N0cmluZygpfWApO1xuICAgICAgICBjb25zdCBuZXdJZHMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICAgICAgYm9vay5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgY29uc3Qgb3JkZXJzID0gZGF0YS5vcmRlcnMgfHwgW107XG4gICAgICAgIGlmICghb3JkZXJzLmxlbmd0aCkge1xuICAgICAgICAgIGJvb2suYXBwZW5kQ2hpbGQoaHRtbCgnPGRpdiBzdHlsZT1cIm9wYWNpdHk6Ljg7dGV4dC1hbGlnbjpjZW50ZXI7XCI+XHU2NjgyXHU2NUUwXHU4QkEyXHU1MzU1PC9kaXY+JykpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3Qgb3JkZXIgb2Ygb3JkZXJzKSB7XG4gICAgICAgICAgaWYgKG1pbmVPbmx5ICYmIG1lICYmIG9yZGVyLnVzZXJJZCAhPT0gbWUuaWQpIGNvbnRpbnVlO1xuICAgICAgICAgIG5ld0lkcy5hZGQob3JkZXIuaWQpO1xuICAgICAgICAgIGNvbnN0IGlzTWluZSA9IG1lICYmIG9yZGVyLnVzZXJJZCA9PT0gbWUuaWQ7XG4gICAgICAgICAgY29uc3Qga2xhc3MgPSBgbGlzdC1pdGVtICR7b3JkZXIudHlwZSA9PT0gJ2J1eScgPyAnbGlzdC1pdGVtLS1idXknIDogJ2xpc3QtaXRlbS0tc2VsbCd9YDtcbiAgICAgICAgICBjb25zdCByb3cgPSBodG1sKGBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCIke2tsYXNzfVwiPlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6MnB4O1wiPlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICA8c3Ryb25nPiR7b3JkZXIudHlwZSA9PT0gJ2J1eScgPyAnXHU0RTcwXHU1MTY1JyA6ICdcdTUzNTZcdTUxRkEnfTwvc3Ryb25nPlxuICAgICAgICAgICAgICAgICAgJHtvcmRlci5pdGVtVGVtcGxhdGVJZCB8fCAnJ31cbiAgICAgICAgICAgICAgICAgICR7aXNNaW5lID8gJzxzcGFuIGNsYXNzPVwicGlsbFwiPlx1NjIxMVx1NzY4NDwvc3Bhbj4nIDogJyd9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cIm9wYWNpdHk6Ljg1O1wiPlxuICAgICAgICAgICAgICAgICAgXHU0RUY3XHU2ODNDOiAke29yZGVyLnByaWNlfSBcdTAwQjcgXHU2NTcwXHU5MUNGOiAke29yZGVyLmFtb3VudH1cbiAgICAgICAgICAgICAgICAgICR7b3JkZXIuaXRlbUluc3RhbmNlSWQgPyBgPHNwYW4gY2xhc3M9XCJwaWxsXCI+JHtvcmRlci5pdGVtSW5zdGFuY2VJZH08L3NwYW4+YCA6ICcnfVxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwaWxsXCI+JHtvcmRlci5pZH08L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICR7aXNNaW5lID8gYDxidXR0b24gY2xhc3M9XCJidG4gYnRuLWdob3N0XCIgZGF0YS1pZD1cIiR7b3JkZXIuaWR9XCI+XHU2NEE0XHU1MzU1PC9idXR0b24+YCA6ICcnfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIGApO1xuICAgICAgICAgIGlmICghcHJldklkcy5oYXMob3JkZXIuaWQpKSByb3cuY2xhc3NMaXN0LmFkZCgnZmxhc2gnKTtcbiAgICAgICAgICByb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZXYpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGV2LnRhcmdldCBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgICAgIGNvbnN0IGlkID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1pZCcpO1xuICAgICAgICAgICAgaWYgKCFpZCkgcmV0dXJuO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgdGFyZ2V0LnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCAndHJ1ZScpO1xuICAgICAgICAgICAgICBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3QoYC9leGNoYW5nZS9vcmRlcnMvJHtpZH1gLCB7IG1ldGhvZDogJ0RFTEVURScgfSk7XG4gICAgICAgICAgICAgIHNob3dUb2FzdCgnXHU2NEE0XHU1MzU1XHU2MjEwXHU1MjlGJyk7XG4gICAgICAgICAgICAgIGF3YWl0IHJlZnJlc2goKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgICAgICAgICBzaG93VG9hc3QoZT8ubWVzc2FnZSB8fCAnXHU2NEE0XHU1MzU1XHU1OTMxXHU4RDI1Jyk7XG4gICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICB0YXJnZXQucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGJvb2suYXBwZW5kQ2hpbGQocm93KTtcbiAgICAgICAgfVxuICAgICAgICBwcmV2SWRzID0gbmV3SWRzO1xuICAgICAgICBpZiAoIWJvb2suY2hpbGRFbGVtZW50Q291bnQpIHtcbiAgICAgICAgICBib29rLmFwcGVuZENoaWxkKGh0bWwoJzxkaXYgc3R5bGU9XCJvcGFjaXR5Oi44O3RleHQtYWxpZ246Y2VudGVyO1wiPlx1NjY4Mlx1NjVFMFx1N0IyNlx1NTQwOFx1Njc2MVx1NEVGNlx1NzY4NFx1OEJBMlx1NTM1NTwvZGl2PicpKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgIGxvZyhlPy5tZXNzYWdlIHx8ICdcdTUyMzdcdTY1QjBcdThCQTJcdTUzNTVcdTU5MzFcdThEMjUnKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHJlZnJlc2hpbmcgPSBmYWxzZTtcbiAgICAgICAgcmVmcmVzaEJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICByZWZyZXNoQnRuLnRleHRDb250ZW50ID0gJ1x1NTIzN1x1NjVCMCc7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBsYWNlQnV5Lm9uY2xpY2sgPSBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB0cGxJZCA9IGJ1eVRwbC52YWx1ZS50cmltKCk7XG4gICAgICBjb25zdCBwcmljZSA9IE51bWJlcihidXlQcmljZS52YWx1ZSk7XG4gICAgICBjb25zdCBhbW91bnQgPSBOdW1iZXIoYnV5QW1vdW50LnZhbHVlKTtcbiAgICAgIGlmICghdHBsSWQpIHtcbiAgICAgICAgc2hvd1RvYXN0KCdcdThCRjdcdTkwMDlcdTYyRTlcdThEMkRcdTRFNzBcdTc2ODRcdTZBMjFcdTY3N0YnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHByaWNlIDw9IDAgfHwgYW1vdW50IDw9IDApIHtcbiAgICAgICAgc2hvd1RvYXN0KCdcdThCRjdcdThGOTNcdTUxNjVcdTY3MDlcdTY1NDhcdTc2ODRcdTRFRjdcdTY4M0NcdTRFMEVcdTY1NzBcdTkxQ0YnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcGxhY2VCdXkuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgcGxhY2VCdXkudGV4dENvbnRlbnQgPSAnXHU2M0QwXHU0RUE0XHU0RTJEXHUyMDI2JztcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IGlkOiBzdHJpbmcgfT4oJy9leGNoYW5nZS9vcmRlcnMnLCB7XG4gICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyB0eXBlOiAnYnV5JywgaXRlbV90ZW1wbGF0ZV9pZDogdHBsSWQsIHByaWNlLCBhbW91bnQgfSksXG4gICAgICAgIH0pO1xuICAgICAgICBzaG93VG9hc3QoYFx1NEU3MFx1NTM1NVx1NURGMlx1NjNEMFx1NEVBNCAoIyR7cmVzLmlkfSlgKTtcbiAgICAgICAgbG9nKGBcdTRFNzBcdTUzNTVcdTYyMTBcdTUyOUY6ICR7cmVzLmlkfWApO1xuICAgICAgICBhd2FpdCBiYXIudXBkYXRlKCk7XG4gICAgICAgIGF3YWl0IHJlZnJlc2goKTtcbiAgICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgICBzaG93VG9hc3QoZT8ubWVzc2FnZSB8fCAnXHU0RTcwXHU1MzU1XHU2M0QwXHU0RUE0XHU1OTMxXHU4RDI1Jyk7XG4gICAgICAgIGxvZyhlPy5tZXNzYWdlIHx8ICdcdTRFNzBcdTUzNTVcdTYzRDBcdTRFQTRcdTU5MzFcdThEMjUnKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHBsYWNlQnV5LmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIHBsYWNlQnV5LnRleHRDb250ZW50ID0gJ1x1NEUwQlx1NEU3MFx1NTM1NSc7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBsYWNlU2VsbC5vbmNsaWNrID0gYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgaW5zdElkID0gc2VsbEluc3QudmFsdWUudHJpbSgpO1xuICAgICAgY29uc3QgcHJpY2UgPSBOdW1iZXIoc2VsbFByaWNlLnZhbHVlKTtcbiAgICAgIGlmICghaW5zdElkKSB7XG4gICAgICAgIHNob3dUb2FzdCgnXHU4QkY3XHU5MDA5XHU2MkU5XHU4OTgxXHU1MUZBXHU1NTJFXHU3Njg0XHU5MDUzXHU1MTc3Jyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChwcmljZSA8PSAwKSB7XG4gICAgICAgIHNob3dUb2FzdCgnXHU4QkY3XHU4RjkzXHU1MTY1XHU2NzA5XHU2NTQ4XHU3Njg0XHU0RUY3XHU2ODNDJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHBsYWNlU2VsbC5kaXNhYmxlZCA9IHRydWU7XG4gICAgICBwbGFjZVNlbGwudGV4dENvbnRlbnQgPSAnXHU2M0QwXHU0RUE0XHU0RTJEXHUyMDI2JztcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IE5ldHdvcmtNYW5hZ2VyLkkucmVxdWVzdDx7IGlkOiBzdHJpbmcgfT4oJy9leGNoYW5nZS9vcmRlcnMnLCB7XG4gICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyB0eXBlOiAnc2VsbCcsIGl0ZW1faW5zdGFuY2VfaWQ6IGluc3RJZCwgcHJpY2UgfSksXG4gICAgICAgIH0pO1xuICAgICAgICBzaG93VG9hc3QoYFx1NTM1Nlx1NTM1NVx1NURGMlx1NjNEMFx1NEVBNCAoIyR7cmVzLmlkfSlgKTtcbiAgICAgICAgbG9nKGBcdTUzNTZcdTUzNTVcdTYyMTBcdTUyOUY6ICR7cmVzLmlkfWApO1xuICAgICAgICBhd2FpdCBiYXIudXBkYXRlKCk7XG4gICAgICAgIGF3YWl0IGxvYWRNZXRhZGF0YSgpO1xuICAgICAgICBhd2FpdCByZWZyZXNoKCk7XG4gICAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgICAgc2hvd1RvYXN0KGU/Lm1lc3NhZ2UgfHwgJ1x1NTM1Nlx1NTM1NVx1NjNEMFx1NEVBNFx1NTkzMVx1OEQyNScpO1xuICAgICAgICBsb2coZT8ubWVzc2FnZSB8fCAnXHU1MzU2XHU1MzU1XHU2M0QwXHU0RUE0XHU1OTMxXHU4RDI1Jyk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBwbGFjZVNlbGwuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgcGxhY2VTZWxsLnRleHRDb250ZW50ID0gJ1x1NEUwQlx1NTM1Nlx1NTM1NSc7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJlZnJlc2hCdG4ub25jbGljayA9ICgpID0+IHJlZnJlc2goKTtcbiAgICBxdWVyeVRwbC5vbmNoYW5nZSA9ICgpID0+IHJlZnJlc2goKTtcbiAgICBxdWVyeVR5cGUub25jaGFuZ2UgPSAoKSA9PiByZWZyZXNoKCk7XG4gICAgcXVlcnlNaW5lT25seS5vbmNoYW5nZSA9ICgpID0+IHJlZnJlc2goKTtcblxuICAgIGF3YWl0IFByb21pc2UuYWxsKFtiYXIudXBkYXRlKCksIGxvYWRNZXRhZGF0YSgpXSk7XG4gICAgYXdhaXQgcmVmcmVzaCh7IHF1aWV0OiB0cnVlIH0pO1xuICAgIHRoaXMucmVmcmVzaFRpbWVyID0gd2luZG93LnNldEludGVydmFsKCgpID0+IHtcbiAgICAgIHJlZnJlc2goeyBxdWlldDogdHJ1ZSB9KS5jYXRjaCgoKSA9PiB7fSk7XG4gICAgfSwgMTAwMDApO1xuICB9XG5cbiAgcHJpdmF0ZSBjbGVhclRpbWVyKCkge1xuICAgIGlmICh0aGlzLnJlZnJlc2hUaW1lciAhPT0gbnVsbCkge1xuICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5yZWZyZXNoVGltZXIpO1xuICAgICAgdGhpcy5yZWZyZXNoVGltZXIgPSBudWxsO1xuICAgIH1cbiAgfVxufVxuIiwgImltcG9ydCB7IE5ldHdvcmtNYW5hZ2VyIH0gZnJvbSAnLi4vY29yZS9OZXR3b3JrTWFuYWdlcic7XG5pbXBvcnQgeyBodG1sLCBxcyB9IGZyb20gJy4uL3V0aWxzL2RvbSc7XG5pbXBvcnQgeyByZW5kZXJOYXYgfSBmcm9tICcuLi9jb21wb25lbnRzL05hdic7XG5pbXBvcnQgeyBSZWFsdGltZUNsaWVudCB9IGZyb20gJy4uL2NvcmUvUmVhbHRpbWVDbGllbnQnO1xuaW1wb3J0IHsgcmVuZGVyUmVzb3VyY2VCYXIgfSBmcm9tICcuLi9jb21wb25lbnRzL1Jlc291cmNlQmFyJztcblxuZXhwb3J0IGNsYXNzIFJhbmtpbmdTY2VuZSB7XG4gIG1vdW50KHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgcm9vdC5pbm5lckhUTUwgPSAnJztcbiAgICByb290LmFwcGVuZENoaWxkKHJlbmRlck5hdigncmFua2luZycpKTtcbiAgICBjb25zdCBiYXIgPSByZW5kZXJSZXNvdXJjZUJhcigpO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQoYmFyLnJvb3QpO1xuXG4gICAgY29uc3QgdmlldyA9IGh0bWwoYFxuICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiIHN0eWxlPVwiY29sb3I6I2ZmZjtcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQgZmFkZS1pblwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIiBzdHlsZT1cImp1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2FsaWduLWl0ZW1zOmNlbnRlcjtcIj5cbiAgICAgICAgICAgIDxoMyBzdHlsZT1cIm1hcmdpbjowO1wiPlx1NjM5Mlx1ODg0Q1x1Njk5QzwvaDM+XG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwicmVmcmVzaFwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCI+XHU1MjM3XHU2NUIwPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBpZD1cIm1lXCIgc3R5bGU9XCJtYXJnaW4tdG9wOjhweDtvcGFjaXR5Oi45NTtcIj48L2Rpdj5cbiAgICAgICAgICA8ZGl2IGlkPVwibGlzdFwiIHN0eWxlPVwibWFyZ2luLXRvcDoxMnB4O2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjZweDtcIj48L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICBgKTtcbiAgICByb290LmFwcGVuZENoaWxkKHZpZXcpO1xuXG4gICAgY29uc3QgdG9rZW4gPSAoTmV0d29ya01hbmFnZXIgYXMgYW55KS5JWyd0b2tlbiddO1xuICAgIGlmICh0b2tlbikgUmVhbHRpbWVDbGllbnQuSS5jb25uZWN0KHRva2VuKTtcblxuICAgIGNvbnN0IG1lQm94ID0gcXModmlldywgJyNtZScpO1xuICAgIGNvbnN0IGxpc3QgPSBxcyh2aWV3LCAnI2xpc3QnKTtcbiAgICBjb25zdCByZWZyZXNoQnRuID0gcXM8SFRNTEJ1dHRvbkVsZW1lbnQ+KHZpZXcsICcjcmVmcmVzaCcpO1xuXG4gICAgY29uc3QgbG9hZCA9IGFzeW5jICgpID0+IHtcbiAgICAgIHJlZnJlc2hCdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgcmVmcmVzaEJ0bi50ZXh0Q29udGVudCA9ICdcdTUyMzdcdTY1QjBcdTRFMkRcdTIwMjYnO1xuICAgICAgYXdhaXQgYmFyLnVwZGF0ZSgpO1xuICAgICAgbGlzdC5pbm5lckhUTUwgPSAnJztcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSBsaXN0LmFwcGVuZENoaWxkKGh0bWwoJzxkaXYgY2xhc3M9XCJza2VsZXRvblwiPjwvZGl2PicpKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IG1lID0gYXdhaXQgTmV0d29ya01hbmFnZXIuSS5yZXF1ZXN0PHsgcmFuazogbnVtYmVyOyBzY29yZTogbnVtYmVyIH0+KCcvcmFua2luZy9tZScpO1xuICAgICAgICBjb25zdCB0b3AgPSBhd2FpdCBOZXR3b3JrTWFuYWdlci5JLnJlcXVlc3Q8eyBsaXN0OiBhbnlbXSB9PignL3JhbmtpbmcvdG9wP249MjAnKTtcbiAgICAgICAgbWVCb3gudGV4dENvbnRlbnQgPSBgXHU2MjExXHU3Njg0XHU1NDBEXHU2QjIxXHVGRjFBIyR7bWUucmFua30gXHUwMEI3IFx1NjAzQlx1NUY5N1x1NTIwNlx1RkYxQSR7bWUuc2NvcmV9YDtcbiAgICAgICAgbGlzdC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgZm9yIChjb25zdCBlbnRyeSBvZiB0b3AubGlzdCkge1xuICAgICAgICAgIGNvbnN0IG1lZGFsID0gZW50cnkucmFuayA9PT0gMSA/ICdcdUQ4M0VcdURENDcnIDogZW50cnkucmFuayA9PT0gMiA/ICdcdUQ4M0VcdURENDgnIDogZW50cnkucmFuayA9PT0gMyA/ICdcdUQ4M0VcdURENDknIDogJyc7XG4gICAgICAgICAgY29uc3Qgcm93ID0gaHRtbChgXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibGlzdC1pdGVtXCIgc3R5bGU9XCIke2VudHJ5LnJhbmsgPT09IDEgPyAnYm9yZGVyLWxlZnQ6M3B4IHNvbGlkIHZhcigtLW9rKTsnIDogJyd9XCI+XG4gICAgICAgICAgICAgIDxzcGFuPiR7bWVkYWx9ICMke2VudHJ5LnJhbmt9PC9zcGFuPlxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT1cImZsZXg6MTtvcGFjaXR5Oi45O21hcmdpbi1sZWZ0OjEycHg7XCI+JHtlbnRyeS51c2VySWR9PC9zcGFuPlxuICAgICAgICAgICAgICA8c3Ryb25nPiR7ZW50cnkuc2NvcmV9PC9zdHJvbmc+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICBgKTtcbiAgICAgICAgICBsaXN0LmFwcGVuZENoaWxkKHJvdyk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgICBtZUJveC50ZXh0Q29udGVudCA9IGU/Lm1lc3NhZ2UgfHwgJ1x1NjM5Mlx1ODg0Q1x1Njk5Q1x1NTJBMFx1OEY3RFx1NTkzMVx1OEQyNSc7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICByZWZyZXNoQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIHJlZnJlc2hCdG4udGV4dENvbnRlbnQgPSAnXHU1MjM3XHU2NUIwJztcbiAgICAgIH1cbiAgICB9O1xuICAgIHJlZnJlc2hCdG4ub25jbGljayA9ICgpID0+IGxvYWQoKTtcbiAgICBsb2FkKCk7XG4gIH1cbn1cbiIsICJsZXQgaW5qZWN0ZWQgPSBmYWxzZTtcblxuZXhwb3J0IGZ1bmN0aW9uIGVuc3VyZUdsb2JhbFN0eWxlcygpIHtcbiAgaWYgKGluamVjdGVkKSByZXR1cm47XG4gIGNvbnN0IGNzcyA9IGA6cm9vdHstLWJnOiMwYjEwMjA7LS1mZzojZmZmOy0tbXV0ZWQ6cmdiYSgyNTUsMjU1LDI1NSwuNzUpOy0tZ3JhZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCM3QjJDRjUsIzJDODlGNSk7LS1wYW5lbC1ncmFkOmxpbmVhci1ncmFkaWVudCgxMzVkZWcscmdiYSgxMjMsNDQsMjQ1LC4yNSkscmdiYSg0NCwxMzcsMjQ1LC4yNSkpOy0tZ2xhc3M6Ymx1cigxMHB4KTstLWdsb3c6MCA4cHggMjBweCByZ2JhKDAsMCwwLC4zNSksMCAwIDEycHggcmdiYSgxMjMsNDQsMjQ1LC43KTstLXJhZGl1cy1zbToxMHB4Oy0tcmFkaXVzLW1kOjEycHg7LS1yYWRpdXMtbGc6MTZweDstLWVhc2U6Y3ViaWMtYmV6aWVyKC4yMiwuNjEsLjM2LDEpOy0tZHVyOi4yOHM7LS1idXk6IzJDODlGNTstLXNlbGw6I0UzNjQxNDstLW9rOiMyZWMyN2U7LS13YXJuOiNmNmM0NDU7LS1kYW5nZXI6I2ZmNWM1Y31cbmh0bWwsYm9keXtiYWNrZ3JvdW5kOnZhcigtLWJnKTtjb2xvcjp2YXIoLS1mZyk7Zm9udC1mYW1pbHk6c3lzdGVtLXVpLC1hcHBsZS1zeXN0ZW0sXCJTZWdvZSBVSVwiLFwiUGluZ0ZhbmcgU0NcIixcIk1pY3Jvc29mdCBZYUhlaVwiLEFyaWFsLHNhbnMtc2VyaWZ9XG4uY29udGFpbmVye3BhZGRpbmc6MCAxMnB4fVxuLmNvbnRhaW5lcnttYXgtd2lkdGg6NjgwcHg7bWFyZ2luOjEycHggYXV0b31cbi5jYXJke2JvcmRlci1yYWRpdXM6dmFyKC0tcmFkaXVzLWxnKTtiYWNrZ3JvdW5kOnZhcigtLXBhbmVsLWdyYWQpO2JhY2tkcm9wLWZpbHRlcjp2YXIoLS1nbGFzcyk7Ym94LXNoYWRvdzp2YXIoLS1nbG93KTtwYWRkaW5nOjEycHh9XG4ucm93e2Rpc3BsYXk6ZmxleDtnYXA6OHB4O2FsaWduLWl0ZW1zOmNlbnRlcn1cbi5jYXJkIGlucHV0LC5jYXJkIGJ1dHRvbntib3gtc2l6aW5nOmJvcmRlci1ib3g7b3V0bGluZTpub25lfVxuLmNhcmQgaW5wdXR7YmFja2dyb3VuZDpyZ2JhKDI1NSwyNTUsMjU1LC4wOCk7Ym9yZGVyOjA7Ym9yZGVyLXJhZGl1czp2YXIoLS1yYWRpdXMtbWQpO2NvbG9yOnZhcigtLWZnKTtwYWRkaW5nOjEwcHg7bWFyZ2luOjhweCAwO2FwcGVhcmFuY2U6bm9uZTstd2Via2l0LWFwcGVhcmFuY2U6bm9uZTtiYWNrZ3JvdW5kLWNsaXA6cGFkZGluZy1ib3h9XG4uY2FyZCBidXR0b257d2lkdGg6MTAwJTtib3JkZXItcmFkaXVzOnZhcigtLXJhZGl1cy1tZCl9XG4uYnRue3BhZGRpbmc6MTBweCAxNHB4O2JvcmRlcjowO2JvcmRlci1yYWRpdXM6dmFyKC0tcmFkaXVzLW1kKTtjb2xvcjojZmZmO3RyYW5zaXRpb246dHJhbnNmb3JtIHZhcigtLWR1cikgdmFyKC0tZWFzZSksYm94LXNoYWRvdyB2YXIoLS1kdXIpIHZhcigtLWVhc2UpfVxuLmJ0bjphY3RpdmV7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoMXB4KSBzY2FsZSguOTkpfVxuLmJ0bi1wcmltYXJ5e2JhY2tncm91bmQ6dmFyKC0tZ3JhZCk7Ym94LXNoYWRvdzp2YXIoLS1nbG93KX1cbi5idG4tYnV5e2JhY2tncm91bmQ6dmFyKC0tYnV5KX1cbi5idG4tc2VsbHtiYWNrZ3JvdW5kOnZhcigtLXNlbGwpfVxuLmJ0bi1naG9zdHtiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjA4KX1cbi5pbnB1dHt3aWR0aDoxMDAlO3BhZGRpbmc6MTBweDtib3JkZXI6MDtib3JkZXItcmFkaXVzOnZhcigtLXJhZGl1cy1tZCk7YmFja2dyb3VuZDpyZ2JhKDI1NSwyNTUsMjU1LC4wOCk7Y29sb3I6dmFyKC0tZmcpfVxuLnBpbGx7cGFkZGluZzoycHggOHB4O2JvcmRlci1yYWRpdXM6OTk5cHg7YmFja2dyb3VuZDpyZ2JhKDI1NSwyNTUsMjU1LC4wOCk7Zm9udC1zaXplOjEycHh9XG4uZmFkZS1pbnthbmltYXRpb246ZmFkZS1pbiAuM3MgdmFyKC0tZWFzZSl9XG5Aa2V5ZnJhbWVzIGZhZGUtaW57ZnJvbXtvcGFjaXR5OjA7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoNHB4KX10b3tvcGFjaXR5OjE7dHJhbnNmb3JtOm5vbmV9fVxuLmZsYXNoe2FuaW1hdGlvbjpmbGFzaCAuOXMgZWFzZX1cbkBrZXlmcmFtZXMgZmxhc2h7MCV7Ym94LXNoYWRvdzowIDAgMCByZ2JhKDI1NSwyNTUsMjU1LDApfTQwJXtib3gtc2hhZG93OjAgMCAwIDZweCByZ2JhKDI1NSwyNTUsMjU1LC4xNSl9MTAwJXtib3gtc2hhZG93OjAgMCAwIHJnYmEoMjU1LDI1NSwyNTUsMCl9fVxuLnNrZWxldG9ue3Bvc2l0aW9uOnJlbGF0aXZlO292ZXJmbG93OmhpZGRlbjtiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjA4KTtib3JkZXItcmFkaXVzOnZhcigtLXJhZGl1cy1tZCk7aGVpZ2h0OjQ0cHh9XG4uc2tlbGV0b246OmFmdGVye2NvbnRlbnQ6XCJcIjtwb3NpdGlvbjphYnNvbHV0ZTtpbnNldDowO3RyYW5zZm9ybTp0cmFuc2xhdGVYKC0xMDAlKTtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCg5MGRlZyx0cmFuc3BhcmVudCxyZ2JhKDI1NSwyNTUsMjU1LC4xMiksdHJhbnNwYXJlbnQpO2FuaW1hdGlvbjpzaGltbWVyIDEuMnMgaW5maW5pdGV9XG5Aa2V5ZnJhbWVzIHNoaW1tZXJ7MTAwJXt0cmFuc2Zvcm06dHJhbnNsYXRlWCgxMDAlKX19XG4ubGlzdC1pdGVte2Rpc3BsYXk6ZmxleDtnYXA6OHB4O2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjtiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjA2KTtib3JkZXItcmFkaXVzOnZhcigtLXJhZGl1cy1tZCk7cGFkZGluZzoxMHB4fVxuLmxpc3QtaXRlbS0tYnV5e2JvcmRlci1sZWZ0OjNweCBzb2xpZCB2YXIoLS1idXkpfVxuLmxpc3QtaXRlbS0tc2VsbHtib3JkZXItbGVmdDozcHggc29saWQgdmFyKC0tc2VsbCl9XG4ubmF2e21heC13aWR0aDo0ODBweDttYXJnaW46MTJweCBhdXRvIDA7ZGlzcGxheTpmbGV4O2dhcDo4cHg7ZmxleC13cmFwOndyYXA7cG9zaXRpb246c3RpY2t5O3RvcDowO3otaW5kZXg6MTB9XG4ubmF2IGF7ZmxleDoxO3RleHQtYWxpZ246Y2VudGVyO3BhZGRpbmc6MTBweDtib3JkZXItcmFkaXVzOjk5OXB4O3RleHQtZGVjb3JhdGlvbjpub25lO2NvbG9yOiNmZmZ9XG4ubmF2IGEuYWN0aXZle2JhY2tncm91bmQ6dmFyKC0tZ3JhZCk7Ym94LXNoYWRvdzp2YXIoLS1nbG93KX1cbkBtZWRpYSAocHJlZmVycy1yZWR1Y2VkLW1vdGlvbjpyZWR1Y2Upeyp7YW5pbWF0aW9uLWR1cmF0aW9uOi4wMDFtcyFpbXBvcnRhbnQ7YW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudDoxIWltcG9ydGFudDt0cmFuc2l0aW9uLWR1cmF0aW9uOjBtcyFpbXBvcnRhbnR9fVxuYDtcbiAgY29uc3Qgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICBzdHlsZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtdWknLCAnbWluZXItZ2FtZScpO1xuICBzdHlsZS50ZXh0Q29udGVudCA9IGNzcztcbiAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gIGluamVjdGVkID0gdHJ1ZTtcbn1cbiIsICJpbXBvcnQgeyBMb2dpblNjZW5lIH0gZnJvbSAnLi9zY2VuZXMvTG9naW5TY2VuZSc7XG5pbXBvcnQgeyBNYWluU2NlbmUgfSBmcm9tICcuL3NjZW5lcy9NYWluU2NlbmUnO1xuaW1wb3J0IHsgR2FtZU1hbmFnZXIgfSBmcm9tICcuL2NvcmUvR2FtZU1hbmFnZXInO1xuaW1wb3J0IHsgV2FyZWhvdXNlU2NlbmUgfSBmcm9tICcuL3NjZW5lcy9XYXJlaG91c2VTY2VuZSc7XG5pbXBvcnQgeyBQbHVuZGVyU2NlbmUgfSBmcm9tICcuL3NjZW5lcy9QbHVuZGVyU2NlbmUnO1xuaW1wb3J0IHsgRXhjaGFuZ2VTY2VuZSB9IGZyb20gJy4vc2NlbmVzL0V4Y2hhbmdlU2NlbmUnO1xuaW1wb3J0IHsgUmFua2luZ1NjZW5lIH0gZnJvbSAnLi9zY2VuZXMvUmFua2luZ1NjZW5lJztcbmltcG9ydCB7IGVuc3VyZUdsb2JhbFN0eWxlcyB9IGZyb20gJy4vc3R5bGVzL2luamVjdCc7XG5cbmZ1bmN0aW9uIHJvdXRlVG8oY29udGFpbmVyOiBIVE1MRWxlbWVudCkge1xuICBjb25zdCBoID0gbG9jYXRpb24uaGFzaCB8fCAnIy9sb2dpbic7XG4gIGNvbnN0IHNjZW5lID0gaC5zcGxpdCgnPycpWzBdO1xuICBzd2l0Y2ggKHNjZW5lKSB7XG4gICAgY2FzZSAnIy9tYWluJzpcbiAgICAgIG5ldyBNYWluU2NlbmUoKS5tb3VudChjb250YWluZXIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnIy93YXJlaG91c2UnOlxuICAgICAgbmV3IFdhcmVob3VzZVNjZW5lKCkubW91bnQoY29udGFpbmVyKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJyMvcGx1bmRlcic6XG4gICAgICBuZXcgUGx1bmRlclNjZW5lKCkubW91bnQoY29udGFpbmVyKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJyMvZXhjaGFuZ2UnOlxuICAgICAgbmV3IEV4Y2hhbmdlU2NlbmUoKS5tb3VudChjb250YWluZXIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnIy9yYW5raW5nJzpcbiAgICAgIG5ldyBSYW5raW5nU2NlbmUoKS5tb3VudChjb250YWluZXIpO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIG5ldyBMb2dpblNjZW5lKCkubW91bnQoY29udGFpbmVyKTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYm9vdHN0cmFwKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQpIHtcbiAgZW5zdXJlR2xvYmFsU3R5bGVzKCk7XG4gIHJvdXRlVG8oY29udGFpbmVyKTtcbiAgd2luZG93Lm9uaGFzaGNoYW5nZSA9ICgpID0+IHJvdXRlVG8oY29udGFpbmVyKTtcbn1cblxuLy8gXHU0RkJGXHU2Mzc3XHU1NDJGXHU1MkE4XHVGRjA4XHU3RjUxXHU5ODc1XHU3M0FGXHU1ODgzXHVGRjA5XG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgKHdpbmRvdyBhcyBhbnkpLk1pbmVyQXBwID0geyBib290c3RyYXAsIEdhbWVNYW5hZ2VyIH07XG59XG5cclxuXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7OztBQUFPLE1BQU0sa0JBQU4sTUFBTSxnQkFBZTtBQUFBLElBQXJCO0FBSUwsMEJBQVEsU0FBdUI7QUFBQTtBQUFBLElBRi9CLFdBQVcsSUFBb0I7QUFGakM7QUFFbUMsY0FBTyxVQUFLLGNBQUwsWUFBbUIsS0FBSyxZQUFZLElBQUksZ0JBQWU7QUFBQSxJQUFJO0FBQUEsSUFHbkcsU0FBUyxHQUFrQjtBQUFFLFdBQUssUUFBUTtBQUFBLElBQUc7QUFBQSxJQUU3QyxNQUFNLFFBQVcsTUFBYyxNQUFnQztBQUM3RCxZQUFNLFVBQWUsRUFBRSxnQkFBZ0Isb0JBQW9CLElBQUksNkJBQU0sWUFBVyxDQUFDLEVBQUc7QUFDcEYsVUFBSSxLQUFLLE1BQU8sU0FBUSxlQUFlLElBQUksVUFBVSxLQUFLLEtBQUs7QUFDL0QsWUFBTSxNQUFNLE1BQU0sTUFBTSxLQUFLLFFBQVEsSUFBSSxNQUFNLEVBQUUsR0FBRyxNQUFNLFFBQVEsQ0FBQztBQUNuRSxZQUFNLE9BQU8sTUFBTSxJQUFJLEtBQUs7QUFDNUIsVUFBSSxDQUFDLElBQUksTUFBTSxLQUFLLFFBQVEsSUFBSyxPQUFNLElBQUksTUFBTSxLQUFLLFdBQVcsZUFBZTtBQUNoRixhQUFPLEtBQUs7QUFBQSxJQUNkO0FBQUEsSUFFQSxVQUFrQjtB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
