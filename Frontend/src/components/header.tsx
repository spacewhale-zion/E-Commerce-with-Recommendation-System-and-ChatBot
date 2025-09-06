import { Link, useLocation } from "react-router-dom";
import {
  FaSearch,
  FaShoppingBag,
  FaSignInAlt,
  FaUser,
  FaSignOutAlt,
  FaHome,
  FaStore,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { User } from "../types/types";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import toast from "react-hot-toast";

interface PropsType {
  user: User | null;
}

const Header = ({ user }: PropsType) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as Element).closest('.user-menu')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const logoutHandler = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully");
      setIsOpen(false);
    } catch (error) {
      toast.error("Sign out failed");
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="header">
      <div className="header-left">
        <Link to="/" className="logo">
          SHOPIFY
        </Link>
      </div>

      <div className="header-center">
        <Link 
          to="/" 
          className={isActive("/") ? "active" : ""}
        >
          <FaHome />
          <span>Home</span>
        </Link>
        <Link 
          to="/search" 
          className={isActive("/search") ? "active" : ""}
        >
          <FaSearch />
          <span>Search</span>
        </Link>
        <Link 
          to="/cart" 
          className={isActive("/cart") ? "active" : ""}
        >
          <FaShoppingBag />
          <span>Cart</span>
        </Link>
      </div>

      <div className="header-right">
        {user?._id ? (
          <div className="user-menu">
            <button 
              className="user-button"
              onClick={() => setIsOpen(!isOpen)}
            >
              <FaUser />
              <span>{user.name}</span>
            </button>
            
            <div className={`user-dropdown ${isOpen ? 'open' : ''}`}>
              {user.role === "admin" && (
                <Link to="/admin/dashboard" onClick={() => setIsOpen(false)}>
                  <FaStore />
                  <span>Admin Dashboard</span>
                </Link>
              )}
              <Link to="/orders" onClick={() => setIsOpen(false)}>
                <FaShoppingBag />
                <span>My Orders</span>
              </Link>
              <button onClick={logoutHandler}>
                <FaSignOutAlt />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          <Link to="/login" className="login-btn">
            <FaSignInAlt />
            <span>Sign In</span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Header;
