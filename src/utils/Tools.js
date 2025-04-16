const { Expo } = require("expo-server-sdk");
const { messaging } = require("firebase-admin");

const sendNotification = (listToken, title, content) => {
    let expo = new Expo({
        accessToken: process.env.EXPO_ACCESS_TOKEN,
        /*
         * @deprecated
         * The optional useFcmV1 parameter defaults to true, as FCMv1 is now the default for the Expo push service.
         *
         * If using FCMv1, the useFcmV1 parameter may be omitted.
         * Set this to false to have Expo send to the legacy endpoint.
         *
         * See https://firebase.google.com/support/faq#deprecated-api-shutdown
         * for important information on the legacy endpoint shutdown.
         *
         * Once the legacy service is fully shut down, the parameter will be removed in a future PR.
         */
        useFcmV1: true,
      });
      
      // Create the messages that you want to send to clients
      let messages = [];
      for (let pushToken of listToken) {
        // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]
      
        // Check that all your push tokens appear to be valid Expo push tokens
        if (!Expo.isExpoPushToken(pushToken)) {
          console.error(`Push token ${pushToken} is not a valid Expo push token`);
          continue;
        }
      
        // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
        messages.push({
          to: pushToken,
          title: title,
          sound: 'default',
          body: content,
          data: { withSome: 'data' },
        })
      }
      
      // The Expo push notification service accepts batches of notifications so
      // that you don't need to send 1000 requests to send 1000 notifications. We
      // recommend you batch your notifications to reduce the number of requests
      // and to compress them (notifications with similar content will get
      // compressed).
      let chunks = expo.chunkPushNotifications(messages);
      let tickets = [];
      (async () => {
        // Send the chunks to the Expo push notification service. There are
        // different strategies you could use. A simple one is to send one chunk at a
        // time, which nicely spreads the load out over time:
        for (let chunk of chunks) {
          try {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            console.log(ticketChunk);
            tickets.push(...ticketChunk);
            // NOTE: If a ticket contains an error code in ticket.details.error, you
            // must handle it appropriately. The error codes are listed in the Expo
            // documentation:
            // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
          } catch (error) {
            console.error(error);
          }
        }
      })();
      
    //   ...
      
      // Later, after the Expo push notification service has delivered the
      // notifications to Apple or Google (usually quickly, but allow the service
      // up to 30 minutes when under load), a "receipt" for each notification is
      // created. The receipts will be available for at least a day; stale receipts
      // are deleted.
      //
      // The ID of each receipt is sent back in the response "ticket" for each
      // notification. In summary, sending a notification produces a ticket, which
      // contains a receipt ID you later use to get the receipt.
      //
      // The receipts may contain error codes to which you must respond. In
      // particular, Apple or Google may block apps that continue to send
      // notifications to devices that have blocked notifications or have uninstalled
      // your app. Expo does not control this policy and sends back the feedback from
      // Apple and Google so you can handle it appropriately.
      let receiptIds = [];
      for (let ticket of tickets) {
        // NOTE: Not all tickets have IDs; for example, tickets for notifications
        // that could not be enqueued will have error information and no receipt ID.
         if (ticket.status === 'ok') {
          receiptIds.push(ticket.id);
        }
      }
      
      let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
      (async () => {
        // Like sending notifications, there are different strategies you could use
        // to retrieve batches of receipts from the Expo service.
        for (let chunk of receiptIdChunks) {
          try {
            let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
            console.log(receipts);
      
            // The receipts specify whether Apple or Google successfully received the
            // notification and information about an error, if one occurred.
            for (let receiptId in receipts) {
              let { status, message, details } = receipts[receiptId];
              if (status === 'ok') {
                continue;
              } else if (status === 'error') {
                console.error(
                  `There was an error sending a notification: ${message}`
                );
                if (details && details.error) {
                  // The error codes are listed in the Expo documentation:
                  // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
                  // You must handle the errors appropriately.
                  console.error(`The error code is ${details.error}`);
                }
              }
            }
          } catch (error) {
            console.error(error);
          }
        }
    })();
}

const formatMoney = (money) => {
  return money.toLocaleString("de-DE")
}

const hideUsername = (username) => {
  return "xxx" + username.substring(5);
}

const sendNotificationToAdmin = async (tokens, title, body) => {
  if (!tokens || tokens.length === 0) {
    console.warn('⚠️ No tokens provided.');
    return;
  }

  const message = {
    tokens: tokens, // danh sách token
    notification: {
      title: title,
      body: body,
    },
    android: {
      priority: 'high',
    },
    apns: {
      payload: {
        aps: {
          sound: 'default',
        },
      },
    },
  };

  try {
    const response = await messaging.sendMulticast(message);
    console.log(`✅ Notifications sent: ${response.successCount} success, ${response.failureCount} failed`);
    
    // Nếu cần xử lý những token lỗi (ví dụ: không còn hợp lệ)
    if (response.failureCount > 0) {
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          console.error(`❌ Token failed [${tokens[idx]}]:`, resp.error);
        }
      });
    }
  } catch (error) {
    console.error('❌ Error sending multicast notification:', error);
  }
};

module.exports = { sendNotification, formatMoney, hideUsername, sendNotificationToAdmin }