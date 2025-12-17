import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Form = () => {
    const [formData, setFormData] = useState({
        logIn: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('https://hiring-dev.internal.kloudspot.com/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.logIn,
                    password: formData.password
                })
            });

            if (response.status === 200) {
                const data = await response.json();
                console.log("Login Successful!", data);

                if (data.token) {
                    const token = data.token;
                    localStorage.setItem('token', token);
                } else {
                    setError('Login succeeded but no token was returned.');
                }
                navigate('/Dashboard');
            } else if (response.status === 401) {
                setError('Invalid username or password.');
            } else {
                setError('An error occurred. Please try again later.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Connection failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
          
            <div>
                <label
                    htmlFor="logIn"
                    className="block text-[13px] font-medium text-gray-500 mb-1"
                >
                    Log In <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="logIn"
                    name="logIn"
                    value={formData.logIn}
                    onChange={handleChange}
                    placeholder="email"
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded text-sm text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                />
            </div>

          
            <div>
                <label
                    htmlFor="password"
                    className="block text-[13px] font-medium text-gray-500 mb-1"
                >
                    Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••••"
                        required
                        className="w-full px-3 py-2 border border-gray-200 rounded text-sm text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        {showPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

           
            {error && (
                <div className="text-red-500 text-sm mt-1">
                    {error}
                </div>
            )}

            {/* Login Button */}
            <div className="pt-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#009485] hover:bg-[#007f72] text-white font-medium py-2.5 px-4 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </div>
        </form>
    );
}

export default Form;