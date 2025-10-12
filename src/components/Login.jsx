import { useState } from "react";
import { api } from "../api";

export default function Login({ onAuth }){
  const [mode,setMode]=useState("login");
  const [form,setForm]=useState({ fullname:"", email:"", password:"", role:"customer", restaurantName:"", restaurantAddress:"" });
  async function submit(e){
    e.preventDefault();
    try{
      const path = mode==="login"?"/api/auth/login":"/api/auth/register";
      const res = await api(path, { method:"POST", body:JSON.stringify(form) });
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      onAuth(res.user);
    }catch(e){ alert(e.message); }
  }
  return (
    <div className="card">
      <div className="spread">
        <h3>{mode==="login"?"Login":"Create account"}</h3>
        <span className="link" onClick={()=>setMode(mode==="login"?"register":"login")}>
          {mode==="login"?"New here? Register":"Have an account? Login"}
        </span>
      </div>
      <form onSubmit={submit} className="grid" style={{gridTemplateColumns:"1fr 1fr"}}>
        {mode==="register" && <input className="input" placeholder="Full name"
          value={form.fullname} onChange={e=>setForm({...form, fullname:e.target.value})}/>}
        <input className="input" placeholder="Email" type="email"
          value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
        <input className="input" placeholder="Password" type="password"
          value={form.password} onChange={e=>setForm({...form, password:e.target.value})}/>
        {mode==="register" && (
          <>
            <select className="input" value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
              <option value="customer">Customer</option>
              <option value="restaurant">Restaurant</option>
            </select>
            {form.role==="restaurant" && (
              <>
                <input className="input" placeholder="Restaurant Name"
                  value={form.restaurantName} onChange={e=>setForm({...form, restaurantName:e.target.value})}/>
                <input className="input" style={{gridColumn:"1/-1"}} placeholder="Restaurant Address (optional)"
                  value={form.restaurantAddress} onChange={e=>setForm({...form, restaurantAddress:e.target.value})}/>
              </>
            )}
          </>
        )}
        <div style={{gridColumn:"1/-1"}}>
          <button className="btn">{mode==="login"?"Login":"Create account"}</button>
        </div>
      </form>
    </div>
  );
}
