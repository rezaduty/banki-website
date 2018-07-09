import pygame
import time
pygame.init()
for i in range(0,1):
    pygame.mixer.music.load("b1.mp3")
    pygame.mixer.music.play()
    time.sleep(2)
for j in range(0,1): 
    pygame.mixer.music.load("1.wav")
    pygame.mixer.music.play()
    time.sleep(2)
#pygame.event.wait()
