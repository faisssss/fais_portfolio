'use client';

/*
 * Adapted from React Bits — StaggeredMenu (TS + Tailwind). See LICENSE.md in this folder.
 * Changes for this site:
 *  - GSAP runs through useGSAP(); handlers are wrapped in contextSafe() so their tweens are cleaned up.
 *  - `logo` takes a ReactNode instead of an image URL.
 *  - Dark theme driven by the site's CSS tokens; smaller, responsive type.
 *  - Accessibility: the closed panel is `inert`, Escape closes, focus moves into the panel and back.
 *  - `onItemSelect` lets the parent handle navigation (smooth scroll with Lenis) instead of a hash jump.
 *  - The full-screen wrapper ignores taps (only the bar and open panel take them); it used to block the page.
 */

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import { gsap, useGSAP } from '../../lib/gsap';

export interface StaggeredMenuItem {
  label: string;
  ariaLabel: string;
  link: string;
}
export interface StaggeredMenuSocialItem {
  label: string;
  link: string;
}
export interface StaggeredMenuProps {
  position?: 'left' | 'right';
  colors?: string[];
  items?: StaggeredMenuItem[];
  socialItems?: StaggeredMenuSocialItem[];
  displaySocials?: boolean;
  displayItemNumbering?: boolean;
  className?: string;
  logo?: ReactNode;
  menuButtonColor?: string;
  openMenuButtonColor?: string;
  accentColor?: string;
  isFixed: boolean;
  changeMenuColorOnOpen?: boolean;
  closeOnClickAway?: boolean;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
  onItemSelect?: (item: StaggeredMenuItem) => void;
}

export const StaggeredMenu = ({
  position = 'right',
  colors = ['#1e1e22', '#35353c'],
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  className,
  logo,
  menuButtonColor = '#fff',
  openMenuButtonColor = '#fff',
  changeMenuColorOnOpen = true,
  accentColor = '#5227FF',
  isFixed = false,
  closeOnClickAway = true,
  onMenuOpen,
  onMenuClose,
  onItemSelect
}: StaggeredMenuProps) => {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);

  const scopeRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const preLayersRef = useRef<HTMLDivElement | null>(null);
  const preLayerElsRef = useRef<HTMLElement[]>([]);

  const plusHRef = useRef<HTMLSpanElement | null>(null);
  const plusVRef = useRef<HTMLSpanElement | null>(null);
  const iconRef = useRef<HTMLSpanElement | null>(null);

  const textInnerRef = useRef<HTMLSpanElement | null>(null);
  const [textLines, setTextLines] = useState<string[]>(['Menu', 'Close']);

  const openTlRef = useRef<gsap.core.Timeline | null>(null);
  const closeTweenRef = useRef<gsap.core.Tween | null>(null);
  const spinTweenRef = useRef<gsap.core.Timeline | null>(null);
  const textCycleAnimRef = useRef<gsap.core.Tween | null>(null);
  const colorTweenRef = useRef<gsap.core.Tween | null>(null);

  const toggleBtnRef = useRef<HTMLButtonElement | null>(null);
  const busyRef = useRef(false);

  // Initial (closed) state. useGSAP reverts it on unmount or when the deps change.
  const { contextSafe } = useGSAP(
    () => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;
      const plusH = plusHRef.current;
      const plusV = plusVRef.current;
      const icon = iconRef.current;
      const textInner = textInnerRef.current;
      if (!panel || !plusH || !plusV || !icon || !textInner) return;

      const preLayers = preContainer ? gsap.utils.toArray<HTMLElement>('.sm-prelayer', preContainer) : [];
      preLayerElsRef.current = preLayers;

      const offscreen = position === 'left' ? -100 : 100;
      gsap.set([panel, ...preLayers], { xPercent: offscreen, opacity: 1 });
      if (preContainer) gsap.set(preContainer, { xPercent: 0, opacity: 1 });
      gsap.set(plusH, { transformOrigin: '50% 50%', rotate: 0 });
      gsap.set(plusV, { transformOrigin: '50% 50%', rotate: 90 });
      gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });
      gsap.set(textInner, { yPercent: 0 });
      if (toggleBtnRef.current) gsap.set(toggleBtnRef.current, { color: menuButtonColor });
    },
    { scope: scopeRef, dependencies: [menuButtonColor, position], revertOnUpdate: true }
  );

  const buildOpenTimeline = () => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();
    closeTweenRef.current?.kill();
    closeTweenRef.current = null;

    const itemEls = gsap.utils.toArray<HTMLElement>('.sm-panel-itemLabel', panel);
    const numberEls = gsap.utils.toArray<HTMLElement>('.sm-panel-list[data-numbering] .sm-panel-item', panel);
    const socialTitle = panel.querySelector<HTMLElement>('.sm-socials-title');
    const socialLinks = gsap.utils.toArray<HTMLElement>('.sm-socials-link', panel);

    const offscreen = position === 'left' ? -100 : 100;

    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    if (numberEls.length) gsap.set(numberEls, { '--sm-num-opacity': 0 });
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    layers.forEach((el, i) => {
      tl.fromTo(el, { xPercent: offscreen }, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07);
    });

    const lastTime = layers.length ? (layers.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (layers.length ? 0.08 : 0);
    const panelDuration = 0.65;

    tl.fromTo(panel, { xPercent: offscreen }, { xPercent: 0, duration: panelDuration, ease: 'power4.out' }, panelInsertTime);

    if (itemEls.length) {
      const itemsStart = panelInsertTime + panelDuration * 0.15;
      tl.to(
        itemEls,
        { yPercent: 0, rotate: 0, duration: 1, ease: 'power4.out', stagger: { each: 0.1, from: 'start' } },
        itemsStart
      );
      if (numberEls.length) {
        tl.to(
          numberEls,
          { duration: 0.6, ease: 'power2.out', '--sm-num-opacity': 1, stagger: { each: 0.08, from: 'start' } },
          itemsStart + 0.1
        );
      }
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.4;
      if (socialTitle) tl.to(socialTitle, { opacity: 1, duration: 0.5, ease: 'power2.out' }, socialsStart);
      if (socialLinks.length) {
        tl.to(
          socialLinks,
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: 'power3.out',
            stagger: { each: 0.08, from: 'start' },
            onComplete: () => {
              gsap.set(socialLinks, { clearProps: 'opacity' });
            }
          },
          socialsStart + 0.04
        );
      }
    }

    openTlRef.current = tl;
    return tl;
  };

  const playOpen = () => {
    if (busyRef.current) return;
    busyRef.current = true;
    const tl = buildOpenTimeline();
    if (!tl) {
      busyRef.current = false;
      return;
    }
    tl.eventCallback('onComplete', () => {
      busyRef.current = false;
    });
    tl.play(0);
  };

  const playClose = () => {
    openTlRef.current?.kill();
    openTlRef.current = null;

    const panel = panelRef.current;
    if (!panel) return;
    const all: HTMLElement[] = [...preLayerElsRef.current, panel];
    closeTweenRef.current?.kill();

    closeTweenRef.current = gsap.to(all, {
      xPercent: position === 'left' ? -100 : 100,
      duration: 0.32,
      ease: 'power3.in',
      overwrite: 'auto',
      onComplete: () => {
        const itemEls = gsap.utils.toArray<HTMLElement>('.sm-panel-itemLabel', panel);
        if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
        const numberEls = gsap.utils.toArray<HTMLElement>('.sm-panel-list[data-numbering] .sm-panel-item', panel);
        if (numberEls.length) gsap.set(numberEls, { '--sm-num-opacity': 0 });
        const socialTitle = panel.querySelector<HTMLElement>('.sm-socials-title');
        const socialLinks = gsap.utils.toArray<HTMLElement>('.sm-socials-link', panel);
        if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
        if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });
        busyRef.current = false;
      }
    });
  };

  const animateIcon = (opening: boolean) => {
    const icon = iconRef.current;
    const h = plusHRef.current;
    const v = plusVRef.current;
    if (!icon || !h || !v) return;
    spinTweenRef.current?.kill();
    if (opening) {
      gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });
      spinTweenRef.current = gsap
        .timeline({ defaults: { ease: 'power4.out' } })
        .to(h, { rotate: 45, duration: 0.5 }, 0)
        .to(v, { rotate: -45, duration: 0.5 }, 0);
    } else {
      spinTweenRef.current = gsap
        .timeline({ defaults: { ease: 'power3.inOut' } })
        .to(h, { rotate: 0, duration: 0.35 }, 0)
        .to(v, { rotate: 90, duration: 0.35 }, 0)
        .to(icon, { rotate: 0, duration: 0.001 }, 0);
    }
  };

  const animateColor = (opening: boolean) => {
    const btn = toggleBtnRef.current;
    if (!btn) return;
    colorTweenRef.current?.kill();
    if (changeMenuColorOnOpen) {
      const targetColor = opening ? openMenuButtonColor : menuButtonColor;
      colorTweenRef.current = gsap.to(btn, { color: targetColor, delay: 0.18, duration: 0.3, ease: 'power2.out' });
    } else {
      gsap.set(btn, { color: menuButtonColor });
    }
  };

  const animateText = (opening: boolean) => {
    const inner = textInnerRef.current;
    if (!inner) return;
    textCycleAnimRef.current?.kill();

    const currentLabel = opening ? 'Menu' : 'Close';
    const targetLabel = opening ? 'Close' : 'Menu';
    const seq: string[] = [currentLabel];
    let last = currentLabel;
    for (let i = 0; i < 3; i++) {
      last = last === 'Menu' ? 'Close' : 'Menu';
      seq.push(last);
    }
    if (last !== targetLabel) seq.push(targetLabel);
    seq.push(targetLabel);

    setTextLines(seq);
    gsap.set(inner, { yPercent: 0 });
    const lineCount = seq.length;
    textCycleAnimRef.current = gsap.to(inner, {
      yPercent: -((lineCount - 1) / lineCount) * 100,
      duration: 0.5 + lineCount * 0.07,
      ease: 'power4.out'
    });
  };

  const setMenu = (target: boolean) => {
    if (openRef.current === target) return;
    openRef.current = target;
    setOpen(target);
    if (target) onMenuOpen?.();
    else onMenuClose?.();
    // contextSafe records these tweens in the useGSAP context, so unmounting mid-animation cleans them up.
    contextSafe(() => {
      if (target) playOpen();
      else playClose();
      animateIcon(target);
      animateColor(target);
      animateText(target);
    })();
  };

  // Keep the latest version for listeners registered in effects.
  const setMenuRef = useRef(setMenu);
  useLayoutEffect(() => {
    setMenuRef.current = setMenu;
  });

  const closeAndRestoreFocus = () => {
    const focusWasInside = panelRef.current?.contains(document.activeElement);
    setMenuRef.current(false);
    if (focusWasInside) toggleBtnRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    // Move focus into the panel once it starts sliding in.
    const id = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>('a')?.focus({ preventScroll: true });
    }, 120);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeAndRestoreFocus();
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (panelRef.current?.contains(target) || toggleBtnRef.current?.contains(target)) return;
      setMenuRef.current(false);
    };
    document.addEventListener('keydown', onKey);
    if (closeOnClickAway) document.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.clearTimeout(id);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open, closeOnClickAway]);

  const handleItemClick = (event: MouseEvent<HTMLAnchorElement>, item: StaggeredMenuItem) => {
    if (!onItemSelect) return;
    event.preventDefault();
    setMenu(false);
    onItemSelect(item);
  };

  const layerColors = (() => {
    const raw = colors.length ? colors.slice(0, 4) : ['#1e1e22', '#35353c'];
    const arr = [...raw];
    if (arr.length >= 3) arr.splice(Math.floor(arr.length / 2), 1);
    return arr;
  })();

  return (
    <div
      ref={scopeRef}
      className={`sm-scope pointer-events-none z-40 ${isFixed ? 'fixed top-0 left-0 h-dvh w-full overflow-hidden' : 'h-full w-full'}`}
    >
      <div
        className={(className ? className + ' ' : '') + 'staggered-menu-wrapper pointer-events-none relative z-40 h-full w-full'}
        style={{ '--sm-accent': accentColor } as CSSProperties}
        data-position={position}
        data-open={open || undefined}
      >
        <div ref={preLayersRef} className="sm-prelayers pointer-events-none absolute top-0 right-0 bottom-0 z-[5]" aria-hidden="true">
          {layerColors.map((c, i) => (
            <div key={i} className="sm-prelayer absolute top-0 right-0 h-full w-full" style={{ background: c }} />
          ))}
        </div>

        <header className="staggered-menu-header pointer-events-auto absolute top-0 left-0 z-20 flex w-full items-center justify-between">
          <div className="sm-logo flex items-center select-none">{logo}</div>

          <button
            ref={toggleBtnRef}
            className="sm-toggle relative inline-flex cursor-pointer items-center gap-[0.3rem] border-0 bg-transparent leading-none"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="staggered-menu-panel"
            onClick={() => setMenu(!openRef.current)}
            type="button"
          >
            <span className="sm-toggle-textWrap relative inline-block h-[1em] overflow-hidden whitespace-nowrap" aria-hidden="true">
              <span ref={textInnerRef} className="sm-toggle-textInner flex flex-col leading-none">
                {textLines.map((l, i) => (
                  <span className="sm-toggle-line block h-[1em] leading-none" key={i}>
                    {l}
                  </span>
                ))}
              </span>
            </span>
            <span ref={iconRef} className="sm-icon relative inline-flex h-[14px] w-[14px] shrink-0 items-center justify-center" aria-hidden="true">
              <span ref={plusHRef} className="sm-icon-line" />
              <span ref={plusVRef} className="sm-icon-line" />
            </span>
          </button>
        </header>

        <aside
          id="staggered-menu-panel"
          ref={panelRef}
          className="staggered-menu-panel pointer-events-auto absolute top-0 right-0 z-10 flex h-full flex-col overflow-y-auto"
          aria-label="Site navigation"
          inert={!open}
          data-lenis-prevent
        >
          <nav className="sm-panel-inner flex flex-1 flex-col gap-5">
            <ul className="sm-panel-list m-0 flex list-none flex-col gap-2 p-0" role="list" data-numbering={displayItemNumbering || undefined}>
              {items.map((it, idx) => (
                <li className="sm-panel-itemWrap relative overflow-hidden leading-none" key={it.label + idx}>
                  <a
                    className="sm-panel-item relative inline-block no-underline"
                    href={it.link}
                    aria-label={it.ariaLabel}
                    data-index={idx + 1}
                    onClick={e => handleItemClick(e, it)}
                  >
                    <span className="sm-panel-itemLabel inline-block">{it.label}</span>
                  </a>
                </li>
              ))}
            </ul>

            {displaySocials && socialItems.length > 0 && (
              <div className="sm-socials mt-auto flex flex-col gap-3 pt-8">
                <h2 className="sm-socials-title m-0">Elsewhere</h2>
                <ul className="sm-socials-list m-0 flex list-none flex-row flex-wrap items-center gap-4 p-0" role="list">
                  {socialItems.map((s, i) => (
                    <li key={s.label + i} className="sm-socials-item">
                      <a
                        href={s.link}
                        target={s.link.startsWith('http') ? '_blank' : undefined}
                        rel={s.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="sm-socials-link relative inline-block no-underline"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </nav>
        </aside>
      </div>

      <style>{`
.sm-scope .staggered-menu-header { padding: 0.75rem 1.25rem; min-height: 3.5rem; background: color-mix(in srgb, var(--color-bg) 78%, transparent); border-bottom: 1px solid var(--color-line); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); }
.sm-scope .sm-toggle { color: var(--color-fg); font-size: 0.875rem; font-weight: 500; padding: 0.5rem 0.25rem; }
.sm-scope .sm-toggle-textWrap { margin-right: 0.5em; }
.sm-scope .sm-icon-line { position: absolute; left: 50%; top: 50%; width: 100%; height: 2px; background: currentColor; border-radius: 2px; transform: translate(-50%, -50%); will-change: transform; }
.sm-scope .staggered-menu-panel { width: clamp(260px, 38vw, 420px); background: var(--color-surface); padding: 6rem 1.5rem 2rem; }
.sm-scope [data-position='left'] .staggered-menu-panel { right: auto; left: 0; }
.sm-scope .sm-prelayers { width: clamp(260px, 38vw, 420px); }
.sm-scope [data-position='left'] .sm-prelayers { right: auto; left: 0; }
.sm-scope .sm-panel-item { color: var(--color-fg); font-family: var(--font-serif); font-weight: 400; font-size: clamp(2.75rem, 13vw, 4rem); line-height: 1.02; letter-spacing: -0.01em; padding-right: 1.6em; transition: color 0.25s; }
.sm-scope .sm-panel-itemLabel { will-change: transform; transform-origin: 50% 100%; }
.sm-scope .sm-panel-item:hover, .sm-scope .sm-panel-item:focus-visible { color: var(--sm-accent); }
.sm-scope .sm-panel-list[data-numbering] { counter-reset: smItem; }
.sm-scope .sm-panel-list[data-numbering] .sm-panel-item::after { counter-increment: smItem; content: counter(smItem, decimal-leading-zero); position: absolute; top: 0.2em; right: 0.4em; font-family: var(--font-sans); font-size: 0.8rem; font-weight: 400; letter-spacing: 0; color: var(--sm-accent); pointer-events: none; user-select: none; opacity: var(--sm-num-opacity, 0); }
.sm-scope .sm-socials-title { font-size: 0.8rem; font-weight: 500; color: var(--sm-accent); text-transform: lowercase; }
.sm-scope .sm-socials-link { font-size: 1.05rem; font-weight: 500; color: var(--color-muted); padding: 2px 0; transition: color 0.3s ease, opacity 0.3s ease; }
.sm-scope .sm-socials-link:hover, .sm-scope .sm-socials-link:focus-visible { color: var(--sm-accent); }
@media (max-width: 1024px) { .sm-scope .staggered-menu-panel, .sm-scope .sm-prelayers { width: 100%; left: 0; right: 0; } }
      `}</style>
    </div>
  );
};

export default StaggeredMenu;
