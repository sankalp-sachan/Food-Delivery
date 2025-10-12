const API_URL = import.meta.env.VITE_API_URL || "https://food-delivery-backend-dbt5.onrender.com";
export async function api(path, opts={}){
  const token = localStorage.getItem("token");
  const res = await fetch(API_URL + path, {
    headers: { "Content-Type":"application/json", ...(token?{Authorization:`Bearer ${token}`}:{}) },
    ...opts
  });
  if(!res.ok) throw new Error((await res.json()).message || "Request failed");
  return res.json();
}
export { API_URL };
