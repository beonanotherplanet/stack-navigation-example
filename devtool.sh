#!/usr/bin/env bash
#
# WebView DevTools Auto Launcher for Android Emulator
# - Requires adb & Google Chrome installed
# - WebView debugging must be enabled in the app
#

set -e

# Chrome path (adjust per OS)
CHROME_PATH_MAC="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
CHROME_PATH_LINUX="/usr/bin/google-chrome"
CHROME_PATH_WIN="/c/Program Files/Google/Chrome/Application/chrome.exe"

# Forward WebView debug port
echo "[info] Forwarding WebView DevTools port..."
adb forward tcp:9222 localabstract:webview_devtools_remote || {
  echo "[error] adb not found or device not connected."
  exit 1
}

# Wait for WebView to appear
echo "[info] Waiting for WebView to expose DevTools endpoint..."
for i in {1..20}; do
  if curl -s "http://localhost:9222/json/list" | grep -q "webSocketDebuggerUrl"; then
    break
  fi
  echo "  ...waiting ($i)"
  sleep 1
done

# Fetch DevTools URL
JSON=$(curl -s "http://localhost:9222/json/list")
if [[ -z "$JSON" ]]; then
  echo "[error] Could not fetch DevTools target list."
  exit 1
fi

URL=$(echo "$JSON" | grep -o 'ws://localhost:9222/devtools/page/[^"]*' | head -n 1)
if [[ -z "$URL" ]]; then
  echo "[error] No active WebView session found."
  echo "$JSON"
  exit 1
fi

# Build final inspector URL
INSPECTOR_URL="http://localhost:9222/devtools/inspector.html?ws=${URL#ws://}"

echo "[success] Found WebView DevTools endpoint:"
echo "  → $INSPECTOR_URL"

# Open Chrome DevTools window
if [[ -x "$CHROME_PATH_MAC" ]]; then
  "$CHROME_PATH_MAC" --app="$INSPECTOR_URL" &
elif [[ -x "$CHROME_PATH_LINUX" ]]; then
  "$CHROME_PATH_LINUX" --app="$INSPECTOR_URL" &
elif [[ -x "$CHROME_PATH_WIN" ]]; then
  "$CHROME_PATH_WIN" --app="$INSPECTOR_URL" &
else
  echo "[warn] Chrome not found. Please open manually:"
  echo "       $INSPECTOR_URL"
fi

echo "[done] DevTools launched (WebView remains open on emulator)."
