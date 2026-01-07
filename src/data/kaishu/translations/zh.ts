import type { StoreTranslations } from '../../types';

export const zh: StoreTranslations = {
    categories: {
        1: { name: '主菜单', description: '配柠檬享用的优质部位' },
        2: { name: '牛五花', description: '从特选到普通，品种丰富' },
        3: { name: '拼盘', description: '可一次品尝多种部位的超值套餐' },
        4: { name: '内脏', description: '新鲜内脏，口感脆嫩，风味十足' },
        5: { name: '收尾菜品', description: '冷面和汤饭为您的用餐画上句号' },
    },
    products: {
        1: {
            name: '牛五花拼盘（2-3人份）',
            shortName: '牛五花拼盘',
            description: '特选牛五花、上等牛五花、普通牛五花、边角牛五花，一盘尽享！\n请品尝比较各种牛五花的风味和嫩度！',
            minDetail: '可品尝4种牛五花！',
            serving: '2-3人份',
            part: '牛五花（4种）',
            origin: null,
            recPeople: '想要品尝比较\n各种牛五花的客人',
            recommended: '酱汁',
            tags: ['牛五花合集', '品尝比较', '4种', '推荐']
        },
        2: {
            name: '九种拼盘（2-3人份）',
            shortName: '九种拼盘',
            description: '精选9种内脏供您享用。\n搭配特制盐酱，尽情品味。',
            minDetail: '可品尝多种部位。',
            serving: '2-3人份',
            part: '百叶芯、喉头、舌根、鸡颈、蜂巢胃、软骨、心脏等',
            origin: null,
            recPeople: '想尝试珍稀内脏的客人',
            recommended: '特制盐酱',
            tags: ['内脏', '多样', '精选', '9种']
        },
        3: {
            name: '家庭套餐（4-5人份）',
            shortName: '家庭套餐',
            description: '包含人气牛舌、横膈膜，以及普通牛五花、大肠、土鸡、香肠，配特制味噌酱尽情享用',
            minDetail: '多种肉类组合的超值一盘！',
            serving: '4-5人份',
            part: '牛舌、横膈膜、牛五花、内脏、土鸡、香肠等',
            origin: null,
            recPeople: '家庭或多人聚餐',
            recommended: '特制柚子醋酱',
            tags: ['家庭装', '多样', '超值', '套餐']
        },
        4: {
            name: '上等盐烤牛舌（1人份）',
            shortName: '上等牛舌',
            description: '牛舌中的优质部位。配柠檬食用，适度的油脂在口中散开。',
            serving: '1人份',
            part: '牛舌',
            origin: '澳大利亚产',
            recPeople: null,
            recommended: '盐・柠檬',
            tags: ['优质', '清爽', '人气']
        },
        5: {
            name: '特选牛五花（1人份）',
            shortName: '特选牛五花',
            description: '牛五花的最高级部位。请享受入口即化的优质油脂',
            minDetail: '牛五花中的最高级部位',
            serving: '1人份',
            part: '三角肥牛、牛腿三角',
            origin: '信州牛',
            recPeople: null,
            recommended: '酱汁',
            tags: ['高级', '推荐', '入口即化']
        },
        6: {
            name: '上等牛五花（1人份）',
            shortName: '上等牛五花',
            description: '可享受优质油脂风味的人气牛五花。',
            minDetail: '油脂适中，口感清爽',
            serving: '1人份',
            part: '胸腹肉、肩里脊',
            origin: '信州牛',
            recPeople: null,
            recommended: '酱汁',
            tags: ['优质', '人气', '油脂风味']
        },
        7: {
            name: '普通牛五花（1人份）',
            shortName: '普通牛五花',
            description: '薄切大片牛五花。可均衡品味牛五花独特的风味和甜味。',
            minDetail: '薄切大人气商品！',
            serving: '1人份',
            part: '肩腹肉',
            origin: '信州牛',
            recPeople: null,
            recommended: '酱汁',
            tags: ['大片', '均衡', '薄切']
        },
        8: {
            name: '边角牛五花（1人份）',
            shortName: '边角牛五花',
            description: '实惠价格品味牛五花美味。因有切口处理，肉质柔软美味。',
            minDetail: '有嚼劲，风味让人上瘾',
            serving: '1人份',
            part: '肩腹肉、颈肉',
            origin: '信州牛',
            recPeople: null,
            recommended: '酱汁',
            tags: ['实惠', '柔软', '超值']
        },
        9: {
            name: '上等毛肚（1人份）',
            shortName: '上等毛肚',
            description: '牛第一胃的一部分。味道清淡，口感脆嫩有弹性，脂肪少，清爽可口。',
            serving: '1人份',
            part: '牛第一胃',
            origin: '美国产',
            recPeople: null,
            recommended: '盐',
            tags: ['脆嫩', '清爽', '健康', '口感']
        },
        10: {
            name: '大肠（1人份）',
            shortName: '大肠',
            description: '又称条纹肠，是牛的大肠。适度的油脂和嚼劲是经典菜品！说到"内脏"通常指的就是它！',
            serving: '1人份',
            part: '牛大肠',
            origin: '信州牛',
            recPeople: null,
            recommended: '味噌・盐皆可',
            tags: ['条纹肠', '甜味', '鲜味', '人气']
        },
        11: {
            name: '小肠（1人份）',
            shortName: '小肠',
            description: '比大肠油脂更多但带甜味的Q弹口感牛小肠。味噌味小肠配酒绝佳',
            serving: '1人份',
            part: '牛小肠',
            origin: '信州牛',
            recPeople: null,
            recommended: '味噌・盐皆可',
            tags: ['Q弹', '味噌味', '配酒佳品', '圆肠']
        },
        12: {
            name: '皱胃（1人份）',
            shortName: '皱胃',
            description: '又称红百叶，是牛的第四胃。口感丰富的内脏！',
            serving: '1人份',
            part: '牛第四胃',
            origin: '信州牛',
            recPeople: null,
            recommended: '味噌',
            tags: ['红百叶', '鲜味', '清爽']
        },
        13: {
            name: '盛冈冷面',
            shortName: '盛冈冷面',
            description: '收尾必备！口感滑溜的正宗冷面。清爽美味！',
            minDetail: '请注意商品大小！',
            serving: '1人份',
            part: null,
            origin: null,
            recPeople: '寻找清爽收尾的客人',
            recommended: '可根据喜好加醋食用',
            tags: ['收尾', '清爽', '滑溜', '正宗']
        },
        14: {
            name: '汤泡饭',
            shortName: '汤泡饭',
            description: '蛋花汤配米饭的暖心一品。最适合作为用餐的收尾。',
            minDetail: '请注意商品大小！',
            serving: '1人份',
            part: null,
            origin: '日本国产米',
            recPeople: null,
            recommended: '直接食用',
            tags: ['收尾', '暖心', '温和', '蛋花汤']
        },
    }
};

export default zh;
