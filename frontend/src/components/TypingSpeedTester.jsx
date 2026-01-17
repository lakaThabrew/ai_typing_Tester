import React, { useState, useEffect, useRef } from "react";
import {
  Trophy,
  Target,
  Zap,
  TrendingUp,
  Award,
  LogOut,
  User,
  Calendar,
  Activity,
} from "lucide-react";

import LoginScreen from "./LoginScreen.jsx";
import MainComponent from "./MainComponent.jsx";

const API_URL = "http://localhost:5000/api";

const TypingSpeedTester = () => {
  // Auth State
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [authError, setAuthError] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  // Test State
  const [stage, setStage] = useState("easy");
  const [level, setLevel] = useState(1);
  const [targetText, setTargetText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [testComplete, setTestComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  // Stats State
  const [stats, setStats] = useState({
    wpm: 0,
    cpm: 0,
    accuracy: 0,
    errors: 0,
  });

  const [history, setHistory] = useState([]);
  const [showStats, setShowStats] = useState(false);
  const [errorMap, setErrorMap] = useState({});
  const [recommendation, setRecommendation] = useState("");

  const inputRef = useRef(null);
  const timerRef = useRef(null);

  // Auth Functions
  const handleAuth = async () => {
    setAuthError("");
    try {
      const endpoint = authMode === "register" ? "register" : "login";
      const payload =
        authMode === "register"
          ? { name, email, password }
          : { email, password };

      const response = await fetch(`${API_URL}/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setAuthError(data.message || "Authentication failed");
        return;
      }

      const userData = {
        id: data.id,
        name: data.name,
        email: data.email,
        token: data.token,
        tests: data.tests || [],
      };

      const profile = {
        currentStage: data.currentStage || "easy",
        currentLevel: data.currentLevel || 1,
        maxStageReached: data.maxStageReached || "easy",
      };

      setUser(userData);
      setUserProfile(profile);
      setStage(profile.currentStage);
      setLevel(profile.currentLevel);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("userProfile", JSON.stringify(profile));
      setHistory(data.tests || []);
      setEmail("");
      setPassword("");
      setName("");
      setShowLoginModal(false);
      loadNewPhrase();
    } catch (error) {
      setAuthError("Connection error. Make sure backend is running.");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setUserProfile(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userProfile");
    setEmail("");
    setPassword("");
    setName("");
    setHistory([]);
    setStage("easy");
    setLevel(1);
  };

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedProfile = localStorage.getItem("userProfile");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setUser(user);
        if (savedProfile) {
          const profile = JSON.parse(savedProfile);
          setUserProfile(profile);
          setStage(profile.currentStage);
          setLevel(profile.currentLevel);
        }
      } catch (e) {
        console.error("Failed to load user");
      }
    }
  }, []);

  // Timer
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive]);

  // Load new phrase from backend
  const loadNewPhrase = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/ai/generate-pharse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage, level }),
      });

      const data = await response.json();
      setTargetText(
        data.phrase || "The quick brown fox jumps over the lazy dog."
      );
      setUserInput("");
      setIsActive(false);
      setTimeElapsed(0);
      setHasStarted(false);
      setTestComplete(false);
      setErrorMap({});
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    } catch (error) {
      console.error("Failed to load phrase:", error);
      setTargetText("The quick brown fox jumps over the lazy dog.");
      setLoading(false);
    }
  };

  // Load phrase on mount and when stage/level changes
  useEffect(() => {
    loadNewPhrase();
  }, [stage, level]);

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;

    // Check if user is logged in before allowing typing
    if (!user && value.length > 0) {
      setShowLoginModal(true);
      return;
    }

    if (!hasStarted && value.length > 0) {
      setHasStarted(true);
      setIsActive(true);
    }
    setUserInput(value);

    // Track errors
    const newErrorMap = {};
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== targetText[i]) {
        newErrorMap[targetText[i]] = (newErrorMap[targetText[i]] || 0) + 1;
      }
    }
    setErrorMap(newErrorMap);

    // Check if test is complete
    if (value === targetText) {
      setIsActive(false);
      setTestComplete(true);
      calculateStats(value, timeElapsed);
    }
  };

  // Calculate and submit stats
  const calculateStats = async (input, time) => {
    const words = input.trim().split(/\s+/).length;
    const characters = input.length;
    const minutes = time / 60;

    const wpm = Math.round(words / minutes) || 0;
    const cpm = Math.round(characters / minutes) || 0;

    let correctChars = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] === targetText[i]) correctChars++;
    }
    const accuracy = Math.round((correctChars / targetText.length) * 100);
    const errors = input.length - correctChars;

    const newStats = {
      wpm,
      cpm,
      accuracy,
      errors,
      stage,
      level,
      time,
      date: new Date(),
    };

    setStats(newStats);

    // Submit to backend
    if (user) {
      try {
        const response = await fetch(`${API_URL}/test/submit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(newStats),
        });

        if (response.ok) {
          const data = await response.json();
          const updatedHistory = data.tests || [];
          setHistory(updatedHistory);

          // Update user profile if progression occurred
          if (data.currentStage && data.currentLevel) {
            const updatedProfile = {
              currentStage: data.currentStage,
              currentLevel: data.currentLevel,
              maxStageReached: data.maxStageReached,
            };
            setUserProfile(updatedProfile);
            localStorage.setItem("userProfile", JSON.stringify(updatedProfile));

            // Show advancement message
            if (data.advancement) {
              setRecommendation(
                `🎉 Congratulations! You've unlocked ${data.currentStage.toUpperCase()} Level ${
                  data.currentLevel
                }!`
              );
            } else {
              generateRecommendation(updatedHistory);
            }
          } else {
            generateRecommendation(updatedHistory);
          }
        }
      } catch (error) {
        console.error("Failed to submit test:", error);
      }
    }
  };

  // Generate recommendations
  const generateRecommendation = (testHistory) => {
    if (testHistory.length < 2) {
      setRecommendation(
        "Keep practicing! Complete more tests to get personalized recommendations."
      );
      return;
    }

    const recent = testHistory.slice(-5);
    const avgWpm = recent.reduce((sum, t) => sum + t.wpm, 0) / recent.length;
    const avgAccuracy =
      recent.reduce((sum, t) => sum + t.accuracy, 0) / recent.length;

    let rec = "";

    if (avgAccuracy < 85) {
      rec =
        "Focus on accuracy first. Slow down and aim for 95%+ accuracy before increasing speed.";
    } else if (avgWpm < 40 && avgAccuracy >= 90) {
      rec =
        "Great accuracy! Try advancing to the next level within this stage.";
    } else if (avgWpm >= 40 && avgWpm < 60 && avgAccuracy >= 90) {
      rec = "Excellent progress! You're ready to move to the next stage.";
    } else if (avgWpm >= 60) {
      rec =
        "Outstanding performance! You're in the expert range. Try the hardest stage and level.";
    } else {
      rec = "Keep practicing regularly. Consistency is key to improvement!";
    }

    setRecommendation(rec);
  };

  // Render text with coloring
  const renderText = () => {
    return targetText.split("").map((char, index) => {
      let color = "text-gray-400";

      if (index < userInput.length) {
        color =
          userInput[index] === char
            ? "text-green-500"
            : "text-red-500 bg-red-100";
      } else if (index === userInput.length) {
        color = "text-gray-900 bg-yellow-200";
      }

      return (
        <span key={index} className={`${color} text-xl font-mono`}>
          {char}
        </span>
      );
    });
  };

  // Main App UI
  return (
    <>
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-md w-full">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute -top-2 -right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-gray-100 z-10"
            >
              ✕
            </button>
            <LoginScreen
              authMode={authMode}
              setAuthMode={setAuthMode}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              name={name}
              setName={setName}
              authError={authError}
              setAuthError={setAuthError}
              handleAuth={handleAuth}
              isModal={true}
            />
          </div>
        </div>
      )}
      <MainComponent
        user={user}
        userProfile={userProfile}
        handleLogout={handleLogout}
        stage={stage}
        setStage={setStage}
        level={level}
        setLevel={setLevel}
        isActive={isActive}
        targetText={targetText}
        userInput={userInput}
        handleInputChange={handleInputChange}
        timeElapsed={timeElapsed}
        hasStarted={hasStarted}
        testComplete={testComplete}
        loading={loading}
        renderText={renderText}
        inputRef={inputRef}
        stats={stats}
        history={history}
        showStats={showStats}
        setShowStats={setShowStats}
        errorMap={errorMap}
        recommendation={recommendation}
        loadNewPhrase={loadNewPhrase}
        onLoginRequired={() => setShowLoginModal(true)}
      />
    </>
  );
};

export default TypingSpeedTester;
