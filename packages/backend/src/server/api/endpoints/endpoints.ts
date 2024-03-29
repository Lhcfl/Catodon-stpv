import define from "@/server/api/define.js";
import endpoints from "@/server/api/endpoints.js";

export const meta = {
	requireCredential: false,

	tags: ["meta"],

	res: {
		type: "array",
		optional: false,
		nullable: false,
		items: {
			type: "string",
			optional: false,
			nullable: false,
		},
		example: [
			"admin/abuse-user-reports",
			"admin/accounts/create",
			"admin/announcements/create",
			"...",
		],
	},
} as const;

export const paramDef = {
	type: "object",
	properties: {},
	required: [],
} as const;

export default define(meta, paramDef, async () => {
	return endpoints.map((x) => x.name);
});
