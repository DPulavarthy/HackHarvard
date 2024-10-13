from opencv3 import get_percent_filled
from capture import take_photo
import time
import requests

url = 'http://192.168.124.47:1123/set/1/'
url2 = 'http://192.168.124.47:1123/start/1'
# first num is row
# scond num is level (1-5) for LED level

def get_level(percent):
    level = 0
    if (percent >= 0 and percent <= 10):
        return 0
    elif (percent >=10 and percent <20):
        return 1
    elif (percent >= 20 and percent < 40):
        return 2
    elif (percent >= 40 and percent < 60):
        return 3
    elif (percent >= 60 and percent < 80):
        return 4
    elif (percent >=80):
        return 5
    print(level)
    print('sum' + str(percent))

    




if __name__ == "__main__":
    
    levels = []
    avg = 0
    response = requests.get(url2)
    while (1):
        if (len(levels) == 3):

            for elem in levels:
                if (elem > 100):
                    elem = 100
                print("Element is: " + str(elem))
                if (elem is not None):
                    avg += elem

            avg /= len(list(filter(None, levels)))
            print("avreage is " + str(avg))
            avg = get_level(avg)
            levels = []

            print(avg)
            response = requests.get(url+str(avg))  
            avg = 0
            # GET request
            # you can send stuff here 
            


        


        else:
            
            print("Taking photo")
            take_photo()

            print("Getting percent filled")
            percent = get_percent_filled() #pass in debug value

            
            if (percent < 2) :
                percent = 2
        
            levels.append(percent)
            time.sleep(1)
            
