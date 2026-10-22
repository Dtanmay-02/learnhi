(() => {
  'use strict';
  const greetings = window.GREETINGS || [];
  const grid = document.querySelector('#greeting-grid');
  const search = document.querySelector('#search');
  const loadMore = document.querySelector('#load-more');
  const dialog = document.querySelector('#random-dialog');
  const palette = ['#e8eddc', '#f5dfd2', '#e7e1f0', '#f6e8ad', '#e0e9e8', '#e6e7f2', '#f3e3dc', '#e2ead6'];
  const pageSize = 12;
  let region = 'All';
  let limit = pageSize;
  let chosenGreeting = null;
  let toastTimer;
  const normalize = text => String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const copyIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="8" y="8" width="12" height="13" rx="2"/><path d="M15 8V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h4"/></svg>';

  function notify(message) {
    if (dialog.open) {
      const status = document.querySelector('#dialog-status');
      status.textContent = message;
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => { status.textContent = ''; }, 4000);
      return;
    }
    const toast = document.querySelector('#toast');
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('visible');
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 2800);
  }

  async function copyHello(greeting) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(greeting.hello);
      } else {
        const field = document.createElement('textarea');
        field.value = greeting.hello;
        field.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
        (dialog.open ? dialog : document.body).append(field);
        field.select();
        let copied;
        try { copied = document.execCommand('copy'); } finally { field.remove(); }
        if (!copied) throw new Error('Clipboard unavailable');
      }
      notify(`${greeting.hello} — copied. Go make someone smile!`);
    } catch {
      notify('Copy is unavailable here. Select the greeting to copy it.');
    }
  }

  function createCard(greeting, index) {
    const card = document.createElement('article');
    card.className = 'greeting-card';
    card.style.setProperty('--card-color', palette[index % palette.length]);
    const top = document.createElement('div');
    top.className = 'card-top';
    const hello = document.createElement('p');
    hello.className = 'card-hello' + (Array.from(greeting.hello).length > 11 ? ' long' : '');
    hello.textContent = greeting.hello;
    hello.lang = greeting.code;
    hello.dir = 'auto';
    const romanization = document.createElement('p');
    romanization.className = 'card-romanization';
    romanization.textContent = greeting.romanization || '';
    const copy = document.createElement('button');
    copy.type = 'button';
    copy.className = 'copy-button';
    copy.setAttribute('aria-label', `Copy hello in ${greeting.language}`);
    copy.title = `Copy ${greeting.hello}`;
    copy.innerHTML = copyIcon;
    copy.addEventListener('click', () => copyHello(greeting));
    top.append(hello, romanization, copy);
    const bottom = document.createElement('div');
    bottom.className = 'card-bottom';
    const label = document.createElement('div');
    const language = document.createElement('h3');
    language.textContent = greeting.language;
    const nativeName = document.createElement('p');
    nativeName.className = 'native-name';
    nativeName.textContent = greeting.nativeName || greeting.language;
    nativeName.lang = greeting.code;
    nativeName.dir = 'auto';
    label.append(language, nativeName);
    const tag = document.createElement('span');
    tag.className = 'region-tag';
    tag.textContent = greeting.region;
    bottom.append(label, tag);
    card.append(top, bottom);
    return card;
  }

  function render() {
    const query = normalize(search.value.trim());
    const filtered = greetings.filter(greeting => (region === 'All' || greeting.region === region) && normalize([greeting.language, greeting.nativeName, greeting.hello, greeting.romanization, greeting.region].join(' ')).includes(query));
    grid.replaceChildren(...filtered.slice(0, limit).map(createCard));
    const shown = Math.min(limit, filtered.length);
    document.querySelector('#result-count').textContent = `${filtered.length} ${filtered.length === 1 ? 'hello' : 'hellos'}${region !== 'All' ? ` · ${region}` : ' to discover'}`;
    document.querySelector('#visible-count').textContent = filtered.length ? `Showing ${shown} of ${filtered.length} hellos` : '';
    document.querySelector('#empty-state').hidden = filtered.length !== 0;
    loadMore.hidden = shown >= filtered.length;
    document.querySelector('.load-more-wrap').hidden = !filtered.length;
  }

  function randomHello() {
    if (!greetings.length) return;
    const choices = greetings.filter(greeting => greeting !== chosenGreeting);
    chosenGreeting = choices[Math.floor(Math.random() * choices.length)] || greetings[0];
    document.querySelector('#dialog-status').textContent = '';
    document.querySelector('#random-title').textContent = chosenGreeting.hello;
    document.querySelector('#random-title').lang = chosenGreeting.code;
    document.querySelector('#random-romanization').textContent = chosenGreeting.romanization || '';
    document.querySelector('#random-language').textContent = chosenGreeting.language;
    const native = document.querySelector('#random-native');
    native.textContent = [chosenGreeting.nativeName, chosenGreeting.region].filter(Boolean).join(' · ');
    if (!dialog.open) dialog.showModal();
  }

  search.addEventListener('input', () => { limit = pageSize; render(); });
  document.querySelectorAll('[data-region]').forEach(button => button.addEventListener('click', () => {
    region = button.dataset.region;
    limit = pageSize;
    document.querySelectorAll('[data-region]').forEach(filter => {
      const active = filter === button;
      filter.classList.toggle('active', active);
      filter.setAttribute('aria-pressed', String(active));
    });
    render();
  }));
  loadMore.addEventListener('click', () => {
    const previousCount = grid.children.length;
    limit += pageSize;
    render();
    const firstNewCopyButton = grid.children[previousCount]?.querySelector('button');
    if (firstNewCopyButton) firstNewCopyButton.focus({preventScroll: true});
  });
  document.querySelector('#reset-filters').addEventListener('click', () => {
    search.value = '';
    document.querySelector('[data-region="All"]').click();
    search.focus();
  });
  document.querySelectorAll('[data-random]').forEach(button => button.addEventListener('click', randomHello));
  document.querySelector('#another-hello').addEventListener('click', randomHello);
  document.querySelector('#copy-random').addEventListener('click', () => { if (chosenGreeting) copyHello(chosenGreeting); });
  document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
  document.addEventListener('keydown', event => {
    if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey && !dialog.open && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName) && !document.activeElement.isContentEditable) {
      event.preventDefault();
      search.focus();
    }
  });
  document.querySelector('#hero-count').textContent = `${greetings.length}`;
  document.querySelector('#collection-total').firstChild.textContent = `${greetings.length} LANGUAGES. COUNTLESS CONNECTIONS. `;
  document.querySelector('#coverage-note').textContent = `A growing collection of ${greetings.length} languages, with more hellos to discover. Some greetings are formal; others are casual. Usage varies by place and context. Regional filters are a broad guide; many languages cross borders.`;
  render();
})();
