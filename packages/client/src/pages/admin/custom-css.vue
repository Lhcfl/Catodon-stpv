<template>
	<div class="_formRoot">
		<FormInfo warn class="_formBlock">{{
			i18n.ts.adminCustomCssWarn
		}}</FormInfo>

		<FormTextarea
			v-model="globalCustomCss"
			manual-save
			tall
			class="_monospace _formBlock"
			style="tab-size: 2"
		>
			<template #label>Instance CSS</template>
		</FormTextarea>
	</div>
</template>

<script lang="ts" setup>
// import { ref, watch } from "vue";
import FormTextarea from "@/components/form/textarea.vue";
import FormInfo from "@/components/MkInfo.vue";
import { i18n } from "@/i18n";
import { definePageMetadata } from "@/scripts/page-metadata";
import icon from "@/scripts/icon";

// const localCustomCss = ref(localStorage.getItem("customCss") ?? "");

/*
async function apply() {
	localStorage.setItem('customCss', globalCustomCss.value);

	const { canceled } = await os.confirm({
		type: 'info',
		text: i18n.ts.reloadToApplySetting,
	});
	if (canceled) return;

	unisonReload();
}

watch(globalCustomCss, async () => {
	await apply();
});
*/

definePageMetadata({
	title: i18n.ts.customCss,
	icon: `${icon("ph-code")}`,
});
</script>
