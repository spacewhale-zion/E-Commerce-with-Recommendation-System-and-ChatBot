
function Loader() {
  return (
    <>
      <style>{`
        .loader-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #f5f5f5;
        }

        .loader {
          width: 50px;
          height: 50px;
          border: 6px solid #e0e0e0;
          border-top: 6px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <div className="loader-container">
        <div className="loader"></div>
      </div>
    </>
  );
}

export default Loader;
