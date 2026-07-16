import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const read = (path: string) => readFile(new URL(path, root), "utf8");

test("authentication uses hashed passwords and protected session cookies", async () => {
  const [login, register, auth] = await Promise.all([
    read("app/api/auth/login/route.ts"),
    read("app/api/auth/register/route.ts"),
    read("lib/auth.ts"),
  ]);
  assert.match(login, /bcrypt\.compare/);
  assert.match(register, /bcrypt\.hash\(password,12\)/);
  assert.match(register, /httpOnly:true/);
  assert.match(register, /sameSite:"lax"/);
  assert.match(auth, /setExpirationTime\("8h"\)/);
});

test("business and account mutations are ownership scoped", async () => {
  const [business, account, reviews] = await Promise.all([
    read("app/api/business/manage/route.ts"),
    read("app/api/account/bookings/route.ts"),
    read("app/api/reviews/route.ts"),
  ]);
  assert.match(business, /ownerId:s\.id/);
  assert.match(account, /id,userId:session\.id/);
  assert.match(reviews, /status:"COMPLETED"/);
});

test("booking and checkout protect shared inventory", async () => {
  const [bookings, orders] = await Promise.all([
    read("app/api/bookings/route.ts"),
    read("app/api/orders/route.ts"),
  ]);
  assert.match(bookings, /status:\{in:\["PENDING","CONFIRMED"\]\}/);
  assert.match(bookings, /status:409/);
  assert.match(orders, /prisma\.\$transaction/);
  assert.match(orders, /stock:\{gte:row\.quantity\}/);
});
