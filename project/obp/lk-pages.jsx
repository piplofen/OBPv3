// ОБП ЛК — разделы: результаты, запись с сеткой, пропуска, профиль
const { useState: useLkpState } = React;
const LKPD = window.OBP_LK;
const SITE = window.OBP_DATA;

/* ---------- Исследования и анализы ---------- */
function LKResults({ cur }) {
  const [kind, setKind] = useLkpState("all"); // all | analyses | studies
  const [view, setView] = useLkpState("list"); // list | charts
  const rows = []
    .concat(kind !== "studies" ? cur.analyses.map((a) => ({ ...a, kind: "Анализ" })) : [])
    .concat(kind !== "analyses" ? cur.studies.map((s) => ({ ...s, kind: "Исследование" })) : []);

  const chips = [
    { id: "all", label: "Всё" },
    { id: "analyses", label: "Анализы" },
    { id: "studies", label: "Исследования" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div className="lk-filterbar">
        <h1 className="h-1" style={{ fontSize: 32 }}>Исследования и анализы</h1>
        <div className="lk-filterbar" style={{ gap: 10 }}>
          {view === "list" ? (
            <div className="seg">
              {chips.map((c) => (
                <button key={c.id} className={kind === c.id ? "on" : ""} onClick={() => setKind(c.id)}>{c.label}</button>
              ))}
            </div>
          ) : null}
          <div className="seg accent">
            {[{ id: "list", label: "Список" }, { id: "charts", label: "Динамика" }].map((v) => (
              <button key={v.id} className={view === v.id ? "on" : ""} onClick={() => setView(v.id)}>{v.label}</button>
            ))}
          </div>
        </div>
      </div>

      {view === "charts" ? (
        cur.dynamics ? (
          <React.Fragment>
            <p className="body-soft" style={{ fontSize: 14.5, marginTop: -8 }}>Показатели по повторным анализам. Зелёная зона — референсные значения.</p>
            <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
              {cur.dynamics.map((s) => (
                <LineChart key={s.id} series={s}></LineChart>
              ))}
            </div>
          </React.Fragment>
        ) : (
          <div className="card" style={{ padding: 40, textAlign: "center", color: "var(--ink-faint)" }}>
            Пока недостаточно повторных анализов, чтобы построить динамику.
          </div>
        )
      ) : (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {rows.map((r) => (
          <div key={r.id} className="card" style={{ padding: "18px 24px", display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
            <span className="badge badge-neutral" style={{ width: 110, justifyContent: "center" }}>{r.kind}</span>
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ fontWeight: 700, fontSize: 15.5 }}>{r.name}</div>
              <div className="small body-soft">
                {r.date}{r.doctor ? " · " + r.doctor : ""}{r.note ? " · " + r.note : ""}
              </div>
            </div>
            <span className={"badge " + (r.status === "Готов" ? "badge-ok" : "badge-warn")}>{r.status}</span>
            {r.status === "Готов" ? (
              <button className="btn btn-outline btn-sm">Открыть PDF</button>
            ) : (
              <span className="small" style={{ color: "var(--ink-faint)" }}>ожидается</span>
            )}
          </div>
        ))}
      </div>
      )}
    </div>
  );
}

/* ---------- Запись на приём: 5-шаговый степпер ---------- */
function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

const BOOK_STEPS = ["Специальность", "Врач", "Услуги", "Время", "Готово"];

function money(n) {
  return n.toLocaleString("ru-RU") + " ₽";
}

function LKBooking({ appointments, onBooked, onCancel, onUpdate, goPasses }) {
  const [step, setStep] = useLkpState(1);
  const [specId, setSpecId] = useLkpState(null);
  const [docName, setDocName] = useLkpState(null);
  const [serviceId, setServiceId] = useLkpState(null);
  const [sel, setSel] = useLkpState(null); // {day, time}
  const [booked, setBooked] = useLkpState(null);
  const [resched, setResched] = useLkpState(null);
  const [mode, setMode] = useLkpState("list"); // list | flow

  const doc = SITE.doctors.find((d) => d.name === docName) || null;
  const spec = SITE.specialties.find((s) => s.id === specId) || null;
  const services = (specId && SITE.services[specId]) || [];
  const service = services.find((s) => s.id === serviceId) || null;

  const available = (day, time) => !doc || hashStr(doc.name + day.date + time) % 3 !== 0;

  const reset = () => {
    setStep(1); setSpecId(null); setDocName(null); setServiceId(null); setSel(null); setResched(null);
  };
  const backToList = () => { reset(); setMode("list"); };
  const openFlow = () => { reset(); setMode("flow"); };

  const confirm = () => {
    const endIdx = LKPD.scheduleSlots.indexOf(sel.time);
    const timeEnd = LKPD.scheduleSlots[endIdx + 1] || "17:00";
    if (resched) {
      onUpdate(resched.id, { date: sel.day.wd + ", " + sel.day.date, time: sel.time });
      setBooked({ ...resched, date: sel.day.wd + ", " + sel.day.date, time: sel.time, moved: true });
      setResched(null); setSel(null);
      window.scrollTo(0, 0);
      return;
    }
    const appt = {
      id: "ap" + Date.now(),
      doctor: doc.name,
      role: doc.role,
      service: service ? service.name : null,
      price: service ? service.price : null,
      date: sel.day.wd + ", " + sel.day.date,
      time: sel.time,
      timeEnd: timeEnd,
      place: "Поликлиника, каб. " + (200 + (hashStr(doc.name) % 40)),
    };
    onBooked(appt);
    setBooked(appt);
    window.scrollTo(0, 0);
  };

  const startResched = (appt) => {
    setBooked(null);
    const d = SITE.doctors.find((x) => x.name === appt.doctor);
    setDocName(appt.doctor);
    setSpecId(d ? d.spec : null);
    setServiceId(null);
    setSel(null);
    setResched(appt);
    setMode("flow");
    setStep(4);
    window.scrollTo(0, 0);
  };

  // Успех
  if (booked) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <h1 className="h-1" style={{ fontSize: 32 }}>Запись на приём</h1>
        <div className="card" style={{ padding: 32, textAlign: "center", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <span style={{ width: 56, height: 56, borderRadius: 99, background: "var(--ok-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M6 13.5 11 18l9-10" stroke="var(--ok)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"></path></svg>
            </span>
          </div>
          <h2 className="h-2" style={{ marginBottom: 10 }}>{booked.moved ? "Запись перенесена" : "Запись подтверждена"}</h2>
          <p className="body-soft" style={{ maxWidth: 420, margin: "0 auto 8px" }}>
            {booked.doctor}{booked.service ? " · " + booked.service : ""}
          </p>
          <div style={{ fontFamily: "var(--serif)", fontSize: 24, marginBottom: 4 }}>{booked.date} · {booked.time}</div>
          <div className="small body-soft" style={{ marginBottom: 24 }}>{booked.place}{booked.price ? " · " + money(booked.price) : ""}</div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn btn-ink" onClick={goPasses}>Показать пропуск</button>
            <button className="btn btn-outline" onClick={() => { setBooked(null); backToList(); }}>К моим записям</button>
          </div>
        </div>
      </div>
    );
  }

  // Список записей — стартовый экран
  if (mode === "list") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <h1 className="h-1" style={{ fontSize: 32 }}>Запись на приём</h1>
          <button className="btn btn-primary" onClick={openFlow}>Записаться на приём</button>
        </div>
        {appointments.length > 0 ? (
          <div>
            <div className="overline" style={{ marginBottom: 12 }}>Мои записи</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {appointments.map((a) => (
                <ApptCard key={a.id} appt={a} onCancel={onCancel} onResched={startResched}></ApptCard>
              ))}
            </div>
          </div>
        ) : (
          <div className="card" style={{ padding: 44, textAlign: "center", display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
            <span style={{ width: 52, height: 52, borderRadius: 99, background: "var(--accent-tint)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-dark)" }}>
              <LkIcon name="cal" size={24}></LkIcon>
            </span>
            <div>
              <div className="h-3" style={{ marginBottom: 4 }}>Активных записей нет</div>
              <p className="small body-soft">Запишитесь на приём — координатор подтвердит время.</p>
            </div>
            <button className="btn btn-primary" onClick={openFlow}>Записаться на приём</button>
          </div>
        )}
      </div>
    );
  }

  const goStep = (n) => { if (n <= step) setStep(n); };

  // Степпер новой записи
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <h1 className="h-1" style={{ fontSize: 32 }}>{resched ? "Перенос записи" : "Новая запись"}</h1>
        <button className="btn btn-outline btn-sm" onClick={backToList}>← Мои записи</button>
      </div>

      {resched ? (
        <div className="card" style={{ padding: "18px 24px", borderColor: "rgba(149,104,15,0.4)", background: "var(--warn-bg)", display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
          <span className="badge badge-warn">Перенос записи</span>
          <div style={{ flex: 1, minWidth: 220, fontSize: 14.5 }}>
            <strong>{resched.doctor}</strong> · сейчас: {resched.date}, {resched.time}. Выберите новое время.
          </div>
        </div>
      ) : null}

      {/* Индикатор шагов */}
      <div className="book-steps" style={{ display: "flex", gap: 0, alignItems: "flex-start", overflowX: "auto", paddingBottom: 4 }}>
        {BOOK_STEPS.map((s, i) => {
          const n = i + 1;
          const done = n < step;
          const active = n === step;
          return (
            <div key={s} style={{ flex: 1, minWidth: 74, display: "flex", flexDirection: "column", alignItems: "center", gap: 7, position: "relative" }}>
              {i > 0 ? (
                <div style={{ position: "absolute", top: 14, right: "50%", width: "100%", height: 2, background: n <= step ? "var(--accent)" : "var(--line)", zIndex: 0 }}></div>
              ) : null}
              <button
                onClick={() => goStep(n)}
                style={{
                  width: 30, height: 30, borderRadius: 99, zIndex: 1, border: "2px solid " + (n <= step ? "transparent" : "var(--line)"),
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700,
                  background: done ? "var(--accent)" : active ? "var(--ink)" : "var(--paper-2)",
                  color: n <= step ? "#FFFDF8" : "var(--ink-faint)",
                  cursor: n <= step ? "pointer" : "default",
                }}
              >
                {done ? "✓" : n}
              </button>
              <span className="book-step-label" style={{ fontSize: 11.5, textAlign: "center", fontWeight: active ? 700 : 500, color: active ? "var(--ink)" : "var(--ink-faint)", lineHeight: 1.25 }}>{s}</span>
            </div>
          );
        })}
      </div>

      {/* Шаг 1 — Специальность */}
      {step === 1 ? (
        <div>
          <div className="overline" style={{ marginBottom: 12 }}>Шаг 1 · Выберите специальность</div>
          <div className="grid-4 stack-sm" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {SITE.specialties.map((s) => {
              const cnt = SITE.doctors.filter((d) => d.spec === s.id).length;
              return (
                <button
                  key={s.id}
                  className={"doc-chip" + (specId === s.id ? " sel" : "")}
                  style={{ alignItems: "flex-start", padding: "16px 18px", flexDirection: "column", gap: 4 }}
                  onClick={() => { setSpecId(s.id); setDocName(null); setServiceId(null); setSel(null); setStep(2); }}
                >
                  <span style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>{s.name}</span>
                    <Arrow color="var(--ink-faint)"></Arrow>
                  </span>
                  <span className="small" style={{ color: "var(--ink-faint)", lineHeight: 1.4 }}>{s.desc}</span>
                  <span className="small" style={{ color: "var(--accent-dark)", fontWeight: 600, marginTop: 2 }}>{cnt} {cnt === 1 ? "врач" : "врача"}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Шаг 2 — Врач */}
      {step === 2 ? (
        <div>
          <StepHead n="Шаг 2" title="Выберите врача" sub={spec ? spec.name : ""} onBack={() => setStep(1)}></StepHead>
          <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {SITE.doctors.filter((d) => d.spec === specId).map((d) => (
              <button
                key={d.name}
                className={"doc-chip" + (docName === d.name ? " sel" : "")}
                style={{ padding: "12px 16px 12px 12px" }}
                onClick={() => { setDocName(d.name); setServiceId(null); setSel(null); setStep(3); }}
              >
                <span className="avatar" style={{ width: 44, height: 44, fontSize: 14 }}>
                  {d.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                </span>
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: "block", fontWeight: 700, fontSize: 14.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.name}</span>
                  <span className="small" style={{ color: "var(--ink-faint)", fontSize: 12.5, display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.role}</span>
                  <span className="small" style={{ color: "var(--accent-dark)", fontWeight: 600, fontSize: 12 }}>{d.degree} · {d.exp}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {/* Шаг 3 — Услуги */}
      {step === 3 ? (
        <div>
          <StepHead n="Шаг 3" title="Выберите услугу" sub={doc ? doc.name : ""} onBack={() => setStep(2)}></StepHead>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {services.map((s) => (
              <button
                key={s.id}
                className="card"
                onClick={() => { setServiceId(s.id); setSel(null); setStep(4); }}
                style={{
                  padding: "16px 22px", display: "flex", alignItems: "center", gap: 16, textAlign: "left",
                  border: "1px solid " + (serviceId === s.id ? "var(--ink)" : "var(--line)"),
                  boxShadow: serviceId === s.id ? "0 0 0 1px var(--ink)" : "none", background: "var(--white)",
                }}
              >
                <span style={{ width: 20, height: 20, borderRadius: 99, flex: "none", border: "2px solid " + (serviceId === s.id ? "var(--accent)" : "var(--line)"), display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {serviceId === s.id ? <span style={{ width: 10, height: 10, borderRadius: 99, background: "var(--accent)" }}></span> : null}
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontWeight: 600, fontSize: 15 }}>{s.name}</span>
                  <span className="small" style={{ color: "var(--ink-faint)" }}>{s.dur}</span>
                </span>
                <span style={{ fontFamily: "var(--serif)", fontSize: 19, whiteSpace: "nowrap" }}>{money(s.price)}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {/* Шаг 4 — Время */}
      {step === 4 ? (
        <div>
          <StepHead n="Шаг 4" title="Выберите время" sub={doc ? doc.name : ""} onBack={resched ? backToList : () => setStep(3)}></StepHead>
          <div className="card" style={{ padding: 22, overflowX: "auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(" + LKPD.scheduleDays.length + ", minmax(96px, 1fr))", gap: 10, minWidth: 560 }}>
              {LKPD.scheduleDays.map((day) => (
                <div key={day.date} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ textAlign: "center", paddingBottom: 6, borderBottom: "1px solid var(--line-soft)", marginBottom: 4 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{day.wd}</div>
                    <div className="small" style={{ color: "var(--ink-faint)", fontSize: 12 }}>{day.date}</div>
                  </div>
                  {LKPD.scheduleSlots.map((time) => {
                    const free = available(day, time);
                    const isSel = sel && sel.day.date === day.date && sel.time === time;
                    return (
                      <button
                        key={time}
                        className={"slot" + (free ? "" : " taken") + (isSel ? " sel" : "")}
                        disabled={!free}
                        onClick={() => { setSel({ day, time }); if (!resched) setStep(5); }}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          {resched && sel ? (
            <div className="card sticky-confirm" style={{ marginTop: 16, padding: "18px 24px", display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap", boxShadow: "var(--shadow)", position: "sticky", bottom: 20 }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontWeight: 700 }}>{resched.doctor}</div>
                <div className="small body-soft">Новое время: {sel.day.wd}, {sel.day.date} · {sel.time}</div>
              </div>
              <button className="btn btn-primary" onClick={confirm}>Перенести сюда</button>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Шаг 5 — Подтверждение */}
      {step === 5 ? (
        <div>
          <StepHead n="Шаг 5" title="Подтверждение записи" sub="" onBack={() => setStep(4)}></StepHead>
          <div className="card" style={{ padding: 28, boxShadow: "var(--shadow-sm)" }}>
            <ConfirmRow label="Специальность" value={spec ? spec.name : "—"}></ConfirmRow>
            <ConfirmRow label="Врач" value={doc ? doc.name : "—"} sub={doc ? doc.role : ""}></ConfirmRow>
            <ConfirmRow label="Услуга" value={service ? service.name : "—"} sub={service ? service.dur : ""}></ConfirmRow>
            <ConfirmRow label="Дата и время" value={sel ? sel.day.wd + ", " + sel.day.date + " · " + sel.time : "—"}></ConfirmRow>
            <ConfirmRow label="Место" value={doc ? "Поликлиника, каб. " + (200 + (hashStr(doc.name) % 40)) : "—"}></ConfirmRow>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 18, marginTop: 6, borderTop: "1px solid var(--line)" }}>
              <span style={{ fontWeight: 700, fontSize: 16 }}>Стоимость</span>
              <span style={{ fontFamily: "var(--serif)", fontSize: 26 }}>{service ? money(service.price) : "—"}</span>
            </div>
            <p className="small" style={{ color: "var(--ink-faint)", marginTop: 14 }}>
              Оплата в клинике в день приёма. По ДМS приём может быть бесплатным — уточните у координатора.
            </p>
            <button className="btn btn-primary" style={{ width: "100%", marginTop: 18 }} onClick={confirm}>Подтвердить запись</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function StepHead({ n, title, sub, onBack }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14, flexWrap: "wrap" }}>
      <button className="btn btn-outline btn-sm" onClick={onBack} style={{ padding: "8px 14px" }}>← Назад</button>
      <div>
        <div className="overline" style={{ marginBottom: 2 }}>{n}{sub ? " · " + sub : ""}</div>
        <div style={{ fontWeight: 700, fontSize: 17 }}>{title}</div>
      </div>
    </div>
  );
}

function ConfirmRow({ label, value, sub }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "12px 0", borderBottom: "1px solid var(--line-soft)" }}>
      <span className="small" style={{ color: "var(--ink-faint)", flex: "none" }}>{label}</span>
      <span style={{ textAlign: "right", minWidth: 0 }}>
        <span style={{ display: "block", fontWeight: 600, fontSize: 14.5 }}>{value}</span>
        {sub ? <span className="small" style={{ color: "var(--ink-faint)" }}>{sub}</span> : null}
      </span>
    </div>
  );
}

/* ---------- Карточка записи: перенос, отмена, памятка ---------- */
function ApptCard({ appt, onCancel, onResched }) {
  const [confirmCancel, setConfirmCancel] = useLkpState(false);
  const [showPrep, setShowPrep] = useLkpState(false);
  return (
    <div className="card" style={{ padding: "18px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div style={{ width: 110, flex: "none" }}>
          <div style={{ fontFamily: "var(--serif)", fontSize: 19, lineHeight: 1.2 }}>{appt.date}</div>
          <div className="small" style={{ color: "var(--accent-dark)", fontWeight: 700 }}>{appt.time}</div>
        </div>
        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{appt.doctor}</div>
          <div className="small body-soft">{appt.role} · {appt.place}</div>
        </div>
        {confirmCancel ? (
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <span className="small" style={{ fontWeight: 600 }}>Отменить запись?</span>
            <button className="btn btn-sm" style={{ background: "#A33B2E", color: "#fff" }} onClick={() => onCancel(appt.id)}>Да, отменить</button>
            <button className="btn btn-outline btn-sm" onClick={() => setConfirmCancel(false)}>Нет</button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {appt.prep ? (
              <button className="btn btn-outline btn-sm" style={{ padding: "7px 16px", fontSize: 13 }} onClick={() => setShowPrep(!showPrep)}>
                {showPrep ? "Скрыть памятку" : "Подготовка"}
              </button>
            ) : null}
            <button className="btn btn-outline btn-sm" style={{ padding: "7px 16px", fontSize: 13 }} onClick={() => onResched(appt)}>Перенести</button>
            <button className="btn btn-outline btn-sm" style={{ padding: "7px 16px", fontSize: 13, color: "#A33B2E", borderColor: "rgba(163,59,46,0.4)" }} onClick={() => setConfirmCancel(true)}>Отменить</button>
          </div>
        )}
      </div>
      {showPrep && appt.prep ? (
        <div style={{ background: "var(--warn-bg)", borderRadius: 12, padding: "14px 18px" }}>
          <div className="small" style={{ fontWeight: 700, color: "var(--warn)", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase", fontSize: 11.5 }}>Памятка по подготовке</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {appt.prep.map((p, i) => (
              <div key={i} style={{ display: "flex", gap: 10, fontSize: 14 }}>
                <span style={{ color: "var(--warn)", fontWeight: 700, flex: "none" }}>{i + 1}.</span>
                <span>{p}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* ---------- Пропуска ---------- */
function LKPasses({ passes, addCar }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div>
        <h1 className="h-1" style={{ fontSize: 32, marginBottom: 8 }}>Пропуска</h1>
        <p className="body-soft" style={{ fontSize: 15, maxWidth: 560 }}>
          Покажите QR-код на проходной. Если приезжаете на автомобиле — добавьте его к пропуску, чтобы открыли шлагбаум.
        </p>
      </div>
      {passes.map((p) => (
        <PassCard key={p.id} pass={p} addCar={addCar}></PassCard>
      ))}
    </div>
  );
}

function PassCard({ pass, addCar }) {
  const [adding, setAdding] = useLkpState(false);
  const [model, setModel] = useLkpState("");
  const [plate, setPlate] = useLkpState("");
  const [err, setErr] = useLkpState(false);
  const active = pass.status === "Действует";

  const save = () => {
    if (model.trim().length < 2 || plate.trim().length < 5) { setErr(true); return; }
    addCar(pass.id, { model: model.trim(), plate: plate.trim().toUpperCase() });
    setAdding(false); setModel(""); setPlate(""); setErr(false);
  };

  return (
    <div className="card" style={{ padding: 26, display: "flex", gap: 26, flexWrap: "wrap", opacity: active ? 1 : 0.62, boxShadow: active ? "var(--shadow-sm)" : "none" }}>
      <QRBox code={pass.id} size={132}></QRBox>
      <div style={{ flex: 1, minWidth: 260, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontWeight: 700, fontSize: 16 }}>{pass.title}</span>
          <span className={"badge " + (active ? "badge-ok" : "badge-neutral")}>{pass.status}</span>
        </div>
        <div style={{ fontFamily: "var(--serif)", fontSize: 23 }}>{pass.date} · {pass.time}</div>
        <div className="small body-soft">{pass.place} · № {pass.id}</div>

        <hr className="divider" style={{ margin: "8px 0" }}></hr>

        {pass.car ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "var(--accent-dark)", display: "flex" }}><LkIcon name="car"></LkIcon></span>
            <span style={{ fontWeight: 600, fontSize: 14.5 }}>{pass.car.model}</span>
            <span style={{
              border: "1.5px solid var(--ink)", borderRadius: 6, padding: "3px 10px",
              fontFamily: "SF Mono, ui-monospace, monospace", fontSize: 13.5, fontWeight: 700, letterSpacing: "0.06em",
            }}>{pass.car.plate}</span>
            <span className="small" style={{ color: "var(--ink-faint)" }}>проезд через КПП разрешён</span>
          </div>
        ) : adding ? (
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
            <div className="field" style={{ flex: 1, minWidth: 150 }}>
              <label>Марка и модель</label>
              <input value={model} placeholder="Toyota Camry" onChange={(e) => setModel(e.target.value)}></input>
            </div>
            <div className="field" style={{ width: 160 }}>
              <label>Гос. номер</label>
              <input value={plate} placeholder="А 000 АА 777" onChange={(e) => setPlate(e.target.value)}></input>
            </div>
            <button className="btn btn-ink btn-sm" onClick={save}>Сохранить</button>
            <button className="btn btn-outline btn-sm" onClick={() => { setAdding(false); setErr(false); }}>Отмена</button>
            {err ? <span className="err" style={{ width: "100%", color: "#A33B2E", fontSize: 12.5 }}>Укажите марку и полный гос. номер</span> : null}
          </div>
        ) : active ? (
          <div>
            <button className="btn btn-outline btn-sm" onClick={() => setAdding(true)}>
              <LkIcon name="car" size={16}></LkIcon> Добавить автомобиль
            </button>
          </div>
        ) : (
          <span className="small" style={{ color: "var(--ink-faint)" }}>Пропуск истёк</span>
        )}
      </div>
    </div>
  );
}

/* ---------- Профиль ---------- */
function LKProfile({ cur, family, switchMember }) {
  const p = cur.patient;
  const [form, setForm] = useLkpState({ phone: p.phone, email: p.email });
  const [saved, setSaved] = useLkpState(false);

  React.useEffect(() => { setForm({ phone: p.phone, email: p.email }); setSaved(false); }, [p.name]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22, maxWidth: 720 }}>
      <h1 className="h-1" style={{ fontSize: 32 }}>Профиль пациента</h1>

      <div className="card" style={{ padding: 26, display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
        <div className="avatar" style={{ width: 64, height: 64, fontSize: 20 }}>{p.initials}</div>
        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ fontFamily: "var(--serif)", fontSize: 24 }}>{p.name}</div>
          <div className="small body-soft">{p.dob} · {p.attach}</div>
        </div>
      </div>

      <div className="card" style={{ padding: 26, display: "flex", flexDirection: "column", gap: 18 }}>
        <div className="overline">Документы и полисы</div>
        <ProfileRow label="Полис ОМС" value={p.oms}></ProfileRow>
        <ProfileRow label="Полис ДМС" value={p.dms}></ProfileRow>
        <ProfileRow label="Дата рождения" value={p.dob}></ProfileRow>
      </div>

      <div className="card" style={{ padding: 26, display: "flex", flexDirection: "column", gap: 16 }}>
        <div className="overline">Семейный доступ</div>
        <p className="small body-soft" style={{ marginTop: -8 }}>
          Члены семьи, подключённые к вашему аккаунту. Вы видите их результаты и можете записывать их к врачам.
        </p>
        {family.map((f) => (
          <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 14, borderTop: "1px solid var(--line-soft)", paddingTop: 14 }}>
            <div className="avatar">{f.patient.initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14.5 }}>{f.patient.name}</div>
              <div className="small" style={{ color: "var(--ink-faint)", fontSize: 12.5 }}>{f.rel} · {f.patient.dob}</div>
            </div>
            {cur.id === f.id ? (
              <span className="badge badge-ok">открыт сейчас</span>
            ) : (
              <button className="btn btn-outline btn-sm" style={{ padding: "7px 16px", fontSize: 13 }} onClick={() => switchMember(f.id)}>Открыть кабинет</button>
            )}
          </div>
        ))}
        {cur.id !== "anna" ? (
          <div style={{ borderTop: "1px solid var(--line-soft)", paddingTop: 14 }}>
            <button className="btn btn-outline btn-sm" onClick={() => switchMember("anna")}>← Вернуться в свой кабинет</button>
          </div>
        ) : (
          <div style={{ borderTop: "1px solid var(--line-soft)", paddingTop: 14 }}>
            <button className="btn btn-outline btn-sm">+ Добавить члена семьи</button>
          </div>
        )}
      </div>

      <div className="card" style={{ padding: 26, display: "flex", flexDirection: "column", gap: 18 }}>
        <div className="overline">Контакты</div>
        <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div className="field">
            <label>Телефон</label>
            <input value={form.phone} onChange={(e) => { setForm({ ...form, phone: e.target.value }); setSaved(false); }}></input>
          </div>
          <div className="field">
            <label>E-mail</label>
            <input value={form.email} onChange={(e) => { setForm({ ...form, email: e.target.value }); setSaved(false); }}></input>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button className="btn btn-ink btn-sm" onClick={() => setSaved(true)}>Сохранить</button>
          <button className="btn btn-outline btn-sm">Сменить пароль</button>
          {saved ? <span className="badge badge-ok">Сохранено</span> : null}
        </div>
      </div>
    </div>
  );
}

function ProfileRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 16, borderBottom: "1px solid var(--line-soft)", paddingBottom: 12 }}>
      <span className="small" style={{ color: "var(--ink-faint)" }}>{label}</span>
      <span style={{ fontWeight: 600, fontSize: 14.5, textAlign: "right" }}>{value}</span>
    </div>
  );
}

Object.assign(window, { LKResults, LKBooking, LKPasses, LKProfile });
