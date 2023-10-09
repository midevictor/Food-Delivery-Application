const router = require("express").Router();
const admin = require("firebase-admin");
router.get("/", (req, res) => {
  return res.send("Inside the user router");
});

router.get("/jwtVerification", async (req, res) => {
  // if there is no request authoriztion
  if (!req.headers.authorization) {
    return res.status(500).send({msg: "Token Not Found"});
  }
  // gets the requestbauthorization and split it to the key
  const token = req.headers.authorization.split(" ")[1];
  try {
    // verify the token
    const decodedToken = await admin.auth().verifyIdToken(token);
    if (!decodedToken) {
      return res
          .status(500)
          .json({success: false, msg: "Unauthorised access"});
    }
    // return the decoded token
    return res.status(200).json({success: true, data: decodedToken});
  } catch (err) {
    // return error if there is an error
    return res.send({
      success: false,
      msg: `Error in extracting the token : ${err}`,
    });
  }
});


module.exports = router;
