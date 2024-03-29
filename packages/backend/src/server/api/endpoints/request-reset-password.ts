import rndstr from "rndstr";
import { IsNull } from "typeorm";
import config from "@/config/index.js";
import { Users, UserProfiles, PasswordResetRequests } from "@/models/index.js";
import { sendEmail } from "@/services/send-email.js";
import { genId } from "@/misc/gen-id.js";
import define from "@/server/api/define.js";
import { HOUR } from "@/const.js";

export const meta = {
	tags: ["reset password"],

	requireCredential: false,

	description: "Request a users password to be reset.",

	limit: {
		duration: HOUR,
		max: 3,
	},

	errors: {},
} as const;

export const paramDef = {
	type: "object",
	properties: {
		username: { type: "string" },
		email: { type: "string" },
	},
	required: ["username", "email"],
} as const;

export default define(meta, paramDef, async (ps) => {
	const user = await Users.findOneBy({
		usernameLower: ps.username.toLowerCase(),
		host: IsNull(),
	});

	// 合致するユーザーが登録されていなかったら無視
	if (user == null) {
		return;
	}

	const profile = await UserProfiles.findOneByOrFail({ userId: user.id });

	// 合致するメアドが登録されていなかったら無視
	if (profile.email !== ps.email) {
		return;
	}

	// メアドが認証されていなかったら無視
	if (!profile.emailVerified) {
		return;
	}

	const token = rndstr("a-z0-9", 64);

	await PasswordResetRequests.insert({
		id: genId(),
		createdAt: new Date(),
		userId: profile.userId,
		token,
	});

	const link = `${config.url}/reset-password/${token}`;

	sendEmail(
		ps.email,
		"Password reset requested",
		`To reset password, please click this link:<br><a href="${link}">${link}</a>`,
		`To reset password, please click this link: ${link}`,
	);
});
