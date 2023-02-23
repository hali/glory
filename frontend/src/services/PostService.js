export async function addPost(payload) {
    const response = await fetch(`/api/posts/`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(Object.assign({}, payload))
      })
    return await response.json();
}

export async function viewPost(id) {
    const response = await fetch('/api/posts/' + id);
    return await response.json();
}

export async function updatePost(id, payload) {
    const response = await fetch(`/api/posts/` + id, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(Object.assign({}, payload))
      })
    return await response.json();
}

export async function deletePost(id) {
    const response = await fetch(`/api/posts/` + id + '/delete', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
      })
    return await response.json();
}