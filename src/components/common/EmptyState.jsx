const EmptyState = ({ message, icon, action }) => {
  return (
    <div className="text-center py-12">
      {icon && <div className="text-gray-400 text-5xl mb-4">{icon}</div>}
      <p className="text-gray-500 mb-4">{message}</p>
      {action && action}
    </div>
  );
};

export default EmptyState;
