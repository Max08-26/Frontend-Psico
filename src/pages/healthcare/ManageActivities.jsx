import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Filter } from 'lucide-react';
import Swal from 'sweetalert2';
import Logo from '../../components/common/Logo';
import { useAuth } from '../../contexts/AuthContext';

const ManageActivities = () => {
  const navigate = useNavigate();
  const { profesionalId } = useAuth();
  const token = localStorage.getItem('biopsyche_token');
  const [actividades, setActividades] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [editingActivity, setEditingActivity] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    tipo: '',
    frecuencia: '',
    url_recurso: '',
    instrucciones_adicionales: ''
  });

  useEffect(() => {
    loadActivities();
    loadPatients();
  }, [selectedPatient]);

  const loadActivities = () => {
    const url = selectedPatient
      ? `/api/actividades?paciente_id=${selectedPatient}`
      : '/api/actividades';

    fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => setActividades(data))
      .catch(err => console.error(err));
  };

  const loadPatients = () => {
    fetch('/api/pacientes', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => setPatients(data))
      .catch(err => console.error(err));
  };

  const handleDelete = (id, titulo) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `La actividad "${titulo}" será eliminada permanentemente`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FF6B6B',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`/api/actividades/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })
          .then(res => {
            if (res.ok) {
              Swal.fire('¡Eliminada!', 'La actividad ha sido eliminada', 'success');
              loadActivities();
            } else {
              throw new Error('Error al eliminar');
            }
          })
          .catch(() => Swal.fire('Error', 'No se pudo eliminar la actividad', 'error'));
      }
    });
  };

  const handleEdit = (actividad) => {
    setEditingActivity(actividad.id);
    setFormData({
      titulo: actividad.titulo,
      descripcion: actividad.descripcion,
      tipo: actividad.tipo,
      frecuencia: actividad.frecuencia,
      url_recurso: actividad.url_recurso || '',
      instrucciones_adicionales: actividad.instrucciones_adicionales || ''
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/actividades/${editingActivity}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Error al actualizar');

      Swal.fire({
        title: '¡Éxito!',
        text: 'Actividad actualizada correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4A90E2',
      });

      setEditingActivity(null);
      loadActivities();
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  const activityTypes = {
    video: 'Ver Video',
    reading: 'Lectura',
    writing: 'Escribir',
    drawing: 'Dibujar'
  };

  const frequencies = {
    diaria: 'Diaria',
    semanal: 'Semanal',
    mensual: 'Mensual'
  };

  const getTypeColor = (tipo) => {
    const colors = {
      video: 'bg-red-100 text-red-800',
      reading: 'bg-blue-100 text-blue-800',
      writing: 'bg-green-100 text-green-800',
      drawing: 'bg-purple-100 text-purple-800'
    };
    return colors[tipo] || 'bg-gray-100 text-gray-800';
  };

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
          <h1 className="text-white text-3xl font-bold">GESTIONAR ACTIVIDADES</h1>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <div className="flex items-center gap-3">
            <Filter size={20} className="text-primary" />
            <label className="font-semibold text-gray-700">Filtrar por paciente:</label>
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
            >
              <option value="">Todos los pacientes</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.Usuario?.nombreCompleto || 'Sin nombre'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {editingActivity && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Editar Actividad</h2>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Descripción *
                  </label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                    rows="4"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tipo *
                  </label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                    required
                  >
                    <option value="">Seleccionar tipo</option>
                    {Object.entries(activityTypes).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Frecuencia *
                  </label>
                  <select
                    value={formData.frecuencia}
                    onChange={(e) => setFormData({ ...formData, frecuencia: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                    required
                  >
                    <option value="">Seleccionar frecuencia</option>
                    {Object.entries(frequencies).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </select>
                </div>

                {(formData.tipo === 'video' || formData.tipo === 'reading') && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      URL del recurso
                    </label>
                    <input
                      type="url"
                      value={formData.url_recurso}
                      onChange={(e) => setFormData({ ...formData, url_recurso: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Instrucciones adicionales
                  </label>
                  <textarea
                    value={formData.instrucciones_adicionales}
                    onChange={(e) => setFormData({ ...formData, instrucciones_adicionales: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                    rows="3"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingActivity(null)}
                    className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Actividades Asignadas ({actividades.length})
          </h2>

          {actividades.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No hay actividades asignadas
            </p>
          ) : (
            <div className="space-y-4">
              {actividades.map(actividad => (
                <div key={actividad.id} className="border-2 border-gray-200 rounded-lg p-4 hover:border-primary transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{actividad.titulo}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getTypeColor(actividad.tipo)}`}>
                          {activityTypes[actividad.tipo]}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-800">
                          {frequencies[actividad.frecuencia]}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-2">{actividad.descripcion}</p>

                      {actividad.Paciente && (
                        <p className="text-sm text-gray-500">
                          <strong>Paciente:</strong> {actividad.Paciente.Usuario?.nombreCompleto || 'N/A'}
                        </p>
                      )}

                      {actividad.completada && (
                        <div className="mt-2 inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                          ✓ Completada
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(actividad)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar actividad"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(actividad.id, actividad.titulo)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar actividad"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>

                  {actividad.url_recurso && (
                    <div className="mt-2">
                      <a
                        href={actividad.url_recurso}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        🔗 Ver recurso
                      </a>
                    </div>
                  )}

                  {actividad.instrucciones_adicionales && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                      <strong>Instrucciones:</strong> {actividad.instrucciones_adicionales}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageActivities;

