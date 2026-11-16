@echo off
title Push BookNest to GitHub
echo ==========================================================
echo Pushing BookNest to https://github.com/HAFIZ-HAASHIM/BookNest
echo ==========================================================
git push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo Successfully pushed to GitHub!
) else (
    echo Push encountered an issue. Please ensure you are logged into GitHub in your browser or Git Credential Manager.
)
pause
