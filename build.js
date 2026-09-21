const fs=require("fs"),path=require("path"),root=__dirname;
function inline(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*([^*]+)\*/g,"<em>$1</em>")}
function block(name){const lines=fs.readFileSync(path.join(root,"content",name+".md"),"utf8").trim().split(/\r?\n/);const title=lines.shift().replace(/^#\s+/,"");return{title:inline(title),paragraphs:lines.join("\n").split(/\n\s*\n/).filter(Boolean).map(inline)}}
const blocks=Object.fromEntries(["hero","approach","field","heart","next"].map(n=>[n,block(n)]));
let html=fs.readFileSync(path.join(root,"src","template.html"),"utf8");
for(const [name,b] of Object.entries(blocks)){html=html.replaceAll("{{"+name+".title}}",b.title);b.paragraphs.forEach((p,i)=>html=html.replaceAll("{{"+name+".p"+(i+1)+"}}",p))}
fs.mkdirSync(path.join(root,"dist"),{recursive:true});fs.writeFileSync(path.join(root,"dist","index.html"),html);for(const f of ["signalprofessor_acacia.png","ecg-confidence.png"])fs.copyFileSync(path.join(root,"assets",f),path.join(root,"dist",f));console.log("Built dist/index.html");
