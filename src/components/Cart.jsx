import AddressForm from "./AddressForm";

export default function Cart({ cart, setCart, placeOrder, address, setAddress }){
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  function inc(id){ setCart(prev => prev.map(x=>x._id===id?{...x,qty:x.qty+1}:x)); }
  function dec(id){ setCart(prev => prev.map(x=>x._id===id?{...x,qty:Math.max(1,x.qty-1)}:x)); }
  function remove(id){ setCart(prev => prev.filter(x=>x._id!==id)); }
  return (
    <div className="card cart">
      <div className="spread">
        <h3>Your Cart</h3>
        <span className="badge">₹{total}</span>
      </div>
      {cart.length===0 && <p className="small">Cart is empty</p>}
      {cart.map(i => (
        <div key={i._id} className="spread">
          <div>{i.name} <span className="small">x {i.qty}</span></div>
          <div className="flex">
            <button className="btn secondary" onClick={()=>dec(i._id)}>-</button>
            <button className="btn secondary" onClick={()=>inc(i._id)}>+</button>
            <button className="btn" onClick={()=>remove(i._id)}>Remove</button>
          </div>
        </div>
      ))}
      <hr/>
      <AddressForm address={address} setAddress={setAddress} />
      <button className="btn" disabled={!cart.length || !address?.line1 || !address?.city} onClick={placeOrder}>Place Order</button>
      {(!address?.line1 || !address?.city) && <div className="small" style={{marginTop:8}}>Address needs at least <b>House/Street</b> and <b>City</b>.</div>}
    </div>
  );
}
