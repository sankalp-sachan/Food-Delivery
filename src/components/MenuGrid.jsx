export default function MenuGrid({ items, add }){
  return (
    <div className="grid">
      {items.map(m => (
        <div key={m._id} className="card">
          <div className="spread">
            <h3>{m.name}</h3>
            <span className="badge">₹{m.price}</span>
          </div>
          <p className="small">{m.description || "Delicious meal"}</p>
          <button className="btn" onClick={()=>add(m)}>Add to cart</button>
        </div>
      ))}
    </div>
  );
}
