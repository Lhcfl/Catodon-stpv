import { UserGroups, UserGroupJoinings } from "@/models/index.js";
import { genId } from "@/misc/gen-id.js";
import type { UserGroup } from "@/models/entities/user-group.js";
import type { UserGroupJoining } from "@/models/entities/user-group-joining.js";
import define from "@/server/api/define.js";

export const meta = {
	tags: ["groups"],

	requireCredential: true,

	kind: "write:user-groups",

	description: "Create a new group.",

	res: {
		type: "object",
		optional: false,
		nullable: false,
		ref: "UserGroup",
	},
} as const;

export const paramDef = {
	type: "object",
	properties: {
		name: { type: "string", minLength: 1, maxLength: 100 },
	},
	required: ["name"],
} as const;

export default define(meta, paramDef, async (ps, user) => {
	const userGroup = await UserGroups.insert({
		id: genId(),
		createdAt: new Date(),
		userId: user.id,
		name: ps.name,
	} as UserGroup).then((x) => UserGroups.findOneByOrFail(x.identifiers[0]));

	// Push the owner
	await UserGroupJoinings.insert({
		id: genId(),
		createdAt: new Date(),
		userId: user.id,
		userGroupId: userGroup.id,
	} as UserGroupJoining);

	return await UserGroups.pack(userGroup);
});
