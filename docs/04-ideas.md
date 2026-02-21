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
