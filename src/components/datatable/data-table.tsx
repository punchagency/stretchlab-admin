"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { Button as Button2, Input } from "@/components/shared";
import { useState } from "react";
import {
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
} from "@tanstack/react-table";
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
// } from "@radix-ui/react-dropdown-menu";
import { SvgIcon } from "../shared";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

interface DataTableProps<TData extends { id: number | string }, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  handleModal?: () => void;
  note?: boolean;
  emptyText?: string;
  handleClick?: (id: number) => void;
  className?: string;
  tableContainerClassName?: string;
  tableClassName?: string;
  // New props for enhanced functionality
  enableSorting?: boolean;
  enableSearch?: boolean;
  searchFields?: string[];
  searchPlaceholder?: string;
}

export function DataTable<TData extends { id: number | string }, TValue>({
  columns,
  data,
  handleModal,
  handleClick,
  note = false,
  emptyText = "No data found",
  className,
  tableContainerClassName,
  tableClassName,
  enableSorting = false,
  enableSearch = false,
  searchFields = [],
  searchPlaceholder = "Search...",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState("");
  // Custom global filter function for multi-field search
  const customGlobalFilterFn = (row: any, _columnId: string, filterValue: string) => {
    if (!enableSearch || !filterValue) return true;
    
    const searchLower = filterValue.toLowerCase();
    const fieldsToSearch = searchFields.length > 0 ? searchFields : Object.keys(row.original);
    
    return fieldsToSearch.some((field) => {
      const value = row.original[field];
      return value != null && String(value).toLowerCase().includes(searchLower);
    });
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    ...(enableSorting && {
      onSortingChange: setSorting,
      getSortedRowModel: getSortedRowModel(),
    }),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    ...(enableSearch && {
      onGlobalFilterChange: setGlobalFilter,
      globalFilterFn: customGlobalFilterFn,
    }),
    state: {
      ...(enableSorting && { sorting }),
      columnFilters,
      columnVisibility,
      ...(enableSearch && { globalFilter }),
    },
  });

  return (
    <div className={`w-full max-w-full overflow-hidden px-2 sm:px-0 ${className || ""}`}>
      {note && (
        <div className="flex flex-col-reverse md:flex-row item-start xl:items-center gap-4 justify-start xl:justify-end py-4">
          <Input
            type="search"
            icon="search"
            placeholder="Search by email"
            className="max-w-sm w-full md:min-w-[30rem] py-3 rounded-md"
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("email")?.setFilterValue(event.target.value)
            }
          />
          {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button2 className="py-[10px] rounded-md flex items-center gap-2 text-primary-base border-2 border-primary-base">
              <SvgIcon name="filter" fill="#368591" />
              Filter
            </Button2>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-44 bg-white border-2 border-primary-base/50 rounded-md p-3 mt-3 flex flex-col gap-2 z-50"
            align="end"
          >
            {["Active-1", "Disabled-2", "Invited-3"].map((status, index) => {
              const [label, value] = status.split("-");
              return (
                <DropdownMenuCheckboxItem
                  key={index}
                  className={`capitalize font-medium pb-1 ${
                    index !== 2 ? "border-b border-primary-base/50" : ""
                  }`}
                  checked={columnFilters.some(
                    (filter) => filter.id === "status" && filter.value === value
                  )}
                  onCheckedChange={(isChecked) => {
                    setColumnFilters((prevFilters) => {
                      if (isChecked) {
                        if (
                          !prevFilters.some(
                            (filter) =>
                              filter.id === "status" && filter.value === value
                          )
                        ) {
                          return [
                            ...prevFilters,
                            { id: "status", value: value },
                          ];
                        }
                      } else {
                        return prevFilters.filter(
                          (filter) =>
                            !(filter.id === "status" && filter.value === value)
                        );
                      }
                      return prevFilters;
                    });
                  }}
                >
                  <span className="flex items-center">
                    <div className="relative mr-2">
                      <input
                        type="checkbox"
                        checked={columnFilters.some(
                          (filter) =>
                            filter.id === "status" && filter.value === value
                        )}
                        readOnly
                        className="absolute opacity-0 w-0 h-0"
                      />
                      <div
                        className={`w-4 h-4 border-2 rounded-sm ${
                          columnFilters.some(
                            (filter) =>
                              filter.id === "status" && filter.value === value
                          )
                            ? "bg-primary-base border-primary-base"
                            : "bg-white border-gray-300"
                        }`}
                      />
                    </div>
                    {label}
                  </span>
                </DropdownMenuCheckboxItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu> */}

          <Button2
            onClick={handleModal}
            className="flex items-center w-fit md:w-auto ml-auto md:ml-0 gap-2 py-3 text-white bg-primary-base"
          >
            <SvgIcon name="email-send" fill="#fff" />
            Invite Flexologist
          </Button2>
        </div>
      )}
      
      {/* New configurable search section */}
      {enableSearch && !note && (
        <div className="flex items-center py-1 justify-end">
          <Input
            type="search"
            icon="search"
            placeholder={searchPlaceholder}
            className="max-w-sm w-full md:min-w-[30rem] py-3 rounded-md border-1 border-gray-300"
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
          />
        </div>
      )}
      
      <div
        className={`rounded-md border w-[85vw] mx-auto md:w-full overflow-x-auto border-sidebar-border ${tableContainerClassName || ""}`}
      >
        <Table className={`border-sidebar-border ${tableClassName}`}>
          <TableHeader className="bg-primary-light ">
            {table.getHeaderGroups().map((headerGroup, index) => (
              <TableRow key={index} className="border-sidebar-border">
                {headerGroup.headers.map((header, index) => {
                  const canSort = enableSorting && header.column.getCanSort();
                  return (
                    <TableHead 
                      key={index} 
                      className={`pl-4 text-[#344054] py-2 ${canSort ? 'cursor-pointer select-none hover:bg-gray-50' : ''}`}
                      onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                    >
                      <div className="flex items-center space-x-2">
                        <span>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </span>
                        {canSort && (
                          <span className="flex flex-col">
                            {header.column.getIsSorted() === "desc" ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : header.column.getIsSorted() === "asc" ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronsUpDown className="h-4 w-4 opacity-50" />
                            )}
                          </span>
                        )}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  onClick={() => {
                    handleClick?.(row.original.id as number);
                  }}
                  key={index}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-sidebar-border"
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell key={index} className="pl-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {emptyText}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="border-sidebar-border"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="border-sidebar-border"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
