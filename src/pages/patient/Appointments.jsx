import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Plus, Edit, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import Logo from '../../components/common/Logo';
import { useAuth } from '../../contexts/AuthContext';

const Appointments = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = localStorage.getItem('biopsyche_token');
  const [citas, setCitas] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [pacienteId, setPacienteId] = useState(null);

  const isPatient = user?.tipo_usuario?.toLowerCase() === 'paciente';

  useEffect(() => {
    if (!user?.id) return;

    if (isPatient) {
      fetch(`/api/pacientes/usuario/${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && data.id) {
            setPacienteId(data.id);
            loadCitas(data.id);
          }
        });
    } else {
      loadCitas();
    }
  }, [user, token]);

  const loadCitas = (patientId = null) => {
    const url = patientId ? `/api/citas?paciente_id=${patientId}` : '/api/citas';
    fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => setCitas(data))
      .catch(err => console.error(err));
  };

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const getDaysInMonth = (month, year) => {
    const date = new Date(year, month, 1);
    const days = [];
    const firstDay = date.getDay();

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    return days;
  };

  const getCitasForDate = (date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return citas.filter(c => c.fecha === dateStr);
  };

  const getStatusColor = (estado) => {
    const colors = {
      pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      confirmada: 'bg-blue-100 text-blue-800 border-blue-300',
      completada: 'bg-green-100 text-green-800 border-green-300',
      cancelada: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[estado] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const handleDeleteCita = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta cita será eliminada permanentemente',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FF6B6B',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`/api/citas/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })
          .then(res => {
            if (res.ok) {
              Swal.fire('¡Eliminada!', 'La cita ha sido eliminada', 'success');
              loadCitas(pacienteId);
            } else {
              throw new Error('Error al eliminar');
            }
          })
          .catch(() => Swal.fire('Error', 'No se pudo eliminar la cita', 'error'));
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(isPatient ? '/patient/dashboard' : '/healthcare/dashboard')}
              className="text-white hover:text-primary transition-colors"
            >
              <ArrowLeft size={32} />
            </button>
            <Logo className="w-12 h-12" />
            <h1 className="text-white text-3xl font-bold">CALENDARIO DE CITAS</h1>
          </div>
          {!isPatient && (
            <button
              onClick={() => navigate('/healthcare/appointments/new')}
              className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-dark transition-colors"
            >
              <Plus size={20} />
              Nueva Cita
            </button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => {
                if (selectedMonth === 0) {
                  setSelectedMonth(11);
                  setSelectedYear(selectedYear - 1);
                } else {
                  setSelectedMonth(selectedMonth - 1);
                }
              }}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              ← Anterior
            </button>
            <h2 className="text-2xl font-bold text-gray-800">
              {months[selectedMonth]} {selectedYear}
            </h2>
            <button
              onClick={() => {
                if (selectedMonth === 11) {
                  setSelectedMonth(0);
                  setSelectedYear(selectedYear + 1);
                } else {
                  setSelectedMonth(selectedMonth + 1);
                }
              }}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Siguiente →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
              <div key={day} className="text-center font-semibold text-gray-700 py-2">
                {day}
              </div>
            ))}

            {getDaysInMonth(selectedMonth, selectedYear).map((date, idx) => {
              if (!date) {
                return <div key={`empty-${idx}`} className="aspect-square" />;
              }

              const citasDelDia = getCitasForDate(date);
              const isToday = date.toDateString() === new Date().toDateString();

              return (
                <div
                  key={idx}
                  className={`aspect-square border-2 rounded-lg p-2 ${
                    isToday ? 'border-primary bg-blue-50' : 'border-gray-200'
                  } hover:bg-gray-50 transition-colors`}
                >
                  <div className="text-sm font-semibold text-gray-800 mb-1">
                    {date.getDate()}
                  </div>
                  {citasDelDia.length > 0 && (
                    <div className="space-y-1">
                      {citasDelDia.slice(0, 2).map(cita => (
                        <div
                          key={cita.id}
                          className={`text-xs px-1 py-0.5 rounded border ${getStatusColor(cita.estado)}`}
                          title={`${cita.hora} - ${cita.motivo}`}
                        >
                          <Clock size={10} className="inline mr-1" />
                          {cita.hora?.slice(0, 5)}
                        </div>
                      ))}
                      {citasDelDia.length > 2 && (
                        <div className="text-xs text-gray-600">
                          +{citasDelDia.length - 2} más
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Citas de {months[selectedMonth]} {selectedYear}
          </h3>

          {citas
            .filter(c => {
              const citaDate = new Date(c.fecha + 'T00:00:00');
              return citaDate.getMonth() === selectedMonth && citaDate.getFullYear() === selectedYear;
            })
            .sort((a, b) => {
              const dateCompare = new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
              if (dateCompare !== 0) return dateCompare;
              return a.hora.localeCompare(b.hora);
            })
            .map(cita => (
              <div key={cita.id} className="border-l-4 border-primary bg-gray-50 p-4 mb-3 rounded-r-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar size={18} className="text-primary" />
                      <span className="font-semibold text-gray-800">
                        {new Date(cita.fecha + 'T00:00:00').toLocaleDateString('es-ES', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                      <Clock size={18} className="text-primary" />
                      <span className="font-semibold text-gray-800">{cita.hora?.slice(0, 5)}</span>
                    </div>

                    {cita.motivo && (
                      <div className="mb-2">
                        <span className="font-semibold text-gray-700">Motivo: </span>
                        <span className="text-gray-600">{cita.motivo}</span>
                      </div>
                    )}

                    {cita.notas && (
                      <div className="mb-2">
                        <span className="font-semibold text-gray-700">Notas: </span>
                        <span className="text-gray-600">{cita.notas}</span>
                      </div>
                    )}

                    {!isPatient && cita.Paciente && (
                      <div className="mb-2">
                        <span className="font-semibold text-gray-700">Paciente: </span>
                        <span className="text-gray-600">
                          {cita.Paciente.Usuario?.nombreCompleto || 'N/A'}
                        </span>
                      </div>
                    )}

                    <span className={`inline-block px-3 py-1 rounded-full text-sm border ${getStatusColor(cita.estado)}`}>
                      {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
                    </span>
                  </div>

                  {!isPatient && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/healthcare/appointments/edit/${cita.id}`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteCita(cita.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

          {citas.filter(c => {
            const citaDate = new Date(c.fecha + 'T00:00:00');
            return citaDate.getMonth() === selectedMonth && citaDate.getFullYear() === selectedYear;
          }).length === 0 && (
            <p className="text-center text-gray-500 py-8">
              No hay citas programadas para este mes
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointments;

