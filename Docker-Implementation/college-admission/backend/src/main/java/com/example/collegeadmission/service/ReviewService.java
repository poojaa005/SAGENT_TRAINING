package com.example.collegeadmission.service;

import com.example.collegeadmission.entity.Review;
import com.example.collegeadmission.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    // CREATE
    public Review saveReview(Review review) {
        return reviewRepository.save(review);
    }

    // READ ALL
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    // READ BY ID
    public Optional<Review> getReviewById(Long id) {
        return reviewRepository.findById(id);
    }

    // UPDATE
    public Review updateReview(Long id, Review reviewDetails) {
        Review review = reviewRepository.findById(id).orElseThrow();

        review.setStudentName(reviewDetails.getStudentName());
        review.setCourseName(reviewDetails.getCourseName());
        review.setComments(reviewDetails.getComments());
        review.setRating(reviewDetails.getRating());

        return reviewRepository.save(review);
    }

    // DELETE
    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }
}
