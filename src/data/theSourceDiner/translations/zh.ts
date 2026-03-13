import type { StoreTranslations } from '../../types';

export const zh: StoreTranslations = {
    categories: {
        1: { name: '每月特选菜单', description: '快来看看本月限定商品！' },
        3: { name: '店主推荐', description: '请看我们的招牌推荐菜品！' },
    },
    products: {
        1: {
            name: '炸鸡汉堡　自制香辣油风味',
            shortName: '3月月度汉堡',
            description: '酥脆炸鸡上铺满自制香辣油，份量十足、令人大满足的绝品！\n辣味鲜香与酥脆鸡肉的口感完美融合，是3月限定的月度汉堡。',
            minDetail: '香辣油×酥脆炸鸡！',
            serving: '1人份',
            part: '炸鸡・自制香辣油',
            origin: null,
            recPeople: '喜欢香辣鸡肉料理\n的客人',
            recommended: '自制香辣油',
            tags: ['香辣', '炸鸡', '香辣油', '限时供应']
        },
        2: {
            name: '春季蔬菜奶油浓汤风奶油酱宽面',
            shortName: '3月月度意面',
            description: '以当季春季蔬菜为主角的浓郁奶油浓汤风酱汁，与劲道的宽面完美交融，堪称至高无上的意面！\n请享受时令蔬菜的甜味与奶香酱汁的和谐搭配。',
            minDetail: '春季蔬菜×浓郁奶油酱！',
            serving: '1人份',
            part: '春季蔬菜・宽面',
            origin: null,
            recPeople: '喜欢春季蔬菜或\n奶油意面的客人',
            recommended: '帕尔马干酪',
            tags: ['春季蔬菜', '奶油', '意面', '限时供应']
        },
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
