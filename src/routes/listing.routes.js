import { Router } from "express";
import { createListing, getListings, getListing, updateListing, deleteListing } from "../controllers/listing.controller.js";
import {upload} from "../middlewares/multer.middleware.js";
const router = Router();

// Example route for listings
router
.route("/")
    .get(getListings)
    .post(upload.fields([{ name: "images", maxCount: 5 }]), createListing);

router.route("/:id")
    .get(getListing)
    .patch(updateListing)
    .delete(deleteListing);


export default router;