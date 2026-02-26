# OneClick Website Audit (Bangla)

এই রিপোর্টে কোড + রানটাইম বিল্ড চেক করে যেসব ইস্যু পাওয়া গেছে তা severity অনুযায়ী তালিকা করা হলো।

## Critical

1. **Hardcoded Super Admin Backdoor Credential**
   - `dbService.signIn()`-এ একটি hardcoded email/password (`rajshahi.shojib@gmail.com` / `786400`) থাকায় Supabase authentication bypass করা যায়।
   - একইভাবে localStorage `df_force_login` দিয়ে session spoof করা যাচ্ছে।
   - Impact: পূর্ণ admin takeover ঝুঁকি।

2. **Client-side Privilege Escalation Logic**
   - `getUser()`-এ নির্দিষ্ট email/id (`master-shojib`) হলে user object-এ সরাসরি `isAdmin: true` সেট করা হচ্ছে।
   - Impact: frontend-based privilege trust model; account compromise হলে panel compromise।

## High

3. **Non-atomic Token Credit (Race Condition / Double Approve Risk)**
   - `approveTransaction()` আলাদা read/update step-এ user token বাড়ায় এবং transaction complete করে; transaction guard নেই।
   - দুই admin একসাথে approve করলে double-credit হতে পারে।

4. **Environment Variable Mismatch (AI feature break risk)**
   - README-এ `GEMINI_API_KEY` set করতে বললেও কোড `process.env.API_KEY` পড়ছে।
   - Impact: production/dev এ AI generation fail করতে পারে।

5. **Sensitive Payment Number Hardcoded in UI**
   - payment methods section-এ একটি নির্দিষ্ট মোবাইল নম্বর hardcoded আছে।
   - Impact: deploy পরিবেশভেদে configuration drift, accidental exposure, change-management সমস্যা।

## Medium

6. **Heavy Single-bundle App (Performance)**
   - Build output দেখাচ্ছে main JS bundle ~1.1MB minified।
   - Impact: first load slow, mobile data খরচ বেশি, low-end device lag।

7. **Monolithic App Component Maintainability Risk**
   - `App.tsx` ফাইলে login/admin/panel/chat/shop/profile/editor সব logic একসাথে।
   - Impact: regression probability বেশি, onboarding/time-to-fix বাড়ে।

8. **Blocking Browser Dialog UX (alert/confirm)**
   - গুরুত্বপূর্ণ flows-এ `alert()`/`confirm()` বহুল ব্যবহার করা হয়েছে।
   - Impact: mobile UX খারাপ, accessibility কম, inconsistent interaction।

## Quick Fix Priority (Suggested Order)

1. Hardcoded backdoor credentials + forced login logic **immediately remove**
2. Supabase RLS + server-side admin claim validation enforce
3. `approveTransaction` কে DB function / RPC transaction-এ atomic করা
4. ENV naming unify (`GEMINI_API_KEY` vs `API_KEY`)
5. Code split + lazy load (Admin, Editor, Charts)
6. UI toast/modal system দিয়ে `alert/confirm` replace

