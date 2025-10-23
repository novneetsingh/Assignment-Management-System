import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { assignmentAPI } from "../../services/api";
import Header from "../../components/common/Header";
import Loading from "../../components/common/Loading";
import AnalyticsDashboard from "../../components/analytics/AnalyticsDashboard";

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await assignmentAPI.getAnalytics();
      setAnalytics(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Analytics Dashboard" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-xl font-bold mb-4">Analytics Overview</h2>
        {loading ? <Loading /> : <AnalyticsDashboard analytics={analytics} />}
      </div>
    </div>
  );
};

export default AnalyticsPage;
