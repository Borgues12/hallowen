// App.js o tu componente principal
import { 
  crearUsuario, 
  obtenerUsuarios, 
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario,
  buscarUsuarioPorEmail
} from './services/usuarioService';

// ============================================
// EJEMPLO 1: Crear Usuario
// ============================================
async function ejemploCrearUsuario() {
  const nuevoUsuario = {
    nombre: "Juan Pérez",
    email: "juan@example.com",
    password: "123456"
  };

  const resultado = await crearUsuario(nuevoUsuario);
  
  if (resultado.ok) {
    console.log("Usuario creado:", resultado.usuario);
    alert(resultado.mensaje);
  } else {
    console.error("Error:", resultado.mensaje);
    alert("Error: " + resultado.mensaje);
  }
}

// ============================================
// EJEMPLO 2: Obtener Todos los Usuarios
// ============================================
async function ejemploObtenerTodos() {
  const resultado = await obtenerUsuarios();
  
  if (resultado.ok) {
    console.log("Usuarios:", resultado.usuarios);
    resultado.usuarios.forEach(usuario => {
      console.log(`${usuario.nombre} - ${usuario.email}`);
    });
  } else {
    console.error("Error:", resultado.mensaje);
  }
}

// ============================================
// EJEMPLO 3: Obtener Usuario por ID
// ============================================
async function ejemploObtenerPorId() {
  const userId = "abc123"; // ID del usuario
  const resultado = await obtenerUsuarioPorId(userId);
  
  if (resultado.ok) {
    console.log("Usuario encontrado:", resultado.usuario);
  } else {
    console.error("Error:", resultado.mensaje);
  }
}

// ============================================
// EJEMPLO 4: Actualizar Usuario
// ============================================
async function ejemploActualizar() {
  const userId = "abc123";
  const datosActualizados = {
    nombre: "Juan Actualizado",
    email: "nuevo@example.com"
  };

  const resultado = await actualizarUsuario(userId, datosActualizados);
  
  if (resultado.ok) {
    console.log("Usuario actualizado:", resultado.usuario);
    alert(resultado.mensaje);
  } else {
    console.error("Error:", resultado.mensaje);
  }
}

// ============================================
// EJEMPLO 5: Eliminar Usuario
// ============================================
async function ejemploEliminar() {
  const userId = "abc123";
  
  const confirmar = confirm("¿Estás seguro de eliminar este usuario?");
  if (!confirmar) return;

  const resultado = await eliminarUsuario(userId);
  
  if (resultado.ok) {
    console.log(resultado.mensaje);
    alert("Usuario eliminado correctamente");
  } else {
    console.error("Error:", resultado.mensaje);
  }
}

// ============================================
// EJEMPLO 6: Buscar por Email
// ============================================
async function ejemploBuscarPorEmail() {
  const email = "juan@example.com";
  const resultado = await buscarUsuarioPorEmail(email);
  
  if (resultado.ok) {
    console.log("Usuario encontrado:", resultado.usuario);
  } else {
    console.error("Error:", resultado.mensaje);
  }
}

// ============================================
// EJEMPLO CON FORMULARIO HTML
// ============================================
document.getElementById('formCrearUsuario')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const datos = {
    nombre: document.getElementById('nombre').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value
  };

  const resultado = await crearUsuario(datos);
  
  if (resultado.ok) {
    alert("Usuario creado exitosamente");
    e.target.reset(); // Limpiar formulario
  } else {
    alert("Error: " + resultado.mensaje);
  }
});

// ============================================
// EJEMPLO CON REACT
// ============================================
import { useState, useEffect } from 'react';

function UsuariosComponent() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    setLoading(true);
    const resultado = await obtenerUsuarios();
    if (resultado.ok) {
      setUsuarios(resultado.usuarios);
    }
    setLoading(false);
  };

  const handleCrear = async (datos) => {
    const resultado = await crearUsuario(datos);
    if (resultado.ok) {
      cargarUsuarios(); // Recargar lista
      alert("Usuario creado");
    } else {
      alert("Error: " + resultado.mensaje);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Eliminar usuario?")) {
      const resultado = await eliminarUsuario(id);
      if (resultado.ok) {
        cargarUsuarios();
        alert("Usuario eliminado");
      }
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <h2>Lista de Usuarios</h2>
      {usuarios.map(usuario => (
        <div key={usuario.id}>
          <p>{usuario.nombre} - {usuario.email}</p>
          <button onClick={() => handleEliminar(usuario.id)}>
            Eliminar
          </button>
        </div>
      ))}
    </div>
  );
}