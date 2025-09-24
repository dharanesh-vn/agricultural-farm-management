import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/api';
import '../styles/Auth.css'; // Uses the same beautiful auth styles

export const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', confirmPassword: '', role: 'farmer',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    
    // --- Real-time Validation State ---
    const [validation, setValidation] = useState({
        isEmailValid: true,
        passwordsMatch: true,
        isPasswordStrong: true,
    });
    
    const navigate = useNavigate();

    // Validate password and email on every change
    useEffect(() => {
        const { email, password, confirmPassword } = formData;
        const emailRegex = /\S+@\S+\.\S+/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

        setValidation({
            isEmailValid: email === '' || emailRegex.test(email),
            passwordsMatch: password === '' || confirmPassword === '' || password === confirmPassword,
            isPasswordStrong: password === '' || passwordRegex.test(password),
        });
    }, [formData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validation.isEmailValid || !validation.passwordsMatch || !validation.isPasswordStrong) {
            setError('Please fix the errors before submitting.');
            return;
        }

        setLoading(true);
        try {
            const { name, email, password, role } = formData;
            await API.post('/auth/register', { name, email, password, role });
            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };
    
    const isFormInvalid = !validation.isEmailValid || !validation.passwordsMatch || !validation.isPasswordStrong;

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Create an Account</h2>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
                <form onSubmit={handleSubmit}>
                    <input name="name" type="text" placeholder="Full Name" onChange={handleChange} required />
                    <input name="email" type="email" placeholder="Email Address" onChange={handleChange} required className={!validation.isEmailValid ? 'input-error' : ''} />
                    {!validation.isEmailValid && <p className="validation-error">Please enter a valid email address.</p>}
                    
                    <input name="password" type="password" placeholder="Password" onChange={handleChange} required className={!validation.isPasswordStrong ? 'input-error' : ''} />
                    {!validation.isPasswordStrong && <p className="validation-error">Password must be 8+ characters with uppercase, lowercase, and a number.</p>}

                    <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} required className={!validation.passwordsMatch ? 'input-error' : ''} />
                    {!validation.passwordsMatch && <p className="validation-error">Passwords do not match.</p>}
                    
                    <select name="role" value={formData.role} onChange={handleChange} required>
                        <option value="farmer">I am a Farmer</option>
                        <option value="buyer">I am a Buyer</option>
                    </select>

                    <button type="submit" disabled={loading || isFormInvalid}>
                        {loading ? 'Registering...' : 'Create Account'}
                    </button>
                </form>
                <p>Already have an account? <Link to="/login">Sign In</Link></p>
            </div>
        </div>
    );
};