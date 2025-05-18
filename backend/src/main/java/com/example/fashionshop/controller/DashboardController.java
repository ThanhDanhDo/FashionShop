package com.example.fashionshop.controller;

import com.example.fashionshop.model.Report;
import com.example.fashionshop.model.RevenueChart;
import com.example.fashionshop.service.RevenueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/dashboard")
public class DashboardController {
    private final RevenueService revenueService;

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/revenue/chart")
    public ResponseEntity<List<RevenueChart>> getRevenueChart(@RequestParam(defaultValue = "monthly") String type) {
        List<RevenueChart> revenue = revenueService.getRevenueChartByType(type);
        return ResponseEntity.ok(revenue);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/report")
    public Report getReport() {
        return revenueService.getReport();
    }
}
