import { Personaje } from "./character-class.js";

export const API_URL = "https://rickandmortyapi.com/api/character";

const cardCharacter = document.querySelector(".card");
const buttons = document.querySelector(".buttons-paginado");
const buttonBackHome = document.querySelector(".button-back-home-element");
const buttonFilter = document.querySelector("#filter-button");
const buttonRemoveFilters = document.querySelector("#remove-filters-button");

const card = document.querySelector(".card");
const filterStatus = document.querySelector("#filter-status");
const filterGender = document.querySelector("#filter-gender");
const filterSpecies = document.querySelector("#filter-species");

let templateHTML;
let btnNext;
let btnPrev;

const getCharactersAndData = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  getDataCharacters(data.results);
  btnNext = `<button id="button-next" class="button-paginado" data-url=${data.info.next}>Next</button>`;
  btnPrev = `<button id="button-prev" class="button-paginado" data-url=${data.info.prev}>Prev</button>`;
  buttons.innerHTML = btnPrev + " " + btnNext;
};

const getCharacter = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  const data = await response.json();
  return data;
};

const getDataCharacters = async (data) => {
  cardCharacter.innerHTML = "";
  for (let index of data) {
    const response = await fetch(index.url);
    const resultCharacters = await response.json();
    templateHTML = `<div class="card-character">
      <img id="${resultCharacters.id}" src=${resultCharacters.image} alt=${resultCharacters.name} />
      <h2 id="${resultCharacters.id}">${resultCharacters.name}</h2>
      </div>`;
    cardCharacter.innerHTML += templateHTML;
  }
};

buttonFilter.addEventListener("click", async () => {
  const gender = filterGender.value;
  const status = filterStatus.value;
  const species = filterSpecies.value;

  const FILTER_URL = `${API_URL}?gender=${gender}&status=${status}&species=${species}`;
  getCharactersAndData(FILTER_URL);
});

buttonRemoveFilters.addEventListener("click", () => {
  filterGender.selectedIndex = 0;
  filterStatus.selectedIndex = 0;
  filterSpecies.selectedIndex = 0;
  getCharactersAndData(API_URL);
});

document.addEventListener("DOMContentLoaded", () => {
  getCharactersAndData(API_URL);
});

buttons.addEventListener("click", (e) => {
  console.log(e);
  if (e.target.classList.contains("button-paginado")) {
    let value = e.target.dataset.url;
    getCharactersAndData(value);
  }
});

buttonBackHome.addEventListener("click", () => {
  window.location.href = "../index.html";
});

card.addEventListener("click", async (e) => {
  let id = e.target.id;
  if (id) {
    const personaje = await getCharacter(id);
    const location = await getLocation(personaje.location.url);
    const personajeAGuardar = new Personaje(
      personaje.id,
      personaje.name,
      personaje.gender,
      personaje.image,
      personaje.species,
      personaje.status,
      personaje.origin.name,
      location.name,
      location.type,
      location.dimension,
      personaje.episode.length
    );

    localStorage.setItem("personajeABuscar", JSON.stringify(personajeAGuardar));
    window.location.href = "../pages/character.html";
  }
});

const getLocation = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};
