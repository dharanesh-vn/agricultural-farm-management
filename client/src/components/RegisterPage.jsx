import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/api'; // Import the centralized API helper
import '../styles/Auth.css'; // Import the dedicated CSS for authentication pages

export const RegisterPage = () => {
    // State to hold all form data in one object
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'farmer', // Default role for new sign-ups
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // A single handler to update the form data state
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // --- Client-side Validation ---
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            const { name, email, password, role } = formData;
            // Call the real backend registration endpoint
            await API.post('/auth/register', { name, email, password, role });

            setSuccess('Registration successful! Redirecting to login...');

            // Redirect to the login page after a short delay
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            // Display the specific error message from the backend (e.g., "User already exists")
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Create an Account</h2>
                
                {/* Display Success or Error Messages */}
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}

                <form onSubmit={handleSubmit}>
                    <input
                        name="name"
                        type="text"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                    <input
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                    <input
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                    
                    {/* Role Selection Dropdown */}
                    <select name="role" value={formData.role} onChange={handleChange} disabled={loading} required>
                        <option value="farmer">I am a Farmer</option>
                        <option value="buyer">I am a Buyer</option>
                    </select>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>
                
                <p>
                    Already have an account? <Link to="/login">Sign In</Link>
                </p>
            </div>
        </div>
    );
};