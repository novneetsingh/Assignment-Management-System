import { useContext } from "react";
import { FiLogOut } from "react-icons/fi";
import { AuthContext } from "../../context/AuthContext";

const Header = ({ title }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
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
  );
};

export default Header;
