const pizzaria = `Pizza Ponzio`;
const pizzaList = document.getElementById('pizza-list');
var cardapio;

document.addEventListener('deviceready', onDeviceReady, false);

// função que é chamada quando o dispositivo carrega
function onDeviceReady() {
    document.getElementById("direita").addEventListener("click", paginar);
    document.getElementById("esquerda").addEventListener("click", paginar);
    document.getElementById("enviar").addEventListener("click", enviarPedido); 
    carregarMenu();  
}

// carrega os dados das pizzas do backend
function carregarMenu() {
    document.getElementById('load-pizzas').addEventListener('click', function() {
        fetch(`https://pedidos-pizzaria.glitch.me/admin/pizzas/`+ pizzaria)
            .then(response => response.json())
            .then(data => {
                pizzaList.innerHTML = ''; // Limpar lista antes de adicionar novas pizzas
                data.pizzas.forEach(pizza => {
                    const li = document.createElement('li');
                    li.className = 'list-group-item';
                    li.innerHTML = `
                        <h3>${pizza.id}</h3>
                        <h3>${pizza.pizzaria}</h3>
                        <h3>${pizza.pizza}</h3>
                        <p>Preço: ${pizza.preco}</p>
                        <div style="background-image: url('${pizza.imagem}'); height: 100px; width: 100px; background-size: cover;"></div>
                    `;
                    pizzaList.appendChild(li);
                });
            })
            .catch(error => console.error('Error fetching pizzas:', error));
    });
}
// navega entre as pizzas do cardápio
function novaPizza(){
    
}


function PizzaInfo(name, price) {

}











