import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Check, Save } from 'lucide-react';
import Swal from 'sweetalert2';
import Logo from '../../components/common/Logo';

const Medication = () => {
    const [error, setError] = useState("");
    const catalogoMedicamentos = [
{ clave: '6298', nombre: 'Alprazolam 0.5 mg' },
{ clave: '2500', nombre: 'Alprazolam 0.25 mg' },
{ clave: '2499', nombre: 'Alprazolam 2 mg' },
{ clave: '3305', nombre: 'Amitriptilina 25 mg' },
{ clave: '4482', nombre: 'Bromazepam 3 mg' },
{ clave: '2612', nombre: 'Clonazepam 2 mg' },
{ clave: '3259', nombre: 'Clozapina 100 mg' },
{ clave: '3259.01', nombre: 'Clozapina 100 mg' },
{ clave: '3215', nombre: 'Diazepam 10 mg' },
{ clave: '2673', nombre: 'Ergotamina y cafeína 1 mg/100 mg' },
{ clave: '3253', nombre: 'Haloperidol Solución Inyectable 5 mg' },
{ clave: '3302', nombre: 'Imipramina 25 mg' },
{ clave: '4129', nombre: 'Isotretinoína 20 mg' },
{ clave: '3255', nombre: 'Carbonato de Litio 300 mg' },
{ clave: '5478', nombre: 'Lorazepam 1 mg' },
{ clave: '5351', nombre: 'Metilfenidato 10 mg' },
{ clave: '4470.01', nombre: 'Metilfenidato 18 mg' },
{ clave: '4471.01', nombre: 'Metilfenidato 27 mg' },
{ clave: '4472.01', nombre: 'Metilfenidato 36 mg' },
{ clave: '2126', nombre: 'Aciclovir 400 mg' },
{ clave: '101', nombre: 'Ácido acetilsalicílico 500 mg' },
{ clave: '1706.01', nombre: 'Ácido fólico 5 mg' },
{ clave: '3674', nombre: 'Agua Inyectable 10 ml' },
{ clave: '1344', nombre: 'Albendazol 200 mg' },
{ clave: '1345', nombre: 'Albendazol Suspensión Oral 400 mg' },
{ clave: '3451', nombre: 'Alopurinol 300 mg' },
{ clave: '1224', nombre: 'Aluminio y magnesio Suspensión Oral' },
{ clave: '2463', nombre: 'Ambroxol Solución 300 mg' },
{ clave: '1956.01', nombre: 'Amikacina Solución Inyectable 500 mg' },
{ clave: '5800', nombre: 'Amlodipino/Valsartan/Hidroclorotiazida 5mg/160mg/12.5 mg' },
{ clave: '2111.01', nombre: 'Amlodipino 5 mg' },
{ clave: '6281', nombre: 'Amoxicilina/Ácido Clavulánico 875 mg/125 mg' },
{ clave: '2129', nombre: 'Amoxicilina ácido clavulánico Suspensión 125 mg' },
{ clave: '4490', nombre: 'Aripiprazol 15 mg' },
{ clave: '4492', nombre: 'Aripiprazol 30 mg' },
{ clave: '5106.01', nombre: 'Atorvastatina 20 mg' },
{ clave: '3307', nombre: 'Atomoxetina cápsulas 10 mg' },
{ clave: '6279', nombre: 'Azitromicina suspensión 200 mg/5 ml' },
{ clave: '1969', nombre: 'Azitromicina 500 mg' },
{ clave: '801', nombre: 'Baño coloide Polvo 20 mg' },
{ clave: '801.01', nombre: 'Baño coloide Polvo 20 mg' },
{ clave: '2433', nombre: 'Benzonatato 100 mg' },
{ clave: '2141', nombre: 'Betametasona Solución Inyectable 4 mg' },
{ clave: '655', nombre: 'Bezafibrato 200 mg' },
{ clave: '2652', nombre: 'Biperideno 2 mg' },
{ clave: '446', nombre: 'Budesonida-formoterol Polvo 180 mg/5 mg' },
{ clave: '113', nombre: 'Butilhosicina/Metamizol sódico 10 mg/250 mg' },
{ clave: '1206', nombre: 'Butilhosicina o hioscina 10 mg' },
{ clave: '1210.01', nombre: 'Bromuro de pinaverio 100 mg' },
{ clave: '5487.01', nombre: 'Citalopram 20 mg tabletas' },
{ clave: '2608', nombre: 'Carbamazepina 200 mg' },
{ clave: '1939', nombre: 'Cefalexina 500 mg' },
{ clave: '1937', nombre: 'Ceftriaxona Solución Inyectable 1 g' },
{ clave: '5505', nombre: 'Celecoxib 100 mg' },
{ clave: '5506', nombre: 'Celecoxib 200 mg' },
{ clave: '2147', nombre: 'Cisaprida 10 mg' },
{ clave: '2247', nombre: 'Cinitaprida 1 mg' },
{ clave: '6278', nombre: 'Claritromicina Suspensión 2.50 g' },
{ clave: '6280', nombre: 'Claritromicina 500 mg' },
{ clave: '402', nombre: 'Clorfenamina 4 mg' },
{ clave: '2471', nombre: 'Clorfenamina compuesta (paracetamol/cafeína/fenilefrina/clorexifeno)' },
{ clave: '2821', nombre: 'Cloranfenicol Solución oftálmica 5 mg' },
{ clave: '3610', nombre: 'Cloruro de sodio Solución Inyectable 0.9%' },
{ clave: '2176', nombre: 'Dexametasona Solución oftálmica 0.1 g' },
{ clave: '4241', nombre: 'Dexametasona Solución Inyectable 8 mg' },
{ clave: '3417', nombre: 'Diclofenaco sódico 100 mg' },
{ clave: '4408', nombre: 'Diclofenaco Solución oftálmica 1 mg' },
{ clave: '1927', nombre: 'Dicloxacilina Suspensión Oral 250 mg' },
{ clave: '3111', nombre: 'Difenidol 25 mg' },
{ clave: '3112', nombre: 'Difenidol Solución Inyectable 40 mg' },
{ clave: '592', nombre: 'Dinitrato de isosorbida 5 mg' },
{ clave: '477', nombre: 'Dipropionato de Beclometasona Suspensión aerosol' },
{ clave: '4364.01', nombre: 'Donepecilo 5 mg' },
{ clave: '4365.01', nombre: 'Donepecilo 10 mg' },
{ clave: '4485', nombre: 'Duloxetina 60 mg cápsulas' },
{ clave: '3622', nombre: 'Electrolitos Orales Polvo' },
{ clave: '6008', nombre: 'Empagliflozina 10 mg' },
{ clave: '2501', nombre: 'Enalapril 10 mg' },
{ clave: '4480.01', nombre: 'Escitalopram 10 mg' },
{ clave: '2304.01', nombre: 'Espironolactona 25 mg' },
{ clave: '2331', nombre: 'Fenazopiridina 100 mg' },
{ clave: '525', nombre: 'Fenitoína 100 mg' },
{ clave: '5267', nombre: 'Fluconazol 100 mg' },
{ clave: '811', nombre: 'Fluocinolona Crema 0.1 mg' },
{ clave: '440', nombre: 'Fluticasona aerosol 50 µg' },
{ clave: '5646', nombre: 'Fluticasona aerosol nasal 27.5 µg' },
{ clave: '1701', nombre: 'Fumarato ferroso 200 mg' },
{ clave: '2307', nombre: 'Furosemida 40 mg' },
{ clave: '4359', nombre: 'Gabapentina 300 mg' },
{ clave: '1278', nombre: 'Glicerol Supositorio 2.632 g' },
{ clave: '3605', nombre: 'Glucosa Solución Inyectable 10%' },
{ clave: '3251', nombre: 'Haloperidol 5 mg' },
{ clave: '2814', nombre: 'Hipromelosa Solución Oftálmica 0.5%' },
{ clave: '5941', nombre: 'Ibuprofeno 400 mg' },
{ clave: '5943', nombre: 'Ibuprofeno Suspensión Oral 2 g' },
{ clave: '3413', nombre: 'Indometacina 25 mg' },
{ clave: '2162', nombre: 'Ipratropio aerosol 0.286 mg' },
{ clave: '2187', nombre: 'Ipratropio Solución 25 mg' },
{ clave: '4097', nombre: 'Irbesartan-hidroclorotiazida 150 mg/12.5 mg' },
{ clave: '2018', nombre: 'Itraconazol 100 mg' },
{ clave: '3422', nombre: 'Ketorolaco 30 mg/ml inyectable' },
{ clave: '5662', nombre: 'Lacosamida 150 mg' },
{ clave: '6099', nombre: 'Lactulosa Jarabe 120 ml' },
{ clave: '6099.01', nombre: 'Lactulosa Jarabe 240 ml' },
{ clave: '5356', nombre: 'Lamotrigina 100 mg' },
{ clave: '5358', nombre: 'Lamotrigina 25 mg' },
{ clave: '2618', nombre: 'Levetiracetam 1.000 mg' },
{ clave: '2617', nombre: 'Levetiracetam 500 mg' },
{ clave: '3150', nombre: 'Levocetirizina 5 mg tabletas' },
{ clave: '2654', nombre: 'Levodopa y carbidopa 250 mg/25 mg' },
{ clave: '1007', nombre: 'Levotiroxina 100 µg' },
{ clave: '261', nombre: 'Lidocaína Solución Inyectable 1%' },
{ clave: '262', nombre: 'Lidocaína Solución Inyectable 2%' },
{ clave: '264', nombre: 'Lidocaína Solución al 10%' },
{ clave: '5741', nombre: 'Linagliptina/metformina 2.5 mg/850 mg' },
{ clave: '2520', nombre: 'Losartan 50 mg tabletas' },
{ clave: '4184', nombre: 'Loperamida 2 mg' },
{ clave: '2144', nombre: 'Loratadina 10 mg' },
{ clave: '2145', nombre: 'Loratadina Jarabe 100 mg' },
{ clave: '3423', nombre: 'Meloxicam 15 mg' },
{ clave: '108', nombre: 'Metamizol sódico 500 mg' },
{ clave: '109', nombre: 'Metamizol sódico Solución Inyectable 1 g' },
{ clave: '5165', nombre: 'Metformina 850 mg' },
{ clave: '1242', nombre: 'Metoclopramida 10 mg' },
{ clave: '1308.01', nombre: 'Metronidazol 500 mg' },
{ clave: '1561', nombre: 'Metronidazol Óvulo o Tableta Vaginal 500 mg' },
{ clave: '891', nombre: 'Miconazol 20 mg' },
{ clave: '5490', nombre: 'Mirtazapina 30 mg' },
{ clave: '4330', nombre: 'Montelukast 10 mg' },
{ clave: '4329', nombre: 'Montelukast 5 mg' },
{ clave: '2123', nombre: 'Mupirocina Ungüento 2 g' },
{ clave: '2804', nombre: 'Nafazolina Solución Oftálmica 1 mg' },
{ clave: '3407', nombre: 'Naproxeno 250 mg' },
{ clave: '599', nombre: 'Nifedipino 30 mg' },
{ clave: '1566', nombre: 'Nistatina tabletas vaginales 100,000 U' },
{ clave: '1911', nombre: 'Nitrofurantoína 100 mg' },
{ clave: '5186.01', nombre: 'Omeprazol 20 mg' },
{ clave: '5186.02', nombre: 'Omeprazol 20 mg' },
{ clave: '4583', nombre: 'Oseltamivir Cápsula 45 mg' },
{ clave: '4582', nombre: 'Oseltamivir Cápsula 75 mg' },
{ clave: '2627', nombre: 'Oxcarbazepina 600 mg tabletas' },
{ clave: '2626', nombre: 'Oxcarbazepina 300 mg tabletas' },
{ clave: '804', nombre: 'Óxido de Zinc 25 g' },
{ clave: '4131.01', nombre: 'Pimecrolimus crema 1%' },
{ clave: '104', nombre: 'Paracetamol 500 mg' },
{ clave: '106', nombre: 'Paracetamol gotas 100 mg/ml' },
{ clave: '5481', nombre: 'Paroxetina 20 mg' },
{ clave: '1271', nombre: 'Plántago Psyllium Polvo 49.7 g' },
{ clave: '4358.01', nombre: 'Pregabalina 150 mg' },
{ clave: '530', nombre: 'Propranolol 40 mg' },
{ clave: '5489', nombre: 'Quetiapina 100 mg' },
{ clave: '5494', nombre: 'Quetiapina 300 mg' },
{ clave: '3258', nombre: 'Risperidona 2 mg' },
{ clave: '4023', nombre: 'Rosuvastatina 10 mg' },
{ clave: '429', nombre: 'Salbutamol aerosol 20 mg' },
{ clave: '431', nombre: 'Salbutamol Jarabe 2 mg' },
{ clave: '443', nombre: 'Salmeterol/Fluticasona aerosol 25 µg' },
{ clave: '447', nombre: 'Salmeterol/Fluticasona Polvo 50 µg/500 µg' },
{ clave: '1272', nombre: 'Senosíodos a-b' },
{ clave: '5703.01', nombre: 'Sitagliptina/Metformin 50 mg/850 mg' },
{ clave: '6112', nombre: 'Sacubitril/Valsartan 50 mg' },
{ clave: '3616', nombre: 'Solución Hartmann Inyectable' },
{ clave: '1703', nombre: 'Sulfato ferroso 200 mg' },
{ clave: '5309.02', nombre: 'Tamsulosina liberación prolongada' },
{ clave: '2540', nombre: 'Telmisartán 40 mg' },
{ clave: '2189', nombre: 'Tobramicina Solución Oftálmica 3 mg' },
{ clave: '5363', nombre: 'Topiramato 100 mg' },
{ clave: '5365', nombre: 'Topiramato 25 mg' },
{ clave: '2714', nombre: 'Tiamina, Piridoxina, Clonocobalamina 100 mg, 5 mg' },
{ clave: '1903', nombre: 'Trimetoprima-Sulfametoxazol 80 mg/400 mg' },
{ clave: '1904', nombre: 'Trimetoprima-Sulfametoxazol Suspensión Oral 40 mg/24 h' },
{ clave: '2710', nombre: 'Vitaminas y minerales' },
{ clave: '2715', nombre: 'Vitamina E 400 mg' },
{ clave: '5488', nombre: 'Valproato semisódico 250 mg' },
{ clave: '2630', nombre: 'Valproato semisódico 500 mg' },
{ clave: '4488', nombre: 'Venlafaxina 75 mg' },
{ clave: '5484', nombre: 'Zuclopentixol tabletas 25 mg' },
{ clave: '5483', nombre: 'Zuclopentixol Solución Inyectable 200 mg' },
{ clave: '3268', nombre: 'Risperidona Suspensión Inyectable 25 mg' },
{ clave: '4158', nombre: 'Insulina glargina Solución Inyectable' },
{ clave: '1050.01', nombre: 'Insulina humana isófana Suspensión Inyectable' },
    ];
  const navigate = useNavigate();
  const [isSetup, setIsSetup] = useState(false);
  const [medications, setMedications] = useState([]);
  const [medicationTaken, setMedicationTaken] = useState([]);
  const token = localStorage.getItem('biopsyche_token');
  const pacienteId = localStorage.getItem('biopsyche_paciente_id');
  const [weekStartDate, setWeekStartDate] = useState(new Date());

  useEffect(() => {
    if (!pacienteId) return;

    const saved = localStorage.getItem(`medication_week_start_${pacienteId}`);
    if (saved) {
      setWeekStartDate(new Date(saved));
    }
  }, [pacienteId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const medsRes = await fetch(`/api/medicamentos?paciente_id=${pacienteId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        let medsData = medsRes.ok ? await medsRes.json() : [];

        const takenRes = await fetch(`/api/medicacion-tomada?paciente_id=${pacienteId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const takenData = takenRes.ok ? await takenRes.json() : [];
        setMedicationTaken(takenData);

        medsData = medsData.map(med => {
          let schedules = { morning: false, afternoon: false, night: false };
          try {
            schedules = typeof med.schedules === 'string'
              ? JSON.parse(med.schedules)
              : (med.schedules || {
                  morning: !!med.morning,
                  afternoon: !!med.afternoon,
                  night: !!med.night,
                });
          } catch (e) {
            schedules = {
              morning: !!med.morning,
              afternoon: !!med.afternoon,
              night: !!med.night,
            };
          }
          const taken = {};
          takenData.forEach(reg => {
            if (reg.medicamento_id === med.id && reg.tomado) {
              if (!taken[reg.dia_semana]) taken[reg.dia_semana] = {};
              taken[reg.dia_semana][reg.hora] = true;
            }
          });
          return { ...med, schedules, taken };
        });
        setMedications(medsData);
      } catch (err) {
        setMedications([]);
        setMedicationTaken([]);
      }
    };
    if (pacienteId && token) fetchData();
  }, [pacienteId, token]);

  useEffect(() => {
    if (!medications.length) return;

    const checkAndResetWeek = async () => {
      const now = new Date();
      const daysSinceStart = Math.floor((now - weekStartDate) / (1000 * 60 * 60 * 24));

      if (daysSinceStart >= 7) {
        await autoSaveAndResetWeekly();
      }
    };

    checkAndResetWeek();
  }, [medications, weekStartDate, pacienteId, token]);

  const [newMed, setNewMed] = useState({ name: '', morning: false, afternoon: false, night: false });
  const [selectedClave, setSelectedClave] = useState('');

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const times = [
    { key: 'morning', label: 'Mañana', time: '8:00 AM' },
    { key: 'afternoon', label: 'Tarde', time: '2:00 PM' },
    { key: 'night', label: 'Noche', time: '9:00 PM' },
  ];

  const handleAddMedication = () => {
    if (newMed.name && (newMed.morning || newMed.afternoon || newMed.night)) {
      const medCat = catalogoMedicamentos.find(m => m.nombre === newMed.name);
      const pacienteIdActual = localStorage.getItem('biopsyche_paciente_id');
      const body = {
        nombre: newMed.name,
        clave: medCat ? medCat.clave : '',
        paciente_id: pacienteIdActual,
        morning: newMed.morning,
        afternoon: newMed.afternoon,
        night: newMed.night
      };
      fetch('/api/medicamentos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      })
      .then(async res => {
        if (res.status === 403) {
          const errorText = await res.text();
          setError('No tienes permisos para agregar medicamentos.');
          console.error('Error 403 Forbidden al agregar medicamento:', errorText);
          return null;
        }
        if (!res.ok) {
          const errorText = await res.text();
          setError(`Error al agregar medicamento: ${res.status} - ${errorText}`);
          console.error(`Error al agregar medicamento: ${res.status} - ${errorText}`);
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (!data) return;
        data.schedules = data.schedules || { morning: false, afternoon: false, night: false };
        setMedications([...medications, data]);
        setNewMed({ name: '', morning: false, afternoon: false, night: false });
      })
      .catch(err => {
        setError('No se pudo agregar el medicamento.');
        console.error('Error al agregar medicamento:', err);
      });
    }
  };

  const handleRemoveMedication = (id) => {
    fetch(`/api/medicamentos/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(async (res) => {
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.error || 'No se pudo eliminar el medicamento.');
      }
      setMedications(medications.filter(med => med.id !== id));
      setMedicationTaken(medicationTaken.filter(reg => reg.medicamento_id !== id));
    })
    .catch((err) => {
      setError(err.message || 'No se pudo eliminar el medicamento.');
    });
  };

  const toggleMedicationTaken = (medId, day, time) => {
    const med = medications.find(m => m.id === medId);
    if (!med) return;
    const fecha = new Date();
    const body = {
      medicamento_id: medId,
      paciente_id: pacienteId,
      fecha: fecha.toISOString().slice(0,10),
      dia_semana: day,
      hora: time,
      tomado: true
    };
    fetch('/api/medicacion-tomada', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    })
    .then(async res => {
      if (!res.ok) {
        const errorText = await res.text();
        setError(`Error al guardar toma: ${res.status} - ${errorText}`);
        return null;
      }
      return res.json();
    })
    .then(data => {
      if (!data) return;
      setError('¡Toma guardada correctamente!');
      setMedications(medications.map(med => {
        if (med.id === medId) {
          const newTaken = { ...med.taken };
          if (!newTaken[day]) newTaken[day] = {};
          newTaken[day][time] = true;
          return { ...med, taken: newTaken };
        }
        return med;
      }));
    });
  };

  const autoSaveAndResetWeekly = async () => {
    try {
      let totalTomas = 0;
      let tomasTomadas = 0;

      medications.forEach(med => {
        dayKeys.forEach(day => {
          times.forEach(time => {
            if (med.schedules?.[time.key]) {
              totalTomas++;
              if (med.taken?.[day]?.[time.key]) {
                tomasTomadas++;
              }
            }
          });
        });
      });

      const porcentajeComplimiento = totalTomas > 0 ? Math.round((tomasTomadas / totalTomas) * 100) : 0;
      const allTaken = [];

      medications.forEach(med => {
        dayKeys.forEach(day => {
          times.forEach(time => {
            if (med.taken?.[day]?.[time.key]) {
              allTaken.push({
                medicamento_id: med.id,
                paciente_id: pacienteId,
                dia_semana: day,
                hora: time.key,
                tomado: true,
                fecha: new Date().toISOString().slice(0, 10)
              });
            }
          });
        });
      });

      if (allTaken.length > 0) {
        await Promise.all(
          allTaken.map(taken =>
            fetch('/api/medicacion-tomada', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(taken)
            })
          )
        );
      }

      const resetMedications = medications.map(med => ({ ...med, taken: {} }));
      setMedications(resetMedications);
      const newStartDate = new Date();
      setWeekStartDate(newStartDate);
      localStorage.setItem(`medication_week_start_${pacienteId}`, newStartDate.toISOString());

      setError(`✓ Semana guardada automáticamente con ${porcentajeComplimiento}% de cumplimiento. ¡Nuevo ciclo iniciado!`);
      Swal.fire({
        title: '✓ Ciclo Completado',
        html: `<div style="text-align: center;"><p><strong>Cumplimiento: ${porcentajeComplimiento}%</strong></p><p style="font-size: 0.9em;">Se guardó automáticamente.</p></div>`,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4A90E2',
        timer: 5000,
        timerProgressBar: true,
      });
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleSaveAndResetWeekly = async () => {
    try {

      let totalTomas = 0;
      let tomasTomadas = 0;

      medications.forEach(med => {
        dayKeys.forEach(day => {
          times.forEach(time => {
            if (med.schedules?.[time.key]) {
              totalTomas++;
              if (med.taken?.[day]?.[time.key]) {
                tomasTomadas++;
              }
            }
          });
        });
      });

      const porcentajeComplimiento = totalTomas > 0 ? Math.round((tomasTomadas / totalTomas) * 100) : 0;

      const result = await Swal.fire({
        title: '¿Guardar Semana?',
        html: `<div style="text-align: left;">
          <p><strong>Resumen de la Semana:</strong></p>
          <p>Tomas registradas: <strong>${tomasTomadas}/${totalTomas}</strong></p>
          <p>Cumplimiento: <strong style="color: ${porcentajeComplimiento >= 75 ? '#22C55E' : porcentajeComplimiento >= 50 ? '#F59E0B' : '#EF4444'}">${porcentajeComplimiento}%</strong></p>
          <p style="margin-top: 12px; font-size: 0.9em;">Se guardará esta información y se reiniciará el calendario.</p>
        </div>`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Guardar y Reiniciar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#22C55E',
        cancelButtonColor: '#6B7280',
      });

      if (!result.isConfirmed) return;

      const allTaken = [];
      medications.forEach(med => {
        dayKeys.forEach(day => {
          times.forEach(time => {
            if (med.taken?.[day]?.[time.key]) {
              allTaken.push({
                medicamento_id: med.id,
                paciente_id: pacienteId,
                dia_semana: day,
                hora: time.key,
                tomado: true,
                fecha: new Date().toISOString().slice(0, 10)
              });
            }
          });
        });
      });

      if (allTaken.length > 0) {
        await Promise.all(
          allTaken.map(taken =>
            fetch('/api/medicacion-tomada', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(taken)
            })
          )
        );
      }

      const resetMedications = medications.map(med => ({
        ...med,
        taken: {}
      }));
      setMedications(resetMedications);

      const newStartDate = new Date();
      setWeekStartDate(newStartDate);
      localStorage.setItem(`medication_week_start_${pacienteId}`, newStartDate.toISOString());

      setError(`¡Excelente! Semana guardada con ${porcentajeComplimiento}% de cumplimiento. Ciclo reiniciado.`);

      await Swal.fire({
        title: '¡Éxito!',
        html: `<div style="text-align: center;">
          <p style="font-size: 2em; color: #22C55E; margin: 0;">✓</p>
          <p><strong>Semana guardada correctamente</strong></p>
          <p>Cumplimiento: <strong>${porcentajeComplimiento}%</strong></p>
          <p style="font-size: 0.9em; margin-top: 12px;">El calendario se ha reiniciado para la próxima semana.</p>
        </div>`,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4A90E2',
      });

    } catch (err) {
      console.error('Error al guardar semana:', err);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo guardar la semana de medicación. Por favor, intenta de nuevo.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#FF6B6B',
      });
    }
  };

  if (!isSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate('/patient/dashboard')}
              className="text-white hover:text-primary transition-colors"
            >
              <ArrowLeft size={32} />
            </button>
            <Logo className="w-12 h-12" />
            <h1 className="text-white text-3xl font-bold">MEDICACIÓN</h1>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              ¿Qué medicamentos tomas?
            </h2>

            <div className="space-y-4 mb-6">
              {medications.map((med) => (
                <div key={med.id} className="border-2 border-gray-300 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-lg">{med.nombre || med.name}</h3>
                    <button
                      onClick={() => handleRemoveMedication(med.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <div className="flex gap-4">
                    {times.map(time => (
                      <label key={time.key} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={med.schedules && med.schedules[time.key]}
                          onChange={(e) => {
                            setMedications(medications.map(m =>
                              m.id === med.id
                                ? { ...m, schedules: { ...m.schedules, [time.key]: e.target.checked } }
                                : m
                            ));
                          }}
                          className="w-5 h-5"
                        />
                        <span>{time.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-3">Agregar nuevo medicamento</h3>
              <input
                type="text"
                list="medicamentos-list"
                value={newMed.name}
                onChange={e => {
                  setNewMed({ ...newMed, name: e.target.value });
                  const med = catalogoMedicamentos.find(m => m.nombre === e.target.value);
                  setSelectedClave(med ? med.clave : '');
                }}
                placeholder="Buscar y seleccionar medicamento..."
                className="w-full px-4 py-2 border-2 border-gray-300 rounded mb-3"
              />
              <datalist id="medicamentos-list">
                {catalogoMedicamentos.map(med => (
                  <option key={med.clave} value={med.nombre}>{med.nombre}</option>
                ))}
              </datalist>
              <div className="flex gap-4 mb-3">
                {times.map(time => (
                  <label key={time.key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newMed[time.key]}
                      onChange={(e) => setNewMed({ ...newMed, [time.key]: e.target.checked })}
                      className="w-5 h-5"
                    />
                    <span>{time.label}</span>
                  </label>
                ))}
              </div>
              <button
                onClick={handleAddMedication}
                className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Agregar Medicamento
              </button>
            </div>

            <button
              onClick={() => setIsSetup(true)}
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition-colors font-semibold"
            >
              Continuar al Calendario
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/patient/dashboard')}
            className="text-white hover:text-primary transition-colors"
          >
            <ArrowLeft size={32} />
          </button>
          <Logo className="w-12 h-12" />
          <h1 className="text-white text-3xl font-bold">CALENDARIO DE MEDICACIÓN</h1>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6 mb-4">
            {weekStartDate && (
              <div className="mb-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                {(() => {
                  const now = new Date();
                  const daysSinceStart = Math.floor((now - weekStartDate) / (1000 * 60 * 60 * 24));
                  const daysRemaining = Math.max(0, 7 - daysSinceStart);
                  const percentage = Math.round(((daysSinceStart % 7) / 7) * 100);

                  return (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-700">Progreso de la Semana</span>
                        <span className="text-sm text-gray-600">{daysRemaining} días restantes</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        {daysRemaining === 0
                          ? '✓ ¡Semana completada! Se reiniciará automáticamente pronto.'
                          : `Faltan ${daysRemaining} día${daysRemaining !== 1 ? 's' : ''} para el reinicio automático.`}
                      </p>
                    </div>
                  );
                })()}
              </div>
            )}

          <button
            onClick={() => setIsSetup(false)}
            className="mb-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors font-semibold flex items-center gap-2"
          >
            <Plus size={20} />
            Agregar o Quitar Medicamento
          </button>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border-2 border-gray-300 p-2 bg-gray-100">Medicamento</th>
                  {days.map((day) => (
                    <th key={day} className="border-2 border-gray-300 p-2 bg-gray-100 text-sm">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {medications.map((med) => (
                  times.filter(time => med.schedules?.[time.key]).map((time) => (
                    <tr key={`${med.id}-${time.key}`}>
                      <td className="border-2 border-gray-300 p-3 font-semibold">
                        {med.name}
                        <div className="text-xs text-gray-600">{time.label} - {time.time}</div>
                      </td>
                      {dayKeys.map((day) => {
                        const taken = med.taken?.[day]?.[time.key];
                        return (
                          <td key={day} className="border-2 border-gray-300 p-2 text-center">
                            <button
                              onClick={() => toggleMedicationTaken(med.id, day, time.key)}
                              className={`w-12 h-12 rounded-full border-2 transition-colors ${
                                taken
                                  ? 'bg-green-500 border-green-600 text-white'
                                  : 'bg-red-500 border-red-600 text-white hover:bg-red-600'
                              }`}
                            >
                              {taken && <Check size={24} className="mx-auto" />}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={() => setIsSetup(false)}
              className="flex-1 bg-primary text-white px-4 py-3 rounded-lg hover:bg-primary-dark transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Modificar Medicamentos
            </button>
            <button
              onClick={handleSaveAndResetWeekly}
              className="flex-1 bg-amber-500 text-white px-4 py-3 rounded-lg hover:bg-amber-600 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <Save size={20} />
              Reiniciar Manualmente Ahora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Medication;

