# DuoAxs Payouts (Stripe Connect)

This integrates **Stripe Connect (Express)** for Pro/Gym payouts.

## Environment
```
STRIPE_SECRET_KEY=sk_live_...            # or test key
NEXT_PUBLIC_APP_URL=https://your-web.app # used for return/refresh urls
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Supabase `profiles` additions
Add a `stripe_account_id` column:
```sql
alter table profiles add column if not exists stripe_account_id text;
```

## API endpoints
- `POST /api/payouts/connect-account` → creates/retrieves Stripe Connect account, stores `stripe_account_id` in `profiles`.
- `POST /api/payouts/connect-link` → creates an onboarding/update link (hosted by Stripe).
- `POST /api/payouts/add-bank` → fallback manual add using bank account token.

> Prefer the **connect-link** method for security & compliance.
