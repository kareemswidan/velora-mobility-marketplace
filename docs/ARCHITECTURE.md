# Velora architecture

Velora is a role-based marketplace built as a single Next.js application. Server components render discovery and dashboards, route handlers expose mutations, Prisma defines the domain model, and MySQL is the source of truth.

## Request flow

```text
Browser
  -> Next.js pages / server components
  -> app/api route handlers
  -> session + validation + ownership checks
  -> Prisma transactions
  -> MySQL
```

## Product domains

- **Identity:** customers, business owners, and platform administrators.
- **Marketplace:** approved businesses, branches, services, gas prices, and discovery.
- **Reservations:** timezone-aware appointments, conflict windows, status changes, and notifications.
- **Commerce:** products, inventory, orders, and order items.
- **Operations:** business moderation, audit logs, CSV exports, and administration.

## Data relationships

```text
User 1---* Business 1---* Station 1---* Booking
Business 1---* Service 1---* AvailabilitySlot
User 1---* Booking / Favorite / Vehicle / Notification / Order
Order 1---* OrderItem *---1 Product
Business 1---* Review *---1 User
```

The booking API evaluates the station's IANA timezone and rejects overlapping active reservations. Checkout runs inside a database transaction and decrements stock only when the requested quantity is still available, preventing overselling under concurrent requests.

## Delivery

- `npm run check` runs the automated tests and a production build.
- GitHub Actions runs the same verification for every pull request and main-branch push.
- `Dockerfile` packages the app, while `docker-compose.yml` starts MySQL, applies the Prisma schema, seeds documented demo users, and launches the product.
