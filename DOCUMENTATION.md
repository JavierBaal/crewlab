# AI Agent Team Workspace - Documentación para Implementación

## Descripción General

Esta plantilla proporciona una interfaz de usuario para un entorno de desarrollo colaborativo con múltiples agentes de IA. La interfaz incluye paneles para chat con agentes, un terminal interactivo, un editor de código y un panel de colaboración entre agentes.

## Estructura del Proyecto

```
/
├── src/
│   ├── app/                    # Configuración de Next.js
│   ├── components/
│   │   ├── providers/          # Proveedores de contexto
│   │   ├── ui/                 # Componentes de UI reutilizables (shadcn)
│   │   └── workspace/          # Componentes específicos del workspace
│   └── lib/                    # Utilidades y funciones auxiliares
├── public/                     # Archivos estáticos
├── ai_agent_workspace.ipynb    # Notebook de Google Colab
└── package.json               # Dependencias del proyecto
```

## Componentes Principales

1. **AgentTeamDashboard**: Componente principal que integra todos los paneles del workspace.
2. **AgentCardGrid**: Muestra tarjetas de agentes disponibles para selección.
3. **ChatInterface**: Interfaz de chat para comunicarse con los agentes.
4. **TerminalPanel**: Terminal simulado para ejecutar comandos.
5. **CodePanel**: Editor de código con soporte para múltiples lenguajes.
6. **CollaborationPanel**: Panel para sesiones de colaboración entre múltiples agentes.
7. **ProjectInitModal**: Modal para inicializar nuevos proyectos.

## Estado Actual de la Implementación

Actualmente, la plantilla es principalmente una demostración de UI con funcionalidad simulada:

- Los agentes no están conectados a modelos de IA reales
- El terminal simula respuestas pero no ejecuta comandos reales
- El editor de código no ejecuta el código realmente
- Las interacciones entre agentes son simuladas con datos estáticos

## Pasos para Implementar una Versión Funcional en Google Colab

### 1. Configuración del Backend

```python
# En el notebook de Google Colab
!pip install crewai langchain openai

# Configurar las credenciales de API
import os
os.environ["OPENAI_API_KEY"] = "tu-api-key"

# Implementar los agentes con CrewAI
from crewai import Agent, Task, Crew
from langchain.llms import OpenAI

# Definir los agentes
engineer_agent = Agent(
    role="Software Engineer",
    goal="Write clean, efficient code and solve technical problems",
    backstory="You are an expert software engineer with years of experience in multiple programming languages.",
    verbose=True,
    llm=OpenAI(temperature=0.7)
)

architect_agent = Agent(
    role="System Architect",
    goal="Design robust system architectures and provide technical guidance",
    backstory="You are an experienced system architect who specializes in designing scalable applications.",
    verbose=True,
    llm=OpenAI(temperature=0.7)
)

# Crear más agentes según sea necesario...

# Definir la tripulación
crew = Crew(
    agents=[engineer_agent, architect_agent],
    tasks=[],
    verbose=2
)
```

### 2. Implementar API para Comunicación Frontend-Backend

```python
# En el notebook de Google Colab
from flask import Flask, request, jsonify
from flask_cors import CORS
import threading

app = Flask(__name__)
CORS(app)

@app.route('/api/send-message', methods=['POST'])
def send_message():
    data = request.json
    message = data.get('message')
    agent_id = data.get('agentId')
    
    # Seleccionar el agente adecuado
    if agent_id == "1":  # Engineer Agent
        agent = engineer_agent
    elif agent_id == "2":  # Architect Agent
        agent = architect_agent
    # Añadir más agentes según sea necesario
    
    # Obtener respuesta del agente
    response = agent.execute(message)
    
    return jsonify({
        "id": str(uuid.uuid4()),
        "content": response,
        "sender": "agent",
        "timestamp": datetime.now().isoformat(),
        "agentId": agent_id,
        "agentName": agent.role,
    })

@app.route('/api/execute-code', methods=['POST'])
def execute_code():
    data = request.json
    code = data.get('code')
    language = data.get('language', 'python')
    
    result = ""
    try:
        if language == "python":
            # Ejecutar código Python
            import sys
            from io import StringIO
            
            old_stdout = sys.stdout
            redirected_output = sys.stdout = StringIO()
            
            exec(code)
            
            sys.stdout = old_stdout
            result = redirected_output.getvalue()
        else:
            result = f"Ejecución de {language} no implementada aún"
    except Exception as e:
        result = f"Error: {str(e)}"
    
    return jsonify({"result": result})

# Iniciar el servidor Flask en un hilo separado
def run_flask():
    app.run(port=5000)

flask_thread = threading.Thread(target=run_flask)
flask_thread.daemon = True
flask_thread.start()

print("API backend running at http://localhost:5000")
```

### 3. Configurar Ngrok para Exponer la API

```python
# En el notebook de Google Colab
!pip install pyngrok
from pyngrok import ngrok

# Configurar el token de autenticación de ngrok
ngrok.set_auth_token("tu-token-de-ngrok")

# Crear un túnel HTTP a tu servidor Flask
http_tunnel = ngrok.connect(5000)
print(f"API pública disponible en: {http_tunnel.public_url}")

# Guardar la URL para usarla en el frontend
api_url = http_tunnel.public_url
```

### 4. Modificar el Frontend para Conectarse a la API Real

Modifica el archivo `src/components/workspace/AgentTeamDashboard.tsx` para conectarse a la API real:

```typescript
// Reemplazar la función handleSendMessage
const handleSendMessage = async (message: string) => {
  if (!selectedAgentId) return;

  // Crear un nuevo mensaje del usuario
  const newUserMessage: Message = {
    id: Date.now().toString(),
    content: message,
    sender: "user",
    timestamp: new Date(),
  };

  // Actualizar mensajes para el agente seleccionado
  setMessages((prev) => ({
    ...prev,
    [selectedAgentId]: [...(prev[selectedAgentId] || []), newUserMessage],
  }));

  try {
    // Llamar a la API real
    const response = await fetch("https://tu-url-de-ngrok/api/send-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        agentId: selectedAgentId,
      }),
    });

    const agentResponse = await response.json();

    // Añadir la respuesta del agente a los mensajes
    const newAgentMessage: Message = {
      id: agentResponse.id,
      content: agentResponse.content,
      sender: "agent",
      timestamp: new Date(agentResponse.timestamp),
      agentId: agentResponse.agentId,
      agentName: agentResponse.agentName,
      agentAvatar: "",
    };

    setMessages((prev) => ({
      ...prev,
      [selectedAgentId]: [...(prev[selectedAgentId] || []), newAgentMessage],
    }));
  } catch (error) {
    console.error("Error al enviar mensaje:", error);
    // Manejar el error apropiadamente
  }
};

// Reemplazar la función handleExecuteCode
const handleExecuteCode = async (code: string) => {
  try {
    const response = await fetch("https://tu-url-de-ngrok/api/execute-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        language: "python", // O el lenguaje seleccionado
      }),
    });

    const result = await response.json();
    
    // Actualizar la salida del terminal con el resultado
    // Esto requiere modificar la estructura para pasar el resultado al TerminalPanel
    console.log("Resultado de la ejecución:", result.result);
  } catch (error) {
    console.error("Error al ejecutar código:", error);
  }
};
```

### 5. Implementar Terminal Real

Modifica `src/components/workspace/TerminalPanel.tsx` para ejecutar comandos reales:

```typescript
const executeCommand = async (command: string) => {
  setIsRunning(true);

  try {
    const response = await fetch("https://tu-url-de-ngrok/api/execute-terminal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ command }),
    });

    const result = await response.json();
    setTerminalOutput((prev) => `${prev}${result.output}\n`);
  } catch (error) {
    console.error("Error al ejecutar comando:", error);
    setTerminalOutput((prev) => `${prev}Error: No se pudo ejecutar el comando\n`);
  } finally {
    setIsRunning(false);
  }
};
```

Y añadir el endpoint correspondiente en el backend:

```python
@app.route('/api/execute-terminal', methods=['POST'])
def execute_terminal():
    data = request.json
    command = data.get('command')
    
    import subprocess
    try:
        # Ejecutar el comando en un subproceso
        result = subprocess.run(
            command, 
            shell=True, 
            capture_output=True, 
            text=True,
            timeout=30  # Timeout de 30 segundos
        )
        output = result.stdout
        error = result.stderr
        
        if error:
            return jsonify({"output": f"Error: {error}"})
        return jsonify({"output": output})
    except Exception as e:
        return jsonify({"output": f"Error: {str(e)}"})
```

### 6. Implementar Colaboración entre Agentes

Para implementar la colaboración real entre agentes, modifica el backend:

```python
# Añadir a tu notebook de Colab

# Almacenar sesiones de colaboración
collaboration_sessions = {}

@app.route('/api/create-collaboration', methods=['POST'])
def create_collaboration():
    data = request.json
    title = data.get('title')
    description = data.get('description')
    agent_ids = data.get('agentIds', [])
    
    # Crear una lista de agentes para la sesión
    session_agents = []
    for agent_id in agent_ids:
        if agent_id == "1":
            session_agents.append(engineer_agent)
        elif agent_id == "2":
            session_agents.append(architect_agent)
        # Añadir más agentes según sea necesario
    
    # Crear una nueva tripulación para esta sesión
    session_id = str(uuid.uuid4())
    session_crew = Crew(
        agents=session_agents,
        tasks=[],
        verbose=2
    )
    
    # Guardar la sesión
    collaboration_sessions[session_id] = {
        "id": session_id,
        "title": title,
        "description": description,
        "status": "active",
        "createdAt": datetime.now().isoformat(),
        "crew": session_crew,
        "agents": [{
            "id": str(i+1),
            "name": agent.role,
            "role": agent.role,
            "avatar": "",
            "status": "active"
        } for i, agent in enumerate(session_agents)],
        "messages": []
    }
    
    return jsonify({
        "id": session_id,
        "title": title,
        "description": description,
        "status": "active",
        "createdAt": collaboration_sessions[session_id]["createdAt"],
        "agents": collaboration_sessions[session_id]["agents"],
        "messages": []
    })

@app.route('/api/send-collaboration-message', methods=['POST'])
def send_collaboration_message():
    data = request.json
    session_id = data.get('sessionId')
    message = data.get('message')
    
    if session_id not in collaboration_sessions:
        return jsonify({"error": "Session not found"}), 404
    
    session = collaboration_sessions[session_id]
    
    # Añadir mensaje del usuario
    user_message = {
        "id": str(uuid.uuid4()),
        "content": message,
        "agentId": "user",
        "agentName": "User",
        "agentAvatar": "",
        "timestamp": datetime.now().isoformat(),
        "type": "message"
    }
    session["messages"].append(user_message)
    
    # Procesar el mensaje con la tripulación
    # Esto es una simplificación - necesitarías implementar la lógica real
    # para que los agentes colaboren entre sí
    
    # Por ahora, simplemente hacemos que el primer agente responda
    first_agent = session["crew"].agents[0]
    response = first_agent.execute(message)
    
    agent_message = {
        "id": str(uuid.uuid4()),
        "content": response,
        "agentId": "1",  # ID del primer agente
        "agentName": first_agent.role,
        "agentAvatar": "",
        "timestamp": datetime.now().isoformat(),
        "type": "message"
    }
    session["messages"].append(agent_message)
    
    return jsonify({
        "messages": session["messages"]
    })
```

### 7. Configurar el Notebook de Google Colab

Modifica el archivo `ai_agent_workspace.ipynb` para incluir todos los pasos necesarios:

1. Instalación de dependencias
2. Configuración de API keys
3. Implementación del backend con Flask
4. Configuración de ngrok
5. Clonación del repositorio frontend
6. Modificación de archivos frontend para conectarse al backend
7. Ejecución del servidor de desarrollo

## Consideraciones Importantes

1. **Seguridad**: La implementación actual no incluye autenticación. Para una versión de producción, deberías implementar un sistema de autenticación adecuado.

2. **Limitaciones de Colab**: Google Colab tiene limitaciones de tiempo de ejecución y recursos. Para una aplicación de producción, considera usar un servidor dedicado.

3. **Costos de API**: El uso de APIs como OpenAI tiene costos asociados. Monitorea el uso para evitar cargos inesperados.

4. **Persistencia de Datos**: La implementación actual no persiste datos entre sesiones. Considera añadir una base de datos para guardar conversaciones y proyectos.

5. **Ejecución de Código**: La ejecución de código arbitrario puede representar riesgos de seguridad. Implementa sandboxing adecuado.

## Extensiones Futuras

1. Implementar un sistema de roles y permisos
2. Añadir soporte para más lenguajes de programación
3. Integrar con sistemas de control de versiones como Git
4. Implementar un sistema de feedback para mejorar los agentes
5. Añadir soporte para compartir sesiones entre usuarios

## Recursos Adicionales

- [Documentación de CrewAI](https://docs.crewai.com/)
- [Documentación de LangChain](https://python.langchain.com/docs/get_started/introduction)
- [Documentación de OpenAI](https://platform.openai.com/docs/introduction)
- [Documentación de Flask](https://flask.palletsprojects.com/)
- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Shadcn UI](https://ui.shadcn.com/)
