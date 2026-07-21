import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Smile, Frown, Meh, HeartCrack, Angry, Zap, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import Logo from '../../components/common/Logo';
import React from 'react';
const Emotions = () => {
  const navigate = useNavigate();
  const [todayEmotions, setTodayEmotions] = useState({
    morning: null,
    afternoon: null,
    night: null,
  });
  const user = JSON.parse(localStorage.getItem('biopsyche_user') || '{}');
  const [pacienteId, setPacienteId] = useState(null);
  const token = localStorage.getItem('biopsyche_token');
  React.useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/pacientes/usuario/${user.id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.id) setPacienteId(data.id);
      });
  }, [user, token]);

  const emotions = [
    { id: 'happy', label: 'Feliz', icon: Smile, color: 'bg-yellow-400' },
    { id: 'sad', label: 'Triste', icon: Frown, color: 'bg-blue-400' },
    { id: 'angry', label: 'Enojado', icon: Angry, color: 'bg-red-400' },
    { id: 'anxious', label: 'Ansioso', icon: Zap, color: 'bg-purple-400' },
    { id: 'neutral', label: 'Neutral', icon: Meh, color: 'bg-gray-400' },
    { id: 'hurt', label: 'Herido', icon: HeartCrack, color: 'bg-pink-400' },
    { id: 'afraid', label: 'Miedo', icon: AlertCircle, color: 'bg-orange-400' },
  ];

  const times = [
    { key: 'morning', label: 'Mañana', time: '6:00 - 12:00' },
    { key: 'afternoon', label: 'Tarde', time: '12:00 - 18:00' },
    { key: 'night', label: 'Noche', time: '18:00 - 24:00' },
  ];

  const handleEmotionSelect = (timeKey, emotionId) => {
    setTodayEmotions({ ...todayEmotions, [timeKey]: emotionId });
  };

  const handleSave = () => {
    if (!pacienteId) {
      Swal.fire({
        title: 'Error',
        text: 'No se encontró el paciente para este usuario',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#FF6B6B',
      });
      return;
    }
    const fecha = new Date().toISOString().slice(0, 10);
    const emocionesPayload = [
      { emocion: todayEmotions.morning },
      { emocion: todayEmotions.afternoon },
      { emocion: todayEmotions.night }
    ];
    Promise.all(
      emocionesPayload.map(e =>
        fetch('/api/emociones', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            paciente_id: pacienteId,
            emocion: e.emocion,
            fecha,
            comentario: ''
          })
        })
      )
    )
      .then(resArr => Promise.all(resArr.map(res => {
        if (!res.ok) throw new Error('Error al guardar emociones');
        return res.json();
      })))
      .then(() => {
        Swal.fire({
          title: '¡Guardado!',
          text: 'Emociones del día guardadas correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#4A90E2',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/patient/dashboard');
          }
        });
      })
      .catch(() => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron guardar las emociones',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#FF6B6B',
        });
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/patient/dashboard')}
            className="text-white hover:text-primary transition-colors"
          >
            <ArrowLeft size={32} />
          </button>
          <Logo className="w-12 h-12" />
          <h1 className="text-white text-3xl font-bold">EMOCIONES DEL DÍA</h1>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
            ¿Cómo te has sentido hoy?
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Marca las emociones que has experimentado en cada momento del día
          </p>

          <div className="space-y-8">
            {times.map((time) => (
              <div key={time.key} className="border-2 border-gray-200 rounded-lg p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">{time.label}</h3>
                  <p className="text-sm text-gray-600">{time.time}</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {emotions.map((emotion) => {
                    const Icon = emotion.icon;
                    const isSelected = todayEmotions[time.key] === emotion.id;

                    return (
                      <button
                        key={emotion.id}
                        onClick={() => handleEmotionSelect(time.key, emotion.id)}
                        className={`${emotion.color} ${
                          isSelected ? 'ring-4 ring-primary scale-105' : 'opacity-70'
                        } rounded-xl p-4 hover:opacity-100 transition-all duration-200 flex flex-col items-center gap-2`}
                      >
                        <Icon size={40} className="text-white" />
                        <span className="text-white font-semibold">{emotion.label}</span>
                      </button>
                    );
                  })}
                </div>

                {todayEmotions[time.key] && (
                  <div className="mt-4 p-3 bg-green-100 rounded-lg text-center">
                    <span className="text-green-800 font-semibold">
                      ✓ Emoción registrada
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleSave}
            disabled={!todayEmotions.morning || !todayEmotions.afternoon || !todayEmotions.night}
            className={`w-full mt-8 py-4 rounded-lg font-semibold text-lg transition-colors ${
              todayEmotions.morning && todayEmotions.afternoon && todayEmotions.night
                ? 'bg-primary text-white hover:bg-primary-dark'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Guardar Emociones del Día
          </button>

          {(!todayEmotions.morning || !todayEmotions.afternoon || !todayEmotions.night) && (
            <p className="text-center text-sm text-gray-500 mt-2">
              Selecciona una emoción para cada momento del día
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Emotions;

