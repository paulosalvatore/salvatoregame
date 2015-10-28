function construirBatalha(){

	construirCenarioBatalha();

	$.ajax({
		url: "controladores/monstros.php",
		data:({
			// campo: campo,
			// valor: valor
		}),
		dataType: "json",
		success: function(result){
			monstros = result;
		},
		complete: function(){
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

			iniciarPartida();

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
						if(equipeMonstroTurno != alvoEquipeId)
							usarHabilidade(monstroIdTurno, equipeMonstroTurno, alvoId, alvoEquipeId, habilidadeId);
					}
					else if(habilidadeAlvo == 2){ // Aliado
						if(equipeMonstroTurno == alvoEquipeId)
							usarHabilidade(monstroIdTurno, equipeMonstroTurno, alvoId, alvoEquipeId, habilidadeId);
					}
					else if(habilidadeAlvo == 3){ // Si mesmo
						if((equipeMonstroTurno == alvoEquipeId) && (monstroIdTurno == alvoId))
							usarHabilidade(monstroIdTurno, equipeMonstroTurno, alvoId, alvoEquipeId, habilidadeId);
					}
				}

				return false;
			});

			var corpo = $("#corpo")
			jogo.tamanhoCorpo[0] = corpo.width();
			jogo.tamanhoCorpo[1] = corpo.height();
			var larguraAnterior = jogo.tamanhoCorpo[0];
			var alturaAnterior = jogo.tamanhoCorpo[1];

			$("#corpo").attrchange({
				callback: function (e){
					var larguraAtual = $(this).width();
					var alturaAtual = $(this).height();
					if(larguraAnterior !== larguraAtual){
						dimensionarFonteTurnos();
						larguraAnterior = larguraAtual;
						alturaAnterior = alturaAtual;
					}
				}
			});
		}
	}).responseText;
}
