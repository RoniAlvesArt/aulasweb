// fetch('https://api.github.com/users/RoniAlvesArt').then(function(respostaServidor){console.log(respostaServidor)});

fetch('https://api.github.com/users/RoniAlvesArt').then(function(respostaServidor){return respostaServidor.json()})

.then(function(respostaConvertida){
    console.log(respostaConvertida)
})