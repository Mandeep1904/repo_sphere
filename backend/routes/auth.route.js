import express from "express";
import passport from "passport";

const authRouter = express.Router();

authRouter.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

authRouter.get("/github/callback", 
	passport.authenticate("github", {failureRedirect: process.env.CLIENT_BASE_URL + "/login" }),
    function (req, res) {
        res.redirect(process.env.CLIENT_BASE_URL);
    }
);
    
authRouter.get("/check", (req, res) => {
	if (req.isAuthenticated()) {
		res.send({ user: req.user });
	} else {
		res.send({ user: null });
	}
});

authRouter.get("/logout", (req, res) => {
	req.session.destroy((err) => {
		res.json({ message: "Logged out" });
	});
});

export default authRouter;
