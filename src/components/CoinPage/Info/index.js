import React, { useState } from "react";
import "./styles.css";

function Info({ title, desc }) {
  const isLong = desc && desc.length > 300;
  const shortDesc = desc ? desc.slice(0, 300) + `<br/><span class="read-more">Read More...</span>` : "";
  const longDesc = desc ? desc + `<br/><span class="read-more">Read Less...</span>` : "";
  
  const [toggle, setToggle] = useState(false);
  const content = desc 
    ? (isLong ? (toggle ? longDesc : shortDesc) : desc)
    : "No description available.";

  return (
    <div className="grey-wrapper info-component">
      <h1>{title}</h1>
      <p 
        className="info-p" 
        dangerouslySetInnerHTML={{ __html: content }}
        onClick={() => { if (isLong) setToggle(!toggle); }}
      />
    </div>
  );
}

export default Info;
