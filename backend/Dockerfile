FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY src ./src
# будем использовать tsconfig.build.json который без source map собирает и прочее 
COPY tsconfig*.json ./

COPY prisma ./prisma
RUN npx prisma generate

RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app

# При этом npm prune удаляет только зависимости, помеченные в devDependencies,
# но не убирает лишние файлы внутри уже установленных production-пакетов
# (например, директории test/, docs/, examples/, .ts-исходники, файлы конфигурации, кеши, бинарные артефакты и т. д.).
# К тому же, нередко production-пакеты имеют свои собственные dev-зависимости
# 795 мб против где-то 560

COPY --from=builder /app/dist ./dist

COPY package*.json ./
RUN npm ci --omit=dev

# да, второй раз делаем генерацию, вообще я думал сделать ее один раз и скопировать файлы,
# они лежат node_modules/.prisma
# но когда я их копировал, они получались типо пустыми, это странно, я так и не понял почему.
# еще я пытался хранить клиент призмы в src/generated, но там еще больше геморроя, почему-то .env начинает не видеть и все такое...
COPY prisma ./prisma
RUN npx prisma generate


ENV NODE_ENV=production
ENV PORT=3000
# еще обязательно env на DATABASE_URL нужна, но ей нет смысла задавать дефолтное значение
EXPOSE ${PORT}

CMD ["node", "dist/main.js"]
