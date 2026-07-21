import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../../components/common/Logo';

const HealthcareProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/healthcare/dashboard')}
            className="text-white hover:text-primary transition-colors"
          >
            <ArrowLeft size={32} />
          </button>
          <Logo className="w-12 h-12" />
          <h1 className="text-white text-3xl font-bold">PERFIL PROFESIONAL</h1>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Información Profesional
          </h2>

          <div className="space-y-4">
            {user?.nombreCompleto && (
              <div className="border-b border-gray-200 pb-3">
                <label className="text-sm text-gray-600 font-semibold">Nombre Completo</label>
                <p className="text-lg text-gray-800">{user.nombreCompleto}</p>
              </div>
            )}
            {user?.edad && (
              <div className="border-b border-gray-200 pb-3">
                <label className="text-sm text-gray-600 font-semibold">Edad</label>
                <p className="text-lg text-gray-800">{user.edad} años</p>
              </div>
            )}
            {user?.telefono && (
              <div className="border-b border-gray-200 pb-3">
                <label className="text-sm text-gray-600 font-semibold">Número Telefónico</label>
                <p className="text-lg text-gray-800">{user.telefono}</p>
              </div>
            )}
            {user?.email && (
              <div className="border-b border-gray-200 pb-3">
                <label className="text-sm text-gray-600 font-semibold">Correo Electrónico</label>
                <p className="text-lg text-gray-800">{user.email}</p>
              </div>
            )}
            {user?.username && (
              <div className="border-b border-gray-200 pb-3">
                <label className="text-sm text-gray-600 font-semibold">Nombre de Usuario</label>
                <p className="text-lg text-gray-800">{user.username}</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default HealthcareProfile;

