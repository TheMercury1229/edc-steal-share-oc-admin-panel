"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type Player = {
  id: string;
  points: number;
};

const data: Player[] = [
  { id: "p1", points: 100 },
  { id: "p2", points: 150 },
  { id: "p3", points: 120 },
  { id: "p4", points: 90 },
  { id: "p5", points: 130 },
  { id: "p6", points: 110 },
  { id: "p7", points: 80 },
  { id: "p8", points: 170 },
  { id: "p9", points: 160 },
  { id: "p10", points: 140 },
  { id: "p11", points: 180 },
  { id: "p12", points: 190 },
  { id: "p13", points: 200 },
  { id: "p14", points: 210 },
  { id: "p15", points: 220 },
  { id: "p16", points: 230 },
];

export const columns: ColumnDef<Player>[] = [
  {
    accessorKey: "id",
    header: "Player ID",
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
  },
  {
    accessorKey: "points",
    header: () => <div className="text-right">Points</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium">{row.getValue("points")}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const player = row.original;
      const [newPoints, setNewPoints] = React.useState(player.points);
      const [dialogOpen, setDialogOpen] = React.useState(false);

      return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Update Points</Button>
          </DialogTrigger>
          <DialogContent className="text-center">
            <DialogHeader>
              <DialogTitle>Update Points for {player.id}</DialogTitle>
            </DialogHeader>
            <DialogDescription className="flex flex-col gap-4 items-center">
              Enter the new points for Player {player.id}:
              <Input
                type="number"
                value={newPoints}
                onChange={(e) => setNewPoints(Number(e.target.value))}
                placeholder="Enter new points"
              />
              <Button
                variant="default"
                onClick={() => {
                  player.points = newPoints;
                  console.log(
                    `Updated points for Player ${player.id}: ${newPoints}`
                  );
                  setDialogOpen(false);
                }}
              >
                Save
              </Button>
            </DialogDescription>
          </DialogContent>
        </Dialog>
      );
    },
  },
];

export default function PlayerTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [currentPage, setCurrentPage] = React.useState(0);
  const rowsPerPage = 10;

  const paginatedData = React.useMemo(() => {
    const startIndex = currentPage * rowsPerPage;
    return data.slice(startIndex, startIndex + rowsPerPage);
  }, [currentPage]);

  const table = useReactTable({
    data: paginatedData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    state: { sorting, columnVisibility },
  });

  return (
    <div className="w-min-fit">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
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

      {/* Pagination Controls */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((old) => Math.max(old - 1, 0))}
          disabled={currentPage === 0}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setCurrentPage((old) =>
              Math.min(old + 1, Math.floor(data.length / rowsPerPage))
            )
          }
          disabled={currentPage >= Math.floor(data.length / rowsPerPage)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
