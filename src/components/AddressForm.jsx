export default function AddressForm({ address, setAddress, allowSave=true }){
  return (
    <div className="card" style={{marginBottom: 12}}>
      <h3>Delivery Address</h3>
      <div className="grid" style={{gridTemplateColumns:"1fr 1fr"}}>
        <input className="input" placeholder="House/Flat, Street" value={address.line1||""} onChange={e=>setAddress({...address, line1:e.target.value})}/>
        <input className="input" placeholder="Area / Locality" value={address.line2||""} onChange={e=>setAddress({...address, line2:e.target.value})}/>
        <input className="input" placeholder="City" value={address.city||""} onChange={e=>setAddress({...address, city:e.target.value})}/>
        <input className="input" placeholder="State" value={address.state||""} onChange={e=>setAddress({...address, state:e.target.value})}/>
        <input className="input" placeholder="Pincode" value={address.pincode||""} onChange={e=>setAddress({...address, pincode:e.target.value})}/>
        <input className="input" placeholder="Landmark (optional)" value={address.landmark||""} onChange={e=>setAddress({...address, landmark:e.target.value})}/>
        <input className="input" style={{gridColumn:"1/-1"}} placeholder="Contact phone (optional)" value={address.phone||""} onChange={e=>setAddress({...address, phone:e.target.value})}/>
      </div>
      {allowSave && (
        <div className="small" style={{marginTop:8}}>
          <label style={{cursor:"pointer"}}>
            <input type="checkbox" onChange={e=>{
              if(e.target.checked){
                localStorage.setItem("savedAddress", JSON.stringify(address));
              }else{
                localStorage.removeItem("savedAddress");
              }
            }} /> Save this address on this device
          </label>
        </div>
      )}
    </div>
  );
}
