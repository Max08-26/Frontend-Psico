import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, TrendingUp, TrendingDown, Minus, Scale, Calendar } from 'lucide-react';
import Swal from 'sweetalert2';
import Logo from '../../components/common/Logo';
import { useAuth } from '../../contexts/AuthContext';

const WeightTracking = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = localStorage.getItem('biopsyche_token');
  const [registros, setRegistros] = useState([]);
  const [pacienteId, setPacienteId] = useState(null);
  const [pacienteData, setPacienteData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    peso: '',
    fecha: new Date().toISOString().split('T')[0],
    notas: ''
  });

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
            setPacienteData(data);
            loadRegistros(data.id);
          }
        });
    } else {
      loadRegistros();
    }
  }, [user, token]);

  const loadRegistros = (patientId = null) => {
    const url = patientId ? `/api/vigilancia-peso?paciente_id=${patientId}` : '/api/vigilancia-peso';
    fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => setRegistros(data))
      .catch(err => console.error(err));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.peso || !formData.fecha) {
      Swal.fire('Error', 'Por favor completa todos los campos obligatorios', 'error');
      return;
    }

    try {
      const res = await fetch('/api/vigilancia-peso', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          paciente_id: pacienteId
        })
      });

      if (!res.ok) throw new Error('Error al guardar el registro');

      Swal.fire({
        title: '¡Éxito!',
        text: 'Peso registrado correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4A90E2',
      });

      setFormData({ peso: '', fecha: new Date().toISOString().split('T')[0], notas: '' });
      setShowForm(false);
      loadRegistros(pacienteId);
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  const calcularTendencia = () => {
    if (registros.length < 2) return null;

    const sorted = [...registros].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    const ultimo = parseFloat(sorted[sorted.length - 1].peso);
    const penultimo = parseFloat(sorted[sorted.length - 2].peso);
    const diferencia = ultimo - penultimo;

    return {
      direccion: diferencia > 0 ? 'up' : diferencia < 0 ? 'down' : 'stable',
      diferencia: Math.abs(diferencia).toFixed(2),
      porcentaje: ((diferencia / penultimo) * 100).toFixed(1)
    };
  };

  const tendencia = calcularTendencia();

  const calcularIMC = () => {
    if (!pacienteData?.altura || !pacienteData?.peso_actual) return null;
    const altura = parseFloat(pacienteData.altura);
    const peso = parseFloat(pacienteData.peso_actual);
    return (peso / (altura * altura)).toFixed(1);
  };

  const imc = calcularIMC();

  const getIMCCategoria = (imc) => {
    if (!imc) return null;
    if (imc < 18.5) return { label: 'Bajo peso', color: 'text-blue-600' };
    if (imc < 25) return { label: 'Peso normal', color: 'text-green-600' };
    if (imc < 30) return { label: 'Sobrepeso', color: 'text-yellow-600' };
    return { label: 'Obesidad', color: 'text-red-600' };
  };

  const imcCategoria = getIMCCategoria(imc);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 p-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(isPatient ? '/patient/dashboard' : '/healthcare/dashboard')}
              className="text-white hover:text-primary transition-colors"
            >
              <ArrowLeft size={32} />
            </button>
            <Logo className="w-12 h-12" />
            <h1 className="text-white text-3xl font-bold">VIGILANCIA DE PESO</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

          <div className="bg-white rounded-lg shadow-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Scale size={24} className="text-primary" />
              <h3 className="text-lg font-semibold text-gray-800">Peso Actual</h3>
            </div>
            <p className="text-3xl font-bold text-primary">
              {pacienteData?.peso_actual ? `${pacienteData.peso_actual} kg` : 'N/A'}
            </p>
            {pacienteData?.altura && (
              <p className="text-sm text-gray-600 mt-1">Altura: {pacienteData.altura} m</p>
            )}
          </div>

          {imc && (
            <div className="bg-white rounded-lg shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Índice de Masa Corporal</h3>
              <p className="text-3xl font-bold text-primary">{imc}</p>
              {imcCategoria && (
                <p className={`text-sm font-semibold mt-1 ${imcCategoria.color}`}>
                  {imcCategoria.label}
                </p>
              )}
            </div>
          )}

          {tendencia && (
            <div className="bg-white rounded-lg shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Tendencia</h3>
              <div className="flex items-center gap-2">
                {tendencia.direccion === 'up' && (
                  <>
                    <TrendingUp size={32} className="text-red-600" />
                    <div>
                      <p className="text-2xl font-bold text-red-600">+{tendencia.diferencia} kg</p>
                      <p className="text-sm text-gray-600">+{tendencia.porcentaje}%</p>
                    </div>
                  </>
                )}
                {tendencia.direccion === 'down' && (
                  <>
                    <TrendingDown size={32} className="text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold text-blue-600">-{tendencia.diferencia} kg</p>
                      <p className="text-sm text-gray-600">{tendencia.porcentaje}%</p>
                    </div>
                  </>
                )}
                {tendencia.direccion === 'stable' && (
                  <>
                    <Minus size={32} className="text-gray-600" />
                    <div>
                      <p className="text-2xl font-bold text-gray-600">Sin cambios</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {isPatient && !showForm && (
          <div className="mb-6">
            <button
              onClick={() => setShowForm(true)}
              className="w-full bg-primary text-white py-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors"
            >
              <Plus size={24} />
              Registrar Peso
            </button>
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Nuevo Registro de Peso</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-gray-700 font-semibold mb-2 block">
                  Peso (kg) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.peso}
                  onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
                  placeholder="Ej: 70.5"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
                  required
                />
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
                <label className="text-gray-700 font-semibold mb-2 block">
                  Notas
                </label>
                <textarea
                  value={formData.notas}
                  onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                  placeholder="Observaciones adicionales..."
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ peso: '', fecha: new Date().toISOString().split('T')[0], notas: '' });
                  }}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                >
                  Guardar Registro
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Historial de Peso</h2>

          {registros.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No hay registros de peso aún
            </p>
          ) : (
            <div className="space-y-3">
              {registros.map((registro, idx) => {
                const anterior = registros[idx + 1];
                let cambio = null;

                if (anterior) {
                  const diff = parseFloat(registro.peso) - parseFloat(anterior.peso);
                  cambio = {
                    valor: Math.abs(diff).toFixed(2),
                    direccion: diff > 0 ? 'up' : diff < 0 ? 'down' : 'stable'
                  };
                }

                return (
                  <div key={registro.id} className="border-l-4 border-primary bg-gray-50 p-4 rounded-r-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Calendar size={18} className="text-primary" />
                          <span className="font-semibold text-gray-800">
                            {new Date(registro.fecha + 'T00:00:00').toLocaleDateString('es-ES', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-4">
                          <div>
                            <span className="text-2xl font-bold text-primary">{registro.peso} kg</span>
                          </div>

                          {cambio && cambio.direccion !== 'stable' && (
                            <div className="flex items-center gap-1">
                              {cambio.direccion === 'up' ? (
                                <TrendingUp size={20} className="text-red-600" />
                              ) : (
                                <TrendingDown size={20} className="text-blue-600" />
                              )}
                              <span className={`text-sm font-semibold ${
                                cambio.direccion === 'up' ? 'text-red-600' : 'text-blue-600'
                              }`}>
                                {cambio.direccion === 'up' ? '+' : '-'}{cambio.valor} kg
                              </span>
                            </div>
                          )}
                        </div>

                        {registro.notas && (
                          <div className="mt-2">
                            <span className="text-gray-600 text-sm">{registro.notas}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mt-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            ℹ️ Información sobre Medicación Psiquiátrica y Peso
          </h3>
          <p className="text-blue-800 text-sm">
            Los medicamentos psiquiátricos pueden afectar el peso corporal. Es importante monitorear
            los cambios y reportar cualquier variación significativa a tu profesional de salud.
            Mantén un registro constante para ayudar en el ajuste de tu tratamiento.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeightTracking;

