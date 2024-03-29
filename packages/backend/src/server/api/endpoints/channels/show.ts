import define from "@/server/api/define.js";
import { ApiError } from "@/server/api/error.js";
import { Channels } from "@/models/index.js";

export const meta = {
	tags: ["channels"],

	requireCredential: false,
	requireCredentialPrivateMode: true,

	res: {
		type: "object",
		optional: false,
		nullable: false,
		ref: "Channel",
	},

	errors: {
		noSuchChannel: {
			message: "No such channel.",
			code: "NO_SUCH_CHANNEL",
			id: "6f6c314b-7486-4897-8966-c04a66a02923",
		},
	},
} as const;

export const paramDef = {
	type: "object",
	properties: {
		channelId: { type: "string", format: "misskey:id" },
	},
	required: ["channelId"],
} as const;

export default define(meta, paramDef, async (ps, me) => {
	const channel = await Channels.findOneBy({
		id: ps.channelId,
	});

	if (channel == null) {
		throw new ApiError(meta.errors.noSuchChannel);
	}

	return await Channels.pack(channel, me);
});
