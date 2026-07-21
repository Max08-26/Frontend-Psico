import { useNavigate, useLocation } from 'react-router-dom';
import PasswordRecovery from './PasswordRecovery';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Logo from '../../components/common/Logo';
import { Moon, Sun } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, userType, user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showReset, setShowReset] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const result = await login({ usernameOrEmail, password });
    if (!result.success) {
      setError(result.error || "Usuario o contraseña incorrectos");
      return;
    }
  };

  const [hasNavigated, setHasNavigated] = useState(false);
  useEffect(() => {
    setHasNavigated(false);
  }, [userType, user]);
  useEffect(() => {
    if (hasNavigated) return;
    if (!userType || !user) return;
    if (location.pathname !== "/") return;
    let target = null;
    const normalizedType = String(userType).toLowerCase();
    if (normalizedType === "admin") target = "/admin/users";
    else if (normalizedType === "healthcare") target = "/healthcare/dashboard";
    else if (normalizedType === "familiar") target = "/familiar/dashboard";
    else if (normalizedType === "patient" || normalizedType === "paciente") target = "/patient/dashboard";
    if (target) {
      setHasNavigated(true);
      navigate(target);
    }
  }, [userType, user, location.pathname, hasNavigated, navigate]);

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
      isDark
        ? 'bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800'
        : 'bg-gradient-to-br from-blue-50 via-white to-blue-50'
    }`}>
      <button
        onClick={toggleTheme}
        className={`absolute top-4 right-4 p-2 rounded-lg transition-all duration-300 ${
          isDark
            ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400'
            : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
        }`}
        title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      >
        {isDark ? <Sun size={24} /> : <Moon size={24} />}
      </button>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Logo className="w-24 h-24 mx-auto mb-4" />
          <h1 className={`text-5xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            BIO<span className="text-primary">PSYCHE</span>
          </h1>
          <div className="relative">
            <svg className="w-full h-8" viewBox="0 0 300 30" fill="none">
              <path d="M0,15 Q75,5 150,15 T300,15" stroke="currentColor" strokeWidth="2" className="text-primary" fill="none"/>
            </svg>
          </div>
        </div>
        {!showReset ? (
          <form onSubmit={handleLogin} className={`rounded-lg shadow-xl p-8 space-y-4 transition-colors duration-300 ${
            isDark
              ? 'bg-white'
              : 'bg-white border-2 border-gray-200'
          }`}>
            <h2 className={`text-2xl font-semibold text-center mb-6 ${isDark ? 'text-gray-800' : 'text-gray-700'}`}>
              Iniciar sesión
            </h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Usuario o correo electrónico"
                value={usernameOrEmail}
                onChange={e => setUsernameOrEmail(e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                  isDark
                    ? 'border-gray-300 focus:border-primary bg-gray-50'
                    : 'border-gray-300 focus:border-primary bg-white'
                }`}
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                  isDark
                    ? 'border-gray-300 focus:border-primary bg-gray-50'
                    : 'border-gray-300 focus:border-primary bg-white'
                }`}
                required
              />
              <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition-colors font-semibold">
                Iniciar sesión
              </button>
              <button
                type="button"
                className="w-full text-primary underline text-sm mt-2"
                onClick={() => setShowReset(true)}
              >
                ¿Olvidaste tu contraseña?
              </button>
              {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            </div>
          </form>
        ) : (
          <PasswordRecovery onDone={() => setShowReset(false)} />
        )}
      </div>
    </div>
  );
};

export default Landing;

