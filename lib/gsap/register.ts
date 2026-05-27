"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGSAP } from "@gsap/react";

let registered = false;

export function registerGsap(): void {
  if (registered) return;
  if (typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, useGSAP);
  registered = true;
}

if (typeof window !== "undefined") {
  registerGsap();
}

export { gsap, ScrollTrigger, MotionPathPlugin, useGSAP };
