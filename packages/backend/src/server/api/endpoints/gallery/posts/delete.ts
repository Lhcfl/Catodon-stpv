import define from "@/server/api/define.js";
import { ApiError } from "@/server/api/error.js";
import { GalleryPosts } from "@/models/index.js";

export const meta = {
	tags: ["gallery"],

	requireCredential: true,

	kind: "write:gallery",

	errors: {
		noSuchPost: {
			message: "No such post.",
			code: "NO_SUCH_POST",
			id: "ae52f367-4bd7-4ecd-afc6-5672fff427f5",
		},
	},
} as const;

export const paramDef = {
	type: "object",
	properties: {
		postId: { type: "string", format: "misskey:id" },
	},
	required: [],
} as const;

export default define(meta, paramDef, async (ps, user) => {
	let posts: string[] = [];
	if (ps.postId) {
		const post = await GalleryPosts.findOneBy({
			id: ps.postId,
			userId: user.id,
		});
		if (!post) {
			throw new ApiError(meta.errors.noSuchPost);
		}
		posts.push(post.id);
	} else {
		posts = await GalleryPosts.find({
			select: ["id"],
			where: {
				userId: user.id
			}
		}).then((posts) => posts.map(({ id }) => id));
	}

	await GalleryPosts.delete(posts);
});
