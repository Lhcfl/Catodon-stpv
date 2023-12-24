<template>
	<MkStickyContainer>
		<template #header
			><MkPageHeader :actions="headerActions" :tabs="headerTabs"
		/></template>
		<div style="overflow: clip">
			<MkSpacer :content-max="600" :margin-min="20">
				<div class="_formRoot znqjceqz">
					<div id="debug"></div>
					<div
						ref="containerEl"
						v-panel
						class="_formBlock about"
					>
						<img
							src="/client-assets/about-icon.png"
							alt=""
							class="icon"
							draggable="false"
						/>
						<div class="misskey">Catodon</div>
						<div class="version">v{{ version }}</div>
					</div>
					<div class="_formBlock" style="text-align: center">
						{{ i18n.ts._aboutFirefish.about }}<br /><a
							href="https://codeberg.org/catodon/catodon"
							target="_blank"
							class="_link"
							>{{ i18n.ts.learnMore }}</a
						>
					</div>
					<FormSection>
						<div class="_formLinks">
							<FormLink
								to="https://codeberg.org/catodon/catodon"
								external
							>
								<template #icon
									><i :class="icon('ph-code')"></i
								></template>
								{{ i18n.ts._aboutFirefish.source }}
								<template #suffix>Codeberg</template>
							</FormLink>
							<!-- <FormLink
								to="https://opencollective.com/firefish"
								external
							>
								<template #icon
									><i :class="icon('ph-money')"></i
								></template>
								{{ i18n.ts._aboutFirefish.donate }}
								<template #suffix>Donate</template>
							</FormLink> -->
							<!-- <FormLink
								to="https://hosted.weblate.org/engage/firefish/"
								external
							>
								<template #icon
									><i :class="icon('ph-translate')"></i
								></template>
								{{ i18n.ts._aboutFirefish.translation }}
								<template #suffix>Translate</template>
							</FormLink> -->
						</div>
					</FormSection>
				</div>
			</MkSpacer>
		</div>
	</MkStickyContainer>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { version } from "@/config";
import FormLink from "@/components/form/link.vue";
import FormSection from "@/components/form/section.vue";
import { i18n } from "@/i18n";
import { definePageMetadata } from "@/scripts/page-metadata";
import icon from "@/scripts/icon";

const easterEggEngine = ref(null);
const containerEl = ref<HTMLElement>();

const headerActions = computed(() => []);

const headerTabs = computed(() => []);

definePageMetadata({
	title: i18n.ts.aboutFirefish,
	icon: null,
});
</script>

<style lang="scss" scoped>
.znqjceqz {
	> .about {
		position: relative;
		text-align: center;
		padding: 16px;
		border-radius: var(--radius);

		&.playing {
			&,
			* {
				user-select: none;
			}

			* {
				will-change: transform;
			}

			> .emoji {
				visibility: visible;
			}
		}

		> .icon {
			display: block;
			width: 100px;
			margin: 0 auto;
			border-radius: 3px;
		}

		> .misskey {
			margin: 0.75em auto 0 auto;
			width: max-content;
		}

		> .version {
			margin: 0 auto;
			width: max-content;
			opacity: 0.5;
		}

		> .emoji {
			position: absolute;
			top: 0;
			inset-inline-start: 0;
			visibility: hidden;

			> .emoji {
				pointer-events: none;
				font-size: 24px;
				width: 24px;
			}
		}
	}
}
</style>
