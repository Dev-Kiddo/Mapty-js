"use script";

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

// let leafletEvent, map;
// cmted
/*

class App {
  #map;
  #leafletEvent;

  constructor() {
    this._getPosition();
  }
  _getPosition() {
    navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function () {
      alert("Couldn't get your position");
    });
  }
  _loadMap(position) {
    console.log("position:", position);
    const { latitude } = position.coords;
    const { longitude } = position.coords;

    this.#map = L.map("map").setView([latitude, longitude], 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on("click", this._showForm.bind(this));

    //   console.log("Map:", map);
  }
  _showForm() {
    form.classList.remove("hidden");

    inputDistance.focus();

    inputElevation.value = inputDistance.value = inputDuration.value = "";

    this.#leafletEvent = leafEvent;
  }
  _toggleElevetionField() {
    inputType.addEventListener("change", function () {
      inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
      inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
    });
  }
  _newWorkout() {
    e.preventDefault();

    if (!inputDuration.value && !inputDuration.value) return;

    console.log("submitted");

    const { lat, lng } = this.#leafletEvent.latlng;

    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 150,
          minWidth: 100,
          autoClose: false,
          className: "running-popup",
        })
      )
      .setPopupContent("Workout")
      .openPopup();
  }
}

const app = new App();

// if (navigator.geolocation) {
//   navigator.geolocation.getCurrentPosition(
//     function (position) {
//       console.log("position:", position);
//       const { latitude } = position.coords;
//       const { longitude } = position.coords;
//       map = L.map("map").setView([latitude, longitude], 13);
//       L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
//         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//       }).addTo(map);
//       //   console.log("Map:", map);
//       map.on("click", function (leafEvent) {
//         form.classList.remove("hidden");
//         inputDistance.focus();
//         inputElevation.value = inputDistance.value = inputDuration.value = "";
//         leafletEvent = leafEvent;
//       });
//     },
//     function () {
//       alert("Couldn't get your position");
//     }
//   );
// }

// document.addEventListener("submit", function (e) {
//   e.preventDefault();

//   if (!inputDuration.value && !inputDuration.value) return;

//   console.log("submitted");

//   const { lat, lng } = leafletEvent.latlng;

//   L.marker([lat, lng])
//     .addTo(map)
//     .bindPopup(
//       L.popup({
//         maxWidth: 150,
//         minWidth: 100,
//         autoClose: false,
//         className: "running-popup",
//       })
//     )
//     .setPopupContent("Workout")
//     .openPopup();
// });

*/
// cmted