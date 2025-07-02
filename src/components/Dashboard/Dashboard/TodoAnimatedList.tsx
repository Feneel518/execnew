import { getTodos } from "@/lib/queries";
import { FC } from "react";
import Task from "./Task";
import { Todo } from "@prisma/client";

interface TodoAnimatedListProps {}

const TodoAnimatedList: FC<TodoAnimatedListProps> = async ({}) => {
  const todos = await getTodos();
  if (!todos?.success || todos.error) return;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const completedTodos = todos.success.filter((todo) => todo.completed);
  const incompleteTodos = todos.success.filter(
    (todo) => !todo.completed && todo.createdAt < today
  );

  const todaystask = todos.success.filter(
    (todo) => todo.createdAt > today && !todo.completed
  );

  const completedTodayLength = completedTodos.length;
  return (
    <div className="w-full ">
      {todos.success.length === 0 ? (
        <div className="text-center">No Pending Tasks</div>
      ) : (
        <div className="flex flex-col gap-2 justify-end">
          {todaystask.length > 0 && (
            <>
              <div className="">
                Today - {todaystask.length}
                <span className="text-xs"> (task)</span>
              </div>
              {todaystask.map((todo) => {
                return <Task key={todo.id} todo={todo}></Task>;
              })}
            </>
          )}
          {incompleteTodos.length > 0 && (
            <>
              <div className="">
                Pending task - {incompleteTodos.length}
                <span className="text-xs"> (task)</span>
              </div>
              {incompleteTodos.map((todo) => {
                return <Task key={todo.id} todo={todo}></Task>;
              })}
            </>
          )}
          {completedTodayLength > 0 && (
            <>
              <div className="mt-4">
                Completed todo - {completedTodayLength}
                <span className="text-xs"> (task)</span>
              </div>
              {completedTodos.map((todo) => {
                return <Task key={todo.id} todo={todo}></Task>;
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TodoAnimatedList;
