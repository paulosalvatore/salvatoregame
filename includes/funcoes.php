<?php
	function check_is_ajax($script){
		$isAjax = isset($_SERVER['HTTP_X_REQUESTED_WITH']) AND
		strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
		if(!$isAjax)
			trigger_error('Acesso negado. ('.$script.')', E_USER_ERROR);
	}
?>