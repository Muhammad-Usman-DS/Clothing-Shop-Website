
url = "https://gist.githubusercontent.com/rconnolly/d37a491b50203d66d043c26f33dbd798/raw/37b5b68c527ddbe824eaed12073d266d5455432a/clothing-compact.json"


//LOTS OF COMMENTS IN THE CODE 
//BECAUSE IT WAS HARD TO KEEP A TRACK- SO I WROTE MORE LIKE AN EXPLANATION SO THAT ITS EASIER TO RECALL
//AND BECAUSE IT WILL BE EASIER TO READ THE CODE FOR GRADING
//Defined alot of the Functions seperately, not in the parameters (in most cases) - to avoid the triangle of doom. 







// |--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
// |------------------ SECTION 1 ------------------------------------------------ BASIC ELEMENTS SELECTED IN THIS SECTION (FOR HIDING/DISPLAYING THE VIEWS) ------------------------------------| 
// |--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|

document.addEventListener("DOMContentLoaded", () => {

   
    // all views selected (not all - there's more down actually- but basic ones here)
    const homeView = document.querySelector("#home");
    const browseView = document.querySelector("#browse");
    const productView = document.querySelector("#singleproduct");
    const cartView = document.querySelector("#cart");
    const aboutDialog = document.querySelector("#about");

    // all navigation buttons selected as nodes/elements
    const logoButton = document.querySelector("#logoButton");
    const navHome = document.querySelector("#navHome");
    const navBrowse = document.querySelector("#navBrowse");
    const navCart = document.querySelector("#navCart");
    const navAbout = document.querySelector("#navAbout");
    // this one has both buttons for closing About
    const aboutCloseButtons = document.querySelectorAll(".aboutClose");

    // hide all views
    function hideAllViews() {
        homeView.classList.add("hidden");
        browseView.classList.add("hidden");
        productView.classList.add("hidden");
        cartView.classList.add("hidden");
    }

    // show only one specified view(put as an argument) - will use the hideAllViews() function first
    function showView(viewName) {
        // hide everything first
        hideAllViews(); 

        if (viewName === "home") {
            homeView.classList.remove("hidden");
        }
        else if (viewName === "browse") {
            browseView.classList.remove("hidden");
        }
        else if (viewName === "product") {
            productView.classList.remove("hidden");
        }
        else if (viewName === "cart") {
            cartView.classList.remove("hidden");
        }
    }

    //6 seconds too lomg - maybe chnage later?
    function showToast(message) {
        const box = document.getElementById("toastBox");

        const toast = document.createElement("div");
        toast.textContent = message;

        toast.className = `
            toast-enter
            flex items-center gap-3
            px-4 py-3 
            bg-green-600 
            text-white 
            shadow-lg 
            rounded-lg 
            text-sm
            border border-green-700
        `;

        box.appendChild(toast);

        // Remove after 5 sec ? maybe?
        setTimeout(() => {
            toast.classList.add("animate-fade-out");
            setTimeout(() => toast.remove(), 500);
        }, 5000);
    }

    // nav button event listeners - change the views based on what button is clicked(by using the hidden property)

    // home buttons
    logoButton.addEventListener("click", () => {
        showView("home");
    });

    navHome.addEventListener("click", () => {
        showView("home");
    });

    // browse
    navBrowse.addEventListener("click", () => {
        showView("browse");
    });

    // cart
    navCart.addEventListener("click", () => {
        showView("cart");
        populateCartView();
    });

    // about dialog open and close - add a button to the right (a cross button) , with the same functionality as close.
    navAbout.addEventListener("click", () => {
        aboutDialog.showModal();
    });
    for (let button of aboutCloseButtons) {
        button.addEventListener("click", () => {
            aboutDialog.close();
        });
    };


    //local storage -global variable - will be used by every view  
    //use this array as like an array in the data file - (data-pretty)
    let products = [];
    let cart = [];

    loadData();
    // keeping the default view as home
    showView("home");

    const storedCart = localStorage.getItem("cartData");
    if (storedCart) {
        cart = JSON.parse(storedCart);
        updateCartCount();
    }

    // breadcrimb
    const bcHome = document.querySelector("#bcHome");
    const bcBrowse = document.querySelector("#bcBrowse");
    if (bcHome) {
        bcHome.addEventListener("click", () => {
            showView("home");
        });
    }

    if (bcBrowse) {
        bcBrowse.addEventListener("click", () => {
            showView("browse");
        });
    }
    
// <xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx    SECTION 1 ENDS   xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx>














// |--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
// |-------------------------     SECTION 2      --------------------------------------  LOADING THE DATA INTO LOCAL STORAGE (Filling THE GLOBAL VARIABLE) -------------------------------------|
// |--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|

    // fetch should only be used once so, this function loads the data from the url using fetch if there
    // is no data that is already in the local storage, if there is then directrly initializes the view. 
    // This ensures that fetch is only being used once. 
    // After fetching , we can populate all the views using fuctions
    // Those functions will have all the other functions necessary to populate teh specific view and also the functionality.


    // this function has the function calls inside it in the .then() section 
    //which will populate the views (This doesn't handle the display views - only the population of views are called here - display is done is section 1)
    //mainly loads data into products and then calls the populateHomeView() function.
    function loadData() {

        //checking for storedData
        //null if nothing - so loop goes to else(which stores data)
        const storedData = localStorage.getItem("clothingData");

        //check if there is something in storage
        //if there already is then just populate the views
        if(storedData) {

            products = JSON.parse(storedData);
            populateHomeView();
            // populateCategoryFilter();
            // populateSizeFilter();
            // populateColorFilter();
            populateAllBrowseFilters();
            populateBrowseResults(products);
            
        }

        //if nothing in storage then fetch and store it.(hence using only once)
        //url is global - so no need  to pass as a parameter in loadData
        else {
            fetch(url)
            .then( response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return Promise.reject({
                        status: response.status,
                        statusText: response.statusText
                    })
                }
            })
            .then(data => {
                // storing fetched data into the global variable products.
                products = data;
                localStorage.setItem("clothingData", JSON.stringify(products));
                populateHomeView();
                // populateCategoryFilter();
                // populateSizeFilter();
                // populateColorFilter();
                populateAllBrowseFilters();
                populateBrowseResults(products);
                
                
            })
            .catch( err => { console.log('err='+err) });
        }
    };

// <xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx    SECTION 2 ENDS   xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx>














// |--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
// |-------------------------     SECTION 3      --------------------------------------  CREATING THE HOME VIEW (INCLUDED EVENT HANDLERS HERE) -------------------------------------------------|
// |--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|

    //all working for the Home view here
    //including event handlers
    //uses products global array to produce another array - categories (has the unique list of categories)
    //iterates through categories to produce clones if the card template
    //each card has an eventlistener - that is handled by another callback function -> categoryCardHandler 
    function populateHomeView() {
        // selecting parent node and template
            const parent = document.querySelector("#homeCategories");
            const template = document.querySelector("#homeCategoryCard");
            
            parent.replaceChildren();
            
            const categories = [];
            // d here is each object in the fetched array 
            for (let d of products) {
                if (!categories.includes(d.category)) {
                    categories.push(d.category);
                }
            }        
            
            // c here is each category in catrgories array
            for(let c of categories) {
                // clone template
                const clone = template.content.cloneNode(true);
                const categoryCard = clone.querySelector(".categoryCard");
                //for future use
                categoryCard.dataset.category = c;

                // image area (top 3/4)
                const imgBox = clone.querySelector(".cardImg");

                imgBox.textContent = ""; // remove placeholder? try 1
                imgBox.style.backgroundImage = `url('images/cards.jpg')`;  // temporary - good to use on all cards - or use the placeholder (size) thing- but will require extra ode
                imgBox.style.backgroundSize = "cover";
                imgBox.style.backgroundPosition = "center";

                // category label (should cover bottom 1/4)
                const label = clone.querySelector("p");
                
                label.textContent = c;

                // append to DOM
                parent.appendChild(clone);

            }
            // parent.addEventListener("click", function (e) {

            //     if (e.target && e.target.nodeName.toLowerCase() == "div") {

            //         //function is called which takes in category of the clicked div (e.g: Tops  --  is a string)
            //         console.log(e.target.dataset.category);
            //     }
            // });
            parent.addEventListener("click", function (e) {

            let target = e.target;

            // going up the DOM until we find the .categoryCard wrapper
            while (target && target !== parent) {
            if (target.classList.contains("categoryCard")) {
                const category = target.dataset.category;
                handleCategoryClick(category);
                // alert(category);
                return; // stopping if  already handled
            }
            target = target.parentNode; // moving up one parent
    }

});



            

            




    };

// <xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx    SECTION 3 ENDS   xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx>












// |--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
// |-------------------------     SECTION 4      --------------------------------------  CREATING THE BROWSE VIEW (INCLUDED EVENT HANDLERS HERE) -----------------------------------------------|
// |--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
let filteredCategoryList = [];
let filteredSizeList = [];
let filteredGenderList = [];
let filteredColorList = [];


// I justr prefer to have one function call instead of 3
function populateAllBrowseFilters() {
    populateCategoryFilter();
    populateSizeFilter();
    populateColorFilter();
}
// simply populates the select buttons in the category filter list - using the products[] ofc 
function populateCategoryFilter() {
    const container = document.querySelector("#filterCategory");
    container.replaceChildren();  // Clear old boxes

    // Collect unique categories
    const uniqueCats = [];
    for (let p of products) {
        if (!uniqueCats.includes(p.category)) {
            uniqueCats.push(p.category);
        }
    }

    uniqueCats.sort();

    // Create checkboxes for each category
    for (let cat of uniqueCats) {
        const wrap = document.createElement("div");
        wrap.classList.add("flex", "items-center", "gap-2");

        const chk = document.createElement("input");
        chk.type = "checkbox";
        chk.value = cat;
        chk.dataset.category = cat;
        chk.id = "cat_" + cat.toLowerCase();
        chk.classList.add("categoryCheckbox"); 

        const lbl = document.createElement("label");
        lbl.setAttribute("for", chk.id);
        lbl.textContent = cat;

        wrap.appendChild(chk);
        wrap.appendChild(lbl);

        container.appendChild(wrap);
    }
}
const allCatBtn = document.querySelector("#selectAllCategories");
allCatBtn.addEventListener("click", () => {
    const checkboxes = document.querySelectorAll("#filterCategory input[type='checkbox']");

    // Select all category checkboxes
    for (let chk of checkboxes) {
        chk.checked = true;
    }

    // Update the filter list based on new selections
    updateFilterLists();
    updateActiveFiltersBar();
});



function populateSizeFilter() {
    const container = document.querySelector("#filterSizeGroup");
    container.replaceChildren();

    const uniqueSizes = [];

    for (let p of products) {
        for (let s of p.sizes) {
            if (!uniqueSizes.includes(s)) {
                uniqueSizes.push(s);
            }
        }
    }

    uniqueSizes.sort();

    for (let size of uniqueSizes) {
        const wrap = document.createElement("label");
        wrap.classList.add("flex", "items-center", "gap-2");

        const chk = document.createElement("input");
        chk.type = "checkbox";
        chk.value = size;
        chk.dataset.size = size;
        chk.classList.add("sizeCheckbox");

        const span = document.createElement("span");
        span.textContent = size;

        wrap.appendChild(chk);
        wrap.appendChild(span);

        container.appendChild(wrap);
    }
}
const allSizesBtn = document.querySelector("#selectAllSizes");
allSizesBtn.addEventListener("click", () => {
    const sizeChecks = document.querySelectorAll("#filterSizeGroup input[type='checkbox']");

    // Check all size boxes
    for (let chk of sizeChecks) {
        chk.checked = true;
    }

    // Update filtering arrays
    updateFilterLists();
    updateActiveFiltersBar();
});


function populateColorFilter() {
    const container = document.querySelector("#filterColorGroup");
    container.replaceChildren();

    const colorMap = new Map(); 
    // key = color name, value = hex code

    // Build unique color list
    for (let p of products) {
        for (let c of p.color) {
            colorMap.set(c.name, c.hex);
        }
    }

    const uniqueColors = Array.from(colorMap.entries()); 
    // → [ ["Ivory", "#FFFFF0"], ["Black", "#000000"], ... ]

    uniqueColors.sort((a, b) => a[0].localeCompare(b[0]));

    // Build UI
    for (let [colorName, hexValue] of uniqueColors) {

        const wrap = document.createElement("label");
        wrap.classList.add("flex", "items-center", "gap-2");

        // Checkbox
        const chk = document.createElement("input");
        chk.type = "checkbox";
        chk.value = colorName;
        chk.dataset.color = colorName; 
        chk.classList.add("colorCheckbox");

        // Text
        const span = document.createElement("span");
        span.textContent = colorName;

        // little color square here (approach idea - just use as a div ? and color it by using the product hex? - ask prof how to tomorrow )
        const swatch = document.createElement("div");
        swatch.style.width = "16px";
        swatch.style.height = "16px";
        swatch.style.borderRadius = "3px";
        swatch.style.border = "1px solid #ccc";
        swatch.style.backgroundColor = hexValue;

        // Append elements
        wrap.appendChild(chk);
        wrap.appendChild(span);
        wrap.appendChild(swatch);

        container.appendChild(wrap);
    }
}
document.querySelector("#selectAllColors").addEventListener("click", () => {
    const checks = document.querySelectorAll(".colorCheckbox");
    for (let chk of checks) chk.checked = true;

    updateFilterLists();  // refresh filters
    updateActiveFiltersBar() 
});

// reset button event listener
document.querySelector("#resetFilters").addEventListener("click", () => {
    resetAllFilters();
});
// reset allll filters
function resetAllFilters() {

    // uncheck category checkboxes
    document.querySelectorAll(".categoryCheckbox").forEach(cb => cb.checked = false);

    // uncheck size checkboxes
    document.querySelectorAll(".sizeCheckbox").forEach(cb => cb.checked = false);

    // uncheck color checkboxes
    document.querySelectorAll(".colorCheckbox").forEach(cb => cb.checked = false);

    // reset gender dropdown
    const genderSelect = document.querySelector("#filterGender");
    if (genderSelect) genderSelect.value = "";

    // Reset ALL filter arrays
    filteredCategoryList = [];
    filteredSizeList = [];
    filteredColorList = [];
    filteredGenderList = [];

    // must update the filter bar BEFORE reapplying anything - otherwise everyhting will mess up
    updateActiveFiltersBar();

    // Now repopulate ALL products -  should I even use this ? check while testing in lab
    applyBrowseFilters(products);
}

function populateBrowseResults(list) { 

    const grid = document.querySelector("#browseResultsGrid");
    const template = document.querySelector("#browseProductCard");
    const summary = document.querySelector("#resultsSummary");

    grid.replaceChildren();

    if (summary) {
        summary.textContent = `Total matches found: ${list.length}`;
    }

    // if no matches, show message instead of cards
    if (list.length === 0) {
        const msg = document.createElement("p");
        msg.textContent = "No matching found of filters";
        msg.classList.add("text-sm", "text-slate-600", "italic", "mt-2");
        grid.appendChild(msg);
        return; 
    }

    // loop through all products
    for (let p of list) {

        const clone = template.content.cloneNode(true);

        const img = clone.querySelector(".productImg");
        img.src = "images/cards.jpg";
        img.alt = p.name;

        const name = clone.querySelector(".productName");
        name.textContent = p.name;

        const price = clone.querySelector(".productPrice");
        price.textContent = `$${p.price}`;

        //category for now
        const brand = clone.querySelector(".productBrand");
        brand.textContent = p.category;


        // code for the small +add to card button - just setting data-id for future event handlers.
        const card = clone.querySelector(".productCard");
        card.dataset.id = p.id;
        // console.log(card.dataset.id);
        // card.addEventListener("click", () => showSingleProduct(card.dataset.id) );
        card.addEventListener("click", () => {
            showSingleProduct(p.id);
        });

        const addBtn = clone.querySelector(".addToCartBtn");
        addBtn.dataset.id = p.id;
        addBtn.dataset.name = p.name;

        //sample(keep it or nah?) event listener
        addBtn.addEventListener("click", (e) => {
            e.stopPropagation();

            showToast("Please select a size on the product page before adding to cart.");
            showSingleProduct(p.id);
        });
        // 

        //
        // const card = clone.querySelector(".productCard");
        // card.dataset.id = p.id;
        // card.addEventListener("click", () => handleProductClick(p));
        grid.appendChild(clone);
    }
}


// updates the 4 filtered* lists based on instructions pdf, then refreshes results + filter bar
function updateFilterLists() {  
    const categoryChecks = document.querySelectorAll(".categoryCheckbox:checked");
    filteredCategoryList = [];
    for (let cb of categoryChecks) {
        filteredCategoryList.push(cb.value);
    }

    const sizeChecks = document.querySelectorAll(".sizeCheckbox:checked");
    filteredSizeList = [];
    for (let cb of sizeChecks) {
        filteredSizeList.push(cb.value);
    }

    //(usinjg data-color)
    const colorChecks = document.querySelectorAll(".colorCheckbox:checked");
    filteredColorList = [];
    for (let cb of colorChecks) {
        filteredColorList.push(cb.dataset.color);
    }

    //(either [] or [value])
    const genderSelect = document.querySelector("#filterGender");
    filteredGenderList = [];
    if (genderSelect && genderSelect.value) {
        filteredGenderList.push(genderSelect.value);
    }

    applyBrowseFilters();
    updateActiveFiltersBar();
}




// this function's job is to populate the browse view after the filters are selected
// and the filter lists are already upddated - after each event. 
function applyBrowseFilters() {

    let finalFilteredList = [...products];
    if (filteredCategoryList.length > 0) {
        finalFilteredList = finalFilteredList.filter(p =>
            filteredCategoryList.includes(p.category)
        );
    }

    if (filteredGenderList.length > 0) {
        finalFilteredList = finalFilteredList.filter(p =>
            filteredGenderList.includes(p.gender.toLowerCase())
        );
    }
    // size - too long ? check for a shorter way in the labs later - although it works
    if (filteredSizeList.length > 0) {
        finalFilteredList = finalFilteredList.filter(p => {
            let match = false;
            for (let s of p.sizes) {
                if (filteredSizeList.includes(s)) {
                    match = true;
                    break;
                }
            }
            return match;
        });
    }

    if (filteredColorList.length > 0) {
        finalFilteredList = finalFilteredList.filter(p => {
            let match = false;
            for (let c of p.color) {
                if (filteredColorList.includes(c.name)) {
                    match = true;
                    break;
                }
            }
            return match;
        });
    }

    finalFilteredList = applySort(finalFilteredList);

    updateActiveFiltersBar();
    populateBrowseResults(finalFilteredList);
}




function updateActiveFiltersBar() {
    const bar = document.querySelector("#activeFilters");
    bar.replaceChildren();

    const selectedCategories = [...document.querySelectorAll(".categoryCheckbox:checked")];
    const selectedSizes = [...document.querySelectorAll(".sizeCheckbox:checked")];
    const selectedColors = [...document.querySelectorAll(".colorCheckbox:checked")];
    const genderValue = document.querySelector("#filterGender")?.value || "";

    const nothingSelected =
        selectedCategories.length === 0 &&
        selectedSizes.length === 0 &&
        selectedColors.length === 0 &&
        genderValue === "";

    if (nothingSelected) {
        const span = document.createElement("span");
        span.textContent = "No filters applied";
        span.classList.add("text-slate-500", "italic");
        bar.appendChild(span);
        return;
    }

    const title = document.createElement("p");
    title.textContent = "Following filters currently selected:";
    title.classList.add("font-semibold", "text-slate-800", "w-full");
    bar.appendChild(title);

    //filters here for event handlers
    if (selectedCategories.length > 0) {
        const div = document.createElement("div");
        div.className = "bg-slate-200 px-2 py-1 rounded";
        div.textContent = "Category: " + selectedCategories.map(cb => cb.value).join(", ");
        bar.appendChild(div);
    }

    if (selectedSizes.length > 0) {
        const div = document.createElement("div");
        div.className = "bg-slate-200 px-2 py-1 rounded";
        div.textContent = "Size: " + selectedSizes.map(cb => cb.value).join(", ");
        bar.appendChild(div);
    }

    if (selectedColors.length > 0) {
        const div = document.createElement("div");
        div.className = "bg-slate-200 px-2 py-1 rounded";
        div.textContent = "Color: " + selectedColors.map(cb => cb.dataset.color).join(", ");
        bar.appendChild(div);
    }

    if (genderValue !== "") {
        const div = document.createElement("div");
        div.className = "bg-slate-200 px-2 py-1 rounded";
        div.textContent = "Gender: " + (genderValue === "womens" ? "Women" : "Men");
        bar.appendChild(div);
    }
}


// category checkboxes (#filterCategory)
const categoryContainer = document.querySelector("#filterCategory");
if (categoryContainer) {
    categoryContainer.addEventListener("change", function (e) {
        if (e.target && e.target.classList.contains("categoryCheckbox")) {
            updateFilterLists();
        }
    });
}
// size checkboxes (#filterSizeGroup)
const sizeContainer = document.querySelector("#filterSizeGroup");
if (sizeContainer) {
    sizeContainer.addEventListener("change", function (e) {
        if (e.target && e.target.classList.contains("sizeCheckbox")) {
            updateFilterLists();
        }
    });
}
// #filterColorGroup)
const colorContainer = document.querySelector("#filterColorGroup");
if (colorContainer) {
    colorContainer.addEventListener("change", function (e) {
        if (e.target && e.target.classList.contains("colorCheckbox")) {
            updateFilterLists();
        }
    });
}
const genderSelect = document.querySelector("#filterGender");
if (genderSelect) {
    genderSelect.addEventListener("change", () => {
        updateFilterLists();
    });
}
updateActiveFiltersBar();


// should switch the view first , then all working
function handleCategoryClick(categoryString) {

    showView("browse");
    resetAllFilters();


    const allCategoryCheckboxes = document.querySelectorAll(".categoryCheckbox");
    let checkbox = null;

    for (let cb of allCategoryCheckboxes) {
        if (cb.dataset.category === categoryString) {
            checkbox = cb;
            break;
        }
    }

    if (checkbox) {
        checkbox.checked = true;
    } else {
        console.log("No checkbox found for category:", categoryString);
    }



    updateFilterLists();
    updateActiveFiltersBar();
    applyBrowseFilters();
}

//all lists were already declared -  gotta do workingg here - up somewhere 
function updateFilterLists() {

    filteredCategoryList = [...document.querySelectorAll(".categoryCheckbox:checked")]
        .map(cb => cb.dataset.category);
    filteredSizeList = [...document.querySelectorAll(".sizeCheckbox:checked")]
        .map(cb => cb.dataset.size);
    filteredColorList = [...document.querySelectorAll(".colorCheckbox:checked")]
        .map(cb => cb.dataset.color);


    const genderSelect = document.querySelector("#filterGender");
    if (genderSelect && genderSelect.value !== "") {
        filteredGenderList = [genderSelect.value.toLowerCase()];
    } else {
        filteredGenderList = [];
    }

    applyBrowseFilters();
    updateActiveFiltersBar();
}

function applySort(list) {

    const sortValue = document.querySelector("#filterSort")?.value;

    if (!sortValue) return list;
    let sortedList = [...list];

    switch (sortValue) {

        case "nameAsc":
            sortedList.sort((a, b) => a.name.localeCompare(b.name));
            break;

        case "nameDesc":
            sortedList.sort((a, b) => b.name.localeCompare(a.name));
            break;

        case "priceLow":
            sortedList.sort((a, b) => a.price - b.price);
            break;

        case "priceHigh":
            sortedList.sort((a, b) => b.price - a.price);
            break;

        default:
            break;
    }

    return sortedList;
}

const sortSelect = document.querySelector("#filterSort");
if (sortSelect) {
    sortSelect.addEventListener("change", () => {
        applyBrowseFilters();
    });
}
// <xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx    SECTION 4 ENDS   xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx>









// |--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
// |-------------------------     SECTION 5      --------------------------------------  CREATING THE SINGLE PRODUCT VIEW (INCLUDED EVENT HANDLERS HERE) ---------------------------------------|
// |--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
//start
// products array already has all the objects because of loadData() so I just used that here 
// also switch view beofre all the code  
function showSingleProduct(productID) {

    let product = products.find(p => p.id === productID);
    if (!product) {
        console.log("Product not found: " + productID);
        return;
    }

    showView("product");

    //breadcrumb working here
    const bcName = document.querySelector("#bcProductName");
    if (bcName) {
        bcName.textContent = product.name;
    }

    const container = document.querySelector("#singleProductContainer");
    const template = document.querySelector("#singleProductTemplate");
    container.replaceChildren();

    const clone = template.content.cloneNode(true);


    // any way I can change the images by clicking  - add lkater  -if possible.
    const mainPic   = clone.querySelector("#mainPic");
    const smallPic1 = clone.querySelector("#smallPic1");
    const smallPic2 = clone.querySelector("#smallPic2");
    const smallPic3 = clone.querySelector("#smallPic3");

    if (mainPic)   mainPic.src   = "images/cards.jpg";
    if (smallPic1) smallPic1.src = "images/closeUp1.jpg";
    if (smallPic2) smallPic2.src = "images/closeUp2.jpg";
    if (smallPic3) smallPic3.src = "images/cards.jpg";

    const nameEl = clone.querySelector("#spName");
    if (nameEl) nameEl.textContent = product.name;

    const priceEl = clone.querySelector("#spPrice");
    if (priceEl) priceEl.textContent = "$" + product.price;

    const descEl = clone.querySelector("#spDescription");
    if (descEl) descEl.textContent = product.description;

    const matEl = clone.querySelector("#spMaterial");
    if (matEl) matEl.textContent = "Material: " + product.material;

   
    // Sizes (as radio buttons – one must be selected)
    const sizeBox = clone.querySelector("#spSizes");
    if (sizeBox) {
        sizeBox.replaceChildren();

        product.sizes.forEach((s, index) => {
            const label = document.createElement("label");
            label.classList.add(
                "flex", "items-center", "gap-2",
                "bg-slate-200", "px-2", "py-1", "rounded"
            );

            const input = document.createElement("input");
            input.type = "radio";
            input.name = "spSize";      // same group name
            input.value = s;
            input.classList.add("spSizeRadio");

            // default: first size checked
            if (index === 0) {
                input.checked = true;
            }

            const span = document.createElement("span");
            span.textContent = s;

            label.appendChild(input);
            label.appendChild(span);
            sizeBox.appendChild(label);
        });
    }

    //how do I add the little color box? 
    const colorBox = clone.querySelector("#spColors");
    if (colorBox) {
        colorBox.replaceChildren();
        for (let c of product.color) {
            const wrap = document.createElement("div");
            wrap.classList.add("flex", "items-center", "gap-2", "bg-slate-200", "px-2", "py-1", "rounded");

            const swatch = document.createElement("div");
            swatch.style.width = "16px";
            swatch.style.height = "16px";
            swatch.style.borderRadius = "3px";
            swatch.style.border = "1px solid #ccc";
            swatch.style.backgroundColor = c.hex;

            const label = document.createElement("span");
            label.textContent = c.name;

            wrap.appendChild(swatch);
            wrap.appendChild(label);
            colorBox.appendChild(wrap);
        }
    }

    if (smallPic1 && mainPic) {
        smallPic1.addEventListener("click", (e) => {
            e.stopPropagation();
            mainPic.src = "images/closeUp1.jpg";
        });
    }

    if (smallPic2 && mainPic) {
        smallPic2.addEventListener("click", (e) => {
            e.stopPropagation();
            mainPic.src = "images/closeUp2.jpg";
        });
    }

    if (smallPic3 && mainPic) {
        smallPic3.addEventListener("click", (e) => {
            e.stopPropagation();
            mainPic.src = "images/cards.jpg";
        });
    }

    container.appendChild(clone);


    // quantity working from here
    const qtyInput = container.querySelector("#spQuantity");
    const minusBtn = container.querySelector("#qtyMinus");
    const plusBtn  = container.querySelector("#qtyPlus");
    const addBtn   = container.querySelector("#spAddToCart");

    // guard in case I have to make markup changes
    if (qtyInput && minusBtn && plusBtn) {

        minusBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            let val = Number(qtyInput.value) || 1;
            if (val > 1) qtyInput.value = val - 1;
        });

        plusBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            qtyInput.value = Number(qtyInput.value || 1) + 1;
        });
    }

    if (addBtn) {
    addBtn.dataset.id = product.id;
    addBtn.dataset.name = product.name;

    addBtn.addEventListener("click", (e) => {
        e.stopPropagation();

        const qty = qtyInput ? Number(qtyInput.value) || 1 : 1;

        const selectedSizeInput = container.querySelector("input[name='spSize']:checked");
        if (!selectedSizeInput) {
            showToast("Please select a size before adding to cart.");
            return;
        }
        const sizeValue = selectedSizeInput.value;

        //global cart thing
        addToCart(product.id, qty, sizeValue);

        showToast(`Added ${qty} × "${product.name}" (Size: ${sizeValue}) to cart!`);
    });
    }


    // populate related products
    populateRelatedProducts(product);
}

function populateRelatedProducts(product) {
    const grid = document.querySelector("#relatedProductsGrid");
    grid.replaceChildren();

    const related = products.filter(p =>
        p.category === product.category && p.id !== product.id
    );

    const template = document.querySelector("#browseProductCard");

    for (let p of related.slice(0, 4)) {  
        const clone = template.content.cloneNode(true);

        
        const img = clone.querySelector(".productImg");
        img.src = "images/cards.jpg";

        clone.querySelector(".productName").textContent = p.name;
        clone.querySelector(".productPrice").textContent = "$" + p.price;
        clone.querySelector(".productBrand").textContent = p.category;

        // opens the single product
        const card = clone.querySelector(".productCard");
        card.dataset.id = p.id;
        card.addEventListener("click", () => showSingleProduct(p.id));

        //add to caart button event handler - check Lab 9a / if not then 9b
        const addBtn = clone.querySelector(".addToCartBtn");
        if (addBtn) {
            addBtn.dataset.id = p.id;
            addBtn.dataset.name = p.name;

            addBtn.addEventListener("click", (e) => {
                e.stopPropagation(); 

                showToast("Please select a size on the product page before adding to cart.");
                showSingleProduct(p.id);
            });

        }

        grid.appendChild(clone);
    }
}
// <xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx    SECTION 5 ENDS   xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx>










// |--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
// |-------------------------     SECTION 6      --------------------------------------  CREATING THE SHOPPING CART VIEW (INCLUDED EVENT HANDLERS HERE) ----------------------------------------|
// |--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|

// updating the little Cart (0) number in the header
function updateCartCount() {
    const span = document.querySelector("#cartCount");
    if (!span) return;

    let totalQty = 0;
    for (let item of cart) {
        totalQty += item.quantity;
    }
    span.textContent = totalQty;
}

// main helper function
function addToCart(productID, quantity, size) {
    const qty = Number(quantity) || 1;

    const product = products.find(p => p.id === productID);
    if (!product) {
        console.log("addToCart: product not found for id", productID);
        return;
    }

    const sizeValue = size || null;

    // merging quantites for future use
    let existing = cart.find(item =>
        item.id === productID && item.size === sizeValue
    );

    if (existing) {
        existing.quantity += qty;
    }
    else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            size: sizeValue,
            quantity: qty,
            product: product
        });
    }

    updateCartCount();
    saveCartToStorage();

    // populateCart(); 
}

// calling this whenever the cart changes, or when entering Cart view
function populateCartView() {

    const container = document.querySelector("#cartItemsContainer");
    const emptyMsg = document.querySelector("#cartEmptyMessage");

    const summaryMerch = document.querySelector("#summaryMerchandise");
    const summaryShipping = document.querySelector("#summaryShipping");
    const summaryTax = document.querySelector("#summaryTax");
    const summaryTotal = document.querySelector("#summaryTotal");

    container.replaceChildren();

    if (cart.length === 0) {
        emptyMsg.classList.remove("hidden");
        summaryMerch.textContent = "$0.00";
        summaryShipping.textContent = "$0.00";
        summaryTax.textContent = "$0.00";
        summaryTotal.textContent = "$0.00";
        return;
    }

    emptyMsg.classList.add("hidden");

    const template = document.querySelector("#cartItemTemplate");

    let merchandiseTotal = 0;

    cart.forEach((item, index) => {

        const clone = template.content.cloneNode(true);

        // image
        const imgEl = clone.querySelector(".cartItemImg");
        imgEl.src = "images/cards.jpg";  // static for now
        imgEl.alt = item.name;

        // 
        clone.querySelector(".cartItemName").textContent = item.name;
        // clone.querySelector(".cartItemMeta").textContent = `Product ID: ${item.id}`;

        const colorBox = clone.querySelector(".cartItemColorBox");
        const prod = products.find(p => p.id === item.id);

        if (prod && prod.color && prod.color.length > 0) {
            // match the selected size's index? 
            // default as first color
            colorBox.style.backgroundColor = prod.color[0].hex;
        }

        clone.querySelector(".cartItemSize").textContent = item.size || "-";
        clone.querySelector(".cartItemPrice").textContent = `$${item.price}`;
        const qtyText = clone.querySelector(".cartItemQty");

        qtyText.textContent = item.quantity;

        const minusBtn = clone.querySelector(".cartQtyMinus");
        const plusBtn = clone.querySelector(".cartQtyPlus");

        // minus
        minusBtn.addEventListener("click", () => {
            if (item.quantity > 1) {
                item.quantity--;
            } else {
                // remove 
                cart.splice(index, 1);
            }
            updateCartCount();
            populateCartView();
            saveCartToStorage();
        });

        // plus
        plusBtn.addEventListener("click", () => {
            item.quantity++;
            updateCartCount();
            populateCartView();
            saveCartToStorage();
        });

        // remove
        const removeBtn = clone.querySelector(".cartRemoveBtn");
        removeBtn.addEventListener("click", () => {
            cart.splice(index, 1);
            updateCartCount();
            populateCartView();
            saveCartToStorage();
        });

        const subtotal = item.price * item.quantity;
        merchandiseTotal += subtotal;
        clone.querySelector(".cartItemSubtotal").textContent = `$${subtotal.toFixed(2)}`;

        container.appendChild(clone);
    });

    
    //SUMMARY    from here
    summaryMerch.textContent = `$${merchandiseTotal.toFixed(2)}`;

    const method = document.querySelector("#shippingMethod").value;
    const dest   = document.querySelector("#shippingDestination").value;

    let shippingCost = 0;

    

    if (merchandiseTotal > 500) {
        shippingCost = 0;
    }
    // 
    // Standard ($10,$15,$20) - Express ($25,$25,$30) - Priority ($35,$50,$50)
    // 
    else {
        const table = {
            standard: { CA: 10, US: 15, INTL: 20 },
            express:  { CA: 25, US: 25, INTL: 30 },
            priority: { CA: 35, US: 50, INTL: 50 }
        };

        shippingCost = table[method][dest];
    }

    


    summaryShipping.textContent = `$${shippingCost.toFixed(2)}`;

    // tax — based on destination
    let taxRate = 0;
    if (dest === "CA") taxRate = 0.05;

    const taxAmount = merchandiseTotal * taxRate;
    summaryTax.textContent = `$${taxAmount.toFixed(2)}`;

    const grandTotal = merchandiseTotal + taxAmount + shippingCost;
    summaryTotal.textContent = `$${grandTotal.toFixed(2)}`;

    // let shippingCost = 0;

    // if (merchandiseTotal > 500) {
    //     shippingCost = 0;
    // } else {
    //     const method = document.querySelector("#shippingMethod").value;
    //     const dest = document.querySelector("#shippingDestination").value;

    //     // shipping matrix per screenshot
    //     const shippingTable = {
    //         standard: { CA: 10, US: 15, INTL: 20 },
    //         express:  { CA: 25, US: 25, INTL: 30 },
    //         priority: { CA: 35, US: 50, INTL: 50 }
    //     };

    //     shippingCost = shippingTable[method][dest];
    // }

    // summaryShipping.textContent = `$${shippingCost.toFixed(2)}`;
}

document.querySelector("#shippingMethod").addEventListener("change", () => {
    populateCartView();
});

document.querySelector("#shippingDestination").addEventListener("change", () => {
    populateCartView();
});

//local storage used here
function saveCartToStorage() {
    localStorage.setItem("cartData", JSON.stringify(cart));
}

function loadCartFromStorage() {
    const data = localStorage.getItem("cartData");
    if (data) {
        cart = JSON.parse(data);
        updateCartCount();
    }
}


//    shipping handling here  -  from the instructions - check again when coding for this.

// document.querySelector("#shippingMethod").addEventListener("change", populateCartView);
// document.querySelector("#shippingDestination").addEventListener("change", populateCartView);


//View swtich 
document.querySelector("#navCart").addEventListener("click", () => {
    showView("cart");
    populateCartView();
});

//checkout event handlers 
document.querySelector("#checkoutButton").addEventListener("click", () => {
    if (cart.length === 0) return;

    showToast("Thank you for your purchase!");

    cart = [];
    saveCartToStorage();
    updateCartCount();
    populateCartView();

    showView("home");
});

//fairly easy - should take half an hour fromm here
function updateCartTotals() {

    let subtotal = 0;
    for (let item of cart) {
        subtotal += item.price * item.quantity;
    }

    const shippingChoice = document.querySelector('input[name="shippingOption"]:checked');
    let shippingCost = 0;
    if (shippingChoice) {
        shippingCost = Number(shippingChoice.dataset.cost) || 0;
    }

    // simple tax rate – adjust later if assignment says something else
    const TAX_RATE = 0.05;
    const tax = subtotal * TAX_RATE;

    const total = subtotal + shippingCost + tax;

    const subEl = document.querySelector("#cartSubtotal");
    const shipEl = document.querySelector("#cartShipping");
    const taxEl = document.querySelector("#cartTax");
    const totalEl = document.querySelector("#cartTotal");

    if (subEl) subEl.textContent = `$${subtotal.toFixed(2)}`;
    if (shipEl) shipEl.textContent = `$${shippingCost.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

// whenever shipping option changes - should calculate again
function wireShippingChangeHandler() {
    const shippingRadios = document.querySelectorAll('input[name="shippingOption"]');
    shippingRadios.forEach(radio => {
        radio.addEventListener("change", () => {
            updateCartTotals();
        });
    });
}
// <xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx    SECTION 6 ENDS   xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx>







loadCartFromStorage();
wireShippingChangeHandler();

});
