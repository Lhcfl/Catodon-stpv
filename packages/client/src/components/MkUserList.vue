<template>
	<MkPagination ref="pagingComponent" :pagination="pagination">
		<template #empty>
			<div class="_fullinfo">
				<img
					src="/static-assets/badges/info.png"
					class="_ghost"
					alt="Info"
				/>
				<div>{{ i18n.ts.noUsers }}</div>
			</div>
		</template>

		<template #default="{ items: users }">
			<div class="efvhhmdq">
				<MkUserInfo
					v-for="user in users"
					:key="user.id"
					class="user"
					:user="user"
				/>
			</div>
		</template>
	</MkPagination>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import MkUserInfo from "@/components/MkUserInfo.vue";
import type { Paging } from "@/components/MkPagination.vue";
import MkPagination from "@/components/MkPagination.vue";
import { i18n } from "@/i18n";

defineProps<{
	pagination: Paging;
	noGap?: boolean;
}>();

const pagingComponent = ref<InstanceType<typeof MkPagination>>();
</script>

<style lang="scss" scoped>
.efvhhmdq {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
	grid-gap: var(--margin);
}
</style>
