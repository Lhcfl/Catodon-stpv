<template>
	<MkStickyContainer>
		<template #header>
			<MkTab v-model="tab" :class="$style.tab">
				<option :value="null">{{ i18n.ts.notesAndReplies }}</option>
				<option value="notes">{{ i18n.ts.notes }}</option>
				<option value="files">{{ i18n.ts.withFiles }}</option>
			</MkTab>
		</template>
		<XNotes :no-gap="true" :pagination="pagination" />
	</MkStickyContainer>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import type * as firefish from "firefish-js";
import XNotes from "@/components/MkNotes.vue";
import MkTab from "@/components/MkTab.vue";
import { i18n } from "@/i18n";

const props = defineProps<{
	user: firefish.entities.UserDetailed;
}>();

const tab = ref<string | null>(null);

const pagination = {
	endpoint: "users/notes" as const,
	limit: 10,
	params: computed(() => ({
		userId: props.user.id,
		includeReplies: tab.value !== "notes",
		withFiles: tab.value === "files",
	})),
};
</script>

<style lang="scss" module>
.tab {
	margin: calc(var(--margin) / 2) 0;
	padding: calc(var(--margin) / 2) 0;
	background: var(--bg);
}
</style>
