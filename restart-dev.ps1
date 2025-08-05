# 自动重启开发服务器脚本
# 关闭占用端口的进程并重启服务

Write-Host "正在检查端口占用情况..." -ForegroundColor Yellow

# 检查端口3001和3002的占用情况
$port3001 = netstat -ano | findstr :3001
$port3002 = netstat -ano | findstr :3002

if ($port3001) {
    Write-Host "发现端口3001被占用，正在终止进程..." -ForegroundColor Red
    $processId = ($port3001 -split '\s+')[4]
    taskkill /F /PID $processId
    Write-Host "已终止进程 $processId" -ForegroundColor Green
}

if ($port3002) {
    Write-Host "发现端口3002被占用，正在终止进程..." -ForegroundColor Red
    $processId = ($port3002 -split '\s+')[4]
    taskkill /F /PID $processId
    Write-Host "已终止进程 $processId" -ForegroundColor Green
}

Write-Host "等待端口释放..." -ForegroundColor Yellow
Start-Sleep 2

# 检查端口是否已释放
$check3001 = netstat -ano | findstr :3001
$check3002 = netstat -ano | findstr :3002

if (-not $check3001 -and -not $check3002) {
    Write-Host "端口已释放，正在启动开发服务器..." -ForegroundColor Green
    npm run dev
} else {
    Write-Host "端口仍然被占用，请手动检查" -ForegroundColor Red
} 