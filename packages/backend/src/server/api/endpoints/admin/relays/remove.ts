import define from "@/server/api/define.js";
import { removeRelay } from "@/services/relay.js";

export const meta = {
	tags: ["admin"],

	requireCredential: true,
	requireModerator: true,
} as const;

export const paramDef = {
	type: "object",
	properties: {
		inbox: { type: "string" },
	},
	required: ["inbox"],
} as const;

export default define(meta, paramDef, async (ps, user) => {
	return await removeRelay(ps.inbox);
});
