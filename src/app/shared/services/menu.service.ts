import { Injectable } from '@angular/core';
import { Menu } from '../interfaces/menu.interface';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  constructor() { }

  MENUITEMS: Menu[] = [
    {
      title: 'Dashboard',
      path: 'dashboard/default',
      icon: 'home',
      type: 'link',
      active: true,
    },
    {
      title: 'Products',
      icon: 'box',
      type: 'menu',
      active: false,
      children: [
        {
          title: 'Manage',
          type: 'menu',
          active: false,
          children: [
            {
              title: 'Product-List',
              type: 'link',
              path: 'products/manage/product-list',
            },
            {
              title: 'Add-Product',
              type: 'link',
              path: 'products/manage/add-product',
            },
          ],
        },
      ],
    },
    {
      title: 'Sales',
      icon: 'dollar-sign',
      type: 'menu',
      active: false,
      children: [
        {
          title: 'Orders',
          type: 'link',
          path: 'sales/orders',
        },
        {
          title: 'Transactions',
          type: 'link',
          path: 'sales/transactions',
        },
      ],
    },
    {
      title: 'Masters',
      icon: 'clipboard',
      type: 'menu',
      active: false,
      children: [
        {
          title: 'Brand-Logo',
          type: 'link',
          path: 'masters/brand-logo',
        },
        {
          title: 'Category',
          type: 'link',
          path: 'masters/category',
        },
        {
          title: 'Color',
          type: 'link',
          path: 'masters/color',
        },
        {
          title: 'Size',
          type: 'link',
          path: 'masters/size',
        },
        {
          title: 'Tag',
          type: 'link',
          path: 'masters/tag',
        },
        {
          title: 'User-Type',
          type: 'link',
          path: 'masters/userType',
        },
      ],
    },
    {
      title: 'Users',
      icon: 'user-plus',
      type: 'menu',
      active: false,
      children: [
        {
          title: 'User-List',
          type: 'link',
          path: 'users/list-user',
        },
        {
          title: 'Add-Users',
          type: 'link',
          path: 'users/add-user',
        },
      ],
    },
    {
      title: 'Settings',
      icon: 'settings',
      type: 'menu',
      active: false,
      children: [
        {
          title: 'Profile',
          type: 'link',
          path: 'settings/profile',
        },
      ],
    },
    {
      title: 'Reports',
      path: 'reports',  
      icon: 'bar-chart',
      type: 'link',
      active: false,
    },
    {
      title: 'Invoice',
      path: 'invoice',
      icon: 'archive',
      type: 'link',
      active: false,
    },
    {
      title: 'Logout',
      path: 'login',
      icon: 'log-out',
      type: 'link',
      active: false,
    },
  ];
}
