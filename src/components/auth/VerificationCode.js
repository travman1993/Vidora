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