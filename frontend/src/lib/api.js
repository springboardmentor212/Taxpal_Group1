// src/lib/api.js
const BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

async function request(path, opts = {}) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    ...opts,
  });
  let body = null;
  try { body = await res.json(); } catch (e) { /* no json */ }
  if (!res.ok) {
    const err = new Error(body?.error || body?.message || `Request failed ${res.status}`);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return body;
}

export function signup(data) { return request("/api/auth/signup", { method: "POST", body: JSON.stringify(data) }); }
export function login(data) { return request("/api/auth/login", { method: "POST", body: JSON.stringify(data) }); }

export function requestOtp(data) { return request("/api/otp/request", { method: "POST", body: JSON.stringify(data) }); }
// verifyOtp may return resetToken when purpose='reset'
export function verifyOtp(data) { return request("/api/otp/verify", { method: "POST", body: JSON.stringify(data) }); }

// reset password (preferred): accepts { resetToken, newPassword }
// backend also supports legacy { email, otp, newPassword }
export function resetPassword(data) {
  // data can be { resetToken, newPassword } OR { email, otp, newPassword }
  return request("/api/auth/reset", {
    method: "POST",
    body: JSON.stringify(data),
  });
}


// signup-verify (create user after OTP)
export function signupVerify(data) { return request("/api/auth/signup-verify", { method: "POST", body: JSON.stringify(data) }); }
