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

// ---------------------------------------------
// Class Workouts
// ---------------------------------------------

class Workouts {
  date = new Date();
  id = (Date.now() + "").slice(-10);
  clicks = 0;
  constructor(coords, distance, duration) {
    this.coords = coords; //[lat/lng]
    this.distance = distance; //in KM
    this.duration = duration; //in Mins
  }

  _setDescription() {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDate()}`;
  }

  click() {
    this.clicks++;
    console.log(this.clicks);
  }
}

// ---------------------------------------------
// Class Running
// ---------------------------------------------

class Running extends Workouts {
  type = "running";

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;

    this._setDescription();

    this.calcPace();
  }

  calcPace() {
    // min/km
    this.pace = this.distance / this.duration;
    return this.pace;
  }
}

// ---------------------------------------------
// Class Cycling
// ---------------------------------------------

class Cycling extends Workouts {
  type = "cycling";

  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;

    this._setDescription();

    this.calcSpeed();
  }

  calcSpeed() {
    // km/hr
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

// const running1 = new Running([39, -12], 5.2, 24, 178);
// const cycling1 = new Running([48, -12], 10.2, 54, 288);

// console.log("run1:", running1);
// console.log("cycling1:", cycling1);

// ---------------------------------------------
// App Class
// ---------------------------------------------
class App {
  #map;
  #leafletEvent;
  #workouts = [];

  constructor() {
    // Get user's position
    this._getPosition();

    // Get data from local storage
    this._getLocalStorage();

    // Attach event handlers
    form.addEventListener("submit", this._newWorkout.bind(this));

    // this change event will trigger - Form selection
    inputType.addEventListener("change", this._toggleElveation);

    containerWorkouts.addEventListener("click", this._movePopup.bind(this));
  }

  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function () {
        {
          alert("Could not get your position");
        }
      });
    }
  }

  _loadMap(position) {
    console.log("GeoLoaction Obj:", position);
    const { latitude } = position.coords;
    const { longitude } = position.coords;

    //   if we put this link, the google map will load that part of the map.
    //   const curCoords = `https://www.google.com/maps/@${latitude},${longitude}`;
    const curCoords = [latitude, longitude];

    // console.log("this:", this);

    //   Leaflet API code - from Leaflet
    this.#map = L.map("map").setView(curCoords, 13);

    // console.log("Map:", map);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    //   The below code i commented because the marker will visible only after we get the data from form. so it goes to form event.

    //   L.marker(curCoords).addTo(map).bindPopup("A pretty CSS popup.<br> Easily customizable.").openPopup();

    //   Creatig a event listners using leaflet-on()
    this.#map.on("click", this._showForm.bind(this));

    // ------ Leaflet API code - from Leaflet

    this.#workouts.forEach((work) => {
      this.renderWorkoutMarker(work);
    });
  }

  _showForm(Levent) {
    this.#leafletEvent = Levent;
    // console.log(leafletEvent);
    form.classList.remove("hidden");

    // focus method will active the input
    inputDistance.focus();
  }

  hideForm() {
    inputDistance.value = inputDuration.value = inputElevation.value = inputCadence.value = "";

    form.style.display = "none";
    form.classList.add("hidden");

    setTimeout(() => {
      form.style.display = "grid";
    }, 1000);
  }

  _toggleElveation() {
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  }

  _newWorkout(e) {
    e.preventDefault();

    // Get data from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;

    const { lat, lng } = this.#leafletEvent.latlng;

    let workout;

    // ---------------------------------------------------------------
    // Helper Functions
    // ---------------------------------------------------------------
    const validInputs = (...inputs) => {
      // console.log("Inputs = ", inputs);
      return inputs.every((inp) => {
        // console.log("inp:", inp);
        return Number.isFinite(inp);
      });
    };

    const allPositive = (...inputs) => inputs.every((inp) => inp > 0);

    // ---------------------------------------------------------------
    // /Helper Functions
    // ---------------------------------------------------------------

    // if activity running / create running object
    if (type === "running") {
      const cadence = +inputCadence.value;

      // check if the data is valid

      // if (!Number.isFinite(distance) || !Number.isFinite(duration) || !Number.isFinite(cadence)) return alert("Inputs have to be positive number");
      console.log("valid:", validInputs(distance, duration, cadence));
      console.log("allPositive:", allPositive(distance, duration, cadence));

      if (!validInputs(distance, duration, cadence) || !allPositive(distance, duration, cadence)) return alert("Inputs have to be positive number");

      workout = new Running([lat, lng], distance, duration, cadence);
    }

    // if activity cycling / create cycling object
    if (type === "cycling") {
      const elevation = +inputElevation.value;

      if (!validInputs(distance, duration, elevation) || !allPositive(distance, duration)) return alert("Inputs have to be positive number");

      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    // add new object to workout array
    this.#workouts.push(workout);

    console.log("workout:", workout);

    // Render workout on map as marker

    this.renderWorkoutMarker(workout, type);

    // Render workout on list to user
    this.renderWorkoutList(workout);

    // Hide the form and Clear inputs
    this.hideForm();

    //Set local Storage to all Workouts
    this._setLocalStorage();
  }

  renderWorkoutMarker(workout, type) {
    console.log(workout);

    // const workoutDate = workout.date.getDate();
    // const workoutMonth = workout.date.getMonth();

    // const [lat, lng] = workout.coords;

    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${type}-popup`,
        })
      )
      .setPopupContent(`${workout.type === "running" ? "🏃‍♂️🏃‍♂️" : "🚴‍♂️🚴‍♂️"} ${workout.description}`)
      .openPopup();
  }

  renderWorkoutList(workout) {
    console.log("renderWorkoutList:", workout);

    // const workoutDate = workout.date.getDate();
    // const workoutMonth = workout.date.getMonth();

    let html = `<li class="workout workout--${workout.type}" data-id="${workout.id}">
          <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">${workout.type === "running" ? "🏃‍♂️" : "🚴‍♂️"}</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>`;

    if (workout.type === "running") {
      html =
        html +
        `<div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>
        </li>`;
    }

    if (workout.type === "cycling") {
      html =
        html +
        `<div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.speed.toFixed(1)}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevationGain}</span>
            <span class="workout__unit">m</span>
          </div>
        </li>`;
    }
    // console.log("workoutDate:", workoutDate.getDate());

    form.insertAdjacentHTML("afterend", html);

    // this._loadMap(workout);
  }

  _movePopup(e) {
    const workoutEl = e.target.closest(".workout");
    console.log(workoutEl);

    if (!workoutEl) return;

    console.log("this:", this);

    const elementId = workoutEl.dataset.id;

    console.log(this.#workouts);

    const moveWorkoutId = this.#workouts.find((work) => work.id === elementId);
    console.log("moveWorkoutId:", moveWorkoutId);

    this.#map.setView(moveWorkoutId.coords, 13, {
      animate: true,
      pan: {
        duration: 1,
      },
    });

    // moveWorkoutId.click();
  }

  _setLocalStorage() {
    localStorage.setItem("workouts", JSON.stringify(this.#workouts));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("workouts"));
    console.log(data);

    if (!data) return;

    this.#workouts = data;

    this.#workouts.forEach((work) => {
      console.log(this);

      this.renderWorkoutList(work);
    });
  }

  reset() {
    localStorage.removeItem("workouts");
    location.reload();
  }
}

// ---------------------------------------------
// End --------- App Class
// ---------------------------------------------

// ---------------------------------------------
// Creating Instances out of APP
// ---------------------------------------------

const app = new App();

// app._getPosition(); im commenting this because, here we are explicitly calling it, instead of this we will do it something once the instance was created, immediately it will call - to do that we will use constructor function - so this call goes to the constructor

// This is how geolocation works in javascript

// the below code im commenting, because this should be call when the dom is loaded.so this also moves to constructor function

// form.addEventListener("submit", function (e) {
//   e.preventDefault();
//   if (!inputDistance.value) return;

//   const { lat, lng } = leafletEvent.latlng;

//   L.marker([lat, lng])
//     .addTo(map)
//     .bindPopup(
//       L.popup({
//         maxWidth: 250,
//         minWidth: 100,
//         autoClose: false,
//         closeOnClick: false,
//         className: "running-popup",
//       })
//     )
//     .setPopupContent("Workout")
//     .openPopup();
// });

// // this change event will trigger - Form selection
// inputType.addEventListener("change", function () {
//   inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
//   inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
// });
