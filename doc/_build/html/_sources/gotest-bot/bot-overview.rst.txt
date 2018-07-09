.. _bot-overview:


نوبت دهی از طریق ربات
===================

.. image:: static/img/a1649c56fa9f805828.gif


نوبت دهی از طریق ربات چگونه است ؟
--------------------------------

به `این <https://telegram.me/GoQueue_bot/>`_ رفته

ابتدا start را میزنیم

سپس ابندا `شماره من را بفرست` را انتخاب میکنیم

بعد `بانک` را انتخاب میکنیم

و بعد از مشاهده لیست بانک ها `نوبت` را انتخاب میکنیم و بانک مورد نظر را انتخاب میکنیم

همچنین از بخش `نوبت من` نوبت گرفته شده قابل پیگیری است

بخش `موقعیت من` صورت آزمایشی وجود دارد و هیچ کار بخصوصی صورت نمیپذیرد

بررسی کد 
--------

برای لاگ های رنگی فایل زیر را در کد اصلی فراخوانی میکنیم

Colorer.py
~~~~~~~~~~~

.. code-block:: golang

    #!/usr/bin/env python
    # encoding: utf-8
    import logging
    # now we patch Python code to add color support to logging.StreamHandler
    def add_coloring_to_emit_windows(fn):
            # add methods we need to the class
        def _out_handle(self):
            import ctypes
            return ctypes.windll.kernel32.GetStdHandle(self.STD_OUTPUT_HANDLE)
        out_handle = property(_out_handle)

        def _set_color(self, code):
            import ctypes
            # Constants from the Windows API
            self.STD_OUTPUT_HANDLE = -11
            hdl = ctypes.windll.kernel32.GetStdHandle(self.STD_OUTPUT_HANDLE)
            ctypes.windll.kernel32.SetConsoleTextAttribute(hdl, code)

        setattr(logging.StreamHandler, '_set_color', _set_color)

        def new(*args):
            FOREGROUND_BLUE      = 0x0001 # text color contains blue.
            FOREGROUND_GREEN     = 0x0002 # text color contains green.
            FOREGROUND_RED       = 0x0004 # text color contains red.
            FOREGROUND_INTENSITY = 0x0008 # text color is intensified.
            FOREGROUND_WHITE     = FOREGROUND_BLUE|FOREGROUND_GREEN |FOREGROUND_RED
        # winbase.h
            STD_INPUT_HANDLE = -10
            STD_OUTPUT_HANDLE = -11
            STD_ERROR_HANDLE = -12

            # wincon.h
            FOREGROUND_BLACK     = 0x0000
            FOREGROUND_BLUE      = 0x0001
            FOREGROUND_GREEN     = 0x0002
            FOREGROUND_CYAN      = 0x0003
            FOREGROUND_RED       = 0x0004
            FOREGROUND_MAGENTA   = 0x0005
            FOREGROUND_YELLOW    = 0x0006
            FOREGROUND_GREY      = 0x0007
            FOREGROUND_INTENSITY = 0x0008 # foreground color is intensified.

            BACKGROUND_BLACK     = 0x0000
            BACKGROUND_BLUE      = 0x0010
            BACKGROUND_GREEN     = 0x0020
            BACKGROUND_CYAN      = 0x0030
            BACKGROUND_RED       = 0x0040
            BACKGROUND_MAGENTA   = 0x0050
            BACKGROUND_YELLOW    = 0x0060
            BACKGROUND_GREY      = 0x0070
            BACKGROUND_INTENSITY = 0x0080 # background color is intensified.     

            levelno = args[1].levelno
            if(levelno>=50):
                color = BACKGROUND_YELLOW | FOREGROUND_RED | FOREGROUND_INTENSITY | BACKGROUND_INTENSITY 
            elif(levelno>=40):
                color = FOREGROUND_RED | FOREGROUND_INTENSITY
            elif(levelno>=30):
                color = FOREGROUND_YELLOW | FOREGROUND_INTENSITY
            elif(levelno>=20):
                color = FOREGROUND_GREEN
            elif(levelno>=10):
                color = FOREGROUND_MAGENTA
            else:
                color =  FOREGROUND_WHITE
            args[0]._set_color(color)

            ret = fn(*args)
            args[0]._set_color( FOREGROUND_WHITE )
            #print "after"
            return ret
        return new

    def add_coloring_to_emit_ansi(fn):
        # add methods we need to the class
        def new(*args):
            levelno = args[1].levelno
            if(levelno>=50):
                color = '\x1b[31m' # red
            elif(levelno>=40):
                color = '\x1b[31m' # red
            elif(levelno>=30):
                color = '\x1b[33m' # yellow
            elif(levelno>=20):
                color = '\x1b[32m' # green 
            elif(levelno>=10):
                color = '\x1b[35m' # pink
            else:
                color = '\x1b[0m' # normal
            args[1].msg = color + args[1].msg +  '\x1b[0m'  # normal
            #print "after"
            return fn(*args)
        return new

    import platform
    if platform.system()=='Windows':
        # Windows does not support ANSI escapes and we are using API calls to set the console color
        logging.StreamHandler.emit = add_coloring_to_emit_windows(logging.StreamHandler.emit)
    else:
        # all non-Windows platforms are supporting ANSI escapes so we use them
        logging.StreamHandler.emit = add_coloring_to_emit_ansi(logging.StreamHandler.emit)
        #log = logging.getLogger()
        #log.addFilter(log_filter())
        #//hdlr = logging.StreamHandler()
        #//hdlr.setFormatter(formatter())

 نحوه فراخوانی فایل اصلی بات در بخش راه اندازی آورده شده است

telegrambot.py
~~~~~~~~~~~~~~

ابتدا فایل

.. code-block:: golang

    #!/usr/bin/env python
    # -*- coding: utf-8 -*-

کتابخوانه های فراخوانی شده

.. code-block:: golang

    from telegram import ReplyKeyboardMarkup
    import telegram
    from telegram.ext import Updater, CommandHandler, MessageHandler, Filters
    import logging
    import Colorer
    import json
    import requests
    import re
    from validate_email import validate_email

موارد مشترک در سطح برنامه

.. code-block:: python 

    # Enable logging
    # فعال سازی لاگ در پروژه با این فرمت
    logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                        level=logging.INFO)

    logger = logging.getLogger(__name__)

    # موارد مربوط به ساخت کیبورد مجازی
    CHOOSING, TYPING_REPLY, TYPING_CHOICE = range(3)
    location_keyboard = telegram.KeyboardButton(text="موقعیت من را بفرست", request_location=True)
    contact_keyboard = telegram.KeyboardButton(text="شماره من را بفرست", request_contact=True)
    reply_keyboard = [['🎫 نوبت', '🏦 بانک'],
                    [location_keyboard, contact_keyboard],
                    ['🙂 نوبت من'],
                    ['🚪 انصراف']]
    # توسط این متغیر در کل برنامه کیبود را صدا میزنیم
    markup = ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True)

    getq = False
    banks=""
    name = ""
    reply_markup=""
    chat_id = ""



تابع start در صورتی بات start شده  بود اجرا میشود

.. code-block:: python

    # Define a few command handlers. These usually take the two arguments bot and
    # update. Error handlers also receive the raised TelegramError object in error.
    def start(bot, update):
        global name,chat_id
        chat_id = update.message.chat_id
        #bot.send_message(chat_id=chat_id, 
        #             text="*bold* _italic_ `fixed width font` [link](http://google.com).", 
        #              parse_mode=telegram.ParseMode.MARKDOWN)
        name = str(update.message.from_user.first_name.encode("utf-8"))
        # لاگ حاوی کد چت با کاربر و اسم او
        logger.info("Start With: ["+str(name)+"] and With Chat Id: ["+ str(chat_id)+"]")
        # ارسال پیام برا کاربر با نام خود و نشان دادن کیبود مجازی به او
        update.message.reply_text(
            "سلام "+name+""\
            "میتوانم کمکتان کنم\n"\
            "لطفا ابتدا شماره خود را بفرستید",
            reply_markup=markup)



تابعی برای نوبت گیری، مدیریت نوبت، نمایش بانک ها 

.. code-block:: golang

    ## branch code should not be static
    def echo(bot, update):

        global getq,banks,reply_markup,reply_markup1,reply_markup2
        
        try:
            # کاربر در هر صورت اگر برگشت را انتخاب کنید کیبورد اصلی برنامه به نشان داده میشود
            if update.message.text == "▶ برگشت".decode('utf-8'):
                reply_markup = telegram.ReplyKeyboardRemove(reply_markup)
                bot.send_message(chat_id=chat_id, text="برگشت به صفحه اصلی", reply_markup=markup)


            # اگر کاربر نوبت من را انتخاب کرده بود
            # show my turn number
            msg = getBank()
            ## api for get tbl_turn_number !!!!
            if  update.message.text == '🙂 نوبت من'.decode('utf-8'):
            # اگر شماره تلفن خود را نفرستاده بود
                if number == "":
                    # کیبورد اصلی برای ارسال شماره تلفن نشان داده میشود
                    update.message.reply_text(
                    "لطفا ابتدا شماره خود را بفرستید",
                    reply_markup=markup)
                    start(bot,update)
                else:
                    banks = ""
                    # لیست تمامی کاربران
                    data = getUser()
                    try:
                        for item in data:
                            # اگر شماره گرفته شده از کاربر با شماره تلفن داخل پایگاه داده یکسان بود فرآیند نوبت گیری انجام شود
                            if item['phone_number']==number:
                                # دریافت کد کاربری همان کاربر
                                userID = item['user_id']
                                #  نوبت آن فرد
                                userTurnNumber = item['turn_number'] 
                        # دریافت کد بانکی که کاربر از آن نوبت گرفته است
                        showq = getQueue(userID)
                        # جداکردن مقدار
                        bankID = showq[0]['bank_id']
                        for itemm in msg:
                            # اگر کد بانک با کد های بانکی موجود همخوانی داشت تعداد افراد فعال داخل صف دریافت شود
                            if itemm['bank_id'] == bankID:
                                bankActiveQueue = itemm['active_turns_number']
                        # نوبت فرد حاصل از نوبت فرد - تعداد افراد فعال داخل صف است
                        res = (int(userTurnNumber))-(int(bankActiveQueue))
                        banks =banks+"\nنوبت: ".decode('utf-8')+ userTurnNumber+"\nمانده: ".decode('utf-8')+ str(res) +"\n=-=-=-=-=-=-=-=-=-=-" 
                        نمایش تعداد افراد باقیمانده به او
                        update.message.reply_text(banks)
                    except:
                        # خطا در مراحل شاید به دلیل نفرستادن شماره توسط بات باشد
                        logging.error("My Queue Error")
                        update.message.reply_text("لطفا شماره خود را بفرستید")

            flag = False
            # اگر کاربر نوبت من را انتخاب کرده بود
            # برای دریافت نوبت داخل این شرط میشویم
            if  update.message.text == '🎫 نوبت'.decode('utf-8'):
                # اگر شماره فرستاده نشده بود پیام زیر چاپ میشود
                if number == "":
                    update.message.reply_text(
                    "لطفا ابتدا شماره خود را بفرستید",
                    reply_markup=markup)
                    start(bot,update)
                else:
                    banks = ""
                    data = getUser()
                    for i in data:
                        ## TODO must be checked
                        try:
                            # اگر شماره تلفن فرد در سیستم موجود بود
                            if i['phone_number']==number:
                                logging.error("User Sign in")
                                flag = True
                                break

                        except Exception as es:
                            logging.error("Queue")
                            update.message.reply_text(
                            "لطفا ابتدا شماره خود را بفرستید",
                            reply_markup=markup)
                            break
                            #update.message.reply_text(str(es))
                    if not flag:
                    در انتها اگر کاربر در سیستم ثبت نام نکرده بود برای ثبت نام به تابع user_register() فرستاده میشود
                        logging.error("Not Register User ["+name+"] ["+str(number)+"]")
                        user_register(name,number)
                        flag = False

                    custom_keyboard = [['▶ برگشت']]
                    getq = True
                    # create string with bank information
                    # ساخت کیبورد مجازی با لیست بانک ها 
                    for item in msg:
                        # تعداد افراد فعال در صف
                        qu = int(item['turns_number'])-int(item['active_turns_number'])
                        banks =banks+"\nشماره: ".decode('utf-8')+ item['bank_id']+"\nبانک: ".decode('utf-8')+ item['name'] +"\nشعبه: ".decode('utf-8')+ item['branch'] \
                        +"\nتعداد افراد داخل صف: ".decode('utf-8')+ str(qu) +"\n=-=-=-=-=-=-=-=-=-=-" 
                        key = item['bank_id'] + " : " + item['name'] + " - شعبه ".decode("utf-8") + item['branch'] + " 👉".decode("utf-8")
                        custom_keyboard.append([key])
                    # نمایش کیبورد مجازی به کاربر
                    reply_markup = telegram.ReplyKeyboardMarkup(custom_keyboard)
                    bot.send_message(chat_id=chat_id, 
                            text="لطفا با توجه به موارد زیر بانک خود را انتخاب کنید", 
                            reply_markup=reply_markup)
                    # انتخاب بانک مورد نظر از لیست مجازی ساخته شده
                    update.message.reply_text(banks+"\nلطفا شماره بانک مورد نظر را نتخاب کنید".decode('utf-8'))


            # Get Queue
            f  = False
            # با این شرط فرآیند نوبت گیری آغاز میشود
            # شرط شامل این است که ابتدا  پیام فرستاده شده از طرف کاربر شامل این  مقدار 👉  باشد
            # از طرفی چون لیست بانک هایی که کاربر انتخاب میکند ابتدای همگی دارای همام مقدار بالا می باشد
            if checkDash(update.message.text):
                if number == "":
                    update.message.reply_text(
                    "لطفا ابتدا شماره خود را بفرستید",
                    reply_markup=markup)
                    start(bot,update)
                else:
                    # جدا سازی کد بانک از پیام ارسالی
                    first = update.message.text.split(":",1)
                    bankID = first[0]
                    data = getUser()
                    try:
                        for d in data:
                            # احراز هویت کاربر با چک کردن شماره تلفن کاربر و موجود بودن آن در پایگاه داده
                            if d['phone_number'] == number:
                                # جداسازی کد کاربری فرد
                                userID = d['user_id']
                                # ثبت نوبت با کد بانک و کد کاربری فرد
                                queue(bankID,userID)
                                update.message.reply_text("با موفقیت ثبت شد از بخش نوبت من پیگیری کنید")
                                f = True
                        if not f:
                            update.message.reply_text("لطفا شماره خود را بفرستید")
                    except:
                            logging.error("Add Queue Error")
                            update.message.reply_text("خطا")

            # اگر کاربر بانک را انتخاب کرده بود
            if  update.message.text == '🏦 بانک'.decode('utf-8'):
                banks = ""
                for item in msg:
                    # ساخت رشته شامل شعبه بانک کد بانک نام بانک تعداد افراد فعال داخل صف
                    qu = int(item['turns_number'])- int(item['active_turns_number'])
                    banks =banks+"\nبانک: ".decode('utf-8')+ item['name'] +"\nشعبه: ".decode('utf-8')+ item['branch']\
                    +"\nکد شعبه: ".decode('utf-8')+ item['code'] +"\nآدرس: ".decode('utf-8')+ item['address'] +"\nتعداد افراد داخل صف: ".decode('utf-8')+ str(qu)+"\n=-=-=-=-=-=-=-=-=-=-" 
                # نمایش تمامی بانک ها 
                # نمایش رشته شامل موارد مربوط به بانک 
                update.message.reply_text(banks)
        except :
            logger.error("No Connect to Server")
            update.message.reply_text("ارتباط قطع است")


 تابعی برای بررسی پیام کاربر که در نوبت گیری استفاده میشود

.. code-block:: python
    def checkDash(val):
        return bool(val.endswith(" 👉".decode("utf-8")))


تابعی برای ثبت نام کاربر که توسط نام و شماره تلفن ثبت نام صورت میگیرد

.. code-block:: python

   def user_register(name,number):
        # آدرس سرور بخش users برای ثبت نام که حتما باید از نوع post باشد
        r = requests.post('http://localhost:8088/users', json={\
            "name": str(name),
            "status":0,
            "phone_number":str(number),
            "turn_number":"0",
            "password":str(number),
            "email":str("email@bot.com")
            })
        if r:
            return True
            # اگر درست بود لاگی حاوی اسم کاربر و شماره فرد چاپ شود
            logger.info("User Register: ["+str(name)+"] and ["+str(number)+"]")
        else:
            return False
            logger.error("User Not Register: ["+str(name)+"] and ["+str(number)+"]")



تابعی نوبت گیری که توسط کد کاربر و کد بانک صورت میگیرد

.. code-block:: python

    # Add to Queue
    def queue(bank_id,user_id):
        # آدرس سرور بخش addqueue برای نوبت گیری که حتما باید از نوع post باشد
        r = requests.post("http://localhost:8088/addqueue/"+bank_id+"/"+user_id)
        # در این برنامه هر پاسخی از سرور داخل متغیر data قرار میگیرد
        data = r.json()
        # اگر درست بود لاگی کد کاربر و کد بانک چاپ شود
        logging.info("Success Add to Queue-Bank Id: "+bank_id+" User Id: "+user_id)
        return "ثبت شد"


تابعی برای لیست همه ی افراد

.. code-block:: python

    def getUser():
        r = requests.get("http://localhost:8088/users")
        data = r.json()
        return data

تابعی برای لیست همه ی بانک ها

.. code-block:: python

    def getBank():
        r = requests.get("http://localhost:8088/banks")
        data = r.json()
        return data

تابعی برای دریافت نوبت کاربر 

.. code-block:: python

    # Show My Turn number
    def getQueue(userId):
        r = requests.get("http://localhost:8088/queue/"+userId)
        data = r.json()
        return data
    
تابعی نمونه برای چگونگی کار با موقعیت مکانی

.. code-block:: python

    def saveLocation(bot, update):
        global location
        # ساخت آرایه برای قرار طول و عرض در یک آرایه
        location = [[]]
        #logger.warn('Update "%s" caused error "%s"' % (update, error))
        # دریافت عرض جغرافیایی 
        loc_x = update.message.location['latitude']
         # دریافت طول جغرافیایی 
        loc_y = update.message.location['longitude']
        # اضافه کردن به آرایه
        location.append(loc_x)
        location.append(loc_y)
        # لاگ حاوی طول و عرض چاپ شود
        logging.info("SaveLocation: "+str(loc_x)+" , "+str(loc_y))
    
تابعی برای دریافت شماره تلفن کاربر

.. code-block:: python

    def saveNumber(bot, update):
        global number
        #logger.warn('Update "%s" caused error "%s"' % (update, error))
        # با این دستور شماره تلفن کاربر گرفته میشود
        number =  update.message.contact['phone_number']
        # لاگی حاوی شماره تلفن کاربر
        logging.info("SaveNumber: "+number)


برای نمایش هشدار و خطا در برنامه 

.. code-block:: python

    def error(bot, update, error):
        logger.warn('Update "%s" caused error "%s"' % (update, error))

تابع اصلی برنامه

.. code-block:: python


    def main():
        # Create the EventHandler and pass it your bot's token.
        updater = Updater("396578852:AAH5omKp0GdAqRx-xZDeCz-5DJezldkTjdQ")

        # Get the dispatcher to register handlers
        dp = updater.dispatcher

        # on different commands - answer in Telegram
        # در صورتی که start زده شود به تابع start فراخونده میشود
        dp.add_handler(CommandHandler("start", start))

        # on noncommand i.e message - echo the message on Telegram
        # هر پیامی که به سیستم فرستاده شود به تابع echo فرستاده میشود
        dp.add_handler(MessageHandler(Filters.text, echo))
        # on Location and Phone number i.e message - echo the message on Telegram
        # در صورتی کاربر موقعیت من را بفرست را انتخاب کرده باشد
        dp.add_handler(MessageHandler(Filters.location, saveLocation))
        # در صورتی کاربر شماره من را بفرست را انتخاب کرده باشد
        dp.add_handler(MessageHandler(Filters.contact, saveNumber))


        # ارسال تمامی خطا ها به تابع erro
        # log all errors
        dp.add_error_handler(error)

        # بات روشن میشود
        # Start the Bot
        updater.start_polling()

        # Run the bot until you press Ctrl-C or the process receives SIGINT,
        # SIGTERM or SIGABRT. This should be used most of the time, since
        # start_polling() is non-blocking and will stop the bot gracefully.
        #  بات منتظر دستورات و برای متوفق سازی باید چند باز کلید های ترکیبی Ctrl + c را بزنیم
        updater.idle()

    # کامپایلر اگر برنامه به صورت مستقل اجرا شده باشد تابع main را صدا میزند
    if __name__ == '__main__':
        main()