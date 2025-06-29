import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, LoaderCircleIcon } from "lucide-react";
import { useState } from "react";

interface DeleteJobButtonProps {
  jobTitle?: string;
  company?: string;
  onDelete: () => void;
}

export default function DeleteJobButton({
  jobTitle,
  company,
  onDelete,
}: DeleteJobButtonProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDelete = () => {
    setDeleteLoading(true);
    onDelete();
    setDeleteLoading(false);
    setIsDeleteDialogOpen(false);
  };

  return (
    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4" />
          <span>Delete</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Job Application</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the job application for{" "}
            <strong>{jobTitle || "this position"}</strong> at{" "}
            <strong>{company || "this company"}</strong>? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsDeleteDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteLoading}
          >
            {deleteLoading ? (
              <LoaderCircleIcon className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
