export async function getPlayer(email) {
    const response = await fetch('/api/players/?email=' + email);
    return await response.json();
}

export async function getPlayerById(id) {
    const response = await fetch('/api/players/?id=' + id);
    return await response.json();
}

export async function savePlayer(payload) {
    const response = await fetch(`/api/players/`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(Object.assign({}, payload))
      })
    return await response.json();
}

export async function getEpisodesByPlayerId(playerId) {
    const response = await fetch('/api/players/' + playerId + '/episodes');
    return await response.json();
}

export async function getCommentsByPlayer(playerId) {
    const response = await fetch('/api/players/' + playerId + '/comments');
    return await response.json();
}

export async function getFeedbackByPlayer(playerId) {
    const response = await fetch('/api/players/' + playerId + '/feedback');
    return await response.json();
}