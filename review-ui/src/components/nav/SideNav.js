//import useState hook to create menu collapse state
import React, { useState } from "react";

//import react pro sidebar components
import {
  Sidebar,
  Menu,
  MenuItem,
  menuClasses, 
  MenuItemStyles,
  SubMenu
} from "react-pro-sidebar";

//import icons from react icons
import { FaList, FaHome, FaBookReader, FaEdit, FaMedal } from "react-icons/fa";
import { FiArrowLeftCircle, FiArrowRightCircle } from "react-icons/fi";
import {SiCodereview} from "react-icons/si";
import { MdSettingsSuggest, MdDashboard } from "react-icons/md";

import Editor from '../pages/Editor';
import Review from '../pages/Review';
import Author from '../pages/Author';
import Home from '../pages/Home.js';
import Reputation from "../pages/Reputation";
import Settings from "../pages/Settings";



//import sidebar css from react-pro-sidebar module and our custom css 
// import "react-pro-sidebar/dist/css/styles.css";
import "./SideNav.css";
import {
  Routes,
  Route,
  Link,
  useLocation
} from "react-router-dom";
import STRING_CONSTANTS from "../../constants.js";

export default function SideNav(
  {account,
  web3,
  chainId,
  authorBounties,
  editorBounties,
  reviewerBounties,
  PRContract,
  SoulBoundContract,
  profile,
  ReviewRewardTokenContract}) {
  
  //create initial menuCollapse state using useState hook
  const [menuCollapse, setMenuCollapse] = useState(false);
  const [hasImage, setHasImage] = React.useState(false);
  let location = useLocation().pathname;

  // hex to rgba converter
  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const menuItemStyles = {
    root: {
      fontSize: '16px',
      fontWeight: 400,
    },
    icon: {
      color: '#0098e5',
      [`&.${menuClasses.disabled}`]: {
        color: '#9fb6cf',
      },
    },
    SubMenuExpandIcon: {
      color: '#b6b7b9',
    },
    subMenuContent: ({ level }) => ({
      backgroundColor:
        level === 0
          ? hexToRgba('#fbfcfd', hasImage && !menuCollapse ? 0.4 : 1)
          : 'transparent',
    }),
    button: {
      [`&.${menuClasses.disabled}`]: {
        color: '#9fb6cf',
      },
      '&:hover': {
        backgroundColor: hexToRgba('#c5e4ff', hasImage ? 0.8 : 1),
        color: '#44596e',
      }
    },
    label: ({ open }) => ({
      fontWeight: open ? 600 : undefined,
    }),
  };

    //create a custom function that will change menucollapse state from false to true and true to false
  const menuIconClick = () => {
    //condition checking to change state from true to false and vice versa
    menuCollapse ? setMenuCollapse(false) : setMenuCollapse(true);
  };

  return (
    <>
      <div id="header" style={{ display: 'flex', height: '100%', minHeight: '400px', width:'100%' }}>
          {/* collapsed props to change menu size using menucollapse state */}
        <Sidebar collapsed={menuCollapse} >
            <div className="closemenu" onClick={menuIconClick}>
                {/* changing menu collapse icon on click */}
              {menuCollapse ? (
                <FiArrowRightCircle/>
              ) : (
                <FiArrowLeftCircle/>
              )}
            </div>
            <Menu iconShape="square" menuItemStyles={menuItemStyles}>
              <MenuItem 
                icon={<FaHome />} 
                component={<Link to="/" className="link" />}
              >
                Home
              </MenuItem>
              <MenuItem 
                active={location.includes('author')} 
                icon={<FaEdit />} 
                component={<Link to="/author" className="link" />}
              >Author</MenuItem>
              <SubMenu 
                active={location.includes('editor') || location.includes('settings')} 
                icon={<FaBookReader />} 
                label="Editor"
              >
                <MenuItem 
                  active={location.includes('editor')} 
                  icon={<MdDashboard />}
                  component={<Link to="/editor" className="link" />}
                >Dashboard</MenuItem>
                <MenuItem 
                  active={location.includes('settings')} 
                  icon={<MdSettingsSuggest />} 
                  component={<Link to="/settings" className="link" />}

                >{STRING_CONSTANTS.SETTINGS_PAGE}</MenuItem>
              </SubMenu>
              <SubMenu 
                active={location.includes('review') || location.includes('reputation')} 
                icon={<SiCodereview />} 
                label="Reviewer">
                <MenuItem 
                  active={location.includes('review')} 
                  icon={<MdDashboard />} 
                  component={<Link to="/review" className="link" />}
                >Dashboard</MenuItem>
                <MenuItem 
                  active={location.includes('reputation')} 
                  icon={<FaMedal />} 
                  component={<Link to="/reputation" className="link" />}
                >Reputation</MenuItem>

              </SubMenu>

            </Menu>
        </Sidebar>
      <main style={{width: '100%'}}>
          {/* <div> */}
            <Routes>
                <Route path="/author"
                    element={
                        <Author
                            chainId={chainId}
                            account={account}
                            authorBounties={authorBounties}
                            PRContract={PRContract}
                            // SoulBoundContract={SoulBoundContract}
                            web3={web3}
                        />} />
                <Route path="/editor"
                    element={
                        <Editor
                            chainId={chainId}
                            account={account}
                            editorBounties={editorBounties}
                            PRContract={PRContract}
                            SoulBoundContract={SoulBoundContract}
                            web3={web3}

                        />
                    }
                />
                <Route path="/review"
                    element={
                        <Review
                            chainId={chainId}
                            account={account}
                            reviewerBounties={reviewerBounties}
                            PRContract={PRContract}
                            // SoulBoundContract={SoulBoundContract}
                            profile={profile}
                            web3={web3}

                        />
                    } 
                />
                <Route path="/"
                    element={
                    <Home PRContract={PRContract} />
                    } 
                />
                <Route path="/reputation"
                    element={<Reputation
                        PRContract={PRContract}
                        SoulBoundContract={SoulBoundContract}
                        ReviewRewardTokenContract={ReviewRewardTokenContract}
                        account={account}
                    />}
                />
                <Route path="/settings"
                    element={<Settings
                        PRContract={PRContract}
                        SoulBoundContract={SoulBoundContract}
                        ReviewRewardTokenContract={ReviewRewardTokenContract}
                        account={account}
                    />}
                />
            </Routes>
        {/* </div> */}
      </main>
      </div>
    </>
  );
};