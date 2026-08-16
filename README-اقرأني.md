# Velora Mobility — التطبيق الحقيقي، منشور ومعرَّب

منصة Next.js + Prisma الكاملة (13 صفحة، 18 مسار API، 16 جدول) — منشورة على Cloudflare Workers مع D1.

**الرابط:** https://velora-mobility.kareemswidan11.workers.dev

---

## ⚠️ لا تنقل هذا المجلد إلى مسار طويل

المشروع هنا في `C:\Users\karee\vlr` **عمدًا**. Turbopack يولّد أسماء ملفات مؤقتة تتضمن المسار الكامل، وأي مسار أطول يتجاوز حد Windows البالغ 260 حرفًا فينهار البناء بـ:

```
TurbopackInternalError: path length for file ... exceeds max length of filesystem
```

هذا ما أوقف النشر ساعةً كاملة. المسار القصير جزء من الإعداد، لا مصادفة.

---

## ما الذي تغيّر

### ١. تعريب كامل — الواجهة **والبيانات**

كان القاموس 7 مفاتيح مستخدمة في ملف واحد (`Nav.tsx`)، أي أن التعريب كان يغطي شريط التنقل فقط. والأسوأ أن الضغط على «العربية» كان يقلب التخطيط إلى RTL بينما 95% من النص إنجليزي، فتظهر العناوين هكذا: `.Find what moves you` — النقطة تقفز إلى بداية السطر.

| | قبل | بعد |
|---|---|---|
| مفاتيح الترجمة | 7 | **~250** |
| ملفات تستخدم الترجمة | 1 | **29** |
| رسائل أخطاء الـAPI | إنجليزية | **71 موضعًا معرَّبًا** عبر 20 ملف |
| أعمدة عربية في قاعدة البيانات | لا شيء | **12** (`nameAr`, `cityAr`, `descriptionAr` …) |
| الخط العربي | **لا يوجد** — كان يقع على خط النظام | IBM Plex Sans Arabic |
| التواريخ والأسعار | `en-US` مثبّت | حسب اللغة (`ar-u-nu-latn`) |

**النقطة الجوهرية:** البيانات نفسها ثنائية اللغة. المحطات تظهر «فيلورا سنترال · ساحة بوتسدام، برلين، ألمانيا»، والمنتجات «طقم العناية الليلي» — من قاعدة البيانات لا من ملف ترجمة.

### ٢. المعمارية: كوكي بدل سياق React

نصف الصفحات مكوّنات خادم، وسياق React لا يعمل فيها — وهذا سبب انحصار التعريب القديم في التنقل. الحل: كوكي `velora_locale` يقرأه الخادم عبر `cookies()` والعميل معًا، مع `router.refresh()` عند التبديل. النتيجة: الصفحة تصل عربية من أول رسم بلا وميض.

### ٣. الترقيات المفروضة

- **MySQL → SQLite/D1**: الـ8 enums صارت نصوصًا (SQLite لا يدعم enums في Prisma)، مع `lib/enums.ts` يحفظ نفس أمان الأنواع في TypeScript. حقلا `Json` صارا نصوصًا مع `JSON.stringify` عند الكتابة.
- **Prisma 5 → 6**: محوّل D1 المستقر يبدأ من 6.x.
- **Next 14 → 15 + React 19**: `@opennextjs/cloudflare` يشترط Next ≥ 15.5. غيّر ذلك `cookies()` و`params` إلى غير متزامنة — 83 تعديلًا وجّهها `tsc` بالكامل.
- **webpack → Turbopack**: webpack في Next لا يستطيع تحزيم محرك Prisma بصيغة WASM؛ كان يُخرجه كملف منفصل يُقرأ بـ`fs.readFile` وهي غير متاحة على Workers. Turbopack يعامله كوحدة حقيقية.

---

## البنية التحتية

```
Worker      : velora-mobility
D1          : velora-mobility-db  (d4b2030f-9f70-4412-9b0d-1b6d44ebce54, WEUR)
الجداول      : 16 · الصفوف: 49
الحساب      : kareemswidan11@gmail.com
```

## الأوامر

```bash
npm run build          # Next + Turbopack (إجباري — webpack يفشل على WASM)
npm run cf:build       # حزمة الـWorker
npm run cf:deploy      # النشر
npm run cf:preview     # معاينة الـWorker محليًا
```

لإعادة بناء قاعدة البيانات من الصفر:
```bash
npm run d1:schema                                                   # يولّد migrations/0001_init.sql
npx wrangler d1 execute velora-mobility-db --remote --file=migrations/0001_init.sql
npx wrangler d1 execute velora-mobility-db --remote --file=migrations/0002_seed.sql
```

`migrations/0002_seed.sql` مُصدَّر من `scripts/dump-to-d1.mjs`، الذي يقرأ قاعدة SQLite المحلية بعد `npx tsx prisma/seed.ts`.

## التحقق بعد النشر

```
22/22 فحصًا وظيفيًا على الرابط الحي
  8 صفحات عامة · 3 محطات مبذورة · حراس الصلاحيات الثلاثة
  /api/health 200 · /api/stations 200 · /api/admin/businesses 401
  موبايل 390×844: صفر تجاوز أفقي · صفر أخطاء console

التعريب: الإنجليزي المتبقي في كل صفحة = "Velora Mobility" (اسم العلامة) فقط
```

## غير مفحوص

المسارات خلف تسجيل الدخول — حفظ حجز فعلي، إتمام طلب، لوحات العميل والمالك والإدارة. لم تُدخَل كلمات مرور في أي حقل. الحسابات التجريبية معروضة داخل نافذة الدخول:

```
customer@velora.demo · owner@velora.demo · admin@velora.energy
```

## ملاحظات

- المستودع على GitHub ما زال على MySQL و Next 14. هذه النسخة تسبقه بفارق كبير — قرار دفعها إليه لك.
- `lib/generated/` و`node_modules/` مُولَّدان؛ `npm i && npx prisma generate` يعيد إنشاءهما.
- النسخة السابقة للترقية محفوظة في مجلد `velora-backup-pre-next15` داخل السكراتشباد.
