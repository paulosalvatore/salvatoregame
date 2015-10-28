var monstros = {};

/*
var monstros = {
	["draconia"]: {
		valoresIniciais: {
			hp: 100,
			mp: 100,
			status: {
				atk: 10,
				def: 0
			}
		},
		habilidades: [
			{
				nome: "Furacão",
				imagem: "furacao",
				efeitos: [
					[9, 0, 0]
				],
				alvo: 1,
				recarga: 0,
				custo: 0
			},
			{
				nome: "Fúria Selvagem",
				imagem: "furiaSelvagem",
				efeitos: [
					[11, 50, 0]
				],
				alvo: 1,
				recarga: 4,
				custo: 80
			},
			{
				nome: "Impacto da Demolição",
				imagem: "impactoDemolicao",
				efeitos: [
					[9, 0, 0]
				],
				area: 1,
				alvo: 1,
				recarga: 0,
				custo: 10
			}
		]
	},
	["robo"]: {
		valoresIniciais: {
			hp: 200,
			mp: 100,
			status: {
				atk: 10,
				def: 0
			}
		},
		habilidades: [
			{
				nome: "Força Divina",
				imagem: "forcaDivina",
				efeitos: [
					[7, 10, 3]
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
				nome: "Força Divina",
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
				nome: "Força Divina",
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
*/

var equipes = {
	"A": {
		monstros: {
			1: {
				level: 10
			},
			// "draconia": {
				// level: 9
			// },
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
			1: {
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
	valorTurno: 8, // Valor Temporário
	tamanhoCorpo: [0, 0]
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
	12	Debuff - Impedir Recuperação HP (porcentagem: 1 - 100%)
	13	Debuff - Impedir Recuperação MP (porcentagem: 1 - 100%)
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
		<div class="monstro slot'+slot+' '+monstros[monstroId].imagem+' click" id="'+elementoId+'" data-monstro="'+monstroId+'" data-equipe="'+monstroEquipeId+'">\
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
	equipes[equipeId].monstros[monstroId].data.valorTurno = -1;
	equipes[equipeId].monstros[monstroId].data.vivo = 0;

	$("#"+equipeId+"_"+monstroId)
		.animate({"opacity": 0}, 1000, function(){
			$(this).remove();
			if(verificarMonstrosVivos(equipeId) == 0)
				finalizarPartida(equipeId);
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

function iniciarPartida(){
	var proximoMonstro = monstroProximoTurno();
	iniciarTurno(proximoMonstro[0], proximoMonstro[1]);
}

function iniciarTurno(monstroId, monstroEquipeId){
	equipes[monstroEquipeId].monstros[monstroId].data.turno = 1;

	$("#"+monstroEquipeId+"_"+monstroId)
		.find(".turno")
		.stop()
		.addClass("ativo");

	alterarRegenerarMP(monstroId, monstroEquipeId, 1);

	processarModificadoresMonstro(monstroId, monstroEquipeId, 1);

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

	$(".barraHabilidades").hide();

	processarModificadoresMonstro(monstroId, monstroEquipeId, 0);

	atualizarModificadoresMonstro(monstroId, monstroEquipeId);

	$("#"+monstroEquipeId+"_"+monstroId)
		.find(".marcadores.turno")
		.stop()
		.animate({"opacity": 0}, 200, function(){
			$(this)
				.removeClass("ativo")
				.css({"opacity": 1});
		});
}

function processarTurnos(monstroId, equipeId){
	finalizarTurno(monstroId, equipeId);

	var equipeInimigaId = pegarEquipeInimiga(equipeId);

	if(verificarMonstrosVivos(equipeId) > 0 && verificarMonstrosVivos(equipeInimigaId) > 0){
		aumentarTurnos();
		var proximoMonstro = monstroProximoTurno();
		setTimeout(function(){
			iniciarTurno(proximoMonstro[0], proximoMonstro[1]);
		}, 400);
	}
}

function aumentarTurnos(){
	$.each(equipes, function(equipeId, equipeInformacoes){
		$.each(equipeInformacoes.monstros, function(monstroId, monstroInformacoes){
			var vivo = monstroInformacoes.data.vivo;

			if(vivo == 1){
				var valorTurno = monstroInformacoes.data.valorTurno;
				equipes[equipeId].monstros[monstroId].data.valorTurno = valorTurno + 1;
			}
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

function dimensionarFonteTurnos(){
	var corpo = $("#corpo");
	var tamanho = (jogo.tamanhoCorpo[0] + jogo.tamanhoCorpo[1]) / 2;
	var novoTamanho = (corpo.width() + corpo.height()) / 2;
	var novaPorcentagem = ((novoTamanho / tamanho) * 100 + Math.max(20, (novoTamanho - tamanho) / 10)) + "%";

	$(".turnosModificador").each(function(){
		$(this).css("font-size", novaPorcentagem);
	});
}

/* Inteligência Artificial */

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
	var alvoId = arrayMonstros[random(0, arrayMonstros.length - 1)];
	return alvoId;
}

/* Ataque */

function atacarMonstro(monstroId, monstroEquipeId, alvoId, alvoEquipeId, valor, tipo){
	var calculoAtaque = 0;
	var calculoDefesa = 0;

	switch(tipo){
		case 0:
			var atk = pegarStatusMonstro(monstroId, monstroEquipeId, "atk");
			var atkAdicional = pegarStatusAdicionalMonstro(monstroId, monstroEquipeId, "atk");
			var def = pegarStatusMonstro(alvoId, alvoEquipeId, "def");
			var defAdicional = pegarStatusAdicionalMonstro(alvoId, alvoEquipeId, "def");

			calculoAtaque = atk + atkAdicional;
			calculoDefesa = def + defAdicional;
			break;
		case 1:
			var hpMax = pegarStatusMonstro(monstroId, monstroEquipeId, "hpmax");

			calculoAtaque = valor*hpMax/100;
			break;
		case 2:
			var hpMax = pegarStatusMonstro(alvoId, alvoEquipeId, "hpmax");

			calculoAtaque = valor*hpMax/100;
			break;
	}

	var dano = calculoAtaque - calculoDefesa;

	if(dano > 0)
		alterarHPMonstro(alvoId, alvoEquipeId, -random(dano*0.9, dano*1.1), 0);
}

/* Habilidades */

function usarHabilidade(monstroId, monstroEquipeId, alvoId, alvoEquipeId, habilidadeId){
	var cooldownHabilidade = verificarMonstroCooldownHabilidade(monstroId, monstroEquipeId, habilidadeId);
	var custo = pegarCustoMPHabilidade(monstroId, habilidadeId)
	var mp = pegarStatusMonstro(monstroId, monstroEquipeId, "mp");

	if(custo > mp || cooldownHabilidade > 0){
		if(custo > mp)
			console.log("MP Insuficiente.");
		else if(cooldownHabilidade > 0)
			console.log("Habilidade em Recarga.");

		$(".habilidade.um .imagem").click();
		return false;
	}

	alterarMPMonstro(monstroId, monstroEquipeId, -custo, 0);

	if(custo > 0)
		alterarRegenerarMP(monstroId, monstroEquipeId, 0);

	var habilidade = pegarHabilidade(monstroId, habilidadeId);

	var recarga = habilidade.recarga;
	equipes[monstroEquipeId].monstros[monstroId].data.habilidades[habilidadeId].recarga = recarga + 1;

	var alvo = habilidade.alvo;
	var efeitos = habilidade.efeitos;

	$.each(efeitos, function(index, value){
		var tipo = value.tipo;
		var valor = value.valor;
		var turnos = (value.turnos && value.turnos > 0 ? value.turnos : 0);

		switch(tipo){
			case 1: // Cura HP Fixo
				if(turnos == 0)
					alterarHPMonstro(alvoId, alvoEquipeId, valor, 0);
				else
					adicionarModificadorMonstro(alvoId, alvoEquipeId, "hp", valor, turnos);
				break;
			case 2: // Cura HP Porcentagem
				if(turnos == 0)
					alterarHPMonstro(alvoId, alvoEquipeId, valor, 1);
				else
					adicionarModificadorMonstro(alvoId, alvoEquipeId, "hp%", valor, turnos);
				break;
			case 3: // Aumenta HPMax
				adicionarModificadorMonstro(alvoId, alvoEquipeId, "hpmax", valor, turnos);
				break;
			case 4: // Cura MP Fixo
				if(turnos == 0)
					alterarMPMonstro(alvoId, alvoEquipeId, valor, 0);
				else
					adicionarModificadorMonstro(alvoId, alvoEquipeId, "mp", valor, turnos);
				break;
			case 5: // Cura MP Porcentagem
				if(turnos == 0)
					alterarMPMonstro(alvoId, alvoEquipeId, valor, 1);
				else
					adicionarModificadorMonstro(alvoId, alvoEquipeId, "mp%", valor, turnos);
				break;
			case 6: // Aumenta MPMax
				adicionarModificadorMonstro(alvoId, alvoEquipeId, "mpmax", valor, turnos);
				break;
			case 7: // Buff ATK
				adicionarModificadorMonstro(alvoId, alvoEquipeId, "atk", valor, turnos);
				break;
			case 8: // Buff DEF
				adicionarModificadorMonstro(alvoId, alvoEquipeId, "def", valor, turnos);
				break;
			case 9: // ATK - Usa Status
				atacarMonstro(monstroId, monstroEquipeId, alvoId, alvoEquipeId, valor, 0);
				break;
			case 10: // ATK - Porcentagem HP Aliado
				atacarMonstro(monstroId, monstroEquipeId, alvoId, alvoEquipeId, valor, 1);
				break;
			case 11: // ATK - Porcentagem HP Inimigo
				atacarMonstro(monstroId, monstroEquipeId, alvoId, alvoEquipeId, valor, 2);
				break;
			case 12: // Debuff - Impedir Recuperação HP (porcentagem: 1 - 100%)
				break;
			case 13: // Debuff - Impedir Recuperação MP (porcentagem: 1 - 100%)
				break;
			case 14: // Remove todos os Debuffs
				removerDebuffs(alvoId, alvoEquipeId);
				break;
			case 15: // Debuff - ATK
				break;
			case 16: // Debuff - DEF
				break;
			case 17: // Imunidade a Debuffs
				break;
			case 18: // Escudo
				break;
			case 19: // Invencibilidade (Imunidade a Dano)
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
	var conteudoBarra = monstro.find("."+tipo+"BarraMonstroConteudo");

	var novaQuantidade = Math.max(Math.floor(novaQuantidade), 0);
	var novaLarguraBarra = novaQuantidade*100/quantidadeMax;
	var atualLarguraBarra = parseInt(conteudoBarra.css("width").split("px").join(""));

	if(quantidadeAlterada != 0 || atualLarguraBarra != novaLarguraBarra){
		conteudoBarra
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

function adicionarModificadorMonstro(monstroId, monstroEquipeId, tipo, valor, turnos){
	var inicioTurno = 0;
	var modificadorId = equipes[monstroEquipeId].monstros[monstroId].data.modificadores.length;
	var classes = ["modificador", "modificador_"+modificadorId];

	switch(tipo){
		case "hp":
		case "hp%":
			inicioTurno = 1;
			if(valor > 0)
				classes.push("curar");
			else
				classes.push("danoContinuo");
			break;
		case "hpmax":
			if(valor > 0)
				classes.push("hpmaxUp");
			else
				classes.push("hpmaxDown");
			break;
		case "mp":
		case "mp%":
			inicioTurno = 1;
			if(valor > 0)
				classes.push("mpUp");
			else
				classes.push("mpDown");
			break;
		case "mpmax":
			if(valor > 0)
				classes.push("mpmaxUp");
			else
				classes.push("mpmaxDown");
			break;
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
			<div class="turnosModificador">'+turnos+'</div>\
		</div>\
	';

	$("#"+monstroEquipeId+"_"+monstroId+" .barraModificadoresMonstro").append(bloco);

	dimensionarFonteTurnos();

	equipes[monstroEquipeId].monstros[monstroId].data.modificadores.push([tipo, valor, turnos, inicioTurno, 1]);
}

function atualizarModificadoresMonstro(monstroId, monstroEquipeId){
	var modificadores = pegarModificadoresMonstro(monstroId, monstroEquipeId);
	$.each(modificadores, function(index, modificador){
		var valor = modificador[1];
		var turnos = modificador[2];

		if(turnos == 0){
			valor = 0;
			equipes[monstroEquipeId].monstros[monstroId].data.modificadores[index][1] = valor;
		}
	});

	equipes[monstroEquipeId].monstros[monstroId].data.statusAdicionais = {};

	$.each(modificadores, function(modificadorId, modificador){
		var tipo = modificador[0];
		var valor = modificador[1];

		var valorAtual = equipes[monstroEquipeId].monstros[monstroId].data.statusAdicionais[tipo] || 0;
		var novoValor = valor + valorAtual;

		equipes[monstroEquipeId].monstros[monstroId].data.statusAdicionais[tipo] = novoValor;

		switch(tipo){
			case "hpmax":
				alterarHPMonstro(monstroId, monstroEquipeId, 0, 0);
				break;
			case "mpmax":
				alterarMPMonstro(monstroId, monstroEquipeId, 0, 0);
				break;
		}
	});
}

function pegarModificadorMonstro(monstroId, monstroEquipeId, modificadorId){
	return equipes[monstroEquipeId].monstros[monstroId].data.modificadores[modificadorId];
}

function pegarModificadoresMonstro(monstroId, monstroEquipeId){
	return equipes[monstroEquipeId].monstros[monstroId].data.modificadores;
}

function processarModificadoresMonstro(monstroId, monstroEquipeId, inicioTurno){
	var modificadores = pegarModificadoresMonstro(monstroId, monstroEquipeId);

	$.each(modificadores, function(modificadorId, modificador){
		if(modificador[4] == 0 && inicioTurno == 1 && modificador[3] == 1){
			var tipo = modificador[0];
			var valor = modificador[1];
			var turnos = modificador[2];

			switch(tipo){
				case "hp":
					alterarHPMonstro(monstroId, monstroEquipeId, valor, 0);
					break;
				case "hp%":
					alterarHPMonstro(monstroId, monstroEquipeId, valor, 1);
					break;
				case "mp":
					alterarMPMonstro(monstroId, monstroEquipeId, valor, 0);
					break;
				case "mp%":
					alterarMPMonstro(monstroId, monstroEquipeId, valor, 1);
					break;
			}

			reduzirTurnoModificadorMonstro(monstroId, monstroEquipeId, modificadorId);
		}
	});

	if(inicioTurno == 0){
		var modificadores = pegarModificadoresMonstro(monstroId, monstroEquipeId);

		$.each(modificadores, function(modificadorId, modificador){
			if(modificador[3] == 0 || modificador[4] == 1)
				reduzirTurnoModificadorMonstro(monstroId, monstroEquipeId, modificadorId);
		});
	}
}

function reduzirTurnoModificadorMonstro(monstroId, monstroEquipeId, modificadorId, remover){
	var modificador = pegarModificadorMonstro(monstroId, monstroEquipeId, modificadorId);
	var modificadorAtivo = modificador[4];
	var novoTurno = modificador[2] - (remover != 1 ? 1 : modificador[2]);
	var elemento = $("#"+monstroEquipeId+"_"+monstroId+" .modificador_"+modificadorId);

	if(modificadorAtivo == 1){
		equipes[monstroEquipeId].monstros[monstroId].data.modificadores[modificadorId][4] = 0;
		elemento.data("bloqueado", 0);
	}
	else{
		equipes[monstroEquipeId].monstros[monstroId].data.modificadores[modificadorId][2] = novoTurno;

		elemento.data("turnos", novoTurno);

		if(novoTurno > 0)
			elemento
				.find(".turnosModificador")
				.text(novoTurno);
		else
			elemento.remove();
	}
}

function removerDebuffs(monstroId, monstroEquipeId){
	var modificadores = pegarModificadoresMonstro(monstroId, monstroEquipeId);

	$.each(modificadores, function(modificadorId, modificador){
		if(modificador[1] < 0)
			reduzirTurnoModificadorMonstro(monstroId, monstroEquipeId, modificadorId, 1);
	});
}

/* Miscelânea */

function exibirSinalValor(valor){
	return (valor >= 0 ? "+" : "")+valor;
}

function random(min, max){
	return Math.round(Math.random() * (max - min) + min);
}

/* Finalizar Partida */

function finalizarPartida(equipeId){

	var equipeInimigaId = pegarEquipeInimiga(equipeId);

	if(verificarMonstrosVivos(equipeId) == 0)
		declararVitoria(equipeInimigaId);
	else if(verificarMonstrosVivos(equipeInimigaId) == 0)
		declararVitoria(equipeId);
}

function declararVitoria(equipeId){
	setTimeout(function(){
		alert((equipeId == "A" ? "VITÓRIA" : "DERROTA")+"!");
		// $("#vitoria")
		// .css("opacity", 0)
		// .html("Você "+(monstroId == "aliado" ? "venceu" : "perdeu")+"!")
		// .addClass((monstroId == "aliado" ? "vitoria" : "derrota"))
		// .animate({"opacity": 1}, 1000);
	}, 100);
}

/* Status */

function pegarStatusMonstro(monstroId, monstroEquipeId, status){
	var statusMonstro = equipes[monstroEquipeId].monstros[monstroId].data.status[status] || 0;
	statusMonstro += pegarStatusAdicionalMonstro(monstroId, monstroEquipeId, status);
	return statusMonstro;
}

function pegarStatusAdicionalMonstro(monstroId, monstroEquipeId, status){
	return equipes[monstroEquipeId].monstros[monstroId].data.statusAdicionais[status] || 0;
}

/* Equipes */

function pegarEquipeMonstro(elemento){
	return elemento.data("equipe");
}

function pegarEquipeInimiga(equipeId){
	return (equipeId == "A" ? "B" : "A");
}
