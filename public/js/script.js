function togglePassword() {
    const passwordInput = document.getElementById("account_password");
    const toggleIcon = document.getElementById("togglePasswordIcon"); // Assuming there's an icon with this ID. Why assumption? Because it may not exist.

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleIcon.classList.remove("fa-eye");
        toggleIcon.classList.add("fa-eye-slash");
    } else {
        passwordInput.type = "password";
        toggleIcon.classList.remove("fa-eye-slash");
        toggleIcon.classList.add("fa-eye");
    }
}