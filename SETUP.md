# TrueBond — setup and deployment

TrueBond is a React + Vite starter connected to Supabase. The included UI runs in **preview mode** without credentials; demo profiles are illustrative and not real users. Live authentication, profiles, matching, photo uploads and messages require your own Supabase project.

## 1. Requirements
- Node.js 20 or newer
- A Supabase account and project
- Git (recommended)

## 2. Run locally
```bash
npm install
cp .env.example .env
npm run dev
```
Open the local URL printed by Vite. Edit `.env` with your Supabase project URL and **publishable/anon key**. Never put a `service_role` key in browser code or commit secrets.

## 3. Configure Supabase
1. Create a project at https://supabase.com.
2. In Project Settings → API, copy the Project URL and publishable/anon key into `.env`.
3. Open SQL Editor and run all of `supabase/schema.sql`.
4. In Authentication → URL Configuration, set your local Site URL (for example `http://localhost:5173`) and add your deployed domain to Redirect URLs.
5. In Authentication → Providers, configure email/password. For public launch, keep email confirmation enabled and configure SMTP so confirmations reliably arrive.
6. Create a **public** Storage bucket called `profile-photos` for this starter because profile images need stable URLs in the profile cards. Public bucket files can be viewed by anyone with their URL, so users must be told clearly that uploaded profile photos are public. The policies below restrict uploads/changes to each user's own folder. For stricter privacy, switch the app to signed URLs and refresh them as needed.

Storage policies (run in SQL editor after creating the bucket):
```sql
create policy "Members upload to own folder"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'profile-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Members update own photos"
on storage.objects for update to authenticated
using (
  bucket_id = 'profile-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'profile-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Members delete own photos"
on storage.objects for delete to authenticated
using (
  bucket_id = 'profile-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Public bucket reads are handled by Supabase Storage; this policy is not required for public reads.
```

## 4. Important security work before public launch
This is a starter, not a security-audited production service. Before accepting real users:
- Enforce adult-only signup and verify age appropriately; the profile form's age field alone is not identity or age verification.
- Add moderation, report/block tables and workflows, rate limits, spam/fraud controls, account deletion and data export.
- Make sure private chats are accessible only to matched members. The provided RLS policy checks match membership; strengthen it with moderation and abuse protections.
- Do not expose precise location. Use city-level location unless users explicitly opt into more.
- Review profile data exposure. Current starter profile SELECT policy returns the full row to authenticated members; for production, use a public-safe view/RPC and keep private settings separate.
- Review the photo bucket's public/private choice. Public profile photos can be copied or shared; clearly disclose this to users.
- Use a managed TURN service for reliable WebRTC calls, and add authenticated signaling plus call invitations and abuse controls. Video calling is not implemented in this first starter.
- Add a tested payment provider and server-side entitlement checks before selling premium. The Plus section is currently informational; no payments are taken.
- Add Terms of Service, Privacy Policy, community standards, consent flows, and a process to handle safety reports.
- Configure backups, monitoring, error reporting, database migration process and rate limits.

## 5. Deploy
### Vercel
1. Push this project to a private GitHub repository.
2. Import it into Vercel.
3. Set build command `npm run build` and output directory `dist`.
4. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in project environment variables.
5. Deploy, then add your domain in Vercel and Supabase Auth URL configuration.

Netlify works similarly: build command `npm run build`, publish directory `dist`.

## Current implementation
- Responsive landing page and profile cards
- Email/password sign-up and sign-in via Supabase Auth
- Profile editing and image upload flow
- Likes and mutual-match database trigger
- Message composer and message history for matched members
- Search, liked tab, demo mode and premium concept section

## Known starter limitations
- Demo profiles are sample content and cannot be matched or messaged.
- The likes tab currently tracks likes in local UI state; load sent likes from the database before production.
- Real-time message subscriptions are not yet wired; current chat loads message history and sends messages.
- The UI does not yet implement video calls. Use WebRTC plus an authenticated signaling channel and TURN server.
- Matching queries and match ordering should be tested end-to-end with two real accounts before launch.
- The initial schema uses a database trigger to create matches from reciprocal likes. Verify permissions and RLS behavior in your own Supabase project before production.
