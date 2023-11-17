import define from "../../define.js";

export const meta = {
	tags: ["charts", "hashtags"],
	requireCredentialPrivateMode: true,
	allowGet: true,
} as const;

export const paramDef = {
	type: "object",
	properties: {
		span: { type: "string", enum: ["day", "hour"] },
		limit: { type: "integer", minimum: 1, maximum: 500, default: 30 },
		offset: { type: "integer", nullable: true, default: null },
		tag: { type: "string" },
	},
	required: ["span", "tag"],
} as const;

export default define(meta, paramDef, async (ps) => {
	const zeros = new Array<number>(ps.limit ?? 30).fill(0);
	return {
		local: {
			users: zeros,
		},
		remote: {
			users: zeros,
		},
	};
});
