<template>
	<div class="_panel" :class="$style.root">
		<MkHeatmap src="active-users" />
	</div>
</template>

<script lang="ts" setup>
import MkHeatmap from "@/components/MkHeatmap.vue";
</script>

<style lang="scss" module>
.root {
	padding: 20px;
}
</style>
