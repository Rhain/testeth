
const puppeteer = require('puppeteer');
const fs = require('fs');
const username = "xxxx";
const password = 'xxxx';

(async () => {
    const browser = await puppeteer.launch({headless: true});
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
        await page.goto('https://bihu.com/?category=follow');
        await page.waitForSelector('.alt-item');
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

            var info = myDate + "，用户：" + user + ",文章：" + title + ", 时间：" + p + ", 是否点过赞：" + clickZan;

            if(clickZan){
                return {info: info};
            }

            if(p.indexOf('秒') >= 0){
                zan.click();
                clickZan = true;
            }

            var index = p.indexOf('分钟');
            // 只点赞30分钟内的文章
            if(index >= 0 && !clickZan){
                var min = p.substring(0, index);
                if(parseInt(min) < 30){
                    zan.click();
                    clickZan = true;
                }
            }
            info += ", 自动点赞：" + clickZan;

            return {info: info, clicked: clickZan};
        },username);

        if(data.clicked){
            fs.appendFileSync('zanlog.txt', data.info + "\n");
        }
        console.log(data.info);

        await page.waitFor(60*1000);
    }
})();


