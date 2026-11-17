const elementosAno = document.querySelectorAll("#ano");

elementosAno.forEach(function(elemento) {
    elemento.textContent = new Date().getFullYear();
});