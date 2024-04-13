1. To run the API: ```npm run dev``` or ```npm run start```

2. **Routes:**

   _login:_

               POST('/login'): login

   _product:_

               GET('/products'): get all products

               GET('/products/:id'): get a product by id

   Require login:

   _user:_
   
              POST('/user'): create user
   
              GET('/user/me'): get current user
   
              PUT('/user/me'): update current user

   _admin:_

               GET('/admin/users'): get all users' information

               GET('/amdin/orders'): get all orders

               PATCH('/admin/orders/:id'): update an order

               POST('/admin/products'): create a new product

               PUT/DELETE('/admin/products/:id'): update/delete a product

    _order:_

              POST('/orders'): create a new order for current user

              POST('/orders/addCart'): add current product to your cart

              GET('/orders/me/pending'): get pending order of current user

              GET('/orders/me/completed'): get completed order of current user

              GET('/orders/:id'): get order by id

              GET('/orders/:id/item/:itemid'): get order item by itemid with order of id

              PATCH('/orders/:id'): update order by id (address, status, payment method)

              PATCH('/orders/:id/item/:itemid'): update order item by itemid with order of id (quantity)

4. **Sample accounts:**

   user: ```dang@gmail.com```, ```dang```

   admin: ```admin@gmail.com```, ```admin```

5. **ERD:**

   ![ERD](https://github.com/DangTranQL/marketplace-be-ts/assets/72413423/125878cd-5a9c-4034-a3d2-7ea0e883c137)

