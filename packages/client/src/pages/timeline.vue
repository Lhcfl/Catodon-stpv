<template>
	<MkStickyContainer>
		<template #header>
			<MkPageHeader
				v-model:tab="src"
				:actions="headerActions"
				:tabs="headerTabs"
				:display-my-avatar="true"
			/>
		</template>
		<MkSpacer :content-max="800">
			<div ref="rootEl" v-hotkey.global="keymap" class="cmuxhskf">
				<XPostForm
					v-if="defaultStore.reactiveState.showFixedPostForm.value"
					class="post-form _block"
					fixed
				/>
				<!-- <div v-if="!isMobile" class="tl _block">
				<XTimeline
					ref="tl"
					:key="src"
					class="tl"
					:src="src"
					:sound="true"
					@queue="queueUpdated"
				/>
			</div> *v-else on next div* -->
				<div class="tl _block">
					<swiper
						:round-lengths="true"
						:touch-angle="25"
						:threshold="10"
						:centered-slides="true"
						:modules="[Virtual]"
						:space-between="20"
						:virtual="true"
						:allow-touch-move="
							defaultStore.state.swipeOnMobile &&
							(deviceKind !== 'desktop' ||
								defaultStore.state.swipeOnDesktop)
						"
						@swiper="setSwiperRef"
						@slide-change="onSlideChange"
					>
						<swiper-slide
							v-for="index in timelines"
							:key="index"
							:virtual-index="index"
						>
							<XTimeline
								v-if="index == timelines[swiperRef.activeIndex]"
								ref="tl"
								:key="src"
								class="tl"
								:src="src"
								:sound="true"
							/>
						</swiper-slide>
					</swiper>
				</div>
			</div>
		</MkSpacer>
	</MkStickyContainer>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { Virtual } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";
import XTimeline from "@/components/MkTimeline.vue";
import XPostForm from "@/components/MkPostForm.vue";
import * as os from "@/os";
import { defaultStore } from "@/store";
import { i18n } from "@/i18n";
import { instance } from "@/instance";
import { $i } from "@/reactiveAccount";
import { definePageMetadata } from "@/scripts/page-metadata";
import { deviceKind } from "@/scripts/device-kind";
import icon from "@/scripts/icon";
import "swiper/scss";
import "swiper/scss/virtual";

const isLocalTimelineAvailable =
	!instance.disableLocalTimeline ||
	($i != null && ($i.isModerator || $i.isAdmin));
const isRecommendedTimelineAvailable = !instance.disableRecommendedTimeline;
const isGlobalTimelineAvailable =
	!instance.disableGlobalTimeline ||
	($i != null && ($i.isModerator || $i.isAdmin));
const keymap = {
	t: focus,
};

let timelines: string[] = [];

if (isLocalTimelineAvailable && defaultStore.state.showLocalPostsInHomeTimeline) {
	timelines.push("social");
} else {
	timelines.push("home");
}
if (isLocalTimelineAvailable) {
	timelines.push("local");
}
if (isLocalTimelineAvailable && defaultStore.state.isSocialTimelineAvailable) {
	timelines.push("social");
}
if (isRecommendedTimelineAvailable) {
	timelines.push("recommended");
}
if (isGlobalTimelineAvailable) {
	timelines.push("global");
}

const MOBILE_THRESHOLD = 500;

// デスクトップでウィンドウを狭くしたときモバイルUIが表示されて欲しいことはあるので deviceKind === 'desktop' の判定は行わない
const isMobile = ref(
	deviceKind === "smartphone" || window.innerWidth <= MOBILE_THRESHOLD,
);
window.addEventListener("resize", () => {
	isMobile.value =
		deviceKind === "smartphone" || window.innerWidth <= MOBILE_THRESHOLD;
});

const tlComponent = ref<InstanceType<typeof XTimeline>>();
const rootEl = ref<HTMLElement>();

const src = computed({
	get: () => defaultStore.reactiveState.tl.value.src,
	set: (x) => {
		saveSrc(x);
		syncSlide(timelines.indexOf(x));
	},
});

const lists = os.api("users/lists/list");
async function chooseList(ev: MouseEvent) {
	await lists.then((res) => {
		const items = [
			{
				type: "link" as const,
				text: i18n.ts.manageLists,
				icon: `${icon("ph-faders-horizontal")}`,
				to: "/my/lists",
			},
		].concat(
			res.map((list) => ({
				type: "link" as const,
				text: list.name,
				icon: "",
				to: `/timeline/list/${list.id}`,
			})),
		);
		os.popupMenu(items, ev.currentTarget ?? ev.target);
	});
}

const antennas = os.api("antennas/list");
async function chooseAntenna(ev: MouseEvent) {
	await antennas.then((res) => {
		const items = [
			{
				type: "link" as const,
				indicate: false,
				text: i18n.ts.manageAntennas,
				icon: `${icon("ph-faders-horizontal")}`,
				to: "/my/antennas",
			},
		].concat(
			res.map((antenna) => ({
				type: "link" as const,
				text: antenna.name,
				icon: "",
				indicate: antenna.hasUnreadNote,
				to: `/timeline/antenna/${antenna.id}`,
			})),
		);
		os.popupMenu(items, ev.currentTarget ?? ev.target);
	});
}

function saveSrc(
	newSrc: "home" | "local" | "social" | "recommended" | "global",
): void {
	defaultStore.set("tl", {
		...defaultStore.state.tl,
		src: newSrc,
	});
}

function focus(): void {
	tlComponent.value.focus();
}

const headerActions = computed(() => [
	{
		icon: `${icon("ph-list-bullets")}`,
		title: i18n.ts.lists,
		text: i18n.ts.lists,
		iconOnly: true,
		handler: chooseList,
	},
	{
		icon: `${icon("ph-factory")}`,
		title: i18n.ts.antennas,
		text: i18n.ts.antennas,
		iconOnly: true,
		handler: chooseAntenna,
	} /* **TODO: fix timetravel** {
	icon: `${icon('ph-calendar-blank')}`,
	title: i18n.ts.jumpToSpecifiedDate,
	iconOnly: true,
	handler: timetravel,
} */,
]);

// Swap home timeline with social"s functionality
const headerTabs = $computed(() => [

	...(isLocalTimelineAvailable && defaultStore.state.showLocalPostsInHomeTimeline
		? [
			{
				key: "social",
				title: i18n.ts._timelines.home,
				icon: `${icon("ph-house")}`,
				iconOnly: true,
			},
		]
		: [
			{
				key: "home",
				title: i18n.ts._timelines.home,
				icon: `${icon("ph-house")}`,
				iconOnly: true,
			}
		]),
	...(isLocalTimelineAvailable
		? [
				{
					key: "local",
					title: i18n.ts._timelines.local,
					icon: `${icon("ph-map-pin")}`,
					iconOnly: true,
				},
		  ]
		: []),
	...(isLocalTimelineAvailable && defaultStore.state.isSocialTimelineAvailable
		? [
				{
					key: "social",
					title: i18n.ts._timelines.social,
					icon: `${icon("ph-handshake")}`,
					iconOnly: true,
				},
			]
		: []),
	...(isRecommendedTimelineAvailable
		? [
				{
					key: "recommended",
					title: i18n.ts._timelines.recommended,
					icon: `${icon("ph-thumbs-up")}`,
					iconOnly: true,
				},
		  ]
		: []),
	...(isGlobalTimelineAvailable
		? [
				{
					key: "global",
					title: i18n.ts._timelines.global,
					icon: `${icon("ph-planet")}`,
					iconOnly: true,
				},
		  ]
		: []),
]);

definePageMetadata(
	computed(() => ({
		title: i18n.ts.timeline,
		icon:
			src === "local"
				? "ph-map-pin ph-lg"
				: src === "social" && defaultStore.state.showLocalPostsInHomeTimeline
				? "ph-house ph-lg"
				: src === "social" && defaultStore.state.isSocialTimelineAvailable
				? "ph-handshake ph-lg"
				: src === "recommended"
				? "ph-thumbs-up ph-lg"
				: src === "global"
				? "ph-planet ph-lg"
				: src === "home" && defaultStore.state.showLocalPostsInHomeTimeline
				? "ph-handshake ph-lg"
				: "ph-house ph-lg",
	})),
);

let swiperRef: any = null;

function setSwiperRef(swiper) {
	swiperRef = swiper;
	syncSlide(timelines.indexOf(src.value));
}

function onSlideChange() {
	saveSrc(timelines[swiperRef.activeIndex]);
}

function syncSlide(index) {
	swiperRef.slideTo(index);
}

onMounted(() => {
	syncSlide(timelines.indexOf(swiperRef.activeIndex));
});
</script>

<style lang="scss" scoped>
.cmuxhskf {
	--swiper-theme-color: var(--accent);
	> .tl {
		background: none;
	}
}
</style>
