import type { StoreTranslations } from '../../types';

export const ko: StoreTranslations = {
    categories: {
        1: { name: '월간 메뉴', description: '이번 달만 즐길 수 있는 메뉴를 확인해 보세요!' },
        3: { name: '점주 추천', description: '점주 추천 메뉴를 확인해 보세요!' },
    },
    products: {
        1: {
            name: '봄 채소 크림 차우더풍 크림 소스 페투치네',
            shortName: '3월 월간 파스타',
            description: '제철 봄 채소를 듬뿍 사용한 크림 차우더풍 진한 소스가 쫄깃한 페투치네와 어우러지는 최고의 파스타!\n채소의 달콤함과 크리미한 소스의 하모니를 즐겨보세요.',
            minDetail: '봄 채소×진한 크림 소스!',
            serving: '1인분',
            part: '봄 채소・페투치네',
            origin: null,
            recPeople: '봄 채소나 크림 계열\n파스타를 좋아하는 분',
            recommended: '파르메산 치즈',
            tags: ['봄채소', '크림', '파스타', '기간한정']
        },
        2: {
            name: '프라이드 치킨 버거 자가제 칠리 오일',
            shortName: '3월 월간 버거',
            description: '바삭하게 튀긴 프라이드 치킨에 자가제 칠리 오일을 듬뿍 얹은 든든하고 최고의 메뉴!\n매콤한 감칠맛과 바삭한 치킨의 식감이 절묘하게 어우러지는 3월 한정 월간 버거입니다.',
            minDetail: '매콤 칠리 오일×바삭 치킨!',
            serving: '1인분',
            part: '프라이드 치킨・자가제 칠리 오일',
            origin: null,
            recPeople: '매콤한 치킨 요리를\n좋아하는 분',
            recommended: '자가제 칠리 오일',
            tags: ['매콤', '프라이드치킨', '칠리오일', '기간한정']
        },
        4: {
            name: '치즈버거',
            shortName: '치즈버거',
            description: '녹진한 치즈와 육즙 가득한 패티의 정통 치즈버거.\n심플하면서도 재료의 맛이 돋보이는 점주의 자신작입니다.',
            serving: '1인분',
            part: '비프 패티・치즈',
            origin: null,
            recPeople: '치즈를 듬뿍\n올린 버거를 즐기고 싶은 분',
            recommended: '케첩・머스타드',
            tags: ['정통', '치즈', '육즙', '추천']
        },
        3: {
            name: '양고기 덤플링 (마라 소스)',
            shortName: '양고기 덤플링',
            description: '양고기의 풍미가 가득 담긴 덤플링을 얼얼한 마라 소스로 즐겨보세요.\n찌릿한 자극과 양고기의 깊은 맛이 자꾸 생각나는 메뉴입니다.',
            minDetail: '얼얼한 매운맛이 자꾸 생각나!',
            serving: '1인분',
            part: '양고기',
            origin: null,
            recPeople: '매운 요리나\n양고기를 좋아하는 분',
            recommended: '마라 소스',
            tags: ['양고기', '덤플링', '매콤', '추천']
        },
    }
};

export default ko;
