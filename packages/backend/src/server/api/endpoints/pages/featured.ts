import { Pages } from "@/models/index.js";
import define from "@/server/api/define.js";

export const meta = {
	tags: ["pages"],

	requireCredential: false,
	requireCredentialPrivateMode: true,

	res: {
		type: "array",
		optional: false,
		nullable: false,
		items: {
			type: "object",
			optional: false,
			nullable: false,
			ref: "Page",
		},
	},
} as const;

export const paramDef = {
	type: "object",
	properties: {},
	required: [],
} as const;

export default define(meta, paramDef, async (ps, me) => {
	const query = Pages.createQueryBuilder("page")
		.where("page.visibility = 'public'")
		.andWhere("page.likedCount > 0")
		.orderBy("page.likedCount", "DESC");

	const pages = await query.take(10).getMany();

	return await Pages.packMany(pages, me);
});
