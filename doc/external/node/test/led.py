import RPi.GPIO as GPIO
import time
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

GPIO.setup(3,GPIO.OUT)
GPIO.output(3,GPIO.HIGH)
def blink():
    for i in range(100):  
  



        GPIO.output(3,GPIO.HIGH)
        time.sleep(1)
        GPIO.output(3,GPIO.LOW)
        time.sleep(1)
        
    return
print "LED on"
blink()

time.sleep(1)
print "LED 7"

GPIO.output(3,GPIO.LOW)
