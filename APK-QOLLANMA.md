# KOTIBAJON APK Qo'llanma — TWA (Trusted Web Activity)

## Talablar

- Node.js 18+ ✅
- Java JDK 17+ (Android build uchun)
- Android SDK (Bubblewrap o'rnatadi)

---

## 1-qadam — Bubblewrap o'rnatish

```bash
npm install -g @bubblewrap/cli
```

---

## 2-qadam — Bubblewrap init

```bash
mkdir kotibajon-apk
cd kotibajon-apk
bubblewrap init --manifest https://kotibajon.vercel.app/manifest.json
```

Savollarga javoblar:
```
Package ID:          uz.kotibajon.app
App name:            KOTIBAJON
Launcher name:       KOTIBAJON
Display:             standalone
Start URL:           https://kotibajon.vercel.app/dashboard
Orientation:         portrait
Status bar color:    #2563EB
Nav bar color:       #0F172A
Splash screen color: #0F172A
```

---

## 3-qadam — APK build

```bash
bubblewrap build
```

Natija: `app-release-signed.apk` fayli

---

## 4-qadam — SHA256 fingerprint olish

```bash
bubblewrap fingerprint add
```

Chiqadigan SHA256 ni `public/.well-known/assetlinks.json` ga qo'ying:

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "uz.kotibajon.app",
    "sha256_cert_fingerprints": ["SIZU:SHA256:BU:YERGA"]
  }
}]
```

Keyin Vercel'ga deploy qiling.

---

## 5-qadam — Qurilmada test

```bash
# USB bilan ulagan holda
adb install app-release-signed.apk
```

---

## 6-qadam — Play Store (ixtiyoriy)

1. https://play.google.com/console ga kiring
2. "Yangi ilova yarating"
3. `app-release-signed.apk` yuklang
4. Tavsif, skrinshot, kategoriya to'ldiring
5. "Ko'rib chiqishga yuborish"

**Narx:** $25 bir martalik Google Developer hisobi

---

## Ilovaning xususiyatlari

- ✅ Address bar yo'q (to'liq ekran)
- ✅ Vercel'da yangilanganda APK ham yangilanadi
- ✅ Offline rejim (service worker)
- ✅ Telefon ekraniga o'rnatish
- ✅ Splash screen
- ✅ Shortcut (Vazifalar, Moliya)
