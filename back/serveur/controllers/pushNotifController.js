const axios = require('axios');
const OneSignal = require('onesignal-node');

const appId = '7c881310-63a3-491d-9f56-736481d76e8a';
const restApiKey = 'MDAwMDA0YjUtNzNjYi00NjU0LThmN2EtZDM0NTlmYTIzYjBm';

async function sendNotification(playerIds, title, message) {
  const notification = {
    app_id: appId,
    include_player_ids: playerIds,
    headings: { en: title },
    contents: { en: message },
  };

  try {
    const response = await axios.post('https://onesignal.com/api/v1/notifications', notification, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${restApiKey}`,
      },
    });
    console.log('Notification sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending notification:', error.response.data);
    throw error;
  }
}

module.exports = { sendNotification };
