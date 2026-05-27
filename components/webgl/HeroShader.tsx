"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import { heroFragment, heroVertex } from "./shaders/hero";

type HeroShaderProps = {
  className?: string;
  resolutionScale?: number;
  maxDpr?: number;
};

export default function HeroShader({
  className,
  resolutionScale = 0.75,
  maxDpr = 1.5,
}: HeroShaderProps) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = wrapRef.current;
    if (!container) return;

    let renderer: Renderer | null = null;
    let mesh: Mesh | null = null;
    let program: Program | null = null;
    let rafId: number | null = null;
    let canvas: HTMLCanvasElement | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let secondaryResizeTimer: ReturnType<typeof setTimeout> | null = null;
    let paused = false;
    let startTime = performance.now();

    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    renderer = new Renderer({
      alpha: false,
      antialias: false,
      dpr,
      premultipliedAlpha: false,
      powerPreference: "high-performance",
    });

    const gl = renderer.gl;
    canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.pointerEvents = "none";
    canvas.setAttribute("aria-hidden", "true");
    container.appendChild(canvas);

    const geometry = new Triangle(gl);

    program = new Program(gl, {
      vertex: heroVertex,
      fragment: heroFragment,
      uniforms: {
        u_time: { value: 0 },
        u_mouse: { value: [0.5, 0.5] },
        u_resolution: { value: [1, 1] },
      },
    });

    mesh = new Mesh(gl, { geometry, program });

    const handleResize = () => {
      if (!renderer || !program || !container) return;
      // Use clientWidth/Height (excludes scrollbars) and fall back to bounding rect
      // if the container has not laid out yet.
      const w =
        container.clientWidth ||
        container.getBoundingClientRect().width ||
        window.innerWidth;
      const h =
        container.clientHeight ||
        container.getBoundingClientRect().height ||
        window.innerHeight;
      const scaledW = Math.max(1, Math.floor(w * resolutionScale));
      const scaledH = Math.max(1, Math.floor(h * resolutionScale));
      renderer.setSize(scaledW, scaledH);
      // Force CSS to fill the container regardless of internal canvas pixel size
      if (canvas) {
        canvas.style.width = "100%";
        canvas.style.height = "100%";
      }
      program.uniforms.u_resolution.value = [scaledW, scaledH];
    };

    handleResize();
    // Second pass after first paint to catch any late layout (fonts, dynamic content)
    secondaryResizeTimer = setTimeout(handleResize, 120);

    resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("orientationchange", handleResize, { passive: true });

    const handleMouse = (event: PointerEvent) => {
      if (!program) return;
      const rect = container.getBoundingClientRect();
      const x = (event.clientX - rect.left) / Math.max(rect.width, 1);
      const y = 1.0 - (event.clientY - rect.top) / Math.max(rect.height, 1);
      program.uniforms.u_mouse.value = [
        Math.min(Math.max(x, 0), 1),
        Math.min(Math.max(y, 0), 1),
      ];
    };
    container.addEventListener("pointermove", handleMouse, { passive: true });

    const handleVisibility = () => {
      paused = document.visibilityState === "hidden";
      if (!paused) {
        startTime =
          performance.now() - (program?.uniforms.u_time.value ?? 0) * 1000;
        if (rafId === null) loop();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    const loop = () => {
      if (paused) {
        rafId = null;
        return;
      }
      if (!renderer || !mesh || !program) return;
      const seconds = (performance.now() - startTime) / 1000;
      program.uniforms.u_time.value = seconds;
      renderer.render({ scene: mesh });
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (secondaryResizeTimer !== null) clearTimeout(secondaryResizeTimer);
      container.removeEventListener("pointermove", handleMouse);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      resizeObserver?.disconnect();
      try {
        program?.remove();
      } catch {}
      if (canvas && canvas.parentNode === container) {
        container.removeChild(canvas);
      }
      const loseCtx = gl.getExtension("WEBGL_lose_context");
      loseCtx?.loseContext?.();
    };
  }, [resolutionScale, maxDpr]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        overflow: "hidden",
      }}
    />
  );
}
