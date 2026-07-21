import { createContext, useContext, useState, useEffect } from 'react';

const API_URL = '/api/auth/login';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [profesionalId, setProfesionalId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('biopsyche_user');
    const savedType = localStorage.getItem('biopsyche_userType');
    if (savedUser && savedType) {
      setUser(JSON.parse(savedUser));
      setUserType(savedType);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const savePacienteId = async () => {
      if (!user || String(userType).toLowerCase() !== 'paciente') return;
      const token = localStorage.getItem('biopsyche_token');
      try {
        const res = await fetch(`/api/pacientes/usuario/${user.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem('biopsyche_paciente_id', data.id);
        }
      } catch (err) {
      }
    };
    savePacienteId();
  }, [user, userType]);

  useEffect(() => {
    const saveFamiliarPacienteId = async () => {
      if (!user || String(userType).toLowerCase() !== 'familiar') return;
      const token = localStorage.getItem('biopsyche_token');
      try {
        const res = await fetch('/api/familiares/mi-paciente', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const pacienteId = data?.paciente_id || data?.Paciente?.id || data?.paciente?.id;
          if (pacienteId) {
            localStorage.setItem('biopsyche_familiar_paciente_id', pacienteId);
          }
        }
      } catch (err) {
      }
    };
    saveFamiliarPacienteId();
  }, [user, userType]);

  useEffect(() => {
    const loadProfesionalIfExists = async () => {
      if (!user || String(userType).toLowerCase() !== 'healthcare') return;
      const token = localStorage.getItem('biopsyche_token');
      try {
        const res = await fetch(`/api/profesionales/usuario/${user.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setProfesionalId(data.id);
        } else {
          setProfesionalId(null);
        }
      } catch (err) {
        setProfesionalId(null);
      }
    };
    loadProfesionalIfExists();
  }, [user, userType]);

  const login = async (credentials, _type) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credentials.usernameOrEmail,
          password: credentials.password
        })
      });
      let data = null;
      try {
        data = await res.json();
      } catch (jsonErr) {
        return { success: false, error: 'Respuesta inválida del servidor (no es JSON)' };
      }
      if (!res.ok) {
        const res2 = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: '',
            username: credentials.usernameOrEmail,
            password: credentials.password
          })
        });
        let data2 = null;
        try {
          data2 = await res2.json();
        } catch (jsonErr2) {
          return { success: false, error: 'Respuesta inválida del servidor (no es JSON)' };
        }
        if (!res2.ok) throw new Error(data2.error || 'Error de autenticación');
        setUser(data2.user);
        let tipo2 = data2.user.tipo_usuario;
        if (String(tipo2).toLowerCase() === 'paciente') tipo2 = 'patient';
        setUserType(tipo2);
        localStorage.setItem('biopsyche_user', JSON.stringify(data2.user));
        localStorage.setItem('biopsyche_userType', tipo2);
        localStorage.setItem('biopsyche_token', data2.token);
        return { success: true };
      }
      setUser(data.user);
      let tipo = data.user.tipo_usuario;
      if (String(tipo).toLowerCase() === 'paciente') tipo = 'patient';
      setUserType(tipo);
      localStorage.setItem('biopsyche_user', JSON.stringify(data.user));
      localStorage.setItem('biopsyche_userType', tipo);
      localStorage.setItem('biopsyche_token', data.token);
      if (String(tipo).toLowerCase() === 'patient' || String(tipo).toLowerCase() === 'paciente') {
        try {
          const token = data.token;
          const user = data.user;
          if (user && user.id && token) {
            const res = await fetch(`/api/pacientes/usuario/${user.id}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
              const paciente = await res.json();
              localStorage.setItem('biopsyche_paciente_id', paciente.id);
            }
          }
        } catch (err) {
        }
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    setProfesionalId(null);
    localStorage.removeItem('biopsyche_user');
    localStorage.removeItem('biopsyche_userType');
    localStorage.removeItem('biopsyche_token');
    localStorage.removeItem('biopsyche_paciente_id');
    localStorage.removeItem('biopsyche_familiar_paciente_id');
  };

  const register = async (userData, type) => {
    const tipoBackend = String(type).toLowerCase() === 'patient' ? 'paciente' : String(type).toLowerCase();
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          password: userData.password,
          nombreCompleto: userData.nombreCompleto,
          edad: userData.edad ? Number(userData.edad) : null,
          telefono: userData.telefono,
          tipo_usuario: tipoBackend,
          direccion: userData.direccion,
          nombre_tutor: userData.nombreTutor,
          celular_tutor: userData.celTutor,
          psicologo_tratante: userData.psicologoTratante,
        }),
      });
      let data = null;
      try {
        data = await res.json();
      } catch (jsonErr) {
        return { success: false, error: 'Respuesta inválida del servidor (no es JSON)' };
      }
      if (!res.ok) {
        return { success: false, error: data.error || 'Error en el registro' };
      }

      setUser(data.user);
      setUserType(type);
      localStorage.setItem('biopsyche_user', JSON.stringify(data.user));
      localStorage.setItem('biopsyche_userType', type);
      localStorage.setItem('biopsyche_token', data.token);
      if (data.paciente_id) {
        localStorage.setItem('biopsyche_paciente_id', data.paciente_id);
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const token = localStorage.getItem('biopsyche_token');

  return (
    <AuthContext.Provider value={{ user, userType, profesionalId, login, logout, register, loading, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

