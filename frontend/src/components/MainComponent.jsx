import React from "react";
import Header from "./Header.jsx";
import StatsPanel from "./StatsPanel.jsx";
import StageLevelSelector from "./StageLevelSelcector.jsx";
import Timer from "./Timer.jsx";
import TextDisplay from "./TextDisplay.jsx";
import ResultsPanel from "./ResultsPanel.jsx";

const MainComponent = ({
  user,
  userProfile,
  showStats,
  setShowStats,
  handleLogout,
  stage,
  setStage,
  level,
  setLevel,
  isActive,
  timeElapsed,
  hasStarted,
  userInput,
  testComplete,
  stats,
  recommendation,
  errorMap,
  history,
  renderText,
  handleInputChange,
  loadNewPhrase,
  loading,
  inputRef,
  onLoginRequired,
  onViewProfile,
  handleManualSubmit,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <Header
          user={user}
          onToggleStats={() => setShowStats(!showStats)}
          onLogout={handleLogout}
          onLoginRequired={onLoginRequired}
          onViewProfile={onViewProfile}
        />

        {/* Stats Panel */}
        <StatsPanel showStats={showStats} history={history} />

        {/* Typing Test Area */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Stage and Level Selector */}
          <StageLevelSelector
            user={user}
            userProfile={userProfile}
            stage={stage}
            setStage={setStage}
            level={level}
            setLevel={setLevel}
            isActive={isActive}
          />
          {/* Timer and Stats */}
          <Timer
            timeElapsed={timeElapsed}
            hasStarted={hasStarted}
            userInput={userInput}
          />

          {/* Text Display */}
          <TextDisplay
            loading={loading}
            renderText={renderText}
            userInput={userInput}
            handleInputChange={handleInputChange}
            testComplete={testComplete}
            inputRef={inputRef}
            hasStarted={hasStarted}
            handleManualSubmit={handleManualSubmit}
          />

          {/* Results */}
          <ResultsPanel
            testComplete={testComplete}
            stats={stats}
            recommendation={recommendation}
            errorMap={errorMap}
            loadNewPhrase={loadNewPhrase}
          />

          {!testComplete && !loading && (
            <div className="mt-4 flex gap-3">
              <button
                onClick={loadNewPhrase}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                New Phrase
              </button>
              {hasStarted && userInput.length > 0 && (
                <button
                  onClick={handleManualSubmit}
                  className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
                >
                  Submit Test
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainComponent;
