//----------------------------------------------------------

// Importing packages 
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import path from "path";

// Importing GitHub Authentication file
import "./passport/github.auth.js";

// Importing All routes
import userRouter from "./routes/user.route.js";
import exploreRouter from "./routes/explore.route.js";
import authRouter from "./routes/auth.route.js";

// Importing database connection function 
import connectDB from "./db/connectDB.js";

//----------------------------------------------------------

// Configurations
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: "keyboard cat", resave: false, saveUninitialized: false }));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

//----------------------------------------------------------

// Using routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/explore", exploreRouter);

// Serving the frontend routes from backend through the dist folder,
// so that frontend and backend both are on the same domain,
// so no need to use CORS 
app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

//----------------------------------------------------------

// Running the server
app.listen(port, () => {
	console.log(`🌼 Server running on http://localhost:${port}`);
	connectDB();
});
