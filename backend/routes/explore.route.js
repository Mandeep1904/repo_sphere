import express from "express";
import { explorePopularRepos } from "../controllers/explore.controller.js";
import { ensureAuthenticated } from "../middleware/ensureAuthenticated.js";

const exploreRouter = express.Router();

exploreRouter.get("/repos/:language", ensureAuthenticated, explorePopularRepos);

export default exploreRouter;
