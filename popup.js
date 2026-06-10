
const defaults={size:45,position:0,lineHeight:1.8,bold:true,outline:true};
function load(){
chrome.storage.sync.get(defaults,s=>{
size.value=s.size;position.value=s.position;lineHeight.value=s.lineHeight;
bold.checked=s.bold;outline.checked=s.outline;
sizeVal.textContent=s.size+'px';positionVal.textContent=s.position+'px';lineHeightVal.textContent=s.lineHeight;
});}
load();
const save=(k,v)=>chrome.storage.sync.set({[k]:v});
size.oninput=()=>{sizeVal.textContent=size.value+'px';save('size',+size.value)};
position.oninput=()=>{positionVal.textContent=position.value+'px';save('position',+position.value)};
lineHeight.oninput=()=>{lineHeightVal.textContent=lineHeight.value;save('lineHeight',+lineHeight.value)};
bold.onchange=()=>save('bold',bold.checked);
outline.onchange=()=>save('outline',outline.checked);
reset.onclick=()=>{chrome.storage.sync.set(defaults,load);};
