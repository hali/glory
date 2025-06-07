import { get, post } from './ApiService';

export async function getCharacters(player_id) {
    return await get('/api/players/' + player_id + '/characters');
}

export async function getAllCharacters() {
    // This endpoint is public, no auth required
    return await get('/api/characters', false);
}

export async function getCharacter(character_id) {
    return await get('/api/characters/' + character_id);
}

export async function addCharacter(payload) {
    return await post('/api/characters/', payload);
}

export async function saveCharacter(id, payload) {
    return await post('/api/characters/' + id, payload);
}

export async function getEpisodesByCharacterId(characterId) {
    return await get('/api/characters/' + characterId + '/episodes');
}