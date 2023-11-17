<template>
	<div :class="$style.root">
		<MkFolder class="item">
			<template #header>Active Users</template>
			<div :class="$style.chart">
				<div class="selects">
					<MkSelect v-model="chartSpan" style="margin: 0 0 0 10px">
						<option value="hour">{{ i18n.ts.perHour }}</option>
						<option value="day">{{ i18n.ts.perDay }}</option>
					</MkSelect>
				</div>
				<div class="chart _panel">
					<MkChart
						src="active-users"
						:span="chartSpan"
						:limit="chartLimit"
						:detailed="true"
					></MkChart>
				</div>
			</div>
			<div class="_panel" :class="$style.heatmap">
				<MkHeatmap src="active-users" />
			</div>
		</MkFolder>

		<MkFolder class="item">
			<template #header>Federation</template>
			<div :class="$style.federation">
				<div class="pies">
					<div class="sub">
						<div class="title">Sub</div>
						<canvas ref="subDoughnutEl"></canvas>
					</div>
					<div class="pub">
						<div class="title">Pub</div>
						<canvas ref="pubDoughnutEl"></canvas>
					</div>
				</div>
			</div>
		</MkFolder>
	</div>
</template>

<script lang="ts" setup>
import { onMounted, ref, shallowRef } from "vue";
import { Chart } from "chart.js";
import MkSelect from "@/components/form/select.vue";
import MkChart from "@/components/MkChart.vue";
import { useChartTooltip } from "@/scripts/use-chart-tooltip";
import * as os from "@/os";
import { i18n } from "@/i18n";
import MkHeatmap from "@/components/MkHeatmap.vue";
import MkFolder from "@/components/MkFolder.vue";
import { initChart } from "@/scripts/init-chart";

initChart();

const chartLimit = 500;
const chartSpan = ref<"hour" | "day">("hour");
const subDoughnutEl = shallowRef<HTMLCanvasElement>();
const pubDoughnutEl = shallowRef<HTMLCanvasElement>();

const { handler: externalTooltipHandler1 } = useChartTooltip({
	position: "middle",
});
const { handler: externalTooltipHandler2 } = useChartTooltip({
	position: "middle",
});

function createDoughnut(chartEl, tooltip, data) {
	const chartInstance = new Chart(chartEl, {
		type: "doughnut",
		data: {
			labels: data.map((x) => x.name),
			datasets: [
				{
					backgroundColor: data.map((x) => x.color),
					borderColor: getComputedStyle(
						document.documentElement,
					).getPropertyValue("--panel"),
					borderWidth: 2,
					hoverOffset: 0,
					data: data.map((x) => x.value),
				},
			],
		},
		options: {
			maintainAspectRatio: false,
			layout: {
				padding: {
					left: 16,
					right: 16,
					top: 16,
					bottom: 16,
				},
			},
			onClick: (ev) => {
				const hit = chartInstance.getElementsAtEventForMode(
					ev,
					"nearest",
					{ intersect: true },
					false,
				)[0];
				if (hit && data[hit.index].onClick) {
					data[hit.index].onClick();
				}
			},
			plugins: {
				legend: {
					display: false,
				},
				tooltip: {
					enabled: false,
					mode: "index",
					animation: {
						duration: 0,
					},
					external: tooltip,
				},
			},
		},
	});

	return chartInstance;
}

onMounted(() => {
	os.apiGet("federation/stats", { limit: 30 }).then((fedStats) => {
		createDoughnut(
			subDoughnutEl.value,
			externalTooltipHandler1,
			fedStats.topSubInstances
				.map((x) => ({
					name: x.host,
					color: x.themeColor,
					value: x.followersCount,
					onClick: () => {
						os.pageWindow(`/instance-info/${x.host}`);
					},
				}))
				.concat([
					{
						name: "(other)",
						color: "#80808080",
						value: fedStats.otherFollowersCount,
					},
				]),
		);

		createDoughnut(
			pubDoughnutEl.value,
			externalTooltipHandler2,
			fedStats.topPubInstances
				.map((x) => ({
					name: x.host,
					color: x.themeColor,
					value: x.followingCount,
					onClick: () => {
						os.pageWindow(`/instance-info/${x.host}`);
					},
				}))
				.concat([
					{
						name: "(other)",
						color: "#80808080",
						value: fedStats.otherFollowingCount,
					},
				]),
		);
	});
});
</script>

<style lang="scss" module>
.root {
	&:global {
		> .item {
			margin-bottom: 16px;
		}
	}
}

.chart {
	&:global {
		> .selects {
			display: flex;
			margin-bottom: 12px;
		}

		> .chart {
			padding: 16px;
		}
	}
}

.heatmap {
	padding: 16px;
	margin-bottom: 16px;
}

.retention {
	padding: 16px;
	margin-bottom: 16px;
}

.federation {
	&:global {
		> .pies {
			display: flex;
			gap: 16px;

			> .sub,
			> .pub {
				flex: 1;
				min-width: 0;
				position: relative;
				background: var(--panel);
				border-radius: var(--radius);
				padding: 24px;
				max-height: 300px;

				> .title {
					position: absolute;
					top: 24px;
					inset-inline-start: 24px;
				}
			}

			@media (max-width: 600px) {
				flex-direction: column;
			}
		}
	}
}
</style>
