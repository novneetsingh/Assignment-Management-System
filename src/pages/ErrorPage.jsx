import { useNavigate } from "react-router-dom";
import { FiAlertTriangle, FiHome, FiRefreshCw } from "react-icons/fi";

const ErrorPage = ({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  showHomeButton = true,
  showRetryButton = false,
  onRetry = null,
}) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-100 rounded-full">
            <FiAlertTriangle className="h-12 w-12 text-red-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>

        <p className="text-gray-600 mb-8 leading-relaxed">{message}</p>

        <div className="flex gap-4 justify-center">
          {showRetryButton && (
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FiRefreshCw className="h-4 w-4" />
              Try Again
            </button>
          )}

          {showHomeButton && (
            <button
              onClick={handleGoHome}
              className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              <FiHome className="h-4 w-4" />
              Go Home
            </button>
          )}
        </div>

        <div className="mt-6 text-sm text-gray-500">
          If this problem persists, please contact support.
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
