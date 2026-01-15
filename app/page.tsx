import { getTemplates } from "@/lib/data-source";
import MainClient from './components/MainClient'; // 방금 만든 컴포넌트

// 데이터 가져오기 (서버 사이드 로직 유지)
export default async function Home() {
  try {
    const allPlaces = await getTemplates() || [];
    
    // 안전하게 필터링 (배열이 아니면 빈 배열 사용)
    const safePlaces = Array.isArray(allPlaces) ? allPlaces : [];
    const places = safePlaces.filter((place: any) => {
      try {
        return !place?.status || place.status === 'PUBLISHED';
      } catch {
        return false;
      }
    });

    // 데이터를 클라이언트 컴포넌트로 전달
    return <MainClient places={places || []} />;
  } catch (error) {
    // 에러 발생 시 빈 배열로 렌더링 (500 에러 방지)
    console.error('Error loading home page:', error);
    return <MainClient places={[]} />;
  }
}
