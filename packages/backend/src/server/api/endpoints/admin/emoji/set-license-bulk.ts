import define from "@/server/api/define.js";
import { Emojis } from "@/models/index.js";
import { In } from "typeorm";
import { db } from "@/db/postgre.js";

export const meta = {
	tags: ["admin"],

	requireCredential: true,
	requireModerator: true,
} as const;

export const paramDef = {
	type: "object",
	properties: {
		ids: {
			type: "array",
			items: {
				type: "string",
				format: "misskey:id",
			},
		},
		license: {
			type: "string",
			nullable: true,
			description: "Use `null` to reset the license.",
		},
	},
	required: ["ids"],
} as const;

export default define(meta, paramDef, async (ps) => {
	await Emojis.update(
		{
			id: In(ps.ids),
		},
		{
			updatedAt: new Date(),
			license: ps.license,
		},
	);

	await db.queryResultCache!.remove(["meta_emojis"]);
});
