import React from "react";

interface UploadedCardProps {
  name: string;
  email: string;
  fileId: string;
  message: string;
}

const UploadedCard: React.FC<UploadedCardProps> = ({ name, email, fileId, message }) => {
  const webViewLink = `https://drive.google.com/file/d/${fileId}/view`;

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "16px",
        borderRadius: "8px",
        margin: "8px",
      }}
    >
      <p>
        <strong>{name}</strong>
      </p>
      <p>{email}</p>
      <p>{message}</p>
      <a href={webViewLink} target="_blank" rel="noopener noreferrer">
        Lihat Gambar
      </a>
    </div>
  );
};

export default UploadedCard;
