import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Star } from 'lucide-react';
import Swal from 'sweetalert2';
import Logo from '../../components/common/Logo';

const Activities = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = localStorage.getItem('biopsyche_token');
  const [activities, setActivities] = useState([]);
  const [pacienteId, setPacienteId] = useState(null);

  useEffect(() => {
    const fetchPacienteIdAndActivities = async () => {
      if (!user) return;
      try {
        const resPaciente = await fetch(`/api/pacientes/usuario/${user.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!resPaciente.ok) throw new Error('Error al obtener paciente');
        const paciente = await resPaciente.json();
        setPacienteId(paciente.id);
        const res = await fetch(`/api/actividades?paciente_id=${paciente.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al obtener actividades');
        const data = await res.json();
        setActivities(data.map(a => ({
          id: a.id,
          title: a.titulo,
          type: a.tipo,
          description: a.descripcion,
          url: a.url_recurso,
          completed: a.completada,
          rating: a.calificacion || 0,
          comment: a.comentario || '',
        })));
      } catch (err) {
        setActivities([]);
      }
    };
    fetchPacienteIdAndActivities();
  }, [user, token]);

  const [selectedActivity, setSelectedActivity] = useState(null);
  const [file, setFile] = useState(null);
  const [comment, setComment] = useState('');
  const [feelingComment, setFeelingComment] = useState('');
  const [rating, setRating] = useState(0);

  const handleSubmit = (activityId) => {
    fetch(`/api/actividades/${activityId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        comment,
        rating,
        paciente_id: pacienteId,
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          Swal.fire({
            title: 'Error',
            text: data.error,
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
        } else {
          Swal.fire({
            title: '¡Éxito!',
            text: 'Actividad enviada correctamente',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#4A90E2',
          });
          setSelectedActivity(null);
          setFile(null);
          setComment('');
          setFeelingComment('');
          setRating(0);
          if (pacienteId) {
            fetch(`/api/actividades?paciente_id=${pacienteId}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            })
              .then(res => res.json())
              .then(data => {
                setActivities(data.map(a => ({
                  id: a.id,
                  title: a.titulo,
                  type: a.tipo,
                  description: a.descripcion,
                  url: a.url_recurso,
                  completed: a.completada,
                  rating: a.calificacion || 0,
                  comment: a.comentario || '',
                })));
              });
          }
        }
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
          <h1 className="text-white text-3xl font-bold">ACTIVIDADES</h1>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Actividades Asignadas
          </h2>

          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className={`border-2 rounded-lg p-4 ${
                  activity.completed
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 bg-white'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {activity.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-1">{activity.description}</p>
                    {activity.type === 'video' && activity.url && (
                      <div className="mb-1">
                        <span className="font-semibold text-sm">Video:</span>{' '}
                        <a href={activity.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">
                          {activity.url}
                        </a>
                      </div>
                    )}
                    {activity.type === 'reading' && activity.url && (
                      <div className="mb-1">
                        <span className="font-semibold text-sm">Lectura:</span>{' '}
                        <a href={activity.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">
                          {activity.url}
                        </a>
                      </div>
                    )}
                    {activity.instrucciones && (
                      <div className="mb-1">
                        <span className="font-semibold text-sm">Instrucciones:</span>{' '}
                        <span className="text-gray-700">{activity.instrucciones}</span>
                      </div>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      activity.completed
                        ? 'bg-green-500 text-white'
                        : 'bg-yellow-400 text-gray-800'
                    }`}
                  >
                    {activity.completed ? 'Completada' : 'Pendiente'}
                  </span>
                </div>

                {activity.completed ? (
                  <div className="mt-3 p-3 bg-gray-100 rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-sm">Calificación:</span>
                      <div className="flex">
                        {[...Array(10)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={
                              i < activity.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }
                          />
                        ))}
                      </div>
                      <span className="text-sm">{activity.rating}/10</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Comentario:</span> {activity.comment}
                    </p>
                  </div>
                ) : (
                  <>
                    {selectedActivity === activity.id ? (
                      <div className="mt-4 space-y-3">
                        {(activity.type === 'writing' || activity.type === 'drawing') && (
                          <div>
                            <label className="block text-sm font-semibold mb-2">
                              Subir archivo PDF:
                            </label>
                            <input
                              type="file"
                              accept=".pdf"
                              onChange={(e) => setFile(e.target.files[0])}
                              className="w-full p-2 border-2 border-gray-300 rounded"
                            />
                          </div>
                        )}

                        {(activity.type === 'video' || activity.type === 'reading') && (
                          <div>
                            <label className="block text-sm font-semibold mb-2">
                              Comentario sobre {activity.type === 'video' ? 'el video' : 'la lectura'}:
                            </label>
                            <textarea
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              className="w-full p-3 border-2 border-gray-300 rounded h-24"
                              placeholder="Escribe tu comentario..."
                            />
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-semibold mb-2">
                            ¿Cómo te sentiste al realizarla? (1-10):
                          </label>
                          <div className="flex gap-2">
                            {[...Array(10)].map((_, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => setRating(i + 1)}
                                className={`w-10 h-10 rounded-full border-2 transition-colors ${
                                  rating >= i + 1
                                    ? 'bg-primary text-white border-primary'
                                    : 'border-gray-300 hover:border-primary'
                                }`}
                              >
                                {i + 1}
                              </button>
                            ))}
                          </div>
                        </div>

                        <textarea
                          value={feelingComment}
                          onChange={(e) => setFeelingComment(e.target.value)}
                          className="w-full p-3 border-2 border-gray-300 rounded h-20"
                          placeholder="Comenta cómo te sentiste..."
                        />

                        <div className="flex gap-3">
                          <button
                            onClick={() => handleSubmit(activity.id)}
                            className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors font-semibold"
                          >
                            Enviar
                          </button>
                          <button
                            onClick={() => setSelectedActivity(null)}
                            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedActivity(activity.id)}
                        className="mt-3 w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors font-semibold flex items-center justify-center gap-2"
                      >
                        <Upload size={20} />
                        Completar Actividad
                      </button>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activities;

