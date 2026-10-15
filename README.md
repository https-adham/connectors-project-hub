# Connectors Project Hub | منصة أفكار ومشاريع Connectors Team

> **FOR A CONNECTED WORLD**  
> المنصة الرسمية لتقديم ومتابعة أفكار ومشاريع **Connectors Team**، برنامج هندسة الذكاء الاصطناعي، كلية الهندسة - جامعة المنصورة، مصر.

---

## 🌟 نظرة عامة (Overview)

تطبيق ويب إنتاجي متكامل (Production-Ready Full-Stack Web Application) يتيح لأعضاء الفريق والطلاب تقديم أفكار مشاريعهم الهندسية والتقنية (سواء بالاسم أو مجهول الهوية Anonymous)، مع تخزينها مباشرة في قاعدة بيانات **PostgreSQL** حقيقية عبر **Supabase**، وتوفير لوحة تحكم إدارية خاصة للمسؤولين ومراجعي الأفكار لتقييم المشاريع وإدارتها وتصديرها.

---

## 🛠️ التقنيات المستخدمة (Tech Stack)

- **الواجهة الأمامية (Frontend):** React 18, TypeScript, Tailwind CSS, Vite.
- **الرموز والتصميم (UI & Icons):** Lucide Icons, Glassmorphism, Cairo Font (RTL Arabic First).
- **قاعدة البيانات والباك إند (Backend & Database):** Supabase with PostgreSQL.
- **المصادقة (Authentication):** Supabase Auth (حسابات المشرفين مع تعطيل التسجيل العام المفتوح).
- **أمان البيانات والصلاحيات (Authorization & Security):** PostgreSQL Row Level Security (RLS).
- **الاختبارات الآلية (Testing):** Vitest (20 اختبار آلي شامل يغطي التحقق وقواعد التقديم والتصدير).
- **الاستضافة الموصى بها (Deployment):** Vercel للواجهة الأمامية، و Supabase لقاعدة البيانات.

---

## 🏛️ الهوية البصرية الرسمية (Brand Identity)

- **الفريق:** CONNECTORS TEAM
- **الشعار اللفظي:** For A Connected World
- **التبعية الأكاديمية:** برنامج هندسة الذكاء الاصطناعي — كلية الهندسة — جامعة المنصورة.
- **الشعار الرسمي:** شعار Connectors الرسمي محفوظ في المسار `public/logo.png`.
- **التصميم:** سمة تكنولوجية مستقبلية داكنة (Deep Navy & Black)، مع إضاءات Electric Blue، ولمسات Cyan و Teal خافتة وبطاقات زجاجية عصرية بتأثيرات Glow ناعمة.

---

## 🗄️ بنية قاعدة البيانات وسياسات الأمان (Database Schema & RLS)

ملف المايجريشن الكامل متاح في:  
[`supabase/migrations/20261015000000_create_project_ideas_and_admin.sql`](file:///d:/CONNECTORS/grafit/supabase/migrations/20261015000000_create_project_ideas_and_admin.sql)

### 1. جدول أفكار المشاريع (`public.project_ideas`)
- `id`: UUID مفتاح أساسي تلقائي (`gen_random_uuid()`).
- `created_at`: طابع زمني دقيق للتقديم.
- `submission_type`: نوع التقديم (`named` أو `anonymous`).
- `submitter_name`: اسم صاحب الفكرة (إجباري إذا كان التقديم بالاسم، ويُحفظ كـ `NULL` في التقديم المجهول).
- `contact_method`: وسيلة التواصل (اختيارية، ومحجوبة للعامة ومحفوظة كـ `NULL` في التقديم المجهول).
- `project_title`: عنوان الفكرة.
- `project_description`: وصف الفكرة.
- `problem_statement`: المشكلة المستهدفة.
- `target_audience`: الفئة المستهدفة أو المستفيدون.
- `project_type`: تصنيف المشروع (AI/ML, Mobile, Web, IoT, Hardware, Research, etc.).
- `custom_project_type`: تصنيف مخصص في حال اختيار "مجال آخر".
- `required_skills`: مصفوفة المهارات والأدوات المطلوبة (`JSONB`).
- `custom_skills`: المهارات المخصصة المضافة من قبل المستخدم.
- `estimated_duration`: المدة التقديرية (أقل من شهر، 1-3 أشهر، أكثر من 3 أشهر).
- `difficulty_level`: درجة الصعوبة التقديرية مقيدة بقيد فحص `CHECK (1 <= difficulty_level <= 5)`.
- `willing_to_lead`: الاستعداد للقيادة (`yes`, `no`, `unsure`).
- `preferred_collaborators`: زملاء مقترحون للعمل معهم.
- `estimated_team_size`: حجم الفريق المقترح (1-2، 3-4، 5-6، أكثر من 6، غير محدد).
- `inspiration_url`: رابط مشروع مشابه أو ورقة بحثية.
- `additional_notes`: ملاحظات إضافية.
- `review_status`: حالة المراجعة الإدارية (تلقائياً `new`، ومقيدة بالحالات: `under_review`, `needs_more_info`, `accepted_provisionally`, `deferred`, `not_suitable`).
- `reviewer_notes`: ملاحظات المراجعين الخاصة (محمية ومخفية عن العامة).
- `reviewed_at`: وقت إجراء المراجعة.
- `reviewed_by`: المعرف الفريد للمسؤول المراجع مرتبط بـ `auth.users(id)`.

### 2. جدول المسؤولين المعتمدين (`public.admin_profiles`)
- `id`: مفتاح خارجي مرتبط بـ `auth.users(id) ON DELETE CASCADE`.
- `email`: البريد الإلكتروني للمسؤول.
- `full_name`: الاسم الكامل.
- `role`: الصلاحية (`super_admin`, `reviewer`, `leader`).

### 3. سياسات الأمان على مستوى الصفوف (Row Level Security - RLS)
- **الإدراج العام (Public Insert):** مسموح لأي زائر تقديم فكرة مشروع جديدة، مع شرط صارم `CHECK (review_status = 'new' AND reviewer_notes IS NULL AND reviewed_by IS NULL)` لمنع أي تلاعب بصلاحيات المراجعة أثناء الإرسال.
- **القراءة العامة (Public Select):** **محظورة تماماً**. لا يستطيع أي زائر عام قراءة الأفكار المرسلة أو بيانات أصحابها.
- **صلاحيات الإدارة (Admin Privileges):** القراءة، التعديل على حالات المراجعة، إضافة الملاحظات السرية، وحذف الأفكار محصورة للمسؤولين المتحقق من هويتهم عبر دالة الأمان `public.is_admin()`.

---

## 🚀 خطوات الإعداد والتشغيل السريع (Setup & Local Run)

### المتطلبات المسبقة:
- Node.js (إصدار 18 أو أحدث).
- حساب مجاني على [Supabase](https://supabase.com).

### 1. تثبيت الاعتمادات:
```bash
npm install
```

### 2. إعداد قاعدة بيانات Supabase:
1. سجّل الدخول إلى [Supabase Dashboard](https://supabase.com/dashboard) وأنشئ مشروعاً جديداً (مثلاً: `connectors-hub`).
2. اذهب إلى **SQL Editor** من القائمة الجانبية.
3. انسخ محتوى الملف [`supabase/migrations/20261015000000_create_project_ideas_and_admin.sql`](file:///d:/CONNECTORS/grafit/supabase/migrations/20261015000000_create_project_ideas_and_admin.sql) والصقه في محرر SQL، ثم اضغط **Run**.
4. سيتم إنشاء الجداول، الفهارس، ودوال الأمان، وسياسات RLS بالكامل.

### 3. إنشاء حساب المسؤول الأول (Admin Bootstrap):
1. في لوحة Supabase، انتقل إلى **Authentication ➔ Users** واضغط **Add user ➔ Create user**.
2. أدخل بريدك الإلكتروني وكلمة مرور قوية (مثلاً: `admin@connectors.team`).
3. انتقل إلى **SQL Editor** ونفّذ الاستعلام التالي لترقية حسابك كمدير رئيسي (Super Admin):
   ```sql
   INSERT INTO public.admin_profiles (id, email, full_name, role)
   SELECT id, email, 'Connectors Team Leader', 'super_admin'
   FROM auth.users
   WHERE email = 'admin@connectors.team'; -- ضع بريدك الذي أنشأته
   ```
4. تم الآن تفعيل حسابك كمسؤول معتمد بشكل آمن وبدون فتح التسجيل العام للغرباء.

### 4. ضبط متغيرات البيئة (`.env`):
أنشئ ملف `.env` في المجلد الرئيسي (أو عدل الملف القائم)، وضع مفاتيح مشروعك من Supabase (من **Project Settings ➔ API**):
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
```

### 5. تشغيل السيرفر المحلي:
```bash
npm run dev
```
افتح المتصفح على: `http://localhost:3000`

### 6. تشغيل الاختبارات الآلية:
```bash
npm test
```

### 7. فحص وبناء النسخة الإنتاجية:
```bash
npm run build
```

---

## 🌐 النشر على الإنترنت (Deployment)

### النشر على منصة Vercel (موصى به):
1. ارفع المشروع إلى مستودع GitHub خاص بفريق Connectors.
2. ادخل إلى [Vercel Dashboard](https://vercel.com) واضغط **New Project** واختر المستودع.
3. في إعدادات البيئة **Environment Variables** في Vercel، أضف:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
4. اضغط **Deploy**. سيتم نشر الموقع فوراً مع رابط عام ومؤمّن بشهادة SSL مجانية.

---

## 📋 المسارات المتاحة في التطبيق (Application Routes)

| المسار (Route) | الوصف | الصلاحية المطلوبة |
| :--- | :--- | :--- |
| `/` | الصفحة الرئيسية واستمارة تقديم أفكار المشاريع (5 خطوات مع مراجعة) | عام (متاح للجميع بدون تسجيل) |
| `/admin/login` | صفحة تسجيل دخول مسؤولي ومراجعي الفريق | عام |
| `/admin` | لوحة التحكم المركزية (إحصائيات حية، فلاتر، جدول الأفكار، تصدير CSV) | مسؤولو الفريق المعتمدون فقط |
| `/admin/ideas/:id` | فاحص تفاصيل الفكرة الشامل مع تحديث حالة المراجعة والملاحظات | مسؤولو الفريق المعتمدون فقط |

---

## 🛡️ ميزات الأمان المتقدمة المطبقة
- **حماية ضد السبام والروبوتات:** حقل خفي Honeypot Field لكشف الروبوتات ورفضها تلقائياً.
- **تشفير وتأمين المدخلات:** تعقيم وتطهير المدخلات مع حماية ضد هجمات Stored XSS و SQL Injection عبر الاستعلامات المهيكلة (Parameterized Queries).
- **خصوصية التقديم المجهول:** عند اختيار "Anonymous"، لا يتم تخزين الاسم أو وسيلة الاتصال نهائياً في قاعدة البيانات.
- **تصدير متوافق مع اللغة العربية:** يتم تصدير ملفات CSV مع بادئة UTF-8 BOM (`\uFEFF`) ليفتح في Microsoft Excel بدون أي تشوه في الحروف العربية.
