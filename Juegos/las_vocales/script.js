// Función para mostrar el submenú correspondiente al tema seleccionado
function showSubMenu(theme) {
    // Definir los enlaces a las páginas de los submenús
    var subMenuPages = {
        'canciones': 'sub_menu_canciones.html',
        'instrumentos': 'sub_menu_instrumentos.html',
        'caracteristicas': 'sub_menu_caracteristicas.html',
        'folclore': 'sub_menu_folclore.html'
    };

    // Verificar si el tema tiene un submenú asociado
    if (subMenuPages.hasOwnProperty(theme)) {
        // Redirigir a la página del submenú correspondiente
        window.location.href = subMenuPages[theme];
    } else {
        console.error('No hay submenú definido para el tema seleccionado.');
    }
}

// Función para redirigir al menú principal
function goToMainMenu() {
    // Redirigir al usuario de vuelta al menú principal (menu.html)
    window.location.href = 'menu.html';
}

// Función para cerrar la ventana del navegador
function exit() {
    // Cerrar la ventana del navegador
    window.close();
}

// Función para redirigir a registro
function goToRegistration() {
    // Redirigir al usuario al archivo index.html en la carpeta anterior
    window.location.href = '../index.html';
}

function goBackToMenu() {
    // Obtener el valor almacenado en localStorage
    const submenu = localStorage.getItem('submenu');

    // Verificar si existe un valor válido
    if (submenu) {
        // Redirigir a la página correspondiente
        window.location.href = "../../menu/sub_menu_" + submenu + ".html";
    } else {
        // En caso de que no haya valor, podrías redirigir a una página por defecto
        window.location.href = "../../menu/sub_menu_default.html";
    }
}

// Asignar manejador de evento al botón "Volver al Registro"
var backButton = document.getElementById('backButton');
backButton.addEventListener('click', goBackToMenu);
