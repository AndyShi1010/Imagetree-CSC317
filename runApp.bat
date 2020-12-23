@echo off
cd %~dp0\application
call npm install
start "" "http://localhost:3000"
npm start