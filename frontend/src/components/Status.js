const Status = ({ status }) => {
  if (status === undefined) {
    return "❎ Only author can publish books";
  }
  if (status.status === "success") {
    return "✅";
  }
  // else if "error"
  return "❎ Only author can publish books";
};

export default Status;
