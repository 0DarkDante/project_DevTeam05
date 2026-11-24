
let formState = {
    email: "",
};

const signUpFormState = localStorage.getItem('signUp-form-state');

if (signUpFormState) {
    formState = JSON.parse(signUpFormState);
};

const form = document.querySelector('.form-signUp');
const input = document.querySelector('.form-signUp-input');

input.value = formState.email;

form.addEventListener('input', (event) => {
    formState[event.target.name] = event.target.value.trim();
    localStorage.setItem('signUp-form-state', JSON.stringify(formState))
});

form.addEventListener('submit', (event) => {
    event.preventDefault();
    
    if (formState["email"]) {
        console.log(formState);
        localStorage.removeItem('signUp-form-state');
        form.reset();
        formState = { email: "",};
    } else {
        alert('Fill please all fields');
    }
});