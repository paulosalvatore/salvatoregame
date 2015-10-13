function inserirBarraHabilidades(lado){
	var id = "barraHabilidades_"+lado;
	var bloco = '\
		<div class="barraHabilidades" id="'+id+'">\
		</div>\
	';
	$("#areaJogo").append(bloco);
	$("#"+id).css(lado, 0);
	if(lado == "right")
		$("#"+id).css({
			"-webkit-transform": "rotateY(180deg)",
			"transform": "rotateY(180deg)"
		});
}

$(function(){
	inserirBarraHabilidades("left");
	inserirBarraHabilidades("right");
});