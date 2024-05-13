const TelegramAPI = require('node-telegram-bot-api')
const token = '6898283747:AAFJIfz8RcsIvr0J8zY2G78cGnMbvbEjFAo'
const bot = new TelegramAPI(token,{polling:true})
const findMatNoSP = require ('./sp_find')
const logADD = require('./log/log_add.js')
const toolFilter = require('./tool_find.js')
const fs = require("file-system");

const WAY2 = /.+\(/;
const CODEDEL = /\).+/;


const spCheck = async(chatID, text)=>{

 try{
    const info = await findMatNoSP(text)

    let toolsInlineKeyboar = []
    const spToolsArray = await info['tools'].split(',')
    for (let toolArr of spToolsArray){
      let toolNumber = await toolArr.replace(WAY2, "").replace(CODEDEL, "")
      toolsInlineKeyboar.push([{text: toolArr, callback_data: toolNumber}])
    }
    const spMessage = await `${info['sp']}\n${info['name']}\n`//Список инструментов:\n${spToolsInfo}
    await bot.sendMessage(chatID,`ВОт что нашел:\n${spMessage}`)
    await bot.sendMessage(chatID, 'Вы можете выбрать инструмент',{
      reply_markup: {
        inline_keyboard: toolsInlineKeyboar
      }
    })
    return 
 }catch(err){
    console.log('ПРоблема с поиском ЗЧ ',err)
 }

 try{
  const info = await toolFilter(text)
  for (let el of info){
    bot.sendMessage(chatID,`ВОт что нашел:`)
    await bot.sendMessage(chatID, el['toolname'])
    await bot.sendDocument(chatID, el['toolschemedir'])
  }
return
}catch(err){
  console.log('ПРоблема с поиском инструмента ',err)
}
return bot.sendMessage(chatID,`Такого я не нашел(((`)
}

const start = async () => {
    console.log('start start')
  bot.setMyCommands([
    { command: "/start", description: "Начальное приветствие" },
    { command: "/info", description: "Информация о клиенте" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatID = msg.chat.id;
    const username = msg.from.username
    const time = msg.date    
    try {
      logADD(chatID,username,text,time)
      if (text === "/start") {
        const INterlogo =  fs.readFileSync("./INTERSKOL_logo.jpg")
        await bot.sendPhoto(chatID, INterlogo);
        await bot.sendMessage(
          chatID,
          `Добро пожаловать в телграм бот по информационной системе ИНТЕРСКОЛ`
        );
        return;
      }
      if (text === "/info") {
        return bot.sendMessage(
          chatID,
          `Для поиска применимости запчасти введите артикул ЗЧ\n
        Для поиска схем инструмента введите код инструмента - первые числа до точки в серийном номере нструмента или артикула с коробки инструмента`
        );
      }

      return spCheck(chatID,text)
    } catch (err) {
      console.log('проблема с обработкой сообщения',err,msg);
    }
  }

  );

  bot.on('callback_query', async msg=> {
    const toolCode = msg.data;
    const chatID = msg.message.chat.id;

    return spCheck(chatID, toolCode)
  });
  

return 
};

start()

