import { Router } from "express";
import { createListing, getListings, getListing, updateListing, deleteListing, getListingFiltered } from "../controllers/listing.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

//route for listings
router
    .route("/")
    .get(getListings)
    .post(upload.fields([{ name: "images", maxCount: 5 }]), createListing);

router
    .route("/filter")
    .post(getListingFiltered);

router
    .route("/:id")
    .get(getListing)
    .patch(updateListing)
    .delete(deleteListing);




export default router;