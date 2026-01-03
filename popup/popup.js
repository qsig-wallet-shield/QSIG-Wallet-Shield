// popup.js – All your popup logic
document.addEventListener('DOMContentLoaded', () => {
  // Example: Update last sign time
  chrome.storage.local.get(['lastSignTime'], (data) => {
    if (data.lastSignTime) {
      document.getElementById('lastSign').textContent = `Last quantum signature: ${data.lastSignTime}`;
    }
  });

  // Listen for new signatures
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "QUANTUM_SIGNED") {
      const time = new Date().toLocaleTimeString();
      document.getElementById('lastSign').textContent = `Last quantum signature: ${time}`;
      chrome.storage.local.set({ lastSignTime: time });
    }
  });
});