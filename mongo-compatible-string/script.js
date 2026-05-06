let lastResult = '';

  function convert() {
    const text = document.getElementById('input').value;
    if (!text.trim()) {
      showToast('Enter some text first!', 'warn', 'ti-alert-triangle');
      return;
    }

    const quoteRegex = /\u201C|\u201D|\u201E|\u201F|\u2033|\u2036|"/gm;
    const newlineRegex = /\n/gm;

    const quoteMatches = (text.match(quoteRegex) || []).length;
    const newlineMatches = (text.match(newlineRegex) || []).length;
    const totalReplacements = quoteMatches + newlineMatches;

    const escaped = text
      .replace(quoteRegex, '\\"')
      .replace(newlineRegex, '\\n');

    lastResult = `"${escaped}",`;

    const box = document.getElementById('output');
    box.textContent = lastResult;

    document.getElementById('stat-len').textContent = lastResult.length.toLocaleString();
    document.getElementById('stat-rep').textContent = totalReplacements;
    document.getElementById('stats').style.display = 'flex';

    showToast('Converted successfully!', 'success', 'ti-check');
  }

  function clearAll() {
    document.getElementById('input').value = '';
    document.getElementById('output').innerHTML = '<span class="output-placeholder">Your converted string will appear here...</span>';
    document.getElementById('stats').style.display = 'none';
    lastResult = '';
  }

  function copyOutput() {
    if (!lastResult) {
      showToast('Nothing to copy yet!', 'warn', 'ti-alert-triangle');
      return;
    }

    const icon = document.getElementById('copy-icon');

    navigator.clipboard.writeText(lastResult)
      .then(() => {
        icon.className = 'ti ti-check';
        showToast('Copied to clipboard!', 'success', 'ti-clipboard-check');
        setTimeout(() => { icon.className = 'ti ti-copy'; }, 2000);
      })
      .catch(() => {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = lastResult;
        ta.style.cssText = 'position:fixed;top:-999px;opacity:0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);

        icon.className = 'ti ti-check';
        showToast('Copied to clipboard!', 'success', 'ti-clipboard-check');
        setTimeout(() => { icon.className = 'ti ti-copy'; }, 2000);
      });
  }

  // Allow Ctrl+Enter to convert
  document.getElementById('input').addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') convert();
  });

  function showToast(msg, type, iconClass) {
    const toast   = document.getElementById('toast');
    const toastMsg  = document.getElementById('toast-msg');
    const toastIcon = document.getElementById('toast-icon');

    toastMsg.textContent = msg;
    toastIcon.className = `ti ${iconClass}`;
    toast.className = `toast ${type}`;

    void toast.offsetWidth; // reflow to restart animation
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2400);
  }