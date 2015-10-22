var monstros = {
	["draconia"]: {
		valoresIniciais: {
			hp: 100,
			mp: 100,
			status: {
				atk: 30,
				def: 20
			}
		},
		habilidades: [
			{
				nome: "Furac�o",
				imagem: "furacao",
				efeitos: [
					[9, 0, 0]
				],
				alvo: 1,
				recarga: 0,
				custo: 0
			},
			{
				nome: "F�ria Selvagem",
				imagem: "furiaSelvagem",
				efeitos: [
					[11, 50, 0]
				],
				alvo: 1,
				recarga: 4,
				custo: 80
			},
			{
				nome: "Impacto da Demoli��o",
				imagem: "impactoDemolicao",
				efeitos: [
					[9, 20, 0]
				],
				area: 1,
				alvo: 1,
				recarga: 5,
				custo: 80
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
				nome: "For�a Divina",
				imagem: "forcaDivina",
				efeitos: [
					[7, 10, 2]
				],
				alvo: 2,
				recarga: 0,
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
				nome: "For�a Divina",
				imagem: "forcaDivina",
				efeitos: [
					[7, 10, 2]
				],
				alvo: 2,
				recarga: 0,
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
				nome: "For�a Divina",
				imagem: "forcaDivina",
				efeitos: [
					[7, 10, 2]
				],
				alvo: 2,
				recarga: 0,
				custo: 0
			}
		]
	}
}

var equipes = {
	"A": {
		monstros: {
			// "robo": {
				// level: 10
			// },
			"draconia": {
				level: 9
			},
			// "zumbi": {
				// level: 1
			// },
			// "esqueleto": {
				// level: 1
			// }
		}
	},
	"B": {
		monstros: {
			// "robo": {
				// level: 1
			// },
			"draconia": {
				level: 1
			},
			// "zumbi": {
				// level: 1
			// },
			// "esqueleto": {
				// level: 1
			// }
		}
	}
}

var jogo = {
	valorTurno: 8 // Valor Tempor�rio
}

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
	12	Debuff - Impedir Recupera��o HP (porcentagem: 1 - 100%)
	13	Debuff - Impedir Recupera��o MP (porcentagem: 1 - 100%)
	14	Debuff - ATK
	15	Debuff - DEF
	16	Remove todos os Debuffs
	17	Imunidade a Debuffs
	18	Escudo
	19	Invencibilidade (Imunidade a Dano)
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

function inserirMonstro(monstroId, monstroEquipeId, slot){
	var elementoId = monstroEquipeId+"_"+monstroId;
	var bloco = '\
		<div class="monstro slot'+slot+' '+monstroId+' click" id="'+elementoId+'" data-monstro="'+monstroId+'" data-equipe="'+monstroEquipeId+'">\
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

	var monstro = monstros[monstroId];
	var valoresIniciais = monstro.valoresIniciais;
	var hp = valoresIniciais.hp;
	var mp = valoresIniciais.mp;
	var status = valoresIniciais.status;

	$("#areaJogo").append(bloco);

	var valorTurno = jogo.valorTurno;
	jogo.valorTurno = valorTurno - 1;

	equipes[monstroEquipeId].monstros[monstroId].data = {
		turno: 0,
		valorTurno: valorTurno,
		vivo: 1,
		regenerarMP: 1,
		status: {
			hp: hp,
			hpmax: hp,
			mp: mp,
			mpmax: mp
		},
		habilidades: {},
		statusAdicionais: {},
		modificadores: []
	};

	$.each(status, function(index, value){
		equipes[monstroEquipeId].monstros[monstroId].data.status[index] = value;
		equipes[monstroEquipeId].monstros[monstroId].data.statusAdicionais[index] = 0;
	});

	var level = equipes[monstroEquipeId].monstros[monstroId].level;
	exibirLevelMonstro(elementoId, level);

	var habilidades = monstro.habilidades;
	$.each(habilidades, function(index, value){
		equipes[monstroEquipeId].monstros[monstroId].data.habilidades[index] = {recarga: 0};
	});
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

function matarMonstro(monstroId, equipeId){
	equipes[equipeId].monstros[monstroId].data.vivo = 0;

	$("#"+equipeId+"_"+monstroId)
		.animate({"opacity": 0}, 1000, function(){
			$(this).remove();
		});
}

function pegarMonstroId(elemento){
	return elemento.data("monstro");
}

function verificarMonstrosVivos(equipeId){
	var monstros = equipes[equipeId].monstros;
	var monstrosVivos = Object.keys(monstros).length;

	$.each(monstros, function(monstroId, monstroInformacoes){
		if(monstroInformacoes.data.vivo != 1)
			monstrosVivos -= 1
	});

	return monstrosVivos;
}

/* Turnos */

function iniciarTurno(monstroId, monstroEquipeId){

	alterarRegenerarMP(monstroId, monstroEquipeId, 1);

	equipes[monstroEquipeId].monstros[monstroId].data.turno = 1;

	$("#"+monstroEquipeId+"_"+monstroId).find(".turno").addClass("ativo");

	atualizarBarraHabilidades(monstroId, monstroEquipeId);

	$(".barraHabilidades .habilidade.um .imagem").click();

	if(monstroEquipeId == "B"){
		setTimeout(function(){
			inteligenciaArtificial(monstroId, "B");
		}, 1200);
	}
}

function finalizarTurno(monstroId, monstroEquipeId){
	if(verificarRegenerarMP(monstroId, monstroEquipeId))
		alterarMPMonstro(monstroId, monstroEquipeId, 10, 1);

	equipes[monstroEquipeId].monstros[monstroId].data.turno = 0;
	equipes[monstroEquipeId].monstros[monstroId].data.valorTurno = -1;

	var modificadores = pegarModificadoresMonstro(monstroId, monstroEquipeId);
	$.each(modificadores, function(index, modificador){
		if(modificador[3] == 1)
			equipes[monstroEquipeId].monstros[monstroId].data.modificadores[index][3] = 0;
		else if(modificador[2] > 0)
			equipes[monstroEquipeId].monstros[monstroId].data.modificadores[index][2] = modificador[2] - 1;
	});

	atualizarModificadoresMonstro(monstroId, monstroEquipeId);

	$("#"+monstroEquipeId+"_"+monstroId+" .barraModificadoresMonstro .modificador").each(function(){
		if(parseInt($(this).data("bloqueado")) == 1)
			$(this).data("bloqueado", 0);
		else{
			var novoTurno = parseInt($(this).data("turnos")) - 1;
			if(novoTurno == 0)
				$(this).remove();
			else
				$(this)
					.data("turnos", novoTurno);
				// $(this)
					// .data("turno", novoTurno)
					// .find(".turno")
					// .text(novoTurno);
		}
	});

	$("#"+monstroEquipeId+"_"+monstroId)
		.find(".marcadores.turno")
		.animate({"opacity": 0}, 200, function(){
			$(this)
				.removeClass("ativo")
				.css({"opacity": 1});
		});
}

function processarTurnos(monstroId, equipeId){
	finalizarTurno(monstroId, equipeId);

	var equipeInimigaId = (equipeId == "A" ? "B" : "A");

	if(verificarMonstrosVivos(equipeId) == 0)
		declararVitoria(equipeInimigaId);
	else if(verificarMonstrosVivos(equipeInimigaId) == 0)
		declararVitoria(equipeId);
	else{
		aumentarTurnos();
		var proximoMonstro = monstroProximoTurno();
		iniciarTurno(proximoMonstro[0], proximoMonstro[1]);
	}
}

function aumentarTurnos(){
	$.each(equipes, function(equipeId, equipeInformacoes){
		$.each(equipeInformacoes.monstros, function(monstroId, monstroInformacoes){
			var valorTurno = monstroInformacoes.data.valorTurno;
			equipes[equipeId].monstros[monstroId].data.valorTurno = valorTurno + 1;
		});
	});
}

function monstroProximoTurno(){
	var proximoMonstro = [0, 0];
	var valorTurnoAtual = 0;

	$.each(equipes, function(equipeId, equipeInformacoes){
		$.each(equipeInformacoes.monstros, function(monstroId, monstroInformacoes){
			var valorTurno = monstroInformacoes.data.valorTurno;
			if(valorTurno > 0 && Math.max(valorTurno, valorTurnoAtual) == valorTurno){
				proximoMonstro = [monstroId, equipeId];
				valorTurnoAtual = valorTurno;
			}
		});
	});

	return proximoMonstro;
}

function pegarMonstroTurno(){
	var retorno = false

	$.each(equipes, function(equipeId, equipeInformacoes){
		$.each(equipeInformacoes.monstros, function(monstroId, monstroInformacoes){
			if(equipeId == "A" && monstroInformacoes.data.turno == 1)
				retorno = [monstroId, "A"];
		});
	});

	return retorno;
}

/* Intelig�ncia Artificial */

function inteligenciaArtificial(monstroId, monstroEquipeId){
	var alvoId = pegarAlvoIA(monstroId);
	var alvoEquipeId = "A";

	var habilidades = pegarHabilidades(monstroId);
	var habilidadesDisponiveis = [];
	$.each(habilidades, function(habilidadeId, habilidade){
		if(habilidadeId > 0){
			var recarga = Math.max(0, pegarMonstroCooldownHabilidade(monstroId, monstroEquipeId, habilidadeId) - 1);;
			var custo = pegarCustoMPHabilidade(monstroId, habilidadeId)
			var mp = pegarStatusMonstro(monstroId, monstroEquipeId, "mp");

			if(custo <= mp && recarga == 0)
				habilidadesDisponiveis.push(habilidadeId);
		}
	});

	var habilidadeSelecionadaId = (habilidadesDisponiveis.length > 0 ? habilidadesDisponiveis[random(0, habilidadesDisponiveis.length - 1)] : 0);

	usarHabilidade(monstroId, monstroEquipeId, alvoId, alvoEquipeId, habilidadeSelecionadaId);
}

function pegarAlvoIA(monstroId){
	var arrayMonstros = Object.keys(equipes["A"].monstros);
	var alvoId = arrayMonstros[random(0, arrayMonstros.length - 1)]
	return alvoId;
}

/* Ataque */

function atacarMonstro(monstroId, monstroEquipeId, alvoId, alvoEquipeId, valor, porcentagem){
	var atk = pegarStatusMonstro(monstroId, monstroEquipeId, "atk");
	var atkAdicional = pegarStatusAdicionalMonstro(monstroId, monstroEquipeId, "atk");
	var def = pegarStatusMonstro(alvoId, alvoEquipeId, "def");
	var defAdicional = pegarStatusAdicionalMonstro(alvoId, alvoEquipeId, "def");

	var calculoAtaque = atk + atkAdicional;
	var calculoDefesa = def + defAdicional;

	if(valor > 0)
		calculoAtaque += (porcentagem == 1 ? (valor*atk/100) : valor);

	var dano = calculoAtaque - calculoDefesa;

	if(dano > 0)
		alterarHPMonstro(alvoId, alvoEquipeId, -dano, 0);
}

/* Habilidades */

function usarHabilidade(monstroId, monstroEquipeId, alvoId, alvoEquipeId, habilidadeId){
	var cooldownHabilidade = verificarMonstroCooldownHabilidade(monstroId, monstroEquipeId, habilidadeId);
	var custo = pegarCustoMPHabilidade(monstroId, habilidadeId)
	var mp = pegarStatusMonstro(monstroId, monstroEquipeId, "mp");

	if(custo > mp || cooldownHabilidade > 0){
		$(".habilidade.um .imagem").click();
		return false;
	}

	var habilidade = pegarHabilidade(monstroId, habilidadeId);

	var custo = habilidade.custo;
	var mp = pegarStatusMonstro(monstroId, monstroEquipeId, "mp");

	if(mp < custo){
		console.log("MP Insuficiente.");
		return false;
	}

	alterarMPMonstro(monstroId, monstroEquipeId, -custo, 0);

	if(custo > 0)
		alterarRegenerarMP(monstroId, monstroEquipeId, 0);

	var recarga = habilidade.recarga;
	equipes[monstroEquipeId].monstros[monstroId].data.habilidades[habilidadeId].recarga = recarga + 1;

	var alvo = habilidade.alvo;
	var efeitos = habilidade.efeitos;

	$.each(efeitos, function(index, value){
		var tipo = value[0];
		var valor = value[1];
		var turnos = (value[2] && value[2] > 0 ? value[2] : 0);

		switch(tipo){
			case 1: // Cura HP Fixo
				alterarHPMonstro(alvoId, alvoEquipeId, valor, 0);
				break;
			case 2: // Cura HP Porcentagem
				alterarHPMonstro(alvoId, alvoEquipeId, valor, 1);
				break;
			case 3: // Aumenta HPMax
				// adicionarModificadorMonstro(alvoId, alvoEquipeId, "hpmax", valor, turnos);
				break;
			case 4: // Cura MP Fixo
				alterarMPMonstro(alvoId, alvoEquipeId, valor, 0);
				break;
			case 5: // Cura MP Porcentagem
				alterarMPMonstro(alvoId, alvoEquipeId, valor, 1);
				break;
			case 6: // Aumenta MPMax
				// adicionarModificadorMonstro(alvoId, alvoEquipeId, "mpmax", valor, turnos);
				break;
			case 7: // Buff ATK
				adicionarModificadorMonstro(alvoId, alvoEquipeId, "atk", valor, turnos);
				break;
			case 8: // Buff DEF
				adicionarModificadorMonstro(alvoId, alvoEquipeId, "def", valor, turnos);
				break;
			case 9: // ATK - Usa Status
				// console.log("Atacar inimigo com "+valor+" de dano.");
				atacarMonstro(monstroId, monstroEquipeId, alvoId, alvoEquipeId, valor, 0);
				break;
			case 10: // ATK - Porcentagem HP Aliado
				console.log("Atacar inimigo em "+valor+"% da sua vida.");
				// atacarMonstro(monstroId, monstroEquipeId, alvoId, alvoEquipeId, valor, 1);
				break;
			case 11: // ATK - Porcentagem HP Inimigo
				console.log("Atacar inimigo em "+valor+"% da vida dele.");
				// atacarMonstro(monstroId, monstroEquipeId, alvoId, alvoEquipeId, valor, 2);
				break;
			case 12: // Debuff - Impedir Recupera��o HP (porcentagem: 1 - 100%)
				// console.log("");
				break;
			case 13: // Debuff - Impedir Recupera��o MP (porcentagem: 1 - 100%)
				// console.log("");
				break;
			case 14: // Remove todos os Debuffs
				// console.log("");
				break;
			case 15: // Debuff - ATK
				// console.log("");
				break;
			case 16: // Debuff - DEF
				// console.log("");
				break;
			case 17: // Imunidade a Debuffs
				// console.log("");
				break;
			case 18: // Escudo
				// console.log("");
				break;
			case 19: // Invencibilidade (Imunidade a Dano)
				// console.log("");
				break;
		}
	});

	processarTurnos(monstroId, monstroEquipeId);
}

function atualizarBarraHabilidades(monstroId, monstroEquipeId){
	$(".barraHabilidades .habilidade").each(function(){
		$(this)
		.hide()
		.find(".imagem")
		.html("");
	});

	if(monstroEquipeId == "A")
		$(".barraHabilidades").show();
	else
		$(".barraHabilidades").hide();

	var habilidades = pegarHabilidades(monstroId);
	$.each(habilidades, function(habilidadeId, habilidade){
		var recarga = Math.max(0, pegarMonstroCooldownHabilidade(monstroId, monstroEquipeId, habilidadeId) - 1);
		equipes[monstroEquipeId].monstros[monstroId].data.habilidades[habilidadeId].recarga = recarga;

		if(monstroEquipeId == "A"){
			var imagem = habilidade.imagem;
			var arquivo = "imagens/habilidades/"+imagem+".png";

			var custo = pegarCustoMPHabilidade(monstroId, habilidadeId)
			var mp = pegarStatusMonstro(monstroId, monstroEquipeId, "mp");

			var classeNumero = (recarga > 0 ? 'exibir' : 'ocultar');
			var classeCooldown = (recarga > 0 || (custo > mp) ? 'exibir' : 'ocultar');

			$(".barraHabilidades .habilidade."+numeros[habilidadeId+1])
				.data("habilidade", habilidadeId)
				.show()
				.find(".imagem")
				.html('\
					<div class="exibirCooldown '+numeros[recarga]+' '+(classeNumero)+'"></div>\
					<img src="imagens/habilidades/cooldown.png" class="cooldown '+(classeCooldown)+'">\
					<img src="'+arquivo+'" class="skill">\
				');
		}
	});
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

function pegarCustoMPHabilidade(monstroId, habilidadeId){
	return pegarHabilidade(monstroId, habilidadeId).custo;
}

function pegarMonstroCooldownHabilidade(monstroId, monstroEquipeId, habilidadeId){
	return equipes[monstroEquipeId].monstros[monstroId].data.habilidades[habilidadeId].recarga;
}

function verificarMonstroCooldownHabilidade(monstroId, monstroEquipeId, habilidadeId){
	return (pegarMonstroCooldownHabilidade(monstroId, monstroEquipeId, habilidadeId) > 0 ? true : false);
}

/* HP e MP */

function alterarBarra(tipo, monstroId, monstroEquipeId, novaQuantidade, quantidadeAlterada, quantidadeMax){
	var monstro = $("#"+monstroEquipeId+"_"+monstroId);

	var novaQuantidade = Math.max(Math.floor(novaQuantidade), 0);
	var novaLarguraBarra = novaQuantidade*100/quantidadeMax;

	if(quantidadeAlterada != 0){
		monstro
			.find("."+tipo+"BarraMonstroConteudo")
			.stop()
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

function alterarHPMonstro(monstroId, monstroEquipeId, quantidade, porcentagem){
	var quantidadeMax = pegarStatusMonstro(monstroId, monstroEquipeId, "hpmax");
	quantidade = (porcentagem == 1 ? quantidadeMax*quantidade/100 : quantidade);
	var novaQuantidade = Math.min(pegarStatusMonstro(monstroId, monstroEquipeId, "hp") + quantidade, quantidadeMax);
	equipes[monstroEquipeId].monstros[monstroId].data.status.hp = novaQuantidade;
	alterarBarra("hp", monstroId, monstroEquipeId, novaQuantidade, quantidade, quantidadeMax);

	if(novaQuantidade <= 0)
		matarMonstro(monstroId, monstroEquipeId);
}

function alterarMPMonstro(monstroId, monstroEquipeId, quantidade, porcentagem){
	var quantidadeMax = pegarStatusMonstro(monstroId, monstroEquipeId, "mpmax");
	quantidade = (porcentagem == 1 ? quantidadeMax*quantidade/100 : quantidade);
	var novaQuantidade = Math.min(pegarStatusMonstro(monstroId, monstroEquipeId, "mp") + quantidade, quantidadeMax);
	equipes[monstroEquipeId].monstros[monstroId].data.status.mp = novaQuantidade;
	alterarBarra("mp", monstroId, monstroEquipeId, novaQuantidade, quantidade, quantidadeMax);
}

function alterarRegenerarMP(monstroId, monstroEquipeId, valor){
	return equipes[monstroEquipeId].monstros[monstroId].data.regenerarMP = valor;
}

function verificarRegenerarMP(monstroId, monstroEquipeId){
	return (equipes[monstroEquipeId].monstros[monstroId].data.regenerarMP == 1 ? true : false);
}

/* Modificadores de Monstros */

function adicionarModificadorMonstro(monstroId, equipeId, tipo, valor, turnos){
	equipes[equipeId].monstros[monstroId].data.modificadores.push([tipo, valor, turnos, 1]);

	var classes = ["modificador"];

	switch(tipo){
		case "atk":
			if(valor > 0)
				classes.push("ataqueUp");
			else
				classes.push("ataqueDown");
			break;
		case "def":
			if(valor > 0)
				classes.push("defesaUp");
			else
				classes.push("defesaDown");
			break;
	}

	if(valor > 0)
		classes.push("buff");
	else
		classes.push("debuff");

	var bloco = '\
		<div class="'+classes.join(" ")+'" data-bloqueado="1" data-turnos="'+turnos+'">\
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
			equipes[equipeId].monstros[monstroId].data.modificadores[index][1] = valor;
		}
	});

	equipes[equipeId].monstros[monstroId].data.statusAdicionais = {};

	$.each(modificadores, function(index, modificador){
		var tipo = modificador[0];
		var valor = modificador[1];
		var valorAtual = equipes[equipeId].monstros[monstroId].data.statusAdicionais[tipo] || 0;
		var novoValor = valor + valorAtual;

		equipes[equipeId].monstros[monstroId].data.statusAdicionais[tipo] = novoValor;

		// $("#"+monstroId)
		// .find("."+tipo+"_adicional")
		// .text(exibirSinalValor(novoValor));
	});
}

function pegarModificadoresMonstro(monstroId, equipeId){
	return equipes[equipeId].monstros[monstroId].data.modificadores;
}

/* Miscel�nea */

function exibirSinalValor(valor){
	return (valor >= 0 ? "+" : "")+valor;
}

function random(min, max){
	return Math.round(Math.random() * (max - min) + min);
}

/* Finalizar Partida */

function declararVitoria(equipeId){
	setTimeout(function(){
		alert((equipeId == "A" ? "VIT�RIA" : "DERROTA")+"!");
		// $("#vitoria")
		// .css("opacity", 0)
		// .html("Voc� "+(monstroId == "aliado" ? "venceu" : "perdeu")+"!")
		// .addClass((monstroId == "aliado" ? "vitoria" : "derrota"))
		// .animate({"opacity": 1}, 1000);
	}, 1000);
}

/* Status */

function pegarStatusMonstro(monstroId, monstroEquipeId, status){
	return equipes[monstroEquipeId].monstros[monstroId].data.status[status] || 0;
}

function pegarStatusAdicionalMonstro(monstroId, monstroEquipeId, status){
	return equipes[monstroEquipeId].monstros[monstroId].data.statusAdicionais[status] || 0;
}

/* Equipes */

function pegarEquipeMonstro(elemento){
	return elemento.data("equipe");
}

$(function(){
	inserirMonstros();

	$(".barraHabilidades .habilidade .imagem").click(function(){
		var elementoHabilidade = $(this).closest(".habilidade");
		if(elementoHabilidade.hasClass("ativo"))
			return false;

		var monstroTurno = pegarMonstroTurno();
		if(monstroTurno != false){
			var monstroIdTurno = monstroTurno[0];
			var monstroTurnoEquipeId = monstroTurno[1];
			var habilidadeId = elementoHabilidade.data("habilidade");

			var cooldownHabilidade = verificarMonstroCooldownHabilidade(monstroIdTurno, monstroTurnoEquipeId, habilidadeId);
			var custo = pegarCustoMPHabilidade(monstroIdTurno, habilidadeId)
			var mp = pegarStatusMonstro(monstroIdTurno, monstroTurnoEquipeId, "mp");

			if(custo > mp || cooldownHabilidade > 0)
				return false;
			else{
				$(".barraHabilidades .habilidade.ativo").removeClass("ativo");
				elementoHabilidade.addClass("ativo");
			}
		}
	});

	iniciarTurno("draconia", "A");

	$("body").keypress(function(event){
		switch(event.keyCode){
			case 113:
				$(".habilidade.um .imagem").click();
				break;
			case 119:
				$(".habilidade.dois .imagem").click();
				break;
			case 101:
				$(".habilidade.tres .imagem").click();
				break;
		}
	});

	$(".monstro.click .imagem").click(function(event){
		var monstroClicado = $(this).closest(".monstro");

		var monstroTurno = pegarMonstroTurno();
		if(monstroTurno != false){
			var monstroIdTurno = monstroTurno[0];
			var equipeMonstroTurno = monstroTurno[1];
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