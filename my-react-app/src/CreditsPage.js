import React from "react";
import NavBar from "./NavBar"; // 如果你已经创建了NavBar组件并希望在所有页面保持一致的导航

const CreditsPage = () => {
  return (
    <div className="container">
      <NavBar /> {/* 如果使用NavBar进行导航 */}
      <h1>Credits Page</h1>
      <p>
        This simulation of Conway's Game of Life was developed by{" "}
        <strong>Yun Feng</strong>.
      </p>
      <p>
        My GitHub repository{" "}
        <strong>https://github.com/zoeyfeng7/yun-feng-assignment2</strong>
      </p>
    </div>
  );
};

export default CreditsPage;
