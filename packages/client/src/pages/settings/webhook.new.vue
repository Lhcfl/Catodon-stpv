<template>
	<div class="_formRoot">
		<FormInput v-model="name" class="_formBlock">
			<template #label>Name</template>
		</FormInput>

		<FormInput v-model="url" type="url" class="_formBlock">
			<template #label>URL</template>
		</FormInput>

		<FormInput v-model="secret" class="_formBlock">
			<template #prefix><i :class="icon('ph-lock')"></i></template>
			<template #label>Secret</template>
		</FormInput>

		<FormSection>
			<template #label>Events</template>

			<FormSwitch v-model="event_follow" class="_formBlock"
				>Follow</FormSwitch
			>
			<FormSwitch v-model="event_followed" class="_formBlock"
				>Followed</FormSwitch
			>
			<FormSwitch v-model="event_note" class="_formBlock"
				>Posts</FormSwitch
			>
			<FormSwitch v-model="event_reply" class="_formBlock"
				>Replies</FormSwitch
			>
			<FormSwitch v-model="event_renote" class="_formBlock"
				>Boosts</FormSwitch
			>
			<FormSwitch v-model="event_reaction" class="_formBlock"
				>Reaction</FormSwitch
			>
			<FormSwitch v-model="event_mention" class="_formBlock"
				>Mention</FormSwitch
			>
		</FormSection>

		<div
			class="_formBlock"
			style="display: flex; gap: var(--margin); flex-wrap: wrap"
		>
			<FormButton primary inline @click="create"
				><i :class="icon('ph-check')"></i>
				{{ i18n.ts.create }}</FormButton
			>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import FormInput from "@/components/form/input.vue";
import FormSection from "@/components/form/section.vue";
import FormSwitch from "@/components/form/switch.vue";
import FormButton from "@/components/MkButton.vue";
import * as os from "@/os";
import { i18n } from "@/i18n";
import { definePageMetadata } from "@/scripts/page-metadata";
import icon from "@/scripts/icon";

const name = ref("");
const url = ref("");
const secret = ref("");

const event_follow = ref(true);
const event_followed = ref(true);
const event_note = ref(true);
const event_reply = ref(true);
const event_renote = ref(true);
const event_reaction = ref(true);
const event_mention = ref(true);

async function create(): Promise<void> {
	const events = [];
	if (event_follow.value) events.push("follow");
	if (event_followed.value) events.push("followed");
	if (event_note.value) events.push("note");
	if (event_reply.value) events.push("reply");
	if (event_renote.value) events.push("renote");
	if (event_reaction.value) events.push("reaction");
	if (event_mention.value) events.push("mention");

	os.apiWithDialog("i/webhooks/create", {
		name: name.value,
		url: url.value,
		secret: secret.value,
		on: events,
	});
}

definePageMetadata({
	title: "Create new webhook",
	icon: `${icon("ph-webhooks-logo")}`,
});
</script>
