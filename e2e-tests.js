#!/usr/bin/env node
// BELUGA Catering E2E Test Suite

const BASE = "http://localhost:8080/api";
const FRONT = "http://localhost:22236";

let passed = 0;
let failed = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (err) {
    console.log(`  ❌ ${name}: ${err.message}`);
    failed++;
  }
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg || "Assertion failed");
}

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  const text = await res.text();
  let body;
  try { body = JSON.parse(text); } catch { body = text; }
  return { status: res.status, body };
}

async function post(path, data) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const text = await res.text();
  let body;
  try { body = JSON.parse(text); } catch { body = text; }
  return { status: res.status, body };
}

async function getPage(path) {
  const res = await fetch(`${FRONT}${path}`);
  return { status: res.status };
}

console.log("\n🧪 BELUGA Catering — E2E Test Suite\n");

// --- Health ---
console.log("🏥 Health");
await test("GET /healthz returns ok", async () => {
  const { status, body } = await get("/healthz");
  assert(status === 200, `Expected 200, got ${status}`);
  assert(body.status === "ok", `Expected status ok, got ${JSON.stringify(body)}`);
});

// --- Menus ---
console.log("\n📋 Menus API");
await test("GET /menus returns array", async () => {
  const { status, body } = await get("/menus");
  assert(status === 200, `Expected 200, got ${status}`);
  assert(Array.isArray(body), `Expected array, got ${JSON.stringify(body).slice(0, 80)}`);
  assert(body.length >= 1, `Expected at least 1 menu, got ${body.length}`);
});

await test("GET /menus?featured=true returns featured menus", async () => {
  const { status, body } = await get("/menus?featured=true");
  assert(status === 200);
  assert(Array.isArray(body));
});

await test("GET /menus/:slug returns menu detail", async () => {
  const { body: menus } = await get("/menus");
  const first = menus[0];
  assert(first?.slug, "No slug in first menu");
  const { status, body } = await get(`/menus/${first.slug}`);
  assert(status === 200, `Expected 200, got ${status}`);
  assert(body.id === first.id, "Menu id mismatch");
});

await test("GET /menus/nonexistent returns 404", async () => {
  const { status } = await get("/menus/this-does-not-exist-xyz");
  assert(status === 404, `Expected 404, got ${status}`);
});

// --- Blog ---
console.log("\n📝 Blog API");
await test("GET /blog returns paginated posts { posts, total }", async () => {
  const { status, body } = await get("/blog");
  assert(status === 200);
  assert(Array.isArray(body.posts), `Expected body.posts to be array, got ${JSON.stringify(body).slice(0, 80)}`);
  assert(typeof body.total === "number", "Expected body.total to be number");
  assert(body.total >= 1, `Expected at least 1 post, total=${body.total}`);
});

await test("GET /blog/:slug returns post detail", async () => {
  const { body } = await get("/blog");
  const first = body.posts?.[0];
  assert(first?.slug, "No slug in first post");
  const { status, body: post } = await get(`/blog/${first.slug}`);
  assert(status === 200, `Expected 200, got ${status}`);
  assert(post.slug === first.slug, "Slug mismatch");
});

// --- Settings ---
console.log("\n⚙️ Settings API");
await test("GET /settings returns settings object", async () => {
  const { status, body } = await get("/settings");
  assert(status === 200);
  assert(typeof body === "object" && body !== null);
});

// --- Analytics ---
console.log("\n📊 Analytics API");
await test("GET /analytics/summary returns stats", async () => {
  const { status, body } = await get("/analytics/summary");
  assert(status === 200);
  assert(typeof body.orders_today === "number");
  assert(typeof body.revenue_month === "number");
  assert(typeof body.pending_orders === "number");
  assert(typeof body.total_customers === "number");
});

await test("GET /analytics/revenue returns array", async () => {
  const { status, body } = await get("/analytics/revenue");
  assert(status === 200);
  assert(Array.isArray(body));
});

await test("GET /analytics/leads-by-source returns array", async () => {
  const { status, body } = await get("/analytics/leads-by-source");
  assert(status === 200);
  assert(Array.isArray(body));
});

await test("GET /analytics/top-menus returns array", async () => {
  const { status, body } = await get("/analytics/top-menus");
  assert(status === 200);
  assert(Array.isArray(body));
});

await test("GET /analytics/weekly-insight returns { insights[], recommendations[] }", async () => {
  const { status, body } = await get("/analytics/weekly-insight");
  assert(status === 200);
  assert(Array.isArray(body.insights), `Expected insights[], got ${JSON.stringify(body).slice(0, 80)}`);
  assert(Array.isArray(body.recommendations), "Expected recommendations[]");
});

// --- Orders ---
console.log("\n🛒 Orders API");
await test("GET /orders returns array", async () => {
  const { status, body } = await get("/orders");
  assert(status === 200);
  assert(Array.isArray(body));
});

// --- Leads ---
console.log("\n🎯 Leads API");
await test("GET /leads returns array", async () => {
  const { status, body } = await get("/leads");
  assert(status === 200);
  assert(Array.isArray(body));
});

// --- notify-lead creation flow ---
console.log("\n🔄 notify-lead creation flow");
const testPhone = `099${Date.now().toString().slice(-7)}`;

await test("POST /notify-lead creates order + lead + customer", async () => {
  const { body: menus } = await get("/menus");
  const menu = menus[0];
  const { status, body } = await post("/notify-lead", {
    menu_name: menu?.name ?? "Test Menu",
    menu_price: menu?.price_per_person ?? 95000,
    guest_count: 20,
    service_type: "office",
    customer_name: "Test E2E User",
    phone: testPhone,
    email: "test@e2e.com",
    source_page: "/test",
    utm_source: "e2e-test",
  });
  assert(status === 200, `Expected 200, got ${status}: ${JSON.stringify(body)}`);
  assert(body.success === true, `Expected success:true, got ${JSON.stringify(body)}`);
});

await test("GET /leads includes newly created lead", async () => {
  const { body } = await get("/leads");
  const found = body.find((l) => l.phone === testPhone);
  assert(found, `Lead with phone ${testPhone} not found`);
});

await test("GET /orders includes newly created order", async () => {
  const { body } = await get("/orders");
  const found = body.find((o) => o.phone === testPhone);
  assert(found, `Order with phone ${testPhone} not found`);
});

await test("GET /customers includes newly created customer", async () => {
  const { body } = await get("/customers");
  const found = body.find((c) => c.phone === testPhone);
  assert(found, `Customer with phone ${testPhone} not found`);
});

// --- AI Recommend (graceful if no key) ---
console.log("\n🤖 AI Recommend API");
await test("POST /ai/recommend-menu responds (200 with key, 500 without)", async () => {
  const { status, body } = await post("/ai/recommend-menu", {
    guest_count: 30,
    service_type: "event",
    budget_per_person: 200000,
    dietary_preference: "Không có",
    event_type: "Tất niên",
  });
  if (status === 200) {
    assert(Array.isArray(body), `Expected array, got ${typeof body}`);
  } else {
    assert(status === 500, `Expected 200 or 500, got ${status}`);
    console.log(`    ℹ️  AI returned 500 (ANTHROPIC_API_KEY not set — expected)`);
  }
});

// --- A/B Tests ---
console.log("\n🔀 A/B Test API");
await test("POST /ab/impression tracks impression", async () => {
  const { status } = await post("/ab/impression", { test_name: "hero_cta", variant: "A" });
  assert(status === 200, `Expected 200, got ${status}`);
});

await test("POST /ab/click tracks click", async () => {
  const { status } = await post("/ab/click", { test_name: "hero_cta", variant: "A" });
  assert(status === 200, `Expected 200, got ${status}`);
});

// --- Frontend pages ---
console.log("\n🌐 Frontend pages");
for (const [label, path] of [
  ["/ (homepage)", "/"],
  ["/menus", "/menus"],
  ["/blog", "/blog"],
  ["/about", "/about"],
  ["/contact", "/contact"],
  ["/com-van-phong (landing page)", "/com-van-phong"],
  ["/admin/login", "/admin/login"],
]) {
  await test(`GET ${label} loads (200)`, async () => {
    const { status } = await getPage(path);
    assert(status === 200, `Expected 200, got ${status}`);
  });
}

// --- Summary ---
const total = passed + failed;
console.log(`\n${"─".repeat(50)}`);
console.log(`📊 Results: ${passed}/${total} passed, ${failed} failed`);
if (failed === 0) {
  console.log("🎉 All tests passed!\n");
} else {
  console.log(`⚠️  ${failed} test(s) failed\n`);
  process.exit(1);
}
