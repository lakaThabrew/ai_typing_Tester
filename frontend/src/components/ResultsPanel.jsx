import React from "react";
import { Trophy, Award } from "lucide-react";

const ResultsPanel = ({
  testComplete,
  stats,
  recommendation,
  errorMap,
  loadNewPhrase,
}) => {
  return (
    <>
      {testComplete && (
        <div className="mt-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-bold text-gray-900">Test Complete!</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">WPM</p>
              <p className="text-3xl font-bold text-green-700">{stats.wpm}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">CPM</p>
              <p className="text-3xl font-bold text-green-700">{stats.cpm}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Accuracy</p>
              <p className="text-3xl font-bold text-green-700">
                {stats.accuracy}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Errors</p>
              <p className="text-3xl font-bold text-red-600">{stats.errors}</p>
            </div>
          </div>

          {recommendation && (
            <div className="bg-white rounded-lg p-4 mb-4">
              <div className="flex items-start gap-2">
                <Award className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">
                    AI Recommendation
                  </p>
                  <p className="text-gray-700">{recommendation}</p>
                </div>
              </div>
            </div>
          )}

          {Object.keys(errorMap).length > 0 && (
            <div className="bg-white rounded-lg p-4 mb-4">
              <p className="font-semibold text-gray-900 mb-2">
                Most Missed Characters:
              </p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(errorMap)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([char, count]) => (
                    <span
                      key={char}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-lg font-mono"
                    >
                      '{char}' ({count}x)
                    </span>
                  ))}
              </div>
            </div>
          )}

          <button
            onClick={loadNewPhrase}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Try Again
          </button>
        </div>
      )}
    </>
  );
};

export default ResultsPanel;
