import * as firefish from "firefish-js";
import { markRaw } from "vue";
import { $i } from "@/reactiveAccount";
import { url } from "@/config";

export const stream = markRaw(
	new firefish.Stream(
		url,
		$i
			? {
					token: $i.token,
			  }
			: null,
	),
);

window.setTimeout(heartbeat, 1000 * 60);

function heartbeat(): void {
	if (stream != null && document.visibilityState === "visible") {
		stream.send("ping");
	}
	window.setTimeout(heartbeat, 1000 * 60);
}
