import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";

const getUserProfileAndRepos = asyncHandler(async (req, res) => {
	const { username } = req.params;

	const userRes = await fetch(`https://api.github.com/users/${username}`, {
		headers: {
			authorization: `token ${process.env.GITHUB_API_KEY}`,
		},
	});

	const userProfile = await userRes.json();

	const repoRes = await fetch(userProfile.repos_url, {
		headers: {
			authorization: `token ${process.env.GITHUB_API_KEY}`,
		},
	});
	const repos = await repoRes.json();

	res.status(200).json({ userProfile, repos });

})

const isProfileLiked = asyncHandler(async (req, res) => {
	const { username } = req.params;
	const user = await User.findById(req.user._id.toString());

	if (!user) {
		return res.status(401).json({ error: "Unauthorized" });
	}

	const isLiked = user.likedProfiles.includes(username);

	res.status(200).json({ liked: isLiked });
});


const likeUnlikeProfile = asyncHandler(async (req, res) => {
	const { username } = req.params;
	const user = await User.findById(req.user._id.toString());
	const userToLike = await User.findOne({ username });

	if (!user) {
		return res.status(401).json({ error: "Unauthorized" });
	}	

	if (!userToLike) {
		return res.status(404).json({ error: "User is not a member in this app" });
	}

	// Check if already liked, then unlike instead of throwing an error
	const alreadyLiked = user.likedProfiles.includes(userToLike.username);

	if (alreadyLiked) {
		// Unlike Logic: Remove from likedProfiles & likedBy
		user.likedProfiles = user.likedProfiles.filter((u) => u !== userToLike.username);
		userToLike.likedBy = userToLike.likedBy.filter((u) => u.username !== user.username);

		await Promise.all([user.save(), userToLike.save()]);
		return res.status(200).json({ message: "User unliked" });
	}

	// Like Logic: Add to likedProfiles & likedBy
	userToLike.likedBy.push({ username: user.username, avatarUrl: user.avatarUrl, likedDate: Date.now() });
	user.likedProfiles.push(userToLike.username);

	await Promise.all([user.save(), userToLike.save()]);

	res.status(200).json({ message: "User liked" });
});

const getLikes = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id.toString());
	res.status(200).json({ likedBy: user.likedBy });
})

export {
	getUserProfileAndRepos,
	likeUnlikeProfile,
	isProfileLiked,
	getLikes,
}