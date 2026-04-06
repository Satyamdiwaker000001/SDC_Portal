import { useState, useEffect } from 'react';
import { GlobalStyles } from './styles/GlobalStyles';
import GlacialLoader from './components/common/GlacialLoader';
import LandingPage from './pages/landing/LandingPage';

function App() {
  const [isBooted, setIsBooted] = useState(false);

  useEffect(() => {
    // 7s match the user's provided animation delay for the snowflake zoom
    const timer = setTimeout(() => {
      setIsBooted(true);
    }, 7000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <GlobalStyles />
      {!isBooted ? (
        <GlacialLoader />
      ) : (
        <LandingPage />
      )}
    </>
  );
}

export default App;
