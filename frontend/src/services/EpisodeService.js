export async function viewEpisode(id) {
    const response = await fetch('/api/episodes/' + id);
    return await response.json();
}

export async function addEpisode(payload) {
    const response = await fetch(`/api/episodes/`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(Object.assign({}, payload))
      })
    return await response.json();
}

export async function updateEpisode(id, payload) {
    const response = await fetch(`/api/episodes/` + id, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(Object.assign({}, payload))
      })
    return await response.json();
}

export async function closeEpisode(id) {
    const response = await fetch(`/api/episodes/` + id + `/close`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
      })
    return await response.json();
}

export async function reopenEpisode(id) {
    const response = await fetch(`/api/episodes/` + id + `/reopen`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
      })
    return await response.json();
}


export async function getEpisodePosts(id) {
    const response = await fetch('/api/episodes/' + id + '/posts');
    return await response.json();
}

export async function getEpisodes(status, branch) {
    const response = await fetch('/api/episodes?status=' + status + '&branch=' + branch);
    return await response.json();
}

export async function getLatestEpisodes() {
    const response = await fetch('/api/latest');
    return await response.json();
}