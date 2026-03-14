import { useState, useEffect, useRef } from "react";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore, collection, addDoc, getDocs, doc, setDoc,
  query, where, onSnapshot, serverTimestamp, orderBy, getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAZQRlfdtJjmodrfmct5N3qrLO6hniO2o8",
  authDomain: "proveed-8cb7c.firebaseapp.com",
  projectId: "proveed-8cb7c",
  storageBucket: "proveed-8cb7c.firebasestorage.app",
  messagingSenderId: "235073250367",
  appId: "1:235073250367:web:89ec59fea5f0b8a347448a"
};
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

const C = {
  lime: "#A8E63D", limeL: "#C5F261", limeD: "#8ACC1F",
  dark: "#07090400", dark2: "#0F1609", dark3: "#172010",
  gray: "#243318", gray2: "#2F4220", text: "#EBF5D5", textMuted: "#7A9960"
};

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0 }
  html, body, #root { height: 100%; }
  body {
    background: #07090400;
    background: linear-gradient(160deg, #0A0F05 0%, #0D1508 50%, #080C04 100%);
    color: ${C.text};
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }
  ::-webkit-scrollbar { width: 3px }
  ::-webkit-scrollbar-track { background: ${C.dark2} }
  ::-webkit-scrollbar-thumb { background: ${C.lime}; border-radius: 2px }
  input, select, textarea { outline: none; font-family: 'DM Sans', sans-serif }
  button { cursor: pointer; font-family: 'DM Sans', sans-serif }
  @keyframes fadeUp   { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:translateY(0) } }
  @keyframes fadeIn   { from { opacity:0 } to { opacity:1 } }
  @keyframes spin     { to { transform: rotate(360deg) } }
  @keyframes pulse    { 0%,100%{ opacity:1 } 50%{ opacity:.4 } }
  @keyframes slideUp  { from { transform:translateY(100%) } to { transform:translateY(0) } }
  .fadeUp   { animation: fadeUp .3s ease forwards }
  .fadeIn   { animation: fadeIn .25s ease forwards }
  .btn {
    border: none; border-radius: 14px; font-weight: 600;
    font-size: 15px; transition: all .18s; display: inline-flex;
    align-items: center; justify-content: center; gap: 8px;
  }
  .btn-lime { background: ${C.lime}; color: ${C.dark2}; padding: 13px 28px; }
  .btn-lime:hover  { background: ${C.limeL}; transform: translateY(-1px); box-shadow: 0 8px 24px #A8E63D33 }
  .btn-lime:active { transform: translateY(0); background: ${C.limeD} }
  .btn-ghost { background: transparent; color: ${C.lime}; border: 1.5px solid #A8E63D40; padding: 11px 24px; }
  .btn-ghost:hover { background: #A8E63D0E; border-color: ${C.lime} }
  .btn-icon { background: ${C.gray}; border: none; border-radius: 12px; padding: 10px; transition: all .18s }
  .btn-icon:hover { background: ${C.gray2} }
  .card {
    background: ${C.dark2}; border: 1px solid ${C.gray};
    border-radius: 20px; transition: all .2s;
  }
  .card-hover:hover { border-color: #A8E63D30; box-shadow: 0 6px 28px #A8E63D0A }
  .field {
    background: ${C.dark3}; border: 1.5px solid ${C.gray};
    border-radius: 13px; padding: 13px 16px; color: ${C.text};
    font-size: 14px; width: 100%; transition: border .2s;
  }
  .field:focus { border-color: ${C.lime} }
  .field::placeholder { color: ${C.textMuted} }
  select.field option { background: ${C.dark2} }
  .badge {
    display: inline-flex; align-items: center; gap: 5px;
    background: #A8E63D18; color: ${C.lime};
    border: 1px solid #A8E63D35; border-radius: 8px;
    padding: 4px 11px; font-size: 12px; font-weight: 500;
  }
  .chip {
    display: inline-flex; align-items: center; gap: 5px;
    background: ${C.gray}; color: ${C.textMuted};
    border-radius: 8px; padding: 4px 10px; font-size: 12px;
  }
  .divider { height: 1px; background: ${C.gray}; }
  .bottom-safe { padding-bottom: env(safe-area-inset-bottom, 16px) }
`;

// ─── ICONOS SVG PROFESIONALES ─────────────────────────────────────────────────
const Ico = ({ d, size = 20, color = "currentColor", fill = "none", stroke = 1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    {typeof d === "string" ? <path d={d} /> : d}
  </svg>
);

const ICONS = {
  search:   "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
  cart:     "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0",
  orders:   "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9l2 2 4-4",
  chat:     "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  user:     "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  plus:     "M12 5v14M5 12h14",
  send:     "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",
  back:     "M19 12H5M12 19l-7-7 7-7",
  close:    "M18 6L6 18M6 6l12 12",
  check:    "M20 6L9 17l-5-5",
  trash:    "M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2",
  logout:   "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  store:    "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10",
  box:      "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12",
  tag:      "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01",
  truck:    "M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  star:     "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  filter:   "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
  eye:      "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 12m-3 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0",
};

// Icono de categoría con fondo oscuro sutil
const CatIcon = ({ icon, size = 44 }) => (
  <div style={{
    width: size, height: size,
    background: "linear-gradient(135deg, #1A2610 0%, #131D0A 100%)",
    border: `1px solid #2A3820`,
    borderRadius: 14,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  }}>
    {icon}
  </div>
);

// SVG icons para categorías
const CAT_ICONS = {
  agro: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.lime} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22V12"/>
      <path d="M12 12C12 12 7 10 5 6c3 0 5.5 1.5 7 4C13.5 7.5 16 6 19 6c-2 4-7 6-7 6z"/>
      <path d="M5 22h14"/>
    </svg>
  ),
  moda: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.lime} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/>
    </svg>
  ),
  tecnologia: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.lime} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <path d="M8 21h8M12 17v4"/>
    </svg>
  ),
  ferreteria: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.lime} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  ),
  alimentos: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.lime} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3"/>
    </svg>
  ),
  belleza: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.lime} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
};

const CATEGORIES = [
  { id: "agro",       label: "Agro"       },
  { id: "moda",       label: "Moda"       },
  { id: "tecnologia", label: "Tecnología" },
  { id: "ferreteria", label: "Ferretería" },
  { id: "alimentos",  label: "Alimentos"  },
  { id: "belleza",    label: "Belleza"    },
];

// ─── LOGO ─────────────────────────────────────────────────────────────────────
function Logo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <polygon points="20,2 35,11 35,29 20,38 5,29 5,11" fill={C.lime}/>
      <polyline points="12,21 18,27 28,13" stroke="white" strokeWidth="2.8"
        strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

// ─── SPINNER ──────────────────────────────────────────────────────────────────
function Spinner({ size = 22 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      border: `2.5px solid ${C.gray2}`,
      borderTop: `2.5px solid ${C.lime}`,
      animation: "spin .75s linear infinite",
      display: "inline-block", flexShrink: 0
    }}/>
  );
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3200); return () => clearTimeout(t); }, []);
  const isErr = type === "error";
  return (
    <div style={{
      position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)",
      zIndex: 9999, background: isErr ? "#1A0808" : C.dark3,
      border: `1.5px solid ${isErr ? "#FF4444" : C.lime}`,
      borderRadius: 16, padding: "12px 20px",
      color: isErr ? "#FF8888" : C.text,
      fontSize: 14, fontWeight: 500,
      display: "flex", gap: 10, alignItems: "center",
      animation: "slideUp .25s ease",
      boxShadow: "0 8px 40px #00000060",
      whiteSpace: "nowrap", maxWidth: "88vw"
    }}>
      <div style={{
        width: 26, height: 26, borderRadius: 8,
        background: isErr ? "#FF444422" : "#A8E63D22",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
      }}>
        {isErr
          ? <Ico d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" size={14} color="#FF4444"/>
          : <Ico d={ICONS.check} size={14} color={C.lime}/>
        }
      </div>
      {msg}
      <button onClick={onClose} style={{ background: "none", border: "none", color: C.textMuted, marginLeft: 4, padding: 2, display: "flex" }}>
        <Ico d={ICONS.close} size={14} color={C.textMuted}/>
      </button>
    </div>
  );
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
function AuthScreen({ onLogin }) {
  const [mode, setMode]       = useState("login");
  const [email, setEmail]     = useState("");
  const [pass, setPass]       = useState("");
  const [name, setName]       = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast]     = useState(null);
  const [showPass, setShowPass] = useState(false);

  const submit = async () => {
    if (!email || !pass) return setToast({ msg: "Completa todos los campos", type: "error" });
    setLoading(true);
    try {
      if (mode === "register") {
        if (!name) return (setLoading(false), setToast({ msg: "Ingresa tu nombre", type: "error" }));
        const { user } = await createUserWithEmailAndPassword(auth, email, pass);
        await setDoc(doc(db, "users", user.uid), {
          name, email, role: "emprendedor", uid: user.uid, createdAt: serverTimestamp()
        });
        onLogin({ uid: user.uid, email, name, role: "emprendedor" });
      } else {
        const { user } = await signInWithEmailAndPassword(auth, email, pass);
        const snap = await getDoc(doc(db, "users", user.uid));
        const data = snap.exists() ? snap.data() : { role: "emprendedor", name: email };
        if (data.role !== "emprendedor") {
          await signOut(auth);
          return setToast({ msg: "Usa la app de Proveedor", type: "error" });
        }
        onLogin({ uid: user.uid, email: user.email, ...data });
      }
    } catch (e) {
      setToast({ msg: e.message.replace("Firebase: ", "").replace(/\(.*\)/g, "").trim(), type: "error" });
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 20px" }}>
      <style>{G}</style>
      <div style={{ position: "fixed", top: -80, right: -80, width: 280, height: 280, background: "radial-gradient(circle, #A8E63D14 0%, transparent 70%)", pointerEvents: "none" }}/>
      <div style={{ position: "fixed", bottom: -60, left: -60, width: 220, height: 220, background: "radial-gradient(circle, #A8E63D0A 0%, transparent 70%)", pointerEvents: "none" }}/>

      <div className="fadeUp" style={{ width: "100%", maxWidth: 400 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 6 }}>
            <Logo size={40}/>
            <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 30, fontWeight: 800, letterSpacing: "-0.5px" }}>PROVEED</span>
          </div>
          <p style={{ color: C.textMuted, fontSize: 13 }}>Marketplace B2B Ecuador 🇪🇨</p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: 28 }}>
          {/* Tabs */}
          <div style={{ display: "flex", background: C.dark3, borderRadius: 13, padding: 4, marginBottom: 24, gap: 3 }}>
            {["login","register"].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                flex: 1, padding: "9px", borderRadius: 10, border: "none",
                background: mode === m ? C.lime : "transparent",
                color: mode === m ? C.dark2 : C.textMuted,
                fontWeight: 600, fontSize: 14, transition: "all .2s"
              }}>
                {m === "login" ? "Iniciar sesión" : "Registrarse"}
              </button>
            ))}
          </div>

          {mode === "register" && (
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: C.textMuted, display: "block", marginBottom: 6, fontWeight: 500 }}>NOMBRE</label>
              <input className="field" placeholder="Tu nombre completo" value={name} onChange={e => setName(e.target.value)}/>
            </div>
          )}

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: C.textMuted, display: "block", marginBottom: 6, fontWeight: 500 }}>CORREO</label>
            <input className="field" type="email" placeholder="correo@empresa.com" value={email} onChange={e => setEmail(e.target.value)}/>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 12, color: C.textMuted, display: "block", marginBottom: 6, fontWeight: 500 }}>CONTRASEÑA</label>
            <div style={{ position: "relative" }}>
              <input className="field" type={showPass ? "text" : "password"} placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} style={{ paddingRight: 44 }}/>
              <button onClick={() => setShowPass(s => !s)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: C.textMuted, display: "flex" }}>
                <Ico d={ICONS.eye} size={17} color={C.textMuted}/>
              </button>
            </div>
          </div>

          <button className="btn btn-lime" onClick={submit} disabled={loading} style={{ width: "100%" }}>
            {loading ? <Spinner size={18}/> : (mode === "login" ? "Ingresar" : "Crear cuenta")}
          </button>

          <p style={{ textAlign: "center", fontSize: 12, color: C.textMuted, marginTop: 16 }}>
            Acceso exclusivo para <strong style={{ color: C.lime }}>Emprendedores</strong>
          </p>
        </div>
      </div>
      {toast && <Toast {...toast} onClose={() => setToast(null)}/>}
    </div>
  );
}

// ─── CHAT ─────────────────────────────────────────────────────────────────────
function ChatView({ user }) {
  const [contacts, setContacts] = useState([]);
  const [active, setActive]     = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText]         = useState("");
  const bottomRef = useRef();

  useEffect(() => {
    const q = query(collection(db, "users"), where("role", "==", "proveedor"));
    getDocs(q).then(snap => setContacts(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, []);

  useEffect(() => {
    if (!active) return;
    const chatId = [user.uid, active.id].sort().join("_");
    const q = query(collection(db, "chats", chatId, "messages"), orderBy("createdAt"));
    const unsub = onSnapshot(q, snap => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
    });
    return () => unsub();
  }, [active]);

  const send = async () => {
    if (!text.trim() || !active) return;
    const chatId = [user.uid, active.id].sort().join("_");
    await addDoc(collection(db, "chats", chatId, "messages"), {
      text: text.trim(), senderId: user.uid,
      senderName: user.name || user.email, createdAt: serverTimestamp()
    });
    setText("");
  };

  if (!active) return (
    <div className="fadeUp">
      <div style={{ padding: "0 0 16px" }}>
        <p style={{ fontSize: 13, color: C.textMuted }}>Contacta directamente a proveedores</p>
      </div>
      {contacts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "56px 0", color: C.textMuted }}>
          <CatIcon icon={<Ico d={ICONS.chat} size={22} color={C.textMuted}/>} size={52}/>
          <p style={{ marginTop: 14, fontSize: 14 }}>Sin proveedores registrados</p>
        </div>
      ) : contacts.map(c => (
        <div key={c.id} className="card card-hover" onClick={() => setActive(c)}
          style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", marginBottom: 8, cursor: "pointer" }}>
          <div style={{ width: 42, height: 42, borderRadius: 13, background: C.gray, border: `1.5px solid ${C.gray2}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Ico d={ICONS.store} size={18} color={C.lime}/>
          </div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{c.name || c.email}</div>
            <div style={{ fontSize: 12, color: C.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.email}</div>
          </div>
          <Ico d={ICONS.back} size={16} color={C.textMuted} stroke={1.5}/>
        </div>
      ))}
    </div>
  );

  return (
    <div className="fadeUp" style={{ display: "flex", flexDirection: "column", height: "calc(100dvh - 170px)" }}>
      {/* Header chat */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 14, borderBottom: `1px solid ${C.gray}`, marginBottom: 14 }}>
        <button className="btn-icon" onClick={() => setActive(null)} style={{ padding: 8 }}>
          <Ico d={ICONS.back} size={18} color={C.lime}/>
        </button>
        <div style={{ width: 38, height: 38, borderRadius: 12, background: C.gray, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Ico d={ICONS.store} size={16} color={C.lime}/>
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{active.name || active.email}</div>
          <div style={{ fontSize: 11, color: C.lime, display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.lime, animation: "pulse 2s infinite" }}/>
            En línea
          </div>
        </div>
      </div>

      {/* Mensajes */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", color: C.textMuted, fontSize: 13, padding: "32px 0" }}>
            Inicia la conversación 👋
          </div>
        )}
        {messages.map(m => {
          const mine = m.senderId === user.uid;
          return (
            <div key={m.id} style={{ display: "flex", justifyContent: mine ? "flex-end" : "flex-start" }}>
              <div style={{
                background: mine ? C.lime : C.dark3,
                color: mine ? C.dark2 : C.text,
                padding: "9px 14px", maxWidth: "76%", fontSize: 14,
                borderRadius: mine ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                fontWeight: mine ? 500 : 400, lineHeight: 1.45
              }}>
                {m.text}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef}/>
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: 8, paddingTop: 12 }}>
        <input className="field" placeholder="Escribe un mensaje..." value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          style={{ flex: 1, borderRadius: 16 }}/>
        <button className="btn btn-lime" onClick={send}
          style={{ padding: "0 18px", borderRadius: 16, flexShrink: 0 }}>
          <Ico d={ICONS.send} size={17} color={C.dark2}/>
        </button>
      </div>
    </div>
  );
}

// ─── EMPRENDEDOR APP ──────────────────────────────────────────────────────────
function EmprendedorApp({ user, onLogout }) {
  const [tab, setTab]       = useState("explore");
  const [products, setProducts] = useState([]);
  const [cart, setCart]     = useState([]);
  const [orders, setOrders] = useState([]);
  const [selCat, setSelCat] = useState(null);
  const [search, setSearch] = useState("");
  const [toast, setToast]   = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), snap =>
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "orders"), where("buyerId", "==", user.uid));
    const unsub = onSnapshot(q, snap =>
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, [user.uid]);

  const addToCart = (p) => {
    setCart(c => {
      const ex = c.find(x => x.id === p.id);
      return ex ? c.map(x => x.id === p.id ? { ...x, qty: x.qty + 1 } : x) : [...c, { ...p, qty: 1 }];
    });
    setToast({ msg: `${p.name} agregado`, type: "ok" });
  };

  const removeFromCart = (id) => setCart(c => c.filter(x => x.id !== id));

  const placeOrder = async () => {
    if (!cart.length) return;
    const total = cart.reduce((s, x) => s + x.price * x.qty, 0);
    await addDoc(collection(db, "orders"), {
      buyerId: user.uid, buyerName: user.name || user.email,
      items: cart, total, status: "pendiente",
      createdAt: serverTimestamp(), sellerId: cart[0].sellerId || "unknown"
    });
    setCart([]);
    setTab("orders");
    setToast({ msg: "¡Pedido realizado!", type: "ok" });
  };

  const filtered = products.filter(p =>
    (!selCat || p.category === selCat) &&
    (!search || p.name?.toLowerCase().includes(search.toLowerCase()))
  );

  const cartCount = cart.reduce((s, x) => s + x.qty, 0);
  const cartTotal = cart.reduce((s, x) => s + x.price * x.qty, 0);

  const STATUS_COLOR = {
    pendiente:  { bg: "#A8E63D11", border: C.gray,  color: C.textMuted },
    despachado: { bg: "#2244FF14", border: "#3355AA", color: "#7799FF" },
    entregado:  { bg: "#A8E63D18", border: C.lime,   color: C.lime     },
  };

  const NAV = [
    { id: "explore", icon: ICONS.search, label: "Explorar" },
    { id: "cart",    icon: ICONS.cart,   label: "Carrito",  badge: cartCount },
    { id: "orders",  icon: ICONS.orders, label: "Pedidos"   },
    { id: "chat",    icon: ICONS.chat,   label: "Chat"      },
    { id: "profile", icon: ICONS.user,   label: "Perfil"    },
  ];

  return (
    <div style={{ minHeight: "100dvh", background: "transparent", paddingBottom: 72 }}>
      <style>{G}</style>

      {/* Header */}
      <div style={{
        background: "#0D160880", backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${C.gray}`, padding: "12px 18px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <Logo size={28}/>
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18 }}>PROVEED</span>
          <span className="badge" style={{ fontSize: 10, padding: "2px 8px" }}>Emprendedor</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.lime, animation: "pulse 2s infinite" }}/>
          <span style={{ fontSize: 12, color: C.textMuted }}>{(user.name || user.email).split(" ")[0]}</span>
        </div>
      </div>

      {/* Page title */}
      <div style={{ padding: "18px 18px 0" }}>
        <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, marginBottom: 2 }}>
          {{ explore: "Explorar", cart: "Mi carrito", orders: "Mis pedidos", chat: "Chat B2B", profile: "Mi perfil" }[tab]}
        </h1>
      </div>

      <div style={{ padding: "14px 18px" }}>

        {/* ── EXPLORE ── */}
        {tab === "explore" && (
          <div className="fadeUp">
            {/* Buscador */}
            <div style={{ position: "relative", marginBottom: 14 }}>
              <div style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }}>
                <Ico d={ICONS.search} size={16} color={C.textMuted}/>
              </div>
              <input className="field" placeholder="Buscar productos..." value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: 38 }}/>
            </div>

            {/* Categorías */}
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 10, marginBottom: 16, scrollbarWidth: "none" }}>
              <button onClick={() => setSelCat(null)} style={{
                flexShrink: 0, padding: "7px 14px", borderRadius: 20,
                border: `1.5px solid ${!selCat ? C.lime : C.gray}`,
                background: !selCat ? "#A8E63D18" : "transparent",
                color: !selCat ? C.lime : C.textMuted, fontSize: 13, fontWeight: 500
              }}>Todos</button>
              {CATEGORIES.map(c => (
                <button key={c.id} onClick={() => setSelCat(selCat === c.id ? null : c.id)} style={{
                  flexShrink: 0, padding: "7px 14px", borderRadius: 20, display: "flex", alignItems: "center", gap: 6,
                  border: `1.5px solid ${selCat === c.id ? C.lime : C.gray}`,
                  background: selCat === c.id ? "#A8E63D18" : "transparent",
                  color: selCat === c.id ? C.lime : C.textMuted, fontSize: 13, fontWeight: 500
                }}>
                  <div style={{ width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {CAT_ICONS[c.id] && <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke={selCat === c.id ? C.lime : C.textMuted} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      {/* reutilizamos el icono clonando solo el path */}
                    </svg>}
                  </div>
                  {c.label}
                </button>
              ))}
            </div>

            {/* Grid productos */}
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "56px 0", color: C.textMuted }}>
                <CatIcon icon={<Ico d={ICONS.box} size={22} color={C.textMuted}/>} size={56}/>
                <p style={{ marginTop: 14, fontSize: 14 }}>Sin productos disponibles</p>
                <p style={{ fontSize: 12, marginTop: 4 }}>Los proveedores están cargando catálogo</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {filtered.map(p => {
                  const catIcon = CAT_ICONS[p.category];
                  return (
                    <div key={p.id} className="card card-hover" style={{ padding: 14 }}>
                      {/* Imagen/icono */}
                      <div style={{
                        background: "linear-gradient(135deg, #1A2610 0%, #131D0A 100%)",
                        border: `1px solid ${C.gray}`, borderRadius: 14,
                        height: 88, marginBottom: 12,
                        display: "flex", alignItems: "center", justifyContent: "center"
                      }}>
                        {catIcon || <Ico d={ICONS.box} size={26} color={C.textMuted}/>}
                      </div>
                      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 5, lineHeight: 1.35 }}>{p.name}</div>
                      <span className="chip" style={{ marginBottom: 8, display: "inline-flex" }}>{p.category}</span>
                      <div style={{ color: C.lime, fontWeight: 700, fontSize: 16, marginBottom: 3 }}>${p.price?.toFixed(2)}</div>
                      <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 10 }}>Stock: {p.stock || 0}</div>
                      <button className="btn btn-lime" onClick={() => addToCart(p)}
                        style={{ width: "100%", padding: "9px", fontSize: 13, borderRadius: 12 }}>
                        <Ico d={ICONS.plus} size={14} color={C.dark2}/>
                        Agregar
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── CART ── */}
        {tab === "cart" && (
          <div className="fadeUp">
            {cart.length === 0 ? (
              <div style={{ textAlign: "center", padding: "56px 0", color: C.textMuted }}>
                <CatIcon icon={<Ico d={ICONS.cart} size={22} color={C.textMuted}/>} size={56}/>
                <p style={{ marginTop: 14, fontSize: 14 }}>Tu carrito está vacío</p>
              </div>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.id} className="card" style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 15px", marginBottom: 8 }}>
                    <CatIcon icon={CAT_ICONS[item.category] || <Ico d={ICONS.box} size={18} color={C.textMuted}/>} size={42}/>
                    <div style={{ flex: 1, overflow: "hidden" }}>
                      <div style={{ fontWeight: 600, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</div>
                      <div style={{ fontSize: 12, color: C.textMuted }}>x{item.qty} × ${item.price?.toFixed(2)}</div>
                    </div>
                    <div style={{ color: C.lime, fontWeight: 700, fontSize: 15 }}>${(item.price * item.qty).toFixed(2)}</div>
                    <button className="btn-icon" onClick={() => removeFromCart(item.id)} style={{ padding: 7 }}>
                      <Ico d={ICONS.trash} size={15} color="#FF6666"/>
                    </button>
                  </div>
                ))}

                <div className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 18px", marginTop: 4, marginBottom: 16 }}>
                  <span style={{ fontWeight: 600, fontSize: 15 }}>Total</span>
                  <span style={{ color: C.lime, fontSize: 22, fontWeight: 800 }}>${cartTotal.toFixed(2)}</span>
                </div>

                <button className="btn btn-lime" onClick={placeOrder} style={{ width: "100%", padding: 15, fontSize: 16 }}>
                  <Ico d={ICONS.check} size={18} color={C.dark2}/>
                  Confirmar pedido
                </button>
              </>
            )}
          </div>
        )}

        {/* ── ORDERS ── */}
        {tab === "orders" && (
          <div className="fadeUp">
            {orders.length === 0 ? (
              <div style={{ textAlign: "center", padding: "56px 0", color: C.textMuted }}>
                <CatIcon icon={<Ico d={ICONS.orders} size={22} color={C.textMuted}/>} size={56}/>
                <p style={{ marginTop: 14, fontSize: 14 }}>No tienes pedidos aún</p>
              </div>
            ) : orders.map(o => {
              const sc = STATUS_COLOR[o.status] || STATUS_COLOR.pendiente;
              return (
                <div key={o.id} className="card" style={{ marginBottom: 10, padding: "16px 18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>#{o.id.slice(-6).toUpperCase()}</div>
                      <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{o.items?.length} producto(s)</div>
                    </div>
                    <div style={{ background: sc.bg, border: `1px solid ${sc.border}`, borderRadius: 8, padding: "3px 10px", fontSize: 12, color: sc.color, fontWeight: 500 }}>
                      {o.status}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: C.textMuted, fontSize: 12 }}>
                      <Ico d={ICONS.truck} size={14} color={C.textMuted}/>
                      {o.status === "entregado" ? "Entregado" : o.status === "despachado" ? "En camino" : "Procesando"}
                    </div>
                    <div style={{ color: C.lime, fontWeight: 800, fontSize: 18 }}>${o.total?.toFixed(2)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
{/* ── CHAT ── */}
        {tab === "chat" && <ChatView user={user}/>}

        {/* ── PROFILE ── */}
        {tab === "profile" && (
          <div className="fadeUp">
            <div className="card" style={{ textAlign: "center", padding: "32px 24px", marginBottom: 12 }}>
              <div style={{
                width: 68, height: 68, borderRadius: "50%",
                background: "#A8E63D18", border: `2px solid ${C.lime}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 14px"
              }}>
                <Ico d={ICONS.user} size={28} color={C.lime}/>
              </div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 18 }}>{user.name || "Emprendedor"}</div>
              <div style={{ color: C.textMuted, fontSize: 13, marginBottom: 12 }}>{user.email}</div>
              <span className="badge">Emprendedor</span>
            </div>

            <div className="card" style={{ padding: "14px 18px", marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", color: C.textMuted, fontSize: 14 }}>
                  <Ico d={ICONS.orders} size={15} color={C.textMuted}/>
                  Pedidos realizados
                </div>
                <span style={{ fontWeight: 700, color: C.lime, fontSize: 16 }}>{orders.length}</span>
              </div>
            </div>

            <div className="card" style={{ padding: "14px 18px", marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", color: C.textMuted, fontSize: 14 }}>
                  <Ico d={ICONS.check} size={15} color={C.textMuted}/>
                  Pedidos entregados
                </div>
                <span style={{ fontWeight: 700, color: C.lime, fontSize: 16 }}>{orders.filter(o => o.status === "entregado").length}</span>
              </div>
            </div>

            <button className="btn btn-ghost" onClick={onLogout}
              style={{ width: "100%", marginTop: 8, padding: "13px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <Ico d={ICONS.logout} size={16} color={C.lime}/>
              Cerrar sesión
            </button>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "#0D160895", backdropFilter: "blur(20px)",
        borderTop: `1px solid ${C.gray}`,
        display: "flex", justifyContent: "space-around",
        padding: "8px 0 16px", zIndex: 200
      }}>
        {NAV.map(n => (
          <button key={n.id} onClick={() => setTab(n.id)} style={{
            background: "none", border: "none", display: "flex",
            flexDirection: "column", alignItems: "center", gap: 4,
            color: tab === n.id ? C.lime : C.textMuted,
            fontSize: 10, fontWeight: tab === n.id ? 600 : 400,
            position: "relative", minWidth: 52, transition: "color .15s"
          }}>
            <div style={{
              width: 36, height: 30, display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: 10, background: tab === n.id ? "#A8E63D18" : "transparent",
              transition: "background .2s"
            }}>
              <Ico d={n.icon} size={20} color={tab === n.id ? C.lime : C.textMuted}/>
            </div>
            {n.label}
            {n.badge > 0 && (
              <div style={{
                position: "absolute", top: 0, right: 6,
                background: C.lime, color: C.dark2, borderRadius: "50%",
                width: 16, height: 16, fontSize: 9, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>{n.badge}</div>
            )}
          </button>
        ))}
      </div>

      {toast && <Toast {...toast} onClose={() => setToast(null)}/>}
    </div>
  );

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async fbUser => {
      if (fbUser) {
        const snap = await getDoc(doc(db, "users", fbUser.uid));
        const data = snap.exists() ? snap.data() : { role: "emprendedor" };
        setUser({ uid: fbUser.uid, email: fbUser.email, ...data });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return (
    <div style={{ minHeight: "100dvh", background: "#080C04", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <style>{G}</style>
      <Logo size={52}/>
      <Spinner size={24}/>
      <p style={{ color: C.textMuted, fontSize: 13 }}>Conectando...</p>
    </div>
  );

  if (!user) return <AuthScreen onLogin={setUser}/>;

  return (
    <EmprendedorApp
      user={user}
      onLogout={async () => { await signOut(auth); setUser(null); }}
    />
  );
}