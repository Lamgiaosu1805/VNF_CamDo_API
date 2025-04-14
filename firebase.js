const admin = require("firebase-admin");
const serviceAccount = require("./confNoti.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

module.exports = admin.messaging();