// src/app/(authenticated)/project/add/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, FolderPlus, Lightbulb, Target, Users } from "lucide-react";
import { useProjects } from "@/lib/hooks/useProjects";
import AppLayout from "@/app/components/AppLayout";

export default function AddProjectPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const { createProject } = useProjects();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Project name is required";
    } else if (formData.name.trim().length > 255) {
      newErrors.name = "Project name must be less than 255 characters";
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = "Description must be less than 1000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await createProject({
        name: formData.name.trim(),
        description: formData.description.trim()
      });

      // Redirect back to projects page
      router.push('/project');
    } catch (error) {
      console.error("Failed to create project:", error);

      // Handle validation errors from API
      if (error.errors) {
        setErrors(error.errors);
      } else {
        setErrors({
          general: error.message || "Failed to create project. Please try again."
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/project');
  };

  return (
    <AppLayout currentPage="projects" pageTitle="Add Project" pageSubtitle="Create a new project">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleCancel}
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <FolderPlus className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <Target className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">Organize Tasks</p>
                <p className="text-xs text-blue-700">Keep your work structured</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg border border-green-100">
              <Users className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-900">Team Collaboration</p>
                <p className="text-xs text-green-700">Work together efficiently</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg border border-purple-100">
              <Lightbulb className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-purple-900">Track Progress</p>
                <p className="text-xs text-purple-700">Monitor project completion</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Project Details</h2>
            <p className="text-gray-600">Fill in the information below to create your new project.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* General Error */}
            {errors.general && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-600">{errors.general}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Project Name */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FolderPlus className="w-4 h-4 text-blue-600" />
                </div>
                <label htmlFor="name" className="block text-lg font-medium text-gray-900">
                  Project Name <span className="text-red-500">*</span>
                </label>
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-4 text-lg border-2 rounded-xl text-neutral-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                placeholder="e.g., E-commerce Website, Mobile App Development"
                disabled={isSubmitting}
              />
              {errors.name && (
                <div className="flex items-center space-x-2">
                  <svg className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-600">{errors.name}</p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-green-600" />
                </div>
                <label htmlFor="description" className="block text-lg font-medium text-gray-900">
                  Project Description
                </label>
              </div>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
                className={`w-full px-4 py-4 text-lg border-2 rounded-xl text-neutral-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
                  errors.description ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                placeholder="Describe your project's goals, scope, target audience, and any important details that will help your team understand the project..."
                disabled={isSubmitting}
              />
              <div className="flex justify-between items-center">
                {errors.description && (
                  <div className="flex items-center space-x-2">
                    <svg className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-red-600">{errors.description}</p>
                  </div>
                )}
                <div className="ml-auto">
                  <span className={`text-sm ${formData.description.length > 900 ? 'text-orange-600' : 'text-gray-500'}`}>
                    {formData.description.length}/1000 characters
                  </span>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4 pt-8 border-t border-gray-100">
              <button
                type="button"
                onClick={handleCancel}
                className="px-8 py-4 text-base font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    Creating Your Project...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-3" />
                    Create Project
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help & Tips */}
        <div className="mt-8 space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Lightbulb className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Tips for Creating Great Projects</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-blue-800">Choose a clear, descriptive name that reflects the project's main purpose</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-blue-800">Include specific goals, target audience, and success criteria</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-blue-800">Mention key team members and their roles if applicable</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-blue-800">You can always edit project details later from project settings</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What happens next?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-blue-600">1</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Create Project</h4>
                <p className="text-sm text-gray-600">Your project is created and ready to use</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-green-600">2</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Add Tasks</h4>
                <p className="text-sm text-gray-600">Start adding tasks to organize your work</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-purple-600">3</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Collaborate</h4>
                <p className="text-sm text-gray-600">Invite team members and start collaborating</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}