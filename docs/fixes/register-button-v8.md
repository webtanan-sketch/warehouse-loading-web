# Register button fix — release 8

در نسخه قبلی، لایه رابط کاربری کارت ثبت بارگیری را clone می‌کرد. با clone شدن DOM، handler دکمه `registerBtn` از بین می‌رفت و کلیک هیچ درخواست `register_stage` به API ارسال نمی‌کرد.

در release 8 رابط با selectorهای پایدار (`registerBtn`, `stages`, `who`, `managerTools`) بازچینی می‌شود و همان node اصلی فرم ثبت جابه‌جا می‌شود؛ بنابراین event handler اصلی حفظ می‌شود. همچنین لایه قدیمی `warehouse-ui-v4-fix` از صفحه فعال حذف شده است.

صفحه فعال اکنون این اسکریپت‌ها را بارگذاری می‌کند:

- `warehouse-client-js?v=3`
- `warehouse-ui-v4?v=2`
- `warehouse-ui-v6?v=1`
