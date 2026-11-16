@echo off
title Push BookNest to GitHub with Personal Access Token
echo ====================================================================
echo  BookNest - GitHub Push Helper
echo ====================================================================
echo.
echo NOTE: GitHub requires a Personal Access Token (starts with ghp_).
echo If you don't have one yet, generate one in 30 seconds at:
echo https://github.com/settings/tokens/new?scopes=repo^&description=BookNest
echo.
set /p TOKEN="Paste your GitHub Personal Access Token here and press Enter: "
if "%TOKEN%"=="" (
    echo No token entered. Exiting.
    pause
    exit /b 1
)
echo.
echo Pushing to https://github.com/HAFIZ-HAASHIM/BookNest ...
git push https://%TOKEN%@github.com/HAFIZ-HAASHIM/BookNest.git main
echo.
if %ERRORLEVEL% EQU 0 (
    echo ====================================================================
    echo SUCCESS! BookNest repository successfully pushed to GitHub!
    echo View at: https://github.com/HAFIZ-HAASHIM/BookNest
    echo ====================================================================
) else (
    echo Push failed. Please check that the token has 'repo' permissions.
)
pause
