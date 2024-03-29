<template>
	<MkInfo
		v-if="tlHint && !tlHintClosed"
		:closeable="true"
		class="_gap"
		@close="closeHint"
	>
		<I18n :src="tlHint">
			<template #icon></template>
		</I18n>
	</MkInfo>
	<div v-if="queue > 0" class="new">
		<button
			class="_buttonPrimary _shadow"
			:class="{ instant: !defaultStore.state.animation }"
			@click="tlComponent.scrollTop()"
		>
			{{ i18n.ts.newNoteRecived }}
			<i :class="icon('ph-arrow-up', false)"></i>
		</button>
	</div>
	<XNotes
		ref="tlComponent"
		:no-gap="!defaultStore.state.showGapBetweenNotesInTimeline"
		:pagination="pagination"
		@queue="(x) => (queue = x)"
	/>
</template>

<script lang="ts" setup>
import { computed, onUnmounted, provide, ref } from "vue";
import XNotes from "@/components/MkNotes.vue";
import MkInfo from "@/components/MkInfo.vue";
import { stream } from "@/stream";
import * as sound from "@/scripts/sound";
import { $i } from "@/reactiveAccount";
import { i18n } from "@/i18n";
import { defaultStore } from "@/store";
import icon from "@/scripts/icon";

const props = defineProps<{
	src: string;
	list?: string;
	antenna?: string;
	channel?: string;
	sound?: boolean;
	fileId?: string;
}>();

const queue = ref(0);

const emit = defineEmits<{
	(ev: "note"): void;
	(ev: "queue", count: number): void;
}>();

provide(
	"inChannel",
	computed(() => props.src === "channel"),
);

const tlComponent: InstanceType<typeof XNotes> = ref();

const prepend = (note) => {
	tlComponent.value.pagingComponent?.prepend(note);

	emit("note");

	if (props.sound) {
		sound.play($i && note.userId === $i.id ? "noteMy" : "note");
	}
};

const onUserAdded = () => {
	tlComponent.value.pagingComponent?.reload();
};

const onUserRemoved = () => {
	tlComponent.value.pagingComponent?.reload();
};

const onChangeFollowing = () => {
	if (!tlComponent.value.pagingComponent?.backed) {
		tlComponent.value.pagingComponent?.reload();
	}
};

let endpoint, query, connection, connection2, tlHint, tlHintClosed;

if (props.src === "antenna") {
	endpoint = "antennas/notes";
	query = {
		antennaId: props.antenna,
	};
	connection = stream.useChannel("antenna", {
		antennaId: props.antenna,
	});
	connection.on("note", prepend);
} else if (props.src === "home") {
	endpoint = "notes/timeline";
	query = {
		withReplies: defaultStore.state.showTimelineReplies,
	};
	connection = stream.useChannel("homeTimeline", {
		withReplies: defaultStore.state.showTimelineReplies,
	});
	connection.on("note", prepend);

	connection2 = stream.useChannel("main");
	connection2.on("follow", onChangeFollowing);
	connection2.on("unfollow", onChangeFollowing);

	tlHint = !defaultStore.state.isSocialTimelineAvailable ? i18n.ts._tutorial.step5_3 : i18n.ts._tutorial.step5_5;
	tlHintClosed = defaultStore.state.tlHomeHintClosed;
} else if (props.src === "local") {
	endpoint = "notes/local-timeline";
	query = {
		withReplies: defaultStore.state.showTimelineReplies,
	};
	connection = stream.useChannel("localTimeline", {
		withReplies: defaultStore.state.showTimelineReplies,
	});
	connection.on("note", prepend);

	tlHint = i18n.ts._tutorial.step5_4;
	tlHintClosed = defaultStore.state.tlLocalHintClosed;
} else if (props.src === "recommended") {
	endpoint = "notes/recommended-timeline";
	query = {
		withReplies: defaultStore.state.showTimelineReplies,
	};
	connection = stream.useChannel("recommendedTimeline", {
		withReplies: defaultStore.state.showTimelineReplies,
	});
	connection.on("note", prepend);

	tlHint = i18n.ts._tutorial.step5_6;
	tlHintClosed = defaultStore.state.tlRecommendedHintClosed;
} else if (props.src === "social") {
	endpoint = "notes/hybrid-timeline";
	query = {
		withReplies: defaultStore.state.showTimelineReplies,
	};
	connection = stream.useChannel("hybridTimeline", {
		withReplies: defaultStore.state.showTimelineReplies,
	});
	connection.on("note", prepend);

	tlHint = i18n.ts._tutorial.step5_5;
	tlHintClosed = defaultStore.state.tlSocialHintClosed;
} else if (props.src === "global") {
	endpoint = "notes/global-timeline";
	query = {
		withReplies: defaultStore.state.showTimelineReplies,
	};
	connection = stream.useChannel("globalTimeline", {
		withReplies: defaultStore.state.showTimelineReplies,
	});
	connection.on("note", prepend);

	tlHint = i18n.ts._tutorial.step5_7;
	tlHintClosed = defaultStore.state.tlGlobalHintClosed;
} else if (props.src === "mentions") {
	endpoint = "notes/mentions";
	connection = stream.useChannel("main");
	connection.on("mention", prepend);
} else if (props.src === "directs") {
	endpoint = "notes/mentions";
	query = {
		visibility: "specified",
	};
	const onNote = (note) => {
		if (note.visibility === "specified") {
			prepend(note);
		}
	};
	connection = stream.useChannel("main");
	connection.on("mention", onNote);
} else if (props.src === "list") {
	endpoint = "notes/user-list-timeline";
	query = {
		listId: props.list,
	};
	connection = stream.useChannel("userList", {
		listId: props.list,
	});
	connection.on("note", prepend);
	connection.on("userAdded", onUserAdded);
	connection.on("userRemoved", onUserRemoved);
} else if (props.src === "channel") {
	endpoint = "channels/timeline";
	query = {
		channelId: props.channel,
	};
	connection = stream.useChannel("channel", {
		channelId: props.channel,
	});
	connection.on("note", prepend);
} else if (props.src === "file") {
	endpoint = "drive/files/attached-notes";
	query = {
		fileId: props.fileId,
	};
}

function closeHint() {
	switch (props.src) {
		case "home":
			defaultStore.set("tlHomeHintClosed", true);
			break;
		case "local":
			defaultStore.set("tlLocalHintClosed", true);
			break;
		case "recommended":
			defaultStore.set("tlRecommendedHintClosed", true);
			break;
		case "social":
			defaultStore.set("tlSocialHintClosed", true);
			break;
		case "global":
			defaultStore.set("tlGlobalHintClosed", true);
			break;
	}
}

const pagination = {
	endpoint,
	limit: 10,
	params: query,
};

onUnmounted(() => {
	connection.dispose();
	if (connection2) connection2.dispose();
});

/* TODO
const timetravel = (date?: Date) => {
	this.date = date;
	this.$refs.tl.reload();
};
*/
</script>
<style lang="scss" scoped>
@keyframes slideUp {
	to {
		transform: translateY(-100%);
		opacity: 0;
	}
}
.new {
	position: sticky;
	display: flex;
	justify-content: center;
	top: calc(var(--stickyTop, 0px) - 60px);
	width: 600px;
	max-width: 100%;
	height: 60px;
	pointer-events: none;
	margin: auto;
	margin-top: -60px;
	z-index: 1001;
	box-shadow: 0 24px 24px -20px var(--accentedBg);
	&::after {
		content: "";
		position: absolute;
		inset: -2px 0;
		border: 2px solid var(--accentDarken);
		mask: linear-gradient(
			to right,
			transparent,
			black 40% 60%,
			transparent
		);
		-webkit-mask: linear-gradient(
			to right,
			transparent,
			black 40% 60%,
			transparent
		);
	}
	> button {
		display: flex;
		position: absolute;
		top: 120%;
		margin-inline: auto;
		border-radius: 2em;
		padding: 0.5em 1.2em;
		background: var(--accentedBg);
		border: 0;
		color: var(--accent);
		overflow: hidden;
		pointer-events: all;
		transform: translateY(-100%);
		opacity: 0;
		animation:
			reset 0.4s forwards cubic-bezier(0, 0.4, 0, 1.1),
			slideUp 1s 5s forwards cubic-bezier(1, 0, 1, 1);
		&::before {
			content: "";
			position: absolute;
			inset: 0;
			background: var(--bg);
			z-index: -1;
		}
		i {
			margin-inline-start: 0.7em;
			border-inline-start: 1px solid var(--accentedBg);
			padding-inline-start: 0.4em;
		}
	}
}
</style>
