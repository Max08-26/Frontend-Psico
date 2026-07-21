import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { ArrowLeft, Moon, Sun, LogOut, HeartPulse, Users, FileText, BellRing, ShieldAlert } from 'lucide-react';
import Logo from '../../components/common/Logo';

const FamilyDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, token } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [assignment, setAssignment] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/familiares/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'No se pudo cargar el panel familiar');
        }
        setAssignment(data.assignment || null);
        setDashboard(data.dashboard || null);
      } catch (err) {
        setError(err.message || 'Error al cargar el panel familiar');
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchDashboard();
  }, [token]);

  const patient = assignment?.Paciente || assignment?.paciente || null;
  const patientUser = patient?.Usuario || patient?.usuario || null;
  const professionalUser = dashboard?.professional?.Usuario || dashboard?.professional?.usuario || null;
  const summary = dashboard?.summary || {};
  const emotionSummary = dashboard?.emotionSummary || {};
  const recentEmergencies = dashboard?.recent?.emergencies || [];
  const emotionLabels = {
    alegria: 'Alegría',
    joy: 'Alegría',
    tristeza: 'Tristeza',
    sadness: 'Tristeza',
    enojo: 'Enojo',
    anger: 'Enojo',
    miedo: 'Miedo',
    fear: 'Miedo',
    afraid: 'Miedo',
    ansiedad: 'Ansiedad',
    anxiety: 'Ansiedad',
    calma: 'Calma',
    calm: 'Calma',
    estres: 'Estrés',
    estrés: 'Estrés',
    stress: 'Estrés',
    frustracion: 'Frustración',
    frustración: 'Frustración',
    frustration: 'Frustración',
    culpa: 'Culpa',
    guilt: 'Culpa',
  };
  const supportChain = [
    {
      title: 'Familiar',
      value: user?.nombreCompleto || 'Familiar',
      detail: user?.email || '',
      icon: Users,
      color: 'bg-amber-500',
    },
    {
      title: 'Paciente',
      value: patientUser?.nombreCompleto || 'Sin paciente',
      detail: patientUser?.email || '',
      icon: ShieldAlert,
      color: 'bg-blue-500',
    },
  ];

  return (
    <div className={`min-h-screen p-4 transition-colors duration-300 ${
      isDark
        ? 'bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800'
        : 'bg-gradient-to-br from-blue-50 via-white to-blue-50'
    }`}>
      <div className="max-w-7xl mx-auto">
        <div className={`flex items-center justify-between mb-8 rounded-lg p-4 shadow-lg transition-colors duration-300 ${
          isDark ? 'bg-gray-700/60' : 'bg-white/80'
        }`}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/familiar/tlp-info')}
              className={`p-2 rounded-lg transition-colors duration-300 ${
                isDark ? 'text-white hover:text-primary' : 'text-gray-700 hover:text-primary'
              }`}
              title="Ver información sobre TLP"
            >
              <ArrowLeft size={28} />
            </button>
            <Logo className="w-14 h-14" />
            <div>
              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                RED DE APOYO
              </h1>
              <p className={isDark ? 'text-gray-200' : 'text-gray-600'}>
                Supervisión del paciente asignado
              </p>
            </div>
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
                isDark ? 'text-white hover:text-red-400' : 'text-gray-700 hover:text-red-600'
              }`}
              title="Cerrar sesión"
            >
              <LogOut size={24} />
            </button>
          </div>
        </div>

        <div className={`rounded-3xl p-6 mb-6 shadow-xl transition-colors duration-300 ${
          isDark ? 'bg-primary text-white' : 'bg-primary/10 text-gray-800 border-2 border-primary'
        }`}>
          <h2 className="text-3xl font-bold mb-2">
            Bienvenido, {user?.nombreCompleto?.split(' ')[0]?.toUpperCase() || 'FAMILIAR'}
          </h2>
          <p className="text-lg opacity-90">
            Aquí puedes monitorear únicamente al paciente que tienes asignado.
          </p>
        </div>

        {loading ? (
          <div className={`rounded-lg p-8 text-center shadow-lg ${isDark ? 'bg-gray-700 text-white' : 'bg-white text-gray-700'}`}>
            Cargando panel familiar...
          </div>
        ) : error ? (
          <div className={`rounded-lg p-8 shadow-lg ${isDark ? 'bg-red-900/30 text-white' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {error}
          </div>
        ) : !patient ? (
          <div className={`rounded-lg p-8 shadow-lg ${isDark ? 'bg-gray-700 text-white' : 'bg-white text-gray-700'}`}>
            No tienes un paciente asignado todavía. Pide al administrador o al médico que te vincule a un paciente.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {supportChain.map((item) => (
                <div key={item.title} className={`rounded-3xl p-5 shadow-xl ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                  <div className={`w-14 h-14 rounded-2xl ${item.color} text-white flex items-center justify-center mb-4`}>
                    <item.icon size={28} />
                  </div>
                  <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                  <p className="font-semibold">{item.value}</p>
                  <p className={`text-sm mt-1 ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>{item.detail}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
              <div className={`rounded-3xl p-6 shadow-xl ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                <HeartPulse className="text-red-500 mb-3" size={28} />
                <p className="text-sm text-gray-500">Actividades completadas</p>
                <p className="text-3xl font-bold">{summary.completedActivities || 0}/{summary.totalActivities || 0}</p>
              </div>
              <div className={`rounded-3xl p-6 shadow-xl ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                <BellRing className="text-amber-500 mb-3" size={28} />
                <p className="text-sm text-gray-500">Emergencias del mes</p>
                <p className="text-3xl font-bold">{summary.emergenciesCount || 0}</p>
              </div>
              <div className={`rounded-3xl p-6 shadow-xl ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                <FileText className="text-blue-500 mb-3" size={28} />
                <p className="text-sm text-gray-500">Registros de emociones</p>
                <p className="text-3xl font-bold">{summary.emotionsCount || 0}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className={`rounded-3xl p-6 shadow-xl ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                <h3 className="text-xl font-bold mb-4">Paciente asignado</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-semibold">Nombre:</span> {patientUser?.nombreCompleto || 'N/D'}</p>
                  <p><span className="font-semibold">Correo:</span> {patientUser?.email || 'N/D'}</p>
                  <p><span className="font-semibold">Teléfono:</span> {patientUser?.telefono || patientUser?.telefono || 'N/D'}</p>
                  <p><span className="font-semibold">Contacto de emergencia:</span> {patient?.contacto_emergencia || 'N/D'}</p>
                  <p><span className="font-semibold">Nombre contacto:</span> {patient?.nombre_contacto_emergencia || 'N/D'}</p>
                  <p><span className="font-semibold">Peso actual:</span> {patient?.peso_actual || 'N/D'}</p>
                  <p><span className="font-semibold">Altura:</span> {patient?.altura || 'N/D'}</p>
                </div>
                <button
                  onClick={() => navigate('/familiar/tlp-info')}
                  className="mt-5 inline-flex items-center justify-center gap-2 bg-primary text-white px-4 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors"
                >
                  Ver información TLP
                </button>
              </div>

              <div className={`rounded-3xl p-6 shadow-xl ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                <h3 className="text-xl font-bold mb-4">Resumen de emociones</h3>
                <div className="space-y-3">
                  {Object.keys(emotionSummary).length === 0 ? (
                    <p className="text-sm text-gray-500">Sin registros este mes.</p>
                  ) : Object.entries(emotionSummary).map(([emotion, count]) => {
                    const normalizedEmotion = String(emotion).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                    const label = emotionLabels[normalizedEmotion] || emotion;

                    return (
                      <div key={emotion} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-3">
                        <span className="font-medium">{label}</span>
                        <span className="font-bold text-primary">{count}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6">
                  <h4 className="font-bold mb-3">Emergencias recientes</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {recentEmergencies.length === 0 ? (
                      <p className="text-sm text-gray-500">No hay emergencias recientes.</p>
                    ) : recentEmergencies.map((item) => (
                      <div key={item.id} className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm">
                        <p className="font-semibold text-red-700">{item.tipo_emergencia || 'Emergencia'}</p>
                        <p className="text-gray-600">{item.descripcion || 'Sin descripción'}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FamilyDashboard;

