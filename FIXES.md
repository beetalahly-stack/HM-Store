# HM Store — Final repair notes

## Gallery fix
The product gallery no longer uses a percentage-translated overflowing flex track. It renders one image layer at a time, so moving to image 2/3/etc. cannot expose the empty/black area that appeared in the previous implementation.

Additional safeguards:
- trims and de-duplicates image URLs
- accepts JSON-string image arrays from older database rows
- falls back to the product main image when an individual gallery image fails
- keeps arrows, dots, thumbnails, keyboard and swipe navigation

## Database / catalog
- Products are read and written through Drizzle/PostgreSQL/Neon.
- `image` and `images` are normalized together when reading.
- Product edits preserve the complete image array sent by the admin form.

## Admin
- Admin authentication uses an HttpOnly signed cookie.
- Admin APIs require the session.
- Add-product button is visible at the top of the products page.

## Orders
- `/api/orders` creates real orders in PostgreSQL.
- Admin order status updates use `/api/admin/orders/[id]`.

## Important
Put the real Neon connection string and admin password in `.env` locally. Do not commit or share the real secret values.
