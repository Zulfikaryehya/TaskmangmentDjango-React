import React from "react";

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <div className="pt-6">{children}</div>}
    </div>
  );
}

export default TabPanel;
