//  muda de cadastro para login e de login para cadastro

const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});

// Salvar usuário no LocalStorage
function cadastrarUsuario() {
    const email = document.getElementById("email-cadastro").value;
    const senha = document.getElementById("password-cadastro").value;
    const mensagemErro = document.getElementById("mensagemErro-cadastro");

    if (!email || !senha) {
        mensagemErro.textContent = "Preencha todos os campos.";
        return;
    }

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const jaExiste = usuarios.some(usuario => usuario.email === email);

    if (jaExiste) {
        mensagemErro.textContent = "Usuário já cadastrado.";
        return;
    }

    usuarios.push({ email, senha, isAdm: false });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    mensagemErro.style.color = "green";
    mensagemErro.textContent = "Cadastro realizado com sucesso!";
}

// Login
function login(event) {
    event.preventDefault();
    
    const email = document.getElementById("email").value;
    const senha = document.getElementById("password").value;
    const mensagemErro = document.getElementById("mensagemErro");

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Garante que o admin esteja cadastrado
    const adminEmail = "joaodavidmachado73@gmail.com";
    const adminSenha = "1234";
    if (!usuarios.some(u => u.email === adminEmail)) {
        usuarios.push({ email: adminEmail, senha: adminSenha, isAdm: true });
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
    }

    const usuario = usuarios.find(u => u.email === email && u.senha === senha);

    if (usuario) {
        // Salva usuário logado
        localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
        
        // Redireciona
        if (usuario.isAdm) {
            window.location.href = "acessoRestrito.html";
        } else {
            window.location.href = "conteudo.html";
        }
    } else {
        mensagemErro.textContent = "Email ou senha inválidos.";
    }
}
