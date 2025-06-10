import { get, post } from "./ApiService";

export async function addPost(payload) {
  const response = await post("/api/posts/", payload);
  return response.status;
}

export async function viewPost(id) {
  return await get("/api/posts/" + id);
}

export async function updatePost(id, payload) {
  return await post("/api/posts/" + id, payload);
}

export async function deletePost(id) {
  return await post(`/api/posts/${id}/delete`, {});
}

export async function addComment(id, payload) {
  return await post(`/api/posts/${id}/comments`, payload);
}

export async function getComments(id) {
  return await get(`/api/posts/${id}/comments`);
}
