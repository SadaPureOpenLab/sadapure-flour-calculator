# Custom-order delivery

Recipient: **sadapure.com@gmail.com**. CC: **contact@sadapure.com**, verified on https://sadapure.com/contact-us on 14 October 2026. Reply-to is the validated customer email.

The public form requests full name, email, phone with country code, street address, city, country and optional region, postcode and order note. Details remain in memory. Explicit consent and a review step precede transmission. Every PDF and Excel request file includes those details, every ingredient in English (Roman Urdu), percentages, gram weights and total batch quantity. Health-goal labels and health-specific source URLs are omitted from order emails and attachments. No payment or order confirmation is invented.

## Current public state

Ingredient calculations, order form, reviewed PDF/Excel downloads, Gmail draft and device file-share support work without an email provider. Gmail compose URLs and mailto links cannot attach files automatically. The Gmail fallback says to attach downloaded files manually. Device sharing includes both files when supported, but the customer chooses the app and recipient.

**Direct email sending is inactive until the user connects Resend and a publicly hosted server endpoint.** The submit button never claims success without provider acceptance. Provider acceptance is not proof of mailbox delivery.

## Connect Resend securely

1. In the user's Resend account, verify a sending domain/address. Recipient `sadapure.com@gmail.com` can remain Gmail; the sender must meet Resend's verification rules.
2. Put `RESEND_API_KEY` and `ORDER_FROM_EMAIL` in the server host's private environment settings. Never paste a key into chat, a GitHub file, or any `VITE_` variable. `.env.example` lists names only.
3. Host `server/custom-order.ts` using the existing Node/tsx dependencies (`npm run order-server`). Set `ORDER_HOST` and `ORDER_PORT` for the host, TLS/reverse proxy, and `ORDER_ALLOWED_ORIGIN=https://sadapureopenlab.github.io`. For a local test, allow only the exact local frontend origin instead.
4. Set the public `public/order-service.json` endpoint to that HTTPS server's `/custom-order` URL. No API key goes into that file. The app probes the endpoint; only `ready:true` enables direct sending.
5. Before accepting public orders, configure the host's durable rate limits/bot controls and verify sender reputation/domain settings. The sample server additionally imposes a 20 KB request limit, validates catalogue identities and exact 100% quantities, uses a fixed recipient/CC, requires consent, restricts CORS to the single configured origin and limits requests per connected IP in memory. When behind a proxy, use a trusted ingress rate limiter; do not trust arbitrary forwarded headers.
6. Test with user-authorized contact details and confirm inbox delivery plus both readable attachments. Automated tests mock provider acceptance; no real customer email was sent during development.

The server rebuilds PDF and Excel files from validated ingredient data instead of relaying arbitrary uploaded files. It uses Resend's fixed HTTPS API, server-side credentials and an idempotency key derived from the request ID and content to reduce duplicate retries. The host must avoid body/credential logging, provide appropriate retention controls, and publish its processing details before enabling service.

Primary references: https://resend.com/docs/api-reference/emails/send-email and https://github.com/exceljs/exceljs. No Resend account, domain DNS changes, paid plan or credential was created by this work.
