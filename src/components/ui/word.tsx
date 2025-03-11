import { HTMLProps, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { cn } from "@/lib/utils";
import { addVocabularies } from "@/services/vocabulary/controller";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

type Props = {
  title: string;
} & HTMLProps<HTMLSpanElement>;

export default function Word({ title, ...rest }: Props) {
  const [open, setOpen] = useState(false);
  const user = useSession();
  const { toast } = useToast();

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
  };
  const handleClickAddToList = async (vocab: string) => {
    const userId = user.data?.user.id;
    if (userId)
      return addVocabularies({ userId, vocabularies: vocab }, true)
        .then(() => {
          toast({ title: "Vocabulary added successfully" });
        })
        .catch(() => {
          toast({ title: "Failed to add", variant: "destructive" });
        });
  };

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <span
          {...rest}
          className={cn(
            rest.className,
            `cursor-pointer ${open && "bg-yellow-200 rounded-md"}`
          )}
        >
          {title}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => handleClickAddToList(title)}>
            Add to list
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
