// Simple one-click dev runner for miner-game
// - Ensures backend deps, starts NestJS backend on :3000
// - Serves a lightweight H5 demo on :5173 and proxies /api -> backend to avoid CORS

const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { URL } = require('url');

const ROOT = __dirname;
const BACKEND_DIR = path.join(ROOT, 'backend');
const WEB_DIR = path.join(ROOT, 'web');
const FRONT_PORT = process.env.FRONT_PORT || 5173;
const BACKEND_PORT = process.env.PORT || 3002;

function exists(p) {
  try { fs.accessSync(p); return true; } catch { return false; }
}

async function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const ps = spawn(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32', ...opts });
    ps.on('close', (code) => code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(' ')} exited ${code}`)));
  });
}

async function ensureBackendDeps() {
  const nm = path.join(BACKEND_DIR, 'node_modules');
  if (!exists(nm)) {
    console.log('[dev] Installing backend dependencies...');
    await run('npm', ['install'], { cwd: BACKEND_DIR });
  }
}

function startBackend() {
  console.log('[dev] Starting backend on :3000 ...');
  const ps = spawn('npm', ['run', 'start:dev'], { cwd: BACKEND_DIR, shell: process.platform === 'win32', env: { ...process.env, PORT: BACKEND_PORT } });
  ps.stdout?.on('data', d => process.stdout.write(`[backend] ${d}`));
  ps.stderr?.on('data', d => process.stderr.write(`[backend] ${d}`));
  ps.on('close', (code) => console.log(`[backend] exited with code ${code}`));
  return ps;
}

function serveStatic(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const type = (
    ext === '.html' ? 'text/html; charset=UTF-8' :
    ext === '.js' ? 'text/javascript; charset=UTF-8' :
    ext === '.css' ? 'text/css; charset=UTF-8' :
    ext === '.json' ? 'application/json; charset=UTF-8' :
    'text/plain; charset=UTF-8'
  );
  fs.readFile(filePath, (err, buf) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': type });
    res.end(buf);
  });
}

function proxyApi(req, res) {
  const target = new URL(`http://localhost:${BACKEND_PORT}${req.url}`);
  const headers = { ...req.headers, host: target.host };
  const proxyReq = http.request({
    protocol: target.protocol,
    hostname: target.hostname,
    port: target.port,
    path: target.pathname + target.search,
    method: req.method,
    headers,
  }, (proxyRes) => {
    res.writeHead(proxyRes.statusCode || 502, proxyRes.headers);
    proxyRes.pipe(res);
  });
  proxyReq.on('error', (e) => {
    res.writeHead(502);
    res.end(`Proxy error: ${e.message}`);
  });
  req.pipe(proxyReq);
}

async function main() {
  await ensureBackendDeps();
  const backend = startBackend();

  if (!exists(WEB_DIR)) fs.mkdirSync(WEB_DIR, { recursive: true });
  const indexHtml = path.join(WEB_DIR, 'index.html');
  if (!exists(indexHtml)) {
    fs.writeFileSync(indexHtml, `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Miner Game - H5 Demo</title>
  <script src="https://cdn.socket.io/4.7.5/socket.io.min.js"></script>
  <style>
    body { background:#0b1020; color:#fff; font-family: system-ui, sans-serif; }
    .card { max-width: 420px; margin: 16px auto; padding: 16px; border-radius: 16px;
            background: linear-gradient(135deg, rgba(123,44,245,.25), rgba(44,137,245,.25));
            box-shadow:0 8px 20px rgba(0,0,0,.35), 0 0 12px rgba(123,44,245,.7); backdrop-filter: blur(10px); }
    input, button { width: 100%; padding: 10px; border-radius: 12px; border: none; margin: 6px 0; }
    button { color:#fff; background:linear-gradient(135deg,#7B2CF5,#2C89F5); box-shadow:0 8px 20px rgba(0,0,0,.35),0 0 12px #7B2CF5; cursor:pointer; }
    .row { display:flex; justify-content: space-between; }
    .bar { height:10px; border-radius:999px; background:rgba(255,255,255,.12); overflow:hidden }
    .fill { height:100%; width:0%; background:linear-gradient(90deg,#7B2CF5,#2C89F5); box-shadow:0 0 10px #7B2CF5; transition: width .3s ease; }
  </style>
  <script>
    const API_BASE = '/api';
    const WS_ENDPOINT = 'http://localhost:${BACKEND_PORT}/game';
    let token = null;

    async function api(path, options={}){
      const headers = Object.assign({'Content-Type':'application/json'}, options.headers||{});
      if (token) headers['Authorization'] = 'Bearer ' + token;
      const res = await fetch(API_BASE + path, Object.assign({}, options, { headers }));
      const json = await res.json().catch(()=>({}));
      if (!res.ok || (json && json.code >= 400)) throw new Error((json && json.message) || 'Request error');
      return json.data;
    }

    async function loginOrRegister(u, p){
      try {
        const r = await api('/auth/login', { method:'POST', body: JSON.stringify({username:u, password:p}) });
        token = r.access_token;
      } catch {
        const r = await api('/auth/register', { method:'POST', body: JSON.stringify({username:u, password:p}) });
        token = r.access_token;
      }
      const prof = await api('/user/profile');
      document.getElementById('ore').textContent = String(prof.oreAmount);
      document.getElementById('coin').textContent = String(prof.bbCoins);
      bindRealtime();
    }

    function bindRealtime(){
      if (!window.io || !token) return;
      const socket = io(WS_ENDPOINT, { auth: { token } });
      socket.on('mine.update', msg => {
        const amt = msg.cartAmount, cap = msg.cartCapacity;
        const pct = Math.min(1, (cap? amt/cap : 0));
        document.getElementById('fill').style.width = Math.round(pct*100)+'%';
        document.getElementById('percent').textContent = Math.round(pct*100)+'%';
      });
      socket.on('mine.collapse', msg => {
        console.log('mine.collapse', msg);
      });
      socket.on('plunder.attacked', msg => {
        const box = document.getElementById('events');
        const line = document.createElement('div');
        line.textContent = '被掠夺：' + JSON.stringify(msg);
        box.prepend(line);
      });
    }

    async function startMining(){
      await api('/mine/start', { method:'POST' });
      const cart = await api('/mine/cart');
      const pct = Math.min(1, (cart.cartAmount||0) / (cart.cartCapacity||1));
      document.getElementById('fill').style.width = Math.round(pct*100)+'%';
      document.getElementById('percent').textContent = Math.round(pct*100)+'%';
    }
    async function collect(){
      const r = await api('/mine/collect', { method:'POST' });
      const p = await api('/user/profile');
      document.getElementById('ore').textContent = String(p.oreAmount);
      document.getElementById('coin').textContent = String(p.bbCoins);
    }

    window.addEventListener('DOMContentLoaded', ()=>{
      document.getElementById('go').onclick = ()=>{
        const u = document.getElementById('u').value || 'user';
        const p = document.getElementById('p').value || 'password';
        loginOrRegister(u, p);
      };
      document.getElementById('start').onclick = ()=> startMining();
      document.getElementById('collect').onclick = ()=> collect();
    });
  </script>
</head>
<body>
  <div class="card">
    <h2 style="margin:0 0 8px">登录 / 注册</h2>
    <input id="u" placeholder="用户名" />
    <input id="p" placeholder="密码" type="password" />
    <button id="go">进入</button>
  </div>
  <div class="card">
    <div class="row"><span>💎 矿石</span><strong id="ore">0</strong></div>
    <div class="row"><span>🪙 BB币</span><strong id="coin">0</strong></div>
  </div>
  <div class="card">
    <div style="opacity:.9;margin-bottom:8px;">⛏️ 挖矿</div>
    <div class="bar"><div id="fill" class="fill"></div></div>
    <div class="row" style="align-items:center;margin:8px 0 12px"><span>矿车</span><strong id="percent">0%</strong></div>
    <div class="row" style="gap:8px">
      <button id="start">开始挖矿</button>
      <button id="collect">收矿</button>
    </div>
  </div>
  <div class="card">
    <div>事件</div>
    <div id="events" style="font-family:monospace; font-size:12px; opacity:.9"></div>
  </div>
</body>
</html>`);
    console.log('[dev] Created web/index.html');
  }

  const server = http.createServer((req, res) => {
    const url = req.url || '/';
    if (url.startsWith('/api/')) {
      return proxyApi(req, res);
    }
    // static
    let filePath = path.join(WEB_DIR, decodeURIComponent(url.split('?')[0]));
    if (filePath.endsWith('/')) filePath = path.join(filePath, 'index.html');
    if (!exists(filePath)) filePath = path.join(WEB_DIR, 'index.html');
    serveStatic(res, filePath);
  });

  server.listen(FRONT_PORT, () => {
    console.log(`\n[dev] Frontend: http://localhost:${FRONT_PORT}`);
    console.log(`[dev] API Proxy: http://localhost:${FRONT_PORT}/api -> http://localhost:${BACKEND_PORT}/api`);
    console.log(`[dev] WS Direct: ${'http://localhost:'+BACKEND_PORT+'/game'}`);
  });

  const onExit = () => {
    try { backend.kill(); } catch {}
    process.exit(0);
  };
  process.on('SIGINT', onExit);
  process.on('SIGTERM', onExit);
}

main().catch(err => { console.error(err); process.exit(1); });
