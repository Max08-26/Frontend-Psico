import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import Logo from "../../components/common/Logo";
import { LogOut, Settings, Moon, Sun } from "lucide-react";

export default function AdminDashboard() {
  const { isDark, toggleTheme } = useTheme();
  const { logout } = useAuth();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark
        ? 'bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800'
        : 'bg-gradient-to-br from-blue-50 via-white to-blue-50'
    }`}>
      <div className="max-w-4xl mx-auto p-4">

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

        <div className={`rounded-lg p-8 mb-12 text-center shadow-lg transition-colors duration-300 ${
          isDark
            ? 'bg-primary text-white'
            : 'bg-primary/10 text-gray-800 border-2 border-primary'
        }`}>
          <h2 className="text-4xl font-bold mb-2">Panel de Administración</h2>
          <p className={`text-lg ${isDark ? 'text-white/80' : 'text-gray-600'}`}>
            Gestiona todos los aspectos del sistema
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/admin/users"
            className={`p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-4 ${
              isDark
                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
                : 'bg-gradient-to-br from-blue-100 to-blue-200 text-gray-800 hover:from-blue-200 hover:to-blue-300'
            }`}
          >
            <Settings size={32} />
            <div className="text-left">
              <h3 className="text-xl font-bold">Gestión de Usuarios</h3>
              <p className={`text-sm ${isDark ? 'text-blue-100' : 'text-gray-700'}`}>
                Crear, editar y eliminar usuarios
              </p>
            </div>
          </Link>

          <Link
            to="/admin/maintenance"
            className={`p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-4 ${
              isDark
                ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700'
                : 'bg-gradient-to-br from-purple-100 to-purple-200 text-gray-800 hover:from-purple-200 hover:to-purple-300'
            }`}
          >
            <Settings size={32} />
            <div className="text-left">
              <h3 className="text-xl font-bold">Mantenimiento</h3>
              <p className={`text-sm ${isDark ? 'text-purple-100' : 'text-gray-700'}`}>
                Tareas de mantenimiento del sistema
              </p>
            </div>
          </Link>

          <Link
            to="/admin/updates"
            className={`p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-4 ${
              isDark
                ? 'bg-gradient-to-br from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                : 'bg-gradient-to-br from-green-100 to-green-200 text-gray-800 hover:from-green-200 hover:to-green-300'
            }`}
          >
            <Settings size={32} />
            <div className="text-left">
              <h3 className="text-xl font-bold">Actualizaciones</h3>
              <p className={`text-sm ${isDark ? 'text-green-100' : 'text-gray-700'}`}>
                Gestiona versiones y actualizaciones
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

