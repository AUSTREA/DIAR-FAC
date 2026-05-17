const firebaseConfig = {
  apiKey: "AIzaSyCxxxxxxxx",
  authDomain: "facturaapp-e22f6.firebaseapp.com",
  databaseURL: "https://facturaapp-e22f6-default-rtdb.firebaseio.com",
  projectId: "facturaapp-e22f6",
  storageBucket: "facturaapp-e22f6.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456:web:xxxxxx"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Base de datos
const db = firebase.database();