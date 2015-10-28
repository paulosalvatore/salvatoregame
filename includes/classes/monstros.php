<?php
	class Monstros {
		public function pegarMonstros(){
			$exibirMonstros = array();

			$queryMonstros = mysql_query("SELECT * FROM monstros");
			while($resultadoMonstros = mysql_fetch_assoc($queryMonstros)){
				$exibirMonstros[$resultadoMonstros["id"]] = array(
					"nome" => utf8_encode($resultadoMonstros["nome"]),
					"imagem" => $resultadoMonstros["imagem"],
					"valoresIniciais" => array(
						"hp" => (int)$resultadoMonstros["hp"],
						"mp" => (int)$resultadoMonstros["mp"],
						"status" => array(
							"atk" => (int)$resultadoMonstros["atk"],
							"def" => (int)$resultadoMonstros["def"]
						)
					)
				);
			}

			$habilidades = $this->pegarHabilidadesMonstros();

			foreach($habilidades as $habilidadeId => $habilidadeInformacoes){
				$exibirMonstros[$habilidadeInformacoes["monstro"]]["habilidades"][] = $habilidadeInformacoes;
			}

			return $exibirMonstros;
		}

		public function pegarHabilidadesMonstros(){
			$habilidades = array();

			$queryHabilidades = mysql_query("SELECT * FROM monstros_habilidades");
			while($resultadoHabilidades = mysql_fetch_assoc($queryHabilidades)){
				$habilidades[$resultadoHabilidades["id"]] = array(
					"monstro" => $resultadoHabilidades["monstro"],
					"nome" => utf8_encode($resultadoHabilidades["nome"]),
					"imagem" => $resultadoHabilidades["imagem"],
					"efeitos" => $this->pegarEfeitosHabilidadeMonstro($resultadoHabilidades["id"]),
					"area" => (int)$resultadoHabilidades["area"],
					"alvo" => (int)$resultadoHabilidades["alvo"],
					"recarga" => (int)$resultadoHabilidades["recarga"],
					"custo" => (int)$resultadoHabilidades["custo"]
				);
			}

			return $habilidades;
		}

		public function pegarEfeitosHabilidadeMonstro($habilidadeId){
			$efeitosHabilidade = array();

			$queryEfeitosHabilidade = mysql_query("SELECT * FROM monstros_habilidades_efeitos WHERE (habilidade LIKE '$habilidadeId')");
			while($resultadoEfeitosHabilidade = mysql_fetch_assoc($queryEfeitosHabilidade)){
				$efeitosHabilidade[] = array(
					"tipo" => (int)$resultadoEfeitosHabilidade["tipo"],
					"valor" => (int)$resultadoEfeitosHabilidade["valor"],
					"turnos" => (int)$resultadoEfeitosHabilidade["turnos"]
				);
			}

			return $efeitosHabilidade;
		}
	}
?>