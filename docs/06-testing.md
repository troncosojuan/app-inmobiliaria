# Testing & QA

Documento vivo de casos de prueba, bugs encontrados y feedback de uso real.
Actualizar cada vez que se encuentra un comportamiento inesperado o se valida un flujo.

> **Última actualización**: 2026-02-23

---

## Cómo usar este documento

- ✅ = Testeado y funciona
- ❌ = Bug encontrado (agregar detalle abajo en "Bugs registrados")
- ⏳ = Pendiente de testear
- ⚠️ = Funciona pero con comportamiento raro o mejorable

---

## 1. Flujo del visitante (sitio público)

### 1.1 Home
| # | Caso | Estado | Notas |
|---|------|--------|-------|
| 1.1.1 | La home carga correctamente con el tenant correcto | ⏳ | |
| 1.1.2 | Se muestran propiedades destacadas | ⏳ | |
| 1.1.3 | El color primario del tenant se aplica en la UI | ⏳ | |
| 1.1.4 | El navbar muestra el nombre/logo del tenant | ⏳ | |
| 1.1.5 | El scroll vertical funciona en mobile (cards) | ✅ | Fix aplicado 2026-02-23 |
| 1.1.6 | Dark mode funciona y persiste al recargar | ⏳ | |

### 1.2 Listado de propiedades (`/propiedades`)
| # | Caso | Estado | Notas |
|---|------|--------|-------|
| 1.2.1 | Se listan las propiedades del tenant | ⏳ | |
| 1.2.2 | Filtro por tipo de operación (venta/alquiler) | ⏳ | |
| 1.2.3 | Filtro por tipo de propiedad (casa/depto/etc.) | ⏳ | |
| 1.2.4 | Filtro por precio mínimo/máximo | ⏳ | |
| 1.2.5 | Filtro por dormitorios | ⏳ | |
| 1.2.6 | Filtro por ciudad/zona | ⏳ | |
| 1.2.7 | Combinar múltiples filtros | ⏳ | |
| 1.2.8 | Sin resultados muestra estado vacío | ⏳ | |
| 1.2.9 | Los filtros se sincronizan con la URL (compartibles) | ⏳ | |
| 1.2.10 | Scroll vertical funciona en mobile | ⏳ | |

### 1.3 Detalle de propiedad (`/propiedades/[slug]`)
| # | Caso | Estado | Notas |
|---|------|--------|-------|
| 1.3.1 | Carga correctamente con todas las fotos | ⏳ | |
| 1.3.2 | Galería fullscreen / lightbox funciona | ⏳ | |
| 1.3.3 | Datos de la propiedad se muestran correctamente | ⏳ | |
| 1.3.4 | Sección de propiedades similares aparece | ⏳ | |
| 1.3.5 | Botón de WhatsApp lleva al número correcto | ⏳ | |
| 1.3.6 | Formulario de contacto envía el lead | ⏳ | |
| 1.3.7 | Validación del formulario (campos vacíos) | ⏳ | |
| 1.3.8 | Mensaje de confirmación post-envío | ⏳ | |
| 1.3.9 | Tour virtual se muestra si existe URL | ⏳ | |
| 1.3.10 | SEO: título y descripción correctos en la tab | ⏳ | |

### 1.4 Mapa (`/mapa`)
| # | Caso | Estado | Notas |
|---|------|--------|-------|
| 1.4.1 | Mapa carga con los marcadores | ⏳ | |
| 1.4.2 | Click en marcador muestra popup con info | ⏳ | |
| 1.4.3 | Link del popup lleva al detalle de la propiedad | ⏳ | |
| 1.4.4 | Filtros de tipo/operación funcionan en el mapa | ⏳ | |

### 1.5 Favoritos (`/favoritos`)
| # | Caso | Estado | Notas |
|---|------|--------|-------|
| 1.5.1 | Agregar propiedad a favoritos desde el listado | ⏳ | |
| 1.5.2 | Contador de favoritos en navbar se actualiza | ⏳ | |
| 1.5.3 | Favoritos persisten al recargar la página | ⏳ | |
| 1.5.4 | Comparador lado a lado funciona (hasta 3) | ⏳ | |
| 1.5.5 | Eliminar de favoritos | ⏳ | |

---

## 2. Flujo del admin de plataforma (panel admin)

### 2.1 Autenticación
| # | Caso | Estado | Notas |
|---|------|--------|-------|
| 2.1.1 | Login con `admin@platform.com` funciona | ⏳ | |
| 2.1.2 | Login con credenciales incorrectas muestra error | ⏳ | |
| 2.1.3 | Redirige a `/login` si no está autenticado | ⏳ | |

### 2.2 Gestión de tenants
| # | Caso | Estado | Notas |
|---|------|--------|-------|
| 2.2.1 | Listado de tenants se muestra correctamente | ⏳ | |
| 2.2.2 | Crear nuevo tenant con todos los campos | ⏳ | |
| 2.2.3 | Slug se genera automáticamente del nombre | ⏳ | |
| 2.2.4 | Validación de slug duplicado | ⏳ | |
| 2.2.5 | Se crea el usuario admin del tenant automáticamente | ⏳ | |
| 2.2.6 | Activar/desactivar tenant | ⏳ | |
| 2.2.7 | El tenant nuevo es accesible inmediatamente | ⏳ | |

---

## 3. Flujo del admin de tenant (dashboard)

### 3.1 Autenticación
| # | Caso | Estado | Notas |
|---|------|--------|-------|
| 3.1.1 | Login con credenciales del tenant funciona | ⏳ | |
| 3.1.2 | No puede acceder a datos de otro tenant | ⏳ | |
| 3.1.3 | Sesión expira correctamente | ⏳ | |

### 3.2 Dashboard principal
| # | Caso | Estado | Notas |
|---|------|--------|-------|
| 3.2.1 | Métricas se cargan (propiedades, leads, vistas) | ⏳ | |
| 3.2.2 | Gráficos de analytics se renderizan | ⏳ | |
| 3.2.3 | Accesos rápidos funcionan | ⏳ | |

### 3.3 Propiedades
| # | Caso | Estado | Notas |
|---|------|--------|-------|
| 3.3.1 | Listado de propiedades del tenant | ⏳ | |
| 3.3.2 | Crear propiedad con todos los campos | ⏳ | |
| 3.3.3 | Subir imágenes (se convierten a WebP) | ⏳ | |
| 3.3.4 | Reordenar imágenes con drag & drop | ⏳ | |
| 3.3.5 | Editar propiedad existente | ⏳ | |
| 3.3.6 | Pausar/activar propiedad | ⏳ | |
| 3.3.7 | Eliminar propiedad | ⏳ | |
| 3.3.8 | La propiedad aparece en el sitio público al publicar | ⏳ | |
| 3.3.9 | La propiedad desaparece del sitio al pausar | ⏳ | |
| 3.3.10 | Importar propiedades desde CSV | ⏳ | |

### 3.4 Leads / CRM
| # | Caso | Estado | Notas |
|---|------|--------|-------|
| 3.4.1 | Lead nuevo aparece cuando visitante contacta | ⏳ | |
| 3.4.2 | Notificación por email al agente | ⏳ | |
| 3.4.3 | Mover lead entre estados en el Kanban | ⏳ | |
| 3.4.4 | Agregar nota a un lead | ⏳ | |
| 3.4.5 | Asignar lead a un agente | ⏳ | |
| 3.4.6 | Vista tabla de leads funciona | ⏳ | |

### 3.5 Configuración del tenant
| # | Caso | Estado | Notas |
|---|------|--------|-------|
| 3.5.1 | Cambiar colores y se reflejan en el sitio | ⏳ | |
| 3.5.2 | Subir logo | ⏳ | |
| 3.5.3 | Actualizar datos de contacto | ⏳ | |
| 3.5.4 | Actualizar redes sociales | ⏳ | |

### 3.6 Herramientas financieras
| # | Caso | Estado | Notas |
|---|------|--------|-------|
| 3.6.1 | Calculadora de comisiones funciona | ⏳ | |
| 3.6.2 | Calculadora de rendimiento de alquiler | ⏳ | |
| 3.6.3 | Ajuste por IPC | ⏳ | |

---

## 4. Bugs registrados

> Formato: **[FECHA] Título** — descripción, pasos para reproducir, severidad (Alta/Media/Baja)

| Fecha | Descripción | Severidad | Estado |
|-------|-------------|-----------|--------|
| 2026-02-23 | Scroll vertical bloqueado en cards de propiedades en mobile | Baja | ✅ Resuelto |

---

## 5. Feedback de uso real

> Comportamientos inesperados, confusión del usuario, sugerencias surgidas del uso real.

| Fecha | Quién | Observación | Acción |
|-------|-------|-------------|--------|
| | | | |

---

## 6. Casos de uso no contemplados

> Usos que el sistema no maneja bien o para los que no fue diseñado originalmente.

| Fecha | Descripción | Impacto | Prioridad |
|-------|-------------|---------|-----------|
| | | | |
