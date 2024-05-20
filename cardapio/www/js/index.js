document.addEventListener('deviceready', function() {
    const PIZZARIA_ID = 'Pizza Ponzio';
    const GET_URL = `https://pedidos-pizzaria.glitch.me/admin/pizzas/`+PIZZARIA_ID;
    const POST_URL = 'https://pedidos-pizzaria.glitch.me/admin/pizza/';
    let imageData = '';

    // Função para capturar a imagem
    document.getElementById('capture-image').addEventListener('click', function() {
        navigator.camera.getPicture(onSuccess, onFail, {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL
        });

        function onSuccess(imageURI) {
            imageData = 'data:image/jpeg;base64,' + imageURI;
            const imagePreview = document.getElementById('image-preview');
            imagePreview.style.backgroundImage = `url(${imageData})`;
            imagePreview.style.backgroundSize = 'cover';
            imagePreview.style.width = '100px';
            imagePreview.style.height = '100px';
        }

        function onFail(message) {
            alert('Falha ao capturar a imagem: ' + message);
        }
    });

    // Função para exibir as pizzas
    function fetchPizzas() {
        cordova.plugin.http.get(GET_URL, {}, {}, function(response) {
            const pizzas = JSON.parse(response.data);
            const pizzaList = document.getElementById('pizza-list');
            pizzaList.innerHTML = ''; // Limpar lista antes de adicionar
            pizzas.forEach(pizza => {
                const li = document.createElement('li');
                li.className = 'list-group-item';
                li.textContent = `${pizza.pizza} - R$${pizza.preco}`;
                pizzaList.appendChild(li);
            });
        }, function(response) {
            console.error('Erro ao buscar pizzas:', response.error);
        });
    }

    // Chamar fetchPizzas ao iniciar o app
    fetchPizzas();

    // Função para cadastrar uma nova pizza
    document.getElementById('pizza-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const price = document.getElementById('price').value;

        const pizzaData = {
            pizzaria: PIZZARIA_ID,
            pizza: name,
            preco: price,
            imagem: imageData
        };

        cordova.plugin.http.setDataSerializer('json');
        cordova.plugin.http.post(POST_URL, pizzaData, {}, function(response) {
            alert('Pizza cadastrada com sucesso!');
            // Atualize a lista de pizzas
            fetchPizzas();
        }, function(response) {
            console.error('Erro ao cadastrar pizza:', response.error);
        });
    });
}, false);