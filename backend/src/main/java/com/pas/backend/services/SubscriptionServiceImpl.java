package com.pas.backend.services;

import com.pas.backend.Repository.SubscriptionRepository;
import com.pas.backend.model.PlanType;
import com.pas.backend.model.Subscription;
import com.pas.backend.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class SubscriptionServiceImpl implements SubscriptionService {
    @Autowired
    private SubscriptionRepository subscriptionRepository;
    @Autowired
    private UserService userService;
    @Override
    public Subscription createSubscription(User user) {
        Subscription subscription = new Subscription();
        subscription.setUser(user);
        subscription.setStartTime(LocalDate.now());
        subscription.setEndTime(LocalDate.now().plusMonths(3));
        subscription.setIsActive(true);
        subscription.setPlanType(PlanType.FREE);
        return subscriptionRepository.save(subscription);
    }

    @Override
    public Subscription getUserSubscription(Long userId) throws Exception {
        Subscription subscription = subscriptionRepository.findByUserId(userId);
        if(!isValidSubscription(subscription)) {
            subscription.setPlanType(PlanType.FREE);
            subscription.setEndTime(LocalDate.now().plusMonths(3));
            subscription.setStartTime(LocalDate.now());
        }
        return subscriptionRepository.save(subscription);
    }

    @Override
    public Subscription updateSubscription(Long userId, PlanType planType) {
        Subscription subscription = subscriptionRepository.findByUserId(userId);
        subscription.setPlanType(planType);
        if(planType == PlanType.ANNUALLY) {
            subscription.setStartTime(LocalDate.now().plusYears(1));
        }else{
            subscription.setStartTime(LocalDate.now().plusMonths(1));
        }
        return subscriptionRepository.save(subscription);
    }

    @Override
    public boolean isValidSubscription(Subscription subscription) {
        if(subscription.getPlanType() == PlanType.FREE) {
            return true;
        }
        LocalDate startTime = subscription.getStartTime();
        LocalDate endTime = subscription.getEndTime();

        return endTime.isBefore(startTime) || endTime.equals(startTime);
    }
}
