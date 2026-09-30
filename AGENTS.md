# Numismat — персональна колекція монет (Expo / React Native)

## Мета проєкту
Навчальний проєкт: зробити з нуля Expo-додаток для обліку особистої колекції монет.
Починаємо від Hello World і рухаємося малими кроками.
Паралельно той самий додаток робиться нативно (кроки плану синхронізовані між проєктами):
- Kotlin / Android: `/Users/viktor_kravchuk/traning/numismat-kotlin-app`
- Swift / iOS: `/Users/viktor_kravchuk/traning/numismat-swift-app`
- Спільний бекенд (AI-проксі): `/Users/viktor_kravchuk/traning/numismat-server` — див. розділ "Бекенд numismat-server"

## Про автора
- Великий досвід у React Native / TypeScript.
- Expo (сучасний стек: Expo Router, config plugins, EAS) — освіжає / поглиблює.
- Паралельно вчить Kotlin і Swift — корисно порівнювати RN ↔ Compose ↔ SwiftUI.

## Як працюємо (правила для AI)
- НЕ генерувати готовий проєкт чи великі шматки коду за раз — лише малі кроки.
- RN автор знає добре: базові речі не розжовувати, фокус на специфіці Expo
  і на порівнянні з Kotlin / Swift реалізацією того самого кроку.
- Код мінімальний і простий, без передчасних абстракцій та зайвих бібліотек.
- Перед новою темою коротко пояснити "навіщо", потім "як".
- Мова спілкування — українська.
- Після завершення кроку оновлювати розділи "План", "Поточний стан" і "Журнал" у цьому файлі.

## Функціональність додатку (цільова)
- Список монет колекції.
- Додавання / редагування / видалення монети.
- Поля монети: назва, країна, рік, номінал, метал, стан (grade), ціна покупки,
  дата придбання, нотатки, фото аверсу та реверсу.
- Деталі монети на окремому екрані.
- Пошук і фільтри (країна, рік, метал).
- Статистика колекції (кількість, загальна вартість, розподіл за країнами).
- Локальне збереження даних (офлайн, без бекенду).
- Можливо пізніше: експорт/імпорт, інтеграція з каталогом Numista API.

## Стек
- Мова: TypeScript
- Фреймворк: Expo (managed workflow, шаблон `blank-typescript`)
- Навігація: Expo Router (додаємо на кроці навігації)
- Стан / логіка: React hooks, пізніше — Zustand (за потреби)
- База даних: `expo-sqlite`
- Зображення: `expo-image-picker`, `expo-image`
- Збірка: Expo CLI, пізніше — development build / EAS
- IDE: Cursor
- Тестові пристрої: iOS Simulator, Samsung S25 Ultra (Expo Go)

## Шпаргалка React Native → Kotlin / Swift
| React Native            | Kotlin / Compose                 | Swift / SwiftUI                          |
|-------------------------|----------------------------------|------------------------------------------|
| Функціональний компонент | `@Composable` функція            | `struct ... : View` + `body`             |
| `useState`              | `remember { mutableStateOf() }`  | `@State`                                 |
| `useEffect`             | `LaunchedEffect`                 | `.onAppear` / `.task`                    |
| `FlatList`              | `LazyColumn`                     | `List` / `LazyVStack`                    |
| `style` / flexbox       | `Modifier`, `Column`/`Row`/`Box` | модифікатори, `VStack`/`HStack`/`ZStack` |
| Expo Router             | Navigation Compose               | `NavigationStack`                        |
| Zustand                 | `ViewModel` + `StateFlow`        | `@Observable` клас                       |
| `async/await`           | корутини, `suspend`              | `async/await`, `Task`                    |
| `expo-sqlite`           | Room                             | SwiftData                                |
| `package.json`, `app.json` | `build.gradle.kts`            | `.xcodeproj` + SPM                       |

## Бекенд numismat-server (спільний для Expo / Kotlin / Swift)
Навіщо: кнопки «цікаві факти» від різних AI-провайдерів (OpenAI, Groq, OpenRouter, …). Ключі цих API не можна
тримати в додатку → один сервіс-проксі на всі три клієнти. Також: промпт і список провайдерів змінюються без релізу
додатків, rate limit / логи / кеш — в одному місці. Gemini через Firebase AI Logic лишається окремим підходом «без свого сервера».
- Стек: Node 20+ + TypeScript + Hono, окремий репозиторій (не частина жодного додатку).
- Хостинг: Hetzner CX11 (1 vCPU, 2 GB RAM, Ubuntu), вже є nginx + сайт `tetiana-redko.com`.
 `inua.tetiana-redko.com` (DNS `A` → `116.203.220.233`, вже існував) → nginx + certbot (HTTPS) → `proxy_pass http://127.0.0.1:3000`
 (`proxy_read_timeout 60s`). Сервіс під `pm2` (`numismat-server`), порт 3000 назовні не відкривати.
 Задеплоєно: `https://inua.tetiana-redko.com/providers` працює.
- Ollama на CX11 не тягне (2 GB RAM) → відкриті моделі через Groq / OpenRouter (`:free`). OpenAI — платно (prepaid, від $5).
- Сервер stateless: клієнт щоразу шле всю історію `messages`, сервер додає системний промпт про монету.
- Захист: `Authorization: Bearer <токен>` + rate limit. Ключі провайдерів — лише в `.env` на сервері.
- Клієнти: Expo — `fetch`, Kotlin — Ktor Client / OkHttp, Swift — `URLSession` + `async/await`.

Контракт (чернетка):
```
GET  /providers → [{ id: "groq-gpt-oss", title: "GPT-OSS (Groq)" }, ...]
POST /chat      { provider, coin: Coin, messages: [{ role: "user" | "assistant", content }] } → { text }
```

## План
0. [x] Середовище: Node, Watchman, Xcode + iOS Simulator, Expo Go на S25 Ultra
1. [ ] (пропускаємо — TypeScript відомий)
2. [ ] Hello World на Expo, розбір структури проєкту
3. [ ] Основи: верстка, стилі, стан (лічильник) — порівняння з Compose / SwiftUI
4. [ ] Модель `Coin` + список монет із захардкодженими даними (`FlatList`)
5. [ ] Форма додавання монети, керовані інпути
6. [ ] Навігація (Expo Router): Список → Деталі → Додати
7. [ ] Винесення стану (context / Zustand)
8. [ ] `expo-sqlite`: збереження між запусками
9. [ ] Фото монет (камера/галерея)
10. [ ] Пошук, фільтри, статистика
11. [ ] AI «цікаві факти»: Gemini (Firebase AI Logic) ✓ → кнопка Groq через `numismat-server` ✓ → markdown → чат з контекстом → інші провайдери

## Поточний стан
Крок 2 — проєкт створено з шаблону `blank-typescript` (Expo SDK 57, RN 0.86), Hello World запущено
в iOS Simulator через Expo Go. Додано Expo Router з bottom tabs (Головна / Список / Інфо),
кожен таб — порожній екран з назвою. Розбір структури — по ходу.
Підключено Firestore. `countries` вантажаться при старті (`CountriesProvider`). Головна — випадкова країна,
її монети через `where`, одна випадкова монета показується як `CoinDetails`. «Список» — `Picker` країн
(`@expo/ui`) + `FlatList` з `CoinCard`, тап відкриває `coin/[id]` (Stack поверх табів; бере монету з `CoinsProvider`).
AI-кнопки в `CoinDetails` — масив `aiButtons` (`{ id, title, logo, ask }`), одна під одною, спільна відповідь.
Обидві працюють на S25 Ultra: «Запитати в Gemini» (Firebase AI Logic) і «Запитати в Groq»
(`numismat-server` → `https://inua.tetiana-redko.com/chat`, provider `groq-gpt-oss`).
Поки одна відповідь без чату, markdown не рендериться, сервер без авторизації.
Наступне — markdown у відповідях, чат з контекстом; на сервері — Bearer-токен, інші провайдери.

## Журнал (що вивчено / зроблено)
- Середовище: Node 24, npm 11, Watchman, Xcode встановлено.
- Мережа на робочому Mac: LAN-IP (VPN `utun4` і навіть Wi-Fi) блокується корпоративним клієнтом,
  `--localhost` слухає лише IPv6 `::1`, а Expo Go йде на IPv4. Рішення: `npm start` =
  `REACT_NATIVE_PACKAGER_HOSTNAME=127.0.0.1 expo start` (симулятор); для телефону — `npm run start:tunnel`.
- Expo Router: `main` = `expo-router/entry`, `scheme` в `app.json`, `index.ts`/`App.tsx` видалено.
  Роути у `src/app/`: `_layout.tsx` (`Tabs` + іконки Ionicons), `index.tsx`, `list.tsx`, `info.tsx`.
- Firebase JS SDK (Firestore, спільний проєкт `tetiana-redko` з `psychology`): конфіг у `.env.local`
 (`EXPO_PUBLIC_FIREBASE_*`), `src/lib/firebase.ts` (`db`), `src/lib/fetch-collection.ts` (`fetchCollection`),
 `src/providers/coins-provider.tsx` (context + `useCoins`), на Головній — `JSON.stringify` монет.
 Структура: плоска колекція `coins`, монета = документ з полем `country`; фото — Storage, в документі URL.
 У симуляторі на робочому Mac Firestore недоступний (мережа корпоративного клієнта), на S25 Ultra через tunnel — ок.
- Колекція `countries` (довідник для фільтра; при великій кількості монет — `where('country', '==', ...)` + пагінація).
- Навігація Stack + Tabs: корінь `src/app/_layout.tsx` = `Stack` (+ `CoinsProvider`), таби в групі `(tabs)/`,
 екран деталей `coin/[id].tsx` (`useLocalSearchParams`), перехід через `<Link href asChild>` + `Pressable`.
 `CoinCard` у `src/components/`, фото через `expo-image` (є в Expo Go).
- `countries/{id}` = `{ name_ua, name_en, flag }`, `coin.country` = id країни (`ua`, `us`).
 Фільтр: `fetchCoinsByCountry` (`query` + `where('country', '==', id)`), UI — універсальний `Picker`
 з `@expo/ui` (iOS — SwiftUI `Picker` menu, Android — Material 3 dropdown; є в Expo Go).
- Залежності: у lock-файлі був `react-dom@19.3.0` (потребує `react@^19.3`), через це `npm install` падав на ERESOLVE.
 Виправлено через `npx expo install react-dom` (19.2.3). `--legacy-peer-deps` не використовувати: він вичищає optional peers.
- `start:tunnel` періодично падає (`session closed` / `remote gone away`) — ngrok обриває старий агент 2.x з `@expo/ngrok`
 ([expo#43335](https://github.com/expo/expo/issues/43335)). Обхід: спершу `npm start`, потім `npm run start:tunnel`
 або просто повторити спробу; якщо перестане працювати — власний тунель (`cloudflared`) + `EXPO_PACKAGER_PROXY_URL`.
- Firebase AI Logic (`firebase/ai`, входить у `firebase`), ключ Gemini в додатку не потрібен.
 Gemini Developer API на Blaze = Prepay (429 «prepayment credits are depleted», $300 trial не діє) →
 перейшли на `AgentPlatformBackend('global')` (`VertexAIBackend` — deprecated) (Cloud Billing, тратить trial-кредити).
 `src/lib/ai.ts` — `startCoinChat(coin)` = `getGenerativeModel` з `systemInstruction` про монету + `startChat()`.
 Модель `gemini-3.5-flash-lite` (2.5 для нових проєктів недоступні).
 App Check для AI Logic був Enforced (401 «App Check token is invalid») → Security → App Check → AI Logic → Set up → Unenforced.
 З 2 листопада 2026 App Check для AI Logic стане обов'язковим → до того: debug token / `@react-native-firebase/app-check` (dev build) / Cloud Function.
- `numismat-server`, крок 1: каркас Hono + `@hono/node-server` (ESM, `tsx watch` для dev, `tsc` → `dist`),
 слухає `127.0.0.1:3000`, `GET /providers` — захардкоджений список. Далі: `POST /chat` (спершу Groq), `.env`, Bearer-токен.
- `numismat-server`, деплой на Hetzner: код у `/var/www/numismat-server` (`git clone` з GitHub `Shperung/numismat-server`).
 На сервері Node 20.9 → TypeScript 7 (`tsc` — ESM без розширення) не запускається → `typescript@5.9`.
 nginx: `default` має `server_name *.tetiana-redko.com` на 443 з сертифікатом лише `tetiana-redko.com` →
 будь-який піддомен без власного 443-блоку отримує чужий сертифікат (SSL-помилка).
 `certbot --nginx -d inua...` через цей wildcard записав сертифікат у `default` і зламав основний сайт → відкат з бекапу,
 у файлі `inua.tetiana-redko.com` 443-блок з `live/inua.tetiana-redko.com/` прописано вручну + редирект з 80.
 Для нових піддоменів: `certbot certonly --nginx -d <домен>` (без правки конфігів) + 443-блок вручну. Бекап: `/root/nginx.bak`.
 pm2: `tetiana-redko.com` (id 0) — основний сайт, не чіпати; команди лише за іменем, без `all`.
 Оновлення: `git pull && npm ci && npm run build && pm2 restart numismat-server`.
- `numismat-server`, `POST /chat`: провайдери в масиві `{ id, title, url, model, apiKey }` (усі OpenAI-сумісні, `fetch` без SDK),
 `/providers` віддає лише `id`/`title`. Системний промпт — той самий, що для Gemini. Помилка провайдера → лог + `502`.
 Groq: Llama тепер Enterprise («Contact Sales») → `openai/gpt-oss-120b` (Developer plan), id `groq-gpt-oss`.
 Ключ — `.env` (`GROQ_API_KEY`), читається `node --env-file=.env` (Node 20.6+, без `dotenv`).
 pm2 запускається з `--node-args="--env-file=.env"` (`restart` зберігає аргументи створення → змінити їх можна лише `delete` + `start`).
 Модель галюцинує факти про монети і відповідає з markdown (`**`) → в клієнтах рендерити markdown, промпт уточнити пізніше.
- Expo → `numismat-server`: `askServer(provider, coin, messages)` — `fetch` на `https://inua.tetiana-redko.com/chat`,
 URL константою (не секрет). Логотипи AI — локальні PNG у `assets/ai/` (`require`, `expo-image`).

---

# Правила Expo (згенеровано create-expo-app)

This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md
