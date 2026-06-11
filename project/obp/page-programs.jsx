// ОБП — страница «Чек-апы и программы» (подробная)
const ProgData = window.OBP_DATA;

function PagePrograms({ onBook }) {
  return (
    <main>
      <PageHero
        overline="Чек-апы и программы"
        title="Проверка здоровья за один–два визита"
        lead="Готовые комплексы обследований: всё спланировано заранее, кабинеты рядом, результаты — у одного врача. Без очередей и самостоятельной записи к каждому специалисту."
      ></PageHero>

      {/* Как это устроено */}
      <section style={{ padding: "64px 0 8px" }}>
        <div className="wrap">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="grid-4">
            <StepCard n="01" title="Запись и подготовка" text="Координатор подбирает дату, высылает памятку по подготовке и оформляет пропуск."></StepCard>
            <StepCard n="02" title="Обследование за визит" text="Все кабинеты — в одном корпусе, маршрут спланирован. Большинство программ занимает 3–4 часа."></StepCard>
            <StepCard n="03" title="Заключение врача" text="Лечащий врач разбирает результаты с вами лично и составляет план наблюдения. Документы — в личном кабинете."></StepCard>
          </div>
        </div>
      </section>

      {/* Подробные карточки программ */}
      <section style={{ padding: "64px 0 96px" }}>
        <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {ProgData.programs.map((p, i) => (
            <ProgramDetail key={p.id} p={p} i={i} onBook={onBook}></ProgramDetail>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section-tint" style={{ padding: "72px 0" }}>
        <div className="wrap" style={{ textAlign: "center", maxWidth: 720, marginLeft: "auto", marginRight: "auto" }}>
          <h2 className="h-1" style={{ marginBottom: 14 }}>Не знаете, какая программа подойдёт?</h2>
          <p className="lead" style={{ marginBottom: 28 }}>
            Позвоните — терапевт задаст несколько вопросов и порекомендует состав обследования.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={onBook}>Записаться</button>
            <a className="btn btn-outline" href="tel:84993333000">8 (499) 333-30-00</a>
          </div>
        </div>
      </section>
    </main>
  );
}

function StepCard({ n, title, text }) {
  return (
    <div className="card" style={{ padding: 26 }}>
      <div style={{ fontFamily: "var(--serif)", fontSize: 15, color: "var(--accent-dark)", marginBottom: 12 }}>{n}</div>
      <div className="h-3" style={{ marginBottom: 8 }}>{title}</div>
      <p className="small body-soft">{text}</p>
    </div>
  );
}

function ProgramDetail({ p, i, onBook }) {
  const isCheckup = p.tag === "Чек-ап";
  return (
    <div
      className="card two-col pad-resp"
      style={{
        display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 48,
        padding: 40, boxShadow: "var(--shadow-sm)",
        background: isCheckup ? "var(--accent-tint)" : "var(--white)",
        borderColor: isCheckup ? "rgba(154,123,79,0.3)" : "var(--line)",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span className="badge badge-neutral" style={{ background: "rgba(21,35,58,0.08)" }}>{p.tag}</span>
          <span className="small" style={{ color: "var(--ink-faint)", fontWeight: 600 }}>{p.meta}</span>
        </div>
        <h2 className="h-1" style={{ fontSize: 32 }}>{p.name}</h2>
        <p className="body-soft" style={{ fontSize: 15.5 }}>{p.audience}</p>
        <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
          <button className="btn btn-ink btn-sm" onClick={onBook}>Записаться на программу</button>
        </div>
      </div>
      <div>
        <div className="overline" style={{ marginBottom: 16 }}>Что входит</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {p.includes.map((inc, j) => (
            <div key={inc} style={{
              display: "flex", gap: 12, alignItems: "baseline",
              padding: "10px 0", borderTop: j === 0 ? "none" : "1px solid " + (isCheckup ? "rgba(154,123,79,0.18)" : "var(--line-soft)"),
            }}>
              <span style={{ fontFamily: "var(--serif)", fontSize: 13, color: "var(--accent-dark)", flex: "none", width: 20 }}>
                {String(j + 1).padStart(2, "0")}
              </span>
              <span style={{ fontSize: 15 }}>{inc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { PagePrograms });
