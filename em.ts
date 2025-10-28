#!/usr/bin/env node
/**
 * Android AVD Auto Setup (macOS M1/M2 + Windows 10)
 * - Detects or installs SDK automatically
 * - Supports both arm64 (Apple Silicon) and x86_64 (Windows)
 * - Automatically creates and launches Galaxy device AVDs
 * - 💡 Automatically installs Gradle + generates gradlew if missing
 * - ✅ Windows 호환성(경로/권한/파이프) 전면 교정
 */

import inquirer from "inquirer";
import { spawn, execSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  createWriteStream,
  writeFileSync,
  readdirSync,
  renameSync,
} from "node:fs";
import { homedir, tmpdir, platform, arch, release } from "node:os";
import { join } from "node:path";
import https from "node:https";

/* ────────────────────────────────────────────────
   System Info
──────────────────────────────────────────────── */
const isWindows = platform() === "win32";
const isMac = platform() === "darwin";
const isArm64 = arch() === "arm64";
const HOME = homedir();
const TMP = tmpdir();

const DEFAULT_SDK_PATH = isWindows
  ? join(HOME, "AppData", "Local", "Android", "Sdk")
  : join(HOME, "Library", "Android", "sdk");

const SDK_VERSION = "12266719";
const SDK_URL = isWindows
  ? `https://dl.google.com/android/repository/commandlinetools-win-${SDK_VERSION}_latest.zip`
  : `https://dl.google.com/android/repository/commandlinetools-mac-${SDK_VERSION}_latest.zip`;

/* ────────────────────────────────────────────────
   Device Profiles
──────────────────────────────────────────────── */
type DevicePreset = {
  name: string;
  api: string;
  res: { w: number; h: number; d: number };
  ram: number;
};

const DEVICE_PRESETS: Record<string, DevicePreset> = {
  "Galaxy Note10": {
    name: "Galaxy_Note10_API_30",
    api: "android-30",
    res: { w: 1080, h: 2280, d: 401 },
    ram: 8192,
  },
  "Galaxy Note20": {
    name: "Galaxy_Note20_API_30",
    api: "android-30",
    res: { w: 1080, h: 2400, d: 393 },
    ram: 8192,
  },
  "Galaxy S22": {
    name: "Galaxy_S22_API_30",
    api: "android-30",
    res: { w: 1080, h: 2340, d: 420 },
    ram: 8192,
  },
};

/* ────────────────────────────────────────────────
   Utilities
──────────────────────────────────────────────── */
function shQuote(p: string) {
  return p.includes(" ") ? `"${p}"` : p;
}

function run(cmd: string, args: string[] = [], opts: any = {}) {
  return new Promise<void>((res, rej) => {
    const p = spawn(cmd, args, { stdio: "inherit", shell: true, ...opts });
    p.on("exit", (code) =>
      code === 0 ? res() : rej(new Error(`${cmd} exited with code ${code}`))
    );
  });
}

function runWithInput(cmd: string, args: string[] = [], input = "") {
  return new Promise<void>((resolve, reject) => {
    const p = spawn(cmd, args, { shell: true });
    let stderr = "";
    p.stderr.on("data", (d) => (stderr += d.toString()));
    if (input) {
      p.stdin.write(input);
      p.stdin.end();
    }
    p.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} exited with code ${code}\n${stderr}`));
    });
  });
}

async function downloadFile(url: string, dest: string) {
  console.log(`[download] ${url}`);

  await new Promise<void>((res, rej) => {
    const file = createWriteStream(dest);

    function request(urlToFetch: string) {
      https
        .get(urlToFetch, (r) => {
          if (r.statusCode && r.statusCode >= 300 && r.statusCode < 400 && r.headers.location) {
            console.log(`↪ Redirecting to ${r.headers.location}`);
            r.resume();
            request(r.headers.location);
            return;
          }

          if (r.statusCode !== 200) {
            rej(new Error(`HTTP ${r.statusCode} for ${urlToFetch}`));
            return;
          }

          const total = parseInt(r.headers["content-length"] || "0", 10);
          let downloaded = 0;
          let lastPercent = 0;

          r.on("data", (chunk) => {
            downloaded += chunk.length;
            if (total > 0) {
              const percent = Math.floor((downloaded / total) * 100);
              if (percent !== lastPercent && percent % 2 === 0) {
                process.stdout.write(`\r📦 Downloading... ${percent}%`);
                lastPercent = percent;
              }
            }
          });

          r.pipe(file);
          file.on("finish", () => {
            console.log("\n✅ Download complete!");
            file.close();
            res();
          });
        })
        .on("error", rej);
    }

    request(url);
  });
}

function detectAndroidStudioSdk(): string | null {
  const studioPaths = isWindows
    ? [
        "C:\\Program Files\\Android\\Android Studio",
        "C:\\Program Files\\Android\\Android Studio\\jbr",
      ]
    : ["/Applications/Android Studio.app/Contents"];
  for (const base of studioPaths) {
    try {
      const subdirs = readdirSync(base, { withFileTypes: true });
      for (const d of subdirs) {
        if (d.name.toLowerCase().includes("sdk")) {
          const sdkPath = join(base, d.name);
          console.log(`✅ Found Android Studio SDK at: ${sdkPath}`);
          return sdkPath;
        }
      }
    } catch (_) {}
  }
  return null;
}

function ensureDir(p: string) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

function normalizeIniPath(p: string) {
  return p.replace(/\\/g, "/");
}

function getNodeMajor() {
  const v = process.versions.node.split(".")[0];
  return parseInt(v, 10);
}

/* ────────────────────────────────────────────────
   Java Check
──────────────────────────────────────────────── */
function ensureJava17OrLater() {
  try {
    execSync("java -version", { stdio: ["ignore", "pipe", "pipe"] });
  } catch {
    throw new Error(
      "Java가 필요합니다. JDK 17+를 설치하고 JAVA_HOME/PATH를 설정한 뒤 다시 실행하세요. (Adoptium Temurin 17 권장)"
    );
  }

  const text =
    execSync("java -version", { stdio: ["ignore", "pipe", "pipe"] })
      .toString()
      .trim() || "";

  const m = text.match(/version "(.*?)"/);
  if (m) {
    const ver = m[1];
    const major = parseInt(ver.split(".")[0], 10);
    if (Number.isFinite(major) && major < 17) {
      throw new Error(`Java ${ver} 감지됨. JDK 17+ 필요합니다. (현재: ${ver})`);
    }
  }
}

/* ────────────────────────────────────────────────
   SDK Setup (+ 정규화)
──────────────────────────────────────────────── */
async function ensureSdk(androidHome: string) {
  const toolsBase = join(androidHome, "cmdline-tools");
  const latestDir = join(toolsBase, "latest");
  const latestBin = join(latestDir, "bin");

  if (existsSync(latestBin)) {
    console.log("✔ Command-line tools already exist.");
    return;
  }

  ensureDir(toolsBase);
  const zip = join(TMP, "cmdtools.zip");
  await downloadFile(SDK_URL, zip);

  if (isWindows) {
    await run(
      "powershell",
      [
        "-NoProfile",
        "-ExecutionPolicy",
        "Bypass",
        "Expand-Archive",
        `-Path ${shQuote(zip)}`,
        `-DestinationPath ${shQuote(toolsBase)}`,
        "-Force",
      ],
      { windowsHide: true }
    );

    // 표준: cmdline-tools/cmdline-tools → cmdline-tools/latest
    const extracted = join(toolsBase, "cmdline-tools");
    ensureDir(latestDir);
    try {
      // 가장 많이 보이는 구조 교정
      if (existsSync(join(extracted, "bin"))) {
        renameSync(extracted, latestDir);
      }
    } catch {}

    // 보정: 여전히 latest/bin 없으면 Move-Item로 강제 정리
    if (!existsSync(latestBin) && existsSync(join(toolsBase, "cmdline-tools", "bin"))) {
      await run("powershell", [
        "-NoProfile","-ExecutionPolicy","Bypass",
        `New-Item -ItemType Directory -Force -Path ${shQuote(latestDir)} | Out-Null`,
      ], { windowsHide: true });

      await run("powershell", [
        "-NoProfile","-ExecutionPolicy","Bypass",
        `Move-Item -Force ${shQuote(join(toolsBase, "cmdline-tools", "*"))} ${shQuote(latestDir)}`,
      ], { windowsHide: true });

      await run("powershell", [
        "-NoProfile","-ExecutionPolicy","Bypass",
        `Remove-Item -Recurse -Force ${shQuote(join(toolsBase, "cmdline-tools"))}`,
      ], { windowsHide: true });
    }
  } else {
    await run("unzip", ["-o", zip, "-d", toolsBase]);
    try {
      renameSync(join(toolsBase, "cmdline-tools"), latestDir);
    } catch {}
  }

  console.log("✔ Installed/normalized command-line tools.");
}

/* ────────────────────────────────────────────────
   sdkmanager locator
──────────────────────────────────────────────── */
function findSdkmanager(androidHome: string) {
  const candidates = [
    join(androidHome, "cmdline-tools", "latest", "bin", isWindows ? "sdkmanager.bat" : "sdkmanager"),
    join(androidHome, "cmdline-tools", "bin", isWindows ? "sdkmanager.bat" : "sdkmanager"),
    join(androidHome, "tools", "bin", isWindows ? "sdkmanager.bat" : "sdkmanager"),
    join(androidHome, "cmdline-tools", "cmdline-tools", "bin", isWindows ? "sdkmanager.bat" : "sdkmanager"),
  ];
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  throw new Error(`sdkmanager(.bat) not found under ${androidHome}`);
}

/* ────────────────────────────────────────────────
   sdktool paths
──────────────────────────────────────────────── */
function getSdkTools(androidHome: string) {
  const sdkm = findSdkmanager(androidHome);
  const avdm = isWindows
    ? join(androidHome, "cmdline-tools", "latest", "bin", "avdmanager.bat")
    : join(androidHome, "cmdline-tools", "latest", "bin", "avdmanager");
  const emulatorCmd = isWindows
    ? join(androidHome, "emulator", "emulator.exe")
    : join(androidHome, "emulator", "emulator");
  const adb = isWindows
    ? join(androidHome, "platform-tools", "adb.exe")
    : join(androidHome, "platform-tools", "adb");
  return { sdkm, avdm, emulatorCmd, adb };
}

/* ────────────────────────────────────────────────
   Accept licenses (stdin 주입, 파이프 無)
──────────────────────────────────────────────── */
async function acceptLicenses(androidHome: string, sdkm: string) {
  console.log("📝 Accepting SDK licenses...");
  // 여러 프롬프트를 대비해 넉넉히 y 입력을 준비
  const MANY_Y = Array(50).fill("y").join("\n") + "\n";
  await runWithInput(shQuote(sdkm), [`--sdk_root=${shQuote(androidHome)}`, "--licenses"], MANY_Y);
}

/* ────────────────────────────────────────────────
   System Image Installer
──────────────────────────────────────────────── */
async function installPlatformTools(androidHome: string, api: string) {
  const { sdkm } = getSdkTools(androidHome);

  const abi = isWindows || !isArm64 ? "x86_64" : "arm64-v8a";
  const sysImg = "google_apis";
  const systemImagePath = `system-images;${api};${sysImg};${abi}`;

  console.log(`📦 Installing packages:
 - platform-tools
 - emulator
 - platforms;${api}
 - ${systemImagePath}
 - extras;intel;Hardware_Accelerated_Execution_Manager (best-effort)
 - extras;google;gdk (best-effort)
`);

  await run(shQuote(sdkm), [
    `--sdk_root=${shQuote(androidHome)}`,
    "platform-tools",
    "emulator",
    `platforms;${api}`,
    systemImagePath,
  ]);

  try {
    await run(shQuote(sdkm), [`--sdk_root=${shQuote(androidHome)}`, "extras;google;gdk"]);
  } catch {}

  try {
    await run(shQuote(sdkm), [
      `--sdk_root=${shQuote(androidHome)}`,
      "extras;intel;Hardware_Accelerated_Execution_Manager",
    ]);
  } catch {}

  return { sysImg, abi };
}

/* ────────────────────────────────────────────────
   AVD Creation
──────────────────────────────────────────────── */
async function createAvd(androidHome: string, preset: DevicePreset, sysImg: string, abi: string) {
  const { name, api, res, ram } = preset;
  const avdDir = join(HOME, ".android", "avd", `${name}.avd`);
  const { avdm } = getSdkTools(androidHome);

  if (existsSync(avdDir)) {
    console.log("✔ AVD already exists.");
  } else {
    console.log("🧩 Creating AVD (best-effort device profile)...");
    let created = false;
    try {
      await run(shQuote(avdm), [
        "create",
        "avd",
        "-n",
        shQuote(name),
        "-k",
        shQuote(`system-images;${api};${sysImg};${abi}`),
        "--device",
        "pixel_5",
        "--force",
      ]);
      created = true;
    } catch {
      console.log("ℹ️ 'pixel_5' profile missing. Retrying without --device...");
      await run(shQuote(avdm), [
        "create",
        "avd",
        "-n",
        shQuote(name),
        "-k",
        shQuote(`system-images;${api};${sysImg};${abi}`),
        "--force",
      ]);
      created = true;
    }
    if (!created) throw new Error("Failed to create AVD");
  }

  ensureDir(avdDir);
  const ini = [
    `AvdId=${name}`,
    `PlayStore.enabled=true`,
    `abi.type=${abi}`,
    `avd.ini.displayname=${name}`,
    `hw.cpu.arch=${abi.includes("arm") ? "arm64" : "x86_64"}`,
    `hw.cpu.model=qemu64`,
    `hw.lcd.density=${res.d}`,
    `hw.lcd.width=${res.w}`,
    `hw.lcd.height=${res.h}`,
    `hw.ramSize=${ram}`,
    `hw.cpu.ncore=8`,
    `hw.gpu.enabled=yes`,
    `hw.gpu.mode=host`,
    `skin.name=${res.w}x${res.h}`,
    `image.sysdir.1=${normalizeIniPath(
      join(androidHome, "system-images", api, sysImg, abi)
    )}/`,
    `tag.display=${sysImg}`,
  ].join("\n");

  writeFileSync(join(avdDir, "config.ini"), ini, "utf8");
  console.log(`✔ Created/updated AVD config for ${name}`);
}

/* ────────────────────────────────────────────────
   Emulator Launcher
──────────────────────────────────────────────── */
async function launchEmulator(androidHome: string, avdName: string) {
  console.log(`🚀 Launching emulator: ${avdName}...`);
  const { emulatorCmd } = getSdkTools(androidHome);

  if (!existsSync(emulatorCmd)) {
    throw new Error(`Emulator not found at: ${emulatorCmd}`);
  }

  const baseArgs = ["-avd", avdName, "-netdelay", "none", "-netspeed", "full"];
  const accelArgs = isMac
    ? ["-feature", "HVF", "-accel", "auto", "-gpu", "host"]
    : ["-accel", "on", "-gpu", "host"]; // Windows: WHPX/가상화 켜져 있어야 빠름

  const proc = spawn(shQuote(emulatorCmd), [...baseArgs, ...accelArgs], {
    stdio: "inherit",
    detached: true,
    shell: true,
  });

  proc.on("error", (err) => console.error("✖ Emulator failed:", (err as Error).message));
  console.log("✔ Emulator process started. Booting may take ~30s.");
}

/* ────────────────────────────────────────────────
   Helpers: Vite dev server probing
──────────────────────────────────────────────── */
async function ensureViteDevServer() {
  console.log("\n🧠 Checking Vite dev server (http://localhost:5173) ...");
  const nodeMajor = getNodeMajor();
  const canFetch = typeof fetch === "function";
  if (!canFetch && nodeMajor < 18) {
    console.log("ℹ️ Node 18+ 권장(내장 fetch 사용). 현재 환경에선 자동감지 없이 바로 실행합니다.");
  }

  let ok = false;
  if (canFetch) {
    try {
      const res = await fetch("http://localhost:5173");
      if (res.ok) ok = true;
    } catch {}
  }

  if (!ok) {
    console.log("⚙️ Starting Vite dev server...");
    spawn("npm", ["run", "dev"], {
      cwd: join(process.cwd(), "webview"),
      stdio: "inherit",
      shell: true,
      detached: true,
    });
    console.log("⏳ Waiting for Vite server to start...");
    await new Promise((res) => setTimeout(res, 7000));
  } else {
    console.log("✅ Vite dev server already running.");
  }
}

/* ────────────────────────────────────────────────
   Main Flow
──────────────────────────────────────────────── */
async function main() {
  console.log("\x1b[33m=== Android SDK Auto Detection ===\x1b[0m\n");

  if (isWindows) console.log(`ℹ️ Windows ${release()}`);

  ensureJava17OrLater();

  const detected = detectAndroidStudioSdk();
  const ANDROID_HOME =
    process.env.ANDROID_HOME ||
    process.env.ANDROID_SDK_ROOT ||
    detected ||
    DEFAULT_SDK_PATH;

  ensureDir(ANDROID_HOME);
  console.log(`📦 Using Android SDK path: ${ANDROID_HOME}`);
  await ensureSdk(ANDROID_HOME);

  const { sdkm } = getSdkTools(ANDROID_HOME);
  await acceptLicenses(ANDROID_HOME, sdkm);

  const { device } = await inquirer.prompt<{ device: keyof typeof DEVICE_PRESETS }>([
    {
      type: "list",
      name: "device",
      message: "Choose device to emulate:",
      choices: Object.keys(DEVICE_PRESETS),
    },
  ]);

  const preset = DEVICE_PRESETS[device];
  const { sysImg, abi } = await installPlatformTools(ANDROID_HOME, preset.api);

  await createAvd(ANDROID_HOME, preset, sysImg, abi);
  await launchEmulator(ANDROID_HOME, preset.name);

  console.log("\n✅ Setup complete and emulator launched!");

  await ensureViteDevServer();

  const apkPath = join(process.cwd(), "app-debug.apk");
  if (!existsSync(apkPath)) {
    console.error(`❌ APK not found at ${apkPath}`);
    process.exit(1);
  }

  const { adb } = getSdkTools(ANDROID_HOME);

  console.log("📱 Installing APK...");
  await run(shQuote(adb), ["install", "-r", shQuote(apkPath)]);

  console.log("\n🚀 Launching WebView app...");
  await run(shQuote(adb), [
    "shell",
    "am",
    "start",
    "-n",
    "com.ebview.android/.MainActivity",
  ]);

  console.log("\n🌐 Setting up Chrome remote debugging...");
  try {
    await run(shQuote(adb), ["forward", "tcp:9222", "localabstract:chrome_devtools_remote"]);
    await run(shQuote(adb), ["reverse", "tcp:5173", "tcp:5173"]);

    console.log("🧭 Opening Chrome debugger...");
    if (isWindows) {
      try {
        spawn("cmd", ["/c", "start", "chrome", "chrome://inspect/#devices"], {
          detached: true,
          windowsHide: true,
          shell: true,
        });
      } catch {}
      console.log("ℹ️ 자동으로 안 열리면 수동으로 chrome://inspect/#devices 를 여세요.");
    } else if (isMac) {
      try {
        spawn("open", ["-a", "Google Chrome", "chrome://inspect/#devices"], {
          detached: true,
          shell: true,
        });
      } catch {}
      console.log("ℹ️ 자동으로 안 열리면 수동으로 chrome://inspect/#devices 를 여세요.");
    }

    console.log("✅ Chrome DevTools ready. You can now inspect your WebView.");
  } catch (err: any) {
    console.error("⚠️ Failed to open Chrome DevTools:", err?.message ?? err);
    console.log("ℹ️ chrome://inspect/#devices 를 수동으로 열고, ADB 포워딩을 확인하세요.");
  }

  console.log("\n🎉 All steps completed! WebView should now show your Vite app.");
}

main().catch((e) => {
  console.error("✖ ERROR:", e.message);
  process.exit(1);
});
