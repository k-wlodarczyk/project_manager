import { useState, useRef } from "react";
import SidebarButtonAdd from "../SidebarButtonAdd/SidebarButtonAdd";
import styles from "./SidebarHeader.module.css";

import { useOnClickOutside } from "usehooks-ts";

interface SidebarHeaderProps {
  title: string;
  onClick: () => void;
  checkedElements?: any[];
  dropdownOptions?: any[];
}

export default function SidebarHeader({
  title,
  onClick,
  checkedElements,
  dropdownOptions,
}: SidebarHeaderProps) {
  const [isActiveDropdown, setIsActiveDropdown] = useState<boolean>(false);

  const ref = useRef<any>(null);

  function handleToggleDropdown() {
    setIsActiveDropdown((prev) => !prev);
  }

  function handleClickOutside() {
    setIsActiveDropdown(false);
    console.log("i am here");
  }

  useOnClickOutside(ref, handleClickOutside);

  return (
    <div>
      <div className={styles.sidebarHeaderSection}>
        <div className={styles.sidebarTitle}>
          <h2>{title}</h2>
          <SidebarButtonAdd onClick={onClick} />
        </div>
        {checkedElements && checkedElements.length > 0 && (
          <div ref={ref}>
            <button
              className={styles.btnDropdown}
              onClick={handleToggleDropdown}
            >
              Selected elements: {checkedElements.length}{" "}
              <span>
                <ion-icon name="chevron-down-outline"></ion-icon>
              </span>
            </button>
            {isActiveDropdown && (
              <div className={styles.dropdownMenu}>
                {dropdownOptions &&
                  dropdownOptions.map((option: any) => (
                    <div
                      key={option.label}
                      className={styles.dropdownOption}
                      onClick={option.onClick}
                    >
                      {option.label}
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
