import { request } from "./api";

/* ========================
   REPORT APIs
======================== */

export function getSummary(params) {
  const qs = new URLSearchParams(params).toString();
  return request(`/api/reports/summary?${qs}`);
}

export function getCategoryReport(params) {
  const qs = new URLSearchParams(params).toString();
  return request(`/api/reports/category?${qs}`);
}

export function getMonthlyReport(params) {
  const qs = new URLSearchParams(params).toString();
  return request(`/api/reports/monthly?${qs}`);
}

export function downloadPDF(params) {
  const qs = new URLSearchParams(params).toString();
  return fetch(
    `${import.meta.env.VITE_API_BASE || "http://localhost:5000"}/api/reports/pdf?${qs}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("taxpal_token")}`,
      },
    }
  ).then((res) => res.blob());
}

export function downloadCSV(params) {
  const qs = new URLSearchParams(params).toString();
  return fetch(
    `${import.meta.env.VITE_API_BASE || "http://localhost:5000"}/api/reports/csv?${qs}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("taxpal_token")}`,
      },
    }
  ).then((res) => res.blob());
}
