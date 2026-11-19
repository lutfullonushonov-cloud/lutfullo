// Kategoriyalar: [kalit, nomi, ikonka]
const CATS=[["all","Barchasi","fa-border-all"],["combo","Kombolar","fa-box-open"],["promo","Aksiyalar","fa-percent"],["hotdog","Hot-dog","fa-hotdog"],["shawarma","Shovurma","fa-bowl-food"],["burger","Burger","fa-burger"],["lavash","Lavash","fa-bread-slice"],["fries","Fri kartoshka","fa-french-fries"],["drink","Ichimliklar","fa-mug-hot"],["pizza","Pitsa","fa-pizza-slice"]];
// Mahsulotlar: [id, kategoriya, nomi, tavsif, narx, rasm yo‘li]
// Rasmlarni images/ papkasiga shu nomlar bilan qo‘ying (yoki yo‘lni o‘zgartiring).
const P=[
[1,"combo","Burger kombo","Burger, fri kartoshka va ichimlik",49000,"images/combo-burger.jpg"],
[2,"combo","Oilaviy kombo","4 ta burger, katta fri va 1.5L ichimlik",169000,"images/combo-family.jpg"],
[3,"promo","1+1 Pitsa","Ikkinchi pitsa sovg‘a, 30 sm",85000,"images/promo-pizza.jpg"],
[4,"promo","Lavash + Cola","Aksiya narxida to‘plam",39000,"images/promo-lavash.jpg"],
[5,"hotdog","Klassik hot-dog","Sosiska, bulochka, ketchup va xantal",18000,"images/hotdog-classic.jpg"],
[6,"hotdog","Cheese hot-dog","Pishloqli sous bilan",22000,"images/hotdog-cheese.jpg"],
[7,"shawarma","Mol go‘shtli shovurma","Mol go‘shti, sabzavot va sous",32000,"images/shawarma-beef.jpg"],
[8,"shawarma","Tovuqli shovurma","Tovuq go‘shti, yangi sabzavot",28000,"images/shawarma-chicken.jpg"],
[9,"burger","Cheeseburger","Mol go‘shti kotleti, cheddar va sous",30000,"images/burger-cheese.jpg"],
[10,"burger","Double burger","Ikki qavat kotlet, pomidor, salat",42000,"images/burger-double.jpg"],
[11,"lavash","Klassik lavash","Tovuq, bodring, pomidor, sous",27000,"images/lavash-classic.jpg"],
[12,"lavash","Pishloqli lavash","Ko‘p pishloq va achchiq sous",30000,"images/lavash-cheese.jpg"],
[13,"fries","Fri kartoshka (kichik)","Qarsildoq, tuz bilan",12000,"images/fries-s.jpg"],
[14,"fries","Fri kartoshka (katta)","Sous tanlovi bilan",19000,"images/fries-l.jpg"],
[15,"drink","Coca-Cola 0.5L","Sovuq gazlangan ichimlik",9000,"images/drink-cola.jpg"],
[16,"drink","Limonad","Uy sharoitida tayyorlangan",14000,"images/drink-lemonade.jpg"],
[17,"pizza","Margarita","Pomidor, motsarella, rayhon",65000,"images/pizza-margherita.jpg"],
[18,"pizza","Pepperoni","Pepperoni va ko‘p motsarella",78000,"images/pizza-pepperoni.jpg"]
].map(a=>({id:a[0],cat:a[1],name:a[2],desc:a[3],price:a[4],img:a[5]}));

const $=s=>document.querySelector(s);
const fmt=n=>n.toLocaleString("ru-RU").replace(/,/g," ")+" so‘m";
let cart={}; try{cart=JSON.parse(localStorage.getItem("fb_cart")||"{}")}catch(e){}
const save=()=>{try{localStorage.setItem("fb_cart",JSON.stringify(cart))}catch(e){}};
const catIcon=k=>(CATS.find(c=>c[0]===k)||[])[2]||"fa-utensils";
const catName=k=>(CATS.find(c=>c[0]===k)||[])[1]||"";

function renderFilters(){
  $("#filters").innerHTML=CATS.map((c,i)=>`<button class="filter-btn ${i?"":"active"}" data-cat="${c[0]}"><i class="fa-solid ${c[2]} me-1"></i>${c[1]}</button>`).join("");
  $("#filters").onclick=e=>{
    const b=e.target.closest(".filter-btn"); if(!b)return;
    document.querySelectorAll(".filter-btn").forEach(x=>x.classList.remove("active"));
    b.classList.add("active"); renderProducts(b.dataset.cat);
  };
}
function renderProducts(cat="all"){
  const list=P.filter(p=>cat==="all"||p.cat===cat);
  $("#products").innerHTML=list.map(p=>`
  <div class="col-6 col-md-4 col-lg-3">
    <div class="p-card">
      <div class="p-img">
        <span class="p-tag">${catName(p.cat)}</span>
        <i class="fa-solid ${catIcon(p.cat)} ph"></i>
        <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.remove()">
      </div>
      <div class="p-body">
        <h3>${p.name}</h3><p>${p.desc}</p>
        <div class="d-flex justify-content-between align-items-center gap-2 flex-wrap">
          <span class="price">${p.price.toLocaleString("ru-RU")} <small>so‘m</small></span>
          <button class="add-btn" onclick="addToCart(${p.id})"><i class="fa-solid fa-cart-plus me-1"></i>Savatchaga qo‘shish</button>
        </div>
      </div>
    </div>
  </div>`).join("");
}
function addToCart(id){
  cart[id]=(cart[id]||0)+1; save(); renderCart();
  toast(P.find(p=>p.id===id).name+" savatchaga qo‘shildi");
}
function changeQty(id,d){
  cart[id]=(cart[id]||0)+d; if(cart[id]<=0)delete cart[id]; save(); renderCart();
}
function removeItem(id){delete cart[id]; save(); renderCart();}
function clearCart(){cart={}; save(); renderCart();}
function renderCart(){
  const ids=Object.keys(cart).map(Number).filter(id=>P.some(p=>p.id===id));
  let total=0,count=0;
  $("#cartItems").innerHTML=ids.length?ids.map(id=>{
    const p=P.find(x=>x.id===id),q=cart[id]; total+=p.price*q; count+=q;
    return `<div class="cart-item">
      <div class="thumb"><i class="fa-solid ${catIcon(p.cat)}"></i><img src="${p.img}" alt="" style="position:absolute;display:none" onload="this.style.display='block';this.style.position='static';this.previousElementSibling.remove()" onerror="this.remove()"></div>
      <div class="flex-grow-1"><div class="fw-bold">${p.name}</div><div class="text-secondary small">${fmt(p.price)}</div>
        <div class="qty mt-1"><button onclick="changeQty(${id},-1)" aria-label="Kamaytirish"><i class="fa-solid fa-minus"></i></button><b>${q}</b><button onclick="changeQty(${id},1)" aria-label="Ko‘paytirish"><i class="fa-solid fa-plus"></i></button></div></div>
      <div class="text-end"><div class="price fs-6">${fmt(p.price*q)}</div><button class="btn btn-sm text-danger" onclick="removeItem(${id})" aria-label="O‘chirish"><i class="fa-solid fa-trash"></i></button></div>
    </div>`}).join(""):`<div class="text-center text-secondary py-5"><i class="fa-solid fa-cart-shopping fs-1 mb-3 d-block"></i>Savatchangiz bo‘sh. Menudan taom tanlang.</div>`;
  $("#cartCount").textContent=count; $("#cartTotal").textContent=fmt(total);
}
function checkout(){
  if(!Object.keys(cart).length){toast("Avval savatchaga mahsulot qo‘shing");return;}
  const total=Object.keys(cart).reduce((s,id)=>s+P.find(p=>p.id==id).price*cart[id],0);
  clearCart(); toast("Buyurtma qabul qilindi! Jami: "+fmt(total));
}
let tt; function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("show");clearTimeout(tt);tt=setTimeout(()=>t.classList.remove("show"),2200);}

// Navbar: aktiv havola
const links=document.querySelectorAll(".navbar .nav-link");
const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(l=>l.classList.toggle("active",l.getAttribute("href")==="#"+e.target.id))}),{rootMargin:"-45% 0px -50% 0px"});
["home","menu","news","contact"].forEach(id=>obs.observe(document.getElementById(id)));
links.forEach(l=>l.addEventListener("click",()=>{const n=document.getElementById("nav");if(n.classList.contains("show"))bootstrap.Collapse.getInstance(n)?.hide()}));

renderFilters(); renderProducts(); renderCart();
