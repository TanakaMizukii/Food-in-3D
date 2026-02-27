import type { StoreTranslations } from '../../types';

export const en: StoreTranslations = {
    categories: {
        1: { name: 'Select Menu', description: 'Check out items only available this month!' },
        2: { name: 'Monthly Menu', description: 'Check out items only available this month!' },
        3: { name: "Owner's Recommendations", description: "Check out our owner's recommended dishes!" },
    },
    products: {
        1: {
            name: 'Chorizo & Mozzarella Ethnic Burger',
            shortName: 'February Monthly Burger',
            description: 'An ethnic-style burger featuring a perfect match of spicy chorizo and melting mozzarella cheese.\nEnjoy the rich flavor of mildly spicy chorizo paired with creamy mozzarella!',
            minDetail: 'Spicy × Cheese — a perfect combination!',
            serving: '1 serving',
            part: 'Chorizo, Mozzarella Cheese',
            origin: null,
            recPeople: 'Those who love\nspicy food',
            recommended: 'Ethnic Sauce',
            tags: ['Spicy', 'Ethnic', 'Chorizo', 'Limited Time']
        },
        2: {
            name: 'Meatball Sunday Sauce Fettuccine',
            shortName: 'February Monthly Pasta',
            description: 'Fettuccine with juicy meatballs entwined in a rich Sunday sauce.\nEnjoy the chewy flat pasta and hearty meatballs!',
            minDetail: 'Rich sauce × chewy pasta!',
            serving: '1 serving',
            part: 'Meatball, Fettuccine',
            origin: null,
            recPeople: 'Pasta lovers',
            recommended: 'Parmesan Cheese',
            tags: ['Pasta', 'Meatball', 'Rich', 'Limited Time']
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
    }
};

export default en;
