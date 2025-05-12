import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
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
    if (!formData.role) newErrors.role = 'Please select a role';
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
      // Send signup request to backend
      const response = await fetch('http://localhost:8081/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user data in localStorage
        localStorage.setItem('token', 'dummy-token'); // We'll implement proper tokens later
        localStorage.setItem('userId', data.id);
        localStorage.setItem('username', data.name);
        localStorage.setItem('role', data.role);

        // Trigger storage event to update header
        window.dispatchEvent(new Event('storage'));

        // Navigate to appropriate page based on role
        if (data.role === 'seller') {
          navigate('/seller/products');
        } else {
          navigate('/');
        }
      } else {
        // Server returned an error
        setSignupError(data.error || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setSignupError('Cannot connect to server. Please try again later.');
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

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">I want to</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className={`p-4 border rounded-lg text-center ${formData.role === 'customer' 
                    ? 'border-red-500 bg-red-50 text-red-700' 
                    : 'border-gray-300 hover:border-red-500 hover:bg-red-50'}`}
                  onClick={() => {
                    setFormData({ ...formData, role: 'customer' });
                    if (errors.role) setErrors({ ...errors, role: '' });
                  }}
                >
                  <div className="font-medium">Shop Products</div>
                  <div className="text-sm text-gray-500">Register as Customer</div>
                </button>
                <button
                  type="button"
                  className={`p-4 border rounded-lg text-center ${formData.role === 'seller' 
                    ? 'border-red-500 bg-red-50 text-red-700' 
                    : 'border-gray-300 hover:border-red-500 hover:bg-red-50'}`}
                  onClick={() => {
                    setFormData({ ...formData, role: 'seller' });
                    if (errors.role) setErrors({ ...errors, role: '' });
                  }}
                >
                  <div className="font-medium">Sell Products</div>
                  <div className="text-sm text-gray-500">Register as Seller</div>
                </button>
              </div>
              {errors.role && <p className="mt-1 text-xs text-red-500">{errors.role}</p>}
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
