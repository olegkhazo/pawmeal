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
