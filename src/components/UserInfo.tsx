import React from "react";

interface UserAttrs {
  firstName?: string;
  lastName?: string;
  country?: string;
  addressCity?: string;
  dateOfBirth?: string;
  PhoneNumber?: string;
}

export const UserInfo = ({ user }: { user: any }) => {
  const { login, email, attrs } = user;

  // Ensure attrs is an object
  const parsedAttrs: UserAttrs = typeof attrs === "object" ? attrs : {};

  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      {/* Basic User Info */}
      <h2 className="text-3xl font-bold mb-2">
        {parsedAttrs.firstName || login} {parsedAttrs.lastName || ""}
      </h2>
      <p className="text-gray-500 mb-4">{email}</p>

      {/* Additional User Info */}
      <div className="text-left space-y-2">
        <p><strong>Country:</strong> {parsedAttrs.country || "N/A"}</p>
        <p><strong>City:</strong> {parsedAttrs.addressCity || "N/A"}</p>
        <p>
          <strong>Date of Birth:</strong>{" "}
          {parsedAttrs.dateOfBirth ? new Date(parsedAttrs.dateOfBirth).toLocaleDateString() : "N/A"}
        </p>
        <p><strong>Phone Number:</strong> {parsedAttrs.PhoneNumber || "N/A"}</p>
      </div>
    </div>
  );
};
