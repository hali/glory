export async function getEpisodesCount() {
    const response = await fetch('/api/stats/episodes');
    return await response.json();
}

export async function getCharactersCount() {
    const response = await fetch('/api/stats/characters');
    return await response.json();
}

export async function getPostsCount() {
    const response = await fetch('/api/stats/posts');
    return await response.json();
}