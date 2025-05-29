package com.example.fashionshop.service;

import com.paypal.api.payments.*;
import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.PayPalRESTException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class PaypalService {
    private final APIContext apiContext;

    public Payment createPayment(double totalInVnd, String currency, String method,
                                 String intent, String description, String cancelUrl, String successUrl) throws PayPalRESTException {

        double totalInUsd = convertVndToUsd(totalInVnd);

        Amount amount = new Amount();
        amount.setCurrency(currency);
        amount.setTotal(String.format(Locale.ENGLISH, "%.2f", totalInUsd));

        Transaction transaction = new Transaction();
        transaction.setDescription(description);
        transaction.setAmount(amount);

        List<Transaction> transactions = new ArrayList<>();
        transactions.add(transaction);

        Payer payer = new Payer();
        payer.setPaymentMethod(method);

        Payment payment = new Payment();
        payment.setPayer(payer);
        payment.setTransactions(transactions);
        payment.setIntent(intent);

        RedirectUrls redirectUrls = new RedirectUrls();
        redirectUrls.setCancelUrl(cancelUrl);
        redirectUrls.setReturnUrl(successUrl);
        payment.setRedirectUrls(redirectUrls);

        return payment.create(apiContext);
    }

    public Payment excutePayment(String paymentId, String payerId) throws PayPalRESTException {
        Payment payment = new Payment();
        payment.setId(paymentId);

        PaymentExecution execution = new PaymentExecution();
        execution.setPayerId(payerId);

        return payment.execute(apiContext, execution);
    }

    public double convertVndToUsd(double vndAmount) {
        double exchangeRate = 26000.0;
        return vndAmount / exchangeRate;
    }
}
