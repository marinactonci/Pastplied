import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NumberOfItemsForPaginationProps {
  pageSize: number;
  setPageSize: (size: number) => void;
}

function NumberOfItemsForPagination({
  pageSize,
  setPageSize,
}: NumberOfItemsForPaginationProps) {
  const handlePageSizeChange = (value: string) => {
    setPageSize(parseInt(value));
  };

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
        <SelectTrigger className="w-auto h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="6">6</SelectItem>
          <SelectItem value="9">9</SelectItem>
          <SelectItem value="12">12</SelectItem>
          <SelectItem value="18">18</SelectItem>
          <SelectItem value="24">24</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default NumberOfItemsForPagination;
