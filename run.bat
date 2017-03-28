@echo off
title run.bat
color 0a
:poczatek
cls
echo Select option
echo.
echo 1) Start Wexond
echo 2) Compile Wexond
echo 3) end
echo run.bat by vistafan12 :<
echo.
set /p opcja=:
if %opcja%==1 goto start
if %opcja%==2 goto compile
if %opcja%==3 exit
goto zly_wybor
:start
cls
npm start
pause
goto poczatek
:compile
cls
start cmd /k npm run browser
start cmd /k npm run applets
pause
goto poczatek
:zly_wybor
goto poczatek
