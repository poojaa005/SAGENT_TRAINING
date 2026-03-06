package com.example.collegeadmission.config;

import com.example.collegeadmission.entity.Course;
import com.example.collegeadmission.entity.Officer;
import com.example.collegeadmission.repository.CourseRepository;
import com.example.collegeadmission.repository.OfficerRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final OfficerRepository officerRepository;
    private final CourseRepository courseRepository;

    public DataInitializer(
            OfficerRepository officerRepository,
            CourseRepository courseRepository
    ) {
        this.officerRepository = officerRepository;
        this.courseRepository = courseRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        seedDefaultOfficer();
        seedDefaultCourses();
    }

    private void seedDefaultOfficer() {
        if (officerRepository.findByOfficerGmail("admin@college.com").isPresent()) {
            return;
        }

        Officer officer = new Officer();
        officer.setOfficerName("Admin Officer");
        officer.setOfficerGmail("admin@college.com");
        officer.setOfficerPassword("admin123");
        officerRepository.save(officer);
    }

    private void seedDefaultCourses() {
        if (courseRepository.count() > 0) {
            return;
        }

        courseRepository.saveAll(List.of(
                createCourse("B.Tech Computer Science", "Engineering", "4 Years"),
                createCourse("BBA", "Management", "3 Years"),
                createCourse("B.Sc Mathematics", "Science", "3 Years"),
                createCourse("BA English", "Arts", "3 Years")
        ));
    }

    private Course createCourse(String courseName, String dept, String duration) {
        Course course = new Course();
        course.setCourseName(courseName);
        course.setDept(dept);
        course.setDuration(duration);
        return course;
    }
}
