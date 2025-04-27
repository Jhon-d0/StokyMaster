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


// API


const usuarios = [
	{ email: "joaodavidmachado73@gmail.com", senha: "1234" },
	{ email: "maria.silva@email.com", senha: "senha123" },
	{ email: "pedro.almeida@email.com", senha: "abc123" },
	{ email: "lucas.costa@email.com", senha: "senha321" },
	{ email: "ana.lima@email.com", senha: "meupass" }
];
  
function login(event) {
event.preventDefault();
mostrarLoader();

setTimeout(() => {
	const email = document.getElementById('email').value;
	const senha = document.getElementById('password').value;
	const mensagemErro = document.getElementById('mensagemErro');

	const usuarioValido = usuarios.find(user => user.email === email && user.senha === senha);

	if (usuarioValido) {
		if (email === "joaodavidmachado73@gmail.com" && senha === "1234") {
			// Redireciona para a página completa
			window.location.href = "conteudo.html"; // página de acesso completo
		  } else {
			// Redireciona para a página com acesso restrito
			window.location.href = "acessoRestrito.html"; // página de acesso restrito
		  }
	} else {
	esconderLoader();
	mensagemErro.textContent = "Usuário ou senha inválidos.";
	}
}, 1500); // tempo do loader
}
  
  



function cadastrarUsuario() {
mostrarLoader();

setTimeout(() => {
	const emailCadastro = document.getElementById('email-cadastro').value;
	const senhaCadastro = document.getElementById('password-cadastro').value;
	const mensagemErroCadastro = document.getElementById('mensagemErro-cadastro');

	if (!emailCadastro || !senhaCadastro) {
	mensagemErroCadastro.textContent = "Preencha todos os campos.";
	esconderLoader();
	return;
	}

	const jaExiste = usuarios.some(user => user.email === emailCadastro);

	if (jaExiste) {
	mensagemErroCadastro.textContent = "Esse e-mail já está cadastrado.";
	} else {
	usuarios.push({ email: emailCadastro, senha: senhaCadastro });
	mensagemErroCadastro.textContent = "Usuário cadastrado com sucesso!";
	document.getElementById('email-cadastro').value = "";
	document.getElementById('password-cadastro').value = "";
	}

	esconderLoader();
}, 1500); // tempo do loader
}
  
  

// Carregamento

function mostrarLoader() {
	document.getElementById('loader').style.display = 'flex';
  }
  
  function esconderLoader() {
	document.getElementById('loader').style.display = 'none';
  }
  