<template>
	<div>
		{{ i18n.ts.processing }}
	</div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import * as os from "@/os";
import { i18n } from "@/i18n";
import { definePageMetadata } from "@/scripts/page-metadata";
import { useRouter } from "@/router";
import icon from "@/scripts/icon";

const router = useRouter();

const props = defineProps<{
	code: string;
}>();

onMounted(async () => {
	await os.alert({
		type: "info",
		text: i18n.t("clickToFinishEmailVerification", { ok: i18n.ts.gotIt }),
	});
	await os.api("verify-email", {
		code: props.code,
	});
	router.push("/");
});

definePageMetadata({
	title: "Verify email",
	icon: `${icon("ph-user")}`,
});
</script>
