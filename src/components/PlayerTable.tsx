import * as React from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import axios from "axios";

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

const BACKEND_URL = "https://edc-pict.site";

export default function PlayersPage() {
  const [players, setPlayers] = React.useState<Player[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [currentPage, setCurrentPage] = React.useState(0);
  const rowsPerPage = 10;

  // Fetching players from the backend
  const fetchPlayers = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/admin/get-all-players`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`, // Send the token in the Authorization header
        },
        withCredentials: true, // Include cookies if necessary
      });

      const data = response.data;
      setPlayers(data.players);
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

  const updatePlayerPoints = async (
    player: Player,
    newPoints: number,
    e: any
  ) => {
    e.preventDefault();
    try {
      await axios.put(
        `${BACKEND_URL}/admin/give-points-to-player`,
        { points: newPoints, playerID: player.id }, // This is the body
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`, // Ensure token is sent correctly
          },
          withCredentials: true, // Include cookies if necessary
        }
      );

      // Update the player's points locally in the state
      setPlayers((prevPlayers) =>
        prevPlayers.map((p) =>
          p.id === player.id ? { ...p, points: p.points + newPoints } : p
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
    state: { sorting },
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
