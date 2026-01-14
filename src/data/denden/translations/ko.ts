import type { StoreTranslations } from '../../types';

export const ko: StoreTranslations = {
    categories: {
        1: { name: '메인 메뉴', description: '덴덴 자랑의 덮밥 메뉴' },
        2: { name: '닭고기 덮밥', description: '육즙 가득한 닭고기 덮밥' },
        3: { name: '카레', description: '덴덴 특제 카레' },
        4: { name: '덮밥', description: '푸짐한 돼지고기 덮밥' },
        5: { name: '닭고기&돼지고기 덮밥', description: '닭고기와 돼지고기를 함께 즐기는 덮밥' },
        6: { name: '기타', description: '오므라이스, 타코라이스 등' },
    },
    products: {
        1: {
            name: '2종 치킨 콤보 덮밥 (보통)',
            shortName: '치킨 콤보 덮밥 보통',
            description: '2종류의 치킨 가라아게를 즐길 수 있는 콤보 덮밥입니다.',
            serving: '보통',
            part: '닭고기',
            origin: null,
            recPeople: '2종류의 가라아게를\n비교하고 싶은 분',
            recommended: '그대로',
            tags: ['치킨 가라아게', '콤보', '인기']
        },
        2: {
            name: '2종 치킨 콤보 덮밥 (특대)',
            shortName: '치킨 콤보 덮밥 특대',
            description: '특대 사이즈 2종류 치킨 가라아게 콤보 덮밥입니다.',
            serving: '특대',
            part: '닭고기',
            origin: null,
            recPeople: '많이 드시고 싶은 분',
            recommended: '그대로',
            tags: ['치킨 가라아게', '콤보', '특대']
        },
        3: {
            name: '2종 치킨 콤보 덮밥 (초대형)',
            shortName: '치킨 콤보 덮밥 초대형',
            description: '초대형 사이즈 2종류 치킨 가라아게 콤보 덮밥입니다.',
            serving: '초대형',
            part: '닭고기',
            origin: null,
            recPeople: '배부르게 드시고 싶은 분',
            recommended: '그대로',
            tags: ['치킨 가라아게', '콤보', '초대형', '볼륨']
        },
        4: {
            name: '마츠모토 산적구이 덮밥 (보통)',
            shortName: '산적구이 덮밥 보통',
            description: '마츠모토 명물 산적구이를 올린 덮밥입니다.',
            serving: '보통',
            part: '닭다리살',
            origin: '나가노현',
            recPeople: '마츠모토 명물을 즐기고 싶은 분',
            recommended: '그대로',
            tags: ['산적구이', '마츠모토 명물', '인기']
        },
        5: {
            name: '마츠모토 산적구이 덮밥 (특대)',
            shortName: '산적구이 덮밥 특대',
            description: '특대 사이즈 마츠모토 명물 산적구이 덮밥입니다.',
            serving: '특대',
            part: '닭다리살',
            origin: '나가노현',
            recPeople: '푸짐하게 명물을 즐기고 싶은 분',
            recommended: '그대로',
            tags: ['산적구이', '마츠모토 명물', '특대']
        },
        6: {
            name: '마츠모토 산적구이 덮밥 (초대형)',
            shortName: '산적구이 덮밥 초대형',
            description: '초대형 사이즈 마츠모토 명물 산적구이 덮밥입니다.',
            serving: '초대형',
            part: '닭다리살',
            origin: '나가노현',
            recPeople: '대식가, 도전하고 싶은 분',
            recommended: '그대로',
            tags: ['산적구이', '마츠모토 명물', '초대형', '볼륨']
        },
        7: {
            name: '토치 치즈 치킨 토마토소스 덮밥 (보통)',
            shortName: '치즈 치킨 덮밥 보통',
            description: '토치 치즈와 토마토소스가 절묘하게 어울리는 치킨 덮밥입니다.',
            serving: '보통',
            part: '닭고기',
            origin: null,
            recPeople: '치즈와 토마토의\n조합을 좋아하는 분',
            recommended: '그대로',
            tags: ['치즈', '토마토소스', '토치']
        },
        8: {
            name: '토치 치즈 치킨 토마토소스 덮밥 (특대)',
            shortName: '치즈 치킨 덮밥 특대',
            description: '특대 사이즈 토치 치즈 토마토소스 치킨 덮밥입니다.',
            serving: '특대',
            part: '닭고기',
            origin: null,
            recPeople: '진한 맛을 좋아하는 분',
            recommended: '그대로',
            tags: ['치즈', '토마토소스', '특대']
        },
        9: {
            name: '마츠모토 산적 카레 (보통)',
            shortName: '산적 카레 보통',
            description: '산적구이를 토핑한 특제 카레입니다.',
            serving: '보통',
            part: '닭다리살',
            origin: null,
            recPeople: '푸짐한 카레를 좋아하는 분',
            recommended: '그대로',
            tags: ['산적구이', '카레', '인기']
        },
        10: {
            name: '마츠모토 산적 카레 (특대)',
            shortName: '산적 카레 특대',
            description: '특대 사이즈 산적구이 특제 카레입니다.',
            serving: '특대',
            part: '닭다리살',
            origin: null,
            recPeople: '기력을 보충하고 싶은 분',
            recommended: '그대로',
            tags: ['산적구이', '카레', '특대']
        },
        11: {
            name: '마츠모토 산적 카레 (초대형)',
            shortName: '산적 카레 초대형',
            description: '초대형 사이즈 산적구이 특제 카레입니다.',
            serving: '초대형',
            part: '닭다리살',
            origin: null,
            recPeople: '카레를 푸짐하게 드시고 싶은 분',
            recommended: '그대로',
            tags: ['산적구이', '카레', '초대형', '볼륨']
        },
        12: {
            name: '계란 프라이 카레 (보통)',
            shortName: '계란 프라이 카레 보통',
            description: '반숙 계란 프라이를 올린 카레입니다.',
            serving: '보통',
            part: null,
            origin: null,
            recPeople: '심플한 카레를 좋아하는 분',
            recommended: '그대로',
            tags: ['계란 프라이', '카레', '심플']
        },
        13: {
            name: '돼지 삼겹살 야끼니꾸 덮밥 (보통)',
            shortName: '돼지 삼겹살 덮밥 보통',
            description: '육즙 가득한 돼지 삼겹살을 야끼니꾸 스타일로 올린 덮밥입니다.',
            serving: '보통',
            part: '돼지 삼겹살',
            origin: null,
            recPeople: '육즙 가득한 삼겹살을 좋아하는 분',
            recommended: '그대로',
            tags: ['돼지 삼겹살', '야끼니꾸', '육즙']
        },
        14: {
            name: '돼지 삼겹살 야끼니꾸 덮밥 (특대)',
            shortName: '돼지 삼겹살 덮밥 특대',
            description: '특대 사이즈 육즙 가득한 돼지 삼겹살 야끼니꾸 덮밥입니다.',
            serving: '특대',
            part: '돼지 삼겹살',
            origin: null,
            recPeople: '돼지고기를 푸짐하게 드시고 싶은 분',
            recommended: '그대로',
            tags: ['돼지 삼겹살', '야끼니꾸', '특대']
        },
        15: {
            name: '돼지 생강구이&치킨 가라아게 덮밥 (보통)',
            shortName: '생강구이&치킨 덮밥 보통',
            description: '돼지 생강구이와 치킨 가라아게를 둘 다 즐길 수 있는 욕심쟁이 덮밥입니다.',
            serving: '보통',
            part: '돼지고기・닭고기',
            origin: null,
            recPeople: '돼지고기와 닭고기를\n둘 다 즐기고 싶은 분',
            recommended: '그대로',
            tags: ['생강구이', '치킨 가라아게', '콤보']
        },
        16: {
            name: '돼지 생강구이&치킨 가라아게 덮밥 (특대)',
            shortName: '생강구이&치킨 덮밥 특대',
            description: '특대 사이즈 돼지 생강구이와 치킨 가라아게 욕심쟁이 덮밥입니다.',
            serving: '특대',
            part: '돼지고기・닭고기',
            origin: null,
            recPeople: '다양하게 푸짐하게 드시고 싶은 분',
            recommended: '그대로',
            tags: ['생강구이', '치킨 가라아게', '특대']
        },
        17: {
            name: '덴덴 특제 오므라이스',
            shortName: '특제 오므라이스',
            description: '덴덴 특제 폭신폭신 오므라이스입니다.',
            serving: '보통',
            part: null,
            origin: null,
            recPeople: '폭신폭신 오므라이스를 좋아하는 분',
            recommended: '그대로',
            tags: ['오므라이스', '폭신폭신', '특제']
        },
        18: {
            name: '오리지널 소스 돈까스 덮밥',
            shortName: '소스 돈까스 덮밥',
            description: '오리지널 소스로 맛을 낸 돈까스 덮밥입니다.',
            serving: '보통',
            part: '돼지 등심',
            origin: null,
            recPeople: '소스 돈까스 덮밥을 좋아하는 분',
            recommended: '그대로',
            tags: ['소스 돈까스 덮밥', '오리지널', '인기']
        },
        20: {
            name: '함버거 로코모코 덮밥',
            shortName: '로코모코 덮밥',
            description: '함버거와 계란 프라이를 올린 하와이안 스타일 덮밥입니다.',
            serving: '보통',
            part: null,
            origin: null,
            recPeople: '오리지널 로코모코 덮밥을 드시고 싶은 분',
            recommended: '그대로',
            tags: ['로코모코', '함버거', '하와이안']
        },
    }
};

export default ko;
