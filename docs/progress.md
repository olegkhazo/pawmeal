# PawMeal — Progress Log

Spec of record: `.cursorrules.txt` (repo root). This log is updated after every stage with done / next / validation / blockers.

---

## Этап 0 — изучение

**Статус: done (2026-10-08)**

### Что сделано

- Прочитан целиком `.cursorrules.txt`.
- Проверен репозиторий: до старта работы в `C:\code\PawMeal` был только `.cursorrules.txt`, не было ни кода, ни `package.json`, ни git-репозитория (`git rev-parse --is-inside-work-tree` → "not a git repository").
- Проверено локальное окружение: Node v22.14.0, npm 11.1.0 — соответствует требованию "Node LTS" (Node 22 — активная LTS-линия на 2026 год).
- Изучены три референса (см. `docs/references.md` за подробностями и честной оценкой доступности):
  - foodforjoe.es — недоступен для автоматического чтения (вероятно client-rendered SPA); зафиксировано честно, работа продолжена по текстовому описанию из спеки.
  - differentdog.com — прочитан, структурные выводы записаны своими словами.
  - smalls.com — прочитан, структурные выводы записаны своими словами.
- Проверены актуальные стабильные версии ключевых зависимостей (октябрь 2026) через официальные источники/npm:

| Пакет | Версия на момент старта | Примечание |
|---|---|---|
| nuxt | 4.6.x | Nuxt 4, стабильный |
| @nuxtjs/i18n | 10.6.x | совместим с Nuxt 4.5+ |
| tailwindcss | 4.x | используем официальный `@tailwindcss/vite` плагин напрямую в `nuxt.config.ts`, а не `@nuxtjs/tailwindcss` — обёртка модуля под Tailwind v4 ещё в статусе beta (v7.0.0-beta.0), а Tailwind v4 сам по себе стабилен уже давно |
| zod | 4.6.x | |
| libphonenumber-js | 1.13.x | |
| pinia | latest 2.x/3.x на момент `npm install` | только для состояния quiz, по спеке — "при необходимости" |
| prisma / @prisma/client | 7.10.x | Prisma 8 — ещё release candidate на момент проверки, сознательно не используем до официального GA |
| vitest | 5.0.x | |
| @playwright/test | 1.63.x | |

Точные зафиксированные версии будут видны в `package.json`/lockfile после Этапа 1 — таблица выше фиксирует решение "на чём" стартуем, а не обещание точных патч-версий навечно.

### Решения (Decisions)

1. **Стек**: Nuxt 4 (Vue 3, TS strict) + Tailwind v4 через `@tailwindcss/vite` + `@nuxtjs/i18n` + Zod + libphonenumber-js + Nitro server routes + PostgreSQL + Prisma. Pinia добавим только если plain composable (`useQuiz`) окажется неудобным для cross-component state — попробуем сначала без Pinia и зафиксируем в Этапе 1, добавим ли её.
2. **Prisma 7**, не 8 — 8 на момент проверки RC, не подходит для "актуальные совместимые стабильные версии".
3. **Tailwind v4 без `@nuxtjs/tailwindcss`** — модуль ещё не в стабильном релизе под v4; прямой Vite-плагин — официально поддерживаемый путь и проще поддерживать.
4. Репозиторий **не был git-репозиторием** — инициализируем `git init` в Этапе 1, чтобы дальше делать маленькие понятные коммиты по этапам, как требует спека.
5. Бренд, цены, финальные рецептуры, реальные контакты оператора, производственные мощности — **конфигурационные плейсхолдеры** на всех этапах; ничего из этого не блокирует разработку (явно разрешено спекой, раздел 15).

### Unresolved / требует решения владельца до публичного запуска

- Нет реального `BUSINESS_WHATSAPP_NUMBER` / `BUSINESS_TELEGRAM_USERNAME` / `OPERATOR_CONTACT_EMAIL` — будут placeholder в `.env.example`, production не считается готовым с placeholder-ами (спека, раздел 13).
- Нет утверждённой ценовой экономики — `PRICE_TEST_ENABLED=false` по умолчанию (раздел 11).
- Нет готовых фотографий рецептов/hero — будут prompts + manifest + временные placeholder на Этапе 2/6 (раздел 6).
- Грузинский перевод будет сделан, но помечен как требующий вычитки носителем в launch checklist (раздел 10, 7).
- foodforjoe.es остаётся недоступным для автоматического анализа — если у владельца есть доступ/скриншоты, можно дополнить `docs/references.md` вручную.
- Юридические детали privacy (оператор, адрес, срок хранения) — настройка владельца, не придумываются (раздел 13).

### Validation

- `.cursorrules.txt` прочитан полностью, требования учтены в данном плане.
- Версии зависимостей проверены через поиск по официальным источникам (npm, nuxt.com, zod.dev, prisma.io) на дату 2026-10-08.
- Репозиторий и окружение проверены (`git rev-parse`, `node -v`, `npm -v`).

### Next

Переходим к Этапу 1 — foundation: инициализация git, Nuxt/TS/Tailwind/i18n, маршруты `/ka /ru /en`, шрифты (Noto Sans Georgian + Latin/Cyrillic fallback), общие компоненты-заглушки, `.env.example`, PostgreSQL через docker-compose + Prisma schema. Проверка: установка по lockfile, `npm run dev`, переключение ka/ru/en, `typecheck`/`build`.

---

## Этап 1 — foundation

**Статус: done (2026-10-08)**

### Что сделано

- Репозиторий инициализирован (`git init`), стартовый коммит Этапа 0 сделан отдельно.
- Nuxt 4.6.0 (Vue 3.5.43, vue-router 5.3.1) установлен через официальный `nuxi init` (template `minimal`), структура `app/` соответствует новому соглашению Nuxt 4 и прямо совпадает с требуемой в спеке структурой (`app/components`, `app/pages`, `app/layouts`).
- TypeScript strict включён (`typescript.strict: true` в `nuxt.config.ts`); `npm run typecheck` (`nuxt typecheck` → vue-tsc) проходит чисто.
- Tailwind CSS v4 подключён напрямую через `@tailwindcss/vite` (без `@nuxtjs/tailwindcss`, см. решение Этапа 0); базовые brand-токены (тёплый фон, графитовый текст, один зелёный акцент, границы) определены в `app/assets/css/main.css` через `@theme`, плюс `prefers-reduced-motion` guard.
- `@nuxtjs/i18n` (10.6.0) настроен на 3 локали `ka`/`ru`/`en`, `strategy: 'prefix'`, `detectBrowserLanguage: false`, `defaultLocale: 'ka'`; файлы переводов — `locales/ka.json`, `ru.json`, `en.json` (ключевая структура одинаковая, проверено unit-тестом). `restructureDir: '.'` даёт путь `locales/*` на корне проекта, как требует спека (раздел 14), а не вложенный `i18n/locales/*` по умолчанию модуля.
- Корень `/` редиректит на `/ka` через `routeRules` (302, без geo/IP-детекции). `html lang`/`dir`, `hreflang` (`ka`, `ka-GE`, `ru`, `ru-RU`, `en`, `en-US`, `x-default`) и `canonical` подключены через `useLocaleHead()` в `app/app.vue` — SEO-часть спеки (раздел 10) частично готова раньше срока, полный sitemap остаётся на Этап 6.
- Маршруты-заглушки: `app/pages/index.vue`, `quiz.vue`, `thank-you.vue`, `privacy.vue` — минимальный контент с явной пометкой "страница в разработке", без неподтверждённых заявлений; обязательная дисклеймер-фраза из раздела 1 спеки переведена на все три языка и выведена на главной и в футере.
- `app/error.vue` — локализованная страница 404/ошибки с хедером/футером; корректно возвращает статус 404 (проверено на собранном production-сервере).
- Шрифты: `@nuxt/fonts` с семействами "Noto Sans Georgian" (для `:lang(ka)`) и "Noto Sans" (для ru/en, покрывает кириллицу и латиницу), self-hosted через Google provider — загрузка подтверждена при `npm run build`.
- `.env.example` заполнен по списку из раздела 13 спеки; реальный `.env` создан локально для разработки (не коммитится) с данными, совпадающими с `docker-compose.yml`.
- `docker-compose.yml` — локальный PostgreSQL 16 (`pawmeal`/`pawmeal`/`pawmeal`).
- Prisma 7.10.0 + `@prisma/adapter-pg` + `pg`: Prisma ORM 7 убрал `url` из `datasource` в schema и требует обязательный driver adapter — конфигурация подключения вынесена в `prisma.config.ts` (`dotenv/config` + `env('DATABASE_URL')`), клиент генерируется в `./generated/prisma` (gitignored) через `npm run db:generate`. `prisma/schema.prisma` пока без моделей — `Lead`/`LeadActivity` по плану появятся на Этапе 4. Серверный singleton — `server/utils/prisma.ts`.
- Тесты и инструменты: Vitest 5 (`tests/unit/locales.spec.ts` — проверяет одинаковый набор ключей и отсутствие пустых строк в трёх locale-файлах), Playwright 1.64 настроен (`playwright.config.ts`, `tests/e2e/locales.spec.ts` — root redirect, lang по локали, переключатель языка, локализованный 404), ESLint через `@nuxt/eslint` (flat config). Скрипты `dev/build/preview/typecheck/lint/test/test:e2e` — все присутствуют в `package.json`, как того требует раздел 3 спеки, плюс `db:generate`/`db:migrate`.
- README.md переписан: точные команды установки/разработки/проверок/сборки, таблица env-переменных, список известных проблем окружения.

### Проверки (validation) — фактически выполненные

- `npm install` — успешно (с `EBADENGINE`-предупреждениями, см. ниже).
- `npm run typecheck` — чисто, без ошибок.
- `npm run lint` — чисто, без ошибок.
- `npm run test` (Vitest) — 2/2 теста проходят.
- `npm run build` — собирается успешно (client + server + Nitro).
- Ручная проверка собранного production-сервера (`node .output/server/index.mjs`) через curl:
  - `/` → 302 → `/ka`;
  - `/ka`, `/ru`, `/en` → 200, правильный `<html lang>` (`ka-GE`/`ru-RU`/`en-US`), правильный переведённый заголовок, корректные `hreflang`/`canonical`;
  - переключатель языка в хедере на обычных страницах формирует верные ссылки (`/ru`, `/en`, `/ka`);
  - `/ka/quiz`, `/ka/thank-you`, `/ka/privacy`, `/ru/quiz`, `/en/privacy` → 200;
  - несуществующий путь (`/ru/does-not-exist`) → 404 с локализованной страницой "не найдено" на нужном языке.
- `npm run test:e2e` (Playwright) — конфиг и спеки написаны и соответствуют проверенному вручную поведению, но сам прогон через Playwright browser runner в рамках Этапа 1 не выполнялся (см. unresolved); ручная curl-проверка покрывает тот же сценарий.

### Решения (Decisions)

1. **Nuxt 4.6.0 + `nuxi init` scaffold**, а не рукописная структура — меньше риска несовместимостей с актуальными соглашениями Nuxt 4.
2. **Обойти баг Nuxt 4.6.0 на Windows** ([nuxt/nuxt#36467](https://github.com/nuxt/nuxt/issues/36467), SSR 500 "Either manifest or precomputed data must be provided") через `nitro.externals.inline` в `nuxt.config.ts`. Без этого обхода ни одна SSR-страница не рендерилась (всегда 500) — баг подтверждён и воспроизведён в этом окружении, затем устранён этим воркэраундом. Нужно убрать воркэраунд, когда апстрим выпустит фикс.
3. **Prisma 7 требует `prisma.config.ts`** для connection string у Migrate (datasource `url` больше не живёт в `schema.prisma`) и обязательный driver adapter (`@prisma/adapter-pg`) для `PrismaClient` в коде — это breaking change в Prisma 7 относительно более старых версий, учтён в структуре проекта.
4. **`restructureDir: '.'`** в конфиге `@nuxtjs/i18n`, чтобы `locales/*.json` жили в корне проекта, как явно указано в спеке (раздел 14), а не в `i18n/locales/*` (новый дефолт модуля).
5. **`useLocaleHead()` подключён в Этапе 1**, а не отложен до Этапа 6 — даёт `lang`/`hreflang`/`canonical` почти бесплатно; полноценный sitemap и остальной SEO остаются по плану на Этапе 6.

### Unresolved / blockers

- **Node версия окружения ниже заявленных engine-требований**: часть пакетов (Nuxt 4.6, Nitro, Vite 8, несколько PostCSS-плагинов) требуют Node `^22.21.0 || ^24.11.0 || >=26.0.0`, в окружении установлен Node v22.14.0. Все команды (`dev`/`build`/`typecheck`/`lint`/`test`) фактически отработали корректно несмотря на предупреждения, но это не гарантия на будущее при обновлении зависимостей. Рекомендация: обновить Node минимум до 22.21+ при первой возможности; это выходит за рамки правок внутри репозитория (глобальное изменение окружения), поэтому не делалось автоматически.
- **`npm audit` показывает 20+ транзитивных уязвимостей** (high/critical) через `mysql2` (тянется Prisma CLI для мультидиалектной поддержки, которой мы не используем — только Postgres) и `node-forge`/`listhen` (dev-only HTTPS сертификаты у Nitro dev-сервера, не попадают в production bundle). `npm audit fix --force` предлагает откатить Nuxt до 3.7.4 и Prisma до 6.19.3 — это противоречит решению Этапа 0 использовать актуальные стабильные major-версии, поэтому не применено. Пересмотреть, если появится non-breaking фикс выше по дереву.
- **`npm run test:e2e` не был физически прогнан** в рамках этого этапа — установка браузерных бинарников Playwright не выполнялась, чтобы не тратить время/сеть этого шага; сценарии в `tests/e2e/locales.spec.ts` написаны и соответствуют вручную проверенному поведению через собранный production-сервер. Прогнать реальный `npm run test:e2e` — до начала Этапа 6 ("Unit и E2E"), а лучше раньше, при первой возможности.
- **Живое подключение к PostgreSQL не подтверждено.** Docker Desktop был запущен в рамках этого этапа, `docker info` на короткое время ответил успешно, но затем движок завис при инициализации (WSL2-бэкенд) — `docker info`/`docker ps`/`docker compose up -d`/`docker compose ps` зависали без ответа. По решению владельца проверка `docker compose up -d` + реальное подключение Prisma к БД отложена и не блокирует Этап 1 (Prisma Client генерируется без живой БД — это подтверждено). **Обязательно проверить `docker compose up -d` и `npm run db:migrate`/реальный коннект до начала Этапа 4**, когда появятся первые модели и реальная запись в БД станет частью приёмки.
- Переключатель языка на странице 404 (`app/error.vue`) рендерит ссылки без `href`, потому что `switchLocalePath()` не может вычислить путь без совпавшего маршрута — некритично (кнопка "на главную" работает), но стоит поправить при доработке 404 позже.
- Грузинский перевод (включая обязательную дисклеймер-фразу) сделан мной как не-носителем языка — требует вычитки носителем перед запуском (уже зафиксировано как общее требование в Этапе 0 и спеке, раздел 10).
