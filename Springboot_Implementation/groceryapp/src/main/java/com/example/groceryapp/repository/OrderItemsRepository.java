package com.example.groceryapp.repository;

import com.example.groceryapp.entity.OrderItems;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderItemsRepository extends JpaRepository<OrderItems, Long> {

    List<OrderItems> findByOrder_OrderId(Long orderId);
}