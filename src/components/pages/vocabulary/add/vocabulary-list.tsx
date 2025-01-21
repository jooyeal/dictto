"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { removeVocabularies } from "@/services/vocabulary";
import { Vocabulary } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useDebounce } from "react-use";
import React, { useEffect } from "react";

type Props = {
  data: Vocabulary[];
};

export function VocabularyList({ data }: Props) {
  const { toast } = useToast();
  const [vocabularyData, setVocabularyData] =
    React.useState<Vocabulary[]>(data);
  const [enteredValue, setEnteredValue] = React.useState<string>("");
  const [debouncedValue, setDebouncedValue] = React.useState<string>("");

  useDebounce(
    () => {
      setDebouncedValue(enteredValue);
    },
    500,
    [enteredValue]
  );
  useEffect(() => {
    const searchData = data.filter((vocabulary) =>
      vocabulary.content.includes(debouncedValue)
    );
    setVocabularyData(searchData);
  }, [debouncedValue, data]);

  const columns: ColumnDef<Vocabulary>[] = [
    { accessorKey: "content", header: "Voca" },
    {
      accessorKey: "isPassed",
      header: "Status",
      cell: ({ row }) => {
        const vocabulary = row.original;

        return vocabulary.isPassed ? (
          <Badge variant="outline">Done</Badge>
        ) : (
          <Badge variant="outline">Pending</Badge>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "",
      cell: ({ row }) => {
        const vocabulary = row.original;

        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => {
                    removeVocabularies({ ids: [vocabulary.id] })
                      .then(() => {
                        toast({ title: "Vocabulary deleted successfully" });
                      })
                      .catch(() => {
                        toast({
                          title: "Failed to delete",
                          variant: "destructive",
                        });
                      });
                  }}
                >
                  delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-2">
      <Input
        placeholder="Search vocabulary"
        value={enteredValue}
        onChange={(e) => setEnteredValue(e.target.value)}
      />
      <DataTable columns={columns} data={vocabularyData} />
    </div>
  );
}
