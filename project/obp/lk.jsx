// ОБП ЛК — вход, каркас кабинета, главная (дашборд), QR
const { useState: useLkState, useEffect: useLkEffect, useRef: useLkRef } = React;
const LKD = window.OBP_LK;

/* ---------- Мини-иконки (простые штрихи) ---------- */
function LkIcon({ name, size = 19 }) {
  const s = { width: size, height: size, fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };
  if (name === "home") return (<svg {...s} viewBox="0 0 20 20"><path d="M3.5 9.5 10 3.5l6.5 6v7h-13v-7Z"></path><path d="M8 16.5v-4h4v4"></path></svg>);
  if (name === "lab") return (<svg {...s} viewBox="0 0 20 20"><path d="M8 3h4M9 3v5.2L4.8 15a2 2 0 0 0 1.7 3h7a2 2 0 0 0 1.7-3L11 8.2V3"></path><path d="M6.5 13h7"></path></svg>);
  if (name === "cal") return (<svg {...s} viewBox="0 0 20 20"><rect x="3" y="4.5" width="14" height="12.5" rx="2.5"></rect><path d="M3 8.5h14M7 3v3M13 3v3"></path></svg>);
  if (name === "qr") return (<svg {...s} viewBox="0 0 20 20"><rect x="3" y="3" width="5.5" height="5.5" rx="1"></rect><rect x="11.5" y="3" width="5.5" height="5.5" rx="1"></rect><rect x="3" y="11.5" width="5.5" height="5.5" rx="1"></rect><path d="M11.5 11.5h2.5v2.5h-2.5zM14.5 14.5H17V17h-2.5z"></path></svg>);
  if (name === "user") return (<svg {...s} viewBox="0 0 20 20"><circle cx="10" cy="7" r="3.2"></circle><path d="M4 17c.8-3 3.2-4.4 6-4.4S15.2 14 16 17"></path></svg>);
  if (name === "out") return (<svg {...s} viewBox="0 0 20 20"><path d="M12.5 6.5V4.8a1.8 1.8 0 0 0-1.8-1.8H5.3a1.8 1.8 0 0 0-1.8 1.8v10.4a1.8 1.8 0 0 0 1.8 1.8h5.4a1.8 1.8 0 0 0 1.8-1.8v-1.7M8.5 10h8M14 7.5l2.5 2.5L14 12.5"></path></svg>);
  if (name === "car") return (<svg {...s} viewBox="0 0 20 20"><path d="M4 12.5 5.3 8a2 2 0 0 1 1.9-1.5h5.6A2 2 0 0 1 14.7 8l1.3 4.5"></path><rect x="3" y="12.5" width="14" height="3.5" rx="1.2"></rect><path d="M5.5 16v1.5M14.5 16v1.5"></path></svg>);
  if (name === "doc") return (<svg {...s} viewBox="0 0 20 20"><path d="M5 3h7l3 3v11H5V3Z"></path><path d="M12 3v3h3M7.5 10h5M7.5 13h5"></path></svg>);
  if (name === "bed") return (<svg {...s} viewBox="0 0 20 20"><path d="M3 5v10M3 13h14v3M3 10.5h14V13"></path><circle cx="6.5" cy="8" r="1.6"></circle><path d="M9.5 10.5V8.5h5a2.5 2.5 0 0 1 2.5 2"></path></svg>);
  if (name === "prog") return (<svg {...s} viewBox="0 0 20 20"><circle cx="10" cy="10" r="7"></circle><path d="M7 10.2l2.1 2.1L13.4 8"></path></svg>);
  if (name === "map") return (<svg {...s} viewBox="0 0 20 20"><path d="M3 5.5 7.5 4l5 1.5L17 4v10.5L12.5 16l-5-1.5L3 16V5.5Z"></path><path d="M7.5 4v10.5M12.5 5.5V16"></path></svg>);
  if (name === "dots") return (<svg {...s} viewBox="0 0 20 20"><circle cx="4.5" cy="10" r="1.4"></circle><circle cx="10" cy="10" r="1.4"></circle><circle cx="15.5" cy="10" r="1.4"></circle></svg>);
  if (name === "bell") return (<svg {...s} viewBox="0 0 20 20"><path d="M10 3a5 5 0 0 0-5 5c0 4-1.5 5.5-1.5 5.5h13S15 12 15 8a5 5 0 0 0-5-5Z"></path><path d="M8.4 16.5a2 2 0 0 0 3.2 0"></path></svg>);
  if (name === "info") return (<svg {...s} viewBox="0 0 20 20"><circle cx="10" cy="10" r="7"></circle><path d="M10 9v4M10 6.6h.01"></path></svg>);
  return null;
}

/* ---------- Псевдо-QR (детерминированный, демо) ---------- */
function QRBox({ code, size = 128 }) {
  const n = 21;
  let h = 0;
  for (let i = 0; i < code.length; i++) h = (h * 31 + code.charCodeAt(i)) >>> 0;
  const rng = () => { h = (h * 1664525 + 1013904223) >>> 0; return h / 4294967296; };
  const cells = [];
  const inFinder = (x, y) => (x < 7 && y < 7) || (x > n - 8 && y < 7) || (x < 7 && y > n - 8);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    if (!inFinder(x, y) && rng() > 0.52) cells.push(<rect key={x + "-" + y} x={x} y={y} width="1" height="1"></rect>);
  }
  const finder = (fx, fy) => (
    <g key={fx + "_" + fy}>
      <rect x={fx} y={fy} width="7" height="7" fill="none" stroke="currentColor" strokeWidth="1"></rect>
      <rect x={fx + 2} y={fy + 2} width="3" height="3"></rect>
    </g>
  );
  return (
    <div style={{ background: "#fff", borderRadius: 14, padding: 10, border: "1px solid var(--line)", width: size, height: size, flex: "none" }}>
      <svg viewBox={"-0.5 -0.5 " + (n + 1) + " " + (n + 1)} width="100%" height="100%" style={{ color: "var(--ink)", fill: "currentColor", display: "block" }}>
        {cells}
        {finder(0, 0)}{finder(n - 7, 0)}{finder(0, n - 7)}
      </svg>
    </div>
  );
}

/* ---------- Вход / забыли пароль ---------- */
function LKLogin({ onLogin, onExit }) {
  const [view, setView] = useLkState("login"); // login | forgot | forgotSent
  const [login, setLogin] = useLkState("");
  const [pass, setPass] = useLkState("");
  const [err, setErr] = useLkState({});

  const submit = () => {
    const e = {};
    if (login.trim().length < 5) e.login = "Укажите телефон или e-mail";
    if (view === "login" && pass.length < 4) e.pass = "Введите пароль";
    setErr(e);
    if (Object.keys(e).length) return;
    if (view === "login") onLogin();
    else setView("forgotSent");
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1.1fr" }} className="two-col">
      <div style={{
        background: "radial-gradient(700px 500px at 20% 110%, rgba(154,123,79,0.25), transparent 60%), var(--navy)",
        color: "#F2EFE8", padding: "56px 64px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 32,
      }} className="login-brand">
        <Logo dark onClick={onExit}></Logo>
        <div style={{ display: "flex", flexDirection: "column", gap: 22, maxWidth: 430, paddingBottom: 40 }}>
          <div className="overline" style={{ color: "#C8A96A" }}>Личный кабинет пациента</div>
          <div className="h-display" style={{ fontSize: "clamp(34px, 3.4vw, 52px)" }}>
            Ваша медицина — в&nbsp;одном окне
          </div>
          <p className="hide-sm" style={{ color: "rgba(242,239,232,0.65)", fontSize: 16.5, lineHeight: 1.6 }}>
            Результаты анализов и исследований, запись к врачам, электронные
            пропуска на территорию — без звонков и ожидания.
          </p>
        </div>
        <div className="small" style={{ color: "rgba(242,239,232,0.4)" }}>ФГБУ «ОБП» Управления делами Президента РФ</div>
      </div>

      <div className="login-pane" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 48 }}>
        <div style={{ width: 400, maxWidth: "100%", display: "flex", flexDirection: "column", gap: 22 }}>
          {view === "forgotSent" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
              <span className="badge badge-ok">Письмо отправлено</span>
              <h2 className="h-2">Проверьте почту</h2>
              <p className="body-soft" style={{ fontSize: 15 }}>
                Мы отправили ссылку для восстановления пароля на <strong>{login || "указанный адрес"}</strong>.
                Ссылка действует 24 часа.
              </p>
              <button className="btn btn-outline btn-sm" onClick={() => setView("login")}>Вернуться ко входу</button>
            </div>
          ) : (
            <React.Fragment>
              <div>
                <h2 className="h-1" style={{ fontSize: 34, marginBottom: 10 }}>
                  {view === "login" ? "Вход в кабинет" : "Восстановление пароля"}
                </h2>
                <p className="body-soft" style={{ fontSize: 15 }}>
                  {view === "login"
                    ? "Используйте телефон или e-mail, указанные при прикреплении."
                    : "Укажите e-mail — пришлём ссылку для сброса пароля."}
                </p>
              </div>
              <div className={"field" + (err.login ? " invalid" : "")}>
                <label>{view === "login" ? "Телефон или e-mail" : "E-mail"}</label>
                <input value={login} placeholder={view === "login" ? "+7 (___) ___-__-__" : "name@example.ru"} onChange={(e) => setLogin(e.target.value)}></input>
                {err.login ? <span className="err">{err.login}</span> : null}
              </div>
              {view === "login" ? (
                <div className={"field" + (err.pass ? " invalid" : "")}>
                  <label style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Пароль</span>
                    <a href="#" onClick={(e) => { e.preventDefault(); setErr({}); setView("forgot"); }} style={{ color: "var(--accent-dark)", fontWeight: 600, textDecoration: "none" }}>Забыли пароль?</a>
                  </label>
                  <input type="password" value={pass} placeholder="••••••••" onChange={(e) => setPass(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()}></input>
                  {err.pass ? <span className="err">{err.pass}</span> : null}
                </div>
              ) : null}
              <button className="btn btn-primary" onClick={submit}>
                {view === "login" ? "Войти" : "Отправить ссылку"}
              </button>
              <div className="small" style={{ textAlign: "center", color: "var(--ink-faint)" }}>
                {view === "login" ? (
                  <span>Нет учётной записи? <strong>Обратитесь в регистратуру</strong> или позвоните 8 (499) 333-30-00</span>
                ) : (
                  <a href="#" onClick={(e) => { e.preventDefault(); setView("login"); }} style={{ color: "var(--accent-dark)", fontWeight: 600 }}>← Вернуться ко входу</a>
                )}
              </div>
              <hr className="divider"></hr>
              <button className="btn btn-outline btn-sm" onClick={onExit} style={{ alignSelf: "center" }}>← На сайт больницы</button>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Каркас кабинета ---------- */
function LK({ exit }) {
  const [auth, setAuth] = useLkState(() => {
    try { return localStorage.getItem("obp_lk_demo_auth") === "1"; } catch (e) { return false; }
  });
  const [tab, setTab] = useLkState("home");
  const [member, setMember] = useLkState("anna");
  const [passes, setPasses] = useLkState(LKD.passes);
  const [notifs, setNotifs] = useLkState(LKD.notifications);
  const [bellOpen, setBellOpen] = useLkState(false);
  const bellBtnRef = useLkRef(null);
  useLkEffect(() => {
    if (!bellOpen) return;
    const onDown = (e) => {
      if (e.target.closest && (e.target.closest(".bell-panel") || e.target.closest('[aria-label="\u0423\u0432\u0435\u0434\u043e\u043c\u043b\u0435\u043d\u0438\u044f"]'))) return;
      setBellOpen(false);
    };
    const onEsc = (e) => { if (e.key === "Escape") setBellOpen(false); };
    document.addEventListener("pointerdown", onDown, true);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("pointerdown", onDown, true);
      document.removeEventListener("keydown", onEsc);
    };
  }, [bellOpen]);
  const [toasts, setToasts] = useLkState([]);
  useLkEffect(() => {
    if (!auth) return;
    const timers = [];
    (LKD.pushes || []).forEach((p, i) => {
      const t = setTimeout(() => {
        const id = "push-" + Date.now() + "-" + i;
        const notif = { id, type: p.type, pinned: p.type === "important", read: false, date: p.date, title: p.title, text: p.text };
        setNotifs((ns) => [notif, ...ns]);
        setToasts((ts) => [{ ...notif, goto: p.goto, toastId: id }, ...ts].slice(0, 3));
        const hide = setTimeout(() => setToasts((ts) => ts.filter((x) => x.toastId !== id)), 6500);
        timers.push(hide);
      }, p.delay);
      timers.push(t);
    });
    return () => timers.forEach(clearTimeout);
  }, [auth]);
  const [appts, setAppts] = useLkState(() => {
    const m = { anna: LKD.appointments };
    LKD.family.forEach((f) => { m[f.id] = f.appointments; });
    return m;
  });

  // Данные текущего пациента (семейный доступ)
  const fam = LKD.family.find((f) => f.id === member);
  const cur = member === "anna"
    ? { id: "anna", rel: "вы", patient: LKD.patient, analyses: LKD.analyses, studies: LKD.studies, visits: LKD.visits, dynamics: LKD.dynamics, hospitalization: LKD.hospitalization, program: LKD.program }
    : { id: fam.id, rel: fam.rel, patient: fam.patient, analyses: fam.analyses, studies: fam.studies, visits: fam.visits, dynamics: fam.dynamics, hospitalization: fam.hospitalization, program: fam.program };
  const appointments = appts[member] || [];

  const doAuth = (v) => {
    setAuth(v);
    try { localStorage.setItem("obp_lk_demo_auth", v ? "1" : "0"); } catch (e) {}
  };

  if (!auth) return (<div className="lk-root"><LKLogin onLogin={() => doAuth(true)} onExit={exit}></LKLogin></div>);

  const unread = notifs.filter((n) => !n.read).length;
  const markRead = (id) => setNotifs((ns) => ns.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const markAllRead = () => setNotifs((ns) => ns.map((n) => ({ ...n, read: true })));
  const dismissToast = (id) => setToasts((ts) => ts.filter((x) => x.toastId !== id));

  const items = [
    { id: "home", icon: "home", label: "Главная" },
    { id: "notifs", icon: "bell", label: "Уведомления", badge: unread },
    { id: "medcard", icon: "doc", label: "Медкарта" },
    { id: "results", icon: "lab", label: "Исследования и анализы" },
    { id: "booking", icon: "cal", label: "Запись на приём" },
    { id: "hospital", icon: "bed", label: "Госпитализация" },
    { id: "program", icon: "prog", label: "Моя программа" },
    { id: "passes", icon: "qr", label: "Пропуска" },
    { id: "map", icon: "map", label: "Карта территории" },
    { id: "profile", icon: "user", label: "Профиль" },
  ];

  const onBooked = (appt) => {
    setAppts((m) => ({ ...m, [member]: [appt, ...(m[member] || [])] }));
    setPasses((p) => [{
      id: "ПР-2026-" + Math.floor(1000 + Math.random() * 9000),
      title: "Пропуск на визит" + (member !== "anna" ? " · " + cur.patient.firstName : ""),
      date: appt.date + " 2026",
      time: appt.time + " – " + appt.timeEnd,
      place: "Главный корпус · Мичуринский пр-т, 6",
      status: "Действует",
      car: null,
    }, ...p]);
  };

  const onCancel = (apptId) => {
    setAppts((m) => ({ ...m, [member]: (m[member] || []).filter((a) => a.id !== apptId) }));
  };

  const onUpdate = (apptId, fields) => {
    setAppts((m) => ({ ...m, [member]: (m[member] || []).map((a) => (a.id === apptId ? { ...a, ...fields } : a)) }));
  };

  const addCar = (passId, car) => {
    setPasses((ps) => ps.map((p) => (p.id === passId ? { ...p, car } : p)));
  };

  let panel = null;
  if (tab === "home") panel = <LKHome go={setTab} cur={cur} passes={passes} appointments={appointments} notifs={notifs}></LKHome>;
  else if (tab === "notifs") panel = <LKNotifications notifs={notifs} markRead={markRead} markAllRead={markAllRead}></LKNotifications>;
  else if (tab === "medcard") panel = <LKMedcard cur={cur}></LKMedcard>;
  else if (tab === "results") panel = <LKResults cur={cur}></LKResults>;
  else if (tab === "booking") panel = <LKBooking appointments={appointments} onBooked={onBooked} onCancel={onCancel} onUpdate={onUpdate} goPasses={() => setTab("passes")}></LKBooking>;
  else if (tab === "hospital") panel = <LKHospital cur={cur}></LKHospital>;
  else if (tab === "program") panel = <LKProgram cur={cur} goBooking={() => setTab("booking")}></LKProgram>;
  else if (tab === "passes") panel = <LKPasses passes={passes} addCar={addCar}></LKPasses>;
  else if (tab === "map") panel = <LKMap></LKMap>;
  else if (tab === "profile") panel = <LKProfile cur={cur} family={LKD.family} switchMember={(id) => { setMember(id); window.scrollTo(0, 0); }}></LKProfile>;

  return (
    <div className="lk-root" data-screen-label={"ЛК — " + tab}>
      <div style={{ borderBottom: "1px solid var(--line-soft)", background: "color-mix(in srgb, var(--paper) 80%, transparent)", backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 40 }}>
        <div className="wrap" style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "14px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20 }}>
          <Logo onClick={exit}></Logo>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span className="small hide-md" style={{ color: "var(--ink-faint)" }}>Личный кабинет пациента</span>
            <div style={{ position: "relative" }}>
              <button
                ref={bellBtnRef}
                aria-label="Уведомления"
                onClick={() => setBellOpen((v) => !v)}
                style={{
                  position: "relative", width: 42, height: 42, borderRadius: 999,
                  border: "1px solid var(--line)", background: bellOpen ? "var(--ink)" : "var(--white)",
                  color: bellOpen ? "#FFFDF8" : "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <LkIcon name="bell" size={19}></LkIcon>
                {unread > 0 ? (
                  <span style={{
                    position: "absolute", top: -3, right: -3, minWidth: 18, height: 18, padding: "0 4px",
                    borderRadius: 999, background: "#A33B2E", color: "#fff", fontSize: 11, fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid var(--paper)",
                  }}>{unread}</span>
                ) : null}
              </button>
            </div>
            <div className="avatar">{cur.patient.initials}</div>
          </div>
        </div>
      </div>

      <div className="lk-shell">
        <aside className="lk-side">
          <div className="lk-profile-block" style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 14px 12px" }}>
            <div className="avatar">{cur.patient.initials}</div>
            <div style={{ lineHeight: 1.25 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{cur.patient.firstName}</div>
              <div className="small" style={{ color: "var(--ink-faint)", fontSize: 12 }}>{cur.rel === "вы" ? "пациент" : cur.rel}</div>
            </div>
          </div>
          {/* Семейный доступ */}
          <div className="lk-fam" style={{ display: "flex", gap: 6, padding: "0 10px 12px" }}>
            {[{ id: "anna", initials: LKD.patient.initials, label: "Вы" }].concat(LKD.family.map((f) => ({ id: f.id, initials: f.patient.initials, label: f.rel }))).map((m) => (
              <button
                key={m.id}
                onClick={() => { setMember(m.id); window.scrollTo(0, 0); }}
                title={m.label}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 3, flex: 1,
                  background: "transparent", border: "none", padding: "6px 2px", borderRadius: 10,
                  outline: member === m.id ? "2px solid var(--accent)" : "1px solid var(--line-soft)",
                }}
              >
                <span className="avatar" style={{ width: 30, height: 30, fontSize: 11.5, background: member === m.id ? "var(--accent)" : "var(--accent-tint)", color: member === m.id ? "#FFFDF8" : "var(--accent-dark)" }}>{m.initials}</span>
                <span style={{ fontSize: 10.5, fontWeight: 600, color: member === m.id ? "var(--ink)" : "var(--ink-faint)" }}>{m.label}</span>
              </button>
            ))}
          </div>
          {items.map((it) => (
            <button key={it.id} className={"lk-item" + (tab === it.id ? " active" : "")} onClick={() => { setTab(it.id); window.scrollTo(0, 0); }}>
              <LkIcon name={it.icon}></LkIcon>
              <span style={{ flex: 1 }}>{it.label}</span>
              {it.badge > 0 ? (
                <span style={{ minWidth: 20, height: 20, padding: "0 5px", borderRadius: 999, background: "#A33B2E", color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{it.badge}</span>
              ) : null}
            </button>
          ))}
          <hr className="divider" style={{ margin: "10px 6px" }}></hr>
          <button className="lk-item" onClick={exit}><LkIcon name="out"></LkIcon><span>На сайт больницы</span></button>
          <button className="lk-item" onClick={() => doAuth(false)} style={{ color: "#A33B2E" }}><LkIcon name="out"></LkIcon><span>Выйти</span></button>
        </aside>
        <div style={{ minWidth: 0 }}>{panel}</div>
      </div>

      <LKBottomNav
        tab={tab}
        go={(id) => { setTab(id); window.scrollTo(0, 0); }}
        member={member}
        setMember={(id) => { setMember(id); window.scrollTo(0, 0); }}
        exit={exit}
        logout={() => doAuth(false)}
      ></LKBottomNav>

      {bellOpen ? (
        <React.Fragment>
          <div className="bell-overlay" onClick={() => setBellOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 90, background: "rgba(16,29,49,0.18)" }}></div>
          <BellDropdown
            anchorRef={bellBtnRef}
            notifs={notifs}
            markRead={markRead}
            markAllRead={markAllRead}
            onOpenAll={() => { setBellOpen(false); setTab("notifs"); window.scrollTo(0, 0); }}
          ></BellDropdown>
        </React.Fragment>
      ) : null}

      <PushStack
        toasts={toasts}
        onDismiss={dismissToast}
        onOpen={(t) => { dismissToast(t.toastId); markRead(t.id); setTab(t.goto || "notifs"); window.scrollTo(0, 0); }}
      ></PushStack>
    </div>
  );
}

/* ---------- Нижнее таб-меню (мобильные) ---------- */
function LKBottomNav({ tab, go, member, setMember, exit, logout }) {
  const [more, setMore] = useLkState(false);
  const primary = [
    { id: "home", icon: "home", label: "Главная" },
    { id: "results", icon: "lab", label: "Анализы" },
    { id: "booking", icon: "cal", label: "Запись" },
    { id: "passes", icon: "qr", label: "Пропуска" },
  ];
  const moreItems = [
    { id: "notifs", icon: "bell", label: "Уведомления" },
    { id: "medcard", icon: "doc", label: "Медкарта" },
    { id: "hospital", icon: "bed", label: "Госпитализация" },
    { id: "program", icon: "prog", label: "Моя программа" },
    { id: "map", icon: "map", label: "Карта территории" },
    { id: "profile", icon: "user", label: "Профиль" },
  ];
  const moreActive = moreItems.some((i) => i.id === tab);
  const open = (id) => { setMore(false); go(id); };
  const members = [{ id: "anna", initials: LKD.patient.initials, label: "Вы" }].concat(
    LKD.family.map((f) => ({ id: f.id, initials: f.patient.initials, label: f.rel }))
  );

  return (
    <React.Fragment>
      {more ? <div className="lk-overlay" onClick={() => setMore(false)}></div> : null}
      {more ? (
        <div className="lk-sheet">
          <div style={{ display: "flex", gap: 8, paddingBottom: 12, borderBottom: "1px solid var(--line-soft)", marginBottom: 8 }}>
            {members.map((m) => (
              <button
                key={m.id}
                onClick={() => { setMember(m.id); setMore(false); }}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 3, flex: 1,
                  background: "transparent", border: "none", padding: "6px 2px", borderRadius: 10,
                  outline: member === m.id ? "2px solid var(--accent)" : "1px solid var(--line-soft)",
                }}
              >
                <span className="avatar" style={{ width: 32, height: 32, fontSize: 12, background: member === m.id ? "var(--accent)" : "var(--accent-tint)", color: member === m.id ? "#FFFDF8" : "var(--accent-dark)" }}>{m.initials}</span>
                <span style={{ fontSize: 10.5, fontWeight: 600, color: member === m.id ? "var(--ink)" : "var(--ink-faint)" }}>{m.label}</span>
              </button>
            ))}
          </div>
          {moreItems.map((it) => (
            <button key={it.id} className={"lk-item" + (tab === it.id ? " active" : "")} onClick={() => open(it.id)}>
              <LkIcon name={it.icon}></LkIcon>
              <span>{it.label}</span>
            </button>
          ))}
          <hr className="divider" style={{ margin: "8px 6px" }}></hr>
          <button className="lk-item" onClick={exit}><LkIcon name="out"></LkIcon><span>На сайт больницы</span></button>
          <button className="lk-item" onClick={logout} style={{ color: "#A33B2E" }}><LkIcon name="out"></LkIcon><span>Выйти</span></button>
        </div>
      ) : null}
      <nav className="lk-bottom">
        {primary.map((it) => (
          <button key={it.id} className={tab === it.id && !more ? "active" : ""} onClick={() => open(it.id)}>
            <LkIcon name={it.icon} size={20}></LkIcon>
            <span>{it.label}</span>
          </button>
        ))}
        <button className={more || moreActive ? "active" : ""} onClick={() => setMore(!more)}>
          <LkIcon name="dots" size={20}></LkIcon>
          <span>Ещё</span>
        </button>
      </nav>
    </React.Fragment>
  );
}

/* ---------- Главная кабинета ---------- */
function LKHome({ go, cur, passes, appointments, notifs }) {
  const lastPass = passes[0];
  const next = appointments[0];
  const prog = cur.program;
  const progDone = prog ? prog.items.filter((i) => i.status === "Пройдено").length : 0;
  const pinned = (notifs || []).filter((n) => n.type === "important").slice(0, 2);
  const [annHidden, setAnnHidden] = useLkState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 20, flexWrap: "wrap" }}>
        <div>
          <div className="small" style={{ color: "var(--ink-faint)", marginBottom: 6 }}>Четверг, 11 июня 2026</div>
          <h1 className="h-1" style={{ fontSize: 36 }}>Добрый день, {cur.patient.firstName}</h1>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => go("booking")}>Записаться на приём</button>
      </div>

      {pinned.length > 0 && !annHidden ? (
        <div className="card" style={{ padding: "18px 22px", borderColor: "rgba(149,104,15,0.35)", background: "var(--warn-bg)", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 13.5, color: "var(--warn)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
              <LkIcon name="info" size={16}></LkIcon> Важные объявления
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <a href="#" className="small" onClick={(e) => { e.preventDefault(); go("notifs"); }} style={{ color: "var(--accent-dark)", fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap" }}>Все →</a>
              <button
                aria-label="Скрыть объявления"
                onClick={() => setAnnHidden(true)}
                style={{ width: 28, height: 28, borderRadius: 99, border: "none", background: "transparent", color: "var(--warn)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3.5 3.5l8 8M11.5 3.5l-8 8"></path></svg>
              </button>
            </span>
          </div>
          {pinned.map((n) => (
            <div key={n.id} style={{ borderTop: "1px solid rgba(149,104,15,0.2)", paddingTop: 10 }}>
              <div style={{ fontWeight: 700, fontSize: 14.5 }}>{n.title}</div>
              <div className="small body-soft" style={{ marginTop: 2 }}>{n.text}</div>
            </div>
          ))}
        </div>
      ) : null}

      {next ? (
        <div className="card" style={{ padding: "20px 26px", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap", boxShadow: "var(--shadow-sm)" }}>
          <span className="badge badge-ok">Ближайший приём</span>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontWeight: 700, fontSize: 15.5 }}>{next.doctor}</div>
            <div className="small body-soft">{next.role} · {next.place}</div>
          </div>
          <div className="ta-resp" style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "var(--serif)", fontSize: 22 }}>{next.date} · {next.time}</div>
            <a href="#" className="small" onClick={(e) => { e.preventDefault(); go("passes"); }} style={{ color: "var(--accent-dark)", fontWeight: 600, textDecoration: "none" }}>Пропуск оформлен →</a>
          </div>
        </div>
      ) : null}

      {(prog || cur.hospitalization) ? (
        <div className="two-col" style={{ display: "grid", gridTemplateColumns: prog && cur.hospitalization ? "1fr 1fr" : "1fr", gap: 24 }}>
          {prog ? (
            <div className="card" style={{ padding: "20px 26px", display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{prog.name}</div>
                <a href="#" className="small" onClick={(e) => { e.preventDefault(); go("program"); }} style={{ color: "var(--accent-dark)", fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap" }}>Подробнее →</a>
              </div>
              <div style={{ height: 7, borderRadius: 99, background: "var(--paper-2)", overflow: "hidden" }}>
                <div style={{ width: Math.round((progDone / prog.items.length) * 100) + "%", height: "100%", background: "var(--accent)", borderRadius: 99 }}></div>
              </div>
              <div className="small body-soft">Пройдено {progDone} из {prog.items.length} обследований</div>
            </div>
          ) : null}
          {cur.hospitalization ? (
            <div className="card" style={{ padding: "20px 26px", display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <span className="badge badge-warn">Госпитализация</span>
                <a href="#" className="small" onClick={(e) => { e.preventDefault(); go("hospital"); }} style={{ color: "var(--accent-dark)", fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap" }}>Подготовка →</a>
              </div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{cur.hospitalization.date}</div>
              <div className="small body-soft">{cur.hospitalization.dept} · {cur.hospitalization.room}</div>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <LKHomeList title="Анализы" icon="lab" items={cur.analyses.slice(0, 3)} onAll={() => go("results")}></LKHomeList>
        <LKHomeList title="Исследования" icon="cal" items={cur.studies.slice(0, 3)} onAll={() => go("results")}></LKHomeList>
      </div>

      <div className="card" style={{ padding: 26, display: "flex", gap: 26, alignItems: "center", flexWrap: "wrap", boxShadow: "var(--shadow-sm)" }}>
        <QRBox code={lastPass.id} size={120}></QRBox>
        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
            <span className="overline">Крайний пропуск</span>
            <span className={"badge " + (lastPass.status === "Действует" ? "badge-ok" : "badge-neutral")}>{lastPass.status}</span>
          </div>
          <div style={{ fontFamily: "var(--serif)", fontSize: 24, marginBottom: 4 }}>{lastPass.date} · {lastPass.time}</div>
          <div className="small body-soft">{lastPass.place} · № {lastPass.id}</div>
          {lastPass.car ? (
            <div className="small" style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8, color: "var(--ink-soft)" }}>
              <LkIcon name="car" size={16}></LkIcon> {lastPass.car.model} · {lastPass.car.plate}
            </div>
          ) : null}
        </div>
        <button className="btn btn-outline btn-sm" onClick={() => go("passes")}>Все пропуска</button>
      </div>
    </div>
  );
}

function LKHomeList({ title, icon, items, onAll }) {
  return (
    <div className="card" style={{ padding: 24, boxShadow: "var(--shadow-sm)", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 700, fontSize: 16 }}>
          <span style={{ color: "var(--accent-dark)", display: "flex" }}><LkIcon name={icon}></LkIcon></span>
          {title}
        </div>
        <a href="#" className="small" onClick={(e) => { e.preventDefault(); onAll(); }} style={{ color: "var(--accent-dark)", fontWeight: 600, textDecoration: "none" }}>Все →</a>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {items.map((it, i) => (
          <div key={it.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "12px 0", borderTop: i === 0 ? "none" : "1px solid var(--line-soft)" }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.name}</div>
              <div className="small" style={{ color: "var(--ink-faint)", fontSize: 12.5 }}>{it.date}</div>
            </div>
            <span className={"badge " + (it.status === "Готов" ? "badge-ok" : "badge-warn")}>{it.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { LK, LKLogin, LKHome, LkIcon, QRBox, BellDropdown, LKNotifications, PushStack });

/* ---------- Пуш-уведомления (тосты) ---------- */
function PushStack({ toasts, onDismiss, onOpen }) {
  if (!toasts || toasts.length === 0) return null;
  return (
    <div className="push-stack">
      {toasts.map((t) => {
        const m = NOTIF_META[t.type] || NOTIF_META.personal;
        return (
          <div key={t.toastId} className="push-toast" onClick={() => onOpen(t)}>
            <span className="push-ic" style={{ background: m.bg, color: m.color }}>
              <LkIcon name={m.icon} size={18}></LkIcon>
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="badge" style={{ background: m.bg, color: m.color, fontSize: 10.5 }}>{m.label}</span>
                <span className="small" style={{ color: "var(--ink-faint)", fontSize: 11.5 }}>{t.date}</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 14.5, marginTop: 5 }}>{t.title}</div>
              <div className="small body-soft" style={{ marginTop: 2, lineHeight: 1.4 }}>{t.text}</div>
            </div>
            <button
              aria-label="Скрыть"
              onClick={(e) => { e.stopPropagation(); onDismiss(t.toastId); }}
              style={{ flex: "none", width: 28, height: 28, borderRadius: 99, border: "none", background: "transparent", color: "var(--ink-faint)", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M3.5 3.5l7 7M10.5 3.5l-7 7"></path></svg>
            </button>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Типы уведомлений ---------- */
const NOTIF_META = {
  important: { label: "Важное", icon: "info", color: "var(--warn)", bg: "var(--warn-bg)" },
  personal: { label: "Личное", icon: "bell", color: "var(--ok)", bg: "var(--ok-bg)" },
  action: { label: "Действие", icon: "doc", color: "var(--accent-dark)", bg: "var(--accent-tint)" },
};

/* ---------- Выпадающая панель колокольчика ---------- */
function BellDropdown({ notifs, markRead, markAllRead, onOpenAll, anchorRef }) {
  const top = notifs.slice(0, 5);
  const unread = notifs.filter((n) => !n.read).length;
  const rect = anchorRef && anchorRef.current ? anchorRef.current.getBoundingClientRect() : null;
  const deskStyle = rect
    ? { top: rect.bottom + 12, right: Math.max(12, window.innerWidth - rect.right) }
    : { top: 72, right: 24 };
  return (
    <div className="bell-panel" style={{
      position: "fixed", zIndex: 91,
      top: deskStyle.top, right: deskStyle.right,
      width: 360, maxWidth: "calc(100vw - 32px)", background: "var(--white)",
      border: "1px solid var(--line)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow)", overflow: "hidden",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", borderBottom: "1px solid var(--line-soft)" }}>
        <span style={{ fontWeight: 700, fontSize: 15 }}>Уведомления</span>
        {unread > 0 ? (
          <button onClick={markAllRead} style={{ border: "none", background: "none", color: "var(--accent-dark)", fontWeight: 600, fontSize: 12.5 }}>Прочитано</button>
        ) : null}
      </div>
      <div className="bell-list" style={{ maxHeight: 360, overflowY: "auto" }}>
        {top.map((n) => {
          const m = NOTIF_META[n.type];
          return (
            <button
              key={n.id}
              onClick={() => markRead(n.id)}
              style={{
                display: "flex", gap: 12, width: "100%", textAlign: "left", border: "none",
                background: n.read ? "transparent" : "rgba(154,123,79,0.06)",
                padding: "13px 18px", borderBottom: "1px solid var(--line-soft)", cursor: "pointer",
              }}
            >
              <span style={{ flex: "none", width: 30, height: 30, borderRadius: 99, background: m.bg, color: m.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <LkIcon name={m.icon} size={16}></LkIcon>
              </span>
              <span style={{ minWidth: 0, flex: 1 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: n.read ? 600 : 700, fontSize: 13.5, color: "var(--ink)" }}>{n.title}</span>
                  {!n.read ? <span style={{ width: 7, height: 7, borderRadius: 99, background: "#A33B2E", flex: "none" }}></span> : null}
                </span>
                <span style={{ display: "block", fontSize: 12.5, color: "var(--ink-faint)", marginTop: 2, lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{n.text}</span>
                <span style={{ display: "block", fontSize: 11.5, color: "var(--ink-faint)", marginTop: 4 }}>{n.date}</span>
              </span>
            </button>
          );
        })}
      </div>
      <button onClick={onOpenAll} style={{ width: "100%", border: "none", background: "var(--paper-2)", padding: "13px", fontWeight: 600, fontSize: 14, color: "var(--ink)" }}>
        Все уведомления
      </button>
    </div>
  );
}

/* ---------- Раздел «Уведомления» ---------- */
function LKNotifications({ notifs, markRead, markAllRead }) {
  const [filter, setFilter] = useLkState("all");
  const unread = notifs.filter((n) => !n.read).length;
  const filtered = notifs.filter((n) => filter === "all" || (filter === "unread" ? !n.read : n.type === filter));
  const pinned = filtered.filter((n) => n.pinned);
  const rest = filtered.filter((n) => !n.pinned);
  const chips = [
    { id: "all", label: "Все" },
    { id: "important", label: "Важные" },
    { id: "personal", label: "Личные" },
    { id: "unread", label: "Непрочитанные" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div className="lk-filterbar">
        <h1 className="h-1" style={{ fontSize: 32 }}>Уведомления</h1>
        <div className="lk-filterbar" style={{ gap: 10 }}>
          <div className="seg">
            {chips.map((c) => (
              <button key={c.id} className={filter === c.id ? "on" : ""} onClick={() => setFilter(c.id)}>{c.label}</button>
            ))}
          </div>
          {unread > 0 ? (
            <button className="btn btn-outline btn-sm" onClick={markAllRead}>Прочитать все</button>
          ) : null}
        </div>
      </div>

      {pinned.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div className="overline" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <LkIcon name="info" size={15}></LkIcon> Закреплено больницей
          </div>
          {pinned.map((n) => <NotifRow key={n.id} n={n} markRead={markRead}></NotifRow>)}
        </div>
      ) : null}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {pinned.length > 0 && rest.length > 0 ? <div className="overline">Ранее</div> : null}
        {rest.map((n) => <NotifRow key={n.id} n={n} markRead={markRead}></NotifRow>)}
        {filtered.length === 0 ? (
          <div className="card" style={{ padding: 40, textAlign: "center", color: "var(--ink-faint)" }}>Нет уведомлений в этой категории.</div>
        ) : null}
      </div>
    </div>
  );
}

function NotifRow({ n, markRead }) {
  const m = NOTIF_META[n.type];
  return (
    <div
      onClick={() => !n.read && markRead(n.id)}
      className="card"
      style={{
        padding: "18px 22px", display: "flex", gap: 16, alignItems: "flex-start",
        cursor: n.read ? "default" : "pointer",
        borderColor: n.pinned ? "rgba(149,104,15,0.35)" : "var(--line)",
        background: n.read ? "var(--white)" : "rgba(154,123,79,0.05)",
      }}
    >
      <span style={{ flex: "none", width: 38, height: 38, borderRadius: 99, background: m.bg, color: m.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <LkIcon name={m.icon} size={18}></LkIcon>
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontWeight: 700, fontSize: 15.5 }}>{n.title}</span>
          <span className="badge" style={{ background: m.bg, color: m.color, fontSize: 11 }}>{m.label}</span>
          {n.pinned ? <span className="badge badge-neutral" style={{ fontSize: 11 }}>больница</span> : null}
          {!n.read ? <span style={{ width: 8, height: 8, borderRadius: 99, background: "#A33B2E" }}></span> : null}
        </div>
        <p className="body-soft" style={{ fontSize: 14, marginTop: 5 }}>{n.text}</p>
        <div className="small" style={{ color: "var(--ink-faint)", marginTop: 8 }}>{n.date}</div>
      </div>
    </div>
  );
}
