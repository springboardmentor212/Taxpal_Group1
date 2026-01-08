const BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

/* ------------------------
   Core request helper
------------------------ */
async function request(path, opts = {}) {
  const token = localStorage.getItem("taxpal_token");

  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.headers || {}),
    },
    ...opts,
  });

  let body = null;
  try {
    body = await res.json();
  } catch {
    /* non-JSON response */
  }

  /*  AUTO LOGOUT ON 401 */
  if (res.status === 401) {
    localStorage.removeItem("taxpal_token");
    localStorage.removeItem("taxpal_user");

    if (!window.location.pathname.includes("/login")) {
      window.location.href = "/login";
    }
  }

  if (!res.ok) {
    const err = new Error(
      body?.error || body?.message || `Request failed (${res.status})`
    );
    err.status = res.status;
    err.body = body;
    throw err;
  }

  return body;
}

/* ========================
   AUTH APIs
======================== */
export function signup(data) {
  return request("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function signupVerify(data) {
  return request("/api/auth/signup-verify", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function login(data) {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function logout() {
  localStorage.removeItem("taxpal_token");
  localStorage.removeItem("taxpal_user");

  return request("/api/auth/logout", {
    method: "POST",
  });
}

/* ========================
   OTP APIs
======================== */
export function requestOtp(data) {
  return request("/api/otp/request", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function verifyOtp(data) {
  return request("/api/otp/verify", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/* ========================
   PASSWORD RESET
======================== */
export function resetPassword(data) {
  return request("/api/auth/reset", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/* ========================
   DASHBOARD APIs
======================== */
export function getDashboard(range = "month") {
  return request(`/api/dashboard?range=${range}`);
}

/* ========================
   TRANSACTIONS APIs
======================== */
export function getTransactions() {
  return request("/api/transactions");
}

export function createTransaction(data) {
  return request("/api/transactions", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateTransaction(id, data) {
  return request(`/api/transactions/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteTransaction(id) {
  return request(`/api/transactions/${id}`, {
    method: "DELETE",
  });
}

/* ========================
   BUDGET APIs  
======================== */
export function getBudgets() {
  return request("/api/budgets");
}

export function createBudget(data) {
  return request("/api/budgets", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateBudget(id, data) {
  return request(`/api/budgets/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteBudget(id) {
  return request(`/api/budgets/${id}`, {
    method: "DELETE",
  });
}

/* ========================
   CATEGORY APIs
======================== */
export function getCategories(type) {
  return request(`/api/categories${type ? `?type=${type}` : ""}`);
}

export function createCategory(data) {
  return request("/api/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteCategory(id) {
  return request(`/api/categories/${id}`, {
    method: "DELETE",
  });
}

/* ========================
   TAX ESTIMATION APIs
======================== */

export function getTaxEstimate(data) {
  return request("/api/tax/estimate", {
    method: "POST",
    body: JSON.stringify(data),
  });
}