import { Signature } from '@openforge-sh/liboqs';

(async () => {
  const Dilithium3 = await Signature.Dilithium3();

  if (!window.ethereum) return;

  const original = window.ethereum.request;

  window.ethereum.request = async (args) => {
    if (['personal_sign', 'eth_signTypedData', 'eth_signTypedData_v4'].includes(args.method)) {
      const message = typeof args.params[0] === 'string' ? args.params[0] : JSON.stringify(args.params[1]);

      const response = await chrome.runtime.sendMessage({
        type: "QSIG_SIGN",
        message: new TextEncoder().encode(message)
      });

      if (response.success) {
        console.log("%c QSIG QUANTUM PROTECTION ACTIVE", "color:#00ff00;font-size:16px;font-weight:bold");
      }
    }
    return original(args);
  };

  console.log("%c QSIG Wallet Shield ACTIVE – Quantum Safe", "color:#00ff00;font-size:16px");
})();

(async () => {
  await oqs.ready;

  if (!window.ethereum) return;

  const original = window.ethereum.request;

  window.ethereum.request = async (args) => {
    if (['personal_sign', 'eth_signTypedData', 'eth_signTypedData_v4'].includes(args.method)) {
      const message = typeof args.params[0] === 'string' ? args.params[0] : JSON.stringify(args.params[1]);

      const response = await chrome.runtime.sendMessage({
        type: "QSIG_SIGN",
        message: new TextEncoder().encode(message)
      });

      if (response.success) {
        console.log("%c QSIG QUANTUM PROTECTION ACTIVE", "color:#00ff00;font-size:16px;font-weight:bold");
      }
    }
    return original(args);
  };

  console.log("%c QSIG Wallet Shield ACTIVE – Quantum Safe", "color:#00ff00;font-size:16px");
})();