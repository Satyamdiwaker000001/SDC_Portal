import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    --snow: #FFFAFB;
    --onyx: #131515;
    --graphite: #2B2C28;
    --verdigris: #339989;
    --pearl-aqua: #7DE2D1;
    
    --font-heading: 'Cinzel', serif;
    --font-body: 'Inter', sans-serif;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background-color: var(--snow);
    color: var(--onyx);
    font-family: var(--font-body);
    overflow-x: hidden;
    min-height: 100vh;
    
    /* Frost Texture Overlay */
    background-image: 
      radial-gradient(circle at 50% 50%, rgba(125, 226, 209, 0.05) 0%, transparent 50%),
      linear-gradient(rgba(255, 250, 251, 0.8), rgba(255, 250, 251, 0.8));
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: var(--snow);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--pearl-aqua);
    border-radius: 10px;
  }

  /* Glassmorphism Classes */
  .glass {
    background: rgba(255, 251, 251, 0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(125, 226, 209, 0.2);
    box-shadow: 0 8px 32px 0 rgba(19, 21, 21, 0.05);
  }
`;
