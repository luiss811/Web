import React, { useState } from 'react';
import { ShieldCheck, FileText, Scale, Lock } from 'lucide-react';

export const Legal: React.FC = () => {
  const [activeDoc, setActiveDoc] = useState<'privacy' | 'terms'>('privacy');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="md:col-span-1 space-y-3">
          <div className="p-4 rounded-2xl bg-mineral-100/50 dark:bg-mineral-900/30 border border-mineral-200/20 dark:border-mineral-800/20 mb-4">
            <span className="text-2xs font-bold text-mineral-400 uppercase tracking-wider block">Documentación Legal</span>
            <p className="text-[10px] text-mineral-500 leading-tight mt-1">Cumplimiento reglamentario conforme a las leyes mexicanas vigentes.</p>
          </div>
          
          <button
            onClick={() => setActiveDoc('privacy')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeDoc === 'privacy'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'bg-white dark:bg-mineral-900 text-mineral-600 dark:text-mineral-300 hover:bg-mineral-100 dark:hover:bg-mineral-800 border border-mineral-200/30 dark:border-mineral-800/30'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
            <span>Aviso de Privacidad</span>
          </button>

          <button
            onClick={() => setActiveDoc('terms')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeDoc === 'terms'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'bg-white dark:bg-mineral-900 text-mineral-600 dark:text-mineral-300 hover:bg-mineral-100 dark:hover:bg-mineral-800 border border-mineral-200/30 dark:border-mineral-800/30'
            }`}
          >
            <Scale className="w-5 h-5" />
            <span>Términos de Uso</span>
          </button>
        </div>

        {/* Document Content Display */}
        <div className="md:col-span-3 glass-card p-6 sm:p-10 space-y-6 text-mineral-700 dark:text-mineral-300 leading-relaxed text-sm">
          
          {activeDoc === 'privacy' ? (
            <article className="space-y-6">
              <div className="flex items-center space-x-3 border-b border-mineral-200/50 dark:border-mineral-800/50 pb-5">
                <Lock className="w-7 h-7 text-emerald-500" />
                <div>
                  <h1 className="text-2xl font-black font-display text-mineral-800 dark:text-mineral-100">
                    Aviso de Privacidad Simplificado
                  </h1>
                  <span className="text-2xs text-mineral-450 block font-mono mt-0.5">Última actualización: Mayo de 2026</span>
                </div>
              </div>

              <section className="space-y-4">
                <p>
                  <strong>MINERALIA S.A. de C.V.</strong>, con domicilio en Calle Geología Real #100, Querétaro, México (C.P. 76000), es responsable de recabar sus datos personales, del uso que se le dé a los mismos y de su protección, en estricto cumplimiento de la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP).
                </p>

                <h2 className="text-base font-bold text-mineral-800 dark:text-mineral-200 pt-2 font-display">1. Datos Personales Recabados</h2>
                <p>
                  Para llevar a cabo las finalidades descritas en el presente aviso de privacidad, utilizaremos los siguientes datos personales:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Nombre completo y apellidos.</li>
                  <li>Dirección de correo electrónico.</li>
                  <li>Teléfono de contacto (WhatsApp o llamadas).</li>
                  <li>Información de envío y facturación (sólo en procesos de e-commerce).</li>
                </ul>

                <h2 className="text-base font-bold text-mineral-800 dark:text-mineral-200 pt-2 font-display">2. Finalidades del Tratamiento de Datos</h2>
                <p>
                  Los datos personales que recabamos de usted se utilizarán para las siguientes finalidades secundarias y primarias:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Procesar su pedido en nuestra tienda en línea de especímenes minerales.</li>
                  <li>Proporcionar soporte técnico y responder sus consultas ingresadas en el formulario de contacto.</li>
                  <li>Envío de boletines educativos e informativos sobre mineralogía (previa aceptación del usuario).</li>
                </ul>

                <h2 className="text-base font-bold text-mineral-800 dark:text-mineral-200 pt-2 font-display">3. Derechos ARCO</h2>
                <p>
                  Usted tiene derecho a conocer qué datos personales tenemos de usted (Acceso), para qué los utilizamos (Rectificación), solicitar la eliminación de nuestros registros (Cancelación), u oponerse al uso de los mismos para fines específicos (Oposición). Para ejercer cualquiera de sus derechos ARCO, puede enviar una solicitud a nuestro correo oficial: <strong>lalitorios81@gmail.com</strong>.
                </p>

                <h2 className="text-base font-bold text-mineral-800 dark:text-mineral-200 pt-2 font-display">4. Uso de Cookies</h2>
                <p>
                  Le informamos que en nuestra página de internet utilizamos cookies y otras tecnologías para monitorear el comportamiento del tráfico orgánico, lo cual permite brindarle una mejor experiencia de navegación a través de nuestro panel de estadísticas integradas.
                </p>
              </section>
            </article>
          ) : (
            <article className="space-y-6">
              <div className="flex items-center space-x-3 border-b border-mineral-200/50 dark:border-mineral-800/50 pb-5">
                <FileText className="w-7 h-7 text-emerald-500" />
                <div>
                  <h1 className="text-2xl font-black font-display text-mineral-800 dark:text-mineral-100">
                    Términos y Condiciones de Uso
                  </h1>
                  <span className="text-2xs text-mineral-450 block font-mono mt-0.5">Última actualización: Mayo de 2026</span>
                </div>
              </div>

              <section className="space-y-4">
                <p>
                  Bienvenido al sitio web de <strong>Mineralia</strong>. Al acceder y navegar en este portal de e-commerce y catálogo educativo, usted acepta de manera tácita sujetarse a los siguientes Términos de Uso aquí descritos. Si no está de acuerdo con estos términos, le sugerimos abstenerse de utilizar el portal.
                </p>

                <h2 className="text-base font-bold text-mineral-800 dark:text-mineral-200 pt-2 font-display">1. Uso del Catálogo Científico</h2>
                <p>
                  Toda la información mostrada sobre las especies minerales (fórmulas cristaloquímicas, sistemas cristalinos, clasificaciones Dana o Strunz) se consulta directamente de fuentes públicas a través de la API oficial de GeoAPIs.io. Este contenido tiene fines educativos y de divulgación científica. Mineralia no se hace responsable de inconsistencias en los datos proporcionados por los endpoints externos.
                </p>

                <h2 className="text-base font-bold text-mineral-800 dark:text-mineral-200 pt-2 font-display">2. Propiedad Intelectual</h2>
                <p>
                  Las marcas, logotipos, combinaciones de colores, diseños visuales tridimensionales de cristales y código fuente del sitio son propiedad exclusiva de Mineralia o cuentan con licencia de uso. Queda estrictamente prohibida la reproducción parcial o total con fines comerciales sin autorización expresa por escrito.
                </p>

                <h2 className="text-base font-bold text-mineral-800 dark:text-mineral-200 pt-2 font-display">3. Transacciones Comerciales (Simuladas)</h2>
                <p>
                  La sección de E-Shop / Tienda opera bajo un protocolo de simulación didáctica. Ninguna transacción de cobro real se procesa a través del carrito de compras y las órdenes generadas representan flujos lógicos de demostración técnica. El stock y los precios asignados son simulados paramétricamente.
                </p>

                <h2 className="text-base font-bold text-mineral-800 dark:text-mineral-200 pt-2 font-display">4. Jurisdicción y Ley Aplicable</h2>
                <p>
                  Para la resolución de cualquier conflicto derivado de la interpretación y cumplimiento de estos Términos de Uso, las partes se someten expresamente a la jurisdicción de las leyes y tribunales competentes en la Ciudad de Santiago de Querétaro, Qro., México, renunciando a cualquier otro fuero que pudiera corresponderles por domicilio.
                </p>
              </section>
            </article>
          )}

        </div>

      </div>
    </div>
  );
};
