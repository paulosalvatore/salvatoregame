var personagens = {
	["aliado"] : {
		posicaoInicial: {
			bottom: 100,
			left: 100
		},
		hp: 100,
		mana: 100,
		statusIniciais: {
			atk: 10,
			def: 5
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
		hp: 70,
		mana: 40,
		statusIniciais: {
			atk: 15,
			def: 0
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
	"hp": "HP",
	"hpmax": "HPMax",
	"mana": "Mana",
	"manamax": "ManaMax",
	"atk": "ATK",
	"def": "DEF"
}
// var habilidades = {
	// 1: "HP",
	// 2: "HPMax",
	// 3: "Mana",
	// 4: "ManaMax",
	// 5: "ATK",
	// 6: "DEF"
// }

function inserirPersonagem(id){
	var bloco = '\
		<div class="personagem" id="'+id+'" data-turno="0" data-hp="0" data-hpmax="0" data-atk="0" data-tatk="0" data-def="0" data-tdef="0" data-mana="0" data-tmana="0" data-manamax="0">\
			<div class="alteracaoPersonagem"></div>\
			<div class="hpBarraPersonagemBase">\
				<div class="hpBarraPersonagemConteudo"></div>\
				<div class="hpBarraPersonagemTexto"></div>\
			</div>\
			<div class="manaBarraPersonagemBase">\
				<div class="manaBarraPersonagemConteudo"></div>\
				<div class="manaBarraPersonagemTexto"></div>\
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

	$("#"+id).data("hp", personagem.hp);
	$("#"+id).data("hpmax", personagem.hp);
	$("#"+id+" .hpBarraPersonagemTexto").append('<span class="hp_atual">'+personagem.hp+"</span>/"+personagem.hp);

	$("#"+id).data("mana", personagem.mana);
	$("#"+id).data("manamax", personagem.mana);
	$("#"+id+" .manaBarraPersonagemTexto").append('<span class="mana_atual">'+personagem.mana+"</span>/"+personagem.mana);

	var statusIniciais = personagem.statusIniciais;
	$.each(statusIniciais, function(index, value){
		$("#"+id).data(index, value);
		$("#"+id+" .barraStatusPersonagem").append(habilidades[index]+": "+value+'<span class="t'+index+'">+0</span><br>');
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

	modificarValorAlvo(atacanteId, "tatk", 0)

	if(ataque > 0){
		var defensorHP = defensor.data("hp");
		var novoHPDefensor = defensorHP - ataque;
		if(alterarBarra("hp", defensorId, novoHPDefensor, ataque)){
			declararVitoria(atacanteId);
			finalizarTurno(atacanteId);
			return;
		}
	}

	processarTurnos(atacanteId, defensorId);
}

function usarHabilidade(personagemId, inimigoId, habilidadeId){
	var elemento = $("#"+personagemId)

	var habilidade = personagens[personagemId].habilidades[habilidadeId];

	var custo = habilidade.custo;
	var mana = elemento.data("mana");

	if(mana < custo){
		inserirMensagemConsole("Mana Insuficiente.");
		return false;
	}

	alterarBarra("mana", personagemId, mana-custo, custo);

	var efeitos = habilidade.efeitos;
	
	$.each(efeitos, function(index, value){
		var alvo = value[0];
		var alvoId = (alvo == 0 ? personagemId : inimigoId);
		var tipo = value[1];
		var valor = value[2];
		switch(tipo){
			case 3:
				alterarBarra("mana", alvoId, pegarQuantidadeBarra("mana", alvoId)+valor, valor);
				break;
			case 5:
				modificarValorAlvo(alvoId, "tatk", valor);
				break;
		}
	});

	processarTurnos(personagemId, inimigoId);
}

function modificarValorAlvo(alvoId, tipo, valor){
	$("#"+alvoId)
	.data(tipo, valor)
	.find("."+tipo)
	.text(exibirSinalValor(valor));
}

function exibirSinalValor(valor){
	return (valor >= 0 ? "+" : "-")+valor;
}

function pegarQuantidadeBarra(tipo, personagemId){
	return $("#"+personagemId).data(tipo);
}

function alterarBarra(tipo, personagemId, novaQuantidade, quantidadeAlterada){
	var personagem = $("#"+personagemId);

	var quantidadeMax = pegarQuantidadeBarra(tipo+"max", personagemId);
	personagem.data(tipo, novaQuantidade);
	var novaQuantidade = Math.min(quantidadeMax, Math.max(novaQuantidade, 0));

	var novaLarguraBarra = novaQuantidade*100/quantidadeMax;

	if(quantidadeAlterada > 0){
		personagem.find("."+tipo+"_atual").text(novaQuantidade);
		personagem.find("."+tipo+"BarraPersonagemConteudo").css("width", novaLarguraBarra+"%");

		var alteracaoPersonagemClone = personagem.find(".alteracaoPersonagem:first").clone();
		var alteracaoPersonagem = personagem.append(alteracaoPersonagemClone);
		var marginTop = parseInt(alteracaoPersonagem.css("margin-top").replace("px", ""));

		alteracaoPersonagemClone
			.html(quantidadeAlterada)
			.css({
				"color": (tipo == "hp" ? "red" : "blue"),
				"opacity": 1
			})
			.animate({"margin-top": marginTop-150, "opacity": 0}, 1500, function(){
				$(this).remove();
			});
	}

	if(tipo == "hp" && novaQuantidade == 0){
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

function inserirMensagemConsole(mensagem){
	var elemento = $("#conteudoConsole");
	elemento.append(mensagem+"<br>");
	elemento.scrollTop(elemento[0].scrollHeight);
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