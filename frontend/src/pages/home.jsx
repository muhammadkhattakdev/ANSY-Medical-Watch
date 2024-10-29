import React, { useState, useEffect, useRef } from "react";
import "../components/frame";

export default function Homepage() {
  const [countdownTime, setCountdownTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [speakSeconds, setSpeakSeconds] = useState(false);
  const [adrenalineReminder, setAdrenalineReminder] = useState(false); // Adrenaline switch state
  const [isInstalled, setIsInstalled] = useState(false);
  const intervalIdRef = useRef(null);

  useEffect(() => {
    if (window.navigator.standalone) {
        setIsInstalled(true);
      }
  
      // Listen for the `beforeinstallprompt` event to know if the app can be installed (not installed yet)
      const handleBeforeInstallPrompt = (e) => {
        e.preventDefault();
        setIsInstalled(false); // App is not installed
      };
  
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  
      // Check if the app is already installed (Android/Chrome)
      window.addEventListener('appinstalled', () => {
        setIsInstalled(true); // App is installed
      });
  
      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', () => setIsInstalled(true));
      };
    if (isRunning) {
      intervalIdRef.current = setInterval(() => {
        setCountdownTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(intervalIdRef.current);
    }
    return () => clearInterval(intervalIdRef.current);
  }, [isRunning]);

  useEffect(() => {
    if (countdownTime >= 3600) {
      stopTimer();
    }

    // Speak every 5 seconds if the checkbox is checked
    if (speakSeconds && countdownTime % 5 === 0 && countdownTime !== 0) {
      speakTime(countdownTime);
    }

    // Speak "Remember Adrenaline" every 3 minutes if the adrenalineReminder switch is on
    if (adrenalineReminder && countdownTime % 180 === 0 && countdownTime !== 0) {
      speak("Remember Adrenaline");
    }

    // Speak every completed minute
    if (countdownTime % 60 === 0 && countdownTime !== 0) {
      const minutes = countdownTime / 60;
      speak(`${minutes} ${minutes === 1 ? "minute" : "minutes"}`);
    }
  }, [countdownTime, speakSeconds, adrenalineReminder]);

  const startTimer = () => setIsRunning(true);

  const stopTimer = () => {
    setIsRunning(false);
    clearInterval(intervalIdRef.current);
  };

  const resetTimer = () => {
    stopTimer();
    setCountdownTime(0);
  };

  const speakTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const text = `${minutes > 0 ? `${minutes} minutes and ` : ""}${seconds} seconds`;
    speak(text);
  };

  const speak = (text) => {
    const msg = new SpeechSynthesisUtterance(text);
    Object.assign(msg, { volume: 1, rate: 1, pitch: 1, lang: "en-US" });
    speechSynthesis.speak(msg);
  };

  const formatTime = () => {
    const minutes = String(Math.floor(countdownTime / 60)).padStart(2, "0");
    const seconds = String(countdownTime % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <>
      <div className="frame">
        <div className="timer-container">
          <div id="display" className="timer">
            {formatTime()}
          </div>
        </div>
        <div className="buttons">
          <button id="start-button" className="control-button" onClick={startTimer}>
            Start
          </button>
          <button id="stop-button" className="control-button" onClick={stopTimer}>
            Stop
          </button>
          <button id="restart-button" className="control-button" onClick={resetTimer}>
            Restart
          </button>
        </div>

        {/* Speak Seconds Switch */}
        <div className="switch-container">
          <label className="switch">
            <input
              type="checkbox"
              id="speak-seconds-checkbox"
              checked={speakSeconds}
              onChange={(e) => setSpeakSeconds(e.target.checked)}
            />
            <span className="slider"></span>
          </label>
          <span className="switch-label">Speak Seconds</span>
        </div>

        {/* Adrenaline Reminder Switch */}
        <div className="switch-container">
          <label className="switch">
            <input
              type="checkbox"
              id="adrenaline-checkbox"
              checked={adrenalineReminder}
              onChange={(e) => setAdrenalineReminder(e.target.checked)}
            />
            <span className="slider"></span>
          </label>
          <span className="switch-label">Adrenaline every 3 minutes</span>
        </div>
        {!isInstalled ? 
        <button className="control-button mt-4">
            Install
        </button>
        : null}
      </div>
    </>
  );
}
