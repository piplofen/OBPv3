// ОБП ЛК — медкарта, госпитализация, программа, карта территории, графики
const { useState: useLk2State } = React;
const LK2D = window.OBP_LK;

/* ---------- График динамики показателя ---------- */
function LineChart({ series }) {
  const W = 320, H = 130, padL = 28, padR = 34, padT = 16, padB = 26;
  const vals = series.points.map((p) => p[1]);
  const lo = Math.min(...vals, series.norm[0]);
  const hi = Math.max(...vals, series.norm[1] === 100 ? Math.max(...vals) + 8 : series.norm[1]);
  const span = hi - lo || 1;
  const x = (i) => padL + (i / (series.points.length - 1)) * (W - padL - padR);
  const y = (v) => padT + (1 - (v - lo) / span) * (H - padT - padB);
  const nTop = Math.min(y(series.norm[1]), H - padB);
  const nBot = Math.min(y(series.norm[0]), H - padB);
  const last = series.points[series.points.length - 1][1];
  const inNorm = last >= series.norm[0] && last <= series.norm[1];

  return (
    <div className="card" style={{ padding: 22, display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{series.name}</div>
          <div className="small" style={{ color: "var(--ink-faint)", fontSize: 12 }}>норма {series.norm[0]}–{series.norm[1]} {series.unit}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "var(--serif)", fontSize: 26, lineHeight: 1 }}>{last}</div>
          <span className={"badge " + (inNorm ? "badge-ok" : "badge-warn")} style={{ fontSize: 11 }}>{inNorm ? "в норме" : "выше нормы"}</span>
        </div>
      </div>
      <svg viewBox={"0 0 " + W + " " + H} style={{ width: "100%", display: "block" }}>
        <rect x={padL} y={Math.max(nTop, padT)} width={W - padL - padR} height={Math.max(0, Math.min(nBot, H - padB) - Math.max(nTop, padT))} fill="rgba(46,125,82,0.08)" rx="4"></rect>
        <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="var(--line)" strokeWidth="1"></line>
        <polyline
          points={series.points.map((p, i) => x(i) + "," + y(p[1])).join(" ")}
          fill="none" stroke="var(--accent)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
        ></polyline>
        {series.points.map((p, i) => (
          <g key={i}>
            <circle cx={x(i)} cy={y(p[1])} r="4.4" fill="var(--paper)" stroke="var(--accent)" strokeWidth="2.2"></circle>
            <text x={x(i)} y={H - 8} textAnchor="middle" fontSize="10.5" fill="var(--ink-faint)" fontFamily="var(--sans)">{p[0]}</text>
            <text x={x(i)} y={y(p[1]) - 10} textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--ink)" fontFamily="var(--sans)">{p[1]}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ---------- Медкарта: история визитов ---------- */
function LKMedcard({ cur }) {
  const visits = cur.visits || [];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div>
          <h1 className="h-1" style={{ fontSize: 32, marginBottom: 6 }}>Медкарта</h1>
          <p className="body-soft" style={{ fontSize: 15 }}>История визитов и заключения врачей · {cur.patient.name}</p>
        </div>
        <button className="btn btn-outline btn-sm">Выписка из карты (PDF)</button>
      </div>

      {visits.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: "center", color: "var(--ink-faint)" }}>Визитов пока не было.</div>
      ) : (
        <div style={{ position: "relative", paddingLeft: 26 }}>
          <div style={{ position: "absolute", left: 7, top: 8, bottom: 8, width: 2, background: "var(--line)", borderRadius: 2 }}></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {visits.map((v) => (
              <div key={v.id} style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: -26, top: 22, width: 12, height: 12, borderRadius: 99, background: "var(--accent)", border: "3px solid var(--paper)" }}></div>
                <div className="card" style={{ padding: "18px 24px", display: "flex", gap: 18, alignItems: "flex-start", flexWrap: "wrap" }}>
                  <div style={{ width: 92, flex: "none" }}>
                    <div style={{ fontFamily: "var(--serif)", fontSize: 17 }}>{v.date}</div>
                    <span className="badge badge-neutral" style={{ marginTop: 6, fontSize: 11 }}>{v.type}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 220 }}>
                    <div style={{ fontWeight: 700, fontSize: 15.5 }}>{v.title}</div>
                    <div className="small" style={{ color: "var(--ink-faint)", margin: "2px 0 6px" }}>{v.doctor}</div>
                    <p className="small body-soft">{v.summary}</p>
                  </div>
                  <button className="btn btn-outline btn-sm" style={{ padding: "7px 16px", fontSize: 13 }}>Заключение</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Госпитализация ---------- */
function LKHospital({ cur }) {
  const h = cur.hospitalization;
  const [checked, setChecked] = useLk2State({});
  if (!h) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <h1 className="h-1" style={{ fontSize: 32 }}>Госпитализация</h1>
        <div className="card" style={{ padding: 40, textAlign: "center", color: "var(--ink-faint)" }}>
          Плановых госпитализаций нет. Направление оформляет лечащий врач.
        </div>
      </div>
    );
  }
  const doneCount = Object.values(checked).filter(Boolean).length;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <h1 className="h-1" style={{ fontSize: 32 }}>Госпитализация</h1>

      <div className="card" style={{ padding: 28, boxShadow: "var(--shadow-sm)", display: "flex", flexDirection: "column", gap: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 18, flexWrap: "wrap" }}>
          <div>
            <div className="overline" style={{ marginBottom: 8 }}>Плановая госпитализация</div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 28 }}>{h.date} · {h.time}</div>
            <div className="body-soft" style={{ marginTop: 6 }}>{h.dept} · {h.room}</div>
            <div className="small" style={{ marginTop: 4, color: "var(--ink-faint)" }}>Лечащий врач: {h.doctor}</div>
          </div>
          <div className="cta-right" style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
            <span className="badge badge-warn">Идёт подготовка</span>
            <a href="#" onClick={(e) => e.preventDefault()} className="small ta-resp" style={{ color: "var(--accent-dark)", fontWeight: 600, textDecoration: "none" }}>{h.phone} — приёмное отделение</a>
          </div>
        </div>

        {/* Степпер */}
        <div style={{ display: "flex", gap: 0, alignItems: "flex-start" }}>
          {h.steps.map((s, i) => (
            <div key={s} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, position: "relative" }}>
              {i > 0 ? (
                <div style={{ position: "absolute", top: 13, right: "50%", width: "100%", height: 2, background: i <= h.currentStep ? "var(--accent)" : "var(--line)", zIndex: 0 }}></div>
              ) : null}
              <div style={{
                width: 28, height: 28, borderRadius: 99, zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12.5, fontWeight: 700,
                background: i < h.currentStep ? "var(--accent)" : i === h.currentStep ? "var(--ink)" : "var(--paper-2)",
                color: i <= h.currentStep ? "#FFFDF8" : "var(--ink-faint)",
                border: "2px solid " + (i <= h.currentStep ? "transparent" : "var(--line)"),
              }}>
                {i < h.currentStep ? "✓" : i + 1}
              </div>
              <div className="small step-label" style={{ fontSize: 12, textAlign: "center", fontWeight: i === h.currentStep ? 700 : 500, color: i === h.currentStep ? "var(--ink)" : "var(--ink-faint)", maxWidth: 110 }}>{s}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 22, alignItems: "start" }}>
        <div className="card" style={{ padding: 26 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Что взять с собой</div>
            <span className="small" style={{ color: "var(--ink-faint)" }}>{doneCount} из {h.checklist.length}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {h.checklist.map((c, i) => (
              <label key={c} style={{
                display: "flex", gap: 12, alignItems: "center", padding: "11px 0", cursor: "pointer",
                borderTop: i === 0 ? "none" : "1px solid var(--line-soft)",
              }}>
                <input
                  type="checkbox"
                  checked={!!checked[i]}
                  onChange={() => setChecked((s) => ({ ...s, [i]: !s[i] }))}
                  style={{ width: 18, height: 18, accentColor: "var(--accent)" }}
                ></input>
                <span style={{ fontSize: 14.5, textDecoration: checked[i] ? "line-through" : "none", color: checked[i] ? "var(--ink-faint)" : "var(--ink)" }}>{c}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="card" style={{ padding: 26, background: "var(--accent-tint)", borderColor: "rgba(154,123,79,0.3)" }}>
          <div className="overline" style={{ marginBottom: 12 }}>Памятка</div>
          <p style={{ fontSize: 14.5, lineHeight: 1.6 }}>{h.note}</p>
          <hr className="divider" style={{ margin: "16px 0", borderColor: "rgba(154,123,79,0.25)" }}></hr>
          <p className="small body-soft">Пропуск на день госпитализации будет оформлен автоматически и появится в разделе «Пропуска».</p>
        </div>
      </div>
    </div>
  );
}

/* ---------- Моя программа ---------- */
function LKProgram({ cur, goBooking }) {
  const p = cur.program;
  if (!p) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <h1 className="h-1" style={{ fontSize: 32 }}>Моя программа</h1>
        <div className="card" style={{ padding: 40, textAlign: "center", color: "var(--ink-faint)" }}>
          Активных программ нет. Посмотрите чек-апы и комплексные программы на сайте больницы.
        </div>
      </div>
    );
  }
  const done = p.items.filter((i) => i.status === "Пройдено").length;
  const pct = Math.round((done / p.items.length) * 100);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <h1 className="h-1" style={{ fontSize: 32 }}>Моя программа</h1>

      <div className="card" style={{ padding: 28, boxShadow: "var(--shadow-sm)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 14 }}>
          <div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 26 }}>{p.name}</div>
            <div className="small body-soft" style={{ marginTop: 4 }}>Пройдено {done} из {p.items.length} обследований</div>
          </div>
          <div style={{ fontFamily: "var(--serif)", fontSize: 36, color: "var(--accent-dark)" }}>{pct}%</div>
        </div>
        <div style={{ height: 8, borderRadius: 99, background: "var(--paper-2)", overflow: "hidden" }}>
          <div style={{ width: pct + "%", height: "100%", borderRadius: 99, background: "var(--accent)", transition: "width .4s ease" }}></div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {p.items.map((it, i) => (
          <div key={it.name} className="card" style={{ padding: "16px 22px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--serif)", fontSize: 14, color: "var(--accent-dark)", width: 24, flex: "none" }}>{String(i + 1).padStart(2, "0")}</span>
            <span style={{ flex: 1, minWidth: 200, fontWeight: 600, fontSize: 15, textDecoration: it.status === "Пройдено" ? "line-through" : "none", color: it.status === "Пройдено" ? "var(--ink-faint)" : "var(--ink)" }}>{it.name}</span>
            {it.date ? <span className="small" style={{ color: "var(--ink-faint)" }}>{it.date}</span> : null}
            {it.status === "Пройдено" ? <span className="badge badge-ok">Пройдено</span> : null}
            {it.status === "Запланировано" ? <span className="badge badge-warn">Запланировано</span> : null}
            {it.status === "Не записано" ? (
              <button className="btn btn-outline btn-sm" style={{ padding: "7px 16px", fontSize: 13 }} onClick={goBooking}>Записаться</button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Карта территории ---------- */
function LKMap() {
  const [selId, setSelId] = useLk2State("main");
  const buildings = LK2D.buildings;
  const sel = buildings.find((b) => b.id === selId);
  const kpp = buildings.find((b) => b.id === "kpp");
  const start = { x: kpp.x + kpp.w / 2, y: kpp.y };

  const routeTo = (b) => {
    if (b.id === "kpp") return null;
    const cx = b.x + b.w / 2, cy = b.y + b.h / 2;
    return "M " + start.x + " " + start.y + " L " + start.x + " " + (cy + 0) + " L " + cx + " " + cy;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div>
        <h1 className="h-1" style={{ fontSize: 32, marginBottom: 6 }}>Карта территории</h1>
        <p className="body-soft" style={{ fontSize: 15 }}>Мичуринский проспект, 6. Выберите корпус — покажем маршрут от КПП.</p>
      </div>

      <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1.5fr 0.9fr", gap: 22, alignItems: "start" }}>
        <div className="card" style={{ padding: 18 }}>
          <svg viewBox="0 0 640 360" style={{ width: "100%", display: "block" }}>
            <rect x="4" y="4" width="632" height="352" rx="16" fill="var(--paper)" stroke="var(--line)" strokeDasharray="5 5"></rect>
            <text x="20" y="32" fontSize="12" fill="var(--ink-faint)" fontFamily="SF Mono, ui-monospace, monospace">схема территории · демо</text>
            {selId !== "kpp" && sel ? (
              <path d={routeTo(sel)} fill="none" stroke="var(--accent)" strokeWidth="3" strokeDasharray="7 6" strokeLinecap="round" strokeLinejoin="round"></path>
            ) : null}
            {buildings.map((b) => {
              const active = b.id === selId;
              return (
                <g key={b.id} onClick={() => setSelId(b.id)} style={{ cursor: "pointer" }}>
                  <rect
                    x={b.x} y={b.y} width={b.w} height={b.h} rx="10"
                    fill={active ? "var(--ink)" : b.id === "park" ? "var(--paper-2)" : "var(--white)"}
                    stroke={active ? "var(--ink)" : "var(--line)"} strokeWidth="1.5"
                  ></rect>
                  <text
                    x={b.x + b.w / 2} y={b.y + b.h / 2 + 4} textAnchor="middle"
                    fontSize="12.5" fontWeight="600" fontFamily="var(--sans)"
                    fill={active ? "#FFFDF8" : "var(--ink)"}
                  >{b.name}</text>
                </g>
              );
            })}
            <circle cx={start.x} cy={start.y} r="6" fill="var(--accent)" stroke="var(--paper)" strokeWidth="2.5"></circle>
          </svg>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="card" style={{ padding: 24 }}>
            <div className="overline" style={{ marginBottom: 10 }}>{sel.id === "kpp" ? "Вход" : "Корпус"}</div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 24, marginBottom: 6 }}>{sel.name}</div>
            <p className="small body-soft">{sel.info}</p>
            {sel.id !== "kpp" ? (
              <p className="small" style={{ marginTop: 10, color: "var(--accent-dark)", fontWeight: 600 }}>Маршрут от КПП показан пунктиром</p>
            ) : null}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {buildings.map((b) => (
              <button
                key={b.id}
                className="lk-item"
                style={b.id === selId ? { background: "var(--ink)", color: "#FFFDF8" } : {}}
                onClick={() => setSelId(b.id)}
              >
                <span>{b.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { LineChart, LKMedcard, LKHospital, LKProgram, LKMap });
