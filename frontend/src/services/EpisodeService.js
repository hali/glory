import { get, post, del } from "./ApiService";

export async function viewEpisode(id) {
  return await get("/api/episodes/" + id);
}

export async function addEpisode(payload) {
  return await post("/api/episodes/", payload);
}

export async function updateEpisode(id, payload) {
  return await post("/api/episodes/" + id, payload);
}

export async function closeEpisode(id) {
  return await post(`/api/episodes/${id}/close`, {});
}

export async function reopenEpisode(id) {
  return await post(`/api/episodes/${id}/reopen`, {});
}

export async function addBranch(branch) {
  return await post(`/api/addBranch/${branch}`, {});
}

export async function getEpisodePosts(id) {
  return await get(`/api/episodes/${id}/posts`);
}

export async function getEpisodeBranches(id) {
  return await get(`/api/episodes/${id}/branches`);
}

export async function getEpisodes(status, branch) {
  // This endpoint is public, no auth required
  return await get(`/api/episodes?status=${status}&branch=${branch}`, false);
}

export async function getLatestEpisodes() {
  // This endpoint is public, no auth required
  return await get("/api/latest");
}

export async function getAllBranches() {
  // This endpoint is public, no auth required
  return await get("/api/branches");
}

export async function updateEpisodeBranches(id, payload) {
  return await post(`/api/episodes/${id}/branches`, payload);
}

export async function updateEpisodeDraft(id, payload) {
  return await post(`/api/episodes/${id}/draft`, payload);
}

export async function getEpisodeDraft(id, player) {
  return await get(`/api/episodes/${id}/draft?playerId=${player}`);
}

export async function deleteEpisodeDraft(id, player) {
  return await del(`/api/episodes/${id}/draft?playerId=${player}`);
}
