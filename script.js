const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

// Basic client-side access control only; use Cloudflare signed URLs or server-side authentication for stronger security.
const EVENT_PIN = "2580";
const CLOUDFLARE_LIFECYCLE_URL = 'https://customer-qkwe88t0rzsqmnjy.cloudflarestream.com/e6b760ce813b42de4fb8a2f5433dcaef/lifecycle';
const LIVE_STATUS_KEY = 'kvl-live-input-has-started-session-v2';
const ASSET_VERSION = '20260813-3';
const CACHE_CLEANUP_VERSION = 'kvl-cache-cleanup-20260813-1';
const pageNames = ['how-it-works', 'pricing', 'about', 'contact', 'live'];

// One-time cleanup for any old KVL service worker/cache from an earlier deployment.
// This site does not use offline/PWA functionality, so it will not run again after this version is marked.
const cleanupOldKvlCaches = async () => {
  try {
    if (localStorage.getItem(CACHE_CLEANUP_VERSION) === 'done') return;
    const registrations = await navigator.serviceWorker?.getRegistrations?.() || [];
    await Promise.all(registrations.map((registration) => registration.unregister()));
    const cacheNames = typeof caches !== 'undefined' ? await caches.keys() : [];
    const kvlCacheNames = cacheNames.filter((cacheName) => /kvl|workbox|precache/i.test(cacheName));
    await Promise.all(kvlCacheNames.map((cacheName) => caches.delete(cacheName)));
    localStorage.removeItem('kvl-live-input-has-started-v1');
    localStorage.setItem(CACHE_CLEANUP_VERSION, 'done');
  } catch (_) {
    // Storage/service-worker APIs may be unavailable; the site remains usable without cleanup.
  }
};
cleanupOldKvlCaches();
const pagePath = window.location.pathname.split('/').filter(Boolean).pop()?.replace('.html', '') || 'index';
const cleanPath = pageNames.includes(pagePath) ? `/${pagePath}/` : '/';
if (window.location.pathname.endsWith('.html') && window.history?.replaceState) {
  window.history.replaceState({}, '', cleanPath + window.location.search + window.location.hash);
}

const imageFixes = document.createElement('link');
imageFixes.rel = 'stylesheet';
imageFixes.href = `/site-fixes.css?v=${ASSET_VERSION}`;
document.head.appendChild(imageFixes);

document.querySelectorAll('a[href$=".html"]').forEach((link) => {
  const target = link.getAttribute('href');
  if (target.startsWith('events.html')) {
    link.setAttribute('href', '/#occasions');
    link.textContent = link.textContent.replace(/Events/g, 'Occasions');
    return;
  }
  const match = target.match(/^(?:\.\.\/)?([^/#?]+)\.html(.*)$/);
  if (match && pageNames.includes(match[1])) link.dataset.cleanHref = `/${match[1]}/${match[2] || ''}`;
});

document.querySelectorAll('.site-nav a').forEach((link) => {
  const label = link.textContent.trim();
  if (label === 'Events') {
    link.setAttribute('href', '/#occasions');
  }
  if (label === 'Occasions') {
    link.textContent = 'Events';
    link.setAttribute('href', '/#occasions');
  }
  if (label === 'About Us') {
    link.setAttribute('href', 'about.html');
  }
  if (label === 'About & Contact') {
    link.textContent = 'About Us';
    link.setAttribute('href', 'about.html');
  }
});

const siteNav = document.querySelector('.site-nav');
const hasLiveLink = [...(siteNav?.querySelectorAll('a') || [])].some((link) => link.dataset.liveNav === 'true');
if (siteNav && !hasLiveLink) {
  const liveLink = document.createElement('a');
  liveLink.href = '/live/';
  liveLink.textContent = 'Watch Live';
  liveLink.dataset.liveNav = 'true';
  const pricingLink = [...siteNav.querySelectorAll('a')].find((link) => link.textContent.trim() === 'Pricing');
  pricingLink?.after(liveLink);
}
if (siteNav && ![...siteNav.querySelectorAll('a')].some((link) => link.textContent.trim() === 'Contact')) {
  const contactLink = document.createElement('a');
  contactLink.href = 'about.html#contact';
  contactLink.textContent = 'Contact';
  const aboutLink = [...siteNav.querySelectorAll('a')].find((link) => link.textContent.trim() === 'About Us');
  aboutLink?.after(contactLink);
}

document.querySelectorAll('a[href^="contact.html"]').forEach((link) => {
  const target = link.getAttribute('href');
  const query = target.includes('?') ? target.slice(target.indexOf('?')) : '';
  link.setAttribute('href', `about.html${query}#contact`);
  delete link.dataset.cleanHref;
});

document.addEventListener('click', (event) => {
  const link = event.target.closest?.('a[data-clean-href]');
  if (link && !event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0) {
    event.preventDefault();
    window.location.href = link.dataset.cleanHref;
  }
});

menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

document.querySelectorAll('.filter-button').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter-button').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    document.querySelectorAll('.event-cards .event-card').forEach((card) => {
      card.hidden = filter !== 'all' && card.dataset.category !== filter;
    });
  });
});

const form = document.querySelector('#contact-form');
const params = new URLSearchParams(window.location.search);
const requestedEvent = params.get('event');
const requestedPackage = params.get('package');
if (form && requestedEvent) {
  const eventField = form.elements.event;
  const option = [...eventField.options].find((item) => item.value.toLowerCase().includes(requestedEvent.toLowerCase()));
  if (option) eventField.value = option.value;
}
if (form && requestedPackage && !form.elements.message.value) {
  form.elements.message.value = `I am interested in the ${requestedPackage} package.`;
}
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const subject = `KVL.app enquiry — ${data.get('event') || 'Event livestream'}`;
  const body = [
    `Name: ${data.get('name')}`,
    `Email: ${data.get('email')}`,
    `Phone: ${data.get('phone') || 'Not provided'}`,
    `Event: ${data.get('event')}`,
    `Date: ${data.get('date') || 'Not decided'}`,
    `Guests: ${data.get('guests') || 'Not provided'}`,
    '',
    String(data.get('message') || '')
  ].join('\n');
  document.querySelector('#form-note').textContent = 'Opening your email app…';
  window.location.href = `mailto:Kevalsatish@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

const pinGate = document.querySelector('#pin-gate');
const liveContent = document.querySelector('#live-content');
const pinForm = document.querySelector('#pin-form');
const pinError = document.querySelector('#pin-error');
const liveAccessKey = 'kvl-live-session-access';
const liveStatusBadge = document.querySelector('#live-status-badge');
const liveStatusLabel = document.querySelector('#live-status-label');
const liveEndedOverlay = document.querySelector('#live-ended-overlay');
const recordedPlayer = document.querySelector('#recorded-player');
let liveStatusTimer;

const setLiveStatus = (status) => {
  if (!liveStatusBadge || !liveStatusLabel) return;
  liveStatusBadge.dataset.status = status;
  liveStatusLabel.textContent = status === 'live' ? 'LIVE' : status === 'ended' ? 'ENDED' : 'WAITING';
  liveStatusBadge.setAttribute('aria-label', status === 'live' ? 'Live now' : status === 'ended' ? 'Stream ended' : 'Stream waiting to start');
  if (liveEndedOverlay) liveEndedOverlay.hidden = status !== 'ended';
};

const checkLiveStatus = async () => {
  try {
    const response = await fetch(CLOUDFLARE_LIFECYCLE_URL, { cache: 'no-store' });
    if (!response.ok) return;
    const lifecycle = await response.json();
    if (lifecycle.live === true) {
      try { sessionStorage.setItem(LIVE_STATUS_KEY, 'started'); } catch (_) {}
      setLiveStatus('live');
    } else {
      let hasStarted = false;
      try { hasStarted = sessionStorage.getItem(LIVE_STATUS_KEY) === 'started'; } catch (_) {}
      setLiveStatus(hasStarted ? 'ended' : 'waiting');
    }
  } catch (_) {
    // Keep the embedded Cloudflare player available if the public status check is unavailable.
  }
};

const startLiveStatusChecks = () => {
  if (!liveStatusBadge) return;
  checkLiveStatus();
  window.clearInterval(liveStatusTimer);
  liveStatusTimer = window.setInterval(checkLiveStatus, 15000);
};

const shareLiveButton = document.querySelector('#share-live-button');
const copyLiveButton = document.querySelector('#copy-live-button');
const shareNote = document.querySelector('#share-note');
const liveShareUrl = `${window.location.origin}/live/`;

const copyLiveLink = async () => {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(liveShareUrl);
    } else {
      const helper = document.createElement('textarea');
      helper.value = liveShareUrl;
      helper.setAttribute('readonly', '');
      helper.style.position = 'fixed';
      helper.style.opacity = '0';
      document.body.appendChild(helper);
      helper.select();
      document.execCommand('copy');
      helper.remove();
    }
    if (shareNote) shareNote.textContent = 'Private link copied.';
  } catch (_) {
    if (shareNote) shareNote.textContent = `Copy this link: ${liveShareUrl}`;
  }
};

copyLiveButton?.addEventListener('click', copyLiveLink);
shareLiveButton?.addEventListener('click', async () => {
  if (navigator.share) {
    try {
      await navigator.share({ title: 'Watch the Wedding Reception live', text: 'Join the private KVL.app livestream.', url: liveShareUrl });
      if (shareNote) shareNote.textContent = 'Share sheet opened.';
    } catch (error) {
      if (error.name !== 'AbortError') copyLiveLink();
    }
  } else {
    copyLiveLink();
  }
});

if (pinGate && liveContent && pinForm) {
  const unlockLivePage = () => {
    pinGate.hidden = true;
    liveContent.hidden = false;
    sessionStorage.setItem(liveAccessKey, 'granted');
    if (!recordedPlayer) startLiveStatusChecks();
  };

  if (sessionStorage.getItem(liveAccessKey) === 'granted') unlockLivePage();

  pinForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const enteredPin = pinForm.elements.pin.value.trim();
    if (enteredPin === EVENT_PIN) {
      pinError.textContent = '';
      unlockLivePage();
    } else {
      pinError.textContent = 'That PIN is not correct. Please try again.';
      pinForm.elements.pin.select();
    }
  });
}
