"use client";

import { offerAPI, taskAPI } from "@/services/api";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

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
      toast.error(error.response?.data?.message || "Error fetching tasks");
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
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
      toast.success(
        modalMode === "create"
          ? "Task created successfully!"
          : "Task updated successfully!"
      );
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error processing task");
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleCurrencyChange = (value: string) => {
    setNewTask((prev) => ({ ...prev, currency: value as Task["currency"] }));
  };

  const handleAcceptOffer = async (taskId: string, offerId: string) => {
    try {
      await offerAPI.acceptOffer(offerId);
      fetchTasks();
      toast.success("Offer accepted successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error accepting offer");
    }
  };

  const handleRejectOffer = async (taskId: string, offerId: string) => {
    try {
      await offerAPI.rejectOffer(offerId);
      fetchTasks();
      toast.success("Offer rejected successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error rejecting offer");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">User Dashboard</h1>
            <Button
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
            >
              Post New Task
            </Button>
          </div>

          {/* Add/Edit Task Dialog */}
          <Dialog open={showAddTask} onOpenChange={setShowAddTask}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {modalMode === "create" ? "Post New Task" : "Edit Task"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddTask} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Task Name</label>
                  <Input
                    type="text"
                    name="name"
                    required
                    value={newTask.name}
                    onChange={handleTaskChange}
                    placeholder="Enter task name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Input
                    type="text"
                    name="category"
                    required
                    value={newTask.category}
                    onChange={handleTaskChange}
                    placeholder="Enter category"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    name="description"
                    required
                    value={newTask.description}
                    onChange={handleTaskChange}
                    placeholder="Enter task description"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Expected Start Date
                  </label>
                  <Input
                    type="date"
                    name="expectedStartDate"
                    required
                    value={newTask.expectedStartDate}
                    onChange={handleTaskChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Working Hours</label>
                  <Input
                    type="number"
                    name="expectedHours"
                    required
                    value={newTask.expectedHours}
                    onChange={handleTaskChange}
                    placeholder="Enter expected hours"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Hourly Rate</label>
                  <Input
                    type="number"
                    name="hourlyRate"
                    required
                    value={newTask.hourlyRate}
                    onChange={handleTaskChange}
                    placeholder="Enter hourly rate"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Currency</label>
                  <Select
                    value={newTask.currency}
                    onValueChange={handleCurrencyChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="AUD">AUD</SelectItem>
                      <SelectItem value="SGD">SGD</SelectItem>
                      <SelectItem value="INR">INR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading
                      ? modalMode === "create"
                        ? "Posting..."
                        : "Updating..."
                      : modalMode === "create"
                      ? "Post Task"
                      : "Update Task"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Tasks Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Your Tasks</h2>
            <div className="grid gap-6">
              {tasks.map((task) => (
                <Card key={task.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{task.name}</CardTitle>
                        <CardDescription>{task.category}</CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditTask(task)}
                      >
                        Edit
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">
                        {task.description}
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Start Date:</span>{" "}
                          {task.expectedStartDate}
                        </div>
                        <div>
                          <span className="font-medium">Hours:</span>{" "}
                          {task.expectedHours}
                        </div>
                        <div>
                          <span className="font-medium">Rate:</span>{" "}
                          {task.hourlyRate} {task.currency}/hr
                        </div>
                        <div>
                          <span className="font-medium">Status:</span>{" "}
                          {task.status}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
