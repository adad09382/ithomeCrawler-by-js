# IT 邦幫忙簡易爬蟲機器人 (ithomeCrawler)

## 目錄

- [背景](#背景)
- [使用方法](#使用方法)
- [使用效果](#使用效果)

## 背景

作者在 IT 邦幫忙無聊看大家技術文章找靈感時，發現每頁約只能呈現 30 篇文章，若頁面沒有有興趣的題目時，很快就需要換下一頁，而換頁需要 1-2 秒左右的等待時間，雖然等待時間不長，但總有點煩躁感。

所以想到用爬蟲方式把每頁每篇文章標題 + 文章連結爬到 Excel 中，這樣即可達到快速瀏覽的效果

## 使用方法

1. 使用 NPM 安裝所需的套件

```sh
$npm install
```

2. 設定.env 中的 EXECUTABLE_PATH，將你的 Google 路徑設定到.env 中的 EXECUTABLE_PATH 中

```sh
 EXECUTABLE_PATH = "YOUR GOOGLE CHROME PATH"
```

    範例：

```sh
EXECUTABLE_PATH = C:\Program Files (x86)\Google\Chrome\Application\chrome.exe
```

3. 設定要爬的起始頁，結束頁，生成的 Excel 名稱 (請參考 Code 中的備註自行修改)

4. 運行程式

```sh
$node ithomeCrawler.js
```

## 使用效果

執行程式後會開啟一個新的 Google Chrome 視窗，並一頁一頁爬下文章 Tittle + Link

![img](https://github.com/adad09382/ithomeCrawler-by-js-/blob/master/README-coderunning.gif)

執行程式完畢後會生成 Excel 檔，裡面儲存剛扒下來的文章 Tittle + Link  
![img](https://github.com/adad09382/ithomeCrawler-by-js-/blob/master/README-excel.gif)
