// We use this to perform the fancy delay and to check

import { useState } from "react";

// Just some fancy delay
async function submitFormDelay() {
  await new Promise((res) => setTimeout(res, 1000));
}

// the state if the transaction is still transacting
const Submit = ({ isPending }) => {
  const [pending, setNoPending] = useState(false);

  async function handleSubmit() {
    setNoPending(isPending);
    console.log("Receipt", isPending);
    await submitFormDelay();
    setNoPending(false);
  }
  return (
    <button className="btn btn__submit" type="submit" onClick={handleSubmit}>
      {pending ? "Publishing..." : "Publish"}
    </button>
  );
};

export default Submit;
