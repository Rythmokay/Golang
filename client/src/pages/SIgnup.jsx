import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signupError, setSignupError] = useState('');
  const navigate = useNavigate(); // For redirecting after successful signup

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
    if (signupError) setSignupError('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Required';
    if (!formData.email) newErrors.email = 'Required';
    if (!formData.password) newErrors.password = 'Required';
    else if (formData.password.length < 6) newErrors.password = 'Min 6 characters';
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
      // Send signup request to backend (assuming backend is running on localhost:8080)
      const response = await axios.post('http://localhost:8080/signup', formData);

      // If signup is successful, redirect to login page
      console.log('Signup successful:', response.data);
      
      // Redirect user to the login page
      navigate('/login');
    } catch (error) {
      setSignupError('Signup failed. Please try again.');
      console.error('Signup error:', error);
    } finally {
      setLoading(false); // Hide loading spinner after request completes
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
          <h1 className="mb-6 text-2xl font-medium text-center text-gray-800">Create account</h1>

          {/* Display error if signup fails */}
          {signupError && <div className="text-red-500 text-center mb-4">{signupError}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                name="name"
                placeholder="Full name"
                className="w-full px-3 py-2 text-sm bg-gray-50 border-b border-gray-300 focus:border-red-400 focus:outline-none"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

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
                  placeholder="Password (min 6 characters)"
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
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-xs text-gray-600 hover:text-red-400">
              Already have an account? Login
            </Link>
          </div>
        </div>
      </main>

    </div>
  );
}

export default Signup;
