import { URLSearchParams } from "node:url";
import fetch from "node-fetch";
import config from "@/config/index.js";
import { Converter } from "opencc-js";
import { getAgentByUrl } from "@/misc/fetch.js";
import { fetchMeta } from "@/misc/fetch-meta.js";
import { ApiError } from "@/server/api/error.js";
import { getNote } from "@/server/api/common/getters.js";
import define from "@/server/api/define.js";

export const meta = {
	tags: ["notes"],

	requireCredential: true,
	requireCredentialPrivateMode: true,

	res: {
		type: "object",
		optional: false,
		nullable: false,
	},

	errors: {
		noSuchNote: {
			message: "No such note.",
			code: "NO_SUCH_NOTE",
			id: "bea9b03f-36e0-49c5-a4db-627a029f8971",
		},
	},
} as const;

export const paramDef = {
	type: "object",
	properties: {
		noteId: { type: "string", format: "misskey:id" },
		targetLang: { type: "string" },
	},
	required: ["noteId", "targetLang"],
} as const;

function convertChinese(convert: boolean, src: string) {
	if (!convert) return src;

	const converter = Converter({ from: "cn", to: "twp" });
	return converter(src);
}

export default define(meta, paramDef, async (ps, user) => {
	const note = await getNote(ps.noteId, user).catch((err) => {
		if (err.id === "9725d0ce-ba28-4dde-95a7-2cbb2c15de24")
			throw new ApiError(meta.errors.noSuchNote);
		throw err;
	});

	if (note.text == null) {
		return 204;
	}

	const instance = await fetchMeta();

	let targetLang = ps.targetLang;

	if (!instance.deeplAuthKey && !instance.libreTranslateApiUrl) {
		const MAX_TRANSLATE = 15000;
		const MAX_TRANSLATE_PER_REQ = 1500;
		
		const toTranslate: string[] = [];

		for (let i = 0; i < note.text.length && i < MAX_TRANSLATE; i += MAX_TRANSLATE_PER_REQ) {
			toTranslate.push(note.text.slice(i, i + MAX_TRANSLATE_PER_REQ));
		}

		const googleTranslate = async (toTranslate: string) => {
			const googleUrl = new URL("https://translate.google.com/translate_a/single?client=gtx&dt=t&dj=1&ie=UTF-8&sl=auto")
			googleUrl.searchParams.append("tl", targetLang.replaceAll("-", "_"));
			googleUrl.searchParams.append("q", toTranslate);
			
			const res = await fetch(googleUrl.toString());
			const json = await res.json() as {
				sentences: {
						/** translated text */
						trans: string,
						/** original text */
						orig: string,
					}[],
				src: string,
			};

			return {
				sourceLang: json.src,
				text: json.sentences.map(s => s.trans).join(" "),
			};
		}

		const result: {
			sourceLang?: string,
			text: string,
		} = {
			text: "",
		};

		for (const text of toTranslate) {
			// If it is not the first request, sleep 500 milliseconds to prevent 429 too many requests.
			if (!result.text) {
				await new Promise(r => setTimeout(r, 500));
			}
			try {
				const res = await googleTranslate(text);
				result.sourceLang ||= res.sourceLang;
				result.text += res.text;
			} catch (err) {
				result.text += "... (an error occurred during translate)"
				return result;
			}
		}

		if (note.text.length > MAX_TRANSLATE + MAX_TRANSLATE_PER_REQ) {
			result.text += "... (text is too long to translate)"
		}

		return result;
	
	}

	
	if (targetLang.includes("-")) targetLang = targetLang.split("-")[0];
	if (targetLang.includes("_")) targetLang = targetLang.split("_")[0];

	if (instance.libreTranslateApiUrl != null) {
		const jsonBody = {
			q: note.text,
			source: "auto",
			target: targetLang,
			format: "text",
			api_key: instance.libreTranslateApiKey ?? "",
		};

		const url = new URL(instance.libreTranslateApiUrl);
		if (url.pathname.endsWith("/")) {
			url.pathname = url.pathname.slice(0, -1);
		}
		if (!url.pathname.endsWith("/translate")) {
			url.pathname += "/translate";
		}
		const res = await fetch(url.toString(), {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(jsonBody),
			agent: getAgentByUrl,
		});

		const json = (await res.json()) as {
			detectedLanguage?: {
				confidence: number;
				language: string;
			};
			translatedText: string;
		};

		return {
			sourceLang: json.detectedLanguage?.language,
			text: convertChinese(ps.targetLang === "zh-TW", json.translatedText),
		};
	}

	const params = new URLSearchParams();
	params.append("auth_key", instance.deeplAuthKey ?? "");
	params.append("text", note.text);
	params.append("target_lang", targetLang);

	const endpoint = instance.deeplIsPro
		? "https://api.deepl.com/v2/translate"
		: "https://api-free.deepl.com/v2/translate";

	const res = await fetch(endpoint, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			"User-Agent": config.userAgent,
			Accept: "application/json, */*",
		},
		body: params,
		// TODO
		//timeout: 10000,
		agent: getAgentByUrl,
	});

	const json = (await res.json()) as {
		translations: {
			detected_source_language: string;
			text: string;
		}[];
	};

	return {
		sourceLang: json.translations[0].detected_source_language,
		text: convertChinese(ps.targetLang === "zh-TW", json.translations[0].text),
	};
});
