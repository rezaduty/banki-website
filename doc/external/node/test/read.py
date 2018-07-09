import requests
import json
r = requests.get('http://192.168.43.140:8088/queue/2')
data = str(r.json())
print data[28:len(data)-3]
