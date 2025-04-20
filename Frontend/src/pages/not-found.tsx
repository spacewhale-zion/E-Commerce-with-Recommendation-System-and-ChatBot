import { MdError } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
  const navigate = useNavigate();

  const containerStyle: React.CSSProperties = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: "linear-gradient(120deg, #fff 0%, #f8e1e1 100%)",
    color: "#d32f2f",
    textAlign: "center",
    padding: "2rem",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const iconStyle: React.CSSProperties = {
    fontSize: "6rem",
    marginBottom: "1rem",
  };

  const headingStyle: React.CSSProperties = {
    fontSize: "3rem",
    fontWeight: 700,
    marginBottom: "0.5rem",
  };

  const subTextStyle: React.CSSProperties = {
    fontSize: "1.2rem",
    color: "#555",
    marginTop: "0.5rem",
    marginBottom: "1.5rem",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "0.8rem 2rem",
    backgroundColor: "#d32f2f",
    color: "#fff",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "all 0.3s",
  };

  return (
    <div style={containerStyle}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [1.2, 1], rotate: [0, -10, 10, 0] }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
      >
        <MdError style={iconStyle} />
      </motion.div>

      <h1 style={headingStyle}>404 - Page Not Found</h1>
      <p style={subTextStyle}>
        Sorry, the page you're looking for doesn't exist or has been moved.
      </p>

      <button style={buttonStyle} onClick={() => navigate("/")}>
        Go Home
      </button>
    </div>
  );
};

export default NotFound;
