import { useState, useEffect } from "react";
import UserForm from "./UserForm";
import UserList from "./UserList";
import UserDetail from "./UserDetail";

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);

  // GET all
  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const addOrUpdateUser = async (user) => {
    if (editing) {
      // PUT
      const res = await fetch(`/api/users/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      const updated = await res.json();
      setUsers(users.map((u) => (u.id === updated.id ? updated : u)));
      setEditing(null);
    } else {
      // POST
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      const newUser = await res.json();
      setUsers([...users, newUser]);
    }
  };

  const deleteUser = async (id) => {
    await fetch(`/api/users/${id}`, { method: "DELETE" });
    setUsers(users.filter((u) => u.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">Gestión de Usuarios</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
        <UserForm
          onSave={addOrUpdateUser}
          userToEdit={editing}
          onCancel={() => setEditing(null)}
        />
        <UserList
          users={users}
          onDelete={deleteUser}
          onEdit={setEditing}
          onSelect={setSelected}
        />
      </div>

      {selected && (
        <div className="w-full max-w-3xl">
          <UserDetail user={selected} onClose={() => setSelected(null)} />
        </div>
      )}
    </div>
  );
}