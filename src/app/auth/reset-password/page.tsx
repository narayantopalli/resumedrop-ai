"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff, FiLock, FiCheck, FiAlertCircle } from "react-icons/fi";
import { supabase } from "@/lib/supabase";
import { validatePassword, getPasswordStrength } from "@/utils/passwordValidation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isValidSession, setIsValidSession] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [passwordValidation, setPasswordValidation] = useState(validatePassword(""));

  useEffect(() => {
    const checkSession = async () => {
      // Give middleware time to process any tokens in the URL
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        setError("Invalid or expired reset link. Please request a new password reset.");
        setIsCheckingSession(false);
        return;
      }

      setIsValidSession(true);
      setIsCheckingSession(false);
    };

    checkSession();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "password") {
      setPasswordValidation(validatePassword(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (!passwordValidation.isValid) {
      setError("Please fix the password requirements below");
      setIsLoading(false);
      return;
    }

    try {
      supabase.auth.updateUser({
        password: formData.password
      });
      setIsSubmitted(true);

      setTimeout(() => {
        router.push("/sign-in");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'weak': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'strong': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getStrengthBgColor = (strength: string) => {
    switch (strength) {
      case 'weak': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  if (isCheckingSession) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
          <h2 className="text-2xl font-bold text-primary-900 mb-3">
            Verifying reset link
          </h2>
          <p className="text-neutral-600">
            Please wait while we verify your password reset link...
          </p>
        </div>
      </div>
    );
  }

  if (!isValidSession && !isSubmitted) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary-900 mb-3">
            Invalid Reset Link
          </h2>
          <p className="text-neutral-600 mb-8">
            {error}
          </p>
          <Link
            href="/forgot-password"
            className="inline-flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 shadow-sm"
          >
            Request New Reset Link
          </Link>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-success-100 mb-6">
            <FiCheck className="h-8 w-8 text-success-600" />
          </div>
          <h2 className="text-2xl font-bold text-primary-900 mb-3">
            Password reset successful
          </h2>
          <p className="text-neutral-600 mb-8">
            Your password has been successfully reset. You can now sign in with your new password.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-primary-900 mb-3">
          Reset your password
        </h2>
        <p className="text-neutral-600">
          Enter your new password below.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-lg">
          <div className="flex items-center">
            <FiAlertCircle className="h-5 w-5 text-error-400 mr-3" />
            <p className="text-sm text-error-600">{error}</p>
          </div>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
            New password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiLock className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              className="block w-full pl-12 pr-12 py-3.5 border border-neutral-300 rounded-lg shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-primary-900 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
              placeholder="Enter your new password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-4 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FiEyeOff className="h-5 w-5 text-neutral-400 hover:text-neutral-600 transition-colors" />
              ) : (
                <FiEye className="h-5 w-5 text-neutral-400 hover:text-neutral-600 transition-colors" />
              )}
            </button>
          </div>
          
          {/* Password strength indicator */}
          {formData.password && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500">Password strength:</span>
                <span className={`font-medium ${getStrengthColor(getPasswordStrength(formData.password))}`}>
                  {getPasswordStrength(formData.password)}
                </span>
              </div>
              <div className="mt-1 w-full bg-neutral-200 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    getPasswordStrength(formData.password) === 'weak' ? 'w-1/3' :
                    getPasswordStrength(formData.password) === 'medium' ? 'w-2/3' : 'w-full'
                  } ${getStrengthBgColor(getPasswordStrength(formData.password))}`}
                ></div>
              </div>
            </div>
          )}

          {/* Password requirements */}
          {formData.password && (
            <div className="mt-3 space-y-1">
              {passwordValidation.errors.map((error, index) => (
                <p key={index} className="text-xs text-error-500 flex items-center">
                  <span className="w-1 h-1 bg-error-500 rounded-full mr-2"></span>
                  {error}
                </p>
              ))}
              {passwordValidation.isValid && (
                <p className="text-xs text-success-500 flex items-center">
                  <span className="w-1 h-1 bg-success-500 rounded-full mr-2"></span>
                  Password meets all requirements
                </p>
              )}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-2">
            Confirm new password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiLock className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="block w-full pl-12 pr-12 py-3.5 border border-neutral-300 rounded-lg shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-primary-900 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
              placeholder="Confirm your new password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-4 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <FiEyeOff className="h-5 w-5 text-neutral-400 hover:text-neutral-600 transition-colors" />
              ) : (
                <FiEye className="h-5 w-5 text-neutral-400 hover:text-neutral-600 transition-colors" />
              )}
            </button>
          </div>
          {formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <p className="mt-1 text-xs text-error-500">Passwords do not match</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || formData.password !== formData.confirmPassword || !passwordValidation.isValid}
          className="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Resetting password...
            </div>
          ) : (
            "Reset password"
          )}
        </button>
      </form>
    </div>
  );
} 