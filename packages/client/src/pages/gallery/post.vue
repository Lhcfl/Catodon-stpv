<template>
	<MkStickyContainer>
		<template #header
			><MkPageHeader :actions="headerActions" :tabs="headerTabs"
		/></template>
		<MkSpacer :content-max="1000" :margin-min="16" :margin-max="32">
			<div class="_root">
				<transition
					:name="defaultStore.state.animation ? 'fade' : ''"
					mode="out-in"
				>
					<div v-if="post" class="rkxwuolj">
						<div class="files">
							<div
								v-for="file in post.files"
								:key="file.id"
								class="file"
							>
								<img :src="file.url" />
							</div>
						</div>
						<div class="body _block">
							<div class="title">{{ post.title }}</div>
							<div class="description">
								<Mfm :text="post.description" />
							</div>
							<div class="info">
								<i :class="icon('ph-clock')"></i>
								<MkTime :time="post.createdAt" mode="detail" />
							</div>
							<div class="user">
								<MkAvatar :user="post.user" class="avatar" />
								<div class="name">
									<MkUserName
										:user="post.user"
										style="display: block"
									/>
									<MkAcct :user="post.user" />
								</div>
								<MkFollowButton
									v-if="!$i || $i.id != post.user.id"
									:user="post.user"
									:inline="true"
									:transparent="false"
									:full="true"
									large
									class="koudoku"
								/>
							</div>
						</div>
						<MkAd :prefer="['inline', 'inline-big']" />
						<MkContainer
							:max-height="300"
							:foldable="true"
							class="other"
						>
							<template #header
								><i :class="icon('ph-clock')"></i>
								{{ i18n.ts.recentPosts }}</template
							>
							<MkPagination
								v-slot="{ items }"
								:pagination="otherPostsPagination"
							>
								<div class="sdrarzaf">
									<MkGalleryPostPreview
										v-for="post in items"
										:key="post.id"
										:post="post"
										class="post"
									/>
								</div>
							</MkPagination>
						</MkContainer>
					</div>
					<MkError v-else-if="error" @retry="fetch()" />
					<MkLoading v-else />
				</transition>
			</div>
		</MkSpacer>
	</MkStickyContainer>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import * as os from "@/os";
import MkContainer from "@/components/MkContainer.vue";
import MkPagination from "@/components/MkPagination.vue";
import MkGalleryPostPreview from "@/components/MkGalleryPostPreview.vue";
import MkFollowButton from "@/components/MkFollowButton.vue";
import { useRouter } from "@/router";
import { i18n } from "@/i18n";
import { definePageMetadata } from "@/scripts/page-metadata";
import { defaultStore } from "@/store";
import icon from "@/scripts/icon";

const router = useRouter();

const props = defineProps<{
	postId: string;
}>();

const post = ref(null);
const error = ref(null);
const otherPostsPagination = {
	endpoint: "users/gallery/posts" as const,
	limit: 6,
	params: computed(() => ({
		userId: post.value.user.id,
	})),
};

function fetchPost() {
	post.value = null;
	os.api("gallery/posts/show", {
		postId: props.postId,
	})
		.then((_post) => {
			post.value = _post;
		})
		.catch((_error) => {
			error.value = _error;
		});
}

function remove() {
	os.api("gallery/posts/delete", {
		postId: props.postId,
	}).then(() => {
		history.back();
	});
}

watch(() => props.postId, fetchPost, { immediate: true });

const headerActions = computed(() => [
	{
		icon: `${icon("ph-trash")}`,
		text: i18n.ts.delete,
		handler: remove,
	},
]);

const headerTabs = computed(() => []);

definePageMetadata(
	computed(() =>
		post.value
			? {
					title: post.value.title,
					avatar: post.value.user,
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

.rkxwuolj {
	> .files {
		> .file {
			> img {
				display: block;
				max-width: 100%;
				max-height: 500px;
				margin: 0 auto;
				border-radius: 10px;
			}

			& + .file {
				margin-top: 16px;
			}
		}
	}

	> .body {
		padding: 32px;

		> .title {
			font-weight: bold;
			font-size: 1.2em;
			margin-bottom: 16px;
		}

		> .info {
			margin-top: 16px;
			font-size: 90%;
			opacity: 0.7;
		}

		> .actions {
			display: flex;
			align-items: center;
			margin-top: 16px;
			padding: 16px 0 0 0;
			border-top: solid 0.5px var(--divider);

			> .like {
				> .button {
					--accent: #eb6f92;
					--X8: #eb6f92;
					--buttonBg: rgb(216 71 106 / 5%);
					--buttonHoverBg: rgb(216 71 106 / 10%);
					color: #eb6f92;

					::v-deep(.count) {
						margin-inline-start: 0.5em;
					}
				}
			}

			> .other {
				margin-inline-start: auto;

				> button {
					padding: 8px;
					margin: 0 8px;

					&:hover {
						color: var(--fgHighlighted);
					}
				}
			}
		}

		> .user {
			margin-top: 16px;
			padding: 16px 0 0 0;
			border-top: solid 0.5px var(--divider);
			display: flex;
			align-items: center;

			> .avatar {
				width: 52px;
				height: 52px;
			}

			> .name {
				margin: 0 0 0 12px;
				font-size: 90%;
			}

			> .koudoku {
				margin-inline-start: auto;
			}
		}
	}
}

.sdrarzaf {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
	grid-gap: 12px;
	margin: var(--margin);

	> .post {
	}
}
</style>
