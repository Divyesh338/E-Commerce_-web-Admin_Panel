# AlibabaPro — E-Commerce Admin Panel (Angular 15)

[![Angular](https://img.shields.io/badge/Angular-15.x-red)]()

AlibabaPro is a modern, scalable Admin Panel for e-commerce built with **Angular 15**.  
It focuses on **dynamic component rendering**: UI pages/forms/components are generated at runtime from JSON configuration so new screens can be created without changing core code.

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Install](#install)
- [Run (development)](#run-development)
- [Build](#build)
- [Testing](#testing)
- [Dynamic component rendering — how it works](#dynamic-component-rendering---how-it-works)
  - [Config example (JSON)](#config-example-json)
  - [Dynamic component registry (example)](#dynamic-component-registry-example)
  - [Dynamic loader service (example)](#dynamic-loader-service-example)
  - [Usage in a page component (example)](#usage-in-a-page-component-example)
- [Modules & features](#modules--features)
- [Styling & Theming](#styling--theming)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- Config-driven sidebar navigation with multi-level menus  
- Lazy-loaded Angular feature modules  
- Centralized layout (Header, Sidebar, Breadcrumb, Footer)  
- Modular architecture for large admin systems  
- REST API integration (.NET backend)  
- Responsive UI using Bootstrap 5  
- Reusable shared components  
- HTTP interceptors for request/response handling  
- Easily extendable admin features  

---

## Tech stack

- **Angular:** 15  
- **TypeScript**  
- **RxJS**  
- **SCSS + Bootstrap 5**  
- **Angular Router** (lazy-loaded modules)  
- **ng-bootstrap**  
- **ag-Grid / ngx-datatable**  
- **SweetAlert2, ngx-toastr**  
- **CKEditor 4**  
- **Feather Icons & FontAwesome**  

---

## Project structure

```text
src/app/
├── components/
│   ├── auth/
│   ├── dashboard/
│   ├── products/
│   ├── sales/
│   ├── masters/
│   ├── users/
│   ├── reports/
│   ├── invoice/
│   └── settings/
├── interceptors/
│   ├── request/
│   └── response/
├── shared/
│   ├── components/
│   │   ├── header/
│   │   ├── side-bar/
│   │   ├── footer/
│   │   ├── layout/
│   │   └── bread-crumb/
│   ├── interfaces/
│   ├── routes/
│   ├── services/
│   ├── utility/
│   └── validations/

```

## run-development
 # Requirements
  - Node.js: v18.20.8
  - npm: v10.8.2
  - Angular CLI: 15.2.11
  - Install dependencies
  - npm install

 # Run (development)
  - ng serve

 # Open in browser:
  - http://localhost:4200

 # Build
 - ng build --configuration production
 - Output directory: dist/

 - Known build warnings
 - SCSS budget warning (header component)
 - CommonJS warnings:
 - sweetalert2
 - feather-icons
 - Initial bundle size exceeds default Angular budget
 - These warnings do not block production builds.

--- 

 ## dynamic-component-rendering---how-it-works
  - AlibabaPro uses configuration-driven rendering at the routing and navigation level.

  - Menu / Route config
        ↓
  - Layout component
        ↓
  - Lazy-loaded feature module
        ↓
  - Feature components render dynamically

---

  ## config-example-json

  - MENUITEMS = [
    {
      title: 'Products',
      icon: 'box',
      type: 'menu',
      children: [
        {
          title: 'Manage',
          type: 'menu',
          children: [
            {
              title: 'Product List',
              type: 'link',
            path: 'products/manage/product-list'
            },
            {
              title: 'Add Product',
              type: 'link',
              path: 'products/manage/add-product'
            }
          ]
        }
      ]
    }
  ];

  # Dynamic behavior is currently achieved through:
    - Angular routing
    - Lazy-loaded feature modules
    - Config-driven navigation

## Modules & features
- Dashboard
- Products Management
- Sales (Orders & Transactions)
- Masters (Category, Brand, Size, Color, Tag)
- Users Management
- Reports
- Invoice
- Settings (Profile)

---

## Styling & Theming
  - SCSS-based styling
  - Bootstrap 5 grid & utilities
  - Reusable layout components
  - Fully responsive admin layo

---

## Deployment
 - Platform: Netlify
 - Angular app deployed as static files
 - Backend (.NET API) hosted separately

---
