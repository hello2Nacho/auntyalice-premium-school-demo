// Hero video: muted autoplay with a soft fade through the 8.0s poster at the loop
// point, because the shot ends much closer than it starts (see docs/02 video review).
(function () {
  const video = document.querySelector('[data-hero-video]');
  if (!video) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const FADE_LEAD = 0.65; // seconds before the end to start fading out (CSS fade is 0.6s)
  let fadingOut = false;

  video.muted = true;
  video.defaultMuted = true;

  function show() { video.classList.add('is-visible'); }
  function hide() { video.classList.remove('is-visible'); }

  function tryPlay() {
    if (reduceMotion.matches) return;
    const attempt = video.play();
    if (attempt && attempt.catch) attempt.catch(() => { /* autoplay blocked: poster stays */ });
  }

  video.addEventListener('playing', () => {
    fadingOut = false;
    show();
  });

  // Fade out just before the end, revealing the poster underneath.
  function watchEnd() {
    if (!fadingOut && video.duration && video.duration - video.currentTime <= FADE_LEAD) {
      fadingOut = true;
      hide();
    }
  }

  if ('requestVideoFrameCallback' in HTMLVideoElement.prototype) {
    const onFrame = () => { watchEnd(); video.requestVideoFrameCallback(onFrame); };
    video.requestVideoFrameCallback(onFrame);
  } else {
    video.addEventListener('timeupdate', watchEnd);
  }

  // Restart from the beginning once faded out; 'playing' fades it back in.
  video.addEventListener('ended', () => {
    video.currentTime = 0;
    tryPlay();
  });

  reduceMotion.addEventListener('change', (event) => {
    if (event.matches) { video.pause(); hide(); }
    else tryPlay();
  });

  // Pause while the hero is off-screen or the tab is hidden.
  let inView = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView && !document.hidden) tryPlay(); else video.pause();
    }, { threshold: 0.1 }).observe(video);
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) video.pause(); else if (inView) tryPlay();
  });

  tryPlay();
})();
