import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../../components/common/Logo';

const TLPInfo = () => {
  const navigate = useNavigate();
  const { userType } = useAuth();
  const [expandedSection, setExpandedSection] = useState(null);

  const backPath = String(userType || '').toLowerCase() === 'familiar' ? '/familiar/dashboard' : '/patient/dashboard';

  const sections = [
    {
      id: 1,
      title: '¿Qué es el TLP?',
      content: `El Trastorno Límite de la Personalidad (TLP) es un trastorno de salud mental que afecta la forma en que piensas y sientes acerca de ti mismo y de los demás, causando problemas en la vida cotidiana.

Según el CIE-10, se caracteriza por una marcada predisposición a actuar de manera impulsiva sin considerar las consecuencias, junto con un estado de ánimo inestable.`,
    },
    {
      id: 2,
      title: 'Síntomas Principales (CIE-10)',
      content: `• Esfuerzos frenéticos para evitar un abandono real o imaginado
• Patrón de relaciones interpersonales inestables e intensas
• Alteración de la identidad: imagen o sentido de sí mismo inestable
• Impulsividad en al menos dos áreas potencialmente dañinas
• Comportamientos, intentos o amenazas suicidas recurrentes
• Inestabilidad afectiva debida a una notable reactividad del estado de ánimo
• Sentimientos crónicos de vacío
• Ira inapropiada e intensa o dificultad para controlar la ira
• Ideación paranoide transitoria o síntomas disociativos graves`,
    },
    {
      id: 3,
      title: 'Terapia DBT (Terapia Dialéctico Conductual)',
      content: `La DBT es el tratamiento más efectivo para el TLP. Se enfoca en cuatro módulos principales:

1. Mindfulness (Atención Plena): Estar presente en el momento
2. Efectividad Interpersonal: Mejorar relaciones y comunicación
3. Regulación Emocional: Manejar emociones intensas
4. Tolerancia al Malestar: Sobrellevar situaciones difíciles sin empeorarlas`,
    },
    {
      id: 4,
      title: 'Habilidades de Mindfulness',
      content: `• Observa: Presta atención a tus experiencias sin juzgar
• Describe: Pon palabras a lo que observas
• Participa: Involúcrate completamente en actividades
• No juzgues: Acepta las cosas como son
• Mantén el enfoque: Haz una cosa a la vez
• Sé efectivo: Haz lo que funciona`,
    },
    {
      id: 5,
      title: 'Técnicas de Regulación Emocional',
      content: `• PLEASE: Cuida tu cuerpo (Physical illness, baLanced Eating, Avoid drugs, Sleep, Exercise)
• Acción Opuesta: Actúa de manera opuesta a tu impulso emocional
• Autovalidación: Reconoce y acepta tus emociones
• Mindfulness de emociones actuales: Observa tus emociones sin juzgarlas
• Resolución de problemas: Identifica y resuelve problemas que causan emociones`,
    },
    {
      id: 6,
      title: 'Tolerancia al Malestar',
      content: `Técnicas TIPP:
• Temperature (Temperatura): Usa agua fría en tu cara
• Intense exercise (Ejercicio intenso): Muévete vigorosamente
• Paced breathing (Respiración pausada): Respira lentamente
• Paired muscle relaxation (Relajación muscular): Tensa y relaja músculos

Técnicas de Distracción:
• Actividades placenteras
• Contribuir a otros
• Comparaciones que ayuden
• Generar otras emociones`,
    },
    {
      id: 7,
      title: 'Efectividad Interpersonal',
      content: `DEAR MAN (para pedir lo que necesitas):
• Describe la situación
• Express tus sentimientos
• Assert lo que quieres
• Reinforce explicando beneficios
• Mindful mantente enfocado
• Appear confident muestra confianza
• Negotiate negocia si es necesario

GIVE (para mantener relaciones):
• Gentle sé amable
• Interested muestra interés
• Validate valida
• Easy manner actitud relajada`,
    },
    {
      id: 8,
      title: 'Mitos sobre el TLP',
      content: `❌ "El TLP no tiene cura"
✓ El TLP es tratable y muchas personas mejoran significativamente

❌ "Las personas con TLP son manipuladoras"
✓ Los comportamientos son intentos de manejar emociones intensas

❌ "El TLP es solo drama de atención"
✓ Es un trastorno real que causa sufrimiento genuino

❌ "Nunca podrás tener relaciones estables"
✓ Con tratamiento, las relaciones pueden mejorar mucho`,
    },
    {
      id: 9,
      title: 'Recursos de Apoyo',
      content: `• Mantén contacto regular con tu terapeuta
• Únete a grupos de apoyo para TLP
• Practica las habilidades DBT diariamente
• Mantén una red de apoyo de personas comprensivas
• Usa aplicaciones de mindfulness y regulación emocional
• Lee libros sobre DBT y TLP
• Sé paciente contigo mismo - la recuperación es un proceso`,
    },
  ];

  const toggleSection = (id) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(backPath)}
            className="text-white hover:text-primary transition-colors"
          >
            <ArrowLeft size={32} />
          </button>
          <Logo className="w-12 h-12" />
          <h1 className="text-white text-2xl md:text-3xl font-bold">
            INFORMACIÓN SOBRE EL TLP
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
          <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <p className="text-gray-700">
              Esta información está basada en el Manual CIE-10 y el Manual de Terapia Dialéctico Conductual (DBT).
              Es para fines educativos y de apoyo. Siempre consulta con tu profesional de salud.
            </p>
          </div>

          <div className="space-y-4">
            {sections.map((section) => (
              <div
                key={section.id}
                className="border-2 border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <h2 className="text-lg font-semibold text-gray-800 text-left">
                    {section.title}
                  </h2>
                  {expandedSection === section.id ? (
                    <ChevronUp className="text-primary flex-shrink-0" size={24} />
                  ) : (
                    <ChevronDown className="text-primary flex-shrink-0" size={24} />
                  )}
                </button>

                {expandedSection === section.id && (
                  <div className="p-4 bg-white">
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-green-50 rounded-lg border-2 border-green-200">
            <h3 className="text-xl font-bold text-green-800 mb-3">
              Recuerda
            </h3>
            <p className="text-gray-700">
              La recuperación es posible. Con tratamiento adecuado, práctica constante de habilidades
              y apoyo profesional, muchas personas con TLP logran llevar vidas plenas y satisfactorias.
              Sé paciente y compasivo contigo mismo en este proceso.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TLPInfo;

