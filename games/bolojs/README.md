# Função Bolo

Jogo estático em HTML, CSS e JavaScript para praticar funções, parâmetros, argumentos e `return` por meio de 24 receitas.

## Publicar no Netlify

1. Baixe e extraia `funcao-bolo-netlify.zip`.
2. Abra [Netlify Drop](https://app.netlify.com/drop).
3. Arraste para a página a pasta extraída que contém `index.html`, `style.css` e `script.js`.
4. Aguarde a publicação e abra o endereço gerado.

Não é necessário instalar dependências, configurar um build ou usar backend. Também é possível colocar os três arquivos em um repositório Git e importar o repositório no Netlify.

## Sobre os exercícios

O trecho amarelo é o único campo editável. O conteúdo esperado muda em cada fase. Em `function ___()`, por exemplo, digite apenas o nome da função, pois os parênteses e o corpo já estão escritos. Em outros exercícios, o espaço pede um parâmetro, uma expressão, uma chamada ou parte do corpo da função.

Os ingredientes usam chaves como `"acucar"` porque esse é o identificador cadastrado no jogo. Isso não ocorre por uma proibição de acentos em JavaScript; a chave precisa apenas corresponder ao nome usado pelo jogo.

O código digitado é executado em um iframe isolado, separado da página principal, com uma política de segurança que bloqueia conexões de rede dentro do ambiente de execução. O progresso e as respostas digitadas são salvos no armazenamento local do navegador. O botão **zerar progresso** apaga esse estado.

## Arquivos

- `index.html` contém a estrutura do jogo.
- `style.css` define o visual retrô responsivo.
- `script.js` contém as 24 fases, a validação e o ambiente de execução isolado.
