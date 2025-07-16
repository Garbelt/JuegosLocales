// Funci�n para mostrar el submen� correspondiente al tema seleccionado
function showSubMenu(theme) {
    // Definir los enlaces a las p�ginas de los submen�s
    var subMenuPages = {
        'canciones': 'sub_menu_canciones.html',
        'instrumentos': 'sub_menu_instrumentos.html',
        'caracteristicas': 'sub_menu_caracteristicas.html',
        'folclore': 'sub_menu_folclore.html'
    };

    // Verificar si el tema tiene un submen� asociado
    if (subMenuPages.hasOwnProperty(theme)) {
        // Redirigir a la p�gina del submen� correspondiente
        window.location.href = subMenuPages[theme];
    } else {
        console.error('No hay submen� definido para el tema seleccionado.');
    }
}

// Funci�n para redirigir al men� principal
function goToMainMenu() {
    // Redirigir al usuario de vuelta al men� principal (menu.html)
    window.location.href = 'menu.html';
}

// Funci�n para cerrar la ventana del navegador
function exit() {
    // Cerrar la ventana del navegador
    window.close();
}

// Funci�n para redirigir a registro
function goToRegistration() {
    // Redirigir al usuario al archivo index.html en la carpeta anterior
    window.location.href = '../index.html';
}

function goBackToMenu() {
    // Obtener el valor almacenado en localStorage
    const submenu = localStorage.getItem('submenu');

    // Verificar si existe un valor v�lido
    if (submenu) {
        // Redirigir a la p�gina correspondiente
        window.location.href = "../../menu/sub_menu_" + submenu + ".html";
    } else {
        // En caso de que no haya valor, podr�as redirigir a una p�gina por defecto
        window.location.href = "../../menu/sub_menu_default.html";
    }
}

// Asignar manejador de evento al bot�n "Volver al Registro"
var backButton = document.getElementById('backButton');
backButton.addEventListener('click', goBackToMenu);
