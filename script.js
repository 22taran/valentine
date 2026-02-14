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

  function getNoButtonBounds() {
    const rect = btnNo.getBoundingClientRect();
    const btnWidth = rect.width;
    const btnHeight = rect.height;
    const padding = 60;
    const gap = 24;

    let minX = padding;
    let minY = padding;
    let maxX = window.innerWidth - btnWidth - padding;
    let maxY = window.innerHeight - btnHeight - padding;

    if (isMobileView()) {
      const yesRect = btnYes.getBoundingClientRect();
      minY = yesRect.bottom + gap;
      maxY = Math.max(minY, window.innerHeight - btnHeight - padding);
    }

    return { minX, minY, maxX, maxY };
  }

  function moveNoButton() {
    const rect = btnNo.getBoundingClientRect();
    const btnWidth = rect.width;
    const btnHeight = rect.height;
    const bounds = getNoButtonBounds();

    let newX = bounds.minX + Math.random() * (bounds.maxX - bounds.minX);
    let newY = bounds.minY + Math.random() * (bounds.maxY - bounds.minY);

    newX = Math.max(bounds.minX, Math.min(bounds.maxX, newX));
    newY = Math.max(bounds.minY, Math.min(bounds.maxY, newY));

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
    const escapeDistance = 120;

    const dx = btnCenterX - x;
    const dy = btnCenterY - y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 150) {
      const angle = Math.atan2(dy, dx);
      const newX = rect.left + Math.cos(angle) * escapeDistance;
      const newY = rect.top + Math.sin(angle) * escapeDistance;

      const bounds = getNoButtonBounds();
      const clampedX = Math.max(bounds.minX, Math.min(bounds.maxX, newX));
      const clampedY = Math.max(bounds.minY, Math.min(bounds.maxY, newY));

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
      const bounds = getNoButtonBounds();
      const currentX = parseFloat(btnNo.style.left) || 0;
      const currentY = parseFloat(btnNo.style.top) || 0;
      const clampedX = Math.max(bounds.minX, Math.min(bounds.maxX, currentX));
      const clampedY = Math.max(bounds.minY, Math.min(bounds.maxY, currentY));
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
