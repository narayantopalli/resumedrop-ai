"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiCalendar } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { supabase } from "@/lib/supabase";
import { validatePassword, getPasswordStrength } from "@/utils/passwordValidation";
import { validateSignup } from "@/actions/auth";
import { createUserProfile } from "@/actions/profile";

// Session storage keys
const SIGNUP_FORM_KEY = "signup_form_data";
const SIGNUP_TERMS_KEY = "signup_accept_terms";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordValidation, setPasswordValidation] = useState(validatePassword(""));
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
  const router = useRouter();

  // Load form data from session storage on component mount
  useEffect(() => {
    try {
      const savedFormData = sessionStorage.getItem(SIGNUP_FORM_KEY);
      const savedAcceptTerms = sessionStorage.getItem(SIGNUP_TERMS_KEY);
      
      if (savedFormData) {
        const parsedData = JSON.parse(savedFormData);
        setFormData(parsedData);
        
        // Re-validate password if it exists
        if (parsedData.password) {
          setPasswordValidation(validatePassword(parsedData.password));
        }
      }
      
      if (savedAcceptTerms) {
        setAcceptTerms(JSON.parse(savedAcceptTerms));
      }
      setIsInitialLoadComplete(true);
    } catch (error) {
      console.error('Error loading form data from session storage:', error);
    }
  }, []);

  // Save form data to session storage whenever it changes (but only after initial load)
  useEffect(() => {
    if (isInitialLoadComplete) {
      try {
        sessionStorage.setItem(SIGNUP_FORM_KEY, JSON.stringify(formData));
      } catch (error) {
        console.error('Error saving form data to session storage:', error);
      }
    }
  }, [formData, isInitialLoadComplete]);

  // Save terms acceptance to session storage whenever it changes (but only after initial load)
  useEffect(() => {
    if (isInitialLoadComplete) {
      try {
        sessionStorage.setItem(SIGNUP_TERMS_KEY, JSON.stringify(acceptTerms));
      } catch (error) {
        console.error('Error saving terms acceptance to session storage:', error);
      }
    }
  }, [acceptTerms, isInitialLoadComplete]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    setSuccess("");

    try {
      // Validate terms acceptance first
      if (!acceptTerms) {
        setError("You must accept the terms and conditions");
        setIsLoading(false);
        return;
      }

      // Server-side validation using server action
      const validationResult = await validateSignup(formData);

      if (!validationResult.success) {
        setError(validationResult.errors[0] || "An unexpected error occurred. Please try again.");
        setIsLoading(false);
        return;
      }

      // Create user account
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }

      if (!data.user) {
        setError("Failed to create user account. Please try again.");
        setIsLoading(false);
        return;
      }

      // Create user profile using server action
      const profileResult = await createUserProfile(data.user.id, {
        name: formData.name,
        email: formData.email,
        college: validationResult.college
      });
      
      if (!profileResult.success) {
        console.error('Profile creation failed:', profileResult.error);
        // Show error to user since profile creation is critical
        setError("Account created but profile setup failed. Please contact support.");
        setIsLoading(false);
        return;
      }

      // Clear session storage on successful signup
      sessionStorage.removeItem(SIGNUP_FORM_KEY);
      sessionStorage.removeItem(SIGNUP_TERMS_KEY);

      // Success - show message and redirect
      setSuccess("Account created successfully! Please check your email to verify your account.");
      
      setTimeout(() => {
        router.push("/sign-in");
      }, 3000);

    } catch (err) {
      console.error('Signup error:', err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError("");
    
    // Clear session storage when Google sign-in button is pressed
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem(SIGNUP_FORM_KEY);
        sessionStorage.removeItem(SIGNUP_TERMS_KEY);
      } catch (error) {
        console.warn('Failed to clear sessionStorage on Google sign in:', error);
      }
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });

      if (error) {
        setError(error.message);
      }
      // The redirect will happen automatically, so we don't need to handle navigation here
    } catch (err) {
      setError("An unexpected error occurred during Google sign-in. Please try again.");
      console.error(err);
    } finally {
      setIsGoogleLoading(false);
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
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-primary-900 mb-2">
          Create your account
        </h2>
        <p className="text-neutral-600">
          Sign up completely free!
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-lg">
          <p className="text-sm text-error-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-success-50 border border-success-200 rounded-lg">
          <p className="text-sm text-success-600">{success}</p>
        </div>
      )}

      {/* Google Sign-In Button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading}
        className="w-full flex justify-center items-center py-3.5 px-4 border border-neutral-300 rounded-lg text-sm font-semibold text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm mb-2"
      >
        {isGoogleLoading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-neutral-600 mr-2"></div>
            Signing up with Google...
          </div>
        ) : (
          <>
            <FcGoogle className="w-5 h-5 mr-3" />
            Continue with Google
          </>
        )}
      </button>
      
      <p className="text-xs text-neutral-500 mb-6 text-center">
        Use your college email to find other students
      </p>

      {/* Divider */}
      <div className="relative mb-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-neutral-500">Or continue with email</span>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
            Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiUser className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="given-name"
              value={formData.name}
              onChange={handleChange}
              className="block w-full pl-12 pr-4 py-3.5 border border-neutral-300 rounded-lg shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-primary-900"
              placeholder="Enter your name"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
            Email address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiMail className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              id="email"
              name="email"
              type="text"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className="block w-full pl-12 pr-4 py-3.5 border border-neutral-300 rounded-lg shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-primary-900"
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
            Password
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
              placeholder="Create a password"
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
            Confirm password
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
              placeholder="Confirm your password"
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

        <div className="flex items-start space-x-3">
          <input
            id="accept-terms"
            name="accept-terms"
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="h-4 w-4 text-accent-600 focus:ring-accent-500 border-neutral-300 rounded mt-0.5"
          />
          <label htmlFor="accept-terms" className="block text-sm text-neutral-700">
            I agree to the{" "}
            <Link
              href="/terms"
              className="font-medium text-accent-600 hover:text-accent-500 transition-colors"
            >
              Terms and Conditions
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="font-medium text-accent-600 hover:text-accent-500 transition-colors"
            >
              Privacy Policy
            </Link>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading || !acceptTerms}
          className="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creating account...
            </div>
          ) : (
            "Create account"
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-neutral-200">
        <div className="text-center">
          <p className="text-sm text-neutral-600">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-semibold text-accent-600 hover:text-accent-500 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 