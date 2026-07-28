@echo off
cd /d "C:\Users\Kiran Teja\Downloads\medconnect\server"
set CORS_ORIGIN=http://localhost:5173
set PORT=5000
npx tsx src/index.ts
