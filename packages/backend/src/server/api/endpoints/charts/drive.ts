import define from "../../define.js";

export const meta = {
	tags: ["charts", "drive"],
	requireCredentialPrivateMode: true,
	allowGet: true,
} as const;

export const paramDef = {
	type: "object",
	properties: {
		span: { type: "string", enum: ["day", "hour"] },
		limit: { type: "integer", minimum: 1, maximum: 500, default: 30 },
		offset: { type: "integer", nullable: true, default: null },
	},
	required: ["span"],
} as const;

export default define(meta, paramDef, async (ps) => {
	const zeros = new Array<number>(ps.limit ?? 30).fill(0);
	return {
		local: {
			decCount: zeros,
			decSize: zeros,
			incCount: zeros,
			incSize: zeros,
			totalCount: zeros,
			totalSize: zeros,
		},
		remote: {
			decCount: zeros,
			decSize: zeros,
			incCount: zeros,
			incSize: zeros,
			totalCount: zeros,
			totalSize: zeros,
		},
	};
});
