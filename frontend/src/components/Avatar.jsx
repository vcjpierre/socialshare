import PropTypes from "prop-types";
import { useState } from "react";

export default function Avatar({ src, alt, name, className = "" }) {
  const [imageError, setImageError] = useState(false);

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return "?";
    const names = name.trim().split(" ");
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  // Generate a consistent background color based on name
  const getBackgroundColor = (name) => {
    if (!name) return "bg-gray-400";
    const colors = [
      "bg-red-400",
      "bg-blue-400",
      "bg-green-400",
      "bg-yellow-400",
      "bg-purple-400",
      "bg-pink-400",
      "bg-indigo-400",
      "bg-teal-400",
    ];
    const charCode = name.charCodeAt(0);
    return colors[charCode % colors.length];
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // If image loading failed or src is invalid, show initials
  if (!src || imageError) {
    return (
      <div
        className={`${className} ${getBackgroundColor(name)} flex items-center justify-center text-white font-bold`}
        title={name || alt}
      >
        {getInitials(name || alt)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={handleImageError}
    />
  );
}

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  name: PropTypes.string,
  className: PropTypes.string,
};
