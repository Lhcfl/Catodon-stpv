<template>
	<button
		ref="el"
		class="_button showMoreButton"
		:class="[{ showLess: !modelValue }]"
		@click.stop="toggle"
	>
		<span>{{ modelValue ? i18n.ts.showMore : i18n.ts.showLess }}</span>
	</button>
</template>
<script lang="ts" setup>
import { i18n } from "@/i18n";
import { ref } from "vue";

const props = defineProps<{
	modelValue: boolean;
}>();

const el = ref<HTMLElement>();

const emit = defineEmits<{
	(ev: "update:modelValue", v: boolean): void;
}>();

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
.showMoreButton {
	display: block;
	width: 100%;
	margin-bottom: 20px;
	position: static;
	> span {
		display: inline-block;
		background: var(--panel);
		padding: 0.5em 0;
		font-size: 0.8em;
		border-radius: 999px;
		box-shadow: 0 2px 6px rgb(0 0 0 / 20%);
		width: 100%;
	}
	&:hover {
		> span {
			background: var(--panelHighlight);
		}
	}

	&.showLess {
		width: 100%;
		position: sticky;
		margin-top: 10px;
		bottom: calc(var(--stickyBottom) + 1em);
	}
}
</style>
