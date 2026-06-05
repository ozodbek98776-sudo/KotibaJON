'use client'

/**
 * KotibaBot — KOTIBAJON maskot
 *
 * bot.png  — idle / think / happy / wave / surprised
 * book.png — write:  a) doLookup()  b) 45s harakatsizlik (idle-book)
 * ai.png   — ai:     aiPanel ochiq bo'lganda (har qaysi sahifada)
 *
 * Global:
 *   triggerMascot(msg, mode?)   — tashqi hodisadan chaqirish
 *   window event 'toggle-ai-chat' — AI panelini ochish/yopish
 */

import {
  useState, useEffect, useRef, useMemo, useCallback, memo,
} from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import {
  X, ChevronRight, BookOpen, Send, Copy, Check, RotateCcw,
  LayoutDashboard, ListTodo, Wallet, Target, CalendarDays,
  BarChart2, Library, Flame, Calendar, Settings2, Bot, Lightbulb,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* ── Types ──────────────────────────────────────────────────────── */
type Emotion = 'idle' | 'think' | 'write' | 'happy' | 'wave' | 'surprised' | 'ai'
interface Pos { x: number; y: number }
interface ChatMsg { id: number; role: 'user' | 'ai'; text: string; ts: Date; loading?: boolean }

/* ── Constants ──────────────────────────────────────────────────── */
const BOT_W          = 100
const BOT_H          = 130
const PANEL_W        = 300
const IDLE_BOOK_MS   = 45_000

/* ── Hikmatlar ──────────────────────────────────────────────────── */
const WISDOMS = [
  "Atom Odatlar: «Har bir vazifa bajarilishi — kichik g'alaba!»",
  "Gadimin Hikmatlar: «Reja bor yerda — muvaffaqiyat bor.»",
  "Gadimin Hikmatlar: «Tejagan — topgan, sarflagan — yo'qotgan.»",
  "Gadimin Hikmatlar: «Maqsad yo'q odam — yelkani ko'targan qayiqday.»",
  "Gadimin Hikmatlar: «Bugungi ish — ertangi rahatning kaliti.»",
  "Atom Odatlar: «Maqsadga emas, tizimga fokus qiling.»",
  "Chuqur Ish: «Har bir narsani qilish — hech narsani yaxshi qilmaslik.»",
  "7 Odatlar: «Siz o'z hayotingizning muallifisiz.»",
  "Boy Ota: «Boylar pul uchun ishlamaydi — pul ular uchun ishlaydi.»",
  "Aql Quvvati: «Men buni hali bilmayman — lekin o'rganaman!»",
]

/* ── Book knowledge ─────────────────────────────────────────────── */
const BOOK_RULES: { match: RegExp; reply: string }[] = [
  {
    match: /atom odatlar|atomic habits|james clear|1%.?yaxshilan|odat sikli|4 qonun|habit loop/i,
    reply: "**Atom Odatlar** — James Clear (2018) ⭐ 4.9/5\n\n**Asosiy g'oya:** Har kuni 1% yaxshilanish → yilga **37.78 marta** o'sish!\n\n**4 ta qonun (odat qurish):**\n• 👁️ **Ko'rinarliroq qil** — ishora aniq bo'lsin\n• 🎯 **Jozibali qil** — orzu bilan bog'la\n• ✅ **Osonlashdir** — eng kam qarshilik yo'li\n• 🏆 **Qanoatbaxsh qil** — darhol mukofot ber\n\n**Teskari qonun** (yomon odatni yo'qotish): Ko'rinmas qil → Jozibadorligini kamayt → Qiyinlashtir → Qanoatsizlantir\n\n«**Maqsad** — yo'nalish, **tizim** — natija.»",
  },
  {
    match: /boy ota|rich dad|kiyosaki|aktiv.*passiv|passiv.*aktiv|investitsiya kitob/i,
    reply: "**Boy Ota, Kambag'al Ota** — Kiyosaki (1997) ⭐ 4.7/5\n\n**Asosiy g'oya:** «Boylar pul uchun ishlaMaydi — pul ular uchun ishlaydi.»\n\n**Eng muhim tushuncha:**\n• ✅ **Aktiv** → cho'ntagingizga pul solib turadi\n  (ijarali mulk, aksiya, biznes, royalti)\n• ❌ **Passiv** → cho'ntagingizdan pul oladi\n  (avtomashin, qimmat kiyim, keraksiz xarajatlar)\n\n**Uy haqida haqiqat:** Ko'pchilik uy — aktiv deydi. Lekin ipoteka + ta'mirlash + soliq = **passiv!** 🏠\n\n**Formula:** Daromad → Aktivlar → Aktivlar daromad → Yangi aktivlar 🔄",
  },
  {
    match: /chuqur ish|deep work|cal newport|diqqat.*ish|chalg'it|focus|konsentrat/i,
    reply: "**Chuqur Ish** — Cal Newport (2016) ⭐ 4.8/5\n\n**Ikki xil ish:**\n• 🧠 **Chuqur Ish** — to'liq diqqat, murakkab fikrlash\n• 📱 **Sayoz Ish** — email, uchrashuvlar, ijtimoiy tarmoqlar\n\n**4 falsafa:**\n1. Monastir — faqat chuqur ish\n2. Ikki tomonlama — mavsumiy\n3. **Ritmik ← ENG AMALIY:** har kuni bir xil vaqt\n4. Jurnalistik — tajribalilar uchun\n\n**Sessiya formulasi:**\nAniq maqsad + Belgilangan vaqt + Chalg'itishsiz muhit\n\n«Har bir narsani qilish — hech narsani yaxshi qilmaslik degani.»",
  },
  {
    match: /aql quvvati|mindset|carol dweck|growth mindset|fixed mindset|o'suvchi aqliyat/i,
    reply: "**Aql Quvvati / Mindset** — Carol Dweck (2006) ⭐ 4.7/5\n\n**Ikki xil aqliyat:**\n\n🔒 **Fixed Mindset (Qotib qolgan):**\n«Men bu ishni qila olmayman — qobiliyatim yo'q»\nMuvaffaqiyatsizlik = Men yomon\nQiyinchiliklardan qochadi\n\n🌱 **Growth Mindset (O'suvchi):**\n«Men buni **hali** bilmayman — o'rganaman»\nMuvaffaqiyatsizlik = O'rganish imkoniyati\nQiyinchiliklarni qabul qiladi\n\n**Sehrli so'z:** «**HALI**»\n«Bilmayman» → «**Hali** bilmayman» — bu miyani o'zgartiradigan kichik so'z!\n\nTadqiqot: Growth mindset odamlar xato qilganda miyasi **ko'proq faol** bo'ladi.",
  },
  {
    match: /o'ylash.*boy|think.*grow|napoleon hill|autosuggestion|mastermind/i,
    reply: "**O'ylash va Boy Bo'lish** — Napoleon Hill (1937) ⭐ 4.6/5\n\n**500+ millioner tadqiqot** — barchasida bitta sir: **aniq, yonib turuvchi istak.**\n\n**6 qadam — istakdan boylikka:**\n1. Aniq raqam — qancha pul\n2. Evaziga nima berasiz\n3. Muddatni belgilang\n4. Aniq reja tuzing\n5. Yozma bayonot yarating\n6. Kuniga **2 marta** qattiq o'qing\n\n**Autosuggestion:** Ongsiz aql ongli aqldan **30,000 marta kuchliroq!**\nU nima «ekasiz» — shuni «o'stiradi».\n\n**Mastermind:** 2+ odam bitta maqsad uchun birlashsa — «uchinchi ong» yaratiladi 🧠",
  },
  {
    match: /hozirgi lahza|power of now|eckhart tolle|meditatsiya.*kitob|present moment/i,
    reply: "**Hozirgi Lahzaning Kuchi** — Eckhart Tolle (1997) ⭐ 4.6/5\n\n**Asosiy g'oya:** Barcha azob — o'tmish yoki kelajakda yashashdan keladi. Barcha kuch — **hozirgi lahzada.**\n\n«Siz o'z fikrlaringiz emassiz — **ularni kuzatuvchisiz.**»\n\n**Hozirgi lahzaga kirish portali:**\n• Nafas oling — nafasni his eting\n• Tanangizni his eting\n• Atrofni **hukmsiz** kuzating\n\n**Muammo vs Vaziyat:**\nMuammo = aqlning «labeli»\nVaziyat = hozir nima bor — buni hal qilish mumkin\n\nQabul qilish — taslimchilik emas. Bu — «nima bor» shunday ko'rish, keyin harakat qilish. 🌿",
  },
  {
    match: /7 odatlar|7 habits|stephen covey|covey|win.*win|g'alaba.*g'alaba|eisenhower/i,
    reply: "**7 Odatlar** — Stephen Covey (1989) ⭐ 4.8/5\n\n**7 ta odat:**\n1. 🎯 **Faol bo'ling** — ta'sir doirasiga fokus\n2. 🗺️ **Oxirini ko'z oldiga keltiring** — hayot kompasi\n3. ⚡ **Muhimni avvallang** — Kvadrant II\n4. 🤝 **G'alaba-G'alaba** — Win-Win yechim\n5. 👂 **Avval tushunishga harakat qiling** — empatik tinglash\n6. 🔄 **Sinergiya** — 1+1=3\n7. 🔧 **Arrani charxlang** — 4 o'lcham: jismoniy, ma'naviy, aqliy, ijtimoiy\n\n**Eisenhower matritsasi:**\nKvarant II (Muhim + Shoshilinch emas) = **eng samarali odamlar joyi** 📊",
  },
  {
    match: /gadimin hikmatlar|qadimgi hikmat|o'zbek hikmat|kotibajon kitob/i,
    reply: "**Gadimin Hikmatlar** — KOTIBAJON (2024) ⭐ 5.0/5 🏆\n\n**Asrlar sinovidan o'tgan donishmandlik:**\n\n⏰ *Vaqt haqida:*\n«Ertaga degan odam — bugun yutqizadi»\n«Bir soat sabr — bir kun g'amdan qutqaradi»\n\n📚 *Bilim haqida:*\n«O'qigan — tojli, o'qimagan — xor»\n«Bir ustoz — ming kitobdan yaxshi»\n\n💰 *Boylik haqida:*\n«Qanoatli kishi — boydir, to'ymas kishi — kambag'al»\n«Iste'molchi bo'lma, yaratuvchi bo'l»\n\n🎯 *Maqsad haqida:*\n«Maqsad yo'q odam — yelkani ko'targan qayiqday»\n«Yiqilgan yutqizmadi — yiqilib turmagan yutqizdi»",
  },
  {
    match: /qanday kitob(lar)? bor|barcha kitob|kutubxona.*kitob|kitob tavsiya|qaysi kitob/i,
    reply: "**KotibaJON Kutubxonasidagi kitoblar:**\n\n🥇 Gadimin Hikmatlar — KOTIBAJON ⭐5.0\n🥈 Atom Odatlar — James Clear ⭐4.9\n🥉 Chuqur Ish — Cal Newport ⭐4.8\n🏅 7 Odatlar — Stephen Covey ⭐4.8\n📘 Boy Ota, Kambag'al Ota — Kiyosaki ⭐4.7\n📗 Aql Quvvati — Carol Dweck ⭐4.7\n📙 O'ylash va Boy Bo'lish — Napoleon Hill ⭐4.6\n📕 Hozirgi Lahzaning Kuchi — Eckhart Tolle ⭐4.6\n\nKutubxonaga o'ting va istalgan kitobni boshlang! 📖",
  },
]

/* ── AI models knowledge ────────────────────────────────────────── */
const AI_MODELS_RULES: { match: RegExp; reply: string }[] = [
  {
    match: /claude opus 4\.?8|opus 4\.?8|opus.*yangi|eng yangi claude/i,
    reply: "**Claude Opus 4.8** — Anthropic'ning eng kuchli modeli! 🚀\n\n**Model ID:** `claude-opus-4-8`\n**Chiqarilgan:** 2025\n\n**Nima qila oladi?**\n• 🧠 Eng murakkab tahlil va fikrlash\n• 💻 Professional darajada kod yozish\n• 📊 Katta hajmli hujjatlar tahlili\n• 🔬 Ilmiy tadqiqot va matematik\n• 🎨 Ijodiy yozish va strategiya\n\n**Fast Mode** yoqilsa — Opus 4.8 tezroq ishlaydi! ⚡\n\n**Narxi:** Eng qimmat, lekin eng kuchli.\n\nKotibaJON AI hozir **Claude Sonnet 4.6** da ishlaydi.",
  },
  {
    match: /claude sonnet 4\.?6|sonnet 4\.?6/i,
    reply: "**Claude Sonnet 4.6** — Tezlik va quvvat muvozanati! ⚖️\n\n**Model ID:** `claude-sonnet-4-6`\n\n**Xususiyatlar:**\n• Tez va aqlli javoblar\n• Dasturlash va tahlil\n• Ijodiy yozish\n• Ko'p tilli qo'llab-quvvatlash\n• Prompt caching imkoniyati\n\n**Qachon ishlatiladi?** — Ko'pchilik kundalik vazifalar uchun optimal.\n\n**KotibaJON AI hozir aynan shu modelda ishlaydi!** 🤖\nModel versiya: claude-sonnet-4-6",
  },
  {
    match: /claude haiku 4\.?5|haiku 4\.?5/i,
    reply: "**Claude Haiku 4.5** — Eng tez va arzon Claude! ⚡\n\n**Model ID:** `claude-haiku-4-5`\n\n**Xususiyatlar:**\n• Ultra-tez javob vaqti (millisoundlar)\n• Oddiy savol-javoblar\n• Saralash va tasnif\n• Ko'p hajmli tezkor ishlov\n• Qurilmada ham ishlatish mumkin\n\n**Qachon ishlatiladi?** — Tezlik muhim, oddiy vazifalar, narx tejash kerak bo'lganda.",
  },
  {
    match: /claude(?! opus| sonnet| haiku)|anthropic(?! sdk)/i,
    reply: "**Claude** — Anthropic kompaniyasining AI modellari! 🌟\n\n**Hozirgi modellar (2025-2026):**\n\n| Model | ID | Xususiyat |\n|---|---|---|\n| **Opus 4.8** | claude-opus-4-8 | Eng kuchli 🏆 |\n| **Sonnet 4.6** | claude-sonnet-4-6 | Muvozanat ⚖️ |\n| **Haiku 4.5** | claude-haiku-4-5 | Eng tez ⚡ |\n\n**Anthropic haqida:**\nSan-Fransisko, AQSh. Asoschilari Dario Amodei, Daniela Amodei va boshqalar (2021). Oldin OpenAI'da ishlashgan.\n\n**KotibaJON** Claude Sonnet 4.6 bilan ishlaydi!",
  },
  {
    match: /chatgpt|gpt-?4o?|openai|o1 model|o3 model|gpt model/i,
    reply: "**OpenAI GPT modellari** 🤖\n\n**Asosiy modellar (2025-2026):**\n• **GPT-4o** — omni (matn+rasm+ovoz), asosiy model\n• **GPT-4o mini** — tez va arzon\n• **o1** — chuqur mantiqiy fikrlash\n• **o3** — eng kuchli matematik/kod fikrlash\n• **o4-mini** — tez mantiqiy model\n\n**ChatGPT** — GPT modellari asosidagi chat interfeysi.\nOylik: ChatGPT Plus = $20, Pro = $200\n\n**OpenAI** — Sam Altman rahbarligidagi kompaniya.\nAsoschilari: Sam Altman, Elon Musk (chiqqan), Ilya Sutskever (chiqqan) va boshqalar (2015).",
  },
  {
    match: /gemini|google ai|bard|deepmind|google.*model/i,
    reply: "**Google Gemini modellari** 🔷\n\n**Asosiy modellar (2025-2026):**\n• **Gemini 2.0 Flash** — tez, samarali, ko'p modal\n• **Gemini 2.0 Flash Thinking** — fikrlash rejimi\n• **Gemini 1.5 Pro** — **1 million token** kontekst!\n• **Gemini Ultra** — eng kuchli variant\n• **Gemini Nano** — qurilmada ishlovchi\n\n**Google DeepMind** — London+Mountain View. AI tadqiqot markazi.\n**Bard** — Gemini'ning oldingi nomi (2023-2024 gacha).\n\nGoogle Docs, Gmail, Search — barchasida Gemini integratsiyasi.",
  },
  {
    match: /llama|meta ai|meta llama|ochiq kodli ai|open source ai/i,
    reply: "**Meta Llama** — Ochiq kodli AI modellari! 🦙\n\n**Asosiy versiyalar (2025-2026):**\n• **Llama 3.3 70B** — Meta'ning kuchli ochiq modeli\n• **Llama 3.2** — kichik (1B, 3B) va ko'p modal versiyalar\n• **Llama 3.1 405B** — GPT-4 darajasidagi ochiq model\n• **Code Llama** — dasturlash uchun\n\n**Meta AI** — Facebook, Instagram, WhatsApp'da integratsiya.\n\n**Ochiq kodli** afzalligi: o'z serveringizda **bepul** ishlatish mumkin! 🆓\n\nBoshqa ochiq modellar: Mistral, Qwen, Phi-4, DeepSeek...",
  },
  {
    match: /eng yaxshi ai|qaysi ai yaxshi|ai solishtir|ai taqqosla|ai modellar|barcha ai/i,
    reply: "**2025-2026 yil AI modellari reytingi** 🏆\n\n**Eng kuchli (quvvat bo'yicha):**\n1. 🥇 Claude Opus 4.8 (Anthropic)\n2. 🥈 GPT-4o / o3 (OpenAI)\n3. 🥉 Gemini 1.5 Pro (Google)\n\n**Eng tez:**\n1. ⚡ Claude Haiku 4.5\n2. ⚡ GPT-4o mini\n3. ⚡ Gemini 2.0 Flash\n\n**Kod yozishda eng yaxshi:**\n1. Claude Opus 4.8 / Sonnet 4.6\n2. GPT-4o\n3. DeepSeek V3\n\n**Ochiq kodli:**\n1. 🦙 Meta Llama 3.3\n2. DeepSeek V3\n3. Qwen 2.5\n\n**KotibaJON** — Claude Sonnet 4.6 ⚖️",
  },
  {
    match: /ai nima|sun'iy intellekt|artificial intelligence|llm nima|large language/i,
    reply: "**Sun'iy Intellekt (AI)** haqida 🧠\n\n**LLM (Large Language Model) nima?**\nMilliardlab so'z va matn o'qib o'rgatilgan, inson kabi matn tushunib va yoza oladigan model.\n\n**Qanday ishlaydi?**\n• Milliardlab **parametrlar** (og'irliklar)\n• **Token** — matnni bo'lakcha qismlarga bo'lish\n• **Transformer** arxitekturasi (2017 Google)\n• Kontekst oynasi — bir vaqtda qancha matn qayta ishlash\n\n**2026 holati:**\n• Claude Opus 4.8, GPT-4o, Gemini Ultra\n• Multimodal: matn + rasm + ovoz + video\n• AI agentlar: mustaqil vazifalar bajarish\n• Prompt caching, function calling, RAG\n\nHar 6-12 oyda yangi avlod chiqmoqda! 🚀",
  },
  {
    match: /deepseek|qwen|mistral|phi-?4|yi model/i,
    reply: "**Boshqa kuchli AI modellar** 🌐\n\n**DeepSeek (Xitoy):**\n• DeepSeek V3 — GPT-4 darajasi, ochiq kodli!\n• DeepSeek R1 — matematik fikrlash\n\n**Qwen (Alibaba):**\n• Qwen 2.5 — ko'p tilli, 128K kontekst\n• Qwen-Coder — dasturlash uchun\n\n**Mistral (Frantsiya):**\n• Mistral Large 2 — kuchli Yevropa modeli\n• Mistral 7B — yengil, tez ochiq model\n\n**Microsoft Phi:**\n• Phi-4 — kichik, lekin juda aqlli (14B)\n• Phi-3 Mini — telefonda ishlovchi\n\nBularning barchasi **ochiq kodli** yoki arzon API taklif qiladi! 🆓",
  },
]

/* ── App feature rules ──────────────────────────────────────────── */
const APP_RULES: { match: RegExp; reply: string }[] = [
  {
    match: /vazifa|task|bajar/i,
    reply: "Vazifalarni samarali boshqarish uchun **Eisenhower matritsasi** (7 Odatlar kitobidan):\n\n• 🔴 **Shoshilinch + Muhim** → Hozir bajaring\n• 🟡 **Muhim, shoshilinch emas** → Rejalang ← **Bu eng muhimi!**\n• 🔵 **Shoshilinch, muhim emas** → Topshiring\n• ⚪ **Ikkalasi ham emas** → O'chiring\n\nVazifalar bo'limida bugungi **3 ta eng muhim** vazifani belgilang!",
  },
  {
    match: /pul|moliya|xarajat|daromad|byudjet|tejash/i,
    reply: "Moliyaviy barqarorlik uchun **50/30/20 qoidasi** (Boy Ota kitobidan ilhom):\n\n• 💰 **50%** — Zaruriy xarajatlar (ijara, ovqat)\n• 🎯 **30%** — Shaxsiy istaklaringiz\n• 🏦 **20%** — Jamg'arma + **Aktivlar** sotib olish\n\nMoliya bo'limida har kungi xarajatlaringizni yozing — oylik statistika chiqadi!",
  },
  {
    match: /maqsad|goal|target|smart/i,
    reply: "Muvaffaqiyatli maqsad — **SMART tizimi** + **7 Odatlar** yondashuvi:\n\n• **S** — Aniq (Specific)\n• **M** — O'lchanadigan (Measurable)\n• **A** — Erishiladigan (Achievable)\n• **R** — Real (Realistic)\n• **T** — Muddatli (Time-bound)\n\n«Oxirini ko'z oldiga keltiring» — Stephen Covey\n\nMaqsadlar bo'limida bugun bitta yangi SMART maqsad qo'shing!",
  },
  {
    match: /vaqt|samarali|productive|pomodoro|diqqat/i,
    reply: "Vaqtni boshqarish — **Pomodoro + Chuqur Ish** kombinatsiyasi:\n\n⏱️ **25 daqiqa** — to'liq diqqat (telefon boshqa xonada!)\n☕ **5 daqiqa** — qisqa tanaffus\n🔄 4 sikldan keyin — **30 daqiqa** uzoq tanaffus\n\nCal Newport: «Chuqur ish = Aniq maqsad + Belgilangan vaqt + Chalg'itishsiz muhit»\n\nKun tartibida bugun uchun bloklar tuzing!",
  },
  {
    match: /sana|tug'ilgan|bayram|eslatma/i,
    reply: "Muhim sanalarni unutmaslik — **3-7-30 qoidasi**:\n\n• **30 kun** oldin — dastlabki tayyorlik\n• **7 kun** oldin — sovg'a/tayyorlik eslatmasi\n• **3 kun** oldin — yakuniy eslatma\n\nSanalar bo'limida avtomatik eslatmalarni sozlang! 📅",
  },
  {
    match: /salom|assalom|hi\b|hey\b|aloha/i,
    reply: "Assalomu alaykum! Men **KotibaJON AI** — sizning aqlli yordamchingizman! 🤖\n\nMen quyidagi sohalarda real ma'lumot bera olaman:\n• 📚 **Kutubxona** — 8 ta kitob (Atom Odatlar, Deep Work, Rich Dad...)\n• 🤖 **AI modellar** — Claude Opus 4.8, GPT-4o, Gemini...\n• ✅ **Ilovangiz** — vazifa, moliya, maqsad, sanalar\n\nSavol bering — haqiqiy ma'lumot beraman!",
  },
  {
    match: /rahmat|tashakkur|barakalla|zo'r/i,
    reply: "Arzimaydi! Doim haqiqiy ma'lumot berishga tayyorman. 😊\n\n**KotibaJON** — vazifalar, moliya, maqsadlar, kutubxona va AI yordamchi. Hamma narsa bir joyda!\n\nYana savol bo'lsa — men shu yerdaman 🤖",
  },
]

/* ── Science & mental models knowledge ─────────────────────────── */
const SCIENCE_RULES: { match: RegExp; reply: string }[] = [

  /* ── Psixologiya ── */
  {
    match: /kognitiv xato|cognitive bias|tasdiqlash xatosi|confirmation bias|xato.*fikr/i,
    reply: "**Kognitiv xatolar — miyangiz sizni aldaydi** 🧠\n\n**Eng keng tarqalganlari:**\n\n• **Tasdiqlash xatosi** — faqat o'z fikringizni tasdiqlovchi ma'lumotni ko'rasiz. Xilof ma'lumotni e'tiborsiz qoldirasiz.\n\n• **Sunk cost fallacy** — «Shuncha vaqt sarfladim, davom etishim kerak» — yo'qotilgan resurs qarorni belgilaydi. **Noto'g'ri.** Faqat kelajakka qarang.\n\n• **Dunning-Kruger** — oz bilgan odam o'zini mutaxassis, ko'p bilgan odam o'zini shubhali his qiladi.\n\n• **Anchoring** — birinchi ko'rgan raqam/ma'lumot standart bo'lib qoladi.\n\n• **Availability bias** — esda qolgan voqea ko'proq bo'ladigan narsadek tuyuladi.\n\nBularni bilsangiz — qarorlaringiz ancha aqlliroq bo'ladi.",
  },
  {
    match: /iroda kuchi|willpower|o'z-o'zini nazorat|self.?control|ego depletion/i,
    reply: "**Iroda kuchi haqida ilm nima deydi** 💪\n\n**Asosiy kashfiyotlar:**\n\n• Iroda kuchi — cheklangan resurs. Kun davomida sarflasangiz — kamayadi. Shuning uchun muhim qarorlarni **ertalab** qabul qiling.\n\n• **Ego depletion:** Bir ish uchun o'zingizni tiygan bo'lsangiz — keyingi ish uchun irodangiz kamroq.\n\n• **Muhit arxitekturasi > iroda kuchi.** Konfetni ko'rinmaydigan joyga qo'ying — irodangizni sarflamang.\n\n• Atom Odatlarda James Clear: «Iroda kuchiga tayanish — ishonchsiz strategiya. Tizimga tayanish — ishonchli strategiya.»\n\n**Amaliy maslahat:** Har kuni bitta kichik odat → iroda mushaklarini mashq qildiradi.",
  },
  {
    match: /motivatsiya|motivation|nima uchun ishlamaydi|demotivatsiya|ichki.*tashqi/i,
    reply: "**Motivatsiya ilmi** 🔥\n\n**2 xil motivatsiya:**\n\n• **Tashqi (Extrinsic):** mukofot, pul, maqtov — qisqa muddatli, tezda so'nadi\n• **Ichki (Intrinsic):** qiziqish, mazmun, o'sish — uzoq muddatli, kuchli\n\n**Self-Determination Theory (Deci & Ryan):**\nIchki motivatsiya uchun 3 ehtiyoj:\n1. **Avtonomiya** — o'zim tanlayman\n2. **Kompetentsiya** — rivojlanayapman\n3. **Aloqa** — muhim odamlar bilan bog'liqman\n\n**Nima uchun pul yetarli emas?**\nMa'lum darajadan keyin qo'shimcha pul baxtni oshirmaydi (Princeton tadqiqoti).\n\n**Flow holati (Csikszentmihalyi):**\nVazifa qiyinligi = sizning mahoratingiz → maksimal motivatsiya + lazzat.",
  },
  {
    match: /stres|stress|tashvish|anxiety|bosim.*boshqar/i,
    reply: "**Stresni ilmiy boshqarish** 😤→😌\n\n**Stres haqida haqiqat:**\nOz miqdordagi stres — foydali (eustress). Ko'p — zararli (distress).\n\n**Fiziologik tinchlantirish (30 soniyada):**\n• **Fiziologik zarb:** ikki marta ketma-ket burun orqali nafas oling, keyin og'iz orqali sekin chiqaring. Bu nafas yo'llarini tozalaydi, CO₂ ni tezda chiqaradi.\n\n**4-7-8 nafas texnikasi:**\n4 soniya → nafas oling\n7 soniya → ushlab turing\n8 soniya → sekin chiqaring\n\n**Kognitiv qayta baholash:**\n«Bu stres meni yo'q qilmoqda» → «Bu stres meni tayyorlamoqda»\nStanford tadqiqoti: stresin zararli deb o'ylaganlar — haqiqatan ko'proq zarar ko'rdi.\n\n**Eng kuchli dori:** harakat (30 daqiqa yurish).",
  },

  /* ── Moliya ilmi ── */
  {
    match: /murakkab foiz|compound interest|foiz.*foiz|8 qoida|72 qoida|rule of 72/i,
    reply: "**Murakkab foiz — dunyoning 8-mo'jizasi** 💰\n\n**Einstein nima degan:** «Murakkab foizni tushungan — undan foydalanadi. Tushunmagan — to'laydi.»\n\n**72 qoidasi — tez hisoblash:**\n72 ÷ yillik foiz stavka = pulni ikki barobar qilish uchun yillar\n\nMisol: yiliga 8% → 72÷8 = **9 yilda ikki barobar**\n\n**Amaliy misol:**\n18 yoshda 1,000,000 so'm qo'ysangiz (10% yilik):\n• 28 yoshda → 2,593,742 so'm\n• 38 yoshda → 6,727,500 so'm\n• 58 yoshda → **45,259,256 so'm**\n\n**Asosiy dars:** Vaqt — eng qimmatli aktiv. Erta boshlash — ko'p investitsiya qilishdan muhim.",
  },
  {
    match: /indeks fond|index fund|bozorga.*invest|s&p|etf|passiv invest/i,
    reply: "**Indeks fondlar — Warren Buffett tavsiyasi** 📈\n\n**Nima bu?**\nBozordagi barcha (yoki ko'p) kompaniyalarni bir vaqtda sotib olish. Hech kimni tanlashga harakat qilmaysiz.\n\n**Nima uchun ishlaydi?**\n• 90%+ professional fondlar menedjerlar uzoq muddatda indeksdan **yutqizadi**\n• Minimal komissiya (0.03-0.1% vs faol fondlarda 1-2%)\n• Diversifikatsiya — bir kompaniya yiqilsa, boshqalari ushlab turadi\n\n**S&P 500 tarixiy o'rtacha:** yiliga ~10% (inflatsiyadan keyin ~7%)\n\n**Warren Buffett vasiyati:**\n«Menga meros qolsa — 90% S&P 500 indeks fondiga, 10% qisqa muddatli davlat obligatsiyalariga soling.»\n\n**Boshlash uchun:** Dollar Cost Averaging — har oy bir xil miqdor.",
  },
  {
    match: /byudjet.*qoida|50.30.20|budjet.*metod|zarurat.*xohish.*tejam/i,
    reply: "**Byudjet metodlari — qaysi biri siz uchun?** 💳\n\n**50/30/20 qoidasi (Elizabeth Warren):**\n• 50% — zaruriyat (ijara, ovqat, transport)\n• 30% — xohishlar (restoran, ko'ngilochar)\n• 20% — jamg'arma + qarz to'lash\n\n**Zero-based budgeting:**\nHar so'mingizga ish bering: daromad − barcha xarajat = 0\nQaerga ketishi aniq ko'rinadi.\n\n**Pay yourself first:**\nMaosh olganda DARHOL 20% ajrating — qolganiga yashang.\nAvtomatlashtiring → iroda sarflamaysiz.\n\n**Envelope metodi:**\nHar kategoriya uchun konvert → pul tugasa, tugadi.\nNaqd pul psixologik to'siq yaratadi — kartadan ko'ra ko'proq o'ylaysiz.",
  },
  {
    match: /qarz.*to'la|debt.*snowball|debt.*avalanche|kredit.*qarz/i,
    reply: "**Qarzni to'lash — ikki ilmiy metod** 🏔️\n\n**Snowball (Qor to'pi) — Dave Ramsey:**\nEng kichik qarzdan boshlang → to'lang → keyingiga o'ting\n✅ Psixologik g'alaba → motivatsiya yuqori\n❌ Matematik jihatdan optimal emas\n\n**Avalanche (Ko'chki) — matematik optimal:**\nEng yuqori foizli qarzdan boshlang\n✅ Umumiy foiz to'lovda ko'p tejaysiz\n❌ Birinchi natija ko'proq vaqt oladi\n\n**Qaysi biri yaxshi?**\nTadqiqotlar: ko'pchilik uchun **Snowball** yaxshiroq ishlaydi — chunki motivatsiyani saqlaydi.\n\n**Oltin qoida:** Avval favqulodda jamg'arma (3-6 oylik xarajat) → keyin qarz.",
  },

  /* ── O'rganish ilmi ── */
  {
    match: /tez o'rgan|tezroq o'qish|o'rganish.*usul|feynman|active recall|spaced repetition/i,
    reply: "**O'rganish ilmi — miyangizni qanday ishlating** 🎓\n\n**1. Active Recall > Passive Reading**\nO'qib chiqish emas — yopib, eslashga urinish. Tadqiqot: active recall 2-3x samaraliroq.\n\n**2. Spaced Repetition (Ebbinghaus)**\nUnutish egri chizig'i bor. Qayta ko'rishni rejalashtiring:\n1 kun → 3 kun → 7 kun → 21 kun → 30 kun\n\n**3. Feynman texnikasi:**\n1. Mavzuni tanlang\n2. Bolaga tushuntirganday yozing\n3. Bo'shliqlarni toping\n4. Soddalashtiring\nAgar sodda tushuntira olmasangiz — haqiqatan tushunmagan ekansiz.\n\n**4. Interleaving:**\nBir mavzuda uzoq o'tirish emas — turli mavzularni almashtiring. Miyaga qiyinroq, lekin uzoq muddatda yaxshiroq.\n\n**5. Sleep = O'rganish:**\nUyqu paytida miya bilimni «qattiq diskka» yozadi. Uyqusiz o'rganish — suvga yozish.",
  },
  {
    match: /malaka.*osha|deliberate practice|ataylab.*mashq|10000 soat|10\.000/i,
    reply: "**Deliberate Practice — chinakam mahorat sirri** 🎯\n\n**Anders Ericsson tadqiqoti (Outliers asosi):**\n«10,000 soat» nazariyasi noto'g'ri tushunildi.\nMuhim: **qanday** mashq qilish, **qancha** emas.\n\n**Oddiy mashq vs Ataylab mashq:**\n\n| Oddiy | Ataylab |\n|---|---|\n| Qulaylik zonasida | Qulaylik zonasidan tashqarida |\n| Avtomatik | Diqqat talab qiladi |\n| Ko'p takrorlash | Maqsadli takrorlash |\n| Tez unutiladi | Uzoq saqlanadi |\n\n**4 element:**\n1. Aniq maqsad (bu sessiyada nima?\n2. To'liq diqqat\n3. Tez feedback (nima noto'g'ri?)\n4. Qulaylik zonasidan biroz tashqari\n\n**Mus ko'rgazmasi:** top-musiqa o'quvchilari ko'proq emas — **sifatliroq** mashq qiladi.",
  },
  {
    match: /xotira.*kuchaytir|yaxshi.*esla|eslab qol.*usul|memory palace|chunking/i,
    reply: "**Xotirani kuchaytirish — ilmiy usullar** 🏛️\n\n**1. Memory Palace (Loci usuli):**\nBiladigan joyingizni (uyingiz) ko'z oldingizga keltiring. Eslamoqchi bo'lgan narsalarni har xonaga joylashtiring. Eslashda — uyni «aylanib chiqing».\nDunyo chempionlari ishlatadigan usul.\n\n**2. Chunking (Bo'laklash):**\n1234567890 → 123-456-78-90\nMiya 7±2 birlikni saqlaydi (Miller's Law). Katta narsani kichik bo'laklarga bo'ling.\n\n**3. Elaborative Interrogation:**\n«Bu nima?» emas — «Bu nima **uchun** to'g'ri?»\nMazmunga qo'shimcha so'rash → chuqurroq qayta ishlash.\n\n**4. Kontekst muhimligi:**\nO'qigan joyingizda sinov bering — natija yaxshiroq (encoding specificity).\n\n**5. Uyqu:** REM fazasida miya bilimni mustahkamlaydi.",
  },

  /* ── Sog'liq ilmi ── */
  {
    match: /uyqu.*soat|necha.*soat.*uxla|sleep.*sience|uyqu.*sifat|circadian/i,
    reply: "**Uyqu ilmi — Matthew Walker (Why We Sleep)** 😴\n\n**Necha soat kerak?**\n• Kattalar: **7-9 soat** (aksariyat 8 soat)\n• 6 soat uyugan odam o'zini yaxshi his qilsa ham — kognitiv sinovlarda 2 kun uyqusiz qolgan kabi natija beradi\n\n**Uyqu bosqichlari (90 daqiqalik sikl):**\n• NREM (3 bosqich) — jismoniy tiklanish, xotira mustahkamlash\n• REM — hissiy qayta ishlash, ijodiylik, o'rganish\n\n**Sifatli uyqu uchun:**\n• Har kuni bir xil vaqtda uxlang (hatto dam olish kunlari)\n• Uxlashdan 1 soat oldin: telefon yoq, yorug'lik dim\n• Xona: salqin (18-19°C), qorong'i, jim\n• Kofein: uxlashdan 6 soat oldin oxirgi\n\n**Uyqu qarzini to'lash mumkin emas** — hafta oxida «qo'shimcha» uyqu doimiy ziyonni to'ldirmaydi.",
  },
  {
    match: /suv.*ich|gidrat|hydrat|qancha.*suv|kunlik.*suv/i,
    reply: "**Suv ichish — ilmiy norma** 💧\n\n**Formula:**\nTana vaznining **30-35 ml per kg**\n70 kg odam → 2.1-2.4 litr/kun\n\n**8 stakan afsonasi noto'g'ri** — ovqat, meva, sabzavotdan ham suv olasiz.\n\n**Qachon ichish kerak?**\n• Ertalab uyg'onganda — darhol 1-2 stakan (8 soat uyqu = 0.5-1 litr yo'qotish)\n• Ovqatdan 30 daqiqa oldin — hazm qilishni yaxshilaydi\n• Jismoniy faollik paytida — har 15-20 daqiqada\n• Kechqurun kam — tunda urinishni kamaytiradi\n\n**Dehidratatsiya belgisi:**\nSiydigingiz sariq → suv içing. Tiniq/sarg'ish → normal.\n\n**Kofein va alkogol** — diuretik, suv miqdorini kamaytiradi.",
  },
  {
    match: /sport|jismoniy.*faoliyat|mashq.*qil|exercise|harakat.*sog'liq|aerob/i,
    reply: "**Jismoniy faoliyat — eng kuchli «dori»** 🏃\n\n**WHO tavsiyasi (haftasiga):**\n• 150 daqiqa o'rta intensiv (yurish, velosiped)\n• YOKI 75 daqiqa yuqori intensiv (yugurish, suzish)\n• + 2 kun kuch mashqlari\n\n**Miyaga ta'siri:**\n• BDNF (Brain-Derived Neurotrophic Factor) ishlab chiqadi — «miyani o'g'itlaydi»\n• Depressiya, tashvish → 30 daqiqa aerob mashq = antidepressant\n• Xotira va o'rganish qobiliyati oshadi (hippocampus kattalashadi)\n\n**10,000 qadam afsonasi:**\nYaponiyada marketing uchun o'ylab topilgan. Aslida 7,000-8,000 qadam ham katta foyda beradi.\n\n**Eng yaxshi vaqt:** sizga mos vaqt. Ertaroq yaxshiroq emas — muntazamlik muhim.",
  },
  {
    match: /ovqatlani|nutrition|protein|kaloriya|sog'lom.*ovqat|diet|parhez/i,
    reply: "**Ovqatlanish ilmi — asoslar** 🥗\n\n**3 ta makronutrient:**\n• **Protein** (oqsil) — 1g/kg tana vazni minimal. Mushak, to'yinganlik.\n• **Karbohidrat** — asosiy energiya manbai. Murakkab karbohidrat (non, guruch) > oddiy (shakar)\n• **Yog'** — miya funksiyasi, gormonlar. Sog'lom yog': zaytun yog'i, baliq, yong'oq\n\n**Qon shakarini barqarorlashtirish:**\nYeyishdan oldin sabzavot → keyin protein → keyin karbohidrat\nBu tartib insulin spaykini kamaytiradi.\n\n**Intermittent Fasting (16:8):**\n16 soat ovqat yo'q, 8 soatda ovqat. Kaloriya sanash emas — vaqtni cheklash.\nFoydalari: insulin sezgirlik, yallig'lanish kamayishi.\n\n**Eng muhim qoida:** rang-barang ovqat — turli rang = turli phytonutrient.",
  },

  /* ── Mental modellar ── */
  {
    match: /pareto|80.20|20 foiz.*80|pareto prinsipi/i,
    reply: "**Pareto printsipi (80/20 qoida)** 📊\n\nVilfredo Pareto kashf qildi: Italiyada 20% aholi 80% boylikni egallamoqda.\n\n**Hayotda qanday ishlaydi:**\n• 20% vazifalar → 80% natija\n• 20% mijozlar → 80% daromad\n• 20% xatolar → 80% muammolar\n• 20% do'stlar → 80% quvonch\n\n**Amaliy ishlatish:**\n1. Bugungi vazifalar ichida — qaysi 20% 80% natija beradi?\n2. Shu vazifalardan boshlang\n3. Qolganlarni keyinga qoldiring yoki topshiring\n\n**Muhim nuance:** Bu universal qonun emas — taxminiy nisbat. Ba'zan 10/90, ba'zan 30/70.\n\n**Richard Koch (The 80/20 Principle):** «Ko'proq emas, to'g'riroq qiling.»",
  },
  {
    match: /first principles|birinchi tamoyil|elon.*fikr|fundamental.*fikr|asosdan.*o'yla/i,
    reply: "**First Principles fikrlash** 🔬\n\nAristotelden Elon Musk ishlatadigan usul.\n\n**Nima bu?**\nHar qanday muammoni eng asosiy, isbotlangan haqiqatlarga qadar parchalang. Keyin qayta quring.\n\n**Analogiya fikrlash (ko'pchilik):**\n«Boshqalar shunday qilgan → men ham shunday qilaman»\n→ Past chegara, o'rtacha natija\n\n**First Principles (innovatorlar):**\n«Bu nima uchun shunday? Eng asosiy haqiqat nima?»\n→ Yangi yechimlar\n\n**Elon Musk misoli:**\nRaketa narxi qimmat → «Raketa nimadan iborat?» → materiallar narxi → SpaceX o'zi ishlab chiqaradi → 10x arzonlashdi\n\n**Savol: «Nima uchun?»ni 5 marta bering** — tub sababga yetasiz.",
  },
  {
    match: /ikkinchi tartib.*fikr|second order|oqibat.*oqibat|nojo'ya ta'sir/i,
    reply: "**Second-Order Thinking — chuqur fikrlash** ♟️\n\n**1-tartib fikrlash:** «Bu harakat qanday natija beradi?»\n**2-tartib fikrlash:** «Bu natija qanday natija beradi?»\n\n**Misol:**\n1-tartib: Antibiotik ichaman → kasallik ketadi ✅\n2-tartib: Antibiotik ich→ bakteriyalar chidamli bo'ladi → keyingi safar ishlamaydi ⚠️\n\n**Yana bir misol:**\n1-tartib: Kambag'al mamlakatga pul beramiz → yaxshi\n2-tartib: Mahalliy ishlab chiqarish yiqiladi, qaramlik hosil bo'ladi\n\n**Charlie Munger:** «Oqibatni, keyin oqibatning oqibatini o'ylang»\n\n**Amaliy ishlatish:**\nKatta qarorlardan oldin: «Bu 10 yildan keyin qanday ko'rinadi?»",
  },
  {
    match: /parkinson qonun|parkinson.*law|ish.*vaqt.*to'ld|muddatsiz.*ish/i,
    reply: "**Parkinson qonuni** ⏱️\n\n«Ish unga ajratilgan vaqtni to'ldiradi.»\n— C. Northcote Parkinson (1955)\n\n**Nima degani?**\nHisobot uchun 1 hafta bersangiz → 1 haftada yoziladi.\n1 kun bersangiz → 1 kunda yoziladi.\nSifat taxminan bir xil.\n\n**Nima uchun?**\n• Deadline bo'lmasa — mukammallik izlaymiz\n• Haddan ortiq tahlil (analysis paralysis)\n• Keraksiz detal qo'shamiz\n\n**Amaliy qoida:**\nHar vazifaga **qisqaroq** muddat belgilang.\nPlannerda bloklarni kichiklashtirib ko'ring — sifat tushmasligi ko'p hollarda taajjublashtiradi.\n\n**Engelbart qonuni bilan birlashtirib:**\nQisqa deadline + yuqori imkoniyat zona = **Flow holati**",
  },
  {
    match: /opportunity cost|muqobil narx|tanlov narxi|qaysi.*tanlasam/i,
    reply: "**Opportunity Cost — tanlov narxi** 🔀\n\n**Ta'rif:** Biror narsani tanlaganda, boshqa eng yaxshi tanlovdan voz kechishingizning qiymati.\n\nPul sarflashda ko'rinadigan narx — **to'g'ridan to'g'ri narx.**\nKo'rinmaydigan, lekin real narx — **opportunity cost.**\n\n**Misol:**\n1,000,000 so'm TV sotib olasiz.\nTo'g'ridan to'g'ri narx: 1,000,000 so'm\nOpportunity cost: Shu pulni 10% yillik daromad bilan investitsiya qilganda 30 yildan keyin → **17,449,402 so'm**\n\n**Vaqtda ham ishlaydi:**\n2 soat serialda → opportunity cost: o'sha 2 soatda o'rgangan ko'nikma yoki bajaqrilgan vazifa.\n\n**Qaror qabul qilishda:** «Bu tanlov o'rniga eng yaxshi alternativa nima edi?»",
  },
  {
    match: /inversion|teskari.*fikr|orqaga.*fikr|muammoni.*teskari|qaytadan.*o'yla/i,
    reply: "**Inversion — teskari fikrlash** 🔄\n\nCharlie Munger sevgan mental model.\n\n**Nima bu?**\nMuammoni to'g'ridan to'g'ri emas — **teskarisidan** o'ylash.\n\n**«Qanday muvaffaq bo'laman?»** o'rniga:\n**«Qanday muvaffaqiyatsiz bo'laman?»**\nJavoblarni to'plang → ularga qarama-qarshi qiling.\n\n**Misol:**\nBaxtli bo'lishni xohlaysiz.\nInversion: «Odamlar nima uchun baxtsiz?»\n→ Yolg'izlik, maqsadsizlik, sog'liq muammolari, moliyaviy bosim\n→ Bularning teskarisi: munosabatlar, maqsad, sog'liq, moliyaviy barqarorlik\n\n**Jeff Bezos «Regret Minimization»:**\n«80 yoshda o'zimga qarasam — bu qarorni qilmaganim uchun afsuslanammi?»\nTeskari: «Qilganim uchun afsuslanammi?»",
  },
  {
    match: /mental model|aqliy model|charlie munger|latticework|tafakkur.*usul/i,
    reply: "**Mental modellar — o'ylash vositalari** 🧰\n\nCharlie Munger: «Ko'p sohalardagi asosiy modellarni o'rganing — ular bir-birini kuchaytiradigan to'r (latticework) hosil qiladi.»\n\n**Eng qimmatli mental modellar:**\n\n🔬 **Ilmdan:**\nEvolution, compound effect, entropy, feedback loop\n\n📊 **Iqtisodiyotdan:**\nOpportunity cost, supply-demand, incentives\n\n🧠 **Psixologiyadan:**\nCognitive biases, loss aversion, social proof\n\n♟️ **Strategiyadan:**\nFirst principles, inversion, second-order thinking, Pareto\n\n🔢 **Matematikadan:**\nProbabilistic thinking, base rates, normal distribution\n\n**Qanday o'rganiladi?**\nTurli soha kitoblari o'qing. Har bir kitobdan 1-2 ta asosiy model oling.",
  },

  /* ── Muvaffaqiyat ── */
  {
    match: /grit|qat'iyat|bardosh|persistence|resilience|tushkunlik.*tur/i,
    reply: "**Grit — qat'iyat va ishtiyoq** 💎\n\nAngela Duckworth tadqiqoti (TED Talk: 20M+ ko'rish)\n\n**Grit = Ishtiyoq + Qat'iyat**\nIQ, iqtidor emas — bu ikki narsa uzoq muddatli muvaffaqiyatni bashorat qiladi.\n\n**4 ta psixologik aktiv (Grit uchun):**\n1. **Qiziqish** — nima sizni hayajonlantiradi?\n2. **Mashq** — deliberate practice\n3. **Maqsad** — bu nima uchun muhim?\n4. **Umid** — yiqilsam ham turaman\n\n**Growth Mindset (Dweck) + Grit = kuchli kombinatsiya**\n\n**Viktor Frankl:** «Nima uchun yashayotganini bilgan — qanday yashashni topadi»\n\n**Amaliy:** Bugun qilish qiyin bo'lgan bitta narsani qiling — grit mushaklarini mashq qildiring.",
  },
  {
    match: /baxt|xursandchilik|wellbeing|pozitiv psixologiya|seligman|flourishing/i,
    reply: "**Baxt ilmi — Pozitiv Psixologiya** 😊\n\nMartin Seligman (Pozitiv Psixologiya asosi)\n\n**PERMA modeli — baxtning 5 ustuni:**\n• **P** — Positive emotions (ijobiy his-tuyg'ular)\n• **E** — Engagement (to'liq ishtiroq, Flow)\n• **R** — Relationships (chuqur munosabatlar)\n• **M** — Meaning (mazmun, maqsad)\n• **A** — Accomplishment (yutuq, erishish)\n\n**Harvard 80 yillik tadqiqot (Grant Study):**\nEng muhim baxt omili: **munosabatlar sifati.**\nPul, shuhrat, muvaffaqiyat emas.\n\n**Hedonic adaptation:**\nNarsa sotib olish → bir muddatdan keyin normal bo'ladi.\nTajriba sotib olish → xotiralar o'sib boradi.\n\n**Amaliy:** Har kuni 3 ta minnatdorchilik yozing — 6 haftada baxt 25% oshadi (tadqiqot).",
  },
  {
    match: /muloqot|communication|gapir.*uslub|eshitish|aktiv.*tingla|nonviolent/i,
    reply: "**Muloqot ilmi** 🗣️\n\n**Aktiv tinglash (Carl Rogers):**\n• Ko'z bilan kontakt\n• Bosh silkitish, «ha», «tushundim»\n• Takrorlash: «Siz aytmoqchi bo'ldingizki...»\n• Savol berish: «Bu haqda ko'proq gapirsangiz?»\n\n**Nonviolent Communication (Marshall Rosenberg):**\n4 qadam:\n1. **Kuzatuv** — nima bo'ldi? (baholashsiz)\n2. **Tuyg'u** — men nima his qilyapman?\n3. **Ehtiyoj** — mening ehtiyojim nima?\n4. **So'rov** — aniq, ijobiy so'rov\n\n❌ «Siz doim kechikasiz» → ✅ «Bugun 20 daqiqa kutdim. Menga vaqt muhim. Oldindan xabar bera olasizmi?\"\n\n**Mehrabian qoidasi (7-38-55):**\n7% so'zlar, 38% ovoz toni, 55% tana tili.",
  },
  {
    match: /prokrastin|kechiktir|ishni.*keyinga|laziness|dangasalik|task.*qilmaslik/i,
    reply: "**Prokrastinatsiya — ilmiy tushuntirish** 🐌\n\n**Prokrastinatsiya = vaqt boshqaruvi muammosi emas — hissiyot boshqaruvi muammosi.**\n\nFu Se va boshqalar tadqiqoti: Prokrastinatsiya qiluvchilar vazifadan **tashvish, qo'rquv, shubha** his qilishadi. Prokrastinatsiya shu his-tuyg'udan vaqtincha qochish.\n\n**Nima uchun?**\n• Katta va noaniq vazifalar\n• Muvaffaqiyatsizlikdan qo'rquv\n• Mukammallik istagi\n• Darhol mukofot yo'qligi\n\n**Hal qilish usullari:**\n1. **2 daqiqa qoida (GTD):** 2 daqiqadan qisqa ish → hozir bajaring\n2. **Vazifani maydalash:** «Loyiha» emas → «Birinchi jumla yozing»\n3. **Temptation bundling:** Yoqimli narsa (podcast) + yoqimsiz ish birgalikda\n4. **Implementation intention:** «Qachon X bo'lsa → Y qilaman» (aniq vaqt, joy)\n5. **Pomodoro:** 25 daqiqa — boshlanish to'sig'ini pasaytiradi",
  },
]

/* ── Multilingual rules (English + Russian) ─────────────────────── */
const MULTILINGUAL_RULES: { match: RegExp; reply: string }[] = [
  /* English greetings */
  { match: /^(hello|hi|hey|good\s+morning|good\s+evening|what'?s\s+up)\b/i,
    reply: "Hello! I'm **KotibaJON AI** 🤖\n\nI can answer in Uzbek about:\n• 📚 Books (Atomic Habits, Deep Work, Rich Dad...)\n• 🧠 Psychology, Finance, Learning science\n• 🤖 AI models (Claude Opus 4.8, GPT-4o...)\n• ♟️ Mental models & Success principles\n\nAsk me anything!" },
  { match: /^(what is|tell me about|explain|how does|how to|what are)\b/i,
    reply: "Great question! Please be more specific:\n\n• **Books:** \"Tell me about Atomic Habits\"\n• **AI:** \"What is Claude Opus 4.8?\"\n• **Psychology:** \"What is cognitive bias?\"\n• **Finance:** \"How does compound interest work?\"\n• **Learning:** \"How to learn faster?\"\n\nI'll give you a detailed answer!" },
  { match: /atomic\s*habits|james\s*clear/i,
    reply: "**Atomic Habits** — James Clear (2018) ⭐ 4.9/5\n\n**Core idea:** 1% better every day = **37.78x** improvement in a year!\n\n**4 Laws of Behavior Change:**\n• 👁️ **Make it Obvious** — clear cue\n• 🎯 **Make it Attractive** — link to desire\n• ✅ **Make it Easy** — reduce friction\n• 🏆 **Make it Satisfying** — immediate reward\n\n**Inversion** (breaking bad habits): Invisible → Unattractive → Difficult → Unsatisfying\n\n«Goals are for direction. Systems are for progress.»" },
  { match: /deep\s*work|cal\s*newport/i,
    reply: "**Deep Work** — Cal Newport (2016) ⭐ 4.8/5\n\n**Core idea:** The ability to focus without distraction is the most valuable skill in the modern economy.\n\n**Two types of work:**\n• 🧠 **Deep Work** — cognitively demanding, creates value\n• 📱 **Shallow Work** — emails, meetings, social media\n\n**4 Philosophies:**\n1. Monastic — eliminate all shallow work\n2. Bimodal — alternate deep/normal periods\n3. **Rhythmic** ← Most practical: fixed daily deep work\n4. Journalistic — for experienced practitioners\n\n«To produce at your peak level you need to work for extended periods with full concentration on a single task.»" },
  { match: /compound\s*interest|rule\s*of\s*72/i,
    reply: "**Compound Interest — The 8th Wonder of the World** 💰\n\n**Einstein:** «He who understands compound interest, earns it. He who doesn't, pays it.»\n\n**Rule of 72 (quick mental math):**\n72 ÷ annual return rate = years to double your money\n\nExample: 8% return → 72÷8 = **9 years to double**\n\n**Power of starting early:**\n$1,000 at age 18 @ 10%/year:\n• Age 28 → $2,594\n• Age 38 → $6,728\n• Age 58 → **$45,259**\n\n**Key lesson:** Time is more valuable than amount invested." },
  { match: /growth\s*mindset|fixed\s*mindset|carol\s*dweck/i,
    reply: "**Mindset** — Carol Dweck (2006) ⭐ 4.7/5\n\n**Two mindsets:**\n\n🔒 **Fixed Mindset:**\n«I can't do this — I'm not talented enough»\nFailure = I am bad\n\n🌱 **Growth Mindset:**\n«I can't do this **yet** — I'll learn»\nFailure = Learning opportunity\n\n**The magic word: «YET»**\n«I don't know this» → «I don't know this **yet**»\n\nResearch: People with growth mindset have **more active brains** when they make mistakes — they process and learn from errors." },
  { match: /cognitive\s*bias|confirmation\s*bias/i,
    reply: "**Cognitive Biases — Your Brain Tricks You** 🧠\n\n**Most common:**\n\n• **Confirmation Bias** — you notice info that confirms your beliefs, ignore contradictory evidence\n\n• **Sunk Cost Fallacy** — «I've invested so much, I must continue» — wrong! Only future matters.\n\n• **Dunning-Kruger** — those who know little feel very confident; experts feel uncertain\n\n• **Availability Bias** — memorable events seem more likely\n\n• **Anchoring** — first number/info becomes the reference point\n\nKnowing these makes you a **dramatically better decision-maker**." },
  { match: /how\s+to\s+learn\s+faster|learning\s+science|feynman\s+technique/i,
    reply: "**How to Learn Faster — Science** 🎓\n\n**1. Active Recall > Passive Reading**\nDon't re-read — close the book and try to recall. Research shows 2-3x more effective.\n\n**2. Spaced Repetition (Ebbinghaus)**\nReview at increasing intervals:\n1 day → 3 days → 7 days → 21 days → 30 days\n\n**3. Feynman Technique:**\n1. Choose a concept\n2. Explain it like you're teaching a child\n3. Find gaps in your explanation\n4. Simplify further\nIf you can't explain it simply, you don't understand it.\n\n**4. Sleep = Learning:**\nDuring sleep, the brain consolidates memories into long-term storage. Studying without sleep = writing on water." },
  /* Russian greetings */
  { match: /^(привет|здравствуй|добрый\s+день|добрый\s+вечер|салам|ассалому\s+алайкум)\b/i,
    reply: "Привет! Я **KotibaJON AI** 🤖\n\nМогу помочь с:\n• 📚 **Книги** — Атомные привычки, Думай и богатей, Глубокая работа...\n• 🧠 **Психология** — когнитивные ошибки, мотивация, стресс\n• 💰 **Финансы** — сложный процент, инвестиции, бюджет\n• 🎓 **Обучение** — техника Фейнмана, интервальные повторения\n• 💪 **Здоровье** — сон, спорт, питание\n• 🤖 **AI модели** — Claude Opus 4.8, GPT-4o, Gemini\n\nЗадайте вопрос!" },
  { match: /что\s+такое|расскажи\s+о|объясни|как\s+работает|как\s+научиться/i,
    reply: "Хороший вопрос! Уточните тему:\n\n• **Книги:** «Расскажи об Атомных привычках»\n• **AI:** «Что такое Claude Opus 4.8?»\n• **Психология:** «Что такое когнитивные ошибки?»\n• **Финансы:** «Как работает сложный процент?»\n• **Обучение:** «Как учиться быстрее?»\n\nДам подробный ответ!" },
  { match: /атомные\s+привычки|джеймс\s+клир/i,
    reply: "**Атомные привычки** — Джеймс Клир (2018) ⭐ 4.9/5\n\n**Главная идея:** 1% улучшения каждый день = рост в **37.78 раз** за год!\n\n**4 закона формирования привычек:**\n• 👁️ **Сделай очевидным** — чёткий триггер\n• 🎯 **Сделай привлекательным** — свяжи с желанием\n• ✅ **Сделай простым** — уменьши трение\n• 🏆 **Сделай приятным** — немедленное вознаграждение\n\n«Мы не поднимаемся до уровня своих целей — мы опускаемся до уровня своих систем.»" },
  { match: /сложный\s+процент|правило\s+72/i,
    reply: "**Сложный процент — 8-е чудо света** 💰\n\n**Правило 72 (быстрый подсчёт):**\n72 ÷ годовая ставка = лет до удвоения денег\n\nПример: 8% → 72÷8 = **9 лет до удвоения**\n\n**Эйнштейн:** «Тот, кто понимает сложный процент, зарабатывает его. Тот, кто не понимает — платит.»\n\n**Важнейший урок:** Начать раньше > вложить больше." },
  { match: /когнитивн|предвзятость|confirmation\s+bias/i,
    reply: "**Когнитивные ошибки** 🧠\n\n• **Предвзятость подтверждения** — замечаем только то, что подтверждает наши убеждения\n• **Ошибка невозвратных затрат** — «Я уже вложил столько, надо продолжать» — неверно!\n• **Эффект Даннинга-Крюгера** — мало знающие уверены в себе, эксперты — сомневаются\n• **Эффект якоря** — первое число становится точкой отсчёта\n\nЗнание этих ошибок делает вас значительно лучшим decision-maker-ом." },
  { match: /как\s+(?:быстро\s+)?учиться|техника\s+фейнмана|метод\s+фейнмана/i,
    reply: "**Как учиться быстрее — наука** 🎓\n\n**1. Активное вспоминание > пассивное чтение**\nНе перечитывай — закрой книгу и попробуй вспомнить. В 2-3 раза эффективнее.\n\n**2. Интервальные повторения (Эббингауз)**\n1 день → 3 дня → 7 дней → 21 день → 30 дней\n\n**3. Техника Фейнмана:**\n1. Выбери концепцию\n2. Объясни её как ребёнку\n3. Найди пробелы\n4. Упрости\nЕсли не можешь объяснить просто — ты ещё не понял.\n\n**4. Сон = Обучение:**\nВо сне мозг переносит знания в долгосрочную память." },
  { match: /прокрастинац|откладывать|лень/i,
    reply: "**Прокрастинация — научное объяснение** 🐌\n\n**Прокрастинация — НЕ проблема управления временем — это проблема управления эмоциями.**\n\nМозг избегает задачи, вызывающей тревогу/страх/сомнение.\n\n**Решения:**\n• **Правило 2 минут (GTD):** Задача < 2 мин → сделай сейчас\n• **Разбить на части:** Не «Проект» → «Написать первое предложение»\n• **Помодоро:** 25 минут — снижает барьер начала\n• **Implementation intention:** «Когда X → я делаю Y» (конкретное время и место)\n• **Temptation bundling:** Приятное + Неприятная задача вместе" },
]

const AI_DEFAULTS = [
  "Gadimin Hikmatlar: *«Reja bor yerda — muvaffaqiyat bor.»*\n\nAniqroq savol bering — psixologiya, moliya, sog'liq, o'rganish, kitoblar yoki AI haqida real ma'lumot beraman! 📚",
  "I can help in **Uzbek 🇺🇿**, **Russian 🇷🇺** and **English 🇬🇧**!\n\nTry: «Atomic Habits», «Сложный процент», «Kognitiv xatolar», «Claude Opus 4.8»",
  "Savol berish uchun mavzulardan birini tanlang:\n• 📚 Kitob · Book · Книга\n• 🤖 AI modellar · AI models\n• 🧠 Psixologiya · Psychology · Психология\n• 💰 Moliya · Finance · Финансы\n• 🎓 O'rganish · Learning · Обучение\n• 💪 Sog'liq · Health · Здоровье\n• ♟️ Mental modellar · Mental models",
]

const QUICK_PROMPTS = [
  "What is Atomic Habits?",
  "Когнитивные ошибки",
  "Murakkab foiz qanday ishlaydi?",
  "Claude Opus 4.8 nima?",
  "How to learn faster?",
]

function getAiReply(input: string): string {
  const checks = [AI_MODELS_RULES, BOOK_RULES, SCIENCE_RULES, MULTILINGUAL_RULES, APP_RULES]
  for (const rules of checks) {
    const hit = rules.find(r => r.match.test(input))
    if (hit) return hit.reply
  }
  return AI_DEFAULTS[Math.floor(Math.random() * AI_DEFAULTS.length)]
}

/* ══════════════════════════════════════════════════════════════════
   VOICE ASSISTANT — wake word + browser commands
   ══════════════════════════════════════════════════════════════════ */

/* Wake word: "hey tom" (+ bir nechta variant) */
const WAKE_WORD = /hey\s+tom|hey\s+tom[!.,]?|хэй\s+том|hey\s+tome/i

export type VoiceState = 'off' | 'listening' | 'awake' | 'processing'

/* ══════════════════════════════════════════════════════════════════
   DESKTOP APP OPENER
   window.location.href — Chrome da URI scheme ishonchli ishlaydi
   ══════════════════════════════════════════════════════════════════ */
function openDesktopApp(scheme: string, name: string): string {
  window.location.href = scheme
  return `✅ ${name} ochilmoqda`
}

/* ── KotibaJON bo'lim ma'lumotlari ─────────────────────────────── */
const SECTION_INFO: Record<string, { path: string; label: string; hint: string }> = {
  tasks   : { path:'/tasks',     label:'Vazifalar',  hint:"Vazifalar bo'limi: + tugmasi bilan yangi vazifa qo'shing. Muhimlik darajasini (shoshilinch/yuqori/o'rta/past) belgilang. Kanban ko'rinishida jarayonni kuzating." },
  finance : { path:'/finance',   label:'Moliya',     hint:"Moliya bo'limi: daromad va xarajatlaringizni yozing. Oylik byudjet belgilang. Grafikda qayerga ketganini ko'ring." },
  library : { path:'/library',   label:'Kutubxona',  hint:"Kutubxona: 8 ta kitob bor. Bosing — 3D betlash bilan o'qing. Sahifalarni belgilang, progress saqlanadi." },
  goals   : { path:'/goals',     label:'Maqsadlar',  hint:"Maqsadlar bo'limi: yillik maqsad qo'ying, bosqichlarga bo'ling, foiz progress ko'ring. SMART tizimidan foydalaning." },
  habits  : { path:'/habits',    label:'Odatlar',    hint:"Odatlar: kunlik odatlarni belgilang, streak yig'ing. Har kuni belgilash — izchillik asosi." },
  planner : { path:'/planner',   label:'Planner',    hint:"Kun tartibi: vaqt bloklariga bo'ling. Bloklarni sudrang. Pomodoro rejimini yoqing." },
  reports : { path:'/reports',   label:'Hisobotlar', hint:"Hisobotlar: haftalik va oylik samaradorlik grafiklari. O'tgan oy bilan solishtiring." },
  dashboard:{ path:'/dashboard', label:'Dashboard',  hint:"Dashboard: bugungi vazifalar, moliya va maqsadlar umumiy ko'rinishda." },
  dates   : { path:'/dates',     label:'Sanalar',    hint:"Muhim sanalar: tug'ilgan kunlar, yilliklar, to'lov sanalarini qo'shing. Avtomatik eslatma o'rnatiladi." },
  settings: { path:'/settings',  label:'Sozlamalar', hint:"Sozlamalar: profil, bildirishnomalar, ovoz, desktop widget va ko'rinishni boshqaring." },
}

function goToSection(key: string): string {
  const s = SECTION_INFO[key]
  if (!s) return ''
  /* BroadcastChannel — widget dan ham asosiy oynaga navigatsiya */
  try {
    const bc = new BroadcastChannel('kj-nav')
    bc.postMessage({ path: s.path })
    bc.close()
  } catch (_) {}
  /* Agar hozir shu saytda bo'lsa — to'g'ridan navigatsiya */
  if (window.location.hostname.includes('kotibajon') ||
      window.location.hostname === 'localhost') {
    window.location.href = s.path
  } else if (window.opener && !window.opener.closed) {
    window.opener.location.href = s.path
    window.opener.focus()
  } else {
    window.open(`https://kotibajon.vercel.app${s.path}`, '_blank')
  }
  return `✅ ${s.label} — ${s.hint}`
}

/* ── Buyruqlar ──────────────────────────────────────────────────── */
interface BCmd { match: RegExp; run: (m: RegExpMatchArray) => string }

const BROWSER_CMDS: BCmd[] = [
  /* ── Desktop ilovalar (URI scheme, fallback yo'q — faqat app) ── */
  { match: /telegram/i,
    run: () => openDesktopApp('tg://', 'Telegram') },
  { match: /whatsapp/i,
    run: () => openDesktopApp('whatsapp://', 'WhatsApp') },
  { match: /discord/i,
    run: () => openDesktopApp('discord://', 'Discord') },
  { match: /spotify/i,
    run: () => openDesktopApp('spotify://', 'Spotify') },
  { match: /zoom/i,
    run: () => openDesktopApp('zoommtg://zoom.us/join', 'Zoom') },
  { match: /slack/i,
    run: () => openDesktopApp('slack://', 'Slack') },
  { match: /notion/i,
    run: () => openDesktopApp('notion://', 'Notion') },
  { match: /figma/i,
    run: () => openDesktopApp('figma://', 'Figma') },
  { match: /vscode|visual\s*studio\s*code/i,
    run: () => openDesktopApp('vscode://', 'VS Code') },
  { match: /teams|microsoft\s*teams/i,
    run: () => openDesktopApp('msteams://', 'Teams') },
  { match: /skype/i,
    run: () => openDesktopApp('skype:?call', 'Skype') },
  { match: /steam/i,
    run: () => openDesktopApp('steam://', 'Steam') },
  { match: /obsidian/i,
    run: () => openDesktopApp('obsidian://', 'Obsidian') },
  { match: /instagram/i,
    run: () => openDesktopApp('instagram://', 'Instagram') },
  { match: /twitter|x\.com/i,
    run: () => openDesktopApp('twitter://', 'X (Twitter)') },
  { match: /1password/i,
    run: () => openDesktopApp('onepassword://', '1Password') },

  /* ── Web qidiruv ilovalar ── */
  { match: /google\s+(.+)/i,
    run: m => { window.open(`https://google.com/search?q=${encodeURIComponent(m[1].trim())}`, '_blank'); return `✅ Google: "${m[1].trim()}"` } },
  { match: /youtube\s+(.+)/i,
    run: m => { window.open(`https://youtube.com/results?search_query=${encodeURIComponent(m[1].trim())}`, '_blank'); return `✅ YouTube: "${m[1].trim()}"` } },
  { match: /wikipedia\s+(.+)/i,
    run: m => { window.open(`https://uz.wikipedia.org/wiki/${encodeURIComponent(m[1].trim())}`, '_blank'); return `✅ Wikipedia: "${m[1].trim()}"` } },
  { match: /google/i,     run: () => { window.open('https://google.com', '_blank'); return '✅ Google ochildi' } },
  { match: /youtube/i,    run: () => { window.open('https://youtube.com', '_blank'); return '✅ YouTube ochildi' } },
  { match: /wikipedia/i,  run: () => { window.open('https://wikipedia.org', '_blank'); return '✅ Wikipedia ochildi' } },
  { match: /gmail|pochta/i,run: () => { window.open('https://mail.google.com', '_blank'); return '✅ Gmail ochildi' } },
  { match: /ob.?havo|weather|погода/i, run: () => { window.open('https://weather.com', '_blank'); return '✅ Ob-havo ochildi' } },
  { match: /maps?|xarita|карта/i, run: () => { window.open('https://maps.google.com', '_blank'); return '✅ Maps ochildi' } },
  { match: /tarjima|translate|перевод/i, run: () => { window.open('https://translate.google.com', '_blank'); return '✅ Tarjimon ochildi' } },
  { match: /github/i,     run: () => { window.open('https://github.com', '_blank'); return '✅ GitHub ochildi' } },
  { match: /chatgpt|gpt/i,run: () => { window.open('https://chat.openai.com', '_blank'); return '✅ ChatGPT ochildi' } },
  { match: /claude/i,     run: () => { window.open('https://claude.ai', '_blank'); return '✅ Claude ochildi' } },

  /* ── KotibaJON bo'limlari ── */
  { match: /vazifa|task/i,      run: () => goToSection('tasks') },
  { match: /moliya|finance/i,   run: () => goToSection('finance') },
  { match: /kutubxon|library/i, run: () => goToSection('library') },
  { match: /maqsad|goal/i,      run: () => goToSection('goals') },
  { match: /odat|habit/i,       run: () => goToSection('habits') },
  { match: /planner|kun\s*tartib/i, run: () => goToSection('planner') },
  { match: /hisobot|report/i,   run: () => goToSection('reports') },
  { match: /sana|date/i,        run: () => goToSection('dates') },
  { match: /sozlam|setting/i,   run: () => goToSection('settings') },
  { match: /dashboard|bosh\s*sahifa|главная/i, run: () => goToSection('dashboard') },
]

function execBrowserCmd(text: string): string | null {
  for (const cmd of BROWSER_CMDS) {
    const m = text.match(cmd.match)
    if (m) return cmd.run(m)
  }
  return null
}

/* ══════════════════════════════════════════════════════════════════
   TEXT-TO-SPEECH  — Web Speech API SpeechSynthesis
   ══════════════════════════════════════════════════════════════════ */

/* Global flag — recognition "hey tom"ni o'zidan eshitmasin */
let ttsActive = false

const WAKE_REPLIES = [
  "Hello! How can I help you today?",
  "Hey! What can I do for you?",
  "Yes, I'm listening.",
  "Hi there! How can I assist?",
]

function speakTTS(text: string, onDone?: () => void) {
  if (typeof window === 'undefined' || !window.speechSynthesis) { onDone?.(); return }
  window.speechSynthesis.cancel()

  const u       = new SpeechSynthesisUtterance(text)
  u.lang        = 'en-US'
  u.rate        = 0.92
  u.pitch       = 1.08
  u.volume      = 1

  u.onstart = () => { ttsActive = true }
  u.onend   = () => { ttsActive = false; onDone?.() }
  u.onerror = () => { ttsActive = false; onDone?.() }

  const go = () => {
    const voices = window.speechSynthesis.getVoices()
    /* Google/Neural/Natural sesli ovozni afzal ko'ramiz */
    const pick = voices.find(v => v.lang === 'en-US' && /google|natural|neural|premium/i.test(v.name))
              || voices.find(v => v.lang.startsWith('en-'))
              || voices[0]
    if (pick) u.voice = pick
    window.speechSynthesis.speak(u)
  }

  if (window.speechSynthesis.getVoices().length > 0) go()
  else window.speechSynthesis.addEventListener('voiceschanged', go, { once: true })
}

/* Bajariladigan buyruq natijasini inglizchaga o'giradi */
function toSpeech(result: string): string {
  return result
    .replace(/^✅\s*/, '')
    .replace(/Google:\s*"(.+)"/, 'Opening Google for $1')
    .replace(/YouTube:\s*"(.+)"/, 'Playing YouTube for $1')
    .replace(/Wikipedia:\s*"(.+)"/, 'Opening Wikipedia for $1')
    .replace(' ochildi', ' is now open')
    .replace("bo'limiga o'tildi", 'section opened')
    .replace('Plannerga o\'tildi', 'Planner is now open')
}

/* ══════════════════════════════════════════════════════════════════
   useVoice  — v4: auto-start, TTS feedback, no button press needed
   ══════════════════════════════════════════════════════════════════ */
function useVoice(
  enabled : boolean,
  onState : (s: VoiceState) => void,
  onWake  : () => void,
  onCmd   : (transcript: string, cmdResult: string | null) => void,
) {
  const stateRef   = useRef<VoiceState>('off')
  const recRef     = useRef<any>(null)
  const awakeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  /* Callback reflar — closure eskirib qolmasin */
  const cb = useRef({ onState, onWake, onCmd })
  useEffect(() => { cb.current = { onState, onWake, onCmd } })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) return

    /* ── state setter ── */
    function set(s: VoiceState) {
      stateRef.current = s
      cb.current.onState(s)
    }

    /* ── recognition session ── */
    function start() {
      if (stateRef.current === 'off') return
      try { recRef.current?.abort() } catch (_) {}

      const rec: any = new SR()
      recRef.current = rec

      rec.lang            = 'en-US'  // ← "hey tom" aniq taniladi
      rec.continuous      = true     // to'xtovsiz
      rec.interimResults  = true     // har so'zda — tezkor
      rec.maxAlternatives = 3        // bir nechta variant

      rec.onresult = (e: any) => {
        /* Bot o'z ovozini eshitmasin */
        if (ttsActive) return

        /* Faqat yangi natijani olamiz */
        const batch = e.results[e.resultIndex]
        if (!batch) return

        const alts: string[] = []
        for (let j = 0; j < batch.length; j++) {
          alts.push(batch[j].transcript.toLowerCase().trim())
        }
        const tx      = alts[0]
        const isFinal = batch.isFinal

        /* ── WAKE WORD ── */
        if (stateRef.current === 'listening') {
          if (alts.some(a => WAKE_WORD.test(a))) {
            /* Bitta gapda: "hey tom telegram" → darhol bajar */
            const afterWake = tx.replace(WAKE_WORD, '').replace(/^\W+/, '').trim()
            if (afterWake.length > 1) {
              set('processing')
              const res = execBrowserCmd(afterWake)
              cb.current.onCmd(afterWake, res ?? afterWake)
              setTimeout(() => { if (stateRef.current !== 'off') set('listening') }, 2000)
              return
            }
            /* Faqat wake word — buyruq kutish rejimi */
            if (awakeTimer.current) clearTimeout(awakeTimer.current)
            set('awake')
            cb.current.onWake()
            awakeTimer.current = setTimeout(() => {
              if (stateRef.current === 'awake') set('listening')
            }, 7000)
          }

        /* ── BUYRUQ (alohida gapda) ── */
        } else if (stateRef.current === 'awake' && isFinal) {
          const clean = tx.replace(WAKE_WORD, '').replace(/^\W+/, '').trim()
          if (!clean || clean.length < 2) return
          if (awakeTimer.current) clearTimeout(awakeTimer.current)
          set('processing')
          const res = execBrowserCmd(clean)
          cb.current.onCmd(clean, res ?? clean)
          setTimeout(() => { if (stateRef.current !== 'off') set('listening') }, 2000)
        }
      }

      /* Session tugishi — qayta boshlash */
      rec.onend = () => {
        if (stateRef.current !== 'off') setTimeout(start, 200)
      }

      rec.onerror = (ev: any) => {
        const err = ev?.error ?? ''
        if (err === 'not-allowed' || err === 'service-not-allowed') {
          set('off')
          alert(
            'Mikrofon ruxsati yo\'q!\n\n' +
            'Chrome: manzil satrida 🔒 yoki 🎤 belgisini bosing\n' +
            '→ Mikrofon → Har doim ruxsat → Sahifani yangilang'
          )
        }
        /* no-speech, aborted, network → onend qayta boshlaydi */
      }

      try { rec.start() } catch (_) { setTimeout(start, 500) }
    }

    /* ── enabled o'zgarganda ── */
    if (!enabled) {
      if (awakeTimer.current) clearTimeout(awakeTimer.current)
      try { recRef.current?.abort() } catch (_) {}
      recRef.current = null
      set('off')
      return
    }

    set('listening')
    start()

    return () => {
      if (awakeTimer.current) clearTimeout(awakeTimer.current)
      stateRef.current = 'off'
      try { recRef.current?.abort() } catch (_) {}
    }
  }, [enabled])
}

/* ── Desktop widget opener ──────────────────────────────────────── */
function openDesktopWidget() {
  const sw = window.screen.width
  const sh = window.screen.height
  const ww = 160, wh = 230
  const left = sw - ww - 20
  const top  = sh - wh - 60
  const win  = window.open(
    '/widget',
    'kotibabot_widget',
    `width=${ww},height=${wh},left=${left},top=${top},` +
    'titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=yes',
  )
  if (!win) alert('Pop-up bloklandi!\nBrauzerda pop-up ruxsatini bering va qayta bosing.')
}

/* ── Page info ──────────────────────────────────────────────────── */
type PageIconKey = 'dashboard' | 'tasks' | 'finance' | 'goals' | 'dates' | 'reports' | 'library' | 'habits' | 'planner' | 'settings' | 'bot'

const PAGE_ICON_MAP: Record<PageIconKey, React.ElementType> = {
  dashboard : LayoutDashboard,
  tasks     : ListTodo,
  finance   : Wallet,
  goals     : Target,
  dates     : CalendarDays,
  reports   : BarChart2,
  library   : Library,
  habits    : Flame,
  planner   : Calendar,
  settings  : Settings2,
  bot       : Bot,
}

interface PageInfo { iconKey: PageIconKey; title: string; desc: string; tips: string[] }

const PAGE_INFO: Record<string, PageInfo> = {
  '/dashboard': {
    iconKey: 'dashboard', title: 'Dashboard',
    desc: "Bu yerda bugungi vazifalar, moliya va maqsadlaringiz umumiy ko'rinishda. Kunni rejalashtirish uchun eng yaxshi joy!",
    tips: ["Streak uzing! Ketma-ket faollik — eng kuchli motivatsiya.", "Har kuni 3 ta eng muhim vazifani belgilang."],
  },
  '/tasks': {
    iconKey: 'tasks', title: 'Vazifalar',
    desc: "Bu bo'limda vazifa qo'shish, tahrirlash, muhimlik bo'yicha saralash mumkin.",
    tips: ["Shoshilinch vazifalarni birinchi bajaring!", "Subtasklardan foydalaning — katta ishni bo'ling.", "Eslatma qo'ying — men vaqtida xabar beraman! 🔔"],
  },
  '/finance': {
    iconKey: 'finance', title: 'Moliya',
    desc: "Daromad va xarajatlarni yozing, byudjet belgilang, moliyaviy grafiklarda o'zgarishlarni kuzating.",
    tips: ["50/30/20: zaruriyat·xohish·jamg'arma.", "Kichik xarajatlar ham yig'iladi — hammasini yozing!"],
  },
  '/goals': {
    iconKey: 'goals', title: 'Maqsadlar',
    desc: "Yillik maqsadlarni qo'ying, bosqichlarga bo'ling va progress foizini real vaqtda kuzating.",
    tips: ["SMART maqsad: Aniq, O'lchanadigan, Erishiladigan, Real, Vaqtli.", "Har hafta progress yangilang!"],
  },
  '/dates': {
    iconKey: 'dates', title: 'Muhim Sanalar',
    desc: "Tug'ilgan kunlar, yilliklar, to'lovlar va bayramlarni qo'shing — eslatmalar o'rnatiladi.",
    tips: ["7, 3 va 1 kun oldinroq eslatma qo'ying!", "To'lov sanalarini byudjetingizga ham kiritib qo'ying."],
  },
  '/reports': {
    iconKey: 'reports', title: 'Hisobotlar',
    desc: "Haftalik va oylik samaradorlik grafiklarini, xarajat trendlarini va maqsad progressini ko'ring.",
    tips: ["Haftalik hisobotni juma kuni o'qing.", "O'tgan oy bilan solishtirib o'sishingizni ko'ring."],
  },
  '/library': {
    iconKey: 'library', title: 'Kutubxona',
    desc: "Odamni yuksaltiradigan eng yaxshi kitoblar shu yerda! Har bir kitob — yangi dunyo.",
    tips: ["Har kuni 20 daqiqa o'qish — yiliga 12 kitob!", "Kitob o'qib bo'lgach asosiy fikrlarni yozing.", "\"Gadimin Hikmatlar\" — boshlanish uchun ajoyib!"],
  },
  '/habits': {
    iconKey: 'habits', title: 'Odatlar',
    desc: "Kundalik odatlaringizni belgilang va streak yig'ing! Har bir kun — yangi imkoniyat.",
    tips: ["Birinchi 21 kun eng qiyin — turing!", "Kichik odat → katta o'zgarish.", "Streak uzilsa xafa bo'lmang — ertaga davom eting!"],
  },
  '/planner': {
    iconKey: 'planner', title: 'Kun Tartibi',
    desc: "Kunni vaqt bloklarga bo'lib rejalashtiring. Har bir ish uchun boshlanish va tugash vaqtini belgilang!",
    tips: ["Drag qilib bloklarni ko'chiring.", "Pomodoro yoqib diqqatni oshiring!", "Kun oxirida bajarilgan bloklarni belgilang."],
  },
  '/settings': {
    iconKey: 'settings', title: 'Sozlamalar',
    desc: "Profil ma'lumotlari, bildirishnomalar, interfeys ko'rinishi va tilni boshqaring.",
    tips: ["Bildirishnomalarni yoqing!", "Profilingizni to'ldiring — ilovangiz sizga mos ishlaydi."],
  },
}

const DEFAULT_INFO: PageInfo = {
  iconKey: 'bot', title: 'KotibaBot',
  desc: "Salom! Men KotibaBot — mushukcha yordamchingizman! Bosing — «Gadimin Hikmatlar» kitobidan maslahat beraman. 📖",
  tips: ["Har sahifada sizga mos maslahat beraman!"],
}

/* ── Global trigger ─────────────────────────────────────────────── */
export function triggerMascot(message: string, mode: Emotion | 'lookup' = 'happy') {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent('kotibabot', { detail: { message, mode } }))
}

/* ── Typing hook ────────────────────────────────────────────────── */
function useTyping(text: string, speed = 16) {
  const [shown, setShown] = useState('')
  const [ready, setReady] = useState(false)
  useEffect(() => {
    setShown(''); setReady(false)
    if (!text) return
    let i = 0
    const id = setInterval(() => {
      i++; setShown(text.slice(0, i))
      if (i >= text.length) { clearInterval(id); setReady(true) }
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])
  return { shown, ready }
}

function rnd(a: number, b: number) { return Math.floor(Math.random() * (b - a) + a) }

/* ================================================================
   CSS
   ================================================================ */
const CSS = `
  @keyframes em-idle {
    0%,100%{ transform:translateY(0) rotate(0deg); }
    35%    { transform:translateY(-12px) rotate(-2deg); }
    70%    { transform:translateY(-6px) rotate(1.5deg); }
  }
  @keyframes em-think {
    0%,100%{ transform:rotate(-5deg) translateY(0); }
    50%    { transform:rotate(-9deg) translateY(-6px) scale(0.97); }
  }
  @keyframes em-read {
    0%,100%{ transform:translateY(0) rotate(0deg) scale(1); }
    30%    { transform:translateY(-9px) rotate(-2deg) scale(1.02); }
    65%    { transform:translateY(-5px) rotate(1.5deg) scale(1.01); }
  }
  @keyframes em-lookup {
    0%,100%{ transform:rotate(0deg) scale(1); }
    20%    { transform:rotate(-4deg) scale(1.05); }
    40%    { transform:rotate(4deg) scale(1.07); }
    60%    { transform:rotate(-3deg) scale(1.04); }
    80%    { transform:rotate(3deg) scale(1.02); }
  }
  @keyframes em-happy {
    0%,100%{ transform:translateY(0) scale(1) rotate(0deg); }
    30%    { transform:translateY(-18px) scale(1.08) rotate(-3deg); }
    60%    { transform:translateY(-22px) scale(1.11) rotate(3deg); }
    80%    { transform:translateY(-10px) scale(1.05) rotate(-1deg); }
  }
  @keyframes em-wave {
    0%,100%{ transform:rotate(-5deg) translateY(0); }
    50%    { transform:rotate(5deg) translateY(-8px); }
  }
  @keyframes em-surprise {
    0%  { transform:scale(1) rotate(0); }
    15% { transform:scale(1.14) rotate(-8deg); }
    35% { transform:scale(1.16) rotate(8deg); }
    55% { transform:scale(1.1) rotate(-4deg); }
    75% { transform:scale(1.06) rotate(4deg); }
    100%{ transform:scale(1) rotate(0); }
  }
  @keyframes em-ai {
    0%   { transform:translateY(0px)   rotate(-4deg) scale(1);    filter:drop-shadow(0 0 3px rgba(139,92,246,.25)); }
    20%  { transform:translateY(-10px) rotate(-1deg) scale(1.06); filter:drop-shadow(0 0 10px rgba(139,92,246,.70)); }
    45%  { transform:translateY(-16px) rotate( 3deg) scale(1.10); filter:drop-shadow(0 0 18px rgba(139,92,246,.95)); }
    70%  { transform:translateY(-10px) rotate( 1deg) scale(1.07); filter:drop-shadow(0 0 12px rgba(139,92,246,.75)); }
    85%  { transform:translateY(-4px)  rotate(-2deg) scale(1.03); filter:drop-shadow(0 0 6px  rgba(139,92,246,.40)); }
    100% { transform:translateY(0px)   rotate(-4deg) scale(1);    filter:drop-shadow(0 0 3px  rgba(139,92,246,.25)); }
  }
  @keyframes dot-pulse {
    0%,100%{ opacity:.3; transform:scale(.6); }
    50%    { opacity:1;  transform:scale(1.3); }
  }
  @keyframes star-pop {
    from{ transform:scale(.7) rotate(0deg); opacity:.6; }
    to  { transform:scale(1.5) rotate(25deg); opacity:1; }
  }
  @keyframes wave-hand {
    from{ transform:rotate(-25deg); }
    to  { transform:rotate(20deg); }
  }
  @keyframes exclaim {
    from{ transform:scale(.85) translateY(3px); }
    to  { transform:scale(1.25) translateY(-3px); }
  }
  @keyframes page-flip {
    0%,100%{ transform:scaleX(1); }
    50%    { transform:scaleX(-0.4); }
  }
  @keyframes glass-glow {
    0%,100%{ opacity:.4; transform:translateX(-50%) scaleX(1); }
    50%    { opacity:.9; transform:translateX(-50%) scaleX(1.3); }
  }
  @keyframes ai-ring-spin     { from{transform:rotate(0deg)}   to{transform:rotate(360deg)} }
  @keyframes ai-ring-spin-rev { from{transform:rotate(0deg)}   to{transform:rotate(-360deg)} }
  @keyframes ai-core-pulse {
    0%,100%{ opacity:.5; transform:scale(.85); }
    50%    { opacity:1;  transform:scale(1.1); }
  }
  @keyframes ai-dot-orbit {
    0%  { transform:rotate(0deg)   translateX(46px) rotate(0deg); }
    100%{ transform:rotate(360deg) translateX(46px) rotate(-360deg); }
  }
  @keyframes slide-up-bot {
    from{ opacity:0; transform:translateY(14px) scale(.97); }
    to  { opacity:1; transform:translateY(0)    scale(1); }
  }
  @keyframes img-in {
    from{ opacity:0; transform:scale(.94); }
    to  { opacity:1; transform:scale(1); }
  }
  @keyframes ai-typing {
    0%,60%,100%{ transform:translateY(0);   opacity:.4; }
    30%        { transform:translateY(-5px); opacity:1; }
  }
  .kj-no-scrollbar::-webkit-scrollbar{ display:none; }
  .kj-no-scrollbar{ -ms-overflow-style:none; scrollbar-width:none; }

  @keyframes voice-ring {
    0%,100%{ box-shadow:0 0 0 0   rgba(16,185,129,.7); }
    50%    { box-shadow:0 0 0 14px rgba(16,185,129,0);  }
  }
  @keyframes voice-awake {
    0%,100%{ box-shadow:0 0 0 0   rgba(16,185,129,.9),0 0 20px rgba(16,185,129,.4); }
    50%    { box-shadow:0 0 0 18px rgba(16,185,129,0),  0 0 40px rgba(16,185,129,.8); }
  }
  @keyframes mic-pulse {
    0%,100%{ transform:scale(1);   opacity:.65; }
    50%    { transform:scale(1.25);opacity:1;   }
  }
  @keyframes voice-process {
    0%    { transform:rotate(0deg); }
    100%  { transform:rotate(360deg); }
  }
`

const ANIM: Record<Emotion, string> = {
  idle      : 'em-idle 3.2s ease-in-out infinite',
  think     : 'em-think 2.4s ease-in-out infinite',
  write     : 'em-read 2.8s ease-in-out infinite',
  happy     : 'em-happy 0.55s ease-in-out infinite',
  wave      : 'em-wave 0.6s ease-in-out infinite',
  surprised : 'em-surprise 0.38s ease-in-out 5',
  ai        : 'em-ai 2.8s cubic-bezier(.45,0,.55,1) infinite',
}

/* ================================================================
   OVERLAYS
   ================================================================ */
const ThinkDots = memo(() => (
  <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-end gap-1.5 pointer-events-none">
    {[0,1,2].map(i => (
      <span key={i} className="rounded-full bg-yellow-400 block" style={{
        width:6+i*3, height:6+i*3,
        boxShadow:'0 0 8px rgba(250,204,21,.9)',
        animation:`dot-pulse .9s ease-in-out ${i*.22}s infinite`,
      }}/>
    ))}
  </div>
))
ThinkDots.displayName = 'ThinkDots'

const HappyStars = memo(() => (
  <div className="absolute inset-0 pointer-events-none overflow-visible">
    {[
      {top:'-30%',left:'-18%',sz:14,d:0,   c:'#FBBF24'},
      {top:'-42%',left:'55%', sz:12,d:.12, c:'#F59E0B'},
      {top:'-15%',left:'88%', sz:8, d:.25, c:'#4BFFB5'},
      {top:'10%', left:'-28%',sz:9, d:.08, c:'#FB923C'},
      {top:'-50%',left:'28%', sz:16,d:.04, c:'#FBBF24'},
    ].map((it,i) => (
      <div key={i} className="absolute" style={{
        top:it.top, left:it.left,
        animation:`star-pop .52s ease-in-out ${it.d}s infinite alternate`,
      }}>
        <svg viewBox="0 0 24 24" fill={it.c} style={{width:it.sz,height:it.sz,filter:`drop-shadow(0 0 4px ${it.c})`}}>
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
        </svg>
      </div>
    ))}
  </div>
))
HappyStars.displayName = 'HappyStars'

const WaveHand = memo(() => (
  <div className="absolute -top-2 -right-4 pointer-events-none select-none"
    style={{animation:'wave-hand .35s ease-in-out infinite alternate',transformOrigin:'bottom center'}}>
    <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center shadow-lg"
      style={{boxShadow:'0 0 12px rgba(251,191,36,.7)'}}>
      <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 11V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v5"/>
        <path d="M14 10V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v2"/>
        <path d="M10 10.5V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v8"/>
        <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
      </svg>
    </div>
  </div>
))
WaveHand.displayName = 'WaveHand'

const SurpriseMarks = memo(() => (
  <div className="absolute -top-7 left-1/2 -translate-x-1/2 pointer-events-none select-none flex gap-0.5">
    {['!','!'].map((c,i) => (
      <span key={i} className="text-red-500 font-black text-xl leading-none" style={{
        textShadow:'0 0 10px rgba(239,68,68,.8)',
        animation:`exclaim .28s ease-out ${i*.08}s infinite alternate`,
      }}>{c}</span>
    ))}
  </div>
))
SurpriseMarks.displayName = 'SurpriseMarks'

const ReadingGlow = memo(({ searching }: { searching: boolean }) => (
  <div className="absolute inset-0 pointer-events-none overflow-visible">
    <div className="absolute top-5 left-1/2" style={{animation:'glass-glow 1.8s ease-in-out infinite'}}>
      <div className="h-1 w-12 rounded-full"
        style={{background:'linear-gradient(90deg,transparent,rgba(251,191,36,.7),transparent)'}}/>
    </div>
    {searching && (
      <>
        {[0,1,2].map(i => (
          <div key={i} className="absolute right-1 font-bold text-base select-none text-amber-400"
            style={{top:`${22+i*18}%`,animation:`page-flip .65s ease-in-out ${i*.18}s infinite`,
              textShadow:'0 0 8px rgba(251,191,36,.8)'}}>≡</div>
        ))}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2
          bg-amber-50 dark:bg-amber-900/50 border border-amber-300 dark:border-amber-500/50
          rounded-full px-3 py-1 shadow-lg whitespace-nowrap
          flex items-center gap-1.5 text-[11px] font-bold text-amber-700 dark:text-amber-300">
          <BookOpen className="w-3 h-3"/>Qidirmoqda
          {[0,1,2].map(i=>(
            <span key={i} className="inline-block w-1 h-1 rounded-full bg-amber-500"
              style={{animation:`dot-pulse .8s ease-in-out ${i*.2}s infinite`}}/>
          ))}
        </div>
      </>
    )}
  </div>
))
ReadingGlow.displayName = 'ReadingGlow'

const AiGlow = memo(() => (
  <div className="absolute inset-0 pointer-events-none overflow-visible">
    <div className="absolute inset-[-10px] rounded-full border-2 border-violet-400/30"
      style={{animation:'ai-ring-spin 4s linear infinite'}}/>
    <div className="absolute inset-[-5px] rounded-full border border-violet-300/20 border-dashed"
      style={{animation:'ai-ring-spin-rev 6s linear infinite'}}/>
    <div className="absolute inset-[10px] rounded-full bg-violet-500/10"
      style={{animation:'ai-core-pulse 2.4s ease-in-out infinite'}}/>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{animation:'ai-dot-orbit 3s linear infinite'}}>
      <div className="w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_6px_rgba(167,139,250,1)]"/>
    </div>
  </div>
))
AiGlow.displayName = 'AiGlow'

/* ================================================================
   THOUGHT CLOUD BUBBLE  (small — for normal/lookup mode)
   ================================================================ */
function Bubble({
  shown, ready, info, tipIdx, total,
  onNext, onClose, flipLeft, isLookup,
}: {
  shown:string; ready:boolean; info:PageInfo
  tipIdx:number; total:number
  onNext:()=>void; onClose:()=>void
  flipLeft:boolean; isLookup:boolean
}) {
  const bg     = isLookup ? 'bg-amber-50 dark:bg-[#1A1100]' : 'bg-white dark:bg-[#1C1C2E]'
  const shadow = isLookup
    ? 'drop-shadow(0 0 1.5px rgba(217,119,6,.20)) drop-shadow(0 7px 22px rgba(217,119,6,.22))'
    : 'drop-shadow(0 0 1.5px rgba(0,0,0,.08)) drop-shadow(0 7px 22px rgba(0,0,0,.16))'

  return (
    <div className={cn('absolute bottom-full mb-2 z-20 w-52', flipLeft?'right-0':'left-0')}
      style={{animation:'slide-up-bot .3s cubic-bezier(.16,1,.3,1) both'}}>
      <div style={{filter:shadow}}>

        {/* Cloud bumps */}
        <div className={cn('flex items-end gap-[3px] mb-[-8px]',
          flipLeft?'justify-end pr-4 pl-8':'justify-start pl-4 pr-8')}>
          {[15,22,18,20,14].map((s,i)=>(
            <div key={i} className={cn('rounded-full flex-shrink-0',bg)} style={{width:s,height:s}}/>
          ))}
        </div>

        {/* Body */}
        <div className={cn('rounded-[22px] px-3 pt-3 pb-2.5 relative z-10',bg)}>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              {/* Lucide icon instead of emoji */}
              <div className={cn('w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0',
                isLookup ? 'bg-amber-100 dark:bg-amber-500/20' : 'bg-neutral-100 dark:bg-white/[0.09]')}>
                {isLookup
                  ? <BookOpen className="w-3 h-3 text-amber-600 dark:text-amber-400"/>
                  : (() => { const Icon = PAGE_ICON_MAP[info.iconKey] ?? Bot; return <Icon className="w-3 h-3 text-neutral-500 dark:text-neutral-400"/> })()
                }
              </div>
              <span className={cn('text-[9px] font-bold px-1.5 py-[2px] rounded-full leading-none',
                isLookup
                  ?'bg-amber-200/70 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300'
                  :'bg-neutral-100 dark:bg-white/[0.09] text-neutral-500 dark:text-neutral-400')}>
                {isLookup?'Kitobdan':'KotibaBot'}
              </span>
            </div>
            <button onClick={onClose}
              className="w-4 h-4 flex items-center justify-center rounded-full text-neutral-300 hover:text-neutral-500 dark:hover:text-neutral-200 transition-colors">
              <X className="w-3 h-3"/>
            </button>
          </div>

          <p className="text-[11.5px] leading-relaxed text-neutral-600 dark:text-neutral-300 min-h-[32px]">
            {shown}
            {!ready && (
              <span className="inline-flex gap-[3px] ml-0.5 align-middle">
                {[0,1,2].map(i=>(
                  <span key={i} className="w-[3px] h-[3px] rounded-full bg-neutral-400 inline-block"
                    style={{animation:`dot-pulse .8s ease-in-out ${i*.22}s infinite`}}/>
                ))}
              </span>
            )}
          </p>

          {ready && !isLookup && total > 1 && (
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-100 dark:border-white/[0.06]">
              <span className="flex items-center gap-1 text-[10px] text-neutral-400">
                <Lightbulb className="w-3 h-3 text-amber-400"/> {tipIdx+1}/{total}
              </span>
              <button onClick={onNext}
                className="flex items-center gap-0.5 text-[10px] font-extrabold text-amber-600 dark:text-amber-400 hover:text-amber-700 transition-colors">
                Keyingi <ChevronRight className="w-3 h-3"/>
              </button>
            </div>
          )}

          {ready && isLookup && (
            <div className="flex items-center gap-1 mt-2 pt-2 border-t border-amber-100 dark:border-amber-500/20">
              <BookOpen className="w-[10px] h-[10px] text-amber-500"/>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold italic">
                Gadimin Hikmatlar
              </span>
            </div>
          )}
        </div>

        {/* Tail */}
        <div className={cn('flex flex-col gap-[3px] mt-[3px]',
          flipLeft?'items-end pr-8':'items-start pl-8')}>
          {[8,5,3].map((s,i)=>(
            <div key={i} className={cn('rounded-full',bg)} style={{width:s,height:s}}/>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ================================================================
   AI CHAT PANEL  (floating, near mascot)
   ================================================================ */
function mdLine(line: string, key: number) {
  const parts = line.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/).map((p, j) => {
    if (p.startsWith('**') && p.endsWith('**'))
      return <strong key={j} className="font-extrabold text-white">{p.slice(2,-2)}</strong>
    if (p.startsWith('*') && p.endsWith('*'))
      return <em key={j} className="italic text-violet-300">{p.slice(1,-1)}</em>
    return p
  })
  return <span key={key}>{parts}<br/></span>
}

function AiChatPanel({
  flipLeft, mascotX, mascotY, onClose,
}: {
  flipLeft: boolean
  mascotX:  number
  mascotY:  number
  onClose:  () => void
}) {
  const [msgs,    setMsgs]    = useState<ChatMsg[]>([{
    id:0, role:'ai', ts:new Date(),
    text:"Assalomu alaykum! Men **KotibaJON AI** 🤖\n\nQuyidagi sohalarda **real bilim** beraman:\n• 📚 **8 ta kitob** — Atom Odatlar, Deep Work, Rich Dad...\n• 🧠 **Psixologiya** — kognitiv xatolar, motivatsiya, stres\n• 💰 **Moliya ilmi** — compound interest, investitsiya, byudjet\n• 🎓 **O'rganish** — Feynman, spaced repetition, deliberate practice\n• 💪 **Sog'liq** — uyqu, sport, ovqatlanish\n• ♟️ **Mental modellar** — Pareto, First Principles, Inversion\n• 🤖 **AI modellar** — Claude Opus 4.8, GPT, Gemini\n\nSavol bering!",
  }])
  const [input,   setInput]   = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)
  const nextId    = useRef(1)

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:'smooth'}) }, [msgs])

  /* Focus input when panel opens */
  useEffect(()=>{ setTimeout(()=>inputRef.current?.focus(), 300) }, [])

  /* Voice message injection from voice assistant */
  useEffect(()=>{
    const h = (e: Event) => {
      const text = (e as CustomEvent).detail as string
      if (text) send(text)
    }
    window.addEventListener('kj-voice-msg', h)
    return () => window.removeEventListener('kj-voice-msg', h)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function send(text?: string) {
    const content = (text ?? input).trim()
    if (!content || loading) return
    setInput('')

    const userMsg: ChatMsg = {id:nextId.current++, role:'user', text:content, ts:new Date()}
    const loadMsg: ChatMsg = {id:nextId.current++, role:'ai',   text:'',      ts:new Date(), loading:true}
    setMsgs(p=>[...p, userMsg, loadMsg])
    setLoading(true)

    const delay = 1000 + Math.min(content.length*10, 1400)
    setTimeout(()=>{
      const reply = getAiReply(content)
      setMsgs(p=>p.map(m=> m.id===loadMsg.id ? {...m, text:reply, loading:false} : m))
      setLoading(false)
    }, delay)
  }

  function clearChat() {
    setMsgs([{id:0,role:'ai',ts:new Date(),text:"Chat tozalandi. Yangi savol bering! 🤖"}])
    nextId.current = 1
  }

  /* Panel position */
  const bottom = typeof window !== 'undefined' ? window.innerHeight - mascotY + 10 : 100
  const panelStyle: React.CSSProperties = {
    position : 'fixed',
    bottom,
    width    : PANEL_W,
    zIndex   : 9998,
    ...(flipLeft
      ? { right: typeof window!=='undefined' ? window.innerWidth - mascotX - BOT_W : 20 }
      : { left: mascotX }),
  }

  const BUMP_BG = 'bg-neutral-900'

  return (
    <div style={{...panelStyle, animation:'slide-up-bot .32s cubic-bezier(.16,1,.3,1) both'}}>
      <div style={{filter:'drop-shadow(0 0 2px rgba(139,92,246,.28)) drop-shadow(0 10px 32px rgba(139,92,246,.22))'}}>

        {/* Cloud bumps at bottom (pointing toward mascot) */}
        <div className={cn('flex items-start gap-[3px] mt-[3px]',
          flipLeft?'justify-end pr-6 pl-10':'justify-start pl-6 pr-10')}>
          {[8,5,3].map((s,i)=>(
            <div key={i} className={cn('rounded-full',BUMP_BG)} style={{width:s,height:s}}/>
          ))}
        </div>

        {/* Panel */}
        <div className="bg-neutral-900 rounded-[20px] overflow-hidden flex flex-col"
          style={{maxHeight:480, minHeight:320, order:-1, marginTop:0}}>

          {/* Header */}
          <div className="flex items-center gap-2.5 px-3.5 py-2.5 border-b border-white/[0.07] flex-shrink-0">
            <div className="w-7 h-7 rounded-xl bg-black flex items-center justify-center flex-shrink-0">
              <Image src="/ai.png" alt="AI" width={18} height={18} style={{objectFit:'contain'}}/>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[12px] font-extrabold text-white leading-none">KotibaJON AI</span>
                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 leading-none">AI</span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"
                  style={{animation:'dot-pulse 2s ease-in-out infinite'}}/>
                <span className="text-[9px] text-neutral-500">Onlayn · Shaxsiy yordamchi</span>
              </div>
            </div>
            <button onClick={clearChat} title="Tozalash"
              className="w-6 h-6 flex items-center justify-center rounded-lg text-neutral-600 hover:text-neutral-300 hover:bg-white/[0.06] transition-all">
              <RotateCcw className="w-3 h-3"/>
            </button>
            <button onClick={onClose}
              className="w-6 h-6 flex items-center justify-center rounded-lg text-neutral-600 hover:text-neutral-300 hover:bg-white/[0.06] transition-all">
              <X className="w-3.5 h-3.5"/>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 kj-no-scrollbar">
            {msgs.map(m => (
              <ChatBubble key={m.id} msg={m}/>
            ))}
            <div ref={bottomRef}/>
          </div>

          {/* Quick prompts — only first 2 msgs */}
          {msgs.length <= 2 && !loading && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5 flex-shrink-0">
              {QUICK_PROMPTS.slice(0,3).map((p,i)=>(
                <button key={i} onClick={()=>send(p)}
                  className="text-[9px] font-semibold px-2.5 py-1 rounded-full
                    bg-violet-500/10 text-violet-300 border border-violet-500/20
                    hover:bg-violet-500/20 transition-all whitespace-nowrap">
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-2.5 pb-2.5 flex-shrink-0">
            <div className="flex items-center gap-2 bg-white/[0.06] rounded-xl px-3 py-2
              border border-white/[0.08] focus-within:border-violet-500/40
              focus-within:shadow-[0_0_0_3px_rgba(139,92,246,.10)] transition-all">
              <input
                ref={inputRef}
                value={input}
                onChange={e=>setInput(e.target.value)}
                onKeyDown={e=>{ if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()} }}
                placeholder="Yozing… (Enter — yuborish)"
                disabled={loading}
                className="flex-1 bg-transparent text-[11.5px] text-white placeholder:text-neutral-600
                  outline-none leading-relaxed disabled:opacity-50"
              />
              <button onClick={()=>send()}
                disabled={!input.trim()||loading}
                className={cn(
                  'w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all',
                  input.trim()&&!loading
                    ?'bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_10px_rgba(139,92,246,.4)]'
                    :'bg-white/[0.05] text-neutral-600 cursor-not-allowed',
                )}>
                <Send className="w-3 h-3"/>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

/* ── Single chat message bubble ─────────────────────────────────── */
function ChatBubble({ msg }: { msg: ChatMsg }) {
  const [copied, setCopied] = useState(false)

  if (msg.role === 'user') return (
    <div className="flex justify-end">
      <div className="max-w-[80%] px-3 py-2 rounded-2xl rounded-br-sm
        bg-violet-600 text-white text-[12px] leading-relaxed">
        {msg.text}
      </div>
    </div>
  )

  return (
    <div className="flex items-start gap-2">
      <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-black border border-white/[0.08]
        flex items-center justify-center mt-0.5">
        <Image src="/ai.png" alt="AI" width={14} height={14} style={{objectFit:'contain'}}/>
      </div>
      <div className="flex-1 min-w-0 group">
        {msg.loading ? (
          <div className="flex items-center gap-[5px] px-3 py-2.5 rounded-2xl rounded-bl-sm
            bg-white/[0.06] w-fit">
            {[0,1,2].map(i=>(
              <span key={i} className="w-1.5 h-1.5 rounded-full bg-violet-400"
                style={{animation:`ai-typing 1.2s ease-in-out ${i*.22}s infinite`}}/>
            ))}
          </div>
        ) : (
          <div className="relative">
            <div className="px-3 py-2 rounded-2xl rounded-bl-sm
              bg-white/[0.06] border border-white/[0.05]
              text-[12px] leading-relaxed text-neutral-200">
              {msg.text.split('\n').map((l,i)=> mdLine(l,i))}
            </div>
            <button onClick={()=>{
                navigator.clipboard?.writeText(msg.text)
                setCopied(true)
                setTimeout(()=>setCopied(false),1800)
              }}
              className="absolute -bottom-2 right-1 opacity-0 group-hover:opacity-100
                flex items-center gap-1 text-[9px] font-bold
                bg-neutral-800 border border-white/[0.08] text-neutral-400
                rounded-full px-1.5 py-0.5 hover:text-white transition-all">
              {copied?<Check className="w-2.5 h-2.5 text-emerald-400"/>:<Copy className="w-2.5 h-2.5"/>}
              {copied?'Nusxalandi':'Nusxa'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ================================================================
   MAIN COMPONENT
   ================================================================ */
export function KotibaBot() {
  const pathname = usePathname()

  const [emotion,     setEmotion]   = useState<Emotion>('idle')
  const [open,        setOpen]      = useState(false)
  const [message,     setMessage]   = useState('')
  const [tipIdx,      setTipIdx]    = useState(0)
  const [badge,       setBadge]     = useState(false)
  const [mounted,     setMounted]   = useState(false)
  const [isLookup,    setLookup]    = useState(false)
  const [isSearching, setSearching] = useState(false)
  const [aiOpen,      setAiOpen]    = useState(false)
  const [voiceOn,     setVoiceOn]   = useState(true)   // auto-start
  const [voiceState,  setVoiceState]= useState<VoiceState>('off')

  const containerRef = useRef<HTMLDivElement>(null)
  const posRef       = useRef<Pos>({ x:0, y:0 })
  const prevPath     = useRef(pathname)
  const t1 = useRef<ReturnType<typeof setTimeout>|null>(null)
  const t2 = useRef<ReturnType<typeof setTimeout>|null>(null)
  const t3 = useRef<ReturnType<typeof setTimeout>|null>(null)
  const dragRef = useRef({active:false,sm:{x:0,y:0},sp:{x:0,y:0},moved:false})

  const emotionRef  = useRef<Emotion>('idle')
  const isLookupRef = useRef(false)
  const pathnameRef = useRef(pathname)
  const aiOpenRef   = useRef(false)

  useEffect(()=>{ emotionRef.current  = emotion  },[emotion])
  useEffect(()=>{ isLookupRef.current = isLookup },[isLookup])
  useEffect(()=>{ pathnameRef.current = pathname  },[pathname])
  useEffect(()=>{ aiOpenRef.current   = aiOpen    },[aiOpen])

  /* Sync emotion with AI panel */
  useEffect(()=>{
    if (aiOpen) { setEmotion('ai'); setBadge(false) }
    else if (emotionRef.current === 'ai') setEmotion('idle')
  },[aiOpen])

  /* Voice callbacks */
  const onVoiceWake = useCallback(() => {
    /* Qisqa signal — "Yes?" */
    const reply = WAKE_REPLIES[Math.floor(Math.random() * WAKE_REPLIES.length)]
    setMessage('🎤 ' + reply)
    setLookup(true); setOpen(true); setBadge(false)
    setEmotion('happy')
    speakTTS(reply)
  }, [])

  const onVoiceCmd = useCallback((transcript: string, cmdResult: string | null) => {
    if (cmdResult) {
      /* Buyruq bajarildi — natijani ko'rsat va ayt */
      setMessage(cmdResult)
      setLookup(true); setOpen(true)
      setEmotion('happy')
      speakTTS(toSpeech(cmdResult), () => {
        setTimeout(() => { setLookup(false); setOpen(false); setEmotion('idle') }, 800)
      })
    } else {
      /* Buyruq tushunilmadi — faqat qisqa xabar, AI ochmaydi */
      setMessage(`🤔 "${transcript}" — tushunmadim`)
      setLookup(true); setOpen(true)
      speakTTS("I didn't catch that. Try again.")
      setTimeout(() => { setLookup(false); setOpen(false) }, 3000)
    }
  }, [])

  useVoice(voiceOn, setVoiceState, onVoiceWake, onVoiceCmd)

  const getInfo = useCallback((p:string):PageInfo=>{
    const exact = PAGE_INFO[p]
    if (exact) return exact
    const k = Object.keys(PAGE_INFO).find(k=>p.startsWith(k)&&k!=='/')
    return k ? PAGE_INFO[k] : DEFAULT_INFO
  },[])

  const info   = getInfo(pathname)
  const msgs   = useMemo(()=>[info.desc,...info.tips],[info])
  const curMsg = isLookup ? message : msgs[tipIdx % msgs.length]
  const { shown, ready } = useTyping(open && !aiOpen ? curMsg : '', isLookup?22:16)

  const applyPos = useCallback((p:Pos)=>{
    if (!containerRef.current) return
    containerRef.current.style.left = `${p.x}px`
    containerRef.current.style.top  = `${p.y}px`
  },[])

  /* ── doLookup ────────────────────────────────────────────────── */
  const doLookup = useCallback((finalMsg:string)=>{
    if (t1.current) clearTimeout(t1.current)
    if (t2.current) clearTimeout(t2.current)
    setLookup(true); setSearching(true)
    setEmotion('write'); setMessage('Kitobdan qidirmoqda...')
    setOpen(true); setBadge(false)
    t1.current = setTimeout(()=>{
      setSearching(false); setMessage(finalMsg)
      t2.current = setTimeout(()=>{
        setLookup(false)
        setEmotion(aiOpenRef.current ? 'ai' : 'happy')
        t3.current = setTimeout(()=>{
          if (!aiOpenRef.current) setEmotion('idle')
        },1100)
      }, Math.max(finalMsg.length*48,4000))
    },2600)
  },[])

  /* ── Idle → book mode ────────────────────────────────────────── */
  useEffect(()=>{
    if (typeof window==='undefined') return
    let idleTimer: ReturnType<typeof setTimeout>

    function resetIdle() {
      clearTimeout(idleTimer)
      if (emotionRef.current==='write' && !isLookupRef.current) {
        setEmotion('idle'); setOpen(false)
      }
      idleTimer = setTimeout(()=>{
        if (aiOpenRef.current || isLookupRef.current) return
        setEmotion('write'); setBadge(false); setOpen(false)
      }, IDLE_BOOK_MS)
    }

    const evts = ['mousemove','mousedown','keydown','touchstart','scroll'] as const
    evts.forEach(e=>window.addEventListener(e,resetIdle,{passive:true}))
    resetIdle()
    return ()=>{ clearTimeout(idleTimer); evts.forEach(e=>window.removeEventListener(e,resetIdle)) }
  },[])

  /* ── Emotion cycle ───────────────────────────────────────────── */
  useEffect(()=>{
    let cycleId:ReturnType<typeof setTimeout>
    let revertId:ReturnType<typeof setTimeout>

    function cycle(){
      cycleId = setTimeout(()=>{
        const em = emotionRef.current
        if (em==='ai'||(em==='write'&&!isLookupRef.current)){
          cycleId=setTimeout(cycle,5000); return
        }
        if (Math.random()<0.30){
          const w = WISDOMS[Math.floor(Math.random()*WISDOMS.length)]
          doLookup(w); cycleId=setTimeout(cycle,9500); return
        }
        const opts:Emotion[] = ['think','happy','wave','surprised']
        setEmotion(opts[Math.floor(Math.random()*opts.length)])
        revertId = setTimeout(()=>{ setEmotion('idle'); cycle() },3200)
      }, rnd(12_000,20_000))
    }

    cycle()
    return ()=>{ clearTimeout(cycleId); clearTimeout(revertId) }
  },[doLookup])

  /* ── Mount ───────────────────────────────────────────────────── */
  useEffect(()=>{
    const saved=(()=>{
      try{return JSON.parse(localStorage.getItem('kj_bot_pos')||'null')}catch{return null}
    })()
    posRef.current={
      x: saved?.x ?? window.innerWidth  - BOT_W - 20,
      y: saved?.y ?? window.innerHeight - BOT_H - 20,
    }
    applyPos(posRef.current)
    setMounted(true)
    setEmotion('wave')
    setTimeout(()=>{ setBadge(true); setEmotion('idle') },1800)
    return ()=>{
      if(t1.current)clearTimeout(t1.current)
      if(t2.current)clearTimeout(t2.current)
      if(t3.current)clearTimeout(t3.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  /* ── Page change ─────────────────────────────────────────────── */
  useEffect(()=>{
    if(prevPath.current===pathname) return
    prevPath.current=pathname
    setTipIdx(0); setOpen(false)
    if(!isLookup&&!aiOpen){ setEmotion('think'); setBadge(true) }
    const id=setTimeout(()=>{ if(!isLookup&&!aiOpen) setEmotion('idle') },1600)
    return ()=>clearTimeout(id)
  },[pathname,isLookup,aiOpen])

  /* ── toggle-ai-chat event (from Sidebar button) ─────────────── */
  useEffect(()=>{
    const h=()=>setAiOpen(v=>!v)
    window.addEventListener('toggle-ai-chat',h)
    return ()=>window.removeEventListener('toggle-ai-chat',h)
  },[])

  /* ── External mascot events ──────────────────────────────────── */
  useEffect(()=>{
    const h=(e:Event)=>{
      const {message:msg, mode='happy'}=(e as CustomEvent).detail||{}
      if(!msg) return
      if(mode==='lookup'){doLookup(msg);return}
      setEmotion(mode as Emotion); setMessage(msg)
      setOpen(true); setBadge(false)
      const id=setTimeout(()=>setEmotion(aiOpenRef.current?'ai':'idle'),3000)
      return ()=>clearTimeout(id)
    }
    window.addEventListener('kotibabot',h)
    return ()=>window.removeEventListener('kotibabot',h)
  },[doLookup])

  /* ── Drag ────────────────────────────────────────────────────── */
  const onPD = useCallback((e:React.PointerEvent<HTMLDivElement>)=>{
    dragRef.current={active:true,sm:{x:e.clientX,y:e.clientY},sp:{...posRef.current},moved:false}
    e.currentTarget.setPointerCapture(e.pointerId)
    e.preventDefault()
  },[])

  const onPM = useCallback((e:React.PointerEvent<HTMLDivElement>)=>{
    if(!dragRef.current.active) return
    const dx=e.clientX-dragRef.current.sm.x
    const dy=e.clientY-dragRef.current.sm.y
    if(Math.abs(dx)>5||Math.abs(dy)>5) dragRef.current.moved=true
    posRef.current={
      x:Math.max(8,Math.min(window.innerWidth -BOT_W-8,dragRef.current.sp.x+dx)),
      y:Math.max(8,Math.min(window.innerHeight-BOT_H-8,dragRef.current.sp.y+dy)),
    }
    applyPos(posRef.current)
  },[applyPos])

  const onPU = useCallback(()=>{
    if(!dragRef.current.active) return
    dragRef.current.active=false
    localStorage.setItem('kj_bot_pos',JSON.stringify(posRef.current))
    if(!dragRef.current.moved){
      if(isLookup) return
      if(emotion==='ai'){ setAiOpen(v=>!v); return }
      setOpen(v=>{
        if(!v){ setBadge(false); setEmotion('wave'); setTimeout(()=>setEmotion('idle'),1400) }
        return !v
      })
    }
  },[isLookup,emotion])

  /* ── Derived ─────────────────────────────────────────────────── */
  const flipLeft = (posRef.current.x??0) > ((typeof window!=='undefined'?window.innerWidth:1200)/2)

  const overlay:Record<Emotion,React.ReactNode> = {
    idle     :null,
    think    :<ThinkDots/>,
    write    :<ReadingGlow searching={isSearching}/>,
    happy    :<HappyStars/>,
    wave     :<WaveHand/>,
    surprised:<SurpriseMarks/>,
    ai       :<AiGlow/>,
  }

  const showBot  = emotion!=='write' && emotion!=='ai'
  const showBook = emotion==='write'
  const showAi   = emotion==='ai'

  if(!mounted) return null

  return (
    <>
      <style>{CSS}</style>

      {/* AI Chat Panel (fixed, near mascot) */}
      {aiOpen && (
        <AiChatPanel
          flipLeft={flipLeft}
          mascotX={posRef.current.x}
          mascotY={posRef.current.y}
          onClose={()=>setAiOpen(false)}
        />
      )}

      {/* Mascot container */}
      <div ref={containerRef} className="fixed z-[9997]"
        style={{width:BOT_W,touchAction:'none',userSelect:'none'}}>

        {/* Small thought bubble (non-AI) */}
        {open && !aiOpen && (
          <Bubble
            shown={shown} ready={ready} info={info}
            tipIdx={tipIdx%msgs.length} total={msgs.length}
            onNext={()=>{ setTipIdx(i=>i+1); setEmotion('think'); setTimeout(()=>setEmotion('idle'),1200) }}
            onClose={()=>{ setOpen(false); if(isLookup){setLookup(false);setSearching(false);setEmotion('idle')} }}
            flipLeft={flipLeft} isLookup={isLookup}
          />
        )}

        {/* Voice mic button — katta va ko'zga ko'rinadi */}
        <button
          onClick={() => setVoiceOn(v => !v)}
          title={
            voiceState==='awake'    ? 'Gapiravering...' :
            voiceState==='listening'? '"Hey Tom" — tinglayapdi' :
            'Ovoz yoqish — "Hey Tom" deng'
          }
          style={{
            position:'absolute', bottom:-14, left:'50%', transform:'translateX(-50%)',
            zIndex:25, width:32, height:32, borderRadius:'50%',
            border:'2.5px solid',
            borderColor: voiceState==='awake'    ? '#10b981'
                       : voiceState==='listening' ? '#818cf8'
                       : '#e5e7eb',
            background:  voiceState==='awake'    ? '#10b981'
                       : voiceState==='listening' ? '#6366f1'
                       : 'rgba(255,255,255,0.95)',
            display:'flex', alignItems:'center', justifyContent:'center',
            cursor:'pointer', transition:'all .2s ease',
            boxShadow: voiceState==='off'
              ? '0 2px 8px rgba(0,0,0,0.12)'
              : '0 0 0 0 rgba(16,185,129,.5)',
            animation: voiceState==='awake'     ? 'voice-awake 1s ease-in-out infinite'
                     : voiceState==='listening'  ? 'voice-ring  2.2s ease-in-out infinite'
                     : undefined,
          }}>
          {voiceState === 'processing'
            ? <div style={{width:14,height:14,borderRadius:'50%',border:'2.5px solid',borderColor:'#818cf8 transparent transparent transparent',animation:'voice-process .6s linear infinite'}}/>
            : <svg viewBox="0 0 24 24" fill="none"
                stroke={voiceState==='off' ? '#9ca3af' : '#fff'}
                strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                style={{width:14,height:14}}>
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8"  y1="23" x2="16" y2="23"/>
              </svg>
          }
        </button>
        {/* Mic status label */}
        <div style={{
          position:'absolute', bottom:-30, left:'50%', transform:'translateX(-50%)',
          whiteSpace:'nowrap', fontSize:9, fontWeight:800, zIndex:25, pointerEvents:'none',
          color: voiceState==='awake'      ? '#10b981'
               : voiceState==='processing' ? '#f59e0b'
               : voiceState==='listening'  ? '#818cf8'
               : '#9ca3af',
          textShadow:'0 1px 4px rgba(0,0,0,0.6)',
          transition:'color .3s ease',
        }}>
          {voiceState==='awake'      ? '🎤 Gapiravering...'
          : voiceState==='processing'? '⚡ Bajarilmoqda...'
          : voiceState==='listening' ? '👂 Hey Tom'
          : '🔇 Off'}
        </div>

        {/* Mascot */}
        <div onPointerDown={onPD} onPointerMove={onPM} onPointerUp={onPU}
          className="relative cursor-grab active:cursor-grabbing"
          title={aiOpen?'AI chat — yopish':'Bosing — maslahat · Sudrab joylashtiring'}>

          {/* Badge */}
          {badge && !open && !aiOpen && (
            <span className="absolute -top-1 -right-1 z-20 flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-70 animate-ping"/>
              <span className="relative flex h-4 w-4 rounded-full bg-amber-500 border-2 border-white dark:border-neutral-900"/>
            </span>
          )}

          {/* AI active indicator */}
          {aiOpen && (
            <span className="absolute -top-1 -right-1 z-20 flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-70 animate-ping"/>
              <span className="relative flex h-4 w-4 rounded-full bg-violet-500 border-2 border-white dark:border-neutral-900"/>
            </span>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 z-10 pointer-events-none overflow-visible">
            {overlay[emotion]}
          </div>

          {/* Images — 3 preloaded */}
          <div style={{position:'relative',width:BOT_W,height:BOT_H}}>
            <div style={{
              position:'absolute',inset:0,
              animation:showBot?`${ANIM[emotion]||ANIM.idle},img-in .45s ease-out both`:undefined,
              opacity:showBot?1:0, transition:'opacity 0.45s ease', willChange:'transform,opacity',
            }}>
              <Image src="/bot.png" alt="KotibaBot"
                width={BOT_W} height={BOT_H} priority draggable={false} className="rounded-2xl"
                style={{objectFit:'cover',objectPosition:'center top',display:'block'}}/>
            </div>
            <div style={{
              position:'absolute',inset:0,
              animation:showBook?ANIM.write:undefined,
              opacity:showBook?1:0, transition:'opacity 0.45s ease', willChange:'transform,opacity',
            }}>
              <Image src="/book.png" alt="KotibaBot kitob o'qiyapti"
                width={BOT_W} height={BOT_H} priority draggable={false} className="rounded-2xl"
                style={{objectFit:'cover',objectPosition:'center center',display:'block'}}/>
            </div>
            <div style={{
              position:'absolute',inset:0,
              opacity:showAi?1:0, transition:'opacity 0.5s ease',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <div style={{
                width:72, height:72,
                animation:showAi?ANIM.ai:undefined,
                background:'#080808', borderRadius:18,
                display:'flex', alignItems:'center', justifyContent:'center',
                willChange:'transform,opacity',
              }}>
                <Image src="/ai.png" alt="KotibaJON AI"
                  width={50} height={50} priority draggable={false}
                  style={{objectFit:'contain', display:'block'}}/>
              </div>
            </div>
          </div>

          {/* Shadow */}
          <div className={cn('mx-auto rounded-full',
            aiOpen?'bg-violet-500/20':'bg-black/15 dark:bg-black/25')}
            style={{width:68,height:7,filter:'blur(5px)',marginTop:'-2px'}}/>
        </div>
      </div>
    </>
  )
}
