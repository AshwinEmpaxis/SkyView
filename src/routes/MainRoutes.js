import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

// dashboard
const DashboardDefault = Loadable(lazy(() => import('views/pages/Component/Dashboard/Dashboard')));
const Exporter = Loadable(lazy(() => import('views/pages/Component/13FExporter/Exporter13F')));
const SecurityMasterCrud = Loadable(lazy(() => import('views/pages/Component/SecurityMaster/Securitymaster')));
const UploadFilesTab = Loadable(lazy(() => import('views/pages/Component/UploadFiles/TabIndex')));
const CusipDuplicates = Loadable(lazy(() => import('views/pages/Component/ValidationGroup/Cusip')));
const UserManageent = Loadable(lazy(() => import('views/pages/Component/UserManagement/UserManagement')));
const MasterAccounts = Loadable(lazy(() => import('views/pages/Component/MasterAccounts/Upload MasterAccounts')));
const ViewData = Loadable(lazy(() => import('views/pages/Component/Data View/ViewData')));
// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
const UtilsMaterialIcons = Loadable(lazy(() => import('views/utilities/MaterialIcons')));
const UtilsTablerIcons = Loadable(lazy(() => import('views/utilities/TablerIcons')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: (
    <AuthGuard>
      <MainLayout />
    </AuthGuard>
  ),
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },

    {
      path: 'utils',
      children: [
        {
          path: 'util-typography',
          element: <UtilsTypography />
        },
        {
          path: 'util-color',
          element: <UtilsColor />
        },
        {
          path: 'util-shadow',
          element: <UtilsShadow />
        }
      ]
    },
    {
      path: 'icons',
      children: [
        {
          path: 'tabler-icons',
          element: <UtilsTablerIcons />
        },
        {
          path: 'material-icons',
          element: <UtilsMaterialIcons />
        }
      ]
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    },
    {
      path: 'upload-files',
      element: <UploadFilesTab />
    },
    {
      path: 'view-data',
      element: <ViewData />
    },
    {
      path: 'cusip-dublicates',
      element: <CusipDuplicates />
    },
    {
      path: 'master-accounts',
      element: <MasterAccounts />
    },

    {
      path: '13F-exporter',
      element: <Exporter />
    },

    {
      path: 'security-master',
      element: <SecurityMasterCrud />
    },
    {
      path: 'user-management',
      element: <UserManageent />
    }
  ]
};

export default MainRoutes;
