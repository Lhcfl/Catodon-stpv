import { computed, reactive } from "vue";
import { $i } from "@/reactiveAccount";
import { search } from "@/scripts/search";
import * as os from "@/os";
import { i18n } from "@/i18n";
import { ui } from "@/config";
import { unisonReload } from "@/scripts/unison-reload";
import icon from "@/scripts/icon";

export const navbarItemDef = reactive({
	notifications: {
		title: "notifications",
		icon: `${icon("ph-bell")}`,
		show: computed(() => $i != null),
		indicated: computed(() => $i?.hasUnreadNotification),
		to: "/my/notifications",
	},
	messaging: {
		title: "messaging",
		icon: `${icon("ph-chats-teardrop")}`,
		show: computed(() => $i != null),
		indicated: computed(() => $i?.hasUnreadMessagingMessage),
		to: "/my/messaging",
	},
	drive: {
		title: "drive",
		icon: `${icon("ph-hard-drive")}`,
		show: computed(() => $i != null),
		to: "/my/drive",
	},
	followRequests: {
		title: "followRequests",
		icon: `${icon("ph-hand-waving")}`,
		show: computed(() => $i?.isLocked || $i?.hasPendingReceivedFollowRequest),
		indicated: computed(() => $i?.hasPendingReceivedFollowRequest),
		to: "/my/follow-requests",
	},
	explore: {
		title: "explore",
		icon: `${icon("ph-flashlight")}`,
		to: "/explore",
	},
	announcements: {
		title: "announcements",
		icon: `${icon("ph-megaphone")}`,
		indicated: computed(() => $i?.hasUnreadAnnouncement),
		to: "/announcements",
	},
	search: {
		title: "search",
		icon: `${icon("ph-magnifying-glass")}`,
		action: () => search(),
	},
	favorites: {
		title: "favorites",
		icon: `${icon("ph-bookmark-simple")}`,
		show: computed(() => $i != null),
		to: "/my/favorites",
	},
	pages: {
		title: "pages",
		icon: `${icon("ph-article")}`,
		to: "/pages",
	},
	clips: {
		title: "clips",
		icon: `${icon("ph-bookmarks")}`,
		show: computed(() => $i != null),
		to: "/my/clips",
	},
	channels: {
		title: "channel",
		icon: `${icon("ph-text-align-left")}`,
		to: "/channels",
	},
	ui: {
		title: "switchUi",
		icon: `${icon("ph-layout")}`,
		action: (ev) => {
			os.popupMenu(
				[
					{
						text: i18n.ts.default,
						active: ui === "default" || ui === null,
						action: () => {
							localStorage.setItem("ui", "default");
							unisonReload();
						},
					},
					{
						text: i18n.ts.classic,
						active: ui === "classic",
						action: () => {
							localStorage.setItem("ui", "classic");
							unisonReload();
						},
					},
					{
						text: i18n.ts.deck,
						active: ui === "deck",
						action: () => {
							localStorage.setItem("ui", "deck");
							unisonReload();
						},
					},
				],
				ev.currentTarget ?? ev.target,
			);
		},
	},
	reload: {
		title: "reload",
		icon: `${icon("ph-arrow-clockwise")}`,
		action: (ev) => {
			location.reload();
		},
	},
});
