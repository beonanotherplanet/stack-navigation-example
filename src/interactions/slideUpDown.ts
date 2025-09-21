// utils/sheetAnimation.ts
import { useLayoutEffect, useRef } from "react";

const EASE = "cubic-bezier(.2,.8,.2,1)";

export function slideUpIn(el: HTMLElement, duration = 350) {
  const h = el.getBoundingClientRect().height;
  el.style.transition = "none";
  el.style.opacity = "0";
  el.style.transform = `translateY(${h}px)`;
  requestAnimationFrame(() => {
    el.style.transition = `all ${duration}ms ${EASE}`;
    el.style.transform = "translateY(0)";
    el.style.opacity = "1";
  });
}

export function slideDownOut(
  el: HTMLElement,
  duration = 350,
  onEnd?: () => void
) {
  const h = el.getBoundingClientRect().height;
  el.style.transition = `all ${duration}ms ${EASE}`;
  el.style.transform = `translateY(${h}px)`;
  el.style.opacity = "0";

  const done = () => {
    el.removeEventListener("transitionend", done);
    onEnd?.();
  };
  el.addEventListener("transitionend", done);
}

export function useSheetEnter(id: string, duration = 350) {
  const rAF1 = useRef<number | null>(null);
  const rAF2 = useRef<number | null>(null);

  useLayoutEffect(() => {
    const el = document.getElementById(id);
    if (!el) return;

    const h = el.getBoundingClientRect().height;
    el.style.transition = "none";
    el.style.opacity = "0";
    el.style.transform = `translateY(${h}px)`;

    rAF1.current = requestAnimationFrame(() => {
      rAF2.current = requestAnimationFrame(() => {
        el.style.transition = `all ${duration}ms ${EASE}`;
        el.style.transform = "translateY(0)";
        el.style.opacity = "1";
      });
    });

    return () => {
      if (rAF1.current) cancelAnimationFrame(rAF1.current);
      if (rAF2.current) cancelAnimationFrame(rAF2.current);
    };
  }, [id, duration]);
}

export function makeDimmedCloser(
  id: string,
  onClose: () => void,
  duration = 350
) {
  return (e: React.MouseEvent) => {
    e.stopPropagation();
    const el = document.getElementById(id);
    if (!el) {
      onClose();
      return;
    }
    slideDownOut(el, duration, onClose);
  };
}
