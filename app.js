/**
 * ROUTINE TABLET - CORE LOGIC & PWA CONTROLLER (V3 Ultra-Clean)
 * Designed for landscape wall tablet (Lenovo Tab M10, 1280x800)
 * Includes:
 *  - 04:00 AM Daily Rollover
 *  - Dynamic College Day vs Weekend Schedule
 *  - Core Tasks Streak Logic
 *  - Home Gym Muscle Hypertrophy Workout Tracker with Rest Timer
 *  - ~2,900 kcal / 135g Protein Indian Clean Diet Meal Plan & Soya Rule
 *  - Sunday Body Weight Tracker
 *  - Weekly Grocery Shopping List
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. DATA DEFINITIONS: NUTRITION & RECIPES (~2,900 kcal / 135-145g Protein)
  // ==========================================================================
  const SOYA_GOLDEN_RULE =
    "Boil soya chunks for 10 minutes in rolling water with a pinch of salt. Turn off heat, let cool slightly, then squeeze out the water thoroughly. Rinse once with fresh cold water and squeeze dry again before cooking. This completely removes the raw beany taste and creates a spongy texture that absorbs rich curry gravies like meat.";

  const WEEKLY_MEALS = {
    1: { // Monday
      dayName: "Monday",
      macros: { kcal: 2910, protein: 138, carbs: 365, fats: 72 },
      breakfast: {
        title: "4 Boiled Eggs + 3 Rotis with Ghee + Banana + Milk",
        time: "08:00 AM",
        macros: { kcal: 780, protein: 38, carbs: 98, fats: 24 },
        ingredients: [
          "4 large eggs (boiled)",
          "3 whole wheat rotis (freshly cooked)",
          "1 tsp desi ghee (applied on rotis)",
          "1 large ripe banana",
          "250 ml whole milk (warmed)"
        ],
        steps: [
          "Place 4 eggs in boiling water for 9 minutes for firm hard-boiled yolks. Cool in cold water and peel.",
          "Roll out and cook 3 rotis on a hot tawa until puffed. Brush lightly with 1 tsp ghee.",
          "Sprinkle a pinch of black pepper and rock salt over the halved boiled eggs.",
          "Serve warm with 1 peeled banana and 250 ml warm milk."
        ]
      },
      shake: {
        title: "High-Calorie Post-College Muscle Shake",
        time: "04:30 PM",
        macros: { kcal: 670, protein: 25, carbs: 95, fats: 20 },
        ingredients: [
          "500 ml whole milk",
          "2 ripe bananas",
          "30 g peanut butter (1 heaping tbsp)",
          "40 g rolled oats (raw/powdered)",
          "1 pinch cardamom or cinnamon powder"
        ],
        steps: [
          "Add oats into blender and pulse for 15 seconds until ground into a fine flour.",
          "Slice in 2 ripe bananas, add 1 heaping tbsp peanut butter, and pour 500 ml cold milk.",
          "Blend on high speed for 45-60 seconds until creamy and frothy.",
          "Drink immediately post-college for rapid glycogen and muscle recovery."
        ]
      },
      lunchNonCollege: {
        title: "Homestyle Dal Rice + Sabzi + Curd + 2 Boiled Eggs",
        time: "01:00 PM",
        macros: { kcal: 720, protein: 32, carbs: 105, fats: 16 },
        ingredients: [
          "2 cups steamed basmati rice",
          "1 large bowl yellow toor dal tadka",
          "1 bowl seasonal mixed sabzi (aloo-gobi/beans)",
          "1 cup (150 g) fresh homemade curd (dahi)",
          "2 hard-boiled eggs"
        ],
        steps: [
          "Pressure cook toor dal with turmeric and salt; temper with cumin seeds and garlic.",
          "Steam rice and sauté seasonal vegetables in a teaspoon of mustard oil.",
          "Boil and peel 2 eggs; slice into halves with chaat masala.",
          "Combine rice, dal, sabzi, curd, and eggs for a balanced midday refuel."
        ]
      },
      dinner: {
        title: "High-Protein Soya Chunks Curry + Rice + Dal + 1 Egg",
        time: "07:45 PM",
        macros: { kcal: 760, protein: 43, carbs: 110, fats: 18 },
        ingredients: [
          "50 g dry soya chunks (Nutrela)",
          "1.5 cups steamed white rice",
          "1 bowl toor or moong dal",
          "1 hard-boiled egg",
          "1 onion, 2 tomatoes, ginger-garlic paste",
          "1 tbsp mustard oil, garam masala, turmeric, red chilli"
        ],
        steps: [
          "SOYA PREP: Boil 50g soya chunks 10 min. Drain, rinse cold, and squeeze out all water firmly.",
          "Heat 1 tbsp oil in a pan, sauté chopped onions until golden, add ginger-garlic paste and tomatoes.",
          "Add dry spices and sauté until oil separates. Toss in squeezed soya chunks and 1 cup water; simmer 8 min.",
          "Serve hot curry over steamed rice alongside 1 bowl dal and 1 sliced boiled egg."
        ]
      },
      bedtime: {
        title: "Warm Milk + Roasted Peanuts",
        time: "11:15 PM",
        macros: { kcal: 330, protein: 14, carbs: 18, fats: 18 },
        ingredients: [
          "250 ml warm whole milk",
          "30 g dry roasted peanuts"
        ],
        steps: [
          "Gently warm 250 ml milk with a pinch of turmeric or nutmeg.",
          "Measure 30 g unsalted roasted peanuts.",
          "Consume 15 minutes before winding down to provide slow-digesting casein protein overnight."
        ]
      }
    },

    2: { // Tuesday
      dayName: "Tuesday",
      macros: { kcal: 2920, protein: 135, carbs: 370, fats: 72 },
      breakfast: {
        title: "4-Egg Bhurji + 3 Rotis + Banana + Milk",
        time: "08:00 AM",
        macros: { kcal: 810, protein: 40, carbs: 92, fats: 28 },
        ingredients: [
          "4 eggs (beaten)",
          "1 finely chopped onion & 1 tomato",
          "1 green chilli & fresh coriander",
          "1 tsp oil/ghee for cooking bhurji",
          "3 whole wheat rotis + 1 banana + 250 ml milk"
        ],
        steps: [
          "Sauté onions and green chillies in 1 tsp oil until soft, add tomatoes and spices.",
          "Pour in 4 whisked eggs and scramble on medium-low heat until fluffy and cooked through.",
          "Garnish with chopped fresh coriander and serve with 3 warm rotis.",
          "Follow up with 1 ripe banana and 250 ml milk."
        ]
      },
      shake: {
        title: "High-Calorie Post-College Muscle Shake",
        time: "04:30 PM",
        macros: { kcal: 670, protein: 25, carbs: 95, fats: 20 },
        ingredients: [
          "500 ml whole milk", "2 ripe bananas", "30 g peanut butter", "40 g rolled oats"
        ],
        steps: [
          "Pulse oats in blender until finely powdered.",
          "Add milk, bananas, and peanut butter; blend smooth.",
          "Drink immediately after returning from college."
        ]
      },
      lunchNonCollege: {
        title: "Homestyle Dal Rice + Sabzi + Curd + 2 Boiled Eggs",
        time: "01:00 PM",
        macros: { kcal: 720, protein: 32, carbs: 105, fats: 16 },
        ingredients: [
          "2 cups steamed rice", "1 bowl dal tadka", "1 bowl sabzi", "1 cup curd", "2 boiled eggs"
        ],
        steps: [
          "Reheat dal and prepare fresh seasonal sabzi.",
          "Assemble plate with rice, curd, and 2 peeled sliced boiled eggs."
        ]
      },
      dinner: {
        title: "3-Egg Dhaba Curry + 3 Rotis + 1 Bowl Dal + Salad",
        time: "07:45 PM",
        macros: { kcal: 710, protein: 36, carbs: 95, fats: 20 },
        ingredients: [
          "3 hard-boiled eggs (poked with fork)",
          "3 whole wheat rotis",
          "1 bowl yellow dal",
          "1 onion, 2 tomatoes, ginger-garlic paste",
          "1 tbsp oil, turmeric, coriander powder, garam masala"
        ],
        steps: [
          "Lightly pan-fry boiled eggs in 1/2 tsp oil with turmeric for a golden skin.",
          "In the same pan, fry chopped onions, ginger-garlic paste, and tomato puree until thick.",
          "Add spices, 3/4 cup water, and simmer fried eggs for 6 minutes.",
          "Serve piping hot with 3 fresh rotis, warm dal, and sliced onions/cucumber."
        ]
      },
      bedtime: {
        title: "Warm Milk + Roasted Peanuts",
        time: "11:15 PM",
        macros: { kcal: 330, protein: 14, carbs: 18, fats: 18 },
        ingredients: [ "250 ml warm whole milk", "30 g roasted peanuts" ],
        steps: [ "Heat milk and enjoy with 30g crunchy peanuts before bed." ]
      }
    },

    3: { // Wednesday
      dayName: "Wednesday",
      macros: { kcal: 2970, protein: 143, carbs: 375, fats: 74 },
      breakfast: {
        title: "Peanut Butter Banana Oats Bowl + 3 Boiled Eggs",
        time: "08:00 AM",
        macros: { kcal: 800, protein: 38, carbs: 102, fats: 26 },
        ingredients: [
          "50 g rolled oats",
          "300 ml whole milk",
          "1 heaping tbsp (30 g) peanut butter",
          "1 sliced banana + 1 tsp honey",
          "3 hard-boiled eggs"
        ],
        steps: [
          "Simmer oats in milk on medium heat for 4 minutes until thick and creamy.",
          "Stir in 1 tbsp peanut butter while hot so it melts through evenly.",
          "Top with sliced banana and a drizzle of honey.",
          "Eat the eggs first for satiety, followed by the calorie-dense oatmeal bowl."
        ]
      },
      shake: {
        title: "High-Calorie Post-College Muscle Shake",
        time: "04:30 PM",
        macros: { kcal: 670, protein: 25, carbs: 95, fats: 20 },
        ingredients: [ "500 ml milk", "2 bananas", "30 g peanut butter", "40 g oats" ],
        steps: [ "Blend oats, bananas, milk, and peanut butter until rich and velvety." ]
      },
      lunchNonCollege: {
        title: "Dal Rice + Sabzi + Curd + 2 Boiled Eggs",
        time: "01:00 PM",
        macros: { kcal: 720, protein: 32, carbs: 105, fats: 16 },
        ingredients: [ "2 cups rice", "1 bowl dal", "1 bowl sabzi", "1 cup curd", "2 eggs" ],
        steps: [ "Assemble homestyle lunch with eggs and fresh curd." ]
      },
      dinner: {
        title: "High-Protein Soya Pulao + Curd (Dahi) + 2 Boiled Eggs",
        time: "07:45 PM",
        macros: { kcal: 820, protein: 48, carbs: 115, fats: 20 },
        ingredients: [
          "60 g dry soya chunks (Nutrela)",
          "1.5 cups basmati rice (washed)",
          "1 cup green peas, onions, carrots",
          "1 cup (150 g) fresh curd",
          "2 hard-boiled eggs",
          "1 tbsp ghee, whole spices (cloves, cardamom, bay leaf)"
        ],
        steps: [
          "SOYA PREP: Boil 60g soya chunks 10 min. Squeeze out water completely, rinse cold, squeeze dry.",
          "In a cooker, heat 1 tbsp ghee, add whole spices and sliced onions until brown.",
          "Add chopped vegetables, squeezed soya chunks, washed rice, 3 cups water, and salt.",
          "Pressure cook for 2 whistles. Serve hot pulao with cool curd and 2 boiled eggs."
        ]
      },
      bedtime: {
        title: "Warm Milk + Roasted Peanuts",
        time: "11:15 PM",
        macros: { kcal: 330, protein: 14, carbs: 18, fats: 18 },
        ingredients: [ "250 ml warm whole milk", "30 g roasted peanuts" ],
        steps: [ "Warm milk and peanuts before sleep." ]
      }
    },

    4: { // Thursday
      dayName: "Thursday",
      macros: { kcal: 2930, protein: 133, carbs: 380, fats: 70 },
      breakfast: {
        title: "4 Boiled Eggs + 3 Rotis with Ghee + Banana + Milk",
        time: "08:00 AM",
        macros: { kcal: 780, protein: 38, carbs: 98, fats: 24 },
        ingredients: [
          "4 boiled eggs", "3 rotis", "1 tsp ghee", "1 banana", "250 ml milk"
        ],
        steps: [
          "Boil eggs 9 minutes, peel and season with chaat masala.",
          "Warm 3 rotis with ghee, enjoy with fresh fruit and milk."
        ]
      },
      shake: {
        title: "High-Calorie Post-College Muscle Shake",
        time: "04:30 PM",
        macros: { kcal: 670, protein: 25, carbs: 95, fats: 20 },
        ingredients: [ "500 ml milk", "2 bananas", "30 g peanut butter", "40 g oats" ],
        steps: [ "Blend and drink for post-workout recovery." ]
      },
      lunchNonCollege: {
        title: "Dal Rice + Sabzi + Curd + 2 Boiled Eggs",
        time: "01:00 PM",
        macros: { kcal: 720, protein: 32, carbs: 105, fats: 16 },
        ingredients: [ "2 cups rice", "1 bowl dal", "1 bowl sabzi", "1 cup curd", "2 eggs" ],
        steps: [ "Homestyle lunch with 2 boiled eggs." ]
      },
      dinner: {
        title: "Rajma Chawal Feast + Curd + 2 Boiled Eggs",
        time: "07:45 PM",
        macros: { kcal: 780, protein: 38, carbs: 120, fats: 16 },
        ingredients: [
          "1.5 large bowls Punjabi rajma (kidney beans in thick gravy)",
          "1.5 cups steamed basmati rice",
          "1 cup (150 g) fresh curd",
          "2 hard-boiled eggs",
          "Sliced onions with lemon juice"
        ],
        steps: [
          "Pressure cook soaked rajma until melt-in-mouth tender.",
          "Sauté onion-tomato-ginger masala with kasuri methi and simmer rajma until gravy is thick.",
          "Serve generous ladlefuls over steaming hot basmati rice.",
          "Pair with chilled curd and 2 peeled eggs seasoned with black salt."
        ]
      },
      bedtime: {
        title: "Warm Milk + Roasted Peanuts",
        time: "11:15 PM",
        macros: { kcal: 330, protein: 14, carbs: 18, fats: 18 },
        ingredients: [ "250 ml warm milk", "30 g roasted peanuts" ],
        steps: [ "Bedtime recovery snack." ]
      }
    },

    5: { // Friday
      dayName: "Friday",
      macros: { kcal: 2950, protein: 142, carbs: 360, fats: 76 },
      breakfast: {
        title: "4-Egg Omelette + 4 Bread Slices with Peanut Butter + Banana",
        time: "08:00 AM",
        macros: { kcal: 820, protein: 42, carbs: 90, fats: 30 },
        ingredients: [
          "4 large eggs (whisked)",
          "4 slices whole wheat bread",
          "2 tbsp (30 g) peanut butter",
          "1 banana",
          "Finely chopped onions, tomatoes, salt, black pepper"
        ],
        steps: [
          "Whisk eggs with onions, tomatoes, salt, and pepper.",
          "Pour onto a non-stick pan and cook a fluffy double-folded omelette.",
          "Toast 4 bread slices and spread 30 g peanut butter.",
          "Slice banana over toast and eat alongside the protein-rich omelette."
        ]
      },
      shake: {
        title: "High-Calorie Post-College Muscle Shake",
        time: "04:30 PM",
        macros: { kcal: 670, protein: 25, carbs: 95, fats: 20 },
        ingredients: [ "500 ml milk", "2 bananas", "30 g peanut butter", "40 g oats" ],
        steps: [ "Blend smooth and drink post-college." ]
      },
      lunchNonCollege: {
        title: "Dal Rice + Sabzi + Curd + 2 Boiled Eggs",
        time: "01:00 PM",
        macros: { kcal: 720, protein: 32, carbs: 105, fats: 16 },
        ingredients: [ "2 cups rice", "1 bowl dal", "1 bowl sabzi", "1 cup curd", "2 eggs" ],
        steps: [ "Assemble lunch plate with eggs and curd." ]
      },
      dinner: {
        title: "Soya Keema Bhurji + 3 Rotis + 1 Bowl Dal",
        time: "07:45 PM",
        macros: { kcal: 740, protein: 44, carbs: 98, fats: 18 },
        ingredients: [
          "50 g dry soya chunks (Nutrela)",
          "3 whole wheat rotis",
          "1 bowl yellow dal",
          "1 large onion, 2 tomatoes, green chillies, ginger-garlic paste",
          "1 tbsp oil, garam masala, pav bhaji masala (optional flavor booster)"
        ],
        steps: [
          "SOYA PREP: Boil 50g soya chunks 10 min. Squeeze out water completely. Pulse in mixer 5 sec to shred into keema.",
          "Heat oil, sauté onions and ginger-garlic until golden brown.",
          "Add tomatoes, dry spices, and cook till fragrant; fold in minced soya keema and 1/2 cup water.",
          "Cook 6-8 min until thick and flavorful. Enjoy with 3 soft rotis and hot dal."
        ]
      },
      bedtime: {
        title: "Warm Milk + Roasted Peanuts",
        time: "11:15 PM",
        macros: { kcal: 330, protein: 14, carbs: 18, fats: 18 },
        ingredients: [ "250 ml warm milk", "30 g roasted peanuts" ],
        steps: [ "Bedtime recovery snack." ]
      }
    },

    6: { // Saturday
      dayName: "Saturday",
      macros: { kcal: 3000, protein: 134, carbs: 395, fats: 76 },
      breakfast: {
        title: "4 Boiled Eggs + 3 Aloo Parathas + 1 Cup Curd",
        time: "08:00 AM",
        macros: { kcal: 850, protein: 38, carbs: 115, fats: 26 },
        ingredients: [
          "4 boiled eggs",
          "3 whole wheat aloo parathas (stuffed with spiced potatoes)",
          "1 cup (150 g) fresh curd",
          "1 tsp butter or ghee"
        ],
        steps: [
          "Boil and peel 4 eggs; sprinkle with black pepper.",
          "Cook 3 hearty aloo parathas on a hot tawa with a light brush of ghee.",
          "Serve parathas with fresh creamy curd and the eggs for a filling weekend breakfast."
        ]
      },
      shake: { // Sat afternoon snack
        title: "Pre-Sport Energy Smoothie",
        time: "04:30 PM",
        macros: { kcal: 450, protein: 16, carbs: 70, fats: 14 },
        ingredients: [ "350 ml milk", "2 bananas", "20 g peanut butter" ],
        steps: [ "Blend milk, bananas, and peanut butter 45 minutes before Saturday volleyball/badminton." ]
      },
      lunchNonCollege: {
        title: "Weekend Dal Tadka + Rice + Aloo Gobi + Curd + 2 Eggs",
        time: "01:00 PM",
        macros: { kcal: 760, protein: 32, carbs: 112, fats: 18 },
        ingredients: [
          "2 cups steamed rice", "1 bowl tadka dal", "1 bowl aloo gobi", "1 cup curd", "2 boiled eggs"
        ],
        steps: [
          "Enjoy a relaxed weekend lunch with hot rice, freshly tempered dal, sabzi, curd, and 2 eggs."
        ]
      },
      dinner: {
        title: "High-Protein Egg Fried Rice + Dal + Sliced Veggies",
        time: "07:45 PM",
        macros: { kcal: 730, protein: 34, carbs: 105, fats: 20 },
        ingredients: [
          "3 large eggs (scrambled)",
          "2 cups cooked rice (day-old or cooled)",
          "1 cup diced carrots, green beans, onions",
          "1 tbsp soya sauce & black pepper",
          "1 bowl dal"
        ],
        steps: [
          "Scramble 3 eggs in a hot wok with 1/2 tsp oil until just set; set aside.",
          "Stir-fry chopped veggies on high flame for 2 minutes for crunch.",
          "Add rice, soy sauce, black pepper, and scrambled eggs; toss briskly.",
          "Serve piping hot with a bowl of warm dal on the side."
        ]
      },
      bedtime: {
        title: "Warm Milk + Roasted Peanuts",
        time: "11:15 PM",
        macros: { kcal: 330, protein: 14, carbs: 18, fats: 18 },
        ingredients: [ "250 ml warm milk", "30 g roasted peanuts" ],
        steps: [ "Bedtime recovery snack." ]
      }
    },

    0: { // Sunday
      dayName: "Sunday",
      macros: { kcal: 3000, protein: 148, carbs: 380, fats: 76 },
      breakfast: {
        title: "Sunday Power Bowl: 4 Boiled Eggs + 3 Rotis + Banana Shake",
        time: "08:00 AM",
        macros: { kcal: 860, protein: 44, carbs: 110, fats: 26 },
        ingredients: [
          "4 boiled eggs",
          "3 whole wheat rotis with ghee",
          "1 shake: 300 ml milk + 2 bananas + 25 g peanut butter"
        ],
        steps: [
          "Boil eggs, peel, and season.",
          "Blend a rich banana-milk shake.",
          "Eat eggs and warm rotis first, followed by the shake."
        ]
      },
      shake: { // Sunday snack
        title: "Sunday Afternoon Protein Snack",
        time: "04:30 PM",
        macros: { kcal: 330, protein: 14, carbs: 32, fats: 16 },
        ingredients: [ "250 ml milk", "30 g roasted peanuts", "1 banana" ],
        steps: [ "Quick afternoon recharge during meal prep." ]
      },
      lunchNonCollege: {
        title: "Sunday Special Dal Tadka + Jeera Rice + Curd + 2 Eggs",
        time: "01:00 PM",
        macros: { kcal: 740, protein: 32, carbs: 108, fats: 16 },
        ingredients: [
          "2 cups jeera rice", "1 bowl dal tadka", "1 cup curd", "2 boiled eggs", "Cucumber salad"
        ],
        steps: [
          "Sauté cumin in ghee for jeera rice; assemble with hot dal, eggs, and seasoned cucumber slices."
        ]
      },
      dinner: {
        title: "Soya & Egg Curry Combo + 3 Rotis + Dal",
        time: "07:45 PM",
        macros: { kcal: 790, protein: 46, carbs: 102, fats: 22 },
        ingredients: [
          "40 g dry soya chunks (Nutrela)",
          "2 hard-boiled eggs",
          "3 whole wheat rotis",
          "1 bowl dal",
          "1 large onion, 2 tomatoes, ginger-garlic paste, garam masala, 1 tbsp oil"
        ],
        steps: [
          "SOYA PREP: Boil 40g soya chunks 10 min. Squeeze out water completely, rinse cold, squeeze dry.",
          "Prepare aromatic onion-tomato curry base in a kadai.",
          "Add boiled eggs (halved) and squeezed soya chunks to simmer together for 8 minutes.",
          "Serve with 3 soft rotis and hot dal for the ultimate weekend protein feast."
        ]
      },
      bedtime: {
        title: "Warm Milk + Roasted Peanuts",
        time: "11:15 PM",
        macros: { kcal: 280, protein: 12, carbs: 16, fats: 15 },
        ingredients: [ "250 ml warm milk", "20 g roasted peanuts" ],
        steps: [ "Bedtime recovery snack." ]
      }
    }
  };

  // ==========================================================================
  // 2. DATA DEFINITIONS: WORKOUT HYPERTROPHY PROGRAM
  // ==========================================================================
  const WORKOUT_WARMUP = [
    { name: "Arm Circles & Shoulder Dislocates", duration: "30s forward + 30s backward", cue: "Large fluid circles to lubricate shoulder sockets." },
    { name: "Jumping Jacks", duration: "60 seconds", cue: "Elevates heart rate and core temperature gently." },
    { name: "Bodyweight Air Squats", duration: "15 reps", cue: "Full depth, knees track over toes, chest up." },
    { name: "Cat-Cow Spinal Waves", duration: "10 cycles", cue: "Breathe in arching back, exhale rounding spine." },
    { name: "Push-Up Plank Walkouts", duration: "8 reps", cue: "From standing, walk hands out to high plank and walk back." }
  ];

  const WORKOUT_COOLDOWN = [
    { name: "Doorway Chest & Bicep Stretch", duration: "30s each arm", cue: "Forearm on doorframe, rotate torso away gently." },
    { name: "Standing Quad & Hip Flexor Stretch", duration: "30s each leg", cue: "Tuck pelvis under, pull heel toward glute." },
    { name: "Seated Hamstring Stretch", duration: "45s total", cue: "Hinge from hips with a flat back, reach for shins/toes." },
    { name: "Child's Pose Deep Breathing", duration: "45 seconds", cue: "Hips to heels, reach arms forward, deep belly breathing." }
  ];

  const WORKOUT_PROGRAM = {
    1: { // Monday
      dayName: "Monday",
      focus: "Upper Body Hypertrophy (Push & Pull)",
      muscleGroups: "Chest, Front/Side Delts, Triceps, Upper Lats, Biceps",
      estTime: "45 min",
      exercises: [
        {
          id: "ex-pushups",
          name: "Standard Push-Ups",
          equipment: "Floor / Backpack",
          sets: 4,
          reps: "8-15 reps",
          restSec: 90,
          cue: "Chest to floor, elbows flared 45°, core clamped like a rigid plank. If you hit 15 reps cleanly on all sets, wear a backpack loaded with 2-4 kg of books.",
          targetReps: 15
        },
        {
          id: "ex-pike-pushups",
          name: "Pike Push-Ups",
          equipment: "Floor / Chair",
          sets: 3,
          reps: "6-12 reps",
          restSec: 90,
          cue: "Hips high in inverted V shape, head travels diagonally forward between hands, elbows tucked in. Heavy shoulder stimulus.",
          targetReps: 12
        },
        {
          id: "ex-chair-dips",
          name: "Chair Dips",
          equipment: "Sturdy Chair",
          sets: 3,
          reps: "10-15 reps",
          restSec: 75,
          cue: "Grip chair edge, keep back close to chair, lower to 90° elbow bend, lock out triceps at the top.",
          targetReps: 15
        },
        {
          id: "ex-back-row",
          name: "Backpack Bent-Over Rows",
          swapIfPullup: "Chin-Ups (Underhand)",
          equipment: "Loaded Backpack (or Pull-Up Bar)",
          sets: 4,
          reps: "10-15 reps",
          restSec: 90,
          cue: "Hinge at hips with flat back, pull backpack straps toward hip pockets, squeeze shoulder blades together for 2 seconds. If pull-up bar is enabled: perform Chin-Ups 4x6-10 with chest to bar.",
          targetReps: 15
        },
        {
          id: "ex-backpack-curls",
          name: "Backpack Biceps Curls",
          equipment: "Loaded Backpack",
          sets: 3,
          reps: "10-15 reps",
          restSec: 60,
          cue: "Pin elbows to ribcage, curl backpack with control, hold 2s peak contraction at top, lower for 3 seconds.",
          targetReps: 15
        }
      ]
    },

    2: { // Tuesday
      dayName: "Tuesday",
      focus: "Lower Body Quad & Posterior Chain Hypertrophy",
      muscleGroups: "Quadriceps, Hamstrings, Glutes, Calves",
      estTime: "45 min",
      exercises: [
        {
          id: "ex-bulgarian-squat",
          name: "Bulgarian Split Squats",
          equipment: "Chair / Sturdy Step",
          sets: 4,
          reps: "8-12 reps / leg",
          restSec: 90,
          cue: "Back foot elevated on chair, front shin nearly vertical, drop back knee towards the floor. Drive through front heel.",
          targetReps: 12
        },
        {
          id: "ex-tempo-squats",
          name: "Tempo Air Squats (3s Down, 1s Pause)",
          equipment: "Bodyweight",
          sets: 3,
          reps: "15-20 reps",
          restSec: 75,
          cue: "Lower for 3 full seconds, pause for 1 second at rock-bottom parallel, explosively stand up. High quad burn.",
          targetReps: 20
        },
        {
          id: "ex-glute-bridges",
          name: "Single-Leg Glute Bridges",
          equipment: "Floor / Step",
          sets: 3,
          reps: "12-15 reps / leg",
          restSec: 60,
          cue: "Drive heel into floor, extend hips fully to the ceiling, squeeze glute at top for 2 seconds before lowering.",
          targetReps: 15
        },
        {
          id: "ex-calf-raises",
          name: "Calf Raises on a Step",
          equipment: "Stair Step / Sturdy Ledge",
          sets: 4,
          reps: "15-20 reps",
          restSec: 60,
          cue: "Full stretch at bottom below step level, rise high onto balls of feet, hold 2 seconds at top peak.",
          targetReps: 20
        }
      ]
    },

    3: { // Wednesday
      dayName: "Wednesday",
      focus: "Active Recovery & Joint Mobility",
      muscleGroups: "Cardiovascular endurance, hip & shoulder mobility, CNS reset",
      estTime: "30 min",
      exercises: [
        {
          id: "ex-walk-sport",
          name: "Brisk Outdoor Walk or Sport",
          equipment: "Sneakers / Court",
          sets: 1,
          reps: "20-30 min",
          restSec: 0,
          cue: "Brisk walk in fresh air, or casual volleyball / badminton match. Gets blood flowing to accelerate muscle repair.",
          targetReps: 1
        },
        {
          id: "ex-mobility-flow",
          name: "Full Body Mobility & Stretching Flow",
          equipment: "Floor Mat / Towel",
          sets: 1,
          reps: "10-15 min",
          restSec: 0,
          cue: "Deep pigeon pose, hip flexor couch stretch, thoracic rotations, and shoulder dislocates with a towel.",
          targetReps: 1
        }
      ]
    },

    4: { // Thursday
      dayName: "Thursday",
      focus: "Upper Body Hypertrophy (Decline & Vertical Drive)",
      muscleGroups: "Upper Clavicular Chest, Shoulders, Lats, Brachialis & Triceps",
      estTime: "45 min",
      exercises: [
        {
          id: "ex-decline-pushups",
          name: "Decline Push-Ups (Feet on Chair)",
          equipment: "Chair / Stool",
          sets: 4,
          reps: "8-12 reps",
          restSec: 90,
          cue: "Feet elevated on chair, hands on floor. Shifts tension directly onto upper chest fibers. Keep core rigid.",
          targetReps: 12
        },
        {
          id: "ex-elevated-pike",
          name: "Feet-Elevated Pike Push-Ups",
          equipment: "Chair / Step",
          sets: 3,
          reps: "6-10 reps",
          restSec: 90,
          cue: "Toes elevated on chair/step for an aggressive vertical pressing angle. Control descent to tap crown of head.",
          targetReps: 10
        },
        {
          id: "ex-backpack-ohp",
          name: "Backpack Overhead Press",
          equipment: "Loaded Backpack",
          sets: 3,
          reps: "8-12 reps",
          restSec: 75,
          cue: "Hold backpack firmly by handles, press overhead to full lockout without hyperextending lower back.",
          targetReps: 12
        },
        {
          id: "ex-table-rows",
          name: "Inverted Table Rows (or Pull-Ups)",
          swapIfPullup: "Strict Pull-Ups (Overhand)",
          equipment: "Sturdy Table (or Pull-Up Bar)",
          sets: 4,
          reps: "8-12 reps",
          restSec: 90,
          cue: "Lie under sturdy table, overhand grip on edge, pull chest up to underside of table. If pull-up bar enabled: Strict Pull-Ups 4x5-8 with dead-hang.",
          targetReps: 12
        },
        {
          id: "ex-hammer-curls",
          name: "Backpack Hammer Curls",
          equipment: "Loaded Backpack / Water Bottles",
          sets: 3,
          reps: "10-12 reps",
          restSec: 60,
          cue: "Neutral grip holding backpack side handles. Directly builds the brachialis muscle underneath biceps for arm thickness.",
          targetReps: 12
        },
        {
          id: "ex-chair-dips-2",
          name: "Chair Dips (Slow Eccentric)",
          equipment: "Sturdy Chair",
          sets: 3,
          reps: "10-15 reps",
          restSec: 60,
          cue: "3 seconds lowering into deep tricep stretch, explosive lockout.",
          targetReps: 15
        }
      ]
    },

    5: { // Friday
      dayName: "Friday",
      focus: "Lower Body & Core Hypertrophy",
      muscleGroups: "Hamstrings, Glutes, Quads, Rectus Abdominis, Obliques",
      estTime: "45 min",
      exercises: [
        {
          id: "ex-walking-lunges",
          name: "Walking Lunges",
          equipment: "Bodyweight / Water Bottles",
          sets: 4,
          reps: "12 reps / leg",
          restSec: 90,
          cue: "Long stride, back knee gently kisses floor, upright torso. Carry water bottles in hands for added loading.",
          targetReps: 12
        },
        {
          id: "ex-chair-stepups",
          name: "Chair / Sturdy Step-Ups",
          equipment: "Sturdy Chair or Step",
          sets: 3,
          reps: "10 reps / leg",
          restSec: 75,
          cue: "Plant entire foot on chair. Drive up through lead heel without bouncing off the back foot.",
          targetReps: 10
        },
        {
          id: "ex-backpack-rdl",
          name: "Romanian Deadlifts with Backpack",
          equipment: "Loaded Backpack",
          sets: 4,
          reps: "12 reps",
          restSec: 90,
          cue: "Soft knee bend, push hips far behind until deep hamstring stretch, flat spine, squeeze glutes at top.",
          targetReps: 12
        },
        {
          id: "ex-core-plank",
          name: "Rigid Core Plank",
          equipment: "Floor Mat",
          sets: 3,
          reps: "45-60s hold",
          restSec: 60,
          cue: "Elbows under shoulders, squeeze glutes and quads tight, pull belly button inward toward spine.",
          targetReps: 60
        },
        {
          id: "ex-lying-leg-raises",
          name: "Lying Leg Raises",
          equipment: "Floor",
          sets: 3,
          reps: "12-15 reps",
          restSec: 60,
          cue: "Lower back pressed firmly into floor. Raise legs smoothly to 90°, lower with control without arching lower back.",
          targetReps: 15
        }
      ]
    },

    6: { // Saturday
      dayName: "Saturday",
      focus: "Arm Specialization & College Sport",
      muscleGroups: "Direct Biceps, Triceps Long Head, Forearms & Grip + Aerobic Sport",
      estTime: "40 min + Evening Sport",
      exercises: [
        {
          id: "ex-diamond-pushups",
          name: "Diamond Push-Ups",
          equipment: "Floor",
          sets: 3,
          reps: "8-12 reps",
          restSec: 75,
          cue: "Hands touch forming a diamond under chest. Keeps load heavily concentrated on triceps medial and lateral heads.",
          targetReps: 12
        },
        {
          id: "ex-arm-superset",
          name: "Backpack Curls Superset with Chair Dips",
          equipment: "Loaded Backpack + Chair",
          sets: 3,
          reps: "10 reps each",
          restSec: 90,
          cue: "Perform 10 curls immediately followed by 10 chair dips with zero rest. Massive arm pump.",
          targetReps: 10
        },
        {
          id: "ex-forearm-hang",
          name: "Towel Grip Hang or Water Bottle Forearm Hold",
          equipment: "Towel / Water Bottles",
          sets: 3,
          reps: "30-45s hold",
          restSec: 60,
          cue: "Grip thick rolled towel or pinch-grip water bottles to build thick wrists and powerful grip strength.",
          targetReps: 45
        },
        {
          id: "ex-college-sport",
          name: "Volleyball / Badminton Match Play (17:00)",
          equipment: "Court",
          sets: 1,
          reps: "60-90 min",
          restSec: 0,
          cue: "Fun competitive sports session with friends for athleticism and conditioning.",
          targetReps: 1
        }
      ]
    },

    0: { // Sunday
      dayName: "Sunday",
      focus: "Growth, Body Weigh-In & Meal Prep",
      muscleGroups: "Rest, recovery, weekly weigh-in, grocery preparation",
      estTime: "20 min",
      exercises: [
        {
          id: "ex-weighin",
          name: "Weekly Morning Weigh-In & Record",
          equipment: "Bathroom Scale",
          sets: 1,
          reps: "1 log",
          restSec: 0,
          cue: "Weigh in right after waking up and using the toilet, before water or food. Enter weight in app. Target: +0.25 to 0.5 kg gain/week.",
          targetReps: 1
        },
        {
          id: "ex-mealprep",
          name: "Meal Prep & Grocery Check",
          equipment: "Kitchen",
          sets: 1,
          reps: "20 min",
          restSec: 0,
          cue: "Boil 10 eggs for Mon-Tue, check stock of soya chunks, milk, peanut butter, and bananas using the in-app Grocery list.",
          targetReps: 1
        }
      ]
    }
  };

  // ==========================================================================
  // 3. DATA DEFINITIONS: DEFAULT ROUTINE TEMPLATE
  // ==========================================================================
  const DEFAULT_ROUTINE_TEMPLATE = [
    { id: 'task-wake', title: 'Wake up + drink 500 ml water', timeOfDay: 'morning', targetTime: '06:00', isCore: true, days: [0, 1, 2, 3, 4, 5, 6] },
    { id: 'task-warmup', title: 'Warm-up (5 min)', timeOfDay: 'morning', targetTime: '06:10', isCore: true, days: [0, 1, 2, 3, 4, 5, 6], action: 'workout' },
    { id: 'task-workout', title: 'Workout (45 min)', timeOfDay: 'morning', targetTime: '06:15', isCore: true, days: [0, 1, 2, 3, 4, 5, 6], action: 'workout' },
    { id: 'task-cooldown', title: 'Cool-down stretch + shower', timeOfDay: 'morning', targetTime: '07:05', isCore: false, days: [0, 1, 2, 3, 4, 5, 6], action: 'workout' },
    { id: 'task-cook-bf', title: 'Cook breakfast', timeOfDay: 'morning', targetTime: '07:30', isCore: false, days: [0, 1, 2, 3, 4, 5, 6], action: 'meals' },
    { id: 'task-eat-bf', title: 'Eat breakfast', timeOfDay: 'morning', targetTime: '08:00', isCore: true, days: [0, 1, 2, 3, 4, 5, 6], action: 'meals' },
    { id: 'task-prep-col', title: 'Get ready for college, pack water bottle', timeOfDay: 'morning', targetTime: '08:30', isCore: false, days: [0, 1, 2, 3, 4, 5, 6], collegeOnly: true },
    { id: 'task-prep-wknd', title: 'Weekend morning prep & review', timeOfDay: 'morning', targetTime: '08:30', isCore: false, days: [0, 1, 2, 3, 4, 5, 6], nonCollegeOnly: true },

    // Lunch (on Non-College days):
    { id: 'task-eat-lunch', title: 'Eat lunch (Rice/Roti, Dal, Sabzi, Curd + 2 Eggs)', timeOfDay: 'afternoon', targetTime: '13:00', isCore: true, days: [0, 1, 2, 3, 4, 5, 6], nonCollegeOnly: true, action: 'meals' },

    // Weekend afternoon project / prep:
    { id: 'task-sat-project', title: 'Deep project / coding block (3 hrs)', timeOfDay: 'afternoon', targetTime: '14:00', isCore: false, days: [6], nonCollegeOnly: true },
    { id: 'task-sun-prep', title: 'Sunday meal prep (boil 10 eggs, check groceries) & room reset', timeOfDay: 'afternoon', targetTime: '14:00', isCore: false, days: [0], nonCollegeOnly: true },

    // Post-College Shake:
    { id: 'task-shake', title: 'Post-college muscle shake', timeOfDay: 'afternoon', targetTime: '16:30', isCore: true, days: [0, 1, 2, 3, 4, 5, 6], collegeOnly: true, action: 'meals' },

    // Evening:
    { id: 'task-sport-wed', title: 'Volleyball / badminton with friends', timeOfDay: 'evening', targetTime: '17:15', isCore: false, days: [3] },
    { id: 'task-sport-sat', title: 'Volleyball / badminton match', timeOfDay: 'evening', targetTime: '17:00', isCore: false, days: [6], nonCollegeOnly: true },
    { id: 'task-study', title: 'Study / coding block (90 min)', timeOfDay: 'evening', targetTime: '17:15', isCore: false, days: [0, 1, 2, 4, 5] },
    { id: 'task-cook-dinner', title: 'Cook dinner', timeOfDay: 'evening', targetTime: '19:00', isCore: false, days: [0, 1, 2, 3, 4, 5, 6], action: 'meals' },
    { id: 'task-eat-dinner', title: 'Eat dinner', timeOfDay: 'evening', targetTime: '19:45', isCore: true, days: [0, 1, 2, 3, 4, 5, 6], action: 'meals' },
    { id: 'task-project-night', title: 'Project work (90 min)', timeOfDay: 'evening', targetTime: '20:30', isCore: false, days: [0, 1, 2, 3, 4, 5, 6] },
    { id: 'task-prep-night', title: 'Prep tomorrow: boil eggs, soak soya chunks, plan day', timeOfDay: 'evening', targetTime: '22:00', isCore: false, days: [0, 1, 2, 3, 4, 5, 6] },
    { id: 'task-bedtime-snack', title: 'Warm milk + roasted peanuts', timeOfDay: 'evening', targetTime: '23:15', isCore: false, days: [0, 1, 2, 3, 4, 5, 6], action: 'meals' },
    { id: 'task-winddown', title: 'Wind-down, phone away', timeOfDay: 'evening', targetTime: '23:30', isCore: false, days: [0, 1, 2, 3, 4, 5, 6] },
    { id: 'task-sleep', title: 'In bed (6 hrs sleep)', timeOfDay: 'evening', targetTime: '00:00', isCore: true, days: [0, 1, 2, 3, 4, 5, 6] }
  ];

  // Weekly Shopping List Categories
  const GROCERY_CATEGORIES = [
    {
      name: "Eggs & Dairy",
      items: [
        { id: "g-eggs", label: "Eggs: 32–36 eggs (approx. 4–5 eggs/day for breakfasts, curries, snacks)" },
        { id: "g-milk", label: "Full-Cream Milk: 7 Litres (1L/day for shakes, oatmeal & bedtime drink)" },
        { id: "g-curd", label: "Curd / Dahi: 1.5 kg (daily probiotic lunch & dinner side)" },
        { id: "g-ghee", label: "Desi Ghee: 250 g (for brushing rotis and seasoning dals)" }
      ]
    },
    {
      name: "High-Protein Staples & Nuts",
      items: [
        { id: "g-soya", label: "Soya Chunks (Nutrela): 500 g pack (50–60g per soya dinner)" },
        { id: "g-pb", label: "Peanut Butter: 500 g jar (1–2 tbsp in daily shakes & snacks)" },
        { id: "g-peanuts", label: "Roasted Peanuts: 500 g (30g nightly with bedtime milk)" },
        { id: "g-rajma", label: "Rajma (Red Kidney Beans): 500 g (Thursday feast)" },
        { id: "g-dal", label: "Toor / Moong / Chana Dal: 1 kg (daily dal tadka)" }
      ]
    },
    {
      name: "Grains & Carbs",
      items: [
        { id: "g-atta", label: "Chakki Fresh Atta: 3 kg (for daily rotis and parathas)" },
        { id: "g-rice", label: "Basmati / Regular Rice: 2 kg" },
        { id: "g-oats", label: "Rolled Oats: 500 g (for morning porridge & blended shakes)" },
        { id: "g-bread", label: "Whole Wheat Bread: 1 loaf (Friday breakfast)" },
        { id: "g-potatoes", label: "Potatoes (Aloo): 1 kg (for parathas & sabzi)" }
      ]
    },
    {
      name: "Fresh Fruits & Vegetables",
      items: [
        { id: "g-bananas", label: "Bananas: 2 to 3 Dozen (20–24 bananas for daily shakes & snacks)" },
        { id: "g-onions", label: "Onions: 2 kg (gravy base for curries & bhurji)" },
        { id: "g-tomatoes", label: "Tomatoes: 2 kg" },
        { id: "g-chillies", label: "Ginger, Garlic & Green Chillies: 250 g each" },
        { id: "g-veggies", label: "Seasonal Mixed Sabzi (Carrots, Beans, Peas, Gobi): 1.5 kg" }
      ]
    },
    {
      name: "Cooking Essentials & Spices",
      items: [
        { id: "g-oil", label: "Mustard or Sunflower Cooking Oil: 500 ml" },
        { id: "g-spices", label: "Salt, Turmeric, Red Chilli, Garam Masala, Cumin Seeds, Chaat Masala" }
      ]
    }
  ];

  const QUOTES = [
    "Consistency is the DNA of mastery.",
    "Small daily improvements lead to stunning long-term results.",
    "Every action you take is a vote for the person you wish to become.",
    "Discipline equals freedom.",
    "Muscle is built by relentless daily routine, not sporadic motivation.",
    "The secret of your future is hidden in your daily checklist."
  ];

  const STORAGE_KEY = 'routine_tablet_v3_state';
  const RING_CIRCUMFERENCE = 452.39; // 2 * Math.PI * 72

  // ==========================================================================
  // 4. APPLICATION STATE
  // ==========================================================================
  let state = {
    version: 3,
    lastActiveDate: null,
    currentStreak: 0,
    bestStreak: 0,
    isRestDay: false,
    manualNightMode: false,
    collegeToday: null, // boolean, initialized dynamically based on weekday
    celebrationTriggeredToday: false,
    settings: {
      threshold: 1.0,
      streakCoreOnly: true,
      rolloverHour: 4, // 04:00 AM
      pullupBar: false,
      collegeScheduleAuto: true,
      soundEnabled: true,
      clock24h: false,
      nightModeAuto: true,
      nightStartHour: 22,
      nightEndHour: 6,
      burnInProtection: true
    },
    template: [...DEFAULT_ROUTINE_TEMPLATE],
    todayTasks: [],
    history: {},
    workoutLogs: {}, // { [dateStr]: { [exerciseId]: { sets: [{ setNum, weight, reps, done }] } } }
    weightLogs: [
      { date: "2026-11-01", weight: 71.2, note: "Baseline" },
      { date: "2026-11-08", weight: 71.6, note: "+0.4 kg" },
      { date: "2026-11-15", weight: 72.0, note: "+0.4 kg on track" }
    ],
    shoppingChecked: {},
    mealsCooked: {} // { [dateStr]: { [mealKey]: boolean } }
  };

  let activeFilter = 'all';
  let activeWorkoutDay = 1; // 1 = Mon
  let activeMealsDay = 1;
  let nextTaskId = null;
  let wakeLockSentinel = null;
  let audioCtx = null;
  let restTimerInterval = null;
  let restSecondsRemaining = 0;

  // ==========================================================================
  // 5. UTILITY & DATE ROLLOVER (04:00 AM CUT-OFF)
  // ==========================================================================
  function getLogicalDate(d = new Date(), rolloverHour = null) {
    const rh = rolloverHour !== null ? rolloverHour : (state.settings.rolloverHour ?? 4);
    const adjusted = new Date(d);
    if (adjusted.getHours() < rh) {
      adjusted.setDate(adjusted.getDate() - 1);
    }
    const year = adjusted.getFullYear();
    const month = String(adjusted.getMonth() + 1).padStart(2, '0');
    const day = String(adjusted.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function getDayOfWeekForDate(dateStr) {
    const parts = dateStr.split('-');
    const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    return d.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  }

  function addDays(dateStr, numDays) {
    const parts = dateStr.split('-');
    const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    d.setDate(d.getDate() + numDays);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function formatTimeDisplay(timeStr, clock24h = false) {
    if (!timeStr) return '';
    const parts = timeStr.split(':');
    if (parts.length < 2) return timeStr;
    let h = parseInt(parts[0], 10);
    const m = parts[1];
    if (clock24h) {
      return `${String(h).padStart(2, '0')}:${m}`;
    }
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    return `${String(h).padStart(2, '0')}:${m} ${ampm}`;
  }

  function isTimePassed(targetTimeStr) {
    if (!targetTimeStr) return false;
    const now = new Date();
    const parts = targetTimeStr.split(':');
    if (parts.length < 2) return false;
    let targetH = parseInt(parts[0], 10);
    const targetM = parseInt(parts[1], 10);

    // If target hour is between 00:00 and 03:59, it's late night
    const rh = state.settings.rolloverHour ?? 4;
    let targetMin = targetH * 60 + targetM;
    if (targetH < rh) {
      targetMin += 24 * 60;
    }

    let curH = now.getHours();
    const curM = now.getMinutes();
    let curMin = curH * 60 + curM;
    if (curH < rh) {
      curMin += 24 * 60;
    }

    return curMin > targetMin;
  }

  function getTaskSortWeight(targetTime) {
    if (!targetTime) return 9999;
    const parts = targetTime.split(':');
    let h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const rh = state.settings.rolloverHour ?? 4;
    if (h < rh) {
      h += 24;
    }
    return h * 60 + m;
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        state = {
          ...state,
          ...parsed,
          settings: { ...state.settings, ...(parsed.settings || {}) }
        };
      }
    } catch (e) {
      console.error('Failed to load state:', e);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state:', e);
    }
  }

  // ==========================================================================
  // 6. AUDIO FEEDBACK (WEB AUDIO API)
  // ==========================================================================
  function initAudio() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playSound(type) {
    if (!state.settings.soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const now = audioCtx.currentTime;

      if (type === 'check') {
        const freqs = [587.33, 880.0, 1174.66]; // D5 -> A5 -> D6
        freqs.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.045);
          gain.gain.setValueAtTime(0, now + idx * 0.045);
          gain.gain.linearRampToValueAtTime(0.14, now + idx * 0.045 + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.045 + 0.32);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now + idx * 0.045);
          osc.stop(now + idx * 0.045 + 0.35);
        });
      } else if (type === 'uncheck') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(260, now + 0.12);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.14);
      } else if (type === 'complete') {
        const chord = [523.25, 659.25, 783.99, 1046.50]; // C Major
        chord.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.07);
          gain.gain.setValueAtTime(0, now + idx * 0.07);
          gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.07 + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.6);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now + idx * 0.07);
          osc.stop(now + idx * 0.07 + 0.65);
        });
      } else if (type === 'timer') {
        // High energetic double beep when rest timer finishes
        [880, 1174.66].forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, now + idx * 0.12);
          gain.gain.setValueAtTime(0, now + idx * 0.12);
          gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.12 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.1);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now + idx * 0.12);
          osc.stop(now + idx * 0.12 + 0.12);
        });
      }
    } catch (err) {
      console.warn('Audio error:', err);
    }
  }

  // ==========================================================================
  // 7. TASK GENERATION & SCHEDULE (COLLEGE VS NON-COLLEGE)
  // ==========================================================================
  function generateTodayTasks(dateStr, isCollege) {
    const dayOfWeek = getDayOfWeekForDate(dateStr);

    return state.template
      .filter(t => {
        // College vs non-college checks
        if (isCollege && t.nonCollegeOnly) return false;
        if (!isCollege && t.collegeOnly) return false;

        // Repeat days check
        if (t.days && !t.days.includes(dayOfWeek)) return false;

        return true;
      })
      .sort((a, b) => getTaskSortWeight(a.targetTime) - getTaskSortWeight(b.targetTime))
      .map(t => ({
        id: t.id,
        title: t.title,
        timeOfDay: t.timeOfDay,
        targetTime: t.targetTime || '',
        isCore: t.isCore ?? true,
        action: t.action || null,
        done: false,
        completedAt: null
      }));
  }

  function checkDateAndRollover() {
    const logicalToday = getLogicalDate();
    const dayOfWeek = getDayOfWeekForDate(logicalToday);

    // Initialize collegeToday if null
    if (state.collegeToday === null) {
      state.collegeToday = (dayOfWeek >= 1 && dayOfWeek <= 5); // Mon-Fri default ON
    }

    if (!state.lastActiveDate) {
      state.lastActiveDate = logicalToday;
      state.todayTasks = generateTodayTasks(logicalToday, state.collegeToday);
      saveState();
      renderAll();
      return;
    }

    if (logicalToday > state.lastActiveDate) {
      performRollover(state.lastActiveDate, logicalToday);
    }
  }

  function performRollover(prevDateStr, todayStr) {
    // 1. Evaluate success of previous logical day
    const prevDone = state.todayTasks.filter(t => t.done).length;
    const prevTotal = state.todayTasks.length;
    const prevCoreTasks = state.todayTasks.filter(t => t.isCore);
    const prevCoreDone = prevCoreTasks.filter(t => t.done).length;

    let daySucceeded = false;
    let prevStatus = 'missed';

    if (state.isRestDay) {
      prevStatus = 'rest';
      daySucceeded = true; // streak preserved
    } else if (state.settings.streakCoreOnly) {
      daySucceeded = prevCoreTasks.length > 0 && (prevCoreDone === prevCoreTasks.length);
      prevStatus = daySucceeded ? 'completed' : (prevDone > 0 ? 'partial' : 'missed');
    } else {
      const rate = prevTotal > 0 ? (prevDone / prevTotal) : 1;
      daySucceeded = rate >= state.settings.threshold;
      prevStatus = daySucceeded ? 'completed' : (prevDone > 0 ? 'partial' : 'missed');
    }

    if (daySucceeded) {
      state.currentStreak += 1;
      state.bestStreak = Math.max(state.bestStreak, state.currentStreak);
    } else {
      state.currentStreak = 0;
    }

    state.history[prevDateStr] = {
      date: prevDateStr,
      doneCount: prevDone,
      totalCount: prevTotal,
      coreDone: prevCoreDone,
      coreTotal: prevCoreTasks.length,
      status: prevStatus,
      isRestDay: state.isRestDay,
      tasks: [...state.todayTasks]
    };

    // Auto-backup to localStorage
    try {
      localStorage.setItem(`routine_backup_${prevDateStr}`, JSON.stringify(state));
    } catch (e) {
      console.warn('Backup error:', e);
    }

    // Fill intermediate missed days if tablet was powered off for several days
    let cursor = addDays(prevDateStr, 1);
    while (cursor < todayStr) {
      if (!state.history[cursor]) {
        state.history[cursor] = {
          date: cursor,
          doneCount: 0,
          totalCount: 0,
          status: 'missed',
          isRestDay: false,
          tasks: []
        };
        state.currentStreak = 0;
      }
      cursor = addDays(cursor, 1);
    }

    // Setup new today
    const newDayOfWeek = getDayOfWeekForDate(todayStr);
    state.collegeToday = (newDayOfWeek >= 1 && newDayOfWeek <= 5);
    state.todayTasks = generateTodayTasks(todayStr, state.collegeToday);
    state.isRestDay = false;
    state.celebrationTriggeredToday = false;
    state.lastActiveDate = todayStr;
    saveState();

    renderAll();
  }

  // ==========================================================================
  // 8. SCREEN WAKELOCK & BURN-IN PROTECTION
  // ==========================================================================
  async function requestWakeLock() {
    if ('wakeLock' in navigator) {
      try {
        wakeLockSentinel = await navigator.wakeLock.request('screen');
        updateWakeLockUI(true);
        wakeLockSentinel.addEventListener('release', () => {
          updateWakeLockUI(false);
          wakeLockSentinel = null;
        });
      } catch (err) {
        console.warn('WakeLock error:', err.message);
        updateWakeLockUI(false);
      }
    } else {
      updateWakeLockUI(false);
    }
  }

  function updateWakeLockUI(isActive) {
    const dot = document.getElementById('wakelock-dot');
    if (!dot) return;
    dot.className = isActive ? 'dock-dot' : 'dock-dot dot-inactive';
  }

  function applyPixelShift() {
    if (!state.settings.burnInProtection) return;
    const root = document.getElementById('app-root');
    if (!root) return;
    const dx = Math.floor(Math.random() * 5) - 2;
    const dy = Math.floor(Math.random() * 5) - 2;
    root.style.transform = `translate(${dx}px, ${dy}px)`;
  }

  function updateNightMode() {
    const body = document.body;
    let shouldBeNight = state.manualNightMode;

    if (state.settings.nightModeAuto && !state.manualNightMode) {
      const currentHour = new Date().getHours();
      const start = state.settings.nightStartHour;
      const end = state.settings.nightEndHour;
      if (start > end) {
        if (currentHour >= start || currentHour < end) shouldBeNight = true;
      } else {
        if (currentHour >= start && currentHour < end) shouldBeNight = true;
      }
    }

    if (shouldBeNight) {
      body.classList.add('night-mode');
    } else {
      body.classList.remove('night-mode');
    }
  }

  // ==========================================================================
  // 9. CLOCK, GREETING & MOTIVATIONAL QUOTE
  // ==========================================================================
  function updateClock() {
    const now = new Date();
    const clockEl = document.getElementById('digital-clock');
    const ampmEl = document.getElementById('clock-ampm');
    const dateEl = document.getElementById('date-display');
    const greetTextEl = document.getElementById('greeting-text');

    if (!clockEl || !ampmEl || !dateEl) return;

    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');

    if (state.settings.clock24h) {
      clockEl.textContent = `${String(hours).padStart(2, '0')}:${minutes}`;
      ampmEl.textContent = '';
      ampmEl.style.display = 'none';
    } else {
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      clockEl.textContent = `${String(hours).padStart(2, '0')}:${minutes}`;
      ampmEl.textContent = ampm;
      ampmEl.style.display = 'inline';
    }

    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    dateEl.textContent = now.toLocaleDateString('en-US', options);

    const hour24 = now.getHours();
    let greeting = 'Good morning, Kishan';
    if (hour24 >= 5 && hour24 < 12) greeting = 'Good morning, Kishan';
    else if (hour24 >= 12 && hour24 < 17) greeting = 'Good afternoon, Kishan';
    else if (hour24 >= 17 && hour24 < 22) greeting = 'Good evening, Kishan';
    else greeting = 'Night routine, Kishan';

    greetTextEl.textContent = greeting;
  }

  function updateMotivationalQuote() {
    const quoteEl = document.getElementById('quote-text');
    if (!quoteEl) return;
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    quoteEl.textContent = `"${QUOTES[dayOfYear % QUOTES.length]}"`;
  }

  // ==========================================================================
  // 10. 7-DAY HISTORY STRIP (MON - SUN)
  // ==========================================================================
  function renderWeekStrip() {
    const strip = document.getElementById('week-strip');
    const restBadge = document.getElementById('rest-badge-pill');
    if (!strip) return;

    strip.innerHTML = '';
    restBadge.style.display = state.isRestDay ? 'inline-block' : 'none';

    const logicalTodayStr = getLogicalDate();
    const logicalToday = new Date(logicalTodayStr + 'T00:00:00');
    const currentDayOfWeek = logicalToday.getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat
    const mondayIndex = (currentDayOfWeek + 6) % 7;

    const dayLetters = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    for (let i = 0; i < 7; i++) {
      const dayOffset = i - mondayIndex;
      const targetDate = new Date(logicalToday);
      targetDate.setDate(logicalToday.getDate() + dayOffset);
      const dateStr = getLogicalDate(targetDate, 0); // exact calendar date string

      const col = document.createElement('div');
      col.className = `week-day-col ${i === mondayIndex ? 'is-today' : ''}`;

      let circleClass = 'day-missed';

      if (i === mondayIndex) {
        // Today
        const coreTasks = state.todayTasks.filter(t => t.isCore);
        const coreDone = coreTasks.filter(t => t.done).length;
        const allDone = state.todayTasks.length > 0 && state.todayTasks.every(t => t.done);

        if (state.isRestDay) {
          circleClass = 'day-rest';
        } else if (state.settings.streakCoreOnly && coreTasks.length > 0 && coreDone === coreTasks.length) {
          circleClass = 'day-full';
        } else if (allDone) {
          circleClass = 'day-full';
        } else {
          circleClass = 'day-today-outline';
        }
      } else if (i < mondayIndex) {
        // Past day in current week
        const record = state.history[dateStr];
        if (record) {
          if (record.status === 'completed') circleClass = 'day-full';
          else if (record.status === 'partial') circleClass = 'day-partial';
          else if (record.status === 'rest') circleClass = 'day-rest';
          else circleClass = 'day-missed';
        } else {
          circleClass = 'day-missed';
        }
      } else {
        // Future day
        circleClass = 'day-missed';
      }

      col.innerHTML = `
        <span class="week-day-label">${dayLetters[i]}</span>
        <div class="week-circle ${circleClass}"></div>
      `;

      strip.appendChild(col);
    }
  }

  // ==========================================================================
  // 11. TODAY VIEW & TASK RENDERING
  // ==========================================================================
  function renderAll() {
    updateClock();
    updateNightMode();
    renderHeroSection();
    renderWeekStrip();
    renderTasks();
    renderTemplateList();
    updateCollegeToggleBtn();
  }

  function updateCollegeToggleBtn() {
    const btn = document.getElementById('btn-toggle-college');
    const label = document.getElementById('college-toggle-label');
    if (!btn || !label) return;

    if (state.collegeToday) {
      btn.className = 'college-toggle-btn active';
      label.textContent = 'College Today: ON';
    } else {
      btn.className = 'college-toggle-btn';
      label.textContent = 'College Today: OFF';
    }
  }

  function renderHeroSection() {
    const total = state.todayTasks.length;
    const done = state.todayTasks.filter(t => t.done).length;
    const coreTasks = state.todayTasks.filter(t => t.isCore);
    const coreDone = coreTasks.filter(t => t.done).length;

    // Use core tasks for ring if streakCoreOnly is active
    const ringTotal = state.settings.streakCoreOnly ? coreTasks.length : total;
    const ringDone = state.settings.streakCoreOnly ? coreDone : done;
    const percent = ringTotal > 0 ? Math.round((ringDone / ringTotal) * 100) : 100;

    // 1. Progress Ring
    const ringBar = document.getElementById('progress-ring-bar');
    const ringPercent = document.getElementById('ring-percent');
    const ringFraction = document.getElementById('ring-fraction');

    if (ringBar && ringPercent && ringFraction) {
      const offset = RING_CIRCUMFERENCE - (percent / 100) * RING_CIRCUMFERENCE;
      ringBar.style.strokeDashoffset = offset;
      ringPercent.textContent = `${percent}%`;
      ringFraction.textContent = state.settings.streakCoreOnly
        ? `${ringDone} of ${ringTotal} core done`
        : `${done} of ${total} done`;
    }

    // 2. Hero Streak
    const streakCountEl = document.getElementById('current-streak-val');
    const bestStreakEl = document.getElementById('best-streak-tag');
    const streakCard = document.getElementById('streak-card');
    const streakHint = document.getElementById('streak-status-hint');

    streakCountEl.textContent = state.currentStreak;
    bestStreakEl.textContent = `Best: ${state.bestStreak}d`;

    const daySucceeded = state.settings.streakCoreOnly
      ? (coreTasks.length > 0 && coreDone === coreTasks.length)
      : (total > 0 && done >= total);

    if (state.isRestDay) {
      streakCard.classList.remove('streak-completed-today');
      streakHint.textContent = 'Rest Day (Preserved)';
    } else if (daySucceeded) {
      streakCard.classList.add('streak-completed-today');
      streakHint.textContent = 'Streak locked for tomorrow!';
    } else {
      streakCard.classList.remove('streak-completed-today');
      const left = state.settings.streakCoreOnly ? (coreTasks.length - coreDone) : (total - done);
      streakHint.textContent = `${left} ${state.settings.streakCoreOnly ? 'core ' : ''}left today`;
    }
  }

  function getDishSubtitleForTask(task, dayOfWeek) {
    const meals = WEEKLY_MEALS[dayOfWeek] || WEEKLY_MEALS[1];
    if (task.id === 'task-eat-bf' || task.title.toLowerCase().includes('breakfast')) {
      return meals.breakfast.title;
    }
    if (task.id === 'task-shake' || task.title.toLowerCase().includes('shake')) {
      return meals.shake.title;
    }
    if (task.id === 'task-eat-lunch' || task.title.toLowerCase().includes('lunch')) {
      return meals.lunchNonCollege.title;
    }
    if (task.id === 'task-eat-dinner' || task.title.toLowerCase().includes('dinner')) {
      return meals.dinner.title;
    }
    if (task.id === 'task-bedtime-snack' || task.title.toLowerCase().includes('peanuts')) {
      return meals.bedtime.title;
    }
    if (task.id === 'task-workout' || task.title.toLowerCase().includes('workout')) {
      const prog = WORKOUT_PROGRAM[dayOfWeek] || WORKOUT_PROGRAM[1];
      return `${prog.dayName}: ${prog.focus}`;
    }
    return '';
  }

  function renderTasks() {
    const grid = document.getElementById('task-grid');
    const filterBadge = document.getElementById('active-filter-badge');
    const upnextCard = document.getElementById('upnext-card');
    const upnextLabel = document.getElementById('upnext-label');
    const upnextTime = document.getElementById('upnext-time');
    const upnextTitle = document.getElementById('upnext-title');
    const upnextBtn = document.getElementById('btn-upnext-done');

    if (!grid) return;

    const logicalTodayStr = getLogicalDate();
    const dayOfWeek = getDayOfWeekForDate(logicalTodayStr);

    // Filter tasks
    const filteredTasks = state.todayTasks.filter(t => {
      if (activeFilter === 'all') return true;
      return t.timeOfDay === activeFilter;
    });

    filterBadge.textContent = `${filteredTasks.length} tasks`;

    // 1. Identify "UP NEXT" Task (First unfinished task)
    const unfinishedTask = filteredTasks.find(t => !t.done) || state.todayTasks.find(t => !t.done);
    const allDone = state.todayTasks.length > 0 && state.todayTasks.every(t => t.done);

    if (allDone) {
      nextTaskId = null;
      upnextCard.className = 'upnext-card all-done-card';
      upnextLabel.textContent = 'ALL COMPLETED';
      upnextTime.textContent = 'Today';
      upnextTitle.textContent = 'All daily tasks completed. Fantastic dedication!';
      upnextBtn.style.display = 'none';

      if (!state.celebrationTriggeredToday) {
        state.celebrationTriggeredToday = true;
        saveState();
        playSound('complete');
      }
    } else if (unfinishedTask) {
      nextTaskId = unfinishedTask.id;
      upnextCard.className = 'upnext-card';
      upnextBtn.style.display = 'inline-flex';

      const overdue = isTimePassed(unfinishedTask.targetTime);
      upnextLabel.textContent = overdue ? 'OVERDUE' : 'UP NEXT';
      upnextTime.textContent = formatTimeDisplay(unfinishedTask.targetTime, state.settings.clock24h) || 'Today';
      upnextTitle.textContent = unfinishedTask.title;
    } else {
      nextTaskId = null;
      upnextCard.className = 'upnext-card';
      upnextLabel.textContent = 'ROUTINE';
      upnextTime.textContent = '';
      upnextTitle.textContent = 'No tasks in this filter';
      upnextBtn.style.display = 'none';
    }

    // 2. Render stretching task grid
    grid.innerHTML = '';

    if (filteredTasks.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; display:flex; align-items:center; justify-content:center; color: var(--text-tertiary); font-size: 20px;">
          No routine tasks scheduled in this section.
        </div>
      `;
      return;
    }

    let collegeBandInserted = false;

    filteredTasks.forEach(task => {
      // If college day and we are in afternoon / post-college or time >= 09:00, insert college band once
      if (state.collegeToday && !collegeBandInserted && activeFilter === 'all') {
        const taskWeight = getTaskSortWeight(task.targetTime);
        if (taskWeight >= (9 * 60)) {
          collegeBandInserted = true;
          const band = document.createElement('div');
          band.className = 'college-band-card';
          band.innerHTML = `
            <div class="band-left">
              <div class="band-icon-wrap">
                <svg class="icon-svg" viewBox="0 0 24 24">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                </svg>
              </div>
              <div class="band-text-stack">
                <div class="band-title-row">
                  <span class="band-title">College Hours</span>
                  <span class="band-badge">SCHEDULED BLOCK</span>
                </div>
                <span class="band-desc">Class lectures, lab work, library study • Non-tickable block</span>
              </div>
            </div>
            <div class="band-right-time">
              <span>09:00 AM – 04:00 PM</span>
            </div>
          `;
          grid.appendChild(band);
        }
      }

      const card = document.createElement('div');
      card.className = `task-card ${task.done ? 'task-done' : ''}`;
      card.setAttribute('role', 'checkbox');
      card.setAttribute('aria-checked', task.done ? 'true' : 'false');
      card.setAttribute('tabindex', '0');

      const checkSvg = `
        <div class="checkbox-circle">
          <svg viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
      `;

      const overdue = (!task.done && isTimePassed(task.targetTime));
      const overdueDot = overdue ? '<span class="overdue-dot" title="Overdue"></span>' : '';
      const formattedTime = formatTimeDisplay(task.targetTime, state.settings.clock24h);
      const dishSubtitle = getDishSubtitleForTask(task, dayOfWeek);
      const coreBadge = task.isCore
        ? '<span class="badge-core">CORE</span>'
        : '<span class="badge-bonus">BONUS</span>';

      card.innerHTML = `
        <div class="card-left-section">
          ${checkSvg}
          <div class="card-title-stack">
            <div class="eyebrow-row">
              <span class="section-eyebrow">${task.timeOfDay}</span>
              ${coreBadge}
            </div>
            <span class="task-title-text">${escapeHtml(task.title)}</span>
            ${dishSubtitle ? `<span class="card-dish-subtitle">${escapeHtml(dishSubtitle)}</span>` : ''}
          </div>
        </div>
        <div class="card-time-badge">
          ${overdueDot}
          <span>${formattedTime}</span>
        </div>
      `;

      // Tap card: toggle or open modal if subtitle tapped
      card.addEventListener('click', (e) => {
        // If user tapped subtitle or action is specified and not checked, open that modal
        if (task.action === 'workout' && e.target.closest('.card-dish-subtitle')) {
          openWorkoutModal(dayOfWeek);
          return;
        }
        if (task.action === 'meals' && e.target.closest('.card-dish-subtitle')) {
          openMealsModal(dayOfWeek);
          return;
        }
        toggleTask(task.id);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          toggleTask(task.id);
        }
      });

      grid.appendChild(card);
    });
  }

  function toggleTask(taskId) {
    const task = state.todayTasks.find(t => t.id === taskId);
    if (!task) return;

    task.done = !task.done;
    task.completedAt = task.done ? new Date().toISOString() : null;

    if (task.done) {
      playSound('check');
      const coreTasks = state.todayTasks.filter(t => t.isCore);
      const allCoreDone = coreTasks.length > 0 && coreTasks.every(t => t.done);
      if (allCoreDone && !state.celebrationTriggeredToday) {
        state.celebrationTriggeredToday = true;
        setTimeout(() => {
          playSound('complete');
        }, 200);
      }
    } else {
      playSound('uncheck');
      state.celebrationTriggeredToday = false;
    }

    saveState();
    renderHeroSection();
    renderWeekStrip();
    renderTasks();
  }

  // ==========================================================================
  // 12. WORKOUT TRACKER MODAL & REST TIMER
  // ==========================================================================
  function openWorkoutModal(dayOfWeek = null) {
    if (dayOfWeek === null) {
      const logicalToday = getLogicalDate();
      dayOfWeek = getDayOfWeekForDate(logicalToday);
    }
    activeWorkoutDay = dayOfWeek;
    const modal = document.getElementById('workout-modal');
    modal.style.display = 'flex';
    renderWorkoutModal();
  }

  function closeWorkoutModal() {
    document.getElementById('workout-modal').style.display = 'none';
  }

  function renderWorkoutModal() {
    const dayPlan = WORKOUT_PROGRAM[activeWorkoutDay] || WORKOUT_PROGRAM[1];
    const container = document.getElementById('workout-content-area');
    const heading = document.getElementById('workout-day-heading');
    const subheading = document.getElementById('workout-day-subheading');

    heading.textContent = `${dayPlan.dayName}: ${dayPlan.focus}`;
    subheading.textContent = `Target Groups: ${dayPlan.muscleGroups} • Est. Time: ${dayPlan.estTime}`;

    // Update active tab pill
    document.querySelectorAll('#workout-day-pills .day-pill-btn').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.wday, 10) === activeWorkoutDay);
    });

    const logicalTodayStr = getLogicalDate();
    const todayLogs = state.workoutLogs[logicalTodayStr] || {};

    let html = `
      <div class="workout-layout">
        <!-- Left: Exercises & Interactive Set Loggers -->
        <div class="workout-exercises-col">
          <div class="section-divider">
            <span class="divider-title">EXERCISE WORKOUT (${dayPlan.exercises.length} Exercises)</span>
            <span class="divider-hint">Hit top of rep range to increase backpack weight</span>
          </div>
    `;

    dayPlan.exercises.forEach(ex => {
      let exerciseName = ex.name;
      if (state.settings.pullupBar && ex.swapIfPullup) {
        exerciseName = ex.swapIfPullup;
      }

      const exLog = todayLogs[ex.id] || { sets: [] };

      // Set bubbles
      let setBubblesHtml = '';
      for (let s = 1; s <= ex.sets; s++) {
        const logged = exLog.sets && exLog.sets[s - 1];
        const isDone = logged && logged.completed;
        const repText = logged ? `${logged.reps}r` : `Set ${s}`;
        setBubblesHtml += `
          <div class="set-bubble ${isDone ? 'set-completed' : ''}" data-exid="${ex.id}" data-setnum="${s}">
            <span class="set-label">Set ${s}</span>
            <span class="set-reps-val">${isDone ? `${logged.reps} reps` : '—'}</span>
          </div>
        `;
      }

      // Check progression banner
      const allSetsHitTop = exLog.sets && exLog.sets.length === ex.sets &&
        exLog.sets.every(st => st.reps >= ex.targetReps);

      html += `
        <div class="exercise-card" id="card-${ex.id}">
          <div class="exercise-head">
            <div class="exercise-title-stack">
              <span class="exercise-name">${escapeHtml(exerciseName)}</span>
              <span class="exercise-meta">${ex.sets} sets × ${ex.reps} • Rest: ${ex.restSec}s • Equipment: ${ex.equipment}</span>
            </div>
            <button class="btn-action btn-secondary btn-sm btn-start-rest" data-rest="${ex.restSec}" title="Start ${ex.restSec}s Rest Timer">
              <svg class="icon-svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span>${ex.restSec}s Rest</span>
            </button>
          </div>

          <div class="exercise-cue-box">
            <svg class="icon-svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            <p>${escapeHtml(ex.cue)}</p>
          </div>

          ${allSetsHitTop ? `
            <div class="progression-alert">
              <svg class="icon-svg" viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
              <span><strong>Progression Unlocked:</strong> You hit ${ex.targetReps} reps on all ${ex.sets} sets! Add +2 kg of books to your backpack next session.</span>
            </div>
          ` : ''}

          <!-- Set Steppers & Logger -->
          <div class="exercise-interactive-row">
            <div class="set-bubbles-group">
              ${setBubblesHtml}
            </div>

            <div class="set-logger-inputs">
              <div class="stepper-control">
                <span class="stepper-label">Reps:</span>
                <input type="number" class="stepper-num" id="input-reps-${ex.id}" value="${ex.targetReps || 12}" min="1" max="50">
              </div>
              <div class="stepper-control">
                <span class="stepper-label">Pack (kg):</span>
                <input type="number" class="stepper-num" id="input-wt-${ex.id}" value="0" min="0" max="40">
              </div>
              <button class="btn-log-set" data-exid="${ex.id}" data-totalsets="${ex.sets}" data-rest="${ex.restSec}">
                <svg class="icon-svg" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Log Set</span>
              </button>
            </div>
          </div>
        </div>
      `;
    });

    html += `
        </div>

        <!-- Right: 5-min Warm-Up & 5-min Cool-Down Stretches -->
        <div class="workout-sidebar-col">
          <!-- Warm Up -->
          <div class="routine-meta-card">
            <div class="card-head-compact">
              <span class="meta-card-title">5-MIN WARM-UP (PRE-WORKOUT)</span>
            </div>
            <div class="stretch-items-list">
              ${WORKOUT_WARMUP.map(w => `
                <div class="stretch-row">
                  <div class="stretch-text">
                    <span class="stretch-name">${w.name}</span>
                    <span class="stretch-cue">${w.cue}</span>
                  </div>
                  <span class="stretch-time-tag">${w.duration}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Cool Down -->
          <div class="routine-meta-card" style="margin-top: 16px;">
            <div class="card-head-compact">
              <span class="meta-card-title">5-MIN COOL-DOWN (POST-WORKOUT)</span>
            </div>
            <div class="stretch-items-list">
              ${WORKOUT_COOLDOWN.map(c => `
                <div class="stretch-row">
                  <div class="stretch-text">
                    <span class="stretch-name">${c.name}</span>
                    <span class="stretch-cue">${c.cue}</span>
                  </div>
                  <span class="stretch-time-tag">${c.duration}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Sunday Weigh-In Card -->
          <div class="weight-tracker-card" style="margin-top: 16px;">
            <div class="card-head-compact">
              <span class="meta-card-title">SUNDAY BODY WEIGHT TRACKER</span>
              <span class="badge-core">Target: 75 kg</span>
            </div>
            <p class="tracker-desc">Log your morning weigh-in after waking up. Aim for +0.25 to 0.5 kg gain/week.</p>
            <div class="weight-input-row">
              <input type="number" step="0.1" class="text-input num-compact" id="input-weight-log" placeholder="72.0" value="72.0">
              <span style="color:var(--text-secondary);font-size:15px;">kg</span>
              <button class="btn-action btn-teal btn-sm" id="btn-save-weight">Log Weight</button>
            </div>
            <div class="weight-history-list" id="weight-history-list">
              ${state.weightLogs.slice(-3).reverse().map(l => `
                <div class="weight-log-item">
                  <span class="log-date">${l.date}</span>
                  <span class="log-val">${l.weight} kg</span>
                  <span class="log-note">${l.note || ''}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;

    // Attach Log Set listeners
    container.querySelectorAll('.btn-log-set').forEach(btn => {
      btn.addEventListener('click', () => {
        const exId = btn.dataset.exid;
        const totalSets = parseInt(btn.dataset.totalsets, 10);
        const restSec = parseInt(btn.dataset.rest, 10) || 90;
        const reps = parseInt(document.getElementById(`input-reps-${exId}`).value, 10) || 10;
        const weight = parseFloat(document.getElementById(`input-wt-${exId}`).value) || 0;

        if (!state.workoutLogs[logicalTodayStr]) {
          state.workoutLogs[logicalTodayStr] = {};
        }
        if (!state.workoutLogs[logicalTodayStr][exId]) {
          state.workoutLogs[logicalTodayStr][exId] = { sets: [] };
        }

        const setsArr = state.workoutLogs[logicalTodayStr][exId].sets;
        const nextSetNum = setsArr.length + 1;

        if (nextSetNum <= totalSets) {
          setsArr.push({
            setNum: nextSetNum,
            reps,
            weight,
            completed: true,
            loggedAt: new Date().toISOString()
          });

          saveState();
          playSound('check');
          renderWorkoutModal();

          // Auto-start rest timer
          startRestTimer(restSec);
        }
      });
    });

    // Start rest timer buttons
    container.querySelectorAll('.btn-start-rest').forEach(btn => {
      btn.addEventListener('click', () => {
        const rest = parseInt(btn.dataset.rest, 10) || 90;
        startRestTimer(rest);
      });
    });

    // Save weight listener
    const saveWeightBtn = document.getElementById('btn-save-weight');
    if (saveWeightBtn) {
      saveWeightBtn.addEventListener('click', () => {
        const val = parseFloat(document.getElementById('input-weight-log').value);
        if (val && val > 30 && val < 150) {
          const last = state.weightLogs[state.weightLogs.length - 1];
          const delta = last ? (val - last.weight).toFixed(1) : '+0.0';
          const sign = delta >= 0 ? `+${delta}` : delta;
          state.weightLogs.push({
            date: logicalTodayStr,
            weight: val,
            note: `${sign} kg`
          });
          saveState();
          playSound('check');
          renderWorkoutModal();
        }
      });
    }
  }

  // Rest Timer Controller
  function startRestTimer(seconds) {
    if (restTimerInterval) clearInterval(restTimerInterval);
    restSecondsRemaining = seconds;
    const widget = document.getElementById('rest-timer-widget');
    widget.style.display = 'flex';
    updateRestTimerDisplay();

    restTimerInterval = setInterval(() => {
      restSecondsRemaining--;
      updateRestTimerDisplay();
      if (restSecondsRemaining <= 0) {
        clearInterval(restTimerInterval);
        restTimerInterval = null;
        widget.style.display = 'none';
        playSound('timer');
      }
    }, 1000);
  }

  function updateRestTimerDisplay() {
    const el = document.getElementById('rest-countdown-text');
    if (!el) return;
    const m = Math.floor(restSecondsRemaining / 60);
    const s = restSecondsRemaining % 60;
    el.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  // ==========================================================================
  // 13. MEALS & HIGH-PROTEIN RECIPES MODAL
  // ==========================================================================
  function openMealsModal(dayOfWeek = null) {
    if (dayOfWeek === null) {
      const logicalToday = getLogicalDate();
      dayOfWeek = getDayOfWeekForDate(logicalToday);
    }
    activeMealsDay = dayOfWeek;
    const modal = document.getElementById('meals-modal');
    modal.style.display = 'flex';
    renderMealsModal();
  }

  function closeMealsModal() {
    document.getElementById('meals-modal').style.display = 'none';
  }

  function renderMealsModal() {
    const dayData = WEEKLY_MEALS[activeMealsDay] || WEEKLY_MEALS[1];
    const container = document.getElementById('meals-content-area');

    // Update day pill buttons
    document.querySelectorAll('#meals-day-pills .day-pill-btn').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.mday, 10) === activeMealsDay);
    });

    const logicalTodayStr = getLogicalDate();
    const cookedToday = state.mealsCooked[logicalTodayStr] || {};

    let html = `
      <!-- Daily Nutrition Targets Banner -->
      <div class="nutrition-targets-card">
        <div class="targets-head">
          <div class="targets-main-text">
            <span class="targets-day-tag">${dayData.dayName.toUpperCase()} NUTRITION TARGET</span>
            <h3 class="targets-val">~${dayData.macros.kcal} kcal • ${dayData.macros.protein} g Protein</h3>
          </div>
          <div class="targets-macro-breakdown">
            <span class="macro-pill">Carbs: ${dayData.macros.carbs}g</span>
            <span class="macro-pill">Fats: ${dayData.macros.fats}g</span>
            <span class="macro-pill protein-pill">Protein: ${dayData.macros.protein}g</span>
          </div>
        </div>
      </div>

      <!-- Soya Chunks Golden Rule Banner -->
      <div class="soya-rule-banner">
        <div class="rule-icon-box">
          <svg class="icon-svg" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        </div>
        <div class="rule-content">
          <h4 class="rule-title">SOYA CHUNKS GOLDEN PREPARATION RULE (NON-NEGOTIABLE)</h4>
          <p class="rule-body">${SOYA_GOLDEN_RULE}</p>
        </div>
      </div>

      <!-- Meal Cards Stack -->
      <div class="meals-cards-stack">
        <!-- 1. Breakfast -->
        ${renderSingleMealCard('breakfast', dayData.breakfast, cookedToday['breakfast'])}

        <!-- 2. Post-College Shake or Lunch -->
        ${state.collegeToday
          ? renderSingleMealCard('shake', dayData.shake, cookedToday['shake'])
          : renderSingleMealCard('lunch', dayData.lunchNonCollege, cookedToday['lunch'])}

        <!-- 3. Dinner -->
        ${renderSingleMealCard('dinner', dayData.dinner, cookedToday['dinner'])}

        <!-- 4. Bedtime Snack -->
        ${renderSingleMealCard('bedtime', dayData.bedtime, cookedToday['bedtime'])}
      </div>
    `;

    container.innerHTML = html;

    // Attach Cooked Checkboxes
    container.querySelectorAll('.meal-cooked-checkbox').forEach(cb => {
      cb.addEventListener('change', () => {
        const mealKey = cb.dataset.mealkey;
        if (!state.mealsCooked[logicalTodayStr]) {
          state.mealsCooked[logicalTodayStr] = {};
        }
        state.mealsCooked[logicalTodayStr][mealKey] = cb.checked;
        saveState();
        if (cb.checked) playSound('check');
        else playSound('uncheck');
      });
    });
  }

  function renderSingleMealCard(mealKey, mealObj, isCooked) {
    if (!mealObj) return '';
    return `
      <div class="meal-card">
        <div class="meal-card-header">
          <div class="meal-head-left">
            <span class="meal-time-badge">${mealObj.time}</span>
            <h3 class="meal-title">${escapeHtml(mealObj.title)}</h3>
          </div>
          <div class="meal-head-right">
            <div class="meal-macro-badges">
              <span class="badge-kcal">${mealObj.macros.kcal} kcal</span>
              <span class="badge-protein">${mealObj.macros.protein}g Protein</span>
            </div>
            <label class="meal-check-label">
              <input type="checkbox" class="meal-cooked-checkbox" data-mealkey="${mealKey}" ${isCooked ? 'checked' : ''}>
              <span>Cooked</span>
            </label>
          </div>
        </div>

        <div class="meal-body-grid">
          <!-- Ingredients -->
          <div class="ingredients-box">
            <h4 class="box-subtitle">Measured Ingredients</h4>
            <ul class="ingredients-list">
              ${mealObj.ingredients.map(ing => `<li><span class="bullet-dot">•</span>${escapeHtml(ing)}</li>`).join('')}
            </ul>
          </div>

          <!-- 4-Step Instructions -->
          <div class="recipe-box">
            <h4 class="box-subtitle">4-Step Preparation Instructions</h4>
            <ol class="steps-ordered-list">
              ${mealObj.steps.map((st, idx) => `
                <li>
                  <span class="step-num">${idx + 1}</span>
                  <span class="step-text">${escapeHtml(st)}</span>
                </li>
              `).join('')}
            </ol>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // 14. WEEKLY GROCERY SHOPPING LIST
  // ==========================================================================
  function renderShoppingList() {
    const container = document.getElementById('shopping-categories-container');
    if (!container) return;

    let html = '';
    GROCERY_CATEGORIES.forEach(cat => {
      html += `
        <div class="shopping-category-card">
          <h4 class="category-name">${cat.name}</h4>
          <div class="category-items-list">
            ${cat.items.map(it => {
              const checked = !!state.shoppingChecked[it.id];
              return `
                <label class="shopping-item-row ${checked ? 'item-checked' : ''}">
                  <input type="checkbox" class="shopping-cb" data-itemid="${it.id}" ${checked ? 'checked' : ''}>
                  <span class="shopping-item-text">${escapeHtml(it.label)}</span>
                </label>
              `;
            }).join('')}
          </div>
        </div>
      `;
    });

    container.innerHTML = html;

    container.querySelectorAll('.shopping-cb').forEach(cb => {
      cb.addEventListener('change', () => {
        const id = cb.dataset.itemid;
        state.shoppingChecked[id] = cb.checked;
        saveState();
        renderShoppingList();
      });
    });
  }

  // ==========================================================================
  // 15. ROUTINE EDITOR (SETTINGS MODAL)
  // ==========================================================================
  function renderTemplateList() {
    const listEl = document.getElementById('template-list');
    if (!listEl) return;

    listEl.innerHTML = '';
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    state.template.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = 'template-row-item';

      const activeDaysStr = (item.days && item.days.length === 7)
        ? 'Everyday'
        : (item.days || []).map(d => dayLabels[d]).join(', ');

      row.innerHTML = `
        <div class="template-item-meta">
          <div class="template-name-row">
            <span class="template-item-name">${escapeHtml(item.title)}</span>
            ${item.isCore ? '<span class="badge-core">CORE</span>' : '<span class="badge-bonus">BONUS</span>'}
          </div>
          <div class="template-item-tags">
            <span>${item.timeOfDay}</span>
            <span>•</span>
            <span>${item.targetTime ? formatTimeDisplay(item.targetTime, state.settings.clock24h) : 'Anytime'}</span>
            <span>•</span>
            <span>${activeDaysStr}</span>
          </div>
        </div>
        <div class="template-item-controls">
          <button class="btn-ctrl btn-move-up" data-idx="${index}" title="Move Up" ${index === 0 ? 'disabled style="opacity:0.25"' : ''}>
            <svg class="icon-svg" viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"></polyline></svg>
          </button>
          <button class="btn-ctrl btn-move-down" data-idx="${index}" title="Move Down" ${index === state.template.length - 1 ? 'disabled style="opacity:0.25"' : ''}>
            <svg class="icon-svg" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <button class="btn-ctrl btn-edit-template" data-idx="${index}" title="Edit">
            <svg class="icon-svg" viewBox="0 0 24 24"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
          </button>
          <button class="btn-ctrl btn-delete-template" data-idx="${index}" title="Delete">
            <svg class="icon-svg" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      `;

      listEl.appendChild(row);
    });

    listEl.querySelectorAll('.btn-move-up').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx, 10);
        if (idx > 0) {
          const temp = state.template[idx];
          state.template[idx] = state.template[idx - 1];
          state.template[idx - 1] = temp;
          saveState();
          renderTemplateList();
        }
      });
    });

    listEl.querySelectorAll('.btn-move-down').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx, 10);
        if (idx < state.template.length - 1) {
          const temp = state.template[idx];
          state.template[idx] = state.template[idx + 1];
          state.template[idx + 1] = temp;
          saveState();
          renderTemplateList();
        }
      });
    });

    listEl.querySelectorAll('.btn-edit-template').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx, 10);
        openEditTaskForm(state.template[idx]);
      });
    });

    listEl.querySelectorAll('.btn-delete-template').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx, 10);
        if (confirm(`Delete routine task "${state.template[idx].title}"?`)) {
          state.template.splice(idx, 1);
          saveState();
          renderTemplateList();
        }
      });
    });
  }

  function openEditTaskForm(task = null) {
    const form = document.getElementById('task-form');
    const idInput = document.getElementById('edit-task-id');
    const titleInput = document.getElementById('task-title-input');
    const todSelect = document.getElementById('task-tod-select');
    const timeInput = document.getElementById('task-time-input');
    const dayChecks = document.querySelectorAll('input[name="task-day"]');
    const coreCheck = document.getElementById('task-iscore-input');

    form.style.display = 'flex';

    if (task) {
      idInput.value = task.id;
      titleInput.value = task.title;
      todSelect.value = task.timeOfDay || 'morning';
      timeInput.value = task.targetTime || '';
      coreCheck.checked = (task.isCore ?? true);
      dayChecks.forEach(cb => {
        cb.checked = (task.days || []).includes(parseInt(cb.value, 10));
      });
    } else {
      idInput.value = '';
      titleInput.value = '';
      todSelect.value = 'morning';
      timeInput.value = '';
      coreCheck.checked = true;
      dayChecks.forEach(cb => cb.checked = true);
    }

    titleInput.focus();
  }

  function closeEditTaskForm() {
    const form = document.getElementById('task-form');
    form.reset();
    form.style.display = 'none';
  }

  function handleSaveTaskForm(e) {
    e.preventDefault();
    const idInput = document.getElementById('edit-task-id').value;
    const title = document.getElementById('task-title-input').value.trim();
    const tod = document.getElementById('task-tod-select').value;
    const targetTime = document.getElementById('task-time-input').value;
    const isCore = document.getElementById('task-iscore-input').checked;

    const selectedDays = [];
    document.querySelectorAll('input[name="task-day"]:checked').forEach(cb => {
      selectedDays.push(parseInt(cb.value, 10));
    });

    if (!title) return;

    if (idInput) {
      const existing = state.template.find(t => t.id === idInput);
      if (existing) {
        existing.title = title;
        existing.timeOfDay = tod;
        existing.targetTime = targetTime;
        existing.isCore = isCore;
        existing.days = selectedDays;

        const todayT = state.todayTasks.find(t => t.id === idInput);
        if (todayT) {
          todayT.title = title;
          todayT.timeOfDay = tod;
          todayT.targetTime = targetTime;
          todayT.isCore = isCore;
        }
      }
    } else {
      const newId = 'task-' + Date.now();
      const newTask = {
        id: newId,
        title,
        timeOfDay: tod,
        targetTime,
        isCore,
        days: selectedDays
      };
      state.template.push(newTask);

      const logicalToday = getLogicalDate();
      const todayDayOfWeek = getDayOfWeekForDate(logicalToday);
      if (selectedDays.includes(todayDayOfWeek)) {
        state.todayTasks.push({
          id: newId,
          title,
          timeOfDay: tod,
          targetTime,
          isCore,
          done: false,
          completedAt: null
        });
      }
    }

    saveState();
    closeEditTaskForm();
    renderAll();
  }

  // ==========================================================================
  // 16. HISTORY & HEATMAP MODAL
  // ==========================================================================
  function renderHistoryModal() {
    const historyEntries = Object.values(state.history);
    const perfectDays = historyEntries.filter(h => h.status === 'completed').length;

    let last7Completed = 0;
    let last7Total = 0;
    const logicalTodayStr = getLogicalDate();
    const today = new Date(logicalTodayStr + 'T00:00:00');

    for (let i = 1; i <= 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const ds = getLogicalDate(d, 0);
      if (state.history[ds]) {
        last7Total++;
        if (state.history[ds].status === 'completed') last7Completed++;
      }
    }
    const rate7 = last7Total > 0 ? Math.round((last7Completed / last7Total) * 100) : 0;

    let last30Completed = 0;
    let last30Total = 0;
    for (let i = 1; i <= 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const ds = getLogicalDate(d, 0);
      if (state.history[ds]) {
        last30Total++;
        if (state.history[ds].status === 'completed') last30Completed++;
      }
    }
    const rate30 = last30Total > 0 ? Math.round((last30Completed / last30Total) * 100) : 0;

    document.getElementById('stat-current-streak').textContent = state.currentStreak;
    document.getElementById('stat-best-streak').textContent = state.bestStreak;
    document.getElementById('stat-7day-rate').textContent = `${rate7}%`;
    document.getElementById('stat-30day-rate').textContent = `${rate30}%`;
    document.getElementById('stat-total-completed').textContent = perfectDays;

    const heatmapGrid = document.getElementById('heatmap-grid');
    heatmapGrid.innerHTML = '';

    const daysToShow = 60;
    for (let i = daysToShow - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = getLogicalDate(d, 0);
      const dayNum = d.getDate();

      let cellClass = 'square-missed';
      let record = state.history[dateStr];

      if (i === 0) {
        const coreTasks = state.todayTasks.filter(t => t.isCore);
        const coreDone = coreTasks.filter(t => t.done).length;
        const total = state.todayTasks.length;
        const done = state.todayTasks.filter(t => t.done).length;

        if (state.isRestDay) cellClass = 'square-rest';
        else if (state.settings.streakCoreOnly && coreTasks.length > 0 && coreDone === coreTasks.length) cellClass = 'square-perfect';
        else if (done >= total && total > 0) cellClass = 'square-perfect';
        else if (done > 0) cellClass = 'square-partial';
        else cellClass = 'square-missed';
      } else if (record) {
        if (record.status === 'completed') cellClass = 'square-perfect';
        else if (record.status === 'partial') cellClass = 'square-partial';
        else if (record.status === 'rest') cellClass = 'square-rest';
        else cellClass = 'square-missed';
      }

      const cell = document.createElement('div');
      cell.className = `heatmap-square ${cellClass}`;
      cell.textContent = dayNum;
      cell.title = dateStr;

      cell.addEventListener('click', () => {
        showDayDetail(dateStr, i === 0);
      });

      heatmapGrid.appendChild(cell);
    }
  }

  function showDayDetail(dateStr, isToday = false) {
    const titleEl = document.getElementById('detail-date-title');
    const listEl = document.getElementById('detail-tasks-list');

    titleEl.textContent = `Completed tasks for ${dateStr} ${isToday ? '(Today)' : ''}`;
    listEl.innerHTML = '';

    let tasks = [];
    let isRest = false;

    if (isToday) {
      tasks = state.todayTasks;
      isRest = state.isRestDay;
    } else if (state.history[dateStr]) {
      tasks = state.history[dateStr].tasks || [];
      isRest = state.history[dateStr].isRestDay;
    }

    if (isRest) {
      listEl.innerHTML = '<div class="detail-row" style="color: #a5b4fc;">Rest day was active.</div>';
      return;
    }

    if (tasks.length === 0) {
      listEl.innerHTML = '<div class="detail-row" style="color: var(--text-tertiary);">No tasks logged.</div>';
      return;
    }

    tasks.forEach(t => {
      const row = document.createElement('div');
      row.className = `detail-row ${t.done ? 'done-row' : ''}`;
      row.innerHTML = `
        <svg class="icon-svg" style="width:16px;height:16px;" viewBox="0 0 24 24">
          ${t.done ? '<polyline points="20 6 9 17 4 12"></polyline>' : '<circle cx="12" cy="12" r="9"></circle>'}
        </svg>
        <span>${escapeHtml(t.title)}</span>
        ${t.isCore ? '<span class="badge-core">CORE</span>' : ''}
        <span style="color:var(--text-tertiary); font-size:13px;">(${t.timeOfDay})</span>
      `;
      listEl.appendChild(row);
    });
  }

  // ==========================================================================
  // 17. BACKUP, RESTORE & RESET
  // ==========================================================================
  function exportData() {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', `routine-tablet-backup-${getLogicalDate()}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function importData(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (imported && imported.template && Array.isArray(imported.template)) {
          state = {
            ...state,
            ...imported,
            settings: { ...state.settings, ...(imported.settings || {}) }
          };
          saveState();
          renderAll();
          alert('Routine data restored successfully.');
          document.getElementById('settings-modal').style.display = 'none';
        } else {
          alert('Invalid backup file format.');
        }
      } catch (err) {
        alert('Could not read backup file.');
      }
    };
    reader.readAsText(file);
  }

  function resetToDefaults() {
    if (confirm('Reset template to original muscle-building routine? Streaks and history will be kept.')) {
      state.template = [...DEFAULT_ROUTINE_TEMPLATE];
      state.todayTasks = generateTodayTasks(getLogicalDate(), state.collegeToday);
      saveState();
      renderAll();
      alert('Routine template reset to muscle-building defaults.');
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  // ==========================================================================
  // 18. EVENT LISTENERS
  // ==========================================================================
  function setupEventListeners() {
    // College Day Schedule Switch Button
    const collegeBtn = document.getElementById('btn-toggle-college');
    if (collegeBtn) {
      collegeBtn.addEventListener('click', () => {
        state.collegeToday = !state.collegeToday;
        // Preserve done states for matching tasks, regenerate list with new tasks
        const existingDoneMap = {};
        state.todayTasks.forEach(t => { if (t.done) existingDoneMap[t.id] = true; });

        const logicalToday = getLogicalDate();
        state.todayTasks = generateTodayTasks(logicalToday, state.collegeToday);
        state.todayTasks.forEach(t => {
          if (existingDoneMap[t.id]) t.done = true;
        });

        saveState();
        renderAll();
        playSound('check');
      });
    }

    // Segmented Control Switcher
    document.querySelectorAll('.seg-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.seg-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.dataset.filter;
        renderTasks();
      });
    });

    // "Up Next" Mark Done Button
    document.getElementById('btn-upnext-done').addEventListener('click', () => {
      if (nextTaskId) {
        toggleTask(nextTaskId);
      }
    });

    // Workout Page Floating Dock Button
    document.getElementById('btn-workout-dock').addEventListener('click', () => {
      openWorkoutModal();
    });

    // Meals Page Floating Dock Button
    document.getElementById('btn-meals-dock').addEventListener('click', () => {
      openMealsModal();
    });

    // Sound toggle
    const soundBtn = document.getElementById('btn-sound');
    soundBtn.addEventListener('click', () => {
      state.settings.soundEnabled = !state.settings.soundEnabled;
      updateSoundIcon();
      document.getElementById('setting-sound').checked = state.settings.soundEnabled;
      saveState();
      if (state.settings.soundEnabled) playSound('check');
    });

    // Rest Day toggle
    const restBtn = document.getElementById('btn-rest');
    restBtn.addEventListener('click', () => {
      state.isRestDay = !state.isRestDay;
      saveState();
      renderHeroSection();
      renderWeekStrip();
    });

    // Night Mode manual toggle
    const nightBtn = document.getElementById('btn-night');
    nightBtn.addEventListener('click', () => {
      state.manualNightMode = !state.manualNightMode;
      updateNightMode();
    });

    // Settings Modal
    const settingsBtn = document.getElementById('btn-settings');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettingsBtn = document.getElementById('btn-close-settings');

    settingsBtn.addEventListener('click', () => {
      settingsModal.style.display = 'flex';
      renderTemplateList();
      renderShoppingList();
    });

    closeSettingsBtn.addEventListener('click', () => {
      settingsModal.style.display = 'none';
      closeEditTaskForm();
    });

    // Settings Tabs
    document.querySelectorAll('.modal-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.modal-nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        document.querySelectorAll('.pane-content').forEach(p => p.style.display = 'none');
        const targetId = `pane-${btn.dataset.modaltab}`;
        const targetEl = document.getElementById(targetId);
        if (targetEl) targetEl.style.display = 'block';

        if (btn.dataset.modaltab === 'shopping') {
          renderShoppingList();
        }
      });
    });

    // Template Form
    document.getElementById('btn-add-task').addEventListener('click', () => {
      openEditTaskForm(null);
    });
    document.getElementById('btn-cancel-task').addEventListener('click', () => {
      closeEditTaskForm();
    });
    document.getElementById('task-form').addEventListener('submit', handleSaveTaskForm);

    // Settings Inputs: Pull-Up Bar Toggle
    const pullupCheck = document.getElementById('setting-pullup-bar');
    if (pullupCheck) {
      pullupCheck.checked = !!state.settings.pullupBar;
      pullupCheck.addEventListener('change', () => {
        state.settings.pullupBar = pullupCheck.checked;
        saveState();
      });
    }

    // Streak Core Only Toggle
    const streakCoreCheck = document.getElementById('setting-streak-core');
    if (streakCoreCheck) {
      streakCoreCheck.checked = (state.settings.streakCoreOnly ?? true);
      streakCoreCheck.addEventListener('change', () => {
        state.settings.streakCoreOnly = streakCoreCheck.checked;
        saveState();
        renderHeroSection();
        renderWeekStrip();
      });
    }

    // Rollover Hour Select
    const rolloverSelect = document.getElementById('setting-rollover-hour');
    if (rolloverSelect) {
      rolloverSelect.value = String(state.settings.rolloverHour ?? 4);
      rolloverSelect.addEventListener('change', () => {
        state.settings.rolloverHour = parseInt(rolloverSelect.value, 10);
        saveState();
        checkDateAndRollover();
      });
    }

    // Reset shopping checkboxes button
    const uncheckShoppingBtn = document.getElementById('btn-uncheck-shopping');
    if (uncheckShoppingBtn) {
      uncheckShoppingBtn.addEventListener('click', () => {
        state.shoppingChecked = {};
        saveState();
        renderShoppingList();
      });
    }

    // Workout Modal Actions
    document.getElementById('btn-close-workout').addEventListener('click', closeWorkoutModal);
    document.getElementById('btn-finish-workout').addEventListener('click', () => {
      // Auto-tick workout task on Today screen
      const workoutTask = state.todayTasks.find(t => t.id === 'task-workout' || t.title.toLowerCase().includes('workout'));
      if (workoutTask && !workoutTask.done) {
        toggleTask(workoutTask.id);
      }
      closeWorkoutModal();
      playSound('complete');
    });

    // Workout Day Switcher Pills
    document.querySelectorAll('#workout-day-pills .day-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeWorkoutDay = parseInt(btn.dataset.wday, 10);
        renderWorkoutModal();
      });
    });

    // Workout Stats / Weight button
    document.getElementById('btn-workout-view-stats').addEventListener('click', () => {
      closeWorkoutModal();
      document.getElementById('history-modal').style.display = 'flex';
      renderHistoryModal();
    });

    // Meals Modal Actions
    document.getElementById('btn-close-meals').addEventListener('click', closeMealsModal);
    document.querySelectorAll('#meals-day-pills .day-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeMealsDay = parseInt(btn.dataset.mday, 10);
        renderMealsModal();
      });
    });
    document.getElementById('btn-meals-open-groceries').addEventListener('click', () => {
      closeMealsModal();
      document.getElementById('settings-modal').style.display = 'flex';
      // Switch to groceries tab
      document.querySelectorAll('.modal-nav-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.modaltab === 'shopping');
      });
      document.querySelectorAll('.pane-content').forEach(p => p.style.display = 'none');
      document.getElementById('pane-shopping').style.display = 'block';
      renderShoppingList();
    });

    // Rest Timer Controls
    document.getElementById('btn-rest-add30').addEventListener('click', () => {
      restSecondsRemaining += 30;
      updateRestTimerDisplay();
    });
    document.getElementById('btn-rest-skip').addEventListener('click', () => {
      if (restTimerInterval) clearInterval(restTimerInterval);
      restTimerInterval = null;
      document.getElementById('rest-timer-widget').style.display = 'none';
    });

    // General Display & Audio Settings
    const clockFormatSelect = document.getElementById('setting-clock-format');
    clockFormatSelect.value = state.settings.clock24h ? '24' : '12';
    clockFormatSelect.addEventListener('change', () => {
      state.settings.clock24h = (clockFormatSelect.value === '24');
      saveState();
      updateClock();
      renderTasks();
    });

    const soundCheck = document.getElementById('setting-sound');
    soundCheck.checked = state.settings.soundEnabled;
    soundCheck.addEventListener('change', () => {
      state.settings.soundEnabled = soundCheck.checked;
      updateSoundIcon();
      saveState();
    });

    const nightAutoCheck = document.getElementById('setting-night-auto');
    nightAutoCheck.checked = state.settings.nightModeAuto;
    nightAutoCheck.addEventListener('change', () => {
      state.settings.nightModeAuto = nightAutoCheck.checked;
      saveState();
      updateNightMode();
    });

    const nightStartInput = document.getElementById('setting-night-start');
    nightStartInput.value = state.settings.nightStartHour;
    nightStartInput.addEventListener('change', () => {
      state.settings.nightStartHour = parseInt(nightStartInput.value, 10);
      saveState();
      updateNightMode();
    });

    const nightEndInput = document.getElementById('setting-night-end');
    nightEndInput.value = state.settings.nightEndHour;
    nightEndInput.addEventListener('change', () => {
      state.settings.nightEndHour = parseInt(nightEndInput.value, 10);
      saveState();
      updateNightMode();
    });

    const burninCheck = document.getElementById('setting-burnin');
    burninCheck.checked = state.settings.burnInProtection;
    burninCheck.addEventListener('change', () => {
      state.settings.burnInProtection = burninCheck.checked;
      saveState();
    });

    // Backup & Restore
    document.getElementById('btn-export-json').addEventListener('click', exportData);
    const importInput = document.getElementById('import-file-input');
    document.getElementById('btn-trigger-import').addEventListener('click', () => {
      importInput.click();
    });
    importInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        importData(e.target.files[0]);
      }
    });
    document.getElementById('btn-reset-routine').addEventListener('click', resetToDefaults);

    // History Modal
    const historyBtn = document.getElementById('btn-history');
    const historyModal = document.getElementById('history-modal');
    const closeHistoryBtn = document.getElementById('btn-close-history');

    historyBtn.addEventListener('click', () => {
      historyModal.style.display = 'flex';
      renderHistoryModal();
    });
    closeHistoryBtn.addEventListener('click', () => {
      historyModal.style.display = 'none';
    });

    // Backdrop click dismissals
    window.addEventListener('click', (e) => {
      if (e.target === settingsModal) {
        settingsModal.style.display = 'none';
        closeEditTaskForm();
      }
      if (e.target === historyModal) {
        historyModal.style.display = 'none';
      }
      if (e.target === document.getElementById('workout-modal')) {
        closeWorkoutModal();
      }
      if (e.target === document.getElementById('meals-modal')) {
        closeMealsModal();
      }
    });

    // Wake lock on resume
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        requestWakeLock();
        checkDateAndRollover();
        updateNightMode();
      }
    });

    window.addEventListener('pointerdown', () => {
      initAudio();
      if (!wakeLockSentinel) {
        requestWakeLock();
      }
    }, { once: false });
  }

  function updateSoundIcon() {
    const iconContainer = document.getElementById('icon-sound');
    if (!iconContainer) return;
    if (state.settings.soundEnabled) {
      iconContainer.innerHTML = `
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
      `;
    } else {
      iconContainer.innerHTML = `
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <line x1="23" y1="9" x2="17" y2="15"></line>
        <line x1="17" y1="9" x2="23" y2="15"></line>
      `;
    }
  }

  // ==========================================================================
  // 19. SERVICE WORKER REGISTRATION
  // ==========================================================================
  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then(reg => {
            console.log('SW registered:', reg.scope);
          })
          .catch(err => {
            console.warn('SW register error:', err);
          });
      });
    }
  }

  // ==========================================================================
  // 20. VIEWPORT SIZING (100vh OVERFLOW FIX)
  // ==========================================================================
  function updateAppHeight() {
    const h = window.innerHeight;
    document.documentElement.style.setProperty('--app-height', `${h}px`);
  }

  // ==========================================================================
  // 21. APP INITIALIZATION
  // ==========================================================================
  function init() {
    updateAppHeight();
    window.addEventListener('resize', updateAppHeight);
    loadState();
    checkDateAndRollover();
    setupEventListeners();
    updateClock();
    updateMotivationalQuote();
    updateSoundIcon();
    updateNightMode();
    renderAll();
    requestWakeLock();
    registerServiceWorker();

    setInterval(updateClock, 1000);
    setInterval(() => {
      checkDateAndRollover();
      updateNightMode();
    }, 5000);
    setInterval(applyPixelShift, 180000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
