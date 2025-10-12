export default function OrderTracker({ orders }){
  return (
    <div className="card">
      <h3>My Orders</h3>
      {orders.map(o => (
        <div key={o._id} className="spread">
          <div>
            <div className="small">#{o._id.slice(-6)}</div>
            <div>{o.items.map(i=>i.item?.name || "").join(", ")}</div>
          </div>
          <div className="badge">{o.status}</div>
        </div>
      ))}
      {!orders.length && <p className="small">No orders yet</p>}
    </div>
  );
}
