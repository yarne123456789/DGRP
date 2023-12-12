const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://de-grens-rp-default-rtdb.europe-west1.firebasedatabase.app"
});

const db = admin.database();
const ref = db.ref("serverSettings");

module.exports = {
    admin,
    ref,
};

