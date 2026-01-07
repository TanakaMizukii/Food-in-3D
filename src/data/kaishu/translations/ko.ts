import type { StoreTranslations } from '../../types';

export const ko: StoreTranslations = {
    categories: {
        1: { name: '메인 메뉴', description: '레몬과 함께 즐기는 고급 부위' },
        2: { name: '갈비', description: '특상부터 일반까지 다양한 구성' },
        3: { name: '모듬', description: '다양한 부위를 한 번에 즐길 수 있는 알뜬 세트' },
        4: { name: '곱창', description: '쫄깃한 식감과 감칠맛이 자랑인 신선한 곱창' },
        5: { name: '마무리 메뉴', description: '식사 마무리를 장식하는 냉면과 국밥' },
    },
    products: {
        1: {
            name: '갈비 모듬 (2-3인분)',
            shortName: '갈비 모듬',
            description: '특상갈비・상갈비・보통갈비・갈비살이 한 접시에!\n각 갈비의 맛과 부드러움을 비교해 보세요!',
            minDetail: '4종류의 갈비를 즐길 수 있습니다!',
            serving: '2-3인분',
            part: '소갈비 (4종류)',
            origin: null,
            recPeople: '갈비 맛 비교를\n즐기고 싶은 분',
            recommended: '양념장',
            tags: ['갈비 모음', '맛 비교', '4종류', '추천']
        },
        2: {
            name: '9종 모듬 (2-3인분)',
            shortName: '9종 모듬',
            description: '엄선한 9종류의 곱창을 즐기실 수 있습니다.\n특제 소금 양념에 찍어 맛있게 드세요.',
            minDetail: '다양한 부위를 즐기실 수 있습니다.',
            serving: '2-3인분',
            part: '양깃머리・식도・혀뿌리・목살・벌집양・연골・염통 등',
            origin: null,
            recPeople: '희귀한 곱창을 즐기고 싶은 분',
            recommended: '특제 소금 양념',
            tags: ['곱창', '다양함', '엄선', '9종류']
        },
        3: {
            name: '패밀리 세트 (4-5인분)',
            shortName: '패밀리 세트',
            description: '인기 있는 우설・안창살을 비롯해 보통갈비・대창・토종닭・소시지가 특제 된장 양념과 함께',
            minDetail: '다양한 고기가 세트로 된 알뜬 한 접시!',
            serving: '4-5인분',
            part: '우설・안창살・갈비・곱창・토종닭・소시지 등',
            origin: null,
            recPeople: '가족이나 단체 모임',
            recommended: '특제 폰즈 소스',
            tags: ['패밀리용', '다양함', '알뜬', '세트']
        },
        4: {
            name: '상 우설 소금구이 (1인분)',
            shortName: '상 우설',
            description: '우설 중에서도 고급 부위. 레몬과 함께 먹으면 적당한 기름이 입안에 퍼집니다.',
            serving: '1인분',
            part: '우설',
            origin: '호주산',
            recPeople: null,
            recommended: '소금・레몬',
            tags: ['고급', '깔끔', '인기']
        },
        5: {
            name: '특상 갈비 (1인분)',
            shortName: '특상 갈비',
            description: '갈비의 최고급 부위. 입안에서 녹아내리는 고급 기름을 맛보세요',
            minDetail: '갈비 중 최고급 부위',
            serving: '1인분',
            part: '삼각살・토시살',
            origin: '신슈 소',
            recPeople: null,
            recommended: '양념장',
            tags: ['고급', '추천', '입에서 녹는']
        },
        6: {
            name: '상 갈비 (1인분)',
            shortName: '상 갈비',
            description: '고급 지방의 감칠맛을 즐길 수 있는 인기 갈비.',
            minDetail: '적당한 지방량으로 깔끔하게 먹을 수 있습니다',
            serving: '1인분',
            part: '양지・꽃등심',
            origin: '신슈 소',
            recPeople: null,
            recommended: '양념장',
            tags: ['고급', '인기', '지방 감칠맛']
        },
        7: {
            name: '보통 갈비 (1인분)',
            shortName: '보통 갈비',
            description: '얇고 큰 조각으로 슬라이스된 갈비. 갈비 특유의 감칠맛과 단맛을 균형 있게 즐길 수 있습니다.',
            minDetail: '얇게 썬 인기 상품!',
            serving: '1인분',
            part: '어깨살',
            origin: '신슈 소',
            recPeople: null,
            recommended: '양념장',
            tags: ['큰 조각', '균형 잡힌', '얇게 썬']
        },
        8: {
            name: '갈비살 (1인분)',
            shortName: '갈비살',
            description: '합리적인 가격으로 갈비의 맛을 즐길 수 있습니다. 칼집이 들어가 부드럽고 맛있게 드실 수 있습니다.',
            minDetail: '씹는 맛이 있고 중독되는 감칠맛이 인기',
            serving: '1인분',
            part: '어깨살・목살',
            origin: '신슈 소',
            recPeople: null,
            recommended: '양념장',
            tags: ['합리적', '부드러운', '알뜬']
        },
        9: {
            name: '상 양 (1인분)',
            shortName: '상 양',
            description: '소의 첫 번째 위장 일부. 담백한 맛과 쫄깃쫄깃한 식감, 탄력이 있고 지방이 적어 깔끔하게 즐기실 수 있습니다.',
            serving: '1인분',
            part: '소의 첫 번째 위',
            origin: '미국산',
            recPeople: null,
            recommended: '소금',
            tags: ['쫄깃쫄깃', '깔끔', '건강', '식감']
        },
        10: {
            name: '대창 (1인분)',
            shortName: '대창',
            description: '줄창이라고도 불리는 소의 대장. 적당한 기름과 씹는 맛이 있는 정통 메뉴! "곱창"이라고 하면 대창을 가리키는 경우가 많습니다!',
            serving: '1인분',
            part: '소의 대장',
            origin: '신슈 소',
            recPeople: null,
            recommended: '된장・소금 모두',
            tags: ['줄창', '단맛', '감칠맛', '인기']
        },
        11: {
            name: '소창 (1인분)',
            shortName: '소창',
            description: '대창에 비해 기름이 많지만 단맛이 있는 탱글탱글 식감의 소의 소장. 된장맛 소창과 술이 잘 어울립니다',
            serving: '1인분',
            part: '소의 소장',
            origin: '신슈 소',
            recPeople: null,
            recommended: '된장・소금 모두',
            tags: ['탱글탱글', '된장맛', '술 안주로 좋은', '곱창']
        },
        12: {
            name: '막창 (1인분)',
            shortName: '막창',
            description: '빨간 양이라고도 불리는 소의 네 번째 위. 식감을 즐길 수 있는 곱창입니다!',
            serving: '1인분',
            part: '소의 네 번째 위',
            origin: '신슈 소',
            recPeople: null,
            recommended: '된장',
            tags: ['빨간 양', '감칠맛', '깔끔']
        },
        13: {
            name: '모리오카 냉면',
            shortName: '모리오카 냉면',
            description: '마무리로 딱! 쫄깃쫄깃한 식감의 정통 냉면. 깔끔하고 맛있게 드실 수 있습니다!',
            minDetail: '상품 크기에 주의해 주세요!',
            serving: '1인분',
            part: null,
            origin: null,
            recPeople: '깔끔한 마무리를 찾는 분',
            recommended: '기호에 따라 식초를 추가해서 드세요',
            tags: ['마무리', '깔끔', '쫄깃', '정통']
        },
        14: {
            name: '국밥',
            shortName: '국밥',
            description: '계란국에 밥이 들어간 따뜻한 한 그릇. 식사 마무리로 최적입니다.',
            minDetail: '상품 크기에 주의해 주세요!',
            serving: '1인분',
            part: null,
            origin: '일본산 쌀 사용',
            recPeople: null,
            recommended: '그대로',
            tags: ['마무리', '따뜻한', '순한 맛', '계란국']
        },
    }
};

export default ko;
