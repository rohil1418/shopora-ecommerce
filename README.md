# Shopora

A full-stack fashion e-commerce project with a React storefront and a Node.js API.

| Folder | What it is | Stack |
|---|---|---|
| [`frontend/`](./frontend) | Storefront UI | React, TypeScript, Vite, Tailwind CSS, Motion |
| [`backend/`](./backend) | REST API (in progress) | Node.js, Express, TypeScript, MongoDB |

Both projects use a **feature-based monolith** structure: code is grouped by feature (products, orders, auth) instead of by file type.

## Status

- **Frontend:** home page, mega menu, collection pages, product page, bag page, wishlist, 404 page
- **Backend:** project setup, database connection, health check

## Run locally

Prerequisites: Node.js 20+ and MongoDB (local or Atlas).

```bash
git clone https://github.com/rohil1418/shopora-ecommerce.git
cd shopora-ecommerce
```

**Backend** (runs on port 5000):

```bash
cd backend
npm install
cp .env.example .env   # then fill in your values
npm run dev
```

**Frontend** (runs on port 5173, proxies `/api` to the backend):

```bash
cd frontend
npm install
npm run dev
```

## Roadmap

- [x] Frontend storefront
- [x] Backend foundation
- [ ] Authentication (register, login, admin role)
- [ ] Products API and admin CRUD (CMS)
- [ ] Orders with customer details and status
- [ ] Admin dashboard
- [ ] Connect frontend to the API, login before checkout

See [`frontend/README.md`](./frontend/README.md) for frontend details.