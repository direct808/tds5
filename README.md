# TDS5 — Traffic Distribution System

Pet-проект, реализующий полноценную систему управления трафиком: кампании, потоки, маршрутизация по правилам (гео, устройство, IP), трекинг кликов и конверсий, аналитика. Разработан на **NestJS** + **React** с упором на **SOLID-принципы** и **production-подходы**.

## Стек технологий

### Backend

- **Node.js** / **TypeScript**
- **NestJS** — модульный backend-фреймворк
- **Prisma** — схема БД и миграции
- **Kysely** — типобезопасные SQL-запросы в репозиториях
- **PostgreSQL 17** — основная реляционная СУБД
- **Redis** — кэширование кампаний
- **Passport.js** — JWT-аутентификация
- **Prometheus** — сбор метрик
- **Swagger / OpenAPI** — документация API
- **Jest** — unit и e2e тесты
- **Docker / Docker Compose** — локальное окружение

### Frontend

- **React 19** + **TypeScript**
- **Vite 7** — сборщик
- **Material-UI (MUI) 7** — UI-компоненты
- **TanStack React Query 5** — серверное состояние
- **Zustand** — клиентское состояние
- **React Router 7** — маршрутизация
- **React Hook Form + Zod** — формы и валидация
- **i18next** — интернационализация
- **@hey-api/openapi-ts** — автогенерация API-клиента из Swagger

## Архитектура

### Слои backend

```
src/
├── domain/       # Доменные модули — вся бизнес-логика
├── infra/        # Инфраструктура (БД, Redis, конфиг, метрики, репозитории)
├── shared/       # Сквозная функциональность (фильтры, интерсепторы, адаптеры)
└── commands/     # CLI-команды (nest-commander)
```

### Доменные модули

| Модуль | Назначение |
|---|---|
| `auth` | JWT-аутентификация, guard-ы, декораторы |
| `campaign` | CRUD кампаний, потоки, правила маршрутизации |
| `campaign-cache` | Кэширование кампаний в Redis |
| `click` | Трекинг кликов, обработка потоков, стратегии схем |
| `conversion` | Регистрация конверсий через постбэки |
| `offer` | Управление оферами |
| `affiliate-network` | Партнёрские сети |
| `source` | Источники трафика |
| `domain` | Управление доменами с перехватом 404 |
| `report` | Аналитика, метрики, группировки |
| `geo-ip` | Определение местоположения по IP (mmdb-lib) |

### Ключевые архитектурные решения

- **Use-case паттерн** — контроллеры вызывают только use-cases; каждый use-case имеет единственный публичный метод `execute`
- **Repository Pattern** — весь доступ к данным через репозитории; сервисы не обращаются к Prisma/Kysely напрямую
- **Dual ORM** — Prisma для схемы и миграций, Kysely для типобезопасных запросов
- **Event-Driven** — NestJS EventEmitter для слабосвязанной обработки кликов
- **Request Context** — nestjs-cls для данных уровня запроса

## Основной функционал

- Создание и настройка кампаний с потоками и правилами маршрутизации
- Трекинг кликов с богатыми метаданными (гео, устройство, subid-ы, keyword-ы)
- Регистрация конверсий через постбэки
- Интеграция с партнёрскими сетями и оферами
- Управление источниками трафика
- Управление доменами с перехватом 404
- Аналитика и отчётность по кликам и конверсиям
- Сплит-тестирование через потоки

## Тестирование

- **Unit-тесты** для сервисов и use-cases
- **E2E-тесты** для бизнес-логики с реальной БД
- Конфиг unit-тестов: `jest.config.unit.ts`

## Установка и запуск

```bash
git clone https://github.com/direct808/tds5.git
cd tds5/apps/backend

# Скопировать переменные окружения
cp .env.example .env

# Поднять PostgreSQL и Redis
docker-compose up -d

# Установить зависимости
yarn install

# Применить миграции и сгенерировать клиенты
npm run prisma:migrate:deploy
npm run prisma:generate

# Запустить в режиме разработки
npm run start:dev
```

### Переменные окружения (`.env`)

```
PORT=3000
SECRET=your_secret
JWT_EXPIRES=7d
POSTBACK_KEY=your_key
DATABASE_URL=postgresql://user:pass@localhost:8432/tds5
REDIS_HOST=localhost
REDIS_PORT=6389
REDIS_PASSWORD=
REDIS_DB=0
```

## Структура проекта

```
tds5/
├── apps/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── domain/         # Доменные модули
│   │   │   ├── infra/          # Инфраструктура
│   │   │   ├── shared/         # Общие утилиты
│   │   │   ├── commands/       # CLI-команды
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── prisma/             # Схема и миграции
│   │   ├── generated/          # Сгенерированные Kysely-типы
│   │   ├── test/               # E2E-тесты
│   │   └── docker-compose.yml
│   └── frontend/               # React-приложение
└── README.md
```

## Почему этот проект важен

- Демонстрирует понимание backend-архитектуры: модульность, слои, use-case паттерн
- Нетривиальная бизнес-логика: маршрутизация трафика, трекинг, аналитика
- Production-подходы: типобезопасный SQL, кэширование, метрики, Swagger, e2e на реальной БД

## Связь

- Telegram: [@direct808](https://t.me/direct808)
- Email: [direct808@yandex.ru](mailto:direct808@yandex.ru)