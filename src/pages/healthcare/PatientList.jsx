import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Pencil, Trash, UserPlus, X, Users } from 'lucide-react';
import Logo from '../../components/common/Logo';
import Swal from 'sweetalert2';
import React from 'react';
const PatientList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showAssignFamily, setShowAssignFamily] = useState(false);
  const [createData, setCreateData] = useState({
    tipo_usuario: 'paciente',
    name: '',
    email: '',
    password: '',
    birthdate: '',
    phone: '',
    direccion: '',
    nombreTutor: '',
    celularTutor: '',
    contactoEmergencia: '',
    nombreContactoEmergencia: '',
    pesoActual: '',
    altura: '',
    patientIdForFamily: ''
  });
  const [editData, setEditData] = useState({});
  const [familyUsers, setFamilyUsers] = useState([]);
  const [assignData, setAssignData] = useState({ patientId: '', familiarUserId: '' });
  const [newFamilyData, setNewFamilyData] = useState({ name: '', email: '', phone: '', password: '' });
  const [patients, setPatients] = useState([]);
  const token = localStorage.getItem('biopsyche_token');

  React.useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch('/api/pacientes', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error('Error al obtener pacientes');
        const data = await res.json();
        setPatients(data.map(p => ({
          id: p.id,
          usuarioId: p.usuario_id,
          name: p.Usuario?.nombreCompleto || '',
          age: p.Usuario?.edad || 0,
          email: p.Usuario?.email || '',
          phone: p.Usuario?.telefono || '',
          status: p.Usuario?.estado || 'activo',
          lastSession: p.Usuario?.fecha_ultima_sesion || '',
          birthdate: p.Usuario?.fecha_nacimiento || '',
          activitiesCompleted: p.actividadesCompletadas || 0,
          activitiesTotal: p.actividadesTotales || 0,
        })));
      } catch (err) {
        Swal.fire('Error', err.message, 'error');
      }
    };
    fetchPatients();
  }, [token]);

  React.useEffect(() => {
    const fetchFamilies = async () => {
      try {
        const res = await fetch('/api/familiares/usuarios', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setFamilyUsers(data);
        }
      } catch (err) {
        console.error('Error al cargar familiares:', err);
      }
    };
    fetchFamilies();
  }, [token]);

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleNewFamilyChange = (e) => {
    const { name, value } = e.target;
    setNewFamilyData(prev => ({ ...prev, [name]: value }));
  };

  const calculateAge = (birthdate) => {
    if (!birthdate) return 0;
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleCreateSave = async (e) => {
    e.preventDefault();
    try {
      const usuarioRes = await fetch('/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: createData.email.split('@')[0],
          email: createData.email,
          password: createData.password,
          nombreCompleto: createData.name,
          edad: calculateAge(createData.birthdate),
          telefono: createData.phone,
          tipo_usuario: createData.tipo_usuario,
          estado: 'activo',
          fecha_nacimiento: createData.birthdate
        })
      });
      const usuarioData = await usuarioRes.json().catch(() => ({}));
      if (!usuarioRes.ok) throw new Error(usuarioData.error || 'Error al crear usuario');
      const usuario = usuarioData;
      if (createData.tipo_usuario === 'paciente') {
        const pacienteRes = await fetch('/api/pacientes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            usuario_id: usuario.id,
            direccion: createData.direccion,
            nombre_tutor: createData.nombreTutor,
            celular_tutor: createData.celularTutor,
            contacto_emergencia: createData.contactoEmergencia,
            nombre_contacto_emergencia: createData.nombreContactoEmergencia,
            peso_actual: createData.pesoActual ? parseFloat(createData.pesoActual) : null,
            altura: createData.altura ? parseFloat(createData.altura) : null,
          })
        });
        if (!pacienteRes.ok) throw new Error('Error al crear paciente');
      }

      if (createData.tipo_usuario === 'familiar') {
        if (!createData.patientIdForFamily) {
          throw new Error('Debes seleccionar un paciente para el familiar');
        }
        const assignResponse = await fetch('/api/familiares/asignar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            familiar_usuario_id: usuario.id,
            paciente_id: createData.patientIdForFamily,
          })
        });
        const assignDataResponse = await assignResponse.json().catch(() => ({}));
        if (!assignResponse.ok) {
          throw new Error(assignDataResponse.error || 'Error al asignar el familiar al paciente');
        }
      }

      const res = await fetch('/api/pacientes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setPatients(data.map(p => ({
        id: p.id,
        usuarioId: p.usuario_id,
        name: p.Usuario?.nombreCompleto || '',
        age: p.Usuario?.edad || 0,
        email: p.Usuario?.email || '',
        phone: p.Usuario?.telefono || '',
        status: p.Usuario?.estado || '',
        lastSession: p.Usuario?.fecha_ultima_sesion || '',
        birthdate: p.Usuario?.fecha_nacimiento || '',
        activitiesCompleted: p.actividadesCompletadas || 0,
        activitiesTotal: p.actividadesTotales || 0,        direccion: p.direccion || '',
        nombreTutor: p.nombre_tutor || '',
        celularTutor: p.celular_tutor || '',
        contactoEmergencia: p.contacto_emergencia || '',
        nombreContactoEmergencia: p.nombre_contacto_emergencia || '',
        pesoActual: p.peso_actual || '',
        altura: p.altura || '',      })));
      setShowCreate(false);
      setCreateData({
        tipo_usuario: 'paciente',
        name: '',
        email: '',
        password: '',
        birthdate: '',
        phone: '',
        direccion: '',
        nombreTutor: '',
        celularTutor: '',
        contactoEmergencia: '',
        nombreContactoEmergencia: '',
        pesoActual: '',
        altura: '',
        patientIdForFamily: ''
      });
      Swal.fire('Creado', createData.tipo_usuario === 'familiar' ? 'El familiar ha sido creado y asignado.' : 'El paciente ha sido creado.', 'success');
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  const handleEditPatient = (patient) => {
    setEditData({ ...patient });
    setShowEdit(true);
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/usuarios/${editData.usuarioId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nombreCompleto: editData.name,
          edad: calculateAge(editData.birthdate),
          telefono: editData.phone,
          estado: String(editData.status || 'activo').toLowerCase() === 'inactivo' ? 'inactivo' : 'activo',
          email: editData.email,
          fecha_nacimiento: editData.birthdate,
          password: editData.password
        })
      });
      if (!res.ok) throw new Error('Error al actualizar usuario');

      const resPaciente = await fetch(`/api/pacientes/${editData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          direccion: editData.direccion,
          nombre_tutor: editData.nombreTutor,
          celular_tutor: editData.celularTutor,
          contacto_emergencia: editData.contactoEmergencia,
          nombre_contacto_emergencia: editData.nombreContactoEmergencia,
          peso_actual: editData.pesoActual ? parseFloat(editData.pesoActual) : null,
          altura: editData.altura ? parseFloat(editData.altura) : null,
        })
      });
      if (!resPaciente.ok) throw new Error('Error al actualizar datos del paciente');
      const updated = await fetch('/api/pacientes', { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await updated.json();
      setPatients(data.map(p => ({
        id: p.id,
        usuarioId: p.usuario_id,
        name: p.Usuario?.nombreCompleto || '',
        age: p.Usuario?.edad || 0,
        email: p.Usuario?.email || '',
        phone: p.Usuario?.telefono || '',
        status: p.Usuario?.estado || '',
        lastSession: p.Usuario?.fecha_ultima_sesion || '',
        birthdate: p.Usuario?.fecha_nacimiento || '',
        activitiesCompleted: p.actividadesCompletadas || 0,
        activitiesTotal: p.actividadesTotales || 0,
        direccion: p.direccion || '',
        nombreTutor: p.nombre_tutor || '',
        celularTutor: p.celular_tutor || '',
        contactoEmergencia: p.contacto_emergencia || '',
        nombreContactoEmergencia: p.nombre_contacto_emergencia || '',
        pesoActual: p.peso_actual || '',
        altura: p.altura || '',
      })));
      setShowEdit(false);
      Swal.fire('Guardado', 'Los datos del paciente han sido actualizados.', 'success');
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  const handleDeletePatient = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar paciente?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    });
    if (result.isConfirmed) {
      try {
        await fetch(`/api/pacientes/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const updated = await fetch('/api/pacientes', { headers: { 'Authorization': `Bearer ${token}` } });
        const data = await updated.json();
        setPatients(data.map(p => ({
          id: p.id,
          usuarioId: p.usuario_id,
          name: p.Usuario?.nombreCompleto || '',
          age: p.Usuario?.edad || 0,
          email: p.Usuario?.email || '',
          phone: p.Usuario?.telefono || '',
          status: p.Usuario?.estado || '',
          lastSession: p.Usuario?.fecha_ultima_sesion || '',
          birthdate: p.Usuario?.fecha_nacimiento || '',
          activitiesCompleted: p.actividadesCompletadas || 0,
          activitiesTotal: p.actividadesTotales || 0,
        })));
        Swal.fire('Eliminado', 'El paciente ha sido eliminado.', 'success');
      } catch (err) {
        Swal.fire('Error', err.message, 'error');
      }
    }
  };

  const handleOpenAssignFamily = (patient) => {
    setAssignData({ patientId: patient.id, familiarUserId: '' });
    setShowAssignFamily(true);
  };

  const handleAssignFamily = async (e) => {
    e.preventDefault();
    try {
      let familiarUserId = assignData.familiarUserId;

      if (!familiarUserId) {
        if (!newFamilyData.name || !newFamilyData.email || !newFamilyData.password) {
          throw new Error('Selecciona un familiar o llena los datos para crear uno nuevo');
        }

        const createFamilyResponse = await fetch('/api/usuarios', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: newFamilyData.email.split('@')[0],
            nombreCompleto: newFamilyData.name,
            email: newFamilyData.email,
            password: newFamilyData.password,
            tipo_usuario: 'familiar',
            estado: 'activo',
            telefono: newFamilyData.phone,
          })
        });

        const familyCreated = await createFamilyResponse.json().catch(() => ({}));
        if (!createFamilyResponse.ok) {
          throw new Error(familyCreated.error || 'No se pudo crear el familiar');
        }

        familiarUserId = familyCreated.id;
      }

      const response = await fetch('/api/familiares/asignar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          paciente_id: assignData.patientId,
          familiar_usuario_id: familiarUserId,
        })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'No se pudo asignar el familiar');
      setShowAssignFamily(false);
      setNewFamilyData({ name: '', email: '', phone: '', password: '' });
      Swal.fire('Asignado', 'El familiar fue vinculado correctamente al paciente.', 'success');
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
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
          <h1 className="text-white text-3xl font-bold">LISTA DE PACIENTES</h1>
          <button onClick={() => setShowCreate(true)} className="ml-auto bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold shadow flex items-center gap-2">
            <UserPlus size={20} /> Crear paciente
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-xl p-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar paciente por nombre o email..."
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-300">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Edad</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Fecha de nacimiento</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Contacto</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Progreso</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Última Sesión</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-gray-800">{patient.name}</div>
                    </td>
                    <td className="px-4 py-4 text-gray-700">{patient.age}</td>
                    <td className="px-4 py-4 text-gray-700">{patient.birthdate ? new Date(patient.birthdate).toLocaleDateString() : ''}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-gray-700">{patient.email}</span>
                        <span className="text-gray-700">{patient.phone}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-700">{patient.status === 'inactivo' ? 'Inactivo' : 'Activo'}</td>

                    <td className="px-4 py-4 text-gray-700">{patient.activitiesCompleted} / {patient.activitiesTotal}</td>
                    <td className="px-4 py-4 text-gray-700">
                      {patient.lastSession
                        ? new Date(patient.lastSession).toLocaleString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : ''}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button onClick={() => handleEditPatient(patient)} className="text-primary hover:text-blue-600 mr-2">
                        <Pencil size={20} />
                      </button>
                      <button onClick={() => handleOpenAssignFamily(patient)} className="text-amber-500 hover:text-amber-600 mr-2">
                        <Users size={20} />
                      </button>
                      <button onClick={() => handleDeletePatient(patient.id)} className="text-red-500 hover:text-red-700">
                        <Trash size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {showCreate && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in">
              <button onClick={() => setShowCreate(false)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500">
                <X size={28} />
              </button>
              <div className="flex flex-col items-center mb-6">
                <UserPlus size={40} className="text-primary mb-2" />
                <h2 className="text-3xl font-bold text-primary mb-2">
                  {createData.tipo_usuario === 'familiar' ? 'Nuevo Familiar' : 'Nuevo Paciente'}
                </h2>
                <p className="text-gray-600 text-center">
                  {createData.tipo_usuario === 'familiar'
                    ? 'Crea un familiar y asígnalo a un paciente específico.'
                    : 'Completa los datos para registrar un paciente en el sistema.'}
                </p>
              </div>
              <form onSubmit={handleCreateSave} className="space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo de usuario</label>
                  <select
                    name="tipo_usuario"
                    value={createData.tipo_usuario}
                    onChange={handleCreateChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  >
                    <option value="paciente">Paciente</option>
                    <option value="familiar">Familiar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre completo</label>
                  <input name="name" type="text" value={createData.name} onChange={handleCreateChange} placeholder="Ej. Juan Pérez García" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Correo electrónico</label>
                  <input name="email" type="email" value={createData.email} onChange={handleCreateChange} placeholder="Ej. juan@email.com" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono</label>
                  <input name="phone" type="text" value={createData.phone} onChange={handleCreateChange} placeholder="Ej. +52 123 456 7890" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Contraseña</label>
                  <input name="password" type="password" value={createData.password} onChange={handleCreateChange} placeholder="Contraseña segura" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha de nacimiento</label>
                  <input name="birthdate" type="date" value={createData.birthdate} onChange={handleCreateChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary" required />
                </div>

                {createData.tipo_usuario === 'paciente' && (
                  <div className="border-t-2 border-gray-200 pt-4 mt-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-3">📍 Información Adicional</h3>
                    <div className="mb-3">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Dirección de vivienda</label>
                      <input name="direccion" type="text" value={createData.direccion} onChange={handleCreateChange} placeholder="Calle, número, colonia, ciudad" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary" />
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre del tutor/pareja</label>
                      <input name="nombreTutor" type="text" value={createData.nombreTutor} onChange={handleCreateChange} placeholder="Nombre completo" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary" />
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono del tutor/pareja</label>
                      <input name="celularTutor" type="text" value={createData.celularTutor} onChange={handleCreateChange} placeholder="+52 123 456 7890" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary" />
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre contacto de emergencia</label>
                      <input name="nombreContactoEmergencia" type="text" value={createData.nombreContactoEmergencia} onChange={handleCreateChange} placeholder="Persona adicional a contactar" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary" />
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono de emergencia</label>
                      <input name="contactoEmergencia" type="text" value={createData.contactoEmergencia} onChange={handleCreateChange} placeholder="+52 123 456 7890" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Peso actual (kg)</label>
                        <input name="pesoActual" type="number" step="0.1" value={createData.pesoActual} onChange={handleCreateChange} placeholder="70.5" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Altura (m)</label>
                        <input name="altura" type="number" step="0.01" value={createData.altura} onChange={handleCreateChange} placeholder="1.75" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary" />
                      </div>
                    </div>
                  </div>
                )}

                {createData.tipo_usuario === 'familiar' && (
                  <div className="border-t-2 border-gray-200 pt-4 mt-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-3">👪 Asignación del Familiar</h3>
                    <div className="mb-3">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Paciente asignado</label>
                      <select
                        name="patientIdForFamily"
                        value={createData.patientIdForFamily}
                        onChange={handleCreateChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                        required
                      >
                        <option value="">Seleccionar paciente</option>
                        {patients.map(patient => (
                          <option key={patient.id} value={patient.id}>{patient.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition-colors font-semibold text-lg shadow sticky bottom-0">
                  {createData.tipo_usuario === 'familiar' ? 'Crear Familiar' : 'Crear Paciente'}
                </button>
              </form>
            </div>
          </div>
        )}
        {showEdit && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in">
              <button onClick={() => setShowEdit(false)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500">
                <X size={28} />
              </button>
              <div className="flex flex-col items-center mb-6">
                <Pencil size={40} className="text-primary mb-2" />
                <h2 className="text-3xl font-bold text-primary mb-2">Editar Paciente</h2>
                <p className="text-gray-600 text-center">Modifica los datos del paciente y la contraseña.</p>
              </div>
              <form onSubmit={handleEditSave} className="space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre completo</label>
                  <input name="name" type="text" value={editData.name || ''} onChange={handleEditChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Correo electrónico</label>
                  <input name="email" type="email" value={editData.email || ''} onChange={handleEditChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono</label>
                  <input name="phone" type="text" value={editData.phone || ''} onChange={handleEditChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Contraseña</label>
                  <input name="password" type="password" value={editData.password || ''} onChange={handleEditChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha de nacimiento</label>
                  <input name="birthdate" type="date" value={editData.birthdate || ''} onChange={handleEditChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary" required />
                </div>

                <div className="border-t-2 border-gray-200 pt-4 mt-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">📍 Información Adicional</h3>

                  <div className="mb-3">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Dirección de vivienda</label>
                    <input name="direccion" type="text" value={editData.direccion || ''} onChange={handleEditChange} placeholder="Calle, número, colonia, ciudad" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary" />
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre del tutor/pareja</label>
                    <input name="nombreTutor" type="text" value={editData.nombreTutor || ''} onChange={handleEditChange} placeholder="Nombre completo" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary" />
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono del tutor/pareja</label>
                    <input name="celularTutor" type="text" value={editData.celularTutor || ''} onChange={handleEditChange} placeholder="+52 123 456 7890" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary" />
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre contacto de emergencia</label>
                    <input name="nombreContactoEmergencia" type="text" value={editData.nombreContactoEmergencia || ''} onChange={handleEditChange} placeholder="Persona adicional a contactar" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary" />
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono de emergencia</label>
                    <input name="contactoEmergencia" type="text" value={editData.contactoEmergencia || ''} onChange={handleEditChange} placeholder="+52 123 456 7890" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Peso actual (kg)</label>
                      <input name="pesoActual" type="number" step="0.1" value={editData.pesoActual || ''} onChange={handleEditChange} placeholder="70.5" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Altura (m)</label>
                      <input name="altura" type="number" step="0.01" value={editData.altura || ''} onChange={handleEditChange} placeholder="1.75" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary" />
                    </div>
                  </div>
                </div>

                <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition-colors font-semibold text-lg shadow sticky bottom-0">
                  Guardar Cambios
                </button>
              </form>
            </div>
          </div>
        )}
        {showAssignFamily && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
              <button onClick={() => setShowAssignFamily(false)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500">
                <X size={28} />
              </button>
              <div className="flex flex-col items-center mb-6">
                <Users size={40} className="text-amber-500 mb-2" />
                <h2 className="text-3xl font-bold text-amber-500 mb-2">Asignar Familiar</h2>
                <p className="text-gray-600 text-center">Vincula un familiar a este paciente para la red de apoyo.</p>
              </div>
              <form onSubmit={handleAssignFamily} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Familiar existente</label>
                  <select
                    value={assignData.familiarUserId}
                    onChange={(e) => setAssignData(prev => ({ ...prev, familiarUserId: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  >
                    <option value="">Seleccionar familiar existente</option>
                    {familyUsers.map(user => (
                      <option key={user.id} value={user.id}>{user.nombreCompleto} - {user.email}</option>
                    ))}
                  </select>
                  {familyUsers.length === 0 && (
                    <p className="text-sm text-amber-600 mt-2">
                      No hay familiares creados todavía. Puedes crearlo aquí mismo.
                    </p>
                  )}
                </div>

                <div className="border-t-2 border-gray-200 pt-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Crear nuevo familiar</h3>
                  <div className="space-y-3">
                    <input
                      name="name"
                      value={newFamilyData.name}
                      onChange={handleNewFamilyChange}
                      placeholder="Nombre completo"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    />
                    <input
                      name="email"
                      type="email"
                      value={newFamilyData.email}
                      onChange={handleNewFamilyChange}
                      placeholder="Correo electrónico"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    />
                    <input
                      name="phone"
                      value={newFamilyData.phone}
                      onChange={handleNewFamilyChange}
                      placeholder="Teléfono"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    />
                    <input
                      name="password"
                      type="password"
                      value={newFamilyData.password}
                      onChange={handleNewFamilyChange}
                      placeholder="Contraseña"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <button type="submit" className="w-full bg-amber-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors">
                  Guardar y asignar familiar
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientList;

