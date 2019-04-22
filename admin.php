<!doctype>
<html>
	<head>
	   <meta charset="UTF-8">
	   <title>Insert title here</title>
	   <meta name="description" content="Сервис для создания дипломов, грамот, открыток, благодарственных писем">
       <meta name="keywords" content="Дипломы, грамоты, письма, открытки, maker, diploma, charter, letter">
       <link rel="stylesheet" href="css/common.css"/>
       <link rel="stylesheet" href="css/user.css"/>
       <link rel="shortcut icon" href="img/favicon.ico"/>
       <style id="fonts"></style>
    </head>
	<body>
		<?php
			include_once "api/const.php";
			include_once "api/auth.php";
		
			if(!checkAccess()):
		?>			
		<div id="no-access">
			<div>
				<img src="/img/error.png"/>
				<h1>У Вас нет доступа к этой информации</h1>
			</div>
		</div>
		<?php else: ?>
		<div id="header">
			<a href="/"><img id="logo" src="/img/logo.png"/></a>
            <div id="sign-controls">
                <a id="first-ctrl-link" href="#signup"><img id="first-ctrl-img" alt="Sign up" src="/img/user/sign_up.png"/></a>
                <a id="second-ctrl-link" href="#signin"><img id="second-ctrl-img" alt="Sign in" src="/img/user/sign_in.png"/></a>
            </div>
		</div>
		<div id="content">
		
		</div>
		<script src="js/jquery.js"></script>
       	<script src="js/nice_input.js"></script>
       	<script src="js/auth.js"></script>
        <script src="js/common.js"></script>
        <script src="js/admin.js"></script>
		<?php endif; ?>
	</body>
</html>