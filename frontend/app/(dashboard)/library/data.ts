export type BookCat = 'odatlar' | 'moliya' | 'psixologiya' | 'biznes' | 'falsafa' | 'motivatsiya'

export interface Chapter {
  title   : string
  pages   : number
  content : string    // Markdown-lite: **bold**, • bullet
  quote   ?: string
}

export interface Book {
  id          : string
  title       : string
  subtitle   ?: string
  originalTitle?: string
  author      : string
  year        : number
  pages       : number
  rating      : number
  category    : BookCat
  tags        : string[]
  readTime    : string
  coverGradient: [string, string]   // [top, bottom]
  spineColor  : string
  textColor   : string              // light or dark
  summary     : string
  chapters    : Chapter[]
}

export const CATEGORY_META: Record<BookCat, { label: string; color: string; icon: string }> = {
  odatlar     : { label: 'Odatlar',      color: '#F97316', icon: '🔥' },
  moliya      : { label: 'Moliya',       color: '#10B981', icon: '💰' },
  psixologiya : { label: 'Psixologiya',  color: '#8B5CF6', icon: '🧠' },
  biznes      : { label: 'Biznes',       color: '#3B82F6', icon: '💼' },
  falsafa     : { label: 'Falsafa',      color: '#6B7280', icon: '🌿' },
  motivatsiya : { label: 'Motivatsiya',  color: '#EF4444', icon: '⚡' },
}

export const BOOKS: Book[] = [
  /* ── 1. Atom Odatlar ─────────────────────────────────────────── */
  {
    id: 'atomic-habits',
    title: 'Atom Odatlar',
    subtitle: 'Kichik o\'zgarishlar katta natijalar beradi',
    originalTitle: 'Atomic Habits',
    author: 'James Clear',
    year: 2018,
    pages: 320,
    rating: 4.9,
    category: 'odatlar',
    tags: ['odat', 'produktivlik', 'psixologiya', 'o\'zgarish'],
    readTime: '8 soat',
    coverGradient: ['#FF6B35', '#FF8C42'],
    spineColor: '#CC4B1B',
    textColor: '#fff',
    summary: 'Har kun 1% yaxshilanish bir yilga borib 37 martaga ko\'payadi. James Clear kichik odatlar orqali hayotni tubdan o\'zgartirish metodikasini taqdim etadi.',
    chapters: [
      {
        title: 'Kichik O\'zgarishlarning Kuchli Ta\'siri',
        pages: 20,
        quote: '«Maqsad natijaga emas, tizimga qaratilishi kerak.»',
        content: `**Asosiy g'oya:** 1% kundalik yaxshilanish bir yilga borib 37.78 marta ko'payadi. 1% kundalik yomonlashuv esa deyarli nolga olib keladi.

**O'tish nuqtasi (Plateau of Latent Potential):**
• Yangi odat bir zumda natija bermaydi
• Ko'p harakatlar "Taqdirning platosi"da ko'rinmas bo'lib qoladi
• Kritik chegarani oshgach — keskin o'sish boshlanadi

**Tizim vs Maqsad:**
• Maqsad: siz erishmoqchi bo'lgan natija
• Tizim: o'sha natijaga olib keladigan jarayonlar
• **Maqsadga erishgan va erishmaganlar bir xil maqsad qo'yadi. Farq — tizimda.**

**Amaliy topshiriq:**
Bitta kichik odat tanlang va uni "2 daqiqa versiyasi"ga keltiring.`,
      },
      {
        title: 'Odatlar Qanday Ishlaydi — 4 Qonun',
        pages: 24,
        quote: '«Birinchi marta biror ish qilish — saylov. Ikkinchi marta — takliforma. Uchinchi marta — tasdiqlash.»',
        content: `**Odat sikli (Habit Loop):**
• **Ishorа (Cue)** → harakatni boshlantiruvchi signal
• **Istak (Craving)** → harakatga undovchi motivatsiya
• **Javob (Response)** → odat o'zi (fikr yoki harakat)
• **Mukofot (Reward)** → ishtahani qondiruvchi natija

**4 Qonun — yaxshi odat qo'shish:**
1. **Ko'rinarliroq qil** — ishora aniq bo'lsin (telefon ko'zga ko'rinarli joyda)
2. **Jozibali qil** — orzu qilingan narsa bilan bog'la
3. **Osonlashdir** — eng kam qarshilik yo'li
4. **Qanoatbaxsh qil** — darhol mukofot ber

**Teskari qonun — yomon odatni yo'qotish:**
1. Ko'rinmas qil
2. Jozibadorligini kamay
3. Qiyinlashtir
4. Qanoatsizlantir`,
      },
      {
        title: 'Kimligingizga Asoslangan Odatlar',
        pages: 18,
        quote: '«Eng kuchli motivatsiya — "men shu odamman" degan hissiyot.»',
        content: `**3 Daraja:**
• 1-daraja: Natija (nima olaman?)
• 2-daraja: Jarayon (nima qilaman?)
• 3-daraja: **Shaxsiyat (kim bo'laman?)** ← ENG MUHIMI

**Misol:**
• "Chekishni tashlamoqchiman" (natija) — zaif
• "Men chekmaydigan odamman" (shaxsiyat) — kuchli

**Shaxsiyat odatlar orqali shakllanadi:**
1. Harakat qil
2. Isbotni yig'
3. Shaxsiyatingni yangilab bor

**Amaliy savol:**
"Men qanday odam bo'lishni xohlayman?" — bu savoldan keyin har bir qaroringizni shu shaxsiyat nuqtai nazaridan baholang.`,
      },
      {
        title: 'Muhitni Loyihalash — Ko\'rinmas Arxitektura',
        pages: 22,
        content: `**Muhit = Eng kuchli odat yaratuvchi vosita**

Kurt Lewin formulasi: Xulq-atvor = Shaxs + Muhit

**Ko'rinishi kerak:**
• Kitob o'qimoqchisiz? Kitobni yostiqning yoniga qo'ying
• Vitamin ichmoqchisiz? Oshxona stolida ko'rinarli joyda qoldiring
• Mashq qilmoqchisiz? Kechasi sport kiyimingizni tayyorlab qo'ying

**Kontekst muhimligi:**
• Har bir joy ma'lum bir odatlar bilan bog'liq
• Ish stoli = ish, divan = dam olish, to'shak = uxlash
• Yangi odatlar uchun yangi joy tanlang

**"Bir joy — bir harakat" qoidasi**`,
      },
    ],
  },

  /* ── 2. Boy Ota, Kambag'al Ota ──────────────────────────────── */
  {
    id: 'rich-dad',
    title: 'Boy Ota, Kambag\'al Ota',
    originalTitle: 'Rich Dad Poor Dad',
    author: 'Robert T. Kiyosaki',
    year: 1997,
    pages: 336,
    rating: 4.7,
    category: 'moliya',
    tags: ['moliya', 'investitsiya', 'boylik', 'ta\'lim'],
    readTime: '7 soat',
    coverGradient: ['#F59E0B', '#D97706'],
    spineColor: '#92400E',
    textColor: '#fff',
    summary: 'Pul haqida maktabda o\'rgatilmagan eng muhim saboqlar. Aktivlar va passivlar orasidagi farq hayotni tubdan o\'zgartiradi.',
    chapters: [
      {
        title: 'Boy Odamlar Pul Uchun Ishlamaydi',
        pages: 28,
        quote: '«Kambag\'allar va o\'rta sinf pul uchun ishlaydi. Boylar esa pulni o\'zlari uchun ishlatadilar.»',
        content: `**Ikki Ota:**
• Kambag'al ota: "Pul haqida o'ylama" — xavotir va qo'rquv
• Boy ota: "Pul qanday ishlashini o'rgan" — imkoniyat va bilim

**Qo'rquv va ochko'zlik siklasi:**
1. Ko'pchilik qo'rquv (pulsiz qolish) va ochko'zlik (ko'proq pul) o'rtasida hayot kechiradi
2. Bu "Sincap g'ildiragi" — ko'proq ishlash → ko'proq xarajat → yana ko'proq ishlash kerak

**Hissiyot vs Aql:**
• Pul masalasida hissiyot ko'p odamni aldaydi
• Boy bo'lish uchun: hissiyotni boshqaring, aql bilan qaror qiling

**Moliyaviy savodxonlik = Eng yaxshi investitsiya**`,
      },
      {
        title: 'Nima Uchun Boy va Kambag\'al O\'rtasida Farq Bor',
        pages: 26,
        quote: '«Aktivlar cho\'ntagingizga pul solib turadi. Passivlar cho\'ntagingizdan pul oladi.»',
        content: `**Eng muhim moliyaviy qoida:**
• **Aktiv** — cho'ntagingizga pul solib turuvchi narsa
  (ijaraga beriladigan ko'chmas mulk, aksiya, biznes)
• **Passiv** — cho'ntagingizdan pul oluvchi narsa
  (avtomashin, qimmat kiyim-kechak, zararlisarflar)

**Boy odamlar AKTIVLAR yig'adi**
**Kambag'al odamlar XARAJATLAR qiladi**
**O'rta sinf PASSIVLARNI aktiv deb o'ylaydi**

**Kiyosaki formulasi:**
Daromad → Aktivlar sotib ol → Aktivlar daromad keltiradi → Yangi aktivlar sotib ol

**Uy masalasi:**
• Ko'pchilik: "Uy — aktiv"
• Kiyosaki: Bank uchun aktiv, siz uchun passiv (ipoteka, ta'mirlash, soliq)`,
      },
      {
        title: 'Aqlingizni Kuchaytiring',
        pages: 20,
        content: `**Moliyaviy IQ = 4 bilim:**
1. Buxgalteriya — raqamlarni o'qish
2. Investitsiya — pul ishlatish san'ati
3. Bozor — talab va taklif
4. Qonun — soliq va korporativ tuzilma

**"Qanday qilib imkon topaman?" degan savol bering**
"Imkonim yo'q" — bu aqllini o'chiradi
"Qanday qilib qila olaman?" — bu aqllini faollashtiradi

**Risk haqida:**
• Risk yo'qotish degani emas
• Risk — boshqarish degani
• Boylar riskni boshqarishni o'rganadi, undan qochmaydi

**"Ishlamasam ham ishlaydigan tizim qur"**`,
      },
    ],
  },

  /* ── 3. Chuqur Ish ───────────────────────────────────────────── */
  {
    id: 'deep-work',
    title: 'Chuqur Ish',
    subtitle: 'Chalg\'itilgan dunyoda diqqatliroq bo\'lish qoidalari',
    originalTitle: 'Deep Work',
    author: 'Cal Newport',
    year: 2016,
    pages: 304,
    rating: 4.8,
    category: 'biznes',
    tags: ['produktivlik', 'diqqat', 'ish', 'texnologiya'],
    readTime: '7 soat',
    coverGradient: ['#1E3A5F', '#2D5A8E'],
    spineColor: '#0F1E33',
    textColor: '#fff',
    summary: 'Chalg\'itishlar davridа chuqur diqqat bilan ishlash — eng noyob va qimmatli ko\'nikma. Bu ko\'nikmani rivojlantirish esa o\'rganiladi.',
    chapters: [
      {
        title: 'Chuqur Ish Nima va Nima Uchun Kerak?',
        pages: 22,
        quote: '«Chuqur Ish: Chalg\'itishsiz, to\'liq diqqat bilan intellektual qobiliyatni chegaralariga qadar ishlating.»',
        content: `**Ikki xil ish:**
• **Chuqur Ish (Deep Work):** Diqqat talab qiladigan murakkab fikrlash
• **Sayoz Ish (Shallow Work):** Email, uchrashuvlar, ma'muriy vazifalar

**Nima uchun chuqur ish kamyob?**
• Ijtimoiy tarmoqlar va email doimiy chalg'itadi
• Ko'p kompaniyalar sayoz ishni qadrlaydi (uchrashuvlar, open space)
• Chalg'ishga ko'niksangiz — diqqatni to'plash qiyinlashadi

**Nima uchun qimmatli?**
• Murakkab muammolarni hal qilish
• Yangi ko'nikmalarni tez egallash
• Boshqalar qila olmaydigan narsalarni yaratish

**Iqtisodiy haqiqat:** Avtomatsiyalashuv sayoz ishlarni yo'q qiladi. Chuqur ish qiladiganlar yutib chiqadi.`,
      },
      {
        title: 'Chuqur Ish Falsafalari',
        pages: 26,
        content: `**4 ta yondashuv:**

**1. Monastir falsafasi:**
Hayotingizni chuqur ishga bag'ishlang, sayoz ishni minimallаshtiring.
Misol: Donald Knuth email ishlatmaydi.

**2. İkki tomonlama falsafa:**
Vaqtni ikki qismga bo'ling — chuqur ish davri + normal hayot.
Misol: Haftaning 4 kuni chuqur ish, 3 kuni oddiy hayot.

**3. Ritmik falsafa (ENG AMALIY):**
Har kun bir xil vaqtda chuqur ish sessiyasi.
Misol: Har ertalab 6:00-9:00 — chalg'itishsiz ish.

**4. Jurnalistik falsafa:**
Bo'sh vaqt topilganda chuqur ishga o'ting.
(Faqat tajribalilar uchun)

**Qaysi biri sizga mos?**
Ko'pchilik uchun "Ritmik falsafa" eng samarali.`,
      },
      {
        title: 'Chalg\'itishdan Qochish San\'ati',
        pages: 20,
        quote: '«Har bir narsani qilish — hech narsani yaxshi qilmaslik degani.»',
        content: `**Chalg'itishga qaramlik:**
• Diqqatni bo'lish — miyaga zarar
• Multitasking — afsonа
• Doim ulanib turish — ruhiy charchoqqa olib keladi

**"Chuqur ish muhitini" yarating:**
1. Telefonni boshqa xonaga qo'ying
2. Email va messenjerlarni yoping
3. Vaqtni bloklarga bo'ling (90 daq sessions)
4. Ish joyingizni chalg'itishsiz qiling

**"Fikr xaritasi" qoidasi:**
Sayoz ish uchun ham vaqt ajrating — aks holda miyangiz isyonkor bo'ladi.

**Newport formulasi:**
Chuqur ish sessiyasi = Aniq maqsad + Belgilangan vaqt + Chalg'itishsiz muhit`,
      },
    ],
  },

  /* ── 4. Aql Quvvati (Mindset) ────────────────────────────────── */
  {
    id: 'mindset',
    title: 'Aql Quvvati',
    subtitle: 'O\'sish aqliyatining yangi psixologiyasi',
    originalTitle: 'Mindset: The New Psychology of Success',
    author: 'Carol S. Dweck',
    year: 2006,
    pages: 276,
    rating: 4.7,
    category: 'psixologiya',
    tags: ['psixologiya', 'o\'sish', 'ta\'lim', 'motivatsiya'],
    readTime: '6 soat',
    coverGradient: ['#7C3AED', '#9D53F0'],
    spineColor: '#4C1D95',
    textColor: '#fff',
    summary: 'Ikki xil aqliyat: qotib qolgan va o\'suvchi. Qaysi birini tanlasangiz — shundaycha yashoysiz. Yaxshi xabar: bu o\'zgartirilishi mumkin.',
    chapters: [
      {
        title: 'Ikki Aqliyat',
        pages: 20,
        quote: '«Qobiliyat — boshlanish nuqtasi, hammasi shu yerdan boshlanadi.»',
        content: `**Qotib qolgan aqliyat (Fixed Mindset):**
• Qobiliyatlar tug'ma va o'zgarmas deb hisoblaydi
• Muvaffaqiyatsizlik = men qobiliyatsizman
• Qiyinchiliklardan qochadi
• Tanqidni shaxsiy xuruj deb qabul qiladi
• Boshqalar yutuqlaridan tahdid sezadi

**O'suvchi aqliyat (Growth Mindset):**
• Qobiliyatlar rivojlanishi mumkin deb ishonadi
• Muvaffaqiyatsizlik = o'rganish imkoniyati
• Qiyinchiliklarni qabul qiladi
• Tanqiddan yaxshi fikr izlaydi
• Boshqalar yutuqlaridan ilhom oladi

**Ahamiyatli kashfiyot:**
Bu aqliyat tug'ma emas — u qarordir.
"Hali" so'zi sehri: "Men buni bilmayman" → "Men buni HALI bilmayman"`,
      },
      {
        title: 'Muvaffaqiyatsizlikni Qayta Ko\'rish',
        pages: 22,
        content: `**Fixed mindset muvaffaqiyatsizlikda:**
• Yashiradi, uzrini aytadi
• Boshqalarni ayblaydi
• Yana urinishdan qo'rqadi
• O'zini past his qiladi

**Growth mindset muvaffaqiyatsizlikda:**
• Nima noto'g'ri ketganini tahlil qiladi
• Strategiyasini o'zgartiradi
• Sabr bilan davom etadi
• Bu jarayonning bir qismi deb qabul qiladi

**Tadqiqotlar nima deydi:**
MRI tekshiruvi ko'rsatadiki, growth mindset odamlar xato qilganda miya ko'proq faol bo'ladi — chunki ular xatoni qayta ishlaydi.

**Muhim savol:**
"Bu mening qobiliyatim" emas, "Men qanday o'rganishim kerak?"`,
      },
      {
        title: 'Farzandlar va Ta\'lim',
        pages: 18,
        quote: '«"Aqllisan" deb maqtash — fixed mindset ekkanligi. "Harakat qilding" deb maqtash — growth mindset ekishdir.»',
        content: `**Maqtovning ta'siri — Xavfli maqtov:**
"Sen juda aqllisan!" → bola aqlli ko'rinishi uchun qiyinchiliklardan qochadi

"Sen juda ko'p harakat qilding!" → bola qiyinchiliklarni qabul qiladi

**O'qituvchilar uchun:**
• Natijani emas, jarayonni maqtang
• Strategiyani maqtang
• Harakat va qat'iyatni maqtang

**Ota-onalar uchun:**
• Xatolarni shaxsiy muvaffaqiyatsizlik emas, o'rganish sifatida ko'rsating
• "Bugun nima yangi narsani o'rganding?" deb so'rang

**O'zingiz uchun:**
Har kuni kechqurun: "Bugun nima qiyinchilik bilan duch keldim va undan nima o'rgandim?"`,
      },
    ],
  },

  /* ── 5. O'ylash va Boy Bo'lish ───────────────────────────────── */
  {
    id: 'think-grow-rich',
    title: 'O\'ylash va Boy Bo\'lish',
    originalTitle: 'Think and Grow Rich',
    author: 'Napoleon Hill',
    year: 1937,
    pages: 320,
    rating: 4.6,
    category: 'motivatsiya',
    tags: ['boylik', 'maqsad', 'motivatsiya', 'klassik'],
    readTime: '7 soat',
    coverGradient: ['#B45309', '#D97706'],
    spineColor: '#78350F',
    textColor: '#fff',
    summary: '500 ga yaqin millionerning sirlarini o\'rganib chiqqan 20 yillik tadqiqotning xulosasi. Boy bo\'lish — avvalo fikrlashdan boshlanadi.',
    chapters: [
      {
        title: 'Istak — Boylikning Urug\'i',
        pages: 24,
        quote: '«Har bir yutuqning siri — aniq, kuyib-pishib istaydigan maqsaddir.»',
        content: `**"Yonib turuvchi istak" (Burning Desire):**
Hill 500 dan ortiq millioner bilan suhbatlashgan. Barchasida bitta umumiy narsa:
**Aniq, intensiv, qat'iy istak.**

**Oddiy "xohish" emas:**
• "Boyroq bo'lsam yaxshi bo'lardi" — bu istak emas, orzu
• "Men X raqamga Y sanaga qadar erishaman" — bu istak

**6 Qadam — Istakni Boylikka Aylantirish:**
1. Qancha pul istaysiz — aniq raqam
2. Evaziga nima berasiz
3. Muddatni belgilang
4. Aniq reja tuzing
5. Yozma holdagi aniq va qisqa bayonot
6. Kuniga 2 marta qattiq o'qing

**Ishonch (Faith):**
Istak + Ishonch = Amalga oshish formulasi`,
      },
      {
        title: 'Autosuggestion — O\'zingizni Dasturlash',
        pages: 20,
        content: `**Ongsiz (Subconscious) aql:**
• Ongli aqldan 30,000 marta kuchliroq
• U nima "ekasiz" — shuni "o'stiradi"
• Ijobiy va salbiy farqlamaydi — faqat qayta-qayta takrorlashga javob beradi

**Autosuggestion texnikasi:**
1. Maqsadingizni yozing
2. Har kuni ertalab va kechqurun qattiq o'qing
3. O'qiyotganda his eting, tasvir qiling
4. Shubha kirsa — uni to'xtating

**Vizualizatsiya:**
• Ko'zingizni yuming
• Maqsadingizga erishganingizni tasavvur qiling
• Rang, tovush, hissiyot — barchasi bilan
• Har kuni 5 daqiqa

**Sabr:**
Bu "jodugarlik" emas — bu aqlni qayta dasturlash, vaqt talab qiladi.`,
      },
      {
        title: 'Ixtisoslashgan Bilim',
        pages: 18,
        quote: '«Umumiy bilim, qancha ko\'p bo\'lmasin, boylik to\'plashda kam yordam beradi.»',
        content: `**Umumiy vs Ixtisoslashgan bilim:**
• Maktab va universitetda umumiy bilim beriladi
• Boylik esa ixtisoslashgan bilim talab qiladi
• Aynan nima kerakligini bilish + uni qayerdan olish + uni qanday tashkil qilish

**Bilim ishlatilmaganda qimmatsiz:**
Edison maktabda o'qimagan, lekin ixtisoslashgan bilim va JAMOAGA ega edi.

**Mastermind guruhi:**
Hill "Mastermind" kontseptsiyasini kiritdi:
Bir maqsad uchun birlashgan ikkita yoki undan ko'p odam — uchinchi "shaxs"ni (umumiy ong) yaratadi.

**Sizning ustun ko'nikmangiz nima?**
Uni toping, rivojlantiring, sotishni o'rgang.`,
      },
    ],
  },

  /* ── 6. Ichki Kuch (The Power of Now) ──────────────────────── */
  {
    id: 'power-of-now',
    title: 'Hozirgi Lahzaning Kuchi',
    originalTitle: 'The Power of Now',
    author: 'Eckhart Tolle',
    year: 1997,
    pages: 236,
    rating: 4.6,
    category: 'psixologiya',
    tags: ['meditatsiya', 'hozirgi lahza', 'ong', 'ruhiyat'],
    readTime: '5 soat',
    coverGradient: ['#059669', '#10B981'],
    spineColor: '#064E3B',
    textColor: '#fff',
    summary: 'O\'tmish va kelajak haqida fikr yuritish azobdan boshqa narsa emas. Barcha kuch, quvonch va tinchlik — faqat hozirgi lahzada mavjud.',
    chapters: [
      {
        title: 'Fikrlovchi Aqlning Egasi Bo\'lish',
        pages: 22,
        quote: '«Siz o\'z fikrlaringiz emassiz. Siz — ularni kuzatuvchisiz.»',
        content: `**Fikr va Kuzatuvchi:**
Ko'pchilik fikrlarini "men" deb qabul qiladi.
Aslida: **Fikrlar mening aqlimda o'tib ketadi. Men esa ularni kuzatuvchiman.**

**Ongsiz aql:**
• Miyangiz doim gapiradi — o'tmish, kelajak, muammolar
• Bu "psixik shovqin" deyarli uzluksiz
• U ko'p odamlarda azob keltirib chiqaradi

**Kuzatuvchi bo'lishni mashq qiling:**
"Hozir mening aqlimda nima o'tmoqda?" — bu savol o'zini kuzatishni boshlaydi.

**Hozirgi lahzaga kirish:**
• Nafas oling. Nafasni his eting.
• Tanangizni his eting
• Atrofingizni kuzating — hukmsiz
Bu — "Hozirgi lahza portali"`,
      },
      {
        title: 'O\'tmish va Kelajakdan Ozodlik',
        pages: 20,
        content: `**Psixologik vaqt:**
• O'tmish: eslab qolish
• Kelajak: rejalashtirish
Bu foydali. Lekin ko'pchilik o'tmishda **yashaydi** yoki kelajakdan **qo'rqadi.**

**Haqiqiy Muammo Nima:**
"Muammolarim" deyarli barchasini o'tmish yoki kelajak haqida o'ylash yaratadi.
Hozirgi lahzada faqat vaziyat bor — muammo yo'q.

**"Muammo" vs "Vaziyat":**
• Muammo: aqlning hozirgi bo'lmagan narsaga qo'shgan labeli
• Vaziyat: hozir nima bor — bu bilan ishlash mumkin

**Qabul qilish:**
Hozirgi lahzani qabul qilish — taslimchilik emas.
Bu — nima bor — shunday qabul qilish, keyin harakat qilish.`,
      },
    ],
  },

  /* ── 7. 7 Odatlar ─────────────────────────────────────────────── */
  {
    id: '7-habits',
    title: '7 Odatlar',
    subtitle: 'Samarali odamlarning 7 odati',
    originalTitle: 'The 7 Habits of Highly Effective People',
    author: 'Stephen R. Covey',
    year: 1989,
    pages: 432,
    rating: 4.8,
    category: 'motivatsiya',
    tags: ['samaradorlik', 'odatlar', 'yetakchilik', 'klassik'],
    readTime: '10 soat',
    coverGradient: ['#DC2626', '#EF4444'],
    spineColor: '#7F1D1D',
    textColor: '#fff',
    summary: 'Shaxsiy va kasbiy hayotdagi muvaffaqiyatning 7 ta asosiy odati. 30 yildan ortiq vaqt davomida millionlarga ilhom bergan shaxsiy rivojlanish klassikasi.',
    chapters: [
      {
        title: '1-Odat: Faol Bo\'ling',
        pages: 28,
        quote: '«Siz o\'z hayotingizning muallifiсиз. Hikoya yaxshimi yoki yomonmi — bu sizga bog\'liq.»',
        content: `**Reaktiv vs Proaktiv:**
• **Reaktiv:** Muhit meni boshqaradi. Tashqi omillar sababli harakat qilaman.
• **Proaktiv:** Men o'z tanlashimni boshqaraman. Javobgarlik o'zimda.

**Reaksiya tanlash ozodligi:**
Viktor Frankl — Gitlering kontslageridan omon qolgan psixolog:
"Har qanday sharoitda ham biz reaksiyamizni tanlash erkinligimiz bor."

**Ta'sir doirasi (Circle of Influence):**
• Tashvish doirasi: Nazorat qila olmaganim
• Ta'sir doirasi: Nazorat qila oladigan narsa

Proaktiv odamlar vaqtini **ta'sir doirasiga** sarflaydi.

**Proaktiv til:**
❌ "Men buni qila olmayman" → ✅ "Men boshqa yo'l tanlaman"
❌ "U meni asar qildi" → ✅ "Men bunday reaksiya tanladim"`,
      },
      {
        title: '2 va 3-Odatlar: Maqsad va Ustuvorlik',
        pages: 30,
        content: `**2-Odat: Oxirini ko'z oldinga keltiring**
Har qanday ish ikki marta yaratiladi:
1. Aqlan — loyihalashda
2. Jismonan — qurishda

"Agar bugun o'lsam, mening yaqinlarim men haqimda nima deyishini xohlayman?"
Bu savol — hayot kompasini topishga yordam beradi.

**3-Odat: Muhimni avvallashga qo'ying**

Eisenhower matritsasi:
|              | Shoshilinch | Shoshilinch emas |
|---|---|---|
| **Muhim**    | I: Inqiroz   | II: Rejalashtirish ← |
| **Muhim emas** | III: Uzilishlar | IV: Vaqt o'ldirish |

**Kvadrant II** — samarali odamlar eng ko'p vaqt o'tkazadigan joy:
Munosabatlar, salomatlik, o'qish, rejalashtirish`,
      },
      {
        title: '4-7-Odatlar: G\'alaba-G\'alaba va Sinergiya',
        pages: 26,
        content: `**4-Odat: G'alaba-G'alaba fikri (Win-Win)**
6 ta paradigma: Win-Lose, Lose-Win, Lose-Lose, Win, **Win-Win**, Win-Win or No Deal

Win-Win — ikki tomon ham manfaatdor yechim.

**5-Odat: Avval tushunishga harakat qiling**
Ko'pchilik: javob berish uchun tinglayi.
Covey: tushunish uchun tinglang.

**Empatik tinglash:**
Ko'zlar bilan ko'ring, quloqlar bilan eshiting, yurak bilan his eting.

**6-Odat: Sinergiya**
Butun — qismlarning yig'indisidan katta.
1 + 1 = 3 yoki undan ko'p.

**7-Odat: Arrani charxlang**
4 o'lcham: jismoniy, ma'naviy, aqliy, ijtimoiy/hissiy.
Har birini muntazam yangilab turing.`,
      },
    ],
  },

  /* ── 8. Gadimin Hikmatlar ────────────────────────────────────── */
  {
    id: 'gadimin-hikmatlar',
    title: 'Gadimin Hikmatlar',
    subtitle: 'Asrlar sinovidan o\'tgan donishmandlik',
    author: 'KOTIBAJON',
    year: 2024,
    pages: 180,
    rating: 5.0,
    category: 'falsafa',
    tags: ['donishmandlik', 'hayot', 'falsafa', 'o\'zbek'],
    readTime: '4 soat',
    coverGradient: ['#1C1917', '#292524'],
    spineColor: '#0C0A09',
    textColor: '#F59E0B',
    summary: 'KOTIBAJON ilovasining ilhom manbai. Asrlar davomida sinovdan o\'tgan donishmandlik va hayot haqiqatlarining to\'plami.',
    chapters: [
      {
        title: 'Vaqt va Hayot',
        pages: 22,
        quote: '«Bugungi ish — ertangi rahatning kaliti.»',
        content: `**Vaqt haqida hikmatlar:**

• «Ertaga degan odam — bugun yutqizadi»
Prokrastinatsiya — vaqtning eng katta o'g'risi.

• «Bir soat sabr — bir kun g'amdan qutqaradi»
Kichik qiyinchilikka chidash — katta muammolarni oldini oladi.

• «Hayot — safardir, manzil — o'lim. Yo'l yaxshi o'tsin»
Jarayon natijadan muhimroq.

• «Harakat qilgan — topadi, qo'lini qovushtirgan — kutadi»
Borliqning asosiy qonuni: harakat ← natija.

**Fikr uchun:**
Bugun qancha vaqtni haqiqatan ham qadrli narsalarga sarfladingiz?`,
      },
      {
        title: 'Bilim va O\'rganish',
        pages: 20,
        quote: '«Kichik odatlar — katta o\'zgarishlarning asosi.»',
        content: `**Bilim haqida hikmatlar:**

• «O'qigan — tojli, o'qimagan — xor»
Ta\'lim — insonni ko\'taruvchi qanot.

• «Bir ustoz — ming kitobdan yaxshi»
Tajribali mentordan o'rganish — eng qisqa yo'l.

• «Xatosiz o'rganilmas»
Muvaffaqiyatsizlik — o'rganishning bir qismi.

• «Bilim — aql nuri, jaholat — qalb zulmati»
Nima bilmasligingizni bilish — birinchi qadam.

**Qadimiy O'zbek ta'lim falsafasi:**
Aql — ilm bilan, ilm — amal bilan, amal — sabr bilan.`,
      },
      {
        title: 'Pul, Boylik va Qanoat',
        pages: 20,
        quote: '«Tejagan — topgan, sarflagan — yo\'qotgan.»',
        content: `**Boylik haqida hikmatlar:**

• «Qanoatli kishi — boydir, to'ymas kishi — kambag'al»
Ruhiy boylik — moddiy boylikdan ustun.

• «Pul — qurol. Yaxshi qo'lda — quriladi, yomon qo'lda — buziladi»
Pul o'zi neutral, uni ishlatuvchi inson maqsadi muhim.

• «Halol tirikchilik — obro'ning asosi»
Qanday topganingiz — nima topganingizdan muhim.

• «Iste'molchi bo'lma, yaratuvchi bo'l»
Haqiqiy boylik — değer yaratishdan keladi.

**Qadimgi savdo yo'li donishmandligi:**
"Ko'p sotgan emas, to'g'ri sotgan — boy bo'ladi."`,
      },
      {
        title: 'Maqsad va Qat\'iyat',
        pages: 18,
        quote: '«Maqsad yo\'q odam — yelkani ko\'targan qayiqday.»',
        content: `**Maqsad va qat'iyat haqida:**

• «Maqsad — yo'ldosh, qat'iyat — ot»
Maqsadsiz harakat — adashtiradi. Qat'iyatsiz maqsad — orzuga aylanadi.

• «Bir qadamlik yo'l ham ming qadamdan boshlanadi»
Lao Tszi bilan hamkor hikmat. Eng katta sayohat birinchi qadamdan boshlanadi.

• «Yiqilgan — yutqizmadi, yiqilib turmagan — yutqizdi»
Muvaffaqiyat = qancha marta turganingiz − qancha yiqilganingiz + 1.

• «Deadline — motivatsiyaning eng kuchli turi»
Muddati yo'q maqsad — orzu.

**Yakunlovchi hikmat:**
"Reja bor yerda — muvaffaqiyat bor."
Bugun kechqurun, ertaga uchun 3 ta eng muhim vazifani yozing.`,
      },
    ],
  },
]
