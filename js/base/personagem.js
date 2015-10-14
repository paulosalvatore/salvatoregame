var personagens = {
	["aliado"] : {
		posicaoInicial: {
			bottom: 100,
			left: 100
		},
		hp: 100,
		statusIniciais: {
			atk: 160,
			def: 70,
			mana: 100
		},
		habilidades: [
			{
				nome: "Fúria Selvagem",
				efeitos: [
					[0, 5, 20]
				],
				custo: 20
			},
			{
				nome: "Canalizar Poder",
				efeitos: [
					[0, 3, 30]
				],
				custo: 0
			}
		]
	},
	["inimigo"] : {
		posicaoInicial: {
			bottom: 100,
			right: 100
		},
		hp: 100,
		statusIniciais: {
			atk: 130,
			def: 80,
			mana: 100
		},
		habilidades: [
			{
				nome: "Fúria Selvagem",
				efeitos: [
					[0, 5, 20]
				],
				custo: 20
			},
			{
				nome: "Canalizar Poder",
				efeitos: [
					[0, 3, 30]
				],
				custo: 0
			}
		]
	}
}

// Habilidades
// nome: "Nome da Habilidade",
// efeitos: [
	// [Alvo (0 ou 1), Tipo, Valor]
// ],
// custo: 20

var habilidades = {
	1: "hp",
	2: "hpmax",
	3: "mana",
	4: "manamax",
	5: "atk",
	6: "def"
}

function inserirPersonagem(id){
	var bloco = '\
		<div class="personagem" id="'+id+'" data-turno="0" data-hp="0" data-hpmax="0" data-atk="0" data-tatk="0" data-def="0" data-tdef="0" data-mana="0" data-tmana="0" data-manamax="0">\
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
console.log($("#"+id));
	$("#"+id+" .imagemPersonagem").css({
		"background": "url(imagens/"+id+".png)"
	});

	$.each(posicaoInicial, function(index, value){
		$("#"+id).css(index, value+"px");
	});

	$("#"+id).data("hp", personagem.hp);
	$("#"+id).data("hpmax", personagem.hp);
	$("#"+id+" .barraVidaPersonagemTexto").append('<span class="HPAtual">'+personagem.hp+"</span>/"+personagem.hp);

	var statusIniciais = personagem.statusIniciais;
	$.each(statusIniciais, function(index, value){
		$("#"+id).data(index, value);
		$("#"+id+" .barraStatusPersonagem").append(index+": "+value+"<br>");
	});

	if(id == "aliado"){
		var conteudoBarraHabilidadesPersonagem = '<div class="ataque"></div>';

		var habilidadesPersonagem = personagem.habilidades;
		$.each(habilidadesPersonagem, function(index, value){
			conteudoBarraHabilidadesPersonagem += '<div class="habilidade" data-habilidade="'+index+'"></div>';
		});

		var barraHabilidadesPersonagem = '\
			<div class="barraHabilidadesPersonagem left">\
				'+conteudoBarraHabilidadesPersonagem+'\
			</div>\
		';

		$("#"+id).append(barraHabilidadesPersonagem);
	}

	$("#"+id+" .turnoPersonagem").addClass((id == "aliado" ? "left" : "right"));
}

function atacarPersonagem(atacanteId, defensorId){
	var atacante = $("#"+atacanteId);
	var defensor = $("#"+defensorId);
	var atacanteATK = atacante.data("atk");
	var atacanteATKAdicional = atacante.data("tatk");
	var defensorDEF = defensor.data("def");
	var defensorDEFAdicional = defensor.data("tdef");
	var ataque = atacanteATK + atacanteATKAdicional - defensorDEF + defensorDEFAdicional;

	if(ataque > 0){
		var defensorHP = defensor.data("hp");
		var novoHPDefensor = defensorHP - ataque;
		if(alterarHP(defensorId, novoHPDefensor, ataque)){
			declararVitoria(atacanteId);
			finalizarTurno(atacanteId);
			return;
		}
	}

	processarTurnos(atacanteId, defensorId);
}

function usarHabilidade(personagemId, inimigoId, habilidadeId){
	var habilidade = personagens[personagemId].habilidades[habilidadeId];

	var custo = habilidade.custo;
	var efeitos = habilidade.efeitos;
	
	$.each(efeitos, function(index, value){
		var alvo = value[0];
		var tipo = value[1];
		var valor = value[2];
		switch(tipo){
			case 5:
				var elemento = $("#"+(alvo == 0 ? personagemId : inimigoId)).data("tatk", valor);
				break;
		}
	});

	// var habilidades = {
		// 1: "HP",
		// 2: "HPMax",
		// 3: "Mana",
		// 4: "ManaMax",
		// 5: "ATK",
		// 6: "DEF"
	// }

}

function alterarHP(personagemId, novoHP, dano){
	var personagem = $("#"+personagemId);

	var HPMax = personagem.data("hpmax");
	personagem.data("hp", novoHP);
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
		setTimeout(function(){
			inteligenciaArtificial(personagemId);
		}, 2000);
	}
}

function animarTurno(personagemId){
	var tempoAnimacao = 180;
	var elemento = $("#"+personagemId)

	var elementoTurno = elemento.find(".turnoPersonagem");
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

	$(".barraHabilidadesPersonagem.left .habilidade").click(function(){
		var turno = $(this).closest(".personagem").data("turno");
		if(turno == 0)
			return false;

		var personagem = $(this).closest(".personagem");
		var personagemId = personagem.attr("id");
		var inimigoId = (personagemId == "aliado" ? "inimigo" : "aliado");

		var habilidade = $(this).data("habilidade");
		usarHabilidade(personagemId, inimigoId, habilidade);
	});
});