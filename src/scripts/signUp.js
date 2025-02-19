const form = document.getElementById("signup-form");
const inputs = document.querySelectorAll("#signup-form input");

const expressions = {
    name: /^[a-zA-ZÀ-ÿ\s]{4,40}$/,
    lastName: /^[a-zA-ZÀ-ÿ\s]{4,40}$/,
    username: /^[a-zA-Z0-9\_\-]{4,16}$/,
    email: /^[a-zA-Z0-9\_]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/,
    password: /^.{6,20}$/,
    confirmPassword: (password) => new RegExp(`^${password}$`),
};

const fields = {
    name: false,
    lastName: false,
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
};

const validateField = (expression, input, field) => {
    const group = document.getElementById(`group__${field}`);

    if (expression.test(input.value)) {
        group.style.borderColor = "green";
        fields[field] = true;
    } else {
        group.style.borderColor = "red";
        fields[field] = false;
    }
};

const validateForm = (e) => {
    switch (e.target.id) {
        case "name":
            validateField(expressions.name, e.target, "name");
            break;
        case "lastName":
            validateField(expressions.lastName, e.target, "lastName");
            break;
        case "username":
            validateField(expressions.username, e.target, "username");
            break;
        case "email":
            validateField(expressions.email, e.target, "email");
            break;
        case "password":
            validateField(expressions.password, e.target, "password");
            break;
        case "confirm-password":
            validateField(expressions.confirmPassword(document.getElementById('password').value), e.target, "confirm-password");
            break;
    }
};

inputs.forEach((input) => {
    input.addEventListener("keyup", validateForm);
    input.addEventListener("blur", validateForm);
});

form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (fields.name && fields.lastName && fields.username && fields.email && fields.password && fields.confirmPassword) {
        form.submit();
    } else {
        alert("Please fill out the form correctly.");
    }
});
