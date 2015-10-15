<?php
	session_start();
	header("Content-Type: text/html; charset=ISO-8859-1", true);
	// require_once("conexao/conexao.php");
	include("includes/variaveis.php");
	include("includes/data.php");
	include("includes/funcoes.php");
	include("includes/config.php");
	include("corpo.php");
	echo'
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
		<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN">
		<html>
			<head>
				<title>Game</title>
				<link rel="stylesheet" type="text/css" href="css/estilos.css">
				<link rel="stylesheet" type="text/css" href="css/cenario.css">
				<link rel="stylesheet" type="text/css" href="css/personagens.css">
				<script type="text/javascript" src="js/lib/jquery.js"></script>
				<script type="text/javascript" src="js/funcoes.js"></script>
				<script type="text/javascript" src="js/base/cenario.js"></script>
				<script type="text/javascript" src="js/base/personagem.js"></script>
				';
				if(file_exists("js/paginas/".$pagina.".js"))
					echo'
						<script type="text/javascript" src="js/paginas/'.$pagina.'.js"></script>
					';
				echo'
				<script>
					document.firstElementChild.style.zoom = "reset";
				</script>
			</head>
			<body>
				'.$conteudo.'
			</body>
		</html>
	';
?>