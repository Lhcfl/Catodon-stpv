<template>
	<XContainer :draggable="true" @remove="() => $emit('remove')">
		<template #header
			><i :class="icon('ph-paint-brush-household')"></i>
			{{ i18n.ts._pages.blocks.canvas }}</template
		>

		<section style="padding: 0 16px 0 16px">
			<MkInput v-model="value.name">
				<template #prefix
					><i :class="icon('ph-magic-wand')"></i
				></template>
				<template #label>{{
					i18n.ts._pages.blocks._canvas.id
				}}</template>
			</MkInput>
			<MkInput v-model="value.width" type="number">
				<template #label>{{
					i18n.ts._pages.blocks._canvas.width
				}}</template>
				<template #suffix>px</template>
			</MkInput>
			<MkInput v-model="value.height" type="number">
				<template #label>{{
					i18n.ts._pages.blocks._canvas.height
				}}</template>
				<template #suffix>px</template>
			</MkInput>
		</section>
	</XContainer>
</template>

<script lang="ts" setup>
import XContainer from "../page-editor.container.vue";
import MkInput from "@/components/form/input.vue";
import { i18n } from "@/i18n";
import icon from "@/scripts/icon";

withDefaults(
	defineProps<{
		value: any;
	}>(),
	{
		value: {
			name: "",
			width: 300,
			height: 200,
		},
	},
);
</script>
