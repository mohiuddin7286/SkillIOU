package com.skilliou.backend.controller;

import com.skilliou.backend.model.Ledger;
import com.skilliou.backend.repository.LedgerRepository;
import com.skilliou.backend.repository.UserRepository;
import com.skilliou.backend.service.LedgerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ledger")
public class LedgerController {

    @Autowired
    private LedgerService ledgerService;

    @Autowired
    private LedgerRepository ledgerRepository;

    @Autowired
    private UserRepository userRepository;

    // 1. Get My Balance
    @GetMapping("/balance/{userId}")
    public Map<String, Double> getBalance(@PathVariable Long userId) {
        Double balance = ledgerService.getUserBalance(userId);
        return Map.of("balance", balance);
    }

    // 2. Get My History
    @GetMapping("/history/{userId}")
    public List<Ledger> getHistory(@PathVariable Long userId) {
        return ledgerRepository.findByUserId(userId);
    }

    // 3. Add credits manually (for testing)
    @PostMapping("/add")
    public Ledger addLedgerEntry(@RequestBody Map<String, Object> request) {
        Object userIdValue = request.get("userId");
        Object creditChangeValue = request.get("creditChange");
        Object reasonValue = request.get("reason");

        if (userIdValue == null || creditChangeValue == null || reasonValue == null) {
            throw new RuntimeException("userId, creditChange and reason are required");
        }

        Long userId = ((Number) userIdValue).longValue();
        Double creditChange = ((Number) creditChangeValue).doubleValue();
        String reason = reasonValue.toString();

        var user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Ledger ledger = new Ledger();
        ledger.setUser(user);
        ledger.setCreditChange(creditChange);
        ledger.setReason(reason);

        return ledgerRepository.save(ledger);
    }
}