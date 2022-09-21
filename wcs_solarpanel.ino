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
String irradiantPath;

// Timer variables (send new readings every three minutes)
unsigned long sendDataPrevMillis = 0;
unsigned long timerDelay = 180000;

/* 0- General */
int decimalPrecision = 2;                   /* decimal places for only for current value shown in LED Display */

/* 1- DC Current & Irradiation */
int CurrentAnalogInputPin = 33;             // Which pin to measure Current Value
float mVperAmpValue = 7000;                 // If using ACS712 current module : for 5A module key in 185, for 20A module key in 100, for 30A module key in 66
                                           // If using WCS current module : for 0.25A module key in 7000, for 0.5A module key in 3500, for 1.0A module key in 2000, for 2.0A module key in 1000.
float moduleMiddleVoltage = 1650;           // key in middle voltage value in mV. For 5V power supply key in 2500, for 3.3V power supply, key in 1650 mV
float moduleSupplyVoltage = 3300;           // supply voltage to current sensor module in mV, default 5000mV, may use 3300mV 
float currentSampleRead  = 0;               /* to read the value of a sample*/
float currentLastSample  = 0;               /* to count time for each sample. Technically 1 milli second 1 sample is taken */
float currentSampleSum   = 0;               /* accumulation of sample readings */
float currentSampleCount = 0;               /* to count number of sample. */
float currentMean ;                         /* to calculate the average value from all samples*/ 
float finalCurrent ;                        /* the final current reading without taking offset value*/
float finalCurrent2 ;                       /* the final current reading*/
float ShortCircuitCurrentSTC = 0.22;      // Key in the Short Circuit Current (At STC condition) of your Solar Panel or Solar Cell. Value 9 showing 9.0A Isc Panel.  default 2.9
float Irradiation = 0.00;                   /* This shows the irradiation level in W/m2.
    /* 1.1 - Offset DC Current */
    int   OffsetRead = 0;                   /* To switch between functions for auto callibation purpose */
    float currentOffset =0.00;              // to Offset deviation and accuracy. Offset any fake current when no current operates. 
                                            // the offset will automatically done when you press the <SELECT> button on the LCD display module.
                                            // you may manually set offset here if you do not have LCD shield
    float offsetLastSample = 0;             /* to count time for each sample. Technically 1 milli second 1 sample is taken */
    float offsetSampleCount = 0;            /* to count number of sample. */
    float correctionValue = 0;
    float calibrationFromCM = 0.00;
    /* 1.2 - Average Accumulate Irradiation */
                   
    float accumulateIrradiation = 0;                          /* Amount of accumulate irradiation*/
    unsigned long startMillisIrradiation;                     /* start counting time for irradiation energy */
    unsigned long currentMillisIrradiation;                   /* current counting time for irradiation energy */
    const unsigned long periodIrradiation = 1000;             // refresh every X seconds (in seconds) Default 1000 = 1 second 
    float FinalAccumulateIrradiationValue = 0;                /* shows the final accumulate irradiation reading*/
    
/* 2 - LCD Display  */
#include <LiquidCrystal_I2C.h>
LiquidCrystal_I2C lcd(0x27, 16, 2);  
unsigned long startMillisLCD;                               /* start counting time for LCD Display */
unsigned long currentMillisLCD;                             /* current counting time for LCD Display */
const unsigned long periodLCD = 1000;                       // refresh every X seconds (in seconds) in LED Display. Default 1000 = 1 second 

void setup(){
  /* 0- General */
  Serial.begin(9600);                               /* In order to see value in serial monitor */
  initWiFi();
  
  /* 1.2 - Average Accumulate Irradiation */
  startMillisIrradiation = millis();                /* Record initial starting time for daily irradiation */
  
  /* 2 - LCD Display  */  
  lcd.begin();
  lcd.setCursor(0,0);

  intFirebase();
}

int adcMaxbitVal = 4095;// esp32 12bit
void loop(){
  //OffsetRead = 1; 

/* 1- DC Current & Irradiation */
  if(millis() >= currentLastSample + 1 ) {
    currentSampleRead = analogRead(CurrentAnalogInputPin)-((moduleMiddleVoltage/moduleSupplyVoltage)*adcMaxbitVal);      /* read the sample value */ 
    currentSampleSum = currentSampleSum + currentSampleRead ;                                         /* accumulate value with older sample readings*/  
    currentSampleCount = currentSampleCount + 1;                                                      /* to move on to the next following count */
    currentLastSample = millis();    
    currentSampleRead = analogRead(CurrentAnalogInputPin);        
//    Serial.print("RAW: ");
//    Serial.println(currentSampleRead);/* to reset the time again so that next cycle can start again*/ 
  }
  
  if(currentSampleCount == 1000){
    currentMean = currentSampleSum/currentSampleCount;                                                /* calculate average value of all sample readings taken*/
    finalCurrent = (((currentMean /adcMaxbitVal)*moduleSupplyVoltage)/mVperAmpValue);                         /* calculate the final current (without offset)*/
    finalCurrent2 = finalCurrent+currentOffset;  
    if(finalCurrent2 < 0){
      correctionValue = 0 - finalCurrent2;
      //finalCurrent2 = 0;
    }
    finalCurrent2 += (correctionValue + calibrationFromCM);
    /* The final current */
    Irradiation = (finalCurrent2/ShortCircuitCurrentSTC*1000);
    Serial.print(finalCurrent2,decimalPrecision);
    Serial.print(" A  ");
    Serial.print(Irradiation,1);
    Serial.print(" W/m2  ");
    currentSampleSum =0;                                                                              /* to reset accumulate sample values for the next cycle */
    currentSampleCount=0;                                                                             /* to reset number of sample for the next cycle */
  }
    
  /* 1.1 - Offset DC Current */  
  if(OffsetRead == 1){
    currentOffset = 0;                                                             /* set back currentOffset as default first*/
    if(millis() >= offsetLastSample + 1)                                           /* offset 1 - to centralise analogRead waveform*/
      {                                                                            
        offsetSampleCount = offsetSampleCount + 1;                                                                          
        offsetLastSample = millis();                                                                          
      }   

       if(offsetSampleCount == 2500)                                             /* need to wait awhile as to get new value before offset take into calculation.  */
    {                                                                             /* So this code is to delay 2.5 seconds after button pressed */
      currentOffset = - finalCurrent;                                             /* to offset values */
      OffsetRead = 0;                                                             /* until next offset button is pressed*/                      
      offsetSampleCount = 0;                                                      /* to reset the time again so that next cycle can start again */ 
      lcd.setCursor(0,0);
      lcd.print ("OFFSET.....     ");
      lcd.setCursor(0,1);
      lcd.print ("DONE  .....     ");
    }                                                                             
  }    
    
  /* 1.2 - Average Accumulate Irradiation */   
  currentMillisIrradiation = millis(); 
  if (currentMillisIrradiation - startMillisIrradiation >= periodIrradiation){
    accumulateIrradiation = Irradiation/3600*(periodIrradiation/1000);                                /* for smoothing calculation*/
    FinalAccumulateIrradiationValue =  FinalAccumulateIrradiationValue + accumulateIrradiation ;
    Serial.print(FinalAccumulateIrradiationValue,decimalPrecision); 
    Serial.println(" Wh/m2/day"); 
    startMillisIrradiation = currentMillisIrradiation ;                                               /* Set the starting point again for next counting time */
  }
     
  /* 2 - LCD Display  */  
  currentMillisLCD = millis();
  if (currentMillisLCD - startMillisLCD >= periodLCD){                                                               
    lcd.setCursor(0,0); 
    lcd.print("   ");                                                            
    lcd.setCursor(0,0); 
    //lcd.print(analogRead(CurrentAnalogInputPin));     
    float voltageADC = analogRead(CurrentAnalogInputPin)*(moduleSupplyVoltage/1000)/adcMaxbitVal;
    float voltageMapping = mapfloat(voltageADC, 1.42, 3.3, 0.59, 5);
    lcd.print(voltageMapping,decimalPrecision);                                                               /* Set cursor to first colum 0 and second row 1  */
    lcd.setCursor(5,0); 
    lcd.print("V");
    //lcd.print(finalCurrent2,decimalPrecision);                                                              /* Set cursor to first colum 0 and second row 1  */
    lcd.setCursor(10,0); 
    lcd.print("   ");                                                           /* Set cursor to first colum 0 and second row 1  */
    lcd.setCursor(10,0); 
    lcd.print(mapfloat(analogRead(CurrentAnalogInputPin), 1683, 4096, 0.08, 0.22),decimalPrecision);                                                           /* Set cursor to first colum 0 and second row 1  */
    lcd.setCursor(15,0);
    lcd.print("A "); 
    lcd.setCursor(0,1); 
    lcd.print("        ");
    //lcd.print(correctionValue + calibrationFromCM,3);                                                 /* display voltage value in LCD in first row  */
    //lcd.print(" ");
    //lcd.print(Irradiation,decimalPrecision); 
    lcd.setCursor(0,1); 
    float w_m_2 =  mapfloat(analogRead(CurrentAnalogInputPin), 1683, 2770, 0.4, 950);
    if(w_m_2 < 0){
      w_m_2 = 0;
    }
    lcd.print(w_m_2,1); 
    lcd.setCursor(8,1);    
    lcd.print("W/m2");  
    //lcd.print(FinalAccumulateIrradiationValue,0);                                                 /* display current value in LCD in first row */
    //lcd.print("Wh/m2/day"); 
    startMillisLCD = currentMillisLCD ;   
  }

  kirimFirebase();
}

float mapfloat(float x, float in_min, float in_max, float out_min, float out_max){
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
