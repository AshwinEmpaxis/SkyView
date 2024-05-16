// assets
import { IconKey } from '@tabler/icons-react';

// constant
const icons = {
  IconKey
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
  id: 'pages',
  title: 'Pages',
  caption: 'Pages Caption',
  type: 'group',

  children: [
    {
      id: 'upload-files',
      title: 'Upload Files',
      type: 'item',
      url: '/upload-files',
      icon: icons.IconBrandChrome,
      breadcrumbs: false
    },
    {
      id: 'view-data',
      title: 'View Data',
      type: 'item',
      url: '/view-data',
      icon: icons.IconBrandChrome,
      breadcrumbs: false
    },
    {
      id: 'cusip-dublicates',
      title: 'Cusip Validations',
      type: 'item',
      url: '/cusip-dublicates',
      icon: icons.IconBrandChrome,
      breadcrumbs: false
    },
    {
      id: 'master-accounts',
      title: 'Master Accounts',
      type: 'item',
      url: '/master-accounts',
      icon: icons.IconBrandChrome,
      breadcrumbs: false
    },

    {
      id: '13F-exporter',
      title: '13F Exporter',
      type: 'item',
      url: '/13F-exporter',
      icon: icons.IconBrandChrome,
      breadcrumbs: false
    },
    {
      id: 'security-master',
      title: 'Security Master',
      type: 'item',
      url: '/security-master',
      icon: icons.IconBrandChrome,
      breadcrumbs: false
    },
    {
      id: 'user-management',
      title: 'User Management',
      type: 'item',
      url: '/user-management',
      icon: icons.IconBrandChrome,
      breadcrumbs: false
    },

    {
      id: 'authentication',
      title: 'Authentication',
      type: 'collapse',
      icon: icons.IconKey,
      children: [
        {
          id: 'login3',
          title: 'Login',
          type: 'item',
          url: '/pages/login/login3',
          target: true
        },
        {
          id: 'register3',
          title: 'Register',
          type: 'item',
          url: '/pages/register/register3',
          target: true
        }
      ]
    }
  ]
};

export default pages;
