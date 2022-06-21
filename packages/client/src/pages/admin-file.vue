<template>
<MkStickyContainer>
	<template #header><MkPageHeader :actions="headerActions" :tabs="headerTabs"/></template>
	<MkSpacer :content-max="500" :margin-min="16" :margin-max="32">
		<div v-if="file" class="cxqhhsmd _formRoot">
			<div class="_formBlock">
				<MkDriveFileThumbnail class="thumbnail" :file="file" fit="contain"/>
				<div class="info">
					<span style="margin-right: 1em;">{{ file.type }}</span>
					<span>{{ bytes(file.size) }}</span>
					<MkTime :time="file.createdAt" mode="detail" style="display: block;"/>
				</div>
			</div>
			<div class="_formBlock">
				<MkSwitch v-model="isSensitive" @update:modelValue="toggleIsSensitive">NSFW</MkSwitch>
			</div>
			<FormLink class="_formBlock" :to="file.url" :external="true">Open</FormLink>
			<FormLink class="_formBlock" :to="`/user-info/${file.userId}`">{{ $ts.user }}</FormLink>

			<div class="_formBlock">
				<MkButton full danger @click="del"><i class="fas fa-trash-alt"></i> {{ $ts.delete }}</MkButton>
			</div>
			<div v-if="info" class="_formBlock">
				<details class="_content rawdata">
					<pre><code>{{ JSON.stringify(info, null, 2) }}</code></pre>
				</details>
			</div>
		</div>
	</MkSpacer>
</MkStickyContainer>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import MkButton from '@/components/ui/button.vue';
import MkSwitch from '@/components/form/switch.vue';
import MkDriveFileThumbnail from '@/components/drive-file-thumbnail.vue';
import FormLink from '@/components/form/link.vue';
import bytes from '@/filters/bytes';
import * as os from '@/os';
import { i18n } from '@/i18n';
import { definePageMetadata } from '@/scripts/page-metadata';

let file: any = $ref(null);
let info: any = $ref(null);
let isSensitive: boolean = $ref(false);

const props = defineProps<{
	fileId: string,
}>();

async function fetch() {
	file = await os.api('drive/files/show', { fileId: props.fileId });
	info = await os.api('admin/drive/show-file', { fileId: props.fileId });
	isSensitive = file.isSensitive;
}

fetch();

async function del() {
	const { canceled } = await os.confirm({
		type: 'warning',
		text: i18n.t('removeAreYouSure', { x: file.name }),
	});
	if (canceled) return;

	os.apiWithDialog('drive/files/delete', {
		fileId: file.id,
	});
}

async function toggleIsSensitive(v) {
	await os.api('drive/files/update', { fileId: props.fileId, isSensitive: v });
	isSensitive = v;
}

const headerActions = $computed(() => []);

const headerTabs = $computed(() => []);

definePageMetadata(computed(() => ({
	title: file ? i18n.ts.file + ': ' + file.name : i18n.ts.file,
	icon: 'fas fa-file',
	bg: 'var(--bg)',
})));
</script>

<style lang="scss" scoped>
.cxqhhsmd {
	> ._section {
		> .thumbnail {
			height: 150px;
			max-width: 100%;
		}

		> .info {
			text-align: center;
			margin-top: 8px;
		}
		
		> .rawdata {
			overflow: auto;
		}
	}
}
</style>