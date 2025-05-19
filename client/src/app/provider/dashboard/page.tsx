"use client";

import { ISkill, ISkillsList } from "@/types/provider";
import { skillAPI } from "@/services/api";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Pencil } from "lucide-react";
import AuthLayout from "@/components/layout/AuthLayout";

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
  const [skills, setSkills] = useState<ISkillsList[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState<string>("");
  const [newSkill, setNewSkill] = useState<ISkill>({
    category: "",
    experience: "",
    workNature: "onsite",
    hourlyRate: 0,
    currency: "USD",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSkills();
    // fetchTasks();
  }, []);

  const fetchSkills = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const response = await skillAPI.getSkillsByProvider(user.id);
      setSkills(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error fetching skills");
    }
  };

  const handleUpdateSkill = async (skill: ISkillsList) => {
    setIsUpdating(true);
    setSelectedSkillId(skill.id);
    setNewSkill({
      category: skill.category,
      experience: skill.experience,
      workNature: skill.workNature,
      hourlyRate: skill.hourlyRate,
      currency: skill.currency,
    });
    setShowSkillModal(true);
  };

  const handleSkillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (isUpdating) {
        await skillAPI.updateSkill(selectedSkillId, newSkill);
        toast.success("Skill updated successfully!");
      } else {
        await skillAPI.createSkill(newSkill);
        toast.success("Skill added successfully!");
      }
      setShowSkillModal(false);
      setNewSkill({
        category: "",
        experience: "",
        workNature: "onsite",
        hourlyRate: 0,
        currency: "USD",
      });
      setIsUpdating(false);
      setSelectedSkillId("");
      fetchSkills();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          `Error ${isUpdating ? "updating" : "creating"} skill`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowSkillModal(false);
    setIsUpdating(false);
    setSelectedSkillId("");
    setNewSkill({
      category: "",
      experience: "",
      workNature: "onsite",
      hourlyRate: 0,
      currency: "USD",
    });
  };

  const handleSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSkill((prev) => ({ ...prev, [name]: value }));
  };

  const handleWorkNatureChange = (value: string) => {
    setNewSkill((prev) => ({
      ...prev,
      workNature: value as "onsite" | "online",
    }));
  };

  const handleCurrencyChange = (value: string) => {
    setNewSkill((prev) => ({
      ...prev,
      currency: value as "USD" | "AUD" | "SGD" | "INR",
    }));
  };

  return (
    <AuthLayout userType="provider">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Provider Dashboard
          </h1>
          <Button
            onClick={() => {
              setIsUpdating(false);
              setShowSkillModal(true);
            }}
          >
            Add New Skill
          </Button>
        </div>

        {/* Skill Modal */}
        <Dialog open={showSkillModal} onOpenChange={handleCloseModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isUpdating ? "Update Skill" : "Add New Skill"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSkillSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Input
                  type="text"
                  name="category"
                  required
                  value={newSkill.category}
                  onChange={handleSkillChange}
                  placeholder="Enter skill category"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Experience</label>
                <Input
                  type="text"
                  name="experience"
                  required
                  value={newSkill.experience}
                  onChange={handleSkillChange}
                  placeholder="Enter years of experience"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Nature of Work</label>
                <Select
                  value={newSkill.workNature}
                  onValueChange={handleWorkNatureChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select work nature" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="onsite">Onsite</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Hourly Rate</label>
                <Input
                  type="number"
                  name="hourlyRate"
                  required
                  value={newSkill.hourlyRate}
                  onChange={handleSkillChange}
                  placeholder="Enter hourly rate"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Currency</label>
                <Select
                  value={newSkill.currency}
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
                    ? isUpdating
                      ? "Updating..."
                      : "Adding..."
                    : isUpdating
                    ? "Update Skill"
                    : "Add Skill"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Skills Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {skills.map((skill) => (
              <Card
                key={skill.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {skill.category}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {skill.experience} years experience
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleUpdateSkill(skill)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Rate:</span>
                      <span className="text-primary">
                        {skill.hourlyRate} {skill.currency}/hr
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Work:</span>
                      <span className="capitalize">{skill.workNature}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tasks Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Tasks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">{task.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {task.category}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Rate:</span>
                      <span className="text-primary">
                        {task.hourlyRate} {task.currency}/hr
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Status:</span>
                      <span
                        className={`capitalize ${
                          task.status === "completed"
                            ? "text-green-600"
                            : task.status === "in_progress"
                            ? "text-blue-600"
                            : task.status === "pending"
                            ? "text-yellow-600"
                            : task.status === "rejected"
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                      >
                        {task.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
