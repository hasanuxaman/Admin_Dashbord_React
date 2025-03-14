/* eslint-disable react/prop-types */
import { Avatar, Box, IconButton, Typography, useTheme } from "@mui/material";
import { useContext, useState } from "react";
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
  const [collapsed, setCollapsed] = useState(false);
  const { toggled, setToggled } = useContext(ToggledContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Sidebar
      backgroundColor={colors.primary[400]}
      rootStyles={{
        border: 0,
        height: "100%",
      }}
      collapsed={collapsed}
      onBackdropClick={() => setToggled(false)}
      toggled={toggled}
      breakPoint="md"
    >
      <Menu menuItemStyles={{ button: { ":hover": { background: "transparent" } } }}>
        <MenuItem rootStyles={{ margin: "10px 0 20px 0", color: colors.gray[100] }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {!collapsed && (
              <Box display="flex" alignItems="center" gap="12px" sx={{ transition: ".3s ease" }}>
                <img style={{ width: "30px", height: "30px", borderRadius: "8px" }} src={logo} alt="Argon" />
                <Typography variant="h4" fontWeight="bold" textTransform="capitalize" color={colors.greenAccent[500]}>
                  Argon
                </Typography>
              </Box>
            )}
            <IconButton onClick={() => setCollapsed(!collapsed)}>
              <MenuOutlined />
            </IconButton>
          </Box>
        </MenuItem>
      </Menu>

      {!collapsed && (
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

      {/* Main Menu with Submenus */}
      <Box mb={5} pl={collapsed ? undefined : "5%"}>
        <Menu
          menuItemStyles={{
            button: ({ active }) => ({
              color: active ? "#ffffff" : colors.gray[100], // Active text color
              background: active ? "#483D8B" : "transparent", // Active background (Dark Slate Blue)
              ":hover": {
                color: "#ffffff",
                background: "#483D8B",
                transition: ".3s ease",
              },
            }),
            subMenuContent: {
              background: colors.primary[700], // Dark background for submenu
            },
          }}
        >
          <MenuItem icon={<DashboardOutlined />} onClick={() => navigate("/")}>Dashboard</MenuItem>

          {/* Submenu - Employee Management */}
          <SubMenu label="Procurment Management" icon={<PeopleAltOutlined />} defaultOpen>
            <MenuItem onClick={() => navigate("/requsition")}>Requsition</MenuItem>
            <MenuItem onClick={() => navigate("/purchase-order")}>Purchase Order</MenuItem>
            <MenuItem onClick={() => navigate("/goods-received")}>Goods Received</MenuItem>
            <MenuItem onClick={() => navigate("/goods-issue")}>Goods Issue</MenuItem>
            <MenuItem onClick={() => navigate("/purchase-invoice")}>Purchase Invoice</MenuItem>
            <MenuItem onClick={() => navigate("/team")}>Manage Team</MenuItem>
            <MenuItem onClick={() => navigate("/employee")}>Employee List</MenuItem>
            <MenuItem onClick={() => navigate("/contacts")}>Contacts Information</MenuItem>
            <MenuItem onClick={() => navigate("/invoices")}>Invoices Balances</MenuItem>
           
          </SubMenu>

          {/* Submenu - Pages */}
          <SubMenu label="Pages" icon={<PersonOutlined />} defaultOpen>
            <MenuItem onClick={() => navigate("/form")}>Profile Form</MenuItem>
            <MenuItem onClick={() => navigate("/calendar")}>Calendar</MenuItem>
            <MenuItem onClick={() => navigate("/faq")}>FAQ Page</MenuItem>
          </SubMenu>

          {/* Submenu - Charts */}
          <SubMenu label="Charts & Reports" icon={<BarChartOutlined />} defaultOpen>
            <MenuItem onClick={() => navigate("/bar")}>Bar Chart</MenuItem>
            <MenuItem onClick={() => navigate("/pie")}>Pie Chart</MenuItem>
            <MenuItem onClick={() => navigate("/line")}>Line Chart</MenuItem>
            <MenuItem onClick={() => navigate("/geography")}>Geography Chart</MenuItem>
            <MenuItem onClick={() => navigate("/stream")}>Stream Chart</MenuItem>
          </SubMenu>
        </Menu>
      </Box>
    </Sidebar>
  );
};

export default SideBar;
