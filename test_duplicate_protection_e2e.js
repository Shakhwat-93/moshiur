import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const dotenv = fs.readFileSync('.env', 'utf8');
const env = Object.fromEntries(
  dotenv
    .split('\n')
    .filter((l) => l.includes('='))
    .map((l) => l.trim().split('='))
);

const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const BASE_URL = 'http://localhost:5500';

async function runTestSuite() {
  console.log('====================================================');
  console.log('   HERBHEEZ BD - DUPLICATE ORDER PROTECTION TEST SUITE');
  console.log('====================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, name, details = '') {
    totalTests++;
    if (condition) {
      console.log(`[PASS] Test ${totalTests}: ${name}`);
      passedTests++;
    } else {
      console.error(`[FAIL] Test ${totalTests}: ${name} ${details}`);
      process.exitCode = 1;
    }
  }

  // Ensure initial configuration is clean (10 mins, phone=true, ip=true, enabled=true)
  await fetch(`${BASE_URL}/api/admin-duplicate-config`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      is_enabled: true,
      block_same_phone: true,
      block_same_ip: true,
      duration_minutes: 10
    })
  });

  const testPhoneA = '01711556677';
  const testPhoneB = '01822556677';
  const testPhoneC = '01933556677';

  // Cleanup any old test orders for these test phones
  await supabaseAdmin.from('orders').delete().in('phone', [testPhoneA, testPhoneB, testPhoneC]);
  await supabaseAdmin.from('duplicate_order_logs').delete().in('phone', [testPhoneA, testPhoneB, testPhoneC]);

  // --------------------------------------------------------------------------
  // TEST A: Same Phone Protection
  // --------------------------------------------------------------------------
  console.log('--- Suite A: Same Phone Number Protection ---');
  
  // 1. Submit valid order with canonical phone
  const order1 = await fetch(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-real-ip': '103.145.74.1' },
    body: JSON.stringify({
      order_id: `TEST-ORD-A1`,
      name: 'Rahim Khan',
      phone: testPhoneA,
      address: 'House 12, Road 4, Dhanmondi, Dhaka',
      area: 'ঢাকার ভিতরে',
      package_name: 'জিরো এলার্জি - ১ বোতল',
      quantity: 1,
      unit_price: 750,
      total_price: 750
    })
  }).then((r) => r.json());

  assert(order1.success === true && order1.order?.id, 'Initial order from testPhoneA succeeds');

  // 2. Immediately submit second order using formatted phone variant (+88 01711-556 677)
  const order2 = await fetch(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-real-ip': '103.145.74.2' }, // Different IP
    body: JSON.stringify({
      order_id: `TEST-ORD-A2`,
      name: 'Rahim Khan Duplicate',
      phone: '+88 01711-556 677',
      address: 'House 12, Road 4, Dhanmondi, Dhaka',
      area: 'ঢাকার ভিতরে',
      package_name: 'জিরো এলার্জি - ১ বোতল',
      quantity: 1,
      unit_price: 750,
      total_price: 750
    })
  });

  const order2Data = await order2.json();
  assert(order2.status === 429, 'Repeat order with formatted phone variant returns HTTP 429 status code');
  assert(order2Data.code === 'DUPLICATE_ORDER_BLOCKED', 'Error code is DUPLICATE_ORDER_BLOCKED');
  assert(order2Data.message.includes('আপনার তথ্য দিয়ে সম্প্রতি একটি অর্ডার করা হয়েছে'), 'Message is in friendly Bengali');
  assert(order2Data.retry_after_seconds > 0, 'Response includes calculated retry_after_seconds');

  // Verify only 1 order exists in database for this phone
  const { data: dbOrdersA } = await supabaseAdmin.from('orders').select('*').eq('phone', testPhoneA);
  assert(dbOrdersA.length === 1, 'Supabase orders table contains exactly 1 order (no duplicate inserted)');

  // --------------------------------------------------------------------------
  // TEST B: Same IP Protection
  // --------------------------------------------------------------------------
  console.log('\n--- Suite B: Same IP Address Protection ---');
  const sharedIp = '192.168.10.45';

  // 1. Submit order from sharedIp with phone B
  const orderB1 = await fetch(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-real-ip': sharedIp },
    body: JSON.stringify({
      order_id: `TEST-ORD-B1`,
      name: 'Karim Ullah',
      phone: testPhoneB,
      address: 'Uttara Sector 7, Dhaka',
      package_name: 'জিরো এলার্জি - ২ বোতল',
      quantity: 1,
      unit_price: 1200,
      total_price: 1200
    })
  }).then((r) => r.json());

  assert(orderB1.success === true, 'Order with testPhoneB from sharedIp succeeds');

  // 2. Submit order from SAME sharedIp but with DIFFERENT phone C
  const orderB2 = await fetch(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-real-ip': sharedIp },
    body: JSON.stringify({
      order_id: `TEST-ORD-B2`,
      name: 'Fake User with diff phone',
      phone: testPhoneC,
      address: 'Mirpur 10, Dhaka',
      package_name: 'জিরো এলার্জি - ১ বোতল',
      quantity: 1,
      unit_price: 750,
      total_price: 750
    })
  });

  const orderB2Data = await orderB2.json();
  assert(orderB2.status === 429, 'Order with different phone from SAME IP is blocked by IP protection (HTTP 429)');
  assert(orderB2Data.code === 'DUPLICATE_ORDER_BLOCKED', 'IP block returns DUPLICATE_ORDER_BLOCKED');

  // Verify testPhoneC was NOT inserted into orders
  const { data: dbOrdersC } = await supabaseAdmin.from('orders').select('*').eq('phone', testPhoneC);
  assert(dbOrdersC.length === 0, 'No order was created for blocked IP request (testPhoneC has 0 orders)');

  // --------------------------------------------------------------------------
  // TEST C: OR Logic (Different Phone, Different IP)
  // --------------------------------------------------------------------------
  console.log('\n--- Suite C: OR Logic Verification ---');
  
  // Submit order with DIFFERENT phone AND DIFFERENT IP
  const orderCAllowed = await fetch(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-real-ip': '182.16.20.99' }, // Unused IP
    body: JSON.stringify({
      order_id: `TEST-ORD-C-ALLOWED`,
      name: 'Salim Ahmed',
      phone: testPhoneC,
      address: 'Chittagong GEC',
      package_name: 'জিরো এলার্জি - ১ বোতল',
      quantity: 1,
      unit_price: 750,
      total_price: 750
    })
  }).then((r) => r.json());

  assert(orderCAllowed.success === true, 'Different phone AND different IP is allowed (passes OR logic)');

  // --------------------------------------------------------------------------
  // TEST D: Admin Configuration Updates & Validation
  // --------------------------------------------------------------------------
  console.log('\n--- Suite D: Admin Configuration & Validation ---');
  
  // 1. Update duration to 5 minutes
  const update5 = await fetch(`${BASE_URL}/api/admin-duplicate-config`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      is_enabled: true,
      block_same_phone: true,
      block_same_ip: true,
      duration_minutes: 5
    })
  }).then((r) => r.json());

  assert(update5.success === true && update5.config.duration_minutes === 5, 'Admin can set duration to 5 minutes');

  // 2. Reject invalid duration values (< 1 or > 1440 or NaN)
  const invalidNeg = await fetch(`${BASE_URL}/api/admin-duplicate-config`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ duration_minutes: -5 })
  });
  assert(invalidNeg.status === 400, 'Rejects negative duration (-5)');

  const invalidOver = await fetch(`${BASE_URL}/api/admin-duplicate-config`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ duration_minutes: 2000 })
  });
  assert(invalidOver.status === 400, 'Rejects duration exceeding 1440 minutes (24h)');

  // 3. Test Disabling Protection
  await fetch(`${BASE_URL}/api/admin-duplicate-config`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      is_enabled: false,
      block_same_phone: true,
      block_same_ip: true,
      duration_minutes: 10
    })
  });

  // When disabled, repeat order from testPhoneA should proceed without being blocked
  const disabledAllowedOrder = await fetch(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      order_id: `TEST-ORD-DISABLED`,
      name: 'Allowed When Disabled',
      phone: testPhoneA,
      address: 'Dhanmondi, Dhaka',
      package_name: 'জিরো এলার্জি - ১ বোতল',
      quantity: 1,
      unit_price: 750,
      total_price: 750
    })
  }).then((r) => r.json());

  assert(disabledAllowedOrder.success === true, 'When protection is disabled, repeat orders are not blocked');

  // Re-enable protection for remaining tests
  await fetch(`${BASE_URL}/api/admin-duplicate-config`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      is_enabled: true,
      block_same_phone: true,
      block_same_ip: true,
      duration_minutes: 10
    })
  });

  // --------------------------------------------------------------------------
  // TEST E: Concurrency & Double-Click Protection
  // --------------------------------------------------------------------------
  console.log('\n--- Suite E: Concurrency & Double-Click Race-Condition Safety ---');
  const testPhoneConcurrent = '01788990011';
  await supabaseAdmin.from('orders').delete().eq('phone', testPhoneConcurrent);

  console.log(`Firing 10 simultaneous concurrent requests for phone: ${testPhoneConcurrent}`);
  const concurrentPromises = Array.from({ length: 10 }).map((_, idx) =>
    fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-real-ip': '103.145.74.88' },
      body: JSON.stringify({
        order_id: `TEST-CONC-${idx}-${Date.now()}`,
        name: `Concurrent User ${idx}`,
        phone: testPhoneConcurrent,
        address: 'Dhaka',
        package_name: 'জিরো এলার্জি - ১ বোতল',
        quantity: 1,
        unit_price: 750,
        total_price: 750
      })
    }).then(async (r) => ({ status: r.status, data: await r.json() }))
  );

  const concurrentResults = await Promise.all(concurrentPromises);
  const successOrders = concurrentResults.filter((r) => r.status === 200 && r.data.success === true);
  const blockedOrders = concurrentResults.filter((r) => r.status === 429 && r.data.code === 'DUPLICATE_ORDER_BLOCKED');

  console.log(`Concurrent results: ${successOrders.length} Succeeded (200), ${blockedOrders.length} Blocked (429)`);
  assert(successOrders.length === 1, 'Exactly ONE order succeeded out of 10 simultaneous concurrent requests');
  assert(blockedOrders.length === 9, 'The remaining 9 concurrent requests were safely blocked');

  // Verify database count for this phone
  const { data: dbConcurrentOrders } = await supabaseAdmin.from('orders').select('*').eq('phone', testPhoneConcurrent);
  assert(dbConcurrentOrders.length === 1, 'Database contains exactly 1 order row for the concurrent phone number');

  // --------------------------------------------------------------------------
  // TEST F: Privacy & Blocked Logs Verification
  // --------------------------------------------------------------------------
  console.log('\n--- Suite F: Privacy & Blocked Attempt Logs ---');
  const logsRes = await fetch(`${BASE_URL}/api/admin-duplicate-config`).then((r) => r.json());
  assert(logsRes.success === true && logsRes.totalBlocked > 0, 'Admin can retrieve blocked attempt logs count');

  const latestLog = logsRes.logs[0];
  assert(latestLog.phone_masked && latestLog.phone_masked.includes('****'), 'Phone number in logs is masked (e.g. 017****0011)');
  assert(latestLog.ip_masked && latestLog.ip_masked.includes('***'), 'IP address in logs is masked for privacy');

  // --------------------------------------------------------------------------
  // TEST G: Clean up Test Data
  // --------------------------------------------------------------------------
  console.log('\n--- Suite G: Test Data Cleanup ---');
  await supabaseAdmin.from('orders').delete().in('phone', [testPhoneA, testPhoneB, testPhoneC, testPhoneConcurrent]);
  await supabaseAdmin.from('duplicate_order_logs').delete().in('phone', [testPhoneA, testPhoneB, testPhoneC, testPhoneConcurrent]);
  
  // Reset settings to standard default
  await fetch(`${BASE_URL}/api/admin-duplicate-config`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      is_enabled: true,
      block_same_phone: true,
      block_same_ip: true,
      duration_minutes: 10
    })
  });
  console.log('Cleaned up all temporary test orders, logs, and reset settings to default (10m).');

  console.log('\n====================================================');
  console.log(`   TEST RESULTS: ${passedTests}/${totalTests} TESTS PASSED`);
  console.log('====================================================');

  if (passedTests === totalTests) {
    console.log('\n✓ ALL DUPLICATE PROTECTION & ANTI-FRAUD CRITERIA VERIFIED 100%!');
  } else {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Test suite failed with exception:', err);
  process.exit(1);
});
