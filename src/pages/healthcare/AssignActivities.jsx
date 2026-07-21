import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X } from 'lucide-react';
import Swal from 'sweetalert2';
import Logo from '../../components/common/Logo';

const AssignActivities = () => {
  const navigate = useNavigate();
  const { user, profesionalId } = useAuth();
  const token = localStorage.getItem('biopsyche_token');
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [activityType, setActivityType] = useState('');
  const [frequency, setFrequency] = useState('');
  const [activityData, setActivityData] = useState({
    title: '',
    description: '',
    url: '',
    instructions: '',
  });
  const [patientSearch, setPatientSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch('/api/pacientes', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al obtener pacientes');
        const data = await res.json();
        setPatients(data.map(p => ({
          id: p.id,
          name: p.Usuario?.nombreCompleto || '',
        })));
      } catch (err) {
        Swal.fire('Error', err.message, 'error');
      }
    };
    fetchPatients();
  }, [token]);

  const filteredPatients = patients.filter(p => p.name.toLowerCase().includes(patientSearch.toLowerCase()));

  const activityTypes = [
    { value: 'video', label: 'Ver Video' },
    { value: 'reading', label: 'Lectura' },
    { value: 'writing', label: 'Escribir en Hoja' },
    { value: 'drawing', label: 'Dibujar' },
  ];

  const frequencies = [
    { value: 'diaria', label: 'Diaria' },
    { value: 'semanal', label: 'Semanal' },
    { value: 'mensual', label: 'Mensual' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatient || !activityType || !frequency || !activityData.title || !activityData.description) {
      Swal.fire('Error', 'Completa todos los campos obligatorios', 'error');
      return;
    }
    if (!profesionalId) {
      Swal.fire('Error', 'No se encontró profesional para el usuario logueado', 'error');
      return;
    }
    try {
      const res = await fetch('/api/actividades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          paciente_id: selectedPatient,
          profesional_id: profesionalId,
          titulo: activityData.title,
          descripcion: activityData.description,
          tipo: activityType,
          frecuencia: frequency,
          url_recurso: activityData.url,
          instrucciones_adicionales: activityData.instructions
        })
      });
      if (!res.ok) throw new Error('Error al asignar actividad');
      Swal.fire({
        title: '¡Éxito!',
        text: 'Actividad asignada correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4A90E2',
      });
      setSelectedPatient('');
      setActivityType('');
      setFrequency('');
      setActivityData({ title: '', description: '', url: '', instructions: '' });
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient.id);
    setPatientSearch(patient.name);
    setShowDropdown(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/healthcare/dashboard')}
            className="text-white hover:text-primary transition-colors"
          >
            <ArrowLeft size={32} />
          </button>
          <Logo className="w-12 h-12" />
          <h1 className="text-white text-3xl font-bold">ASIGNAR ACTIVIDADES</h1>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Nueva Actividad para Paciente
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Seleccionar Paciente *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={patientSearch}
                  onChange={e => {
                    setPatientSearch(e.target.value);
                    setShowDropdown(true);
                    setSelectedPatient('');
                  }}
                  onFocus={() => setShowDropdown(true)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && filteredPatients.length > 0) {
                      handlePatientSelect(filteredPatients[0]);
                      e.preventDefault();
                    }
                  }}
                  placeholder="Buscar paciente por nombre..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  required
                  autoComplete="off"
                />
                {showDropdown && (
                  <div ref={dropdownRef} className="absolute z-10 left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
                    {filteredPatients.length === 0 ? (
                      <div className="px-4 py-2 text-gray-500">No hay pacientes</div>
                    ) : (
                      filteredPatients.map(patient => (
                        <div
                          key={patient.id}
                          className={`px-4 py-2 cursor-pointer hover:bg-primary hover:text-white ${selectedPatient === patient.id ? 'bg-primary text-white' : ''}`}
                          onMouseDown={e => {
                            e.preventDefault();
                            handlePatientSelect(patient);
                          }}
                          onClick={e => {
                            e.preventDefault();
                            handlePatientSelect(patient);
                          }}
                        >
                          {patient.name}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tipo de Actividad *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {activityTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setActivityType(type.value)}
                    className={`py-3 px-4 rounded-lg border-2 font-semibold transition-colors ${
                      activityType === type.value
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Frecuencia *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {frequencies.map((freq) => (
                  <button
                    key={freq.value}
                    type="button"
                    onClick={() => setFrequency(freq.value)}
                    className={`py-3 px-4 rounded-lg border-2 font-semibold transition-colors ${
                      frequency === freq.value
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                    }`}
                  >
                    {freq.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Título de la Actividad *
              </label>
              <input
                type="text"
                value={activityData.title}
                onChange={(e) => setActivityData({ ...activityData, title: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                placeholder="Ej: Técnicas de respiración profunda"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                value={activityData.description}
                onChange={(e) => setActivityData({ ...activityData, description: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary h-24"
                placeholder="Describe la actividad..."
                required
              />
            </div>

            {(activityType === 'video' || activityType === 'reading') && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  URL del {activityType === 'video' ? 'Video' : 'Material de Lectura'}
                </label>
                <input
                  type="url"
                  value={activityData.url}
                  onChange={(e) => setActivityData({ ...activityData, url: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  placeholder="https://..."
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Instrucciones Adicionales
              </label>
              <textarea
                value={activityData.instructions}
                onChange={(e) => setActivityData({ ...activityData, instructions: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary h-24"
                placeholder="Instrucciones específicas para el paciente..."
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Asignar Actividad
              </button>
              <button
                type="button"
                onClick={() => navigate('/healthcare/dashboard')}
                className="px-6 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignActivities;

