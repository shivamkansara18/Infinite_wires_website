"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function ScrollMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!("IntersectionObserver" in window)) return;

    const animations = new Map<HTMLElement, number>();
    const counters = new WeakSet<HTMLElement>();
    function countUp(element: HTMLElement) {
      if (counters.has(element)) return;

      const total = Number(element.dataset.countUp);
      const start = performance.now();
      counters.add(element);
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / 1400);
        element.textContent = String(Math.round(total * (1 - (1 - progress) ** 3)));
        if (progress < 1) animations.set(element, requestAnimationFrame(tick));
        else animations.delete(element);
      };
      element.textContent = "0";
      animations.set(element, requestAnimationFrame(tick));
    }

    function reveal(element: HTMLElement) {
      element.classList.remove("reveal-pending");
      if (!motion.matches) {
        element.querySelectorAll<HTMLElement>("[data-count-up]").forEach(countUp);
      }
    }

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const element = entry.target as HTMLElement;
        observer.unobserve(element);
        reveal(element);
      }
    }, { threshold: 0.12 });

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("#main-content [data-reveal]"),
    );
    if (!motion.matches) {
      for (const element of targets) {
        if (element.getBoundingClientRect().top > window.innerHeight * 0.9) {
          element.classList.add("reveal-pending");
          observer.observe(element);
        } else {
          reveal(element);
        }
      }
    }

    const reset = () => {
      observer.disconnect();
      targets.forEach((element) => element.classList.remove("reveal-pending"));
      for (const [element, frame] of animations) {
        cancelAnimationFrame(frame);
        element.textContent = element.dataset.countUp ?? "";
      }
      animations.clear();
    };
    const handleMotionChange = () => {
      if (motion.matches) reset();
    };
    motion.addEventListener("change", handleMotionChange);
    return () => {
      motion.removeEventListener("change", handleMotionChange);
      reset();
    };
  }, [pathname]);

  return null;
}
