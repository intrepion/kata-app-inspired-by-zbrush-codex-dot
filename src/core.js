export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const add=(a,b)=>a.map((v,i)=>v+b[i]);
export const sub=(a,b)=>a.map((v,i)=>v-b[i]);
export const mul=(a,k)=>a.map(v=>v*k);
export const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
export const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
export const norm=a=>mul(a,1/(Math.hypot(...a)||1));
export function rotate(v,r){let [x,y,z]=v;let [a,b,c]=r;[y,z]=[y*Math.cos(a)-z*Math.sin(a),y*Math.sin(a)+z*Math.cos(a)];[x,z]=[x*Math.cos(b)+z*Math.sin(b),-x*Math.sin(b)+z*Math.cos(b)];return [x*Math.cos(c)-y*Math.sin(c),x*Math.sin(c)+y*Math.cos(c),z];}
export const transform=(v,o)=>add(rotate(v.map((x,i)=>x*o.scale[i]),o.rotation.map(x=>x*Math.PI/180)),o.position);
export function primitive(type,segments=24,rings=16){
 let vertices=[],faces=[];
 if(type==='cube'){vertices=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];faces=[[0,2,1],[0,3,2],[4,5,6],[4,6,7],[0,1,5],[0,5,4],[3,7,6],[3,6,2],[1,2,6],[1,6,5],[0,4,7],[0,7,3]];}
 else if(type==='sphere'){
  vertices.push([0,1,0]);
  for(let j=1;j<rings;j++)for(let i=0;i<segments;i++){let a=i/segments*Math.PI*2,b=j/rings*Math.PI;vertices.push([Math.sin(b)*Math.cos(a),Math.cos(b),Math.sin(b)*Math.sin(a)]);}
  const last=vertices.length;vertices.push([0,-1,0]);
  for(let i=0;i<segments;i++){let n=(i+1)%segments;faces.push([0,1+n,1+i]);for(let j=0;j<rings-2;j++){let a=1+j*segments+i,b=1+j*segments+n,c=a+segments,d=b+segments;faces.push([a,b,d],[a,d,c]);}let a=1+(rings-2)*segments;faces.push([a+i,a+n,last]);}
 }
 else if(type==='cylinder'||type==='cone'){
  for(let y of [-1,1])for(let i=0;i<segments;i++){let a=i/segments*Math.PI*2,r=type==='cone'&&y===1?0:1;vertices.push([Math.cos(a)*r,y,Math.sin(a)*r]);}
  vertices.push([0,-1,0],[0,1,0]);for(let i=0;i<segments;i++){let n=(i+1)%segments;faces.push([i,n,n+segments],[i,n+segments,i+segments],[segments*2,n,i],[segments*2+1,i+segments,n+segments]);}
 }
 else if(type==='torus'){
  let sides=12;for(let j=0;j<segments;j++)for(let i=0;i<sides;i++){let a=j/segments*2*Math.PI,b=i/sides*2*Math.PI;vertices.push([(1+.32*Math.cos(b))*Math.cos(a),.32*Math.sin(b),(1+.32*Math.cos(b))*Math.sin(a)]);}
  for(let j=0;j<segments;j++)for(let i=0;i<sides;i++){let a=j*sides+i,b=((j+1)%segments)*sides+i,c=j*sides+(i+1)%sides,d=((j+1)%segments)*sides+(i+1)%sides;faces.push([a,c,d],[a,d,b]);}
 } else throw Error('Unknown primitive');
 if(type==='cylinder'||type==='cone')faces=faces.map(f=>f.reverse());
 return {vertices,faces};
}
export function normals(mesh){let n=mesh.vertices.map(()=>[0,0,0]);for(let [a,b,c] of mesh.faces){let f=cross(sub(mesh.vertices[b],mesh.vertices[a]),sub(mesh.vertices[c],mesh.vertices[a]));for(let i of [a,b,c])n[i]=add(n[i],f);}return n.map(norm);}
export function exportOBJ(objects){let lines=['# Original mesh from Kata Tool Shed'],offset=1;for(let o of objects){lines.push('o '+o.name.replace(/[^a-zA-Z0-9_-]/g,'_'));for(let v of o.mesh.vertices)lines.push('v '+transform(v,o).map(x=>x.toFixed(6)).join(' '));for(let f of o.mesh.faces)lines.push('f '+f.map(i=>i+offset).join(' '));offset+=o.mesh.vertices.length;}return lines.join('\n')+'\n';}
export class History{constructor(limit=30){this.limit=limit;this.past=[];this.future=[];}push(v){this.past.push(JSON.stringify(v));if(this.past.length>this.limit)this.past.shift();this.future=[];}undo(v){if(!this.past.length)return null;this.future.push(JSON.stringify(v));return JSON.parse(this.past.pop());}redo(v){if(!this.future.length)return null;this.past.push(JSON.stringify(v));return JSON.parse(this.future.pop());}}
export function barycentric(p,a,b,c){let d=(b[1]-c[1])*(a[0]-c[0])+(c[0]-b[0])*(a[1]-c[1]);if(Math.abs(d)<1e-8)return null;let u=((b[1]-c[1])*(p[0]-c[0])+(c[0]-b[0])*(p[1]-c[1]))/d,v=((c[1]-a[1])*(p[0]-c[0])+(a[0]-c[0])*(p[1]-c[1]))/d;return u>=0&&v>=0&&u+v<=1?[u,v,1-u-v]:null;}
export class Viewport{
 constructor(canvas,options={}){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.camera={yaw:.65,pitch:.35,zoom:1,pan:[0,0]};this.options=options;this.hits=[];this.width=800;this.height=600;this.scale=80;this.observer=new ResizeObserver(()=>{this.resize();this.onResize?.();});this.observer.observe(canvas);}
 resize(){const r=this.canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);this.width=r.width;this.height=r.height;this.canvas.width=Math.round(r.width*d);this.canvas.height=Math.round(r.height*d);this.ctx.setTransform(d,0,0,d,0,0);this.scale=Math.min(r.width,r.height)*.15*this.camera.zoom;}
 cameraPoint(v){return rotate(v,[0,this.camera.yaw,0]).map((x,i,a)=>i===0?x:i===1?a[1]*Math.cos(this.camera.pitch)-a[2]*Math.sin(this.camera.pitch):a[1]*Math.sin(this.camera.pitch)+a[2]*Math.cos(this.camera.pitch));}
 project(v){const p=this.cameraPoint(v);return [this.width/2+this.camera.pan[0]+p[0]*this.scale,this.height/2+this.camera.pan[1]-p[1]*this.scale,p[2]];}
 render(objects,selected=null,wire=false){this.scale=Math.min(this.width,this.height)*.15*this.camera.zoom;const c=this.ctx,w=this.width,h=this.height;c.clearRect(0,0,w,h);let bg=c.createRadialGradient(w*.52,h*.4,0,w*.5,h*.5,w*.8);bg.addColorStop(0,this.options.light||'#364a47');bg.addColorStop(1,this.options.dark||'#182b2a');c.fillStyle=bg;c.fillRect(0,0,w,h);
 if(this.options.grid!==false){c.lineWidth=1;for(let i=-8;i<=8;i++){for(let [a,b] of [[[i,-1.6,-8],[i,-1.6,8]],[[-8,-1.6,i],[8,-1.6,i]]]){let p=this.project(a),q=this.project(b);c.strokeStyle=i===0?'#789a8c66':'#82988f22';c.beginPath();c.moveTo(p[0],p[1]);c.lineTo(q[0],q[1]);c.stroke();}}}
 const tris=[];for(let o of objects){if(o.hidden)continue;let world=o.mesh.vertices.map(v=>transform(v,o)),p=world.map(v=>this.project(v));for(let f of o.mesh.faces){let xyz=f.map(i=>world[i]),q=f.map(i=>p[i]);let normal=norm(cross(sub(xyz[1],xyz[0]),sub(xyz[2],xyz[0])));let light=.43+Math.max(0,dot(normal,norm([-1,2,3])))*.57;const color=o.color.match(/\w\w/g).map(s=>parseInt(s,16));tris.push({p:q,xyz,face:f,object:o,depth:q.reduce((s,v)=>s+v[2],0)/3,color:`rgb(${color.map(v=>Math.round(v*light)).join(',')})`});}}
 tris.sort((a,b)=>a.depth-b.depth);this.hits=tris;for(let t of tris){c.beginPath();c.moveTo(t.p[0][0],t.p[0][1]);c.lineTo(t.p[1][0],t.p[1][1]);c.lineTo(t.p[2][0],t.p[2][1]);c.closePath();c.fillStyle=t.color;c.fill();c.strokeStyle=wire?'#e8eee269':t.color;c.lineWidth=wire?.55:.65;c.stroke();}
 if(selected){let o=objects.find(x=>x.id===selected&&!x.hidden);if(o){let p=this.project(o.position);c.strokeStyle='#f6be75';c.lineWidth=1.5;c.beginPath();c.arc(p[0],p[1],6,0,Math.PI*2);c.stroke();c.fillStyle='#f6be75';c.beginPath();c.arc(p[0],p[1],2,0,Math.PI*2);c.fill();}}
 let origin=[w-49,h-45];for(let [v,color,label] of [[[.4,0,0],'#e3a28c','X'],[[0,.4,0],'#9bc9ac','Y'],[[0,0,.4],'#8fb7de','Z']]){let p=this.cameraPoint(v);c.strokeStyle=color;c.lineWidth=2;c.beginPath();c.moveTo(...origin);c.lineTo(origin[0]+p[0]*55,origin[1]-p[1]*55);c.stroke();c.fillStyle=color;c.font='10px sans-serif';c.fillText(label,origin[0]+p[0]*65-3,origin[1]-p[1]*65+3);}
 }
 hit(x,y){for(let i=this.hits.length-1;i>=0;i--){const t=this.hits[i],b=barycentric([x,y],...t.p);if(b)return {object:t.object,point:[0,1,2].map(j=>b.reduce((s,v,k)=>s+v*t.xyz[k][j],0)),face:t.face};}return null;}
}
export function download(name,text,type='application/json'){const url=URL.createObjectURL(new Blob([text],{type})),a=document.createElement('a');a.href=url;a.download=name;a.hidden=true;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
