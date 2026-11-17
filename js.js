
// Sotuv boshlanadigan sana (o'zingizniki bilan almashtiring)
const LAUNCH = new Date('2026-11-30T00:00:00');
 
// Savatcha
const countEl = document.getElementById('count');
const toast = document.getElementById('toast');
let items = 0;
let toastTimer;
 
document.querySelectorAll('.card .add').forEach((btn) => {
  btn.addEventListener('click', () => {
    items += 1;
    countEl.textContent = items;
    const name = btn.closest('.card').querySelector('h3').textContent;
    toast.textContent = name + ' savatga qo\'shildi';
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
  });
});
 
// Telefonda menyuni ochish/yopish
const menuBtn = document.getElementById('menuBtn');
const nav = document.querySelector('nav');
menuBtn.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});
nav.addEventListener('click', () => {
  nav.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', false);
});
 
// Teskari hisob
const timerEl = document.getElementById('timer');
function tick() {
  const diff = LAUNCH - new Date();
  if (diff <= 0) {
    timerEl.textContent = 'boshlandi!';
    return;
  }
  const d = Math.floor(diff / 864e5);
  const h = Math.floor(diff / 36e5) % 24;
  const m = Math.floor(diff / 6e4) % 60;
  const s = Math.floor(diff / 1e3) % 60;
  timerEl.textContent = d + ' kun ' + String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}
tick();
setInterval(tick, 1000);