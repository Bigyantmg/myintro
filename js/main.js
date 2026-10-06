(()=>{
const S=window.SITE,$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const h=(t,a={},c='')=>{const e=document.createElement(t);Object.entries(a).forEach(([k,v])=>e.setAttribute(k,v));e.innerHTML=c;return e};
const link=(url,label)=>url?`<a href="${url}" target="_blank" rel="noopener" data-cur="VIEW">${label}</a>`:`<span class="soon">${label} <small>(link coming soon)</small></span>`;

$('#brand').textContent=S.name;$('#fname').textContent=S.name;$('#yr').textContent=new Date().getFullYear();document.title=document.title.replace('Your Name',S.name);
$('#bio').textContent=S.bio;
$('#portrait').innerHTML=S.photo?`<img src="${S.photo}" alt="Portrait of ${S.name}" loading="lazy">`:`<svg viewBox="0 0 200 250" role="img" aria-label="Portrait placeholder"><rect width="200" height="250" fill="#cdbfa6"/><circle cx="100" cy="95" r="38" fill="#a89574"/><path d="M30 250c4-70 36-100 70-100s66 30 70 100z" fill="#a89574"/></svg><span>Add your photo in js/data.js</span>`;
const em=$('#emailLink');if(S.email){em.href='mailto:'+S.email;em.textContent=S.email}else{em.removeAttribute('href');em.textContent='Email address coming soon'}

/* intro */
const intro=$('#intro');
function endIntro(){clearTimeout(window._t);intro.classList.add('out');document.body.classList.add('ready');sessionStorage.setItem('seen','1');setTimeout(()=>intro.remove(),1200)}
if(reduce||sessionStorage.getItem('seen')){intro.remove();document.body.classList.add('ready')}
else{const p=$('#introText');let i=0;const step=()=>{if(i>=S.intro.length)return endIntro();p.textContent=S.intro[i];p.className='in';window._t=setTimeout(()=>{p.className='';i++;window._t=setTimeout(step,900)},2000)};window._t=setTimeout(step,500)}
$('#skipIntro').onclick=endIntro;

/* floating questions */
const fl=$('#floaters');let fi=0;
if(!reduce){const f=()=>{const e=h('span',{},S.floaters[fi++%S.floaters.length]);e.style.left=(8+Math.random()*60)+'%';e.style.top=(15+Math.random()*60)+'%';fl.appendChild(e);setTimeout(()=>e.remove(),6000)};setInterval(f,3200);f()}
else{fl.innerHTML=`<span style="left:12%;top:30%;opacity:.5;animation:none">${S.floaters[0]}</span>`}

/* worlds */
const tabs=$('#tabs'),panel=$('#panel');
S.worlds.forEach((w,i)=>{const b=h('button',{role:'tab','aria-selected':i==0,type:'button','data-cur':'EXPLORE'},w.name);b.onclick=()=>sel(i);tabs.appendChild(b)});
function sel(i){$$('#tabs button').forEach((b,j)=>b.setAttribute('aria-selected',i==j));const w=S.worlds[i];panel.classList.remove('show');void panel.offsetWidth;panel.innerHTML=`<h3>${w.name}</h3><p>${w.text}</p><ul>${w.q.map(x=>`<li>${x}</li>`).join('')}</ul>`;panel.classList.add('show')}
sel(0);

/* question wall */
const wl=$('#wallList');S.questions.forEach(q=>wl.appendChild(h('li',{tabindex:0},q)));
const lis=$$('#wallList li');let wi=0;
const hl=n=>lis.forEach((l,i)=>l.classList.toggle('on',i===n));
lis.forEach((l,i)=>['mouseenter','focus'].forEach(e=>l.addEventListener(e,()=>{wi=i;hl(i)})));
hl(0);if(!reduce)setInterval(()=>{if(!wl.matches(':hover,:focus-within')){wi=(wi+1)%lis.length;hl(wi)}},4500);

/* content */
$('#featured').innerHTML=S.featured.map((f,i)=>`<article class="feat f${i%4}"><h3>${f.title}</h3><p>${f.text}</p></article>`).join('');
const chips=$('#chips'),cards=$('#cards');let cat='All';
['All',...S.categories].forEach(c=>{const b=h('button',{type:'button','aria-pressed':c==='All'},c);b.onclick=()=>{cat=c;$$('#chips button').forEach(x=>x.setAttribute('aria-pressed',x===b));draw()};chips.appendChild(b)});
function draw(){const items=S.content.filter(c=>cat==='All'||c.category===cat);cards.innerHTML=items.length?items.map(c=>`<article class="card"><div class="thumb" ${c.thumb?`style="background-image:url('${c.thumb}')"`:''} role="img" aria-label="${c.thumb?c.title:'Thumbnail placeholder'}"></div><div class="cb"><p class="meta">${c.category} · ${c.platform} · ${c.date}</p><h3>${c.title}</h3><p>${c.desc}</p>${link(c.url,'Open')}</div></article>`).join(''):'<p>Nothing here yet. Add content in js/data.js.</p>'}
draw();

/* library */
$('#shelves').innerHTML=Object.entries(S.library).map(([k,v])=>`<div class="shelf"><h3>${k}</h3><ul>${v.map(n=>`<li>${S.libraryLinks[n]?link(S.libraryLinks[n],n):n}</li>`).join('')}</ul></div>`).join('');

/* journal */
const post=$('#post');
$('#posts').innerHTML=S.posts.map((p,i)=>`<article class="card"><div class="thumb" ${p.cover?`style="background-image:url('${p.cover}')"`:''} role="img" aria-label="${p.cover?p.title:'Cover placeholder'}"></div><div class="cb"><p class="meta">${p.category} · ${p.date} · ${p.minutes} min read</p><h3>${p.title}</h3><button class="btn" data-i="${i}" data-cur="READ">Read note</button></div></article>`).join('');
function open(i){const p=S.posts[i];const rel=S.posts.map((x,j)=>j!==i?`<li><button class="lnk" data-i="${j}">${x.title}</button></li>`:'').join('');$('#postBody').innerHTML=`<p class="meta">${p.category} · ${p.date} · ${p.minutes} min read</p><h2>${p.title}</h2>${p.body.map(t=>`<p>${t}</p>`).join('')}<h4>Related</h4><ul>${rel}</ul>`;if(!post.open)post.showModal();post.scrollTop=0}
document.addEventListener('click',e=>{const b=e.target.closest('[data-i]');if(b)open(+b.dataset.i)});
$('#closePost').onclick=()=>post.close();post.addEventListener('click',e=>{if(e.target===post)post.close()});

/* timeline & social */
$('#timeline').innerHTML=S.timeline.map(t=>`<li><span>${t.when}</span><div><h3>${t.title}</h3><p>${t.text}</p></div></li>`).join('');
$('#socials').innerHTML=S.social.map(s=>`<div class="soc ${s.name.toLowerCase()}">${link(s.url,s.name)}</div>`).join('');

/* forms are placeholders: nothing is sent */
$$('.line-form').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();f.querySelector('.note').textContent=f.dataset.msg}));

/* menu */
const bg=$('#burger'),menu=$('#menu');
bg.onclick=()=>{const o=menu.classList.toggle('open');bg.setAttribute('aria-expanded',o);bg.setAttribute('aria-label',o?'Close menu':'Open menu')};
menu.addEventListener('click',e=>{if(e.target.tagName==='A'){menu.classList.remove('open');bg.setAttribute('aria-expanded',false)}});

/* reveal */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vis');io.unobserve(e.target)}}),{threshold:.15});
$$('.rv').forEach(e=>io.observe(e));

/* progress + light parallax */
const pr=$('#progress'),st=$('.stage');let tk=false;
addEventListener('scroll',()=>{if(tk)return;tk=true;requestAnimationFrame(()=>{const y=scrollY,m=document.documentElement.scrollHeight-innerHeight;pr.style.transform=`scaleX(${m?y/m:0})`;if(!reduce&&y<innerHeight)st.style.transform=`translateY(${y*.15}px)`;tk=false})},{passive:true});

/* cursor (fine pointers only) */
if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!reduce){
 const c=$('#cursor'),l=c.firstElementChild;document.body.classList.add('cur');let x=0,y=0,cx=0,cy=0;
 addEventListener('mousemove',e=>{x=e.clientX;y=e.clientY});
 (function loop(){cx+=(x-cx)*.2;cy+=(y-cy)*.2;c.style.transform=`translate(${cx}px,${cy}px)`;requestAnimationFrame(loop)})();
 document.addEventListener('mouseover',e=>{const t=e.target.closest('[data-cur],a[href],button');if(t){c.classList.add('big');l.textContent=t.dataset.cur||'VIEW'}else{c.classList.remove('big');l.textContent=''}});
}
})();
