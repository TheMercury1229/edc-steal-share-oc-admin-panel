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

// Commenting out backend URL and fetch functionality
// const BACKEND_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL;

export default function PlayersPage() {
  // Using hardcoded data for testing
  const [players, setPlayers] = React.useState<Player[]>([
    // { id: "player1", points: 100 },
    // { id: "player2", points: 150 },
    // { id: "player3", points: 200 },
    // { id: "player4", points: 250 },
    // { id: "player5", points: 300 },
  ]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [currentPage, setCurrentPage] = React.useState(0);
  const rowsPerPage = 10;

  // Commenting out the fetchPlayers function
  
  const fetchPlayers = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/admin/get-all-players`, {
        credentials: "include", // Include credentials (JWT token)
      });
      if (response.ok) {
        const data = await response.json();
        setPlayers(data.players); // Assumes the response has a `players` array
      } else {
        console.error("Failed to fetch players");
      }
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };
  

  // Update player points
  const updatePlayerPoints = async (
    playerId: Player,
    newPoints: number,
    e: any
  ) => {
    e.preventDefault();
    try {
      await fetch(${BACKEND_URL}/admin/give-points-to-player-origami, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include JWT token for auth
        body: JSON.stringify({ points: newPoints, playerID: playerId.id }),
      });
      // Update local state after successfully updating points
      setPlayers((prevPlayers) =>
        prevPlayers.map((p) =>
          p.id === playerId.id ? { ...p, points: newPoints } : p
        )
      );
    } catch (error) {
      console.error("Error updating player points:", error);
    }
  };
  React.useEffect(() => {
    fetchPlayers();
  }, []);


  const paginatedData = React.useMemo(() => {
    const startIndex = currentPage * rowsPerPage;
    return players.slice(startIndex, startIndex + rowsPerPage);
  }, [currentPage, players]);

  const columns: ColumnDef<Player>[] = [
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
                  onClick={async (e) => {
                    await updatePlayerPoints(player, newPoints, e);
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
      <div className="flex items-center justify-end space-x-2">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
        >
          Previous
        </Button>
        <span>Page {currentPage + 1}</span>
        <Button
          onClick={() =>
            setCurrentPage((prev) =>
              prev + 1 < Math.ceil(players.length / rowsPerPage)
                ? prev + 1
                : prev
            )
          }
          disabled={currentPage + 1 >= Math.ceil(players.length / rowsPerPage)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
