# Authentication and authorization

## Session design

- Passwords are hashed with bcrypt (cost 12).
- Login and registration are rate limited.
- Successful authentication signs an eight-hour HS256 JWT with the user ID, email, and role.
- The token is stored in an `HttpOnly`, `SameSite=Lax` cookie and is `Secure` in production.
- The JWT secret is supplied through environment configuration and is never committed.

## Role matrix

| Capability | Customer | Business owner | Admin |
| --- | :---: | :---: | :---: |
| Manage own vehicles, favorites, bookings | Yes | No | No |
| Create and operate owned businesses | No | Yes | No |
| Change owned service/branch data | No | Yes | No |
| Moderate businesses and platform data | No | No | Yes |
| Export platform reports | No | No | Yes |

Authorization is repeated at every server mutation. Business queries include `ownerId`; customer mutations include `userId`; admin routes require the exact `ADMIN` role. Reviews additionally require a completed booking for the reviewed business.

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Customer | `customer@velora.demo` | `CustomerDemo2026!` |
| Business owner | `owner@velora.demo` | `OwnerDemo2026!` |
| Admin | `admin@velora.energy` | `VeloraAdmin2026!` |

The seed command resets these demo credentials; replace all defaults in any non-demo deployment.
