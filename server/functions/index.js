/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const functions = require("firebase-functions");
require("dotenv").config();

const serviceAccountKey = require("./serviceAccountKey.json");
const express = require("express");
const app = express();

// body parser for the json
app.use(express.json());

// cross orgin
const cors = require("cors");
app.use(cors({origin: true}));
app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  next();
});
// firebase credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

// api endpoints
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const userRoute = require("./routes/user");
app.use("/api/users", userRoute);

exports.app = functions.https.onRequest(app);


// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
