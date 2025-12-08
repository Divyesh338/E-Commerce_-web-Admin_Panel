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

- Dynamic UI rendering from JSON configuration (forms, tables, cards, widgets).
- Modular & lazy-loaded Angular modules (Products, Orders, Users, Dashboard, Settings).
- Role-based UI (Admin / Manager / Editor).
- CRUD operations scaffolding with reusable components.
- Responsive layout with collapsible sidebar and header.
- Service-based data access with RxJS & Observables.
- Easy to extend: add components to registry and use them in configs.

---

## Tech stack

- Angular 15
- TypeScript
- RxJS
- SCSS for styling
- Angular Router (lazy-loaded modules)
- Optional: Angular Material (or your custom UI library)

---

## Project structure

