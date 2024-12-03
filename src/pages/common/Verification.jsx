import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { verifyOtp, sendOtp } from './../../services/api';
import { useNavigate, useLocation } from 'react-router-dom';

const Verification = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [resendMessage, setResendMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const location = useLocation();
    const { email } = location.state || '';
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!otp) {
            setError('Please enter the OTP.');
            return;
        }
        setError('');
        setMessage('');
        setResendMessage('');
        setLoading(true);

        try {
            const response = await verifyOtp(email, otp);
            navigate('/login');
            console.log(response);
            if (response.status == 200) {
                setMessage(response.message);
                navigate('/login');
            } else if (response.status == 404) {
                setError(response.message);
            }
        } catch (err) {
            setError('Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setResending(true);
        setMessage('');
        setResendMessage('');
        setError('');

        try {
            const response = await sendOtp(email);
            if (response.status == 200) {
                setResendMessage('OTP has been sent again to your email.');
            } else {
                setError('Failed to resend OTP. Please try again.');
            }
        } catch (err) {
            setError('Error while resending OTP. Please try again.');
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow" style={{ width: '400px' }}>
                <h4 className="text-center mb-4">Verify Your Email</h4>
                <p className="text-center">
                    We have sent a one-time password (OTP) to your email. Please enter it below to verify your account.
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <label htmlFor="otpInput" className="form-label" />
                        <input
                            type="text"
                            id="otpInput"
                            className="form-control"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                        />
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {message && <div className="alert alert-info">{message}</div>}

                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={loading}
                    >
                        {loading ? 'Verifying...' : 'Verify'}
                    </button>
                </form>
                <div className="text-center mt-3">
                    Didn’t receive the OTP?{' '}
                    <button
                        className="btn btn-link p-0"
                        style={{ textDecoration: 'none' }}
                        onClick={handleResendOtp}
                        disabled={resending}
                    >
                        {resending ? 'Resending...' : 'Resend OTP'}
                    </button>
                    {resendMessage && <div className="alert alert-info mt-2">{resendMessage}</div>}
                </div>
            </div>
        </div>
    );
};

export default Verification;
