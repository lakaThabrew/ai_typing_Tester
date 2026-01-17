import React from "react";
import { Lock } from "lucide-react";

const StageLevelSelector = ({
  user,
  userProfile,
  stage,
  setStage,
  level,
  setLevel,
  isActive,
}) => {
  const stages = ["easy", "steady", "challenging", "advanced", "expert"];
  const stageOrder = {
    easy: 0,
    steady: 1,
    challenging: 2,
    advanced: 3,
    expert: 4,
  };

  // Check if a stage is unlocked
  const isStageUnlocked = (stageToCheck) => {
    if (!user || !userProfile) return true; // Allow all if not logged in (will be restricted on backend)

    const currentStageIndex = stageOrder[userProfile.currentStage];
    const checkStageIndex = stageOrder[stageToCheck];

    return checkStageIndex <= currentStageIndex;
  };

  // Check if a level is unlocked for the current stage
  const isLevelUnlocked = (levelToCheck) => {
    if (!user || !userProfile) return true;

    const currentStageIndex = stageOrder[userProfile.currentStage];
    const selectedStageIndex = stageOrder[stage];

    // If selected stage is less than current, all levels unlocked
    if (selectedStageIndex < currentStageIndex) return true;

    // If same stage, check level
    if (selectedStageIndex === currentStageIndex) {
      return levelToCheck <= userProfile.currentLevel;
    }

    // If future stage, locked
    return false;
  };

  const handleStageChange = (s) => {
    if (!isStageUnlocked(s) || isActive) return;
    setStage(s);
    setLevel(1);
  };

  const handleLevelChange = (l) => {
    if (!isLevelUnlocked(l) || isActive) return;
    setLevel(l);
  };

  return (
    <div className="mb-6">
      {/* Profile Status */}
      {user && userProfile && (
        <div className="mb-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Current Progress</p>
              <p className="text-lg font-bold text-indigo-700 capitalize">
                {userProfile.currentStage} - Level {userProfile.currentLevel}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Highest Unlocked</p>
              <p className="text-lg font-bold text-purple-700 capitalize">
                {userProfile.maxStageReached}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stage
          </label>
          <div className="grid grid-rows-5 gap-1">
            {stages.map((s) => {
              const unlocked = isStageUnlocked(s);
              const isCurrent = userProfile && s === userProfile.currentStage;

              return (
                <button
                  key={s}
                  onClick={() => handleStageChange(s)}
                  disabled={isActive || !unlocked}
                  className={`py-2 px-2 rounded text-sm font-medium capitalize transition relative ${
                    stage === s
                      ? "bg-indigo-600 text-white"
                      : unlocked
                      ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      : "bg-gray-50 text-gray-400 cursor-not-allowed"
                  } ${isActive ? "opacity-50 cursor-not-allowed" : ""} ${
                    isCurrent ? "ring-2 ring-green-500 ring-offset-1" : ""
                  }`}
                >
                  <span className="flex items-center justify-center gap-1">
                    {!unlocked && <Lock size={14} />}
                    {s.toUpperCase()}
                    {isCurrent && <span className="text-xs"> (Current)</span>}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Level: {level}
          </label>
          <div className="grid grid-cols-2 gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((l) => {
              const unlocked = isLevelUnlocked(l);
              const isCurrent =
                userProfile &&
                stage === userProfile.currentStage &&
                l === userProfile.currentLevel;

              return (
                <button
                  key={l}
                  onClick={() => handleLevelChange(l)}
                  disabled={isActive || !unlocked}
                  className={`py-2 px-2 rounded text-sm font-medium transition relative ${
                    level === l
                      ? "bg-indigo-600 text-white"
                      : unlocked
                      ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      : "bg-gray-50 text-gray-400 cursor-not-allowed"
                  } ${isActive ? "opacity-50 cursor-not-allowed" : ""} ${
                    isCurrent ? "ring-2 ring-green-500 ring-offset-1" : ""
                  }`}
                >
                  <span className="flex items-center justify-center gap-1">
                    {!unlocked && <Lock size={12} />}
                    {l}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {!user && (
        <p className="mt-3 text-sm text-amber-600 bg-amber-50 p-2 rounded">
          🔒 Login to unlock stage progression and save your progress!
        </p>
      )}
    </div>
  );
};

export default StageLevelSelector;
