import { useState, useEffect } from "react";
import type { UserTableData } from "@/types/users";

export const useUsers = () => {
  const [users, setUsers] = useState<UserTableData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const dummyUsers: UserTableData[] = [
      {
        id: 1,
        businessName: "John B.",
        robotProcess: "john@gmail.com",
        noteTaking: "john@gmail.com",
        createdAt: "May 21, 2025",
        users: [
          { id: 1, name: "John B.", email: "john@gmail.com" },
          { id: 2, name: "John B.", email: "john@gmail.com" },
          { id: 3, name: "John B.", email: "john@gmail.com" },
        ],
      },
      {
        id: 2,
        businessName: "John B.",
        robotProcess: "john@gmail.com",
        noteTaking: "john@gmail.com",
        createdAt: "May 21, 2025",
        users: [
          { id: 4, name: "John B.", email: "john@gmail.com" },
          { id: 5, name: "John B.", email: "john@gmail.com" },
          { id: 6, name: "John B.", email: "john@gmail.com" },
        ],
      },
      {
        id: 3,
        businessName: "John B.",
        robotProcess: "john@gmail.com",
        noteTaking: "john@gmail.com",
        createdAt: "May 21, 2025",
        users: [
          { id: 7, name: "John B.", email: "john@gmail.com" },
          { id: 8, name: "John B.", email: "john@gmail.com" },
          { id: 9, name: "John B.", email: "john@gmail.com" },
        ],
      },
      {
        id: 4,
        businessName: "John B.",
        robotProcess: "john@gmail.com",
        noteTaking: "john@gmail.com",
        createdAt: "May 21, 2025",
        users: [
          { id: 10, name: "John B.", email: "john@gmail.com" },
          { id: 11, name: "John B.", email: "john@gmail.com" },
          { id: 12, name: "John B.", email: "john@gmail.com" },
        ],
      },
    ];

    // Simulate loading delay
    setTimeout(() => {
      setUsers(dummyUsers);
      setIsLoading(false);
    }, 500);
  }, []);

  return { users, isLoading };
}; 