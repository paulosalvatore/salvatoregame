<?php
	$diretorioClasses = "../includes/classes/";
	foreach(scandir($diretorioClasses) as $c => $v){
		if($v != "." and $v != ".."){
			$nomeClasse = ucfirst(str_replace(".php", "", $v));
			if(!class_exists($nomeClasse))
				include($diretorioClasses.$v);
			$$nomeClasse = new $nomeClasse();
		}
	}
?>