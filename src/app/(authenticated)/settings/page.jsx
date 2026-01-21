"use client";

import { useState } from "react";
import AppLayout from "@/app/components/AppLayout";
import { Settings, User, Palette, FolderOpen, Bell, Shield, Globe } from "lucide-react";
import { useTheme } from "@/lib/hooks/useTheme";

const tabs = [
  { id: "general", label: "General", icon: Settings },
  { id: "account", label: "Account", icon: User },
  { id: "preferences", label: "Preferences", icon: Palette },
  { id: "project", label: "Project", icon: FolderOpen },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy & Security", icon: Shield },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return <GeneralSettings />;
      case "account":
        return <AccountSettings />;
      case "preferences":
        return <PreferencesSettings />;
      case "project":
        return <ProjectSettings />;
      case "notifications":
        return <NotificationsSettings />;
      case "privacy":
        return <PrivacySettings />;
      default:
        return <GeneralSettings />;
    }
  };

  return (
    <AppLayout currentPage="settings" showNavbar={false}>
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-600">Manage your account and application preferences</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? "border-amber-500 text-amber-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function GeneralSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 text-gray-900">
              <option>English</option>
              <option>Indonesian</option>
              <option>Spanish</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timezone
            </label>
            <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 text-gray-900">
              <option>UTC+7 (Asia/Jakarta)</option>
              <option>UTC+0 (GMT)</option>
              <option>UTC-5 (EST)</option>
            </select>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <button className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700">
          Save Changes
        </button>
      </div>
    </div>
  );
}

function AccountSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 text-gray-900"
              defaultValue="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 text-gray-900"
              defaultValue="john@example.com"
            />
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 text-gray-900"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <button className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700">
          Update Account
        </button>
      </div>
    </div>
  );
}

function PreferencesSettings() {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Appearance</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Theme
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={theme === 'light'}
                  onChange={handleThemeChange}
                  className="text-amber-600 focus:ring-amber-500"
                />
                <span className="ml-2">Light</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={theme === 'dark'}
                  onChange={handleThemeChange}
                  className="text-amber-600 focus:ring-amber-500"
                />
                <span className="ml-2">Dark</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="theme"
                  value="auto"
                  checked={theme === 'auto'}
                  onChange={handleThemeChange}
                  className="text-amber-600 focus:ring-amber-500"
                />
                <span className="ml-2">Auto</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Dashboard Layout</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default View
            </label>
            <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 text-gray-900">
              <option>Board View</option>
              <option>List View</option>
              <option>Calendar View</option>
            </select>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <button className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700">
          Save Preferences
        </button>
      </div>
    </div>
  );
}

function ProjectSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Project Defaults</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Project Template
            </label>
            <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 text-gray-900">
              <option>Basic</option>
              <option>Agile</option>
              <option>Kanban</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Status Workflow
            </label>
            <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 text-gray-900">
              <option>Simple (To Do, In Progress, Done)</option>
              <option>Advanced (Backlog, To Do, In Progress, Review, Done)</option>
            </select>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Project Permissions</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              id="public-projects"
              type="checkbox"
              className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
            />
            <label htmlFor="public-projects" className="ml-2 block text-sm text-gray-900">
              Allow public project creation
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="member-invites"
              type="checkbox"
              defaultChecked
              className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
            />
            <label htmlFor="member-invites" className="ml-2 block text-sm text-gray-900">
              Allow project members to invite others
            </label>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <button className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700">
          Save Project Settings
        </button>
      </div>
    </div>
  );
}

function NotificationsSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Task Assignments</h4>
              <p className="text-sm text-gray-500">Get notified when you're assigned to a task</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Project Updates</h4>
              <p className="text-sm text-gray-500">Receive updates about project changes</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Weekly Reports</h4>
              <p className="text-sm text-gray-500">Get weekly summary reports</p>
            </div>
            <input
              type="checkbox"
              className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Push Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Browser Notifications</h4>
              <p className="text-sm text-gray-500">Show notifications in your browser</p>
            </div>
            <input
              type="checkbox"
              className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <button className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700">
          Save Notification Settings
        </button>
      </div>
    </div>
  );
}

function PrivacySettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy Controls</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Profile Visibility</h4>
              <p className="text-sm text-gray-500">Control who can see your profile information</p>
            </div>
            <select className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 text-gray-900">
              <option>Public</option>
              <option>Team Only</option>
              <option>Private</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Activity Status</h4>
              <p className="text-sm text-gray-500">Show when you're active on the platform</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Data & Security</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
            </div>
            <button className="text-amber-600 hover:text-amber-700 text-sm font-medium">
              Enable 2FA
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Data Export</h4>
              <p className="text-sm text-gray-500">Download a copy of your data</p>
            </div>
            <button className="text-amber-600 hover:text-amber-700 text-sm font-medium">
              Export Data
            </button>
          </div>
        </div>
      </div>
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-red-900 mb-4">Danger Zone</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-red-200 rounded-md">
            <div>
              <h4 className="text-sm font-medium text-red-900">Delete Account</h4>
              <p className="text-sm text-red-700">Permanently delete your account and all associated data</p>
            </div>
            <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}