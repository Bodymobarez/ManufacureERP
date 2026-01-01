# ⚡ نشر سريع على Vercel

## الخطوات السريعة:

### 1. اذهب إلى Vercel Dashboard
👉 [https://vercel.com/new](https://vercel.com/new)

### 2. استورد المستودع
- اضغط **"Import Git Repository"**
- اختر: **`Bodymobarez/ManufacureERP`**
- اضغط **"Import"**

### 3. إعدادات المشروع (سيتم اكتشافها تلقائياً)
- ✅ Framework: **Vite**
- ✅ Build Command: `pnpm vercel-build`
- ✅ Output Directory: `dist/spa`
- ✅ Install Command: `pnpm install`

### 4. إضافة Environment Variables
في صفحة الإعدادات، أضف:

**اسم المتغير**: `DATABASE_URL`

**القيمة**:
```
postgresql://neondb_owner:npg_QXT1iH4ukyWs@ep-shiny-queen-adr8kwr8-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**مهم**: حدد لجميع البيئات:
- ✅ Production
- ✅ Preview
- ✅ Development

### 5. النشر
- اضغط **"Deploy"**
- انتظر اكتمال البناء (2-3 دقائق)
- ✅ جاهز!

---

## 🔍 التحقق بعد النشر

افتح:
- Frontend: `https://your-project.vercel.app`
- API Test: `https://your-project.vercel.app/api/ping`
- Database: `https://your-project.vercel.app/api/health`

---

## 📝 ملاحظات

- ✅ جميع الملفات جاهزة على GitHub
- ✅ `vercel.json` مُعد بشكل صحيح
- ✅ `api/index.ts` جاهز للعمل
- ✅ Build scripts مُعدة

**كل ما تحتاجه هو إضافة `DATABASE_URL` في Vercel Dashboard!**

