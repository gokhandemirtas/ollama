import { SidebarLayout } from './catalyst/sidebar-layout';
import XpSideBar from './XpSideBar';
import XpSideNav from './XpSideNav';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <SidebarLayout
      navbar={XpSideNav()}
      sidebar={XpSideBar()}
    >
      <div className={className}>
        { children }
      </div>
    </SidebarLayout>
  )
}
