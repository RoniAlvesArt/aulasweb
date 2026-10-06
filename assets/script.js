function carregarComponente(idContainer, caminhoArquivo){
    fetch(caminhoArquivo)
    .then(function(resposta){
        return resposta.text();
    })
    .then(function(conteudo){
        var container = document.getElementById(idContainer);

        container.innerHTML = conteudo;
    })
}

var paginaAtual = window.location.pathname;

function carregarPagina(pagina) {

    if (pagina === 'home') {
        carregarComponente('content', 'pages/home.html');

    } else if (pagina === 'extra') {
        carregarComponente('content', 'pages/extra.html');

    } else if (pagina === 'atividades') {
        carregarComponente('content', 'pages/atividades.html');
    }

}

carregarComponente('header-content','components/header.html')
carregarComponente('footer-content', 'components/footer.html')
carregarPagina('home');