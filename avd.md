| 항목    | Galaxy Note 10               | Galaxy Note 20               | Galaxy S22         |
| ----- | ---------------------------- | ---------------------------- | ------------------ |
| 출시 OS | Android 9 (Pie)              | Android 10                   | Android 12         |
| CPU   | Exynos 9825 / Snapdragon 855 | Exynos 990 / Snapdragon 865+ | Snapdragon 8 Gen 1 |
| RAM   | 8GB                          | 8GB                          | 8GB                |
| 해상도   | 2280x1080                    | 2400x1080                    | 2340x1080          |
| DPI   | 400                          | 420                          | 420                |
| 저장공간  | 256GB                        | 256GB                        | 256GB              |
| 화면크기  | 6.3"                         | 6.7"                         | 6.1"               |
| 비율    | 19:9                         | 20:9                         | 19.5:9             |



AvdId=Galaxy_Note10_256GB
hw.device.name=Galaxy Note 10
hw.cpu.ncore=8
hw.ramSize=8192
hw.gpu.enabled=yes
hw.gpu.mode=auto
hw.lcd.density=400
hw.lcd.width=1080
hw.lcd.height=2280
hw.screen.size=6.3
hw.storage.size=256GB
hw.accelerometer=yes
hw.gps=yes
hw.sensors.orientation=yes
hw.sensors.proximity=yes
image.sysdir.1=system-images;android-29;google_apis;x86_64
tag.id=google_apis
tag.display=Google APIs
abi.type=x86_64



AvdId=Galaxy_Note20_256GB
hw.device.name=Galaxy Note 20
hw.cpu.ncore=8
hw.ramSize=8192
hw.gpu.enabled=yes
hw.gpu.mode=auto
hw.lcd.density=420
hw.lcd.width=1080
hw.lcd.height=2400
hw.screen.size=6.7
hw.storage.size=256GB
hw.accelerometer=yes
hw.gps=yes
hw.sensors.orientation=yes
hw.sensors.proximity=yes
image.sysdir.1=system-images;android-30;google_apis;x86_64
tag.id=google_apis
tag.display=Google APIs
abi.type=x86_64



AvdId=Galaxy_S22_256GB
hw.device.name=Galaxy S22
hw.cpu.ncore=8
hw.ramSize=8192
hw.gpu.enabled=yes
hw.gpu.mode=auto
hw.lcd.density=420
hw.lcd.width=1080
hw.lcd.height=2340
hw.screen.size=6.1
hw.storage.size=256GB
hw.accelerometer=yes
hw.gps=yes
hw.sensors.orientation=yes
hw.sensors.proximity=yes
image.sysdir.1=system-images;android-32;google_apis;x86_64
tag.id=google_apis
tag.display=Google APIs
abi.type=x86_64



sdkmanager "system-images;android-30;google_apis_playstore;x86_64"
adb shell am start -a android.intent.action.VIEW -d "https://play.google.com/store/apps/details?id=com.google.android.webview"





