import { MenuItem } from "react-pro-sidebar";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";

const Item = ({ title, path, icon }) => {
  const location = useLocation();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      component={<Link to={path} />}
      icon={icon}
      style={{
        color: location.pathname === path ? "#9c27b0" : colors.gray[100], // ✅ Active Text Color (Purple)
        backgroundColor: location.pathname === path ? colors.primary[600] : "transparent", // ✅ Active BG from Theme
      }}
      rootStyles={{
        ":hover": {
          backgroundColor: colors.blueAccent[400], // ✅ Hover BG from Theme
          color: "#FFFFFF", // ✅ Text turns White on Hover
        },
      }}
    >
      {title}
    </MenuItem>
  );
};

export default Item;
