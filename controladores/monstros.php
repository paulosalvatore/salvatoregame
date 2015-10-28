<?php
	session_start();

	require_once("../conexao/conexao.php");

	include("../includes/funcoes.php");

	check_is_ajax(__FILE__);

	include("../includes/iniciarClasses.php");

	$monstros = $Monstros->pegarMonstros();

	echo json_encode($monstros);
?>