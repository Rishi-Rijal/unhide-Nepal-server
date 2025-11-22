import express from "express";
import {
  listUsers,
  updateUserRole,
  deleteUser,
  listListings,
  verifyListing,
  deleteListing,
} from "../controllers/admin.controller.js";
import { verifyJWT, verifyAdmin } from "../controllers/auth.controller.js";

const router = express.Router();

// User management
router.route("/users").get(verifyJWT, verifyAdmin, listUsers);
router.route("/users/:id/role").patch(verifyJWT, verifyAdmin, updateUserRole);
router.route("/users/:id").delete(verifyJWT, verifyAdmin, deleteUser);

// Listing management
router.route("/listings").get(verifyJWT, verifyAdmin, listListings);
router.route("/listings/:id/verify").patch(verifyJWT, verifyAdmin, verifyListing);
router.route("/listings/:id").delete(verifyJWT, verifyAdmin, deleteListing);

export default router;
