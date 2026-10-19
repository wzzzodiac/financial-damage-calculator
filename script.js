'use strict';
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),animations=new Set();
function animate(el,frames,options){if(reduced.matches||document.hidden||!el?.animate)return null;const a=el.animate(frames,options);animations.add(a);a.finished.then(()=>animations.delete(a)).catch(()=>animations.delete(a));return a}
function settle(){animations.forEach(a=>a.cancel());animations.clear()}
reduced.addEventListener('change',()=>{if(reduced.matches)settle()});document.addEventListener('visibilitychange',()=>{if(document.hidden)settle()});window.addEventListener('resize',settle);

if(document.body.classList.contains('finance-page')){
 const form=document.querySelector('#damage-form'),status=document.querySelector('#finance-status'),paper=document.querySelector('#receipt-paper');let copy='',paperAnimation=null;const levels=['Responsible citizen','Questionable','Financially suspicious','Severe damage','Economic disaster'];
 const euro=n=>new Intl.NumberFormat('en-IE',{style:'currency',currency:'EUR'}).format(n),put=(c,v)=>document.querySelectorAll(c).forEach(x=>x.textContent=v);
 function calculate(motion=false){const data=new FormData(form),get=name=>Number(data.get(name));const price=get('price'),wage=get('hourly'),hours=get('hours'),fixed=get('fixed'),debt=get('debt'),doner=get('doner');
  if(![price,wage,hours,fixed,debt,doner].every(Number.isFinite)||price<=0||wage<=0||hours<=0||doner<=0||fixed<0||debt<0){status.textContent='Check the numbers and try again.';return}
  const income=wage*hours,disposable=income-fixed,work=price/wage,percent=disposable>0?price/disposable*100:Infinity;
  const score=Math.round(Math.min(100,Math.max(0,price/income*25+(disposable>0?price/disposable:2)*45+(debt>0?price/debt:0)*15+(price>disposable?15:0))));
  const level=levels[score<=20?0:score<=40?1:score<=60?2:score<=80?3:4];document.querySelector('#damage-level').textContent=level;put('.result-price',euro(price));put('.work-hours',work.toFixed(1));put('.doner-value',(price/doner).toFixed(1));put('.disposable-value',Number.isFinite(percent)?percent.toFixed(1)+'%':'No surplus');document.querySelector('#context-summary').textContent=`${hours} h · ${euro(fixed).replace('.00','')} fixed costs`;
  const rows=[['Net income / month',euro(income)],['Disposable / month',euro(disposable)],['Of monthly income',(price/income*100).toFixed(1)+'%'],['Days of disposable income',disposable>0?(price/(disposable/30)).toFixed(1):'—'],['Debt if paid instead',debt===0?'No debt':`${euro(debt)} → ${euro(Math.max(0,debt-price))}`],['Damage score',score+' / 100']];
  document.querySelector('#breakdown-content').replaceChildren(...rows.map(([name,value])=>{const p=document.createElement('p'),label=document.createElement('span'),number=document.createElement('strong');p.className='breakdown-row';label.textContent=name;number.textContent=value;p.append(label,number);return p}));
  copy=`Financial Damage\n${euro(price)} = ${work.toFixed(1)} work hours\n${(price/doner).toFixed(1)} Döner\n${Number.isFinite(percent)?percent.toFixed(1)+'% of disposable income':'No disposable surplus'}\nDamage score ${score}/100 — ${level} (entertainment).\nNot financial advice.`;
  if(motion){const from=getComputedStyle(paper).transform;paperAnimation?.cancel();status.textContent='Updated.';paperAnimation=animate(paper,[{transform:from==='none'?'translateY(-10px)':from,opacity:.7},{transform:'translateY(0)',opacity:1}],{duration:350,easing:'ease-out'})}
 }
 form.addEventListener('invalid',e=>{const details=e.target.closest('details');if(details)details.open=true},true);
 form.addEventListener('submit',e=>{e.preventDefault();calculate(true)});
 document.querySelector('#copy-receipt').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(copy);status.textContent='Copied.'}catch{status.textContent='Clipboard unavailable. Select the receipt to copy it.'}});
 document.querySelector('#share-result').addEventListener('click',async()=>{try{if(navigator.share){await navigator.share({title:'Financial Damage',text:copy,url:location.href})}else{await navigator.clipboard.writeText(copy+'\n'+location.href);status.textContent='Copied.'}}catch(error){if(error.name!=='AbortError'){try{await navigator.clipboard.writeText(copy+'\n'+location.href);status.textContent='Copied.'}catch{status.textContent='Could not share. Use Copy receipt instead.'}}}});
 document.querySelector('#reset-result').addEventListener('click',()=>{form.reset();calculate();status.textContent='Reset.';document.querySelector('#price').focus()});
 calculate();
}
