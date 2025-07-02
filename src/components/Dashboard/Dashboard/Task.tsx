"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { todoDelete, updateTodo } from "@/lib/queries";
import { cn } from "@/lib/utils";
import { Todo } from "@prisma/client";
import { Trash, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";

interface TaskProps {
  todo: Todo;
}

const Task: FC<TaskProps> = ({ todo }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleCheckUnCheck = async (id: string, status: boolean) => {
    setLoading(true);
    const response = await updateTodo(id, status);
    setLoading(false);

    if (response?.success) {
      toast({
        title: `Your todo has been ${!status ? "Completed" : "Unchecked"}`,
        duration: 1000,
      });

      router.refresh();
    }
    if (response?.error) {
      toast({
        variant: "destructive",
        title: "Oppse!",
        description: "Could not update your todo, please try again later",
        duration: 1000,
      });
    }
  };

  const handleDelete = async (id: string) => {
    const response = await todoDelete(id);

    if (response?.success) {
      toast({
        title: `Your todo has been deleted.`,
        duration: 1000,
      });

      router.refresh();
    }
    if (response?.error) {
      toast({
        variant: "destructive",
        title: "Oppse!",
        description: "Could not delete your todo, please try again later",
        duration: 1000,
      });
    }
  };
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-600 border-red-300";
      case "MEDIUM":
        return "bg-yellow-600 border-yellow-300";
      case "LOW":
        return "bg-green-600 border-green-300";
      default:
        return "bg-gray-100 border-gray-300";
    }
  };
  return (
    <div>
      <div className={`flex items-center space-x-2 `} key={todo.id}>
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => {
            handleCheckUnCheck(todo.id, todo.completed);
          }}
          className={cn(`rounded-full md:size-6`, {
            "data-[state=checked]:bg-bamboo-500  border-gray-300":
              todo.completed,
          })}
        />
        {loading ? (
          <div className="">Updating...</div>
        ) : (
          <div className="flex items-center justify-between w-full pr-4 gap-2">
            <div className="flex items-center gap-2">
              <label
                htmlFor="terms"
                className={cn(
                  `md:text-[16px] text-sm font-light leading-snug peer-disabled:cursor-not-allowed peer-disabled:opacity-70 `,
                  {
                    "line-through text-bamboo-500/50": todo.completed,
                  }
                )}
              >
                {todo.text}
              </label>
              <div
                className={`${getPriorityColor(
                  todo.priority
                )} size-2 rounded-full`}
              ></div>
            </div>
            <div
              onClick={() => handleDelete(todo.id)}
              className="p-2 hover:bg-red-100 rounded-full cursor-pointer hover:text-black transition-all duration-200 ease-in-out"
            >
              <Trash2 strokeWidth={1} size={15}></Trash2>
            </div>
          </div>
        )}
      </div>
      <Separator className="bg-white/10 my-1"></Separator>
    </div>
  );
};

export default Task;
