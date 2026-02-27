import type { StoreTranslations } from '../../types';

export const ko: StoreTranslations = {
    categories: {
        1: { name: '셀렉트 메뉴', description: '이번 달만 즐길 수 있는 메뉴를 확인해 보세요!' },
        2: { name: '월간 메뉴', description: '이번 달만 즐길 수 있는 메뉴를 확인해 보세요!' },
        3: { name: '점주 추천', description: '점주 추천 메뉴를 확인해 보세요!' },
    },
    products: {
        1: {
            name: '초리소와 모짜렐라 에스닉 버거',
            shortName: '2월 먼슬리 버거',
            description: '스파이시한 초리소와 녹진한 모짜렐라 치즈가 완벽하게 어우러진 에스닉풍 버거.\n살짝 매콤한 초리소의 풍미와 크리미한 모짜렐라의 하모니를 즐겨보세요!',
            minDetail: '스파이시×치즈의 절묘한 조합!',
            serving: '1인분',
            part: '초리소・모짜렐라 치즈',
            origin: null,
            recPeople: '매운 요리를\n좋아하는 분',
            recommended: '에스닉 소스',
            tags: ['스파이시', '에스닉', '초리소', '기간 한정']
        },
        2: {
            name: '미트볼 선데이 소스 페투치네',
            shortName: '2월 먼슬리 파스타',
            description: '육즙 가득한 미트볼과 진한 선데이 소스가 어우러진 페투치네.\n쫄깃한 넓적 파스타와 푸짐한 미트볼을 즐겨보세요!',
            minDetail: '진한 소스×쫄깃한 파스타!',
            serving: '1인분',
            part: '미트볼・페투치네',
            origin: null,
            recPeople: '파스타를 좋아하는 분',
            recommended: '파르메산 치즈',
            tags: ['파스타', '미트볼', '진한', '기간 한정']
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
    }
};

export default ko;
