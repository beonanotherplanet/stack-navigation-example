#!/usr/bin/env bash

spinner() {
  local pid=$1
  local msg=$2
  local spin='⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏' # 유니코드 점 애니메이션
  local i=0
  tput civis  # 커서 숨김
  while kill -0 "$pid" 2>/dev/null; do
    i=$(( (i+1) %10 ))
    printf "\r%s %s" "${spin:$i:1}" "$msg"
    sleep 0.1
  done
  tput cnorm  # 커서 복원
  printf "\r✅ %s 완료!\n" "$msg"
}

# 예시: 어떤 작업을 백그라운드로 돌리면서 spinner 표시
(sleep 5) &  # 이게 실제 작업 (예: adb wait-for-device)
spinner $! "에뮬레이터 부팅 중"
