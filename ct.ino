#include <WiFi.h>
#include <Firebase_ESP_Client.h>


// Provide the token generation process info.
#include "addons/TokenHelper.h"
// Provide the RTDB payload printing info and other helper functions.
#include "addons/RTDBHelper.h"

// Insert your network credentials
#define WIFI_SSID "MOFEC"
#define WIFI_PASSWORD "pengujianalat"

// Insert Firebase project API Key
#define API_KEY "AIzaSyBq0Ro_qS_N2CLPQ7zvcGsTPVkQ7PNSlKE"

// Insert Authorized Email and Corresponding Password
#define USER_EMAIL "sepriandanni@gmail.com"
#define USER_PASSWORD "12345678"

// Insert RTDB URLefine the RTDB URL
#define DATABASE_URL "https://mofecweb-default-rtdb.asia-southeast1.firebasedatabase.app/"

// Define Firebase objects
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// Variable to save USER UID
String uid;

// Variables to save database paths
String databasePath;
String currentPath;
String voltagePath;

// Timer variables (send new readings every three minutes)
unsigned long sendDataPrevMillis = 0;
unsigned long timerDelay = 180000;

int decimalPrecision = 2;                   // decimal places for all values shown in LED Display & Serial Monitor

/* 1- AC Current Measurement */
int currentAnalogInputPin = 35;             // Which pin to measure Current Value (A0 is reserved for lcd Display Shield Button function)
int calibrationPin = 33;                    // Which pin to calibrate offset middle value
float manualOffset = 0.00;                  // Key in value to manually offset the initial value
float mVperAmpValue = 62.5;                 // If using "Hall-Effect" Current Transformer, key in value using this formula: mVperAmp = maximum voltage range (in milli volt) / current rating of CT
                                            // For example, a 20A Hall-Effect Current Transformer rated at 20A, 2.5V +/- 0.625V, mVperAmp will be 625 mV / 20A = 31.25mV/A 
                                            // For example, a 50A Hall-Effect Current Transformer rated at 50A, 2.5V +/- 0.625V, mVperAmp will be 625 mV / 50A = 12.5 mV/A
                                            // For example, a 50A Hall-Effect Current Transformer rated at 10A, 2.5V +/- 0.625V, mVperAmp will be 625 mV / 10A = 62.5 mV/A
float supplyVoltage = 3300;                 // Analog input pin maximum supply voltage, Arduino Uno or Mega is 5000mV while Arduino Nano or Node MCU is 3300mV
float offsetSampleRead = 0;                 /* to read the value of a sample for offset purpose later */
float currentSampleRead  = 0;               /* to read the value of a sample including currentOffset1 value*/
float currentLastSample  = 0;               /* to count time for each sample. Technically 1 milli second 1 sample is taken */
float currentSampleSum   = 0;               /* accumulation of sample readings */
float currentSampleCount = 0;               /* to count number of sample. */
float currentMean ;                         /* to calculate the average value from all samples, in analog values*/ 
float RMSCurrentMean ;                      /* square roof of currentMean, in analog values */   
float FinalRMSCurrent ;                     /* the final RMS current reading*/
float zeroVal  = 0.4 ;//ct
float calib_ct = 0.1 ;//ct

float calib_value = 2.5;//voltage divider
float calib_value2 = 0;//voltage divider

float raw_bat;  
float volt_bat;              
float pv;

#include <LiquidCrystal_I2C.h>
LiquidCrystal_I2C lcd(0x27, 16, 2);  
unsigned long startMicroslcd;                   /* start counting time for lcd Display */
unsigned long currentMicroslcd;                 /* current counting time for lcd Display */
const unsigned long periodlcd = 1000000;        // refresh every X seconds (in seconds) in LED Display. Default 1000000 = 1 second 

void setup()                                              /*codes to run once */
{                                      
  /* 0- General */
  Serial.begin(9600);                               /* to display readings in Serial Monitor at 9600 baud rates */
  initWiFi();

  /* 2 - lcd Display  */ 
  lcd.begin();
  lcd.setCursor(0,0);
  startMicroslcd = micros();                        /* Start counting time for lcd display*/

  intFirebase();
}


void loop()                                                                                                   /*codes to run again and again */
{        
  /* 1- AC & DC Current Measurement */
  if(micros() >= currentLastSample + 200)                                                               /* every 0.2 milli second taking 1 reading */
  { 
   currentSampleRead = analogRead(currentAnalogInputPin)-analogRead(calibrationPin);                  /* read the sample value including offset value*/
   currentSampleSum = currentSampleSum + sq(currentSampleRead) ;                                      /* accumulate total analog values for each sample readings*/
   currentSampleCount = currentSampleCount + 1;                                                       /* to count and move on to the next following count */  
   currentLastSample = micros();                                                                      /* to reset the time again so that next cycle can start again*/ 
  }
  
  if(currentSampleCount == 4000)                                                                        /* after 4000 count or 800 milli seconds (0.8 second), do this following codes*/
  { 
    currentMean = currentSampleSum/currentSampleCount;                                                /* average accumulated analog values*/
    RMSCurrentMean = sqrt(currentMean);                                                               /* square root of the average value*/
    //FinalRMSCurrent = (((RMSCurrentMean /1023) *supplyVoltage) /mVperAmpValue)- manualOffset;         /* calculate the final RMS current*/
    FinalRMSCurrent = (((RMSCurrentMean /4096) *supplyVoltage) /mVperAmpValue)- manualOffset;
    if(FinalRMSCurrent <= (625/mVperAmpValue/100))                                                    /* if the current detected is less than or up to 1%, set current value to 0A*/
    { FinalRMSCurrent =0; }
    Serial.print(" The Current RMS value is: ");
    Serial.print(FinalRMSCurrent,decimalPrecision);
    Serial.println(" A ");
    currentSampleSum =0;                                                                              /* to reset accumulate sample values for the next cycle */
    currentSampleCount=0;                                                                             /* to reset number of sample for the next cycle */
  }
  
  /* 2 - lcd Display  */
  
  currentMicroslcd = micros();                                                                          /* Set counting time for lcd Display*/
  if (currentMicroslcd - startMicroslcd >= periodlcd)                                                   /* for every x seconds, run the codes below*/
  {
    lcd.setCursor(0,0);                                                                               /* Set cursor to first colum 0 and second row 1  */
    lcd.print("Current:");
    lcd.setCursor(8,0); 
    lcd.print("        ");   
    lcd.setCursor(8,0); 
    //float finalCur = FinalRMSCurrent - zeroVal;
    float finalCur = FinalRMSCurrent;
    if(finalCur < 1){finalCur=0;}
    //else if(finalCur < 0.1){finalCur=0;}
    else{
      //finalCur = finalCur - calib_ct + 0.3;
      finalCur = finalCur - calib_ct;
    }
    lcd.print(finalCur,decimalPrecision);                                                      /* display current value in lcd in first row  */
    lcd.print("A");
    
    read_bat();       
    lcd.setCursor(0,1); 
    lcd.print("Voltage:"); 
    lcd.setCursor(8,1);  
    lcd.print("         ");   
    lcd.setCursor(8,1);  
    lcd.print(pv,1);  
    lcd.print("V");    
     
//    lcd.setCursor(0,1);  
//    lcd.print("                ");  
//    lcd.setCursor(0,1);  
//    lcd.print(analogRead(currentAnalogInputPin)-analogRead(calibrationPin));   
//    lcd.print("      ");  
//    lcd.print(calib_value2);                                                              /* display nothing in lcd in second row */
    startMicroslcd = currentMicroslcd ;                                                              /* Set the starting point again for next counting time */
  }

  kirimFirebase();
}

void read_bat(){
  raw_bat  = analogRead(32);  
  volt_bat = raw_bat/4096*3.3;
  pv = mapfloat(volt_bat, 0, 3.137, 0, 48.82);  
  pv = pv-calib_value;
  pv = mapfloat(pv, 5.8, 48.8, 10, 48.8);    
  if(pv >= 42){
    calib_value2 = mapfloat(pv, 43.1, 48.8, 0, 2);
    pv = pv+(2-calib_value2); 
  }
  else if(pv <= 43){
    calib_value2 = mapfloat(pv, 20, 43, 1, 3);
    pv = pv+calib_value2; 
  }

  if(pv < 5.8){pv = 0;}
  Serial.print("======> PV: ");
  Serial.print(pv,decimalPrecision);
  
  Serial.println("V");
}

float mapfloat(float x, float in_min, float in_max, float out_min, float out_max){
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
