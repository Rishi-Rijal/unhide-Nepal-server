import { Router } from "express";
import {
    addReview,
    getReviewsByListingId,
    updateReview,
    deleteReview
} from "../controllers/review.controller.js";

const router = Router();

// right now only use postId to save comments will be associated with userId later
router
    .route("/:postId")
    .get(getReviewsByListingId)
    .post(addReview)

router
    .route("/:reviewId")
    .patch(updateReview)
    .delete(deleteReview);

export default router