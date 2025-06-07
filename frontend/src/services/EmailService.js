import { post } from './ApiService';

export async function sendNotificationNewPost(payload) {
    return await post('/api/sendEmailPost', payload);
}

export async function addSubscription(payload) {
    return await post('/api/setupSubscription', payload);
}

export async function checkSubscription(payload) {
    return await post('/api/checkSubscription', payload);
}

export async function deleteSubscription(payload) {
    return await post('/api/deleteSubscription', payload);
}