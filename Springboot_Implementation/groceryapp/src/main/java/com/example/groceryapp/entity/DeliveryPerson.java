package com.example.groceryapp.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "delivery_person")
public class DeliveryPerson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long deliveryPersonId;

    private String name;
    private String phone;
    private String vehicleNumber;
    private String status; // Available / Busy

    // Constructors
    public DeliveryPerson() {}

    public DeliveryPerson(String name, String phone, String vehicleNumber, String status) {
        this.name = name;
        this.phone = phone;
        this.vehicleNumber = vehicleNumber;
        this.status = status;
    }

    // Getters and Setters

    public Long getDeliveryPersonId() {
        return deliveryPersonId;
    }

    public void setDeliveryPersonId(Long deliveryPersonId) {
        this.deliveryPersonId = deliveryPersonId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public void setVehicleNumber(String vehicleNumber) {
        this.vehicleNumber = vehicleNumber;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}