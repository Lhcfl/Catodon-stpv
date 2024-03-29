import define from "@/server/api/define.js";
import { createCleanRemoteFilesJob } from "@/queue/index.js";

export const meta = {
	tags: ["admin"],

	requireCredential: true,
	requireModerator: true,
} as const;

export const paramDef = {
	type: "object",
	properties: {},
	required: [],
} as const;

export default define(meta, paramDef, async (ps, me) => {
	createCleanRemoteFilesJob();
});
