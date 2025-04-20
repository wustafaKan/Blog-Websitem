document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('mobile-menu');
    const navList = document.querySelector('.nav-list');

    if (menuToggle && navList) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navList.classList.toggle('active');
            console.log('Menu clicked!');
        });
    }
});