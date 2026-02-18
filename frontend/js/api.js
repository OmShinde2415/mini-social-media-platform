const API_BASE = "http://localhost:5000/api";

const getToken = () => localStorage.getItem("token");
const getUser = () => JSON.parse(localStorage.getItem("user") || "null");

const authHeaders = () => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
};

const redirectIfNotLoggedIn = () => {
  if (!getToken()) {
    window.location.href = "index.html";
  }
};
