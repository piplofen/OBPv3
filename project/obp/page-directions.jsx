// ОБП — Отделения: каталог направлений и детальная страница направления
const DirData = window.OBP_DATA;

/* ---------- Каталог ---------- */
function PageDirections({ openDirection, onBook }) {
  return (
    <main>
      <PageHero
        overline="Отделения"
        title="Структура больницы"
        lead="Четыре направления — амбулаторная помощь, диагностика, стационар и реабилитация. Выберите направление, чтобы посмотреть отделения и врачей."
      ></PageHero>
      <section style={{ padding: "64px 0 96px" }}>
        <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: 56 }}>
          {DirData.directions.map((d, i) => (
            <div key={d.id} className="two-col" style={{
              display: "grid", gridTemplateColumns: "minmax(280px, 1fr) 2fr", gap: 56,
              paddingTop: i === 0 ? 0 : 56, borderTop: i === 0 ? "none" : "1px solid var(--line)",
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
                <span style={{ fontFamily: "var(--serif)", fontSize: 15, color: "var(--accent-dark)" }}>0{i + 1}</span>
                <h2 className="h-1" style={{ fontSize: 34 }}>{d.name}</h2>
                <p className="body-soft" style={{ fontSize: 15.5 }}>{d.short}</p>
                <button className="btn btn-outline btn-sm" onClick={() => openDirection(d.id)}>
                  Подробнее <Arrow></Arrow>
                </button>
              </div>
              <div className="stack-sm" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 32px", alignContent: "start" }}>
                {d.departments.map((dep) => (
                  <a
                    key={dep}
                    href="#"
                    onClick={(e) => { e.preventDefault(); openDirection(d.id); }}
                    className="dep-row"
                    style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
                      padding: "13px 4px", borderBottom: "1px solid var(--line-soft)",
                      textDecoration: "none", fontSize: 15, color: "var(--ink)",
                    }}
                  >
                    <span>{dep}</span>
                    <Arrow color="var(--ink-faint)"></Arrow>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

/* ---------- Детальная страница направления ---------- */
function PageDirection({ dirId, nav, openDirection, onBook }) {
  const d = DirData.directions.find((x) => x.id === dirId) || DirData.directions[0];
  const docs = DirData.doctors.filter((x) => x.dir === d.id);
  const others = DirData.directions.filter((x) => x.id !== d.id);

  return (
    <main>
      <section style={{ background: "var(--navy)", color: "#F2EFE8" }}>
        <div className="wrap" style={{ padding: "64px 40px 72px" }}>
          <div className="small" style={{ marginBottom: 22, color: "rgba(242,239,232,0.55)" }}>
            <a href="#" onClick={(e) => { e.preventDefault(); nav("home"); }} style={{ color: "inherit", textDecoration: "none" }}>Главная</a>
            <span style={{ margin: "0 8px" }}>/</span>
            <a href="#" onClick={(e) => { e.preventDefault(); nav("directions"); }} style={{ color: "inherit", textDecoration: "none" }}>Отделения</a>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#C8A96A" }}>{d.name}</span>
          </div>
          <div className="two-col hero-grid" style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 64, alignItems: "center" }}>
            <div>
              <h1 className="h-display" style={{ fontSize: "clamp(38px, 4vw, 56px)", marginBottom: 20 }}>{d.name}</h1>
              <p style={{ color: "rgba(242,239,232,0.72)", fontSize: 18, lineHeight: 1.65, maxWidth: 560, textWrap: "pretty" }}>
                {d.lead}
              </p>
              <div style={{ display: "flex", gap: 14, marginTop: 30 }}>
                <button className="btn btn-primary" onClick={onBook}>Записаться</button>
                <a className="btn btn-outline-light" href="tel:84993333000">8 (499) 333-30-00</a>
              </div>
            </div>
            <Ph dark label={"фото: " + d.name.toLowerCase()} ratio="5 / 4"></Ph>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 80 }}>
        <div className="wrap two-col" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 72, alignItems: "start" }}>
          <div>
            <div className="overline" style={{ marginBottom: 12 }}>Состав направления</div>
            <h2 className="h-1" style={{ fontSize: 34, marginBottom: 32 }}>Отделения и кабинеты</h2>
            <div className="stack-sm" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {d.departments.map((dep) => (
                <div key={dep} className="card" style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={{ fontWeight: 600, fontSize: 15 }}>{dep}</span>
                  <a className="text-link" href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: 13.5 }}>
                    Об отделении <Arrow></Arrow>
                  </a>
                </div>
              ))}
            </div>
          </div>
          <aside style={{ position: "sticky", top: 132, display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="card" style={{ padding: 26, background: "var(--accent-tint)", borderColor: "rgba(154,123,79,0.3)" }}>
              <div className="h-3" style={{ marginBottom: 8 }}>Запись и вопросы</div>
              <p className="small body-soft" style={{ marginBottom: 18 }}>
                Координатор подскажет, к какому врачу записаться, и подберёт время.
              </p>
              <button className="btn btn-ink" style={{ width: "100%" }} onClick={onBook}>Записаться на приём</button>
              <div className="small" style={{ textAlign: "center", marginTop: 12, color: "var(--ink-soft)" }}>
                или по телефону <strong>8 (499) 333-30-00</strong>
              </div>
            </div>
            <div className="card" style={{ padding: 26 }}>
              <div className="overline" style={{ marginBottom: 14 }}>Другие направления</div>
              {others.map((o) => (
                <a
                  key={o.id} href="#"
                  onClick={(e) => { e.preventDefault(); openDirection(o.id); }}
                  style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "11px 0", borderBottom: "1px solid var(--line-soft)",
                    textDecoration: "none", fontSize: 15, fontWeight: 600, color: "var(--ink)",
                  }}
                >
                  {o.name} <Arrow color="var(--ink-faint)"></Arrow>
                </a>
              ))}
            </div>
          </aside>
        </div>
      </section>

      {docs.length > 0 ? (
        <section style={{ padding: "0 0 96px" }}>
          <div className="wrap">
            <div className="overline" style={{ marginBottom: 12 }}>Специалисты</div>
            <h2 className="h-1" style={{ fontSize: 34, marginBottom: 32 }}>Врачи направления</h2>
            <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
              {docs.map((doc) => (
                <DoctorCard key={doc.name} doc={doc} onBook={onBook}></DoctorCard>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}

/* ---------- Общий герой внутренних страниц ---------- */
function PageHero({ overline, title, lead }) {
  return (
    <section style={{ borderBottom: "1px solid var(--line-soft)", background: "var(--paper)" }}>
      <div className="wrap" style={{ padding: "72px 40px 56px", maxWidth: 900, marginLeft: "auto", marginRight: "auto", textAlign: "center" }}>
        <div className="overline" style={{ marginBottom: 14 }}>{overline}</div>
        <h1 className="h-1" style={{ marginBottom: 18 }}>{title}</h1>
        <p className="lead" style={{ maxWidth: 640, margin: "0 auto" }}>{lead}</p>
      </div>
    </section>
  );
}

Object.assign(window, { PageDirections, PageDirection, PageHero });
