const fs = require('fs-extra');
const path = require('path');

function convertChatToHTML(inputFile) {
  // Dosyayı oku
  const content = fs.readFileSync(inputFile, 'utf8');

  // Satırları ayır
  const messagePattern = /(\d{2}\.\d{2}\.\d{4} \d{2}:\d{2} - .*?(?=\d{2}\.\d{2}\.\d{4} \d{2}:\d{2} -|$))/gs;
  const messages = content.match(messagePattern);

  // Sender isimlerini tut
  const senders = [];

  // HTML oluştur
  let html = `<!DOCTYPE html>
<html>
<head>
  <title>WhatsApp Chat</title>
  <style>
   body {
  /*I ripped this image from the WhatsApp apk*/
  /*This is WhatsApp's official BK color*/
  background: #ECE5DD;
  font-family: "Helvetica Neue", Helvetica;
}

.container {
  width: 75%;
  margin: 0 auto;
}

.msg {
  width: 100%;
  height: auto;
  display: block;
  overflow: hidden;
}
.msg .bubble {
  float: left;
  max-width: 75%;
  width: auto;
  height: auto;
  display: block;
  background: #ebebeb;
  border-radius: 5px;
  position: relative;
  margin: 10px 0 3px 25px;
  box-shadow: 0px 2px 1px rgba(0, 0, 0, 0.2);
}
.msg .bubble.alt {
  margin: 10px 25px 3px 0px;
  background: #DCF8C6;
  float: right;
}
.msg .bubble.follow {
  margin: 2px 0 3px 25px;
}
.msg .bubble.altfollow {
  margin: 2px 25px 3px 0px;
  background: #DCF8C6;
  float: right;
}
.msg .bubble .txt {
  padding: 8px 0 8px 0;
  width: 100%;
}
.msg .bubble .txt .name {
  font-weight: 600;
  font-size: 14px;
  display: inline-table;
  padding: 0 0 0 15px;
  margin: 0 0 4px 0;
  color: #3498db;
}
.msg .bubble .txt .name span {
  font-weight: normal;
  color: #b3b3b3;
  overflow: hidden;
}
.msg .bubble .txt .name.alt {
  color: #2ecc51;
}
.msg .bubble .txt .message {
  font-size: 14px;
  font-weight: 500;
  padding: 0 15px 0 15px;
  margin: auto;
  color: #2b2b2b;
  display: table;
}
.msg .bubble .txt .timestamp {
  font-size: 11px;
  margin: auto;
  padding: 0 15px 0 0;
  display: table;
  float: right;
  position: relative;
  text-transform: uppercase;
  color: #999;
}
.msg .bubble .bubble-arrow {
  position: absolute;
  float: left;
  left: -11px;
  top: 0px;
}
.msg .bubble .bubble-arrow.alt {
  bottom: 20px;
  left: auto;
  right: 4px;
  float: right;
}
.msg .bubble .bubble-arrow:after {
  content: "";
  position: absolute;
  border-top: 15px solid #ebebeb;
  border-left: 15px solid transparent;
  border-radius: 4px 0 0 0px;
  width: 0;
  height: 0;
}
.msg .bubble .bubble-arrow.alt:after {
  border-top: 15px solid #DCF8C6;
  transform: scaleX(-1);
}

@media only screen and (max-width: 450px) {
  .container {
    width: 100%;
  }

  .timestamp {
    display: none;
    color: red;
  }
}
    img, video {
      max-width: 100%;
    }
  </style>
</head>
<body> <div class="container">`;
  // Her satırı işle
  messages.forEach(line => {

    const [dateTime, messageInfo] = line.split(' - ');
    const [sender, content] = messageInfo.split(': ');

    // Sender ismi dizisine ekle
    if (!senders.includes(sender)) {
      senders.push(sender);
    }

    // HTML öğeleri oluştur
    html += `
        <div class="msg">
            <div class="bubble ${senders.indexOf(sender) == 1 ? 'alt' : ''}">
                <div class="txt">
                    <span class="name  ${senders.indexOf(sender) === 1 ? 'alt' : ''}">${sender}</span>
                    <span class="timestamp">${dateTime.split(' ')[0]}</span>
                    <span class="message">
                 `;

    // Eğer resim veya video varsa, HTML öğesi ekle
    try {
      if (content.includes('.jpg') || content.includes('.png') || content.includes('.mp4')) {
        let regex = /\(dosya ekli\)|\(file attached\)/i;
        const fileName = content.split(regex)[0].trim();
        const fileExt = path.extname(fileName).slice(1);
        const filePath = path.join(path.dirname(inputFile), fileName);

        // Dosya yolundaki gizli karakterleri kaldır
        const filePathChars = filePath.split('');
        const visibleChars = filePathChars.filter(char => {
          const charCode = char.charCodeAt(0);
          return (charCode >= 33 && charCode <= 126);
        });
        const cleanFilePath = visibleChars.join('');

        const fileData = fs.readFileSync(cleanFilePath);
        const base64Data = fileData.toString('base64');
        const tag = fileExt === 'mp4' ? 'video' : 'img';
        html += `<${tag} src="data:${fileExt === 'mp4' ? 'video/mp4' : 'image/' + fileExt};base64,${base64Data}" />`;
      } else {
        html += content;
      }
    } catch (error) {
      //console.log(error);;
    }


    html += `</span>

                </div>
                <div class="bubble-arrow  ${senders.indexOf(sender) === 1 ? 'alt' : ''}"></div>
            </div>
</div>`;
  });

  html += '</div></body></html>';
  // HTML'yi dosyaya yaz
  const outputFile = path.join(path.dirname(inputFile), 'chat.html');
  fs.writeFileSync(outputFile, html);
  console.log(`HTML file created: ${outputFile}`);
}
// Argümanları al
const inputFile = process.argv.slice(2)[0];

if (inputFile) {
  convertChatToHTML(inputFile);
} else {
  console.error('Please specify an input file!');
}