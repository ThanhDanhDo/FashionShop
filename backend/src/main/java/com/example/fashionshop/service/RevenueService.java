package com.example.fashionshop.service;

import com.example.fashionshop.enums.Gender;
import com.example.fashionshop.enums.Role;
import com.example.fashionshop.model.Order;
import com.example.fashionshop.model.Report;
import com.example.fashionshop.model.RevenueChart;
import com.example.fashionshop.repository.OrderRepository;
import com.example.fashionshop.repository.ReportRepository;
import com.example.fashionshop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RevenueService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ReportRepository reportRepository;

    //tính doanh thu trong days ngày gần nhất
    public List<RevenueChart> getDailyRevenueForChart(int days) {
        List<RevenueChart> revenueData = new ArrayList<>();
        LocalDate currentDate = LocalDate.now();

        for (int i = days - 1; i >= 0; i--) {
            LocalDate date = currentDate.minusDays(i);
            double dailyRevenue = orderRepository
                    .findByOrderDateBetween(date.atStartOfDay(), date.plusDays(1).atStartOfDay())
                    .stream()
                    .mapToDouble(Order::getTotalOrderPrice)
                    .sum();
            RevenueChart revenueChart = new RevenueChart();
            revenueChart.setValue(dailyRevenue);
            revenueChart.setDate(date.toString());

            revenueData.add(revenueChart);
        }
        return revenueData;
    }

    public List<RevenueChart> getMonthlyRevenueForChart(int months) {
        List<RevenueChart> revenueData = new ArrayList<>();
        LocalDate currentDate = LocalDate.now();
        for (int i = months - 1; i >= 0; i--) {
            LocalDate date = currentDate.minusMonths(i);
            LocalDate startOfMonth = date.withDayOfMonth(1);
            LocalDate startOfNextMonth = startOfMonth.plusMonths(1);
            double monthlyRevenue = orderRepository
                    .findByOrderDateBetween(startOfMonth.atStartOfDay(), startOfNextMonth.atStartOfDay())
                    .stream()
                    .mapToDouble(Order::getTotalOrderPrice)
                    .sum();
            RevenueChart revenueChart = new RevenueChart();
            revenueChart.setValue(monthlyRevenue);
            revenueChart.setDate(date.getYear() + "-" + String.format("%02d", date.getMonthValue()));

            revenueData.add(revenueChart);
        }
        return revenueData;
    }

    public List<RevenueChart> getRevenueChartByType (String type) {
        if (type.equals("monthly")){
            return this.getMonthlyRevenueForChart(12);
        }
        else {
            return this.getDailyRevenueForChart(30);
        }
    }

    public Report getReport() {
        Report report = reportRepository.findById(1L).orElseGet(() -> {
            Report newReport = new Report();
            return reportRepository.save(newReport);
        });
        return report;
    }

    public Report updateReport(Report report) {
        return reportRepository.save(report);
    }
}
