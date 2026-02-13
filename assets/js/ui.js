/**
 * UI.js - Componats Ui For Cards IN UR Sait
 * @module Data
 */

import  {CATEGORIES} from "/dashboard/js/data.js"

const prodcts = JSON.parse(localStorage.getItem("products_dashboard_v2")) || {}
let spshiol_catagory = document.querySelector(".spshiol_catagory")
// console.log(prodcts) // Object
// console.log(prodcts[1]) المستخدم الاول
// console.log(prodcts[1][0]) المنتج الاول من المستخدم الاول
// console.log(prodcts[1][0].images[0]) اول صورة من اول منج من اول مستخدم
// stateText If New or Discond or ""
//  discondCurrent discond 1% or more


for (const key in prodcts) {
    if (!Object.hasOwn(prodcts, key)) continue;
    const user = prodcts[key]; // التجار

    for (const key in user) {
        if (!Object.hasOwn(user, key)) continue;
        const mntg = user[key]; // منتجات التجار
        console.log(mntg)
        let category = getCategoriesName(CATEGORIES,mntg.category); // تلفونات
        let shortDesc = mntg.shortDescription.slice(0,30);
        let price = mntg.price -(mntg.price * mntg.discount / 100);
        GetProdcts(
            spshiol_catagory,
            "خصم",
            mntg.discount,
            "https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            category,
            mntg.name,
            shortDesc,
            price,
            mntg.price
        )
    }    
}
getCategoriesName(CATEGORIES)
function getCategoriesName(CATE,ctaeName) {
for (const key in CATE) {
    if (!Object.hasOwn(CATE, key)) continue;
    
    const prodct = CATE[key];
    if(prodct.id === ctaeName)
    {
        return prodct.label
    }
}
}

/**
 * 
 * @param {Element} container 
 * @param {String} stateText 
 * @param {number} discondCurrent 
 * @param {String} image 
 * @param {String} categoryName 
 * @param {String} prandName 
 * @param {String} prandDesc 
 * @param {Number} price 
 * @param {Number} disconde 
 */
function GetProdcts(container,stateText,discondCurrent,image,categoryName,prandname,prandDesc,pric,discond) {
    // card
    let card = document.createElement("div")
    card.classList.add("card")

    // the state
    if(stateText.length > 1)
    {
    let infoState = document.createElement("div")
    infoState.classList.add(".info-state")
    infoState.style.cssText = `position: absolute;
    top: 20px;
    left: 10px;
    border-radius: 6px;
    padding: 5px 10px;
    color: var(--color-white);
    /* background-color: var(--color-primary); */
    font-size: 11px;
    font-weight: 200;`
    card.appendChild(infoState)
    let state = document.createElement("span")
    state.classList.add("state")
    infoState.appendChild(state)
    if(stateText === "جديد")
    {
        state.textContent = "جديد"
        infoState.style.backgroundColor = "var(--color-primary)"
    }else{
        if(discondCurrent > 0)
        {
            state.textContent = `خصم ${discondCurrent}%`
            infoState.style.backgroundColor = `var(--color-danger-primary)`
        }
        }
    }

    // The Image 
    let divImg = document.createElement("div")
    divImg.classList.add("img")
    card.appendChild(divImg)
    let img = document.createElement("img")
    img.setAttribute("src",image)
    divImg.appendChild(img)

    // Info 
    let divinfo = document.createElement("div");
    card.appendChild(divinfo)
    let infoCategory = document.createElement("div");
    infoCategory.classList.add("info-category");
    divinfo.appendChild(infoCategory);
    let categoreName = document.createElement("span")
    categoreName.classList.add("category-name")
    infoCategory.appendChild(categoreName)
    categoreName.textContent = categoryName;
    let prandName = document.createElement("span")
    prandName.classList.add("prand-name")
    infoCategory.appendChild(prandName)
    prandName.textContent = prandname;
    let prandShortDescreption = document.createElement("span")
    prandShortDescreption.classList.add("prand-short-descreption")
    infoCategory.appendChild(prandShortDescreption)
    prandShortDescreption.textContent = prandDesc;
    let divPrice = document.createElement("div")
    infoCategory.appendChild(divPrice);
    let price = document.createElement("span")
    price.classList.add("price")
    divPrice.appendChild(price)
    price.textContent = `${Number.parseFloat(pric).toFixed(2)} جم`;
    let disconde = document.createElement("span")
    disconde.classList.add("disconde")
    divPrice.appendChild(disconde)
    disconde.textContent = `${Number.parseFloat(discond).toFixed(2)} جم`;

    // action
    let cardAction = document.createElement("div")
    cardAction.classList.add("card-action")
    divinfo.appendChild(cardAction)

    let addTcard = document.createElement("div")
    addTcard.classList.add("add-Tcard")
    cardAction.appendChild(addTcard);

    let tcardIcon = document.createElement("i")
    tcardIcon.classList.add("fa-solid","fa-cart-shopping");
    addTcard.appendChild(tcardIcon);
    let tcardText = document.createElement("span")
    tcardText.textContent = "أضف للسلة"
    addTcard.appendChild(tcardText);
    
    let addTfavorit = document.createElement("div")
    addTfavorit.classList.add("add-Tfavorit")
    cardAction.appendChild(addTfavorit);

    let tfavoritIcon = document.createElement("i")
    tfavoritIcon.classList.add("fa-solid","fa-heart");
    addTfavorit.appendChild(tfavoritIcon);

    container.appendChild(card);
}


