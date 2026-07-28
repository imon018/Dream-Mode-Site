rules_version = '2';

service cloud.firestore {

match /databases/{database}/documents {

function isAdmin() {  

  return request.auth != null  
  &&  
  get(  
    /databases/$(database)/documents/users/$(request.auth.uid)  
  ).data.role == "admin";  

}  





match /users/{userId} {  

  allow create:
    if true;

  allow read:
    if request.auth != null;

  allow update:
    if request.auth != null
    &&
    (
      request.auth.uid == userId
      ||
      isAdmin()
    );

  allow delete:
    if isAdmin();

}









match /orders/{orderId} {  


    allow create:
    if true;  


  allow read:  
    if request.auth != null
    ||
    // Guest checkout (landing page) orders never store a userId
    // field, so allow public read only for those — needed by
    // LandingOrderSuccess.jsx right after a guest places an order.
    // Normal shop orders always include userId, so they stay
    // protected behind request.auth != null above.
    !("userId" in resource.data);



  allow update:  
    if request.auth != null  
    &&  
    (  

      isAdmin()  


      ||  


      (  
        resource.data.userId == request.auth.uid  

        &&  

        request.resource.data.diff(resource.data)  
        .affectedKeys()  
        .hasOnly([  
          "status",  
          "cancelRequested"  
        ])  

        &&  

        request.resource.data.status == "Cancelled"  

      )  



      ||  



      (  
        resource.data.userId == request.auth.uid  

        &&  

        request.resource.data.diff(resource.data)  
        .affectedKeys()  
        .hasOnly([  
          "returnRequest",  
          "returnRequested",  
          "updatedAt"  
        ])  

      )  


    );  



  allow delete:  
    if isAdmin();  


}  









match /wishlist/{wishlistId} {  


  allow read:  
    if request.auth != null  
    &&  
    resource.data.userId == request.auth.uid;  



  allow create:  
    if request.auth != null  
    &&  
    request.resource.data.userId == request.auth.uid;  



  allow update:  
    if request.auth != null  
    &&  
    resource.data.userId == request.auth.uid;  



  allow delete:  
    if request.auth != null  
    &&  
    resource.data.userId == request.auth.uid;  


}  









match /products/{id} {  


  allow read:  
    if true;  



  allow write:  
    if isAdmin();  


}  





  

match /categories/{id} {

  allow read:
    if true;

  allow create, update, delete:
    if isAdmin();

}



  



match /settings/{id} {  


  allow read:  
    if true;  



  allow write:  
    if isAdmin();  


}  









match /heroBanners/{id} {  


  allow read:  
    if true;  



  allow write:  
    if isAdmin();  


}  









match /shopHero/{id} {  


  allow read:  
    if true;  



  allow write:  
    if isAdmin();  


}  









match /reviews/{id} {  


  allow read:  
    if true;  



  allow create:  
    if request.auth != null  
    &&  
    request.resource.data.userId == request.auth.uid;  


}  









match /cart/{id} {  


  allow read,write:  
    if request.auth != null  
    &&  
    request.resource.data.userId == request.auth.uid;  


}  









match /subscribers/{id} {  


  allow create:  
    if true;  



  allow read,delete:  
    if isAdmin();  


}  









match /notifications/{notificationId} {  


  allow create:  
    if request.auth != null;  



  allow read:  
    if request.auth != null  
    &&  
    (  

      resource.data.receiverId == request.auth.uid  

      ||  

      resource.data.receiverId == "ALL_USERS"  

      ||  

      resource.data.receiverId == "ADMIN"  

      ||  

      isAdmin()  

    );  





  allow update:  
    if request.auth != null  
    &&  
    (  

      resource.data.receiverId == request.auth.uid  

      ||  

      resource.data.receiverId == "ALL_USERS"  

      ||  

      resource.data.receiverId == "ADMIN"  

      ||  

      isAdmin()  

    );  





  allow delete:  
    if request.auth != null  
    &&  
    (  

      resource.data.receiverId == request.auth.uid  

      ||  

      resource.data.receiverId == "ALL_USERS"  

      ||  

      resource.data.receiverId == "ADMIN"  

      ||  

      isAdmin()  

    );  


}  









// =========================  
// PASSWORD CHANGE REQUESTS  
// =========================  

match /passwordChangeRequests/{requestId} {

  allow create:
    if request.auth != null
    &&
    request.resource.data.uid == request.auth.uid;

  allow update:
    if request.auth != null
    &&
    resource.data.uid == request.auth.uid
    &&
    request.resource.data.uid == request.auth.uid;

  allow read:
    if true;

  allow delete:
    if request.auth != null
    &&
    resource.data.uid == request.auth.uid;

  allow read, delete:
    if isAdmin();
}

  

// =========================
// PASSWORD RESET REQUESTS
// =========================

match /passwordResetRequests/{requestId} {


  // Forgot password request create
  allow create:
    if true;



  // Reset password page token verify
  allow read:
    if true;



  // Delete after password update
  allow delete:
    if true;


}

// =========================
// DELETE ACCOUNT REQUESTS
// =========================

match /deleteAccountRequests/{requestId} {

// User creates own delete request

allow create:
if request.auth != null
&&
request.resource.data.uid == request.auth.uid;

// Token verification page needs to check request

allow read:
if true;

// Delete after account deletion completed

allow delete:
if request.auth != null
&&
resource.data.uid == request.auth.uid;

// Admin access

allow read, delete:
if isAdmin();

}


// =========================
// LANDING PAGES
// =========================

match /landingPages/{landingId} {

  // সবাই Landing Page দেখতে পারবে
  allow read:
    if true;

  // শুধু Admin create/delete করতে পারবে
  allow create, delete:
    if isAdmin();

  // Admin সব field update করতে পারবে।
  // Guest বা Login user checkout সফল হওয়ার পর শুধু
  // orders/revenue counter (+ updatedAt) আপডেট করতে পারবে —
  // এই fix না থাকলে অর্ডার Firestore-এ create হয়ে গেলেও
  // incrementLandingOrders() এ permission-denied error থ্রো হয়ে
  // navigate(...) আর কল হতো না (LandingOrderSuccess পেজে যেত না)।
  allow update:
    if isAdmin()
    ||
    (
      request.resource.data.diff(resource.data)
      .affectedKeys()
      .hasOnly(["orders", "revenue", "updatedAt"])
    );

}


// =========================
// LANDING ORDERS
// =========================

match /landingOrders/{orderId} {

  // Guest-ও Order করতে পারবে
  allow create:
    if true;

  // শুধু Admin সব Order দেখতে, edit করতে ও delete করতে পারবে
  allow read, update, delete:
    if isAdmin();

}



// =========================
// EMAIL VERIFICATION REQUESTS
// =========================

match /emailVerificationRequests/{requestId} {


  // Register + Resend verification email
  // Login ছাড়া create করতে হবে
  allow create:
    if request.resource.data.email is string
    &&
    request.resource.data.uid is string;


  // Verification page token check
  allow read:
    if true;


  // Delete after verification
  allow delete:
    if true;


  // Admin access
  allow update:
    if isAdmin();


}



}

}
