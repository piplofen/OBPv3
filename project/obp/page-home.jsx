// ОБП — Главная страница
const HomeData = window.OBP_DATA;

function PageHome({ nav, onBook, openDirection }) {
  return (
    <main>
      {/* ---------- Hero ---------- */}
      <section style={{ background: "var(--paper)", borderBottom: "1px solid var(--line-soft)" }}>
        <div className="wrap hero-grid two-col" style={{
          display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 64,
          alignItems: "center", padding: "84px 40px 92px",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 26, alignItems: "flex-start" }}>
            <div className="overline">Управление делами Президента РФ</div>
            <h1 className="h-display">
              Медицина полного цикла — от&nbsp;диагноза до&nbsp;восстановления
            </h1>
            <p className="lead" style={{ maxWidth: 480 }}>
              Поликлиника, круглосуточный стационар, диагностика и реабилитация —
              в едином комплексе на Мичуринском проспекте.
            </p>
            <div style={{ display: "flex", gap: 14, marginTop: 6 }}>
              <button className="btn btn-primary" onClick={onBook}>Записаться на приём</button>
              <button className="btn btn-outline" onClick={() => nav("directions")}>Наши отделения</button>
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <Ph label="фото: атриум / фасад больницы" ratio="5 / 4"></Ph>
            <div className="hero-float" style={{
              position: "absolute", left: -28, bottom: 32, background: "var(--navy)",
              color: "#F2EFE8", padding: "18px 24px", borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow)", maxWidth: 280,
            }}>
              <div style={{ fontFamily: "var(--serif)", fontSize: 19, lineHeight: 1.3 }}>
                Стационар принимает круглосуточно
              </div>
              <div className="small" style={{ color: "rgba(242,239,232,0.6)", marginTop: 6 }}>
                плановая и экстренная госпитализация
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Направления ---------- */}
      <section className="section">
        <div className="wrap">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 44, gap: 24 }}>
            <div>
              <div className="overline" style={{ marginBottom: 12 }}>Направления</div>
              <h2 className="h-1">Четыре контура помощи</h2>
            </div>
            <a className="text-link" href="#" onClick={(e) => { e.preventDefault(); nav("directions"); }}>
              Все отделения <Arrow></Arrow>
            </a>
          </div>
          <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {HomeData.directions.map((d, i) => (
              <DirectionCard key={d.id} d={d} index={i} onClick={() => openDirection(d.id)}></DirectionCard>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Программы и чек-апы (кратко) ---------- */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="card two-col pad-resp" style={{ padding: 40, display: "grid", gridTemplateColumns: "0.9fr 1.4fr", gap: 48, background: "var(--accent-tint)", borderColor: "rgba(154,123,79,0.3)", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
              <div className="overline">Чек-апы и программы</div>
              <h2 className="h-1" style={{ fontSize: 32 }}>Проверьте здоровье за один визит</h2>
              <p className="body-soft" style={{ fontSize: 15.5 }}>
                Готовые комплексы обследований: маршрут спланирован, кабинеты рядом,
                результаты разбирает один врач.
              </p>
              <button className="btn btn-ink btn-sm" onClick={() => nav("programs")}>Все программы <Arrow></Arrow></button>
            </div>
            <div className="stack-sm" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, alignContent: "center" }}>
              {HomeData.programs.map((p) => (
                <a
                  key={p.id}
                  href="#"
                  onClick={(e) => { e.preventDefault(); nav("programs"); }}
                  className="card"
                  style={{ padding: "16px 20px", textDecoration: "none", display: "flex", flexDirection: "column", gap: 4 }}
                >
                  <span style={{ fontWeight: 700, fontSize: 14.5 }}>{p.name}</span>
                  <span className="small" style={{ color: "var(--ink-faint)" }}>{p.tag} · {p.meta}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- О больнице ---------- */}
      <section className="section section-dark">
        <div className="wrap two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>
          <Ph dark label="фото: врачебный консилиум" ratio="4 / 3"></Ph>
          <div style={{ display: "flex", flexDirection: "column", gap: 24, alignItems: "flex-start" }}>
            <div className="overline" style={{ color: "#C8A96A" }}>О больнице</div>
            <h2 className="h-1" style={{ color: "#F2EFE8" }}>
              Больница, где пациента ведут, а&nbsp;не&nbsp;передают
            </h2>
            <p style={{ color: "rgba(242,239,232,0.72)", fontSize: 17.5, lineHeight: 1.65, textWrap: "pretty" }}>
              Все этапы — приём, обследование, операция, восстановление — происходят
              в одном учреждении и в одной медицинской карте. Лечащий врач видит полную
              картину и сопровождает пациента до результата.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 36px", width: "100%", margin: "8px 0" }}>
              <DarkFact title="Собственная лаборатория" text="анализы без передачи в сторонние службы"></DarkFact>
              <DarkFact title="Операционные и реанимация" text="в том же корпусе, что и диагностика"></DarkFact>
              <DarkFact title="Семейные врачи" text="постоянное сопровождение пациента"></DarkFact>
              <DarkFact title="Реабилитация и бассейн" text="восстановление после лечения"></DarkFact>
            </div>
            <a className="text-link" href="#" style={{ color: "#C8A96A" }} onClick={(e) => { e.preventDefault(); nav("about"); }}>
              Подробнее о больнице <Arrow></Arrow>
            </a>
          </div>
        </div>
      </section>

      {/* ---------- Врачи ---------- */}
      <section className="section">
        <div className="wrap">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 44, gap: 24 }}>
            <div>
              <div className="overline" style={{ marginBottom: 12 }}>Специалисты</div>
              <h2 className="h-1">Врачи больницы</h2>
            </div>
            <a className="text-link" href="#" onClick={(e) => { e.preventDefault(); nav("doctors"); }}>
              Все врачи <Arrow></Arrow>
            </a>
          </div>
          <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {HomeData.doctors.slice(0, 4).map((doc) => (
              <DoctorCard key={doc.name} doc={doc} onBook={onBook}></DoctorCard>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="section section-tint" style={{ padding: "80px 0" }}>
        <div className="wrap two-col" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 48, alignItems: "center" }}>
          <div>
            <h2 className="h-1" style={{ marginBottom: 14 }}>Запишитесь на приём</h2>
            <p className="lead" style={{ maxWidth: 560 }}>
              Координатор подберёт врача и удобное время. Запись по телефону или через короткую форму.
            </p>
          </div>
          <div className="cta-right" style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-end" }}>
            <button className="btn btn-ink" onClick={onBook}>Записаться на приём</button>
            <a href="tel:84993333000" style={{ textDecoration: "none", fontWeight: 700, fontSize: 18 }}>8 (499) 333-30-00</a>
          </div>
        </div>
      </section>
    </main>
  );
}

function DirectionCard({ d, index, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <a
      href="#"
      onClick={(e) => { e.preventDefault(); onClick(); }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="card"
      style={{
        display: "flex", flexDirection: "column", gap: 0, textDecoration: "none",
        padding: 28, minHeight: 300, transition: "transform .18s ease, box-shadow .18s ease",
        transform: hover ? "translateY(-4px)" : "none",
        boxShadow: hover ? "var(--shadow)" : "none",
      }}
    >
      <span style={{
        fontFamily: "var(--serif)", fontSize: 15, color: "var(--accent-dark)", letterSpacing: "0.04em",
      }}>0{index + 1}</span>
      <span className="h-2" style={{ margin: "14px 0 12px" }}>{d.name}</span>
      <span className="body-soft" style={{ fontSize: 14.5, flex: 1 }}>{d.short}</span>
      <span style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginTop: 22, paddingTop: 16, borderTop: "1px solid var(--line-soft)",
        fontSize: 13.5, color: "var(--ink-faint)",
      }}>
        <span>{d.departments.length} отделений</span>
        <Arrow color={hover ? "var(--accent-dark)" : "var(--ink-faint)"}></Arrow>
      </span>
    </a>
  );
}

function DarkFact({ title, text }) {  return (
    <div style={{ borderTop: "1px solid rgba(242,239,232,0.18)", paddingTop: 14 }}>
      <div style={{ fontWeight: 600, fontSize: 15, color: "#F2EFE8" }}>{title}</div>
      <div className="small" style={{ color: "rgba(242,239,232,0.55)", marginTop: 3 }}>{text}</div>
    </div>
  );
}

function DoctorCard({ doc, onBook }) {  const [hover, setHover] = React.useState(false);
  return (
    <div
      className="card"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        overflow: "hidden", display: "flex", flexDirection: "column",
        transition: "transform .18s ease, box-shadow .18s ease",
        transform: hover ? "translateY(-4px)" : "none",
        boxShadow: hover ? "var(--shadow)" : "none",
      }}
    >
      <Ph label="фото врача" ratio="4 / 4.4" style={{ borderRadius: 0, borderLeft: "none", borderRight: "none", borderTop: "none" }}></Ph>
      <div style={{ padding: "18px 20px 20px", display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
        <div className="h-3">{doc.name}</div>
        <div className="small body-soft" style={{ flex: 1 }}>{doc.role}</div>
        <div className="small" style={{ color: "var(--accent-dark)", fontWeight: 600 }}>{doc.degree} · {doc.exp}</div>
        <button className="btn btn-outline btn-sm" style={{ marginTop: 12 }} onClick={onBook}>Записаться</button>
      </div>
    </div>
  );
}

function ProgramCard({ p, onBook }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      className="card"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: 26, display: "flex", flexDirection: "column", gap: 12,
        background: p.tag === "Чек-ап" ? "var(--accent-tint)" : "var(--white)",
        borderColor: p.tag === "Чек-ап" ? "rgba(154,123,79,0.3)" : "var(--line)",
        transition: "transform .18s ease, box-shadow .18s ease",
        transform: hover ? "translateY(-4px)" : "none",
        boxShadow: hover ? "var(--shadow)" : "none",
      }}
    >
      <span className="badge badge-neutral" style={{ alignSelf: "flex-start", background: "rgba(21,35,58,0.08)" }}>{p.tag}</span>
      <span className="h-2" style={{ fontSize: 22 }}>{p.name}</span>
      <span className="body-soft" style={{ fontSize: 14, flex: 1 }}>{p.desc}</span>
      <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 14, borderTop: "1px solid var(--line-soft)" }}>
        <span className="small" style={{ color: "var(--ink-faint)", fontWeight: 600 }}>{p.meta}</span>
        <button className="btn btn-outline btn-sm" onClick={onBook} style={{ padding: "7px 16px", fontSize: 13 }}>Записаться</button>
      </span>
    </div>
  );
}

Object.assign(window, { PageHome, DoctorCard });
