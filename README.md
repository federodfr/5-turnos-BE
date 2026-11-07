# 5-turnos-BE - Sistema de Gestión de Turnos (Arquitectura en Capas)

Quinta iteración del backend para la gestión de turnos y servicios. En este proyecto se refactoriza por completo la aplicación adoptando una **Arquitectura en Capas (Layered Architecture)** profesional basada en patrones de diseño como **Controller-Service-Repository-DAO**.

---

## 📋 Descripción y Nuevas Actualizaciones

En comparación con `4-turnos-BE`, esta versión elimina los antiguos *managers* monolíticos y distribuye la responsabilidad en capas desacopladas e independientes:

- **Enrutamiento (`Routes`)**: Captura las URLs y métodos HTTP.
- **Controladores (`Controllers`)**: Maneja el ciclo de vida de la petición HTTP (`req`, `res`).
- **Servicios (`Services`)**: Aplica las reglas del negocio y validaciones de dominio.
- **Repositorios (`Repositories`)**: Abstrae las fuentes de datos para el dominio.
- **Data Access Objects (`DAOs`)**: Ejecuta las operaciones directas de persistencia sobre archivos JSON.

---

## 🏛️ Explicación de la Nueva Arquitectura en Capas

La arquitectura en capas divide el sistema en niveles jerárquicos donde cada capa tiene una única responsabilidad definida (**Separación de Responsabilidades - SoC**) y solo se comunica con sus capas adyacentes:

```mermaid
flowchart TD
    Client(["Cliente / Frontend"])
    
    subgraph Presentation ["Capa de Presentación y Transporte"]
        Router["Router (routes/)<br>• Define rutas y verbos HTTP"]
        Controller["Controller (controllers/)<br>• Recibe req / res<br>• Formatea respuestas JSON"]
    end
    
    subgraph Domain ["Capa de Lógica de Negocio"]
        Service["Service (services/)<br>• Reglas del negocio<br>• Validaciones de dominio<br>• Orquestación entre entidades"]
    end
    
    subgraph Persistence ["Capa de Acceso a Datos"]
        Repo["Repository (repositories/)<br>• Abstracción agnóstica de almacenamiento"]
        DAO["DAO (dao/)<br>• Operaciones de lectura/escritura<br>• Lectura de JSON con fs/promises"]
        FileStore[("Archivos JSON (data/)<br>services.json / bookings.json")]
    end

    Client -->|HTTP Request| Router
    Router --> Controller
    Controller -->|Llama métodos de negocio| Service
    Service -->|Solicita operaciones de datos| Repo
    Repo -->|Delega persistencia| DAO
    DAO <-->|Lectura / Escritura| FileStore
    
    DAO -.->|Datos crudos| Repo
    Repo -.->|Entidades| Service
    Service -.->|Resultado de negocio| Controller
    Controller -->|HTTP Response { status, payload }| Client
```

### Detalle de cada Capa:

1. **Capa de Ruteo (`src/routes/`)**:
   - Define los endpoints de la API (`/services`, `/bookings`).
   - Conecta las rutas HTTP con las funciones del controlador.

2. **Capa de Controladores (`src/controllers/`)**:
   - Extrae parámetros de la URL (`req.params`), parámetros de consulta (`req.query`) y datos del cuerpo (`req.body`).
   - Invoca a los servicios correspondientes mediante async/await.
   - Retorna la respuesta HTTP estructurada con el código de estado correspondiente (`200`, `201`, `400`, `404`, `500`) y el formato unificado:
     - `{ status: "success", payload: ... }`
     - `{ status: "error", message: ... }`

3. **Capa de Servicios / Lógica de Negocio (`src/services/`)**:
   - Contiene la lógica del negocio pura, independiente del protocolo HTTP.
   - Realiza validaciones de integridad (comprobar que los campos requeridos estén presentes, validar que un servicio exista antes de agregarlo a un turno, etc.).
   - Utiliza inyección de dependencias para comunicarse con la capa de repositorio (`constructor(repository = new ServicesRepository())`).

4. **Capa de Repositorios (`src/repositories/`)**:
   - Implementa el patrón *Repository*. Actúa como mediador entre la capa de negocio y la capa de acceso a datos.
   - Proporciona una interfaz uniforme (`getAll`, `getById`, `create`, `update`, `delete`) sin importar de dónde provengan los datos.

5. **Capa DAO - Data Access Object (`src/dao/`)**:
   - Contiene el código de bajo nivel que interactúa con el medio de persistencia.
   - En este proyecto, gestiona la lectura y escritura sobre los archivos JSON (`src/data/services.json` y `src/data/bookings.json`) mediante el módulo `fs/promises`.

### ¿Por qué esta arquitectura es superior?
- **Desacoplamiento total**: La capa de negocio desconoce si los datos se guardan en un archivo JSON, MongoDB o MySQL.
- **Mantenibilidad y escalabilidad**: Cada componente es pequeño, legible y enfocado.
- **Preparado para migración**: Cambiar la base de datos solo requerirá reemplazar el DAO, sin tocar la lógica de negocio ni las rutas.

---

## 🛠️ Requisitos Previos

- **Node.js** (versión 18 o superior)
- **npm**

---

## ⚙️ Variables de Entorno

Configura el archivo `.env` en la raíz de `5-turnos-BE` a partir de `.env.example`:

```env
PORT=8080
NODE_ENV=development
```

| Variable | Tipo | Obligatoria | Descripción |
| :--- | :--- | :--- | :--- |
| `PORT` | Number | Sí | Puerto donde escucha el servidor |
| `NODE_ENV` | String | Sí | Entorno de ejecución (`development` / `production`) |

---

## 📦 Cómo Instalar

1. Navega al directorio del proyecto:
   ```bash
   cd 5-turnos-BE
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Crea el archivo `.env`:
   ```bash
   cp .env.example .env
   ```
   *(En PowerShell: `Copy-Item .env.example .env`)*

---

## 🚀 Cómo Ejecutar

- **Modo Desarrollo**:
  ```bash
  npm run dev
  ```

- **Modo Producción**:
  ```bash
  npm start
  ```

El servidor iniciará en: `http://localhost:8080`.

---

## 📁 Estructura del Proyecto

```text
5-turnos-BE/
├── .env.example
├── package.json
├── src/
│   ├── app.js                          # Configuración de Express
│   ├── server.js                       # Inicio del servidor
│   ├── config/
│   │   └── env.config.js               # Variables de entorno
│   ├── controllers/                    # CAPA CONTROLADORES
│   │   ├── bookings.controller.js
│   │   └── services.controller.js
│   ├── services/                       # CAPA LÓGICA DE NEGOCIO
│   │   ├── bookings.service.js
│   │   └── services.service.js
│   ├── repositories/                   # CAPA REPOSITORIOS
│   │   ├── bookings.repository.js
│   │   └── services.repository.js
│   ├── dao/                            # CAPA ACCESO A DATOS (DAO)
│   │   ├── bookings.dao.js
│   │   └── services.dao.js
│   ├── data/                           # PERSISTENCIA EN JSON
│   │   ├── bookings.json
│   │   └── services.json
│   ├── routes/                         # CAPA DE RUTEO
│   │   ├── booking.router.js
│   │   └── services.router.js
│   └── utils/
│       └── http.js
```

---

## 🏷️ Descripción de Recursos

### 1. Recurso `services`
- `id` (UUID): Identificador único.
- `name` (String): Nombre del servicio.
- `description` (String): Descripción.
- `duration` (Number): Duración en minutos.
- `price` (Number): Precio en moneda local.
- `category` (String): Categoría.
- `available` (Boolean): Disponibilidad.

### 2. Recurso `bookings`
- `id` (UUID): Identificador único de la reserva.
- `clientName` (String): Nombre del cliente.
- `clientEmail` (String): Email del cliente.
- `date` (String): Fecha del turno (`YYYY-MM-DD`).
- `time` (String): Hora del turno (`HH:mm`).
- `status` (String): Estado de la reserva.
- `services` (Array): Servicios asociados `[{ service: String, quantity: Number }]`.

---

## 🔌 Endpoints y Ejemplos de Uso

### Servicios (`/services`)

#### 1. Obtener todos los servicios
```bash
curl -X GET http://localhost:8080/services
```
**Respuesta:**
```json
{
  "status": "success",
  "payload": [
    {
      "id": "e45f910a-3ab2-4b21-87c2-1981da8b21aa",
      "name": "Masaje Descontracturante",
      "description": "Sesión integral de 50 minutos",
      "duration": 50,
      "price": 16000,
      "category": "Spa",
      "available": true
    }
  ]
}
```

#### 2. Obtener servicio por ID (`:sid`)
```bash
curl -X GET http://localhost:8080/services/e45f910a-3ab2-4b21-87c2-1981da8b21aa
```

#### 3. Crear servicio
```bash
curl -X POST http://localhost:8080/services \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Lifting de Pestañas",
    "description": "Arqueado y nutrición profunda",
    "duration": 45,
    "price": 9500,
    "category": "Estética",
    "available": true
  }'
```

#### 4. Actualizar servicio (`:sid`)
```bash
curl -X PUT http://localhost:8080/services/e45f910a-3ab2-4b21-87c2-1981da8b21aa \
  -H "Content-Type: application/json" \
  -d '{
    "price": 17500
  }'
```

#### 5. Eliminar servicio (`:sid`)
```bash
curl -X DELETE http://localhost:8080/services/e45f910a-3ab2-4b21-87c2-1981da8b21aa
```

---

### Reservas (`/bookings`)

#### 1. Obtener reserva por ID (`:bid`)
```bash
curl -X GET http://localhost:8080/bookings/8d12be77-4c31-409b-b9f1-a012984ef2a1
```

#### 2. Crear una nueva reserva
```bash
curl -X POST http://localhost:8080/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "Carlos Mendoza",
    "clientEmail": "carlos.mendoza@example.com",
    "date": "2026-11-28",
    "time": "16:00",
    "status": "confirmed",
    "services": [
      {
        "service": "e45f910a-3ab2-4b21-87c2-1981da8b21aa",
        "quantity": 1
      }
    ]
  }'
```

#### 3. Agregar servicio a una reserva existente
```bash
curl -X POST http://localhost:8080/bookings/8d12be77-4c31-409b-b9f1-a012984ef2a1/services/e45f910a-3ab2-4b21-87c2-1981da8b21aa
```

