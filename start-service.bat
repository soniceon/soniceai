@echo off
setlocal

:: 设置端口号
set PORT=3000

:: 查找并关闭占用端口的进程
echo 正在检查端口 %PORT% 的占用情况...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%PORT%"') do (
    set PID=%%a
    if not "%%a"=="" (
        echo 发现进程 %%a 正在使用端口 %PORT%
        taskkill /F /PID %%a
        echo 进程已终止
    )
)

:: 构建项目
echo 正在构建项目...
call npm run build

:: 启动服务
echo 正在启动服务...
npm start 