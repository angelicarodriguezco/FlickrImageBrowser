const form = document.querySelector("form");
const input = document.querySelector("#code");

const expressions = {
    otp: /^[0-9]{6}$/
};

const fields = {
    otp: false
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
        case "codigo":
            validateField(expressions.otp, e.target, "otp");
            break;
    }
};

input.addEventListener("keyup", validateForm);
input.addEventListener("blur", validateForm);

form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (fields.otp) {
        form.submit();
    } else {
        alert("Please enter a valid 6-digit OTP.");
    }
});
