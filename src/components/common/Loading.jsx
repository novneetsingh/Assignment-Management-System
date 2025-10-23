const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="flex items-center justify-center py-8">
      <p className="text-gray-600">{message}</p>
    </div>
  );
};

export default Loading;
