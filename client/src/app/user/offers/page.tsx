"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { taskAPI, offerAPI } from "@/services/api";
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
}

interface Offer {
  id: string;
  taskId: string;
  providerId: string;
  hourlyRate: number;
  currency: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  provider: {
    firstName: string;
    lastName: string;
  };
}

interface TaskWithOffers extends Task {
  Offer: Offer[];
}

export default function UserOffersPage() {
  const [tasksWithOffers, setTasksWithOffers] = useState<TaskWithOffers[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTasksAndOffers = async () => {
      try {
        // Fetch tasks created by the current user
        const tasks = await taskAPI.getTasksByUser(user.id);

        console.log(tasks);

        setTasksWithOffers(tasks);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        toast.error("Failed to fetch tasks and offers", {
          description: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchTasksAndOffers();
    }
  }, [user?.id]);

  const handleAcceptOffer = async (offerId: string) => {
    try {
      await offerAPI.acceptOffer(offerId);
      toast.success("Offer accepted successfully");
      // Refresh the data
      const tasks = await taskAPI.getTasksByUser(user.id);
      setTasksWithOffers(tasks);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to accept offer";
      toast.error("Failed to accept offer", {
        description: errorMessage,
      });
    }
  };

  const handleRejectOffer = async (offerId: string) => {
    try {
      await offerAPI.rejectOffer(offerId);
      toast.success("Offer rejected successfully");
      // Refresh the data
      const tasks = await taskAPI.getTasksByUser(user.id);
      setTasksWithOffers(tasks);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to reject offer";
      toast.error("Failed to reject offer", {
        description: errorMessage,
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold mb-6">Task Offers</h1>
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
      <h1 className="text-2xl font-bold mb-6">Task Offers</h1>
      {tasksWithOffers.length === 0 ? (
        <p className="text-gray-500">No tasks with offers found</p>
      ) : (
        <div className="space-y-6">
          {tasksWithOffers.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{task.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">{task.description}</p>
                <div className="space-y-4">
                  <h3 className="font-medium">Offers</h3>
                  {task.Offer.length === 0 ? (
                    <p className="text-gray-500 text-sm">No offers yet</p>
                  ) : (
                    <div className="space-y-3">
                      {task.Offer.map((offer) => (
                        <div
                          key={offer.id}
                          className="border rounded-lg p-4 space-y-2"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">
                                {offer.provider.firstName}{" "}
                                {offer.provider.lastName}
                              </p>
                              <p className="text-sm text-gray-500">
                                Rate: {offer.hourlyRate} {offer.currency}/hr
                              </p>
                              <p className="text-sm text-gray-500">
                                Status: {offer.status}
                              </p>
                            </div>
                            {offer.status === "PENDING" && (
                              <div className="space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRejectOffer(offer.id)}
                                >
                                  Reject
                                </Button>
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => handleAcceptOffer(offer.id)}
                                >
                                  Accept
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
