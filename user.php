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
		
			if(currentRole() == USER_ROLE_GUEST || isset($_POST["id"]) && $_POST["id"] != currentID() && !checkAccess()):
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
	        <div id="loading-tools">
                <a href="/workbench.php"><img id="add" alt="Add" src="/img/tools/add.png"/></a>
            	<img src="/img/tools/upload.png"/>
            </div>
		</div>
		<div id="content">
			<h1>Личная информация</h1>
			<table id="user-info">
				<tr>
					<td id="login" width="50%"></td>
					<td id="id" width="50%"></td>
				</tr>
				<tr>
					<td id="name"></td>
					<td id="surname"></td>
				</tr>
				<tr>
					<td colspan="2" id="error"></td>
				</tr>
				<tr>
					<td id="password"><button onclick="changePassword()">Сменить пароль</button></td>
					<td><button id="save">Сохранить</button></td>
				</tr>
				<tr>
					<td colspan='2'><button onclick="deleteUser()" id="delete">Удалить</button></td>
				</tr>
			</table>
			<h1>Ваши работы</h1>
			<div id="works-block">
				<div id="works">
					<div id="works-images"></div>
				</div>
			</div>
			<h1>Ваши файлы</h1>
			<div id="uploads-block">
				<div id="uploads">
					<div id="uploads-images"></div>
				</div>
			</div>
		</div>
		<script src="js/jquery.js"></script>
       	<script src="js/nice_input.js"></script>
       	<script src="js/auth.js"></script>
        <script src="js/common.js"></script>
        <script src="js/user.js"></script>
		<?php endif; ?>
	</body>
</html>