<template>
	<div class="_formRoot">
		<FormButton primary class="_formBlock" @click="generateToken">{{
			i18n.ts.generateAccessToken
		}}</FormButton>
		<FormLink to="/settings/apps" class="_formBlock">{{
			i18n.ts.manageAccessTokens
		}}</FormLink>
		<FormLink
			to="/api-console"
			:behavior="isDesktop ? 'window' : null"
			class="_formBlock"
			>API console</FormLink
		>
	</div>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, ref } from "vue";
import FormLink from "@/components/form/link.vue";
import FormButton from "@/components/MkButton.vue";
import * as os from "@/os";
import { i18n } from "@/i18n";
import { definePageMetadata } from "@/scripts/page-metadata";
import icon from "@/scripts/icon";

const isDesktop = ref(window.innerWidth >= 1100);

function generateToken() {
	os.popup(
		defineAsyncComponent(
			() => import("@/components/MkTokenGenerateWindow.vue"),
		),
		{},
		{
			done: async (result) => {
				const { name, permissions } = result;
				const { token } = await os.api("miauth/gen-token", {
					session: null,
					name,
					permission: permissions,
				});

				os.alert({
					type: "success",
					title: i18n.ts.token,
					text: token,
				});
			},
		},
		"closed",
	);
}

definePageMetadata({
	title: "API",
	icon: `${icon("ph-key")}`,
});
</script>
