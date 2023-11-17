<template>
	<div
		:class="[
			$style.root,
			{
				yellow: instance.isNotResponding,
				red: instance.isBlocked,
				purple: instance.isSilenced,
				gray: instance.isSuspended,
			},
		]"
	>
		<img class="icon" :src="getInstanceIcon(instance)" alt="" />
		<div class="body">
			<span class="host">{{ instance.name ?? instance.host }}</span>
			<span class="sub _monospace"
				><b>{{ instance.host }}</b> /
				{{ instance.softwareName || "?" }}
				{{ instance.softwareVersion }}</span
			>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import type * as firefish from "firefish-js";
import * as os from "@/os";
import { getProxiedImageUrlNullable } from "@/scripts/media-proxy";

const props = defineProps<{
	instance: firefish.entities.Instance;
}>();

function getInstanceIcon(instance): string {
	return (
		getProxiedImageUrlNullable(instance.iconUrl, "preview") ??
		getProxiedImageUrlNullable(instance.faviconUrl, "preview") ??
		"/client-assets/dummy.png"
	);
}
</script>

<style lang="scss" module>
.root {
	$bodyTitleHieght: 18px;
	$bodyInfoHieght: 16px;

	display: flex;
	align-items: center;
	padding: 16px;
	background: var(--panel);
	border-radius: 8px;

	> :global(.icon) {
		display: block;
		width: ($bodyTitleHieght + $bodyInfoHieght);
		height: ($bodyTitleHieght + $bodyInfoHieght);
		object-fit: cover;
		border-radius: 4px;
		margin-inline-end: 10px;
	}

	> :global(.body) {
		flex: 1;
		overflow: hidden;
		font-size: 0.9em;
		color: var(--fg);
		padding-inline-end: 8px;

		> :global(.host) {
			display: block;
			width: 100%;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			line-height: $bodyTitleHieght;
		}

		> :global(.sub) {
			display: block;
			width: 100%;
			font-size: 80%;
			opacity: 0.7;
			line-height: $bodyInfoHieght;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}

	&:global(.yellow) {
		--c: rgb(255 196 0 / 15%);
		background-image: linear-gradient(
			45deg,
			var(--c) 16.67%,
			transparent 16.67%,
			transparent 50%,
			var(--c) 50%,
			var(--c) 66.67%,
			transparent 66.67%,
			transparent 100%
		);
		background-size: 16px 16px;
	}

	&:global(.red) {
		--c: rgb(255 0 0 / 15%);
		background-image: linear-gradient(
			45deg,
			var(--c) 16.67%,
			transparent 16.67%,
			transparent 50%,
			var(--c) 50%,
			var(--c) 66.67%,
			transparent 66.67%,
			transparent 100%
		);
		background-size: 16px 16px;
	}

	&:global(.purple) {
		--c: rgba(196, 0, 255, 0.15);
		background-image: linear-gradient(
			45deg,
			var(--c) 16.67%,
			transparent 16.67%,
			transparent 50%,
			var(--c) 50%,
			var(--c) 66.67%,
			transparent 66.67%,
			transparent 100%
		);
		background-size: 16px 16px;
	}

	&:global(.gray) {
		--c: var(--bg);
		background-image: linear-gradient(
			45deg,
			var(--c) 16.67%,
			transparent 16.67%,
			transparent 50%,
			var(--c) 50%,
			var(--c) 66.67%,
			transparent 66.67%,
			transparent 100%
		);
		background-size: 16px 16px;
	}
}
</style>
