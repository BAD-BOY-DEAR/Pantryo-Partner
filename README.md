======== Theme Colors ========
1. #FFFFFF
2. #FEF9E5
3. #E6AF88
4. #F4AA79
5. #C6B5C7
6. #5E3360

======== Font Used ========

1. OpenSans-Regular
2. OpenSans-Medium
3. OpenSans-SemiBold
4. OpenSans-Bold
5. OpenSans-ExtraBold
6. FredokaOne-Regular

================================

======== Libraries Used ========
1. React Navigation
2. React Native Async Storage
3. React Native Vector Icons - Ionicons
4. React Native CheckBox
5. React Native Animatable
6. React Native Dropdown Picker

================================

=========== Screens List & Documentation ===========

1. SplashScreen - Splash Screen will be active for only 3 Seconds    

2. Login Screen -
   
   a) If User is already registered then re-direct the user to the HomeScreen 
    and hold the user in session so that he does not have to login again and again
   
   b) If User Mobile number does not exist in the database then re-direct the 
    user to the VerificationScreen to validate the mobile number, after OTP Verification, 
    re-direct the user to the registration form on the HomeScreen    

3. Registration Screen - 
   
   a) Logo of the business is optional
   
   b) Logo size should automatically be reduced to minimum possible size, but 
    the image should not be blur
   
   c) When user clicks on category then modal will open, TextInput has been 
    given, which has to be removed
   
   d) Once user selects the category then the selected category value has to be 
    visible in the form, user can only select one category
   
   e) Address should be picked up from GPS, but the user should be able to edit the
    address if the location is not correct

4. Verification Screen -
  
  a) SMS should be auto read 
  
  b) Take AndroidManifest Permissions to auto read SMS

5. HomeScreen - 
  
  Header Area ==> 
  
  1) Registration Icon - If the user has not completed his Registration then everytime the
    user opens the App, he should be re-directed to 'RegistrationForm' Screen
  
  2. Go Live - Once the user has completed his registration and the KYC is approved, only then
    the user should be able to see this button. If the KYC is approved and the user enables the
    'Go Live' button, then all his products should be visible on the customer app

    Activity Area ==>
       
       i)  Orders - When clicked here do the following:  
       
            1) Take user to 'OrdersList' Screen, there user should be able to see all the orders
            placed by the customers
            
            2) The user to should be able to filter the orders according to the buttons given
            on top of the screen 
            
            3) When clicked on any order show user the customer 'OrderDetails', this screen has already
            been made, so it can be re-utilized
       
       ii) Payments - When clicked here do the following:        
            
            1) Take user to 'PaymentScreen' Screen, there user should be able to see all the payments
            received by him from the company
            
            2) The user to should be able to filter the payments according to the buttons given
            on top of the screen
    
    Overview Area ==>
        
        1) Orders - Show all orders received by user
        
        2) Payments - Show all payments made to the user by the company
    
    Ongoing Orders Today ==> Show only the orders for the day with Customer Name.
        
        1) Show Customer Name
        
        2) Show Date and time of Orders
        
        3) Show amount received
        
        4) Show Payment Status and mode of payment
        
        5) When clicked take user to the 'OrderDetails' Screen , there the user should be able to see
        the complete details of the order placed by the customer 
    
    ================ OrderDetails Screen ================
    
    1. Show Customer Name
    
    2. Show Items Ordered by the customer
    
    3. Show the Quantity
    
    4. Show the Unit
    
    5. Show the amount
    
    6. Show the user if the customer has made the payment or not and the Reference ID
    
    Checkbox Buttons Conditions ==>
    
    1. Confirm Order - 
        Once the user clicks on the Confirm Order button, this button should be disabled, 
        the information of this activity has to be sent customer and simultaneously to the 
        delivery partner
    
    2. Order Packed - 
        Once the user clicks on the Order Packed button, this button should be disabled, 
        the information of this activity has to be sent customer and simultaneously to the 
        delivery partner, with an SMS of 6 Digit Secret Code (OTP)
    
    3. Order Picked Up -        
        a) A modal should open to enter the OTP that has been sent of the Delivery Partner. Once OTP
        validation is successfull, then the information has to be sent to the customer, with the
        Name and Contact number of the Delivery partner  
        b) The image given below and the message has to be shown only when the OTP validation 
        is successfull 

5. Inventory -  
    
    1) If the user has not created his inventory, then show message 
    in <Text>No Products Found</Text>       
    
    2) If the user has added the products in his inventory, then show the Products
    according to the category added by the user
    
    3) Search Product - User should be able to search the product by the name of the, The user can write 
    the name of the product either exactly the same name as the product or even if the 
    Case Sense does not match
    
    4) If user clicks on any poduct, a modal opens where he should be able to edit the details of the
    product
    
    5) If User clicks on the disables the toggle switch (In Stock) then the Stock should show as 'Out Of Stock' to the customer
    
    6) By default the toggle switch will be enabled
    
    7) Add Products  Button -       
        
        ============ Create Category ============
        
        a) The user will first have to create the category of the products for eg: (Frozen Foods, Vegetables etc)
        
        b) If user Clicks on the + Icon in the 'CreateCategory' screen, the field should automatically
        add below 
        
        c) User is also to be given the option to " - " Delete the category on this screen
        
        d) Once clicked on CREATE take user to the 'AddProduct' screen
        
        e) If the user has already created a category then he can choose to skip        

        ============ Add Product ============
        
        a) User can only upload 4 Images
        
        b) In the Product Category dropdown, those categories have to be shown which have 
        been added by the user at 'CreateCategory' Screen
        
        c) Unit - User should be able to select one of the Units from the Pill buttons
        provided in the Modal


