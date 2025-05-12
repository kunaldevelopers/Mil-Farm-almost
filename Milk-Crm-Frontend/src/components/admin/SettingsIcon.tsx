import React from "react";

type SettingsIconProps = {
  icon: React.ReactNode;
  bgColor: string;
  size?: "small" | "medium" | "large";
};

const SettingsIcon: React.FC<SettingsIconProps> = ({
  icon,
  bgColor,
  size = "medium",
}) => {
  // Determine size values based on the prop
  const dimensions = {
    small: {
      size: "32px",
      iconSize: "16px",
    },
    medium: {
      size: "42px",
      iconSize: "20px",
    },
    large: {
      size: "54px",
      iconSize: "24px",
    },
  };

  return (
    <div
      style={{
        width: dimensions[size].size,
        height: dimensions[size].size,
        borderRadius: "12px",
        backgroundColor: bgColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: dimensions[size].iconSize,
        color: "white",
      }}
    >
      {icon}
    </div>
  );
};

export default SettingsIcon;
