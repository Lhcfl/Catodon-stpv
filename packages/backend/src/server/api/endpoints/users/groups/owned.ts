import { UserGroups } from "@/models/index.js";
import define from "@/server/api/define.js";

export const meta = {
	tags: ["groups", "account"],

	requireCredential: true,

	kind: "read:user-groups",

	description: "List the groups that the authenticated user is the owner of.",

	res: {
		type: "array",
		optional: false,
		nullable: false,
		items: {
			type: "object",
			optional: false,
			nullable: false,
			ref: "UserGroup",
		},
	},
} as const;

export const paramDef = {
	type: "object",
	properties: {},
	required: [],
} as const;

export default define(meta, paramDef, async (ps, me) => {
	const userGroups = await UserGroups.findBy({
		userId: me.id,
	});

	return await Promise.all(userGroups.map((x) => UserGroups.pack(x)));
});
