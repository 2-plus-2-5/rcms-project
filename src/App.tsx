import { useState, useMemo, useEffect, useRef, useContext, createContext, useCallback } from "react";
import {
  BookOpen, Users, Calendar, TrendingUp, Search, Plus, Settings,
  Home, X, ArrowLeft, BookMarked, Clock, Check, Bell,
  Eye, Edit, Trash2, Mail, Phone, MapPin, Star, Activity,
  ChevronRight, ChevronLeft, UserPlus, Grid, List, Hash,
  AlertTriangle
} from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// ─── STYLES ──────────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
    .rcms*,.rcms*::before,.rcms*::after{box-sizing:border-box;margin:0;padding:0}
    .rcms{font-family:'Inter',-apple-system,sans-serif;background:#0B1020;color:#F5F7FA;min-height:100vh;-webkit-font-smoothing:antialiased}
    .rcms h1,.rcms h2,.rcms h3,.rcms h4,.rcms h5{font-family:'Space Grotesk',-apple-system,sans-serif}
    .rcms ::-webkit-scrollbar{width:3px;height:3px}
    .rcms ::-webkit-scrollbar-thumb{background:rgba(109,93,246,.25);border-radius:2px}
    .rcms ::-webkit-scrollbar-track{background:transparent}

    @keyframes rcms-up{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
    @keyframes rcms-in{from{opacity:0}to{opacity:1}}
    @keyframes rcms-scale{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
    @keyframes rcms-right{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
    @keyframes rcms-toast{from{opacity:0;transform:translateY(10px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}
    @keyframes rcms-toast-out{from{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(.94)}}
    @keyframes rcms-skel{0%{background-position:-200% 0}100%{background-position:200% 0}}
    @keyframes rcms-ping{0%{transform:scale(1);opacity:1}75%,100%{transform:scale(1.9);opacity:0}}
    @keyframes rcms-cmd-in{from{opacity:0;transform:translateY(-8px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}

    .up{animation:rcms-up .45s cubic-bezier(.16,1,.3,1) both}
    .fin{animation:rcms-in .3s ease both}
    .sc{animation:rcms-scale .28s cubic-bezier(.16,1,.3,1) both}
    .dr{animation:rcms-right .32s cubic-bezier(.16,1,.3,1) both}
    .ti{animation:rcms-toast .3s cubic-bezier(.16,1,.3,1) both}
    .to{animation:rcms-toast-out .22s ease forwards}
    .ci{animation:rcms-cmd-in .28s cubic-bezier(.16,1,.3,1) both}
    .d1{animation-delay:.04s}.d2{animation-delay:.09s}.d3{animation-delay:.14s}
    .d4{animation-delay:.19s}.d5{animation-delay:.24s}.d6{animation-delay:.29s}
    .d7{animation-delay:.34s}.d8{animation-delay:.39s}

    .skel{background:linear-gradient(90deg,rgba(255,255,255,.04) 25%,rgba(255,255,255,.09) 50%,rgba(255,255,255,.04) 75%);background-size:200% 100%;animation:rcms-skel 1.4s ease infinite;border-radius:8px}

    /* Sidebar */
    .sb{position:fixed;top:0;left:0;height:100vh;background:#0D1525;border-right:1px solid rgba(255,255,255,.05);transition:width .32s cubic-bezier(.16,1,.3,1);z-index:200;display:flex;flex-direction:column;overflow:hidden}
    .ni{display:flex;align-items:center;gap:11px;padding:9px 14px;margin:1px 8px;border-radius:10px;cursor:pointer;color:#8A94A6;font-size:13.5px;font-weight:500;transition:all .18s ease;white-space:nowrap;overflow:hidden;position:relative;user-select:none;border:none;background:transparent;font-family:'Inter',sans-serif}
    .ni:hover{background:rgba(109,93,246,.08);color:#D8DCE8}
    .ni.on{background:rgba(109,93,246,.14);color:#F5F7FA}
    .ni.on::before{content:'';position:absolute;left:0;top:50%;transform:translateY(-50%);width:3px;height:55%;background:#6D5DF6;border-radius:0 2px 2px 0;box-shadow:0 0 10px rgba(109,93,246,.9)}

    /* Cards */
    .card{background:#121A2A;border:1px solid rgba(255,255,255,.06);border-radius:16px;transition:border-color .2s,transform .2s,box-shadow .2s}
    .cl:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(0,0,0,.35);border-color:rgba(109,93,246,.22)}

    /* Buttons */
    .bp{background:#6D5DF6;color:#fff;border:none;border-radius:10px;padding:9px 18px;font-size:13.5px;font-weight:500;cursor:pointer;transition:all .18s ease;display:inline-flex;align-items:center;gap:7px;font-family:'Inter',sans-serif;white-space:nowrap;user-select:none}
    .bp:hover{background:#7B6CF8;box-shadow:0 4px 20px rgba(109,93,246,.45);transform:translateY(-1px)}
    .bp:active{transform:scale(.97)}
    .bp:disabled{opacity:.45;cursor:not-allowed;transform:none;box-shadow:none}
    .bg{background:transparent;color:#8A94A6;border:1px solid rgba(255,255,255,.09);border-radius:10px;padding:9px 18px;font-size:13.5px;font-weight:500;cursor:pointer;transition:all .18s ease;display:inline-flex;align-items:center;gap:7px;font-family:'Inter',sans-serif}
    .bg:hover{background:rgba(255,255,255,.05);color:#F5F7FA;border-color:rgba(255,255,255,.14)}
    .bg:active{transform:scale(.97)}
    .bi{background:transparent;border:none;color:#8A94A6;cursor:pointer;padding:7px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;transition:all .15s ease}
    .bi:hover{background:rgba(255,255,255,.07);color:#F5F7FA}
    .bi:active{transform:scale(.92)}

    /* Inputs */
    .inp{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.09);border-radius:10px;padding:10px 14px;color:#F5F7FA;font-size:13.5px;width:100%;font-family:'Inter',sans-serif;transition:all .18s ease;outline:none}
    .inp:focus{border-color:rgba(109,93,246,.55);background:rgba(109,93,246,.05);box-shadow:0 0 0 3px rgba(109,93,246,.12)}
    .inp::placeholder{color:#8A94A6}
    textarea.inp{resize:vertical;min-height:90px}
    .sel{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.09);border-radius:10px;padding:10px 14px;color:#F5F7FA;font-size:13.5px;font-family:'Inter',sans-serif;width:100%;appearance:none;cursor:pointer;outline:none;transition:all .18s}
    .sel:focus{border-color:rgba(109,93,246,.55);box-shadow:0 0 0 3px rgba(109,93,246,.12)}
    .sel option{background:#1A2540}

    /* Table */
    .tbl{width:100%;border-collapse:collapse}
    .tbl th{text-align:left;padding:11px 16px;color:#8A94A6;font-size:11.5px;font-weight:500;text-transform:uppercase;letter-spacing:.06em;border-bottom:1px solid rgba(255,255,255,.05);white-space:nowrap}
    .tbl td{padding:13px 16px;font-size:13.5px;border-bottom:1px solid rgba(255,255,255,.04);transition:background .12s}
    .tbl tr{cursor:pointer}
    .tbl tr:hover td{background:rgba(255,255,255,.025)}
    .tbl tr:last-child td{border-bottom:none}

    /* Segment */
    .seg{display:flex;background:rgba(255,255,255,.04);border-radius:9px;padding:3px;gap:2px}
    .seg-btn{padding:5px 13px;border-radius:7px;font-size:12.5px;font-weight:500;color:#8A94A6;cursor:pointer;transition:all .18s;border:none;background:transparent;font-family:'Inter',sans-serif;display:inline-flex;align-items:center;gap:5px}
    .seg-btn.on{background:#121A2A;color:#F5F7FA;box-shadow:0 1px 6px rgba(0,0,0,.3)}

    /* Misc */
    .tag{display:inline-flex;align-items:center;padding:3px 9px;border-radius:20px;font-size:11.5px;font-weight:500;white-space:nowrap}
    .tagi{background:rgba(109,93,246,.1);color:rgba(180,172,255,.9);border:1px solid rgba(109,93,246,.2)}
    .ptab{padding:7px 15px;font-size:13.5px;font-weight:500;color:#8A94A6;cursor:pointer;border-radius:8px;transition:all .18s;border:none;background:transparent;font-family:'Inter',sans-serif}
    .ptab:hover{color:#F5F7FA}
    .ptab.on{background:rgba(109,93,246,.14);color:#F5F7FA}
    .pt{height:3px;background:rgba(255,255,255,.06);border-radius:2px;overflow:hidden}
    .pf{height:100%;border-radius:2px;transition:width 1s cubic-bezier(.16,1,.3,1)}
    .chk{width:18px;height:18px;border-radius:5px;border:1.5px solid rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;flex-shrink:0}
    .chk.on{background:#6D5DF6;border-color:#6D5DF6}
    .page{padding:32px;overflow-y:auto;max-height:100vh}

    /* Overlays */
    .backdrop{position:fixed;inset:0;background:rgba(11,16,32,.78);backdrop-filter:blur(5px);z-index:500}
    .drawer{position:fixed;right:0;top:0;height:100vh;width:420px;background:#0E1828;border-left:1px solid rgba(255,255,255,.07);z-index:801;overflow-y:auto}
    .drawer-bd{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:800}

    /* Cmd palette */
    .cr{display:flex;align-items:center;gap:12px;padding:9px 20px;cursor:pointer;transition:background .1s}
    .cr:hover,.cr.foc{background:rgba(109,93,246,.11)}
    .cr.foc .ca{opacity:1}
    .ca{opacity:0;transition:opacity .1s;margin-left:auto;flex-shrink:0}

    /* Toast */
    .toast-wrap{position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px;pointer-events:none}
    .toast-item{pointer-events:all;min-width:280px;max-width:360px;background:#18243C;border-radius:13px;padding:13px 16px;display:flex;align-items:center;gap:11px;box-shadow:0 8px 40px rgba(0,0,0,.5);cursor:pointer}

    /* Notif dot */
    .ndot{position:absolute;top:6px;right:6px;width:7px;height:7px;border-radius:50%;background:#E06C75;border:1.5px solid #0D1525}
    .ndot::after{content:'';position:absolute;inset:-2px;border-radius:50%;background:#E06C75;opacity:.5;animation:rcms-ping 1.5s ease infinite}

    kbd{font-family:'Inter',sans-serif;font-size:11px;background:rgba(255,255,255,.08);color:#8A94A6;padding:2px 6px;border-radius:5px;border:1px solid rgba(255,255,255,.1)}
  `}</style>
);

// ─── CONSTANTS & DATA ────────────────────────────────────────────────────────
const C = { bg:"#0B1020",sur:"#121A2A",pri:"#6D5DF6",acc:"#D6A756",suc:"#3EB489",txt:"#F5F7FA",mut:"#8A94A6",dan:"#E06C75",blu:"#61AFEF",pur:"#C678DD",tea:"#56B6C2",grn:"#98C379" };
const PAL = [C.pri,C.acc,C.suc,C.dan,C.blu,C.pur,C.tea,C.grn];
const gc = (n: string) => PAL[n.charCodeAt(0)%PAL.length];
const gi = (n: string) => n.split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase();

// ─── TYPES ───────────────────────────────────────────────────────────────────
type Member = typeof MEMBERS[number];
type Config = {
  name: string;
  desc: string;
  location: string;
  email: string;
  website: string;
  notifyEvent: boolean;
  notifyMember: boolean;
  notifyDigest: boolean;
  maxEvent: number;
  autoWelcome: boolean;
};
type ConfirmConfig = {
  title: string;
  msg: string;
  onConfirm: () => void;
  variant?: "danger" | "info";
};

const IOPTS = [
  {l:"Literary Fiction",e:"📚"},{l:"Non-Fiction",e:"📖"},{l:"Poetry",e:"✍"},{l:"History",e:"🏛"},
  {l:"Science",e:"🔬"},{l:"Philosophy",e:"🧠"},{l:"Biography",e:"👤"},{l:"Mystery",e:"🔍"},
  {l:"Fantasy",e:"🐉"},{l:"Self-Help",e:"🌱"},{l:"Business",e:"💼"},{l:"Travel",e:"✈"},
  {l:"Culture",e:"🎭"},{l:"Psychology",e:"🧪"},{l:"Classics",e:"🏺"},
];

const MEMBERS = [
  {id:"m1",name:"Anika Sharma",   email:"anika.sharma@gmail.com",  phone:"+91 98765 43210",location:"Amravati",joinDate:"15 Jan 2024",lastActivity:"10 Jun 2025",status:"active",  interests:["Literary Fiction","Poetry","History"],   booksRead:34,eventsAttended:12,contributions:8, bio:"Passionate about Indian literature and Marathi poetry. Loves discussing books over chai."},
  {id:"m2",name:"Rohan Desai",    email:"rohan.desai@gmail.com",   phone:"+91 87654 32109",location:"Amravati",joinDate:"3 Mar 2024", lastActivity:"8 Jun 2025", status:"active",  interests:["Philosophy","Science","Non-Fiction"],    booksRead:28,eventsAttended:9, contributions:5, bio:"Philosophy grad student. Interested in intersections of science and existentialist thought."},
  {id:"m3",name:"Priya Kulkarni", email:"priya.kulkarni@gmail.com",phone:"+91 76543 21098",location:"Amravati",joinDate:"20 Apr 2024",lastActivity:"1 Jun 2025", status:"active",  interests:["Mystery","Psychology","Biography"],      booksRead:22,eventsAttended:7, contributions:3, bio:"Mystery enthusiast and amateur writer. Works in mental health counselling."},
  {id:"m4",name:"Samir Joshi",    email:"samir.joshi@gmail.com",   phone:"+91 65432 10987",location:"Badnera", joinDate:"2 Jun 2024", lastActivity:"5 Apr 2025", status:"inactive",interests:["Fantasy","Classics"],                     booksRead:15,eventsAttended:4, contributions:1, bio:"Fantasy world-builder. Prefers epic secondary-world fiction."},
  {id:"m5",name:"Kavya Patil",    email:"kavya.patil@gmail.com",   phone:"+91 54321 09876",location:"Amravati",joinDate:"10 Jun 2025",lastActivity:"10 Jun 2025",status:"new",     interests:["Self-Help","Business"],                  booksRead:2, eventsAttended:1, contributions:0, bio:"Just joined! Excited to be part of Amravati Reads."},
  {id:"m6",name:"Arjun Nair",     email:"arjun.nair@gmail.com",    phone:"+91 43210 98765",location:"Amravati",joinDate:"15 Aug 2024",lastActivity:"12 Jun 2025",status:"active",  interests:["History","Culture","Travel"],            booksRead:41,eventsAttended:15,contributions:12,bio:"History teacher and travel essayist. Leads our historical fiction circle."},
  {id:"m7",name:"Meera Wagh",     email:"meera.wagh@gmail.com",    phone:"+91 32109 87654",location:"Amravati",joinDate:"1 Sep 2024", lastActivity:"9 Jun 2025", status:"active",  interests:["Literary Fiction","Classics","Culture"], booksRead:19,eventsAttended:6, contributions:4, bio:"Literature professor exploring world classics and translation studies."},
  {id:"m8",name:"Dev Mahajan",    email:"dev.mahajan@gmail.com",   phone:"+91 21098 76543",location:"Badnera", joinDate:"12 Nov 2024",lastActivity:"20 May 2025",status:"inactive",interests:["Science","Non-Fiction","Psychology"],     booksRead:8, eventsAttended:2, contributions:0, bio:"Science writer interested in popular science and cognitive psychology."},
];
const ALL_EVENTS = [
  {id:"e1", title:"June Discussion",      book:"The God of Small Things",         author:"Arundhati Roy",      date:"22 Jun 2025",time:"6:00 PM",venue:"Central Library",  attendees:18,max:25,status:"upcoming",genre:"Literary Fiction"},
  {id:"e2", title:"Poetry Evening",       book:"Gitanjali",                       author:"Rabindranath Tagore",date:"29 Jun 2025",time:"5:30 PM",venue:"Café Chapters",     attendees:12,max:20,status:"upcoming",genre:"Poetry"},
  {id:"e3", title:"July Book Club",       book:"The White Tiger",                 author:"Aravind Adiga",      date:"20 Jul 2025",time:"6:30 PM",venue:"Central Library",  attendees:9, max:25,status:"upcoming",genre:"Literary Fiction"},
  {id:"e4", title:"May Discussion",       book:"Normal People",                   author:"Sally Rooney",       date:"25 May 2025",time:"6:00 PM",venue:"Central Library",  attendees:22,max:25,status:"past",   genre:"Literary Fiction"},
  {id:"e5", title:"Philosophy Circle",    book:"Being and Time",                  author:"Martin Heidegger",   date:"10 May 2025",time:"5:00 PM",venue:"DPS College",      attendees:14,max:20,status:"past",   genre:"Philosophy"},
  {id:"e6", title:"Non-Fiction Saturday", book:"Sapiens",                         author:"Yuval Noah Harari",  date:"20 Apr 2025",time:"6:00 PM",venue:"Café Chapters",     attendees:19,max:25,status:"past",   genre:"Non-Fiction"},
  {id:"e7", title:"Mystery Night",        book:"The Girl with the Dragon Tattoo", author:"Stieg Larsson",      date:"5 Apr 2025", time:"7:00 PM",venue:"Central Library",  attendees:16,max:20,status:"past",   genre:"Mystery"},
  {id:"e8", title:"Pachinko Discussion",  book:"Pachinko",                        author:"Min Jin Lee",         date:"22 Mar 2025",time:"6:00 PM",venue:"Central Library",  attendees:21,max:25,status:"past",   genre:"Literary Fiction"},
  {id:"e9", title:"Classics Evening",     book:"The Remains of the Day",          author:"Kazuo Ishiguro",     date:"2 Feb 2025", time:"5:30 PM",venue:"Café Chapters",     attendees:17,max:20,status:"past",   genre:"Classics"},
  {id:"e10",title:"Biography Spotlight",  book:"Educated",                        author:"Tara Westover",      date:"15 Jan 2025",time:"6:00 PM",venue:"Central Library",  attendees:20,max:25,status:"past",   genre:"Biography"},
];
const ALL_BOOKS = [
  {title:"The God of Small Things",        author:"Arundhati Roy",       genre:"Literary Fiction",month:"Jun 2025",rating:4.8,discussions:1},
  {title:"Gitanjali",                      author:"Rabindranath Tagore", genre:"Poetry",          month:"Jun 2025",rating:4.6,discussions:1},
  {title:"Normal People",                  author:"Sally Rooney",        genre:"Literary Fiction",month:"May 2025",rating:4.1,discussions:1},
  {title:"Being and Time",                 author:"Martin Heidegger",    genre:"Philosophy",      month:"May 2025",rating:3.8,discussions:1},
  {title:"Sapiens",                        author:"Yuval Noah Harari",   genre:"Non-Fiction",     month:"Apr 2025",rating:4.5,discussions:2},
  {title:"The Girl with the Dragon Tattoo",author:"Stieg Larsson",       genre:"Mystery",         month:"Apr 2025",rating:4.2,discussions:1},
  {title:"Pachinko",                       author:"Min Jin Lee",          genre:"Literary Fiction",month:"Mar 2025",rating:4.7,discussions:1},
  {title:"The Ministry for the Future",    author:"Kim Stanley Robinson",genre:"Science",          month:"Feb 2025",rating:4.2,discussions:1},
  {title:"The Remains of the Day",         author:"Kazuo Ishiguro",      genre:"Classics",        month:"Jan 2025",rating:4.8,discussions:2},
  {title:"Educated",                       author:"Tara Westover",       genre:"Biography",       month:"Dec 2024",rating:4.6,discussions:1},
  {title:"Thinking, Fast and Slow",        author:"Daniel Kahneman",     genre:"Psychology",      month:"Nov 2024",rating:4.3,discussions:1},
  {title:"The Alchemist",                  author:"Paulo Coelho",        genre:"Literary Fiction",month:"Oct 2024",rating:4.0,discussions:1},
];
const GROWTH=[{m:"Jul",members:8,events:1},{m:"Aug",members:12,events:2},{m:"Sep",members:15,events:2},{m:"Oct",members:18,events:3},{m:"Nov",members:22,events:3},{m:"Dec",members:24,events:4},{m:"Jan",members:27,events:3},{m:"Feb",members:30,events:4},{m:"Mar",members:34,events:5},{m:"Apr",members:38,events:4},{m:"May",members:42,events:6},{m:"Jun",members:46,events:5}];
const IDIST=[{genre:"Literary Fiction",count:24,color:C.pri},{genre:"Non-Fiction",count:18,color:C.acc},{genre:"History",count:16,color:C.suc},{genre:"Philosophy",count:14,color:C.dan},{genre:"Poetry",count:12,color:C.blu}];
const ENGAGE=[{m:"Jul",att:78,bks:1},{m:"Aug",att:82,bks:2},{m:"Sep",att:74,bks:2},{m:"Oct",att:88,bks:3},{m:"Nov",att:91,bks:3},{m:"Dec",att:85,bks:4},{m:"Jan",att:80,bks:3},{m:"Feb",att:86,bks:4},{m:"Mar",att:84,bks:5},{m:"Apr",att:90,bks:4},{m:"May",att:88,bks:6},{m:"Jun",att:92,bks:5}];
const NOTIFS=[{id:1,text:"Kavya Patil just joined the community",time:"2m ago",icon:"👤",read:false},{id:2,text:"June Discussion has 18/25 spots filled",time:"1h ago",icon:"📅",read:false},{id:3,text:"Arjun Nair finished Sapiens",time:"3h ago",icon:"📚",read:true},{id:4,text:"Poetry Evening RSVP deadline tomorrow",time:"1d ago",icon:"⏰",read:true}];
const BOOKS_HIST=[{title:"The God of Small Things",author:"Arundhati Roy",month:"Jun 2025",rating:4.8},{title:"Pachinko",author:"Min Jin Lee",month:"Apr 2025",rating:4.7},{title:"Normal People",author:"Sally Rooney",month:"Mar 2025",rating:4.1},{title:"Sapiens",author:"Yuval Noah Harari",month:"Feb 2025",rating:4.5},{title:"The Remains of the Day",author:"Kazuo Ishiguro",month:"Jan 2025",rating:4.8}];

// ─── TOAST ───────────────────────────────────────────────────────────────────
const ToastCtx = createContext<((msg: string, type?: string) => void) | null>(null);
const useToast = () => useContext(ToastCtx)!;

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState<Array<{id: number; msg: string; type: string; out: boolean}>>([]);
  const add = useCallback((msg: string, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts(p => [...p, { id, msg, type, out: false }]);
    setTimeout(() => {
      setToasts(p => p.map(t => t.id === id ? { ...t, out: true } : t));
      setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 260);
    }, 3200);
  }, []);
  const dismiss = (id: number) => {
    setToasts(p => p.map(t => t.id === id ? { ...t, out: true } : t));
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 260);
  };
  const colorMap = { success: C.suc, error: C.dan, info: C.blu, warning: C.acc };
  const iconMap  = { success: "✓", error: "✕", info: "ℹ", warning: "⚠" };
  return (
    <ToastCtx.Provider value={add}>
      {children}
      <div className="toast-wrap">
        {toasts.map(t => (
          <div key={t.id} className={t.out ? "to" : "ti"} onClick={() => dismiss(t.id)}
            style={{ minWidth:280,maxWidth:360,background:"#18243C",borderRadius:13,padding:"13px 16px",
              display:"flex",alignItems:"center",gap:11,boxShadow:"0 8px 40px rgba(0,0,0,.5)",
              cursor:"pointer",border:`1px solid ${(colorMap[t.type]||C.suc)}28` }}>
            <div style={{ width:28,height:28,borderRadius:8,background:(colorMap[t.type]||C.suc)+"18",
              border:`1px solid ${(colorMap[t.type]||C.suc)}28`,display:"flex",alignItems:"center",
              justifyContent:"center",fontSize:13,fontWeight:700,color:colorMap[t.type]||C.suc,flexShrink:0 }}>
              {iconMap[t.type]||"✓"}
            </div>
            <p style={{ fontSize:13.5,color:C.txt,flex:1,lineHeight:1.4 }}>{t.msg}</p>
            <button className="bi" style={{ flexShrink:0 }}><X size={13}/></button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
};

// ─── PRIMITIVES ──────────────────────────────────────────────────────────────
const Av = ({ name, size=40, radius=12 }) => {
  const col = gc(name);
  return <div style={{ width:size,height:size,borderRadius:radius,flexShrink:0,background:col+"20",border:`1px solid ${col}35`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.34,fontWeight:700,color:col,fontFamily:"'Space Grotesk',sans-serif" }}>{gi(name)}</div>;
};

const Bdg = ({ status }) => {
  const M = { active:{lbl:"Active",bg:"rgba(62,180,137,.12)",col:C.suc}, inactive:{lbl:"Inactive",bg:"rgba(138,148,166,.1)",col:C.mut}, new:{lbl:"New",bg:"rgba(214,167,86,.12)",col:C.acc} };
  const s = M[status] || M.inactive;
  return <span className="tag" style={{ background:s.bg,color:s.col,border:`1px solid ${s.col}30` }}><span style={{ width:5,height:5,borderRadius:"50%",background:s.col,display:"inline-block",marginRight:5 }}/>{s.lbl}</span>;
};

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return <div style={{ background:"#18243A",border:"1px solid rgba(255,255,255,.08)",borderRadius:10,padding:"10px 14px",fontSize:13,boxShadow:"0 8px 32px rgba(0,0,0,.45)" }}>
    <p style={{ color:C.mut,marginBottom:6,fontSize:11.5 }}>{label}</p>
    {payload.map((p,i) => <p key={i} style={{ color:p.color||C.txt,fontWeight:600,marginBottom:2 }}>{p.name}: <span style={{ color:C.txt }}>{p.value}</span></p>)}
  </div>;
};

const Stat = ({ icon: Icon, label, value, change, color, delay="" }) => {
  const [disp, setDisp] = useState(0);
  useEffect(() => {
    const n = parseInt(value);
    if (isNaN(n)) { setDisp(value); return; }
    let s = 0, step = n / (900 / 16);
    const t = setInterval(() => { s += step; if (s >= n) { setDisp(value); clearInterval(t); } else setDisp(Math.floor(s)); }, 16);
    return () => clearInterval(t);
  }, [value]);
  return <div className={`card cl up ${delay}`} style={{ padding:"20px 22px" }}>
    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
      <div>
        <p style={{ color:C.mut,fontSize:12.5,fontWeight:500,marginBottom:8 }}>{label}</p>
        <h3 style={{ fontSize:30,fontWeight:700,color:C.txt,lineHeight:1,fontFamily:"'Space Grotesk',sans-serif" }}>{disp}</h3>
        {change && <p style={{ color:C.suc,fontSize:12,marginTop:6 }}>↑ {change} this month</p>}
      </div>
      <div style={{ width:42,height:42,borderRadius:11,background:color+"18",border:`1px solid ${color}28`,display:"flex",alignItems:"center",justifyContent:"center" }}>
        <Icon size={19} color={color}/>
      </div>
    </div>
  </div>;
};

const Lbl = ({ children }) => <p style={{ fontSize:12.5,fontWeight:500,color:C.mut,marginBottom:7 }}>{children}</p>;

// ─── CONFIRM MODAL ───────────────────────────────────────────────────────────
const ConfirmModal = ({ title, msg, onConfirm, onClose, variant="danger" }) => {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if(e.key==="Escape") onClose(); if(e.key==="Enter") { onConfirm(); onClose(); } };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);
  const col = variant === "danger" ? C.dan : C.pri;
  return <>
    <div className="backdrop fin" onClick={onClose} style={{ zIndex:900 }}/>
    <div style={{ position:"fixed",inset:0,display:"flex",alignItems:"center",justifyContent:"center",zIndex:901,pointerEvents:"none" }}>
      <div className="card sc" style={{ maxWidth:400,width:"100%",padding:28,margin:16,pointerEvents:"all",border:`1px solid ${col}25` }}>
        <div style={{ width:44,height:44,borderRadius:12,background:col+"15",border:`1px solid ${col}25`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16 }}>
          <AlertTriangle size={20} color={col}/>
        </div>
        <h3 style={{ fontSize:17,fontWeight:600,color:C.txt,marginBottom:8 }}>{title}</h3>
        <p style={{ color:C.mut,fontSize:14,lineHeight:1.6,marginBottom:24 }}>{msg}</p>
        <div style={{ display:"flex",gap:10,justifyContent:"flex-end" }}>
          <button className="bg" onClick={onClose}>Cancel</button>
          <button onClick={() => { onConfirm(); onClose(); }}
            style={{ background:col,color:"#fff",border:"none",borderRadius:10,padding:"9px 20px",fontSize:13.5,fontWeight:500,cursor:"pointer",fontFamily:"'Inter',sans-serif" }}>
            Confirm
          </button>
        </div>
        <p style={{ fontSize:11.5,color:C.mut,marginTop:12,textAlign:"right" }}>
          <kbd>Enter</kbd> confirm · <kbd>Esc</kbd> cancel
        </p>
      </div>
    </div>
  </>;
};

// ─── MEMBER DRAWER ───────────────────────────────────────────────────────────
const MemberDrawer = ({ member, onClose, onProfile, onRemove }) => {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if(e.key==="Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);
  if (!member) return null;
  return <>
    <div className="drawer-bd fin" onClick={onClose}/>
    <div className="drawer dr">
      <div style={{ padding:"18px 22px",borderBottom:"1px solid rgba(255,255,255,.06)",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:"#0E1828",zIndex:1 }}>
        <p style={{ fontSize:12.5,fontWeight:500,color:C.mut }}>Quick View</p>
        <div style={{ display:"flex",gap:6 }}>
          <button className="bp" style={{ padding:"7px 13px",fontSize:12.5 }} onClick={onProfile}>
            Full Profile <ChevronRight size={13}/>
          </button>
          <button className="bi" onClick={onClose}><X size={16}/></button>
        </div>
      </div>
      <div style={{ padding:24 }}>
        <div style={{ display:"flex",alignItems:"center",gap:16,marginBottom:22,paddingBottom:22,borderBottom:"1px solid rgba(255,255,255,.06)" }}>
          <Av name={member.name} size={60} radius={16}/>
          <div>
            <h2 style={{ fontSize:20,fontWeight:700,color:C.txt,marginBottom:5 }}>{member.name}</h2>
            <Bdg status={member.status}/>
            <p style={{ color:C.mut,fontSize:13,marginTop:5 }}>{member.email}</p>
          </div>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:22 }}>
          {[{l:"Books",v:member.booksRead,c:C.acc},{l:"Events",v:member.eventsAttended,c:C.pri},{l:"Contribs",v:member.contributions,c:C.suc}].map(s => (
            <div key={s.l} style={{ background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.06)",borderRadius:12,padding:"13px 10px",textAlign:"center" }}>
              <p style={{ fontSize:22,fontWeight:700,color:s.c,fontFamily:"'Space Grotesk',sans-serif",lineHeight:1,marginBottom:4 }}>{s.v}</p>
              <p style={{ fontSize:11.5,color:C.mut }}>{s.l}</p>
            </div>
          ))}
        </div>
        {member.bio && <div style={{ background:"rgba(109,93,246,.06)",border:"1px solid rgba(109,93,246,.12)",borderRadius:12,padding:16,marginBottom:18 }}>
          <p style={{ fontSize:13.5,color:C.txt,lineHeight:1.65 }}>{member.bio}</p>
        </div>}
        <div style={{ marginBottom:18 }}>
          <p style={{ fontSize:11.5,color:C.mut,marginBottom:10,fontWeight:500,textTransform:"uppercase",letterSpacing:".05em" }}>Interests</p>
          <div style={{ display:"flex",gap:7,flexWrap:"wrap" }}>
            {member.interests.map(i => { const o = IOPTS.find(x=>x.l===i); return <span key={i} className="tag tagi">{o?.e} {i}</span>; })}
          </div>
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:9,marginBottom:24 }}>
          {[[MapPin,member.location,"Location"],[Clock,member.joinDate,"Joined"],[Activity,member.lastActivity,"Last active"]].map(([Icon,v,lbl]) => (
            <div key={lbl} style={{ display:"flex",alignItems:"center",gap:10 }}>
              <Icon size={14} color={C.mut}/>
              <span style={{ fontSize:12.5,color:C.mut,width:78 }}>{lbl}</span>
              <span style={{ fontSize:13,color:C.txt }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
          <button className="bg" style={{ width:"100%",justifyContent:"center" }}><Mail size={14}/> Send Email</button>
          <button onClick={onRemove}
            style={{ background:"transparent",border:"1px solid rgba(224,108,117,.25)",borderRadius:10,padding:"9px 18px",fontSize:13.5,color:"rgba(224,108,117,.8)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:7,fontFamily:"'Inter',sans-serif",width:"100%",transition:"all .17s" }}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(224,108,117,.08)"}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <Trash2 size={14}/> Remove Reader
          </button>
        </div>
      </div>
    </div>
  </>;
};

// ─── COMMAND PALETTE ─────────────────────────────────────────────────────────
const CommandPalette = ({ onClose, setView, setMember }) => {
  const [q, setQ] = useState("");
  const [foc, setFoc] = useState(0);
  const ref = useRef(null);
  useEffect(() => { ref.current?.focus(); }, []);

  const mRes = q ? MEMBERS.filter(m=>m.name.toLowerCase().includes(q.toLowerCase())||m.email.toLowerCase().includes(q.toLowerCase())).slice(0,4) : [];
  const eRes = q ? ALL_EVENTS.filter(e=>e.title.toLowerCase().includes(q.toLowerCase())||e.book.toLowerCase().includes(q.toLowerCase())).slice(0,3) : [];
  const bRes = q ? ALL_BOOKS.filter(b=>b.title.toLowerCase().includes(q.toLowerCase())||b.author.toLowerCase().includes(q.toLowerCase())).slice(0,3) : [];

  const quickActions = !q ? [
    {lbl:"Add new reader",   sub:"Open the welcome form",       icon:"➕", action:()=>{ setView("add-member"); onClose(); }},
    {lbl:"All readers",      sub:"Browse the readers hub",      icon:"👥", action:()=>{ setView("members");   onClose(); }},
    {lbl:"Events",           sub:"View upcoming & past events", icon:"📅", action:()=>{ setView("events");    onClose(); }},
    {lbl:"Community library",sub:"Books discussed so far",      icon:"📚", action:()=>{ setView("books");     onClose(); }},
    {lbl:"Insights",         sub:"Charts and community metrics",icon:"📊", action:()=>{ setView("insights");  onClose(); }},
    {lbl:"Settings",         sub:"Configure your community",    icon:"⚙", action:()=>{ setView("settings");  onClose(); }},
  ] : [];

  const allItems = [
    ...quickActions,
    ...mRes.map(m => ({ lbl:m.name, sub:m.email, icon:"👤", member:m, action:()=>{ setMember(m); setView("profile"); onClose(); }})),
    ...eRes.map(e => ({ lbl:e.title, sub:`${e.book} · ${e.date}`, icon:"📅", action:()=>{ setView("events"); onClose(); }})),
    ...bRes.map(b => ({ lbl:b.title, sub:`by ${b.author}`, icon:"📖", action:()=>{ setView("books"); onClose(); }})),
  ];

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key==="Escape") { onClose(); return; }
      if (e.key==="ArrowDown") { e.preventDefault(); setFoc(f=>Math.min(f+1, allItems.length-1)); }
      if (e.key==="ArrowUp")   { e.preventDefault(); setFoc(f=>Math.max(f-1, 0)); }
      if (e.key==="Enter" && allItems[foc]) allItems[foc].action();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [allItems, foc]);
  useEffect(() => setFoc(0), [q]);

  const Section = ({ title, items, offset=0 }) => items.length > 0 ? <>
    <p style={{ fontSize:11,color:C.mut,padding:"6px 20px 4px",textTransform:"uppercase",letterSpacing:".07em" }}>{title}</p>
    {items.map((item, i) => (
      <div key={i} className={`cr ${foc===offset+i?"foc":""}`} onMouseEnter={()=>setFoc(offset+i)} onClick={item.action}>
        {item.member ? <Av name={item.member.name} size={32} radius={8}/> : <span style={{ fontSize:17,width:32,textAlign:"center",flexShrink:0 }}>{item.icon}</span>}
        <div style={{ flex:1,minWidth:0 }}>
          <p style={{ fontSize:13.5,color:C.txt,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{item.lbl}</p>
          {item.sub&&<p style={{ fontSize:12,color:C.mut,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{item.sub}</p>}
        </div>
        {item.member && <Bdg status={item.member.status}/>}
        <ChevronRight size={14} color={C.mut} className="ca"/>
      </div>
    ))}
  </> : null;

  return <>
    <div className="backdrop fin" onClick={onClose} style={{ zIndex:600 }}/>
    <div style={{ position:"fixed",inset:0,display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:100,zIndex:601,pointerEvents:"none" }}>
      <div className="ci" style={{ width:"100%",maxWidth:600,background:"#0F1828",border:"1px solid rgba(255,255,255,.1)",borderRadius:18,overflow:"hidden",boxShadow:"0 32px 90px rgba(0,0,0,.65)",pointerEvents:"all" }}>
        <div style={{ display:"flex",alignItems:"center",gap:12,padding:"16px 20px",borderBottom:"1px solid rgba(255,255,255,.06)" }}>
          <Search size={18} color={C.mut} style={{ flexShrink:0 }}/>
          <input ref={ref} className="inp" placeholder="Search readers, books, events…"
            style={{ border:"none",background:"transparent",fontSize:15,boxShadow:"none",padding:0 }}
            value={q} onChange={e=>setQ(e.target.value)}/>
          <kbd style={{ flexShrink:0 }}>ESC</kbd>
        </div>
        <div style={{ maxHeight:400,overflowY:"auto",paddingBottom:8 }}>
          {!q && <Section title="Quick Actions" items={quickActions} offset={0}/>}
          {q && allItems.length===0 && <div style={{ padding:"40px 20px",textAlign:"center" }}>
            <p style={{ fontSize:32,marginBottom:10 }}>📭</p>
            <p style={{ color:C.mut,fontSize:14 }}>No results for "{q}"</p>
          </div>}
          {q && <>
            {mRes.length>0 && <Section title="Readers" items={mRes.map(m=>({lbl:m.name,sub:m.email,icon:"👤",member:m,action:()=>{ setMember(m); setView("profile"); onClose(); }}))} offset={0}/>}
            {eRes.length>0 && <Section title="Events"  items={eRes.map(e=>({lbl:e.title,sub:`${e.book} · ${e.date}`,icon:"📅",action:()=>{ setView("events"); onClose(); }}))} offset={mRes.length}/>}
            {bRes.length>0 && <Section title="Books"   items={bRes.map(b=>({lbl:b.title,sub:`by ${b.author}`,icon:"📖",action:()=>{ setView("books"); onClose(); }}))} offset={mRes.length+eRes.length}/>}
          </>}
        </div>
        <div style={{ padding:"10px 20px",borderTop:"1px solid rgba(255,255,255,.05)",display:"flex",gap:18,alignItems:"center" }}>
          {[["↑↓","Navigate"],["↵","Select"],["Esc","Close"]].map(([key,lbl]) => (
            <span key={key} style={{ fontSize:12,color:C.mut,display:"flex",alignItems:"center",gap:5 }}><kbd>{key}</kbd> {lbl}</span>
          ))}
          <span style={{ marginLeft:"auto",fontSize:12,color:C.mut }}>Amravati Reads</span>
        </div>
      </div>
    </div>
  </>;
};

// ─── NOTIFICATION PANEL ──────────────────────────────────────────────────────
const NotifPanel = ({ onClose }) => {
  const [notifs, setNotifs] = useState(NOTIFS);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if(e.key==="Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);
  return <>
    <div style={{ position:"fixed",inset:0,zIndex:700 }} onClick={onClose}/>
    <div className="sc" style={{ position:"fixed",top:56,left:16,width:320,background:"#0F1828",border:"1px solid rgba(255,255,255,.08)",borderRadius:16,boxShadow:"0 16px 60px rgba(0,0,0,.5)",zIndex:701,overflow:"hidden" }}>
      <div style={{ padding:"13px 18px",borderBottom:"1px solid rgba(255,255,255,.06)",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
        <h3 style={{ fontSize:14,fontWeight:600,color:C.txt }}>Notifications</h3>
        <button className="bi" style={{ fontSize:12,color:C.pri,padding:"4px 8px",background:"rgba(109,93,246,.1)",borderRadius:7,height:"auto" }}
          onClick={()=>setNotifs(p=>p.map(n=>({...n,read:true})))}>
          Mark all read
        </button>
      </div>
      <div style={{ maxHeight:320,overflowY:"auto" }}>
        {notifs.map(n => (
          <div key={n.id} onClick={()=>setNotifs(p=>p.map(x=>x.id===n.id?{...x,read:true}:x))}
            style={{ display:"flex",gap:12,padding:"12px 18px",borderBottom:"1px solid rgba(255,255,255,.04)",cursor:"pointer",transition:"background .12s",background:n.read?"transparent":"rgba(109,93,246,.04)" }}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.03)"}
            onMouseLeave={e=>e.currentTarget.style.background=n.read?"transparent":"rgba(109,93,246,.04)"}>
            <div style={{ width:34,height:34,borderRadius:9,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.06)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0 }}>{n.icon}</div>
            <div style={{ flex:1,minWidth:0 }}>
              <p style={{ fontSize:13,color:n.read?C.mut:C.txt,lineHeight:1.4,marginBottom:3 }}>{n.text}</p>
              <p style={{ fontSize:11.5,color:C.mut }}>{n.time}</p>
            </div>
            {!n.read && <div style={{ width:7,height:7,borderRadius:"50%",background:C.pri,flexShrink:0,marginTop:4 }}/>}
          </div>
        ))}
      </div>
      <div style={{ padding:"10px 18px",borderTop:"1px solid rgba(255,255,255,.05)" }}>
        <button className="bg" style={{ width:"100%",justifyContent:"center",fontSize:12.5,padding:8 }}>View all activity</button>
      </div>
    </div>
  </>;
};

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
const NAV=[{id:"dashboard",lbl:"Overview",icon:Home},{id:"members",lbl:"Readers",icon:Users},{id:"events",lbl:"Events",icon:Calendar},{id:"books",lbl:"Library",icon:BookOpen},{id:"insights",lbl:"Insights",icon:TrendingUp},{id:"settings",lbl:"Settings",icon:Settings}];

const Sidebar = ({ view, setView, col, toggle, onCmd, notifCount, onNotif }) => {
  const w = col ? 68 : 236;
  const isM = ["members","profile","add-member"].includes(view);
  return <div className="sb" style={{ width:w }}>
    <div style={{ padding:"18px 14px",borderBottom:"1px solid rgba(255,255,255,.05)",display:"flex",alignItems:"center",gap:10,overflow:"hidden",flexShrink:0 }}>
      <div style={{ width:34,height:34,borderRadius:9,flexShrink:0,background:"linear-gradient(135deg,#6D5DF6,#4A3DB5)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 14px rgba(109,93,246,.45)" }}>
        <BookOpen size={16} color="#fff"/>
      </div>
      {!col && <div style={{ overflow:"hidden" }}>
        <div style={{ fontSize:14.5,fontWeight:700,color:C.txt,fontFamily:"'Space Grotesk',sans-serif",lineHeight:1.2 }}>Amravati</div>
        <div style={{ fontSize:10.5,color:C.mut,letterSpacing:".08em",textTransform:"uppercase" }}>Reads</div>
      </div>}
      {!col && <div style={{ marginLeft:"auto",display:"flex",gap:2 }}>
        <button className="bi" style={{ position:"relative" }} onClick={onNotif} title="Notifications">
          <Bell size={15}/>
          {notifCount > 0 && <span className="ndot"/>}
        </button>
        <button className="bi" onClick={toggle} title="Collapse"><ChevronLeft size={15}/></button>
      </div>}
    </div>

    {!col && <div onClick={onCmd} style={{ margin:"10px 8px 2px",padding:"8px 12px",background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",borderRadius:9,display:"flex",alignItems:"center",gap:8,cursor:"pointer",transition:"all .15s" }}
      onMouseEnter={e=>e.currentTarget.style.background="rgba(109,93,246,.08)"}
      onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.03)"}>
      <Search size={13} color={C.mut}/>
      <span style={{ fontSize:12.5,color:C.mut,flex:1 }}>Search…</span>
      <kbd style={{ fontSize:10 }}>⌘K</kbd>
    </div>}

    <nav style={{ flex:1,padding:"8px 0",overflowY:"auto",overflowX:"hidden" }}>
      {NAV.map(item => {
        const active = item.id==="members" ? isM : view===item.id;
        return <div key={item.id} className={`ni ${active?"on":""}`} onClick={()=>setView(item.id)} title={col?item.lbl:""}>
          <item.icon size={17} style={{ flexShrink:0,color:active?C.pri:"inherit" }}/>
          {!col && <span>{item.lbl}</span>}
          {active && !col && <div style={{ marginLeft:"auto",width:5,height:5,borderRadius:"50%",background:C.pri,boxShadow:`0 0 8px ${C.pri}` }}/>}
        </div>;
      })}
    </nav>

    <div style={{ padding:14,borderTop:"1px solid rgba(255,255,255,.05)",flexShrink:0 }}>
      {col
        ? <button className="bi" style={{ width:"100%",justifyContent:"center" }} onClick={toggle}><ChevronRight size={15}/></button>
        : <button className="bp" style={{ width:"100%",justifyContent:"center" }} onClick={()=>setView("add-member")}><UserPlus size={14}/> Add Reader</button>}
    </div>
  </div>;
};

// ─── SKELETON ────────────────────────────────────────────────────────────────
const Skeleton = () => (
  <div className="page">
    <div style={{ marginBottom:28 }}>
      <div className="skel" style={{ width:200,height:13,marginBottom:8 }}/>
      <div className="skel" style={{ width:280,height:28,marginBottom:8 }}/>
      <div className="skel" style={{ width:220,height:13 }}/>
    </div>
    <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20 }}>
      {[...Array(4)].map((_,i) => <div key={i} className="card" style={{ padding:"20px 22px",height:96 }}><div className="skel" style={{ width:"60%",height:12,marginBottom:12 }}/><div className="skel" style={{ width:"40%",height:28 }}/></div>)}
    </div>
    <div style={{ display:"grid",gridTemplateColumns:"2fr 1fr",gap:14 }}>
      <div className="card" style={{ padding:24,height:260 }}><div className="skel" style={{ width:"40%",height:14,marginBottom:16 }}/><div className="skel" style={{ width:"100%",height:180 }}/></div>
      <div className="card" style={{ padding:24,height:260 }}>
        <div className="skel" style={{ width:"50%",height:14,marginBottom:16 }}/>
        {[...Array(5)].map((_,i) => <div key={i} style={{ marginBottom:14 }}><div className="skel" style={{ width:"70%",height:11,marginBottom:6 }}/><div className="skel" style={{ width:"100%",height:3 }}/></div>)}
      </div>
    </div>
  </div>
);

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
const Dashboard = ({ setView, setMember, openDrawer }) => {
  const active = MEMBERS.filter(m=>m.status==="active").length;
  return <div className="page">
    <div className="up" style={{ marginBottom:28 }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
        <div>
          <p style={{ color:C.mut,fontSize:12.5,marginBottom:5 }}>{new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</p>
          <h1 style={{ fontSize:27,fontWeight:700,color:C.txt }}>Community Overview</h1>
          <p style={{ color:C.mut,fontSize:13.5,marginTop:4 }}>Amravati Reads · {MEMBERS.length} readers · {active} active this week</p>
        </div>
        <div style={{ display:"flex",gap:9 }}>
          <button className="bg" onClick={()=>setView("add-member")}><UserPlus size={14}/> Add Reader</button>
          <button className="bp" onClick={()=>setView("members")}><Users size={14}/> All Readers</button>
        </div>
      </div>
    </div>
    <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20 }}>
      <Stat icon={Users}     label="Total Readers"   value={MEMBERS.length} change="3" color={C.pri} delay="d1"/>
      <Stat icon={Activity}  label="Active Readers"  value={active}         change="2" color={C.suc} delay="d2"/>
      <Stat icon={BookMarked}label="Books Discussed" value="47"             change="4" color={C.acc} delay="d3"/>
      <Stat icon={Calendar}  label="Events Hosted"   value="24"             change="2" color={C.dan} delay="d4"/>
    </div>
    <div style={{ display:"grid",gridTemplateColumns:"2fr 1fr",gap:14,marginBottom:14 }}>
      <div className="card up d5" style={{ padding:24 }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20 }}>
          <div><h3 style={{ fontSize:15,fontWeight:600,color:C.txt,marginBottom:3 }}>Community Growth</h3><p style={{ color:C.mut,fontSize:12.5 }}>Member count over the past year</p></div>
          <span style={{ fontSize:11.5,color:C.suc,background:"rgba(62,180,137,.1)",padding:"4px 10px",borderRadius:20 }}>↑ 74% YoY</span>
        </div>
        <ResponsiveContainer width="100%" height={168}>
          <AreaChart data={GROWTH} margin={{top:4,right:4,left:-20,bottom:0}}>
            <defs>
              <linearGradient id="gM" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.pri} stopOpacity={.28}/><stop offset="95%" stopColor={C.pri} stopOpacity={0}/></linearGradient>
              <linearGradient id="gE" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.acc} stopOpacity={.22}/><stop offset="95%" stopColor={C.acc} stopOpacity={0}/></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)" vertical={false}/>
            <XAxis dataKey="m" tick={{fill:C.mut,fontSize:11.5}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:C.mut,fontSize:11.5}} axisLine={false} tickLine={false}/>
            <Tooltip content={<Tip/>}/>
            <Area type="monotone" dataKey="members" name="Members" stroke={C.pri} strokeWidth={2} fill="url(#gM)" dot={false}/>
            <Area type="monotone" dataKey="events"  name="Events"  stroke={C.acc} strokeWidth={2} fill="url(#gE)" dot={false}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="card up d6" style={{ padding:24 }}>
        <h3 style={{ fontSize:15,fontWeight:600,color:C.txt,marginBottom:3 }}>Reading Interests</h3>
        <p style={{ color:C.mut,fontSize:12.5,marginBottom:20 }}>Genre distribution</p>
        {IDIST.map(item => <div key={item.genre} style={{ marginBottom:13 }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:5 }}><span style={{ fontSize:13,color:C.txt }}>{item.genre}</span><span style={{ fontSize:12,color:C.mut }}>{item.count}</span></div>
          <div className="pt"><div className="pf" style={{ width:`${(item.count/24)*100}%`,background:item.color }}/></div>
        </div>)}
      </div>
    </div>
    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
      <div className="card up d7" style={{ padding:24 }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18 }}>
          <h3 style={{ fontSize:15,fontWeight:600,color:C.txt }}>Upcoming Events</h3>
          <button className="bg" style={{ padding:"5px 11px",fontSize:12 }} onClick={()=>setView("events")}>See all</button>
        </div>
        {ALL_EVENTS.filter(e=>e.status==="upcoming").slice(0,2).map(ev => (
          <div key={ev.id} style={{ background:"rgba(109,93,246,.06)",border:"1px solid rgba(109,93,246,.13)",borderLeft:`3px solid ${C.pri}`,borderRadius:12,padding:15,marginBottom:11 }}>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:7 }}>
              <h4 style={{ fontSize:13.5,fontWeight:600,color:C.txt }}>{ev.title}</h4>
              <span style={{ fontSize:11,color:C.acc,background:"rgba(214,167,86,.1)",padding:"2px 8px",borderRadius:20 }}>{ev.date}</span>
            </div>
            <p style={{ fontSize:12.5,color:C.mut,marginBottom:9 }}><span style={{ color:C.acc }}>{ev.book}</span> · {ev.author}</p>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
              <div style={{ display:"flex",gap:12 }}>
                <span style={{ fontSize:11.5,color:C.mut,display:"flex",alignItems:"center",gap:3 }}><Clock size={11}/> {ev.time}</span>
                <span style={{ fontSize:11.5,color:C.mut,display:"flex",alignItems:"center",gap:3 }}><MapPin size={11}/> {ev.venue}</span>
              </div>
              <span style={{ fontSize:11.5,color:C.mut }}>{ev.attendees}/{ev.max}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="card up d8" style={{ padding:24 }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18 }}>
          <h3 style={{ fontSize:15,fontWeight:600,color:C.txt }}>Recent Readers</h3>
          <button className="bg" style={{ padding:"5px 11px",fontSize:12 }} onClick={()=>setView("members")}>See all</button>
        </div>
        {MEMBERS.slice(0,6).map(m => (
          <div key={m.id} onClick={()=>openDrawer(m)}
            style={{ display:"flex",alignItems:"center",gap:11,padding:"9px 10px",borderRadius:10,cursor:"pointer",transition:"background .14s" }}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.03)"}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <Av name={m.name} size={36} radius={10}/>
            <div style={{ flex:1,minWidth:0 }}>
              <p style={{ fontSize:13.5,fontWeight:500,color:C.txt }}>{m.name}</p>
              <p style={{ fontSize:12,color:C.mut,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{m.interests[0]}</p>
            </div>
            <div style={{ textAlign:"right",flexShrink:0 }}><Bdg status={m.status}/><p style={{ fontSize:11,color:C.mut,marginTop:3 }}>{m.booksRead} books</p></div>
          </div>
        ))}
      </div>
    </div>
  </div>;
};

// ─── MEMBERS HUB ─────────────────────────────────────────────────────────────
const MembersHub = ({ setView, setMember, openDrawer, toast }) => {
  const [q,setQ]=useState(""); const [st,setSt]=useState("all"); const [mode,setMode]=useState("table");
  const [sort,setSort]=useState("name"); const [chips,setChips]=useState([]);
  const tc = l => setChips(p=>p.includes(l)?p.filter(x=>x!==l):[...p,l]);
  const list = useMemo(()=>MEMBERS.filter(m=>{
    const mq=!q||m.name.toLowerCase().includes(q.toLowerCase())||m.email.toLowerCase().includes(q.toLowerCase());
    return mq&&(st==="all"||m.status===st)&&(chips.length===0||chips.some(c=>m.interests.includes(c)));
  }).sort((a,b)=>sort==="books"?b.booksRead-a.booksRead:sort==="events"?b.eventsAttended-a.eventsAttended:a.name.localeCompare(b.name)),[q,st,chips,sort]);
  return <div className="page">
    <div className="up" style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22 }}>
      <div><h1 style={{ fontSize:27,fontWeight:700,color:C.txt }}>Readers Hub</h1><p style={{ color:C.mut,fontSize:13.5,marginTop:4 }}>{list.length} of {MEMBERS.length} readers</p></div>
      <button className="bp" onClick={()=>setView("add-member")}><UserPlus size={14}/> Add Reader</button>
    </div>
    <div className="up d1" style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:18 }}>
      {[{lbl:"Active",v:MEMBERS.filter(m=>m.status==="active").length,col:C.suc},{lbl:"Inactive",v:MEMBERS.filter(m=>m.status==="inactive").length,col:C.mut},{lbl:"New this month",v:MEMBERS.filter(m=>m.status==="new").length,col:C.acc},{lbl:"Total books",v:MEMBERS.reduce((a,m)=>a+m.booksRead,0),col:C.pri}].map(s=>(
        <div key={s.lbl} className="card" style={{ padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <span style={{ color:C.mut,fontSize:12.5 }}>{s.lbl}</span>
          <span style={{ fontSize:20,fontWeight:700,color:s.col,fontFamily:"'Space Grotesk',sans-serif" }}>{s.v}</span>
        </div>
      ))}
    </div>
    <div className="card up d2" style={{ padding:"14px 18px",marginBottom:16 }}>
      <div style={{ display:"flex",gap:10,alignItems:"center",flexWrap:"wrap" }}>
        <div style={{ position:"relative",flex:1,minWidth:180 }}>
          <Search size={14} style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:C.mut,pointerEvents:"none" }}/>
          <input className="inp" placeholder="Search readers…" style={{ paddingLeft:34 }} value={q} onChange={e=>setQ(e.target.value)}/>
        </div>
        <div className="seg">{["all","active","inactive","new"].map(s=><button key={s} className={`seg-btn ${st===s?"on":""}`} onClick={()=>setSt(s)}>{s==="all"?"All":s[0].toUpperCase()+s.slice(1)}</button>)}</div>
        <select className="sel" style={{ width:"auto" }} value={sort} onChange={e=>setSort(e.target.value)}>
          <option value="name">Name A–Z</option><option value="books">Most books</option><option value="events">Most events</option>
        </select>
        <div className="seg">
          <button className={`seg-btn ${mode==="table"?"on":""}`} onClick={()=>setMode("table")}><List size={13}/></button>
          <button className={`seg-btn ${mode==="grid"?"on":""}`}  onClick={()=>setMode("grid")}><Grid size={13}/></button>
        </div>
      </div>
      <div style={{ display:"flex",gap:7,marginTop:12,flexWrap:"wrap" }}>
        {IOPTS.slice(0,8).map(o=>{const s=chips.includes(o.l);return <button key={o.l} onClick={()=>tc(o.l)} style={{ padding:"4px 11px",borderRadius:20,fontSize:12,fontWeight:500,cursor:"pointer",transition:"all .15s",background:s?"rgba(109,93,246,.18)":"rgba(255,255,255,.04)",color:s?C.pri:C.mut,border:`1px solid ${s?"rgba(109,93,246,.4)":"rgba(255,255,255,.07)"}`,fontFamily:"'Inter',sans-serif" }}>{o.e} {o.l}</button>;})}
        {chips.length>0&&<button onClick={()=>setChips([])} style={{ padding:"4px 11px",borderRadius:20,fontSize:12,cursor:"pointer",background:"transparent",color:C.mut,border:"1px solid rgba(255,255,255,.07)",fontFamily:"'Inter',sans-serif" }}>✕ Clear</button>}
      </div>
    </div>
    {list.length===0
      ? <div className="card fin"><div style={{ display:"flex",flexDirection:"column",alignItems:"center",padding:"64px 24px",textAlign:"center" }}><div style={{ fontSize:42,marginBottom:14 }}>📭</div><h3 style={{ fontSize:16,color:C.txt,marginBottom:6 }}>No readers found</h3><p style={{ color:C.mut,fontSize:13.5 }}>Try adjusting your search or filters.</p></div></div>
      : mode==="table"
        ? <div className="card fin">
            <table className="tbl">
              <thead><tr><th>Reader</th><th>Status</th><th>Interests</th><th style={{textAlign:"center"}}>Books</th><th style={{textAlign:"center"}}>Events</th><th>Joined</th><th></th></tr></thead>
              <tbody>{list.map(m=><tr key={m.id} onClick={()=>openDrawer(m)}>
                <td><div style={{display:"flex",alignItems:"center",gap:11}}><Av name={m.name} size={34} radius={9}/><div><p style={{fontSize:13.5,fontWeight:500,color:C.txt}}>{m.name}</p><p style={{fontSize:12,color:C.mut}}>{m.email}</p></div></div></td>
                <td><Bdg status={m.status}/></td>
                <td><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{m.interests.slice(0,2).map(i=><span key={i} className="tag tagi">{i}</span>)}{m.interests.length>2&&<span style={{fontSize:11.5,color:C.mut,padding:"3px 6px"}}>+{m.interests.length-2}</span>}</div></td>
                <td style={{textAlign:"center",color:C.acc,fontWeight:600,fontSize:14}}>{m.booksRead}</td>
                <td style={{textAlign:"center",color:C.txt,fontSize:13.5}}>{m.eventsAttended}</td>
                <td style={{color:C.mut,fontSize:12.5}}>{m.joinDate}</td>
                <td><div style={{display:"flex",gap:3}} onClick={e=>e.stopPropagation()}>
                  <button className="bi" title="Quick view" onClick={()=>openDrawer(m)}><Eye size={14}/></button>
                  <button className="bi" title="Full profile" onClick={()=>{setMember(m);setView("profile");}}><Edit size={14}/></button>
                </div></td>
              </tr>)}</tbody>
            </table>
          </div>
        : <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:14}}>
            {list.map((m,idx)=><div key={m.id} className="card cl fin" style={{padding:20,cursor:"pointer",animationDelay:`${idx*.04}s`}} onClick={()=>openDrawer(m)}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}><Av name={m.name} size={46} radius={13}/><Bdg status={m.status}/></div>
              <h3 style={{fontSize:15.5,fontWeight:700,color:C.txt,marginBottom:3}}>{m.name}</h3>
              <p style={{fontSize:12.5,color:C.mut,marginBottom:12}}>{m.email}</p>
              <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:14}}>{m.interests.slice(0,3).map(i=><span key={i} className="tag tagi">{i}</span>)}</div>
              <div style={{display:"flex",justifyContent:"space-between",paddingTop:12,borderTop:"1px solid rgba(255,255,255,.05)"}}>
                {[{v:m.booksRead,l:"Books",c:C.acc},{v:m.eventsAttended,l:"Events",c:C.pri},{v:m.contributions,l:"Contribs",c:C.suc}].map(s=><div key={s.l} style={{textAlign:"center"}}>
                  <p style={{fontSize:18,fontWeight:700,color:s.c,fontFamily:"'Space Grotesk',sans-serif"}}>{s.v}</p>
                  <p style={{fontSize:11,color:C.mut}}>{s.l}</p>
                </div>)}
              </div>
            </div>)}
          </div>}
  </div>;
};

// ─── ADD MEMBER FLOW ─────────────────────────────────────────────────────────
const STEPS=[{n:1,l:"Basic Info"},{n:2,l:"Interests"},{n:3,l:"Community"},{n:4,l:"Review"}];
const AddMemberFlow = ({ setView, toast }) => {
  const [step,setStep]=useState(1);const [done,setDone]=useState(false);
  const [f,setF]=useState({name:"",email:"",phone:"",location:"",interests:[],cur:"",fav:"",freq:"",bio:"",how:"",nl:true});
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  const tg=(k,v)=>s(k,f[k].includes(v)?f[k].filter(x=>x!==v):[...f[k],v]);
  const submit=()=>{setDone(true);toast(`${f.name||"New reader"} added to Amravati Reads 🎉`,"success");};
  if(done) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:32}}>
    <div className="card sc" style={{maxWidth:460,width:"100%",padding:44,textAlign:"center"}}>
      <div style={{width:68,height:68,borderRadius:18,background:"rgba(62,180,137,.14)",border:"1px solid rgba(62,180,137,.3)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 22px"}}><Check size={30} color={C.suc}/></div>
      <h2 style={{fontSize:22,fontWeight:700,color:C.txt,marginBottom:10}}>Welcome aboard!</h2>
      <p style={{color:C.mut,fontSize:14,lineHeight:1.65,marginBottom:28}}><span style={{color:C.acc}}>{f.name||"New reader"}</span> has been added and will receive a welcome message.</p>
      <div style={{display:"flex",gap:10,justifyContent:"center"}}>
        <button className="bg" onClick={()=>{setDone(false);setStep(1);setF({name:"",email:"",phone:"",location:"",interests:[],cur:"",fav:"",freq:"",bio:"",how:"",nl:true});}}>Add Another</button>
        <button className="bp" onClick={()=>setView("members")}>View Readers</button>
      </div>
    </div>
  </div>;
  return <div className="page">
    <div style={{maxWidth:640,margin:"0 auto"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:28}}>
        <button className="bg" style={{padding:"8px 13px"}} onClick={()=>step>1?setStep(step-1):setView("members")}><ArrowLeft size={14}/></button>
        <div><h1 style={{fontSize:22,fontWeight:700,color:C.txt}}>Welcome a Reader</h1><p style={{color:C.mut,fontSize:13,marginTop:3}}>Step {step} of 4 — {STEPS[step-1].l}</p></div>
      </div>
      <div style={{display:"flex",alignItems:"center",marginBottom:32}}>
        {STEPS.map((st2,i)=><div key={st2.n} style={{display:"flex",alignItems:"center",flex:i<3?1:"none"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,opacity:st2.n>step?.4:1}}>
            <div style={{width:28,height:28,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:600,flexShrink:0,transition:"all .28s",background:st2.n<step?C.suc:st2.n===step?C.pri:"rgba(255,255,255,.07)",color:st2.n<=step?"#fff":C.mut,boxShadow:st2.n===step?`0 0 16px ${C.pri}60`:"none"}}>
              {st2.n<step?<Check size={13}/>:st2.n}
            </div>
            <span style={{fontSize:12.5,color:st2.n<=step?C.txt:C.mut,whiteSpace:"nowrap"}}>{st2.l}</span>
          </div>
          {i<3&&<div style={{flex:1,height:1,margin:"0 10px",background:st2.n<step?C.suc:"rgba(255,255,255,.06)",transition:"background .3s"}}/>}
        </div>)}
      </div>
      <div className="card fin" key={step} style={{padding:30}}>
        {step===1&&<div>
          <h2 style={{fontSize:18,fontWeight:600,color:C.txt,marginBottom:4}}>Basic Information</h2>
          <p style={{color:C.mut,fontSize:13.5,marginBottom:24}}>The essentials — name, email, and where they're from.</p>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <div><Lbl>Full Name *</Lbl><input className="inp" placeholder="Anika Sharma" value={f.name} onChange={e=>s("name",e.target.value)}/></div>
              <div><Lbl>Email Address *</Lbl><input className="inp" type="email" placeholder="anika@gmail.com" value={f.email} onChange={e=>s("email",e.target.value)}/></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <div><Lbl>Phone</Lbl><input className="inp" placeholder="+91 98765 43210" value={f.phone} onChange={e=>s("phone",e.target.value)}/></div>
              <div><Lbl>Location</Lbl><input className="inp" placeholder="Amravati" value={f.location} onChange={e=>s("location",e.target.value)}/></div>
            </div>
          </div>
        </div>}
        {step===2&&<div>
          <h2 style={{fontSize:18,fontWeight:600,color:C.txt,marginBottom:4}}>Reading Interests</h2>
          <p style={{color:C.mut,fontSize:13.5,marginBottom:20}}>Select genres — {f.interests.length} chosen</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:9,marginBottom:20}}>
            {IOPTS.map(o=>{const sel=f.interests.includes(o.l);return <button key={o.l} onClick={()=>tg("interests",o.l)} style={{padding:"9px 12px",borderRadius:11,fontSize:13,fontWeight:500,border:`1px solid ${sel?"rgba(109,93,246,.4)":"rgba(255,255,255,.07)"}`,background:sel?"rgba(109,93,246,.16)":"rgba(255,255,255,.02)",color:sel?C.pri:C.mut,cursor:"pointer",transition:"all .17s",display:"flex",alignItems:"center",gap:7,fontFamily:"'Inter',sans-serif"}}>{o.e} <span style={{flex:1}}>{o.l}</span>{sel&&<Check size={12}/>}</button>;})}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <div><Lbl>Currently reading</Lbl><input className="inp" placeholder="Book title…" value={f.cur} onChange={e=>s("cur",e.target.value)}/></div>
            <div><Lbl>All-time favourite</Lbl><input className="inp" placeholder="Favourite book…" value={f.fav} onChange={e=>s("fav",e.target.value)}/></div>
          </div>
        </div>}
        {step===3&&<div>
          <h2 style={{fontSize:18,fontWeight:600,color:C.txt,marginBottom:4}}>Community Details</h2>
          <p style={{color:C.mut,fontSize:13.5,marginBottom:24}}>Help them connect with the right people.</p>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div><Lbl>About them</Lbl><textarea className="inp" placeholder="A short note…" value={f.bio} onChange={e=>s("bio",e.target.value)}/></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <div><Lbl>How did they hear about us?</Lbl><select className="sel" value={f.how} onChange={e=>s("how",e.target.value)}><option value="">Select…</option>{["Social Media","Friend / Family","Event","Library","Online Search","Other"].map(h=><option key={h} value={h}>{h}</option>)}</select></div>
              <div><Lbl>Reading frequency</Lbl><select className="sel" value={f.freq} onChange={e=>s("freq",e.target.value)}><option value="">Select…</option>{["Daily","Weekly","Bi-weekly","Monthly","Occasionally"].map(x=><option key={x} value={x}>{x}</option>)}</select></div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:12,padding:14,borderRadius:11,background:"rgba(109,93,246,.06)",border:"1px solid rgba(109,93,246,.12)",cursor:"pointer"}} onClick={()=>s("nl",!f.nl)}>
              <div className={`chk ${f.nl?"on":""}`}>{f.nl&&<Check size={11} color="#fff"/>}</div>
              <div><p style={{fontSize:13.5,fontWeight:500,color:C.txt}}>Subscribe to newsletter</p><p style={{fontSize:12,color:C.mut}}>Monthly reading lists and event updates</p></div>
            </div>
          </div>
        </div>}
        {step===4&&<div>
          <h2 style={{fontSize:18,fontWeight:600,color:C.txt,marginBottom:4}}>Review & Confirm</h2>
          <p style={{color:C.mut,fontSize:13.5,marginBottom:22}}>Everything looks right? Add them to the community.</p>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{background:"rgba(109,93,246,.07)",border:"1px solid rgba(109,93,246,.14)",borderRadius:13,padding:18,display:"flex",alignItems:"center",gap:15}}>
              <Av name={f.name||"New Reader"} size={54} radius={14}/>
              <div style={{flex:1}}><h3 style={{fontSize:17,fontWeight:700,color:C.txt}}>{f.name||"New Reader"}</h3><p style={{color:C.mut,fontSize:13}}>{f.email||"—"}</p>{f.location&&<p style={{color:C.mut,fontSize:12,marginTop:3}}>📍 {f.location}</p>}</div>
              <Bdg status="new"/>
            </div>
            {f.interests.length>0&&<div><p style={{fontSize:12.5,color:C.mut,marginBottom:9}}>Reading Interests</p><div style={{display:"flex",gap:7,flexWrap:"wrap"}}>{f.interests.map(i=>{const o=IOPTS.find(x=>x.l===i);return <span key={i} className="tag tagi">{o?.e} {i}</span>;})}</div></div>}
            {(f.cur||f.fav)&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {f.cur&&<div style={{padding:"11px 14px",borderRadius:10,background:"rgba(214,167,86,.07)",border:"1px solid rgba(214,167,86,.14)"}}><p style={{fontSize:11,color:C.mut,marginBottom:3}}>Currently Reading</p><p style={{fontSize:13.5,color:C.acc}}>{f.cur}</p></div>}
              {f.fav&&<div style={{padding:"11px 14px",borderRadius:10,background:"rgba(109,93,246,.07)",border:"1px solid rgba(109,93,246,.14)"}}><p style={{fontSize:11,color:C.mut,marginBottom:3}}>All-time Favourite</p><p style={{fontSize:13.5,color:C.pri}}>{f.fav}</p></div>}
            </div>}
            {f.bio&&<div style={{padding:"13px 15px",borderRadius:10,background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.06)"}}><p style={{fontSize:11,color:C.mut,marginBottom:5}}>Bio</p><p style={{fontSize:13.5,color:C.txt,lineHeight:1.65}}>{f.bio}</p></div>}
          </div>
        </div>}
        <div style={{display:"flex",justifyContent:"space-between",marginTop:28,paddingTop:22,borderTop:"1px solid rgba(255,255,255,.06)"}}>
          <button className="bg" onClick={()=>step>1?setStep(step-1):setView("members")}>{step===1?"Cancel":"Back"}</button>
          <button className="bp" onClick={()=>step<4?setStep(step+1):submit()} disabled={step===1&&(!f.name||!f.email)}>
            {step===4?<><Check size={14}/> Add to Community</>:<>Continue <ChevronRight size={14}/></>}
          </button>
        </div>
      </div>
    </div>
  </div>;
};

// ─── MEMBER PROFILE ──────────────────────────────────────────────────────────
const PTABS=["Overview","Activity","Books","Events","Notes"];
const MemberProfile = ({ member, setView, toast, openConfirm }) => {
  const [tab,setTab]=useState("Overview");
  if(!member){setView("members");return null;}
  return <div className="page">
    <button className="bg up" style={{marginBottom:22,padding:"7px 13px"}} onClick={()=>setView("members")}><ArrowLeft size={14}/> Back to Readers</button>
    <div className="card up d1" style={{padding:"26px 28px",marginBottom:20,background:"linear-gradient(145deg,#121A2A,#0F1628)"}}>
      <div style={{display:"flex",gap:22,alignItems:"flex-start"}}>
        <Av name={member.name} size={70} radius={18}/>
        <div style={{flex:1}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div>
              <h1 style={{fontSize:24,fontWeight:700,color:C.txt,marginBottom:6}}>{member.name}</h1>
              <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
                {[[Mail,member.email],[Phone,member.phone],[MapPin,member.location]].map(([Icon,val])=>val&&<span key={val} style={{fontSize:13,color:C.mut,display:"flex",alignItems:"center",gap:4}}><Icon size={12}/>{val}</span>)}
              </div>
            </div>
            <div style={{display:"flex",gap:8}}><Bdg status={member.status}/><button className="bg" style={{padding:"7px 12px",fontSize:12.5}}><Edit size={13}/> Edit</button></div>
          </div>
          <div style={{display:"flex",gap:28,marginTop:18,paddingTop:18,borderTop:"1px solid rgba(255,255,255,.06)"}}>
            {[{l:"Books Read",v:member.booksRead,c:C.acc,n:true},{l:"Events",v:member.eventsAttended,c:C.pri,n:true},{l:"Contributions",v:member.contributions,c:C.suc,n:true},{l:"Member since",v:member.joinDate,c:C.txt,n:false},{l:"Last active",v:member.lastActivity,c:C.mut,n:false}].map(s=>(
              <div key={s.l}><p style={{fontSize:s.n?22:13.5,fontWeight:700,color:s.c,fontFamily:"'Space Grotesk',sans-serif",marginBottom:2,lineHeight:1}}>{s.v}</p><p style={{fontSize:11.5,color:C.mut}}>{s.l}</p></div>
            ))}
          </div>
        </div>
      </div>
    </div>
    <div className="up d2" style={{display:"flex",gap:3,marginBottom:18}}>
      {PTABS.map(t=><button key={t} className={`ptab ${tab===t?"on":""}`} onClick={()=>setTab(t)}>{t}</button>)}
    </div>
    <div className="fin" key={tab}>
      {tab==="Overview"&&<div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:16}}>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {member.bio&&<div className="card" style={{padding:22}}><h3 style={{fontSize:14.5,fontWeight:600,color:C.txt,marginBottom:10}}>About</h3><p style={{color:C.mut,fontSize:13.5,lineHeight:1.7}}>{member.bio}</p></div>}
          <div className="card" style={{padding:22}}>
            <h3 style={{fontSize:14.5,fontWeight:600,color:C.txt,marginBottom:16}}>Reading Interests</h3>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{member.interests.map(i=>{const o=IOPTS.find(x=>x.l===i);return <span key={i} style={{display:"inline-flex",alignItems:"center",gap:7,padding:"8px 13px",borderRadius:10,fontSize:13,fontWeight:500,background:"rgba(109,93,246,.1)",color:"rgba(180,172,255,.9)",border:"1px solid rgba(109,93,246,.22)"}}>{o?.e} {i}</span>;})}</div>
          </div>
          <div className="card" style={{padding:22}}>
            <h3 style={{fontSize:14.5,fontWeight:600,color:C.txt,marginBottom:20}}>Reading Journey</h3>
            <div style={{position:"relative",paddingLeft:28}}>
              {[{type:"Joined",desc:"Joined Amravati Reads",date:member.joinDate,emoji:"🎉",col:C.suc},{type:"First event",desc:"Attended their first book discussion",date:"Feb 2024",emoji:"📅",col:C.pri},{type:"10 books",desc:"Reached 10 books with the community",date:"Mar 2024",emoji:"📚",col:C.acc},{type:"Contributor",desc:"Started writing discussion summaries",date:"Apr 2024",emoji:"✍",col:C.blu}].map((ev,i,arr)=>(
                <div key={i} style={{display:"flex",gap:14,marginBottom:i<arr.length-1?20:0,position:"relative"}}>
                  {i<arr.length-1&&<div style={{position:"absolute",left:-14,top:32,width:1,height:"calc(100% + 4px)",background:"rgba(255,255,255,.05)"}}/>}
                  <div style={{width:30,height:30,borderRadius:8,background:ev.col+"15",border:`1px solid ${ev.col}25`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0,position:"absolute",left:-22}}>{ev.emoji}</div>
                  <div style={{paddingLeft:12}}><p style={{fontSize:13.5,fontWeight:500,color:C.txt,marginBottom:2}}>{ev.type}</p><p style={{fontSize:12.5,color:C.mut,marginBottom:2}}>{ev.desc}</p><p style={{fontSize:11.5,color:C.mut}}>{ev.date}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div className="card" style={{padding:20}}>
            <h3 style={{fontSize:14.5,fontWeight:600,color:C.txt,marginBottom:14}}>This Month</h3>
            {[{l:"Books finished",v:"3",c:C.acc},{l:"Discussions led",v:"2",c:C.pri},{l:"Reviews written",v:"8",c:C.suc},{l:"Members referred",v:"1",c:C.blu}].map(s=>(
              <div key={s.l} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid rgba(255,255,255,.04)"}}><span style={{fontSize:13,color:C.mut}}>{s.l}</span><span style={{fontSize:13.5,fontWeight:600,color:s.c}}>{s.v}</span></div>
            ))}
          </div>
          <div className="card" style={{padding:20}}>
            <h3 style={{fontSize:14.5,fontWeight:600,color:C.txt,marginBottom:14}}>Actions</h3>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <button className="bg" style={{width:"100%",justifyContent:"center"}} onClick={()=>toast(`Email sent to ${member.name}`,"success")}><Mail size={13}/> Send Email</button>
              <button onClick={()=>openConfirm({title:`Remove ${member.name}?`,msg:"This reader will be permanently removed from Amravati Reads. This cannot be undone.",onConfirm:()=>{toast(`${member.name} removed`,"info");setView("members");}})}
                style={{background:"transparent",border:"1px solid rgba(224,108,117,.25)",borderRadius:10,padding:"9px 18px",fontSize:13.5,color:"rgba(224,108,117,.8)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:7,fontFamily:"'Inter',sans-serif",width:"100%",transition:"all .17s"}}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(224,108,117,.08)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <Trash2 size={13}/> Remove Reader
              </button>
            </div>
          </div>
        </div>
      </div>}
      {tab==="Activity"&&<div className="card" style={{padding:24}}>
        <h3 style={{fontSize:15,fontWeight:600,color:C.txt,marginBottom:20}}>Recent Activity</h3>
        {[{act:"Finished reading",detail:'"The God of Small Things"',date:"10 Jun 2025",emoji:"📚",col:C.acc},{act:"Attended event",detail:"May Discussion — Normal People",date:"25 May 2025",emoji:"📅",col:C.pri},{act:"Left a review",detail:'"Absolutely stunning prose."',date:"26 May 2025",emoji:"✍",col:C.suc},{act:"Started reading",detail:"Pachinko — Min Jin Lee",date:"20 May 2025",emoji:"🔖",col:C.blu},{act:"Joined a circle",detail:"Philosophy reading circle",date:"12 May 2025",emoji:"💬",col:C.pur}].map((item,i,arr)=>(
          <div key={i} style={{display:"flex",gap:13,padding:"14px 0",borderBottom:i<arr.length-1?"1px solid rgba(255,255,255,.04)":"none"}}>
            <div style={{width:36,height:36,borderRadius:10,background:item.col+"15",border:`1px solid ${item.col}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{item.emoji}</div>
            <div style={{flex:1}}><p style={{fontSize:13.5,color:C.txt}}><span style={{color:C.mut}}>{item.act} </span><span style={{fontWeight:500}}>{item.detail}</span></p><p style={{fontSize:12,color:C.mut,marginTop:3}}>{item.date}</p></div>
          </div>
        ))}
      </div>}
      {tab==="Books"&&<div className="card" style={{padding:24}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><h3 style={{fontSize:15,fontWeight:600,color:C.txt}}>Reading History</h3><span style={{fontSize:14,color:C.acc,fontWeight:600}}>{member.booksRead} books total</span></div>
        {BOOKS_HIST.map((book,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:14,padding:"13px 14px",borderRadius:11,background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.04)",marginBottom:10,transition:"all .14s"}} onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.04)";e.currentTarget.style.borderColor="rgba(109,93,246,.15)";}} onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.02)";e.currentTarget.style.borderColor="rgba(255,255,255,.04)";}}>
            <div style={{width:38,height:50,borderRadius:6,background:PAL[i%PAL.length]+"18",border:`1px solid ${PAL[i%PAL.length]}28`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>📖</div>
            <div style={{flex:1}}><p style={{fontSize:13.5,fontWeight:500,color:C.txt}}>{book.title}</p><p style={{fontSize:12.5,color:C.mut}}>by {book.author}</p></div>
            <div style={{textAlign:"right"}}>
              <div style={{display:"flex",gap:3,justifyContent:"flex-end",marginBottom:4}}>{[...Array(5)].map((_,si)=><Star key={si} size={12} fill={si<Math.floor(book.rating)?C.acc:"none"} color={si<Math.floor(book.rating)?C.acc:"rgba(255,255,255,.12)"}/>)}</div>
              <p style={{fontSize:11.5,color:C.mut}}>{book.month}</p>
            </div>
          </div>
        ))}
      </div>}
      {tab==="Events"&&<div style={{display:"flex",flexDirection:"column",gap:13}}>
        {ALL_EVENTS.slice(0,3).map(ev=>(
          <div key={ev.id} className="card" style={{padding:20}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div><h3 style={{fontSize:14.5,fontWeight:600,color:C.txt,marginBottom:5}}>{ev.title}</h3><p style={{fontSize:13,color:C.acc,marginBottom:11}}>{ev.book} · {ev.author}</p>
                <div style={{display:"flex",gap:14}}>{[[Calendar,ev.date],[Clock,ev.time],[MapPin,ev.venue]].map(([Icon,val])=><span key={val} style={{fontSize:12,color:C.mut,display:"flex",alignItems:"center",gap:4}}><Icon size={11}/>{val}</span>)}</div>
              </div>
              <span style={{fontSize:11.5,color:C.suc,background:"rgba(62,180,137,.1)",padding:"4px 11px",borderRadius:20,flexShrink:0}}>Attending</span>
            </div>
          </div>
        ))}
      </div>}
      {tab==="Notes"&&<div className="card" style={{padding:24}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <h3 style={{fontSize:15,fontWeight:600,color:C.txt}}>Organiser Notes</h3>
          <button className="bp" style={{padding:"7px 13px",fontSize:12.5}} onClick={()=>toast("Note added","success")}><Plus size={13}/> Add Note</button>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{padding:18,borderRadius:11,background:"rgba(214,167,86,.06)",border:"1px dashed rgba(214,167,86,.22)"}}>
            <p style={{fontSize:12,color:C.acc,marginBottom:8,fontWeight:600}}>📌 Pinned</p>
            <p style={{fontSize:13.5,color:C.txt,lineHeight:1.68}}>Highly engaged — excellent at leading literary fiction discussions. Consider as moderator for the July session.</p>
            <p style={{fontSize:11.5,color:C.mut,marginTop:9}}>Admin · 15 Mar 2025</p>
          </div>
          <div style={{padding:18,borderRadius:11,background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.06)"}}>
            <p style={{fontSize:13.5,color:C.txt,lineHeight:1.68}}>Expressed interest in hosting a Marathi poetry evening. Follow up in July after the June event.</p>
            <p style={{fontSize:11.5,color:C.mut,marginTop:9}}>Admin · 2 May 2025</p>
          </div>
        </div>
      </div>}
    </div>
  </div>;
};

// ─── EVENTS VIEW ─────────────────────────────────────────────────────────────
const EventsView = ({ toast }) => {
  const [filter, setFilter] = useState("upcoming");
  const list = ALL_EVENTS.filter(e => filter === "all" || e.status === filter);
  const upcoming = ALL_EVENTS.filter(e=>e.status==="upcoming").length;
  const past = ALL_EVENTS.filter(e=>e.status==="past").length;
  const avgAtt = Math.round(ALL_EVENTS.filter(e=>e.status==="past").reduce((a,e)=>a+e.attendees,0)/past);
  return <div className="page">
    <div className="up" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22}}>
      <div><h1 style={{fontSize:27,fontWeight:700,color:C.txt}}>Events</h1><p style={{color:C.mut,fontSize:13.5,marginTop:4}}>{upcoming} upcoming · {past} past</p></div>
      <button className="bp" onClick={()=>toast("Event creation coming soon","info")}><Plus size={14}/> Create Event</button>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
      <Stat icon={Calendar}   label="Total Events"   value={ALL_EVENTS.length} change="2" color={C.pri} delay="d1"/>
      <Stat icon={TrendingUp} label="Upcoming"        value={upcoming}                     color={C.acc} delay="d2"/>
      <Stat icon={Users}      label="Avg Attendance"  value={avgAtt}                       color={C.suc} delay="d3"/>
      <Stat icon={BookOpen}   label="Books Covered"   value={ALL_BOOKS.length} change="2" color={C.dan} delay="d4"/>
    </div>
    <div className="up d4" style={{marginBottom:18}}>
      <div className="seg" style={{width:"fit-content"}}>
        {["upcoming","past","all"].map(f=>(
          <button key={f} className={`seg-btn ${filter===f?"on":""}`} onClick={()=>setFilter(f)}>
            {f[0].toUpperCase()+f.slice(1)}
            <span style={{fontSize:11,color:filter===f?C.pri:C.mut,marginLeft:3}}>({ALL_EVENTS.filter(e=>f==="all"||e.status===f).length})</span>
          </button>
        ))}
      </div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(380px,1fr))",gap:14}}>
      {list.map((ev,idx)=>{
        const pct = Math.round((ev.attendees/ev.max)*100);
        return <div key={ev.id} className={`card cl up d${Math.min(idx+1,8)}`} style={{padding:22,cursor:"pointer"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
            <div style={{display:"flex",gap:12,alignItems:"center"}}>
              <div style={{width:44,height:44,borderRadius:12,background:ev.status==="upcoming"?"rgba(109,93,246,.12)":"rgba(255,255,255,.04)",border:`1px solid ${ev.status==="upcoming"?"rgba(109,93,246,.2)":"rgba(255,255,255,.08)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>📖</div>
              <div><h3 style={{fontSize:14.5,fontWeight:600,color:C.txt,marginBottom:3}}>{ev.title}</h3><span className="tag tagi" style={{fontSize:11}}>{ev.genre}</span></div>
            </div>
            <span style={{fontSize:11.5,fontWeight:500,padding:"4px 10px",borderRadius:20,background:ev.status==="upcoming"?"rgba(62,180,137,.12)":"rgba(138,148,166,.1)",color:ev.status==="upcoming"?C.suc:C.mut,border:`1px solid ${ev.status==="upcoming"?"rgba(62,180,137,.2)":"rgba(138,148,166,.15)"}`}}>
              {ev.status==="upcoming"?"Upcoming":"Completed"}
            </span>
          </div>
          <div style={{padding:"12px 14px",borderRadius:10,background:"rgba(214,167,86,.06)",border:"1px solid rgba(214,167,86,.12)",marginBottom:14}}>
            <p style={{fontSize:13.5,fontWeight:500,color:C.acc,marginBottom:2}}>{ev.book}</p>
            <p style={{fontSize:12.5,color:C.mut}}>by {ev.author}</p>
          </div>
          <div style={{display:"flex",gap:14,marginBottom:14,flexWrap:"wrap"}}>
            {[[Calendar,ev.date],[Clock,ev.time],[MapPin,ev.venue]].map(([Icon,val])=>(
              <span key={val} style={{fontSize:12,color:C.mut,display:"flex",alignItems:"center",gap:4}}><Icon size={12}/>{val}</span>
            ))}
          </div>
          <div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <span style={{fontSize:12,color:C.mut}}>Attendance</span>
              <span style={{fontSize:12,fontWeight:600,color:pct>=80?C.suc:pct>=50?C.acc:C.mut}}>{ev.attendees}/{ev.max} · {pct}%</span>
            </div>
            <div className="pt"><div className="pf" style={{width:`${pct}%`,background:pct>=80?C.suc:pct>=50?C.acc:C.pri}}/></div>
          </div>
        </div>;
      })}
    </div>
  </div>;
};

// ─── LIBRARY VIEW ─────────────────────────────────────────────────────────────
const LibraryView = ({ toast }) => {
  const [genre, setGenre] = useState("All");
  const [search, setSearch] = useState("");
  const genres = ["All", ...Array.from(new Set(ALL_BOOKS.map(b=>b.genre)))];
  const list = ALL_BOOKS.filter(b=>(genre==="All"||b.genre===genre)&&(!search||b.title.toLowerCase().includes(search.toLowerCase())||b.author.toLowerCase().includes(search.toLowerCase())));
  const avgRating = (ALL_BOOKS.reduce((a,b)=>a+b.rating,0)/ALL_BOOKS.length).toFixed(1);
  return <div className="page">
    <div className="up" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22}}>
      <div><h1 style={{fontSize:27,fontWeight:700,color:C.txt}}>Community Library</h1><p style={{color:C.mut,fontSize:13.5,marginTop:4}}>Every book Amravati Reads has discussed</p></div>
      <button className="bp" onClick={()=>toast("Book suggestion submitted ✓","success")}><Plus size={14}/> Add Book</button>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
      <Stat icon={BookOpen}   label="Books Discussed" value={ALL_BOOKS.length} change="3" color={C.pri} delay="d1"/>
      <Stat icon={Star}       label="Avg Rating"       value={avgRating}                   color={C.acc} delay="d2"/>
      <Stat icon={Hash}       label="Genres Covered"   value={genres.length-1}             color={C.suc} delay="d3"/>
      <Stat icon={Users}      label="Total Readers"    value={MEMBERS.length}              color={C.dan} delay="d4"/>
    </div>
    <div className="card up d4" style={{padding:"14px 18px",marginBottom:18}}>
      <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
        <div style={{position:"relative",flex:1,minWidth:200}}>
          <Search size={14} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:C.mut,pointerEvents:"none"}}/>
          <input className="inp" placeholder="Search books or authors…" style={{paddingLeft:34}} value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <div className="seg" style={{flexWrap:"wrap"}}>
          {genres.slice(0,7).map(g=><button key={g} className={`seg-btn ${genre===g?"on":""}`} onClick={()=>setGenre(g)}>{g}</button>)}
        </div>
      </div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",gap:14}}>
      {list.map((book,idx)=>{
        const col = PAL[book.title.charCodeAt(0)%PAL.length];
        return <div key={book.title} className={`card cl up d${Math.min(idx+1,8)}`} style={{padding:20,display:"flex",gap:16,alignItems:"center",cursor:"pointer"}}>
          <div style={{width:52,height:68,borderRadius:8,background:col+"18",border:`1px solid ${col}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>📖</div>
          <div style={{flex:1,minWidth:0}}>
            <h3 style={{fontSize:14,fontWeight:600,color:C.txt,marginBottom:3,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{book.title}</h3>
            <p style={{fontSize:12.5,color:C.mut,marginBottom:8}}>by {book.author}</p>
            <div style={{display:"flex",alignItems:"center",gap:10}}><span className="tag tagi" style={{fontSize:11}}>{book.genre}</span><span style={{fontSize:11.5,color:C.mut}}>{book.month}</span></div>
          </div>
          <div style={{textAlign:"right",flexShrink:0}}>
            <div style={{display:"flex",gap:2,justifyContent:"flex-end",marginBottom:4}}>
              {[...Array(5)].map((_,si)=><Star key={si} size={11} fill={si<Math.floor(book.rating)?C.acc:"none"} color={si<Math.floor(book.rating)?C.acc:"rgba(255,255,255,.12)"}/>)}
            </div>
            <p style={{fontSize:12,fontWeight:600,color:C.acc}}>{book.rating}</p>
            <p style={{fontSize:11,color:C.mut,marginTop:2}}>{book.discussions} discussion{book.discussions>1?"s":""}</p>
          </div>
        </div>;
      })}
    </div>
  </div>;
};

// ─── INSIGHTS VIEW ────────────────────────────────────────────────────────────
const InsightsView = () => {
  const active = MEMBERS.filter(m=>m.status==="active").length;
  const activeRate = Math.round((active/MEMBERS.length)*100);
  const avgRating = (ALL_BOOKS.reduce((a,b)=>a+b.rating,0)/ALL_BOOKS.length).toFixed(1);
  const top = MEMBERS.slice().sort((a,b)=>b.booksRead-a.booksRead).slice(0,5);
  return <div className="page">
    <div className="up" style={{marginBottom:26}}>
      <h1 style={{fontSize:27,fontWeight:700,color:C.txt}}>Insights</h1>
      <p style={{color:C.mut,fontSize:13.5,marginTop:4}}>Community health and engagement at a glance</p>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
      <Stat icon={Users}      label="Total Readers"   value={MEMBERS.length} change="3"     color={C.pri} delay="d1"/>
      <Stat icon={Activity}   label="Active Rate"      value={`${activeRate}%`}              color={C.suc} delay="d2"/>
      <Stat icon={BookMarked} label="Books Discussed"  value={ALL_BOOKS.length} change="3"  color={C.acc} delay="d3"/>
      <Stat icon={Star}       label="Avg Book Rating"  value={avgRating}                     color={C.dan} delay="d4"/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:14,marginBottom:14}}>
      <div className="card up d5" style={{padding:24}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
          <div><h3 style={{fontSize:15,fontWeight:600,color:C.txt,marginBottom:3}}>Engagement Over Time</h3><p style={{color:C.mut,fontSize:12.5}}>Average event attendance %</p></div>
          <span style={{fontSize:11.5,color:C.suc,background:"rgba(62,180,137,.1)",padding:"4px 10px",borderRadius:20}}>↑ 18% YoY</span>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={ENGAGE} margin={{top:4,right:4,left:-20,bottom:0}}>
            <defs><linearGradient id="gAtt" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.suc} stopOpacity={.28}/><stop offset="95%" stopColor={C.suc} stopOpacity={0}/></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)" vertical={false}/>
            <XAxis dataKey="m" tick={{fill:C.mut,fontSize:11.5}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:C.mut,fontSize:11.5}} axisLine={false} tickLine={false} domain={[60,100]}/>
            <Tooltip content={<Tip/>}/>
            <Area type="monotone" dataKey="att" name="Attendance %" stroke={C.suc} strokeWidth={2} fill="url(#gAtt)" dot={false}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="card up d6" style={{padding:24}}>
        <h3 style={{fontSize:15,fontWeight:600,color:C.txt,marginBottom:4}}>Member Status</h3>
        <p style={{color:C.mut,fontSize:12.5,marginBottom:20}}>Reader engagement breakdown</p>
        {[{lbl:"Active",v:active,col:C.suc},{lbl:"Inactive",v:MEMBERS.filter(m=>m.status==="inactive").length,col:C.mut},{lbl:"New",v:MEMBERS.filter(m=>m.status==="new").length,col:C.acc}].map(s=>(
          <div key={s.lbl} style={{marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:13,color:C.txt}}>{s.lbl}</span><span style={{fontSize:12,fontWeight:600,color:s.col}}>{s.v} · {Math.round((s.v/MEMBERS.length)*100)}%</span></div>
            <div className="pt"><div className="pf" style={{width:`${(s.v/MEMBERS.length)*100}%`,background:s.col}}/></div>
          </div>
        ))}
        <div style={{paddingTop:16,borderTop:"1px solid rgba(255,255,255,.06)",marginTop:6}}>
          <h4 style={{fontSize:13.5,fontWeight:600,color:C.txt,marginBottom:12}}>Monthly Events</h4>
          <ResponsiveContainer width="100%" height={80}>
            <BarChart data={ENGAGE.slice(-6)} margin={{top:0,right:0,left:-30,bottom:0}}>
              <XAxis dataKey="m" tick={{fill:C.mut,fontSize:10.5}} axisLine={false} tickLine={false}/>
              <Tooltip content={<Tip/>}/>
              <Bar dataKey="bks" name="Events" fill={C.pri} radius={[3,3,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      <div className="card up d7" style={{padding:24}}>
        <h3 style={{fontSize:15,fontWeight:600,color:C.txt,marginBottom:18}}>Top Readers</h3>
        {top.map((m,idx)=>(
          <div key={m.id} style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
            <span style={{fontSize:13,fontWeight:700,color:C.mut,width:18,textAlign:"right"}}>#{idx+1}</span>
            <Av name={m.name} size={34} radius={9}/>
            <div style={{flex:1}}><p style={{fontSize:13.5,fontWeight:500,color:C.txt}}>{m.name}</p><p style={{fontSize:12,color:C.mut}}>{m.interests[0]}</p></div>
            <div style={{textAlign:"right"}}><p style={{fontSize:14,fontWeight:700,color:C.acc,fontFamily:"'Space Grotesk',sans-serif"}}>{m.booksRead}</p><p style={{fontSize:11,color:C.mut}}>books</p></div>
          </div>
        ))}
      </div>
      <div className="card up d8" style={{padding:24}}>
        <h3 style={{fontSize:15,fontWeight:600,color:C.txt,marginBottom:4}}>Books by Genre</h3>
        <p style={{color:C.mut,fontSize:12.5,marginBottom:18}}>Distribution across discussions</p>
        {Array.from(new Set(ALL_BOOKS.map(b=>b.genre))).map((g,i)=>{
          const count = ALL_BOOKS.filter(b=>b.genre===g).length;
          return <div key={g} style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:13,color:C.txt}}>{g}</span><span style={{fontSize:12,color:C.mut}}>{count} book{count>1?"s":""}</span></div>
            <div className="pt"><div className="pf" style={{width:`${(count/ALL_BOOKS.length)*100}%`,background:PAL[i%PAL.length]}}/></div>
          </div>;
        })}
      </div>
    </div>
  </div>;
};

// ─── SETTINGS VIEW ───────────────────────────────────────────────────────────
const SettingsView = ({ toast, openConfirm }) => {
  const [cfg, setCfg] = useState<Config>({name:"Amravati Reads",desc:"A reading community in the heart of Amravati, Maharashtra.",location:"Amravati, Maharashtra",email:"amravatireads@gmail.com",website:"amravatireads.in",notifyEvent:true,notifyMember:true,notifyDigest:false,maxEvent:25,autoWelcome:true});
  const s = (k: keyof Config, v: Config[keyof Config]) => setCfg(p=>({...p,[k]:v}));
  return <div className="page">
    <div className="up" style={{marginBottom:26}}><h1 style={{fontSize:27,fontWeight:700,color:C.txt}}>Settings</h1><p style={{color:C.mut,fontSize:13.5,marginTop:4}}>Configure your community preferences</p></div>
    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:20}}>
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        <div className="card up d1" style={{padding:26}}>
          <h3 style={{fontSize:15,fontWeight:600,color:C.txt,marginBottom:18}}>Community Info</h3>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div style={{display:"flex",gap:16,alignItems:"center",padding:16,borderRadius:12,background:"rgba(109,93,246,.06)",border:"1px solid rgba(109,93,246,.12)",marginBottom:4}}>
              <div style={{width:56,height:56,borderRadius:14,background:"linear-gradient(135deg,#6D5DF6,#4A3DB5)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 14px rgba(109,93,246,.45)"}}><BookOpen size={24} color="#fff"/></div>
              <div><p style={{fontSize:16,fontWeight:700,color:C.txt,fontFamily:"'Space Grotesk',sans-serif"}}>Amravati Reads</p><p style={{fontSize:12.5,color:C.mut}}>Founded Jan 2024 · {MEMBERS.length} members</p></div>
              <button className="bg" style={{marginLeft:"auto",padding:"7px 14px",fontSize:12.5}}>Change Logo</button>
            </div>
            <div><Lbl>Community Name</Lbl><input className="inp" value={cfg.name} onChange={e=>s("name",e.target.value)}/></div>
            <div><Lbl>Description</Lbl><textarea className="inp" value={cfg.desc} onChange={e=>s("desc",e.target.value)}/></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <div><Lbl>Location</Lbl><input className="inp" value={cfg.location} onChange={e=>s("location",e.target.value)}/></div>
              <div><Lbl>Contact Email</Lbl><input className="inp" type="email" value={cfg.email} onChange={e=>s("email",e.target.value)}/></div>
            </div>
            <div><Lbl>Website</Lbl><input className="inp" placeholder="yoursite.com" value={cfg.website} onChange={e=>s("website",e.target.value)}/></div>
          </div>
        </div>
        <div className="card up d2" style={{padding:26}}>
          <h3 style={{fontSize:15,fontWeight:600,color:C.txt,marginBottom:18}}>Notifications</h3>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {([{k:"notifyEvent",lbl:"Event reminders",desc:"48h before each scheduled event"},{k:"notifyMember",lbl:"New member alerts",desc:"When someone joins the community"},{k:"notifyDigest",lbl:"Weekly digest",desc:"Community activity summary each Monday"}] as {k: keyof Config; lbl: string; desc: string}[]).map(item=>(
              <div key={item.k} style={{display:"flex",alignItems:"center",gap:12,padding:14,borderRadius:11,background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.06)",cursor:"pointer"}}
                onClick={()=>{ s(item.k, !cfg[item.k] as boolean); toast(`${item.lbl} ${!cfg[item.k] as boolean?"enabled":"disabled"}`,"info"); }}>
                <div className={`chk ${(cfg[item.k] as boolean)?"on":""}`}>{(cfg[item.k] as boolean)&&<Check size={11} color="#fff"/>}</div>
                <div style={{flex:1}}><p style={{fontSize:13.5,fontWeight:500,color:C.txt}}>{item.lbl}</p><p style={{fontSize:12,color:C.mut}}>{item.desc}</p></div>
                <span style={{fontSize:11.5,fontWeight:500,padding:"3px 10px",borderRadius:20,background:(cfg[item.k] as boolean)?"rgba(62,180,137,.12)":"rgba(138,148,166,.1)",color:(cfg[item.k] as boolean)?C.suc:C.mut,transition:"all .2s"}}>{(cfg[item.k] as boolean)?"On":"Off"}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{display:"flex",justifyContent:"flex-end",gap:10}}>
          <button className="bg">Reset</button>
          <button className="bp" style={{minWidth:120,justifyContent:"center"}} onClick={()=>toast("Settings saved successfully","success")}><Check size={14}/> Save Changes</button>
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div className="card up d2" style={{padding:20}}>
          <h3 style={{fontSize:14.5,fontWeight:600,color:C.txt,marginBottom:14}}>Community Stats</h3>
          {[{lbl:"Total members",v:MEMBERS.length,col:C.pri},{lbl:"Active readers",v:MEMBERS.filter(m=>m.status==="active").length,col:C.suc},{lbl:"Events hosted",v:ALL_EVENTS.filter(e=>e.status==="past").length,col:C.acc},{lbl:"Books discussed",v:ALL_BOOKS.length,col:C.dan},{lbl:"Avg rating",v:(ALL_BOOKS.reduce((a,b)=>a+b.rating,0)/ALL_BOOKS.length).toFixed(1),col:C.mut}].map(s=>(
            <div key={s.lbl} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid rgba(255,255,255,.04)"}}><span style={{fontSize:13,color:C.mut}}>{s.lbl}</span><span style={{fontSize:13.5,fontWeight:600,color:s.col}}>{s.v}</span></div>
          ))}
        </div>
        <div className="card up d3" style={{padding:20}}>
          <h3 style={{fontSize:14.5,fontWeight:600,color:C.txt,marginBottom:14}}>Export Data</h3>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {["Member list (CSV)","Event history (CSV)","Reading log (CSV)","Full backup (JSON)"].map(item=>(
              <button key={item} className="bg" style={{width:"100%",justifyContent:"space-between",fontSize:13}} onClick={()=>toast(`Exporting ${item}…`,"info")}>{item}<ChevronRight size={13}/></button>
            ))}
          </div>
        </div>
        <div className="card up d4" style={{padding:20,borderColor:"rgba(224,108,117,.2)"}}>
          <h3 style={{fontSize:14.5,fontWeight:600,color:C.dan,marginBottom:14}}>Danger Zone</h3>
          <p style={{fontSize:12.5,color:C.mut,marginBottom:14,lineHeight:1.6}}>Permanently delete all community data. This cannot be undone.</p>
          <button onClick={()=>openConfirm({title:"Delete Community?",msg:"All members, events, and data will be permanently erased. This is irreversible.",onConfirm:()=>toast("Request submitted to support","info"),variant:"danger"})}
            style={{background:"transparent",border:"1px solid rgba(224,108,117,.3)",borderRadius:10,padding:"9px 18px",fontSize:13.5,color:"rgba(224,108,117,.8)",cursor:"pointer",width:"100%",fontFamily:"'Inter',sans-serif",transition:"all .17s"}}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(224,108,117,.08)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            Delete Community
          </button>
        </div>
      </div>
    </div>
  </div>;
};

// ─── APP ─────────────────────────────────────────────────────────────────────
function AppInner() {
  const toast       = useToast();
  const [view,      setView]      = useState("dashboard");
  const [loading,   setLoading]   = useState(false);
  const [member,    setMember]    = useState<Member | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [cmdOpen,   setCmdOpen]   = useState(false);
  const [drawer,    setDrawer]    = useState<Member | null>(null);
  const [confirm,   setConfirm]   = useState<ConfirmConfig | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);

  const unread = NOTIFS.filter(n=>!n.read).length;

  // Smooth view transitions with skeleton
  const navigate = useCallback((v: string) => {
    if (v === view) return;
    setLoading(true);
    setTimeout(() => { setView(v); setLoading(false); }, 180);
  }, [view]);

  // Global keyboard shortcuts
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      // Cmd/Ctrl+K → command palette
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setCmdOpen(c=>!c); return; }
      // Escape → close any open overlay
      if (e.key === "Escape") { setCmdOpen(false); setDrawer(null); setConfirm(null); setNotifOpen(false); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const openDrawer  = (m: Member) => { setDrawer(m); setNotifOpen(false); };
  const openConfirm = (conf: ConfirmConfig) => setConfirm(conf);
  const commonProps = { toast, openConfirm };
  const sideW = collapsed ? 68 : 236;

  return (
    <div className="rcms" style={{ display:"flex" }}>
      <Sidebar
        view={view}
        setView={navigate}
        col={collapsed}
        toggle={() => setCollapsed(c=>!c)}
        onCmd={() => setCmdOpen(true)}
        notifCount={unread}
        onNotif={() => setNotifOpen(o=>!o)}
      />

      <main style={{ flex:1, marginLeft:sideW, transition:"margin-left .32s cubic-bezier(.16,1,.3,1)", minHeight:"100vh" }}>
        {loading
          ? <Skeleton/>
          : <>
              {view==="dashboard"  && <Dashboard  setView={navigate} setMember={setMember} openDrawer={openDrawer}/>}
              {view==="members"    && <MembersHub setView={navigate} setMember={setMember} openDrawer={openDrawer} {...commonProps}/>}
              {view==="add-member" && <AddMemberFlow setView={navigate} {...commonProps}/>}
              {view==="profile"    && <MemberProfile member={member} setView={navigate} {...commonProps}/>}
              {view==="events"     && <EventsView   {...commonProps}/>}
              {view==="books"      && <LibraryView  {...commonProps}/>}
              {view==="insights"   && <InsightsView/>}
              {view==="settings"   && <SettingsView {...commonProps}/>}
            </>}
      </main>

      {/* ── Overlays ── */}
      {cmdOpen && (
        <CommandPalette
          onClose={() => setCmdOpen(false)}
          setView={(v: string) => { navigate(v); setCmdOpen(false); }}
          setMember={setMember}
        />
      )}

      {notifOpen && <NotifPanel onClose={() => setNotifOpen(false)}/>}

      {drawer && (
        <MemberDrawer
          member={drawer}
          onClose={() => setDrawer(null)}
          onProfile={() => { setMember(drawer); navigate("profile"); setDrawer(null); }}
          onRemove={() => openConfirm({
            title: `Remove ${drawer.name}?`,
            msg: "This reader will be permanently removed from Amravati Reads. This cannot be undone.",
            onConfirm: () => { toast(`${drawer.name} removed from community`, "info"); setDrawer(null); },
          })}
        />
      )}

      {confirm && (
        <ConfirmModal
          title={confirm.title}
          msg={confirm.msg}
          variant={confirm.variant || "danger"}
          onConfirm={() => { confirm.onConfirm(); setConfirm(null); }}
          onClose={() => setConfirm(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <GlobalStyles/>
      <AppInner/>
    </ToastProvider>
  );
}
