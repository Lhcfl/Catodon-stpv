import { Instances, Notes, Users } from "@/models/index.js";
import define from "../define.js";
import { IsNull } from "typeorm";

export const meta = {
	requireCredential: false,
	requireCredentialPrivateMode: true,

	tags: ["meta"],

	cacheSec: 300,

	res: {
		type: "object",
		optional: false,
		nullable: false,
		properties: {
			notesCount: {
				type: "number",
				optional: false,
				nullable: false,
			},
			originalNotesCount: {
				type: "number",
				optional: false,
				nullable: false,
			},
			usersCount: {
				type: "number",
				optional: false,
				nullable: false,
			},
			originalUsersCount: {
				type: "number",
				optional: false,
				nullable: false,
			},
			instances: {
				type: "number",
				optional: false,
				nullable: false,
			},
			driveUsageLocal: {
				type: "number",
				optional: false,
				nullable: false,
			},
			driveUsageRemote: {
				type: "number",
				optional: false,
				nullable: false,
			},
		},
	},
} as const;

export const paramDef = {
	type: "object",
	properties: {},
	required: [],
} as const;

export default define(meta, paramDef, async () => {
	const [
		notesCount,
		originalNotesCount,
		usersCount,
		originalUsersCount,
		reactionsCount,
		instances,
		driveUsageLocal,
		driveUsageRemote,
	] = await Promise.all([
		// notesCount
		Notes.count(),
		// originalNotesCount
		Notes.count({
			where: {
				userHost: IsNull(),
			},
		}),
		// usersCount
		Users.count(),
		// originalUsersCount
		Users.count({
			where: {
				host: IsNull(),
			},
		}),
		// reactionsCount
		0,
		// instances
		Instances.count(),
		// driveUsageLocal
		0,
		// driveUsageRemote
		0,
	]);

	return {
		notesCount,
		originalNotesCount,
		usersCount,
		originalUsersCount,
		reactionsCount,
		instances,
		driveUsageLocal,
		driveUsageRemote,
	};
});
