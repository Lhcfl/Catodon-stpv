import deleteReaction from "@/services/note/reaction/delete.js";
import define from "@/server/api/define.js";
import { getNote } from "@/server/api/common/getters.js";
import { ApiError } from "@/server/api/error.js";
import { SECOND, HOUR } from "@/const.js";

export const meta = {
	tags: ["reactions", "notes"],

	requireCredential: true,

	kind: "write:reactions",

	limit: {
		duration: HOUR,
		max: 60,
		minInterval: 3 * SECOND,
	},

	errors: {
		noSuchNote: {
			message: "No such note.",
			code: "NO_SUCH_NOTE",
			id: "764d9fce-f9f2-4a0e-92b1-6ceac9a7ad37",
		},

		notReacted: {
			message: "You are not reacting to that note.",
			code: "NOT_REACTED",
			id: "92f4426d-4196-4125-aa5b-02943e2ec8fc",
		},
	},
} as const;

export const paramDef = {
	type: "object",
	properties: {
		noteId: { type: "string", format: "misskey:id" },
	},
	required: ["noteId"],
} as const;

export default define(meta, paramDef, async (ps, user) => {
	const note = await getNote(ps.noteId, user).catch((err) => {
		if (err.id === "9725d0ce-ba28-4dde-95a7-2cbb2c15de24")
			throw new ApiError(meta.errors.noSuchNote);
		throw err;
	});
	await deleteReaction(user, note).catch((e) => {
		if (e.id === "60527ec9-b4cb-4a88-a6bd-32d3ad26817d")
			throw new ApiError(meta.errors.notReacted);
		throw e;
	});
});
