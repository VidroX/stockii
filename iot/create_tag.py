#!/usr/bin/env python
import OPi.GPIO as GPIO
from MFRC522 import MFRC522
import signal

GPIO.setwarnings(False)

tag_type = 0
shipment_id = 0
product_id = 0
product_count = 0

while tag_type == 0:
    print("Select tag type:")
    print("1. Shipment tag")
    print("2. Batch tag")
    
    uinput = input("Your choice: ")
    
    if uinput is not None:
        try:
            if int(uinput) == 1 or int(uinput) == 2:
                tag_type = int(uinput)
            else:
                print("Unknown tag type. Please select from 1 or 2.")
        except:
            print("Unknown tag type. Please select from 1 or 2.")
            
print("\n")

if tag_type == 1:
    while shipment_id == 0:
        uinput = input("Enter shipment ID: ")
        
        if uinput is not None:
            try:
                if int(uinput) > 0:
                    shipment_id = int(uinput)
                else:
                    print("Unknown shipment ID. Please enter value starting from 1.")
            except:
                print("Unknown shipment ID. Please enter value starting from 1.")
elif tag_type == 2:
    while product_id == 0:
        uinput = input("Enter product ID: ")
        
        if uinput is not None:
            try:
                if int(uinput) > 0:
                    product_id = int(uinput)
                else:
                    print("Unknown product ID. Please enter value starting from 1.")
            except:
                print("Unknown product ID. Please enter value starting from 1.")
                
    while product_count == 0:
        uinput = input("Enter product count: ")
        
        if uinput is not None:
            try:
                if int(uinput) > 0:
                    product_count = int(uinput)
                else:
                    print("Incorrect product count. Please enter value starting from 1.")
            except:
                print("Incorrect product count. Please enter value starting from 1.")

print("\n")

if tag_type == 1 or tag_type == 2:
    continue_reading = True

    def end_read(signal,frame):
        global continue_reading
        print("Ctrl+C captured, ending read.")
        continue_reading = False
        GPIO.cleanup()

    signal.signal(signal.SIGINT, end_read)

    MIFAREReader = MFRC522.MFRC522()

    print("Waiting for NFC tag")

    while continue_reading:
        (status,TagType) = MIFAREReader.MFRC522_Request(MIFAREReader.PICC_REQIDL)

        if status == MIFAREReader.MI_OK:
            print("NFC tag detected. Writing")
        
        (status,uid) = MIFAREReader.MFRC522_Anticoll()

        if status == MIFAREReader.MI_OK:
            key = [0xFF,0xFF,0xFF,0xFF,0xFF,0xFF]
            
            MIFAREReader.MFRC522_SelectTag(uid)

            status = MIFAREReader.MFRC522_Auth(MIFAREReader.PICC_AUTHENT1A, 8, key, uid)
            print("\n")

            if status == MIFAREReader.MI_OK:
                clear_amount = 15
            
                data = [tag_type]
                
                if tag_type == 1 and shipment_id > 0:
                    clear_amount = 14
                    data.append(shipment_id)
                elif tag_type == 2 and product_id > 0 and product_count > 0:
                    clear_amount = 13
                    data.append(product_id)
                    data.append(product_count)
                
                for x in range(0, clear_amount):
                    data.append(0x00)

                print("Writing data...")
                MIFAREReader.MFRC522_Write(8, data)
                print("\n")

                print("New data block:")
                MIFAREReader.MFRC522_Read(8)
                print("\n")

                MIFAREReader.MFRC522_StopCrypto1()
                
                print("Tag has been written successfully!")

                continue_reading = False
            else:
                print("Authentication error")
else:
    print("Unknown tag type")