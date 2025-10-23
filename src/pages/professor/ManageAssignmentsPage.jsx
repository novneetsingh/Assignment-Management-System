import { useState, useEffect } from "react";
import { FiPlus, FiEdit, FiEye } from "react-icons/fi";
import toast from "react-hot-toast";
import { assignmentAPI, submissionAPI } from "../../services/api";
import Header from "../../components/common/Header";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal";
import AssignmentCard from "../../components/lists/AssignmentCard";
import AssignmentForm from "../../components/forms/AssignmentForm";
import SubmissionCard from "../../components/lists/SubmissionCard";

const ManageAssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [selectedAssignmentSubmissions, setSelectedAssignmentSubmissions] =
    useState(null);
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await assignmentAPI.getByProfessor();
      setAssignments(res.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch assignments");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async (data) => {
    try {
      if (editingAssignment) {
        await assignmentAPI.update(editingAssignment.id, data);
        toast.success("Assignment updated successfully!");
      } else {
        await assignmentAPI.create(data);
        toast.success("Assignment created successfully!");
      }
      setShowAssignmentModal(false);
      setEditingAssignment(null);
      fetchAssignments();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (assignment) => {
    setEditingAssignment({
      ...assignment,
      dueDate: assignment.dueDate.split("T")[0],
    });
    setShowAssignmentModal(true);
  };

  const viewSubmissions = async (assignmentId) => {
    try {
      const res = await submissionAPI.getByAssignment(assignmentId);
      setSelectedAssignmentSubmissions(res.data.data || []);
      setShowSubmissionsModal(true);
    } catch (error) {
      toast.error("Failed to fetch submissions");
    }
  };

  const confirmSubmission = async (submissionId, assignmentId) => {
    try {
      await submissionAPI.confirm({ submissionId, assignmentId });
      toast.success("Submission confirmed successfully!");
      viewSubmissions(assignmentId);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to confirm submission"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Manage Assignments" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">My Assignments</h2>
          <button
            onClick={() => {
              setEditingAssignment(null);
              setShowAssignmentModal(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <FiPlus className="inline mr-2" />
            Create Assignment
          </button>
        </div>
        {loading ? (
          <Loading />
        ) : assignments.length > 0 ? (
          <div className="grid gap-4">
            {assignments.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                actions={
                  <>
                    <button
                      onClick={() => viewSubmissions(assignment.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-md"
                      title="View Submissions"
                    >
                      <FiEye size={20} />
                    </button>
                    <button
                      onClick={() => handleEdit(assignment)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                      title="Edit"
                    >
                      <FiEdit size={20} />
                    </button>
                  </>
                }
              />
            ))}
          </div>
        ) : (
          <EmptyState
            message="No assignments created yet."
            action={
              <button
                onClick={() => setShowAssignmentModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Your First Assignment
              </button>
            }
          />
        )}
      </div>

      <Modal
        isOpen={showAssignmentModal}
        onClose={() => {
          setShowAssignmentModal(false);
          setEditingAssignment(null);
        }}
        title={editingAssignment ? "Edit Assignment" : "Create New Assignment"}
      >
        <AssignmentForm
          defaultValues={editingAssignment}
          isEditing={!!editingAssignment}
          onSubmit={handleCreateAssignment}
          onCancel={() => {
            setShowAssignmentModal(false);
            setEditingAssignment(null);
          }}
        />
      </Modal>

      <Modal
        isOpen={showSubmissionsModal}
        onClose={() => setShowSubmissionsModal(false)}
        title="Assignment Submissions"
      >
        <div className="space-y-4">
          {selectedAssignmentSubmissions?.length > 0 ? (
            selectedAssignmentSubmissions.map((submission) => (
              <SubmissionCard
                key={submission.id}
                submission={submission}
                onConfirm={(submissionId) =>
                  confirmSubmission(submissionId, submission.assignmentId)
                }
              />
            ))
          ) : (
            <EmptyState message="No submissions yet for this assignment." />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ManageAssignmentsPage;
