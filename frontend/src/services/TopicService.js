import { get, post } from './ApiService';

export async function addTopic(payload) {
    return await post('/api/topics/', payload);
}

export async function updateTopic(id, payload) {
    return await post('/api/topics/' + id, payload);
}

export async function closeTopic(id) {
    return await post(`/api/topics/${id}/close`, {});
}

export async function reopenTopic(id) {
    return await post(`/api/topics/${id}/reopen`, {});
}

export async function getTopicReplies(id) {
    return await get('/api/topics/' + id + '/replies');
}

export async function getTopics(status) {
    return await get('/api/topics?status=' + status);
}

export async function addReply(id, payload) {
    const response = await post(`/api/topics/${id}/replies`, payload);
    return response;
}