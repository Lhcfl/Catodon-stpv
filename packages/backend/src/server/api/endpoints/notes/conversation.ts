import type { Note } from "@/models/entities/note.js";
import { Notes } from "@/models/index.js";
import define from "@/server/api/define.js";
import { ApiError } from "@/server/api/error.js";
import { getNote } from "@/server/api/common/getters.js";

export const meta = {
	tags: ["notes"],

	requireCredential: false,
	requireCredentialPrivateMode: true,
	description: "Get conversation of a note thread/chain by a reply",

	res: {
		type: "array",
		optional: false,
		nullable: false,
		items: {
			type: "object",
			optional: false,
			nullable: false,
			ref: "Note",
		},
	},

	errors: {
		noSuchNote: {
			message: "No such note.",
			code: "NO_SUCH_NOTE",
			id: "e1035875-9551-45ec-afa8-1ded1fcb53c8",
		},
	},
} as const;

export const paramDef = {
	type: "object",
	properties: {
		noteId: {
			type: "string",
			format: "misskey:id",
			description: "Should be a reply",
		},
		limit: { type: "integer", minimum: 1, maximum: 100, default: 10 },
		offset: { type: "integer", default: 0 },
	},
	required: ["noteId"],
} as const;

export default define(meta, paramDef, async (ps, user) => {
	const note = await getNote(ps.noteId, user).catch((err) => {
		if (err.id === "9725d0ce-ba28-4dde-95a7-2cbb2c15de24")
			throw new ApiError(meta.errors.noSuchNote);
		throw err;
	});

	const conversation: Note[] = [];
	let i = 0;

	async function get(id: string) {
		i++;
		const p = await getNote(id, user).catch((e) => {
			if (e.id === "9725d0ce-ba28-4dde-95a7-2cbb2c15de24") return null;
			throw e;
		});

		if (p == null) return;

		if (i > ps.offset) {
			conversation.push(p);
		}

		if (conversation.length === ps.limit) {
			return;
		}

		if (p.replyId) {
			await get(p.replyId);
		}
	}

	if (note.replyId) {
		await get(note.replyId);
	}

	return await Notes.packMany(conversation, user);
});
