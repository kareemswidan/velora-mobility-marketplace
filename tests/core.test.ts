import test from "node:test";import assert from "node:assert/strict";import {rateLimit} from "../lib/rate-limit";import {money,dateTime} from "../lib/format";
test("rate limiter blocks after limit",()=>{const key=`test-${Date.now()}`;assert.equal(rateLimit(key,2,1000).ok,true);assert.equal(rateLimit(key,2,1000).ok,true);assert.equal(rateLimit(key,2,1000).ok,false)});
test("money formats currencies",()=>{assert.match(money(12.5,"USD","en-US"),/12\.50/);assert.match(money(12.5,"EUR","de-DE"),/12,50/)});
test("date formatter respects timezone",()=>{const value="2026-01-01T12:00:00.000Z";assert.notEqual(dateTime(value,"en-US","UTC"),dateTime(value,"en-US","America/New_York"))});
