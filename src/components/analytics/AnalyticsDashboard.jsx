import StatCard from "./StatCard";
import Card from "../common/Card";

const AnalyticsDashboard = ({ analytics }) => {
  if (!analytics) return null;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Assignments"
          value={analytics.totalAssignments}
          color="blue"
        />
        <StatCard
          title="Group Submissions"
          value={analytics.groupSubmissions}
          color="green"
        />
        <StatCard
          title="Total Submissions"
          value={analytics.totalSubmissions}
          color="purple"
        />
        <StatCard
          title="Individual Submissions"
          value={analytics.individualSubmissions}
          color="indigo"
        />
      </div>

      <Card className="mb-6">
        <h3 className="text-lg font-bold mb-4">Submission Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {analytics.confirmedSubmissions}
            </p>
            <p className="text-sm text-gray-500">Confirmed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {analytics.pendingSubmissions}
            </p>
            <p className="text-sm text-gray-500">Pending</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {analytics.percentageConfirmed?.toFixed(1) || 0}%
            </p>
            <p className="text-sm text-gray-500">Confirmation Rate</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
