# Ideas

Listado de ideas para explorar. No están priorizadas ni validadas, son brainstorming.

---

## Producto

- **Comparador de propiedades**: Que el visitante pueda seleccionar 2-3 propiedades y verlas lado a lado (superficie, precio, ubicación, amenities)
- **Favoritos con link**: Sin login, guardar favoritos en localStorage y poder compartir el link con la lista
- **Alerta de propiedades**: El visitante deja su email + criterios y recibe notificación cuando se publica algo que matchea
- **QR en carteles**: Generar QR codes para que la inmobiliaria los ponga en los carteles de "Se Vende/Alquila" y lleven directo a la propiedad en el sitio
- **Calculadora de hipoteca/crédito**: Widget integrado en la página de cada propiedad
- **Integración con portales**: Publicar en ZonaProp, Argenprop, MercadoLibre desde el dashboard (API bidireccional)
- **Firma digital**: Integración con firma digital para contratos (DocuSign, Signatura)
- **Scoring de leads**: AI que califica leads automáticamente según el comportamiento (cuántas propiedades vio, si llamó, etc.)
- **Prototipo de web para el cliente**: Espacio donde el cliente pueda previsualizar cómo quedaría su sitio, ajustar colores/layout y proponer cambios antes de activar
- **Migración de datos asistida**: Herramienta que importe propiedades desde Excel, CSV, o scrapeando la web actual de la inmobiliaria con ayuda de AI
- **Cotización del dólar en tiempo real**: Mostrar la cotización del dólar (oficial/blue/MEP) de forma permanente y discreta en el dashboard del tenant. Útil para cálculos inmobiliarios. API gratuita: bluelytics.com.ar o dolarapi.com
- **Migración desde web anterior**: Herramienta que a partir de la URL de la web actual de la inmobiliaria scrapea las propiedades existentes con ayuda de AI y las importa al nuevo sistema. Reduciría el tiempo de onboarding de días a minutos.
- **Sistema de alertas de tareas**: Cuando se asigna una tarea a un agente/admin recibe una notificación. Configurable por usuario. Vista de tareas pendientes en el dashboard.
- **Dark/light mode para visitantes**: Toggle en el sitio público para que el visitante elija su preferencia de tema.

## Técnicas

- **Edge runtime**: Mover el middleware a Edge para menor latencia en resolución de tenant
- **ISR por tenant**: Regenerar páginas estáticas automáticamente cuando se actualiza una propiedad
- **Full-text search**: Implementar búsqueda con PostgreSQL full-text search o Meilisearch
- **WebSockets**: Notificaciones en tiempo real para el dashboard del tenant cuando llega un lead
- **PWA**: Que el sitio sea instalable como app en el celular del agente
- **Background jobs**: Cola de tareas para emails, procesamiento de imágenes, sincronización con portales (BullMQ + Redis)
- **A/B testing**: Framework para testear distintos layouts de homepage por tenant
- **CDN por tenant**: Subdominio de CDN para assets estáticos de cada tenant
- **API REST completa + docs**: Documentar API con Swagger/OpenAPI para integraciones externas
- **Google Maps / Mapbox autocompletado**: Integrar Places API para autocompletar dirección mientras se escribe y rellenar automáticamente ciudad, provincia, coordenadas.

## Monetización

- **Fotos profesionales**: Servicio adicional de fotografía profesional para propiedades (upsell)
- **Destacar en portales**: Cobrar extra por publicar en portales externos automáticamente
- **AI como add-on**: Vender features de AI como add-on al plan actual en vez de forzar upgrade
- **Referidos**: Programa de referidos entre inmobiliarias (descuento por traer otra)
- **Training/onboarding**: Sesiones pagas de capacitación para el equipo de la inmobiliaria
- **Marketplace de servicios**: Conectar inmobiliarias con fotógrafos, escrituras, mudanzas

## UX

- **Micro-animaciones**: Transiciones suaves al navegar entre propiedades (View Transitions API)
- **Infinite scroll**: Opción alternativa a paginación en el listado
- **Voice search**: Búsqueda por voz ("Departamento 2 ambientes en Palermo")
- **Onboarding guiado**: Tour interactivo la primera vez que la inmobiliaria entra al dashboard
- **Atajos de teclado**: Navegación rápida en el dashboard con shortcuts (Cmd+K, etc.)
- **Formulario de propiedades sin teclado**: Inputs numéricos tipo stepper (click +/-) para dormitorios, baños, cocheras. Amenities como buscador con checkboxes. Dirección con autocompletado Google Maps / Mapbox.
- **Buscador avanzado en home**: Select con tipos de propiedad (casa, depto, PH, etc.) en el buscador principal de la home además de los filtros actuales.
- **Buscador y filtros en tablas del admin**: Search + filtros en tablas de propiedades, leads y usuarios del dashboard.
- **Generación SEO con AI**: En el formulario de propiedades, botón para que AI genere título y descripción SEO basados en los datos cargados. El usuario puede editar el resultado.
