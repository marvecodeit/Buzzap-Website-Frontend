// Central API client for talking to the backend Express server.
// Base URL comes from NEXT_PUBLIC_API_URL (set in .env.local); defaults to local dev.
// Prefer the explicit env var. Fall back to the deployed API in production,
// and to the local server during development.
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://buzzap-website-frontend.onrender.com'
    : 'http://localhost:5000');

/**
 * Perform a JSON request against the API.
 * `credentials: 'include'` sends/receives the httpOnly auth cookie.
 * Throws an Error with a `.details` array for validation failures.
 */
export async function apiFetch(path, { method = 'GET', body, headers } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // 204 / empty responses
  }

  if (!res.ok) {
    const err = new Error(data?.message || `Request failed (${res.status})`);
    err.status = res.status;
    err.details = data?.details;
    throw err;
  }

  return data;
}

// Build a querystring from an object, skipping empty values.
function qs(params = {}) {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null);
  return entries.length ? `?${new URLSearchParams(entries).toString()}` : '';
}

// --- Leads (public submit + admin management) ---
export function submitLead(payload) {
  return apiFetch('/api/leads', { method: 'POST', body: payload });
}
export function getLeads(params) {
  return apiFetch(`/api/leads${qs(params)}`);
}
export function updateLead(id, payload) {
  return apiFetch(`/api/leads/${id}`, { method: 'PATCH', body: payload });
}

// --- Auth ---
export function login(email, password) {
  return apiFetch('/api/auth/login', { method: 'POST', body: { email, password } });
}
export function logout() {
  return apiFetch('/api/auth/logout', { method: 'POST' });
}
export function getMe() {
  return apiFetch('/api/auth/me');
}

// --- Analytics ---
export function getOverview() {
  return apiFetch('/api/analytics/overview');
}
export function getLeadsTimeseries(days = 30) {
  return apiFetch(`/api/analytics/leads-timeseries${qs({ days })}`);
}
export function getTraffic(days = 30) {
  return apiFetch(`/api/analytics/traffic${qs({ days })}`);
}
// Fire-and-forget page-view beacon (public, no auth). Never throws to the caller.
export function trackPageView(payload) {
  return apiFetch('/api/analytics/pageview', { method: 'POST', body: payload }).catch(() => {});
}

// --- Projects ---
export function getProjects(params) {
  return apiFetch(`/api/projects${qs(params)}`);
}
export function getProject(id) {
  return apiFetch(`/api/projects/${id}`);
}
export function createProject(payload) {
  return apiFetch('/api/projects', { method: 'POST', body: payload });
}
export function updateProject(id, payload) {
  return apiFetch(`/api/projects/${id}`, { method: 'PATCH', body: payload });
}

// --- Milestones (nested under a project) ---
export function createMilestone(projectId, payload) {
  return apiFetch(`/api/projects/${projectId}/milestones`, { method: 'POST', body: payload });
}
export function updateMilestone(projectId, milestoneId, payload) {
  return apiFetch(`/api/projects/${projectId}/milestones/${milestoneId}`, {
    method: 'PATCH',
    body: payload,
  });
}
export function deleteMilestone(projectId, milestoneId) {
  return apiFetch(`/api/projects/${projectId}/milestones/${milestoneId}`, { method: 'DELETE' });
}

// --- Assets (files, nested under a project) ---
export function getAssets(projectId) {
  return apiFetch(`/api/projects/${projectId}/assets`);
}
// Multipart upload — must NOT set Content-Type (browser sets the boundary).
export async function uploadAsset(projectId, file) {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch(`${API_BASE}/api/projects/${projectId}/assets`, {
    method: 'POST',
    credentials: 'include',
    body: fd,
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    /* empty */
  }
  if (!res.ok) {
    const err = new Error(data?.message || `Upload failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}
export function deleteAsset(projectId, assetId) {
  return apiFetch(`/api/projects/${projectId}/assets/${assetId}`, { method: 'DELETE' });
}

// --- Notifications ---
export function getNotifications() {
  return apiFetch('/api/notifications');
}
export function markNotificationRead(id) {
  return apiFetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
}
export function markAllNotificationsRead() {
  return apiFetch('/api/notifications/read-all', { method: 'PATCH' });
}

// --- Blog (public) ---
export function getPublishedPosts(params) {
  return apiFetch(`/api/blog${qs(params)}`);
}
export function getPostBySlug(slug) {
  return apiFetch(`/api/blog/${slug}`);
}

// --- Blog (admin) ---
export function getAllPosts() {
  return apiFetch('/api/blog/admin/all');
}
export function createPost(payload) {
  return apiFetch('/api/blog', { method: 'POST', body: payload });
}
export function updatePost(id, payload) {
  return apiFetch(`/api/blog/${id}`, { method: 'PATCH', body: payload });
}
export function deletePost(id) {
  return apiFetch(`/api/blog/${id}`, { method: 'DELETE' });
}
// Upload an inline image for the Markdown editor; returns { url }.
export async function uploadBlogImage(file) {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch(`${API_BASE}/api/blog/upload-image`, {
    method: 'POST',
    credentials: 'include',
    body: fd,
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    /* empty */
  }
  if (!res.ok) {
    const err = new Error(data?.message || `Upload failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export function reactToPost(postId, payload) {
  const body = typeof payload === 'string' ? { type: payload } : payload;
  return apiFetch(`/api/blog/${postId}/react`, { method: 'POST', body });
}

export function addPostComment(postId, commentData) {
  return apiFetch(`/api/blog/${postId}/comments`, { method: 'POST', body: commentData });
}

export function likePostComment(postId, commentId, action = 'like') {
  return apiFetch(`/api/blog/${postId}/comments/${commentId}/like`, { method: 'POST', body: { action } });
}

// --- Pricing ---
export function getPublicPricing() {
  return apiFetch('/api/pricing');
}
export function getAllPricing() {
  return apiFetch('/api/pricing/admin/all');
}
export function createPlan(payload) {
  return apiFetch('/api/pricing', { method: 'POST', body: payload });
}
export function updatePlan(id, payload) {
  return apiFetch(`/api/pricing/${id}`, { method: 'PATCH', body: payload });
}
export function deletePlan(id) {
  return apiFetch(`/api/pricing/${id}`, { method: 'DELETE' });
}

// --- Conversations / messages ---
export function getConversations() {
  return apiFetch('/api/conversations');
}
export function createConversation(payload) {
  return apiFetch('/api/conversations', { method: 'POST', body: payload });
}
export function getMessages(conversationId) {
  return apiFetch(`/api/conversations/${conversationId}/messages`);
}
export function sendMessage(conversationId, body) {
  return apiFetch(`/api/conversations/${conversationId}/messages`, { method: 'POST', body: { body } });
}

// --- Case Studies ---
export function getCaseStudies(params) {
  return apiFetch(`/api/case-studies${qs(params)}`);
}
export function createCaseStudy(payload) {
  return apiFetch('/api/case-studies', { method: 'POST', body: payload });
}
export function updateCaseStudy(id, payload) {
  return apiFetch(`/api/case-studies/${id}`, { method: 'PATCH', body: payload });
}
export function deleteCaseStudy(id) {
  return apiFetch(`/api/case-studies/${id}`, { method: 'DELETE' });
}
