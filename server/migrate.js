const { exec } = require('child_process');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = String(process.env.DB_PASSWORD || ''); // Преобразуем в строку
const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_PORT = process.env.DB_PORT || '5432';
const DB_DATABASE = process.env.DB_DATABASE || 'stepanbd';

// Кодируем пароль для URL
const encodedPassword = encodeURIComponent(DB_PASSWORD);
const DATABASE_URL = `postgres://${DB_USER}:${encodedPassword}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;

console.log('🔄 Запуск миграций...');
console.log(`📦 База: ${DB_DATABASE} на ${DB_HOST}:${DB_PORT}`);

// Используем переменные окружения отдельно
const command = `npx node-pg-migrate -m server/migrations up --databaseUrl "${DATABASE_URL}"`;

exec(command, { env: { ...process.env, DATABASE_URL } }, (error, stdout, stderr) => {
    if (error) {
        console.error('❌ Ошибка миграций:', error.message);
        console.error(stderr);
        return;
    }
    console.log(stdout);
    console.log('✅ Миграции завершены');
});