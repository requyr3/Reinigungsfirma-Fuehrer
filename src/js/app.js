/*
     Developer: Lukas Arsenovic
     Copyright: 08.06.2026

     only for testing reasons

*/

let DEBUG = false;

class Vehicle {

     constructor(id, name, type, owner, color) {
          this.id = id;
          this.name = name;
          this.type = type;
          this.owner = owner;
          this.color = color;
          this.locked = false;
     };

     getID() {
          return this.id;
     }

     setID (id) {
          this.id = id;
     }

     getName() {
          return this.name;
     }

     setName(name) {
          this.name = name;
     }

     getType() {
          return this.type;
     }
     
     setType(type) {
          this.type = type;
     }

     getOwner() {
          return this.owner;
     }

     setOwner(owner) {
          this.owner = owner;
     }

     getColor() {
          return this.color;
     }

     setColor(color) {
          this.color = color;
     }

     isLocked() {
          return this.isLocked;
     }

     getLocked() {
          return this.locked;
     }

     setLocked(state) {
          this.locked = state;
     }

     lock(state) {
          this.locked = !this.locked;
     }

     getVehInformation() {

          if (!Vehicle || this.owner === null) {
               return
          }

          this.print("Fahrzeuginformationen aufgerufen!");
          this.print("ID: " + this.id);
          this.print("Hersteller: " + this.name);
          this.print("Besitzer: " + this.owner);
          this.print("Modell: " + this.type);
          this.print("Farbe: " + this.color);

          let txt;
          if (this.locked) {
               txt = "Aufgeschlossen";
          } else {
               txt = "Zugeschlossen";
          }
          this.print("Verriegelt: " + txt);  
     }

     print(text, ...args) {
          if (!text || text === 0) {
               return;
          }
          return console.log(text);
     }

}

function square(n) {
     return n * n;
}

function isSquare(n) {

   if (n < 0) {
     return false
   }

   const square = Math.sqrt(n);
   return square * square === n;

}

function isEven(n) {
     return n % 2 === 0;
}

function isPrime(n) {

     if (n <= 1) {
          return false;
     }

     for (let i = 2; i <= Math.sqrt(n); i++) {
          if (n % i === 0) {
               return false;
          }
     }
     return true;
}

function factorial(n) {

     let x = 1;

     for (let i = 1; i <= n; i++) {
          x = x * i;

          if (DEBUG) { console.log(i, x) }
     }
     return x;
}
factorial(1)

function init() {


     const maximum = 10;
     const vehicles = [];


     for (let i = 0; i < maximum; i++) {
          const veh = new Vehicle(i, "MB", "C Class", "LA", "black")
          vehicles.push(veh);
     }

     // vehicles.forEach(({ id, name, owner, color }) => {
     //      console.log(id + " " + owner);
     // });

     // console.log(vehicles);

}
init();