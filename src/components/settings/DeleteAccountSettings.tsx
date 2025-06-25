"use client";

import { useState } from "react";
import { useSession } from "@/contexts/SessionContext";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { deleteUserAccount } from "@/actions/password";
import { useRouter } from "next/navigation";

interface DeleteAccountSettingsProps {
  onMessage: (message: { type: "success" | "error"; text: string }) => void;
}

export default function DeleteAccountSettings({ onMessage }: DeleteAccountSettingsProps) {
  const { session } = useSession();
  const router = useRouter();
  
  // Delete account form state
  const [deleteForm, setDeleteForm] = useState({
    password: "",
    confirmDelete: false,
  });
  
  // UI state
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setDeleteForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!deleteForm.confirmDelete) {
      onMessage({ type: "error", text: "Please confirm that you want to delete your account" });
      setIsLoading(false);
      return;
    }

    try {
      const result = await deleteUserAccount(session?.user?.id!, deleteForm.password);
      
      if (result.success) {
        onMessage({ type: "success", text: "Account deleted successfully. Redirecting..." });
        setTimeout(() => {
          router.push("/sign-in");
        }, 2000);
      } else {
        onMessage({ type: "error", text: result.error || "Failed to delete account" });
      }
    } catch (error) {
      onMessage({ type: "error", text: "An unexpected error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
      <div className="bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-error-800 dark:text-error-200 mb-2">Delete Account</h3>
        <p className="text-error-700 dark:text-error-300 text-sm">
          This action cannot be undone. All your data will be permanently deleted.
        </p>
      </div>
      
      <form onSubmit={handleDeleteAccount} className="space-y-4">
        <div>
          <label htmlFor="deletePassword" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
            <input
              type={showDeletePassword ? "text" : "password"}
              id="deletePassword"
              name="password"
              value={deleteForm.password}
              onChange={handleDeleteChange}
              className="w-full pl-10 pr-10 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-error-500 focus:border-transparent bg-white dark:bg-neutral-700 text-primary-900 dark:text-white"
              placeholder="Enter your password to confirm"
            />
            <button
              type="button"
              onClick={() => setShowDeletePassword(!showDeletePassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              {showDeletePassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="confirmDelete"
            name="confirmDelete"
            checked={deleteForm.confirmDelete}
            onChange={handleDeleteChange}
            className="mt-1 h-4 w-4 text-error-600 focus:ring-error-500 border-neutral-300 rounded"
          />
          <label htmlFor="confirmDelete" className="text-sm text-neutral-700 dark:text-neutral-300">
            I understand that this action is irreversible and all my data will be permanently deleted.
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading || !deleteForm.confirmDelete}
          className="w-full bg-error-600 text-white py-2 px-4 rounded-md hover:bg-error-700 focus:outline-none focus:ring-2 focus:ring-error-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Deleting..." : "Delete Account"}
        </button>
      </form>
    </div>
  );
} 