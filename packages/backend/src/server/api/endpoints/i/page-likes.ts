import { PageLikes } from "@/models/index.js";
import define from "@/server/api/define.js";
import { makePaginationQuery } from "@/server/api/common/make-pagination-query.js";

export const meta = {
	tags: ["account", "pages"],

	requireCredential: true,

	kind: "read:page-likes",

	res: {
		type: "array",
		optional: false,
		nullable: false,
		items: {
			type: "object",
			properties: {
				id: {
					type: "string",
					optional: false,
					nullable: false,
					format: "id",
				},
				page: {
					type: "object",
					optional: false,
					nullable: false,
					ref: "Page",
				},
			},
		},
	},
} as const;

export const paramDef = {
	type: "object",
	properties: {
		limit: { type: "integer", minimum: 1, maximum: 100, default: 10 },
		sinceId: { type: "string", format: "misskey:id" },
		untilId: { type: "string", format: "misskey:id" },
	},
	required: [],
} as const;

export default define(meta, paramDef, async (ps, user) => {
	const query = makePaginationQuery(
		PageLikes.createQueryBuilder("like"),
		ps.sinceId,
		ps.untilId,
	)
		.andWhere("like.userId = :meId", { meId: user.id })
		.leftJoinAndSelect("like.page", "page");

	const likes = await query.take(ps.limit).getMany();

	return PageLikes.packMany(likes, user);
});
