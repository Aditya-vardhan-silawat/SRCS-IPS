import { API_BASE_URL } from "../config/apiConfig";

async function fetchWithRetry(url, options = {}, retries = 3, backoff = 1000) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw { status: res.status, message: errorData.error || "Request failed" };
    }
    return await res.json();
  } catch (err) {
    if (retries > 0 && (err.status === 503 || err.status === 504 || !err.status)) {
      await new Promise(resolve => setTimeout(resolve, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    throw err;
  }
}

export async function submitReport({ category, description, images, parentReportCode }) {
  const formData = new FormData();
  formData.append("category", category);
  formData.append("description", description);
  if (parentReportCode) {
    formData.append("parentReportCode", parentReportCode);
  }
  images.forEach((file) => formData.append("images", file));

  return fetchWithRetry(`${API_BASE_URL}/reports`, {
    method: "POST",
    body: formData
  });
}

export async function trackReport(reportCode) {
  return fetchWithRetry(`${API_BASE_URL}/reports/track/${reportCode}`);
}

export async function fetchReports(sort = "date") {
  return fetchWithRetry(`${API_BASE_URL}/reports?sort=${sort}`);
}

export async function upvoteReport(id) {
  return fetchWithRetry(`${API_BASE_URL}/reports/${id}/upvote`, {
    method: "POST"
  });
}

export async function fetchAdminReports(sort = "severity") {
  const token = localStorage.getItem("admin_token");
  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return fetchWithRetry(`${API_BASE_URL}/admin/reports?sort=${sort}`, {
    headers
  });
}

export async function updateReportStatus(id, status) {
  const token = localStorage.getItem("admin_token");
  return fetchWithRetry(`${API_BASE_URL}/admin/reports/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });
}
