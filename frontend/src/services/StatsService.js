import { get } from './ApiService';

export async function getEpisodesCount() {
    // Stats endpoints are public, no auth required
    return await get('/api/stats/episodes', false);
}

export async function getCharactersCount() {
    // Stats endpoints are public, no auth required
    return await get('/api/stats/characters', false);
}

export async function getPostsCount() {
    // Stats endpoints are public, no auth required
    return await get('/api/stats/posts', false);
}