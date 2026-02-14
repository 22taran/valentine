(function () {
  'use strict';

  const NO_MESSAGES = ['No', 'Are you sure?', 'Maybe?', 'Please?', 'Pretty please?', 'Okay, fine... Yes!'];
  const SUCCESS_HEARTS = '♥ ♥ ♥ ♥ ♥';

  const askSection = document.getElementById('ask-section');
  const successSection = document.getElementById('success-section');
  const btnYes = document.getElementById('btn-yes');
  const btnNo = document.getElementById('btn-no');
  const successHeartsEl = successSection.querySelector('.success-hearts');

  let noClickCount = 0;
  let isSuccess = false;

  function fireConfetti() {
    if (typeof confetti !== 'function') return;

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#e8b4b8', '#f4a6a6', '#fce4ec', '#d4a574', '#e8c9a8'],
    });

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#e8b4b8', '#f4a6a6', '#d4a574'],
      });
    }, 200);

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#e8b4b8', '#f4a6a6', '#d4a574'],
      });
    }, 400);
  }

  function showSuccess() {
    if (isSuccess) return;
    isSuccess = true;

    askSection.classList.add('hidden');
    successSection.classList.remove('hidden');
    successHeartsEl.textContent = SUCCESS_HEARTS;
    fireConfetti();
  }

  function moveNoButton() {
    const rect = btnNo.getBoundingClientRect();
    const btnWidth = rect.width;
    const btnHeight = rect.height;
    const padding = 60;

    const maxX = window.innerWidth - btnWidth - padding;
    const maxY = window.innerHeight - btnHeight - padding;
    const minX = padding;
    const minY = padding;

    let newX = rect.left + (Math.random() - 0.5) * 200;
    let newY = rect.top + (Math.random() - 0.5) * 200;

    newX = Math.max(minX, Math.min(maxX, newX));
    newY = Math.max(minY, Math.min(maxY, newY));

    btnNo.style.position = 'fixed';
    btnNo.style.left = `${newX}px`;
    btnNo.style.top = `${newY}px`;
    btnNo.style.transform = 'translate(0, 0)';
    btnNo.style.zIndex = '100';
  }

  function moveNoButtonAwayFrom(x, y) {
    const rect = btnNo.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;
    const padding = 80;
    const escapeDistance = 120;

    const dx = btnCenterX - x;
    const dy = btnCenterY - y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 150) {
      const angle = Math.atan2(dy, dx);
      const newX = rect.left + Math.cos(angle) * escapeDistance;
      const newY = rect.top + Math.sin(angle) * escapeDistance;

      const maxX = window.innerWidth - rect.width - padding;
      const maxY = window.innerHeight - rect.height - padding;
      const minX = padding;
      const minY = padding;

      let clampedX = Math.max(minX, Math.min(maxX, newX));
      let clampedY = Math.max(minY, Math.min(maxY, newY));

    btnNo.style.position = 'fixed';
    btnNo.style.left = `${clampedX}px`;
    btnNo.style.top = `${clampedY}px`;
    btnNo.style.transform = 'translate(0, 0)';
    btnNo.style.zIndex = '100';
  }
  }

  btnYes.addEventListener('click', showSuccess);

  btnNo.addEventListener('mouseenter', (e) => {
    if (isSuccess) return;
    moveNoButtonAwayFrom(e.clientX, e.clientY);
  });

  btnNo.addEventListener('mousemove', (e) => {
    if (isSuccess) return;
    moveNoButtonAwayFrom(e.clientX, e.clientY);
  });

  btnNo.addEventListener('click', (e) => {
    if (isSuccess) return;

    if (noClickCount >= NO_MESSAGES.length - 1) {
      showSuccess();
      return;
    }

    noClickCount += 1;
    btnNo.textContent = NO_MESSAGES[noClickCount];
    moveNoButton();
  });

  window.addEventListener('resize', () => {
    if (btnNo.style.position === 'fixed') {
      const rect = btnNo.getBoundingClientRect();
      const padding = 60;
      const maxX = window.innerWidth - rect.width - padding;
      const maxY = window.innerHeight - rect.height - padding;
      const minX = padding;
      const minY = padding;
      const clampedX = Math.max(minX, Math.min(maxX, parseFloat(btnNo.style.left) || 0));
      const clampedY = Math.max(minY, Math.min(maxY, parseFloat(btnNo.style.top) || 0));
      btnNo.style.left = `${clampedX}px`;
      btnNo.style.top = `${clampedY}px`;
    }
  });

  if ('ontouchstart' in window) {
    let touchTarget = null;
    btnNo.addEventListener('touchstart', (e) => {
      touchTarget = e.touches[0];
      if (isSuccess) return;
      moveNoButton();
    });
    btnNo.addEventListener('touchmove', (e) => {
      if (touchTarget && e.touches[0]) {
        moveNoButtonAwayFrom(e.touches[0].clientX, e.touches[0].clientY);
      }
    });
  }
})();
