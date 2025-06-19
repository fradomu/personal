// 🔑 Tu API key de OMDb
const OMDB_API_KEY = '1ad798cc';
/* http://www.omdbapi.com/?i=tt3896198&apikey=1ad798cc */
// 🔥 Configuración de Firebase (reemplaza con la tuya desde Firebase Console)

/*
    TODO LIST

    COLECCIÓN DE PELICULAS VISTAS
    MEJORAR VISUALMENTE LA PÁGINA
        - TARJETAS O LISTA PARA LAS PELICULAS PENDIENTES/VISTAS
        - COLORES, USAR BOOTSTRAP
        - MENÚ DESPLEGABLE PARA ESCOGER LA PELÍCULAS QUE SE QUIERE DE FORMA DINÁMICA (usar DEBOUNCE para no hacer más de 1000 consultas a la API)
        - Agregar campo de Orden a la colección de peliculas pendientes
            - Este campo se rellena de forma automatica pero se puede modificar (aun no se si de 1 en 1 con flechas o un sistema de arrastrar)
    QUE LAS PELÍCULAS VISTAS SEAN EN UN DESPLEGABLE?
    ORDENAR LAS PELICULAS PENDIENTES
    MIRAR SI EL JSON SE PUEDE PONER EN UN ARCHIVO APARTE O AQUI MISMO COMO VARIABLE PARA USAR EN DESARROLLO

    PENSAR EN UN FUTURO AÑADIR NUEVAS FUNCIONALIDADES CON UN MENÚ DESPLEGABLE A LA IZQUIERDA
*/
const firebaseConfig = {
  apiKey: "AIzaSyCg3b6VrR1WfxmK4vgdhIdBCUSBSXa5cNA",
  authDomain: "movie-list-587d4.firebaseapp.com",
  projectId: "movie-list-587d4",
  storageBucket: "movie-list-587d4.firebasestorage.app",
  messagingSenderId: "421026767535",
  appId: "1:421026767535:web:04e24228a5e7fbd8baaa5a"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const listRef = db.collection('peliculas_pendientes');

document.getElementById('searchBtn').addEventListener('click', () => {
  const query = document.getElementById('searchInput').value;
  if (query) {
    buscarPeliculas(query);
  }
});

async function buscarPeliculas(query) {
  const res = await fetch(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}`);
  const data = await res.json();
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  if (data.Search) {
    data.Search.forEach(pelicula => {
      const div = document.createElement('div');
      div.innerHTML = `
        <strong>${pelicula.Title}</strong> (${pelicula.Year})
        <button onclick='guardarPelicula(${JSON.stringify(pelicula)})'>Agregar</button>
      `;
      resultsDiv.appendChild(div);
    });
  } else {
    resultsDiv.innerHTML = 'No se encontraron resultados.';
  }
}

async function guardarPelicula(pelicula) {
  try {
    const doc = await listRef.doc(pelicula.imdbID).get();
    if (!doc.exists) {
      await listRef.doc(pelicula.imdbID).set(pelicula);
      cargarLista();
    } else {
      alert('Ya está en tu lista.');
    }
  } catch (e) {
    console.error('Error al guardar:', e);
  }
}

async function cargarLista() {
  const ul = document.getElementById('pendingList');
  ul.innerHTML = '';
  const snapshot = await listRef.get();
  snapshot.forEach(doc => {
    const pelicula = doc.data();
    const li = document.createElement('li');
    li.textContent = `${pelicula.Title} (${pelicula.Year})`;
    ul.appendChild(li);
  });
}

/*
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);          // Cancela la ejecución anterior
    timeoutId = setTimeout(() => {
      func.apply(this, args);         // Ejecuta la función tras el retraso
    }, delay);
  };
}

function buscarPeliculas(query) {
  console.log("Buscando:", query);
  // Aquí harías tu fetch a la API con `query`
}

const input = document.getElementById("search");

// Creamos la versión “debounced” de la función de búsqueda con 500ms de retraso
const buscarPeliculasDebounced = debounce(buscarPeliculas, 500);

input.addEventListener("input", (event) => {
  const texto = event.target.value.trim();
  if (texto.length > 2) {             // Buscar solo si hay más de 2 caracteres
    buscarPeliculasDebounced(texto);
  }
});
*/

// Al iniciar
cargarLista();

/*

EJEMPLO JSON (SE PUEDE UTILIZAR PARA NO CONSULTAR TANTO A LA API?)

{
  "Search": [
    {
      "Title": "Harry Potter and the Deathly Hallows: Part 2",
      "Year": "2011",
      "imdbID": "tt1201607",
      "Type": "movie",
      "Poster": "https://m.media-amazon.com/images/M/MV5BOTA1Mzc2N2ItZWRiNS00MjQzLTlmZDQtMjU0NmY1YWRkMGQ4XkEyXkFqcGc@._V1_SX300.jpg"
    },
    {
      "Title": "Harry Potter and the Sorcerer's Stone",
      "Year": "2001",
      "imdbID": "tt0241527",
      "Type": "movie",
      "Poster": "https://m.media-amazon.com/images/M/MV5BNTU1MzgyMDMtMzBlZS00YzczLThmYWEtMjU3YmFlOWEyMjE1XkEyXkFqcGc@._V1_SX300.jpg"
    },
    {
      "Title": "Harry Potter and the Prisoner of Azkaban",
      "Year": "2004",
      "imdbID": "tt0304141",
      "Type": "movie",
      "Poster": "https://m.media-amazon.com/images/M/MV5BMTY4NTIwODg0N15BMl5BanBnXkFtZTcwOTc0MjEzMw@@._V1_SX300.jpg"
    },
    {
      "Title": "Harry Potter and the Chamber of Secrets",
      "Year": "2002",
      "imdbID": "tt0295297",
      "Type": "movie",
      "Poster": "https://m.media-amazon.com/images/M/MV5BNGJhM2M2MWYtZjIzMC00MDZmLThkY2EtOWViMDhhYjRhMzk4XkEyXkFqcGc@._V1_SX300.jpg"
    },
    {
      "Title": "Harry Potter and the Goblet of Fire",
      "Year": "2005",
      "imdbID": "tt0330373",
      "Type": "movie",
      "Poster": "https://m.media-amazon.com/images/M/MV5BMTI1NDMyMjExOF5BMl5BanBnXkFtZTcwOTc4MjQzMQ@@._V1_SX300.jpg"
    },
    {
      "Title": "Harry Potter and the Order of the Phoenix",
      "Year": "2007",
      "imdbID": "tt0373889",
      "Type": "movie",
      "Poster": "https://m.media-amazon.com/images/M/MV5BYWJmM2M1YzItMjY1Ni00YzRmLTg5YWYtNDFmNTJjNzQ0ODkyXkEyXkFqcGc@._V1_SX300.jpg"
    },
    {
      "Title": "Harry Potter and the Half-Blood Prince",
      "Year": "2009",
      "imdbID": "tt0417741",
      "Type": "movie",
      "Poster": "https://m.media-amazon.com/images/M/MV5BNzU3NDg4NTAyNV5BMl5BanBnXkFtZTcwOTg2ODg1Mg@@._V1_SX300.jpg"
    },
    {
      "Title": "Harry Potter and the Deathly Hallows: Part 1",
      "Year": "2010",
      "imdbID": "tt0926084",
      "Type": "movie",
      "Poster": "https://m.media-amazon.com/images/M/MV5BMTQ2OTE1Mjk0N15BMl5BanBnXkFtZTcwODE3MDAwNA@@._V1_SX300.jpg"
    },
    {
      "Title": "Harry Potter 20th Anniversary: Return to Hogwarts",
      "Year": "2022",
      "imdbID": "tt16116174",
      "Type": "movie",
      "Poster": "https://m.media-amazon.com/images/M/MV5BZTNhNjg1NWItZThkNC00N2JiLTkzOTgtNzZjYzAyYTQ4OTEwXkEyXkFqcGc@._V1_SX300.jpg"
    },
    {
      "Title": "Harry Potter and the Forbidden Journey",
      "Year": "2010",
      "imdbID": "tt1756545",
      "Type": "movie",
      "Poster": "https://m.media-amazon.com/images/M/MV5BNDM0YzMyNGUtMTU1Yy00OTE2LWE5NzYtZDZhMTBmN2RkNjg3XkEyXkFqcGdeQXVyMzU5NjU1MDA@._V1_SX300.jpg"
    }
  ],
  "totalResults": "159",
  "Response": "True"
}

*/