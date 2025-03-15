/* eslint-disable react/prop-types */
import { Avatar, Box, IconButton, Typography, useTheme } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { tokens } from "../../../theme";
import { Menu, MenuItem, Sidebar, SubMenu } from "react-pro-sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BarChartOutlined,
  CalendarTodayOutlined,
  ContactsOutlined,
  DashboardOutlined,
  DonutLargeOutlined,
  HelpOutlineOutlined,
  MapOutlined,
  MenuOutlined,
  PeopleAltOutlined,
  PersonOutlined,
  ReceiptOutlined,
  TimelineOutlined,
  WavesOutlined,
} from "@mui/icons-material";
import avatar from "../../../assets/images/avatar.png";
import logo from "../../../assets/images/logo.png";
import { ToggledContext } from "../../../App";

const SideBar = () => {
  const { toggled, setToggled } = useContext(ToggledContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ SubMenu state management with localStorage
  const [openSubMenu, setOpenSubMenu] = useState(
    JSON.parse(localStorage.getItem("openSubMenu")) || {}
  );

  useEffect(() => {
    localStorage.setItem("openSubMenu", JSON.stringify(openSubMenu));
  }, [openSubMenu]);

  const handleSubMenuToggle = (menuKey) => {
    setOpenSubMenu((prev) => ({ ...prev, [menuKey]: !prev[menuKey] }));
  };

  return (
    <Sidebar
      backgroundColor={colors.primary[400]}
      rootStyles={{ border: 0, height: "100%" }}
      collapsed={toggled}
      onBackdropClick={() => setToggled(false)}
      breakPoint="md"
    >
      <Menu menuItemStyles={{ button: { ":hover": { background: "transparent" } } }}>
        <MenuItem rootStyles={{ margin: "10px 0 20px 0", color: colors.gray[100] }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {!toggled && (
              <Box display="flex" alignItems="center" gap="12px" sx={{ transition: ".3s ease" }}>
                <img style={{ width: "30px", height: "30px", borderRadius: "8px" }} src={logo} alt="Argon" />
                <Typography variant="h4" fontWeight="bold" textTransform="capitalize" color={colors.greenAccent[500]}>
                  Argon
                </Typography>
              </Box>
            )}
            <IconButton onClick={() => setToggled(!toggled)}>
              <MenuOutlined />
            </IconButton>
          </Box>
        </MenuItem>
      </Menu>

      {!toggled && (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", mb: "25px" }}>
          <Avatar alt="avatar" src={avatar} sx={{ width: "100px", height: "100px" }} />
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h3" fontWeight="bold" color={colors.gray[100]}>
              Tony Stark
            </Typography>
            <Typography variant="h6" fontWeight="500" color={colors.greenAccent[500]}>
              VP Fancy Admin
            </Typography>
          </Box>
        </Box>
      )}

      {/* ✅ Main Menu with All Submenus */}
      <Box mb={5} pl={toggled ? undefined : "5%"}>
        <Menu
          menuItemStyles={{
            button: ({ active }) => ({
              color: active ? "#ffffff" : colors.gray[100],
              background: active ? "#483D8B" : "transparent",
              ":hover": { color: "#ffffff", background: "#483D8B", transition: ".3s ease" },
            }),
            subMenuContent: { background: colors.primary[700] },
          }}
        >
          <MenuItem icon={<DashboardOutlined />} onClick={() => navigate("/")} active={location.pathname === "/"}>
            Dashboard
          </MenuItem>

          {/* ✅ Procurement Management */}
          <SubMenu
            label="Procurement Management"
            icon={<PeopleAltOutlined />}
            open={openSubMenu["procurement"]}
            onClick={() => handleSubMenuToggle("procurement")}
          >
            <MenuItem onClick={() => navigate("/requisition")}>Requisition</MenuItem>
            <MenuItem onClick={() => navigate("/purchase-order")}>Purchase Order</MenuItem>
            <MenuItem onClick={() => navigate("/goods-received")}>Goods Received</MenuItem>
            <MenuItem onClick={() => navigate("/goods-issue")}>Goods Issue</MenuItem>
            <MenuItem onClick={() => navigate("/purchase-invoice")}>Purchase Invoice</MenuItem>
          </SubMenu>

          {/* ✅ Employee Management */}
          <SubMenu
            label="Employee Management"
            icon={<PersonOutlined />}
            open={openSubMenu["employee"]}
            onClick={() => handleSubMenuToggle("employee")}
          >
            <MenuItem onClick={() => navigate("/team")}>Manage Team</MenuItem>
            <MenuItem onClick={() => navigate("/employee")}>Employee List</MenuItem>
            <MenuItem onClick={() => navigate("/contacts")}>Contacts Information</MenuItem>
          </SubMenu>

          {/* ✅ Pages */}
          <SubMenu
            label="Pages"
            icon={<CalendarTodayOutlined />}
            open={openSubMenu["pages"]}
            onClick={() => handleSubMenuToggle("pages")}
          >
            <MenuItem onClick={() => navigate("/form")}>Profile Form</MenuItem>
            <MenuItem onClick={() => navigate("/calendar")}>Calendar</MenuItem>
            <MenuItem onClick={() => navigate("/faq")}>FAQ Page</MenuItem>
            <MenuItem onClick={() => navigate("/help")}>Help Center</MenuItem>
          </SubMenu>

          {/* ✅ Finance */}
          <SubMenu
            label="Finance"
            icon={<ReceiptOutlined />}
            open={openSubMenu["finance"]}
            onClick={() => handleSubMenuToggle("finance")}
          >
            <MenuItem onClick={() => navigate("/invoices")}>Invoices</MenuItem>
            <MenuItem onClick={() => navigate("/transactions")}>Transactions</MenuItem>
          </SubMenu>

          {/* ✅ Charts & Reports */}
          <SubMenu
            label="Charts & Reports"
            icon={<BarChartOutlined />}
            open={openSubMenu["charts"]}
            onClick={() => handleSubMenuToggle("charts")}
          >
            <MenuItem onClick={() => navigate("/bar")}>Bar Chart</MenuItem>
            <MenuItem onClick={() => navigate("/pie")}>Pie Chart</MenuItem>
            <MenuItem onClick={() => navigate("/line")}>Line Chart</MenuItem>
            <MenuItem onClick={() => navigate("/geography")}>Geography Chart</MenuItem>
          </SubMenu>
        </Menu>
      </Box>
    </Sidebar>
  );
};

export default SideBar;
