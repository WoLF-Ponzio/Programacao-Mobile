document.addEventListener('deviceready', onDeviceReady, false);


function onDeviceReady() {
    cordova.plugin.http.setDataSerializer('json');
    carregarPizzas(); 
}

const PIZZARIA_ID = 'Pizza Ponzio';
var listaPizzasCadastradas = [];

// Função para carregar as pizzas cadastradas
function carregarPizzas() {
    var url = 'https://pedidos-pizzaria.glitch.me/admin/pizzas/' + PIZZARIA_ID;

    // Efetuar um GET para obter as pizzas cadastradas
    cordova.plugin.http.get(url, {}, {}, function(response) {
        if (response.data !== "") {
            listaPizzasCadastradas = JSON.parse(response.data);

            // Limpar a lista antes de adicionar as pizzas novamente
            document.getElementById('listaPizzas').innerHTML = '';

            // Montar a lista na tela
            listaPizzasCadastradas.forEach(function(item, idx) {
                var novo = document.createElement('div');
                novo.classList.add('linha');
                novo.innerHTML = item.pizza;
                novo.id = idx;
                novo.onclick = function() {
                    carregarDadosPizza(novo.id);
                };

                document.getElementById('listaPizzas').appendChild(novo);
            });
        }
    }, function(response) {
        console.error('Erro ao carregar as pizzas: ' + response.error);
    });
}

// Função para carregar os dados da pizza selecionada
function carregarDadosPizza(id) {

    document.getElementById('applista').style.display = 'none';
    document.getElementById('appcadastro').style.display = 'flex';
    document.getElementById('id').value = id;
    document.getElementById('pizza').value = listaPizzasCadastradas[id].pizza;
    document.getElementById('preco').value = listaPizzasCadastradas[id].preco;
    document.getElementById('imagem').style.backgroundImage = 'url(' + listaPizzasCadastradas[id].imagem + ')';
}

// Função para cancelar e voltar de tela
document.getElementById('btnCancelar').addEventListener('click', function() {

    document.getElementById('applista').style.display = 'flex';
    document.getElementById('appcadastro').style.display = 'none';
});

// Função para tirar uma foto da pizza
document.getElementById('btnFoto').addEventListener('click', function() {
    // Configurações para a captura da foto
    var options = {
        quality: 70,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE
    };

    // Chamada à API do plugin da câmera para tirar a foto
    navigator.camera.getPicture(function(imageUri) {
        // Exibir a imagem capturada no elemento imagem
        document.getElementById('imagem').style.backgroundImage = 'url(' + imageUri + ')';
    }, function(message) {
        console.error('Erro ao tirar foto: ' + message);
    }, options);
});

// Função para salvar a pizza
document.getElementById('btnSalvar').addEventListener('click', function() {
    var pizza = document.getElementById('pizza').value;
    var preco = document.getElementById('preco').value;
    var imagem = document.getElementById('imagem').style.backgroundImage;

    var PIZZARIA_ID = 'Pizza Ponzio';
    var url = 'https://pedidos-pizzaria.glitch.me/admin/pizza/';

    // Efetuar um POST para salvar a nova pizza
    cordova.plugin.http.post(url, {
        pizzaria: PIZZARIA_ID,
        pizza: pizza,
        preco: preco,
        imagem: imagem
    }, {}, function(response) {
        console.log('Pizza cadastrada com sucesso:', response.data);
        // Recarregar a lista de pizzas após o cadastro
        carregarPizzas();
        // Voltar para a tela de lista após salvar
        document.getElementById('applista').style.display = 'flex';
        document.getElementById('appcadastro').style.display = 'none';
    }, function(response) {
        console.error('Erro ao cadastrar a pizza:', response.error);
    });
});

// Função para excluir a pizza
document.getElementById('btnExcluir').addEventListener('click', function() {
    var idPizza = document.getElementById('id').value;
    var url = 'https://pedidos-pizzaria.glitch.me/admin/pizza/' + PIZZARIA_ID + '/' + idPizza;

    // Efetuar uma requisição DELETE para excluir a pizza
    cordova.plugin.http.delete(url, {}, {}, function(response) {
        console.log('Pizza excluída com sucesso:', response.data);
        alert('Pizza excluída com sucesso!');
        carregarPizzas();
        document.getElementById('applista').style.display = 'flex';
        document.getElementById('appcadastro').style.display = 'none';
    }, function(response) {
        console.error('Erro ao excluir a pizza:', response.error);
    });
});
