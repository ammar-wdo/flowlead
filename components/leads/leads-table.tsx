"use client"

import {
  ColumnDef,
  ColumnFiltersState,
  getPaginationRowModel,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table"

import { Input } from "@/components/ui/input"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import EmptyComponent from "../empty"
import { Button } from "../ui/button"
import React from "react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
 
      columnFilters,
    },
  })

  return (
    <div> 
          <div className="flex items-center p-4">
        <Input
             placeholder="Search..."
          value={(table.getColumn("emailAddress")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("emailAddress")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
    <div className="">
      <Table>
        <TableHeader className="bg-muted">
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
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
              className="!py-3"
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell className="" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
              <EmptyComponent title='No Leads' description='you will see your leads here when you get them'   />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
     <div className="flex items-center justify-between space-x-2 p-4 border-t">
     <Button
       variant="outline"
       size="sm"
       onClick={() => table.previousPage()}
       disabled={!table.getCanPreviousPage()}
     >
       Previous
     </Button>
     <Button
       variant="outline"
       size="sm"
       onClick={() => table.nextPage()}
       disabled={!table.getCanNextPage()}
     >
       Next
     </Button>
   </div>
 </div>
  )
}
