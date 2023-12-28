<template>
	<MkStickyContainer>
		<template #header>
			<MkPageHeader
				v-model:tab="tab"
				:actions="headerActions"
				:tabs="headerTabs"
				:display-back-button="true"
			/>
		</template>
		<div>
			<MkInfo v-if="isMine && hasGallery" class="warning" :warn="true">
				<p>
					The Gallery feature has been deprecated. Please repost any
					Gallery posts you would like to keep as Blog posts. Thank
					you!
				</p>
				<MkButton
					v-tooltip="'Delete All'"
					class="button"
					@click="deleteAll()"
					><i :class="icon('ph-trash', false)"></i
					><span>I've kept all the content I needed. Delete all Gallery posts!</span>
				</MkButton>
			</MkInfo>
			<transition name="fade" mode="out-in">
				<div v-if="user">
					<XHome
						v-if="tab === 'home'"
						:user="user"
						@refresh="fetchUser()"
					/>
					<XReactions v-else-if="tab === 'reactions'" :user="user" />
					<XClips v-else-if="tab === 'clips'" :user="user" />
					<XPages v-else-if="tab === 'pages'" :user="user" />
					<XGallery v-else-if="tab === 'gallery'" :user="user" />
				</div>
				<MkError v-else-if="error" @retry="fetchUser()" />
				<MkLoading v-else />
			</transition>
		</div>
	</MkStickyContainer>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, ref, watch } from "vue";
import * as Acct from "firefish-js/built/acct";
import type * as firefish from "firefish-js";
import { acct as getAcct } from "@/filters/user";
import * as os from "@/os";
import { useRouter } from "@/router";
import { definePageMetadata } from "@/scripts/page-metadata";
import { i18n } from "@/i18n";
import { $i } from "@/reactiveAccount";
import icon from "@/scripts/icon";
import MkInfo from "@/components/MkInfo.vue";
import MkButton from "@/components/MkButton.vue";

const XHome = defineAsyncComponent(() => import("./home.vue"));
const XReactions = defineAsyncComponent(() => import("./reactions.vue"));
const XClips = defineAsyncComponent(() => import("./clips.vue"));
const XPages = defineAsyncComponent(() => import("./pages.vue"));
const XGallery = defineAsyncComponent(() => import("./gallery.vue"));

const props = withDefaults(
	defineProps<{
		acct: string;
		page?: string;
	}>(),
	{
		page: "home",
	},
);

useRouter();

const tab = ref(props.page);
const user = ref<null | firefish.entities.UserDetailed>(null);
const error = ref(null);
const isMine = ref<boolean>(false);
const hasGallery = ref<boolean>(false);

function fetchUser(): void {
	if (props.acct == null) return;
	user.value = null;
	os.api("users/show", Acct.parse(props.acct))
		.then((u) => {
			user.value = u;
			isMine.value = u.id === $i.id;
			if (isMine.value) checkGallery();
		})
		.catch((err) => {
			error.value = err;
		});
}

function deleteAll() {
	os.api("gallery/posts/delete", {}).then(() => {
		location.reload();
	});
}

function checkGallery() {
	os.api("users/gallery/posts", { limit: 1, userId: user.value.id }).then(
		(u) => {
			hasGallery.value = u.length > 0;
		},
	);
}

watch(() => props.acct, fetchUser, {
	immediate: true,
});

const headerActions = computed(() => []);

const headerTabs = computed(() =>
	user.value
		? [
				{
					key: "home",
					title: i18n.ts.overview,
					icon: `${icon("ph-user")}`,
				},
				...(($i && $i.id === user.value.id) ||
				user.value.publicReactions
					? [
							{
								key: "reactions",
								title: i18n.ts.reaction,
								icon: `${icon("ph-smiley")}`,
							},
					  ]
					: []),
				...(user.value.instance == null
					? [
							{
								key: "clips",
								title: i18n.ts.clips,
								icon: `${icon("ph-bookmarks")}`,
							},
							{
								key: "pages",
								title: i18n.ts.pages,
								icon: `${icon("ph-article")}`,
							},
					  ]
					: []),
				...(hasGallery.value
					? [
							{
								key: "gallery",
								title: i18n.ts.gallery,
								icon: `${icon("ph-image-square")}`,
							},
					  ]
					: []),
		  ]
		: null,
);

definePageMetadata(
	computed(() =>
		user.value
			? {
					icon: `${icon("ph-user")}`,
					title: user.value.name
						? `${user.value.name} (@${user.value.username})`
						: `@${user.value.username}`,
					subtitle: `@${getAcct(user.value)}`,
					userName: user.value,
					avatar: user.value,
					path: `/@${user.value.username}`,
					share: {
						title: user.value.name,
					},
			  }
			: null,
	),
);
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.125s ease;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.warning {
	margin: 24px 24px 0px 24px;
}
</style>
