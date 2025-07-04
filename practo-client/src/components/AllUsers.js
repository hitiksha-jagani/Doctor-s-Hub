// import React, { useEffect, useState } from "react";

// const AllUsers = () => {
//   const [users, setUsers] = useState([]);

//   const fetchUsers = async () => {
//     try {
//       const res = await fetch("http://localhost:8080/admin/user-list", {
//         credentials: "include",
//       });
//       const data = await res.json();
//       setUsers(data);
//     } catch (err) {
//       console.error("Error fetching users:", err);
//     }
//   };

//   const handleDelete = async (id) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this user?");
//     if (!confirmDelete) return;

//     try {
//       const res = await fetch(`http://localhost:8080/admin/user/${id}`, {
//         method: "DELETE",
//         credentials: "include",
//       });

//       if (res.ok) {
//         alert("User deleted");
//         fetchUsers(); // Refresh list
//       } else {
//         const result = await res.text();
//         alert("Failed to delete: " + result);
//       }
//     } catch (err) {
//       console.error("Delete error:", err);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   return (
//     <div style={{ padding: "2rem" }}>
//       <h2>All Registered Users</h2>
//       <table border="1" cellPadding="10" cellSpacing="0">
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>First Name</th>
//             <th>Last Name</th>
//             <th>Email</th>
//             <th>Phone</th>
//             <th>Gender</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.length === 0 ? (
//             <tr><td colSpan="6">No users found</td></tr>
//           ) : (
//             users.map((user) => (
//               <tr key={user.id}>
//                 <td>{user.id}</td>
//                 <td>{user.firstName}</td>
//                 <td>{user.lastName}</td>
//                 <td>{user.email}</td>
//                 <td>{user.phone}</td>
//                 <td>{user.gender}</td>
//                 <td>
//                   <button onClick={() => handleDelete(user.id)} style={{ backgroundColor: "red", color: "white" }}>
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default AllUsers;
import React, { useEffect, useState } from "react";

const AllUsers = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:8080/admin/user-list", {
        credentials: "include",
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:8080/admin/user/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        alert("User deleted");
        fetchUsers(); // Refresh list
      } else {
        const result = await res.text();
        alert("Failed to delete: " + result);
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>All Registered Users</h2>
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>Sr. No</th>
            {/* <th>ID</th> */}
            <th style={{width: '200px'}}>First Name</th>
            <th style={{width: '200px'}}>Last Name</th>
            <th style={{width: '200px'}}>Email</th>
            <th style={{width: '200px'}}>Phone</th>
            <th style={{width: '200px'}}>Gender</th>
            <th style={{width: '200px'}}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr><td colSpan="7">No users found</td></tr>
          ) : (
            users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td> {/* Sr. No starts from 1 */}
                {/* <td>{user.id}</td> */}
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.gender}</td>
                <td>
                  <button
                    onClick={() => handleDelete(user.id)}
                    style={{ width: "100px", backgroundColor: "#c61919", color: "white"}}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AllUsers;
