// src/components/auth/LoginForm.js
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password, rememberMe);
      router.push('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="auth-form-container">
      <h2 className="auth-title">Log in to Vidora</h2>
      
      {error && (
        <div className="auth-error">
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            required
          />
        </div>
        
        <div className="form-options">
          <div className="remember-me">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember-me">Remember me</label>
          </div>
          
          <Link href="/forgot-password" className="forgot-password">
            Forgot Password?
          </Link>
        </div>
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
      
      <div className="auth-divider">
        <span>or</span>
      </div>
      
      <p className="auth-alternate">
        Don't have an account? <Link href="/signup">Sign Up</Link>
      </p>
    </div>
  );
};

export default LoginForm;

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

// src/components/auth/VerificationCode.js
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';

const VerificationCode = ({ email }) => {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);
  const inputRefs = useRef([]);
  const { verifyStudentCode } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    // Focus first input on load
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
    
    // Start resend countdown
    setResendCountdown(60);
    const timer = setInterval(() => {
      setResendCountdown(prevCount => {
        if (prevCount <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const handleChange = (index, value) => {
    if (!/^[0-9]$/.test(value) && value !== '') {
      return;
    }
    
    // Update the code digit
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    
    // Auto-advance to next input
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };
  
  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (verificationCode[index] === '' && index > 0) {
        // If current input is empty, focus previous one on backspace
        inputRefs.current[index - 1].focus();
      }
    }
  };
  
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain');
    
    // If the pasted content looks like a 6-digit code
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setVerificationCode(digits);
      
      // Focus the last input
      inputRefs.current[5].focus();
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const code = verificationCode.join('');
    if (code.length !== 6) {
      setError('Please enter all 6 digits of the verification code');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await verifyStudentCode(email, code);
      
      // Show success message before redirect
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err) {
      console.error('Verification error:', err);
      setError(err.message || 'Invalid verification code. Please check and try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResendCode = async () => {
    if (resendCountdown > 0) return;
    
    try {
      // API call to resend verification code
      await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      // Reset countdown
      setResendCountdown(60);
      const timer = setInterval(() => {
        setResendCountdown(prevCount => {
          if (prevCount <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);
    } catch (err) {
      console.error('Error resending code:', err);
      setError('Failed to resend verification code. Please try again.');
    }
  };
  
  return (
    <div className="verification-container">
      <h2>Verify Student Status</h2>
      <p className="verification-intro">
        We've sent a 6-digit verification code to <strong>{email}</strong>. 
        Please enter the code below to verify your student status.
      </p>
      
      {error && (
        <div className="verification-error">
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="verification-form">
        <div className="code-input-group" onPaste={handlePaste}>
          {verificationCode.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              className="code-input"
              aria-label={`Digit ${index + 1}`}
            />
          ))}
        </div>
        
        <button 
          type="submit" 
          className="verify-button"
          disabled={isLoading}
        >
          {isLoading ? 'Verifying...' : 'Verify'}
        </button>
      </form>
      
      <div className="resend-code">
        <p>Didn't receive a code?</p>
        <button 
          onClick={handleResendCode} 
          disabled={resendCountdown > 0}
          className="resend-button"
        >
          {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend Code'}
        </button>
      </div>
    </div>
  );
};

export default VerificationCode;


