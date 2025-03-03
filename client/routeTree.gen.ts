/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as R3listIndexImport } from './routes/3_list/index'
import { Route as R2aboutIndexImport } from './routes/2_about/index'
import { Route as R1homeIndexImport } from './routes/1_home/index'
import { Route as R3listList2IndexImport } from './routes/3_list/list2/index'
import { Route as R3listList1IndexImport } from './routes/3_list/list1/index'

// Create/Update Routes

const R3listIndexRoute = R3listIndexImport.update({
  id: '/3_list/',
  path: '/3_list/',
  getParentRoute: () => rootRoute,
} as any)

const R2aboutIndexRoute = R2aboutIndexImport.update({
  id: '/2_about/',
  path: '/2_about/',
  getParentRoute: () => rootRoute,
} as any)

const R1homeIndexRoute = R1homeIndexImport.update({
  id: '/1_home/',
  path: '/1_home/',
  getParentRoute: () => rootRoute,
} as any)

const R3listList2IndexRoute = R3listList2IndexImport.update({
  id: '/3_list/list2/',
  path: '/3_list/list2/',
  getParentRoute: () => rootRoute,
} as any)

const R3listList1IndexRoute = R3listList1IndexImport.update({
  id: '/3_list/list1/',
  path: '/3_list/list1/',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/1_home/': {
      id: '/1_home/'
      path: '/1_home'
      fullPath: '/1_home'
      preLoaderRoute: typeof R1homeIndexImport
      parentRoute: typeof rootRoute
    }
    '/2_about/': {
      id: '/2_about/'
      path: '/2_about'
      fullPath: '/2_about'
      preLoaderRoute: typeof R2aboutIndexImport
      parentRoute: typeof rootRoute
    }
    '/3_list/': {
      id: '/3_list/'
      path: '/3_list'
      fullPath: '/3_list'
      preLoaderRoute: typeof R3listIndexImport
      parentRoute: typeof rootRoute
    }
    '/3_list/list1/': {
      id: '/3_list/list1/'
      path: '/3_list/list1'
      fullPath: '/3_list/list1'
      preLoaderRoute: typeof R3listList1IndexImport
      parentRoute: typeof rootRoute
    }
    '/3_list/list2/': {
      id: '/3_list/list2/'
      path: '/3_list/list2'
      fullPath: '/3_list/list2'
      preLoaderRoute: typeof R3listList2IndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/1_home': typeof R1homeIndexRoute
  '/2_about': typeof R2aboutIndexRoute
  '/3_list': typeof R3listIndexRoute
  '/3_list/list1': typeof R3listList1IndexRoute
  '/3_list/list2': typeof R3listList2IndexRoute
}

export interface FileRoutesByTo {
  '/1_home': typeof R1homeIndexRoute
  '/2_about': typeof R2aboutIndexRoute
  '/3_list': typeof R3listIndexRoute
  '/3_list/list1': typeof R3listList1IndexRoute
  '/3_list/list2': typeof R3listList2IndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/1_home/': typeof R1homeIndexRoute
  '/2_about/': typeof R2aboutIndexRoute
  '/3_list/': typeof R3listIndexRoute
  '/3_list/list1/': typeof R3listList1IndexRoute
  '/3_list/list2/': typeof R3listList2IndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/1_home'
    | '/2_about'
    | '/3_list'
    | '/3_list/list1'
    | '/3_list/list2'
  fileRoutesByTo: FileRoutesByTo
  to: '/1_home' | '/2_about' | '/3_list' | '/3_list/list1' | '/3_list/list2'
  id:
    | '__root__'
    | '/1_home/'
    | '/2_about/'
    | '/3_list/'
    | '/3_list/list1/'
    | '/3_list/list2/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  R1homeIndexRoute: typeof R1homeIndexRoute
  R2aboutIndexRoute: typeof R2aboutIndexRoute
  R3listIndexRoute: typeof R3listIndexRoute
  R3listList1IndexRoute: typeof R3listList1IndexRoute
  R3listList2IndexRoute: typeof R3listList2IndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  R1homeIndexRoute: R1homeIndexRoute,
  R2aboutIndexRoute: R2aboutIndexRoute,
  R3listIndexRoute: R3listIndexRoute,
  R3listList1IndexRoute: R3listList1IndexRoute,
  R3listList2IndexRoute: R3listList2IndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/1_home/",
        "/2_about/",
        "/3_list/",
        "/3_list/list1/",
        "/3_list/list2/"
      ]
    },
    "/1_home/": {
      "filePath": "1_home/index.tsx"
    },
    "/2_about/": {
      "filePath": "2_about/index.tsx"
    },
    "/3_list/": {
      "filePath": "3_list/index.tsx"
    },
    "/3_list/list1/": {
      "filePath": "3_list/list1/index.tsx"
    },
    "/3_list/list2/": {
      "filePath": "3_list/list2/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
