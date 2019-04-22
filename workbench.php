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
       <style id="fonts"></style>
    </head>
	<body>
		<div class="loading-block" id="loading-block">
			<img class="loading-image" id="loading-image" src="/img/loading.png"/>
		</div>
	    <div id="header">
	        <a href="/"><img id="logo" src="/img/logo.png"/></a>
	        <div id="sign-controls">
                <a id="first-ctrl-link" href="#signup"><img id="first-ctrl-img" alt="Sign up" src="/img/user/sign_up.png"/></a>
                <a id="second-ctrl-link" href="#signin"><img id="second-ctrl-img" alt="Sign in" src="/img/user/sign_in.png"/></a>
            </div>
            <div id="loading-tools">
                <a href="#new"><img src="/img/tools/add.png"/></a>
                <img src="/img/tools/upload.png"/>
                <img src="/img/tools/download.png"/>
            </div>
        </div>
	    <div id="content">
	       <div id="options">
	           <div id="bgcolor-container">
		           <span id="bgcolor-title">Цвет бумаги</span>
		           <div id="bgcolor-content">
		               <div id="bgcolor-picker"></div>
		           </div>
		       </div>
		       <div id="texteditor-container">
		       	   <span id="texteditor-title">Настройки текста</span>
		       	   <div id="texteditor-content"><div>
		       	   	   <textarea placeholder="Текст" id="texteditor-value"></textarea>
		       	   	   <div id="texteditor-picker"></div>
		       	   	   <div id="texteditor-controls">
		       	   	       <select id="texteditor-font"></select>
		       	   	       <input placeholder="Размер текста" type="number" id="texteditor-size"/>
		       	   	       <button id="texteditor-delete">Удалить</button>
		       	   	       <button id="texteditor-submit">OK</button>
		       	   	   </div>
		       	   </div></div>
		       </div>
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
        <script src="js/workbench/type_list.js"></script>
       	<script src="js/workbench/views.js"></script>
        <script src="js/workbench/color_picker.js"></script>
        <script src="js/workbench/config.js"></script>
        <script src="js/workbench/nice_input.js"></script>
        <script src="js/workbench/text_editor.js"></script>
       	<script src="js/auth.js"></script>
        <script src="js/common.js"></script>
        <script src="js/workbench.js"></script>
	</body>
</html>