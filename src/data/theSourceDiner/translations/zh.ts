import type { StoreTranslations } from '../../types';

export const zh: StoreTranslations = {
    categories: {
        3: { name: '店主推荐', description: '请看我们的招牌推荐菜品！' },
    },
    products: {
        4: {
            name: '芝士汉堡',
            shortName: '芝士汉堡',
            description: '融化的芝士与多汁肉排的经典芝士汉堡。\n简单却充分彰显食材美味的店主精心之作。',
            serving: '1人份',
            part: '牛肉饼・芝士',
            origin: null,
            recPeople: '想享用满满芝士\n与汉堡的客人',
            recommended: '番茄酱・黄芥末',
            tags: ['经典', '芝士', '多汁', '推荐']
        },
        3: {
            name: '羊肉饺子（麻辣酱）',
            shortName: '羊肉饺子',
            description: '充满羊肉鲜美的饺子，配上令人麻辣的麻辣酱享用。\n麻辣的刺激感与羊肉深邃的风味让人欲罢不能。',
            minDetail: '麻辣的刺激令人上瘾！',
            serving: '1人份',
            part: '羊肉',
            origin: null,
            recPeople: '喜欢辣味料理\n或羊肉的客人',
            recommended: '麻辣酱',
            tags: ['羊肉', '饺子', '微辣', '推荐']
        },
    }
};

export default zh;
