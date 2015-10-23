<?php
	setlocale(LC_ALL, "pt_BR", "pt_BR.iso-8859-1", "pt_BR.utf-8", "portuguese");
	$fusoHorario = 3;
	$fusoHorario = -($fuso_horario*3600);
	date_default_timezone_set('America/Sao_Paulo');
	$time = time();
	$hora = date('G');
	$minuto = date('i');
	$segundos = date('s');
	$dia = date('d');
	$mes = date('m');
	$ano = date('Y');
	$data = $dia."/".$mes."/".$ano;
	$horario = $hora."h".$minuto."m".$segundos."s";
	$dataCompleta = $data." - ".$horario;
?>