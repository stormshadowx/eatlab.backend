Please develop these features

1. Store the product details in a variable named 'store'.
2. Allow the ability to change the product name and price from the currently uploaded CSV file.
3. Allow the ability to increase or decrease the qty, but ensure it remains greater than or equal zero.\
   <b>Example of an increase case:</b>\
    <b>previous file</b>
   ```
   id,name,price,qty
   1696908,COCA-COLA Coke Light Soft Drink,28,1
   ```
   <b>current file</b>
   ```
   id,name,price,qty
   1696908,COCA-COLA Coke Light Soft Drink,28,3
   ```
   <b>The result data is stored in a variable named 'store'</b>
   ```
   store = [{
         "id": "1696908",
         "name": "COCA-COLA Coke Light Soft Drink",
         "price": 28,
         "qty": 4
     }]
   ```
   <b>Example of a decrease case:</b>\
    <b>previous file</b>
   ```
   id,name,price,qty
   1696908,COCA-COLA Coke Light Soft Drink,28,1
   ```
   <b>current file</b>
   ```
   id,name,price,qty
   1696908,COCA-COLA Coke Light Soft Drink,28,-1
   ```
   <b>The result data is stored in a variable named 'store'</b>
   ```
   store = [{
         "id": "1696908",
         "name": "COCA-COLA Coke Light Soft Drink",
         "price": 28,
         "qty": 0
     }]
   ```
4. Do not allow the duplication of product names.
5. Do not allow the duplication of IDs.
6. Provide error message responses for all disallowed cases.
7. Every time a request is made, the 'store' variable is returned to the client.
