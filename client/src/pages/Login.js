import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated, error } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/todos');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      setFormError(error);
    }
  }, [error]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    try {
      await login(formData);
    } catch (error) {
      setFormError(error.message || 'Login failed. Please try again.');
    }
  };

  // Keep most of your existing code, but update the form part:

return (
  <div className="auth-container" style={{ 
    backgroundImage: "url('/images/log.png')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    height: '100vh',
    width: '100%'
  }}>
    <div className="auth-form-container">
      <div className="row justify-content-center">
        <div className="col-md-5"> {/* Reduced column width */}
          <div className="auth-form">
            <h2 className="text-center auth-title">Login</h2> {/* Shorter title */}
            
            {formError && (
              <div className="alert alert-danger py-2" role="alert"> {/* Smaller alert */}
                {formError}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control form-control-sm" /* Smaller input */
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="input-group input-group-sm"> {/* Smaller input group */}
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button 
                    className="btn btn-outline-secondary" 
                    type="button"
                    onClick={togglePasswordVisibility}
                  >
                    <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                  </button>
                </div>
              </div>
              
              <div className="d-grid mb-2"> {/* Reduced margin */}
                <button type="submit" className="btn btn-primary btn-sm"> {/* Smaller button */}
                  Login
                </button>
              </div>
              
              <div className="text-center" style={{ fontSize: '0.9rem' }}> {/* Smaller text */}
                Don't have an account?{' '}
                <Link to="/register" className="auth-link">Register</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
);

};

export default Login;
