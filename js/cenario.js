/* Cenários */

function construirCenarioPrincipal(){
	var bloco = '\
		<div id="backgroundPrincipal"></div>\
	';

	$("#areaJogo").html(bloco);
}

function construirCenarioBatalha(){
	var bloco = '\
		<div id="backgroundBatalha"></div>\
		<div id="topUI"></div>\
		<div align="center">\
			<div class="barraHabilidades">\
				<div class="habilidade um" data-habilidade="">\
					<div class="imagem"></div>\
				</div>\
				<div class="habilidade dois" data-habilidade="">\
					<div class="imagem"></div>\
				</div>\
				<div class="habilidade tres" data-habilidade="">\
					<div class="imagem"></div>\
				</div>\
			</div>\
		</div>\
		<div class="plataformaPedra top"></div>\
		<div class="plataformaGrama top"></div>\
		<div class="plataformaPedra bot"></div>\
		<div class="plataformaGrama bot"></div>\
	';

	$("#areaJogo").html(bloco);
}

/* Console */

function inserirConsole(){
	var bloco = '\
		<div align="center">\
			<div id="console">\
				<div id="conteudoConsole"></div>\
			</div>\
		</div>\
	';

	$("#areaJogo").append(bloco);
}

function inserirMensagemConsole(mensagem){
	var elemento = $("#conteudoConsole");

	elemento.append(mensagem+"<br>");

	elemento.scrollTop(elemento[0].scrollHeight);
}
