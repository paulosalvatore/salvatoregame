var personagens = {
	["aliado"]: {
		valoresIniciais: {
			posicao: {
				bottom: 100,
				left: 100
			},
			hp: 100,
			mp: 30,
			status: {
				atk: 10,
				def: 5
			}
		},
		habilidades: [
			{
				nome: "Fúria Selvagem",
				efeitos: [
					[0, 5, 100, 1]
				],
				custo: 20
			},
			{
				nome: "Canalizar Poder",
				efeitos: [
					[0, 3, 30, 0]
				],
				custo: 0
			}
		],
		data: {
			turno: 0,
			status: {},
			statusAdicionais: {},
			modificadores: []
		}
	},
	["inimigo"]: {
		valoresIniciais: {
			posicao: {
				bottom: 100,
				right: 100
			},
			hp: 100,
			mp: 100,
			status: {
				atk: 10,
				def: 5
			}
		},
		habilidades: [
			{
				nome: "Fúria Selvagem",
				efeitos: [
					[0, 5, 20, 1]
				],
				custo: 20
			},
			{
				nome: "Canalizar Poder",
				efeitos: [
					[0, 3, 30, 0]
				],
				custo: 0
			}
		],
		data: {
			turno: 0,
			status: {},
			statusAdicionais: {},
			modificadores: []
		}
	}
}

var habilidades = {
	"hp": "HP",
	"hpmax": "HPMax",
	"mp": "MP",
	"mpmax": "MPMax",
	"atk": "ATK",
	"def": "DEF"
}

function inserirPersonagem(id){
	var bloco = '\
		<div class="personagem" id="'+id+'">\
			<div class="alteracaoPersonagem"></div>\
			<div class="hpBarraPersonagemBase">\
				<div class="hpBarraPersonagemConteudo"></div>\
				<div class="hpBarraPersonagemTexto"></div>\
			</div>\
			<div class="mpBarraPersonagemBase">\
				<div class="mpBarraPersonagemConteudo"></div>\
				<div class="mpBarraPersonagemTexto"></div>\
			</div>\
			<div class="turnoPersonagem">\
				<img src="imagens/turno.gif">\
			</div>\
			<div class="imagemPersonagem"></div>\
			<div class="barraStatusPersonagem"></div>\
			<div class="barraModificadoresPersonagem"></div>\
		</div>\
	';

	var bloco = '\
		<div class="personagem" id="'+id+'">\
			<div class="hpBarraPersonagemBase">\
				<div class="hpBarraPersonagemConteudo"></div>\
				<div class="hpBarraPersonagemTexto"></div>\
			</div>\
		</div>\
	';

	var personagem = personagens[id];
	var valoresIniciais = personagem.valoresIniciais;
	var posicao = valoresIniciais.posicao;
	var hp = valoresIniciais.hp;
	var mp = valoresIniciais.mp;
	var status = valoresIniciais.status;

	$("#areaJogo").append(bloco);

	$("#"+id+" .imagemPersonagem").css({
		"background": "url(imagens/"+id+".png)"
	});

	$.each(posicao, function(index, value){
		$("#"+id).css(index, value+"px");
	});

	personagens[id].data.status.hp = hp;
	personagens[id].data.status.hpmax = hp;
	personagens[id].data.status.mp = mp;
	personagens[id].data.status.mpmax = mp;

	$("#"+id+" .hpBarraPersonagemTexto").append('<span class="hp_atual">'+hp+"</span>/"+hp);
	$("#"+id+" .mpBarraPersonagemTexto").append('<span class="mp_atual">'+mp+"</span>/"+mp);

	$.each(status, function(index, value){
		personagens[id].data.status[index] = value;
		personagens[id].data.statusAdicionais[index] = 0;
		// $("#"+id+" .barraStatusPersonagem").append(habilidades[index]+": "+value+'<span class="'+index+'_adicional">+0</span><br>');
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

		// $("#"+id).append(barraHabilidadesPersonagem);
	}

	$("#"+id+" .turnoPersonagem").addClass((id == "aliado" ? "left" : "right"));
}

function atacarPersonagem(personagemId, inimigoId){
	var atk = pegarStatusPersonagem(personagemId, "atk");
	var atkAdicional = pegarStatusAdicionalPersonagem(personagemId, "atk");
	var def = pegarStatusPersonagem(inimigoId, "def");
	var defAdicional = pegarStatusAdicionalPersonagem(inimigoId, "def");
	var ataque = atk + atkAdicional - def - defAdicional;

	if(ataque > 0){
		if(alterarHPPersonagem(inimigoId, -ataque)){
			declararVitoria(personagemId);
			finalizarTurno(personagemId);
			return;
		}
	}

	processarTurnos(personagemId, inimigoId);
}

function usarHabilidade(personagemId, inimigoId, habilidadeId){
	var habilidade = pegarHabilidadePersonagem(personagemId, habilidadeId);
	var custo = habilidade.custo;
	var mp = pegarMPPersonagem(personagemId);

	if(mp < custo){
		inserirMensagemConsole("MP Insuficiente.");
		return false;
	}

	alterarMPPersonagem(personagemId, -custo)

	var efeitos = habilidade.efeitos;

	$.each(efeitos, function(index, value){
		var alvo = value[0];
		var alvoId = (alvo == 0 ? personagemId : inimigoId);
		var tipo = value[1];
		var valor = value[2];
		var turnos = (value[3] && value[3] > 0 ? value[3] : 0);

		switch(tipo){
			case 3:
				alterarMPPersonagem(alvoId, valor);
				break;
			case 5:
				adicionarModificadorPersonagem(alvoId, "atk", valor, turnos);
				break;
		}
	});

	processarTurnos(personagemId, inimigoId);
}

function exibirSinalValor(valor){
	return (valor >= 0 ? "+" : "")+valor;
}

function alterarBarra(tipo, personagemId, novaQuantidade, quantidadeAlterada, quantidadeMax){
	var personagem = $("#"+personagemId);

	var novaQuantidade = Math.max(novaQuantidade, 0);
	var novaLarguraBarra = novaQuantidade*100/quantidadeMax;

	if(quantidadeAlterada != 0){
		personagem
			.find("."+tipo+"_atual")
			.text(novaQuantidade);
		personagem
			.find("."+tipo+"BarraPersonagemConteudo")
			.css("width", novaLarguraBarra+"%");

		var alteracaoPersonagemClone = personagem.find(".alteracaoPersonagem:first").clone();
		var alteracaoPersonagem = personagem.append(alteracaoPersonagemClone);
		var marginTop = parseInt(alteracaoPersonagem.css("margin-top").replace("px", ""));

		alteracaoPersonagemClone
			.html(exibirSinalValor(quantidadeAlterada))
			.css({
				"color": (tipo == "hp" ? "red" : "blue"),
				"opacity": 1
			})
			.animate({"margin-top": marginTop-150, "opacity": 0}, 1500, function(){
				$(this).remove();
			});
	}

	return false;
}

function matarPersonagem(personagemId){
	var personagem = $("#"+personagemId);
	personagem.find(".imagemPersonagem").animate({"opacity": 0}, 1000);
}

function iniciarTurno(personagemId){
	personagens[personagemId].data.turno = 1;

	$("#"+personagemId).find(".turnoPersonagem").fadeIn(500);

	if(personagemId == "inimigo"){
		setTimeout(function(){
			inteligenciaArtificial(personagemId);
		}, 2000);
	}
}

function finalizarTurno(personagemId){
	personagens[personagemId].data.turno = 0;

	var modificadores = pegarModificadoresPersonagem(personagemId);
	$.each(modificadores, function(index, modificador){
		if(modificador[3] == 1)
			personagens[personagemId].data.modificadores[index][3] = 0;
		else if(modificador[2] > 0)
			personagens[personagemId].data.modificadores[index][2] = modificador[2] - 1;
	});

	atualizarModificadoresPersonagem(personagemId);

	$("#"+personagemId+" .modificadorPersonagem").each(function(){
		if(parseInt($(this).data("bloqueado")) == 1)
			$(this).data("bloqueado", 0);
		else{
			var novoTurno = parseInt($(this).data("turno")) - 1;
			if(novoTurno == 0)
				$(this).remove();
			else
				$(this)
					.data("turno", novoTurno)
					.find(".turno")
					.text(novoTurno);
		}
	});

	$("#"+personagemId)
	.find(".turnoPersonagem")
	.fadeOut(200);
}

function inteligenciaArtificial(personagemId){
	var inimigoId = "aliado";
	atacarPersonagem(personagemId, inimigoId);
	processarTurnos(personagemId, inimigoId);
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

function adicionarModificadorPersonagem(personagemId, tipo, valor, turnos){
	personagens[personagemId].data.modificadores.push([tipo, valor, turnos, 1]);

	var bloco = '\
		<div class="modificadorPersonagem" data-bloqueado="1" data-turno="'+turnos+'">\
			'+tipo+': '+valor+'<br>\
			Turnos: <span class="turno">'+turnos+'</span>\
		</div>\
	';

	$("#"+personagemId+" .barraModificadoresPersonagem").append(bloco);

	atualizarModificadoresPersonagem(personagemId);
}

function atualizarModificadoresPersonagem(personagemId){
	var modificadores = pegarModificadoresPersonagem(personagemId);
	$.each(modificadores, function(index, modificador){
		var valor = modificador[1];
		var turnos = modificador[2];
		if(turnos == 0){
			valor = 0;
			personagens[personagemId].data.modificadores[index][1] = valor;
		}
	});

	personagens[personagemId].data.statusAdicionais = {};

	$.each(modificadores, function(index, modificador){
		var tipo = modificador[0];
		var valor = modificador[1];
		var valorAtual = personagens[personagemId].data.statusAdicionais[tipo] || 0;
		var novoValor = valor + valorAtual;

		personagens[personagemId].data.statusAdicionais[tipo] = novoValor;

		$("#"+personagemId)
		.find("."+tipo+"_adicional")
		.text(exibirSinalValor(novoValor));
	});
}

function inserirMensagemConsole(mensagem){
	var elemento = $("#conteudoConsole");
	elemento.append(mensagem+"<br>");
	elemento.scrollTop(elemento[0].scrollHeight);
}

function pegarModificadoresPersonagem(personagemId){
	return personagens[personagemId].data.modificadores;
}

function pegarTurnoPersonagem(personagemId){
	return personagens[personagemId].data.turno;
}

function pegarHPPersonagem(personagemId){
	return personagens[personagemId].data.status.hp;
}

function pegarHPMaxPersonagem(personagemId){
	return personagens[personagemId].data.status.hpmax;
}

function pegarMPPersonagem(personagemId){
	return personagens[personagemId].data.status.mp;
}

function pegarMPMaxPersonagem(personagemId){
	return personagens[personagemId].data.status.mpmax;
}

function pegarHabilidadePersonagem(personagemId, habilidadeId){
	return personagens[personagemId].habilidades[habilidadeId];
}

function pegarStatusPersonagem(personagemId, status){
	return personagens[personagemId].data.status[status] || 0;
}

function pegarStatusAdicionalPersonagem(personagemId, status){
	return personagens[personagemId].data.statusAdicionais[status] || 0;
}

function alterarHPPersonagem(personagemId, quantidade){
	var quantidadeMax = pegarHPMaxPersonagem(personagemId);
	var novaQuantidade = Math.min(pegarHPPersonagem(personagemId) + quantidade, quantidadeMax);
	personagens[personagemId].data.status.hp = novaQuantidade;
	alterarBarra("hp", personagemId, novaQuantidade, quantidade, quantidadeMax);
	if(novaQuantidade <= 0){
		matarPersonagem(personagemId);
		return true;
	}
	return false;
}

function alterarMPPersonagem(personagemId, quantidade){
	var quantidadeMax = pegarMPMaxPersonagem(personagemId);
	var novaQuantidade = Math.min(pegarMPPersonagem(personagemId) + quantidade, quantidadeMax);
	personagens[personagemId].data.status.mp = novaQuantidade;
	alterarBarra("mp", personagemId, novaQuantidade, quantidade, quantidadeMax);
}

function adicionarPersonagemEmSlot(slot){
	var bloco = '\
		<div class="personagem slot'+slot+'">\
			<div class="barraModificadoresPersonagem">\
				<div class="modificador ataque1"></div>\
				<div class="modificador ataque2"></div>\
			</div>\
			<div class="circuloLevelPersonagem">\
				<div class="level unidade um"></div>\
			</div>\
			<div class="hpBarraPersonagemBase">\
				<div class="fundoBarraPersonagemBase"></div>\
				<div class="fundoBarraPersonagemBaseCanto"></div>\
				<div class="hpBarraPersonagemConteudo"></div>\
				<div class="hpBarraPersonagemTexto"></div>\
				<div class="fundoBarraCanto"></div>\
			</div>\
			<div class="mpBarraPersonagemBase">\
				<div class="fundoBarraPersonagemBase"></div>\
				<div class="fundoBarraPersonagemBaseCanto"></div>\
				<div class="mpBarraPersonagemConteudo"></div>\
				<div class="mpBarraPersonagemTexto"></div>\
				<div class="fundoBarraCanto"></div>\
			</div>\
			<div class="imagem"></div>\
			<div class="turno"></div>\
		</div>\
	';
	$("#areaJogo").append(bloco);
}

$(function(){
	adicionarPersonagemEmSlot(1);
	adicionarPersonagemEmSlot(2);
	adicionarPersonagemEmSlot(3);
	adicionarPersonagemEmSlot(4);
	adicionarPersonagemEmSlot(5);
	adicionarPersonagemEmSlot(6);
	adicionarPersonagemEmSlot(7);
	adicionarPersonagemEmSlot(8);
	// inserirPersonagem("aliado");
	// inserirPersonagem("inimigo");
	// iniciarTurno("aliado");

	$(".barraHabilidadesPersonagem.left .ataque").click(function(){
		var personagem = $(this).closest(".personagem");
		var personagemId = personagem.attr("id");

		var turno = pegarTurnoPersonagem(personagemId);
		if(turno == 0)
			return false;

		var inimigoId = (personagemId == "aliado" ? "inimigo" : "aliado");

		atacarPersonagem(personagemId, inimigoId);
	});

	$(".barraHabilidadesPersonagem.left .habilidade").click(function(){
		var personagem = $(this).closest(".personagem");
		var personagemId = personagem.attr("id");

		var turno = pegarTurnoPersonagem(personagemId);
		if(turno == 0)
			return false;

		var inimigoId = (personagemId == "aliado" ? "inimigo" : "aliado");

		var habilidadeId = $(this).data("habilidade");

		usarHabilidade(personagemId, inimigoId, habilidadeId);
	});
});