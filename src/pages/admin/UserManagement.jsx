import React, { useState, useEffect } from "react";
import Logo from '../../components/common/Logo';
import { Pencil, Trash, X, UserPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Swal from 'sweetalert2';

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [editData, setEditData] = useState({});
  const [showCreate, setShowCreate] = useState(false);
  const [patientOptions, setPatientOptions] = useState([]);
  const [createData, setCreateData] = useState({
    username: '',
    nombreCompleto: '',
    email: '',
    password: '',
    tipo_usuario: 'paciente',
    estado: 'activo',
    edad: '',
    telefono: '',
    fecha_nacimiento: '',
    paciente_asignado_id: ''
  });
  const { logout, token } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('/api/pacientes', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setPatientOptions(data.map(p => ({
            id: p.id,
            name: p.Usuario?.nombreCompleto || 'Paciente sin nombre',
          })));
        }
      } catch (error) {
        console.error('Error al cargar pacientes para asignación:', error);
      }
    };

    fetchPatients();
  }, [token]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/usuarios', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUserList(data);
      } else {
        Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error', 'Error al cargar usuarios', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = userList.filter(
    user => user.nombreCompleto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar usuario?',
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
        const response = await fetch(`/api/usuarios/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          setUserList(userList.filter(u => u.id !== id));
          Swal.fire('Eliminado', 'El usuario ha sido eliminado.', 'success');
        } else {
          Swal.fire('Error', 'No se pudo eliminar el usuario', 'error');
        }
      } catch (error) {
        console.error('Error:', error);
        Swal.fire('Error', 'Error al eliminar usuario', 'error');
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditData({ ...user });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    const result = await Swal.fire({
      title: '¿Guardar cambios?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    });
    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/usuarios/${editData.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            nombreCompleto: editData.nombreCompleto || editData.nombre,
            email: editData.email,
            tipo_usuario: editData.tipo_usuario,
            estado: editData.estado,
            edad: editData.edad,
            telefono: editData.telefono,
            fecha_nacimiento: editData.fecha_nacimiento,
            password: editData.password
          })
        });
        if (response.ok) {
          setUserList(userList.map(u => u.id === editData.id ? { ...editData } : u));
          setEditingUser(null);
          Swal.fire('Guardado', 'Los datos del usuario han sido actualizados.', 'success');
        } else {
          const error = await response.json();
          Swal.fire('Error', error.error || 'No se pudo actualizar el usuario', 'error');
        }
      } catch (error) {
        console.error('Error:', error);
        Swal.fire('Error', 'Error al actualizar usuario', 'error');
      }
    }
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateSave = async (e) => {
    e.preventDefault();
    if (createData.tipo_usuario === 'familiar' && !createData.paciente_asignado_id) {
      Swal.fire('Error', 'Debes asignar un paciente al familiar.', 'error');
      return;
    }
    try {
      const response = await fetch('/api/usuarios', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: createData.username,
          nombreCompleto: createData.nombreCompleto,
          email: createData.email,
          password: createData.password,
          tipo_usuario: createData.tipo_usuario,
          estado: createData.estado,
          edad: createData.edad,
          telefono: createData.telefono,
          fecha_nacimiento: createData.fecha_nacimiento
        })
      });
      if (response.ok) {
        const newUser = await response.json();
        if (createData.tipo_usuario === 'familiar') {
          const assignResponse = await fetch('/api/familiares/asignar', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              familiar_usuario_id: newUser.id,
              paciente_id: createData.paciente_asignado_id,
            })
          });

          if (!assignResponse.ok) {
            const assignError = await assignResponse.json().catch(() => ({}));
            throw new Error(assignError.error || 'No se pudo asignar el paciente al familiar');
          }
        }

        const createdUser = {
          ...newUser,
          nombreCompleto: newUser.nombre || createData.nombreCompleto,
          id: newUser.id
        };
        setUserList([...userList, createdUser]);
        setShowCreate(false);
        setCreateData({ username: '', nombreCompleto: '', email: '', password: '', tipo_usuario: 'paciente', estado: 'activo', edad: '', telefono: '', fecha_nacimiento: '', paciente_asignado_id: '' });
        Swal.fire('Creado', 'El usuario ha sido creado.', 'success');
      } else {
        const error = await response.json();
        Swal.fire('Error', error.error || 'No se pudo crear el usuario', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error', 'Error al crear usuario', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Logo className="w-12 h-12" />
          <h1 className="text-white text-3xl font-bold">GESTIÓN DE USUARIOS</h1>
          <button onClick={logout} className="ml-auto bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold shadow">
            Cerrar sesión
          </button>
          <button onClick={() => setShowCreate(true)} className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold shadow flex items-center gap-2 ml-4">
            <UserPlus size={20} /> Crear usuario
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-xl p-6">
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar usuario por nombre o email..."
                className="w-full pl-4 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Cargando usuarios...</div>
            ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-300">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Rol</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Correo</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-gray-800">{user.nombreCompleto}</div>
                    </td>
                    <td className="px-4 py-4 text-gray-700">
                      {user.tipo_usuario === 'paciente' ? 'Paciente' : user.tipo_usuario === 'healthcare' ? 'Doctor' : user.tipo_usuario === 'familiar' ? 'Familiar' : 'Admin'}
                    </td>
                    <td className="px-4 py-4 text-gray-700">{user.email}</td>
                    <td className="px-4 py-4 text-gray-700">
                      {user.estado === 'activo' ? 'Activo' : 'Inactivo'}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button onClick={() => handleEdit(user)} className="text-primary hover:text-blue-600 mr-2">
                        <Pencil size={20} />
                      </button>
                      <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:text-red-700">
                        <Trash size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            )}
          </div>
        </div>
        {editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
              <button onClick={() => setEditingUser(null)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500">
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold mb-4">Editar Usuario</h2>
              <form onSubmit={handleEditSave} className="space-y-4">
                <input name="nombreCompleto" type="text" value={editData.nombreCompleto || editData.nombre || ''} onChange={handleEditChange} placeholder="Nombre completo" className="w-full px-4 py-2 border rounded" />
                <input name="email" type="email" value={editData.email || ''} onChange={handleEditChange} placeholder="Correo electrónico" className="w-full px-4 py-2 border rounded" />
                <select name="tipo_usuario" value={editData.tipo_usuario || 'paciente'} onChange={handleEditChange} className="w-full px-4 py-2 border rounded">
                  <option value="paciente">Paciente</option>
                  <option value="healthcare">Doctor</option>
                  <option value="familiar">Familiar</option>
                  <option value="admin">Admin</option>
                </select>
                <input name="edad" type="number" value={editData.edad || ''} onChange={handleEditChange} placeholder="Edad" className="w-full px-4 py-2 border rounded" />
                <input name="telefono" type="text" value={editData.telefono || ''} onChange={handleEditChange} placeholder="Teléfono" className="w-full px-4 py-2 border rounded" />
                <input name="fecha_nacimiento" type="date" value={editData.fecha_nacimiento || ''} onChange={handleEditChange} className="w-full px-4 py-2 border rounded" />
                <select name="estado" value={editData.estado || 'activo'} onChange={handleEditChange} className="w-full px-4 py-2 border rounded">
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
                <input name="password" type="password" value={editData.password || ''} onChange={handleEditChange} placeholder="Contraseña (dejar vacío para no cambiar)" className="w-full px-4 py-2 border rounded" />
                <button type="submit" className="w-full bg-primary text-white px-6 py-2 rounded">Guardar Cambios</button>
              </form>
            </div>
          </div>
        )}
        {showCreate && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
              <button onClick={() => setShowCreate(false)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500">
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold mb-4">Crear Usuario</h2>
              <form onSubmit={handleCreateSave} className="space-y-4">
                <input name="username" type="text" value={createData.username} onChange={handleCreateChange} placeholder="Usuario (nombre de usuario)" className="w-full px-4 py-2 border rounded" required />
                <input name="nombreCompleto" type="text" value={createData.nombreCompleto} onChange={handleCreateChange} placeholder="Nombre completo" className="w-full px-4 py-2 border rounded" required />
                <input name="email" type="email" value={createData.email} onChange={handleCreateChange} placeholder="Correo electrónico" className="w-full px-4 py-2 border rounded" required />
                <input name="password" type="password" value={createData.password} onChange={handleCreateChange} placeholder="Contraseña" className="w-full px-4 py-2 border rounded" required />
                <select name="tipo_usuario" value={createData.tipo_usuario} onChange={handleCreateChange} className="w-full px-4 py-2 border rounded">
                  <option value="paciente">Paciente</option>
                  <option value="healthcare">Doctor</option>
                  <option value="familiar">Familiar</option>
                  <option value="admin">Admin</option>
                </select>
                {createData.tipo_usuario === 'familiar' && (
                  <select
                    name="paciente_asignado_id"
                    value={createData.paciente_asignado_id}
                    onChange={handleCreateChange}
                    className="w-full px-4 py-2 border rounded"
                    required={createData.tipo_usuario === 'familiar'}
                  >
                    <option value="">Seleccionar paciente asignado</option>
                    {patientOptions.map(patient => (
                      <option key={patient.id} value={patient.id}>{patient.name}</option>
                    ))}
                  </select>
                )}
                <input name="edad" type="number" value={createData.edad} onChange={handleCreateChange} placeholder="Edad" className="w-full px-4 py-2 border rounded" />
                <input name="telefono" type="text" value={createData.telefono} onChange={handleCreateChange} placeholder="Teléfono" className="w-full px-4 py-2 border rounded" />
                <input name="fecha_nacimiento" type="date" value={createData.fecha_nacimiento} onChange={handleCreateChange} className="w-full px-4 py-2 border rounded" />
                <select name="estado" value={createData.estado} onChange={handleCreateChange} className="w-full px-4 py-2 border rounded">
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
                <button type="submit" className="w-full bg-primary text-white px-6 py-2 rounded">Crear Usuario</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

