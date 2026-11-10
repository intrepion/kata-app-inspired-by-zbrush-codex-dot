import {cp,mkdir,rm} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true}); await mkdir('dist');
for(const f of ['index.html','styles.css','src','favicon.svg','app.json','LICENSE'])await cp(f,'dist/'+f,{recursive:true});console.log('Static app built in dist/');
