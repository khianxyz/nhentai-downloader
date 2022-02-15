const config = {
  user: '',
  pass: '',
  url: 'nhentai.purpose.ml',

}
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Fetch and log a given request object
 * @param {Request} request
 */
async function handleRequest(request) {
    if(config.user || config.pass)
      for (const r = basicAuthResponse(request); r;) return r;
    let url = new URL(request.url);
    let path = url.pathname;
    if (path == '/')
      return new Response(renderHTML(), { headers: {'Content-Type': 'text/html; charset=utf-8'}});
    if (path == '/favicon.ico')
      return new Response('', { status: 404 });
    let folderid = path.split('/')[1];
    //console.log(folderid)
    let id = path.split('/')[2];
    if (id == '')
      return responsePre(folderid);
    else if(id == 'title')
			return responseTitle(folderid)
		else	
      return responseP(folderid, id);
}

async function responsePre(folderid){
    const url = `https://t2.nhentai.net/galleries/${folderid}/cover.jpg`
    const responsepic = await fetch(url);
    if (!responsepic.ok)
      return new Response("不存在该目录", { status: 404, headers:{'Access-Control-Allow-Origin': '*'} });
    else{
      return new Response(responsepic.body, {headers:{'Access-Control-Allow-Origin': '*', 'Content-Type': `image/jpg`}});
    }
}

async function responseHTML(folderid){
		const url = `https://nhentai.net/g/${folderid}/`;
		const responseti = await fetch(url);
		if (!responseti.ok)
			return new Response("不存在", { status: 404, headers:{'Access-Control-Allow-Origin': '*'} });
		else{
            console.log(responseti.blob.text);
			return new Response('12', {headers:{'Content-Type': 'text/plain; charset=utf-8'}});
		}
}
async function responseP(folderid, id){
    const url = `https://i.nhentai.net/galleries/${folderid}/${id}.jpg`
    const responsepic = await fetch(url);
    if (!responsepic.ok)
      return new Response("不存在该图片", { status: 404, headers:{'Access-Control-Allow-Origin': '*'} });
    else{
      return new Response(responsepic.body, {headers:{'Access-Control-Allow-Origin': '*', 'Content-Type': `image/jpg`}});
    }
}

function renderHTML() {
  return `
<html>
    <head>
		<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no">
		<script src="https://cdn.purpose.ml/gh/eligrey/FileSaver.js@2.0.4/dist/FileSaver.min.js"></script>
		<script src="https://cdn.purpose.ml/gh/Stuk/jszip/dist/jszip.min.js"></script>
        <script>
        async function startDownload(folderId){
		  //先判断有无第一张，如果没有，直接break，如果有则开始打包。
			let response = await fetch('https://nhentai.purpose.ml/' + folderId + '/1').then(
				function(response){
					if(response.ok){
						importantText.innerHTML = '开始下载...<br/>'; //打算添加img和确认按钮
						previewpic.src = 'https://nhentai.purpose.ml/' + folderId + '/';
					}
					else{
						alert('请输入正确的本子代号');
					}
				}
			);
			
			var downables = true;
			var i = 1;                           //从第i张下载， for index
			var downloadedn = 0;                 //已经下载图数
			
			var zip = new JSZip();
			var img = zip.folder(folderId);
		  
			while(downables) {
				const folderid = folderId;
				var url = "https://nhentai.purpose.ml/" + folderid + '/' + i;
				requests = new Request(url);
				await fetch(requests).then(
				function(response) {
					if(response.ok){
						downables = true;      //可进入下次循环

						console.log(url + ' ----- ' + response.ok);
					
						response.blob().then(function(Blob) {       //二进制转换为Base64

							var reader = new FileReader();
							reader.readAsDataURL(Blob);
							reader.onload = function () {
                if((++downloadedn) < 10)
									filename = '000' + downloadedn + '.jpg';
								else if(downloadedn < 100)
									filename = '00' + downloadedn + '.jpg';
								else if(downloadedn < 1000)
									filename = '0' + downloadedn + '.jpg';
								img.file(filename, reader.result.replace(/^data:image\\/(jpg);base64,/,"") , {base64: true});
								console.log(Blob); //查重;
                console.log(filename);
							};
						});
						
						changeableText.innerHTML = ("正在下载打包第"+ i + "张...");
						i += 1; 
					}
                else {
					downables = false;          //如服务器无回应
					console.log('不存在第' + i + '张');
                }
				});
			}             //结束while
			
			if(downloadedn > 0){
				zip.generateAsync({type:"blob"}).then(function(content) { saveAs(content, folderId + ".zip"); });    //打包保存;
				changeableText.innerHTML = "打包完成，即将保存<br/>";
			}
        }
        </script>
		<style>
			body
			{
				background: rgba(246, 249, 255);
				font-size: 13px;
				color:#999;
			}
			#page
			{
				margin: 70px auto;
				max-width: 400px;
				padding: 20px;
				border-radius: 10px;
				box-shadow: 0px 8px 10px rgb(0 0 0 / 20%);
				background: #FFF;
				min-height:400px;
			}
			#previewpic
			{
				margin-bottom: 30px;
				float: right;
				width: 150px;
				min-height: 150px;
				background: #EEE;
				border-radius: 10px;
				box-shadow: 0px 8px 10px rgb(0 0 0 / 20%);
				top: 0px;
			}
			input#fdid {
				padding: 10px 10px;
				/* border-radius: 10px; */
				border: NONE;
				border-bottom: 1px solid #DDD;
				outline: none;
				transition: .1s;
				max-width:8em;
        margin-bottom: 15px;
			}
			button {
				PADDING: 5PX 10PX;
				margin-left: 10px;
				border-radius: 10px;
				border: none;
				border-bottom: 2px solid #dfdfdf;
				color: #46D;
				outline: none;
				transition: .1s;
				cursor:pointer;
			}
			input#fdid:hover, #fdid:active {
				outline: none;
				border-bottom: 1px solid #000;
			}
			button:hover {
        margin-bottom: 15px;
				color: #ff9797;
				background: #fcfcfc;
			}
			div#importantText {
				margin-left:10px;
			}
			div#changeableText{
				margin-left:10px;
			}
			@media (max-width: 600px){
				page{
					margin-top: 10px;
				}
			}
	
		</style>
    </head>
    <body>
		<div id="page">
			<img id="previewpic" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABvSURBVGhD7dSxDQAhEAQx+i/2WgBRwwQIycHn/Jy1a2b2z9/6+fH37X7g9QVdwAXiCiKEEEKxAEIxoBVCCKFYAKEY0AohhFAsgFAMaIUQQigWQCgGtEIIIRQLIBQDWiGEEIoFEIoBrRBCCMUCrwkd9ooS/1m+IxcAAAAASUVORK5CYII="/>
			<input id="fdid" placeholder="选择你的本子" onkeyup="if(event.keyCode==13)startDownload(fdid.value)"></input><button onclick="startDownload(fdid.value)">Download</button><br>
			<div id="importantText"></div>
			<div id="changeableText"></div>
		</div>
	</body>
</html>
  `
};

//Response 验证请求
function basicAuthResponse(request) {
    const user = config.user || '',
        pass = config.pass || '',
        _401 = new Response('Unauthorized', {
            headers: {'WWW-Authenticate': `Basic realm="nhentai downloader"`},
            status: 401
        });
        if (user || pass) {
        const auth = request.headers.get('Authorization')
        if (auth) {
            try {
            const [received_user, received_pass] = atob(auth.split(' ').pop()).split(':');
            return (received_user === user && received_pass === pass) ? null : _401;
        } catch (e) {
        
        }
      }
    } else return null;
    return _401;
}
