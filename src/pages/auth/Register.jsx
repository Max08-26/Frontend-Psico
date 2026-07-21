import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Logo from '../../components/common/Logo';
import { Moon, Sun } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [userType, setUserType] = useState('patient');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    edad: '',
    email: '',
    telefono: '',
    direccion: '',
    username: '',
    password: '',
    cedulaProfesional: '',
    cargoTrabajo: '',
    nombreTutor: '',
    celTutor: '',
    psicologoTratante: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await register(formData, userType);
    if (!result.success) {
      setError(result.error || 'No se pudo completar el registro');
      return;
    }
    if (userType === 'patient') {
      navigate('/patient/dashboard');
    } else {
      navigate('/healthcare/dashboard');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

      <div className="max-w-2xl w-full">
        <div className="text-center mb-6">
          <Logo className="w-20 h-20 mx-auto mb-3" />
          <h1 className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            BIO<span className="text-primary">PSYCHE</span>
          </h1>
        </div>

        <div className={`rounded-lg shadow-xl p-8 transition-colors duration-300 ${
          isDark
            ? 'bg-white'
            : 'bg-white border-2 border-gray-200'
        }`}>
          <h2 className={`text-2xl font-semibold text-center mb-6 ${isDark ? 'text-gray-800' : 'text-gray-700'}`}>
            Registro
          </h2>

          <div className="flex gap-4 mb-6">
            <button
              type="button"
              onClick={() => setUserType('healthcare')}
              className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                userType === 'healthcare'
                  ? 'bg-primary text-white'
                  : isDark
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Personal de salud
            </button>
            <button
              type="button"
              onClick={() => setUserType('patient')}
              className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                userType === 'patient'
                  ? 'bg-primary text-white'
                  : isDark
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Paciente
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="nombreCompleto"
                placeholder="Nombre completo"
                value={formData.nombreCompleto}
                onChange={handleChange}
                className={`col-span-2 px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                  isDark
                    ? 'border-gray-300 focus:border-primary bg-gray-50'
                    : 'border-gray-300 focus:border-primary bg-white'
                }`}
                required
              />

              <input
                type="number"
                name="edad"
                placeholder="Edad"
                value={formData.edad}
                onChange={handleChange}
                className={`px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                  isDark
                    ? 'border-gray-300 focus:border-primary bg-gray-50'
                    : 'border-gray-300 focus:border-primary bg-white'
                }`}
                required
              />

              {userType === 'healthcare' && (
                <input
                  type="text"
                  name="cedulaProfesional"
                  placeholder="Cédula profesional"
                  value={formData.cedulaProfesional}
                  onChange={handleChange}
                  className={`px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                    isDark
                      ? 'border-gray-300 focus:border-primary bg-gray-50'
                      : 'border-gray-300 focus:border-primary bg-white'
                  }`}
                  required
                />
              )}

              {userType === 'patient' && (
                <input
                  type="text"
                  name="direccion"
                  placeholder="Dirección"
                  value={formData.direccion}
                  onChange={handleChange}
                  className={`px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                    isDark
                      ? 'border-gray-300 focus:border-primary bg-gray-50'
                      : 'border-gray-300 focus:border-primary bg-white'
                  }`}
                />
              )}

              <input
                type="tel"
                name="telefono"
                placeholder="Número telefónico"
                value={formData.telefono}
                onChange={handleChange}
                className={`px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                  isDark
                    ? 'border-gray-300 focus:border-primary bg-gray-50'
                    : 'border-gray-300 focus:border-primary bg-white'
                }`}
                required
              />

              {userType === 'healthcare' && (
                <input
                  type="text"
                  name="cargoTrabajo"
                  placeholder="Cargo de trabajo"
                  value={formData.cargoTrabajo}
                  onChange={handleChange}
                  className={`px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                    isDark
                      ? 'border-gray-300 focus:border-primary bg-gray-50'
                      : 'border-gray-300 focus:border-primary bg-white'
                  }`}
                  required
                />
              )}

              {userType === 'patient' && (
                <>
                  <input
                    type="text"
                    name="nombreTutor"
                    placeholder="Nombre de tutor"
                    value={formData.nombreTutor}
                    onChange={handleChange}
                    className={`px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                      isDark
                        ? 'border-gray-300 focus:border-primary bg-gray-50'
                        : 'border-gray-300 focus:border-primary bg-white'
                    }`}
                  />
                  <input
                    type="tel"
                    name="celTutor"
                    placeholder="Cel. tutor"
                    value={formData.celTutor}
                    onChange={handleChange}
                    className={`px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                      isDark
                        ? 'border-gray-300 focus:border-primary bg-gray-50'
                        : 'border-gray-300 focus:border-primary bg-white'
                    }`}
                  />
                  <input
                    type="text"
                    name="psicologoTratante"
                    placeholder="Psicólogo tratante"
                    value={formData.psicologoTratante}
                    onChange={handleChange}
                    className={`px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                      isDark
                        ? 'border-gray-300 focus:border-primary bg-gray-50'
                        : 'border-gray-300 focus:border-primary bg-white'
                    }`}
                  />
                </>
              )}

              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={handleChange}
                className={`col-span-2 px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                  isDark
                    ? 'border-gray-300 focus:border-primary bg-gray-50'
                    : 'border-gray-300 focus:border-primary bg-white'
                }`}
                required
              />

              <input
                type="text"
                name="username"
                placeholder="Nombre de usuario"
                value={formData.username}
                onChange={handleChange}
                className={`px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                  isDark
                    ? 'border-gray-300 focus:border-primary bg-gray-50'
                    : 'border-gray-300 focus:border-primary bg-white'
                }`}
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                className={`px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                  isDark
                    ? 'border-gray-300 focus:border-primary bg-gray-50'
                    : 'border-gray-300 focus:border-primary bg-white'
                }`}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition-colors font-semibold mt-6"
            >
              Registrarse
            </button>

            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          </form>

          <button
            onClick={() => navigate('/')}
            className="w-full text-gray-600 py-2 mt-4 hover:text-gray-800"
          >
            Volver a inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;

