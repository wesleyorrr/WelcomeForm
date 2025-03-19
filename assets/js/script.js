const CLIENT_ID = 'SEU_CLIENT_ID_AQUI';
const API_KEY = 'SEU_API_KEY_AQUI';
const FOLDER_ID = 'SEU_FOLDER_ID_AQUI';

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
        scope: 'https://www.googleapis.com/auth/drive.file'
    }).then(() => {
        gapi.auth2.getAuthInstance().signIn();
    });
}

function buscarCidade() {
    const cep = document.getElementById('cep').value;
    if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (!data.erro) {
                    document.getElementById('cidade').value = data.localidade;
                } else {
                    alert('CEP não encontrado!');
                }
            })
            .catch(error => {
                alert('Erro ao buscar o CEP!');
                console.error(error);
            });
    }
}

document.getElementById('cadastroForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const cep = document.getElementById('cep').value;
    const cidade = document.getElementById('cidade').value;

    const fileContent = `Nome: ${nome}\nEmail: ${email}\nCEP: ${cep}\nCidade: ${cidade}`;
    const blob = new Blob([fileContent], { type: 'text/plain' });

    gapi.auth2.getAuthInstance().signIn().then(() => {
        const accessToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify({
            'name': 'cadastro.txt',
            'mimeType': 'text/plain',
            'parents': [FOLDER_ID]
        })], { type: 'application/json' }));
        form.append('file', blob);

        fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + accessToken },
            body: form
        }).then(response => response.json())
          .then(data => alert('Dados salvos com sucesso!'))
          .catch(error => console.error('Erro ao salvar os dados:', error));
    });
});