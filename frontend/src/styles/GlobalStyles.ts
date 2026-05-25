import { createGlobalStyle } from 'styled-components';

// GlobalStyles is kept minimal — the main design tokens live in index.css (Stitch Obsidian Nexus theme)
export const GlobalStyles = createGlobalStyle`
  /* Lenis smooth scroll support */
  html.lenis { height: auto; }
  .lenis-smooth { scroll-behavior: auto !important; }
  .lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }

  /* Chromatic glitch hover — used on hero headline */
  .chromatic-glitch:hover {
    text-shadow: 2px 0 #00daf3, -2px 0 #ffb2b8;
    transition: text-shadow 0.1s ease;
  }
`;
