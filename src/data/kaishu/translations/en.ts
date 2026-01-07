import type { StoreTranslations } from '../../types';

export const en: StoreTranslations = {
    categories: {
        1: { name: 'Main Menu', description: 'Premium cuts served with lemon' },
        2: { name: 'Kalbi', description: 'Wide selection from premium to standard' },
        3: { name: 'Assorted Platters', description: 'Value sets featuring various cuts' },
        4: { name: 'Offal', description: 'Fresh offal with great texture and flavor' },
        5: { name: 'Finishing Dishes', description: 'Cold noodles and soup to finish your meal' },
    },
    products: {
        1: {
            name: 'Kalbi Platter (2-3 servings)',
            shortName: 'Kalbi Platter',
            description: 'Enjoy four types of kalbi on one plate: premium, choice, regular, and trimmed kalbi!\nCompare the different flavors and textures of each cut!',
            minDetail: 'Try 4 types of kalbi!',
            serving: '2-3 servings',
            part: 'Beef Kalbi (4 types)',
            origin: null,
            recPeople: 'Those who want to compare\ndifferent kalbi cuts',
            recommended: 'Tare sauce',
            tags: ['Kalbi Selection', 'Comparison', '4 Types', 'Recommended']
        },
        2: {
            name: 'Nine Variety Platter (2-3 servings)',
            shortName: 'Nine Variety',
            description: 'Enjoy nine carefully selected types of offal.\nPair with our special salt sauce for the best experience.',
            minDetail: 'Sample various cuts in one dish.',
            serving: '2-3 servings',
            part: 'Abomasum, Throat, Tongue Root, Neck, Tripe, Cartilage, Heart, etc.',
            origin: null,
            recPeople: 'Those who want to try rare offal',
            recommended: 'Special Salt Sauce',
            tags: ['Offal', 'Variety', 'Selected', '9 Types']
        },
        3: {
            name: 'Family Set (4-5 servings)',
            shortName: 'Family Set',
            description: 'Enjoy popular tongue and skirt steak, plus regular kalbi, intestines, chicken, and sausage with our special miso sauce',
            minDetail: 'Great value platter with various meats!',
            serving: '4-5 servings',
            part: 'Tongue, Skirt Steak, Kalbi, Offal, Chicken, Sausage, etc.',
            origin: null,
            recPeople: 'For families and large groups',
            recommended: 'Special Ponzu Sauce',
            tags: ['Family', 'Variety', 'Value', 'Set']
        },
        4: {
            name: 'Premium Salted Tongue (1 serving)',
            shortName: 'Premium Tongue',
            description: 'The finest part of the tongue. The moderate fat melts in your mouth when eaten with lemon.',
            serving: '1 serving',
            part: 'Tongue',
            origin: 'Australian',
            recPeople: null,
            recommended: 'Salt & Lemon',
            tags: ['Premium', 'Refreshing', 'Popular']
        },
        5: {
            name: 'Supreme Kalbi (1 serving)',
            shortName: 'Supreme Kalbi',
            description: 'The highest grade kalbi cut. Enjoy the premium fat that melts in your mouth',
            minDetail: 'The finest kalbi cut',
            serving: '1 serving',
            part: 'Triangle Rib, Tri-tip',
            origin: 'Shinshu Beef',
            recPeople: null,
            recommended: 'Tare sauce',
            tags: ['Premium', 'Recommended', 'Melt-in-mouth']
        },
        6: {
            name: 'Choice Kalbi (1 serving)',
            shortName: 'Choice Kalbi',
            description: 'Popular kalbi with rich, quality fat.',
            minDetail: 'Moderate fat for a lighter taste',
            serving: '1 serving',
            part: 'Brisket, Chuck Roll',
            origin: 'Shinshu Beef',
            recPeople: null,
            recommended: 'Tare sauce',
            tags: ['Quality', 'Popular', 'Rich Fat']
        },
        7: {
            name: 'Regular Kalbi (1 serving)',
            shortName: 'Regular Kalbi',
            description: 'Thinly sliced large kalbi cuts. Enjoy the balanced flavor and sweetness.',
            minDetail: 'Popular thin-sliced cut!',
            serving: '1 serving',
            part: 'Shoulder Chuck',
            origin: 'Shinshu Beef',
            recPeople: null,
            recommended: 'Tare sauce',
            tags: ['Large Cut', 'Well-balanced', 'Thin Slice']
        },
        8: {
            name: 'Trimmed Kalbi (1 serving)',
            shortName: 'Trimmed Kalbi',
            description: 'Affordable way to enjoy kalbi flavor. Cross-cut for tenderness.',
            minDetail: 'Chewy texture with addictive flavor',
            serving: '1 serving',
            part: 'Shoulder Chuck, Neck',
            origin: 'Shinshu Beef',
            recPeople: null,
            recommended: 'Tare sauce',
            tags: ['Affordable', 'Tender', 'Value']
        },
        9: {
            name: 'Premium Mino (1 serving)',
            shortName: 'Premium Mino',
            description: 'Part of the first stomach. Enjoy the clean taste and satisfying crunchy texture with low fat content.',
            serving: '1 serving',
            part: 'First Stomach',
            origin: 'American',
            recPeople: null,
            recommended: 'Salt',
            tags: ['Crunchy', 'Light', 'Healthy', 'Texture']
        },
        10: {
            name: 'Tetchan (1 serving)',
            shortName: 'Tetchan',
            description: 'Also known as striped intestine. A classic offal dish with moderate fat and satisfying chew. When people say "horumon," they often mean this!',
            serving: '1 serving',
            part: 'Large Intestine',
            origin: 'Shinshu Beef',
            recPeople: null,
            recommended: 'Both Miso & Salt',
            tags: ['Striped Intestine', 'Sweet', 'Savory', 'Popular']
        },
        11: {
            name: 'Kopchan (1 serving)',
            shortName: 'Kopchan',
            description: 'Small intestine with more fat than tetchan but with a sweet, bouncy texture. Pairs perfectly with miso and drinks',
            serving: '1 serving',
            part: 'Small Intestine',
            origin: 'Shinshu Beef',
            recPeople: null,
            recommended: 'Both Miso & Salt',
            tags: ['Bouncy', 'Miso Flavor', 'Pairs with Drinks', 'Maruchan']
        },
        12: {
            name: 'Giara (1 serving)',
            shortName: 'Giara',
            description: 'Also called red tripe, this is the fourth stomach. An offal with enjoyable texture!',
            serving: '1 serving',
            part: 'Fourth Stomach',
            origin: 'Shinshu Beef',
            recPeople: null,
            recommended: 'Miso',
            tags: ['Red Tripe', 'Savory', 'Light']
        },
        13: {
            name: 'Morioka Cold Noodles',
            shortName: 'Cold Noodles',
            description: 'Perfect for finishing your meal! Authentic cold noodles with smooth, slippery texture. Refreshing and delicious!',
            minDetail: 'Please note the serving size!',
            serving: '1 serving',
            part: null,
            origin: null,
            recPeople: 'For a refreshing finish',
            recommended: 'Add vinegar to taste',
            tags: ['Finisher', 'Refreshing', 'Smooth', 'Authentic']
        },
        14: {
            name: 'Kuppa',
            shortName: 'Kuppa',
            description: 'A comforting dish of rice in egg soup. Perfect for finishing your meal.',
            minDetail: 'Please note the serving size!',
            serving: '1 serving',
            part: null,
            origin: 'Japanese Rice',
            recPeople: null,
            recommended: 'As is',
            tags: ['Finisher', 'Warming', 'Mild', 'Egg Soup']
        },
    }
};

export default en;
