.. _intro-benchmark:

سرعت سیستم چگونه است
===================

برنامه تست
~~~~~~~~~

با استفاده از برنامه زیر میتوان درج کاربری به صورت تصادفی در سیستم ایجاد کرد

.. code-block:: python 

    # -*- coding: utf-8 -*-
    import random
    import pickle
    import requests, json

    # تابعی برای ساخت نام و فامیلی تصادفی
    def name_family():
        foo = ['محمد','مراد','قلی','آرش','حمید','یاسر','مرصاد'\
        , 'رضا', 'تقی', 'محمد تقی','احمد','مریم','رضوان','روشنک','مرجان']
        secure_random = random.SystemRandom()
        return str(secure_random.choice(foo))
    # تابعی برای ساخت شماره تصادفی
    def number():
        # create the dict and save it to a file
        d={
        'part1':[
            '0912',
            '0921',
            '0935',
            '0938',],
        'part2':[
            str(random.randint(1111111,9999999))],
        }
        # نوشتن شماره در فایل 
        f=open('syllables','w')
        pickle.dump(d,f)
        f.close()

        # خواندن از فایل
        # read the dict back in from the file
        f1=open('syllables','r')
        sd=pickle.load(f1)
        f1.close()

        # رشته اول و دوم شماره تلفن
        first_part=sd['part1'][random.randint(0,len(sd['part1'])-1)]
        second_part=sd['part2'][random.randint(0,len(sd['part2'])-1)]

        #print '%s%s'%(first_part,second_part)
        # الحاق رشته اول و دوم شماره تلفن
        return (first_part+second_part)

    # تابعی برای ثبت کاربران
    def req(name,number):
        url = 'http://localhost:8088/users'
        # جایگذاری مقادیر با مقادیر تصادفی ساخته شده
        payload = {'name': name,'phone_number':number,'status':'0', "turn_number":"0","password":number,"email":"ali@yahoo.com"}
        headers = {'content-type': 'application/json'}
        # ارسال درخواست به صورت POST
        r = requests.post(url, data=json.dumps(payload), headers=headers)
        # چاپ پاسخ وبسرویس
        print(r.status_code, r.reason)

    if __name__ == "__main__":
        # ساخت نام و نام خانوادگی تصادفی
        name = name_family()
        # ساخت شماره تلفن تصادفی
        number = number()
        # ارسال مقادیر تصادفی به تابع ثبت کاربر
        req(name,number)
        



برای تست پاسخ گویی وبسرویس به خواندن اطلاعات و نمایش آن از دستور زیر استفاده شده

.. Note:: ab -k -c 350 -n 20000 example.com/

که منظور از example.com آدرس سرور است

همچنین در سیستم عامل لینوکس میتوان یک برنامه را چند بار در ترمینال اجرا کرد دستور زیر در ترمینال اجرا میکنیم

.. Note:: for i in seq {1..60};do sudo python main.py;done

منظور از main.py فایل حاوی دستورات ساخت نام و شماره تصادفی و ثبت در پایگاه داده است

نتایح بدست آمده از این روش


=============  =============
زمان           توضیحات
=============  =============
`~1.5 min`      ثبت ۶۰ کاربر در سیستم
`~3 sec`        ۲۰۰۰۰ خواندن بانک ها از وبسرویس با همزمانی ۳۵۰
=============  =============

.. seaalso:: البته ناگفته نماند نتایج به سخت افزار میزبان هم بستگی دارد
