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
    const file = new Blob([fileContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const metadata = {
        'name': 'cadastro.docx',
        'mimeType': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'parents': ['YOUR_FOLDER_ID'] // Substitua pelo ID da pasta compartilhada
    };

    const accessToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);

    fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: new Headers({ 'Authorization': 'Bearer ' + accessToken }),
        body: form
    }).then((response) => {
        if (response.ok) {
            alert('Dados salvos com sucesso!');
        } else {
            response.json().then((error) => {
                alert('Erro ao salvar os dados: ' + error.message);
            });
        }
    }).catch((error) => {
        alert('Erro ao salvar os dados!');
        console.error(error);
    });
});