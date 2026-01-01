import { useTranslation } from 'react-i18next';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: string;
  header: string;
  headerAr: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchKey?: keyof T;
  searchPlaceholder?: string;
  searchPlaceholderAr?: string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  emptyMessageAr?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchKey,
  searchPlaceholder = 'Search...',
  searchPlaceholderAr = 'بحث...',
  onRowClick,
  emptyMessage = 'No data available',
  emptyMessageAr = 'لا توجد بيانات',
}: DataTableProps<T>) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [search, setSearch] = useState('');

  const filteredData = useMemo(() => {
    if (!search || !searchKey) return data;
    return data.filter((item) => {
      const value = item[searchKey];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(search.toLowerCase());
      }
      return false;
    });
  }, [data, search, searchKey]);

  return (
    <div className="space-y-3 sm:space-y-4">
      {searchKey && (
        <div className="relative max-w-full sm:max-w-sm">
          <Search className="absolute start-2 sm:start-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isRTL ? searchPlaceholderAr : searchPlaceholder}
            className="ps-8 sm:ps-10 text-sm h-9 sm:h-10"
          />
        </div>
      )}

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {columns.map((col) => (
                <TableHead key={col.key} className={cn("text-xs sm:text-sm font-medium", col.className)}>
                  {isRTL ? col.headerAr : col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-6 sm:py-8 text-xs sm:text-sm text-muted-foreground">
                  {isRTL ? emptyMessageAr : emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item, index) => (
                <TableRow
                  key={item.id || index}
                  className={onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((col) => (
                    <TableCell key={col.key} className={cn("text-xs sm:text-sm", col.className)}>
                      {col.render ? col.render(item) : item[col.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-xs sm:text-sm text-muted-foreground">
        {isRTL ? `عرض ${filteredData.length} من ${data.length}` : `Showing ${filteredData.length} of ${data.length}`}
      </div>
    </div>
  );
}

