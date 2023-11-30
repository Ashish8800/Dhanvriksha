const puppeteer = require("puppeteer"),
  hbs = require("handlebars"),
  fs = require("fs-extra"),
  path = require("path");

async function generatePdf(template, pdf, data) {
  try {
    const browser = await puppeteer.launch({ headless: "new" }),
      page = await browser.newPage(),
      html = await fs.readFile(
        path.join(process.cwd(), "/assets/", `${template}.hbs`),
        "utf-8"
      ),
      pageContent = hbs.compile(html)(data);
    console.log(data, "compile data");

    pdf = path.join(process.cwd(), `/${pdf}.pdf`);

    await page.setContent(pageContent);

    const generatedPdf = await page.pdf({
      path: pdf,
      format: "A4",
      printBackground: true,
      margin: {
        top: "50px",
        bottom: "50px",
        right: "0",
        left: "0",
      },
    });

    await browser.close();

    const buffer = Buffer.from(generatedPdf),
      base64 = buffer.toString("base64"),
      base64Url = buffer.toString("base64url");

    return {
      pdf,
      buffer: generatedPdf,
      base64,
      base64Url,
    };
  } catch (e) {
    console.log(e.message);
    return false;
  }
}

module.exports = {
  generatePdf,
};
