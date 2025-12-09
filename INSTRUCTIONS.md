# Guía de Implementación y Migración del Dashboard

Este documento explica cómo funcionan los datos simulados (mock data) actuales del dashboard y cómo reemplazarlos con endpoints reales de su backend.

## Arquitectura Actual (Mock Data)

El dashboard opera actualmente utilizando **Next.js API Routes** para simular un backend. Los componentes del frontend realizan peticiones HTTP a estos endpoints locales, los cuales devuelven datos simulados generados.

### Archivos Clave

*   **Componentes Frontend**:
    *   `app/components/dashboard/charts/*.tsx`: Los componentes de gráficos (BarTile, DonutTile, etc.) que obtienen los datos.
    *   `app/page.tsx`: La página principal del dashboard.
*   **Endpoints de API Mock**:
    *   `app/api/v1/locations/route.ts`: Devuelve la lista de ubicaciones y rutas.
    *   `app/api/v1/dashboard/data/route.ts`: Devuelve datos analíticos agregados (ventas, visitas, etc.).

## Flujo de Datos

1.  **Carga de Página**: `app/page.tsx` llama a `/api/v1/locations` para poblar los selectores de ubicación/ruta.
2.  **Carga de Gráficos**: Cada tarjeta (ej. `BarTile`) llama independientemente a `/api/v1/dashboard/data` con parámetros específicos (ej. `buckets=locations`, `stat_field=total`).
3.  **Visualización**: Los componentes reciben los datos JSON y los renderizan utilizando `echarts`.

## Cómo Cambiar a Datos Reales

Cuando tenga sus endpoints de backend reales listos, no necesita cambiar los componentes del frontend. Solo necesita actualizar los manejadores de rutas API para actuar como un **proxy** o simplemente redirigir las llamadas.

### Opción 1: Proxy hacia Backend Externo (Recomendado)

Mantenga la estructura de `app/api/v1/...` pero cambie el código para obtener datos de su backend real.

**Ejemplo de Modificación para `app/api/v1/dashboard/data/route.ts`:**

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    
    // Reenvíe la petición a su backend real
    // process.env.BACKEND_URL debe estar definido en .env
    const backendUrl = `${process.env.BACKEND_URL}/api/dashboard-data?${searchParams.toString()}`;
    
    try {
        const res = await fetch(backendUrl, {
            headers: {
                // Pase tokens de autenticación si es necesario
                'Authorization': request.headers.get('Authorization') || '',
            }
        });
        
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Error al obtener datos' }, { status: 500 });
    }
}
```

### Opción 2: Reemplazo Directo

Si su backend está verificado y CORS está configurado, puede cambiar las URLs en los componentes del frontend directamente.

1.  Abra `app/components/dashboard/charts/BarTile.tsx` (y otras tarjetas).
2.  Encuentre la llamada `axios.get('/api/v1/dashboard/data', ...)`.
3.  Reemplace `/api/v1/dashboard/data` con la URL de su endpoint real.

## Estructura de Datos Esperada

Para asegurar que los gráficos sigan funcionando, su backend real debe devolver datos en este formato:

**Respuesta de Datos del Dashboard:**
```json
{
  "aggregations": {
    "locations": {
      "buckets": [
        { "key": "Centro", "count": 120, "sum": 5000, "total": 5000 },
        { "key": "Norte", "count": 80, "sum": 3000, "total": 3000 }
      ],
      "overall": { "count": 200, "sum": 8000 }
    },
    "hour": {
      "buckets": [
        { "key": "2023-10-27T10:00:00Z", "total": 500 },
        ...
      ]
    }
  }
}
```

**Respuesta de Ubicaciones:**
```json
[
  {
    "location_id": 1,
    "name": "Tienda A",
    "routes": [
      { "route_id": 10, "name": "Ruta 1" }
    ]
  }
]
```
