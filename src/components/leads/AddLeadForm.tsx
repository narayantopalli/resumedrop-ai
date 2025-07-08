'use client';

import React, { useState } from 'react';
import { FiPhone, FiBriefcase, FiFileText, FiAward, FiTarget } from 'react-icons/fi';
import { CreateLeadData } from './types';

interface AddLeadFormProps {
  onAddLead: (leadData: CreateLeadData) => void;
}

export default function AddLeadForm({ onAddLead }: AddLeadFormProps) {
  const [formData, setFormData] = useState<CreateLeadData>({
    contact: '',
    title: '',
    description: '',
    requirements: '',
    selectiveness: 50, // Default to 50%
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreateLeadData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateLeadData, string>> = {};

    if (!formData.contact.trim()) {
      newErrors.contact = 'Contact information is required';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Job title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Job description is required';
    }

    if (!formData.requirements.trim()) {
      newErrors.requirements = 'Requirements are required';
    }

    if (formData.selectiveness < 0 || formData.selectiveness > 100) {
      newErrors.selectiveness = 'Selectiveness must be between 0% and 100%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddLead(formData);
      setFormData({
        contact: '',
        title: '',
        description: '',
        requirements: '',
        selectiveness: 50,
      });
      setErrors({});
    } catch (error) {
      console.error('Error adding lead:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof CreateLeadData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const getSelectivenessLabel = (value: number): string => {
    if (value <= 20) return 'Very Broad';
    if (value <= 40) return 'Broad';
    if (value <= 60) return 'Moderate';
    if (value <= 80) return 'Selective';
    return 'Very Selective';
  };

  const getSelectivenessColor = (value: number): string => {
    if (value <= 20) return 'text-green-500';
    if (value <= 40) return 'text-blue-500';
    if (value <= 60) return 'text-yellow-500';
    if (value <= 80) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-sm">
        {/* Header Section */}
        <div className="px-6 py-6 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <FiBriefcase className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
              Create New Lead
            </h2>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 ml-11">
            Share opportunities with qualified candidates. We'll only show this lead to people who most closely match your requirements.
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title Field */}
          <div className="space-y-2">
            <label htmlFor="title" className="flex items-center space-x-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
              <FiBriefcase className="w-4 h-4 text-primary-500" />
              <span>Title</span>
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 placeholder-neutral-500 dark:placeholder-neutral-400 text-sm text-neutral-900 dark:text-white ${
                errors.title 
                  ? 'border-error-300 dark:border-error-600 bg-error-50 dark:bg-error-900/20' 
                  : 'border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-500'
              }`}
              placeholder="e.g., Senior Software Engineer at Google, Marketing Manager at My Startup, etc."
            />
            {errors.title && (
              <p className="text-xs text-error-600 dark:text-error-400 flex items-center space-x-1">
                <span className="w-1 h-1 bg-error-500 rounded-full"></span>
                <span>{errors.title}</span>
              </p>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <label htmlFor="description" className="flex items-center space-x-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
              <FiFileText className="w-4 h-4 text-primary-500" />
              <span>Description</span>
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 placeholder-neutral-500 dark:placeholder-neutral-400 text-sm text-neutral-900 dark:text-white resize-none ${
                errors.description 
                  ? 'border-error-300 dark:border-error-600 bg-error-50 dark:bg-error-900/20' 
                  : 'border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-500'
              }`}
              placeholder="Describe the role, responsibilities, and what makes this opportunity special..."
            />
            {errors.description && (
              <p className="text-xs text-error-600 dark:text-error-400 flex items-center space-x-1">
                <span className="w-1 h-1 bg-error-500 rounded-full"></span>
                <span>{errors.description}</span>
              </p>
            )}
          </div>

          {/* Visibility Field */}
          <div className="space-y-2">
            <label htmlFor="requirements" className="flex items-center space-x-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
              <FiAward className="w-4 h-4 text-primary-500" />
              <span>Visibility (Only you can see this)</span>
            </label>
            <textarea
              id="visibility"
              value={formData.requirements}
              onChange={(e) => handleChange('requirements', e.target.value)}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 placeholder-neutral-500 dark:placeholder-neutral-400 text-sm text-neutral-900 dark:text-white resize-none ${
                errors.requirements 
                  ? 'border-error-300 dark:border-error-600 bg-error-50 dark:bg-error-900/20' 
                  : 'border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-500'
              }`}
              placeholder="Which peers should see this lead? ie. 'Interested in Software Engineering', 'Skilled in Marketing', etc. Be as specific as possible..."
            />
            {errors.requirements && (
              <p className="text-xs text-error-600 dark:text-error-400 flex items-center space-x-1">
                <span className="w-1 h-1 bg-error-500 rounded-full"></span>
                <span>{errors.requirements}</span>
              </p>
            )}
          </div>

          {/* Selectiveness Field */}
          <div className="space-y-2">
            <label htmlFor="selectiveness" className="flex items-center space-x-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
              <FiTarget className="w-4 h-4 text-primary-500" />
              <span>Selectiveness</span>
            </label>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-600 dark:text-neutral-400">0%</span>
                <span className={`text-sm font-medium ${getSelectivenessColor(formData.selectiveness)}`}>
                  {formData.selectiveness}% - {getSelectivenessLabel(formData.selectiveness)}
                </span>
                <span className="text-xs text-neutral-600 dark:text-neutral-400">100%</span>
              </div>
              <input
                type="range"
                id="selectiveness"
                min="0"
                max="100"
                step="1"
                value={formData.selectiveness}
                onChange={(e) => handleChange('selectiveness', parseInt(e.target.value))}
                className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #10b981 0%, #10b981 ${formData.selectiveness}%, #e5e7eb ${formData.selectiveness}%, #e5e7eb 100%)`
                }}
              />
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {formData.selectiveness <= 20 && "Show to many candidates - good for general opportunities"}
                {formData.selectiveness > 20 && formData.selectiveness <= 40 && "Show to a broad range of candidates"}
                {formData.selectiveness > 40 && formData.selectiveness <= 60 && "Balanced matching - moderate selectivity"}
                {formData.selectiveness > 60 && formData.selectiveness <= 80 && "Show to more specific candidates"}
                {formData.selectiveness > 80 && "Very selective - only show to very specific candidates"}
              </p>
            </div>
            {errors.selectiveness && (
              <p className="text-xs text-error-600 dark:text-error-400 flex items-center space-x-1">
                <span className="w-1 h-1 bg-error-500 rounded-full"></span>
                <span>{errors.selectiveness}</span>
              </p>
            )}
          </div>

          {/* Contact Field */}
          <div className="space-y-2">
            <label htmlFor="contact" className="flex items-center space-x-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
              <FiPhone className="w-4 h-4 text-primary-500" />
              <span>Contact Information</span>
            </label>
            <input
              type="text"
              id="contact"
              value={formData.contact}
              onChange={(e) => handleChange('contact', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 placeholder-neutral-500 dark:placeholder-neutral-400 text-sm text-neutral-900 dark:text-white ${
                errors.contact 
                  ? 'border-error-300 dark:border-error-600 bg-error-50 dark:bg-error-900/20' 
                  : 'border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-500'
              }`}
              placeholder="Email, phone number, or LinkedIn profile..."
            />
            {errors.contact && (
              <p className="text-xs text-error-600 dark:text-error-400 flex items-center space-x-1">
                <span className="w-1 h-1 bg-error-500 rounded-full"></span>
                <span>{errors.contact}</span>
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 px-6 rounded-lg font-medium text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden shadow-lg hover:shadow-xl hover:shadow-primary-500/25 hover:scale-[1.02] active:scale-[0.98]"
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-secondary-500 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              
              {/* Button content */}
              <div className="relative flex items-center justify-center space-x-2">
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating Lead...</span>
                  </>
                ) : (
                  <>
                    <span>Post Lead</span>
                    <svg 
                      className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 