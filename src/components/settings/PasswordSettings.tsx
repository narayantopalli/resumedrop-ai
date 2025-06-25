"use client";

import { useState } from "react";
import { useSession } from "@/contexts/SessionContext";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { validatePassword, getPasswordStrength } from "@/utils/passwordValidation";
import { updateUserPassword } from "@/actions/password";

interface PasswordSettingsProps {
  onMessage: (message: { type: "success" | "error"; text: string }) => void;
}

export default function PasswordSettings({ onMessage }: PasswordSettingsProps) {
  const { session } = useSession();
  
  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  // UI state
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState(validatePassword(""));

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value,
    }));

    if (name === "newPassword") {
      setPasswordValidation(validatePassword(value));
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      onMessage({ type: "error", text: "New passwords do not match" });
      setIsLoading(false);
      return;
    }

    if (!passwordValidation.isValid) {
      onMessage({ type: "error", text: "Please fix the password requirements below" });
      setIsLoading(false);
      return;
    }

    try {
      const result = await updateUserPassword(
        session?.user?.id!,
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      
      if (result.success) {
        onMessage({ type: "success", text: "Password updated successfully!" });
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setPasswordValidation(validatePassword(""));
      } else {
        onMessage({ type: "error", text: result.error || "Failed to update password" });
      }
    } catch (error) {
      onMessage({ type: "error", text: "An unexpected error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'weak': return 'text-error-500';
      case 'medium': return 'text-warning-500';
      case 'strong': return 'text-success-500';
      default: return 'text-neutral-500';
    }
  };

  const getStrengthBgColor = (strength: string) => {
    switch (strength) {
      case 'weak': return 'bg-error-500';
      case 'medium': return 'bg-warning-500';
      case 'strong': return 'bg-success-500';
      default: return 'bg-neutral-300';
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
      <h3 className="text-lg font-semibold text-primary-900 dark:text-white mb-4">Change Password</h3>
      <form onSubmit={handlePasswordSubmit} className="space-y-4">
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Current Password
          </label>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
            <input
              type={showCurrentPassword ? "text" : "password"}
              id="currentPassword"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              autoComplete="current-password"
              className="w-full pl-10 pr-10 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-primary-900 dark:text-white [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              {showCurrentPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            New Password
          </label>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
            <input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              autoComplete="new-password"
              className="w-full pl-10 pr-10 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-primary-900 dark:text-white [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              {showNewPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
            </button>
          </div>
          
          {/* Password strength indicator */}
          {passwordForm.newPassword && (
            <div className="mt-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      passwordForm.newPassword ? getStrengthBgColor(getPasswordStrength(passwordForm.newPassword)) : 'bg-neutral-300'
                    }`}
                    style={{
                      width: passwordForm.newPassword
                        ? `${Math.min(100, (passwordForm.newPassword.length / 8) * 100)}%`
                        : '0%'
                    }}
                  />
                </div>
                <span className={`text-sm font-medium ${getStrengthColor(getPasswordStrength(passwordForm.newPassword))}`}>
                  {getPasswordStrength(passwordForm.newPassword)}
                </span>
              </div>
              
              {/* Password Requirements */}
              <div className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
                {passwordValidation.errors.map((error, index) => (
                  <p key={index} className="text-error-600 flex items-center">
                    <span className="w-1 h-1 bg-error-600 rounded-full mr-2"></span>
                    {error}
                  </p>
                ))}
                {passwordValidation.isValid && (
                  <p className="text-success-600 flex items-center">
                    <span className="w-1 h-1 bg-success-600 rounded-full mr-2"></span>
                    Password meets all requirements
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Confirm New Password
          </label>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              autoComplete="new-password"
              className="w-full pl-10 pr-10 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-primary-900 dark:text-white [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
              placeholder="Confirm new password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              {showConfirmPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
            </button>
          </div>
          {passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
            <p className="mt-1 text-xs text-error-600">Passwords do not match</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || passwordForm.newPassword !== passwordForm.confirmPassword || !passwordValidation.isValid}
          className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
} 