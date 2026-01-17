import React from "react";
import { Target, Zap } from "lucide-react";

const Timer = ({ timeElapsed, hasStarted, userInput }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-600" />
          <span className="font-semibold">Time: {timeElapsed}s</span>
        </div>
        {hasStarted && (
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            <span className="font-semibold">
              {Math.round(
                userInput.split(/\s+/).length / (timeElapsed / 60) || 0
              )}{" "}
              WPM
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timer;
