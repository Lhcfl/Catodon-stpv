import define from "@/server/api/define.js";
import { Emojis } from "@/models/index.js";
import { ApiError } from "@/server/api/error.js";
import { db } from "@/db/postgre.js";

export const meta = {
	tags: ["admin"],

	requireCredential: true,
	requireModerator: true,

	errors: {
		noSuchEmoji: {
			message: "No such emoji.",
			code: "NO_SUCH_EMOJI",
			id: "684dec9d-a8c2-4364-9aa8-456c49cb1dc8",
		},
	},
} as const;

export const paramDef = {
	type: "object",
	properties: {
		id: { type: "string", format: "misskey:id" },
		name: { type: "string" },
		category: {
			type: "string",
			nullable: true,
			description: "Use `null` to reset the category.",
		},
		aliases: {
			type: "array",
			items: {
				type: "string",
			},
		},
		license: {
			type: "string",
			nullable: true,
		},
	},
	required: ["id", "name", "aliases"],
} as const;

export default define(meta, paramDef, async (ps) => {
	const emoji = await Emojis.findOneBy({ id: ps.id });

	if (emoji == null) throw new ApiError(meta.errors.noSuchEmoji);

	await Emojis.update(emoji.id, {
		updatedAt: new Date(),
		name: ps.name,
		category: ps.category,
		aliases: ps.aliases,
		license: ps.license,
	});

	await db.queryResultCache!.remove(["meta_emojis"]);
});
