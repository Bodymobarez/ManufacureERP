# 🚀 دليل النشر على Vercel

## الطريقة السريعة (من خلال GitHub)

### 1. ربط المستودع مع Vercel

1. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
2. اضغط على **"Add New Project"**
3. اختر المستودع: **`Bodymobarez/ManufacureERP`**
4. Vercel سيكتشف الإعدادات تلقائياً

### 2. إعداد Environment Variables

في صفحة إعدادات المشروع → **Environment Variables**، أضف:

```
DATABASE_URL=postgresql://neondb_owner:npg_QXT1iH4ukyWs@ep-shiny-queen-adr8kwr8-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**مهم جداً**: حدد هذه المتغيرات لجميع البيئات:
- ✅ Production
- ✅ Preview  
- ✅ Development

### 3. النشر

1. اضغط **"Deploy"**
2. انتظر اكتمال البناء
3. التطبيق سيكون متاحاً على: `https://your-project.vercel.app`

---

## الطريقة من خلال Terminal (CLI)

### 1. تثبيت Vercel CLI

```bash
npm install -g vercel
```

### 2. تسجيل الدخول

```bash
vercel login
```

### 3. ربط المشروع

```bash
cd "/Users/ahmed/Downloads/Hany fadel"
vercel link
```

### 4. إضافة Environment Variables

```bash
vercel env add DATABASE_URL production
# ثم الصق: postgresql://neondb_owner:npg_QXT1iH4ukyWs@ep-shiny-queen-adr8kwr8-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require

vercel env add DATABASE_URL preview
# نفس القيمة

vercel env add DATABASE_URL development
# نفس القيمة
```

### 5. النشر

```bash
# نشر إلى production
vercel --prod

# أو نشر preview
vercel
```

---

## ✅ التحقق من النشر

بعد النشر، تحقق من:

1. **Frontend**: افتح `https://your-project.vercel.app`
2. **API Health**: `https://your-project.vercel.app/api/ping`
3. **Database**: `https://your-project.vercel.app/api/health`

---

## 🔧 إعدادات Vercel

### Build Settings (يتم اكتشافها تلقائياً):

- **Framework Preset**: Vite
- **Build Command**: `pnpm vercel-build`
- **Output Directory**: `dist/spa`
- **Install Command**: `pnpm install`

### API Routes:

جميع المسارات التي تبدأ بـ `/api/*` يتم توجيهها إلى:
- `api/index.ts` (Serverless Function)

### SPA Routes:

جميع المسارات الأخرى يتم توجيهها إلى:
- `index.html` (React Router)

---

## 🐛 حل المشاكل

### Build Fails

1. تحقق من logs في Vercel Dashboard
2. تأكد من أن `DATABASE_URL` مضاف
3. تحقق من Node.js version (يجب أن يكون 18+)

### API Routes لا تعمل

1. تحقق من `api/index.ts` موجود
2. تحقق من `vercel.json` rewrites
3. تأكد من أن `serverless-http` مثبت

### Database Connection Error

1. تحقق من `DATABASE_URL` في Environment Variables
2. تأكد من أن SSL mode مضاف: `?sslmode=require`
3. تحقق من أن قاعدة البيانات Neon متاحة

---

## 📝 ملاحظات مهمة

1. **Environment Variables**: يجب إضافتها في Vercel Dashboard
2. **Database Migrations**: قم بتشغيلها قبل النشر:
   ```bash
   pnpm db:deploy
   ```
3. **Prisma Client**: يتم توليده تلقائياً أثناء البناء
4. **Auto Deploy**: Vercel ينشر تلقائياً عند push إلى GitHub

---

## 🔗 روابط مفيدة

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel Documentation](https://vercel.com/docs)
- [Project Repository](https://github.com/Bodymobarez/ManufacureERP.git)

