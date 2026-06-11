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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <h1 className="h-1" style={{ fontSize: 32 }}>Исследования и анализы</h1>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {view === "list" ? chips.map((c) => (
            <button
              key={c.id}
              onClick={() => setKind(c.id)}
              style={{
                border: "1px solid " + (kind === c.id ? "var(--ink)" : "rgba(21,35,58,0.2)"),
                background: kind === c.id ? "var(--ink)" : "var(--white)",
                color: kind === c.id ? "#FFFDF8" : "var(--ink)",
                borderRadius: 999, padding: "8px 18px", fontSize: 13.5, fontWeight: 600,
              }}
            >
              {c.label}
            </button>
          )) : null}
          <div style={{ display: "flex", border: "1px solid var(--line)", borderRadius: 999, overflow: "hidden", background: "var(--white)" }}>
            {[{ id: "list", label: "Список" }, { id: "charts", label: "Динамика" }].map((v) => (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                style={{
                  border: "none", padding: "8px 18px", fontSize: 13.5, fontWeight: 600,
                  background: view === v.id ? "var(--accent)" : "transparent",
                  color: view === v.id ? "#FFFDF8" : "var(--ink-soft)",
                }}
              >
                {v.label}
              </button>
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

/* ---------- Запись на приём: врач + сетка расписания ---------- */
function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function LKBooking({ appointments, onBooked, onCancel, onUpdate, goPasses }) {
  const [docIdx, setDocIdx] = useLkpState(0);
  const [sel, setSel] = useLkpState(null); // {day, time}
  const [booked, setBooked] = useLkpState(null);
  const [resched, setResched] = useLkpState(null); // appt being rescheduled
  const doc = SITE.doctors[docIdx];

  const available = (day, time) => hashStr(doc.name + day.date + time) % 3 !== 0;

  const confirm = () => {
    const endIdx = LKPD.scheduleSlots.indexOf(sel.time);
    const timeEnd = LKPD.scheduleSlots[endIdx + 1] || "17:00";
    if (resched) {
      onUpdate(resched.id, { date: sel.day.wd + ", " + sel.day.date, time: sel.time });
      setBooked({ ...resched, date: sel.day.wd + ", " + sel.day.date, time: sel.time, moved: true });
      setResched(null);
      setSel(null);
      return;
    }
    const appt = {
      id: "ap" + Date.now(),
      doctor: doc.name,
      role: doc.role,
      date: sel.day.wd + ", " + sel.day.date,
      time: sel.time,
      timeEnd: timeEnd,
      place: "Поликлиника, каб. " + (200 + (hashStr(doc.name) % 40)),
    };
    onBooked(appt);
    setBooked(appt);
    setSel(null);
  };

  const startResched = (appt) => {
    setBooked(null);
    const i = SITE.doctors.findIndex((d) => d.name === appt.doctor);
    if (i >= 0) setDocIdx(i);
    setResched(appt);
    setSel(null);
    window.scrollTo(0, 0);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <h1 className="h-1" style={{ fontSize: 32 }}>Запись на приём</h1>

      {booked ? (
        <div className="card" style={{ padding: 26, borderColor: "rgba(46,125,82,0.4)", background: "var(--ok-bg)", display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
          <span className="badge badge-ok">{booked.moved ? "Запись перенесена" : "Запись подтверждена"}</span>
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ fontWeight: 700 }}>{booked.doctor}</div>
            <div className="small body-soft">{booked.date} · {booked.time} · {booked.place}</div>
          </div>
          <button className="btn btn-ink btn-sm" onClick={goPasses}>Показать пропуск</button>
        </div>
      ) : null}

      {resched ? (
        <div className="card" style={{ padding: "18px 24px", borderColor: "rgba(149,104,15,0.4)", background: "var(--warn-bg)", display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
          <span className="badge badge-warn">Перенос записи</span>
          <div style={{ flex: 1, minWidth: 220, fontSize: 14.5 }}>
            <strong>{resched.doctor}</strong> · сейчас: {resched.date}, {resched.time}. Выберите новое время в сетке ниже.
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => setResched(null)}>Отменить перенос</button>
        </div>
      ) : null}

      {/* Мои записи */}
      {appointments.length > 0 && !resched ? (
        <div>
          <div className="overline" style={{ marginBottom: 12 }}>Мои записи</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {appointments.map((a) => (
              <ApptCard key={a.id} appt={a} onCancel={onCancel} onResched={startResched}></ApptCard>
            ))}
          </div>
        </div>
      ) : null}

      <div>
        <div className="overline" style={{ marginBottom: 12 }}>Новая запись · Шаг 1 · Выберите врача</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }} className="two-col">
          {SITE.doctors.map((d, i) => (
            <button key={d.name} className={"doc-chip" + (i === docIdx ? " sel" : "")} onClick={() => { setDocIdx(i); setSel(null); }}>
              <span className="avatar" style={{ width: 38, height: 38, fontSize: 12.5 }}>
                {d.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
              </span>
              <span style={{ minWidth: 0 }}>
                <span style={{ display: "block", fontWeight: 700, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.name}</span>
                <span className="small" style={{ color: "var(--ink-faint)", fontSize: 12, display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.role}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="overline" style={{ marginBottom: 12 }}>Шаг 2 · Выберите время</div>
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
                      onClick={() => setSel({ day, time })}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {sel ? (
        <div className="card" style={{ padding: "20px 26px", display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap", boxShadow: "var(--shadow)", position: "sticky", bottom: 20 }}>
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ fontWeight: 700 }}>{doc.name}</div>
            <div className="small body-soft">{doc.role}</div>
          </div>
          <div style={{ fontFamily: "var(--serif)", fontSize: 22 }}>{sel.day.wd}, {sel.day.date} · {sel.time}</div>
          <button className="btn btn-primary" onClick={confirm}>{resched ? "Перенести сюда" : "Подтвердить запись"}</button>
        </div>
      ) : null}
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
