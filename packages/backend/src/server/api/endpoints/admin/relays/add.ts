import { URL } from "node:url";
import define from "@/server/api/define.js";
import { addRelay } from "@/services/relay.js";
import { ApiError } from "@/server/api/error.js";

export const meta = {
	tags: ["admin"],

	requireCredential: true,
	requireModerator: true,

	errors: {
		invalidUrl: {
			message: "Invalid URL",
			code: "INVALID_URL",
			id: "fb8c92d3-d4e5-44e7-b3d4-800d5cef8b2c",
		},
	},

	res: {
		type: "object",
		optional: false,
		nullable: false,
		properties: {
			id: {
				type: "string",
				optional: false,
				nullable: false,
				format: "id",
			},
			inbox: {
				description: "URL of the inbox, must be a https scheme URL",
				type: "string",
				optional: false,
				nullable: false,
				format: "url",
			},
			status: {
				type: "string",
				optional: false,
				nullable: false,
				default: "requesting",
				enum: ["requesting", "accepted", "rejected"],
			},
		},
	},
} as const;

export const paramDef = {
	type: "object",
	properties: {
		inbox: { type: "string" },
	},
	required: ["inbox"],
} as const;

export default define(meta, paramDef, async (ps, user) => {
	try {
		if (new URL(ps.inbox).protocol !== "https:") throw new Error("https only");
	} catch {
		throw new ApiError(meta.errors.invalidUrl);
	}

	return await addRelay(ps.inbox);
});
