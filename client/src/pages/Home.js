import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Auth.css'; 

const Home = () => {
  return (
    <div className="home-container" style={{ 
        backgroundImage: "url('/images/homepic.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        height: '70vh',
        width: '100%'
    }}>
      <div className="container text-center" style={{ position: 'relative', zIndex: 2 }}>
        <div className="row justify-content-center">
          <div className="col-md-9">
            <div className="card shadow-lg" style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              borderRadius: '10px',
              padding: '1.9rem', 
              maxWidth: '700px', 
              margin: '0 auto',
              marginTop: '6vh' 
            }}>
              <h1 className="display-6 mb-2 fw-bold text-primary">Your Todo List</h1> {/* Smaller heading */}
              <p className="mb-3" style={{ fontSize: '1rem' }}> {/* Smaller text */}
                Organize your tasks, never miss a deadline again.
              </p>
              <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                <Link to="/login" className="btn btn-primary px-3 me-md-2"> {/* Smaller buttons */}
                  Login
                </Link>
                <Link to="/register" className="btn btn-outline-primary px-3">
                  Register
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
