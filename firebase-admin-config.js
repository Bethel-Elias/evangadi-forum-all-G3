const admin = require("firebase-admin");
require("dotenv").config();

let db, auth;

try {
    const serviceAccount = {
        type: "service_account",
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
    };

    // Check if required Firebase configuration is present
    const requiredFields = ['project_id', 'private_key_id', 'private_key', 'client_email', 'client_id', 'client_x509_cert_url'];
    const missingFields = requiredFields.filter(field => !serviceAccount[field] || serviceAccount[field].includes('your-'));

    if (missingFields.length > 0) {
        console.warn(`Firebase configuration incomplete. Missing or placeholder values for: ${missingFields.join(', ')}. Please update your .env file.`);
    } else {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        db = admin.firestore();
        auth = admin.auth();
        console.log("Firebase Admin SDK initialized successfully");
    }
} catch (error) {
    console.error("Firebase Admin SDK initialization failed:", error.message);
}

module.exports = { admin, db, auth };
