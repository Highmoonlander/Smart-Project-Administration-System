package com.pas.backend.services;

import com.pas.backend.model.PlanType;
import com.pas.backend.model.Subscription;
import com.pas.backend.model.User;

public interface SubscriptionService {
    Subscription createSubscription(User user);
    Subscription getUserSubscription(Long userId) throws Exception;
    Subscription updateSubscription(Long userId, PlanType planType);
    boolean isValidSubscription(Subscription subscription);

}
