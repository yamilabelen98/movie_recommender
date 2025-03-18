#!/usr/bin/env bash

echo "🛠 Instalando dependencias del sistema..."
apt-get update && apt-get install -y \
    build-essential \
    gcc \
    g++ \
    python3-dev \
    libatlas-base-dev \
    libffi-dev \
    libssl-dev

echo "📦 Instalando paquetes de Python..."
pip install --upgrade pip
pip install -r backend/requirements.txt
