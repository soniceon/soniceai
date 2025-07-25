#!/bin/bash

# 设置端口号
PORT=3000

# 查找并关闭占用端口的进程
echo "正在检查端口 $PORT 的占用情况..."
PID=$(lsof -i :$PORT -t)

if [ ! -z "$PID" ]; then
    echo "发现进程 $PID 正在使用端口 $PORT"
    kill -9 $PID
    echo "进程已终止"
else
    echo "端口 $PORT 未被占用"
fi

# 启动服务
echo "正在启动服务..."
npm start 