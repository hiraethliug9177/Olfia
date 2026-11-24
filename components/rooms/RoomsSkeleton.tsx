/**
 * What /rooms shows before the editor has loaded in the browser (11/24 handoff, P0: the Suspense fallback was empty,
 * so the page jumped when the editor arrived). The same workshop frame with nothing in it: the intention bar, the
 * sticker book, the room sheet at its real size, the panel and the bar, so the page keeps its shape.
 */
export function RoomsSkeleton() {
  return (
    <div className="rooms-page" aria-hidden="true">
      <div className="ws">
        <div className="ws__intent">
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ display: "contents" }}>
              {i ? <span className="ws__intent-arrow" style={{ width: 18 }} /> : null}
              <span className="ws-pick">
                <span className="skel" style={{ width: "46%", height: 14 }} />
                <span className="skel" style={{ height: 44, borderRadius: 12 }} />
              </span>
            </div>
          ))}
        </div>
        <div className="ws__tray">
          <div className="ws__tray-in" />
        </div>
        <div className="ws__canvas">
          <div className="ws__head">
            <span className="skel ws__views" style={{ width: 300, height: 40, borderRadius: 999 }} />
          </div>
          <div className="ws__stage">
            <div className="ws__frame">
              <span className="skel-sheet" />
            </div>
          </div>
        </div>
        <div className="ws__panel">
          <div className="ws__panel-in" />
        </div>
        <div className="ws__bar">
          <div className="ws__status"><span className="skel" style={{ width: 180, height: 40 }} /></div>
          <div className="ws__actions"><span className="skel" style={{ width: 260, maxWidth: "100%", height: 44, borderRadius: 999 }} /></div>
        </div>
      </div>
    </div>
  );
}
