import React, { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { menuListState, categoryFilterState } from '../store/atoms';

const MenuList: React.FC = () => {
  const menus = useRecoilValue(menuListState);
  const filter = useRecoilValue(categoryFilterState);

  // [Team Comment 반영] 불필요한 리렌더링 방지를 위해 useMemo 활용
  // 데이터 양이 많아질 경우를 대비해 필터링 로직 메모이제이션
  const filteredMenus = useMemo(() => {
    if (filter === 'ALL') return menus;
    return menus.filter((menu) => menu.category === filter);
  }, [menus, filter]);

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'KOREAN': return '한식';
      case 'CHINESE': return '중식';
      case 'JAPANESE': return '일식';
      case 'WESTERN': return '양식';
      default: return '기타';
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {filteredMenus.length > 0 ? (
        filteredMenus.map((menu) => (
          <div
            key={menu.id}
            className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 flex flex-col items-center justify-center h-32"
          >
            <span className="text-xs font-bold text-blue-500 mb-1">
              {getCategoryLabel(menu.category)}
            </span>
            <h3 className="text-lg font-bold text-gray-800">{menu.name}</h3>
          </div>
        ))
      ) : (
        <div className="col-span-full text-center py-10 text-gray-500">
          해당 카테고리의 메뉴가 없습니다.
        </div>
      )}
    </div>
  );
};

export default MenuList;