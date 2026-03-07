import ProjectItem from "../ProjectItem/ProjectItem";
import Sidebar from "../Sidebar/Sidebar";
import SidebarHeader from "../SidebarHeader/SidebarHeader";
import SidebarItems from "../SidebarItems/SidebarItems";

export default function ProjectsSidebar() {
  return (
    <Sidebar>
      <SidebarHeader title="Projects" />
      <SidebarItems></SidebarItems>
    </Sidebar>
  );
}
