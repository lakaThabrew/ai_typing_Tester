import React from "react";

const TextDisplay = ({
  loading,
  renderText,
  userInput,
  handleInputChange,
  testComplete,
  inputRef,
  hasStarted,
  handleManualSubmit,
}) => {
  return (
    <>
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Generating AI phrase...</p>
        </div>
      ) : (
        <>
          <div className="bg-gray-50 rounded-xl p-6 mb-4 min-h-32 leading-relaxed">
            {renderText()}
          </div>

          {/* Input Area */}
          <textarea
            ref={inputRef}
            value={userInput}
            onChange={handleInputChange}
            disabled={testComplete}
            placeholder="Start typing here..."
            className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition resize-none font-mono text-lg"
            rows="4"
          />
        </>
      )}
    </>
  );
};

export default TextDisplay;
