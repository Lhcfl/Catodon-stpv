import define from "../../define.js";

export const meta = {
	tags: ["charts"],
	requireCredentialPrivateMode: true,
	allowGet: true,
} as const;

export const paramDef = {
	type: "object",
	properties: {
		span: { type: "string", enum: ["day", "hour"] },
		limit: { type: "integer", minimum: 1, maximum: 500, default: 30 },
		offset: { type: "integer", nullable: true, default: null },
		host: { type: "string" },
	},
	required: ["span", "host"],
} as const;

export default define(meta, paramDef, async (ps) => {
	const zeros = new Array<number>(ps.limit ?? 30).fill(0);
	return {
		requests: { failed: zeros, succeeded: zeros, received: zeros },
		notes: {
			total: zeros,
			inc: zeros,
			dec: zeros,
			diffs: { normal: zeros, reply: zeros, renote: zeros, withFile: zeros },
		},
		users: { total: zeros, inc: zeros, dec: zeros },
		following: { total: zeros, inc: zeros, dec: zeros },
		followers: { total: zeros, inc: zeros, dec: zeros },
		drive: {
			totalFiles: zeros,
			incFiles: zeros,
			decFiles: zeros,
			incUsage: zeros,
			decUsage: zeros,
		},
	};
});
