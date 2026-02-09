// Import CATEGORIES Data Form data.js
import {CATEGORIES} from "/dashboard/js/data.js"

// storge
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};


// Call Elements
const lists = document.querySelector(".lists");
const allCategory = document.querySelector(".all-category");
const category = document.querySelectorAll(".category");
const menu = document.querySelector(".menu");
const close = document.querySelector(".close");
let select;

// Called Element
whoLogIn(currentUser)
showCategories(CATEGORIES,allCategory)
showOptions()
menuSetting()


// =================Start Header UI==============
/**
 * show options when you click
 */
function showOptions() {
select = document.querySelectorAll(".select")

select.forEach((ele) => {
    
    ele.addEventListener("click", () => {
        select.forEach((e) => {
            e.style.color = "var(--color-gray-600)"
            let list = e.nextElementSibling.nextElementSibling ;
            list.classList.remove("show");
        }); // شيل من الكل
        ele.style.color = "var(--color-success)"
        let list = ele.nextElementSibling.nextElementSibling;
        list.classList.add("show");
        menuSetting()
    });
});
}
/**
 * when you open or close
 */
function menuSetting(){
    let width;
setInterval(()=>{
    width = document.scrollingElement.scrollWidth;
    widthMobile()
},100);
function widthMobile() {
    
    if(width > 540)
    {
        lists.style.display = "flex"
            select.forEach((ele) => {
           ele.style.color = "var(--color-white)"
              });
    }else{ 
        
        if(menu.classList.contains("active"))
        {
            lists.style.display = "flex"
        }else{
            lists.style.display = "none"
        }
    }
}
menu.addEventListener("click", () => {
    menu.classList.add("active")
    select.forEach((ele) => {
    ele.style.color = "var(--color-gray-600)"
    });
    lists.style.display = "flex"
})
close.addEventListener("click", () => {
    menu.classList.remove("active")
    select.forEach((ele) => {
        let list = ele.nextElementSibling.nextElementSibling ;
        list.classList.remove("show");
    });
    lists.style.display = "none"
})

}

/**
 * Loop To Show all Category Il Header List
 * @param {Object} CATEGORIES To Extract Labal and Brands
 * @param {Element} allCategory To Add Elements To Father Element
 */
function showCategories(CATEGORIES,allCategory){
    for (const key in CATEGORIES) {
        if (!Object.hasOwn(CATEGORIES, key)) continue;
            let category = document.createElement("div")
            category.classList.add("category")
            let select = document.createElement("span")
            select.classList.add("select")
            category.appendChild(select)
            let i = document.createElement("i")
            i.classList.add("fa-solid","fa-angle-down")
            category.appendChild(i)
            let ul = document.createElement("ul")
            ul.classList.add("list")
            category.appendChild(ul)
            const element = CATEGORIES[key];
            select.textContent = element.label;
        for(let i = 0; i < element.brands.length; i++)
        {
            let li = document.createElement("li")
            li.classList.add("option")
            li.textContent = element.brands[i];
            ul.appendChild(li)
        }
        allCategory.appendChild(category);
    }
}

/**
 * Function To Show User Name Or Login
 * @param {object} currentUser Take Name User Who Login
 */
function whoLogIn(currentUser){
let logIN = document.querySelector(".user-name") 
if(Object.keys(currentUser).length === 0){
    logIN.innerHTML = 'تسجيل الدخول <i class="fa-solid fa-angle-up"></i>';
    logIN.setAttribute("href",'login.html')
}else {
    let username = currentUser.Name;
    if(username.lingth > 10)
    {
        username = username.slice(0,9);
    }
    logIN.textContent = username;
    logIN.setAttribute("href",'#')
}
}
// =================Start Header UI==============
