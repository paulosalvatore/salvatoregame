// function inserirBarraHabilidades(lado){
	// var id = "barraHabilidades_"+lado;
	// var bloco = '\
		// <div class="barraHabilidades" id="'+id+'">\
		// </div>\
	// ';
	// $("#areaJogo").append(bloco);
	// $("#"+id).css(lado, 0);
	// if(lado == "right")
		// $("#"+id).css({
			// "-webkit-transform": "rotateY(180deg)",
			// "transform": "rotateY(180deg)"
		// });
// }

// function inserirMensagemVitoria(){
	// var bloco = '\
		// <div id="vitoria"></div>\
	// ';
	// $("#areaJogo").append(bloco);
// }

// function inserirConsole(){
	// var bloco = '\
		// <div align="center">\
			// <div id="console">\
				// <div id="conteudoConsole"></div>\
			// </div>\
		// </div>\
	// ';
	// $("#areaJogo").append(bloco);
// }

function construirCenario(){
			/*<div id="r1">1920 x 1080</div>\
			<div id="r2">1600 x 900</div>\
			<div id="r3">1366 x 768</div>\
			<div id="r4">1280 x 720</div>\*/
	var bloco = '\
		<div id="resolucao">\
			<div id="r1">32: 512 x 288</div>\
			<div id="r2">48: 768 x 432</div>\
			<div id="r3">64: 1024 x 576</div>\
			<div id="r4">80: 1280 x 720</div>\
		</div>\
		<div id="resolucaoAtual"></div>\
		<table id="janelaBase" cellpadding="0" cellspacing="0">\
			<tr>\
				<td align="center" valign="middle">\
					<div id="corpo">\
						<div id="areaBase">\
							<div id="areaJogo">\
								<div id="background"></div>\
							</div>\
						</div>\
					</div>\
				</td>\
			</tr>\
		</table>\
	';
	$("body").html(bloco);
	$("#resolucao div").click(function(){
		var res = {
			r1: [512, 288],
			r2: [768, 432],
			r3: [1024, 576],
			r4: [1280, 720]
		};
		var resolucao = res[$(this).attr("id")];
		$("#corpo")
			.width(resolucao[0])
			.height(resolucao[1]);
		$("#resolucaoAtual").html(resolucao[0] + " x "+resolucao[1]);
	});
	$("#r3").click();
}

function construirCenarioBatalha(){
	var bloco = '\
		<div id="topUI"></div>\
		<div class="barraPersonagem left">\
			<div class="hp"></div>\
			<div class="mp"></div>\
		</div>\
		<div class="barraPersonagem right">\
			<div class="hp"></div>\
			<div class="mp"></div>\
		</div>\
		<div class="plataformaPedra top"></div>\
		<div class="plataformaGrama top"></div>\
		<div class="plataformaPedra bot"></div>\
		<div class="plataformaGrama bot"></div>\
	';
	$("#areaJogo").append(bloco);
}

$(function(){
	construirCenario();
	construirCenarioBatalha();
	// inserirMensagemVitoria();
	// inserirConsole();
});