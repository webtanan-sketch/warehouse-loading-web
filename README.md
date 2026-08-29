# مدیریت بارگیری و دستمزد

وب‌اپ فارسی RTL برای ثبت بارگیری، دستمزد کارگرها، چندمرحله‌ای بودن فاکتور، تسویه و گزارش.

## معماری فعلی

- Frontend سبک برای موبایل
- Supabase PostgreSQL به‌عنوان دیتابیس مرکزی
- Supabase Edge Functions برای API و احراز هویت
- ورود فقط با PIN چهاررقمی؛ بدون نام کاربری و ایمیل
- نقش‌ها: `manager` و `worker`
- PINها به‌صورت hash + salt در دیتابیس ذخیره می‌شوند و هرگز داخل GitHub قرار نمی‌گیرند.

## ساختار ریپو

- `supabase/migrations/001_initial_schema.sql` — ساختار دیتابیس
- `supabase/functions/warehouse-api/index.ts` — API اصلی
- `supabase/functions/warehouse-jsonp/index.ts` — پل JSONP برای میزبان‌هایی با CSP محدود
- `supabase/functions/warehouse-client-js/index.ts` — رابط کاربری موبایل
- `supabase/functions/warehouse-go/index.ts` — لینک ثابت و انتشار نسخه عمومی
- `frontend/index.html` — پوسته ساده Frontend

## امنیت

هیچ `SUPABASE_SERVICE_ROLE_KEY`، session token، PIN واقعی، hash واقعی کاربران یا secret دیگری در این ریپو قرار داده نشده است.

## وضعیت نسخه

این snapshot مطابق نسخه فعال پروژه در تاریخ 2026-08-29 است.
