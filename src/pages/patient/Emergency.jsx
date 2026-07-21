import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, AlertTriangle } from 'lucide-react';
import Logo from '../../components/common/Logo';

const Emergency = () => {
  const navigate = useNavigate();
  const [emailSent, setEmailSent] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(0);

  const calmingActivities = [
    {
      title: 'Respiración Profunda',
      description: 'Inhala profundamente por 4 segundos, mantén por 4 segundos, exhala por 4 segundos.',
      duration: '2 minutos',
    },
    {
      title: 'Técnica 5-4-3-2-1',
      description: 'Identifica: 5 cosas que puedes ver, 4 que puedes tocar, 3 que puedes escuchar, 2 que puedes oler, 1 que puedes saborear.',
      duration: '3 minutos',
    },
    {
      title: 'Grounding (Anclaje)',
      description: 'Presiona tus pies firmemente contra el suelo. Siente el contacto. Nombra 5 objetos a tu alrededor.',
      duration: '2 minutos',
    },
    {
      title: 'Música Relajante',
      description: 'Escucha música calmada con auriculares. Enfócate solo en los sonidos.',
      duration: '5 minutos',
    },
    {
      title: 'Contacto con Agua Fría',
      description: 'Lava tu cara con agua fría o sostén hielo en tus manos. Esto activa el nervio vago.',
      duration: '1 minuto',
    },
  ];

  const handleEmergencyCall = async () => {
    const token = localStorage.getItem('biopsyche_token');
    const pacienteId = localStorage.getItem('biopsyche_paciente_id');
    const nombre = localStorage.getItem('biopsyche_nombre') || 'Paciente';
    const telefono = localStorage.getItem('biopsyche_telefono') || '';
    const body = {
      paciente_id: pacienteId,
      tipo_emergencia: 'alerta',
      descripcion: `Emergencia reportada por paciente.\nNombre: ${nombre}\nTeléfono: ${telefono}\nFecha: ${new Date().toLocaleString('es-MX')}`,
      estado: 'pendiente',
      fecha_emergencia: new Date().toISOString(),
    };
    try {
      const res = await fetch('/api/emergencias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        alert('No se pudo registrar la emergencia.');
        return;
      }
      setEmailSent(true);
    } catch (err) {
      alert('Error al registrar emergencia.');
    }
  };

  if (!emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-700 to-red-800 p-4 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="text-center mb-6">
              <AlertTriangle size={80} className="text-red-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                BOTÓN DE EMERGENCIA
              </h1>
              <p className="text-gray-600">
                Estás a punto de enviar una alerta de emergencia a tu médico
              </p>
            </div>

            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-red-800 mb-3">
                Al presionar este botón:
              </h2>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <Mail className="text-red-600 mt-1 flex-shrink-0" size={20} />
                  <span>Se enviará un correo urgente a tu psicólogo/psiquiatra</span>
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="text-red-600 mt-1 flex-shrink-0" size={20} />
                  <span>El correo incluirá tu nombre y número telefónico</span>
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="text-red-600 mt-1 flex-shrink-0" size={20} />
                  <span>Te mostraremos actividades para ayudarte a calmarte mientras esperas</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleEmergencyCall}
                className="w-full bg-red-600 text-white py-4 rounded-lg hover:bg-red-700 transition-colors font-bold text-lg"
              >
                ENVIAR ALERTA DE EMERGENCIA
              </button>
              <button
                onClick={() => navigate('/patient/dashboard')}
                className="w-full bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
              >
                Cancelar y Volver
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/patient/dashboard')}
            className="text-white hover:text-primary transition-colors"
          >
            <ArrowLeft size={32} />
          </button>
          <Logo className="w-12 h-12" />
          <h1 className="text-white text-3xl font-bold">ACTIVIDADES DE CALMA</h1>
        </div>

        <div className="bg-green-100 border-2 border-green-400 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Mail className="text-green-700" size={32} />
            <h2 className="text-2xl font-bold text-green-800">
              Alerta Enviada Correctamente
            </h2>
          </div>
          <p className="text-green-700">
            Tu psicólogo/psiquiatra recibirá tu alerta y te contactará pronto.
            Mientras tanto, te recomendamos realizar estas actividades para calmarte.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Actividades para Regularte Emocionalmente
          </h2>

          <div className="mb-6">
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {calmingActivities.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentActivity(index)}
                  className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                    currentActivity === index
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Actividad {index + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="border-2 border-primary rounded-lg p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-gray-800">
                {calmingActivities[currentActivity].title}
              </h3>
              <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                {calmingActivities[currentActivity].duration}
              </span>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">
              {calmingActivities[currentActivity].description}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setCurrentActivity((currentActivity - 1 + calmingActivities.length) % calmingActivities.length)}
              className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
            >
              ← Anterior
            </button>
            <button
              onClick={() => setCurrentActivity((currentActivity + 1) % calmingActivities.length)}
              className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition-colors font-semibold"
            >
              Siguiente →
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg text-center">
            <p className="text-blue-800">
              💙 Recuerda: Estás seguro/a. La ayuda está en camino.
              Enfócate en respirar y realizar estas actividades.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Emergency;

