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
		<div id="loading-block">
			<img id="loading-image" src="/img/loading.png"/>
		</div>
	    <div id="header">
	       <img id="logo" src="/img/logo.png"/>
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
	           <div id="background-color-container">
		           <span>Цвет бумаги:</span>
		           <div id="background-color"></div>
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
	    <div id="text-editor-shadow">
		    <div id="text-editor">
		    	<input type="text" id="editor-input"/>
		    	<div id="editor-color-picker"></div>
		    	<div id="editor-controls">
		    		<select id="editor-font"></select>
		    		<input type="number" id="editor-text-size"/>
		    		<button id="editor-submit">OK</button>
		    	</div>
		    </div>
		</div>
	    <script src="js/jquery.js"></script>
        <script src="js/workbench/type_list.js"></script>
       	<script src="js/workbench/views.js"></script>
        <script src="js/workbench/color_picker.js"></script>
        <script src="js/workbench/config.js"></script>
        <!--  TODO <script src="js/workbench/fullscreen.js"></script> -->
       	<script src="js/auth.js"></script>
        <script src="js/common.js"></script>
        <script src="js/workbench.js"></script>
	</body>
</html>