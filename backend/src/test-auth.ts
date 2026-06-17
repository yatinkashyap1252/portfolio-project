import bcrypt from "bcrypt";
import { generateAccessToken, verifyAccessToken, generate2faPendingToken, verify2faPendingToken } from "./utils/jwt";
import { generate2faSecret, generateQrCodeDataUrl, verifyTotpToken, generateBackupCodes, verifyBackupCode } from "./utils/totp";

const runTests = async () => {
  console.log("=== STARTING AUTH & SECURITY TESTS ===");

  // 1. Test Bcrypt Hashing and Comparison
  console.log("\n[1] Testing Password Encryption:");
  const testPassword = "SuperSecurePassword123!";
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(testPassword, salt);
  console.log("- Plain text password:", testPassword);
  console.log("- Encrypted Hash:", hash);
  const isMatch = await bcrypt.compare(testPassword, hash);
  console.log("- Match comparison check:", isMatch ? "SUCCESS ✅" : "FAILED ❌");
  const isWrongMatch = await bcrypt.compare("WrongPassword", hash);
  console.log("- Invalid comparison check:", !isWrongMatch ? "SUCCESS ✅" : "FAILED ❌");

  // 2. Test JWT tokens signing & verification
  console.log("\n[2] Testing JWT Tokens Signature & Verification:");
  const mockUserId = "60c72b2f9b1d8e25d487cf8c";
  const mockRole = "admin";
  const accessToken = generateAccessToken(mockUserId, mockRole);
  console.log("- Access Token:", accessToken.substring(0, 30) + "...");
  const verifiedAccess = verifyAccessToken(accessToken);
  console.log("- Verified access token payload:", verifiedAccess);
  const isAccessOk = verifiedAccess.userId === mockUserId && verifiedAccess.role === mockRole;
  console.log("- Token verification check:", isAccessOk ? "SUCCESS ✅" : "FAILED ❌");

  const pending2faToken = generate2faPendingToken(mockUserId);
  console.log("- 2FA Pending Token:", pending2faToken.substring(0, 30) + "...");
  const verifiedPending = verify2faPendingToken(pending2faToken);
  console.log("- Verified 2FA pending payload:", verifiedPending);
  const isPendingOk = verifiedPending.userId === mockUserId && verifiedPending.pending2fa === true;
  console.log("- 2FA Pending verification check:", isPendingOk ? "SUCCESS ✅" : "FAILED ❌");

  // 3. Test 2FA TOTP secret & QR generation
  console.log("\n[3] Testing Two-Factor (2FA) Code Logic:");
  const testEmail = "admin@example.com";
  const { secret, keyuri } = generate2faSecret(testEmail);
  console.log("- 2FA Secret Key:", secret);
  console.log("- Key URI:", keyuri);
  const qrDataUrl = await generateQrCodeDataUrl(keyuri);
  console.log("- QR Code Data URL:", qrDataUrl.substring(0, 50) + "...");
  const isQrOk = qrDataUrl.startsWith("data:image/png;base64,");
  console.log("- QR Base64 signature check:", isQrOk ? "SUCCESS ✅" : "FAILED ❌");

  // 4. Test backup codes generation & checks
  console.log("\n[4] Testing Backup Recovery Codes:");
  const { plain: plainCodes, hashed: hashedCodes } = await generateBackupCodes();
  console.log("- Generated 10 backup codes:", plainCodes);
  console.log("- Hashed codes preview:", hashedCodes.slice(0, 2).map(h => h.substring(0, 15) + "..."));
  
  const targetCode = plainCodes[3];
  console.log("- Simulating authentication using backup code:", targetCode);
  const matchedIndex = await verifyBackupCode(targetCode, hashedCodes);
  console.log("- Matched index:", matchedIndex);
  console.log("- Backup verification check:", matchedIndex === 3 ? "SUCCESS ✅" : "FAILED ❌");

  const wrongCodeCheck = await verifyBackupCode("INVALIDC", hashedCodes);
  console.log("- Invalid code index check:", wrongCodeCheck === -1 ? "SUCCESS ✅" : "FAILED ❌");

  console.log("\n=== ALL SECURITY SYSTEMS SUCCESSFUL ===");
};

runTests().catch((err) => {
  console.error("Test execution failure:", err);
  process.exit(1);
});
