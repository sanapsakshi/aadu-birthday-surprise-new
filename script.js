const $ = (sel, parent=document) => parent.querySelector(sel);
const $$ = (sel, parent=document) => [...parent.querySelectorAll(sel)];

const intro = $('#intro');
const enterBtn = $('#enterBtn');
const startBtn = $('#startBtn');
const progressBar = $('#progressBar');
const musicBtn = $('#musicBtn');
const secretCard = $('#secretCard');
const letter = $('#finalLetter');
const letterLock = $('#letterLock');
const wishText = $('#wishText');
const celebrateBtn = $('#celebrateBtn');
const finale = $('#finale');
const closeFinale = $('#closeFinale');

enterBtn.addEventListener('click', () => {
  intro.classList.add('hidden');
  document.body.classList.remove('locked');
  burstHearts(18);
  setTimeout(() => intro.remove(), 850);
});

startBtn.addEventListener('click', () => {
  $('#journey').scrollIntoView({behavior:'smooth'});
  burstHearts(10);
});

window.addEventListener('scroll', () => {
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const pct = height > 0 ? (window.scrollY / height) * 100 : 0;
  progressBar.style.width = pct + '%';
}, {passive:true});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting) entry.target.classList.add('visible');
  });
},{threshold:.12});
$$('.reveal').forEach(el => observer.observe(el));

function heart(){
  const holder = $('.hearts');
  if(!holder) return;
  const el=document.createElement('span');
  el.textContent=Math.random()>.42?'♥':'♡';
  el.style.left=Math.random()*100+'vw';
  el.style.fontSize=(12+Math.random()*20)+'px';
  el.style.animationDuration=(5+Math.random()*5)+'s';
  holder.appendChild(el);
  setTimeout(()=>el.remove(),10000);
}
setInterval(heart,850);

function burstHearts(count=12){
  for(let i=0;i<count;i++) setTimeout(heart, i*45);
}

secretCard.addEventListener('click', () => {
  secretCard.classList.toggle('open');
  if(secretCard.classList.contains('open')) burstHearts(10);
});
secretCard.addEventListener('keydown', e => {
  if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); secretCard.click(); }
});

const lightbox = $('#lightbox');
const lightboxImg = $('#lightboxImg');
const lightboxClose = $('#lightboxClose');
$$('.photo-btn').forEach(btn => btn.addEventListener('click', () => {
  lightboxImg.src = btn.dataset.src;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden','false');
  document.body.classList.add('locked');
}));
function closeLightbox(){
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden','true');
  document.body.classList.remove('locked');
}
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if(e.target === lightbox) closeLightbox(); });
window.addEventListener('keydown', e => { if(e.key==='Escape'){ closeLightbox(); closeFinaleView(); } });

let blown = 0;
$$('.candle').forEach(candle => candle.addEventListener('click', () => {
  if(candle.classList.contains('out')) return;
  candle.classList.add('out');
  blown += 1;
  if(blown === 1) wishText.textContent = 'One down… keep wishing ✨';
  if(blown === 2) wishText.textContent = 'Almost there… ❤️';
  if(blown === 3){
    wishText.textContent = 'Wish made. Final message unlocked! 🎉';
    letter.classList.add('unlocked');
    burstConfetti(95);
    burstHearts(24);
    setTimeout(() => letter.scrollIntoView({behavior:'smooth', block:'center'}), 650);
  }
}));

const confettiPalette = ['#ffd0dc','#f49ab3','#8f294e','#fff1b8','#ffffff','#d66b8a'];
function burstConfetti(count=80){
  for(let i=0;i<count;i++){
    const c=document.createElement('i');
    c.className='confetti';
    c.style.left=Math.random()*100+'vw';
    c.style.background=confettiPalette[Math.floor(Math.random()*confettiPalette.length)];
    c.style.animationDelay=(Math.random()*.8)+'s';
    c.style.animationDuration=(2.5+Math.random()*2)+'s';
    c.style.transform=`rotate(${Math.random()*180}deg)`;
    document.body.appendChild(c);
    setTimeout(()=>c.remove(),5000);
  }
}

celebrateBtn.addEventListener('click', () => {
  finale.classList.add('open');
  finale.setAttribute('aria-hidden','false');
  document.body.classList.add('locked');
  burstConfetti(130);
  burstHearts(25);
});
function closeFinaleView(){
  finale.classList.remove('open');
  finale.setAttribute('aria-hidden','true');
  document.body.classList.remove('locked');
}
closeFinale.addEventListener('click', closeFinaleView);

// A tiny original Web Audio melody: no external music file required.
let audioCtx, melodyTimer, playing=false, noteIndex=0;
const notes=[261.63,329.63,392.00,523.25,493.88,392.00,329.63,293.66];
function playTone(freq){
  if(!audioCtx) return;
  const osc=audioCtx.createOscillator();
  const gain=audioCtx.createGain();
  osc.type='sine'; osc.frequency.value=freq;
  gain.gain.setValueAtTime(.0001,audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(.055,audioCtx.currentTime+.03);
  gain.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+.65);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start(); osc.stop(audioCtx.currentTime+.7);
}
function startMelody(){
  audioCtx ||= new (window.AudioContext||window.webkitAudioContext)();
  audioCtx.resume(); playing=true; musicBtn.classList.add('playing'); musicBtn.textContent='Ⅱ';
  playTone(notes[noteIndex++%notes.length]);
  melodyTimer=setInterval(()=>playTone(notes[noteIndex++%notes.length]),700);
}
function stopMelody(){
  playing=false; musicBtn.classList.remove('playing'); musicBtn.textContent='♫';
  clearInterval(melodyTimer);
}
musicBtn.addEventListener('click',()=> playing?stopMelody():startMelody());
