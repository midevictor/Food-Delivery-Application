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

// create a cart request
router.post("/addToCart/:user_id", async (req, res) => {
  const userId = req.params.user_id;
  const productId = req.body.productId;
  try {
    // fetch the product id from the cart items
    const doc = await db
        .collection("cartItems")
        .doc(`/${userId}/`)
        .collection("items")
        .doc(`/${productId}/`)
        .get();
    // if the product id exist, update
    // else create a new product item for the cart items
    // push to cart items as a new product
    if (doc.data()) {
      const quantity = doc.data().quantity + 1;
      const updatedItem = await db
          .collection("cartItems")
          .doc(`/${userId}/`)
          .collection("items")
          .doc(`/${productId}/`)
          .update( {quantity: quantity});
      console.log("Updated item:", updatedItem); // Debugging
      return res.status(200).send({success: true, data: updatedItem});
    } else {
      const data = {
        productId: productId,
        product_name: req.body.product_name,
        product_category: req.body.product_category,
        product_price: req.body.product_price,
        imageUrl: req.body.imageUrl,
        quantity: 1,
      };
      const addItems = await db
          .collection("cartItems")
          .doc(`/${userId}/`)
          .collection("items")
          .doc(`/${productId}/`)
          .set(data);
      console.log("Added item:", addItems); // Debugging
      return res.status(200).send({success: true, data: addItems});
    }
  } catch (err) {
    console.error("Error:", err); // Debugging
    return res.send({success: false, msg: `Error: ${err}`});
  }
});

// get all the cart items for a user
router.get("/getCartItems/:user_id", async (req, res) => {
  const userId = req.params.user_id;
  (async () => {
    try {
      const query = db
          .collection("cartItems")
          .doc(`/${userId}/`)
          .collection("items");
      const response = [];

      await query.get().then((querysnap) => {
        const docs = querysnap.docs;

        docs.map((doc) => {
          response.push({...doc.data()});
        });
        return response;
      });
      return res.status(200).send({success: true, data: response});
    } catch (er) {
      return res.send({success: false, msg: `Error :,${er}`});
    }
  })();
});


module.exports = router;
