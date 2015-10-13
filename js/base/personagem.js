var personagens = {
	["aliado"] : {
		posicaoInicial: {
			bottom: 100,
			left: 100
		},
		HP: 100,
		statusIniciais: {
			ATK: 160,
			DEF: 70,
			Mana: 100
		}
	},
	["inimigo"] : {
		posicaoInicial: {
			bottom: 100,
			right: 100
		},
		HP: 100,
		statusIniciais: {
			ATK: 130,
			DEF: 80,
			Mana: 100
		}
	}
}

function inserirPersonagem(id){
	var bloco = '\
		<div class="personagem" id="'+id+'" data-turno="0" data-HP="0" data-HPMax="0" data-ATK="0" data-DEF="0" data-Mana="0">\
			<div class="barraVidaPersonagemBase">\
				<div class="alteracaoVidaPersonagem"></div>\
				<div class="barraVidaPersonagemConteudo"></div>\
				<div class="barraVidaPersonagemTexto"></div>\
			</div>\
			<div class="turnoPersonagem"></div>\
			<div class="imagemPersonagem"></div>\
			<div class="barraStatusPersonagem"></div>\
		</div>\
	';

	var personagem = personagens[id];
	var posicaoInicial = personagem.posicaoInicial;

	$("#areaJogo").append(bloco);

	$("#"+id+" .imagemPersonagem").css({
		"background": "url(imagens/"+id+".png)"
	});

	$.each(posicaoInicial, function(index, value){
		$("#"+id).css(index, value+"px");
	});

	$("#"+id).data("HP", personagem.HP);
	$("#"+id).data("HPMax", personagem.HP);
	$("#"+id+" .barraVidaPersonagemTexto").append('<span class="HPAtual">'+personagem.HP+"</span>/"+personagem.HP);

	var statusIniciais = personagem.statusIniciais;
	$.each(statusIniciais, function(index, value){
		$("#"+id).data(index, value);
		$("#"+id+" .barraStatusPersonagem").append(index+": "+value+"<br>");
	});

	if(id == "aliado")
		$("#"+id).append('\
			<div class="barraHabilidadesPersonagem left">\
				<div class="ataque"></div>\
				<div class="habilidade"></div>\
			</div>\
		');

	$("#"+id+" .turnoPersonagem").addClass((id == "aliado" ? "left" : "right"));
}

function atacarPersonagem(atacanteId, defensorId){
	var atacante = $("#"+atacanteId);
	var defensor = $("#"+defensorId);
	var atacanteATK = atacante.data("ATK");
	var defensorDEF = defensor.data("DEF");
	var ataque = atacanteATK - defensorDEF;

	if(ataque > 0){
		var defensorHP = defensor.data("HP");
		var novoHPDefensor = defensorHP - ataque;
		if(alterarHP(defensorId, novoHPDefensor, ataque)){
			declararVitoria(atacanteId);
			finalizarTurno(atacanteId);
			return;
		}
	}

	processarTurnos(atacanteId, defensorId);
}

function alterarHP(personagemId, novoHP, dano){
	var personagem = $("#"+personagemId);

	var HPMax = personagem.data("HPMax");
	personagem.data("HP", novoHP);
	var novoHP = Math.max(novoHP, 0);

	var novaLarguraBarraHP = novoHP*100/HPMax;

	personagem.find(".HPAtual").text(novoHP);
	personagem.find(".barraVidaPersonagemConteudo").css("width", novaLarguraBarraHP+"%");

	var alteracaoVidaPersonagem = personagem.find(".alteracaoVidaPersonagem");
	var marginTop = parseInt(alteracaoVidaPersonagem.css("margin-top").replace("px", ""));

	alteracaoVidaPersonagem
		.html(dano)
		.css("opacity", 1)
		.animate({"margin-top": marginTop-150, "opacity": 0}, 1500, function(){
			$(this).css("margin-top", marginTop);
		});

	if(novoHP == 0){
		matarPersonagem(personagemId);
		return true;
	}

	return false;
}

function matarPersonagem(personagemId){
	var personagem = $("#"+personagemId);
	personagem.find(".imagemPersonagem").animate({"opacity": 0}, 1000);
}

function iniciarTurno(personagemId){
	$("#"+personagemId).data("turno", 1);
	animarTurno(personagemId);

	if(personagemId == "inimigo"){
		console.log("Inteligência Artificial");
		setTimeout(function(){
			inteligenciaArtificial(personagemId);
		}, 2000);
	}
}

function animarTurno(personagemId){
	var tempoAnimacao = 180;
	var elemento = $("#"+personagemId)

	var elementoTurno = elemento.find(".turnoPersonagem");
	console.log(elemento.data("turno"));
	if(elemento.data("turno") == 0)
		return false;

	var posicaoTop = parseInt(elementoTurno.css("top").replace("px", ""));
	elementoTurno.fadeIn(500);
	elementoTurno.animate({"top": posicaoTop-20}, tempoAnimacao, function(){
		$(this).animate({"top": posicaoTop}, tempoAnimacao+50, function(){
			setTimeout(function(){
				animarTurno(personagemId);
			}, tempoAnimacao+150);
		});
	});
}

function finalizarTurno(personagemId){
	$("#"+personagemId)
	.data("turno", 0)
	.find(".turnoPersonagem")
	.fadeOut(200);
}

function inteligenciaArtificial(personagemId){
	var inimigoId = "aliado";
	atacarPersonagem(personagemId, inimigoId);
}

function processarTurnos(personagem1, personagem2){
	finalizarTurno(personagem1);
	iniciarTurno(personagem2);
}

function declararVitoria(personagemId){
	$("#vitoria")
	.css("opacity", 0)
	.html("Você "+(personagemId == "aliado" ? "venceu" : "perdeu")+"!")
	.addClass((personagemId == "aliado" ? "vitoria" : "derrota"))
	.animate({"opacity": 1}, 1000);
}

$(function(){
	inserirPersonagem("aliado");
	inserirPersonagem("inimigo");
	iniciarTurno("aliado");

	$(".barraHabilidadesPersonagem.left .ataque").click(function(){
		var turno = $(this).closest(".personagem").data("turno");
		if(turno == 0)
			return false;

		var personagem = $(this).closest(".personagem");
		var personagemId = personagem.attr("id");
		var inimigoId = (personagemId == "aliado" ? "inimigo" : "aliado");

		atacarPersonagem(personagemId, inimigoId);
	});

});