
const puppeteer = require('puppeteer');
const fs = require('fs');
const username = "xxxxx";
const password = 'xxxxxx';

(async () => {
    const browser = await puppeteer.launch({executablePath: './bin/chrome-win32/chrome.exe',headless: true});
    const page = await browser.newPage();
    await page.goto('https://bihu.com/login', {waitUntil: 'networkidle2'});

    const loginUser = "#loginName";
    const loginPassword = "#password";
    const loginButton = "div.login.container .ipt-public  form > div.btn-box > button";
    await page.click(loginUser);
    await page.type(loginUser, username);
    await page.click(loginPassword);
    await page.type(loginPassword, password);
    await page.click(loginButton);
    await page.waitForSelector('.alt-item');

    while(true){

        var now = new Date();
        var end = new Date(now.getFullYear(),now.getMonth(),now.getDate(),23).getTime();
        var start = new Date(now.getFullYear(),now.getMonth(),now.getDate(),6).getTime();
        now = now.getTime();
        if(now > start && now < end){
            try{
                await page.goto('https://bihu.com/?category=follow');
                await page.waitForSelector('.alt-item');
                await page.waitFor(10 * 1000);
                const data = await page.evaluate((user) => {
                    var titleDom = document.querySelector('.alt-item .alt-box .alt-content .content1');
                    var title = titleDom.innerHTML;
                    var clickZan = false;
                    var zan = document.querySelector('.alt-item .alt-box .alt-bottom-item:nth-child(2)');
                    if(zan.classList.contains('active')){
                        clickZan = true;
                    }

                    var p = document.querySelector('.alt-item .alt-name > p:nth-child(2)').innerHTML;

                    var myDate = new Date();
                    myDate.toLocaleString( );

                    var zanNum = document.querySelector('.alt-item .alt-box .alt-bottom-item:nth-child(2) span').innerText;

                    var info = myDate + "，用户：" + user + ",文章：" + title + ", 时间：" + p + ", 是否点过赞：" + clickZan;


                    if(clickZan || zanNum > 300){
                        info += ", 点赞人数：" + zanNum;
                        return {info: info};
                    }

                    if(p.indexOf('秒') >= 0){
                        zan.click();
                        function like(test){
                            var xmlhttp=new XMLHttpRequest();
                            var t = localStorage["ANDUI_BIHU_LOGININFO"];
                            var e = JSON.parse(t);
                            var userId = e.userId;
                            var access = e.accessToken;
                            var d = JSON.parse(test);
                            var artId = d.data.artList.list[0].id;
                            xmlhttp.onreadystatechange=function(){
                                if (xmlhttp.readyState==4 && xmlhttp.status==200){
                                    console.log(xmlhttp.responseText)
                                }
                            }
                            xmlhttp.open("POST","https://be02.bihu.com/bihube-pc/api/content/upVote",true);
                            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded;charset=utf-8");
                            var param = 'userId='+userId+'&accessToken='+access+'&artId=' + artId;
                            xmlhttp.send(param);
                        }
                        function log(test){
                            var c = 0;
                            var cI = setInterval(function(){
                                if(c >= 2){
                                    clearInterval(cI);
                                }
                                like(test);
                                c++;
                            }, 30000);
                        }
                        function getList(callback){
                            var xmlhttp=new XMLHttpRequest();
                            var t = localStorage["ANDUI_BIHU_LOGININFO"];
                            var e = JSON.parse(t);
                            var userId = e.userId;
                            var access = e.accessToken;
                            xmlhttp.onreadystatechange=function(){
                                if (xmlhttp.readyState==4 && xmlhttp.status==200){
                                    callback.apply(this, [xmlhttp.responseText]);
                                }
                            }
                            xmlhttp.open("POST","https://be02.bihu.com/bihube-pc/api/content/show/getFollowArtList",true);
                            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded;charset=utf-8");
                            var param = 'userId='+userId+'&accessToken='+access;
                            xmlhttp.send(param);
                        }
                        getList(log);
                    }

                    var index = p.indexOf('分钟');
                    // 只点赞20分钟内的文章
                    if(index >= 0 && !clickZan){
                        var min = p.substring(0, index);
                        if(parseInt(min) < 10){
                            zan.click();
                            function like(test){
                                var xmlhttp=new XMLHttpRequest();
                                var t = localStorage["ANDUI_BIHU_LOGININFO"];
                                var e = JSON.parse(t);
                                var userId = e.userId;
                                var access = e.accessToken;
                                var d = JSON.parse(test);
                                var artId = d.data.artList.list[0].id
                                xmlhttp.onreadystatechange=function(){
                                    if (xmlhttp.readyState==4 && xmlhttp.status==200){
                                        console.log(xmlhttp.responseText)
                                    }
                                }
                                xmlhttp.open("POST","https://be02.bihu.com/bihube-pc/api/content/upVote",true);
                                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded;charset=utf-8");
                                var param = 'userId='+userId+'&accessToken='+access+'&artId=' + artId;
                                xmlhttp.send(param);
                            }
                            function log(test){
                                var c = 0;
                                var cI = setInterval(function(){
                                    if(c >= 2){
                                        clearInterval(cI);
                                    }
                                    like(test);
                                    c++;
                                }, 30000);
                            }
                            function getList(callback){
                                var xmlhttp=new XMLHttpRequest();
                                var t = localStorage["ANDUI_BIHU_LOGININFO"];
                                var e = JSON.parse(t);
                                var userId = e.userId;
                                var access = e.accessToken;
                                xmlhttp.onreadystatechange=function(){
                                    if (xmlhttp.readyState==4 && xmlhttp.status==200){
                                        callback.apply(this, [xmlhttp.responseText]);
                                    }
                                }
                                xmlhttp.open("POST","https://be02.bihu.com/bihube-pc/api/content/show/getFollowArtList",true);
                                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded;charset=utf-8");
                                var param = 'userId='+userId+'&accessToken='+access;
                                xmlhttp.send(param);
                            }
                            getList(log);
                        }
                    }

                    info += ", 点赞人数：" + zanNum;
                    info += ", 自动点赞：" + clickZan;

                    return {info: info, clicked: clickZan};
                },username);

                if(data.clicked){
                    fs.appendFileSync('zanlog.txt', data.info + "\n");
                }
                console.log(data.info);
            }catch(e){
                console.log('出错了， 重新登录');
                await page.goto('https://bihu.com/login', {waitUntil: 'networkidle2'});
                await page.reload({waitUntil: 'networkidle2'});
                await page.waitFor(60*1000);
                const isLogin = await page.evaluate(()=>{
                    var loginHeader = document.querySelector('.login-header');
                    if(loginHeader){
                        return true;
                    }

                    return false;
                });
                if( isLogin){
                    console.log('在登录页，重新登录');
                    await page.click(loginUser);
                    await page.type(loginUser, username);
                    await page.click(loginPassword);
                    await page.type(loginPassword, password);
                    await page.click(loginButton);
                    var unLogin = true;
                    var loginTry = 0;
                    while(unLogin && loginTry < 50){
                    	console.log("重试登录：" + loginTry);
                        const logined = await page.evaluate(()=>{
                            var loginHeader = document.querySelector('.login-header');
                            if(loginHeader){
                                return true;
                            }
                            return false;
                        });

                    	unLogin = logined;
                    	loginTry++;
                    	if(unLogin){
                            await page.goto('https://bihu.com/login', {waitUntil: 'networkidle2'});
                            await page.waitFor(60*1000);
                            await page.click(loginUser);
                            await page.type(loginUser, username);
                            await page.click(loginPassword);
                            await page.type(loginPassword, password);
                            await page.click(loginButton);
                            await page.waitFor(1000);
						}
					}
                    await page.waitForSelector('.alt-item');
                }
            }
            // 等待1分钟
            await page.waitFor(120*1000);
		}else {

        	// 每隔10分钟刷新下
            await page.waitFor(600*1000);
            await page.goto('https://bihu.com/', {waitUntil: 'networkidle2'});
		}


    }
})();

