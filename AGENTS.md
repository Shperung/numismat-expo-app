# Numismat — персональна колекція монет (Expo / React Native)

## Мета проєкту
Навчальний проєкт: зробити з нуля Expo-додаток для обліку особистої колекції монет.
Починаємо від Hello World і рухаємося малими кроками.
Паралельно той самий додаток робиться нативно (кроки плану синхронізовані між проєктами):
- Kotlin / Android: `/Users/viktor_kravchuk/traning/numismat-kotlin-app`
- Swift / iOS: `/Users/viktor_kravchuk/traning/numismat-swift-app`

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

## Поточний стан
Крок 2 — проєкт створено з шаблону `blank-typescript` (Expo SDK 57, RN 0.86), Hello World запущено
в iOS Simulator через Expo Go. Додано Expo Router з bottom tabs (Головна / Список / Інфо),
кожен таб — порожній екран з назвою. Розбір структури — по ходу.
Підключено Firestore: колекція `coins` читається через провайдер і виводиться на Головній як JSON.
Далі — тип `Coin` за реальними даними.

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
