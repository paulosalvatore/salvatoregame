<?php
	if(empty($incluir_arquivo)){
		$incluir_arquivo = $pagina;
		if(!file_exists("paginas/".$pagina.".php"))
			$incluir_arquivo = "nao_encontrado";
	}
	include("paginas/".$incluir_arquivo.".php");
	$conteudo .= '
	';
?>