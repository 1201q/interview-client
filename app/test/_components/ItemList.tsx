interface Props<T> {
  data: T[];
  renderItem: (item: T) => React.ReactNode;
  emptyComponent?: React.ReactNode;
  sortFn?: (a: T, b: T) => number;
}

const ItemList = async <T,>({
  data,
  renderItem,
  emptyComponent = <div>없음.</div>,
  sortFn = (a, b) =>
    new Date((b as any).created_at).getTime() -
    new Date((a as any).created_at).getTime(),
}: Props<T>) => {
  // await new Promise((resolve) => setTimeout(resolve, 500));

  const sortedData = [...data].sort(sortFn);

  if (sortedData.length === 0) return <>{emptyComponent}</>;

  return <>{sortedData.map(renderItem)}</>;
};

export default ItemList;
