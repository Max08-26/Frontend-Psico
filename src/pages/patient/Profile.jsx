import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../../components/common/Logo';
import React from 'react';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [paciente, setPaciente] = React.useState(null);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const token = localStorage.getItem('biopsyche_token');
    const usuarioId = user?.id || localStorage.getItem('biopsyche_user_id');
    if (!usuarioId || !token) return;

    fetch(`/api/pacientes/usuario/${usuarioId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(async res => {
        if (!res.ok) {
          setError('No se pudo cargar el perfil del paciente');
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data) setPaciente(data);
      })
      .catch(() => setError('Error al cargar perfil'));
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/patient/dashboard')}
            className="text-white hover:text-primary transition-colors"
          >
            <ArrowLeft size={32} />
          </button>
          <Logo className="w-12 h-12" />
          <h1 className="text-white text-3xl font-bold">PERFIL</h1>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Información Personal
            </h2>
            <button className="text-primary hover:text-primary-dark transition-colors">
              <Edit2 size={24} />
            </button>
          </div>

          {error && <div className="text-red-600 mb-4">{error}</div>}
          {paciente && user ? (
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-3">
                <label className="text-sm text-gray-600 font-semibold">Nombre Completo</label>
                <p className="text-lg text-gray-800">{user.nombreCompleto || 'No especificado'}</p>
              </div>
              {(paciente.edad || user.edad) && (
                <div className="border-b border-gray-200 pb-3">
                  <label className="text-sm text-gray-600 font-semibold">Edad</label>
                  <p className="text-lg text-gray-800">{paciente.edad || user.edad} años</p>
                </div>
              )}
              {(paciente.celular_tutor || paciente.telefono || user.telefono) && (
                <div className="border-b border-gray-200 pb-3">
                  <label className="text-sm text-gray-600 font-semibold">Número Telefónico</label>
                  <p className="text-lg text-gray-800">{paciente.celular_tutor || paciente.telefono || user.telefono}</p>
                </div>
              )}
              <div className="border-b border-gray-200 pb-3">
                <label className="text-sm text-gray-600 font-semibold">Correo Electrónico</label>
                <p className="text-lg text-gray-800">{user.email || 'No especificado'}</p>
              </div>
              {paciente.direccion && (
                <div className="border-b border-gray-200 pb-3">
                  <label className="text-sm text-gray-600 font-semibold">Dirección de Vivienda</label>
                  <p className="text-lg text-gray-800">{paciente.direccion}</p>
                </div>
              )}
              {(paciente.peso_actual || paciente.altura) && (
                <div className="border-b border-gray-200 pb-3">
                  <label className="text-sm text-gray-600 font-semibold">Datos Físicos</label>
                  <div className="flex gap-4">
                    {paciente.peso_actual && (
                      <p className="text-lg text-gray-800">Peso: {paciente.peso_actual} kg</p>
                    )}
                    {paciente.altura && (
                      <p className="text-lg text-gray-800">Altura: {paciente.altura} m</p>
                    )}
                  </div>
                </div>
              )}
              {paciente.nombre_tutor && (
                <div className="border-b border-gray-200 pb-3">
                  <label className="text-sm text-gray-600 font-semibold">Tutor</label>
                  <p className="text-lg text-gray-800">{paciente.nombre_tutor}</p>
                  {paciente.celular_tutor && (
                    <p className="text-sm text-gray-600">Tel: {paciente.celular_tutor}</p>
                  )}
                </div>
              )}
              {(paciente.nombre_contacto_emergencia || paciente.contacto_emergencia) && (
                <div className="border-b border-gray-200 pb-3">
                  <label className="text-sm text-gray-600 font-semibold">Contacto de Emergencia</label>
                  {paciente.nombre_contacto_emergencia && (
                    <p className="text-lg text-gray-800">{paciente.nombre_contacto_emergencia}</p>
                  )}
                  {paciente.contacto_emergencia && (
                    <p className="text-sm text-gray-600">Tel: {paciente.contacto_emergencia}</p>
                  )}
                </div>
              )}
              {paciente.psicologo_tratante && (
                <div className="border-b border-gray-200 pb-3">
                  <label className="text-sm text-gray-600 font-semibold">Psicólogo Tratante</label>
                  <p className="text-lg text-gray-800">{paciente.psicologo_tratante}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-600">Cargando datos del paciente...</div>
          )}

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              Si necesitas actualizar tu información, contacta a tu médico o administrador.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

