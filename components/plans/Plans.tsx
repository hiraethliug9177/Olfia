"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { joinPlus } from "@/lib/mockAuth";
import { PLAN_CARDS, PLAN_FAQ, PLAN_ROWS, hasPrices, plusPrice, type Billing, type PlanId } from "@/lib/plans";

/** Monthly / Yearly, in the same sliding control as Time of day in Rooms (the 11/21 design). Shown once prices exist. */
function BillingSwitch({ value, onChange }: { value: Billing; onChange: (b: Billing) => void }) {
  const opts: Billing[] = ["monthly", "yearly"];
  return (
    <div role="radiogroup" aria-label="Billing" className="seg plans__switch">
      <span className="seg__thumb" aria-hidden="true" style={{ left: `calc(5px + (100% - 10px) * ${opts.indexOf(value) / 2})`, width: "calc((100% - 10px) / 2)" }} />
      {opts.map((b) => (
        <button key={b} type="button" role="radio" aria-checked={value === b} className="seg__opt" onClick={() => onChange(b)}>
          {b === "monthly" ? "Monthly" : "Yearly"}
        </button>
      ))}
    </div>
  );
}

/**
 * The two plan cards (also used, smaller, in the third-room window). Olfia Plus stands out with a Periwinkle deep
 * line, not a family colour, and no "most popular" badge (there is no data for one). Free is the plan everyone is on.
 */
export function PlanCards({ billing, onJoin, compact = false }: { billing: Billing; onJoin: () => void; compact?: boolean }) {
  const price = plusPrice(billing);
  const card = (id: PlanId) => {
    const c = PLAN_CARDS[id];
    return (
      <div key={id} className={`plan${id === "plus" ? " plan--plus" : ""}${compact ? " plan--compact" : ""}`}>
        <h3 className="plan__name">{c.name}</h3>
        {id === "plus" && price ? (
          <p className="plan__price">{price.main}{price.note ? <span className="plan__save">{price.note}</span> : null}</p>
        ) : null}
        <ul className="plan__points">
          {c.points.map((p) => <li key={p}><Icon name="check" size={18} />{p}</li>)}
        </ul>
        {id === "plus" ? (
          <button type="button" className="btn btn--primary btn--block plan__cta" onClick={onJoin}>Join Olfia Plus</button>
        ) : (
          <p className="plan__current"><Icon name="check" size={18} />Your plan</p>
        )}
      </div>
    );
  };
  return <div className="plans__cards">{card("free")}{card("plus")}</div>;
}

function Cell({ v }: { v: boolean | string }) {
  if (typeof v === "string") return <>{v}</>;
  return v
    ? <><Icon name="check" size={20} /><span className="sr-only">Included</span></>
    : <><span aria-hidden="true">–</span><span className="sr-only">Not included</span></>;
}

/** My Page → Plans (/account#plans): the 11/21 design Tiffany kept, now inside My Page (her Notion 11/23). */
export function Plans() {
  const [billing, setBilling] = useState<Billing>("monthly");
  const join = () => joinPlus("account", hasPrices ? billing : "none");
  return (
    <section id="plans" className="card anchor plans" aria-labelledby="plans-h">
      <div className="plans__head">
        <h2 id="plans-h" className="h-section" style={{ fontSize: 34 }}>Plans</h2>
        {hasPrices ? <BillingSwitch value={billing} onChange={setBilling} /> : null}
      </div>
      <PlanCards billing={billing} onJoin={join} />
      {/* on a phone the table scrolls sideways and its first column stays put */}
      <div className="plans__scroll" role="region" aria-label="Compare the plans" tabIndex={0}>
        <table className="plans__table">
          <thead>
            <tr>
              <th scope="col"><span className="sr-only">What you get</span></th>
              <th scope="col">Free</th>
              <th scope="col">Olfia Plus</th>
            </tr>
          </thead>
          <tbody>
            {PLAN_ROWS.map((r) => (
              <tr key={r.feature}>
                <th scope="row">{r.feature}</th>
                <td><Cell v={r.free} /></td>
                <td><Cell v={r.plus} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="plans__faq">
        {PLAN_FAQ.map((f) => (
          <details key={f.q} className="plans__q">
            <summary>{f.q}<Icon name="chevronDown" /></summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
      <div className="plans__end">
        <button type="button" className="btn btn--primary" onClick={join}>Join Olfia Plus</button>
      </div>
    </section>
  );
}
