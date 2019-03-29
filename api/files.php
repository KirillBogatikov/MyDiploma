<?php
    /*
     * Класс, упрощающий взаимодействие с файлами и папками
     */ 
    class File {
        var $path;
        
        function __construct($path) {
            $this->path = $path;
            if($this->isDirectory() && substr($this->path, -1) != "/" && substr($this->path, -1) != "\\") {
            	$path .= "/";
            }
        }

        /*
         * Вернет TRUE, если объект связан с файлом
         */
        function isFile() {
            return !is_dir($this->path);
        }

        /*
         * Вернет TRUE, если объект связан с папкой
         */
        function isDirectory() {
            return is_dir($this->path);
        }

        /*
         * Вернет список файлов и папок, находящихся в папке, связанную с данным объектом
         * Либо NULL, если объект связан с файлом
         */
        function listFiles($wrap=false, $pattern="*") {
            if(!$this->isDirectory()) {
                return null;
            }

            $path = $this->path;
            $result = glob($path.$pattern);
            if(!$wrap) {
                return $result;
            }

            $count = count($result);
            for($i = 0; $i < $count; $i++) {
                $result[$i] = new File($result[$i]);
            }
            return $result;
        }
        
        /**
         * Вернет список имен файлов и папок, находящихся в папке, связанной с данным объектом
         * Либо NULL, если объект связан с файлом
         * 
         * @param string $pattern шаблон имен файлов и подпапок
         * @param string $withext если true список будет содержать имена включая расширения файлов, иначе - только имя файла
         * @return NULL|array список имен вложенный файлов или папок, либо NULL если списко получить не удалось (объект указывает на файл) 
         */
        function listNames($pattern="*", $withext=true) {
        	if(!$this->isDirectory()) {
        		return null;
        	}
        	
        	$path = $this->path;
        	$result = glob($path.$pattern);
        	
        	$count = count($result);
        	for($i = 0; $i < $count; $i++) {
        		$file = new File($result[$i]);
        		$result[$i] = $file->getName($withext);
        	}
        	return $result;
        }
        
        function lastModified() {
        	return filemtime($this->path);
        }
        
        function size() {
        	return filesize($this->path);
        }

        /*
         * Если объект связан с файлом - удалит данный файл с диска
         * Если объект связан с папкой - удалит папку, включая её содержимое и содержимое подпапок
         */
        function delete() {
            if($this->isFile()) {
                unlink($this->path);
            } else {
                $content = $this->listFiles();
                foreach($content as $fpath) {
                    $file = new File($fpath);
                    $file->delete();
                }
                rmdir($this->path);
            }
        }

        /*
         * Создаст новую папку на диске по пути, переданному в конструктор
         * Вызов new File("a/b/c.txt").mkdir() создаст папку с именем c.txt, а также создаст родительские папки
         * при их отсутствии
         */    
        function mkdir() {
            mkdir($this->path, 0700, true);
        }

        /*
         * Создаст пустой файл на диске по пути, переданному в конструктор
         * Вызов new File("a/b/c.txt").create() создаст пустой файл с именем c.txt, а также создаст родительские
         * папки при их отсутствии
         */
        function create() {
            $parent = $this->getParent();
            $parent->mkdir();
            file_put_contents($this->path, "");
        }

        /*
         * Вернет TRUE, если существует файл или папка, связанные с объектом
         */
        function exists() {
            return file_exists($this->path);
        }

        /*
         * Вернет путь к файлу или папке, связанной с данным объектом
         */
        function getPath() {
            return $this->path;
        }

        /*
         * Вернет имя файла или папки, связанной с данным объектом   
        */
        function getName($withext=true) {
            $index = strrpos($this->path, "/");
            if(!$index) {
                $index = strrpos($this->path, "\\");
            }
            
            $name = substr($this->path, $index + 1, strlen($this->path));
            if($this->isFile() && !$withext) {
            	$name = substr($name, 0, strrpos($name, "."));
            }
            return $name;
        }

        /*
         * Вернет объект, связанный с родительской папкой
         */
        function getParent() {
            $index = strrpos($this->path, "/");
            if(!$index) {
                $index = strrpos($this->path, "\\");
            }
            return new File(substr($this->path, 0, $index));
        }

        function read() {
            return file_get_contents($this->path);
        }

        function write($text) {
            file_put_contents($this->path, $text);
        }
    }
?>