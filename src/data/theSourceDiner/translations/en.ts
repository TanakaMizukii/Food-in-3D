import type { StoreTranslations } from '../../types';

export const en: StoreTranslations = {
    categories: {
        3: { name: "Owner's Recommendations", description: "Check out our owner's recommended dishes!" },
    },
    products: {
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
