import React from "react";

import { getUserRole, getUsers } from "@/actions/user-actions";

import { CreateAuthorForm } from "./components/create-author-form";

const page = async () => {
  const user = await getUserRole();
  // Optional: Only allow access if admin
  if (user.role !== "ADMIN") {
    return <p className="text-red-500">Unauthorized</p>;
  }

  const users = await getUsers();

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Create New Author</h1>
      <CreateAuthorForm users={users} />
    </div>
  );
};

export default page;
