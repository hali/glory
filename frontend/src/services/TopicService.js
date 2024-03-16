export async function addTopic(payload) {
    const response = await fetch(`/api/topics/`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(Object.assign({}, payload))
      })
    return await response.json();
}

export async function updateTopic(id, payload) {
    const response = await fetch(`/api/topics/` + id, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(Object.assign({}, payload))
      })
    return await response.json();
}

export async function closeTopic(id) {
    const response = await fetch(`/api/topics/` + id + `/close`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
      })
    return await response.json();
}

export async function reopenTopic(id) {
    const response = await fetch(`/api/topics/` + id + `/reopen`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
      })
    return await response.json();
}

export async function getTopicReplies(id) {
    const response = await fetch('/api/topics/' + id + '/replies');
    return await response.json();
}

export async function getTopics(status) {
    const response = await fetch('/api/topics?status=' + status);
    return await response.json();
}

export async function addReply(id, payload) {
    const response = await fetch(`/api/topics/` + id + `/replies`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(Object.assign({}, payload))
      })
    return await response.status;
}