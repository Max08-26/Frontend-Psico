import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { ClipboardList, Users, User, BarChart3, MessageSquare, LogOut, Calendar, Edit, Moon, Sun } from 'lucide-react';
import Logo from '../../components/common/Logo';

const HealthcareDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const menuItems = [
    {
      id: 'assign-activities',
      title: 'ASIGNAR ACTIVIDADES',
      icon: ClipboardList,
      color: 'bg-accent-yellow',
      path: '/healthcare/assign-activities'
    },
    {
      id: 'manage-activities',
      title: 'GESTIONAR\nACTIVIDADES',
      icon: Edit,
      color: 'bg-accent-purple',
      path: '/healthcare/manage-activities'
    },
    {
      id: 'patient-list',
      title: 'LISTA DE PACIENTES',
      icon: Users,
      color: 'bg-accent-orange',
      path: '/healthcare/patients'
    },
    {
      id: 'appointments',
      title: 'CALENDARIO\nDE CITAS',
      icon: Calendar,
      color: 'bg-accent-pink',
      path: '/healthcare/appointments'
    },
    {
      id: 'profile',
      title: 'PERFIL',
      icon: User,
      color: 'bg-accent-gray',
      path: '/healthcare/profile'
    },
    {
      id: 'dashboards',
      title: 'DASHBOARDS\nMENSUALES',
      icon: BarChart3,
      color: 'bg-accent-green',
      path: '/healthcare/dashboards'
    },
    {
      id: 'ratings',
      title: 'CALIFICACIONES\nY COMENTARIOS',
      icon: MessageSquare,
      color: 'bg-accent-cyan',
      path: '/healthcare/ratings'
    },
  ];

  return (
    <div className={`min-h-screen p-4 transition-colors duration-300 ${
      isDark
        ? 'bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800'
        : 'bg-gradient-to-br from-blue-50 via-white to-blue-50'
    }`}>
      <div className="max-w-4xl mx-auto">
        <div className={`flex items-center justify-between mb-8 rounded-lg p-4 transition-colors duration-300 ${
          isDark
            ? 'bg-gray-700/50'
            : 'bg-white/50'
        }`}>
          <div className="flex items-center gap-4">
            <Logo className="w-16 h-16" />
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              BIO<span className="text-primary">PSYCHE</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isDark
                  ? 'bg-gray-600 hover:bg-gray-500 text-yellow-400'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
              }`}
              title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {isDark ? <Sun size={24} /> : <Moon size={24} />}
            </button>
            <button
              onClick={logout}
              className={`p-2 rounded-lg transition-colors duration-300 ${
                isDark
                  ? 'text-white hover:text-red-400'
                  : 'text-gray-700 hover:text-red-600'
              }`}
              title="Cerrar sesión"
            >
              <LogOut size={24} />
            </button>
          </div>
        </div>

        <div className={`rounded-lg p-6 mb-8 text-center shadow-lg transition-colors duration-300 ${
          isDark
            ? 'bg-primary text-white'
            : 'bg-primary/10 text-gray-800 border-2 border-primary'
        }`}>
          <h2 className="text-3xl font-bold">
            BIENVENIDO DR {user?.nombreCompleto?.split(' ')[0]?.toUpperCase() || 'USUARIO'}
          </h2>
          <div className="mt-2">
            <svg className="w-full h-6" viewBox="0 0 400 20" fill="none">
              <path d="M0,10 Q100,0 200,10 T400,10" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`${item.color} rounded-3xl p-6 shadow-lg hover:scale-105 transition-all duration-200 flex flex-col items-center justify-center min-h-[160px] text-gray-800 font-bold`}
            >
              <item.icon size={48} className="mb-3" />
              <span className="text-sm-3" />
              <span className="text-sm font-bold text-center whitespace-pre-line">
                {item.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HealthcareDashboard;

