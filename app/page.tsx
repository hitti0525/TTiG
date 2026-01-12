import { getTemplates } from "@/lib/data-source";
import MainClient from './components/MainClient'; // 방금 만든 컴포넌트

// 데이터 가져오기 (서버 사이드 로직 유지)
export default async function Home() {
  const allPlaces = await getTemplates() || [];
  // PUBLISHED 상태만 표시 (Master Plan: Draft → Proposal → Publish)
  const places = allPlaces.filter((place: any) => !place.status || place.status === 'PUBLISHED');

  // 데이터를 클라이언트 컴포넌트로 전달
  return <MainClient places={places} />;
}
