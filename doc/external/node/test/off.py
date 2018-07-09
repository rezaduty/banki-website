import RPi.GPIO as GPIO
import time
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(5,GPIO.OUT)
GPIO.setup(6,GPIO.OUT)
GPIO.setup(12,GPIO.OUT)
GPIO.setup(13,GPIO.OUT)

print "LED off"
GPIO.output(5,GPIO.LOW)
GPIO.output(6,GPIO.LOW)
GPIO.output(12,GPIO.LOW)
GPIO.output(13,GPIO.LOW)

GPIO.cleanup(5)
GPIO.cleanup(6)
GPIO.cleanup(12)
GPIO.cleanup(13)
