<?php
	session_start();
	header("Content-Type: text/html; charset=ISO-8859-1", true);
	// require_once("conexao/conexao.php");
	include("includes/data.php");
	include("includes/protocolo.php");
?>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN">
<html>
	<head>
		<title>SalvatoreGame</title>

		<link rel="stylesheet" type="text/css" href="css/fontes.css">
		<link rel="stylesheet" type="text/css" href="css/estilos.css">
		<link rel="stylesheet" type="text/css" href="css/cenario.css">
		<link rel="stylesheet" type="text/css" href="css/monstros.css">
		<link rel="stylesheet" type="text/css" href="css/principal.css">

		<script type="text/javascript" src="js/lib/jquery.js"></script>
		<script type="text/javascript" src="js/lib/attrchange.js"></script>
		<script type="text/javascript" src="js/funcoes.js"></script>
		<script type="text/javascript" src="js/cenario.js"></script>
		<script type="text/javascript" src="js/principal.js"></script>
		<script type="text/javascript" src="js/monstros.js"></script>
		<script type="text/javascript" src="js/batalha.js"></script>

		<script>
			document.firstElementChild.style.zoom = "reset";
		</script>
	</head>
	<body></body>
</html>