import React, { useState } from "react";

function RealtimeText({ goBack }) {
  const [text, setText] = useState("");

  return (
    <div>
      <h1>Realtime Text Page</h1>
      <input
        type="text"
        placeholder="Type something..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <p>You typed: {text}</p>
      <button onClick={goBack}>Go Back</button>
    </div>
  );
}

export default RealtimeText;
