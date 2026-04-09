function showPassword() 
{
    var passwordIpt = document.getElementById('password');  
    var btn = document.querySelector('.sh'); 
    if (passwordIpt.type == 'password') 
    {
        btn.src = 'assets/icons/visibility_off.png';
        passwordIpt.type = 'text';
    } 
    else 
    {
        btn.src = 'assets/icons/visibility_on.png';
        passwordIpt.type = 'password';
    }
}  
function showPasswordFr() 
{
    var passwordIpt = document.getElementById('password');  
    var btn = document.getElementById('sh-fr');  
    if (passwordIpt.type == 'password') 
    {
        btn.src = 'assets/icons/visibility_off.png';
        passwordIpt.type = 'text';
    } 
    else 
    {
        btn.src = 'assets/icons/visibility_on.png';
        passwordIpt.type = 'password';
    }
}  
function showPasswordSc() 
{
    var passwordIpt = document.getElementById('password-sc');  
    var btn = document.getElementById('sh-sc'); 
    if (passwordIpt.type == 'password') 
    {
        btn.src = 'assets/icons/visibility_off.png';
        passwordIpt.type = 'text';
    } 
    else 
    {
        btn.src = 'assets/icons/visibility_on.png';
        passwordIpt.type = 'password';
    }
}  
function updateNom() 
{
    var sp = document.getElementById('et-ph');
    var fl = document.getElementById('file'); 
    if(fl.files.length > 0) 
    {
        sp.textContent = fl.files[0].name;
  
        if (sp.textContent.length > 40)  
        {
            sp.style.fontSize = "1vmin";  
        }
        else 
            sp.style.fontSize = "1.5vmin"; 
    } 
    else 
    {
        sp.textContent = "Pas de photo";  
        sp.style.fontSize = "2.5vmin"; 
    }
} 
function navigateToLogin() 
{
    window.location.href="/connexion"; 
}
function changeImage() 
{
    var btn = document.getElementById('arr');  
    if (btn.src == "http://localhost:4200/assets/icons/upward.png") 
    {
        btn.src = 'assets/icons/downward.png'; 
        
    } 
    else 
    {
        btn.src = 'assets/icons/upward.png';
    }
}
function changeMenu() 
{
    var nav = document.getElementById('nav'); 
    var ic =  document.getElementById('ic-menu');
    if (ic.src == "http://localhost:4200/assets/icons/menu.png") 
    {
        ic.src = 'assets/icons/close-menu.png'; 
        nav.style="display : block"; 
    } 
    else 
    {
        ic.src = 'assets/icons/menu.png';
        nav.style="display : none";
    }
}
function tga() 
{
    var pp = document.getElementById('pp'); 
    pp.style.display = "block";  
    setTimeout(function() {
        pp.style.opacity = '1';
      }, 10);  
}
function tgg() 
{
    var dt = document.getElementById('details'); 
    dt.style.display = 'block';
    var pp = document.getElementById('pp'); 
    pp.style.display = "block";  
    setTimeout(function() {
        pp.style.opacity = '1';
      }, 10);  
}
function tgAj() 
{
    var dt = document.getElementById('addsIns'); 
    dt.style.display = 'block';
    var pp = document.getElementById('pp'); 
    pp.style.display = "block";  
    setTimeout(function() {
        pp.style.opacity = '1';
      }, 10);  
}
function closeWindow() 
{
    var pp = document.getElementById('pp'); 
    pp.style.display = "none";
    pp.style.opacity = "0";    
}
function closeWindoww() 
{
    var mp = document.getElementById('map'); 
    mp.style.display = 'none'; 
    var dt = document.getElementById('details'); 
    dt.style.display = 'none';
    var adds = document.getElementById('adds'); 
    adds.style.display = 'none';
    var up = document.getElementById('update'); 
    up.style.display = 'none';
    var addsIns = document.getElementById('addsIns'); 
    addsIns.style.display = 'none';
    var add = document.getElementById('add'); 
    add.style.display = 'none';
    var cin = document.getElementById('cin'); 
    cin.style.display = 'none';
    var pp = document.getElementById('pp'); 
    pp.style.display = "none";
    pp.style.opacity = "0";
}
function closeWdd() 
{
    var dt = document.getElementById('details'); 
    dt.style.display = 'none';
    var dtAb = document.getElementById('dtAbnm'); 
    dtAb.style.display = 'none';
    var dtPriv = document.getElementById('dtPriv'); 
    dtPriv.style.display = 'none';
    var ajPriv = document.getElementById('ajPriv'); 
    ajPriv.style.display = 'none';
    var ajLiv = document.getElementById('ajLiv'); 
    ajLiv.style.display = 'none';
    var stAj = document.getElementById('stAj'); 
    stAj.style.display = 'none';
    var sttAj = document.getElementById('sttAj'); 
    sttAj.style.display = 'none';
    var upLiv = document.getElementById('upLiv'); 
    upLiv.style.display = 'none';
    var stUp = document.getElementById('stUp'); 
    stUp.style.display = 'none';
    var prAdr = document.getElementById('prAdr'); 
    prAdr.style.display = 'none';
    var cin = document.getElementById('cin'); 
    cin.style.display = 'none';
    var pp = document.getElementById('pp'); 
    pp.style.display = "none";
    pp.style.opacity = "0";
}
function closeW() 
{
    var dt = document.getElementById('details'); 
    dt.style.display = 'none';
    var ajClt = document.getElementById('ajClt'); 
    ajClt.style.display = 'none';
    var stAj = document.getElementById('stAj'); 
    stAj.style.display = 'none';
    var sttAj = document.getElementById('sttAj'); 
    sttAj.style.display = 'none';
    var upCl = document.getElementById('upCl'); 
    upCl.style.display = 'none';
    var stUp = document.getElementById('stUp'); 
    stUp.style.display = 'none';
    var ajPv = document.getElementById('ajPriv'); 
    ajPv.style.display = 'none';
    var dtPv = document.getElementById('dtPriv'); 
    dtPv.style.display = 'none';
    var stPrv = document.getElementById('stPrv'); 
    stPrv.style.display = 'none';
    var sttPrv = document.getElementById('sttPrv'); 
    sttPrv.style.display = 'none';
    var pp = document.getElementById('pp'); 
    pp.style.display = "none";
    pp.style.opacity = "0";
}
function closeWdw() 
{
    var pp = document.getElementById('p'); 
    pp.style.display = "none";
    pp.style.opacity = "0";    
}
function tgAjj() 
{
    var ajLiv = document.getElementById('ajLiv'); 
    ajLiv.style.display = 'block';
    var pp = document.getElementById('pp'); 
    pp.style.display = "block";  
    setTimeout(function() {
        pp.style.opacity = '1';
      }, 10);  
}
function tgAjCl() 
{
    var ajClt = document.getElementById('ajClt'); 
    ajClt.style.display = 'block';
    var pp = document.getElementById('pp'); 
    pp.style.display = "block";  
    setTimeout(function() {
        pp.style.opacity = '1';
      }, 10);  
}
function closeWwww() 
{
    var dts = document.getElementById('dts'); 
    dts.style.display = 'none';
    var cin = document.getElementById('cin'); 
    cin.style.display = 'none';
    var pp = document.getElementById('pp'); 
    pp.style.display = "none";
    pp.style.opacity = "0";
}