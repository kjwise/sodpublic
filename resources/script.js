// School of the Dragon — ambient void particles & awareness thread
window.addEventListener('load', () => {
  const prefersFinePointer =
    window.matchMedia &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const mainEl = document.querySelector('main');
  if (!mainEl) return;

  // Subtle “virtual particle” background in the side void margins
  if (prefersFinePointer && !prefersReducedMotion && window.innerWidth >= 960) {
    const particleLayer = document.createElement('div');
    particleLayer.className = 'particle-layer';
    document.body.appendChild(particleLayer);

    const spawnParticle = () => {
      const rect = mainEl.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const sideMarginTotal = vw - rect.width;

      // Skip if almost no side margin (small screens or very narrow layout)
      if (sideMarginTotal < 120) return;

      const particle = document.createElement('div');
      particle.className = 'particle';

      const baseSize = 4;
      const jitter = Math.random() * 2 - 1; // -1..1
      const size = Math.max(2, baseSize + jitter);
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      if (Math.random() < 0.25) {
        particle.classList.add('particle--alt');
      }

      const onLeft = Math.random() < 0.5;
      const y = Math.random() * vh;
      let x;
      if (onLeft) {
        x = Math.random() * rect.left;
      } else {
        x = rect.right + Math.random() * (vw - rect.right);
      }

      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;

      particleLayer.appendChild(particle);

      const lifetime = 1200;
      setTimeout(() => {
        particle.remove();
      }, lifetime + 500);
    };

    const intervalId = setInterval(spawnParticle, 325);

    window.addEventListener('resize', () => {
      if (window.innerWidth < 960) {
        clearInterval(intervalId);
        particleLayer.innerHTML = '';
      }
    });
  }

  // Left-hand “awareness thread” in the void margin tracking reading depth
  if (prefersFinePointer && !prefersReducedMotion) {
    const thread = document.createElement('div');
    thread.className = 'awareness-thread';
    document.body.appendChild(thread);

    let pendingY = null;
    let frameRequested = false;
    let fadeTimeout = null;

    const updateThread = () => {
      frameRequested = false;
      if (pendingY == null) return;

      const mainRect = mainEl.getBoundingClientRect();
      const startY = mainRect.top + 8;
      const targetY = Math.max(startY + 8, pendingY);
      const height = targetY - startY;
      const left = mainRect.left - 6;

      if (height <= 0 || left < 0) {
        thread.style.opacity = '0';
        return;
      }

      thread.style.left = `${left}px`;
      thread.style.top = `${startY}px`;
      thread.style.height = `${height}px`;
      thread.style.opacity = '1';

      if (fadeTimeout) {
        clearTimeout(fadeTimeout);
      }
      fadeTimeout = setTimeout(() => {
        thread.style.opacity = '0';
      }, 1800);
    };

    const requestUpdate = (y) => {
      pendingY = y;
      if (!frameRequested) {
        frameRequested = true;
        window.requestAnimationFrame(updateThread);
      }
    };

    const handlePointerMove = (event) => {
      const target = event.target.closest('p, li, h2, h3, h4, h1');
      if (target) {
        const rect = target.getBoundingClientRect();
        requestUpdate(rect.top + rect.height / 2);
      } else {
        requestUpdate(event.clientY);
      }
    };

    mainEl.addEventListener('mousemove', handlePointerMove);

    const handleScroll = () => {
      const mainRect = mainEl.getBoundingClientRect();
      const viewportMid = window.innerHeight * 0.38;
      const minY = mainRect.top + 16;
      const maxY = mainRect.bottom - 24;
      const rawY = viewportMid;
      const clampedY = Math.min(Math.max(rawY, minY), maxY);

      requestUpdate(clampedY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }
});

