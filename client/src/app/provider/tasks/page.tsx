"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { taskAPI } from "@/services/api";
import { toast } from "sonner";
import { useAuth } from "@/context/UserContext";

interface Task {
  id: string;
  name: string;
  category: string;
  description: string;
  status: string;
  expectedStartDate: string;
  expectedHours: string;
  hourlyRate: string;
  currency: "USD" | "AUD" | "SGD" | "INR";
  createdAt: string;
  progress: {
    id: string;
    status: string;
    description: string;
    hoursSpent: number;
    createdAt: string;
  }[];
}

export default function ProviderAcceptedTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [progressDescription, setProgressDescription] = useState("");
  const [hoursSpent, setHoursSpent] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasks = await taskAPI.getTasksByProvider(user.id);
        setTasks(tasks);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        toast.error("Failed to fetch tasks", {
          description: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user.id]);

  const handleUpdateProgress = async () => {
    if (!selectedTask) return;

    try {
      await taskAPI.updateTaskProgress(selectedTask.id, {
        description: progressDescription,
        hoursSpent: parseFloat(hoursSpent),
      });

      toast.success("Progress updated successfully");
      setIsUpdateDialogOpen(false);
      setProgressDescription("");
      setHoursSpent("");

      // Refresh tasks
      const updatedTasks = await taskAPI.getTasksByProvider(user.id);
      setTasks(updatedTasks);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update progress";
      toast.error("Failed to update progress", {
        description: errorMessage,
      });
    }
  };

  const handleMarkAsCompleted = async (taskId: string) => {
    try {
      await taskAPI.markTaskAsCompleted(taskId);
      toast.success("Task marked as completed");

      // Refresh tasks
      const updatedTasks = await taskAPI.getTasksByProvider(user.id);
      setTasks(updatedTasks);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to mark task as completed";
      toast.error("Failed to mark task as completed", {
        description: errorMessage,
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold mb-6">My Accepted Tasks</h1>
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-1/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold mb-6">My Accepted Tasks</h1>
      {tasks.length === 0 ? (
        <p className="text-gray-500">No accepted tasks found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tasks.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-10">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">{task.name}</CardTitle>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                    {task.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-gray-500">Category:</span>
                    <span className="ml-1">{task.category}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Hours:</span>
                    <span className="ml-1">{task.expectedHours}h</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Rate:</span>
                    <span className="ml-1">
                      {task.hourlyRate} {task.currency}/hr
                    </span>
                  </div>
                </div>

                {task.progress && task.progress.length > 0 && (
                  <div className="py-2">
                    <div className="space-y-2">
                      {task.progress.slice(-1).map((update) => (
                        <div key={update.id} className="text-xs text-gray-600">
                          <p className="mb-2">{update.description}</p>
                          <p className="text-gray-500">
                            Last update: {update.hoursSpent}h •{" "}
                            {new Date(update.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-2 pt-2">
                  {!["PROVIDER_COMPLETED", "TASK_COMPLETED"].includes(
                    task.status
                  ) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedTask(task);
                        setIsUpdateDialogOpen(true);
                      }}
                    >
                      Update Progress
                    </Button>
                  )}
                  {task.status === "IN_PROGRESS" && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleMarkAsCompleted(task.id)}
                    >
                      Complete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Progress</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                value={progressDescription}
                onChange={(e) => setProgressDescription(e.target.value)}
                placeholder="Describe your progress..."
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="hours" className="text-sm font-medium">
                Hours Spent
              </label>
              <Input
                id="hours"
                type="number"
                value={hoursSpent}
                onChange={(e) => setHoursSpent(e.target.value)}
                placeholder="Enter hours spent"
                min="0"
                step="0.5"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsUpdateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateProgress}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
