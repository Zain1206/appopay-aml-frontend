import { faHandshake, faWallet, faKey, faCube, faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: IconDefinition | string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  groupClasses?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: NavigationItem[];
  link?: string;
  description?: string;
  path?: string;
  imageUrl?: string;
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    title: '',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'default',
        title: 'Dashboard',
        type: 'item',
        classes: 'nav-item',
        url: '/dashboard',
        icon: faKey,
        breadcrumbs: false
      },
      {
        id: 'users',
        title: 'Users',
        type: 'item',
        classes: 'nav-item',
        url: '/users',
        icon: faCube,
        target: false,
        breadcrumbs: false
      },
      {
        id: 'customers',
        title: 'Customers',
        type: 'item',
        classes: 'nav-item',
        url: '/customers',
        icon: 'user',
        imageUrl: 'assets/images/Appo-Logo.png',
        target: false,
        breadcrumbs: false
      },
      {
        id: 'merchant',
        title: 'Merchant',
        type: 'item',
        classes: 'nav-item',
        url: '/merchant',
        icon: faWallet,
        target: false,
        breadcrumbs: false
      },
      {
        id: 'agent',
        title: 'Agent',
        type: 'item',
        classes: 'nav-item',
        url: '/agent',
        icon: faHandshake,
        target: false,
        breadcrumbs: false
      },
      {
        id: 'partner',
        title: 'Partner',
        type: 'item',
        classes: 'nav-item',
        url: '/partner',
        icon: 'profile',
        target: false,
        breadcrumbs: false
      },
      {
        id: 'transactions',
        title: 'Transactions',
        type: 'item',
        classes: 'nav-item',
        url: '/transactions',
        icon: faMoneyBill,
        target: false,
        breadcrumbs: false
      }
    ]
  },
];
