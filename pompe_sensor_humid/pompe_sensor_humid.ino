// Sensor d'humidité
int sensorPin = A0;
int sensorValue = 0;
int seuilAlerte = 600;

// Moteur d'eau
int motorpin1 = 2;
int motorpin2 = 3;


int valeurHumiditeMinimale = 0;
int valeurHumiditeMaximale = 1000;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);

  pinMode(motorpin1, OUTPUT);
  pinMode(motorpin2, OUTPUT);
}

void loop() {
  // put your main code here, to run repeatedly:
  // Lecture de la valeur du sensor
  sensorValue = analogRead(sensorPin);
  float pourcentage = map(sensorValue,valeurHumiditeMaximale, valeurHumiditeMinimale,0,100);
  Serial.println(pourcentage);
  delay(1000);

  if(Serial.available()>0){
    String data = Serial.readString();
    int response = data.toInt();
    // Si on reçoit 0 de la part du serveur JS, on lance la pompe
    if(response==0){
       digitalWrite(motorpin1, HIGH);
       analogWrite(motorpin2, 120);
    }else{
    // Si on reçoit 1 de la part du serveur JS, on arrête la pompe
       digitalWrite(motorpin1, LOW);
       digitalWrite(motorpin2, LOW);
    }
  }else{
     digitalWrite(motorpin1, LOW);
     digitalWrite(motorpin2, LOW);
  }
}

// ça utilise le PWM. analogWrite entre 0 et 255. Plus ça se rapproche du 0 plus le débit augmente et vice versa
// la polarité n'est pas importante ==> on peut inverser
