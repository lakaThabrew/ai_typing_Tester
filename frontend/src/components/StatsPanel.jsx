import React from "react";
import { TrendingUp } from "lucide-react";

import RecentTestPanel from "./RecentTestPanel";

const StatsPanel = ({ showStats, history }) => {
  if (!showStats || !history || history.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-indigo-600" />
        Your Progress
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
          <p className="text-sm text-gray-600 mb-1">Avg WPM</p>
          <p className="text-2xl font-bold text-blue-700">
            {Math.round(
              history.reduce((sum, t) => sum + t.wpm, 0) / history.length
            )}
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
          <p className="text-sm text-gray-600 mb-1">Avg Accuracy</p>
          <p className="text-2xl font-bold text-green-700">
            {Math.round(
              history.reduce((sum, t) => sum + t.accuracy, 0) / history.length
            )}
            %
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
          <p className="text-sm text-gray-600 mb-1">Tests Taken</p>
          <p className="text-2xl font-bold text-purple-700">{history.length}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl">
          <p className="text-sm text-gray-600 mb-1">Best WPM</p>
          <p className="text-2xl font-bold text-orange-700">
            {Math.max(...history.map((t) => t.wpm))}
          </p>
        </div>
      </div>

      {/* Recent Tests */}
      <RecentTestPanel history={history} />
    </div>
  );
};

export default StatsPanel;
