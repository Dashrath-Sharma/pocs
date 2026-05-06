const CURRENCY_LOCALE = {
    INR: 'en-IN',
    USD: 'en-US',
    CAD: 'en-CA',
    AUD: 'en-AU',
    EUR: 'en-IE',
    GBP: 'en-GB',
    JPY: 'ja-JP',
    NZD: 'en-NZ',
    HKD: 'zh-HK',
    SGD: 'zh-SG',
    DKK: 'da-DK',
  };

  const localeSelect = document.getElementById('localeSelect');
  const numInput     = document.getElementById('numInput');
  const outputDiv    = document.getElementById('formattedOutput');
  const rawDiv       = document.getElementById('rawOutput');
  const pillsDiv     = document.getElementById('pills');

  // Populate dropdown
  for (const [currency, locale] of Object.entries(CURRENCY_LOCALE)) {
    const opt = document.createElement('option');
    opt.value = locale;
    opt.textContent = `${currency} — ${locale}`;
    localeSelect.appendChild(opt);
  }
  localeSelect.value = CURRENCY_LOCALE.INR;

  // Populate pills
  for (const currency of Object.keys(CURRENCY_LOCALE)) {
    const pill = document.createElement('div');
    pill.className = 'pill' + (currency === 'INR' ? ' active' : '');
    pill.textContent = currency;
    pill.dataset.locale = CURRENCY_LOCALE[currency];
    pill.addEventListener('click', () => {
      localeSelect.value = CURRENCY_LOCALE[currency];
      document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      updateOutput();
    });
    pillsDiv.appendChild(pill);
  }

  // Sync pills when dropdown changes
  localeSelect.addEventListener('change', () => {
    document.querySelectorAll('.pill').forEach(p => {
      p.classList.toggle('active', p.dataset.locale === localeSelect.value);
    });
    updateOutput();
  });

  const formatNumber = (value, locale) => {
    const num = Number(value);
    if (isNaN(num)) return null;
    return new Intl.NumberFormat(locale, {
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: 2,
    }).format(num);
  };

  const updateOutput = () => {
    const value  = numInput.value.trim();
    const locale = localeSelect.value;

    if (!value) {
      outputDiv.textContent = '—';
      outputDiv.className = 'output-value empty';
      rawDiv.textContent = '';
      return;
    }

    const formatted = formatNumber(value, locale);

    if (!formatted) {
      outputDiv.textContent = 'Invalid number';
      outputDiv.className = 'output-value error';
      rawDiv.textContent = '';
      return;
    }

    outputDiv.textContent = formatted;
    outputDiv.className = 'output-value';
    rawDiv.textContent = `raw: ${Number(value).toLocaleString(locale)}`;
  };

  numInput.addEventListener('input', updateOutput);