// ОБП — общие компоненты: логотип, шапка, подвал, модал записи, плейсхолдеры.
const { useState, useEffect, useRef } = React;
const DATA = window.OBP_DATA;

/* ---------- Знак: тонкий крест в круге, бронза ---------- */
function LogoMark({ size = 44, color = "var(--accent)" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" aria-hidden="true">
      <circle cx="22" cy="22" r="20.5" fill="none" stroke={color} strokeWidth="1.6"></circle>
      <rect x="20.6" y="11" width="2.8" height="22" fill={color}></rect>
      <rect x="11" y="20.6" width="22" height="2.8" fill={color}></rect>
    </svg>
  );
}

function Logo({ dark = false, onClick }) {
  return (
    <a
      href="#"
      className="site-logo"
      onClick={(e) => { e.preventDefault(); onClick && onClick(); }}
      style={{ display: "flex", alignItems: "center", gap: 14, textDecoration: "none", flex: "none" }}
    >
      <LogoMark size={42}></LogoMark>
      <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.18, minWidth: 0 }}>
        <span className="logo-title" style={{ color: dark ? "#F2EFE8" : "var(--ink)" }}>
          Объединённая больница
        </span>
        <span className="logo-sub" style={{ color: dark ? "rgba(242,239,232,0.6)" : "var(--ink-faint)" }}>
          с поликлиникой
        </span>
      </span>
    </a>
  );
}

/* ---------- Плейсхолдер изображения ---------- */
function Ph({ label, ratio = "4 / 3", dark = false, style = {} }) {
  return (
    <div className={"ph" + (dark ? " ph-dark" : "")} style={{ aspectRatio: ratio, ...style }}>
      <span className="ph-label">{label}</span>
    </div>
  );
}

function Arrow({ color = "currentColor" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  );
}

/* ---------- Шапка ---------- */
function Header({ nav, route, onBook }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const items = [
    { id: "home", label: "Главная" },
    { id: "directions", label: "Отделения" },
    { id: "programs", label: "Чек-апы" },
    { id: "doctors", label: "Врачи" },
    { id: "about", label: "О больнице" },
  ];
  const go = (id) => { setMenuOpen(false); nav(id); };
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50 }}>
      <div style={{ background: "var(--navy)", color: "rgba(242,239,232,0.75)", fontSize: 12.5 }}>
        <div className="wrap" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 36, gap: 16 }}>
          <span className="topbar-left" style={{ letterSpacing: "0.06em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", minWidth: 0 }}>Управление делами Президента Российской Федерации</span>
          <span style={{ display: "flex", gap: 24, whiteSpace: "nowrap", alignItems: "center" }}>
            <span className="hide-md">{DATA.address}</span>
            <a href="#" onClick={(e) => { e.preventDefault(); go("lk"); }} style={{ color: "#D8C49A", textDecoration: "none", fontWeight: 600 }}>Личный кабинет</a>
          </span>
        </div>
      </div>
      <div style={{ background: "color-mix(in srgb, var(--paper) 82%, transparent)", backdropFilter: "saturate(1.3) blur(14px)", WebkitBackdropFilter: "saturate(1.3) blur(14px)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 76, gap: 24 }}>
          <Logo onClick={() => go("home")}></Logo>
          <nav className="nav-main" style={{ display: "flex", gap: 4 }}>
            {items.map((it) => (
              <a
                key={it.id}
                href="#"
                onClick={(e) => { e.preventDefault(); go(it.id); }}
                style={{
                  padding: "9px 14px", borderRadius: "var(--radius)", textDecoration: "none",
                  fontSize: 15, fontWeight: route === it.id ? 600 : 500,
                  color: route === it.id ? "var(--ink)" : "var(--ink-soft)",
                  background: route === it.id ? "rgba(21,35,58,0.06)" : "transparent",
                  transition: "background .15s ease",
                }}
              >
                {it.label}
              </a>
            ))}
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <a href="tel:84993333000" className="hide-md" style={{ textDecoration: "none", textAlign: "right", lineHeight: 1.25, whiteSpace: "nowrap" }}>
              <span style={{ display: "block", fontWeight: 700, fontSize: 16 }}>8 (499) 333-30-00</span>
              <span style={{ display: "block", fontSize: 11.5, color: "var(--ink-faint)" }}>справочная, круглосуточно</span>
            </a>
            <button className="btn btn-primary btn-sm hide-xs" onClick={onBook}>Записаться</button>
            <button className="burger" aria-label="Меню" onClick={() => setMenuOpen(!menuOpen)}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="var(--ink)" strokeWidth="1.8" strokeLinecap="round">
                {menuOpen ? (
                  <path d="M5 5l10 10M15 5L5 15"></path>
                ) : (
                  <path d="M3 6h14M3 10h14M3 14h14"></path>
                )}
              </svg>
            </button>
          </div>
        </div>
        {menuOpen ? (
          <div className="mobile-menu">
            <div className="wrap" style={{ padding: "8px 20px 20px" }}>
              {items.map((it) => (
                <a key={it.id} href="#" onClick={(e) => { e.preventDefault(); go(it.id); }}>
                  <span style={{ fontWeight: route === it.id ? 700 : 600 }}>{it.label}</span>
                  <Arrow color="var(--ink-faint)"></Arrow>
                </a>
              ))}
              <a href="#" onClick={(e) => { e.preventDefault(); go("lk"); }}>
                <span style={{ color: "var(--accent-dark)" }}>Личный кабинет</span>
                <Arrow color="var(--accent-dark)"></Arrow>
              </a>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 18 }}>
                <a href="tel:84993333000" style={{ textDecoration: "none", fontWeight: 700, fontSize: 18, border: "none", padding: 0, minHeight: 0 }}>8 (499) 333-30-00</a>
                <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => { setMenuOpen(false); onBook(); }}>Записаться на приём</button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}

/* ---------- Подвал ---------- */
function Footer({ nav, onBook }) {
  return (
    <footer style={{ background: "var(--navy)", color: "rgba(242,239,232,0.8)" }}>
      <div className="wrap" style={{ padding: "72px 40px 0" }}>
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1.2fr", gap: 48, paddingBottom: 56 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "flex-start" }}>
            <Logo dark onClick={() => nav("home")}></Logo>
            <p className="small" style={{ color: "rgba(242,239,232,0.55)", maxWidth: 300, textWrap: "pretty" }}>
              Федеральное государственное бюджетное учреждение. Многопрофильная медицина полного цикла: поликлиника, стационар, диагностика, реабилитация.
            </p>
            <button className="btn btn-outline-light btn-sm" onClick={onBook}>Записаться на приём</button>
          </div>
          <div>
            <FooterHead>Пациентам</FooterHead>
            <FooterLink onClick={() => nav("directions")}>Отделения</FooterLink>
            <FooterLink onClick={() => nav("programs")}>Чек-апы и программы</FooterLink>
            <FooterLink onClick={() => nav("doctors")}>Врачи</FooterLink>
            <FooterLink onClick={() => nav("about")}>О больнице</FooterLink>
            <FooterLink onClick={() => nav("lk")}>Личный кабинет</FooterLink>
            <FooterLink>Прейскурант</FooterLink>
            <FooterLink>Расписание приёма</FooterLink>
          </div>
          <div>
            <FooterHead>Учреждение</FooterHead>
            <FooterLink>История</FooterLink>
            <FooterLink>Лицензии</FooterLink>
            <FooterLink>Документы</FooterLink>
            <FooterLink>Вакансии</FooterLink>
            <FooterLink>Надзорные органы</FooterLink>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <FooterHead>Контакты</FooterHead>
            {DATA.phones.slice(0, 3).map((p) => (
              <div key={p.num}>
                <a href="#" onClick={(e) => e.preventDefault()} style={{ color: "#F2EFE8", fontWeight: 600, textDecoration: "none", fontSize: 15.5 }}>{p.num}</a>
                <div className="small" style={{ color: "rgba(242,239,232,0.5)" }}>{p.label}</div>
              </div>
            ))}
            <div className="small" style={{ color: "rgba(242,239,232,0.6)" }}>
              {DATA.address}<br></br>{DATA.hours[0]} · {DATA.hours[1]}
            </div>
          </div>
        </div>
        <div className="footer-bottom" style={{
          borderTop: "1px solid rgba(242,239,232,0.14)", padding: "22px 0 28px",
          display: "flex", justifyContent: "space-between", gap: 24, fontSize: 12.5, color: "rgba(242,239,232,0.45)",
        }}>
          <span>ФГБУ «Объединённая больница с поликлиникой» УДП РФ — концепт ребрендинга</span>
          <span style={{ display: "flex", gap: 18 }}>
            <span>ВКонтакте</span><span>Telegram</span><span>YouTube</span><span>Дзен</span>
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterHead({ children }) {
  return (
    <div className="overline" style={{ color: "#C8A96A", marginBottom: 16 }}>{children}</div>
  );
}

function FooterLink({ children, onClick }) {
  return (
    <a
      href="#"
      onClick={(e) => { e.preventDefault(); onClick && onClick(); }}
      style={{ display: "block", color: "rgba(242,239,232,0.7)", textDecoration: "none", fontSize: 14.5, padding: "5px 0" }}
    >
      {children}
    </a>
  );
}

/* ---------- Модал записи на приём ---------- */
function AppointmentModal({ open, onClose, presetDir }) {
  const [form, setForm] = useState({ dir: presetDir || "", name: "", phone: "", date: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({ dir: presetDir || "", name: "", phone: "", date: "" });
      setErrors({});
      setSent(false);
    }
  }, [open, presetDir]);

  if (!open) return null;

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = () => {
    const e = {};
    if (!form.dir) e.dir = "Выберите направление";
    if (form.name.trim().length < 3) e.name = "Укажите фамилию и имя";
    if (!/^[\d\s()+-]{10,}$/.test(form.phone)) e.phone = "Укажите телефон в формате 8 (___) ___-__-__";
    if (!form.date) e.date = "Выберите удобную дату";
    setErrors(e);
    if (Object.keys(e).length === 0) setSent(true);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 100, background: "rgba(16,29,49,0.55)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
        backdropFilter: "blur(3px)",
      }}
    >
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--paper)", borderRadius: 6, width: 460, maxWidth: "100%",
          boxShadow: "var(--shadow)", padding: 36, position: "relative",
          maxHeight: "90vh", overflowY: "auto",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Закрыть"
          style={{
            position: "absolute", top: 16, right: 16, width: 32, height: 32,
            border: "none", background: "transparent", fontSize: 20, color: "var(--ink-faint)",
          }}
        >×</button>

        {sent ? (
          <div style={{ textAlign: "center", padding: "24px 0 12px" }}>
            <LogoMark size={52}></LogoMark>
            <h3 className="h-2" style={{ margin: "20px 0 10px" }}>Заявка принята</h3>
            <p className="body-soft" style={{ marginBottom: 26 }}>
              Координатор перезвонит вам в течение 15 минут в рабочее время, подтвердит дату и подберёт врача.
            </p>
            <button className="btn btn-ink" onClick={onClose}>Хорошо</button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <div className="overline" style={{ marginBottom: 8 }}>Предварительная запись</div>
              <h3 className="h-2">Запись на приём</h3>
            </div>
            <div className={"field" + (errors.dir ? " invalid" : "")}>
              <label>Направление</label>
              <select value={form.dir} onChange={(e) => set("dir", e.target.value)}>
                <option value="">— выберите —</option>
                {DATA.directions.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              {errors.dir ? <span className="err">{errors.dir}</span> : null}
            </div>
            <div className={"field" + (errors.name ? " invalid" : "")}>
              <label>Фамилия и имя</label>
              <input value={form.name} placeholder="Иванова Анна" onChange={(e) => set("name", e.target.value)}></input>
              {errors.name ? <span className="err">{errors.name}</span> : null}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className={"field" + (errors.phone ? " invalid" : "")}>
                <label>Телефон</label>
                <input value={form.phone} placeholder="8 (___) ___-__-__" onChange={(e) => set("phone", e.target.value)}></input>
                {errors.phone ? <span className="err">{errors.phone}</span> : null}
              </div>
              <div className={"field" + (errors.date ? " invalid" : "")}>
                <label>Дата</label>
                <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)}></input>
                {errors.date ? <span className="err">{errors.date}</span> : null}
              </div>
            </div>
            <button className="btn btn-primary" onClick={submit} style={{ marginTop: 4 }}>Отправить заявку</button>
            <p className="small" style={{ color: "var(--ink-faint)", textAlign: "center" }}>
              Или позвоните: <strong>8 (499) 333-30-00</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { LogoMark, Logo, Ph, Arrow, Header, Footer, AppointmentModal });
