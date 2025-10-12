export default function Navbar({ user, onLogout, role, setRole }){
  return (
    <div className="nav">
      <div className="flex">
        <span className="badge">🍴 Foodly</span>
        <span className="pill">
          <span>View as</span>
          <select value={role} onChange={e=>setRole(e.target.value)}>
            <option value="customer">Customer</option>
            <option value="restaurant">Restaurant</option>
          </select>
        </span>
      </div>
      <div className="flex">
        {user ? (
          <>
            <span>Hi, {user.fullname}</span>
            <button className="btn secondary" onClick={onLogout}>Logout</button>
          </>
        ) : <span className="small">Login to manage orders</span>}
      </div>
    </div>
  );
}
