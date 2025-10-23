import Card from "../common/Card";

const StatCard = ({ title, value, color = "blue" }) => {
  const colorClasses = {
    blue: "text-blue-600",
    green: "text-green-600",
    purple: "text-purple-600",
    indigo: "text-indigo-600",
    yellow: "text-yellow-600",
  };

  return (
    <Card>
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className={`text-3xl font-bold ${colorClasses[color]} mt-2`}>
        {value}
      </p>
    </Card>
  );
};

export default StatCard;
