const dayCards = Array.from(document.querySelectorAll('details.card'));
const dayLinks = Array.from(document.querySelectorAll('.day-link'));

const openDayFromHash = () => {
  const id = window.location.hash.slice(1);
  if (!id) return;

  const target = document.getElementById(id);
  if (target?.matches('details.card')) {
    target.open = true;
  }
};

const markActiveDay = () => {
  const hashCard = window.location.hash ? document.getElementById(window.location.hash.slice(1)) : null;
  const openCard = hashCard?.matches("details.card") ? hashCard : dayCards.find((card) => card.open);

  dayLinks.forEach((link) => {
    if (link.getAttribute('href') === `#${openCard?.id}`) {
      link.setAttribute('aria-current', 'true');
    } else {
      link.removeAttribute('aria-current');
    }
  });
};

dayCards.forEach((card) => {
  card.addEventListener('toggle', markActiveDay);
});

dayLinks.forEach((link) => {
  link.addEventListener('click', () => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target?.matches('details.card')) {
      target.open = true;
    }
  });
});

openDayFromHash();
markActiveDay();
window.addEventListener('hashchange', () => {
  openDayFromHash();
  markActiveDay();
});
