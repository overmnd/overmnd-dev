// frontend/src/services/notifications.js
import api from "./api";

// All endpoints require JWT (api.js already attaches Authorization)
export async function listNotifications() {
  const res = await api.get("/notifications");
  return res.data; // [{id, title, body, route, severity, read, when}]
}

export async function markNotificationRead(id) {
  await api.post(`/notifications/${id}/read`);
  return true;
}

export async function markAllRead() {
  await api.post("/notifications/mark_all_read");
  return true;
}
