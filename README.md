# AluraFlash BookMarck 🚀 #
**Automação inteligente para cursos da Alura.**

# ⚠️ Aviso Legal #
**Esta extensão é para fins educacionais. Use por sua própria conta e risco.**

## Apenas Copie esse codigo e cole no console ou crie uma Bookmack ##
```javascript
javascript:(function(){const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/gh/Hi55Five/AluraFlashBookmarck@main/script.js?'+Date.now();document.head.appendChild(s);})();
```
# 🚀 Instalação #
**Metodo Favoritos ⭐**
1. **Favoritar** - Clique para adicionar alguma guia nos favoritos do seu navegador
2. **Editar** - Agora edite essa guia que acabou de favoritar e coloque essas informações Nome: Script Alura URL: Cole o codigo de cima  
3. **Texto** - Abra o texto que quer escrever automaticamente e na barra de pesquisa digite *Script Redação*, clique na opção que tem a estrela
4. **Seja Feliz** - Está feito. Agora curta suas horas livres

# 📖 Sobre o Projeto #
A AluraFlash é um codigo para Chrome que automatiza a conclusão de cursos na plataforma Alura. Desenvolvida com JavaScript puro, ela identifica e completa automaticamente diferentes tipos de atividades enquanto você foca no que realmente importa.

# ✨ Funcionalidades #
* 🎯 Tipos de Atividades Suportadas
* 📹 Vídeos - Reproduz automaticamente e avança
* 🔘 Múltipla Escolha - Seleciona todas as alternativas
* 🧩 Ordenar Blocos - Decodifica e ordena corretamente
* 💬 Texto com Opinião - Visualiza opinião do instrutor
* 🔗 Link de Projeto - Preenche e envia automaticamente
* 📷 Texto com Imagem - Avança diretamente

# 🎯 Características Técnicas #
Sistema de Detecção Inteligente
```javascript
function detectActivityType() {
    if (document.querySelector('.vjs-big-play-button, video')) return 'video';
    if (document.querySelector('.alternativeList-item-input')) return 'multipla-escolha';
    if (document.querySelector('.blocks')) return 'ordenar-blocos';
    // ... mais detecções
}
```
Descriptografia de Blocos
```javascript
// Decodifica Base64 duplo dos blocos
const firstDecode = atob(correctOrderBase64);
const finalDecode = atob(firstDecode);
```
# ⚠️ Disclaimer #
Este projeto foi desenvolvido para fins educacionais e de aprendizado em automação web. O uso desta ferramenta deve seguir os Termos de Serviço da plataforma Alura. O autor não se responsabiliza pelo uso indevido da extensão.

# 📄 Licença #
Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

* ⭐ Se este projeto foi útil para você, deixe uma estrela no repositório! 

# *Feliz automação! 🚀🎯* #















