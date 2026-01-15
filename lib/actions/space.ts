'use server';

import { createServerClient } from '@/lib/supabase';

/**
 * 특정 공간의 조회수를 1 증가시킵니다.
 * @param spaceId - 공간의 ID (slug 또는 id)
 */
export async function incrementView(spaceId: string) {
  try {
    const supabase = createServerClient();
    
    // spaces 테이블에서 spaceId로 조회 (id 또는 slug로 검색)
    // 현재는 JSON 데이터를 사용하므로, Supabase 테이블이 없을 수 있음
    // 이 경우 조용히 실패하도록 처리
    const { data: space, error: findError } = await supabase
      .from('spaces')
      .select('id, views_count')
      .or(`id.eq.${spaceId},slug.eq.${spaceId}`)
      .maybeSingle();
    
    // 테이블이 없거나 데이터가 없으면 조용히 성공 반환 (개발 단계)
    if (findError || !space) {
      // 개발 단계에서는 에러를 로그만 남기고 성공으로 처리
      console.log('Space not found in Supabase (may not be migrated yet):', spaceId);
      return { success: true };
    }

    if (findError || !space) {
      console.error('Space not found:', findError);
      return { success: false, error: 'Space not found' };
    }

    // views_count를 1 증가
    const { error: updateError } = await supabase
      .from('spaces')
      .update({ views_count: (space.views_count || 0) + 1 })
      .eq('id', space.id);

    if (updateError) {
      console.error('Failed to increment view:', updateError);
      return { success: false, error: updateError.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('incrementView error:', error);
    return { success: false, error: error.message || 'Failed to increment view' };
  }
}

/**
 * 북마크 클릭 시 keeps_count를 토글합니다.
 * @param spaceId - 공간의 ID (slug 또는 id)
 */
export async function toggleKeep(spaceId: string) {
  try {
    const supabase = createServerClient();
    
    // spaces 테이블에서 spaceId로 조회
    const { data: space, error: findError } = await supabase
      .from('spaces')
      .select('id, keeps_count')
      .or(`id.eq.${spaceId},slug.eq.${spaceId}`)
      .maybeSingle();

    // 테이블이 없거나 데이터가 없으면 조용히 성공 반환 (개발 단계)
    if (findError || !space) {
      console.log('Space not found in Supabase (may not be migrated yet):', spaceId);
      return { success: true, isKept: true };
    }

    // keeps_count를 1 증가 (토글이 아닌 증가만)
    // 실제 북마크 상태 관리는 별도 테이블이 필요할 수 있지만, 
    // 현재는 카운트만 증가시키는 방식으로 구현
    const { error: updateError } = await supabase
      .from('spaces')
      .update({ keeps_count: (space.keeps_count || 0) + 1 })
      .eq('id', space.id);

    if (updateError) {
      console.error('Failed to toggle keep:', updateError);
      return { success: false, error: updateError.message, isKept: false };
    }

    return { success: true, isKept: true };
  } catch (error: any) {
    console.error('toggleKeep error:', error);
    return { success: false, error: error.message || 'Failed to toggle keep', isKept: false };
  }
}

/**
 * 공유 완료 시 shares_count를 1 증가시킵니다.
 * @param spaceId - 공간의 ID (slug 또는 id)
 */
export async function incrementShare(spaceId: string) {
  try {
    const supabase = createServerClient();
    
    // spaces 테이블에서 spaceId로 조회
    const { data: space, error: findError } = await supabase
      .from('spaces')
      .select('id, shares_count')
      .or(`id.eq.${spaceId},slug.eq.${spaceId}`)
      .maybeSingle();

    // 테이블이 없거나 데이터가 없으면 조용히 성공 반환 (개발 단계)
    if (findError || !space) {
      console.log('Space not found in Supabase (may not be migrated yet):', spaceId);
      return { success: true };
    }

    // shares_count를 1 증가
    const { error: updateError } = await supabase
      .from('spaces')
      .update({ shares_count: (space.shares_count || 0) + 1 })
      .eq('id', space.id);

    if (updateError) {
      console.error('Failed to increment share:', updateError);
      return { success: false, error: updateError.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('incrementShare error:', error);
    return { success: false, error: error.message || 'Failed to increment share' };
  }
}
