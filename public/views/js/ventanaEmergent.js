const profileDropdown = document.getElementById('profileDropdown');
const profileButton = document.getElementById('logoutButton');
const token = localStorage.getItem('token');

profileButton.addEventListener('click', () => {
    profileDropdown.classList.toggle('show');
});

document.addEventListener('click', (event) => {
    if (!profileDropdown.contains(event.target) && !profileButton.contains(event.target)) {
        profileDropdown.classList.remove('show');
    }
});

if (token) {
    document.getElementById("profileDropdownArrow").style.visibility = "visible";
} else {
    document.getElementById("profileDropdownArrow").style.visibility = "hidden";
}