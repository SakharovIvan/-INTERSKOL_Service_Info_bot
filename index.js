const TelegramAPI = require('node-telegram-bot-api')
const token = '6898283747:AAFJIfz8RcsIvr0J8zY2G78cGnMbvbEjFAo'
const bot = new TelegramAPI(token,{polling:true})
const findMatNoSP = require ('./sp_find')

const replaceAll=(str, find, replace)=>{
    return str.replace(new RegExp(find, 'g'), replace);
  }

  chats = {}
const spCheck = async(chatID, text)=>{

 try{
    const info = await findMatNoSP(text)
    const spToolsInfo = await replaceAll(info['tools'],',','\n')
    const spMessage =await `${info['sp']}\n${info['name']}\nСписок инструментов:\n${spToolsInfo}`
    console.log('Вышлти из спчека спчек')
    return await bot.sendMessage(chatID,await spMessage)
 }catch(err){
    console.log(err)
 }

}

const start = async () => {
  bot.setMyCommands([
    { command: "/start", description: "Начальное приветствие" },
    { command: "/info", description: "Информация о клиенте" },
    // {command: '/tool_info', description: 'Информация об инструменте'},
    { command: "/sp_info", description: "Поиск инструмента по запчасти" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatID = msg.chat.id;
    try {
      if (text === "/start") {
        await bot.sendPhoto(chatID, "./INTERSKOL_logo.jpg");
        await bot.sendMessage(
          chatID,
          `Добро пожаловать в телграм бот по информационной системе ИНТЕРСКОЛ`
        );
        return;
      }
      if (text === "/info") {
        return bot.sendMessage(
          chatID,
          `Для поиска применимости запчасти введите команду \`/sp_info\` и введите артикул ЗЧ\n
        Для поиска вхем инструмента введите команду \`/tool_info\` и введите код инструмента - первые числа до точки в серийном номере нструмента или артикула с коробки инструмента`
        );
      }
      if (text === "/sp_info") {
        bot.sendMessage(chatID, `Введите артикул запчасти`)
        return spCheck()
      }
      return await bot.sendMessage(chatID, spCheck(chatID,text));
    } catch (err) {
      console.log(err);
    }
  });


};

start()

