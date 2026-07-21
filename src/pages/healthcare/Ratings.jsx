import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';
import Logo from '../../components/common/Logo';

const Ratings = () => {
  const navigate = useNavigate();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients, setPatients] = useState([]);
  const token = localStorage.getItem('biopsyche_token');

  React.useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch('/api/pacientes', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al obtener pacientes');
        const data = await res.json();
        const pacientesConActividades = await Promise.all(
          data.map(async (p) => {
            const actividadesRes = await fetch(`/api/actividades?paciente_id=${p.id}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            let actividades = [];
            if (actividadesRes.ok) {
              const acts = await actividadesRes.json();
              actividades = acts
                .map(a => ({
                  id: a.id,
                  title: a.titulo,
                  completed: a.completada === true || a.completada === 1,
                  date: a.fecha_completacion && (a.completada === true || a.completada === 1)
                    ? new Date(a.fecha_completacion).toLocaleString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : '',
                  rating: a.calificacion || 0,
                  comment: a.comentario || '',
                }));
            }
            return {
              id: p.id,
              name: p.Usuario?.nombreCompleto || '',
              activities: actividades
            };
          })
        );
        setPatients(pacientesConActividades);
      } catch (err) {
      }
    };
    fetchPatients();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/healthcare/dashboard')}
            className="text-white hover:text-primary transition-colors"
          >
            <ArrowLeft size={32} />
          </button>
          <Logo className="w-12 h-12" />
          <h1 className="text-white text-3xl font-bold">CALIFICACIONES Y COMENTARIOS</h1>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Retroalimentación de Actividades
          </h2>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Seleccionar Paciente
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {patients.map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedPatient === patient.id
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                  }`}
                >
                  <div className="font-semibold">{patient.name}</div>
                  <div className="text-sm mt-1 opacity-90">
                    {patient.activities.length} actividades
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedPatient ? (
            <div className="space-y-4">
              {patients
                .find((p) => p.id === selectedPatient)
                ?.activities
                .filter((activity) => activity.completed && activity.rating > 0 && activity.comment)
                .map((activity) => (
                  <div
                    key={activity.id}
                    className="border-2 border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                          {activity.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-1">
                          {`Completada el: ${activity.date ? activity.date : 'Sin fecha'}`}
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500 text-white">
                        Completada
                      </span>
                    </div>
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
                    <div className={`mt-2 px-2 py-1 rounded text-xs font-semibold ${
                      activity.rating >= 8
                        ? 'bg-yellow-100 text-yellow-800'
                        : activity.rating >= 5
                        ? 'bg-red-100 text-red-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {activity.rating >= 8
                        ? 'Muy positivo'
                        : activity.rating >= 5
                        ? 'Moderado'
                        : 'Requiere atención'}
                    </div>
                  </div>
                ))}

              {patients
                .find((p) => p.id === selectedPatient)
                ?.activities
                .filter((activity) => !activity.completed)
                .map((activity) => (
                  <div
                    key={activity.id}
                    className="border-2 border-yellow-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                          {activity.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-1">Pendiente</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-400 text-gray-800">
                        Pendiente
                      </span>
                    </div>
                  </div>
                ))}

              <div className="mt-6 bg-blue-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Resumen de {patients.find((p) => p.id === selectedPatient)?.name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Total Actividades calificadas</div>
                    <div className="text-2xl font-bold text-primary">
                      {patients.find((p) => p.id === selectedPatient)?.activities.filter(act => act.completed && act.rating > 0 && act.comment).length}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Calificación Promedio</div>
                    <div className="text-2xl font-bold text-primary">
                      {(() => {
                        const acts = patients.find((p) => p.id === selectedPatient)?.activities.filter(act => act.completed && act.rating > 0 && act.comment);
                        if (!acts || acts.length === 0) return '0.0';
                        return (acts.reduce((acc, act) => acc + act.rating, 0) / acts.length).toFixed(1);
                      })()}
                      /10
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Última Actividad calificada</div>
                    <div className="text-lg font-bold text-primary">
                      {(() => {
                        const acts = patients.find((p) => p.id === selectedPatient)?.activities.filter(act => act.completed && act.rating > 0 && act.comment);
                        if (!acts || acts.length === 0) return 'Sin fecha';
                        return acts[0].date ? acts[0].date.split(',')[0] : 'Sin fecha';
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Selecciona un paciente para ver sus calificaciones y comentarios
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ratings;

