import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
// cspell: disable
import { ScrollTrigger } from "gsap/ScrollTrigger";
// cspell: enable

gsap.registerPlugin(ScrollTrigger);

interface UseHeroAnimationProps {
  mainContainer: RefObject<HTMLDivElement | null>;
  svgRef: RefObject<SVGSVGElement | null>;
  portalORef: RefObject<SVGTSpanElement | null>;
  heroWrapperRef: RefObject<HTMLDivElement | null>;
  foundersSectionRef: RefObject<HTMLElement | null>;
  badgeRef: RefObject<HTMLDivElement | null>;
}

export const useHeroAnimation = ({
  mainContainer,
  heroWrapperRef,
  foundersSectionRef,
  badgeRef,
}: UseHeroAnimationProps) => {
  useLayoutEffect(() => {
    if (!heroWrapperRef.current || !foundersSectionRef.current || !badgeRef.current) {
      console.error("❌ Refs not connected");
      return;
    }

    console.log("✅ Animation Setup");
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    // INITIAL STATE
    gsap.set(heroWrapperRef.current, { x: 0, opacity: 1 });
    gsap.set(foundersSectionRef.current, { x: "100vw", opacity: 0, pointerEvents: "none", display: "flex" });
    gsap.set(".founder-card", { opacity: 1, y: 0 });
    gsap.set(badgeRef.current, { opacity: 1, y: 0 });

    let lastDirection = 1; // 1 = down, -1 = up

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: "#hero_pin_section",
        start: "top top",
        end: "+=300%",
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const currentDirection = self.direction;
          
          // Detect direction change
          if (currentDirection !== lastDirection) {
            
            if (currentDirection === 1) {
              // SCROLL DOWN: Hero LEFT, Cards RIGHT→CENTER
              console.log("Animation: Hero slides LEFT, Cards enter from RIGHT");
              gsap.to(heroWrapperRef.current, {
                x: "-100vw",
                opacity: 0,
                duration: 1.0,
                ease: "power2.inOut",
              });
              gsap.to(foundersSectionRef.current, {
                x: 0,
                opacity: 1,
                pointerEvents: "auto",
                duration: 1.0,
                ease: "power2.inOut",
              });
              gsap.to(badgeRef.current, {
                opacity: 0,
                y: -120,
                duration: 0.5,
                ease: "power2.inOut",
              });
            } else {
              // SCROLL UP: Hero RIGHT→CENTER, Cards LEFT
              console.log("Animation: Hero enters from RIGHT, Cards slide LEFT");
              gsap.to(heroWrapperRef.current, {
                x: 0,
                opacity: 1,
                duration: 1.0,
                ease: "power2.inOut",
              });
              gsap.to(foundersSectionRef.current, {
                x: "-100vw",
                opacity: 0,
                pointerEvents: "none",
                duration: 1.0,
                ease: "power2.inOut",
              });
              gsap.to(badgeRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power2.inOut",
              });
              // Reset cards to full opacity as section exits
              gsap.to(".founder-card", {
                opacity: 1,
                duration: 0.4,
              });
            }

            lastDirection = currentDirection;
          }
        },
      });

      return () => st.kill();
    }, mainContainer);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [mainContainer, heroWrapperRef, foundersSectionRef, badgeRef]);
};
