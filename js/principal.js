var data = {
	tamanhoCorpo: [0, 0],
	menuPrincipal: {
		"batalha": "Batalha",
		"monstros": "Monstros",
		"pvp": "PvP",
		"loja": "Loja"
	}
};

function construirAreaJogo(){
	var bloco = '\
		<div id="resolucao">\
			<div id="r1">32: 512 x 288</div>\
			<div id="r2">48: 768 x 432</div>\
			<div id="r3">64: 1024 x 576</div>\
			<div id="r4">80: 1280 x 720</div>\
			<div id="r5">100: 1600 x 900</div>\
			<div id="r6">120: 1920 x 1080</div>\
		</div>\
		<div id="resolucaoAtual"></div>\
	'+inserirJanelaBase('\
		<div id="corpo">\
			<div id="areaBase">\
				<div id="areaJogo"></div>\
			</div>\
		</div>\
	');

	var conteudoBody = $("body").html();

	$("body")
		.html(bloco)
		.find("#areaJogo")
		.html(conteudoBody);

	$("#resolucao div").click(function(){
		var res = {
			r1: [512, 288],
			r2: [768, 432],
			r3: [1024, 576],
			r4: [1280, 720],
			r5: [1600, 900],
			r6: [1920, 1080]
		};

		var resolucao = res[$(this).attr("id")];

		$("#corpo")
			.width(resolucao[0])
			.height(resolucao[1]);

		$("#resolucaoAtual").html(resolucao[0] + " x "+resolucao[1]);
	});

	$("#r4").click();
}

function inserirMenuPrincipal(){
	$("#areaJogo").append(inserirJanelaBase('<div id="menuPrincipal"></div>'));

	$.each(data.menuPrincipal, function(opcaoId, opcaoNome){
		$("#menuPrincipal").append('\
			<div class="opcao" data-opcao="'+opcaoId+'">\
				• '+opcaoNome+'\
			</div>\
		');
	});
}

function dimensionarFonteMenuPrincipal(){
	var corpo = $("#corpo");
	var tamanho = (data.tamanhoCorpo[0] + data.tamanhoCorpo[1]) / 2;
	var novoTamanho = (corpo.width() + corpo.height()) / 2;
	var novaPorcentagem = ((novoTamanho / tamanho) * 500) + "%";

	$("#menuPrincipal").css("font-size", novaPorcentagem);
}

$(function(){
	construirAreaJogo();

	construirCenarioPrincipal();

	inserirMenuPrincipal();

	$("#menuPrincipal").mouseenter(function(){
		$(this).animate({"opacity": 1}, 200);
	}).mouseleave(function(){
		$(this).animate({"opacity": 0.9}, 200);
	}).mouseleave();

	var corpo = $("#corpo")
    data.tamanhoCorpo[0] = corpo.width();
    data.tamanhoCorpo[1] = corpo.height();
	var larguraAnterior = data.tamanhoCorpo[0];
	var alturaAnterior = data.tamanhoCorpo[1];

	dimensionarFonteMenuPrincipal();

	$("#menuPrincipal .opcao").click(function(){
		var opcao = $(this).data("opcao");

		switch(opcao){
			case "batalha":
				construirBatalha();
				break;
		}
	});

	$("#corpo").attrchange({
		callback: function (e){
			var larguraAtual = $(this).width();
			var alturaAtual = $(this).height();
			if(larguraAnterior !== larguraAtual){
				dimensionarFonteMenuPrincipal();
				larguraAnterior = larguraAtual;
				alturaAnterior = alturaAtual;
			}
		}
	});
});
