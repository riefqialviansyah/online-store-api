# API DOCS

## List Endpoint

- `POST` /user/login
- `POST` /user/register

- `GET` /product/list
- `POST` /product/add
- `PUT` /product/edit
- `PUT` /product/detail/edit
- `DELETE` /product/delete

- `GET` /product/pub

# Detail Endpoint

## `POST` /user/login

Login to app.

### Request

- body

```json
{
  "email": "string",
  "password": "string"
}
```

### Response

_200 - OK_

```json
{
   "message": "Success login",
   "token": <Access Token>
}
```

_400 - Bad Request_

```json
{
  "message": "Email and password is required"
}
```

_401 - Unauthorized_

```json
{
  "message": "Invalid email or password"
}
```

## `POST` /user/register

Register to app.

### Request

- body

```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

### Response

_201 - Create_

```json
{
  "message": "Success create user",
   "user": {
          "id": <UUID>,
          "username": "string",
          "email": "string",
        }
}
```

_400 - Bad Request_

```json
{
    "message": "Username is required"
}
OR
{
    "message": "Email already exists"
}
OR
{
    "message": "Email is required"
}
OR
{
    "message": "Please use valid email format"
}
OR
{
    "message": "Password is required"
}
OR
{
    "message": "Password minimum 5 characters"
}
```

## `GET` /product/list

View all product data with `admin` authorization.

### Request

- header

```json
{
  "Authorization": "Bearer <Access Token>"
}
```

### Response

_200 - Ok_

```json
{
  "message": "List products",
  "data": [
    {
      "id": "9704f2ea-3eaf-444e-83b1-35c00ef6eafe",
      "name": "iPhone 13 Pro",
      "price": 15000000,
      "stock": 240,
      "imgUrl": "https://example.com/iphone13pro.jpg",
      "Detail": {
        "ProductId": "9704f2ea-3eaf-444e-83b1-35c00ef6eafe",
        "launch": "2021-01-01T00:00:00.000Z",
        "os": "iOS 15",
        "resolution": "1170 x 2532 pixels",
        "internalMemory": "128GB / 256GB / 512GB / 1TB",
        "ram": "6GB",
        "mainCamera": "12 MP (wide), 12 MP (ultrawide), 12 MP (telephoto)",
        "selfieCamera": "12 MP",
        "battery": "Non-removable Li-Ion 3095 mAh battery",
        "brand": "Apple",
        "otherSpec": "Face ID, IP68 dust/water resistant, 5G capable"
      }
    },
    {
      "id": "89c2dc9d-787b-4502-9d41-f5aa6b46867c",
      "name": "Samsung Galaxy S21 Ultra",
      "price": 21000000,
      "stock": 120,
      "imgUrl": "https://example.com/galaxys21ultra.jpg",
      "Detail": {
        "ProductId": "89c2dc9d-787b-4502-9d41-f5aa6b46867c",
        "launch": "2021-01-01T00:00:00.000Z",
        "os": "Android 11, One UI 3.1",
        "resolution": "1440 x 3200 pixels",
        "internalMemory": "128GB / 256GB / 512GB",
        "ram": "12GB / 16GB",
        "mainCamera": "108 MP (wide), 12 MP (ultrawide), 10 MP (telephoto), 10 MP (periscope telephoto)",
        "selfieCamera": "40 MP",
        "battery": "Non-removable Li-Ion 5000 mAh battery",
        "brand": "Samsung",
        "otherSpec": "IP68 dust/water resistant, 5G capable, S Pen support"
      }
    },
    ...
  ]
}
```

## `POST` /product/add

Add new product.

### Request

- header

```json
{
  "Authrorization": "Bearer <Access Token>"
}
```

- body

```json
{
    {
    "name": "Xiaomi Mi 12 Ultra",
    "price": 4000000,
    "stock": 124,
    "imgUrl": "https://example.com/mi11ultra.jpg",
    "launch": "2021",
    "os": "Android 11, MIUI 12.5",
    "resolution": "1440 x 3200 pixels",
    "internalMemory": "256GB / 512GB",
    "ram": "8GB / 12GB",
    "mainCamera": "50 MP (wide), 48 MP (periscope telephoto), 48 MP (ultrawide)",
    "selfieCamera": "20 MP",
    "battery": "Non-removable Li-Po 5000 mAh battery",
    "brand": "Xiaomi",
    "otherSpec": "IP68 dust/water resistant, 5G capable",
  }
}
```

### Response

_201 - Create_

```json
{
  "message": "Success add product",
  "product": {
    "id": <UUID>,
    "name": "Xiaomi Mi 12 Ultra",
    "price": 4000000,
    "stock": 124,
    "imgUrl": "https://example.com/mi11ultra.jpg",
    "updatedAt": "date",
    "createdAt": "date",
    "isDelete": false
  },
  "detail": {
    "id": <UUID>,
    "ProductId": "8e05dbef-d69a-4ec5-8587-fec0352eec1b",
    "launch": "date",
    "os": "Android 11, MIUI 12.5",
    "resolution": "1440 x 3200 pixels",
    "internalMemory": "256GB / 512GB",
    "ram": "8GB / 12GB",
    "mainCamera": "50 MP (wide), 48 MP (periscope telephoto), 48 MP (ultrawide)",
    "selfieCamera": "20 MP",
    "battery": "Non-removable Li-Po 5000 mAh battery",
    "brand": "Xiaomi",
    "otherSpec": "IP68 dust/water resistant, 5G capable",
    "updatedAt": "date",
    "createdAt": "date",
  }
}
```

_400 - Bad Request_

```json
{
  "message": "Product name is required"
}
OR
{
  "message": "Price is required"
}
OR
{
  "message": "Stock is required"
}
OR
{
  "message": "Image URL is required"
}
```

## `PUT` /product/edit

Edit product data.

### Request

- header

```json
{
  "Authorization": "Bearer <Access Token>"
}
```

- body

You can edit value of key `name, price, stock or imgUrl` from table Products.

```json
{
  "ProductId": <UUID>,
  "stock": 222,
  "price": 6000000
}
```

### Response

_200 - Ok_

```json
{
  "message": "Success edit product",
  "data": {
    "id": <UUID>,
    "name": "iPhone 13 Pro",
    "isDelete": false,
    "price": 6000000,
    "stock": 222,
    "imgUrl": "https://example.com/iphone13pro.jpg",
    "createdAt": "2024-04-30T22:28:45.927Z",
    "updatedAt": "2024-05-01T00:51:01.140Z"
  }
}
```

## `PUT` /product/detail/edit

Edit detail product.

### Request

- header

```json
{
  "Authorization": "Bearer <Access Token>"
}
```

- body

You can edit value of key `launch, os, resolution, internalMemory, ram, mainCamera, selfieCamere, battery, brand or orherSpec` from table Details.

```json
{
  "ProductId": <UUID>,
  "os": "Android Terbatu Mantap",
  "ram": "30 GB"
}
```

### Response

_200 - Ok_

```json
{
  "message": "Success edit detail product",
  "data": {
    "id": "UUID",
    "ProductId": "UUID",
    "launch": "date",
    "os": "Android Terbatu Mantap",
    "resolution": "1170 x 2532 pixels",
    "internalMemory": "128GB / 256GB / 512GB / 1TB",
    "ram": "30 GB",
    "mainCamera": "12 MP (wide), 12 MP (ultrawide), 12 MP (telephoto)",
    "selfieCamera": "12 MP",
    "battery": "Non-removable Li-Ion 3095 mAh battery",
    "brand": "Apple",
    "otherSpec": "Face ID, IP68 dust/water resistant, 5G capable",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

_400 - Bad Request_

```json
{
  "message": "ProductId is required"
}
```

_404 - Not Found_

```json
{
  "message": "Product not found"
}
```

## `DELETE` /product/delete

### Request

- header

```json
{
  "Authorization": "Bearer <Access Token>"
}
```

- body

```json
{
  "ProductId": "UUID"
}
```

### Response

_200 - Ok_

```json
{
  "message": "Success delete product",
  "data": {
    "id": "UUID",
    "name": "iPhone 13 Pro",
    "statusDelete": true
  }
}
```

_404 - Not Found_

```json
{
  "message": "Product not found"
}
```

## `GET` /product/pub

### Request

- params

example (page): /product/pub?page=1

example (search): /product/pub?search=iphon

### Response

_200 - Ok_

```json
{
  "message": "Success get product by name",
  "data": {
    "page": 1,
    "totalPage": 1,
    "totalData": 2,
    "dataPerPage": 5,
    "data": [
      {
        "id": "UUID",
        "name": "iPhone 14 Pro",
        "price": 15000000,
        "stock": 200,
        "imgUrl": "https://example.com/iphone14pro.jpg"
      },
      {
        "id": "UUID",
        "name": "iPhone 13 Pro",
        "price": 60000,
        "stock": 222,
        "imgUrl": "https://example.com/iphone13pro.jpg"
      }
    ]
  }
}
```

## GLOBAL ERROR

_403 - Unauthorize_

```json
{
  "message": "You are not authorized to access site"
}
```

_500 - Internal Server Error_

```json
{
  "message": "Internal server error"
}
```
