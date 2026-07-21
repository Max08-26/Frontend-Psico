import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PasswordRecovery({ onDone }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError(''); setMessage('');
    const res = await fetch('/api/auth/reset-password-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(data.message);
      setStep(2);
    } else {
      setError(data.error || 'Error solicitando código');
    }
  };

  const handleValidateCode = async (e) => {
    e.preventDefault();
    setError(''); setMessage('');
    if (!code || code.trim().length === 0) {
      setError('Debes ingresar el código recibido por correo.');
      return;
    }
    const res = await fetch('/api/auth/validate-reset-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code })
    });
    const data = await res.json();
    if (res.ok) {
      setMessage('Código válido. Ahora ingresa tu nueva contraseña.');
      setStep(3);
    } else {
      setError(data.error || 'Código inválido');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(''); setMessage('');
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, password })
    });
    const data = await res.json();
    if (res.ok) {
      setMessage('Contraseña restablecida correctamente. Redirigiendo al login...');
      setStep(4);
      setTimeout(() => {
        if (onDone) onDone();
        navigate('/');
      }, 2000);
    } else {
      setError(data.error || 'Error al restablecer contraseña');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Recuperar contraseña</h2>
      {step === 1 && (
        <form onSubmit={handleRequestCode} className="space-y-4">
          <input type="email" className="w-full border p-2 rounded" placeholder="Tu correo" value={email} onChange={e => setEmail(e.target.value)} required />
          <button className="w-full bg-primary text-white p-2 rounded" type="submit">Enviar código</button>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={handleValidateCode} className="space-y-4">
          <input type="text" className="w-full border p-2 rounded" placeholder="Código recibido" value={code} onChange={e => setCode(e.target.value)} required />
          <button className="w-full bg-primary text-white p-2 rounded" type="submit">Validar código</button>
        </form>
      )}
      {step === 3 && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <input type="password" className="w-full border p-2 rounded" placeholder="Nueva contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
          <button className="w-full bg-primary text-white p-2 rounded" type="submit">Restablecer contraseña</button>
        </form>
      )}
      {step === 4 && (
        <div className="text-green-600 font-semibold">{message}</div>
      )}
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {message && step !== 4 && <div className="text-green-600 mt-2">{message}</div>}
    </div>
  );
}

