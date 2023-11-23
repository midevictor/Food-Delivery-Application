const router = require("express").Router();
const admin = require("firebase-admin");
const db = admin.firestore();
db.settings({ignoreUndefinedProperties: true});
router.post("/create", async (req, res) => {
  try {
    const id = Date.now();
    const data = {
      productId: id,
      product_name: req.body.product_name,
      product_category: req.body.product_category,
      product_price: req.body.product_price,
      imageUrl: req.body.imageUrl,
    };
    const response = await db.collection("products").doc(`/${id}/`).set(data);
    console.log(response);
    return res.status(200).send({success: true, data: response});
  } catch (err) {
    return res.send({success: false, msg: `Error: ${err}`});
  }
});

// get all products from firebase
router.get("/all", async (req, res) => {
  (async () => {
    try {
      const query = db.collection("products");
      const response = [];
      await query.get().then((querysnap) => {
        const docs = querysnap.docs;
        docs.map((doc) => {
          response.push({...doc.data()});
        });
        return response;
      });
      return res.status(200).send({success: true, data: response});
    } catch (err) {
      return res.send({success: false, msg: `Erroor: ${err}`});
    }
  })();
});

// delete a product
// eslint-disable-next-line
router.delete("/delete/:productId", async (req, res) => {
  const productId = req.params.productId;
  try {
    await db.collection("products").doc(`/${productId}/`).delete()
    // eslint-disable-next-line
.then((result) => {
          // eslint-disable-next-line
        return res.status(200).send({success: true, data: result});
        // eslint-disable-next-line
      });
  } catch (err) {
    return res.send({success: false, msg: `Erroor: ${err}`});
  }
});

module.exports = router;
