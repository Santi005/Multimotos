function togglePasswordVisibility(inputId) {
  const inputField = document.getElementById(inputId);
  const togglePassword = inputField.nextElementSibling;

  if (inputField.getAttribute("type") === "password") {
    inputField.setAttribute("type", "text");
    togglePassword.classList.remove("fa-eye");
    togglePassword.classList.add("fa-eye-slash");
  } else {
    inputField.setAttribute("type", "password");
    togglePassword.classList.remove("fa-eye-slash");
    togglePassword.classList.add("fa-eye");
  }
}