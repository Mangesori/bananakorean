import React, { useState } from "react";
import Conversation from "@/components/shared/dashboards/Conversation";
import CoversationPartner from "@/components/shared/dashboards/CoversationPartner";
import useAuth from "@/hooks/useAuth"; // Assuming you have an auth hook

const MessageDropdown = ({ onClose }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const { user } = useAuth(); // Implement auth hook to check user role

  const isAdmin = user?.role === "admin";

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="bg-white dark:bg-whiteColor-dark rounded-lg shadow-lg w-[400px] max-h-[700px] overflow-hidden">
      {isAdmin ? (
        selectedUser ? (
          <Conversation onBack={() => setSelectedUser(null)} />
        ) : (
          <CoversationPartner onUserSelect={handleUserSelect} />
        )
      ) : (
        <Conversation />
      )}
    </div>
  );
};

export default MessageDropdown;
