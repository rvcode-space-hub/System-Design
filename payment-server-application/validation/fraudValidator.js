async function runFraudChecks(payload) {
  // payload contains sender, receiver, amount, meta
  if (payload.sender_wallet_id === payload.receiver_wallet_id) {
    const err = new Error('Self-transfer not allowed');
    err.code = 'INVALID_TX';
    throw err;
  }
  // TODO: add velocity, blacklist, device fingerprint checks
  return true;
}

module.exports = { runFraudChecks };
