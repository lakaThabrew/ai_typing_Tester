import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Edit2,
  TrendingUp,
  Award,
  Activity,
  Calendar,
  Target,
  Zap,
  X,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

const Profile = ({ user, userProfile, history, onBack, onUpdateUser }) => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Email change state
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");

  // Name change state
  const [newName, setNewName] = useState(user?.name || "");
  const [nameError, setNameError] = useState("");
  const [nameSuccess, setNameSuccess] = useState("");

  // Calculate stats
  const calculateStats = () => {
    if (!history || history.length === 0) {
      return {
        avgWpm: 0,
        avgAccuracy: 0,
        testsCount: 0,
        bestWpm: 0,
        totalTime: 0,
        avgCpm: 0,
      };
    }

    const avgWpm = Math.round(
      history.reduce((sum, t) => sum + t.wpm, 0) / history.length
    );
    const avgAccuracy = Math.round(
      history.reduce((sum, t) => sum + t.accuracy, 0) / history.length
    );
    const bestWpm = Math.max(...history.map((t) => t.wpm));
    const totalTime = Math.round(
      history.reduce((sum, t) => sum + (t.time || 0), 0) / 60
    ); // in minutes
    const avgCpm = Math.round(
      history.reduce((sum, t) => sum + t.cpm, 0) / history.length
    );

    return {
      avgWpm,
      avgAccuracy,
      testsCount: history.length,
      bestWpm,
      totalTime,
      avgCpm,
    };
  };

  const stats = calculateStats();

  // Get initials for avatar
  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"
    );
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/update-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setPasswordError(data.message || "Failed to update password");
        return;
      }

      setPasswordSuccess("Password updated successfully!");
      setTimeout(() => {
        setShowPasswordModal(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordSuccess("");
      }, 2000);
    } catch (error) {
      setPasswordError("Connection error. Please try again.");
    }
  };

  // Handle email change
  const handleEmailChange = async (e) => {
    e.preventDefault();
    setEmailError("");
    setEmailSuccess("");

    if (!newEmail || !emailPassword) {
      setEmailError("All fields are required");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/update-email`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ newEmail, password: emailPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setEmailError(data.message || "Failed to update email");
        return;
      }

      setEmailSuccess("Email updated successfully!");
      onUpdateUser({ ...user, email: data.email });

      setTimeout(() => {
        setShowEmailModal(false);
        setNewEmail("");
        setEmailPassword("");
        setEmailSuccess("");
      }, 2000);
    } catch (error) {
      setEmailError("Connection error. Please try again.");
    }
  };

  // Handle name change
  const handleNameChange = async (e) => {
    e.preventDefault();
    setNameError("");
    setNameSuccess("");

    if (!newName.trim()) {
      setNameError("Name cannot be empty");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/update-name`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ name: newName }),
      });

      const data = await response.json();

      if (!response.ok) {
        setNameError(data.message || "Failed to update name");
        return;
      }

      setNameSuccess("Name updated successfully!");
      onUpdateUser({ ...user, name: data.name });

      setTimeout(() => {
        setShowNameModal(false);
        setNameSuccess("");
      }, 2000);
    } catch (error) {
      setNameError("Connection error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <button
            onClick={onBack}
            className="mb-4 text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2"
          >
            ← Back to Typing Test
          </button>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        </div>
        {/* Show loading or error if user data is missing */}
        {!user ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 text-center">
            <p className="text-gray-600">Loading profile data...</p>
          </div>
        ) : (
          <>
            {" "}
            {/* Profile Info Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
              <div className="flex items-start justify-between flex-wrap gap-6">
                {/* Avatar and Basic Info */}
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {getInitials(user?.name)}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {user?.name}
                      </h2>
                      <button
                        onClick={() => setShowNameModal(true)}
                        className="text-indigo-600 hover:text-indigo-700"
                      >
                        <Edit2 size={18} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Mail size={16} />
                      <span>{user?.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={16} />
                      <span>
                        Member since{" "}
                        {user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "Recently"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Current Progress */}
                {userProfile && (
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                    <h3 className="text-lg font-bold text-indigo-900 mb-3">
                      Current Progress
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-600">Current Stage</p>
                        <p className="text-xl font-bold text-indigo-700 capitalize">
                          {userProfile.currentStage}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Current Level</p>
                        <p className="text-xl font-bold text-purple-700">
                          {userProfile.currentLevel}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-indigo-200">
                        <p className="text-xs text-gray-600">
                          Highest Unlocked
                        </p>
                        <p className="text-lg font-bold text-indigo-600 capitalize">
                          {userProfile.maxStageReached}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => setShowEmailModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition"
                >
                  <Mail size={16} />
                  Change Email
                </button>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition"
                >
                  <Lock size={16} />
                  Change Password
                </button>
              </div>
            </div>
            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <Zap className="w-8 h-8 opacity-80" />
                  <span className="text-3xl font-bold">{stats.avgWpm}</span>
                </div>
                <p className="text-blue-100">Average WPM</p>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <Target className="w-8 h-8 opacity-80" />
                  <span className="text-3xl font-bold">
                    {stats.avgAccuracy}%
                  </span>
                </div>
                <p className="text-green-100">Average Accuracy</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="w-8 h-8 opacity-80" />
                  <span className="text-3xl font-bold">{stats.testsCount}</span>
                </div>
                <p className="text-purple-100">Tests Completed</p>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <Award className="w-8 h-8 opacity-80" />
                  <span className="text-3xl font-bold">{stats.bestWpm}</span>
                </div>
                <p className="text-orange-100">Best WPM</p>
              </div>

              <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-8 h-8 opacity-80" />
                  <span className="text-3xl font-bold">{stats.avgCpm}</span>
                </div>
                <p className="text-pink-100">Average CPM</p>
              </div>

              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <Calendar className="w-8 h-8 opacity-80" />
                  <span className="text-3xl font-bold">{stats.totalTime}</span>
                </div>
                <p className="text-indigo-100">Total Minutes</p>
              </div>
            </div>
            {/* Recent Tests History */}
            {history && history.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Recent Tests
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {history
                    .slice()
                    .reverse()
                    .map((test, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <span className="text-indigo-700 font-bold">
                              {test.wpm}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {test.wpm} WPM • {test.accuracy}% Accuracy
                            </p>
                            <p className="text-sm text-gray-600 capitalize">
                              {test.stage} - Level {test.level} • {test.errors}{" "}
                              errors
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            {new Date(test.date).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(test.date).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Change Password
              </h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              {passwordError && (
                <p className="text-sm text-red-600">{passwordError}</p>
              )}
              {passwordSuccess && (
                <p className="text-sm text-green-600">{passwordSuccess}</p>
              )}
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-medium"
                >
                  Update Password
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Email Change Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Change Email</h3>
              <button
                onClick={() => setShowEmailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleEmailChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Email
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={emailPassword}
                  onChange={(e) => setEmailPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              {emailError && (
                <p className="text-sm text-red-600">{emailError}</p>
              )}
              {emailSuccess && (
                <p className="text-sm text-green-600">{emailSuccess}</p>
              )}
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-medium"
                >
                  Update Email
                </button>
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Name Change Modal */}
      {showNameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Change Name</h3>
              <button
                onClick={() => setShowNameModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleNameChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              {nameError && <p className="text-sm text-red-600">{nameError}</p>}
              {nameSuccess && (
                <p className="text-sm text-green-600">{nameSuccess}</p>
              )}
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-medium"
                >
                  Update Name
                </button>
                <button
                  type="button"
                  onClick={() => setShowNameModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
