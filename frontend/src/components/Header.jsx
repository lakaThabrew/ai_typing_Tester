import React from "react";
import { Activity, LogOut, User, UserCircle } from "lucide-react";

const Header = ({
  user,
  onToggleStats,
  onLogout,
  onLoginRequired,
  onViewProfile,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            {user ? (
              <>
                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-sm text-gray-600">{user.email} • TypeIQ</p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-gray-900">Guest User</h2>
                <p className="text-sm text-gray-600">
                  Login to save your progress • TypeIQ
                </p>
              </>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {user ? (
            <>
              <button
                onClick={onViewProfile}
                className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition"
              >
                <UserCircle className="w-4 h-4" />
                Profile
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={onLoginRequired}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              <User className="w-4 h-4" />
              Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
