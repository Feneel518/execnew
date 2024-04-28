"use client";
import * as React from "react";
import {
  ColumnDef,
  flexRender,
  SortingState,
  getPaginationRowModel,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isQuotation?: boolean;
  isOrder?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isQuotation,
  isOrder,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="">
      <div className="flex items-center py-4">
        {isQuotation ? (
          <div className="flex gap-4">
            <Input
              placeholder="Filter Quotation Number..."
              value={
                (table
                  .getColumn("quotationNumber")
                  ?.getFilterValue() as string) ?? ""
              }
              onChange={(event) => {
                table
                  .getColumn("quotationNumber")
                  ?.setFilterValue(event.target.value);
              }}
              className="max-w-sm"
            />
            <Input
              placeholder="Filter Client Name..."
              value={
                (table.getColumn("clientName")?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) => {
                table
                  .getColumn("clientName")
                  ?.setFilterValue(event.target.value);
              }}
              className="max-w-sm"
            />
          </div>
        ) : isOrder ? (
          <div className="flex gap-4">
            <Input
              placeholder="Filter Order Number..."
              value={
                (table.getColumn("orderNumber")?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) => {
                table
                  .getColumn("orderNumber")
                  ?.setFilterValue(event.target.value);
              }}
              className="max-w-sm"
            />
            <Input
              placeholder="Filter Client Name..."
              value={
                (table.getColumn("clientName")?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) => {
                table
                  .getColumn("clientName")
                  ?.setFilterValue(event.target.value);
              }}
              className="max-w-sm"
            />
            <Input
              placeholder="Filter PO Number..."
              value={
                (table.getColumn("poNumber")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) => {
                table.getColumn("poNumber")?.setFilterValue(event.target.value);
              }}
              className="max-w-sm"
            />
          </div>
        ) : (
          <Input
            placeholder="Filter name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        )}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="default"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
