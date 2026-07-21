import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import Swal from 'sweetalert2';
import Logo from '../../components/common/Logo';
import { useAuth } from '../../contexts/AuthContext';

const AppointmentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { profesionalId } = useAuth();
  const token = localStorage.getItem('biopsyche_token');
  const isEdit = !!id;

  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    paciente_id: '',
    fecha: '',
    hora: '',
    motivo: '',
    notas: '',
    estado: 'pendiente'
  });

  useEffect(() => {

    fetch('/api/pacientes', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => setPatients(data))
      .catch(err => console.error(err));

    if (isEdit) {
      fetch(`/api/citas/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data) {
            setFormData({
              paciente_id: data.paciente_id,
              fecha: data.fecha,
              hora: data.hora?.slice(0, 5) || '',
              motivo: data.motivo || '',
              notas: data.notas || '',
              estado: data.estado
            });
          }
        })
        .catch(err => console.error(err));
    }
  }, [id, token, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.paciente_id || !formData.fecha || !formData.hora) {
      Swal.fire('Error', 'Por favor completa todos los campos obligatorios', 'error');
      return;
    }

    if (!profesionalId) {
      Swal.fire('Error', 'No se encontró el ID del profesional', 'error');
      return;
    }

    const payload = {
      ...formData,
      profesional_id: profesionalId,
      hora: formData.hora + ':00'
    };

    try {
      const citasDiaRes = await fetch(`/api/citas?fecha_inicio=${formData.fecha}&fecha_fin=${formData.fecha}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const citasDia = citasDiaRes.ok ? await citasDiaRes.json() : [];
      const conflicto = citasDia.find((c) =>
        Number(c.profesional_id) === Number(profesionalId) &&
        (c.hora || '').slice(0, 5) === formData.hora &&
        c.estado !== 'cancelada' &&
        (!isEdit || Number(c.id) !== Number(id))
      );

      if (conflicto) {
        Swal.fire('Horario ocupado', 'Ya existe una cita en esa fecha y hora para este profesional.', 'error');
        return;
      }

      const url = isEdit ? `/api/citas/${id}` : '/api/citas';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        if (res.status === 409) {
          throw new Error(errorData?.error || 'Ya existe una cita en ese horario');
        }
        throw new Error(errorData?.error || 'Error al guardar la cita');
      }

      Swal.fire({
        title: '¡Éxito!',
        text: `Cita ${isEdit ? 'actualizada' : 'creada'} correctamente`,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4A90E2',
      }).then(() => {
        navigate('/healthcare/appointments');
      });
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/healthcare/appointments')}
            className="text-white hover:text-primary transition-colors"
          >
            <ArrowLeft size={32} />
          </button>
          <Logo className="w-12 h-12" />
          <h1 className="text-white text-3xl font-bold">
            {isEdit ? 'EDITAR CITA' : 'NUEVA CITA'}
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                <User size={20} />
                Paciente *
              </label>
              <select
                value={formData.paciente_id}
                onChange={(e) => setFormData({ ...formData, paciente_id: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
                required
              >
                <option value="">Selecciona un paciente</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.Usuario?.nombreCompleto || 'Sin nombre'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                <Calendar size={20} />
                Fecha *
              </label>
              <input
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                <Clock size={20} />
                Hora *
              </label>
              <input
                type="time"
                value={formData.hora}
                onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="text-gray-700 font-semibold mb-2 block">
                Motivo de la cita
              </label>
              <input
                type="text"
                value={formData.motivo}
                onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                placeholder="Ej: Consulta de seguimiento"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-gray-700 font-semibold mb-2 block">
                Notas adicionales
              </label>
              <textarea
                value={formData.notas}
                onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                placeholder="Información adicional sobre la cita..."
                rows="4"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors resize-none"
              />
            </div>

            <div>
              <label className="text-gray-700 font-semibold mb-2 block">
                Estado
              </label>
              <select
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
              >
                <option value="pendiente">Pendiente</option>
                <option value="confirmada">Confirmada</option>
                <option value="completada">Completada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/healthcare/appointments')}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
              >
                {isEdit ? 'Actualizar Cita' : 'Crear Cita'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AppointmentForm;

