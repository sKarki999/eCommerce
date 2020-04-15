package com.codecrush.ecommerce.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.codecrush.ecommerce.entity.ProductCategory;

/*
 * to override the rest end points. use
 * @RepositoryRestResource(collectionResourceRel=" ", path=" ")
 * collectionResourceRel => Name of Json Entry,
 * path => /name_specified
 */

@CrossOrigin("http://localhost:4200")
@RepositoryRestResource(collectionResourceRel="productCategory", path="product-category")
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Long>{

	
	
}
