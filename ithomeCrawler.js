import { config } from "dotenv";
import puppeteer from "puppeteer-core";
import xlsx from "xlsx";
import fs from "fs";

config();

const startPage = 1; // 指定要爬的起始頁數
const totalPages = 3; // 指定要爬的總頁數
const delayRange = { min: 3000, max: 5000 }; // 定義最小延遲和最大延遲的值

// 创建工作簿s
const workbook = xlsx.utils.book_new();

// 目標頁面 URL
const pageUrl = "https://ithelp.ithome.com.tw/articles?tab=tech&page=";

(async () => {
  // 使用自訂的 Chrome
  const browser = await puppeteer.launch({
    executablePath: process.env.EXECUTABLE_PATH,
    headless: false,
  });

  const page = await browser.newPage();

  for (let i = startPage; i <= totalPages; i++) {
    console.log(`目前爬到第 ${i} 頁`);

    // 隨機延遲
    const delay = getRandomDelay(delayRange.min, delayRange.max);
    await delayPromise(delay);

    // 隨機設置 User-Agent
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    const currentPageUrl = pageUrl + i;
    await page.goto(currentPageUrl);

    // 等待頁面載入完成
    await page.waitForSelector(".qa-list__title-link");

    // 爬取網頁並保存第 i 頁面的標題和連結
    const titles = await page.$$eval(".qa-list__title-link", (elements) =>
      elements.map((element) => element.textContent)
    );

    const links = await page.$$eval(".qa-list__title-link", (elements) =>
      elements.map((element) => element.href)
    );

    const data = titles.map((title, index) => [title, links[index]]);
    const sheetName = "Sheet" + i;
    const worksheet = xlsx.utils.aoa_to_sheet(data);
    xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
  }

  const excelFilePath = "output.xlsx";
  xlsx.writeFile(workbook, excelFilePath);

  console.log("Excel 文件已生成:", excelFilePath);

  // 關閉瀏覽器
  await browser.close();

  // 合併 Excel 工作表
  const mergedWorkbook = mergeSheetsData(excelFilePath);
  xlsx.writeFile(mergedWorkbook, excelFilePath);

  console.log("數據已歸納到 Excel 文件:", excelFilePath);
})();

// 隨機生成指定範圍内的延遲時間
function getRandomDelay(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// 定義延遲函數
function delayPromise(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

// 將多個 Excel 工作表合併為一個
function mergeSheetsData(excelFilePath) {
  const fileContent = fs.readFileSync(excelFilePath);
  const workbook = xlsx.read(fileContent, { type: "buffer" });
  const sheetNames = workbook.SheetNames;
  const mergedData = [];

  for (const sheetName of sheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
    mergedData.push(...jsonData);
  }

  const mergedWorksheet = xlsx.utils.aoa_to_sheet(mergedData);
  const mergedWorkbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(mergedWorkbook, mergedWorksheet, "Merged Sheet");

  return mergedWorkbook;
}
