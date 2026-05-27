"use client";

import {
  forwardRef,
  useEffect,
  useRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { gsap } from "@/lib/gsap/register";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { cn } from "@/lib/utils/cn";

type MagneticButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  strength?: number;
};

export const MagneticButton = forwardRef<HTMLButtonElement, MagneticButtonProps>(
  function MagneticButton(
    { children, className, strength = 0.35, ...rest },
    forwardedRef,
  ) {
    const internalRef = useRef<HTMLButtonElement | null>(null);
    const reducedMotion = useReducedMotion();

    const setRefs = (node: HTMLButtonElement | null) => {
      internalRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef)
        (forwardedRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
    };

    useEffect(() => {
      const node = internalRef.current;
      if (!node || reducedMotion) return;

      const xTo = gsap.quickTo(node, "x", { duration: 0.55, ease: "expo.out" });
      const yTo = gsap.quickTo(node, "y", { duration: 0.55, ease: "expo.out" });

      const onMove = (e: PointerEvent) => {
        const rect = node.getBoundingClientRect();
        const relX = e.clientX - (rect.left + rect.width / 2);
        const relY = e.clientY - (rect.top + rect.height / 2);
        xTo(relX * strength);
        yTo(relY * strength);
      };

      const onLeave = () => {
        xTo(0);
        yTo(0);
      };

      node.addEventListener("pointermove", onMove);
      node.addEventListener("pointerleave", onLeave);

      return () => {
        node.removeEventListener("pointermove", onMove);
        node.removeEventListener("pointerleave", onLeave);
        gsap.set(node, { x: 0, y: 0 });
      };
    }, [reducedMotion, strength]);

    return (
      <button
        ref={setRefs}
        className={cn("relative inline-flex items-center justify-center", className)}
        {...rest}
      >
        {children}
      </button>
    );
  },
);
