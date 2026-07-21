import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Logo from '../../components/common/Logo';

const Dashboards = () => {
  const navigate = useNavigate();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('2026-02');
  const [patientSearch, setPatientSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [patients, setPatients] = useState([]);
  const [activities, setActivities] = useState([]);
  const [emotions, setEmotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [emergencies, setEmergencies] = useState([]);
  const [medications, setMedications] = useState([]);
  const token = localStorage.getItem('biopsyche_token');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch('/api/pacientes', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al obtener pacientes');
        const data = await res.json();
        setPatients(data.map(p => ({ id: p.id, name: p.Usuario?.nombreCompleto || '' })));
      } catch (err) {}
    };
    fetchPatients();
  }, [token]);

  useEffect(() => {
    if (!selectedPatient || !selectedMonth) return;
    setLoading(true);
    const [year, month] = selectedMonth.split('-');
    const fetchData = async () => {
      try {
        const actRes = await fetch(`/api/actividades?paciente_id=${selectedPatient}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const actData = actRes.ok ? await actRes.json() : [];
        const filteredActs = actData.filter(a => {
          if (!a.fecha_completacion) return false;
          const d = new Date(a.fecha_completacion);
          return d.getFullYear() === parseInt(year) && (d.getMonth() + 1) === parseInt(month);
        });
        setActivities(filteredActs);

        const emoRes = await fetch(`/api/emociones`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const emoData = emoRes.ok ? await emoRes.json() : [];
        const filteredEmos = emoData.filter(e => {
          if (e.paciente_id !== selectedPatient) return false;
          const d = new Date(e.fecha);
          return d.getFullYear() === parseInt(year) && (d.getMonth() + 1) === parseInt(month);
        });
        setEmotions(filteredEmos);

        const emgRes = await fetch(`/api/emergencias`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const emgData = emgRes.ok ? await emgRes.json() : [];
        const filteredEmgs = emgData.filter(e => {
          if (e.paciente_id !== selectedPatient) return false;
          const d = new Date(e.fecha_emergencia);
          return d.getFullYear() === parseInt(year) && (d.getMonth() + 1) === parseInt(month);
        });
        setEmergencies(filteredEmgs);

        const medRes = await fetch(`/api/medicacion-tomada`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const medData = medRes.ok ? await medRes.json() : [];
        const filteredMeds = medData.filter(m => {
          if (m.paciente_id !== selectedPatient) return false;
          const d = new Date(m.fecha);
          return d.getFullYear() === parseInt(year) && (d.getMonth() + 1) === parseInt(month);
        });
        setMedications(filteredMeds);
      } catch (err) {
        setActivities([]);
        setEmotions([]);
        setEmergencies([]);
        setMedications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedPatient, selectedMonth, token]);

  const filteredPatients = patients.filter(p => p.name.toLowerCase().includes(patientSearch.toLowerCase()));

  const activitiesData = [
    {
      week: 'Mes',
      completadas: activities.length,
      asignadas: activities.length
    }
  ];

  const emotionMap = {
    happy: 'Feliz',
    sad: 'Triste',
    angry: 'Enojado',
    calm: 'Calma',
    anxious: 'Ansioso',
    stressed: 'Estresado',
    excited: 'Emocionado',
    tired: 'Cansado',
    bored: 'Aburrido',
  };
  const emotionCount = {};
  emotions.forEach(e => {
    const spanish = emotionMap[e.emocion] || e.emocion;
    emotionCount[spanish] = (emotionCount[spanish] || 0) + 1;
  });
  const emotionsData = Object.entries(emotionCount).map(([name, value]) => ({
    name,
    value,
    color: '#FFD966'
  }));

  const emergencyData = [];
  if (emergencies.length > 0) {
    const dayCounts = {};
    emergencies.forEach(e => {
      const d = new Date(e.fecha_emergencia);
      const day = d.getDate();
      dayCounts[day] = (dayCounts[day] || 0) + 1;
    });
    for (const day in dayCounts) {
      emergencyData.push({ day: `Día ${day}`, count: dayCounts[day] });
    }
  }

  const medicationData = [];
  if (medications.length > 0) {
    const total = medications.length;
    const cumplidos = medications.filter(m => m.tomado).length;
    medicationData.push({ cumplimiento: total > 0 ? (cumplidos / total) * 100 : 0 });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/healthcare/dashboard')}
            className="text-white hover:text-primary transition-colors"
          >
            <ArrowLeft size={32} />
          </button>
          <Logo className="w-12 h-12" />
          <h1 className="text-white text-3xl font-bold">DASHBOARDS MENSUALES</h1>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Seleccionar Paciente
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={patientSearch}
                  onChange={e => {
                    setPatientSearch(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && filteredPatients.length > 0) {
                      setSelectedPatient(filteredPatients[0].id);
                      setPatientSearch(filteredPatients[0].name);
                      setShowDropdown(false);
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
                            setSelectedPatient(patient.id);
                            setPatientSearch(patient.name);
                            setShowDropdown(false);
                          }}
                          onClick={e => {
                            e.preventDefault();
                            setSelectedPatient(patient.id);
                            setPatientSearch(patient.name);
                            setShowDropdown(false);
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
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mes
              </label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-xl p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        Adherencia Medicación
                      </h3>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Tomada', value: medicationData.length > 0 ? medicationData[0].cumplimiento : 0, color: '#4F8EF7' },
                              { name: 'No Tomada', value: medicationData.length > 0 ? 100 - medicationData[0].cumplimiento : 100, color: '#B0C4DE' }
                            ]}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            dataKey="value"
                          >
                            <Cell key="cell-tomada" fill="#4F8EF7" />
                            <Cell key="cell-notomada" fill="#B0C4DE" />
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="mt-4 p-3 bg-blue-50 rounded text-center">
                        <span className="text-sm text-gray-600">Porcentaje tomado: </span>
                        <span className="text-lg font-bold text-blue-600">
                          {medicationData.length > 0 ? medicationData[0].cumplimiento.toFixed(0) : 0}%
                        </span>
                      </div>
                    </div>

          <div className="bg-white rounded-lg shadow-xl p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Actividades Realizadas
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={activitiesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="asignadas" fill="#D3D3D3" name="Asignadas" />
                <Bar dataKey="completadas" fill="#A8D08D" name="Completadas" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 p-3 bg-green-50 rounded text-center">
              <span className="text-sm text-gray-600">Total completadas: </span>
                <span className="text-lg font-bold text-green-600">
                  {activitiesData.length > 0 ? activitiesData.reduce((acc, d) => acc + d.completadas, 0) : 0}/
                  {activitiesData.length > 0 ? activitiesData.reduce((acc, d) => acc + d.asignadas, 0) : 0}
                </span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Botón de Emergencia Activado
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={emergencyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#FF6B6B" name="Activaciones" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 p-3 bg-red-50 rounded text-center">
              <span className="text-sm text-gray-600">Total en el mes: </span>
                <span className="text-lg font-bold text-red-600">
                  {emergencyData.length > 0 ? emergencyData.reduce((acc, d) => acc + d.count, 0) : 0} veces
                </span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Emociones Predominantes del Mes
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={emotionsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {emotionsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 p-3 bg-purple-50 rounded text-center">
              <span className="text-sm text-gray-600">Emoción más frecuente: </span>
                <span className="text-lg font-bold text-purple-600">
                  {emotionsData.length > 0 ? emotionsData.reduce((max, emotion) =>
                    emotion.value > max.value ? emotion : max
                  ).name : 'Sin datos'}
                </span>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-xl p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Resumen General del Mes
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-sm text-gray-600 mb-1">Actividades</div>
              <div className="text-2xl font-bold text-green-600">
                {((activitiesData.reduce((acc, d) => acc + d.completadas, 0) /
                   activitiesData.reduce((acc, d) => acc + d.asignadas, 0)) * 100).toFixed(0)}%
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-sm text-gray-600 mb-1">Estado General</div>
              <div className="text-xl font-bold text-purple-600">Estable</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboards;

