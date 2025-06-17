// 🔑 Tu API key de OMDb
const OMDB_API_KEY = '1ad798cc';
/* http://www.omdbapi.com/?i=tt3896198&apikey=1ad798cc */
// 🔥 Configuración de Firebase (reemplaza con la tuya desde Firebase Console)
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

// Al iniciar
cargarLista();
