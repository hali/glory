export async function sendNotificationNewPost(payload) {
    const response = await fetch(`/api/sendEmailPost`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(Object.assign({}, payload))
      })
    return await response.json();
}

export async function addSubscription(payload) {
    const response = await fetch(`/api/setupSubscription`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(Object.assign({}, payload))
      })
    return await response.json();
}

export async function checkSubscription(payload) {
    const response = await fetch(`/api/checkSubscription`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(Object.assign({}, payload))
      })
    return await response.json();
}

export async function deleteSubscription(payload) {
    const response = await fetch(`/api/deleteSubscription`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(Object.assign({}, payload))
      })
    return await response.json();
}