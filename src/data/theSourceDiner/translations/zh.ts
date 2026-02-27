import type { StoreTranslations } from '../../types';

export const zh: StoreTranslations = {
    categories: {
        1: { name: '精选菜单', description: '请看本月限定商品！' },
        2: { name: '每月特选菜单', description: '请看本月限定商品！' },
        3: { name: '店主推荐', description: '请看我们的招牌推荐菜品！' },
    },
    products: {
        1: {
            name: '香辣肠与马苏里拉芝士异域风情汉堡',
            shortName: '2月月度汉堡',
            description: '香辣肠与融化的马苏里拉芝士完美结合的异域风情汉堡。\n请享受微辣香辣肠的鲜美与奶香马苏里拉的和谐搭配！',
            minDetail: '辣味×芝士，绝妙组合！',
            serving: '1人份',
            part: '香辣肠・马苏里拉芝士',
            origin: null,
            recPeople: '喜欢\n辛辣料理的客人',
            recommended: '异域风情酱汁',
            tags: ['辛辣', '异域', '香辣肠', '限时']
        },
        2: {
            name: '肉丸周日酱汁宽面',
            shortName: '2月月度意面',
            description: '多汁肉丸与浓郁周日酱汁交融的宽面条。\n请享受Q弹的宽面和量足的肉丸！',
            minDetail: '浓郁酱汁×Q弹意面！',
            serving: '1人份',
            part: '肉丸・宽面',
            origin: null,
            recPeople: '意面爱好者',
            recommended: '帕玛森芝士',
            tags: ['意面', '肉丸', '浓郁', '限时']
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
    }
};

export default zh;
