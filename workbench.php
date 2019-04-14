<!DOCTYPE html>
<html>
	<head>
	   <meta charset="UTF-8">
	   <title>Insert title here</title>
	   <meta name="description" content="Сервис для создания дипломов, грамот, открыток, благодарственных писем">
       <meta name="keywords" content="Дипломы, грамоты, письма, открытки, maker, diploma, charter, letter">
       <link rel="stylesheet" href="css/common.css"/>
       <link rel="stylesheet" href="css/workbench.css"/>
       <link rel="shortcut icon" href="img/favicon.ico"/>
    </head>
	<body>
	    <div id="header">
	       <img id="logo" src="/img/logo.png"/>
	        <div id="sign-controls">
                <a id="first-ctrl-link" href="#signup"><img id="first-ctrl-img" alt="Sign up" src="/img/user/sign_up.png"/></a>
                <a id="second-ctrl-link" href="#signin"><img id="second-ctrl-img" alt="Sign in" src="/img/user/sign_in.png"/></a>
            </div>
            <div id="loading-tools">
                <img src="/img/tools/upload.png"/>
                <img src="/img/tools/download.png"/>
            </div>
        </div>
	    <div id="content">
	       <div id="options">
	           <span>Цвет бумаги:</span>
	           <div id="background-color"></div>
	       </div>
	       <div id="bench">
	           <div id="blank">
	               <img id="frames"/>
	           </div>
	       </div>
	       <div id="segments">
	           
	       </div>
	    </div>
	    <script src="js/jquery.js"></script>
        <script src="js/auth.js"></script>
        <script src="js/common.js"></script>
        <script src="js/config.js"></script>
        <script src="js/workbench_ui.js"></script>
        <script src="js/workbench.js"></script>
        <script src="js/segments.js"></script>
	</body>
</html>