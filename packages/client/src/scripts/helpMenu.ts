import { instance } from "@/instance";
import { host } from "@/config";
import * as os from "@/os";
import { i18n } from "@/i18n";
import icon from "@/scripts/icon";
import type { MenuItem } from "@/types/menu";

export function openHelpMenu_(ev: MouseEvent) {
	const menus: (MenuItem | null)[] = [
		{
			text: instance.name ?? host,
			type: "label",
		},
		{
			type: "link",
			text: i18n.ts.instanceInfo,
			icon: `${icon("ph-info")}`,
			to: "/about",
		},
		{
			type: "link",
			text: i18n.ts.aboutFirefish,
			icon: `${icon("ph-lightbulb")}`,
			to: "/about-catodon",
		},
	];
	if (instance.tosUrl) {
		menus.push({
			type: "button",
			text: i18n.ts.tos,
			icon: `${icon("ph-scroll")}`,
			action: () => {
				window.open(instance.tosUrl, "_blank");
			},
		});
	}
	menus.push(null, {
		type: "parent",
		text: i18n.ts.developer,
		icon: `${icon("ph-code")}`,
		children: [
			{
				type: "link",
				to: "/api-console",
				text: "API Console",
				icon: `${icon("ph-terminal-window")}`,
			},
			{
				type: "button",
				text: i18n.ts.document,
				icon: `${icon("ph-file-doc")}`,
				action: () => {
					window.open("/api-doc", "_blank");
				},
			},
			{
				type: "link",
				to: "/scratchpad",
				text: "AiScript Scratchpad",
				icon: `${icon("ph-scribble-loop")}`,
			},
		],
	});
	const src = ev.currentTarget ?? ev.target ?? undefined;
	os.popupMenu(menus, src);
}
