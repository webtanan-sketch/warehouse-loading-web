const code = String.raw`
(() => {
  const JP = 'https://fujgwahltvbigyftpfjz.supabase.co/functions/v1/warehouse-jsonp';
  const prefersDark = !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const initialTheme = localStorage.getItem('warehouse_theme') || (prefersDark ? 'dark' : 'light');
  document.documentElement.lang = 'fa';
  document.documentElement.dir = 'rtl';
  document.documentElement.setAttribute('data-theme', initialTheme);

  const ICONS = {
    brand: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3" fill="currentColor" opacity=".16"></rect><path d="M7 9.5h10M7 14.5h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path><path d="M17 8v8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg>',
    sun: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2" fill="currentColor"></circle><path d="M12 2.5v2.2M12 19.3v2.2M4.7 4.7l1.6 1.6M17.7 17.7l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.7 19.3l1.6-1.6M17.7 6.3l1.6-1.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"></path></svg>',
    moon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 14.8A8.5 8.5 0 0 1 9.2 5a8.7 8.7 0 1 0 9.8 9.8Z" fill="currentColor"></path></svg>',
    logout: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 7l5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M19 12H9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path><path d="M11 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg>',
    login: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="10" width="16" height="10" rx="3" fill="currentColor" opacity=".18"></rect><path d="M8 10V8a4 4 0 0 1 8 0v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path><circle cx="12" cy="15" r="1.25" fill="currentColor"></circle></svg>',
    total: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" fill="currentColor" opacity=".16"></circle><path d="M9 9.5c0-1 1-2 3-2s3 1 3 2-1 1.7-3 2c-2 .3-3 1-3 2.2 0 1.1 1.1 2 3 2s3-1 3-2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path><path d="M12 6.8v10.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg>',
    paid: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="currentColor" opacity=".16"></circle><path d="m8.2 12.2 2.5 2.5 5.1-5.4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
    remain: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="currentColor" opacity=".16"></circle><path d="M12 7v5l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
    receipt: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h10a2 2 0 0 1 2 2v15l-2.5-1.7L14 20l-2.5-1.7L9 20l-2.5-1.7L4 20V5a2 2 0 0 1 2-2Z" fill="currentColor" opacity=".16"></path><path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg>',
    workers: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="9" r="3" fill="currentColor" opacity=".22"></circle><circle cx="16.5" cy="10" r="2.5" fill="currentColor" opacity=".14"></circle><path d="M4 18c.8-2.3 2.9-3.5 5-3.5s4.2 1.2 5 3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path><path d="M13.5 17.5c.5-1.6 1.9-2.4 3.4-2.4 1.1 0 2.2.4 3.1 1.3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"></path></svg>',
    plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></svg>',
    archive: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16v3H4z" fill="currentColor" opacity=".18"></path><path d="M6.5 10.5h11V18a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2z" fill="currentColor" opacity=".12"></path><path d="M9.5 13.5h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg>',
    refresh: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 7v4h-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M19 11a7 7 0 1 0 1.3 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg>',
    excel: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="4" width="14" height="16" rx="2.5" fill="currentColor" opacity=".16"></rect><path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg>',
    print: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="3.5" width="10" height="5" rx="1.5" fill="currentColor" opacity=".16"></rect><rect x="6" y="14" width="12" height="6.5" rx="1.5" fill="currentColor" opacity=".12"></rect><path d="M6 10h12a2 2 0 0 1 2 2v2H4v-2a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.8"></path><circle cx="17" cy="12" r=".9" fill="currentColor"></circle></svg>',
    pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s6-3.8 6-10V5.8L12 3 6 5.8V11c0 6.2 6 10 6 10Z" fill="currentColor" opacity=".16"></path><path d="M10.7 12.2 12 13.5l2.6-2.8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
    manager: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.2 4.5 5 .7-3.6 3.5.8 5-4.4-2.4-4.4 2.4.8-5L4.8 8.2l5-.7L12 3Z" fill="currentColor" opacity=".18"></path><circle cx="12" cy="10.7" r="1.7" fill="currentColor"></circle></svg>',
    user: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="9" r="3" fill="currentColor" opacity=".2"></circle><path d="M6 18c1-2.6 3.4-4 6-4s5 1.4 6 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg>',
    save: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h10l3 3v13H5V5a1 1 0 0 1 1-1Z" fill="currentColor" opacity=".16"></path><path d="M8 4h7v4H8z" stroke="currentColor" stroke-width="1.6"></path><path d="M8 15h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg>'
  };

  const css = '*{box-sizing:border-box}html,body{margin:0;padding:0}body{font-family:Tahoma,Arial,sans-serif;background:var(--bg);color:var(--text);line-height:1.5;-webkit-tap-highlight-color:transparent;transition:background .22s,color .22s}a{text-decoration:none;color:inherit}:root{--bg:#eef4f7;--card:#ffffff;--card-2:#f7fbfd;--text:#0f1e2d;--muted:#4a5c6f;--line:#c6d5df;--line-strong:#8aa2b1;--primary:#0f5f8c;--primary-2:#0b4a6c;--accent:#0d7b6c;--danger:#b2413f;--warning:#b25b00;--shadow:0 8px 28px rgba(17,45,78,.08)}[data-theme=dark]{--bg:#0b1420;--card:#122133;--card-2:#17283d;--text:#eef6ff;--muted:#b4c2d0;--line:#28425a;--line-strong:#486583;--primary:#57b7ff;--primary-2:#2491dc;--accent:#47c6ad;--danger:#ff857d;--warning:#ffb14d;--shadow:0 10px 30px rgba(0,0,0,.26)}.top{position:sticky;top:0;z-index:15;background:linear-gradient(135deg,var(--primary-2),var(--primary));color:#fff;box-shadow:var(--shadow)}.top-inner{max-width:980px;margin:0 auto;padding:14px 12px;display:flex;align-items:center;justify-content:space-between;gap:10px}.brand{display:flex;align-items:center;gap:10px;min-width:0}.brand-badge{width:44px;height:44px;border-radius:14px;display:grid;place-items:center;background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.26)}.brand-badge svg,.icon svg{width:24px;height:24px;display:block}.brand-text h1{margin:0;font-size:18px;line-height:1.2}.brand-text p{margin:2px 0 0;font-size:12px;color:rgba(255,255,255,.88)}.header-actions{display:flex;gap:8px;align-items:center}.icon-btn,.ghost-btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;border-radius:14px;border:1px solid rgba(255,255,255,.22);background:rgba(255,255,255,.10);color:#fff;padding:10px 12px;min-height:44px;font-weight:700}.icon-btn svg,.ghost-btn svg{width:20px;height:20px}.wrap{max-width:980px;margin:0 auto;padding:12px}.card{background:var(--card);border:1px solid var(--line);border-radius:20px;padding:14px;box-shadow:var(--shadow);margin-bottom:12px}.login-card{max-width:430px;margin:18px auto}.section-title{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px}.section-title .t{display:flex;align-items:center;gap:10px;font-weight:800;font-size:18px}.section-title .t .icon{width:38px;height:38px;border-radius:12px;background:var(--card-2);display:grid;place-items:center;color:var(--primary)}.subtle{color:var(--muted);font-size:12px}.msg{background:#fff7d8;color:#764c00;border:1px solid #f3d791;padding:12px 14px;border-radius:16px;margin-bottom:12px;font-weight:700}.hide{display:none!important}.pill{display:inline-flex;align-items:center;gap:6px;border-radius:999px;padding:8px 10px;background:var(--card-2);border:1px solid var(--line);color:var(--text);font-size:12px;font-weight:700}.pill.manager{color:var(--primary)}.pill.worker{color:var(--accent)}.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:10px}.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.stat{background:var(--card-2);border:1px solid var(--line);border-radius:18px;padding:12px}.stat-top{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px}.stat .label{font-size:12px;color:var(--muted);font-weight:700}.stat .val{font-size:20px;font-weight:900;letter-spacing:-.3px}.stat .mini{font-size:11px;color:var(--muted)}label{display:block;margin:0 0 6px;font-size:12px;font-weight:800;color:var(--muted)}.field,select,textarea,button{width:100%;font:inherit;border-radius:16px;min-height:48px;border:1px solid var(--line-strong);background:var(--card);color:var(--text);padding:12px 14px;outline:none;transition:border-color .18s,box-shadow .18s,transform .02s}input::placeholder,textarea::placeholder{color:var(--muted)}.field:focus,select:focus,textarea:focus{border-color:var(--primary);box-shadow:0 0 0 4px color-mix(in srgb, var(--primary) 18%, transparent)}textarea{min-height:88px;resize:vertical}button{background:var(--primary);color:#fff;border-color:var(--primary);font-weight:800}.btn-row{display:flex;gap:8px;flex-wrap:wrap}.btn-row>*{flex:1;min-width:130px}.btn-secondary{background:var(--card-2);color:var(--primary);border-color:var(--line-strong)}.btn-success{background:var(--accent);border-color:var(--accent)}.btn-danger{background:var(--danger);border-color:var(--danger)}.btn-quiet{background:transparent;color:var(--text);border-color:var(--line)}.button-inline{display:inline-flex;align-items:center;justify-content:center;gap:7px}.button-inline svg{width:19px;height:19px}.login-box{display:grid;gap:12px}.pin-field{text-align:center;font-size:28px;font-weight:900;letter-spacing:10px}.input-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.worker-area{display:grid;gap:8px;margin:10px 0}.worker-line{display:grid;grid-template-columns:1.25fr .9fr 48px;gap:8px;align-items:center;padding:10px;border:1px solid var(--line);border-radius:16px;background:var(--card-2)}.worker-line .mini-kill{min-height:46px;padding:0;border-radius:14px}.list{display:grid;gap:10px}.stage{background:var(--card-2);border:1px solid var(--line);border-radius:18px;padding:12px}.stage-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.stage h4{margin:0 0 6px;font-size:15px}.stage .meta{font-size:12px;color:var(--muted);margin-bottom:8px}.stage .amount{font-size:18px;font-weight:900}.stage .tags{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}.tag{display:inline-flex;align-items:center;padding:4px 8px;border-radius:999px;background:#fff2df;color:#8d5200;font-size:11px;font-weight:800;border:1px solid rgba(141,82,0,.12)}.tag.ok{background:#e7fbf3;color:#166f4c}.empty{padding:18px;text-align:center;color:var(--muted);font-weight:700;border:1px dashed var(--line);border-radius:16px}.toolbar{display:flex;gap:8px;flex-wrap:wrap}.toolbar>*{flex:1;min-width:110px}.sheet-note{padding:10px 12px;background:var(--card-2);border-radius:14px;border:1px dashed var(--line);font-size:12px;color:var(--muted);margin-top:10px}.footer-space{height:8px}@media (max-width:720px){.stats{grid-template-columns:1fr}.input-grid,.grid-2{grid-template-columns:1fr}.worker-line{grid-template-columns:1fr}.top-inner{padding:12px 10px}.brand-text h1{font-size:16px}.icon-btn .label-hide{display:none}.wrap{padding:10px}.card{border-radius:18px;padding:12px}.toolbar>*{min-width:100%}.btn-row>*{min-width:100%}}';

  const st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  document.body.innerHTML =
    '<div class="top"><div class="top-inner">' +
      '<div class="brand">' +
        '<div class="brand-badge">' + ICONS.brand + '</div>' +
        '<div class="brand-text"><h1>مدیریت بارگیری و دستمزد</h1><p>نسخه وب ساده، سریع و مناسب انبار</p></div>' +
      '</div>' +
      '<div class="header-actions">' +
        '<button id="themeToggle" class="icon-btn" type="button"></button>' +
      '</div>' +
    '</div></div>' +
    '<div class="wrap">' +
      '<div id="message"></div>' +
      '<div id="login" class="card login-card">' +
        '<div class="section-title"><div class="t"><span class="icon">' + ICONS.login + '</span><span>ورود با PIN</span></div></div>' +
        '<div class="subtle" style="margin-bottom:10px">فقط رمز چهاررقمی را وارد کنید. ظاهر صفحه برای نور روز و شب بهینه شده است.</div>' +
        '<div class="login-box">' +
          '<input id="loginPin" class="field pin-field" type="password" inputmode="numeric" maxlength="4" placeholder="••••">' +
          '<button id="loginBtn" class="button-inline" type="button">' + ICONS.login + '<span>ورود به برنامه</span></button>' +
        '</div>' +
      '</div>' +
      '<div id="app" class="hide">' +
        '<div class="card">' +
          '<div class="section-title" style="margin-bottom:2px"><div class="t"><span class="icon" id="userRoleIcon"></span><span id="who"></span></div><button id="logoutBtn" class="btn-secondary button-inline" type="button" style="width:auto;min-width:110px">' + ICONS.logout + '<span>خروج</span></button></div>' +
          '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap"><span id="rolePill" class="pill"></span><span class="subtle">همه مقادیر به تومان ثبت می‌شوند.</span></div>' +
        '</div>' +
        '<div class="stats">' +
          '<div class="stat"><div class="stat-top"><span class="label">جمع کل</span><span class="icon" style="color:var(--primary)">' + ICONS.total + '</span></div><div id="sTotal" class="val">۰ تومان</div><div class="mini">همه بارگیری‌های قابل مشاهده</div></div>' +
          '<div class="stat"><div class="stat-top"><span class="label">تسویه‌شده</span><span class="icon" style="color:var(--accent)">' + ICONS.paid + '</span></div><div id="sSettled" class="val">۰ تومان</div><div class="mini">ثبت‌های پرداخت‌شده</div></div>' +
          '<div class="stat"><div class="stat-top"><span class="label">مانده</span><span class="icon" style="color:var(--warning)">' + ICONS.remain + '</span></div><div id="sUnsettled" class="val">۰ تومان</div><div class="mini">ثبت‌های تسویه‌نشده</div></div>' +
        '</div>' +
        '<div class="card">' +
          '<div class="section-title"><div class="t"><span class="icon">' + ICONS.receipt + '</span><span>ثبت بارگیری</span></div></div>' +
          '<div class="input-grid">' +
            '<div><label for="invoiceNo">شماره فاکتور</label><input id="invoiceNo" class="field" placeholder="مثلاً 1258"></div>' +
            '<div><label for="customer">نام صاحب فاکتور</label><input id="customer" class="field" placeholder="نام مشتری یا صاحب بار"></div>' +
          '</div>' +
          '<div class="worker-area"><label>کارگرها و مبلغ هر نفر</label><div id="workerRows"></div></div>' +
          '<div class="btn-row">' +
            '<button id="addWorkerBtn" type="button" class="btn-secondary button-inline">' + ICONS.plus + '<span>افزودن کارگر</span></button>' +
            '<button id="archiveBtn" type="button" class="btn-quiet button-inline">' + ICONS.archive + '<span>بایگانی برگه جاری</span></button>' +
          '</div>' +
          '<div style="margin-top:10px"><label for="notes">توضیحات</label><textarea id="notes" placeholder="اختیاری: توضیح بارگیری، محل تحویل یا یادداشت مدیر"></textarea></div>' +
          '<div class="btn-row" style="margin-top:10px"><button id="registerBtn" type="button" class="btn-success button-inline">' + ICONS.save + '<span>ثبت مرحله بارگیری</span></button></div>' +
          '<div class="sheet-note">اگر همان شماره فاکتور دوباره وارد شود، به همان فاکتور وصل می‌شود و مرحله جدید می‌سازد؛ فاکتور جدید تکراری ایجاد نمی‌شود.</div>' +
        '</div>' +
        '<div id="managerTools" class="card hide">' +
          '<div class="section-title"><div class="t"><span class="icon">' + ICONS.workers + '</span><span>مدیریت کارگرها</span></div></div>' +
          '<div class="input-grid">' +
            '<div><label for="newWorker">نام کارگر</label><input id="newWorker" class="field" placeholder="مثلاً علی"></div>' +
            '<div><label for="newPin">PIN چهاررقمی</label><input id="newPin" class="field" type="password" inputmode="numeric" maxlength="4" placeholder="مثلاً 4567"></div>' +
          '</div>' +
          '<div class="btn-row" style="margin-top:10px"><button id="createWorkerBtn" type="button" class="button-inline">' + ICONS.workers + '<span>ساخت حساب کارگر</span></button></div>' +
        '</div>' +
        '<div class="card">' +
          '<div class="section-title"><div class="t"><span class="icon">' + ICONS.receipt + '</span><span>آخرین ثبت‌ها</span></div></div>' +
          '<div class="toolbar" style="margin-bottom:10px">' +
            '<button id="refreshBtn" type="button" class="btn-secondary button-inline">' + ICONS.refresh + '<span>به‌روزرسانی</span></button>' +
            '<button id="csvBtn" type="button" class="btn-secondary button-inline">' + ICONS.excel + '<span>Excel / CSV</span></button>' +
            '<button id="printBtn" type="button" class="btn-secondary button-inline">' + ICONS.print + '<span>چاپ / PDF</span></button>' +
          '</div>' +
          '<div id="stages" class="list"></div>' +
        '</div>' +
        '<div class="card">' +
          '<div class="section-title"><div class="t"><span class="icon">' + ICONS.pin + '</span><span>تغییر PIN من</span></div></div>' +
          '<div class="grid-2">' +
            '<div><label for="newMyPin">PIN جدید</label><input id="newMyPin" class="field" type="password" inputmode="numeric" maxlength="4" placeholder="PIN جدید چهاررقمی"></div>' +
            '<div style="display:flex;align-items:end"><button id="changePinBtn" type="button" class="button-inline">' + ICONS.pin + '<span>ثبت PIN جدید</span></button></div>' +
          '</div>' +
        '</div>' +
        '<div class="footer-space"></div>' +
      '</div>' +
    '</div>';

  const $ = id => document.getElementById(id);
  const fa = n => Number(n || 0).toLocaleString('fa-IR');
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  let token = localStorage.getItem('warehouse_token') || '';
  let me = null;
  let workers = [];
  let last = [];

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('warehouse_theme', theme);
    updateThemeButton();
  }
  function updateThemeButton() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    $('themeToggle').innerHTML = (current === 'dark' ? ICONS.sun : ICONS.moon) + '<span class="label-hide">' + (current === 'dark' ? 'حالت روز' : 'حالت شب') + '</span>';
    $('themeToggle').title = current === 'dark' ? 'تغییر به حالت روز' : 'تغییر به حالت شب';
    $('themeToggle').dataset.nextTheme = next;
  }
  function msg(t) {
    $('message').innerHTML = '<div class="msg">' + esc(t) + '</div>';
    setTimeout(() => { $('message').innerHTML = ''; }, 4200);
  }

  function call(action, data = {}, auth = true) {
    return new Promise((resolve, reject) => {
      let cb = 'w' + Date.now() + Math.random().toString(36).slice(2);
      let s = document.createElement('script');
      let done = 0;
      const clean = () => {
        if (done) return;
        done = 1;
        try { delete window[cb]; } catch (_) {}
        s.remove();
      };
      window[cb] = j => {
        clean();
        Number(j && j.__status) >= 400 ? reject(new Error(j.error || 'خطا')) : resolve(j);
      };
      s.onerror = () => { clean(); reject(new Error('ارتباط با سرور برقرار نشد')); };
      let p = new URLSearchParams({ cb, action, payload: JSON.stringify(data) });
      if (auth && token) p.set('token', token);
      s.src = JP + '?' + p.toString();
      document.body.appendChild(s);
      setTimeout(() => { if (!done) { clean(); reject(new Error('پاسخ سرور دیر رسید')); } }, 15000);
    });
  }

  function roleInfo() {
    if (!me) return { label: '', cls: '', icon: '' };
    return me.role === 'manager'
      ? { label: 'مدیر سیستم', cls: 'manager', icon: ICONS.manager }
      : { label: 'کارگر انبار', cls: 'worker', icon: ICONS.user };
  }

  function showApp() {
    $('login').classList.add('hide');
    $('app').classList.remove('hide');
    $('who').textContent = me.name;
    const r = roleInfo();
    $('rolePill').className = 'pill ' + r.cls;
    $('rolePill').innerHTML = r.icon + '<span>' + r.label + '</span>';
    $('userRoleIcon').innerHTML = r.icon;
    $('managerTools').classList.toggle('hide', me.role !== 'manager');
  }

  async function loginNow() {
    try {
      let pin = $('loginPin').value.trim();
      if (!/^\d{4}$/.test(pin)) throw new Error('PIN چهار رقمی را کامل وارد کنید');
      $('loginBtn').disabled = true;
      const j = await call('login', { pin }, false);
      token = j.token;
      me = j.user;
      localStorage.setItem('warehouse_token', token);
      $('loginPin').value = '';
      showApp();
      await init();
    } catch (e) {
      msg(e.message || 'خطا در ورود');
    } finally {
      $('loginBtn').disabled = false;
    }
  }

  function addRow(sel = '') {
    const isWorker = me && me.role === 'worker';
    const options = workers
      .filter(w => w.role === 'worker')
      .map(w => '<option value="' + w.id + '" ' + (w.id === sel ? 'selected' : '') + '>' + esc(w.display_name) + '</option>')
      .join('');
    const d = document.createElement('div');
    d.className = 'worker-line';
    d.innerHTML =
      '<select class="wsel" ' + (isWorker ? 'disabled' : '') + '>' + options + '</select>' +
      '<input class="field wamt" inputmode="numeric" placeholder="مبلغ تومان">' +
      '<button type="button" class="btn-danger mini-kill">×</button>';
    const btn = d.querySelector('button');
    btn.onclick = () => d.remove();
    if (isWorker && $('workerRows').children.length === 0) btn.style.visibility = 'hidden';
    $('workerRows').appendChild(d);
  }

  async function init() {
    workers = (await call('list_workers')).workers || [];
    $('workerRows').innerHTML = '';
    addRow(me.role === 'worker' ? me.id : '');
    await refresh();
  }

  function stageCard(x) {
    const invoiceNo = x.invoice && x.invoice.invoice_no ? x.invoice.invoice_no : '';
    const customer = x.invoice && x.invoice.customer_name ? x.invoice.customer_name : '';
    const settled = !!x.settled_at;
    return '<div class="stage">' +
      '<div class="stage-top">' +
        '<div>' +
          '<h4>فاکتور ' + esc(invoiceNo) + ' — ' + esc(customer) + '</h4>' +
          '<div class="meta">مرحله ' + x.stage_no + ' · ' + new Date(x.created_at).toLocaleString('fa-IR') + '</div>' +
          '<div class="amount">' + fa(x.amount_total) + ' تومان</div>' +
          '<div class="tags">' +
            (settled ? '<span class="tag ok">تسویه شده</span>' : '<span class="tag">تسویه نشده</span>') +
            (x.creator && x.creator.display_name ? '<span class="tag">ثبت: ' + esc(x.creator.display_name) + '</span>' : '') +
          '</div>' +
        '</div>' +
        (me.role === 'manager' && !settled ? '<button type="button" class="button-inline settle" data-id="' + x.id + '" style="width:auto;min-width:112px">' + ICONS.paid + '<span>تسویه</span></button>' : '') +
      '</div>' +
    '</div>';
  }

  async function refresh() {
    try {
      const j = await call('dashboard');
      $('sTotal').textContent = fa(j.summary.total) + ' تومان';
      $('sSettled').textContent = fa(j.summary.settled) + ' تومان';
      $('sUnsettled').textContent = fa(j.summary.unsettled) + ' تومان';
      last = j.stages || [];
      $('stages').innerHTML = last.length ? last.map(stageCard).join('') : '<div class="empty">هنوز ثبتی وجود ندارد.</div>';
      document.querySelectorAll('.settle').forEach(btn => btn.onclick = async () => {
        try {
          await call('settle_stage', { stage_id: btn.dataset.id });
          msg('تسویه ثبت شد');
          refresh();
        } catch (e) { msg(e.message); }
      });
    } catch (e) {
      msg(e.message || 'خطا در دریافت اطلاعات');
    }
  }

  $('themeToggle').onclick = () => setTheme($('themeToggle').dataset.nextTheme || 'dark');
  $('loginBtn').onclick = loginNow;
  $('loginPin').onkeydown = e => { if (e.key === 'Enter') loginNow(); };
  $('logoutBtn').onclick = () => { localStorage.removeItem('warehouse_token'); location.reload(); };
  $('addWorkerBtn').onclick = () => addRow(me && me.role === 'worker' ? me.id : '');
  $('refreshBtn').onclick = refresh;
  $('registerBtn').onclick = async () => {
    try {
      const ws = [...document.querySelectorAll('.worker-line')]
        .map(r => ({
          worker_id: r.querySelector('.wsel').value,
          amount: Number((r.querySelector('.wamt').value || '0').replace(/,/g, ''))
        }))
        .filter(x => x.worker_id && x.amount > 0);
      const j = await call('register_stage', {
        invoice_no: $('invoiceNo').value.trim(),
        customer_name: $('customer').value.trim(),
        workers: ws,
        notes: $('notes').value.trim()
      });
      msg('مرحله بارگیری با موفقیت ثبت شد — مرحله ' + j.stage_no);
      $('invoiceNo').value = '';
      $('customer').value = '';
      $('notes').value = '';
      $('workerRows').innerHTML = '';
      addRow(me.role === 'worker' ? me.id : '');
      refresh();
    } catch (e) { msg(e.message || 'خطا در ثبت'); }
  };
  $('createWorkerBtn').onclick = async () => {
    try {
      await call('create_worker', { name: $('newWorker').value.trim(), pin: $('newPin').value.trim() });
      msg('حساب کارگر ساخته شد');
      $('newWorker').value = '';
      $('newPin').value = '';
      workers = (await call('list_workers')).workers || [];
      $('workerRows').innerHTML = '';
      addRow();
    } catch (e) { msg(e.message || 'خطا در ساخت کارگر'); }
  };
  $('archiveBtn').onclick = async () => {
    if (!confirm('برگه جاری بایگانی شود؟')) return;
    try { await call('archive_sheet'); msg('برگه بایگانی شد'); } catch (e) { msg(e.message); }
  };
  $('changePinBtn').onclick = async () => {
    try {
      await call('change_pin', { pin: $('newMyPin').value.trim() });
      $('newMyPin').value = '';
      msg('PIN با موفقیت تغییر کرد');
    } catch (e) { msg(e.message || 'خطا در تغییر PIN'); }
  };
  $('printBtn').onclick = () => print();
  $('csvBtn').onclick = () => {
    const rows = [['فاکتور', 'مشتری', 'مرحله', 'مبلغ', 'وضعیت'], ...last.map(x => [x.invoice && x.invoice.invoice_no || '', x.invoice && x.invoice.customer_name || '', x.stage_no, x.amount_total, x.settled_at ? 'تسویه شده' : 'تسویه نشده'])];
    const csv = '\ufeff' + rows.map(r => r.map(v => '"' + String(v).replaceAll('"', '""') + '"').join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'گزارش-بارگیری.csv';
    a.click();
  };

  updateThemeButton();
  if (token) {
    call('me').then(j => {
      me = j.user;
      showApp();
      init();
    }).catch(() => {
      localStorage.removeItem('warehouse_token');
      token = '';
    });
  }
})();`;

Deno.serve(() => new Response(code, {
  headers: {
    'content-type': 'application/javascript; charset=utf-8',
    'cache-control': 'no-store',
    'access-control-allow-origin': '*'
  }
}));