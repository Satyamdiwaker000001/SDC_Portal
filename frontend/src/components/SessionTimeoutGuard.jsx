import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, LogOut, RefreshCw } from 'lucide-react';

const IDLE_TIME_LIMIT = 5 * 60 * 1000; // 5 minutes in milliseconds
const WARNING_COUNTDOWN = 10;           // 10 seconds warning countdown

export const SessionTimeoutGuard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(WARNING_COUNTDOWN);

  const idleTimerRef = useRef(null);
  const showWarningRef = useRef(false);

  // Keep ref synced with showWarning state so event listeners don't re-bind
  useEffect(() => {
    showWarningRef.current = showWarning;
  }, [showWarning]);

  // Handle immediate logout on timeout
  const handleTimeoutLogout = useCallback(async () => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    setShowWarning(false);
    showWarningRef.current = false;
    await logout();
    window.location.href = '/login?reason=timeout';
  }, [logout]);

  // Start/Reset the 5-minute idle timer
  const resetIdleTimer = useCallback(() => {
    if (!user) return;
    // Don't reset if warning modal is active on screen
    if (showWarningRef.current) return;

    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

    idleTimerRef.current = setTimeout(() => {
      setShowWarning(true);
      showWarningRef.current = true;
      setCountdown(WARNING_COUNTDOWN);
    }, IDLE_TIME_LIMIT);
  }, [user]);

  // Handle "Stay Logged In" click
  const handleStayLoggedIn = () => {
    setShowWarning(false);
    showWarningRef.current = false;
    setCountdown(WARNING_COUNTDOWN);
    resetIdleTimer();
  };

  // 1. Monitor user activity events for the 5-minute idle timer
  useEffect(() => {
    if (!user) {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      setShowWarning(false);
      showWarningRef.current = false;
      return;
    }

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
    const handleUserActivity = () => {
      resetIdleTimer();
    };

    events.forEach((event) => {
      window.addEventListener(event, handleUserActivity, { passive: true });
    });

    // Start initial 5-minute timer
    resetIdleTimer();

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [user, resetIdleTimer]);

  // 2. Active 10-second countdown interval when showWarning is true
  useEffect(() => {
    if (!showWarning) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeoutLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showWarning, handleTimeoutLogout]);

  if (!user) return null;

  return (
    <AnimatePresence>
      {showWarning && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-[#1c222b] border border-rose-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(244,63,94,0.3)] text-center overflow-hidden"
          >
            {/* Glowing background radial */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto mb-5 text-rose-400">
              <ShieldAlert className="w-8 h-8 animate-pulse" />
            </div>

            <span className="bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[9px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-3">
              Session Timeout Security Warning
            </span>

            <h2 className="text-2xl font-black text-white tracking-tight mb-2">Inactivity Detected</h2>

            <p className="text-white/60 text-xs leading-relaxed mb-6">
              You have been inactive for <span className="text-white font-bold">5 minutes</span>. For institutional security, your session will automatically terminate in:
            </p>

            {/* Countdown Badge */}
            <div className="w-24 h-24 rounded-full bg-rose-500/15 border-2 border-rose-500/50 flex flex-col items-center justify-center mx-auto mb-8 shadow-[0_0_25px_rgba(244,63,94,0.4)] animate-pulse">
              <span className="text-4xl font-black text-white font-mono">{countdown}</span>
              <span className="text-[9px] font-mono text-rose-400 uppercase tracking-widest">seconds</span>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleStayLoggedIn}
                className="flex-1 bg-gradient-to-r from-[#00b4d8] to-[#0066ff] hover:opacity-90 text-white font-bold text-xs uppercase tracking-widest py-3.5 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(0,180,216,0.3)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" /> Stay Logged In
              </button>
              <button
                onClick={handleTimeoutLogout}
                className="bg-white/10 hover:bg-rose-500/20 text-white/80 hover:text-rose-300 font-bold text-xs uppercase tracking-widest py-3.5 px-4 rounded-xl border border-white/15 hover:border-rose-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Log Out
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
