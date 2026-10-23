/* ===== EDIT YOUR DETAILS HERE ===== */
const ME = {
  first:"Keith", full:"Keith Marten Alaan", email:"keithalaan7@gmail.com",
  tagline:"I like figuring out how things work, then making them work better.",
  about:"I’m a student who enjoys building things on the web. I learn by trying, breaking and fixing, and I care about making things that feel good to use.",
  // Your picture: keep keith.jpg in the same folder as index.html. It loads automatically.
  photos:["keith.jpg","Keith.jpg","keith.jpeg","keith.png","photo.jpg","photo.png"],
  skills:[{n:"HTML & CSS",v:80},{n:"JavaScript",v:65},{n:"Problem solving",v:85},{n:"Teamwork",v:90},{n:"Fast learning",v:88}],
  interests:[
    {n:"Coding",t:"Turning a blank file into something that runs never gets old."},
    {n:"Gaming",t:"Co-op games are my favorite. Winning together beats winning alone."},
    {n:"Music",t:"I always have a playlist going while I work."},
    {n:"Design",t:"Good design feels invisible. I’m learning how to build that."}
  ],
  truths:[
    {t:"I have stayed up all night to finish a project I was proud of.",lie:false},
    {t:"I can solve a Rubik’s Cube in under 20 seconds.",lie:true},
    {t:"I enjoy learning new tools just to see what they can do.",lie:false}
  ],
  facts:[
    "I get my best ideas when I’m not looking for them.",
    "I’d rather build a rough version today than plan a perfect one for weeks.",
    "I learn fastest by breaking things and fixing them.",
    "Type my first name in the chat for a secret."
  ],
  projects:[
    {t:"This website",x:"A chat-style personal site built with plain HTML, CSS and JavaScript.",tags:["HTML","CSS","JavaScript"]},
    {t:"Project two (edit me)",x:"Describe something you built or want to build.",tags:["Idea","Prototype"]},
    {t:"Project three (edit me)",x:"A class activity, a game or an app you are proud of.",tags:["Class","Team"]}
  ]
};
/* =================================== */
const $=id=>document.getElementById(id);
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
const chat=$("chat");

// ---- basics ----
$("tag").textContent=ME.tagline;
$("mailTop").href="mailto:"+ME.email;
let tt;function toast(m){const t=$("toast");t.textContent=m;t.classList.add("show");clearTimeout(tt);tt=setTimeout(()=>t.classList.remove("show"),2400)}
async function copyMail(){try{await navigator.clipboard.writeText(ME.email);toast("Email copied")}catch(e){toast("Copy this email: "+ME.email)}}
$("copy").onclick=copyMail;

// ---- photo (loads automatically) ----
let photoSrc=null;
function showPhoto(src){photoSrc=src;$("pic").src=src;$("pic").hidden=false;$("ini").hidden=true;$("avPic").src=src;$("avPic").hidden=false;$("avIni").hidden=true;
  const l=document.createElement("link");l.rel="icon";l.href=src;document.head.appendChild(l)}
(function find(list){const f=list[0];if(!f)return;const i=new Image();i.onload=()=>showPhoto(f);i.onerror=()=>find(list.slice(1));i.src=f})(ME.photos);
$("pframe").onclick=()=>$("file").click();
$("file").onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>showPhoto(r.result);r.readAsDataURL(f)};

// ---- dark mode ----
function setDark(on){document.body.classList.toggle("dark",on);$("theme").setAttribute("aria-pressed",on);$("theme").textContent=on?"Light":"Dark";try{localStorage.setItem("dark",on?"1":"0")}catch(e){}}
let sd=null;try{sd=localStorage.getItem("dark")}catch(e){}setDark(sd==="1");
$("theme").onclick=()=>setDark(!document.body.classList.contains("dark"));

// ---- chat engine ----
let q=Promise.resolve();
const wait=ms=>new Promise(r=>setTimeout(r,reduce?0:ms));
function bottom(){chat.scrollTop=chat.scrollHeight}
function bubble(who,content){
  const m=document.createElement("div");m.className="msg "+who;
  const b=document.createElement("div");b.className="bub";
  if(typeof content==="string")b.textContent=content;else b.appendChild(content);
  m.appendChild(b);chat.appendChild(m);bottom();return m;
}
function say(content,delay=650){
  q=q.then(async()=>{
    const t=bubble("bot",(()=>{const d=document.createElement("div");d.className="dots";d.innerHTML="<i></i><i></i><i></i>";return d})());
    await wait(delay);t.remove();bubble("bot",typeof content==="function"?content():content);
  });return q;
}
const mk=(tag,cls,html)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(html)e.innerHTML=html;return e};

// ---- rich bubbles ----
function photoBubble(){
  if(photoSrc){const i=mk("img","pimg");i.src=photoSrc;i.alt="Photo of Keith Marten Alaan";return i}
  return mk("div","pph","KA");
}
function skillsBubble(){const w=mk("div");
  ME.skills.forEach(s=>w.appendChild(mk("div","skill",`<div class="top"><span>${s.n}</span><span>${s.v}%</span></div><div class="bar"><i data-w="${s.v}"></i></div>`)));
  setTimeout(()=>w.querySelectorAll("i").forEach(i=>i.style.width=i.dataset.w+"%"),80);return w}
function hobbiesBubble(){const w=mk("div"),c=mk("div","hc"),d=mk("p","hd","Tap one to learn more.");
  ME.interests.forEach(it=>{const b=mk("button");b.textContent=it.n;b.setAttribute("aria-pressed","false");
    b.onclick=()=>{c.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b));d.textContent=it.t;bottom()};c.appendChild(b)});
  w.append(c,d);return w}
function projectsBubble(){const w=mk("div");
  ME.projects.forEach(p=>{const c=mk("div","pj");c.appendChild(mk("b"));c.firstChild.textContent=p.t;
    const x=mk("div");x.textContent=p.x;const t=mk("div","tg");p.tags.forEach(g=>{const s=mk("span");s.textContent=g;t.appendChild(s)});c.append(x,t);w.appendChild(c)});return w}
function contactBubble(){const w=mk("div"),a=mk("div");a.textContent=ME.email;a.style.fontWeight="800";
  const r=mk("div","cbtns");const m=mk("a","btn","Open email app");m.href="mailto:"+ME.email;
  const c=mk("button","btn alt","Copy email");c.onclick=copyMail;r.append(m,c);w.append(a,r);return w}
function truthsBubble(){const w=mk("div");let done=false;
  ME.truths.forEach(t=>{const b=mk("button","opt");b.textContent=t.t;
    b.onclick=()=>{if(done)return;done=true;w.querySelectorAll(".opt").forEach((o,i)=>{o.disabled=true;o.classList.add(ME.truths[i].lie?"right":"wrong")});
      if(t.lie){confetti();say("You found the lie! Nicely done.",400)}else say("Not quite. The green one was the lie.",400)};w.appendChild(b)});return w}
let best=0;
function gameBubble(){
  const w=mk("div","wg",`<div class="gbar"><span>Score <b class="s">0</b></span><span>Time <b class="t">15</b></span><button>Start</button></div><div class="arena"><button class="star" aria-label="Star target">★</button></div>`);
  const s=w.querySelector(".s"),t=w.querySelector(".t"),b=w.querySelector(".gbar button"),a=w.querySelector(".arena"),st=w.querySelector(".star");
  let sc=0,left=15,tm=null,on=false;
  const mv=()=>{st.style.left=Math.random()*(a.clientWidth-50)+"px";st.style.top=Math.random()*(a.clientHeight-50)+"px"};
  b.onclick=()=>{if(on)return;on=true;sc=0;left=15;s.textContent=0;t.textContent=left;st.style.display="block";mv();b.textContent="Playing";
    tm=setInterval(()=>{left--;t.textContent=left;if(left<=0){clearInterval(tm);on=false;st.style.display="none";b.textContent="Again";
      const nb=sc>best&&sc>0;if(nb){best=sc;confetti()}say(`You caught ${sc} stars. `+(nb?"That’s a new best!":"Want to beat it?"),400)}},1000)};
  st.onclick=()=>{if(!on)return;sc++;s.textContent=sc;mv()};return w}

// ---- actions ----
let factI=-1;
const A={
  about:{label:"Who are you?",run:()=>{say("Hi, I’m "+ME.full+".");say(ME.about,900);say(ME.tagline,700)}},
  photo:{label:"Show me your photo",run:()=>{say("Here I am:");say(photoBubble,500)}},
  skills:{label:"What are your skills?",run:()=>{say("Here’s what I’m good at:");say(skillsBubble,500)}},
  hobbies:{label:"What do you enjoy?",run:()=>{say("A few things I enjoy:");say(hobbiesBubble,500)}},
  projects:{label:"Show your projects",run:()=>{say("Some things I’ve built:");say(projectsBubble,500)}},
  game:{label:"Play a game",run:()=>{say("Catch as many stars as you can in 15 seconds!");say(gameBubble,500)}},
  truths:{label:"Two truths and a lie",run:()=>{say("Two of these are true. One is a lie. Which one?");say(truthsBubble,500)}},
  surprise:{label:"Surprise me",run:()=>{confetti(160);factI=(factI+1)%ME.facts.length;say("Here’s a random fact: "+ME.facts[factI],500)}},
  contact:{label:"How can I contact you?",run:()=>{say("The best way to reach me is email:");say(contactBubble,500)}}
};
const order=Object.keys(A);let last="";
function suggest(){
  const pool=order.filter(k=>k!==last),pick=pool.sort(()=>Math.random()-.5).slice(0,5);
  const c=$("chips");c.innerHTML="";
  pick.forEach(k=>{const b=mk("button");b.textContent=A[k].label;b.onclick=()=>act(k,A[k].label);c.appendChild(b)});
}
function act(k,text){bubble("me",text);last=k;A[k].run();q=q.then(suggest)}

// ---- free typing ----
const intents=[
  [/^(hi|hello|hey|kumusta|hola|yo)\b/,()=>say("Hello! Nice to meet you. Tap a reply or ask me something.")],
  [/who|about|yourself|introduc|name/,"about"],[/photo|picture|face|look|pic|image/,"photo"],
  [/skill|good at|tech|stack|abilit/,"skills"],[/hobb|interest|enjoy|like|free time|fun/,"hobbies"],
  [/project|built|made|portfolio|work/,"projects"],[/game|play|star/,"game"],[/truth|lie|quiz/,"truths"],
  [/surprise|random|fact|joke/,"surprise"],[/mail|contact|reach|hire|number|talk/,"contact"],
  [/thank/,()=>say("You’re welcome!")],[/bye|goodbye/,()=>say("Bye! Thanks for stopping by.")]
];
$("form").onsubmit=e=>{e.preventDefault();
  const v=$("inp").value.trim();$("inp").value="";
  if(!v){toast("Type a message first, or tap a reply below.");$("inp").focus();return}
  if(v.toLowerCase().includes(ME.first.toLowerCase())&&v.length<=ME.first.length+2){bubble("me",v);confetti(250);say("You found the secret. Nice one!",400);return}
  bubble("me",v);const low=v.toLowerCase();const m=intents.find(i=>i[0].test(low));
  if(!m){say("I didn’t catch that. Try “skills”, “projects” or “game”, or tap a reply below.",500);return}
  if(typeof m[1]==="function"){m[1]();return}
  last=m[1];A[m[1]].run();q=q.then(suggest)};

// ---- timer + 45 seconds ----
let sec=0;setInterval(()=>{sec++;$("timer").textContent=Math.floor(sec/60)+":"+String(sec%60).padStart(2,"0");
  if(sec===45){confetti(220);say("Psst… you’ve been here 45 seconds. Thanks for staying!",300)}},1000);

// ---- start / restart ----
function intro(){
  say("Hi, I’m Keith.",600);
  say("Welcome to my little corner of the internet.",800);
  say("Tap a reply below, or type to ask me anything.",800);
  q=q.then(suggest);suggest();
}
$("restart").onclick=()=>{chat.innerHTML="";q=Promise.resolve();last="";intro();toast("Chat restarted")};
intro();

// ---- confetti ----
const cv=$("fx"),cx=cv.getContext("2d");let ps=[],run=false;
const sz=()=>{cv.width=innerWidth;cv.height=innerHeight};addEventListener("resize",sz);sz();
function confetti(n=90){if(reduce)return;const cols=["#FF5D73","#FFD166","#7CE3C2","#CDB4FF","#22223B"];
  for(let i=0;i<n;i++)ps.push({x:innerWidth/2,y:innerHeight*.55,vx:(Math.random()-.5)*17,vy:-Math.random()*15-4,s:Math.random()*8+4,c:cols[i%5],r:Math.random()*6,l:110});
  if(!run){run=true;requestAnimationFrame(loop)}}
function loop(){cx.clearRect(0,0,cv.width,cv.height);ps=ps.filter(p=>p.l>0);
  ps.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.4;p.r+=.2;p.l--;cx.save();cx.translate(p.x,p.y);cx.rotate(p.r);cx.fillStyle=p.c;cx.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);cx.restore()});
  if(ps.length)requestAnimationFrame(loop);else run=false}
