document.addEventListener('deviceready', onDeviceReady, false);

const PIZZARIA_ID = 'Pizza Ponzio';
let listaPizzasCadastradas = [];

function onDeviceReady() {
    carregarPizzas();
    cordova.plugin.http.setDataSerializer('json');

    document.getElementById('btnNovo').addEventListener('click', () => {
        document.getElementById('applista').style.display = 'none';
        document.getElementById('appcadastro').style.display = 'flex';
    });

    document.getElementById('btnCancelar').addEventListener('click', () => {
        document.getElementById('applista').style.display = 'flex';
        document.getElementById('appcadastro').style.display = 'none';
    });

    document.getElementById('btnFoto').addEventListener('click', () => {
        navigator.camera.getPicture(onSuccess, onFail, {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL
        });

        function onSuccess(imageData) {
            const image = document.getElementById('imagem');
            image.style.backgroundImage = 'url(data:image/jpeg;base64,' + imageData + ')';
        }

        function onFail(message) {
            alert('Failed because: ' + message);
        }
    });

    document.getElementById('btnSalvar').addEventListener('click', () => {
        const pizza = document.getElementById('pizza').value;
        const preco = document.getElementById('preco').value;
        const imagem = document.getElementById('imagem').style.backgroundImage;

        cordova.plugin.http.post('https://pedidos-pizzaria.glitch.me/admin/pizza/', {
            pizzaria: PIZZARIA_ID,
            pizza: pizza,
            preco: preco,
            imagem: imagem
        }, {}, function(response) {
            alert('Pizza salva com sucesso!');
            carregarPizzas();
            document.getElementById('appcadastro').style.display = 'none';
            document.getElementById('applista').style.display = 'flex';
        }, function(response) {
            alert('Erro ao salvar pizza: ' + response.error);
        });
    });

    document.getElementById('btnExcluir').addEventListener('click', () => {
        const pizza = document.getElementById('pizza').value;

        cordova.plugin.http.delete('https://pedidos-pizzaria.glitch.me/admin/pizza/' + PIZZARIA_ID + '/' + pizza, {}, {}, function(response) {
            alert('Pizza excluída com sucesso!');
            carregarPizzas();
            document.getElementById('appcadastro').style.display = 'none';
            document.getElementById('applista').style.display = 'flex';
        }, function(response) {
            alert('Erro ao excluir pizza: ' + response.error);
        });
    });

    
    
}

