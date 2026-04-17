import { createGlobalStyle, keyframes } from 'styled-components';

/* Reusable Animations */
export const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

export const glowPulse = keyframes`
  0% { box-shadow: 0 0 5px var(--ui-accent); }
  50% { box-shadow: 0 0 20px var(--ui-accent); }
  100% { box-shadow: 0 0 5px var(--ui-accent); }
`;

export const GlobalStyles = createGlobalStyle`
  :root {
    /* --- FONTS --- */
    --font-heading: 'Michroma', sans-serif;
    --font-body: 'Outfit', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
    --font-display: 'Michroma', sans-serif;

    /* --- SPACING SCALE --- */
    --space-xs: 0.25rem;
    --space-sm: 0.5rem;
    --space-md: 1rem;
    --space-lg: 1.5rem;
    --space-xl: 3rem;
    --space-xxl: 5rem;

    /* --- TYPOGRAPHY SCALE --- */
    --text-xs: 0.75rem;
    --text-sm: 0.875rem;
    --text-md: 1rem;
    --text-lg: 1.125rem;
    --text-xl: 1.25rem;
    --text-2xl: 1.5rem;
    --text-3xl: 1.875rem;
    --text-4xl: 2.25rem;
    --text-5xl: 3rem;

    /* --- SHADOW VARIATIONS --- */
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
    --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);
    --shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.25);
    --shadow-premium: 0 20px 50px rgba(0, 0, 0, 0.5);

    /* --- RADIUS SCALE --- */
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 16px;
    --radius-xl: 24px;
    --radius-full: 9999px;

    /* --- DYNAMIC THEME TOKENS --- */
    --bg-main: ${props => props.theme.colors.bg.primary};
    --bg-card: ${props => props.theme.colors.bg.card};
    --bg-glass: rgba(${props => props.theme.mode === 'light' ? '255, 255, 255' : '15, 15, 15'}, 0.65);
    
    --text-main: ${props => props.theme.colors.text.primary};
    --text-dim: ${props => props.theme.colors.text.secondary};
    
    --ui-primary: ${props => props.theme.colors.accent.primary};
    --ui-secondary: ${props => props.theme.colors.accent.secondary};
    --ui-accent: ${props => props.theme.colors.accent.accent};
    
    --border-glass: ${props => props.theme.border};
    --glass-blur: blur(25px);
    --transition-speed: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    cursor: default;
  }

  body {
    background-color: var(--bg-main);
    color: var(--text-main);
    font-family: var(--font-body);
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
    overflow-x: hidden;
    transition: background-color var(--transition-speed);
    
    /* Tactical Background Grid */
    background-image: ${props => props.theme.mode === 'light' 
      ? 'radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.03) 1px, transparent 0)'
      : 'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.02) 1px, transparent 0)'};
    background-size: 50px 50px;
  }

  ::selection {
    background: var(--ui-accent);
    color: var(--color-primary-dark);
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    letter-spacing: -0.02em;
    font-weight: 800;
  }

  button, a {
    cursor: pointer !important;
  }

  /* --- UTILITY CLASSES --- */
  .glass-panel {
    background: var(--bg-glass);
    backdrop-filter: var(--glass-blur);
    border: var(--border-glass);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-xl);
  }

  .text-gradient {
    background: linear-gradient(135deg, var(--ui-primary), var(--ui-accent));
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .glow {
    box-shadow: 0 0 15px rgba(var(--color-primary-rgb), 0.3);
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg-main); }
  ::-webkit-scrollbar-thumb { 
    background: var(--ui-primary); 
    border-radius: 10px; 
    opacity: 0.5;
  }

  /* Print Styles */
  @media print {
    body { background: white; color: black; }
    .glass-panel { border: 1px solid #ddd; box-shadow: none; backdrop-filter: none; }
  }
`;
