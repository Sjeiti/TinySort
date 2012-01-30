<?php
header("Content-type: text/css");
require_once('lessc.inc.php');
foreach	($_GET as $k=>$v) {
	//
	//$sUri = $_SERVER["SERVER_NAME"].$_SERVER["REQUEST_URI"];
	//$aUri = explode('/',$sUri);
	//array_pop($aUri);
	//$sPath = implode('/',$aUri).'/';
	////
	//echo '/* '.$k.' */';
	$sLss = $k.'.less';
	$sCss = $k.'.css';
	if (file_exists($sLss)) lessc::ccompile($sLss,$sCss);
	echo file_get_contents($sCss);
}


//$contents = '';
//foreach	($_GET as $k=>$v) {
//	$sLss = $k.'.less';
//	$sCss = $k.'.css';
//	if (file_exists($sLss)) $contents .= file_get_contents($sLss);
//	if (file_exists($sCss)) $contents .= file_get_contents($sCss);
//}
//$less = new lessc();
//$css = $less->parse($contents);
//echo $contents;
////echo $css;