# Modificando o HTML com JavaScript

## Input, button, querySelector(), innerHTML

Para editar as `tags` HTML precisamos utilizar pelo menos três novos recursos:
1. A tag `<input>`;
2. A tag `<button>`;
3. O método `querySelector()`
4. A propriedade `innerHTML`;

### Entendendo as peças do quebra-cabeças

#### Parte HTML

A tag `<input>` é usada para obter informações digitadas pelo usuário. Entre seus atributos, você pode usar o atributo `placeholder` indica o texto que será mostrado ao usuário.

Também utilizamos a tag `<button>` junto com o atributo `onClick` como ferramentas para fornecem as informações ao nosso script JavaScript (JS).

#### Parte JavaScript

O método `querySelector()` é utilizado para selecionar o primeiro elemento HTML dentro de uma página que corresponda ao seletor CSS específico.

A propriedade `innerHTML` serve para ler ou alterar todo o conteúdo HTML que está dentro de um elemento selecionado.

---

Exemplo de `<script>`:

```html
<!-- HTML -->
<input placeholder="Digite seu nome">
<button onClick="registrar()">Salvar</button>
<p></p>
```

```javascript
<script>
//Javascript
    function registrar(){
        let cliente = document.querySelector("input").value;
        document.querySelector("p").innerHTML = `Novo registro: ${nome}`;
    }
</script>
```