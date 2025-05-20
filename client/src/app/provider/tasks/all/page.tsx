"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { taskAPI, offerAPI } from "@/services/api";
import { useRouter } from "next/navigation";
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
  User: { firstName: string; lastName: string };
  Offer: { providerId: string }[];
}

export default function Page() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hourlyRate, setHourlyRate] = useState("");
  const [currency, setCurrency] = useState<"USD" | "AUD" | "SGD" | "INR">(
    "USD"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await taskAPI.getAllTasks();
        setTasks(data);
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
  }, []);

  const handleCreateOffer = (task: Task) => {
    setSelectedTask(task);
    setHourlyRate("");
    setCurrency("USD");
    setIsDialogOpen(true);
  };

  const handleSubmitOffer = async () => {
    if (!selectedTask) return;

    try {
      setIsSubmitting(true);
      await offerAPI.createOffer({
        taskId: selectedTask.id,
        hourlyRate,
        currency,
      });
      setIsDialogOpen(false);
      toast.success("Offer created successfully", {
        description: `Your offer for "${selectedTask.name}" has been submitted.`,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create offer";
      toast.error("Failed to create offer", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="h-[200px]">
            <CardHeader className="p-4">
              <Skeleton className="h-5 w-2/3" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold mb-6">All Tasks</h1>
      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {tasks.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="p-4">
                <CardTitle className="text-lg">{task.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                  {task.description}
                </p>
                <div className="space-y-1 text-sm text-gray-500">
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span className="font-medium">{task.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="font-medium">{task.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rate:</span>
                    <span className="font-medium">
                      {task.hourlyRate} {task.currency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Start Date:</span>
                    <span className="font-medium">
                      {new Date(task.expectedStartDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span className="font-medium">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Created By:</span>
                    <span className="font-medium">
                      {task.User.firstName} {task.User.lastName}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full"
                    onClick={() => handleCreateOffer(task)}
                    disabled={task.Offer.some(
                      (offer) => offer.providerId === user?.id
                    )}
                  >
                    {task.Offer.some((offer) => offer.providerId === user?.id)
                      ? "Already offer submitted"
                      : "Create Offer"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Offer for {selectedTask?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="hourlyRate" className="text-sm font-medium">
                Hourly Rate
              </label>
              <input
                id="hourlyRate"
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Enter hourly rate"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="currency" className="text-sm font-medium">
                Currency
              </label>
              <select
                id="currency"
                value={currency}
                onChange={(e) =>
                  setCurrency(e.target.value as "USD" | "AUD" | "SGD" | "INR")
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="USD">USD</option>
                <option value="AUD">AUD</option>
                <option value="SGD">SGD</option>
                <option value="INR">INR</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitOffer}
              disabled={!hourlyRate || isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Offer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
