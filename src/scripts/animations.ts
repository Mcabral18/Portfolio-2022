import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

const fontsReady = Promise.race([
  document.fonts?.ready ?? Promise.resolve(),
  new Promise((resolve) => setTimeout(resolve, 1200)),
]);

fontsReady.then(() => {
  const mm = gsap.matchMedia();

  mm.add(
    {
      motion: '(prefers-reduced-motion: no-preference)',
      desktop: '(min-width: 861px)',
    },
    (context) => {
      const { motion, desktop } = context.conditions as { motion: boolean; desktop: boolean };
      if (!motion) return;

      /* ---------- Hero intro ---------- */
      const title = document.querySelector<HTMLElement>('[data-hero-title]');
      const intro = gsap.timeline({ defaults: { ease: 'power4.out' }, delay: 0.25 });

      if (title) {
        const split = SplitText.create(title, { type: 'chars', mask: 'chars' });
        gsap.set(title, { opacity: 1 });
        intro.from(split.chars, { yPercent: 115, duration: 1.3, stagger: 0.045 });
      }
      intro.fromTo(
        '[data-hero-in]',
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power3.out' },
        0.55,
      );

      /* ---------- Generic reveals ---------- */
      ScrollTrigger.batch('[data-reveal]', {
        start: 'top 88%',
        once: true,
        onEnter: (els) =>
          gsap.to(els, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.09, overwrite: true }),
      });

      /* ---------- Selected work: visuals wipe in, big numbers drift ---------- */
      gsap.utils.toArray<HTMLElement>('[data-feature-visual]').forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: 'inset(10% 10% 10% 10% round 6px)', opacity: 0.3 },
          {
            clipPath: 'inset(0% 0% 0% 0% round 6px)',
            opacity: 1,
            duration: 1.4,
            ease: 'power4.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          },
        );
      });

      if (desktop) {
        gsap.utils.toArray<HTMLElement>('.feature__num').forEach((num) => {
          gsap.fromTo(
            num,
            { yPercent: 30 },
            {
              yPercent: -30,
              ease: 'none',
              scrollTrigger: { trigger: num.closest('.feature'), start: 'top bottom', end: 'bottom top', scrub: true },
            },
          );
        });
      }

      /* ---------- About: word-by-word statement ---------- */
      const statement = document.querySelector<HTMLElement>('[data-words]');
      if (statement) {
        const words = SplitText.create(statement, { type: 'words', wordsClass: 'word' });
        gsap.fromTo(
          words.words,
          { opacity: 0.16 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: 'none',
            scrollTrigger: { trigger: statement, start: 'top 80%', end: 'bottom 45%', scrub: true },
          },
        );
      }

      gsap.fromTo(
        '[data-parallax]',
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: { trigger: '.about__frame', start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );

      /* ---------- Counters ---------- */
      gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
        const target = Number(el.dataset.count);
        const counter = { value: 0 };
        el.textContent = '0';
        gsap.to(counter, {
          value: target,
          duration: 1.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          onUpdate: () => {
            el.textContent = String(Math.round(counter.value));
          },
        });
      });

      /* ---------- Experience timeline progress ---------- */
      gsap.fromTo(
        '[data-timeline-progress]',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.timeline', start: 'top 70%', end: 'bottom 60%', scrub: true },
        },
      );
    },
  );

  window.addEventListener('load', () => ScrollTrigger.refresh());
});
