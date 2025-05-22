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
      console.log('Signup form data:', formData);
      
      // Send signup request to backend
      console.log('Sending signup request to backend...');
      
      // Use a timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch('http://localhost:8081/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      const data = await response.json();
      
      // Check if the request was successful
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
          console.log('Seller signup detected, redirecting to product management');
          navigate('/seller/products');
        } else {
          console.log('Customer signup detected, redirecting to home');
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-50 via-purple-50 to-white">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
        
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(15px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          0% { transform: translateY(15px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes gentle-pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 rgba(124, 58, 237, 0); }
          50% { transform: scale(1.02); box-shadow: 0 0 8px rgba(124, 58, 237, 0.2); }
          100% { transform: scale(1); box-shadow: 0 0 0 rgba(124, 58, 237, 0); }
        }
        .signup-card {
          animation: fadeIn 0.6s ease-out;
          box-shadow: 0 10px 25px rgba(124, 58, 237, 0.08);
          font-family: 'Poppins', sans-serif;
        }
        .signup-input {
          transition: all 0.3s ease;
          font-family: 'Poppins', sans-serif;
          font-weight: 300;
        }
        .signup-input:focus {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.1);
        }
        .role-btn-selected {
          animation: gentle-pulse 2s infinite ease-in-out;
        }
        .signup-button {
          transition: all 0.3s ease;
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
          background-size: 200% 100%;
          animation: shimmer 3s infinite linear;
        }
        .signup-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.2);
        }
        .heading-text {
          background: linear-gradient(90deg, #4f46e5, #7c3aed);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
        }
      `}</style>
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-sm p-6 bg-white border border-purple-100 rounded-2xl signup-card">
          <h1 className="mb-5 text-xl font-semibold text-center heading-text">Create Account</h1>

          {/* Display error if signup fails */}
          {signupError && (
            <div className="mb-5 p-3 bg-red-50 text-red-500 text-sm rounded-xl text-center" 
                 style={{animation: 'slideUp 0.4s ease-out', fontFamily: 'Poppins, sans-serif', fontWeight: 400}}>
              {signupError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-2 text-sm font-medium text-indigo-900" 
                     style={{fontFamily: 'Poppins, sans-serif', animation: 'slideUp 0.3s ease-out'}}>
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                className="w-full px-3 py-2.5 text-sm text-indigo-900 bg-indigo-50 border border-indigo-100 rounded-xl focus:border-purple-300 focus:outline-none signup-input"
                value={formData.name}
                onChange={handleChange}
                style={{animation: 'slideUp 0.3s ease-out'}}
              />
              {errors.name && <p className="mt-2 text-sm text-red-500" style={{fontFamily: 'Poppins, sans-serif'}}>{errors.name}</p>}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-indigo-900" 
                     style={{fontFamily: 'Poppins, sans-serif', animation: 'slideUp 0.4s ease-out'}}>
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                className="w-full px-3 py-2.5 text-sm text-indigo-900 bg-indigo-50 border border-indigo-100 rounded-xl focus:border-purple-300 focus:outline-none signup-input"
                value={formData.email}
                onChange={handleChange}
                style={{animation: 'slideUp 0.4s ease-out'}}
              />
              {errors.email && <p className="mt-2 text-sm text-red-500" style={{fontFamily: 'Poppins, sans-serif'}}>{errors.email}</p>}
            </div>

            <div className="space-y-2" style={{animation: 'slideUp 0.5s ease-out'}}>
              <label className="block mb-2 text-sm font-medium text-indigo-900" style={{fontFamily: 'Poppins, sans-serif'}}>
                I want to
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className={`py-2 border rounded-md text-center transition-all duration-300 ${
                    formData.role === 'customer'
                      ? 'border-indigo-500 bg-white text-indigo-800 font-medium role-btn-selected'
                      : 'border-gray-300 hover:border-indigo-300 bg-white'
                  }`}
                  onClick={() => {
                    setFormData({ ...formData, role: 'customer' });
                    if (errors.role) setErrors({ ...errors, role: '' });
                  }}
                  style={{fontFamily: 'Poppins, sans-serif'}}
                >
                  <div className="text-sm font-medium">Shop</div>
                </button>
                <button
                  type="button"
                  className={`py-2 border rounded-md text-center transition-all duration-300 ${
                    formData.role === 'seller'
                      ? 'border-indigo-500 bg-white text-indigo-800 font-medium role-btn-selected'
                      : 'border-gray-300 hover:border-indigo-300 bg-white'
                  }`}
                  onClick={() => {
                    setFormData({ ...formData, role: 'seller' });
                    if (errors.role) setErrors({ ...errors, role: '' });
                  }}
                  style={{fontFamily: 'Poppins, sans-serif'}}
                >
                  <div className="text-sm font-medium">Sell</div>
                </button>
              </div>
              {errors.role && <p className="mt-2 text-sm text-red-500" style={{fontFamily: 'Poppins, sans-serif'}}>{errors.role}</p>}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-indigo-900" 
                     style={{fontFamily: 'Poppins, sans-serif', animation: 'slideUp 0.6s ease-out'}}>
                Password
              </label>
              <div className="relative" style={{animation: 'slideUp 0.6s ease-out'}}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Min 6 characters"
                  className="w-full px-3 py-2.5 text-sm text-indigo-900 bg-indigo-50 border border-indigo-100 rounded-xl focus:border-purple-300 focus:outline-none pr-10 signup-input"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-400 hover:text-purple-600 transition-colors duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                </button>
              </div>
              {errors.password && <p className="mt-2 text-sm text-red-500" style={{fontFamily: 'Poppins, sans-serif'}}>{errors.password}</p>}
            </div>

            <div className="pt-2" style={{animation: 'slideUp 0.7s ease-out'}}>
              <button
                type="submit"
                className="w-full py-2.5 px-3 text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded-md transition-all duration-300 focus:outline-none signup-button"
                disabled={loading}
                style={{fontFamily: 'Poppins, sans-serif'}}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link 
              to="/login" 
              className="inline-block py-2 px-4 text-sm font-medium text-indigo-600 border border-indigo-300 hover:border-indigo-400 bg-white rounded-md transition-all duration-300" 
              style={{fontFamily: 'Poppins, sans-serif'}}
            >
              Already have an account? <span className="font-medium">Login</span>
            </Link>
          </div>
        </div>
      </main>

    </div>
  );
}

export default Signup;
