// src/components/auth/SignupForm.js
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import VerificationCode from './VerificationCode';

const SignupForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    isStudent: false,
    school: '',
    location: '',
    acceptTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const router = useRouter();
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const validateStep1 = () => {
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email');
      return false;
    }
    if (!formData.password) {
      setError('Please enter a password');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };
  
  const validateStep2 = () => {
    if (formData.isStudent && !formData.school.trim()) {
      setError('Please enter your school name');
      return false;
    }
    if (!formData.location.trim()) {
      setError('Please enter your location');
      return false;
    }
    if (!formData.acceptTerms) {
      setError('You must accept the Terms of Service');
      return false;
    }
    return true;
  };
  
  const handleNext = () => {
    setError('');
    if (validateStep1()) {
      setStep(2);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateStep2()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signup(formData);
      
      if (formData.isStudent) {
        // If student, go to verification
        setStep(3);
      } else {
        // If regular filmmaker, redirect to dashboard
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderStep1 = () => (
    <>
      <div className="form-group">
        <label htmlFor="name">Full Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your full name"
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Your email address"
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create a password (min. 8 characters)"
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
          required
        />
      </div>
      
      <button 
        type="button" 
        className="submit-button"
        onClick={handleNext}
      >
        Next
      </button>
    </>
  );
  
  const renderStep2 = () => (
    <>
      <div className="form-group student-toggle">
        <input
          id="isStudent"
          name="isStudent"
          type="checkbox"
          checked={formData.isStudent}
          onChange={handleChange}
        />
        <label htmlFor="isStudent">I am a student filmmaker</label>
      </div>
      
      {formData.isStudent && (
        <div className="form-group">
          <label htmlFor="school">School / University</label>
          <input
            id="school"
            name="school"
            type="text"
            value={formData.school}
            onChange={handleChange}
            placeholder="Your school or university name"
          />
          <p className="form-note">
            Note: You will need to verify your student status
          </p>
        </div>
      )}
      
      <div className="form-group">
        <label htmlFor="location">Location</label>
        <input
          id="location"
          name="location"
          type="text"
          value={formData.location}
          onChange={handleChange}
          placeholder="City, Country"
          required
        />
      </div>
      
      <div className="form-group terms-checkbox">
        <input
          id="acceptTerms"
          name="acceptTerms"
          type="checkbox"
          checked={formData.acceptTerms}
          onChange={handleChange}
          required
        />
        <label htmlFor="acceptTerms">
          I accept the <Link href="/terms/terms-of-service">Terms of Service</Link> and <Link href="/terms/privacy-policy">Privacy Policy</Link>
        </label>
      </div>
      
      <div className="form-buttons">
        <button 
          type="button" 
          className="back-button"
          onClick={() => setStep(1)}
        >
          Back
        </button>
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </div>
    </>
  );
  
  return (
    <div className="auth-form-container">
      <h2 className="auth-title">Create Your Filmmaker Account</h2>
      
      {error && (
        <div className="auth-error">
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>
      )}
      
      {step < 3 ? (
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="signup-progress">
            <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>1</div>
            <div className="progress-line"></div>
            <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>2</div>
          </div>
          
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
        </form>
      ) : (
        <VerificationCode email={formData.email} />
      )}
      
      {step < 3 && (
        <>
          <div className="auth-divider">
            <span>or</span>
          </div>
          
          <p className="auth-alternate">
            Already have an account? <Link href="/login">Log In</Link>
          </p>
        </>
      )}
    </div>
  );
};

export default SignupForm;