const form = document.getElementById("login-form");
const inputs = document.querySelectorAll("#login-form input");

const patterns = {
    email: /^[a-zA-Z0-9\_]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/,
    password: /^[a-zA-Z0-9\_\-]{4,16}$/
};

const fields = {
    email: false,
    password: false
};

const validateForm = (e) => {
    switch (e.target.id) {
        case "email":
            validateField(patterns.email, e.target, "email");
            break;
        case "password":
            validateField(patterns.password, e.target, "password");
            break;
    }
};

const validateField = (pattern, input, field) => {
    if (pattern.test(input.value)) {
        input.classList.remove("input-invalid");
        input.classList.add("input-valid");
        fields[field] = true;
    } else {
        input.classList.add("input-invalid");
        input.classList.remove("input-valid");
        fields[field] = false;
    }
};

inputs.forEach((input) => {
    input.addEventListener("keyup", validateForm);
    input.addEventListener("blur", validateForm);
});

form.addEventListener("submit", (e) => {
    if (!fields.email || !fields.password) {
        e.preventDefault();
        alert("Please fill in the fields correctly.");
    } else {
        form.submit();
    }
});
