import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
      console.log('Attempting login with:', formData);
      
      // Send login request to backend
      const response = await fetch('http://localhost:8081/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user data in localStorage
        localStorage.setItem('token', data.token || 'dummy-token'); // Use token from response if available
        localStorage.setItem('userId', data.id);
        localStorage.setItem('username', data.name);
        localStorage.setItem('role', data.role);

        // Trigger storage event to update header
        window.dispatchEvent(new Event('storage'));

        // Navigate to seller products page if user is a seller, otherwise go to home
        if (data.role === 'seller') {
          console.log('Seller login detected, redirecting to product management');
          // Add a small delay to ensure localStorage is updated before navigation
          setTimeout(() => {
            navigate('/seller/products');
          }, 100);
        } else {
          console.log('Customer login detected, redirecting to home');
          navigate('/');
        }
      } else {
        setLoginError(data.error || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Cannot connect to server. Please try again later.');
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
        .login-card {
          animation: fadeIn 0.6s ease-out;
          box-shadow: 0 10px 25px rgba(124, 58, 237, 0.08);
          font-family: 'Poppins', sans-serif;
        }
        .login-input {
          transition: all 0.3s ease;
          font-family: 'Poppins', sans-serif;
          font-weight: 300;
        }
        .login-input:focus {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.1);
        }
        .login-button {
          transition: all 0.3s ease;
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
          background-size: 200% 100%;
          animation: shimmer 3s infinite linear;
        }
        .login-button:hover {
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
        <div className="w-full max-w-sm p-6 bg-white border border-purple-100 rounded-2xl login-card">
          <h1 className="mb-5 text-xl font-semibold text-center heading-text">Welcome Back</h1>

          {/* Display error if login fails */}
          {loginError && (
            <div className="mb-5 p-3 bg-red-50 text-red-500 text-sm rounded-xl text-center" 
                 style={{animation: 'slideUp 0.4s ease-out', fontFamily: 'Poppins, sans-serif', fontWeight: 400}}>
              {loginError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-2 text-sm font-medium text-indigo-900" 
                     style={{fontFamily: 'Poppins, sans-serif', animation: 'slideUp 0.3s ease-out'}}>
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                className="w-full px-3 py-2.5 text-sm text-indigo-900 bg-indigo-50 border border-indigo-100 rounded-xl focus:border-purple-300 focus:outline-none login-input"
                value={formData.email}
                onChange={handleChange}
                style={{animation: 'slideUp 0.4s ease-out'}}
              />
              {errors.email && <p className="mt-2 text-sm text-red-500" style={{fontFamily: 'Poppins, sans-serif'}}>{errors.email}</p>}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-indigo-900" 
                     style={{fontFamily: 'Poppins, sans-serif', animation: 'slideUp 0.4s ease-out'}}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 text-sm text-indigo-900 bg-indigo-50 border border-indigo-100 rounded-xl focus:border-purple-300 focus:outline-none pr-10 login-input"
                  value={formData.password}
                  onChange={handleChange}
                  style={{animation: 'slideUp 0.5s ease-out'}}
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
            
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 px-3 text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded-md transition-all duration-300 focus:outline-none login-button"
                disabled={loading}
                style={{animation: 'slideUp 0.6s ease-out', fontFamily: 'Poppins, sans-serif'}}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center" style={{animation: 'slideUp 0.7s ease-out'}}>
            <Link 
              to="/signup" 
              className="inline-block py-2 px-4 text-sm font-medium text-indigo-600 border border-indigo-300 hover:border-indigo-400 bg-white rounded-md transition-all duration-300" 
              style={{fontFamily: 'Poppins, sans-serif'}}
            >
              Don't have an account? <span className="font-medium">Sign up</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;