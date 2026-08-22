// src/app/(authenticated)/project/[id]/members/page.jsx
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AppLayout from "../../../../components/AppLayout";
import { ArrowLeft, Users, UserPlus, Mail, Trash2, Crown, Search, Check } from "lucide-react";
import { useProject, useProjectMembers } from "@/lib/hooks/useProjects";
import { useUsers } from "@/lib/hooks/useUsers";

export default function ProjectMembersPage() {
  const params = useParams();
  const projectId = params.id;
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Fetch project data
  const { project, isLoading: projectLoading } = useProject(projectId);

  // Fetch users (only when modal is open)
  const { users, isLoading: isLoadingUsers } = useUsers();

  // Fetch project members
  const { members, mutate, addMembers } = useProjectMembers(projectId);

  // Filter users based on search and exclude existing members
  const availableUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const isNotMember = members.some(m => m.email === user.email);
    return matchesSearch && !isNotMember;
  });

  const toggleUserSelection = (user) => {
    setSelectedUsers(prev => {
      const isSelected = prev.some(u => u.id === user.id);
      if (isSelected) {
        return prev.filter(u => u.id !== user.id);
      }
      return [...prev, user];
    });
  };

  const handleInviteMembers = async () => {
    const userIds = selectedUsers.map(u => u.id);
    await addMembers(userIds);
    setSelectedUsers([]);
    setShowInviteModal(false);
    setSearchQuery("");
  };

  const handleRemoveMember = async (memberId) => {
    if (confirm("Are you sure you want to remove this member?")) {
      // In a real app, call API to remove member
      mutate();
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'owner': return <Crown className="w-4 h-4 text-yellow-600" />;
      default: return <Users className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'owner': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  if (projectLoading) {
    return (
      <AppLayout currentPage="projects" currentProjectPage="members">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      currentPage="projects"
      currentProject={project ? project.project : null}
      currentProjectPage="members"
    >
      <div className="space-y-6">
        {/* Project Header */}
        {project && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <Link
                href="/project"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Projects
              </Link>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRoleBadge('active')}`}>
                <Users className="w-4 h-4 mr-2" />
                <span className="capitalize">Project Team</span>
              </span>
            </div>

            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.project.name || 'Project'}</h1>
                <p className="text-gray-600 mb-4">{project.project.description || 'No description available'}</p>

                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{members.length} members</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Members Management */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Project Members</h2>
              <button
                onClick={() => setShowInviteModal(true)}
                className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Member
              </button>
            </div>
          </div>

          <div className="p-6">
            {members.length > 0 ? (
              <div className="space-y-4">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {member.name ? member.name.split(' ').map(n => n[0]).join('').toUpperCase() : '?'}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900">{member.name || 'Unknown'}</h3>
                          {getRoleIcon(member.pivot?.role || member.role)}
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getRoleBadge(member.pivot?.role || member.role)}`}>
                            {member.pivot?.role || member.role}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{member.email}</p>
                        <p className="text-xs text-gray-500">Joined {member.pivot?.created_at ? new Date(member.pivot.created_at).toLocaleDateString() : 'N/A'}</p>
                      </div>
                    </div>
                    {(member.pivot?.role !== 'owner' && member.role !== 'owner') && (
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No members yet</p>
                <p className="text-sm">Invite team members to collaborate on this project</p>
              </div>
            )}
          </div>
        </div>

        {/* Invite Member Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-900 opacity-70" onClick={() => {
              setShowInviteModal(false);
              setSelectedUsers([]);
              setSearchQuery("");
            }} />
            <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-black">Invite Team Member</h3>
                  <button
                    onClick={() => {
                      setShowInviteModal(false);
                      setSelectedUsers([]);
                      setSearchQuery("");
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span><Mail className="w-6 h-6" /></span>
                  </button>
                </div>

                {/* Search Input */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black"
                    placeholder="Search users by name or email"
                  />
                </div>

                {/* Users List */}
                <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                  {isLoadingUsers ? (
                    <div className="p-4 text-center text-gray-500">
                      Loading users...
                    </div>
                  ) : availableUsers.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No users found
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {availableUsers.map((user) => {
                        const isSelected = selectedUsers.some(u => u.id === user.id);
                        return (
                          <div
                            key={user.id}
                            onClick={() => toggleUserSelection(user)}
                            className={`p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors ${
                              isSelected ? 'bg-amber-50' : ''
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-medium text-xs">
                                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                              </div>
                            </div>
                            {isSelected && (
                              <Check className="w-5 h-5 text-amber-600" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Selected Count */}
                {selectedUsers.length > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    {selectedUsers.length} user(s) selected
                  </p>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowInviteModal(false);
                      setSelectedUsers([]);
                      setSearchQuery("");
                    }}
                    className="px-4 py-2 text-sm font-medium text-black bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleInviteMembers}
                    disabled={selectedUsers.length === 0}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      selectedUsers.length > 0
                        ? 'text-white bg-amber-600 hover:bg-amber-700'
                        : 'text-gray-400 bg-gray-200 cursor-not-allowed'
                    }`}
                  >
                    Add Member{selectedUsers.length > 1 ? 's' : ''}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
