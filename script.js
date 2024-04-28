const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');
const myFavoriteMeals = document.getElementById('my-favourite-meals');

let favouriteArray = []; // Array to store favorite meal IDs

// Check if favoriteArray exists in localStorage, otherwise initialize it
if (!localStorage.getItem("favouriteArray")) {
  localStorage.setItem("favouriteArray", JSON.stringify(favouriteArray));
} else {
  favouriteArray = JSON.parse(localStorage.getItem("favouriteArray"));
}
// Function to toggle favorites
function toggleFavorites(e) {
  e.preventDefault();
  let index = favouriteArray.indexOf(this.id);
  if (index == -1) {
    favouriteArray.push(this.id);
    this.classList.add('clicked');
  } else {
    favouriteArray.splice(index, 1);
    this.classList.remove('clicked');
  }

  localStorage.setItem("favouriteArray", JSON.stringify(favouriteArray));
}

// event listeners
searchBtn.addEventListener('click', getMealList);

// get meal list that matches with the ingredients
function getMealList() {
    let searchInputTxt = document.getElementById('search-input').value.trim();
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
        .then(response => response.json())
        .then(data => {
            let html = "";
            if (data.meals) {
                data.meals.forEach(meal => {
                    html = html + `
                    <div class="meal-item" data-id="${meal.idMeal}">
                    <button type="button" data-id="${meal.idMeal}" class="favorite-btn is-favorite">
                    +
                    </button>
                        <div class="meal-img">
                            <img class="card-img-top" src="${meal.strMealThumb}"  alt="food">
                        </div>
                        <div class="meal-name">
                            <h3>${meal.strMeal}</h3>
                            <a href="#" class="recipe-btn">View Recipe</a>
                            ${
          favouriteArray.includes(meal.idMeal) ? `<a href="" class='favourite clicked' id='${meal.idMeal}'><i class="fa-sharp fa-solid fa-heart"></i></a>` : `<a href="" class='favourite' id='${meal.idMeal}'><i class="fa-sharp fa-solid fa-heart"></i></a>`
        }
                        </div>
                    </div>
                    `;
                });
                mealList.classList.remove('notFound');
            }
            else {
                html = "Oops! Search Result not found. Please enter valid Ingredient.";
                mealList.classList.add('noMatch');
            }
            mealList.innerHTML = html;
        });
}
// Event List
myFavoriteMeals.addEventListener('click', displayFavoriteMeals);

// Function to display favorite meals
async function displayFavoriteMeals() {
    mealList.innerHTML = '';

    for (let meal of favouriteArray) {
    
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal}`);
        const data = await response.json();

        let meals = data.meals[0];
    
        const div = document.createElement('div');
        div.classList.add('images');
        div.innerHTML = `
      <img src="${meals.strMealThumb}" alt="">
      <h4>${meals.strMeal}</h4>
      <button type="button" class='border-circle more-details' id='${meals.idMeal}'>More Details</button>
      <a href="" class='favourite clicked' id='${meals.idMeal}'><i class="fa-sharp fa-solid fa-heart"></i></a>`;

        mealList.append(div);

        var favoriteButton = document.querySelectorAll('a');
        for (let button of favoriteButton) {
            button.addEventListener('click', toggleFavorites);
        }
    }
}


//Event Listener
mealList.addEventListener('click', getMealRecipe);

//get recipe of yhe meal
function getMealRecipe(e){
    e.preventDefault();
    if(e.target.classList.contains('recipe-btn')){
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
            .then(response => response.json())
            .then(data => mealRecipeModal(data.meals));
    }
}

//creating a Modal
function mealRecipeModal(meal) {
    console.log(meal);
    meal = meal[0];
    let html = `    <h2 class = "recipe-title">${meal.strMeal}</h2>
                    <p class = "recipe-category">${meal.strCategory}</p>
                    <div class = "recipe-instruct">
                        <h3>Instructions:</h3>
                        <p>${meal.strInstructions}</p>
                    </div>
                    <div class = "recipe-meal-img">
                        <img src = "${meal.strMealThumb}" alt = "">
                    </div>
                    <div class = "recipe-link">
                            <a href = "${meal.strYoutube}" target = "_blank">Watch Video</a>
                    </div>
                    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}

//Close button
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});