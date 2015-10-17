var monstros = {
	["draconia"]: {
		valoresIniciais: {
			hp: 100,
			mp: 30,
			status: {
				atk: 10,
				def: 5
			}
		},
		habilidades: [
			{
				nome: "Força Divina",
				imagem: "forcaDivina",
				efeitos: [
					[9, 20, 0]
				],
				alvo: 1,
				recarga: 3,
				custo: 30
			},
			{
				nome: "Fúria Selvagem",
				imagem: "furiaSelvagem",
				efeitos: [
					[7, 10, 2]
				// [tipo, valor, duracao]
				],
				alvo: 2,
				recarga: 3,
				custo: 25
			},
			{
				nome: "Canalizar Poder",
				imagem: "canalizarPoder",
				efeitos: [
					[4, 30, 0]
				],
				alvo: 3,
				recarga: 3,
				custo: 0
			}
		]
	},
	["robo"]: {
		valoresIniciais: {
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
		]
	},
	["zumbi"]: {
		valoresIniciais: {
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
		]
	},
	["esqueleto"]: {
		valoresIniciais: {
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
		]
	}
}

var equipes = {
	"A": {
		monstros: {
			"robo": {
				level: 10
			},
			"draconia": {
				level: 9
			},
			"zumbi": {
				level: 1
			},
			"esqueleto": {
				level: 1
			}
		}
	},
	"B": {
		monstros: {
			"robo": {
				level: 1
			},
			"draconia": {
				level: 1
			},
			"zumbi": {
				level: 1
			},
			"esqueleto": {
				level: 1
			}
		}
	},
}

// var habilidades = {
	// "hp": "HP",
	// "hpmax": "HPMax",
	// "mp": "MP",
	// "mpmax": "MPMax",
	// "atk": "ATK",
	// "def": "DEF"
// }

/*
Habilidades
	1	Cura HP Fixo
	2	Cura HP Porcentagem
	3	Aumenta HPMax
	4	Cura MP Fixo
	5	Cura MP Porcentagem
	6	Aumenta MPMax
	7	Buff ATK
	8	Buff DEF
	9	ATK - Usa Status
	10	ATK - Porcentagem HP Aliado
	11	ATK - Porcentagem HP Inimigo
*/

/*
Alvos
	1	Inimigo
	2	Aliado
	3	Si Mesmo
*/

var numeros = ["zero", "um", "dois", "tres", "quatro", "cinco", "seis", "sete", "oito", "nove"];

/* Monstros */

function inserirMonstros(){
	$.each(equipes, function(equipe, informacoesEquipe){
		var monstros = informacoesEquipe.monstros;
		$.each(monstros, function(monstroId, informacoesMonstro){
			var arrayMonstros = Object.keys(monstros);
			var slot = arrayMonstros.indexOf(monstroId) + 1 + (equipe == "B" ? 4 : 0);
			inserirMonstro(monstroId, equipe, slot);
		});
	});
}

function inserirMonstro(id, equipe, slot){
	var elementoId = equipe+"_"+id;
	var bloco = '\
		<div class="monstro slot'+slot+' '+id+' click" id="'+elementoId+'" data-monstro="'+id+'" data-equipe="'+equipe+'">\
			<div class="barraModificadoresMonstro"></div>\
			<div class="circuloLevelMonstro"></div>\
			<div class="hpBarraMonstroBase">\
				<div class="fundoBarraMonstroBase"></div>\
				<div class="fundoBarraMonstroBaseCanto"></div>\
				<div class="hpBarraMonstroConteudo"></div>\
				<div class="hpBarraMonstroTexto"></div>\
				<div class="fundoBarraCanto"></div>\
			</div>\
			<div class="mpBarraMonstroBase">\
				<div class="fundoBarraMonstroBase"></div>\
				<div class="fundoBarraMonstroBaseCanto"></div>\
				<div class="mpBarraMonstroConteudo"></div>\
				<div class="mpBarraMonstroTexto"></div>\
				<div class="fundoBarraCanto"></div>\
			</div>\
			<div class="imagem"></div>\
			<div class="marcadores turno"></div>\
			<div class="marcadores atacado"></div>\
			<div class="marcadores foco"></div>\
		</div>\
	';

	var monstro = monstros[id];
	var valoresIniciais = monstro.valoresIniciais;
	var hp = valoresIniciais.hp;
	var mp = valoresIniciais.mp;
	var status = valoresIniciais.status;

	$("#areaJogo").append(bloco);

	equipes[equipe].monstros[id].data = {
		turno: 0,
		status: {
			hp: hp,
			hpmax: hp,
			mp: mp,
			mpmax: mp
		},
		statusAdicionais: {},
		modificadores: []
	};

	$.each(status, function(index, value){
		equipes[equipe].monstros[id].data.status[index] = value;
		equipes[equipe].monstros[id].data.statusAdicionais[index] = 0;
	});

	var level = equipes[equipe].monstros[id].level;
	exibirLevelMonstro(elementoId, level);
}

function exibirLevelMonstro(elementoId, level){
	var bloco = '';

	if(level > 9){
		bloco = '\
			<div class="level dezena '+numeros[level.toString()[0]]+'"></div>\
			<div class="level dezena '+numeros[level.toString()[1]]+'"></div>\
		';
	}
	else{
		bloco = '\
			<div class="level unidade '+numeros[level]+'"></div>\
		';
	}

	$("#"+elementoId+" .circuloLevelMonstro").html(bloco);
}

function matarMonstro(monstroId){
	var monstro = $("#"+monstroId);
	monstro.find(".imagemMonstro").animate({"opacity": 0}, 1000);
}

function pegarMonstroId(elemento){
	return elemento.data("monstro");
}

/* Turnos */

function iniciarTurno(equipe, monstroId){
	equipes[equipe].monstros[monstroId].data.turno = 1;

	$("#"+equipe+"_"+monstroId).find(".turno").addClass("ativo");

	atualizarBarraHabilidades(equipe, monstroId);

	if(equipe == "B"){
		setTimeout(function(){
			inteligenciaArtificial(monstroId);
		}, 2000);
	}
}

function finalizarTurno(monstroId){
	monstros[monstroId].data.turno = 0;

	var modificadores = pegarModificadoresMonstro(monstroId);
	$.each(modificadores, function(index, modificador){
		if(modificador[3] == 1)
			monstros[monstroId].data.modificadores[index][3] = 0;
		else if(modificador[2] > 0)
			monstros[monstroId].data.modificadores[index][2] = modificador[2] - 1;
	});

	atualizarModificadoresMonstro(monstroId);

	$("#"+monstroId+" .modificadorMonstro").each(function(){
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

	$("#"+monstroId)
	.find(".turnoMonstro")
	.fadeOut(200);
}

function processarTurnos(monstro1, monstro2){
	finalizarTurno(monstro1);
	iniciarTurno(monstro2);
}

function pegarTurnoMonstro(monstroId){
	return monstros[monstroId].data.turno;
}

function pegarMonstroTurno(){
	var retorno = false

	$.each(equipes["A"].monstros, function(monstroId, monstroInformacoes){
		var turno = monstroInformacoes.data.turno;
		if(turno == 1)
			retorno = [monstroId, "A"];
	});

	return retorno;
}

/* Inteligência Artificial */

function inteligenciaArtificial(equipe, monstroId){
	var equipe = "B";
	var alvoId = pegarAlvoIA(monstroId);
	atacarMonstro(monstroId, alvoId);
	processarTurnos(monstroId, alvoId);
}

function pegarAlvoIA(monstroId){

}

/* Ataque */

function atacarMonstro(monstroId, equipeMonstroId, inimigoId, equipeInimigoId, valor, porcentagem){
	/*
	var atk = pegarStatusMonstro(monstroId, "atk");
	var atkAdicional = pegarStatusAdicionalMonstro(monstroId, "atk");
	var def = pegarStatusMonstro(inimigoId, "def");
	var defAdicional = pegarStatusAdicionalMonstro(inimigoId, "def");
	var ataque = atk + atkAdicional - def - defAdicional;

	if(ataque > 0){
		if(alterarHPMonstro(inimigoId, -ataque)){
			declararVitoria(monstroId);
			finalizarTurno(monstroId);
			return;
		}
	}

	processarTurnos(monstroId, inimigoId);
	*/
}

/* Habilidades */

function usarHabilidade(monstroId, equipeId, alvoId, alvoEquipeId, habilidadeId){
	var habilidade = pegarHabilidade(monstroId, habilidadeId);

	var custo = habilidade.custo;
	var mp = pegarStatusMonstro(monstroId, equipeId, "mp");

	if(mp < custo){
		console.log("MP Insuficiente.");
		return false;
	}

	alterarMPMonstro(monstroId, equipeId, -custo);

	var alvo = habilidade.alvo;
	var recarga = habilidade.recarga;
	var efeitos = habilidade.efeitos;

	$.each(efeitos, function(index, value){
		var tipo = value[0];
		var valor = value[1];
		var turnos = (value[2] && value[2] > 0 ? value[2] : 0);

		switch(tipo){
			case 1:
				alterarHPMonstro(alvoId, alvoEquipeId, valor, 0);
				break;
			case 2:
				alterarHPMonstro(alvoId, alvoEquipeId, valor, 1);
				break;
			case 3:
				// alterarHPMaxMonstro(alvoId, alvoEquipeId, valor);
				break;
			case 4:
				alterarMPMonstro(alvoId, alvoEquipeId, valor, 0);
				break;
			case 5:
				alterarMPMonstro(alvoId, alvoEquipeId, valor, 1);
				break;
			case 6:
				// alterarHPMaxMonstro(alvoId, alvoEquipeId, valor);
				break;
			case 7:
				adicionarModificadorMonstro(alvoId, alvoEquipeId, "atk", valor, turnos);
			case 8:
				adicionarModificadorMonstro(alvoId, alvoEquipeId, "def", valor, turnos);
			case 9:
				console.log("Atacar inimigo com "+valor+" de dano.")
				// atacarMonstro(monstroId, equipeMonstroId, alvoId, alvoEquipeId, valor, 0);
				break;
			case 10:
				console.log("Atacar inimigo em "+valor+"% da sua vida.")
				// atacarMonstro(monstroId, equipeMonstroId, alvoId, alvoEquipeId, valor, 1);
				break;
			case 11:
				console.log("Atacar inimigo em "+valor+"% da vida dele.")
				// atacarMonstro(monstroId, equipeMonstroId, alvoId, alvoEquipeId, valor, 2);
				break;
		}
	});

	// processarTurnos(monstroId, inimigoId);
}

function atualizarBarraHabilidades(equipe, monstroId){
	if(equipe == "A"){
		var habilidades = pegarHabilidades(monstroId);
		$.each(habilidades, function(index, habilidade){
			var imagem = habilidade.imagem;
			var arquivo = "imagens/habilidades/"+imagem+".png";

			$(".barraHabilidades .habilidade."+numeros[index+1]+"")
				.data("habilidade", index)
				.find(".imagem")
				.html('<img src="'+arquivo+'">');
		});
	}
}

function pegarHabilidade(monstroId, habilidadeId){
	return monstros[monstroId].habilidades[habilidadeId];
}

function pegarHabilidades(monstroId){
	return monstros[monstroId].habilidades;
}

function pegarHabilidadeSelecionada(){
	return $(".barraHabilidades .habilidade.ativo").data("habilidade");
}

/* HP e MP */

function alterarBarra(tipo, monstroId, equipeId, novaQuantidade, quantidadeAlterada, quantidadeMax){
	var monstro = $("#"+equipeId+"_"+monstroId);

	var novaQuantidade = Math.max(novaQuantidade, 0);
	var novaLarguraBarra = novaQuantidade*100/quantidadeMax;

	if(quantidadeAlterada != 0){
		// monstro
			// .find("."+tipo+"_atual")
			// .text(novaQuantidade);
		monstro
			.find("."+tipo+"BarraMonstroConteudo")
			.animate({"width": novaLarguraBarra+"%"}, 200);

		// var alteracaoMonstroClone = monstro.find(".alteracaoMonstro:first").clone();
		// var alteracaoMonstro = monstro.append(alteracaoMonstroClone);
		// var marginTop = parseInt(alteracaoMonstro.css("margin-top").replace("px", ""));

		// alteracaoMonstroClone
			// .html(exibirSinalValor(quantidadeAlterada))
			// .css({
				// "color": (tipo == "hp" ? "red" : "blue"),
				// "opacity": 1
			// })
			// .animate({"margin-top": marginTop-150, "opacity": 0}, 1500, function(){
				// $(this).remove();
			// });
	}

	return false;
}

function alterarHPMonstro(monstroId, equipeId, quantidade, porcentagem){
	var quantidadeMax = pegarStatusMonstro(monstroId, equipeId, "hpmax");
	var novaQuantidade = Math.min(pegarStatusMonstro(monstroId, equipeId, "hp") + quantidade, quantidadeMax);
	equipes[equipeId].monstros[monstroId].data.status.hp = novaQuantidade;
	alterarBarra("hp", monstroId, equipeId, novaQuantidade, quantidade, quantidadeMax);
	if(novaQuantidade <= 0){
		matarMonstro(monstroId);
		return true;
	}
	return false;
}

function alterarMPMonstro(monstroId, equipeId, quantidade, porcentagem){
	var quantidadeMax = pegarStatusMonstro(monstroId, equipeId, "mpmax");
	var novaQuantidade = Math.min(pegarStatusMonstro(monstroId, equipeId, "mp") + quantidade, quantidadeMax);
	equipes[equipeId].monstros[monstroId].data.status.mp = novaQuantidade;
	alterarBarra("mp", monstroId, equipeId, novaQuantidade, quantidade, quantidadeMax);
}

/* Modificadores de Monstros */

function adicionarModificadorMonstro(monstroId, equipeId, tipo, valor, turnos){
	equipes[equipeId].monstros[monstroId].data.modificadores.push([tipo, valor, turnos, 1]);

	/*
		<div class="modificador ataque1 debuff">\
			<div class="imagemModificador"></div>\
		</div>\
		<div class="modificador ataque2 buff">\
			<div class="imagemModificador"></div>\
		</div>\
	*/
	var bloco = '\
		<div class="modificador ataque1 debuff">\
			<div class="imagemModificador"></div>\
		</div>\
	';

	$("#"+equipeId+"_"+monstroId+" .barraModificadoresMonstro").append(bloco);

	atualizarModificadoresMonstro(monstroId, equipeId);
}

function atualizarModificadoresMonstro(monstroId, equipeId){
	var modificadores = pegarModificadoresMonstro(monstroId, equipeId);
	$.each(modificadores, function(index, modificador){
		var valor = modificador[1];
		var turnos = modificador[2];
		if(turnos == 0){
			valor = 0;
			monstros[monstroId].data.modificadores[index][1] = valor;
		}
	});

	// monstros[monstroId].data.statusAdicionais = {};

	// $.each(modificadores, function(index, modificador){
		// var tipo = modificador[0];
		// var valor = modificador[1];
		// var valorAtual = monstros[monstroId].data.statusAdicionais[tipo] || 0;
		// var novoValor = valor + valorAtual;

		// monstros[monstroId].data.statusAdicionais[tipo] = novoValor;

		// $("#"+monstroId)
		// .find("."+tipo+"_adicional")
		// .text(exibirSinalValor(novoValor));
	// });
}

function pegarModificadoresMonstro(monstroId, equipeId){
	return equipes[equipeId].monstros[monstroId].data.modificadores;
}

/* Miscelânea */

function exibirSinalValor(valor){
	return (valor >= 0 ? "+" : "")+valor;
}

/* Finalizar Partida */

function declararVitoria(monstroId){
	$("#vitoria")
	.css("opacity", 0)
	.html("Você "+(monstroId == "aliado" ? "venceu" : "perdeu")+"!")
	.addClass((monstroId == "aliado" ? "vitoria" : "derrota"))
	.animate({"opacity": 1}, 1000);
}

/* Status */

function pegarStatusMonstro(monstroId, equipeId, status){
	return equipes[equipeId].monstros[monstroId].data.status[status] || 0;
}

function pegarStatusAdicionalMonstro(monstroId, equipeId, status){
	return equipes[equipeId].monstros[monstroId].data.statusAdicionais[status] || 0;
}

/* Equipes */

function pegarEquipeMonstro(elemento){
	return elemento.data("equipe");
}

$(function(){
	inserirMonstros();
	iniciarTurno("A", "draconia");

	$(".barraHabilidades .habilidade").click(function(){
		if($(this).hasClass("ativo"))
			return false;
		else{
			$(".barraHabilidades .habilidade.ativo").removeClass("ativo");
			$(this).addClass("ativo");
		}
	});

	$(".barraHabilidades .habilidade.um").click();

	$("body").keypress(function(event){
		switch(event.keyCode){
			case 113:
				$(".habilidade.um").click();
				break;
			case 119:
				$(".habilidade.dois").click();
				break;
			case 101:
				$(".habilidade.tres").click();
				break;
		}
	});
	
	$(".monstro.click .imagem").click(function(event){
		var monstroClicado = $(this).closest(".monstro");
		var monstroTurno = pegarMonstroTurno();
		var monstroIdTurno = monstroTurno[0];
		var equipeMonstroTurno = monstroTurno[1];

		if(monstroIdTurno != false){
			var habilidadeId = pegarHabilidadeSelecionada();
			var habilidade = pegarHabilidade(monstroIdTurno, habilidadeId);
			var habilidadeAlvo = habilidade.alvo;
			var alvoId = pegarMonstroId(monstroClicado);
			var alvoEquipeId = pegarEquipeMonstro(monstroClicado);

			if(habilidadeAlvo == 1){ // Inimigo
				if(equipeMonstroTurno != alvoEquipeId){
					usarHabilidade(monstroIdTurno, equipeMonstroTurno, alvoId, alvoEquipeId, habilidadeId);
				}
			}
			else if(habilidadeAlvo == 2){ // Aliado
				if(equipeMonstroTurno == alvoEquipeId){
					usarHabilidade(monstroIdTurno, equipeMonstroTurno, alvoId, alvoEquipeId, habilidadeId);
				}
			}
			else if(habilidadeAlvo == 3){ // Si mesmo
				if((equipeMonstroTurno == alvoEquipeId) && (monstroIdTurno == alvoId)){
					usarHabilidade(monstroIdTurno, equipeMonstroTurno, alvoId, alvoEquipeId, habilidadeId);
				}
			}
		}
		
		return false;
	});
});