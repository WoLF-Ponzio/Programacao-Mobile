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

function carregarDadosPizza(id) {
    var pizzaSelecionada = listaPizzasCadastradas[id];
    document.getElementById('id').value = pizzaSelecionada._id;
    document.getElementById('pizza').value = pizzaSelecionada.pizza;
    document.getElementById('preco').value = pizzaSelecionada.preco;

    var imageData;
    if (pizzaSelecionada.imagem && typeof pizzaSelecionada.imagem === 'string' && pizzaSelecionada.imagem.startsWith('data:image/jpeg;base64,')) {
        imageData = pizzaSelecionada.imagem.split(',')[1];
    } else {
        imageData = pizzaSelecionada.imagem;
    }

    document.getElementById('imagem').style.backgroundImage = "url('data:image/jpeg;base64," + imageData + "')";
    document.getElementById('imagem').dataset.imageData = imageData; // Armazenar a imagem em base64
    document.getElementById('btnSalvar').style.display = 'block';
    document.getElementById('btnExcluir').style.display = 'block';
    document.getElementById('applista').style.display = 'none';
    document.getElementById('appcadastro').style.display = 'flex';
    document.getElementById('appcadastro').dataset.id = id;
}

// Função para alternar entre as telas
document.getElementById('btnCancelar').addEventListener('click', function() {
    document.getElementById('applista').style.display = 'flex';
    document.getElementById('appcadastro').style.display = 'none';
});

// Função para abrir a tela de cadastro de uma nova pizza
function abrirCadastroNovaPizza() {
    document.getElementById('id').value = '';
    document.getElementById('pizza').value = '';
    document.getElementById('preco').value = '';
    document.getElementById('imagem').style.backgroundImage = 'none';
    delete document.getElementById('imagem').dataset.imageData;

    document.getElementById('btnSalvar').style.display = 'block';
    document.getElementById('btnExcluir').style.display = 'none';
    document.getElementById('applista').style.display = 'none';
    document.getElementById('appcadastro').style.display = 'flex';
}

document.getElementById('btnNovo').addEventListener('click', abrirCadastroNovaPizza);

// Função para cancelar e voltar de tela
document.getElementById('btnCancelar').addEventListener('click', function() {

    document.getElementById('applista').style.display = 'flex';
    document.getElementById('appcadastro').style.display = 'none';
});

// Função para tirar uma foto da pizza
document.getElementById('btnFoto').addEventListener('click', function() {
    var options = {
        quality: 75,
        destinationType: Camera.DestinationType.DATA_URL,
    };

    navigator.camera.getPicture(function(imageData) {
        compressImage("data:image/jpeg;base64," + imageData, 0.5, function(compressedImageData) {
            document.getElementById('imagem').style.backgroundImage = "url('" + compressedImageData + "')";
            document.getElementById('imagem').dataset.imageData = compressedImageData.split(',')[1]; // Armazenar o URI da imagem para o envio
        });
    }, function(message) {
        console.error('Erro ao tirar foto: ' + message);
    }, options);
});

// Função para comprimir imagem
function compressImage(dataUrl, quality, callback) {
    var img = new Image();
    img.src = dataUrl;
    img.onload = function() {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        var newDataUrl = canvas.toDataURL('image/jpeg', quality);
        callback(newDataUrl);
    };
}



// Função para salvar a pizza
document.getElementById('btnSalvar').addEventListener('click', function() {
    var pizza = document.getElementById('pizza').value;
    var preco = document.getElementById('preco').value;
    var imageData = document.getElementById('imagem').dataset.imageData;

    var formData = {
        pizzaria: PIZZARIA_ID,
        pizza: pizza,
        preco: preco,
        imagem: imageData
    };

    cordova.plugin.http.post('https://pedidos-pizzaria.glitch.me/admin/pizza/', formData, {}, function(response) {
        console.log('Pizza cadastrada com sucesso:', response.data);
        alert('Pizza cadastrada com sucesso!');
        carregarPizzas();

        document.getElementById('applista').style.display = 'flex';
        document.getElementById('appcadastro').style.display = 'none';
    }, function(response) {
        console.error('Erro ao cadastrar a pizza:', response.error);
    });
});

// Função para excluir a pizza
document.getElementById('btnExcluir').addEventListener('click', function() {
    var idPizza = document.getElementById('appcadastro').dataset.id;
    var pizzaSelecionada = listaPizzasCadastradas[idPizza];
    var url = 'https://pedidos-pizzaria.glitch.me/admin/pizza/' + PIZZARIA_ID + '/' + pizzaSelecionada.pizza;

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