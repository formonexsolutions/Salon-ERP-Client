









const express = require("express");
const router = express.Router();
const multer = require("multer"); // for handling file uploads
const {
  getOffers,
  createOffer,
  deleteOffer,
  addInterest,
  getInterestedUsers,
} = require("../controllers/offerSuperAdminController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed!"), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Routes
router.get("/offers", getOffers);
router.post("/offers", upload.single("image"), createOffer);
router.delete("/offers/:id", deleteOffer);

router.post("/interest", addInterest);

router.get('/offers/:offerId/interested-users', getInterestedUsers);


module.exports = router;
