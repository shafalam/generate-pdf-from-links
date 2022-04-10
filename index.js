const puppeteer = require('puppeteer');

const url = 'https://akshay-iyangar.github.io/system-design/'

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: 'networkidle2',
  });

  const hrefs = await page.$$eval('a', links => 
    links.map(a => {
        const title = a.parentElement.textContent.replace(/[^\w\s]/gi, '_');

        return {
            title: title,
            href: a.href
        } 
    } )
  );

  let i = 1
  for(const link of hrefs){
    console.log(link)
    const newpage = await browser.newPage();
    await newpage.goto(link.href, {
        waitUntil: 'networkidle2',
    }); 
    await newpage.pdf({ path: `downloads/${i++}. ${link.title}.pdf`, format: 'a4' });
    await newpage.close()
  }

  await browser.close();
})();