<template>
	<header class="mvcprjjd sidebar" :class="{ iconOnly }">
		<div class="body">
			<div class="top">
				<div
					class="banner"
					:user="$i"
					:style="{ backgroundImage: `url(${$i.bannerUrl})` }"
				></div>
				<button
					v-click-anime
					v-tooltip.noDelay.right="
						`${i18n.ts.account}: @${$i.username}`
					"
					class="item _button account"
					@click="openAccountMenu"
				>
					<MkAvatar
						:user="$i"
						class="icon"
						disable-link
					/><!-- <MkAcct class="text" :user="$i"/> -->
				</button>
			</div>
			<nav class="middle">
				<MkA
					v-click-anime
					v-tooltip.noDelay.right="i18n.ts.timeline"
					class="item _button index"
					active-class="active"
					to="/"
					exact
				>
					<i :class="icon('ph-house icon ph-fw')"></i
					><span class="text">{{ i18n.ts.timeline }}</span>
				</MkA>
				<template v-for="item in menu">
					<div v-if="item === '-'" class="divider"></div>
					<component
						:is="navbarItemDef[item].to ? 'MkA' : 'button'"
						v-else-if="
							navbarItemDef[item] &&
							navbarItemDef[item].show !== false
						"
						v-click-anime
						v-tooltip.noDelay.right="
							i18n.ts[navbarItemDef[item].title]
						"
						class="item _button"
						:class="[item, { active: navbarItemDef[item].active }]"
						active-class="active"
						:to="navbarItemDef[item].to"
						v-on="
							navbarItemDef[item].action
								? { click: navbarItemDef[item].action }
								: {}
						"
					>
						<i
							class="icon ph-fw ph-lg"
							:class="navbarItemDef[item].icon"
						></i
						><span class="text">{{
							i18n.ts[navbarItemDef[item].title]
						}}</span>
						<span
							v-if="navbarItemDef[item].indicated"
							class="indicator"
							><i class="icon ph-circle ph-fill"></i
						></span>
					</component>
				</template>
				<button
					v-click-anime
					v-tooltip.noDelay.right="i18n.ts.more"
					class="item _button"
					@click="more"
				>
					<i :class="icon('ph-dots-three-outline icon ph-fw')"></i
					><span class="text">{{ i18n.ts.more }}</span>
					<span v-if="otherMenuItemIndicated" class="indicator"
						><i class="icon ph-circle ph-fill"></i
					></span>
				</button>
				<div class="divider"></div>
				<MkA
					v-if="$i.isAdmin || $i.isModerator"
					v-click-anime
					v-tooltip.noDelay.right="i18n.ts.controlPanel"
					class="item _button"
					active-class="active"
					to="/admin"
				>
					<span
						v-if="
							thereIsUnresolvedAbuseReport ||
							noMaintainerInformation ||
							noBotProtection ||
							noEmailServer ||
							updateAvailable
						"
						class="indicator"
					></span
					><i :class="icon('ph-wrench icon ph-fw')"></i
					><span class="text">{{ i18n.ts.controlPanel }}</span>
				</MkA>
				<MkA
					v-click-anime
					v-tooltip.noDelay.right="i18n.ts.settings"
					class="item _button"
					active-class="active"
					to="/settings"
				>
					<i :class="icon('ph-gear icon ph-fw')"></i
					><span class="text">{{ i18n.ts.settings }}</span>
				</MkA>
			</nav>
			<div class="bottom">
				<button
					v-tooltip.noDelay.right="i18n.ts.note"
					class="item _button post"
					data-cy-open-post-form
					@click="os.post"
				>
					<i :class="icon('icon ph-pencil ph-fw ph-lg')"></i
					><span class="text">{{ i18n.ts.note }}</span>
				</button>
				<div class="item instance">
					<img
						:src="
							$instance.faviconUrl ||
							$instance.iconUrl ||
							'/favicon.ico'
						"
						alt=""
						class="icon"
					/>
				</div>
				<button
					v-tooltip.noDelay.right="i18n.ts.help"
					class="item _button help"
					@click="openHelpMenu"
				>
					<i
						:class="icon('help icon ph-info ph-xl ph-fw', false)"
					></i>
				</button>
			</div>
		</div>
	</header>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, ref, watch } from "vue";
import * as os from "@/os";
import { navbarItemDef } from "@/navbar";
import { openAccountMenu as openAccountMenu_ } from "@/account";
import { $i } from "@/reactiveAccount";
import { openHelpMenu_ } from "@/scripts/helpMenu";
import { defaultStore } from "@/store";
import { i18n } from "@/i18n";
import { instance } from "@/instance";
import { version } from "@/config";
import icon from "@/scripts/icon";

const isEmpty = (x: string | null) => x == null || x === "";

const iconOnly = ref(false);

const menu = computed(() => defaultStore.state.menu);
const otherMenuItemIndicated = computed(() => {
	for (const def in navbarItemDef) {
		if (menu.value.includes(def)) continue;
		if (navbarItemDef[def].indicated) return true;
	}
	return false;
});

const calcViewState = () => {
	iconOnly.value =
		window.innerWidth <= 1279 ||
		defaultStore.state.menuDisplay === "sideIcon";
};

calcViewState();

matchMedia("(max-width: 1279px)").onchange = (mql) => calcViewState();

watch(defaultStore.reactiveState.menuDisplay, () => {
	calcViewState();
});

const noMaintainerInformation =
	isEmpty(instance.maintainerName) || isEmpty(instance.maintainerEmail);
const noBotProtection =
	!instance.disableRegistration &&
	!instance.enableHcaptcha &&
	!instance.enableRecaptcha;
const noEmailServer = !instance.enableEmail;
const thereIsUnresolvedAbuseReport = ref(false);
const updateAvailable = ref(false);

if ($i?.isAdmin) {
	os.api("admin/abuse-user-reports", {
		state: "unresolved",
		limit: 1,
	}).then((reports) => {
		if (reports?.length > 0) thereIsUnresolvedAbuseReport.value = true;
	});
}

if (defaultStore.state.showAdminUpdates) {
	os.api("latest-version").then((res) => {
		const cleanRes = parseInt(res?.tag_name.replace(/[^0-9]/g, ""));
		const cleanVersion = parseInt(version.replace(/[^0-9]/g, ""));
		if (cleanRes > cleanVersion) {
			updateAvailable.value = true;
		}
	});
}

function openAccountMenu(ev: MouseEvent) {
	openAccountMenu_(
		{
			withExtraOperation: true,
		},
		ev,
	);
}

function openHelpMenu(ev: MouseEvent) {
	openHelpMenu_(ev);
}

function more(ev: MouseEvent) {
	os.popup(
		defineAsyncComponent(() => import("@/components/MkLaunchPad.vue")),
		{
			src: ev.currentTarget ?? ev.target,
		},
		{},
		"closed",
	);
}
</script>

<style lang="scss" scoped>
.mvcprjjd {
	$nav-width: 250px;
	$nav-icon-only-width: 80px;
	flex: 0 0 $nav-width;
	width: $nav-width;
	box-sizing: border-box;

	> .body {
		position: sticky;
		top: 0;
		width: $nav-icon-only-width;
		// ほんとは単に 100vh と書きたいところだが... https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
		height: calc(var(--vh, 1vh) * 100);
		box-sizing: border-box;
		overflow: auto;
		overflow-x: clip;
		#firefish_app > :not(.wallpaper) & {
			background: var(--navBg);
		}
		#firefish_app > .wallpaper:not(.centered) & {
			border-inline-end: 1px solid var(--divider);
		}
		contain: strict;
		display: flex;
		flex-direction: column;
	}

	&:not(.iconOnly) {
		> .body {
			margin-inline-start: -200px;
			padding-inline-start: 200px;
			box-sizing: content-box;
			width: $nav-width;

			> .top {
				position: relative;
				z-index: 1;
				padding: 2rem 0;
				> .banner {
					position: absolute;
					top: 0;
					inset-inline-start: 0;
					width: 100%;
					height: 100%;
					background-size: cover;
					background-position: center center;
					-webkit-mask-image: linear-gradient(var(--gradient));
					mask-image: linear-gradient(var(--gradient));
				}

				> .account {
					position: relative;
					display: block;
					text-align: center;
					width: 100%;

					> .icon {
						display: inline-block;
						width: 55px;
						aspect-ratio: 1;
					}
				}
			}

			> .bottom {
				padding: 20px 0;

				> .post {
					position: relative;
					width: 100%;
					height: 40px;
					color: var(--fgOnAccent);
					font-weight: bold;
					text-align: left;
					display: flex;
					align-items: center;

					&:before {
						content: "";
						display: block;
						width: calc(100% - 38px);
						height: 100%;
						margin: auto;
						position: absolute;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
						border-radius: 999px;
						background: linear-gradient(
							90deg,
							var(--buttonGradateA),
							var(--buttonGradateB)
						);
					}

					&:hover,
					&:focus-within,
					&.active {
						&:before {
							background: var(--accentLighten);
							transition: all 0.4s ease;
						}
					}

					> .icon,
					> .text {
						position: relative;
						left: 3rem;
						color: var(--fgOnAccent);
						transform: translateY(0em);
					}

					> .text {
						margin-inline-start: 1rem;
					}
				}

				> .instance {
					position: relative;
					display: block;
					text-align: center;
					width: 100%;

					> .icon {
						display: inline-block;
						width: 48px !important;
						aspect-ratio: 1;
						margin-top: 2rem;
					}
				}

				> .help {
					position: relative;
					display: block;
					text-align: center;
					width: 100%;
					margin-top: 1rem;
					color: var(--navFg);

					> .icon {
						display: inline-block;
						width: 38px;
						aspect-ratio: 1;
					}
				}
			}

			> .middle {
				flex: 0.1;

				> .divider {
					margin: 16px 16px;
					border-top: solid 0.5px var(--divider);
				}

				> .item {
					position: relative;
					display: flex;
					align-items: center;
					padding-left: 30px;
					line-height: 2.85rem;
					margin-bottom: 0.5rem;
					white-space: nowrap;
					width: 100%;
					text-align: left;
					box-sizing: border-box;
					color: var(--navFg);

					> .icon {
						position: relative;
						width: 32px;
						margin-inline-end: 8px;
					}

					> .indicator {
						position: absolute;
						top: 0;
						left: 20px;
						color: var(--navIndicator);
						font-size: 8px;
						animation: blink 1s infinite;
					}

					> .text {
						position: relative;
						font-size: 0.9em;
						overflow: hidden;
						text-overflow: ellipsis;
					}

					&:hover,
					&:focus-within {
						text-decoration: none;
						color: var(--navHoverFg);
						transition: all 0.4s ease;
					}

					&.active {
						color: var(--navActive);
					}

					&:hover,
					&:focus-within,
					&.active {
						color: var(--accent);
						transition: all 0.4s ease;

						&:before {
							content: "";
							display: block;
							width: calc(100% - 34px);
							height: 100%;
							margin: auto;
							position: absolute;
							top: 0;
							left: 0;
							right: 0;
							bottom: 0;
							border-radius: 999px;
							background: var(--accentedBg);
						}
					}
				}
			}
		}
	}

	&.iconOnly {
		flex: 0 0 $nav-icon-only-width;
		width: $nav-icon-only-width;

		> .body {
			width: $nav-icon-only-width;

			> .top {
				padding: 2rem 0;

				> .account {
					display: block;
					text-align: center;
					width: 100%;

					> .icon {
						display: inline-block;
						width: 40px;
						aspect-ratio: 1;
						transform: translateY(0em);
					}
				}
			}

			> .bottom {
				padding: 20px 0;

				> .post {
					display: block;
					position: relative;
					width: 100%;
					height: 52px;
					margin-bottom: 16px;
					text-align: center;

					&:before {
						content: "";
						display: block;
						position: absolute;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
						margin: auto;
						width: 52px;
						aspect-ratio: 1/1;
						border-radius: 100%;
						background: linear-gradient(
							90deg,
							var(--buttonGradateA),
							var(--buttonGradateB)
						);
					}

					&:hover,
					&:focus-within,
					&.active {
						&:before {
							background: var(--accentLighten);
							transition: all 0.4s ease;
						}
					}

					> .icon {
						position: relative;
						color: var(--fgOnAccent);
					}

					> .text {
						display: none;
					}
				}

				> .help {
					position: relative;
					display: block;
					text-align: center;
					width: 100%;
					margin-top: 1rem;
					color: var(--navFg);

					> .icon {
						display: inline-block;
						width: 38px;
						aspect-ratio: 1;
					}
				}

				> .instance {
					position: relative;
					display: block;
					text-align: center;
					width: 100%;

					> .icon {
						display: inline-block;
						margin-top: 1rem;
						width: 32px !important;
						aspect-ratio: 1;
					}
				}
			}

			> .middle {
				flex: 0.1;

				> .divider {
					margin: 8px auto;
					width: calc(100% - 32px);
					border-top: solid 0.5px var(--divider);
				}

				> .item {
					display: block;
					position: relative;
					padding: 1.1rem 0;
					margin-bottom: 0.2rem;
					width: 100%;
					text-align: center;

					> .icon {
						display: block;
						margin: 0 auto;
						opacity: 0.7;
						transform: translateY(0em);
					}

					> .text {
						display: none;
					}

					> .indicator {
						position: absolute;
						top: 6px;
						inset-inline-start: 24px;
						color: var(--navIndicator);
						font-size: 8px;
						animation: blink 1s infinite;
					}

					&:hover,
					&:focus-within,
					&.active {
						text-decoration: none;
						color: var(--accent);
						transition: all 0.4s ease;

						&:before {
							content: "";
							display: block;
							height: 100%;
							aspect-ratio: 1;
							margin: auto;
							position: absolute;
							top: 0;
							left: 0;
							right: 0;
							bottom: 0;
							border-radius: 999px;
							background: var(--accentedBg);
						}

						> .icon,
						> .text {
							opacity: 1;
						}
					}
				}
			}
		}
	}

	.item {
		outline: none;
		&:focus-visible:before {
			outline: auto;
		}
	}
}
</style>
