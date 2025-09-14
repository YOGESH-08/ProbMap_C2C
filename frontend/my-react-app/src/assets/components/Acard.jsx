import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import "./Details.css"; 
import img from "../photo/zoro.jpg"; 

const Acard = ({ details, onDelete }) => {
  const handleViewOnMap = () => {
    if (!details.location?.lat || !details.location?.lng) return;
    const { lat, lng } = details.location;
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-lg max-w-5xl mx-auto relative">
      <div className="kovai-card">
        <div className="kovai-image-section">
          <img src={details.imageUrl || img} alt={details.name} />
          <div className="kovai-info-overlay">
            <h2>{details.name}</h2>
            <p>
              <FaMapMarkerAlt style={{ marginRight: "6px" }} />
              {details.location ? `${details.location.lat}, ${details.location.lng}` : "No location"}
            </p>
            {details.district && <p className="mt-1" ><span style={{fontSize:"20px",fontWeight:"bold"}}>District :</span>{details.district}</p>}
            {details.address && <p className="mt-1">Address: {details.address}</p>}
          </div>
        </div>

        <div className="kovai-info-section p-6 flex flex-col justify-between md:w-1/2">
          <div>
            <h2>User Description:</h2>
            <p className="mt-3 text-gray-700">{details.description}</p>
          </div>

          <div>
            <h2>Admin Response:</h2>
            <p className="mt-3 text-gray-700">{details.adminDescription || "Pending"}</p>
          </div>

          <div className="mt-5 space-y-2">
            <DetailRow label="Severity:" value={details.severity || "N/A"} />
            <DetailRow label="Status:" value={details.status || "Pending"} />
            {details.district && <DetailRow label="District:" value={details.district} />}
            {details.address && <DetailRow label="Address:" value={details.address} />}
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={handleViewOnMap}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Show on Map
            </button>

            {onDelete && (
              <button
                onClick={onDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete Issue
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="font-semibold">{label}</span>
    <span>{value}</span>
  </div>
);

export default Acard;
