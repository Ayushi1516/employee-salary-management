package com.salary_service.controllers;

import com.salary_service.Services.SalaryService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import com.salary_service.Dtos.SalaryDtos.SalaryResponse;
import com.salary_service.Dtos.SalaryDtos.CreateSalaryRequest;
import com.salary_service.Dtos.SalaryDtos.UpdateSalaryRequest;

@RestController
@RequestMapping("/salaries")
public class SalaryController {

    private final SalaryService service;

    public SalaryController(SalaryService service) {
        this.service = service;
    }

}

