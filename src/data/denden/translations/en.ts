import type { StoreTranslations } from '../../types';

export const en: StoreTranslations = {
    categories: {
        1: { name: 'Main Menu', description: "Denden's signature rice bowls" },
        2: { name: 'Chicken Bowls', description: 'Juicy chicken rice bowls' },
        3: { name: 'Curry', description: "Denden's special curry" },
        4: { name: 'Rice Bowls', description: 'Hearty pork rice bowls' },
        5: { name: 'Chicken & Pork Bowls', description: 'Bowls featuring both chicken and pork' },
        6: { name: 'Others', description: 'Omurice, taco rice, and more' },
    },
    products: {
        1: {
            name: 'Two-Type Fried Chicken Combo Bowl (Regular)',
            shortName: 'Chicken Combo Regular',
            description: 'A combo bowl featuring two types of fried chicken.',
            serving: 'Regular',
            part: 'Chicken',
            origin: null,
            recPeople: 'Those who want to\ncompare two types of karaage',
            recommended: 'As is',
            tags: ['Fried Chicken', 'Combo', 'Popular']
        },
        2: {
            name: 'Two-Type Fried Chicken Combo Bowl (Large)',
            shortName: 'Chicken Combo Large',
            description: 'Large size combo bowl with two types of fried chicken.',
            serving: 'Large',
            part: 'Chicken',
            origin: null,
            recPeople: 'Those who want to eat more',
            recommended: 'As is',
            tags: ['Fried Chicken', 'Combo', 'Large']
        },
        3: {
            name: 'Two-Type Fried Chicken Combo Bowl (Extra Large)',
            shortName: 'Chicken Combo XL',
            description: 'Extra large combo bowl with two types of fried chicken.',
            serving: 'Extra Large',
            part: 'Chicken',
            origin: null,
            recPeople: 'Those who want to eat until full',
            recommended: 'As is',
            tags: ['Fried Chicken', 'Combo', 'Extra Large', 'Volume']
        },
        4: {
            name: 'Matsumoto Sanzoku-yaki Bowl (Regular)',
            shortName: 'Sanzoku Bowl Regular',
            description: "A rice bowl topped with Matsumoto's famous sanzoku-yaki.",
            serving: 'Regular',
            part: 'Chicken Thigh',
            origin: 'Nagano Prefecture',
            recPeople: "Those who want to try Matsumoto's specialty",
            recommended: 'As is',
            tags: ['Sanzoku-yaki', 'Matsumoto Specialty', 'Popular']
        },
        5: {
            name: 'Matsumoto Sanzoku-yaki Bowl (Large)',
            shortName: 'Sanzoku Bowl Large',
            description: "Large size bowl topped with Matsumoto's famous sanzoku-yaki.",
            serving: 'Large',
            part: 'Chicken Thigh',
            origin: 'Nagano Prefecture',
            recPeople: 'Those who want a hearty local specialty',
            recommended: 'As is',
            tags: ['Sanzoku-yaki', 'Matsumoto Specialty', 'Large']
        },
        6: {
            name: 'Matsumoto Sanzoku-yaki Bowl (Extra Large)',
            shortName: 'Sanzoku Bowl XL',
            description: "Extra large bowl topped with Matsumoto's famous sanzoku-yaki.",
            serving: 'Extra Large',
            part: 'Chicken Thigh',
            origin: 'Nagano Prefecture',
            recPeople: 'Big eaters, challenge seekers',
            recommended: 'As is',
            tags: ['Sanzoku-yaki', 'Matsumoto Specialty', 'Extra Large', 'Volume']
        },
        7: {
            name: 'Torched Cheese Chicken Tomato Sauce Bowl (Regular)',
            shortName: 'Cheese Chicken Regular',
            description: 'Chicken bowl with perfectly matched torched cheese and tomato sauce.',
            serving: 'Regular',
            part: 'Chicken',
            origin: null,
            recPeople: 'Those who love\ncheese and tomato combo',
            recommended: 'As is',
            tags: ['Cheese', 'Tomato Sauce', 'Torched']
        },
        8: {
            name: 'Torched Cheese Chicken Tomato Sauce Bowl (Large)',
            shortName: 'Cheese Chicken Large',
            description: 'Large chicken bowl with torched cheese and tomato sauce.',
            serving: 'Large',
            part: 'Chicken',
            origin: null,
            recPeople: 'Those who love rich flavors',
            recommended: 'As is',
            tags: ['Cheese', 'Tomato Sauce', 'Large']
        },
        9: {
            name: 'Matsumoto Sanzoku Curry (Regular)',
            shortName: 'Sanzoku Curry Regular',
            description: 'Special curry topped with sanzoku-yaki.',
            serving: 'Regular',
            part: 'Chicken Thigh',
            origin: null,
            recPeople: 'Those who love hearty curry',
            recommended: 'As is',
            tags: ['Sanzoku-yaki', 'Curry', 'Popular']
        },
        10: {
            name: 'Matsumoto Sanzoku Curry (Large)',
            shortName: 'Sanzoku Curry Large',
            description: 'Large special curry topped with sanzoku-yaki.',
            serving: 'Large',
            part: 'Chicken Thigh',
            origin: null,
            recPeople: 'Those who need energy',
            recommended: 'As is',
            tags: ['Sanzoku-yaki', 'Curry', 'Large']
        },
        11: {
            name: 'Matsumoto Sanzoku Curry (Extra Large)',
            shortName: 'Sanzoku Curry XL',
            description: 'Extra large special curry topped with sanzoku-yaki.',
            serving: 'Extra Large',
            part: 'Chicken Thigh',
            origin: null,
            recPeople: 'Those who want lots of curry',
            recommended: 'As is',
            tags: ['Sanzoku-yaki', 'Curry', 'Extra Large', 'Volume']
        },
        12: {
            name: 'Fried Egg Curry (Regular)',
            shortName: 'Fried Egg Curry Regular',
            description: 'Curry topped with a runny fried egg.',
            serving: 'Regular',
            part: null,
            origin: null,
            recPeople: 'Those who prefer simple curry',
            recommended: 'As is',
            tags: ['Fried Egg', 'Curry', 'Simple']
        },
        13: {
            name: 'Pork Belly Yakiniku Bowl (Regular)',
            shortName: 'Pork Yakiniku Regular',
            description: 'Bowl topped with juicy grilled pork belly.',
            serving: 'Regular',
            part: 'Pork Belly',
            origin: null,
            recPeople: 'Those who love juicy pork belly',
            recommended: 'As is',
            tags: ['Pork Belly', 'Yakiniku', 'Juicy']
        },
        14: {
            name: 'Pork Belly Yakiniku Bowl (Large)',
            shortName: 'Pork Yakiniku Large',
            description: 'Large bowl topped with juicy grilled pork belly.',
            serving: 'Large',
            part: 'Pork Belly',
            origin: null,
            recPeople: 'Those who want lots of pork',
            recommended: 'As is',
            tags: ['Pork Belly', 'Yakiniku', 'Large']
        },
        15: {
            name: 'Ginger Pork & Fried Chicken Bowl (Regular)',
            shortName: 'Ginger Pork & Chicken Regular',
            description: 'A greedy bowl featuring both ginger pork and fried chicken.',
            serving: 'Regular',
            part: 'Pork, Chicken',
            origin: null,
            recPeople: 'Those who want both\npork and chicken',
            recommended: 'As is',
            tags: ['Ginger Pork', 'Fried Chicken', 'Combo']
        },
        16: {
            name: 'Ginger Pork & Fried Chicken Bowl (Large)',
            shortName: 'Ginger Pork & Chicken Large',
            description: 'Large greedy bowl with ginger pork and fried chicken.',
            serving: 'Large',
            part: 'Pork, Chicken',
            origin: null,
            recPeople: 'Those who want variety and volume',
            recommended: 'As is',
            tags: ['Ginger Pork', 'Fried Chicken', 'Large']
        },
        17: {
            name: "Denden's Special Omurice",
            shortName: 'Special Omurice',
            description: "Denden's signature fluffy omurice.",
            serving: 'Regular',
            part: null,
            origin: null,
            recPeople: 'Those who love fluffy omurice',
            recommended: 'As is',
            tags: ['Omurice', 'Fluffy', 'Special']
        },
        18: {
            name: 'Original Sauce Katsudon',
            shortName: 'Sauce Katsudon',
            description: 'Katsudon seasoned with our original sauce.',
            serving: 'Regular',
            part: 'Pork Loin',
            origin: null,
            recPeople: 'Those who love sauce katsudon',
            recommended: 'As is',
            tags: ['Sauce Katsudon', 'Original', 'Popular']
        },
        20: {
            name: 'Hamburger Loco Moco Bowl',
            shortName: 'Loco Moco Bowl',
            description: 'Hawaiian-style bowl with hamburger and fried egg.',
            serving: 'Regular',
            part: null,
            origin: null,
            recPeople: 'Those who want original loco moco',
            recommended: 'As is',
            tags: ['Loco Moco', 'Hamburger', 'Hawaiian']
        },
    }
};

export default en;
