# 🚀 دليل النشر على Netlify

## الطريقة السريعة

### 1. ربط المستودع مع Netlify

1. اذهب إلى [Netlify Dashboard](https://app.netlify.com)
2. اضغط **"Add new site"** → **"Import an existing project"**
3. اختر **GitHub** واختر المستودع: **`Bodymobarez/ManufacureERP`**
4. Netlify سيكتشف الإعدادات تلقائياً من `netlify.toml`

### 2. إعداد Environment Variables

في صفحة إعدادات المشروع → **Site settings** → **Environment variables**، أضف:

**اسم المتغير**: `DATABASE_URL`

**القيمة**:
```
postgresql://neondb_owner:npg_QXT1iH4ukyWs@ep-shiny-queen-adr8kwr8-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**مهم**: حدد لجميع البيئات:
- ✅ Production
- ✅ Deploy previews
- ✅ Branch deploys

### 3. النشر

1. اضغط **"Deploy site"**
2. انتظر اكتمال البناء (3-5 دقائق)
3. ✅ جاهز!

---

## 🔧 إعدادات Netlify

### Build Settings (من netlify.toml):

- **Build command**: `pnpm db:generate && pnpm build:client`
- **Publish directory**: `dist/spa`
- **Functions directory**: `netlify/functions`

### API Routes:

جميع المسارات التي تبدأ بـ `/api/*` يتم توجيهها إلى:
- `netlify/functions/api.ts` (Netlify Function)

### SPA Routes:

جميع المسارات الأخرى يتم توجيهها إلى:
- `index.html` (React Router)

---

## ✅ التحقق من النشر

بعد النشر، تحقق من:

1. **Frontend**: افتح `https://your-site.netlify.app`
2. **API Health**: `https://your-site.netlify.app/api/ping`
3. **Database**: `https://your-site.netlify.app/api/health`

---

## 🐛 حل المشاكل

### Build Fails

1. تحقق من build logs في Netlify Dashboard
2. تأكد من أن `DATABASE_URL` مضاف
3. تحقق من Node.js version (يجب أن يكون 20)

### API Routes لا تعمل

1. تحقق من `netlify/functions/api.ts` موجود
2. تحقق من `netlify.toml` redirects
3. تأكد من أن `serverless-http` مثبت

### Database Connection Error

1. تحقق من `DATABASE_URL` في Environment Variables
2. تأكد من أن SSL mode مضاف: `?sslmode=require`
3. تحقق من أن قاعدة البيانات Neon متاحة

---

## 📝 ملاحظات مهمة

1. **Environment Variables**: يجب إضافتها في Netlify Dashboard
2. **Database Migrations**: قم بتشغيلها قبل النشر:
   ```bash
   pnpm db:deploy
   ```
3. **Prisma Client**: يتم توليده تلقائياً أثناء البناء
4. **Auto Deploy**: Netlify ينشر تلقائياً عند push إلى GitHub

---

## 🔗 روابط مفيدة

- [Netlify Dashboard](https://app.netlify.com)
- [Netlify Documentation](https://docs.netlify.com)
- [Project Repository](https://github.com/Bodymobarez/ManufacureERP.git)

