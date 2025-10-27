// Importar Firebase (manteniendo la sintaxis CDN)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, addDoc, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Configuración de Firebase (LA MISMA QUE YA TIENES)
const firebaseConfig = {
  apiKey: "AIzaSyA0lP59ntXyWKVGkFO3hlpkMxOF1Bjfmrg",
  authDomain: "hallowen-e8bf8.firebaseapp.com",
  projectId: "hallowen-e8bf8",
  storageBucket: "hallowen-e8bf8.firebasestorage.app",
  messagingSenderId: "437680051121",
  appId: "1:437680051121:web:86cac8c688a66c1db86390",
  measurementId: "G-QTRNKF6SJH"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para registrar asistencia
async function registrarAsistencia(nombre, apellido, disfraz, sucursal, email) {
  try {
    // Verificar si ya está registrado
    const q = query(
      collection(db, "registros"),
      where("correo", "==", email)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return {
        ok: false,
        mensaje: "Correo ya registrado. Intenta con otro correo."
      };
    }

    // Registrar nuevo asistente
    const docRef = await addDoc(collection(db, "registros"), {
      nombre: nombre,
      apellido: apellido,
      disfraz: disfraz,
      fecha_de_registro: new Date(),
      sucursal: sucursal,
      correo: email
    });

    console.log("✅ Registro exitoso con ID:", docRef.id);

    return {
      ok: true,
      mensaje: "¡Registro exitoso! Nos vemos en Halloween 🎃",
      id: docRef.id
    };
  } catch (error) {
    console.error("❌ Error al registrar:", error);
    return {
      ok: false,
      mensaje: "Error al registrar: " + error.message
    };
  }
}

// Manejar el envío del formulario
document.addEventListener('DOMContentLoaded', function() {
  const btnHalloween = document.querySelector('.btn-halloween');
  
  if (btnHalloween) {
    btnHalloween.addEventListener('click', async function(e) {
      e.preventDefault();
      
      // Obtener valores del formulario
      const nombre = document.getElementById('nombre').value.trim();
      const apellido = document.getElementById('apellido').value.trim();
      const disfraz = document.getElementById('disfraz').value.trim();
      const email = document.getElementById('email').value.trim();
      const sucursal = document.getElementById('sucursal').value.trim();
      
      // Validar campos
      if (!nombre || !apellido || !disfraz || !email || !sucursal) {
        alert('Por favor completa todos los campos');
        return;
      }

      // Validación de email
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailRegex.test(email)) {
        alert('Por favor ingresa un correo válido');
        return;
      }
      
      // Deshabilitar botón mientras procesa
      btnHalloween.disabled = true;
      const textoOriginal = btnHalloween.querySelector('.btn-text').textContent;
      btnHalloween.querySelector('.btn-text').textContent = '⏳ Registrando...';
      
     try {
        // Registrar en Firebase
        const resultado = await registrarAsistencia(nombre, apellido, disfraz, sucursal, email);
        
        // Mostrar resultado
        if (resultado.ok) {
       
            // LUEGO mostrar mensaje (sin alert que bloquea)
            // Opción 1: Usar un div de mensaje
            const mensaje = document.createElement('div');
     
            mensaje.textContent = resultado.mensaje;
            mensaje.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#4CAF50;color:white;padding:15px 30px;border-radius:8px;z-index:999999999;font-size:18px;';
            document.body.appendChild(mensaje);
            
            // Quitar mensaje después de 3 segundos
            setTimeout(() => mensaje.remove(), 5000);
            //redirigir a la pagina de presentacion
            window.location.href = `registrado.html?id=${resultado.id}`;
            startBugAnimation();
            
            
            // Limpiar formulario después de un delay
            setTimeout(() => {
                document.getElementById('nombre').value = '';
                document.getElementById('apellido').value = '';
                document.getElementById('disfraz').value = '';
                document.getElementById('email').value = '';
                document.getElementById('sucursal').value = '';
            }, 500);
            
        } else {
            alert(resultado.mensaje);
        }
      } catch (error) {
          console.error("Error inesperado:", error);
          alert("Ocurrió un error inesperado. Por favor intenta de nuevo.");
      }
      
      // Rehabilitar botón
      btnHalloween.disabled = false;
      btnHalloween.querySelector('.btn-text').textContent = textoOriginal;
    });
  }
});