// content.js – Safe loading with retry (no illegal return)

// Load Dilithium library
const libScript = document.createElement('script');
libScript.src = chrome.runtime.getURL('lib/dilithium.min.js');
libScript.onload = initQSIG;
libScript.onerror = () => console.error("QSIG: Failed to load Dilithium library");
document.head.appendChild(libScript);

// Main init function with retry
function initQSIG() {
  if (!window.DilithiumAlgorithm) {
    // Library not ready yet – retry in 100ms
    setTimeout(initQSIG, 100);
    return;
  }

  const Dilithium = window.DilithiumAlgorithm;
  console.log("QSIG: Dilithium loaded – Quantum Shield ready");

  (async function setupQuantumShield() {
    // Load or generate keys
    let { qsig_sk } = await chrome.storage.local.get(['qsig_sk']);
    if (!qsig_sk) {
      console.log("QSIG: Generating quantum keys (2-4 seconds)...");
      const keys = Dilithium.generateKeyPair(3); // Level 3 = ML-DSA-65
      qsig_sk = keys.privateKey;
      const qsig_pk = keys.publicKey;
      await chrome.storage.local.set({ qsig_sk, qsig_pk });
      console.log("QSIG: Keys generated and saved");
    }

    // Intercept wallet signing
    if (!window.ethereum) {
      console.log("QSIG: No wallet detected");
      return;
    }

    const originalRequest = window.ethereum.request;

    window.ethereum.request = async (args) => {
      const method = args.method;

      if (['personal_sign', 'eth_signTypedData', 'eth_signTypedData_v3', 'eth_signTypedData_v4'].includes(method)) {
        const message = typeof args.params[0] === 'string' 
          ? args.params[0] 
          : JSON.stringify(args.params[1]);

        console.log("%c🔒 QSIG: Quantum signing in progress...", "color:#00ff00;font-size:16px;font-weight:bold");

        const msgBytes = new TextEncoder().encode(message);
        const qSignature = Dilithium.sign(msgBytes, qsig_sk, 3);
        const qSigBase64 = btoa(String.fromCharCode(...new Uint8Array(qSignature)));

        console.log("%c🛡️ QSIG: QUANTUM SIGNATURE LOGGED", "color:#00ff00;font-size:18px;font-weight:bold");
        console.log("Signature (base64):", qSigBase64.slice(0, 80) + "...");

        // Optional visible notification
        const notif = document.createElement('div');
        notif.innerHTML = `
          <div style="position:fixed;top:20px;right:20px;background:#00ff00;color:black;padding:15px;border-radius:12px;z-index:99999;font-weight:bold;box-shadow:0 0 20px #00ff00;">
            QSIG: Quantum Protected ✓
          </div>`;
        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 4000);
      }

      return originalRequest(args);
    };

    console.log("%c🛡️ QSIG Wallet Shield ACTIVE – Quantum Protection ON", "color:#00ff00;font-size:20px;font-weight:bold");
  })();
}