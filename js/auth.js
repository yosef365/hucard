const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", login);

async function login(){

const email=document.getElementById("email").value.trim();

const password=document.getElementById("password").value;

const message=document.getElementById("message");

message.textContent="";

if(!email||!password){

message.textContent="Please enter email and password.";

return;

}

const {error}=await db.auth.signInWithPassword({

email,

password

});

if(error){

message.textContent=error.message;

return;

}

window.location.href="dashboard.html";

}
