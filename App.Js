import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
  getAuth, createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { 
  getFirestore, doc, setDoc, 
  getDoc, updateDoc 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAZQRlfdtJjmodrfmct5N3qrLO6hniO2o8",
  authDomain: "proveed-8cb7c.firebaseapp.com",
  projectId: "proveed-8cb7c",
  storageBucket: "proveed-8cb7c.firebasestorage.app",
  messagingSenderId: "235073250367",
  appId: "1:235073250367:web:89ec59fea5f0b8a347448a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

/* 🔹 NAVEGACIÓN */
window.mostrar = function(id){
  document.querySelectorAll(".screen")
    .forEach(s => s.classList.remove("active"));
  document.getElementById(id)
    .classList.add("active");
};

/* 🔹 REGISTRO */
window.registrar = async function(){
  const tipo = document.getElementById("tipo").value;
  const nombre = document.getElementById("nombre").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const cred = await createUserWithEmailAndPassword(auth,email,password);

  await setDoc(doc(db,"usuarios",cred.user.uid),{
    tipo,nombre,email,
    perfilCompleto:false,
    dispositivosActivos:[]
  });

  mostrar("login");
};

/* 🔹 LOGIN */
window.login = async function(){
  await signInWithEmailAndPassword(auth,
    document.getElementById("loginEmail").value,
    document.getElementById("loginPassword").value
  );
};

/* 🔹 OBSERVADOR */
onAuthStateChanged(auth, async(user)=>{

  if(user){
    const snap = await getDoc(doc(db,"usuarios",user.uid));
    const data = snap.data();

    if(!data.perfilCompleto){
      mostrar("perfilEmprendedor");
    } else {
      mostrar("dashboardEmprendedor");
    }

  } else {
    mostrar("inicio");
  }

});

/* 🔹 LOGOUT */
window.logout = async function(){
  await signOut(auth);
};
