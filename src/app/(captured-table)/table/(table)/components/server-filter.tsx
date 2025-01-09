import { PaginationState, ColumnFiltersState } from '@tanstack/react-table';

export function ConvertFilterToQueryString(url:URL, filter:ColumnFiltersState) {
  // array 타입이 아닌 column value가 추가되면 아래 조건 변경 필요
  const isFilterEmpty = filter.every(
    (f) => Array.isArray(f.value) && f.value.length === 0,
  );
  if (isFilterEmpty) {
    url.searchParams.delete('filter');
  } else {
    const filterString = filter.reduce((acc, f) => {
      const filterKey = f.id;
      if (typeof (f.value) === 'boolean') {
        return { ...acc, [filterKey]: f.value };
      }
      const filterValue = f.value as string[];
      return filterValue.length > 0 ? { ...acc, [filterKey]: filterValue } : acc;
    }, {});

    const preFilter = url.searchParams.get('filter');
    const currFilter = JSON.stringify(filterString);

    if (preFilter !== currFilter) {
      url.searchParams.set('filter', JSON.stringify(filterString));
      url.searchParams.delete('page');
    }
  }
}

export function ConvertPageToQueryString(url:URL, page:PaginationState) {
  if (page.pageIndex === 0) {
    url.searchParams.delete('page');
  } else {
    url.searchParams.set('page', (page.pageIndex + 1).toString());
  }
}
