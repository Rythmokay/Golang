import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate(); // For redirecting after successful login

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
    if (loginError) setLoginError('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Required';
    if (!formData.password) newErrors.password = 'Required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true); // Show loading spinner or disable submit button during request

    try {
      // Send login request to backend (assuming backend is running on localhost:8080)
      const response = await axios.post('http://localhost:8080/login', formData);

      // Extract token and user data
      const { token, user } = response.data;
      
      // Store token and username in localStorage
      localStorage.setItem('authToken', token);
      
      // Extract username from response or from email if not provided
      const username = user?.name || user?.username || formData.email.split('@')[0];
      localStorage.setItem('username', username);

      // Trigger storage event to update header component
      window.dispatchEvent(new Event('storage'));

      // Redirect user to dashboard or home page
      navigate('/dashboard');
    } catch (error) {
      setLoginError('Invalid email or password');
      console.error('Login error:', error);
    } finally {
      setLoading(false); // Hide loading spinner after request completes
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
          <h1 className="mb-6 text-2xl font-medium text-center text-gray-800">Welcome back</h1>

          {/* Display error if login fails */}
          {loginError && <div className="text-red-500 text-center mb-4">{loginError}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="email"
                name="email"
                placeholder="Email address"
                className="w-full px-3 py-2 text-sm bg-gray-50 border-b border-gray-300 focus:border-red-400 focus:outline-none"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div className="mb-6 relative">
              <div className="flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className="w-full px-3 py-2 text-sm bg-gray-50 border-b border-gray-300 focus:border-red-400 focus:outline-none pr-10"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ?
                    <EyeOffIcon size={16} /> :
                    <EyeIcon size={16} />
                  }
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-2 text-sm font-medium text-white bg-red-400 rounded-md hover:bg-red-500"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/signup" className="text-xs text-gray-600 hover:text-red-400">
              Don't have an account? Sign up
            </Link>
          </div>
        </div>
      </main>

    </div>
  );
}

export default Login;