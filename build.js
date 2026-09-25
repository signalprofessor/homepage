const fs=require("fs"),path=require("path"),root=__dirname;
function esc(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;")}
function inline(source){
  let s=esc(source), stash=[];
  s=s.replace(/`([^`]+)`/g,(_,v)=>{stash.push(`<code>${v}</code>`);return `\u0000${stash.length-1}\u0000`});
  s=s.replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2">$1</a>');
  s=s.replace(/\*\*\*(.+?)\*\*\*/g,"<strong><em>$1</em></strong>");
  s=s.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>");
  s=s.replace(/\*([^*]+)\*/g,"<em>$1</em>");
  return s.replace(/\u0000(\d+)\u0000/g,(_,i)=>stash[+i]);
}
function markdown(name){
  const lines=fs.readFileSync(path.join(root,"content",name+".md"),"utf8").trim().split(/\r?\n/), out=[];
  let paragraph=[];
  const flush=()=>{if(paragraph.length){out.push(`<p>${inline(paragraph.join(" "))}</p>`);paragraph=[]}};
  for(const line of lines){
    if(!line.trim()){flush();continue}
    if(/^TODO(?::| before deployment:)/.test(line)){flush();out.push(`<!-- ${esc(line)} -->`);continue}
    let m=line.match(/^(#{1,3})\s+(.+)$/);
    if(m){flush();const level=m[1].length+1;out.push(`<h${level}>${inline(m[2])}</h${level}>`);continue}
    m=line.match(/^>\s*(.+)$/);
    if(m){flush();out.push(`<blockquote>${inline(m[1])}</blockquote>`);continue}
    paragraph.push(line.trim());
  }
  flush(); return out.join("\n");
}
function hero(){
  const lines=fs.readFileSync(path.join(root,"content/hero.md"),"utf8").trim().split(/\r?\n/),title=inline(lines.shift().replace(/^#\s+/,""));
  return {title,paragraphs:lines.join("\n").split(/\n\s*\n/).filter(Boolean).map(inline)};
}
const h=hero();
let html=fs.readFileSync(path.join(root,"src/template.html"),"utf8")
  .replaceAll("{{hero.title}}",h.title)
  .replaceAll("{{hero.copy}}",h.paragraphs.map(p=>`<p>${p}</p>`).join("\n"));
for(const name of ["academic","equations-escape","into-the-wild","out-of-office","why-signalprofessor","s4","next"]){html=html.replaceAll(`{{${name}.html}}`,markdown(name))}
if(/\{\{[^}]+\}\}/.test(html))throw new Error("Unresolved content placeholder in template");
fs.mkdirSync(path.join(root,"dist"),{recursive:true});fs.writeFileSync(path.join(root,"dist/index.html"),html);
for(const f of ["signalprofessor_acacia.png","ecg-confidence.png"])fs.copyFileSync(path.join(root,"assets",f),path.join(root,"dist",f));
console.log("Built dist/index.html");
