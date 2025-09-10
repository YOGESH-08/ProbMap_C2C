import React from "react";
import { FaRupeeSign, FaClock, FaMapMarkerAlt, FaHeartbeat } from "react-icons/fa";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import "./Details.css"; 

const Acard = ({ details }) => {
  const stars = [...Array(Math.floor(details.rating)).fill(<AiFillStar />)];
  if (details.rating % 1 !== 0) stars.push(<AiOutlineStar />);

  return (
    <div className="flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-lg max-w-5xl mx-auto">
      <div className="kovai-card">
        <div className="kovai-image-section">
          <img src={details.image} alt={details.name} />
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
            <p className="font-bold text-lg flex items-center non">
              Rating
              <span className="flex items-center ml-2 text-yellow-500">
                {stars.map((star, i) => (
                  <span key={i}>{star}</span>
                ))}
                <span className="text-gray-600 ml-2 text-base non">
                  ({details.rating})
                </span>
              </span>
            </p>
            <p className="mt-3 text-gray-700 non">{details.description}</p>
          </div>

          <div className="mt-5 space-y-4">
            <DetailRow label="Price per Hour" value={`₹ ${details.pricePerHour}`} />
            <DetailRow icon={<FaHeartbeat />} label="Sports" value={details.sports.join(", ")} />
            <DetailRow icon={<FaClock />} label="Open Time" value={details.openTime} />
            <DetailRow icon={<FaClock />} label="Close Time" value={details.closeTime} />
          </div>

          <button className="reserve-button">Reserve Now</button>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ icon, label, value }) => (
  <div className="flex items-center space-x-4">
    <div className="flex items-center space-x-2 text-green-500">
      {icon}
      <div className="text-gray-500">{label}</div>
    </div>
    <div className="font-semibold text-gray-800">{value}</div>
  </div>
);

export default Acard;