"use client";

import { offerAPI, taskAPI } from "@/services/api";
import { useEffect, useState } from "react";

type Task = {
  id: string;
  name: string;
  category: string;
  description: string;
  expectedStartDate: string;
  expectedHours: string;
  hourlyRate: string;
  currency: "USD" | "AUD" | "SGD" | "INR";
  status: "pending" | "accepted" | "rejected" | "in_progress" | "completed";
  offers: Offer[];
};

type Offer = {
  id: string;
  providerId: string;
  providerName: string;
  hourlyRate: number;
  currency: "USD" | "AUD" | "SGD" | "INR";
  status: "pending" | "accepted" | "rejected";
};

export default function UserDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [newTask, setNewTask] = useState<Partial<Task>>({
    name: "",
    category: "",
    description: "",
    expectedStartDate: "",
    expectedHours: "",
    hourlyRate: "",
    currency: "USD",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const response = await taskAPI.getTasksByUser(user.id);

      setTasks(response);
    } catch (error: any) {
      setError(error.response?.data?.message || "Error fetching tasks");
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (modalMode === "create") {
        await taskAPI.createTask(newTask);
        setShowAddTask(false);
        setNewTask({
          name: "",
          category: "",
          description: "",
          expectedStartDate: "",
          expectedHours: "",
          hourlyRate: "",
          currency: "USD",
        });
      } else {
        if (editingTask) {
          await taskAPI.updateTask(editingTask.id, {
            name: newTask.name,
            category: newTask.category,
            description: newTask.description,
            expectedStartDate: newTask.expectedStartDate,
            expectedHours: newTask.expectedHours,
            hourlyRate: newTask.hourlyRate,
            currency: newTask.currency,
          });
          setEditingTask(null);
        }
        setShowAddTask(false);
      }
      fetchTasks();
    } catch (error: any) {
      setError(error.response?.data?.message || "Error processing task");
    } finally {
      setLoading(false);
    }
  };

  const handleEditTask = (task: Task) => {
    setModalMode("edit");
    setEditingTask(task);
    setNewTask({
      name: task.name,
      category: task.category,
      description: task.description,
      expectedStartDate: task.expectedStartDate,
      expectedHours: task.expectedHours,
      hourlyRate: task.hourlyRate,
      currency: task.currency,
    });
    setShowAddTask(true);
  };

  const handleCloseModal = () => {
    setShowAddTask(false);
    setEditingTask(null);
    setModalMode("create");
    setNewTask({
      name: "",
      category: "",
      description: "",
      expectedStartDate: "",
      expectedHours: "",
      hourlyRate: "",
      currency: "USD",
    });
  };

  const handleTaskChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleAcceptOffer = async (taskId: string, offerId: string) => {
    setError("");
    try {
      await offerAPI.acceptOffer(offerId);
      fetchTasks();
    } catch (error: any) {
      setError(error.response?.data?.message || "Error accepting offer");
    }
  };

  const handleRejectOffer = async (taskId: string, offerId: string) => {
    setError("");
    try {
      await offerAPI.rejectOffer(offerId);
      fetchTasks();
    } catch (error: any) {
      setError(error.response?.data?.message || "Error rejecting offer");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">User Dashboard</h1>
            <button
              onClick={() => {
                setModalMode("create");
                setNewTask({
                  name: "",
                  category: "",
                  description: "",
                  expectedStartDate: "",
                  expectedHours: "",
                  hourlyRate: "",
                  currency: "USD",
                });
                setShowAddTask(true);
              }}
              className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800"
            >
              Post New Task
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          {/* Add/Edit Task Modal */}
          {showAddTask && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
              <div className="bg-white rounded-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                  {modalMode === "create" ? "Post New Task" : "Edit Task"}
                </h2>
                <form onSubmit={handleAddTask} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-800">
                      Task Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={newTask.name}
                      onChange={handleTaskChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-800">
                      Category
                    </label>
                    <input
                      type="text"
                      name="category"
                      required
                      value={newTask.category}
                      onChange={handleTaskChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-800">
                      Description
                    </label>
                    <textarea
                      name="description"
                      required
                      value={newTask.description}
                      onChange={handleTaskChange}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-800">
                      Expected Start Date
                    </label>
                    <input
                      type="date"
                      name="expectedStartDate"
                      required
                      value={newTask.expectedStartDate}
                      onChange={handleTaskChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-800">
                      Working Hours
                    </label>
                    <input
                      type="number"
                      name="expectedHours"
                      required
                      value={newTask.expectedHours}
                      onChange={handleTaskChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-800">
                      Hourly Rate
                    </label>
                    <input
                      type="number"
                      name="hourlyRate"
                      required
                      value={newTask.hourlyRate}
                      onChange={handleTaskChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-800">
                      Currency
                    </label>
                    <select
                      name="currency"
                      value={newTask.currency}
                      onChange={handleTaskChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
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
                      onClick={handleCloseModal}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-800 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading
                        ? modalMode === "create"
                          ? "Posting..."
                          : "Updating..."
                        : modalMode === "create"
                        ? "Post Task"
                        : "Update Task"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Tasks Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Your Tasks
            </h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {tasks.map((task) => (
                  <li key={task.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {task.name}
                        </p>
                        <p className="text-sm text-gray-700">{task.category}</p>
                        <p className="text-sm text-gray-700 mt-1">
                          {task.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-800">
                          {task.hourlyRate} {task.currency}/hr
                        </p>
                        <p className="text-sm text-gray-700">
                          Status: {task.status}
                        </p>

                        <button
                          onClick={() => handleEditTask(task)}
                          className="mt-2 text-sm text-blue-700 hover:text-blue-800"
                        >
                          Edit
                        </button>
                      </div>
                    </div>

                    {/* Offers Section */}
                    {/* {task.offers && task.offers.length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-sm font-medium text-gray-900 mb-2">
                          Offers
                        </h3>
                        <ul className="space-y-2">
                          {task.offers.map((offer) => (
                            <li
                              key={offer.id}
                              className="bg-gray-50 p-3 rounded-md flex items-center justify-between"
                            >
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {offer.providerName}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {offer.hourlyRate} {offer.currency}/hr
                                </p>
                              </div>
                              {offer.status === "pending" && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() =>
                                      handleAcceptOffer(task.id, offer.id)
                                    }
                                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                                  >
                                    Accept
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleRejectOffer(task.id, offer.id)
                                    }
                                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                                  >
                                    Reject
                                  </button>
                                </div>
                              )}
                              {offer.status !== "pending" && (
                                <span
                                  className={`text-sm ${
                                    offer.status === "accepted"
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {offer.status.charAt(0).toUpperCase() +
                                    offer.status.slice(1)}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )} */}
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
