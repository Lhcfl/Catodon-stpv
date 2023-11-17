import { beforeShutdown } from "@/misc/before-shutdown.js";

import ActiveUsersChart from "./charts/active-users.js";
export const activeUsersChart = new ActiveUsersChart();

// 20分おきにメモリ情報をDBに書き込み
setInterval(() => activeUsersChart.save(), 1000 * 60 * 20);

beforeShutdown(async () => await activeUsersChart.save());
