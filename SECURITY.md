# Security

این ریپو می‌تواند عمومی باشد، اما اطلاعات ورود واقعی نباید داخل کد قرار بگیرند.

مواردی که عمداً در GitHub ذخیره نمی‌شوند:

- PIN واقعی مدیر و کارگرها
- `SUPABASE_SERVICE_ROLE_KEY`
- Session tokenها
- PIN hash و salt واقعی کاربران
- هر secret یا credential محیط Production

PINها فقط در دیتابیس Supabase به‌صورت hash + salt نگهداری می‌شوند.

برای نصب جدید، PINها باید بعد از Deploy از داخل برنامه یا از مسیر مدیریتی امن ایجاد شوند.
