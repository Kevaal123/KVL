const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

// Basic client-side access control only; use Cloudflare signed URLs or server-side authentication for stronger security.
const EVENT_PIN = "2580";
const pageNames = ['how-it-works', 'pricing', 'about', 'contact', 'live'];
const pagePath = window.location.pathname.split('/').filter(Boolean).pop()?.replace('.html', '') || 'index';
const cleanPath = pageNames.includes(pagePath) ? `/${pagePath}/` : '/';
if (window.location.pathname.endsWith('.html') && window.history?.replaceState) {
  window.history.replaceState({}, '', cleanPath + window.location.search + window.location.hash);
}

const imageFixes = document.createElement('link');
imageFixes.rel = 'stylesheet';
imageFixes.href = '/site-fixes.css';
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
  liveLink.textContent = 'Watch a Live Stream';
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

if (pinGate && liveContent && pinForm) {
  const unlockLivePage = () => {
    pinGate.hidden = true;
    liveContent.hidden = false;
    sessionStorage.setItem(liveAccessKey, 'granted');
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
