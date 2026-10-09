import {AgentPlatformBackend, getAI, getGenerativeModel, Schema} from "firebase/ai";

import type {Coin} from "../types/coin";
import type {Country} from "../types/country";
import {app} from "./firebase";

const ai = getAI(app, {backend: new AgentPlatformBackend("global")});

export function startCoinChat(coin: Coin) {
  const model = getGenerativeModel(ai, {
    model: "gemini-3.5-flash-lite",
    systemInstruction:
      "Ти досвідчений нумізмат. Відповідай українською, коротко і цікаво. " +
      `Розмова про монету: ${JSON.stringify(coin)}, які факти про ню є, чи вона ще в вжитку, що за ню можна купити або можна було купити у рік виходу`,
  });
  return model.startChat();
}

export type CoinDraft = {
  coin: Omit<Coin, "id" | "avers" | "revers">;
  newCountry?: Country;
};

const draftSchema = Schema.object({
  properties: {
    coin: Schema.object({
      properties: {
        name: Schema.string({description: "Назва монети англійською, напр. «Quarter Dollar», «One Cent»"}),
        country: Schema.string({description: "Код країни: зі списку наявних або новий ISO 3166-1 alpha-2, нижній регістр"}),
        value: Schema.number({
          description: "Номінал числом в одиницях currency; для розмінних монет — у дрібних: 25 (cent), а не 0.25 (dollar)",
        }),
        currency: Schema.string({
          description: "Одиниця номіналу англійською в однині: дрібна для розмінних (cent, kopiyka), основна для інших (dollar, hryvnia)",
        }),
        year: Schema.integer({description: "Рік карбування з фото"}),
        info: Schema.string({description: "Опис українською: що зображено на аверсі й реверсі, написи, 2–3 речення"}),
      },
    }),
    newCountry: Schema.object({
      description: "Лише якщо країни монети немає в списку наявних",
      properties: {
        id: Schema.string({description: "ISO 3166-1 alpha-2, нижній регістр, той самий, що coin.country"}),
        name_ua: Schema.string(),
        name_en: Schema.string(),
        flag: Schema.string({description: "Емодзі прапора"}),
      },
    }),
  },
  optionalProperties: ["newCountry"],
});

/** `avers` / `revers` — локальний URI або URL зі Storage. */
export async function describeCoinPhotos(avers: string, revers: string, countries: Country[]) {
  const model = getGenerativeModel(ai, {
    model: "gemini-3.5-flash",
    generationConfig: {responseMimeType: "application/json", responseSchema: draftSchema},
  });
  const known = countries.map((c) => `${c.id} — ${c.name_en}`).join(", ");
  const result = await model.generateContent([
    "Ти досвідчений нумізмат. Перше фото — аверс монети, друге — реверс. Визнач монету й заповни дані. " +
      `Наявні країни: ${known}. Якщо країна монети серед них — візьми її код і не заповнюй newCountry.`,
    ...(await Promise.all([toPart(avers), toPart(revers)])),
  ]);
  return JSON.parse(result.response.text()) as CoinDraft;
}

async function toPart(uri: string) {
  const blob = await (await fetch(uri)).blob();
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
  return {inlineData: {data: dataUrl.split(",")[1], mimeType: blob.type || "image/jpeg"}};
}
