
'use strict';

const store = new Map();

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function storeOTP(email, otp) {
  store.set(email, {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000,
    attempts: 0,
  });
}

function verifyOTP(email, code) {
  const entry = store.get(email);

  // 1. Check if OTP exists
  if (!entry) {
    return { ok: false, reason: 'not_found' };
  }

  // 2. Check expiration
  if (Date.now() > entry.expiresAt) {
    store.delete(email);
    return { ok: false, reason: 'expired' };
  }

  // 3. Check attempt limit
  if (entry.attempts >= 3) {
    return { ok: false, reason: 'too_many_attempts' };
  }

  // 4. Check incorrect OTP
  if (entry.otp !== code) {
    entry.attempts++;
    return { ok: false, reason: 'wrong_code' };
  }

  // 5. Correct OTP: delete it (single-use)
  store.delete(email);

  return { ok: true };
}

function markVerified(email) {
  console.log(`Email verified: ${email}`);
}

module.exports = {
  generateOTP,
  storeOTP,
  verifyOTP,
  markVerified,
  _store: store,
};
