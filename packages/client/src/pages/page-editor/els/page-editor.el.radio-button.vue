<template>
	<XContainer :draggable="true" @remove="() => $emit('remove')">
		<template #header
			><i :class="icon('ph-lightning')"></i>
			{{ i18n.ts._pages.blocks.radioButton }}</template
		>

		<section style="padding: 0 16px 16px 16px">
			<MkInput v-model="value.name"
				><template #prefix
					><i :class="icon('ph-magic-wand')"></i></template
				><template #label>{{
					i18n.ts._pages.blocks._radioButton.name
				}}</template></MkInput
			>
			<MkInput v-model="value.title"
				><template #label>{{
					i18n.ts._pages.blocks._radioButton.title
				}}</template></MkInput
			>
			<MkTextarea v-model="values"
				><template #label>{{
					i18n.ts._pages.blocks._radioButton.values
				}}</template></MkTextarea
			>
			<MkInput v-model="value.default"
				><template #label>{{
					i18n.ts._pages.blocks._radioButton.default
				}}</template></MkInput
			>
		</section>
	</XContainer>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import XContainer from "../page-editor.container.vue";
import MkTextarea from "@/components/form/textarea.vue";
import MkInput from "@/components/form/input.vue";
import { i18n } from "@/i18n";
import icon from "@/scripts/icon";

const props = withDefaults(
	defineProps<{
		value: any;
	}>(),
	{
		value: {
			name: "",
			title: "",
			values: [],
		},
	},
);

const values = ref<string>(props.value.values.join("\n"));

watch(
	values.value,
	() => {
		props.value.values = values.value.split("\n");
	},
	{
		deep: true,
	},
);
</script>
