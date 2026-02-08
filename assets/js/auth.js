/*

بتحاكي تسجيل الدخول فقط
تطويرات مستقبلية
1- حساب واحد لكل إيميل
2- لا يمكن قبول اي حساب عادي 
3- لا يمكن قبول اي اسم الا بشروط
4- كلمة مرور قوية
5- حذف الاليرت
6- انشاء رسائل إحترافية
7- اضافة امكانية تسجيل الدخول برقم الهاتف
8- حفظ تسجيل الدخول
9- تنبيه اذا لم يتم تسجيل الدخول
10- اضافة تشفير لكلمة المرور حتى لا نعلم ما تم ادخاله المستخدم
11- لو متجر وديه الداشبور
*/
// From Register Page
const roleButtons = document.querySelectorAll(".role-switch button");
const customerFields = document.querySelectorAll(".customer-field");
const merchantFields = document.querySelectorAll(".merchant-field");
const emailInput = document.querySelector(".emailInput")
const passInput = document.querySelector(".passInput")
// From Login Page
const loginEmail = document.getElementById("email")
const loginPass = document.getElementById("password")
// Public
let currentRole = "customer"; // الاختيار
let usersCount = +localStorage.getItem("usersCount") || 0;

// Start Register Page --------------------------------------- 
// لما تدوس و تختار اي نوع
roleButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    roleButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentRole = btn.dataset.role;

    if (currentRole === "customer") {
      customerFields.forEach(f => f.classList.remove("hidden"));
      merchantFields.forEach(f => f.classList.add("hidden"));
            emailInput.value = ""
            passInput.value = ""
      
    } else {
      customerFields.forEach(f => f.classList.add("hidden"));
      merchantFields.forEach(f => f.classList.remove("hidden"));
    }
          
  });
});
// حل عبيط اوي 😂
if(window.location.href.slice(-8) === "ter.html"){
document.getElementById("registerForm").addEventListener("submit", e => {
  e.preventDefault();
  console.log("submit")

  const email = emailInput.value.trim();
  const password = passInput.value.trim();

  if (!email || !password || password.length < 6) {
    alert("تأكد من إدخال البيانات بشكل صحيح");
    return;
  }

  const user = {
    id: usersCount + 1, // usersCount = 1
    role: currentRole,
    email: email,
    password: password
  };

  if (currentRole === "customer") {
    user.Name = username.value.trim();
  } else {
    user.Name = storeName.value.trim();
    user.address = address.value.trim();
    user.installment = installment.checked;
    user.shipping = shipping.checked;
  }
  console.log(user)
  const users = JSON.parse(localStorage.getItem("users")) || [];
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));

  alert("تم إنشاء الحساب بنجاح ✅");
  usersCount++ 
  console.log(usersCount);
  localStorage.setItem("usersCount",usersCount);
});
}
// End Register Page --------------------------------------- 
// Start Login Page --------------------------------------- 
// حل عبيط اوي 😂
if(window.location.href.slice(-8) === "gin.html"){
document.getElementById("loginForm").addEventListener("submit", e => {
  e.preventDefault()
  checkAccount()
})
}
function checkAccount(){
  let userEmail = loginEmail.value.trim();
  let userPass = loginPass.value.trim();
  const users = JSON.parse(localStorage.getItem("users")) || [];
  if(users.length === 0) return alert("عليك بإنشاء حساب اولاً") ;
  for(let i =0; i < users.length; i++)
  {
    if(users[i].email === userEmail)
    {
        if( users[i].password == userPass)
        {
          localStorage.setItem("currentUser", JSON.stringify(users[i]));
          window.location.href = "./dashboard/dashboard.html";
        }else{
          return alert("كلمة مرور أو الحساب غير صحيح")
        }
    }
  }
  return alert("عليك بتسجيل حساب اولاً")  //لازم يكون في دالة و تعمل استرجاع
}
// End Login Page --------------------------------------- 
