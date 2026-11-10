import {primitive,normals,sub,add,mul,clamp} from './core.js';
export const SEGMENTS=56,RINGS=36;
export function baseMesh(type='seed'){
 const mesh=primitive('sphere',SEGMENTS,RINGS);
 if(type==='seed')mesh.vertices=mesh.vertices.map(([x,y,z])=>{let waist=.72+.2*Math.cos(y*2.7)+.11*y;return [x*waist,y*1.35,z*waist*(1+.1*Math.sin(x*5+y*4))];});
 if(type==='pebble')mesh.vertices=mesh.vertices.map(([x,y,z])=>[x*1.25,y*.78,z*(1+.08*Math.sin(x*5+y*4))]);
 return mesh;
}
export function starter(type='seed'){return {format:'kata-claywell',version:1,name:type==='seed'?'The seed study':type==='pebble'?'River pebble':'Untitled sphere',color:'#c58b70',vertices:baseMesh(type).vertices};}
export const meshFor=doc=>({vertices:doc.vertices,faces:baseMesh('sphere').faces});
export function adjacency(mesh){const all=mesh.vertices.map(()=>new Set());for(let f of mesh.faces)for(let i of f)for(let j of f)if(i!==j)all[i].add(j);return all.map(s=>[...s]);}
export function sculpt(mesh,point,brush,radius,strength,mirror,neighbors){
 const before=mesh.vertices.map(v=>[...v]),n=normals(mesh);let centers=[point];if(mirror&&Math.abs(point[0])>radius*.01)centers.push([-point[0],point[1],point[2]]);let count=0;
 for(let i=0;i<before.length;i++){const v=before[i];let dist=Math.min(...centers.map(p=>Math.hypot(...sub(v,p))));if(dist>=radius)continue;const falloff=(1-(dist/radius)**2)**2;let out;
  if(brush==='smooth'){let avg=mul(neighbors[i].reduce((s,j)=>add(s,before[j]),[0,0,0]),1/neighbors[i].length);out=add(v,mul(sub(avg,v),strength*.6*falloff));}
  else {const amount=(brush==='carve'?-1:1)*strength*.055*falloff;out=add(v,mul(n[i],amount));}
  mesh.vertices[i]=out.map(x=>clamp(x,-4,4));count++;
 }return count;
}
export function validate(input){let count=2+(RINGS-1)*SEGMENTS;if(!input||input.format!=='kata-claywell'||input.version!==1||!Array.isArray(input.vertices)||input.vertices.length!==count||!/^#[0-9a-f]{6}$/i.test(input.color))throw Error('This is not a valid Claywell mesh project.');if(input.vertices.some(v=>!Array.isArray(v)||v.length!==3||v.some(x=>typeof x!=='number'||!Number.isFinite(x)||Math.abs(x)>4)))throw Error('Mesh coordinates are outside the supported range.');return {format:'kata-claywell',version:1,name:typeof input.name==='string'?input.name.slice(0,80):'Untitled sculpt',color:input.color,vertices:input.vertices.map(v=>[...v])};}
