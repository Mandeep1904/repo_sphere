import { FaHeart } from "react-icons/fa";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import { useState, useEffect } from "react";

const LikeProfile = ({ userProfile }) => {
	const { authUser } = useAuthContext();
	const [liked, setLiked] = useState(false);

	const isOwnProfile = authUser?.username === userProfile.login;

	// Fetch initial like status
	useEffect(() => {
		const fetchLikeStatus = async () => {
			try {
				const res = await fetch(`/api/users/isLiked/${userProfile.login}`, { credentials: "include" });
				const data = await res.json();
				if (data.liked) setLiked(true);
			} catch (error) {
				console.error("Failed to fetch like status", error);
			}
		};

		fetchLikeStatus();
	}, [userProfile.login]);

	const handleLikeToggle = async () => {
		try {
			const res = await fetch(`/api/users/like/${userProfile.login}`, {
				method: "POST",
				credentials: "include",
			});
			const data = await res.json();
	
			if (data.error) throw new Error(data.error);
	
			setLiked((prevLiked) => !prevLiked); // Toggle state
			toast.success(data.message);
		} catch (error) {
			toast.error(error.message);
		}
	};	

	if (!authUser || isOwnProfile) return null;

	return (
		<button
			className={`p-2 text-xs w-full font-medium rounded-md bg-glass border ${
				liked ? "border-red-400 text-red-500" : "border-blue-400"
			} flex items-center gap-2`}
			onClick={handleLikeToggle}
		>
			<FaHeart size={16} className={liked ? "text-red-500" : ""} /> {liked ? "Unlike" : "Like"} Profile
		</button>
	);
};

export default LikeProfile;
