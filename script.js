const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

document.getElementById('year').textContent = new Date().getFullYear();

const filters = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('.project-card');
filters.forEach(btn => btn.addEventListener('click', () => {
  filters.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const filter = btn.dataset.filter;
  cards.forEach(card => {
    const categories = card.dataset.category.split(' ');
    card.hidden = !(filter === 'all' || categories.includes(filter));
  });
}));

const modal = document.getElementById('videoModal');
const frameWrap = document.getElementById('videoFrameWrap');
const placeholder = document.getElementById('videoPlaceholder');
const videoMessage = document.getElementById('videoMessage');

function toEmbed(url) {
  if (!url || url.startsWith('YOUR_')) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com')) {
      const id = u.searchParams.get('v');
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : null;
    }
    if (u.hostname === 'youtu.be') {
      const id = u.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : null;
    }
    if (u.hostname.includes('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}?autoplay=1` : null;
    }
  } catch(e) {}
  return null;
}

function openVideo(url, label = 'Add your YouTube or Vimeo link in index.html') {
  const embed = toEmbed(url);
  frameWrap.innerHTML = '';
  if (embed) {
    placeholder.style.display = 'none';
    frameWrap.innerHTML = `<iframe src="${embed}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
  } else {
    placeholder.style.display = 'grid';
    videoMessage.textContent = label;
  }
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  frameWrap.innerHTML = '';
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-video]').forEach(btn => btn.addEventListener('click', () => openVideo(btn.dataset.video)));
document.querySelector('[data-open-showreel]')?.addEventListener('click', () => openVideo('YOUR_SHOWREEL_LINK', 'Add your main showreel link in script.js'));
document.querySelectorAll('[data-close-modal]').forEach(el => el.addEventListener('click', closeModal));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
