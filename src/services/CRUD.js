
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where 
} from "firebase/firestore";
import { db } from "../../firebase";

// Referencia a la colección
const usuariosRef = collection(db, "usuarios");

// ============================================
// CREAR USUARIO
// ============================================
export const crearUsuario = async (datos) => {
  try {
    // Verificar si el email ya existe
    const q = query(usuariosRef, where("email", "==", datos.email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      throw new Error("El email ya está registrado");
    }

    // Crear usuario
    const nuevoUsuario = {
      nombre: datos.nombre,
      email: datos.email,
      password: datos.password, // En producción, NO guardes passwords en Firestore
      rol: "USER_ROLE",
      estado: true,
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(usuariosRef, nuevoUsuario);
    
    return {
      ok: true,
      id: docRef.id,
      mensaje: "Usuario creado exitosamente",
      usuario: { id: docRef.id, ...nuevoUsuario }
    };
  } catch (error) {
    console.error("Error al crear usuario:", error);
    return {
      ok: false,
      mensaje: error.message
    };
  }
};

// ============================================
// OBTENER TODOS LOS USUARIOS
// ============================================
export const obtenerUsuarios = async () => {
  try {
    const querySnapshot = await getDocs(usuariosRef);
    const usuarios = [];
    
    querySnapshot.forEach((doc) => {
      usuarios.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return {
      ok: true,
      usuarios
    };
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return {
      ok: false,
      mensaje: error.message
    };
  }
};

// ============================================
// OBTENER USUARIO POR ID
// ============================================
export const obtenerUsuarioPorId = async (id) => {
  try {
    const docRef = doc(db, "usuarios", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Usuario no encontrado");
    }

    return {
      ok: true,
      usuario: {
        id: docSnap.id,
        ...docSnap.data()
      }
    };
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    return {
      ok: false,
      mensaje: error.message
    };
  }
};

// ============================================
// ACTUALIZAR USUARIO
// ============================================
export const actualizarUsuario = async (id, datos) => {
  try {
    const docRef = doc(db, "usuarios", id);
    
    // Verificar si existe
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error("Usuario no encontrado");
    }

    // Si se quiere cambiar el email, verificar que no exista
    if (datos.email && datos.email !== docSnap.data().email) {
      const q = query(usuariosRef, where("email", "==", datos.email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        throw new Error("El email ya está en uso");
      }
    }

    // Actualizar
    const datosActualizados = {
      ...datos,
      updatedAt: new Date().toISOString()
    };

    await updateDoc(docRef, datosActualizados);

    return {
      ok: true,
      mensaje: "Usuario actualizado correctamente",
      usuario: { id, ...datosActualizados }
    };
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return {
      ok: false,
      mensaje: error.message
    };
  }
};

// ============================================
// ELIMINAR USUARIO
// ============================================
export const eliminarUsuario = async (id) => {
  try {
    const docRef = doc(db, "usuarios", id);
    
    // Verificar si existe
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error("Usuario no encontrado");
    }

    await deleteDoc(docRef);

    return {
      ok: true,
      mensaje: "Usuario eliminado correctamente"
    };
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return {
      ok: false,
      mensaje: error.message
    };
  }
};

// ============================================
// BUSCAR USUARIO POR EMAIL
// ============================================
export const buscarUsuarioPorEmail = async (email) => {
  try {
    const q = query(usuariosRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error("Usuario no encontrado");
    }

    let usuario = null;
    querySnapshot.forEach((doc) => {
      usuario = {
        id: doc.id,
        ...doc.data()
      };
    });

    return {
      ok: true,
      usuario
    };
  } catch (error) {
    console.error("Error al buscar usuario:", error);
    return {
      ok: false,
      mensaje: error.message
    };
  }
};