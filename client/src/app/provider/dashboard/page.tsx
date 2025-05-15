"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { skillAPI, taskAPI } from "@/services/api";

type Skill = {
  id: string;
  category: string;
  experience: string;
  workNature: "onsite" | "online";
  hourlyRate: number;
  currency: "USD" | "AUD" | "SGD" | "INR";
};

type Task = {
  id: string;
  name: string;
  category: string;
  description: string;
  startDate: string;
  workingHours: number;
  hourlyRate: number;
  currency: "USD" | "AUD" | "SGD" | "INR";
  status: "pending" | "accepted" | "rejected" | "in_progress" | "completed";
};

export default function ProviderDashboard() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [newSkill, setNewSkill] = useState<Partial<Skill>>({
    category: "",
    experience: "",
    workNature: "onsite",
    hourlyRate: 0,
    currency: "USD",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSkills();
    fetchTasks();
  }, []);

  const fetchSkills = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const response = await skillAPI.getSkillsByProvider(user.id);
      setSkills(response.data);
    } catch (error: any) {
      setError(error.response?.data?.message || "Error fetching skills");
    }
  };

  const fetchTasks = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const response = await taskAPI.getTasksByProvider(user.id);
      setTasks(response.data);
    } catch (error: any) {
      setError(error.response?.data?.message || "Error fetching tasks");
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      await skillAPI.createSkill({
        ...newSkill,
        providerId: user.id,
      });
      setShowAddSkill(false);
      setNewSkill({
        category: "",
        experience: "",
        workNature: "onsite",
        hourlyRate: 0,
        currency: "USD",
      });
      fetchSkills();
    } catch (error: any) {
      setError(error.response?.data?.message || "Error creating skill");
    } finally {
      setLoading(false);
    }
  };

  const handleSkillChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewSkill((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Provider Dashboard
            </h1>
            <button
              onClick={() => setShowAddSkill(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add New Skill
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          {/* Add Skill Modal */}
          {showAddSkill && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
              <div className="bg-white rounded-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">Add New Skill</h2>
                <form onSubmit={handleAddSkill} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <input
                      type="text"
                      name="category"
                      required
                      value={newSkill.category}
                      onChange={handleSkillChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Experience
                    </label>
                    <input
                      type="text"
                      name="experience"
                      required
                      value={newSkill.experience}
                      onChange={handleSkillChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nature of Work
                    </label>
                    <select
                      name="workNature"
                      value={newSkill.workNature}
                      onChange={handleSkillChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="onsite">Onsite</option>
                      <option value="online">Online</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Hourly Rate
                    </label>
                    <input
                      type="number"
                      name="hourlyRate"
                      required
                      value={newSkill.hourlyRate}
                      onChange={handleSkillChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Currency
                    </label>
                    <select
                      name="currency"
                      value={newSkill.currency}
                      onChange={handleSkillChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="USD">USD</option>
                      <option value="AUD">AUD</option>
                      <option value="SGD">SGD</option>
                      <option value="INR">INR</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => setShowAddSkill(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Adding..." : "Add Skill"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Skills Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Your Skills</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {skills.map((skill) => (
                  <li key={skill.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {skill.category}
                        </p>
                        <p className="text-sm text-gray-500">
                          {skill.experience} experience
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {skill.hourlyRate} {skill.currency}/hr
                        </p>
                        <p className="text-sm text-gray-500">
                          {skill.workNature}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tasks Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Your Tasks</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {tasks.map((task) => (
                  <li key={task.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {task.name}
                        </p>
                        <p className="text-sm text-gray-500">{task.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {task.hourlyRate} {task.currency}/hr
                        </p>
                        <p className="text-sm text-gray-500">
                          Status: {task.status}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
