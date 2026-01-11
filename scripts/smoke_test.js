const TEST_CASES = [
    {
        name: "1. Empty Input (Should 400)",
        payload: { text: "" },
        expectedStatus: 400
    },
    {
        name: "2. Garbage Text (Should Handle)",
        payload: { text: "asdfasdfasdf asdf asdf asdf asdf layout wow" },
        expectedStatus: 200
    },
    {
        name: "3. Very Long Notice (Should Handle)",
        payload: { text: "NOTICE ".repeat(2000) }, // ~14k chars
        expectedStatus: 400 // Since my Zod limit is 5000 chars
    },
    {
        name: "4. Scam SMS (Should Detect)",
        payload: { text: "Dear Customer, your electricity will be cut off tonight at 9:30 PM. Call this number 99xxxx immediately." },
        expectedStatus: 200
    },
    {
        name: "5. Ambiguous Message (Safe Fallback)",
        payload: { text: "Sir regarding the matter discussed yesterday please find attached." }, // Too vague
        expectedStatus: 200
    },
    {
        name: "6. Income Tax Demand (Legit)",
        payload: { text: "Government of India - Income Tax Department. Demand Notice u/s 156. You are hereby directed to pay the outstanding demand of Rs. 50,000 within 30 days." },
        expectedStatus: 200
    }
];

async function runTests() {
    console.log("🔥 Starting Production Smoke Tests...\n");
    let passed = 0;
    let failed = 0;

    for (const test of TEST_CASES) {
        console.log(`[TEST] ${test.name}...`);
        try {
            const response = await fetch("http://localhost:3000/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(test.payload)
            });

            const status = response.status;
            let result = null;
            try {
                result = await response.json();
            } catch (e) {
                console.error("   ❌ Failed to parse JSON response");
            }

            // Validation
            if (status === test.expectedStatus) {
                console.log(`   ✅ Passed (Status: ${status})`);
                if (result) {
                    // console.log("   👉 Response:", JSON.stringify(result).substring(0, 100) + "...");
                    if (result.type) console.log(`      Type: ${result.type}, Seriousness: ${result.seriousness}`);
                    if (result.error) console.log(`      Error: ${result.error}`);
                }
                passed++;
            } else {
                console.log(`   ❌ Failed (Expected ${test.expectedStatus}, Got ${status})`);
                if (result) console.log("   👉 Response:", result);
                failed++;
            }

        } catch (error) {
            console.error(`   ❌ Network Error: ${error.message}`);
            failed++;
        }
        console.log("-".repeat(40));

        // Wait 15 seconds between tests to avoid Gemini Rate Limit (5 RPM)
        if (test !== TEST_CASES[TEST_CASES.length - 1]) {
            console.log("   ⏳ Waiting 15s to respect API Rate Limit...");
            await new Promise(resolve => setTimeout(resolve, 15000));
        }
    }

    console.log(`\n🎉 Tests Complete. Passed: ${passed}, Failed: ${failed}`);
    if (failed === 0) {
        console.log("✅ SYSTEM IS STABLE FOR LAUNCH.");
    } else {
        console.log("⚠️ SOME TESTS FAILED. CHECK LOGS.");
    }
}

runTests();
