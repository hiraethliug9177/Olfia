/**
 * What /card shows before the studio has loaded in the browser (11/24 handoff): the same desk with a blank card at its
 * real size, so the page keeps its shape when the studio fills in.
 */
export function CardSkeleton() {
  return (
    <div className="desk" aria-hidden="true">
      <div className="desk__source">
        <span className="ws-label skel" style={{ width: 92, height: 16 }} />
        <span className="skel ws-pick__box" style={{ height: 44, borderRadius: 12 }} />
        <span className="skel desk__or" style={{ width: 170, height: 16 }} />
      </div>
      <div className="desk__canvas">
        <div className="desk__stage">
          <div className="desk__frame">
            <span className="skel-card" />
          </div>
        </div>
      </div>
      <div className="desk__insp">
        <div className="desk__insp-in">
          <div className="ws__handle"><span /></div>
          <div className="ws-tabs" style={{ minHeight: 44 }} />
        </div>
      </div>
      <div className="desk__bar">
        <div className="ws__status"><span className="skel" style={{ width: 150, height: 40 }} /></div>
        <div className="ws__actions"><span className="skel" style={{ width: 300, maxWidth: "100%", height: 44, borderRadius: 999 }} /></div>
      </div>
    </div>
  );
}
