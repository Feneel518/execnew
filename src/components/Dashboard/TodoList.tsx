import { FC } from "react";
import CreateATask from "./Dashboard/CreateATask";
import TodoAnimatedList from "./Dashboard/TodoAnimatedList";
import { ScrollArea } from "../ui/scroll-area";

interface TodoListProps {}

const TodoList: FC<TodoListProps> = ({}) => {
  return (
    <div className="flex flex-col items-start justify-between h-full w-full">
      <div className="flex items-center justify-between w-full">
        <div className="uppercase whitespace-nowrap">Todo List</div>

        <CreateATask></CreateATask>
      </div>

      <div className="w-full  ">
        <ScrollArea className="max-h-[400px] ">
          <TodoAnimatedList></TodoAnimatedList>
        </ScrollArea>
      </div>
    </div>
  );
};

export default TodoList;
