const TelegramAPI = require('node-telegram-bot-api')
const {token} = require("./db.js")
const bot = new TelegramAPI(token,{polling:true})
const logADD = require('./log/log_add.js')
const fs = require("file-system");
const { toolFilter, findMatNoSP, findSPbyChar} = require('./SQLtablefilters.js')
const {toolspcardsupload} = require('./updatedata/toolspcardsupload.js')
const logo = './data/INTERSKOL_logo.jpg'
const {update_sp_data} = require('./updatedata/file_bd.js')
const {warehouseDataAddtoSQL} = require('./updatedata/spwarehouse.js')
const {write_files_to_SQL}=require('./updatedata/tool_cards_sql.js')

const pathSP_tools='./data/pathSP_tools.txt'
const pathSP_warehouse='./data/pathSP_warehouse.txt'

const WAY2 = /.+\(/;
const CODEDEL = /\)/;

const spCheck = async(chatID, text)=>{

 try{
    const info = await findMatNoSP(text)
    let toolsInlineKeyboar = []
    const spToolsArray = await info['tools'].split(',')
    for (let toolArr of spToolsArray){
      let toolNumber = await toolArr.replace(WAY2, "").replace(CODEDEL, "")
      toolsInlineKeyboar.push([{text: toolArr, callback_data: toolNumber}])
    }
    const spMessage = await `${info['sp']}\n${info['name']}\n${info['characteristics']}\nСклад '${info['warehouse']}' \nОбновление от ${ info['warehousedateupdate']}`
    await bot.sendMessage(chatID,`Вот что нашел:\n${spMessage}`)
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
    bot.sendMessage(chatID,`Вот что нашел:`)
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
  console.log("start");
  bot.setMyCommands([
    { command: "/start", description: "Начальное приветствие" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatID = msg.chat.id;
    const username = msg.from.username;
    const time = msg.date;
    try {
      await logADD(chatID, username, text, time);
      switch (text) {
        
        case "/start":
          const INterlogo = fs.readFileSync(logo);
          await bot.sendPhoto(chatID, INterlogo);
          await bot.sendMessage(
            chatID,
            `Добро пожаловать в телграм бот по информационной системе ИНТЕРСКОЛ\nДля поиска применимости запчасти введите артикул ЗЧ\nДля поиска схем инструмента введите код инструмента - первые числа до точки в серийном номере инструмента или артикула с коробки инструмента`
          );
          break;

        case "/updatewarehouse":
          console.log("прошли проверка");
          try {
            await warehouseDataAddtoSQL();
            await bot.sendMessage(chatID, "Данные по скаду обновлены");
          } catch (err) {
            console.log(err);
            await bot.sendMessage(chatID, "Произошла ошибка", err);
          }
          break;

        case "/updatedata":
          console.log("прошли проверка");
          try {
            await update_sp_data();
            await bot.sendMessage(chatID, "Данные по привязкам ЗЧ к инстурменту обновлены");
            await write_files_to_SQL();
            await bot.sendMessage(chatID, "Данные по взрывсхемам обновлены");
          } catch (err) {
            console.log(err);
            await bot.sendMessage(chatID, "Произошла ошибка", err);
          }
          break;

        default:
          spCheck(chatID, text);
      }
      if (msg.document !== undefined) {
        console.log("пройдена проверка на документ");

        if (msg.document.file_name === "uploadtoolspcards.txt") {
          try {
            await bot.sendMessage(chatID, "Началась загрузка файоа файла со списокм ЗЧ с инструментом");
            const thumbPath = await bot.getFileLink(msg.document.file_id);
            await bot.sendMessage(chatID, thumbPath);
            await toolspcardsupload(thumbPath, pathSP_tools);
            await bot.sendMessage(chatID, "Файл загружен успешно");
          } catch (err) {
            await bot.sendMessage(chatID, "Произошла ошибка", err);
            console.log(err);
          }
        }
        if (msg.document.file_name === "spwarehouse.txt") {
          try {
            await bot.sendMessage(chatID, "Началась загрузка файоа файла со складом ЗЧ");
            const thumbPath = await bot.getFileLink(msg.document.file_id);
            await bot.sendMessage(chatID, thumbPath);
            await toolspcardsupload(thumbPath, pathSP_warehouse);
            await bot.sendMessage(chatID, "Файл загружен успешно");
          } catch (err) {
            await bot.sendMessage(chatID, "Произошла ошибка", err);
            console.log(err);
          }
        }
      }

      return; 
    } catch (err) {
      console.log("проблема с обработкой сообщения", err, msg);
    }
  });

  bot.on("callback_query", async (msg) => {
    const toolCode = msg.data;
    const chatID = msg.message.chat.id;
    return spCheck(chatID, toolCode);
  });

  return;
};

start();

