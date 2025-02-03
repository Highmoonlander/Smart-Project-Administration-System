package com.pas.backend.controller;


import com.pas.backend.model.PlanType;
import com.pas.backend.model.User;
import com.pas.backend.response.PaymentLinkResponse;
import com.pas.backend.services.UserService;
import com.razorpay.PaymentLink;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {
    @Value("${razorpay.key}")
    private String key;

    @Value("${razorpay.secret")
    private String secret;

    @Autowired
    private UserService userService;

    @PostMapping("/{planType}")
    public ResponseEntity<PaymentLinkResponse> createPaymentLink(
            @PathVariable PlanType planType,
            @RequestHeader("Authorization") String jwt
            ) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        int amt = 799 * 100;
        if(planType.equals(PlanType.ANNUALLY)){
            amt = amt * 12;
            amt = (int) (amt * 0.7);
        }

        RazorpayClient razorpayClient = new RazorpayClient(key, secret);
        JSONObject paymentLinkRequest = new JSONObject();
        paymentLinkRequest.put("amount", amt);
        paymentLinkRequest.put("currency", "INR");

        JSONObject customer = new JSONObject();
        customer.put("first_name", user.getFullName());
        customer.put("email", user.getEmail());


        paymentLinkRequest.put("customer", customer);

        JSONObject notify = new JSONObject();
        notify.put("email", true);
        paymentLinkRequest.put("notify", notify);
        paymentLinkRequest.put("callback_url", "http://localhost:5173/upgrade_plan/success?planType=" + planType);

        PaymentLink paymentLink = razorpayClient.paymentLink.create(paymentLinkRequest);

        String paymentLinkId = paymentLink.get("id");
        String paymentLinkUrl = paymentLink.get("short_url");

        PaymentLinkResponse paymentLinkResponse = new PaymentLinkResponse();
        paymentLinkResponse.setId(paymentLinkId);
        paymentLinkResponse.setUrl(paymentLinkUrl);
        return new ResponseEntity<>(paymentLinkResponse, HttpStatus.CREATED);

    }

}
