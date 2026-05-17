package com.cashy.service;

import com.cashy.dto.CategoryRequest;
import com.cashy.dto.CategoryResponse;
import com.cashy.entity.Category;
import com.cashy.entity.User;
import com.cashy.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserService userService;

    private static final String CATEGORY_NOT_FOUND = "Category not found: %d";
    private static final String CATEGORY_NAME_TAKEN = "Category name already exists: %s";
    private static final String ACCESS_DENIED = "Access denied";

    public List<CategoryResponse> getCategories() {
        User user = userService.getCurrentUser();
        return categoryRepository.findByUser(user).stream()
                .map(c -> new CategoryResponse(c.getId(), c.getName()))
                .toList();
    }

    public CategoryResponse createCategory(CategoryRequest request) {
        User user = userService.getCurrentUser();
        if (categoryRepository.existsByNameAndUser(request.getName(), user)) {
            throw new IllegalArgumentException(String.format(CATEGORY_NAME_TAKEN, request.getName()));
        }
        Category category = new Category();
        category.setName(request.getName());
        category.setUser(user);
        Category saved = categoryRepository.save(category);
        return new CategoryResponse(saved.getId(), saved.getName());
    }

    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        User user = userService.getCurrentUser();
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(String.format(CATEGORY_NOT_FOUND, id)));
        if (!category.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException(ACCESS_DENIED);
        }
        category.setName(request.getName());
        Category saved = categoryRepository.save(category);
        return new CategoryResponse(saved.getId(), saved.getName());
    }

    public void deleteCategory(Long id) {
        User user = userService.getCurrentUser();
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(String.format(CATEGORY_NOT_FOUND, id)));
        if (!category.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException(ACCESS_DENIED);
        }
        categoryRepository.delete(category);
    }

    public Category findById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(String.format(CATEGORY_NOT_FOUND, id)));
    }
}
