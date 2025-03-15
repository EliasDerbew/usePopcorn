import { useState } from "react";

export default function Challenge({
  collapsedNumWords = 100,
  expandButtonText = "Show More ...",
  collapseButtonText = "Show Less ...",
  buttonColor = "blue",
  expanded = false,
  className,
  children,
}) {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const displayText = isExpanded
    ? children
    : children.substring(0, collapsedNumWords);

  function handleExpanstion() {
    setIsExpanded(() => !isExpanded);
  }
  return (
    <div>
      <p className={className}>
        {displayText}{" "}
        <span
          onClick={handleExpanstion}
          style={{ cursor: "pointer", color: buttonColor }}
        >
          {isExpanded ? collapseButtonText : expandButtonText}
        </span>
      </p>
    </div>
  );
}
