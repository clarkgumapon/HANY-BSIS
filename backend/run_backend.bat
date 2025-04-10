@echo off
echo Starting HanyThrift Backend...
cd %~dp0
python -m uvicorn main:app --reload 