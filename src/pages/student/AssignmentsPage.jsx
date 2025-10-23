import { useState, useEffect } from "react";
import { FiBook } from "react-icons/fi";
import toast from "react-hot-toast";
import { assignmentAPI, groupAPI, submissionAPI } from "../../services/api";
import Header from "../../components/common/Header";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal";
import StudentAssignmentCard from "../../components/lists/StudentAssignmentCard";
import SubmissionForm from "../../components/forms/SubmissionForm";

const AssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  useEffect(() => {
    fetchAssignments();
    fetchGroups();
  }, []);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await assignmentAPI.getAll();
      setAssignments(res.data.data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch assignments"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchGroups = async () => {
    try {
      const res = await groupAPI.getMyGroups();
      setMyGroups(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch groups");
    }
  };

  const handleSubmitAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setShowSubmitModal(true);
  };

  const submitAssignment = async (data) => {
    try {
      const payload = {
        assignmentId: selectedAssignment.id,
        groupId: data.groupId || null,
      };
      await submissionAPI.submit(payload);
      toast.success("Assignment submitted successfully!");
      setShowSubmitModal(false);
      fetchAssignments();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit assignment"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="My Assignments" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-xl font-bold mb-4">All Assignments</h2>
        {loading ? (
          <Loading />
        ) : assignments.length > 0 ? (
          <div className="grid gap-4">
            {assignments.map((assignment) => (
              <StudentAssignmentCard
                key={assignment.id}
                assignment={assignment}
                onSubmit={handleSubmitAssignment}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<FiBook />}
            message="No assignments available at the moment."
          />
        )}
      </div>

      <Modal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title="Submit Assignment"
      >
        <SubmissionForm
          assignment={selectedAssignment}
          groups={myGroups}
          onSubmit={submitAssignment}
          onCancel={() => setShowSubmitModal(false)}
        />
      </Modal>
    </div>
  );
};

export default AssignmentsPage;
