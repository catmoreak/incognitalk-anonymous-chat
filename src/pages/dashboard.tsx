import React, { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import emailjs from 'emailjs-com';

const Dashboard: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handleCaptcha = (token: string | null) => {
    setRecaptchaToken(token);
  };

  const sendOtp = () => {
    if (!email || !recaptchaToken) {
      setError('Please enter email and complete the reCAPTCHA.');
      return;
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    const templateParams = {
      email,
      otp: otpCode,
    };

    emailjs
      .send('service_idx9k7k', 'template_v0gv4h2', templateParams, 'bh92K-FkR4gz4c-Dz')
      .then(() => {
        setIsOtpSent(true);
        setError('');
        alert(`OTP sent to ${email}`);
        localStorage.setItem('otp', otpCode);
      })
      .catch(() => {
        setError('Failed to send OTP. Try again.');
      });
  };

  const verifyOtp = () => {
    const savedOtp = localStorage.getItem('otp');
    if (otp === savedOtp) {
      setIsVerified(true);
      alert('OTP verified successfully!');
    } else {
      setError('Invalid OTP');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <h2 style={styles.heading}>Admin Login</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={handleEmailChange}
          style={styles.input}
        />

        {!isOtpSent && (
          <>
            <div style={styles.recaptchaContainer}>
              <ReCAPTCHA
                sitekey="6Le6CxwrAAAAAGCVE579GFCkTzd3usz6pkuM4VIj"
                onChange={handleCaptcha}
                theme="dark"
                ref={recaptchaRef}
              />
            </div>
            <button onClick={sendOtp} style={styles.button}>
              Send OTP
            </button>
          </>
        )}

        {isOtpSent && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={handleOtpChange}
              style={styles.input}
            />
            <button onClick={verifyOtp} style={styles.button}>
              Verify OTP
            </button>
          </>
        )}

        {error && <p style={styles.error}>{error}</p>}
        {isVerified && <p style={styles.success}>Email is not authenticated for login Switch to authenticated email for login</p>}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #121212 0%, #1A1A1A 100%)',
  },
  loginBox: {
    backgroundColor: '#222',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 6px 14px rgba(0, 0, 0, 0.5)',
    width: '350px',
    textAlign: 'center',
  },
  heading: {
    color: '#f5f5f5',
    marginBottom: '20px',
    fontSize: '26px',
    fontFamily: 'Helvetica, Arial, sans-serif',
    fontWeight: 600,
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    fontSize: '15px',
    borderRadius: '5px',
    border: '1px solid #444',
    backgroundColor: '#333',
    color: '#eee',
    marginBottom: '15px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#03a9f4',
    color: '#fff',
    cursor: 'pointer',
    marginBottom: '15px',
  },
  recaptchaContainer: {
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'center',
  },
  error: {
    color: '#e57373',
    marginTop: '10px',
    fontSize: '14px',
  },
  success: {
    color: '#81c784',
    marginTop: '10px',
    fontSize: '16px',
    fontWeight: 500,
  },
};

export default Dashboard;