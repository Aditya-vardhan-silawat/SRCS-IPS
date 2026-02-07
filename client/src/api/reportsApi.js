import { API_BASE_URL } from "../config/apiConfig";

export async function submitReport({ category, description, images }) {
  const formData = new FormData();
  formData.append("category", category);
  formData.append("description", description);
  images.forEach((file) => formData.append("images", file));

  const res = await fetch(`${API_BASE_URL}/reports`, {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to submit report");
  }
  return data;
}

export async function fetchReports(sort = "date") {
  const res = await fetch(`${API_BASE_URL}/reports?sort=${sort}`);
  if (!res.ok) throw new Error("Failed to load reports");
  return res.json();
}

export async function upvoteReport(id) {
  const res = await fetch(`${API_BASE_URL}/reports/${id}/upvote`, {
    method: "POST"
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to upvote");
  }
  return data;
}

export async function fetchAdminReports(sort = "severity") {
  const token = localStorage.getItem("admin_token");
  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/admin/reports?sort=${sort}`, {
    headers
  });
  
  if (!res.ok) throw new Error("Failed to load admin reports or unauthorized");
  return res.json();
}
