// src/app/(authenticated)/project/[id]/members/page.jsx
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import AppLayout from "../../../../components/AppLayout";
import { ArrowLeft, Users, UserPlus, Mail, Trash2, Crown } from "lucide-react";
import { useProject, useProjects } from "@/lib/hooks/useProjects";

export default function ProjectMembersPage() {
  const params = useParams();
  const projectId = params.id;
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  // Fetch project data
  const { project, isLoading: projectLoading, error: projectError } = useProject(projectId);

  // Mock members data - in a real app, this would come from API
  const [members, setMembers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "owner",
      joined_at: "2024-01-01"
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "member",
      joined_at: "2024-01-15"
    }
  ]);

  const handleInviteMember = async (e) => {
    e.preventDefault();
    // Mock invitation - in real app, this would call API
    const newMember = {
      id: Date.now(),
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: "member",
      joined_at: new Date().toISOString().split('T')[0]
    };
    setMembers(prev => [...prev, newMember]);
    setInviteEmail("");
    setShowInviteModal(false);
  };

  const handleRemoveMember = (memberId) => {
    if (confirm("Are you sure you want to remove this member?")) {
      setMembers(prev => prev.filter(m => m.id !== memberId));
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
              <button
                onClick={() => window.history.back()}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Projects
              </button>
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
            <div className="space-y-4">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900">{member.name}</h3>
                        {getRoleIcon(member.role)}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getRoleBadge(member.role)}`}>
                          {member.role}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{member.email}</p>
                      <p className="text-xs text-gray-500">Joined {new Date(member.joined_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {member.role !== 'owner' && (
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

            {members.length === 0 && (
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
            <div className="fixed inset-0 bg-gray-900 opacity-70" onClick={() => setShowInviteModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-black">Invite Team Member</h3>
                  <button
                    onClick={() => setShowInviteModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span><Mail className="w-6 h-6" /></span>
                  </button>
                </div>

                <form onSubmit={handleInviteMember}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black"
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowInviteModal(false)}
                      className="px-4 py-2 text-sm font-medium text-black bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700"
                    >
                      Send Invitation
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}