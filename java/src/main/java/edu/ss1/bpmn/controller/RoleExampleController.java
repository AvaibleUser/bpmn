package edu.ss1.bpmn.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.annotation.security.RolesAllowed;
import lombok.Generated;

@RestController
public class RoleExampleController {

    @RolesAllowed({ "CLIENT", "ADMIN" })
    @GetMapping("/1")
    @Generated
    public void get1() {

    }

    @RolesAllowed("ADMIN")
    @GetMapping("/2")
    @Generated
    public void get2() {

    }

    @GetMapping("/")
    public String getHello() {
        return "Hello World!";
    }

}
