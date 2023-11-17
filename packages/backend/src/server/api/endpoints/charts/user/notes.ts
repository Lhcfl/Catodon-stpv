import define from "../../../define.js";

export const meta = {
	tags: ["charts", "users", "notes"],
	requireCredentialPrivateMode: true,
	allowGet: true,
} as const;

export const paramDef = {
	type: "object",
	properties: {
		span: { type: "string", enum: ["day", "hour"] },
		limit: { type: "integer", minimum: 1, maximum: 500, default: 30 },
		offset: { type: "integer", nullable: true, default: null },
		userId: { type: "string", format: "misskey:id" },
	},
	required: ["span", "userId"],
} as const;

export default define(meta, paramDef, async (ps) => {
	const zeros = new Array<number>(ps.limit ?? 30).fill(0);
	return {
		total: zeros,
		inc: zeros,
		dec: zeros,
		diffs: {
			normal: zeros,
			reply: zeros,
			renote: zeros,
			withFile: zeros,
		},
	};
});
