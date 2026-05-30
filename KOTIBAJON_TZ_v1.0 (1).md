# KOTIBAJON
## Texnik Topshiriq (TZ) — Versiya 1.0

> **Hujjat holati:** Loyiha bosqichi · **Versiya:** 1.0 · **Yil:** 2025  
> **Tasnif:** Konfidentsial · Faqat loyiha ishtirokchilari uchun

---

## Mundarija

1. [Loyiha Haqida Umumiy Ma'lumot](#1-loyiha-haqida-umumiy-malumot)
2. [Muammo va Yechim](#2-muammo-va-yechim)
3. [Maqsadli Auditoriya](#3-maqsadli-auditoriya)
4. [Raqobat Tahlili](#4-raqobat-tahlili)
5. [Foydalanuvchi Sayohati (User Journey)](#5-foydalanuvchi-sayohati-user-journey)
6. [Funksional Talablar](#6-funksional-talablar)
7. [Texnik Arxitektura](#7-texnik-arxitektura)
8. [Ma'lumotlar Modeli](#8-malumotlar-modeli)
9. [API Dizayni](#9-api-dizayni)
10. [UI/UX Talablari](#10-uiux-talablari)
11. [Tashqi Integratsiyalar](#11-tashqi-integratsiyalar)
12. [Xavfsizlik Arxitekturasi](#12-xavfsizlik-arxitekturasi)
13. [Ishlash va Kengayish Talablari](#13-ishlash-va-kengayish-talablari)
14. [Offline Rejim va PWA](#14-offline-rejim-va-pwa)
15. [Lokalizatsiya va Accessibility](#15-lokalizatsiya-va-accessibility)
16. [Biznes Model va Monetizatsiya](#16-biznes-model-va-monetizatsiya)
17. [Loyiha Bosqichlari (Roadmap)](#17-loyiha-bosqichlari-roadmap)
18. [Jamoa Tarkibi va Mas'uliyat](#18-jamoa-tarkibi-va-masuliyat)
19. [Muvaffaqiyat Mezonlari (KPI)](#19-muvaffaqiyat-mezonlari-kpi)
20. [Risklarni Boshqarish](#20-risklarni-boshqarish)
21. [Qonuniy va Muvofiqlik Talablari](#21-qonuniy-va-muvofiqlik-talablari)
22. [Tasdiqlash va Imzolar](#22-tasdiqlash-va-imzolar)

---

## 1. Loyiha Haqida Umumiy Ma'lumot

### 1.1 Loyiha Pasporti

| Parametr | Qiymat |
|---|---|
| **Loyiha nomi** | KOTIBAJON |
| **To'liq nomi** | Kotibajon — Shaxsiy Raqamli Kotiba Platformasi |
| **Loyiha turi** | SaaS · Web + Mobile · Personal Productivity |
| **Platforma** | Web (React.js / Next.js), iOS va Android (React Native) |
| **Backend** | Node.js · PostgreSQL · Redis |
| **Maqsadli bozor** | O'zbekiston, Qozog'iston, Rossiya (MDH mintaqasi) |
| **TZ versiyasi** | v1.0 |
| **Hujjat holati** | Loyiha bosqichi |

### 1.2 Missiya

> *"Har bir foydalanuvchiga o'z vaqti, maqsadlari va resurslarini maksimal samarali boshqarish uchun aqlli, oddiy va ishonchli raqamli yordamchi taqdim etish."*

### 1.3 Vizyon

O'zbekiston va MDH mintaqasida **№1 shaxsiy samaradorlik platformasi** bo'lish — foydalanuvchi uchun nafaqat vazifa menejeri, balki hayot boshqaruvchi yordamchi.

### 1.4 Asosiy Tamoyillar

- **Simplicity first** — har qanday foydalanuvchi 30 soniyada ishlay boshlashi kerak
- **Reliability** — eslatma kelishi kafolatlanishi kerak, hech qachon o'tkazib yuborilmasligi
- **Privacy by design** — foydalanuvchi ma'lumotlari faqat unga tegishli
- **Offline-capable** — internet bo'lmasa ham asosiy funksiyalar ishlashi shart
- **Localization** — O'zbek tiliga va madaniyatiga to'liq moslashtirilgan

---

## 2. Muammo va Yechim

### 2.1 Asosiy Muammolar

| # | Muammo | Kimda kuzatiladi | Oqibat |
|---|---|---|---|
| 1 | Qilishi kerak bo'lgan ishlarni unutib qo'yish | Barcha segmentlar | Ish samaradorligi pasayadi |
| 2 | Kunlik xarajatlarni nazorat qilmaslik | Ishbilarmonlar, oilalar | Oylik byudjet oshib ketadi |
| 3 | Yillik maqsadlarni kuzatmaslik | Barcha segmentlar | Maqsadlar amalga oshmaydi |
| 4 | Muhim sanalarni o'tkazib yuborish | Oilalar, yoshlar | Ijtimoiy va moliyaviy zarar |
| 5 | Bir nechta ilovadan foydalanish | Barcha segmentlar | Vaqt va e'tibor tarqoq bo'ladi |
| 6 | Mahalliy tilga mos productivity ilova yo'qligi | O'zbekiston foydalanuvchilari | Chet el ilovalar noqulay |
| 7 | Eslatma ovozini o'zi tanlay olmaslik | Mobil foydalanuvchilar | Eslatmalar e'tiborga olinmaydi |

### 2.2 Yechim Matritsasi

```
Muammo                    →   KOTIBAJON Yechimi
──────────────────────────────────────────────────
Ishlarni unutish          →   Task Manager + Smart Reminders
Xarajat nazorati yo'qligi →   Finance Tracker + Byudjet ogohlantirishlari
Maqsad kuzatuvi yo'qligi  →   Goals Module + Oylik hisobot
Muhim sanalar             →   Important Dates + Erta eslatmalar
Ko'p ilovalar             →   Yagona all-in-one platforma
Til muammosi              →   O'zbek tili birinchi
Eslatma sifati            →   Ringtone + Push + SMS + Telegram
```

### 2.3 Noyob Farqlovchi Xususiyatlar (USP)

1. **O'zbek tiliga to'liq moslashtirilgan** — UI, UX, hisobotlar, bildirishnomalar
2. **Mahalliy SMS gateway** — Eskiz / Play Mobile orqali ishonchli eslatmalar
3. **Ringtone eslatma** — oddiy push notification emas, foydalanuvchi tanlagan ovoz
4. **Moliya + Vazifa = Bitta ekran** — boshqa ilovada yo'q kombinatsiya
5. **Tug'ilgan kun xarajat kuzatuvi** — O'zbekiston madaniyatiga xos funksiya
6. **Oylik avtomatik hisobot** — foydalanuvchi hech narsa qilmasa ham hisobot keladi

---

## 3. Maqsadli Auditoriya

### 3.1 Foydalanuvchi Segmentlari

| Segment | Yosh | Asosiy ehtiyoj | To'lov imkoniyati | Hajm (O'zbekiston) |
|---|---|---|---|---|
| Talabalar | 18–25 | Vaqt boshqaruvi, darslar | Past | ~2M |
| Yosh mutaxassislar | 25–35 | Deadline, moliya | O'rta | ~1.5M |
| Ishbilarmonlar | 30–50 | Mijozlar, to'lovlar | Yuqori | ~500K |
| Uy bekalari | 25–45 | Oilaviy rejalashtirish | O'rta | ~3M |
| Freelancerlar | 22–40 | Loyihalar, daromad | O'rta–Yuqori | ~200K |
| Rahbarlar | 35–55 | Kompleks boshqaruv | Yuqori | ~100K |

### 3.2 Boshlang'ich Maqsadli Segment (ICP)

**Ideal Mijoz Profili:**
- Yoshligi: 22–38 yosh
- Ish: Ofis xodimi, freelancer yoki talaba
- Qurilma: Asosan smartfon (Android), ba'zan noutbuk
- Muammo: Har kuni "unutib qo'ydim" deydi
- Motivatsiya: Tartibli va samarali bo'lishni xohlaydi
- To'lov: Oyiga 20,000–50,000 so'm to'lashga tayyor

### 3.3 Foydalanuvchi Personajlari

**Persona 1 — Sardor (talaba)**
> 21 yoshli Toshkent universiteti talabasi. 5 ta fan, 3 ta loyiha deadlini. Vazifalarini telefon eslatma qilib qo'yadi, lekin ular ko'p bo'lgach chalikib ketadi. Xarajatlarini hisoblamaydi.

**Persona 2 — Nilufar (uy bekasi)**
> 34 yoshli 2 farzandli ona. Oilaviy bayramlarni, maktab to'lovlarini, mahalla yig'imlarini boshqaradi. Har yili bolalar tug'ilgan kunini xarid uchun qancha sarflaganini bilmaydi.

**Persona 3 — Jasur (freelancer)**
> 29 yoshli grafik dizayner. Bir vaqtda 4–5 mijoz. Har oylik daromadi har xil. Qaysi loyihaga qancha vaqt sarflaganini va qanchadan daromad olganini aniq bilmaydi.

---

## 4. Raqobat Tahlili

### 4.1 To'g'ridan-to'g'ri Raqobatchilar

| Ilova | Kuchli tomonlari | Zaif tomonlari | KOTIBAJON ustunligi |
|---|---|---|---|
| **Notion** | Ko'p funksional, moslashuvchan | Murakkab, sekin, o'zbek tili yo'q | Oddiylik, mahalliy til, SMS |
| **Todoist** | Yaxshi UI, cross-platform | Moliya yo'q, O'zbek tili yo'q | Finance tracker, mahalliy |
| **Any.do** | Oddiy va tez | Chuqur funksional emas | Maqsadlar, hisobotlar, moliya |
| **Google Tasks** | Bepul, integratsiya | Juda oddiy, eslatma zaif | To'liq ekotizim |
| **TickTick** | Kalendar + Vazifa | Qimmat, til yo'q | Narx, til, SMS, mahalliy UX |

### 4.2 Bilvosita Raqobatchilar

- Oddiy telefon eslatmalari (built-in)
- Qog'oz kundalik / daftar
- Excel / Google Sheets (moliya uchun)
- Telegram guruh / kanal (shaxsiy eslatmalar)

### 4.3 Raqobat Xaritasi (2x2)

```
                    YUQORI FUNKSIONALLIK
                            ↑
               Notion ●     |      ● KOTIBAJON (maqsad)
                            |
  FAQAT        ─────────────┼─────────────  MAHALLIY
  GLOBAL                    |               BOZOR
               Google ●     |      ● [bo'sh zona]
               Tasks        |
                            ↓
                    PAST FUNKSIONALLIK
```

> KOTIBAJON bo'sh zonani egallaydi: **Yuqori funksional + Mahalliy bozorga moslashtirilgan**

---

## 5. Foydalanuvchi Sayohati (User Journey)

### 5.1 Yangi Foydalanuvchi Onboarding

```
1. Ilova yuklanadi
        ↓
2. Til tanlash (O'zbek / Rus / Ingliz)
        ↓
3. Ro'yxatdan o'tish (Google / Email / Telefon)
        ↓
4. Profil sozlash (ism, valyuta, vaqt zonasi)
        ↓
5. Qiziqishlar tanlash (Ish / O'qish / Oila / Moliya)
        ↓
6. Birinchi vazifa qo'shish (yo'naltirilgan)
        ↓
7. Birinchi eslatma sozlash
        ↓
8. Dashboard — tayyor!
```

### 5.2 Kunlik Foydalanuvchi Sayohati

```
Ertalab 07:00  →  Push keladi: "Bugungi 5 ta vazifangiz bor"
      ↓
Dashboardni ochadi → Bugungi ro'yxatni ko'radi
      ↓
Birinchi vazifani "Bajarildi" qiladi
      ↓
Tushlik vaqti → Xarajat kiritadi (tushlik — 35,000 so'm)
      ↓
Kechqurun 18:00 → "Ertaga ukangizning tug'ilgan kuni!" eslatmasi
      ↓
Kechqurun 22:00 → Oylik maqsad progressini ko'radi
      ↓
Uxlashdan oldin → Ertangi vazifalarni qo'shadi
```

---

## 6. Funksional Talablar

### 6.1 Autentifikatsiya va Profil

| ID | Funksiya | Prioritet | Sprint |
|---|---|---|---|
| AUTH-01 | Email + parol ro'yxatdan o'tish | Yuqori | 1 |
| AUTH-02 | Google OAuth 2.0 | Yuqori | 1 |
| AUTH-03 | Apple Sign In | O'rta | 3 |
| AUTH-04 | Telefon + SMS OTP | O'rta | 2 |
| AUTH-05 | Parolni email orqali tiklash | Yuqori | 1 |
| AUTH-06 | Profil tahrirlash (ism, rasm, til, valyuta, vaqt zonasi) | Yuqori | 1 |
| AUTH-07 | Ikki bosqichli autentifikatsiya (2FA) | O'rta | 4 |
| AUTH-08 | Sessiyalar boshqaruvi (qurilmalar ro'yxati) | O'rta | 4 |
| AUTH-09 | Hisobni o'chirish + GDPR ma'lumot eksporti | Past | 6 |

### 6.2 Vazifalar Moduli

| ID | Funksiya | Prioritet | Sprint |
|---|---|---|---|
| TASK-01 | Vazifa yaratish (sarlavha, tavsif, muddat) | Yuqori | 1 |
| TASK-02 | Vazifa holati: Bajarilmagan / Jarayonda / Bajarildi / Bekor qilingan | Yuqori | 1 |
| TASK-03 | Muhimlik darajasi: Low / Medium / High / Urgent | Yuqori | 1 |
| TASK-04 | Kategoriyalar (Ish, Shaxsiy, Oila, O'qish, Sog'liq, Moliya) | Yuqori | 1 |
| TASK-05 | Takrorlanuvchi vazifalar (kunlik, haftalik, oylik, yillik, maxsus) | Yuqori | 2 |
| TASK-06 | Subtask — kichik vazifalarga bo'lish | O'rta | 3 |
| TASK-07 | Fayl va rasm biriktirish (max 10MB) | O'rta | 4 |
| TASK-08 | Kalendar ko'rinishi (kunlik / haftalik / oylik) | Yuqori | 2 |
| TASK-09 | Kanban ko'rinishi (drag-and-drop) | O'rta | 3 |
| TASK-10 | Qidiruv va multifiltrlash | Yuqori | 2 |
| TASK-11 | Bulk amallar (ko'p tanlab o'chirish, ko'chirish) | O'rta | 3 |
| TASK-12 | Vazifani do'stga topshirish (delegation) | Past | 7 |
| TASK-13 | Vazifaga izoh qo'shish | O'rta | 3 |
| TASK-14 | Bajarilgan vazifalar arxivi (tarix) | O'rta | 3 |
| TASK-15 | Tezkor vazifa qo'shish (quick add — "/" shortcut) | O'rta | 4 |

### 6.3 Eslatmalar Moduli

| ID | Funksiya | Prioritet | Sprint |
|---|---|---|---|
| REM-01 | Belgilangan vaqtda push-notification | Yuqori | 1 |
| REM-02 | Ringtone eslatma — web va mobil | Yuqori | 1 |
| REM-03 | Foydalanuvchi o'z ringtone'ini yuklashi | O'rta | 4 |
| REM-04 | Snooze: 5 / 10 / 15 / 30 daqiqa / 1 soat | Yuqori | 2 |
| REM-05 | Email eslatma (ixtiyoriy) | O'rta | 3 |
| REM-06 | SMS eslatma — Eskiz / Play Mobile | O'rta | 3 |
| REM-07 | Telegram Bot eslatma | Yuqori | 3 |
| REM-08 | Joylashuv asosida eslatma (geo-reminder) | Past | 8 |
| REM-09 | Tinchlantirish rejimi (DND) sozlamalari | O'rta | 4 |
| REM-10 | Eslatma tarix jurnali | O'rta | 4 |
| REM-11 | "Erta eslatma" — muddat kelishidan N daqiqa/soat oldin | Yuqori | 2 |
| REM-12 | Eslatma yetkazilmasa qayta urinish mexanizmi | Yuqori | 3 |

### 6.4 Moliyaviy Modul

| ID | Funksiya | Prioritet | Sprint |
|---|---|---|---|
| FIN-01 | Kunlik xarajat kiritish (summa, kategoriya, izoh) | Yuqori | 2 |
| FIN-02 | Daromad kiritish | Yuqori | 2 |
| FIN-03 | Daromad / Xarajat balansi real vaqtda | Yuqori | 2 |
| FIN-04 | Kategoriyalar (Oziq-ovqat, Transport, Uy, Sog'liq, O'yin-kulgi, Sovg'alar, Boshqa) | Yuqori | 2 |
| FIN-05 | Maxsus kategoriya yaratish | O'rta | 3 |
| FIN-06 | Oylik byudjet belgilash | Yuqori | 2 |
| FIN-07 | Byudjet limitiga yaqinlashganda ogohlantirish (80%, 100%) | Yuqori | 2 |
| FIN-08 | Valyuta: UZS, USD, EUR, RUB (real kurs bilan) | Yuqori | 2 |
| FIN-09 | Takroriy to'lovlar (ijara, obuna, kredit) | O'rta | 4 |
| FIN-10 | Xarajat cheki rasmi yuklash | Past | 6 |
| FIN-11 | Oylik / yillik moliyaviy hisobot + grafik | Yuqori | 3 |
| FIN-12 | Excel / CSV eksport | O'rta | 5 |
| FIN-13 | Qarz kuzatuvi (bergan / olgan) | O'rta | 5 |
| FIN-14 | Tug'ilgan kun xarajat kategoriyasi (kimga, qancha) | O'rta | 4 |
| FIN-15 | Xarajat tahlili — AI tavsiya (v2) | Past | 9 |

### 6.5 Maqsadlar Moduli

| ID | Funksiya | Prioritet | Sprint |
|---|---|---|---|
| GOAL-01 | Maqsad yaratish (sarlavha, tavsif, kategoriya, muddat) | Yuqori | 3 |
| GOAL-02 | Progress foizda kuzatish | Yuqori | 3 |
| GOAL-03 | Milestonelar — kichik bosqichlarga bo'lish | Yuqori | 3 |
| GOAL-04 | Maqsadga vazifalarni bog'lash | O'rta | 4 |
| GOAL-05 | Oylik avtomatik hisobot | Yuqori | 4 |
| GOAL-06 | Kategoriyalar: Sog'liq, Moliya, Kasbiy, O'qish, Shaxsiy | O'rta | 3 |
| GOAL-07 | Streak kuzatuvi (ketma-ket kunlar) | O'rta | 5 |
| GOAL-08 | Yutuqlar (achievements/badges) tizimi | Past | 7 |
| GOAL-09 | Maqsadni do'stlar bilan ulashish (ixtiyoriy) | Past | 8 |
| GOAL-10 | Yillik maqsad ko'rinishi (overview) | Yuqori | 4 |

### 6.6 Muhim Sanalar Moduli

| ID | Funksiya | Prioritet | Sprint |
|---|---|---|---|
| DATE-01 | Tug'ilgan kunlarni saqlash (o'z va boshqalarniki) | Yuqori | 2 |
| DATE-02 | Tug'ilgan kunga qolgan kunlar hisoblagichi | Yuqori | 2 |
| DATE-03 | Har bir sana uchun xarajat yozuvi | O'rta | 4 |
| DATE-04 | Yillik muhim sanalar (to'ylik yillik, shartnomalar, imtihonlar) | O'rta | 3 |
| DATE-05 | Eslatma: 1 kun, 3 kun, 1 hafta, 1 oy oldin | Yuqori | 2 |
| DATE-06 | Sana takrorlanish turi (har yil, bir marta, maxsus) | O'rta | 3 |
| DATE-07 | Tabrik xabar shabloni (Telegram / WhatsApp / SMS) | Past | 6 |
| DATE-08 | Taqvim bilan integratsiya | O'rta | 5 |

### 6.7 Hisobotlar va Tahlil Moduli

| ID | Funksiya | Prioritet | Sprint |
|---|---|---|---|
| REP-01 | Haftalik samaradorlik hisoboti | Yuqori | 4 |
| REP-02 | Oylik moliyaviy hisobot | Yuqori | 4 |
| REP-03 | Maqsadlar bajarilish hisoboti | Yuqori | 4 |
| REP-04 | Foydalanuvchi faoliyati statistikasi | O'rta | 5 |
| REP-05 | PDF eksport | O'rta | 5 |
| REP-06 | Interaktiv grafiklar (pie, bar, line chart) | Yuqori | 4 |
| REP-07 | Solishtiruv: o'tgan oy vs joriy oy | O'rta | 5 |
| REP-08 | Yillik statistika ko'rinishi | O'rta | 6 |

### 6.8 Bildirishnomalar Markazi

| ID | Funksiya | Prioritet |
|---|---|---|
| NOTIF-01 | In-app bildirishnomalar markazi (notification center) | Yuqori |
| NOTIF-02 | Bildirishnomalar tarix jurnali (oxirgi 30 kun) | O'rta |
| NOTIF-03 | Bildirishnoma turlarini sozlash (on/off per tür) | Yuqori |
| NOTIF-04 | Ovoz va tebranish sozlamalari | O'rta |

---

## 7. Texnik Arxitektura

### 7.1 Umumiy Arxitektura

```
┌─────────────────────────────────────────────────────┐
│                   KOTIBAJON PLATFORMA                │
├──────────────┬───────────────────┬───────────────────┤
│  Web Client  │   Mobile Client   │   Admin Panel     │
│  (Next.js)   │  (React Native)   │   (React.js)      │
└──────┬───────┴─────────┬─────────┴────────┬──────────┘
       │                 │                  │
       └─────────────────▼──────────────────┘
                         │ HTTPS / REST API
              ┌──────────▼──────────┐
              │    API Gateway      │
              │  (Rate Limit, Auth) │
              └──────────┬──────────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  Auth        │ │  Core API    │ │  Notification│
│  Service     │ │  Service     │ │  Service     │
│  (JWT/OAuth) │ │  (CRUD)      │ │  (Queue)     │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       │                │                │
       └────────────────▼────────────────┘
                        │
           ┌────────────┼────────────┐
           ▼            ▼            ▼
    ┌──────────┐ ┌──────────┐ ┌──────────┐
    │PostgreSQL│ │  Redis   │ │  S3/     │
    │  (Main)  │ │ (Cache)  │ │  MinIO   │
    └──────────┘ └──────────┘ └──────────┘
```

### 7.2 Texnologiyalar Steki

| Qatlam | Texnologiya | Versiya | Izoh |
|---|---|---|---|
| **Web Frontend** | Next.js + TypeScript | 14+ | SSR, SEO, PWA |
| **Mobile** | React Native + Expo | SDK 51+ | iOS va Android |
| **State Management** | Zustand | Latest | Engil, tez |
| **UI Kit** | Tailwind CSS + shadcn/ui | Latest | Web uchun |
| **Mobile UI** | NativeWind + Tamagui | Latest | Mobile uchun |
| **Backend** | Node.js + Express.js | 20+ LTS | REST API |
| **ORM** | Prisma | Latest | Type-safe DB |
| **Asosiy MB** | PostgreSQL | 16+ | Relatsional |
| **Cache** | Redis | 7+ | Session, queue |
| **Message Queue** | Bull (Redis-based) | Latest | Eslatmalar navbati |
| **Push** | Firebase Cloud Messaging | Latest | Web + Mobile |
| **SMS** | Eskiz API / Play Mobile | — | O'zbekiston |
| **Email** | SendGrid / AWS SES | — | Tranzaksion email |
| **Fayl saqlash** | AWS S3 / MinIO | — | Rasmlar, fayllar |
| **Autentifikatsiya** | JWT + Passport.js | — | OAuth 2.0 |
| **Monitoring** | Sentry + Grafana | — | Xatolar + metrikalar |
| **CI/CD** | GitHub Actions | — | Avtomatik deploy |
| **Hosting** | DigitalOcean / Hetzner | — | Boshlang'ich bosqich |

### 7.3 Microservices Rejasi (V2 uchun)

```
V1: Monolith API (tezroq yaratish uchun)
V2: Microservices
    ├── auth-service
    ├── task-service
    ├── notification-service
    ├── finance-service
    ├── goals-service
    └── analytics-service
```

---

## 8. Ma'lumotlar Modeli

### 8.1 Asosiy Jadvallar (Entities)

```sql
-- Foydalanuvchilar
users
  id            UUID PRIMARY KEY
  email         VARCHAR UNIQUE
  phone         VARCHAR UNIQUE
  name          VARCHAR
  avatar_url    VARCHAR
  language      ENUM('uz', 'ru', 'en')
  currency      ENUM('UZS', 'USD', 'EUR', 'RUB')
  timezone      VARCHAR
  plan          ENUM('free', 'pro', 'premium', 'family')
  created_at    TIMESTAMP
  updated_at    TIMESTAMP

-- Kategoriyalar (foydalanuvchi yaratgan + tizim)
categories
  id            UUID PRIMARY KEY
  user_id       UUID REFERENCES users
  name          VARCHAR
  color         VARCHAR (hex)
  icon          VARCHAR
  type          ENUM('task', 'finance', 'goal')
  is_system     BOOLEAN

-- Vazifalar
tasks
  id            UUID PRIMARY KEY
  user_id       UUID REFERENCES users
  parent_id     UUID REFERENCES tasks (subtask uchun)
  title         VARCHAR(255)
  description   TEXT
  status        ENUM('todo', 'in_progress', 'done', 'cancelled')
  priority      ENUM('low', 'medium', 'high', 'urgent')
  category_id   UUID REFERENCES categories
  due_date      TIMESTAMP
  is_recurring  BOOLEAN
  recur_rule    JSONB (rrule format)
  completed_at  TIMESTAMP
  created_at    TIMESTAMP

-- Eslatmalar
reminders
  id            UUID PRIMARY KEY
  task_id       UUID REFERENCES tasks
  user_id       UUID REFERENCES users
  remind_at     TIMESTAMP
  channels      JSONB (['push', 'sms', 'email', 'telegram'])
  status        ENUM('pending', 'sent', 'failed', 'snoozed')
  snooze_until  TIMESTAMP
  ringtone      VARCHAR

-- Moliyaviy yozuvlar
transactions
  id            UUID PRIMARY KEY
  user_id       UUID REFERENCES users
  type          ENUM('income', 'expense')
  amount        DECIMAL(15,2)
  currency      VARCHAR
  category_id   UUID REFERENCES categories
  description   VARCHAR
  receipt_url   VARCHAR
  date          DATE
  is_recurring  BOOLEAN
  created_at    TIMESTAMP

-- Byudjetlar
budgets
  id            UUID PRIMARY KEY
  user_id       UUID REFERENCES users
  category_id   UUID REFERENCES categories
  amount        DECIMAL(15,2)
  period        ENUM('monthly', 'yearly')
  month         INTEGER
  year          INTEGER

-- Maqsadlar
goals
  id            UUID PRIMARY KEY
  user_id       UUID REFERENCES users
  title         VARCHAR(255)
  description   TEXT
  category_id   UUID REFERENCES categories
  target_value  DECIMAL
  current_value DECIMAL
  unit          VARCHAR (%, som, kun, ...)
  deadline      DATE
  status        ENUM('active', 'completed', 'paused', 'failed')
  created_at    TIMESTAMP

-- Muhim sanalar
important_dates
  id            UUID PRIMARY KEY
  user_id       UUID REFERENCES users
  title         VARCHAR(255)
  person_name   VARCHAR
  date          DATE
  type          ENUM('birthday', 'anniversary', 'payment', 'other')
  remind_days   INTEGER[] ([1, 3, 7, 30])
  notes         TEXT
```

---

## 9. API Dizayni

### 9.1 API Asoslari

```
Base URL:     https://api.kotibajon.uz/v1
Auth:         Bearer {JWT_TOKEN}
Content-Type: application/json
Rate Limit:   100 req/min (free), 1000 req/min (pro)
```

### 9.2 Asosiy Endpoint'lar

```
AUTENTIFIKATSIYA
  POST   /auth/register          - Ro'yxatdan o'tish
  POST   /auth/login             - Kirish
  POST   /auth/refresh           - Token yangilash
  POST   /auth/logout            - Chiqish
  POST   /auth/forgot-password   - Parol tiklash
  GET    /auth/me                - Joriy foydalanuvchi

VAZIFALAR
  GET    /tasks                  - Ro'yxat (filter, sort, paginate)
  POST   /tasks                  - Yaratish
  GET    /tasks/:id              - Bitta vazifa
  PATCH  /tasks/:id              - Yangilash
  DELETE /tasks/:id              - O'chirish
  PATCH  /tasks/:id/status       - Holat o'zgartirish
  GET    /tasks/today            - Bugungi vazifalar
  GET    /tasks/upcoming         - Yaqinlashayotgan vazifalar

ESLATMALAR
  GET    /reminders              - Ro'yxat
  POST   /reminders              - Yaratish
  PATCH  /reminders/:id/snooze   - Kechiktirish
  DELETE /reminders/:id          - O'chirish

MOLIYA
  GET    /transactions           - Ro'yxat (filter: type, category, date)
  POST   /transactions           - Yozuv qo'shish
  PATCH  /transactions/:id       - Tahrirlash
  DELETE /transactions/:id       - O'chirish
  GET    /transactions/summary   - Oy/yil balansi
  GET    /budgets                - Byudjetlar
  POST   /budgets                - Byudjet yaratish

MAQSADLAR
  GET    /goals                  - Ro'yxat
  POST   /goals                  - Yaratish
  PATCH  /goals/:id/progress     - Progress yangilash
  GET    /goals/:id/milestones   - Bosqichlar
  POST   /goals/:id/milestones   - Bosqich qo'shish

HISOBOTLAR
  GET    /reports/weekly         - Haftalik hisobot
  GET    /reports/monthly        - Oylik hisobot
  GET    /reports/finance        - Moliyaviy hisobot
  GET    /reports/goals          - Maqsadlar hisoboti

FOYDALANUVCHI
  GET    /users/profile          - Profil
  PATCH  /users/profile          - Profil tahrirlash
  POST   /users/avatar           - Rasm yuklash
  DELETE /users/account          - Hisob o'chirish
  GET    /users/export           - Ma'lumot eksporti (GDPR)
```

### 9.3 Standart Javob Formati

```json
// Muvaffaqiyat
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "total": 150,
    "per_page": 20
  }
}

// Xato
{
  "success": false,
  "error": {
    "code": "TASK_NOT_FOUND",
    "message": "Vazifa topilmadi",
    "details": null
  }
}
```

---

## 10. UI/UX Talablari

### 10.1 Dizayn Tizimi

| Parametr | Qiymat |
|---|---|
| **Dizayn tizimi** | Custom (Figma da yaratiladi) |
| **Asosiy rang** | `#1A3A5C` (to'q ko'k) |
| **Ikkilamchi rang** | `#F5A623` (oltin) |
| **Muvaffaqiyat** | `#27AE60` (yashil) |
| **Ogohlantirish** | `#F39C12` (sariq) |
| **Xato** | `#E74C3C` (qizil) |
| **Fon (light)** | `#F8FAFC` |
| **Fon (dark)** | `#0F1923` |
| **Tipografiya** | Inter (asosiy), Roboto Mono (raqamlar) |
| **Border radius** | 12px (kartlar), 8px (tugmalar), 50% (avatarlar) |
| **Shadow** | `0 2px 8px rgba(0,0,0,0.08)` |

### 10.2 Asosiy Ekranlar Ro'yxati

```
01. Splash Screen (brending)
02. Onboarding (3 ta slayd)
03. Ro'yxatdan o'tish / Kirish
04. Dashboard (bosh sahifa)
05. Vazifalar — ro'yxat ko'rinishi
06. Vazifalar — kalendar ko'rinishi
07. Vazifalar — kanban ko'rinishi
08. Vazifa yaratish / tahrirlash
09. Eslatmalar sozlamalari
10. Moliya — asosiy ekran
11. Moliya — xarajat / daromad qo'shish
12. Moliya — hisobot ekrani
13. Maqsadlar — ro'yxat
14. Maqsad — progress ko'rinishi
15. Muhim sanalar
16. Hisobotlar — haftalik
17. Hisobotlar — oylik
18. Sozlamalar
19. Profil
20. Bildirishnomalar markazi
```

### 10.3 Navigatsiya Strukturasi

```
Bottom Tab (Mobile):
  [🏠 Asosiy] [✅ Vazifalar] [💰 Moliya] [🎯 Maqsadlar] [👤 Profil]

Sidebar (Web):
  Dashboard | Vazifalar | Moliya | Maqsadlar | Sanalar | Hisobotlar | Sozlamalar
```

---

## 11. Tashqi Integratsiyalar

| Integratsiya | Maqsad | Prioritet | Sprint |
|---|---|---|---|
| **Firebase Cloud Messaging** | Push notification (web + mobil) | Yuqori | 1 |
| **Google OAuth** | Tez ro'yxat / kirish | Yuqori | 1 |
| **Apple Sign In** | iOS foydalanuvchilari | O'rta | 3 |
| **Eskiz API** | SMS O'zbekiston | O'rta | 3 |
| **Play Mobile** | SMS O'zbekiston (fallback) | O'rta | 3 |
| **SendGrid** | Tranzaksion emaillar | Yuqori | 2 |
| **Telegram Bot API** | Eslatmalar, hisobotlar | Yuqori | 3 |
| **Google Calendar API** | Vazifalar sinxronlash | O'rta | 5 |
| **Exchange Rate API** | Valyuta kurslari | O'rta | 2 |
| **AWS S3 / MinIO** | Fayl saqlash | Yuqori | 1 |
| **Sentry** | Xatolarni kuzatish | Yuqori | 1 |
| **Google Play / App Store** | Mobil tarqatish | Yuqori | 7 |

---

## 12. Xavfsizlik Arxitekturasi

### 12.1 Autentifikatsiya va Avtorizatsiya

```
- JWT Access Token:  15 daqiqa muddatli
- JWT Refresh Token: 30 kun muddatli, HttpOnly Cookie
- Parol hashing:     bcrypt (salt rounds = 12)
- OAuth state param: CSRF hujumidan himoya
- 2FA (v1.1):        TOTP (Google Authenticator)
```

### 12.2 API Xavfsizligi

```
- Rate Limiting:     IP: 100 req/min, User: 1000 req/min
- Helmet.js:         HTTP header himoyasi
- CORS:              Faqat ro'yxatdan o'tgan domenlar
- Input Validation:  Joi / Zod (barcha input'lar)
- SQL Injection:      Prisma ORM (parameterized queries)
- XSS:               DOMPurify (frontend), sanitize-html (backend)
- HTTPS:             Majburiy, HTTP → HTTPS redirect
```

### 12.3 Ma'lumotlar Xavfsizligi

```
- Ma'lumotlar bazasi:  Shifrlangan at-rest (AES-256)
- Tranzit:             TLS 1.3
- Backup:              Har kuni avtomatik, 30 kun saqlanadi
- PII ma'lumotlar:     Faqat zarurat bo'lganda log qilinadi
- GDPR:                Ma'lumot eksporti va o'chirish funksiyasi
```

---

## 13. Ishlash va Kengayish Talablari

### 13.1 Ishlash Mezonlari (Performance SLA)

| Ko'rsatkich | Maqsad | Kritik chegara |
|---|---|---|
| First Contentful Paint (FCP) | < 1.5s | < 3s |
| API javob vaqti (p95) | < 200ms | < 500ms |
| API javob vaqti (p99) | < 500ms | < 1s |
| Uptime (oylik) | 99.5% | 99% |
| Push notification yetkazish | < 5s | < 30s |
| MB query vaqti (oddiy) | < 50ms | < 200ms |

### 13.2 Kengayish Strategiyasi

```
Bosqich 1 (0–10K foydalanuvchi):
  - 1 server (4 vCPU, 8GB RAM)
  - Managed PostgreSQL
  - Managed Redis

Bosqich 2 (10K–100K foydalanuvchi):
  - Load balancer + 2–3 server
  - PostgreSQL replica (read/write split)
  - Redis cluster

Bosqich 3 (100K+ foydalanuvchi):
  - Kubernetes (auto-scaling)
  - PostgreSQL sharding
  - CDN (CloudFlare)
  - Microservices arxitekturaga o'tish
```

---

## 14. Offline Rejim va PWA

### 14.1 Progressive Web App (PWA)

- **Service Worker** — offline rejim, background sync
- **App Manifest** — uy ekraniga qo'shish imkoniyati
- **Push API** — web push notifications (browser orqali)
- **Cache Strategy** — asosiy ma'lumotlar mahalliy saqlash

### 14.2 Offline Imkoniyatlari

| Funksiya | Offline ishlaydi? |
|---|---|
| Vazifalarni ko'rish | ✅ Ha (cache) |
| Yangi vazifa qo'shish | ✅ Ha (sync queue) |
| Eslatmalarni ko'rish | ✅ Ha (cache) |
| Xarajat kiritish | ✅ Ha (sync queue) |
| Grafik va hisobotlar | ⚠️ Oxirgi cache |
| Yangi eslatma yaratish | ⚠️ Online kerak |

### 14.3 Sinxronizatsiya

```
Offline holatida:
  1. Amal lokal IndexedDB ga yoziladi
  2. "sync_queue" ga qo'shiladi
  
Internet kelganda:
  1. Queue tartib bilan serverga yuboriladi
  2. Konfliktlar "last-write-wins" bilan hal qilinadi
  3. Server ma'lumotlari yangilanadi
```

---

## 15. Lokalizatsiya va Accessibility

### 15.1 Tillar va Lokalizatsiya

| Til | Kod | Holat | Sprint |
|---|---|---|---|
| O'zbek (lotin) | uz-Latn | Asosiy til | 1 |
| O'zbek (kirill) | uz-Cyrl | Keng tarqalgan | 2 |
| Rus | ru | MDH bozori | 1 |
| Ingliz | en | Xalqaro | 1 |
| Qozog'iston (kaz) | kk | V2 | — |

**Lokalizatsiya o'z ichiga oladi:**
- UI matnlari (i18next)
- Sana va vaqt formatlari (dayjs + locale)
- Valyuta formatlari
- Raqam formatlari
- Haftaning boshlanishi (Dushanba — O'zbekiston uchun)

### 15.2 Accessibility (WCAG 2.1 AA)

- **Kontrast nisbati:** minimum 4.5:1 (matn uchun)
- **Klaviatura navigatsiyasi:** barcha elementlar klaviatura bilan ishlaydigan
- **Screen reader:** ARIA label'lar (axe-core audit)
- **Matn o'lchami:** foydalanuvchi kattalashtira oladi
- **Touch target:** minimum 44×44px (mobil uchun)
- **Rang ko'rish qiyinchiligi:** faqat rangga tayanmaslik

---

## 16. Biznes Model va Monetizatsiya

### 16.1 Tarif Rejalari

| | **Bepul** | **Pro** | **Premium** | **Oilaviy** |
|---|---|---|---|---|
| **Narx** | 0 so'm | 29,000/oy | 59,000/oy | 79,000/oy |
| **Yillik (20% chegirma)** | — | 278,400/yil | 566,400/yil | 758,400/yil |
| **Vazifalar** | 50/oy | Cheksiz | Cheksiz | Cheksiz |
| **Eslatmalar** | Push | Push + SMS + Telegram | Push + SMS + Email + Telegram | Barchasi |
| **Moliya moduli** | Asosiy | To'liq | To'liq + AI tahlil | To'liq |
| **Maqsadlar** | 3 ta | Cheksiz | Cheksiz | Cheksiz |
| **Hisobotlar** | — | Oylik | Oylik + Yillik + PDF | Barchasi |
| **Google Calendar** | — | — | ✅ | ✅ |
| **Foydalanuvchi soni** | 1 | 1 | 1 | 5 ta |
| **Fayl saqlash** | — | 1GB | 5GB | 10GB |

### 16.2 Qo'shimcha Daromad Manbalari

- **In-app sotib olish** — qo'shimcha ringtonelar paketi
- **White-label** — korxonalar uchun brendlangan versiya
- **API kirish** — uchinchi tomon integratsiyalar uchun (v3)
- **Premium shablonlar** — vazifa va maqsad shablonlari to'plami

### 16.3 Moliyaviy Prognoz

| Ko'rsatkich | 6-oy | 12-oy | 24-oy |
|---|---|---|---|
| Jami foydalanuvchilar | 5,000 | 50,000 | 300,000 |
| Pro+ foydalanuvchilar (10%) | 500 | 5,000 | 30,000 |
| Oylik daromad (MRR) | ~14.5M so'm | ~145M so'm | ~870M so'm |
| Yillik daromad (ARR) | ~174M so'm | ~1.74Mrd so'm | ~10.4Mrd so'm |

---

## 17. Loyiha Bosqichlari (Roadmap)

### Phase 1: Foundation (0–3 oy) — MVP

```
Sprint 1–2 (1-oy):
  ✓ Loyiha arxitekturasi va muhit sozlash
  ✓ Autentifikatsiya (email, Google OAuth)
  ✓ Asosiy vazifalar CRUD
  ✓ Push notification (FCM)
  ✓ Asosiy UI (dashboard, vazifalar ro'yxati)

Sprint 3–4 (2-oy):
  ✓ Eslatmalar (push + ringtone)
  ✓ Snooze funksiyasi
  ✓ Moliya moduli (asosiy — kirim/chiqim)
  ✓ Muhim sanalar (asosiy)
  ✓ Kalendar ko'rinishi

Sprint 5–6 (3-oy):
  ✓ Qidiruv va filtrlash
  ✓ Offline rejim (PWA)
  ✓ Xatolarni tuzatish va optimallashtirish
  ✓ Beta testing (50 foydalanuvchi)
  ✓ Landing page va onboarding
```

**Natija:** Beta versiya (Web) — 50 beta foydalanuvchi

---

### Phase 2: Growth (3–6 oy)

```
Sprint 7–8 (4-oy):
  ○ Maqsadlar moduli
  ○ Oylik hisobotlar
  ○ Byudjet belgilash va ogohlantirishlar
  ○ Telegram Bot integratsiyasi
  ○ SMS eslatmalar (Eskiz)

Sprint 9–10 (5-oy):
  ○ Grafik va tahlil (charts)
  ○ Takroriy vazifalar (full rrule)
  ○ Subtasklar
  ○ Kanban ko'rinishi
  ○ Dark mode

Sprint 11–12 (6-oy):
  ○ Pro tarif va to'lov tizimi (Click / Payme)
  ○ Foydalanuvchi onboardingi yaxshilash
  ○ A/B testing
  ○ 5,000 foydalanuvchiga erishish
```

**Natija:** Public v1.0 — Pro tarif ishga tushadi

---

### Phase 3: Scale (6–12 oy)

```
7-oy:  React Native mobil ilova (iOS + Android)
8-oy:  App Store va Google Play chiqarilishi
9-oy:  Google Calendar sinxronizatsiyasi
10-oy: Oilaviy tarif
11-oy: AI xarajat tahlili (v2)
12-oy: Kengaytirilgan analytics, API access
```

**Natija:** To'liq platforma — 50,000 foydalanuvchi

---

### Phase 4: Expansion (12–24 oy)

```
○ Qozog'iston va Rossiya bozori
○ Microservices arxitekturaga o'tish
○ White-label versiya
○ Jamoaviy / korporativ versiya
○ Open API
○ Hamkorlik dasturi (referral)
```

---

## 18. Jamoa Tarkibi va Mas'uliyat

### 18.1 Minimal Boshlang'ich Jamoa (MVP uchun)

| Lavozim | Soni | Asosiy mas'uliyat |
|---|---|---|
| Product Owner | 1 | Vizyon, prioritet, stakeholder boshqaruvi |
| Backend Developer | 1–2 | API, MB, server, integratsiyalar |
| Frontend Developer | 1 | Web ilova (Next.js) |
| UI/UX Designer | 1 | Dizayn tizimi, prototip, foydalanuvchi tadqiqoti |
| QA Engineer | 1 (part-time) | Test, bug tracking |
| DevOps (part-time) | 1 (part-time) | CI/CD, server, monitoring |

### 18.2 Kengaytirilgan Jamoa (v1.0 uchun)

| Qo'shimcha lavozim | Qachon kerak | Nima uchun |
|---|---|---|
| Mobile Developer | 5-oy | React Native ilova |
| Marketing Manager | 4-oy | Foydalanuvchi jalb qilish |
| Customer Support | 6-oy | Foydalanuvchi murojaat |
| Data Analyst | 8-oy | KPI kuzatuvi, qarorlar |

### 18.3 Aloqa va Boshqaruv

```
Vositalar:
  - Kod: GitHub (private repo)
  - Loyiha: Jira / Linear
  - Dizayn: Figma
  - Muloqot: Telegram guruh + Zoom haftalik uchrashuvlar
  - Hujjatlar: Notion

Jarayon:
  - Metodologiya: Scrum (2 haftalik sprint)
  - Har dushanba: sprint planning
  - Har juma: sprint review + retrospective
  - Kunlik: async stand-up (Telegram)
```

---

## 19. Muvaffaqiyat Mezonlari (KPI)

### 19.1 Mahsulot KPIlari

| Ko'rsatkich | 3-oy | 6-oy | 12-oy |
|---|---|---|---|
| Ro'yxatdan o'tganlar | 500 | 5,000 | 50,000 |
| Kunlik faol (DAU) | 100 | 800 | 8,000 |
| Oylik faol (MAU) | 300 | 3,000 | 30,000 |
| DAU/MAU (engagement) | 33% | 27% | 27% |
| D7 Retention | 40% | 45% | 50% |
| D30 Retention | 20% | 28% | 35% |
| Pro obunachilari | — | 500 | 5,000 |
| App Store reytingi | — | 4.0+ | 4.5+ |
| NPS (Net Promoter Score) | — | 30+ | 50+ |

### 19.2 Texnik KPIlar

| Ko'rsatkich | Maqsad |
|---|---|
| API uptime | ≥ 99.5% |
| FCP (web) | < 1.5s |
| Crash-free rate (mobil) | ≥ 99% |
| Bug resolution (critical) | < 24 soat |
| Push delivery rate | ≥ 98% |
| Deploy chastotasi | Haftasiga 2+ |

### 19.3 Moliyaviy KPIlar

| Ko'rsatkich | 6-oy | 12-oy |
|---|---|---|
| MRR | ~14.5M so'm | ~145M so'm |
| ARR | ~174M so'm | ~1.74Mrd so'm |
| CAC (foydalanuvchi jalb narxi) | < 10,000 so'm | < 8,000 so'm |
| LTV (foydalanuvchi hayot qiymati) | > 150,000 so'm | > 200,000 so'm |
| LTV/CAC nisbati | > 3x | > 5x |
| Churn rate (oylik) | < 8% | < 5% |

---

## 20. Risklarni Boshqarish

### 20.1 Risk Matritsasi

| Risk | Ehtimollik | Ta'sir darajasi | Risk bali | Oldini olish chorasi |
|---|---|---|---|---|
| Raqobatchilar (Notion, Todoist) jalb qilishi | Yuqori | O'rta | 🟡 O'rta | Mahalliy USP, til, SMS ustunligiga e'tibor |
| Asosiy ishlab chiquvchi chiqib ketishi | O'rta | Yuqori | 🔴 Yuqori | Hujjatlashtirish, ko'p bilimli jamoa, kod review |
| Server xavfsizligi buzilishi | Past | Yuqori | 🟡 O'rta | Penetration testing, audit, bug bounty |
| Push notification ishlamasligi | O'rta | Yuqori | 🔴 Yuqori | SMS + Telegram fallback mexanizmi |
| Foydalanuvchi ma'lumotlari yo'qolishi | Juda past | Kritik | 🔴 Yuqori | Kunlik backup, RAID, disaster recovery rejasi |
| Moliyaviy mablag' yetishmovchiligi | O'rta | Yuqori | 🔴 Yuqori | MVP ga asoslanish, grant/investor izlash |
| O'zbek foydalanuvchisi ilovani qabul qilmasligi | O'rta | Yuqori | 🔴 Yuqori | Beta testing, UX tadqiqoti, mahalliy fokus guruh |
| Play Mobile / Eskiz API ishlamay qolishi | O'rta | O'rta | 🟡 O'rta | Ikki SMS provider, email fallback |
| GDPR / qonuniy muammo | Past | O'rta | 🟢 Past | Yurist maslahati, Privacy Policy, ma'lumot minimizatsiyasi |
| Texnik qarz to'planishi | Yuqori | O'rta | 🟡 O'rta | Code review, refactoring sprintlari, standartlar |

### 20.2 Favqulodda Holat Rejalari

```
Scenario 1: Asosiy server ishlamay qoldi
  → Avto failover (DigitalOcean managed)
  → 15 daqiqada standby serverga o'tish
  → Foydalanuvchilarga status page orqali xabar

Scenario 2: Ma'lumotlar bazasi buzildi
  → Oxirgi backup (< 24 soat) tiklash
  → Maksimal 24 soat ma'lumot yo'qolishi (RPO)
  → Tiklash vaqti < 2 soat (RTO)

Scenario 3: SMS provider ishlamaydi
  → Avtomatik ikkinchi providerga o'tish
  → Email + Push + Telegram fallback
```

---

## 21. Qonuniy va Muvofiqlik Talablari

### 21.1 Talab Qilinadigan Hujjatlar

- [ ] **Foydalanuvchi shartnomasi** (Terms of Service)
- [ ] **Maxfiylik siyosati** (Privacy Policy) — GDPR va O'z qonuniga mos
- [ ] **Cookie siyosati**
- [ ] **Ma'lumotlarni qayta ishlash shartnomalari** (DPA)

### 21.2 Qonuniy Talablar

| Qonun / Standart | Tavsif | Mas'ul |
|---|---|---|
| O'zbekiston shaxsiy ma'lumotlar qonuni | 2019-yil qonuni, ma'lumotlarni saqlash | Yuridik bo'lim |
| GDPR (EU foydalanuvchilari uchun) | Ma'lumot eksporti, o'chirish huquqi | Backend + Yuridik |
| PCI DSS | To'lov kartasi ma'lumotlari (agar qo'shilsa) | Backend + Payment |
| App Store Review Guidelines | Apple shartlari | Mobile dev |
| Google Play Policy | Google shartlari | Mobile dev |

---

## 22. Tasdiqlash va Imzolar

Ushbu Texnik Topshiriq (TZ) loyiha boshlashdan oldin barcha mas'ul shaxslar tomonidan ko'rib chiqilishi va tasdiqlanishi shart.

| Lavozim | F.I.O. | Imzo | Tasdiqlash sanasi |
|---|---|---|---|
| Loyiha rahbari (Product Owner) | | | |
| Texnik direktor (CTO) | | | |
| UI/UX Dizayner | | | |
| Lead Backend Developer | | | |
| Lead Frontend Developer | | | |
| QA Lead | | | |

---

## Ilovalar

### A. Glossariy

| Atama | Ta'rif |
|---|---|
| **DAU** | Daily Active Users — kunlik faol foydalanuvchilar |
| **MAU** | Monthly Active Users — oylik faol foydalanuvchilar |
| **MRR** | Monthly Recurring Revenue — oylik takroriy daromad |
| **ARR** | Annual Recurring Revenue — yillik takroriy daromad |
| **CAC** | Customer Acquisition Cost — foydalanuvchi jalb qilish narxi |
| **LTV** | Lifetime Value — foydalanuvchi hayot qiymati |
| **NPS** | Net Promoter Score — tavsiya ko'rsatkichi |
| **PWA** | Progressive Web App — ilovaviy veb-ilova |
| **FCM** | Firebase Cloud Messaging — push notification xizmati |
| **SSR** | Server-Side Rendering — server tomonida render |
| **ORM** | Object-Relational Mapping — MB abstraktsiya qatlami |
| **JWT** | JSON Web Token — autentifikatsiya tokeni |
| **GDPR** | General Data Protection Regulation — Yevropa ma'lumot himoyasi |
| **SLA** | Service Level Agreement — xizmat darajasi shartnomasi |
| **RPO** | Recovery Point Objective — ma'lumot yo'qolishi maqbul chegarasi |
| **RTO** | Recovery Time Objective — tiklash vaqti maqsadi |

### B. Havola Qilinadigan Standartlar

- REST API dizayni: [jsonapi.org](https://jsonapi.org)
- Xavfsizlik: OWASP Top 10
- Accessibility: WCAG 2.1
- Qidiruv (SEO): Google Core Web Vitals
- Mobil: Apple HIG, Material Design 3

---

*KOTIBAJON — Texnik Topshiriq v1.0*  
*Barcha huquqlar himoyalangan © 2025 KOTIBAJON*  
*Konfidentsial hujjat — tashqariga chiqarilmaydi*
