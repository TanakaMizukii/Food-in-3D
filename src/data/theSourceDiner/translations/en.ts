import type { StoreTranslations } from '../../types';

export const en: StoreTranslations = {
    categories: {
        1: { name: 'Monthly Menu', description: 'Check out items only available this month!' },
        3: { name: "Owner's Recommendations", description: "Check out our owner's recommended dishes!" },
    },
    products: {
        1: {
            name: 'Spring Vegetable Cream Chowder-Style Cream Sauce Fettuccine',
            shortName: 'March Monthly Pasta',
            description: 'A rich cream chowder-style sauce made with fresh spring vegetables, entwined with chewy fettuccine — the ultimate pasta!\nEnjoy the harmony of seasonal vegetable sweetness and creamy sauce.',
            minDetail: 'Spring veggies × rich cream sauce!',
            serving: '1 serving',
            part: 'Spring Vegetables, Fettuccine',
            origin: null,
            recPeople: 'Those who love\nspring vegetables or creamy pasta',
            recommended: 'Parmesan Cheese',
            tags: ['Spring Vegetables', 'Cream', 'Pasta', 'Limited Time']
        },
        2: {
            name: 'Fried Chicken Burger with Homemade Chili Oil',
            shortName: 'March Monthly Burger',
            description: 'A crispy fried chicken burger loaded generously with our homemade chili oil — a satisfying, must-try masterpiece!\nThe spicy umami of the chili oil and the crunchy texture of the chicken make for a perfect combination — our March limited burger.',
            minDetail: 'Spicy chili oil × crispy chicken!',
            serving: '1 serving',
            part: 'Fried Chicken, Homemade Chili Oil',
            origin: null,
            recPeople: 'Those who love\nspicy chicken dishes',
            recommended: 'Homemade Chili Oil',
            tags: ['Spicy', 'Fried Chicken', 'Chili Oil', 'Limited Time']
        },
        4: {
            name: 'Cheeseburger',
            shortName: 'Cheeseburger',
            description: "A classic cheeseburger with melting cheese and a juicy patty.\nSimple yet showcasing the finest ingredients — the owner's signature dish.",
            serving: '1 serving',
            part: 'Beef Patty, Cheese',
            origin: null,
            recPeople: 'Those who want to enjoy\nloads of cheese on a burger',
            recommended: 'Ketchup, Mustard',
            tags: ['Classic', 'Cheese', 'Juicy', 'Recommended']
        },
        3: {
            name: 'Lamb Dumpling (Mala Sauce)',
            shortName: 'Lamb Dumpling',
            description: 'Dumplings packed with the rich flavor of lamb, served with a tingling mala sauce.\nThe spicy kick and deep taste of lamb make this dish utterly addictive.',
            minDetail: 'The numbing spice is addictive!',
            serving: '1 serving',
            part: 'Lamb',
            origin: null,
            recPeople: 'Those who love\nspicy dishes or lamb',
            recommended: 'Mala Sauce',
            tags: ['Lamb', 'Dumpling', 'Spicy', 'Recommended']
        },
    }
};

export default en;
