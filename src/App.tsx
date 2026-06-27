import { useState, useRef, useEffect, useContext, createContext, useCallback } from "react";
import {
  BookOpen, Users, Calendar, TrendingUp, Search, Home, Settings, X, Trash2, Mail
} from "lucide-react";

// ─── STYLES ──────────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
   .rcms*,.rcms*::before,.rcms*::after{box-sizing:border-box;margin:0;padding:0}
   .rcms{font-family:'Inter',-apple-system,sans-serif;background:#0B1020;color:#F5F7FA;min-height:100vh;-webkit-font-smoothing:antialiased}
   .rcms h1,.rcms h2,.rcms h3{font-family:'Space Grotesk',-apple-system,sans-serif}
   .sb{position:fixed;top:0;left:0;height:100vh;background:#0D1525;border-right:1px solid rgba(255,255,255,.05);display:flex;flex-direction:column;overflow:hidden}
   .ni{display:flex;align-items:center;gap:11px;padding:9px 14px;margin:1px 8px;border-radius:10px;cursor:pointer;color:#8A94A6;font-size:13.5px;font-weight:500;transition:all.18s;white-space:nowrap;background:transparent;border:none;font-family:'Inter'}
   .ni:hover{background:rgba(109,93,246,.08);color:#D8DCE8}
   .ni.on{background:rgba(109,93,246,.14);color:#F5F7FA}
   .card{background:#121A2A;border:1px solid rgba(255,255,255,.06);border-radius:16px}
   .bp{background:#6D5DF6;color:#fff;border:none;border-radius:10px;padding:9px 18px;font-size:13.5px;font-weight:500;cursor:pointer;display:inline-flex;align-items:center;gap:7px;font-family:'Inter'}
   .bp:hover{background:#7B6CF8}
   .bg{background:transparent;color:#8A94A6;border:1px solid rgba(255,255,255,.09);border-radius:10px;padding:9px 18px;font-size:13.5px;cursor:pointer;display:inline-flex;align-items:center;gap:7px}
   .bg:hover{background:rgba(255,255,255,.05);color:#F5F7FA}
   .bi{background:transparent;border:none;color:#8A94A6;cursor:pointer;padding:7px;border-radius:8px;display:inline-flex}
   .bi:hover{background:rgba(255,255,255,.07);color:#F5F7FA}
   .inp{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.09);border-radius:10px;padding:10px 14px;color:#F5F7FA;font-size:13.5px;width:100%;font-family:'Inter';outline:none}
   .inp:focus{border-color:rgba(109,93,246,.55);background:rgba(109,93,246,.05)}
   .page{padding:32px;overflow-y:auto;max-height:100vh}
   .backdrop{position:fixed;inset:0;background:rgba(11,16,32,.78);backdrop-filter:blur(5px);z-index:500}
   .drawer{position:fixed;right:0;top:0;height:100vh;width:420px;background:#0E1828;border-left:1px solid rgba(255,255,255,.07);z-index:801;overflow-y:auto}
   .drawer-bd{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:800}
   .cr{display:flex;align-items:center;gap:12px;padding:9px 20px;cursor:pointer;transition:background.1s}
   .cr:hover,.cr.foc{background:rgba(109,93,246,.11)}
   .ci{animation:rcms-in.28s ease both}
    @keyframes rcms-in{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
   .fin{animation:rcms-in.2s ease both}
   .toast-wrap{position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px}
    kbd{font-family:'Inter';font-size:11px;background:rgba(255,255,255,.08);color:#8A94A6;padding:2px 6px;border-radius:5px;border:1px solid rgba(255,255,255,.1)}
  `}</style>
);

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const C = { bg:"#0B1020",sur:"#121A2A",pri:"#6D5DF6",acc:"#D6A756",suc:"#3EB489",txt:"#F5F7FA",mut:"#8A94A6",dan:"#E06C75" };

const MEMBERS = [
  {id:"m1",name:"Anika Sharma",email:"anika.sharma@gmail.com",phone:"+91 98765 43210",location:"Amravati",joinDate:"15 Jan 2024",lastActivity:"10 Jun 2025",status:"active",interests:["Literary Fiction","Poetry"],booksRead:34,eventsAttended:12,contributions:8,bio:"Passionate about Indian literature and Marathi poetry."},
  {id:"m2",name:"Rohan Desai",email:"rohan.desai@gmail.com",phone:"+91 87654 32109",location:"Amravati",joinDate:"3 Mar 2024",lastActivity:"8 Jun 2025",status:"active",interests:["Philosophy","Science"],booksRead:28,eventsAttended:9,contributions:5,bio:"Philosophy grad student."},
  {id:"m3",name:"Priya Kulkarni",email:"priya.kulkarni@gmail.com",phone:"+91 76543 21098",location:"Amravati",joinDate:"20 Apr 2024",lastActivity:"1 Jun 2025",status:"active",interests:["Mystery","Psychology"],booksRead:22,eventsAttended:7,contributions:3,bio:"Mystery enthusiast."},
  {id:"m5",name:"Kavya Patil",email:"kavya.patil@gmail.com",phone:"+91 54321 09876",location:"Amravati",joinDate:"10 Jun 2025",lastActivity:"10 Jun 2025",status:"new",interests:["Self-Help"],booksRead:2,eventsAttended:1,contributions:0,bio:"Just joined!"},
];

const ALL_EVENTS = [
  {id:"e1",title:"June Discussion",book:"The God of Small Things",author:"Arundhati Roy",date:"22 Jun 2025",time:"6:00 PM",venue:"Central Library",attendees:18,max:25,status:"upcoming",genre:"Literary Fiction"},
  {id:"e2",title:"Poetry Evening",book:"Gitanjali",author:"Rabindranath Tagore",date:"29 Jun 2025",time:"5:30 PM",venue:"Café Chapters",attendees:12,max:20,status:"upcoming",genre:"Poetry"},
];

const ALL_BOOKS = [
  {title:"The God of Small Things",author:"Arundhati Roy",genre:"Literary Fiction",month:"Jun 2025",rating:4.8},
  {title:"Gitanjali",author:"Rabindranath Tagore",genre:"Poetry",month:"Jun 2025",rating:4.6},
  {title:"Sapiens",author:"Yuval Noah Harari",genre:"Non-Fiction",month:"Apr 2025",rating:4.5},
];

// ─── TYPES ───────────────────────────────────────────────────────────────────
type Member = typeof MEMBERS[number];
type ConfirmConfig = { title:string; msg:string; onConfirm:()=>void; variant?: "danger"|"info" };

// ─── TOAST ───────────────────────────────────────────────────────────────────
const ToastCtx = createContext<((msg:string,type?:string)=>void) | null>(null);
const useToast = () => useContext(ToastCtx)!;
const ToastProvider = ({ children }: any) => {
  const [toasts,setToasts]=useState<any[]>([]);
  const add = useCallback((msg:string,type="success")=>{
    const id=Date.now()+Math.random();
    setToasts(p=>[...p,{id,msg,type}]);
    setTimeout(()=>setToasts(p=>p.filter(t=>t.id!==id)),3200);
  },[]);
  return (
    <ToastCtx.Provider value={add}>
      {children}
      <div className="toast-wrap">
        {toasts.map(t=>(
          <div key={t.id} className="card" style={{padding:"12px 16px",minWidth:280,display:"flex",alignItems:"center",gap:10}}>
            <span style={{color:t.type==="error"?C.dan:C.suc}}>{t.type==="error"?"✕":"✓"}</span>
            <span style={{fontSize:13.5,color:C.txt}}>{t.msg}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const gc = (n:string)=>["#6D5DF6","#D6A756","#3EB489","#E06C75"][n.charCodeAt(0)%4];
const gi = (n:string)=>n.split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase();
const Av = ({ name, size=40 }: any) => {
  const col=gc(name);
  return <div style={{width:size,height:size,borderRadius:12,background:col+"20",border:`1px solid ${col}35`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,color:col}}>{gi(name)}</div>;
};
const Bdg = ({ status }: any) => {
  const map:any={active:{l:"Active",c:C.suc},new:{l:"New",c:C.acc},inactive:{l:"Inactive",c:C.mut}};
  const s=map[status]||map.inactive;
  return <span style={{fontSize:11,padding:"3px 8px",borderRadius:12,background:s.c+"20",color:s.c,border:`1px solid ${s.c}30`}}>{s.l}</span>;
};

// ─── CONFIRM MODAL ───────────────────────────────────────────────────────────
const ConfirmModal = ({ title, msg, onConfirm, onClose, variant="danger" }: any) => {
  const col = variant==="danger"?C.dan:C.pri;
  return <>
    <div className="backdrop fin" onClick={onClose} style={{zIndex:900}}/>
    <div style={{position:"fixed",inset:0,display:"flex",alignItems:"center",justifyContent:"center",zIndex:901}}>
      <div className="card" style={{padding:24,maxWidth:380,width:"90%"}}>
        <h3 style={{marginBottom:8}}>{title}</h3>
        <p style={{color:C.mut,fontSize:14,marginBottom:20}}>{msg}</p>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
          <button className="bg" onClick={onClose}>Cancel</button>
          <button className="bp" style={{background:col}} onClick={()=>{onConfirm();onClose();}}>Confirm</button>
        </div>
      </div>
    </div>
  </>;
};

// ─── MEMBER DRAWER ───────────────────────────────────────────────────────────
const MemberDrawer = ({ member, onClose, onRemove }: any) => {
  if(!member) return null;
  return <>
    <div className="drawer-bd fin" onClick={onClose}/>
    <div className="drawer">
      <div style={{padding:20,borderBottom:"1px solid rgba(255,255,255,.06)",display:"flex",justifyContent:"space-between"}}>
        <span style={{color:C.mut,fontSize:12}}>Quick View</span>
        <button className="bi" onClick={onClose}><X size={16}/></button>
      </div>
      <div style={{padding:24}}>
        <div style={{display:"flex",gap:16,marginBottom:20}}>
          <Av name={member.name} size={56}/>
          <div>
            <h2 style={{marginBottom:4}}>{member.name}</h2>
            <Bdg status={member.status}/>
            <p style={{color:C.mut,fontSize:13,marginTop:4}}>{member.email}</p>
          </div>
        </div>
        <p style={{background:"rgba(109,93,246,.06)",padding:14,borderRadius:12,fontSize:14,marginBottom:18}}>{member.bio}</p>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <button className="bg" style={{width:"100%",justifyContent:"center"}}><Mail size={14}/> Send Email</button>
          <button onClick={onRemove} style={{background:"transparent",border:"1px solid rgba(224,108,117,.3)",color:C.dan,padding:"9px",borderRadius:10,width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
            <Trash2 size={14}/> Remove Reader
          </button>
        </div>
      </div>
    </div>
  </>;
};

// ─── COMMAND PALETTE ─────────────────────────────────────────────────────────
const CommandPalette = ({ onClose, setView, setMember }: any) => {
  const [q,setQ]=useState("");
  const [foc,setFoc]=useState(0);
  const ref=useRef<HTMLInputElement>(null);
  useEffect(()=>{ref.current?.focus()},[]);

  const mRes = q? MEMBERS.filter(m=>m.name.toLowerCase().includes(q.toLowerCase())) : [];
  const eRes = q? ALL_EVENTS.filter(e=>e.title.toLowerCase().includes(q.toLowerCase())) : [];
  const bRes = q? ALL_BOOKS.filter(b=>b.title.toLowerCase().includes(q.toLowerCase())) : [];

  const allResults = [
   ...mRes.map(m=>({lbl:m.name,sub:"Member",icon:"👤",action:()=>{setMember(m);onClose();}})),
   ...eRes.map(e=>({lbl:e.title,sub:"Event",icon:"📅",action:()=>{setView("events");onClose();}})),
   ...bRes.map(b=>({lbl:b.title,sub:"Book",icon:"📚",action:()=>{setView("books");onClose();}})),
  ];

  return <>
    <div className="backdrop fin" onClick={onClose} style={{zIndex:1000}}/>
    <div className="card ci" style={{position:"fixed",top:"20%",left:"50%",transform:"translateX(-50%)",width:500,zIndex:1001,overflow:"hidden"}}>
      <div style={{padding:"12px 16px",borderBottom:"1px solid rgba(255,255,.05)",display:"flex",alignItems:"center",gap:12}}>
        <Search size={16} color={C.mut}/>
        <input ref={ref} value={q} onChange={e=>setQ(e.target.value)} placeholder="Search readers, events, books..." className="inp" style={{background:"transparent",border:"none",padding:0}} onKeyDown={e=>{if(e.key==="Enter")allResults[foc]?.action();if(e.key==="Escape")onClose();}}/>
      </div>
      <div style={{maxHeight:320,overflowY:"auto"}}>
        {allResults.map((r,i)=>(
          <div key={i} className={`cr ${i===foc?"foc":""}`} onClick={r.action} onMouseEnter={()=>setFoc(i)}>
            <span style={{fontSize:16}}>{r.icon}</span>
            <div>
              <p style={{fontSize:13.5,color:C.txt,fontWeight:500}}>{r.lbl}</p>
              <p style={{fontSize:11.5,color:C.mut}}>{r.sub}</p>
            </div>
          </div>
        ))}
        {allResults.length===0 && <div style={{padding:40,textAlign:"center",color:C.mut}}>Type to search...</div>}
      </div>
    </div>
  </>;
};

// ─── APP INNER ───────────────────────────────────────────────────────────────
function AppInner() {
  const [view,setView]=useState("dashboard");
  const [openCmd,setOpenCmd]=useState(false);
  const [activeMember,setActiveMember]=useState<Member|null>(null);
  const [confirm,setConfirm]=useState<ConfirmConfig|null>(null);
  const addToast=useToast();

  useEffect(()=>{
    const h=(e:KeyboardEvent)=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();setOpenCmd(o=>!o)}};
    window.addEventListener("keydown",h);
    return()=>window.removeEventListener("keydown",h);
  },[]);

  const handleRemoveMember=()=>{
    if(!activeMember) return;
    setConfirm({
      title:"Remove Reader",
      msg:`Are you sure you want to remove ${activeMember.name}? This action cannot be undone.`,
      onConfirm:()=>{
        addToast("Reader removed successfully","error");
        setActiveMember(null);
      },
      variant:"danger"
    });
  };

  const nav=[
    {id:"dashboard",lbl:"Dashboard",icon:Home},
    {id:"members",lbl:"Readers Hub",icon:Users},
    {id:"events",lbl:"Events",icon:Calendar},
    {id:"books",lbl:"Library",icon:BookOpen},
    {id:"insights",lbl:"Insights",icon:TrendingUp},
    {id:"settings",lbl:"Settings",icon:Settings},
  ];

  return (
    <div className="rcms" style={{display:"flex"}}>
      <aside className="sb" style={{width:240}}>
        <div style={{padding:"24px 20px"}}><h2 style={{fontSize:18,color:C.txt}}>Amravati Reads</h2></div>
        <div style={{flex:1}}>
          {nav.map(n=>{const Icon=n.icon;return <button key={n.id} className={`ni ${view===n.id?"on":""}`} onClick={()=>setView(n.id)}><Icon size={16}/>{n.lbl}</button>})}
        </div>
        <div style={{padding:16}}>
          <button className="bp" style={{width:"100%"}} onClick={()=>setOpenCmd(true)}><Search size={14}/> Quick Action <kbd style={{marginLeft:"auto"}}>⌘K</kbd></button>
        </div>
      </aside>

      <main style={{marginLeft:240,flex:1,minHeight:"100vh"}}>
        <div className="page">
          <h1 style={{fontSize:24,marginBottom:24}}>{nav.find(n=>n.id===view)?.lbl}</h1>
          <div className="card" style={{padding:40,textAlign:"center",color:C.mut}}>
            <p>Content for <strong>{view}</strong> goes here.</p>
            <p style={{marginTop:12,fontSize:13}}>Members: {MEMBERS.length} • Events: {ALL_EVENTS.length} • Books: {ALL_BOOKS.length}</p>
          </div>
        </div>
      </main>

      {openCmd && <CommandPalette onClose={()=>setOpenCmd(false)} setView={setView} setMember={setActiveMember}/>}
      {activeMember && <MemberDrawer member={activeMember} onClose={()=>setActiveMember(null)} onRemove={handleRemoveMember}/>}
      {confirm && <ConfirmModal {...confirm} onClose={()=>setConfirm(null)}/>}
    </div>
  );
}

// ─── EXPORT ──────────────────────────────────────────────────────────────────
export default function App(){
  return (
    <ToastProvider>
      <GlobalStyles/>
      <AppInner/>
    </ToastProvider>
  );
}
