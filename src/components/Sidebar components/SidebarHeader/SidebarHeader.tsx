import SidebarButtonAdd from "../SidebarButtonAdd/SidebarButtonAdd";
import styles from "./SidebarHeader.module.css";

interface SidebarHeaderProps {
  title: string;
  onClick: () => void;
  ref?: any;
  onToggleDropdown?: () => void;
  isActiveDropdown?: boolean;
  checkedElements?: any[];
  dropdownOptions?: any[];
}

export default function SidebarHeader({
  title,
  onClick,
  ref,
  onToggleDropdown,
  isActiveDropdown,
  checkedElements,
  dropdownOptions,
}: SidebarHeaderProps) {
  return (
    <div>
      <div className={styles.sidebarHeaderSection}>
        <div className={styles.sidebarTitle}>
          <h2>{title}</h2>
          <SidebarButtonAdd onClick={onClick} />
        </div>
        {checkedElements && checkedElements.length > 0 && (
          <div ref={ref}>
            <button className={styles.btnDropdown} onClick={onToggleDropdown}>
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
