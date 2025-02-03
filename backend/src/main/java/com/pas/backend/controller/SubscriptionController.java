package com.pas.backend.controller;

import com.pas.backend.model.PlanType;
import com.pas.backend.model.Subscription;
import com.pas.backend.model.User;
import com.pas.backend.services.SubscriptionService;
import com.pas.backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {
    @Autowired
    private SubscriptionService subscriptionService;

    @Autowired
    private UserService userService;

    @GetMapping("/user")
    public ResponseEntity<Subscription> getUserSubscriptions(
            @RequestHeader("Authentication") String jwt
    ) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        Subscription subscription = subscriptionService.getUserSubscription(user.getId());
        return new ResponseEntity<>(subscription, HttpStatus.OK);
    }

    @PatchMapping("/update")
    public ResponseEntity<Subscription> updateUserSubscription(
            @RequestHeader("Authentication") String jwt,
            @RequestParam PlanType planType
            )throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        Subscription subscription = subscriptionService.updateSubscription(user.getId(), planType);
        return new ResponseEntity<>(subscription, HttpStatus.OK);

    }
}
