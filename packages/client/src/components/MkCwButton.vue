<template>
	<button
		ref="el"
		class="_button _button_modern"
		:class="[{ showLess: modelValue, fade: !modelValue }]"
		@click.stop="toggle"
	>
		<span
			>{{ modelValue ? i18n.ts._cw.hide : i18n.ts._cw.show }}
			<span v-if="!modelValue">{{ label }}</span>
		</span>
	</button>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { length } from "stringz";
import type * as firefish from "firefish-js";
import { concat } from "@/scripts/array";
import { i18n } from "@/i18n";

const props = defineProps<{
	modelValue: boolean;
	note: firefish.entities.Note;
}>();

const emit = defineEmits<{
	(ev: "update:modelValue", v: boolean): void;
}>();

const el = ref<HTMLElement>();

const label = computed(() => {
	return concat([
		props.note.text
			? [i18n.t("_cw.chars", { count: length(props.note.text) })]
			: [],
		props.note.files && props.note.files.length !== 0
			? [i18n.t("_cw.files", { count: props.note.files.length })]
			: [],
		props.note.poll != null ? [i18n.ts.poll] : [],
		props.note.renote != null ? [i18n.ts.quoteAttached] : [],
	] as string[][]).join(", ");
});

const toggle = () => {
	emit("update:modelValue", !props.modelValue);
};

function focus() {
	el.value.focus();
}

defineExpose({
	focus,
});
</script>

<style lang="scss" scoped>
._button_modern {
	width: 100%;
	font-weight: 700;
	z-index: 5;
	&.showLess {
		position: sticky;
		bottom: calc(var(--stickyBottom) - 1em);
		margin: 20px 0;
	}
	> span {
		display: inline-block;
		padding: 0.5em 0;
		font-size: 0.8em;
		border-radius: 999px;
		box-shadow: 0 2px 6px rgb(0 0 0 / 20%);
		width: 100%;
		background: var(--cwBg);
		color: var(--cwFg);
		transition:
			background 0.2s,
			color 0.2s;

		> span {
			font-weight: 500;
			&::before {
				content: "(";
			}
			&::after {
				content: ")";
			}
		}
	}
	&:hover > span,
	&:focus > span {
		background: var(--cwFg) !important;
		color: var(--cwBg) !important;
	}
}
</style>
