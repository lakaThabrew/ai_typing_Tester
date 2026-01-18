const RecentTestPanel = ({
    history,
}) => {
    return (
        <>
        <div className="border-t pt-4">
        <h4 className="font-semibold text-gray-900 mb-3">Recent Tests</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {history
            .slice(-5)
            .reverse()
            .map((test, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <span className="font-medium text-gray-900">
                    {test.wpm} WPM
                  </span>
                  <span className="text-gray-600 ml-2">
                    • {test.accuracy}% accuracy
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    ({test.stage}-L{test.level})
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(test.date).toLocaleDateString()}
                </span>
              </div>
            ))}
        </div>
      </div>
        </>)
};

export default RecentTestPanel;