import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import "./Details.css"; 
import img from "../photo/zoro.jpg"; 

const Acard = ({ details, onDelete }) => {
  console.log(details);
  return (
    <div className="flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-lg max-w-5xl mx-auto relative">
      <div className="kovai-card">
        <div className="kovai-image-section">
          <img src={details.imageUrl} alt={details.name} />
          <div className="kovai-info-overlay">
            <h2>{details.name}</h2>
            <p>
              <FaMapMarkerAlt style={{ marginRight: "6px" }} />
              {details.location}
            </p>
          </div>
        </div>

        <div className="kovai-info-section p-6 flex flex-col justify-between md:w-1/2">
          <div>
            <h2>User Description:</h2>
            <p className="mt-3 text-gray-700">{details.description}</p>
          </div>

          <div>
            <h2>Admin Response:</h2>
            <p className="mt-3 text-gray-700">{details.adminDescription}</p>
          </div>

          <div className="mt-5 space-y-2">
            <DetailRow label="Severity:" value={details.severity} />
            <DetailRow label="Status:" value={details.status} />
          </div>

          {onDelete && (
            <button
              onClick={onDelete}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete Issue
            </button>
          )}
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
