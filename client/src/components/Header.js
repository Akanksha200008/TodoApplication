import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container position-relative">
        {isAuthenticated ? (
          <div className="position-relative" ref={profileRef}>
            <button 
              className="btn btn-link text-white text-decoration-underline p-0 border-0" 
              onClick={toggleProfile}
              style={{ 
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                background: 'none'
              }}
            >
              Profile
            </button>
            
            {showProfile && (
              <div 
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: '0',
                  zIndex: 1000,
                  minWidth: '250px',
                  padding: '12px',
                  marginTop: '10px',
                  backgroundColor: 'white',
                  borderRadius: '6px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  border: '1px solid rgba(0,0,0,0.1)'
                }}
              >
                <p style={{ 
                  marginBottom: '8px', 
                  color: '#495057'
                }}>
                  <span style={{ fontWeight: '500' }}>User:</span> {user?.username}
                </p>
                <p style={{ 
                  marginBottom: '0', 
                  color: '#495057'
                }}>
                  <span style={{ fontWeight: '500' }}>Gmail:</span> {user?.email}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div style={{ width: '80px' }}></div> // Empty div with width to balance layout
        )}
        
        {/* Center title */}
        <h4 className="navbar-text text-white m-0 position-absolute" style={{ left: '50%', transform: 'translateX(-50%)' }}>
          Your Todo List
        </h4>
        
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <span className="nav-link">Welcome, {user?.username}</span>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/todos">
                    My Tasks
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
