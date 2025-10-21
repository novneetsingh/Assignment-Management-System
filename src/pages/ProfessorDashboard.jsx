import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import {
  FiLogOut,
  FiBook,
  FiBarChart2,
  FiEdit,
  FiTrash2,
  FiPlus,
} from "react-icons/fi";
import axios from "axios";

const ProfessorDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("assignments");
  const [assignments, setAssignments] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

  // Form state
  const { register, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      if (activeTab === "assignments") {
        const res = await axios.get(`/assignments`, { headers });
        setAssignments(res.data.data);
      } else if (activeTab === "analytics") {
        const res = await axios.get(`/assignments/analytics`, { headers });
        setAnalytics(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      if (editingAssignment) {
        await axios.put(`/assignments/${editingAssignment.id}`, data, {
          headers,
        });
        toast.success("Assignment updated successfully!");
      } else {
        await axios.post(`/assignments`, data, {
          headers,
        });
        toast.success("Assignment created successfully!");
      }
      setShowAssignmentModal(false);
      reset();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setValue("title", assignment.title);
    setValue("description", assignment.description);
    setValue("dueDate", assignment.dueDate.split("T")[0]);
    setValue("oneDriveLink", assignment.oneDriveLink);
    setShowAssignmentModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this assignment?"))
      return;
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`/assignments/${id}`, {
        headers,
      });
      toast.success("Assignment deleted successfully!");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete assignment");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Professor Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user?.name}</span>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("assignments")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
              activeTab === "assignments"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <FiBook /> Assignments
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
              activeTab === "analytics"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <FiBarChart2 /> Analytics
          </button>
        </div>

        {/* Assignments Tab */}
        {activeTab === "assignments" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Manage Assignments</h2>
              <button
                onClick={() => {
                  setEditingAssignment(null);
                  reset();
                  setShowAssignmentModal(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <FiPlus className="inline mr-2" />
                Create Assignment
              </button>
            </div>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="grid gap-4">
                {assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="bg-white p-6 rounded-lg shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">
                          {assignment.title}
                        </h3>
                        <p className="text-gray-600 mt-2">
                          {assignment.description}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          Due:{" "}
                          {new Date(assignment.dueDate).toLocaleDateString()}
                        </p>
                        <a
                          href={assignment.oneDriveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                        >
                          OneDrive Link
                        </a>
                        <div className="mt-4">
                          <p className="text-sm font-medium">
                            Submissions: {assignment.submissions?.length || 0}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(assignment)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(assignment.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Analytics Dashboard</h2>
            {loading ? (
              <p>Loading...</p>
            ) : analytics ? (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm">Total Assignments</h3>
                    <p className="text-3xl font-bold text-blue-600 mt-2">
                      {analytics.totalAssignments}
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm">Total Groups</h3>
                    <p className="text-3xl font-bold text-green-600 mt-2">
                      {analytics.totalGroups}
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm">Total Submissions</h3>
                    <p className="text-3xl font-bold text-purple-600 mt-2">
                      {analytics.totalSubmissions}
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm">
                      Confirmed Submissions
                    </h3>
                    <p className="text-3xl font-bold text-orange-600 mt-2">
                      {analytics.confirmedSubmissions}
                    </p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-bold mb-4">
                    Assignment-wise Statistics
                  </h3>
                  <div className="space-y-4">
                    {analytics.assignmentStats?.map((stat) => (
                      <div key={stat.id} className="border-b pb-4">
                        <h4 className="font-medium">{stat.title}</h4>
                        <div className="mt-2 flex gap-4 text-sm">
                          <span className="text-gray-600">
                            Total Submissions: {stat.totalSubmissions}
                          </span>
                          <span className="text-green-600">
                            Confirmed: {stat.confirmedSubmissions}
                          </span>
                        </div>
                        <div className="mt-2 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{
                              width: `${
                                stat.totalSubmissions > 0
                                  ? (stat.confirmedSubmissions /
                                      stat.totalSubmissions) *
                                    100
                                  : 0
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Create/Edit Assignment Modal */}
      {showAssignmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <h3 className="text-xl font-bold mb-4">
              {editingAssignment ? "Edit Assignment" : "Create New Assignment"}
            </h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  {...register("title", { required: "Title is required" })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Assignment title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  {...register("description", {
                    required: "Description is required",
                  })}
                  rows="4"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Assignment description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  {...register("dueDate", { required: "Due date is required" })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  OneDrive Link
                </label>
                <input
                  type="url"
                  {...register("oneDriveLink", {
                    required: "OneDrive link is required",
                  })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="https://onedrive.live.com/..."
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingAssignment ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAssignmentModal(false);
                    reset();
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessorDashboard;
