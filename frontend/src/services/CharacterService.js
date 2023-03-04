export async function getCharacters(player_id) {
    const response = await fetch('/api/players/' + player_id + '/characters');
    return await response.json();
}

export async function getAllCharacters() {
    const response = await fetch('/api/characters');
    return await response.json();
}

export async function getCharacter(character_id) {
    const response = await fetch('/api/characters/' + character_id);
    return await response.json();
}

export async function addCharacter(payload) {
    const response = await fetch(`/api/characters/`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(Object.assign({}, payload))
      })
    return await response.json();
}

export async function saveCharacter(id, payload) {
    const response = await fetch(`/api/characters/` + id, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(Object.assign({}, payload))
      })
    return await response.json();
}

export async function getEpisodesByCharacterId(characterId) {
    const response = await fetch('/api/characters/' + characterId + '/episodes');
    return await response.json();
}