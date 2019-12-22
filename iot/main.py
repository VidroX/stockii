#!/usr/bin/env python
import OPi.GPIO as GPIO
from MFRC522 import MFRC522
import signal
import requests
import json

GPIO.setwarnings(False)

CONFIG = None
USER = None

prev_tag = None

# Requests
def authenticate(email, password):
    endpoint = CONFIG['api']['url'] + 'auth/login/'

    data = {
        'email': email,
        'password': password,
        'return_token': True
    }

    return requests.post(url=endpoint, data=data)
    
def update_product(token, product_id, quantity):
    if product_id is None and (quantity is None or (quantity is not None and int(quantity) < 0)):
        raise Exception('Please provide product data and quantity')

    if token is None:
        raise Exception('Please provide user and token data')

    endpoint = CONFIG['api']['url'] + 'products/' + str(product_id) + '/'

    data = {
        'quantity': quantity,
        'force': 1
    }

    return requests.put(url=endpoint, data=data, headers={'Authorization': 'Bearer ' + str(token)})
    
def get_product(token, product_id):
    if product_id is None or product_id <= 0:
        raise Exception('Please provide product id')

    if token is None:
        raise Exception('Please provide user and token data')

    endpoint = CONFIG['api']['url'] + 'products/' + str(product_id) + '/'

    return requests.get(url=endpoint, headers={'Authorization': 'Bearer ' + str(token)})
    
def change_shipment_status(token, shipment_id, status):
    if shipment_id is None or int(shipment_id) <= 0:
        raise Exception('Please provide valid shipment_id')
        
    if status is None or int(status) not in range(1, 3):
        raise Exception('Please provide valid status code')

    if token is None:
        raise Exception('Please provide user and token data')

    endpoint = CONFIG['api']['url'] + 'shipments/' + str(shipment_id) + '/'

    data = {
        'status': status
    }

    return requests.put(url=endpoint, data=data, headers={'Authorization': 'Bearer ' + str(token)})

# Config file
with open('config.json', 'r') as f:
    CONFIG = json.load(f)

try:
    with open('user.json', 'r') as f:
        USER = json.load(f)
except:
    USER = None
    
if USER is None:
    print("Please enter IoT user credentials")

    email = None
    password = None
    
    while email is None:
        uinput = input("Enter E-Mail: ")
        
        if uinput is not None:
            email = uinput
            
    while password is None:
        uinput = input("Enter password: ")
        
        if uinput is not None:
            password = uinput
    
    print("Authenticating...")
    
    response = authenticate(email, password)
    
    if response.json().get('status', None) is not None and response.json().get('status', None) == 2:
        user_data = {}
        user_data['TOKEN'] = response.json().get('data', None).get('token', None)
        user_data['TOKEN_EXPIRY'] = response.json().get('data', None).get('token_expiry', None)
        with open('user.json', 'w') as f:
            json.dump(user_data, f)
        USER = user_data
        print("Successfully authenticated!")
    

if CONFIG is not None:
    if USER is not None:
        continue_reading = True

        def end_read(signal,frame):
            global continue_reading
            print ("Ctrl+C captured, ending read.")
            continue_reading = False
            GPIO.cleanup()

        signal.signal(signal.SIGINT, end_read)

        MIFAREReader = MFRC522.MFRC522()

        print ("Stockii IoT Application. Waiting for NFC/RFID tag...")
        print ("Press Ctrl-C to stop.")

        while continue_reading:
            (status, TagType) = MIFAREReader.MFRC522_Request(MIFAREReader.PICC_REQIDL)

            if status == MIFAREReader.MI_OK:
                print ("Tag detected")
            
            (status, uid) = MIFAREReader.MFRC522_Anticoll()

            if status == MIFAREReader.MI_OK:
                key = [0xFF,0xFF,0xFF,0xFF,0xFF,0xFF]
                
                MIFAREReader.MFRC522_SelectTag(uid)

                status = MIFAREReader.MFRC522_Auth(MIFAREReader.PICC_AUTHENT1A, 8, key, uid)

                if status == MIFAREReader.MI_OK:
                    data = MIFAREReader.MFRC522_ReadToArray(8)
                    
                    if data is not None:
                        type = data[0]
                        
                        if type == 1: # Shipment tag -> Blocks(0, 1)
                            shipment_id = data[1]
                            if prev_tag != data:
                                response = change_shipment_status(USER['TOKEN'], shipment_id, 2)
                                if response.json().get('status', None) == 12:
                                    prev_tag = data
                                    print("Shipment with ID(" + str(shipment_id) + ") has been successfully marked as arrived!")
                                elif response.json().get('detail', None) is not None:
                                    prev_tag = data
                                    print("Unknown tag type!")
                            
                        elif type == 2: # Batch tag -> Blocks(0, 1, 2)
                            product_id = data[1]
                            product_count = data[2]
                            
                            if prev_tag != data:
                                response = get_product(USER['TOKEN'], product_id)
                                
                                if response.json().get('status', None) == 12:
                                    current_quantity = int(response.json().get('data', None).get('product', None).get('quantity', 0))
                                    response_update = update_product(USER['TOKEN'], product_id, product_count + current_quantity)
                                    if response_update.json().get('status', None) == 12:
                                        prev_tag = data
                                        print("Product with ID(" + str(product_id) + ") has been successfully added to warehouse! Amount added: ", product_count)
                                    elif response_update.json().get('detail', None) is not None:
                                        prev_tag = data
                                        print("Unknown tag type!")
                                else:
                                    prev_tag = data
                                    print("Unknown tag type!")
                    
                    
                    MIFAREReader.MFRC522_StopCrypto1()
                else:
                    print ("Authentication error")
    else:
        print("Unable to authenticate!")
else:
    print("Config file not found!")

