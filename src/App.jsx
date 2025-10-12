import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import MenuGrid from "./components/MenuGrid";
import Cart from "./components/Cart";
import OrderTracker from "./components/OrderTracker";
import RestaurantPanel from "./components/RestaurantPanel";
import Toast from "./components/Toast";
import { api, API_URL } from "./api";
import "./styles.css";

export default function App() {
  const [role, setRole] = useState("customer");
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null")
  );
  const [restaurants, setRestaurants] = useState([]);
  const [selected, setSelected] = useState(null);
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [toast, setToast] = useState("");
  const [address, setAddress] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("savedAddress") || "{}");
    } catch {
      return {};
    }
  });

  const socket = useMemo(() => {
    if (!user) return null;
    const auth =
      user.role === "restaurant"
        ? {
            role: "restaurant",
            restaurant: user.restaurant?._id || user.restaurant,
          }
        : { role: "customer", userId: user._id };
    return io(API_URL, { auth });
  }, [user]);

  useEffect(() => {
    api("/api/restaurants")
      .then(setRestaurants)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selected) return;
    api(`/api/menu/${selected._id}`)
      .then(setMenu)
      .catch(() => setMenu([]));
  }, [selected]);

  function addToCart(item) {
    setCart((prev) => {
      const found = prev.find((p) => p._id === item._id);
      if (found)
        return prev.map((p) =>
          p._id === item._id ? { ...p, qty: p.qty + 1 } : p
        );
      return [...prev, { ...item, qty: 1 }];
    });
  }

  async function placeOrder() {
    if (!user) {
      setToast("Please login first");
      setTimeout(() => setToast(""), 2500);
      return;
    }
    if (!selected) {
      setToast("Select a restaurant first");
      setTimeout(() => setToast(""), 2500);
      return;
    }
    if (!address?.line1 || !address?.city) {
      setToast("Enter delivery address");
      setTimeout(() => setToast(""), 2500);
      return;
    }
    const items = cart.map((c) => ({ item: c._id, qty: c.qty }));
    try {
      const order = await api("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          restaurant: selected._id,
          items,
          deliveryAddress: address,
        }),
      });
      setCart([]);
      setToast("Order placed! 🎉");
      setTimeout(() => setToast(""), 2500);
      loadMyOrders();
    } catch (e) {
      alert(e.message);
    }
  }

  async function loadMyOrders() {
    if (!user || user.role !== "customer") return;
    const list = await api("/api/orders/mine");
    setOrders(list);
  }

  useEffect(() => {
    loadMyOrders();
  }, [user]);

  useEffect(() => {
    if (!socket) return;
    socket.on("order:update", ({ orderId, status }) => {
      setToast(`Order ${orderId.slice(-6)} is now ${status}`);
      setTimeout(() => setToast(""), 3000);
      loadMyOrders();
    });
    return () => socket?.disconnect();
  }, [socket]);

  function onLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <div className="container">
      <Navbar user={user} onLogout={onLogout} role={role} setRole={setRole} />
      {!user && <Login onAuth={setUser} />}
      {role === "customer" && (
        <div className="grid" style={{ gridTemplateColumns: "3fr 1fr" }}>
          <div>
            <div className="card">
              <h2>Choose a Restaurant</h2>
              <div
                className="grid"
                style={{
                  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
                }}
              >
                {restaurants.map((r) => (
                  <div
                    key={r._id}
                    className="card"
                    onClick={() => setSelected(r)}
                    style={{
                      cursor: "pointer",
                      border:
                        selected?._id === r._id ? "2px solid #22c55e" : "",
                    }}
                  >
                    <div className="spread">
                      <h3>{r.name}</h3>
                      <span className="badge">
                        {r.isOpen ? "Open" : "Closed"}
                      </span>
                    </div>
                    <div className="small">{r.address || "Near you"}</div>
                  </div>
                ))}
                {!restaurants.length && (
                  <div className="small">
                    No restaurants yet. Register a restaurant account to seed!
                  </div>
                )}
              </div>
            </div>
            <div style={{ marginTop: 16 }} className="card">
              <div className="spread">
                <h2>Menu</h2>
                {selected && <span className="badge">{selected.name}</span>}
              </div>
              <MenuGrid items={menu} add={addToCart} />
            </div>
            <div style={{ marginTop: 16 }}>
              <OrderTracker orders={orders} />
            </div>
          </div>
          <Cart
            cart={cart}
            setCart={setCart}
            placeOrder={placeOrder}
            address={address}
            setAddress={setAddress}
          />
        </div>
      )}
      {role === "restaurant" && user && (
        <RestaurantPanel socket={socket} user={user} />
      )}
      <Toast message={toast} />
    </div>
  );
}
