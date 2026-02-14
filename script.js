(function () {
  'use strict';

  const NO_MESSAGES = ['No', 'Are you sure?', 'Maybe?', 'Please?', 'Pretty please?', 'Okay, fine... Yes!'];
  const SUCCESS_HEARTS = '♥ ♥ ♥ ♥ ♥';

  const askSection = document.getElementById('ask-section');
  const successSection = document.getElementById('success-section');
  const btnYes = document.getElementById('btn-yes');
  const btnNo = document.getElementById('btn-no');
  const btnWrapperNo = document.querySelector('.btn-wrapper-no');
  const successHeartsEl = successSection.querySelector('.success-hearts');

  let noClickCount = 0;
  let isSuccess = false;
  let lastNoInteraction = 0;
  let yesBlockTimeout = null;

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

  function isMobileView() {
    return window.innerWidth <= 768;
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

    let newX, newY;
    if (isMobileView()) {
      newX = (window.innerWidth - btnWidth) / 2;
      newY = rect.top + (Math.random() - 0.5) * 180;
    } else {
      newX = rect.left + (Math.random() - 0.5) * 200;
      newY = rect.top + (Math.random() - 0.5) * 200;
    }

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
      let newX, newY;

      if (isMobileView()) {
        newX = (window.innerWidth - rect.width) / 2;
        newY = rect.top + (dy > 0 ? escapeDistance : -escapeDistance);
      } else {
        const angle = Math.atan2(dy, dx);
        newX = rect.left + Math.cos(angle) * escapeDistance;
        newY = rect.top + Math.sin(angle) * escapeDistance;
      }

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

  function blockYesTemporarily() {
    lastNoInteraction = Date.now();
    btnYes.style.pointerEvents = 'none';
    btnYes.setAttribute('aria-disabled', 'true');
    clearTimeout(yesBlockTimeout);
    yesBlockTimeout = setTimeout(() => {
      btnYes.style.pointerEvents = '';
      btnYes.removeAttribute('aria-disabled');
    }, 600);
  }

  btnYes.addEventListener('click', (e) => {
    if (Date.now() - lastNoInteraction < 600) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    showSuccess();
  });

  btnNo.addEventListener('mouseenter', (e) => {
    if (isSuccess) return;
    moveNoButtonAwayFrom(e.clientX, e.clientY);
  });

  btnNo.addEventListener('mousemove', (e) => {
    if (isSuccess) return;
    moveNoButtonAwayFrom(e.clientX, e.clientY);
  });

  function handleNoClick() {
    if (isSuccess) return;

    if (noClickCount >= NO_MESSAGES.length - 1) {
      showSuccess();
      return;
    }

    noClickCount += 1;
    btnNo.textContent = NO_MESSAGES[noClickCount];
    moveNoButton();
  }

  btnNo.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    blockYesTemporarily();
    handleNoClick();
  });

  window.addEventListener('resize', () => {
    if (btnNo.style.position === 'fixed') {
      const rect = btnNo.getBoundingClientRect();
      const padding = 60;
      const maxX = window.innerWidth - rect.width - padding;
      const maxY = window.innerHeight - rect.height - padding;
      const minX = padding;
      const minY = padding;
      const newX = isMobileView() ? (window.innerWidth - rect.width) / 2 : (parseFloat(btnNo.style.left) || 0);
      const clampedX = Math.max(minX, Math.min(maxX, newX));
      const clampedY = Math.max(minY, Math.min(maxY, parseFloat(btnNo.style.top) || 0));
      btnNo.style.left = `${clampedX}px`;
      btnNo.style.top = `${clampedY}px`;
    }
  });

  function isTouchOnNo(e) {
    const t = e.target;
    return t === btnNo || (btnWrapperNo && btnWrapperNo.contains(t));
  }

  if ('ontouchstart' in window) {
    document.addEventListener('touchstart', (e) => {
      if (isTouchOnNo(e)) {
        blockYesTemporarily();
      }
    }, { capture: true });

    let touchTarget = null;
    let touchMoved = false;
    btnNo.addEventListener('touchstart', (e) => {
      touchTarget = e.touches[0];
      touchMoved = false;
      if (isSuccess) return;
      e.preventDefault();
      moveNoButton();
    }, { passive: false });
    btnNo.addEventListener('touchmove', (e) => {
      touchMoved = true;
      if (touchTarget && e.touches[0]) {
        moveNoButtonAwayFrom(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });
    btnNo.addEventListener('touchend', (e) => {
      e.preventDefault();
      if (!touchMoved && !isSuccess) {
        handleNoClick();
      }
      touchTarget = null;
    }, { passive: false });
  }
})();
