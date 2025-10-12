import { useEffect, useState } from "react";
import { api } from "../api";

export default function RestaurantPanel({ socket, user }){
  const [menu,setMenu]=useState([]);
  const [orders,setOrders]=useState([]);
  const [form,setForm]=useState({ name:"", price:0, description:"" });

  async function load(){
    if(!user?.restaurant?._id && !user?.restaurant) return;
    const rid = user.restaurant?._id || user.restaurant;
    const m = await api(`/api/menu/${rid}`);
    setMenu(m);
    const o = await api(`/api/orders/incoming`);
    setOrders(o);
  }

  async function addItem(e){
    e.preventDefault();
    const item = await api(`/api/menu`, { method:"POST", body: JSON.stringify(form) });
    setMenu(prev=>[item, ...prev]);
    setForm({ name:"", price:0, description:"" });
  }

  async function setStatus(id, status){
    const updated = await api(`/api/orders/${id}/status`, { method:"PATCH", body: JSON.stringify({ status }) });
    setOrders(prev => prev.map(o=>o._id===id?updated:o));
  }

  useEffect(()=>{ load(); }, [user]);

  useEffect(()=>{
    if(!socket) return;
    socket.on("order:new", payload => {
      load();
    });
    return () => {
      socket.off("order:new");
    };
  }, [socket]);

  return (
    <div className="grid" style={{gridTemplateColumns:"2fr 1fr"}}>
      <div className="card">
        <div className="spread">
          <h3>Incoming Orders</h3>
          <span className="badge">{orders.length}</span>
        </div>
        {orders.map(o => (
          <div key={o._id} className="card" style={{margin:"8px 0"}}>
            <div className="spread">
              <div>#{o._id.slice(-6)} • ₹{o.total}</div>
              <div className="badge">{o.status}</div>
            </div>
            <div className="small">{o.items.map(i => `${i.item?.name} x ${i.qty}`).join(", ")}</div>
            {o.deliveryAddress && (
              <div className="small" style={{marginTop:8}}>
                <b>Deliver to:</b> {o.deliveryAddress.line1}{o.deliveryAddress.line2?`, ${o.deliveryAddress.line2}`:""}, {o.deliveryAddress.city}{o.deliveryAddress.state?`, ${o.deliveryAddress.state}`:""} {o.deliveryAddress.pincode||""}{o.deliveryAddress.landmark?` • ${o.deliveryAddress.landmark}`:""}{o.deliveryAddress.phone?` • ${o.deliveryAddress.phone}`:""}
              </div>
            )}
            <div className="flex" style={{marginTop:8, flexWrap:"wrap"}}>
              {["accepted","preparing","out_for_delivery","completed","cancelled"].map(s => (
                <button key={s} className="btn secondary" onClick={()=>setStatus(o._id, s)}>{s}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="card">
        <h3>Menu Manager</h3>
        <form onSubmit={addItem} className="grid" style={{gridTemplateColumns:"1fr 1fr"}}>
          <input className="input" placeholder="Item name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
          <input className="input" type="number" placeholder="Price" value={form.price} onChange={e=>setForm({...form, price:Number(e.target.value)})}/>
          <input className="input" style={{gridColumn:"1/-1"}} placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})}/>
          <div style={{gridColumn:"1/-1"}}><button className="btn">Add Item</button></div>
        </form>
        <hr/>
        {menu.map(m => (
          <div key={m._id} className="spread">
            <div>{m.name}</div><div className="badge">₹{m.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
