<template>
	<MkStickyContainer>
		<template #header>
			<MkPageHeader
				v-model:tab="tab"
				:actions="headerActions"
				:tabs="headerTabs"
			/>
		</template>
		<MkSpacer :content-max="800">
			<MkPagination
				v-if="tab === 'bookmarks'"
				:pagination="bookmarkPagination"
			>
				<template #empty>
					<div class="_fullinfo">
						<img
							src="/static-assets/badges/info.png"
							class="_ghost"
							alt="Info"
						/>
						<div>{{ i18n.ts.noNotes }}</div>
					</div>
				</template>

				<template #default="{ items }">
					<XList
						v-slot="{ item }"
						:items="items"
						:direction="'down'"
						:no-gap="false"
						:ad="false"
					>
						<XNote
							:key="item.id"
							:note="item.note"
							:class="$style.note"
						/>
					</XList>
				</template>
			</MkPagination>
			<div class="qtcaoidl" v-if="tab === 'collections'">
				<MkPagination :pagination="collectionPagination" class="list">
					<template #empty>
						<MkInfo icon="bookmarks" :card="true">
							<p>{{ i18n.ts.clipsDesc }}</p>
						</MkInfo>
					</template>
					<template #default="{ items }">
						<MkA
							v-for="item in items"
							:key="item.id"
							:to="`/clips/${item.id}`"
							class="item _panel _gap"
						>
							<b>{{ item.name }}</b>
							<div v-if="item.description" class="description">
								{{ item.description }}
							</div>
						</MkA>
					</template>
				</MkPagination>
			</div>
		</MkSpacer>
	</MkStickyContainer>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import MkPagination from "@/components/MkPagination.vue";
import XNote from "@/components/MkNote.vue";
import MkInfo from "@/components/MkInfo.vue";
import XList from "@/components/MkDateSeparatedList.vue";
import { i18n } from "@/i18n";
import { definePageMetadata } from "@/scripts/page-metadata";
import icon from "@/scripts/icon";

const tabs = ["bookmarks", "collections"];
const tab = ref(tabs[0]);
const headerActions = computed(() => []);
const headerTabs = computed(() => [
	{
		key: "bookmarks",
		icon: `${icon("ph-bookmark-simple")}`,
		title: i18n.ts.favorites,
	},
	{
		key: "collections",
		icon: `${icon("ph-bookmarks")}`,
		title: i18n.ts.clips,
	},
]);

const bookmarkPagination = {
	endpoint: "i/favorites" as const,
	limit: 10,
};

const collectionPagination = {
	endpoint: "clips/list" as const,
	limit: 10,
};

definePageMetadata({
	title: i18n.ts.favorites,
	icon: `${icon("ph-bookmark-simple")}`,
});
</script>

<style lang="scss" module>
.note {
	background: var(--panel);
	border-radius: var(--radius);
}
</style>

<style lang="scss" scoped>
.list {
	> .item {
		display: block;
		padding: 16px;

		> .description {
			margin-top: 8px;
			padding-top: 8px;
			border-top: solid 0.5px var(--divider);
		}
	}
}
</style>
