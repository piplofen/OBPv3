// ОБП — Врачи (с фильтром) и страница «О больнице»
const DocData = window.OBP_DATA;
const { useState: useDocState } = React;

function PageDoctors({ onBook }) {
  const [filter, setFilter] = useDocState("all");
  const chips = [{ id: "all", name: "Все направления" }].concat(
    DocData.directions.map((d) => ({ id: d.id, name: d.name }))
  );
  const docs = DocData.doctors.filter((d) => filter === "all" || d.dir === filter);

  return (
    <main>
      <PageHero
        overline="Специалисты"
        title="Врачи больницы"
        lead="Кандидаты и доктора медицинских наук, врачи высшей категории. Выберите направление, чтобы отфильтровать список."
      ></PageHero>
      <section style={{ padding: "48px 0 96px" }}>
        <div className="wrap">
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 40, justifyContent: "center" }}>
            {chips.map((c) => (
              <button
                key={c.id}
                onClick={() => setFilter(c.id)}
                style={{
                  border: "1px solid " + (filter === c.id ? "var(--ink)" : "rgba(21,35,58,0.25)"),
                  background: filter === c.id ? "var(--ink)" : "transparent",
                  color: filter === c.id ? "#FFFDF8" : "var(--ink)",
                  borderRadius: 999, padding: "9px 20px", fontSize: 14, fontWeight: 600,
                  transition: "all .15s ease",
                }}
              >
                {c.name}
              </button>
            ))}
          </div>
          <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {docs.map((doc) => (
              <DoctorCard key={doc.name} doc={doc} onBook={onBook}></DoctorCard>
            ))}
          </div>
          {docs.length === 0 ? (
            <p className="body-soft" style={{ textAlign: "center", padding: 48 }}>По этому направлению врачи не найдены.</p>
          ) : null}
        </div>
      </section>
    </main>
  );
}

function PageAbout({ nav, onBook }) {
  return (
    <main>
      <PageHero
        overline="О больнице"
        title="Объединённая больница с поликлиникой"
        lead="Федеральное государственное бюджетное учреждение Управления делами Президента Российской Федерации. Многопрофильная медицина полного цикла."
      ></PageHero>

      <section style={{ padding: "72px 0" }}>
        <div className="wrap two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <h2 className="h-1" style={{ fontSize: 34 }}>Один комплекс — весь путь пациента</h2>
            <p className="body-soft" style={{ fontSize: 16.5 }}>
              Больница объединяет поликлинику, круглосуточный стационар, диагностические
              и реабилитационные подразделения. Пациент проходит обследование, лечение
              и восстановление в одном учреждении, у одной команды врачей.
            </p>
            <p className="body-soft" style={{ fontSize: 16.5 }}>
              Учреждение работает в системе Управления делами Президента Российской
              Федерации и принимает пациентов по ОМС, ДМС и на платной основе.
            </p>
            <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
              <button className="btn btn-primary" onClick={onBook}>Записаться</button>
              <button className="btn btn-outline" onClick={() => nav("directions")}>Отделения</button>
            </div>
          </div>
          <Ph label="фото: исторический корпус больницы" ratio="5 / 4"></Ph>
        </div>
      </section>

      <section className="section section-tint" style={{ padding: "72px 0" }}>
        <div className="wrap">
          <div className="overline" style={{ marginBottom: 12 }}>Принципы</div>
          <h2 className="h-1" style={{ fontSize: 34, marginBottom: 40 }}>Как мы работаем</h2>
          <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            <PrincipleCard n="01" title="Непрерывность" text="Лечащий врач сопровождает пациента на всех этапах — от первого приёма до выписки и реабилитации."></PrincipleCard>
            <PrincipleCard n="02" title="Полный цикл" text="Диагностика, операционные, стационар и восстановление — в одном комплексе, без переездов между клиниками."></PrincipleCard>
            <PrincipleCard n="03" title="Внимание к деталям" text="Координатор помогает с записью, документами и маршрутом — пациент занимается здоровьем, а не логистикой."></PrincipleCard>
          </div>
        </div>
      </section>

      <section style={{ padding: "72px 0 96px" }}>
        <div className="wrap grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          <DocLinkCard title="Лицензии" text="Лицензии на осуществление медицинской деятельности"></DocLinkCard>
          <DocLinkCard title="Документы" text="Уставные документы и сведения об учреждении"></DocLinkCard>
          <DocLinkCard title="Надзорные органы" text="Перечень контролирующих организаций"></DocLinkCard>
        </div>
      </section>
    </main>
  );
}

function PrincipleCard({ n, title, text }) {
  return (
    <div className="card" style={{ padding: 28, background: "var(--white)" }}>
      <div style={{ fontFamily: "var(--serif)", fontSize: 15, color: "var(--accent-dark)", marginBottom: 14 }}>{n}</div>
      <div className="h-3" style={{ marginBottom: 8 }}>{title}</div>
      <p className="small body-soft">{text}</p>
    </div>
  );
}

function DocLinkCard({ title, text }) {
  return (
    <a href="#" onClick={(e) => e.preventDefault()} className="card" style={{ padding: 24, textDecoration: "none", display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="h-3">{title}</span>
        <Arrow color="var(--accent-dark)"></Arrow>
      </span>
      <span className="small body-soft">{text}</span>
    </a>
  );
}

Object.assign(window, { PageDoctors, PageAbout });
