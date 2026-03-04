import type { StoreTranslations } from '../../types';

export const ko: StoreTranslations = {
    categories: {
        3: { name: '점주 추천', description: '점주 추천 메뉴를 확인해 보세요!' },
    },
    products: {
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
