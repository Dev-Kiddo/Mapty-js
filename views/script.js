"use strict";

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

let map, leafletEvent;



// This is how geolocation works in javascript
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      console.log("GeoLoaction Obj:", position);
      const { latitude } = position.coords;
      const { longitude } = position.coords;

      //   if we put this link, the google map will load that part of the map.
      //   const curCoords = `https://www.google.com/maps/@${latitude},${longitude}`;
      const curCoords = [latitude, longitude];

      //   Leaflet API code - from Leaflet
      map = L.map("map").setView(curCoords, 13);

      console.log("Map:", map);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      //   L.marker(curCoords).addTo(map).bindPopup("A pretty CSS popup.<br> Easily customizable.").openPopup();

      //   Creatig a event listners using leaflet-on()
      map.on("click", function (Levent) {
        leafletEvent = Levent;
        console.log(leafletEvent);

        form.classList.remove("hidden");

        inputDistance.value = inputDuration.value = inputElevation.value = inputCadence.value = "";
        // focus method will active the input
        inputDistance.focus();
      });

      // ------ Leaflet API code - from Leaflet
    },
    function () {
      {
        alert("Could not get your position");
      }
    }
  );
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (!inputDistance.value) return;

  const { lat, lng } = leafletEvent.latlng;

  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: "running-popup",
      })
    )
    .setPopupContent("Workout")
    .openPopup();
});

// this change event will trigger - Form selection
inputType.addEventListener("change", function () {
  inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
  inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
});
