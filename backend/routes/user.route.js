import express from "express";
import { getLikes, getUserProfileAndRepos, likeUnlikeProfile, isProfileLiked } from "../controllers/user.controller.js";
import { ensureAuthenticated } from "../middleware/ensureAuthenticated.js";

const userRouter = express.Router();

userRouter.get("/profile/:username", getUserProfileAndRepos);
userRouter.get("/likes", ensureAuthenticated, getLikes);
userRouter.get("/isLiked/:username", ensureAuthenticated, isProfileLiked);
userRouter.post("/like/:username", ensureAuthenticated, likeUnlikeProfile);

export default userRouter;
