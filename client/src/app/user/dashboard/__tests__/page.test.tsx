import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UserDashboard from "../page";
import { useAuth } from "@/context/UserContext";
import { taskAPI } from "@/services/api";
import { toast } from "sonner";

// Mock the dependencies
jest.mock("@/context/UserContext");
jest.mock("@/services/api");
jest.mock("sonner");

// Mock data
const mockUser = {
  id: "user123",
  name: "Test User",
};

const mockTasks = [
  {
    id: "task1",
    name: "Test Task 1",
    category: "Development",
    description: "Test description",
    expectedStartDate: "2024-03-20",
    expectedHours: "10",
    hourlyRate: "50",
    currency: "USD",
    status: "OPEN",
    progress: [],
    offers: [],
  },
  {
    id: "task2",
    name: "Test Task 2",
    category: "Design",
    description: "Test description 2",
    expectedStartDate: "2024-03-21",
    expectedHours: "5",
    hourlyRate: "40",
    currency: "USD",
    status: "IN_PROGRESS",
    progress: [],
    offers: [],
  },
];

describe("UserDashboard", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Mock useAuth hook
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });

    // Mock taskAPI
    (taskAPI.getTasksByUser as jest.Mock).mockResolvedValue(mockTasks);
    (taskAPI.createTask as jest.Mock).mockResolvedValue({});
    (taskAPI.updateTask as jest.Mock).mockResolvedValue({});
    (taskAPI.acceptTaskCompletion as jest.Mock).mockResolvedValue({});
    (taskAPI.rejectTaskCompletion as jest.Mock).mockResolvedValue({});
  });

  it("renders the dashboard with tasks", async () => {
    render(<UserDashboard />);

    // Check if the title is rendered
    expect(screen.getByText("User Dashboard")).toBeInTheDocument();

    // Check if tasks are rendered
    await waitFor(() => {
      expect(screen.getByText("Test Task 1")).toBeInTheDocument();
      expect(screen.getByText("Test Task 2")).toBeInTheDocument();
    });
  });

  it("opens add task dialog when clicking Post New Task button", async () => {
    render(<UserDashboard />);

    const addButton = screen.getByText("Post New Task");
    fireEvent.click(addButton);

    expect(screen.getByText("Post New Task")).toBeInTheDocument();
    expect(screen.getByLabelText("Task Name")).toBeInTheDocument();
  });

  it("creates a new task successfully", async () => {
    render(<UserDashboard />);

    // Open add task dialog
    const addButton = screen.getByText("Post New Task");
    fireEvent.click(addButton);

    // Fill in the form
    fireEvent.change(screen.getByLabelText("Task Name"), {
      target: { value: "New Test Task" },
    });
    fireEvent.change(screen.getByLabelText("Category"), {
      target: { value: "Testing" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Test description" },
    });
    fireEvent.change(screen.getByLabelText("Expected Start Date"), {
      target: { value: "2024-03-22" },
    });
    fireEvent.change(screen.getByLabelText("Working Hours"), {
      target: { value: "8" },
    });
    fireEvent.change(screen.getByLabelText("Hourly Rate"), {
      target: { value: "60" },
    });

    // Submit the form
    const submitButton = screen.getByText("Post Task");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(taskAPI.createTask).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Task created successfully!");
    });
  });

  it("edits an existing task", async () => {
    render(<UserDashboard />);

    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText("Test Task 1")).toBeInTheDocument();
    });

    // Click edit button
    const editButton = screen.getByText("Edit");
    fireEvent.click(editButton);

    // Update task name
    fireEvent.change(screen.getByLabelText("Task Name"), {
      target: { value: "Updated Task Name" },
    });

    // Submit the form
    const updateButton = screen.getByText("Update Task");
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(taskAPI.updateTask).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Task updated successfully!");
    });
  });

  it("handles task completion acceptance", async () => {
    const completedTask = {
      ...mockTasks[0],
      status: "PROVIDER_COMPLETED",
    };

    (taskAPI.getTasksByUser as jest.Mock).mockResolvedValue([completedTask]);

    render(<UserDashboard />);

    await waitFor(() => {
      expect(screen.getByText("Test Task 1")).toBeInTheDocument();
    });

    const acceptButton = screen.getByText("Accept");
    fireEvent.click(acceptButton);

    await waitFor(() => {
      expect(taskAPI.acceptTaskCompletion).toHaveBeenCalledWith("task1");
      expect(toast.success).toHaveBeenCalledWith("Task completion accepted!");
    });
  });

  it("handles task completion rejection", async () => {
    const completedTask = {
      ...mockTasks[0],
      status: "PROVIDER_COMPLETED",
    };

    (taskAPI.getTasksByUser as jest.Mock).mockResolvedValue([completedTask]);

    render(<UserDashboard />);

    await waitFor(() => {
      expect(screen.getByText("Test Task 1")).toBeInTheDocument();
    });

    const rejectButton = screen.getByText("Reject");
    fireEvent.click(rejectButton);

    await waitFor(() => {
      expect(taskAPI.rejectTaskCompletion).toHaveBeenCalledWith("task1");
      expect(toast.success).toHaveBeenCalledWith(
        "Task completion rejected. Task is back in progress."
      );
    });
  });

  it("shows error toast when API calls fail", async () => {
    const error = new Error("API Error");
    (taskAPI.getTasksByUser as jest.Mock).mockRejectedValue(error);

    render(<UserDashboard />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });
});
