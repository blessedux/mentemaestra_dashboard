// Stub module for @walletconnect/ethereum-provider
// This prevents build errors when Privy tries to import this package
// Since we're only using email/Google auth, this module is never actually used

// Support both CommonJS and ES modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {};
}
if (typeof exports !== 'undefined') {
  exports.default = {};
  exports = {};
}
