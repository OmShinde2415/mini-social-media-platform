const messageEl = document.getElementById("message");

const showMessage = (text, isError = true) => {
  messageEl.style.color = isError ? "#b91c1c" : "#0f766e";
  messageEl.textContent = text;
};

const saveAuth = (data) => {
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
};

document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    username: document.getElementById("registerUsername").value.trim(),
    email: document.getElementById("registerEmail").value.trim(),
    password: document.getElementById("registerPassword").value
  };

  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (!res.ok) return showMessage(data.message || "Registration failed");

    saveAuth(data);
    showMessage("Registered successfully. Redirecting...", false);
    setTimeout(() => (window.location.href = "dashboard.html"), 700);
  } catch {
    showMessage("Server not reachable");
  }
});

document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    email: document.getElementById("loginEmail").value.trim(),
    password: document.getElementById("loginPassword").value
  };

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (!res.ok) return showMessage(data.message || "Login failed");

    saveAuth(data);
    showMessage("Login successful. Redirecting...", false);
    setTimeout(() => (window.location.href = "dashboard.html"), 700);
  } catch {
    showMessage("Server not reachable");
  }
});

if (getToken()) {
  window.location.href = "dashboard.html";
}
