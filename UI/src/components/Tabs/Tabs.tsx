import React, { ReactNode, ReactElement } from "react";

interface StepTabProps {
  title: string;
  name: string;
  children: ReactNode;
  style?: React.CSSProperties;
}

interface StepTabsProps {
  children: ReactElement<StepTabProps>[];
  activeTab: number;
  setActiveTab: (index: number) => void;
  mode: "view" | "edit";
}

export const Tabs: React.FC<StepTabsProps> = ({
  children,
  activeTab,
  setActiveTab,
  mode,
}) => {
  const goToTab = (index: number) => {
    if (index === activeTab) return;
    if (mode === "edit") return;
    setActiveTab(index);
  };

  return (
    <>
      {/* Tab Headers */}
      <div className="flex gap-2 border-b mb-4">
        {children.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => goToTab(idx)}
            className={`px-4 py-2 transition ${
              idx === activeTab
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
            disabled={mode === "edit"}
          >
            {tab.props.title}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {children.map((child, index) =>
          React.cloneElement(child, {
            key: index,
            style: {
              display: index === activeTab ? "block" : "none",
            },
          })
        )}
      </div>
    </>
  );
};

export const Tab: React.FC<StepTabProps> = ({ children, style }) => (
  <div style={style}>{children}</div>
);
