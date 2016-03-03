var enchiladasRecipe = {
    title : "Weeknight Enchiladas",
    imagePath : "images/weeknight_enchiladas.jpg",
    prepTime : 10,
    cookTime : 45,
    serves : "4 - 8 (makes 16 enchiladas)",
    ingredients : [
        "2 Tbsp vegetable oil",
        "2 Tbsp chili powder",
        "2 Tbsp flour",
        "2 cups water",
        "3 oz. tomato paste",
        "1/2 tsp cumin",
        "1/2 tsp garlic powder",
        "1/4 tsp cayenne pepper",
        "3/4 tsp salt",
        "16 small corn tortillas",
        "4 cups refried beans",
        "8 oz. Pepper Jack, shredded",
        "1/2 large avocado, sliced thin",
        "1/4 bunch cilantro (or green onions)"
    ],
    instructions: [
        "Begin by making the sauce. In a small sauce pot, combine the chili powder, flour, and oil. Heat over a medium flame, while stirring, for one to two minutes to toast the spices and flour. Whisk in the water, tomato paste, cumin, garlic powder, and cayenne pepper. Allow the mixture to come to a simmer, at which point it will thicken. Once thick enough to coat a spoon, taste and add salt as needed (1/2 to ¾ tsp). Set the sauce aside.",
        "Toast the tortillas in a dry skillet over medium flame until they are just flecked with brown on each side. The tortillas should be slightly more firm, but still pliable enough to roll. Stack the tortillas on a clean plate as they come out of the skillet.",
        "Prepare a casserole dish by coating with non-stick spray, then spread a layer of enchilada sauce over the bottom (1/2 to 1 cup). Preheat the oven to 350 degrees.",
        "Add about ¼ cup of refried beans to each tortilla, plus a small pinch of shredded cheese. Roll the tortilla tightly around the beans and cheese, then place seam side down in the casserole dish. Continue until all of the tortillas are filled. Pour another ½ to 1 cup enchilada sauce over the rolled enchiladas in the dish, leaving some of the edges exposed so they can become brown and crispy. Top with the remaining shredded cheese.",
        "Bake the casserole in the oven for 25-30 minutes or until the sauce is thick and bubbly around the edges and the center is heated through. Top with thin slices of avocado and chopped cilantro leaves (or sliced green onions)."        
    ]
};

var chickenOrzoOlivesRecipe = {
    title : "Skillet Chicken with Orzo and Olives",
    imagePath : "images/chicken_orzo_olives.jpg",
    prepTime : 5,
    cookTime : 40,
    serves : "4",
    ingredients : [
        "4 chicken thighs (bone-in, skin on)",
        "pinch of salt and pepper",
        "1 Tbsp olive oil",
        "4 cloves garlic, minced",
        "15 oz. can diced tomatoes",
        "1/3 cup pitted kalamata olives",
        "1/2 tsp dried oregano",
        "2 cups chicken broth",
        "1.5 cups uncooked orzo",
        "1/4 bunch parsley (optional)"
    ],
    instructions : [
        "Pat the chicken thighs dry with a paper towel, then sprinkle both sides with a pinch of salt and pepper. Heat the olive oil in a large, deep skillet over medium heat. Once the oil is hot and shimmering, add the chicken thighs with the skin side down. Cook the chicken thighs on each side until golden brown (about 5-7 minutes each side), then remove to a clean plate.",
        "Pour off the excess fat from the skillet, leaving just enough to sauté the garlic. Turn the heat down to medium-low, add the minced garlic, and sauté for about one minute, or just until the garlic is soft and very fragrant.",
        "Add the diced tomatoes (with juices), oregano, and some freshly cracked pepper. Stir the tomatoes, herbs, and olives to combine and allow the juices from the tomatoes to dissolve any browned bits from the bottom of the pan. Roughly chop the kalamata olives, and add them to the skillet.",
        "Add the chicken broth and orzo to the skillet, and stir to combine. Nestle the browned chicken thighs down into the skillet, place a lid on the skillet and turn the heat up to medium-high. Allow the skillet to come to a boil, then turn the heat down to low, or the lowest temperature needed to maintain a gentle simmer. Let the skillet simmer for 15 minutes with the lid in place.",
        "Turn the heat off and let the skillet rest for 5 minutes. The tomatoes and olives will have risen to the top, so use a fork to gently stir or fluff the orzo, tomatoes, and olives back together. The orzo should be tender and slightly saucy. Pull the parsley leaves from the stems, roughly chop them, and sprinkle over top."
    ]
};

var ovenRoastedChickenRecipe = {
    title: "Oven Roasted Chicken Legs",
    imagePath : "images/oven_roasted_chicken.jpg",
    prepTime : 10,
    cookTime : 90,
    serves : "2 - 4",
    ingredients : [
        "2 bone-in skin-on chicken legs",
        "1 Tbsp butter (room temperature)",
        "1/2 Tbsp lemon pepper seasoning"
    ],
    instructions : [
        "Preheat the oven to 300 degrees. Lightly coat the inside of a casserole dish with non-stick spray.",
        "Pat the chicken dry with a paper towel, then smear butter over the surface of the skin. Sprinkle the lemon pepper seasoning liberally over both sides of the chicken pieces. Place the seasoned chicken in the casserole dish.",
        "Cover the dish with aluminum foil and bake for one hour at 300 degrees. Baste the chicken once half way through. After one hour, remove the foil, baste again, and turn the heat up to 425 degrees. Continue to bake the chicken at the higher temperature for 20-30 minutes, or until the skin has achieved the desired level of brownness. Serve with the juices spooned over top or with bread for dipping."
    ]
};

var recipesArray = [enchiladasRecipe, chickenOrzoOlivesRecipe, ovenRoastedChickenRecipe];

var convertToJson = function() {
    return JSON.stringify(recipesArray);
};






