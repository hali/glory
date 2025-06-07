import { get, post } from './ApiService';

export async function getPlayer(email) {
    return await get('/api/players/?email=' + email);
}

export async function getPlayerById(id) {
    return await get('/api/players/?id=' + id);
}

export async function savePlayer(payload) {
    return await post('/api/players/', payload);
}

export async function getEpisodesByPlayerId(playerId, statusId) {
    return await get('/api/players/' + playerId + '/episodes/?statusId=' + statusId);
}

export async function getCommentsByPlayer(playerId) {
    return await get('/api/players/' + playerId + '/comments');
}

export async function getFeedbackByPlayer(playerId) {
    return await get('/api/players/' + playerId + '/feedback');
}

export async function getDebts() {
    return await get('/api/debts');
}

export async function getPostsNumber(playerId) {
    return await get('/api/players/' + playerId + '/posts');
}